<template>
  <div class="choose">
      <div class="row" style="margin:0;">
          <search  v-model="search" placeholder="按项目搜索" :autoFixed="false" v-on:keyup.enter.native="handleClick" @on-submit="handleClick" ref="search"></search>
        
      </div>
      
      <div id="scroller">
          <scroller height="-60" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
            <div class="box2">    
                <div v-for="item in improveBillDatas">
                    <div class="card facebook-card animated fadeInUp" @click="showImproveBill(item)">
                    <div class="ribbon-wrapper-green">
                        <div class="ribbon-green" :style="status(item)">
                            {{item.statusName}}
                        </div>
                    </div>
                    <div class="card-header no-border">
                        <div class="facebook-avatar" style="margin: 0;margin-right: 10px;">
                            <img  width="50px" class="border-r" :src="getProjIcon(item)" style="height:50px;">
                        </div>
                        <div class="facebook-date">
                            <span class="c999 title-item">项目:</span>
                            <span style="color: #4a4848;font-size: 14px;">{{item.project == undefined?'':(item.project.length>20?item.project.substr(0,20)+'...':item.project)}}</span>
                        </div>
                        <div class="facebook-date">
                            <span class=" c999" style="width:256px;">整改要求:{{item.improveRequire}}</span>
                            
                        </div>
                        <div class="facebook-date">
                            <span class=" c999 title-item" style="width:53%;">整改人:{{item.improver}}</span>
                            <span class=" c999 ft14">{{item.checkDate}}</span>
                        </div>
                    </div>
    
                </div>

                </div>
                <load-more v-if="!noMore" tip="loading" style="margin-top:0px;"></load-more>
                <div v-if="isEnd || improveBillDatas.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
            </div>
      </scroller>
  </div>
      

	</div>
</template>

<script>
import {mapState,mapGetters, mapActions} from 'vuex'
import { Scroller, LoadMore,Search } from 'vux'
import { util } from '@/utils/utils.js';
export default {
  name: 'sumchoose',
  data () {
    return {
      searValue: '',
      allLoaded: false,
      visit: false,
      improveBillDatas:[],
      advancedQuery: {
        enable: false,//是否高级搜索
        startDate: '',
        endDate: '',
        projUid: ''
      },
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
      searchList: [],
      isEnd: false,
      pageIndex: 1
    }
  },
  watch:{
      temp:function(newVal){
          if(newVal.indexOf("loadCheckImproveList")>=0){
              this.loadTop();
          }
          
      }
  },
  computed: {
    ...mapState({
          userUid: state => state.userUid,
          temp: state => state.temp
       }),
       
  },
  components:{
    Scroller, LoadMore,Search
  },
  created(){
     
      
  },
  activated(){
        var refresh = this.util.getUrlParam("refresh");
		if (this.improveBillDatas.length == 0||refresh==true) {
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
    status(item){
        if(item.improveStatus==4){
            item.statusName="待整改";
            return "background-color:#F5791A";
        }else if(item.improveStatus==5){
            item.statusName="待复检";
            return "background-color:DodgerBlue";
        }else if(item.improveStatus==6){
            item.statusName="已通过";
            return "background-color:green";
        }else if(item.improveStatus==7){
            item.statusName="未通过";
            return "background-color:red";
        }                 
        
    },
    handleClick() {
        if (!this.validUtil.isNotEmpty(this.search)) {
            if (this.list.length > 0) {
                this.improveBillDatas = this.list;
                this.allLoaded = false;
                this.noMore = true;
                this.$nextTick(() => {
                    this.$refs.scrollerBottom.reset()
                });
                return;
            }

        }
        this.improveBillDatas = [];
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
        var xmArr = this.improveBillDatas;
        this.pageIndex = 1;

        this.loadData('downLoad');

    },
    loadData(type, creatTime) {
        var param = {
            search: this.util.isNotEmpty(this.search) ? this.search : null,
            operateType: 'getQualityImproveLists',
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
            if (res.data == undefined || res.data.length == 0) {
                if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
                    _this.searchList = [];
                    _this.improveBillDatas = [];
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
                return;
            }
            if (type == 'downLoad') {
                //下拉
                _this.improveBillDatas = res.data;
                if (_this.validUtil.isNotEmpty(_this.search)) {
                    _this.searchList = _this.data;

                } else {
                    _this.list = _this.improveBillDatas;
                }
                _this.$nextTick(() => {
                    _this.$refs.scrollerBottom.reset()
                });
                // 加载更多数据
                _this.$refs.scrollerBottom.donePulldown();
                _this.onFetching = false;
                if (res.ifEnd) {
                    _this.isEnd = true;
                } else {
                    _this.isEnd = false;
                }
            } else if (type == 'upLoad') {
                _this.improveBillDatas = _this.improveBillDatas.concat(res.data);
                if (_this.validUtil.isNotEmpty(_this.search)) {
                    _this.searchList = _this.improveBillDatas;

                } else {
                    _this.list = _this.improveBillDatas;
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
    showImproveBill(item){
        this.$router.push({name:'improveBillShow',query:{id:item.id}});
        
    }
    
    
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
