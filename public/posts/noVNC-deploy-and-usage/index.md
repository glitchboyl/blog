---
title: noVNC 部署+简单的使用方法
date: 2019.11.27
---



公司的项目需要实现一个能够从浏览器端远程访问到目标主机的功能.

就是和华为云服务器的远程登录差不多的功能.

![](https://i.loli.net/2019/11/27/afq4pYb6uHxAOMj.png)
(尴尬... 过期了.)

所以用到了 [noVNC](https://novnc.com/info.html). 它可以在通过在线网页发起 vnc 请求, 访问目标主机上 VNC Server 提供的 VNC 服务, 并把画面渲染到 H5 的 Canvas 上.


那么, 要如何食用呢?
首先, 通过 noVNC 的 [README](https://github.com/novnc/noVNC/blob/master/README.md#server-requirements) 得知:
> noVNC follows the standard VNC protocol, but unlike other VNC clients it does require WebSockets support. Many servers include support (e.g. x11vnc/libvncserver, QEMU, and MobileVNC), but for the others you need to use a WebSockets to TCP socket proxy. noVNC has a sister project [websockify](https://github.com/novnc/websockify) that provides a simple such proxy.

意思就是说:
> noVNC 遵循标准的 VNC 协议, 但它是通过 WebSocket 建立链接, 而 VNC Server 不支持 WebSocket. noVNC 有一个附加项目 [websockify](https://github.com/novnc/websockify) 可以开启代理来做 WebSocket 和 TCP Socket 之间的转换.

原理大致知道了. 然后通过查询得知, 我们需要在目标主机上安装一个 VNC 服务器.
用我家里的电脑作为目标主机 (Windows) 实验, 安装一个 Windows 环境下的 VNC Server: [UltraVNC](http://www.uvnc.com/).

安装好了之后就有这四个小玩意. 然后打开 UltraVNC Server.

![](https://i.loli.net/2019/11/27/ikfpCYKzHdJA9BU.png)

这玩意和小飞机一样, 打开之后没有默认的 UI 界面. 
在右下角会有一个小图标, 右键选择 Admin Properties.

 ![](https://i.loli.net/2019/11/27/DzlASnk5Ksyf6Tg.png)

然后找到 Authentication, 这里是设置用于访问目标主机的密码.

![](https://i.loli.net/2019/11/27/zIujUQGOT5vxKe8.png)

通过 VNC Password 可以操控目标主机, 而 View-Only Password 就只能查看.
这两个密码不能一样, 先随便设个 123456 / asdfghjkl 吧. 完事点击 OK.

再右键小图标选择 Start Service. 它这里说了 must be installed first, 没安装就先点击 Install Service 安装吧, 安装完之后它会自动 Start.

![](https://i.loli.net/2019/11/27/2ZMTy8atDrBOwiE.png)
　
接着要用到上面所说的 websockify 来开启代理, 它好像有很多种编程语言支持.
先创建一个 `testVNC` 的文件夹吧, 把 [websockify-js](https://github.com/novnc/websockify-js) clone到这里, 再 cd 到项目下的 websockify 文件夹里.
看到有个熟悉的 `package.json` 文件, 你就懂了吧? 在这个目录执行 npm install 或者 yarn 来安装依赖吧.

websockify 准备好了, 现在需要一个 viewer 来查看效果.
把 noVNC 的项目 clone 到 `testVNC` 文件夹里.
然后在 `testVNC` 目录下打开 shell, 用 node 启动 websockify 代理转发到9000端口:
```shell
$ node websockify-js/websockify/websockify.js --web noVNC 9000 目标主机IP:5900
```

**P.S.**  这里的目标主机IP如果不是同一局域网下的, 那就需要输入目标主机分配的 WAN IP.
设置 WAN IP 的方法请查看[这里](https://blog.csdn.net/eacxzm/article/details/84672886).

打开 localhost:9000, 发现报错了:

![](https://i.loli.net/2019/11/27/M5Pkd4HOYEUm1xC.png)

打开 `testVNC/websockify-js/websockify/websockify.js`, 全局搜索一下 `index.html`.

![](https://i.loli.net/2019/11/27/TNt4Oq8uJj3XGoL.png)

打开 `testVNC/noVNC` 康康, 它只有 `vnc.html` 和 `vnc_lite.html`.
应该是第一个文件, 但是因为不知道重命名这个文件会发生什么其他错误. 所以还是老老实实改代码:

![](https://i.loli.net/2019/11/27/VZBeNHW3If1OuMT.png)

然后重新启动 node 服务, 再打开 localhost:9000:

![](https://i.loli.net/2019/11/27/iawbFpVK1xAtmC2.png)

草.
在经过[查询](https://tieba.baidu.com/p/5774623189?red_tag=0915816300)和一系列操作之后才知道, 要想远程到家庭宽带下的目标主机非常困难.
目前远程到局域网下的主机是没问题的, 输入密码之后就可以访问到了

![](https://i.loli.net/2019/11/27/lEDUSca8GigZxto.png)

之后项目中远程的非同一局域网下的目标服务器主机应该会有做别的处理.
不管了. 暂时先这样. ~又水了一文~
