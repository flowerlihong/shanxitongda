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
					<span>出差人
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectUser()">
					<span style=" display: block;height: 100%;padding-right: 0px;line-height: 26px;">{{userModel.userName}}</span>
				</div>
			</div>
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd">
					<span>预计费用
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd">
					<input v-model="mainData.yjfy" style="text-align: right;" type="number" placeholder="" />
					<span>元</span>
				</div>
			</div>
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd">
					<span>出差地点
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd">
					<span><input v-model="mainData.dd" style="text-align: right;" type="text" placeholder="出差地点" /></span>
				</div>
			</div>
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd">
					<span>出差天数
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd">
					<input v-model="mainData.ccts" style="text-align: right;" type="number" placeholder="" />
					<span>天</span>
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
			symbol: 'sn,CCSQ',
			formId: "DForm_H002_rsgl_ccsqb",
			mainData: {
				czy: '',
				depart: '',
				name: '',
				userid: '',
				yjfy: '',
				sy: '',
				dd: '',
				ccts: '',
				fsrq: ''
			},
			userModel: {
				visible: false,
				userName: '',
				userUid: ''
			},
			dateLength: '',
			voiceRecognition: {
				title: '出差事由',
				allowBlank: false,
				isReadOnly: false,
				placeholder: '请输入出差事由',
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
			modelName: '出差',
			sqlTableName: 'G001_rsgl_ccsqb',
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
		this.mainData.depart = this.sessionUtil.getDepartName();
		this.mainData.name = this.sessionUtil.getUserName();
		this.mainData.userid = this.sessionUtil.getUserId();
		this.mainData.yjfy = '';
		this.mainData.sy = '';
		this.mainData.dd = '';
		this.mainData.ccts = '';
		this.mainData.fsrq = new Date().format("yyyy-MM-dd");
		// this.mainData.begindate=new Date().format("yyyy-MM-dd");
		// this.mainData.enddate=new Date().format("yyyy-MM-dd");
		this.userModel.userName = this.sessionUtil.getUserName();
		this.userModel.userId = this.sessionUtil.getUserId();
		this.userModel.userUid = this.sessionUtil.getUserUid();
		this.voiceRecognition.content = '';

		this.id = this.util.getUrlParam("id");
		this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;
		if (this.validUtil.isNotEmpty(this.id)) {
			document.title = "出差详情";
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
						_this.userModel.userId = _this.mainData.userid;
						_this.userModel.userName = _this.mainData.name;
						_this.departModel.departName = _this.mainData.depart;

					}

					_this.util.unmask();
					console.info(res);
				});
			}
		},
		checkValid() {

			if (!this.validUtil.isNotEmpty(this.mainData.ccts)) {
				this.util.failueToast('请填写出差天数！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.departModel.departName)) {
				this.util.failueToast('请填写部门！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.userModel.userName)) {
				this.util.failueToast('请填写出差人！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.mainData.yjfy)) {
				this.util.failueToast('请填写出差费用！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.mainData.fsrq)) {
				this.util.failueToast('请填写日期！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.mainData.dd)) {
				this.util.failueToast('请填写出差地点！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.voiceRecognition.content)) {
				this.util.failueToast('请填写出差事由！');
				return false;
			}
			return true;
		}, getMainFormData() {
			this.mainData.userid = this.userModel.userId;
			this.mainData.name = this.userModel.userName;
			this.mainData.depart = this.departModel.departName;
			this.mainData.Subject = this.mainData.fsrq + this.mainData.name + "的出差申请";
			this.mainData.sy = this.voiceRecognition.content;

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
