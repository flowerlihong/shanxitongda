webpackJsonp([59],{1012:function(t,o,n){n(855);var i=n(12)(n(583),n(968),null,null);t.exports=i.exports},260:function(t,o,n){n(887);var i=n(12)(n(658),n(991),"data-v-7ebc09b0",null);t.exports=i.exports},274:function(t,o,n){"use strict";o.__esModule=!0;var i=n(46),e=function(t){return t&&t.__esModule?t:{default:t}}(i);o.default=e.default||function(t){for(var o=1;o<arguments.length;o++){var n=arguments[o];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}},583:function(t,o,n){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var i=n(663);o.default={name:"masker",props:{color:{type:String,default:"0, 0, 0"},opacity:{type:Number,default:.5},fullscreen:{type:Boolean,default:!1}},computed:{style:function(){return{backgroundColor:"rgba("+(/,/.test(this.color)?this.color:n.i(i.a)(this.color.replace("#","")).join(","))+","+this.opacity+")"}}}}},658:function(t,o,n){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var i=n(274),e=n.n(i),a=n(1012),A=n.n(a),s=n(92);o.default={components:{Masker:A.a},data:function(){return{itemBackground:{},statisticsCountData:{myApplyAllCount:0,myApplyUnFinshedCount:0,myApplyFinshedCount:0,myApprovalAllCount:0,myApprovalUnFinishedCount:0,myApprovalFinishedCount:0,myCopyAllCount:0,myCopyUnFinishedCount:0,myCopyFinishedCount:0}}},computed:e()({},n.i(s.b)({userLogo:function(t){return t.userLogo},userUid:function(t){return t.userUid}})),activated:function(){this.util.init(this),this.loadData()},created:function(){this.itemBackground={backgroundImage:"url("+this.userLogo+")"}},methods:{addApply:function(){this.$router.push({name:"workflow/applyIndex"})},loadData:function(){var t=this;t.util.mask("正在加载..."),this.util.post("/wx/workflowAction!getMyCount.action",{userId:this.sessionUtil.getUserId(),company_id:this.sessionUtil.getCompanyId()},function(o){void 0!=o&&200==o.status&&(t.statisticsCountData.myApplyAllCount=o.data.APPLY_,t.statisticsCountData.myApprovalUnFinishedCount=o.data.APPROVAL_UNFINISHED_,t.statisticsCountData.myApprovalFinishedCount=o.data.APPROVAL_FINISHED_,t.statisticsCountData.myCopyUnFinishedCount=o.data.COPY_UNFINISHED_,t.statisticsCountData.myCopyFinishedCount=o.data.COPY_FINISHED_),t.util.unmask()})}}}},663:function(t,o,n){"use strict";function i(t){var o=parseInt(t,16);return[o>>16,o>>8&255,255&o]}o.a=i},734:function(t,o,n){o=t.exports=n(90)(!0),o.push([t.i,".vux-masker-box{position:relative}.vux-masker{position:absolute;top:0;left:0;bottom:0;right:0;border-radius:inherit}.vux-masker-fullscreen{position:fixed;z-index:10001}","",{version:3,sources:["C:/Users/红花/Desktop/jianruanshanxi/weixin__SXTD/node_modules/vux/src/components/masker/index.vue"],names:[],mappings:"AACA,gBACE,iBAAmB,CACpB,AACD,YACE,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,SAAU,AACV,QAAS,AACT,qBAAuB,CACxB,AACD,uBACE,eAAgB,AAChB,aAAe,CAChB",file:"index.vue",sourcesContent:["\n.vux-masker-box {\n  position: relative;\n}\n.vux-masker {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  border-radius: inherit;\n}\n.vux-masker-fullscreen {\n  position: fixed;\n  z-index: 10001;\n}\n"],sourceRoot:""}])},766:function(t,o,n){o=t.exports=n(90)(!0),o.push([t.i,".html .body[data-v-7ebc09b0]{background-color:#f3f3f4}#app[data-v-7ebc09b0],body[data-v-7ebc09b0],html[data-v-7ebc09b0]{overflow:hidden}.ibox[data-v-7ebc09b0]{position:relative;clear:both;margin:10px;margin-bottom:20px;padding:0;box-shadow:0 8px 17px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);border-radius:9px}.ibox-title[data-v-7ebc09b0]{-moz-border-left-colors:none;-moz-border-right-colors:none;-moz-border-top-colors:none;border-color:#597d95;border-style:solid solid none;border-width:6px 0 0;margin-bottom:0;padding:25px 15px 7px;min-height:48px;height:69px}.ibox-content[data-v-7ebc09b0],.ibox-title[data-v-7ebc09b0]{background-color:#fff;-o-border-image:none;border-image:none;color:inherit}.ibox-content[data-v-7ebc09b0]{padding-bottom:2.5rem;border-color:#e7eaec;border-width:1px 0;clear:both}.box-item-fl[data-v-7ebc09b0]{float:left;margin-top:12px}.box-item-over[data-v-7ebc09b0]{font-size:13px}.box1-item[data-v-7ebc09b0]{width:50px;height:50px;border-radius:50px;display:block;text-align:center;line-height:50px;color:#fff;margin:0 auto}.vux-x-icon[data-v-7ebc09b0]{fill:#0078d7}.m-img[data-v-7ebc09b0]{padding-bottom:33%;display:block;position:relative;max-width:100%;background-size:cover;background-position:50%;cursor:pointer;border-radius:2px}.m-title[data-v-7ebc09b0]{color:#fff;text-shadow:0 0 2px rgba(0,0,0,.5);font-weight:500;font-size:16px;position:absolute;left:0;right:0;width:100%;text-align:center;top:50%;transform:translateY(-50%)}.m-title>.glyphicon-zoom-in[data-v-7ebc09b0]{left:0;top:0}.m-time[data-v-7ebc09b0]{font-size:12px;padding-top:4px;border-top:1px solid #f0f0f0;display:inline-block;margin-top:5px}.ibox-title-icon[data-v-7ebc09b0]{display:inline-block}.vux-x-icon[data-v-7ebc09b0]{fill:#fff;background:#4e9cda;border-radius:50%;box-shadow:0 2px 9px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19)}","",{version:3,sources:["C:/Users/红花/Desktop/jianruanshanxi/weixin__SXTD/src/components/workflow/Desktop.vue"],names:[],mappings:"AACA,6BACE,wBAA0B,CAC3B,AACD,kEAGE,eAAiB,CAClB,AACD,uBACE,kBAAmB,AAGnB,WAAY,AACZ,YAAa,AACb,mBAAoB,AACpB,UAAW,AACX,oEAA8E,AAC9E,iBAAmB,CAPpB,AASD,6BACE,6BAA8B,AAC9B,8BAA+B,AAC/B,4BAA6B,AAE7B,qBAAsB,AAGtB,8BAA+B,AAC/B,qBAAsB,AAEtB,gBAAiB,AACjB,sBAAuB,AACvB,gBAAiB,AACjB,WAAa,CACd,AACD,4DAZE,sBAAuB,AAEvB,qBAAsB,AACtB,kBAAmB,AAGnB,aAAe,CAchB,AARD,+BAGE,sBAAuB,AACvB,qBAAsB,AAGtB,mBAAoB,AAGpB,UAAY,CAFb,AAID,8BACE,WAAY,AACZ,eAAiB,CAClB,AACD,gCACE,cAAgB,CACjB,AACD,4BACE,WAAY,AACZ,YAAa,AACb,mBAAoB,AACpB,cAAe,AACf,kBAAmB,AACnB,iBAAkB,AAClB,WAAa,AACb,aAAe,CAChB,AACD,6BACE,YAAc,CACf,AACD,wBACE,mBAAoB,AACpB,cAAe,AACf,kBAAmB,AACnB,eAAgB,AAChB,sBAAuB,AACvB,wBAAmC,AACnC,eAAgB,AAChB,iBAAmB,CACpB,AACD,0BACE,WAAY,AACZ,mCAAwC,AACxC,gBAAiB,AACjB,eAAgB,AAChB,kBAAmB,AACnB,OAAQ,AACR,QAAS,AACT,WAAY,AACZ,kBAAmB,AACnB,QAAS,AACT,0BAA4B,CAC7B,AACD,6CACE,OAAU,AACV,KAAS,CACV,AACD,yBACE,eAAgB,AAChB,gBAAiB,AACjB,6BAA8B,AAC9B,qBAAsB,AACtB,cAAgB,CACjB,AACD,kCACE,oBAAsB,CACvB,AACD,6BACE,UAAW,AACX,mBAAoB,AACpB,kBAAmB,AACnB,kEAA6E,CAC9E",file:"Desktop.vue",sourcesContent:["\n.html .body[data-v-7ebc09b0] {\n  background-color: #f3f3f4;\n}\nhtml[data-v-7ebc09b0],\nbody[data-v-7ebc09b0],\n#app[data-v-7ebc09b0] {\n  overflow: hidden;\n}\n.ibox[data-v-7ebc09b0] {\n  position: relative;\n}\n.ibox[data-v-7ebc09b0] {\n  clear: both;\n  margin: 10px;\n  margin-bottom: 20px;\n  padding: 0;\n  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n  border-radius: 9px;\n}\n.ibox-title[data-v-7ebc09b0] {\n  -moz-border-left-colors: none;\n  -moz-border-right-colors: none;\n  -moz-border-top-colors: none;\n  background-color: #fff;\n  border-color: #597d95;\n  -o-border-image: none;\n  border-image: none;\n  border-style: solid solid none;\n  border-width: 6px 0 0;\n  color: inherit;\n  margin-bottom: 0;\n  padding: 25px 15px 7px;\n  min-height: 48px;\n  height: 69px;\n}\n.ibox-content[data-v-7ebc09b0] {\n  background-color: #fff;\n  color: inherit;\n  padding-bottom: 2.5rem;\n  border-color: #e7eaec;\n  -o-border-image: none;\n  border-image: none;\n  border-width: 1px 0;\n}\n.ibox-content[data-v-7ebc09b0] {\n  clear: both;\n}\n.box-item-fl[data-v-7ebc09b0] {\n  float: left;\n  margin-top: 12px;\n}\n.box-item-over[data-v-7ebc09b0] {\n  font-size: 13px;\n}\n.box1-item[data-v-7ebc09b0] {\n  width: 50px;\n  height: 50px;\n  border-radius: 50px;\n  display: block;\n  text-align: center;\n  line-height: 50px;\n  color: white;\n  margin: 0 auto;\n}\n.vux-x-icon[data-v-7ebc09b0] {\n  fill: #0078D7;\n}\n.m-img[data-v-7ebc09b0] {\n  padding-bottom: 33%;\n  display: block;\n  position: relative;\n  max-width: 100%;\n  background-size: cover;\n  background-position: center center;\n  cursor: pointer;\n  border-radius: 2px;\n}\n.m-title[data-v-7ebc09b0] {\n  color: #fff;\n  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);\n  font-weight: 500;\n  font-size: 16px;\n  position: absolute;\n  left: 0;\n  right: 0;\n  width: 100%;\n  text-align: center;\n  top: 50%;\n  transform: translateY(-50%);\n}\n.m-title > .glyphicon-zoom-in[data-v-7ebc09b0] {\n  left: 0px;\n  top: 0px;\n}\n.m-time[data-v-7ebc09b0] {\n  font-size: 12px;\n  padding-top: 4px;\n  border-top: 1px solid #f0f0f0;\n  display: inline-block;\n  margin-top: 5px;\n}\n.ibox-title-icon[data-v-7ebc09b0] {\n  display: inline-block;\n}\n.vux-x-icon[data-v-7ebc09b0] {\n  fill: #fff;\n  background: #4E9CDA;\n  border-radius: 50%;\n  box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n}\n"],sourceRoot:""}])},855:function(t,o,n){var i=n(734);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);n(196)("06482734",i,!0)},887:function(t,o,n){var i=n(766);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);n(196)("60cd5067",i,!0)},968:function(t,o){t.exports={render:function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("div",{staticClass:"vux-masker-box"},[t._t("default"),t._v(" "),n("div",{staticClass:"vux-masker",class:{"vux-masker-fullscreen":t.fullscreen},style:t.style},[t._t("content")],2)],2)},staticRenderFns:[]}},991:function(t,o){t.exports={render:function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("div",[n("div",{staticClass:"ibox",staticStyle:{overflow:"hidden"},on:{click:function(o){t.util.gotoByPath("/workflow/approval",{type:"unFinished"})}}},[n("div",{staticClass:"ibox-title",staticStyle:{"border-color":"#1AB394","border-bottom":"1px solid #1AB394"}},[n("span",{staticClass:"glyphicon glyphicon-send"}),t._v(" "),n("p",{staticClass:"ibox-title-icon"},[t._v("我的待办("+t._s(t.statisticsCountData.myApprovalUnFinishedCount)+")")])])]),t._v(" "),n("div",{staticClass:"ibox",staticStyle:{overflow:"hidden"},on:{click:function(o){t.util.gotoByPath("/workflow/copy",{type:"unFinished"})}}},[n("div",{staticClass:"ibox-title",staticStyle:{"border-color":"#A392E6","border-bottom":"1px solid #A392E6"}},[n("span",{staticClass:"glyphicon glyphicon-list-alt"}),t._v(" "),n("p",{staticClass:"ibox-title-icon"},[t._v("我的待阅("+t._s(t.statisticsCountData.myCopyUnFinishedCount)+")")])])]),t._v(" "),n("div",{staticClass:"ibox",staticStyle:{overflow:"hidden"},on:{click:function(o){t.util.gotoByPath("/workflow/approval",{type:"finished"})}}},[n("div",{staticClass:"ibox-title",staticStyle:{"border-color":"rgb(56, 167, 220)","border-bottom":"1px solid rgb(56, 167, 220)"}},[n("span",{staticClass:"glyphicon glyphicon-list-alt"}),t._v(" "),n("p",{staticClass:"ibox-title-icon"},[t._v("我的已办("+t._s(t.statisticsCountData.myApprovalFinishedCount)+")")])])]),t._v(" "),n("div",{staticClass:"ibox",staticStyle:{overflow:"hidden"},on:{click:function(o){t.util.gotoByPath("/workflow/copy",{type:"finished"})}}},[n("div",{staticClass:"ibox-title",staticStyle:{"border-color":"rgb(167, 88, 199)","border-bottom":"1px solid rgb(167, 88, 199)"}},[n("span",{staticClass:"glyphicon glyphicon-list-alt"}),t._v(" "),n("p",{staticClass:"ibox-title-icon"},[t._v("我的已阅("+t._s(t.statisticsCountData.myCopyFinishedCount)+")")])])]),t._v(" "),n("div",{staticClass:"ibox",staticStyle:{overflow:"hidden"},on:{click:function(o){t.util.gotoByPath("/workflow/apply",{})}}},[n("div",{staticClass:"ibox-title",staticStyle:{"border-color":"#FC8675","border-bottom":"1px solid #F3CE85"}},[n("span",{staticClass:"glyphicon glyphicon-leaf"}),t._v(" "),n("p",{staticClass:"ibox-title-icon"},[t._v("我的申请("+t._s(t.statisticsCountData.myApplyAllCount)+")")])])]),t._v(" "),n("div",{staticStyle:{position:"fixed",margin:"auto",bottom:"20px","text-align":"center",width:"100%"}})])},staticRenderFns:[]}}});
//# sourceMappingURL=59.77266e592cd03a34503a.js.map