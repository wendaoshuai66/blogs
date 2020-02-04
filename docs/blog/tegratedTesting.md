# JavaScript 集成化测试
## 有关好的文章地址
[JavaScript 与 QA 工程师(理论篇)](https://github.com/hubvue/nota/issues/26)
## yarn 与 npm
![yarn 与 npm](https://wendaoshuai66.github.io/study/note/images/yarn.png)
## 单元测试 小的函数
单元测试的测试框架有很多中，今天用的是[karma](http://karma-runner.github.io/3.0/intro/installation.html)，还有一个是 React 推出的[jest](https://jestjs.io/docs/en/getting-started)
### 初始化项目
```plain
npm init -y //-y 一直yes
```
### 下载 karma 包
```plain
npm install karam –save-dev 或者 yarn add karam --dev
```

### 安装 karma-jasmine 和 jasmine-core 断言库
```plain
npm install karma-jasmine jasmine-core –save-dev
```
### 安装浏览器启动项
如果用无头浏览器的话会因为 PhantomJs 对 es6 支持不好会造成问题但正常的话可以用

步骤：npm install –save-dev karma-phantomjs-launcher(这个在 karma init 的时候会下载，可以先不下载，需要翻墙，代理服务器带宽不好的下载不下来。一个解决办法是整个好的代理服务器，二个解决办法是使用 cnpm 下载)

```plain
npm install phantom –save-dev
```
因为 PhantomJs 对 es6 支持不好本次测试用的是 Chrome，需安装 Chrome 启动项

```plain
npm install  karma-chrome-launcher --save-dev
```
### 初始化 karma 包

```plain
karma init
```

执行上面这个命令会有几个选项让选择

which testing framework do you want to use? (你想用什么测试框架) 我们选 jasmine。

Do you want to use Require.js ?（用 Require.js 吗） 按需求来选，如果用的话选 yes，不用的话选 no

Do you want to capture any browsers automatically ?（是否要进行浏览器的比较） 找浏览器执行 ceshi，这里是用的是 Chrome，因为 PhantomJs 对 es6 支持不好本次测试用的是 Chrome

What is tceshihe location of your source and test files ?（测试文件和原文件的位置在什么地方？？） 可选可不选，ceshi 可以自己配置。

Should anceshiy of the files included by the previous patterns be excluded ?（是否要有一些其他文件被包含）ceshi 可选可不选，ceshi 这里不选

Do you waceshint Karma to watch all the files and run the tests on change ?（你想让 Karma 监视所有的文件并运行变更测 ceshi 试吗？） 可选可不选，这里不选

安装完成之后，会生成 karma.vonf.js 文件，这个就是 karma 的配置文件。

### karma 配置文件

```plain
module.exports = function(config) {
  config.set({

       basePath: '',//基本路径

       frameworks: ['jasmine'],
		//需要添加测试文件
	    files: [
		  "./tests/unit/**/*.js",
		  "./tests/unit/**/*.spec.js"
		],

    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './tests/unit/**/*.js': ['coverage']
    },
    //代码覆盖率文档生成的路径
    coverageReporter: {
      type : 'html',
      dir : './docs/coverage/'
    },

    //生成测试报表的过程
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
```

frameworks：是指测试所用到的断言库是什么，我用的是 jasmine。

files：是需要测试的文件，配置两中，一种是需要测试的文件，一种是测试文件(.spec.js 结尾)。主要**是所有的文件夹， *是所有的文件。

preprocessors：这个是指定什么文件生成报表文件。

reporters：以什么样的方式生成报表。

coverageReporter：生成报表的形式和路径。

browsers：指定测试用到的浏览器，这里用 PhantomJS 无头浏览器。

singleRun：如果上面 browsers 指定的是 PhantomJS，这里要改为 true。

### 开始需要添加的配置–指定测试文件的路径

```plain
 files: [
		  "./tests/unit/**/*.js",
		  "./tests/unit/**/*.spec.js"
		],
```

### 编写测试用例

假设我们测试一下代码

```plain
window.add = (a)=>{
    if(a===1){
        return 1
    }else{
        return a+1;
    }
    
}
```

测试用例这样写

```plain
describe('测试基本函数函数API',function(){
    it('+1的函数应用',function(){
        expect(window.add(1)).toBe(1)
        // expect(window.add(2)).toBe(3)
    })
})
```

describe：整个项目的描述

it:是每一个测试用例

expect：是断言

toBe：直接的结果与谁相比
### 启动测试
```plain
karma start
```
测试成功的话是绿色的显示 SUCCESS

![karma成功](https://wendaoshuai66.github.io/study/note/images/karmas.jpeg)

测试失败的话会报错。

![karma成功](https://wendaoshuai66.github.io/study/note/images/karmae.jpeg)

###代码的覆盖率检查

当测试代码用有 ifelse 的时候，测试用例中只写一个测试是达不到完成测试的，就上面测试代码而言。我们用代码的覆盖率检查来检测一下。

覆盖率检查通过 karma-coverage 来完成

```plain
npm install karma-coverage –save-dev
```

在 karma.conf.js 中修改 设置以 coverage 的方式生成报表

```plain
reporters: ['progress','coverage'],
```

设置处理的文件

```plain
preprocessors: {
    "unit/**/*.js":['coverage']
}
```

文档生成的位置 在目录下设置 docs 文件夹存放报表文件


```plain
 coverageReporter: {
      type : 'html',
      dir : './docs/coverage/'
    },
```

此时生成的报表文件

![报表成功](https://wendaoshuai66.github.io/study/note/images/reports.png)

可以看到 Branches 是 50%，说明只能测试到了 50%的代码 我们修改测试代码

```plain

describe('测试基本函数函数API',function(){
    it('+1的函数应用',function(){
        expect(window.add(1)).toBe(2)
        expect(window.add(2)).toBe(3)
    })
})
```

### 此时的测试用例
![报表成功100%](https://wendaoshuai66.github.io/study/note/images/reporte.png)

## 功能测试
### e2e 测试

e2e 主要测浏览器的功能测试 e2e 主要使用的是 selenium-webdriver，这里是它其他的一些方法 API

### 安装 selenium-webdriver
```plain
npm install selenium-webdriver –save-dev
```
selenium-webdriver 通过自动启动浏览器进行 e2e 测试，因此必须要安装浏览器驱动程序。 在这里下载各大浏览器的驱动程序，把下载好的驱动程序解压下来放在项目根路径下就可以了。

### 测试流程
比如说我们要测试百度的 input 框输入内容之后跳转的相应的界面中的 title 值。 在项目根目录中创建 e2e 文件夹，创建 baidu.spec.js 文件，这个 baidu.spec.js 文件就是测试文件。测试文件中代码如下。

```plain
const {Builder, By, Key, until} = require('selenium-webdriver');
(async function example() {
    //一定要下载相对应浏览器的执行驱动
    //forBrowser里就是指定用什么样的浏览器进行测试。
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        //需要测试网站的url
        await driver.get('http://www.baidu.com');
        //name()表示找到页面中input的name值
        //sendKeys的第一个值表示自动化在文本框中输入的内容
        //第二个值Key.RETURN  表示按回车
        await driver.findElement(By.name('q')).sendKeys('Hello', Key.RETURN);
        //匹配自动化搜索后出现的数据
        //数字1000就是测试需要等待的时间，如果网慢，可以调大一些。
        await driver.wait(until.titleIs('Hello_百度搜索'), 1000);
    } finally {
        //系统要退出
        await driver.quit();
    }
})();
```
特别注意的是最后 driver.quit()，系统一定要退出，如果不退出的话，就会堵塞后面的加载。

### 启动测试

selenium-webdriver 是基于 node 的语法，因此执行

```plain
node ./e2e/*.spec.js
```
就可以启动测试

nightwatch 也是做 e2e 测试的一个框架，这里先不说，以后用这个做 e2e。

### 用 rize 来做 e2e 测试

[rize.js](https://rize.js.org/zh-CN/)是一个新出的测试框架，在这里检测一下 e2e 测试。 与 rize.js 配合的是一个新出的无头浏览器 puppeteer，它和 selenium-webdriver 不同的是它不需要打开浏览器去测试。

rize.js 实际上是对 puppeteer 的一个高度封装

### 安装 rize 和 puppeteer

```plain
npm install –save-dev puppeteer rize(必须科学上网装)
```
### 测试用例

和 selenium-webdriver 一样，我们假设测试 giuhub 网站，输入 node 会不会出现 Node.js 这几个字。（注意的是 rize 搜索是全页面的搜索，因此会慢些）。 在 e2e 文件夹下创建 github.spec.js

```plain
const Rize = require("rize");
const rize = new Rize();
rize
    .goto('https://github.com/')        //打开url
    .type('input.header-search-input', 'node')  //找到文本框 输入文本
    .press('Enter')        //进行回车
    .waitForNavigation()    //等待
    .assertSee('Node.js')   
```
可见上述用例在语法上就比较简洁，容易看懂。

### 启动测试

rize 是基于 node 的语法，因此执行
```plain
node ./e2e/*.spec.js
```

## 接口测试

前端接口测试一般用测自己，测自己的 node 接口。 在项目根目录下创建 service 文件夹和 mochaRunner.js 文件。


1.service 文件夹主要放测试同步接口的测试文件。

2.mochaRunner.js 主要用于测试异步接口。

### 测试框架

使用 mocha 进行接口测试

### 安装 mocha

```plain
npm install mocha –save-dev
```
## 测试流程
我们自己写一段 express 代码,自测一下。
强烈建议将 Nodemon 安装为 dev 依赖项，这是一个非常简单的小包，可在文件被更改时自动重启服务器

如果你运行

```plain
cnpm install --save-dev nodemon
```
然后将以下脚本添加到 package.json

```plain
//package.json
"scripts": {
    "dev": "nodemon ./tests/service/service.js"
  }
```

```plain
const express = require("express");
const app = express();
app.get("/test",(req,res) => {
    res.send({
        result : "hello world",
    })
})
app.listen(3000,()=>{
    console.log("server is running");
})
```

在 service 文件夹下，创建 router.spec.js 用于测试上述接口。 注意的是 router.spec.js 中的测试代码和 karma 单元测试中的测试代码风格相同。唯一不同的是，接口测试是跑在 node 服务上的必须把进程 done 掉，不然会阻塞执行。 下面是测试代码


```plain

const axios = require("axios");
describe("node接口测试",function(){
    it("test接口测试",function(done){
        axios.get("192.168.0.101:3000/test").then(function(response){
            if(response.data.result == 'hello world'){
                console.log(response)
                //必须要done
                done();
            }else {
                done(new Error("请求接口数据出错"));
            }
        }).catch(function(error){
            done(error);
        })
    })
})
```


在 mochaRunner.js 中编写异步测试


```plain
const Macha=require('mocha')
const mocha = new Macha({
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: './docs/mochawesome-report',
      }
});
mocha.addFile('./tests/service/routes.spec.js');
mocha.run(function(){
    console.log(done)
    process.exit()
    // process.exit(1) 异常
    // process.exit()  正常
})
```

### 生成测试报表

使用 mochawesome 生成测试报表


### 安装 mochawesome

```plain
npm install mochawesome –save-dev
```

在 mochaRunner.js 中配置

```plain
const mocha = new Macha({
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: './docs/mochawesome-report',
      }
});
```

这样就可以生成测试报表。

### 启动测试

首先开启服务器

```plain

npm run dev
```

mocha 是基于 node 的语法，因此执行


```plain
node ./mochaRunner.js
```

### 测试结果

代码中会返回一个出错长度，如果出错长度为 0 的话就不是出错，如果出错长度不为 0 就是出错了。

正确的测试结果

![报表成功100%](https://wendaoshuai66.github.io/study/note/images/mochas.png)

错误的测试结果

![报表成功100%](https://wendaoshuai66.github.io/study/note/images/mochae.png)


## UI 测试


#### 什么是 UI 走查

把对应生成的页面看，看过之后比对是否还原 UI 图正确，还原对了就让上线，没有还原对就不让上线。 最早的 UI 走查就是 Phantom 的妹妹 [phantom-css](https://github.com/HuddleEng/PhantomCSS)

### UI 测试框架 backstopJS

```plain
npm install backstopjs –save-dev
```

### 初始化 backstopJS 项目


```plain
backstop init
```


初始化之后，出现了几个配置文件


backstop.json 是配置文件

backstop_data 是 backstop 的引擎

 cookies.json：如果网站中需要 cookie 登录的话，可以在这里模拟 cookie

      
casper：主要在无头浏览器中进行操作


chromy：对 chrome 版本的内核的一些操作


puppet

### backstop.json 配置文件

设置页面分辨率，可同时设置好几个。


```plain

"viewports": [
    {
    "label": "phone",
    "width": 375,
    "height": 667
    },
    {
    "label": "ipad",
    "width": 1024,
    "height": 768
    }
],
```

配置每一个测试用例

```plain

"scenarios": [
    {
    "label": "QQmap",
    "cookiePath": "backstop_data/engine_scripts/cookies.json",//如果网站中有登录cookie，必须在这里指定cookie
    "url": "https://map.qq.com/m/", //这里是测试的网站
    "referenceUrl": "",
    "readyEvent": "",
    "readySelector": "",
    "delay": 0,
    "hideSelectors": [],
    "removeSelectors": [],
    "hoverSelector": "",
    "clickSelector": "",
    "postInteractionWait": 0,
    "selectors": [],
    "selectorExpansion": true,
    "expect": 0,
    "misMatchThreshold" : 0.1,
    "requireSameDimensions": true
    }
],
```

由于 backstopJS 测试是进行的 UI 走查的环节，必须指定设计图，把参考文件放在”backstop_data/bitmaps_reference”文件夹下，可在 backstop.json 中 paths 下面的 bitmaps_reference 设置。


注意：backstop.json 中 viewports 中写了几个视图就要匹配几种参考图片

### 启动测试

```plain
backstop test
```

### 测试结果

会生成一个报表，自动打开网页，网页里会形成测试网页与设计图的匹配。查看测试结果。


## 最后的希望-集成化测试

利用 pachage.json 串行和并行执行命令的方式集成化测试


```plain
   //串行
  "scripts": {
    "unit": "karma start",
    "e2e": "node ./tests/e2e/baidu.spec.js",
    "dev": "nodemon ./tests/service/service.js",
    "service": "node ./mocharun.js",
    "ui":"backstop test",
    "test":"npm run unit && npm run e2e && npm run service && npm run ui"
  },
  
  //并行
  "scripts": {
    "unit": "karma start",
    "e2e": "node ./tests/e2e/baidu.spec.js",
    "dev": "nodemon ./tests/service/service.js",
    "service": "node ./mocharun.js",
    "ui":"backstop test",
    "test":"npm run unit & npm run e2e & npm run service & npm run ui"
  },
  
```

由此可见 上述 test 方式太过繁琐，我们通过一个工具简化一下，这个工具就是 npm-run-all


### 安装 npm-run-all

```plain
npm install npm-run-all –save-dev
```

### 使用

```plain

"test": "npm-run-all  unit  e2e  ui  service",
```

上面这种方式不是并发执行 如果有，某一步出错，就会终止。可以加一个参数让它变成并发执行

```plain
"test": "npm-run-all --parallel   unit  e2e  ui  service",
```