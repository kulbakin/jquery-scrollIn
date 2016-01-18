jquery-scrollIn
===============

jQuery equivalent of [Element.scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView).
Also registers `:scrollable` jQuery selector to detect elements which can be scrolled.

### Usage

```javascript
// scroll into view using default parameters
$(selector).scrollIn();

// scroll into view adjusting target element to the bottom of scrollable container
$(selector).scrollIn(false);
// or
$(selector).scrollIn({block: "end"});
```

### Options

| Option   | Accepted Values | Default | Description |
| -------- | ----------------| ------- | ----------- |
| behavior | "auto", "instant", "smooth" or number milliseconds | "auto" | animation style aka duration (*instant* = 0, *auto* = 200, *smooth* = 400) |
| block    | "start", "end", "middle" | "start" | alignment of target block relative to scrollable container
| margin   | number of pixels | 0 | value to adjust target scroll position, useful to account for fixed elements like header or footer |
| lazy     | boolean | false | flag to to indicate whether to avoid scrolling if element is already within visible scrollable area |
