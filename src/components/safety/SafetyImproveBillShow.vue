<template>
  <div class="headStyle">
	<div style="text-align:left;">
		<div class="price">
			<span class="col-xs-3">项目</span>
			<span class="col-xs-9 valueStyle">{{improveBill.project!=undefined&&improveBill.project.length>23? improveBill.project.substring(0,23)+'...':improveBill.project}}</span>
		</div>
		<div class="price">
			<span class="col-xs-3">性质</span>
			<span class="col-xs-9 valueStyle">{{improveBill.checkNature}}</span>
		</div>
		<div class="price">
			<span class="col-xs-3">日期</span>
			<span class="col-xs-9 valueStyle">{{improveBill.checkDate}}</span>
		</div>
		<div class="price">
			<span class="col-xs-3">检查人</span>
			<span class="col-xs-9 valueStyle">{{improveBill.checker}}</span>
		</div>
		<div class="approvalPop">
			<span class="col-xs-4">检查项：</span>
		</div>
		<div style="height:60px">
			<span style="padding-left: 10px;">{{improveBill.checkItem}}</span>
		</div>
		
	</div>
	
	<div style="text-align:left;">
		<div class="approvalPop">
			<span class="col-xs-4">检查结果：</span>
		</div>
		<!--循环部分-->
		<div v-for="(item,index) in improveBillDet" :key="index">
			<div style="height:60px">
				<span style="padding-left: 10px;">{{item.content}}</span>
			</div>
			<div v-if="item.imgs!=undefined&&item.imgs.length>0" class="piaojv" style="border-top:1px solid #eee">
				<span>附件</span>
				<p>
					<img v-for="(img,key) in item.imgs" :key="key" @click="previewImage(img.id,item.imgs)" style="width:50px;height:50px;margin:0 5px;" :src="webUrl+'/attachmentAction!look.action?id='+img.id" alt="">
				</p>
			</div>
			<div style="margin-top: 5px;padding: 13px 0 13px 10px;border-top:1px solid #eee">
				<checker v-model="checkResult" default-item-class="demo5-item" selected-item-class="demo4-item-selected">
					<checker-item disabled  value="0">通过</checker-item>
					<checker-item disabled  value="1">口头警告</checker-item>
					<checker-item disabled  value="2">书面整改</checker-item>
				</checker>
			</div>
		</div> 
	</div>
	<div style="text-align:left;">
		<div class="price" style="background:#eee;overflow:hidden">
			<span class="col-xs-4">整改要求</span>
		</div>  
		<div style="height:60px">
			<p style="padding-left: 10px;">{{improveBill.improveRequire}}</p>
		</div>
		<div class="price">
			<span class="col-xs-3">整改人</span>
			<span class="col-xs-9 valueStyle">{{improveBill.improver}}</span>
		</div>
		<!-- <div class="price">
			<span class="col-xs-3">抄送人</span>
			<span class="col-xs-9 valueStyle">{{improveBill.copyer}}</span>
		</div> -->
		<div class="price">
			<span class="col-xs-3">完成时间</span>
			<span class="col-xs-9 valueStyle">{{improveBill.finishTime}}</span>
		</div>
	</div>  
  	<!--回复记录-->
	<div>
		<div class="reply" >
			<div class="reply-head">
				<span>整改回复</span>
			</div>
			<p v-if="replyRecords.length==0" style="padding:10px;margin:0;background:#fff;">还没有整改回复哦</p>
			<div v-if="replyRecords.length>0" class="reply-list">
				<ul>
					<li v-for="item in replyRecords" >
						<div class="reply-fl-img">
							<img :src="item.picture" alt="">
						</div>
						<div class="reply-fr-box">
							<div class="reply-head-box">
								<span v-if="item.type==1" class="reply-name">整改人：{{item.improver}}</span>
								<span v-if="item.type==2" class="reply-name">复检人：{{item.improver}}</span>
								<span class="reply-time">{{item.checkTime}}</span>
							</div>
							<div class="reply-content" id="reply-div-content">{{item.resultMesg}}</div>
							<img v-for="(img,key) in item.imgs" :key="key" style="width:40px;height:40px;" @click="previewImage(img.id,item.imgs)" :src="webUrl+'/attachmentAction!look.action?id='+img.id+'&access_token='+access_token" class="reply-content">
						</div>
					</li>
				</ul>
			</div>
			
		</div>
		
	</div>
	<div class="footer">
		<p>
			<x-button v-if="improveType==1" @click.native="reply()" mini style="width:70%;height: 40px;" type="primary">整改回复</x-button>
			<x-button v-if="improveType==2" @click.native="reply()" mini style="width:70%;height: 40px;background: #3399cc;" type="primary">复检回复</x-button>
		</p>
	</div>
	<!--整改回复-->
	<div v-transfer-dom>
      <popup v-model="popupShow" position="right" width="100%">
        <div>
			<div class="price">
				<span class="col-xs-3">{{improveType==1? '整改人':'复检人'}}</span>
				<span class="col-xs-9 valueStyle">{{userName}}</span>
			</div>
			<div style="text-align:left;background:#fff">
				<x-textarea :max="100" style="width: 100%;" v-model="replyContent" placeholder="请输入回复内容" ref="content"></x-textarea>
			</div>
			<Attachment :model="attachmentModel" style="border-top:1px solid #eee;background:#fff"></Attachment>
			<div v-if="improveType==2" style="background-color: #fff;">
				<div class="foot" style="padding-top:0;">
					<p>复检结果：</p>
					<div style="padding: 13px 0 13px 10px;border-top:1px solid #eee">
						<checker v-model="recheckResult" default-item-class="demo5-item" selected-item-class="demo4-item-selected">
							<checker-item value="6">通过</checker-item>
							<checker-item value="7">不通过</checker-item>
						</checker>
					</div>
				</div>
			</div>
		</div>
		<nav class="navbar navbar-default navbar-fixed-bottom" style="padding-left: 10px;">
			<p>
				<x-button @click.native="popupClose()" mini style="width:48%;height: 45px;border: 1px solid #ccc;" type="default">取消</x-button>
				<x-button  @click.native="saveReply()" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
			</p>
		</nav>
        
      </popup>
    </div>
  </div>
</template>

<script>
import Attachment from '../common/Attachment.vue'
import {mapState,mapGetters, mapActions} from 'vuex'
import { Checker, CheckerItem,Popup,TransferDom,XButton,XTextarea} from 'vux'
import { Indicator } from 'mint-ui';
export default {
  name: 'approval',
  components:{
      // 名字
      Checker, CheckerItem,Popup,TransferDom,Attachment,XButton,XTextarea
  },
  directives: {
     TransferDom
  },
  data () {
    return {
		improveBill:{},
		improveBillDet:[],
		recheckResult:'',
		replyRecords:[],  //回复记录
		attachmentModel: {
			title: '上传附件',
			fileList: [],
			deleteFilesList: []
		},
		bootBtn: {padding:'5px 10px',marginTop:'10px',height:'1.5rem'},
		checkResult: '2',  
    	webUrl: '',  //图片访问路径前缀
		access_token:'',
    	popupShow: false,
    	deleteImg: false,
		fileImgs:[],
		replyContent: '',     //回复内容
		//improveStatus: 6, //复检结果
    	improveType: 0,   //1整改人回复，2复检人回复
		id:''
		
    }
  },
   created(){
		  this.webUrl = this.util.getBaseUrl();
		  this.access_token = this.util.getAccessToken();
		  this.util.initWxJsSdk(this);
  },
  activated(){
		  this.id = this.util.getUrlParam("id");
		  this.loadData();
		
  },
  computed: {
  	...mapState({
			userName: state => state.userName,
			userUid: state => state.userUid
  		})
  },
  methods: {
	   loadData(){
		   var isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? true : false;
		   var _this = this;
		   if(isNewFlag){
			   this.util.mask();
				var _this=this;
				var param = {
						operateType:'getSafetyImproveDataByid',
						id:this.id
				};
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
					_this.util.unmask();
					if (res.status == 200) {
						_this.improveBill=res.data;
						_this.improveBillDet = res.data.subFormData;
						_this.replyRecords = res.data.replyRecords;
						var checker = _this.improveBill.checkerIds.split(",");
						var improverUid = _this.improveBill.improverUid;
						_this.improveType=0;
						if((_this.improveBill.improveStatus==4||_this.improveBill.improveStatus==7||_this.improveBill.improveStatus==5)&&improverUid==_this.userUid){
							_this.improveType=1;
						}else if(_this.improveBill.improveStatus==5&&_this.isInArray(checker,_this.userUid)){
							_this.improveType=2;
						}
						// console.debug("improveType==="+_this.improveType);
					}
					
				});
		   }
			
	   },
	   isInArray(arr,value){
			for(var i = 0; i < arr.length; i++){
				if(value === arr[i]){
					return true;
				}
			}
			return false;
		},
  		previewImage(curId,curData){
			var imgId = this.webUrl+'//attachmentAction!look.action?id='+curId+'&access_token='+this.access_token;
			var imgIds=[];
			for(var i=0;i<curData.length;i++){
				imgIds.push(this.webUrl+'//attachmentAction!look.action?id='+curData[i].id+'&access_token='+this.access_token);
			}
			this.wx.previewImage({
				current: imgId, // 当前显示图片的http链接
				urls: imgIds // 需要预览的图片http链接列表
			});
		},
		reply(){
			this.popupShow = true;
		},
		saveReply(){
			if(!this.validUtil.isNotEmpty(this.replyContent)){
				this.util.failueToast("请输入回复内容！");
				return;
			}
			this.util.mask("正在保存..");
			var _this = this;
			var checkDate = new Date().format("yyyy-MM-dd hh:mm");
			var mainData = {CONTENT_:this.replyContent,IMPROVE_STATUS_:this.recheckResult,TYPE_: this.improveType,
			CHECK_UID_:this.id,CHECK_TIME_:checkDate};
			var replyType = "5";
			if(this.improveType==2){
				replyType=this.recheckResult;
			}
			//遍历附件
			var filesData = new Array();
			for (var i in this.attachmentModel.fileList) {
				var file = this.attachmentModel.fileList[i];
				if (file.isNewFlag) {
					filesData.push(file);
				}
			}
			this.util.post("/admin/appDefaultFormAction!saveData.action",{mainFormData:JSON.stringify(mainData),filesData:JSON.stringify(filesData),deleteFilesData: _this.attachmentModel.deleteFilesList.join(","),
				sqlTableName:"T_SAFETY_CHECK_IMPROVE",replyType:replyType,checkId:_this.id},function(result){
				if(result.success){
					_this.updateBillStatus(replyType,_this.id);
					_this.util.unmask()
					_this.popupShow = false;
					_this.attachmentModel.fileList=new Array();
					_this.attachmentModel.deleteFilesList=new Array();
					_this.replyContent="";
					_this.loadData();
					_this.$store.state.ifRefreshSafetyBillList=true;
				}else{
					_this.util.unmask()
					_this.util.alert(result.msg);
				}
			});
			
			
		},
		updateBillStatus(replyType,checkId){
			var _this=this;
			var param = {
					operateType:'updateBillStatus',
					replyType:replyType,
					checkId:checkId
			};
			this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
				if (res.status == 200) {
					_this.util.setTemp(_this,"loadSafetyImproveList"+Math.random().toString(36).substr(2));
					
				}else{
					_this.util.failueToast("更新单据状态失败");
				}
				
				
			});
		},
		popupClose(){
			this.popupShow = false;
		}
		
  }
}
</script>

<style lang="scss" scoped>
.price{
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
}
.price>span{
	padding: 0 10px;
}
.valueStyle{
	text-align:right;
}
.reply-head{
	text-align: left;
	height: 50px;
	line-height: 60px;
	padding-left:15px; 
	background:#F5F5F5;
	border-top: 1px solid #E2E2E1;
	border-bottom: 1px solid #E2E2E1;
	color: #B4B4B4;
}
.reply-list li{
	padding: 15px;
	border-bottom:1px solid #F2F2F2;
	overflow: hidden;
}
.reply-fl-img{
	width:40px;
	height: 40px;
	float: left;
	// background:red;
	// borderRadius:'50%'
	border-radius: 5px;
	margin-right:8px;
}
.reply-fr-box{
	text-align: left;
}
.reply-head-box{
	overflow: hidden;
	margin-bottom: 0px;
	text-align: left;
	font-size: 14px;
	color:#909090;
}

.reply-time{
	float: right;
	color:#C7C7C7;
}
.reply-content{
	max-width: 14%;
	margin-left:48px;
	margin-right: -39px;
	margin-top: 3px;
}
#reply-div-content{
	max-width:100%;
}
.demo5-item {
  width: 94px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
}
.demo5-item-selected {
  background: #ffffff url(../../assets/demo/checker/active.png) no-repeat right bottom;
  border-color: #ff4a00;
}
.demo4-item-selected {
  background-color: #FF3B3B;
  color: #fff;
}

.foot {
	height:100%;
	line-height: 48px;
	p {
		margin: 0;
		padding: 0 0 0 10px;
		background: #eee;
		border-bottom: 1px solid #ccc;
		
	}
	.footColor {
		color: #000;
		font-weight: bold;
	}
}

.position-horizontal-demo {
  position: relative;
  height: 100%;
  .vux-close {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(4);
    color: #000;
  }
}
.addsection {
  height: 3rem;
  padding: 20px 10px;
  background: #fff;
}
.approvalTop {
	// padding: 10px 10px 0 10px;
    height: 2rem;
    line-height: 1.4rem;

	.approvalTop_m {
		padding: 10px 10px 0 10px;
		border-bottom: 1px solid #ccc;
	}
}
.approvalPop {
	height: 49px;
	line-height: 48px;
	border-top: 1px solid #eee;
	background: #eee;
	span {
		padding: 0 10px;
	}
	div {
		text-align: right;
	}
}
.foot {
	height:8%;
	line-height: 48px;
	background-color: #fff;
	p {
		margin: 0;
		// color: blue;
		background: #eee;
		border-bottom: 1px solid #ccc;
		span {
			color: #f00;
		}
	}
	.footColor {
		color: #000;
		font-weight: bold;
	}
	#approvalPerson>li{
		float: left;
	}
	#approvalPerson {
		height: 3rem;
		li {
			float:left;
		}
	}
}
</style>
