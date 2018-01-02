/**
 * date:20170315
 * by：luozheao
 * 说明：
 * 1、采用面向对象编程方式编写，阅读与修改时注意从对象的角度入手
 * 2、每个类、方法、行为要写注释，命名方式采用骆驼命名
 * 3、功能关联度较大的方法，应模块化成一个类，比如弹窗、权限管理
 * 4、mvc结构里面，数据层用get开头，显示层show开头，控制层用set开头
 * 5、辅助方法用fn开头
 * 6、私有方法用下划线‘_’开头
 * 7.
 * */
define(['jquery'],function ($) {
    //状态管理者
    var stateManager = {
        stage: {},
        scene: {},
        canvas: {},
        equipmentAreaWidth:250,
        setLink: { //线条类型
            isSetting: false,
            linkType: ''
        },
        isNeedSave:false,//用于判断画布内容是否改变,用于是否保存
        fineTuneMouseUpX:0,//鼠标松开后,微调节点的x位置
        fineTuneMouseUpY:0,
        curExpandNode:null,//目录树样式设置
        currentChooseElement:null,
        currentNode: null,//当前节点
        currentContainerNode: null,//当前容器节点
        currentContainer: null,//当前容器
        currentLink: null,//当前线条
        agentLink:null,//用于连线的线条
        beginNode:null,
        romveAgentLink:function(){
            stateManager.agentLink&&stateManager.scene.remove(stateManager.agentLink);
            stateManager.beginNode=null;
        },
        currentTopo: [], //当前树节点的拓扑图，包含物理、逻辑、系统、业务流程 ，analysisTopo会给它赋值
        currentActiveIndex:null,//当前选中拓扑图的序号
        currentTreeNode:null,//当前选中的树节点
        isFirstLoad:true,//初次加载页面
        isLocalhost:window.location.href.indexOf('localhost:')>=0,//判断是否属于本地环境
        isFromParentTree:false,//点击系统视图节点，触发子拓扑图打开，并切换到系统视图或逻辑拓扑
        isFullScreen:false,//当前是否全屏的状态
        formatNodes:['id','type','json'],//复现与保存时，读取后台nodes数组中node对象的属性
        formatContainerNodes:['id','type','json'],//复现与保存时，读取后台nodes数组中containerNode对象的属性
        formatContainers:['id','type','json'],//复现与保存时，读取后台nodes数组中container对象的属性
        formatLinks:['id','type','from_id','to_id','json'],//复现与保存时，读取后台links数组中对象的属性
        //获取复现与保存时，所需读取后台links、nodes数组中对象的属性
        setFormatNodesAndLinks:function (linksArr,nodesArr) {
            for(var k=0;k<nodesArr.length;k++){
                var obj=nodesArr[k];

                sugar(null,null,obj.type);


                if(obj.type=="node" && stateManager.formatNodes.length==3){
                    for(var m in obj){
                        stateManager.formatNodes.indexOf(m)<0&&stateManager.formatNodes.push(m);
                    }
                    sugar(stateManager.formatNodes,obj.json,obj.type);
                }
                else if(obj.type=="containerNode" && stateManager.formatContainerNodes.length==3){
                    for(var m in obj){
                        stateManager.formatContainerNodes.indexOf(m)<0&&stateManager.formatContainerNodes.push(m);
                    }
                    sugar(stateManager.formatContainerNodes,obj.json,obj.type);
                }
                else if(obj.type=="container" && stateManager.formatContainers.length==3){
                    for(var m in obj){
                        stateManager.formatContainers.indexOf(m)<0&&stateManager.formatContainers.push(m);
                    }
                    sugar(stateManager.formatContainers,obj.json,obj.type);
                }
            }

            for(var i=0;i<linksArr.length;i++){
                if(stateManager.formatLinks.length==5){break;}
                var obj=linksArr[i];
                for(var j in obj){
                    stateManager.formatLinks.indexOf(m)<0&&stateManager.formatLinks.push(j);
                }
                sugar(stateManager.formatLinks,obj.json,obj.type);
            }

            //数据格式验证机制
            function  sugar(arr,jsonStr,eleType) {
                var checkArr1=['id','json'];
                var checkArr2=['elementType'];
                var checkArr3=['nodeFn'];

                if(typeof  jsonStr !='string'){
                    jsonStr=JSON.stringify(jsonStr);
                }

                var str2='必填项:id type json(elementType必填,如果elementType==containerNode,必填nodeFn) ,其中elementType和type值保持一致'

                if(!eleType){
                    console.log("数据格式缺少:type,请添加上去!!!\n"+str2);
                }
                if(!arr||arr.length==0){
                    return false;
                }

                var str=arr.join(',');
                checkArr1.forEach(function (p1, p2, p3) {
                    if(str.indexOf(p1)<0){
                        console.log(eleType+"的数据格式缺少:"+p1+",请添加上去!!!\n"+str2);
                    }
                });
                checkArr2.forEach(function (p1, p2, p3) {
                    if(jsonStr.indexOf(p1)<0){
                        console.log(eleType+"的数据格式缺少:"+p1+",请添加上去!!!\n"+str2);
                    }
                });
                checkArr3.forEach(function (p1, p2, p3) {
                    if(jsonStr.indexOf(p1)<0&&eleType=="containerNode"){
                        console.log(eleType+"的数据格式缺少:"+p1+",请添加上去!!!\n"+str2);
                    }
                });
            }
        },
        //判断对象中的属性是否应该保存
        attrIsNeedSave:function (attr,value,elementType) {
            var attrArr=['lastParentContainer','propertiesStack','serializedProperties','animateNode','childs','image','inLinks','messageBus','outLinks','json','nodeA','nodeZ','selectedLocation','parentContainer'];
            if(elementType=='containerNode'){
                attrArr.push('childs');
            }
            if(attrArr.indexOf(attr)>=0){
                return false
            }
            return true;
        },
        scrollHeight:0,
        /**********辅助方法**********/
        //本地环境下的特殊处理,比如本地环境下的一级目录过长，则隐藏掉
        setStateUnderLocalHost:function() {
            //顶部一级目录过长，则在本地隐藏部分用不上的目录,8888是我的端口
            if (this.isLocalhost) {

            }
        },
        init: function () {
            var self=this;

            //监控滚动条滚动距离
            $('#appMain').scroll(function () {
                self.scrollHeight=$(this).scrollTop();
            });

            this.setStateUnderLocalHost();
        }
    }
    //权限管理者
    var powerManager={
        /************************状态********************/
        isViewModel:false,
        /************************显示层********************/
        /************************数据层********************/
        /************************控制层********************/
        init:function () {

        }
    }
    //弹窗管理者
    var popupManager={
        /**********辅助方法***********/
        //弹窗隐藏
        popHide:function () {

        },
        init:function () {

        }
    }
    //工具栏管理者
    var toolbarManager = {
        searchArr:['id'],
        history: {
            arr: [],
            curIndex: -1,
            save:function () {
                var arr= canvasManager.saveTopo();
                this.arr.length=this.curIndex+1;//截取
                this.arr.push(arr);
                this.curIndex++;

            },
            clear:function () {
                this.arr=[];
                this.curIndex=-1;
            },
            prev:function () {

                var index=this.curIndex;
                --index;
                if(index>=0){
                    this.curIndex=index;
                    var data=JTopo.util.copy(this.arr[this.curIndex]);
                    canvasManager.renderTopo(data);
                }
            },
            next:function () {
                var index=this.curIndex;
                ++index;
                if(index<this.arr.length){
                    this.curIndex=index;
                    var data=JTopo.util.copy(this.arr[this.curIndex]);
                    canvasManager.renderTopo(data);
                }
            }
        },
        historyOperCallback:null,
        /*******显示层*********/

        /*********控制层*************/
        //工具栏上面的按钮对应的事件
        aEvents: [
            //工具栏点击所有弹窗都关闭
            ['click','#toolbar',function () {
                popupManager.popHide();
            }],
            //缩放
            ['click', '.zoomArea>.btn', function () {
                var $zoom = $(this).find('>div');
                var self = toolbarManager;
                var zoom = 0.9;
                var stage = stateManager.stage;
                var scene = stateManager.scene;
                var canvas = stateManager.canvas;
                if ($zoom.hasClass('toolbar-zoomin')) {
                    //放大
                    scene.zoomOut(zoom);
                }
                else if ($zoom.hasClass('toolbar-zoomout')) {
                    //缩小
                    scene.zoomIn(zoom);
                }
                else if ($zoom.hasClass('toolbar-zoomreset')) {
                    //1:1
                    scene.zoomReset();
                }
                else if ($zoom.hasClass('toolbar-center')) {
                    //缩放并居中显示
                    stateManager.scene.translateX=0;
                    stateManager.scene.translateY=0;
                    stateManager.scene.centerAndZoom();
                    stateManager.stage.eagleEye.update();
                }
                else if ($zoom.hasClass('toolbar-overview')) {
                    var screenWidth= window.screen.width;
                    var screenHeight= window.screen.height;
                    //全屏
                    canvasManager.runPrefixMethod(canvas, "RequestFullScreen");
                    setTimeout(function(){
                        setCanvasScreen();
                        setTimeout(function(){
                            setCanvasScreen();
                        },300);
                    },100);
                    function  setCanvasScreen() {
                        $('#canvas').attr('width',screenWidth).attr('height',screenHeight).css('margin-top','0px');
                        stateManager.isFullScreen=true;

                        stateManager.scene.translateX=0;
                        stateManager.scene.translateY=0;
                        stateManager.scene.centerAndZoom();
                    }
                }
            }],
            //模式
            ['click', '.patternArea>.btn', function () {
                var scene = stateManager.scene;
                var self = toolbarManager;
                var $pattern = $(this).find('>div');
                self._setActiveBtn($(this));
                stateManager.setLink.isSetting = false;
                //取消选中
                stateManager.scene.selectedElements.forEach(function (p) {
                    p.selected=false;
                })

                if ($pattern.hasClass('toolbar-default')) {
                    //默认
                    scene.mode = "normal";
                }
                else if ($pattern.hasClass('toolbar-setBorder')) {
                    //边框
                    scene.mode = "edit";
                }
                else if ($pattern.hasClass('toolbar-select')) {
                    //框选
                    scene.mode = "select";
                    $('#toolbar .groupWrap').removeClass('hide');
                }
                else if ($pattern.hasClass('toolbar-pan')) {
                    //浏览
                    scene.mode = "drag";
                }
            }],
            //鹰眼
            ['click', '.eyesWrap', function () {
                toolbarManager.setEagleEye();
            }],
            //搜索
            ['click', '.searchWrap>.btn', function () {
                var text = $('#search_input').val().trim().toLowerCase();
                var scene = stateManager.scene;
                var searchArr=toolbarManager.searchArr;

                scene.childs.filter(function (child, p2, p3) {
                    for(var i=0;i<searchArr.length;i++){
                        var attr=searchArr[i];
                        if(child[attr]&&child[attr].indexOf(text)>=0){
                            child.selected=true;
                            break;
                        }
                    }
                });
            }],
            ['keyup', '#search_input', function (e) {
                if (e.which == 13) {
                    $('.searchWrap >.btn').click();
                }
            }],
            //连线
            ['click', '.chooselineArea>.btn', function () {
                var $line = $(this);
                stateManager.setLink.linkType = $line.attr('lineType');
                var self = toolbarManager;
                var linkType = '';
                self._setActiveBtn($(this));
                stateManager.setLink.isSetting = true;
            }],
            //历史操作
            ['click', '.historyArea>.btn', function () {
                if ($(this).hasClass('backOff')) {
                    toolbarManager.history.prev();
                    toolbarManager.historyOperCallback&&toolbarManager.historyOperCallback();
                }
                else if ($(this).hasClass('forward')) {
                    toolbarManager.history.next();
                    toolbarManager.historyOperCallback&&toolbarManager.historyOperCallback();
                }
                else if ($(this).hasClass('saveBtn')) {
                    stateManager.currentActiveIndex=null;
                    var data=canvasManager.saveTopo();
                    dataManager.saveTopoData(data);
                }
            }],
            //设置成组
            ['click', '.groupWrap.btn', function () {
                canvasManager.setNodesToGroup();
                toolbarManager.history.save();
            }],
        ],
        //设置当前选中按钮激活样式
        _setActiveBtn: function ($curObj) {
            $('.patternArea').find('.active').removeClass('active');
            $('.chooselineArea .active').removeClass('active');
            $curObj.addClass('active');

            $('#toolbar .groupWrap').addClass('hide');
        },
        //快捷键
        setShortcutKey:function () {
            var scene=stateManager.scene;
            scene.addEventListener('keyup', function (e) {
                //快捷键
                if( powerManager.isViewModel){
                    return ;
                }
                if(e.ctrlKey&&e.which==13){
                    //设置成组
                    $('.groupWrap').click();
                }
                else if(e.ctrlKey&&e.which==8){
                    //删除
                    scene.selectedElements.filter(function (e) {
                        if(e.selected){
                            e.childs && e.childs.length > 0 && e.childs.filter(function (child) {
                                scene.remove(child);
                            });
                            scene.remove(e);
                        }
                    })
                }
                else if(e.which==27){
                    $('.patternArea .toolbar-default').click();
                }
                if(stateManager.isFullScreen){
                    if (187 == e.keyCode && e.shiftKey){
                        stateManager.scene.zoomOut(0.9);
                    }else if (189 == e.keyCode && e.shiftKey){
                        stateManager.scene.zoomIn(0.9);
                    }else if (32 == e.keyCode ){
                        stateManager.scene.translateX=0;
                        stateManager.scene.translateY=0;
                        stateManager.scene.centerAndZoom();
                    }
                }
            });
        },
        /*********辅助方法*************/
        //鹰眼设定
        setEagleEye:function(b){
            var stage=stateManager.stage;
            stage.eagleEye.visible=b!=undefined?b:!stage.eagleEye.visible;
            stage.eagleEye.update();
        },
        //工具栏样式和恢复到默认状态,对外开放
        reset:function () {
            var stage = stateManager.stage;

            $('#toolbar').find('.active').each(function(){
                $(this).removeClass('active');
            });

            $('.patternArea .toolbar-default').parent().click();

            setTimeout(function(){
                toolbarManager.setEagleEye(false); //鹰眼设定
            },0);

            //隐藏组按钮
            $('#toolbar .groupWrap').addClass('hide');

            //历史数据清空，并注入初始值
            toolbarManager.history.clear();

            //第一次加载
            if(stateManager.isFirstLoad){
                stateManager.isFirstLoad=false;
            }

        },
        init: function () {
            //事件初始化
            var aEvents = this.aEvents;
            for (var i = 0; i < aEvents.length; i++) {
                $(aEvents[i][1]).on(aEvents[i][0], aEvents[i][2]);
            }
        }
    }
    //拖拽管理者
    var dragManager = {
        beforeDragMouseUp:null,
        afterDragMouseUp:null,
        dragMouseDown:function($thisClone,positionX,positionY,e){
            $thisClone.css({
                "zIndex": "99",
                'left': positionX,
                'top': positionY,
                'position':'absolute',
                'padding-left':'0',
            });
            stateManager.romveAgentLink();
        },
        dragMouseMove:null,
        dragMouseUp:function ($thisClone, mDown,e) {
            if(!$thisClone){
                return false;
            }
            if(dragManager.beforeDragMouseUp){
                var b= dragManager.beforeDragMouseUp($thisClone,e);
                if(!b){
                    if ($thisClone) {
                        $thisClone.remove();
                        $thisClone=null;
                    }
                    return false;
                }
            }


            var jsonStr=$thisClone.attr('json');
            if(jsonStr.indexOf('containerNode')>=0){
                //自定义节点
                canvasManager.createUserDefinedNodeByDrag($thisClone, mDown,e)
            }
            else{
                //简单节点
                canvasManager.createNodeByDrag($thisClone, mDown,e);
            }
            if ($thisClone) {
                $thisClone.remove();
                $thisClone=null;
            }
            toolbarManager.history.save();
            dragManager.afterDragMouseUp&&dragManager.afterDragMouseUp($thisClone,e);
        },
        /*******************************************************数据层******/

        /**********************************************************视觉层*****/

        /**********************************************************控制层*****/
        dragInit: function () {
            var $dragContainer = $('#container');

            $('#equipmentArea .dragTag').each(function () {
                $(this).dragging({
                    move: 'both', //拖动方向，x y both
                    randomPosition: false, //初始位置是否随机
                    dragContainer: $dragContainer, //可拖拽区域容器
                    dragMouseDown:dragManager.dragMouseDown,
                    dragMouseMove:dragManager.dragMouseMove,
                    stateManager: stateManager,
                    fnCreateNodeByDrag: dragManager.dragMouseUp
                });
            });
        },
        init: function () {
            this.dragInit();
        }
    }
    //画布管理者
    var canvasManager = {
        nodeEvent:{
            mouseup:null,
            mousedown:null,
            mousemove:null,
            mouseover:null,
            mouseout:null,
            dbclick:null
        },
        linkEvent:{
            mouseup:null,
            mouseover:null,
            mouseout:null,
            mousemove:null,
            dbclick:null
        },
        containerEvent:{
            mouseup:null,
            mouseover:null,
            mouseout:null,
            mousemove:null,
            dbclick:null
        },
        sceneEvent:{
            mouseup:null,
            mousedrag:null
        },
        userDefinedNodes:[],//自定义结点样例
        elementShowEffect:{
            alphaEffect:false,//开启元素渐渐浮现效果
            start:function () {
                if(this.alphaEffect){

                    stateManager.scene.childs.filter(function (p1, p2, p3) {
                        p1.alpha=0;
                        (p1.fillColor=="22,124,255")&&(p1.fillColor="255,255,255");
                        JTopo.Animate.stepByStep(p1,{alpha:1},1000,false).start();
                    });
                    JTopo.flag.allElementAlpha=1;
                }
            }
        },
        renderTopoCallback:null,
        isRunRenderCallback:true,
        afterCreateLink:null,//创建连线之前的事件
        idToNode:{},
        /******************画布处理，start***************************/
        /**
         * 创建节点、容器、自定义结点、线条时
         * id为后台提供，_id由前端提供，由于创建时，id不存在，故一定要给id赋值为_id
         * 后台拿到id可以改一下，也可不改
         * */
        //设置画布大小
        setCanvasStyle: function () {
            var oCanvas = stateManager.canvas;
            var oCanvasWrap = document.getElementById('canvasWrap');
            var oContainer = document.getElementById('container');
            fnSetCanvas();
            //随窗口变化
            window.onresize = function () {
                fnSetCanvas();
                stateManager.isFullScreen&&canvasManager.runPrefixMethodBack()
            }

            function fnSetCanvas() {
                var oContainer_w = oContainer.offsetWidth;
                var oContainer_h =650;
                var elementsBoundObj=stateManager.scene.getElementsBound();
                var elementsBoundHeight=elementsBoundObj.bottom+stateManager.scene.translateY;
                if(elementsBoundHeight>oContainer_h) {
                    oContainer_h = elementsBoundHeight + 30;
                }
                var oEquipmentArea_w =stateManager.equipmentAreaWidth;
                oCanvas.setAttribute('width', oContainer_w - oEquipmentArea_w-10);
                oCanvas.setAttribute('height', oContainer_h);
            }

        },
        //全屏
        runPrefixMethod: function (element, method) {
            var usablePrefixMethod;
            ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
                    if (usablePrefixMethod) return;
                    if (prefix === "") {
                        // 无前缀，方法首字母小写
                        method = method.slice(0, 1).toLowerCase() + method.slice(1);
                    }
                    var typePrefixMethod = typeof element[prefix + method];
                    if (typePrefixMethod + "" !== "undefined") {
                        if (typePrefixMethod === "function") {
                            usablePrefixMethod = element[prefix + method]();
                        } else {
                            usablePrefixMethod = element[prefix + method];
                        }
                    }
                }
            );
            return usablePrefixMethod;
        },
        //退出全屏
        runPrefixMethodBack:function() {
            stateManager.isFullScreen = false;

            stateManager.scene.translateX = 0;
            stateManager.scene.translateY = 0;
            stateManager.scene.centerAndZoom();
        },
        //初始化画布事件
        initCanvasEvent: function () {
            /********动态连线处理*****************/
            var self = this;
            var scene = stateManager.scene;
            var setLink = stateManager.setLink;

            var tempNodeA = new JTopo.Node('tempA');
            tempNodeA.setSize(1, 1);
            var tempNodeZ = new JTopo.Node('tempZ');
            tempNodeZ.setSize(1, 1);
            var link;

            var sceneEventObj= canvasManager.sceneEvent;
            scene.addEventListener('click', function (e) {
                if (e.button == 0) {
                    $(".contextmenu").hide();
                }
            });
            scene.addEventListener('mouseup', function (e) {
                var isInstanceofElement=e.target instanceof JTopo.Node || e.target instanceof JTopo.Container || e.target instanceof JTopo.ContainerNode;
                if (e.button == 2) {
                    // scene.remove(link);
                    return;
                }
                //开启连线模式
                if (setLink.isSetting) {
                    if (e.target != null &&  isInstanceofElement)
                    {
                        if (  stateManager.beginNode == null) {
                            //第一次点击，生成连线
                            stateManager.beginNode = e.target;
                            link = self._createLink(tempNodeA, tempNodeZ);
                            stateManager.agentLink=link;


                            scene.add(link);
                            tempNodeA.setLocation(e.x-2, e.y-2);
                            tempNodeZ.setLocation(e.x-2, e.y-2);
                        }
                        else if (  stateManager.beginNode !== e.target) {
                            //第二次点击，完成连线
                            var endNode = e.target;

                            //如果是容器节点和其内部的节点连线,或者其内部节点之间连线，则不应该连线
                            if ([  stateManager.beginNode.parentType, endNode.parentType].indexOf('containerNode') < 0) {
                                var l = self._createLink(  stateManager.beginNode, endNode);//正式连线
                                scene.add(l);

                            }
                            canvasManager.afterCreateLink&&canvasManager.afterCreateLink(stateManager.beginNode,endNode,l);
                            stateManager.beginNode = null;
                            scene.remove(link);

                            toolbarManager.history.save();
                        }
                        else {
                            stateManager.beginNode = null;
                        }
                    }
                    else {

                        link&&scene.remove(link);
                    }
                }
                sceneEventObj.mouseup&&sceneEventObj.mouseup(e);

            });
            scene.addEventListener('mousedown', function (e) {
                if ((e.target == null || e.target ===   stateManager.beginNode || e.target === link) && e.button !== 2) {
                    link && scene.remove(link);
                    stateManager.beginNode = null;
                    scene.childs.filter(function (child) {
                        child.selected = false;
                    });
                }

            });
            scene.addEventListener('mousedrag', function (e) {
                scene.findElements(function (child) {
                    if(child.elementType=='containerNode'){
                        child.paint(JTopo.flag.graphics);
                    }
                });
                sceneEventObj.mousedrag&&sceneEventObj.mousedrag(e);
            });
            scene.addEventListener('mousemove', function (e) {
                tempNodeZ.setLocation(e.x-3, e.y+3);
            });
            toolbarManager.setShortcutKey();
        },
        //复现
        renderTopo:function (data,type) {
            var self = canvasManager;
            var stage = stateManager.stage;
            if(!(type&&type=='add')){
                stage.remove(stateManager.scene);
                var scene = stateManager.scene = new JTopo.Scene(stage);
                //绑定画布事件
                self.initCanvasEvent();
            }

            var idToNode =canvasManager.idToNode;

            if (!data) {
                return;
            }
            //分开绘制是因为必须现有节点，后有容器，最后再有连线

            var nodesArr=data.nodes;
            var linksArr=data.links;
            var sceneTransX=0;
            var sceneTransY=0;
            stateManager.setFormatNodesAndLinks(linksArr,nodesArr); //获取复现和保存的时的数据格式


            //绘制节点
            for (var i = 0; i < nodesArr.length; i++)  {
                var obj = nodesArr[i];
                if(typeof obj.json=='string'){
                    obj.json =eval('('+obj.json+')');
                }
                if (obj.json.elementType=='node') {
                    idToNode[obj.id] =self._createNode(obj);
                }

                if(i==0&&obj.json.sceneTrans){

                    sceneTransX=obj.json.sceneTrans[0];
                    sceneTransY=obj.json.sceneTrans[1];
                }
            }


            //绘制自定义节点
            for (var i = 0; i < nodesArr.length; i++)  {
                var obj = nodesArr[i];
                if(obj.json.elementType=='containerNode'){

                    idToNode[obj.id] =self.createUserDefinedNode(obj);

                }
            }

            //绘制容器
            for (var i = 0; i < nodesArr.length; i++)  {
                var obj = nodesArr[i];
                if (obj.json.elementType=='container') {

                    idToNode[obj.id] = self._createContainer(obj, idToNode);
                }
            }

            //绘制线条
            for (var i = 0; i < linksArr.length; i++) {
                var obj = linksArr[i];
                if(typeof obj.json=='string'){
                    obj.json= eval('('+obj.json+')');
                }
                var link = self._createLink(idToNode[obj.from_id], idToNode[obj.to_id], obj);
                link && scene.add(link);
            }


            stateManager.scene.translateX=sceneTransX;
            stateManager.scene.translateY=sceneTransY;

            canvasManager.elementShowEffect.start();

            canvasManager.idToNode=idToNode;
            canvasManager.renderTopoCallback&&canvasManager.isRunRenderCallback&&canvasManager.renderTopoCallback();


        },
        //保存
        saveTopo:function (callback,changeData) {
            var saveNodeAttr=stateManager.formatNodes;//获取后台所需节点字段
            var saveContainerNodeAttr=stateManager.formatContainerNodes;//获取后台所需节点字段
            var saveContainerAttr=stateManager.formatContainers;//获取后台所需节点字段
            var saveLinkAttr=stateManager.formatLinks;//获取后台所需线条字段

            var nodes=[];
            var links=[];
            //拼接
            var dataArr=changeData||stateManager.scene.childs;
            dataArr.filter(function (child) {
                var isContainer=['container'].indexOf(child.elementType)>=0;
                var typeToSaveAttr={
                    "node":saveNodeAttr,
                    "containerNode":saveContainerNodeAttr,
                    "container":saveContainerAttr,
                }
                if(child.parentType != 'containerNode'&&['node','container','containerNode'].indexOf(child.elementType)>=0)
                {
                    var nodeObj={};

                    var saveAttrArr=typeToSaveAttr[child.elementType];

                    //后台所需数据
                    for(var m =0;m<saveAttrArr.length;m++){
                        var attr=saveAttrArr[m];
                        nodeObj[attr]=child[attr];
                    }

                    //前端数据
                    if(!nodeObj.json){
                        nodeObj.json={};
                    }
                    for(var m1 in child){
                        var value=child[m1];
                        if(stateManager.attrIsNeedSave(m1,value,child.elementType)){
                            nodeObj.json[m1]=value;
                        }
                        else if(isContainer&&m1=='childs'){
                            nodeObj.json.childsArr=[];
                            //保存容器的child的id到childsArr
                            for(var m2=0;m2<value.length;m2++){
                                var containerChilds=value[m2];
                                if(containerChilds.parentType=="containerNode"){
                                    //自定义节点
                                    //获取自定义结点的id
                                    var parentId=containerChilds.parentId;
                                    //判断数组中是否已经存在
                                    if(nodeObj.json.childsArr.indexOf(parentId)<0){
                                        nodeObj.json.childsArr.push(parentId);
                                    }
                                }else {
                                    //普通节点
                                    nodeObj.json.childsArr.push(containerChilds.id||containerChilds._id);
                                }
                            }
                        }
                    }
                    nodeObj.json.sceneTrans=[stateManager.scene.translateX,stateManager.scene.translateY];
                    nodeObj.json=JSON.stringify(nodeObj.json);

                    nodes.push(nodeObj);
                }
                else if(child.elementType=='link'){
                    var linkObj={};
                    for(var n =0;n<saveLinkAttr.length;n++){
                        var attr=saveLinkAttr[n];
                        if(['from_id'].indexOf(attr)>=0){
                            linkObj[attr]=child.nodeA.id;
                        }
                        else  if(['to_id'].indexOf(attr)>=0){
                            linkObj[attr]=child.nodeZ.id;
                        }

                        else{
                            linkObj[attr]=child[attr];
                        }
                    }
                    if(!linkObj.json) {
                        linkObj.json = {};
                    }
                    for(var n1 in child) {
                        var value = child[n1];
                        if(stateManager.attrIsNeedSave(n1,value,child.elementType)){
                            linkObj.json[n1] = value;
                        }
                    }

                    linkObj.json = JSON.stringify(linkObj.json);

                    links.push(linkObj);
                }
            });
            return {
                nodes:nodes,
                links:links
            };
        },
        //处理缩略
        fnDoBriefText:function (node) {
            if(node.ellipsisLength){
                var chineseNum=node.text.getChineseNum();
                var len= node.text.length;
                if(chineseNum&&(len+chineseNum>node.ellipsisLength)){
                    var subChineseNum =node.text.substring(0,node.ellipsisLength).getChineseNum();
                    if(subChineseNum){
                        node.text = node.text.substring(0, node.ellipsisLength-subChineseNum/2-1) + '...';
                    }else{
                        node.text = node.text.substring(0, node.ellipsisLength-1) + '...';
                    }
                }else if(len>node.ellipsisLength) {
                    node.text = node.text.substring(0, node.ellipsisLength-1) + '...';
                }
            }
        },

        /******************节点处理，start***************************/
        //创建拖拽后的节点，初始化节点
        createNodeByDrag: function ($thisClone, mDown, e)
        {
            var scene = stateManager.scene;
            var self = canvasManager;
            var jsonObj= eval('('+$thisClone.attr('json')+')') ;
            jsonObj.width=jsonObj.width||100;
            jsonObj.height=jsonObj.height||50;
            var subWidth = e.pageX -jsonObj.width/2- stateManager.equipmentAreaWidth-$('#equipmentArea').offset().left+stateManager.fineTuneMouseUpX;
            var subHeight= e.pageY-jsonObj.height/2 - $('#canvas').offset().top+stateManager.fineTuneMouseUpY;
            var nodeX =subWidth - scene.translateX;//松开鼠标时,元素在画布上的x坐标
            var nodeY =subHeight - scene.translateY;//松开鼠标时,元素在画布上的y 坐标

            if (subWidth > 0 && subHeight > 0 && mDown) {
                var node = new JTopo.Node();
                node.setLocation(nodeX, nodeY);
                node.font = "14px Consolas";
                node.text=$thisClone.attr('nodeName');
                node.fillColor = '255,255,255';
                node.fontColor = '85,85,85';
                node.textPosition = 'Bottom_Center';
                node.textOffsetY =5;
                node.json=jsonObj;
                if(JTopo.flag.topoImgMap){
                    node.setImage(jsonObj.imgName,'imageDataFlow');
                }else{
                    jsonObj.imgName&&node.setImage(JTopo.flag.imageUrl+jsonObj.imgName+'.png');
                }
                node.id=node._id;
                self._setNodeEvent(node);


                scene.add(node);
                for(var i in jsonObj){
                    node[i]=jsonObj[i];
                }
                //节点省略处理
                node.detailText=node.detailText||node.text;
                canvasManager.fnDoBriefText(node);

                stateManager.isNeedSave=true;
            }
            return node;
        },
        //创建节点
        _createNode: function (obj) {
            var scene = stateManager.scene;
            var self = canvasManager;
            var node = new JTopo.Node();

            //设置后台数据
            for (var i in obj) {
                node[i] = obj[i];
            }
            //设置前端元素数据
            for(var j in  obj.json){
                if(stateManager.formatNodes.indexOf(j)<0){
                    node[j]= obj.json[j];
                }
            }

            if(JTopo.flag.topoImgMap){
                node.setImage(node.imgName,'imageDataFlow');
            }else{
                node.imgName&&node.setImage(JTopo.flag.imageUrl+node.imgName+'.png');
            }



            self._setNodeEvent(node);
            scene.add(node);

            // node.setImage('./images/alertIcon2.png','setSmallImage');//setSmallImage 为设置小图标
            // JTopo.util.smallNodeFlash(node,true,true,[202,202,202],[222,81,69]);//结点,是否变色,是否闪动,底色,变色
//节点省略处理
            node.detailText=node.detailText||node.text;
            canvasManager.fnDoBriefText(node);

            return node;
        },
        //设置节点的事件
        _setNodeEvent: function (node) {
            var nodeEventObj= canvasManager.nodeEvent;
            var clickTimeHandle=null;
            node.addEventListener('mouseup', function (e) {
                clearTimeout(clickTimeHandle);
                var thisObj=this;
                clickTimeHandle = setTimeout(function () {
                    $('.contextmenu').hide();
                    toolbarManager.history.save();
                    stateManager.currentChooseElement = thisObj;
                    stateManager.currentNode = thisObj;
                    nodeEventObj.mouseup && nodeEventObj.mouseup(e);
                    stateManager.isNeedSave=true;
                },300);
            });
            node.addEventListener('mousedown', function (e) {
                stateManager.currentChooseElement = this;
                stateManager.currentNode = this;
                nodeEventObj.mousedown&&nodeEventObj.mousedown(e);

            });
            node.addEventListener('mousemove', function (e) {
                stateManager.currentChooseElement = this;
                stateManager.currentNode = this;
                nodeEventObj.mousemove&&nodeEventObj.mousemove(e);

            });
            node.addEventListener('mouseover', function (e) {
                stateManager.currentChooseElement = this;
                stateManager.currentNode = this;
                nodeEventObj.mouseover&&nodeEventObj.mouseover(e);
                //节点省略处理
                e.target.text=e.target.detailText;
            });
            node.addEventListener('mouseout', function (e) {
                $(".titleDiv").hide();
                e.target=stateManager.currentNode;
                nodeEventObj.mouseout&&nodeEventObj.mouseout(e);
                canvasManager.fnDoBriefText(e.target);
            });
            node.addEventListener('dbclick', function (e) {
                clearTimeout(clickTimeHandle);
                stateManager.currentChooseElement=this;
                stateManager.currentNode = this;
                nodeEventObj.dbclick&&nodeEventObj.dbclick(e);
            });
        },
        /******************节点处理，end***************************/

        /******自定义节点处理，start*************/
        //拖拽创建自定义节点
        createUserDefinedNodeByDrag:function($thisClone, mDown,e) {
            var jsonObj= eval('('+$thisClone.attr('json')+')') ;
            var scene=stateManager.scene;
            var obj= {
                json:jsonObj
            }
            var subWidth = e.pageX -jsonObj.width/2- stateManager.equipmentAreaWidth-$('#equipmentArea').offset().left+stateManager.fineTuneMouseUpX;
            var subHeight= e.pageY-jsonObj.height/2 - $('#canvas').offset().top+stateManager.fineTuneMouseUpY;
            obj.json.x =subWidth - scene.translateX;//松开鼠标时,元素在画布上的x坐标
            obj.json.y=subHeight - scene.translateY;//松开鼠标时,元素在画布上的y 坐标

            var nodeFn=obj.json.nodeFn;
            var userDefinedNode= canvasManager[nodeFn](obj);

            userDefinedNode.id=userDefinedNode._id;
            //设置后台数据
            for (var k in obj) {
                userDefinedNode[k] = obj[k];
            }
            //设置前端元素数据
            for(var j in  obj.json){
                if(stateManager.formatContainerNodes.indexOf(j)<0){
                    //luozheao
                    userDefinedNode[j]= obj.json[j];
                }
            }
            // !obj.id&&(obj.id=userDefinedNode._id);
            // idToNode[obj.id] =userDefinedNode;
            canvasManager._setUserDefinedNodeEvent(userDefinedNode,canvasManager['userDefinedNodeEvent_'+nodeFn])
        },
        createUserDefinedNode:function (obj) {
            var nodeFn=obj.json.nodeFn;
            var self=canvasManager;
            var userDefinedNode= self[nodeFn](obj);
            //设置后台数据
            for (var k in obj) {
                userDefinedNode[k] = obj[k];
            }
            //设置前端元素数据
            for(var j in  obj.json){
                if(stateManager.formatContainerNodes.indexOf(j)<0){
                    //luozheao
                    userDefinedNode[j]= obj.json[j];
                }
            }
            self._setUserDefinedNodeEvent(userDefinedNode,canvasManager['userDefinedNodeEvent_'+nodeFn])
            return userDefinedNode;
        },
        //设置自定义节点的事件
        _setUserDefinedNodeEvent:function (definedNode,eventObj) {
            for(var eventName in eventObj){
                var fn=eventObj[eventName];
                (function (definedNode,eventName,fn) {
                    definedNode.addEventListener(eventName, function (e) {
                        //通用事件
                        if(eventName=='mouseup'){
                            $('.contextmenu').hide();
                            toolbarManager.history.save();
                            stateManager.currentChooseElement=this;
                        }else if(eventName=='dbclick'){
                            $('.contextmenu').hide();
                            stateManager.currentChooseElement=this;
                        }
                        //自定义事件
                        fn&&fn(e);
                    });
                })(definedNode,eventName,fn);
            }
        },
        /******自定义节点处理，end*************/

        /******************容器处理，start***************************/
        //设置节点成容器,初始化容器
        setNodesToGroup: function (nodeArr,jsonObj) {
            var scene = stateManager.scene;
            var eleArr = nodeArr?nodeArr:scene.selectedElements.filter(function (obj) {
                return (obj.elementType == 'node'||obj.type=='node');
            });
            if (eleArr.length > 0) {
                var container = new JTopo.Container('');
                container.textPosition = 'Top_Bottom';
                container.fontColor = '255,255,255';
                container.font = '16px 微软雅黑';
                container.fillColor = '79,164,218';
                container.alpha=0;
                container.textAlpha=1;
                container.shadowBlur =5;
                container.shadowColor = "rgba(43,43,43,0.5)";
                container.borderColor='108,208,226';
                container.borderWidth=1;
                container.borderDashed=false;//边框成虚线，一定要设置borderRadius大于0
                container.borderRadius = 5; // 圆角
                container.id=container._id;
                container.type='container';
                for(var k in jsonObj){
                    container[k]=jsonObj[k];
                }

                for (var i = 0; i < eleArr.length; i++) {
                    eleArr[i].selected = false;
                    container.add(eleArr[i]);
                }

                this._setGroupEvent(container);
                scene.add(container);
                stateManager.isNeedSave=true;
            }
        },
        //创建容器
        _createContainer: function (obj, idToNode) {
            var stage = stateManager.stage;
            var scene = stateManager.scene;
            var self = canvasManager;
            var container = new JTopo.Container('');
            container.type='container';
            //设置后台数据
            for (var i in obj) {
                container[i] = obj[i];
            }

            //设置前端元素数据
            for(var j in  obj.json){
                if(stateManager.formatNodes.indexOf(j)<0){
                    container[j]= obj.json[j];
                }
                if (j == 'childsArr') {
                    for (var k = 0; k < obj.json[j].length; k++) {
                        var childObj=idToNode[obj.json[j][k]];
                        if(childObj.elementType=="containerNode"){
                            childObj.childs.filter(function (p1, p2, p3) {
                                container.add(p1);
                            })
                        }else{
                            container.add(childObj);
                        }
                    }
                }
            }


            self._setGroupEvent(container);
            scene.add(container);
            return container;
        },
        //设置容器的事件
        _setGroupEvent: function (container) {
            var containerEventObj= canvasManager.containerEvent;
            container.addEventListener('mouseup', function (e) {
                $('.contextmenu').hide();
                toolbarManager.history.save();
                stateManager.currentContainer = this;
                stateManager.currentChooseElement=this;
                containerEventObj.mouseup&&containerEventObj.mouseup(e);
            });
            container.addEventListener('mouseover', function (e){
                stateManager.currentContainer = this;
                stateManager.currentChooseElement=this;
                containerEventObj.mouseover&&containerEventObj.mouseover(e);
            });
            container.addEventListener('mouseout', function (e){
                e.target=stateManager.currentContainer;
                containerEventObj.mouseout&&containerEventObj.mouseout(e);
            });
            container.addEventListener('mousemove', function (e){
                stateManager.currentContainer = this;
                stateManager.currentChooseElement=this;
                containerEventObj.mousemove&&containerEventObj.mousemove(e);
            });
            container.addEventListener('dbclick', function (e){
                stateManager.currentContainer = this;
                stateManager.currentChooseElement=this;

                containerEventObj.dbclick&&containerEventObj.dbclick(e);
            });


        },
        /******************容器处理，end***************************/

        /******************线条处理，start***************************/
        //创建节点间的连线
        _createLink: function (sNode, tNode,linkObj) {
            var link;
            var slinkType= null;
            if(linkObj){
                slinkType=linkObj.json.linkType;
            }
            var linkType = slinkType ? slinkType : (stateManager.setLink.linkType||'arrow');
            if (!sNode || !tNode) {
                return;
            }

            if (linkType == 'Link') {
                //实线
                link = new JTopo.Link(sNode, tNode);
            }
            else if (linkType == 'arrow') {
                //箭头
                link = new JTopo.Link(sNode, tNode);
                link.arrowsRadius = 10; //箭头大小
            }
            else if (linkType == 'dArrow') {
                //双箭头
                link = new JTopo.Link(sNode, tNode);
                link.arrowsRadius = 10; //箭头大小
            }
            else if (linkType == 'dashed') {
                //虚线
                link = new JTopo.Link(sNode, tNode);
                link.dashedPattern = 5;
                // link.arrowsRadius = 10; //箭头大小
            }
            else if (linkType == 'curve') {
                //曲线
                link = new JTopo.CurveLink(sNode, tNode);
            }
            else if (linkType == 'flexional') {
                //折线
                link = new JTopo.FlexionalLink(sNode, tNode);
                link.direction = 'horizontal'; //horizontal水平,vertical垂直
                link.arrowsRadius = 10; //箭头大小
                link.flexionalRadius=0;
                link.offsetGap=50;
            }
            else if (linkType == 'flow') {
                link = new JTopo.Link(sNode, tNode);
                link.arrowsRadius = 10; //箭头大小
                link.PointPathColor = "rgb(237,165,72)";//连线颜色
            }
            else if (linkType == 'userDefine') {
                link = new JTopo.Link(sNode, tNode);
                link.arrowsRadius = 10; //箭头大小
                link.PointPathColor = "rgb(237,165,72)";//连线颜色
            }
            if (link) {
                this._setLinkEvent(link);
                link.linkType = linkType;
                link.lineWidth =0.7 ;
                link.strokeColor = '43,43,43';
                link.linkConnectType ='toBorder';
                link.bundleGap=15;
                link.id=link._id;
                link.type='link';
                stateManager.isNeedSave=true;
                if(linkObj){
                    for(var i in linkObj){
                        link[i]=linkObj[i]
                    }
                    for(var j in linkObj.json){
                        if(stateManager.formatLinks.indexOf(j)<0){
                            link[j]=linkObj.json[j]
                        }
                    }
                }

            }
            return link;
        },
        //设置线条事件
        _setLinkEvent: function (link) {
            var linkEventObj=canvasManager.linkEvent;
            link.addEventListener('mouseup', function (e) {
                $('.contextmenu').hide();
                stateManager.currentLink = this;
                stateManager.currentChooseElement=this;
                toolbarManager.history.save();
                linkEventObj.mouseup&&linkEventObj.mouseup(e);
                stateManager.isNeedSave=true;
            });
            link.addEventListener('mousemove', function (e) {
                stateManager.currentLink = this;
                stateManager.currentChooseElement=this;
                linkEventObj.mousemove&&linkEventObj.mousemove(e);
            });
            link.addEventListener('mouseover', function (e) {
                stateManager.currentLink = this;
                stateManager.currentChooseElement=this;
                linkEventObj.mouseover&&linkEventObj.mouseover(e);
            });
            link.addEventListener('mouseout', function (e) {
                e.target=  stateManager.currentLink;
                linkEventObj.mouseout&&linkEventObj.mouseout(e);
            });
            link.addEventListener('dbclick', function (e) {
                stateManager.currentLink = this;
                stateManager.currentChooseElement=this;
                linkEventObj.dbclick&&linkEventObj.dbclick(e);
            });
        },
        /******************线条处理，end***************************/

        init: function () {
            var canvas = stateManager.canvas = document.getElementById('canvas');
            var stage = stateManager.stage = new JTopo.Stage(canvas);
            var scene = stateManager.scene = new JTopo.Scene(stage);
            canvasManager.userDefinedNodes.filter(function (p1, p2, p3) {
                canvasManager[p1.fnName]=p1.fn;
                canvasManager['userDefinedNodeEvent_'+p1.fnName]=p1.event;
            })
            canvasManager.setCanvasStyle();
            canvasManager.initCanvasEvent(); //canvas事件初始化
        }
    }
    //数据管理者
    var dataManager={
        /*******数据层******/
        getTopoData:function () {},
        /*******显示层******/
        showTopoData:function (data) {
            canvasManager.renderTopo(data);
            toolbarManager.history.save();
        },
        /*******控制层******/
        setTopoData:function (data) {
            var self = dataManager;
            var showTopoData = self.showTopoData;
            if (data) {
                self.showTopoData(data);
            } else {
                self.getTopoData(showTopoData);
            }
        },
        saveTopoData:function () {},
        init:function () {
            dataManager.setTopoData();
        }
    }
    //节点排列管理者
    var nodesRankManager={
        /****状态值*****/
        dataJson:{},//用于存储画布数据
        nodesArr:[],
        linksArr:[],
        nodesRankArr:[],//二维数组,用于根据节点关系,存储节点
        maxLength:0,//最长一维数组的长度
        subWidth:0,
        subHeight:0,
        originX:0,
        originY:0,
        subRadius:0,
        nodePositionJson:{},
        nodeNoRankPositionJson:{},//没有用于自动排列的节点位置
        nodesRankIdArr:[],//用于自动排列节点id
        nodesNoRankIdArr:[],//没有用于自动排列的节点id
        isRankTag:false,//判断是否是手动触发排序
        /****数据层*****/
        /****显示层*****/
        /****控制层*****/
        setNodesRank:function (dataObj,rootNodeId,params,type) {
            nodesRankManager.init()//清空所有数据
            var dataJson=dataObj;
            if(dataJson){
                nodesRankManager.dataJson = dataJson
            }else{
                nodesRankManager.isRankTag=true;
                dataJson=canvasManager.saveTopo();//当dataObj不存在时,调用画布以后的数据
            }

            nodesRankManager.nodesArr = dataJson.nodes;
            nodesRankManager.linksArr = dataJson.links;
            nodesRankManager.originX = params.originX;
            nodesRankManager.originY = params.originY;
            this.getArrTwoDimensional([rootNodeId]);


            if(type=='tree'){
                nodesRankManager.subWidth = params.subWidth;
                nodesRankManager.subHeight = params.subHeight;
                nodesRankManager.rankTree();
            }
            else if(type=='ring'){
                nodesRankManager.subRadius = params.subRadius;

                nodesRankManager.rankRing();
            }
            if(dataObj){
                nodesRankManager.rankNoRelatedNodes(); //设置跟根节点不产生关系的节点位置
            }
            nodesRankManager.setNodesPosition();//设置自动排列节点的位置


        },
        //选中树
        chooseTree:function(rootNodeId){
            nodesRankManager.init()//清空所有数据

            var  dataJson=canvasManager.saveTopo();//当dataObj不存在时,调用画布以后的数据
            nodesRankManager.nodesArr = dataJson.nodes;
            nodesRankManager.linksArr = dataJson.links;
            this.getArrTwoDimensional([rootNodeId]);

            stateManager.scene.childs.forEach(function(p){
                if(nodesRankManager.nodesRankIdArr.indexOf(p.id)>=0){
                    p.selected=true;
                    stateManager.scene.addToSelected(p);
                }
            });

        },
        /****辅助方法*****/
        //获取关联节点id
        getRelatedNodesId:function(nodesIdArr){
            var linksArr=nodesRankManager.linksArr;
            var fatherNodesArr=nodesRankManager.nodesRankArr.length>1? nodesRankManager.nodesRankArr[nodesRankManager.nodesRankArr.length-2]:[];
            var thisNodesArr= nodesRankManager.nodesRankArr.length>0?nodesRankManager.nodesRankArr[nodesRankManager.nodesRankArr.length-1]:[];
            var targetNodesIdArr=[];
            linksArr.forEach(function(p){
                if(nodesIdArr.indexOf(p.from_id)>=0){
                    if(targetNodesIdArr.indexOf(p.to_id)<0&&fatherNodesArr.indexOf(p.to_id)<0&&thisNodesArr.indexOf(p.to_id)<0){
                        //父层不包括,本层不包括
                        targetNodesIdArr.push(p.to_id);
                    }
                }else if(nodesIdArr.indexOf(p.to_id)>=0){
                    if(targetNodesIdArr.indexOf(p.from_id)<0&&fatherNodesArr.indexOf(p.from_id)<0&&thisNodesArr.indexOf(p.from_id)<0) {
                        //父层不包括,本层不包括
                        targetNodesIdArr.push(p.from_id);
                    }
                }
            });
            return targetNodesIdArr;
        },
        //获取金字塔二维数组
        getArrTwoDimensional:function(nodesIdArr){
            if(nodesIdArr.length>0){
                if(nodesIdArr.length>nodesRankManager.maxLength){
                    nodesRankManager.maxLength=nodesIdArr.length;
                }

                nodesRankManager.nodesRankArr.push(nodesIdArr);
                nodesRankManager.nodesRankIdArr=nodesRankManager.nodesRankIdArr.concat(nodesIdArr);//用数组装下所有id
                var arr=this.getRelatedNodesId(nodesIdArr);
                this.getArrTwoDimensional(arr);
            }
        },
        //获取节点坐标,树形
        rankTree:function(){

            var maxLength=nodesRankManager.maxLength;
            var width=nodesRankManager.subWidth;
            var height=nodesRankManager.subHeight;
            var originX=nodesRankManager.originX;
            var originY=nodesRankManager.originY;


            nodesRankManager.nodesRankArr.forEach(function (oneDimensionalArr,index1) {
                var onoDimensionalLength=oneDimensionalArr.length;
                oneDimensionalArr.forEach(function (id,index2) {
                    nodesRankManager.nodePositionJson[id]={
                        x: originX+(((maxLength-onoDimensionalLength)/2)+index2)*width  ,
                        y: originY+index1*height,
                    }
                });
            });


        },
        //获取节点坐标,环形
        rankRing:function(){
            var subRadius=nodesRankManager.subRadius;
            var originX=nodesRankManager.originX;
            var originY=nodesRankManager.originY;

            nodesRankManager.nodesRankArr.forEach(function (oneDimensionalArr,index1) {
                var onoDimensionalLength=oneDimensionalArr.length;
                var subPI=360/onoDimensionalLength;
                oneDimensionalArr.forEach(function (id,index2) {
                    var isV=index2%2?0:(Math.PI/4);
                    nodesRankManager.nodePositionJson[id]={
                        x: originX+ subRadius*index1*Math.cos((0+subPI*index2)*Math.PI/180) ,
                        y:originY+subRadius*index1*Math.sin((0+subPI*index2)*Math.PI/180)
                    }
                });
            });

            console.log(nodesRankManager.nodePositionJson);
        },
        //设置节点坐标
        setNodesPosition:function(){
            var maxLength=nodesRankManager.maxLength;
            var width=nodesRankManager.subWidth;

            stateManager.scene.childs.forEach(function(p){
                var obj=nodesRankManager.nodePositionJson[p.id];
                var obj2=nodesRankManager.nodeNoRankPositionJson[p.id];
                if(obj){

                    if(nodesRankManager.isRankTag){
                        //手动触发排列
                        p.x=obj.x-(maxLength/2)*width;
                    }
                    else{
                        p.x=obj.x;
                    }
                    p.y=obj.y;
                    p.selected=true;
                    stateManager.scene.addToSelected(p);
                }
                else if(obj2){
                    p.x=obj2.x;
                    p.y=obj2.y;

                }
            });
        },
        //设置其他节点的排列
        rankNoRelatedNodes:function(){
            nodesRankManager.nodesArr.forEach(function (p) {
                if(nodesRankManager.nodesRankIdArr.indexOf(p.id)<0){
                     nodesRankManager.nodesNoRankIdArr.push(p.id);

                }
            });
            nodesRankManager.nodesNoRankIdArr.forEach(function (id,index) {
                nodesRankManager.nodeNoRankPositionJson[id]={
                    x:nodesRankManager.originX+index*nodesRankManager.subWidth/2,
                    y:nodesRankManager.originY-nodesRankManager.subHeight/2,
                }
            });
        },
        init:function() {
            nodesRankManager.dataJson = {};//用于存储画布数据
            nodesRankManager.nodesArr = [];
            nodesRankManager.linksArr = [];
            nodesRankManager.nodesRankArr = [];//二维数组;用于根据节点关系;存储节点
            nodesRankManager.maxLength = 0;//最长一维数组的长度
            nodesRankManager.subWidth = 0;
            nodesRankManager.subHeight = 0;
            nodesRankManager.originX = 0;
            nodesRankManager.originY = 0;
            nodesRankManager.subRadius = 0;
            nodesRankManager.nodePositionJson = {};
            nodesRankManager.nodeNoRankPositionJson = {};//没有用于自动排列的节点位置
            nodesRankManager.nodesRankIdArr = [];//用于自动排列节点id
            nodesRankManager.nodesNoRankIdArr = [];//没有用于自动排列的节点id
            nodesRankManager.isRankTag=false;
        }
    }

    var topoManager={
        stateManager:stateManager,
        powerManager:powerManager,
        popupManager:popupManager,
        toolbarManager:toolbarManager,
        dragManager:dragManager,
        canvasManager:canvasManager,
        dataManager:dataManager,
        nodesRankManager:nodesRankManager,
        //各模块初始化
        init:function () {
            stateManager.init();
            powerManager.init();
            canvasManager.init();
            dragManager.init();
            toolbarManager.init();
            nodesRankManager.init();
        }
    }
    //test123
    return topoManager;
});


