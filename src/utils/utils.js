import axios from "axios";
import Vue from "vue";
import { MessageBox, Indicator } from "mint-ui";
import { Toast } from "mint-ui";


$.fn.extend({
	insertAtCaret: function(myValue) {
		//console.info("myValue----" + myValue);
		//console.info(this);
		var $t = $(this)[0];
		// console.info($t);
		//console.info($t.selectionStart);
		if (document.selection) {
			this.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
			this.focus();
		} else
		if ($t.selectionStart || $t.selectionStart == "0") {
			var startPos = $t.selectionStart;
			var endPos = $t.selectionEnd;
			var scrollTop = $t.scrollTop;
			$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
			this.focus();
			$t.selectionStart = startPos + myValue.length;
			$t.selectionEnd = startPos + myValue.length;
			$t.scrollTop = scrollTop;
		} else {
			this.value += myValue;
			this.focus();
		}
	}
});



Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};

// 时间公用函数
// class Store {
export const FormatDate = function(date) {
	return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
};


//获取下一环节信息
export const getNextActInfo = function(param, callBack) {
	axios.post(baseUrl() + "/workflow/getNextActInfo", param).then((res) => {
		callBack(res.data);
	});
};
//获取流转历史记录
export const getHistoricTask = function(procDefId, procInstId, callBack) {
	axios.get(baseUrl() + "/workflow/getHistoricTask", { params: { procDefId: procDefId, procInstId: procInstId } }).then((res) => {
		callBack(res.data);
	});
};

export const baseUrl = function() {

	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	//alert(pathName);
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName
		.substring(0, pathName.substr(1).indexOf("/") + 1);
	//return (localhostPaht + projectName);
	// return 'http://localhost:88/jpro';
	// return 'http://oa.sxtdwb.com:9090/sxwb';
	// return 'http://hbxmgl.ccggd.com:8080/zmjn'
	// return 'http://wx.sxtxtdwb.com:9090/sxwb'
	return util.getBaseUrl();
};

// 金额小写到大写转换
export const amountLtoU = function(num) {
	///<summery>小写金额转化大写金额</summery>
	///<param name=num type=number>金额</param>
	if (isNaN(num)) return "无效数值！";
	var strPrefix = "";
	if (num < 0) strPrefix = "(负)";
	num = Math.abs(num);
	if (num >= 1000000000000) return "无效数值！";
	var strOutput = "";
	var strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
	var strCapDgt = "零壹贰叁肆伍陆柒捌玖";
	num += "00";
	var intPos = num.indexOf(".");
	if (intPos >= 0) {
		num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
	}
	strUnit = strUnit.substr(strUnit.length - num.length);
	for (var i = 0; i < num.length; i++) {
		strOutput += strCapDgt.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
	}
	return strPrefix + strOutput.replace(/零角零分$/, "整").replace(/零[仟佰拾]/g, "零").replace(/零{2,}/g, "零").replace(/零([亿|万])/g, "$1").replace(/零+元/, "元").replace(/亿零{0,3}万/, "亿").replace(/^元/, "零元");
};
//获取url中参数
export const getArgFromHref = function(argName) {
	var shref = window.location.href.split("#")[0];
	var args = shref.split("?");
	var retval = "";
	//参数为空
	if (args[0] == shref) {
		return retval;
	}
	var str = args[1];
	args = str.split("&");
	for (var i = 0; i < args.length; i++) {
		str = args[i];
		var arg = str.split("=");
		if (arg.length <= 1) continue;
		if (arg[0] == argName) retval = arg[1];
	}
	return retval;
};

//深度克隆方法
export const cloneObj = obj => {
	var str, newobj = obj.constructor === Array ? [] : {};
	if (typeof obj !== "object") {
		return;
	} else if (window.JSON) {
		str = JSON.stringify(obj), //系列化对象
		newobj = JSON.parse(str); //还原
	} else {
		for (var i in obj) {
			newobj[i] = typeof obj[i] === "object" ?
				cloneObj(obj[i]) : obj[i];
		}
	}
	return newobj;
};


export const getAjax = (url, obj, param, callBack) => {
	axios.get(url, { params: param }).then((res) => {

		callBack(res);
	});
};

export const Cookies = function() {
	this.set = function(name, value, expire) {
		//alert(name+"---"+value);
		window.localStorage.setItem(name, value);
		return null;

	};

	this.get = function(name) {
		return window.localStorage.getItem(name);


	};

	this.clear = function(name) {
		window.localStorage.removeItem(name);
		return;

	};
	this.clearAll = function() {
		window.localStorage.clear();
	};
};
export const cookieUtil = new Cookies();



export const Util = function(res) {
	var util_this = this;
	this.pageSize = 20;
	this.vue = null;
	this.const = {};
	this.flag = false;

	this.defaultCorpId = "ww159b657dbf96b5c3";
	this.amapKey = "82c91102377a644ef3af68a674c6e8bb";
	this.setConst = function(key, value) {
		this.const[key] = value;
	};
	this.getConst = function(key) {
       
		if (this.const[key] != undefined) {
			return this.const[key];
		}
		return null;
	};
	this.isNotEmpty = function(res) {
		if (res !== undefined && res !== "" && res !== null) {
			return true;
		} else {
			return false;
		}
	};
	this.mask = function(msg) {
		/*Indicator.open({
            text: msg == null || msg == '' ? '正在加载...' : msg,
            spinnerType: 'fading-circle'
        });*/
		if (msg == null) {
			Vue.$vux.loading.show();
		} else {
			Vue.$vux.loading.show({
				text: msg == null || msg == "" ? "正在加载..." : msg
			});
		}

	};
	this.unmask = function() {
		//Indicator.close();
		Vue.$vux.loading.hide();
	};

	this.toast = function(msg, type, duration) {
		var obj = { text: msg };
		if (this.isNotEmpty(type)) {
			obj["type"] = type;
		}
		if (this.isNotEmpty(duration)) {
			obj["time"] = duration;
		}
		Vue.$vux.toast.show(obj);
	};
	this.successToast = function(msg, duration) {
		this.toast(msg, "success", duration);
	};
	this.failueToast = function(msg, duration) {
		this.toast(msg, "warn", duration);
	};
	this.cancleToast = function(msg, duration) {
		this.toast(msg, "cancle", duration);
	};
	this.getUrlParam = function(argName) {
		var reg = new RegExp("(^|\\?|&)" + argName + "=([^&]*)(\\s|&|$)", "i");
		if (reg.test(window.location.href))
			return unescape(RegExp.$2.replace(/\+/g, " "));
		return "";
	};
	this.alert = function(msg) {
		// Vue.$vux.alert.show({
		//     content: msg,
		// });
		MessageBox("提示", msg);
	};
	this.confirm = function(msg, callBack) {
		/* Vue.$vux.confirm.show({
			// 组件除show外的属性
			content: msg,
			onCancel() {
				Vue.$vux.confirm.hide();
			},
			onConfirm() {
				callBack();
			}
		}); */
		MessageBox.confirm(msg).then(() => {
			callBack();
		}).catch(()=>{
			
		});
	};
	this.getAccessSecurt = function() {

		var corp_id = window.corp_id;
		//console.info("corp_id---------"+corp_id);
		var userUid = cookieUtil.get("access_corp_securt" + "@" + corp_id);
		return userUid;
	};
	this.getSessionData = function() {
    //debugger
    // console.log(window,999)
		var code = window.access_code;
		var suite_id = window.suite_id;
		var corp_id = window.corp_id;
		var userUid = cookieUtil.get("access_corp_securt" + "@" + corp_id);
		if (!validUtil.isNotEmpty(userUid)) {
			var access_securt = window.access_securt;
			if (validUtil.isNotEmpty(access_securt)) {
				userUid = access_securt;
			}
		}
		if (validUtil.isNotEmpty(userUid)) {
			var cookieVal = cookieUtil.get("access_corp_session" + "@" + corp_id);
			//  console.log("cookieVal",cookieVal)
			//this.successToast("cookieVal---" + cookieVal);
			//console.info("cookieVal:" + this.isNotEmpty(cookieVal));
			if (validUtil.isNotEmpty(cookieVal)) {
				var cookieObj = JSON.parse(cookieVal);
				var createTimeStr = cookieObj["time"];
				var expire = cookieObj["expire"];
				var createTime = new Date(createTimeStr);

				var nowTime = new Date();
				var times = nowTime.getTime() - createTime.getTime();
				var expireTimes = (parseInt(expire) - 20 * 60) * 1000; //允许误差20分钟
				if (times < expireTimes) {
					return cookieObj;
				} else {
					//重新获取token
					return this.getSessionDataFromServer(suite_id, corp_id, null, userUid);
				}
			} else {
				//重新获取token
				return this.getSessionDataFromServer(suite_id, corp_id, null, userUid);
			}
		} else {

			if (this.isNotEmpty(code)) {
				return this.getSessionDataFromServer(suite_id, corp_id, code, null);
			} else {
				this.alert("无法访问服务器！");
			}

		}
	};
	this.clearCookie = function() {

		cookieUtil.clear("access_corp_securt" + "@" + window.corp_id);
		cookieUtil.clear("access_corp_session" + "@" + window.corp_id);
		// cookieUtil.clearAll();
	},
	this.refreshSession = function() {
		this.clearCookie();
		return;
		var suite_id = window.suite_id;
		var corp_id = window.corp_id;
		var code = window.access_code;
		var userUid = this.getAccessSecurt();
		return this.getSessionDataFromServer(suite_id, corp_id, code, userUid, true);
	};
	this.getSessionDataFromServer = function(suite_id, corp_id, code, userUid, ifRefresh) {
	//	console.log("suite_id",suite_id);
		var _this = this;
		var data = null;
		if (!this.isNotEmpty(ifRefresh)) {
			ifRefresh = false;
		}
		$.ajax({
			url: this.getBaseUrl() + "/wx/weChatAction!getToken.action",
			timeout: 30000,
			async: false,
			type: "POST",
			dataType: "json",
			data: { ifRefresh: ifRefresh, access_agent: window.agent_id, access_company: window.company_id, suite_id: suite_id, access_corp: corp_id, access_code: code, access_securt: userUid, access_pwd: "A46D9C656F790E761CEF116018E4DACCA72B4C9393E8A7", access_ak: "62431D6681205767A46D9C656F79761CEF116018E4DACCA72B4B2C9393E8A7" },
			success: function(result) {
				// console.log(result)
				if (result != null) {
					//var token = result['access_token'];
					//var expire = result['expire'];
					if (result["status"] == 200) {
						//cookieUtil.set(code, JSON.stringify({ access_token: token, expire: expire, createTime: result['createTime'] }));
						//console.info(result['data']);
						result["data"]["access_token"] = result["data"]["token"];
						//console.info(result);
						userUid = result["data"]["user"]["userId"];
						cookieUtil.set("access_corp_securt" + "@" + (_this.isNotEmpty(corp_id) ? corp_id : ""), userUid, 24 * 60 * 60);
						cookieUtil.set("access_corp_session" + "@" + (_this.isNotEmpty(corp_id) ? corp_id : ""), JSON.stringify(result["data"]), 2 * 60 * 60);
						data = result["data"];
					}else if(result["status"] == 401){
						//d  console.log{}
						_this.alert(result.errorMsg);
					}

				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {

				_this.unmask();

			}
		});
		return data;
	};
	this.getAccessToken = function() {
		// var session = this.getSessionData();
		// console.log(session)
		if (session != null) {
			return session["access_token"];
		}
		return null;
	};
	this.extend = function(o, n) {
		for (var p in n) {
			if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p)))
				o[p] = n[p];
		}
		return o;
	};
	this.extendAll =function(o,n){
		for (var p in n) {
			if (n.hasOwnProperty(p) )o[p] = n[p];
		}
		return o;
	};
	this.extendCover=function (o,n) {
		for (var p in n) {
			if (n.hasOwnProperty(p) && (o.hasOwnProperty(p)))
				o[p] = n[p];
		}
		return o;
	};
	this.get = function(url, param, callBack) {
		if (param == null) {
			param = {};
		}
		param["access_token"] = this.getAccessToken();
		param["company_id"] = sessionUtil.getCompanyId();

		param["access_corp"] = window.corp_id;
		param["access_agent"] = window.agent_id;
		$.ajax({
			url: this.getBaseUrl() + url,
			timeout: 60000,
			async: true,
			type: "GET",
			dataType: "json",
			data: param,
			success: function(result) {
				if (callBack != undefined && callBack != null)(callBack(result));
			}
		});
	};

	this.clone = function(source, dest) {
		if (source == undefined || source == null) {
			return dest;
		}
		if (dest == undefined || dest == null) {
			dest = new Object();
		}
		for (var p in source) {
			var name = p; //属性名称 
			if (name == "ID_" || name == "children") {
				continue;
			}
			var value = source[p]; //属性对应的值 
			dest[name] = value;
		}
	},
	this.deepCopy= function  (source) {
		var result = [];
		//var result = {}
		for (var key in source) {
			if (source[key] instanceof Array) {
				if (source[key].length > 0) {
					result[key] = typeof source[key] === "object"
						? this.deepCopy(source[key])
						: source[key];
				}
			} else {
				if (source[key]) {
					result[key] = typeof source[key] === "object"
						? this.deepCopy(source[key])
						: source[key];
				}
			}
		}
		return result;
	},
	this.post = function(url, param, callBack, errorCallback) {
		this.mask("正在拼命加载...");
		if (param == null) {
			param = {};
		}
		if (this.isNotEmpty(window.suite_id)) {
			param.suite_id = window.suite_id;
		}
		if (this.isNotEmpty(window.corp_id)) {
			param.corp_id = window.corp_id;
		}
		//this.successToast(window.suite_id+"==="+window.corp_id);
		param["access_token"] = this.getAccessToken();
		param["company_id"] = sessionUtil.getCompanyId();

		param["access_corp"] = window.corp_id;
		param["access_agent"] = window.agent_id;
		//this.successToast(window.corp_id+"==="+param['access_token']);
		var _this = this;
		// console.log("-----this.getBaseUrl()", this.getBaseUrl())
		$.ajax({
			url: this.getBaseUrl() + url,
			timeout: 60000,
			async: true,
			type: "POST",
			dataType: "json",
			data: param,
			success: function(result) {
				_this.unmask();
				if (callBack != undefined && callBack != null) { callBack(result); }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (errorCallback != undefined && errorCallback != null) {
					errorCallback(result);
				} else {
					_this.unmask();
				}
			}
		});
	};

	this.sycnPost = function(url, param, callBack) {
		if (param == null) {
			param = {};
		}
		param["access_token"] = this.getAccessToken();
		param["company_id"] = sessionUtil.getCompanyId();

		param["access_corp"] = window.corp_id;
		param["access_agent"] = window.agent_id;
		$.ajax({
			url: this.getBaseUrl() + url,
			timeout: 60000,
			async: false,
			type: "POST",
			dataType: "json",
			data: param,
			success: function(result) {
				if (callBack != undefined && callBack != null)(callBack(result));
			}
		});
	};
	this.loadDic = function(param, callBack) {
		this.post("/admin/appDicAction!getDicItems.action", param, function(result) {
			if (result != null) {
				callBack(result);
			} else {
				callBack(null);
			}
		});
	};
	this.initData = function(param, callBack) {
		this.post("/admin/appDefaultFormAction!initData.action", param, function(result) {
			if (result != null) {
				callBack(result);
			} else {
				callBack(null);
			}
		});
	};
	this.deleteData = function(id, sqlTable, callBack) {
		var _this = this;
		var params = { sqlTableName: sqlTable, ids: id, flag: 2 };
		_this.post("/admin/appDefaultFormAction!removeData.action", params, function(res) {
			if (res != undefined && res != null) {
					
				if (res.success) {
					//_this.util.successToast("操作成功！");
					if (callBack != undefined && callBack != null) { callBack(res); } else {
						_this.successToast("操作成功！");
					}
				} else {
					_this.failueToast("操作失败：" + (res.errorMsg?res.errorMsg:res.msg));
					console.log(res.errorMsg?res.errorMsg:res.msg)
				}
			}

			_this.unmask();
		});
	};
	this.gotoByName = function(name, query) {
		this.mask("正在拼命加载...");
        
		if (query != undefined && query != null) {
			this.vue.$router.push({ name: name, query: query });
		} else {
			this.vue.$router.push({ name: name });
		}

	};
	this.gotoByPath = function(path, query) {
		//console.info(query);
		this.mask("正在拼命加载...");
		if (query != undefined && query != null) {
			this.vue.$router.push({ path: path, query: query });
		} else {
			this.vue.$router.push({ path: path });
		}
	};
	this.init = function(obj) {
		//console.log(this)
		this.vue = obj;
		this.unmask();
	};
	this.getBaseUrl = function() {

		// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
		var curWwwPath = window.document.location.href;
		//console.info("curWwwPath--" + curWwwPath);
		// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
		var pathName = window.document.location.pathname;
		//console.info("pathName--" + pathName);
		var pos = curWwwPath.indexOf(pathName);
		// 获取主机地址，如： http://localhost:8083
		var localhostPaht = curWwwPath.substring(0, pos);
		//console.info("localhostPaht--" + localhostPaht);
		// 获取带"/"的项目名，如：/uimcardprj
		var projectName = pathName.substring(0, pathName.substr(1).indexOf("/") + 1);
		// console.info(projectName);
		// return (localhostPaht + projectName);
		//	return "http://58.16.2.178:8089/jydl/";
		//return "http://gcpms.zjgckg.com:8080/GCPMS";
		// return "http://epm.jrsoft.cc:8095/sxwb";
		// return "http://wx.sxtdwb.com:9090/sxwb";
		// return "http://oa.sxtdwb.com:9090/sxwb";
	// return 'http://hbxmgl.ccggd.com:8080/zmjn'
	return 'http://wx.sxtxtdwb.com:9090/sxwb'
	// return 'http://www.gzshyjs.com/gzhy'
	};

	this.initUrlParam = function(obj) {
		var isReadOnlyParam = this.getUrlParam("isReadOnly");
		obj.isReadOnly = (validUtil.isNotEmpty(isReadOnlyParam) && isReadOnlyParam == "true") ? true : false;
		obj.procDefId = this.getUrlParam("_procDefId");
		obj.procInstId = this.getUrlParam("_procInstId");
		obj.taskId = this.getUrlParam("_taskId");
		obj.currentActId = this.getUrlParam("_currentActId");
		obj.taskType = this.getUrlParam("_taskType");
		obj.status = this.getUrlParam("_taskStatus");
		obj.id = this.getUrlParam("id");

	};
	this.setTemp = function(_this, obj) {
		_this.$store.state.temp = obj;
	};
	this.getTemp = function(_this) {
		return _this.$store.state.temp;
	};
	/**
     * "2012-9-20 19:46:18"
     */
	this.strToDate = function(strDate) {
		var st = strDate;
		var a = st.split(" ");
		var b = a[0].split("-");
		var c = a[1].split(":");
		var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2]);
		return date;
	};

	/**
     * 微信接口授权
     */
	this.initWxJsSdkConfig = function(vue, wxurl, jsApiList) {
		var _this = this;
		this.post("/wx/weChatAction!getWxPageConfig.action", { url: wxurl }, function(result) {
			vue.wx.config({
				beta: true,
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: _this.isNotEmpty(window.corp_id) ? window.corp_id : _this.defaultCorpId, // 必填，企业号的唯一标识，此处填写企业号corpid
				timestamp: result.data.timestamp, // 必填，生成签名的时间戳
				nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
				signature: result.data.signature, // 必填，签名，见附录1
				jsApiList: jsApiList, // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			
			vue.wx.error(function(res){
				console.log('wwwww',res)
			});
		});
	};
	this.initWxJsSdk = function(vue) {
		var wxurl = window.location.href.split("#")[0];
		this.initWxJsSdkConfig(vue, wxurl, ["hideOPtionMenu", "getLocation", "chooseImage", "uploadImage", "previewImage", "openEnterpriseContact", "startRecord", "stopRecord", "uploadVoice"]);
	};
	//加密参数
	var _des_keys = ["www", "cryjs", "com"];
	this._encode = function(enStr) {
		return util_this.strEnc(enStr, _des_keys[0], _des_keys[1], _des_keys[2]);
	};
	this.strEnc = function(data, firstKey, secondKey, thirdKey) {

		var leng = data.length;
		var encData = "";
		var firstKeyBt, secondKeyBt, thirdKeyBt, firstLength, secondLength, thirdLength;
		if (firstKey != null && firstKey != "") {
			firstKeyBt = util_this.getKeyBytes(firstKey);
			firstLength = firstKeyBt.length;
		}
		if (secondKey != null && secondKey != "") {
			secondKeyBt = util_this.getKeyBytes(secondKey);
			secondLength = secondKeyBt.length;
		}
		if (thirdKey != null && thirdKey != "") {
			thirdKeyBt = util_this.getKeyBytes(thirdKey);
			thirdLength = thirdKeyBt.length;
		}

		if (leng > 0) {
			if (leng < 4) {
				var bt = util_this.strToBt(data);
				var encByte;
				if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
					var tempBt;
					var x, y, z;
					tempBt = bt;
					for (x = 0; x < firstLength; x++) {
						tempBt = util_this.enc(tempBt, firstKeyBt[x]);
					}
					for (y = 0; y < secondLength; y++) {
						tempBt = util_this.enc(tempBt, secondKeyBt[y]);
					}
					for (z = 0; z < thirdLength; z++) {
						tempBt = util_this.enc(tempBt, thirdKeyBt[z]);
					}
					encByte = tempBt;
				} else {
					if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
						var tempBt;
						var x, y;
						tempBt = bt;
						for (x = 0; x < firstLength; x++) {
							tempBt = util_this.enc(tempBt, firstKeyBt[x]);
						}
						for (y = 0; y < secondLength; y++) {
							tempBt = util_this.enc(tempBt, secondKeyBt[y]);
						}
						encByte = tempBt;
					} else {
						if (firstKey != null && firstKey != "") {
							var tempBt;
							var x = 0;
							tempBt = bt;
							for (x = 0; x < firstLength; x++) {
								tempBt = util_this.enc(tempBt, firstKeyBt[x]);
							}
							encByte = tempBt;
						}
					}
				}
				encData = util_this.bt64ToHex(encByte);
			} else {
				var iterator = parseInt(leng / 4);
				var remainder = leng % 4;
				var i = 0;
				for (i = 0; i < iterator; i++) {
					var tempData = data.substring(i * 4 + 0, i * 4 + 4);
					var tempByte = util_this.strToBt(tempData);
					var encByte;
					if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
						var tempBt;
						var x, y, z;
						tempBt = tempByte;
						for (x = 0; x < firstLength; x++) {
							tempBt = util_this.enc(tempBt, firstKeyBt[x]);
						}
						for (y = 0; y < secondLength; y++) {
							tempBt = util_this.enc(tempBt, secondKeyBt[y]);
						}
						for (z = 0; z < thirdLength; z++) {
							tempBt = util_this.enc(tempBt, thirdKeyBt[z]);
						}
						encByte = tempBt;
					} else {
						if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
							var tempBt;
							var x, y;
							tempBt = tempByte;
							for (x = 0; x < firstLength; x++) {
								tempBt = util_this.enc(tempBt, firstKeyBt[x]);
							}
							for (y = 0; y < secondLength; y++) {
								tempBt = util_this.enc(tempBt, secondKeyBt[y]);
							}
							encByte = tempBt;
						} else {
							if (firstKey != null && firstKey != "") {
								var tempBt;
								var x;
								tempBt = tempByte;
								for (x = 0; x < firstLength; x++) {
									tempBt = util_this.enc(tempBt, firstKeyBt[x]);
								}
								encByte = tempBt;
							}
						}
					}
					encData += util_this.bt64ToHex(encByte);
				}
				if (remainder > 0) {
					var remainderData = data.substring(iterator * 4 + 0, leng);
					var tempByte = util_this.strToBt(remainderData);
					var encByte;
					if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
						var tempBt;
						var x, y, z;
						tempBt = tempByte;
						for (x = 0; x < firstLength; x++) {
							tempBt = util_this.enc(tempBt, firstKeyBt[x]);
						}
						for (y = 0; y < secondLength; y++) {
							tempBt = util_this.enc(tempBt, secondKeyBt[y]);
						}
						for (z = 0; z < thirdLength; z++) {
							tempBt = util_this.enc(tempBt, thirdKeyBt[z]);
						}
						encByte = tempBt;
					} else {
						if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
							var tempBt;
							var x, y;
							tempBt = tempByte;
							for (x = 0; x < firstLength; x++) {
								tempBt = util_this.enc(tempBt, firstKeyBt[x]);
							}
							for (y = 0; y < secondLength; y++) {
								tempBt = util_this.enc(tempBt, secondKeyBt[y]);
							}
							encByte = tempBt;
						} else {
							if (firstKey != null && firstKey != "") {
								var tempBt;
								var x;
								tempBt = tempByte;
								for (x = 0; x < firstLength; x++) {
									tempBt = util_this.enc(tempBt, firstKeyBt[x]);
								}
								encByte = tempBt;
							}
						}
					}
					encData += util_this.bt64ToHex(encByte);
				}
			}
		}
		return encData;
	};
	this.getKeyBytes = function(key) {
		var keyBytes = new Array();
		var leng = key.length;
		var iterator = parseInt(leng / 4);
		var remainder = leng % 4;
		var i = 0;
		for (i = 0; i < iterator; i++) {
			keyBytes[i] = util_this.strToBt(key.substring(i * 4 + 0, i * 4 + 4));
		}
		if (remainder > 0) {
			keyBytes[i] = util_this.strToBt(key.substring(i * 4 + 0, leng));
		}
		return keyBytes;
	};
	this.strToBt = function(str) {
		var leng = str.length;
		var bt = new Array(64);
		if (leng < 4) {
			var i = 0,
				j = 0,
				p = 0,
				q = 0;
			for (i = 0; i < leng; i++) {
				var k = str.charCodeAt(i);
				for (j = 0; j < 16; j++) {
					var pow = 1,
						m = 0;
					for (m = 15; m > j; m--) {
						pow *= 2;
					}
					bt[16 * i + j] = parseInt(k / pow) % 2;
				}
			}
			for (p = leng; p < 4; p++) {
				var k = 0;
				for (q = 0; q < 16; q++) {
					var pow = 1,
						m = 0;
					for (m = 15; m > q; m--) {
						pow *= 2;
					}
					bt[16 * p + q] = parseInt(k / pow) % 2;
				}
			}
		} else {
			for (i = 0; i < 4; i++) {
				var k = str.charCodeAt(i);
				for (j = 0; j < 16; j++) {
					var pow = 1;
					for (m = 15; m > j; m--) {
						pow *= 2;
					}
					bt[16 * i + j] = parseInt(k / pow) % 2;
				}
			}
		}
		return bt;
	};
	this.enc = function(dataByte, keyByte) {
		var keys = util_this.generateKeys(keyByte);
		var ipByte = util_this.initPermute(dataByte);
		var ipLeft = new Array(32);
		var ipRight = new Array(32);
		var tempLeft = new Array(32);
		var i = 0,
			j = 0,
			k = 0,
			m = 0,
			n = 0;
		for (k = 0; k < 32; k++) {
			ipLeft[k] = ipByte[k];
			ipRight[k] = ipByte[32 + k];
		}
		for (i = 0; i < 16; i++) {
			for (j = 0; j < 32; j++) {
				tempLeft[j] = ipLeft[j];
				ipLeft[j] = ipRight[j];
			}
			var key = new Array(48);
			for (m = 0; m < 48; m++) {
				key[m] = keys[i][m];
			}
			var tempRight = util_this.xor(util_this.pPermute(util_this.sBoxPermute(util_this.xor(util_this.expandPermute(ipRight), key))), tempLeft);
			for (n = 0; n < 32; n++) {
				ipRight[n] = tempRight[n];
			}
		}

		var finalData = new Array(64);
		for (i = 0; i < 32; i++) {
			finalData[i] = ipRight[i];
			finalData[32 + i] = ipLeft[i];
		}
		return util_this.finallyPermute(finalData);
	};
	this.expandPermute = function(rightData) {
		var epByte = new Array(48);
		var i;
		for (i = 0; i < 8; i++) {
			if (i == 0) {
				epByte[i * 6 + 0] = rightData[31];
			} else {
				epByte[i * 6 + 0] = rightData[i * 4 - 1];
			}
			epByte[i * 6 + 1] = rightData[i * 4 + 0];
			epByte[i * 6 + 2] = rightData[i * 4 + 1];
			epByte[i * 6 + 3] = rightData[i * 4 + 2];
			epByte[i * 6 + 4] = rightData[i * 4 + 3];
			if (i == 7) {
				epByte[i * 6 + 5] = rightData[0];
			} else {
				epByte[i * 6 + 5] = rightData[i * 4 + 4];
			}
		}
		return epByte;
	};
	this.pPermute = function(sBoxByte) {
		var pBoxPermute = new Array(32);
		pBoxPermute[0] = sBoxByte[15];
		pBoxPermute[1] = sBoxByte[6];
		pBoxPermute[2] = sBoxByte[19];
		pBoxPermute[3] = sBoxByte[20];
		pBoxPermute[4] = sBoxByte[28];
		pBoxPermute[5] = sBoxByte[11];
		pBoxPermute[6] = sBoxByte[27];
		pBoxPermute[7] = sBoxByte[16];
		pBoxPermute[8] = sBoxByte[0];
		pBoxPermute[9] = sBoxByte[14];
		pBoxPermute[10] = sBoxByte[22];
		pBoxPermute[11] = sBoxByte[25];
		pBoxPermute[12] = sBoxByte[4];
		pBoxPermute[13] = sBoxByte[17];
		pBoxPermute[14] = sBoxByte[30];
		pBoxPermute[15] = sBoxByte[9];
		pBoxPermute[16] = sBoxByte[1];
		pBoxPermute[17] = sBoxByte[7];
		pBoxPermute[18] = sBoxByte[23];
		pBoxPermute[19] = sBoxByte[13];
		pBoxPermute[20] = sBoxByte[31];
		pBoxPermute[21] = sBoxByte[26];
		pBoxPermute[22] = sBoxByte[2];
		pBoxPermute[23] = sBoxByte[8];
		pBoxPermute[24] = sBoxByte[18];
		pBoxPermute[25] = sBoxByte[12];
		pBoxPermute[26] = sBoxByte[29];
		pBoxPermute[27] = sBoxByte[5];
		pBoxPermute[28] = sBoxByte[21];
		pBoxPermute[29] = sBoxByte[10];
		pBoxPermute[30] = sBoxByte[3];
		pBoxPermute[31] = sBoxByte[24];
		return pBoxPermute;
	};

	this.sBoxPermute = function(expandByte) {

		var sBoxByte = new Array(32);
		var binary = "";
		var s1 = [
			[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
			[0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
			[4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
			[15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
		];

		/* Table - s2 */
		var s2 = [
			[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
			[3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
			[0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
			[13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
		];

		/* Table - s3 */
		var s3 = [
			[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
			[13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
			[13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
			[1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
		];
		/* Table - s4 */
		var s4 = [
			[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
			[13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
			[10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
			[3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
		];

		/* Table - s5 */
		var s5 = [
			[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
			[14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
			[4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
			[11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
		];

		/* Table - s6 */
		var s6 = [
			[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
			[10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
			[9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
			[4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
		];

		/* Table - s7 */
		var s7 = [
			[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
			[13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
			[1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
			[6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
		];

		/* Table - s8 */
		var s8 = [
			[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
			[1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
			[7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
			[2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
		];

		for (var m = 0; m < 8; m++) {
			var i = 0,
				j = 0;
			i = expandByte[m * 6 + 0] * 2 + expandByte[m * 6 + 5];
			j = expandByte[m * 6 + 1] * 2 * 2 * 2 +
                expandByte[m * 6 + 2] * 2 * 2 +
                expandByte[m * 6 + 3] * 2 +
                expandByte[m * 6 + 4];
			switch (m) {
			case 0:
				binary = util_this.getBoxBinary(s1[i][j]);
				break;
			case 1:
				binary = util_this.getBoxBinary(s2[i][j]);
				break;
			case 2:
				binary = util_this.getBoxBinary(s3[i][j]);
				break;
			case 3:
				binary = util_this.getBoxBinary(s4[i][j]);
				break;
			case 4:
				binary = util_this.getBoxBinary(s5[i][j]);
				break;
			case 5:
				binary = util_this.getBoxBinary(s6[i][j]);
				break;
			case 6:
				binary = util_this.getBoxBinary(s7[i][j]);
				break;
			case 7:
				binary = util_this.getBoxBinary(s8[i][j]);
				break;
			}
			sBoxByte[m * 4 + 0] = parseInt(binary.substring(0, 1));
			sBoxByte[m * 4 + 1] = parseInt(binary.substring(1, 2));
			sBoxByte[m * 4 + 2] = parseInt(binary.substring(2, 3));
			sBoxByte[m * 4 + 3] = parseInt(binary.substring(3, 4));
		}
		return sBoxByte;
	};
	this.generateKeys = function(keyByte) {
		var key = new Array(56);
		var keys = new Array();

		keys[0] = new Array();
		keys[1] = new Array();
		keys[2] = new Array();
		keys[3] = new Array();
		keys[4] = new Array();
		keys[5] = new Array();
		keys[6] = new Array();
		keys[7] = new Array();
		keys[8] = new Array();
		keys[9] = new Array();
		keys[10] = new Array();
		keys[11] = new Array();
		keys[12] = new Array();
		keys[13] = new Array();
		keys[14] = new Array();
		keys[15] = new Array();
		var loop = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
		var j, k, m;
		for (i = 0; i < 7; i++) {
			for (j = 0, k = 7; j < 8; j++, k--) {
				key[i * 8 + j] = keyByte[8 * k + i];
			}
		}

		var i = 0;
		for (i = 0; i < 16; i++) {
			var tempLeft = 0;
			var tempRight = 0;
			for (j = 0; j < loop[i]; j++) {
				tempLeft = key[0];
				tempRight = key[28];
				for (k = 0; k < 27; k++) {
					key[k] = key[k + 1];
					key[28 + k] = key[29 + k];
				}
				key[27] = tempLeft;
				key[55] = tempRight;
			}
			var tempKey = new Array(48);
			tempKey[0] = key[13];
			tempKey[1] = key[16];
			tempKey[2] = key[10];
			tempKey[3] = key[23];
			tempKey[4] = key[0];
			tempKey[5] = key[4];
			tempKey[6] = key[2];
			tempKey[7] = key[27];
			tempKey[8] = key[14];
			tempKey[9] = key[5];
			tempKey[10] = key[20];
			tempKey[11] = key[9];
			tempKey[12] = key[22];
			tempKey[13] = key[18];
			tempKey[14] = key[11];
			tempKey[15] = key[3];
			tempKey[16] = key[25];
			tempKey[17] = key[7];
			tempKey[18] = key[15];
			tempKey[19] = key[6];
			tempKey[20] = key[26];
			tempKey[21] = key[19];
			tempKey[22] = key[12];
			tempKey[23] = key[1];
			tempKey[24] = key[40];
			tempKey[25] = key[51];
			tempKey[26] = key[30];
			tempKey[27] = key[36];
			tempKey[28] = key[46];
			tempKey[29] = key[54];
			tempKey[30] = key[29];
			tempKey[31] = key[39];
			tempKey[32] = key[50];
			tempKey[33] = key[44];
			tempKey[34] = key[32];
			tempKey[35] = key[47];
			tempKey[36] = key[43];
			tempKey[37] = key[48];
			tempKey[38] = key[38];
			tempKey[39] = key[55];
			tempKey[40] = key[33];
			tempKey[41] = key[52];
			tempKey[42] = key[45];
			tempKey[43] = key[41];
			tempKey[44] = key[49];
			tempKey[45] = key[35];
			tempKey[46] = key[28];
			tempKey[47] = key[31];
			switch (i) {
			case 0:
				for (m = 0; m < 48; m++) { keys[0][m] = tempKey[m]; }
				break;
			case 1:
				for (m = 0; m < 48; m++) { keys[1][m] = tempKey[m]; }
				break;
			case 2:
				for (m = 0; m < 48; m++) { keys[2][m] = tempKey[m]; }
				break;
			case 3:
				for (m = 0; m < 48; m++) { keys[3][m] = tempKey[m]; }
				break;
			case 4:
				for (m = 0; m < 48; m++) { keys[4][m] = tempKey[m]; }
				break;
			case 5:
				for (m = 0; m < 48; m++) { keys[5][m] = tempKey[m]; }
				break;
			case 6:
				for (m = 0; m < 48; m++) { keys[6][m] = tempKey[m]; }
				break;
			case 7:
				for (m = 0; m < 48; m++) { keys[7][m] = tempKey[m]; }
				break;
			case 8:
				for (m = 0; m < 48; m++) { keys[8][m] = tempKey[m]; }
				break;
			case 9:
				for (m = 0; m < 48; m++) { keys[9][m] = tempKey[m]; }
				break;
			case 10:
				for (m = 0; m < 48; m++) { keys[10][m] = tempKey[m]; }
				break;
			case 11:
				for (m = 0; m < 48; m++) { keys[11][m] = tempKey[m]; }
				break;
			case 12:
				for (m = 0; m < 48; m++) { keys[12][m] = tempKey[m]; }
				break;
			case 13:
				for (m = 0; m < 48; m++) { keys[13][m] = tempKey[m]; }
				break;
			case 14:
				for (m = 0; m < 48; m++) { keys[14][m] = tempKey[m]; }
				break;
			case 15:
				for (m = 0; m < 48; m++) { keys[15][m] = tempKey[m]; }
				break;
			}
		}
		return keys;
	};
	this.getBoxBinary = function(i) {
		var binary = "";

		switch (i) {
		case 0:
			binary = "0000";
			break;
		case 1:
			binary = "0001";
			break;
		case 2:
			binary = "0010";
			break;
		case 3:
			binary = "0011";
			break;
		case 4:
			binary = "0100";
			break;
		case 5:
			binary = "0101";
			break;
		case 6:
			binary = "0110";
			break;
		case 7:
			binary = "0111";
			break;
		case 8:
			binary = "1000";
			break;
		case 9:
			binary = "1001";
			break;
		case 10:
			binary = "1010";
			break;
		case 11:
			binary = "1011";
			break;
		case 12:
			binary = "1100";
			break;
		case 13:
			binary = "1101";
			break;
		case 14:
			binary = "1110";
			break;
		case 15:
			binary = "1111";
			break;
		}
		return binary;
	};
	this.initPermute = function(originalData) {
		var i, j, m, k, n;
		var ipByte = new Array(64);
		for (i = 0, m = 1, n = 0; i < 4; i++, m += 2, n += 2) {
			for (j = 7, k = 0; j >= 0; j--, k++) {
				ipByte[i * 8 + k] = originalData[j * 8 + m];
				ipByte[i * 8 + k + 32] = originalData[j * 8 + n];
			}
		}
		return ipByte;
	};
	this.xor = function(byteOne, byteTwo) {
		var xorByte = new Array(byteOne.length);
		for (var i = 0; i < byteOne.length; i++) {
			xorByte[i] = byteOne[i] ^ byteTwo[i];
		}
		return xorByte;
	};
	this.bt64ToHex = function(byteData) {
		var hex = "";
		for (var i = 0; i < 16; i++) {
			var bt = "";
			for (var j = 0; j < 4; j++) {
				bt += byteData[i * 4 + j];
			}
			hex += util_this.bt4ToHex(bt);
		}
		return hex;
	};
	this.bt4ToHex = function(binary) {
		var hex;
		switch (binary) {
		case "0000":
			hex = "0";
			break;
		case "0001":
			hex = "1";
			break;
		case "0010":
			hex = "2";
			break;
		case "0011":
			hex = "3";
			break;
		case "0100":
			hex = "4";
			break;
		case "0101":
			hex = "5";
			break;
		case "0110":
			hex = "6";
			break;
		case "0111":
			hex = "7";
			break;
		case "1000":
			hex = "8";
			break;
		case "1001":
			hex = "9";
			break;
		case "1010":
			hex = "A";
			break;
		case "1011":
			hex = "B";
			break;
		case "1100":
			hex = "C";
			break;
		case "1101":
			hex = "D";
			break;
		case "1110":
			hex = "E";
			break;
		case "1111":
			hex = "F";
			break;
		}
		return hex;
	};
	this.finallyPermute = function(endByte) {
		var fpByte = new Array(64);
		fpByte[0] = endByte[39];
		fpByte[1] = endByte[7];
		fpByte[2] = endByte[47];
		fpByte[3] = endByte[15];
		fpByte[4] = endByte[55];
		fpByte[5] = endByte[23];
		fpByte[6] = endByte[63];
		fpByte[7] = endByte[31];
		fpByte[8] = endByte[38];
		fpByte[9] = endByte[6];
		fpByte[10] = endByte[46];
		fpByte[11] = endByte[14];
		fpByte[12] = endByte[54];
		fpByte[13] = endByte[22];
		fpByte[14] = endByte[62];
		fpByte[15] = endByte[30];
		fpByte[16] = endByte[37];
		fpByte[17] = endByte[5];
		fpByte[18] = endByte[45];
		fpByte[19] = endByte[13];
		fpByte[20] = endByte[53];
		fpByte[21] = endByte[21];
		fpByte[22] = endByte[61];
		fpByte[23] = endByte[29];
		fpByte[24] = endByte[36];
		fpByte[25] = endByte[4];
		fpByte[26] = endByte[44];
		fpByte[27] = endByte[12];
		fpByte[28] = endByte[52];
		fpByte[29] = endByte[20];
		fpByte[30] = endByte[60];
		fpByte[31] = endByte[28];
		fpByte[32] = endByte[35];
		fpByte[33] = endByte[3];
		fpByte[34] = endByte[43];
		fpByte[35] = endByte[11];
		fpByte[36] = endByte[51];
		fpByte[37] = endByte[19];
		fpByte[38] = endByte[59];
		fpByte[39] = endByte[27];
		fpByte[40] = endByte[34];
		fpByte[41] = endByte[2];
		fpByte[42] = endByte[42];
		fpByte[43] = endByte[10];
		fpByte[44] = endByte[50];
		fpByte[45] = endByte[18];
		fpByte[46] = endByte[58];
		fpByte[47] = endByte[26];
		fpByte[48] = endByte[33];
		fpByte[49] = endByte[1];
		fpByte[50] = endByte[41];
		fpByte[51] = endByte[9];
		fpByte[52] = endByte[49];
		fpByte[53] = endByte[17];
		fpByte[54] = endByte[57];
		fpByte[55] = endByte[25];
		fpByte[56] = endByte[32];
		fpByte[57] = endByte[0];
		fpByte[58] = endByte[40];
		fpByte[59] = endByte[8];
		fpByte[60] = endByte[48];
		fpByte[61] = endByte[16];
		fpByte[62] = endByte[56];
		fpByte[63] = endByte[24];
		return fpByte;
	};
};
export const util = new Util();

export const SessionUtil = function() {
	this.getCompanyUid = function(vue) {
		//console.info(vue);
		if (vue != undefined && vue != null) {
			return vue.$store.state.companyUid;
		} else {
			return window.session.company.id;
		}
		//console.info(vue.$store);
		//console.info(vue.$store.state);

	};
	this.getCompanyId = function(vue) {
		if (vue != undefined && vue != null) {
			return vue.$store.state.session.company.departId;
		} else {
			return window.session.company.departId;
		}
	};
	this.getsubCompanyId = function(vue) {
		if (vue != undefined && vue != null) {
			return vue.$store.state.session.depart.departId;
		} else {
			return window.session.depart.departId;
		}
	};
	this.getUserId = function(vue) {
		if (vue != undefined && vue != null) {
			return vue.$store.state.session.user.userId;
		} else {
			return window.session.user.userId;
		}

	};
	this.getUserUid = function(vue) {
		if (vue != undefined && vue != null) {
			return vue.$store.state.session.user.id;
		} else {
			return window.session.user.userId;
		}

	};
	this.getUserName = function(vue) {
		if (vue != undefined && vue != null) {
			return vue.$store.state.session.user.userName;
		} else {
			return window.session.user.userName;
		}
	};
	this.getDepartUid = function(vue) {
		if (vue != undefined && vue != null) {
			return vue.$store.state.session.depart.id;
		} else {
			return window.session.depart.id;
		}
	};
	this.getDepartId = function(vue) {
		if (vue != undefined && vue != null) {
			return vue.$store.state.session.depart.departId;
		} else {
			return window.session.depart.departId;
		}
	};
	this.getDepartName = function(vue) {
		if (vue != undefined && vue != null) {
			return vue.$store.state.session.depart.departName;
		} else {
			return window.session.depart.departName;
		}

	};
	this.containRole = function(key) {
		//console.info("进来了");
		//console.info(window.session.RoleSet);
		if (window.session != undefined && window.session != null && window.session.roles != undefined && window.session.roles != null) {
			for (var i = 0; i < window.session.roles.length; i++) {
				var role = window.session.roles[i].roleId;
				//console.info("key==="+key);
				if (role == key) {
					return true;
				}
			}
		}
		return false;
	};
	this.isCompanyAdmin = function() {
		if (this.containRole("Role_Sys_Company_Admin")) {
			return true;
		}
		return false;
	};

};
export const sessionUtil = new SessionUtil();
export const ValidUtil = function() {
	/*
     * 用途：检查输入手机号码是否正确 输入： s：字符串 返回： 如果通过验证返回true,否则返回false
     */
	this.isMobile = function(s) {
		//console.info(s);
		var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
		if (s == "") {
			return false;
		} else if (s.length != 11) {
			return false;

		} else if (!myreg.test(s)) {
			return false;

		}
		return true;
	};
	this.isNotEmpty = function(res) {
		if (res !== undefined && res !== "" && res !== null) {
			return true;
		} else {
			return false;
		}
	};
	this.compareDateTime = function(date1, date2) {
		var oDate1 = new Date(date1);
		var oDate2 = new Date(date2);
		if (oDate1.getTime() >= oDate2.getTime()) {
			return true;
		} else {
			return false;
		}
	};
	this.contains = function(arr, obj) {
		var i = arr.length;
		while (i--) {
			if (arr[i] === obj) {
				return true;
			}
		}
		return false;
	};
};
export const validUtil = new ValidUtil();