function steady(features) {
  function steadyViewport() {
    
    let lastHandlerTimestamp = null;
    let lastWindowViewportPortrait = null;
    let lastWindowViewportArea = null;
    let lastViewportWidth = null;
    let lastViewportHeight = null;

    let eventHandler = _ => {
      let root = document.querySelector(":root");
      let windowViewportPortrait = window.innerWidth < window.innerHeight;
      let windowViewportArea = window.innerWidth * window.innerHeight;

      // We avoid updating the viewport height in circumstances where it is likely due to a toggling URL bar.
      // For the viewport height to not be updated, the following 3 conditions must be met:
      let shouldUpdateViewportHeight = !(

        // The handler hasn't been called in the last half second.
        // (If it has, then the user is probably dragging the corner of the window to resize it.)
        (new Date() - lastHandlerTimestamp) > 500 &&
        
        // The width of the viewport is not changing, only the height is.
        root.clientWidth === lastViewportWidth &&

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
  }

  function steadyLayout() {
    // `ResizeObserver` is required in order to detect updates to the layout.
    if (typeof window.ResizeObserver !== undefined) {

      let resizeObserver = null;
      let mutationObserver = null;
      let topElements = [];

      let resizeObserverHandler = resizes => {
        let topHeight = 0;
        let stickyHeight = 0;
        let bottomHeight = 0;

        topElements.forEach(element => {
          if (element.dataset.steady === "top") topHeight += element.offsetHeight;
          if (element.dataset.steady === "sticky") stickyHeight += element.offsetHeight;
          if (element.dataset.steady === "bottom") bottomHeight += element.offsetHeight;
        });

        let root = document.querySelector(":root");
        root.style.setProperty("--th", `calc(var(--vh) - ${stickyHeight}px - ${topHeight}px)`);
        root.style.setProperty("--ph", `calc(var(--vh) - ${stickyHeight}px)`);
        root.style.setProperty("--bh", `calc(var(--vh) - ${stickyHeight}px - ${bottomHeight}px)`);
      };

      let mutationHandler = mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (!node.dataset.steady) return;
          topElements.push(node);
        });
      };

      let mutationObserverHandler = mutations => {
        mutations.forEach(mutationHandler);
        topElements.forEach(_ => resizeObserver.observe(_));
      };

      resizeObserver = new ResizeObserver(resizeObserverHandler);
      mutationObserver = new MutationObserver(mutationObserverHandler);

      // Layout "steady" elements must be direct children of `body`.
      mutationObserver.observe(document.body, { childList: true });

    // If `ResizeObserver` is not supported, just use some naive sensible defaults.
    } else {

      let root = document.querySelector(":root");
      root.style.setProperty("--ph", `calc(var(--vh) * 0.85)`);
      root.style.setProperty("--th", `calc(var(--vh) * 0.65)`);
    }
  }

  if (features.includes("viewport")) steadyViewport();
  if (features.includes("layout")) steadyLayout();
}
