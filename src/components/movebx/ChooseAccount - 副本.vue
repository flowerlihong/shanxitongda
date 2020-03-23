<template>
  <div class="chooseAccount">
        <search  v-model="search" placeholder="搜索" :autoFixed="false" 
                @on-submit="handleClick" ref="search">
        </search>
        <div id="scroller">
            <scroller height="-100" :use-pulldown="true" style="padding-top: 5px;" 
						:pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" 
						lock-x @on-pulldown-loading="refresh" @on-pullup-loading="loadMore" 
						ref="scrollerBottom">
				<div class="box2" style="margin-top:5px;text-align: left;">	
					<li style="padding:10px;border-bottom:1px solid #eee;position:relative;text-indent:0px;" 
						@click="checkItem($event,index,item)" v-for="(item,index) in accountList" :key="index" >
						<div class="accoutCont">
                            <div class="iconCont">
                                 <icon type="circle" class="icon-success" v-show="!item.checked" style="font-size:16px;"></icon>
						        <icon type="success" class="icon-success" v-show="item.checked" style="font-size:16px;"></icon>
                            </div>
                            <div class="infoCont">
                                <div class="name">
                                    <span class="accountName nameColor"> 账户名称：</span>
                                    <span class="accountName2 ">
                                        {{item.accountName.length>12?item.accountName.substring(0,12)+"···":item.accountName}}
                                    </span>
                                </div>
                                <div >
                                    <span class="accountName nameColor">{{item.checked}} 开户行：</span>
                                    <span class="accountName2 ">
                                        {{item.openBank.length>12?item.openBank.substring(0,12)+"···":item.openBank}}
                                    </span>
                                </div>
                            </div>
                        </div> 
					</li>
					
					<div v-if="isEnd || accountList.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
				</div>
			</scroller>
        </div>
  </div>
</template>

<script>
import { Search,Scroller,Icon } from "vux";
import sessionUtil from "@/utils/utils.js";
export default {
    name: 'ChooseAccount',
  data(){
      return{
          search:'',
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
				content: '',
				pullUpHeight: 50,
				height: 40,
				autoRefresh: false,
				downContent: '',
				upContent: '',
				loadingContent: 'Loading...',
				clsPrefix: 'xs-plugin-pullup-'
            },
            accountList:[],
            isEnd:false,
            companyId:'',
            totalIndex:0,
            pageSize:10,
            radio:0
      }
  },
  components:{
      Search,Scroller,Icon
  },
  props:['acountMess'],
  created(){
      var _this=this;
  },
  activated(){
      
      this.companyId = this.sessionUtil.getCompanyId();
      console.log('acountMess------',this.companyId);
      this.refresh()
  },
  methods:{
      handleClick(){

      },
      refresh(){
           var _this=this;
          var obj = {
              Company:_this.companyId
          }
          var sql = "select t.* from U012_Account_Manager t  where t.lock = '-5' "
                    
          var params ={
						operateType:'queryDataByEncSql',
						 param:JSON.stringify(obj),//限制某字段=某值
						// searchParams:JSON.stringify(searchParams),//搜索字段，模糊查询
						querySql : _this.util._encode(sql),						
						orderByName:'DocCreated DESC',
						totalRows:_this.totalIndex+_this.pageSize,
						firstRows:_this.totalIndex
                      }
          var url = '/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat';            
          this.util.post(url,params,function (res) {
             _this.accountList = res.data;
             for(let i =0;i<_this.accountList.length;i++){
                 _this.accountList[i].checked = false;
             }
             _this.accountList[2].checked=true
             console.log('data--------',_this.accountList)
          })  
      },
      loadMore(){

      },
      checkItem($event, index, item) {
			for(var i=0;i<this.accountList.length;i++ ){
				this.accountList[i].checked=false;
            }
            var _this =this;
           _this.$set(item,'checked',true)             
            //item.checked=!item.checked;           
            console.log(this.accountList)
			this.radio = index + 1;
			this.checkSee = true;
		},
  }
}
</script>

<style lang="less" scoped>
    .nameColor{
        color:#54aac4;
    }
    .accoutCont{
        display: flex;
        .iconCont{}
        .infoCont{
            flex:1;
           // display: flex;
           .name{
               display: flex;
               .accountName1{
                flex:1;
            }
           }
            
        }
    }
</style>



