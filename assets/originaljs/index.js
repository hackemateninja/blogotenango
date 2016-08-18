/**
 * Main JS file for kaldorei behaviours
 */

/* globals jQuery, document */
(function($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function() {
        var $postContent = $(".post-content");
        $postContent.fitVids();

        $(".scroll-down").arctic_scroll();

        $(".menu-button, .nav-cover, .nav-close").on("click", function(e) {
            e.preventDefault();
            $("body").toggleClass("nav-opened nav-closed");
        });

        $(window).scroll(function() {
            var scrollerToTop = $('.backTop');
            var scrollerTOC = $('.widget-toc');
            document.documentElement.scrollTop + document.body.scrollTop > 200 ? scrollerToTop.fadeIn() : scrollerToTop.fadeOut();
            document.documentElement.scrollTop + document.body.scrollTop > 250 ? scrollerTOC.addClass("widget-toc-fixed") : scrollerTOC.removeClass("widget-toc-fixed");
        });

        // #backTop Button Event
        $("#backTop").on("click", function() {
            scrollToTop();
        });

        // highlight config
        hljs.initHighlightingOnLoad();

        // numbering for pre>code blocks
        $(function() {
            $('pre code').each(function() {
                var lines = $(this).text().split('\n').length - 1;
                var $numbering = $('<ul/>').addClass('pre-numbering');
                $(this).addClass('has-numbering').parent().append($numbering);
                for (var i = 1; i <= lines; i++) {
                    $numbering.append($('<li/>').text(i));
                }
            });
        });

        // toc config
        $("#toc").toc({
            content: ".post-content",
            headings: "h2,h3,h4,h5"
        });

        if ($("#toc").children().length == 0) $(".widget-toc").hide();

        // toc animate effect
        // bind click event to all internal page anchors
        $('a.data-scroll').on('click', function(e) {
            // prevent default action and bubbling
            e.preventDefault();
            e.stopPropagation();
            // set target to anchor's "href" attribute
            var target = $(this).attr('href');
            // scroll to each target
            $(target).velocity('scroll', {
                duration: 500,
                easing: 'ease-in-out'
                    //easing: 'spring'
            });
        });

        // tooltip config
        $('[data-rel=tooltip]').tooltip();

        // fancybox config
        $('.post-content a:has(img)').addClass('fancybox');
        $(".fancybox").attr('rel', 'gallery-group').fancybox({
            helpers: {
                overlay: {
                    css: {
                        'background': 'rgba(0, 154, 97, 0.33)'
                    },
                    locked: false
                }
            },
            beforeShow : function() {
                var alt = this.element.find('img').attr('alt');

                this.inner.find('img').attr('alt', alt);

                this.title = alt;
            }
        });
    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function(options) {

        var defaults = {
                elem: $(this),
                speed: 500
            },

            allOptions = $.extend(defaults, options);

        allOptions.elem.click(function(event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({
                    scrollTop: ($(this.hash).offset().top + toMove)
                }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({
                    scrollTop: toMove
                }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({
                    scrollTop: ($(this.hash).offset().top)
                }, allOptions.speed);
            }
        });

    };
})(jQuery);

function scrollToTop(name, speed) {
    if (!speed) speed = 300
    if (!name) {
        $('html,body').animate({
            scrollTop: 0
        }, speed)
    } else {
        if ($(name).length > 0) {
            $('html,body').animate({
                scrollTop: $(name).offset().top
            }, speed)
        }
    }
}

/*global jQuery */
/*jshint browser:true */
/*!
 * FitVids 1.1
 *
 * Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
 * Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
 * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
 *
 */

(function( $ ){

    "use strict";

    $.fn.fitVids = function( options ) {
        var settings = {
            customSelector: null
        };

        if(!document.getElementById('fit-vids-style')) {
            // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
            var head = document.head || document.getElementsByTagName('head')[0];
            var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
            var div = document.createElement('div');
            div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
            head.appendChild(div.childNodes[1]);
        }

        if ( options ) {
            $.extend( settings, options );
        }

        return this.each(function(){
            var selectors = [
                "iframe[src*='player.vimeo.com']",
                "iframe[src*='youtube.com']",
                "iframe[src*='youtube-nocookie.com']",
                "iframe[src*='kickstarter.com'][src*='video.html']",
                "object",
                "embed"
            ];

            if (settings.customSelector) {
                selectors.push(settings.customSelector);
            }

            var $allVideos = $(this).find(selectors.join(','));
            $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

            $allVideos.each(function(){
                var $this = $(this);
                if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
                var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
                    width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
                    aspectRatio = height / width;
                if(!$this.attr('id')){
                    var videoID = 'fitvid' + Math.floor(Math.random()*999999);
                    $this.attr('id', videoID);
                }
                $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
                $this.removeAttr('height').removeAttr('width');
            });
        });
    };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

