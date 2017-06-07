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
 * */

//状态管理者
var stateManager = {
    stage: {},
    scene: {},
    canvas: {},
    equipmentAreaWidth:240,
    setLink: { //线条类型
        isSetting: false,
        linkType: ''
    },
    curExpandNode:null,//目录树样式设置
    currentChooseElement:null,
    currentNode: null,//当前节点
    currentContainerNode: null,//当前容器节点
    currentContainer: null,//当前容器
    currentLink: null,//当前线条
    currentTopo: [], //当前树节点的拓扑图，包含物理、逻辑、系统、业务流程 ，analysisTopo会给它赋值
    currentActiveIndex:null,//当前选中拓扑图的序号
    currentTreeNode:null,//当前选中的树节点
    isFirstLoad:true,//初次加载页面
    isLocalhost:window.location.href.indexOf('localhost:')>=0,//判断是否属于本地环境
    isFromParentTree:false,//点击系统视图节点，触发子拓扑图打开，并切换到系统视图或逻辑拓扑
    isFullScreen:false,//当前是否全屏的状态
    formatNodes:[],//复现与保存时，读取后台nodes数组中对象的属性
    formatLinks:[],//复现与保存时，读取后台links数组中对象的属性
    //获取复现与保存时，所需读取后台links、nodes数组中对象的属性
    setFormatNodesAndLinks:function (linksArr,nodesArr) {
        sugar(linksArr,stateManager.formatLinks);
        sugar(nodesArr,stateManager.formatNodes);
        function  sugar(arr,targetArr) {
            if(arr.length>0){
                var obj=arr[0];
                for(var i in obj){
                    targetArr.push(i);
                }
            }
        }
    },
    //判断对象中的属性是否应该保存
    attrIsNeedSave:function (attr,value,elementType) {
        var attrArr=['propertiesStack','serializedProperties','animateNode','childs','image','inLinks','messageBus','outLinks','json','nodeA','nodeZ','selectedLocation'];
        if(elementType=='containerNode'){
            attrArr.push('childs');
        }
        if(attrArr.indexOf(attr)>=0||typeof value =='function' ){
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
                scene.centerAndZoom();
            }
            else if ($zoom.hasClass('toolbar-overview')) {
                var screenWidth= window.screen.width;
                var screenHeight= window.screen.height;
                //全屏
                canvasManager.runPrefixMethod(canvas, "RequestFullScreen");
                setTimeout(function(){
                    setCanvasScreen();
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
            }
            else if ($(this).hasClass('forward')) {
                toolbarManager.history.next();
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
    dragMouseDown:function () {
        //鼠标按下时的处理
        alert('请改写dragMouseDown');
    },
    dragMouseUp:function () {
        //鼠标松开时的处理
        alert('请改写dragMouseUp');
    },
    /*******************************************************数据层******/

    /**********************************************************视觉层*****/

    /**********************************************************控制层*****/
     dragInit: function () {
        var $dragContainer = $('#container');
        var fnCreateNodeOrContainerNodeByDrag = function ($thisClone, mDown, thisWidth, thisHeight, pageX, pageY) {
            dragManager.dragMouseUp($thisClone, mDown, thisWidth, thisHeight, pageX, pageY);
            toolbarManager.history.save();
        };
        $('#equipmentArea .dragTag').each(function () {
            $(this).dragging({
                move: 'both', //拖动方向，x y both
                randomPosition: false, //初始位置是否随机
                dragContainer: $dragContainer, //可拖拽区域容器
                dragMouseDown:dragManager.dragMouseDown,
                stateManager: stateManager,
                fnCreateNodeByDrag: fnCreateNodeOrContainerNodeByDrag,  //拖拽后生成节点
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
        mousemove:null,
        mouseout:null,
        dbclick:null
    },
    linkEvent:{
        mouseup:null,
        mouseover:null,
        mouseout:null,
        mousemove:null
    },
    containerEvent:{
        mouseup:null,
        mouseover:null,
        mouseout:null,
        mousemove:null,
        dbclick:null
    },
    userDefinedNodes:[],//自定义结点样例

    /******************画布处理，start***************************/
    /**
     * 创建节点、容器、自定义结点、线条时
     * id为后台提供，_id由前端提供，由于创建时，id不存在，故一定要给id赋值为_id
     * 后台拿到id可以改一下，也可不改
     * */
    //设置画布大小
    setCanvasStyle: function () {
        var oCanvas = stateManager.canvas;
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
            var oEquipmentArea_w =256;
            oCanvas.setAttribute('width', oContainer_w - oEquipmentArea_w);
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


        var beginNode = null;
        var tempNodeA = new JTopo.Node('tempA');
        tempNodeA.setSize(1, 1);
        var tempNodeZ = new JTopo.Node('tempZ');
        tempNodeZ.setSize(1, 1);
        var link;

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

                    if (beginNode == null) {
                        //第一次点击，生成连线

                        beginNode = e.target;
                        link = self._createLink(tempNodeA, tempNodeZ);
                        scene.add(link);
                        tempNodeA.setLocation(e.x, e.y);
                        tempNodeZ.setLocation(e.x, e.y);

                    }
                    else if (beginNode !== e.target) {
                        //第二次点击，完成连线
                        var endNode = e.target;
                        //如果是容器节点和其内部的节点连线,或者其内部节点之间连线，则不应该连线
                        if([beginNode.parentType,endNode.parentType].indexOf('containerNode')<0){
                            var l = self._createLink(beginNode, endNode);//正式连线
                            scene.add(l);
                        }
                        beginNode = null;
                        scene.remove(link);

                        toolbarManager.history.save();
                    }
                    else {
                        beginNode = null;
                    }
                }

                else {

                    link&&scene.remove(link);
                }
            }
        });
        scene.addEventListener('mousedown', function (e) {
            if ((e.target == null || e.target === beginNode || e.target === link) && e.button !== 2) {
                link && scene.remove(link);
                beginNode = null;
                scene.childs.filter(function (child) {
                    child.selected = false;
                });
            }
        });
        scene.addEventListener('mousedrag', function (e) {
            $(".titleDiv").hide();
        });
        scene.addEventListener('mousemove', function (e) {

            tempNodeZ.setLocation(e.x, e.y);
        });
        scene.addEventListener('keyup', function (e) {
            //快捷键
            // console.log(e.which);
            switch (e.which) {
                //删除选中
                case 8:
                    return;
                    scene.selectedElements.filter(function (e) {
                        if(e.selected){
                            e.childs && e.childs.length > 0 && e.childs.filter(function (child) {
                                scene.remove(child);
                            });
                            scene.remove(e);
                        }
                    })
                    break;
                //esc，恢复默认
                case 27:
                    $('.patternArea .toolbar-default').click();
                    break;
                default:
                    ;
            };
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
    //复现
    renderTopo:function (data) {
        var self = canvasManager;
        var stage = stateManager.stage;
        stage.remove(stateManager.scene);
        var scene = stateManager.scene = new JTopo.Scene(stage);

        var idToNode = {};
        //绑定画布事件
        self.initCanvasEvent();
        if (!data) {
            return;
        }
        //分开绘制是因为必须现有节点，后有容器，最后再有连线

        var nodesArr=data.nodes;
        var linksArr=data.links;
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
        }

        //绘制容器、自定义节点
        for (var i = 0; i < nodesArr.length; i++)  {
            var obj = nodesArr[i];
            if (obj.json.elementType=='container') {
                idToNode[obj.id] = self._createContainer(obj, idToNode);
            }
            else if(obj.json.elementType=='containerNode'){
                var nodeFn=obj.json.nodeFn;
                var userDefinedNode= self[nodeFn](obj);
                idToNode[obj.id] =userDefinedNode;
                self._setUserDefinedNodeEvent(userDefinedNode,canvasManager['userDefinedNodeEvent_'+nodeFn])
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

    },
    //保存
    saveTopo:function () {
        var saveNodeAttr=stateManager.formatNodes;//获取后台所需节点字段
        var saveLinkAttr=stateManager.formatLinks;//获取后台所需线条字段
        var nodes=[];
        var links=[];
        //拼接
        stateManager.scene.childs.filter(function (child) {
            var isContainer=['container'].indexOf(child.elementType)>=0;
            if(child.parentType != 'containerNode'&&['node','container','containerNode'].indexOf(child.elementType)>=0)
            {
                var nodeObj={};
                //后台所需数据
                for(var m =0;m<saveNodeAttr.length;m++){
                    var attr=saveNodeAttr[m];
                    nodeObj[attr]=child[attr];
                    // if(['id'].indexOf(attr)>=0&&!child.id){
                    //     nodeObj[attr]=child._id;
                    // }
                }

                //前端数据
                if(!nodeObj.json){
                    nodeObj.json={};
                }
                for(var m1 in child){
                    var value=child[m1];
                    if(stateManager.attrIsNeedSave(m1,value,child.elementType)){
                        nodeObj.json[m1]=value;
                    }else if(isContainer&&m1=='childs'){
                        nodeObj.json.childsArr=[];
                        //保存容器的child的id到childsArr
                        for(var m2=0;m2<value.length;m2++){
                            nodeObj.json.childsArr.push(value[m2].id);
                        }
                    }
                }

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
                    // else  if(['id'].indexOf(attr)>=0&&!child.id){
                    //     linkObj[attr]=child._id;
                    // }
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


    /******************节点处理，start***************************/
    //创建拖拽后的节点，初始化节点
    createNodeByDrag: function ($thisClone, mDown, thisWidth, thisHeight, pageX, pageY)
    {
        var scene = stateManager.scene;
        var self = canvasManager;
        var subWidth = pageX - stateManager.equipmentAreaWidth;
        var subHeight = pageY - 80;
        var offsetX=$thisClone.offsetX||0;
        var offsetY=$thisClone.offsetY||0;
        var nodeX =offsetX+subWidth - scene.translateX;//松开鼠标时,元素在画布上的x坐标
        var nodeY =offsetY+pageY - scene.translateY - 80;//松开鼠标时,元素在画布上的y 坐标

        var nodeName = 'node_name';
        var nodeWidth = thisWidth;
        var nodeHight = thisHeight;
        var imgName = '';
        var flowIconTag=$thisClone.attr('flowIconTag');//表示属于流程图标
        var isOtherRectIcon=['android','apple','IE'].indexOf($thisClone.attr('imgname'))>=0;//安卓苹果IE图标

        if ($thisClone) {
            nodeName = $thisClone.attr('nodeName');
            imgName = $thisClone.attr('imgName');
            if(flowIconTag){
                nodeWidth=2.923*parseFloat(nodeHight);
            }else if(isOtherRectIcon){
                nodeWidth=(222/102)*parseFloat(nodeHight);
            }
            $thisClone.remove();
            $thisClone=null;
        }

        if (subWidth > 0 && subHeight > 0 && mDown) {
            var node = new JTopo.Node(nodeName);
            node.setLocation(nodeX, nodeY);
            node.font = "14px Consolas";
            node.fillColor = '255,255,255';
            node.fontColor = flowIconTag?'255,255,255':'85,85,85';
            if(nodeName=='开始'||nodeName=='结束'){
                node.fontColor = '85,85,85';
            }
            node.textPosition = 'Bottom_Center';
            node.textOffsetY = flowIconTag?-34:5;

            var url='./images/'+imgName+'_g.png';
            node.setImage(url);
            node.imgName = imgName;
            node.id=node._id;
            node.setSize(nodeWidth, nodeHight);
            self._setNodeEvent(node);
            scene.add(node);

        }
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
        node.imgName&&node.setImage('./images/'+node.imgName+'_g.png');
        self._setNodeEvent(node);
        scene.add(node);
        return node;
    },
    //设置节点的事件
    _setNodeEvent: function (node) {
        var nodeEventObj= canvasManager.nodeEvent;
        node.addEventListener('mouseup', function (e) {
            toolbarManager.history.save();
            stateManager.currentChooseElement=this;
            stateManager.currentNode = this;
            nodeEventObj.mouseup&&nodeEventObj.mouseup(e);
        });
        node.addEventListener('mousemove', function (e) {
            nodeEventObj.mousemove&&nodeEventObj.mousemove(e);
        });
        node.addEventListener('mouseout', function (e) {
            $(".titleDiv").hide();
            nodeEventObj.mouseout&&nodeEventObj.mouseout(e);
        });
        node.addEventListener('dbclick', function (e) {

            stateManager.currentChooseElement=this;
            stateManager.currentNode = this;
            nodeEventObj.dbclick&&nodeEventObj.dbclick(e);
        });
    },
    /******************节点处理，end***************************/

    /******自定义节点处理，start*************/
    //设置自定义节点的事件
    _setUserDefinedNodeEvent:function (definedNode,eventObj) {
        for(var eventName in eventObj){
            var fn=eventObj[eventName];
            (function (definedNode,eventName,fn) {
                definedNode.addEventListener(eventName, function (e) {
                    //通用事件
                    if(eventName=='mouseup'){

                        toolbarManager.history.save();
                        stateManager.currentChooseElement=this;
                    }else if(eventName=='dbclick'){
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
                if (obj.elementType == 'node') {
                    return obj;
                }
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
            for(var k in jsonObj){
                container[k]=jsonObj[k];
            }

            for (var i = 0; i < eleArr.length; i++) {
                eleArr[i].selected = false;
                container.add(eleArr[i]);
            }

            this._setGroupEvent(container);
            scene.add(container);
        }
    },
    //创建容器
    _createContainer: function (obj, idToNode) {
        var stage = stateManager.stage;
        var scene = stateManager.scene;
        var self = canvasManager;
        var container = new JTopo.Container('');



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
                    container.add(idToNode[obj.json[j][k]]);
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
          toolbarManager.history.save();
            stateManager.currentContainer = this;
            stateManager.currentChooseElement=this;
            containerEventObj.mouseup&&containerEventObj.mouseup(e);
        });
        container.addEventListener('mouseover', function (e){

            containerEventObj.mouseover&&containerEventObj.mouseover(e);
        });
        container.addEventListener('mouseout', function (e){

            containerEventObj.mouseout&&containerEventObj.mouseout(e);
        });
        container.addEventListener('mousemove', function (e){
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
        }
        else if (linkType == 'curve') {
            //曲线
            link = new JTopo.CurveLink(sNode, tNode);
        }
        else if (linkType == 'flexional') {
            //折线
            link = new JTopo.FlexionalLink(sNode, tNode);
            link.direction = 'horizontal'; //horizontal水平,vertical垂直
        }
        else if (linkType == 'flow') {
            link = new JTopo.Link(sNode, tNode);
            link.arrowsRadius = 10; //箭头大小
            link.PointPathColor = "rgb(237,165,72)";//连线颜色
        }
        if (link) {
            this._setLinkEvent(link);
            link.linkType = linkType;
            link.strokeColor = '216,223,230';
            link.id=link._id;
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
            stateManager.currentLink = this;
            stateManager.currentChooseElement=this;
            toolbarManager.history.save();
            linkEventObj.mouseup&&linkEventObj.mouseup(e);
        });
        link.addEventListener('mousemove', function (e) {
            linkEventObj.mousemove&&linkEventObj.mousemove(e);
        });
        link.addEventListener('mouseover', function (e) {
            linkEventObj.mouseover&&linkEventObj.mouseover(e);
        });
        link.addEventListener('mouseout', function (e) {
            linkEventObj.mouseout&&linkEventObj.mouseout(e);
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
    setTopoData:function () {
        var self=dataManager;
        var showTopoData=self.showTopoData;
        self.getTopoData(showTopoData);
    },
    saveTopoData:function () {},
    init:function () {
        dataManager.setTopoData();
    }
}

var topoManager={
    init:function () {
        stateManager.init();
        canvasManager.init();
        dragManager.init();
        toolbarManager.init();
        dataManager.init();
    }
}
