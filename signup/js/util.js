/**
 * Created by weizhuo 需引入 jquery 
 */
(function($, window, undefined) {
	function util() {
		
	}
	/*去除所有eles查找到的所有元素的前后空格*/
	util.trims=function(eles){
		$.each( eles, function(){
			$(this).val($.trim($(this).val()));
		});
	};
	/* 判断是否为空,并将元素值至为去除前后空格的新值 */
	util.isTrimEmpty=function(ele) {
		var val = $(ele).val();
		val = $.trim(val);
		$(ele).val(val);
		return checkEmpty(val);
	};
	/* 判断是否为空 ,并将元素值至为去除前后空格的新值 */
	util.isTrimNotEmpty=function(ele) {
		return !util.isTrimEmpty(ele);
	};
	/* 判断是否为空 */
	util.isEmpty=function(val) {
		val = $.trim(val);
		return checkEmpty(val);
	};
	/* 判断是否为空 */
	util.isNotEmpty=function(val) {
		return !util.isEmpty(val);
	};
	/* 判断是否是正整数字串 */
	util.isNumber=function(num) {
		var match = num.match(/^[1-9]\d*$/);
		if (match) {
			return true;
		} else {
			return false;
		}
	};
	/*检测元素是否存在*/
	util.checkElm = function(elm) {
		if ($(elm).length > 0) {
			return true;
		} else {
			throw "没有匹配到任何元素:"+elm;
		}
	};
	/*验证val中是否包含以下特殊字符，包含返回true否则返回false*/
	util.containSpecalCharacter=function(val){
			val = $.trim(val);
	        var pattern = new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、///+/-]");
	        if (pattern.test(val)) {
	            return true;
	        }
	        return false;
	    };
	function checkEmpty(val){
			if (val == '' || val == null || typeof val === "undefined" || typeof val === "null" || val.length === 0 ) {
				return true;
			} else {
				return false;
			}
	 }
	window['wzUtils'] = util;
})(jQuery, window);