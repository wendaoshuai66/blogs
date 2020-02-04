# React 入门必学【上】

## 什么是 React

React 是 Facebook 开发的一款用来构建用户界面的 js 库，对于 react 来讲还可以应用到 nodejs，做同构化应用。 对于 React 自己来说，React 只做的是非常纯粹的 View 层。React 结合自己庞大的组件库，形成了 MVVM 框架。


React Native 版本，可以用一套程序写 IOS、安卓各种客户端。

## React 特性

### Virtual DOM

Virtual DOM 是一个模拟 DOM 树的 JavaScript 对象。React 使用 Virtual DOM 来渲染 UI，同时监听 Virtual DOM 上数据的变化，并自动迁移到 UI 上。

### state

React 有一个叫做 state 的概念。state 是状态，整个 React 都是通过状态来驱动的，只要状态变换，React 就会驱动 View 变化，View 变化就会启动 VirtualDOM 的 diff 算法，通过 diff 算法找到 DOM 元素最小的变化，从而实现最小的操作 DOM 元素。

### props

props 是 React 中的属性，通过属性可以做到父子组件间的通信。


### JSX 语法

JSX 语法是 React 定义的一种 JavaScript 语法扩展，类似于 XML。jSX 是可选的，在开发过程中也可以不使用 JSX，使用 JavaScript 来编写 React 应用(建议使用)。

### components

React 是专注于 View 层开发的，View 是基于组件的，每一个 JSX 是一个组件。组件化开发可以创建可复用的 UI 组件，提高开发效率。


## 组件 & Props & 元素渲染


组件可以将 UI 切分成一些独立的、可复用的部件，这样你就只需专注于构建每一个单独的部件。

组件从概念上看就像是函数，它可以接收任意的输入值（称之为“props”），并返回一个需要在页面上展示的 React 元素。



## React JSX 语法学习

### JSX 语法的介绍

JSX(JavaScript XML) 是基于 ECMAScript 的一种新特性一种定义带属性树结构的语法。它不是 XML 或者 HTML 的一种限制，可以说是对它们的一种。


[官网](https://zh-hans.reactjs.org/docs/introducing-jsx.html)


### JSX 语法的书写方式

JSX 语法有两种书写方式：一种是 ES5 的书写方式(现在不适用,还是要记一下吧，以免以后忘了)，一种是 ES6 的书写方式。

#### ES5 的方式

ES5 使用 React.crateClass 的方式来构建组件。

```plain
var Hello = React.createClass({
    render : function(){
        return <h1> {this.props.name}</h1>
    }
})
```

### ES6 的方式

ES6 采用新版本的 Class 来构建组件

```plain
"use strict";
class Hello extends React.Component{
    render(){
        return <h1>Hello</h1>
    }
}
```

上面了两种方式生成出来的叫组件，对应的 Hello 叫做组件名，简单理解就是 HTML 标签。但是要怎么注册这两个组件呢？上面两种方式的注册组件的方式相同。


```plain
ReactDOM.render(
    <Hello name="ESMA" />,
    document.getElementById('app')
)
```


使用 ReactDOM.render 把我们的组件传进去，然后再传一个 DOM 节点，相当于把组件里面的东西渲染到 id 为 app 的 DOM 元素里面。

这里传进去了 name 属性，在组件里面通过使用 this.props.name 获取。this.props 相当于 attribute。用于获取书写在组件标签中的属性。


### JSX 注意事项

1.React 的 JSX 里约定分别使用首字母大、小写来区分本地组件的类和 HTML 标签。并使用驼峰命令。

自定义组件：List，HTML 标签：html、htmlMessage

2.要使用 JavaScript 表达式作为属性值，只需要把这个表达式用一对大括号（{}）包起来，如果直接写值是需要用包起来。不需要用引号（“”）

如果需要写多行就需要写在()里面，多行书写 JSX 语法，只能有一个跟标签。 例如：

```plain
return(<div>
          <span></span>  
        </div>)
```


3.htmlFor 和 className

在 html 中 label 使用 for 属性、JSX 中使用 htmlFor，html 中 css 类使用 class，JSX 中使用 className

4.CSS in JS （React style)

JSX 允许在 js 中书写 css，相当于 js 中的一个对象

```plain
const style = {
     color:'red',
     fontSize : 38,
 }
 <div style={style}> <div/>
```

5.JSX 里需要加注释很容易，他们只是 js 表达式而已。只需要在一个标签的子节点内(非最外层)小心的用{}包围要注释的范围，在 JSX 中写注释和平常是有一些区别。

{/* 注释内容*/}


6.事件绑定

```plain
handleChange(e){
         console.log(e.target)
     }
     render(){
         return (<input onClick = {this.handleChange.bind(this)}/>)  //需要改变this    
     }
        
```



## DOM diff

DOM diff 是 DOM 比较算法。用于找到最小变化的 DOM 元素进行渲染，平行化比较，把重绘和重排做到最小化。

react 中 View 层的变化是基于 state 的，如果状态发生变化，组件中 render 函数就会重新执行。


### 流程图

![](https://wendaoshuai66.github.io/study/note/images/domedif流程图.png)

### DOM diff 算法流程

1.开始判断节点是否相同，如果节点不相同，就相当于修改了节点，React 重新创建一个节点；

2.如果节点相同，判断是否是自定义节点；

3.如果不是自定义节点(ReactDOM.render 也可以渲染 html 标签)，比较属性是否发生变化，如果属性变更新属性然后结束；

4.如果是自定义节点，或者说是我们自己写的组件，然后重新渲染，会渲染出一段 VirtualDOM（虚拟 DOM）,然后和以存在的 Virtual DOM 进行比较区别，最终渲染到页面。


## 非 DOM 属性的介绍

### dangerouslySetInnerHTML 警告

dangerouslySetInnerHTML 用于净化数据，预防 XSS 的攻击

```plain
let rawHTML = {
    //通过__html来构造出来，
    __html: "<h2>非dom属性：dangerouslySetInnerHTML标签</h2>"
}

 <div dangerouslySetInnerHTML={rawHTML}>

 </div>
```

### ref

如果在 JSX 中获取真正的 DOM 元素，可以使用 ref 这个属性。

在 html 元素中添加 ref 属性


```plain
<input type="text" ref= 'input'/>
```

如果想要取得这个 DOM 元素可以通过 ReactDOM.findDOMNode()来获取,并且需要在 React 生命周期的 componentDidMount 阶段

```plain
ReactDOM.findDOMNode(this.refs.input)   //获取到input元素

```

### key 提高渲染的性能

key 帮助 React 识别哪些项目已更改，已添加或已删除。应该为数组内部的元素赋予键，以使元素具有稳定的标识：key 必须在唯一的

```plain
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```
[参考官网](https://reactjs.org/docs/lists-and-keys.html#keys)

[关于 key 讨论](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/1)


注意：另外有个方式：推荐使用[shortid](https://github.com/dylang/shortid)生成唯一 key 的数组，和数据数组一起使用，省去提交数据时再重组数组。

案例：

```plain
import React from 'react';
import shortid from 'shortid';

class Demo extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      data: ['a', 'b', 'c']
    }
    this.dataKeys = this.state.data.map(v => shortid.generate());
  }
  
    deleteOne = index => { // 删除操作
        const { data } = this.state;
        this.setState({ data: data.filter((v, i) => i !== index) });
        this.dataKyes.splice(index, 1);
    }
    
    render() {
      return (
          <ul>
               {
                   data.map((v, i) => 
                    <li 
                        onClick={i => this.deleteOne(i)}  
                        key={this.dataKeys[i]}
                    >
                        {v}
                    </li>
                    )
               } 
            </ul>
      )
  }
}
// 稍微抽取，可以封装一个通用的组件复制代码

```


## React props and state

### Props

Props(properties)：属性，一个事物性质与关系，可以说组件是 React 的核心了，如果把组件比喻成一个管道，那么 props 就相当于输入。

props 可以定义在注册
件的地方，也可以在组件内部定义默认属性，无论在哪里定义，props 都是只读的。

props 可以应用于 JSX 中 html 的元素上，自定义组件的元素上(相当于给子组件传值)，也可以应用于值。



### 定义默认 props

ES5 和 ES6 定义默认的 props 是不相同的。

ES5

```plain
var Hello = React.createClass({
    getDefaultProps : function(){   //设置默认属性
         return { title : '133'};
    }
    propTypes : { //属性校验器，表示必须是string
        title : React.PropTypes.string,
    }  
}) 
```

上面使用 getDefauktProps 定义属性，propTypes 用于属性的类型检查。


ES6

ES6 同样有两种方法，由于 ES6 是使用 class 类来定义组件的，因此，这两种方法必须是静态。


```plain

export default class Hello extends React.Component{
    static defaultProps ={
        title : "Hello React",
    }
    static propTypes = {
        title : React.PropTypes.string,
    }
}

```

运行上面代码会发现报错。报错原因在 React.PropTypes.string，这是因为在 React15.5 之前类型检查是集成在 React 里面的，React15.5 之后被抽离了出来。所以需要下载 prop-types 包来解决这个问题。

```plain
npm install prop-types –save

```

再修改一下代码。

```plain
import propTypes from "prop-types";
export default class Hello extends React.Component{
    static defaultProps ={
        title : "Hello React",
    }
    static propTypes = {
        title :propTypes.string,
    }
}
```

这时候运行就不会报错了。

### state

state 在 React 中是状态，是组件自身所拥有的东西，并且可以自己设置和改变。

在开发过程中的状态都是我们自己来维护的，比如说发一个请求，请求发送成功会怎么样、失败会怎么样等等。

React 是基于状态的，就是在代码中定义了状态，只要在任何地方改变了状态，最初定义状态的地方就会发生改变。


### setState

React 如果想改变一个状态，那么必须通过 setState 切换撞他，每一次 setState 之后，Reader 就会重新渲染执行一次 render，就会触发 diff 算法进行计算，通过计算生出新的 Virtual Dom 和现在的 Virtual DOM 进行比较，发生变化之后执行一次更新。

### 使用 state

state 在 ES5 和 ES6 上都是不同的。

ES5

通过 getInitialState 方法来初始化状态。

```plain
var Hello = React.crateClass({
    getInitialState : function(){
        return {
            isloading : false,
        }
    }
})

```

ES6

```plain
export default class Hello extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isloading : false,
        }
    }
}
```

上面两种方式同样是通过 this.setState()改变状态。

以 ES6 为例

### Props 和 State 的比较

相同点

1.都是纯的 JS 对象，都包含这一些信息。

2.都会触发 render 更新；属性是开始渲染一次性触发 render，状态是每次状态改变都会触发 render

3.都具有确定性，渲染前初始化完成

区别

属性只传递一次，状态是不停的在更新。组件在运行时需要修改的就是状态，属性在组件内运行时是修改不了的。

比较
 
<table>


<th>

<td> Props	</td>
<td> State </td>
</th>


<tr>
<td>能否从父组件获取初始值？</td>
<td > 能 </td>
<td > 不能</td>
</tr>


<tr>
<td>能否由父组件修改？</td>
<td > 能 </td>
<td > 不能</td>
</tr>

<tr>
<td>能否在组件内部设置默认值？</td>
<td > 能 </td>
<td > 能</td>
</tr>

<tr>
<td>能否在组件内部修改？</td>
<td > 不能 </td>
<td > 能</td>
</tr>

<tr>
<td>能否设置子组件的初始值？</td>
<td > 能 </td>
<td > 不能</td>
</tr>

<tr>
<td>能否修改子组件的值？ ？</td>
<td > 能 </td>
<td > 不能</td>
</tr>


</table>








