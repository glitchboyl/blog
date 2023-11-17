---
title: HashRouter 模式的锚点定位
date: 2019.11.26
---



锚点是一种[超级链接](https://en.wiktionary.org/wiki/Hyperlink), 能快速将访问者带到指定位置.<br>
在 HTML 中, 一个带有 id 的 **DOM 节点**, 就是一个锚点, 通过在 **url 的 hash 部分**携带 id 就可以链接到该锚点.

我们在使用现代框架开发 SPA 的时候都会使用能和框架集成的路由管理器, 例如: [vue-router](https://router.vuejs.org/zh/), [react-router](https://reacttraining.com/react-router/), [reach-router](https://reach.tech/router), etc.<br>
而有时候为了兼容一些情况, 例如: **旧浏览器(IE 8/9)**、**路由非前端控制**等. 我们会使用 **Hash** 的路由模式来实现前端路由.

这种时候, 因为 hash 被路由占据了, 锚点功能就会和路由冲突.

我的 blog 是部署在 [surge](https://surge.sh/) 上的, 用的是 HashRouter 的模式.<br>
而我[前几天写的一篇笔记](9)里用到了锚点, 实际表现就是会定向到 404 页面.

nameless 没有对这种情况做逻辑处理, 所以现在来解决一下.

解决思路是: 在解析了 markdown 之后, 对**所有能链接到锚点的元素**附加点击事件, 阻止默认事件, 让页面滚动到锚点所在位置.<br>
然后方案有两种, [scrollIntoView](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView) 和 [scrollTop](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollTop). 这里我选择了前者, 因为 nameless 不用对浏览器做兼容.

然后是实现功能的代码:
```typescript
//  通过 ref 获取的装载文章的 DOM 节点.
const postBody = this.postBody.current;
const { history, location } = this.props;

//  页面滚动到锚点位置的方法。
function scrollToAnchor(anchor: string): void {
  //  因为 issues 生成的格式是这样的, 所以做了处理.
  if (!postBody.querySelector(`#${anchor}`)) {
    try {
      postBody.querySelector(`[name=user-content-${anchor}]`).scrollIntoView();
    } catch { }
  }
}

//  页面加载完成, 如果有锚点就进行跳转.
if (!!location.search) {
  const { anchor = '' } = parse(location.search);
  !!anchor && scrollToAnchor(anchor);
} else if (!!location.hash) {
  const anchor = location.hash.replace('#', '');
  !!anchor && scrollToAnchor(anchor);
}

postBody.querySelectorAll("a").forEach((a: HTMLAnchorElement) => {
  //  跳转的页面 host 需和本页面一致, 并且带有 hash.
  if (a.hostname === window.location.hostname && !!a.hash) {
    a.addEventListener('click', e => {
      const anchor = a.hash.replace('#', '');

      // 如果是 HashRouter 模式, 就阻止默认事件.
      if (location.pathname === window.location.hash.replace('#', '').replace(/\?.*/, '')) {
        e.preventDefault();
        //  作为 HashRouter 模式的锚点链接处理.
        history.push(`?anchor=${anchor}`);
      }

      scrollToAnchor(anchor);
    });
  }
})
```
这时候你只需要输入url: http://somehost/path/#/hash?anchor=xxx 就可以滚动到锚点位置了.<br>
在 BrowserRouter 下的表现则是正常的锚点功能.

具体的功能实现代码请查看 [commit#546e8a6](https://github.com/glitchboyl/nameless/commit/546e8a68ef601c4373447204475f96f7a09e45af).
