/**
 * http://aeqdev.com/tools/js/abigimage/
 * v 1.2.8
 *
 * Copyright © 2014 Maksim Krylosov <Aequiternus@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

(function ($) {

    var overlay            = $('<div>').css({display: 'none'}).appendTo('body'),
        layout             = $('<div>').css({display: 'none'}).appendTo('body'),
        box                = $('<div>').appendTo(layout),
        prevBtnWrapper     = $('<div>').appendTo(box),
        prevBtnBox         = $('<div>').appendTo(prevBtnWrapper),
        prevBtn            = $('<div>').appendTo(prevBtnBox),
        closeBtnWrapper    = $('<div>').appendTo(box),
        closeBtnBox        = $('<div>').appendTo(closeBtnWrapper),
        closeBtn           = $('<div>').appendTo(closeBtnBox),
        img                = $('<img>').appendTo(box),
        imgNext            = $('<img>').appendTo(box),
        imgPrev            = $('<img>').appendTo(box),
        bottom             = $('<div>').appendTo(layout);

    var opts = {},
        t = null,
        i = null,
        d = 0,
        opened = false;

    function nextI() {
        var j = i + 1;
        if (j >= t.length) {
            j = 0;
        }
        return j;
    }

    function prevI() {
        var j = i - 1;
        if (j < 0) {
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
            next();
            return false;
        } else if (opts.keyPrev.indexOf(event.which) !== -1) {
            prev();
            return false;
        } else if (opts.keyClose.indexOf(event.which) !== -1) {
            close();
            return false;
        }
    }

    function open(src, openI) {
        if ('number' === typeof src) {
            if (src === i || src < 0 || src > t.length - 1) {
                return;
            }
            i = src;
            var $t = $(t[i]);
            src = $t.data('href') || $t.attr('href');
        } else {
            if ('number' !== typeof openI) {
                openI = -1;
            }
            if (i === openI) {
                return;
            }
            i = openI;
        }

        opened = true;

        // removeAttr to force image reloading instead of replacing on load
        img.removeAttr('src').attr('src', src);
        var $tn = $(t[nextI()]);
        imgNext.removeAttr('src').attr('src', $tn.data('href') || $tn.attr('href'));
        var $tp = $(t[prevI()]);
        imgPrev.removeAttr('src').attr('src', $tp.data('href') || $tp.attr('href'));

        overlay.fadeIn(opts.fadeIn);
        layout.fadeIn(opts.fadeIn);

        opts.onopen.call(t, t[i], i);

        $(document).unbind('keydown', key).bind('keydown', key);

        return false;
    }

    function close() {
        if (!opened) {
            return;
        }
        opened = false;
        i = null;
        d = 0;
        overlay.fadeOut(opts.fadeOut);
        layout.fadeOut(opts.fadeOut, transitionEnd);

        opts.onclose.call(t);

        $(document).unbind('keydown', key);
        return false;
    }

    prevBtnWrapper.click(function() {
        return prev();
    });

    closeBtnWrapper.click(function() {
        return close();
    });

    var prevent = function(e) {
        e.preventDefault();
    };

    layout
        .on('touchmove', prevent)
        .on('wheel', prevent);



    var sx,
        sy,
        ss,
        x,
        y,
        s,
        k,
        dx,
        dy,
        iw,
        ih,

        start,
        width,
        height,
        minD,
        vert,
        touches,
        multi,

        slideTransition = false,
        slideQueueFn = [null, null, null],
        bs = box[0].style;

    touchReset();

    function touchReset() {
        x = 0;
        y = 0;
        s = 1;
        vert = null;
        multi = false;
        if (opts.imgCSS) {
            img.css({zIndex: opts.imgCSS.zIndex});
        }
    }

    function med(ts, c) {
        var p = 0;
        for (var t = 0, l = ts.length; t < l; t++) {
            p += ts[t]['page' + c];
        }
        return p / l;
    }

    function dis(e) {
        return Math.sqrt(
            Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2) +
            Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2)
        );
    }

    img[0].addEventListener('touchstart', function(e) {
        if (!opened) return;
        if (e.touches.length > 1) {
            multi = true;
            k = dis(e);
            img.css({zIndex: opts.prevBtnBoxCSS.zIndex});
        } else {
            vert = null;
            start = (new Date()).getTime();
            width = box.width() * 0.34;
            height = box.height();
            minD = opts.slideWidth * width;
            iw = img.width();
            ih = img.height();
        }
        sx = x;
        sy = y;
        ss = s;
        dx = 0;
        dy = 0;
        touches = e.touches;
        e.preventDefault();
    });

    img[0].addEventListener('touchmove', function(e) {
        if (!opened) return;
        dx = (med(e.touches, 'X') - med(touches, 'X'));
        dy = (med(e.touches, 'Y') - med(touches, 'Y'));
        x = sx + dx / s;
        y = sy + dy / s;
        if (e.touches.length > 1) {
            s = Math.max(1, ss * (dis(e) / k));
        }
        if (s > opts.zoomMin) {
            var mx = 0.5 * (iw - (iw / s));
            var my = 0.5 * (ih - (ih / s));
            x = Math.max(-mx, Math.min(mx, x));
            y = Math.max(-my, Math.min(my, y));
        } else {
            if (null === vert) {
                var dv = Math.abs(dy) - Math.abs(dx);
                if (Math.abs(dv) > 2) {
                    vert = dv > 0;
                }
            }
            if (vert) {
                x = 0;
            } else {
                y = 0;
            }
        }
        slideQueueAnimate(x, y, s, false);
        e.preventDefault();
    });

    img[0].addEventListener('touchend', touchend);
    img[0].addEventListener('touchcancel', touchend);

    function touchend(e) {
        if (!opened) return;
        var time = (new Date()).getTime() - start;

        if (!e.touches.length) {
            if (s <= opts.zoomMin) {
                if (time <= 1 || (dx >= -1 && dx <= 1 && dy >= -1 && dy <= 1)) {
                    if (multi) {
                        slideAnimate(0, 0, 1);
                    } else {
                        slideNext(true);
                    }
                } else {
                    if (vert) {
                        var ady = Math.abs(dy);
                        if (ady > minD) {
                            slideClose();
                        } else {
                            if (ady / time > opts.slideVelocity) {
                                slideClose();
                            } else {
                                slideBack();
                            }
                        }
                    } else {
                        if (dx < -minD) {
                            slideNext();
                        } else if (dx > minD) {
                            slidePrev();
                        } else {
                            if (Math.abs(dx) / time > opts.slideVelocity) {
                                if (dx < 0) {
                                    slideNext();
                                } else {
                                    slidePrev();
                                }
                            } else {
                                slideBack();
                            }
                        }
                    }
                }
                touchReset();
            } else if (s > opts.zoomMax) {
                s = opts.zoomMax;

                slideQueueAnimate(x, y, s, true);
            }
        }

        if (s <= opts.zoomMin) {
            img.css({zIndex: opts.imgCSS.zIndex});
        }

        touches = e.touches;
        e.preventDefault();
    }

    box.on('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd', transitionEnd);

    function transitionEnd() {
        slideTransition = false;
        for (var i = 0; i < 2 ; i++) {
            if (slideQueueFn[i]) {
                slideQueueFn[i]();
                slideQueueFn[i] = null;
                if (slideTransition) break;
            }
        }
    }

    img.click(function() {
        return next();
    });

    function slideNext(reset) {
        slideQueueAnimate(reset ? 0 : -width, 0, 1, !reset);
        slideQueueEnd(next);
    }

    function slidePrev() {
        slideQueueAnimate(width, 0, 1, true);
        slideQueueEnd(prev);
    }

    function slideBack() {
        slideQueueAnimate(0, 0, 1, true);
    }

    function slideClose() {
        slideBack();
        slideQueueEnd();
        close();
    }

    function slideQueue(fn, i) {
        if (slideTransition) {
            slideQueueFn[i || 0] = fn;
        } else {
            fn();
        }
    }

    function slideQueueAnimate(x, y, s, transition, i) {
        slideQueue(function() {slideAnimate(x, y, s, transition)}, i);
    }

    function slideQueueEnd(fn) {
        slideQueue(function() {slideAnimate(0, 0, 1, false); if (fn) fn();}, 1);
    }

    function slideAnimate(x, y, s, transition) {
        slideTransition = transition;
        var transform = 'scale(' + s + ') translate3d(' + x + 'px, ' + y + 'px, 0)';
        bs.transition = transition ? 'all .2s ease-out' : '';
        bs.webkitTransform = transform;
        bs.mozTransform = transform;
        bs.msTransform = transform;
        bs.oTransform = transform;
        bs.transform = transform;
    }

    $.fn.abigimage = function(options) {

        t = this;

        opts = $.extend(true, $.fn.abigimage.defaults, options);

        this.overlay            = overlay           .attr(opts.overlayAttrs)            .css(opts.overlayCSS);
        this.layout             = layout            .attr(opts.layoutAttrs)             .css(opts.layoutCSS);
        this.box                = box               .attr(opts.boxAttrs)                .css(opts.boxCSS);
        this.prevBtnWrapper     = prevBtnWrapper    .attr(opts.prevBtnWrapperAttrs)     .css(opts.prevBtnWrapperCSS);
        this.prevBtnBox         = prevBtnBox        .attr(opts.prevBtnBoxAttrs)         .css(opts.prevBtnBoxCSS);
        this.prevBtn            = prevBtn           .attr(opts.prevBtnAttrs)            .css(opts.prevBtnCSS)           .html(opts.prevBtnHtml);
        this.closeBtnWrapper    = closeBtnWrapper   .attr(opts.closeBtnWrapperAttrs)    .css(opts.closeBtnWrapperCSS);
        this.closeBtnBox        = closeBtnBox       .attr(opts.closeBtnBoxAttrs)        .css(opts.closeBtnBoxCSS);
        this.closeBtn           = closeBtn          .attr(opts.closeBtnAttrs)           .css(opts.closeBtnCSS)          .html(opts.closeBtnHtml);
        this.img                = img               .attr(opts.imgAttrs)                .css(opts.imgCSS);
        this.imgNext            = imgNext           .attr(opts.imgNextAttrs)            .css(opts.imgNextCSS);
        this.imgPrev            = imgPrev           .attr(opts.imgPrevAttrs)            .css(opts.imgPrevCSS);
        this.bottom             = bottom            .attr(opts.bottomAttrs)             .css(opts.bottomCSS);

        var prevBtnUnHoverCSS = {};
        for (var p in opts.prevBtnHoverCSS) {
            if (opts.prevBtnCSS) {
                prevBtnUnHoverCSS[p] = opts.prevBtnCSS[p];
            }
        }
        var closeBtnUnHoverCSS = {};
        for (var p in opts.closeBtnHoverCSS) {
            if (opts.closeBtnCSS) {
                closeBtnUnHoverCSS[p] = opts.closeBtnCSS[p];
            }
        }
        var bottomUnHoverCSS = {};
        for (var p in opts.bottomHoverCSS) {
            if (opts.bottomCSS) {
                bottomUnHoverCSS[p] = opts.bottomCSS[p];
            }
        }

        this.prevBtnWrapper.hover(function() {
            prevBtn.stop().animate(opts.prevBtnHoverCSS, opts.fadeIn);
        }, function() {
            prevBtn.stop().animate(prevBtnUnHoverCSS, opts.fadeOut);
        });

        this.closeBtnWrapper.hover(function() {
            closeBtn.stop().animate(opts.closeBtnHoverCSS, opts.fadeIn);
        }, function () {
            closeBtn.stop().animate(closeBtnUnHoverCSS, opts.fadeOut);
        });

        this.bottom.hover(function() {
            bottom.stop().animate(opts.bottomHoverCSS, opts.fadeIn);
        }, function () {
            bottom.stop().animate(bottomUnHoverCSS, opts.fadeOut);
        });

        return this.each(function(i) {
            $(this).unbind('click.abigimage').bind('click.abigimage', function() {
                return open(i);
            });
        });
    };

    $.abigimage = {
        open: open,
        next: next,
        prev: prev,
        close: close
    };

    $.fn.abigimage.defaults = {
        fadeIn:               'fast',
        fadeOut:              'fast',

        slideWidth:           .4,
        slideVelocity:        .4,

        zoomMin:              1.5,
        zoomMax:              5,

        prevBtnHtml:          '&larr;',
        closeBtnHtml:         'x',

        keyNext:              [13 /* enter */, 32 /* space */, 39 /* right */, 40 /* down */],
        keyPrev:              [8 /* backspace */, 37 /* left */, 38 /* up */],
        keyClose:             [27 /* escape */, 35 /* end */, 36 /* home */],

        onopen:               function() {},
        onclose:              function() {},

        overlayCSS:           {position: 'fixed', zIndex: 101, top: 0, right: 0, bottom: 0, left: 0,
                                  backgroundColor: '#000', opacity: .9},
        layoutCSS:            {position: 'fixed', zIndex: 101, top: 0, right: 0, bottom: 0, left: 0,
                                  '-webkit-user-select': 'none', '-moz-user-select': 'none', 'user-select': 'none',
                                  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
                                  lineHeight: 2.5},
        boxCSS:               {position: 'absolute', width: '312.5%', height: '100%', left: '-106.25%', top: 0},

        prevBtnWrapperCSS:    {cursor: 'pointer', position: 'absolute', top: 0, right: '50%', bottom: 0, left: 0},
        closeBtnWrapperCSS:   {cursor: 'pointer', position: 'absolute', top: 0, right: 0, bottom: 0, left: '50%'},

        prevBtnBoxCSS:        {position: 'absolute', zIndex: 103, top: 0, bottom: 0, left: '68%'},
        closeBtnBoxCSS:       {position: 'absolute', zIndex: 103, top: 0, bottom: 0, right: '68%'},

        prevBtnCSS:           {color: '#fff', backgroundColor: '#000', opacity: .5,
                                  padding: '0 1em', borderRadius: '0 0 1ex 0'},
        closeBtnCSS:          {color: '#fff', backgroundColor: '#000', opacity: .5,
                                  padding: '0 1em', borderRadius: '0 0 0 1ex'},

        prevBtnHoverCSS:      {opacity: 1},
        closeBtnHoverCSS:     {opacity: 1},

        imgCSS:               {position: 'absolute', zIndex: 102, margin: 'auto', width: 'auto',
                                  top: 0, right: 0, bottom: 0, left: 0,
                                  display: 'block', cursor: 'pointer', maxWidth: '32%', maxHeight: '100%'},
        imgNextCSS:           {position: 'absolute', margin: 'auto', width: 'auto',
                                  top: 0, right: 0, bottom: 0, left: '68%',
                                  display: 'block', maxWidth: '32%', maxHeight: '100%'},
        imgPrevCSS:           {position: 'absolute', margin: 'auto', width: 'auto',
                                  top: 0, right: '68%', bottom: 0, left: 0,
                                  display: 'block', maxWidth: '32%', maxHeight: '100%'},

        bottomCSS:            {position: 'fixed', zIndex: 104, right: 0, bottom: 0, left: 0,
                                  '-webkit-user-select': 'text', '-moz-user-select': 'text', 'user-select': 'text',
                                  backgroundColor: '#000', color: '#fff', opacity: .5,
                                  padding: '0 1em', textAlign: 'center'},
        bottomHoverCSS:       {opacity: 1},

        overlayAttrs:         {},
        layoutAttrs:          {},
        boxAttrs:             {},
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
