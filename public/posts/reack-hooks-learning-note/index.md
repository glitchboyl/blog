---
title: React Hooks 学习笔记
date: 2019.11.20
---



本文主要以我自身的理解思路为主. :tongue:

> In computer programming, the term hooking covers a range of techniques used to alter or augment the behaviour of an operating system, of applications, or of other software components by intercepting function calls or messages or events passed between software components. Code that handles such intercepted function calls, events or messages is called a hook.

在计算机程序设计中, 用于通过截获在软件组件之间传递的函数调用、消息或事件来改变或增强操作系统、应用程序或其他软件组件的行为, 处理这种截获的函数调用、事件或消息的代码称为 Hook(钩子).

React Hook 可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性.
对于 Hooks 就不更多介绍了, 请戳 [这里查看](https://reactjs.org/docs/hooks-intro.html#motivation).



### 开始使用

- [useState](#usestate)
- [useEffect](#useeffect)
- [useContext](#usecontext)
- [useReducer](#usereducer)
- [useRef](#useref)

　

### <a name="usestate">useState</a>

`useState()` 只接收一个初始 state 参数, 返回值为**当前 state 以及更新 state 的函数**.

这里贴一个[官方示例](https://reactjs.org/docs/hooks-state.html): 
```javascript
const Example = () => {
  //  等号左边的名字并不是 React API 的部分, 你可以自己取名字.
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => { setCount(count + 1) }}>
        Click me
      </button>
    </div>
  );
}
```
触发 `setCount()` 时会触发 render, 因为它和 Class Component 中的 `setState()` 是等价的. 

　

### <a name="useeffect">useEffect</a>

`useEffect` 可以让你在 Function Component 中执行副作用操作.
这个 hook 比较复杂, 需要多说一下.

首先来理解, 什么是副作用呢? 
数据获取, 设置订阅以及手动更改 React 组件中的 DOM 都属于副作用.

举几个例子:
在组件第一次渲染完毕之后. (componentDidMount)
在组件更新完毕之后. (componentDidUpdate)
在组件销毁之前. (componentWillUnmount)

对, 你可以把 `useEffect` 当作这三个生命周期函数的组合.
`useEffect` 会在每次渲染后都执行, 每次运行 effect 的同时, DOM 都已经更新完毕.

这里贴一个[官方示例](https://reactjs.org/docs/hooks-effect.html): 
```javascript
const Example = () => {
  //  等号左边的名字并不是 React API 的部分, 你可以自己取名字.
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    document.title = `You clicked ${count} times.`;
  });
  
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => { setCount(count + 1) }}>
        Click me
      </button>
    </div>
  );
}
```
示例中, 在每次调用 `setCount()` 触发 render 的时候都会触发 effect.

那假设我需要一个 Countdown (计时器) 的功能, 需要在组件第一次渲染完成启动, 在组件销毁之前清除, 那我必须得把它写在 effect 里, 这样不是会重复执行:horse:?

好的, 其实这是有解决方案的.
在 `useEffect` 返回一个函数, effect 会在执行清除操作时调用它, 差不多就是这样:
```typescript
React.useEffect(() => {
  startCountdown();
  return clearCountdown;
});
```

然后你还可以传递数组作为 `useEffect` 的第二个参数, 将变量传入数组中, effect 会检测两次 render 之间这些变量是否发生了变化, 如果没有则会跳过 effect. 
这是 effect hook 性能优化的一环. 就像这样:
```javascript
const Example = () => {
  const [count, setCount] = React.useState(0);
  const [Rick, Morty] = React.useState('test');

  React.useEffect(() => {
    console.log(count);
  }, [count]);
  
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => { setCount(count + 1) }}>
        Click me
      </button>
      <button onClick={() => { Morty('ass we can') }}>
        Oops, {Rick} is not working
      </button>
    </div>
  );
}
```

示例中, 点击第二个按钮虽然会改变 `Rick` , 但是打开 console 看看, 是没有触发 effect 的.
你还可以传一个空的数组 `[]`, 这样 effect 只会在创建组件和销毁组件时运行一次. 这也就表示你的组件不依赖任何 `state` 和 `props`. ~[那你写 effect 干嘛?](https://www.cnblogs.com/ascoders/p/10591832.html#%E4%B8%8D%E8%A6%81%E5%AF%B9-dependencies-%E6%92%92%E8%B0%8E)~

　

### <a name="usecontext">useContext</a>

`useContext()` 接收一个 ReactContext 对象为参数, 返回值为该 context 的当前值.

其实, `useContext` 就是相当于 Class Component 中的 `static contextType = Context` 或者 `<Context.Consumer>`.

这里贴一个我改版的[官方示例](https://reactjs.org/docs/hooks-reference.html#usecontext):
```javascript
const Theme = {
  color: '#FF0000',
  background: '#FFFFFF'
};
const ThemeContext = React.createContext(Theme);

const ThemedButton = () => {
  const theme = React.useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.color }}>
      I am styled by theme context!
    </button>
  );
}

const App = () => {
  const [theme, setTheme] = React.useState(Theme);
  
  function changeTheme() {
    setTheme({
      color: '#FFFFFF',
      background: '#000000'
    });
  }

  return (
    <div>
      <button onClick={() => { changeTheme() }}>Click me and change theme!</button>
      <ThemeContext.Provider value={theme}>
          <ThemedButton />
      </ThemeContext.Provider>
    </div>
  );
}
```
`useContext` ~是不是有 Class Component 内味了?~ 只是让你能够读取 context 的值以及订阅 context 的变化, 你仍然需要在上层组件树中使用 `Provider` 来为下层组件提供 context.

　

### <a name="usereducer">useReducer</a>

`useReducer` 接收一个形如 `(state, action) => newState` 的 reducer, 并返回当前的 state 以及与其配套的 dispatch 方法. 就和 Redux 的写法一毛一样.

它其实和 `useState` 差不多, 在某些场景下, 它可以更好替代 `useState`. 例如 state 逻辑较复杂且包含多个子值, 或者下一个 state 依赖于之前的 state 等. 
并且, 使用 `useReducer` 还能给那些会触发深更新的组件做性能优化, 因为你可以向子组件传递 `dispatch` 而不是 `callbackFn`.

这里贴一个用 `useReducer` 来重写 `useState` 那节示例的[官方示例](https://reactjs.org/docs/hooks-reference.html#usereducer):
```typescript
const Example = () => {
  //  初始 state 就是 useReducer 的第二个参数.
  //  但下一次的初始 state 将会是使用 dispatch 后的返回值.
  //  而 action 可以是任何值 (any), 这使得 useReducer 的 state 更加灵活多变.
  const [count, dispatch] = React.useReducer((state, action: any) => {
    switch (action) {
      case 'increment': return state + 1;
      case 'decrement': return state - 1;
      default: throw new Error();
    }
  }, 0);
  
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => dispatch('increment')}>
        +
      </button>
      <button onClick={() => dispatch('decrement')}>
        -
      </button>
    </div>
  );
}
```
示例中, 用类似于 Redux 的形式来使用了 useReducer, 但这并不说明它只能被这样使用.
你可以传入一个用于改变 state 或 像 useState 那样直接改变 state 的参数, 然后像这样使用:
```typescript
const [count, dispatch] = React.useReducer((state, action: any) => {
  //  只要加上判断条件就可以自由的操作 state.
  if (typeof action === 'number') return action;
  else {
    switch (action) {
      case 'increment': return state + 1;
      case 'decrement': return state - 1;
      default: throw new Error();
    }
  }
}, 0);
```
它的确比 `useState` 更好, 但大多数情况下使用 `useState` 就够了. ~useReducer 一时爽, review :fire:葬场.~

　

### <a name="useref">useRef</a>

`useRef` 返回一个可变的 ref 对象, 其 `.current` 属性被初始化为传入的参数 (initialValue).
返回的 ref 对象在组件的整个生命周期内保持不变.

本质上, `useRef` 就像是可以在其 `.current` 属性中保存一个可变值的"盒子", 它可以保存任何值 (any).
如果你把 ref 对象以 `ref={myRef}` 形式传入组件, 那么这个 ref 对象的 `.current` 属性就能访问到 DOM 节点.
它也可以作为储存常量的对象, 在它内容发生变化的时候, 并不会触发 effect.
这是因为它创建的是一个普通 Javascript 对象, 而 `useRef()` 和自建一个 `{current: ...}` 对象的唯一区别是, useRef 会在每次渲染时返回同一个 ref 对象.

这里贴一个我改版的[官方示例](https://reactjs.org/docs/hooks-reference.html#useref):
```typescript
const TextInputWithFocusButton = () => {
  const inputEl = React.useRef(null);
  const onButtonClick = () => {
    // 传入组件后, `current` 就会指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };

  const [count, setCount] = React.useState(1);
  const countRef = React.useRef(count);
  
  //  每次 count 变化时, 都会触发 effect 打印 countRef.
  //  但是你点击 Magic button 改变 countRef 时并不会触发这个 effect.
  React.useEffect(() => {
    console.log(countRef);
  })

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
      <p>you are click {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={() => countRef.current = count}>Magic button</button>
    </>
  );
}
```
不过, 一般情况下都是用于获取 DOM 节点. ~哪个 **s**huai**b** 会用 ref 来储存常量 ...?~


![](https://i.loli.net/2019/11/20/qcFamvIZS1LXfNG.jpg)
