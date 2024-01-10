# JavaScript 函数式编程--下

## 函子

### 回顾范畴与容器

1.我们可以把”范畴”想象成是一个容器，里面包含两样东西。值(value)、值的变形关系，也就是函数。

2.范畴论使用函数，表达范畴之间的关系。

3.伴随着范畴论的发展，就发展出一整套函数的运算方法。这套方法 起初只用于数学运算，后来有人将它在计算机上实现了，就变成了今 天的”函数式编程。

4.本质上，函数式编程只是范畴论的运算方法，跟数理逻辑、微积 分、行列式是同一类东西，都是数学方法，只是碰巧它能用来写程 序。为什么函数式编程要求函数必须是纯的，不能有副作用?因为它 是一种数学运算，原始目的就是求值，不做其他事情，否则就无法满 足函数运算法则了。

### 函子

1.函数不仅可以用于同一个范畴之中值的转换们，还可以用于将一个范畴转成另一个范畴。这就涉及到了函子(Functor)。

2.函子是函数式编程里面最重要的数据类型，也是基本的运算 单位和功能单位。它首先是一种范畴，也就是说，是一个容器，包含了值和变形关系。比较特殊的是，它的变形关系可以依次作用于每一个值，将当前容器变形成另一个容器。

![函子](https://wendaoshuai66.github.io/study/note/images/hanzi.png)

### 容器与 Functor（函子）

1.$(...) 返回的对象并不是一个原生的 DOM 对象，而是对于原生对象的一种封装，这在某种意义上就是一个“容器”(但它并不函数 式)。

2.Functor(函子)遵守一些特定规则的容器类型。

（1.）Functor 是一个对于函数调用的抽象，我们赋予容器自己去调用函数的能力。

（2.）把东西装进一个容器，只留出一个接口 map 给容器外的函数，map 一个函数时，我们让容器自己来运行这个函数，这样容器就可以自由地选择何时何地如何操作这个函数，以致于拥有惰性求值、错误处理、异步调用等等非常牛掰的特性。

废话不多说，上代码：

```plain
//Container就是容器
function Container(x){
  this._val = x
}
Container.of=x=>new Container(x);
//函子的标志就是容器里有一个map方法，将容器里的每一个值映射到另一个容器中
Container.prototype.map =function(f){
  return  Container.of(f(this._val))
}
var container=Container.of(3).map(x=>x+1)
console.log(container._val)//4
```

es6 写法

```plain
class Functor{
    constructor(x){
        this._val = x
    }
    map(f){
        return new Functor(f(this._val))
    }
}
Functor.of=x=>new Functor(x)
var container=(new Functor(3)).map(x=>x+1)
var toUpperCase =(word)=>word.toUpperCase()
var container1 = Functor.of('abc').map(toUpperCase)
console.log(container1)
```

#### map

上面代码中，Functor 是一个函子，它的 map 方法接受函数 f 作为 参数，然后返回一个新的函子，里面包含的值是被 f 处理过的 (f(this.val))。 一般约定，函子的标志就是容器具有 map 方法。该方法将容器里 面的每一个值，映射到另一个容器。 上面的例子说明，函数式编程里面的运算，都是通过函子完 成，即运算不直接针对值，而是针对这个值的容器----函子。函 子本身具有对外接口(map 方法)，各种函数就是运算符，通过 接口接入容器，引发容器里面的值的变形。 因此，学习函数式编程，实际上就是学习函子的各种运算。由 于可以把运算方法封装在函子里面，所以又衍生出各种不同类型的函子，有多少种运算，就有多少种函子。函数式编程就变 成了运用不同的函子，解决实际问题。

#### of

你可能注意到了，上面生成新的函子的时候，用了 new 命令。这实在太不像函数式编程了，因为 new 命令是 面向对象编程的标志。 函数式编程一般约定，函子有一个 of 方法，用来生成新 的容器。

## MayBe 函子

函子接受各种函数，处理容器内部的值。这里就有一个问题，容器内部的值可能是一个空值（比如 null），而外部函数未必有处理空值的机制，如果传入空值，很可能就会出错。

```plain

Functor.of(null).map(s=> s.toUpperCase());
// TypeError
```

上面代码中，函子里面的值是 null，结果小写变成大写的时候就出错了。

Maybe 函子就是为了解决这一类问题而设计的。简单说，它的 map 方法里面设置了空值检查。

```plain
class Maybe extends Functor{
        map(f){
            return this._val ? Maybe.of(f(this._val)) :Maybe.of(null)
        }
    }
```

有了 Maybe 函子，处理空值就不会出错了。

```plain
Maybe.of(null).map(s=> s.toUpperCase());
// Maybe(null)
```

## Either 函子

我们的容器能做的事情太少了，try/catch/throw 并不是 “纯”的，因为它从外部接管了我们的函数，并且在这个 函数出错时抛弃了它的返回值。

Promise 是可以调用 catch 来集中处理错误的。

事实上 Either 并不只是用来做错误处理的，它表示了逻辑或，范畴学里的 coproduc。

条件运算 if...else 是最常见的运算之一，函数式编程里面，使用 Either 函子表达。

Either 函子内部有两个值：左值（Left）和右值（Right）。右值是正常情况下使用的值，左值是右值不存在时使用的默认值。

```plain
class Either extends Functor {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  map(f) {
    return this.right ?
      Either.of(this.left, f(this.right)) :
      Either.of(f(this.left), this.right);
  }
}

Either.of = function (left, right) {
  return new Either(left, right);
};
```

下面是用法。

```plain
var addOne = function (x) {
  return x + 1;
};

Either.of(5, 6).map(addOne);
// Either(5, 7);

Either.of(1, null).map(addOne);
// Either(2, null);

```

上面代码中，如果右值有值，就使用右值，否则使用左值。通过这种方式，Either 函子表达了条件运算。

Either 函子的常见用途是提供默认值。下面是一个例子。

```plain

Either
.of({address: 'xxx'}, currentUser.address)
.map(updateField);

```

上面代码中，如果用户没有提供地址，Either 函子就会使用左值的默认地址。

```plain
var Left = function(x) {
   this.__value = x;
}
var Right = function(x) {
   this.__value = x;
 }
Left.of = function(x) {
   return new Left(x);
}

Right.of = function(x) {
   return new Right(x);
}

```

```plain
// 这里不同!!!
Left.prototype.map = function(f) {
    return this;

}


Right.prototype.map = function(f) {

   return Right.of(f(this.__value));

}
```

Left 和 Right 唯一的区别就在于 map 方法的实 现，Right.map 的行为和我们之前提到的 map 函数一样。但是 Left.map
就很不同了:它不会对容器做任何事情，只是很简单地把这个容器拿进来又扔出 去。这个特性意味着，Left 可以用来传递一个错误 消息。

错误处理 Either 例如：

```plain

var getAge = user => user.age ? Right.of(user.age) : Left.of("ERROR!");
var k=getAge({name: 'stark', age: '21'}).map(age => 'Age is ' + age);
//=> Right('Age is 21')

var s=getAge({name: 'stark'}).map(age => 'Age is ' + age); //=> Left('ERROR!')

```

Left 可以让调用链中任意一环的错误立刻返回到调用链的尾 部，这给我们错误处理带来了很大的方便，再也不用一层又一 层的 try/catch。

##Ap 函子

函子里面包含的值，完全可能是函数。我们可以想象这样一种情况，一个函子的值是数值，另一个函子的值是函数。

```plain
class Ap extends Functor {
  ap(F) {
    return Ap.of(this.val(F.val));
  }
}


function addTwo(x) {
         return x + 2;
        }

Ap.of(addTwo).ap(Functor.of(2))// Ap(4)
```

## Monad 函子

Monad 函子的作用是，总是返回一个单层的函子。它有一个 flatMap 方法，与 map 方法作用相同，唯一的区别是如果生成了一个嵌套函子，它会取出后者内部的值，保证返回的永远是一个单层的容器，不会出现嵌套的情况

```plain
class Monad extends Functor {
  join() {
    return this.val;
  }
  flatMap(f) {
    return this.map(f).join();
  }
}

```

•1.Monad 就是一种设计模式，表示将一个运算过程，通过 函数拆解成互相连接的多个步骤。你只要提供下一步运算 所需的函数，整个运算就会自动进行下去。

•2.Promise 就是一种 Monad。

•3.Monad 让我们避开了嵌套地狱，可以轻松地进行深度嵌的函数式编程，比如 IO 和其他异步任务
•4.记得让上面的 IO 集成 Monad

## IO 函子

•1.真正的程序总要去接触肮脏的世界。

```plain
 function readLocalStorage(){
   return window.localStorage;
    }
```

.2.IO 跟前面那几个 Functor 不同的地方在于，它的 \_\_value 是一个函数。 它把不纯的操作(比如 IO、网络请求、DOM)包裹到一个函数内，从而延迟这个操作的执行。所以我们认为，IO 包含的是被包裹的操作的返回值。

.3.IO 其实也算是惰性求值。

.4. IO 负责了调用链积累了很多很多不纯的操作，带来的复杂性和不可维护性

废话不多说来段代码理解

```plain
import _ from 'lodash';
var compose = _.flowRight;
var IO = function(f) {
    this.__value = f;
}
IO.of = x => new IO(_ => x);
IO.prototype.map = function(f) {
    return new IO(compose(f, this.__value))
};
```

es6 写法

```plain
import _ from 'lodash';
var compose = _.flowRight;
class IO extends Monad{
    map(f){
    return IO.of(compose(f, this.__value))
   }
}
```

## 当下函数式编程最热的库

1、RxJS
frp => angular

2、cycleJS

3、lodashJS、lazy(惰性求值)

4、underscoreJS

5、ramdajs

## 函数式编程的实际应用场景

### 易调试、热部署、并发

1.函数式编程中的每个符号都是 const 的，于是没有什么函数会有副作用。 谁也不能在运行时修改任何东西，也没有函数可以修改在它的作用域之外修 改什么值给其他函数继续使用。这意味着决定函数执行结果的唯一因素就是 它的返回值，而影响其返回值的唯一因素就是它的参数。

2.函数式编程不需要考虑”死锁"(deadlock)，因为它不修改变量，所以根本 不存在"锁"线程的问题。不必担心一个线程的数据，被另一个线程修改，所 以可以很放心地把工作分摊到多个线程，部署"并发编程"(concurrency)。

3.函数式编程中所有状态就是传给函数的参数，而参数都是储存在栈上的。 这一特性让软件的热部署变得十分简单。只要比较一下正在运行的代码以及 新的代码获得一个 diff，然后用这个 diff 更新现有的代码，新代码的热部署就 完成了。

### 单元测试

严格函数式编程的每一个符号都是对直接量或者表达式结果的引用， 没有函数产生副作用。因为从未在某个地方修改过值，也没有函数修 改过在其作用域之外的量并被其他函数使用(如类成员或全局变量)。 这意味着函数求值的结果只是其返回值，而惟一影响其返回值的就是 函数的参数。

这是单元测试者的梦中仙境(wet dream)。对被测试程序中的每个函数， 你只需在意其参数，而不必考虑函数调用顺序，不用谨慎地设置外部 状态。所有要做的就是传递代表了边际情况的参数。如果程序中的每 个函数都通过了单元测试，你就对这个软件的质量有了相当的自信。 而命令式编程就不能这样乐观了，在 Java 或 C++ 中只检查函数的返 回值还不够——我们还必须验证这个函数可能修改了的外部状态。

### 总结与补充

函数式编程不应被视为灵丹妙药。相反，它应 该被视为我们现有工具箱的一个很自然的补充 —— 它带来了更高的可组合性，灵活性以及容错 性。现代的 JavaScript 库已经开始尝试拥抱函数式编 程的概念以获取这些优势。Redux 作为一种 FLUX 的变种实现，核心理念也是状态机和函数式编程。

软件工程上讲『没有银弹』，函数式编程同样也不是万能的，它与烂大街的 OOP 一样，只是一种编程范式而已。很多实际应用中是很难用函数式去表达的，选择 OOP 亦或是其它编程范式或许会更简单。但我们要注意到函数式编程的核心理念， 如果说 OOP 降低复杂度是靠良好的封装、继承、多态以及接口定义的话，那么函 数式编程就是通过纯函数以及它们的组合、柯里化、Functor 等技术来降低系统复 杂度，而 React、Rxjs、Cycle.js 正是这种理念的代言。让我们一起拥抱函数式编程， 打开你程序的大门!
