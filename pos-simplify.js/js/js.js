$(function(){
    $('.s0 .map').pos({
        'width': 800,
        'lastPageX': -400
    });
	//防止点击btn时swiper移动
    $('.btn-box').on('touchmove',function(e){
        e.stopPropagation();
        e.preventDefault();
    });
    $('.hint-box').on('touchstart',function(){
        $('.hint-box').removeClass('active');
    });
});