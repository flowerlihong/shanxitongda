// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import "@/public/scss/jrstyle.scss";
import "@/public/css/jrstyle.css";
import "@/public/css/mystyle.css";
import "@/public/js/jrmain.js";
import aliIcons from "@/public/js/iconfont1.js";
import Vue from "vue";
import App from "./App";
import router from "./router";
import mint from "./mint";
//import ele from './ele'
import store from "./store";

//import $ from 'jquery'
//import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";
//import 'bootstrap/dist/js/bootstrap.min.js'
import "weui/dist/style/weui.min.css";
import aliIcon from "./public/js/iconfont.js";

import { AlertPlugin } from "vux";
import { LoadingPlugin } from "vux";
import { ToastPlugin } from "vux";
import { ConfirmPlugin } from "vux";
import { util, validUtil, cookieUtil, sessionUtil } from "@/utils/utils.js";
//import wx from 'weixin-js-sdk'
// import '../node_modules/weixin-js-sdk/index.js'
//import FastClick from 'fastclick' 导入fastclick 解决移动端点击事件延迟问题
// FastClick.attach(document.body);
Vue.config.productionTip = false;
Vue.use(require("vue-wechat-title"));
var wx = require("weixin-js-sdk");
//var weui =require('./src/assets/js/weui.min.js')
Vue.prototype.wx = wx;
Vue.use(AlertPlugin);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.prototype.util = util;
Vue.prototype.validUtil = validUtil;
Vue.prototype.baseUrl = util.getBaseUrl();
Vue.prototype.sessionUtil = sessionUtil;
/* eslint-disable no-new */
new Vue({
	el: "#app",
	router,
	mint,
	//ele,
	store,
	template: "<App/>",
	created() {
		//this.$store.state.session = new Object();
		//console.info(this.util.getUrlParam("code"));
		//cookieUtil.clear("chesijian");
		//生产环境配置
		window.suite_id = util.getUrlParam("suite_id");
		window.corp_id = util.getUrlParam("corp_id");
		window.agent_id = util.getUrlParam("agent_id");
		window.company_id = util.getUrlParam("company_id");
		window.access_code = util.getUrlParam("code");
		window.access_securt = util.getUrlParam("access_securt");
        
		//开发环境配置
		window.corp_id = "ww159b657dbf96b5c3";  //通达
		window.company_id = "00001";
		window.agent_id = "1000004";
		// window.access_securt = "pmy";
		window.access_securt = "zh";


		//广州花园
		// window.corp_id = "ww68e393b4dcec5835";  //花园
		// window.company_id = "0001";
		// window.agent_id = "1000002";
		// window.access_securt = "ncy"; 

		// console.log(cookieUtil.get("access_corp_session" + "@" + corp_id))
		// "6FTmqBoVI69K3U0Lky6gh_lxROSflAVeE3E1zns79cA"
		// cookieUtil.set("access_securt", "18922748551", 24 * 60 * 60);
		// cookieUtil.set("access_securt", "slx", 24 * 60 * 60);
		this.$store.state.session = this.util.getSessionData();       
		var session = this.$store.state.session;
		window.session = session;
		this.$store.state.userName = session.user.userName;
		//this.util.alert("当前登录人是："+this.$store.state.userName);
		this.$store.state.userUid = session.user.id;
		this.$store.state.userId = session.user.userId;
		this.$store.state.companyUid = session.company.id;
		this.$store.state.avatar = session.user.picture;

		// console.info(this.$store.state.session);
		//this.$store.state.session.code = this.util.getUrlParam("code");
		//console.info("this.$store.state.session.code" + this.$store.state.session.code);
	},
	components: { App }
});