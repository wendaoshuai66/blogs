# Webpack 系列手写模块打包代码

## loader

在手写模块打包代码之前，先学一学如何写一个 loader

Loader 就像一个翻译员，能将源文件经过转化后输出新的结果，并且一个文件还可以
链式 地经过多个翻译员翻译。 以处理 scss 文件为例:

• 先将 scss 源代码提交给 sass-loader，将 scss 转换成 CSS;

• 将 sass-loader 输出的 css 提交给 css-loader 处理，找出 css 中依赖的资源、压缩
css 等；

• 将 css-loader 输出的 css 提交给 style-loader 处理，转换成通过脚本加载的 JavaScript 代码。

### 分析一下 markdown-loader

https://github.com/peerigon/markdown-loader/blob/master/index.js

```plain
"use strict";

//分析mark源码工具
const marked = require("marked");
//webpack提供的工具集 收集用户options等 也就是webpack.**.js里module.export的配置等
const loaderUtils = require("loader-utils");

//提供一个对外的函数
module.exports = function (markdown) {
    // merge params and default config
    const options = loaderUtils.getOptions(this);
    // 当前loader开启缓存
    this.cacheable();
    // 用户option--->mark
    marked.setOptions(options);
    //string
    return marked(markdown);
};
```

### 实现一个 loader


```plain
const loaderUtils = require("loader-utils");
//this 代表当前loader类
module.exports = function(contant) {
    // merge params and default config
    
    const options = loaderUtils.getOptions(this);
    //拿到options
    console.log('前置的钩子函数' + this.data.value)
    console.log('🌶️配置文件' + options.data)
    //为了避免使用正则过于复杂 ---->ast🌲
    //content.replace('const','var')
    //关 闭该 Loader 的缓存功能,默认缓存是开的
    this.cacheable(false);
    return contant + "console.log(1111)";
};

//挂载前置的钩子

module.exports.pitch = function(r, prerequest, data) {
    data.value = "刘帅🏮"
}
```

```plain
const path = require('path');
module.exports = {
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: path.resolve('./loader/index.js'),
                options: {
                    data: "🍌自定义配置项"
                }
            }
        }]
    }
}
```

### 补充

Loader 有同步和异步之分，上面介绍的 Loader 都是同步的 Loader，因为它们的转换流 程都是同步 的，转换完成后再返回结果。但在某些场景下转换的步骤只能是异步完成的，例 如我们需要 通过网络请求才能得出结果，如果采用同步的方式，则网络请求会阻塞整个构建， 导致 构建非常缓慢。
如果是异步转换，则我们可以这样做:

```plain
module . exports = function (source) {
//告诉 Webpack 本次转换是异步 的， Loader 会在 callback 中回调结果
var callback= this.async() ;
someAsyncOperation(source, function(err, result , sourceMaps, ast) {
//通过 callback 返回异步执行后的结果
callback (err, result, sourceMaps, ast); } ) 
}
```

处理二进制数据

在默 认情况下， Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串。但在某 些场景下 Loader 不会处理文本文件，而会处理二进制文件如 file-loader，这时就需要 Webpack 为 Loader 传入二进制格式的数据。为此，我们需要这样编写 Loader:

```plain
module. exports = function (source) {
//在 exports.raw=== true 时， 
//Webpack 传给 Loader 的 source 是 Buffer 类型的 

source instanceof Buffer === true;
//Loader 返回的类型也可以是 Buffer 类型的
//在 exports .raw !== true 时， Loader 也可以返回 Buffer 类型的结果
return source;
// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据 module .exports . raw = true;
```

## Webpack 打包后文件分析

为了更好的理解 webpack 模块打包机制，我们先来看一下 webpack 打包后的文件。

对刚才打包后的文件分析

```plain

(function(modules) { // webpackBootstrap
    // The module cache
    //模块的缓存
    var installedModules = {};

    // The require function

    function __webpack_require__(moduleId) {

        // Check if module is in cache
        //检查存模块，是否以缓存住模块
        if (installedModules[moduleId]) {

            return installedModules[moduleId].exports;

        }
        // Create a new module (and put it into the cache)
        //创建新的缓存对象
        var module = installedModules[moduleId] = {

            i: moduleId,

            l: false,

            exports: {}

        };

        // Execute the module function
        //执行入口函数
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // Flag the module as loaded

        // Return the exports of the module

        return module.exports;

    }
    // Load entry module and return exports
    //加载入口
    return __webpack_require__(__webpack_require__.s = "./src/index.js");

})
({

    "./src/index.js": (function(module, exports) {

        console.log("我是入口文件");
        console.log(1111)
    })


});

```

上述代码主要由以下几个部分组成：

最外层是一个自执行函数

自执行函数会传递一个 modules 参数，这个参数是一个对象，{key: 文件路径,value: 函数}，value 中的函数内部是打包前模块的 js 代码。

内部自定义一个 __webpack_require__ 执行器，用来执行导入的文件，并导出 exports。


实现了 common.js 规范，不发网络请求，把包打包到了自己身上
eval 编译快执行快

新建 src/async1.js

```plain

//async1.js
const async1 = 'webpack源码分析async1';
export default async1;
```
//抽离出的 main.js

```plain
  (function(modules) {

      var installedModules = {};

      function __webpack_require__(moduleId) {

          if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
          }
          var module = installedModules[moduleId] = {
              exports: {}
          };
          modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);


          return module.exports;
      }

      return __webpack_require__("./src/index.js");
  })
  ({

      "./src/async1.js":

          (function(module, __webpack_exports__, __webpack_require__) {
          const async = `hello nihao`;
          __webpack_exports__["default"] = (async)

      }),

      "./src/index.js":

          (function(module, __webpack_exports__, __webpack_require__) {
          var _async1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/async1.js");
          //import 就相当于 var async1 = __webpack_require__("./src/async1.js");
          console.log(_async1__WEBPACK_IMPORTED_MODULE_0__["default"])

      })

  });
```

## 手写一个模块打包器


### 整体流程分析

1.读取入口文件

2.将内容转换为 ast 树

3.深度遍历语法树，找到所有的依赖，并加入到一个数组中。

4.将 ast 树转换为可执行 js 的代码

5 编写__webpack_require__函数，根据入口文件自动执行完所有的依赖。


根据上述步骤开始写代码😊

代码层分为四层


一层读取入口文件，将内容转化为 ast（抽象语法树）树，遍历语法树并将 import xxx from './xxx.js' 转化为 var xxx = __webpack_require__("xxx"); 将 export default xxx 转化为 __webpack_exports__["default"] = xxx 


```plain
function parse(filename) {
    const contant = fs.readFileSync(filename, 'utf-8');
    //将字符串转换为ast抽象语法树
    const ast = parser.parse(contant, {
            sourceType: 'module'
        })
        // console.log(ast)
    const code = new MagicString(contant);
    //遍历抽象语法树
    traverse(ast, {
        ExportDeclaration({
            node
        }) {
            const {
                start,
                end,
                declaration,
            } = node;
            code.overwrite(start, end,
                `__webpack_exports__["default"]=${declaration.name}`
            )
        },
        ImportDeclaration({
            node
        }) {
            // console.log('🌟🌟', node)
            const {
                start,
                end,
                specifiers,
                source
            } = node;
            const newFile = "./src/" + path.join(source.value) + '.js';
            code.overwrite(start, end,
                `var ${specifiers[0].local.name}=__webpack_require__("${newFile}").default`
            )
        }
    })
    const _code = code.toString()
}

```

二层 深度遍历语法树，找到所有依赖并放入数组中，生成所有资源对象数组。


```plain
    //  全局的依赖项
const dependencies = [];

function parse(filename) {
    const contant = fs.readFileSync(filename, 'utf-8');
    //获取当前的依赖
    const garphArray = [];
    //将字符串转换为ast抽象语法树
    const ast = parser.parse(contant, {
            sourceType: 'module'
        })
        // console.log(ast)
    const code = new MagicString(contant);
    //遍历抽象语法树
    traverse(ast, {
        ExportDeclaration({
            node
        }) {
            const {
                start,
                end,
                declaration,
            } = node;
            code.overwrite(start, end,
                `__webpack_exports__["default"]=${declaration.name}`
            )
        },
        ImportDeclaration({
            node
        }) {
            // console.log('🌟🌟', node)
            const {
                start,
                end,
                specifiers,
                source
            } = node;
            const newFile = "./src/" + path.join(source.value) + '.js';
            code.overwrite(start, end,
                `var ${specifiers[0].local.name}=__webpack_require__("${newFile}").default`
            )
            garphArray.push(newFile);
        }
    })
    const _code = code.toString()
    dependencies.push({
        filename,
        _code
    });
    return garphArray;
}
let garphArray = parse(entryPonint);
//对其进行递归
for (let item of garphArray) {
    parse(item)
}
console.log(dependencies)

```

三层 封装自执行函数，创建 __webpack_require__ 方法，处理文件相互依赖，该处引入 ejs 对模版处理

```plain
const template = `
  (function (modules) {

      var installedModules = {};

      function __webpack_require__(moduleId) {
          if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
          }
          var module = installedModules[moduleId] = {
              exports: {}
          };
          modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

          return module.exports;
      }
      return __webpack_require__("${entryPonint}");
  })
  ({

    <% for(var i = 0; i < dependencies.length; i++){ %>
        "<%-dependencies[i]["filename"]%>":
        (function (module, __webpack_exports__, __webpack_require__) {
               <%-dependencies[i]["_code"]%>
            }),
    <% } %>
  });
`;

let result = ejs.render(template, {
    dependencies
})
```

四层 将其 result 模版 写出

```plain
fs.writeFileSync("./dist/main.js", result)
```

### 相关链接

[git 仓库](https://github.com/wendaoshuai66/diy-webpack)





