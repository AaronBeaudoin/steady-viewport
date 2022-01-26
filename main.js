let lastHandlerTimestamp = null;
let lastWindowViewportPortrait = null;
let lastWindowViewportArea = null;
let lastViewportWidth = null;
let lastViewportHeight = null;

let eventHandler = _ => {
  let root = document.querySelector(":root");
  let windowViewportPortrait = window.innerWidth < window.innerHeight;
  let windowViewportArea = window.innerWidth * window.innerHeight;

  console.log(
    Math.abs(windowViewportArea - lastWindowViewportArea),
    (lastWindowViewportArea / 3),
    Math.abs(windowViewportArea - lastWindowViewportArea) > (lastWindowViewportArea / 3)
  );

  // We avoid updating the viewport height in circumstances where it is likely due to a toggling URL bar.
  // For the viewport height to not be updated, the following 3 conditions must be met:
  let shouldUpdateViewportHeight = !(

    // The handler hasn't been called in the last half second.
    // (If it has, then the user is probably dragging the corner of the window to resize it.)
    (new Date() - lastHandlerTimestamp) > 500 &&
    
    // The orientation of the viewport hasn't changed.
    // (An orientation change is always significant enough to justify updating the viewport height.)
    windowViewportPortrait === lastWindowViewportPortrait &&
  
    // The area of the viewport has changed by less than 1/3 of it's last area.
    // (No URL navigation bar I know of takes up enough of the screen to cause a change larger than this).
    Math.abs(windowViewportArea - lastWindowViewportArea) < (lastWindowViewportArea / 3)
  );
    
  if (root.clientWidth !== lastViewportWidth) {
    // `root.clientWidth` is the viewport width without the vertical scrollbar.
    root.style.setProperty("--vw", `${root.clientWidth}px`);
    lastViewportWidth = root.clientWidth;
  }
  
  if (root.clientHeight !== lastViewportHeight && shouldUpdateViewportHeight) {
    // `root.clientHeight` is the viewport height without the horizontal scrollbar.
    root.style.setProperty("--vh", `${root.clientHeight}px`);
    lastViewportHeight = root.clientHeight;
    lastWindowViewportPortrait = windowViewportPortrait;
    lastWindowViewportArea = windowViewportArea;
  }

  // Always update the timestamp of the last time this handler was called.
  lastHandlerTimestamp = new Date();
};

eventHandler();
window.addEventListener("load", eventHandler);
window.addEventListener("resize", eventHandler);
