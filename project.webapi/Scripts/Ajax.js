(function (app) {
    'use strict';

    app.http = {
        get: get,
        post: post
    };

    function get(url) {
        return send('GET', url);
    }

    function post(url, data) {
        return send('POST', url, data || {});
    }

    function send(type, url, data) {
        //url = 'http://192.168.111.155:8025' + url;
        var http = initHttp(), success = [], fail = [], over = [], ch = [], params = [];
        if (data) {
            for (var d in data) {
                params.push(d + '=' + data[d]);
            }
            data = params.join('&');
        } else {
            data = null;
        }
        try {
            http.open(type, url);
            http.setRequestHeader("If-Modified-Since", "0");
            http.setRequestHeader("Cache-Control", "no-cache");
            http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            http.onreadystatechange = function () {
                if ((http.readyState === 4) && (http.status === 200)) {
                    var response = JSON.parse(http.responseText);
                    success.map(function (s) { s && s(response); });
                    over.map(function (o) { o && o(); });
                } else if (http.readyState === 4) {
                    fail.map(function (f) { f && f(http); });
                    ch.map(function (c) { c && c(http); });
                    over.map(function (o) { o && o(); });
                }
            };
            http.send(data);
        } catch (e) {
            ch.map(function (c) { c && c(e); });
            over.map(function (o) { o && o(e); });
        }
        return {
            then: function (a, b) {
                success.push(a);
                fail.push(b);
                return this;
            },
            success: function (a) {
                success.push(a);
                return this;
            },
            fail: function (b) {
                fail.push(b);
                return this;
            },
            catch: function (d) {
                ch.push(d);
                return this;
            },
            finally: function (c) {
                over.push(c);
                return this;
            }
        }
    }

    function initHttp() {
        var xmlHttp;
        if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        return xmlHttp;
    }
})(window);