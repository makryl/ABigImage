# ABigImage

`ABigImage` is jQuery plugin for viewing big versions of images.

## Features

- Fit mobile devices.
- Uses link's `href` attribute for large images.
- Clicking image opens next one, clicking left side opens previous, clicking right side closes image.
- Hotkeys for next, previous and close buttons.
- Closing after viewing of all images.
- Preloading of next and previous images.
- Fully customizable styles.
- Customizable top and bottom areas.
- Customizable `onopen` event.

## Usage

### Basic

Add jQuery and ABigImage scripts in head of page.

    <script src="jquery.js"></script>
    <script src="abigimage.jquery.js"></script>

Call plugin on selector of enlargeable images links.

    <script>
        $(function() {
            $('a[href$=".jpg"]').abigimage();
        });
    </script>

### Options

- `fadeIn` - fade in duration or [options](http://api.jquery.com/fadein/).
- `fadeOut` - fade out duration or [options](http://api.jquery.com/fadeout/).
- `prevBtnHtml` - html of "previous" button.
- `closeBtnHtml` - html of "close" button.
- `keyNext` - hotkeys for "next" button (by default: 13 enter, 32 space, 39 right, 40 down).
- `keyPrev` - hotkeys for "previous" button (by default: 8 backspace, 37 left, 38 up).
- `keyNext` - hotkeys for "close" button (by default: 27 escape, 35 end, 36 home).
- `onopen` - function called when image opens.
- `*Attrs` - plugin elements attributes.
- `*CSS` - plugin elements CSS.

Plugin generates next html code:

    <!-- overlay -->
    <div></div>
    <!-- layout -->
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
        <!-- bottom -->
        <div></div>
    </div>

### Using onopen handler

Function, defined as `onopen` handler, executes in context of plugin, and receives target element as argument. Plugin elements available in this context as properties.

    <script>
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
    </script>

## License

Copyright © 2014 Maksim Krylosov <Aequiternus@gmail.com>

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
