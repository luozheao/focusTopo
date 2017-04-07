
    //状态管理者
    var stateManager= {
        canvas: {},
        stage: {},
        scene: {},
        equipmentAreaWidth: $('#equipmentArea').width() + 2,
        toolBarHeight:$('#graph_panel>.q-toolbar').height()+2,
        //线条类型
        setLink: {
            isSetting: false,
            linkType: ''
        },
        canvasState: {
            pageX: 0, //画布上的x坐标
            pageY: 0
        },
        currentNode: null,//当前节点
        currentContainerNode:null,//当前容器节点
        currentContainer:null,//当前容器
        currentLink: null,//当前线条
        currentTopo:[], //当前打开的拓扑图
        customAttr:[//节点、容器、线条通用保存属性
            "elementType", "x", "y", "width", "height", "visible","alpha",
            "rotate", "scaleX", "scaleY", "strokeColor","fillColor",
            "shadow", "shadowColor", "shadowOffsetX", "shadowOffsetY",
            "transformAble", "zIndex", "dragable",
            "selected","showSelected", "isMouseOver",
            "text", "font", "fontColor", "textPosition",
            "textOffsetX", "textOffsetY", "borderRadius"
        ],
        saveNodeAttr: ["_id","imgName","alarm","textBreakNumber","textLineHeight","parentType"],
        saveContainerNodeAttr:["_id","childsArr","alarm","childDragble"],
        saveContainerAttr:[ "_id","childsArr","alarm","childDragble"],
        saveLinkAttr: ["_id", "nodeAId", "nodeZId", "linkType"],
        history: {
            arr: [],
            curIndex: -1
        },
        init:function () {
            //合并数组
            this.saveNodeAttr.push.apply(this.saveNodeAttr,this.customAttr);
            this.saveContainerNodeAttr.push.apply(this.saveContainerNodeAttr,this.customAttr);
            this.saveContainerAttr.push.apply(this.saveContainerAttr,this.customAttr);
            this.saveLinkAttr.push.apply(this.saveLinkAttr,this.customAttr);
        }
    }
    //工具栏管理者
    var toolbarManager={
        aEvents:[
             //缩放
             ['click','.zoomArea>.btn',function () {
                 var $zoom=$(this).find('>div');
                 var self=toolbarManager;
                 var zoom=0.9;
                 var stage=stateManager.stage;
                 var scene=stateManager.scene;
                 var canvas=stateManager.canvas;
                 if($zoom.hasClass('toolbar-zoomin')){
                     //放大
                     scene.zoomOut(zoom);
                 }else if($zoom.hasClass('toolbar-zoomout')){
                     //缩小
                     scene.zoomIn(zoom);
                 }else if($zoom.hasClass('toolbar-zoomreset')){
                     //1:1
                     scene.zoomReset();
                 }else if($zoom.hasClass('toolbar-center')){
                     //缩放并居中显示
                     scene.centerAndZoom();
                 }else if($zoom.hasClass('toolbar-overview')){
                     //全屏
                     self._runPrefixMethod(canvas, "RequestFullScreen")
                 }
             }],
             //模式
             ['click','.patternArea>.btn',function () {
                 var scene=stateManager.scene;
                 var self=toolbarManager;
                 var $pattern=$(this).find('>div');
                 self._setActiveBtn($(this));
                 stateManager.setLink.isSetting=false;

                  if($pattern.hasClass('toolbar-default')){
                      //默认
                      scene.mode = "normal";
                  }
                  else if($pattern.hasClass('toolbar-setBorder')){
                      //边框
                      scene.mode = "edit";
                  }
                  else if($pattern.hasClass('toolbar-select')){
                      //框选
                      scene.mode = "select";
                      $('#toolbar .groupWrap').removeClass('none');
                  }
                  else if($pattern.hasClass('toolbar-pan')){
                      //浏览
                      scene.mode = "drag";
                  }
             }],
             //鹰眼
             ['click','.eyesWrap',function () {
                 var stage=stateManager.stage;
                 if($(this).hasClass('active')){
                     stage.eagleEye.visible = false;
                     $(this).removeClass('active');
                 }else{
                     stage.eagleEye.visible = true;
                     $(this).addClass('active');
                 }
             }],
             //搜索
             ['click','.searchWrap>.btn',function () {
                 var text=$('#search_input').val().trim();
                 var scene=stateManager.scene;
                 var fnFlashEle=canvasManager.flashElemenet;
                 scene.findElements(function (e) {
                     e.selected = text && e.text && e.text.indexOf(text) >= 0 ? true : false;
                     e.selected && fnFlashEle(e, 10);
                 });
             }],
             ['keyup','#search_input',function (e) {
                   if(e.which==13){
                       $('.searchWrap >.btn').click();
                   }
              }],
             //连线
             ['click','.chooselineArea>.btn',function () {
                   var $line=$(this);
                   stateManager.setLink.linkType=$line.attr('lineType');
                   var self=toolbarManager;
                   var linkType='';
                   self._setActiveBtn($(this));
                   stateManager.setLink.isSetting=true;
             }],
            //历史操作
             ['click','.historyArea>.btn',function () {
                 var fnRenderCanvasByJson=canvasManager.renderCanvasByJson;
                 var fnGetCanvasToJson=canvasManager.getCanvasToJson;
                 if($(this).hasClass('backOff')) {
                     //后退
                    var curIndex =stateManager.history.curIndex-1;
                    if(curIndex>=-1){
                        var arr=stateManager.history.arr[curIndex];
                        stateManager.history.curIndex=curIndex;
                        fnRenderCanvasByJson(arr);
                    }else{
                        console.log('清空');
                    }
                 }
                 else if($(this).hasClass('forward')){
                     //前进
                     var curIndex =stateManager.history.curIndex+1;
                     if(curIndex<stateManager.history.arr.length){
                         var arr=stateManager.history.arr[curIndex];
                         stateManager.history.curIndex=curIndex;
                         fnRenderCanvasByJson(arr);
                     }else{
                         console.log('超过');
                     }
                 }
                 else if($(this).hasClass('saveBtn')) {
                     var saveArr= fnGetCanvasToJson();
                }
             }],
            //设置成组
            ['click','.groupWrap.btn',function ()   {
                    canvasManager.setNodesToGroup();
             }],
        ],
        /**********私有方法区域**************/
        //全屏
        _runPrefixMethod :function(element, method) {
            var usablePrefixMethod;
            ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
                    if (usablePrefixMethod) return;
                    if (prefix === "") {
                        // 无前缀，方法首字母小写
                        method = method.slice(0,1).toLowerCase() + method.slice(1);
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
        //设置当前选中按钮激活样式
        _setActiveBtn:function ($curObj) {
            $('.patternArea').find('.active').removeClass('active');
            $('.chooselineArea .active').removeClass('active');
            $curObj.addClass('active');

            $('#toolbar .groupWrap').addClass('none');
        },
        init:function () {
              //事件初始化
              var aEvents=this.aEvents;
              for(var i=0;i<aEvents.length;i++){
                  $(aEvents[i][1]).on(aEvents[i][0],aEvents[i][2]);
              }
        }
    }
    //拖拽管理者
    var dragManager={
        /*******************************************************数据层******/
        //获取目录树数据
        getMenuData:function(){
            var zNodes=[
                {
                    "code": "default_area",  // 编码，可不用管
                    "name": "默认域",   // 目录名称
                    "pId": "0",   // 根据pId、id判断层级关系
                    "id": "1",
                    "type": "0",  // 类型，0 域 1 业务系统 可不用管
                    "isLeaf": "false"   // 值为true时，表明其为叶子业务系统，其下无子业务系统，其下关联的是集群、主机、实例。
                },
                {
                    "code": "default_group",
                    "name": "默认组",
                    "pId": "1",
                    "id": "2",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "guangdong",
                    "name": "广东",
                    "pId": "0",
                    "id": "3",
                    "type": "0",
                    "isLeaf": "false"
                },
                {
                    "code": "guangzhou",
                    "name": "10086系统",
                    "pId": "3",
                    "id": "4",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "foshan",
                    "name": "CRM系统",
                    "pId": "3",
                    "id": "5",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "sichun",
                    "name": "四川",
                    "pId": "0",
                    "id": "10",
                    "type": "0",
                    "isLeaf": "false"
                },
                {
                    "code": "chengdu",
                    "name": "内部ERP系统",
                    "pId": "10",
                    "id": "11",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "hunan",
                    "name": "湖南",
                    "pId": "0",
                    "id": "12",
                    "type": "0",
                    "isLeaf": "false"
                },
                {
                    "code": "changsha",
                    "name": "微信平台系统",
                    "pId": "12",
                    "id": "13",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "anwei",
                    "name": "安徽",
                    "pId": "0",
                    "id": "14",
                    "type": "0",
                    "isLeaf": "false"
                },
                {
                    "code": "hefei",
                    "name": "内部OA系统",
                    "pId": "14",
                    "id": "15",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "hubei",
                    "name": "湖北",
                    "pId": "0",
                    "id": "16",
                    "type": "0",
                    "isLeaf": "false"
                },
                {
                    "code": "wuhan",
                    "name": "电子渠道系统",
                    "pId": "16",
                    "id": "17",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "gfrms",
                    "name": "票据系统",
                    "pId": "3",
                    "id": "18",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "apm",
                    "name": "应用性能管理",
                    "pId": "3",
                    "id": "19",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "netmgr",
                    "name": "性能监控",
                    "pId": "3",
                    "id": "20",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "setmeal",
                    "name": "内部定餐系统",
                    "pId": "12",
                    "id": "21",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "dcos",
                    "name": "DCOS平台",
                    "pId": "0",
                    "id": "34",
                    "type": "0",
                    "isLeaf": "false"
                },
                {
                    "code": "移动数据中心",
                    "name": "移动数据中心",
                    "pId": "34",
                    "id": "35",
                    "type": "1",
                    "isLeaf": "false"
                },
                {
                    "code": "cmcc_serv1",
                    "name": "cmcc_serv1",
                    "pId": "35",
                    "id": "36",
                    "type": "1",
                    "isLeaf": "false"
                },
                {
                    "code": "history",
                    "name": "历史",
                    "pId": "36",
                    "id": "37",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "cmcc_serv2",
                    "name": "cmcc_serv2",
                    "pId": "35",
                    "id": "38",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "移动数据中心1",
                    "name": "移动数据中心1",
                    "pId": "34",
                    "id": "39",
                    "type": "1",
                    "isLeaf": "false"
                },
                {
                    "code": "cmcc_serv2",
                    "name": "cmcc_serv2",
                    "pId": "39",
                    "id": "40",
                    "type": "1",
                    "isLeaf": "false"
                },
                {
                    "code": "移动数据中心2",
                    "name": "移动数据中心2",
                    "pId": "34",
                    "id": "41",
                    "type": "1",
                    "isLeaf": "false"
                },
                {
                    "code": "cmcc_serv2",
                    "name": "cmcc_serv2",
                    "pId": "41",
                    "id": "42",
                    "type": "1",
                    "isLeaf": "false"
                },
                {
                    "code": "history",
                    "name": "历史",
                    "pId": "42",
                    "id": "43",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "history",
                    "name": "历史",
                    "pId": "40",
                    "id": "44",
                    "type": "1",
                    "isLeaf": "true"
                },
                {
                    "code": "aaaaaaaaa",
                    "name": "aaaaaaaaaa",
                    "pId": "0",
                    "id": "54",
                    "type": "0",
                    "isLeaf": "false"
                },
                {
                    "code": "bbbbbbbbbb",
                    "name": "bbbbb",
                    "pId": "54",
                    "id": "55",
                    "type": "1",
                    "isLeaf": "true"
                }
            ]
            return zNodes;
        },
        //根据id获取拖拽图标
        getIconData:function () {
            var data=[
                {
                    "name": "10086系统",  //候选拓扑图节点的名称
                    "id": "4",   //关联的业务ID
                    "type": "1"  // 类型 1 业务系统 2 集群 3 主机 4 实例
                },
                {
                    "name": "CRM系统",
                    "id": "5",
                    "type": "2"
                },
                {
                    "name": "票据系统",
                    "id": "18",
                    "type": "3"
                },
                {
                    "name": "应用性能管理",
                    "id": "19",
                    "type": "4"
                },
                {
                    "name": "性能监控",
                    "id": "20",
                    "type": "1"
                }
            ]
            return data;
        },
        //根据id获取拓扑图数据
        getTopoData:function () {
           var data=[
               {
                   "id": "9",   //后台数据库中的ID
                   "type": "1",  // 类型 1 系统拓扑 2 流程拓扑 3 物理拓扑 4 流程拓扑
                   "name": "拓扑图名称22",  // 拓扑图的名字
                   "busi_id": "12",  //API 1 中的ID，获取后传给后台即可
                   "opr": null,  // 操作类型 add 新增 mod 修改 del 删除，这个API为获取数据库的数据，所以这个字段都为空
                   "line": [
                       {
                           "id": "16",
                           "name": "连线名称6",
                           "from_id": "44",
                           "to_id": "47",
                           "opr": null,
                           "json": "{l1:16}"
                       },
                       {
                           "id": "17",
                           "name": "连线名称",
                           "from_id": "45",
                           "to_id": "46",
                           "opr": null,
                           "json": "{l1:11}"
                       },
                       {
                           "id": "18",
                           "name": "连线名称7",
                           "from_id": "43",
                           "to_id": "46",
                           "opr": null,
                           "json": "{l1:17}"
                       }
                   ],
                   "node": [
                       {
                           "id": "43",
                           "name": "节点名称qqq",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       },
                       {
                           "id": "44",
                           "name": "节点id2",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n2:12}"
                       },
                       {
                           "id": "45",
                           "name": "节点名称3",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       },
                       {
                           "id": "46",
                           "name": "节点名称4",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n2:12}"
                       },
                       {
                           "id": "47",
                           "name": "节点名称6",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       }
                   ]
               },
               {
                   "id": "19",   //后台数据库中的ID
                   "type": "2",  // 类型 1 系统拓扑 2 流程拓扑 3 物理拓扑 4 流程拓扑
                   "name": "拓扑图名称22",  // 拓扑图的名字
                   "busi_id": "42",  //API 1 中的ID，获取后传给后台即可
                   "opr": null,  // 操作类型 add 新增 mod 修改 del 删除，这个API为获取数据库的数据，所以这个字段都为空
                   "line": [
                       {
                           "id": "16",
                           "name": "连线名称6",
                           "from_id": "44",
                           "to_id": "47",
                           "opr": null,
                           "json": "{l1:16}"
                       },
                       {
                           "id": "17",
                           "name": "连线名称",
                           "from_id": "45",
                           "to_id": "46",
                           "opr": null,
                           "json": "{l1:11}"
                       },
                       {
                           "id": "18",
                           "name": "连线名称7",
                           "from_id": "43",
                           "to_id": "46",
                           "opr": null,
                           "json": "{l1:17}"
                       }
                   ],
                   "node": [
                       {
                           "id": "43",
                           "name": "节点名称qqq",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       },
                       {
                           "id": "44",
                           "name": "节点id2",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n2:12}"
                       },
                       {
                           "id": "45",
                           "name": "节点名称3",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       },
                       {
                           "id": "46",
                           "name": "节点名称4",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n2:12}"
                       },
                       {
                           "id": "47",
                           "name": "节点名称6",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       }
                   ]
               },
               {
                   "id": "29",   //后台数据库中的ID
                   "type": "3",  // 类型 1 系统拓扑 2 流程拓扑 3 物理拓扑 4 流程拓扑
                   "name": "拓扑图名称22",  // 拓扑图的名字
                   "busi_id": "32",  //API 1 中的ID，获取后传给后台即可
                   "opr": null,  // 操作类型 add 新增 mod 修改 del 删除，这个API为获取数据库的数据，所以这个字段都为空
                   "line": [
                       {
                           "id": "16",
                           "name": "连线名称6",
                           "from_id": "44",
                           "to_id": "47",
                           "opr": null,
                           "json": "{l1:16}"
                       },
                       {
                           "id": "17",
                           "name": "连线名称",
                           "from_id": "45",
                           "to_id": "46",
                           "opr": null,
                           "json": "{l1:11}"
                       },
                       {
                           "id": "18",
                           "name": "连线名称7",
                           "from_id": "43",
                           "to_id": "46",
                           "opr": null,
                           "json": "{l1:17}"
                       }
                   ],
                   "node": [
                       {
                           "id": "43",
                           "name": "节点名称qqq",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       },
                       {
                           "id": "44",
                           "name": "节点id2",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n2:12}"
                       },
                       {
                           "id": "45",
                           "name": "节点名称3",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       },
                       {
                           "id": "46",
                           "name": "节点名称4",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n2:12}"
                       },
                       {
                           "id": "47",
                           "name": "节点名称6",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       }
                   ]
               },
               {
                   "id": "39",   //后台数据库中的ID
                   "type": "4",  // 类型 1 系统拓扑 2 流程拓扑 3 物理拓扑 4 流程拓扑
                   "name": "拓扑图名称22",  // 拓扑图的名字
                   "busi_id": "22",  //API 1 中的ID，获取后传给后台即可
                   "opr": null,  // 操作类型 add 新增 mod 修改 del 删除，这个API为获取数据库的数据，所以这个字段都为空
                   "line": [
                       {
                           "id": "16",
                           "name": "连线名称6",
                           "from_id": "44",
                           "to_id": "47",
                           "opr": null,
                           "json": "{l1:16}"
                       },
                       {
                           "id": "17",
                           "name": "连线名称",
                           "from_id": "45",
                           "to_id": "46",
                           "opr": null,
                           "json": "{l1:11}"
                       },
                       {
                           "id": "18",
                           "name": "连线名称7",
                           "from_id": "43",
                           "to_id": "46",
                           "opr": null,
                           "json": "{l1:17}"
                       }
                   ],
                   "node": [
                       {
                           "id": "43",
                           "name": "节点名称qqq",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       },
                       {
                           "id": "44",
                           "name": "节点id2",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n2:12}"
                       },
                       {
                           "id": "45",
                           "name": "节点名称3",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       },
                       {
                           "id": "46",
                           "name": "节点名称4",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n2:12}"
                       },
                       {
                           "id": "47",
                           "name": "节点名称6",
                           "type": "2",
                           "busi_id": "123",
                           "opr": null,
                           "json": "{n1:11}"
                       }
                   ]
               }
           ]

            stateManager.currentTopo=data;
            return data;
        },
        /**********************************************************视觉层*****/
         //显示拖拽图标
         showIconData:function () {
            var data= this.getIconData();
            var html='';
            for(var i=0;i<data.length;i++){
                 var obj=data[i];
                 var  imgName='iconType'+obj.type;
                 html+='<div class="dragTag '+imgName+'" imgName="'+imgName+'"  nodeType="'+obj.type+'"  nodeName="'+obj.name+'"></div>'
            }
            return html;
        },
        //显示拓扑图切换
        showTopoChange:function (aData) {
            var data=aData?aData:this.getTopoData();
            var json={
                  1:'系统拓扑',
                  2:'流程拓扑',
                  3:'物理拓扑',
                  4:'流程拓扑'
                }
            var html='';
            for(var i=0; i<data.length;i++){
                var isActive=i?'':'active';
                var isExpanded=i?false:true;
                html +='<li class="'+isActive+'"  topoId="'+data[i].id+'"><a data-toggle="tab"  aria-expanded="'+isExpanded+'">'+json[data[i].type]+'</a><i class="del">×</i></li>';
            }
            return html;
        },
        /**********************************************************控制层*****/
        //控制目录树显示与事件
        setMenuData:function () {
            var zNodes = this.getMenuData();
            var self =this;
            var setting={
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: 0
                    }
                },
                view:{
                    dblClickExpand:false
                },
                callback: {
                    onClick: self._menuClickEvent
                }
            };
            //目录树初始化
            $.fn.zTree.init($("#treeDemo"),setting , zNodes);
        },
        //控制拖拽图标显示
        setIconData:function () {
            var self = dragManager;
            var html = self.showIconData();
            $('.entityIcon').addClass('active').siblings().removeClass('active');
            $('.entityIconTag').html(html).show().siblings().hide();
            self.dragInit();
        },
        //控制拓扑图切换
        setTopChange:function (arr) {
            var self = dragManager;
            var html = self.showTopoChange(arr);
            $('.topoChooseArea ul').html(html);
            $('.topoChooseArea .del').click(function (e) {
                e.stopPropagation();
                var topoId=$(this).parents('li').attr('topoId');
                var arr=[];
                var topoArr=stateManager.currentTopo;
                //删除数据
                for(var i=0 ;i<topoArr.length;i++) {
                    if (topoArr[i].id != topoId) {
                        arr.push(topoArr[i]);
                    }
                }
                stateManager.currentTopo=arr;
                //渲染
                $(this).parents('li').remove();
                //todo:传输给后台
            });
            $('.topoChooseArea li').click(function () {
                 var topoId= $(this).attr('topoId');
                var topoArr=stateManager.currentTopo;
                var obj={};
                for(var i=0 ;i<topoArr.length;i++) {
                    if (topoArr[i].id == topoId) {
                        obj=topoArr[i];
                        break;
                    }
                }
                //渲染obj
                console.log(obj);
            });
        },
        //目录树节点点击事件
        _menuClickEvent:function (e,treeId, treeNode) {
            var self = dragManager;
            //单击打开节点
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.expandNode(treeNode);
            //拖拽图标初始化
            self.setIconData();
            //拓扑图初始化
            self.setTopChange();
        },


        /*********辅助方法******************************/
        //根据拖拽的图标对象，确定创建哪一类节点
        _createNodeOrContainerNodeByDrag:function(sNodeName, $thisClone, mDown, thisWidth, thisHeight, pageX, pageY){

            if($thisClone){
                var str=$thisClone.attr('nodeType');
                var json={
                    1:'createNodeByDrag',
                    2:'createNodeByDrag',
                    3:'createNodeByDrag',
                    4:'createContainerNodeByDrag'
                }
                canvasManager[json[str]](sNodeName, $thisClone, mDown, thisWidth, thisHeight, pageX, pageY);
            }
        },


        /*********其他事件******************************/
        aEvents:[
            //切换图标
            ['click','.iconTitle >li',function () {
                var $obj=$(this).hasClass('entityIcon')?$('.entityIconTag'):$('.basicIconTag');
                $(this).addClass('active').siblings().removeClass('active');
                $obj.show().siblings().hide();
            }],
        ],
        dragInit:function () {
            var $dragContainer=$('#container');
            // var $equipmentArea=$('#equipmentArea');
            var fnCreateNodeOrContainerNodeByDrag=this._createNodeOrContainerNodeByDrag;
            $('#equipmentArea .dragTag').each(function() {
                $(this).dragging({
                    move: 'both', //拖动方向，x y both
                    randomPosition: false, //初始位置是否随机
                    dragContainer:$dragContainer, //可拖拽区域容器
                    stateManager:stateManager,
                    fnCreateNodeByDrag:fnCreateNodeOrContainerNodeByDrag,  //拖拽后生成节点

                });
            });
        },
        init:function () {
            //目录树
            this.setMenuData();
            this.dragInit();
            //事件初始化
            var aEvents=this.aEvents;
            for(var i=0;i<aEvents.length;i++){
                $(aEvents[i][1]).on(aEvents[i][0],aEvents[i][2]);
            }

        }
    }
    //画布管理者
    var canvasManager = {

        /******************画布处理，start***************************/
        //设置画布大小
        setCanvasStyle: function () {
            var oCanvas = stateManager.canvas;
            var oContainer = document.getElementById('container');
            setStyle();
            window.onresize=function () {
                setStyle();
            }
            function  setStyle() {
                var oContainer_w = oContainer.offsetWidth;
                var oContainer_h = oContainer.offsetHeight;

                var oEquipmentArea = document.getElementById('equipmentArea');
                var oEquipmentArea_w = oEquipmentArea.offsetWidth;

                oCanvas.setAttribute('width', oContainer_w - oEquipmentArea_w - 2);
                oCanvas.setAttribute('height', oContainer_h);

            }
        },
        //画布元素闪动
        flashElemenet:function (ele,count,time) {
            var i=0;
            var selected=ele.selected;
            var Count=count!==undefined?count:10;
            var Time=time!==undefined?time:300;
            var T=setInterval(function () {
                ele.selected= ele.selected?false:true;
                if(i==Count){
                    ele.selected=selected;
                    clearInterval(T);
                }
                ++i;
            },Time);
        },
        //根据json数据绘制画布,即复现功能
        renderCanvasByJson: function (data) {
            var self = canvasManager;
            var stage = stateManager.stage;
            stage.remove(stateManager.scene);
            var scene = stateManager.scene = new JTopo.Scene(stage);
            var idToNode = {};

             if(!data){return;}
            //分开绘制是因为必须现有节点，后有容器，最后再有连线

            //绘制节点
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (obj['elementType'] == 'node') {
                    idToNode[obj._id] = self._createNode(obj);
                }
            }

            //绘制容器节点、容器
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (obj['elementType'] == 'containerNode') {
                    idToNode[obj._id] =self._createContainerNode(obj,idToNode);
                }
                else if (obj['elementType'] == 'container') {
                    idToNode[obj._id] =self._createContainer(obj,idToNode);
                }
            }

            //绘制线条
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (obj['elementType'] == 'link') {
                    var link = self._createLink(idToNode[obj.nodeAId], idToNode[obj.nodeZId], obj.linkType);
                    scene.add(link);
                }
            }

            //绑定事件
            self.initCanvasEvent();
        },
        //获取画布json数据，即保存功能
        getCanvasToJson: function () {
            var scene = stateManager.scene;
            var attrNodeArr = stateManager.saveNodeAttr;
            var attrContainerNodeArr = stateManager.saveContainerNodeAttr;
            var attrContainerArr = stateManager.saveContainerAttr;
            var attrLinkArr = stateManager.saveLinkAttr;
            var saveArr = [];

            scene.childs.filter(function (obj) {
                var saveObj = {};
                if (obj.elementType == 'node') {
                    for (var i = 0; i < attrNodeArr.length; i++) {
                        var attr = attrNodeArr[i];
                        saveObj[attr] = obj[attr];
                    }
                }
                else if (obj.elementType == 'containerNode') {
                    for (var i = 0; i < attrContainerNodeArr.length; i++) {
                        var attr = attrContainerNodeArr[i];
                        if(attr=='childsArr'){
                            saveObj[attr]=[];
                            for(var j=0;j<obj['childs'].length;j++){
                                saveObj[attr].push(obj['childs'][j]._id);
                            }
                        }else{
                            saveObj[attr] = obj[attr];
                        }
                    }
                }
                else if (obj.elementType == 'container') {

                    for (var i = 0; i < attrContainerArr.length; i++) {
                        var attr = attrContainerArr[i];
                        if(attr=='childsArr'){
                            saveObj[attr]=[];
                            for(var j=0;j<obj['childs'].length;j++){
                                saveObj[attr].push(obj['childs'][j]._id);
                            }
                        }else{
                            saveObj[attr] = obj[attr];
                        }
                    }
                }
                else if (obj.elementType == 'link') {
                    for (var i = 0; i < attrLinkArr.length; i++) {
                        var attr = attrLinkArr[i];
                        if (attr == 'nodeAId') {
                            saveObj[attr] = obj['nodeA']._id;
                        }
                        else if (attr == 'nodeZId') {
                            saveObj[attr] = obj['nodeZ']._id;
                        }
                        else {
                            saveObj[attr] = obj[attr];
                        }
                    }
                }
                saveArr.push(saveObj);
            });
            return saveArr;
        },
        //保存画布json数据
        saveCanvasToJson: function () {
                var saveArr = this.getCanvasToJson();
                var curIndex = stateManager.history.curIndex + 1;
                stateManager.history.arr.length = curIndex;
                stateManager.history.arr.push(saveArr);
                stateManager.history.curIndex = curIndex;
                console.log(stateManager.history.arr, stateManager.history.curIndex);
        },
        //画布事件,包含节点连线事件，可剥离出scene事件
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
            var link = self._createLink(tempNodeA, tempNodeZ);//动态连线

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

                    if (e.target != null &&(e.target instanceof JTopo.Node || e.target instanceof JTopo.Container||e.target instanceof JTopo.ContainerNode) )
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

                            var l = self._createLink(beginNode, endNode);//正式连线
                            scene.add(l);
                            beginNode = null;
                            scene.remove(link);
                        }
                        else {
                            beginNode = null;
                        }
                    }

                    else {
                        scene.remove(link);
                    }
                }
                //点击节点
                if (e.target != null && (e.target instanceof JTopo.Node||e.target instanceof JTopo.Container||e.target instanceof JTopo.ContainerNode))
                {
                    //连线需要点击两次节点
                    if (!beginNode ) {
                        self.saveCanvasToJson();
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
                stateManager.canvasState.pageX = e.x;
                stateManager.canvasState.pageY = e.y;
                tempNodeZ.setLocation(e.x, e.y);
            });
            scene.addEventListener('keyup', function (e) {
                //console.log(e.which);
                switch (e.which) {
                    //删除选中
                    case 8:
                        scene.selectedElements.filter(function (e) {
                            e.childs&&e.childs.length>0&&e.childs.filter(function (child) {
                                 scene.remove(child);
                            });
                            scene.remove(e);
                        })
                        break;
                    //esc，恢复默认
                    case 27:
                        $('.patternArea .toolbar-default').click();
                        break;
                    default:
                        ;
                }
            });

        },
        /******************画布处理，end***************************/



        /******************节点处理，start***************************/
        //创建拖拽后的节点，初始化节点
        createNodeByDrag: function (sNodeName, $thisClone, mDown, thisWidth, thisHeight, pageX, pageY) {
            var scene = stateManager.scene;
            var self = canvasManager;
            var subWidth = pageX - stateManager.equipmentAreaWidth;
            var subHeight=pageY-80;
            var nodeX = subWidth - scene.translateX;//松开鼠标时,元素在画布上的x坐标
            var nodeY = pageY - scene.translateY-80;//松开鼠标时,元素在画布上的y 坐标

            var nodeName = 'node_name';
            var nodeWidth = thisWidth;
            var nodeHight = thisHeight;
            var imgName = '';
            if ($thisClone) {
                nodeName = $thisClone.attr('nodeName');
                imgName = $thisClone.attr('imgName');
                $thisClone.remove()
            }
            if (subWidth > 0 &&subHeight>0&& mDown) {
                var node = new JTopo.Node(nodeName);
                node.setLocation(nodeX, nodeY);
                node.font = "14px Consolas";
                node.fillColor = '255,0,0';
                node.fontColor = '236,105,65';
                node.textPosition = 'Bottom_Center';
                node.textOffsetY = 5;
               // node.alarm='hehe';
                node.setImage('./images/' + imgName + '.jpg');
                node.imgName = imgName;
                node.setSize(nodeWidth, nodeHight);
                self._setNodeEvent(node);
                scene.add(node);
                self.saveCanvasToJson();
            }
        },
        //创建节点
        _createNode: function (obj) {
            var stage = stateManager.stage;
            var scene = stateManager.scene;
            var self = canvasManager;
            var node = new JTopo.Node();
            obj.imgName&&node.setImage('./images/' + obj.imgName + '.jpg');
            for (var i in obj) {
                node[i] = obj[i];
            }
            //node.alarm='hehe';//告警功能演示
            node.parentType!='containerNode'&&self._setNodeEvent(node);
            scene.add(node);
            return node;
        },
        //设置节点的事件
        _setNodeEvent: function (node) {
            var scene = stateManager.scene;
            var self = this;
            var leftAreaWidth = stateManager.equipmentAreaWidth;
            var topAreaHeight = stateManager.toolBarHeight;
            var nodeTitleHeight = $("#nodeTitle").height();
            var nodeTitleWidth = $("#nodeTitle").width();
            node.addEventListener('mouseup', function (e) {
                stateManager.currentNode = this;
                if (e.button == 2) {
                    // 当前位置弹出菜单（div）
                    $("#contextmenuNode").css({
                        top: e.pageY - 40,
                        left: e.pageX - 40
                    }).show();
                }
            });
            node.addEventListener('mousemove', function (e) {
                  $("#nodeTitle").css({
                        left: e.x + leftAreaWidth - nodeTitleWidth / 2+scene.translateX,
                        top: e.y + topAreaHeight - nodeTitleHeight - 30+scene.translateY
                    }).show();
            });
            node.addEventListener('mouseout', function (e) {
                $(".titleDiv").hide()
            });
            node.addEventListener('click', function (e) {

            });
            if (node.alarm) {
                var str = node.alarm;
                setInterval(function () {
                    node.alarm = node.alarm ? null : str;
                }, 1000);
            }
        },
        /******************节点处理，end***************************/




        /******************容器节点处理，start***************************/ //创建拖拽后的容器节点，初始化容器节点
        createContainerNodeByDrag: function (sNodeName, $thisClone, mDown, thisWidth, thisHeight, pageX, pageY)
        {
            var scene = stateManager.scene;
            var self = canvasManager;
            var subWidth = pageX - stateManager.equipmentAreaWidth;
            var subHeight=pageY-80;
            var nodeX = subWidth - scene.translateX;//松开鼠标时,元素在画布上的x坐标
            var nodeY = pageY - scene.translateY-80;//松开鼠标时,元素在画布上的y 坐标

            var nodeName = 'node_name';
            var nodeWidth = thisWidth;
            var nodeHight = thisHeight;
            var imgName = '';
            if ($thisClone) {
                nodeName = $thisClone.attr('nodeName');
                imgName = $thisClone.attr('imgName');
                $thisClone.remove()
            }
            if (subWidth > 0&&subHeight>0 && mDown) {
                //文字
                var textNode=new JTopo.Node();
                textNode.fontColor='43,43,43';
                textNode.text='luozheaoluojie';
                textNode.textBreakNumber=8;
                textNode.textLineHeight=13;

                textNode.textPosition="Bottom_Center";
                textNode.showSelected=false;
                textNode.setSize(0,0);
                textNode.setLocation(nodeX+120,nodeY+20);
                textNode.parentType='containerNode';


                //节点
                var node=new JTopo.Node();
                node.setSize(50,50);
                node.setLocation(nodeX+5,nodeY+50);
                node.showSelected=false;
                node.alarm=null;
                node.setImage('./images/'+imgName+'.jpg');
                node.imgName = imgName;
                node.parentType='containerNode';

                //容器位置,左上角
                var containerLeftTop=new JTopo.Node();
                containerLeftTop.setSize(0,0);
                containerLeftTop.showSelected=false;
                containerLeftTop.setLocation(nodeX,nodeY);
                containerLeftTop.parentType='containerNode';


                //容器位置,右下角
                var containerRightBottom=new JTopo.Node();
                containerRightBottom.setSize(0,0);
                containerRightBottom.showSelected=false;
                containerRightBottom.setLocation(nodeX+150,nodeY+150);
                containerRightBottom.parentType='containerNode';



                //容器本尊
                var container = new JTopo.ContainerNode();
                container.text=nodeName;
                container.textPosition = 'Bottom_Center';
                container.fontColor = '232,31,0';
                container.font = '16px 微软雅黑';
                container.textOffsetY = 5;
                container.alpha=1;
                container.childDragble=false;
                container.borderRadius = 0; // 圆角
                container.fillColor = '154,206,240';
                container.shadowBlur=0.5;
                container.shadowColor= "rgba(0,0,0,0.5)";
                container.zIndex=2;

                scene.add(textNode);
                scene.add(node);
                scene.add(containerLeftTop);
                scene.add(containerRightBottom);

                container.add(textNode);
                container.add(node);
                container.add(containerLeftTop);
                container.add(containerRightBottom);

                scene.add(container);

                self._setContainerNodeEvent(container);
                self.saveCanvasToJson();
            }
        },
        //创建容器节点
        _createContainerNode:function (obj,idToNode) {
            var stage = stateManager.stage;
            var scene = stateManager.scene;
            var self = canvasManager;
            var containerNode = new JTopo.Container('');

            //先增加属性，后添加节点
            for (var i in obj) {
                containerNode[i] = obj[i];
            }
            var childsArr=obj['childsArr'];
            for(var j=0;j< childsArr.length;j++) {
                containerNode.add(idToNode[childsArr[j]]);
            }



             scene.add(containerNode);
             self._setContainerNodeEvent(containerNode);

            return containerNode;
        },
        //设置容器节点的事件
        _setContainerNodeEvent: function (containerNode) {
            var scene = stateManager.scene;
            var self = this;
            containerNode.addEventListener('mouseup', function (e) {
                stateManager.currentContainerNode = this;
                if (e.button == 2) {
                    // 当前位置弹出菜单（div）
                    $("#contextmenuContainerNode").css({
                        top: e.pageY - 40,
                        left: e.pageX - 40
                    }).show();
                }
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
        setNodesToGroup:function () {
            var scene=stateManager.scene;
            var eleArr=scene.selectedElements.filter(function (obj) {
                if(obj.elementType == 'node'){
                    return obj;
                }
            });
            if(eleArr.length>0) {
                var container = new JTopo.Container('');
                container.textPosition = 'Bottom_Center';
                container.fontColor = '22,124,255';
                container.font = '16px 微软雅黑';
                container.textOffsetY = 10;
                container.alarm='haha';
                // container.borderColor = '255,0,0';
                //  container.setBound(10, 10, 300, 200);
                container.borderRadius = 7; // 圆角
                container.fillColor = '234,28,39';

                for (var i = 0; i < eleArr.length; i++) {
                    eleArr[i].selected = false;
                    container.add(eleArr[i]);
                }

                this._setGroupEvent(container);
                scene.add(container);
            }
        },
        //创建容器
        _createContainer:function (obj,idToNode) {
            var stage = stateManager.stage;
            var scene = stateManager.scene;
            var self = canvasManager;
            var container = new JTopo.Container('');

            for (var i in obj) {
                if (i == 'childsArr') {
                     for(var j=0;j< obj[i].length;j++){
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
        _setGroupEvent:function (container) {
            var scene = stateManager.scene;
            var self = this;
            container.addEventListener('mouseup', function (e) {
                stateManager.currentContainer = this;
                if (e.button == 2) {
                    // 当前位置弹出菜单（div）
                    $("#contextmenuContainer").css({
                        top: e.pageY - 40,
                        left: e.pageX - 40
                    }).show();
                }
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
        _createLink: function (sNode, tNode, slinkType) {
            //开始节点，结束节点，线条类型，是否从节点边框外围连接
            var link;
            var self=canvasManager;
            var linkType = slinkType ? slinkType : stateManager.setLink.linkType;
            var arr=['container','containerNode'];//需要从边框连线的节点类型

            if(!sNode || !tNode){return;}

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
                _setArrow(link);
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
                link.direction = 'horizontal'; //horizontal,vertical
            }
            else if (linkType == 'flow') {
                link = new JTopo.Link(sNode, tNode);
                link.arrowsRadius = 10; //箭头大小
                link.PointPathColor = "rgb(255,0,0)";//连线颜色
                _setFlowLink(link);
                link.strokeColor = '22,124,255';
            }
            if (link) {
                this._setLinkEvent(link);
                link.linkType = linkType;
                link.zIndex=1;
                if (!link.strokeColor) {
                    link.strokeColor = '255,0,0';
                }
                if((arr.indexOf(sNode.elementType)>=0||arr.indexOf(tNode.elementType)>=0)){
                    _setLinkForBorder(link);
                }

            }

            /**************辅助方法区************/
            //设置流动线条，辅助方法
            function  _setFlowLink(link) {
                link.paintPath = function (a, b) {
                    if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
                    a.beginPath(),
                        a.moveTo(b[0].x, b[0].y);
                    for (var c = 1; c < b.length; c++) {

                        null == this.dashedPattern ? (
                            (null == this.PointPathColor ? a.lineTo(b[c].x, b[c].y) : a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor))
                        ) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
                    }
                    ;
                    if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                        var d = b[b.length - 2],
                            e = b[b.length - 1];
                        this.paintArrow(a, d, e)
                    }
                }
            }
            //设置双箭头，辅助方法
            function _setArrow(link) {
                link.getStartPosition = function () {
                    var a;
                    return null != this.arrowsRadius && (a = (function (thisl) {
                        var b = thisl.nodeA, c = thisl.nodeZ;
                        var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy),
                            e = b.getBound(),
                            f = JTopo.util.intersectionLineBound(d, e);
                        return f
                    })(this)),
                    null == a && (a = {
                        x: this.nodeA.cx,
                        y: this.nodeA.cy
                    }),
                        a
                };
                link.paintPath = function (a, b) {
                    if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
                    a.beginPath(),
                        a.moveTo(b[0].x, b[0].y);
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
                        this.paintArrow(a, e, d)
                    }
                };
            }
            //设置线条从两节点的边框处连接，默认为从节点中心点连接
            function _setLinkForBorder(link) {
                link.getStartPosition = function() {
                    var a;
                    return (a = (function(thisl){
                        var b=thisl.nodeA,c=thisl.nodeZ;
                        var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy),
                            e = b.getBound(),
                            f = JTopo.util.intersectionLineBound(d, e);
                        return f
                    })(this)),
                    null == a && (a = {
                        x: this.nodeZ.cx,
                        y: this.nodeZ.cy
                    }),
                        a
                };
                link.getEndPosition = function() {
                    var a;
                    return (a = (function (thisl) {
                        var b = thisl.nodeZ, c = thisl.nodeA;
                        var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy),
                            e = b.getBound(),//json对象
                            f = JTopo.util.intersectionLineBound(d, e);
                        return f
                    })(this)),
                    null == a && (a = {
                        x: this.nodeZ.cx,
                        y: this.nodeZ.cy
                    }),
                        a
                };
            }
            return link;
        },
        //设置线条事件
        _setLinkEvent: function (link) {
            var stage = stateManager.stage;
            var scene = stateManager.scene;
            var leftAreaWidth = stateManager.equipmentAreaWidth;
            var topAreaHeight = stateManager.toolBarHeight;
            var nodeTitleHeight = $("#nodeTitle").height();
            var nodeTitleWidth = $("#nodeTitle").width();
            link.addEventListener('mouseup', function (event) {
                stateManager.currentLink = this;
                if (event.button == 2) {// 右键
                    // 当前位置弹出菜单（div）
                    $("#contextmenuLink").css({
                        top: event.pageY - 40,
                        left: event.pageX - 40
                    }).show();
                }
            });
            link.addEventListener('mousemove', function (e) {
                $("#linkTitle").css({
                    left: e.x + leftAreaWidth - nodeTitleWidth / 2 + scene.translateX,
                    top: e.y + topAreaHeight - nodeTitleHeight - 10 + scene.translateY
                }).show();
            });
            link.addEventListener('mouseout', function (e) {
                $(".titleDiv").hide();
            });

        },
        /******************线条处理，end***************************/

        //设置右键目录目录
        _setContextmenu: function () {
            var stage = stateManager.stage;
            var scene = stateManager.scene;
            //节点目录操作
            $("#contextmenuNode a").click(function () {
                var text = $(this).text();
                $("#contextmenuNode").hide();
                if (text == '删除该节点') {
                    scene.remove(stateManager.currentNode);
                    stateManager.currentNode = null;
                }
                else if (text == '撤销上一次操作') {
                    stateManager.currentNode.restore();
                }
                else {
                    stateManager.currentNode.save();
                }
                if (text == '更改颜色') {
                    stateManager.currentNode.fillColor = JTopo.util.randomColor();
                }
                else if (text == '顺时针旋转') {
                    stateManager.currentNode.rotate += 0.5;
                } else if (text == '逆时针旋转') {
                    stateManager.currentNode.rotate -= 0.5;
                } else if (text == '放大') {
                    stateManager.currentNode.scaleX += 0.2;
                    stateManager.currentNode.scaleY += 0.2;
                } else if (text == '缩小') {
                    stateManager.currentNode.scaleX -= 0.2;
                    stateManager.currentNode.scaleY -= 0.2;
                }
            });
            //容器节点目录操作
            $("#contextmenuContainerNode a").click(function () {
                var text = $(this).text();
                $("#contextmenuContainerNode").hide();
                if (text == '删除该节点') {
                    stateManager.currentContainerNode.childs.filter(function(child){
                        scene.remove(child);
                    });
                    scene.remove(stateManager.currentContainerNode);
                    stateManager.currentContainerNode = null;
                }

                else if (text == '更改颜色') {
                    stateManager.currentContainerNode.fillColor = JTopo.util.randomColor();
                }

            });
            //容器目录操作
            $("#contextmenuContainer a").click(function () {
                var text = $(this).text();
                $("#contextmenuContainer").hide();
                if (text == '删除该容器') {
                    scene.remove(stateManager.currentContainer);
                    stateManager.currentContainer = null;
                }
                else if (text == '更改颜色') {
                    stateManager.currentContainer.fillColor = JTopo.util.randomColor();
                }
                else if(text == '重命名'){
                    stateManager.currentContainer.text='我不是容器';
                }

            });
            //线条目录操作
            $("#contextmenuLink a").click(function () {
                var text = $(this).text();
                $("#contextmenuLink").hide();
                if (text == '删除该线条') {
                    scene.remove(stateManager.currentLink);
                    stateManager.currentLink = null;
                }
                else if (text == '撤销上一次操作') {
                    stateManager.currentLink.restore();
                } else {
                    stateManager.currentLink.save();
                }
                if (text == '更改颜色') {
                    stateManager.currentLink.strokeColor = JTopo.util.randomColor();
                }

            });
        },

        init: function () {
            var canvas = stateManager.canvas = document.getElementById('canvas');
            var stage = stateManager.stage = new JTopo.Stage(canvas);
            var scene = stateManager.scene = new JTopo.Scene(stage);

            this.setCanvasStyle();
            this.initCanvasEvent(); //canvas事件初始化
            this._setContextmenu();//右键目录事件



        }
    }


/***************初始化*****************/
stateManager.init();
canvasManager.init();
dragManager.init();
toolbarManager.init();

$('#jumpBox').append($('.TopujumpServer'))




    var zNodes=[
        {
            "code": "default_area",  // 编码，可不用管
            "name": "默认域",   // 目录名称
            "pId": "0",   // 根据pId、id判断层级关系
            "id": "1",
            "type": "0",  // 类型，0 域 1 业务系统 可不用管
            "isLeaf": "false"   // 值为true时，表明其为叶子业务系统，其下无子业务系统，其下关联的是集群、主机、实例。
        },
        {
            "code": "default_group",
            "name": "默认组",
            "pId": "1",
            "id": "2",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "guangdong",
            "name": "广东",
            "pId": "0",
            "id": "3",
            "type": "0",
            "isLeaf": "false"
        },
        {
            "code": "guangzhou",
            "name": "10086系统",
            "pId": "3",
            "id": "4",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "foshan",
            "name": "CRM系统",
            "pId": "3",
            "id": "5",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "sichun",
            "name": "四川",
            "pId": "0",
            "id": "10",
            "type": "0",
            "isLeaf": "false"
        },
        {
            "code": "chengdu",
            "name": "内部ERP系统",
            "pId": "10",
            "id": "11",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "hunan",
            "name": "湖南",
            "pId": "0",
            "id": "12",
            "type": "0",
            "isLeaf": "false"
        },
        {
            "code": "changsha",
            "name": "微信平台系统",
            "pId": "12",
            "id": "13",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "anwei",
            "name": "安徽",
            "pId": "0",
            "id": "14",
            "type": "0",
            "isLeaf": "false"
        },
        {
            "code": "hefei",
            "name": "内部OA系统",
            "pId": "14",
            "id": "15",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "hubei",
            "name": "湖北",
            "pId": "0",
            "id": "16",
            "type": "0",
            "isLeaf": "false"
        },
        {
            "code": "wuhan",
            "name": "电子渠道系统",
            "pId": "16",
            "id": "17",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "gfrms",
            "name": "票据系统",
            "pId": "3",
            "id": "18",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "apm",
            "name": "应用性能管理",
            "pId": "3",
            "id": "19",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "netmgr",
            "name": "性能监控",
            "pId": "3",
            "id": "20",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "setmeal",
            "name": "内部定餐系统",
            "pId": "12",
            "id": "21",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "dcos",
            "name": "DCOS平台",
            "pId": "0",
            "id": "34",
            "type": "0",
            "isLeaf": "false"
        },
        {
            "code": "移动数据中心",
            "name": "移动数据中心",
            "pId": "34",
            "id": "35",
            "type": "1",
            "isLeaf": "false"
        },
        {
            "code": "cmcc_serv1",
            "name": "cmcc_serv1",
            "pId": "35",
            "id": "36",
            "type": "1",
            "isLeaf": "false"
        },
        {
            "code": "history",
            "name": "历史",
            "pId": "36",
            "id": "37",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "cmcc_serv2",
            "name": "cmcc_serv2",
            "pId": "35",
            "id": "38",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "移动数据中心1",
            "name": "移动数据中心1",
            "pId": "34",
            "id": "39",
            "type": "1",
            "isLeaf": "false"
        },
        {
            "code": "cmcc_serv2",
            "name": "cmcc_serv2",
            "pId": "39",
            "id": "40",
            "type": "1",
            "isLeaf": "false"
        },
        {
            "code": "移动数据中心2",
            "name": "移动数据中心2",
            "pId": "34",
            "id": "41",
            "type": "1",
            "isLeaf": "false"
        },
        {
            "code": "cmcc_serv2",
            "name": "cmcc_serv2",
            "pId": "41",
            "id": "42",
            "type": "1",
            "isLeaf": "false"
        },
        {
            "code": "history",
            "name": "历史",
            "pId": "42",
            "id": "43",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "history",
            "name": "历史",
            "pId": "40",
            "id": "44",
            "type": "1",
            "isLeaf": "true"
        },
        {
            "code": "aaaaaaaaa",
            "name": "aaaaaaaaaa",
            "pId": "0",
            "id": "54",
            "type": "0",
            "isLeaf": "false"
        },
        {
            "code": "bbbbbbbbbb",
            "name": "bbbbb",
            "pId": "54",
            "id": "55",
            "type": "1",
            "isLeaf": "true"
        }
    ]







