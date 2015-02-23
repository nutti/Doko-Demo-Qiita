var LoginInfoStorage = (function() {
	var obj = function(){};
	obj.prototype = {
	    save : function(accessToken, store, user) {
		var token = accessToken;
		
		if (store == 'no') {
		    token = '';
		    user = '';
		}

		var saveData = {
				'accessToken': token,		
				'store': store,
				'user': user
		};

		window.localStorage.setItem("login-info", JSON.stringify(saveData));
	    },
	    load : function() {
		var ret;
		ret = $.parseJSON(window.localStorage.getItem("login-info"));
		if (ret == undefined) {
		    ret = {'accessToken': '', 'store': 'no', 'user': ''};
		}
		if (ret['accessToken'] == undefined) {
		    ret["accessToken"] = '';
		}
		if (ret['user'] == undefined) {
		    ret['user'] = '';
		}
		if (ret['store'] == undefined) {
		    ret['store'] = 'no';
		}

		return ret;
	    },
	    erase: function() {
		var data = {
		    'accessToken': '',
		    'store': 'no',
		    'user': ''
		};
		window.localStorage.setItem('login-info', JSON.stringify(data));
	    }
	};
	return obj;
    })();

function getCurTime()
{
    var date = new Date();
    var year = date.getYear() + 1900;
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var s =
	("000" + year).substr(-4) +
	("0" + mon).substr(-2) +
	("0" + day).substr(-2) +
	("0" + hour).substr(-2) +
	("0" + min).substr(-2) +
	("0" + sec).substr(-2);

    return s;
}

var DraftStorage = (function() {
	var obj = function(){};
	obj.prototype = {
	    save: function(contents) {
		var k = "draft-" + getCurTime();
		this.update(k, contents);
	    },
	    update: function(key, contents) {
		var article = {
		    'title': contents['title'],
		    'tags': tagArrToStr(contents['tags']),
		    'body': contents['body'],
		    'coedit': contents['coedit'],
		    'private': contents['private'],
		    'draft': contents['draft'],
		    'gist': contents['gist'],
		    'tweet': contents['tweet']
		};
		window.localStorage.setItem(key, JSON.stringify(article));
	    },
	    getAllKeys: function() {
		var keys = [];
		for (var i = 0; i < window.localStorage.length; ++i) {
		    var k = window.localStorage.key(i);
		    if (k.indexOf('draft-') != -1) {
			keys.push(k);
		    }
		}
		return keys;
	    },
	    load: function(key) {
		var ret;
		ret = $.parseJSON(window.localStorage.getItem(key));
		ret['tags'] = tagStrToArr(ret['tags']);
		return ret;
	    },
	    erase: function(key) {
		window.localStorage.removeItem(key);
	    }
	};
	return obj;
    })();

var AppConfStorage = (function() {
	var obj = function(){};
	obj.prototype = {
	    save: function(user, conf) {
		var key = "app-conf-" + user;
		window.localStorage.setItem(key, JSON.stringify(conf));
	    },
	    load: function(user) {
		var key = "app-conf-" + user;
		var ret;
		var conf = {};
		ret = window.localStorage.getItem(key);
		if (ret != undefined) { conf = $.parseJSON(ret); }
		if (conf['improperArticle'] == undefined) { conf['improperArticle'] = false; }
		return conf;
	    }
	};
	return obj;
    })();