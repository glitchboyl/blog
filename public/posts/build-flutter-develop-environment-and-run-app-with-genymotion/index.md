---
title: 搭建 Flutter 开发环境 + Genymotion 运行应用
date: 2019.12.25
---



### 前言

本文并无任何技术含量... 仅是作为初学者入门笔记. :snail:
最近因为项目紧脏, 疯狂加班无心学习. 今天是摸:fish:日, 正好来学一下今年很火的 Flutter.



### 搭建开发环境

如果没有 Dart 的编译环境, 那么就需要先安装 [Dart](https://dart.dev). 因为 Flutter 是基于 Dart 这个语言的.
我的环境是 Windows 10, 这里有两种方式:

1) 用 [Chocolatey](https://chocolatey.org/) 安装.
在管理员模式的 PowerShell 下执行:
```shell
$ choco install dart-sdk
```
2) 去 [http://gekorm.com/dart-windows](http://gekorm.com/dart-windows/) 进行下载.

这里我选择了前者, 因为之前安装 [yarn](https://yarnpkg.com/) 的时候顺便安装了 choco.

---
### JDK

编译环境弄好了之后来安装 JDK, 因为 Android 环境需要, 这里直接去 [Oracle 的官网](https://www.oracle.com/java/technologies/javase-downloads.html)下载.
 ~wtf... Oracle 的网站 UI 更新了, 有丶好康啊.~

这里要下载 JDK 1.8, 因为 Flutter 目前好像就只支持到这个版本.

![jdk.png](https://i.loli.net/2020/05/14/knRFgTB2Wav9ohJ.png)

安装完 JDK 之后去配置环境变量 JAVA_HOME, 这个比较简单就不详细说了, [百度一下你就知道](https://www.baidu.com/s?word=JAVA_HOME&tn=92583360_hao_pg&ie=utf-8&ssl_sample=normal).

去 cmd 验证一下 JDK 是否安装成功:
```shell
$ java
```
```shell
$ javac
```
以上命令执行后只要输出不是 `不是内部或外部命令`, 就说明安装成功了.

---
### Android SDK

然后安装 Android SDK, 一般是需要安装 Android Studio 附带安装这个 SDK.
不过因为我不需要 Android Studio 这个额外的 IDE, 所以我直接选择下载 [basic Android command line tools](https://developer.android.google.cn/studio) (基本的Android命令行工具).

这里假设下载到 C 盘根目录下, 解压出来只有一个 `tools` 的文件夹.
然后新建一个文件夹 `Android`, 再在里面新建一个文件夹 `cmdline-tools`, 将 `tools` 放进去.
至于这样做的原因, 在说之前, 先来说一下**不这样做**的场景:

首先去配置环境变量 `ANDROID_HOME = 'C:/Android'` .
然后在 Path 里加上 `%ANDROID_HOME%/tools/bin`. 完了之后去 cmd 验证一下:
```shell
$ sdkmanager
```
可以看到是有东西输出的. 然后再执行 `list` 来列出可安装的 Android SDK:
```
$ skdmanager --list
```
这个时候就报了一个错误:
> Warning: Could not create settings
> java.lang.IllegalArgumentException
> ...

根据这篇[帖子](https://stackoverflow.com/questions/60440509/android-command-line-tools-sdkmanager-always-shows-warning-could-not-create-se)来看, 这个错误发生的原因好像是因为 Android SDK 在更新迭代的过程将目录层次的结构修改了, 但是这个 command line tools 还是原来的结构. 导致 sdkmanager 定位 SDK 的时候会发生错误, 所以我们需要将目录结构修改成 `cmdline-tools/latest`. 
修改 Path `ANDROID_HOME = '%ANDROID_HOME%/cmdline-tools/tools/bin'`, 然后执行 `list`, 输出成功了.

![sdkmanager-list.png](https://i.loli.net/2020/05/14/FTAxbZQSrhROfgj.png)

然后来下载 `platforms` 和 `build-tools`, 这里我选了当前最新的版本:
```shell
$ sdkmanager --install "platforms;android-29" "build-tools;29.0.3"
```
安装完成之后, 你就会看到 `Android` 文件夹内多了东西.

最后执行 `$ sdkmanager --update` 和 `$ sdkmanager --license` 来让 Flutter 能够识别 SDK, 完成.

---
### Flutter SDK

接下来需要下载 Flutter SDK, 直接去[官网](https://flutter.dev/docs/get-started/install/windows)下载.
完成之后配置环境变量 FLUTTER_HOME, 操作和 JAVA_HOME 一样的.
我们还需要设置 Flutter 的国内镜像源, [百度一下](https://www.baidu.com/s?word=Flutter+%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F&tn=92583360_hao_pg&ie=utf-8&ssl_sample=normal).

全部弄好之后去 cmd 验证一下 Flutter SDK 是否安装成功:

![flutter_doctor.png](https://i.loli.net/2020/05/14/G2sBAy3QPgKd7ft.png)

这里因为我已经安装配置好了 Genymotion, 所以显示有 Connected device.
只要除了 Connected device 其他的要求前都不是 `X`, 就说明 Flutter SDK 安装成功了. 

那么接下来就来安装 Genymotion.



### 安装 Genymotion

官方貌似推荐使用 Android Studio 自带的 AVD 来运行 Flutter 应用. 
但是我 ~就不!~  以前写一个 [React Native 项目](https://github.com/glitchboyl/ohce) 的时候使用到了 Genymotion, 感觉挺好用的, 界面粉粉的挺好康的.  

![interface](https://i.loli.net/2019/12/25/DtsNvLugZ3kqSoh.png)

~不多bb了, 麻溜安装下来搞 Flutter.~

首先要下载 Genymotion, 这里可以直接去[官网](https://www.genymotion.com/download/)下载.
然后 Genymotion, 包括现在国产的很多手游模拟器都是基于 Oracle 的 VirtualBox 的, 所以也要下载一个. 也是在[官网](https://www.virtualbox.org/wiki/Downloads)下载.

下载并安装了之后, 用管理员模式打开 Genymotion, 如果运气好你能直接打开,
如果运气不好你会得到一个 Error 提示:
> Genymotion unable to load VirtualBox engine.

好的, 要怎么办呢? stackoverflow的老哥给出了解决答案:

![resolve](https://i.loli.net/2019/12/25/PcsVOM6zFE395lp.png)

这里来个图文版的解决方法:
首先打开 VirtualBox, 打开左上角的 管理 -> 主机网络管理器. (以前是在全局设定-网络里的.)

![step-1](https://i.loli.net/2019/12/25/HgbcTVDs8woWqfR.png)

然后选择第一块网卡, 在安装 Genymotion 之后都会帮你创建一个的, 如果没有就创建一个. 
按照 stackoverflow的老哥说的去手动配置它的 网卡信息 和 DHCP服务器信息.

然后再启动 Genymotion 就成功啦, 进去之后选 Personal Use. 注册一个账号, 都是免费的.
选你自己要使用的 机型 和 Android 版本, install 就完事了.



### Hello, Flutter!

我这里用的 IDE 是 VS Code, 按照 [Flutter中文网的教程] 来创建一个初始 Flutter 项目.
在你打开 Flutter 项目的时候左下角会有可用的 device 信息.

![device](https://i.loli.net/2019/12/25/3658jJKOZVSCYQU.png)

选你用 Genymotion 创建的虚拟机, 然后按下 F5 启动项目. 
等待一会, 你就可以在虚拟机上看到这个项目啦.

<img src="https://i.loli.net/2019/12/25/kz8gYyrqf7nE1mi.png" alt="hello world" style="zoom:50%;" />

### 结语

Happy Fluttering!

本文真的没有技术含量, 全是网上查找得来的一篇 ~水文~ 综合笔记而已.
这里立个 flag 🕊️🕊️, 要尝试着用 Flutter 开发一个可以给自己长久使用的 App.
类型暂时未定, 会完全开源, 并且开发过程应该会 ~水~ 写成文章.



### 参考资料

[Flutter中文网](https://flutterchina.club/)
https://github.com/flutter/flutter/issues/13078
https://www.jianshu.com/p/c2f8bf042577
https://stackoverflow.com/questions/23708633/genymotion-unable-to-load-virtualbox-engine
