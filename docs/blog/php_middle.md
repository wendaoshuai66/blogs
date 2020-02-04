# Php 与 MySql 开发入门中

## PHP 面向对象的介绍

### 概念

在面向对象的程序设计（英语：Object-oriented programming，缩写：OOP）中，对象是一个由信息及对信息进行处理的描述所组成的整体，是对现实世界的抽象。

OOP 达到了软件工程的三个目标：重用性 灵活性 扩展性

OOP 特点：封装 继承 多态

### 面向对象过程（OOP）的内容 

- **类** − 定义了一件事物的抽象特点。类的定义包含了数据的形式以及对数据的操作。
- **对象** − 是类的实例。
- **成员变量** − 定义在类内部的变量。该变量的值对外是不可见的，但是可以通过成员函数访问，在类被实例化为对象后，该变量即可称为对象的属性。
- **成员函数** − 定义在类的内部，可用于访问对象的数据。
- **继承** − 继承性是子类自动共享父类数据结构和方法的机制，这是类之间的一种关系。在定义和实现一个类的时候，可以在一个已经存在的类的基础之上来进行，把这个已经存在的类所定义的内容作为自己的内容，并加入若干新的内容。
- **父类** − 一个类被其他类继承，可将该类称为父类，或基类，或超类。
- **子类** − 一个类继承其他类称为子类，也可称为派生类。
- **多态** − 多态性是指相同的操作或函数、过程可作用于多种类型的对象上并获得不同的结果。不同的对象，收到同一消息可以产生不同的结果，这种现象称为多态性。
- **重载** − 简单说，就是函数或者方法有同样的名称，但是参数列表不相同的情形，这样的同名不同参数的函数或者方法之间，互相称之为重载函数或者方法。
- **抽象性** − 抽象性是指将具有一致的数据结构（属性）和行为（操作）的对象抽象成类。一个类就是这样一种抽象，它反映了与应用有关的重要性质，而忽略其他一些无关内容。任何类的划分都是主观的，但必须与具体的应用有关。
- **封装** − 封装是指将现实世界中存在的某个客体的属性与行为绑定在一起，并放置在一个逻辑单元内。
- **构造函数** − 主要用来在创建对象时初始化对象， 即为对象成员变量赋初始值，总与 new 运算符一起使用在创建对象的语句中。
- **析构函数** − 析构函数(destructor) 与构造函数相反，当对象结束其生命周期时（例如对象所在的函数已调用完毕），系统自动执行析构函数。析构函数往往用来做"清理善后" 的工作（例如在建立对象时用 new 开辟了一片内存空间，应在退出前在析构函数中用 delete 释放）

### 如何抽象一个类

类的声名

成员属性

成员方法

## 构造方法与析构方法

```plain
class Person{
    public function __construct($name,$age)
    {
        //当这个类new的时候自动执行
        echo 'hello'.$name;
        echo '<hr/>';
        $this->name = $name;
        $this->age =$age;
    }
    public function data(){
        return $this->age;
    }
    public function __destruct()
    {
        echo 'bye'.$this->name;
        echo '<hr/>';
        // 可以进行资源的释放的操作 例如数据库关闭
        //对象被销毁的执行，没有代码被运行了
    }
}
new Person('first',11);
new Person('second',12);
```

## PHP 魔术方法

### 使用__get 可以访问私有属性

```plain
class Person{
    public $name = 'ls';//共有的
    private $age=23;//私有的
    protected $money =10;//受保护的
    //私有的成员方法，不能再类的外部直接访问
    private function getAge(){
        return $this->age;
    }
    //受保护的成员方法，不能再类的外部直接访问
    protected function getMoney(){
        return $this->money;
    }
    //共有的成员方法
    public function userCard(){
        return '我的钱有'.$this->getMoney().'我的年龄是'.$this->getAge();
    }
     //使用__get可以访问私有属性
    public function __get($name)
    {
        if($name==='age'){
            return '改值不能访问';
        }
    }

}
 $xw = new Person();
echo $xw->age;
```

### __set()：给类的私有属性赋值时调用，传递需设置的属性名。属性值

```plain
class Person{
    public $name = 'ls';//共有的
    private $age=23;//私有的
    protected $money =10;//受保护的
    //私有的成员方法，不能再类的外部直接访问
    private function getAge(){
        return $this->age;
    }
    //受保护的成员方法，不能再类的外部直接访问
    protected function getMoney(){
        return $this->money;
    }
    //共有的成员方法
    public function userCard(){
        return '我的钱有'.$this->getMoney().'我的年龄是'.$this->getAge();
    }
   //__set()：给类的私有属性赋值时调用，传递需设置的属性名。属性值
    public function __set($name, $value)
    {
        if($name === 'age' && $value === 23){
            $this->age = 30;
        }
    }

}
 $xw = new Person();
$xw->age =23;

echo $xw->userCard();
```

### ****************************************************************__isset()：和 __****************************************************************unset()

__isset()：检测对象私有属性时调用，传递检测的属性名，返回 isset($this->属性名)。

__unset()：使用 unset 函数删除对象的私有属性时调用，传递删除的属性名。方法中执行 unset($this->属性名)。

### _toString()：使用 echo 打印对象时调用，返回打印对象时想要显示的内容，返回必须是字符串

```plain
class Player{
    private $name;
    function __construct( $name ){
        $this->name = $name;
    }

    function __toString(){
        //__toString方法必须加一个return
        return $this->name;
    }
}

$player_1 = new Player( "kobe" );
echo $player_1;
```

### __call()：调用一个类中未定义的方法或者私有、受保护的方法时自动调用__call 函数。传递被调用的函数名及参数列表

```plain

class Player{
    public $name;
    function __construct( $name ){
        echo "构造函数<br>";
        $this->name = $name;
    }
    private function getName(){
        return $this->$name;
    }

    function __call( $funcName, $funcParams ){
        echo "调用的函数是$funcName, 参数列表是：";
        print_r( $funcParams );
    }
}

$player_1 = new Player( "kobe" );
echo $player_1->setName( "james" );
echo "<br>";
echo $player_1->getName();
echo "<br>";
```

### __clone()：当使用 clone 关键字克隆一个对象时自动调用，作用是为新克隆的对象初始化赋值

```plain
//禁止克隆对象
   private function __clone(){}
```

### _sleep()：对象序列化时自动调用，返回一个数组，数组中的值就是可以序列化的属性。可以定义 serialize()序列化时返回的数据

### __wakeup()：对象反序列化时调用，为反序列化新产生的对象进行初始化赋值

### serialize()序列化 unserialize()反序列化

为了传输方便，可以把对象转化程二进制，等到达另一端的时候，再还原成原来的对象。
1、一个对象再网络中传输的时候需要将对象串形化 2、把对象写入文件或者数据库的时候用到串形化

### autolaod()自动加载 可以理解程按需加载

autoload()是专门为很多类不存在设计的，很多框架利用这个实现了类文件的自动加载

```plain
function __autoload($classname)
{
    require_once $classname . 'php';
}

//当Myclass1不存在的时候，自动调用__autoload()函数，传入参数Myclass1;
$obj1 = new Myclass1();
$obj2 = new Myclass2();
```

## PHP 面向对象的继承和多态

子类中重载父类的方法：在子类中允许重写（覆盖）父类中的方法，在子类中，使用 parent 访问父类中被覆盖的属性和方法

例如：

```plain
parent::construct()
parent::fun()
```

重载：方法名一样根据传递的参数不一样调用。

```plain
class Person{
    public $name;//外部能访问，子类能继承
    private $age;//外部不能访问，子类不能继承
    protected $money;//外部不能访问，子类能继承
    public function __construct($name,$age,$money)
    {
        $this->name=$name;
        $this->age=$age;
        $this->money = $money;
    }
    public function getCard(){
        echo '名字'.$this->name.'年龄'.$this->age.'钱'.$this->money;
    }
}
class Yellow extends Person{
    //重写
    public function __construct($name, $age, $money)
    {
        //重载
        parent::__construct($name, $age, $money);
    }
    //重写
    public function getCard(){
        echo $this->money;//能够继承父类被保护的属性
        //重载
        parent::getCard();
    }
}
$s= new Yellow('xiaowang',18,10);
$s->getCard();
```



## PHP 抽象类与接口

### 抽象方法

我们在类里面定义的没有方法提的方法就是抽象方法。所谓的没有方法体指的是，在声明的时候没有大括号以及其中的内容，而是直接在声明时在方法名后加上分号结束，另外在声明抽象方法时方法还要加一个关键字"abstract"来修饰。

例如：

```plain
abstract function fun1(); 
abstract function fun2(); 
```

### 抽象类

只要一个类里面有一个方法是抽象方法，那么这个类就定义为抽象类，抽象类也要使用“abstract”关键字来修饰；在抽象类里面可以有不是抽象的方法和成员属性，但只要有一个方法是抽象的方法，这个类就必须声明为抽象类，使用“abstract”修饰。

抽像类的特点：不能实例化的，也就是不能 new 成对象；若想使用类，就必须定义一个类继承这个抽象类，并定义覆盖父类的抽象方法(实现抽象方法)。

例如：

```plain
abstract class demo{
var $test;
abstract function fun1();
abstract function fun2();
}
```

1.含有抽象方法的类必须是抽象类。

2.抽象类不一定非的含有抽象方法。

3.抽象类可以含有普通方法。

4.抽象类不能被实例化，必须有一个子类继承并且把抽象类的抽象方法实现。

```plain
abstract class Person{
    //抽象类中可以有普通方法
    public function eat(){
        echo '吃';
    }
    //抽象方法 没有方法体
    public abstract function run();
}
//抽象类必须有一个子类继承，并且实现抽象类中的抽象方法
class Man extends Person{
    function __construct()
    {
    }
    //抽象类中抽象方法必须在子类中实现
    public function run()
    {
        // TODO: Implement run() method.
        echo 'run';
    }
}
$man =new Man();
$man->eat();
$man->run();
```

### 接口

1.接口的关键字是 interface

2.接口可以声明常量也可以抽象一些方法。

3.接口中的方法都是抽象方法，不用 abstract 定义

4.接口不能被实例化，需要一个类去实现它。

5.一个类不能继承多个类，一个类可以实现多个接口

```plain
interface Person{
    //接口中可以声明常量，也可以抽象方法，抽象方法不用abstract去定义
    const name = "xiaowang";
    public function run();
    public function eat();
}
interface Study {
    public function study();
}
//一个类不可以继承多个类，但是一个类可以实现多个接口，并且接口中的抽象方法必须有子类实现
class Student implements Person,Study{
    const data = 3.14;
    function run()
    {
        // TODO: Implement run() method.
        echo 'run';
    }
    function eat()
    {
        // TODO: Implement eat() method.
        echo 'eat';
    }
    function study()
    {
        echo 'study';
    }
    function test(){
        return self::data;
    }
    //静态的方法
    static function test1(){
        return self::data;
    }
}
$xw = new Student();
echo $xw::name;
echo $xw->test();
echo $xw::test1();
```

## 关键字

**final：只能用来修饰类和方法，不能修饰成员属性**
特性：
使用 final 关键字标识的类不能被继承
使用 funal 关键字标识的方法不能被子类覆盖（重新），是最终版本
目的：
1.安全，2.没必要继承或重新

**static：用于修饰类的成员属性和成员方法（即静态属性和静态方法）**
类中的静态属性和方法不用实例化（new）就可以直接使用类名访问
格式：
类::$静态属性 类::$静态方法
在类的方法中，不能用 this->来引用变量或静态方法，而需要用 self 来引用
self::$静态属性 self::$静态方法
静态方法中不可以使用非静态的内容，就是不让用$this
静态属性是共享的，也就是 new 很多对象也是公用一个属性

**单例设计模式：一个类只能有一个实例对象存在**
静态属性是共享的，也就是 new 很多对象也是公用一个属性

**instanceof ：用于检测当前对象实例是否属于某一个类或这个类的子类**

php 中当 new 实例化一个不存在的类时，则自动调用此函数__autoload()，并将类名作为参数传入此函数。可 以使用这个实现类的自动加载。
对象串行化（序列化）
class_exists：检查类是否已定义
get_class_methods：返回由类的方法名组成的数组
get_class：返回对象的类名
get_object_vars：返回由对象属性组成的关联数组
get_parent_class：返回对象或类的父类名
is_a：如果对象属于该类或该类是此对象的父类，则返回 TRUE
method_exits：检查类的方法是否存在
property_exists：检查对象或类是否具有该属性

## 异常处理

系统自带的异常处理

```plain
try{
…
if($_GET['num']==1){
        throw new Exception('user');
    }
} catch(Exception $e) { // Exception错误类
echo “错误的文件：”;
echo $e -> getFile(); // 得到发生异常的文件
echo “错误的行：”;
echo $e -> getLine(); // 得到发生异常的行
echo “错误的代码：”;
echo $e -> getCode(); // 得到发生异常的代码
echo “错误信息：”;
echo $e -> getMessage(); // 异常信息
}
自定义异常处理
class myException extends Exception { // 继承错误类
…
}
捕捉多个异常处理
```

## PHP PDO

### 如何使用 PDO 连接数据库

```plain
<?php
header("Content-Type:text/html;charset=utf-8");
$dbms = "mysql";
$host = "localhost";
$dbName = "phplesson";
$user = "root";
$pass = "";
$dsn = "$dbms:host=$host;dbname=$dbName";
try {
    $dbh = new PDO($dsn, $user, $pass);
    $dbh -> query('set names utf-8');

    echo "连接成功！";
    $newstitle = $_REQUEST['newstitle'];
    $newsimg = $_REQUEST['newsimg'];
    $newscontent = $_REQUEST['newscontent'];
    $addtime = $_REQUEST['addtime'];
    $query = "INSERT INTO `news`(`newstitle`, `newsimg`, `newscontent`, `addtime`) VALUES ('" . $newstitle . "','" . $newsimg . "','" . $newscontent . "','" . $addtime . "')";

//    foreach ($dbh->query("SELECT*FROM `news`WHERE 1") as $row) {
//        print_r($row);
//    }
//    $query = "INSERT INTO `news`(`newstitle`, `newsimg`, `newscontent`, `addtime`) VALUES ('题1111  11目1','图片','内容','2015-09-01')";
//    $query = "DELETE FROM `news` WHERE 'newsid'=15";

    $res = $dbh->exec($query);
    echo "数据库操作成功，受影响的函数" . $res;
    $dbh = null;
} catch (PDOException $e) {
    die("Error" . $e . getMessage() . "</br>");
}
?>
```

### 什么是单例模式

```plain
单例模式三个要点：
1.需要一个保存类的唯一实例的静态成员变量：
private static $_instance;
2.private function __construct()
{
    $this->_db = pg_connect('xxxx');
}
private function __clone()
{
}//覆盖__clone()方法，禁止克隆
3.必须提供一个访问这个实例的公共的静态方法（通常为getInstance方法），从而返回唯一实例的一个引用

public static function getInstance()
{
    if(! (self::$_instance instanceof self) )
    {
        self::$_instance = new self();
    }
    return self::$_instance;

} 
```

### PHP 单例模式封装数据库的增删改查

```plain
<?php
class Db{
    //需要一个保存类的唯一实例的静态成员变量
    //数据库连接对象
    private static $_instance;
    private static $table_name;
    private $pdo;
    private function __construct()
    {
        $this->pdo = new PDO("mysql:host=localhost;dbname=phptest","root","");
        $this->pdo->query("set names utf8");
    }
    //覆盖__clone()方法，禁止克隆
    private function __clone()
    {
    }
    //必须提供一个访问这个实例的公共的静态方法（通常为getInstance方法），从而返回唯一实例的一个引用
    //返回数据库实例对象
    public static function getDb($table_name)
    {
        self::$table_name = $table_name;
        if(! (self::$_instance instanceof self) )
        {
            self::$_instance = new self();
        }
        return self::$_instance;

    }
    function add($table_name, $data){
        $keys = implode(",", array_keys($data));
        $value = "'".implode("','", array_values($data))."'";
        $sql = "insert into $table_name ($keys) values($value) ";
        $r = $this->pdo->exec($sql);
        $this->getErrorInfo();
        return $r;
    }
    function addAll($table_name, $data){
        $keys = implode(",", array_keys($data[0]));

        $arr = [];
        foreach ($data as $k => $v) {
            $arr[] = "('".implode("','", array_values($v))."')";
        }
        $value = implode(",", $arr);

        $sql = "insert into $table_name ($keys) values $value";
        $r = $this->pdo->exec($sql);
        $this->getErrorInfo();
        return $r;

    }
    function update($table_name, $data){
        $id = $data['id'];
        unset($data['id']);
        $arr = [];
        foreach($data as $k=>$v){
            $arr[] = $k."='".$v ."'";
        }
        $str = implode(",", $arr);
        $sql = "update $table_name set $str where id=$id";

        $r = $this->pdo->exec($sql);
        $this->getErrorInfo();
        return $r;
    }

    function select($table_name, $where = '1=1'){
        $sql = "select * from $table_name where $where ";
        $res = $this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        $this->getErrorInfo();
        return $res;

    }
    function find($table_name, $where = '1=1'){
        $sql = "select * from $table_name where $where ";
        $res = $this->pdo->query($sql)->fetch(PDO::FETCH_ASSOC);
        $this->getErrorInfo();
        return $res;
    }
    function getErrorInfo(){
        if($this->pdo->errorCode() != '00000'){
            echo "<pre>";
            print_r($this->pdo->errorInfo());
            exit;
        }
    }
    function delete($id){
        $table_name = self::$table_name;
        if(is_array($id)){
            $id = implode(',', $id);
        }
        $sql = "delete from $table_name where id in ($id)";
        $r = $this->pdo->exec($sql);
        $this->getErrorInfo();
        return $r;
    }
}
function M($table_name){
    $db = Db::getDb($table_name);
    return $db;
};
$r = M('news')->delete(726);
echo $r;
?>
```



