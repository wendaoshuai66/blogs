# 不知道的 JavaScript

## 例 1
```plain
if(false){
    var a= 1;
}
console.log(a)//undefined

解释其过程

首先变量提升
var a
if（false）{
	a=1
}
```
### 拓展 1
```plain
 function test(){
    console.log(1)
}
var test;//忽略掉test为undefined变量
console.log(test)//function test(){console.log(1)}
```
### 拓展 2 函数表达式定义的时候函数的名字外部不能被访问，内部不能被修改
```plain
var p=function test(){
    //只能在函数内部访问
    test =1;
    console.log(typeof test)//function
}
p()
console.log(test)//报错 ，函数表达式外部不能访问test，只能在函数内部访问
```
## 例 2 this

```plain
var o={
    foo:function(){
        console.log(11)
    },
    bar(){
        console.log(22)
    }
}
var p1=o.foo.bind({});
new p1();
var p2=o.bar.bind({}) ;//ES6 bind不能被new
new p2();//报错了，p2 is a not construct 
```
### 拓展 1
```plain
this.a = 20;
function test(){
    console.log(this.a)
}
var obj ={
    a:40,
}
var result=test.bind(obj)
new result();//undefined  new 会对bind失效

```
### 拓展 2 bind 的实现

```plain
if(!Function.prototype.bind ){
    Function.prototype.bind = function(oThis){
	    if(typeof this !=='function'){
	        throw new TypeError('请使用函数绑定')
	    }
    	var oArg = Array.prototype.slice.call(arguments,1),
        fTobind =this,
        FNOP =function(){

        },
        ftbound = function(){
        fTobind.apply(this instanceof FNOP && oThis ?this :oThis, 		oArg.concat.call(Array.prototype.slice.call(arguments,1)));
        
        }
        if(this.prototype){
            FNOP.prototype = this.prototype
            ftbound.prototype = new FNOP();
        }
        return ftbound;
	}
}

思路
bind(a)-->原来函数.apply(a)


function test(a,b){
    var aArg = Array.prototype.slice.call(arguments)
    var aArg1 = Array.prototype.slice.call(arguments,1)
    console.log(aArg)//[1,2,3]
    console.log(aArg1)//[2,3]
}
test(1,2,3)
```

### 拓展 3 构造函数优先级比原型链高
```plain
function C1(name){
    //构造函数不存在
    if(name) this.name = name
}
function C2(name){
     //this.name=undefined
    this.name = name
}
function C2(name){
     //this.name=fei
    this.name = name || 'fei'
}
C1.prototype.name = 'one'
C2.prototype.name = 'two'
C3.prototype.name = 'three'
console.log((new C1().name)+(new C2().name)+(new C3().name))//one undefined fei

```
### 拓展 4
![不知道的js](https://wendaoshuai66.github.io/study/note/images/js.jpeg)

解释上图：第一个是：语句优先，所以它的先执行{};然后[];所以等于 0

[object Object] 小写 object 与 Object 因为是与大写区分

### 按值传递与按引用传递


#### 基本数据类型（值类型）
1.Boolean false true

2.Number NaN 最大值 最小值

3.String 

4.null 根本不存在

5.undefined 通俗的说是存在但没有赋值

6.Sysbol 引入一个唯一的值


#### Object
1.Array

2.RegExp

3.Date

4.Math

...

值跟对象的区别是反映在计算机的存储位置不同

使用 typeof 判断数据类型


typeof NaN //number

typeof symbol // sysmbol

typeof alert //function

typeof null //object

typeof not _ defined_var //undefined


#### 按值传递
var a= 1;
var b= a;
b=3
alert(a)//1
alert(a)//3

#### 按（址）引用传递

var o ={a:1}

var b= o;

b.xx= 2

a===b //true


#### 引申
```plain

 function test(m){
     m = {v:1}
}
var m = {a:1}
console.log(m.v)//undefined
```

### 拓展 5

```plain
有三种答案 高程中答案是2 还有1 当前浏览器是报错 不是一个函数

函数比较特殊，在js中是一等公民
function test(){
     //形成块级作用域
    var a = 1;
}
test()
console.log(a)//报错 Uncaught ReferenceError: a is not defined


 function a(){
    console.log(1)
}

(function(){
    if(false){
        function a(){
            consoloe.log(2)
        }
    }
    a()
})()
```

### 拓展 6
```plain
function test(){
    //该处的this.length指的是iframe的数量
    console.log(this.length)
}
test()
```
#### 引申
```plain
var length =10;
function test(){
    console.log(this.length)//10 2
}
var obj = {
    length:5,
    method:function(){
        test()
        arguments[0]()//相当于是arguments.fn()
    }
}
obj.method(test,1)
```