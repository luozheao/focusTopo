/**
 * Created by luozheao on 2017/6/2.
 * topo-main.js中通过模块化封装的方式，提供接口和钩子，来实现拓扑图
 */


/***********数据管理者*************/
//获取后台拓扑图数据
dataManager.getTopoData=function (callback) {
       var data= {
           "nodes": [
               {
                   "id": "100",

                   "json":"{x:100,y:100}"
               },
               {
                   "id": "101",
                   "json":"{x:300,y:300}"
               }
           ],

           "links": [
               {

                   "from_id": "100",
                   "to_id": "101",
                   "id": "1000",
                   "json":"{}"
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
canvasManager.nodeEvent={
        mouseup:function (e) {
             console.log(e);
             if(e.which==3){
                 //右键
                  $('#contextmenuNode').css({
                      "left":e.pageX+40,
                      "top":e.pageY-75
                  }).show();
             }
         },
        mousemove:null,
        mouseout:null,
        dbclick:null
};
canvasManager.linkEvent={
        mouseup:null,
        mouseover:null,
        mouseout:null,
        mousemove:null
};
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

/*********其他开发者自定义拓展************************************************/
//右键删除
$('.contextmenu li').click(function () {
     var $this=$(this);
     if($this.hasClass('del')){
         stateManager.scene.remove(stateManager.currentChooseElement);
     }
     $('.contextmenu').hide();
});
/*****注入用于拖拽的图标********/
//数据层
var getDragData=function () {
    var data = [
        {
            imgName: 'android',
            name: '安卓'
        },
        {
            imgName: 'apple',
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
          var str='';
          for(var j in obj){
              str+= j+"="+obj[j]+"  "
          }
          html +='<div class="dragTag '+obj.imgName+'" title="'+obj.name+'"   '+str+' ><div class="dragNodeName">'+obj.name+'</div></div>';
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