# React 入门必学【下】

## React 生命周期

每个软件都有从开始创建到运行到最终销毁的一段路程，这可以说成是软件的生命周期

组件本质是状态机，输入确定，输出一定的确定。状态发生转化时会触发不同的钩子函数，从而让开发者做出响应，可以用事件的思路理解状态。

初始化----》运行中----》销毁


### React16.3.0 之前生命周期:

16 版本之前的 react 组件的生命周期相信大家已经很熟悉。16 版本的 react 对组件的生命周期函数进行了一些修改,下面进行详细说明。

如图：

![](https://wendaoshuai66.github.io/study/note/images/react15生命周期.png)

![](https://wendaoshuai66.github.io/study/note/images/react15声明后期流程.png)

创建期:

```plain
1.constructor(props, context)

2.componentWillMount()

3.render()

4.componentDidMount()
```

运行时:
props 发生变化时

```plain


1.componentWillReceiveProps(nextProps, nextContext)

2.shouldComponentUpdate(nextProps, nextState, nextContext)

3.componentWillUpdate(nextProps, nextState, nextContext)

4.render

5.componentDidUpdate(prevProps, prevState, snapshot)

```

state 发生变化时

```plain

1.shouldComponentUpdate(nextProps, nextState, nextContext)

2.componentWillUpdate(nextProps, nextState, nextContext)

3.render

4.componentDidUpdate(prevProps, prevState, snapshot)

```

卸载时:

```plain
componentWillUnmount()
```

### React16.3.0 之后的生命周期

![](https://wendaoshuai66.github.io/study/note/images/react16周期-1.png)

![](https://wendaoshuai66.github.io/study/note/images/react16周期.png)

创建期:

```plain
1.constructor(props, context)

2.static getDerivedStateFromProps(props, status)

3.render()

4.componentDidMount()

或者如下生命周期:

1.constructor(props, context)

2.componentWillMount() / UNSAFE_componentWillMount()

3.render()

4.componentDidMount()
```

注意: getDerivedStateFromProps/getSnapshotBeforeUpdate 和 componentWillMount/componentWillReceiveProps/componentWillUpdate 如果同时存在，React 会在控制台给出警告信息，且仅执行 getDerivedStateFromProps/getSnapshotBeforeUpdate 【React@16.7.0】

运行时:

props 发生变化时

```plain
1.static getDerivedStateFromProps(props, status)

2.shouldComponentUpdate(nextProps, nextState, nextContext)

3.render

4.getSnapshotBeforeUpdate(prevProps, prevState)

5.componentDidUpdate(prevProps, prevState, snapshot)

或者如下生命周期:

1.componentWillReceiveProps(nextProps, nextContext)/

2.UNSAFE_componentWillReceiveProps

3.shouldComponentUpdate(nextProps, nextState, nextContext)

4.componentWillUpdate(nextProps, nextState, nextContext)

5.render

6.componentDidUpdate(prevProps, prevState, snapshot)
```

state 发生变化时

```plain
1.static getDerivedStateFromProps(props, status)

2.shouldComponentUpdate(nextProps, nextState, nextContext)

3.render

4.getSnapshotBeforeUpdate(prevProps, prevState)

5.componentDidUpdate(prevProps, prevState, snapshot)

或者如下生命周期:

1.shouldComponentUpdate(nextProps, nextState, nextContext)

2.componentWillUpdate(nextProps, nextState, nextContext)/

3.UNSAFE_componentWillUpdate

4.render

5.componentDidUpdate(prevProps, prevState, snapshot)
```

销毁时

```plain
componentWillUnmount()
```

### 生命周期详解

1.constructor(props, context)

constructor 生命周期，如不需要，可缺省。通常会在 constructor 方法中初始化 state 和绑定事件处理程序。
但是，如果写了 constructor，那么必须在其中调用 super(props);否则可能会引起报错

如:

```plain
class Base extends Component {
    constructor(props) {
        super();  //应该为 super(props);
    }
    state = {
        name: this.props.name
    }
    //....code
}
```

抛出异常: Uncaught TypeError: Cannot read property 'name' of undefined.

同样，如果定义了 context,在 state 中需要使用 this.context 去获取 context 上的内容，则需要 super(props, context);

不过，如果你缺省 constructor,那么在 state 中，可以放心的使用 this.props 或者是 this.context，不会引起报错。

```plain
class Base extends Component {
    state = {
        name: this.props.name,
        color: this.context.color
    }
    //....code
}
```

初始化的 state 同样可以在 constructor 中定义。如果需要给方法绑定 this，那么统一在 constructor 中进行。

2.static getDerivedStateFromProps(props, state)

当组件的 state 需要根据 props 来改变的时候可调用此方法。这个方法是在 render() 前会被执行，每次触发 render 前，都会触发此方法。

该方法有两个参数 props 和 state; 返回值为 state 对象, 不需要返回整体 state，把需要改变的 state 返回即可。如果不需要，可以返回 null.

```plain
class Base extends Component {
    state = {
        age: 20
    }
    static getDerivedStateFromProps(props, state) {
        return {
            age: 50
        }
    }
    render() {
        // 50
        return (
            <div>{this.state.age}</div>
        )
    }
}
```

这个方法允许组件基于 props 的变更来更新其内部状态,以这种方式获得的组件状态被称为派生状态。应该谨慎使用派生状态，可能会引入潜在的错误

3.render

React 组件中必须要提供的方法。当 state 或者 props 任一数据有更新时都会执行。

render() 是一个纯函数，因此，不要在其中执行 setState 诸如此类的操作。render 必须有一个返回值，返回的数据类型可以有:

null、String、Number、Array、Boolean。

React elements

Fragment

Portal


注意不要在 render 中调用 setState

4.componentDidMount

componentDidMount()方法是在组件加载完后立即执行，也就是当该组件相关的 dom 节点插入到 dom 树中时。该方法在组件生命中只执行一次。

一般情况，我们会在这里 setState(),或者进行接口请求，设置订阅等。

```plain
class Base extends Component {
    state = {
        age: 20
    }
    componentDidMount() {
        this.fetchDate();
    }
    render() {
        return (
            <div>{this.state.age}</div>
        )
    }
    //other code
}
```

5.shouldComponentUpdate(nextProps, nextState, nextContext)

在渲染新的 props 或 state 前，shouldComponentUpdate 被调用，默认返回 true。forceUpdate()时不会调用此方法。

如果 shouldComponentUpdate()返回 false，那么 getSnapshotBeforeUpdate,render 和 componentDidUpdate 不会被调用。

此生命周期主要用于优化性能。

6.getSnapshotBeforeUpdate(prevProps, prevState)

在 render()的输出被渲染到 DOM 之前被调用。使组件能够在它们被更改之前捕获当前值（如滚动位置）。这个生命周期返回的任何值都将作为第三个参数传递给 componentDidUpdate().

7.componentDidUpdate(prevProps, prevState, snapshot)

在更新发生后调用 componentDidUpdate()。当组件更新时，将此作为一个机会来操作 DOM。如将当前的 props 与以前的 props 进行比较（例如，如果 props 没有改变，则可能不需要网络请求。

如果组件使用 getSnapshotBeforeUpdate()，则它返回的值将作为第三个“快照”参数传递给 componentDidUpdate()。否则，这个参数是 undefined。

8.componentWillUnmount()

在组件被卸载并销毁之前立即被调用。在此方法中执行任何必要的清理，例如使定时器无效，取消网络请求或清理在 componentDidMount（）中创建的任何监听。

## 不可控组件 与 可控组件

### 不可控组件:

当一个表单元素设置了 defaultValue 属性的时候，那么这个组件就变成了不可控组件。

为什么这么说呢？

defaultValue 属性设置的值大多数情况下是不允许更改的，由于 React 的所有的 View 是基于状态的改变而动态渲染的，而设置了 defaultValue 是不允许更改，所以就可以称组件为不可控组件。


```plain
export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value : "hello React",
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(){
        this.setState({
            value : "hello world"
        })
        console.log(this.state.value);
    }
    render(){
        return (
            <input 
                onMouseEnter = {this.handleChange}
                defaultValue = {this.state.value}
            />
        )
    }
}


```

上面代码是：在 input 元素上设置 defaultValue 并监听 onMouseEnter 事件，当鼠标移入的时候，状态改变。可以从图上看出，状态改变但是 input 中的值并没有改变。

我们在书写代码的时候无法通过状态去控制组件，这就是不可控组件。

但是不可控组件并不是非不可控，通过 React.findDOMNode(this.refs.input).value 直接取到 DOM 元素就可以改变。修改一下上面代码。

```plain
export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value : "hello React",
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(){
        
        this.setState({
            value : "hello world"
        })
        console.log(this.state.value);
        ReactDOM.findDOMNode(this.refs.input).value = this.state.value;
    }
    render(){
        return (
            <input 
                onMouseEnter = {this.handleChange}
                defaultValue = {this.state.value}
                ref = "input"
            />
        )
    }
}
```

### 可控组件

当我们在表单元素上不使用 defaultValue 而使用 value 的使用，组件就变成了可控的了。

上面代码修改一下。

```plain

export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value : "hello React",
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(){
        
        this.setState({
            value : "hello world"
        })
        console.log(this.state.value);
    }
    render(){
        return (
            <input 
                onMouseEnter = {this.handleChange}
                value = {this.state.value}
            />
        )
    }
}
```

状态改变，值也改变了，我们发现报了个错。 这个错是因为使用 vlaue 必须配合一个事件来使用，要么用 onChange 要么把值设置成 readOnly。

把原来的代码 onMouseEnter 改成 onChange：

```plain
export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value : "hello React",
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        this.setState({
            value : e.target.value
        })
        
        console.log(this.state.value);
    }
    render(){
        return (
            <input 
                onChange = {this.handleChange}
                value = {this.state.value}
            />
        )
    }
}
```

可控组件的好处:

符合 React 的数据流

数据存储在 state 中，便于使用

便于对数据进行处理

## React 事件表

### 触摸事件

onTouchCancel

onTouchEnd

onTouchMove

onTouchStart

### 键盘事件

onKeyDown

onKeyPress

onKeyUp

### 剪切事件
onCopy

onCut

onPaste

### 焦点事件
onFocus

onBlur

### UI 元素
onScroll

### 滚动事件
onWheel

### 鼠标事件
onClick

onContextMenu

onDoubleClick

onMouseDown

onMouseEnter

onMouseLeave

onMouseMove

onMouseOut

onMouseOver

onMouseUp

### 拖拽事件
onDrop

onDrag

onDragEnd

onDragEnter

onDragExit

onDragLeave

onDragOver

onDragStart








