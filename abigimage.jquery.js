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

        //overscroll  = $('<div>').addClass('abigimage-overscroll') .appendTo('body'),
        overlay     = $('<div>').addClass('abigimage-overlay')    .appendTo('body'),
        layout      = $('<div>').addClass('abigimage-layout')     .appendTo('body'),
        wrapper     = $('<div>').addClass('abigimage-wrapper')    .appendTo(layout),
        box         = $('<div>').addClass('abigimage-box')        .appendTo(wrapper),
        prevBtnBox  = $('<div>').addClass('abigimage-prevBtnBox') .appendTo(box),
        closeBtnBox = $('<div>').addClass('abigimage-closeBtnBox').appendTo(box),
        top         = $('<div>').addClass('abigimage-top')        .appendTo(layout),
        prevBtn     = $('<div>').addClass('abigimage-prevBtn')    .appendTo(top),
        nextBtn     = $('<div>').addClass('abigimage-nextBtn')    .appendTo(top),
        counter     = $('<div>').addClass('abigimage-counter')    .appendTo(top),
        closeBtn    = $('<div>').addClass('abigimage-closeBtn')   .appendTo(top),
        zoomOutBtn  = $('<div>').addClass('abigimage-zoomOutBtn') .appendTo(top),
        zoomInBtn   = $('<div>').addClass('abigimage-zoomInBtn')  .appendTo(top),
        //spinner     = $('<div>').addClass('abigimage-spinner')    .appendTo(top),
        bottomBox   = $('<div>').addClass('abigimage-bottomBox')  .appendTo(layout),
        bottom      = $('<div>').addClass('abigimage-bottom')     .appendTo(bottomBox),
        //under       = $('<div>').addClass('abigimage-under')      .appendTo(layout),

        cssLayoutActive = 'abigimage-layout-active',
        cssLayoutFadeout = 'abigimage-layout-fadeout',
        cssLayoutFull = 'abigimage-layout-full',
        //cssLayoutSlide = 'abigimage-layout-slide',
        cssLayoutZoom = 'abigimage-layout-zoom',
        cssOverlayActive = 'abigimage-overlay-active',
        cssPrevBtnHover = 'abigimage-prevBtn-hover',
        cssNextBtnHover = 'abigimage-nextBtn-hover',
        cssCloseBtnHover = 'abigimage-closeBtn-hover',
        //cssSpinnerActive = 'abigimage-spinner-active',

        boxe        = box[0],
        //bboxe       = bottomBox[0],
        $w          = $(window),
        $h          = $('html'),
        $d          = $(document),
        $b          = $(document.body),

        hpr         = null,
        bo          = null,
        //wst         = null,
        //bt          = null,

        sx,
        sy,
        ss,
        mss,
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

        ztimer,
        zstart,
        zsign,
        ttimer,
        dstart,
        start,
        width,
        height,
        minD,
        vert,
        touches,
        intr,
        ontr,
        sliding = false,
        wheellock = false,
        wheellocktimer,
        zoomlock = false,
        zoomlocktimer,
        bs = boxe.style,
        os = overlay[0].style;

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
        duration:             200,
        slideWidth:           .4,
        slideVelocity:        .4,
        zoomMin:              1.5,
        zoomMax:              5,
        zoomClose:            .9,
        zoomMoveViewport:     .9,
        zoomVelocity:         .04,
        doubleTapInterval:    400,
        prevBtnHtml:          '&larr;',
        nextBtnHtml:          '&rarr;',
        zoomInBtnHtml:        '&plus;',
        zoomOutBtnHtml:       '&minus;',
        closeBtnHtml:         '&times;',
        keyNext:              [13 /* enter */, 32 /* space */, 39 /* right */, 40 /* down */],
        keyPrev:              [8 /* backspace */, 37 /* left */, 38 /* up */],
        keyClose:             [27 /* escape */, 35 /* end */, 36 /* home */],
        onopen:               null,
        onclose:              null
    };

    $.abigimage = {
        overlay:     overlay,
        layout:      layout,
        wrapper:     wrapper,
        box:         box,
        prevBtnBox:  prevBtnBox,
        closeBtnBox: closeBtnBox,
        top:         top,
        prevBtn:     prevBtn,
        nextBtn:     nextBtn,
        zoomInBtn:   zoomInBtn,
        zoomOutBtn:  zoomOutBtn,
        closeBtn:    closeBtn,
        counter:     counter,
        //spinner:     spinner,
        bottomBox:   bottomBox,
        bottom:      bottom,
        //under:       under,

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
        prevBtn.addClass(cssPrevBtnHover);
    }, function() {
        prevBtn.removeClass(cssPrevBtnHover);
    });

    closeBtnBox.click(function(event) {
        prevent(event);
        if (current) current.close();
    }).hover(function() {
        closeBtn.addClass(cssCloseBtnHover);
    }, function() {
        closeBtn.removeClass(cssCloseBtnHover);
    });

    prevBtn.click(function(event) {
        prevent(event);
        if (current) current.prev();
    });

    nextBtn.click(function(event) {
        prevent(event);
        if (current) current.next();
    });

    var reqAnimFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback){
            setTimeout(function(){
                callback((new Date()).getTime());
            }, 1000 / 60);
        };


    function zoomAnimationFrame(t) {
        if (current && zsign !== null) {
            if (zstart) {
                zoom(zsign * current.zoomVelocity * (t - zstart));
            } else {
                zstart = t;
            }
            reqAnimFrame(zoomAnimationFrame);
        }
    }

    zoomInBtn.mousedown(function(event) {
        prevent(event);
        initSizes();
        zstart = null;
        zsign = 1;
        reqAnimFrame(zoomAnimationFrame);
    }).mouseup(function(event){
        prevent(event);
        zsign = null;
    }).mouseout(function(){
        zsign = null;
    }).click(function(event) {
        prevent(event);
        if (current) zoom(current.zoomVelocity * current.duration, true);
    });

    zoomOutBtn.mousedown(function(event) {
        prevent(event);
        initSizes();
        zstart = null;
        zsign = -1;
        reqAnimFrame(zoomAnimationFrame);
    }).mouseup(function(event){
        prevent(event);
        zsign = null;
    }).mouseout(function(){
        zsign = null;
    }).click(function(event) {
        prevent(event);
        if (current) zoom(-current.zoomVelocity * current.duration, true);
    });

    closeBtn.click(function(event) {
        prevent(event);
        if (current) current.close();
    });

    //layout
    //    .on('touchmove', prevent)
    //    .on('wheel', function(e) {
    //        e.stopPropagation();
    //    });

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
        listen(boxe, 'mousemove', zoommousemove);
    }

    function ABigImage(elements, options) {
        $.extend(this, $.fn.abigimage.defaults, options);

        this.elements    = elements;

        this.overlay     = overlay;
        this.layout      = layout;
        this.wrapper     = wrapper;
        this.prevBtnBox  = prevBtnBox;
        this.closeBtnBox = closeBtnBox;
        this.box         = box;
        this.top         = top;
        this.prevBtn     = prevBtn;
        this.nextBtn     = nextBtn;
        this.zoomInBtn   = zoomInBtn;
        this.zoomOutBtn  = zoomOutBtn;
        this.closeBtn    = closeBtn;
        this.counter     = counter;
        //this.spinner     = spinner;
        this.bottomBox   = bottomBox;
        this.bottom      = bottom;
        //this.under       = under;

        this.index       = -1;
        this.distance    = 0;
        this.opened      = null;
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
        this.opened = currLink;

        this.prevBtn.html(this.prevBtnHtml);
        this.nextBtn.html(this.nextBtnHtml);
        this.zoomInBtn.html(this.zoomInBtnHtml);
        this.zoomOutBtn.html(this.zoomOutBtnHtml);
        this.closeBtn.html(this.closeBtnHtml);
        this.bottom.html('');
        //this.under.html('');
        this.counter.html(index >= 0 ? (index + 1) + ' / ' + this.elements.length : '');

        $('img', this.box).remove();

        fadeReset();
        //overscroll.addClass('abigimage-overscroll-active');
        this.overlay.addClass(cssOverlayActive)
            /*.removeClass('abigimage-overlay-fadeout')*/;
        this.layout.addClass(cssLayoutActive)
            //.removeClass(cssLayoutSlide)
            .removeClass(cssLayoutFadeout)
            .scrollTop(0);
        slideAnimate(0, 0, 1);

        this.img = createImage('abigimage-img', src)
            .click(function(event) {
                prevent(event);
                if (current) current.next();
            })
            .hover(function() {
                nextBtn.addClass(cssNextBtnHover);
            }, function() {
                nextBtn.removeClass(cssNextBtnHover);
            })
            .one('load', function() { checkImagesLoaded(); });

        var nextElement = $(this.elements[this.nextIndex()]);
        this.imgNext = createImage('abigimage-imgNext', nextElement.data('href') || nextElement.attr('href'))
            .hide()
            .one('load', function() { checkImagesLoaded(); });
        var prevElement = $(this.elements[this.prevIndex()]);
        this.imgPrev = createImage('abigimage-imgPrev', prevElement.data('href') || prevElement.attr('href'))
            .hide()
            .one('load', function() { checkImagesLoaded(); });

        //this.spinner.toggleClass(cssSpinnerActive, !this.img[0].complete);
        checkImagesLoaded(true);

        $d.unbind('keydown', documentKeydown).bind('keydown', documentKeydown);

        //if (wst === null && bt === null) {
        //    wst = $w.scrollTop();
        //    bt = $b.css('top');
        //    $b.css('top', (-1 * wst) + 'px').addClass('abigimage-body');
        //}
        if (hpr === null && bo === null) {
            hpr = $h.css('padding-right');
            bo = $b.css('overflow-y');
            $h.css('padding-right', (parseInt(hpr) + window.innerWidth - $w.width()) + 'px');
            $b.css('overflow-y', 'hidden');
        }

        if (this.onopen) this.onopen.call(this, this.opened);
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

        $d.unbind('keydown', documentKeydown);

        //setTimeout(function() {
            $h.css('padding-right', hpr);
            $b.css('overflow-y', bo);
            hpr = null;
            bo = null;
            //overscroll.removeClass('abigimage-overscroll-active');
            //$b.css('top', bt).removeClass('abigimage-body');
            //$w.scrollTop(wst);
            //wst = null;
            //bt = null;
        //}, current.duration);

        //fadeReset();
        overlay.removeClass(cssOverlayActive);
        layout.removeClass(cssLayoutActive);

        if (this.onclose) this.onclose.call(this, this.opened);

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

    function checkImagesLoaded(forceNoSlide) {
        if (!current) return;

        if (!forceNoSlide && sliding) return;

        if (current.imgNext[0].complete) {
            current.imgNext.show();
        }

        if (current.imgPrev[0].complete) {
            current.imgPrev.show();
        }

        //if (current.img[0].complete && current.imgNext[0].complete && current.imgPrev[0].complete) {
        //    current.spinner.removeClass(cssSpinnerActive);
        //}
    }

    function onSlideStart() {
        if (!current) return;

        sliding = true;
        //current.layout.addClass(cssLayoutSlide);

        //if (!current.img[0].complete || !current.imgNext[0].complete || !current.imgPrev[0].complete) {
        //    current.spinner.addClass(cssSpinnerActive);
        //}
    }

    function onSlideEnd() {
        if (!current) return;

        sliding = false;
        //current.layout.removeClass(cssLayoutSlide);

        checkImagesLoaded(true);
    }

    function touchstart(e) {
        if (!current) return;

        onSlideEnd();

        if (e.touches.length > 1) {
            k = dis(e);
            current.layout.addClass(cssLayoutZoom);
        } else {
            vert = null;
            mss = s;
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

        if (ttimer) {
            clearTimeout(ttimer);
            ttimer = null;
        }
        if (e.touches.length == 1) {
            ttimer = setTimeout(function() {
                current.layout.toggleClass(cssLayoutFull);
                ttimer = null;
            }, current.doubleTapInterval);
        }
    }

    function touchmove(e) {
        if (!current) return;

        if (e.touches.length > 1) {
            s = ss * (dis(e) / k);
            if (s < 1) {
                s = 0.333 * s * s * s + 0.666;
                fadeTo(s);
            }
            if (s > mss) {
                mss = s;
            }
        }

        dx = (ww - med(touches, 'X')) / ss - (ww - med(e.touches, 'X')) / s;
        dy = (wh - med(touches, 'Y')) / ss - (wh - med(e.touches, 'Y')) / s;

        x = sx + dx;
        y = sy + dy;

        if (ttimer && (dx > 1 || dx < -1 || dy > 1 || dy < -1)) {
            clearTimeout(ttimer);
            ttimer = null;
        }

        if (s == 1 && e.touches.length == 1) {
            if (null === vert) {
                var dv = Math.abs(dy) - Math.abs(dx);
                if (Math.abs(dv) > 2) {
                    vert = dv > 0;
                }
                if (vert === false) {
                    onSlideStart();
                }
            }
            if (vert) {
                x = 0;
                fadeTo(1 - Math.abs(dy) / height);
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
            //dx = 0;
            //dy = 0;
            //touches = e.touches;
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

                        if (ttimer) {
                            clearTimeout(ttimer);
                            ttimer = null;
                        }

                        current.layout.addClass(cssLayoutZoom);
                        slideAnimate(x, y, s, true);
                    } else {
                        slideBack();
                    }
                } else if (mss == 1) {
                    if (s < current.zoomClose) {
                        slideClose();
                    } else if (vert) {
                        var ady = Math.abs(dy);
                        if (ady > minD) {
                            slideClose(dy);
                        } else {
                            if (ady / time > current.slideVelocity) {
                                slideClose(dy);
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
                } else {
                    slideBack();
                }
            } else {
                if (end - dstart <= current.doubleTapInterval) {
                    if (ttimer) {
                        clearTimeout(ttimer);
                        ttimer = null;
                    }

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
        wh = ($w.height() - current.top.height() - current.bottomBox.height()) / 2;
    }

    function slideNext() {
        slideAnimate(-width, 0, 1, true, function() {
            current.next();
        });
        layout.animate({scrollTop: 0}, current.duration);
    }

    function slidePrev() {
        slideAnimate(width, 0, 1, true, function() {
            current.prev();
        });
        layout.animate({scrollTop: 0}, current.duration);
    }

    function slideBack() {
        slideAnimate(0, 0, 1, true, function() {
            current.layout.removeClass(cssLayoutZoom);
            onSlideEnd();
        });
        fadeTo(1, true);
        //overlay.addClass('abigimage-overlay-fadeout');
    }

    function slideClose(dir) {
        if (dir) {
            slideAnimate(x, Math.sign(dir) * ($w.height() / 2 + ih), s, true, function() {
                current.close();
            });
        } else {
            slideAnimate(x, y, 0, true, function() {
                current.close();
            });
        }
        fadeTo(0, true);
        //overlay.addClass('abigimage-overlay-fadeout');
        layout.addClass(cssLayoutFadeout);
        //current.close();
    }

    function slideAnimate(tx, ty, ts, transition, onend) {
        x = tx;
        y = ty;
        s = ts;
        intr = transition;
        ontr = onend;
        var transform = 'scale(' + s + ') translate3d(' + x + 'px, ' + y + 'px, 0)';
        bs.transition = transition ? 'all ' + current.duration + 'ms ease-out' : 'none';
        bs.webkitTransform = transform;
        bs.mozTransform = transform;
        bs.msTransform = transform;
        bs.oTransform = transform;
        bs.transform = transform;

    }

    function fadeTo(o, transition) {
        os.transition = transition ? 'opacity ' + current.duration + 'ms ease-out' : 'none';
        os.opacity = o;
        var transform = 'translate3d(0, 0, 0)';
        os.webkitTransform = transform;
        os.mozTransform = transform;
        os.msTransform = transform;
        os.oTransform = transform;
        os.transform = transform;
    }

    function fadeReset() {
        os.transition = null;
        os.opacity = null;
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

        var delta = -e.deltaY || 0;
        if (e.deltaMode == 1) { // line
            delta *= current.zoomVelocity * current.duration;
        } else if (e.deltaMode == 2) { // page
            delta *= height;
        }

        if (layout.scrollTop() || (s == 1 && delta < 0)) {
            if (wheellock) {
                prevent(e);
            } else {
                if (zoomlocktimer) {
                    clearTimeout(zoomlocktimer);
                }
                zoomlock = true;
                zoomlocktimer = setTimeout(function() {
                    zoomlock = false;
                    zoomlocktimer = null;
                }, current.duration);
            }
            return;
        } else {
            if (zoomlock) return;

            if (wheellocktimer) {
                clearTimeout(wheellocktimer);
            }
            wheellock = true;
            wheellocktimer = setTimeout(function() {
                wheellock = false;
                wheellocktimer = null;
            }, current.duration);
        }

        zoomposition(e, delta);
    }

    function zoommousemove(e) {
        if (!current) return;
        if (s == 1) return;

        zoomposition(e, 0);
    }

    function zoomposition(e, delta) {
        initSizes();

        x = (ww - e.clientX) / (current.zoomMoveViewport * ww / iw) - (ww - e.clientX) / s;
        y = (wh - e.clientY) / (current.zoomMoveViewport * wh / ih) - (wh - e.clientY) / s;

        zoom(delta, true);
        prevent(e);
    }

    function zoom(delta, transition) {
        if (!current) return;

        s *= (ih + delta) / ih;
        s = Math.max(1, Math.min(current.zoomMax, s));

        mx = iw - ww / s;
        my = ih - wh / s;

        if (mx > 0) {
            x = Math.max(-mx, Math.min(mx, x));
        } else {
            x = 0;
        }

        if (my > 0) {
            y = Math.max(-my, Math.min(my, y));
        } else {
            y = 0;
        }

        slideAnimate(x, y, s, transition);
    }

}(jQuery));
