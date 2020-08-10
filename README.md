# Viewport
Track viewport changes and react to them via callbacks

## Installation

Install via npm `npm install @marcsaleiko/viewport --save`. There are no dependencies, just plain vanilla javascript.

## Usage
Include file in your script file and run `Viewport.init();`. You may use the options below to 
override the base settings.

The `init()` method evaluates the currently active viewport and marks the script as active. From
now on you may use all other methods to interact with the specified viewports.

The `track()` method enables you to use the `onChange` callback that you may override 
via the settings you pass into `init({})`. From now on the script tracks resizes and 
notifies you via the callback if the viewport changes. See the options below 
for further details.

The `matches( identifier )` method checks whether the given identifier matches the active 
viewport. The identifier may be the minWidth number or the string name of the viewport.

The `getCurrentViewport()` method returns the currently active viewport object.

Use `getWidth()` and `getHeight()` to access the current viewport width and height.

It uses the Botstrap 4 media queries as viewport presets. You may override them via the 
settings you pass to the `init({})` method.

### Options

You may provide additional options and overrides via an object passed to the `init({})` 
method. Here is a list of all available options and their default values:

```javascript
Viewport.init({
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
});
```