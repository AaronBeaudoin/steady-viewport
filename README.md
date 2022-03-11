# ⛰ `steady-viewport`

`steady-viewport` is a tiny, dead simple JavaScript utility script with no dependencies which introduces CSS variables that can be used instead of the CSS `vh` and `vw` units to size elements based on the viewport. It also optionally adds super useful CSS variables to help size element which should take up the height of the viewport minus some top or bottom elements (navigation bar and/or banner elements).

## Why use `steady-viewport`?

- The idea behind the CSS `vw` and `vh` units is extremely useful, but in real world practice sizing elements based on these units is plagued by a bunch of problems. In mobile browsers with address bars that toggle in response to user scrolling, content in elements sized with a height of `100vh` can end up partially hidden behind the browser UI, and in some versions the `vh` unit can even change depending on the visibility of the address bar, causing jarring layout shift.

- In desktop browsers on platforms that cause scrollbars to take up space on the page, elements sized with a width of `100vw` or a height of `100vh` can potentially cause unwanted scrollbars to appear, because `100vw` includes the width of the vertical scrollbar and `100vh` includes the height of the horizontal scrollbar. For many use cases you really want the viewport dimensions _excluding_ the document scrollbars.

- Sizing elements based on the height of the viewport minus the height of some other arbitrary "top" or "bottom" elements is typically a real pain unless you just hardcode the height of those "top" or "bottom" elements into your CSS with something like `calc(100vh - <height-of-elements>)`.

## Features

- Adds two CSS variables `--vw` and `--vh` which you can use as a simple replacement for `100vw` and `100vh`, avoiding the mobile address bar and desktop scrollbar issues described above. 🔥

- Optionally adds three more CSS variables `--ph` (page height), `--th` (top height), and `--bh` (bottom height), which you can use to easily size elements based on the height of the viewport minus some other arbitrary "top" or "bottom" elements. 📐

- All CSS variables are kept up-to-date when the browser viewport or any tracked elements are resized. ⚡️

## Installation

For now, this utility is not on `npm`, but it's still easy to install using the following command:

```
npm install https://github.com/AaronBeaudoin/steady-viewport.git#v0.1.1
```

Then, include it in your HTML (only on the client side, if applicable) **at the very top of the `<body>`** so it runs before the `<body>` is parsed:

```html
<script src="/path/to/script"></script>
```

Note that `type="module"` is intentionally left out, because this would defeat the purpose of putting the script in any particular location since such modules are deferred. Finally, add the following right below the script you just included to enable the features you want:

```html
<script>steady(["<feature-name>", ...]);</script>
```

Currently, the only two features you can enable are `viewport` and `layout`. By initializing `steady-viewport` this way, you can chooose to remove `layout` from the list if you do not intend to use the layout CSS variables, and they will not be created.

Also, note that the layout features of `steady-viewport` depend on `ResizeObserver`, which is only supported in all major browsers as of Q1 2020.


## Usage (Viewport CSS Variables)

Two simple CSS variables are added and updated by this utility when the `viewport` feature is enabled:

- `--vw`: The viewport width, not including the vertical scrollbar if present.
- `--vh`: The viewport height, not including the horizontal scrollbar if present, and not affected by insignificant changes to the viewport height—such as the mobile address bar toggling. See the "caveat" section below for how this is implemented.

Simply use them anywhere you would use `100vw` or `100vh`.


## Usage (Layout CSS Variables)

Three more simple CSS variables are added and updated by this utility when the `layout` feature is enabled:

- `--ph`: The "page" height, which is `--vh` minus the height of any elements in the document with the attribute and value `data-steady="sticky"`.
- `--th`: The "top" height, which is `--vh` minus the height of any elements in the document with the attribute and value `data-steady="sticky"` or `data-steady="top"`.
- `--bh`: The "bottom" height, which is `--vh` minus the height of any elements in the document with the attribute and value `data-steady="sticky"` or `data-steady="bottom"`.

In order for these variables to be created, updated, and work as intended:

- The `data-steady` attribute must be added to a least one element.
- All elements with the `data-steady` attribute must be direct children of `<body>`.

Add `data-steady="sticky"` to any elements which will always "stick" to the **top** or **bottom** of the viewport. Such elements are most likely positioned simply with the CSS `position` property and value `sticky` or `fixed`, but you are free to stick your elements to the top of the viewport however you want.

Add `data-steady="top"` to any other elements (which you haven't already added `data-steady="sticky"` to) which take up space and appear **above** your page content at the **top** of the document.

Add `data-steady="bottom"` to any other elements (which you haven't already added `data-steady="sticky"` to) which take up space and appear **below** your page content at the **bottom** of the document.

Finally, use `--ph` to size elements which you would like to take up the height of the viewport **minus** the height of your "sticky" elements; use `--th` to size elements which you would like to take up the height of the viewport **minus** the height of your "sticky" elements and your "top" elements; and use `--bh` to size elements which you would like to take up the height of the viewport **minus** the height of your "sticky" elements and your "bottom" elements.

For a full example of this in action check out a [live example](https://aaronbeaudoin.github.io/steady-viewport) of the `index.html` file in this repository.


## Why not just use `vh` and `vw`? (Detailed Explanation)

When you try to layout things in CSS based on the size of the viewport, there are a few issues you'll commonly run into from my experience:

- Relying on the `vh` unit to size elements that should be the height of the page is not a viable solution for mobile browsers. This is because in some mobile browsers the `vh` unit changes whenever the address bar is hidden or shown. This causes elements with dimensions relying on the `vh` unit to change size whenever the address bar "toggles", which can make the entire page jump around and negatively impact the user experience. (In some other mobile browsers the `vh` unit simply always takes up the space behind the address bar, which is also not ideal because content ends up hidden.)

- Relying on the `vw` and `vh` units to size elements that should be the width or height of the page is not a viable solution for browsers where the scrollbar takes up space on the page (it is not overlaid). This is because the `vw` and `vh` units includes the vertical and horizontal scrollbars respectively. This causes elements with dimensions relying on the `vw` or `vh` units to potentially either introduce unwanted (most likely horizontal) scrolling or be a bit too tall, both of which negatively impact the user experience.

The fact that these two issues even exist really makes the `vh` and `vw` units feel half-baked. In reality, we can blame varying browser implementations or the emergence of new types of devices for these issues, but either way they're probably not going to change. Since sizing elements based on the viewport is still a really useful feature regardless, this utility is helpful because it solves both of these issues without negatively impacting any use cases as far as I know.


## Caveat to Mobile Address Bar Toggle Detection

The reason why there is even a possibility that this utility **might** negatively impact use cases I haven't thought of is because of the rather simplistic way that it tries to detect viewport height changes caused by a toggling mobile address bar.

The way that this utility prevents the mobile address bar from updating the `--vh` CSS variable is by naively not changing the variable if a window resize event occurs at least half a second away from the last window resize event **and** is only changing the height **and** doesn't change the orientation of the viewport **and** only changes the area of the viewport by less than a third.

To recap, the following conditions must all be met:

1. A window resize event has not occured in the last half a second.
2. The width of the viewport is not changing, only the height is.
3. The orientation of the window viewport has not changed.
4. The area of the window viewport has only changed by less than a third.

As previously indicated, this naive method of detecting the mobile address bar toggling does not cause any negative side effects as far as I know, but it's good to be aware of. From my testing, these conditions are enough to prevent the viewport height from updating in response to small changes like toggling the mobile address bar; but also narrow enough to _not_ block updating in response to changing a device's orientation, dragging the corner of a window with a cursor, or other changes to the dimensions of the viewport.

It is therefore being assumed that any smaller changes which do not cause this utility to update the `--vh` CSS variable are—like the mobile address bar—insignficant enough to be not worth responding to. If you find an exception to this, please let me know by leaving an issue!


### Author Information

_`steady-viewport` was created by Aaron Beaudoin for [ARYSE®](https://aryse.com)._
