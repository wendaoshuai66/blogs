# PHP 与 MySQL 开发入门上

## 初识 PHP

### 概念

  PHP（外文名:PHP: Hypertext Preprocessor，中文名：“[超文本](https://baike.baidu.com/item/%E8%B6%85%E6%96%87%E6%9C%AC)[预处理器](https://baike.baidu.com/item/%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8)”）是一种通用[开源](https://baike.baidu.com/item/%E5%BC%80%E6%BA%90/246339)[脚本语言](https://baike.baidu.com/item/%E8%84%9A%E6%9C%AC%E8%AF%AD%E8%A8%80/1379708)。[语法](https://baike.baidu.com/item/%E8%AF%AD%E6%B3%95/2447258)吸收了[C 语言](https://baike.baidu.com/item/C%E8%AF%AD%E8%A8%80)、[Java](https://baike.baidu.com/item/Java)和[Perl](https://baike.baidu.com/item/Perl)的特点，利于学习，使用[广泛](https://baike.baidu.com/item/%E5%B9%BF%E6%B3%9B/6246786)，主要适用于[Web](https://baike.baidu.com/item/Web)开发领域。PHP 独特的[语法](https://baike.baidu.com/item/%E8%AF%AD%E6%B3%95/2447258)混合了[C](https://baike.baidu.com/item/C)、[Java](https://baike.baidu.com/item/Java)、[Perl](https://baike.baidu.com/item/Perl)以及[PHP](https://baike.baidu.com/item/PHP)自创的语法。它可以比[CGI](https://baike.baidu.com/item/CGI)或者[Perl](https://baike.baidu.com/item/Perl)更快速地执行[动态网页](https://baike.baidu.com/item/%E5%8A%A8%E6%80%81%E7%BD%91%E9%A1%B5/6327050)。用 PHP 做出的[动态页面](https://baike.baidu.com/item/%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2/8586386)与其他的[编程语言](https://baike.baidu.com/item/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/9845131)相比，[PHP](https://baike.baidu.com/item/PHP/9337)是将[程序](https://baike.baidu.com/item/%E7%A8%8B%E5%BA%8F/71525)嵌入到[HTML](https://baike.baidu.com/item/HTML)（[标准通用标记语言](https://baike.baidu.com/item/%E6%A0%87%E5%87%86%E9%80%9A%E7%94%A8%E6%A0%87%E8%AE%B0%E8%AF%AD%E8%A8%80/6805073)下的一个应用）文档中去执行，执行效率比完全生成[HTML](https://baike.baidu.com/item/HTML)标记的[CGI](https://baike.baidu.com/item/CGI/607810)要高许多；PHP 还可以执行[编译](https://baike.baidu.com/item/%E7%BC%96%E8%AF%91/1258343)后代码，编译可以达到[加密](https://baike.baidu.com/item/%E5%8A%A0%E5%AF%86/752748)和[优化](https://baike.baidu.com/item/%E4%BC%98%E5%8C%96/94618)代码运行，使代码运行更快。

### PHP 变量

变量是存储信息的容器。

#### PHP 变量规则

- 变量以 $ 符号开头，其后是变量的名称
- 变量名称必须以字母或下划线开头
- 变量名称不能以数字开头
- 变量名称只能包含字母数字字符和下划线（A-z、0-9 以及 _）
- 变量名称对大小写敏感（$y 与 $Y 是两个不同的变量）

注释：PHP 变量名称对大小写敏感！

#### PHP 是一门类型松散的语言

PHP 根据它的值，自动把变量转换为正确的数据类型。

在诸如 C 和 C++ 以及 Java 之类的语言中，程序员必须在使用变量之前声明它的名称和类型。

#### PHP 变量作用域

在 PHP 中，可以在脚本的任意位置对变量进行声明。

变量的作用域指的是变量能够被引用/使用的那部分脚本。

PHP 有三种不同的变量作用域：

- local（局部）
- global（全局）
- static（静态）

#### Local 和 Global 作用域

函数*之外*声明的变量拥有 Global 作用域，只能在函数以外进行访问。

函数*内部*声明的变量拥有 LOCAL 作用域，只能在函数内部进行访问。

例如：

```php
<?php
$x=5; // 全局作用域

function myTest() {
  $y=10; // 局部作用域
  echo "<p>测试函数内部的变量：</p>";
  echo "变量 x 是：$x";
  echo "<br>";
  echo "变量 y 是：$y";
} 

myTest();

echo "<p>测试函数之外的变量：</p>";
echo "变量 x 是：$x";
echo "<br>";
echo "变量 y 是：$y";
?>
```

注释：您可以在不同的函数中创建名称相同的局部变量，因为局部变量只能被在其中创建它的函数识别。

#### PHP global 关键词

global 关键词用于在函数内访问全局变量。

要做到这一点，请在（函数内部）变量前面使用 global 关键词：

```plain
<?php
$x=5;
$y=10;

function myTest() {
  global $x,$y;
  $y=$x+$y;
}

myTest();
echo $y; // 输出 15
?>
```

#### PHP Static 关键字

通常，当函数完成/执行后，会删除所有变量。不过，有时我需要不删除某个局部变量。实现这一点需要更进一步的工作。

要完成这一点，请在您首次声明变量时使用 *static* 关键词：

````plain
<?php

function myTest() {
  static $x=0;
  echo $x;
  $x++;
}

myTest();//0
myTest();//1
myTest();//2

?>
````

然后，每当函数被调用时，这个变量所存储的信息都是函数最后一次被调用时所包含的信息。

注释：该变量仍然是函数的局部变量。

## PHP 超全局

PHP 中的许多预定义变量都是“超全局的”，这意味着它们在一个脚本的全部作用域中都可用。在函数或方法中无需执行 global $variable; 就可以访问它们。

这些超全局变量是：

- $GLOBALS
- $_SERVER
- $_REQUEST
- $_POST
- $_GET
- $_FILES
- $_ENV
- $_COOKIE
- $_SESSION

### $GLOBALS-引用全局作用域中可用的全局变量

$GLOBALS 这种全局变量用于在 PHP 脚本中的任意位置访问全局变量（从函数或方法中均可）。

PHP 在名为 $GLOBALS[index] 的数组中存储了所有全局变量。变量的名字就是数组的键。

下面的例子展示了如何使用超级全局变量 $GLOBALS：

```plain
<?php 
$x = 75; 
$y = 25;
 
function addition() { 
  $GLOBALS['z'] = $GLOBALS['x'] + $GLOBALS['y']; 
}
 
addition(); 
echo $z; 
?>
```

### $_SERVER

_SERVER 这种超全局变量保存关于报头、路径和脚本位置的信息。

### $_REQUEST

PHP $_REQUEST 用于收集 HTML 表单提交的数据。

### $_POST

PHP   $_POST 广泛用于收集提交 

method="post" 的 HTML 表单后的表单数据。$_POST 也常用于传递变量。

### $_GET

PHP $_GET 也可用于收集提交 HTML 表单 (method="get") 之后的表单数据。

$_GET 也可以收集 URL 中的发送的数据。

## 数据类型

PHP var_dump() 会返回变量的数据类型和值。

String（字符串）, Integer（整型）, Float（浮点型）, Boolean（布尔型）, Array（数组）, Object（对象）, NULL（空值）。





