document.addEventListener("pageinit", function(e) {
	if (e.target.id == "profilePage" ||
	    e.target.id == "loginPage" ||
	    e.target.id == "newEditorPage" ||
	    e.target.id == "contribPage" ||
	    e.target.id == "contribEditorPage" ||
	    e.target.id == "draftPage" ||
	    e.target.id == "draftEditorPage" ||
	    e.target.id == "previewPage" ) {
	    setNend();
	}
    }, false);



// nend広告表示用
var nend_params = NEND_PARAMS;
var $nend = null;
function setNend() {
    setTimeout(function() {
	    // 広告を退避する
	    if (!$nend) {
		$nend = angular.element(nend_wrapper);
	    }
	    angular.element(document.querySelectorAll('.new_nend_wrapper')).append($nend);
	    var nend_links = document.querySelectorAll('.new_nend_wrapper a');
	    for(var i = 0; i < nend_links.length; i+=1){
		(function() {
		    var href = nend_links[i].href;
		    //   nend_links[i].href = "#";
		    nend_links[i].onclick = function(){window.open(href, '_system', 'location=yes'); return false;}
		})();
	    }
	}, 1000);
}