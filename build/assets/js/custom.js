$(document).ready(function(){
    setPageBodyHeight();

    if($('*').hasClass('widget-case-6') == false){
        var widget = $('.widget');
        widget.click(function(e){
            $('.widget.active').removeClass('active');
            $(this).addClass('active');
            var pageContentWrap = $('.page-content-wrap');
            setBackground(pageContentWrap, 'bg-grey', 'bg-light-blue');
            if($('body').hasClass('case-4')){
                var widgetItem = $('.widget-content-item');
                if(e.target==widgetItem||widgetItem.has(e.target).length !== 0){
                    $('.case-4 .widget-content-item.active').removeClass('active');
                    widgetItem.has(e.target).addClass('active');
                }
            }
        });
    }
});

$(document).mouseup(function(e){
    //Listen click on widget or not
    var widget = $('.widget');
    var pageContentWrap = $('.page-content-wrap');
    if(e.target!=widget||widget.has(e.target).length === 0){
        $('.widget.active').removeClass('active');
        setBackground(pageContentWrap, 'bg-light-blue', 'bg-grey');
        $('.case-4 .widget-content-item.active').removeClass('active');
    }
});

/**
 * Set background color for object
 * @param {object} obj 
 * @param {string} classNameOld 
 * @param {string} classNameNew 
 */
function setBackground(obj, classNameOld, classNameNew){
    obj.removeClass(classNameOld);
    obj.addClass(classNameNew);
}

/**
 * Set height for case 2,3,4,5
 */
function setPageBodyHeight(){
    var screenHeight    = $(window).outerHeight();
    var headerHeight    = $('header').outerHeight();
    var groupFilterHeight = $('.group-filter:eq(0)').outerHeight();
    var periodHeaderHeight = $('.page-content .period-header:eq(0)').outerHeight();
    if($(window).width()>=768){
        var pageBodyHeight = screenHeight - headerHeight - groupFilterHeight - periodHeaderHeight;
        $('.page-body').css('min-height', pageBodyHeight+'px');
    }else{
        var pageBodyHeight = (screenHeight - headerHeight - groupFilterHeight - periodHeaderHeight)/2;
        $('.page-body').css('min-height', pageBodyHeight);
    }
    
}

$(window).resize(function(){
    setPageBodyHeight();
});