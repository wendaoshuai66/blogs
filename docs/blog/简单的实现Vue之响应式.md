# 简单的实现 Vue 之响应式

上代码就完事了

## MVVM.js

```plain
//提供了全局的Vue 模版
function Vue(options) {
    //对象 {text:'hello world!'}

    this.data = options.data;
    var data = options.data;
    //发布者 例如data 中text发生了变化，发布通知到订阅者
    observe(data, this);
    //this Vue的实例 包含着data
    var dom = new Compiple(document.getElementById(options.el), this);
    //编译完后，将dom返回倒app中
    document.getElementById(options.el).appendChild(dom);
}
```

## Observe.js

```plain
function defineReactive(vm, key, value) {
    let dep = new Dep();

    Object.defineProperty(vm, key, {
        get() {
            //添加订阅者watcher到主题对象Dep
            if (Dep.target) {
                //js浏览器单线程特性，保证在一个时间内只有一个监听器使用
                dep.addSub(Dep.target)
            }
            return value;
        },
        set(newVal) {
            if (newVal === value) return value;
            value = newVal;
            //作为发布者发出通知
            dep.notify();
        }
    })
}

function observe(obj, vm) {
    Object.keys(obj).forEach(key => {
        defineReactive(vm, key, obj[key])
    })
}
```

## Dep.js

```plain
class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
```

## Compile.js

```plain
class Compiple {
    constructor(node, vm) {
        if (node) {
            this.$frag = this.nodeToFragment(node, vm);
            return this.$frag;
        }
    }
    nodeToFragment(node, vm) {
        var self = this;
        var frag = document.createDocumentFragment();
        var child;
        while (child = node.firstChild) {
            self.compileElement(child, vm);
            frag.append(child)
        }
        return frag;
    }
    compileElement(node, vm) {
        var reg = /\{\{(.*)\}\}/;
        //节点类型为元素；
        if (node.nodeType === 1) {
            var attr = node.attributes;
            for (var i = 0; i < attr.length; i++) {
                //获取v-model绑定的属性名
                if (attr[i].nodeName == "v-model") {
                    var name = attr[i].nodeValue;
                    node.addEventListener("input", function(e) {
                        //给相应的data属性赋值，进而触发该属性的set方法
                        vm[name] = e.target.value;
                    })
                }
                //node.value = vm[name];将data的值赋值给该node
                new Watcher(vm, node, name, 'value')
            }
        }
        if (node.nodeType === 3) {
            //获取匹配的字符串
            if (reg.test(node.nodeValue)) {
                var name = RegExp.$1;
                name = name.trim();
                // node.nodeValue = vm[name];将data的值赋值给node
                new Watcher(vm, node, name, 'nodeValue')
            }
        }
    }
}
```

## Watcher

```plain
class Watcher {
    constructor(vm, node, name, type) {
        Dep.target = this;
        this.vm = vm;
        this.node = node;
        this.type = type;
        this.name = name;
        this.update();
        Dep.target = null;
    }
    update() {
            this.get();
            //对应的哪行node节点 {{text}}[nodeValue] = (new Vue())['text']
            this.node[this.type] = this.value;
        }
        //获取data的属性
    get() {
        this.value = this.vm[this.name]
    }
}
```
