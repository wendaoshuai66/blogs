# KOA 源码的阅读

一直对 Node 非常感兴趣，最近阅读了一下 KOA 的源码

## Koa 的源码目录

koa 库源码核心很简单，就 4 个核心的 js 文件和 1 个控制 middleware 执行顺序的库 koa-compose。

![](https://wendaoshuai66.github.io/study/note/images/kao.png)

### request.js & response.js

这两个文件主要是对原生 node 返回的对象的一些封装。

以 request.js 为例

```plain
module.exports = {
  get header() {
    return this.req.headers;
  },

  /**
   * Set request header.
   *
   * @api public
   */

  set header(val) {
    this.req.headers = val;
  },

  /**
   * Return request header, alias as request.header
   *
   * @return {Object}
   * @api public
   */

  get headers() {
    return this.req.headers;
  },

  /**
   * Set request header, alias as request.header
   *
   * @api public
   */

  set headers(val) {
    this.req.headers = val;
  },
}
```

封装后，就可以使用 this.request.header() 获取所有的 header 了。

### context.js

context.js 主要是封装当前上下文的方法与属性

核心部分是使用了委托，将 response 和 request 都委托到 context 上

```plain
delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

/**
 * Request delegation.
 */

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .access('accept')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('URL')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');
```

通过委托以后，就可以通过 this.ctx.body 访问到 this.response.body

### koa-compose 库

koa-compose 接收一个 middleware 的集合，并返回一个函数用来执行所有 middleware。

示例代码中的 middlewareArray 执行过程可以用以下简易代码来理解一下：

```plain
let middleware = [];
middleware.push(function(next) {
    console.log(1)
    next()
    console.log(4)
})

middleware.push(function(next) {
    console.log(2)
    next()
    console.log(3)
})
middleware.push(function() {
    console.log(2)
})

function compose(middleware) {
    return function() {
        let f1 = middleware[0];
        f1(function next() {
            let f2 = middleware[1];
            f2(function next() {
                let f3 = middleware[2];
                f3()
            })
        })
    }
}
compose(middleware)()
```

所以代码执行的顺序是洋葱式的代码。

```plain

//promsie
function compose(middleware) {
  return function(context, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      // 如果在一个 middleware 中调用了 2 次 next 方法，则会报错
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

### application.js

application.js 主要是封装 use 方法和 listen 方法。

```plain
import compose from 'koa-compose';
// 事件处理库，可使用app.on('xxx') 触发自定义事件
import Emitter from 'events';

class Application extends Emitter {
  listen(...args) {
    //   创建http服务器
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  callback() {
    // 调用 koa-compose 返回一个中间件执行函数。
    const fn = compose(this.middleware);
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }

  handleRequest(ctx, fnMiddleware) {
    const handleResponse = () => respond(ctx);
    return fnMiddleware(ctx)
      .then(handleResponse)
      .catch(onerror);
  }

  createContext(req, res) {
    //   创建context
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  use(fn) {
    // 将中间件加入数组中
    this.middleware.push(fn);
    return this;
  }
}
```

在 craeteServer 结束后，会触发 callback。

在 cakllback 中调用 compose 将 middleware 传入进去。

当监听到请求的时候，就会按照顺序执行 middleware
