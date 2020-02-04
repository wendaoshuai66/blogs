# TypeScript 使用手册

## TypeScript 介绍

TypeScript 是一种由微软开发的自由和开源的编程语言，它是 JavaScript 的一个超集，扩展了 JavaScript 的语法，因此现有的 JavaScript 代码可与 TypeScript 一起工作无需任何修改，TypeScript 通过类型注解提供编译时的静态类型检查。

#### TypeScript 与 JavaScript 的比较


TypeScript 与 JavaScript 相比进步的地方包括：加入注释，让编辑器理解所支持的对象和函数，编译器会移除注释，不会增加开销；增加一个完整的类结构，使之更新是传统的对象语言。最大的好处就是加入了类型检查，可以让我们书写代码的时候更加规范。



#### 5 分钟上手 TypeScript [摘抄于官网](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

```plain
npm install -g typescript

```

##### 构建你的第一个 TypeScript 文件

在编辑器，将下面的代码输入到 greeter.ts 文件里：

```plain
function greeter(person) {
    return "Hello, " + person;
}

let user = "Jane User";

document.body.innerHTML = greeter(user);
```

##### 编译代码

我们使用了.ts 扩展名，但是这段代码仅仅是 JavaScript 而已。 你可以直接从现有的 JavaScript 应用里复制/粘贴这段代码。

在命令行上，运行 TypeScript 编译器：

```plain
tsc greeter.ts
```
输出结果为一个 greeter.js 文件，它包含了和输入文件中相同的 JavsScript 代码。 一切准备就绪，我们可以运行这个使用 TypeScript 写的 JavaScript 应用了！

接下来让我们看看 TypeScript 工具带来的高级功能。 给 person 函数的参数添加: string 类型注解，如下：

```plain
function  greeter(person:string){
    return 'hello ' + person;
}
let usr = "Jane User";
document.body.textContent = greeter(usr);
```

#### 类型注解

TypeScript 里的类型注解是一种轻量级的为函数或变量添加约束的方式。 在这个例子里，我们希望 greeter 函数接收一个字符串参数。 然后尝试把 greeter 的调用改成传入一个数组：

```plain
function greeter(person: string) {
    return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.innerHTML = greeter(user);
```

重新编译，你会看到产生了一个错误。

![](https://wendaoshuai66.github.io/study/note/images/ts1.png)

类似地，尝试删除 greeter 调用的所有参数。 TypeScript 会告诉你使用了非期望个数的参数调用了这个函数。 在这两种情况中，TypeScript 提供了静态的代码分析，它可以分析代码结构和提供的类型注解。

要注意的是尽管有错误，greeter.js 文件还是被创建了。 就算你的代码里有错误，你仍然可以使用 TypeScript。但在这种情况下，TypeScript 会警告你代码可能不会按预期执行。


##### 接口

让我们开发这个示例应用。这里我们使用接口来描述一个拥有 firstName 和 lastName 字段的对象。 在 TypeScript 里，只在两个类型内部的结构兼容那么这两个类型就是兼容的。 这就允许我们在实现接口时候只要保证包含了接口要求的结构就可以，而不必明确地使用 implements 语句。

```plain
interface Person{
    firstName:string;
    lastName:string;
}
function greeter(person:Person){
    return "hello"+ person.firstName + person.lastName;
}
let user={firstName:'liu',lastName:'shuai'};

document.body.textContent = greeter(user)
```

##### 类


最后，让我们使用类来改写这个例子。 TypeScript 支持 JavaScript 的新特性，比如支持基于类的面向对象编程。

让我们创建一个 Student 类，它带有一个构造函数和一些公共字段。 注意类和接口可以一起共作，程序员可以自行决定抽象的级别。

还要注意的是，在构造函数的参数上使用 public 等同于创建了同名的成员变量。

```plain
//创建一个Student的类,它带有一个构造函数和一些公共字段
//在构造函数的参数上使用public等同于创建了同名的成员变量。

class Student{
    fullName :String;
    constructor(public firstName,public middleInitial,public lastName){
        this.fullName = firstName + "" +middleInitial+""+lastName;
    }
}

interface Person{
    firstName;
    lastName;
}

function greeter(person:Person){
    return "hello" + person.firstName + person.lastName
}

const user = new Student('liushuai','m.','User')

document.body.textContent = greeter(user)
```

重新运行 tsc greeter.ts，你会看到生成的 JavaScript 代码和原先的一样。 TypeScript 里的类只是 JavaScript 里常用的基于原型面向对象编程的简写。

```plain
//创建一个Student的类,它带有一个构造函数和一些公共字段
//在构造函数的参数上使用public等同于创建了同名的成员变量。
var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + "" + middleInitial + "" + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "hello" + person.firstName + person.lastName;
}
var user = new Student('liushuai', 'm.', 'User');
document.body.textContent = greeter(user);

```

## 使用 VSCode 编写 TypeScript

### 参考
[VS Code 运行 TypeScript 操作指南(转)](https://www.cnblogs.com/yasepix/p/9294491.html)

[vscode 下搭建 Typescript 编译环境](https://www.jianshu.com/p/4f219f20af75)

[使用 vscode 写 typescript（node.js 环境）起手式](https://segmentfault.com/a/1190000016305647)

VSCode 可以配置 TypeScript 的自动编译。

1.全局安装 typescript

```plain
npm i -g typescript

```

2.生成并配置 tsconfig.json

```plain
tsc --init
```

tsconfig.json 说明


官网所有配置选项[传送门](https://www.tslang.cn/docs/handbook/compiler-options.html)

```plain
{//tsconfig.json文件内容
// 指定需要编译的目录
"include": ["src/**/*"],
// 排除指定目录
"exclude": ["node_modules"],
// 编译选项配置
"compilerOptions": {
"outDir": "./output", // 输出目录
"lib": ["dom","es5","es2015"], // 编译过程中需要引入的库文件的列表
"module": "commonjs", // 采用的模块系统
"moduleResolution": "node",
"target": "es5", // 编译输出目标 ES 版本
"strict": true, // 以严格模式解析
"sourceMap": true, // 是否包含可以用于 debug 的 sourceMap
"emitDecoratorMetadata": true, // 启用设计类型元数据（用于反射）
"experimentalDecorators": true, // 启用装饰器
"allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入
"isolatedModules": false, // 将每个文件作为单独的模块
"esModuleInterop": true, //导入语法 import foo from "foo"
//【最佳实践】true打开的话对应我们要用任何的Library都需要.d.ts即使是空定义，放心可以下载。
"noImplicitAny": false, // 在表达式和声明上有隐含的any类型时报错
"noImplicitReturns": true, // 不是函数的所有返回路径都有返回值时报错。
"importHelpers": true, // 从 tslib 导入外部帮助库: 比如__extends，__rest等
"listFiles": true, // 编译过程中打印文件名
"removeComments": true, // 移除注释
"suppressImplicitAnyIndexErrors": true,
"allowJs": true, // 允许编译javascript文件
"pretty": true, // 给错误和消息设置样式，使用颜色和上下文

"baseUrl": "./", // 解析非相对模块名的基准目录,相当于加了前缀
// 指定特殊模块的路径
"paths": {
"jquery": [
"node_modules/jquery/dist/jquery"
]
},

// 每当编译器在某一rootDirs的子目录下发现了相对模块导入，它就会尝试从每一个rootDirs中导入。
// 例如场景构建中的会将某些文件夹,输出拷贝到同一个目录下
"rootDirs": [
"src/views",
"generated/templates/views"
]

}
}

```

3.监测文件改动并编译

```plain
tsc -w
```

## TS 基础系列之-基本数据类型

每种语言都会有属于自己的数据类型，ts 的基本数据类型基本上是继承了 js，但也在基础之上增加了几个不一样的类型

1.布尔型 true／falses

```plain
//在js中声明boolean型的方法和ts中的不同之处
let flag = true;
let flag: boolean = true;
```

 2.float,数值型（在 js 和 ts 中数字型都是 float）
 
 ```plain
 //在js中声明number型的方法和ts中的不同之处
let age = 26;
let age: number = 26;

 ```
 
 3.字符型 Strings
 
 ```plain
 //在js中声明number型的方法和ts中的不同之处
let name = 'boren';
let name: string = 'boren';
 ```
 
 4.数组 Array
 
 //在 js 中声明数组的方法和 ts 中的不同之处
//1.js 中声明数组的两种方式

```
let city = [];
let city = new Array();
```

//2.ts 中声明数组的两种方式

```
let city: string[] = [];
let city:Array<string> = []
```
//在 ts 中声明数组必须提前指定其数据类型，如果其数组中的元素其数据类型不相同，声明的方式会在后面介绍

5.元组 Tuple


元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 string 和 number 类型的元组。

```plain
//可以定义数组中元素不相同的数据类型
let people = ['boren',26];//js
let people:[string,number];
people = ['boren',26];//ts
```

6.枚举 Enum



enum 类型是对 JavaScript 标准数据类型的一个补充。 像 C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```plain
//js中没有此方法，都是以object或者json的形式去实现枚举的特性如：
let school = {

     teacherOne : 'Mars',
     teacherTwo:'yupeng',
     teacherThree:'luxuesong'

} 
console.log(school.teacherOne)//Mars

在ECMA2015，简称es5中Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象
Object.getOwnPropertyDescriptor（school,‘teacherOne’）

// {
// value: Mars,
// writable: true,
// enumerable: true,
// configurable: true
// }

其中这么方法打印出来的对象中key enumerable属性，为可枚举性，在js es5中有三个操作会忽略枚举为 false，for...in、 Object...keys()、 JSON.stringify()；在es6中新增一个方法Object.assign()会忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。关于更多js中对枚举属性的支持，在这里就不一一介绍，例如toString()和length等等其枚举属性为false
//ts中枚举类型的用法
enum classMember = {chenchao,rongbin,chenhua,liurui,luxuesong};
let teacher:classMember = classMember.luxuesong

我们也可以给枚举中的成员进行编号等等，以便于更方便的去找到相应的对象元素
```

声明一个枚举类型

```plain
enum Color {Red,Green,Blue}
```

编译成 es5 代码是

```plain
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
```

在声明的时候可以对索引进行赋值


```plain
enum Color {Red = 1,Green = 4,Blue};  //赋值操作：所赋值的值后面会按照赋值索引继续排列
```

获取枚举类型某个值的索引


```plain
var c : Color = Color.Blue    //获取Blue的索引
```

7.通用数据类型 Any

当不知道变量的类型是什么的时候，就可以使用 any 类型

```plain
var notArr : Array<any> = [1,'12',false]
或

let list4:any[] = ['1',4,6,false]
```

8.空值 Void

在 js 中我们其实对 void 不是那么的陌生，它被认为是一个操作符，这个操作符可以计算表达式但不会返回任何值，在 js 中常常出现的位置就是在 a 标签的链接中，我们不想让页面刷新，更不想链接到某些位置只是简简单单的 a 标签，有时候会调用一个简单的函数，仅此而已，那么我们就会

```plain
<a href="javascript:void(0)" onclick="people()">点我</a>
```

在 ts 中，void 类型像是与 any 类型相反，它表示没有任何类型。Void 是对函数进行声明的,定义函数的时候，函数是要有返回值类型的，写了返回值类型如果不返回特定类型的值，就会报错。

```plain
function test1() : number{
    
}
```

上面代码会报错，因为返回值类型为 number，没有返回。

使用 void 声明函数的返回值类型，表示不需要有返回值。

```plain

function test2() : void {
    
}
```

9.Never

never 类型表示的是那些永不存在的值的类型。 例如， never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never 类型，当它们被永不为真的类型保护所约束时。

never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never。

下面是一些返回 never 类型的函数：

```plain

// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

10.类型断言

在 ts 中类型断言这种方式还是比较有用处的，其相当于 js 中的类型转换。但是只在编译的时候起作用。并不会改变其数据的本身结构。

两种写法

其一是“尖括号”语法：

```plain
//类型断言第一种写法

let someValue :any = 'this is strings';

let strLength :number = (<string>someValue).length;
```

另一个为 as 语法：

```plain
let someValue :any = 'this is strings';

let strLength :number = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在 TypeScript 里使用 JSX 时，只有 as 语法断言是被允许的。


###总结

通过以上的介绍相信对 ts 的数据类型已经有了大概的了解，其实相对于 js,ts 的数据类型并没有做什么变更，只是在声明其数据类型的时候必须明确的指定其相应的数据类型，否则代码编译会报错。虽然 ts 的文件是 xxx.ts 但由于编译过后和 js 没有什么大的不同点，能够很好的运行在浏览器端，其中 class、public 等等函数及模块编译过后的 js 能后让你更深入的了解 js

用 let 关键字来代替大家所熟悉的 JavaScript 关键字 var。 let 关键字是 JavaScript 的一个新概念，TypeScript 实现了它。 很多常见的问题都可以通过使用 let 来解决，所以尽可能地使用 let 来代替 var 吧。


## TS 基础系列之-函数


### 介绍

函数是 JavaScript 应用程序的基础。 它帮助你实现抽象层，模拟类，信息隐藏和模块。 在 TypeScript 里，虽然已经支持类，命名空间和模块，但函数仍然是主要的定义 行为的地方。 TypeScript 为 JavaScript 函数添加了额外的功能，让我们可以更容易地使用。


1.函数的创建

在 ts 中函数创建也氛围两种匿名函数和有命名的函数

```plain
//函数的创建
//有名字的函数
function people(x){
    return x;
}

//匿名函数
let z=100;
const people1 =function(x){
    return x+z;
} 
const result  = people1(1)
```


2.函数的参数类型和返回值类型

⚠️只要参数类型是匹配的，那么就认为它是有效的函数类型，而不在乎参数名是否正

⚠️设定了类型之后必须要返回相对应的类型，否则会报错

⚠️如果函数没有返回任何值，也必须指定返回值类型为 void 而不能留空

```plain
//2.函数的参数类型和返回值类型

/**
 * @param {*} x number
 * @param {*} y number
 * return number
 */

 const add = (x:number,y:number):number=>x+y

 const addResult  = add(1,1);

 //书写完整类型
const myadd :(baseValue:number,increment:number)=>number =(x:number,y:number):number=>x+y;
```

3.函数的可选参数和默认参数

⚠️传递给一个函数的参数个数必须与函数期望的参数个数一致，否则会报错

⚠️可选参数用?argname 表示，必须跟在必须参数后面

⚠️没有传递参数或传递的值是 undefined，这种叫做默认初始化值的参数

⚠️所有必须参数后面的带默认初始化的参数都是可选的，调用时可省略

⚠️带默认值的参数如果出现在必须参数前面，用户必须明确的传入 undefined 值来获得默认值

⚠️当传入的参数个数不固定时，将所有参数收集到一个变量里和 js 中的 arguments 类似，剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个表达方式为（...）

```plain

//1.参数个数必须与函数期望的参数个数一致，否则会报错

const myadd :(baseValue:number,increment:number)=>number =(x:number,y:number):number=>x+y;
myadd(1)//报错
myadd(1,2)
myadd(1,2,3)//报错


//2.可选参数用?argname表示，必须跟在必须参数后面

const buildName = (firstName:string,lastName?:string)=>firstName+lastName

console.log(buildName('liu'))//liuundefined
console.log(buildName('liu','shuai'))//liushuai


//没有传递参数或传递的值是undefined，这种叫做默认初始化值的参数

const buildName1 = (firstName:string,lastName?:string)=>firstName+lastName

console.log(buildName1('liu'))//liuundefined
console.log(buildName1('liu',undefined))//liuundefined

//所有必须参数后面的带默认初始化的参数都是可选的，调用时可省略

const buildName2 = (firstName:string,lastName='shuai')=>firstName+lastName

console.log(buildName2('liu'))//liushuai
console.log(buildName2('liu','shuai'))//liushuai

//带默认值的参数如果出现在必须参数前面，用户必须明确的传入 undefined 值来获得默认值

const buildName3 = (lastName='shuai',firstName:string)=>firstName+lastName

console.log(buildName3('shuai','liu'))//liushuai
console.log(buildName3(undefined,'shuai'))//shuai shuai



//当传入的参数个数不固定时，将所有参数收集到一个变量里和 js 中的 arguments 类似，剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个表达方式为（...）

const buildName4 = (firstName:string,...otherName:string[]):string=>firstName+otherName.join('')

console.log(buildName4('liu'))//liu
console.log(buildName4('shuai','age','24'))//shuaiage24

```

4.函数的重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理

```plain

// 我们来实现一下通过传入不同的 type 来实现函数的加操作和乘法操作并返回相应的类型
const compute = (type: number, ...resetData: number[]):number | string => {
    if (type === 1 ) {
      return resetData.reduce((a:number, b:number):number => a + b);
    } else if (type === 2) {
      return String(resetData.reduce((a:number, b:number):number => a * b));
    }
  } 
  console.log(compute(1, 3, 4, 5, 6)) // 18
  console.log(compute(2, 3, 4, 5, 6)) // '360'
  
  // 通过上面的实现唯一的缺点就是不能明确通过type返回的相对应的计算的值和类型
  
  const compute1 = (type: number, ...resetData: number[]):number;
  const compute2 = (type: number, ...resetData: number[]):string;
  const compute3= (type: number, ...resetData: number[]):number | string => {
    if (type === 1 ) {
      return resetData.reduce((a:number, b:number):number => a + b);
    } else if (type === 2) {
      return String(resetData.reduce((a:number, b:number):number => a * b));
    }
  } 
  console.log(compute3(1, 3, 4, 5, 6)) // 18
  console.log(compute3(2, 3, 4, 5, 6)) // '360'
  
  // 上例中，我们重复定义了多次函数 compute，前几次都是函数定义，最后一次是函数实现。
```

5.this 和箭头函数（Lambads）

非常好的使用方式

```plain
let MathName = {
  person:['Mike','Joken','Amada'],
  getName:function(){
    return ()=>{
      let index = Math.floor(Math.random()*3);
      return {
        n:this.preson[index]
      }
    }
  }
}
let myname = MathName.getName();
alert(myname().n)
```

## TS 基础系列之-类

### 声明一个 ts 类

```plain
class Person{
    //声明变量为公有变量
    name:string;
    age:number;
    //构造函数参数遵循函数参数的书写形式
    constructor(name:string,age:number){
        this.name = name;
        this.age = age;
    }
    say(){
        return 'my name is ' + this.name + 'age is ' +this.age;
    }
}
let person = new Person('liushuai',24);
console.log(person.say())
```

### 类的继承

ts 中类的集成和 ES6 类似

```plain
//继承

class Student extends Person{
    school:string;
    constructor(name:string,age:number,school:string){
        super(name,age);
        this.school = school;
    }
    study(){
        console.log('good good study,day day up ')
    }
}

let student = new Student('liushuai',24,'🏫');
console.log(student.say())
console.log(student.school)
student.study()
```

### 公共，私有与受保护的修饰符

和大多数面向对象语言相同，TypeScript 也具有访问修饰符，TypeScript 的访问修饰符有两种：

1.public 公有的
2.private 私有的

```plain


class Animal{
    //默认为 public 共有的
    public color:string;
    //当成员被标记成 private时，它就不能在声明它的类的外部访问 私有的
    private age:number;
    //与 private修饰符的行为很相似，但有一点不同， protected成员在派生类中仍然可以访问 受保护的
    protected name:string;
    constructor(color:string,name:string,age:number){
        this.color = color;
        this.name = name;
        this.age  =age;
    }
    //public 共有的
    public sayColor(){
        return this.color;
    }
    //它就不能在声明它的类的外部访问 私有的
    private sayAge(){
        console.log(this.age)
    }
    //受保护的成员方法，不能再类的外部直接访问
    protected sayName(){
        console.log(this.name)
    }
}
let animal = new Animal('red','dog',1)
class Snake extends Animal{
    constructor(color:string,name:string,age:number){
        super(color,name,age)
    }
    print(){
        return this.color+this.name +this.age//age报错，父类得不到
    }
}
let snake  = new Snake('green','snake',2)
console.log(snake）
```

### get、set

由上面访问修饰符知道，私有属性在外部是无法得到的，并且在子类中无法得到。所以就可以通过 set、get 来对私有属性进行修改和查看。

通过 set 和 get 来对 private 修饰的属性提供外部访问接口。

```plain
class Hello {
    private _name : string = 'hello';
    private _age : number;
    tell(){
        return this.name;
    }
    get name() : string {
        return this._name;
    }
    set name(newName : string){
        this._name = newName;
    }
    get age() : number{
        return this._age;
    }
    set age(newAge : number) {
        if(newAge >=200 && newAge <0){
            alert('请正确填写年龄')
        }else{
            this._age = newAge;
        }
    }
}
var hello = new Hello();
hello.name = 'hello';
hello.age = 200;
console.log(hello.age)
```
### static

使用 static 声明的属性和方法是静态的，编译成 es5 之后被挂载到构造函数上。

```plain
class Person {
    static name1 : string = 'Person';
    tell(){
        console.log('姓名:' + Person.name1);
    }
}
const p = new Person();
console.log(p.tell());
```

### 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 abstract 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```plain
abstract class Demo{
    constructor(public name:string){
    }
    printName():void{
        console.log(this.name + 'name')
    }
    abstract fun1():void;// 必须在派生类中实现
    abstract fun2():void;// 必须在派生类中实现

}
class Demos extends Demo{
    constructor(){
        super('demo1') // 在派生类的构造函数中必须调用 super()
    }
    fun1():void{
        console.log('类的实现')
    }
    fun2():void{
        console.log('第二个类的实现')
    }
    fun3():void{
        console.log('不是抽象类派生的')
    }
}
let demo:Demo;
// let demo = new Demo()//报错不能创建一个抽象类的实例

let demos = new Demos(); // 允许对一个抽象子类进行实例化和赋值
demos.fun1()
// demo.fun3()报错 方法在声明的抽象类中不存在
```

## 接口

### 初探接口

接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约

```plain
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

### 可选属性

```plain

interface SquareConfig{
    color?:string;
    size:number;
}
function creatSquare(config:SquareConfig):{color:string,area:number}{
    let newSquare = {color: "white", area: 100};
    if(config.color){
        newSquare.color = config.color;
    }
    return newSquare;
}

creatSquare({color:'red',size:11})
```

### 函数类型

函数参数类型统一定义，通过定义一个接口，来实现多个函数使用定制好的规则，而且并不会检查传入参数名是否一样，只会检查传入参数的类型。


```plain
// 定义接口,并且每个数据类型
interface SearchFunc{
    (source:string,substring:string):boolean;
}

//定义变量接受类型

let mysearch : SearchFunc;
// 声明函数,传入的参数名不用和设置名称一样,只要传入的参数类型是一值即可
mysearch = function(src:string,sub:string):boolean{
    // 函数设置了指定返回值为布尔值
    let results = src.search(sub)
    return results>-1;
}
```

### 可索引的类型

与使用接口描述函数类型差不多

```plain
//可索引的类型

interface StringArray{
    [index:number]:string;
}
let myString :StringArray;
// myString = [1,2,3] 报错
myString = ['red','blue','orange']
```




### 混合类型定义接口

一个接口是可以继承多个接口的，
变量名 = <接口名称>{} 这样变量就可以使用接口上面的属性，来定义赋值等

```plain
// 混合型 的接口定义
interface Counter {
// 一个对象可以同时做为函数和对象使用，并带有额外的属性
(start: number): string;
reset(): void;
// 为了方便演示继承分开写了,可以把所有定义值类型写在这一个里面

}
interface Shape { interval: number; }

// 一个接口继承多个接口 定义好的属性值
interface listCounter extends Counter, Shape{
sideLength: number; // 里面还可以自己在加定义属性值
}
// 混合类型使用
function getCounter(): listCounter {
// 使用Counter声明好的接口,来定义函数
let counter = <listCounter>function (start: number) { };
counter.interval = 123;
counter.reset = function () { };
return counter; // 返回函数体listCounter
}

let c = getCounter();
c(10); // 执行函数传入值
c.reset(); // 执行里面附带的方法,虽然没写内容
c.interval = 5.0; // 赋值
```

## Mixins




class Name implements 每个类名{} 把类当成了接口引入，但是要自己去实现接口


```plain
//首先定义了两个类，它们将做为mixins
//可以看到每个类都只定义了一个特定的行为或功能。 稍后我们使用它们来创建一个新类，同时具有这两种功能。
class Disposable{
    isDisposable:boolean;
    dispose(){
        this.isDisposable = true;
    }
}

class ActiveAble{
    isActiveable:boolean;
    deactive(){
        this.isActiveable =true;
    }
}

//下面创建一个类，结合了这两个mixins;使用 implements

class SmartObject implements Disposable,ActiveAble{
    //extends而是使用implements。 把类当成了接口，仅使用Disposable和Activatable的类型而非其实现。 
    //这意味着我们需要在类里面实现接口。 但是这是我们在用mixin时想避免的

    //提前定义一些占位属性
    //Disposable
    isDisposable:boolean = false;
    dispose:()=>void;
    //ActiveAble
    isActiveable:boolean = false;
    deactive:()=>void;
   
   
}

 //最后，把mixins混入定义的类，完成全部实现部分
applyMixins(SmartObject,[Disposable,ActiveAble])

function applyMixins(der:any,base:any[]){
    base.forEach(baseitem=>{
        Object.getOwnPropertyNames(baseitem.prototype).forEach(name=>{
            der.prototype[name] = baseitem.prototype[name]
        })
    })
}
```

## 泛型


### 认识泛型

```plain
//首先写一个函数会返回任何传入它的number。

// function helloNum (arg:number):number{
//     return arg;
// }

//需求又改为 函数会返回任何传入它的值，第一反应应该是想到any

// function helloNum (arg:any):any{
//     return arg;
// }

//但是问题有了他没有明显的规范，容易出现转换错误

//那么9⃣就的使用泛型  泛型需要 <T>

function helloNum <T>( arg:T):T{
    return arg;
}
//使用的好处,需要什么类型指定什么类型

let helloNumString = helloNum<string>('hello Mike')

```

### 应用泛型

```plain
//泛型的应用

//泛型不一定<>里非得写<T>;可以随意写入大写<K>;通常是用<T>

function helloStr<T>(arg:T):T{
    //console.log(arg.length)//这里会报错
    return arg;
}

//而我们这么写

function helloArr<T>(args:T[]):T[]{

    console.log(args.length)//这里不会报错
    return args;
}

//总结泛型会根据你传递的类型而决定他会具有哪些属性
let list:Array<string>=helloArr<string>(['1','2','3'])
```

### 泛型类型

```plain
//泛型类型

function helloDemo<T>(arg:T):T{
    return arg;
}

let myHelloDemo:<K>(arg:K)=>K = helloDemo;
//或者
let myHelloDemo1:{<T>(arg:T):T} = helloDemo;
```

### 泛型类

```plain
//泛型类
class  HelloNumber<T>{
    Ten:T;
    add:(x:T,y:T)=>T;
}

var myHelloNumber = new HelloNumber<number>();
myHelloNumber.Ten = 10;

myHelloNumber.add = function(x,y){
    return x+y;
}
alert(myHelloNumber.Ten)
alert(
    myHelloNumber.add(10,10))
    
```

## Module 模式和 namespace


Module 模式：1 模块话，可重用 2.封装变量与函数


```plain
interface StringValidator{
 isAcceptable(s : string) : boolean;
}
let lettersRegexp = (str) => /^[A-Za-z]+$/.test(str);
let numberRegexp = (str) => /^[0-9]+$/.test(str);
class LetterOnlyValidator implements StringValidator{
 
isAcceptable(s : string) : boolean{
    return lettersRegexp(s);
}
}
class ZipCodeValidor implements StringValidator{
 isAcceptable(s:string):boolean{
     return s.length == 5 && numberRegexp(s);
 }
}
```

每一次使用在这里都需要调用。

TypeScript 中早期使用 module 来作为模块化。

```plain
//module.ts
export module Validation{
     export interface StringValidator{
         isAcceptable(s : string) : boolean;
     }
     let lettersRegexp = (str) => /^[A-Za-z]+$/.test(str);
     let numberRegexp = (str) => /^[0-9]+$/.test(str);
     export class LetterOnlyValidator implements StringValidator{
         isAcceptable(s : string):boolean {
             return lettersRegexp(s);
         }
     }
     export class ZipCodeValidor implements StringValidator{
         isAcceptable(s : string) : boolean{
             return numberRegexp(s);
         }
     }
 }
```


由于 1.5 版本的更新和 ES6 的出现，把 module 改成了 namespace

```plain
namespace Validation{
    export interface StringValidator{
        isAcceptable(s : string) : boolean;
    }
    const lettersRegexp = (str) => /^[A-Za-z]+$/.test(str);
    const numberRegexp = (str) => /^[0-9]+$/.test(str);
    export class LettersOnlyValidator implements StringValidator{
        isAcceptable(s : string) : boolean {
            return lettersRegexp(s);
        }
    }
    export class ZipCodeValidator implements StringValidator{
        isAcceptable(s : string) :boolean {
            return numberRegexp(s);
        }
  
```

  


















 










