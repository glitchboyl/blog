---
title: Oops, 踩了一下 Babel 的坑
date: 2018-12-21
---



最近写公司项目的时候, 遇到了 Android 手机浏览器不兼容运行 ES6/7 代码的 Bug.<br>
我需要把 ES6/7 代码转译成 ES5, [Babel](https://babeljs.io/) 可以帮我做到这一点.<br>
但项目用的是 **React**, 需要自己动手来配置 Babel.

**creact-react-app** 创建的项目提供了具有合理缺省的完全配置, 能够上手即用, 适用于大多数环境. <br>
它隐去了所有配置文件, 能够让我专心的写组件去构建我的应用界面.<br>
我现在需要自定义配置的话, 就必须曝光这些配置文件. 

在 [create-react-app 的 README](https://github.com/facebook/create-react-app#whats-included) 里有这样一句话:
> The tradeoff is that these tools are preconfigured to work in a specific way. If your project needs more customization, you can "eject" and customize it, but then you will need to maintain this configuration.

翻译过来意思就是:
> (隐去配置文件的) 初衷是想这些配置工具以特定方式工作, (但) 如果你的项目需要更多自定义 (配置项), 你可以 (执行) eject (曝光这些文件) 并定义它 (这些配置), 但是之后你将需要去维护此配置.

现在在项目根目录执行:
```shell
yarn eject
```
会提示:
```shell
Are you sure you want to eject? This action is permanent.
```
`eject` 是个 one-way operation (单向操作), 一旦执行就不能回退回去了. <br>
所以执行前真的要想清楚你是否真的需要用到这些配置. <br>
虽然实际上没有多大影响, 只是让你的项目结构看起来好像臃肿了一点而已.<br>
~~可能会逼死强迫症?~~ :tongue:



### 项目结构

eject 之后根目录会多出 `script` 和 `config` 两个文件夹.<br>
`package.json` 也会多出一些配置项.

实际是多了这么多东西.
![console](https://i.loli.net/2019/12/05/3iLJqopA7fRx1wz.png)

现在你可以在 `package.json` 里进行 Babel 的配置.
```json
"babel": {
  "presets": [
    "react-app"
  ]
}
```
也可以使用 `.babelrc` , 需要手动创建. <br>
(Windows 下创建的方法是创建一个记事本, 命名为 `.babelrc.` , 后面有个点的! )<br>
配置教程戳[这里](https://babeljs.io/docs/en/config-files/).



### 配置 Babel

我现在要的效果是能将 ES6/7 转译成 ES5. 需要用到的是一个叫 [babel-preset-es2015](https://babeljs.io/docs/en/babel-preset-es2015/) 的预设. <br>
但是它说:

> As of Babel v6, all the yearly presets have been deprecated. We recommend using @babel/preset-env instead.

现在是用一个叫 `@babel/preset-env` 的新预设来与 yearly 有关的预设了.<br>
在此之前, 需要查看一下 Babel 的版本是否对应. 因为这个新预设是属于 Babel 7 的.<br>
所有 Babel Package 之间版本不兼容的话, 打包时就会报一个版本不对应的错误.

```shell
Plugin/Preset files are not allowed to export objects
```
Babel 7 使用了 `@Babel/package-name` 的命名方式来区分官方 package 以及 非官方 package, <br>
比如 `babel-core` 会变成 `@babel/core`, etc.<br>
将 Babel 版本升级到 v7 之后, 需要手动安装所有的 Babel 7 的 package, 例如默认带的 `react-app` 的预设需要手动安装并更换成 `@babel/preset-react`.



### 题外话

我在项目中用到了 [Ant Design Mobile](https://mobile.ant.design/). 如果直接使用组件需要手动引入样式css. [官网说明](https://mobile.ant.design/docs/react/introduce#Use-modularized-antd-mobile)里介绍并推荐使用一个 Babel 插件 `babel-plugin-import` 来做到按需载入css.

现在我的 `.babelrc` 是这样的:
```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    [
      "import",
      {
        "libraryName": "antd-mobile",
        "style": "css"
      }
    ]
  ]
}
```

好的, 现在试着运行一下.<br>
然后报了一个错误...?

```shell
regeneratorRuntime is not defined
```
![emmm](https://i.loli.net/2019/12/05/4rTY2IoDVkK5LeQ.png) 

这是啥玩意啊... 我从来没见过也没用过啊.<br>
Google 之后解决了. 需要应用运行前加入 `babel-polyfill`.<br>
用 [Polyfill](https://babeljs.io/docs/en/babel-polyfill/) 的介绍里的原话来说: <br>
由于 Babel 只转换语法 (如箭头函数), 而 Polyfill 它会仿效一个完整的 ES2015+ 环境, 并意图运行于一个应用中而不是一个库/工具. 这意味着我们可以使用 ES2015+ 的特性. 如 `Promise` 等.

要加入 Polyfill, 首先安装 `@babel/polyfill`.<br>
然后打开 `config/webpack.config.dev.js` 和 `config/webpack.config.prod.js`, <br>
找到 `entry` 项并加入 `@babel/polyfill`.

**config/webpack.config.dev.js**
```javascript
entry: [
  // Include an alternative client for WebpackDevServer. A client's job is to
  // connect to WebpackDevServer by a socket and get notified about changes.
  // When you save a file, the client will either apply hot updates (in case
  // of CSS changes), or refresh the page (in case of JS changes). When you
  // make a syntax error, this client will display a syntax error overlay.
  // Note: instead of the default WebpackDevServer client, we use a custom one
  // to bring better experience for Create React App users. You can replace
  // the line below with these two lines if you prefer the stock client:
  // require.resolve('webpack-dev-server/client') + '?/',
  // require.resolve('webpack/hot/dev-server'),
  "@babel/polyfill",
  require.resolve('react-dev-utils/webpackHotDevClient'),
  // Finally, this is your app's code:
  paths.appIndexJs,
  // We include the app code last so that if there is a runtime error during
  // initialization, it doesn't blow up the WebpackDevServer client, and
  // changing JS code would still trigger a refresh.
],
```

**config/webpack.config.prod.js**
```javascript
entry: ["@babel/polyfill", paths.appIndexJs],
```
这样就完事了. 



### 19.01.29 更新

昨天在开发另一个 Vue 的项目时也遇到了类似的问题, <br>
但项目是已经通过 Babel 编译了却还是在 ios 9 的 Safari 上显示白屏. <br>
找了很久之后发现原因是因为项目里用到的这个库 [query-string](https://github.com/sindresorhus/query-string) 不知为何没有被 Babel 编译. 

行8, 那我自己写... 🙂



### 结语

Babel 很有意思, 实用性也很强. 之前一直没有用得上的环境下去接触使用.<br>
这次项目需要兼容到其他低版本的移动端浏览器, 也是终于有机会让我~水了一篇文章~学习到了. :smile:



### 参考资料

https://www.robinwieruch.de/minimal-react-webpack-babel-setup/
https://github.com/facebook/create-react-app/issues/167
https://github.com/facebook/create-react-app#whats-included
https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release#renames-scoped-packages-babel-x
https://github.com/babel/babel-preset-env/issues/112
