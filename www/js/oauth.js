var QiitaOAuth = (function() {
	var obj = function(){};
	obj.prototype = {
	    init: function() {
		// Authentication parameters.
		this.authURL = 'https://qiita.com/api/v2/oauth/authorize';
		this.clientID = APP_CLIENT_ID;
		this.clientSecret = APP_CLIENT_SECRET;
		this.redirectURL = 'https://qiita.com/redirect';
		this.scope = 'read_qiita write_qiita';
		this.state = APP_REDIRECT_STATE;
		
		this.cb = undefined;
	    },
	    login: function(successCallback) {
		var url = this.getAuthURL();
		this.cb = window.open(url, "_blank", 'location=no,toolbar=no,clearcache=yes,clearsessioncache=yes');
		this.loginSuccess = successCallback;
		this.redirectParams = undefined;
		
		var self = this;
		self.cb.addEventListener('loadstart', function(e) {
			var loc = e.url;
			if (loc.indexOf(self.redirectURL) != -1) {
			    var params = getQueryParams(loc);
			    if (params['state'] != self.state) {
				alert("not match state parameter.");
				return;
			    }
			    self.cb.close();
			    self.redirectParams = {
				'client_id': self.clientID,
				'client_secret': self.clientSecret,
				'code': params['code']
			    };
			    self.loginSuccess(self.redirectParams);
			}
		    });
	    },
	    getAuthURL: function() {
		var url;
		url = this.authURL + "?" + $.param({
			client_id: this.clientID,
			scope: this.scope,
			state: this.state
		    });
		return url;
	    }
	};
	return obj;
    })();

function getQueryParams(url)
{
    var params = {};
    var queryStart = url.indexOf('?');

    if (queryStart == -1) { return params; }

    var query = url.substring(queryStart + 1);
    var p = query.split('&');

    for (var i = 0; i < p.length; ++i) {
	var elm = p[i].split('=');
	var key = decodeURIComponent(elm[0]);
	var value = decodeURIComponent(elm[1]);
	params[key] = value;
    }

    return params;
}
