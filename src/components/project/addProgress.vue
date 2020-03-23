<template>
  <div class="maimForm">
	  <div class="wrap">
		  	<div class="weui-cell weui-cell_select myCell" style="padding:10px 10px;height:auto;">
				<!-- <div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-th-list"></i></div> -->
				<div class="weui-cell__hd">
					<span class="itemName">项目名称<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd" style="text-align:right" @click="isReadOnly?'': selectPro()">
					<span style="padding-right:5px;">
						{{progressDetails.projectName}}
						<!-- {{selectProjModel.projectName.length>18? (selectProjModel.projectName.substring(0,18)+'...'):selectProjModel.projectName}} -->
					</span>					
				</div>		
			</div>
			<div class="weui-cell  myCell" style="padding:10px 15px 10px 10px;height:42px;border-top:1px solid #eee">
				<!-- <div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-th-list"></i></div> -->
				<div class="weui-cell__hd">
					<span class="itemName">项目阶段<span style="color:red">*</span></span>
				</div>
				<div  id="proPhase" class="weui-cell__bd myCell-bd" style="text-align:center" >
					<group>
						<popup-radio  :options="nodeArray" v-model="currentNode">
							<template slot-scope="props" slot="each-item"><!-- use scope="props" when vue < 2.5.0 -->
							<p>
								<!-- custom item <img src="http://dn-placeholder.qbox.me/110x110/FF2D55/000" class="vux-radio-icon"> {{ props.label }}
								<br>
								{{props}}
								<span style="color:#666;">{{ props.index + 1 }} another line</span> -->
								<span>{{props.label}}</span>
								<!-- <span>{{nodeDataArray[props.index].nodeId}}</span> -->
							</p>
							
							</template>
						</popup-radio>
					</group>				
				</div>		
			</div>			
			
			
		  	<div class="weui-cell  myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd "><span class="itemName">上报进度<span style="color:red">*</span></span></div>
				
				<div class="weui-cell__bd" >					
					<input  v-model="progressDetails.ProgressRatio" :readonly="isReadOnly" style="text-align: right;" 
							type="text" onkeyup="value=value.replace(/[^\d]/g,'') " placeholder="请输入上报进度"/>
					
				</div>
			</div>
				
			
				
			
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3 itemName">上报详情</span>
				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="500" style="width: 100%;"  :readonly="isReadOnly"
							 placeholder="请输入上报详情..."	v-model="progressDetails.ProgressDetail"
							 ref="content"></x-textarea>
			</div>
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3 itemName">备注</span>
				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="200" style="width: 100%;"  :readonly="isReadOnly"
							 placeholder="请输入备注..."	v-model="progressDetails.Remark"
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
import { Datetime,PopupPicker, XButton, XTextarea,Group,PopupRadio } from "vux";
import { mapState } from "vuex";
import { cloneObj ,sessionUtil} from "@/utils/utils.js";
export default {
  components: {
	  Datetime,PopupPicker,Group,PopupRadio ,VoiceRecognition,Attachment,ProcessMonitor1,XButton, XTextarea,SelectProj
  },
  data(){
	  return{
		  progressDetails:{
			  sn:"",
			  xmid:"",
			  Subject:'',
			  fsrq:new Date().format("yyyy-MM-dd"),
			  czy:"",
			  projectName:'选择项目',
			  Projectphase:'',
			  nodeId:'',
			  ProgressRatio:'',
			  ProgressDetail:'',	
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
			sqlTableName:'U008_Graphic_Progress',
			symbol:'sn,SGFA',
			formId:"DForm_U008_Graphic_Progress",
			appId:'U008',
			subFormData:[],
			pushData:{},
			nodeDataArray:[],
			//nodeArray:[],
			nodeArray: ['选择项目阶段'],
			option4: 'B',
			currentNode: '选择项目阶段'
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
	  this.czy=this.userName; 
	  this.util.mask()			
			var obj = new Object();
			obj['company'] = sessionUtil.getCompanyId();		  
			var  _this = this;			
		var params ={
			operateType:'queryFormData',
			param:JSON.stringify(obj),
			//searchParams:JSON.stringify(searchParams),
			// querySql : _this.util._encode(sql),
			sqlTableName:'GT_xmnode',
			orderByName:'sortid ASC',
			//fieldList:"",
			totalRows:10,
			firstRows:1
		}	
		var _this= this;
	 this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat',params,function(res){
			//var data = res.data[0]
			console.log(res.data)
			_this.nodeDataArray=res.data;
			//_this.nodeArray=res.data;
			_this.nodeArray=[]
			for(let i=0;i<res.data.length;i++){
				_this.nodeArray.push(res.data[i].nodeName)
			}
			_this.util.unmask()
		})

  },
  deactivated(){
      this.$destroy(true)
  },
  activated(){
	  this.Id = this.util.getUrlParam("Id");
	 
	  if(this.Id){

		 this.queryDetals()
	  }else{
		  //this.progressDetails.Subject = "质量检查";
		  this.progressDetails.czy = this.userName;
			/* this.progressDetails.applicant =this.userName;
		  this.progressDetails.userUid = this.userUid;
		  this.progressDetails.depart = this.sessionUtil.getDepartName(); */
		  	
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
			totalRows:1,
			firstRows:1
		}
		console.log(params)
		this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat',params,function(res){
			var data = res.data[0]
			console.log(data)
			
			_this.progressDetails.sn = data.sn;
			_this.progressDetails.xmid =data.xmid;
			_this.progressDetails.Subject = data.Subject;
			_this.progressDetails.fsrq =data.fsrq;
			_this.progressDetails.czy = data.czy;			
			_this.progressDetails.projectName = data.projectName;
			_this.selectProjModel.projectName = data.projectName;
			_this.currentNode=data.Projectphase
			_this.progressDetails.Projectphase = data.Projectphase;
			_this.progressDetails.nodeId = data.nodeId;
			_this.progressDetails.ProgressRatio = data.ProgressRatio;
			_this.progressDetails.ProgressDetail = data.ProgressDetail;
			
			//_this.voiceRecognition.content = data.offReson;
			_this.progressDetails.Remark = data.Remark;
			//_this.progressDetails["_form_category_"] = data["_form_category_"]
			_this.progressDetails.lock =data.lock;
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
		  this.progressDetails.projectName = data.projectName;
		  this.progressDetails.xmid = data.xmid
		  this.progressDetails.projectNum = data.projectNum	
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
		this.pushData = cloneObj(_this.progressDetails);
		//this.pushData.inspectionResult = this.progressDetails.inspectionResult[0];
		if(!this.validUtil.isNotEmpty(this.progressDetails.projectName)||this.progressDetails.projectName=="选择项目"){
			this.util.failueToast('请选择项目');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.currentNode)||this.currentNode=="选择项目阶段"){
			this.util.failueToast('请选择项目阶段');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.progressDetails.ProgressRatio)){
			this.util.failueToast('请选择上报进度');
			return false;
		}
		var ProgressRatio=parseInt(this.progressDetails.ProgressRatio);
		if(ProgressRatio<0||ProgressRatio>100){
			this.util.failueToast('上报进度应为0~100');
			return false;
		}
		/* if(!this.validUtil.isNotEmpty(this.progressDetails.inspectionResult)){
			this.util.failueToast('请选择项目');
			return false;
		}	 */	
		return true;
	},	
	 getData(){
		var _this = this;
		//this.pushData.offReson = this.voiceRecognition.content;
		console.log(_this.nodeArray.indexOf(_this.currentNode))
		this.progressDetails.Projectphase=this.currentNode;
		if(!_this.progressDetails.nodeId){
			this.progressDetails.nodeId=this.nodeDataArray[_this.nodeArray.indexOf(_this.currentNode)].nodeId
		}
		

		var filesData = new Array();
		for (var i=0;i< this.attachmentModel.fileList.length;i++) {
			var file = this.attachmentModel.fileList[i];
			if (file.isNewFlag) {
				filesData.push(file);
			}
		}
		var params = { sqlTableName: _this.sqlTableName, mainFormData: JSON.stringify(_this.progressDetails), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
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
			if(this.progressDetails.lock){
				this.ancelCallback();
				return;
			}
			var _this = this;
			var param = this.getData();
			console.log(param);
			//console.log(param.mainFormData)
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

<style lang="less" >
	#myCell{
	border-top:1px solid #eee
}
#proPhase{
	padding-right:0;
	&>div{
	//	margin-top:5px;
	}
	.vux-no-group-title{
		margin: 0;
		.vux-tap-active.weui-cell_access{
			padding:0;
			
			.vux-cell-value{
				color:#2c3e50!important;
				font-size: 14px;
			}
			.weui-cell__ft:after{
				//top:5px;	
			}
		};
		
	}
	.weui-cells:before{
			border-top:0;
		}
	.weui-cells:after{
		border-bottom:0;
	}
	
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


