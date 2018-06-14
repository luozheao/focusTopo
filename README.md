# focusTopo
## 代码文件介绍
   插件主要由三个js文件构成: 
   1. 源码文件:[jtopo-0.4.8.js](http://www.jtopo.com/) 
   2. 封装代码文件:topo-main.js  基于源码进行的封装 (下文主要针对topo-main.js里面的接口进行介绍)
   3. 业务代码文件:topo-focus.js 调用封装代码文件暴露的接口
   
   其中封装代码由以下几个模块构成:
   
   >状态管理者 
    
    用于存放全局状态,比如选中一个节点,右侧滑出弹窗,弹窗展现节点的属性,stateManager.currentNode表示当前选中的节点
    具体属性见stateManager里的详细注释.
    
   >权限管理者
   
    未完成,等待勇敢的少年来拓展
   
   >弹窗管理者
   
     未完成,等待勇敢的少年来拓展
   
   >工具栏管理者
     
     包含放大\缩小\全屏\鹰眼\线条类型选择等功能,没难度
     
   >拖拽管理者
   
     用于管理从左下角拖拽图标到画布上生成节点,用了个drag.js插件(几十行代码,没难度)
   
   >画布管理者
   
     包含节点/线条/容器的创建与相关的事件,以及数据的保存和呈现
   
   >数据管理者
   
     用于接受topo数据,并展示到画不上来
   
   >节点排列管理者
   
     用于将生成的节点,自动排列起来.具体算法思路是:
     1. 随便找个节点作为根节点R
     2. 找到所有跟R相连接的节点,作为第二层
     3. 找到所有跟第二层相连接的节点,作为第三次
     4. 重复2和3,直到所有节点排列完成
     5. 上述算法可以进一步从美观上优化,勇敢的少年,等你来拓展了
   
## 接口介绍
   ### 1.节点
   - 1.1通过拖拽创建节点 
   
    createNodeByDrag: function ($thisClone, mDown, e) 
   - 1.2通过后台数据创建节点
   
    _createNode: function (obj)
   - 1.3 节点文字换行
    
    node.text='luozheao$luojie',加上$符号,即可换行
   ### 2.线条 
   - 2.1创建线条 
   
    _createLink: function (sNode, tNode,linkObj)
   ### 3.容器
   - 3.1直接在画布上设置容器 
   
    setNodesToGroup: function (nodeArr,jsonObj)   
   - 3.2通过后台数据创建容器 
   
    _createContainer: function (obj, idToNode)      
   ### 4.数据的展示与复现
   - 4.1数据的展示 
   
    renderTopo:function (data,type) 
   - 4.2数据的复现 
   
    saveTopo:function (callback,changeData) 
   ### 5.辅助方法与全局属性
   - 设置节点图片闪动 
   
    JTopo.util.nodeFlash=function (node,isChangeColor,isFlash,originColor,changeColor)
    node:节点对象
    isChangeColor:bool值,图片是否变色
    isFlash:bool值,图片是否闪动
    originColor:指定图片中用于变色的底色
    changeColor:指定变成的颜色 
   - 画布对象
   
    JTopo.flag.graphics:即canvas对象本身 ,用于拓展节点时,拿到画笔    
   - 画布场景对象
   
    JTopo.flag.curScene: 用户获取当前画布的属性,比如获取画布上所有的节点JTopo.flag.curScene.childs.forEach(function(child){})
   
