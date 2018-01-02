
// 脚本加载的期间提前检测
// 条件预加载确保所有函数调消耗的时间相同。
var addHandler = document.body.addEventListener ?
				function ( target, eventType, handler ) {
					target.addEventListener(eventType, handler, false);
				}:
				function ( target, eventType, handler ) {
					target.attachEvent( "on" + eventType, handler );
				};
var removeHandler = document.body.removeEventListener ?
				function ( target, eventType, handler ) {
					target.removeEventListener(eventType, handler, false);
				}:
				function ( target, eventType, handler ) {
					target.detachEvent( "on" + eventType, handler );
				};

// 获取事件对象
var getEvent = function ( event ) {
	// 标准浏览器返回event，IE下window.event
	return event || window.event;
}
// 获取元素
var getTarget = function ( event ) {
	var event = getEvent( event );
	// 标准浏览器下 event.target,IE下 event.srcElement
	return event.target || event.srcElement;
}
// 阻止默认行为				
var preventDefault = function ( event ) {
	var event = getEvent( event );
	// 标准浏览器
	if ( event.preventDefault ) {
		event.preventDefault();
	// IE浏览器
	} else {
		event.returnValue = false;
	}
}
/*2.Class*/

// 2.1 addClass

/**
 * @desc 为元素添加class
 * @param {HTMLElement} ele
 * @param {String} cls
 */
function addClass( ele, cls ) {
	if ( !hasClass( ele, cls )) {
		ele.className += ' ' + cls;
	}
}

// 2.2 hasClass
/**
 * @desc 判断元素是否有某个class
 * @param {HTMLElement} ele
 * @param {String} cls
 * @return {Boolean}
 */
function hasClass ( ele, cls ) {
	return ( new RegExp( '(\\s|^)' + cls + '(\\s|$)')).test( ele.className );
}

// 2.3 removeClass
/**
 * @desc 判断元素是否有某个class
 * @param {HTMLElement} ele
 * @param {String} cls
 */
 function removeClass ( ele, cls ) {
 	if ( hasClass( ele, cls )) {
 		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
 		ele.className = ele.className.replace( reg, '');
 	}
 }
 //兼容浏览器获取节点文本的方法
 function getText ( e ) {
         var t="";
         
         //如果传入的是元素，则继续遍历其子元素
         //否则假定它是一个数组
         e = e.childNodes||e;
         
         //遍历所有子节点
         for( var j = 0,len = e.length ; j < len ; j++ ){
             //如果不是元素，追加其文本值
             //否则，递归遍历所有元素的子节点
             t += e[ j ].nodeType != 1 ?
                 e[ j ].nodeValue:text( e[ j ].childNodes );
         }
         //返回区配的文本
         return t;
}

// 4.1.getExplore
/**
 * @desc 获取浏览器类型和版本
 * @return {String}
 */
 function getExplore() {
 	var sys = {},
 		ua = navigator.userAgent.toLowerCase(),
 		s;
 		// 利用正则截取对应的版本号
 		( s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[ 1 ]:
 		( s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[ 1 ]:
 		( s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[ 1 ]:
 		( s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[ 1 ]:
 		( s = ua.match(/(?:opera|opr).([\d.]+)/)) ? sys.opera = s[ 1 ]:
 		( s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[ 1 ]:
 		( s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[ 1 ] : 0;
 		// 根据关系进行判断
 		if ( sys.ie ) return ('IE: ' + sys.ie )
 		if ( sys.edge ) return ("Edge: " + sys.edge )  
 		if ( sys.chrome ) return ('Chrome: ' + sys.chrome )
 		if ( sys.firefox ) return ('Firefox: ' + sys.firefox ) 
 		if ( sys.opera ) return ('Opera: ' + sys.opera )
 		if ( sys.safari ) return ('Safari: ' + sys.safari )
 		return 'Unkonwn'; 
 }
 console.log( getExplore() );
/**
 * @desc 深拷贝，支持常见类型
 * @param {Any} values
 */
function deepClone(values) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == values || "object" != typeof values) return values;

    // Handle Date
    if (values instanceof Date) {
        copy = new Date();
        copy.setTime(values.getTime());
        return copy;
    }

    // Handle Array
    if (values instanceof Array) {
        copy = [];
        for (var i = 0, len = values.length; i < len; i++) {
            copy[i] = deepClone(values[i]);
        }
        return copy;
    }

    // Handle Object
    if (values instanceof Object) {
        copy = {};
        for (var attr in values) {
            if (values.hasOwnProperty(attr)) copy[attr] = deepClone(values[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy values! Its type isn't supported.");
}
function getObjLength( obj ){
    var count = 0;
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            count++;
        };
    };
    return count;   
}

/*属性样式方法库*/
var S = {
	// 通过id获取元素
	g: function ( id ) {
		return document.getElementById( id );
	},
	// 设置元素css属性
	css: function ( id, key, value ) {
		return document.getElementById( id ).style[ key ] = value;
	},
	// 设置元素的属性
	attr: function ( id, key, value ) {
		return document.getElementById( id )[ key ] = value;
	},
	html: function( id, html ) {
		return document.getElementById( id ).innerHTML = html;
	},
	// 为元素绑定事件
	on: function( id, type, fn ) {
		// document.getElementById( id )[ 'on' + type ] = fn;
		// 如果传递参数时字符串则以id处理，否则以元素对象处理
		var dom = typeof id === 'string' ? this.g( id ): id;
		// 标准DOM2级添加事件
		if ( dom.addEventListener ) {
			dom.addEventListener( type, fn, false );
		// IE DOM2 级添加事件
		}else if ( dom.attachEvent ) {
			dom.attachEvent( 'on' + type, fn );
		// 简易添加事件方式
		} else {
			dom[ 'on' + type ] = fn;
		}
	}
};
function extend(target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }
    return target;
};
// 节流器
var throttle = function () {
	// 获取第一个参数
	var isClear = arguments[ 0 ], fn;
	// 如果第一个参数时boolean类型那么第一个参数则表示是否清除定时器
	if ( typeof isClear === 'boolean' ) {
		// 第二个参数则为函数
		fn = arguments[ 1 ];
		// 函数的定时器句柄存在，清除该定时器
		fn.__throttleID && clearTimeout( fn.__throttleID );
	//通过定时器延迟函数的执行
	} else {
		// 第一个参数为函数
		fn = isClear;
		// 第二个参数为函数执行时的函数
		param = arguments[ 1 ];
		// 对执行时的参数适配默认值,这里我们用到extend方法
		var p = extend({
			context: null,
			args: [],
			time: 200
		}, param );
		// 清除执行函数计时器句柄
		arguments.callee( true, fn );
		fn.__throttleID = setTimeout(function () {
			// 执行函数
			fn.apply( p.context, p.args );
		},p.time);
	}
}
/*集合转数组:提高遍历效率*/
function toArray ( coll ) {
	for ( var i = 0, a = [], len = coll.length; i < len; i++ ) {
		a[ i ] = coll[ i ];
	}
	return a;
}
/*json转数组*/
function jsonToArr( json ) {
	var obj = new Array();
	for ( var k in json ) {
		obj[ k ] = json[ k ];
	}
	return obj;
}


/*加载页面的时候*/
window.onload = function () {
	var mct = S.g( "miniCartTrigger" ),
		mcm = S.g( "miniCartMenu" ),
		tbc = S.g( "topbarCart" ),
		navMenu = S.g( "navMenu" ),
		navList = S.g( "navList" ),
		navCategory = S.g("navCategory");

	
	/*模块实现模块*/
	var viewCommand = (function () {
		var tpl = {
			// 展示导航模块
			navView: [
				'<li>',
					'<div class="figure figure-thumb">',
						'<a href="#">',
							'<img src="{#imgSrc#}">',
						'</a>',
					'</div>',
					'<div class="title">',
						'<a href="#">{#title#}</a>',
					'</div>',
					'<p class="price">{#price#}</p>',
					'<div class="flags" style="display:{#isFlags#};">',
						'<div class="flag">{#flag#}</div>',
					'</div>',
				'</li>'
			].join(''),
			// 展示商品模块
			categoryView: [
				'<li>',
					'<a href="" class="link">',
						'<img src="{#imgSrc#}" alt="" class="thumb">',
						'<span class="text">{#text#}</span>',
					'</a>',
				'</li>'
			].join(''),
			// 轮播图模块
			slideView: [
				'<div class="slide{#isShowSlide#}">',
					'<a href="#">',
						'<img src="images/blank.gif" data-echo="{#bannerImgSrc#}">',
					'</a>',
				'</div>'
			].join(''),
			// 轮播图焦点模块
			paperLinkView: [
				'<div class="ui-paper-item">',
					'<a class="ui-paper-link{#isShowLink#}">{#index#}</a>',
				'</div>'
			].join(''),
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
			// 轮播图-雨伞盒头部标题模块
			boxView: [
				'<div class="xs-plain-box">',
					'<div class="box-hd">',
						'<h2 class="title">{#boxTitle#}</h2>',
						'<div class="more">',
							'<div id="controlsBtn{#index#}" class="xs-controls xs-controls-line-small">',
								'<a href="#" class="control control-prev">',
									'<span class="prev">上一行</span>',
								'</a>',
								'<a href="#" class="control control-next">',
									'<span>下一行</span>',
								'</a>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="box-bd">',
						'<div class="xs-carousel-wrapper">',
							'<ul id="carouselList{#index#}" class="xs-carousel-list xs-carousel-col-{#dataDisplayLen#}-list goods-list clearfix" style="width: {#eleWdith#}px;">',
							'</ul>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			// 页面主要内容-商品区整体模块
			homeBrickHdView: [
				'<div class="box-hd">',
					'<h2 class="title">{#title#}</h2>',
					'<div class="more xs_bricklNav">',
						'<ul id="tabList{#index#}" class="tab-list">',
						'</ul>',
					'</div>',
				'</div>',
				'<div class="box-bd">',
					'<div class="row">',
						'<div class="span4">',
							'<ul id="promoList{#index#}" class="brick-promo-list clearfix">',
								// '<li class="brick-item brick-item-1">',
								// 	'<a href="#" class="exposure">', g">',
								// 	'</a>',
								// '</li>',
							'</ul>',
						'</div>',
						'<div id="brickListBoxs{#index#}" class="span16">',
							// '<ul id="brickList" class="brick-list clearfix tab-content tab-content-active">',
							// '</ul>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			// 内容模块
			brickItemView: [
				'<li class="brick-item brick-item-{#type#}">',
					'<div class="figure figure-img">',
						'<a class="exposure" href="#">',
							'<img src="images/blank.gif" data-echo="{#imgSrc#}" alt="{#title#}">',
						'</a>',
					'</div>',
					'<h3 class="title">',
						'<a href="#">{#title#}</a>',
					'</h3>',
					'<p class="desc">{#desc#}</p>',
					'<p class="price">',
						'<span class="num">{#priceNum#}</span>元',
						'<del>',
							'<span class="num">{#priceDelNum#}</span>元',
						'</del>',
					'</p>',
					'<p class="rank">{#rank#}</p>',
					'<div id="flag" class="flag flag-{#flagType#}">{#flag#}</div>',
					'<div class="review-wrapper">',
						'<a href="#">',
							'<span class="review">{#review#}</span>',
							'<span class="author">{#author#}',
								'<span class="date"></span>',
							'</span>',
						'</a>',
					'</div>',
				'</li>'
			].join(''),
			// 整体评论模块
			listView: [
				'<div class="box-hd">',
					'<h2 class="title">{#title#}</h2>',
					'<div class="more">',
						'<a class="more-link">{#moreText#}</a>',	
					'</div>',
				'</div>',
				'<div class="box-bd">',
					'<ul id="{#listId#}" class="{#listClass#} clearfix">',
					'</ul>',
				'</div>'
			].join(''),
			reviewItemView: [
				'<li class="review-item {#firstClass#}">',
					'<div class="figure figure-img">',
						'<a href="#">',
							'<img data-echo="{#imgSrc#}" src="images/blank.gif">',
						'</a>',
					'</div>',
					'<p class="review">',
						'<a href="#">{#review#}</a>',
					'</p>',
					'<p class="author">{#author#}</p>',
					'<div class="info">',
						'<h3 class="title">',
							'<a href="#">{#title#}</a>',
						'</h3>',
						'<span class="sep">|</span>',
						'<p class="price">',
							'<span class="num">{#price#}</span>元',
						'</p>',
					'</div>',
				'</li>'
			].join(''),
			//  内容列表外容器
			contentListView: [
				'<li class="content-item{#isFirst#} content-item-{#type#}">',
					'<h2 class="title">{#title#}</h2>',
					'<div class="xs-carousel-wrapper">',
						'<ul id="itemList{#index#}" class="item-list clearfix" style="width: 888px;margin-left: 0px;transition: margin-left 0.5s ease">',
						'</ul>',
					'</div>',
					'<div class="xs-pagers-wrapper">',
						'<ul id="xsPagers{#index#}" class="xs-pagers">',
						'</ul>',
					'</div>',
					'<div id="sControls{#index#}" class="xs-controls xs-controls-block-small xs-carousel-controls">',
						'<a class="control control-prev control-disable">',
							'<span>上一张</span>',
						'</a>',
						'<a class="control control-next">',
							'<span>下一张</span>',
						'</a>',
					'</div>',
				'</li>'
			].join(''),
			// 内容轮播图焦点模块
			pagerCarouselView: [
				'<li class="pager">',
					'<span class="dot">{#index#}</span>',
				'</li>'
			].join(''),
			// 内容区轮播图内容模块
			contentItemListView: [
				'<li>',
					'<h4 class="name">',
						'<a href="#" class="exposure">{#name#}</a>',
					'</h4>',
					'<p class="desc">',
						'<a href="#">{#desc#}</a>',
					'</p>',
					'<p class="price">',
						'<a href="#">{#price#}</a>',
					'</p>',
					'<div class="figure figure-img">',
						'<a href="#">',
							'<img src="images/blank.gif" data-echo="{#imgSrc#}" alt="{#name#}">',
						'</a>',
					'</div>',
				'</li>'
			].join(''),
			// 内容区轮播图内容模块最底部
			contentItemListEndView: [
				'<li class="more">',
					'<p class="desc">{#desc#}</p>',
					'<a class="btn btn-small btn-line-orange" href="#">{#btnText#}</a>',
					'<img class="thumb" src="images/blank.gif" data-echo="{#imgSrc#}">',
				'</li>'
			].join(''),
			// 视频列表模块
			videoListView: [
				'<li class="video-item {#firstClass#}">',
					'<div class="figure figure-img">',
						'<a class="exposure" href="#">',
							'<img src="images/blank.gif" data-echo="{#imgSrc#}">',
							'<span class="play">',
								'<i class="icon-play"></i>',
							'</span>',
						'</a>',
					'</div>',
					'<h3 class="title">',
						'<a href="#">{#title#}</a>',
					'</h3>',
					'<p class="desc">{#desc#}</p>',
				'</li>'
			].join("")

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
			/*菜单*/
			createNav: function ( data, view ) {
				// 解析数据，如果数据是一个数组
				if ( data.length ) {
					for (var i = 0, len = data.length; i < len; i++ ) {
						// 将格式化之后的字符串缓存到html中
						html += formateString(tpl[view], data[i]);
					}
				} else {
					html += formateString(tpl[view], data[i]);
				}
				// 清浮动的其中一种方法
				html += "<div class='xs-clear'></div>";
			},
			display: function ( container, data, view ) {
				if ( data ) {
					this.createNav( data, view );
				}
				// 展示模块
				// 可修改的区域
				document.getElementById( container ).innerHTML = html;
				// 可修改的区域
				// 展示后清空缓存字符串
				html = '';
			},
			/*全部商品*/
			craeteCgory: function ( data, view ) {
				if ( data.length ) {
					/*定义一个临时数组*/
					var col = [],colLen;
					// 将数据分成几组最多6份的数组
					for ( var i = 0, len = data.length; i < len; i += 6) {
						col.push( data.slice( i, i + 6));
					}
					// 此时临时数组的长度
					colLen = col.length > 4 ? 4: col.length;
					// 将页面代码封装
					for ( var j = 0; j < colLen; j++ ) {
						html += "<ul class='children-list children-list-col children-list-col-"+ (j + 1) +"'>";
						var len = col[ j ].length;
						for (var z = 0; z < len; z++ ) {
							html += formateString( tpl[ view ], data[ z ] );
						}
						html += "</ul>";
					}
					/*返回当前行数*/
					return colLen;
				}
			},
			insertCgory: function ( container, data, view ) {
				if ( data ) {
					var colLen = this.craeteCgory( data , view );
				}
				if ( container.children.length == 1 ) {
					var oDiv = document.createElement('div');
					oDiv.className = "children clearfix children-col-"+colLen;
					oDiv.innerHTML = html;
					container.appendChild(oDiv);
				}
				html = '';
			},
			/*轮播图*/
			createSlide: function ( data, view ) {
				if ( data.length ) {
					for ( var i = 0, len = data.length; i < len; i++ ) {
						html += formateString( tpl[ view ], data[ i ]);
					}
				} 
				else {
					html += formateString( tpl[ view ], data[ i ]);
				}
			},
			insertSlide: function ( container, data, view ) {
				if ( data ) {
					this.createSlide( data, view );
				}
				document.getElementById( container ).innerHTML= html ;
				html = '';
			},
			// 雨伞盒模块顶部
			createRainbox: function ( data, view ) {
				if ( data.length ) {
					html += formateString(tpl[view], data );
				} else {
					html += formateString(tpl[view], data );
				}
			},
			insertRainbox: function ( container , data, view ) {
				if ( data ) {
					this.createRainbox( data, view );
				}
				document.getElementById( container).innerHTML = html;
				html = '';
			},
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
			// 主要商品内容区-初步整体模块
			createBrickBox: function ( data, view ) {
				var dataLen = data.length;
				// console.log( dataLen );
				if (dataLen ) {
					for ( var i = 0; i < dataLen; i++ ) {
						html += formateString( tpl[ view ], data[ i ] );
					}
				} else {
					html += formateString( tpl[ view ], data );
				}
			},
			insertBrickBox: function ( container, data, view ) {
				if ( data ) {
					this.createBrickBox( data, view );
				}
				document.getElementById( container ).innerHTML = html;
				html = '';
			},
			createListBox: function ( data, view ) {
				console.log( data );
			},
			insertBrickItem: function ( container, data, view ) {
				if ( data ) {
					this.createBrickBox( data, view );
				}
				container.innerHTML = html;
				html = '';
			},
			displayReview: function ( container, data , view ) {
				if ( data ) {
					this.createBrickBox( data, view );
				} else {
					new Error( "数据不存在" );
				}
				document.getElementById( container ).innerHTML = html;
				html = "";
			},
			// 创建内容模块
			createContentBox: function ( obj, view ) {
				if ( obj ) {
					for ( var i in obj ) {
						html += formateString( tpl[ view ], obj[ i ] );
					}
				}
			},
			createPagers: function ( obj, view ) {
				if ( obj ) {
					for ( var i in obj ) {
						html += formateString( tpl[ view ], obj[ i ]);
					}
				}
				console.log( getObjLength( obj ) );
			},
			createContentList: function ( data, viewList ) {
				var len = data.length,
					view1 = viewList[ 0 ];
				if ( len ) {
					for ( var i = 0; i < len - 1; i++  ){
						html += formateString( tpl[ view1 ], data[ i ]);
					}
					html += formateString( tpl[ viewList[ 1 ]], data[ len - 1 ]);
				}
			},
			// 插入内容模块到容器
			insertContentBox: function ( container, obj, view ) {
				if ( obj ) {
					this.createContentBox( obj, view );
				} else {
					new Error( "数据出错");
				}
				document.getElementById( container).innerHTML = html;
				html = "";
				// 插入焦点按钮
				var pagers,ItemList;
				for ( var i in obj ) {
					// 创建焦点图模板
					this.createPagers( obj[ i ].data, "pagerCarouselView");
					// 获得当前list的pager
					pagers = document.getElementById( "xsPagers" + obj[ i ].index );
					// 插入焦点按钮
					pagers.innerHTML = html;
					// 默认第一个按钮为激活状态
					addClass( pagers.firstChild, "pager-active");
					html = "";

					// 创建列表模板
					this.createContentList( obj[ i ].data, ["contentItemListView","contentItemListEndView"]);
					// 获得当前list
					itemList = document.getElementById( 'itemList' + obj[ i ].index );
					itemList.style.cssText = "width: " + obj[ i ].width  + "px;margin-left: 0px;transition: margin-left 0.5s ease";
					// 插入列表
					itemList.innerHTML = html;
					// 初始化html
					html = "";
				}
			}
		};
		// 命令接口
		return function excute( msg ){
			// 解析命令，如果msg.param不是数组则将其转化成数组（apply方法要求第二个参数为数组）
			msg.param = Object.prototype.toString.call( msg.param ) === "[object Array]"?msg.param:[msg.param];
			// Action内部调用的方法应用this,所以此处为保证作用域this执行传入Action
			Action[ msg.command ].apply(Action, msg.param);
		};
	})();
	


	/*购物车*/
	var cartView = (function () {
		/*鼠标进入事件函数*/
		function cartMoveEnter () {
				console.log( "进入" );
				mct.style.cssText = 'color: orange;background-color: white;';
				mcm.style.cssText = "display:block;padding:15px 0 0;overflow:hidden;height:84px;opacity:1;";
		}
		/*鼠标离开事件函数*/
		function cartMoveLeave() {
			console.log( "离开" );
			mcm.style.cssText = "padding:0 0 0;height:0;";
			setTimeout(function() {
				mcm.style.cssText = "display:none;opacity: 0;";
				mct.style.cssText = 'color: #b0b0b0;background-color: #424242;';
			}, 200);
		}

		/*添加鼠标进入事件*/
		addHandler( tbc, "mouseenter" , function ( e ) {
			/*清除隐藏浮层方法计时器*/
			throttle( true, cartMoveLeave );
			/*延迟显示浮层方法*/
			throttle( cartMoveEnter );
			/*阻止默认行为*/
			preventDefault( e );
		});
		/*添加鼠标离开事件*/
		addHandler( tbc, "mouseleave" , function ( e ) {
			/*延迟隐藏浮层方法*/
			throttle( cartMoveLeave );
			/*清除显示浮层方法计时器*/
			throttle( true, cartMoveEnter );
			/*阻止默认行为*/
			preventDefault( e );
		});
	})();

	/*菜单*/
	var navView = (function () {
		var navMoveEnter = function () {
			navMenu.style.cssText = "display:block;height:229px;border-top: 1px solid #e3e3e3;";
		}
		var navMoveLeave = function () {
			navMenu.style.cssText = "height:0;border:none;";
		}
		/*菜单折叠事件*/
		// 获取navList的子元素，将集合转成数组
		var oLi = toArray( navList.children );
		// 遍历数组，给子元素添加进去离开事件
		for ( var i = 0, len = oLi.length; i < len; i++ ) {
			// 使用闭包绑定i变量,不用let的原因是因为兼容性处理
			(function ( x ) {
				// var Link = oLi[ x ].children[ 0 ];
				/*鼠标进入*/
				addHandler( oLi[ x ], "mouseenter", function (e) {
					console.log( x +":进入" );
					/*阻止默认行为*/
					preventDefault( e );
					/*清除隐藏浮层方法计时器*/
					throttle( true, navMoveLeave );
					/*延迟显示浮层方法*/
					throttle( navMoveEnter );
					/*解析数据，执行业务逻辑*/
					// 判断是否展示
					if (navData.data[x].isShow) {
						// 添加动态模板
						viewCommand({
							command: "display",
							param: ["childrenList", jsonToArr(navData.data[x].childData), "navView"]
						});
					// 不展示则隐藏浮层	
					}else {
						/*延迟隐藏浮层方法*/
						throttle( navMoveLeave );
						/*清除显示浮层方法计时器*/
						throttle( true, navMoveEnter );
					}

				});
				/*鼠标离开*/
				addHandler( oLi[ x ], "mouseleave", function (e) {
					console.log( x +":离开" );
					/*阻止默认行为*/
					preventDefault( e );
					/*封装函数*/
					/*延迟隐藏浮层方法*/
					throttle( navMoveLeave );
					/*清除显示浮层方法计时器*/
					throttle( true, navMoveEnter );
				});
			})(i);
		}
		addHandler( navMenu, "mouseenter", function (e) {
			preventDefault(e);
			/*清除隐藏浮层方法计时器*/
			throttle( true, navMoveLeave );
			throttle( navMoveEnter );
		});
		addHandler( navMenu, "mouseleave", function (e) {
			preventDefault(e);
			/*延迟隐藏浮层方法*/
			throttle( navMoveLeave );
			/*清除显示浮层方法计时器*/
			throttle( true, navMoveEnter );
		});
	})();
	
	/*图片轮播类*/
	var LoopImages = function ( container , data ) {
		this.container = container;
		this.data = data;
	};
	LoopImages.prototype = {
		
	}


	/*菜单视图*/
	var CategoryView = (function(){
		/*拿到categoryLi的集合并转换成数组*/
		var oCateLi = toArray( navCategory.children );

		for ( var i = 0, len = oCateLi.length ; i < len; i++ ) {
			(function (x) {
				var oHideDiv = [];
				addHandler(oCateLi[ x ], "mouseenter", function (e) {
					console.log( x );
					/*先渲染试图*/
					
					/*记录隐藏div:存储于局部变量中,减少集合的遍历*/
					if ( !oHideDiv[ x ]) {
						viewCommand({
							command: "insertCgory",
							param: [ oCateLi[x], jsonToArr(categoryData.data[x].childrenData), "categoryView"]
						});
						oHideDiv[ x ] = oCateLi[ x ].lastChild;
					}
					oHideDiv[ x ].style.display = "block";
					/*阻止默认行为*/
					preventDefault( e );

				});
				addHandler( oCateLi[ x ], "mouseleave", function ( e ){
					oHideDiv[x].style.display = "none";
					/*阻止默认行为*/
					preventDefault( e );
				});
			})(i)
		}
	})();
	/*轮播视图*/
	var SlideView = ( function () {
		
		// 轮播图
		viewCommand({
			command: "insertSlide",
			param: [ 'slider', jsonToArr(slideData.data), "slideView"]
		});
		// 轮播图焦点
		viewCommand({
			command: "insertSlide",
			param: [ 'paperLink', jsonToArr(slideData.data), "paperLinkView"]
		});
		// 获取上一张、下一张按钮
		var oBtnCD = toArray( document.getElementById( "controls-direction" ).children ),
			// 获取焦点按钮元素
			oPaperLink = toArray( document.getElementById( "paperLink" ).getElementsByTagName( "a" )),
			// 获取轮播图区域
			oSlider = document.getElementById( 'slider' ),
			// 获取轮播图
			oSliderChild = toArray( oSlider.children );
			;
		var index = 0,					// 初始化下标
			count = oPaperLink.length,	// 局部变量：焦点按钮的数量
			timer = null,				// 初始化定时器
			anim = {					// 动画效果对象
				prev: function () {		// 上一张
					this.hide();
					if ( index <= 0 ) {
						index = count - 1;
					} else {
						index--;
					}
					this.show();
				},
				next: function () {		// 下一张
					this.hide();
					if ( index >= count - 1 ) {
						index = 0;
					} else {
						index++;
					}
					this.show();
				},
				changeTo: function ( x ) {		// 切换到第n张
					this.hide();
					index = x;
					this.show();
				},
				hide: function () {				// 隐藏
					removeClass( oPaperLink[ index ], "paper-link-active");
					removeClass( oSliderChild[ index ], "slide-active" );
				},
				show: function () {					// 显示
					addClass( oPaperLink[ index ], "paper-link-active");
					addClass( oSliderChild[ index ], "slide-active" );
				},
				// 定义定时器
				startAutoPlay: function () {
					timer = setInterval(function () {
						anim.next();
					}, 4000);
				}

			};			
		// console.log( oBtnCD[ 0 ].firstChild.nodeValue );
		// 上一张下一张动画
		for ( var i = 0, len = oBtnCD.length; i < len; i++ ) {
			(function ( x ) {
				addHandler( oBtnCD[ x ], "click", function ( e ) {
					switch( oBtnCD[ x ].firstChild.nodeValue ) {
						case "上一张": 
							console.log( "向左动画" );
							anim.prev();
							break;
						case "下一张":
							console.log( "向右动画" );
							anim.next();
							break;
					}
					/*阻止默认行为*/
					preventDefault( e );
					console.log( index );
					return;
				});
			})( i );
		}
		// 焦点图按钮
		for ( var i = 0; i < count; i++ ) {
			(function ( x ) {
				addHandler(oPaperLink[ x ], "click", function ( e ) {
					/*阻止默认行为*/
					preventDefault( e );
					console.log( x );
					anim.changeTo( x );
				});
			})( i );
		}
		// 开启定时器
		anim.startAutoPlay();
		
		// 鼠标进入轮播图区域的时候，清除定时器
		addHandler( slider, "mouseenter", function( e ) {
			clearInterval(timer);
			/*阻止默认行为*/
			preventDefault( e );
		} );
		// 鼠标离开轮播图区域的时候，添加定时器
		addHandler( slider, "mouseleave", function ( e ) {
			anim.startAutoPlay();
			/*阻止默认行为*/
			preventDefault( e );
		});
	})();



	var LoopLists = function ( container, datas ) {
		this.container = container;
		this.datas = datas;
	};
	LoopLists.prototype = {
		// 创建轮播列表
		createList: function () {
			viewCommand({
				command: "insertRainbox",
				param: [ this.container, jsonToArr(this.datas), "boxView"]
			});
			viewCommand({
				command: "insertCarousel",
				param: [ 'carouselList' + this.datas.index, jsonToArr(this.datas.data), "carouselView"]
			});
			this.changeList();
		},
		// 创建动画
		changeList: function () {
			var curColumn = 0,									// 当前行数
				colLen = this.datas.colLen,						// 全部的行数
				carouselWidth = this.datas.eleWdith / colLen,
				index = this.datas.index,
				carouselList = document.getElementById('carouselList' + index),			// 轮播图窗口
				controlsBtn = toArray(document.getElementById( 'controlsBtn' + index ).getElementsByTagName("a")),		//获取按钮
				timer = null,									// 定时器
				CarouselAnim = { 
					startAutoPlay: function () {				// 开启定时器函数
						timer = setInterval(function() {
							CarouselAnim.autoPlay();
						}, 3500);
					},
					next: function () {							// 下一行数据
						clearInterval(timer);
						if ( curColumn == 1 ) {
							removeClass( oSpan[ 0 ], "prev");
						}else if ( curColumn == colLen - 1 ) {
							addClass( oSpan[ 1 ], "next");
						}
						carouselList.style.marginLeft = -carouselWidth * curColumn + "px";
						this.startAutoPlay();
					},
					prev: function () {
						clearInterval(timer);
						if ( curColumn == colLen - 2 ) {
							removeClass(oSpan[ 1 ], "next");
						} else if ( curColumn == 0 ) {
							addClass( oSpan[ 0 ], "prev" );
						}
						carouselList.style.marginLeft = -carouselWidth * curColumn + "px";
						this.startAutoPlay();
					},
					autoPlay: function () {
						if ( curColumn >= colLen - 1 ) {
							curColumn = 0;
							addClass( oSpan[ 0 ], "prev" );
							removeClass(oSpan[ 1 ], "next");
						} else {
							curColumn++;
							removeClass( oSpan[ 0 ], "prev");
							if ( curColumn == colLen - 1 ) {
								addClass( oSpan[ 1 ], "next");
							}
						}
						carouselList.style.marginLeft = -carouselWidth * curColumn + "px";
					}
				};

			var oSpan = [];	
			for (var i = 0, len = controlsBtn.length; i < len; i++ ) {
				oSpan.push(controlsBtn[ i ].getElementsByTagName("span")[0]);
				(function ( x ) {
					addHandler( controlsBtn[ x ] , "click", function ( e ) {
						/*阻止默认行为*/
						preventDefault( e );
						switch ( oSpan[ x ].innerHTML ) {
							case "上一行":
								console.log( "上一行" );
								if ( curColumn > 0 ) {
									curColumn--;
									console.log(curColumn);
								} else {
									console.log("第一行");
								}
								CarouselAnim.prev();
								break;
							case "下一行":
								console.log( "下一行" );
								if ( curColumn < colLen - 1 ) {
									curColumn++;
								} else {
									console.log("最后一行");
								}
								CarouselAnim.next();
								break; 
						}
					});
				})( i );
				
			}
			

			// 开启定时器
			CarouselAnim.startAutoPlay();


			// 鼠标进入轮播图区域的时候，清除定时器
			addHandler( starGoods, "mouseenter", function () {
				clearInterval(timer);
			});
			// 鼠标离开轮播图区域的时候，添加定时器
			addHandler( starGoods, "mouseleave", function () {
				CarouselAnim.startAutoPlay();
			});
		}
	}
	// 商品类
	var ProduceLists = function (container, datas ) {
		// 构造函数继承轮播列表类
		LoopLists.call( this, container, datas );
	}

	ProduceLists.prototype = new LoopLists();

	// 明星商品
	var starCarousel = new ProduceLists( "starGoods", carouselData.data.starData );
	starCarousel.createList();
	// 为你推荐
	var recCarousel = new ProduceLists( "recommend", carouselData.data.recommend );
	recCarousel.createList();

/****************************************************************************************/
	// 主页区块类
	var HomeBrickBoxs = function ( container, datas ) {
		this.container = container;
		this.datas = datas;
	}
	// 修改主页区块类的原型
	HomeBrickBoxs.prototype = {
		// 初始化外层容器
		createBox : function () {
			viewCommand({
				command: "insertBrickBox",
				param: [ this.container, jsonToArr(this.datas), "homeBrickHdView"]
			});
			// 执行补全视图及动画方法
			this.insertDatas();

		},
		// 补全视图及动画
		insertDatas: function () {

			var datas = this.datas,					// 获取数据
				index = datas.index,				// 获取当前数据的下标
				oContainer = document.getElementById( this.container ),			// 获取填充数据的容器	
				tabList = document.getElementById( "tabList" + index ),			// 获取当前容器的导航栏
				promoList = document.getElementById( "promoList" + index ),		// 获取容器左边的图片区
				brickListBox = document.getElementById( "brickListBoxs" + index ),		// 获取容器的商品内容区
				tabListData = datas.tabListData,								// 获取导航栏的数据
				tabListDataLen = tabListData.length,							// 获取导航的数量
				promoListImgSrc = datas.promoListImgSrc,						// 获取容器图片区的图片路径数组
				promoListLen = promoListImgSrc.length;							// 获取容器图片区的数量
			// 将Container脱离文本流
			oContainer.style.display = "none";
			// 插入box-hd的导航和box-bd的ul数量
			for ( var i = 0; i < tabListDataLen; i++ ) {
				var oLi = document.createElement( "li" );
				var oUl = document.createElement( "ul" );
				oLi.appendChild( document.createTextNode( tabListData[ i ]));
				// 初始化第一个导航和第一个内容为激活状态，其余为隐藏状态
				if ( i == 0 ) {
					addClass(oLi, "tab-active");
					addClass(oUl, "brick-list clearfix tab-content tab-content-active");
				} else {
					addClass(oUl, "brick-list clearfix tab-content tab-content-hide");
				}
				// 插入某个导航
				tabList.appendChild(oLi);
				// 插入
				brickListBox.appendChild( oUl );
				
			}
			// 当侧边图片的数量为1的时候，显示长图片
			this.createPromoList( promoListImgSrc, promoList );

			/*插入内容区*/
			var brickList = toArray(brickListBox.children);			// 获取
				brickListLen = brickList.length;

			var createBrickList = function ( index ) {
				viewCommand({
					command: "insertBrickItem",
					param: [ brickList[ index ], jsonToArr(datas.itemData[ index ]),"brickItemView"]
				});
				var oLi = document.createElement( "li" ),
					oDiv = document.createElement( "div" ),
					oImg = document.createElement( "img" ),
					oSmall = document.createElement( "small" ),
					oFrag = document.createDocumentFragment();
				addClass( oLi, "brick-item brick-item-s" );
				addClass( oDiv, "figure figure-more" );
				var oA = document.createElement( "a" );
				oA.href = "#";
				oA.appendChild( oImg );
				oDiv.appendChild( oA );
				oLi.appendChild( oDiv );
				oA = document.createElement( "a");
				addClass( oA, "more");
				oA.href = "#";
				oA.appendChild( document.createTextNode( "浏览更多" ));
				oSmall.appendChild( document.createTextNode( tabListData[ index ]));
				oA.appendChild( oSmall );
				oLi.appendChild( oA );
				brickList[ index ].appendChild( oLi );

				var brickListLi = toArray( brickList[ index ].getElementsByTagName( "li" ));
				for ( var j = 0, len = brickListLi.length; j < len; j++ ) {
					(function ( x ) {
						addHandler( brickListLi[ x ], "mouseenter", function ( e ) {
							preventDefault( e );
							console.log("enter");
							addClass( this, "brick-item-active");
						});
						addHandler( brickListLi[ x ], "mouseleave", function ( e ) {
							preventDefault( e );
							console.log("leave");
							removeClass( this, "brick-item-active");
						});
					})( j );
				}
			}
			createBrickList( 0 );

			/*为导航添加事件*/
			var brickList = toArray( brickListBox.children ),		// 获取所有列表
				tabListLi = toArray( tabList.children ),			// 获取所有导航
				oldItem = brickList[ 0 ],						// 记录当前列表
				oldTab = tabListLi[ 0 ];						// 记录当前导航
			for ( var i = 0; i < tabListDataLen; i++ ) {
				
				(function ( x ) {
					var oHideBrick = [];
					addHandler( tabListLi[ x ], "mouseenter", function ( e ) {
						preventDefault( e );


						/************************************/
						if ( !oHideBrick[ x ]) {
							oHideBrick[ x ] = brickList[ x ];

							createBrickList( x );
							Echo.init({

								offset: 0,

								throttle: 3000

							});

						}
						
						/*----------------------------------------------*/

						addClass( oldItem, " tab-content-hide");
						addClass( tabListLi[ x ], " tab-active");
						addClass( brickList[ x ], " tab-content-active");
						removeClass( oldItem, "tab-content-active");
						removeClass( oldTab, "tab-active" );
						removeClass( brickList[ x ], "tab-content-hide");
					} );

					addHandler( tabListLi[ x ], "mouseleave", function ( e ) {
						preventDefault( e );
						oldItem = brickList[ x ];
						oldTab = tabListLi[ x ];
					});
				})( i );
			}


			// 将container加入文本流
			oContainer.style.display = "block";

		},
		createPromoList: function ( promoListImgSrc, promoList) {
			
			for ( var i = 0, len = promoListImgSrc.length; i < len; i++ ) {
				var oLi = document.createElement( "li" ),
					oA = document.createElement( "a" ),
					oImg = document.createElement( "img" );
				/*处理图片区的图片展示*/
				if ( len == 1 ) {
					addClass( oLi, "brick-item brick-item-1");
				} else if ( len == 2 ) {
					addClass( oLi, "brick-item brick-item-m");
				} else {
					new Error( "现阶段不允许展示2张图片以上" );
				}
				// 添加class属性
				addClass( oA, "exposure");
				oA.href = "#";
				// 默认显示blank.gif
				oImg.src = "images/blank.gif";
				// 设置data-echo属性，实质是图片路径
				oImg.setAttribute("data-echo",promoListImgSrc[ i ] )
				// 插入图片
				oA.appendChild( oImg );
				oLi.appendChild( oA );
				( function ( x ){
					// 鼠标进入激活item列表
					addHandler( oLi, "mouseenter", function ( e ) {
						preventDefault( e );
						addClass( oLi, "brick-item-active" );
					});
					// 鼠标进入取消激活item列表
					addHandler( oLi, "mouseleave", function ( e ) {
						preventDefault( e );
						removeClass( oLi, "brick-item-active" );
					});
				})( i );
				promoList.appendChild( oLi );
			}

		}
	}
	// 模块构造函数
	var BrickBoxs = function ( container, datas ) {
		HomeBrickBoxs.call( this, container, datas );
	}
	BrickBoxs.prototype = new HomeBrickBoxs();
	// 储存数据，减少查找次数
	var pageData = pageMainData.data;
	// 家电模块实例
	var homeelec = new BrickBoxs("homeelec", pageData.homeelec );
	homeelec.createBox();
	// 智能模块实例
	var smart = new BrickBoxs( "smart", pageData.smart );
	smart.createBox();
	// 配件模块实例
	var accessories = new BrickBoxs( "accessories",pageData.accessories );
	accessories.createBox();
/*************************************************************************************/


/*************************************************************************************/
	// 热评类
	var ListBox = function ( container, data, viewList ) {
		this.container = container || "";
		this.data = jsonToArr( data ) || [];
		this.viewList = viewList || [];
	}
	ListBox.prototype = {
		createBox: function () {
			viewCommand({
				command: "displayReview",
				param: [ this.container,  this.data , this.viewList[ 0 ]]
			});

			viewCommand({
				command: "displayReview",
				param: [ this.data.listId, this.data.childData, this.viewList[ 1 ] ]
			});
		}
	}

	// 热评商品类
	var reviewBox = new ListBox( "comment", commentData.data, ["listView","reviewItemView"]);
	// 创建商品模块	
	reviewBox.createBox();

	var videoBox = new ListBox( "video", videoData.data, ["listView", "videoListView"]);
	videoBox.createBox();


	// 内容基类
	var ContentBox = function ( container, data, viewList ) {
		ListBox.call( this, container, data, viewList );
	}
	ContentBox.prototype = new ListBox();
	// 重写继承的创建模块方法
	ContentBox.prototype.createBox = function() {
			viewCommand({
				command: "displayReview",
				param: [ this.container, this.data, this.viewList[0]]
			});
			viewCommand({
				command: "insertContentBox",
				param: [ this.data.listId, this.data.data, this.viewList[ 1 ] ]
			});
			this.createBoxAnim();
	}
	// 添加动画效果
	ContentBox.prototype.createBoxAnim = function () {
			// 获得内容区
		var contentList =  document.getElementById( "contentList" ),
			// 获得内容区的外层列表
			contentListLi = toArray( contentList.children ),
			// 获得内容区的外层列表的长度
			listLiLen = contentListLi.length,
			controlsBtn, xsPargers;
			// 左右按钮
		for ( var i = 1; i <= listLiLen; i++ ) {
			( function ( ind ,data  ) { 
				// 获得当前列表的按钮元素
			 var controlsBtn = toArray( document.getElementById( "sControls" + ind ).children ),
				// 获取当前列表的焦点图按钮元素
				xsPagers = toArray( document.getElementById( "xsPagers" + ind ).children ),
				itemList = document.getElementById("itemList" + ind );

				var oldPagers = xsPagers[ 0 ],
					listWidth = data.data[ data.typeArr[  ind - 1 ] ].width;
				
				var listLen = xsPagers.length,
					anim = {
						index: 0,
						curLeft: 0,
						styleStr:"",
						prev: function () {
							// 存储局部变量，减少遍历
							var index = this.index;
							// 当当前下标大于0时，下标减一
							index = ( index > 0 )? index - 1: 0; 
							// 执行动画
							this.changeTo( index );
						},
						next: function () {
							// 存储局部变量，减少遍历
							var index = this.index;
							// 当index 大于等于最后一个数的时候，index等于最后一个值，否则加一
							index = ( index >= listLen - 1 )? listLen - 1: index + 1;
							// 执行动画
							this.changeTo( index );
						},
						changeTo: function ( index ) {
							// 存储当前的marginLeft值
							this.curLeft = -index * 296;
							// 改变当前下标
							this.index = index;
							// 存储当前cssText
							this.styleStr = "width: " + listWidth + "px;margin-left: " + this.curLeft + "px;transition: margin-left 0.5s ease";
							// 改变样式，执行动画
							itemList.style.cssText = this.styleStr;
							// 存储当前焦点
							var newPagers = xsPagers[ index ];
							// 当点击的焦点不为同一个时，执行逻辑
							if ( !(oldPagers == newPagers) ) {
								// 为点击的焦点添加激活状态
								addClass( newPagers, "pager-active");
								// 将之前的焦点移除激活状态
								removeClass( oldPagers, "pager-active");
								// 存储当前焦点按钮
								oldPagers = newPagers;
							}
						}
					}
				// 遍历按钮元素
				for ( var j = 0, len = controlsBtn.length; j < len; j++) {
					( function ( z ) {
						// 添加点击事件
						addHandler( controlsBtn[ z ], "click", function () {
							// 当点击为上一张按钮时
							if ( z == 0 ) {		
								anim.prev();
							// 当点击为上一张按钮时
							} else {
								anim.next();
							}
						});
					})( j );
				}
				
				for ( var n = 0, len = xsPagers.length; n < len; n++ ) {
					( function ( z ) {
						// 添加点击事件
						addHandler( xsPagers[ z ], "click", function () {
							anim.changeTo( z );
							Echo.init({ offset: 0, throttle: 3000 });
						});
					})( n );
				}

			})( i, this.data );
		}	
	}
	var contentBox = new ContentBox( "content", contentData, ["listView", "contentListView"]);
	contentBox.createBox();

	Echo.init({offset: 0,throttle: 3000 });
};
/*************************************************************************************/



/****************************************************************/
// todo: 未加载的时候，判断浏览器版本，IE8以下显示提示框
/****************************************************************/





/*滚动节流处理*/
var timer;

window.onscroll = function () {


    if( timer ) {
    	document.body.style.cssText = "pointer-events: none;";
    	clearTimeout( timer );
    }
    
    timer = setTimeout(function () {
        console.log( 'scrolling ends..' )
        document.body.style.cssText = "pointer-events: auto;";
    }, 150 );
}
