<template>
  <div class="maimForm">
	  <div class="wrap">
		  	<div class="weui-cell  myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span>员工姓名<span style="color:red">*</span></span></div>
				<!-- <div class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectUser()">
					<span style=" display: block;height: 100%;padding-right: 0px;line-height: 23px;">{{userModel.userName}}</span>
				</div> -->
				<div class="weui-cell__bd" >
					
					<span>{{leaveDetails.leavePerson}}</span>
				</div>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">开始时间</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" 
						  v-model="leaveDetails.leaveStartTime" style="padding:0px;padding-right:10px;" 
						  default-selected-value="date" format="YYYY-MM-DD HH:mm" 
						  
						  :placeholder="'请选择日期'"></datetime>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">结束时间</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" 
									v-model="leaveDetails.leaveEndTime" style="padding:0px;padding-right:10px;" 
									default-selected-value="date" format="YYYY-MM-DD HH:mm" 
									
									:placeholder="'请选择日期'"></datetime>
			</div>
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd"><span>请假天数<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd" >
					<input  v-model="leaveDetails.leaveDays" :readonly="isReadOnly" 
							style="text-align: right;" type="text" @blur="daysValid()"
							placeholder=""/>
					<span>天</span>
				</div>
			</div>
			<div class="weui-cell  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span>请假性质<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd " >		
					<popup-picker style="width:100%; color:red"  :data="leaveTypeList" 
								  v-model="leaveDetails.leaveType"  @on-confirm="TypeonChange" 								  
								  :placeholder="('选择性质')">
					</popup-picker>			
				</div>
			</div>
			<VoiceRecognition :model="voiceRecognition"></VoiceRecognition>
			
			
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3">备注</span>
				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="2000" style="width: 100%;"  :readonly="isReadOnly"
							 placeholder="请输入备注..."	v-model="leaveDetails.Remark"
							 ref="content"></x-textarea>
			</div>
			<Attachment :model="attachmentModel" style="border-top: 1px solid #eee;"></Attachment>
			<!-- <ProcessMonitor1 :model="monitorModel"></ProcessMonitor1> -->
			<ProcessForm :model="processModel"	></ProcessForm>
	  </div>
	  <div class="btns" style="display:none">
		  <p style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;z-index:2;">
				<button  style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
						@click="cancelCallback()" class="weui-btn weui-btn_mini weui-btn_default">取消</button>
				<button  style="width:48%;height: 45px;line-height: 45px;" @click="saveData()" 
						class="weui-btn weui-btn_mini weui-btn_primary">保存</button>
				
	 	  </p>
	  </div>
	  	
  </div>
</template>

<script>
import VoiceRecognition from '../common/VoiceRecognition.vue'
import Attachment from '../common/Attachment1.vue'
import ProcessMonitor1 from '../common/ProcessMonitor1'
import ProcessForm from '../common/ProcessForm'
import { Datetime,PopupPicker, XButton, XTextarea} from "vux";
import { mapState } from "vuex";
import { cloneObj ,sessionUtil} from "@/utils/utils.js";
export default {
  components: {
	  Datetime,PopupPicker,VoiceRecognition,Attachment,ProcessMonitor1,XButton, XTextarea,ProcessForm
  },
  data(){
	  return{
		  leaveDetails:{
			   sn:"",
			  xmid:"",
			  Subject:'',
			  fsrq:new Date().format("yyyy-MM-dd"),
			  czy:"",
			  leavePerson:'',
			  userUid:'',
			  depart:'',
			  leaveType:[],
			  leaveStartTime:new Date().format("yyyy-MM-dd hh:mm:ss"),
			  leaveEndTime:new Date().format("yyyy-MM-dd hh:mm:ss"),
			  leaveDays:'',
			//  offReson:'',
			  Remark:''
		  },
		  isReadOnly:false,
		  leaveTypeList:[['']],
		  voiceRecognition: {
				title: '请假事由',
				isReadOnly: false,
				placeholder: '请输入请假原因...',
				content: ''
			},
			attachmentModel: {
				isReadOnly: false,
				xtype:'fujian1',
				title: '上传附件',
				fileList: [],
				deleteFilesList: []
			},
			monitorModel:{
				Id:''
			},
			
			Id:'',
			sqlTableName:'U013_Application_For_Leave',
			symbol:'sn,APFOLE',
			formId:"DForm_U013_Application_For_Leave",
			appId:'U013',
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
			subFormData:[],
			pushData:{}
	  }
  },
   deactivated(){
      this.$destroy(true)
  },
   computed:{
	  ...mapState({		   
			userUid: state => state.userUid,
			userName: state => state.userName		
		   })
  },

  created(){
	 // this.util.initWxJsSdk(this);
	  this.leaveDetails.leavePerson = this.userName;
	
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
			
			_this.leaveTypeList=[[]]
			var data = res.data;
			for(var i=0;i<data.length;i++){
			//	var item = {name: data[i].name, value: data[i].value}
				_this.leaveTypeList[0].push(data[i].value);
			}
			
		})

  },
  activated(){
	  //console.log(this.processModel)
	  this.Id = this.util.getUrlParam("Id");
	 
	  if(this.Id){

		 this.queryDetals()
	  }else{
		  this.leaveDetails.Subject = "请假申请";
		  this.leaveDetails.czy = this.userName;
		  this.leaveDetails.leavePerson =this.userName;
		  this.leaveDetails.userUid = this.userUid;
		  this.leaveDetails.depart = this.sessionUtil.getDepartName();
		  	
	  }
	  this.processModel.parent = this;

  },
  methods:{
	  queryDetals(){
		 
			this.util.mask()
			//流程通过id加载
			this.monitorModel.Id = this.Id;	
			var obj = new Object();
		obj['company'] = sessionUtil.getCompanyId();
		   obj['Id'] = this.Id;
		//  var userName = sessionUtil.getUserName()

		// obj['projectNumber'] = 		
			var  _this = this;		 
			
		var params ={
			operateType:'queryFormData',
			param:JSON.stringify(obj),
			//searchParams:JSON.stringify(searchParams),
			// querySql : _this.util._encode(sql),
			sqlTableName:_this.sqlTableName,
			orderByName:'DocCreated DESC',
			//fieldList:"",
			totalRows:10,
			firstRows:0
		}
		//console.log(params)
		this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat',params,function(res){
			var data = res.data[0]
			//console.log(data)
			
			_this.leaveDetails.sn = data.sn;
			_this.leaveDetails.xmid =data.xmid;
			_this.leaveDetails.Subject = data.Subject;
			_this.leaveDetails.fsrq =data.fsrq;
			_this.leaveDetails.czy = data.czy;
			_this.leaveDetails.leavePerson = data.leavePerson;
			_this.leaveDetails.userUid = data.userUid;
			_this.leaveDetails.depart = data.depart;
			_this.leaveDetails.leaveStartTime = data.leaveStartTime;
			_this.leaveDetails.leaveEndTime = data.leaveEndTime;
			_this.leaveDetails.leaveDays = data.leaveDays;
			_this.leaveDetails.leaveType = [data.leaveType];
			_this.voiceRecognition.content = data.leaveReson;
			_this.leaveDetails.Remark = data.Remark;
			_this.leaveDetails["_form_category_"] = data["_form_category_"]
			_this.leaveDetails.lock =data.lock;
			//附件在附件组件中通过url 中的Id请求加载
			if(data.lock){
				_this.isReadOnly = true;
				_this.voiceRecognition.isReadOnly =true;
				_this.attachmentModel.isReadOnly =true;
			}
			
			//_this.processModel.ifHashWorkflow=false		
			_this.util.unmask()
		})
	  },
	  TypeonChange(){
		  
		//  console.log(this.leaveDetails.leaveEndTime.length)
		/* var a = this.leaveDetails.leaveEndTime;
		this.leaveDetails.leaveStartTime */
	  },	
	 checkValid() {
		/* if(!this.valisdUtil.isNotEmpty(this.userModel.userUid)){
			this.util.failueToast('请选择员工');
			return false;
		} */
		var _this =this ;
		this.pushData = cloneObj(_this.leaveDetails);
		if(this.pushData.leaveStartTime.length<=16){
			this.pushData.leaveStartTime+=":00";
		}
		if(this.pushData.leaveEndTime.length<=16){
			this.pushData.leaveEndTime+=":00";
		}
		
		//console.log( this.pushData.leaveStartTime)
		//return false;
		this.pushData.leaveType = this.leaveDetails.leaveType[0];
		if(this.validUtil.compareDateTime(this.pushData.leaveStartTime,this.pushData.leaveEndTime)){
			this.util.failueToast('结束时间必须大于开始时间');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.pushData.leaveDays)){
			this.util.failueToast('请输入请假天数！');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.pushData.leaveType)){
			this.util.failueToast('请选择请假性质！');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.voiceRecognition.content)){
			this.util.failueToast('请输入请假原因！');
			return false;
		}
		return true;
	},	
	 getData(){
		var _this = this;
		this.pushData.leaveReson = this.voiceRecognition.content;
		
		var filesData = new Array();
		for (var i=0;i< this.attachmentModel.fileList.length;i++) {
			var file = this.attachmentModel.fileList[i];
			if (file.isNewFlag) {
				filesData.push(file);
			}
		}
		var params = { 
						sqlTableName: _this.sqlTableName,
						mainFormData: JSON.stringify(_this.pushData),
						filesData: JSON.stringify(filesData),
						deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") 
					};
		if (this.validUtil.isNotEmpty(this.Id)) {
			params['id'] = this.Id;
			params['businessKey'] = this.Id;
		}
		params['symbol'] = this.symbol;
		params['formId'] = this.formId;
		params['appId'] = this.appId;
		return params;
			
	},
	cancelCallback(){
		
		if(this.validUtil.isNotEmpty(this.Id)){
			this.$router.back(-1)
		}else{
			//WeixinJSBridge.call('closeWindow');
			history.back();
			//this.$router.back(-1)
		}
		
	},
	getMainFormData(){
		return this.pushData
	},
	saveData(){
		
		
			if(!this.checkValid()){

				return
			}
			if(this.leaveDetails.lock){
				this.cancelCallback();
				return;
			}
			var _this = this;
			var param = this.getData();
			//console.log(param);
		//	console.log(param.mainFormData)
			var url = '/admin/appDefaultFormAction!saveData.action';
			this.util.post(url, param, function(res){
				//alert(res.msg)
			//	console.log(res)
				_this.util.alert("保存成功！")
				_this.cancelCallback();
				//_this.$router.push({name:'DayleaveQuery',query:{pType:'saveBack'}})
			})
		
	},
	daysValid(){
		//if(typeof this.leaveDetails )
		var value = this.leaveDetails.leaveDays
		//console.log(typeof this.leaveDetails.leaveDays)
		var patrn = /^(-)?\d+(\.\d+)?$/;
		if (patrn.exec(value) == null || value == "") {
			this.util.alert("请输入数字！")
			return false
		} 
		if(value/1*2%1!=0){
			this.util.alert("请输入0.5的倍数！")
		}
		
	}
  }
}
</script>

<style lang="less" scoped>
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


