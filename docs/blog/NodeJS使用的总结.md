# NodeJS 使用的总结

## 首先提出一个问题，大家在开发 Node.js 的时候都知道异步的嵌套非常麻烦，有人叫回调地狱也有人叫回调黑洞，那么问题来了，如何解决改问题：

##### 回答该问题之前可以先说说什么是异步编程

在我们开发过程中经常会遇到如何表达和控制持续一段时间的程序行为。比如在等待用户输入，从数据库或文件中请求数据，通过网络发送数据并等待响应，或者是固定时间间隔内重复执行任务（比如动画）等，在诸如此类 的场景中，程序都需要管理这段时间间隙的状态。事实上，程序中现在运行的部分和将来运行的部分之间的关系就是异步编程的核心。

##### 再说说什么是事件循环

JavaScript 引擎并不是独立运行的，它运行在宿主环境中，现在宿主环境大部分 Web 浏览器，Node.js 这样的工具进入服务器领域，从机器人到电灯泡。

这些环境都有一个共同“点”，即它们都提供了一种机制来处理程序中多个块的执行，且执行每块时调用 JavaScript 引擎，这种机制被称为事件循环。换句话说，JavaScript 引擎本身并没有时间的概念，只是一个按需执行 JavaScript 任意代码 片段的环境。“事件”(JavaScript 代码执行)调度总是由包含它的环境进行。

setTimeout(..) 并没有把你的回调函数挂在事件循环队列中。它所做的是设 定一个定时器。当定时器到时后，环境会把你的回调函数放在事件循环中，这样，在未来 某个时刻的 tick 会摘下并执行这个回调。

```plain
setTimeout(function() {
    console.log(1)
}, 100)

setImmediate(function() {
    console.log(2)
})

process.nextTick(() => {
    console.log(3)
})
new Promise((resolve, reject) => {
    console.log(4)
    resolve(4)
}).then(() => {
    console.log(5)
})
console.log(6)
//执行顺序 4  6 3 5 2 1
setTimeout(function() {
    console.log(1)
}, 0)

setImmediate(function() {
    console.log(2)
})

process.nextTick(() => {
    console.log(3)
})
new Promise((resolve, reject) => {
    console.log(4)
    resolve(4)
}).then(() => {
    console.log(5)
})
console.log(6)
//执行顺序 4 6 3 5 1 2
```

1⃣️.Express 我们可以 Promise / Defferred 采用模式的诸多类库，如 Q.js Step wind 


2⃣️.ES6 原生的 Generator 函数 + Promise 对象 KOA1 时代的代表

3⃣️.Async await 函数 KOA2 推崇 的办法代码如下：

```plain
var fetch = require('node-fetch'); 
var fetchData = async function () { 
var r1 = await fetch('https://api.github.com/users/github'); 
var json1 = await r1.json(); console.log(json1.bio); }; 
fetchData();
```

实现 async/await 中的 async 函数

```plain
function spawn(genF) {
    return new Promise((reslove, reject) => {
        const gen = genF();
        let next;

        function step(nextF) {
            try {
                next = nextF();
            } catch (e) {
                return reject(e)
            }
            if (next.done) {
                return reslove(next.value)
            }
            Promise.resolve(next.value).then(function(v) {
                step(function() {
                    return gen.next(v)
                });
            }, function(e) {
                step(function() {
                    return gen.next(e)
                });
            })
        }
        step(function() {
            return gen.next(undefined)
        })
    })
}
```

## Node.js 基础


根据 Node.js 官网的定义：Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。


大白话的理解就是：Node.js 不是一种框架也不是一种语言，它是基于 Chrome V8 引擎的 JavaScrip 运行时的环境，同时结合 Libuv 扩展了 Javascript 功能，使之支持 io fs 等特性，使得 JavaScript 能够同时具有 DOM 操作（浏览器）和 IO，文件读写，操作数据库等能力。

Node.js 主要分为四大部分，Node Standard Library，Node Bindings，V8，Libuv，架构图如下:



![](https://wendaoshuai66.github.io/study/note/images/node结构.png)

##### Node Standard Library 是我们每天都在用的标准库，如 Http Buffer 模块

##### Node Bindings 是沟通 JS 和 C++桥梁，封装 V 8 和 Libuv 的细节，向上层提供基础 API 的服务

##### 这一层是支撑 Node.js 运行的关键，由 C/C++ 实现。


>V8 是 Google 开发的 Javascript 的引擎，提供 Javascript 运行环境，主要是将 JS 代码编译成原生机器码，可以说是 Node.js 的发动机
>
>Libuv 是专门为 Node.js 开发的一个封装库，提供跨平台的异步 I/O 能力.
>
>C-ares：提供了异步处理 DNS 相关的能力。
>
>http_parser、OpenSSL、zlib 等：提供包括 http 解析、SSL、数据压缩等其他的能力
>


### 事件循环

开题已经为事件循环做了铺垫，异步编程是 Node.js 的一大特色，掌握好 Node.js 的异步编程是每个 Node.js 开发者必备的技能。下一步进一步探索

Node 采用 V8 作为 JavaScript 的执行引擎，同时使用 libuv 实现事件驱动式异步 I/O。其事件循环就是采用了 libuv 的默认事件循环。

下面通过图探索 Node.js 对异步 IO 的实现


![](https://wendaoshuai66.github.io/study/note/images/libuv.png)

1⃣️ 应用程序先将 JS 代码经 V8 转换为机器码。

2⃣️ 通过 Node.js Bindings 层，向操作系统 Libuv 的事件队列中添加一个任务。

3⃣️ Libuv 将事件推送到线程池中执行。

4⃣️ 线程池执行完事件，返回数据给 Libuv。

5⃣️ Libuv 将返回结果通过 Node.js Bindings 返回给 V8。

6⃣️ V8 再将结果返回给应用程序。

##### Event Loop 事件循环，Thread Pool 线程池都是由 Libuv 提供，Libuv 是整个 Node.js 运行的核心。


#### Libuv 实现了 Node.js 中的 Eventloop ，主要有以下几个阶段：


![](https://wendaoshuai66.github.io/study/note/images/libuv1.png)

上图中每一个阶段都有一个先进先出的回调队列，只有当队列内的事件执行完成之后，才会进入下一个阶段。

+ timers：执行 setTimeout 和 setInterval 中到期的 callback。
+ pending callbacks：上一轮循环中有少数的 I/O callback 会被延迟到这一轮的这一阶段执行。


   执行一些系统操作的回调，例如 tcp 连接发生错误。
   
+ idle, prepare：仅内部使用。
+ poll：最为重要的阶段，执行 I/O callback(node 异步 api 的回调，事件订阅回调等)，在适当的条件下会阻塞在这个阶段。


如果 poll 队列不为空，直接执行队列内的事件，直到队列清空。
如果 poll 队列为空。
如果有设置 setImmediate，则直接进入 check 阶段。
如果没有设置 setImmediate，则会检查是否有 timers 事件到期。
如果有 timers 事件到期，则执行 timers 阶段。
如果没有 timers 事件到期，则会阻塞在当前阶段，等待事件加入。

+ check：执行 setImmediate 的 callback。
+ close callbacks：执行 close 事件的 callback，例如 socket.on("close",func)

除此之外，Node.js 提供了 process.nextTick(微任务，promise 也一样) 方法，在以上的任意阶段开始执行的时候都会触发。

##### Event Loop 是一个很重要的概念，指的是计算机系统的一种运行机制。

##### Libuv 在 Linux 下基于 Custom Threadpool 实现。

##### Libuv 在 Windows 下基于 IOCP 实现。

### Node.js 内存管理与优化

Node.js 是单线程的，所以必须保证这个线程持续稳定，最容易导致 Node.js 应用程序挂掉的因素是内存泄漏。常见的内存泄漏：

+ 无限增长的数组。
+ 无限制设置对象的属性和值。

+ 任何模块的私有变量都是永驻的。

+ 循环，无 GC 机会。

+ 队列消费不及时。

+ 全局变量太多。

Node.js 采用 V8 的 分代式垃圾回收策略，将内存分为新生代内存和老生代内存。

+ 新生代内存通过 Scavenge 算法，将内存分为 From 空间 和 To 空间，初始时 From 空间存放所有对象，To 空间空闲。在一次垃圾回收时，清除 From 空间中没有使用的对象，然后将 To 空间和 From 交换。
+ 老生代内存通过 Mark-Sweep 和 Mark-compact，标记清除和移动清除。标记没有使用的内存空间，标记完毕后进行统一清除，清除后为了避免内存空间不连续，会将已使用的内存连在一起，放在队列的一端，然后清除另一端的所有内存空间。

![](https://wendaoshuai66.github.io/study/note/images/gc1.png)

![](https://wendaoshuai66.github.io/study/note/images/gc2.png)

![](https://wendaoshuai66.github.io/study/note/images/gc3.png)

这⾥里需要注意， Buffer 类型需要处理理的是⼤大量量的⼆二进制数据，假如⽤用⼀一点就向系统去申请，则会造成 频繁的向系统申请内存调⽤用，所以 Buffer 所占⽤用的内存不不再由 V8 分配，⽽而是在 Node.js 的 C++ 层⾯面完 成申请，在 JavaScript 中进⾏行行内存分配。因此，这部分内存我们称之为堆外内存。

![](https://wendaoshuai66.github.io/study/note/images/gc4.png)


