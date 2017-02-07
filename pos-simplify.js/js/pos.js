$.fn.pos = function( options ){

    // Create some defaults, extending them with any options that were provided
    var defaults = $.extend({
        'width': 1089,
        'lastPageX': -650
    });

    var settings = $.extend(defaults, options);

    this.each(function(){
        // 设定一些参数 
        var This = this;
        var startPageX = 0,
            changePageX = 0,
            deltaPageX = 0,
            endPageX = 0,
            lastPageX = settings.lastPageX,
            orientPageX = 0,
            width = settings.width;
        var isTouched = false;
        // 帧率相关参数
        var e,pe,pid,fps,last,offset,step,appendFps,temfps;   
        var tObj = {
            lon: 0,
            lastLon: 0
        };
        var oObj = {
            lon: 0,
            lastLon: 0
        };
        var requestFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        var cancelFrame = window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function(callback) {
                window.clearTimeout(callback);
            };
        // showFPS是测试帧率的，为以后缓动加速度做准备
        var showFPS = (function(){   
            var requestAnimationFrame =    
                window.requestAnimationFrame ||  
                window.webkitRequestAnimationFrame ||   
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame || 
                window.msRequestAnimationFrame || 
                function(callback){
                    window.setTimeout(callback, 1000/60);   
                };   
           
            fps = 0;   
            last = Date.now();   
            step = function(){   
                offset = Date.now() - last;   
                fps += 1;   
                if( offset >= 1000 ){   
                last += offset;   
                appendFps(fps);   
                fps = 0;   
                }   
                requestAnimationFrame( step );   
            };   
         
            appendFps = function(fps){   
                temfps = fps; 
            }   
            return {   
                setParentElementId :  function(id){pid=id;},   
                go                 :  function(){step();}   
            }   
        })();
        showFPS.go();
        // 快速点击事件，消除300ms
        FastClick.attach(document.body);
         /*取消默认行为*/
        document.addEventListener('touchmove', function(event) {
            event.preventDefault();
        });
        // 手机旋转
        var o = new Orienter();
        o.handler = function(obj){
        // 手机旋转回调函数
            orientX(obj);
        };
        // 手滑动事件监听
        addTouchListener();
        // 旋转初始化
        o.init();
        // 渲染
        animationX();
        /*page6 触屏滑动监控*/
        function addTouchListener() {
            This.addEventListener('touchstart', function(event) {
                touchS(event);
            });
            This.addEventListener('touchmove', function(event) {
                touchM(event);
            });
            This.addEventListener('touchend', function(event) {
                touchE(event);
            })
        }
        function touchS(event) {
            startPageX = event.touches[0].pageX;
        }
        function touchM(event) {
            event.preventDefault();
            isTouched = true;
            var changePageX = event.touches[0].pageX;
            var deltaX = changePageX - startPageX;
            deltaPageX = deltaX;
        }
        function touchE(event) {
            isTouched = false;
            lastPageX += deltaPageX;
            deltaPageX = 0;
            var endPageX = event.changedTouches[0].pageX;
            if (orientPageX + lastPageX > 0) {
                lastPageX = -orientPageX;
            } else if (orientPageX + lastPageX < -width) {
                lastPageX = - width - orientPageX;
            }
        }
        // 根据旋转角度的偏移量进行旋转
        var oldLon = null;
        function orientX(obj) {
            if(oldLon===null){
                oldLon=obj.lon;
            }
            var offsetLon = obj.lon-oldLon;
            oldLon=obj.lon;
            // 用360修正角度问题，永远取偏移量中的最短距离
            if(offsetLon>180)offsetLon-=360;
            if(offsetLon<-180)offsetLon+=360;
            // 偏移角度和偏移距离的换算，可乘任意值
            orientPageX+=offsetLon*8;
            if(orientPageX>-lastPageX)orientPageX=-lastPageX;
            if(orientPageX<(lastPageX-width))orientPageX=lastPageX-width;
        }
        var moveX_store = 0;
        //渲染，缓动
        function animationX() {
            var moveX = lastPageX + deltaPageX + orientPageX;
            // 缓动的速度，可以根据实际调整，也可以根据帧率调整
            moveX_store += .2 * (moveX - moveX_store);
            if (moveX_store > 0) {
                moveX_store = 0;
            } else if (moveX_store < -width) {
                moveX_store = -width;
            }
            This.style.left = moveX_store + 'px';
            // $(this).css('left', moveX_store + 'px');
            requestFrame(animationX);
        }
    });
};