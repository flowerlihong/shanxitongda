<template>
    <div class="choose">
        <div class="row row123" style="margin:0;height:1.6rem;">
            <div class="head" ref="searchDiv" id="searchDiv">
                <!-- <mt-search v-model="value">
                                                                                                                							</mt-search> -->
                <el-input placeholder="搜索" type='search' icon="search" v-model="search" v-on:keyup.enter.native="handleClick" :on-icon-click="handleClick">
                </el-input>
            </div>
        </div>
        <div id="scroller" :style="isListView?'background-color: white':'background-color:#e8e5e5;'">
    
            <scroller height="-60" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
                <div v-if="isListView" class="box2">
                    <div v-for="item in data" :key="item.id">
                        <div class="card facebook-card animated fadeInUp" >
                            <div v-if="item.enable == 1" class="ribbon-wrapper-green">
                                <div class="ribbon-green" style="background-color:rgb(90, 214, 145)">
                                    启用
                                </div>
                            </div>
                            <div v-if="item.enable != 1 && item.comEnable == 1" class="ribbon-wrapper-green">
                                <div class="ribbon-green" style="background-color:rgb(90, 214, 145)">
                                    自由流
                                </div>
                            </div>
                            <div v-if="item.enable == undefined || item.enable == 0 && item.comEnable == 0" class="ribbon-wrapper-green">
                                <div class="ribbon-green" style="background-color:#c1c16b;">
                                    未启用
                                </div>
                            </div>
    
                            <div class="card-header no-border">
                                <div class="col-xs-2 facebook-avatar" style="padding:0px;">
    
                                    <div v-if="item.name.length>4" class=" title5">
                                        <p> {{item.name.substring(0,7)}}</p>
                                    </div>
                                    <div v-if="item.name.length<=4" class=" title4">
                                        <p> {{item.name}}</p>
                                    </div>
    
                                </div>
                                <div class="facebook-date head-ft16">
                                    <span class="c999 ft14">修改人：{{item.updateUserName}}</span>
                                </div>
    
                                <div class="facebook-date ">
                                    <span class="c999 title-item">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</span>
                                    <span class="  c999 title-item ">{{item.category == 1?'系统流程':'自定义流程'}}</span>
                                </div>
                                <div class="facebook-date" id="facebook-dateid">
    
                                    <div class="buttons-tab list-op" style="margin-top:0;">
                                       <span>操&nbsp;&nbsp;&nbsp;&nbsp;作：</span>
                                        <a v-if="item.enable == undefined || item.enable == 0" @click="operate(1,item)">
                                            <i class="iconfont icon-ok" style="font-size: 13px;"></i>启用
                                        </a>
                                        <a v-if="item.enable == 1" style="margin-top: -7px;"  @click="operate(2,item)">
                                            <i class="iconfont icon-jinzhi" style="font-size: 19px;margin-left: -4px;"></i><span style="color: #0894ec;margin-left:-3px;">关闭</span>
                                        </a>
                                        <a  @click="operate(3,item)">
                                            <i class="iconfont icon-bianji2" style="font-size: 13px;"></i>设计
                                        </a>
                                        <a v-if="item.comEnable == undefined || item.comEnable == 0" @click="operate(5,item)">
                                            <i class="iconfont icon-ok" style="font-size: 13px;"></i>开启自由流
                                        </a>
                                        <a v-if="item.comEnable == 1" style="margin-top: -7px;"  @click="operate(6,item)">
                                            <i class="iconfont icon-jinzhi" style="font-size: 19px;margin-left: -4px;"></i><span style="color: #0894ec;margin-left:-3px;">关闭自由流</span>
                                        </a>
                                        <a v-if="item.category == 2"  @click="operate(4,item)">
                                            <i class="iconfont icon-remove" style="font-size: 13px;"></i>删除
                                        </a>
                                    </div>
                                </div>
                            </div>
    
                        </div>
    
                    </div>
                    <load-more v-if="!noMore" tip="loading" style="margin-top:0px;"></load-more>
                    <!---->
                </div>
    
            </scroller>
        </div>
        
    </div>
</template>



<script>
import { Timeline, TimelineItem, Scroller, LoadMore, XCircle } from 'vux'

export default {
    components: {
        Timeline, TimelineItem, XCircle,
        Scroller,
        LoadMore
    },
    data() {
        return {
            pulldown: {
                content: '下拉刷新',
                height: 60,
                autoRefresh: false,
                downContent: '下拉刷新',
                upContent: '释放刷新',
                loadingContent: 'Load...',
                clsPrefix: 'xs-plugin-pulldown-'
            },
            pullup: {
                content: '上拉加载更多',
                pullUpHeight: 50,
                height: 40,
                autoRefresh: false,
                downContent: '释放加载更多',
                upContent: '上拉加载更多',
                loadingContent: 'Loading...',
                clsPrefix: 'xs-plugin-pullup-'
            },
            scrollTop: 0,
            onFetching: false,
            bottomCount: 10,
            search: '',
            strokeColor2: '#3FC7FA',
            allLoaded: false,
            check: false,
            selectIds: [],
            advancedQuery: {
                enable: false,//是否高级搜索
                startDate: '',
                endDate: '',
                projUid: ''
            },
            noMore: true,
            items: {
                textAlign: 'left',
                padding: '0 10px',
                height: '2.5rem',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            operateType: null,
            isListView: true,
            pageCount: 0,
            onFetching: false,
            noMore: false,
            list: [],
            searchList: [],
            //data: [{ name: '请假测试流程测试', modelId: '150001', enable: 1, category: 2, createUserName: '张三' }, { name: '请假测试流程', modelId: '150001', enable: 1, category: 2, createUserName: '张三' }, { name: '请假测试流', modelId: '150001', enable: 1, category: 2, createUserName: '张三' }, { name: '请假策', modelId: '150001', enable: 1, category: 2, createUserName: '张三' }, { name: '请假', modelId: '150001', enable: 1, category: 2, createUserName: '张三' }, { name: '请假流程', modelId: '150001', enable: 1, category: 2, createUserName: '张三' }, { name: '报销流程', enable: 0, category: 1 }],
            data:[],
            isEnd: false,
            isStatistics: false,
            pageSize: 10
        }
    },
    mounted() {

        this.$nextTick(() => {
            //console.info("---mounted----");
            this.$refs.scrollerBottom.reset({ top: 0 })
        })
    },
    activated() {
        var _this = this;
        var isStatisticsParam = this.util.getUrlParam("isStatistics");
        this.isStatistics = (this.validUtil.isNotEmpty(isStatisticsParam) && isStatisticsParam == "true") ? true : false;
        var operateType = this.util.getUrlParam("operateType");
        if (this.util.isNotEmpty(operateType)) {
            this.operateType = operateType;
        }

        //console.info(this.isStatistics);
        if (_this.data.length == 0) {
            // console.info();
            _this.loadData();
        } else {
            if (this.$store.state.operate == 'save') {

                _this.loadTop();
            }
        }

    },
    methods: {
        operate(type,item){
            console.info(type);
            if(type== 3){
                //设计
                var param =  { modelId: item.id,key:item.key,formKey:item.formKey,category: 1,name:encodeURI(item.name)};
                if(this.util.isNotEmpty(item.procDefId)){
                    param.procDefId = item.procDefId;
                }
                this.$store.state.preVue = this;
                this.$router.push({ name: 'workflow/model/design', query: param });
            }else if(type == 1 || type == 2){
                if(!this.util.isNotEmpty(item.procDefId)){
                    this.util.failueToast("还没有设定流程！");
                    return null;
                }
                var _this = this;
                _this.util.mask("正在设置...");
				this.util.post('/workflow/bpm/updateBpmConfBase', {  id: item.procDefId ,enable:(type == 1?1:0)}, function (res) {
					//console.info(res);
					if (res != undefined && res.status == 200) {
                        item.enable = (type == 1?1:0);
                        //console.info(item);
					}else{
                        this.util.failueToast("无法修改流程状态！");
                    }
					_this.util.unmask();
				});
            }else if(type == 5 || type == 6){
                
                var _this = this;
                _this.util.mask("正在设置...");
				_this.util.post('/workflow/bpm/updateBpmConfCom', { company: this.$store.state.companyUid,  key: item.comKey ,enable:(type == 5?1:0)}, function (res) {
					//console.info(res);
					if (res != undefined && res.status == 200) {
                        item.comEnable = (type == 5?1:0);
                        //console.info(item);
					}else{
                        _this.util.failueToast("无法修改流程状态！");
                    }
					_this.util.unmask();
				});
            }
            // this.$router.push({ name: 'proj/workLog/info', query: { id: item.id, isReadOnly: true } });
        },
        visitOpen() {
            this.visit = true;
        },
        onScrollBottom() {
            if (this.isEnd) {
                return;
            }
            console.info("******onScrollBottom*******" + this.data.length);
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                this.noMore = false;
                if (this.data.length == 0) {
                    this.loadData();
                } else {
                    this.loadData("downLoad", this.data[this.data.length - 1].createTime);
                }

            }
        }, loadData(type, creatTime) {
            //console.info(type + "******loadData*****" + creatTime);
            //return null;
            //this.util.successToast("正在请求日志信息！");
            var param = {
                createTime: creatTime == undefined ? null : creatTime,
                type: type == undefined ? null : type,
                userUid: this.$store.state.userUid,
                companyUid: this.$store.state.companyUid,
                company: this.$store.state.companyUid,
                isStatistics: this.isStatistics,
                search: this.util.isNotEmpty(this.search) ? this.search : null

            };
            //操作类型
            if (this.util.isNotEmpty(this.operateType)) {
                param.operateType = this.operateType;
            }
            //是否高级搜索
            if (this.advancedQuery.enable) {
                param.advancedQueryEnable = this.advancedQuery.enable;
                param.startDate = this.advancedQuery.startDate;
                param.endDate = this.advancedQuery.endDate;
                param.projUid = this.advancedQuery.projUid;
                param.search = null;
            }
            var state = this.$store.state;
            var _this = this;
            if ((_this.util.isNotEmpty(_this.search) || _this.advancedQuery.enable) && type == undefined) {
                _this.util.mask("正在搜索...");
            }

            _this.onFetching = true;
            // _this.util.mask("正在加载...");
            this.util.post('/workflow/process/findProcess?pageSize=' + _this.pageSize, param, function (res) {
                //_this.util.unmask();
                if ((_this.util.isNotEmpty(_this.search) || _this.advancedQuery.enable) && type == undefined) {
                    _this.util.unmask();
                }
                //console.info("-----------post-----------");
                //console.info(type+"--正在请求成功了！" + res.data.length);
                if (res.data == undefined || res.data.length == 0) {
                    if (type == undefined && (_this.util.isNotEmpty(_this.search) || _this.advancedQuery.enable)) {
                        _this.searchList = [];
                        _this.data = [];
                    }
                    if (type == 'downLoad') {
                        //_this.util.successToast("----0-----")
                        _this.allLoaded = true;// 若数据已全部获取完毕
                        if (res.ifEnd) {
                            _this.isEnd = true;
                        }
                    }
                    //_this.util.successToast("----1-----")
                    _this.noMore = true;
                    //_this.util.successToast("----2-----")

                    _this.$nextTick(() => {
                        _this.$refs.scrollerBottom.reset()
                    })
                    _this.onFetching = false

                    _this.$refs.scrollerBottom.donePullup();
                    _this.$refs.scrollerBottom.donePulldown();
                    //_this.util.successToast("----3-----")
                    return;
                }
                if (type == undefined) {
                    if (_this.validUtil.isNotEmpty(_this.search) || _this.advancedQuery.enable) {
                        var dom = _this.$refs.scrollerBottom.$el;
                        //console.info(dom);
                        dom = $(dom).find('.xs-container')[0];
                        //console.info(dom);
                        //transform-origin: 0px 0px 0px; transform: translateX(0px) translateY(-444px) translateZ(0px) scale(1, 1); transition: none;
                        $(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
                        //console.info(dom);

                        _this.searchList = res.data;

                    } else {
                        _this.list = res.data;
                    }

                    _this.data = res.data;

                    _this.onFetching = false;
                    _this.$nextTick(() => {
                        _this.$refs.scrollerBottom.reset()
                    });
                    _this.$refs.scrollerBottom.donePullup();
                    if (res.ifEnd) {
                        _this.isEnd = true;
                    }
                    _this.noMore = true;
                    return null;

                } else if (type == 'upLoad') {
                    //下拉
                    //var array = res.data.concat(_this.data);
                    //_this.data = array;
                    _this.data = res.data;
                    if (_this.validUtil.isNotEmpty(_this.search) || _this.advancedQuery.enable) {
                        _this.searchList = _this.data;

                    } else {
                        _this.list = _this.data;
                    }
                    _this.$nextTick(() => {
                        _this.$refs.scrollerBottom.reset()
                    });
                    // 加载更多数据
                    // _this.$refs.loadmore.onTopLoaded();
                    _this.$refs.scrollerBottom.donePulldown();
                    _this.onFetching = false
                } else if (type == 'downLoad') {
                    //console.info("downLoad----2-----")
                    _this.data = _this.data.concat(res.data);
                    if (_this.validUtil.isNotEmpty(_this.search) || _this.advancedQuery.enable) {
                        _this.searchList = _this.data;

                    } else {
                        _this.list = _this.data;
                    }
                    //console.info("downLoad----3-----")
                    _this.$nextTick(() => {
                        _this.$refs.scrollerBottom.reset()
                    });
                    //console.info("downLoad----4-----")
                    _this.onFetching = false;
                    _this.$refs.scrollerBottom.donePullup();
                    // console.info(res.ifEnd);
                    if (res.ifEnd) {
                        _this.isEnd = true;
                    }
                    _this.noMore = true;
                    //console.info("sadadsad");
                }

            });
        },
        loadTop() {
            this.onFetching = true;
            //下拉
            //console.info("******loadTop*****");
            var xmArr = this.data;
            //console.info(this);

            //console.info(xmArr);
            if (xmArr.length == 0) {
                
                this.loadData();
                return;
            }
            //console.info(xmArr[0]);
            var startDate = xmArr[xmArr.length - 1].createTime;
            this.loadData('upLoad', startDate);

        },
        handleClick() {
            //console.info("search---" + this.search);
            if (!this.validUtil.isNotEmpty(this.search)) {
                if (this.list.length > 0) {
                    this.data = this.list;
                    this.allLoaded = false;
                    this.noMore = true;
                    this.$nextTick(() => {
                        this.$refs.scrollerBottom.reset()
                    });
                    return;
                }

            }
            this.loadData(null, null);


        }
    }
}
</script>

<style scoped>
.list-op>i{
  

}
.list-op>a{
    margin:1px 10px 0px; 
}
.list-op>span{
    color: #999;
    margin-top:1px;
}
.title4 {
    margin-top: 0px;
    margin-left: 5px;
    /* border: 1px solid red; */
    font-size: 13px;
    height: 55px;
    width: 55px;
    line-height: 55px;
    border-radius: 50%;
    background: rgba(41, 104, 150, 0.63);
    color: #fff;
}

.title5 {
    margin-top: 0px;
    margin-left: 5px;
    /* border: 1px solid red; */
    font-size: 13px;
    height: 55px;
    width: 55px;
    padding-top: 13px;
    border-radius: 50%;
    background: rgba(41, 104, 150, 0.63);
    color: #fff;
}
.buttons-tab:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    right: auto;
    top: auto;
    height: 0px;
    width: 100%;
    background-color: #d0d0d0;
    display: block;
    z-index: 15;
    -webkit-transform-origin: 50% 100%;
    transform-origin: 50% 100%;
}
.list-op {
    margin-top: .2rem;
    font-size: 13px;
    /* border-top: 1px solid #f3f3f3; */
    margin: .5rem 0rem 0 0rem;
     margin: 0px;
    padding: 0px;
    height: 25px;
   
}

h4 {
    color: #000;
}

span {
    color: #bbb;
}

footer {
    padding: 10px;
}

li {
    display: list-item;
    text-align: -webkit-match-parent;
}

.right-panel {
    position: fixed;
    bottom: 1.3rem;
    right: .5rem;
}

.right-panel ul {
    margin: 0;
    padding: 0;
}



div .right-panel li {
    background-color: transparent;
}

a {
    background-color: transparent;
}

a,
button,
input,
select,
textarea {
    outline: 0;
}

a {
    color: #0894ec;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}

a:active,
a:hover {
    outline: 0;
}

img {
    border: 0;
}

img {
    max-width: 100%;
}


.right-panel img {
    width: 85%;
    height: 85%;
}

.right-panel li {
    width: 1.5rem;
    height: 1.5rem;
    list-style: none;
    margin-top: .2rem;
    opacity: .9;
}

.card {
    background: #fff;
    box-shadow: 0 .05rem .1rem rgba(0, 0, 0, .3);
    margin: .5rem;
    position: relative;
    border-radius: .1rem;
    font-size: .7rem;
}

.card {
    box-shadow: /*0 .05rem 0.05rem rgba(0,0,0,.1)*/
    none !important;
    margin: 0.2rem 0.2rem;
}

.card {
    font-size: 0.5rem;
}

.ribbon-wrapper-green {
    overflow: hidden;
    position: absolute;
    width: 2.7rem;
    height: 2.8rem;
    top: -7px;
    right: -7px;
}

.ribbon-green {
    top: 0.25rem;
    width: 5rem;
    font-size: 0.7em;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    position: relative;
    left: -0.3rem;
    background-color: rgb(90, 214, 145);
    color: rgb(251, 251, 251);
}

.card-footer,
.card-header {
    min-height: 2.2rem;
    position: relative;
    padding: .5rem .75rem;
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.card-header {
    border-radius: .1rem .1rem 0 0;
    font-size: .85rem;
}

.card-header,
.card-footer {
    margin: 0;
    font-size: 0.65rem;
    border-bottom: 1px solid #F7F7F7;
    min-height: 0;
    padding: .5rem 0rem;
    margin: 0 .5rem;
}

.facebook-card .card-header {
    display: block;
    padding: .5rem;
}

.facebook-card .card-header {
    display: block;
    padding: .4rem 0rem;
    margin: 0 .2rem;
    padding-top: 0px;
    padding-bottom: 0;
}

.facebook-card .facebook-avatar {
    float: left;
    margin-top: 0.08rem;
}

img {
    border: 0;
}

img {
    max-width: 100%;
}


.border-r {
    border-radius: 50%;
}

.facebook-date {
    position: relative;
}

.facebook-card .facebook-date {
    margin-left: 2.0rem;
    font-size: .35rem;
    color: #5f646e;
}

.facebook-card .facebook-date {
    margin-left: 2rem;
    text-align: left;
    word-break: break-all;
}

.facebook-card .facebook-date.head-ft16 {
    /* font-size: .7rem; */
}



.c999 {
    color: #999;
}

.ft14 {
    font-size: .4rem;
}

.title-item {

    display: inline-block;
    word-wrap: break-word;
    word-break: normal;
}

.card-content {
    position: relative;
}

.card-content {
    margin-top: .5rem;
}

.card-item {
    padding: 0 .5rem;
    margin-bottom: .1rem;
    font-size: .65rem;
    word-break: break-all;
}

.buttons-tab {
    background: #fff;
    position: relative;
}

.buttons-row,
.buttons-tab {
    -webkit-align-self: center;
    align-self: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-lines: single;
    -moz-box-lines: single;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
}

.list-op {
    margin-top:0;
    /* border-top: 1px solid #f3f3f3; */
    margin: .5rem 0rem 0 0rem;
}


a {
    background-color: transparent;
}

a,
button,
input,
select,
textarea {
    outline: 0;
}

a {
    color: #0894ec;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}

.button {
    border: 1px solid #0894ec;
    color: #0894ec;
    text-decoration: none;
    text-align: center;
    display: block;
    border-radius: .25rem;
    /*line-height: 1.25rem;*/
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    background: 0 0;
    padding: 0 .5rem;
    margin: 0;
    height: 1.35rem;
    white-space: nowrap;
    position: relative;
    text-overflow: ellipsis;
    font-size: .7rem;
    font-family: inherit;
    cursor: pointer;
}

.buttons-tab .button {
    color: #5f646e;
    font-size: .8rem;
    width: 100%;
    height: 2rem;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    border: 0;
    border-bottom: 2px solid transparent;
    border-radius: 0;
}

.buttons-tab .button {
    border-bottom: 1px solid transparent;
}

.buttons-tab.list-op .button {
    font-size: .7rem;
}

.choose {
    padding-top: 1.6rem;
}

.row123 {
    width: 100%;
    position: absolute;
    top: 0;
}

.border-r {
    border-radius: 50%;
}
</style>
<style>
#scroller .xs-plugin-pullup-container {
    display: none!important;
}

#scroller .vux-timeline-item-content {
    /* padding: 0 0 0.1rem 0.1rem;*/
    padding: 0 0 0 0;
    padding-left: 0.5rem;
    padding-right: 0.3rem;
    text-align: left;
}

#scroller .vux-timeline {
    padding: 0rem!important;
    padding-left: 0.3rem!important;
}

#scroller .vux-timeline .card-header {
    margin: 0rem!important;
}

#scroller .vux-timeline .card-footer .card-header {
    justify-content: '';
}
</style>
