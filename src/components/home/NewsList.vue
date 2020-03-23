<template>
    <div class="choose">
        <!-- <div class="head">
            <search  v-model.trim="search" placeholder="搜索项目名称" :autoFixed="false"  @on-submit="searchFunc()" ref="search">
                </search>
        </div> -->
        <scroller height="-62" lock-x scrollbar-y use-pullup use-pulldown :pullup-config="pullup" :pulldown-config="pulldown"  @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
    
        <div >            <!-- class="vux-1px-t" -->
            <div v-for="(item,index) in newsData" :key="index">
                <div class="news-card" @click="showDetail(index)">
                    <div class="news-title">{{item.title}}</div>
                    <div class="news-type c999">
                        <span>类型：</span><span :class="item.type =='发文管理'?'fw-color':'tg-color'">{{item.type}}</span>
                        <span class="newsTime">{{item.DocCreated}}</span>
                    </div>
                    <div v-if="item.statusName =='未读'" class="ribbon-wrapper-green">
                        <div class="ribbon-green" style="background-color:red;">
                            未读
                        </div> 
                    </div>                    
                    <div v-if="item.statusName =='已读'" class="ribbon-wrapper-green">
                        <div class="ribbon-green" style="background-color:#5ad691;">
                            已读
                        </div>
                    </div>
                </div>
            </div>
            
          
                
            
        <div v-if="isEnd " class="noMore" style="padding:10px;text-align: center;">已没有更多</div>  
        </div>
      
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
        
       
    </div>
</template>
<script>
import {  Search, Swipeout,SwipeoutItem,SwipeoutButton,Scroller,Spinner } from 'vux'
import {mapState,mapGetters, mapActions} from 'vuex'
import { cloneObj ,sessionUtil} from "@/utils/utils.js";
export default {

  data(){
    return{
            search:'',
            disabled:false,          
            newsData:[],
            pageNum:0,
            pageSize:10,
            isEnd:false,
            pullupEnabled: true,
            status: {
                pullupStatus: 'default',
                pulldownStatus: 'default'
            },
            pulldown: {
                content: '下拉刷新',
                height: 60,
                autoRefresh: false,
                downContent: '下拉刷新',
                upContent: '释放刷新',
                loadingContent: '刷新中...',
                clsPrefix: 'xs-plugin-pulldown-'
            },
            pullup: {
                content: '上拉加载更多',
                pullUpHeight: 50,
                height: 40,
                autoRefresh: false,
                downContent: '释放加载更多',
                upContent: '上拉加载更多',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            },
            sqlTableName:'U008_Graphic_Progress'
            
      }
  },
  components:{
        Search,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,        
        Scroller,
        Spinner 
  },
  computed:{
      ...mapState({
          userUid: state => state.userUid

		   })
  },
  created(){
      
        
  },
  mounted(){
     // this.loadPageList();
  },
  activated(){
      var type = this.util.getUrlParam("pType");
      this.refresh (); 
     // if(type&& type == "saveBack");
      this.$refs.scroller.reset();

  }
  ,
  methods:{
      searchFunc(){
          this.refresh()
      },
      showDetail(index){
          var _this = this
          
          this.$router.push({name:'newsDetails',query:{type:encodeURI(_this.newsData[index].type),Id:_this.newsData[index].Id}})
      },
      
     loadMore () {
         console.log('More--pageNum',this.pageNum)
         this.querryData(1,this.pageNum)

        
        setTimeout(() => {
          this.$refs.scroller.donePullup();
          
        }, 10)
     
    },
    refresh () {
        this.pageNum=0;
      
        this.querryData(0,this.pageNum)
      this.$nextTick(() => {
         setTimeout(() => {
             this.$refs.scroller.donePulldown()
            this.pullupEnabled && this.$refs.scroller.enablePullup();
         }, 0);
         
        })
      
    },
    querryData(type,start){
        this.util.mask()      
    
        var  _this = this;

    var url = "/admin/appAgentAction!runAgent.action?agentId=Agent_Sys_GetToDoInfo&operateType=getRemindMessageInfo&sqlTableName=View_ACT_RU_TASK&userId=";
        var params = {start:_this.pageNum,limit:_this.pageSize}
      this.util.get(url,params,function(res){
          console.log(res)
          _this.newsData=type ==1? _this.newsData.concat(res.data):cloneObj(res.data);
         if( res.data.length < _this.pageSize ){
             _this.changePullupStatus(false);
             _this.isEnd = true;
         }          
          _this.pageNum+=res.data.length;         
           _this.util.unmask()
      })
    }
    ,
    changePullupStatus (enabled) {
      if (enabled) {
        this.$refs.scroller.enablePullup()
        this.pullupEnabled = true;        
      } else {
        this.$refs.scroller.disablePullup()
        this.pullupEnabled = false;
        
      }
    }

  }
}
</script>
<style lang="less" scoped>
.news-card{
    font-size: 0.5rem;
    border-bottom: 1px solid #F7F7F7;
    min-height: 0;
    padding: .4rem 0rem;
    margin: 0 .2rem;
    position: relative;
    text-align: left;
}
.news-title{
    font-size: 16px;
    
    color: #00A7E9;
}
.news-type{
    font-size: 14px;
}
.newsTime{
    float: right;
   margin-right: 0.2rem;
}
.ribbon-wrapper-green {
    overflow: hidden;
    position: absolute;
    width: 2.7rem;
    height: 2.8rem;
    top: 0px;
    right: -0.2rem;
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
.textOmit{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
   
}
.fw-color{
    color: #4a9ab1;
}
.tg-color{
    color: rgb(137, 148, 210);
}
/* .box2-wrap {
  height: 300px;
  overflow: hidden;
} */
.rotate {
  display: inline-block;
  transform: rotate(-180deg);
}
.pullup-arrow {
  transition: all linear 0.2s;
  color: #666;
  font-size: 25px;
}
</style>


