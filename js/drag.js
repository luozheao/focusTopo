
$.fn.extend({
    //---元素拖动插件
    dragging:function(data){
        var $this = $(this);
        var $thisClone;
        var xPage;
        var yPage;
        var X;
        var Y;
        var xRand = 0;
        var yRand = 0;
        var defaults = {
            move : 'both',
            randomPosition : true ,
            hander:1,
            dragContainer:$(this).parent()
        }
        var opt = $.extend({},defaults,data);
        var father = opt.dragContainer;
        var movePosition = opt.move;
        var random = opt.randomPosition;
        var hander = opt.hander;
        var fnCreateNodeByDrag=opt.fnCreateNodeByDrag;
        var fnDragMouseDown=opt.dragMouseDown;
        var fnDragMouseMove=opt.dragMouseMove;
        $this.attr('isDragTag',true);
        hander=hander == 1?$this:$this.find(opt.hander);
        //---初始化
        father.css({"position":"relative","overflow":"hidden"});
        hander.css({"cursor":"move"});
        var faWidth = father.width();
        var faHeight = father.height();
        var thisWidth=50;
        var thisHeight=50;
        var mDown = false;
        var positionX;
        var positionY;
        var moveX ;
        var moveY ;
        var sonWidth=0;
        var sonHeight=0;

        if(random){
            $thisRandom();
        }
        function $thisRandom(){ //随机函数
            $this.each(function(index){
                var randY = parseInt(Math.random()*(faHeight-thisHeight));///
                var randX = parseInt(Math.random()*(faWidth-thisWidth));///
                if(movePosition.toLowerCase() == 'x'){
                    $(this).css({
                        left:randX
                    });
                }else if(movePosition.toLowerCase() == 'y'){
                    $(this).css({
                        top:randY
                    });
                }else if(movePosition.toLowerCase() == 'both'){
                    $(this).css({
                        top:randY,
                        left:randX
                    });
                }

            });
        }

        hander.mousedown(function(e) {
            positionX = $this.position().left;  //按下鼠标时,元素的left
            positionY = $this.position().top;//按下鼠标时,元素的top
            $thisClone = $this.clone();
            var $target=$(e.target);
            sonWidth=$target.width()/2;
            sonHeight=$target.height()/2;
            $('body').append($thisClone);

            fnDragMouseDown($thisClone,e.pageX-sonWidth,e.pageY-sonHeight,e);
            mDown = true;
            X = e.pageX;//按下鼠标时,鼠标的left
            Y = e.pageY;//按下鼠标时,鼠标的top
            return false;
        });


        $('body').mouseup(function(e){
            if($thisClone){
                fnCreateNodeByDrag($thisClone,mDown,e);
                $thisClone=null;
            }
            mDown = false;
        }).mousemove(function(e){
            var k_x=0;
            var k_y=0;

            if(fnDragMouseMove) {
                var posObj = fnDragMouseMove(e);
                k_x = posObj.x;
                k_y = posObj.y;
            }

            moveX =  e.pageX-sonWidth+k_x;//元素拖拽的x坐标
            moveY =  e.pageY-sonHeight+k_y;//元素拖拽的y坐标


            if(movePosition.toLowerCase() == "x"){
                thisXMove();
            }else if(movePosition.toLowerCase() == "y"){
                thisYMove();
            }else if(movePosition.toLowerCase() == 'both'){
                thisAllMove();
            }
        });

        function thisXMove(){ //x轴移动
            if(mDown == true){
                $thisClone.css({"left":moveX});
            }else{
                return;
            }
            if(moveX < 0){
                $thisClone.css({"left":"0"});
            }
            if(moveX > (faWidth-thisWidth)){
                $thisClone.css({"left":faWidth-thisWidth});
            }
            return moveX;
        }

        function thisYMove(){ //y轴移动
            if(mDown == true){
                $thisClone.css({"top":moveY});
            }else{
                return;
            }
            if(moveY < 0){
                $thisClone.css({"top":"0"});
            }
            if(moveY > (faHeight-thisHeight)){
                $thisClone.css({"top":faHeight-thisHeight});
            }
            return moveY;
        }

        function thisAllMove(){ //全部移动
            if(mDown == true){
                $thisClone.css({"left":moveX,"top":moveY});
            }else{
                return;
            }
            if(moveX < 0){
                $thisClone.css({"left":"0"});
            }
            if(moveX > (faWidth-thisWidth)){
                $thisClone.css({"left":faWidth-thisWidth});
            }

            if(moveY < 0){
                $thisClone.css({"top":"0"});
            }
            if(moveY > (faHeight-thisHeight)){
                $thisClone.css({"top":faHeight-thisHeight});
            }
        }

    }
});









