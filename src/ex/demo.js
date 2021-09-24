function foo() {
  console.log(this.name);
}

const obj = {
  name: 'some'
};

obj.foo = foo;
obj.foo();


// 实现call()效果
// v1
Function.prototype.myCall = function(thisArg, ...args) {
  thisArg.fn = this; // this 指向调用call的对象，即我们要改变this 指向的函数
  return thisArg.fn(...args); // 执行函数并retune 其执行结果
};

// v2
Function.prototype.myCall = function(thisArg, ...args) {
  const fn = Symbol('fn'); // 声明一个独有的Symbol属性, 防止fn覆盖已有属性
  thisArg = thisArg || window; // 若没有传入this, 默认绑定window对象
  thisArg[fn] = this; // this指向调用call的对象,即我们要改变this指向的函数
  const result = thisArg[fn](...args); //  执行当前函数
  delete thisArg[fn]; // 删除我们声明的fn属性
  return result; // 返回函数执行结果
};

foo.myCall(obj);


// 手写实现apply()

Function.prototype.myApply = function(thisArg, args) {
  const fn = Symbol('fn');
  thisArg = thisArg || window;
  thisArg[fn] = this;
  const result = thisArg[fn](...args); // 执行当前函数（此处说明一下：虽然apply()接收的是一个数组，但在调用原函数时，依然要展开参数数组。可以对照原生apply()，原函数接收到展开的参数数组）
  delete thisArg[fn];
  return result;
};

// 手写实现bind 从用法上看，似乎给call/apply包一层function就实现了bind()

Function.prototype.myBind = function(thisArg, ...args) {
  return () => {
    this.apply(thisArg, args);
  };
};

// 但我们忽略了三点：
// 1.bind()除了this还接收其他参数，bind()返回的函数也接收参数，这两部分的参数都要传给返回的函数
// 2.new会改变this指向：如果bind绑定后的函数被new了，那么this指向会发生改变，指向当前函数的实例
// 3.没有保留原函数在原型链上的属性和方法

Function.prototype.myBind = function (thisArg, ...args) {
  let self = this;
  // new 优先级
  let fbound = function () {
    self.apply(this instanceof self ? this : thisArg, args.concat(Array.prototype.slice.call(arguments)));
  };

  // 继承原型上的属性和方法
  fbound.prototype = Object.create(self.prototype);

  return fbound;

};

//测试
const obj1 = { name: '写代码像蔡徐抻' };
function foo1() {
    console.log(this.name);
    console.log(arguments);
}

foo1.myBind(obj1, 'a', 'b', 'c')();    //输出写代码像蔡徐抻 ['a', 'b', 'c']


// 手写一个防抖函数
// 防抖，即短时间内大量触发同一事件，只会执行一次函数，实现原理为设置一个定时器，约定在xx毫秒后再触发事件处理
// ，每次触发事件都会重新设置计时器，直到xx毫秒内无第二次操作，防抖常用于搜索框/滚动条的监听事件处理，
// 如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费

function debounce(func, wait) {
  let timeout = null;
  return function() {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args); // 改变this指向和参数数组
    }, wait);
  };
}


//手写一个节流函数

// 防抖是延迟执行，而节流是间隔执行，函数节流即每隔一段时间就执行一次，实现原理为设置一个定时器，
// 约定xx毫秒后执行事件，如果时间到了，那么执行函数并重置定时器，和防抖的区别在于，
// 防抖每次触发事件都重置定时器，而节流在定时器到时间后再清空定时器

function throttle(func, wait) {
  let timeout = null;
  return function() {
    let context = this;
    let args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      },wait);
    }
  };
}


// 数组扁平化
// 1.es6 flat
const arr = [1, [1, 2], [1, 2, 3]];
arr.flat(Infinity);

//2.序列化后正则
const srt = `[${JSON.stringify(arr).replace(/(\[|\])/g, '')}]`;
JSON.parse(srt);
//3.递归
function flat(arr) {
  let result = [];
  for (const item of arr) {
    item instanceof Array ? result = result.concat(flat(item)) : result.push(item);
  }

  return result;
}

flat(arr);

//4.reduce递归
function flat2(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat(cur instanceof Array ? flat2(cur) : cur);
  });
}

flat2(arr);

// 5.迭代+展开运算符
let arr1 = [];
while (arr.some(Array.isArray)) {
  arr1 = [].concat(...arr);
}

console.warn(arr1);

// 模拟实现new
// 1.创建一个新对象，并继承其构造函数的prototype，这一步是为了继承构造函数原型上的属性和方法
// 2.执行构造函数，方法内的this被指定为该新实例，这一步是为了执行构造函数内的赋值操作
// 3.返回新实例（规范规定，如果构造方法返回了一个对象，那么返回该对象，否则返回第一步创建的新对象）

// ew是关键字,这里我们用函数来模拟,new Foo(args) <=> myNew(Foo, args)
function myNew(foo, ...args) {
  // 创建新对象,并继承构造方法的prototype属性, 这一步是为了把obj挂原型链上, 相当于obj.__proto__ = Foo.prototype
  let obj = Object.create(foo.prototype);
  // 执行构造方法, 并为其绑定新this, 这一步是为了让构造方法能进行this.name = name之类的操作, args是构造方法的入参, 因为这里用myNew模拟, 所以入参从myNew传入
  let result =foo.apply(obj, args);
  // 如果构造方法已经return了一个对象，那么就返回该对象，否则返回myNew创建的新对象（一般情况下，构造方法不会返回新实例，但使用者可以选择返回新实例来覆盖new创建的对象）
  return Object.prototype.toString.call(result) === '[object Object]' ? result : obj;
}

// 测试：
function Foo(name) {
  this.name = name;
}
const newObj = myNew(Foo, 'zhangsan');
console.log(newObj);                 // Foo {name: "zhangsan"}
console.log(newObj instanceof Foo);  // true

// 原型链继承

function Parent() {
  this.name = 'p';
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child() {

}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

// 构造函数继承
function Child1() {
  Parent.call(this, 'p');
}


// 组合式继承

function Parent2(name) {
  this.name = [name];
}
Parent.prototype.getName = function() {
  return this.name;
};
function Child2() {
  // 构造函数继承
  Parent2.call(this, 'zhangsan');
}
//原型链继承
Child2.prototype = new Parent2();
Child2.prototype.constructor = Child2;


// 寄生式组合继承
function Parent3(name) {
  this.name = [name];
}
Parent.prototype.getName = function() {
  return this.name;
};
function Child3() {
  // 构造函数继承
  Parent3.call(this, 'zhangsan');
}
//原型链继承
// Child3.prototype = new Parent();
Child3.prototype = Object.create(Parent.prototype) ;  //将`指向父类实例`改为`指向父类原型`
Child3.prototype.constructor = Child3;

//测试
const child1 = new Child();
const child2 = new Child();
child1.name[0] = 'foo';
console.log(child1.name);          // ['foo']
console.log(child2.name);          // ['zhangsan']
child2.getName();                  // ['zhangsan']


// 手写冒泡排序
function bubbleSort(arr) {
  for(let i = 0;i < arr.length;i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j+1]) {
        let temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
}

// 设计模式
// 单例模式

class SingletonLogin {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

  static getInstance(name, password) {
    // 判断对象是否已经被创建，若创建则返回对象
    if (!this.instance) this.instance = new SingletonLogin(name, password);
    return this.instance;
  }
}
let obj1 = SingletonLogin.getInstance('CXK','123');
let obj2 = SingletonLogin.getInstance('CXK','321');

console.log(obj1===obj2);    // true
console.log(obj1);           // {name:CXK,password:123}
console.log(obj2);           // 输出的依然是{name:CXK,password:123}

// 装饰器模块
function info(target) {
  target.prototype.name = 'san';
  target.prototype.age = 10;
}
@info
class Man {}
let man = new Man();
man.name; // san
// 适配器模式
class Adaptte {
  test() {
    return 'old interface';
  }
}

class Target {
  constructor() {
    this.adaptee = new Adaptte();
  }
  test() {
    let info = this.adaptee.test();
    return `设配${info}`;
  }
}
// 代理模式
const idol = {
  name: 'some',
  phone: '123',
  price: 10000
};

const agent = new Proxy(idol, {
  get: function(target) {
    // 拦截明星电话的请求，只提供经纪人的电话
    return '经纪人电话';
  },
  set: function(target, key, value) {
    if (key === 'price') {
      // 经纪人过滤资质
      if (value < target.price) throw new Error('报价过低');
      target.price = value;
    }
  }
});
agent.phone;        //经纪人电话:10010
agent.price = 100;  //Uncaught Error: 报价过低

// 工厂模式
class User {
  constructor(name, auth) {
    this.name = name;
    this.auth = auth;
  }
}

class UserFactory {
  static createUser(name, auth) {
    // 工厂内部封装了创建对象的逻辑
    // 权限为admin时， auth = 1， 权限为user时， auth为2
    // 使用者在外部创建对象时，不需要知道各个权限对应哪个字段，不需要知道赋权的逻辑，只需要知道创建了一个管理员和用户
    if (auth === 'admin') new User(name, 1);
    if (auth === 'user') new User(name, 2);
  }
}

const admin = UserFactory.createUser('cxk', 'admin');
const user = UserFactory.createUser('cxk', 'user');
// 观察者模式

// 观察者
class Observer {
  constructor(fn) {
    this.update = fn;
  }
}

// 被观察者
class Subject {
  constructor() {
    this.observers = []; // 观察者队列
  }

  addObserver(observer) {
    this.observers.push(observer); // 往观察者队列添加观察者
  }

  notify() { // 通知所有观察者，实际时把观察者的update（）都执行一遍
    this.observers.forEach(observer => {
      observer.update(); // 依次取出观察者，并执行观察者的update方法
    });
  }
}

