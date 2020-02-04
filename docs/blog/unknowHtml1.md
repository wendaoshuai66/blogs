# 你不知道的 HTML
## 什么是同源策略
是一种约定，它是浏览器最核心最基本的安全功能，1995 年，同源政策由 Netscape 公司引入浏览器。目前，所有浏览器都实行这个政策。所谓"同源"指的是"三个相同"。                      
    协议相同
    域名相同
    端口相同

## 同源策略目的
同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。
## 非同源策略有三种行为限制

（1） Cookie、LocalStorage 和 IndexDB 无法读取。

（2） DOM 无法获得。

（3） AJAX 请求不能发送。
## 如何设置同源策略（hosts）
Cookie 是服务器写入浏览器的一小段信息，只有同源的网页才能共享。但是，两个网页一级域名相同，只是二级域名不同，浏览器允许通过设置 document.domain 共享 Cookie。
例如 test1.xxx.com/a.html 与 test2.xxx.com/b.html

在 a.html 中

```javascript 
document.domain = 'xxx.com'//设置同源策略
document.cookie = "test1=hello";
```

在 b.html 中可以读到 Cookie

```javascript
var allCookie = document.cookie;
```

另外，服务器也可以在设置 Cookie 的时候，指定 Cookie 的所属域名为一级域名，比如`.example.com`。

``` javascript
Set-Cookie: key=value; domain=.example.com; path=/                                      
```

## 常见跨域的方案

img iframe script 并没有规定到同源策略所限制的对象中，经常实现从本域到其他的一个域发起请求，最实用的的 HTML 的标签

```plain
<img src="http://wwww.test.com/" alt="">
<iframe src="http://wwww.test.com/" frameborder="0"></iframe>
<script src="http://wwww.test.com/"></script>
```

img  iframe script	 Jsonp（callback 与后端约定）link(background)

### jsonp 案列

```plain
js部分
第一种写法
<script src="http://wwww.test.com/index.php?callback=test"></script>

<script>
function test(data){
    console.log(data)
}
</script>
第二种写法
function addScriptTag(src){
  var s = document.createElement('script')
  s.setAttribute('type','text/script')
  s.src = src
  document.body.appendChild(s)
}
window.onload =fuction(){
  addScriptTag('http://wwww.test.com/index.php?callback=test')
}
function test(data) {
        console.log('Your public IP address is: ' + data.ip);
    }
js也可以这样写


php 部分
if(callback) {
    test({"data":"约定成功"})
}
```

### 标签拓展

```plain
var img = new Image()
    var start = Date.now()
    img.src = 'http://img0.imgtn.bdimg.com/it/u=1375648583,1039230805&fm=26&gp=0.jpg'
    img.onload =function (ev) {
        var end = Date.now()
        var t = (end -start)/1000
        varv = 't'+= 'kb/s'
        console.log(t/1000)
    }
```

## HTML 语义化标签

使用 div 进行布局，不要用 div 进行无意义的包裹，尽量少写 html，原因减少 dom 渲染时间，浪费文件大小

语义化标签是因为爬虫

