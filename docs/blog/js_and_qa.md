# JavaScript 与 QA 测试工程师

## 单元测试

### 目的

单元测试能够让开发者明确知道代码结果

### 原则

单一职责 （通俗的理解的话是管好你自己的事）

接口抽象

层次分离

### 断言库

保证最小单元式是否正常运行检测方法

### 测试风格

都是敏捷开发方法论

测试驱动开发（Test-Driven Development TDD）：关注所有的功能是否被实现（每一个功能都会有相应的测试用例），suite 配合 test 利用 assert（tobi == ueser.name）

行为驱动开发（Behavior-Driven Development BDD）：关注整体行为是否否和整体预期，编写每行代码都有目的提供一个全面的测试用例集

### 单元测试框架

better-assert（TDD 断言库 Github）

should.js(BDD 断言库 Github)

expect.js（BDD 断言库 Github）

chaai.js（TDD BDD 双模 Github）

Jasmine.js（BDD Github）

Node.js

### 单元测试运行流程

每一个测试用例通过 describe 进行设置

![单元测试流程](https://wendaoshuai66.github.io/study/note/images/ceshiyongli.png)

1.before 单个测试用例开始之前

2.beforeEach 每一个测试用例开始之前

3.it 定义测试用例，并利用断言库进行设置 chai 如 expect(x).to.equal(true);

异步 mocha

4.以上术语叫 mock

### 自动化单元测试

karma 自动化 runner 集成 PhantomJS 无刷新

### 步骤

1.新建一个文件夹，安装 node.js,进入文件夹 在终端中 npm init -y 初始化项目

## 性能测试

面向切面编程 AOP 无侵入式统计

Benchmark 基准测试 （样本）

## 压力测试

1.对网络接口做压力测试需要检测几个常用指标有 吞吐率 响应时间和并发数

2.PV 网站当日访问人数 UV 独立访问人数。QPS = PV/t

常用的压力测试工具 ab siege http_load

## 安全测试

XSS

SQl

CSRF

## 功能测试

用户真实性检查
