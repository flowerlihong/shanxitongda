<template>
  <div class="choose">
      <div style="margin:0;">
        <search  v-model="search" placeholder="搜索考勤点" :autoFixed="visit" @on-submit="handleClick" ref="search"></search>
        
      </div>
      
       <swipeout>
         <div id="scroller">
            <scroller height="-60" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
              <div class="box2">
                <swipeout-item :threshold=".5" v-for="(item,key) in pointDatas" underlay-color="#ccc" :key="key">
                  <div slot="right-menu">
                    <swipeout-button @click.native="deletePoint(item)" type="warn">删除</swipeout-button>
                  </div>
                  <div @click="gotoPointEdit(item)" slot="content" :style="items" class="demo-content vux-1px-t" >
                    <span style="margin-top:0;font-size: 14px;color:#101001">{{item.name}}</span>
                    <p style="color: #9f9f9f;">{{item.address}}</p>
                  </div>
                </swipeout-item>
                <load-more v-if="!noMore" tip="loading" style="margin-top:0px;"></load-more>
                <div v-if="isEnd || data.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
              </div>
          </scroller>          
        </div>
	  </swipeout>
      
      
      <div class="footer" >
        <div >
			<p @click="addPoint" style="color:#fff"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-edit"></i>添加考勤点</p>
		</div>
    </div>
    

	</div>
</template>

<script>
import {mapState,mapGetters, mapActions} from 'vuex'
import { SwipeoutButton,Swipeout, SwipeoutItem } from 'vux'
import { Scroller, LoadMore,Search } from 'vux'
export default {
  name: 'setCheckPoint',
  data () {
    return {
      value: '',
      allLoaded: false,
      visit: false,
      search:'',
      items: {
          textAlign: 'left',
          padding: '10px 10px',
          borderBottom: '1px solid #eee',
          justifyContent: 'center',
          alignItems: 'center'
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
      pointDatas:[],
      onFetching: false,
      noMore: false,
      list: [],
      searchList: [],
      data: [],
      isEnd: false,
      isStatistics: false,
      pageSize: 10
      
    }
  },
  created(){
       
  },
  activated(){
      var refresh = this.util.getUrlParam("refresh");
      if (this.pointDatas.length == 0||refresh) {
        this.loadData();
      }
         
  },
  computed: {
    ...mapState({
      
       })
      
  },
  methods: {
      onScrollBottom() {
          if (this.isEnd) {
              return;
          }
          if (this.onFetching) {
              
          } else {
              this.onFetching = true;
              this.noMore = false;
              if (this.pointDatas.length == 0) {
                  this.loadData();
              } else {
                  this.loadData("downLoad", this.pointDatas[this.pointDatas.length - 1].createTime);
              }

          }
        }, 
        loadData(type, creatTime) {
            
            var param = {
					search: this.util.isNotEmpty(this.search) ? this.search : null,
					operateType:'getPoints',
					pageIndex : (type == 'upLoad'?this.pageIndex:1)
			};
            var _this = this;
            if (_this.util.isNotEmpty(_this.search)&& type == undefined) {
                _this.util.mask("正在搜索...");
            }

            _this.onFetching = true;
            this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat', param, function (res) {
                
                if (_this.util.isNotEmpty(_this.search) && type == undefined) {
                    _this.util.unmask();
                }
                if (res.data == undefined || res.data.length == 0) {
                    if (type == undefined && _this.util.isNotEmpty(_this.search) ) {
                        _this.searchList = [];
                        _this.pointDatas = [];
                    }
                    if (type == 'downLoad') {
                        _this.allLoaded = true;// 若数据已全部获取完毕
                        if (res.ifEnd) {
                            _this.isEnd = true;
                        }
                    }
                    _this.noMore = true;

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
                    if (_this.validUtil.isNotEmpty(_this.search) ) {
                        var dom = _this.$refs.scrollerBottom.$el;
                        
                        dom = $(dom).find('.xs-container')[0];
                        $(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
                        
                        _this.searchList = res.data;

                    } else {
                        _this.list = res.data;
                    }
                    _this.pointDatas = res.data;

                    _this.onFetching = false;
                    _this.$nextTick(() => {
                        _this.$refs.scrollerBottom.reset()
                    });
                    if (res.ifEnd) {
                        _this.isEnd = true;
                    }
                    _this.$refs.scrollerBottom.donePullup();
                    _this.noMore = true;
                    return null;

                } else if (type == 'upLoad') {
                    //下拉
                    
                    _this.pointDatas = res.data;
                    if (_this.validUtil.isNotEmpty(_this.search)) {
                        _this.searchList = _this.pointDatas;

                    } else {
                        _this.list = _this.pointDatas;
                    }
                    _this.$nextTick(() => {
                        _this.$refs.scrollerBottom.reset()
                    });
                    // 加载更多数据
                    _this.$refs.scrollerBottom.donePulldown();
                    _this.onFetching = false
                } else if (type == 'downLoad') {
                    _this.data = _this.data.concat(res.data);
                    if (_this.validUtil.isNotEmpty(_this.search) ) {
                        _this.searchList = _this.pointDatas;

                    } else {
                        _this.list = _this.pointDatas;
                    }
                    _this.$nextTick(() => {
                        _this.$refs.scrollerBottom.reset()
                    });
                    _this.onFetching = false;
                    _this.$refs.scrollerBottom.donePullup();
                    
                    if (res.ifEnd) {
                        _this.isEnd = true;
                    }
                    _this.noMore = true;
                }

            });
        },
        loadTop() {
            this.onFetching = true;
            //下拉
            var xmArr = this.pointDatas;
            if (xmArr.length == 0) {
                
                this.loadData();
                return;
            }
            var startDate = xmArr[xmArr.length - 1].createTime;
            this.loadData('upLoad', startDate);

        },
    handleClick() {
        if (!this.validUtil.isNotEmpty(this.search)) {
            if (this.list.length > 0) {
                this.pointDatas = this.list;
                this.allLoaded = false;
                this.noMore = true;
                this.$nextTick(() => {
                    this.$refs.scrollerBottom.reset()
                });
                return;
            }

        }
        this.loadData(null, null);


    },
    gotoPointEdit(item){
        this.$router.push({name:'pointEdit',query:{pointData:item,isEdit:true}});
    },
    deletePoint(point){
        var _this=this;
        var param = {
            operateType:'deletePoint',
            pointId:point.id
        };
        this.util.confirm('确定要删除此考勤点?',function(){
            _this.util.mask("正在删除...");
            _this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat',param,function(data){
                if(data.status==200){
                    _this.util.unmask();
                    _this.pointDatas = _this.pointDatas.filter((item) => {
                          return item!=point;
                    });
                }else{
                    _this.util.unmask();
                    _this.util.alert("删除失败！");
                }
            });
        });
        
    },
    addPoint(){
      this.$router.push({name:'setingPoint'});
    }

  },
  components:{
    SwipeoutButton,Swipeout, SwipeoutItem,Scroller, LoadMore,Search
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
p {
    margin: 0 0 0px;
}
  
.footer{
	position: fixed;
	bottom:0;
	width: 100%;
	height: 43px;
	padding: 10px 0;
	background:#336699;
}

</style>
