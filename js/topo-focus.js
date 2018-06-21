/**
 * topo-focus.js: 业务代码文件，调用封装代码文件(topo-main.js)暴露的接口
 *
 * Created by luozheao on 2017/6/2.
 * topo-main.js 中通过模块化封装的方式，提供接口和钩子，来实现拓扑图
 *
 * Modified by point on 20180614
 */

define(
  ['jtopo', 'topo-main'],
  function (JTopo, topoManager) {
    // initialize data
    function init() {
      /******************初始化,start***********************/
      let stateManager = topoManager.stateManager         // 状态管理者
      let canvasManager = topoManager.canvasManager       // 画布管理者
      let dataManager = topoManager.dataManager           // 数据管理者
      let toolbarManager = topoManager.toolbarManager     // 工具栏管理者
      let dragManager = topoManager.dragManager           // 拖拽管理者
      let nodesRankManager = topoManager.nodesRankManager // 节点排列管理者

      stateManager.formatContainerNodes = ['id', 'type', 'json']
      stateManager.formatNodes = ['id', 'type', 'json']
      stateManager.formatContainers = ['id', 'type', 'json']
      stateManager.formatLinks = ['id', 'type', 'json', 'from_id', 'to_id']
      stateManager.isCreateGroupByDrag = true // 是否通过拖拽创建组

      toolbarManager.searchArr = ['id'] //用于搜索的属性
      /******************初始化,end***********************/

      /***********数据管理者*************/
      //获取后台拓扑图数据
      dataManager.getTopoData = function (callback) {
        /**
         * json 数据：
         * 1、imgName 属性，用于存储节点图片名字
         * 2、elementType 用于标志节点类型(node、container、containerNode)，必填
         * 3、json 中的 text 用于存储节点名字
         * 4、自定义结点的 elementType 必须设置为 containerNode，且 nodeFn 需要设置为创建自定义结点的方法名
         * 5、如果自定义结点是拖拽创建，则必须设置 id 等于 _id
         * 6、必填项：id type json (elementType，如果是自定义结点，必填 nodeFn)
         * 7、type 为 node 时，如果 elementType 为 node，则为普通节点，如果 elementType 为 containerNode，则为自定义节点
         * 8、type 为 containerNode，elementType 也为 containerNode，则为自定义容器节点
         */

        let data = {
          "nodes": [
            // {
            //     "id": "100",
            //     "type": 'node',
            //     "json": "{x:100,y:100,width:128,height:128,ellipsisLength:5,text:'1232323',detailText:'我是线条名字123231423124',textAlign:'center',elementType:'node',imgName:'z'}"
            // },
            {
              "id": "101",
              "type": "node",
              "json": "{x:160,y:100,width:185,height:85,text:'liyin$xing',textAlign:'left',elementType:'node',imgName:''}"
            },
            // {
            //     "id": "102",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "103",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "104",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "105",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "106",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "107",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "108",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "109",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "110",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            //
            // {
            //     "id": "111",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "112",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "113",
            //     "type": "node",
            //     "json": "{x:220,y:100,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     "id": "103",
            //     "type": "node",
            //     "json": "{x:100,y:400,width:52,height:52,text:'liyinxing',elementType:'node',imgName:'apple'}"
            // },
            // {
            //     'id':'104',
            //     'type':'container',
            //
            //     'json':"{elementType:'container',borderBgFillColor:'10,10,100',borderBgAlpha:'0.1',childsArr:['100','101'],text:'luozheao'}"
            // },
            //  {
            // "id": '102',
            // "type":'containerNode',
            // "json":'{"imgName":"testIcon","alertLevel":2,"name":"业务系统","msgArr":[["CPU","0.122"],["MEM","0.9"],["Incoming","6.72GB|2GB"],["Outgoing","66.79GB"],["QU-619"]],"elementType":"containerNode","x":300,"y":100,"width":218,"height":95,"strokeColor":"22,124,255","borderColor":"223,226,228","fillColor":"255,255,255","shadow":false,"shadowBlur":10,"shadowColor":"rgba(79,165,219,0.8)","shadowOffsetX":0,"shadowOffsetY":0,"transformAble":false,"zIndex":2,"dragable":true,"selected":false,"showSelected":false,"isMouseOver":false,"childDragble":false,"borderWidth":1,"borderRadius":5,"font":"16px 微软雅黑","fontColor":"232,31,0","text":"","textPosition":"Bottom_Center","textOffsetX":0,"textOffsetY":0,"nodeFn":"createSystemNode"}'
            // },
            {
              "id": '102_1',
              "type": 'containerNode',
              "json": '{"imgName":"testIcon","alertLevel":2,"name":"业务系统","msgArr":[["CPU","0.122"],["MEM","0.9"],["Incoming","6.72GB|2GB"],["Outgoing","66.79GB"],["QU-619"]],"elementType":"containerNode","x":600,"y":100,"width":218,"height":95,"strokeColor":"22,124,255","borderColor":"223,226,228","fillColor":"255,255,255","shadow":false,"shadowBlur":10,"shadowColor":"rgba(79,165,219,0.8)","shadowOffsetX":0,"shadowOffsetY":0,"transformAble":false,"zIndex":2,"dragable":true,"selected":false,"showSelected":false,"isMouseOver":false,"childDragble":false,"borderWidth":1,"borderRadius":5,"font":"16px 微软雅黑","fontColor":"232,31,0","text":"","textPosition":"Bottom_Center","textOffsetX":0,"textOffsetY":0,"nodeFn":"hostNode"}'
            },
            //  {
            //      "id":'103',
            //      "type":'node',
            //      "json":'{"nodeFn":"haha","elementType":"containerNode"}'
            //  }
          ],
          "links": [
            {

              "from_id": "100",
              "to_id": "101",
              "id": "1000",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "100",
              "to_id": "102",
              "id": "1001",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "101",
              "to_id": "103",
              "id": "1002",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "102",
              "to_id": "104",
              "id": "1003",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "102",
              "to_id": "105",
              "id": "1004",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "104",
              "to_id": "106",
              "id": "1005",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "104",
              "to_id": "107",
              "id": "1006",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "105",
              "to_id": "107",
              "id": "1007",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "106",
              "to_id": "108",
              "id": "1008",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "107",
              "to_id": "108",
              "id": "1009",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "107",
              "to_id": "109",
              "id": "1010",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "105",
              "to_id": "102",
              "id": "1011",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },

            {

              "from_id": "111",
              "to_id": "112",
              "id": "1012",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
            {

              "from_id": "111",
              "to_id": "113",
              "id": "1013",
              "type": "link",
              "json": "{elementType:'link',linkType:'flow',text:'我是线条名字',fontColor:'237,165,72'}"
            },
          ]
        }
        //json 属性需要处理成对象（json 字符串和 json 对象之间的相互转换）
        callback(data) // undefined

        nodesRankManager.setNodesRank(data, "100", {
          subWidth: 200,
          subHeight: 200,
          originX: 200,
          originY: 100,
        }, 'tree')
        // nodesRankManager.setNodesRank(data,"100",{
        //     subRadius:100,
        //     originX:400,
        //     originY:400,
        // },'ring')
      }

      //存储拓扑图数据
      dataManager.saveTopoData = function (data) {
        console.log('save data: ')
        console.log(data)
      }

      /*************画布管理者*********/
      canvasManager.beforeCreateLink = function (link) {
        return !stateManager.setLink.isSetting
      }

      // 画圆
      function drawCircle(fillColor, ctx, nodeObj) {
        // ctx.imageSmoothingEnabled = true
        ctx.scale(.5, .5)
        ctx.clearRect(-nodeObj.width / 2, -nodeObj.height / 2, nodeObj.width, nodeObj.height)
        ctx.beginPath()
        ctx.fillStyle = fillColor
        ctx.arc(0, 0, 80, 0, Math.PI * 2)
        ctx.fill()
        //ctx.scale(2, 2)
      }
      let i = 0
      // 结点事件
      canvasManager.nodeEvent = {
        mouseup: function (e) {// 在节点上释放鼠标键时的事件处理过程
          if (e.which === 3) {
            //右键：在节点上释放鼠标右键时的事件处理：弹出框
            $('#contextmenuNode')
              .css({
                "top": e.pageY - 75,
                "left": e.pageX + 40
              })
              .show()
          }
          //结点本身图片闪动
          JTopo.util.nodeFlash(e.target, true, true, [148,193,90], [227,38,49])

          ++i
          console.log(i%2)
          e.target.beforePaintCallback=function (a) {
              // 填色
              drawCircle(i%2?'blue':'red',a,e.target)
          }
        },
        mousemove: function () { // 在节点上移动鼠标键时的事件处理过程：鼠标光标变成小手
          $('#canvas')
            .attr('style','cursor:pointer')
        },
        mouseover: function (e) { // 当鼠标悬浮在节点上时的事件处理过程
          // $('#nodeTitle').show()
          // JTopo.util.setPopPos($('#nodeTitle'),e.target.id,0,0)

          //设置鼠标形状
          $('#canvas')
            .attr('style','cursor:pointer')
        },
        mousedown: function (e) { // 在节点上按下鼠标键时的事件处理过程

        },
        mouseout: function (e) { // 当鼠标移出节点时的事件处理过程
          //设置鼠标形状
          $('#canvas')
            .attr('style','cursor:default')
        },
        dbclick: null // 鼠标双击时的事件处理过程
      }
      //线条事件
      canvasManager.linkEvent = {
        mouseup: function (e) {
          if (e.which === 3) {
            //右键
            $('#contextmenuLink')
              .css({
                "left": e.pageX + 40,
                "top": e.pageY - 75
              })
              .show()
          }
          // console.log(e.target)
        },
        mouseover: null,
        mouseout: function (e) {
          // console.log(e.target)
        },
        mousemove: null,
        dbclick: null
      }
      //容器事件
      canvasManager.containerEvent = {
        mouseup: function (e) {
          // console.log(e.target)
          if (e.which === 3) {
            //右键
            $('#contextmenuContainer')
              .css({
                "left": e.pageX + 40,
                "top": e.pageY - 75
              })
              .show()
          }
        },
        mouseover: null,
        mouseout: null,
        mousemove: null,
        dbclick: null
      }
      //画布事件
      canvasManager.sceneEvent = {
        mouseup: function (e) {
          // console.log(e)
        },
        mousedrag: function (e) {
          // console.log(e)
        }
      }
      //自定义节点拓展，样例
      canvasManager.userDefinedNodes = [
        {
          fnName: 'createSystemNode',
          fn: function (nodeObj) {
            const jsonObj = nodeObj.json;
            const _nodeX = jsonObj.x,
              _nodeY = jsonObj.y,
              _nodeName = jsonObj.name,
              _imgName = jsonObj.imgName,
              _alertLevel = jsonObj.alertLevel,
              dataArr = jsonObj.msgArr;
            //系统节点
            let scene = stateManager.scene
            const nodeName = _nodeName;
            const nodeX = _nodeX;
            const nodeY = _nodeY;
            const url = './images/' + _imgName + '.png';
            const alertLevel = _alertLevel.toString();//告警级别

            let containerWidth = 245;
            const containerHeight = 90;
            const traget1_text = dataArr[0][0];
            const traget1_kVal = dataArr[0][1];

            const traget2_text = dataArr[1][0];
            const traget2_kVal = dataArr[1][1];

            const traget3_text = dataArr[2][0];
            const traget3_text_val = dataArr[2][1];//update

            const traget4_text = dataArr[3][0];
            const traget4_text_val = dataArr[3][1];//updata

            const traget5_text = dataArr[4][0];
            const tragetX = 90;
            const tragetY = 30;
            const tragetSubY = 15.7;

            const max1 = JTopo.flag.graphics.measureText(traget3_text_val).width;
            const max2 = JTopo.flag.graphics.measureText(traget4_text_val).width;
            const max = Math.max(max1, max2);
            if (max > 70) {
              containerWidth += max - 60
            }
            //图片
            const node = new JTopo.Node();
            node.setSize(50, 50)
            node.setLocation(nodeX + 15, nodeY + 10)
            node.showSelected = false
            node.alarm = null
            node.setImage(url)
            node.parentType = 'containerNode'
            node.dragable = false
            node.nodeFn = 'icon'

            //告警
            const circleNode = new JTopo.Node();
            circleNode.setSize(19, 19)
            circleNode.setLocation(nodeX + 5, nodeY + 5)
            circleNode.fillColor = '192,223,246'
            circleNode.font = '12px Consolas'
            const alertImgName = null;
            switch (alertLevel) {
              case "0":
                //正常
                circleNode.visible = false
                break
              case "1":
                //没数据
                circleNode.setImage('./images/alertIcon.png')
                break
              case "2":
                //黄色告警
                circleNode.setImage('./images/alertIcon2.png')
                JTopo.util.nodeFlash(circleNode, true, true, [202, 202, 202], [244, 102, 58])//node,isChangeColor,isFlash,originColor,changeColor
                break
              case "3":
                //红色告警
                circleNode.setImage('./images/alertIcon2.png')
                JTopo.util.nodeFlash(circleNode, true, true, [202, 202, 202], [222, 81, 69])
                break
            }

            circleNode.parentType = 'containerNode'

            //容器标题文字
            const textNode = new JTopo.Node();
            textNode.fontColor = '43,43,43'
            textNode.font = "14px Consolas"
            textNode.text = nodeName
            textNode.textPosition = "Bottom_Center"
            textNode.showSelected = false
            textNode.setSize(0, 0)
            textNode.setLocation(nodeX + 35, nodeY + 68)
            textNode.parentType = 'containerNode'
            textNode.nodeFn = 'title'

            //容器位置,左上角
            const containerLeftTop = new JTopo.Node();
            containerLeftTop.setSize(0, 0)
            containerLeftTop.showSelected = false
            containerLeftTop.setLocation(nodeX, nodeY)
            containerLeftTop.parentType = 'containerNode'
            containerLeftTop.nodeFn = 'pLeft'

            //容器位置,右下角
            const containerRightBottom = new JTopo.Node();
            containerRightBottom.setSize(0, 0)
            containerRightBottom.showSelected = false
            containerRightBottom.setLocation(nodeX + containerWidth, nodeY + containerHeight)
            containerRightBottom.parentType = 'containerNode'
            containerRightBottom.nodeFn = 'pRight'

            //容器本尊
            const container = new JTopo.ContainerNode();
            container.textPosition = 'Bottom_Center'
            container.fontColor = '232,31,0'
            container.font = '16px 微软雅黑'
            container.alpha = 1
            container.childDragble = false
            container.borderRadius = 5 // 圆角
            container.borderWidth = 1
            container.borderColor = '223,226,228'
            container.fillColor = '255,255,255'
            container.shadowBlur = 10
            container.shadowColor = "rgba(79,165,219,0.8)"
            container.zIndex = 2
            container.nodeFn = 'containerNode'
            container.id = container._id

            //指标信息
            sugarTragetText(traget1_text, 0)
            sugarTragetText(traget2_text, 1)
            sugarTragetText(traget3_text, 2)
            sugarTragetText(traget3_text_val, 2, "107,205,243", null, 70)
            sugarTragetText(traget4_text, 3)
            sugarTragetText(traget4_text_val, 3, "107,205,243", null, 70)
            sugarTragetText(traget5_text, 4.2, '198,200,201', 12)
            sugarProgressNode('213,223,235', "#f4c63a", traget1_kVal, 80, 7, 120, 10, traget1_kVal * 100 + '%')//update
            sugarProgressNode('213,223,235', "#1bbab9", traget2_kVal, 80, 7, 120, 25, traget2_kVal * 100 + '%')

            function sugarTragetText(text, subYIndex, textColor, fontSize, offsetX) {
              const _offsetX = offsetX || 0;
              const tragetNode = new JTopo.Node();
              tragetNode.fontColor = textColor || '94,144,198'
              tragetNode.font = (fontSize || 14) + "px Consolas"
              tragetNode.text = text
              tragetNode.textPosition = "Bottom_Right"
              tragetNode.showSelected = false
              tragetNode.setSize(0, 0)
              tragetNode.setLocation(nodeX + tragetX + _offsetX, nodeY + tragetY + subYIndex * tragetSubY)
              tragetNode.parentType = 'containerNode'
              tragetNode.borderWidth = 0
              tragetNode.textOffsetY = -25
              tragetNode.nodeFn = 'traget'
              scene.add(tragetNode)
              container.add(tragetNode)
            }

            function sugarProgressNode(fillColor, targetColor, kVal, _width, _height, pos_x, pos_y, percVal) {//update
              const progressNode = new JTopo.Node();
              const width = _width || 85;
              const height = _height || 7;
              const _pos_x = pos_x || 125;
              const _pos_y = pos_y || 10;
              const _percVal = percVal || 0;
              progressNode.setSize(width, height)
              progressNode.setLocation(nodeX + _pos_x, nodeY + _pos_y)
              progressNode.linearGradient = [0, 0, width, height]
              progressNode.colorStop = [0, targetColor, 1, targetColor]//"#f4c63a"
              progressNode.kVal = kVal
              progressNode.borderRadius = 4
              progressNode.showSelected = false
              progressNode.fillColor = fillColor//'213,223,235'
              progressNode.parentType = 'containerNode'
              progressNode.textPosition = "Middle_Right"
              progressNode.fontColor = '94,144,198'
              progressNode.font = '10px 微软雅黑'
              progressNode.text = percVal
              progressNode.textOffsetY = -2
              progressNode.textOffsetX = 2
              scene.add(progressNode)
              container.add(progressNode)
            }

            container
              .add(textNode)
              .add(node)
              .add(circleNode)
              .add(containerRightBottom)
              .add(containerLeftTop)

            scene
              .add(textNode)
              .add(node)
              .add(circleNode)
              .add(containerLeftTop)
              .add(containerRightBottom)
              .add(container)
            //添加事件

            return container
          },
          event: {
            'mouseup': function (e) {
              // console.log(e.target)
            },
            'dbclick': null,
            'mousemove': null,
            'mouseover': null,
            'mouseout': null,
          }
        },
        {
          fnName: 'haha',
          fn: function (nodeObj) {
            const node = new JTopo.Node('luojie');
            node.setSize(100, 100)
            node.setLocation(0, 0)
            node.fillColor = '43,43,43'

            stateManager.scene.add(node)

            node.paintCallback = function (ctx) {
              ctx.strokeColor = '#e8e8e8'
              ctx.beginPath()
              ctx.moveTo(0, 0)
              ctx.lineTo(250, 0)
              ctx.stroke()
              ctx.closePath()
            }

            //添加事件

            return node
          },
          event: {
            'mouseup': function (e) {
              // console.log(e.target)
            },
            'dbclick': null,
            'mousemove': null,
            'mouseover': null,
            'mouseout': null,
          }
        },
        {
          fnName: 'hostNode',
          fn: function (nodeObj) {
            const jsonObj = nodeObj.json;
            const _nodeX = jsonObj.x,
              _nodeY = jsonObj.y,
              _nodeName = jsonObj.name,
              _imgName = jsonObj.imgName,
              _alertLevel = jsonObj.alertLevel,
              dataArr = jsonObj.msgArr;

            //系统节点
            const scene = stateManager.scene;
            const nodeName = _nodeName;
            const nodeX = _nodeX;
            const nodeY = _nodeY;
            const url = './images/' + _imgName + '.png';


            let containerWidth = 245;
            const containerHeight = 90;
            const traget1_text = dataArr[0][0];
            const traget1_kVal = dataArr[0][1];

            const traget2_text = dataArr[1][0];
            const traget2_kVal = dataArr[1][1];

            const traget3_text = dataArr[2][0];
            const traget3_text_val = dataArr[2][1];//update

            const traget4_text = dataArr[3][0];
            const traget4_text_val = dataArr[3][1];//updata

            const traget5_text = dataArr[4][0];
            const tragetX = 90;
            const tragetY = 30;
            const tragetSubY = 15.7;


            const max1 = JTopo.flag.graphics.measureText(traget3_text_val).width;
            const max2 = JTopo.flag.graphics.measureText(traget4_text_val).width;
            const max = Math.max(max1, max2);
            if (max > 70) {
              containerWidth += max - 60
            }

            //图片
            const node = new JTopo.Node();
            node.setSize(50, 50)
            node.setLocation(nodeX + 15, nodeY + 10)
            node.showSelected = false
            node.alarm = null
            node.setImage(url)
            node.parentType = 'containerNode'
            node.dragable = false
            node.nodeFn = 'icon'

            //容器标题文字
            const textNode = new JTopo.Node();
            textNode.fontColor = '43,43,43'
            textNode.font = "14px Consolas"
            textNode.text = nodeName
            textNode.textPosition = "Bottom_Center"
            textNode.showSelected = false
            textNode.setSize(0, 0)
            textNode.setLocation(nodeX + 35, nodeY + 68)
            textNode.parentType = 'containerNode'
            textNode.nodeFn = 'title'


            //容器位置,左上角
            const containerLeftTop = new JTopo.Node();
            containerLeftTop.setSize(0, 0)
            containerLeftTop.showSelected = false
            containerLeftTop.setLocation(nodeX, nodeY)
            containerLeftTop.parentType = 'containerNode'
            containerLeftTop.nodeFn = 'pLeft'

            //容器位置,右下角
            const containerRightBottom = new JTopo.Node();
            containerRightBottom.setSize(0, 0)
            containerRightBottom.showSelected = false
            containerRightBottom.setLocation(nodeX + containerWidth, nodeY + containerHeight)
            containerRightBottom.parentType = 'containerNode'
            containerRightBottom.nodeFn = 'pRight'

            //容器本尊
            const container = new JTopo.ContainerNode();
            container.textPosition = 'Bottom_Center'
            container.fontColor = '232,31,0'
            container.font = '16px 微软雅黑'
            container.alpha = 1
            container.childDragble = false
            container.borderRadius = 5 // 圆角
            container.borderWidth = 1
            container.borderColor = '223,226,228'
            container.fillColor = '255,255,255'
            container.shadowBlur = 10
            container.shadowColor = "rgba(79,165,219,0.8)"
            container.zIndex = 2
            container.nodeFn = 'containerNode'
            container.id = container._id

            //指标信息
            sugarTragetText(traget1_text, 0)
            sugarTragetText(traget2_text, 1)
            sugarTragetText(traget3_text, 2)
            sugarTragetText(traget3_text_val, 2, "107,205,243", null, 70)
            sugarTragetText(traget4_text, 3)
            sugarTragetText(traget4_text_val, 3, "107,205,243", null, 70)
            sugarTragetText(traget5_text, 4.2, '198,200,201', 12)

            sugarProgressNode('213,223,235', "#f4c63a", traget1_kVal, 80, 7, 120, 10, traget1_kVal * 100 + '%')//update
            sugarProgressNode('213,223,235', "#1bbab9", traget2_kVal, 80, 7, 120, 25, traget2_kVal * 100 + '%')

            function sugarTragetText(text, subYIndex, textColor, fontSize, offsetX) {
              const _offsetX = offsetX || 0;
              const tragetNode = new JTopo.Node();
              tragetNode.fontColor = textColor || '94,144,198'
              tragetNode.font = (fontSize || 14) + "px Consolas"
              tragetNode.text = text
              tragetNode.textPosition = "Bottom_Right"
              tragetNode.showSelected = false
              tragetNode.setSize(0, 0)
              tragetNode.setLocation(nodeX + tragetX + _offsetX, nodeY + tragetY + subYIndex * tragetSubY)
              tragetNode.parentType = 'containerNode'
              tragetNode.borderWidth = 0
              tragetNode.textOffsetY = -25
              tragetNode.nodeFn = 'traget'
              scene.add(tragetNode)
              container.add(tragetNode)
            }

            function sugarProgressNode(fillColor, targetColor, kVal, _width, _height, pos_x, pos_y, percVal) {//update
              const progressNode = new JTopo.Node();
              const width = _width || 85;
              const height = _height || 7;
              const _pos_x = pos_x || 125;
              const _pos_y = pos_y || 10;
              const _percVal = percVal || 0;
              progressNode.setSize(width, height)
              progressNode.setLocation(nodeX + _pos_x, nodeY + _pos_y)
              progressNode.linearGradient = [0, 0, width, height]
              progressNode.colorStop = [0, targetColor, 1, targetColor]//"#f4c63a"
              progressNode.kVal = kVal
              progressNode.borderRadius = 4
              progressNode.showSelected = false
              progressNode.fillColor = fillColor//'213,223,235'
              progressNode.parentType = 'containerNode'
              progressNode.textPosition = "Middle_Right"
              progressNode.fontColor = '94,144,198'
              progressNode.font = '10px 微软雅黑'
              progressNode.text = percVal
              progressNode.textOffsetY = -2
              progressNode.textOffsetX = 2
              scene.add(progressNode)
              container.add(progressNode)
            }


            container.add(textNode)
            container.add(node)

            container.add(containerRightBottom)
            container.add(containerLeftTop)

            scene.add(textNode)
            scene.add(node)

            scene.add(containerLeftTop)
            scene.add(containerRightBottom)
            scene.add(container)
            //添加事件

            return container

          },
          event: {
            'mouseup': function (e) {
              // console.log('e.target')
              // console.log(e.target)
            },
            'dbclick': null,
            'mousemove': null,
            'mouseover': null,
            'mouseout': null,
          }
        },
      ]

      canvasManager.renderTopoCallback = function () {
        JTopo.flag.curScene.childs.forEach(function (p) {
          if (p.elementType === 'node' && p.parentType !== 'containerNode') {
            const imgOffsetX = 15;
            const imgOffsetY = 10;
            const imgObj = new Image();
            imgObj.src = "./images/z.png"
            // p.showSelected=false
            p.borderColor='223,226,228'
            p.borderWidth=1
            p.alpha=0.5
            p.borderRadius=5
            p.textOffsetX=-50
            p.textOffsetY=-20
            p.fontColor='234,32,0'
            p.paint = function (a) {

              /******源码部分,start*********/
              if (this.image) {
                const b = a.globalAlpha;
                a.globalAlpha = this.alpha
                if (typeof  this.image !== 'string') {
                  if (this.keepChangeColor) {
                    a.drawImage(this.image.alarm, -this.width / 2, -this.height / 2, this.width, this.height)
                  } else {
                    if (null !== this.image.alarm && null !== this.alarm) {
                      a.drawImage(this.image.alarm, -this.width / 2, -this.height / 2, this.width, this.height)
                    } else {
                      a.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height)
                    }
                  }
                }
                a.globalAlpha = b
              }
              else {
                a.beginPath(),
                  a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                  null === this.borderRadius || 0 === this.borderRadius ? a.rect(-this.width / 2, -this.height / 2, this.width, this.height) : a.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius),
                  a.fill()
              }
              if (this.linearGradient) {
                const kVal = this.kVal;
                const grd = a.createLinearGradient(this.linearGradient[0], this.linearGradient[1], this.linearGradient[2] * kVal, this.linearGradient[3]);
                for (let grdCount = 0; grdCount < this.colorStop.length / 2; grdCount++) {
                  grd.addColorStop(this.colorStop[grdCount * 2], this.colorStop[grdCount * 2 + 1])
                }
                a.fillStyle = grd
                null === this.borderRadius || 0 === this.borderRadius ? a.rect(-this.width / 2, -this.height / 2, this.width * kVal, this.height) : a.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width * kVal, this.height, kVal < 0.03 ? 0 : this.borderRadius)
                a.fill()

              }
              a.closePath()

              this.paintText(a),
                this.paintBorder(a),
                this.paintCtrl(a),
                this.paintAlarmText(a),
                this.paintAlarmImage(a)
              /******源码部分,end*********/

              /*******图片的拓展******/
              //绘制圆圈

              a.beginPath()
              a.fillStyle='green'
              a.arc( -p.width / 2+imgOffsetX+26, -p.height / 2+imgOffsetY+26,25, 0, Math.PI * 2)
              a.fill()
              //绘制图片
              a.drawImage(imgObj, -p.width / 2+imgOffsetX, -p.height / 2+imgOffsetY, 52, 52)


              const subHeight = 18;
              const baseY = -20;
              const baseX = 20;
              textWrap(a,'致命:',10,baseX,baseY+subHeight*0)
              textWrap(a,'严重:',10,baseX,baseY+subHeight*1)
              textWrap(a,'告警:',10,baseX,baseY+subHeight*2)
              textWrap(a,'预警:',10,baseX,baseY+subHeight*3)
            }
          }
        })
        function textWrap(a,name,num,offsetX,offsetY) {
          a.fillStyle='#949899'
          a.fillText(name,0+offsetX,0+offsetY)
          a.fillStyle='red'
          a.fillText(num+"",40+offsetX,0+offsetY)
        }
      }

      /*********其他开发者自定义拓展*****************************************************************/
      //鼠标右键弹框
      $('.contextmenu li').click(function () {
        let $this = $(this)
        if ($this.hasClass('del')) {
          stateManager.scene.remove(stateManager.currentChooseElement)
          stateManager.removeAgentLink()
        }
        else if ($this.hasClass('rename')) {}
        else if ($this.hasClass('addColor')) {}
        else if ($this.hasClass('rank')) {
          nodesRankManager.setNodesRank(null, stateManager.currentChooseElement.id, {
            subWidth: 200,
            subHeight: 200,
            originX: stateManager.currentChooseElement.x,
            originY: stateManager.currentChooseElement.y,
          }, 'tree')
        }
        else if ($this.hasClass('chooseTree')) {
          nodesRankManager.chooseTree(stateManager.currentChooseElement.id)
        }
        $('.contextmenu').hide()
      })

      /*****图标生成管理者：注入用于拖拽的图标，start********/
      const iconGenerateManager = {
        //数据层：定义或获取数据
        getDragData: function () {
          let data = [
            {
              imgName: 'android',
              type: 'node',
              name: '安卓',
              width: 102,
              height: 50
            },
            {
              imgName: 'android',
              type: 'node',
              name: '安卓',
              width: 102,
              height: 50
            },
            {
              imgName: 'android',
              type: 'node',
              name: '安卓',
              width: 102,
              height: 50
            },
            {
              imgName: 'android',
              type: 'node',
              name: '安卓',
              width: 102,
              height: 50
            },
            {
              imgName: 'apple',
              type: 'node',
              name: '苹果',
              width: 102,
              height: 50
            },
            {
              imgName: 'apple',
              type: 'node',
              name: '苹果',
              width: 102,
              height: 50
            },
            {
              imgName: 'apple',
              type: 'node',
              name: '苹果',
              width: 102,
              height: 50
            },
            {
              imgName: 'apple',
              type: 'node',
              name: '苹果',
              width: 102,
              height: 50
            },
            {
              imgName: 'apple',
              type: 'node',
              name: '苹果',
              width: 102,
              height: 50
            }
          ]
          return data
        },
        //显示层：根据上面获取的数据组装得到一个 HTML 片段
        showDragIcon: function (data) {
          /**
           * 类名 dragTag 用于标志可以拖动
           */
          let html = ""
          for (let i = 0; i < data.length; i++) {
            let obj = data[i]

            // obj.width=100
            // obj.height=20
            // obj.textOffsetY=-20
            // obj.text=obj.imgName
            // obj.imgName=null
            // obj.textAlpah=1
            // obj.alpha=0

            let jsonStr = JSON.stringify(obj)

            html += '<div class="dragTag ' + obj.imgName + '" title="' + obj.name + '"  json=' + jsonStr + ' ><div class="dragNodeName">' + obj.name + '</div></div>'
          }
          return html
        },
        //控制层：将组装好的 HTML 片段插入到 HTML 中对应的节点上
        setDragIcon: function () {
          const data = iconGenerateManager.getDragData() // data layer: get drag data
          const html = iconGenerateManager.showDragIcon(data) // show layer: show drag icon
          $('.iconContainer .basicIconTag').html(html) // inject a HTML fragment into HTML
        }
      }
      /*****图标生成管理者：注入用于拖拽的图标，end**********/

      /************ run *************/
      // 图标生成管理者 - 控制层：注入用于拖拽的图标
      iconGenerateManager.setDragIcon()
      // initialize modules data (modules: stateManager, powerManager, popupManager, canvasManager, dragManager, toolbarManager, nodesRankManager)
      topoManager.init()
      //数据管理者 - 控制层：渲染数据
      dataManager.setTopoData()
    }

    return init
  }
)
