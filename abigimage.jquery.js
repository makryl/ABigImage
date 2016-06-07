/**
 * http://aeqdev.com/tools/js/abigimage/
 *
 * MIT License
 *
 * Copyright (c) 2014-2016 Maksim Krylosov <aequiternus@gmail.com>
 */

(function ($) {

    var last,
        current,
        overlay     = $('<div>').addClass('abigimage-overlay')    .appendTo('body') .hide(),
        layout      = $('<div>').addClass('abigimage-layout')     .appendTo('body') .hide(),
        box         = $('<div>').addClass('abigimage-box')        .appendTo(layout),
        prevBtnBox  = $('<div>').addClass('abigimage-prevBtnBox') .appendTo(box),
        closeBtnBox = $('<div>').addClass('abigimage-closeBtnBox').appendTo(box),
        prevBtn     = $('<div>').addClass('abigimage-prevBtn')    .appendTo(layout),
        closeBtn    = $('<div>').addClass('abigimage-closeBtn')   .appendTo(layout),
        bottom      = $('<div>').addClass('abigimage-bottom')     .appendTo(layout),
        boxe        = box[0],
        $w          = $(window);

    $.fn.abigimage = function(options) {
        var plugin = new ABigImage(this, options);
        this._abigimage = plugin;
        last = plugin;
        return this.each(function(i) {
            $(this).unbind('click.abigimage').bind('click.abigimage', function(event) {
                prevent(event);
                plugin.open(i);
            });
        });
    };

    $.fn.abigimage.defaults = {
        fadeIn:               'fast',
        fadeOut:              'fast',
        slideWidth:           .4,
        slideVelocity:        .4,
        zoomMin:              1.5,
        zoomMax:              5,
        zoomScrollMultiplier: 1.25,
        zoomMoveViewport:     0.9,
        doubleTapInterval:    400,
        prevBtnHtml:          '&larr;',
        closeBtnHtml:         'x',
        keyNext:              [13 /* enter */, 32 /* space */, 39 /* right */, 40 /* down */],
        keyPrev:              [8 /* backspace */, 37 /* left */, 38 /* up */],
        keyClose:             [27 /* escape */, 35 /* end */, 36 /* home */],
        onopen:               null,
        onclose:              null
    };

    $.abigimage = {
        overlay:              overlay,
        layout:               layout,
        prevBtnBox:           prevBtnBox,
        prevBtn:              prevBtn,
        closeBtnBox:          closeBtnBox,
        closeBtn:             closeBtn,
        box:                  box,
        bottom:               bottom,

        open: function(src, index, sel) {
            ((sel && sel._abigimage) || current || last).open(src, index);
        },
        close: function(sel) {
            ((sel && sel._abigimage) || current || last).close();
        },
        next: function(sel) {
            ((sel && sel._abigimage) || current || last).next();
        },
        prev: function(sel) {
            ((sel && sel._abigimage) || current || last).prev();
        },
        unbind: function(sel) {
            ((sel && sel._abigimage) || current || last).unbind();
        }
    };

    prevBtnBox.click(function(event) {
        prevent(event);
        if (current) current.prev();
    }).hover(function() {
        prevBtn.addClass('abigimage-prevBtn-hover');
    }, function() {
        prevBtn.removeClass('abigimage-prevBtn-hover');
    });

    closeBtnBox.click(function(event) {
        prevent(event);
        if (current) current.close();
    }).hover(function() {
        closeBtn.addClass('abigimage-closeBtn-hover');
    }, function() {
        closeBtn.removeClass('abigimage-closeBtn-hover');
    });

    prevBtn.click(function(event) {
        prevent(event);
        if (current) current.prev();
    });

    closeBtn.click(function(event) {
        prevent(event);
        if (current) current.close();
    });

    layout
        .on('touchmove', prevent)
        .on('wheel', prevent);

    if (boxe.addEventListener) {
        function listen(element, event, listener) { // just for minification
            element.addEventListener(event, listener);
        }
        listen(boxe, 'touchstart', touchstart);
        listen(boxe, 'touchmove', touchmove);
        listen(boxe, 'touchend', touchend);
        listen(boxe, 'touchcancel', touchend);

        listen(boxe, 'webkitTransitionEnd', transitionEnd);
        listen(boxe, 'mozTransitionEnd', transitionEnd);
        listen(boxe, 'msTransitionEnd', transitionEnd);
        listen(boxe, 'oTransitionEnd', transitionEnd);
        listen(boxe, 'transitionend', transitionEnd);

        listen(boxe, 'wheel', zoomwheel);
        listen(boxe, 'mousemove', zoomwheel);
    }

    function ABigImage(elements, options) {
        $.extend(this, $.fn.abigimage.defaults, options);

        this.elements    = elements;

        this.overlay     = overlay;
        this.layout      = layout;
        this.prevBtnBox  = prevBtnBox;
        this.prevBtn     = prevBtn;
        this.closeBtnBox = closeBtnBox;
        this.closeBtn    = closeBtn;
        this.box         = box;
        this.bottom      = bottom;

        this.index       = -1;
        this.distance    = 0;
    }

    ABigImage.prototype.open = function(src, index) {
        current = this;

        var currLink;
        if ('number' == typeof src) {
            index = src;
            if (index == this.index || index < 0 || index > this.elements.length - 1) {
                return;
            }
            currLink = $(this.elements[index]);
            src = currLink.data('href') || currLink.attr('href');
        } else {
            if ('number' != typeof index) {
                index = this.index;
            } else if (index == this.index) {
                return;
            }
        }

        this.index = index;

        this.prevBtn.html(this.prevBtnHtml);
        this.closeBtn.html(this.closeBtnHtml);
        this.bottom.html('');

        $('img', this.box).remove();

        this.box.removeClass('abigimage-box-zoom');
        slideAnimate(0, 0, 1);

        this.img = createImage('abigimage-img', src)
            .click(function(event) {
                prevent(event);
                if (current) current.next();
            });

        var nextElement = $(this.elements[this.nextIndex()]);
        this.imgNext = createImage('abigimage-imgNext', nextElement.data('href') || nextElement.attr('href'));
        var prevElement = $(this.elements[this.prevIndex()]);
        this.imgPrev = createImage('abigimage-imgPrev', prevElement.data('href') || prevElement.attr('href'));

        overlay.fadeIn();
        layout.fadeIn();

        $(document).unbind('keydown', documentKeydown).bind('keydown', documentKeydown);

        if (this.onopen) this.onopen.call(this, currLink);
    };

    ABigImage.prototype.next = function() {
        if (this.distance == this.elements.length - 1) {
            this.close();
        } else {
            ++this.distance;
            this.elements[this.nextIndex()].click();
            //this.open(this.nextIndex());
        }
    };

    ABigImage.prototype.prev = function() {
        if (this.distance == 1 - this.elements.length) {
            this.close();
        } else {
            --this.distance;
            this.elements[this.prevIndex()].click();
            //this.open(this.prevIndex());
        }
    };

    ABigImage.prototype.close = function() {
        if (!current) return;

        $(document).unbind('keydown', documentKeydown);

        overlay.fadeOut(this.fadeOut);
        layout.fadeOut(this.fadeOut, transitionEnd);

        if (this.onclose) this.onclose.call(this);

        this.index = -1;
        this.distance = 0;

        current = null;
    };

    ABigImage.prototype.unbind = function() {
        this.close();
        this.elements.each(function() {
            $(this).unbind('click.abigimage');
        })
    };

    ABigImage.prototype.key = function(keyCode) {
        if (this.keyNext.indexOf(keyCode) != -1) {
            this.next();
        } else if (this.keyPrev.indexOf(keyCode) != -1) {
            this.prev();
        } else if (this.keyClose.indexOf(keyCode) != -1) {
            this.close();
        } else {
            return false;
        }
        return true;
    };

    ABigImage.prototype.nextIndex = function() {
        var index = this.index + 1;
        if (index >= this.elements.length) {
            index = 0;
        }
        return index;
    };

    ABigImage.prototype.prevIndex = function() {
        var index = this.index - 1;
        if (index < 0) {
            index = this.elements.length - 1;
        }
        return index;
    };

    function createImage(className, src) {
        return $('<img>').addClass(className).attr('src', src).appendTo(box);
    }

    function documentKeydown(event) {
        if (current) {
            if (current.key(event.which)) {
                prevent(event);
            }
        }
    }

    function prevent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

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
        ww,
        wh,
        mx,
        my,

        dstart,
        start,
        width,
        height,
        minD,
        vert,
        touches,
        intr,
        ontr,
        bs = boxe.style;

    function touchstart(e) {
        if (!current) return;

        if (e.touches.length > 1) {
            k = dis(e);
            current.box.addClass('abigimage-box-zoom');
        } else {
            vert = null;
            dstart = start;
            start = (new Date()).getTime();
            width = box.width() * 0.34;
            height = box.height();
            minD = current.slideWidth * width;
            initSizes();
        }
        sx = x;
        sy = y;
        ss = s;
        dx = 0;
        dy = 0;
        touches = e.touches;
        prevent(e);
    }

    function touchmove(e) {
        if (!current) return;

        if (e.touches.length > 1) {
            s = ss * (dis(e) / k);
            if (s < 1) {
                s = 0.333 * s * s * s + 0.666;
            }
        }

        dx = (ww - med(touches, 'X')) / ss - (ww - med(e.touches, 'X')) / s;
        dy = (wh - med(touches, 'Y')) / ss - (wh - med(e.touches, 'Y')) / s;

        x = sx + dx;
        y = sy + dy;

        if (s <= current.zoomMin && e.touches.length <= 1) {
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
        slideAnimate(x, y, s);
        prevent(e);
    }

    function touchend(e) {
        if (!current) return;

        var end = (new Date()).getTime();
        var time = end - start;

        if (e.touches.length) {
            sx = x;
            sy = y;
            ss = s;
            dx = 0;
            dy = 0;
            touches = e.touches;
        } else {
            if (s <= current.zoomMin) {
                if (time <= 1 || (dx >= -1 && dx <= 1 && dy >= -1 && dy <= 1)) {
                    if (start - dstart <= current.doubleTapInterval) {
                        s = current.zoomMax;
                        var tx = med(touches, 'X');
                        var ty = med(touches, 'Y');
                        x += (ww - tx) / ss - (ww - tx) / s;
                        y += (wh - ty) / ss - (wh - ty) / s;

                        mx = iw - ww / s;
                        my = ih - wh / s;
                        x = mx <= 0 ? 0 : Math.max(-mx, Math.min(mx, x));
                        y = my <= 0 ? 0 : Math.max(-my, Math.min(my, y));

                        current.box.addClass('abigimage-box-zoom');
                        slideAnimate(x, y, s, true);
                    } else {
                        slideAnimate(0, 0, 1, true);
                    }
                } else {
                    if (vert) {
                        var ady = Math.abs(dy);
                        if (ady > minD) {
                            slideClose();
                        } else {
                            if (ady / time > current.slideVelocity) {
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
                            if (Math.abs(dx) / time > current.slideVelocity) {
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
            } else {
                if (end - dstart <= current.doubleTapInterval) {
                    slideBack();
                } else {
                    s = Math.max(1, Math.min(current.zoomMax, s));
                    mx = iw - ww / s;
                    my = ih - wh / s;
                    x = mx <= 0 ? 0 : Math.max(-mx, Math.min(mx, x));
                    y = my <= 0 ? 0 : Math.max(-my, Math.min(my, y));
                    slideAnimate(x, y, s, true);
                }
            }
        }

        touches = e.touches;
        prevent(e);
    }

    function med(ts, c) {
        var p = 0;
        for (var t = 0, l = ts.length; t < l; t++) {
            p += ts[t]['client' + c];
        }
        return p / l;
    }

    function dis(e) {
        return Math.sqrt(
            Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2) +
            Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2)
        );
    }

    function initSizes() {
        iw = current.img.width() / 2;
        ih = current.img.height() / 2;
        ww = $w.width() / 2;
        wh = $w.height() / 2;
    }

    function slideNext() {
        slideAnimate(-width, 0, 1, true, function() {
            current.next();
        });
    }

    function slidePrev() {
        slideAnimate(width, 0, 1, true, function() {
            current.prev();
        });
    }

    function slideBack() {
        current.box.removeClass('abigimage-box-zoom');
        slideAnimate(0, 0, 1, true);
    }

    function slideClose() {
        slideBack();
        current.close();
    }

    function slideAnimate(tx, ty, ts, transition, onend) {
        x = tx;
        y = ty;
        s = ts;
        intr = transition;
        ontr = onend;
        var transform = 'scale(' + s + ') translate3d(' + x + 'px, ' + y + 'px, 0)';
        bs.transition = transition ? 'all .2s ease-out' : '';
        bs.webkitTransform = transform;
        bs.mozTransform = transform;
        bs.msTransform = transform;
        bs.oTransform = transform;
        bs.transform = transform;
    }

    function transitionEnd() {
        intr = false;
        if (ontr) {
            var f = ontr;
            ontr = null;
            f();
        }
    }

    function zoomwheel(e) {
        if (!current) return;

        initSizes();

        if (e.deltaY > 0) {
            s /= current.zoomScrollMultiplier;
        } else if (e.deltaY < 0) {
            s *= current.zoomScrollMultiplier;
        }
        s = Math.max(1, Math.min(current.zoomMax, s));

        x = 0;
        y = 0;

        mx = iw - ww / s;
        my = ih - wh / s;

        if (mx > 0)
        {
            x = (ww - e.clientX) / (current.zoomMoveViewport * ww / iw) - (ww - e.clientX) / s;
            x = Math.max(-mx, Math.min(mx, x));
        }

        if (my > 0)
        {
            y = (wh - e.clientY) / (current.zoomMoveViewport * wh / ih) - (wh - e.clientY) / s;
            y = Math.max(-my, Math.min(my, y));
        }

        slideAnimate(x, y, s, true);
        prevent(e);
    }

}(jQuery));
