# ⛰ `steady-viewport`

The `steady-viewport` JavaScript utility is a tiny, dead simple script with no dependencies which introduces two CSS variables that can be used instead of the CSS `vh` and `vw` units to size elements based on the viewport.

It was born from the frustrating handling of the `vw` and `vh` units in mobile browsers with URL nagivation bars that toggle in response to user scrolling and in desktop browsers on platforms that cause scrollbars to take up space on the page.

## Installation

For now, this utility is not on `npm`, but it's still easy to install using the following command:

```
npm install https://github.com/AaronBeaudoin/steady-viewport.git
```

Then, include it in your HTML at the very top of the head so it runs first:

```html
<script src="/path/to/script"></script>
```

For example, in Vite you can add the following:

```html
<script src="/node_modules/steady-viewport"></script>
```

Note that `type="module"` is intentionally left out, because this would defeat the purpose of putting the script at the top of the `<head>`. Since major layout element may depend on these variables, the script needs to run as soon as possible to avoid layout shift as the page is loading.


## CSS Variables Added

Only two simple CSS variables are added and updated by this utility:

- `--vw`: The viewport width, **not** including the vertical scrollbar if present.
- `--vh`: The viewport height, **not** including the horizontal scrollbar if present, and not affected by insignificant changes to the viewport height—such as the URL navigation bar toggling in a mobile browser.

That's it. Note that `--vw` is the same as `100vw`, not `1vw`. The same goes for `--vh`.

## Why not just use `vh` and `vw`?

When you try to layout things in CSS based on the size of the viewport, there are a few issues you'll commonly run into from my experience:

- Relying on the `vh` unit to size elements that should be the height of the page is not a viable solution for mobile browsers. This is because in some mobile browsers the `vh` unit changes whenever the URL navigation bar is hidden or shown. This causes elements with dimensions relying on the `vh` unit to change size whenever the URL navigation bar "toggles", which can make the entire page jump around and negatively impact the user experience. (In some other mobile browsers the `vh` unit simply always takes up the space behind the URL navigation bar, which is also not ideal because content ends up hidden.)

- Relying on the `vw` and `vh` units to size elements that should be the width or height of the page is not a viable solution for browsers where the scrollbar takes up space on the page (it is not overlaid). This is because the `vw` and `vh` units includes the vertical and horizontal scrollbars respectively. This causes elements with dimensions relying on the `vw` or `vh` units to potentially either introduce unwanted (most likely horizontal) scrolling or be a bit too tall, both of which negatively impact the user experience.

The fact that these two issues even exist really makes the `vh` and `vw` units feel half-baked. In reality, we can blame varying browser implementations or the emergence of new types of devices for these issues, but either way they're probably not going to change. Since sizing elements based on the viewport is still a really useful feature regardless, this utility is helpful because it solves both of these issues without negatively impacting any use cases as far as I know.

## Caveat to `vh` Change Detection

The reason why there is even a possibility that this utility **might** negatively impact use cases I haven't thought of is because of the rather simplistic way that it tries to detect viewport height changes caused by a toggling mobile browser URL navigation bar.

The way that this utility prevents the URL navigation bar from updating the `--vh` CSS variable is by naively not changing the variable if a window resize event occurs at least half a second away from the last window resize event **and** doesn't change the orientation of the viewport **and** only changes the area of the viewport by less than a third.

To recap, the following three conditions must all be met:

- A window resize event has not occured in the last half a second.
- The orientation of the window viewport has not changed.
- The area of the window viewport has only changed by less than a third.

As previously indicated, I haven't been able to think of a scenario where this would be a problem, but it's good to be aware of. From my testing, these conditions are enough to prevent the viewport height from updating in response to small changes like toggling the URL navigation bar; but also narrow enough to _not_ block updating in response to changing a device's orientation, dragging the corner of a window with a cursor, or other changes which change the dimensions of the viewport more significantly.

It is therefore being assumed that any smaller changes which do not cause this utility to update the `--vh` CSS variable are—like the URL navigation bar—insignficant enough to be not worth responding to. If you find an exception to this, please let me know!

### Author Information

_`steady-viewport` was created by Aaron Beaudoin for [ARYSE®](https://aryse.com)._
