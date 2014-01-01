/**
 * http://aeqdev.com/tools/php/abigimage/
 * v 1.0
 *
 * Copyright © 2013 Krylosov Maksim <Aequiternus@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

(function ($) {

    $.fn.abigimage = function(options) {

        var opts = $.extend(true, $.fn.abigimage.defaults, options);

        this.overlay    = $('<div>').attr(opts.overlayAttrs)    .css(opts.overlayCSS)   .appendTo('body'),
        this.layout     = $('<div>').attr(opts.layoutAttrs)     .css(opts.layoutCSS)    .appendTo('body'),
        this.wrapper    = $('<div>').attr(opts.wrapperAttrs)    .css(opts.wrapperCSS)   .appendTo(this.layout),
        this.box        = $('<div>').attr(opts.boxAttrs)        .css(opts.boxCSS)       .appendTo(this.wrapper),
        this.prevBtn    = $('<div>').attr(opts.prevBtnAttrs)    .css(opts.prevBtnCSS)   .appendTo(this.box)        .html(opts.prevBtnHtml),
        this.body       = $('<div>').attr(opts.bodyAttrs)       .css(opts.bodyCSS)      .appendTo(this.box),
        this.closeBtn   = $('<div>').attr(opts.closeBtnAttrs)   .css(opts.closeBtnCSS)  .appendTo(this.box)        .html(opts.nextBtnHtml),
        this.top        = $('<div>').attr(opts.topAttrs)        .css(opts.topCSS)       .appendTo(this.body),
        this.img        = $('<img>').attr(opts.imgAttrs)        .css(opts.imgCSS)       .appendTo(this.body),
        this.imgNext    = $('<img>').attr(opts.imgNextAttrs)    .css(opts.imgNextCSS)   .appendTo(this.body),
        this.imgPrev    = $('<img>').attr(opts.imgPrevAttrs)    .css(opts.imgPrevCSS)   .appendTo(this.body),
        this.bottom     = $('<div>').attr(opts.bottomAttrs)     .css(opts.bottomCSS)    .appendTo(this.body);

        var t = this,
            d = 0,
            i = null;

        function nextI() {
            var j = i + 1;
            if (j === t.length) {
                j = 0;
            }
            return j;
        }

        function prevI() {
            var j = i - 1;
            if (j === -1) {
                j = t.length - 1;
            }
            return j;
        }

        function close() {
            d = 0;
            t.overlay.fadeOut(opts.fadeOut);
            t.layout.fadeOut(opts.fadeOut);
            return false;
        }

        function next() {
            ++d;
            return open(nextI());
        };

        function prev() {
            --d;
            return open(prevI());
        };

        function open(openI) {
            if (openI < 0 || openI > t.length - 1) {
                return;
            }

            i = openI;

            t.img.attr('src', $(t[i]).attr('href'));

            if (d === t.length - 1) {
                t.img.unbind('click').click(function() {
                    return close();
                });
            } else {
                t.imgNext.attr('src', $(t[nextI()]).attr('href'));
                t.img.unbind('click').click(function() {
                    return next();
                });
            }

            if (d === 1 - t.length) {
                t.prevBtn.unbind('click').click(function() {
                    return close();
                });
            } else {
                t.imgPrev.attr('src', $(t[prevI()]).attr('href'));
                t.prevBtn.unbind('click').click(function() {
                    return prev();
                });
            }

            t.overlay.fadeIn(opts.fadeIn);
            t.layout.fadeIn(opts.fadeIn);
            t.layout.css({
                top: $(document).scrollTop() + 'px',
                height: $(window).height() + 'px'
            });

            opts.onopen.call(t, t[i]);

            return false;
        }

        this.closeBtn.click(function() {
            return close();
        });

        this.closeBtn.hover(function() {
            $(this).css(opts.closeBtnHoverCSS);
        }, function () {
            $(this).css(opts.closeBtnCSS);
        });

        this.prevBtn.hover(function() {
            $(this).css(opts.prevBtnHoverCSS);
        }, function() {
            $(this).css(opts.prevBtnCSS);
        });

        return this.each(function(i) {
            $(this).click(function() {
                return open(i);
            });
        });
    };

    var btnCSS = {color: '#808080', display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', fontSize: '2em', fontWeight: 'bold', cursor: 'pointer', padding: '.75em'},
        btnHoverCSS = {color: '#c0c0c0'},
        imgPreCSS = {position: 'absolute', top: '-10000px', width: '100px'},
        textCSS = {color: '#c0c0c0'};


    $.fn.abigimage.defaults = {
        fadeIn:             'normal',
        fadeOut:            'fast',

        prevBtnHtml:        '◄',
        nextBtnHtml:        '✖',

        onopen:             function() {},

        overlayCSS:         {backgroundColor: '#404040', zIndex: 2, position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', display: 'none'},
        layoutCSS:          {zIndex: 2, position: 'absolute', top: 0, left: 0, width: '100%', margin: '0 auto', display: 'none',
                                '-webkit-user-select': 'none', '-moz-user-select': 'none', 'user-select': 'none'},
        wrapperCSS:         {display: 'table', width: '100%', height: '100%'},
        boxCSS:             {display: 'table-row'},
        bodyCSS:            {display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '1%'},
        prevBtnCSS:         btnCSS,
        prevBtnHoverCSS:    btnHoverCSS,
        closeBtnCSS:        btnCSS,
        closeBtnHoverCSS:   btnHoverCSS,
        imgCSS:             {maxWidth: '800px', cursor: 'pointer', display: 'block', margin: '1ex 0'},
        imgNextCSS:         imgPreCSS,
        imgPrevCSS:         imgPreCSS,
        topCSS:             textCSS,
        bottomCSS:          textCSS,

        overlayAttrs:       {},
        layoutAttrs:        {},
        wrapperAttrs:       {},
        boxAttrs:           {},
        bodyAttrs:          {},
        prevBtnAttrs:       {},
        closeBtnAttrs:      {},
        imgAttrs:           {},
        imgNextAttrs:       {},
        imgPrevAttrs:       {},
        topAttrs:           {},
        bottomAttrs:        {}
    };

}(jQuery));
