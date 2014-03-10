/**
 * http://aeqdev.com/tools/js/abigimage/
 * v 1.2.4
 *
 * Copyright © 2014 Maksim Krylosov <Aequiternus@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

(function ($) {

    $.fn.abigimage = function(options) {

        var opts = $.extend(true, $.fn.abigimage.defaults, options);

        this.overlay            = $('<div>').attr(opts.overlayAttrs)            .css(opts.overlayCSS)           .appendTo('body');
        this.layout             = $('<div>').attr(opts.layoutAttrs)             .css(opts.layoutCSS)            .appendTo('body');
        this.prevBtnWrapper     = $('<div>').attr(opts.prevBtnWrapperAttrs)     .css(opts.prevBtnWrapperCSS)    .appendTo(this.layout);
        this.prevBtnBox         = $('<div>').attr(opts.prevBtnBoxAttrs)         .css(opts.prevBtnBoxCSS)        .appendTo(this.prevBtnWrapper);
        this.prevBtn            = $('<div>').attr(opts.prevBtnAttrs)            .css(opts.prevBtnCSS)           .appendTo(this.prevBtnBox)          .html(opts.prevBtnHtml);
        this.closeBtnWrapper    = $('<div>').attr(opts.closeBtnWrapperAttrs)    .css(opts.closeBtnWrapperCSS)   .appendTo(this.layout);
        this.closeBtnBox        = $('<div>').attr(opts.closeBtnBoxAttrs)        .css(opts.closeBtnBoxCSS)       .appendTo(this.closeBtnWrapper);
        this.closeBtn           = $('<div>').attr(opts.closeBtnAttrs)           .css(opts.closeBtnCSS)          .appendTo(this.closeBtnBox)         .html(opts.closeBtnHtml);
        this.img                = $('<img>').attr(opts.imgAttrs)                .css(opts.imgCSS)               .appendTo(this.layout);
        this.imgNext            = $('<img>').attr(opts.imgNextAttrs)            .css(opts.imgNextCSS)           .appendTo(this.layout);
        this.imgPrev            = $('<img>').attr(opts.imgPrevAttrs)            .css(opts.imgPrevCSS)           .appendTo(this.layout);
        this.bottom             = $('<div>').attr(opts.bottomAttrs)             .css(opts.bottomCSS)            .appendTo(this.layout);

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

            t.img
                .removeAttr('src') // To re-fire load event if same image opened
                .attr('src', $(t[i]).attr('href'));

            t.overlay.fadeIn(opts.fadeIn);
            t.layout.fadeIn(opts.fadeIn);

            opts.onopen.call(t, t[i]);

            $(document).unbind('keydown', key).bind('keydown', key);

            return false;
        }

        this.img.load(function() {
            // preload prev and next images after viewed images loaded
            t.imgNext.attr('src', $(t[nextI()]).attr('href'));
            t.imgPrev.attr('src', $(t[prevI()]).attr('href'));
        });

        this.img.click(function() {
            return next();
        });

        this.prevBtnWrapper.click(function() {
            return prev();
        });

        this.closeBtnWrapper.click(function() {
            return close();
        });

        this.prevBtnWrapper.hover(function() {
            t.prevBtn.stop().animate(opts.prevBtnHoverCSS, opts.fadeIn);
        }, function() {
            t.prevBtn.stop().animate(opts.prevBtnCSS, opts.fadeOut);
        });

        this.closeBtnWrapper.hover(function() {
            t.closeBtn.stop().animate(opts.closeBtnHoverCSS, opts.fadeIn);
        }, function () {
            t.closeBtn.stop().animate(opts.closeBtnCSS, opts.fadeOut);
        });

        this.bottom.hover(function() {
            t.bottom.stop().animate(opts.bottomHoverCSS, opts.fadeIn);
        }, function () {
            t.bottom.stop().animate(opts.bottomCSS, opts.fadeOut);
        });

        return this.each(function(i) {
            $(this).click(function() {
                return open(i);
            });
        });
    };

    $.fn.abigimage.defaults = {
        fadeIn:               'fast',
        fadeOut:              'fast',

        prevBtnHtml:          '&larr;',
        closeBtnHtml:         'x',

        keyNext:              [13 /* enter */, 32 /* space */, 39 /* right */, 40 /* down */],
        keyPrev:              [8 /* backspace */, 37 /* left */, 38 /* up */],
        keyClose:             [27 /* escape */, 35 /* end */, 36 /* home */],

        onopen:               function() {},

        overlayCSS:           {position: 'fixed', zIndex: 101, top: 0, right: 0, bottom: 0, left: 0, display: 'none',
                                  backgroundColor: '#000', opacity: .9},
        layoutCSS:            {position: 'fixed', zIndex: 101, top: 0, right: 0, bottom: 0, left: 0, display: 'none',
                                  '-webkit-user-select': 'none', '-moz-user-select': 'none', 'user-select': 'none',
                                  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
                                  lineHeight: 2.5},

        prevBtnWrapperCSS:    {cursor: 'pointer', position: 'absolute', top: 0, right: '50%', bottom: 0, left: 0},
        closeBtnWrapperCSS:   {cursor: 'pointer', position: 'absolute', top: 0, right: 0,     bottom: 0, left: '50%'},

        prevBtnBoxCSS:        {position: 'absolute', zIndex: 104, top: 0, bottom: 0, left: 0},
        closeBtnBoxCSS:       {position: 'absolute', zIndex: 104, top: 0, bottom: 0, right: 0},

        prevBtnCSS:           {color: '#fff', backgroundColor: '#000', opacity: .5,
                                  padding: '0 1em', borderRadius: '0 0 1ex 0'},
        closeBtnCSS:          {color: '#fff', backgroundColor: '#000', opacity: .5,
                                  padding: '0 1em', borderRadius: '0 0 0 1ex'},

        prevBtnHoverCSS:      {opacity: 1},
        closeBtnHoverCSS:     {opacity: 1},

        imgCSS:               {position: 'absolute', zIndex: 102, margin: 'auto', width: 'auto',
                                  top: 0, right: 0, bottom: 0, left: 0,
                                  display: 'block', cursor: 'pointer', maxWidth: '100%', maxHeight: '100%'},

        imgNextCSS:           {position: 'absolute', top: '-10000px', left: 0, width: '1px'},
        imgPrevCSS:           {position: 'absolute', top: '-10000px', left: 0, width: '1px'},

        bottomCSS:            {position: 'absolute', zIndex: 103, right: 0, bottom: 0, left: 0,
                                  '-webkit-user-select': 'text', '-moz-user-select': 'text', 'user-select': 'text',
                                  backgroundColor: '#000', color: '#fff', opacity: .5,
                                  padding: '0 1em', textAlign: 'center'},
        bottomHoverCSS:       {opacity: 1},

        overlayAttrs:         {},
        layoutAttrs:          {},
        prevBtnWrapperAttrs:  {},
        prevBtnBoxAttrs:      {},
        prevBtnAttrs:         {},
        closeBtnWrapperAttrs: {},
        closeBtnBoxAttrs:     {},
        closeBtnAttrs:        {},
        imgAttrs:             {},
        imgNextAttrs:         {},
        imgPrevAttrs:         {},
        bottomAttrs:          {}
    };

}(jQuery));
