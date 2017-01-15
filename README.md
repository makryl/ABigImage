# ABigImage

`ABigImage` is jQuery plugin for viewing big versions of images.

Current version **2.1.0** (2017-01-15).

<div class="colr">
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="hosted_button_id" value="NUZ7CTKFYDX8C">
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" name="submit" alt="Donate PayPal">
        <img alt="" border="0" src="https://www.paypalobjects.com/ru_RU/i/scr/pixel.gif" width="1" height="1">
    </form>
</div>

* [abigimage.jquery.js](abigimage.jquery.js) (26.9 kB) [min](abigimage.jquery.min.js) (10.2 kB, gzipped 3.6 kB)
* [abigimage.jquery.css](abigimage.jquery.css) (6 kB) [min](abigimage.jquery.min.css) (3.1 kB, gzipped 802 bytes)
* Fork at [Github](https://github.com/makryl/ABigImage)

## Features

- Fit mobile devices.
- Uses CSS3 transform and transition for smooth touch sliding.
- Touch slide left or right opens next or previous image, touch slide up or down closes image.
- Multi-touch and double-tap zoom, zoom out closes image.
- Clicking image opens next one, clicking left side opens previous, clicking right side closes image.
- Hotkeys for next, previous and close buttons.
- Closing after viewing of all images.
- Preloading of next and previous images.
- Images counter.
- Uses link's `href` or `data-href` attribute for large images.
- Fully customizable styles.
- Customizable, scrolling down bottom area.
- Customizable `onopen` and `onclose` event.

<!-- Example -->

## Usage

### Basic

Add jQuery and ABigImage scripts, and ABigImage styles at your page.

```html
<script src="jquery.js"></script>
<script src="abigimage.jquery.js"></script>
<link rel="stylesheet" href="abigimage.jquery.css">
```

Call plugin on selector of enlargeable images links.

```js
$(function(){
    /* all links with class "myimgclass" */
    $('.myimgclass').abigimage();
    
    /* or all links inside element with class "myimgboxclass" */
    $('.myimgboxclass a').abigimage();
    
    /* or all links to "*.jpg" images */
    $('a[href$=".jpg"]').abigimage();
    
    /* or all links to images under dir "/my/images/dir/" */
    $('a[href^="/my/images/dir/"]').abigimage();
});
```

### Options

- `duration` - effects duration (default: `200`).
- `slideWidth` - slide width to switch or close image (between 0 and 1, default: 0.4).
- `slideVelocity` - slide velocity to switch or close image (pixels per millisecond, default: 0.4).
- `zoomMin` - minimal zoom that will hold (default: 1.5).
- `zoomMax` - maximal zoom (default: 5).
- `zoomClose` - zoom that will close image (default: 0.9).
- `zoomMoveViewport` - area for mouse moving when zoomed (default: 0.9).
- `zoomVelocity` - zoom velocity on scroll or press button (pixels per millisecond, default: .04).
- `doubleTapInterval` - zoom double-tap interval (milliseconds, default: 400).
- `prevBtnHtml` - html of "previous" button (default: `&larr;`).
- `nextBtnHtml` - html of "next" button (default: `&rarr;`).
- `zoomInBtnHtml` - html of "zoom in" button (default: `&plus;`).
- `zoomOutBtnHtml` - html of "zoom out" button (default: `&minus;`).
- `closeBtnHtml` - html of "close" button (default: `&times;`).
- `keyNext` - hotkeys for "next" button (default: 13 enter, 32 space, 39 right, 40 down).
- `keyPrev` - hotkeys for "previous" button (default: 8 backspace, 37 left, 38 up).
- `keyClose` - hotkeys for "close" button (default: 27 escape, 35 end, 36 home).
- `onopen` - function called when image opens.
- `onclose` - function called when image closes.

To change styles use CSS classes of plugin's elements:

```html
<div class="abigimage-overlay"></div>
<div class="abigimage-layout">
    <div class="abigimage-wrapper">
        <div class="abigimage-box">
            <!-- prevBtnBox - clickable behind the image, width 50% -->
            <div class="abigimage-prevBtnBox"></div>
            <!-- closeBtnBox - clickable behind the image, width 50% -->
            <div class="abigimage-closeBtnBox"></div>
            <img class="abigimage-img">
            <img class="abigimage-imgNext">
            <img class="abigimage-imgPrev">
        </div>
    </div>
    <div class="abigimage-top">
        <div class="abigimage-prevBtn"><!-- prevBtnHtml --></div>
        <div class="abigimage-nextBtn"><!-- nextBtnHtml --></div>
        <div class="abigimage-counter"></div>
        <div class="abigimage-closeBtn"><!-- closeBtnHtml --></div>
        <div class="abigimage-zoomOutBtn"><!-- zoomOutBtnHtml --></div>
        <div class="abigimage-zoomInBtn"><!-- zoomInBtnHtml --></div>
    </div>
    <div class="abigimage-bottomBox">
        <div class="abigimage-bottom"></div>
    </div>
</div>
```

### Using onopen handler

Function, defined as `onopen` handler, executes in context of plugin, and receives target element as argument. Plugin elements available in this context as properties.

```js
$('a[href$=".jpg"]').abigimage({
    onopen: function (target) {
        this.bottom.html(
            /* bottom caption */
            $('img', target).attr('alt') +
            /* custom bottom area */
            ($('span', target).html() || '')
        );
    }
});
```

### Using custom links with data-href attribute

If you want different link for plugin's big image and for non-javascript clients (search engines or browsers without javascript) - use `data-href` attribute:

```html
<a href="/non_javascript_link.html" data-href="/images/big/myimage.jpg"> ... </a>
```

Also, you can use `data-href` attribute on any element, not only links.

### Static methods

- `open([src], [index], [sel])` - open image by URL or index.
- `next([sel])` - open next image.
- `prev([sel])` - open previous image.
- `close([sel])` - close image.
- `unbind([sel])` - unbind plugin events.

```js
/* open image by URL */
$.abigimage.open('/awesomeimage.jpg');

/* open image by index */
$.abigimage.open(2);

/* open image by URL at specified position */
$.abigimage.open('/awesomeimage.jpg', 5);

/* open next image */
$.abigimage.next();

/* open previous image */
$.abigimage.prev();

/* close image */
$.abigimage.close();

/* unbind plugin events */
$.abigimage.unbind();
```

All static methods by default tries to execute on current opened plugin insatnce, if no instances opened, tries to execute on last created instance. You can specify instance by passing it's selector in last argument `sel`.
 
```js
$myimgs1 = $('.myimgs1 a').abigimage();
$myimgs2 = $('.myimgs2 a').abigimage();

$.abigimage.open('/awesomeimage.jpg', null, $myimgs2);
$.abigimage.unbind($myimgs1);
```

## Changes
 
- **2.1.0** - improved animations for not fully loaded images, improved zoom positioning, added mouse scroll zoom, added scrolling down bottom area, added zoom out closing, added next and zoom buttons, added loading spinner, added images counter, fixed prevention of non-plugin's hotkeys.
- **2.0.0** - fixed multiple plugin instances context, added double-tap zoom, optimized touch event handlers, styles moved to CSS file, license changed to MIT.
- **1.3.1** - fixed image caching, added `unbind` method.

## MIT License

Copyright (c) 2014-2016 Maksim Krylosov <aequiternus@gmail.com>
