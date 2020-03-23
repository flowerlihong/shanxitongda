<template>
  <div id="mainForm" class="headStyle bg-show-mint-wapper">
	  	<div class="middle">
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd"><span>操作员</span></div>
				<div class="weui-cell__bd" >
					<span>{{mainData.czy}}</span>
				</div>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">请假日期</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" v-model="mainData.fsrq" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>
	  		<div class="weui-cell weui-cell_select myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span>员工姓名<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectUser()">
					<span style=" display: block;height: 100%;padding-right: 0px;line-height: 23px;">{{userModel.userName}}</span>
				</div>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">开始时间</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" v-model="mainData.begindate" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">结束时间</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" v-model="mainData.enddate" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>
	  		
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd"><span>请假天数<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd" >
					<input  v-model="mainData.peon" style="text-align: right;" type="text" placeholder=""/>
					<span>天</span>
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span>请假性质<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd myCell-bd" >
					<select :disabled="isReadOnly" class="weui-select" id="selectNum" v-model="mainData.qjxz" name="select1">
                        <option v-for="(item,key) in typeList" :key="key" :value="item.value">{{item.name}}</option>
                    </select>
				</div>
			</div>
			<VoiceRecognition :model="voiceRecognition"></VoiceRecognition>	
			
			<Attachment :model="attachmentModel" style="border-top: 1px solid #eee;"></Attachment>
	  	</div>
	  	<ProcessForm :model="processModel" ref="process"></ProcessForm>
	  
	    <!--选择请假人-->
		<mt-popup v-model="userModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="userModel" ref="memberfile"></SelectUser>
		</mt-popup>
  </div>
</template>

<script>
import VoiceRecognition from '../common/VoiceRecognition.vue'
import ProcessForm from '../common/ProcessForm.vue'
import Attachment from '../common/Attachment.vue'
import SelectUser from '../common/SelectUser.vue'
import {mapState,mapGetters, mapActions} from 'vuex';
import { Datetime } from 'vux'
export default {
    name: 'movebx',
    data () {
	    return {
			agentId: 6,
			symbol:'sn,QJSQ',
			formId:"DForm_XM001_office_leave",
	    	mainData: {
				formKey: 'leave',
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
			sqlTableName: 'G001_office_qj',
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
			isReadOnly: true,//是否只读
			id:'',
			isNewFlag:false
	    }
    },
   components:{
      // 名字
      Datetime,Attachment,ProcessForm,VoiceRecognition,SelectUser
    },
    computed: {
		...mapState({
		   	userName: state => state.userName
		   })
		
    },
	created(){
		
		var _this = this;
		 this.util.loadDic({ dicId: 'Dic_XM001_qjyy' }, function(data) {
			for(var i=0;i<data.length;i++){
				var item = {name: data[i].name, value: data[i].value}
				_this.typeList.push(item);
			}

		});
   },
   activated(){
	   this.util.init(this);
		this.mainData.czy=this.userName;
		this.mainData.fsrq=new Date().format("yyyy-MM-dd");
		this.mainData.begindate=new Date().format("yyyy-MM-dd");
		this.mainData.enddate=new Date().format("yyyy-MM-dd");
		this.userModel.userName = "";
		this.userModel.userUid = "";
		this.voiceRecognition.content='';

		this.id = this.util.getUrlParam("id");
		this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;
		if(this.validUtil.isNotEmpty(this.id)){
			document.title="请假详情"; 
		}
		this.loadData();
		this.processModel.parent = this;
		this.isReadOnly = this.mainData.isReadOnly;
		this.attachmentModel.isReadOnly = this.mainData.isReadOnly;
		this.voiceRecognition.isReadOnly = this.mainData.isReadOnly;
		
		
		
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
				_this.util.unmask();
				_this.mainData.czy = data.czy;
				_this.voiceRecognition.content = data.reason;
				_this.mainData.fsrq = data.fsrq;
				_this.mainData.begindate = data.begindate;
				_this.mainData.enddate = data.enddate;
				_this.userModel.userName = data.username;
				_this.userModel.userUid = data.userid;
				_this.mainData.peon = data.peon;
				_this.mainData.qjxz = data.qjxz;
			});
			
		}
	},
	 checkValid() {
		if(!this.validUtil.isNotEmpty(this.userModel.userUid)){
			this.util.failueToast('请选择员工');
			return false;
		}
		if(this.validUtil.compareDateTime(this.mainData.begindate,this.mainData.enddate)){
			this.util.failueToast('结束时间必须大于开始时间');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.mainData.peon)){
			this.util.failueToast('请输入请假天数！');
			return false;
		}
		if(!this.validUtil.isNotEmpty(this.mainData.qjxz)){
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
		this.mainData.username = this.userModel.userName;
		this.mainData.userid = this.userModel.userUid;
		this.mainData.reason = this.voiceRecognition.content;
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
		params['subject'] = "请假申请";
		return params;
			
	},
	cancelCallback(){
		if(this.validUtil.isNotEmpty(this.id)){
			history.back();
		}else{
			WeixinJSBridge.call('closeWindow');
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
}
#selectNum{
	padding:0;
}
.weui-cell:before {
    border-top: 0px solid #e5e5e5!important;
}
.top ,.middle{
	text-align: left;
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
