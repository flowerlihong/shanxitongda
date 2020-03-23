<template>
  <div style="">
    <blur :blur-amount=40 class="user-logo" :url="avatar">
      <p class="center"><img :src="avatar"></p>
	  <h4>{{userName}}</h4>
    </blur>
    <flexbox :gutter="0" class="count-items">
      <flexbox-item class="countItem">
	  		<h4>{{lateCount}}</h4>
			<span>本月迟到</span>
	  </flexbox-item>
	  <flexbox-item class="countItem">
	  		<h4>{{earlyCount}}</h4>
			<span>本月早退</span>
	  </flexbox-item>
	  <flexbox-item @click.native="myLeaveList" class="countItem">
	  		<h4>{{leaveCount}}</h4>
			<span>本月请假</span>
	  </flexbox-item>
    </flexbox>
	<div id="signCenter" class="container">
			<ul class="row signCenter">
				<li v-for="m in signList" @click="goto(m.path)" class="col-xs-4" style="height:116px;box-sizing:border-box">
					<span :class="m.icon" :style="m.style" class="glyphicon"></span>
					<h4>{{m.text}}</h4>
				</li>
				<li v-for="m in emptyList" :key="m.id" class="col-xs-4" style="height:116px;box-sizing:border-box">
	 
				</li>
			</ul>
		</div>

		
  </div>
  
</template>
<!-- <router-view v-wechat-title="$route.meta.title"></router-view> -->
<script>
import { mapState, mapActions } from 'vuex'
import { Flexbox, FlexboxItem, Blur,Datetime,Group } from 'vux'
import axios from 'axios'
export default {
  name: 'sign',
  components: {
    Blur,
    Flexbox,
    FlexboxItem,Datetime,Group
  },
  data () {
    return {
    	signItem: [
    		{text: '本月迟到',count:'0'},
    		{text: '本月早退',count:'0'},
    		{text: '本月请假',count:'0'},
    	],
    	signStyle: {width:'80px',height:'80px',border:'1px solid #eee',borderRadius:'50%'},
    	signList:[
    		{text: '考勤签到',icon:'glyphicon-map-marker',style:'color:#3774d2',path:'checkWork'},
			{text: '外勤签到',icon:'glyphicon-flag',style:'color:#81da40',path:'checkOutWork'},
    		{text: '考勤记录',icon:'glyphicon-pencil',style:'color:#FAC605',path:'attRecord'},
			{text: '请假申请',icon:'glyphicon-leaf',style:'color:#666699',path:'addLeave'}
    	],
		emptyList: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
		lateCount:0,  //迟到
		earlyCount:0, //早退
		leaveCount:0, //请假
		exportDate:new Date().format("yyyy-MM"),
		exportVisible:false,
		headUrl:''
    }
  },
  computed: {
  	...mapState({
  		userName: state => state.userName,
		userUid: state => state.userUid,
		userId: state => state.userId,
  		avatar: state => state.avatar
  	}),
  },
  created(){
	  //js-sdk
	  this.util.initWxJsSdk(this);
	  this.getRecordMothCount();
  	
  },
  activated(){
		
  },
  methods: {
		getRecordMothCount(){
			this.util.mask();
			var _this=this;
			var param = {
					operateType:'getRecordMothCount',
					userId:this.userId
			};
			this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",param,function(res){
				_this.util.unmask();
				if (res.status == 200) {
					_this.lateCount =res.data.lateCount;  //迟到
					_this.earlyCount =res.data.earlyCount;  //早退
					//_this.leaveCount =data.leaveCount;  //请假
				}
				
				
			});
		},
		myLeaveList(){
			this.$router.push({name:'workflow/apply',query:{formKey:'leave'}});
		},
		closeDialog(){
			this.exportVisible=false;
		},
		exportData(){
			this.exportVisible=false;
			
			window.open(this.util.getBaseUrl()+"/wx/register/exportCheckRecord?exportDate="+this.exportDate+"&access_token="+this.util.getAccessToken());
			
		}
		
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.center {
  text-align: center;
  padding-top: 20px;
  color: #fff;
  font-size: 18px;
}
.center img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ececec;
}
.signTop {
	height: 7rem;
	padding: 20px 0 5px 0;
	background: #3BA9ED;
	color: #fff;
}
#signCenter {

	.signCenter {
		li {
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		padding: 25px 0;
		 	span {
		 		font-size: 25px;
		 	}
		}
	}
}
.count-items{
	height: 81px;
	overflow: hidden;
	background-image:linear-gradient(to bottom,#d2dbd8, #b2cdd8,#cae1e8);
}
.container .row{
	text-align: center;
}
.container .row h4{
	font-size: 14px;
	
}
.countItem{
	border-right: 1px solid #ccc;
	padding: 10px 0;
	text-align: center;
	// background: #1AC4FC;
	color: rgb(67,102,119);
	// background-image:url(http://p.qlogo.cn/bizmail/W3RpRGtwT3na3XnfzzBZZDmTqzITmxOo3PwtISLAyVeqy3uRV0ibN8A/);
}
.countItem:nth-child(3){
	border-right:0 none;
}
.countItem>h4{
	font-size: 22px;
	margin: 0;
}
.signTopList {
	padding: 56px 0;
	li {
		padding: 10px 0;
		background: #1AC4FC;
	}
}
.user-logo{
	height: 168px !important;
}
</style>
