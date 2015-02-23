var Article = (function() {
	var obj = function(){};
	obj.prototype = {
	    init: function() {
		this.clear();
	    },
	    clear: function() {
		this.title = "";
		this.tags = [];
		this.body = "";
		this.coedit = false;
		this.priv = false;
		this.draft = false;
		this.gist = false;
		this.twitter = false;
	    },
	    set: function(args) {
		this.setTitle(args.title);
		this.setTags(args.tags);
		this.setCoedit(args.coedit);
		this.setBody(args.body);
		this.setPriv(args.priv);
		this.setDraft(args.draft);
		this.setGist(args.gist);
		this.setTwitter(args.twitter);
	    },
	    setTitle: function(title) {
		this.title = title;
	    },
	    setTags: function(tagsStr) {
		this.tags = [];
		var tagArr = tagsStr.split(",");
		var self = this;

		tagArr.forEach(function(e) {
			    var s;
			    s = e.replace(/(^\s+)|(\s+$)/g, "");
			    self.tags.push({
				    'name': s
					});
			});
	    },
	    addTag: function(tag) {
		this.tags.push(tag);
	    },
	    setBody: function(body) {
		this.body = body;
	    },
	    setCoedit: function(coedit) {
		this.coedit = coedit;
	    },
	    setPriv: function(priv) {
		this.priv = priv;
	    },
	    setDraft: function(draft) {
		this.draft = draft;
	    },
	    setGist: function(gist) {
		this.gist = gist;
	    },
	    setTwitter: function(twitter) {
		this.twitter = twitter;
	    },
	    get: function() {
		var tagStr = "";
		this.tags.forEach((function(t) {
			    tagStr = tagStr + t['name'] + ", ";
			}));
		var s = tagStr.substr(0, tagStr.length - 2);

		var ret = {
		    'title': this.title,
		    'tags': s,
		    'body': this.body,
		    'coedit': this.coedit,
		    'priv': this.priv,
		    'draft': this.draft,
		    'gist': this.gist,
		    'twitter': this.twitter
		};
		
		return ret;
	    },
	    getRaw: function() {
		var ret = {
		    'title': this.title,
		    'tags': this.tags,
		    'body': this.body,
		    'coedit': this.coedit,
		    'priv': this.priv,
		    'draft': this.draft,
		    'gist': this.gist,
		    'twitter': this.twitter
		};
		return ret;
	    }
		
	};
	return obj;
    })();

function tagStrToArr(str)
{
    var list = str.split(",");
    var arr = [];
    list.forEach(function(e) {
	    var s;
	    s = e.replace(/(^\s+)|(\s+$)/g, "");
	    arr.push({'name': s});
	});

    return arr;
}

function tagArrToStr(arr)
{
    var tagStr = "";
    arr.forEach(function(t) {
		tagStr = tagStr + t['name'] + ", ";
	    });
    return tagStr.substr(0, tagStr.length - 2);
}