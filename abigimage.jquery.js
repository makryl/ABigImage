/**
 * http://aeqdev.com/tools/js/abigimage/
 * v 1.1.1
 *
 * Copyright © 2014 Krylosov Maksim <Aequiternus@gmail.com>
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
        this.closeBtn   = $('<div>').attr(opts.closeBtnAttrs)   .css(opts.closeBtnCSS)  .appendTo(this.box)        .html(opts.closeBtnHtml),
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

        function next() {
            if (d === t.length - 1) {
                return close();
            } else {
                ++d;
                return open(nextI());
            }
        }

        function prev() {
            if (d === 1 - t.length) {
                return close();
            } else {
                --d;
                return open(prevI());
            }
        }

        function key(event) {
            if (opts.keyNext.indexOf(event.which) !== -1) {
                event.preventDefault();
                next();
            } else if (opts.keyPrev.indexOf(event.which) !== -1) {
                event.preventDefault();
                prev();
            } else if (opts.keyClose.indexOf(event.which) !== -1) {
                event.preventDefault();
                close();
            }
        }

        function close() {
            d = 0;
            t.overlay.fadeOut(opts.fadeOut);
            t.layout.fadeOut(opts.fadeOut);
            $(document).unbind('keydown', key);
            return false;
        }

        function open(openI) {
            if (openI < 0 || openI > t.length - 1) {
                return;
            }

            i = openI;

            t.img.attr('src', $(t[i]).attr('href'));
            t.imgNext.attr('src', $(t[nextI()]).attr('href'));
            t.imgPrev.attr('src', $(t[prevI()]).attr('href'));

            t.overlay.fadeIn(opts.fadeIn);
            t.layout.fadeIn(opts.fadeIn);
            t.layout.css({
                top: $(document).scrollTop() + 'px',
                height: $(window).height() + 'px'
            });

            $(document).unbind('keydown', key).bind('keydown', key);

            opts.onopen.call(t, t[i]);

            return false;
        }

        this.img.click(function() {
            return next();
        });

        this.prevBtn.click(function() {
            return prev();
        });

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
        closeBtnHtml:       '✖',

        keyNext:            [13 /* enter */, 32 /* space */, 39 /* right */, 40 /* down */],
        keyPrev:            [8 /* backspace */, 37 /* left */, 38 /* up */],
        keyClose:           [27 /* escape */, 35 /* end */, 36 /* home */],

        onopen:             function() {},

        overlayCSS:         {backgroundColor: '#404040', opacity: 0.925, zIndex: 2, position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', display: 'none'},
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
