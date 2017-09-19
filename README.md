# jquery.themeselect [![Build Status](https://travis-ci.org/mwri/jquery.themeselect.svg?branch=master)](https://travis-ci.org/mwri/jquery.themeselect)

jQuery theme selection plugin, lets you set up a series of themes, each
with one or more CSS files, which are loaded and unloaded when each
theme is selected.

It also allows sub themes to automatically be selected based on best
colour match using [ThemeMatch](https://github.com/mwri/themematch).

Simple, and more complex usages, are shown below. Both of these are
illustrated working in the demo folder.

## Synopsis

The simplest usage is like this:

```js
$('select.themeselect').themeselect({
    selected: 'light',
    themes: [
        { name: 'dark',   css: 'simple_dark.css' },
        { name: 'light',  css: 'simple_light.css' },
        { name: 'sunset', css: [ 'simple_sunset.css' ] },
        { name: 'ocean',  css: [
            'content/content_watery.css',
            'sidebar/sidebar_ocean.css',
            'topbar/topbar_ocean.css',
            'theme_ctrlr/ts_green.css',
            ]},
    ],
});
```

What this does is turn the `<select>` element into a `jquery.themeselect`
jQuery plugin, which, when it changes, causes the CSS files to be loaded
and unloaded. The `selected: 'light'` parameter causes 'light' to be
loaded initially.

Selecting 'sunset' causes 'simple_light.css' to be unloaded and
'simple_sunset.css' to be loaded instead, and then selecting 'ocean'
causes 'simple_sunset.css' to be unloaded and 'content/content_watery.css',
'sidebar/sidebar_ocean.css', 'topbar/topbar_ocean.css' and
'theme_ctrlr/ts_green.css' to be loaded.

If (for some odd reason) you have multiple theme selection elements then
they need to be kept in sync, one way of doing this is omitting the
`selected: 'light'` parameter and adding this:

```
$('select.themeselect')
    .on('theme_selection', (jqevent, name) => {
        $('select.themeselect')
            .themeselect('select', name, {no_update:true})
            .themeselect('redraw');
    })
    .first().themeselect('select', 'light');
```

## Advanced usage

It is possible to specify sets of sub themes available for some
sub feature that are selected based on colour matching, see
[ThemeMatch](https://github.com/mwri/themematch) for more explanation
but here is an example:

```
$('select.themeselect').themeselect({
    themes: [
        { name: 'dark',   backgrounds: [ '#000000' ], foregrounds: [ '#ffffff' ] },
        { name: 'light',  backgrounds: [ '#ffffff' ], foregrounds: [ '#000000' ] },
        { name: 'sunset', backgrounds: [ '#bbbb77' ], foregrounds: [ '#990000' ] },
        { name: 'ocean',  backgrounds: [ '#aaffdd' ], foregrounds: [ '#006600' ] },
    ],
    subs: [
        { name: 'sidebar',
            themes: [
                { name: 'sidebar_normal',  css: 'sidebar/sidebar_normal.css',
                        backgrounds: [ '#dddddd' ], foregrounds: [ '#111111' ] },
                { name: 'sidebar_inverse', css: 'sidebar/sidebar_inverse.css',
                        backgrounds: [ '#222222' ], foregrounds: [ '#dddddd' ] },
                { name: 'sidebar_sunset',  css: 'sidebar/sidebar_sunset.css',
                        backgrounds: [ '#eedd88' ], foregrounds: [ '#cc0000' ] },
                { name: 'sidebar_ocean',   css: 'sidebar/sidebar_ocean.css',
                        backgrounds: [ '#aaffdd' ], foregrounds: [ '#006600' ] },
            ] },
        { name: 'topbar',
            themes: [
                { name: 'topbar_normal',  css: 'topbar/topbar_normal.css',
                        backgrounds: [ '#eeeeee' ], foregrounds: [ '#222222' ] },
                { name: 'topbar_inverse', css: 'topbar/topbar_inverse.css',
                        backgrounds: [ '#333333' ], foregrounds: [ '#eeeeee' ] },
                { name: 'topbar_sunset',  css: 'topbar/topbar_sunset.css',
                        backgrounds: [ '#bb8844' ], foregrounds: [ '#990000' ] },
                { name: 'topbar_ocean',   css: 'topbar/topbar_ocean.css',
                        backgrounds: [ '#99ddbb' ], foregrounds: [ '#227722' ] },
            ] },
        { name: 'content',
            themes: [
                { name: 'content_light',  css: 'content/content_light.css',
                        backgrounds: [ '#ffffff' ], foregrounds: [ '#000000' ] },
                { name: 'content_dark',   css: 'content/content_dark.css',
                        backgrounds: [ '#000000' ], foregrounds: [ '#ffffff' ] },
                { name: 'content_muddy',  css: 'content/content_muddy.css',
                        backgrounds: [ '#aa8833' ], foregrounds: [ '#662222' ] },
                { name: 'content_watery', css: 'content/content_watery.css',
                        backgrounds: [ '#aaccdd' ], foregrounds: [ '#005544' ] },
            ],
            subs: [
                { name: 'themeselect',
                    themes: [
                        { name: 'themeselect_red',   css: 'theme_ctrlr/ts_red.css',
                                backgrounds: [ '#807060' ], foregrounds: [ '#ff4444' ] },
                        { name: 'themeselect_green', css: 'theme_ctrlr/ts_green.css',
                                backgrounds: [ '#a0a0c0' ], foregrounds: [ '#117722' ] },
                    ] },
            ] },
    ],
})
.on('theme_selection', (jqevent, name) => {
    $('.themeselect')
        .themeselect('select', name, {no_update:true})
        .themeselect('redraw');
})
.first().themeselect('select', 'light');
```

In this case the root themes (dark, light, sunset and ocean), which have no CSS
files specified, are virtual, and when one of them is selected one theme for
each of the sub components (sidebar, topbar, content and themeselect) based on
best colour match. Colour matching is done based on the background and foreground
meta data above (see [ThemeMatch](https://github.com/mwri/themematch)).

## Dynamic theme sets

It is not necessary to initialise all the themes at once via parameters to the
constructor, if components are dynamically incorporated then they must be added
later. For example:

```
my ts = $('.themeselect');
ts.themeselect();

ts.themeselect('add_theme', {
    name:        'dark',
    backgrounds: [ '#000000' ],
    foregrounds: [ '#ffffff' ],
});
ts.themeselect('add_theme', {
    name:        'light',
    backgrounds: [ '#ffffff' ],
    foregrounds: [ '#000000' ],
});

ts.themeselect('add_sub, {
    name: 'sidebar',
    themes: [
        { name: 'sidebar_normal', css: 'sidebar/sidebar_normal.css',
                backgrounds: [ '#dddddd' ], foregrounds: [ '#111111' ] },
        { name: 'sidebar_inverse', css: 'sidebar/sidebar_inverse.css',
                backgrounds: [ '#222222' ], foregrounds: [ '#dddddd' ] },
        { name: 'sidebar_sunset', css: 'sidebar/sidebar_sunset.css',
                backgrounds: [ '#eedd88' ], foregrounds: [ '#cc0000' ] },
        { name: 'sidebar_ocean', css: 'sidebar/sidebar_ocean.css',
                backgrounds: [ '#aaffdd' ], foregrounds: [ '#006600' ] },
    ]
});

ts.themeselect('redraw');
```

## ES5, ES6 and minification

The `dist` folder has the following files available:

File | Description
:-- | :--
themematch.js | Limited ES6 features (works with Node.js v4+ and most browsers)
themematch_es5.js | ES5 translation (should work with anything)
themematch_es5.min.js | Minified ES5 translation

## Build

run `npm install` to install the dev/build dependencies, and
`grunt build` to build.

This will create ES5 `dist/themematch.js` and `dist/themematch.min.js`
files, and run the unit tests against them.
