# vue 原理解析之准备工作

## 认识 Flow


[Flow](https://flow.org/en/docs/getting-started/) 是 facebook 出品的 JavaScript 静态类型检查工具。Vue.js 的源码利用了 Flow 做了静态类型检查，所以了解 Flow 有助于我们阅读源码。

 ### Flow 的工作方式

通常类型检查分成 2 种方式：

* 类型推断：通过变量的使用上下文来推断出变量类型，然后根据这些推断来检查类型。
* 类型注释：事先注释好我们期待的类型，Flow 会基于这些注释来判断。

#### 类型推断

它不需要任何代码修改即可进行类型检查，最小化开发者的工作量。它不会强制你改变开发习惯，因为它会自动推断出变量的类型。这就是所谓的类型推断，Flow 最重要的特性之一。

通过一个简单例子说明一下：

```plain
/*@flow*/

function split(str) {
  return str.split(' ')
}

split(11)

```

Flow 检查上述代码后会报错，因为函数 split 期待的参数是字符串，而我们输入了数字。


#### 类型注释


如上所述，类型推断是 Flow 最有用的特性之一，不需要编写类型注释就能获取有用的反馈。但在某些特定的场景下，添加类型注释可以提供更好更明确的检查依据。

考虑如下代码：

```plain

/*@flow*/

function add(x, y){
  return x + y
}

add('Hello', 11)

```

Flow 检查上述代码时检查不出任何错误，因为从语法层面考虑， + 既可以用在字符串上，也可以用在数字上，我们并没有明确指出 add() 的参数必须为数字。

在这种情况下，我们可以借助类型注释来指明期望的类型。类型注释是以冒号 : 开头，可以在函数参数，返回值，变量声明中使用。


### 总结

通过对 Flow 的认识，有助于我们阅读 Vue 的源码，并且这种静态类型检查的方式非常有利于大型项目源码的开发和维护。类似 Flow 的工具还有如 TypeScript，感兴趣的同学也可以自行去了解一下。

## 源码架构

vue 一直以简单，快速著称，也自称为渐进式框架今天我们来分析一下 vue 的源码，这样我们也能了解其中的思想，帮助我们在工作中很好的应用和解决问题。当然我们并不可能把源码很细致的分析个遍，那样没什么意义。
附上 git 仓库[vue 源码地址](https://github.com/vuejs/vue)。

我们看一下 vue 源码的核心目录方便大家去对应查找

![](https://wendaoshuai66.github.io/study/note/images/vue1.png)

![](https://wendaoshuai66.github.io/study/note/images/vue2.png)

### compiler

compiler 目录包含 Vue.js 所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。

编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

### core

core 目录包含了 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。

这里的代码可谓是 Vue.js 的灵魂，也是我们之后需要重点分析的地方。




core 文件作为 Vue.js 核心文件夹

1.compents 
 

### platform

Vue.js 是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

我们会重点分析 web 入口打包后的 Vue.js，对于 weex 入口打包的 Vue.js，感兴趣的同学可以自行研究。


### server

Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。

服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序

### sfc

通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。

这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

### shared

Vue.js 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

### 总结

这样的目录设计让代码的阅读性和可维护性都变强，是非常值得学习和推敲的。

![](https://wendaoshuai66.github.io/study/note/images/vue5.png)



