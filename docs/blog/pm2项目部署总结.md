# pm2 项目部署总结
 
## 什么是 pm2

pm2 是一个带有负载均衡功能的 Node 应用的进程管理器。pm2 是一个后台进程管理器。


## 前台进程与后台进程

1.前台进程是指项目启动进程之后，这个一直在终端中运行，不能关掉，关掉的话项目就会终止。像 supervisor 和 nodemon 就是前台进程管理。

2.后台进程是在计算机后台启动一个进行，不会在终端中显示，但是仍然启动。

## 特性

内建负载均衡

后台运行

0 秒停机重启

具有 Ubuntu 和 CentOS 的启动脚本

停止不稳定的进程（避免无限循环）

控制台检测

提供 HTTP API

远程控制和实时的接口 API(Nodejs 模块，允许和 pm2 进程管理器交互)

## 安装

```plain
$ npm install pm2@latest -g
# or
$ yarn global add pm2
```

## 目录介绍

pm2 安装好后，会自动创建下面目录。

```plain
/usr/local/bin/pm2-docker -> /usr/local/lib/node_modules/pm2/bin/pm2-docker
/usr/local/bin/pm2-dev -> /usr/local/lib/node_modules/pm2/bin/pm2-dev
/usr/local/bin/pm2 -> /usr/local/lib/node_modules/pm2/bin/pm2
/usr/local/bin/pm2-runtime -> /usr/local/lib/node_modules/pm2/bin/pm2-runtime
```

## pm2 的生态文件

一般我们会在项目的根目录创建 pm2.json 文件，基本内容如下：

```plain
{
    "name" : "node-test",
    "script" : "app.js",
    "log_data_format" : "YYYY-MM-DD HH:mm Z",
    //日志
    "out_file" : "log/node-app.stdout.log",
    "watch" : true,
    "instances": "max",
    "exec_mode" : "cluster"
}
```

### 启动 pm2，可直接使用以下命令

```plain
pm2 start pm2.json
```

## 环境变量的设置

pm2 生态文件中可使用 env_[name]的形式设置多个环境变量

```plain
{
    "name" : "node-app",
    "script" : "app.js",
    "log_data_format" : "YYYY-MM-DD HH:mm Z",
    "out_file" : "log/node-app.stdout.log",
    "watch" : true,
    "instances": "max",
    "exec_mode" : "cluster"
    "env" : {
        "NODE_ENV" : "development"
    },
    "env_production" : {
        "NODE_ENV" :"production"
    }
}
```

终端使用–env 参数指定环境

```plain
pm2 start pm2.json –env production

```

项目一旦启动环境变量就是定值，无法更改，如果非要更改可使用–update-env 来更改

```plain
pm2 restart pm2.json –update-env
```

## 进程管理

pm2 是一个保存在后台的进程，一个守护进程，负责处理您所有正在运行的进程。


## pm2 进程命令

启动进程

```plain
pm2 start pm2.json
```

停止进程

```plain
pm2 stop node-test //node-test为启动进程名称
```

```plain
pm2 stop all //停止所有
```

重启进程

```plain
pm2 restart node-test
```

列出所有进程

```plain
pm2 ls
```

启动本地监控

```plain
pm2 monit
```

##pm2 的日志管理

pm2 的日志可以实时获取并存储在硬盘中，默认情况下保存在~/.pm2/logs 中

所有进程的实时日志

```plain
pm2 logs
```

可指定进程名称表示只查看单个进程的实时日志


清空日志

```plain
pm2 flush
```

用配置文件指定日志管理

```plain
{
    "name": 'app',
    "script": 'app.js',
    "output": './out.log',
    "error": './error.log',
	"log": './combined.outerr.log',
}
```

output 表示只是标准输出相当于 JavaScript 的 console.log()

error 表示只是错误输出相当于 JavaScript 的 console.error()

log 相当于上面两种的结合，默认是禁用的。

循环日志：pm2 install pm2-logrotate

##负载均衡

pm2 的负载均衡也可以称之为集群模式。

内置的负载平衡器提供联网的 Node.js 应用（http（s）/ tcp /udp 服务器），可在所有可用的 CPU 上进行缩放，无需修改任何代码。

命令如下，表示开启三个进程。如果-i 0，则会根据机器当前核数自动开启尽可能多的进程。

```plain
pm2 start app.js -i 3 # 开启三个进程
pm2 start app.js -i max # 根据机器CPU核数，开启对应数目的进程 
```

参考文档：[点击查看](https://pm2.keymetrics.io/docs/usage/cluster-mode/#automatic-load-balancing)

##0 秒宕机重载

当使用 restart 时，pm2 会先杀死进程然后再重启进程，所以在短时间内无法启动服务，通过重载，pm2 会一一的重启所有进程，保证始终都有一个进程在运行。

```plain
pm2 reload node-app 或者 pm2 reload pm2.json

```

## 参考

[官方文档](https://pm2.keymetrics.io/docs/advanced/pm2-module-system/)