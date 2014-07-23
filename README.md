# ABigImage

`ABigImage` is jQuery plugin for viewing big versions of images.

## Features

- Fit mobile devices.
- Uses CSS3 transform and transition for smooth touch sliding.
- Touch slide left or right opens next or previous image, touch slide up or down closes image.
- Clicking image opens next one, clicking left side opens previous, clicking right side closes image.
- Hotkeys for next, previous and close buttons.
- Closing after viewing of all images.
- Preloading of next and previous images.
- Multi-touch zoom.
- Uses link's `href` or `data-href` attribute for large images.
- Fully customizable styles.
- Customizable bottom area.
- Customizable `onopen` event.

## Usage

### Basic

Add jQuery and ABigImage scripts in head of page.

    <script src="jquery.js"></script>
    <script src="abigimage.jquery.js"></script>

Call plugin on selector of enlargeable images links.

    $(function() {
        /* all links with class "myimgclass" */
        $('.myimgclass').abigimage();

        /* or all links to "*.jpg" images */
        $('a[href$=".jpg"]').abigimage();

        /* or all links to images under dir "/my/images/dir/" */
        $('a[href^="/my/images/dir/"]').abigimage();
    });

### Options

- `fadeIn` - fade in duration or [options](http://api.jquery.com/fadein/) (default: `fast`).
- `fadeOut` - fade out duration or [options](http://api.jquery.com/fadeout/) (default: `fast`).
- `slideWidth` - slide width to switch or close image (between 0 and 1, default: 0.4).
- `slideVelocity` - slide velocity to switch or close image (pixels per millisecond, default: 0.4).
- `zoomMin` - minimal zoom that will hold (default: 1.5).
- `zoomMax` - maximal zoom (default: 5).
- `prevBtnHtml` - html of "previous" button (default: `&larr;`).
- `closeBtnHtml` - html of "close" button (default: `x`).
- `keyNext` - hotkeys for "next" button (default: 13 enter, 32 space, 39 right, 40 down).
- `keyPrev` - hotkeys for "previous" button (default: 8 backspace, 37 left, 38 up).
- `keyNext` - hotkeys for "close" button (default: 27 escape, 35 end, 36 home).
- `onopen` - function called when image opens.
- `*Attrs` - plugin elements attributes.
- `*CSS` - plugin elements CSS.
- `prevBtnHoverCSS` - "previous" button on hover CSS.
- `closeBtnHoverCSS` - "close" button on hover CSS.
- `bottomHoverCSS` - bottom area on hover CSS.

Plugin generates next html code:

    <!-- overlay -->
    <div></div>
    <!-- layout -->
    <div>
        <!-- box -->
        <div>
            <!-- prevBtnWrapper (clickable behind the image, width 50%) -->
            <div>
                <!-- prevBtnBox (clickable above the image, button width) -->
                <div>
                    <!-- prevBtn -->
                    <div><!-- prevBtnHtml --></div>
                </div>
            </div>
            <!-- closeBtnWrapper (clickable behind the image, width 50%) -->
            <div>
                <!-- closeBtnBox (clickable above the image, button width) -->
                <div>
                    <!-- closeBtn -->
                    <div><!-- closeBtnHtml --></div>
                </div>
            </div>
            <!-- img -->
            <img>
            <!-- imgNext -->
            <img>
            <!-- imgPrev -->
            <img>
        </div>
        <!-- bottom -->
        <div></div>
    </div>

### Using onopen handler

Function, defined as `onopen` handler, executes in context of plugin, and receives target element as argument. Plugin elements available in this context as properties.

    $(function() {
        $('a[href$=".jpg"]').abigimage({
            bottomCSS: {
                fontSize: '2em',
                textAlign: 'center'
            },
            onopen: function (target) {
                this.bottom.html(
                    $('img', target).attr('alt')
                );
            }
        });
    });

### Using custom links with data-href attribute

If you want different link for plugin's big image and for non-javascript clients (search engines or browsers without javascript) - use `data-href` attribute:

    <a href="/non_javascript_link.html" data-href="/images/big/myimage.jpg"> ... </a>

Also, you can use `data-href` attribute on any element, not only links.

### Static methods

    /* open image by URL */
    $.abigimage.open('/some_image.jpg');

    /* open image by index in current list */
    $.abigimage.open(5);

    /* open image by URL at specified position in current list */
    $.abigimage.open('/some_image.jpg', 5);

    /* open next image */
    $.abigimage.next();

    /* open previous image */
    $.abigimage.prev();

    /* close image */
    $.abigimage.close();


## License

Copyright © 2014 Maksim Krylosov <Aequiternus@gmail.com>

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
