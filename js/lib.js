
$(document).ready(function($) {
    
    // 手机导航
    $('.menuBtn').unbind("click").click(function(event) {
        $(this).toggleClass('open');
      $(this).toggleClass('hide');
      event.stopPropagation(); 
        var _winw = $(window).width();
        var _winh = $(window).height();
        if( $(this).hasClass('open') ){
            $('body').addClass('open');
            if( _winw<=1200 ){
                $(".nav").animate({
                    left: '0'
                });
                $(".nav .bg").animate({
                    left: '0'
                });
            }
        }else{
            $('body').removeClass('open');
            if( _winw<=1200 ){
                $(".nav").animate({
                   left: "-100%"
                });
                $(".nav .bg").animate({
                    left: '-100%'
                });
            }
        }
    });
    $(".nav .bg").click(function(){
        $(".menuBtn").removeClass('open');
      $(".menuBtn").removeClass('hide');
        $(".nav").animate({
            left: "-100%"
        });
        $(".nav .bg").animate({
            left: '-100%'
        });
    })
    $(window).on('resize', function (e) {
        if($(window).width() > 1200) {
            $('.menuBtn').removeClass('open');
            $('.nav').css('display', '');
        }
    });
    // 导航
    if ($(".nav li").find('dl').length) {
        $(".nav li").find("dl").siblings("a").attr("href","javascript:;")
    } ;
    function myNav(){
        var _winw = $(window).width();
        if( _winw>=1200 ){
            $('.nav li').bind('mouseenter',function() {
                $(this).find('dl').stop().slideDown("fast");
                if( $(this).find('dl').length ){
                    $(this).addClass('ok');
                }
            });
            $('.nav li').bind('mouseleave',function() {
                $(this).removeClass('ok');
                $(this).find('dl').stop().slideUp("fast");
            });
            $('body,.menuBtn').removeClass('open');
        }else{
            $('.nav .v1').click(function(){
                $(this).parents(".nav").find("dl").stop().slideUp("fast");
                if( $(this).siblings('dl').length ){
                    $(this).siblings('dl').stop().slideToggle("fast");
                    return false;
                }
            });
        }
    }
    myNav();
    $(window).resize(function(event) {
        myNav();
        $('.menuBtn').removeClass('open');
    });

    // 搜索
    function sb(){
        if($(window).width() > 1200) {
            $(".sobox .so .inp").focus(function(){
                $(this).parent("form").css({
                    width: '350px'
                });
            })
            $(".sobox .so .inp").blur(function(){
                $(this).parent("form").css({
                    width: '308px'
                });
            })
        }
    }
    sb();
    $(window).on('resize', function (e) {
        sb();
    });
    $("#calendar .active-today").click(function(){
        $('.J-down').stop().slideToggle("fast");
    })
    var cSpan = true;
    $(".m-show span").click(function(){
        if(cSpan){  
            $(this).siblings('dl').slideDown();
            cSpan = false;
        }else{
            $(this).siblings('dl').slideUp();
            cSpan = true;
        }        
    })
    $(document).bind('click', function(e) {
        var e = e || window.event; //浏览器兼容性 
        var elem = e.target || e.srcElement;
        while (elem) { //循环判断至跟节点，防止点击的是div子元素 
            if (elem.id && elem.id == 'mshow') {
                return;
            }
            elem = elem.parentNode;
        }
        if(cSpan){}else{
            $(".m-show span").siblings('dl').slideUp();
            cSpan = true;
        }
    });

    $(".J-down .close").click(function(){
        $(this).parent('.down').stop().slideUp("fast");
    })

    // 侧导航
    if ($(".snv li").find('dl').length) {
        $(".snv li").find("dl").siblings("a").attr("href","javascript:;")
    };
    $(".snv li .v1").click(function(){
        $(this).parent("li").toggleClass('on');
        var li = $(this).parent("li");
        if (li.hasClass('on')) {
            li.parents('.snv').find('dl').removeClass('on');
            li.find("dl").stop().slideDown();
            li.addClass('on');
        } else {
            li.find("dl").stop().slideUp();
            console.log($(this).parent("li").children("dd"));
            $(this).parent("li").find("dd").removeClass('ok');
            $(this).parent("li").find("div").slideUp();
            li.removeClass('on');

        };
    })
    if ($(".snv dl").find('.down').length) {
        $(".snv dl").find(".down").siblings("a").attr("href","javascript:;")
    };
    // $(".snv dl .v2").click(function(){
    //     $(this).parent("dd").toggleClass('ok');
    //     var li = $(this).parent("dd");
    //     if (li.hasClass('ok')) {
    //         li.parents('dl').find('.down').removeClass('ok');
    //         li.find(".down").stop().slideDown();
    //         li.addClass('ok');
    //     } else {
    //         li.find(".down").stop().slideUp();
    //         li.removeClass('ok');
    //     };
    // })
    $(".snv dl .v2").click(function(){
        if ($(this).hasClass('ok')) {
            $(this).next('.down').stop().slideUp();
            $(this).removeClass('ok');
        } else {
            $(this).next('.down').stop().slideDown();
            $(this).next('.down').siblings(".down").stop().slideUp();
            $(this).addClass('ok');
        };
    })
    function ff(){
        if($(window).width() < 1200) {
            $(document).on('scroll', function(){
                var scrollH = $(this).scrollTop();
                if (scrollH > 70){
                    $('.header').addClass('fixed');
                } else {
                    $('.header').removeClass('fixed');
                }
            })
        }
    }
    ff();
    $(window).on('resize', function (e) {
        ff();
    });
  $('.fd-nav dt').click(function(){
    if($(window).width() < 768) {
  		$(this).siblings().slideToggle()
    }
  })
});