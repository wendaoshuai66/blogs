# Promise

## 什么是 Promise

```plain
function add(getX,getY,cb){
	var x,y;
	getX(function(val){
	   x= val;
	   // 两者都准备好了？
		if(y!=undefined){
		  cb(x+y) // 发送加法的结果
		}
	})
	getY(function(val){
		y= val;
		// 两者都准备好了？
		if(x!=undefined){
		 cb(x+y) // 发送加法的结果
		}
	})
}
var fetchX =function(fn){
	setTimeout(function(){
	 fn(1)
	},1000)
}
var fetchY =function(fn){
	setTimeout(function(){
	 fn(3)
	},2000)
}
add(fetchX,fetchY,function(sum){
  console.log(sum)//4
})
```

花点儿时间来感受一下这段代码的美妙（或者丑陋），我耐心地等你。

虽然丑陋是无法否认的，但是关于这种异步模式有一些非常重要的事情需要注意。

在这段代码中，我们将 x 和 y 作为未来的值对待，我们将 add(..)操作表达为：（从外部看来）它并不关心 x 或 y 或它们两者现在是否可用。换句话所，它泛化了 现在 和 稍后，如此我们可以信赖 add(..)操作的一个可预测的结果。

通过使用一个临时一致的 add(..)——它跨越 现在 和 稍后 的行为是相同的——异步代码的推理变得容易的多了。


更直白地说：为了一致地处理 现在 和 稍后，我们将它们都作为 稍后：所有的操作都变成异步的。

当然，这种粗略的基于回调的方法留下了许多提升的空间。为了理解在不用关心 未来的值 在时间上什么时候变得可用的情况下推理它而带来的好处，这仅仅是迈出的一小步。


## Promise 值

我们先简单地看一下我们如何通过 Promise 来表达 x + y 的例子：

```plain
function add (xPromise,yPromise){
         // `Promise.all([ .. ])`接收一个Promise的数组，
        // 并返回一个等待它们全部完成的新Promise
        return Promise.all([xPromise,yPromise])
         // 当这个Promise被解析后，我们拿起收到的`X`和`Y`的值，并把它们相加
        .then(values=>{
         // `values`是一个从先前被解析的Promise那里收到的消息数组
            return values[0]+values[1]
        })
    }

var fetchX =function(){
   return new Promise((reslove,reject)=>{
        setTimeout(function(){
            reslove(1)
        },1000)
   })
}
var fetchY =function(){
  return new Promise((reslove,reject)=>{
        setTimeout(function(){
            reslove(2)
        },2000)
   })
}

// 为了将两个数字相加，我们得到一个Promise。
// 现在我们链式地调用`then(..)`来等待返回的Promise被解析
add(fetchX(),fetchY()).then(sum=>{
 console.log(sum)//3
})
```

注意： 在 add(..)内部。Promise.all([ .. ])调用创建了一个 promise（它在等待 promiseX 和 promiseY 被解析）。链式调用.then(..)创建了另一个 promise，它的 return values[0] + values[1]这一行会被立即解析（使用加法的结果）。这样，我们链接在 add(..)调用末尾的 then(..)调用——在代码段最后——实际上是在第二个被返回的 promise 上进行操作，而非被 Promise.all([ .. ])创建的第一个 promise。另外，虽然我们没有在这第二个 then(..)的末尾链接任何操作，它也已经创建了另一个 promise，我们可以选择监听/使用它。

## 实现⼀个完整的 Promise/A+

简单来说，promise 主要就是为了解决异步回调问题。其主流规范目前主要是 Promise/A+在开始前，我们先写⼀个 promise 应⽤场景来体会下 promise 的作⽤

```plain
function fn1(resolve,reject) {
        setTimeout(()=>{
            console.log('步骤1：执行')
            resolve(1)
        },500)
    }
    function fn2(resolve,reject) {
        setTimeout(()=>{
            console.log('步骤2：执行')
            resolve(2)
        },100)
    }
    new Promise(fn1).then(res=>{
        console.log(res)
        return new Promise(fn2)
    }).then(res=>{
        console.log(res)
        return 333
    }).then(res=>{
        console.log(res)
    })
```
### 初步构建
写一个简单的 promise，promise 的参数是函数 fn，把内部定义 resolve 方法作为参数传到 fn 中，调用 fn。当异步操作成功后会调用 reslove，然后就会执行 then 注册的回调

废话不多说上代码

```plain

function Promsie(fn) {
    //需要一个成功时的回调
    var callback;
    //一个实例的方法，用来注册异步事件
    this.then = function(done) {
        callback = done;
    }

    function reslove(value) {
        callback(value);
    }
    fn(reslove)
}
```

### 加入链式支持

下面加入链式，成功回调的方法就得变成数组才能存储。同时我们给 resolve ⽅法添加参数，这样就不会输出 undefined。

```plain
function Promise() {
    var promsie = this,
        value = null,
        promise._resloves = [];
    this.then = function (onFulfiled) {
        promise._resloves.push(onFulfiled)
        return this;
    }
     function reslove(value) {
         promise._resloves.forEach(callback=>{
             callback(value)
         })
     }
     fn(reslove)
}
```

1.promise = this， 这样我们不用担心某个时刻 this 指向突然改变问题。

2.调用 then 方法，将回调放⼊promise._resloves 队列；

3.创建 Promise 对象同时，调用其 fn, 并传入 resolve 方法，当 fn 的异步操作执⾏成功后，就会调用 resolve ，也就是执行 promise._resloves 队列中的回调；

4.resolve 方法接收⼀个参数，即异步操作返回的结果，⽅便传值

5.then⽅法中的 return this 实现了链式调用⽤。但是目前的 Promise 还存在一些问题，如果我传入的是一个不包含异步操作的函数，

reslove 就会先于 then 执⾏，也就是说 promise._resloves 是⼀个空数组。
解决方法：为了解决这个问题，我们可以在 reslove 中添加 setTimeout，来将 reslove 中执⾏回调的逻辑放置到 JS 任务队列末尾

```plain
function Promise() {
        var promsie = this,
            value = null,
            promise._resloves = [];
        this.then = function (onFulfiled) {
            promise._resloves.push(onFulfiled)
            return this;
        }
        function reslove(value) {
            setTimeout(()=>{
                promise._resloves.forEach(callback=>{
                    callback(value)
                })
            },0)
        }
        fn(reslove)
}
```

### 引入状态，干干，干就完了

```plain
function Promise() {
    var promise = this,
        value = null;
        promise_resloves = [],
        promise._status = "PENDING";
    this.then = function (onFulfilled) {
        if(promise._status === "PENDING"){
            promise_resloves.push(onFulfilled)
        }
        return this;
    }
    function reslove(value) {
       setTimeout(()=>{
           promise._status = 'FULFILLED'
           promise_resloves.forEach(callback=>{
               callback(value)
           })
       },0)
    }
    fn(reslove);
}
```

每个 Promise 存在三个互斥状态：pending、fulfilled、rejected。Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected。只要这两种情况发⽣，状态就凝固了，不会再变了，会⼀直保持这个结果。就算改变已经发⽣了，你再对 Promise 对象添加回调函数，也会⽴即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

### 加上异步结果的传递

前的写法都没有考虑异步返回的结果的传递，我们来加上结果的传递：

```plain
function Promise(fn) {
    var promise = this,
        value = null,
        promise._reslove = [],
        promise._status = 'PENDING';
    this.then = function (onFulfilled) {
        if(promise._status === 'PENDING'){
            promise._reslove.push(onFulfilled)
        }
        return this;
    }
    function reslove(value) {
        setTimeout(()=>{
            promise._status = 'FULFILLED';
            promise._reslove.forEach(callback=>{
                value=callback(value)
            })
        },0)
    }
    fn(reslove)
}
```

### 串行 Promise

串行 Promise 是指在当前 promise 达到 fulfilled 状态后，即开始进行⾏下⼀一个 promise（后邻 promise）。例如我们先⽤ajax 从后台获取⽤用户的的数据，再根据该数据去获取其他数据。这⾥我们主要对 then ⽅法进⾏改造：

```plain
function Promsie(fn) {
        var promise = this,
            value = null,
            promise._reslove = [],
            promise._status = 'PENDING';
        this.then = function (onfuilled) {
            return new Promsie(function (reslove) {
                function handle(value) {
                    var ret = isFunction(onfuilled) && onfuilled(value) || value;
                    reslove(ret)
                }
                if(promise._status === 'PENDING'){
                    promise._reslove.push(handle)
                }else if(promise._status === 'FULFILLED'){
                    handle(value);
                }
            })
        }
        function reslove(value) {
            setTimeout(()=>{
                promise._status = 'FULFIILED';
                promise._reslove.forEach(callback=>{
                    value = callback(value)
                })
            },0)
        }
        fn(reslove)
    }
```


then 方法该改变⽐较多啊，这⾥我解释下：

 注意的是，new Promise() 中匿名函数中的 promise （promise._resolves 中的 promise）指向的都是上⼀个 promise 对象， ⽽不是当前这个刚刚创建的。先我们返回的是新的⼀个 promise 对象，因为是同类型，所以链式仍然可以实现。
 
其次，我们添加了⼀个 handle 函数，handle 函数对上一个 promise 的 then 中回调进行了处理，并且调⽤了当前的 promise 中的 resolve ⽅法。

接着将 handle 函数添加到 上⼀个 promise 的 promise._resolves 中，当异步操作成功后就会执⾏
handle 函数，这样就可以 执⾏ 当前 promise 对象的回调⽅法。我们的⽬的就达到了。

如果这里你会看到晕看下面的代码

```plain
 new Promise(fn1).then(fn2).then(fn3)})
```
1.首先我们创建了一个 Promise 的实例，叫做 promsie1；接着就会运行 fn1(reslove);
 
2.但是 fn1 中有一个 setTimeout 函数，于是就会跳过这一部分；运行后面第一个 then 方法；
 
3 then 返回一个新对象 promise2，promise2 对象的 reslove 方法和 then 方法中回调函数 fn2 都会被封装到 handle 中然后 handle 被添加到 promsie1._reslve 数组中
 
4.接着运行第二个 then 方法，同样返回一个新对象 promise3，promise3 对象的 reslove 方法和 then 方法中回调函数 fn3 都会被封装到 handle 中然后 handle 被添加到 promsie2._reslove 数组中
 
5.到此两个 then 运行结束后 setTimeout 中的延迟时间⼀到，就会调⽤ promise1 的 resolve⽅法。
 
6.resolve ⽅方法的执行⾏，会调用⽤ promise1._resolves 数组中的回调，之前我们添加的 handle ⽅法就会被执行⾏； 也就是 fn2 和 promsie2 的 resolve 方⽅法，都被调⽤用了。

7 以此类推，fn3 会和 promise3 的 resolve ⽅法 ⼀起执⾏，因为后⾯没有 then ⽅法了,promise3._resolves 数组是空的 。

8 ⾄此所有回调执⾏结束但这⾥还存在⼀个问题，就是我们的 then ⾥⾯函数不能对 Promise 对象进⾏处理。这⾥我们需要再次 对 then 进⾏修改，使其能够处理 promise 对象。

```plain
 function Promsie(fn) {
                var promise = this,
                    value = null,
                    promise._reslove = [],
                    promise._status = 'PENDING';
                this.then = function(onfuilled) {
                    return new Promsie(function(reslove) {
                        function handle(value) {
                            var ret = typeof onfuilled == "function" && onfuilled(value) || value;
                            if (ret && typeof ret['then'] === "function") {
                                ret.then(function(value) {
                                    reslove(value);
                                })
                            } else {
                                reslove(value)
                            }
                            reslove(ret)
                        }
                        if (promise._status === 'PENDING') {
                            promise._reslove.push(handle)
                        } else if (promise._status === 'FULFILLED') {
                            handle(value);
                        }
                    })
                }

            function reslove(value) {
                setTimeout(() => {
                    promise._status = 'FULFIILED';
                    promise._reslove.forEach(callback => {
                        value = callback(value)
                    })
                }, 0)
            }
            fn(reslove)
        }
```

### 失败处理

异步操作不不可能都成功，在异步操作失败时，标记其状态为 rejected，并执⾏行行注册的失败回调。 有了了之前处理理 fulfilled 状态的经验，⽀支持错误处理理变得很容易易。毫⽆无疑问的是，在注册回调、处理理状态

变更更上都要加⼊入新的逻辑:

上代码吧

```plain
function Promise(fn) {
            var promise = this;
            promise._status = 'PENDING';
            promise._values;
            promise._reason;
            promise._reslove = [];
            promise._reject = [];
            this.then = function(onFulfilled, onRejected) {
                return new Promise(function(reslove, reject) {
                    function handle(values) {
                        var ret = (typeof onFulfilled === 'function' && onFulfilled(values)) || values
                        if (ret && typeof ret['then'] === 'function') {
                            ret.then(function(value) {
                                reslove(value)
                            }, function(reason) {
                                reject(reason)
                            })
                        } else {
                            reslove(ret)
                        }
                    }

                    function errback(values) {
                        var reason = (typeof onRejected === 'function' && onRejected(values)) || values
                        reject(values)
                    }
                    if (promise._status === 'PENDING') {
                        promise._reslove.push(handle)
                        promise._reject.push(errback)
                    } else if (promise._status === 'FULFILLED') {
                        promise._reslove.push(promise._values)
                    } else if (promise._status === 'REJECTED') {
                        promise._reject.push(promise._reason)
                    }
                })
            }

            function reslove(values) {
                setTimeout(() => {
                    promise._status = 'FULFILLED';
                    promise._reslove.forEach(callback => {
                        promise._values = callback(values)
                    });
                }, 0)
            }

            function reject(values) {
                setTimeout(() => {
                    promise._status = 'REJECTED';
                    promise._reject.forEach(callback => {
                        promise._reason = callback(values)
                    });
                }, 0)
            }
            fn(reslove, reject)
        }
```

### Promise.resolve

Promise.resolve(value) 返回一个以给定值解析后的 Promise 对象.

1.如果 value 是个 thenable 对象，返回的 promise 会“跟随”这个 thenable 的对象，采用它的最终状态

2.如果传入的 value 本身就是 promise 对象，那么 Promise.resolve 将不做任何修改、原封不动地返回这个 promise 对象。

3.其他情况，直接返回以该值为成功状态的 promise 对象。

```plain
Promise.resolve = function(value) {
            if (value instanceof Promise) {
                return value
            }
            return new Promise(function(resolve, reject) {

                if (value && value.then && typeof value.then === 'function') {
                    setTimeout(() => {
                        value.then(resolve, reject);
                    });
                } else {
                    resolve(value);
                }
            })
        }
```

### Promise.reject

Promise.reject 方法和 Promise.resolve 不同，Promise.reject()方法的参数，会原封不动地作为 reject 的理由，变成后续方法的参数。

```plain
Promise.reject = function(value) {
            return new Promise(function(resolve, reject) {
                reject(value)
            })
        }
```

### Promise.prototype.catch

Promise.prototype.catch 用于指定出错时的回调，是特殊的 then 方法，catch 之后，可以继续 .then

```plain
Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}
```

### Promise.prototype.finally

不管成功还是失败，都会走到 finally 中,并且 finally 之后，还可以继续 then。并且会将值原封不动的传递给后面的 then.

```plain
Promise.prototype.finally = function (callback) {
    return this.then((value) => {
        return Promise.resolve(callback()).then(() => {
            return value;
        });
    }, (err) => {
        return Promise.resolve(callback()).then(() => {
            throw err;
        });
    });
}
```

### Promise.all

Promise.all(promises) 返回一个 promise 对象

1.如果传入的参数是一个空的可迭代对象，那么此 promise 对象回调完成(resolve),只有此情况，是同步执行的，其它都是异步返回的。

2.如果传入的参数不包含任何 promise，则返回一个异步完成.

3.promises 中所有的 promise 都 promise 都“完成”时或参数中不包含 promise 时回调完成。

4.如果参数中有一个 promise 失败，那么 Promise.all 返回的 promise 对象失败

5.在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组


```plain
Promise.all = function(promsies) {
            if (!Array.isArray(promsies)) {
                throw new TypeError('You must pass to an array')
            }
            return new Promise(function(resolve, reject) {
                var len = promsies.length,
                    result = [],
                    count = len;

                function resolver(index) {
                    return function(value) {
                        resolverAll(index, value)
                    }
                }

                function rejects(value) {
                    reject(value)
                    return
                }

                function resolverAll(index, value) {
                    result[index] = value;
                    --count;
                    if (count === 0) {
                        resolve(result)
                    }
                }
                for (var i = 0; i < len; i++) {
                    Promise.resolve(promsies[i]).then(resolver(i), rejects)
                }
            })
        }

```

### Promise.race

Promise.race 函数返回一个 Promise，它将与第一个传递的 promise 相同的完成方式被完成。它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个完成的方式是两个中的哪个。

如果传的参数数组是空，则返回的 promise 将永远等待。

如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则 Promise.race 将解析为迭代中找到的第一个值。
```plain
myPromise.race = function(promsies) {
            if (!Array.isArray(promsies)) {
                throw new TypeError('You must pass to an array')
            }
            return new myPromise(function(resolve, reject) {
                var len = promsies.length,
                    result = [],
                    count = len;

                function resolver(value) {
                    resolve(value)
                }

                function rejects(value) {
                    reject(value)
                }
                for (var i = 0; i < len; i++) {
                    myPromise.resolve(promsies[i].then(resolver, rejects))
                }
            })
        }
```
