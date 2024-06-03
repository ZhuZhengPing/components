(function(app) {
	'use strict';

	app.http = {
		get: get,
		post: post,
	};

	function get(url) {
		return send('GET', url);
	}

	function post(url, data) {
		return send('POST', url, data || {});
	}

	function send(type, url, data) {
		var http = initHttp(),success, fail, over, ch, params = [];
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
			http.setRequestHeader("If-Modified-Since","0");
			http.setRequestHeader("Cache-Control", "no-cache");
			http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			http.onreadystatechange = function() {
				if((http.readyState === 4) && (http.status === 200)) {
					var response = JSON.parse(http.responseText);
					success && success(response);
					over && over();
				} else if(http.readyState === 4) {
					fail && fail(http);
					over && over();
				}
			};
			http.send(data);
		} catch(e) {
			ch && ch();
			over && over();
		}
		return {
			then: function(a, b) {
				success = a;
				fail = b;
				return this;
			},
			success: function(a) {
				success = a;
				return this;
			},
			fail: function(b) {
				fail = b;
				return this;
			},
			catch: function(d) {
				ch = d;
				return this;
			},
			finally: function(c) {
				over = c;
				return this;
			}
		}
	}

	function initHttp() {
		var xmlHttp;
		if(window.ActiveXObject) {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} else if(window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();
		}
		return xmlHttp;
	}
})(window);