<template>
  <div class="choose">
      <div class="row" style="margin:0;border:0px;">
          <!--
        <div class="col-xs-3 row-select" >
           <div @click="changeSelectModel" class="row-select-span">{{rowSelect}}&nbsp;<i></i> 
            <div class="options">
              <div>
                <ul>
                  <li v-for="i in itemList" @click.stop="option(i)">{{i}}</li>
                </ul>
                <s></s>
              </div>
            </div>
        </div>
        </div>
        -->
        <div class="head col-xs-12 sousuo " style="height: 43px;padding:0px;">
            <!-- <div class="weui-search-bar" id="searchBar" style="margin-left: 5px;">
                <form class="weui-search-bar__form" id="headFrom">
                    <div class="weui-search-bar__box">
                        <i class="weui-icon-search"></i>
                        <input type="search" class="weui-search-bar__input"  id="searchInput" v-model="search" @blur="serachHaldel" placeholder="搜索" required/>
                        <a href="javascript:" style="line-height: 34px;color: #09BB07;" class="weui-icon-clear" id="searchClear"></a>
                    </div>
                    <label class="weui-search-bar__label" @click="searchText" id="searchText">
                        <i class="weui-icon-search"></i>
                    </label>
                </form>
                <a href="javascript:" class="weui-search-bar__cancel-btn " @click="searchCancel" id="searchCancel">取消</a>
            </div> -->
            <search  v-model="search" placeholder="搜索" :autoFixed="false"  @on-submit="handleClick" ref="search" style="padding:0;height:100%;"></search>
            <!-- <input type="search" placeholder="搜索" class="sousuo1" v-model="search"  @keyup.enter="handleClick">    -->
        </div>
       
      </div>
       
      <!-- 此处循环, 后端返回的 数组 -->
      <div id="scroller">
          <scroller height="-45" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
            <div class="box2">    
  
          <div @click="showCheckBill(item)" v-for="item in newsDatas" class="user-caption-load" :style="items" style="background:#fff;padding-top:6px;margin: 10px 0;border-top:0px solid rgb(204, 204, 204);">
                <div class="col-xs-12" style="padding:5px 0px 0px 85px;color:#bbb;position:relative;">
                    <div style="width:100%;">
                        <h4 style="font-size:15px;">{{item.title}}</h4>
                        <span>{{item.createrq}}</span>
                    </div>
                  <img v-if="item.newsPic!=undefined" :src="webUrl+'/attachmentAction!look.action?id='+item.newsPic" style="height:48px;width:75px;position:absolute;left:0;top:0;border-radius:8px;">
                </div>
                <div class="user-caption">
                    <div class="user-fl-name">
                      <i style="padding-right: 5px;font-size: 16px;color:#336666" class="glyphicon glyphicon-user"></i>{{item.addName}}
                    </div>
                    <div class="user-fr-name">
                      <span><i class="glyphicon glyphicon-eye-open"></i>&nbsp;&nbsp;{{item.readNum==undefined? 0:item.readNum}}</span>
                      <span><i class="glyphicon glyphicon-comment"></i>&nbsp;&nbsp;{{item.commentNum==undefined? 0:item.commentNum}}</span>
                      <span><i class="glyphicon glyphicon-thumbs-up"></i>&nbsp;&nbsp;{{item.likeNum==undefined? 0:item.likeNum}}</span>
                      
                    </div>
                </div>
                
          </div>
       <load-more v-if="!noMore" tip="loading" style="margin-top:0px;"></load-more>
                <div v-if="isEnd || newsDatas.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
            </div>
      </scroller>
  </div>
      
    <!-- <div class="footer">
		<div @click="addNews">
			<p><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-edit"></i>发布新闻</p>
		</div>
	</div> -->

	</div>
</template>

<script>
import {mapState,mapGetters, mapActions} from 'vuex'
import { Scroller, LoadMore,Search } from 'vux'
export default {
  name: 'sumchoose',
  data () {
    return {
      itemList:[],
      rowSelect:'',
      billType:'safety',
      allLoaded: false,
      check: false,
      advancedQuery: {
        enable: false,//是否高级搜索
        startDate: '',
        endDate: '',
        projUid: ''
      },
      items: {
          textAlign: 'left',
          padding: '5px 10px',
          height:'auto',
          borderBottom: '0px solid #ccc',
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
      scrollTop: 0,
      onFetching: false,
      bottomCount: 10,
      search: '',
      noMore: false,
      list: [],
      searchList: [],
      isEnd: false,
      pageIndex: 1,
      newsDatas:[],
      webUrl:'',
      access_token:''
    }
  },
  computed: {
		...mapState({
          userUid: state => state.userUid

		   }),
       computedList () {
        var _this = this;
         return this.newsLists.filter( (item) => {
           return item.project.toLowerCase().indexOf(_this.searValue.toLowerCase()) != -1
         }); 
     }
			
  },
  created(){
		this.webUrl=this.util.getBaseUrl() ;		
        this.access_token = this.util.getAccessToken();
        // var _this=this;
        // this.util.loadDic({dicName:'新闻类型',type:1},function(data){
		// 	for(var i=0;i<data.length;i++){
		// 		_this.itemList.push(data[i].value);
		// 	}
        //     _this.rowSelect=data[0].value;
        //     _this.loadData();
		// });
  },
  components:{
    Scroller, LoadMore,Search
  },
  activated(){
      this.util.init(this);
    //   var refresh = this.util.getUrlParam("refresh");
    //   if (this.newsDatas.length == 0||refresh) {
    //      this.loadData('upLoad');
    //   }
    this.newsDatas=[{title:"关于外来文件管理",createrq:"2018-03-29",newsPic:undefined,readNum:66,likeNum:44,commentNum:30}]
  },
  methods: {
    option(item){
      this.rowSelect=item
      this.loadData();
       $('.options').slideUp();
    },
    changeSelectModel(){
      $('.options').slideToggle();
    },
    addNews(){
        this.$router.push({name:'news/add'});
    },
    searchText(){
        $('#searchBar').addClass('weui-search-bar_focusing');
        $('#searchInput').focus();
    },
    serachHaldel(){
        if(!this.search.length) this.cancelSearch();
    },
    cancelSearch(){
        this.hideSearchResult();
        $('#searchBar').removeClass('weui-search-bar_focusing');
        $('#searchText').show();
    },
    searchCancel(){
        cancelSearch();
        $('#searchInput').blur();
    },
    hideSearchResult(){
        $('#searchResult').hide();
        $('#searchInput').val('');
    },
    showCheckBill(item){
        this.$router.push({name:'news/show',query:{id:item.id,newsLogoId:item.newsPic}});
    },
    handleClick() {
        if (!this.validUtil.isNotEmpty(this.search)) {
            if (this.list.length > 0) {
                this.newsDatas = this.list;
                this.allLoaded = false;
                this.noMore = true;
                this.$nextTick(() => {
                    this.$refs.scrollerBottom.reset()
                });
                return;
            }

        }
        this.newsDatas = [];
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
        var xmArr = this.newsDatas;
        this.pageIndex = 1;

        this.loadData('downLoad');

    },
    loadData(type, creatTime) {
        var param = {
            search: this.util.isNotEmpty(this.search) ? this.search : null,
            operateType: 'getNewsLists',
            pageIndex: (type == 'upLoad' ? this.pageIndex : 1)
        };
        var state = this.$store.state;
        var _this = this;
        if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
            _this.util.mask("正在搜索...");
        }

        _this.onFetching = true;
        this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_News&appId=WeChat', param, function(res) {
            _this.noMore = true;
            if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
                _this.util.unmask();
            }
            if (res.data == undefined || res.data.length == 0) {
                if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
                    _this.searchList = [];
                    _this.newsDatas = [];
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
                _this.newsDatas = res.data;
                if (_this.validUtil.isNotEmpty(_this.search)) {
                    _this.searchList = _this.data;

                } else {
                    _this.list = _this.newsDatas;
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
                _this.newsDatas = _this.newsDatas.concat(res.data);
                if (_this.validUtil.isNotEmpty(_this.search)) {
                    _this.searchList = _this.newsDatas;

                } else {
                    _this.list = _this.newsDatas;
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
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.footer{
	position: fixed;
	bottom:0;
	width: 100%;
	height: 43px;
	padding: 10px 0;
	background:#cccccc;
}

.sousuo1{
    height:36px;
    width:100%;
    box-sizing:border-box;
    border:1px solid #bfcbd9;
    padding-left:5px;
    position:relative;
}
.sousuo::before{
    content:'|';
    position: absolute;
    left:-2px;
    top:17px;
    color:#131F13;
    z-index:80;
}
.choose{
  background:#eee;
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
.user-caption{
  height: 32px;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid rgba(236, 228, 228, 0.68);
  line-height: 32px;
}
.user-caption .user-fl-name{
  float: left;
}
.user-caption .user-fr-name{
  float: right;
}
.user-caption .user-fr-name .icon-user-fr{
    background:red;
    padding: 0px 3px 0px 5px;
    border-radius: 7px  0px 0px 7px;
    color:#fff;
}
.user-caption .user-fr-name span{
  display: inline-block;
}
.user-caption .user-fl-name img{
    width: 28px;
    height: 28px;
    border-radius: 50%;
}
.choose .head{
  padding-left: 0;
  height: 56px;
}
.choose .head input{
  border-left: 0 none;
  
}
.choose .row {
  position: relative;
  border-bottom:1px solid rgb(204, 204, 204);
}
.choose .row .options{
  display: none;
  position: absolute;
  background-color: #fff;
  z-index: 2;
  top: 44px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
.choose .row .options s{
  content:'';
  width: 10px;
  height: 10px;
  background:#fff;
  position: absolute;
  top:-6px;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  transform: rotate(45deg)
  
}
.choose .row .options ul{
  margin:0;
}
.choose .row .row-select{
  height: 56px;
  background: #eee;
  padding: 0 0 0 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row-select-span{
  box-sizing: border-box;
  background:#fff;
  display: block;
  height: 36px;
  width: 100%;
  overflow: hidden;
  line-height: 36px;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  border-right: 0 none;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  border-top-right-radius: 0 0;
  border-bottom-right-radius: 0 0;
}
.row-select-span i{
  position: relative;
}
.row-select-span i::after{
  content:'';
  width:0px;
  height: 0px;
  box-sizing: content-box;
  display: inline-block;
  border:5px solid #ccc;
  border-bottom:5px solid transparent;
  border-right:5px solid transparent;
  border-left:5px solid transparent;
  position: absolute;
  top: 5px;
  right: -7px;
}

h4{
  margin:0;
  margin-bottom:10px;
}
span{
  margin-bottom:  5px;
  display: block 
}
#searchBar{
 padding: 0;
    width: 100%;
    height: 36px;
    border: 1px solid #bfcbd9;
    line-height:30px;
    border-left: 1px solid transparent;
}
   .head.sousuo::before{
       content:''
   }
   #headFrom:after{
       border-radius:0;
   }
   #searchCancel{
       padding:0 15px;
       line-height:34px;
   }
</style>
<style>
  .sousuo input{
    border-left: 0 none;
    border-top-left-radius: 0 0;
    border-bottom-left-radius: 0 0;
  }
  .sousuo input:focus{
    border-color:#bfcbd9;
  }
 
  .sousuo .el-input::before{
  content:'';
  color:#ccc;

}
</style>

