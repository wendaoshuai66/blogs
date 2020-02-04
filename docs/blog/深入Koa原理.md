# 深入 Koa 原理

通过上一篇文章，我们已经了解到 Koa 是个非常精简的框架，实现起来难度并不大，这一章我们就一起来手写一个 koa 吧！ 

编写 application 文件

编写 request 和 response 文件

编写 context 文件

## 编写 application 文件

Application 文件是 koa 的核心，所有逻辑都会经过该文件调度。

### 开启 Web 服务器

* 首先，koa 作为一个 web 服务器框架，开启一个 web 服务器是最基本的方法。

* 封装 listen 方法开启服务器（底层调用 http.createServer）。

* 在 http.createServer 回调函数中调用 callback 方法，执行中间件。

* 中间件执行不报错，会调用 respond 方法，对返回及结果进行操作。

* 中间件执行报错，会调用 onerror 方法，输出错误信息到客户端。


```plain
//node 常见的事件模型就是我们常见的订阅发布模式，核心API采用的就是异步事件驱动
//所有可能触发事件的对象都是一个继承自Emitter类的子对象，简单来说就是Node帮我们实现了订阅发布模式
const Emitter = require('events');
const http = require('http');
const request = require("./request");
const response = require("./response")
const context = require('./context')
const Stream = require('stream');
class Application extends Emitter {
    constructor() {
        super();
        this.middlewares = [];
        this.request = Object.create(request);
        this.response = Object.create(response);
        this.context = Object.create(context)
    }
    callback() {
        return (req, res) => {
            let fn = this.compose();
            const ctx = this.createContext(req, res);
            let respond = () => this.resposeBody(ctx)
            let error = (err) => this.onerror(err, ctx)
            return fn(ctx).then(respond).catch(error)
        }
    }
    use(middleware) {
        this.middlewares.push(middleware)
            //链式调用
        return this;
    }
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

}
module.exports = Application;
```

## 创建 context 代理请求和响应

为了更方便用户的操作，koa 将请求和响应两个对象进行了代理，通过创建 context 对象，掌管整个请求和响应。


```plain
class Application extends Emitter {
    createContext(req, res) {
        //koa就是对node底层的转接
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }
  

}
module.exports = Application;
```

## 封装中间件执行逻辑

koa-compose 接收一个 middleware 的集合，并返回一个函数用来执行所有 middleware。代码执行的顺序是洋葱式的代码。


```plain
class Application extends Emitter {
      compose() {
        if (!Array.isArray(this.middlewares)) throw new TypeError("middlewares must be array")
        for (let fn of this.middlewares) {
            if (typeof fn !== "function") throw new TypeError("middleware must be composed of function")
        }
        return async(ctx) => {
            let next = async() => {
                return Promise.resolve();
            }


            let len = this.middlewares.length - 1;
            for (let i = len; i >= 0; i--) {
                let currentMiddle = this.middlewares[i];
                next = creatNext(currentMiddle, next)
            }
            await next();

            function creatNext(currentMiddle, nextMiddle) {
                return async() => {
                    await currentMiddle(ctx, nextMiddle);
                }
            }
        }
    }
 
   

}
module.exports = Application;
```

## 中间件执行完成后的操作


中间件执行完成后会执行以下方法。

* responseBody 向客户端输出数据之前，进行数据的处理。
* onerror 如果中间件出错，则做出对应操作。


```plain


class Application extends Emitter {
   
    onerror(err, ctx) {
        console.lof(ctx)
        if (err.code == "ENOENT") {
            ctx.status = 404;
        } else {
            ctx.status = 500;
        }
        let msg = err.message || "koa error";
        ctx.res.end(msg);
        this.emit("error", err);
    }
    resposeBody(ctx) {
        const res = ctx.res;
        let body = ctx.body;

        if (Buffer.isBuffer(body)) return res.end(body);
        if ('string' == typeof body) return res.end(body);
        if (body instanceof Stream) return body.pipe(res);
        body = JSON.stringify(body);
        if (!res.headersSent) {
            ctx.length = Buffer.byteLength(body);
        }
        res.end(body);
    }
    
   
  

}
module.exports = Application;
```

## 编写 request 和 response 文件

Request 和 Response 文件是对请求和响应的一层浅封装，提供一套更加方便的请求响应处理方法。

### 编写 request 文件


```plain
var url = require('url');

// 封装源生 request 操作
// 例如：增加quert方法，快速定位参数。headers 方法快速扩区headers字段
module.exports = {
  get query() {
    return url.parse(this.req.url, true).query;
  },
  get url() {
    return this.req.url;
  }
};
```

### 编写 response 文件

```plain
// 封装源生 response 操作
// 例如：body 方法，统一返回数据到客户端。socket 方法，快速获取 res 中的 socket 对象。
module.exports = {
    get body() {
        return this._body;
    },
    set body(data) {
        this._body = data;
    },
    get status() {
        return this.res.statusCode;
    },
    set status(statusCode) {
        if (typeof statusCode !== "number") {
            throw new TypeError("statusCode must be number")
        }
        this.res.statusCode = statusCode;
    }
}
```

## 编写 context 文件

在 context 文件中代理 request 和 response。

* 使用__defineSetter__方法代理 set 请求。
* 使用__defineGetter__方法代理 get 请求。

```plain
//负责代理，把上面的方法代理到context上面

let proto = {};

//老式的代理
//__defineGetter__
//__defineSetter__
function delegateGet(property, name) {
    proto.__defineGetter__(name, function(val) {
        return this[property][name];
    })
}

function delegateSet(property, name) {
    proto.__defineSetter__(name, function(val) {
        this[property][name] = val
    })
}
let requeSet = [];
let requeGet = ["query"];
let responseSet = ["body", "status"];
let responseGet = responseSet;
requeSet.forEach(ele => {
    delegateSet("request", ele)
})
requeGet.forEach(ele => {
    delegateGet("request", ele)
})
responseSet.forEach(ele => {
    delegateSet("response", ele)
})
responseGet.forEach(ele => {
    delegateGet("response", ele)
})
module.exports = proto;
```

## 总结

仅供参考

![](https://wendaoshuai66.github.io/study/note/images/koaansy.png)

## 相关链接

[diy-koa 代码仓库](https://github.com/wendaoshuai66/diguikoa)
