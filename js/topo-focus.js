/**
 * Created by luozheao on 2017/6/2.
 * topo-main.js中通过模块化封装的方式，提供接口和钩子，来实现拓扑图
 */

define(['topo-main'],function (topoManager) {
    function  init() {


    var stateManager=topoManager.stateManager;
    var dataManager=topoManager.dataManager;
    var toolbarManager=topoManager.toolbarManager;
    var canvasManager=topoManager.canvasManager;
    var dragManager=topoManager.dragManager;
   
/***********数据管理者*************/
//获取后台拓扑图数据
dataManager.getTopoData=function (callback) {
      /**
       * 1\json中的imgName属性，用于存储节点图片名字
       * 2\elementType用于标志节点类型(node、container、containerNode)，必填
       * 3\json中的text用于存储节点名字
       * 4\自定义结点的elementType必须设置为containerNode,且nodeFn需要设置为创建自定义结点的方法名
       * 5\如果自定义结点是拖拽创建，则必须设置id等于_id
       * 6\必填项:id type json(elementType,如果是自定义结点,必填nodeFn) ,其中elementType和type值保持一致
      * */
       var data= {
           "nodes": [
               {
                   "id": "100",
                   "type":'node',
                   "json":"{x:100,y:100,width:52,height:52,elementType:'node',text:'cluster',imgName:'ActiveMQ'}"
               },
               {
                   "id": "101",
                   "type":"node",
                   "json":"{x:250,y:250,width:52,height:52,elementType:'node',imgName:'ActiveMQ'}"
               },
               {
              "id": '102',
              "type":'containerNode',
              "json":'{"imgName":"testIcon","alertLevel":2,"name":"业务系统","msgArr":[["CPU","0.122"],["MEM","0.9"],["Incoming","6.72GB|2GB"],["Outgoing","66.79GB"],["QU-619"]],"elementType":"containerNode","x":300,"y":100,"width":218,"height":95,"strokeColor":"22,124,255","borderColor":"223,226,228","fillColor":"255,255,255","shadow":false,"shadowBlur":10,"shadowColor":"rgba(79,165,219,0.8)","shadowOffsetX":0,"shadowOffsetY":0,"transformAble":false,"zIndex":2,"dragable":true,"selected":false,"showSelected":false,"isMouseOver":false,"childDragble":false,"borderWidth":1,"borderRadius":5,"font":"16px 微软雅黑","fontColor":"232,31,0","text":"","textPosition":"Bottom_Center","textOffsetX":0,"textOffsetY":0,"nodeFn":"createSystemNode"}'
              },
               {
                   "id":'103',
                   "type":'containerNode',
                   "json":'{"nodeFn":"haha","elementType":"containerNode"}'
               }
           ],

           "links": [
               {

                   "from_id": "100",
                   "to_id": "101",
                   "id": "1000",
                   "type":"link",
                   "json":"{elementType:'link',text:'我是线条名字',fontColor:'237,165,72'}"
               }
           ]
       }
       //json属性需要处理成对象
       callback(data)
}
//存储拓扑图数据
dataManager.saveTopoData=function (data) {
      console.log(data);
}
/************工具栏管理者***************/
//用于搜索的属性
toolbarManager.searchArr=['id'];
/*************画布管理者*********/
//结点事件
canvasManager.nodeEvent={
        mouseup:function (e) {
             if(e.which==3){
                 //右键
                  $('#contextmenuNode').css({
                      "left":e.pageX+40,
                      "top":e.pageY-75
                  }).show();
             }
             console.log(e.target);
         },
        mousemove:null,
        mouseout:null,
        dbclick:null
};
//线条事件
canvasManager.linkEvent={
    mouseup:function (e) {
        if(e.which==3){
            //右键
            $('#contextmenuLink').css({
                "left":e.pageX+40,
                "top":e.pageY-75
            }).show();
        }
        console.log(e.target);
    },
        mouseover:null,
        mouseout:null,
        mousemove:null
};
//容器事件
canvasManager.containerEvent={
    mouseup:function (e) {

        if(e.which==3){
            //右键
            $('#contextmenuContainer').css({
                "left":e.pageX+40,
                "top":e.pageY-75
            }).show();
        }
    },
    mouseover:null,
    mouseout:null,
    mousemove:null,
    dbclick:null
}
//自定义节点拓展，样例
canvasManager.userDefinedNodes=[
    {
        fnName:'createSystemNode',
        fn: function(nodeObj){
             var jsonObj=nodeObj.json;
             var _nodeX=jsonObj.x,
                 _nodeY=jsonObj.y,
                 _nodeName=jsonObj.name,
                 _imgName=jsonObj.imgName,
                 _alertLevel=jsonObj.alertLevel,
                 dataArr=jsonObj.msgArr;
            //系统节点
            var scene = stateManager.scene;
            var nodeName=_nodeName;
            var nodeX=_nodeX;
            var nodeY=_nodeY;
            var url='./images/'+_imgName+'.png';
            var alertLevel=_alertLevel.toString();//告警级别


            var containerWidth=245;
            var containerHeight=90;
            var traget1_text=dataArr[0][0];
            var traget1_kVal=dataArr[0][1];

            var traget2_text=dataArr[1][0];
            var traget2_kVal=dataArr[1][1];

            var traget3_text=dataArr[2][0];
            var traget3_text_val=dataArr[2][1];//update

            var traget4_text=dataArr[3][0];
            var traget4_text_val=dataArr[3][1];//updata

            var traget5_text=dataArr[4][0];
            var tragetX=90;
            var tragetY=30;
            var tragetSubY=15.7;
            var scene=stateManager.scene;

            var max1=JTopo.flag.graphics.measureText(traget3_text_val).width;
            var max2=JTopo.flag.graphics.measureText(traget4_text_val).width;
           var max=Math.max(max1,max2);
           if(max>70){
               containerWidth+=max-60;
           }
            //图片
            var node = new JTopo.Node();
            node.setSize(50, 50);
            node.setLocation(nodeX + 15, nodeY + 10);
            node.showSelected = false;
            node.alarm = null;
            node.setImage(url);
            node.parentType = 'containerNode';
            node.dragable=false;
            node.nodeFn='icon';

            //告警
            var circleNode =new JTopo.Node();
            circleNode.setSize(19,19);
            circleNode.setLocation(nodeX+5,nodeY+5);
            circleNode.fillColor='192,223,246';
            circleNode.font='12px Consolas';
            var alertImgName=null;
            switch (alertLevel){
                case "0":
                    //正常
                    circleNode.visible=false;
                    break;
                case "1":
                    //没数据
                    circleNode.setImage('./images/alertIcon.png');
                    break;
                case "2":
                    //黄色告警
                    circleNode.setImage('./images/alertIcon2.png');
                   JTopo.util.nodeFlash(circleNode,true,true,[202,202,202],[244,102,58]);//node,isChangeColor,isFlash,originColor,changeColor
                    break;
                case "3":
                    //红色告警
                    circleNode.setImage('./images/alertIcon2.png');
                     JTopo.util.nodeFlash(circleNode,true,true,[202,202,202],[222,81,69]);
                    break;
            }

            circleNode.parentType = 'containerNode';



            //容器标题文字
            var textNode = new JTopo.Node();
            textNode.fontColor = '43,43,43';
            textNode.font = "14px Consolas";
            textNode.text =nodeName;
            textNode.textPosition = "Bottom_Center";
            textNode.showSelected = false;
            textNode.setSize(0, 0);
            textNode.setLocation(nodeX + 35, nodeY + 68);
            textNode.parentType = 'containerNode';
            textNode.nodeFn='title';




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
            containerRightBottom.setLocation(nodeX + containerWidth, nodeY + containerHeight);
            containerRightBottom.parentType = 'containerNode';
            containerRightBottom.nodeFn='pRight';

            //容器本尊
            var container = new JTopo.ContainerNode();
            container.textPosition = 'Bottom_Center';
            container.fontColor = '232,31,0';
            container.font = '16px 微软雅黑';
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
            container.id=container._id;

            //指标信息
            sugarTragetText(traget1_text,0);
            sugarTragetText(traget2_text,1);
            sugarTragetText(traget3_text,2);
            sugarTragetText(traget3_text_val,2,"107,205,243",null,70);
            sugarTragetText(traget4_text,3);
            sugarTragetText(traget4_text_val,3,"107,205,243",null,70);
            sugarTragetText(traget5_text,4.2,'198,200,201',12);
            sugarProgressNode('213,223,235',"#f4c63a",traget1_kVal,80,7,120,10,traget1_kVal*100+'%');//update
            sugarProgressNode('213,223,235',"#1bbab9",traget2_kVal,80,7,120,25,traget2_kVal*100+'%');
            function sugarTragetText(text,subYIndex,textColor,fontSize,offsetX) {
                var _offsetX=offsetX||0;
                var tragetNode = new JTopo.Node();
                tragetNode.fontColor = textColor||'94,144,198';
                tragetNode.font = (fontSize||14)+"px Consolas";
                tragetNode.text =text;
                tragetNode.textPosition = "Bottom_Right";
                tragetNode.showSelected = false;
                tragetNode.setSize(0, 0);
                tragetNode.setLocation(nodeX + tragetX+_offsetX, nodeY + tragetY+subYIndex*tragetSubY);
                tragetNode.parentType = 'containerNode';
                tragetNode.borderWidth=0;
                tragetNode.textOffsetY=-25;
                tragetNode.nodeFn='traget';
                scene.add(tragetNode);
                container.add(tragetNode);
            }
            function sugarProgressNode(fillColor,targetColor,kVal,_width,_height,pos_x,pos_y,percVal) {//update
                var progressNode=new JTopo.Node();
                var width=_width||85;
                var height=_height||7;
                var _pos_x=pos_x||125;
                var _pos_y=pos_y||10;
                var _percVal=percVal||0;
                progressNode.setSize(width,height);
                progressNode.setLocation(nodeX+_pos_x,nodeY+_pos_y);
                progressNode.linearGradient=[0,0,width,height];
                progressNode.colorStop=[0,targetColor,1,targetColor];//"#f4c63a"
                progressNode.kVal=kVal;
                progressNode.borderRadius=4;
                progressNode.showSelected=false;
                progressNode.fillColor=fillColor;//'213,223,235';
                progressNode.parentType = 'containerNode';
                progressNode.textPosition="Middle_Right";
                progressNode.fontColor = '94,144,198';
                progressNode.font = '10px 微软雅黑';
                progressNode.text=percVal;
                progressNode.textOffsetY=-2;
                progressNode.textOffsetX=2;
                scene.add(progressNode);
                container.add(progressNode);
            }

            container.add(textNode);
            container.add(node);
            container.add(circleNode);
            container.add(containerLeftTop);
            container.add(containerRightBottom);

            scene.add(textNode);
            scene.add(node);
            scene.add(circleNode);
            scene.add(containerLeftTop);
            scene.add(containerRightBottom);
            scene.add(container);
            //添加事件

            return container ;

        },
        event:{
            'mouseup':null,
            'dbclick':null,
            'mousemove':null,
            'mouseover':null,
            'mouseout':null,

        }
    },
    {
        "fnName":'haha',
        fn:function (nodeObj) {
            var node=new JTopo.Node('luojie');
            node.setSize(100,100);
            node.setLocation(200,200);
            node.fillColor='43,43,43';

            stateManager.scene.add(node);
            node.paintCallback=function (ctx) {
                ctx.strokeColor='#e8e8e8';
                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.lineTo(250,0);
                ctx.stroke();
                ctx.closePath();
            }

            //添加事件

            return node;
        },
        event:{
            'mouseup':function (e) {
                console.log(e.target);
            },
            'dbclick':null,
            'mousemove':null,
            'mouseover':null,
            'mouseout':null,
        }
    }
];
canvasManager.renderTopoCallback=function () {}

/****拖拽管理者**************/
//鼠标按下时的处理
dragManager.dragMouseDown=function($thisClone,positionX,positionY){
    $thisClone.css({
        "zIndex": "1",
        'left': positionX+5,
        'top': positionY+5,
        'position':'absolute',
        'padding-left':'0',
        'margin':0
    });
}
//鼠标松开时的处理
dragManager.dragMouseUp=function ($thisClone, mDown, thisWidth, thisHeight, pageX, pageY) {
    if ($thisClone) {
        canvasManager.createNodeByDrag($thisClone, mDown, thisWidth, thisHeight, pageX, pageY);
    }
}

/*********其他开发者自定义拓展**********************************************************/
//右键删除
$('.contextmenu li').click(function () {
     var $this=$(this);
     if($this.hasClass('del')){
         stateManager.scene.remove(stateManager.currentChooseElement);
     }
     else if($this.hasClass('rename')){

     }
     $('.contextmenu').hide();
});
/*****注入用于拖拽的图标********/
//数据层
var getDragData=function () {
    var data = [
        {
            imgName: 'android',
            type:'node',
            name: '安卓'
        },
        {
            imgName: 'apple',
            type:'node',
            name: '苹果'
        }
    ]
    return data;
}
//显示层
var showDragIcon=function (data) {
    /****
     * dragTag用于标志可以拖动
     */

    var html="";
    for(var i=0;i<data.length;i++){
          var obj =data[i];
          var jsonStr=JSON.stringify(obj);

          html +='<div class="dragTag '+obj.imgName+'" title="'+obj.name+'"  json='+jsonStr+' ><div class="dragNodeName">'+obj.name+'</div></div>';
    }
   return html;
}
//控制层
var setDragIcon=function () {
     var data=getDragData();
     var html=showDragIcon(data);
     $('.iconContainer .basicIconTag').html(html);

}
/************执行*************/
setDragIcon();
topoManager.init();
    }
    return init;
});