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
    isNeedSave:false,//判断切换拓扑图是否需要保存数据
    isLocalhost:window.location.href.indexOf('localhost:')>=0,//判断是否属于本地环境
    isFromParentTree:false,//点击系统视图节点，触发子拓扑图打开，并切换到系统视图或逻辑拓扑
    isFullScreen:false,//当前是否全屏的状态
    customAttr: [//节点、容器、线条通用保存属性
        "id", "fillAlarmNode","fillAlarmForChangeColor",
        "_id","alarm",
        "originName","nodeFn","alias",
        "equipmentType","busi_id","busi_type",
        "elementType", "x", "y", "width", "height", "visible", "alpha",
        "rotate", "scaleX", "scaleY", "strokeColor", "fillColor",
        "shadow","shadowBlur", "shadowColor", "shadowOffsetX", "shadowOffsetY",
        "transformAble", "zIndex", "dragable",
        "selected", "showSelected", "isMouseOver",
        "text", "font", "fontColor", "textPosition",
        "textOffsetX", "textOffsetY",
        "borderAlpha","borderColor","borderRadius","borderDashed","borderWidth","node_type","subTypeName"
    ],
    saveNodeAttr: ["subTypeName","node_type","imgName",  "textBreakNumber", "textLineHeight", "parentType","remarks","sceneTransX","sceneTransY","status","keepChangeColor"],
    saveContainerNodeAttr: ["subTypeName","node_type", "childsArr","childsNodeArr", "childDragble"],
    saveContainerAttr: ["subTypeName","node_type", "childsArr","childDragble","textAlpha"],
    saveLinkAttr: ["nodeAId", "nodeZId", "linkType"],//linkType线条样式与动态效果，linkConnectType连接到节点的边缘
    history: {
        arr: [],
        curIndex: -1
    },
    scrollHeight:0,

    /**********辅助方法**********/
     //获取链接中的参数，以后提到核心代码中
     getUrlParam:function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
},
     //本地环境下的特殊处理,比如本地环境下的一级目录过长，则隐藏掉
     setStateUnderLocalHost:function() {
         //顶部一级目录过长，则在本地隐藏部分用不上的目录,8888是我的端口
         if (this.isLocalhost) {

         }
     },
     init: function () {
        var self=this;
        //合并数组
        this.saveNodeAttr.push.apply(this.saveNodeAttr, this.customAttr);
        this.saveContainerNodeAttr.push.apply(this.saveContainerNodeAttr, this.customAttr);
        this.saveContainerAttr.push.apply(this.saveContainerAttr, this.customAttr);
        this.saveLinkAttr.push.apply(this.saveLinkAttr, this.customAttr);

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
        ['click', '.eyesWrap  ', function () {
            toolbarManager.setEagleEye();
        }],

        //搜索
        ['click', '.searchWrap>.btn', function () {
            var text = $('#search_input').val().trim().toLowerCase();
            var scene = stateManager.scene;
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
            var fnRenderCanvasByJson = canvasManager.renderCanvasByJson;
            var fnGetCanvasToJson = canvasManager.getCanvasToJson;
            if ($(this).hasClass('backOff')) {
                //后退
                var curIndex = stateManager.history.curIndex - 1;
                if (curIndex >= -1) {
                    var arr = stateManager.history.arr[curIndex];
                    if(arr&&arr.length>0){
                        var oldChild=stateManager.scene.childs;
                        stateManager.history.curIndex = curIndex;
                        fnRenderCanvasByJson(arr);
                        console.log(arr)
                        var newChild=stateManager.scene.childs;
                        if(oldChild.length>0&&oldChild.length>newChild.length){
                            var arr=[];
                            var index='';
                            $.each(oldChild,function(i,item){
                                arr.push(item.busi_id+'_'+item.busi_type)
                            })
                            var isTrue=false;
                            $.each(arr,function(i,item){
                                if(newChild.length>0) {
                                    $.each(newChild, function (a, val) {
                                        if (item == (val.busi_id + '_' + val.busi_type)) {
                                            isTrue = false;
                                        } else {
                                            isTrue = true;
                                        }
                                    })
                                    if (isTrue) {
                                        index = i;
                                    }
                                }else{
                                    index=0;
                                }
                            })
                            stateManager.currentNode=oldChild[index];

                        }
                        else if(oldChild.length<newChild.length){

                        }
                    }
                    else{
                        stateManager.history.curIndex = curIndex;//-1
                        fnRenderCanvasByJson(null);//清空画布
                    }
                }
                else {
                    console.log('清空');
                }
            }
            else if ($(this).hasClass('forward')) {
                //前进
                var curIndex = stateManager.history.curIndex + 1;
                if (curIndex < stateManager.history.arr.length) {
                    var arr = stateManager.history.arr[curIndex];
                    stateManager.history.curIndex = curIndex;
                    fnRenderCanvasByJson(arr);
                } else {
                    console.log('超过');
                }
            }
            else if ($(this).hasClass('saveBtn')) {
                stateManager.currentActiveIndex=null;

            }
        }],
        //设置成组
        ['click', '.groupWrap.btn', function () {
            canvasManager.setNodesToGroup();
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
        stateManager.history={
            arr: [],
            curIndex: -1
        }

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

        toolbarManager.reset();

    }
}
//拖拽管理者
var dragManager = {
    /*******************************************************数据层******/

    /**********************************************************视觉层*****/

    /**********************************************************控制层*****/
    //根据拖拽的图标对象，确定创建哪一类节点
    _createNodeOrContainerNodeByDrag: function ($thisClone, mDown, thisWidth, thisHeight, pageX, pageY)
    {
        if ($thisClone) {
            var nodeType = $thisClone.attr('nodeType');

            if(nodeType){
                //拖拽单个图形
                var json = {
                    '-1':'createNodeByDrag',//基本图形
                    1: 'createContainerNodeByDrag',//业务
                    2: 'createNodeByDrag', //集群
                    3: 'createNodeByDrag',//主机设备
                    4: 'createNodeByDrag'//实例
                }

                canvasManager[json[nodeType]]($thisClone, mDown, thisWidth, thisHeight, pageX, pageY);
            }else{
                //拖拽集合
                canvasManager["createCollectionByDrag"]($thisClone, mDown, thisWidth, thisHeight, pageX, pageY);
            }

        }
    },

    //todo:封装成底层功能，作为中间层，用于拖拽图标的初始化，
     dragInit: function () {
        var $dragContainer = $('#container');
        var fnCreateNodeOrContainerNodeByDrag = this._createNodeOrContainerNodeByDrag;
        $('#equipmentArea .dragTag').each(function () {
            $(this).attr('isDragTag')!='true'&&$(this).dragging({
                move: 'both', //拖动方向，x y both
                randomPosition: false, //初始位置是否随机
                dragContainer: $dragContainer, //可拖拽区域容器
                dragMouseDown:function($thisClone,positionX,positionY){//鼠标按下时的处理
                    $thisClone.css({
                        "zIndex": "1",
                        'left': positionX+5,
                        'top': positionY+5,
                        'position':'absolute',
                        'padding-left':'0',
                        'margin':0
                    });
                    if($thisClone.attr('nodetype')!='-1'){
                        //基本图形
                        $thisClone.css({
                            'height':'20px',
                            'width':'auto',
                        }).children(0).css({
                            'width': '18px',
                            'float':'left',
                            'display':'inline-block',
                            'height': '20px',
                            'vertical-align': 'middle'
                        }).end().children(1).css({
                            'font-size': '12px',
                            'position': 'relative',
                            'width': 'auto',
                            'overflow': 'hidden',
                            'text-overflow':' ellipsis',
                            'white-space':' nowrap',
                            'bottom':' 0',
                            'padding-left':'12px',
                            'height':'20px',
                            'line-height':'20px',
                            'left':' 0',
                            'text-align': 'left'
                        });
                    }
                },
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
    /******************数据层**************************/
    getTopo:function (callback) {
         var data={
             "nodes": [
                 {
                     "id": 100,
                     "name": "system",
                     "node_json": {
                         "trunk":true,
                         "startTag":true,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
                 {
                     "id": 101,
                     "name": "tycj",
                     "node_json": {
                         "trunk":true,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
                 {
                     "id": 102,
                     "name": "ppmanager",
                     "node_json": {
                         "trunk":true,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
                 {
                     "id": 103,
                     "name": "mysql:192.168.11.92:3306",
                     "node_json": {
                         "trunk":false,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
                 {
                     "id": 104,
                     "name": "http://192.168.11.92:8080/tcp",
                     "node_json": {
                         "trunk":false,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
                 {
                     "id": 105,
                     "name": "mysql:192.168.11.93:3306",
                     "node_json": {
                         "trunk":false,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
                 {
                     "id": 106,
                     "name": "mysql:192.168.11.93:3307",
                     "node_json": {
                         "trunk":false,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
                 {
                     "id": 107,
                     "name": "mysql:192.168.11.93:3308",
                     "node_json": {
                         "trunk":false,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
                 {
                     "id": 108,
                     "name": "mysql:192.168.11.93:3308",
                     "node_json": {
                         "trunk":false,
                         "img_name": "testIcon.png",
                         "img_width": 42,
                         "img_height": 42,
                         "node_class": "imageNode"
                     }
                 },
             ],
             "links": [
                 {
                     "from_id": 100,
                     "to_id": 101,
                     "line_json": {
                         "edge_class": "Link"
                     }
                 },
                 {
                     "from_id": 101,
                     "to_id": 102,
                     "line_json": {
                         "edge_class": "Link"
                     }
                 },
                 {
                     "from_id": 101,
                     "to_id": 103,
                     "line_json": {
                         "edge_class": "Link"
                     }
                 },
                 {
                     "from_id": 102,
                     "to_id": 105,
                     "line_json": {
                         "edge_class": "Link"
                     }
                 },
                 {
                     "from_id": 102,
                     "to_id": 106,
                     "line_json": {
                         "edge_class": "Link"
                     }
                 },
                 {
                     "from_id": 102,
                     "to_id": 107,
                     "line_json": {
                         "edge_class": "Link"
                     }
                 },
                 {
                     "from_id": 102,
                     "to_id": 108,
                     "line_json": {
                         "edge_class": "Link"
                     }
                 },
                 {
                     "from_id": 102,
                     "to_id": 104,
                     "line_json": {
                         "edge_class": "Link"
                     }
                 }
             ]
         }
         stateManager.currentTopo=data;
         callback(data);
    },
    /******************显示层**************************/
    showTopo:function(data){
       canvasManager.renderCanvasByJson(data);


       //居中
        stateManager.scene.translateX=0;
        stateManager.scene.translateY=0;
        stateManager.scene.centerAndZoom();


    },
    /******************控制层**************************/
    setTopo:function () {
           var showTopo=this.showTopo;
           this.getTopo(showTopo);
    },
    /**********************************辅助方法*************************************************/
    //根据json数据绘制画布,即复现功能
    renderCanvasByJson: function (data) {
        var self = canvasManager;
        var stage = stateManager.stage;
        stage.remove(stateManager.scene);
        var scene = stateManager.scene = new JTopo.Scene(stage);

        var idToNode = {};
        //绑定事件
        self.initCanvasEvent();
        if (!data) {
            return;
        }
        //分开绘制是因为必须现有节点，后有容器，最后再有连线

        var nodesArr=data.nodes;
        var linksArr=data.links;
        var firstTrunkNode=null;
        //绘制节点
        var trunkArr=[];//主干节点
        for (var i = 0; i < nodesArr.length; i++)  {
            var obj = nodesArr[i];
            var nodeObj= self._createNode(obj);
            idToNode[obj.id] =nodeObj;
            if(obj.node_json.trunk){
                trunkArr.push(nodeObj);
                if(obj.node_json.startTag){
                    firstTrunkNode=nodeObj;
                }
            }
        }
        //主干节点排序
        var nextTrunkNode=firstTrunkNode;
        var i=0;
        var subX=150;
        var subY=87;
        while(nextTrunkNode){
            nextTrunkNode.setLocation(i*subX,-i*subY);
            ++i;
            //1、找到当前节点的所有下一个节点
            var allNextNodesIdArr= canvasManager.findAllNextNodes(nextTrunkNode.id,linksArr);
            //2、分支节点排序
            var branchNodesArr=canvasManager.findBranchNodes(allNextNodesIdArr,idToNode);
            var len=branchNodesArr.length;
            for(var m=0;m<len;m++){
                canvasManager.setBranchNodesPosition(branchNodesArr[m],nextTrunkNode.x,nextTrunkNode.y,200,len,m)
            }
            //3、从下个节点中找到主干节点
            nextTrunkNode=canvasManager.findTrunkNode(allNextNodesIdArr,idToNode);

        }

        //绘制容器节点、容器
        // for (var i = 0; i < data.length; i++) {
        //     var obj = data[i];
        //     if (obj['elementType'] == 'containerNode') {
        //         idToNode[obj._id] = self._createContainerNode(obj, idToNode);
        //     }
        //     else if (obj['elementType'] == 'container') {
        //         idToNode[obj._id] = self._createContainer(obj, idToNode);
        //     }
        // }

        //绘制线条
        for (var i = 0; i < linksArr.length; i++) {
            var obj = linksArr[i];
            obj.strokeColor='190,218,253';
            var link = self._createLink(idToNode[obj.from_id], idToNode[obj.to_id], 'arrow', obj);
            link && scene.add(link);
        }
    },
    //找到当前节点的所有下一个节点的id
    findAllNextNodes:function (id,linksArr) {
        var arr=[];
        for(var j=0;j<linksArr.length;j++){
            var linkObj=linksArr[j];
            if(linkObj.from_id==id){
                arr.push(linkObj.to_id);
            }
        }
        return arr;
    },
    //从下个节点id中找到主干节点
    findTrunkNode:function(allNextNodesIdArr,idToNode) {
        for(var k=0;k<allNextNodesIdArr.length;k++){
            var id=allNextNodesIdArr[k];
            var trunkNode=idToNode[id];
            if(trunkNode.node_json.trunk){
                return trunkNode;
            }
        }
        return null;
    },
    //从下个节点id中找到分支节点
    findBranchNodes:function (allNextNodesIdArr,idToNode) {
        var arr=[];
        for(var k=0;k<allNextNodesIdArr.length;k++){
            var id=allNextNodesIdArr[k];
            var branchNode=idToNode[id];

            if(!branchNode.node_json.trunk){
                arr.push(branchNode);
            }
        }
        return  arr;
    },
    //根据主干节点的位置，设置分支节点的位置
    setBranchNodesPosition:function (targetNode,pageX,pageY,distance,len,index) {
          var x,y,angle;
        switch (len){
            case 1:
                //一个节点
                  angle=1.04;

                break;
            case 2:
                //两个节点
                  angle=index==1?1.04:-2.11;

                break;
            default:
                if(len<4) {
                    if (index == 0) {
                        angle = 1.04;
                    }
                    else if (index == 1) {
                        angle = 2.11;
                    }
                    else if (index == 2) {
                        angle = -2.11;
                    }
                }else{
                    if (index == 0) {
                        angle = 1.04;
                    }
                    else if (index == len-1) {
                        angle = -2.11;
                    }
                    else{
                        angle=1.04-index*(3.15/(len-1));
                    }
                }

        }
        x=pageX+Math.sin(angle)*distance;
        y=pageY+Math.cos(angle)*distance;
           //三个节点及以上
         targetNode.setLocation(x,y);
    },


    /******************画布处理，start***************************/
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
            if (e.button == 2) {
                // scene.remove(link);
                return;
            }
            //开启连线模式
            if (setLink.isSetting) {

                if (e.target != null && (e.target instanceof JTopo.Node || e.target instanceof JTopo.Container || e.target instanceof JTopo.ContainerNode))
                {

                    if (beginNode == null) {
                        beginNode = e.target;
                        link = self._createLink(tempNodeA, tempNodeZ);
                        scene.add(link);
                        tempNodeA.setLocation(e.x, e.y);
                        tempNodeZ.setLocation(e.x, e.y);
                    }
                    else if (beginNode !== e.target) {
                        var endNode = e.target;
                        //如果是容器节点和其内部的节点连线,或者其内部节点之间连线，则不应该连线
                        if([beginNode.parentType,endNode.parentType].indexOf('containerNode')<0){
                            var l = self._createLink(beginNode, endNode);//正式连线
                            scene.add(l);
                        }


                        beginNode = null;
                        scene.remove(link);
                    }
                    else {
                        beginNode = null;
                    }
                }

                else {
                    link&&scene.remove(link);
                }
            }
            //点击节点
            if (e.target != null && (e.target instanceof JTopo.Node || e.target instanceof JTopo.Container || e.target instanceof JTopo.ContainerNode))
            {
                //连线需要点击两次节点
                if (!beginNode) {

                }
                stateManager.isNeedSave=true;

            }
            else if(!(e.target instanceof JTopo.Node || e.target instanceof JTopo.Container || e.target instanceof JTopo.ContainerNode))
            {

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
        var busi_id='';
        var busi_type='';
        var flowIconTag=$thisClone.attr('flowIconTag');//表示属于流程图标
        var isOtherRectIcon=['android','apple','IE'].indexOf($thisClone.attr('imgname'))>=0;//安卓苹果IE图标

        if ($thisClone) {
            nodeName = $thisClone.attr('nodeName');
            imgName = $thisClone.attr('imgName');
            busi_id = $thisClone.attr('busi_id');
            busi_type = $thisClone.attr('busi_type');
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
            node.busi_id=busi_id;
            node.busi_type=busi_type;
            node.equipmentType=imgName;
            node.setSize(nodeWidth, nodeHight);
            self._setNodeEvent(node);
            scene.add(node);

        }
    },
    //创建节点
    _createNode: function (nodeObj) {
        var scene = stateManager.scene;
        var self = canvasManager;
        var node = new JTopo.Node();
        var img_name=nodeObj.node_json.img_name;
        var url='./images/'+img_name;
        img_name && node.setImage(url);
        for (var i in nodeObj) {
            node[i] = nodeObj[i];
        }
        node.width=65;
        node.height=58.8;
        node.text=nodeObj.name;
        self._setNodeEvent(node);
        scene.add(node);
        return node;
    },
    //设置节点的事件
    _setNodeEvent: function (node) {
        node.addEventListener('mouseup', function (e) {

            stateManager.currentChooseElement=this;
            stateManager.currentNode = this;

        });
        node.addEventListener('mousemove', function (e) {
            // $("#nodeTitle").css({
            //     left: e.x + leftAreaWidth - nodeTitleWidth / 2 + scene.translateX,
            //     top: e.y + topAreaHeight - nodeTitleHeight + 60 + scene.translateY
            // }).show();
        });
        node.addEventListener('mouseout', function (e) {
            $(".titleDiv").hide()
        });
        node.addEventListener('dbclick', function (e) {

        });
        // if (node.alarm) {
        //     var str = node.alarm;
        //     setInterval(function () {
        //         node.alarm = node.alarm ? null : str;
        //     }, 1000);
        // }
    },
    /******************节点处理，end***************************/


    /******************集合处理，start***************************/
    //拖拽一个集合图标，创建多个节点
    createCollectionByDrag:function ($thisClone, mDown, thisWidth, thisHeight, pageX, pageY) {

        var topoType = $thisClone.attr('topoType');
        var subTypeName = $thisClone.attr('subtypename');
        var offsetXLen = 60;
        var offsetYLen = 10;
        var rowCount=4;
        var fnName
        var data = [];
        if (topoType) {
            //拖拽的图标是个父级，需要显示出所有已有的子节点,这种情况下，又分为普通节点和容器节点
            $('.entityIconTag .dragTag[subtypename="' + subTypeName + '"]').each(function () {
                var obj = $(this);
                var imgName = obj.attr('imgname');
                var isInCanvas = obj.hasClass('inCanvas');
                !isInCanvas && imgName && data.push(obj.clone());
            });
            sugar(data, false);
        }
        function sugar(data) {
            var len = data.length;
            console.log(data);
            for (var i = 0; i < len; i++) {
                var obj = data[i];
                if(obj.attr('nodeType')==1){
                    fnName='createContainerNodeByDrag';
                    thisWidth=300;
                    thisHeight=165;
                    rowCount=3;
                }else{
                    fnName='createNodeByDrag';
                }
                  obj.offsetX = (i % rowCount) * (parseFloat(thisWidth) + offsetXLen);
                  obj.offsetY = Math.floor(i / rowCount) * (parseFloat(thisHeight) +offsetYLen);
                  canvasManager[fnName](obj, mDown, thisWidth, thisHeight, pageX, pageY);
            }
            if ($thisClone) {
                $thisClone.remove();
                $thisClone = null;
            }

        }
    },
    /******************集合处理，end***************************/



    /******************容器节点处理，start***************************/ //创建拖拽后的容器节点，初始化容器节点
    createContainerNodeByDrag: function ($thisClone, mDown, thisWidth, thisHeight, pageX, pageY)
    {
        var scene = stateManager.scene;
        var self = canvasManager;
        var subWidth = pageX - stateManager.equipmentAreaWidth;
        var subHeight = pageY - 80;
        var offsetX=$thisClone.offsetX||0;
        var offsetY=$thisClone.offsetY||0;
        var nodeX =offsetX+ subWidth - scene.translateX;//松开鼠标时,元素在画布上的x坐标
        var nodeY =offsetY+ pageY - scene.translateY - 80;//松开鼠标时,元素在画布上的y 坐标

        var nodeName = '';
        var imgName = '';
        var busi_id='';
        var busi_type='';

        if ($thisClone) {
            nodeName = $thisClone.attr('nodeName');
            imgName = $thisClone.attr('imgName');
            busi_id = $thisClone.attr('busi_id');
            busi_type = $thisClone.attr('busi_type');
            $thisClone.remove();
            $thisClone=null;
        }
        if (subWidth > 0 && subHeight > 0 && mDown) {
            //文字
            var textNode = new JTopo.Node();
            textNode.fontColor = '43,43,43';
            textNode.font = "16px Consolas";
            textNode.text =nodeName;
            textNode.textBreakNumber = 15;
            textNode.textLineHeight = 13;
            textNode.textPosition = "Bottom_Center";
            textNode.showSelected = false;
            textNode.setSize(0, 0);
            textNode.setLocation(nodeX + 60, nodeY + 20);
            textNode.parentType = 'containerNode';
            textNode.nodeFn='title';

            //告警文字
            var alarmTextNode = new JTopo.Node();
            alarmTextNode.fontColor = '43,43,43';
            alarmTextNode.font = "12px Consolas";
            alarmTextNode.text ='存在1个告警';
            alarmTextNode.textPosition = "Bottom_Center";
            alarmTextNode.showSelected = false;
            alarmTextNode.setSize(0, 0);
            alarmTextNode.setLocation(nodeX + 60, nodeY + 125);
            alarmTextNode.parentType = 'containerNode';
            alarmTextNode.nodeFn='alarm';

            //节点
            var node = new JTopo.Node();
            node.setSize(50, 50);
            node.setLocation(nodeX + 35, nodeY + 60);
            node.showSelected = false;
            node.alarm = null;
            var url='';
            node.setImage();
            node.imgName = imgName;
            node.parentType = 'containerNode';
            node.dragable=false;
            node.nodeFn='icon';

            //指标信息
            var tragetNode = new JTopo.Node();
            tragetNode.fontColor = '223,226,228';
            tragetNode.font = "16px Consolas";
            tragetNode.text ='content1';
            tragetNode.textPosition = "Bottom_Center";
            tragetNode.showSelected = false;
            tragetNode.setSize(135, 30);
            tragetNode.setLocation(nodeX + 150, nodeY + 35);
            tragetNode.parentType = 'containerNode';
            tragetNode.borderWidth=1;
            tragetNode.borderColor='223,226,228';
            tragetNode.borderRadius=5;
            tragetNode.textOffsetY=-25;
            tragetNode.fillColor='255,255,255';
            tragetNode.nodeFn='traget1';
            tragetNode.dragable=false;

            //指标信息
            var tragetNode2 = new JTopo.Node();
            tragetNode2.fontColor = '223,226,228';
            tragetNode2.font = "16px Consolas";
            tragetNode2.text ='content2';
            tragetNode2.textPosition = "Bottom_Center";
            tragetNode2.showSelected = false;
            tragetNode2.setSize(135, 30);
            tragetNode2.setLocation(nodeX + 150, nodeY + 75);
            tragetNode2.parentType = 'containerNode';
            tragetNode2.borderWidth=1;
            tragetNode2.borderColor='223,226,228';
            tragetNode2.borderRadius=5;
            tragetNode2.textOffsetY=-25;
            tragetNode2.fillColor='255,255,255';
            tragetNode2.nodeFn='traget2';
            tragetNode2.dragable=false;
            //指标信息
            var tragetNode3 = new JTopo.Node();
            tragetNode3.fontColor = '223,226,228';
            tragetNode3.font = "16px Consolas";
            tragetNode3.text ='content3';
            tragetNode3.textPosition = "Bottom_Center";
            tragetNode3.showSelected = false;
            tragetNode3.setSize(135, 30);
            tragetNode3.setLocation(nodeX + 150, nodeY + 115);
            tragetNode3.parentType = 'containerNode';
            tragetNode3.borderWidth=1;
            tragetNode3.borderColor='223,226,228';
            tragetNode3.borderRadius=5;
            tragetNode3.textOffsetY=-25;
            tragetNode3.fillColor='255,255,255';
            tragetNode3.nodeFn='traget3';
            tragetNode3.dragable=false;
            //容器位置,左上角
            var containerLeftTop = new JTopo.Node();
            containerLeftTop.setSize(0, 0);

            containerLeftTop.showSelected = false;
            containerLeftTop.setLocation(nodeX, nodeY);
            containerLeftTop.parentType = 'containerNode';
            containerLeftTop.nodeFn='pLeft';

            //容器位置,右下角
            var containerRightBottom = new JTopo.Node();
            containerRightBottom.setSize(0, 0);

            containerRightBottom.showSelected = false;
            containerRightBottom.setLocation(nodeX + 300, nodeY + 165);
            containerRightBottom.parentType = 'containerNode';
            containerRightBottom.nodeFn='pRight';

            //容器本尊
            var container = new JTopo.ContainerNode();
            // container.text = "   ";
            container.textPosition = 'Bottom_Center';
            container.fontColor = '232,31,0';
            container.font = '16px 微软雅黑';
            // container.textOffsetY = -5;
            container.alpha = 1;
            container.childDragble = false;
            container.borderRadius = 5; // 圆角
            container.borderWidth=1;
            container.borderColor='223,226,228';
            container.fillColor = '255,255,255';
            container.shadowBlur = 10;
            container.shadowColor = "rgba(79,165,219,0.8)";
            container.zIndex = 2;
            container.nodeFn='containerNode';
            container.alias="";
            container.originName=nodeName;
            container.busi_id=busi_id;
            container.busi_type=busi_type;
            container.equipmentType=imgName;

            scene.add(textNode);
            scene.add(alarmTextNode);
            scene.add(tragetNode);
            scene.add(tragetNode2);
            scene.add(tragetNode3);
            scene.add(node);
            scene.add(containerLeftTop);
            scene.add(containerRightBottom);

            container.add(textNode);
            container.add(alarmTextNode);
            container.add(tragetNode);
            container.add(tragetNode2);
            container.add(tragetNode3);
            container.add(node);
            container.add(containerLeftTop);
            container.add(containerRightBottom);

            scene.add(container);

            self._setContainerNodeEvent(container);

        }
    },
    //创建容器节点
    _createContainerNode: function (obj, idToNode) {
        var stage = stateManager.stage;
        var scene = stateManager.scene;
        var self = canvasManager;
        var containerNode = new JTopo.ContainerNode('');
        //先增加属性，后添加节点
        for (var i in obj) {
            containerNode[i] = obj[i];
        }
        var childsArr = obj['childsArr'];
        for (var j = 0; j < childsArr.length; j++) {
            containerNode.add(idToNode[childsArr[j]]);
        }


        scene.add(containerNode);
        self._setContainerNodeEvent(containerNode);

        return containerNode;
    },
    //设置容器节点的事件
    _setContainerNodeEvent: function (containerNode) {

        containerNode.addEventListener('mouseup', function (e) {

            stateManager.currentContainerNode = this;
            stateManager.currentChooseElement=this;
            if (e.button == 2) {
                //     $("#contextmenuContainerNode").css({
                //         top: e.pageY - 120+stateManager.scrollHeight,
                //         left: e.pageX - leftBarWidth
                //     }).show();
            }
        });
        containerNode.addEventListener('dbclick',function (e) {


        });
        if (containerNode.alarm) {
            var str = containerNode.alarm;
            setInterval(function () {
                containerNode.alarm = containerNode.alarm ? null : str;
            }, 1000);
        }
    },
    /******************容器节点处理，end***************************/



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
            container.textOffsetY = -5;
            // container.alarm = 'haha';
            container.alpha=0;
            container.textAlpha=1;
            container.shadowBlur =5;
            container.shadowColor = "rgba(43,43,43,0.5)";
            container.borderColor='108,208,226';
            container.borderWidth=1;
            container.borderDashed=false;//边框成虚线，一定要设置borderRadius大于0
            container.borderRadius = 5; // 圆角

            container.busi_id='-1';
            container.busi_type='-1';
            container.equipmentType='-1';

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

        for (var i in obj) {
            if (i == 'childsArr') {
                for (var j = 0; j < obj[i].length; j++) {
                    container.add(idToNode[obj[i][j]]);
                }
            }
            container[i] = obj[i];
        }

        self._setGroupEvent(container);
        scene.add(container);
        return container;
    },
    //设置容器的事件
    _setGroupEvent: function (container) {
        container.addEventListener('mouseup', function (e) {

            stateManager.currentContainer = this;
            stateManager.currentChooseElement=this;

        });
        container.addEventListener('dbclick', function (e){
            stateManager.currentContainer = this;
            stateManager.currentChooseElement=this;

        });
        if (container.alarm) {
            var str = container.alarm;
            setInterval(function () {
                container.alarm = container.alarm ? null : str;
            }, 1000);
        }
    },
    /******************容器处理，end***************************/


    /******************线条处理，start***************************/
    //创建节点间的连线
    _createLink: function (sNode, tNode, slinkType,linkObj) {
        //开始节点，结束节点，线条类型，是否从节点边框外围连接
        var link;
        var linkType = slinkType ? slinkType : stateManager.setLink.linkType;
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
            //drawanimepic功能还不完善：开始和结束的点，垂直时元素的旋转度，清空定时器操作
            // if(tNode.width>1){
            //     link.drawanimepic(rootPath+'/primary/component/src/resourceManage/files/images/testspecialline1.png',stateManager.scene,90,88,1,4,1000,0);
            //  }
        }
        else if (linkType == 'flow') {
            link = new JTopo.Link(sNode, tNode);
            link.arrowsRadius = 10; //箭头大小
            link.PointPathColor = "rgb(237,165,72)";//连线颜色
        }
        if (link) {
            this._setLinkEvent(link);
            if(linkObj){
                for(var k in linkObj){
                    link[k]=linkObj[k]
                }
            }else{
                link.linkType = linkType;
                link.zIndex = 1;
                link.strokeColor = '216,223,230';
                link.fontColor='255,152,41';
            }
        }
        return link;
    },
    //设置线条事件
    _setLinkEvent: function (link) {
        link.addEventListener('mouseup', function (e) {
            stateManager.currentLink = this;
            stateManager.currentChooseElement=this;
        });
        link.addEventListener('mousemove', function (e) {

        });
        link.addEventListener('mouseout', function (e) {

        });
    },
    /******************线条处理，end***************************/

    init: function () {
        var canvas = stateManager.canvas = document.getElementById('canvas');
        var stage = stateManager.stage = new JTopo.Stage(canvas);
        var scene = stateManager.scene = new JTopo.Scene(stage);
        canvasManager.setCanvasStyle();
        canvasManager.initCanvasEvent(); //canvas事件初始化
        canvasManager.setTopo();
    }
}

/***************初始化*****************/
    stateManager.init();
    canvasManager.init();
    dragManager.init();
    toolbarManager.init();