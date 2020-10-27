var img = "<img src='" + base + "/gidmc/images/icon3.jpg'>";

var PHONE_EMIAL_FALG = {};
(function(context) {
	var falg = 1;
	var isGroup = false ;
	context.change = function() {
		falg = falg == 1 ? 2 : 1;
	};
	context.reset = function() {
		falg = 1;
	};
	context.isPhone = function() {
		return falg == 1;
	};
	context.isEmail = function() {
		return falg == 2;
	};
	context.isGroupReg = function () {
		return isGroup;
    };
	context.changeGroupTyp = function (f) {
		isGroup = f;
    }

})(PHONE_EMIAL_FALG);
var ifsub = true;
var timer = 0;
function doSubmit() {
	var username = $("#username").val();
	var password = $("#password").val();
	var conpwd = $("#repwd").val();
	if (PHONE_EMIAL_FALG.isPhone()) {
		var phone = $("#phone").val();
		$("#email").val("");
	} else {
		var email = $("#email").val();
		$("#phone").val("");
	}
	var pCode = $("#pCode").val();
	var imgCode = $("#imgCode").val();
	if(isPC()){
		$("#regTerminal").val("1");
	}else{
		if(isWX()){
			$("#regTerminal").val("2");
		}else{
			$("#regTerminal").val("3");
		}
	}
	var radiReg = $('input:radio[name="radiReg"]:checked').val();
	$("#userRole").val(radiReg);
	if (imgCode == "" || trim(username) == ""
			|| (PHONE_EMIAL_FALG.isEmail() && trim(email) == "")
			|| trim(password) == "" || conpwd == ""
			|| (PHONE_EMIAL_FALG.isPhone() && phone == "") || pCode == "") {
			layer.confirm('请将信息填写完整再提交', {
				  btn: ['确定'] 
				  ,title: false
			}, function(index, layero){
				layer.close(index); 
			});
		return false;
	} else {
			if (checkImage() == false || checkCode() == false
					|| checkEmail() == false || checkName() == false
					|| checkPwd() == false || confirmPwd() == false
					|| checkPhone() == false || ifflag() == false || checkPassword() == false) {
				return false;
			} else {
				if(ifsub == true){
					ifsub = false;
					$("#agreement1").html("");
					$("#fm").submit();
				}
			}

	}

}
// 输入手机号码
function checkPassword() {
    var f = false;
    $.ajax({
        type : 'post',
        url : base + '/apply/user!checkPassword.action',
        data: $('#fm').serialize(),
        async : false,
        success : function(msg) {
            if (msg != "") {
                $("#repwd1").html(msg);
                f = false;
            } else {
                $("#repwd1").html("");
                f = true;
            }
        },
        error : function() {
            $("#repwd1").html("验证出错");
            f = false;
        }
    })
    return f;
}

function isPC(){
    var userAgentInfo = navigator.userAgent.toLowerCase();
    var Agents = ["android", "iphone","symbianos", "windows phone","ipad", "ipod"];
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) >= 0) {
             return false;
        }
    }
    return true;
}
function isWX(){
    var ua = window.navigator.userAgent.toLowerCase(); 
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
            return true; 
    }else{ 
            return false; 
    } 
}
// 校验用户名的格式和判断用户名是否存在
function checkName() {
	var a = $("#username").val();
	var username = trim(a);
	var name = /^([a-zA-Z0-9]){4,16}$/;
	$("#username1").html("");
	var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
	if (username == "") {
		$("#username1").html("请输入真实姓名！");
		return false;
	} 
	if(reg.test(username)){
	 	if (username.length > 16 || username.length < 2) {
			$("#username1").html("请输入2至16个汉字");
			return false;
	 	}
	} else {
		if (username.length > 32) {
			$("#username1").html("最多输入32个字符");
			return false;
	 	}
	}
	return true;

}
function executeReg(arr, reg) {
	var patt = new RegExp(reg);
	return patt.test(arr);
}
// 密码的格式
function checkPwd() {
	$("#repwd1").removeAttr("style");
	$("#repwd1").html("请输入确认密码");       
	var pwd = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![,\.#\*\-:;^_]+$)[,\.#\*\-:;^_0-9A-Za-z]{6,32}$/;
	var a = $("#password").val();
	var password = trim(a);
	if (password == "") {
		$("#password1").html("密码不能为空");
		return false;
	}
	if (!pwd.test(password)) {
		$("#password1").html("密码必须为6~32个字符，字母+数字，区分大小写，特殊符号只能输入,.#*-:;^_");
		return false;
	}
	$("#password1").html("");
	return true;
}

// 确认密码
function confirmPwd() {
	$("#repwd1").html("");
	var conpwd = $("#repwd").val();
	var password = $("#password").val();

	if (password == "") {
		$("#repwd1").html("请先设置密码");
		$("#repwd").val("");
		$("#password").focus();
		return false;
	} else if (conpwd == "") {
		$("#repwd1").html("请再次输入密码");
		return false;
	} else if (conpwd != password) {
		$("#repwd1").html("两次密码输入不一致");
		return false;
	} else {
		$("#repwd1").html("");
		return true;
	}
}
// 输入手机号码
function checkPhone() {
	var flag = "";
	if (PHONE_EMIAL_FALG.isEmail()) {
		return true;
	}

	var f = true;
	var phone = $("#phone").val();
	var tel = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
	if (phone == "") {
		$("#phone1").show();
		$("#phone1").html("请输入手机号码");
		return false;
	}
	if (!tel.test(phone)) {
		$("#phone1").show();
		$("#phone1").html("手机号码格式不正确(正确手机号码为11位)");
		return false;
	}
    var falg = $('input:radio[name="flag"]:checked').val();
    if (falg) {
        if('g' == falg){
            flag = "3";
        }else{
            flag = "1";
        }
    }else{
        var falg = $('input:radio[name="radiReg"]:checked').val();
        if (falg) {
            flag = "1";
            $("#error_flag").hide();
            $("#error_flag").html("");
        }else {
            $("#error_flag").show();
            $("#error_flag").html("请选择会员类型");
            return false;
        }
    }
	$.ajax({
		type : 'post',
		url : base + '/apply/user!checkPhone.action?phone=' + phone + "&memberType="+flag,
		async : false,
		success : function(msg) {
			if (msg != "") {
				$("#phone1").show();
				/*
				 * $("#phone1").html("手机号码已经存在,您可以<a style='color:blue'
				 * href='javascript:void(0)' onclick='doLogin();'>直接登录</a>
				 * 或者通过该手机号<a style='color:blue' href='javascript:void(0)'
				 * onclick='doPwd();'>找回密码</a> ");
				 */
				$("#phone1").html("手机号码已经存在");
				f = false;
			} else {
				$("#phone1").hide();
				$("#phone1").html("");
			}
		},
		error : function() {
			$("#phone1").show();
			$("#phone1").html("验证出错");
			f = false;
		}
	})
	return f;
}
// 输入邮箱
function checkEmail() {
	var flag = "";
	if (PHONE_EMIAL_FALG.isPhone()) {
		return true;
	}
	var f = true;
	var email = $("#email").val();
	var tel = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	if (email == "") {
		$("#email1").show();
		$("#email1").html("请输入邮箱");
		return false;
	}
	if (!tel.test(email)) {
		$("#email1").show();
		$("#email1").html("邮箱格式不正确");
		return false;
	}
    var falg = $('input:radio[name="flag"]:checked').val();
    if (falg) {
        if('g' == falg){
            flag = "3";
        }else{
            flag = "1";
        }
    }else{
        var falg = $('input:radio[name="radiReg"]:checked').val();
        if (falg) {
            flag = "1";
            $("#error_flag").hide();
            $("#error_flag").html("");
        }else{
            $("#error_flag").show();
            $("#error_flag").html("请选择会员类型");
            return false;
		}
    }
	$.ajax({
		type : 'post',
		url : base + '/apply/user!checkName.action?name=' + email + "&memberType="+flag,
		async : false,
		success : function(msg) {
			if (msg != "") {
				$("#email1").show();
				$("#email1").html("邮箱已存在");
				// $("#email1").html(msg);
				f = false;
			} else {
				$("#email1").hide();
				$("#email1").html("");
			}
		},
		error : function() {
			$("#email1").show();
			$("#email1").html("验证出错");
			f = false;
		}
	})
	return f;
}
// 校验验证码
function checkImage() {
	var f = false;
	var checkcode = $("#imgCode").val();
	if (checkcode == "") {
		$("#cuo").show();
		$("#cuo").html("请输入校验验证码");
		return false;
	}
	var A = document.getElementById("imgVerify");
	$.ajax({
		type : "post",
		async : false,
		url : base + '/apply/user!checkRand.action?code=' + checkcode,
		success : function(data) {
			if (data == '1') {
				$("#cuo").show();
				$("#cuo").html("&nbsp;&nbsp;" + "图形验证码必填");
			} else if (data == '2') {
				$("#cuo").show();
				$("#cuo").html("&nbsp;&nbsp;" + "请输入正确图形验证码");
				A.src = base + '/AuthCode?code=' + Math.random();
			} else {
				$("#cuo").hide();
				$("#cuo").html("");
				f = true;
			}

		},
		error : function() {
		}
	});
	return f;
}
// 刷新验证码
function changeImg() {
	var A = document.getElementById("imgVerify");
	var B = document.getElementById("imgCode");
	A.src = base + '/AuthCode?code=' + Math.random();
}
// 页面加载时验证码
$(document).ready(function() {
	$("#phone").change(function() {
		// window.clearInterval(timer);
		document.getElementById("pCode").value = "";
		$('#phoneCode').css("display", "");
		$('#phoneCode2').css("display", "none");
		$("#code1").html("");
	});
	var A = document.getElementById("imgVerify");
	var B = document.getElementById("imgCode");
	A.src = base + '/AuthCode?code=' + Math.random();
})
// 发送短信
function send() {
	$("#email1").html("");
	$("#phone1").html("");

	if (PHONE_EMIAL_FALG.isPhone()) {
		if (checkImage() == false || checkPhone() == false) {
		} else {
			f_timeout();
			/*
			 * 加密工具已经升级了一个版本，目前为 sojson.v5 ，主要加强了算法，以及防破解【绝对不可逆】配置，耶稣也无法100%还原，我说的。;
			 * 已经打算把这个工具基础功能一直免费下去。还希望支持我。
			 * 另外 sojson.v5 已经强制加入校验，注释可以去掉，但是 sojson.v5 不能去掉（如果你开通了VIP，可以手动去掉），其他都没有任何绑定。
			 * 誓死不会加入任何后门，sojson JS 加密的使命就是为了保护你们的Javascript 。
			 * 警告：如果您恶意去掉 sojson.v5 那么我们将不会保护您的JavaScript代码。请遵守规则 */
			 
			;var encode_version = 'sojson.v5', zynpg = '__0x5b0fc',  __0x5b0fc=['D17DmQs=','55yZ5L+V5baq57mx5Y6r6YCy','w5lzw69lAkNCwps2wo3CkC7DoDzCiU9A','MQPCgcOYUw==','ZRbDpzYz','WzwIwqjDpw==','BMKFw4XCnjM=','wrbCpS0BCw==','w6sbdMKNeg==','KFhYD8Ol','wp/CsmXCicKR','wprCgEnCmSk=','wp8hXF5H','agAmwq7Dkw==','woXCoMKdJR4=','EnFCHcOB','eyEYwpfDhg==','cyrDjww9','HGLDnTod','w7w6ScKVWw==','wo0lwodU','SQIiwpHDog==','wrDClEfCiR8=','w5c7WsO7wqXDq2x1Zw==','fmrDmMOqXQ==','wpMqwpNV','fSfCnA==','OGBrGMOG','ZCbCnwrDksKGw4TDrWs=','firCkQrDl8Kb','cidbw7MPwpXCihQ=','OUBo','w4Jswq12','RsK8V8Ko','wqbCmhEl','55yj5LyP5baO57qG5Y626YCB','5ZqE5b+E6aiS6K6K56KP5Lqj6ICB5LiR56ug','5ZqC5byJ6auG6K6r56Gq5LiN5qyy56KC','FsOwGg==','w6ZHMnrDlCoyeGEWQCLDhA==','w7shwr8=','wq10MsOU','XwPDvMOF','InXDqiE=','5ZuL5b626aq06Kye56Cf5LmQ6IKp5LqW56m1','wqoRw5/CgkM=','woXChUvCpBE=','w7zCvMOJWxc=','wozDoQHDvsO4','fMOCLg9D','wprCoxEqIg==','wqfDpBPDoMOZ','wpLCncK/MSk=','woN7OsOkEw==','wowlwrZSwrw=','RhLDpcO8Rg==','woDCqDoqLw==','wo5jAMONEA==','bcKufsKraA==','wr1Rd3DCsQ==','QC7DlTMe','wo5GPcOdIg==','IsOcw5g/w7g=','wpfDgBjDpsOyw5Uh','LcObdMO2w5U=','QQnCnMOVHg==','wrxlCMOSKg==','w7fDqWtqbg==','wrzCqcOPfMOq','VhfDoxwo','YAQzwrbDlQ==','wqZxJsOsJQ==','wpjCocKBETU=','w5U6c3fDmg==','YjLDlRwd','wqrCoG3ChsKJ','wr7CmcO7Z8Of','bcOHAjNC','wofCpcKSCAo=','McKVw5HCoSE=','WhPDnS0j','wpMWw7jCi1M=','wrvCpFjCu8Kz','YwTClSLDlQ==','R8K8bsKuag==','I8OCw4QKw7o=','w4M+RsK0ag==','QgnCrQTDhA==','U3zDo8OITA==','IMOGNsKVMw==','P8Ozw7ERw7k=','w6sTd8ObwrE=','woJgwrZqW1MV','w4TDk0PDqcKlw4VywrFswqPCvDvDm8OCworClwI=','bTrCq8OTHw==','YSrDkwkw','fcOOw79Zwog=','wpxeFsOo','wrXDrMKOLxDCtcOYMDQ=','wo1gwr8=','CMOXN8KoEQ==','cSBHw78J','YzNHw74=','wpQww5bCgGc=','woLCucOBQMOc','wqQ5akpK','FRrCocO7ZQ==','wr/CgcOBf8Of','Pl9fOMO5Szw=','wr3Cn0PCkw==','wrwNw7XCsHlqaA==','wpM9wrhX','w614KcOIwoEJcg==','ZTfCqw==','wq3CgRI6CGxZ','w4MrwqjDp1s=','w5EsV8OtwrrDs2A=','wqvCnA4mFQ==','wokeaG9Swr/Dlw==','AlLDlwLDgx7DgcK1wo8=','wrPDu8KDOQ/CrcOU','w64gRMKE','w7vCkFXCjBTChQPDpMOqwosALxvDolnCpl7DvkkvwoHCoW0uw6/CpV/Dj0oTwqLDgCQvJXJ7a1BqBQRh','DxvDu8OdW2w=','Q8K1VA==','w7kLw7bCpFVpaU4x','wpE9w7HCjWEOwpPChA==','PGDDqw==','XATDoMOG','BATDjyk=','wqfCmUrCiw==','wrxPbmo=','55665L6z5bSx57mD5Y+g6YGn','5Zqc5b626aiL6KyL56GQ5Lik6ICL5LiE56uU','5Zi95b+H6aqV6K6l56Cx5LmU5qyV56Ch','wp4Lwp54w5A=','wrJnE8OzFg==','w5wnTsO2wpY=','w7cbw5fCvGw=','w44MXMKqXg==','IQxJwqgI','HsOldcOUw7k=','wpE4w7TCjVo=','wr7CvcKhKQI=','c8Orw4p7wog=','wrzCgkbCmCA=','KcO9HsKLOA==','S17DgMOfSQ==','wrjDp8KOLjg=','Yio/wrDDnA==','wprCiGfCqRI=','LQXCl8ONVA==','LMKWw7fCozk=','DDBhwpoe','CDlTwpoh','w5cMYFbDtw==','YijDsRAk','Q8Kxw4Jkw7o=','wqPDm8KcDjo=','EHMONQ==','ejPDmwU=','flNeL8OzFg==','RB/DvsOe','6aq/6K+R5YaB6ZWD','XMOkw4x+wr4=','UFopMQc=','MkjDpTHDoA==','w7jCkMO1Ry0=','wpBaMcOzHg==','CzF9wpQ5','SSEkwobDtQ==','eMKFw4lPw5DDkMK+cMK2','w45fw6/DvsOkw6rChhjDvQ==','aDTCqcOLOg==','5Lih6IKN5Ymw6Zqaw6NiQcOhw5nCm8K+dx4=','wo0SYC3DucKS','w4MxwqU=','w4A+w6U=','DcOAaA==','w6JyKcOcwpoN','C0LDpA==','BB5GwroF','IXvDmxHDnQ==','EMOEScOVw74=','LBIMLCo=','wrQlwox/w7Q=','w58UUw==','E8KBw6w=','w5gDfMKPZQ==','KcOeZMObw4A=','C8OWPcKyFw==','fQLDswsB','VCbDkhQw','wqBIwpNtWA==','wroAw6nCmXw=','w4x/w7XDu8OD','w5zDmWZrZA==','w77DlGpoRA==','WRlWw7QJ','wrcPw7PCgmw=','QMKHw6hEw5o=','AsOaFsKUHQ==','TCHCq8OjFA==','Gj7ChsOiXQ==','wpF+dXzCiQ==','TMO5w6hAwoY=','fB/CicOxGg==','RsOhDg1KdBQ=','AmxIJl18MRYCC8OyMFDDkMOjM0U=','QgLDtSQc','esOMw7JTwpk=','wqrCix48AA==','NF5XJA==','QATDtA==','YCBUw7Me','ZinCiQE=','wpsecSHDp8KBYRgn','wo8DdHNP','wpRAAMOrLA==','w5tFw6vDrsO/w63DhwDDqMKaZWTDmDEnKA==','wpDDmsOxPcKLwroOw6AsSsO3w6BFXgh0JcKFwqBbw6xVM8KKWlIMWcOPHnPCh8KDcMKrO8KHw4jChsOeLMOAH8KWwrrDvMK1Il4YwppTPcOxw4zCs8Onw5IEHAcM','wr1VanI=','w55Yw6TDpMOl','YMOSw65Pwpk=','wrxABg==','RMKFw54=','FQDDsA==','bjUh','wpPCv3HChi0=','IGbDvy4L','wprCtVfCpBs=','wp3Ct3vCpsKM','wrhjPMO2Iw==','fT3Cv8ON','wq15PsO6OQ==','wqd1FsOxAQ==','w4lVw7bDuQ==','TR9Tw5Q4','wqEDYHp2','EMKFw4nCsx4=','EMOgRsO7w6U=','wo4/woljw4M=','wqDDo1UjeA==','wrY8ZyzDuw==','wqYTQH5y','K23DlB0t','TyzCpMOoOw==','NFJpPcOQ','K8Kfw4U=','KsOoeA==','OzfCrcOrRQ4=','bsKJw4Zgw7M=','woLDnsK0Ows=','Qy/CpMObKg==','XcOcLwht','dCk0wrvDvw==','woYSUVRk','wqLDtVQ1cQ==','wp3Ck1zCq8KB','w4bCgsOUQDo=','CG3Dsw==','w4xGMQ==','BSPChQ==','w7dYdmk=','LlhePA=='];(function(_0x259d5c,_0x3ca436){var _0x573450=function(_0x29685a){while(--_0x29685a){_0x259d5c['push'](_0x259d5c['shift']());}};var _0x5931b9=function(){var _0x23cf8d={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x47fa11,_0x1e5962,_0x978477,_0x301664){_0x301664=_0x301664||{};var _0x503ad4=_0x1e5962+'='+_0x978477;var _0x5b6d20=0x0;for(var _0x5b6d20=0x0,_0x3344a5=_0x47fa11['length'];_0x5b6d20<_0x3344a5;_0x5b6d20++){var _0x23c5ce=_0x47fa11[_0x5b6d20];_0x503ad4+=';\x20'+_0x23c5ce;var _0x25e3f2=_0x47fa11[_0x23c5ce];_0x47fa11['push'](_0x25e3f2);_0x3344a5=_0x47fa11['length'];if(_0x25e3f2!==!![]){_0x503ad4+='='+_0x25e3f2;}}_0x301664['cookie']=_0x503ad4;},'removeCookie':function(){return'dev';},'getCookie':function(_0x461707,_0x18fdc1){_0x461707=_0x461707||function(_0x3b06be){return _0x3b06be;};var _0x3f3e70=_0x461707(new RegExp('(?:^|;\x20)'+_0x18fdc1['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x322d95=function(_0x403d67,_0x52c8a5){_0x403d67(++_0x52c8a5);};_0x322d95(_0x573450,_0x3ca436);return _0x3f3e70?decodeURIComponent(_0x3f3e70[0x1]):undefined;}};var _0x38779f=function(){var _0x16edb5=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x16edb5['test'](_0x23cf8d['removeCookie']['toString']());};_0x23cf8d['updateCookie']=_0x38779f;var _0xd02110='';var _0x4b8de0=_0x23cf8d['updateCookie']();if(!_0x4b8de0){_0x23cf8d['setCookie'](['*'],'counter',0x1);}else if(_0x4b8de0){_0xd02110=_0x23cf8d['getCookie'](null,'counter');}else{_0x23cf8d['removeCookie']();}};_0x5931b9();}(__0x5b0fc,0x1e3));var _0x5370=function(_0x35bcd8,_0x368c59){_0x35bcd8=_0x35bcd8-0x0;var _0x11e63d=__0x5b0fc[_0x35bcd8];if(_0x5370['initialized']===undefined){(function(){var _0x41b5bb=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x594e5b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x41b5bb['atob']||(_0x41b5bb['atob']=function(_0x2fadc4){var _0x23b73e=String(_0x2fadc4)['replace'](/=+$/,'');for(var _0x3c3f80=0x0,_0x237b5a,_0x559cf9,_0x335a70=0x0,_0x1f0ac6='';_0x559cf9=_0x23b73e['charAt'](_0x335a70++);~_0x559cf9&&(_0x237b5a=_0x3c3f80%0x4?_0x237b5a*0x40+_0x559cf9:_0x559cf9,_0x3c3f80++%0x4)?_0x1f0ac6+=String['fromCharCode'](0xff&_0x237b5a>>(-0x2*_0x3c3f80&0x6)):0x0){_0x559cf9=_0x594e5b['indexOf'](_0x559cf9);}return _0x1f0ac6;});}());var _0xa57640=function(_0x4536ab,_0x212e21){var _0x5ba33e=[],_0x2c7e57=0x0,_0x251e25,_0x40fe77='',_0x18eef0='';_0x4536ab=atob(_0x4536ab);for(var _0x3231d1=0x0,_0x365d32=_0x4536ab['length'];_0x3231d1<_0x365d32;_0x3231d1++){_0x18eef0+='%'+('00'+_0x4536ab['charCodeAt'](_0x3231d1)['toString'](0x10))['slice'](-0x2);}_0x4536ab=decodeURIComponent(_0x18eef0);for(var _0x237887=0x0;_0x237887<0x100;_0x237887++){_0x5ba33e[_0x237887]=_0x237887;}for(_0x237887=0x0;_0x237887<0x100;_0x237887++){_0x2c7e57=(_0x2c7e57+_0x5ba33e[_0x237887]+_0x212e21['charCodeAt'](_0x237887%_0x212e21['length']))%0x100;_0x251e25=_0x5ba33e[_0x237887];_0x5ba33e[_0x237887]=_0x5ba33e[_0x2c7e57];_0x5ba33e[_0x2c7e57]=_0x251e25;}_0x237887=0x0;_0x2c7e57=0x0;for(var _0x36a5ac=0x0;_0x36a5ac<_0x4536ab['length'];_0x36a5ac++){_0x237887=(_0x237887+0x1)%0x100;_0x2c7e57=(_0x2c7e57+_0x5ba33e[_0x237887])%0x100;_0x251e25=_0x5ba33e[_0x237887];_0x5ba33e[_0x237887]=_0x5ba33e[_0x2c7e57];_0x5ba33e[_0x2c7e57]=_0x251e25;_0x40fe77+=String['fromCharCode'](_0x4536ab['charCodeAt'](_0x36a5ac)^_0x5ba33e[(_0x5ba33e[_0x237887]+_0x5ba33e[_0x2c7e57])%0x100]);}return _0x40fe77;};_0x5370['rc4']=_0xa57640;_0x5370['data']={};_0x5370['initialized']=!![];}var _0x159900=_0x5370['data'][_0x35bcd8];if(_0x159900===undefined){if(_0x5370['once']===undefined){var _0x18e0bd=function(_0x290646){this['rc4Bytes']=_0x290646;this['states']=[0x1,0x0,0x0];this['newState']=function(){return'newState';};this['firstState']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['secondState']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x18e0bd['prototype']['checkState']=function(){var _0x3d73eb=new RegExp(this['firstState']+this['secondState']);return this['runState'](_0x3d73eb['test'](this['newState']['toString']())?--this['states'][0x1]:--this['states'][0x0]);};_0x18e0bd['prototype']['runState']=function(_0x302547){if(!Boolean(~_0x302547)){return _0x302547;}return this['getState'](this['rc4Bytes']);};_0x18e0bd['prototype']['getState']=function(_0x11886a){for(var _0x53d4bc=0x0,_0x1ab243=this['states']['length'];_0x53d4bc<_0x1ab243;_0x53d4bc++){this['states']['push'](Math['round'](Math['random']()));_0x1ab243=this['states']['length'];}return _0x11886a(this['states'][0x0]);};new _0x18e0bd(_0x5370)['checkState']();_0x5370['once']=!![];}_0x11e63d=_0x5370['rc4'](_0x11e63d,_0x368c59);_0x5370['data'][_0x35bcd8]=_0x11e63d;}else{_0x11e63d=_0x159900;}return _0x11e63d;};var _0x16c8f4=function(){var _0x560786=!![];return function(_0x2bcd86,_0x229e8d){var _0x108542=_0x560786?function(){if(_0x229e8d){var _0x47ce9e=_0x229e8d['apply'](_0x2bcd86,arguments);_0x229e8d=null;return _0x47ce9e;}}:function(){};_0x560786=![];return _0x108542;};}();var _0x3c1f14=_0x16c8f4(this,function(){var _0x52f960=function(){return'\x64\x65\x76';},_0x2f4299=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x29aa4e=function(){var _0x347660=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x347660['\x74\x65\x73\x74'](_0x52f960['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x311f8b=function(){var _0x44752f=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x44752f['\x74\x65\x73\x74'](_0x2f4299['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x4da8c1=function(_0x1bf51f){var _0x40e17d=~-0x1>>0x1+0xff%0x0;if(_0x1bf51f['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x40e17d)){_0xe176c1(_0x1bf51f);}};var _0xe176c1=function(_0x4aa470){var _0x28569b=~-0x4>>0x1+0xff%0x0;if(_0x4aa470['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x28569b){_0x4da8c1(_0x4aa470);}};if(!_0x29aa4e()){if(!_0x311f8b()){_0x4da8c1('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x4da8c1('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x4da8c1('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x3c1f14();var _0x4b0e04=function(){var _0x31bb2=!![];return function(_0x11ffd2,_0x371401){var _0x4e286b=_0x31bb2?function(){if(_0x371401){var _0x19b85e=_0x371401[_0x5370('0x0','JVE6')](_0x11ffd2,arguments);_0x371401=null;return _0x19b85e;}}:function(){};_0x31bb2=![];return _0x4e286b;};}();(function(){var _0x5d8bdb={'jgxcO':_0x5370('0x1',')XXx'),'NDrXc':_0x5370('0x2','GTzz'),'cFLGH':function _0xb2fc62(_0x2b19cd,_0x38622c){return _0x2b19cd(_0x38622c);},'MSLqv':_0x5370('0x3','Ko9S'),'YMfDC':function _0x611a1e(_0x5f5404,_0x4c149a){return _0x5f5404+_0x4c149a;},'REfvT':_0x5370('0x4',')XXx'),'KrffK':_0x5370('0x5','PlP%'),'rQNyO':function _0x4ea670(_0x3ab92d,_0x56baff){return _0x3ab92d!==_0x56baff;},'KJxyR':_0x5370('0x6','JVE6'),'jcCZv':_0x5370('0x7','D@@z'),'HZuhl':function _0x356ae1(_0x19ca55){return _0x19ca55();},'LbFbO':function _0x38be16(_0xc40c64,_0x308c53){return _0xc40c64!==_0x308c53;},'alSPi':_0x5370('0x8','7qu$'),'FthQu':_0x5370('0x9','J@Bf'),'ibXvF':function _0x2511fa(_0x29cc6b){return _0x29cc6b();},'GNTzU':function _0x50e7c9(_0x1c25c1,_0x507ccf,_0x5200d9){return _0x1c25c1(_0x507ccf,_0x5200d9);}};_0x5d8bdb[_0x5370('0xa','b^9M')](_0x4b0e04,this,function(){var _0x3e1c27=new RegExp(_0x5d8bdb[_0x5370('0xb','ThU5')]);var _0x3fdd4c=new RegExp(_0x5d8bdb[_0x5370('0xc','b^9M')],'i');var _0x2294c=_0x5d8bdb[_0x5370('0xd','rKIV')](_0x1e3cd3,_0x5d8bdb[_0x5370('0xe','JVE6')]);if(!_0x3e1c27[_0x5370('0xf',']X41')](_0x5d8bdb[_0x5370('0x10','O#cB')](_0x2294c,_0x5d8bdb[_0x5370('0x11','JVE6')]))||!_0x3fdd4c[_0x5370('0x12',')XXx')](_0x5d8bdb[_0x5370('0x13',')Pe)')](_0x2294c,_0x5d8bdb[_0x5370('0x14','09*w')]))){if(_0x5d8bdb[_0x5370('0x15','X(AQ')](_0x5d8bdb[_0x5370('0x16','0M[j')],_0x5d8bdb[_0x5370('0x17','8huG')])){_0x5d8bdb[_0x5370('0x18','p1F7')](_0x2294c,'0');}else{var _0x2ea8f8=function(){while(!![]){}};return _0x5d8bdb[_0x5370('0x19','#G@P')](_0x2ea8f8);}}else{if(_0x5d8bdb[_0x5370('0x1a','09*w')](_0x5d8bdb[_0x5370('0x1b','ThU5')],_0x5d8bdb[_0x5370('0x1c',']X41')])){_0x5d8bdb[_0x5370('0x1d','!YJv')](_0x1e3cd3);}else{}}})();}());var _0xb041ff=function(){var _0x14ce6c=!![];return function(_0x4ea0ef,_0x55bb63){var _0x3457fa={'cbkJE':function _0x4be5d5(_0x5442aa,_0x11e23a){return _0x5442aa===_0x11e23a;},'RJYqk':_0x5370('0x1e','X(AQ'),'Jwhbd':_0x5370('0x1f','0M[j'),'xROvH':function _0x123bf2(_0x34a507,_0x1d8c5f){return _0x34a507!==_0x1d8c5f;},'XYdEo':function _0x4a5272(_0x1809d1,_0x2dac1d){return _0x1809d1+_0x2dac1d;},'lcWHY':function _0x520182(_0x3dacfc,_0xeb9cee){return _0x3dacfc/_0xeb9cee;},'aPMQA':_0x5370('0x20','us^['),'kJsCD':function _0x77babc(_0x261dbf,_0x797496){return _0x261dbf%_0x797496;}};if(_0x3457fa[_0x5370('0x21','D@@z')](_0x3457fa[_0x5370('0x22','Z(zX')],_0x3457fa[_0x5370('0x23',']X41')])){if(_0x3457fa[_0x5370('0x24','z]6w')](_0x3457fa[_0x5370('0x25','J@Bf')]('',_0x3457fa[_0x5370('0x26','09*w')](counter,counter))[_0x3457fa[_0x5370('0x27','p1F7')]],0x1)||_0x3457fa[_0x5370('0x28','rKIV')](_0x3457fa[_0x5370('0x29','&2iv')](counter,0x14),0x0)){debugger;}else{debugger;}}else{var _0x2b438c=_0x14ce6c?function(){var _0x2e35df={'fQBTb':function _0x2b2fdb(_0x5b6375,_0x3f850d){return _0x5b6375===_0x3f850d;},'wLXVw':_0x5370('0x2a','ThU5'),'xKQHl':_0x5370('0x2b','ahXa'),'dQQqU':_0x5370('0x2c','us^['),'uhiDs':function _0x187dc8(_0xa71796){return _0xa71796();},'aCRhU':function _0x592214(_0x12f7f8,_0x526165){return _0x12f7f8(_0x526165);},'NqleQ':_0x5370('0x2d','Ko9S'),'uPZBz':_0x5370('0x2e','!YJv'),'FpvPC':function _0x50137d(_0x5d646f,_0x19a544){return _0x5d646f(_0x19a544);},'OAsVW':_0x5370('0x2f','[k8F'),'WQHiV':_0x5370('0x30','O#cB'),'VcZwY':_0x5370('0x31','eRLK')};if(_0x2e35df[_0x5370('0x32','us^[')](_0x2e35df[_0x5370('0x33','*Tsu')],_0x2e35df[_0x5370('0x34','J@Bf')])){if(_0x55bb63){if(_0x2e35df[_0x5370('0x35','X(AQ')](_0x2e35df[_0x5370('0x36','$osm')],_0x2e35df[_0x5370('0x37','QsOm')])){_0x2e35df[_0x5370('0x38','!YJv')](f_timeout);_0x2e35df[_0x5370('0x39','rKIV')]($,_0x2e35df[_0x5370('0x3a','b^9M')])[_0x2e35df[_0x5370('0x3b','09*w')]]();_0x2e35df[_0x5370('0x3c','J@Bf')]($,_0x2e35df[_0x5370('0x3d','Zdfv')])[_0x2e35df[_0x5370('0x3e','!YJv')]](_0x2e35df[_0x5370('0x3f','J@Bf')]);}else{var _0x5ec6e4=_0x55bb63[_0x5370('0x40','*Tsu')](_0x4ea0ef,arguments);_0x55bb63=null;return _0x5ec6e4;}}}else{var _0x236faf=_0x2e35df[_0x5370('0x41','ThU5')][_0x5370('0x42','QsOm')]('|'),_0x1ca48e=0x0;while(!![]){switch(_0x236faf[_0x1ca48e++]){case'0':_0x4afd0a[_0x5370('0x43','IORk')]=func;continue;case'1':_0x4afd0a[_0x5370('0x44','J@Bf')]=func;continue;case'2':_0x4afd0a[_0x5370('0x45','b^9M')]=func;continue;case'3':_0x4afd0a[_0x5370('0x46',')Nk*')]=func;continue;case'4':return _0x4afd0a;case'5':_0x4afd0a[_0x5370('0x47','RURT')]=func;continue;case'6':_0x4afd0a[_0x5370('0x48','IORk')]=func;continue;case'7':_0x4afd0a[_0x5370('0x49','Uc)(')]=func;continue;case'8':var _0x4afd0a={};continue;}break;}}}:function(){};_0x14ce6c=![];return _0x2b438c;}};}();setInterval(function(){var _0x5c58b4={'ePZSP':function _0x5adc0a(_0x3949e0){return _0x3949e0();}};_0x5c58b4[_0x5370('0x4a','!YJv')](_0x1e3cd3);},0xfa0);var _0x153c69=_0xb041ff(this,function(){var _0x4da47a={'jyvNs':function _0x29591c(_0x487d93,_0x45e8a6){return _0x487d93!==_0x45e8a6;},'NFFcH':_0x5370('0x4b','Uc)('),'zWXsj':function _0x1e6db4(_0x15969c,_0x422f0e){return _0x15969c===_0x422f0e;},'XzFtv':_0x5370('0x4c','Uc)('),'ijtvS':function _0x404fc1(_0x26e6b8,_0x4757b2){return _0x26e6b8===_0x4757b2;},'gIout':_0x5370('0x4d',')Pe)'),'zrecX':function _0x149aa4(_0x2e77e2,_0x48ec1c){return _0x2e77e2===_0x48ec1c;},'vqJtb':function _0x36b6ce(_0x1c0b3d,_0x4601af){return _0x1c0b3d!==_0x4601af;},'HQPlP':_0x5370('0x4e','!YJv'),'jwFuf':function _0x4f69ff(_0x1176f5,_0x2400aa){return _0x1176f5==_0x2400aa;},'pXbjA':function _0x217804(_0x54293f){return _0x54293f();},'qpYZB':function _0x4d1be0(_0x4144af,_0x388ccc){return _0x4144af(_0x388ccc);},'LtcHE':_0x5370('0x4f','eRLK'),'SAVkp':_0x5370('0x50','YYyO'),'SppQz':function _0x2696c7(_0xa888e0,_0x1f646f){return _0xa888e0(_0x1f646f);},'EUoZw':_0x5370('0x51','$osm'),'TQZgM':_0x5370('0x52','$osm'),'rhVqt':function _0x42f8e7(_0xd17cf4,_0x42d7df){return _0xd17cf4==_0x42d7df;},'HIbMg':function _0x448d6e(_0x26bbde,_0x593c5a){return _0x26bbde(_0x593c5a);},'rLnMa':_0x5370('0x53','OPYy'),'YdZAt':function _0x53a8a4(_0x318e94,_0x427d2f){return _0x318e94(_0x427d2f);},'YPNEd':_0x5370('0x54','[&S*'),'KRMCq':function _0x29c360(_0x4a5819,_0x2d7c07){return _0x4a5819!==_0x2d7c07;},'NHlVw':_0x5370('0x55','#7L5'),'BHbwT':_0x5370('0x56','Ko9S')};var _0x490aa4=function(){var _0x55efce={'usDAU':function _0x2850bc(_0x1cda23,_0x5a0b0f){return _0x1cda23!==_0x5a0b0f;},'QtnXi':_0x5370('0x57','nOn]'),'xNwke':function _0x326b0b(_0x3b1504,_0xc925cf){return _0x3b1504(_0xc925cf);},'YLNqf':_0x5370('0x58','ahXa'),'TMmcE':_0x5370('0x59','%^wK'),'SKeuD':function _0x227dfe(_0x193cb0,_0x356110){return _0x193cb0(_0x356110);},'wObZi':_0x5370('0x5a','ThU5'),'hnWiq':_0x5370('0x5b','YYyO')};if(_0x55efce[_0x5370('0x5c','vu!p')](_0x55efce[_0x5370('0x5d','b^9M')],_0x55efce[_0x5370('0x5e','&2iv')])){_0x55efce[_0x5370('0x5f','r6wr')]($,_0x55efce[_0x5370('0x60','z]6w')])[_0x55efce[_0x5370('0x61','$osm')]]();_0x55efce[_0x5370('0x62','r6wr')]($,_0x55efce[_0x5370('0x63','Zdfv')])[_0x55efce[_0x5370('0x64','O#cB')]](_0x55efce[_0x5370('0x65','IORk')]);}else{}};var _0x17ebbe=_0x4da47a[_0x5370('0x66','%^wK')](typeof window,_0x4da47a[_0x5370('0x67','$osm')])?window:_0x4da47a[_0x5370('0x68','O#cB')](typeof process,_0x4da47a[_0x5370('0x69','YYyO')])&&_0x4da47a[_0x5370('0x6a','Ko9S')](typeof require,_0x4da47a[_0x5370('0x6b','n@OS')])&&_0x4da47a[_0x5370('0x6c','O#cB')](typeof global,_0x4da47a[_0x5370('0x6d','OPYy')])?global:this;if(!_0x17ebbe[_0x5370('0x6e','r6wr')]){if(_0x4da47a[_0x5370('0x6f','0M[j')](_0x4da47a[_0x5370('0x70',']X41')],_0x4da47a[_0x5370('0x71','O#cB')])){if(y1&&_0x4da47a[_0x5370('0x72','wlIo')](y1,'1')){_0x4da47a[_0x5370('0x73','GTzz')](f_timeout);_0x4da47a[_0x5370('0x74','n@OS')]($,_0x4da47a[_0x5370('0x75','J@Bf')])[_0x4da47a[_0x5370('0x76','JVE6')]]();_0x4da47a[_0x5370('0x77','Zdfv')]($,_0x4da47a[_0x5370('0x78','DODl')])[_0x4da47a[_0x5370('0x79','n@OS')]](_0x4da47a[_0x5370('0x7a','rKIV')]);}else if(_0x4da47a[_0x5370('0x7b','GTzz')](y1,'2')){_0x4da47a[_0x5370('0x7c','z]6w')]($,_0x4da47a[_0x5370('0x7d','Zdfv')])[_0x4da47a[_0x5370('0x7e','X(AQ')]]();_0x4da47a[_0x5370('0x7f','*Tsu')]($,_0x4da47a[_0x5370('0x80','vu!p')])[_0x4da47a[_0x5370('0x81','rKIV')]](_0x4da47a[_0x5370('0x82','Uc)(')]);}else if(_0x4da47a[_0x5370('0x83','YYyO')](y1,'3')){_0x4da47a[_0x5370('0x84','OPYy')]($,_0x4da47a[_0x5370('0x85','QsOm')])[_0x4da47a[_0x5370('0x86','Uc)(')]]();_0x4da47a[_0x5370('0x87','RURT')]($,_0x4da47a[_0x5370('0x88','#7L5')])[_0x4da47a[_0x5370('0x89','OPYy')]](_0x4da47a[_0x5370('0x8a',')Nk*')]);}}else{_0x17ebbe[_0x5370('0x8b','eRLK')]=function(_0x39833c){var _0x2561c5={'dbgjQ':_0x5370('0x8c','r6wr')};var _0x13e58f=_0x2561c5[_0x5370('0x8d',']X41')][_0x5370('0x8e','*Tsu')]('|'),_0x28716f=0x0;while(!![]){switch(_0x13e58f[_0x28716f++]){case'0':var _0x51bdb5={};continue;case'1':return _0x51bdb5;case'2':_0x51bdb5[_0x5370('0x8f','PlP%')]=_0x39833c;continue;case'3':_0x51bdb5[_0x5370('0x90','JVE6')]=_0x39833c;continue;case'4':_0x51bdb5[_0x5370('0x91','Z(zX')]=_0x39833c;continue;case'5':_0x51bdb5[_0x5370('0x92','eRLK')]=_0x39833c;continue;case'6':_0x51bdb5[_0x5370('0x93','#7L5')]=_0x39833c;continue;case'7':_0x51bdb5[_0x5370('0x94',')Pe)')]=_0x39833c;continue;case'8':_0x51bdb5[_0x5370('0x95',')Pe)')]=_0x39833c;continue;}break;}}(_0x490aa4);}}else{if(_0x4da47a[_0x5370('0x96','vu!p')](_0x4da47a[_0x5370('0x97','GTzz')],_0x4da47a[_0x5370('0x98','09*w')])){debugger;}else{var _0x20b27c=_0x4da47a[_0x5370('0x99','us^[')][_0x5370('0x9a','GTzz')]('|'),_0xabc6f5=0x0;while(!![]){switch(_0x20b27c[_0xabc6f5++]){case'0':_0x17ebbe[_0x5370('0x9b','!YJv')][_0x5370('0x9c','b^9M')]=_0x490aa4;continue;case'1':_0x17ebbe[_0x5370('0x9d','vu!p')][_0x5370('0x9e','8huG')]=_0x490aa4;continue;case'2':_0x17ebbe[_0x5370('0x9f','ahXa')][_0x5370('0xa0',']X41')]=_0x490aa4;continue;case'3':_0x17ebbe[_0x5370('0xa1','$osm')][_0x5370('0xa2','nOn]')]=_0x490aa4;continue;case'4':_0x17ebbe[_0x5370('0xa3',')Nk*')][_0x5370('0xa4','$osm')]=_0x490aa4;continue;case'5':_0x17ebbe[_0x5370('0xa5','09*w')][_0x5370('0xa6','[k8F')]=_0x490aa4;continue;case'6':_0x17ebbe[_0x5370('0xa7','Z(zX')][_0x5370('0x93','#7L5')]=_0x490aa4;continue;}break;}}}});_0x153c69();$[_0x5370('0xa8','QsOm')]({'url':base+_0x5370('0xa9','b^9M')+$(_0x5370('0xaa','%^wK'))[_0x5370('0xab','YYyO')]()+_0x5370('0xac','vu!p')+$(_0x5370('0xad','n]F5'))[_0x5370('0xae','ThU5')](),'type':_0x5370('0xaf','%^wK'),'async':![],'success':function(_0x56e126){var _0x3f8e2d={'zWTAe':function _0x35965d(_0x5b76f,_0x3cda31){return _0x5b76f==_0x3cda31;},'GWctC':function _0x1df072(_0xf3a7b9){return _0xf3a7b9();},'ndwhC':function _0x569a78(_0x26533f,_0x47c06f){return _0x26533f(_0x47c06f);},'EOKVN':_0x5370('0xb0','n@OS'),'AFyVq':_0x5370('0xb1','b^9M'),'hscdX':function _0x52f0c4(_0x269c5d,_0x6dc5ad){return _0x269c5d(_0x6dc5ad);},'NZoNL':_0x5370('0xb2','Ko9S'),'ulPiM':_0x5370('0xb3','us^['),'NyBUj':_0x5370('0xb4','X(AQ'),'NBpih':function _0x52f33d(_0x59b0e4,_0x57f151){return _0x59b0e4(_0x57f151);},'sOqDZ':_0x5370('0xb5','p1F7')};if(_0x56e126&&_0x3f8e2d[_0x5370('0xb6','8huG')](_0x56e126,'1')){_0x3f8e2d[_0x5370('0xb7','JVE6')](f_timeout);_0x3f8e2d[_0x5370('0xb8',')Nk*')]($,_0x3f8e2d[_0x5370('0xb9','n]F5')])[_0x3f8e2d[_0x5370('0xba','QsOm')]]();_0x3f8e2d[_0x5370('0xbb','Bg]e')]($,_0x3f8e2d[_0x5370('0xbc','0M[j')])[_0x3f8e2d[_0x5370('0xbd','vu!p')]](_0x3f8e2d[_0x5370('0xbe','Zdfv')]);}else if(_0x3f8e2d[_0x5370('0xbf','PlP%')](_0x56e126,'2')){_0x3f8e2d[_0x5370('0xc0','b^9M')]($,_0x3f8e2d[_0x5370('0xc1','#7L5')])[_0x3f8e2d[_0x5370('0xc2','RURT')]]();_0x3f8e2d[_0x5370('0xc3','Z(zX')]($,_0x3f8e2d[_0x5370('0xbc','0M[j')])[_0x3f8e2d[_0x5370('0xc4','J@Bf')]](_0x3f8e2d[_0x5370('0xc5','b^9M')]);}else if(_0x3f8e2d[_0x5370('0xc6','us^[')](_0x56e126,'3')){_0x3f8e2d[_0x5370('0xc7','X(AQ')]($,_0x3f8e2d[_0x5370('0xc8','Bg]e')])[_0x3f8e2d[_0x5370('0xc9','Bg]e')]]();_0x3f8e2d[_0x5370('0xca','DODl')]($,_0x3f8e2d[_0x5370('0xcb','n@OS')])[_0x3f8e2d[_0x5370('0xcc','D@@z')]](_0x3f8e2d[_0x5370('0xcd','Z(zX')]);}},'error':function(){var _0x553212={'UXRDS':function _0x3ad3a5(_0x51ba9c,_0x5a7ff3){return _0x51ba9c(_0x5a7ff3);},'cJRko':_0x5370('0xce','ggxN'),'UbQVS':_0x5370('0xcf','*Tsu'),'ejAtK':_0x5370('0xd0','!YJv'),'BNWXi':_0x5370('0xd1','%^wK'),'eQtxe':_0x5370('0xd2','ggxN')};_0x553212[_0x5370('0xd3','PlP%')]($,_0x553212[_0x5370('0xd4','ggxN')])[_0x553212[_0x5370('0xd5','[k8F')]]();_0x553212[_0x5370('0xd6','&2iv')]($,_0x553212[_0x5370('0xd7','JVE6')])[_0x553212[_0x5370('0xd8','Bg]e')]](_0x553212[_0x5370('0xd9','J@Bf')]);}});;if(!(typeof encode_version!==_0x5370('0xda','D@@z')&&encode_version===_0x5370('0xdb',')XXx'))){window[_0x5370('0xdc',']X41')](_0x5370('0xdd','J@Bf'));}function _0x1e3cd3(_0x12eb4f){var _0x541e70={'MalvU':function _0x368069(_0x5168c6,_0x5d0880){return _0x5168c6===_0x5d0880;},'FQovn':_0x5370('0xde','#G@P'),'KnwWI':function _0x3976d4(_0x299fff,_0xdba05f){return _0x299fff!==_0xdba05f;},'PyFFA':_0x5370('0xdf','nOn]'),'sAhRZ':function _0x4a2cc7(_0xf33312){return _0xf33312();},'AGKtl':function _0x23f323(_0x5bfc3c,_0x311513){return _0x5bfc3c!==_0x311513;},'ebrZj':_0x5370('0xe0','n]F5'),'qOpvH':_0x5370('0xe1','0M[j'),'cJGwL':function _0x3ee207(_0x11b1e5,_0xb77e7b){return _0x11b1e5+_0xb77e7b;},'MKcdr':function _0x27ec5b(_0x40a2de,_0x311ee1){return _0x40a2de/_0x311ee1;},'hmhAz':_0x5370('0xe2','ahXa'),'MlEnl':function _0x1d0b44(_0x308117,_0x55e7e6){return _0x308117===_0x55e7e6;},'nhCIk':function _0x4b0587(_0x5a9b7a,_0xe9ab50){return _0x5a9b7a%_0xe9ab50;},'EygZZ':function _0x25a8d4(_0xf5f722,_0x6cc6a3){return _0xf5f722(_0x6cc6a3);},'EEvzk':_0x5370('0xe3','[k8F'),'uGEHT':function _0xfc4f28(_0x5ae322,_0x3791a1){return _0x5ae322(_0x3791a1);}};function _0x1dc816(_0x49fb9c){if(_0x541e70[_0x5370('0xe4','Bg]e')](typeof _0x49fb9c,_0x541e70[_0x5370('0xe5','[k8F')])){if(_0x541e70[_0x5370('0xe6','0M[j')](_0x541e70[_0x5370('0xe7','[&S*')],_0x541e70[_0x5370('0xe8','8huG')])){while(!![]){}}else{var _0x30d82a=function(){var _0x4cd3dc={'WIYsJ':function _0x5262df(_0x3473e8,_0x21ee25){return _0x3473e8===_0x21ee25;},'rtZYw':_0x5370('0xe9',')Nk*'),'gdhoa':_0x5370('0xea','X(AQ'),'oXLkE':function _0x2d8f12(_0x23d946,_0x44504d){return _0x23d946(_0x44504d);}};if(_0x4cd3dc[_0x5370('0xeb','QsOm')](_0x4cd3dc[_0x5370('0xec','0M[j')],_0x4cd3dc[_0x5370('0xed','#7L5')])){_0x4cd3dc[_0x5370('0xee','*Tsu')](_0x1dc816,0x0);}else{while(!![]){}}};return _0x541e70[_0x5370('0xef','n@OS')](_0x30d82a);}}else{if(_0x541e70[_0x5370('0xf0','eRLK')](_0x541e70[_0x5370('0xf1','vu!p')],_0x541e70[_0x5370('0xf2',')XXx')])){if(_0x541e70[_0x5370('0xf3','wlIo')](_0x541e70[_0x5370('0xf4','wlIo')]('',_0x541e70[_0x5370('0xf5',')Pe)')](_0x49fb9c,_0x49fb9c))[_0x541e70[_0x5370('0xf6','vu!p')]],0x1)||_0x541e70[_0x5370('0xf7','D@@z')](_0x541e70[_0x5370('0xf8','#7L5')](_0x49fb9c,0x14),0x0)){debugger;}else{debugger;}}else{}}_0x541e70[_0x5370('0xf9',']X41')](_0x1dc816,++_0x49fb9c);}try{if(_0x12eb4f){return _0x1dc816;}else{if(_0x541e70[_0x5370('0xfa','us^[')](_0x541e70[_0x5370('0xfb','Ko9S')],_0x541e70[_0x5370('0xfc','PlP%')])){_0x541e70[_0x5370('0xfd',']X41')](_0x1dc816,0x0);}else{that[_0x5370('0xfe','z]6w')]=function(_0x20034e){var _0xb6ef62={'PXJDX':_0x5370('0xff','ggxN')};var _0x38dc0d=_0xb6ef62[_0x5370('0x100','*Tsu')][_0x5370('0x101','PlP%')]('|'),_0x4283a7=0x0;while(!![]){switch(_0x38dc0d[_0x4283a7++]){case'0':_0x555c0b[_0x5370('0x102','$osm')]=_0x20034e;continue;case'1':var _0x555c0b={};continue;case'2':_0x555c0b[_0x5370('0x103','!YJv')]=_0x20034e;continue;case'3':_0x555c0b[_0x5370('0x104','%^wK')]=_0x20034e;continue;case'4':_0x555c0b[_0x5370('0x105',')Pe)')]=_0x20034e;continue;case'5':_0x555c0b[_0x5370('0x106','Uc)(')]=_0x20034e;continue;case'6':_0x555c0b[_0x5370('0x107','#G@P')]=_0x20034e;continue;case'7':return _0x555c0b;case'8':_0x555c0b[_0x5370('0x108','09*w')]=_0x20034e;continue;}break;}}(func);}}}catch(_0xb120bb){}};encode_version = 'sojson.v5';
		}
	} else {
		if (checkImage() == false || checkEmail() == false) {
		} else {
			f_timeout();
			$.ajax({
				url : base + '/apply/user!sendAuthCode.action?email='
						+ $("#email").val() + '&name=' + $("#username").val(),
				type : 'post',
				async : false,
				success : function(data) {
					if (data && data == "1") {
						f_timeout();
						$("#cuo").show();
						$("#cuo").html("邮件已经发送");
					}
				},
				error : function() {
					$("#cuo").hide();
					$("#code1").html("验证出错");
				}
			});
		}
	}
}

function f_timeout() {
	//changeImg();
	$('#phoneCode').css("display", "none");
	$('#phoneCode2').css("display", "");
	$('#phoneCode2').html(
			'<span id="timeb2" style="color:red"> 120 </span>秒后重新获取 ');
	timer = self.setInterval(addsec, 1000);
}

function addsec() {
	var t = $('#timeb2').html();
	if (t > 0) {
		$('#timeb2').html(t - 1);
	} else {
		window.clearInterval(timer);
		$('#phoneCode').css("display", "");
		$('#phoneCode2').css("display", "none");
	}
}
function closeTimer() {
	if (timer) {
		window.clearInterval(timer);
		$('#phoneCode').css("display", "");
		$('#phoneCode2').css("display", "none");
	}
}
// 校验手机短信的验证码
function checkCode() {
	if (PHONE_EMIAL_FALG.isPhone()) {
		if ($("#pCode").val() == "") {
			$("#code1").show();
			$("#code1").html("请输入短信验证码");
			return false;
		}
		var f = false;
		$.ajax({
			type : 'post',
			url : base + '/apply/user!checkAuto.action?pCode='
					+ $("#pCode").val() + "&phone=" + $("#phone").val(),
			dataType : "html",
			async : false,
			success : function(msg) {
				data = msg.replace(/[\r\n]/g, ""); // 去掉回车换行
				if (data != "" && data != null) {
					$("#code1").show();
					$("#code1").html(msg);
					f = false;
				} else {
					$("#code1").hide();
					$("#code1").html("");
					f = true;
				}
			},
			error : function() {
				$("#code1").show();
				$("#code1").html("验证出错");
				f = false;
			}
		});
		return f;
	} else {
		if ($("#pCode").val() == "") {
			$("#code1").show();
			$("#code1").html("请输入邮箱验证码");
			return false;
		}
		var f = false;
		$.ajax({
			type : 'post',
			url : base + '/apply/user!check.action?code=' + $("#pCode").val()
					+ "&email=" + $("#email").val(),
			dataType : "html",
			async : false,
			success : function(msg) {
				data = msg.replace(/[\r\n]/g, ""); // 去掉回车换行
				if (data != "" && data != null) {
					$("#code1").show();
					$("#code1").html(msg);
					f = false;
				} else {
					$("#code1").hide();
					$("#code1").html("");
					f = true;
				}
			},
			error : function() {
				$("#code1").show();
				$("#code1").html("验证出错");
				f = false;
			}
		});
		return f;
	}
}
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

function upEmail() {
	PHONE_EMIAL_FALG.change();
	changeImg();
	if (PHONE_EMIAL_FALG.isEmail()) {
		$("#ifPhoneOrEmail").html("邮箱验证码：");
		$("#cEmail").show();
		$("#cPhone").hide();
	} else {
		$("#ifPhoneOrEmail").html("手机验证码：");
		$("#cPhone").show();
		$("#cEmail").hide();
	}
	closeTimer();
}
function ifflag() {
	var falg = $('input:radio[name="radiReg"]:checked').val();
	if (falg) {
	    $("#error_flag").hide();
	    $("#error_flag").html("");
	    return true;
	}
	$("#error_flag").show();
	$("#error_flag").html("请选择用户类型");
	return false;
}