# 初探 System.js

## ES6 系列的兴起

可以说 ECMAScript6 是 JavaScript 历史上最大的一次变革，ES6 的到来为 JavaScrip 带来了面向对象的特性，带来了许多新的语法，也让这门解释性语言有了它该有的样子。总的来说，带来了无限好处。带来好处的同时也让我们在用的时候有了担忧，用户的角度是广阔的，开发者无法提前预知用户用的浏览器到底支持不支持 ES6 的语法，因此在开发过程中就有个阻碍。babel 的兴起让 ES6 的开发者大显身手，但是它是把 ES6 的语法编译成 ES5 的语法，也就是浏览器支持的语法。我们要知道在 ES6 兴起的时候，V8 引擎是对 ES6 语法有了极大的优化的，滥用了 babel 不就也放弃了这种优化吗？这使得 ES6 只让开发者更加便于开发，用户的角度上并没有体现出任何价值，而且 babel 编译出的庞大的 ES5 文件，在用户方法还起到了负面作用。那这到底怎么办呢？接下来主角登场。


## 最优的解决方案


一种的 ES6 代码写的文件，一种的 babel 编译成 ES5 的文件。在浏览器中执行的时候，判断浏览器是否支持 ES6，如果支持就加载 ES6 的文件，如果不支持就加载 ES5 的文件，这样就良好的解决问题。那么用什么判断呢？

### type=’module’

在 script 标签里面我们都知道有 type 属性指定文件的类型(type=’text/script’)，这个属性还有一个值那就是 module 和 nomodule。

1.module：表示当浏览器支持 ES6 的时候执行的 JavaScript 代码

2.nomodule：表示当浏览器不支持 ES6 的时候执行的 JavaScript 代码。


我们在项目中创建 index 文件来写这样一段代码：当我们在写好 ES6 的代码的时候不要直接调用，[阮大佬的 import](http://es6.ruanyifeng.com/#docs/module)，用 ES6 import export 的形式导出


```plain
class Test {
    constructor(){
        this.name = 'zhangsan';
    }
    action(){
        console.log(this.name);
    }
}
export default Test;
```


在 html 中：使用 ES6 的动态 import 的形式加载进来。

```plain
<script type='module'>
    import('test.js').then(_=>{
        console.log('我支持modul');
        new _.default().action();
    })
</script>
```


打开 Chrom 浏览器会发现有这样的一句输出


type=‘nomodule’的情况下我们执行 babel 编译


###使用 babel 编译

安装 babel

```plain
npm install –save-dev @babel/core @babel/cli @babel/preset-env
```


在项目根目录创建.babelrc 文件,内容如下

```plain

{
    "presets" : ["@babel/preset-env"]
}

```

在 package.json 配置

```plain

"scripts": {
    "build": "babel ./assets/scripts/index.js -o ./assets/scripts/index-bundle.js"
  },
```

使用命令进行编译

```plain
npm run build
```

index-bundle.js 文件内容如下：


```plain
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Test =
/*#__PURE__*/
function () {
  function Test() {
    _classCallCheck(this, Test);

    this.name = 'zhangsan';
  }

  _createClass(Test, [{
    key: "action",
    value: function action() {
      console.log(this.name);
    }
  }]);

  return Test;
}();

var _default = Test;
exports["default"] = _default;

```

我们发现第二行使用的是模块加载 export，require 之类的东西，但是我们浏览器中并没有这些东西，于是我们采用一个模块加载器来加载这个东西。

### System.js

System.js 是一个万能模块加载器，任何使用模块加载的都可以使用它来进行加载。用法也非常简单。[Systemjs 的 github](https://github.com/systemjs/systemjs)。我们采用 script 标签的形式把这个东西加载进来。并用官网的方式加载 test.js

需要注意的是：Systemjs 必须指定 nomodule，和 ES5 文件保持一致才可以。由于我们用于测试和最新的 Chrome 浏览器肯定是支持 module 的，所以先把 nomodule 改成 module 来用于测试


```plain
 
 <script type="module" src="https://cdn.staticfile.org/systemjs/3.0.0/system.js"></script>
 <script type="module">
    System.import('test.js').then(_=>{
        new _.default().action();
    })
 </script>
```

打开浏览器见证奇迹



哎呀报错了，很懵逼，很焦虑，为什么会报错呢？ 因为 babel 编译的 es5 的语法采用的模块加载器是 export 加载，并没有使用 SystemJS 的加载方式。可以通过 babel 插件来把 babel 的模块加载方式改成 SystemJS 的加载方式。

### 最后的希望

#### 我们在 npm 上找到这个插件@babel/plugin-transform-modules-systemjs 并安装

```plain
npm install @babel/plugin-transform-modules-systemjs –sav-dev
```

在.babelrc 里面添加上 plugins

```plain
{
    "presets" : ["@babel/preset-env"],
    "plugins" : ["@babel/plugin-transform-modules-systemjs"]
}
```

#### [或者不用装包](https://babeljs.io/docs/en/babel-preset-env)直接设置.babelrc


```plain
{
    "presets": [
        [
          "@babel/preset-env",
          {
            "modules": "systemjs"
          }
        ]
      ]
}
```

此时使用上面 babel 语法进行编译，文件内容如下


```plain
System.register([], function (_export, _context) {
  "use strict";

  var Test;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      Test =
      /*#__PURE__*/
      function () {
        function Test() {
          _classCallCheck(this, Test);

          this.name = 'zhangsan';
        }

        _createClass(Test, [{
          key: "action",
          value: function action() {
            console.log(this.name);
          }
        }]);

        return Test;
      }();

      _export("default", Test);
    }
  };
});

```


在使用 type=‘module’和和 type=‘nomodule’的时候，一定要把 SystemJS 的 type 设置成 nomodule，与 ES5 语法统一。

等等还没完。。。

以上的加载操作，都是我们手动进行的，包括 babel 编译，type 属性值的添加。后续使用 webpack 的话可以实现一键部署。别走开，后续更加精彩。





