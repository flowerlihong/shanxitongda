<template>
    <div class="choose">
        <div class="row row123" style="margin:0;height:1.6rem;">
                                                                                                   						
                <search  v-model="search" type='search' placeholder="搜索" :autoFixed="false" @on-submit="handleClick" v-on:keyup.enter.native="handleClick" ref="search"></search>
            
        </div>
        <div id="scroller" :style="isListView?'background-color: white;':'background-color:#e8e5e5;'">

            <scroller height="-43" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
                <div v-if="isListView" class="box2">
                    <div v-for="item in data" :key="item.id">
                        <div class="card facebook-card animated fadeInUp" @click="showDetail(item)">
                            <div class="ribbon-wrapper-green">
                                <div class="ribbon-green" :style="percent(item)">
                                    {{item.rs}}
                                </div>
                            </div>

                            <div class="card-header no-border" style="margin-left:0px;margin-right:0px;">
                                <div class="facebook-avatar">

                                    <img v-if="isExistProjIcon(item)" width="50px" height="50px" class="border-r" :src="getProjIcon(item)">

                                    <div v-else width="50px" height="50px" class="border-r projIcon"></div>

                                </div>
                                <div class="facebook-date head-ft16">
                                    <span class="c999 ft14">{{item.fsrq}}</span>
                                </div>

                                <div class="facebook-date"  style="font-size: 11pt;">
                                    <span class="">项目:</span>
                                    <span style="color: #4a4848;" class="xianzhi">{{item.xmmc == undefined?'':(item.xmmc.length>15?item.xmmc.substr(0,15)+'...':item.xmmc)}}</span>
                                </div>
                                <div class="facebook-date">

                                    <span class=" c999 title-item "  style="width:50%;float:left;font-size:9pt;padding-left:0px;padding-right:0px;">天气:{{item.tq}}</span>
                                    <span class=" c999 title-item " style="width:50%;text-align:right;font-size:9pt;padding-left:0px;padding-right:10px;">创建人:{{item.czy}}</span>

                                </div>
                            </div>

                        </div>

                    </div>
                    <!--<load-more v-if="!noMore" tip="loading" style="margin-top:0px;"></load-more> -->
                    <div v-if="isEnd || data.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>

                   
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
import {  Search,Timeline, TimelineItem, Scroller, LoadMore, XCircle } from 'vux'

export default {
    components: {
        Search, Timeline, TimelineItem, XCircle,
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
            pageIndex:1,
            onFetching: false,
            noMore: false,
            list: [],
            searchList: [],
            data: [],
            isEnd: false,
            isStatistics: false,
            projUid: null,
            pageSize: 10
        }
    },
    mounted() {

        this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({ top: 0 })
        })
    },
    activated() {
        this.util.unmask();
        var _this = this;
        this.pageIndex = 1;
        var isStatisticsParam = this.util.getUrlParam("isStatistics");
        this.isStatistics = (this.validUtil.isNotEmpty(isStatisticsParam) && isStatisticsParam == "true") ? true : false;
        var operateType = this.util.getUrlParam("operateType");
        var projUid = this.util.getUrlParam("projUid");
        this.projUid = projUid;
        if (this.util.isNotEmpty(operateType)) {
            this.operateType = operateType;
        }

       // console.info(this.isStatistics);
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
            return this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.projectLogo + '&access_token=' + this.util.getAccessToken();
        },
        percent(item) {
            return  "background-color:rgb(90, 214, 145)";
        },
        isExistProjIcon(item) {
            return this.util.isNotEmpty(item.projectLogo) ? true : false;
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
                    this.loadData("pullup");
                }

            }
        }, loadData(type) {
            //console.info(type + "******loadData*****" + creatTime);
            //return null;
            //this.util.successToast("正在请求日志信息！");
            var param = {
                type: type == undefined ? null : type,
                userUid: this.$store.state.userUid,
                companyUid: this.$store.state.companyUid,
                isStatistics: this.isStatistics,
                pageIndex: (type == 'pullup' ? this.pageIndex : 1),
                operateType: 'getList',
                search: this.util.isNotEmpty(this.search) ? this.search : null

            };
           
            //是否高级搜索
            if (this.advancedQuery.enable) {
                param.advancedQueryEnable = this.advancedQuery.enable;
                param.startDate = this.advancedQuery.startDate;
                param.endDate = this.advancedQuery.endDate;
                param.projUid = this.advancedQuery.projUid;
                param.search = null;
            }
            if (this.util.isNotEmpty(this.projUid)) {

                param.projUid = this.projUid;
            }
            param.pageIndex = this.pageIndex;
            var state = this.$store.state;
            var _this = this;
            if ((_this.util.isNotEmpty(_this.search) || _this.advancedQuery.enable) && type == undefined) {
                _this.util.mask("正在搜索...");
            }

            _this.onFetching = true;
            // _this.util.mask("正在加载...");
            this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WorkLog&appId=WeChat' + _this.pageSize, param, function(res) {
                //_this.util.unmask();
                if ((_this.util.isNotEmpty(_this.search) || _this.advancedQuery.enable) && type == undefined) {
                    _this.util.unmask();
                }
                //console.info("-----------post-----------");
                console.debug(res.data);
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
                        } else {
						_this.isEnd = false;
					}
                    }
                    if (type == 'upLoad') {
                        _this.searchList = [];
                        _this.data = [];
                        _this.allLoaded = true;// 若数据已全部获取完毕
                        if (res.ifEnd) {
                            _this.isEnd = true;
                        } else {
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
                    if (res.ifEnd) {
                        _this.isEnd = true;
                    } else {
						_this.isEnd = false;
					}
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
                    } else {
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
            //console.info(this.$store.state.userUid + "=" + item.createUserName + "=" + item.createUser);
            if (this.sessionUtil.getUserId() == item.AddName) {
                this.$router.push({ name: 'proj/workLog/info', query: { id: item.Id, isReadOnly: false } });
            } else {
                this.$router.push({ name: 'proj/workLog/info', query: { id: item.Id, isReadOnly: true } });
            }

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
            this.$router.push({ name: 'proj/workLog/info', query: { isReadOnly: false,projUid:this.projUid } });
        }, query() {
            this.$store.state.preVue = this;
            this.$router.push({ name: 'proj/workLog/query', query: {} });
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
    padding-top: 44px!important;
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
    top: -8px;
    right: -7px;
}

.ribbon-green {

    top: 0.25rem;
    width: 5rem;
    font-size: 0.7em;
    text-align: center;
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
    padding-bottom: 0.2rem;
}

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
}

.facebook-date {
    position: relative;
}

.facebook-card .facebook-date {
    margin-left: 1.8rem;
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

</style>
<style>
.row123 .weui-search-bar__label{
    line-height:24px;
}

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
