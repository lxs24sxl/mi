
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
			].join('')
		}
		var html = "";
		function formateString( str, obj ) {
			// 替换'{#'与'#}'之间的字符串
			return str.replace( /\{#(\w+)#\}/g, function ( match, key ) {
				return obj[ key ];
			});
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
	Echo.init({offset: 0,throttle: 3000 });
	

};

/*************************************************************************************/





/****************************************************************/
// todo: 未加载的时候，判断浏览器版本，IE8以下显示提示框
/****************************************************************/

/**
 * 
 * @desc 获取滚动条距顶部的距离
 */
function getScrollTop() {
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
}
/**
 * 
 * @desc  获取一个元素的距离文档(document)的位置，类似jQ中的offset()
 * @param {HTMLElement} ele 
 * @returns { {left: number, top: number} }
 */
function offset(ele) {
    var pos = {
        left: 0,
        top: 0
    };
    while (ele) {
        pos.left += ele.offsetLeft;
        pos.top += ele.offsetTop;
        ele = ele.offsetParent;
    };
    return pos;
}

/*滚动节流处理*/
var timer;
var curScrollTop,
	fixNarBar = document.getElementById("fixNarBar"),
	S_indexBody = document.getElementById("S_indexBody"),
	sectionArr = toArray( S_indexBody.children );
window.onscroll = function () {
	curScrollTop = getScrollTop();
	// 到达第一个section
	if ( curScrollTop >= offset( sectionArr[ 0 ] ).top ) {
		addClass( fixNarBar, "nav-fix");
		addClass( sectionArr[ 0 ], "is-visible");
	} else {
		removeClass( fixNarBar, "nav-fix");
	}
	// 到达第二个section
	if ( curScrollTop >= offset( sectionArr[ 1 ]).top - 300 ) {
		addClass(sectionArr[ 1 ], "is-visible" );
	} 

	// 到达第三个section
	if (curScrollTop >= offset( sectionArr[ 2 ]).top - 200) {
		addClass(sectionArr[ 2 ], "is-visible" );
	}
	// 到达第四个section
	if (curScrollTop >= offset( sectionArr[ 3 ]).top - 200) {
		addClass(sectionArr[ 3 ], "is-visible" );
	}
	// 到达第五个section
	if (curScrollTop >= offset( sectionArr[ 4 ]).top - 200) {
		addClass(sectionArr[ 4 ], "is-visible" );
	}
	// 到达第六个section
	if (curScrollTop >= offset( sectionArr[ 5 ]).top - 200) {
		addClass(sectionArr[ 5 ], "is-visible" );
	}
	// 
	// 到达第七个section
	if (curScrollTop >= offset( sectionArr[ 6 ]).top - 200) {
		addClass(sectionArr[ 6 ], "is-visible" );
	}
	// 
    if( timer ) {
    	document.body.style.cssText = "pointer-events: none;";
    	clearTimeout( timer );
    }
    
    timer = setTimeout(function () {
        console.log( 'scrolling ends..' )
        document.body.style.cssText = "pointer-events: auto;";
    }, 150 );
}
