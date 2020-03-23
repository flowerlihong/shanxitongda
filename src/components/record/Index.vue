<template>
    <div class="choose" style="background-color: #e4e8e8;">
        <div class="row row123" style="margin:0;height:1.6rem;">
            
                <div class="mint-searchbar"><div class="mint-searchbar-inner"><i class="mintui mintui-search"></i> <input type="search" placeholder="搜索" @click="handleClick" v-model="search" @keyup="handleClick" class="mint-searchbar-core"></div> <a class="mint-searchbar-cancel" style="display: none;">取消</a></div>
                <!-- <mt-search v-model="value">
                                                                                                            							</mt-search> -->
                <!-- <el-input placeholder="搜索" type='search' icon="search" v-model="search" v-on:keyup.enter.native="handleClick" :on-icon-click="handleClick">
                </el-input> -->
        </div>
        <div id="scroller" :style="isListView?'background-color:rgb(243, 241, 241);margin-top: 5px!important;':'background-color:rgb(243, 241, 241);margin-top: 10px!important;'">

            <scroller height="-40" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
                <div v-if="isListView" class="box2">
                    <div v-for="item in data" :key="item.id">
                        <div class="card facebook-card animated fadeInUp" @click="showDetail(item)">

                            <div class="ribbon-wrapper-green">
                                <div class="ribbon-green" style="background-color:rgb(90, 214, 145)">
                                    {{item.count}}
                                </div>
                            </div>
                            <div class="card-header no-border">
                                <div class="facebook-avatar">

                                    <img v-if="isExistProjIcon(item)" width="50px" height="50px" class="border-r" :src="getProjIcon(item)">

                                    <div v-else width="50px" height="50px" class="border-r projIcon"></div>

                                </div>
                                <div class="facebook-date head-ft16">
                                    <span class="c999 ft14">{{util.isNotEmpty(item.updateDate)?'最新上传'+item.updateDate:'未上传'}}</span>
                                </div>

                                <div class="facebook-date">
                                    <span class="c999 title-item">项目</span>
                                    <span style="    color: #4a4848;">{{item.projName == undefined?'':(item.projName.length>19?item.projName.substr(0,19)+'...':item.projName)}}</span>
                                </div>
                                <div class="facebook-date">

                                    <span class=" c999 title-item" style="width:50%;float:left;font-size: 12px;">负责人:{{item.xmfzr }}</span>
                                    <span class=" c999 title-item" style="width:50%;font-size: 12px;">最新上传:{{item.updateUserName}}</span>

                                </div>
                            </div>

                        </div>

                    </div>
                    <div v-if="isEnd" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
                    <!---->
                </div>

            </scroller>
        </div>
        <div class="right-panel">
            <ul>
                
                <li>
                    <a class="mod-li-icon" @click="add">
                        <img src="../../public/image/plus-add.png">
                    </a>
                </li>

            </ul>

        </div>
    </div>
</template>



<script>
import { Timeline, TimelineItem, Scroller, LoadMore, XCircle } from 'vux'
import {cookieUtil } from '@/utils/utils.js'
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
            pageIndex:1,
            data: [],
            isEnd: false,
            isStatistics: false,
            pageSize: 10,
            projUid:''
        }
    },
    mounted() {

        this.$nextTick(() => {
            //console.info("---mounted----");
            this.$refs.scrollerBottom.reset({ top: 0 })
        })
    },
    activated() {
        this.util.init(this);
        var _this = this;
        this.projUid = this.util.getUrlParam("projUid");
        var isStatisticsParam = this.util.getUrlParam("isStatistics");
        this.isStatistics = (this.validUtil.isNotEmpty(isStatisticsParam) && isStatisticsParam == "true") ? true : false;
        var operateType = this.util.getUrlParam("operateType");
        if (this.util.isNotEmpty(operateType)) {
            this.operateType = operateType;
        }
        this.pageIndex = 1;
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
        getProjIcon(item) {
            //console.info(this.util.getBaseUrl()+'/attachment/look?id='+item.icon+'&access_token='+this.util.getAccessToken());
            return this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.icon + '&access_token=' + this.util.getAccessToken();
        },
        isExistProjIcon(item) {
            return this.util.isNotEmpty(item.icon) ? true : false;
            //console.info(item);
        },
        visitOpen() {
            this.visit = true;
        },
        onScrollBottom() {
            if (this.isEnd) {
                this.$refs.scrollerBottom.donePullup();
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
				    this.pageIndex = this.pageIndex + 1;
                    this.loadData("pullup", this.data[this.data.length - 1].createTime);
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
                isStatistics: this.isStatistics,
                operateType: 'getList',
                search: this.util.isNotEmpty(this.search) ? this.search : null
                //projUid: this.util.isNotEmpty(this.projUid) ? this.projUid : null
            };
            param.pageIndex = this.pageIndex;
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
            this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Record&appId=WeChat' + _this.pageSize, param, function(res) {
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
                    if (type == 'pullup') {
                        //_this.util.successToast("----0-----")
                        _this.allLoaded = true;// 若数据已全部获取完毕
                        if (res.ifEnd) {
                        _this.isEnd = true;
                    }else {
						_this.isEnd = false;
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
                    var dom = _this.$refs.scrollerBottom.$el;
                    dom = $(dom).find('.xs-container')[0];
                    $(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
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
                    _this.noMore = true;
                    return null;

                } else if (type == 'pulldown') {
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
                    if (res.ifEnd) {
                        _this.isEnd = true;
                    }else {
						_this.isEnd = false;
					}
                    // 加载更多数据
                    // _this.$refs.loadmore.onTopLoaded();
                    _this.$refs.scrollerBottom.donePulldown();
                    _this.onFetching = false
                } else if (type == 'pullup') {
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
                    }else {
						_this.isEnd = false;
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
            this.loadData('pulldown', startDate);

        },
        showDetail(item) {
            this.$store.state.temp = item;
            console.info(item);
            this.$router.push({ name: 'record/show', query: { id: item.Id,projUid:item.Id, isReadOnly: true } });

            /*
            var _this = this;
            this.util.mask();
            this.util.post('/mobile/wx/safety/getImproveBillDetail', { checkId: item.id }, function (result) {
              _this.util.unmask();
              _this.$router.push({
                name: 'safetyImproveBillShow', query: {
                  improveBill: item,
                  improveBillDet: result.improveDetail, replyRecords: result.replyRecords
                }
              });
            });
            */
        },
        contains(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        },
        deleteData() {

        },
        deleteGou(item) {


        }, add() {
            if(!this.util.isNotEmpty(this.projUid)){
                cookieUtil.set("projUid", "");
                cookieUtil.set("projName", "");
            }
            this.$router.push({ name: 'record/info', query: { isReadOnly: false } });
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

.choose {
    padding-top: 1.1rem!important;
}
.projIcon {
    background-image: url(../../public/image/project.png);
    width: 50px;
    height: 50px;
    border: 0px;
    background-size: 50px 50px;
    background-repeat: no-repeat;
}

.projIconSmall {
    background-image: url(../../public/image/project.png);
    width: 40px;
    height: 40px;
    border: 0px;
    background-size: 40px 40px;
    background-repeat: no-repeat;
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
    /*border-radius: .3rem;*/
    font-size: .7rem;
}

.card {
    box-shadow: /*0 .05rem 0.05rem rgba(0,0,0,.1)*/
    none !important;
    margin: 0.3rem 0.3rem;
}

.card {
    font-size: 0.5rem;
}

.ribbon-wrapper-green {
    overflow: hidden;
    position: absolute;
    width: 2.7rem;
    height: 2.0rem;
    top: 0px;
    right: 0px;
}

.ribbon-green {

    top: 0.15rem;
    width: 5rem;
    font-size: 0.7em;
    text-align: center;
    transform: rotate(45deg);
    position: relative;
    left: -0.23rem;
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

/* .facebook-card .facebook-avatar {
    float: left;
    margin-top: 0.15rem;
    margin-left: 0.12rem;
    height:50px;
} */

.facebook-card .facebook-avatar {
    float: left;
    margin-top: 0.12rem;
    margin-left: 0.00rem;
}

img {
    border: 0;
}

img {
    max-width: 100%;
}


.border-r {
    border-radius: 50%;
    max-height: 100%
}

.facebook-date {
    position: relative;
}

.facebook-card .facebook-date {

    font-size: .35rem;
    color: #5f646e;
}

.facebook-card .facebook-date {
    margin-left: 1.8rem;
    text-align: left;
    word-break: break-all;
}

.facebook-card .facebook-date.head-ft16 {
    /* font-size: .7rem; */
}
.facebook-card .facebook-date {
    margin-left: 1.7rem;
    font-size: .35rem;
    color: #5f646e;
    text-align: left;
    word-break: break-all;
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
    margin-top: .2rem;
    font-size: .6rem;
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
    line-height: 1.25rem;
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
    line-height: 2rem;
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
.mint-searchbar{
    width: 100%;
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
