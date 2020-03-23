import Vue from 'vue'
import { baseUrl } from '@/utils/utils.js'

(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            // var _newFontSize = 20 * ( clientWidth / 320 );
            //控制_newFontSize的范围，让html的最大宽度在320和640之间
            // if(_newFontSize > 40){
            //     _newFontSize = 40;
            // }else if(_newFontSize < 20){
            //     _newFontSize =20;
            // }

            docEl.style.fontSize = 30 * (clientWidth / 320) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


export default Vue.mixin({
    methods: {
        // 路由跳转公用函数
        goto(value, obj) {
            if (obj != undefined && obj.query != undefined) {
                this.$router.push({ path: '/' + value, query: obj.query });
            } else {
                this.$router.push('/' + value);
            }

            // this.$router.push({name:value});
        },
        // 时间公用函数
        formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [year, month, day].join('-');
        }
    }
})


//'http://1p72v13441.51mypc.cn:10488/WebApp';
var Vueurl = baseUrl();
Vue.prototype.url = Vueurl;
Vue.prototype.Jsonp = function(url, param, callBack, errBack) {
    this.$http.jsonp(this.url + url, {
        params: param
    }).then((response) => {
        callBack(response)
    }, (response) => {
        errBack(response)
    }, (onRejected) => {})
}

//测试组件
var hello = Vue.extend({
    template: '<div><div class="d1">hello world</div></div>'
})
Vue.component('hello', hello);