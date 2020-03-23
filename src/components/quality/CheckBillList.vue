<template>
  <div class="choose">
      <div class="row" style="margin:0;">
          <search  v-model="search" placeholder="搜索" :autoFixed="false" @on-submit="handleClick" ref="search"></search>
      </div>
      
      <div id="scroller">
          <scroller height="-60" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
            <div class="box2">   
                <div v-for="item in checkBillDatas" >
                    <div class="card facebook-card animated fadeInUp" @click="showCheckBill(item)">
                            <div class="ribbon-wrapper-green">
                                <div class="ribbon-green" :style="static(item)">
                                    {{item.staticName}}
                                </div>
                            </div>
                            <div class="card-header no-border">
                                <div class="facebook-avatar" style="margin: 0;margin-right: 10px;">
                                    <img  width="50px" class="border-r" :src="getProjIcon(item)" style="height:50px;">
                                </div>
                                <div class="facebook-date">
                                    <span class="c999 title-item">项目：</span>
                                    <span style="color: #4a4848;font-size: 14px;">{{item.project == undefined?'':(item.project.length>20?item.project.substr(0,20)+'...':item.project)}}</span>
                                </div>
                                <div class="facebook-date">
                                    <span class=" c999" style="width:100px;">检查项:{{item.checkItem}}</span>
                                    
                                </div>
                                <div class="facebook-date">
                                    <span class=" c999 title-item ft14" style="width:53%;">检查人:{{item.checker}}</span>
                                    <span class=" c999 ft14">{{item.checkDate}}</span>
                                </div>
                            </div>
                        </div>
                </div>
                <load-more v-if="!noMore" tip="loading" style="margin-top:0px;"></load-more>
                <div v-if="isEnd || checkBillDatas.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
            </div>
      </scroller>
  </div>
      
    <div class="right-panel">
        <ul>
            <li>
                <a class="mod-li-icon" @click="addCheckBill">
                    <img src="../../public/image/plus-add.png">
                </a>
            </li>

        </ul>
    </div> 
</div>
</template>

<script>
import {mapState,mapGetters, mapActions} from 'vuex'
import { cookieUtil } from '@/utils/utils.js';
import { Scroller, LoadMore,Search } from 'vux'
export default {
  name: 'sumchoose',
  data () {
    return {
      allLoaded: false,
      visit: false,
      checkBillDatas:[],
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
      noMore: false,
      list: [],
      pageIndex: 1,
      searchList: [],
      isEnd: false,
      pageSize: 10,
      projUid:''
    }
  },
  computed: {
		...mapState({
          userUid: state => state.userUid,
          temp: state => state.temp
          
		})		
  },
  watch:{
      temp:function(newVal){
          if(newVal.indexOf("loadCheckBillList")>=0){
              this.loadTop();
          }
          
      }
  },
  created(){
      
  },
  activated(){
      
      this.projUid = this.util.getUrlParam("projUid");//this.$route.query.projUid;
      var refresh = this.util.getUrlParam("refresh");
      if (this.checkBillDatas.length == 0||refresh) {
         this.loadData('upLoad');
      }
  },
  methods: {
    visitOpen() {
      this.visit = true;
    },
    getProjIcon(item){
		
        if (this.util.isNotEmpty(item.projectLogo)) {
            return this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.projectLogo + '&access_token=' + this.util.getAccessToken();
        } else {
            return this.util.getBaseUrl() + '/images/icons/project.png';
        }
    
	},
    addCheckBill(){
        if(!this.util.isNotEmpty(this.projUid)){
            cookieUtil.set("projUid", "");
            cookieUtil.set("projName", "");
        }
        this.$router.push({name:'addQualityInspect'});
    },
    static(item) {
        if(item.checkStatus==4){
            item.staticName='已发整改';
            return "background-color:rgb(90, 214, 145)";
        }else if(item.checkStatus==3){
            item.staticName='未发整改';
            return "background-color:red";
        }else if(item.checkStatus==1){
            item.staticName='警告';
            return "background-color:#cc9933";
        }else if(item.checkStatus==0){
            item.staticName='通过';
            return "background-color:#336666";
        }
    },
    handleClick() {
        if (!this.validUtil.isNotEmpty(this.search)) {
            if (this.list.length > 0) {
                this.checkBillDatas = this.list;
                this.allLoaded = false;
                this.noMore = true;
                this.$nextTick(() => {
                    this.$refs.scrollerBottom.reset()
                });
                return;
            }

        }
        this.checkBillDatas = [];
        this.pageIndex = 1;
        this.loadData("downLoad");
    },
    onScrollBottom() {
			if (this.isEnd) {
				this.$refs.scrollerBottom.donePullup();
				return;
			}
			if (this.onFetching) {
				// do nothing
			} else {
				this.onFetching = true;
				this.noMore = false;
				this.pageIndex = this.pageIndex + 1;
				this.loadData("upLoad");

			}
		},
    loadTop() {
        this.onFetching = true;
        this.isEnd = false;
        var xmArr = this.checkBillDatas;
        this.pageIndex = 1;

        this.loadData('downLoad');

    },
    loadData(type, creatTime) {
        var param = {
            search: this.util.isNotEmpty(this.search) ? this.search : null,
            operateType: 'getCheckBillLists',
            pageIndex: (type == 'upLoad' ? this.pageIndex : 1)
        };
        var state = this.$store.state;
        var _this = this;
        if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
            _this.util.mask("正在搜索...");
        }

        _this.onFetching = true;
        this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat', param, function(res) {
            _this.noMore = true;
            if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
                _this.util.unmask();
            }
            console.debug(res.data);
            if (res.data == undefined || res.data.length == 0) {
                if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
                    _this.searchList = [];
                    _this.checkBillDatas = [];
                }

                if (type == 'upLoad') {
                    _this.allLoaded = true;// 若数据已全部获取完毕
                    if (res.ifEnd) {
                        _this.isEnd = true;
                    }
                }

                _this.$nextTick(() => {
                    _this.$refs.scrollerBottom.reset()
                })
                _this.onFetching = false

                _this.$refs.scrollerBottom.donePullup();
                _this.$refs.scrollerBottom.donePulldown();
                //var dom = _this.$refs.scrollerBottom.$el;
                //dom = $(dom).find('.xs-container')[0];
                //$(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
                return;
            }
            if (type == 'downLoad') {
                //下拉
                _this.checkBillDatas = res.data;
                if (_this.validUtil.isNotEmpty(_this.search)) {
                    _this.searchList = _this.data;

                } else {
                    _this.list = _this.checkBillDatas;
                }
                _this.$nextTick(() => {
                    _this.$refs.scrollerBottom.reset()
                });
                // 加载更多数据
                // _this.$refs.loadmore.onTopLoaded();
                _this.$refs.scrollerBottom.donePulldown();
                _this.onFetching = false;
                if (res.ifEnd) {
                    _this.isEnd = true;
                } else {
                    _this.isEnd = false;
                }
            } else if (type == 'upLoad') {
                _this.checkBillDatas = _this.checkBillDatas.concat(res.data);
                if (_this.validUtil.isNotEmpty(_this.search)) {
                    _this.searchList = _this.checkBillDatas;

                } else {
                    _this.list = _this.checkBillDatas;
                }
                _this.$nextTick(() => {
                    _this.$refs.scrollerBottom.reset()
                });
                _this.onFetching = false;
                _this.$refs.scrollerBottom.donePullup();
                if (res.ifEnd) {
                    _this.isEnd = true;
                } else {
                    _this.isEnd = false;
                }
            }
            if (_this.pageIndex == 1) {
                
            }
        });
    },
    showCheckBill(item){
        this.$router.push({name:'checkBillShow',query:{id:item.id}});
    }
    
    
  },
  components:{
    Scroller, LoadMore,Search
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
.ribbon-wrapper-green {
    overflow: hidden;
    position: absolute;
    width: 2.9rem;
    height: 2.8rem;
    top: -8px;
    right: -7px;
}

.ribbon-green {
    top: 0.4rem;
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
  h4 {
    color: #000;
  }
  span {
    color: #bbb;
  }
footer {
  padding:10px;
}

</style>
