# ECMAScript5.1 新增语法上
## 简介
ECMAScript 5.1 (或仅 ES5) 是 ECMAScript(基于 JavaScript 的规范)标准最新修正。 与 HTML5 规范进程本质类似，ES5 通过对现有 JavaScript 方法添加语句和原生 ECMAScript 对象做合并实现标准化。ES5 还引入了一个语法的严格变种，被称为”严格模式(strict mode)”。
## 浏览器支持情况

随着 Opera 11.60 的发布, 所有 5 大浏览器都支持 ES5, 除了一些实现的 bugs. 除非另有说明，一切可以用在以下浏览器版本（或更高）：

Opera 11.60

Internet Explorer 9*

Firefox 4

Safari 5.1**

Chrome 13

```plain
* IE9不支持严格模式 — IE10 添加
```
```plain
** Safari 5.1 仍不支持 Function.prototype.bind, 
尽管 Function.prototype.bind现在已经被Webkit所支持。
```
对于旧版浏览器的支持信息,查看[ECMAScript 5 兼容性表](http://kangax.github.io/compat-table/es5/)

想再 ie8 或者其他更低的浏览器用 可以查看[es5-shim](https://www.npmjs.com/package/es5-shim)


## 严格模式

严格模式给作者提供了选择一个限制性更强语言变种的方式——给作者提供额外的可靠性给用户提供额外的安全性。在 JS 文件或是函数的顶部添加```"use strict"```即可启用严格模式。因为"use strict"就是个字符串，因此其会被旧版浏览器安全地忽视。

在 js 文件顶部添加 use strict

```plain
"use strict"
```

在函数顶部添加 use strict

```plain
function strict(){
"use strict";
return "这是严格模式。";
}


function notStrict() {
return "这是正常模式。";
}
```

[MDSN 的严格模式文章](https://www.npmjs.com/package/es5-shim)有个关于所有这些差异很有用的总结表格。
### 严格模式下无法再意外创建全局变量
不允许给未声明的变量赋值

例如

```plain
//不在严格模式下
function test(){
      a= 1
    console.log(a)//1
}
test()

//在严格模式下
function test(){
    "use strict"
    a= 1
    console.log(a)//此处就会抛出 ReferenceError ：a is not defined
}
test()
```


### 不允许对象字面量属性重复命名

```plain
!function() {
    var obj = { x: 1, x: 2 };
    console.log(obj.x);  //2
}();

!function() {
    'use strict';
    var obj = { x: 1, x: 2 };  
    console.log(obj.x);  // IE10+报错。IE7~9、Chrome、FF不报错，结果为：2
}()
```
### 严格模式下给不可写属性赋值, 给只读属性(getter-only)赋值赋值, 给不可扩展对象(non-extensible object)的新属性赋值都会抛出异常
给不可写的属性赋值

```plain
//正常模式
(function (){
    var obj1 = {}
     Object.defineProperty(obj1,'x',{value:1,writable:false});
     obj1.x= 9
     console.log(obj1.x)//1
})()

//严格模式
(function (){
    "use strict"
    var obj1 = {}
     Object.defineProperty(obj1,'x',{value:1,writable:false});
     obj1.x= 9  
     //抛出TypeError错误 
     //错误为Cannot assign to read only property 'x' of object '#<Object>'
     console.log(obj1.x)
})()
```

给只读属性赋值


```plain

//正常模式下 
(function (){
    var obj2 = {get x(){return 17}}
    obj2.x = 9
    console.log(obj2.x)//17
})()

//严格模式下
(function (){
    "use strict"
    var obj2 = {get x(){return 17}}
    obj2.x = 9
     //抛出TypeError错误 
     //错误为Cannot set property x of #<Object> which has only a getter
     console.log(obj1.x)
    console.log(obj2.x)
})()
```

给不可扩展的新属性赋值

```plain
//正常模式下
 (function (){
    var obj3 ={}
    Object.preventExtensions(obj3)
    obj3.x= 3
    console.log(obj3.x)//undefined
})()

//严格模式下
 (function (){
    "use strict"
    var obj3 ={}
    Object.preventExtensions(obj3)
    obj3.x= 3
    console.log(obj3.x)
    //抛出TypeError错误 
    // Cannot add property x, object is not extensible
})()
```

### 严格模式下, 试图删除不可删除的属性时会抛出异常

```plain
 (function (){
    "use strict"
    delete Object.prototype
    //抛出TypeError错误 
    //Cannot delete property 'prototype' of function Object() { [native code] }
})()
```

### 严格模式要求函数的参数名唯一

在正常模式下, 最后一个重名参数名会掩盖之前的重名参数. 之前的参数仍然可以通过 arguments[i] 来访问, 还不是完全无法访问. 然而, 这种隐藏毫无意义而且可能是意料之外的 (比如它可能本来是打错了), 所以在严格模式下重名参数被认为是语法错误

```plain
//正常模式下
(function (a,a,b){
    console.log(a+a+b)//7
    //之前的a会被之后的a掩盖
    console.log(arguments[0])//1
    //之前的a可以通过arguments[0]访问到
    console.log(arguments[1])//2
})(1,2,3)
```

### 严格模式禁止八进制数字语法
CMAScript 并不包含八进制语法, 但所有的浏览器都支持这种以零(0)开头的八进制语法: 0644 === 420 还有 "\045" === "%".在 ECMAScript 6 中支持为一个数字加"0o"的前缀来表示八进制数.

```plain

//正常模式下
(function (){
    var a = 0644; 
    //es6写法 a =0o644
    console.log(a)//420
})()

//严格模式下
(function (){
     'use strice'
    var a = 0644; 
    //抛出TypeError错误
    //错误为：Octal literals are not allowed in strict mode.
    console.log(a)
})()
```

### ECMAScript 6 中的严格模式禁止设置 primitive 值的属性.不采用严格模式,设置属性将会简单忽略(no-op),采用严格模式,将抛出 TypeError 错误

```plain
 (function (){
    "use strict"
    false.true = ""; 
    //抛出异常Cannot create property 'true' on boolean 'false'
})()
```

```plain
 (function (){
    "use strict"
    "with".you = "far away"; 
    //抛出异常Cannot create property 'you' on string 'with'
})()
```

### 严格模式禁用 with
with 所引起的问题是块内的任何名称可以映射(map)到 with 传进来的对象的属性, 也可以映射到包围这个块的作用域内的变量(甚至是全局变量), 这一切都是在运行时决定的: 在代码运行之前是无法得知的. 严格模式下, 使用 with 会引起语法错误, 所以就不会存在 with 块内的变量在运行是才决定引用到哪里的情况了

```plain
"use strict";
var x = 17;
with (obj) { // !!! 语法错误
  // 如果没有开启严格模式，with中的这个x会指向with上面的那个x，还是obj.x？
  // 如果不运行代码，我们无法知道，因此，这种代码让引擎无法进行优化，速度也就会变慢。
  x;
}
```

一种取代 with 的简单方法是，将目标对象赋给一个短命名变量，然后访问这个变量上的相应属性.

### 严格模式下的 eval 不再为上层范围（包围 eval 代码块的范围）引入新变量


首先理解 eval

JavaScript 中的 eval(..) 函数可以接受一个字符串为参数，并将其中的内容视为好像在书 写时就存在于程序中这个位置的代码。换句话说，可以在你写的代码中用程序生成代码并 运行，就好像代码是写在那个位置的一样。

在严格模式的程序中，eval(..) 在运行时有其自己的词法作用域，意味着其 中的声明无法修改所在的作用域。

```plain
function foo(str) {
    "use strict";
    eval( str );
    console.log( a ); // ReferenceError: a is not defined
}
foo( "var a = 2" );
```

### 严格模式禁止删除声明变量。delete name 在严格模式下会引起语法错误

```plain
"use strict";

var x;
delete x; // !!! 语法错误

eval("var y; delete y;"); // !!! 语法错误
```


## JSON

ES5 提供一个全局的 JSON 对象，用来序列化(JSON.stringify)和反序列化(JSON.parse)对象为 JSON 格式。

对于老的浏览器，可以考虑使用 Douglas Crockford 的[json2.js](https://github.com/douglascrockford/JSON-js/blob/master/json2.js), 可以让旧的浏览器实现同样的功能（原始支持功能测试后）。

### JSON.parse(text [, reviver])

JSON.parse 接受文本(JSON 格式)并转换成一个 ECMAScript 值。该可选的 reviver 参数是有带有 key 和 value 两个参数的函数，其作用于结果——让过滤和转换返回值成为可能。

如果我们想确保解析的值是个整数，我们可以使用 reviver 方法。

```plain
var result = JSON.parse('{"a": 1, "b": "2"}', function(key, value){
  if (typeof value == 'string'){
    return parseInt(value);
  } else {
    return value; 
  }
})
result.b //2
```

### JSON.stringify(value [, replacer [, space]])

JSON.stringify 允许作者接受一个 ECMAScript 值然后转换成 JSON 格式的字符串。 在其最简单的形式中，JSON.stringify 接受一个值返回一个字符串

如果我们需要改变值字符串化的方式，或是对我们选择的提供过滤，我们可以将其传给 replacer 函数。例如，我们想过滤出即将被字符串化的对象中值为 13 的属性：

```plain

var nums = {
  "first": 7,
  "second": 14,
  "third": 13
}

var luckyNums = JSON.stringify(nums, function(key, value){
  if (value == 13) {
    return undefined;
  } else {
    return value;
  }
});

>> luckyNums
'{"first": 7, "second": 14}'
```

如果 replacer 方法返回 undefined, 则键值对就不会包含在最终的 JSON 中。我们同样可以传递一个 space 参数以便获得返回结果的可读性帮助。space 参数可以是个数字，表明了作缩进的 JSON 字符串或字符串每个水平上缩进的空格数。如果参数是个超过 10 的数值，或是超过 10 个字符的字符串，将导致取数值 10 或是截取前 10 个字符

```plain
var luckyNums = JSON.stringify(nums, function(key, value) {
  if (value == 13) {
    return undefined;
  } else {
    return value;
  }
}, 2);

>> luckyNums
'{
  "first":7,
  "second":14
}'
```

## 添加对象

### 1.Object.keys() 获取对象的 key


### 2.Object.create() 获取对象的副本，实现类的继承


### 3.Object.assign() 浅拷贝


### 4.Object.defineProperty(obj, prop, descriptor) 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象

语法  Object.defineProperty(obj, prop, descriptor)

 obj 要在其上定义属性的对象。
 
 prop 要定义或修改的属性的名称。
 
 descriptor 将被定义或修改的属性描述符。

 属性描述符：数据描述符和存取描述符
 
 数据描述符和存取描述符均有以下可选键值
 
configurable 默认为 false 为 true  该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除
数据描述符可选键值 
 
该属性对应的值。value： 可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。

writable:当且仅当该属性的 writable 为 true 时，value 才能被赋值运算符改变。默认为 false

### 5.Object.defineProperties(obj, props) 在其上定义或修改属性的对象

### 6.Object.entries() 返回一个给定对象自身可枚举属性的键值对数组


### 7.Onject.fromEntries() 可以将 Map 转化为 Object

### 8.Object.freeze()
可以冻结一个对象，冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。该方法返回被冻结的对象。
### 9.Object.is() 判断两个值是否是相同的值
### 10.Object.values() 返回一个数组，其元素是在对象上找到的可枚举属性值