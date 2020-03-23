<template>
  <div class="headStyle">
	   <div class="approvalMiddle" style="text-align:left;">
		   <div class="price">
			    <span class="col-xs-3">项目</span>
				<span class="col-xs-9 valueStyle">{{checkBill.project!=undefined&&checkBill.project.length>23? checkBill.project.substring(0,23)+'...':checkBill.project}}</span>
			</div>
			<div class="price">
				<span class="col-xs-3">性质</span>
				<span class="col-xs-9 valueStyle">{{checkBill.checkNature}}</span>
			</div>
			<div class="price">
				<span class="col-xs-3">日期</span>
				<span class="col-xs-9 valueStyle">{{checkBill.checkDate}}</span>
			</div>
			<div class="price">
				<span class="col-xs-3">检查人</span>
				<span class="col-xs-9 valueStyle">{{checkBill.checker}}</span>
			</div>
			<div class="approvalPop">
	  			<span class="col-xs-4">检查项:</span>
	  		</div>
			<div style="height:60px">
	  			<span style="padding-left: 10px;">{{checkBill.checkItem}}</span>
	  		</div>

			
	   </div>
 
	  	<div class="middle" :style="left">
	  		<div class="approvalPop">
	  			<span class="col-xs-4">检查结果：</span>
	  		</div>
			<!--循环部分-->
			<div v-for="item in improveItem">
				<div class="piaojv">
					<span>{{item.content}}</span>
				</div>
				<div v-if="item.imgs!=undefined&&item.imgs.length>0" class="piaojv">
					<span>附件</span>
					<p>
						<img v-for="img in item.imgs" @click="previewImage(img.id,item.imgs)" 
						style="width:50px;height:50px;margin:0 5px;" :src="webUrl+'/attachmentAction!look.action?id='+img.id+'&access_token='+access_token" alt="">
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
		<div style="text-align: left;">
			<div class="price" style="background:#eee">
				<span class="col-xs-4">整改要求<span style="color:red">*</span></span>
			</div>
			<div style="text-align:left;">
				<x-textarea :max="100" style="width: 100%;" v-model="improveRequest" placeholder="请输入您的整改要求" ref="content"></x-textarea>
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd"><span>整改人<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd myCell-bd" @click="selectRectifier()">
					<span>{{improverModel.userName}}</span>
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd"><span>抄送人</span></div>
				<div class="weui-cell__bd myCell-bd" @click="selectCopyer()">
					<span>{{copyerModel.userName}}</span>
				</div>
			</div>
			<div class="price" style="text-align:left;border-bottom: 1px solid #eee;">
				<span class="col-xs-3">完成日期</span>
				<datetime title="" class="col-xs-9 no-line"  v-model="pickerValue" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>
			
		</div>
		
	<div class="footer">
		<p>
			<x-button @click.native="saveData()" mini style="width:60%;height: 45px;" type="primary">保存</x-button>
		</p>
	</div>
	<!--选择整改人-->
	<mt-popup v-model="improverModel.visible" position="right"
		popup-transition="popup-fade" style="width:100%;height:100%">
		<SelectUser :userModel="improverModel" ref="profile" @selectUsersCallBack="checkImprover($event)"></SelectUser>
	</mt-popup>
	<!--选择抄送人-->
	<mt-popup v-model="copyerModel.visible" position="right"
		popup-transition="popup-fade" style="width:100%;height:100%">
		<SelectUser :userModel="copyerModel" ref="copyfile" ></SelectUser>
	</mt-popup>

  </div>
</template>

<script>
import {mapState,mapGetters, mapActions} from 'vuex'
import { Checker, CheckerItem,XButton,Datetime,XTextarea} from 'vux'
import SelectUser from '../common/SelectUser.vue'
export default {
  name: 'approval',
  components:{
      // 名字
      Checker, CheckerItem,SelectUser,XButton,Datetime,XTextarea
  },
  data () {
    return {
		left: {textAlign:'left'},
		bootBtn: {padding:'5px 10px',marginTop:'10px',height:'1.5rem'},
		improveRequest: '',   //整改要求
    	improverModel:{
			visible:false,
			singer:true,
			users:{}
		},
    	copyerModel:{       //抄送人
			visible:false, 
			userName:'',
			userUid:'',
			users:{}
		},
    	pickerValue: new Date().format("yyyy-MM-dd"),
		beginDate: new Date(),
		checkResult: '2',
		checkId:'',  //整改单id
		checkBill:{},   //整改单信息
		improveItem:[],  //整改明细
		webUrl:'',
		access_token:''
		
    }
  },
  computed: {
  	...mapState({
  			userUid: state => state.userUid,
			managerConfigData: state => state.managerConfigData,
			groupId: state => state.groupId
  		})
  	
  },
   created(){
		this.webUrl = this.util.getBaseUrl();
		this.access_token = this.util.getAccessToken();

	 
   },
   activated(){
		// this.checkBill = this.$route.query.checkBill;
		// this.improveItem = this.$route.query.improveItem;
		// this.checkId = this.$route.query.checkId;
		this.checkId = this.util.getUrlParam("checkId");
		this.improveItem=[];
		this.loadData();
		this.improveRequest="";
		this.improverModel.userName="";
		this.improverModel.userUid="";
  },
  methods: {
	  	loadData(){
			if(this.util.isNotEmpty(this.checkId)){
				this.util.mask();
				var _this=this;
				var param = {
						operateType:'getCheckBillDataByid',
						id:this.checkId
				};
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
					_this.util.unmask();
					if (res.status == 200) {
						_this.checkBill=res.data;
						// _this.checkBillDet = res.data.subFormData;
						if(res.data.subFormData!=undefined&&res.data.subFormData.length>0){
							for(var i=0;i<res.data.subFormData.length;i++){
								if(res.data.subFormData[i].checkStatus=="2"){
									_this.improveItem.push(res.data.subFormData[i]);
								}
							}
						}
					}
					
					
				});
			}  
			
		},
  		previewImage(curId,curData){
			var imgId = this.webUrl+'/attachment/look?id='+curId+'&access_token='+this.access_token;
			var imgIds=[];
			for(var i=0;i<curData.length;i++){
				imgIds.push(this.webUrl+'/attachment/look?id='+curData[i].id+'&access_token='+this.access_token);
			}
			this.wx.previewImage({
				current: imgId, // 当前显示图片的http链接
				urls: imgIds // 需要预览的图片http链接列表
			});
		},
		saveData(){
			if (!this.validUtil.isNotEmpty(this.improverModel.userUid)) {
				this.util.alert("请选择整改人！");
				return;
			}
			if(this.improveRequest==""){
				this.util.alert("请输入整改要求！");
				return;
			}
			var _this = this;
			_this.util.mask("正在保存..");
			//主表
			var mainData = {CHECK_STATUS_:4,IMPROVE_STATUS_:4,IMPROVE_REQUIRE_: this.improveRequest,FINISH_TIME_:this.pickerValue,IMPROVE_USERID_:this.improverModel.userUid};
			var params = { sqlTableName: "T_QUALITY_CHECK", mainFormData: JSON.stringify(mainData)};
			params['id'] = this.checkId;
			params['businessKey'] = this.checkId;
			this.util.post("/admin/appDefaultFormAction!saveData.action",params,function(result){
					if(result.success){
						_this.util.unmask();
						_this.sendMsg(_this.improverModel.userUid,result.msg,"improveBillShow");
						_this.util.successToast("保存成功！");
						_this.util.setTemp(_this,"loadCheckImproveList"+Math.random().toString(36).substr(2));
						history.back();
						
					}else{
						_this.util.unmask();
						_this.util.alert(result.msg);
					}
				});

				
		},
		sendMsg(sendMsgUsersIds,businessId,state){
			var _this=this;
			var param = {
					operateType:'sendQualityMsg',
					title:"["+this.checkBill.project+"]质量整改通知",
					description:"您有一条新的质量整改需要处理，点击查看",
					sendMsgUsers:sendMsgUsersIds,
					businessId:businessId,
					state:state
			};
			this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
				if (res.status != 200) {
					_this.util.alert("发送消息失败");
				}
				
				
			});
		},
		selectRectifier(){
			this.improverModel.visible=true;
			this.$refs.profile.postMsg({singer:true,radioCheckedArr:[]})
			
		},
		checkImprover(){
			var checkers =this.checkBill.checkerIds.split(",");
			if(this.validUtil.contains(checkers,this.improverModel.users.id)){
				this.improverModel.userUid='';
				this.improverModel.userName='';
				this.util.alert("整改人和检查人不能重复！");

			}
		},
		selectCopyer(){
			this.copyerModel.visible=true;
		}
		
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
.demo4-item-selected {
  background-color: #FF3B3B;
  color: #fff;
}
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
.myCell {
    padding-left: 10px;
    height: 48px;
    text-align: right;
}
.myCell-bd {
    height: 100%;
    padding-right: 24px;
    line-height: 48px;
}
.piaojv {
	border-top: 1px solid #eee;
	padding: 10px 0 0 0;
	height: 100%;
	span {
		padding: 5px 10px;
	}
	p {
		margin: 5px 10px;
		height: auto;
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
.footer {
	height: 1.8rem;
	padding-top: 10px;
	background: #eee;
	line-height: 42px;
}
</style>
