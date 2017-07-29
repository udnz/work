function isIE() {
    return !!document.all;
}

function isSafari() {
    return navigator.userAgent.indexOf("AppleWebKit") > -1;
}

function isIEbyVersion(version) {
    version = parseInt(version);
    return isIE() && navigator.userAgent.indexOf((version >= 11 ? "IE" : "MSIE ") + version.toString()) > -1;
}

$(document).ready(function () {
    var body = $("body");
    for (i = 0; i < 10; i++) {
        body.prepend("<div id=\"rush_box_" + i + "\" class=\"ani_box_i\"></div>");
    }

    Shadowbox.init({displayNav: false});

    var timeline = $.UDNZTimeline({
        'id': 'my_timeline', // the ID of timeline instance.
        'data_url': 'script/UDNZTimeline/timeline-nodes.json?a=1',
        'container': {
            'id': 'timeline_container' // the ID of container DOM.
        }
    }).Draw();

    $.OnScrollEvents({items: [
        {
            obj: $("#navigation ul"),
            callbacks: {
                visible: {
                    fn: function (dom, user_data) {
                        if ($(window).scrollTop() < user_data)
                            $("body > header > nav").removeClass("keep-top");
                    },
                    loop: true
                },
                invisible: {
                    fn: function (dom, user_data) {
                        if ($(window).scrollTop() > user_data)
                            $("body > header > nav").addClass("keep-top");
                    },
                    loop: true
                }
            },
            user_data: $("#navigation ul").offset().top
        },
        {
            obj: $(".page"),
            callbacks: {
                visible: {
                    fn: function (dom, user_data) { // onNavVisible
                        var innerHeight = !!window.innerHeight ? window.innerHeight : dom.clientHeight * 2;
                        // 当前 dom 已经被滚动到屏幕的上半部分时才切换导航按钮状态
                        if (dom.offsetTop - $(window).scrollTop() < innerHeight / 2) {
                            $("#navigation li").removeClass("current");
                            $($("#navigation li")[$(dom).attr("nav-idx")]).addClass("current");
                        }
                    },
                    loop: true
                }
            }
        },
        {
            obj: $("#timeline_container"),
            callbacks: {
                visible: {
                    fn: function (dom, user_data) {
                        timeline.ShowNode('node_11', 1000);
                    }
                }
            }
        }
    ]});

    // 图表
    // Initialize the charts of Skills
    var options = {
        pointDotRadius: 5,
        //Boolean - If we want to override with a hard coded scale
        scaleOverride: true,
        //Number - The number of steps in a hard coded scale
        scaleSteps: 5,
        //Number - The value jump in the hard coded scale
        scaleStepWidth: 20,
        //Number - The centre starting value
        scaleStartValue: 10
    };

    $.OnScrollEvents({items: [
        {
            obj: $("#skill_canvas_backend"),
            callbacks: {
                visible: {
                    fn: function (dom, data) {
                        if (!!dom.getContext) { // to make sure the HTML5 supported.
                            new Chart(dom.getContext("2d")).Radar({
                                labels: [".NET(C#)", "XML", "C/C++", "ASP.NET", "Java"],
                                datasets: [
                                    {
                                        fillColor: "rgba(151,187,205,0.5)",
                                        strokeColor: "rgba(151,187,205,1)",
                                        pointColor: "rgba(151,187,205,1)",
                                        pointStrokeColor: "#fff",
                                        data: [95, 80, 40, 85, 60]
                                    }
                                ]
                            }, options);
                        }
                    }
                }
            }
        },
        {
            obj: $("#skill_canvas_frontend"),
            callbacks: {
                visible: {
                    fn: function (dom, data) {
                        if (!!dom.getContext) { // to make sure the HTML5 supported.
                            new Chart(dom.getContext("2d")).Radar({
                                labels: ["Html5", "CSS3", "Web2.0", "Javascript", "Ajax", "Json", "Flex"],
                                datasets: [
                                    {
                                        fillColor: "rgba(185, 169, 255,0.5)",
                                        strokeColor: "rgba(185, 169, 255,1)",
                                        pointColor: "rgba(185, 169, 255,1)",
                                        pointStrokeColor: "#fff",
                                        data: [ 95, 92, 90, 70, 85, 90, 60]
                                    }
                                ]
                            }, options);
                        }
                    }
                }
            }
        },
        {
            obj: $("#skill_canvas_communicate"),
            callbacks: {
                visible: {
                    fn: function (dom, data) {
                        if (!!dom.getContext) { // to make sure the HTML5 supported.
                            new Chart(dom.getContext("2d")).Radar({
                                labels: ["REST","Web Api", "WS(Soap)", "Other", "Remoting", "TCP/IP", "WCF"],
                                datasets: [
                                    {
                                        fillColor: "rgba(151,187,205,0.5)",
                                        strokeColor: "rgba(151,187,205,1)",
                                        pointColor: "rgba(151,187,205,1)",
                                        pointStrokeColor: "#fff",
                                        data: [ 85, 80, 90, 60, 60, 85, 80]
                                    }
                                ]
                            }, options);
                        }
                    }
                }
            }
        }
    ]});

    $("#contactForm").submit(function () {

        if ((isIE() && !isIEbyVersion(11) ) || isSafari()) {
            var objs = [$("#subject"), $("#from"), $("#content")];
            for (i = 0; i < objs.length; i++) {
                if (objs[i].val() == ""
                    || objs[i].val() == objs[i].attr("placeholder")
                    || (objs[i][0].id == "from" && !/^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/.test(objs[i].val())) // check email
                    ) {
                    $("#asynInfo").html(objs[i].attr("placeholder")).addClass("red").fadeIn();
                    return false;
                }
            }
        }

        $("#asynInfo").html("正在发送消息...").removeClass("red").fadeIn();

        $.ajax({
            dataType: "jsonp",
            contentType: "application/json",
            type: "GET",
            url: "http://work.udnz.com/Contact.aspx",
            data: {
                internalMail: '1',
                subject: "Offer from " + $("#subject").val() + " for Austin.Luo",
                from: $("#from").val(),
                content: $("#content").val()
            },
            timeout: 30000,
            success: function (data) {
                if (!!data.code) {
                    if (data.code == "0") {
                        $("#asynInfo").html("非常感谢您的留言，我将尽快与您联系！");
                    } else {
                        $("#asynInfo").html("发送失败，请直接发送邮件至 uonun@163.com 。").addClass("red");
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("#asynInfo").html("发送失败，请直接发送邮件至 uonun@163.com 。").addClass("red");
            }
        });
        return false;
    });

    // for old browsers: （ie 6,7,8,9,10）
    if (isIE() && !isIEbyVersion(11)) {
        //  - put a mask for ie 6,7,8.
        if (!isIEbyVersion(9) && !isIEbyVersion(10)) {
            $(".compatible-ie").mouseenter(function () {
                var mask = "<div class='mask-for-compatible-ie'><div><img src='images/browsers_32x32.png' border='0' /><br />抱歉，您的浏览器不支持最佳体验。建议您使用最新版的浏览器。</div></div>";
                $(this).append(mask);
            }).mouseleave(function () {
                    $(".mask-for-compatible-ie").remove();
                });
        }

        //  - check form of contact
        var objs = [$("#subject"), $("#from"), $("#content")];
        for (i = 0; i < objs.length; i++) {
            objs[i]
                .css({'color': '#666666'})
                .val(objs[i].attr("placeholder"))
                .focus(function () {
                    var currentDom = $(event.srcElement);
                    if (currentDom.val() == currentDom.attr("placeholder")) {
                        currentDom.val("").css({'color': '#000000'});
                    }
                }).blur(function () {
                    var currentDom = $(event.srcElement);
                    if (currentDom.val() == "") {
                        currentDom.val(currentDom.attr("placeholder")).css({'color': '#666666'});
                    }
                });
        }
    }

    $("#currentAgent").html("Current Agent: " + navigator.userAgent);
});

