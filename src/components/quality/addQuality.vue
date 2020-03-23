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
						{{qualityDetails.projectName}}
						<!-- {{selectProjModel.projectName.length>18? (selectProjModel.projectName.substring(0,18)+'...'):selectProjModel.projectName}} -->
					</span>
					
				</div>		
			</div>
		  	<div class="weui-cell  myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd "><span class="itemName">项目编号</span></div>
				
				<div class="weui-cell__bd" >
					
					<span>{{qualityDetails.projectNum}}</span>
				</div>
			</div>
		  	<div class="weui-cell  myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd "><span class="itemName">操作员</span></div>
				
				<div class="weui-cell__bd" >
					
					<span>{{qualityDetails.czy}}</span>
				</div>
			</div>
				
			<div class="weui-cell  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span class="itemName">检查日期<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd " >	
					<datetime title=""  class="col-xs-12 be-check" :readonly="isReadOnly" 
						  v-model="qualityDetails.inspectionDate" style="padding:0px;padding-right:15px;" 
						  default-selected-value="date" format="YYYY-MM-DD" 
						  :placeholder="'请选择日期'"></datetime>							
				</div>
			</div>
			<div class="weui-cell  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span class="itemName">检查结果<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd " >
					<!-- {{resultsList}}		 -->
					<popup-picker style="width:100%; color:red"  :data="resultsList" 
								  v-model="qualityDetails.inspectionResult"  @on-change="resultChange" 								  
								  :placeholder="('选择检查结果')">
					</popup-picker>			
				</div>
			</div>		
			
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3 itemName">检查内容</span>
				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="500" style="width: 100%;"  :readonly="isReadOnly"
							 placeholder="请输入检查内容..."	v-model="qualityDetails.inspectionContent"
							 ref="content"></x-textarea>
			</div>
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3 itemName">备注</span>
				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="200" style="width: 100%;"  :readonly="isReadOnly"
							 placeholder="请输入备注..."	v-model="qualityDetails.Remark"
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
		  qualityDetails:{
			  sn:"",
			  xmid:"",
			  Subject:'',
			  fsrq:new Date().format("yyyy-MM-dd"),
			  czy:"",
			  projectName:'',
			  projectNum:'',
			  inspectionDate:new Date().format("yyyy-MM-dd"),
			  inspectionResult:[],
			  inspectionContent:'',
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
				xtype:'file',
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
			sqlTableName:'U009_Quality_Inspection',
			symbol:'sn,ZLJC',
			formId:"DForm_U009_Quality_Inspection",
			appId:'U009',
			subFormData:[],
			pushData:{},
			userId:''
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
	  this.userId = this.sessionUtil.getUserId();
	  //this.qualityDetails.applicant = this.userName;
	console.log('%c',"padding:50px;line-height:120px;background:url('http://hiphotos.baidu.com/feed/pic/item/ca1349540923dd543dc9be7dda09b3de9c824868.jpg') no-repeat;background-size: 100px 100px; ")
	  var _this = this;
	//  在数据字典中查询检查结果
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
			
      console.log('fds',_this.resultsList)
		})

  },
  activated(){
	  this.Id = this.util.getUrlParam("Id");
	 
	  if(this.Id){

		 this.queryDetals()
	  }else{
		  this.qualityDetails.Subject = "质量检查";
		  this.qualityDetails.czy = this.userName;
			/* this.qualityDetails.applicant =this.userName;
		  this.qualityDetails.userUid = this.userUid;
		  this.qualityDetails.depart = this.sessionUtil.getDepartName(); */
		  	
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
			
			_this.qualityDetails.sn = data.sn;
			_this.qualityDetails.xmid =data.xmid;
			_this.qualityDetails.Subject = data.Subject;
			_this.qualityDetails.fsrq =data.fsrq;
			_this.qualityDetails.czy = data.czy;			
			_this.qualityDetails.projectName = data.projectName;
			_this.selectProjModel.projectName = data.projectName;
			_this.qualityDetails.projectNum = data.projectNum;
			_this.qualityDetails.inspectionDate = data.inspectionDate;
			_this.qualityDetails.inspectionContent = data.inspectionContent;
			_this.qualityDetails.inspectionResult = [data.inspectionResult];
			//_this.voiceRecognition.content = data.offReson;
			_this.qualityDetails.Remark = data.Remark;
			_this.qualityDetails["_form_category_"] = data["_form_category_"]
			_this.qualityDetails.lock =data.lock;
			//附件在附件组件中通过url 中的Id请求加载
			if(data.lock && _this.userId != data.czy){
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
		  this.qualityDetails.projectName = data.projectName;
		  this.qualityDetails.xmid = data.xmid
		  this.qualityDetails.projectNum = data.projectNum	
		 this.selectedProjInfo = data;
	  },
	  resultChange(){

	  },	  
	  cancelSave(){

	  },
	 checkValid() {
		
		var _this =this ;
		this.pushData = cloneObj(_this.qualityDetails);
		this.pushData.inspectionResult = this.qualityDetails.inspectionResult[0];
		if(!this.validUtil.isNotEmpty(this.qualityDetails.projectName)){
			this.util.failueToast('请选择项目！');
			return false;
		}
		
		if(!this.validUtil.isNotEmpty(this.pushData.inspectionResult)){
			this.util.failueToast('请选择检查结果！');
			return false;
		}		
		return true;
	},	
	 getData(){
		var _this = this;
		this.pushData.offReson = this.voiceRecognition.content;
		this.pushData["subCompany"] =this.sessionUtil.getsubCompanyId();
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
		
		console.log(params);		
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
			if(this.qualityDetails.lock){
				this.ancelCallback();
				return;
			}
			var _this = this;
			var param = this.getData();
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


