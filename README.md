# DestinAsian Toolbar

A lightweight vanilla JavaScript toolbar component for LabradorCMS articles/pages.

This repository provides a reusable **CTA + Share** button script for DestinAsian. It allows article editors to add a call-to-action button with a fixed share button beside it.

The CTA label and CTA URL are configured from HTML `data-*` attributes. The share button always shares the current page URL, not the CTA URL.

## Features

- Vanilla JavaScript only
- No React, Vue, jQuery, or external libraries
- Designed for LabradorCMS Custom Tags
- Main CTA button opens in a new tab
- Secure external link attributes: `target="_blank"` and `rel="noopener noreferrer"`
- Native sharing with the browser Web Share API
- Clipboard fallback when native sharing is unavailable
- CSS is injected automatically by the JavaScript file
- Clean lowercase CSS class names using underscores

## File Structure

```txt
destinasian-toolbar/
└── da-toolbar-button.js
```

## JavaScript File

The main script file is:

```txt
da-toolbar-button.js
```

Recommended public URL example:

```txt
https://destinasian.com/destinasian-toolbar/da-toolbar-button.js
```

If the file is hosted from a different domain or subdomain, update the LabradorCMS custom tag `src` attribute accordingly.

## Server Installation

Create the root folder:

```bash
sudo mkdir -p /var/www/html/destinasian-toolbar
```

Create the JavaScript file:

```bash
sudo nano /var/www/html/destinasian-toolbar/da-toolbar-button.js
```

After saving the file, test that it is publicly reachable:

```bash
curl -I https://destinasian.com/destinasian-toolbar/da-toolbar-button.js
```

Expected result:

```txt
HTTP/2 200
```

or:

```txt
HTTP/1.1 200 OK
```

## LabradorCMS Custom Tag Setup

In LabradorCMS, go to:

```txt
Settings → Custom tags
```

Create a new custom tag with the following settings:

```txt
Description:
DA Toolbar Button JS

Tag:
Script (JS-file)

Placement:
Head - bottom

Page type:
All page-types
```

Leave the `Value` field empty.

Add the following attributes:

```txt
Key:
src

Value:
https://destinasian.com/destinasian-toolbar/da-toolbar-button.js
```

Optional but recommended:

```txt
Key:
defer

Value:
defer
```

Do not enable:

```txt
Hide on front
```

If you want the component to work in LabradorCMS editor preview, also do not enable:

```txt
Hide in editor
```

## Article HTML Usage

Add this HTML inside the LabradorCMS article/page where the button should appear:

```html
<div
  class="da_toolbar_button"
  data-button-label="Find out more"
  data-button-url="https://www.oceaniacruises.com?DestinAsian"
></div>
```

## Editable Values

Editors can change only these values:

```html
data-button-label="Find out more"
data-button-url="https://www.oceaniacruises.com?DestinAsian"
```

Example:

```html
<div
  class="da_toolbar_button"
  data-button-label="Book now"
  data-button-url="https://example.com"
></div>
```

## Fixed Share Behavior

The share button is not editor-configurable.

It always shares the current page URL:

```js
window.location.href
```

It does not share the CTA URL from `data-button-url`.

The share payload uses:

```js
{
  title: document.title,
  url: window.location.href
}
```

## CSS Classes

The component uses lowercase class names with underscores:

```txt
.da_toolbar_button
.da_toolbar_button_wrapper
.da_toolbar_button_cta
.da_toolbar_button_share
.da_toolbar_button_is_visible
```

## Final Rendered HTML

After the JavaScript runs, the component renders approximately like this:

```html
<div
  class="da_toolbar_button"
  data-button-label="Find out more"
  data-button-url="https://www.oceaniacruises.com?DestinAsian"
  data-initialized="true"
>
  <div class="da_toolbar_button_wrapper da_toolbar_button_is_visible">
    <div class="da_toolbar_button_cta">
      <a
        href="https://www.oceaniacruises.com/?DestinAsian"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find out more
      </a>
    </div>

    <button
      type="button"
      class="da_toolbar_button_share"
      aria-label="Share this page"
    >
      <!-- Share icon -->
    </button>
  </div>
</div>
```

## Browser Support

The script uses the browser's native `navigator.share` API when available.

If native sharing is not available, the script falls back to:

1. Copying the current page URL using `navigator.clipboard.writeText`
2. Showing a manual copy prompt if clipboard access is unavailable

## Notes

- The script should be loaded through HTTPS.
- The CTA opens in a new tab.
- The share button shares the current article/page URL.
- The component can be used multiple times on the same page.
- No element IDs are used, so duplicate ID conflicts are avoided.
- CSS is injected once per page using the internal style element ID `da_toolbar_button_style`.

## License

Private/internal DestinAsian project.
