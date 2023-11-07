---
title: JavaScript 基本数据类型知识总结
date: '2020.08.29'
---

### 前言

JavaScript (以下简称 JS) 是一种弱类型语言, 声明变量时并不需要指定变量的类型, 变量会在运行时自动确定类型. 这也意味着可以使用同一个变量保存不同类型的数据.

JS 的数据类型分为两大类: **基本类型** 和 **对象类型**. 

其中, 基本类型分为:

- String: 文本字符串.
- Number: 整数和浮点数.
- Boolean: 表示 真 (*true*) / 伪 (*false*) 的两个特殊值.
- Null: 表示空值.
- Undefined: 表示未定义或者不存在.
- Symbol: 表示独一无二的值, 可以保证不会与其他属性名产生冲突.
- BigInt: 能够支持比 Number 类型的范围更大的整数值类型.

Symbol 和 BigInt 是 ES6 以后新增的.

对象类型 又名 引用类型/复杂类型, 除了基本类型以外的都是对象类型, 例如: 纯对象, 对象实例, 函数等.

**P.S. 本文的内容会比较着重于基本类型的知识盘点, 关于对象类型的知识盘点会再另开一文进行总结.** 那么开始.



### String

在 JS 中想要表示一个字符串有三种方式: 单引号`'`, 双引号`"`, 反引号`` ` ``:

```javascript
'单引号字符串'
"双引号字符串"
`反引号字符串`
```

使用哪种引号定义的字符串内不能插入该引号, 但可以通过使用反斜杠来插入该引号:

```javascript
// 这样写会报错!
'''
"""

// 这样写才是对的.
'"' // --> """
"'" // --> "'"

// 在字符串中使用了反斜杠后面的值可以表示它原来的意思.
"\"" // --> """
'\'' // --> "'"
```

反引号表示法又叫 **模板字符串**, 是 ES6 新增的定义字符串的方式. 它主要是为了解决使用 单引号/双引号 定义的字符串需要换行 或是 多个变量叠加 带来的繁琐不方便的问题, 是一种增强版的字符串.

在模板字符串的大括号内部可以执行 JS 代码, 甚至可以嵌套模板字符串:

```javascript
const a = 'boy', b = 'next', c = 'door';

// 单引号的, 不行!
const str1 = 'the ' + a + ' ' + b + ' ' + c; // --> "the boy next door"

// 反引号的, 行! 我们模板字符串真是太厉害了!
const str2 = `the ${a} ${b} ${c}`; // --> "the boy next door"
const str3 = `the ${a} ${b} ${`${str2}`}`; // --> "the boy next the boy next door"
```

在模板字符串内插入对象时并不会被转换成 JSON 字符串, 而是会被转换成原始类型的字符串, 并且还可以在模板字符串内调用函数:

```javascript
const a = { boy: 'next door' };
const boy = () => 'next door';

`${a}` // --> "[object Object]"
`${boy()}` // --> "next door"

// 你可以把它当作:
'' + a // --> "[object Object]"
'' + boy() // --> "next door"
```

此外, 模板字符串还能紧跟在一个函数名后面, 这个函数会被调用用来处理这个模板字符串, 这被称为 "标签模板" (tagged template) 功能:

```jsx
console.log`boy next door`;

// 等同于:
console.log(['boy next door']) // --> ["boy next door"]
```

有个著名的 CSS in JS 的库 [styled-components](https://styled-components.com/) 就是用的这种方式.

要如何理解呢? 来做个实验:

```javascript
const a = 'boy', b = 'next', c = () => 'door';

function test(...args) {
  console.log(args);
}

test`the ${a} ${b} ${c()}`
// --> [["the ", " ", " ", ""], "boy", "next", "door"]
```

可以看到, 接收到的第一个参数是一个数组, 其他参数是大括号内的代码的执行后的结果. 也就是说, 这个函数实际上是以下面的形式调用:

```javascript
test(["the ", " ", " ", ""], a, b, c())
```

说明第一个数组参数的成员是模板字符串中那些没有变量替换的部分, 其他参数都是模板字符串各个变量被替换后的值. 那么来改写一下 test 函数, 将各个参数按照原来的位置拼合回去, 让它把原本的字符串输出出来:

```javascript
function test(s, ...args) {
  let result = '';
  let i = 0;
    
  while (i < s.length) {
    result += s[i];
    if (i < args.length) {
      result += args[i];
    }
    i++;
  }
    
  return result;
}

test`the ${a} ${b} ${c()}`; // --> "the boy next door"
```



### Number / BigInt

这两个类型放一起说, 因为它们都是属于表示数字的类型.

先说关于 Number 类型, 在面试里可能常会被问到以下问题:

1. NaN 是什么类型?

   NaN 是属于 number 类型的:

   ```javascript
   typeof NaN; // --> "number"
   ```

   而判断一个数是不是 NaN 的方法可以用 `isNaN()` 来进行判断:

   ```javascript
   const num = +'a'; // --> NaN
   
   // 不能使用这种方式来判断.
   num === NaN; // --> false; 这也说明了两个 NaN 是不相等的.
   
   // 应该用这种方式来判断.
   isNaN(num); // --> true
   ```

   平常使用的 `isNaN` 是在 `window` 上的方法, 其实它的本意是判断参数使用一元加号运算符是否会转换成 Number 类型:

   ```javascript 
   isNaN('string'); // --> true
   
   // 等同于:
   isNaN(+'string'); // --> true
   
   // 传入一个 BigInt.
   isNaN(123n); // 会报错 TypeError: Cannot convert a BigInt value to a number
   ```

   ES6 后新增了一个 `Number.isNaN`，用于判断传入的参数是否严格的等于 NaN:

   ```javascript
   Number.isNaN('string'); // --> false
   
   Number.isNaN(NaN); // --> true
   ```

2. 精度问题

   ```javascript
   0.1 + 0.2 !== 0.3; // --> false
   9999999999999999 === 10000000000000001 // --> true
   ```

   这个问题其实很常见了, 原因解释起来太长了, 只简单的说是 **浮点数转化过程中出现的丢失** 就可以了.

   以下解决方案都可以解决这个问题:

   - 可以通过将浮点数转换成整数后进行运算, 再对结果进行处理:

     ```javascript
     (0.1 * 10 + 0.2 * 10) / 10; // --> 0.3
     ```

     但是这种方式不适用于超过 `Number.MAX_SAFE_INTEGER` 和 `Number.MIN_SAFE_INTEGER` 范围的浮点数运算, 因此还是推荐使用下面的方式.

   - 使用第三方封装类库, 如 [mathjs](https://github.com/josdejong/mathjs) 等. 这些库不仅解决了浮点数的运算精度问题, 还支持了大数运算, 并且修复了 toFixed 结果不准确的问题.



BigInt 是为了支持表示在 `Number.MAX_SAFE_INTEGER` 和 `Number.MIN_SAFE_INTEGER` 的范围之外的整数值, 在对大整数执行数学运算时, 能以任意精度表示整数的能力尤为重要.

创建 BigInt 只需要在整数末尾追加 *n* 即可, 或者使用 BigInt 的构造函数:

```javascript
const a = 10n;
typeof a; // --> "bigint"

// 使用 BigInt 的构造函数
const b = BigInt(10);
typeof b; // --> "bigint"
```

除一元加号 `+` 运算符外, 所有算术运算符都可用于 BigInt:

```javascript
10n + 10n; // --> 20n
10n - 9n; // --> 1n
10n * 2n; // --> 20n
20n / 2n; // --> 10n

const a = 10n;
++a; // --> 11n
--a; // --> 9n

// 当然, 不能混合常规数字进行运算, 否则会报错.
10n + 1; // --> TypeError: Cannot mix BigInt and other types, use explicit conversions

// 不能使用严格相等运算符将 BigInt 与常规数字进行比较, 因为它们的类型不同:
10n === 10; // --> false

// 使用宽松相等运算符是可以的:
10n == 10; // --> true
```

这也是为什么上面 `isNaN` 方法不支持传入 BigInt 的原因了, 因为它不能使用一元加号运算符.

一般业务向编程是很少会用到 BigInt 类型的, 只有在需要处理大精度整数的时候才会需要用上, 所以你也不用担心面试的时候会问到这个, 大概率是不会的. 🐶



### Boolean

这个数据类型有且只有两个值: `true` 和 `false`. 这个类型其实没啥好说的, 就跑下题说说 **隐式类型转换** 的问题吧:

使用宽松相等运算符 `==` 会试图比较他们的值, 如果比较双方的类型不一致, 会进行隐式转换. 

String, Number, Boolean 三种类型之间的比较会优先转换成 Number 后再来进行比较:

```javascript
// String 和 Number 进行比较时, 会先将 String 转成 Number 后再进行比较.
'123' == 123;
// 相当于: 123 == 123 
// --> true

// String 和 Boolean 进行比较时, 会先将 String 和 Boolean 都转成 Number 后再进行比较.
'123' == true;
// 相当于: 123 == 1 
// --> false

// Number 和 Boolean 进行比较时, 会先将 Boolean 转成 Number 后再进行比较.
123 == false;
// 相当于: 123 == 0 
// --> false
```

而对象类型和 String, Number, Boolean 三种类型之间进行比较的情况, 会先调用对象类型的 `valueOf` 方法, 再使用 `toString` 方法后再进行比较:

```javascript 
[] == ''; 
// 相当于: [].valueOf().toString() == ''
// --> '' == ''
// --> true

[] == 0; 
// 相当于: [].valueOf().toString() == 0 
// --> "" == 0 
// --> 0 == 0 
// --> true

// 所以:
({}) != '';
// 相当于: ({}).valueOf().toString() != ''
// --> "[object Object]" != ''
// --> true
```

最后对象类型和对象类型之间进行比较的情况, 没有隐式转换规则, 比较的是引用地址, 所以:

```javascript
// 两个不同地址的对象类型永远不可能相等:
{} != {}; // --> true
[] != []; // --> true

// 只有引用地址一样才会相等:
var a = {};
var b = a;
var c = [];
a.d = c;
var d = a.d;

a == b; // --> true
c == d; // --> true
```

好, 到这里我想你应该已经基本明白比较的规则了, 那么来看看这个:

```javascript
var a = [];

a == !!a; // --> false
```

啊, 这... 那么多为什么? 我们都知道, `!`运算符会把一个值转换成 Boolean 类型然后取反. 

因为 `[] == false`, 所以根据规则等式会转换成 `false == !!false` 才对.

其实这是个误区, 虽然 `[] == false` 没有错, 但这是个隐式转换规则, 并不代表它转换成 Boolean 类型就是 false.

```javascript
Boolean([]); // --> true

// 所以你明白了吧, 等式实际上相当于:
[] == !!Boolean([])
// --> [] == !!true
// --> false == true
// --> false
```

BTW, 转换成 Boolean 类型为 false 的值只有: `空字符串`, `0`, `null`,`undefined` 这几种. 

要注意, **隐式转换** 和 **类型转换** 之间并无任何交集关系.



### Null / Undefined

这两个类型放一起说, 因为它们这两个类型很特别, 首先这两种类型的值都只有一个, 就是它们自己.

在面试里有时会问这样的一个问题: **null 和 undefined 有什么区别 ?**

很多人都是从语义上解释它们的区别: **null 是刻意设置的空值, 而 undefined 是声明了变量但没有赋值.**

虽然 null 和 undefined 转换成 Boolean 类型都是 false, 但是如同上面所说, 隐式转换和类型转换并无任何交集关系:

```javascript
null == false; // --> false
undefined == false; // --> false
```

并且这两种类型之间只有它们两个自己能够互相进行隐式转换:

```javascript
null == undefined; // --> true
undefined == null; // --> true
```

此外, 当你对 null 使用 `typeof` 时, 会得到 `object` 的结果, 这也是常问的数据类型面试题之一.

这其实是 JS 的一个 bug. 其原因是因为不同的对象在 JS 底层都表示为二进制, 如果二进制前三位都为 0 的话就会判断为 `object` 类型, null 的二进制表示是全 0, 自然前三位也是 0, 所以执行 `typeof` 时会返回 `object`.



### Symbol

关于这个类型, 我觉得[阮一峰老师对 Symbol 的介绍](https://es6.ruanyifeng.com/#docs/symbol)就说的很好, 所以在这里我就不介绍了.

平时写项目可能不太用的上, 但是在一些开源的库和框架里会比较常见. 例如在 React 中自定义组件的类型就是一个特殊的 [Symbol 值](https://github.com/facebook/react/blob/master/packages/shared/ReactSymbols.js), 只要判断类型等于这个值就会被当做是自定义组件处理.

其原因是因为这个类型的唯一性, 通过 Symbol 返回的值都是在 JS 底层计算好的唯一值:

```javascript
'a' === 'a'; // --> true
Symbol('a') === Symbol('a'); // --> false
```

如果还不理解, 可以这么解释: 打个比方, Symbol 值就像一个上了锁的箱子, 每次用 Symbol 生成的都是不同的箱子.
那如果你声明了 Symbol 值而不用变量去引用它, 就相当于把箱子上了锁然后把钥匙扔进大海里, 再也打不开了.

在定义 Symbol 的时候, 传入的值会被当做这个 Symbol 值的描述 (description), 可以用 `Symbol.prototype.description` (当然它是无法修改的) 进行访问:

```javascript
// 这个变量 a 就相当于钥匙.
const a = Symbol('tom');

a.description; // --> "tom"

a.description = 'jerry';

a.description; // --> "tom"
```

常见用法有把 Symbol 作为对象的键值, 保证内部属性唯一性:

```javascript
const a = Symbol('a');

const obj = {
    [a]: 'hello there',
    // 如果你这样定义, 你就找不到它了.
    [Symbol('b')]: 'you will never find me'
}

obj[a]; // --> "hello there"
obj[Symbol('b')]; // --> undefined
```

实际上 JS 内部有很多属性都是通过 Symbol 值来定义的, 遍历对象的时候, 该属性不会出现在 `for...in`, `for...of` 循环中, 也不会被 `Object.keys()`, `Object.getOwnPropertyNames()`, `JSON.stringify()` 返回.

ES6 还提供了 11个 内置的 Symbol 值, 指向语言内部使用的方法. 关于这些内容, 可以查看[阮一峰老师的介绍]([https://es6.ruanyifeng.com/#docs/symbol#%E5%86%85%E7%BD%AE%E7%9A%84-Symbol-%E5%80%BC](https://es6.ruanyifeng.com/#docs/symbol#内置的-Symbol-值)).

~~因为他真的讲的比我好. TAT~~



### 最后

谢谢你能坚持阅读到这里. 本文到这里就结束了, 希望以上内容能对你有所帮助.