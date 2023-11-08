---
title: 用 React 做个 Emoji version 的扫雷
date: 2018.09.14
---



## 前言
扫雷, 是一款单人的计算机游戏. 游戏目标是找出所有没有地雷的方格, 完成游戏; 要是按了有地雷的方格, 游戏失败.

扫雷绝对是一款非常有趣的益智游戏, 刚上手扫雷的人一定会有一段时间沉迷于此.
至少我是这样, 我玩扫雷的时间绝对超过 60 小时.

原因可以参考这里: [扫雷20年后为何依然风靡？ - 知乎](https://www.zhihu.com/question/64757141)

所以, [它](https://glitchboyl.github.io/minesweeper/)诞生的原因也很简单: Just for fun. :smile:


## 开始
先上一个完成图.
![Minesweeper Preview](https://i.loli.net/2019/12/05/kDtgNyC27rexTJ5.png)

我平时是挺喜欢使用 Emoji 的, 也想着做一个简约一点的, 不需要使用用到太多图片素材.
所以最后图片素材是使用了 [Twemoji](https://github.com/twitter/twemoji), 设计则是参考了 [Emoji-Minesweeper](http://muan.github.io/emoji-minesweeper/).
~(参考不能算抄……参考! ……文化人的事, 能算抄么?)~

我真的没有抄啊, 哈哈, 样式和逻辑都是自己写的.

### 项目结构
用 [create-react-app](https://github.com/facebook/create-react-app) 来创建项目, 结构稍微修改一下.
```
Minesweeper/
  src/
    assets/
    components/
      Minesweeper.jsx
    App.jsx
    index.js
    registerServiceWorker.js
```
assets:  用来存放图片素材. (我并没有用 Twemoji 整个库, 而是直接下载 svg 来用了.)
components/Minesweeper.jsx:  定义 Minesweeper 的抽象组件. 只负责上下文呈现和 UI 样式定义.
App.jsx:  Minesweeper 的状态管理以及逻辑处理.
index.js:  入口方法.

### 实现
首先规划好 Minesweeper 的抽象组件结构.

App.jsx
```jsx
import Minesweeper from './components/Minesweeper';

class App extends React.Component {
  render () {
    return (
      <Minesweeper>
        <Minesweeper.Game />
      </Minesweeper>
    )
  }
}
```
Minesweeper 的抽象组件定义请看 [Minesweeper.jsx](https://github.com/LonelyLiaR/minesweeper/blob/master/src/components/Minesweeper.jsx).

用一个 4*5 的二维数组来代表雷区. 每一项对应该块雷区的状态.
```javascript
const rows = 4, columns = 5, bombs = 3;
const minesGrid = new Array(rows).fill(0).map(() =>
  new Array(columns).fill(0)
);

minesGrid;
// [
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0]
// ];
```
假设用 0 代表未知区域, 9 代表地雷, 10 代表安全区域.
地雷的分布位置是随机的, 使用普通的随机数方法就可以.
```javascript
function randomNumber(m) {
  return parseInt(Math.random() * m, 10);
}
```
然后将地雷的坐标以字符串形式储存起来, 这样可以使用 `Array.includes` 方法来进行排重.
```javascript
function rewrite() {
  let bombsPosition = [];
  while (bombsPosition.length < bombs) {
    const x = randomNumber(rows), y = randomNumber(columns);
    const p = `${x},${y}`;
    if(!bombsPosition.includes(p)) {
      bombsPosition.push(p);
      minesGrid[x][y] = 9;
    }
  }
}
```
然后就可以得到一个带有地雷的雷区 `minesGrid`.

我是在一开始就生成地雷, 这样会导致有可能第一次点击就踩雷.
而 Windows 的做法是第一次点击后再布雷, 这样能提高游戏体验.
但是嘛... 这本来就是个带有点运气的游戏不是吗? :sunglasses:

接下来是最核心的玩法部分 —— 踩雷区.
在点击未知区域时, 如果为地雷则游戏失败, 否则就以点击区域为中心, 探索它的八个方向(最多可能有的)的地雷数, 并反馈到点击的雷区上.

![case-1](https://i.loli.net/2019/12/05/Au25lQrbCWYgopi.png)

点击出现1, 说明探索八个方向内有一个地雷.

那如果周围都没地雷怎么办? 那就标记它为安全区域(10). 
然后向可探索的方向继续探索, 直到不为安全区域的雷区为止.

![case-2](https://i.loli.net/2019/12/05/svAI32QaT9fmXEO.png)

如图所示, 我点击的是蓝色标记的部分, 探索它的八个方向都没有地雷, 所以将它标记为安全区域.
然后向它的八个方向探索, 在以它的左方区域为中心探索时发现有雷, 于是标记为有1个雷(1). 停止该区域的延伸探索. 它的 左上方/左下方/右下方区域 也同理. 而其他方向探索发现为安全区域, 所以需要继续延伸探索. 最终需要探索的部分为 以红色线为界 的 黄色部分.

实现代码:
```javascript
// x, y 为 点击区域的坐标; deep 是区分是否延伸探索.
function checkout(x, y, deep) {
  let bs = 0; // 周围区域的地雷数量.
  const needCheckout = []; // 需要延伸探索的区域.
  const shallowCheckout = []; // 不需要延伸探索的区域.
  if (x !== 0) {  //  上方.
    if (minesGrid[x - 1][y] === 0 && deep) needCheckout.push([x - 1, y]);
    else if (minesGrid[x - 1][y] === 9) bs++;

    if (y !== 0) {  //  左上方.
      if (minesGrid[x - 1][y - 1] === 0 && deep) {
        minesGrid[x - 1][y] === 0 &&
        minesGrid[x][y - 1] === 0
          ?  needCheckout.push([x - 1, y - 1])
          :  shallowCheckout.push([x - 1, y - 1]);
      }
      else if (minesGrid[x - 1][y - 1] === 9) bs++;
    }
    if (y !== columns - 1) {  //  右上方.
      if (minesGrid[x - 1][y + 1] === 0 && deep) {
        minesGrid[x - 1][y] === 0 &&
        minesGrid[x][y + 1] === 0
          ?  needCheckout.push([x - 1, y + 1])
          :  shallowCheckout.push([x - 1, y + 1]);
      }
      else if (minesGrid[x - 1][y + 1] === 9) bs++;
    }
  }
  if (x !== rows - 1) {  //  下方.
    if (minesGrid[x + 1][y] === 0 && deep) needCheckout.push([x + 1, y]);
    else if (minesGrid[x + 1][y] === 9) bs++;

    if (y !== 0) {  //  左下方
      if (minesGrid[x + 1][y - 1] === 0 && deep) {
        minesGrid[x + 1][y] === 0 &&
        minesGrid[x][y - 1] === 0
          ?  needCheckout.push([x + 1, y - 1])
          :  shallowCheckout.push([x + 1, y - 1]);
      }
      else if (minesGrid[x + 1][y - 1] === 9) bs++;
    }
    if (y !== columns - 1) {  //  右下方.
      if (minesGrid[x + 1][y + 1] === 0 && deep) {
        minesGrid[x + 1][y] === 0 &&
        minesGrid[x][y + 1] === 0
          ?  needCheckout.push([x + 1, y + 1])
          :  shallowCheckout.push([x + 1, y + 1]);
      }
      else if (minesGrid[x + 1][y + 1] === 9) bs++;
    }
  }
  if (y !== 0) {  //  左方.
    if (minesGrid[x][y - 1] === 0 && deep) needCheckout.push([x, y - 1]);
    else if (minesGrid[x][y - 1] === 9) bs++;
  }
  if (y !== columns - 1) {  //  右方.
    if (minesGrid[x][y + 1] === 0 && deep) needCheckout.push([x, y + 1]);
    else if (minesGrid[x][y + 1] === 9) bs++;
  }
  minesGrid[x][y] = bs === 0 ? 10 : bs;
  if (minesGrid[x][y] === 10) { // 为安全区域时, 探索可探索的方向.
    if (!!needCheckout.length) 
      needCheckout.forEach(c => {
        checkout(c[0], c[1], true);
      });
    if (!!shallowCheckout.length) 
      shallowCheckout.forEach(c => {
        checkout(c[0], c[1], false);
      });
  }
}
```

用 `minesGrid` 生成雷区组件. 点击触发踩雷.
```javascript
const MinesGrid = () =>
  minesGrid.map((row, x) => (
    <Minesweeper.Game.MinesGrid.Row key={`row-${x}`}>
      {row.map((cell, y) => (
        <Minesweeper.Game.MinesGrid.Cell 
          onClick={((x, y) => () => checkout(x, y, true))(x, y)}
          key={`${x},${y}`}
        >
          {/*
             根据该雷区的状态处理 blablabla.
           */}
        </Minesweeper.Game.MinesGrid.Cell>
      ))}
    </Minesweeper.Game.MinesGrid.Row>
  ));
```

插入渲染.
```javascript
...
  <Minesweeper>
    <Minesweeper.Game>
      <MinesGrid />
    </Minesweeper.Game>
  </Minesweeper>
...
```
ok, 这样就实现了一个非常粗糙但是可以玩的扫雷. 


## 结语
感谢你能耐心的看到这里. 本文仅供参考, 当然不是最好的实现方式.
实际还需要做很多处理, 区域标记插旗, 游戏数据的统计, 游戏设置, 重置游戏等功能. 
这些都做了的话, 就可以构造一个完整的扫雷了.

![Lazer eyes](https://i.loli.net/2019/12/05/MfnNO8pZGuqz5mc.jpg) 
所实现的完整代码请看 [GitHub](https://github.com/LonelyLiaR/minesweeper). 
