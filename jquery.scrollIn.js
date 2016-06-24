/**
 * jquery.scrollIn.js
 *
 * @author Pavel Kulbakin <p.kulbakin@gmail.com>
 * @version 1.0.1
 * @license MIT
 *
 * jQuery equivalent of Element.scrollIntoView()
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 * with some extras. The available options are
 *
 *  behavior    animation style ("auto" | "instant" | "smooth" | animation duration in milliseconds);
 *  block       alignment of target block ("start" | "end" | "middle");
 *  margin      number of pixels to adjust scroll position by;
 *  lazy        boolean to indicate whether to avoid scrolling if element already
 *              within visible scrollable area;
 *
 * Also registers `:scrollable` jQuery selector to filter elements which can be scrolled.
 */

(function (factory) {
    if (typeof define === "function" && define.amd) {
        /** AMD. Register as an anonymous module. */
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        /** Node/CommonJS */
        module.exports = factory(require("jquery"));
    } else {
        /** Browser globals */
        factory(window.jQuery);
    }
}(function ($) {
    /*
     * Default options for the method
     */
    var defaults = {
        behavior: 'auto',   // "auto" (200) | "instant" (0) | "smooth" (400) | animation duration in milliseconds
        block: 'start',     // "start" | "end" | "middle"
        margin: 0,          // number of pixels to adjust calculated position by
        lazy: false         // false (triggered always) | true (triggered only if not within visible area already)
    };

    /*
     * Register jQuery extension
     */
    $.fn.scrollIn = function (options) {
        // cast boolean options to object
        if (true === options) {
            options = {block: 'start'};
        } else if (false === options) {
            options = {block: 'end'};
        } else if ('object' !== typeof options) {
            options = {};
        }
        // apply default options
        options = $.extend({}, defaults, options);
        // cast 'behavior' into animation duration
        options.behavior = {auto: 200, smooth: 400}[options.behavior] || parseInt(options.behavior) || 1;

        var $to = this.first();
        var $re = $to.parent().closest(':scrollable');
        var animation = {options: {
            easing: 'linear',
            duration: options.behavior,
            queue: 'scrollIn'
        }};

        // proceed only if there is scrollable container
        if ($re.length) {
            $.each(dims, function (i, props) {
                var pos;

                // there is scrollable dimension
                if ($re.prop(props.scrollDim) > $re.prop(props.clientDim)) {
                    // get absolute position of element relative to scrollable container
                    pos = $to.offset()[props.cor] - $re.offset()[props.cor] + $re[props.scrollCor]();
                    // check if scrolling is required
                    if ( ! options.lazy
                        || $re[props.scrollCor]() > pos - options.margin
                        || pos + options.margin + $to[props.outerDim]() > $re[props.scrollCor]() + $re.prop(props.clientDim)
                    ) {
                        // calculate new scroll position
                        switch (options.block) {
                        case 'end':
                            animation[props.scrollCor] = pos + options.margin - ($re.prop(props.clientDim) - $to[props.outerDim]());
                            break;
                        case 'middle':
                            animation[props.scrollCor] = pos - options.margin - ($re.prop(props.clientDim) - $to[props.outerDim]()) / 2;
                            break;
                        default: // start
                            animation[props.scrollCor] = pos - options.margin;
                            break;
                        }

                        // make sure scroll position is within available limit
                        animation[props.scrollCor] = Math.max(0, Math.min($re.prop(props.scrollDim) - $re.prop(props.clientDim), animation[props.scrollCor]));
                    }
                }
            });

            if (undefined !== animation.scrollTop || undefined !== animation.scrollLeft) {
                $re.stop(animation.queue).animate(animation).dequeue(animation.queue);
            }
        }

        return this;
    };

    /*
     * Register jQuery selector
     */
    $.extend($.expr[":"], {
        scrollable: function (el) {
            var $el = $(el);
            var result = false;
            $.each(dims, function (i, props) {
                result = result || $.inArray($el.css(props.overflow).toLowerCase(), ['scroll', 'auto']) >= 0 && $el.prop(props.scrollDim) > $el.prop(props.clientDim);
                return ! result;
            });
            return result;
        }
    });

    /*
     * the logic is the same for both width and height, just parameters differ,
     * thus define an array of parameter names to use
     */
    var dims = [{
        overflow:   'overflow-y',
        scrollDim:  'scrollHeight',
        clientDim:  'clientHeight',
        outerDim:   'outerHeight',
        cor:        'top',
        scrollCor:  'scrollTop'
    }, {
        overflow:   'overflow-x',
        scrollDim:  'scrollWidth',
        clientDim:  'clientWidth',
        outerDim:   'outerWidth',
        cor:        'left',
        scrollCor:  'scrollLeft'
    }];
}));
