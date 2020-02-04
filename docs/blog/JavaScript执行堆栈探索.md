# JavaScript 执行堆栈探索

## 引言

JavaScript 代码执行的时候会将不同的变量存于内存中不同的位置：堆（heap）和栈（stack）中来加以区分。其中，堆里存放着一些对象。而栈中则着一些基础类型变量以及对象的指针。但是我们这说的执行栈和上面的这个栈的意义有些不同。js 在执行可执行的的脚本时，首先会创建一个全局可执行上下文 globalContext，每当执行到一个函数调用时都会创建一个可执行上下文（execution context）EC。当然可执行程序可能会存在很多函数调用，那么就会创建很多 EC，，所以 JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文。当函数调用完成，js 会退出这个执行环境并把这个执行环境销毁，回到上一个方法的执行环境...这个过程反复执行，直到执行栈中的代码全部执行完毕。


## 来观看一个例子

以下为网上一个非常经典的面试题:

```plain
var a = {n: 1}  
var b = a;  
a.x = a = {n: 2}  
console.log(a.x);  
console.log(b.x) 
```

分析过程：

1.b = a 是浅拷贝，所以在堆栈中引用的是一个对象地址。

![](https://wendaoshuai66.github.io/study/note/images/浅拷贝.png)

2.var a=1，b=2，c=3；

a = b = c；

输出的 a，b，c 结果都为 3。  因为赋值运算从右向左执行。

而我们这道题 a.x = a = {n: 2} 

. 的运算优先级大于赋值运算的优先级。 

所以先计算

![](https://wendaoshuai66.github.io/study/note/images/运算符.png)


![](https://wendaoshuai66.github.io/study/note/images/堆栈1.png)

再计算

![](https://wendaoshuai66.github.io/study/note/images/运算符2.png)

![](https://wendaoshuai66.github.io/study/note/images/堆栈2.png)

### 堆和栈


内存栈：函数执行的时候会把局部变量压到一个栈里面。

内存堆：是指存放 new 出来动态变量的地方

爆栈与死循环区别

造成形象是一样的

（1） 死循环系统主 UI 线程已经没有时间处理微任务与宏任务。

（2） 爆栈是分配的栈空间用光了。


![](https://wendaoshuai66.github.io/study/note/images/堆栈2.jpg)

1、栈区(stack):又编译器自动分配释放，存放函数的参数值，局部变量 的值等，其操作方式类似于数据结构的栈。

2、堆区(heap):一般是由程序员分配释放，若程序员不释放的话，程 序结束时可能由 OS 回收，值得注意的是他与数据结构的堆是两回事，分配方式 倒是类似于数据结构的链表。

3、全局区(static):也叫静态数据内存空间，存储全局变量和静态变 量，全局变量和静态变量的存储是放一块的，初始化的全局变量和静态变量放 一块区域，没有初始化的在相邻的另一块区域，程序结束后由系统释放。

4、文字常量区:常量字符串就是放在这里，程序结束后由系统释放。 5、程序代码区:存放函数体的二进制代码。

⚠️注意 申请的 buffer 空间并不是堆区栈区去管理的，是由 C 底层管理。变量是由 JS 管理的。


##闭包

面试经常问什么是闭包

严格意义上说保留一个执行的词法作用域就是闭包。

下面来看个列子：

```plain
 <script>
        (function() {
            debugger
        })()
    </script>
```

执行上面代码会形成如图

![](https://wendaoshuai66.github.io/study/note/images/闭包1.png)


会形成两个闭包，为什么呢

一个闭包可以理解为 js 的入口函数，c 语言中有个 main，

```plain
main(){}
```
在这里可以理解为 js 的 mian，js 的执行环境就是一个闭包，其实就是可以认为下面代码就是闭包。

```plain
function test(){
}
test()
```

总结其实闭包就是个概念

## [执⾏栈(Execution Context Stack)]

浏览器器解释器器执⾏ js 是单线程的过程，这就意味着同一时间，只能有⼀个事情在进⾏。其他的活动和事件只能排队等候，⽣成出⼀个等候队列执行栈(Execution Stack)。

1.执行栈 -----》ECS（Execution Context Stack)


2.每一个函数都会创建一个 EC

3.每一个函数执行的时候都会把自己塞进到 ECS

4.全局对象----》GC（Global Context）

### 执⾏栈压栈顺序

一开始执行代码的时候便确定一个全局执行上下文（Global execution context）作为默认值，如果在全局环境中，调用了其他函数，程序将会创建一个新的 EC，然后将 EC 推入进执行栈中 execution stack。

如果函数再调用其他函数，相同的步骤将会再次发生：创建⼀一个新的 EC -> 把 EC 推⼊执⾏栈。⼀旦⼀ 个 EC 执⾏完成，变回从执行栈中推出(pop)。

```plain
 
ECStack = [
•    globalContext
];
```

### 1. 继续分析压栈过程

```plain
 
function fun3() {plainplainplainplainplainplainplainplain
    console.log('fun3')
}
function fun2() {
fun3(); }
function fun1() {
    fun2();
}
fun1(); 
//执⾏行行fun1 结果如下 ECStack = [
    fun1,
    globalContext
];
```

### 2. 变量对象 (Variable Object)

变量对象 VO 是与执⾏上下文相关的特殊对象,⽤来存储上下文的函数声明，函数形参和变量。

```plain
 
//变量对象VO存储上下⽂中声明的以下内容 
{plainplainplain
//1-1 函数声明FD(如果在函数上下文中),—-不不包含函数表达式
//1-2 函数形参function arguments,
//1-3 变量量声明–注意b=10不不是变量量，但是var b = 10;是变量量，有变量量声明提升 //alert(a); // undefined
//alert(b); // “b” 没有声明
//b = 10;
//var a = 20;
}
var a = 10;
function test(x) {
  var b = 20;
}; test(30);
// 全局上下⽂文的变量量对象 
VO(globalContext) = {
   a: 10,
  test: <reference to function>
};
// test函数上下⽂文的变量量对象 
VO(test functionContext) = {
x: 30,
b: 20 };
//VO分为 全局上下⽂文的变量量对象VO，函数上下⽂文的变量量对象VO VO(globalContext) === global;
 
```
### 3. 活动对象(Activation Object)

在函数上下⽂中，变量对象被表示为活动对象 AO,当函数被调用后，这个特殊的活动对象就被创建了了。 它包含普通参数与特殊参数对象(具有索引属性的参数映射表)。活动对象在函数上下文中作为变量对象使用。


```plain
//1.在函数执⾏上下文中，VO是不能直接访问的，此时由活动对象扮演VO的角色。 
//2.Arguments对象它包括如下属性:callee 、length
//3.内部定义的函数
//4.以及绑定上对应的变量量环境;plainplainplainplainplainplain
//5.内部定义的变量
 VO(functionContext) === AO; function test(a, b) {
  var c = 10;
  function d() {}
  var e = function _e() {};
  (function x() {});
}
test(10); 
// call
当进⼊入带有参数10的test函数上下⽂文时，AO表现为如下:

//AO⾥并不包含函数“x”。这是因为“x” 是⼀个函数表达式(FunctionExpression, 缩写为 FE) ⽽不不 是函数声明，函数表达式不会影响VO
AO(test) = {
  a: 10,
  b: undefined,
  c: undefined,
  d: <reference to FunctionDeclaration "d">
  e: undefined
};

```


### 4. 深度活动对象(Activation Object)


```plain
 
//Activation Object 分为创建阶段和执⾏行行阶段 
function foo(i) {
var a = 'hello';
 
var b = function privateB() {plainplainplain
    };
    function c() {
    }
}
foo(22); 
//当我们执⾏行行foo(22)的时候，EC创建阶段会类似⽣生成下⾯面这样的对象: 
fooExecutionContext = {
    scopeChain: { Scope },
    AO: {
        arguments: {
            0: 22,
length: 1 },
        i: 22,
        c: pointer to function c()
        a: undefined,
        b: undefined
    },
    VO:{..}
    Scope: [AO, globalContext.VO],
}
//在创建阶段，会发⽣属性名称的定义，但是并没有赋值(变量量提升阶段)。
//⼀旦创建阶段(creation stage)结束，变进⼊了激活 
// 执⾏阶段，那么fooExecutionContext便便会完成赋值，变成这样: 

//【 运⾏函数内部的代码，对变量复制，代码一行一行的被解释执⾏ 】
fooExecutionContext = {
    scopeChain: { ... },
    AO: {
        arguments: {
            0: 22,
length: 1 },
        i: 22,
        c: pointer to function c()
        a: 'hello',
        b: pointer to function privateB()
},
VO:{..}
Scope: [AO, globalContext.VO], this: { 运⾏行行时确认 }
}
```

### 5. 补充活动对象(Activation Object)


```plain
var x = 10;
function foo() {
  var barFn = Function('alert(x); alert(y);');
  barFn(); // 10, "y" is not defined
}
foo();plainplain
//1.通过函构造函数创建的函数的[[scope]]属性总是唯⼀的全局对象(LexicalEnvironment)。 
//2.Eval code - eval 函数包含的代码块也有同样的效果

```

### 6. 整合体运⾏行行流程如下

```plain
 
//VO函数上下⽂的链接 AO是函数自身的 
ECStack = [
        fun3
        fun2,
        fun1,
        globalContextplainplainplainplainplain
];
```




