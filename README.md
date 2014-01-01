# ABigImage

`ABigImage` is jQuery plugin for viewing big versions of images.

## Features

- Uses link's `href` attribute for large images.
- Clicking image opens next one, clicking left side opens previous, clicking right side closes image.
- Closing after viewing of all images.
- Preloading of next and previous images.
- Fully customizable styles.
- Customizable top and bottom areas.
- Customizable `onopen` event.

## Usage

### Basic

Add jQuery and ABigImage scripts in head of page.

```html
<script src="jquery.js"></script>
<script src="abigimage.jquery.js"></script>
```

Call plugin on selector of enlargeable images links.

```html
<script>
    $(function() {
        $('a[href$=".jpg"]').abigimage();
    });
</script>
```

### Options

- `fadeIn` - fade in duration or [options](http://api.jquery.com/fadein/).
- `fadeOut` - fade out duration or [options](http://api.jquery.com/fadeout/).
- `prevBtnHtml` - html of "previous" button.
- `closeBtnHtml` - html of "close" button.
- `onopen` - function called when image opens.
- `*Attrs` - plugin elements attributes.
- `*CSS` - plugin elements CSS.

Plugin generates next html code:

```html
<!-- overlay -->
<div></div>
<!-- layout -->
<div>
    <!-- wrapper -->
    <div>
        <!-- box -->
        <div>
            <!-- prevBtn -->
            <div><!-- prevBtnHtml --></div>
            <!-- body -->
            <div>
                <!-- top -->
                <div></div>
                <!-- img -->
                <img>
                <!-- imgNext -->
                <img>
                <!-- imgPrev -->
                <img>
                <!-- bottom -->
                <div></div>
            </div>
            <!-- closeBtn -->
            <div><!-- closeBtnHtml --></div>
        </div>
    </div>
</div>
```

### Using onopen handler

Function, defined as `onopen` handler, executes in context of plugin, and receives target element as argument. Plugin elements available in this context as properties.

```js
<script>
    $(function() {
        $('a[href$=".jpg"]').abigimage({
            bottomCSS: {
                fontSize: '2em',
                textAlign: 'center'
            },
            onopen: function (target) {
                this.bottom.html(
                    $(target).attr('title')
                );
            }
        });
    });
</script>
```

## License

Copyright © 2014 Krylosov Maksim <Aequiternus@gmail.com>

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
