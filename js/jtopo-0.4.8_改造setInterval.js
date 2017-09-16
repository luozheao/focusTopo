define([],function () {
    var JTopo={};
//全局
        !function(window) {
        function Element() {
            this.initialize = function() {
                this.elementType = "element",
                    this.serializedProperties = ["elementType"],
                    this.propertiesStack = [],
                    this._id=JTopo.util.creatId()
            },
                this.distroy = function() {},
                this.removeHandler = function() {},
                this.attr = function(a, b) {
                    if (null != a && null != b)
                        this[a] = b;
                    else if (null != a)
                        return this[a];
                    return this
                },
                this.save = function() {
                    //this可以是scene、node、link，每次save只保留自身的数据，创建时的状态不能保存
                    var a = this
                        , b = {};
                    this.serializedProperties.forEach(function(c) {
                        b[c] = a[c]
                    }),
                        this.propertiesStack.push(b)
                },
                this.restore = function() {
                    if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
                        var a = this
                            , b = this.propertiesStack.pop();
                        this.serializedProperties.forEach(function(c) {
                            a[c] = b[c]
                        })
                    }
                },
                this.toJson = function() {
                    var a = this
                        , b = "{"
                        , c = this.serializedProperties.length;
                    return this.serializedProperties.forEach(function(d, e) {
                        var f = a[d];
                        "string" == typeof f && (f = '"' + f + '"'),
                            b += '"' + d + '":' + f,
                        c > e + 1 && (b += ",")
                    }),
                        b += "}"
                }
        }

            CanvasRenderingContext2D.prototype.JTopoRoundRect = function(a, b, c, d, e,f) {
            //f表示边框为虚线
            if(f){
                "undefined" == typeof e && (e = 5),
                    this.beginPath(),
                    // this.moveTo(a + e, b),
                    // this.lineTo(a + c - e, b),
                    this.JTopoDashedLineTo(a + e, b,a + c - e, b),
                    this.quadraticCurveTo(a + c, b, a + c, b + e),
                    //this.lineTo(a + c, b + d - e),
                    this.JTopoDashedLineTo(a + c, b + e,a + c, b + d - e),
                    this.quadraticCurveTo(a + c, b + d, a + c - e, b + d),
                    //this.lineTo(a + e, b + d),
                    this.JTopoDashedLineTo(a + c - e, b + d,a + e, b + d),
                    this.quadraticCurveTo(a, b + d, a, b + d - e),
                    // this.lineTo(a, b + e),
                    this.JTopoDashedLineTo(a, b + d - e,a, b + e),
                    this.quadraticCurveTo(a, b, a + e, b),
                    this.JTopoDashedLineTo(a, b, a + e, b),
                    this.closePath()
            }else {
                "undefined" == typeof e && (e = 5),
                    this.beginPath(),
                    this.moveTo(a + e, b),
                    this.lineTo(a + c - e, b),
                    this.quadraticCurveTo(a + c, b, a + c, b + e),
                    this.lineTo(a + c, b + d - e),
                    this.quadraticCurveTo(a + c, b + d, a + c - e, b + d),
                    this.lineTo(a + e, b + d),
                    this.quadraticCurveTo(a, b + d, a, b + d - e),
                    this.lineTo(a, b + e),
                    this.quadraticCurveTo(a, b, a + e, b),
                    this.closePath()
            }
        },
            CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function(a, b, c, d, e) {
                "undefined" == typeof e && (e = 5);
                var f = c - a, g = d - b, h = Math.floor(Math.sqrt(f * f + g * g)), i = 0 >= e ? h : h / e, j = g / h * e, k = f / h * e;
                this.beginPath();
                for (var l = 0; i > l; l++)
                    l % 2 ? this.lineTo(a + l * k, b + l * j) : this.moveTo(a + l * k, b + l * j);
                this.stroke()
            },
            CanvasRenderingContext2D.prototype.JtopoDrawPointPath = function (a, b, c, d, e, f) {

                var animespeed = (new Date()) / 10;
                var xs = c - a,
                    xy = d - b,
                    xl,
                    yl,
                    l = Math.floor(Math.sqrt(xs * xs + xy * xy)),
                    colorlength = 50,
                    j = l;
                if(l===0){
                    xl=0;
                    yl=0;
                }else{
                    xl = xs / l,
                        yl = xy / l;
                }
                var colorpoint = animespeed % (l + colorlength) - colorlength;
                for (var i = 0; i < j; i++) {
                    if (((i) > colorpoint) && ((i) < (colorpoint + colorlength))) {
                        this.beginPath();
                        this.strokeStyle = e;
                        this.moveTo(a + (i - 1) * xl, b + (i - 1) * yl);
                        this.lineTo(a + i * xl, b + i * yl);
                        this.stroke();
                    }
                    else {
                        this.beginPath();
                        this.strokeStyle = f;
                        this.moveTo(a + (i - 1) * xl, b + (i - 1) * yl);
                        this.lineTo(a + i * xl, b + i * yl)
                        this.stroke();
                    }
                }
            },//拓展byluozheao
            JTopo = {
                version: "0.4.8",
                zIndex_Container: 1,
                zIndex_Link: 2,
                zIndex_Node: 3,
                SceneMode: {
                    normal: "normal",
                    drag: "drag",
                    edit: "edit",
                    select: "select"
                },
                MouseCursor: {
                    normal: "default",
                    pointer: "pointer",
                    top_left: "nw-resize",
                    top_center: "n-resize",
                    top_right: "ne-resize",
                    middle_left: "e-resize",
                    middle_right: "e-resize",
                    bottom_left: "ne-resize",
                    bottom_center: "n-resize",
                    bottom_top: "n-resize",
                    bottom_right: "nw-resize",
                    move: "move",
                    open_hand: "url(./images/openhand.cur) 8 8, default",
                    closed_hand: "url(./images/closedhand.cur) 8 8, default"
                },
                createStageFromJson: function(jsonStr, canvas) {

                    eval("var jsonObj = " + jsonStr);
                    var stage = new JTopo.Stage(canvas);
                    for (var k in jsonObj)
                        "childs" != k && (stage[k] = jsonObj[k]);
                    var scenes = jsonObj.childs;
                    return scenes.forEach(function(a) {
                        var b = new JTopo.Scene(stage);
                        for (var c in a)
                            "childs" != c && (b[c] = a[c]),
                            "background" == c && (b.background = a[c]);
                        var d = a.childs;
                        d.forEach(function(a) {
                            var c = null
                                , d = a.elementType;
                            "node" == d ? c = new JTopo.Node : "CircleNode" == d && (c = new JTopo.CircleNode);
                            for (var e in a)
                                c[e] = a[e];
                            b.add(c)
                        })
                    }),
                        stage
                }
            },
            JTopo.Element = Element,
            window.JTopo = JTopo
    }(window),
        //jTopo具体方法的实现,部分全局方法的实现
        function(JTopo) {
            function MessageBus(a) {
                var b = this;
                this.name = a,
                    this.messageMap = {},
                    this.messageCount = 0,
                    this.subscribe = function(a, c) {
                        var d = b.messageMap[a];
                        null == d && (b.messageMap[a] = []),
                            b.messageMap[a].push(c),
                            b.messageCount++
                    },
                    this.unsubscribe = function(a) {
                        var c = b.messageMap[a];
                        null != c && (b.messageMap[a] = null,
                            delete b.messageMap[a],
                            b.messageCount--)
                    },
                    this.publish = function(a, c, d) {
                        var e = b.messageMap[a];
                        if (null != e)
                            for (var f = 0; f < e.length; f++)
                                d ? !function(a, b) {
                                    setTimeout(function() {
                                        a(b)
                                    }, 10)
                                }(e[f], c) : e[f](c)
                    }
            }
            function getDistance(a, b, c, d) {
                var e, f;
                return null == c && null == d ? (e = b.x - a.x,
                    f = b.y - a.y) : (e = c - a,
                    f = d - b),
                    Math.sqrt(e * e + f * f)
            }
            function getElementsBound(a) {
                for (var b = {
                    left: Number.MAX_VALUE,
                    right: Number.MIN_VALUE,
                    top: Number.MAX_VALUE,
                    bottom: Number.MIN_VALUE
                }, c = 0; c < a.length; c++) {
                    var d = a[c];
                    d instanceof JTopo.Link ||
                    (b.left > d.x && (b.left = d.x,b.leftNode = d),
                    b.right < d.x + d.width && (b.right = d.x + d.width,b.rightNode = d),
                    b.top > d.y && (b.top = d.y,b.topNode = d),
                    b.bottom < d.y + d.height && (b.bottom = d.y + d.height,b.bottomNode = d))
                }

                return b.width = b.right - b.left,
                    b.height = b.bottom - b.top,
                    b
            }
            function mouseCoords(a) {
                return a = cloneEvent(a),
                a.pageX || (a.pageX = a.clientX + document.body.scrollLeft - document.body.clientLeft,
                    a.pageY = a.clientY + document.body.scrollTop - document.body.clientTop),
                    a
            }
            function getEventPosition(a) {
                return a = mouseCoords(a)
            }
            function rotatePoint(a, b, c, d, e) {
                var f = c - a, g = d - b, h = Math.sqrt(f * f + g * g), i = Math.atan2(g, f) + e;
                return {
                    x: a + Math.cos(i) * h,
                    y: b + Math.sin(i) * h
                }
            }
            function rotatePoints(a, b, c) {
                for (var d = [], e = 0; e < b.length; e++) {
                    var f = rotatePoint(a.x, a.y, b[e].x, b[e].y, c);
                    d.push(f)
                }
                return d
            }
            function $foreach(a, b, c) {
                function d(e) {
                    e != a.length && (b(a[e]),
                        setTimeout(function() {
                            d(++e)
                        }, c))
                }
                if (0 != a.length) {
                    var e = 0;
                    d(e)
                }
            }
            function $for(a, b, c, d) {
                function e(a) {
                    a != b && (c(b),
                        setTimeout(function() {
                            e(++a)
                        }, d))
                }
                if (!(a > b)) {
                    var f = 0;
                    e(f)
                }
            }
            function cloneEvent(a) {
                var b = {};
                for (var c in a)
                    "returnValue" != c && "keyLocation" != c && (b[c] = a[c]);
                return b
            }
            function clone(a) {
                var b = {};
                for (var c in a)
                    b[c] = a[c];
                return b
            }
            function isPointInRect(a, b) {
                var c = b.x, d = b.y, e = b.width, f = b.height;
                return a.x > c && a.x < c + e && a.y > d && a.y < d + f
            }
            function isRectOverlapRect(rect1,rect2) {
                function  sugar(rect1,rect2) {
                    var rect=rect1;
                    var leftTop={
                        x:rect.x,
                        y:rect.y
                    }
                    var leftBottom={
                        x:rect.x,
                        y:rect.y+rect.height
                    }
                    var rightTop={
                        x:rect.x+rect.width,
                        y:rect.y
                    }
                    var rightBottom={
                        x:rect.x+rect.width,
                        y:rect.y+rect.height
                    }
                    return isPointInRect(leftTop,rect2)|| isPointInRect(leftBottom,rect2)|| isPointInRect(rightTop,rect2)|| isPointInRect(rightBottom,rect2)
                }
                return sugar(rect1,rect2)||sugar(rect2,rect1)
            }
            function isPointInLine(a, b, c) {
                var d = JTopo.util.getDistance(b, c), e = JTopo.util.getDistance(b, a), f = JTopo.util.getDistance(c, a), g = Math.abs(e + f - d) <= .5;
                return g
            }
            function removeFromArray(a, b) {
                for (var c = 0; c < a.length; c++) {
                    var d = a[c];
                    if (d === b) {
                        a = a.del(c);
                        break
                    }
                }
                return a
            }
            function randomColor() {
                return Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random())
            }
            function isIntsect() {}
            function getProperties(a, b) {
                for (var c = "", d = 0; d < b.length; d++) {
                    d > 0 && (c += ",");
                    var e = a[b[d]];
                    "string" == typeof e ? e = '"' + e + '"' : void 0 == e && (e = null),
                        c += b[d] + ":" + e
                }
                return c
            }
            function loadStageFromJson(json, canvas) {
                var obj = eval(json), stage = new JTopo.Stage(canvas);
                for (var k in stageObj)
                    if ("scenes" != k)
                        stage[k] = obj[k];
                    else
                        for (var scenes = obj.scenes, i = 0; i < scenes.length; i++) {
                            var sceneObj = scenes[i]
                                , scene = new JTopo.Scene(stage);
                            for (var p in sceneObj)
                                if ("elements" != p)
                                    scene[p] = sceneObj[p];
                                else
                                    for (var nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
                                        var elementObj = elements[m], type = elementObj.elementType, element;
                                        "Node" == type && (element = new JTopo.Node);
                                        for (var mk in elementObj)
                                            element[mk] = elementObj[mk];
                                        nodeMap[element.text] = element,
                                            scene.add(element)
                                    }
                        }
                return console.log(stage),
                    stage
            }
            function toJson(a) {
                var b = "backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll".split(","), c = "text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY".split(","), d = "{";
                d += "frames:" + a.frames,
                    d += ", scenes:[";
                for (var e = 0; e < a.childs.length; e++) {
                    var f = a.childs[e];
                    d += "{",
                        d += getProperties(f, b),
                        d += ", elements:[";
                    for (var g = 0; g < f.childs.length; g++) {
                        var h = f.childs[g];
                        g > 0 && (d += ","),
                            d += "{",
                            d += getProperties(h, c),
                            d += "}"
                    }
                    d += "]}"
                }
                return d += "]",
                    d += "}"
            }
            function changeColor(a, b, c, d, e,c1,d1,e1) {
                var f = canvas.width = b.width, g = canvas.height = b.height;
                a.clearRect(0, 0, canvas.width, canvas.height),
                    a.drawImage(b, 0, 0);
                for (var h = a.getImageData(0, 0, b.width, b.height), i = h.data, j = 0; f > j; j++) {
                    for (var k = 0; g > k; k++) {
                        var l = 4 * (j + k * f);//第l个像素点
                        if(i[l + 0]==c1&&i[l + 1]==d1&&i[l + 2]==e1){
                            i[l + 0]=c;
                            i[l + 1]=d;
                            i[l + 2]=e;
                        }

                    }
                    a.putImageData(h, 0, 0, 0, 0, b.width, b.height);
                }
                var m = canvas.toDataURL();
                // return alarmImageCache[b.src+nodeId] = m,
                //     m
                return m;

            }
            function getImageAlarm(a, b,f,m) {

                null == b && (b = 255);
                try {
                    // if (alarmImageCache[a.src]){
                    //     return alarmImageCache[a.src];
                    // }
                    var c = new Image;

                    return f&&m?c.src = changeColor(graphics, a,f[0],f[1],f[2],m[0],m[1],m[2]):c.src = changeColor(graphics, a, b),
                        //  alarmImageCache[a.src] = c,
                        c
                } catch (d) {}
                return null
            }
            function getOffsetPosition(a) {
                if (!a)
                    return {
                        left: 0,
                        top: 0
                    };
                var b = 0, c = 0;
                if ("getBoundingClientRect"in document.documentElement)
                    var d = a.getBoundingClientRect()
                        , e = a.ownerDocument
                        , f = e.body
                        , g = e.documentElement
                        , h = g.clientTop || f.clientTop || 0
                        , i = g.clientLeft || f.clientLeft || 0
                        , b = d.top + (self.pageYOffset || g && g.scrollTop || f.scrollTop) - h
                        , c = d.left + (self.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i;
                else
                    do
                        b += a.offsetTop || 0,
                            c += a.offsetLeft || 0,
                            a = a.offsetParent;
                    while (a);return {
                    left: c,
                    top: b
                }
            }
            function lineF(a, b, c, d) {
                function e(a) {
                    return a * f + g
                }
                var f = (d - b) / (c - a), g = b - a * f;
                return e.k = f,
                    e.b = g,
                    e.x1 = a,
                    e.x2 = c,
                    e.y1 = b,
                    e.y2 = d,
                    e
            }
            function inRange(a, b, c) {
                var d = Math.abs(b - c), e = Math.abs(b - a), f = Math.abs(c - a), g = Math.abs(d - (e + f));
                return 1e-6 > g ? !0 : !1
            }
            function isPointInLineSeg(a, b, c) {
                return inRange(a, c.x1, c.x2) && inRange(b, c.y1, c.y2)
            }
            function intersection(a, b) {
                var c, d;
                return a.k == b.k ? null : (1 / 0 == a.k || a.k == -1 / 0 ? (c = a.x1,
                    d = b(a.x1)) : 1 / 0 == b.k || b.k == -1 / 0 ? (c = b.x1,
                    d = a(b.x1)) : (c = (b.b - a.b) / (a.k - b.k),
                    d = a(c)),
                    0 == isPointInLineSeg(c, d, a) ? null : 0 == isPointInLineSeg(c, d, b) ? null : {
                        x: c,
                        y: d
                    })
            }
            function intersectionLineBound(a, b) {
                var c = JTopo.util.lineF(b.left, b.top, b.left, b.bottom), d = JTopo.util.intersection(a, c);
                return null == d && (c = JTopo.util.lineF(b.left, b.top, b.right, b.top),
                    d = JTopo.util.intersection(a, c),
                null == d && (c = JTopo.util.lineF(b.right, b.top, b.right, b.bottom),
                    d = JTopo.util.intersection(a, c),
                null == d && (c = JTopo.util.lineF(b.left, b.bottom, b.right, b.bottom),
                    d = JTopo.util.intersection(a, c)))),
                    d
            }
                Array.prototype.del = function(a) {
                    if ("number" != typeof a) {
                        for (var b = 0; b < this.length; b++)
                            if (this[b] === a)
                                return this.slice(0, b).concat(this.slice(b + 1, this.length));
                        return this
                    }
                    return 0 > a ? this : this.slice(0, a).concat(this.slice(a + 1, this.length))
                },
                Array.prototype.unique = function(){
                    this.sort(); //先排序
                    var res = [this[0]];
                    for(var i = 1; i < this.length; i++){
                        if(this[i] !== res[res.length - 1]){
                            res.push(this[i]);
                        }
                    }
                    return res;
                }, //数组去重方法
            [].indexOf || (Array.prototype.indexOf = function(a) {
                for (var b = 0; b < this.length; b++)
                    if (this[b] === a)
                        return b;
                return -1
            }),
            window.console || (window.console = {
                log: function() {},
                info: function() {},
                debug: function() {},
                warn: function() {},
                error: function() {}
            });
            var canvas = document.createElement("canvas")
                , graphics = canvas.getContext("2d")
                , alarmImageCache = {};
            JTopo.util = {
                //全局通用方法
                rotatePoint: rotatePoint,
                rotatePoints: rotatePoints,//获取旋转后的位置
                getDistance: getDistance,//获取两点间的距离
                getEventPosition: getEventPosition,
                mouseCoords: mouseCoords,//坐标
                MessageBus: MessageBus,//观察者模式，其中messageMap为事件数组
                isFirefox: navigator.userAgent.indexOf("Firefox") > 0,
                isIE: !(!window.attachEvent || -1 !== navigator.userAgent.indexOf("Opera")),
                isChrome: null != navigator.userAgent.toLowerCase().match(/chrome/),
                clone: clone,//克隆json对象
                isPointInRect: isPointInRect,//判断点是否在矩形内部
                isRectOverlapRect:isRectOverlapRect,//判断两个矩形是否重叠
                isPointInLine: isPointInLine,//判断点是否在线上，很巧妙
                removeFromArray: removeFromArray,
                cloneEvent: cloneEvent,
                randomColor: randomColor, //随机产生rgb颜色
                isIntsect: isIntsect,
                toJson: toJson,//将舞台转换成json对象
                loadStageFromJson: loadStageFromJson,//将json对象转换成舞台
                getElementsBound: getElementsBound,//获取元素宽高位置
                getImageAlarm: getImageAlarm,//获取图片告警，即变色功能
                getOffsetPosition: getOffsetPosition,
                lineF: lineF,//
                intersection: intersection, //交叉
                intersectionLineBound: intersectionLineBound, //连接两条线
                //拷贝一个json
                copy:function (jsonObj) {
                    return JSON.parse(JSON.stringify(jsonObj));
                },
                //根据key获取链接中的参数value
                getUrlParam:function(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                    if (r != null) return unescape(r[2]); return null; //返回参数值
                },
                creatId:function () {
                    return "front" + (new Date).getTime()+Math.round(Math.random()*1000000);
                },
                setCurHandUrl: function(url) {
                    JTopo.flag.imageUrl = url;
                    if(JTopo.flag.topoImgMap){
                        JTopo.MouseCursor.open_hand = "default";
                        JTopo.MouseCursor.closed_hand = "default";
                    }else{
                        JTopo.MouseCursor.open_hand = "url(" + url + "openhand.cur) 8 8, default";
                        JTopo.MouseCursor.closed_hand = "url(" + url + "closedhand.cur) 8 8, default"
                    }

                },
                //结点本身图片闪动
                nodeFlash:function (node,isChangeColor,isFlash,originColor,changeColor) {
                    node.fillAlarmForChangeColor=originColor;
                    node.alarm=isChangeColor?"true":null;
                    node.fillAlarmNode=changeColor;
                    node.setImage('changeColor');
                    node.flashT&&clearInterval(node.flashT);
                    if(isChangeColor&&isFlash){
                        //闪动
                        var i=1;
                        var tag=null;
                        node.flashT=setInterval(function () {
                            tag=  ++i%2;
                            node.alarm=tag?"true":null;
                            if(JTopo.flag.clearAllAnimateT){
                                clearInterval(node.flashT);
                            }
                        },1000)

                    }
                },
                //节点左上角图片闪动
                smallNodeFlash:function (node,isChangeColor,isFlash,originColor,changeColor) {
                    // node.setImage('./images/alertIcon2.png','setSmallImage');//setSmallImage 为设置小图标
                    // JTopo.util.smallNodeFlash(node,true,true,[202,202,202],[222,81,69]);//结点,是否变色,是否闪动,底色,变色

                    node.smallImageOriginColor=originColor;
                    node.smallImageChangeColor =changeColor;
                    node.smallAlarmImageTag=isChangeColor?"true":null;
                    node.setImage('changeSmallImageColor');
                    node.samllflashT&&clearInterval(node.samllflashT);
                    if(isChangeColor&&isFlash){
                        //闪动
                        var i=1;
                        var tag=null;
                        node.samllflashT=setInterval(function () {
                            tag=  ++i%2;
                            node.smallAlarmImageTag=tag?"true":null;
                            if(JTopo.flag.clearAllAnimateT){
                                clearInterval(node.samllflashT);
                            }
                        },1000)
                    }
                },
                //获取两点的连线倾斜角度
                getRotateAng:function (nodeA,nodeZ) {
                    var xs=nodeA.x- nodeZ.x,
                        xy=nodeA.y- nodeZ.y;
                    return Math.atan(xy/xs);
                },
                //找到当前节点的所有上级节点和线条的id
                findAllPrevNodesAndLinks:function (id,linksArr,saveObj) {
                    var _saveObj=saveObj;
                    if(!saveObj){
                        _saveObj={
                            prevNodesId:[],
                            prevLinksId:[]
                        }
                    }

                    for(var j=0;j<linksArr.length;j++){
                        var linkObj=linksArr[j];
                        if(linkObj.nodeZ.id==id){
                            _saveObj.prevNodesId.push(linkObj.nodeA.id);

                            _saveObj.prevLinksId.push(linkObj.id);

                            JTopo.util.findAllPrevNodesAndLinks(linkObj.nodeA.id,linksArr,_saveObj);
                        }
                    }
                    return _saveObj;
                },
                //找到当前节点的所有下级节点和线条的id
                findAllNextNodesAndLinks:function (id,linksArr,saveObj) {
                    var _saveObj=saveObj;
                    if(!saveObj){
                        _saveObj={
                            nextNodesId:[],
                            nextLinksId:[]
                        }
                    }

                    for(var j=0;j<linksArr.length;j++){
                        var linkObj=linksArr[j];
                        if(linkObj.nodeA.id==id){
                            _saveObj.nextNodesId.push(linkObj.nodeZ.id);
                            _saveObj.nextLinksId.push(linkObj.id);
                            JTopo.util.findAllNextNodesAndLinks(linkObj.nodeZ.id,linksArr,_saveObj);
                        }
                    }
                    return _saveObj;
                },
                //根据id找到元素
                findEleById:function(id){
                    var idTypeName=id.indexOf('front')>=0?'_id':'id';
                    return JTopo.flag.curScene.childs.filter(function(child){
                        return (child[idTypeName]==id)
                    })[0];
                },
                //根据类型找到元素
                findEleByType:function(type){
                    return JTopo.flag.curScene.childs.filter(function(child){
                        return (child.elementType==type)
                    });
                },
                //设置弹窗的位置
                setPopPos:function($pop,_nodeId,subW,subH) {

                    var _subW=subW||0;//横坐标微调值
                    var _subH=subH||0;//纵坐标微调值
                    var nodeId=_nodeId;//节点id
                    var $canvas=$('#canvas');
                    var left=$canvas.offset().left;
                    var _top=$canvas.offset().top;
                    var k=JTopo.flag.curScene.scaleX;//scene的缩放率
                    var w=$canvas.width();
                    var h=$canvas.height();
                    var $con=$pop;//弹窗jquery对象
                    var targetNode=null;//目标节点
                    var px=null;
                    var py=null;

                    JTopo.flag.curScene.childs.filter(function (child, p2, p3) {
                        if(child.id==nodeId){
                            targetNode=child;
                            if(targetNode.elementType=='link'){
                                px=(targetNode.nodeA.x+targetNode.nodeZ.x)*0.5;
                                py=(targetNode.nodeA.y+targetNode.nodeZ.y)*0.5;
                            }else{
                                px=targetNode.x+targetNode.width;
                                py=targetNode.y;
                            }
                        }
                    });
                    //算法
                    var conLeft=(1-k)*w*0.5+(px+JTopo.flag.curScene.translateX)*k+left+_subW;
                    var conTop=(1-k)*h*0.5+(py+JTopo.flag.curScene.translateY)*k+_top+_subH;
                    $con.css({
                        left:conLeft,
                        top:conTop
                    })
                },
                //改写window.setInterval成window.setTimeout
                setInterval:function (fn,time) {
                var T={};
                sugar();
                function  sugar() {
                    T.timehandle= setTimeout(function () {
                        fn();
                        sugar();
                    },time);
                }
                return T;
            },
                clearInterval:function (obj) {
                window.clearTimeout(obj.timehandle)
            }
            },
                JTopo.flag = {
                    clearAllAnimateT: false,
                    imageUrl: "./images/",
                    graphics: graphics,
                    curScene: null,
                    linkConfigure:{
                        textIsTilt:false,
                        textIsNearToNodeZ:false
                    },
                    topoImgMap:null,//webpack打包时,需要把所有图片引入进来,形成静态资源,然后用映射来调用图片
                },
                window.$for = $for,
                window.$foreach = $foreach
        }(JTopo),
        //舞台stage方法的具体实现
        function( a) {
            function b(a) {
                return {
                    hgap: 16,
                    visible: !1,
                    exportCanvas: document.createElement("canvas"),
                    getImage: function(b, c) {
                        var d = a.getBound()
                            , e = 1
                            , f = 1;
                        this.exportCanvas.width = a.canvas.width,
                            this.exportCanvas.height = a.canvas.height,
                            null != b && null != c ? (this.exportCanvas.width = b,
                                this.exportCanvas.height = c,
                                e = b / d.width,
                                f = c / d.height) : (d.width > a.canvas.width && (this.exportCanvas.width = d.width),
                            d.height > a.canvas.height && (this.exportCanvas.height = d.height));
                        var g = this.exportCanvas.getContext("2d");
                        return a.childs.length > 0 && (g.save(),
                            g.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height),
                            a.childs.forEach(function(a) {
                                1 == a.visible && (a.save(),
                                    a.translateX = 0,
                                    a.translateY = 0,
                                    a.scaleX = 1,
                                    a.scaleY = 1,
                                    g.scale(e, f),
                                d.left < 0 && (a.translateX = Math.abs(d.left)),
                                d.top < 0 && (a.translateY = Math.abs(d.top)),
                                    a.paintAll = !0,
                                    a.repaint(g),
                                    a.paintAll = !1,
                                    a.restore())
                            }),
                            g.restore()),
                            this.exportCanvas.toDataURL("image/png")
                    },
                    canvas: document.createElement("canvas"),
                    update: function() {
                        this.eagleImageDatas = this.getData(a);
                    },
                    setSize: function(a, b) {
                        this.width = this.canvas.width = a,
                            this.height = this.canvas.height = b
                    },
                    getData: function(b, c) {
                        function d(a) {
                            var b = a.stage.canvas.width
                                , c = a.stage.canvas.height
                                , d = b / a.scaleX / 2
                                , e = c / a.scaleY / 2;
                            return {
                                translateX: a.translateX + d - d * a.scaleX,
                                translateY: a.translateY + e - e * a.scaleY
                            }
                        }
                        var canvasObj=document.getElementById('canvas');
                        var container_w=250;
                        var container_h=container_w *canvasObj.height/canvasObj.width;

                        //设置地图大小
                     null != j && null != k ? this.setSize(b, c) : this.setSize(container_w, container_h);
                        var e = this.canvas.getContext("2d");
                        //绘制地图
                        if (a.childs.length > 0) {
                                e.save(),
                                e.clearRect(0, 0, this.canvas.width, this.canvas.height);
                                a.childs.forEach(function(a) {
                                    1 == a.visible && (
                                        a.save(),
                                        a.centerAndZoom(null, null, e),
                                        a.repaint(e,'eagleEye'),
                                        a.restore())
                                });

//a为stage  ,a.childs[0]为大画布
                            var f = d(a.childs[0])
                                , g = f.translateX * (this.canvas.width / a.canvas.width) * a.childs[0].scaleX
                                , h = f.translateY * (this.canvas.height / a.canvas.height) * a.childs[0].scaleY
                                , i = a.getBound()
                                , j = a.canvas.width / a.childs[0].scaleX / i.width
                                , k = a.canvas.height / a.childs[0].scaleY / i.height;

                            j > 1 && (j = 1),
                            k > 1 && (j = 1),
                                g *= j,
                                h *= k,
                            i.left < 0 && (g -= Math.abs(i.left) * (this.width / i.width)),
                            i.top < 0 && (h -= Math.abs(i.top) * (this.height / i.height)),
                                e.save(),
                                e.fillStyle="rgba(168,168,168,0.3)",
                              //  e.fillRect(-g, -h, e.canvas.width * j, e.canvas.height * k),
                                e.fillRect(-g+9, -h+5, this.canvas.width-18, this.canvas.height-10 ),
                                e.restore();
                            //上面绘制小地图红色边框
                            var l = null;
                            try {
                                l = e.getImageData(0, 0, e.canvas.width, e.canvas.height);
                            } catch (m) {}

                            return l;
                        }
                        return null
                    },

                    paint: function() {
                        if (null != this.eagleImageDatas) {
                               var b = a.graphics;
                               var w=4;
                                b.save(),
                                b.lineWidth = 1,
                                b.strokeStyle = "rgba(43,43,43,0.8)",
                                b.strokeRect(a.canvas.width - this.canvas.width-w,
                                    a.canvas.height - this.canvas.height - w,
                                    this.canvas.width+w-1,
                                    this.canvas.height+w),
                                b.putImageData(this.eagleImageDatas,
                                    a.canvas.width - this.canvas.width-w,
                                    a.canvas.height - this.canvas.height-1
                                ),
                                b.restore()
                           //上述,strokeStyle为小地图边框
                        } else
                            this.eagleImageDatas = this.getData(a);
                    },
                    eventHandler: function(a, b, c) {
                        var d = b.x
                            , e = b.y;
                        if (d > c.canvas.width - this.canvas.width && e > c.canvas.height - this.canvas.height) {
                            if (d = b.x - this.canvas.width,
                                    e = b.y - this.canvas.height,
                                "mousedown" == a && (this.lastTranslateX = c.childs[0].translateX,
                                    this.lastTranslateY = c.childs[0].translateY),
                                "mousedrag" == a && c.childs.length > 0) {
                                var f = b.dx
                                    , g = b.dy
                                    , h = c.getBound()
                                    , i = this.canvas.width / c.childs[0].scaleX / h.width
                                    , j = this.canvas.height / c.childs[0].scaleY / h.height;
                                c.childs[0].translateX = this.lastTranslateX - f / i,
                                    c.childs[0].translateY = this.lastTranslateY - g / j
                            }
                        } else
                            ;
                    }
                }
            }
            function c(c) {
                function d(b) {
                    var c = a.util.getEventPosition(b)
                        , d = a.util.getOffsetPosition(n.canvas);
                    return c.offsetLeft = c.pageX - d.left,
                        c.offsetTop = c.pageY - d.top,
                        c.x = c.offsetLeft,
                        c.y = c.offsetTop,
                        c.target = null,
                        c
                }
                function e(a) {
                    document.onselectstart = function() {
                        return !1
                    }
                        ,
                        this.mouseOver = !0;
                    var b = d(a);
                    n.dispatchEventToScenes("mouseover", b),
                        n.dispatchEvent("mouseover", b)
                }
                function f(a) {
                    p = setTimeout(function() {
                        o = !0
                    }, 500),
                        document.onselectstart = function() {
                            return !0
                        }
                    ;
                    var b = d(a);
                    n.dispatchEventToScenes("mouseout", b),
                        n.dispatchEvent("mouseout", b),
                        n.needRepaint = 0 == n.animate ? !1 : !0
                }
                function g(a) {
                    var b = d(a);
                    n.mouseDown = !0,
                        n.mouseDownX = b.x,
                        n.mouseDownY = b.y,
                        n.dispatchEventToScenes("mousedown", b),
                        n.dispatchEvent("mousedown", b)
                }
                function h(a) {
                    var b = d(a);
                    n.dispatchEventToScenes("mouseup", b),
                        n.dispatchEvent("mouseup", b),
                        n.mouseDown = !1,
                        n.needRepaint = 0 == n.animate ? !1 : !0
                }
                function i(a) {
                    p && (window.clearTimeout(p),
                        p = null),
                        o = !1;
                    var b = d(a);
                    n.mouseDown ? 0 == a.button && (b.dx = b.x - n.mouseDownX,
                            b.dy = b.y - n.mouseDownY,
                            n.dispatchEventToScenes("mousedrag", b),
                            n.dispatchEvent("mousedrag", b),
                        1 == n.eagleEye.visible && n.eagleEye.update()) : (n.dispatchEventToScenes("mousemove", b),
                        n.dispatchEvent("mousemove", b))
                }
                function j(a) {
                    var b = d(a);
                    n.dispatchEventToScenes("click", b),
                        n.dispatchEvent("click", b)
                }
                function k(a) {
                    var b = d(a);
                    n.dispatchEventToScenes("dbclick", b),
                        n.dispatchEvent("dbclick", b)
                }
                function l(a) {
                    var b = d(a);
                    n.dispatchEventToScenes("mousewheel", b),
                        n.dispatchEvent("mousewheel", b),
                    null != n.wheelZoom && (a.preventDefault ? a.preventDefault() : (a = a || window.event,
                        a.returnValue = !1),
                    1 == n.eagleEye.visible && n.eagleEye.update())
                }
                function m(b) {
                    a.util.isIE || !window.addEventListener ?
                        (b.onmouseout = f,
                            b.onmouseover = e,
                            b.onmousedown = g,
                            b.onmouseup = h,
                            b.onmousemove = i,
                            b.onclick = j,
                            b.ondblclick = k,
                            b.onmousewheel = l,
                            b.touchstart = g,
                            b.touchmove = i,
                            b.touchend = h)
                        :
                        (b.addEventListener("mouseout", f),
                            b.addEventListener("mouseover", e),
                            b.addEventListener("mousedown", g),
                            b.addEventListener("mouseup", h),
                            b.addEventListener("mousemove", i),
                            b.addEventListener("click", j),
                            b.addEventListener("dblclick", k),
                            a.util.isFirefox ? b.addEventListener("DOMMouseScroll", l)
                                :
                                b.addEventListener("mousewheel", l)),
                    window.addEventListener && (window.addEventListener("keydown", function(b) {
                        n.dispatchEventToScenes("keydown", a.util.cloneEvent(b));
                        var c = b.keyCode;
                        (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault() : (b = b || window.event,
                            b.returnValue = !1))
                    }, !0),
                        window.addEventListener("keyup", function(b) {
                            n.dispatchEventToScenes("keyup", a.util.cloneEvent(b));
                            var c = b.keyCode;
                            (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault() : (b = b || window.event,
                                b.returnValue = !1))
                        }, !0))
                }
                a.stage = this;
                var n = this;
                this.initialize = function(c) {
                    m(c),//添加事件
                        this.canvas = c,
                        this.graphics = c.getContext("2d"),
                        this.childs = [],
                        this.frames = 24,
                        this.messageBus = new a.util.MessageBus,
                        this.eagleEye = b(this),
                        this.wheelZoom = null,
                        this.mouseDownX = 0,
                        this.mouseDownY = 0,
                        this.mouseDown = !1,
                        this.mouseOver = !1,
                        this.needRepaint = !0,
                        this.serializedProperties = ["frames", "wheelZoom"]
                },
                null != c && this.initialize(c);
                var o = !0, p = null;
                document.oncontextmenu = function() {
                    return o
                },
                    this.dispatchEventToScenes = function(a, b) {
                        if (0 != this.frames && (this.needRepaint = !0),
                            1 == this.eagleEye.visible && -1 != a.indexOf("mouse")) {
                            var c = b.x
                                , d = b.y;
                            if (c > this.width - this.eagleEye.width && d > this.height - this.eagleEye.height)
                                return void this.eagleEye.eventHandler(a, b, this)
                        }
                        this.childs.forEach(function(c) {
                            if (1 == c.visible) {
                                var d = c[a + "Handler"];
                                if (null == d)
                                    throw new Error("Function not found:" + a + "Handler");
                                d.call(c, b)
                            }
                        })
                    },
                    this.add = function(a) {
                        for (var b = 0; b < this.childs.length; b++)
                            if (this.childs[b] === a)
                                return;
                        a.addTo(this),
                            this.childs.push(a)
                    },
                    this.remove = function(a) {
                        if (null == a)
                            throw new Error("Stage.remove鍑洪敊: 鍙傛暟涓簄ull!");
                        for (var b = 0; b < this.childs.length; b++)
                            if (this.childs[b] === a)
                                return a.stage = null,
                                    this.childs = this.childs.del(b),
                                    this;
                        return this
                    },
                    this.clear = function() {
                        this.childs = []
                    },
                    this.addEventListener = function(a, b) {
                        var c = this
                            , d = function(a) {
                            b.call(c, a)
                        };
                        return this.messageBus.subscribe(a, d),
                            this
                    },
                    this.removeEventListener = function(a) {
                        this.messageBus.unsubscribe(a)
                    },
                    this.removeAllEventListener = function() {
                        this.messageBus = new a.util.MessageBus
                    },
                    this.dispatchEvent = function(a, b) {
                        return this.messageBus.publish(a, b),
                            this
                    }
                ;
                var q = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","), r = this;
                q.forEach(function(a) {
                    r[a] = function(b) {
                        null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
                    }
                }),
                    this.saveImageInfo = function(a, b) {
                        var c = this.eagleEye.getImage(a, b)
                            , d = window.open("about:blank");
                        return d.document.write("<img src='" + c + "' alt='from canvas'/>"),
                            this
                    },
                    this.saveAsLocalImage = function(a, b) {
                        var c = this.eagleEye.getImage(a, b);
                        return c.replace("image/png", "image/octet-stream"),
                            window.location.href = c,
                            this
                    },
                    this.paint = function() {
                        null != this.canvas && (this.graphics.save(),
                            this.graphics.clearRect(0, 0, this.width, this.height),
                            this.childs.forEach(function(a) {
                                1 == a.visible && a.repaint(n.graphics)
                            }),
                        1 == this.eagleEye.visible && this.eagleEye.paint(this),
                            this.graphics.restore())
                    },
                    this.repaint = function() {
                        0 != this.frames && (this.frames < 0 && 0 == this.needRepaint || (this.paint(),
                        this.frames < 0 && (this.needRepaint = !1)))
                    },
                    this.zoom = function(a) {
                        this.childs.forEach(function(b) {
                            0 != b.visible && b.zoom(a)
                        })
                    },
                    this.zoomOut = function(a) {
                        this.childs.forEach(function(b) {
                            0 != b.visible && b.zoomOut(a)
                        })
                    },
                    this.zoomIn = function(a) {
                        this.childs.forEach(function(b) {
                            0 != b.visible && b.zoomIn(a)
                        })
                    },
                    this.zoomReset=function () {
                        this.childs.forEach(function(b) {
                            0 != b.visible && b.zoomReset()
                        })
                    },
                    this.centerAndZoom = function() {
                        this.childs.forEach(function(a) {
                            0 != a.visible && a.centerAndZoom()
                        })
                    },
                    this.setCenter = function(a, b) {
                        var c = this;
                        this.childs.forEach(function(d) {
                            var e = a - c.canvas.width / 2
                                ,f = b - c.canvas.height / 2;
                            d.translateX = -e,
                                d.translateY = -f
                        })
                    },
                    this.getBound = function() {
                        var a = {
                            left: Number.MAX_VALUE,
                            right: Number.MIN_VALUE,
                            top: Number.MAX_VALUE,
                            bottom: Number.MIN_VALUE
                        };

                        return this.childs.forEach(function(b) {
                            var c = b.getElementsBound();
                            c.left < a.left && (a.left = c.left,
                                a.leftNode = c.leftNode),
                            c.top < a.top && (a.top = c.top,
                                a.topNode = c.topNode),
                            c.right > a.right && (a.right = c.right,
                                a.rightNode = c.rightNode),
                            c.bottom > a.bottom && (a.bottom = c.bottom,
                                a.bottomNode = c.bottomNode)
                        }),
                            a.width = a.right - a.left,
                            a.height = a.bottom - a.top,
                            a
                    },
                    this.toJson = function() {
                        {
                            var b = this
                                , c = '{"version":"' + a.version + '",';
                            this.serializedProperties.length
                        }
                        return this.serializedProperties.forEach(function(a) {
                            var d = b[a];
                            "string" == typeof d && (d = '"' + d + '"'),
                                c += '"' + a + '":' + d + ","
                        }),
                            c += '"childs":[',
                            this.childs.forEach(function(a) {
                                c += a.toJson()
                            }),
                            c += "]",
                            c += "}"
                    },
                    function hahaha() {
                        0 == n.frames ? setTimeout(hahaha, 100) : n.frames < 0 ? (n.repaint(),
                            setTimeout(hahaha, 1e3 / -n.frames)) : (n.repaint(),
                            setTimeout(hahaha, 1e3 / n.frames))
                    }(),
                    setTimeout(function() {
                        n.mousewheel(function(a) {
                            var b = null == a.wheelDelta ? a.detail : a.wheelDelta;
                            null != this.wheelZoom && (b > 0 ? this.zoomIn(this.wheelZoom) : this.zoomOut(this.wheelZoom))
                        }),
                            n.paint()
                    }, 300),
                    setTimeout(function() {
                        n.paint()
                    }, 1e3),
                    setTimeout(function() {
                        n.paint()
                    }, 3e3)
            }
            c.prototype = {
                get width() {
                    return this.canvas.width
                },
                get height() {
                    return this.canvas.height
                },
                set cursor(a) {
                    this.canvas.style.cursor = a
                },
                get cursor() {
                    return this.canvas.style.cursor
                },
                set mode(a) {
                    this.childs.forEach(function(b) {
                        b.mode = a
                    })
                }
            },
                a.Stage = c
        }(JTopo),
        //场景scene方法的具体实现
        function(a) {
            function b(c) {
                function d(a, b, c, d) {
                    return function(e) {
                        e.beginPath(),
                            e.strokeStyle = "rgba(0,0,236,0.5)",
                            e.fillStyle = "rgba(0,0,236,0.1)",
                            e.rect(a, b, c, d),
                            e.fill(),
                            e.stroke(),
                            e.closePath()
                    }
                }
                var e = this;
                JTopo.flag.curScene = this;
                /********************scene属性定制************************************/
                this.initialize = function() {
                    b.prototype.initialize.apply(this, arguments),
                        this.messageBus = new a.util.MessageBus,
                        this.elementType = "scene",
                        this.childs = [],
                        this.zIndexMap = {},
                        this.zIndexArray = [],
                        this.backgroundColor = "255,255,255",
                        this.visible = !0,
                        this.alpha = 0,
                        this.scaleX = 1,
                        this.scaleY = 1,
                        this.mode = a.SceneMode.normal,
                        this.translate = !0,
                        this.translateX = 0,
                        this.translateY = 0,
                        this.lastTranslateX = 0,
                        this.lastTranslateY = 0,
                        this.mouseDown = !1,
                        this.mouseDownX = null,
                        this.mouseDownY = null,
                        this.mouseDownEvent = null,
                        this.areaSelect = !0,
                        this.operations = [],
                        this.selectedElements = [],
                        this.paintAll = !1;
                    var c = "background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY".split(",");
                    this.serializedProperties = this.serializedProperties.concat(c)
                } ,
                    this.initialize(),
                    this.setBackground = function(a) {
                        this.background = a
                    },
                    this.addTo = function(a) {
                        this.stage !== a && null != a && (this.stage = a)
                    },
                null != c && (c.add(this),
                    this.addTo(c)),
                    this.show = function() {
                        this.visible = !0
                    },
                    this.hide = function() {
                        this.visible = !1
                    },
                    this.paint = function(a,mapTag) {
                        if (0 != this.visible && null != this.stage) {
                            if (a.save(),
                                    this.paintBackgroud(a),
                                    a.restore(),
                                    a.save(),
                                    a.scale(this.scaleX, this.scaleY),
                                1 == this.translate) {
                                var b = this.getOffsetTranslate(a);
                                if(mapTag!='eagleEye'){
                                    a.translate(b.translateX, b.translateY)
                                }

                            }
                            this.paintChilds(a),
                                a.restore(),
                                a.save(),
                                this.paintOperations(a, this.operations),
                                a.restore()
                        }
                    },
                    this.repaint = function(a,mapTag) {
                        0 != this.visible && this.paint(a,mapTag)
                    },
                    this.paintBackgroud = function(a) {
                        null != this.background ? a.drawImage(this.background, 0, 0, a.canvas.width, a.canvas.height) : (a.beginPath(),
                            a.fillStyle = "rgba(" + this.backgroundColor + "," + this.alpha + ")",
                            a.fillRect(0, 0, a.canvas.width, a.canvas.height),
                            a.closePath())
                    },
                    this.getDisplayedElements = function() {
                        for (var a = [], b = 0; b < this.zIndexArray.length; b++)
                            for (var c = this.zIndexArray[b], d = this.zIndexMap[c], e = 0; e < d.length; e++) {
                                var f = d[e];
                                this.isVisiable(f) && a.push(f)
                            }
                        return a
                    },
                    this.getDisplayedNodes = function() {
                        for (var b = [], c = 0; c < this.childs.length; c++) {
                            var d = this.childs[c];
                            d instanceof a.Node && this.isVisiable(d) && b.push(d)
                        }
                        return b
                    },
                    this.paintChilds = function(b) {
                        for (var c = 0; c < this.zIndexArray.length; c++)
                            for (var d = this.zIndexArray[c], e = this.zIndexMap[d], f = 0; f < e.length; f++) {
                                var g = e[f];
                                if (1 == this.paintAll || this.isVisiable(g)) {
                                    if (b.save(),
                                        1 == g.transformAble) {
                                        var h = g.getCenterLocation();
                                        b.translate(h.x, h.y),
                                        g.rotate && b.rotate(g.rotate),
                                            g.scaleX && g.scaleY ? b.scale(g.scaleX, g.scaleY) : g.scaleX ? b.scale(g.scaleX, 1) : g.scaleY && b.scale(1, g.scaleY)
                                    }
                                    1 == g.shadow && (b.shadowBlur = g.shadowBlur,
                                        b.shadowColor = g.shadowColor,
                                        b.shadowOffsetX = g.shadowOffsetX,
                                        b.shadowOffsetY = g.shadowOffsetY),
                                    g instanceof a.InteractiveElement && (g.selected && 1 == g.showSelected && g.paintSelected(b),
                                    1 == g.isMouseOver && g.paintMouseover(b)),
                                        g.paint(b),
                                        b.restore()
                                }
                            }
                    },
                    this.getOffsetTranslate = function(a) {
                        var b = this.stage.canvas.width
                            , c = this.stage.canvas.height;
                        null != a && "move" != a && (b = a.canvas.width,c = a.canvas.height);
                        var d = b / this.scaleX / 2
                            , e = c / this.scaleY / 2
                            , f = {
                            translateX: this.translateX + (d - d * this.scaleX),
                            translateY: this.translateY + (e - e * this.scaleY)
                        };
                        return f
                    },//获取相对位移
                    this.isVisiable = function(b) {
                        if (1 != b.visible)
                            return !1;
                        if (b instanceof a.Link)
                            return !0;
                        var c = this.getOffsetTranslate()
                            , d = b.x + c.translateX
                            , e = b.y + c.translateY;
                        d *= this.scaleX,
                            e *= this.scaleY;
                        var f = d + b.width * this.scaleX
                            , g = e + b.height * this.scaleY;
                        return d > this.stage.canvas.width || e > this.stage.canvas.height || 0 > f || 0 > g ? !1 : !0
                    },
                    this.paintOperations = function(a, b) {
                        for (var c = 0; c < b.length; c++)
                            b[c](a)
                    },

                    this.findElements = function(a) {
                        for (var b = [], c = 0; c < this.childs.length; c++)
                            1 == a(this.childs[c]) && b.push(this.childs[c]);
                        return b
                    },
                    this.getElementsByClass = function(a) {
                        return this.findElements(function(b) {
                            return b instanceof a
                        })
                    },

                    this.addOperation = function(a) {
                        return this.operations.push(a),
                            this
                    },
                    this.clearOperations = function() {
                        return this.operations = [],
                            this
                    },
                    this.getElementByXY = function(b, c) {
                        for (var d = null, e = this.zIndexArray.length - 1; e >= 0; e--)
                            for (var f = this.zIndexArray[e], g = this.zIndexMap[f], h = g.length - 1; h >= 0; h--) {
                                var i = g[h];
                                if (i instanceof a.InteractiveElement && this.isVisiable(i) && i.isInBound(b, c))
                                    return d = i
                            }
                        return d
                    },
                    this.add = function(a) {
                        this.childs.push(a),
                        null == this.zIndexMap[a.zIndex] && (this.zIndexMap[a.zIndex] = [],
                            this.zIndexArray.push(a.zIndex),
                            this.zIndexArray.sort(function(a, b) {
                                return a - b
                            })),
                            this.zIndexMap["" + a.zIndex].push(a);
                        var thisObj=this;
                        setTimeout(function () {
                            thisObj.stage&&thisObj.stage.eagleEye.update();
                        },100);
                    },
                    this.remove = function(b) {
                        this.childs = a.util.removeFromArray(this.childs, b);
                        var c = this.zIndexMap[b.zIndex];
                        c && (this.zIndexMap[b.zIndex] = a.util.removeFromArray(c, b)),
                            b.removeHandler(this);
                        var thisObj=this;
                        setTimeout(function () {
                            thisObj.stage&&thisObj.stage.eagleEye.update();
                        },100);
                    },
                    this.clear = function() {
                        var a = this;
                        this.childs.forEach(function(b) {
                            b.removeHandler(a)
                        }),
                            this.childs = [],
                            this.operations = [],
                            this.zIndexArray = [],
                            this.zIndexMap = {};
                        var thisObj=this;
                        setTimeout(function () {
                            thisObj.stage&&thisObj.stage.eagleEye.update();
                        },100);
                    },
                    this.addToSelected = function(a) {
                        this.selectedElements.push(a)
                    },
                    this.cancelAllSelected = function(a) {
                        for (var b = 0; b < this.selectedElements.length; b++)
                            this.selectedElements[b].unselectedHandler(a);
                        this.selectedElements = []
                    },
                    this.notInSelectedNodes = function(a) {
                        for (var b = 0; b < this.selectedElements.length; b++)
                            if (a === this.selectedElements[b])
                                return !1;
                        return !0
                    },
                    this.removeFromSelected = function(a) {
                        for (var b = 0; b < this.selectedElements.length; b++) {
                            var c = this.selectedElements[b];
                            a === c && (this.selectedElements = this.selectedElements.del(b))
                        }
                    },
                    this.toSceneEvent = function(b) {
                        var c = a.util.clone(b);
                        if (c.x /= this.scaleX,
                                c.y /= this.scaleY,
                            1 == this.translate) {
                            var d = this.getOffsetTranslate();
                            c.x -= d.translateX,
                                c.y -= d.translateY
                        }
                        return null != c.dx && (c.dx /= this.scaleX,
                            c.dy /= this.scaleY),
                        null != this.currentElement && (c.target = this.currentElement),
                            c.scene = this,
                            c
                    },
                    this.selectElement = function(a) {

                        var b = e.getElementByXY(a.x, a.y);
                        if (null != b)
                            if (a.target = b,
                                    b.mousedownHander(a),
                                    b.selectedHandler(a),
                                    e.notInSelectedNodes(b))
                                a.ctrlKey || e.cancelAllSelected(),
                                    e.addToSelected(b);
                            else {
                                1 == a.ctrlKey && (b.unselectedHandler(),
                                    this.removeFromSelected(b));
                                for (var c = 0; c < this.selectedElements.length; c++) {
                                    var d = this.selectedElements[c];
                                    d.selectedHandler(a)
                                }
                            }
                        else
                            a.ctrlKey || e.cancelAllSelected();
                        this.currentElement = b
                    },
                    this.mousedownHandler = function(b) {
                        var c = this.toSceneEvent(b);

                        if (this.mouseDown = !0,
                                this.mouseDownX = c.x,
                                this.mouseDownY = c.y,
                                this.mouseDownEvent = c,
                            this.mode == a.SceneMode.normal)
                            this.selectElement(c),
                            (null == this.currentElement || this.currentElement instanceof a.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX,
                                this.lastTranslateY = this.translateY);
                        else {
                            if (this.mode == a.SceneMode.drag && 1 == this.translate)
                                return this.lastTranslateX = this.translateX,
                                    void (this.lastTranslateY = this.translateY);
                            this.mode == a.SceneMode.select ? this.selectElement(c) : this.mode == a.SceneMode.edit && (this.selectElement(c),
                                (null == this.currentElement || this.currentElement instanceof a.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX,
                                    this.lastTranslateY = this.translateY))
                        }
                        e.dispatchEvent("mousedown", c)
                    },
                    this.mouseupHandler = function(b) {
                        this.stage.cursor != a.MouseCursor.normal && (this.stage.cursor = a.MouseCursor.normal),
                            e.clearOperations();
                        var c = this.toSceneEvent(b);
                        null != this.currentElement && (c.target = e.currentElement,
                            this.currentElement.mouseupHandler(c)),
                            this.dispatchEvent("mouseup", c),
                            this.mouseDown = !1
                    },
                    this.dragElements = function(b) {
                        if (null != this.currentElement && 1 == this.currentElement.dragable)
                            for (var c = 0; c < this.selectedElements.length; c++) {
                                var d = this.selectedElements[c];
                                if (0 != d.dragable) {
                                    var e = a.util.clone(b);
                                    e.target = d,
                                        d.mousedragHandler(e)
                                }
                            }
                    },
                    this.mousedragHandler = function(b) {
                        var c = this.toSceneEvent(b);

                        this.mode == a.SceneMode.normal ?
                            null == this.currentElement || this.currentElement instanceof a.Link ?
                                1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand,
                                    this.translateX = this.lastTranslateX + c.dx,
                                    this.translateY = this.lastTranslateY + c.dy)
                                :
                                this.dragElements(c):
                            this.mode == a.SceneMode.drag ?
                                1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand,
                                    this.translateX = this.lastTranslateX + c.dx,
                                    this.translateY = this.lastTranslateY + c.dy)
                                :
                                this.mode == a.SceneMode.select ?
                                    null != this.currentElement ? 1 == this.currentElement.dragable && this.dragElements(c)
                                        :
                                        1 == this.areaSelect && this.areaSelectHandle(c)
                                    :
                                    this.mode == a.SceneMode.edit && (null == this.currentElement || this.currentElement instanceof a.Link ?
                                        1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand,
                                            this.translateX = this.lastTranslateX + c.dx,
                                            this.translateY = this.lastTranslateY + c.dy)
                                        :
                                        this.dragElements(c)),
                            this.dispatchEvent("mousedrag", c)
                    },
                    this.areaSelectHandle = function(a) {
                        var b = a.offsetLeft
                            , c = a.offsetTop
                            , f = this.mouseDownEvent.offsetLeft
                            , g = this.mouseDownEvent.offsetTop
                            , h = b >= f ? f : b
                            , i = c >= g ? g : c
                            , j = Math.abs(a.dx) * this.scaleX
                            , k = Math.abs(a.dy) * this.scaleY
                            , l = new d(h,i,j,k);
                        e.clearOperations().addOperation(l),
                            b = a.x,
                            c = a.y,
                            f = this.mouseDownEvent.x,
                            g = this.mouseDownEvent.y,
                            h = b >= f ? f : b,
                            i = c >= g ? g : c,
                            j = Math.abs(a.dx),
                            k = Math.abs(a.dy);
                        for (var m = h + j, n = i + k, o = 0; o < e.childs.length; o++) {
                            var p = e.childs[o];
                            p.x > h && p.x + p.width < m && p.y > i && p.y + p.height < n && e.notInSelectedNodes(p) && (p.selectedHandler(a),
                                e.addToSelected(p))
                        }
                    },
                    this.mousemoveHandler = function(b) {

                        this.mousecoord = {
                            x: b.x,
                            y: b.y
                        };
                        var c = this.toSceneEvent(b);
                        if (this.mode == a.SceneMode.drag)
                            return void (this.stage.cursor = a.MouseCursor.open_hand);
                        this.mode == a.SceneMode.normal ? this.stage.cursor = a.MouseCursor.normal : this.mode == a.SceneMode.select && (this.stage.cursor = a.MouseCursor.normal);
                        var d = e.getElementByXY(c.x, c.y);
                        null != d ? (e.mouseOverelement && e.mouseOverelement !== d && (c.target = d,
                            e.mouseOverelement.mouseoutHandler(c)),
                            e.mouseOverelement = d,
                            0 == d.isMouseOver ? (c.target = d,
                                d.mouseoverHandler(c),
                                e.dispatchEvent("mouseover", c)) : (c.target = d,
                                d.mousemoveHandler(c),
                                e.dispatchEvent("mousemove", c))) : e.mouseOverelement ? (c.target = d,
                            e.mouseOverelement.mouseoutHandler(c),
                            e.mouseOverelement = null,
                            e.dispatchEvent("mouseout", c)) : (c.target = null,
                            e.dispatchEvent("mousemove", c))
                    },
                    this.mouseoverHandler = function(a) {
                        var b = this.toSceneEvent(a);
                        this.dispatchEvent("mouseover", b)
                    },
                    this.mouseoutHandler = function(a) {
                        var b = this.toSceneEvent(a);
                        this.dispatchEvent("mouseout", b)
                    },
                    this.clickHandler = function(a) {
                        var b = this.toSceneEvent(a);
                        this.currentElement && (b.target = this.currentElement,
                            this.currentElement.clickHandler(b)),
                            this.dispatchEvent("click", b)
                    },
                    this.dbclickHandler = function(a) {
                        var b = this.toSceneEvent(a);
                        this.currentElement ? (b.target = this.currentElement,
                            this.currentElement.dbclickHandler(b)) : e.cancelAllSelected(),
                            this.dispatchEvent("dbclick", b)
                    },
                    this.mousewheelHandler = function(a) {
                        var b = this.toSceneEvent(a);
                        this.dispatchEvent("mousewheel", b)
                    },
                    this.touchstart = this.mousedownHander,
                    this.touchmove = this.mousedragHandler,
                    this.touchend = this.mousedownHander,
                    this.keydownHandler = function(a) {
                        this.dispatchEvent("keydown", a)
                    },
                    this.keyupHandler = function(a) {
                        this.dispatchEvent("keyup", a)
                    },
                    this.addEventListener = function(a, b) {
                        var c = this
                            , d = function(a) {
                            b.call(c, a)
                        };
                        return this.messageBus.subscribe(a, d),
                            this
                    },
                    this.removeEventListener = function(a) {
                        this.messageBus.unsubscribe(a)
                    },
                    this.removeAllEventListener = function() {
                        this.messageBus = new a.util.MessageBus
                    },
                    this.dispatchEvent = function(a, b) {
                        return this.messageBus.publish(a, b),
                            this
                    }
                ;
                var f = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","), g = this;
                return f.forEach(function(a) {
                    g[a] = function(b) {
                        null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
                    }
                }),
                    this.zoom = function(a, b) {
                        null != a && 0 != a && (this.scaleX = a),
                        null != b && 0 != b && (this.scaleY = b)
                    },
                    this.zoomOut = function(a) {
                        0 != a && (null == a && (a = .8),
                            this.scaleX /= a,
                            this.scaleY /= a)
                    },
                    this.zoomIn = function(a) {
                        0 != a && (null == a && (a = .8),
                            this.scaleX *= a,
                            this.scaleY *= a)
                    },
                    this.zoomReset=function () {
                        this.scaleX=1;
                        this.scaleY=1;
                    },
                    this.getBound = function() {
                        return {
                            left: 0,
                            top: 0,
                            right: this.stage.canvas.width,
                            bottom: this.stage.canvas.height,
                            width: this.stage.canvas.width,
                            height: this.stage.canvas.height
                        }
                    },
                    this.getElementsBound = function() {
                        return a.util.getElementsBound(this.childs)
                    },
                    this.translateToCenter = function(a) {
                        var b = this.getElementsBound()
                            , c = this.stage.canvas.width / 2 - (b.left + b.right) / 2
                            , d = this.stage.canvas.height / 2 - (b.top + b.bottom) / 2;
                        a && (c = a.canvas.width / 2 - (b.left + b.right) / 2,
                            d = a.canvas.height / 2 - (b.top + b.bottom) / 2),
                            this.translateX = c,
                            this.translateY = d
                    },
                    this.setCenter = function(a, b) {
                        var c = a - this.stage.canvas.width / 2
                            , d = b - this.stage.canvas.height / 2;
                        this.translateX = -c,
                            this.translateY = -d
                    },
                    this.centerAndZoom = function(a, b, c) {

                        if (
                            this.translateToCenter(c),
                            null == a || null == b) {
                            var d = this.getElementsBound()
                                , e = d.right - d.left
                                , f = d.bottom - d.top
                                , g = this.stage.canvas.width / e
                                , h = this.stage.canvas.height / f;
                            if(c) {
                                var canvasObj = document.getElementById('canvas');
                                var canvasWidth = canvasObj.width;
                                var canvasHeight = canvasObj.height;
                                if(e<canvasWidth){
                                    e=canvasWidth;
                                }
                                if(f<canvasWidth){
                                    f=canvasHeight;
                                }
                                g = c.canvas.width / e;
                                h = c.canvas.height / f;
                            }
                            var i = Math.min(g, h);
                            if (i > 1)
                                return;
                            this.zoom(g,h)
                           //   this.zoom(i, i)
                        }
                        this.zoom(a, b)
                    },
                    this.getCenterLocation = function() {
                        return {
                            x: e.stage.canvas.width / 2,
                            y: e.stage.canvas.height / 2
                        }
                    },
                    this.doLayout = function(a) {
                        a && a(this, this.childs)
                    },
                    this.toJson = function() {
                        {
                            var a = this
                                , b = "{";
                            this.serializedProperties.length
                        }
                        this.serializedProperties.forEach(function(c) {
                            var d = a[c];
                            "background" == c && (d = a._background.src),
                            "string" == typeof d && (d = '"' + d + '"'),
                                b += '"' + c + '":' + d + ","
                        }),
                            b += '"childs":[';
                        var c = this.childs.length;
                        return this.childs.forEach(function(a, d) {
                            b += a.toJson(),
                            c > d + 1 && (b += ",")
                        }),
                            b += "]",
                            b += "}"
                    },
                    e
            }
            b.prototype = new a.Element;
            var c = {};
            Object.defineProperties(b.prototype, {
                background: {
                    get: function() {
                        return this._background
                    },
                    set: function(a) {
                        if ("string" == typeof a) {
                            var b = c[a];
                            null == b && (b = new Image,
                                    b.src = a,
                                    b.onload = function() {
                                        c[a] = b
                                    }
                            ),
                                this._background = b
                        } else
                            this._background = a
                    }
                }
            }),
                a.Scene = b
        }(JTopo),
        //displayElement的具体实现,包含所有元素默认展示属性，挂载在jTopo上
        function(a) {
            function b() {
                    this.initialize = function() {
                    b.prototype.initialize.apply(this, arguments),
                        this.elementType = "displayElement",
                        this.x = 0,
                        this.y = 0,
                        this.width = 32,
                        this.height = 32,
                        this.visible = !0,
                        this.alpha = 1,
                        this.rotate = 0,
                        this.scaleX = 1,
                        this.scaleY = 1,
                        this.strokeColor = "22,124,255",
                        this.borderColor = "22,124,255",
                        this.fillColor = "255,255,255",
                        this.shadow = !1,
                        this.shadowBlur = 5,
                        this.shadowColor = "rgba(0,0,0,0.5)",
                        this.shadowOffsetX = 3,
                        this.shadowOffsetY = 6,
                        this.transformAble = !1,
                        this.zIndex = 0;
                    var a = "x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex".split(",");
                    this.serializedProperties = this.serializedProperties.concat(a);
                },
                    this.initialize(),
                    this.paint = function(a) {
                        a.beginPath(),
                            a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                            a.rect(-this.width / 2, -this.height / 2, this.width, this.height),
                            a.fill(),
                            a.stroke(),
                            a.closePath()
                    },
                    this.getLocation = function() {
                        return {
                            x: this.x,
                            y: this.y
                        }
                    },
                    this.setLocation = function(a, b) {
                        //画布上鼠标移动时激活
                        return this.x = a,
                            this.y = b,
                            this
                    },
                    this.getCenterLocation = function() {
                        return {
                            x: this.x + this.width / 2,
                            y: this.y + this.height / 2
                        }
                    },
                    this.setCenterLocation = function(a, b) {
                        return this.x = a - this.width / 2,
                            this.y = b - this.height / 2,
                            this
                    },
                    this.getSize = function() {
                        return {
                            width: this.width,
                            height: this.heith
                        }
                    },
                    this.setSize = function(a, b) {
                        return this.width = a,
                            this.height = b,
                            this
                    },
                    this.getBound = function() {
                        return {
                            left: this.x,
                            top: this.y,
                            right: this.x + this.width,
                            bottom: this.y + this.height,
                            width: this.width,
                            height: this.height
                        }
                    },
                    this.setBound = function(a, b, c, d) {
                        return this.setLocation(a, b),
                            this.setSize(c, d),
                            this
                    },
                    this.getDisplayBound = function() {
                        return {
                            left: this.x,
                            top: this.y,
                            right: this.x + this.width * this.scaleX,
                            bottom: this.y + this.height * this.scaleY
                        }
                    },
                    this.getDisplaySize = function() {
                        return {
                            width: this.width * this.scaleX,
                            height: this.height * this.scaleY
                        }
                    },
                    this.getPosition = function(a) {
                        var b, c = this.getBound();
                        return "Top_Left" == a ? b = {
                            x: c.left,
                            y: c.top
                        } : "Top_Center" == a ? b = {
                            x: this.cx,
                            y: c.top
                        } : "Top_Right" == a ? b = {
                            x: c.right,
                            y: c.top
                        } : "Middle_Left" == a ? b = {
                            x: c.left,
                            y: this.cy
                        } : "Middle_Center" == a ? b = {
                            x: this.cx,
                            y: this.cy
                        } : "Middle_Right" == a ? b = {
                            x: c.right,
                            y: this.cy
                        } : "Bottom_Left" == a ? b = {
                            x: c.left,
                            y: c.bottom
                        } : "Bottom_Center" == a ? b = {
                            x: this.cx,
                            y: c.bottom
                        } : "Bottom_Top" == a ? b = {
                            x: this.cx,
                            y: c.bottom
                        } :"Bottom_Right" == a && (b = {
                                x: c.right,
                                y: c.bottom
                            }),
                            b
                    }
            }
            function c() {
                this.initialize = function() {
                    c.prototype.initialize.apply(this, arguments),
                        this.elementType = "interactiveElement",
                        this.dragable = !1,
                        this.selected = !1,
                        this.showSelected = !0,
                        this.selectedLocation = null,
                        this.isMouseOver = !1;
                    var a = "dragable,selected,showSelected,isMouseOver".split(",");
                    this.serializedProperties = this.serializedProperties.concat(a)
                },
                    this.initialize(),
                    this.paintSelected = function(a) {
                            0 != this.showSelected && (a.save(),
                            a.beginPath(),
                            a.strokeStyle = "rgba(168,202,255, 0.5)",
                            a.fillStyle = "rgba(168,202,236,0.4)",
                            a.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6),
                            a.fill(),
                            a.stroke(),
                            a.closePath(),
                            a.restore())
                    },
                    this.paintMouseover = function(a) {
                        return this.paintSelected(a)
                    },
                    this.isInBound = function(a, b) {
                        return a > this.x && a < this.x + this.width * Math.abs(this.scaleX) && b > this.y && b < this.y + this.height * Math.abs(this.scaleY)
                    },
                    this.selectedHandler = function() {
                        this.selected = !0,
                            this.selectedLocation = {
                                x: this.x,
                                y: this.y
                            }
                    },
                    this.unselectedHandler = function() {
                        this.selected = !1,
                            this.selectedLocation = null
                    },
                    this.dbclickHandler = function(a) {
                        this.dispatchEvent("dbclick", a)
                    },
                    this.clickHandler = function(a) {
                        this.dispatchEvent("click", a)
                    },
                    this.mousedownHander = function(a) {
                        this.dispatchEvent("mousedown", a)
                    },
                    this.mouseupHandler = function(a) {
                        this.dispatchEvent("mouseup", a)
                    },
                    this.mouseoverHandler = function(a) {
                        this.isMouseOver = !0,
                            this.dispatchEvent("mouseover", a)
                    },
                    this.mousemoveHandler = function(a) {
                        this.dispatchEvent("mousemove", a)
                    },
                    this.mouseoutHandler = function(a) {
                        this.isMouseOver = !1,
                            this.dispatchEvent("mouseout", a)
                    },
                    this.mousedragHandler = function(a) {
                        var b = this.selectedLocation.x + a.dx
                            , c = this.selectedLocation.y + a.dy;
                        this.setLocation(b, c),
                            this.dispatchEvent("mousedrag", a)
                    },
                    this.addEventListener = function(b, c) {
                        var d = this
                            , e = function(a) {
                            c.call(d, a)
                        };
                        return this.messageBus || (this.messageBus = new a.util.MessageBus),
                            this.messageBus.subscribe(b, e),
                            this
                    },
                    this.dispatchEvent = function(a, b) {
                        return this.messageBus ? (this.messageBus.publish(a, b),
                            this) : null
                    },
                    this.removeEventListener = function(a) {
                        this.messageBus.unsubscribe(a)
                    },
                    this.removeAllEventListener = function() {
                        this.messageBus = new a.util.MessageBus
                    }
                ;
                var b = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend".split(","), d = this;
                b.forEach(function(a) {
                    d[a] = function(b) {
                        null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
                    }
                })
            }
            function d() {
                this.initialize = function () {
                    d.prototype.initialize.apply(this, arguments),
                        this.editAble = !1,
                        this.selectedPoint = null
                },
                    this.getCtrlPosition = function (a) {
                        var b = 5
                            , c = 5
                            , d = this.getPosition(a);
                        return {
                            left: d.x - b,
                            top: d.y - c,
                            right: d.x + b,
                            bottom: d.y + c
                        }
                    },
                    this.selectedHandler = function (b) {
                        d.prototype.selectedHandler.apply(this, arguments),
                            this.selectedSize = {
                                width: this.width,
                                height: this.height
                            },
                        b.scene.mode == a.SceneMode.edit && (this.editAble = !0)
                    },
                    this.unselectedHandler = function () {
                        d.prototype.unselectedHandler.apply(this, arguments),
                            this.selectedSize = null,
                            this.editAble = !1
                    };
                var b = ["Top_Left", "Top_Center", "Top_Right",
                    "Middle_Left", "Middle_Right",
                    "Bottom_Left", "Bottom_Center", "Bottom_Top", "Bottom_Right"];
                this.paintCtrl = function (a) {
                    if (0 != this.editAble) {
                        a.save();
                        for (var c = 0; c < b.length; c++) {
                            var d = this.getCtrlPosition(b[c]);
                            d.left -= this.cx,
                                d.right -= this.cx,
                                d.top -= this.cy,
                                d.bottom -= this.cy;
                            var e = d.right - d.left
                                , f = d.bottom - d.top;
                            a.beginPath(),
                                a.strokeStyle = "rgba(0,0,0,0.8)",
                                a.rect(d.left, d.top, e, f),
                                a.stroke(),
                                a.closePath(),
                                a.beginPath(),
                                a.strokeStyle = "rgba(255,255,255,0.3)",
                                a.rect(d.left + 1, d.top + 1, e - 2, f - 2),
                                a.stroke(),
                                a.closePath()
                        }
                        a.restore()
                    }
                },
                    this.isInBound = function (a, c) {
                        if (this.selectedPoint = null,
                            1 == this.editAble)
                            for (var e = 0; e < b.length; e++) {
                                var f = this.getCtrlPosition(b[e]);
                                if (a > f.left && a < f.right && c > f.top && c < f.bottom)
                                    return this.selectedPoint = b[e],
                                        !0
                            }
                        return d.prototype.isInBound.apply(this, arguments)
                    },
                    this.mousedragHandler = function (a) {

                        if (null == this.selectedPoint) {
                            var b = this.selectedLocation.x + a.dx
                                ,c = this.selectedLocation.y + a.dy;
                            this.setLocation(b, c),//tag:节点拖动时设置位置
                                this.dispatchEvent("mousedrag", a)
                        } else {
                            if ("Top_Left" == this.selectedPoint) {
                                var d = this.selectedSize.width - a.dx
                                    , e = this.selectedSize.height - a.dy
                                    , b = this.selectedLocation.x + a.dx
                                    , c = this.selectedLocation.y + a.dy;
                                b < this.x + this.width && (this.x = b,
                                    this.width = d),
                                c < this.y + this.height && (this.y = c,
                                    this.height = e)
                            }
                            else if ("Top_Center" == this.selectedPoint) {
                                var e = this.selectedSize.height - a.dy
                                    , c = this.selectedLocation.y + a.dy;
                                c < this.y + this.height && (this.y = c,
                                    this.height = e)
                            }
                            else if ("Top_Right" == this.selectedPoint) {
                                var d = this.selectedSize.width + a.dx
                                    , c = this.selectedLocation.y + a.dy;
                                c < this.y + this.height && (this.y = c,
                                    this.height = this.selectedSize.height - a.dy),
                                d > 1 && (this.width = d)
                            }
                            else if ("Middle_Left" == this.selectedPoint) {
                                var d = this.selectedSize.width - a.dx
                                    , b = this.selectedLocation.x + a.dx;
                                b < this.x + this.width && (this.x = b),
                                d > 1 && (this.width = d)
                            }
                            else if ("Middle_Right" == this.selectedPoint) {
                                var d = this.selectedSize.width + a.dx;
                                d > 1 && (this.width = d)
                            }
                            else if ("Bottom_Left" == this.selectedPoint) {
                                var d = this.selectedSize.width - a.dx
                                    , b = this.selectedLocation.x + a.dx;
                                d > 1 && (this.x = b,
                                    this.width = d);
                                var e = this.selectedSize.height + a.dy;
                                e > 1 && (this.height = e)
                            }
                            else if ("Bottom_Center" == this.selectedPoint) {
                                var e = this.selectedSize.height + a.dy;
                                e > 1 && (this.height = e)
                            }
                            else if ("Bottom_Top" == this.selectedPoint) {
                                var e = this.selectedSize.height + a.dy;
                                e > 1 && (this.height = e)
                            }
                            else if ("Bottom_Right" == this.selectedPoint) {
                                var d = this.selectedSize.width + a.dx;
                                d > 1 && (this.width = d);
                                var e = this.selectedSize.height + a.dy;
                                e > 1 && (this.height = e)
                            }
                            this.dispatchEvent("resize", a)
                        }
                    }
            }
            b.prototype = new a.Element,
                Object.defineProperties(b.prototype, {
                    cx: {
                        get: function() {
                            return this.x + this.width / 2
                        },
                        set: function(a) {
                            this.x = a - this.width / 2
                        }
                    },
                    cy: {
                        get: function() {
                            return this.y + this.height / 2
                        },
                        set: function(a) {
                            this.y = a - this.height / 2
                        }
                    }
                }),
                c.prototype = new b,
                d.prototype = new c,
                a.DisplayElement = b,
                a.InteractiveElement = c,
                a.EditableElement = d
        }(JTopo),
        //node的具体实现（包括textNode和linkNode、CircleNode、AnimateNode）
        function(a) {
            function b(c) {
                this.initialize = function(c) {
                    b.prototype.initialize.apply(this, arguments),
                        this.elementType = "node",
                        this.zIndex = a.zIndex_Node,
                        this.text = c,
                        this.nodeFn=null,
                        this.textBreakNumber=5;
                        this.textLineHeight=15;
                        this.font = "12px Consolas",
                        this.fontColor = "85,85,85",
                        this.borderWidth = 0,
                        this.borderColor = "255,255,255",
                        this.borderRadius = null,
                        this.alarmColor="255,0,0";
                    this.fillAlarmNode=[255,0,0];
                    this.fillAlarmForChangeColor=null;
                    this.showAlarmText=false;
                    this.keepChangeColor=false;//true则保持改变后的颜色不变
                    this.dragable = !0,
                        this.textPosition = "Bottom_Center",
                        this.textOffsetX = 0,
                        this.textOffsetY = 0,
                        this.transformAble = !0,
                        this.inLinks = null,
                        this.outLinks = null;
                    this.linearGradient=null;
                    this.colorStop=null;
                    this.smallAlarmImage_w=20;
                    this.smallAlarmImage_h=20;
                    this.smallAlarmImage_x=null;
                    this.smallAlarmImage_y=null;
                    this.smallAlarmImageTag=false;
                    this.smallAlarmImageObj=null;
                    this.smallAlarmImageChangeObj=null;
                    this.smallImageOriginColor=[255,0,0];
                    this.smallImageChangeColor=null;
                    this.paintCallback=null;
                    var d = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius".split(",");
                    this.serializedProperties = this.serializedProperties.concat(d)
                },
                    this.initialize(c),
                    this.paint = function(a) {
                        if (this.image) {
                            var b = a.globalAlpha;
                            a.globalAlpha = this.alpha;
                            if (typeof  this.image != 'string') {
                                if (this.keepChangeColor) {
                                    a.drawImage(this.image.alarm, -this.width / 2, -this.height / 2, this.width, this.height)
                                } else {
                                    if (null != this.image.alarm && null != this.alarm) {
                                        a.drawImage(this.image.alarm, -this.width / 2, -this.height / 2, this.width, this.height)
                                    } else {
                                        a.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height)
                                    }
                                }
                            }
                            a.globalAlpha = b;
                        }
                        else {
                            a.beginPath(),
                                a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                                null == this.borderRadius || 0 == this.borderRadius ? a.rect(-this.width / 2, -this.height / 2, this.width, this.height) : a.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius),
                                a.fill();
                        }
                        if (this.linearGradient) {
                            var kVal = this.kVal;
                            var grd = a.createLinearGradient(this.linearGradient[0], this.linearGradient[1], this.linearGradient[2] * kVal, this.linearGradient[3])
                            for (var grdCount = 0; grdCount < this.colorStop.length / 2; grdCount++) {
                                grd.addColorStop(this.colorStop[grdCount * 2], this.colorStop[grdCount * 2 + 1]);
                            }
                            a.fillStyle = grd;
                            null == this.borderRadius || 0 == this.borderRadius ? a.rect(-this.width / 2, -this.height / 2, this.width * kVal, this.height) : a.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width * kVal, this.height, kVal < 0.03 ? 0 : this.borderRadius);
                            a.fill();

                        }
                        a.closePath();
                        this.paintText(a),
                            this.paintBorder(a),
                            this.paintCtrl(a),
                            this.paintAlarmText(a),
                            this.paintAlarmImage(a),
                        this.paintCallback && this.paintCallback(a)
                    },
                    this.paintAlarmText = function(a) {
                        if (null != this.alarm && "" != this.alarm&&this.showAlarmText) {
                            var b = this.alarmColor
                                , c = this.alarmAlpha || .5;
                            a.beginPath(),
                                a.font = this.alarmFont || "10px 微软雅黑";
                            var d = a.measureText(this.alarm).width + 6
                                , e = a.measureText("田").width + 6
                                , f = this.width / 2 - d / 2
                                , g = -this.height / 2 - e - 8;
                            a.strokeStyle = "rgba(" + b + ", " + c + ")",
                                //   a.fillStyle = "rgba(" + b + ", " + c + ")",
                                a.fillStyle = "rgba(255,255,255,0.5)",//背景颜色
                                a.lineCap = "round",
                                a.lineWidth = 1,
                                a.moveTo(f, g),
                                a.lineTo(f + d, g),
                                a.lineTo(f + d, g + e),
                                a.lineTo(f + d / 2 + 6, g + e),
                                a.lineTo(f + d / 2, g + e + 8),
                                a.lineTo(f + d / 2 - 6, g + e),
                                a.lineTo(f, g + e),
                                a.lineTo(f, g),
                                a.fill(),
                                a.stroke(),
                                a.closePath(),
                                a.beginPath(),
                                a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                                a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",//告警文字颜色
                                a.fillText(this.alarm, f + 16.5, g + e - 4),
                                a.closePath()
                        }
                    },
                    //luozheao20170616
                    this.paintAlarmImage=function (a) {
                        //this.smallAlarmImageTag  是否开启告警图片变色
                        //this.smallAlarmImage  告警图片名称
                        //smallAlarmImage_w,smallAlarmImage_h   你猜这是什么
                        //this.smallAlarmImageObj 为告警图片对象
                        //this.smallAlarmImageChangeObj 为告警变色图片对象
                        if (null != this.smallAlarmImageObj && "" != this.smallAlarmImageObj) {
                            var b = a.globalAlpha;

                            a.globalAlpha = this.alpha,
                                this.smallAlarmImageChangeObj&&this.smallAlarmImageTag
                                    ?
                                    a.drawImage(this.smallAlarmImageChangeObj, this.smallAlarmImage_x!==null?this.smallAlarmImage_x:-10-this.width / 2, this.smallAlarmImage_y!==null?this.smallAlarmImage_y:-this.height / 2, this.smallAlarmImage_w, this.smallAlarmImage_h)
                                    :
                                    a.drawImage(this.smallAlarmImageObj , this.smallAlarmImage_x!==null?this.smallAlarmImage_x:-10-this.width / 2, this.smallAlarmImage_y!==null?this.smallAlarmImage_y:-this.height / 2, this.smallAlarmImage_w, this.smallAlarmImage_h),
                                a.globalAlpha = b
                        }
                    },
                    this.paintText = function(a) {
                        var b = this.text;
                        if (null != b && "" != b) {
                            a.beginPath(),
                                a.font = this.font;
                            var c = a.measureText(b).width
                                , d = a.measureText("田").width;
                            a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
                            var e = this.getTextPostion(this.textPosition, c, d);

                            draw_long_text(b,a, e.x, e.y,this,d),
                                a.closePath();
                            //处理节点文字的换行问题
                            function draw_long_text(longtext,cxt,nBegin_width,nBegin_height,obj,textHeight)
                            {
                                var lineHeight= obj.textLineHeight;
                                if(obj.nodeFn=='alarm'){
                                    //告警类型节点，改变字体颜色
                                    var arr=longtext.split(/\d+/);
                                    var strArr=longtext.match(/\d+/);
                                    var begin_width=nBegin_width;
                                    //第一段
                                    var len1= cxt.measureText(arr[0]).width;
                                    var startP1=begin_width;
                                    cxt.fillText(arr[0],startP1,nBegin_height);
                                    //第二段
                                    var len2= cxt.measureText(strArr[0]).width;
                                    var startP2=startP1+len1;
                                    if(parseInt(strArr[0])==0){
                                        cxt.fillStyle='rgba(149,193,90,1)';
                                    }else{
                                        cxt.fillStyle='rgba(249,2,2,1)';
                                    }
                                    cxt.fillText(strArr[0],startP2,nBegin_height);
                                    //第三段
                                    var len3= cxt.measureText(arr[2]).width;
                                    var startP3=startP2+len2;
                                    cxt.fillStyle='rgba(43,43,43,1)';
                                    cxt.fillText(arr[1],startP3,nBegin_height);

                                }
                                else if(longtext.indexOf('$')>0){
                                    var text = "";
                                    var count = 0;
                                    var begin_width;//基准位，默认为节点中心点的x坐标
                                    var begin_height = nBegin_height;
                                    var lineHeight=lineHeight||12;
                                    var stringLenght = longtext.length;

                                    var newtext = longtext.split("");
                                    var context = cxt;
                                    context.textAlign = obj.textAlign;
                                    switch(obj.textAlign){
                                        case "center":
                                            begin_width=0;
                                            break;
                                        case "left":
                                            begin_width=nBegin_width+7;
                                            var cn=(longtext.split('$')).length;//行数
                                            var csh=cn*lineHeight-textHeight; //总高度
                                            begin_height=nBegin_height-csh/2;
                                            break;
                                        default:
                                            console.log('少年，等待你来拓展'+obj.textAlign+'这个功能');
                                    }



                                    for( var i = 0; i <= stringLenght ; i++)
                                    {

                                        if(newtext[0] == '$')
                                        {
                                            context.fillText(text,begin_width,begin_height);
                                            begin_height = begin_height + lineHeight;
                                            text = "";
                                            newtext.shift();
                                        }
                                        if(i == stringLenght)
                                        {
                                            context.fillText(text,begin_width,begin_height);
                                        }
                                        if(newtext[0]!=undefined){
                                            text = text + newtext[0];
                                        }

                                        count ++;
                                        newtext.shift();
                                    }
                                }
                                else{
                                    cxt.fillText(longtext, nBegin_width, nBegin_height);
                                }
                            }
                        }
                    },
                    this.paintBorder = function(a) {
                        if (0 != this.borderWidth) {
                            a.beginPath(),
                                a.lineWidth = this.borderWidth,
                                a.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                            var b = this.borderWidth / 2;
                            null == this.borderRadius || 0 == this.borderRadius ? a.rect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
                                a.stroke(),
                                a.closePath()
                        }
                    },
                    this.getTextPostion = function(a, b, c) {
                        var d = null;
                        return null == a || "Bottom_Center" == a ? d = {
                            x: -this.width / 2 + (this.width - b) / 2,
                            y: this.height / 2 + c
                        } :"Bottom_Top" == a ? d = {
                            x: -this.width / 2 + (this.width - b) / 2,
                            // y: this.height / 2 + c
                            y:  c
                        } : "Top_Center" == a ? d = {
                            x: -this.width / 2 + (this.width - b) / 2,
                            y: -this.height / 2 - c / 2
                        } : "Top_Right" == a ? d = {
                            x: this.width / 2,
                            y: -this.height / 2 - c / 2
                        } : "Top_Left" == a ? d = {
                            x: -this.width / 2 - b,
                            y: -this.height / 2 - c / 2
                        } : "Bottom_Right" == a ? d = {
                            x: this.width / 2,
                            y: this.height / 2 + c
                        } : "Bottom_Left" == a ? d = {
                            x: -this.width / 2 - b,
                            y: this.height / 2 + c
                        } : "Middle_Center" == a ? d = {
                            x: -this.width / 2 + (this.width - b) / 2,
                            y: c / 2
                        } : "Middle_Right" == a ? d = {
                            x: this.width / 2,
                            y: c / 2
                        } : "Middle_Left" == a && (d = {
                                x: -this.width / 2 - b,
                                y: c / 2
                            }),
                        null != this.textOffsetX && (d.x += this.textOffsetX),
                        null != this.textOffsetY && (d.y += this.textOffsetY),
                            d
                    },
                    this.setImage = function(b, c) {

                        if (null == b)
                            throw new Error("Node.setImage(): 参数Image对象为空!");
                        var d = this;
                        if (b=='changeColor') {

                            d.image&&(d.image.alarm=a.util.getImageAlarm(d.image,null,d.fillAlarmNode,d.fillAlarmForChangeColor));
                        }
                        else if(b=='changeSmallImageColor'){

                            d.smallAlarmImageObj&&(d.smallAlarmImageChangeObj=a.util.getImageAlarm(d.smallAlarmImageObj,null,d.smallImageChangeColor,d.smallImageOriginColor));
                        }
                        else if("string" == typeof b && c=='setSmallImage'){
                            var e=null;
                            e = new Image,
                                e.src = b,
                                e.onload = function() {

                                    var f= a.util.getImageAlarm(e,null,d.smallImageChangeColor,d.smallImageOriginColor);
                                    d.smallAlarmImageChangeObj=f;
                                    d.smallAlarmImageObj = e;
                                }
                        }
                        else if(c=='imageDataFlow'){
                            var e=null;

                            e = new Image,
                                e.src = JTopo.flag.topoImgMap[b],
                                e.onload = function() {
                                    var f= a.util.getImageAlarm(e,null,d.fillAlarmNode,d.fillAlarmForChangeColor);
                                    f&&(e.alarm=f);
                                    d.image = e;
                                }
                        }
                        else if("string" == typeof b){
                            //var e = j[b];//不能用缓存，j为作用域较大，每次切换都不会清空
                            var e=null;
                            null == e ? (e = new Image,
                                    e.src = b,
                                    e.onload = function() {
                                        j[b] = e,
                                        1 == c && d.setSize(e.width, e.height);
                                        var f = a.util.getImageAlarm(e,null,d.fillAlarmNode,d.fillAlarmForChangeColor);//告警色,指定色

                                        f && (e.alarm = f),
                                            d.image = e
                                    }
                            ) : (c && this.setSize(e.width, e.height),
                                this.image = e)
                        }
                        else{
                            this.image = b,
                            1 == c && this.setSize(b.width, b.height)
                        }
                    },
                    this.removeHandler = function(a) {

                        var b = this;
                        this.outLinks && (this.outLinks.forEach(function(c) {
                            c.nodeA === b && a.remove(c)
                        }),
                            this.outLinks = null),
                        this.inLinks && (this.inLinks.forEach(function(c) {
                            c.nodeZ === b && a.remove(c)
                        }),
                            this.inLinks = null);

                        //对父级容器处理
                        var pc=this.parentContainer;
                        if(pc&&pc.length>0){
                             for(var i=0;i<pc.length;i++){
                                 var pcObj=pc[i];
                                 pcObj.remove(b);
                                 if(pcObj.childs.length==0){
                                     JTopo.flag.curScene.remove(pcObj);
                                 }
                             }
                        }
                    }
            }
            function c() {
                c.prototype.initialize.apply(this, arguments)
            }
            function d(a) {
                    this.initialize(),
                    this.text = a,
                    this.elementType = "TextNode",
                    //textnode放到容器中，容器再外加一个容器，移动容器，textnode不能触发位移
                    this.paint = function(a) {
                            a.beginPath(),
                            a.font = this.font,
                            this.width = a.measureText(this.text).width,
                            this.height = a.measureText("田").width,
                            a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                            a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                            a.fillText(this.text, -this.width / 2, this.height / 2),

                            a.closePath(),
                            this.paintBorder(a),
                            this.paintCtrl(a),
                            this.paintAlarmText(a)
                    }
            }
            function e(a, b, c) {
                this.initialize(),
                    this.text = a,
                    this.href = b,
                    this.target = c,
                    this.elementType = "LinkNode",
                    this.isVisited = !1,
                    this.isStopLinkNodeClick = false,
                    this.visitedColor = null,
                    this.paint = function (a) {
                        a.beginPath(),
                            a.font = this.font,
                            this.width = a.measureText(this.text).width,
                            this.height = a.measureText("田").width,
                            this.isVisited && null != this.visitedColor ? (a.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")",
                                a.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")") : (a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                                a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")");
                            draw_long_text(this.text,a,-this.width / 2,this.height / 2,this);
                            // a.fillText(this.text, -this.width / 2, this.height / 2);
                            this.isMouseOver && (a.moveTo(-this.width / 2, this.height),
                            a.lineTo(this.width / 2, this.height),
                            a.stroke()),
                            a.closePath(),
                            this.paintBorder(a),
                            this.paintCtrl(a),
                            this.paintAlarmText(a);
                            function draw_long_text(longtext,cxt,nBegin_width,nBegin_height,obj)
                            {
                            //文字内容,画布对象,坐标x,坐标y,结点对象
                            var lineHeight= obj.textLineHeight;
                            if(obj.nodeFn=='alarm'){
                                //告警类型节点，改变字体颜色
                                var arr=longtext.split(/\d+/);
                                var strArr=longtext.match(/\d+/);
                                var begin_width=nBegin_width;
                                //第一段
                                var len1= cxt.measureText(arr[0]).width;
                                var startP1=begin_width;
                                cxt.fillText(arr[0],startP1,nBegin_height);
                                //第二段
                                var len2= cxt.measureText(strArr[0]).width;
                                var startP2=startP1+len1;
                                if(parseInt(strArr[0])==0){
                                    cxt.fillStyle='rgba(149,193,90,1)';
                                }else{
                                    cxt.fillStyle='rgba(249,2,2,1)';
                                }
                                cxt.fillText(strArr[0],startP2,nBegin_height);
                                //第三段
                                var len3= cxt.measureText(arr[2]).width;
                                var startP3=startP2+len2;
                                cxt.fillStyle='rgba(43,43,43,1)';
                                cxt.fillText(arr[1],startP3,nBegin_height);

                            }
                        }
                    },
                    this.mousemove(function () {
                        var a = document.getElementsByTagName("canvas");
                        if (a && a.length > 0)
                            for (var b = 0; b < a.length; b++)
                                a[b].style.cursor = "pointer"
                    }),
                    this.mouseout(function () {
                        var a = document.getElementsByTagName("canvas");
                        if (a && a.length > 0)
                            for (var b = 0; b < a.length; b++)
                                a[b].style.cursor = "default"
                    }),
                    this.click(function () {
                        if (!this.isStopLinkNodeClick) {
                            "_blank" == this.target ? window.open(this.href) : location = this.href,
                                this.isVisited = !0
                        }
                    })
            }
            function f(a) {
                this.initialize(arguments),
                    this._radius = 20,
                    this.beginDegree = 0,
                    this.endDegree = 2 * Math.PI,
                    this.text = a,
                    this.paint = function(a) {
                        a.save(),
                            a.beginPath(),
                            a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                            a.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0),
                            a.fill(),
                            a.closePath(),
                            a.restore(),
                            this.paintText(a),
                            this.paintBorder(a),
                            this.paintCtrl(a),
                            this.paintAlarmText(a)
                    },
                    this.paintSelected = function(a) {
                            a.save(),
                            a.beginPath(),
                            a.strokeStyle = "rgba(168,202,255, 0.9)",
                            a.fillStyle = "rgba(168,202,236,0.7)",
                            a.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0),
                            a.fill(),
                            a.stroke(),
                            a.closePath(),
                            a.restore()
                    }
            }
            function g(a, b, c) {
                this.initialize(),
                    this.frameImages = a || [],
                    this.frameIndex = 0,
                    this.isStop = !0;
                var d = b || 1e3;
                this.repeatPlay = !1;
                var e = this;
                this.nextFrame = function() {
                    if (!this.isStop && null != this.frameImages.length) {
                        if (this.frameIndex++,
                            this.frameIndex >= this.frameImages.length) {
                            if (!this.repeatPlay)
                                return;
                            this.frameIndex = 0
                        }
                        this.setImage(this.frameImages[this.frameIndex], c),
                            setTimeout(function() {
                                e.nextFrame()
                            }, d / a.length)
                    }
                }
            }
            function h(a, b, c, d, e) {
                this.initialize();
                var f = this;
                this.setImage(a),
                    this.frameIndex = 0,
                    this.isPause = !0,
                    this.repeatPlay = !1;
                var g = d || 1e3;
                e = e || 0,
                    this.paint = function(a) {
                        if (this.image) {
                            var b = this.width
                                , d = this.height;
                            a.save(),
                                a.beginPath(),
                                a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
                            var f = (Math.floor(this.frameIndex / c) + e) * d
                                , g = Math.floor(this.frameIndex % c) * b;
                            a.drawImage(this.image, g, f, b, d, -b / 2, -d / 2, b, d),
                                a.fill(),
                                a.closePath(),
                                a.restore(),
                                this.paintText(a),
                                this.paintBorder(a),
                                this.paintCtrl(a),
                                this.paintAlarmText(a)
                        }
                    },
                    this.nextFrame = function() {
                        if (!this.isStop) {
                            if (this.frameIndex++,
                                this.frameIndex >= b * c) {
                                if (!this.repeatPlay)
                                    return;
                                this.frameIndex = 0
                            }
                            setTimeout(function() {
                                f.isStop || f.nextFrame()
                            }, g / (b * c))
                        }
                    }
            }
            function i() {
                var a = null;
                return a = arguments.length <= 3 ? new g(arguments[0],arguments[1],arguments[2]) : new h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]),
                    a.stop = function() {
                        a.isStop = !0
                    },
                    a.play = function() {
                        a.isStop = !1,
                            a.frameIndex = 0,
                            a.nextFrame()
                    },
                    a
            }
            var j = {};
            b.prototype = new a.EditableElement,
                c.prototype = new b,
                d.prototype = new c,
                e.prototype = new d,
                f.prototype = new c,
                Object.defineProperties(f.prototype, {
                    radius: {
                        get: function() {
                            return this._radius
                        },
                        set: function(a) {
                            this._radius = a;
                            var b = 2 * this.radius
                                , c = 2 * this.radius;
                            this.width = b,
                                this.height = c
                        }
                    },
                    width: {
                        get: function() {
                            return this._width
                        },
                        set: function(a) {
                            this._radius = a / 2,
                                this._width = a
                        }
                    },
                    height: {
                        get: function() {
                            return this._height
                        },
                        set: function(a) {
                            this._radius = a / 2,
                                this._height = a
                        }
                    }
                }),
                g.prototype = new c,
                h.prototype = new c,
                i.prototype = new c,
                a.Node = c,
                a.TextNode = d,
                a.LinkNode = e,
                a.CircleNode = f,
                a.AnimateNode = i
        }(JTopo),
        //link的具体实现
        function(a) {
            function b(a, b) {
                var c = [];
                if (null == a || null == b)
                    return c;
                if (a && b && a.outLinks && b.inLinks)
                    for (var d = 0; d < a.outLinks.length; d++)
                        for (var e = a.outLinks[d], f = 0; f < b.inLinks.length; f++) {
                            var g = b.inLinks[f];
                            e === g && c.push(g)
                        }
                return c
            }
            function c(a, c) {
                var d = b(a, c), e = b(c, a), f = d.concat(e);
                return f
            }
            function d(a) {
                var b = c(a.nodeA, a.nodeZ);
                return b = b.filter(function(b) {
                    return a !== b
                })
            }
            function e(a, b) {
                return c(a, b).length
            }
            function f(b, c, g) {
                    function h(b, c) {
                        var d = a.util.lineF(b.cx, b.cy, c.cx, c.cy)
                        , e = b.getBound()
                        , f = a.util.intersectionLineBound(d, e);
                        return f
                    }
                    this.initialize = function (b, c, d) {
                    if (f.prototype.initialize.apply(this, arguments),
                            this.elementType = "link",
                            this.zIndex = a.zIndex_Link,
                        0 != arguments.length) {
                        this.text = d,
                            this.nodeA = b,
                            this.nodeZ = c,
                        this.nodeA && null == this.nodeA.outLinks && (this.nodeA.outLinks = []),
                        this.nodeA && null == this.nodeA.inLinks && (this.nodeA.inLinks = []),
                        this.nodeZ && null == this.nodeZ.inLinks && (this.nodeZ.inLinks = []),
                        this.nodeZ && null == this.nodeZ.outLinks && (this.nodeZ.outLinks = []),
                        null != this.nodeA && this.nodeA.outLinks.push(this),
                        null != this.nodeZ && this.nodeZ.inLinks.push(this),
                            this.caculateIndex(),
                            this.font = "12px Consolas",
                            this.fontColor = "43,43,43",
                            this.isShowLinkName = true,
                            this.lineWidth = 2,
                            this.lineJoin = "miter",
                            this.transformAble = !1,
                            this.bundleOffset = 20,
                            this.bundleGap = 12,
                            this.textOffsetX = 0,
                            this.textOffsetY = 0,
                            this.arrowsRadius = null,
                            this.arrowsOffset = 0,
                            this.dashedPattern = null,
                            this.path = [];
                            this.animateNodePath=null;
                        this.linkType = null;//线条类型
                        this.animateNode = null;//线条上的动画节点

                        this.linkConnectType = 'toBorder';//连接类型，null为连接到中心点，toBorder为连接到边缘
                        this.mergeOutLink = false;//合并出线条,多条线条从节点出去,合并成一根线条
                        this.flexionalRadius = null;//二次折线的弧度半径
                        this.openStartRadius = true;
                        this.openEndRadius = true;
                        var e = "text,font,fontColor,lineWidth,lineJoin".split(",");
                        this.serializedProperties = this.serializedProperties.concat(e)
                    }
                },
                    this.caculateIndex = function () {
                        var a = e(this.nodeA, this.nodeZ);
                        a > 0 && (this.nodeIndex = a - 1)
                    },
                    this.initialize(b, c, g),
                    this.removeHandler = function () {
                        var a = this;
                        this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function (b) {
                            return b !== a
                        })),
                        this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (b) {
                            return b !== a
                        }));
                        var b = d(this);
                        b.forEach(function (a, b) {
                            a.nodeIndex = b
                        })
                    },
                    this.getStartPosition = function (linksSum,subY,angle) {
                        var a = {};
                        var pi=Math.PI;
                        switch (this.linkConnectType) {
                            case 'toBorder':
                                //链接边框
                                a = h(this.nodeA, this.nodeZ),
                                null == a && (a = {
                                    x: this.nodeA.cx,
                                    y: this.nodeA.cy
                                });
                                break;
                            default:
                                a = {
                                    x: this.nodeA.cx,
                                    y: this.nodeA.cy
                                };
                        };

                        //根据倾斜角,设置a.x和a.y
                        if(angle<pi*30/180){
                            a.y+=(this.nodeIndex-(linksSum-1)/2)*subY;
                        }else{
                            a.x+=(this.nodeIndex-(linksSum-1)/2)*this.bundleGap;
                        }
                        //到达一定角度
                        return a
                    },
                    this.getEndPosition = function (linksSum,subY,angle) {
                        var a;
                        var pi=Math.PI;
                        switch (this.linkConnectType) {
                            case 'toBorder':
                                a = h(this.nodeZ, this.nodeA),
                                null == a && (a = {
                                    x: this.nodeZ.cx,
                                    y: this.nodeZ.cy
                                })
                                break;
                            default:
                                null != this.arrowsRadius && (a = h(this.nodeZ, this.nodeA)),
                                null == a && (a = {
                                    x: this.nodeZ.cx,
                                    y: this.nodeZ.cy
                                });
                        }
                        if(angle<pi*30/180){
                            a.y+=(this.nodeIndex-(linksSum-1)/2)*subY;
                        }else{
                            a.x+=(this.nodeIndex-(linksSum-1)/2)*this.bundleGap;
                        }


                        return a
                    },
                    this.getPath = function () {
                        var d = e(this.nodeA, this.nodeZ);//d是连线数量
                        var angle=Math.atan2(Math.abs(this.nodeZ.cy - this.nodeA.cy), Math.abs(this.nodeZ.cx - this.nodeA.cx));
                        var subY=this.bundleGap/Math.cos(angle);
                        var a = []
                            , b = this.getStartPosition(d,subY,angle)
                            , c = this.getEndPosition(d,subY,angle);
                        if (this.nodeA === this.nodeZ)
                            return [b, c];

                        if (1 == d)
                            return [b, c];
                           var f = Math.atan2(c.y - b.y, c.x - b.x)
                            , g = {
                            x: b.x + this.bundleOffset * Math.cos(f),
                            y: b.y + this.bundleOffset * Math.sin(f)
                            }
                            , h = {
                            x: c.x + this.bundleOffset * Math.cos(f - Math.PI),
                            y: c.y + this.bundleOffset * Math.sin(f - Math.PI)
                            }
                            , i = f - Math.PI / 2
                            , j = f - Math.PI / 2
                            , k = d * this.bundleGap / 2 - this.bundleGap / 2
                            , l = this.bundleGap * this.nodeIndex  // nodeIndex线条序号
                            , m = {
                            x: g.x + l * Math.cos(i),
                            y: g.y + l * Math.sin(i)
                        }
                            , n = {
                            x: h.x + l * Math.cos(j),
                            y: h.y + l * Math.sin(j)
                        };

                        return m = {
                            x: m.x + k * Math.cos(i - Math.PI),
                            y: m.y + k * Math.sin(i - Math.PI)
                            },
                            n = {
                                x: n.x + k * Math.cos(j - Math.PI),
                                y: n.y + k * Math.sin(j - Math.PI)
                            },
                            a.push({
                                x: b.x,
                                y: b.y
                            }),
                            // a.push({
                            //     x: m.x,
                            //     y: m.y
                            // }),
                            // a.push({
                            //     x: n.x,
                            //     y: n.y
                            // }),
                            a.push({
                                x: c.x,
                                y: c.y
                            }),
                            a
                    },
                    this.paintPath = function (a, b) {
                        switch (this.linkType) {
                            case 'flexional':
                                if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
                                a.beginPath(), a.moveTo(b[0].x, b[0].y);
                                if(this.flexionalRadius!=null){
                                      var b0=b[0];
                                      var b1=b[1];
                                      var b2=b[2];
                                      var b3=b[3];

                                    if(this.openStartRadius&&this.openEndRadius){
                                        a.lineTo((b1.x+b0.x)/2, (b1.y+b0.y)/2);
                                        a.arcTo(b1.x,b1.y,(b1.x+b2.x)/2, (b1.y+b2.y)/2,this.flexionalRadius);
                                        a.lineTo((b1.x+b2.x)/2, (b1.y+b2.y)/2);
                                        a.arcTo(b2.x,b2.y,(b3.x+b2.x)/2, (b3.y+b2.y)/2,this.flexionalRadius);
                                        a.lineTo(b3.x,b3.y);
                                    }else if(this.openStartRadius&&!this.openEndRadius){
                                        a.lineTo((b1.x+b0.x)/2, (b1.y+b0.y)/2);
                                        a.arcTo(b1.x,b1.y,(b1.x+b2.x)/2, (b1.y+b2.y)/2,this.flexionalRadius);
                                        a.lineTo((b1.x+b2.x)/2, (b1.y+b2.y)/2);
                                        a.lineTo(b2.x,b2.y);
                                        a.lineTo(b3.x,b3.y);
                                    }else if(!this.openStartRadius&&this.openEndRadius){
                                        a.lineTo(b1.x,b1.y);
                                        a.lineTo((b1.x+b2.x)/2, (b1.y+b2.y)/2);
                                        a.arcTo(b2.x,b2.y,(b3.x+b2.x)/2, (b3.y+b2.y)/2,this.flexionalRadius);
                                        a.lineTo(b3.x,b3.y);
                                    }else{
                                        for (var c = 1; c < b.length; c++) {
                                            null == this.dashedPattern ?
                                                a.lineTo(b[c].x, b[c].y)
                                                :
                                                a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern);
                                        }
                                    }
                                }else {
                                    for (var c = 1; c < b.length; c++) {
                                        null == this.dashedPattern ?
                                            a.lineTo(b[c].x, b[c].y)
                                            :
                                            a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern);
                                    }
                                }
                               if (a.stroke(),
                                        a.closePath(),
                                    null != this.arrowsRadius) {
                                    var d = b[b.length - 2]
                                        , e = b[b.length - 1];
                                    this.paintArrow(a, d, e)
                                };
                                break;
                            case 'dArrow':
                                if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
                                a.beginPath(), a.moveTo(b[0].x, b[0].y);
                                for (var c = 1; c < b.length; c++) {

                                    null == this.dashedPattern ? (
                                        (null == this.PointPathColor ? a.lineTo(b[c].x, b[c].y) : a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor))
                                    ) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
                                }
                                ;
                                if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                                    var d = b[b.length - 2],
                                        e = b[b.length - 1];
                                    this.paintArrow(a, d, e);
                                    this.paintArrow(a, e, d);//双箭头精髓
                                }
                                break;

                            case 'flow':

                                if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
                                a.beginPath(), a.moveTo(b[0].x, b[0].y);
                                for (var c = 1; c < b.length; c++) {
                                    null == this.dashedPattern ?
                                        ((null == this.PointPathColor ?
                                            a.lineTo(b[c].x, b[c].y)
                                            :
                                            a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor)))
                                        :
                                        a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
                                }
                                if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                                    var d = b[b.length - 2],
                                        e = b[b.length - 1];
                                    this.paintArrow(a, d, e)
                                }
                                break;
                            default:
                                if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
                                a.beginPath(), a.moveTo(b[0].x, b[0].y);
                                for (var c = 1; c < b.length; c++)
                                    null == this.dashedPattern ? a.lineTo(b[c].x, b[c].y) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern);
                                if (a.stroke(),
                                        a.closePath(),
                                    null != this.arrowsRadius) {
                                    var d = b[b.length - 2]
                                        , e = b[b.length - 1];
                                    this.paintArrow(a, d, e)
                                };
                        }
                    },
                    this.paintLoop = function (a) {
                        a.beginPath();
                        {
                            var b = this.bundleGap * (this.nodeIndex + 1) / 2;
                            Math.PI + Math.PI / 2
                        }
                        a.arc(this.nodeA.x, this.nodeA.y, b, Math.PI / 2, 2 * Math.PI),
                            a.stroke(),
                            a.closePath()
                    },
                    this.paintArrow = function (b, c, d) {
                        var e = this.arrowsOffset
                            , f = this.arrowsRadius / 2
                            , g = c
                            , h = d
                            , i = Math.atan2(h.y - g.y, h.x - g.x)
                            , j = a.util.getDistance(g, h) - this.arrowsRadius
                            , k = g.x + (j + e) * Math.cos(i)
                            , l = g.y + (j + e) * Math.sin(i)
                            , m = h.x + e * Math.cos(i)
                            , n = h.y + e * Math.sin(i);
                        i -= Math.PI / 2;
                        var o = {
                            x: k + f * Math.cos(i),
                            y: l + f * Math.sin(i)
                        }
                            , p = {
                            x: k + f * Math.cos(i - Math.PI),
                            y: l + f * Math.sin(i - Math.PI)
                        };
                        b.beginPath(),
                            b.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
                            b.moveTo(o.x, o.y),
                            b.lineTo(m, n),
                            b.lineTo(p.x, p.y),
                            b.stroke(),
                            b.closePath()
                    },
                    this.paint = function (a) {
                        if (null != this.nodeA && null != !this.nodeZ) {
                            var b = this.getPath(this.nodeIndex);
                            this.path = b,
                                a.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
                                a.lineWidth = this.lineWidth,
                                this.paintPath(a, b),
                            b && b.length > 0 && this.paintText(a, b)
                        }
                    };
                    var i = -(Math.PI / 2 + Math.PI / 4);
                    this.paintText = function (a, b) {
                    var c = b[0]
                        , d = b[b.length - 1];
                    if (!this.isShowLinkName) {
                        return;
                    }

                    if (4 == b.length && (c = b[1],
                            d = b[2]),
                        this.text && this.text.length > 0) {

                        if(JTopo.flag.linkConfigure.textIsNearToNodeZ){
                            var e = (d.x + c.x) / 2
                                , f = (d.y + c.y) / 2;
                            e = (d.x + e) / 2+this.textOffsetX
                                , f = (d.y + f) / 2+ this.textOffsetY;
                        }else{
                            var e = (d.x + c.x) / 2 + this.textOffsetX
                                , f = (d.y + c.y) / 2 + this.textOffsetY;
                        }
                        a.save(),
                            a.beginPath(),
                            a.font = this.font;

                        var g = a.measureText(this.text).width
                            , h = a.measureText("田").width;

                        if (a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                            this.nodeA === this.nodeZ) {
                            var j = this.bundleGap * (this.nodeIndex + 1) / 2
                                , e = this.nodeA.x + j * Math.cos(i)
                                , f = this.nodeA.y + j * Math.sin(i);
                            a.fillText(this.text, e, f)
                        } else {
                            var kh=h/2;
                            if (JTopo.flag.linkConfigure.textIsTilt) {
                                //todo:倾斜算法还有点问题
                                a.translate(e-g/2  , f-h/2 );
                                var rotate=JTopo.util.getRotateAng(this.nodeA,this.nodeZ);
                                a.rotate(rotate);
                                a.translate(-(e - g / 2), -(f-h/2));

                                var xkh=g/2;
                                var r=Math.abs(180*rotate/Math.PI);
                                if(r>20){
                                    kh=rotate>0?5:-5;
                                }
                                if(r>40){
                                    kh=rotate>0?15:-15;
                                }
                                if(r>60){
                                    kh=rotate>0?20:-20;
                                }
                                if(r>80){
                                    kh=rotate>0?25:-25;
                                    //  xkh=rotate>0&&g;
                                }

                                a.fillText(this.text, e - xkh, f-kh);

                            }else {
                                a.fillText(this.text, e - g / 2, f-kh);
                            }



                        }
                        a.stroke(),
                            a.closePath(),
                            a.restore()
                    }
                },
                    this.paintSelected = function (a) {
                        a.shadowBlur = 10,
                            a.shadowColor = "rgba(0,0,0,1)",
                            a.shadowOffsetX = 0,
                            a.shadowOffsetY = 0
                    },
                    this.isInBound = function (b, c) {
                        if (this.nodeA === this.nodeZ) {
                            var d = this.bundleGap * (this.nodeIndex + 1) / 2
                                , e = a.util.getDistance(this.nodeA, {
                                    x: b,
                                    y: c
                                }) - d;
                            return Math.abs(e) <= 3
                        }
                        for (var f = !1, g = 1; g < this.path.length; g++) {
                            var h = this.path[g - 1]
                                , i = this.path[g];
                            if (1 == a.util.isPointInLine({
                                    x: b,
                                    y: c
                                }, h, i)) {
                                f = !0;
                                break
                            }
                        }
                        return f
                    }
            }
            function g(a, b, c) {
                this.initialize = function() {
                    g.prototype.initialize.apply(this, arguments),
                        this.direction = "horizontal"
                },
                    this.initialize(a, b, c),
                    this.getStartPosition = function() {
                        var a = {
                            x: this.nodeA.cx,
                            y: this.nodeA.cy
                        };
                        return "horizontal" == this.direction ? this.nodeZ.cx > a.x ? a.x += this.nodeA.width / 2 : a.x -= this.nodeA.width / 2 : this.nodeZ.cy > a.y ? a.y += this.nodeA.height / 2 : a.y -= this.nodeA.height / 2,
                            a
                    },
                    this.getEndPosition = function() {
                        var a = {
                            x: this.nodeZ.cx,
                            y: this.nodeZ.cy
                        };
                        return "horizontal" == this.direction ?
                            this.nodeA.cy < a.y ? a.y -= this.nodeZ.height / 2 : a.y += this.nodeZ.height / 2
                            :
                            a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width,a
                    },
                    this.getPath = function(a) {
                        var b = []
                            , c = this.getStartPosition()
                            , d = this.getEndPosition();
                        if (this.nodeA === this.nodeZ)
                            return [c, d];
                        var f, g, h = e(this.nodeA, this.nodeZ), i = (h - 1) * this.bundleGap, j = this.bundleGap * a - i / 2;
                        return "horizontal" == this.direction ? (f = d.x + j,
                            g = c.y - j,
                            b.push({
                                x: c.x,
                                y: g
                            }),
                            b.push({
                                x: f,
                                y: g
                            }),
                            b.push({
                                x: f,
                                y: d.y
                            })) : (f = c.x + j,
                            g = d.y - j,
                            b.push({
                                x: f,
                                y: c.y
                            }),
                            b.push({
                                x: f,
                                y: g
                            }),
                            b.push({
                                x: d.x,
                                y: g
                            })),
                            b
                    },
                    this.paintText = function(a, b) {
                        if (this.text && this.text.length > 0) {
                            var c = b[1]
                                , d = c.x + this.textOffsetX
                                , e = c.y + this.textOffsetY;
                            a.save(),
                                a.beginPath(),
                                a.font = this.font;
                            var f = a.measureText(this.text).width
                                , g = a.measureText("田").width;
                            a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                                a.fillText(this.text, d - f / 2, e - g / 2),
                                a.stroke(),
                                a.closePath(),
                                a.restore()
                        }
                    }
            }
            function h(a, b, c) {
                this.initialize = function() {
                    h.prototype.initialize.apply(this, arguments),
                        this.direction = "vertical",
                        this.offsetGap = 44
                },
                    this.initialize(a, b, c),
                    this.getStartPosition = function() {
                        var a = {
                            x: this.nodeA.cx,
                            y: this.nodeA.cy
                        };
                        return "horizontal" == this.direction ?
                            a.x = this.nodeZ.cx < a.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width
                            :
                            a.y = this.nodeZ.cy < a.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height
                            ,
                            a
                    },
                    this.getEndPosition = function() {
                        var a = {
                            x: this.nodeZ.cx,
                            y: this.nodeZ.cy
                        };
                        return "horizontal" == this.direction ? a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : a.y = this.nodeA.cy < a.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height,
                            a
                    },
                    this.getPath = function(a) {
                        var b = this.getStartPosition()
                            , c = this.getEndPosition();
                        if (this.nodeA === this.nodeZ)
                            return [b, c];
                        var d = [];
                        var f = e(this.nodeA, this.nodeZ);//连线个数
                        var g = (f - 1) * this.bundleGap;//所占宽度
                        var h = this.bundleGap * a - g / 2;//h具体分配坐标,a为线序号
                        var outH=h;//出线的相对坐标
                        this.mergeOutLink&&(outH=0);//如果合并,则出线的相对坐标为0
                        var i = this.offsetGap;
                        return "horizontal" == this.direction ? (this.nodeA.cx > this.nodeZ.cx && (i = -i),
                            d.push({
                                x: b.x,
                                y: b.y + outH
                            }),
                            d.push({
                                x: b.x + i,
                                y: b.y + outH
                            }),
                            d.push({
                                x: c.x - i,
                                y: c.y + h
                            }),
                            d.push({
                                x: c.x,
                                y: c.y + h
                            }))
                            :
                            (
                                this.nodeA.cy > this.nodeZ.cy && (i = -i),
                                d.push({
                                    x: b.x + outH,
                                    y: b.y
                                }),
                                d.push({
                                    x: b.x + outH,
                                    y: b.y + i
                                }),
                                d.push({
                                    x: c.x + h,
                                    y: c.y - i
                                }),
                                d.push({
                                    x: c.x + h,
                                    y: c.y
                                })),
                            d
                    }
            }
            function i(a, b, c) {
                this.initialize = function() {
                    i.prototype.initialize.apply(this, arguments)
                },
                    this.initialize(a, b, c),
                    this.paintPath = function(a, b) {
                        if (this.nodeA === this.nodeZ)
                            return void this.paintLoop(a);
                        a.beginPath(),
                            a.moveTo(b[0].x, b[0].y);
                        for (var c = 1; c < b.length; c++) {
                            var d = b[c - 1]
                                , e = b[c]
                                , f = (d.x + e.x) / 2
                                , g = (d.y + e.y) / 2;
                            g += (e.y - d.y) / 2,
                                a.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
                                a.lineWidth = this.lineWidth,
                                a.moveTo(d.x, d.cy),
                                a.quadraticCurveTo(f, g, e.x, e.y),
                                a.stroke()
                        }
                        if (a.stroke(),
                                a.closePath(),
                            null != this.arrowsRadius) {
                            var h = b[b.length - 2]
                                , i = b[b.length - 1];
                            this.paintArrow(a, h, i)
                        }
                    }
            }
            function jk(imgurl,scene,rate,speed,width,height,row,col,time,offsetRow){
                //rate计时器周期,speed距离
                var w=width||16;
                var h=height||16;
                var thislink=this;

                var imgnode = new JTopo.AnimateNode(imgurl, row, col, time, offsetRow);// 1行4列，1000毫秒播放一轮，行偏移量
                imgnode.setSize(w,h)
                imgnode.zIndex=2.5;
                imgnode.isNeedSave=false;
                imgnode.repeatPlay = true;

                imgnode.elementType='linkAnimateNode';
                imgnode.dragable=false;
                imgnode.selected=false;
                imgnode.paintMouseover=function () {

                };
                imgnode.addEventListener('mouseup',function(e){
                    imgnode.selected=false;
                });
                imgnode.play();
                imgnode.visible=true;

                if(thislink.animateNode){
                    clearInterval(thislink.animateT);
                    JTopo.flag.curScene.remove(thislink.animateNode);
                    delete thislink.animateNode;
                }

                thislink.animateNode=imgnode;

                var timeT=0;
                thislink.animateT=null;
                thislink.endAnimate = false;
                thislink.animateCallback=null;
                var currentPathIndex=0;
                var _rate=rate||200;
                var _speed=speed||10;
                this.isremove=false;

                function b(a, b) {
                    var c = [];
                    if (null == a || null == b) return c;
                    if (a && b && a.outLinks && b.inLinks) for (var d = 0; d < a.outLinks.length; d++) for (var e = a.outLinks[d], f = 0; f < b.inLinks.length; f++) {
                        var g = b.inLinks[f];
                        e === g && c.push(g)
                    }
                    return c
                }
                function c(a, c) {
                    var d = b(a, c),
                        e = b(c, a),
                        f = d.concat(e);
                    return f
                }
                function d(a) {
                    var b = c(a.nodeA, a.nodeZ);
                    return b = b.filter(function(b) {
                        return a !== b
                    })
                }
                thislink.removeHandler = function() {
                    this.isremove=true;
                    var a = this;
                    this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function(b) {
                        return b !== a
                    })),
                    this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function(b) {
                        return b !== a
                    }));
                    var b = d(this);
                    b.forEach(function(a, b) {
                        a.nodeIndex = b
                    })
                };

                function imgnodeanime(){
                    if(!thislink.isremove){
                        if(thislink.nodeA.outLinks){
                            if(thislink.animateNodePath&&thislink.animateNodePath.length>0){
                                thislink.path=thislink.animateNodePath;
                            }
                            var nodeA=thislink.path[currentPathIndex];
                            var nodeZ=thislink.path[currentPathIndex+1];
                            if(nodeZ.jump){
                                ++currentPathIndex;
                                imgnodeanime();
                                return;
                            }
                            var L;
                            var subX;
                            var subY;
                            var xl;
                            var yl;
                            var xs=nodeA.x- nodeZ.x,
                                xy=nodeA.y- nodeZ.y,
                                l = Math.floor(Math.sqrt(xs * xs + xy * xy));
                            ++timeT;

                            if(thislink.path.length==2){
                                L=l;
                                xl=xs/L;
                                yl=xy/L;
                                subX=0;
                                subY=0;
                            }
                            else{
                                if(currentPathIndex==0){
                                    //起点
                                    L=l;
                                    xl=xs/L;
                                    yl=xy/L;
                                    subX=0;
                                    subY=0;
                                }
                                else if(currentPathIndex==thislink.path.length-2){
                                    //末点
                                    L=l;
                                    xl=xs/L;
                                    yl=xy/L;
                                    subX=0;
                                    subY=0;
                                }
                                else{
                                    //中间
                                    L=l;
                                    xl=xs/L;
                                    yl=xy/L;
                                    subX=0;
                                    subY=0;
                                }
                            }
                            var lenX=timeT*xl*_speed;
                            var lenY=timeT*yl*_speed;
                            imgnode.rotate=(Math.atan(xy/xs))+(xs>0?Math.PI:0);//todo:算法有问题
                            imgnode.cx=nodeA.x-lenX-subX;
                            imgnode.cy=nodeA.y-lenY-subY;
                            if(L<=Math.floor(Math.sqrt(lenX * lenX + lenY * lenY))) {
                                timeT = 0;
                                ++currentPathIndex;
                                if (currentPathIndex == thislink.path.length - 1) {
                                    currentPathIndex = 0;
                                    thislink.endAnimate = false;
                                    thislink.endCallback&&thislink.endCallback();
                                }
                                imgnode.cx = thislink.path[currentPathIndex].x;
                                imgnode.cy = thislink.path[currentPathIndex].y;
                            }
                        }
                    }else{
                        clearInterval(thislink.animateT);
                        scene.remove(imgnode)
                    }
                }

                thislink.animateT=JTopo.util.setInterval(function () {
                        imgnodeanime();
                        if(JTopo.flag.clearAllAnimateT){
                            JTopo.util.clearInterval(thislink.animateT);
                        }
                },_rate);

                scene.add(imgnode);
                return imgnode;
            };
            f.prototype = new a.InteractiveElement,
                f.prototype.drawanimepic=jk;
            g.prototype = new f,
                h.prototype = new f,
                i.prototype = new f,
                a.Link = f,
                a.FoldLink = g,//1次折线
                a.FlexionalLink = h,//2次折线
                a.CurveLink = i //曲线
        }(JTopo),
        //container的具体实现 ,container不能使用layout布局,如果要用,需要自己实现
        function(d) {
            function c(a) {
                    this.initialize = function(b) {
                        c.prototype.initialize.apply(this, null),
                        this.elementType = "container",
                        this.zIndex = d.zIndex_Container,
                        this.width = 100,
                        this.containerPadding=0,
                        this.height = 100,
                        this.childs = [],
                        this.alpha = 0,
                        this.dragable = !0,
                        this.childDragble = !0,
                        this.visible = !0,
                        this.fillColor = "79,164,218",
                        this.borderBgFillColor=null,
                        this.borderBgAlpha=0.3,
                        this.borderTextBg="rgba(108,208,226,1)",
                        this.borderWidth = 1,
                        this.shadowBlur = 5,
                        this.shadowColor = "rgba(43,43,43,0.5)",
                        this.shadowOffsetX = 0,
                        this.shadowOffsetY = 0,
                        this.borderColor = "108,208,226",
                        this.borderRadius = 5,
                        this.borderDashed = false,
                        this.borderAlpha = 1,
                        this.font = "16px 微软雅黑",
                        this.fontColor = "255,255,255",
                        this.text = b,
                        this.textAlpha = 1,
                        this.textPosition = "Top_Bottom",
                        this.textOffsetX = 0,
                        this.textOffsetY = 11 ,
                        this.textPositionMsg = {
                            x: null,
                            y: null,
                            width: null,
                            height: null
                        };
                        this.layout = new d.layout.AutoBoundLayout,
                        this.borderPadding = 15
                },
                    this.initialize(a),
                    this.add = function(b) {
                        this.childs.push(b),
                        b.dragable = this.childDragble;
                        if(!b.parentContainer){b.parentContainer=[]};
                        b.parentContainer.push(this);
                    },
                    this.remove = function(f) {
                        for (var e = 0; e < this.childs.length; e++) {
                            if (this.childs[e] === f) {
                                f.parentContainer = null,
                                    this.childs = this.childs.del(e),
                                    f.lastParentContainer = this;
                                break;
                            }
                        }
                    }
                    ,
                    this.removeAll = function() {
                        this.childs = []
                    }
                    ,
                    this.setLocation = function(h, g) {
                        var l = h - this.x
                            , k = g - this.y;
                        this.x = h,
                            this.y = g;
                        for (var j = 0; j < this.childs.length; j++) {
                            var i = this.childs[j];
                            i.setLocation(i.x + l, i.y + k)
                        }
                    }
                    ,
                    this.doLayout = function(b) {
                        b && b(this, this.childs)
                    }
                    ,
                    this.paint = function (b) {
                        this.visible && (this.layout && this.layout(this, this.childs),
                            b.beginPath(),
                            b.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                            null == this.borderRadius || 0 == this.borderRadius ? b.rect(this.x, this.y, this.width, this.height) : b.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius),
                            b.fill(),
                            b.closePath(),
                            this.paintBorder(b)),
                            this.paintText(b);    //先绘制边框,再绘制文字

                            if(this.childs.length==0){
                                JTopo.flag.scene.remove(this);
                            }
                    },
                    this.paintBorder = function(a) {
                        if (0 != this.borderWidth) {
                            //获取容器内部所有的子元素
                            var textHeight = a.measureText("田").width;//所有一行文字的高度
                            var thisObj = this;
                                var compareObj = {
                                    left: null,
                                    right: null,
                                    top: null,
                                    bottom: null
                                };
                                thisObj.childs.forEach(function (p) {
                                    var textWidth = a.measureText(p.text || '').width;

                                    var pObj = p.getTextPostion(p.textPosition, textWidth, textHeight);//获取文字的相对位置
                                    //获取文字左下角的位置，注意不是左上角
                                    pObj.x += p.x + p.width / 2;
                                    pObj.y += p.y + p.height / 2;

                                    //获取文字+节点整体的边界
                                    if (p.width > textWidth) {
                                        pObj.x = p.x;
                                        textWidth = p.width;
                                    }

                                    if (compareObj.left === null || compareObj.left > pObj.x) {
                                        compareObj.left = pObj.x
                                    }
                                    ;
                                    if (compareObj.right === null || compareObj.right < pObj.x + textWidth) {
                                        compareObj.right = pObj.x + textWidth
                                    }
                                    ;
                                    if (compareObj.top === null || compareObj.top > pObj.y - textHeight) {
                                        compareObj.top = pObj.y - textHeight
                                    }
                                    ;
                                    if (compareObj.bottom === null || compareObj.bottom < pObj.y) {
                                        compareObj.bottom = pObj.y
                                    }
                                    ;
                                });
                                sugar(thisObj, compareObj);
                                function sugar(thisObj, compareObj) {
                                    var leftW = thisObj.x - compareObj.left;
                                    var rightW = thisObj.x + thisObj.width - compareObj.right;
                                    var topH = thisObj.y - compareObj.top;
                                    var bottomH = thisObj.y + textHeight - compareObj.bottom;
                                    if (leftW > 0) {
                                        thisObj.x = compareObj.left;
                                        thisObj.width += leftW;
                                    }
                                    if (rightW < 0) {
                                        thisObj.width = compareObj.right - thisObj.x;
                                    }
                                    if (topH > 0) {
                                        thisObj.y = compareObj.top;
                                        thisObj.height += topH;
                                    }
                                    if (bottomH < 0) {
                                        thisObj.height = compareObj.bottom - thisObj.y;
                                    }

                                    var len = thisObj.borderPadding;
                                    thisObj.x -= len * 2;
                                    thisObj.y -= len * 4;
                                    thisObj.width += len * 4;
                                    thisObj.height += len * 5;
                                    //跟title比较宽度
                                    var titleWidth = a.measureText(thisObj.text || '').width + 60;
                                    var subWidth = titleWidth - thisObj.width;
                                    if (subWidth > 0) {
                                        thisObj.x -= subWidth / 2 + len;
                                        thisObj.width = titleWidth + 2 * len;
                                    }

                                }
                            var pp = this.containerPadding;
                                a.beginPath(),
                                a.lineWidth = this.borderWidth,
                                a.strokeStyle = "rgba(" + this.borderColor + "," + this.borderAlpha + ")";
                            var b = this.borderWidth / 2;
                            null == this.borderRadius || 0 == this.borderRadius
                                ?
                                a.rect(this.x - b - pp, this.y - b - pp, this.width + this.borderWidth + 2 * pp, this.height + this.borderWidth + 2 * pp)
                                :
                                a.JTopoRoundRect(this.x - b - pp, this.y - b - pp, this.width + this.borderWidth + 2 * pp, this.height + this.borderWidth + 2 * pp, this.borderRadius, this.borderDashed),
                                a.stroke();
                            if (this.borderBgFillColor) {
                                a.fillStyle = "rgba(" + this.borderBgFillColor + "," + this.borderBgAlpha + ")";
                                a.fill();
                            }
                            a.closePath();
                        }
                    }
                    this.paintText = function(g) {
                    var f = this.text;
                    if (null != f && "" != f) {
                        g.beginPath(),
                            g.font = this.font;
                        var j = g.measureText(f || "").width
                            , i = g.measureText("田").width;
                        var h = this.getTextPostion(this.textPosition, j, i);
                        h.y-=0.8;
                        g.fillStyle = this.borderTextBg;

                        g.beginPath();
                        g.moveTo(h.x - 20, h.y - i - 3);
                        g.lineTo(h.x + j + 20, h.y - i - 3);
                        g.lineTo(h.x + j + 10, h.y + 5);
                        g.lineTo(h.x - 10, h.y + 5);
                        g.fill();
                        g.fillStyle = "rgba(" + this.fontColor + ", " + this.textAlpha + ")";
                        g.fillText(f, h.x, h.y - 1),
                        g.closePath();
                        this.textPositionMsg = {
                            x: h.x - 20,
                            y: h.y - i - 3,
                            width: j + 40,
                            height: i + 8
                        }
                    }
                }
                    ,
                    this.getTextPostion = function(f, e, h) {
                        var g = null;
                        return null == f || "Bottom_Center" == f ? g = {
                            x: this.x + this.width / 2 - e / 2,
                            y: this.y + this.height + h
                        } : "Bottom_Top" == f ? g = {
                            x: this.x + this.width / 2 - e / 2,
                            y: this.y + this.height + h
                        } : "Top_Center" == f ? g = {
                            x: this.x + this.width / 2 - e / 2,
                            y: this.y - h / 2
                        } : "Top_Bottom" == f ? g = {
                            x: this.x + this.width / 2 - e / 2,
                            y: this.y + h / 2
                        } : "Top_Right" == f ? g = {
                            x: this.x + this.width - e,
                            y: this.y - h / 2
                        } : "Top_Left" == f ? g = {
                            x: this.x,
                            y: this.y - h / 2
                        } : "Bottom_Right" == f ? g = {
                            x: this.x + this.width - e,
                            y: this.y + this.height + h
                        } : "Bottom_Left" == f ? g = {
                            x: this.x,
                            y: this.y + this.height + h
                        } : "Middle_Center" == f ? g = {
                            x: this.x + this.width / 2 - e / 2,
                            y: this.y + this.height / 2 + h / 2
                        } : "Middle_Right" == f ? g = {
                            x: this.x + this.width - e,
                            y: this.y + this.height / 2 + h / 2
                        } : "Middle_Left" == f && (g = {
                                x: this.x,
                                y: this.y + this.height / 2 + h / 2
                            }),
                        null != this.textOffsetX && (g.x += this.textOffsetX),
                        null != this.textOffsetY && (g.y += this.textOffsetY),
                            g
                    }
                    ,
                    this.paintMouseover = function() {}
                    ,
                    this.paintSelected = function(b) {
                        b.shadowBlur = this.shadowBlur,
                            b.shadowColor = this.shadowColor,
                            b.shadowOffsetX = this.shadowOffsetX,
                            b.shadowOffsetY = this.shadowOffsetY
                    }
                    ,
                    this.removeHandler = function(f) {
                        var e = this;
                        this.outLinks && (this.outLinks.forEach(function(b) {
                            b.nodeA === e && f.remove(b)
                        }),
                            this.outLinks = null),
                        this.inLinks && (this.inLinks.forEach(function(b) {
                            b.nodeZ === e && f.remove(b)
                        }),
                            this.inLinks = null)
                    }
            }
            c.prototype = new d.InteractiveElement,
                d.Container = c
        }(JTopo),
        //containerNode的具体实现
        function(a) {
            function b(c) {
                this.initialize = function(c) {
                    b.prototype.initialize.apply(this, null),
                        //定制化by luozheao
                        this.elementType = "containerNode",
                        this.zIndex = a.zIndex_Container,
                        this.width = 100,
                        this.height = 100,
                        this.childs = [],
                        this.alpha = .5,
                        this.dragable = !0,
                        this.childDragble = !0,
                        this.visible = !0,
                        this.fillColor = "10,100,80",
                        this.borderWidth = 0,
                        this.shadowBlur = 10,
                        this.shadowColor = "rgba(255,255,255,1)",
                        this.shadowOffsetX = 0,
                        this.shadowOffsetY = 0,
                        this.borderColor = "255,255,255",
                        this.borderRadius = null,
                        this.font = "12px Consolas",
                        this.fontColor = "255,255,255",
                        this.text = c,
                        this.textPosition = "Bottom_Center",
                        this.textOffsetX = 0,
                        this.textOffsetY = 0,
                        this.layout = new a.layout.AutoBoundLayout
                },
                    this.initialize(c),
                    this.add = function(b) {
                            this.childs.push(b),
                            b.dragable = this.childDragble;
                        if(!b.parentContainer){b.parentContainer=[]};
                        b.parentContainer.push(this);
                    },
                    this.remove = function(a) {
                        for (var b = 0; b < this.childs.length; b++)
                            if (this.childs[b] === a) {
                                a.parentContainer = null,
                                    this.childs = this.childs.del(b),
                                    a.lastParentContainer = this;
                                break
                            }
                    },
                    this.removeAll = function() {
                        this.childs = []
                    },
                    this.setLocation = function(a, b) {

                        var c = a - this.x
                            , d = b - this.y;
                        this.x = a,
                            this.y = b;
                        for (var e = 0; e < this.childs.length; e++) {
                            var f = this.childs[e];

                            f.setLocation(f.x + c, f.y + d) //相对位置


                        }
                    },

                    this.doLayout = function(a) {
                        a && a(this, this.childs)
                    },


                    this.paint = function(a) {

                        this.visible && (this.layout && this.layout(this, this.childs),
                            a.beginPath(),
                            a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                            null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x, this.y, this.width, this.height) : a.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius),
                            a.fill(),
                            a.closePath(),
                            this.paintText(a),
                            this.paintBorder(a))
                    },
                    this.paintBorder = function(a) {
                        if (0 != this.borderWidth) {
                            a.beginPath(),
                                a.lineWidth = this.borderWidth,
                                a.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                            var b = this.borderWidth / 2;
                            null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
                                a.stroke(),
                                a.closePath()
                        }
                    },
                    this.paintText = function(a) {
                        var b = this.text;
                        if (null != b && "" != b) {
                            a.beginPath(),
                                a.font = this.font;
                            var c = a.measureText(b).width
                                , d = a.measureText("田").width;
                            a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
                            var e = this.getTextPostion(this.textPosition, c, d);
                            a.fillText(b, e.x, e.y),
                                a.closePath()
                        }
                    },
                    this.getTextPostion = function (a, b, c) {
                        var d = null;


                        return null == a || "Bottom_Center" == a ? d = {
                            x: this.x + this.width / 2 - b / 2,
                            y: this.y + this.height + c
                        } : "Bottom_Top" == a? d={
                            x: this.x + this.width / 2 - b / 2,
                            y: this.y + this.height + c
                        }:"Top_Center" == a ? d = {
                            x: this.x + this.width / 2 - b / 2,
                            y: this.y - c / 2
                        } : "Top_Right" == a ? d = {
                            x: this.x + this.width - b,
                            y: this.y - c / 2
                        } : "Top_Left" == a ? d = {
                            x: this.x,
                            y: this.y - c / 2
                        } : "Bottom_Right" == a ? d = {
                            x: this.x + this.width - b,
                            y: this.y + this.height + c
                        } : "Bottom_Left" == a ? d = {
                            x: this.x,
                            y: this.y + this.height + c
                        } : "Middle_Center" == a ? d = {
                            x: this.x + this.width / 2 - b / 2,
                            y: this.y + this.height / 2 + c / 2
                        } : "Middle_Right" == a ? d = {
                            x: this.x + this.width - b,
                            y: this.y + this.height / 2 + c / 2
                        } : "Middle_Left" == a && (d = {
                                x: this.x,
                                y: this.y + this.height / 2 + c / 2
                            }),
                        null != this.textOffsetX && (d.x += this.textOffsetX),
                        null != this.textOffsetY && (d.y += this.textOffsetY),
                            d
                    },
                    this.paintMouseover = function() {

                    },
                    this.paintMouseout = function() {

                    },
                    this.paintSelected = function(a) {
                        a.shadowBlur = this.shadowBlur,
                            a.shadowColor = this.shadowColor,
                            a.shadowOffsetX = this.shadowOffsetX,
                            a.shadowOffsetY = this.shadowOffsetY
                    },
                    this.removeHandler = function(f) {
                        var e = this;
                        this.outLinks && (this.outLinks.forEach(function(b) {
                            b.nodeA === e && f.remove(b)
                        }),
                            this.outLinks = null),
                        this.inLinks && (this.inLinks.forEach(function(b) {
                            b.nodeZ === e && f.remove(b)
                        }),
                            this.inLinks = null)
                    }
            }
            b.prototype = new a.InteractiveElement,
                a.ContainerNode = b
        }(JTopo),
        //layout的具体实现
        function(a) {
            function b(a) {
                var b = 0, c = 0;
                a.forEach(function(a) {
                    b += a.cx,
                        c += a.cy
                });
                var d = {
                    x: b / a.length,
                    y: c / a.length
                };
                return d
            }
            function c(c, d) {
                null == d && (d = {});
                {
                    var e = d.cx
                        , f = d.cy
                        , g = d.minRadius
                        , h = d.nodeDiameter
                        , i = d.hScale || 1
                        , j = d.vScale || 1;
                    d.beginAngle || 0,
                    d.endAngle || 2 * Math.PI
                }
                if (null == e || null == f) {
                    var k = b(c);
                    e = k.x,
                        f = k.y
                }
                var l = 0, m = [], n = [];
                c.forEach(function(a) {
                    null == d.nodeDiameter ? (a.diameter && (h = a.diameter),
                        h = a.radius ? 2 * a.radius : Math.sqrt(2 * a.width * a.height),
                        n.push(h)) : n.push(h),
                        l += h
                }),
                    c.forEach(function(a, b) {
                        var c = n[b] / l;
                        m.push(Math.PI * c)
                    });
                var o = (c.length,
                m[0] + m[1]), p = n[0] / 2 + n[1] / 2, q = p / 2 / Math.sin(o / 2);
                null != g && g > q && (q = g);
                var r = q * i, s = q * j, t = d.animate;
                if (t) {
                    var u = t.time || 1e3
                        , v = 0;
                    c.forEach(function(b, c) {
                        v += 0 == c ? m[c] : m[c - 1] + m[c];
                        var d = e + Math.cos(v) * r
                            , g = f + Math.sin(v) * s;
                        a.Animate.stepByStep(b, {
                            x: d - b.width / 2,
                            y: g - b.height / 2
                        }, u).start()
                    })
                } else {
                    var v = 0;
                    c.forEach(function(a, b) {
                        v += 0 == b ? m[b] : m[b - 1] + m[b];
                        var c = e + Math.cos(v) * r
                            , d = f + Math.sin(v) * s;
                        a.cx = c,
                            a.cy = d
                    })
                }
                return {
                    cx: e,
                    cy: f,
                    radius: r,
                    radiusA: r,
                    radiusB: s
                }
            }
            function d(a, b) {
                return function(c) {
                    var d = c.childs;
                    if (!(d.length <= 0))
                        for (var e = c.getBound(),
                                 f = d[0],
                                 g = (e.width - f.width) / b,
                                 h = (e.height - f.height) / a,
                                 i = (d.length, 0),
                                 j = 0; a > j; j++){
                            for (var k = 0; b > k; k++) {
                                var l = d[i++]
                                    , m = e.left + g / 2 + k * g
                                    , n = e.top + h / 2 + j * h;
                                if (l.setLocation(m, n),
                                    i >= d.length)
                                    return
                            }
                        }
                }
            }
            function e(a, b) {
                return null == a && (a = 0),
                null == b && (b = 0),
                    function(c) {
                        var d = c.childs;
                        if (!(d.length <= 0))
                            for (var e = c.getBound(), f = e.left, g = e.top, h = 0; h < d.length; h++) {
                                var i = d[h];
                                f + i.width >= e.right && (f = e.left,
                                    g += b + i.height),
                                    i.setLocation(f+a/2, g+b/2),
                                    f += a + i.width
                            }
                    }
            }
            function f() {
                return function(a, b) {
                    if (b.length > 0) {
                        for (var c = 1e7, d = -1e7, e = 1e7, f = -1e7, g = d - c, h = f - e, i = 0; i < b.length; i++) {
                            var j = b[i];
                            j.x <= c && (c = j.x),
                            j.x >= d && (d = j.x),
                            j.y <= e && (e = j.y),
                            j.y >= f && (f = j.y),
                                g = d - c + j.width,
                                h = f - e + j.height
                        }
                        a.x = c,
                            a.y = e,
                            a.width = g,
                            a.height = h
                    }
                }
            }
            function g(b) {
                var c = [], d = b.filter(function(b) {
                    return b instanceof a.Link ? !0 : (c.push(b),
                        !1)
                });
                return b = c.filter(function(a) {
                    for (var b = 0; b < d.length; b++)
                        if (d[b].nodeZ === a)
                            return !1;
                    return !0
                }),
                    b = b.filter(function(a) {
                        for (var b = 0; b < d.length; b++)
                            if (d[b].nodeA === a)
                                return !0;
                        return !1
                    })
            }
            function h(a) {
                var b = 0, c = 0;
                return a.forEach(function(a) {
                    b += a.width,
                        c += a.height
                }),
                    {
                        width: b / a.length,
                        height: c / a.length
                    }
            }
            function i(a, b, c, d) {
                b.x += c,
                    b.y += d;
                for (var e = q(a, b), f = 0; f < e.length; f++)
                    i(a, e[f], c, d)
            }
            function j(a, b) {
                function c(b, e) {
                    var f = q(a, b);
                    null == d[e] && (d[e] = {},
                        d[e].nodes = [],
                        d[e].childs = []),
                        d[e].nodes.push(b),
                        d[e].childs.push(f);
                    for (var g = 0; g < f.length; g++)
                        c(f[g], e + 1),
                            f[g].parent = b
                }
                var d = [];
                return c(b, 0),
                    d
            }
            function k(b, c, d) {
                return function(e) {
                    function f(f, g) {
                        for (var h = a.layout.getTreeDeep(f, g), k = j(f, g), l = k["" + h].nodes, m = 0; m < l.length; m++) {
                            var n = l[m]
                                , o = (m + 1) * (c + 10)
                                , p = h * d;
                            "down" == b || ("up" == b ? p = -p : "left" == b ? (o = -h * d,
                                p = (m + 1) * (c + 10)) : "right" == b && (o = h * d,
                                    p = (m + 1) * (c + 10))),
                                n.setLocation(o, p)
                        }
                        for (var q = h - 1; q >= 0; q--)
                            for (var r = k["" + q].nodes, s = k["" + q].childs, m = 0; m < r.length; m++) {
                                var t = r[m]
                                    , u = s[m];
                                if ("down" == b ? t.y = q * d : "up" == b ? t.y = -q * d : "left" == b ? t.x = -q * d : "right" == b && (t.x = q * d),
                                        u.length > 0 ? "down" == b || "up" == b ? t.x = (u[0].x + u[u.length - 1].x) / 2 : ("left" == b || "right" == b) && (t.y = (u[0].y + u[u.length - 1].y) / 2) : m > 0 && ("down" == b || "up" == b ? t.x = r[m - 1].x + r[m - 1].width + c : ("left" == b || "right" == b) && (t.y = r[m - 1].y + r[m - 1].height + c)),
                                    m > 0)
                                    if ("down" == b || "up" == b) {
                                        if (t.x < r[m - 1].x + r[m - 1].width)
                                            for (var v = r[m - 1].x + r[m - 1].width + c, w = Math.abs(v - t.x), x = m; x < r.length; x++)
                                                i(e.childs, r[x], w, 0)
                                    } else if (("left" == b || "right" == b) && t.y < r[m - 1].y + r[m - 1].height)
                                        for (var y = r[m - 1].y + r[m - 1].height + c, z = Math.abs(y - t.y), x = m; x < r.length; x++)
                                            i(e.childs, r[x], 0, z)
                            }
                    }
                    var g = null;
                    null == c && (g = h(e.childs),
                        c = g.width,
                    ("left" == b || "right" == b) && (c = g.width + 10)),
                    null == d && (null == g && (g = h(e.childs)),
                        d = 2 * g.height),
                    null == b && (b = "down");
                    var k = a.layout.getRootNodes(e.childs);
                    if (k.length > 0) {
                        f(e.childs, k[0]);

                        var l = a.util.getElementsBound(e.childs)
                            , m = e.getCenterLocation()
                            , n = m.x - (l.left + l.right) / 2
                            , o = m.y - (l.top + l.bottom) / 2;
                        e.childs.forEach(function(b) {
                            b instanceof a.Node && (b.x += n,
                                b.y += o)
                        })
                    }
                }
            }
            function l(b) {
                return function(c) {
                    function d(a, c, e) {
                        var f = q(a, c);
                        if (0 != f.length) {
                            null == e && (e = b);
                            var g = 2 * Math.PI / f.length;
                            f.forEach(function(b, f) {
                                var h = c.x + e * Math.cos(g * f)
                                    , i = c.y + e * Math.sin(g * f);
                                b.setLocation(h, i);
                                var j = e / 2;
                                d(a, b, j)
                            })
                        }
                    }
                    var e = a.layout.getRootNodes(c.childs);
                    if (e.length > 0) {
                        d(c.childs, e[0]);
                        var f = a.util.getElementsBound(c.childs)
                            , g = c.getCenterLocation()
                            , h = g.x - (f.left + f.right) / 2
                            , i = g.y - (f.top + f.bottom) / 2;
                        c.childs.forEach(function(b) {
                            b instanceof a.Node && (b.x += h,
                                b.y += i)
                        })
                    }
                }
            }
            function m(a, b, c, d, e, f) {
                for (var g = [], h = 0; c > h; h++)
                    for (var i = 0; d > i; i++)
                        g.push({
                            x: a + i * e,
                            y: b + h * f
                        });
                return g
            }
            function n(a, b, c, d, e, f) {
                var g = e ? e : 0, h = f ? f : 2 * Math.PI, i = h - g, j = i / c, k = [];
                g += j / 2;
                for (var l = g; h >= l; l += j) {
                    var m = a + Math.cos(l) * d
                        , n = b + Math.sin(l) * d;
                    k.push({
                        x: m,
                        y: n
                    })
                }
                return k
            }
            function o(a, b, c, d, e, f) {
                var g = f || "bottom", h = [];
                if ("bottom" == g)
                    for (var i = a - c / 2 * d + d / 2, j = 0; c >= j; j++)
                        h.push({
                            x: i + j * d,
                            y: b + e
                        });
                else if ("top" == g)
                    for (var i = a - c / 2 * d + d / 2, j = 0; c >= j; j++)
                        h.push({
                            x: i + j * d,
                            y: b - e
                        });
                else if ("right" == g)
                    for (var i = b - c / 2 * d + d / 2, j = 0; c >= j; j++)
                        h.push({
                            x: a + e,
                            y: i + j * d
                        });
                else if ("left" == g)
                    for (var i = b - c / 2 * d + d / 2, j = 0; c >= j; j++)
                        h.push({
                            x: a - e,
                            y: i + j * d
                        });
                return h
            }
            function m(a, b, c, d, e, f) {
                for (var g = [], h = 0; c > h; h++)
                    for (var i = 0; d > i; i++)
                        g.push({
                            x: a + i * e,
                            y: b + h * f
                        });
                return g
            }
            function p(a, b) {
                if (a.layout) {
                    var c = a.layout
                        , d = c.type
                        , e = null;
                    if ("circle" == d) {
                        var f = c.radius || Math.max(a.width, a.height);
                        e = n(a.cx, a.cy, b.length, f, a.layout.beginAngle, a.layout.endAngle)
                    } else if ("tree" == d) {
                        var g = c.width || 50
                            , h = c.height || 50
                            , i = c.direction;
                        e = o(a.cx, a.cy, b.length, g, h, i)
                    } else {
                        if ("grid" != d)
                            return;
                        e = m(a.x, a.y, c.rows, c.cols, c.horizontal || 0, c.vertical || 0)
                    }
                    for (var j = 0; j < b.length; j++)
                        b[j].setCenterLocation(e[j].x, e[j].y)
                }
            }
            function q(b, c) {
                for (var d = [], e = 0; e < b.length; e++)
                    b[e]instanceof a.Link && b[e].nodeA === c && d.push(b[e].nodeZ);
                return d
            }
            function r(a, b, c) {
                var d = q(a.childs, b);
                if (0 == d.length)
                    return null;
                if (p(b, d),
                    1 == c)
                    for (var e = 0; e < d.length; e++)
                        r(a, d[e], c);
                return null
            }
            function s(b, c) {
                function d(a, b) {
                    var c = a.x - b.x
                        , d = a.y - b.y;
                    i += c * f,
                        j += d * f,
                        i *= g,
                        j *= g,
                        j += h,
                        b.x += i,
                        b.y += j
                }
                function e() {
                    if (!(++k > 150)) {
                        for (var a = 0; a < l.length; a++)
                            l[a] != b && d(b, l[a], l);
                        setTimeout(e, 1e3 / 24)
                    }
                }
                var f = .01, g = .95, h = -5, i = 0, j = 0, k = 0, l = c.getElementsByClass(a.Node);
                e()
            }
            function t(a, b) {
                function c(a, b, e) {
                    var f = q(a, b);
                    e > d && (d = e);
                    for (var g = 0; g < f.length; g++)
                        c(a, f[g], e + 1)
                }
                var d = 0;
                return c(a, b, 0),
                    d
            }
            a.layout = a.Layout = {
                layoutNode: r,
                getNodeChilds: q,
                adjustPosition: p,
                springLayout: s,
                getTreeDeep: t,
                getRootNodes: g,
                GridLayout: d,
                FlowLayout: e,
                AutoBoundLayout: f,
                CircleLayout: l,
                TreeLayout: k,
                getNodesCenter: b,
                circleLayoutNodes: c
            }
        }(JTopo),
        //circleNode的具体实现
        function(a) {
            function b() {
                var b = new a.CircleNode;
                return b.radius = 150,
                    b.colors = ["#3666B0", "#2CA8E0", "#77D1F6"],
                    b.datas = [.3, .3, .4],
                    b.titles = ["A", "B", "C"],
                    b.paint = function(a) {
                        var c = 2 * b.radius
                            , d = 2 * b.radius;
                        b.width = c,
                            b.height = d;
                        for (var e = 0, f = 0; f < this.datas.length; f++) {
                            var g = this.datas[f] * Math.PI * 2;
                            a.save(),
                                a.beginPath(),
                                a.fillStyle = b.colors[f],
                                a.moveTo(0, 0),
                                a.arc(0, 0, this.radius, e, e + g, !1),
                                a.fill(),
                                a.closePath(),
                                a.restore(),
                                a.beginPath(),
                                a.font = this.font;
                            var h = this.titles[f] + ": " + (100 * this.datas[f]).toFixed(2) + "%"
                                , i = a.measureText(h).width
                                , j = (a.measureText("田").width,
                            (e + e + g) / 2)
                                , k = this.radius * Math.cos(j)
                                , l = this.radius * Math.sin(j);
                            j > Math.PI / 2 && j <= Math.PI ? k -= i : j > Math.PI && j < 2 * Math.PI * 3 / 4 ? k -= i : j > 2 * Math.PI * .75,
                                a.fillStyle = "#FFFFFF",
                                a.fillText(h, k, l),
                                a.moveTo(this.radius * Math.cos(j), this.radius * Math.sin(j)),
                            j > Math.PI / 2 && j < 2 * Math.PI * 3 / 4 && (k -= i),
                            j > Math.PI,
                                a.fill(),
                                a.stroke(),
                                a.closePath(),
                                e += g
                        }
                    },
                    b
            }
            function c() {
                var b = new a.Node;
                return b.showSelected = !1,
                    b.width = 250,
                    b.height = 180,
                    b.colors = ["#3666B0", "#2CA8E0", "#77D1F6"],
                    b.datas = [.3, .3, .4],
                    b.titles = ["A", "B", "C"],
                    b.paint = function(a) {
                        var c = 3
                            , d = (this.width - c) / this.datas.length;
                        a.save(),
                            a.beginPath(),
                            a.fillStyle = "#FFFFFF",
                            a.strokeStyle = "#FFFFFF",
                            a.moveTo(-this.width / 2 - 1, -this.height / 2),
                            a.lineTo(-this.width / 2 - 1, this.height / 2 + 3),
                            a.lineTo(this.width / 2 + c + 1, this.height / 2 + 3),
                            a.stroke(),
                            a.closePath(),
                            a.restore();
                        for (var e = 0; e < this.datas.length; e++) {
                            a.save(),
                                a.beginPath(),
                                a.fillStyle = b.colors[e];
                            var f = this.datas[e]
                                , g = e * (d + c) - this.width / 2
                                , h = this.height - f - this.height / 2;
                            a.fillRect(g, h, d, f);
                            var i = "" + parseInt(this.datas[e])
                                , j = a.measureText(i).width
                                , k = a.measureText("田").width;
                            a.fillStyle = "#FFFFFF",
                                a.fillText(i, g + (d - j) / 2, h - k),
                                a.fillText(this.titles[e], g + (d - j) / 2, this.height / 2 + k),
                                a.fill(),
                                a.closePath(),
                                a.restore()
                        }
                    },
                    b
            }
            a.BarChartNode = c,
                a.PieChartNode = b
        }(JTopo),
        //Animate和Effect的具体实现
        function(a) {
            function b(b, c) {
                var d, e = null;
                return {
                    stop: function() {
                        return d ? (window.clearInterval(d),
                        e && e.publish("stop"),
                            this) : this
                    },
                    start: function() {
                        var a = this;
                        return d = setInterval(function() {
                            b.call(a)
                        }, c),
                            this
                    },
                    onStop: function(b) {
                        return null == e && (e = new a.util.MessageBus),
                            e.subscribe("stop", b),
                            this
                    }
                }
            }
            function c(a, c) {
                c = c || {};
                var d = c.gravity || .1, e = c.dx || 0, f = c.dy || 5, g = c.stop, h = c.interval || 30, i = new b(function() {
                    g && g() ? (f = .5,
                        this.stop()) : (f += d,
                        a.setLocation(a.x + e, a.y + f))
                },h);
                return i
            }
            function d(a, c, d, e, f) {
                //节点、属性、时间、true(是否循环)、是否逆循环
                var g = 1e3 / 24, h = {};
                for (var i in c) {
                    var j = c[i]
                        , k = j - a[i];
                    h[i] = {
                        oldValue: a[i],
                        targetValue: j,
                        step: k / d * g,
                        isDone: function(b) {
                            var c = this.step > 0 && a[b] >= this.targetValue || this.step < 0 && a[b] <= this.targetValue;
                            return c
                        }
                    }
                }
                var l = new b(function() {
                    var b = !0;
                    for (var d in c)
                        h[d].isDone(d) || (a[d] += h[d].step,
                            b = !1);
                    if (b) {
                        if (!e)
                            return this.stop();
                        for (var d in c)
                            if (f) {
                                var g = h[d].targetValue;
                                h[d].targetValue = h[d].oldValue,
                                    h[d].oldValue = g,
                                    h[d].step = -h[d].step
                            } else
                                a[d] = h[d].oldValue
                    }
                    return this
                },g);
                return l
            }
            function e(a) {
                null == a && (a = {});
                var b = a.spring || .1, c = a.friction || .8, d = a.grivity || 0, e = (a.wind || 0,
                a.minLength || 0);
                return {
                    items: [],
                    timer: null,
                    isPause: !1,
                    addNode: function(a, b) {
                        var c = {
                            node: a,
                            target: b,
                            vx: 0,
                            vy: 0
                        };
                        return this.items.push(c),
                            this
                    },
                    play: function(a) {
                        this.stop(),
                            a = null == a ? 1e3 / 24 : a;
                        var b = this;
                        this.timer = setInterval(function() {
                            b.nextFrame()
                        }, a)
                    },
                    stop: function() {
                        null != this.timer && window.clearInterval(this.timer)
                    },
                    nextFrame: function() {
                        for (var a = 0; a < this.items.length; a++) {
                            var f = this.items[a]
                                , g = f.node
                                , h = f.target
                                , i = f.vx
                                , j = f.vy
                                , k = h.x - g.x
                                , l = h.y - g.y
                                , m = Math.atan2(l, k);
                            if (0 != e) {
                                var n = h.x - Math.cos(m) * e
                                    , o = h.y - Math.sin(m) * e;
                                i += (n - g.x) * b,
                                    j += (o - g.y) * b
                            } else
                                i += k * b,
                                    j += l * b;
                            i *= c,
                                j *= c,
                                j += d,
                                g.x += i,
                                g.y += j,
                                f.vx = i,
                                f.vy = j
                        }
                    }
                }
            }
            function f(a, b) {
                function c() {
                    return e = setInterval(function() {
                        return o ? void f.stop() : (a.rotate += g || .2,
                            void (a.rotate > 2 * Math.PI && (a.rotate = 0)))
                    }, 100),
                        f
                }
                function d() {
                    return window.clearInterval(e),
                    f.onStop && f.onStop(a),
                        f
                }
                var e = (b.context,
                    null), f = {}, g = b.v;
                return f.run = c,
                    f.stop = d,
                    f.onStop = function(a) {
                        return f.onStop = a,
                            f
                    },
                    f
            }
            function g(a, b) {
                function c() {
                    return window.clearInterval(g),
                    h.onStop && h.onStop(a),
                        h
                }
                function d() {
                    var d = b.dx || 0
                        , i = b.dy || 2;
                    return g = setInterval(function() {
                        return o ? void h.stop() : (i += f,
                            void (a.y + a.height < e.stage.canvas.height ? a.setLocation(a.x + d, a.y + i) : (i = 0,
                                c())))
                    }, 20),
                        h
                }
                var e = b.context, f = b.gravity || .1, g = null, h = {};
                return h.run = d,
                    h.stop = c,
                    h.onStop = function(a) {
                        return h.onStop = a,
                            h
                    },
                    h
            }
            function h(b, c) {
                function d(c, d, e, f, g) {
                    var h = new a.Node;
                    return h.setImage(b.image),
                        h.setSize(b.width, b.height),
                        h.setLocation(c, d),
                        h.showSelected = !1,
                        h.dragable = !1,
                        h.paint = function(a) {
                            a.save(),
                                a.arc(0, 0, e, f, g),
                                a.clip(),
                                a.beginPath(),
                                null != this.image ? a.drawImage(this.image, -this.width / 2, -this.height / 2) : (a.fillStyle = "rgba(" + this.style.fillStyle + "," + this.alpha + ")",
                                    a.rect(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2),
                                    a.fill()),
                                a.closePath(),
                                a.restore()
                        }
                        ,
                        h
                }
                function e(c, e) {
                    var f = c
                        , g = c + Math.PI
                        , h = d(b.x, b.y, b.width, f, g)
                        , j = d(b.x - 2 + 4 * Math.random(), b.y, b.width, f + Math.PI, f);
                    b.visible = !1,
                        e.add(h),
                        e.add(j),
                        a.Animate.gravity(h, {
                            context: e,
                            dx: .3
                        }).run().onStop(function() {
                            e.remove(h),
                                e.remove(j),
                                i.stop()
                        }),
                        a.Animate.gravity(j, {
                            context: e,
                            dx: -.2
                        }).run()
                }
                function f() {
                    return e(c.angle, h),
                        i
                }
                function g() {
                    return i.onStop && i.onStop(b),
                        i
                }
                var h = c.context, i = (b.style,
                    {});
                return i.onStop = function(a) {
                    return i.onStop = a,
                        i
                },
                    i.run = f,
                    i.stop = g,
                    i
            }
            function i(a, b) {
                function c(a) {
                    a.visible = !0,
                        a.rotate = Math.random();
                    var b = g.stage.canvas.width / 2;
                    a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100),
                        a.y = g.stage.canvas.height,
                        a.vx = 5 * Math.random() - 5 * Math.random(),
                        a.vy = -25
                }
                function d() {
                    return c(a),
                        h = setInterval(function() {
                            return o ? void i.stop() : (a.vy += f,
                                a.x += a.vx,
                                a.y += a.vy,
                                void ((a.x < 0 || a.x > g.stage.canvas.width || a.y > g.stage.canvas.height) && (i.onStop && i.onStop(a),
                                    c(a))))
                        }, 50),
                        i
                }
                function e() {
                    window.clearInterval(h)
                }
                var f = .8, g = b.context, h = null, i = {};
                return i.onStop = function(a) {
                    return i.onStop = a,
                        i
                },
                    i.run = d,
                    i.stop = e,
                    i
            }
            function j() {
                o = !0
            }
            function k() {
                o = !1
            }
            function l(b, c) {
                function d() {
                    return n = setInterval(function() {
                        if (o)
                            return void m.stop();
                        var a = f.y + h + Math.sin(k) * j;
                        b.setLocation(b.x, a),
                            k += l
                    }, 100),
                        m
                }
                function e() {
                    window.clearInterval(n)
                }
                var f = c.p1, g = c.p2, h = (c.context,
                f.x + (g.x - f.x) / 2), i = f.y + (g.y - f.y) / 2, j = a.util.getDistance(f, g) / 2, k = Math.atan2(i, h), l = c.speed || .2, m = {}, n = null;
                return m.run = d,
                    m.stop = e,
                    m
            }
            function m(a, b) {
                function c() {
                    return h = setInterval(function() {
                        if (o)
                            return void g.stop();
                        var b = e.x - a.x
                            , c = e.y - a.y
                            , h = b * f
                            , i = c * f;
                        a.x += h,
                            a.y += i,
                        .01 > h && .1 > i && d()
                    }, 100),
                        g
                }
                function d() {
                    window.clearInterval(h)
                }
                var e = b.position, f = (b.context,
                b.easing || .2), g = {}, h = null;
                return g.onStop = function(a) {
                    return g.onStop = a,
                        g
                },
                    g.run = c,
                    g.stop = d,
                    g
            }
            function n(a, b) {
                function c() {
                    return j = setInterval(function() {
                        a.scaleX += f,
                            a.scaleY += f,
                        a.scaleX >= e && d()
                    }, 100),
                        i
                }
                function d() {
                    i.onStop && i.onStop(a),
                        a.scaleX = g,
                        a.scaleY = h,
                        window.clearInterval(j)
                }
                var e = (b.position,
                    b.context,
                b.scale || 1), f = .06, g = a.scaleX, h = a.scaleY, i = {}, j = null;
                return i.onStop = function(a) {
                    return i.onStop = a,
                        i
                },
                    i.run = c,
                    i.stop = d,
                    i
            }
            a.Animate = {},
                a.Effect = {};
            var o = !1;
            a.Effect.spring = e,
                a.Effect.gravity = c,
                a.Animate.stepByStep = d,
                a.Animate.rotate = f,
                a.Animate.scale = n,
                a.Animate.move = m,
                a.Animate.cycle = l,
                a.Animate.repeatThrow = i,
                a.Animate.dividedTwoPiece = h,
                a.Animate.gravity = g,
                a.Animate.startAll = k,
                a.Animate.stopAll = j
        }(JTopo),
        //stage和scene的find功能
        function(a) {
            function b(a, b) {
                var c = [];
                if (0 == a.length)
                    return c;
                var d = b.match(/^\s*(\w+)\s*$/);
                if (null != d) {
                    var e = a.filter(function(a) {
                        return a.elementType == d[1]
                    });
                    null != e && e.length > 0 && (c = c.concat(e))
                } else {
                    var f = !1;
                    if (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/),
                        (null == d || d.length < 5) && (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/),
                            f = !0),
                        null != d && d.length >= 5) {
                        var g = d[1]
                            , h = d[2]
                            , i = d[3]
                            , j = d[4];
                        e = a.filter(function(a) {
                            if (a.elementType != g)
                                return !1;
                            var b = a[h];
                            return 1 == f && (b = parseInt(b)),
                                "=" == i ? b == j : ">" == i ? b > j : "<" == i ? j > b : "<=" == i ? j >= b : ">=" == i ? b >= j : "!=" == i ? b != j : !1
                        }),
                        null != e && e.length > 0 && (c = c.concat(e))
                    }
                }
                return c
            }
            function c(a) {
                if (a.find = function(a) {
                        return d.call(this, a)
                    }
                        ,
                        e.forEach(function(b) {
                            a[b] = function(a) {
                                for (var c = 0; c < this.length; c++)
                                    this[c][b](a);
                                return this
                            }
                        }),
                    a.length > 0) {
                    var b = a[0];
                    for (var c in b) {
                        var f = b[c];
                        "function" == typeof f && !function(b) {
                            a[c] = function() {
                                for (var c = [], d = 0; d < a.length; d++)
                                    c.push(b.apply(a[d], arguments));
                                return c
                            }
                        }(f)
                    }
                }
                return a.attr = function(a, b) {
                    if (null != a && null != b)
                        for (var c = 0; c < this.length; c++)
                            this[c][a] = b;
                    else {
                        if (null != a && "string" == typeof a) {
                            for (var d = [], c = 0; c < this.length; c++)
                                d.push(this[c][a]);
                            return d
                        }
                        if (null != a)
                            for (var c = 0; c < this.length; c++)
                                for (var e in a)
                                    this[c][e] = a[e]
                    }
                    return this
                },
                    a
            }
            function d(d) {
                var e = [], f = [];
                this instanceof a.Stage ? (e = this.childs,f = f.concat(e))
                    : this instanceof a.Scene
                    ? e = [this] : f = this,
                    e.forEach(function(a) {
                        f = f.concat(a.childs)
                    });
                var g = null;
                return g = "function" == typeof d ? f.filter(d) : b(f, d),
                    g = c(g)
            }
            var e = "click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup".split(",");
            a.Stage.prototype.find = d,
                a.Scene.prototype.find = d
        }(JTopo),
        //未开发完的功能，待研究
        function(a) {
            function b(a, b) {
                this.x = a,
                    this.y = b
            }
            function c(a) {
                this.p = new b(0,0),
                    this.w = new b(1,0),
                    this.paint = a
            }
            function d(a, b, c) {
                return function(d) {
                    for (var e = 0; b > e; e++)
                        a(),
                        c && d.turn(c),
                            d.move(3)
                }
            }
            function e(a, b) {
                var c = 2 * Math.PI;
                return function(d) {
                    for (var e = 0; b > e; e++)
                        a(),
                            d.turn(c / b)
                }
            }
            function f(a, b, c) {
                return function(d) {
                    for (var e = 0; b > e; e++)
                        a(),
                            d.resize(c)
                }
            }
            function g(a) {
                var b = 2 * Math.PI;
                return function(c) {
                    for (var d = 0; a > d; d++)
                        c.forward(1),
                            c.turn(b / a)
                }
            }
            function h(a) {
                var b = 4 * Math.PI;
                return function(c) {
                    for (var d = 0; a > d; d++)
                        c.forward(1),
                            c.turn(b / a)
                }
            }
            function i(a, b, c, d) {
                return function(e) {
                    for (var f = 0; b > f; f++)
                        a(),
                            e.forward(1),
                            e.turn(c),
                            e.resize(d)
                }
            }
            var j = {};
            c.prototype.forward = function(a) {
                var b = this.p, c = this.w;
                return b.x = b.x + a * c.x,
                    b.y = b.y + a * c.y,
                this.paint && this.paint(b.x, b.y),
                    this
            },
                c.prototype.move = function(a) {
                    var b = this.p
                        , c = this.w;
                    return b.x = b.x + a * c.x,
                        b.y = b.y + a * c.y,
                        this
                },
                c.prototype.moveTo = function(a, b) {
                    return this.p.x = a,
                        this.p.y = b,
                        this
                },
                c.prototype.turn = function(a) {
                    var b = (this.p,
                        this.w)
                        , c = Math.cos(a) * b.x - Math.sin(a) * b.y
                        , d = Math.sin(a) * b.x + Math.cos(a) * b.y;
                    return b.x = c,
                        b.y = d,
                        this
                },
                c.prototype.resize = function(a) {
                    var b = this.w;
                    return b.x = b.x * a,
                        b.y = b.y * a,
                        this
                },
                c.prototype.save = function() {
                    return null == this._stack && (this._stack = []),
                        this._stack.push([this.p, this.w]),
                        this
                },
                c.prototype.restore = function() {
                    if (null != this._stack && this._stack.length > 0) {
                        var a = this._stack.pop();
                        this.p = a[0],
                            this.w = a[1]
                    }
                    return this
                },
                j.Tortoise = c,
                j.shift = d,
                j.spin = e,
                j.polygon = g, //多边形
                j.spiral = i,
                j.star = h,
                j.scale = f,
                a.Logo = j
        }(window);

    return JTopo;
})


