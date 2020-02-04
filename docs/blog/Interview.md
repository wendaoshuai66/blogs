# 面试题积累 1

## Promsie.all 实现

记住一下几点

1.Promise.all 的返回值是一个 promise 实例

如果传入的参数为空的可迭代对象，Promise.all 会 同步 返回一个已完成状态的 promise

如果传入的参数中不包含任何 promise,Promise.all 会 异步 返回一个已完成状态的 promise (不包含 promise，意味着不会一直 pending 和 rejected )

其它情况下，Promise.all 返回一个 处理中（pending） 状态的 promise.

2.Promise.all 返回的 promise 的状态

如果传入的参数中的 promise 都变成完成状态，Promise.all 返回的 promise 异步地变为完成。

如果传入的参数中，有一个 promise 失败，Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成

在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组


```plain
Promise.all = function(prosmises) {
                if (!Array.isArray(prosmises)) {
                    throw new TypeError('You must pass to an array')
                }
                return new Promise(function(resolve, reject) {
                    var len = prosmises.length,
                        results = [],
                        count = len;
                    if (len == 0) {
                        resolve()
                    }

                    function resolves(inxdex) {
                        return function(value) {
                            resolveAll(inxdex, value)
                        }
                    }

                    function resolveAll(index, value) {
                        results[index] = value;
                        --count;
                        if (count == 0) {
                            resolve(results)
                        }
                    }

                    function rejects(value) {
                        reject(value)
                        return
                    }
                    for (let i = 0; i < len; i++) {
                        Promise.resolve(prosmises[i]).then(resolves(i), rejects)
                    }
                })
            }
```

## Promsie.race 实现

Promise.race 功能

Promise.race(iterable) 返回一个 promise，一旦 iterable 中的一个 promise 状态是 fulfilled / rejected ，那么 Promise.race 返回的 promise 状态是 fulfilled / rejected

```plain
let p = Promise.race([p1, p2, p3]);
```

只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

Promise.race 的特点

Promise.race 的返回值是一个 promise 实例

1.如果传入的参数为空的可迭代对象，那么 Promise.race 返回的 promise 永远是 pending 态
如果传入的参数中不包含任何 promise，Promise.race 会返回一个处理中（pending）的 promise
如果 iterable 包含一个或多个非 promise 值或已经解决的 promise，则 Promise.race 将解析为 iterable 中找到的第一个值。


```plain
Promise.race = function(promsies) {
            if (!Array.isArray(promsies)) {
                throw new TypeError('You must pass to an array')
            }
            return new Promise(function(resolve, reject) {
                var len = promsies.length,
                    result = [],
                    count = len;

                if (len === 0) {plainplainplainplain
                    //空的可迭代对象;
                    //用于在pending态
                } else {
                    function resolver(value) {
                        resolve(value)
                    }

                    function rejects(value) {
                        reject(value)
                        return
                    }
                    for (var i = 0; i < len; i++) {
                        Promise.resolve(promsies[i]).then(resolver, rejects)
                    }
                }
            })
        }

```


## 为啥 await 在 forEach 中不生效 


### 不知道你有没有写过类似的代码，反正以前我是写过


```plain
function test() {
	let arr = [3, 2, 1]
	arr.forEach(async item => {
		const res = await fetch(item)
		console.log(res)
	})
	console.log('end')
}
function fetch(x) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(x)
		}, 500 * x)
	})
}

test()
```

我当时期望的打印顺序是

```plain
3
2
1
end
```


结果现实与我开了个玩笑，打印顺序居然是

```plain
end
1
2
3
```


### 为什么

其实原因很简单，那就是 forEach 只支持同步代码。

我们可以参考下 Polyfill 版本的 forEach，简化以后类似就是这样的伪代码

```plain
while (index < arr.length) {
		// 也就是我们传入的回调函数
		callback(item, index)
}
```

从上述代码中我们可以发现，forEach 只是简单的执行了下回调函数而已，并不会去处理异步的情况。并且你在 callback 中即使使用 break 也并不能结束遍历

### 怎么解决

一般来说解决的办法有两种。

第一种是使用 Promise.all 的方式

```plain

async function test() {
	let arr = [3, 2, 1]
	await Promise.all(
		arr.map(async item => {
			const res = await fetch(item)
			console.log(res)
		})
	)
	console.log('end')
}

```

这样可以生效的原因是 async 函数肯定会返回一个 Promise 对象，调用 map 以后返回值就是一个存放了 Promise 的数组了，这样我们把数组传入 Promise.all 中就可以解决问题了。但是这种方式其实并不能达成我们要的效果，如果你希望内部的 fetch 是顺序完成的，可以选择第二种方式

另一种方法是使用 for...of

```plain
async function test() {
	let arr = [3, 2, 1]
	for (const item of arr) {
		const res = await fetch(item)
		console.log(res)
	}
	console.log('end')
}

```

因为 for...of 内部处理的机制和 forEach 不同，forEach 是直接调用回调函数，for...of 是通过迭代器的方式去遍历

```plain
async function test() {
	let arr = [3, 2, 1]
	const iterator = arr[Symbol.iterator](.)
	let res = iterator.next()
	while (!res.done) {
		const value = res.value
		const res1 = await fetch(value)
		console.log(res1)
		res = iterator.next()
	}
	console.log('end')
}
```


以上代码等价于 for...of，可以看成 for...of 是以上代码的语法糖。

### 延伸

```plain
let a = 0;
        let test = async() => {
            a = a + await 10;
            console.log(a)
        }
        test()
        console.log(++a)
```

一般会认为输出

```plain
1
11
```

实际输出

```plain
1
10
```

这里 await 会对 a 冻结


## new 的实现原理是什么

首先引用小黄书中话

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作：

1. 创建(或者说构造)一个全新的对象。

2. 这个新对象会被执行[[原型]]连接。

3. 这个新对象会绑定到函数调用的 this。

4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

版本 1

```plain
function _new(func) {
            return function() {
                let target = {
                    __proto__: func.prototype
                }
                func.call(target, ...arguments);
                return target;
            }
        }

        function Perpson(name, age) {plainplainplainplainplainplain
            this.name = name;
            this.age = age;
        }
        let person = _new(Perpson)('liushuai', 18)
        console.log(person)
```

版本 2

```plain
function _new() {
    let target = {}; //创建的新对象
    //第一个参数是构造函数
    let [constructor, ...args] = [...arguments];
    //执行[[原型]]连接;target 是 constructor 的实例
    target.__proto__ = constructor.prototype;
    //执行构造函数，将属性或方法添加到创建的空对象上
    let result = constructor.apply(target, args);
    if (result && (typeof(result) == "object" || typeof(result) == "function")) {
        //如果构造函数执行的结构返回的是一个对象，那么返回这个对象
        return result;
    }
    //如果构造函数返回的不是一个对象，返回创建的新对象
    return target;
}
```

## 手动实现 instanceof

### 原理

```plain
a instanceof Object
```

判断 Object 的 prototype 是否在 a 的原型链上。

### 实现


```plain
function myInstance(target, org) {
            var proto = target.__proto__;
            if (proto) {
                if (proto === org.prototype) {
                    return true;
                } else {
                    return myInstance(proto, org)
                }
            } else {
                return false;
            }
        }
```

### 验证

```plain
var A = function() {};
    A.prototype = {};
    var a = new A();
    A.prototype = {};
    var b = new A();
    console.log(a instanceof A); //false
    console.log(b instanceof A); //true
    console.log(myInstance(a, A)) //false
    console.log(myInstance(b, A)) // true

```

## 手动实现 call、apply

谈起 call 和 apply 这两个 Function.prototype 上的方法可能很熟悉了，它在继承，改变 this 指针上有很多的应用场景。接下来我们简单的来重新回忆一下 call 和 apply 这两个函数的功能 

### 例子一

```plain
let obj = {
            a: 20
        }

        function func() {plainplainplainplainplainplain
            console.log(this.a)
        }
        func.call(obj) //20
```

### 例子 2

```plain
 document.getElementById('app').onclick = function() {
            let appBtn = function() {
                console.log(this)
            }
            appBtn.call(this)
        }
```

### 例子 3

```plain
function FuncA(value) {
            this.value = value;
        }

        function FuncB() {plainplainplainplainplainplainplain
            FuncA.apply(this, arguments)
        }
        FuncB.prototype.getValue = function() {
            return this.value;
        }
        var funcB = new FuncB('hello')
        console.log(funcB.getValue())
```

经过上面的例子我们可以直观的知道 call apply 的作用大部分都是用作改变 this 的指针。那么接下来我们来模拟 call apply 实现简单的一下这两个函数


###模拟实现 call

1.判断当前 this 是否为函数，防止 Function.prototype.myCall() 直接调用

2.context 为可选参数，如果不传的话默认上下文为 window

3.为 context 创建一个 Symbol（保证不会重名）属性，将当前函数赋值给这个属性

4.处理参数，传入第一个参数后的其余参数

5.调用函数后即删除该 Symbol 属性

```plain
Function.prototype.myCall = function(context = window, ...args) {
                if (this === Function.prototype) {
                    return undefined; //用于防止 Function.prototype.myCall() 直接调用
                }
                context = context || window;
                //防止方法冲突覆盖
                let fn = Symbol();
                // 改变 this
                context[fn] = this;
                // 将参数放入函数内
                let result = context[fn](args)
                    // 删除对象中的函数
                delete context[fn]
                return result;
            }
            //测试
        document.getElementById('app').onclick = function() {
            let appBtn = function() {
                console.log(this)
            }
            appBtn.myCall(this)
        }
```


### 模拟实现 apply

apply 实现类似 call，参数为数组

```plain
Function.prototype.myApply = function(context, args) {
            if (this === Function.prototype) {
                return undefined;
            }
            context = context || window;
            let fn = Symbol()
            context[fn] = this;
            let result;
            if (Array.isArray(args)) {
                result = context[fn](...args)
            } else {
                result = context[fn](.)
            }
            return result;
        }
```

### setTimeout 模拟实现 setInterval

可避免 setInterval 因执行时间导致的间隔执行时间不一致


```plain
setTimeout(function() {
            //dosomething
            console.log(11)
            setTimeout(arguments.callee, 1000)
        }, 1000)
``` 

### 手写拖拽

#### HTML 5 拖放

```plain
 <style>
        #div1 {
            width: 300px;
            height: 300px;
            background: red;
        }
    </style>
<script type="text/javascript">
        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("Text", ev.target.id);
        }

        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("Text");
            ev.target.appendChild(document.getElementById(data));
        }
    </script>

 <div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    <div id="drag1" draggable="true" ondragstart="drag(event)" style="width: 300px;height:69px;">
        被拖拽
    </div>
```

#### 原生 js


```plain
#box {
        width: 300px;
        height: 300px;
        background: yellowgreen;
        position: absolute
    }
<div id="box">
</div>

<script>

</script>
let drag = document.getElementById('box');
        drag.onmousedown = function(e) {
            let event = e || window.event;
            let outX = event.clientX - drag.offsetLeft;
            let outY = event.clientY - drag.offsetTop;
            drag.onmousemove = function(e) {
                let event = e || window.event;
                let left = event.clientX - outX,
                    top = event.clientY - outY;
                if (left < 0) {
                    left = 0;
                } else if (left > (window.innerWidth - drag.offsetWidth)) {

                    left = window.innerWidth - drag.offsetWidth
                }
                if (top < 0) {
                    top = 0;
                } else if (top > (window.innerHeight - drag.offsetHeight)) {
                    top = window.innerHeight - drag.offsetHeight;
                }
                drag.style.left = CSS.px(left);
                drag.style.top = CSS.px(top);
            }
            drag.onmouseup = function() {
                drag.onmousemove = null;
                drag.onmouseup = null;
            }
        }
```
