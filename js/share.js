/**
 * 微信内分享js
 * 解决图片问题
 */
(function($) {
	window.Share = function(options) {
		if (typeof options.href == "undefined") {
			console.log("必要参数location没有传！");
			return;
		}
		if (typeof options.imgPath == "undefined") {
			console.log("必要参数imgPath没有传！");
			return;
		}
		if (typeof options.title == "undefined") {
			console.log("必要参数title没有传！");
			return;
		}
		if (typeof options.desc == "undefined") {
			console.log("必要参数desc没有传！");
			return;
		}
		if (typeof options.siteID == "undefined") {//项目应用独立添加
			console.log("必要参数siteID没有传！");
			return;
		}
		var param = {
			"URL":options.href,
			"SiteID":options.siteID
		};
		Server.sendRequest("WeixinShare", param, function(response) {
			if (response.Status) {
				wx.config({
					debug : false,
					appId : response.ShareInfo.appId,
					timestamp : response.ShareInfo.timestamp,
					nonceStr : response.ShareInfo.nonceStr,
					signature : response.ShareInfo.signature,
					jsApiList : [
					// 所有要调用的 API 都要加到这个列表中
					'checkJsApi', 'onMenuShareTimeline',
							'onMenuShareAppMessage' ]
				});

				// 自定义内容
				var dataForWeixin = {
					title : options.title,
					desc : options.desc,
					imgUrl :options.imgPath,
					link : options.location,
					linko : options.location,
				};

				wx.ready(function() {
					// 在这里调用 API
					wx.onMenuShareTimeline({
						title : dataForWeixin.title, // 分享标题
						desc : dataForWeixin.desc, // 分享描述
						link : dataForWeixin.link, // 分享链接
						imgUrl : dataForWeixin.imgUrl, // 分享图标
						success : function() {
							// 用户确认分享后执行的回调函数
							// location.href=linko;
						},
						cancel : function() {
							// 用户取消分享后执行的回调函数
						}
					});

					wx.onMenuShareAppMessage({
						title : dataForWeixin.title, // 分享标题
						desc : dataForWeixin.desc, // 分享描述
						link : dataForWeixin.link, // 分享链接
						imgUrl : dataForWeixin.imgUrl, // 分享图标
						type : '', // 分享类型,music、video或link，不填默认为link
						dataUrl : '', // 如果type是music或video，则要提供数据链接，默认为空
						success : function() {
							// 用户确认分享后执行的回调函数
							// location.href=linko;
						},
						cancel : function() {
							// 用户取消分享后执行的回调函数
						}
					});
				});
			} else {
				console.log("初始分享化失败！");
			}
		});// 成功提示改为冒泡，失败则提示失败原因
	}
})(jQuery)