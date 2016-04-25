
(function ($) {
    "use strict";
    jQuery(window).ready(function () {
        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 80
        });

        


    $('#topNav').affix({
        offset: {
            top: 200
        }
    });
    


    
    new WOW().init();


    $('a.page-scroll').bind('click', function(event) {
        var $ele = $(this);
        
        $('html, body').stop().animate({
            scrollTop: ($($ele.attr('href')).offset().top - 60)
        }, 2950, 'easeInOutExpo');
        event.preventDefault();
    });

    $('#bs-navbar li').bind('click', function (event) {
        $('#bs-navbar li').removeClass('active');
        var $ele = $(this);
        $ele.addClass('active');
    });
    $('.navbar-collapse ul li a').click(function() {
        /* always close responsive nav after click */
        $('.navbar-toggle:visible').click();
    });

    $('#galleryModal').on('show.bs.modal', function (e) {
       $('#galleryImage').attr("src",$(e.relatedTarget).data("src"));
    });


    });
   
    
   

})(jQuery);
