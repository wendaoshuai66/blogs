# 探索 Redux 原理

## 前言

react 和状态管理 redux 是紧密结合的，而本身又没有任何联系。react 可以不使用 redux 管理状态，redux 也可以脱离 react 独立存在。随着 react 的项目越来越复杂，state 变的繁重，各种 prop 和 state 的转变让我们在开发过程中变得头晕眼花，react 本来就是一个专注于 UI 层的库，本不应该让繁杂的 prop 和 state 的逻辑掺杂进来。于是 Flux 的架构出现了，Flux 架构模式用于抽离 react 的 state 能更好的去构建项目，Flux 架构模式的实践有好多中，显然 redux 是成功的。

### redux 的设计原则

redux 有三大设计原则

1.单一数据源

2.状态是只读的

3.使用纯函数编写 reducer

#### 单一数据源

整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。

这让同构应用开发变得非常容易。来自服务端的 state 可以在无需编写更多代码的情况下被序列化并注入到客户端中。由于是单一的 state tree ，调试也变得非常容易。在开发中，你可以把应用的 state 保存在本地，从而加快开发速度。此外，受益于单一的 state tree ，以前难以实现的如“撤销/重做”这类功能也变得轻而易举。

#### State 是只读的

唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

这样确保了视图和网络请求都不能直接修改 state，相反它们只能表达想要修改的意图。因为所有的修改都被集中化处理，且严格按照一个接一个的顺序执行，因此不用担心竞态条件（race condition）的出现。 Action 就是普通对象而已，因此它们可以被日志打印、序列化、储存、后期调试或测试时回放出来。

```plain
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

#### 使用纯函数来执行修改

为了描述 action 如何改变 state tree ，你需要编写 reducers。

Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。刚开始你可以只有一个 reducer，随着应用变大，你可以把它拆成多个小的 reducers，分别独立地操作 state tree 的不同部分，因为 reducer 只是函数，你可以控制它们被调用的顺序，传入附加数据，甚至编写可复用的 reducer 来处理一些通用任务，如分页器。

```plain
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'
let reducer = combineReducers({ visibilityFilter, todos })
let store = createStore(reducer)
```

### redux 的四个角色

redux 提供了一系列规则来规定我们来写代码。可以大致分为四个角色：

#### 1.action

action 是承载状态的载体，一般 action 将视图所产出的数据，发送到 reducer 进行处理。action 的书写格式一般是这样：

```plain
const addAction = {
    type:"ADD",
    value:.....
}
```

action 其实就是一个 JavaScript 对象，它必须要有一个 type 属性用来标识这个 action 是干嘛的(也可以认为家的地址，去 reducer 中找家)，value 属性是 action 携带来自视图的数据。

action 的表示方式也可以是一个函数，这样可以更方面的构建 action,但这个函数必须返回一个对象。

```plain
const addAction = (val) => ({
    type:"ADD",
    value: val
})
```

这样拿到的数据就灵活多了。

对于 action 的 type 属性，一般如果 action 变的庞大的话会把所有的 type 抽离出来到一个 constants 中，例如：

```plain
const ADDTODO = 'ADDTODO',
const DELETETODO = 'DELETEDOTO'

export {
    ADDTODO,
    DELETETODO,
}
```

这样可以让 type 更清晰一些。

#### 2.reducer

reducer 指定了应用状态的变化如何响应 actions 并发送到 store。 在 redux 的设计原则中提到使用纯函数来编写 reducer，目的是为了让 state 变的可预测。reducer 的书写方式一般是这样：

```plain
 const reducer = (state ={},action){
     switch(action.type){
         case :
            ......
         case :
            ......
         case :
            ......
         default :
            return state;
     }
 }
```

使用 switch 判断出什么样的 action 应该使用什么样的逻辑去处理。


拆分 reducer

当随着业务的增多，那么 reducer 也随着增大，显然一个 reducer 是不可能的，于是必须要拆分 reducer，拆分 reducer 也是有一定的套路的：比如拆分一个 TodoList，就可以把 todos 操作放在一起，把对 todo 无关的放在一起，最终形成一个根 reducer。

```plain
function visibilityFilter(state,action){
    switch(action.type){
        case :
            ......
        case :
            ......
        default :
            return state;
    }
}
function todos(state,action){
    switch(action.type){
        case :
            ......
        case :
            ......
        default :
            return state;
    }
}
//根reducer
function rootReducer(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action), 
    todos: todos(state.todos, action)
  }
}

```

这样做的好处在于业务逻辑的分离，让根 reducer 不再那么繁重。好在 redux 提供了 combineReducers 方法用于构建 rootReducer

```plain
const rootReducer = combineReducers({
    visibilityFilter,
    todos,
})
```

这部分代码和上面 rootReducer 的作用完全相同。它的原理是通过传入对象的 key-value 把所有的 state 进行一个糅合


#### 3.dispatch

dispatch 的作用是派发一个 action 去执行 reducer。我觉得 dispatch 就是一个发布者，和 subscribe 一起组合成订阅发布者模式。使 dispatch 派发：

```plain

const action = {
    type: "ADD",
    value: "Hello Redux",
}
dispatch(action);

```

#### 4.store

store 可以说是 redux 的核心了。开头也提到 store 是 redux 状态管理的唯一数据源，除此之外，store 还是将 dispatch、reducer 等联系起来的命脉。

store 通过 redux 提供的 createStore 创建，它是一个对象，有如下属性：

store.getState() 获取状态的唯一途径
store.dispatch(action) 派发 action 响应 reducer
store.subscribe(handler) 监听状态的变化

创建 store：

```plain
const store = Redux.createStore(reducer,initialState,enhancer);
//1. reducer就是我们书写的reducer
//2. initialState是初始化状态
//3. enhancer是中间件
```

### Middleware

在创建 store 的时候 createStore 是可以传入三个参数的，第三个参数就是中间件，使用 redux 提供的 applyMiddleware 来调用，applyMiddleware 相当于是对 dispatch 的一种增强，通过中间件可以在 dispatch 过程中做一些事情，比如打 logger、thunk(异步 action)等等。

使用方式如下：

```plain
//异步action中间件
import thunk from "redux-thunk";
const store = Redux.createStore(reducer,initialState,applMiddleware(thunk));
```

学习先告一段落，既然懂得了 redux 的思想（参考：https://redux.js.org/basics/usage-with-react，https://redux.js.org/basics/usage-with-react），那么接下来探索并手写一个简易版的 redux。


## 手写一个 min-Redux

### createStore

要想了解 redux，必然要先了解它的核心，它的核心就是 createStore 这个函数，store、getState,dispatch 都在这里产出。我个人觉得 createStore 是一个提供一系列方法的订阅发布者模式：通过 subscribe 订阅 store 的变化，通过 dispatch 派发。那么下面就来实现一下这个 createStore。

从上面 store 中可以看出。创建一个 store 需要三个参数；

```plain
/1.接受的rootReducer
//2.初始化的状态
//3.dispatch的增强器(中间件)
const createStore = (reducer,initialState,enhancer) => {
    
};
```

createStore 还返回一些列函数接口提供调用

```plain
const crateStore = (reducer, initialState, enhancer) => {
    
    return {
        getState,
        dispatch,
        subscribe,
        replaceReducer,
    }
}
```

#### getState 的实现

```plain
let state = initialState;
const getState = () => {
    return state;
}
```

#### subscribe 的实现

subscribe 是 createStore 的订阅者，开发者通过这个方法订阅，当 store 改变的时候执行监听函数。subscribe 是典型的高阶函数，它的返回值是一个函数，执行该函数移除当前监听函数。

```plain
//创建一个监听时间队列
let subQueue = [];

const subscribe = (listener) => {
    //把监听函数放入到监听队列里面
    subQueue.push(listener);
    return () => {
        //找到当前监听函数的索引
        let idx = subQueue.indexOf(listener);
        if(idx > -1){
            //通过监听函数的索引把监听函数移除掉。
            subQueue.splice(idx,1);
        }
    }
}
```

#### dispatch 的实现

dispatch 是 createStore 的发布者，dispatch 接受一个 action，来执行 reducer。dispatch 在执行 reducer 的同时会执行所有的监听函数(也就是发布)。

```plain
let currentReducer = reducer;
let isDispatch = false;
const dispatch = (action) => {
    //这里使用isDispatch做标示，就是说只有当上一个派发完成之后才能派发下一个
    if(isDispatch){
        throw new Error("dispatch error");
    }
    try{
        state = currentReducer(state,action);
        isDispatch = true;
    }finally{
        isDispatch = false;
    }
    
    //执行所有的监听函数
    subQueue.forEach(sub => sub.apply(null));
    return action;
}
```

#### replaceReducer

replaceReducer 顾名思义就是替换 reducer 的意思。再执行 createState 方法的时候 reducer 就作为第一个参数传进去，如果后面想要重新换一个 reducer，来代码写一下。

```plain
const replaceReducer = (reducer) => {
    //传入一个reduce作为参数，把它赋予currentReducer就可以了。
    currentReducer = reducer;
    //更该之后会派发一次dispatch，为什么会派发等下再说。
    dispatch({type:"REPLACE"});
}
```

#### dispatch({type:”INIT”});

上面已经实现了 createStore 的四个方法，剩下的就是 replaceReducer 中莫名的派发了一个 type 为 REPLACE 的 action，而且翻到源码的最后，也派发一个 type 为 INIT 的 action，为什么呢？

其实当使用 createStore 创建 Store 的时候，我们都知道，第一个参数为 reducer，第二个参数为初始化的 state。当如果不写第二个参数的时候，我们再来看一下 reducer 的写法

```plain
const reducer = (state = {}, action){
    switch(action.type){
        default:
            return state;
    }
}
```

一般在写 reducer 的时候都会给 state 写一个默认值，并且 default 出默认的 state。当 createStore 不存在，这个默认值如何存储在 Store 中呢？就是这个最后派发的 type:INIT 的作用。在 replaceReducer 中派发也是这个原因，更换 reducer 后派发。

#### 完整的 createStore

```plain
/**
 * 
 * @param {*} reducer   //reducer
 * @param {*} initState    //初始状态
 * @param {*} middleware   //中间件
 */
const createStore = (reducer, initState,enhancer) => {

    let initialState;       //用于保存状态
    let currentReducer = reducer;        //reducer
    let listenerQueue = []; //存放所有的监听函数
    let isDispatch = false;

    if(initState){
        initialState = initState;
    }

    if(enhancer){
        return enhancer(createStore)(reducer,initState);
    }
    /**
     * 获取Store
     */
    const getState = () => {
        //判断是否正在派发
        if(isDispatch){
            throw new Error('dispatching...')
        }
        return initialState;
    }

    /**
     * 派发action 并触发所有的listeners
     * @param {*} action 
     */
    const dispatch = (action) => {
        //判断是否正在派发
        if(isDispatch){
            throw new Error('dispatching...')
        }
        try{
           isDispatch = true;
           initialState = currentReducer(initialState,action);
        }finally{
            isDispatch = false;
        }
        //执行所有的监听函数
        for(let listener of listenerQueue){
            listener.apply(null);
        }
    }
    /**
     * 订阅监听
     * @param {*} listener 
     */
    const subscribe = (listener) => {
        listenerQueue.push(listener);
        //移除监听
        return function unscribe(){
            let index = listenerQueue.indexOf(listener);
            let unListener = listenerQueue.splice(index,1);
            return unListener;
        }
    }

    /**
     * 替换reducer
     * @param {*} reducer 
     */
    const replaceReducer = (reducer) => {
        if(reducer){
            currentReducer = reducer;
        }
        dispatch({type:'REPLACE'});

    }
    dispatch({type:'INIT'});
    return {
        getState,
        dispatch,
        subscribe,
        replaceReducer
    }
}

export default createStore;`
```

### compose

在 redux 中提供了一个组合函数，如果你知道函数式编程的话，那么对 compose 一定不陌生。如果不了解的话，那我说一个场景肯定就懂了。

```plain
//有fn1，fn2，fn3这三个函数，写出一个compose函数实现一下功能
//1.  compose(fn1,fn2,fn3) 从右到左执行。
//2.  上一个执行函数的结果作为下一个执行函数的参数。
const compose = (...) => {
    
}
```

上面的需求就是 compose 函数，也是一个常考的面试题。如何实现实现一个 compose？一步一步来。

首先 compose 接受的是一系列函数。

```plain
const compose = (...fns) => {
    
}

```

从右到左执行，我们采用数组的 reduce 方法，利用惰性求值的方式。


```plain
const compose = (...fns) => fns.reduce((f,g) => (...args) => f(g(args)));

```

### applayMiddleware

redux 中的中间件就是对 dispatch 的一种增强，在 createStore 中实现这个东西很简单。源码如下：

```plain
const createStore = (reducer,state,enhancer) => {
    //判断第三个参数的存在。
    if(enhancer && type enhancer === 'function') {
        //满足enhance存在的条件，直接return，组织后面的运行。
        //通过柯里化的方式传参
        //为什么传入createStore？
            //虽然是增强，自然返回之后依然是一个store对象，所以要使用createStore做一些事情。
        //后面两个参数
            //中间件是增强，必要的reducer和state也必要通过createStore传进去。
        return enhancer(crateStore)(reducer,state);
    }
}
```

上面就是中间件再 createStore 中的实现。

中间件的构建通过 applyMiddleware 实现，来看一下 applyMiddleware 是怎么实现。由上面可以看出 applyMiddleware 是一个柯里化函数

```plain
const applyMiddleware = (crateStore) => (...args) => {
    
}
```

在 applyMiddleware 中需要执行 createStore 来得到接口方法。

```plain

const applyMiddleware =(...middlewares) => (createStore) => (...args) => {
    let store = createStore(...args);
    //占位dispatch，避免在中间件过程中调用
    let dispatch = () => {
        throw new Error('error')
    }
    let midllewareAPI = {
        getState: store.getState,
        dispatch,
    }
    //把middlewareAPI传入每一个中间件中
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    //增强dispatch生成，重写占位dispatch,把store的默认dispatch传进去，
    dispatch = compose(...chain)(store.dispatch);
    
    //最后把增强的dispatch和store返回出去。
    return {
        ...store,
        dispatch
    }
}
```
#### 如何写一个中间件

根据 applyMiddleware 中间件参数的传入，可以想出一个基本的中间件是这样的：

```plain
const middleware = (store) => next => action => {
    //业务逻辑
    //store是传入的middlewareAPI
    //next是store基础的dispatch
    //action是dispatch的action
}
```

#### 异步 action

在写逻辑的时候必然会用到异步数据的，我们知道 reducer 是纯函数，不允许有副作用操作的，从上面到现在也可以明白整个 redux 都是函数式编程的思想，是不存在副作用的，那么异步数据怎么实现呢？必然是通过 applyMiddleware 提供的中间件接口实现了。

异步中间件必须要求 action 是一个函数，根据上面中间件的逻辑，我们来写一下。

```plain
const middleware = (store) => next => action => {
    if(typeof action === 'function'){
        action(store.dispatch,store.getState);
    }
    next(action);
}
```

判断传入的 action 是否是一个函数，如果是函数使用增强 dispatch，如果不是函数使用普通的 dispatch。
