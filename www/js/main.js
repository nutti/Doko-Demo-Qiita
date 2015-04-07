document.addEventListener("deviceready", onDeviceReady);

document.addEventListener("touchend", function(event) {
	var target = $(event.target);
	if (target.get(0).nodeName.toUpperCase() != "INPUT" && target.get(0).nodeName.toUpperCase() != "TEXTAREA") {
	    event.preventDefault();
	    event.stopPropagation();
	    return false;
	}
    });

var module = angular.module('app', ['onsen']);

module.controller('MenuController', function($scope) {
	$scope.info = function() {
	    menu.setMainPage('view/profile.html', {closeMenu: true});
	};
	$scope.editContrib = function() {
	    getContribList(onContribListGet);
	};
	$scope.editDraft = function() {
	    getDraftList();
	};
    });

var temp_contents;
var selectedContrib;
var selectedDraft;
var temp_preview_nav;
var appConf;

module.controller('NewEditorController', function($scope) {
	$scope.submit = function() {
	    var contents = {
                'title': $('#title').val(),
                'tags': tagStrToArr($('#tag').val()),
                'body': $('#text_body').val(),
                'coediting': false,
                'private': $('input[name=submit_method]:checked').val() == "private",
                'draft': $('input[name=submit_method]:checked').val() == "draft",
                'gist': $('#gist').attr('checked'),
                'tweet': $('#twitter').attr('checked')
            };
	    if (contents['draft']) {
		var ds = new DraftStorage();
		ds.save(contents);
		ons.notification.alert({
			'title': '通知',
			    'message': '記事を下書き保存しました'
			    });
		menu.setMainPage('view/blank.html');
	    }
	    else{
		contents['body'] = getContentsHeader() + contents['body'];
		$.ajax({
			'url': getAPIURL('/api/v2/items'),
			'type': 'POST',
			'headers': {
			    'Content-Type': 'application/json',
			    'Authorization': 'Bearer ' + auth_token,
			},
			data: JSON.stringify(contents),
			dataType: 'json',
			success: function(res) {
			    ons.notification.alert({
				    'title': '通知',
				    'message': '記事が投稿されました',
				});
			    menu.setMainPage('view/blank.html');
			},
			error: function(res) {
			    ons.notification.alert({
				    'title': '警告',
				    'message': '記事の投稿中にエラーが発生しました\n' + res.status + ':' + res.statusText
				});
			}
		    }); // ajax
	    }
	};
	$scope.preview = function() {
	    var contents = {
                'title': $('#title').val(),
                'tags': tagStrToArr($('#tag').val()),
                'body': getContentsHeader() + $('#text_body').val(),
                'coediting': false,
                'private': $('input[name=submit_method]:checked').val() == "private",
                'draft': $('input[name=submit_method]:checked').val() == "draft",
                'gist': $('#gist').attr('checked'),
                'tweet': $('#twitter').attr('checked')
            };
	    temp_contents = contents;
	    temp_preview_nav = newEditorNavigator;
	    newEditorNavigator.pushPage('view/preview.html');
	};
	$scope.cancel = function() {
	    ons.notification.confirm({
		    title: '確認',
		    message: '編集中のデータを破棄します',
		    buttonLabels: ['いいえ', 'はい'],
		    callback: function(idx) {
			if (idx == 1) {
			    menu.toggle();
			}
		    }
		});
	};
	ons.ready(function() {
	    });
    });

module.controller('PreviewController', function($scope) {
        $scope.back = function() {
	    temp_preview_nav.popPage();
        };
	ons.ready(function() {
		setupPreviewScene(temp_contents);
	    });
    });

module.controller('ContribController', function($scope) {
	$scope.cancel = function() {
	    menu.toggle();
	};
	$scope.edit = function(idx) {
	    selectedContrib = contrib_list[idx];
	    contribNavigator.pushPage('view/editor_contrib.html');
	};
	$scope.items = contrib_list;
    });

module.controller('ContribEditorController', function($scope) {
	$scope.cancel = function() {
	    ons.notification.confirm({
                    title: '確認',
                    message: '編集中のデータを破棄します',
                    buttonLabels: ['いいえ', 'はい'],
                    callback: function(idx) {
                        if (idx == 1) {
			    contribNavigator.popPage();
                        }
                    }
		});
	};

	$scope.submit = function() {
	    var contents = {
                'title': $('#title').val(),
                'tags': tagStrToArr($('#tag').val()),
                'body': $('#text_body').val(),
                'coediting': false,
                'private': $('input[name=submit_method]:checked').val() == "private"
            };
	    if (!selectedContrib['private']) {
		contents['private'] = false;
	    }
	    $.ajax({
                    'url': getAPIURL('/api/v2/items/' + selectedContrib['article_id']),
                        'type': 'PATCH',
                        'headers': {
                        'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + auth_token,
                            },
                        data: JSON.stringify(contents),
                        dataType: 'json',
                        success: function(res) {
                        ons.notification.alert({
				'title': '通知',
				    'message': '記事が更新されました',
				    });
			menu.setMainPage('view/blank.html');
                    },
                        error: function(res) {
			ons.notification.alert({
				'title': '警告',
				    'message': '記事の更新中にエラーが発生しました\n' + res.status + ':' + res.statusText
				    });
		    }
		}); // ajax
	};

	$scope.delete = function() {
	    ons.notification.confirm({
		    title: '確認',
		    message: "記事を削除します",
		    buttonLabels: ['いいえ', 'はい'],
		    callback: function(idx) {
			if (idx == 1) {
			    $.ajax({
				    'url': getAPIURL('/api/v2/items/' + selectedContrib['article_id']),
				    'type': 'DELETE',
				    'headers': {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + auth_token,
				    },
				    dataType: 'json',
				    success: function(res) {
					ons.notification.alert({
						'title': '通知',
						'message': '削除が完了しました',
					    });
					menu.setMainPage('view/blank.html');
				    },
				    error: function(res) {
					ons.notification.alert({
						'title': '警告',
						'message': '記事の削除中にエラーが発生しました\n' + res.status + ':' + res.statusText,
					    });
				    }
				}); // ajax	     
			} // if (idx == 1)
		    } // callback: function(idx)
		}); // ons.notification
	};
		
	$scope.preview = function() {
	    var contents = {
		'title': $('#title').val(),
		'tags': tagStrToArr($('#tag').val()),
                'body': $('#text_body').val(),
                'coediting': false,
                'private': $('input[name=submit_method]:checked').val() == "private",
                'draft': $('input[name=submit_method]:checked').val() == "draft",
                'gist': $('#gist').attr('checked'),
                'tweet': $('#twitter').attr('checked')
            };
	    temp_contents = contents;
	    temp_preview_nav = contribNavigator;
	    contribNavigator.pushPage('view/preview.html');
	};
	ons.ready(function() {
		setupContribEditorScene(selectedContrib);
	    });
    });

module.controller('DraftController', function($scope) {
	$scope.cancel = function() {
	    menu.toggle();
	};
	$scope.edit = function(idx) {
	    selectedDraft = draft_list[idx];
	    draftNavigator.pushPage('view/editor_draft.html');
	};
	$scope.items = draft_list;
    });

module.controller('DraftEditorController', function($scope) {
	$scope.cancel = function() {
	    ons.notification.confirm({
                    title: '確認',
                    message: '編集中のデータを破棄します',
                    buttonLabels: ['いいえ', 'はい'],
                    callback: function(idx) {
                        if (idx == 1) {
                            draftNavigator.popPage();
                        }
                    }
                });
	};

	$scope.submit = function() {
	    var contents = {
                'title': $('#title').val(),
                'tags': tagStrToArr($('#tag').val()),
                'body': $('#text_body').val(),
                'coediting': false,
                'private': $('input[name=submit_method]:checked').val() == "private",
                'draft': $('input[name=submit_method]:checked').val() == "draft",
                'gist': $('#gist').attr('checked'),
                'tweet': $('#twitter').attr('checked')
            };
	    if (contents['draft']) {
                var ds = new DraftStorage();
                ds.update(selectedDraft['key'], contents);
                ons.notification.alert({
                        'title': '通知',
                            'message': '記事を下書き保存しました'
                            });
                menu.setMainPage('view/blank.html');
            }
	    else{
		contents['body'] = getContentsHeader() + contents['body'];
                $.ajax({
                        'url': getAPIURL('/api/v2/items'),
                        'type': 'POST',
                        'headers': {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + auth_token,
                        },
                        data: JSON.stringify(contents),
                        dataType: 'json',
                        success: function(res) {
                            ons.notification.alert({
                                    'title': '通知',
                                    'message': '記事が投稿されました',
                                });
			    var ds = new DraftStorage();
                            ds.erase(selectedDraft['key']);
			    menu.setMainPage('view/blank.html');
			},
			error: function(res) {
                            ons.notification.alert({
                                    'title': '警告',
                                    'message': '記事の投稿中にエラーが発生しました\n' + res.status + ':' + res.statusText
                                });
                        }
                    }); // ajax
            }
	};

	$scope.delete = function() {
	    ons.notification.confirm({
		    title: '確認',
		    message: '下書きを削除します',
		    buttonLabels: ['いいえ', 'はい'],
		    callback: function(idx) {
			if (idx == 1) {
			    var ds = new DraftStorage();
			    ds.erase(selectedDraft['key']);
			    ons.notification.alert({
				    'title': '通知',
					'message': '下書きを削除しました',
					});
			    menu.setMainPage('view/blank.html');
			}
		    } // callback: function(idx)
		}); //ons.notification
	};

	$scope.preview = function() {
	    var contents = {
		'title': $('#title').val(),
                'tags': tagStrToArr($('#tag').val()),
                'body': getContentsHeader() + $('#text_body').val(),
                'coediting': false,
                'private': $('input[name=submit_method]:checked').val() == "private",
                'draft': $('input[name=submit_method]:checked').val() == "draft",
                'gist': $('#gist').attr('checked'),
                'tweet': $('#twitter').attr('checked')
            };
            temp_contents = contents;
            temp_preview_nav = draftNavigator;
            draftNavigator.pushPage('view/preview.html');
	};

	ons.ready(function() {
		setupDraftEditorScene(selectedDraft);
	    });
    });

module.controller('LoginController', function($scope) {
	$scope.login = function() {
	    oauth();
	};
    });

module.controller('ProfileController', function($scope) {
	$scope.logout = function() {
	    var lis = new LoginInfoStorage();
	    lis.erase();
	    menu.setMainPage('view/login.html', {closeMenu: true});
	};
	$scope.cancel = function() {
	    appConf = {
		'improperArticle': $('#improper-article').attr('checked')
	    };
	    var acs = new AppConfStorage();
	    acs.save(authUser, appConf);
	    menu.toggle();
	};
	$scope.login_name = authUserInfo['id'];
	$scope.profile_image = authUserInfo['profile_image_url'];
	ons.ready(function() {
		$('#improper-article').prop('checked', appConf['improperArticle']);
	    });
    });

var auth_token;
var authUser = "";
var authAuto = false;
var authUserInfo = {};

var contrib_list = [];
var draft_list = [];
var login_user;
var qoa = new QiitaOAuth();

var header;
var container;
var sceneStack = [];

function getContentsHeader()
{
    var header = "";
 
    if (appConf['improperArticle']) {
	header = "※この投稿は不適切な内容を含みます。\n\n";
    }
    
    return header;
}

function getAPIURL(path)
{
    var loc = 'https://qiita.com';
    return loc + path;
}

function oauth()
{
    qoa.init();
    qoa.login(onOAuthSuccess);
}

function onOAuthSuccess(params)
{
    $.ajax({
	    url: getAPIURL('/api/v2/access_tokens'),
		type: 'POST',
		headers: {
		'Content-Type': 'application/json',
	    },
		dataType: 'json',
		data: JSON.stringify(params),
		success: function(res) {
		auth_token = res['token'];
		getAuthUser(auth_token);
	    },
		error: function(e) {
		ons.notification.alert({
                        'title': '警告',
                            'message': e.status + ':' + e.statusText
                            });
	    }
	});
}

function getAuthUser(authToken)
{
    $.ajax({
            url: getAPIURL('/api/v2/authenticated_user'),
                type: 'GET',
                headers: {
                'Content-Type': 'application/json',
		    'Authorization': 'Bearer ' + authToken,
		    },
                dataType: 'json',
                success: function(res) {
                authUser = res['id'];
		if ($('#auto-login').attr('checked')) {
		    authAuto = 'yes'
		}
		else {
		    authAuto = 'no';
		}
		authUserInfo = res;
		var lis = new LoginInfoStorage();
		lis.save(auth_token, authAuto, authUser);
		var acs = new AppConfStorage();
		appConf = acs.load(authUser);
		menu.setMainPage('view/profile.html', {closeMenu: true});
            },
                error: function(e) {
		ons.notification.alert({
                        'title': '警告',
                            'message': e.status + ':' + e.statusText
                            });
            }
        });
}

function getAuthUserAuto()
{
    $.ajax({
            url: getAPIURL('/api/v2/authenticated_user'),
                type: 'GET',
                headers: {
                'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth_token,
                    },
                dataType: 'json',
                success: function(res) {
                if (res['id'] == authUser) {
		    authUserInfo = res;
		    var acs = new AppConfStorage();
		    appConf = acs.load(authUser);
		    menu.setMainPage('view/profile.html', {closeMenu: true});
		}
            },
                error: function(e) {
	    }
	});
}

function onDeviceReady(event)
{
    var lis = new LoginInfoStorage();
    var info = lis.load();
    auth_token = info['accessToken'];
    authUser = info['user'];
    authAuto = info['store'];
    if (authAuto == 'yes') {
	getAuthUserAuto();
    }
}

function setupContribEditorScene(article)
{
    $('#title').val(article['title']);
    $('#tag').val(tagArrToStr(article['tags']));
    $('#text_body').val(article['body']);
    if (!article['private']) {
        $('#submit_method_sect').hide();
    }
}

function setupDraftEditorScene(article)
{
    $('#title').val(article['title']);
    $('#tag').val(tagArrToStr(article['tags']));
    $('#text_body').val(article['body']);
    $('#gist').prop('checked', article['gist']);
    $('#twitter').prop('checked', article['tweet']);
}

function setupContribScene()
{
    getContribList(onContribListGet);
}

function onContribListGet(contrib)
{
    contrib_list = [];
    contrib.forEach(function(e){
	    var tags = [];
	    e['tags'].forEach(function(e) {
		    tags.push({'name': e.name});
		});

	    var elm = {
		'article_id': e['id'],
		'title': e['title'],
		'tags': tags,
		'body': e['body'],
		'coediting': e['coediting'],
		'private': e['private'],
		'draft': false,
		'gist': false,
		'tweet': false
	    };
	    contrib_list.push(elm);
	});

    menu.setMainPage('view/contrib.html', {closeMenu: true});
}

function getContribList(callback)
{
    $.ajax({
	    url: getAPIURL('/api/v2/authenticated_user/items'),
                type: 'GET',
                headers: {
                'Authorization': 'Bearer ' + auth_token,
                    },
                dataType: 'json',
                success: function(res) {
		callback(res);
            },
                error: function(e) {
		ons.notification.alert({
                        'title': '警告',
                            'message': "投稿の読み込みに失敗しました\n" + e.status + ':' + e.statusText
                            });
            }
        });
}

function getDraftList()
{
    var ds = new DraftStorage();
    var keys = ds.getAllKeys();
    draft_list = [];

    keys.forEach((function(e) {
		var article = ds.load(e);
		var elm = {
		    'key': e,
		    'title': article['title'],
		    'tags': article['tags'],
		    'body': article['body'],
		    'coediting': article['coediting'],
		    'private': article['private'],
		    'draft': article['draft'],
		    'gist': article['gist'],
		    'tweet': article['tweet']
		};
		draft_list.push(elm);
	    }));

    menu.setMainPage('view/draft.html', {closeMenu: true});



}

function setupPreviewScene(contents)
{
    marked.setOptions({
	    langPrefix: '',
		gfm: true,
		breaks: true
		});

    var html = marked(contents['body']);

    $('#preview').html(html);
    $('#preview pre code').each(function(i, block) {
	    hljs.highlightBlock(block, block.className);
	});
}
