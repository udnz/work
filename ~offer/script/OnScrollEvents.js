/**
 * Created by uonun on 13-12-21.
 */
(function ($) {
    $.OnScrollEvents = function (options) {
        EventData = null;

        var defaults = {
            items: [
                {
                    obj: null,           // jQuery object
                    callbacks: {
                        visible: {
                            fn: null,    // function(element,user_data). element 为 obj 中符合jQuery匹配规则的当前元素，参见 $(selector).each(function(index,element))。
                            loop: false
                        },
                        invisible: {
                            fn: null,    // function(element,user_data). element 为 obj 中符合jQuery匹配规则的当前元素，参见 $(selector).each(function(index,element))。
                            loop: false
                        }
                    },
                    user_data: null     // argument for callbacks
                }
            ]
        };

        var params = $.extend({}, defaults, options || {});
        params.cache = [];
        $.each(params.items, function (i, item) {
            if (!!item && !!item.obj) {
                params.cache.push(item);
            }
        });

        //动态显示数据
        var scrolling = function () {
            var st = $(window).scrollTop(), sth = st + $(window).height();
            $.each(params.cache, function (i, item) {
                if (item.obj) {
                    $.each(item.obj, function (i, dom) {
                        var o = $(dom);
                        post = o.offset().top;
                        posb = post + o.height();
                        var isVisible = (post > st && post < sth) || (posb > st && posb < sth); // 是否在浏览器窗口内
                        if (isVisible && !!item.callbacks && !!item.callbacks.visible) {
                            if (!!item.callbacks.visible.loop || !!item.callbacks.visible.fn) {
                                item.callbacks.visible.fn(dom,item.user_data);
                                if (!!!item.callbacks.visible.loop)
                                    item.callbacks.visible.fn = null;
                            }
                        } else if (!isVisible && !!item.callbacks && !!item.callbacks.invisible) {
                            if (!!item.callbacks.invisible.loop || !!item.callbacks.invisible.fn) {
                                item.callbacks.invisible.fn(dom,item.user_data);
                                if (!!!item.callbacks.invisible.loop)
                                    item.callbacks.invisible.fn = null;
                            }
                        }
                    });
                }
            });
            return false;
        };

        //事件触发
        //加载完毕即执行
        scrolling();
        //滚动执行
        $(window).bind("scroll", scrolling);
    };
})(jQuery);