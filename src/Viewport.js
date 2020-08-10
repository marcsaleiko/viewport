/*!
 * Viewport v0.2.0
 * Track viewport changes and react to them via callbacks
 * MIT License
 */
window.Viewport = (function () {
  var app = {};
  var _init = false;
  var active = false;
  var settings = {
    /**
     * Callback will be triggered every time the viewport changes.
     * Keep in mind, that it will only fire if you track resize events
     * by calling the track() method or call getCurrentViewport() and
     * the current viewport differs from the last viewport.
     * @param activeViewport The currently active viewport object
     * @param lastViewport The previously active viewport object
     * @param width The current viewport width
     * @param height The current viewport height
     * @param onInit Whether the callback was triggered on app initialisation. Will
     * only be true if fireOnChangeOnInit is true
     */
    onChange: function (activeViewport, lastViewport, width, height, onInit) {},
    // Determines whether the onChange callback will
    // also be triggered after the initialisation process
    fireOnChangeOnInit: false,
    // An array on viewport objects. May contain any data that suits your
    // needs, but must have a 'name' string property and a 'minWidth' number property
    // You may use the name as an identifier in the callback or via the matches() method.
    // We need the 'minWidth' property to determine which viewport is the active viewport.
    // We expect the viewports to be sorted from 0 to n minWidth values so we can easily
    // walk through them in reversed order without the need to sort them.
    // The default viewports set is the Bootstrap 4 media query set.
    viewports: [
      {
        name: "xs",
        minWidth: 0,
      },
      {
        name: "sm",
        minWidth: 576,
      },
      {
        name: "md",
        minWidth: 768,
      },
      {
        name: "lg",
        minWidth: 992,
      },
      {
        name: "xl",
        minWidth: 1200,
      },
    ],
  };
  var lastViewport = false;
  var activeViewport = false;
  var width = 0;
  var height = 0;

  app.init = function (options) {
    if (_init) {
      return;
    }
    _init = true;
    // extend settings by options
    settings = Object.assign(settings, options);

    active = true;

    updateViewport();
    if (settings.fireOnChangeOnInit === true) {
      if (typeof settings.onChange === "function") {
        settings.onChange(activeViewport, lastViewport, width, height, true);
      }
    }
  };

  /**
   * Checks whether the given viewport identifier matches
   * the currently active viewport.
   * @param identifier May be the minWidth number or the string name
   * of the viewport.
   * @returns {boolean}
   */
  app.matches = function (identifier) {
    if (!active) {
      return false;
    }
    var viewportToCompare = getViewportByIdentifier(identifier);
    return (
      viewportToCompare !== null &&
      activeViewport.name === viewportToCompare.name
    );
  };

  /**
   * Registers a resize event listener that checks the viewport
   * dimensions on each resize. It triggers the onChange callback every time
   * the viewport changes.
   */
  app.track = function () {
    if (!active) {
      return;
    }
    window.addEventListener("resize", debounce(updateViewport, 50));
  };

  /**
   * Retrieve the currently active viewport object. 
   * Thsi also updates the viewport and may fire the onChange
   * callback. See settings for further information.
   * @returns {{}}
   */
  app.getCurrentViewport = function() {
    if (!active) {
      return;
    }
    updateViewport();
    return activeViewport;
  };

  /**
   * Get the current viewport width. Returns 0
   * if app is not active.
   * @returns {number}
   */
  app.getWidth = function() {
    return width;
  }

  /**
   * Get the current viewport height. Returns 0
   * if app is not active.
   * @returns {number}
   */
  app.getHeight = function() {
    return height;
  }

  /**
   * Does the actual logic, retrieves viewport dimensions, applies
   * values and evaluates the active viewport and calls
   * the callback if we have a viewport change
   */
  var updateViewport = function () {
    var dimensions = getCurrentViewportDimensions();
    width = dimensions[0];
    height = dimensions[1];
    lastViewport = activeViewport;
    // find active viewport
    for (var i = settings.viewports.length - 1; i >= 0; i--) {
      if (width >= settings.viewports[i].minWidth) {
        activeViewport = settings.viewports[i];
        break;
      }
    }
    if (
      lastViewport !== false &&
      activeViewport !== false &&
      lastViewport.name !== activeViewport.name
    ) {
      if (typeof settings.onChange === "function") {
        settings.onChange(activeViewport, lastViewport, width, height, false);
      }
    }
  };

  /**
   * Returns the viewport that matches the identifier. Otherwise null.
   * The identifier may be the min number as number or the name as string.
   * @param identifier
   * @returns {null|{}}
   */
  var getViewportByIdentifier = function (identifier) {
    if (typeof identifier === "undefined") {
      return null;
    }
    for (var i = settings.viewports.length - 1; i >= 0; i--) {
      if (typeof identifier === "number") {
        if (settings.viewports[i].minWidth === identifier) {
          return settings.viewports[i];
        }
      } else {
        if (settings.viewports[i].name === identifier) {
          return settings.viewports[i];
        }
      }
    }
  };

  /**
   * Get the current width and height of the viewport
   * @returns {[number, number]}
   */
  var getCurrentViewportDimensions = function () {
    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != "undefined") {
      (viewPortWidth = window.innerWidth),
        (viewPortHeight = window.innerHeight);
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (
      typeof document.documentElement != "undefined" &&
      typeof document.documentElement.clientWidth != "undefined" &&
      document.documentElement.clientWidth != 0
    ) {
      (viewPortWidth = document.documentElement.clientWidth),
        (viewPortHeight = document.documentElement.clientHeight);
    }

    // older versions of IE
    else {
      (viewPortWidth = document.getElementsByTagName("body")[0].clientWidth),
        (viewPortHeight = document.getElementsByTagName("body")[0]
          .clientHeight);
    }
    return [viewPortWidth, viewPortHeight];
  };

  /**
   * Ensures that a given function will only be called once in the given
   * period of time. Delays the function call by wait.
   * @param func
   * @param wait
   * @param immediate
   * @returns {function(...[*]=)}
   */
  var debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  return app;
})();
