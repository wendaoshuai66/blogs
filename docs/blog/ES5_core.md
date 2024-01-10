# ES5 的核心技术

## this

### 为什么要用 this

直接上代码

```plain
 function identify() {
        return this.name.toUpperCase();
      }
      function speak() {
        var greeting = "Hello, I'm " + identify.call( this );
        console.log( greeting)
      }
      var me = {
        name: "Kyle"
      };
      var you = {
        name: "Reader"
      };
      identify.call( me ); // KYLE
      identify.call( you ); // READER
      speak.call( me ); // Hello, 我是 KYLE
      speak.call( you ); // Hello, 我是 READER

      如果不用this
      function identify(context) {
       return context.name.toUpperCase();
      }
      function speak(context) {
       var greeting = "Hello, I'm " + identify( context );
       console.log( greeting );
      }
      identify( you ); // READER
      speak( me ); //hello, 我是 KYLE
```

this 提供了更优雅的隐式方式’传递‘一个对象的引用，可以将 API 设计的简洁易用复用

### this 并不像我们所想的那样指向函数本身

我们想要记录一下函数 foo 被调用的次数，思考一下下面的代码:

```plain
      function foo(num) {
      console.log( "foo: " + num );
      // 记录 foo 被调用的次数
      this.count++;
      }
      foo.count = 0;
      var i;
      for (i=0; i<10; i++) {
        if (i > 5) {
          foo( i );
        }
      }
        foo: 6
        foo: 7
        foo: 8
        foo: 9
      console.log( foo.count );//0---->为什么

      解决此的两种方法：
      方法一：
      function foo(num) {
      console.log( "foo: " + num );
      // 记录 foo 被调用的次数
      foo.count++;
      }
      foo.count = 0;
      var i;
      for (i=0; i<10; i++) {
        if (i > 5) {
          foo( i );
        }
      }
        foo: 6
        foo: 7
        foo: 8
        foo: 9
      console.log( foo.count )//4
      方法二：
      function foo(num) {
        console.log( "foo: " + num );
        // 记录 foo 被调用的次数
        this.count++;
      }
      foo.count = 0;
      var i;
      for (i=0; i<10; i++) {
        if (i > 5) {
          foo.call(foo, i );
        }
      }
      console.log(foo.count)
```

执行 foo.count = 0 时，的确向函数对象 foo 添加了一个属性 count。但是函数内部代码 this.count 中的 this 并不是指向那个函数对象，所以虽然属性名相同，根对象却并不相同

### this 的作用域

this 指向函数的作用域。这个问题有点复杂，因为在某种情况下它是正确的，但是在其他情况下它却是错误的

> _需要明确的是，this 在任何情况下都不指向函数的词法作用域_

### this 到底是什么

> _this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。_

### this 调用位置

调用位置就是函数在代码中被调用的位置（而不是声明的位置）,大白话谁调用指向谁

#### this 谁调用指向谁

```plain
this.a = 20;
var p={
  a:30,
  test:function(){
  //this--->p
  alert(this.a)
}
}
//s--->window
var s =p.test;
s()//20
接着复杂
this.a = 20;
var p={
  a:30,
  test:function(){
    //this--->p
    alert(this.a)
    function s(){
      this.a=60;
      alert(this.a)
    }
    return s;
  }
}
//s--->window
var s =p.test();
s()//60
如果去掉this.a=60‘
s()//20
```

### this 绑定规则--默认绑定

独立函数调用

声明在全局作用域中的变量（比如 var a = 2）就是全局对象的一个同名属性。它们本质上就是同一个东西，并不是通过复制得到的

```plain
function foo() {
	console.log(this.a)
}
var a = 2;
foo()//2
```

如果使用严格模式

```plain
function foo() {
"use strict";
console.log( this.a );
}
var a = 2;
foo();// TypeError: this is undefined
```

如果严格模式写成这样

```plain
function foo() {
console.log( this.a );
}
var a = 2;
(function () {
"use strict";
foo()//2
})()
```

总结：this 绑定规则完全取决于调用位置，但是只有 foo()运行在非 strict mode 默认绑定才能绑定到全局对象；严格模式下与 foo()的调用位置无关

### 绑定规则----隐式绑定

调用的位置是否有上下文对象，或者说是否被某个对象所拥有或者包含

```plain
function foo() {
    console.log( this.a );
}
var obj={
    a:1,
    foo:foo
}
obj.foo();//1
```

```plain
调用位置会使用 obj 上下文来引用函数
当函数引用有上下文的对象时，隐式绑定规则会把函数调用的this绑定到上下文对象
对象引用链中只有最顶层或者说最后一层会影响调用的位置，废话不多说上代码

function foo() {
          console.log( this.a );
      }
      var obj2={
          a:42,
          foo:foo
      }
      var obj1={
          a:2,
          obj2:obj2
      }
      obj1.obj2.foo();//42
```

一个最常见的 this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而 this 绑定到全局对象或者说 undefined 取决于是否严格模式

```plain
function foo() {
    console.log(this.a)
}
var obj = {
    a:1,
    foo:foo
}
var s= obj.foo;//函数别名
var a='globle';//a是全局对象的属性
s()//globle
```

传入回调函数 参数传递是隐式赋值

```plain
 function foo() {
      console.log(this.a)
  }
  function dofoo(fn) {
      fn()
  }
  var obj={
      a:1,
      foo:foo
  }
  dofoo(obj.foo)//undefined
```

把函数传入语言内置的函数而不是传入你自己的函数

```plain
function foo() {
    //undefined
    console.log(this.a)
}
var obj={
    a:1,
    foo:foo
}
setTimeout(obj.foo,1000)
```

回调函数丢失 this 绑定是非常常见的

### 绑定规则---显示绑定

使用 call 和 apply --->它们的第一个参数是对象，它们会把这个对象绑定到 this 上---->称之为显示绑定,上代码

```plain
function foo() {
     console.log(this)
 }
 // var obj={a:1}
 foo.call(obj)
 通过foo.call,调用foo----->强制把foo的this--》绑定到----》obj

 你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作 this 的绑定对象，这个原始值会被转换成它的对象形式（也就是 new String(..)、new Boolean(..) 或者new Number(..)）。这通常被称为“装箱”
```

#### 硬绑定

```plain
function foo() {
    console.log(this.a)
}
var obj={
    a:12,
    foo:foo
}
var bar = function () {
    foo.call(obj)
}
   setTimeout(bar,1000)
```

硬绑定典型应用场景就是创建一个包裹函数，传入所有的参数并返回接收到的所有值，上代码

```plain
function foo(dosomething) {
    console.log(this.a , dosomething)
    return this.a + dosomething
}
var obj = {
    a:121
}
var bar =function () {
    return foo.apply(obj,arguments)
}
var b= bar(3)
console.log(b)
```

另一种方法,创建一个 i 重复使用的辅助函数

```plain
function bind(fn,obj) {
   return function () {
       return fn.apply(obj,arguments)
   }
}
var obj = {
    a:121
}
var bar = bind( foo, obj );
var b = bar( 3 );
console.log( b );
bind(..) 会返回一个硬编码的新函数，它会把参数设置为 this 的上下文并调用原始函数
```

#### API 调用的‘上下文’

第三方库的许多函数，以及 js 语言和宿主环境中许多新的内置函数都提供了可选参数，通常被称为‘上下文’，其作用和 bind 一样

```plain
// function foo(el) {
//     console.log( el, this.id );
// }
// var obj = {
//     id: "awesome"
// };
// // 调用 foo(..) 时把 this 绑定到 obj
// [1, 2, 3].forEach( foo, obj );
// // 1 awesome 2 awesome 3 awesome
```

### 绑定规则----》new 绑定

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行 [[原型]] 连接。
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象

### 被忽略的 this

把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 、bind，这些值会被忽略，实际用的是默认的绑定规则，直接上代码：

```plain
function bar() {
	 console.log(this.a)
 }
 var a = 2;
 /!*bar.call(undefined)//2*!/
 bar.apply(null)//2
```

一种非常常见的做法是使用 apply(...),来展开一个数组并当作参数传入一个函数。类似地，bind(..) 可以对参数进行柯里化（预先设置一些参数）

```plain
function foo(a,b) {
		console.log('a:'+a+',b:'+b )//a:1,b:2
    }
// foo.apply(null,[1,2])
```

柯粒化

```plain
var bar=foo.bind(null,1);
		bar(2)
```

更安全的 this 传入特殊的对象，把 this 绑定到这个对象不会对程序产生任何副作用

```plain
var obj1 = Object.create(null);
var obj2 = {}
	console.log(obj1)
	console.log(obj2)
	obj1比obj2更空
var ø =  Object.create(null);
  function foo(a,b) {
      console.log('a:'+a+',b:'+b )
  }
  // foo.apply(null,[1,2])
  //柯粒化
  var bar=foo.bind(ø,2);
  bar(3)
```

### this---->软绑定

问题：硬绑定这种方式可以把 this 强制绑定到指定的对象(除了使用 new 时)，防止函数调用应用默认绑定规则。问题在于，硬绑定会大大降低函数的灵活性，使 用硬绑定之后就无法使用隐式绑定或者显式绑定来修改 this

解决方法：默认绑定指定一个全局对象和 undefined 以外的值，那就可以实现和硬绑定相 同的效果，同时保留隐式绑定或者显式绑定修改 this 的能力。

```plain
if(!Function.prototype.softBind){
    Function.prototype.softBind=function(obj){
        var fn=this;
        var args=Array.prototype.slice.call(arguments,1);
        var bound=function(){
            return fn.apply(
                (!this||this===(window||global))?obj:this,
                args.concat.apply(args,arguments)
            );
        };
        bound.prototype=Object.create(fn.prototype);
        return bound;
    };
}
```

效果

```plain
function foo(){
    console.log("name: "+this.name);
}

var obj1={name:"obj1"},
    obj2={name:"obj2"},
    obj3={name:"obj3"};

var fooOBJ=foo.softBind(obj1);
fooOBJ();//"name: obj1" 在这里软绑定生效了，成功修改了this的指向，将this绑定到了obj1上

obj2.foo=foo.softBind(obj1);
obj2.foo();//"name: obj2" 在这里软绑定的this指向成功被隐式绑定修改了，绑定到了obj2上

fooOBJ.call(obj3);//"name: obj3" 在这里软绑定的this指向成功被硬绑定修改了，绑定到了obj3上

setTimeout(obj2.foo,1000);//"name: obj1"
/*回调函数相当于一个隐式的传参，如果没有软绑定的话，这里将会应用默认绑定将this绑定到全局环
境上，但有软绑定，这里this还是指向obj1*/

```

实现效果

在第一行，先通过判断，如果函数的原型上没有 softBind()这个方法，则添加它，然后通过 Array.prototype.slice.call(arguments,1)获取传入的外部参数，这里这样做其实为了函数柯里化，也就是说，允许在软绑定的时候，事先设置好一些参数，在调用函数的时候再传入另一些参数（关于函数柯里化大家可以去网上搜一下详细的讲解）最后返回一个 bound 函数形成一个闭包，这时候，在函数调用 softBind()之后，得到的就是 bound 函数，例如上面的 var fooOBJ=foo.softBind(obj1)。

在 bound 函数中，首先会判断调用软绑定之后的函数（如 fooOBJ）的调用位置，或者说它的 this 的指向，如果!this（this 指向 undefined）或者 this===(window||global)（this 指向全局对象），那么就将函数的 this 绑定到传入 softBind 中的参数 obj 上。如果此时 this 不指向 undefind 或者全局对象，那么就将 this 绑定到现在正在指向的函数（即隐式绑定或显式绑定）。fn.apply 的第二个参数则是运行 foo 所需要的参数，由上面的 args（外部参数）和内部的 arguments（内部参数）连接成，也就是上面说的柯里化。
其实在第一遍看这个函数时，也有点迷，有一些疑问，比如 var fn=this 这句，在 foo 通过 foo.softBind()调用 softBind 的时候，fn 到底指向谁呢？是指向 foo 还是指向 softBind？我们可以写个 demo 测试，然后可以很清晰地看出 fn 指向什么：

```plain
var a=2;
function foo(){
}
foo.a=3;
Function.prototype.softBind=function(){
    var fn=this;
    return function(){
        console.log(fn.a);
    }
};
Function.prototype.a=4;
Function.prototype.softBind.a=5;

foo.softBind()();//3
Function.prototype.softBind()();//4
```

可以看出，fn（或者说 this）的指向还是遵循 this 的绑定规则的，softBind 函数定义在 Function 的原型 Function.prototype 中，但是 JavaScript 中函数永远不会“属于”某个对象（不像其他语言如 java 中类里面定义的方法那样），只是对象内部引用了这个函数，所以在通过下面两种方式调用时，fn（或者说 this）分别隐式绑定到了 foo 和 Function.prototype，所以分别输出 3 和 4。后面的 fn.apply()也就相当于 foo.apply()。
