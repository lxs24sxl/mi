# 原生js-仿小米官网首页

* 最近在学习 javaScript设计模式 ,所以打算模仿个东西实践一下自己的js。此页面使用原生js编码（**不使用jquery**）根据 `自己封装的数据` 对页面进行数据绑定(命令模式)
* 性能优化: JS代码优化/css sprite/懒加载/鼠标划过节流/滚动节流
* 工具: 前端业务逻辑工具包 outils

## 模块化代码实现

1. 进行数据封装(~~一点都不耗费时间~~)
```
data.js

var categoryData = {
	"code": 200,
	"result": "success",
	"data": [
		{
			"index": 0,
			"cateName": "phone",
			"cateTitle": "手机 电话卡",
			"childrenData": [
				{
					"imgSrc": "images/category/phone/note3-80-2.png",
					"text": "小米Note 3"
				},
				{
					"imgSrc": "images/category/phone/note3-80-2.png",
					"text": "小米MIX 2"
				},
				...
			]
		}
	]
}

```

2. 模块实现
```
index.js
/*模块实现模块*/
var viewCommand = (function () {
	var tpl = {
		// 轮播图-雨伞盒模块
		carouselView: [
			'<li class="rainbox-item-{#index#}">',
				'<a class="thumb" href="#">',
					'<img src="images/blank.gif" data-echo="{#imgSrc#}">',
				'</a>',
				'<h3 class="title">',
					'<a href="#">{#title#}</a>',
				'</h3>',
				'<p class="desc">{#desc#}</p>',
				'<p class="price">{#price#}</p>',
			'</li>'
		].join(''),
	};


	// 格式化字符串缓存字符串
	var html = '';
	function formateString ( str, obj ){
		// 替换'{#'与'#}'之间的字符串
		return str.replace(/\{#(\w+)#\}/g, function (match, key){
			return obj[ key ];
		})
	}

	// 方法集合
	var Action = {
		//  雨伞盒轮播图
		createCarousel: function ( data, view ) {
			var len = data.length;
			if ( len ) {
				for ( var i = 0; i < len; i++ ) {
					html += formateString( tpl[ view ], data[ i ]);
				}
			}
		},
		insertCarousel: function ( container, data, view ) {
			if ( data ) {
				this.createCarousel( data, view );
			}
			document.getElementById( container ).innerHTML = html;
			html = '';
		},
	}


	// 命令接口
	return function excute( msg ){
		// 解析命令，如果msg.param不是数组则将其转化成数组（apply方法要求第二个参数为数组）
		msg.param = Object.prototype.toString.call( msg.param ) === "[object Array]"?msg.param:[msg.param];
		// Action内部调用的方法应用this,所以此处为保证作用域this执行传入Action
		Action[ msg.command ].apply(Action, msg.param);
	};
})();
	
```


3. 使用 原型模式 对代码进行重复性利用

原型模式: 用原型实例指向创建对象的类，适用于创建新的对象的类共享原型对象的属性以及方法
优点： 可重复性、可共享性、耗时少
```
	// 轮播列表类
	var LoopLists = function ( container, datas ) {
		this.container = container;
		this.datas = datas;
	};
	LoopLists.prototype = {
		// 创建轮播列表
		createList: function () {
			viewCommand({
				command: "insertCarousel",
				param: [ 'carouselList' + this.datas.index, jsonToArr(this.datas.data), "carouselView"]
			});
			this.changeList();
		},
		// 创建动画
		changeList: function () {
			<!-- 动画逻辑 -->
		}
	}

	// 商品类
	var ProduceLists = function (container, datas ) {
		// 构造函数继承轮播列表类
		LoopLists.call( this, container, datas );
	}

	ProduceLists.prototype = new LoopLists();

```

4. 创建实例并传入不同的参数，显示出2种不同的雨伞盒轮播图效果

```
	// 明星商品类
	var starCarousel = new ProduceLists( "starGoods", carouselData.data.starData );
	starCarousel.createList();
	
	// 为你推荐类
	var recCarousel = new ProduceLists( "recommend", carouselData.data.recommend );
	recCarousel.createList();

```
