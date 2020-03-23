<template>
	<div id="mainForm" class="headStyle bg-show-mint-wapper">
		<div class="middle">
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd">
					<span>操作员</span>
				</div>
				<div class="weui-cell__bd">
					<span>{{mainData.czy}}</span>
				</div>
			</div>

			<div class="weui-cell weui-cell_select myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd">
					<span>部门
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectDepart()">
					<span style=" display: block;height: 100%;padding-right: 0px;line-height: 26px;">{{departModel.departName}}</span>
				</div>
			</div>

			<div class="weui-cell weui-cell_select myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd">
					<span>借款人
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectUser()">
					<span style=" display: block;height: 100%;padding-right: 0px;line-height: 26px;">{{userModel.userName}}</span>
				</div>
			</div>
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd">
					<span>借支金额
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd">
					<input v-model="mainData.je" style="text-align: right;" type="number" placeholder="" />
					<span>元</span>
				</div>
			</div>
			
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">日期
					<span style="color:red">*</span>
				</span>
				<datetime title="" class="col-xs-9 be-check" :readonly="isReadOnly" v-model="mainData.fsrq" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>

			<VoiceRecognition :model="voiceRecognition"></VoiceRecognition>

			<Attachment :model="attachmentModel" style="border-top: 1px solid #eee;"></Attachment>
		</div>
		<!--选择请假人-->
		<mt-popup v-model="userModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="userModel" ref="memberfile"></SelectUser>
		</mt-popup>
		<mt-popup v-model="departModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<selectQuarters :orgModel="departModel" ref="departSel"></selectQuarters>
		</mt-popup>
		<ProcessForm :model="processModel" ref="process"></ProcessForm>
	</div>
</template>

<script>
import VoiceRecognition from '../common/VoiceRecognition.vue'
import ProcessForm from '../common/ProcessForm.vue'
import Attachment from '../common/Attachment.vue'
import SelectUser from '../common/SelectUser.vue'
import selectQuarters from '../common/selectQuarters.vue'
import { Datetime } from 'vux'
export default {
	name: 'business',
	data() {
		return {
			agentId: 6,
			symbol: 'sn,JZD',
			formId: "DForm_XM001_jt_mxtz1",
			mainData: {
				czy: '',
				bmmc: '',
				bmid: '',
				payeename: '',
				payeeno: '',
				je: '',
				bz: '',
				fsrq: ''
			},
			userModel: {
				visible: false,
				userName: '',
				userUid: ''
			},
			dateLength: '',
			voiceRecognition: {
				title: '借支事由',
				allowBlank: false,
				isReadOnly: false,
				placeholder: '请输入借支事由',
				content: ''
			},
			departModel: {
				departName: this.sessionUtil.getDepartName(this),
				departUid: this.sessionUtil.getDepartUid(this),
				visible: false
			},
			attachmentModel: {
				isReadOnly: false,
				xtype:'fujian1',
				title: '上传附件',
				fileList: [],
				deleteFilesList: []
			},
			//typeList: [],
			currentActId: '',
			modelName: '员工借支',
			sqlTableName: 'G003_jt_mxtz',
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
			id: '',
			isNewFlag: false
		}
	},
	components: {
		// 名字
		Datetime, Attachment, selectQuarters, ProcessForm, VoiceRecognition, SelectUser
	},

	created() {

		
		var _this = this;
		//  this.util.loadDic({ dicId: 'Dic_XM001_qjyy' }, function(data) {
		// 	for(var i=0;i<data.length;i++){
		// 		var item = {name: data[i].name, value: data[i].value}
		// 		_this.typeList.push(item);
		// 	}

		// });
	},
	activated() {
		this.util.init(this);
		this.mainData.czy = this.sessionUtil.getUserName();
		this.mainData.bmid = this.sessionUtil.getDepartId();
		this.mainData.bmmc = this.sessionUtil.getDepartName();
		this.mainData.payeename = this.sessionUtil.getUserName();
		this.mainData.payeeno = this.sessionUtil.getUserId();
		this.mainData.je = '';
		this.mainData.fsrq = new Date().format("yyyy-MM-dd");
		// this.mainData.begindate=new Date().format("yyyy-MM-dd");
		// this.mainData.enddate=new Date().format("yyyy-MM-dd");
		this.userModel.userName = this.sessionUtil.getUserName();
		this.userModel.userId = this.sessionUtil.getUserId();
		this.userModel.userUid = this.sessionUtil.getUserUid();
		this.voiceRecognition.content = '';
		this.processModel.ifHashWorkflow = true;

		this.id = this.util.getUrlParam("id");
		this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;
		if (this.validUtil.isNotEmpty(this.id)) {
			document.title = "借支申请";
		}
		this.loadData();
		this.processModel.parent = this;
		this.isReadOnly = this.mainData.isReadOnly;
		this.attachmentModel.isReadOnly = this.mainData.isReadOnly;
		this.voiceRecognition.isReadOnly = this.mainData.isReadOnly;

		//console.info(this.mainData);

	},
	methods: {

		selectUser() {
			this.$refs.memberfile.postMsg({ singer: true, radioCheckedArr: [this.userModel.userUid] })
			this.userModel.visible = true;
		},
		selectDepart() {
			this.$refs.departSel.postMsg({ singer: true, radioCheckedArr: [] })
			this.departModel.visible = true;
		},
		loadData() {
			var _this = this;
			if (!this.isNewFlag) {
				this.util.mask("正在加载...");
				this.util.initData({ id: this.id, sqlTableName: this.sqlTableName }, function(res) {
					if (res != undefined) {
						_this.mainData = res;
						_this.userModel.userId = _this.mainData.payeeno;
						_this.userModel.userName = _this.mainData.payeename;
						_this.departModel.departName = _this.mainData.bmmc;
						_this.departModel.departId = _this.mainData.bmid;

					}
					_this.util.unmask();
					console.info(res);
				});
			}
		},
		checkValid() {

			
			if (!this.validUtil.isNotEmpty(this.departModel.departName)) {
				this.util.failueToast('请填写部门！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.userModel.userName)) {
				this.util.failueToast('请填写借款人！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.mainData.je)) {
				this.util.failueToast('请填写借款金额！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.mainData.fsrq)) {
				this.util.failueToast('请填写日期！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.voiceRecognition.content)) {
				this.util.failueToast('请填写借支事由！');
				return false;
			}
			return true;
		}, getMainFormData() {
			this.mainData.payeeno = this.userModel.userId;
			this.mainData.payeename = this.userModel.userName;
			this.mainData.bmmc = this.departModel.departName;
			this.mainData.bmid = this.departModel.departId;
			this.mainData.Subject = this.mainData.fsrq + this.mainData.payeename + "的借款申请";
			this.mainData.bz = this.voiceRecognition.content;

			return this.mainData;
		}, getSubFormData() {

			return null;
		}, getFileData() {
			var filesData = new Array();
			for (var i= 0;i< this.attachmentModel.fileList.length;i++) {
				var file = this.attachmentModel.fileList[i];
				if (file.isNewFlag) {
					filesData.push(file);
				}
			}
			return filesData;
		},
		getData() {
			var _this = this;
			var mainData = this.getMainFormData();
			var filesData = this.getFileData();
			var params = { sqlTableName: this.sqlTableName, mainFormData: JSON.stringify(mainData), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
			if (this.validUtil.isNotEmpty(this.id)) {
				params['id'] = this.id;
				params['businessKey'] = this.id;
			}
			params['symbol'] = this.symbol;
			params['formId'] = this.formId;
			params['subject'] = mainData.Subject;
			return params;

		},
		cancelCallback() {
			if (this.validUtil.isNotEmpty(this.id)) {
				history.back();
			} else {
				WeixinJSBridge.call('closeWindow');
			}

		}



	}
}
</script>

<style lang="scss" scoped>
#myCell {
	border-top: 1px solid #eee
}

.weui-select {
	height: 100%;
	line-height: 28px;
	direction: rtl;
}

#selectNum {
	padding: 0;
}

.weui-cell:before {
	border-top: 0px solid #e5e5e5!important;
}



.top,
.middle {
	text-align: left;
}

//金额    生产日期
.price {
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
}

.price>span,
.bill>span {
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
		padding: 5px 15px;
	}
}

.rt>input {
	width: 40px;
	text-align: center;
}
</style>
