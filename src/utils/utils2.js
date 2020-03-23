import axios from 'axios'
import Vue from 'vue'
import { MessageBox, Indicator } from 'mint-ui';
import { Toast } from 'mint-ui';


$.fn.extend({
    insertAtCaret: function (myValue) {
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
            if ($t.selectionStart || $t.selectionStart == '0') {
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



Date.prototype.format = function (fmt) {
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
}

// 时间公用函数
// class Store {
export const FormatDate = function (date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}


//获取下一环节信息
export const getNextActInfo = function (param, callBack) {
    axios.post(baseUrl() + "/workflow/getNextActInfo", param).then((res) => {
        callBack(res.data);
    });
}
//获取流转历史记录
export const getHistoricTask = function (procDefId, procInstId, callBack) {
    axios.get(baseUrl() + "/workflow/getHistoricTask", { params: { procDefId: procDefId, procInstId: procInstId } }).then((res) => {
        callBack(res.data);
    });
}

export const baseUrl = function () {

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
        .substring(0, pathName.substr(1).indexOf('/') + 1);
    //return (localhostPaht + projectName);
    //return 'http://localhost:88/jpro';
    return util.getBaseUrl();
}

// 金额小写到大写转换
export const amountLtoU = function (num) {
    ///<summery>小写金额转化大写金额</summery>
    ///<param name=num type=number>金额</param>
    if (isNaN(num)) return "无效数值！";
    var strPrefix = "";
    if (num < 0) strPrefix = "(负)";
    num = Math.abs(num);
    if (num >= 1000000000000) return "无效数值！";
    var strOutput = "";
    var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    var strCapDgt = '零壹贰叁肆伍陆柒捌玖';
    num += "00";
    var intPos = num.indexOf('.');
    if (intPos >= 0) {
        num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - num.length);
    for (var i = 0; i < num.length; i++) {
        strOutput += strCapDgt.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
    }
    return strPrefix + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
}
//获取url中参数
export const getArgFromHref = function (argName) {
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
}

//深度克隆方法
export const cloneObj = obj => {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};


export const getAjax = (url, obj, param, callBack) => {
    axios.get(url, { params: param }).then((res) => {

        callBack(res);
    });
}

export const Cookies = function () {
    this.set = function (name, value, expire) {
        //alert(name+"---"+value);
        window.localStorage.setItem(name, value);
        return null;

    };

    this.get = function (name) {
        return window.localStorage.getItem(name);


    };

    this.clear = function (name) {
        window.localStorage.removeItem(name)
        return;

    };
    this.clearAll = function () {
        window.localStorage.clear();
    };
}
export const cookieUtil = new Cookies();



export const Util = function (res) {
    this.pageSize = 20;
    this.vue = null;
    this.const = {};
    this.flag = false;
    
    this.defaultCorpId = "wx464b5d94f5edf957";
    this.amapKey = "82c91102377a644ef3af68a674c6e8bb";
    this.setConst=function(key,value){
        this.const[key] = value;
    };
    this.getConst=function(key){
        if(this.const[key] != undefined){
            return this.const[key];
        }
        return null;
    }
    this.isNotEmpty = function (res) {
        if (res !== undefined && res !== "" && res !== null) {
            return true;
        } else {
            return false;
        }
    };
    this.mask = function (msg) {
        /*Indicator.open({
            text: msg == null || msg == '' ? '正在加载...' : msg,
            spinnerType: 'fading-circle'
        });*/
        if (msg == null) {
            Vue.$vux.loading.show();
        } else {
            Vue.$vux.loading.show({
                text: msg == null || msg == '' ? '正在加载...' : msg
            });
        }

    };
    this.unmask = function () {
        //Indicator.close();
        Vue.$vux.loading.hide();
    };

    this.toast = function (msg, type, duration) {
        var obj = { text: msg };
        if (this.isNotEmpty(type)) {
            obj['type'] = type;
        }
        if (this.isNotEmpty(duration)) {
            obj['time'] = duration;
        }
        Vue.$vux.toast.show(obj)
    };
    this.successToast = function (msg, duration) {
        this.toast(msg, 'success', duration);
    };
    this.failueToast = function (msg, duration) {
        this.toast(msg, 'warn', duration);
    };
    this.cancleToast = function (msg, duration) {
        this.toast(msg, 'cancle', duration);
    };
    this.getUrlParam = function (argName) {
        var reg = new RegExp("(^|\\?|&)" + argName + "=([^&]*)(\\s|&|$)", "i");
        if (reg.test(window.location.href))
            return unescape(RegExp.$2.replace(/\+/g, " "));
        return "";
    };
    this.alert = function (msg) {
        Vue.$vux.alert.show({
            content: msg,
        });
    };
    this.confirm = function (msg, callBack) {
        Vue.$vux.confirm.show({
            // 组件除show外的属性
            content: msg,
            onCancel() {
                Vue.$vux.confirm.hide()
            },
            onConfirm() {
                callBack();
            }
        })
    };
    this.getAccessSecurt = function () {

        var corp_id = window.corp_id;
        //console.info("corp_id---------"+corp_id);
        var userUid = cookieUtil.get("access_corp_securt" + "@" + corp_id);
        return userUid;
    };
    this.getSessionData = function () {

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

            //this.successToast("cookieVal---" + cookieVal);
            //console.info("cookieVal:" + this.isNotEmpty(cookieVal));
            if (validUtil.isNotEmpty(cookieVal)) {
                var cookieObj = JSON.parse(cookieVal);
                var createTimeStr = cookieObj['time'];
                var expire = cookieObj['expire'];
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
    this.clearCookie = function () {

        cookieUtil.clear("access_corp_securt" + "@" + window.corp_id);
        cookieUtil.clear("access_corp_session" + "@" + window.corp_id);
        // cookieUtil.clearAll();
    },
        this.refreshSession = function () {
            this.clearCookie();
            return;
            var suite_id = window.suite_id;
            var corp_id = window.corp_id;
            var code = window.access_code;
            var userUid = this.getAccessSecurt();
            return this.getSessionDataFromServer(suite_id, corp_id, code, userUid, true);
        };
    this.getSessionDataFromServer = function (suite_id, corp_id, code, userUid, ifRefresh) {
        var _this = this;
        var data = null;
        if (!this.isNotEmpty(ifRefresh)) {
            ifRefresh = false;
        }
        $.ajax({
            url: this.getBaseUrl() + '/wx/weChatAction!getToken.action',
            timeout: 30000,
            async: false,
            type: "POST",
            dataType: 'json',
            data: { ifRefresh: ifRefresh, access_agent: window.agent_id, access_company: window.company_id, suite_id: suite_id, access_corp: corp_id, access_code: code, access_securt: userUid, access_pwd: 'A46D9C656F790E761CEF116018E4DACCA72B4C9393E8A7', access_ak: '62431D6681205767A46D9C656F79761CEF116018E4DACCA72B4B2C9393E8A7' },
            success: function (result) {

                if (result != null) {
                    //var token = result['access_token'];
                    //var expire = result['expire'];
                    if (result['status'] == 200) {
                        //cookieUtil.set(code, JSON.stringify({ access_token: token, expire: expire, createTime: result['createTime'] }));
                        //console.info(result['data']);
                        result['data']['access_token'] = result['data']['token'];
                        //console.info(result);
                        userUid = result['data']['user']['userId'];
                        cookieUtil.set("access_corp_securt" + "@" + (_this.isNotEmpty(corp_id) ? corp_id : ""), userUid, 24 * 60 * 60);
                        cookieUtil.set("access_corp_session" + "@" + (_this.isNotEmpty(corp_id) ? corp_id : ""), JSON.stringify(result['data']), 2 * 60 * 60);
                        data = result['data'];
                    }

                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {

                _this.unmask();

            }
        });
        return data;
    };
    this.getAccessToken = function () {
        var session = this.getSessionData();
        if (session != null) {
            return session['access_token'];
        }
        return null;
    };
    this.extend = function (o, n) {
        for (var p in n) {
            if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p)))
                o[p] = n[p];
        }
        return o;
    };
    this.get = function (url, param, callBack) {
        if (param == null) {
            param = {};
        }
        param['access_token'] = this.getAccessToken();
        param['company_id'] = sessionUtil.getCompanyId();

        param['access_corp'] = window.corp_id;
        param['access_agent'] = window.agent_id;
        $.ajax({
            url: this.getBaseUrl() + url,
            timeout: 60000,
            async: true,
            type: "GET",
            dataType: 'json',
            data: param,
            success: function (result) {
                if (callBack != undefined && callBack != null) (callBack(result));
            }
        });
    };

    this.clone = function (source, dest) {
        if (source == undefined || source == null) {
            return dest;
        }
        if (dest == undefined || dest == null) {
            dest = new Object();
        }
        for (var p in source) {
            var name = p;//属性名称 
            if (name == 'ID_' || name == 'children') {
                continue;
            }
            var value = source[p];//属性对应的值 
            dest[name] = value;
        }
    },

        this.post = function (url, param, callBack, errorCallback) {
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
            param['access_token'] = this.getAccessToken();
            param['company_id'] = sessionUtil.getCompanyId();

            param['access_corp'] = window.corp_id;
            param['access_agent'] = window.agent_id;
            //this.successToast(window.corp_id+"==="+param['access_token']);
            var _this = this;
            $.ajax({
                url: this.getBaseUrl() + url,
                timeout: 60000,
                async: true,
                type: "POST",
                dataType: 'json',
                data: param,
                success: function (result) {
                    if (callBack != undefined && callBack != null) { callBack(result) };
                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (errorCallback != undefined && errorCallback != null) {
                        errorCallback(result)
                    } else {
                        _this.unmask();
                    };
                }
            });
        };
    this.sycnPost = function (url, param, callBack) {
        if (param == null) {
            param = {};
        }
        param['access_token'] = this.getAccessToken();
        param['company_id'] = sessionUtil.getCompanyId();

        param['access_corp'] = window.corp_id;
        param['access_agent'] = window.agent_id;
        $.ajax({
            url: this.getBaseUrl() + url,
            timeout: 60000,
            async: false,
            type: "POST",
            dataType: 'json',
            data: param,
            success: function (result) {
                if (callBack != undefined && callBack != null) (callBack(result));
            }
        });
    };
    this.loadDic = function (param, callBack) {
        this.post('/admin/appDicAction!getDicItems.action', param, function (result) {
            if (result != null) {
                callBack(result);
            } else {
                callBack(null);
            }
        });
    };
    this.initData = function (param, callBack) {
        this.post('/admin/appDefaultFormAction!initData.action', param, function (result) {
            if (result != null) {
                callBack(result);
            } else {
                callBack(null);
            }
        });
    };
    this.deleteData = function (id, sqlTable, callBack) {
        var _this = this;
        var params = { sqlTableName: sqlTable, ids: id, flag: 2 };
        _this.post('/admin/appDefaultFormAction!removeData.action', params, function (res) {
            if (res != undefined && res != null) {

                if (res.success) {
                    //_this.util.successToast("操作成功！");
                    if (callBack != undefined && callBack != null) { callBack(res) } else {
                        _this.successToast("操作成功！");
                    }
                } else {
                    _this.failueToast("操作失败：" + res.errorMsg);
                }
            }

            _this.unmask();
        });
    };
    this.gotoByName = function (name, query) {
        this.mask("正在拼命加载...");
        if (query != undefined && query != null) {
            this.vue.$router.push({ name: name, query: query });
        } else {
            this.vue.$router.push({ name: name });
        }

    };
    this.gotoByPath = function (path, query) {
        console.info(query);
        this.mask("正在拼命加载...");
        if (query != undefined && query != null) {
            this.vue.$router.push({ path: path, query: query });
        } else {
            this.vue.$router.push({ path: path });
        }
    };
    this.init = function (obj) {
        this.vue = obj;
        this.unmask();
    };
    this.getBaseUrl = function () {

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
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        //console.info(projectName);
        //return (localhostPaht + projectName);
        //return "http://192.168.1.254:7228/Platform";
         return "http://101.37.36.191:8092/zbcp";
        //return "http://blueeyedboy.wicp.net:11601/jpro";
        //return 'http://192.168.1.120:8009/pm';
        //return 'http://192.168.43.102:7228/jpro';
        //return 'http://caimingjie1986.gicp.net/jpro';
        //return 'http://caimingjie1986.gicp.net/WebApp';
        //return 'http://blueeyedboy.wicp.net:11601/WebApp';
        //return 'http://192.168.43.102:888/WebApp';
        return 'http://192.168.1.254:888/WebApp';
    };

    this.initUrlParam = function (obj) {
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
    this.setTemp = function (_this, obj) {
        _this.$store.state.temp = obj;
    };
    this.getTemp = function (_this) {
        return _this.$store.state.temp;
    };
    /**
     * "2012-9-20 19:46:18"
     */
    this.strToDate = function (strDate) {
        var st = strDate;
        var a = st.split(" ");
        var b = a[0].split("-");
        var c = a[1].split(":");
        var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2])
        return date;
    };

    /**
     * 微信接口授权
     */
    this.initWxJsSdkConfig = function (vue, wxurl, jsApiList) {
        //wx/getWxPageConfig
        var _this = this;
        this.post("/wx/weChatAction!getWxPageConfig.action", { url: wxurl }, function (result) {
            vue.wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: _this.isNotEmpty(window.corp_id) ? window.corp_id : _this.defaultCorpId, // 必填，企业号的唯一标识，此处填写企业号corpid
                timestamp: result.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
                signature: result.data.signature,// 必填，签名，见附录1
                jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });
    };
    this.initWxJsSdk = function (vue) {
        var wxurl = window.location.href.split("#")[0];
        this.initWxJsSdkConfig(vue, wxurl, ['hideOPtionMenu', 'getLocation', 'chooseImage', 'uploadImage', 'previewImage', 'openEnterpriseContact', 'startRecord', 'stopRecord', 'uploadVoice']);
    }
}
export const util = new Util();

export const SessionUtil = function () {
    this.getCompanyUid = function (vue) {
        //console.info(vue);
        if (vue != undefined && vue != null) {
            return vue.$store.state.companyUid;
        } else {
            return window.session.company.id;
        }
        //console.info(vue.$store);
        //console.info(vue.$store.state);

    };
    this.getCompanyId = function (vue) {
        if (vue != undefined && vue != null) {
            return vue.$store.state.session.company.departId;
        } else {
            return window.session.company.departId;
        }
    }
    this.getUserId = function (vue) {
        if (vue != undefined && vue != null) {
            return vue.$store.state.session.user.userId;
        } else {
            return window.session.user.userId;
        }

    };
    this.getUserUid = function (vue) {
        if (vue != undefined && vue != null) {
            return vue.$store.state.session.user.id;
        } else {
            return window.session.user.userId;
        }

    };
    this.getUserName = function (vue) {
        if (vue != undefined && vue != null) {
            return vue.$store.state.session.user.userName;
        } else {
            return window.session.user.userName;
        }
    };
    this.getDepartUid = function (vue) {
        if (vue != undefined && vue != null) {
            return vue.$store.state.session.depart.id;
        } else {
            return window.session.depart.id;
        }
    };
    this.getDepartId = function (vue) {
        if (vue != undefined && vue != null) {
            return vue.$store.state.session.depart.departId;
        } else {
            return window.session.depart.departId;
        }
    };
    this.getDepartName = function (vue) {
        if (vue != undefined && vue != null) {
            return vue.$store.state.session.depart.departName;
        } else {
            return window.session.depart.departName;
        }

    };
    this.containRole = function (key) {
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
    this.isCompanyAdmin = function () {
        if (this.containRole('Role_Sys_Company_Admin')) {
            return true;
        }
        return false;
    };

}
export const sessionUtil = new SessionUtil();
export const ValidUtil = function () {
    /*
     * 用途：检查输入手机号码是否正确 输入： s：字符串 返回： 如果通过验证返回true,否则返回false
     */
    this.isMobile = function (s) {
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
    this.isNotEmpty = function (res) {
        if (res !== undefined && res !== "" && res !== null) {
            return true;
        } else {
            return false;
        }
    };
    this.compareDateTime = function (date1, date2) {
        var oDate1 = new Date(date1);
        var oDate2 = new Date(date2);
        if (oDate1.getTime() >= oDate2.getTime()) {
            return true;
        } else {
            return false;
        }
    };
    this.contains = function (arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    };
}
export const validUtil = new ValidUtil();



