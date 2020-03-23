<template>
  <div class="maimForm">
	  <div class="wrap">
		  	<div class="weui-cell weui-cell_select myCell" style="padding:10px 15px 10px 10px;height:auto;">
				<!-- <div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-th-list"></i></div> -->
				<div class="weui-cell__hd">
					<span class="itemName">项目名称<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd"  @click="isReadOnly?'': selectPro()">
					<span style="padding-right:5px;">
						{{safetyDetails.projectName}}
						<!-- {{selectProjModel.projectName.length>18? (selectProjModel.projectName.substring(0,18)+'...'):selectProjModel.projectName}} -->
					</span>
					
				</div>		
			</div>
		  	<div class="weui-cell  myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd "><span class="itemName">项目编号</span></div>
				
				<div class="weui-cell__bd" >
					
					<span>{{safetyDetails.projectNum}}</span>
				</div>
			</div>
				
			<div class="weui-cell  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span class="itemName">检查日期<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd " >	
					<datetime title=""  class="col-xs-12 be-check" :readonly="isReadOnly" 
						  v-model="safetyDetails.sCheckDate" style="padding:0px;padding-right:15px;" 
						  default-selected-value="date" format="YYYY-MM-DD" 
						  :placeholder="'请选择日期'"></datetime>							
				</div>
			</div>
			<div class="weui-cell  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span class="itemName">检查结果<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd " >		
					<popup-picker style="width:100%; color:red"  :data="resultsList" 
								  v-model="safetyDetails.sCheckResult"  @on-change="resultChange" 								  
								  :placeholder="('选择检查结果')">
					</popup-picker>			
				</div>
			</div>		
			
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3 itemName">检查内容</span>
				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="500" style="width: 100%;"  :readonly="isReadOnly"
							 placeholder="请输入检查内容..."	v-model="safetyDetails.sCheckContent"
							 ref="content"></x-textarea>
			</div>
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3 itemName">备注</span>
				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="200" style="width: 100%;"  :readonly="isReadOnly"
							 placeholder="请输入备注..."	v-model="safetyDetails.Remark"
							 ref="content"></x-textarea>
			</div>
			<Attachment :model="attachmentModel" style="border-top: 1px solid #eee;"></Attachment>
			<ProcessMonitor1 :model="monitorModel"></ProcessMonitor1>
			<mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
				<SelectProj :mess="selectProjModel" v-on:selectProjCallback="acceptProj" ref="projfile" ></SelectProj>
			</mt-popup>
	  </div>
	  <div class="btns">
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
import SelectProj from '../common/SelectProj1.vue'
import { Datetime,PopupPicker, XButton, XTextarea} from "vux";
import { mapState } from "vuex";
import { cloneObj ,sessionUtil} from "@/utils/utils.js";
export default {
  components: {
	  Datetime,PopupPicker,VoiceRecognition,Attachment,ProcessMonitor1,XButton, XTextarea,SelectProj
  },
  data(){
	  return{
		  safetyDetails:{
			  sn:"",
			  xmid:"",
			  Subject:'',
			  fsrq:new Date().format("yyyy-MM-dd"),
			  czy:"",
			  projectName:'',
			  projectNum:'',
			  sCheckDate:new Date().format("yyyy-MM-dd"),
			  sCheckResult:[],
			  sCheckContent:'',
			  Remark:"",
		  },
		  isReadOnly:false,
		  resultsList:[['']],
		  voiceRecognition: {
				title: '调休事由',
				isReadOnly: false,
				placeholder: '请输入调休原因...',
				content: ''
			},
			attachmentModel: {
				isReadOnly: false,
				xtype:'fujian1',
				title: '上传附件',
				fileList: [],
				deleteFilesList: []
			},
			
		  selectProjModel:{
			  selectProjVisible:false,
				projectName:'选择项目',
				projUid:'',
				moduleType:'gcPro'
		  },
			monitorModel:{
				Id:''
			},
			Id:'',
			sqlTableName:'U010_Security_Inspection',
			symbol:'sn,AQJC',
			formId:"DForm_U010_Security_Inspection",
			appId:'U010',
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
	  this.util.initWxJsSdk(this);
	  //this.safetyDetails.applicant = this.userName;
	
	  var _this = this;
	 
	  var sql = "select value,name,DocCreated from ST01_Data_Dictionary_det where "+
		"pid = (select top 1 ID from ST01_Data_Dictionary where DDID='inspectionResult')"
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
			console.log(res)
			
			_this.resultsList=[[]]
			var data = res.data;
			for(var i=0;i<data.length;i++){
			//	var item = {name: data[i].name, value: data[i].value}
				_this.resultsList[0].push(data[i].value);
			}
			
		})

  },
  activated(){
	  this.Id = this.util.getUrlParam("Id");
	 
	  if(this.Id){

		 this.queryDetals()
	  }else{
		  this.safetyDetails.Subject = "安全检查";
		  this.safetyDetails.czy = this.userName;
			/* this.safetyDetails.applicant =this.userName;
		  this.safetyDetails.userUid = this.userUid;
		  this.safetyDetails.depart = this.sessionUtil.getDepartName(); */
		  	
	  }

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
		console.log(params)
		this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat',params,function(res){
			var data = res.data[0]
			console.log(data)
			
			_this.safetyDetails.sn = data.sn;
			_this.safetyDetails.xmid =data.xmid;
			_this.safetyDetails.Subject = data.Subject;
			_this.safetyDetails.fsrq =data.fsrq;
			_this.safetyDetails.czy = data.czy;			
			_this.safetyDetails.projectName = data.projectName;
			_this.selectProjModel.projectName = data.projectName;
			_this.safetyDetails.projectNum = data.projectNum;
			_this.safetyDetails.sCheckDate = data.sCheckDate;
			_this.safetyDetails.sCheckContent = data.sCheckContent;
			_this.safetyDetails.sCheckResult = [data.sCheckResult];
			//_this.voiceRecognition.content = data.offReson;
			_this.safetyDetails.Remark = data.Remark;
			_this.safetyDetails["_form_category_"] = data["_form_category_"]
			_this.safetyDetails.lock =data.lock;
			//附件在附件组件中通过url 中的Id请求加载
			if(data.lock){
				_this.isReadOnly = true;
				//_this.voiceRecognition.isReadOnly =true;
				_this.attachmentModel.isReadOnly =true;
				
			}
			
					
			_this.util.unmask()
		})
	  },
	  selectPro(){
		  this.selectProjModel.selectProjVisible=true;
	  },
	  
	  acceptProj(data){
		  console.log(data);
		  this.selectProjModel.projectName = data.projectName;
		  this.safetyDetails.projectName = data.projectName;
		  this.safetyDetails.xmid = data.xmid
		  this.safetyDetails.projectNum = data.projectNum	
		 this.selectedProjInfo = data;
	  },
	  resultChange(){

	  },
	  saveData(){

	  },
	  cancelSave(){

	  },
	 checkValid() {
		
		var _this =this ;
		this.pushData = cloneObj(_this.safetyDetails);
		this.pushData.sCheckResult = this.safetyDetails.sCheckResult[0];
		if(!this.validUtil.isNotEmpty(this.safetyDetails.projectName)){
			this.util.failueToast('请选择项目');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.safetyDetails.sCheckResult)){
			this.util.failueToast('请选择项目');
			return false;
		}		
		return true;
	},	
	 getData(){
		var _this = this;
		this.pushData.offReson = this.voiceRecognition.content;
		
		var filesData = new Array();
		for (var i=0;i< this.attachmentModel.fileList.length;i++) {
			var file = this.attachmentModel.fileList[i];
			if (file.isNewFlag) {
				filesData.push(file);
			}
		}
		var params = { sqlTableName: _this.sqlTableName, mainFormData: JSON.stringify(_this.pushData), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
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
		console.log(this.validUtil.isNotEmpty(this.Id))
		if(this.validUtil.isNotEmpty(this.Id)){
			this.$router.back(-1)
		}else{
			history.back();
		//	WeixinJSBridge.call('closeWindow');
			//this.$router.back(-1)
		}
		
	},
	saveData(){
		
		
			if(!this.checkValid()){
				return
			}
			if(this.safetyDetails.lock){
				this.ancelCallback();
				return;
			}
			var _this = this;
			var param = this.getData();
			console.log(param);
			console.log(param.mainFormData)
			var url = '/admin/appDefaultFormAction!saveData.action';
			this.util.post(url, param, function(res){
				//alert(res.msg)
				console.log(res)
				_this.util.alert("保存成功！")
				_this.cancelCallback();
				//_this.$router.push({name:'DayOffQuery',query:{pType:'saveBack'}})
			})
		
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
.star{
	position: relative;
}
.star::after{
	content: '*'
	
}
.itemName{
	color:#54aac4;
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


