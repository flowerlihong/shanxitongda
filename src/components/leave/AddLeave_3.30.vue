<template>
  <div id="mainForm" class="headStyle bg-show-mint-wapper">
	  	<div class="middle">
			<!-- <div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd"><span>操作员</span></div>
				<div class="weui-cell__bd" >
					<span>{{mainData.czy}}</span>
				</div>
			</div> -->
			<!-- <div class="price" style="text-align:left;">
				<span class="col-xs-3">请假日期</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" v-model="mainData.fsrq" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div> -->
	  		<div class="weui-cell  myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span>员工姓名<span style="color:red">*</span></span></div>
				<!-- <div class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectUser()">
					<span style=" display: block;height: 100%;padding-right: 0px;line-height: 23px;">{{userModel.userName}}</span>
				</div> -->
				<div class="weui-cell__bd" >
					
					<span>{{userModel.userName}}</span>
				</div>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">开始时间</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" v-model="mainData.leaveStartTime" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">结束时间</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" v-model="mainData.leaveEndTime" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>
	  		
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd"><span>请假天数<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd" >
					<input  v-model="mainData.leaveDays" style="text-align: right;" type="text" placeholder=""/>
					<span>天</span>
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span>请假性质<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd myCell-bd" >				
					<!-- <popup-picker style="width:100%; color:red" title="" :data="typeList" v-model="mainData.leaveType"  @on-change="kmonChange" :placeholder="('选择科目')"></popup-picker> -->
					<select :disabled="isReadOnly" class="weui-select" id="selectNum" v-model="mainData.leaveType" name="select1">
                        <option v-for="(item,key) in typeList" :key="key" :value="item.value">{{item.name}}</option>
                    </select>
				</div>
			</div>
			<VoiceRecognition :model="voiceRecognition"></VoiceRecognition>	
			
			<Attachment :model="attachmentModel" style="border-top: 1px solid #eee;"></Attachment>
			<ProcessMonitor1 :model="monitorModel"></ProcessMonitor1>
	  	</div>
	  	<!-- <ProcessForm :model="processModel" ref="process"></ProcessForm> -->
	  <p style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;    position: fixed;width: 100%;bottom: 0px;">
				<button  style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;" @click="onClick(1)" class="weui-btn weui-btn_mini weui-btn_default">取消</button>
				<button  style="width:48%;height: 45px;line-height: 45px;" @click="onClick(2)" class="weui-btn weui-btn_mini weui-btn_primary">保存</button>
				
	 </p>
	    <!--选择请假人-->
		<!-- <mt-popup v-model="userModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="userModel" ref="memberfile"></SelectUser>
		</mt-popup> -->
  </div>
</template>

<script>
import VoiceRecognition from '../common/VoiceRecognition.vue'
import ProcessForm from '../common/ProcessForm.vue'
import Attachment from '../common/Attachment.vue'
import SelectUser from '../common/SelectUser.vue'
import ProcessMonitor1 from '../common/ProcessMonitor1'
import {mapState,mapGetters, mapActions} from 'vuex';
import { Datetime,PopupPicker } from 'vux'
export default {
    name: 'movebx',
    data () {
	    return {
			
			agentId: 6,
			symbol:'sn,APFOLE',
			formId:"DForm_U013_Application_For_Leave",
			appId:'U013',
	    	mainData: {
				formKey: 'leave',
				leaveType:'yuanyou',
				sn:''
			},
			userModel: {
				visible: false,
				userName: '',
				userUid: ''
			},
			dateLength: '',
			voiceRecognition: {
				title: '请假原因',
				isReadOnly: false,
				placeholder: '请输入请假原因',
				content: ''
			},
			attachmentModel: {
				isReadOnly: false,
				xtype:'fujian1',
				title: '上传附件',
				fileList: [],
				deleteFilesList: []
			},
			typeList: [],
			currentActId:'',
			formKey: 'DForm_XM001_office_leave',
			modelName: '请假',
			sqlTableName: 'U013_Application_For_Leave',
			processModel: {
				ifHashWorkflow: true,
				isReadOnly: false,
				sqlTableName: this.sqlTableName,
				formId: this.formId,
				parent: null,
				id: '',
				procDefId: '',
				procInstId: ''
			},
			monitorModel:{
				Id:''
			},
			isReadOnly: false,//是否只读
			id:'',
			isNewFlag:false
	    }
    },
   components:{
      // 名字
      Datetime,Attachment,ProcessForm,VoiceRecognition,SelectUser,ProcessMonitor1,PopupPicker
    },
    computed: {
		...mapState({
			   userName: state => state.userName,
			   userUid: state => state.userUid
		   })
		
    },
	created(){
		console.log('sadasdfasd')
		var _this = this;
		var sql = "select value,name,DocCreated from ST01_Data_Dictionary_det where "+
	"pid = (select top 1 ID from ST01_Data_Dictionary where DDID='leaveType')"
		var params ={
				operateType:'queryDataByEncSql',
				querySql:_this.util._encode(sql),
				//param:JSON.stringify(obj),
				totalRows:25,
				firstRows:0,
				//searchParams:JSON.stringify(searchParams),
			}
			
		
		var url ="/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat"
		this.util.post(url,params,function(res){
			//console.log(res)
			//_this.typeList.shift();
			var data = res.data;
			for(var i=0;i<data.length;i++){
				var item = {name: data[i].name, value: data[i].value}
				_this.typeList.push(item);
			};
			
		})

		
   },
   deactivated(){
      this.$destroy(true)
},
   activated(){
	 // Vue.assign(this.$data, this.$options.data())
	 	//this.data =''
		 this.util.init(this);
		
	   console.log('传过来的对象',this.$route.params.lock);
	   var pType = this.$route.params.pType
	   

		
	   
		this.mainData.czy=this.userName;
		this.mainData.fsrq=new Date().format("yyyy-MM-dd");
		this.mainData.leaveStartTime=new Date().format("yyyy-MM-dd");
		this.mainData.leaveEndTime=new Date().format("yyyy-MM-dd");
		this.userModel.userName = this.userName;
		this.userModel.userUid = this.userUid;
		this.voiceRecognition.content='';

		//this.id = this.util.getUrlParam("id");
		this.id = this.$route.params.Id
		//this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;
		//this.isNewFlag = this.validUtil.isNotEmpty(pType)?false:true;
		/* if(this.validUtil.isNotEmpty(this.id)){
			document.title="请假详情"; 
		} */
		if(pType && pType=="addNew"){
			this.isNewFlag = true;
			this.isReadOnly = false;		
	   }else if(pType && pType=="detail"){
		   this.isNewFlag = false;
		  this.monitorModel.Id = this.$route.params.Id;
		  if(this.$route.params.lock){
			 
			this.isReadOnly = true;
			this.attachmentModel.isReadOnly = true;
			this.voiceRecognition.isReadOnly = true;
		  }
		  
		  	this.loadData();
		 //  this.id = 
			
	   }
		
		
		
		this.processModel.parent = this;
		//this.isReadOnly = this.mainData.isReadOnly;
		//this.attachmentModel.isReadOnly = this.mainData.isReadOnly;
		//this.voiceRecognition.isReadOnly = this.mainData.isReadOnly;	
				
   },
   methods: {
	 selectUser(){
		 this.$refs.memberfile.postMsg({ singer: true, radioCheckedArr: [] })
		 this.userModel.visible = true;
	 },
	 loadData() {
		var _this = this;
		if (!this.isNewFlag) {
		
			this.util.mask("正在加载...");
			this.util.initData({id:this.id ,sqlTableName:this.sqlTableName},function(data){
				console.log(data)
				_this.util.unmask();
				_this.mainData.czy = data.czy;
				_this.mainData.sn = data.sn;
				_this.voiceRecognition.content = data.leaveReson;
				_this.mainData.fsrq = data.fsrq;
				_this.mainData.leaveStartTime = data.leaveStartTime;
				_this.mainData.leaveEndTime = data.leaveEndTime;
				_this.userModel.userName = data.leavePerson;
				_this.mainData.leavePerson = data.leavePerson;
				_this.userModel.userUid = data.userUid;
				_this.mainData.leaveDays = data.leaveDays;
				_this.mainData.leaveType = data.leaveType;
				
			});
			
		}
	},
	kmonChange(){},
	 checkValid() {
		/* if(!this.validUtil.isNotEmpty(this.userModel.userUid)){
			this.util.failueToast('请选择员工');
			return false;
		} */
		if(this.validUtil.compareDateTime(this.mainData.leaveStartTime,this.mainData.leaveEndTime)){
			this.util.failueToast('结束时间必须大于开始时间');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.mainData.leaveDays)){
			this.util.failueToast('请输入请假天数！');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.mainData.leaveType)){
			this.util.failueToast('请选择请假性质！');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.voiceRecognition.content)){
			this.util.failueToast('请选择请假原因！');
			return false;
		}
		return true;
	},	
	 getData(){
		var _this = this;
		this.mainData.Subject = "请假申请";
		//this.mainData.username = this.userModel.userName;
		
		this.mainData.userUid = this.userModel.userUid;
		this.mainData.leaveReson = this.voiceRecognition.content;
		this.mainData.depart = '广州建软'
		var filesData = new Array();
		for (var i=0;i< this.attachmentModel.fileList.length;i++) {
			var file = this.attachmentModel.fileList[i];
			if (file.isNewFlag) {
				filesData.push(file);
			}
		}
		var params = { sqlTableName: this.sqlTableName, mainFormData: JSON.stringify(this.mainData), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
		if (this.validUtil.isNotEmpty(this.id)) {
			params['id'] = this.id;
			params['businessKey'] = this.id;
		}
		params['symbol'] = this.symbol;
		params['formId'] = this.formId;
		params['appId'] = this.appId;
		return params;
			
	},
	cancelCallback(){
		if(this.validUtil.isNotEmpty(this.id)){
			history.back();
		}else{
			WeixinJSBridge.call('closeWindow');
		}
		
	},
	onClick(type){
		if(type == 1){
			
		}
		if(type==2){
			if(!this.checkValid()){
				return
			}
			var param = this.getData();
			console.log(param);
			console.log(param.mainFormData)
			var url = '/admin/appDefaultFormAction!saveData.action';
			this.util.post(url, param, function(res){
				alert(res)
				console.log(res)
			})
		}
	}
	
	
	
   }
}
</script>

<style lang="scss" scoped>
#myCell{
	border-top:1px solid #eee
}
.weui-select{
	height:100%;
	line-height:28px;
	direction: rtl;
	padding-right: 30px;
}
#selectNum{
	padding:0;
	
}
.weui-cell:before {
    border-top: 0px solid #e5e5e5!important;
}
.top ,.middle{
	text-align: left;
	margin-bottom: 75px;
}
//金额    生产日期
.price{
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
}

.price>span,.bill>span {
	padding: 0 10px;
}
//发票
.bill p {
	padding: 0 10px;
	margin: 0;

}
.bill {
	border-top: 1px solid #eee;
	padding: 10px 0 0 0;
	height: 100%;
	.load {
		height: 100%;
		margin-top: 30px;
		padding:  5px 15px;
	}
}
.rt>input{
	width: 40px;
	text-align: center;
	
}
</style>
