<template>
	<div id="mainForm" class="movebx" v-loading="loading" element-loading-text="拼命加载中" style="height: 100%;padding-bottom: 67px;width: 100%;" ref="mainForm">
		<div style="height: 100%;overflow:auto;width: 100%;">
			<div style="">
				<div class="price" style="text-align:left;">
					<span class="col-xs-3">日期</span>
					<datetime class="col-xs-9" :readonly="1==1" v-model="date" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>

				</div>

				<div id="msg" class="price" :style="isReadOnly?'text-align:left;height:49px;':'text-align:left;border-top: 0px;'">
					<mt-cell v-if="!isReadOnly" @click.native="selectProj(selectProjModel)" style="width:100%;background-position: inherit;background-image: none;" title="项目" is-link>
						<span>{{(selectProjModel.projName!=undefined && selectProjModel.projName.length>18)?(selectProjModel.projName.substring(0,18)+'...'):selectProjModel.projName}}</span>
						<input v-model="selectProjModel.projUid" class="col-xs-9" type="text" style="display:none">
					</mt-cell>
					<mt-cell v-if="isReadOnly" style="width:100%;background-position: inherit;background-image: none;" title="项目" is-link>
						<span>{{(selectProjModel.projName!=undefined && selectProjModel.projName.length>18)?(selectProjModel.projName.substring(0,18)+'...'):selectProjModel.projName}}</span>
						<input v-model="selectProjModel.projUid" class="col-xs-9" type="text" style="display:none">
					</mt-cell>
				</div>

				<div id="msg" class="price" style="text-align:left;border-top: 0px;">
					<mt-cell v-if="!isReadOnly" @click.native="selectDepart(departModel)" style="width:100%;background-position: inherit;background-image: none;border-top: 0px ;" title="部门" is-link>
						<span>{{(departModel.departName!=undefined && departModel.departName.length>18)?(departModel.departName.substring(0,18)+'...'):departModel.departName}}</span>
						<input v-model="departModel.departUid" class="col-xs-9" type="text" style="display:none">
					</mt-cell>
					<mt-cell v-if="isReadOnly" style="width:100%;background-position: inherit;background-image: none;" title="部门" is-link>
						<span>{{(departModel.departName!=undefined && departModel.departName.length>18)?(departModel.departName.substring(0,18)+'...'):departModel.departName}}</span>
						<input v-model="departModel.departUid" class="col-xs-9" type="text" style="display:none">
					</mt-cell>
				</div>

				<div class="price" style="text-align:left;display:none;">
					<span class="col-xs-3">主题</span>
					<input v-model="mainData.SUBJECT_" class="col-xs-9" type="text">
				</div>

				<VoiceRecognition :model="voiceRecognition"></VoiceRecognition>

				
				<div class="foot" style="padding-top:0;text-align:center;">
				</div>
				<Attachment :model="attachmentModel"></Attachment>
				<mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
					<SelectProj :mess="selectProjModel" @selectProjCallback="selectProjCallback($event)"></SelectProj>
				</mt-popup>

				<mt-popup v-model="departModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
					<selectQuarters :orgModel="departModel" ref="departSel"></selectQuarters>
				</mt-popup>

				<ProcessForm :model="processModel" ref="process"></ProcessForm>

			</div>
		</div>
	</div>
</template>

<script>
//var wx = require('weixin-js-sdk');
var managerConfigData;
var groupId;

import { mapState, mapGetters, mapActions } from 'vuex'
import SelectProj from '../common/SelectProj.vue'
import VoiceRecognition from '../common/VoiceRecognition.vue'
import selectQuarters from '../common/selectQuarters.vue'
import Attachment from '../common/Attachment.vue'
import ProcessForm from '../common/ProcessForm.vue'
import { XTextarea,  Divider } from 'vux'
import { Range } from 'vux'
import { Datetime } from 'vux'
export default {
	name: 'movebx',
	data() {
		return {
			agentId: 27,
			loading: false,
			movebxVisible: false,
			movebxTextarea: '同意',
			movebxChecked: '',
			currentActId: '',
			sn: '',
			mainData: {
				SUBJECT_: '',
				PROJ_UID_: '',
				DEPART_UID_: this.sessionUtil.getDepartUid(this),
				formKey: 'apply_common',
			},
			formKey: 'apply_common',
			sqlTableName: 'T_APPLY_COMMON',
			modelName: '通用申请',
			date: new Date().format("yyyy-MM-dd"),
			projName: '选择项目',
			selectProjVisible: false,
			projUid: '11',
			projInfo: {
				projName: '选择项目',
				projUid: ''
			},
			attachmentModel: {
				isReadOnly: false,
				title: '上传附件',
				fileList: [],
				deleteFilesList: []
			},
			processModel: {
				isReadOnly: false,
				parent: null,
				id: '',
				procDefId: '',
				procInstId: ''
			},
			departModel: {
				departName: this.sessionUtil.getDepartName(this),
				departUid: this.sessionUtil.getDepartUid(this),
				visible: false
			},
			voiceRecognition: {
				title: '详细描述',
				isReadOnly: false,
				placeholder: '请输入详情...',
				content: ''
			},
			//children: [{ show: true }],
			//selectProjModel:{projUid:this.projUid,selectProjVisible:this.selectProjVisible},
			assignee: '',
			isReadOnly: true,//是否只读
			isNewFlag: true,//是否是新增
			id: ''
		}
	},
	created() {
		//this.$store.state.selectProjModel.projName='aaa';

		var _this = this;
		var wxurl = window.location.href.split("#")[0];
		//this.util.wxConfig(this, wxurl, ['startRecord', 'stopRecord', 'uploadVoice']);
		this.util.post("/wx/getWxPageConfig", { url: wxurl }, function (result) {
			_this.wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: 'wx464b5d94f5edf957', // 必填，企业号的唯一标识，此处填写企业号corpid
				timestamp: result.timestamp, // 必填，生成签名的时间戳
				nonceStr: result.nonceStr, // 必填，生成签名的随机串
				signature: result.signature,// 必填，签名，见附录1
				jsApiList: ['hideOPtionMenu', 'getLocation', 'chooseImage', 'uploadImage', 'previewImage', 'openEnterpriseContact', 'startRecord', 'stopRecord', 'uploadVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		});




	},
	activated() {
		this.$store.state.selectProjModel.vue = this;
		this.util.initUrlParam(this.mainData);
		this.id = this.mainData.id;
		this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;
		this.attachmentModel.isReadOnly = this.mainData.isReadOnly;
		this.voiceRecognition.isReadOnly = this.mainData.isReadOnly;
		this.loadData();
		this.processModel.parent = this;
		this.$refs.process.initProcess();

		this.isReadOnly = this.mainData.isReadOnly;
	},
	components: {
		// 名字
		XTextarea, Datetime, SelectProj, ProcessForm, selectQuarters, Range, Attachment, VoiceRecognition
	},
	computed: {
		...mapState({
			username: state => state.username,
			userId: state => state.userId,
			selectProjModel: state => state.selectProjModel
		})

	},
	witch: {
		isReadOnly: function (newVal) {
			console.info("--" + isReadOnly);

		}
	},
	methods: {
		...mapActions([

			'selectProj',
			'selectProjCallback',
			'updateMainFormHeight'

		]),
		changeNnt(child) {
			//console.info(typeof child.nnt+"--nnt---"+child.nnt);
			//child.schedule = Number(child.nnt);
			//console.info("schedule---"+child.schedule);
		},
		loadData() {

			var _this = this;
			//console.info(this.isNewFlag);

			_this.date = new Date().format("yyyy-MM-dd");


			//_this.children = [];

			_this.attachmentModel.fileList = [];
			_this.attachmentModel.deleteFilesList = [];
			_this.voiceRecognition.content = '';
			//_this.attachmentModel.parentId = this.id;
			if (!this.isNewFlag) {
				_this.util.mask("正在加载...");
				this.util.post('/business/get', { id: this.id, formKey: _this.formKey }, function (res) {
					//console.info(res);
					if (res != undefined && res.status == 200) {
						if (res != undefined && res.data != undefined) {
							_this.mainData.PROJ_UID_ = res.data.PROJ_UID_;
							_this.mainData.PROJ_NAME_ = res.data.PROJ_NAME_;
							_this.mainData.DEPART_UID_ = res.data.DEPART_UID_;
							_this.mainData.DEPART_NAME_ = res.data.DEPART_NAME_;
							_this.departModel.departUid = res.data.DEPART_UID_;
							_this.departModel.departName = res.data.DEPART_NAME_;


							_this.voiceRecognition.content = res.data.CONTENT_;
							_this.date = res.data.DATE_;
							_this.selectProjModel.projUid = res.data.PROJ_UID_;
							_this.selectProjModel.projName = res.data.PROJ_NAME_;

						}
					}
					_this.util.unmask();
				});
			}
		},
		cancle() {

		}, checkValid() {
			if (!this.util.isNotEmpty(this.departModel.departName)) {
				this.util.failueToast("请选择部门！");
				return false;
			}
			return true;
		}, getData() {
			var _this = this;
			this.mainData.PROJ_UID_ = this.selectProjModel.projUid;
			this.mainData.DEPART_UID_ = this.departModel.departUid;
			this.mainData.SUBJECT_ = this.date + " " + this.sessionUtil.getUserName(this) + "的通用申请";
			this.mainData.CONTENT_ = this.voiceRecognition.content;
			//var subForm = { subFormId: 'subForm1', subFormForeignKey: 'APPLY_UID_', subFormTable: 'WX_APPLY_GOODS_DET' };
			//console.info("--------222------");
			//var subFormArr = this.children;
			//console.info("--------333------");
			//subForm['data'] = JSON.stringify(subFormArr);
			//var subFormData = new Array();
			//subFormData.push(subForm);
			var filesData = new Array();
			for (var i in this.attachmentModel.fileList) {
				var file = this.attachmentModel.fileList[i];
				if (file.isNewFlag) {
					filesData.push(file);
				}
			}
			//console.info(_this.attachmentModel.deleteFilesList);
			var params = { sqlTableName: this.sqlTableName, mainFormData: JSON.stringify(this.mainData), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
			if (!this.isNewFlag) {
				params['id'] = this.id;
				params['businessKey'] = this.id;
			}
			params['subject'] = this.mainData.SUBJECT_;
			//console.info(params);
			return params;
		}, updateStatus() {
			this.attachmentModel.isReadOnly = this.isReadOnly;
			this.voiceRecognition.isReadOnly = this.isReadOnly;

		}, selectDepart(departModel) {
			//console.info(departModel);
			departModel.visible = true;
			var departUidArr = new Array();
			if (this.util.isNotEmpty(departModel.departUid)) {
				departUidArr = departModel.departUid.split(",");
			}
			this.$refs.departSel.postMsg({ singer: true, radioCheckedArr: departUidArr })
		}, handler(index) {

		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.top,
.middle {
	text-align: left;
}

//金额    生产日期
.unpop,
.pop,
.price,
.date {
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee; // border-bottom: 1px solid #ccc;
}

.vux-slider {
	padding-left: 10px;
}

.unpop .daright {
	text-align: right;
}

.pop {
	.daright {
		text-align: right;
	}
}

.price input,
.date input {
	height: 40px;
	padding-top: 10px;
	text-align: right;
}

.unpop>span,
.pop>span,
.price>span,
.date>span,
.bill>span {
	padding: 0 10px;
}

.block {
	text-align: right;
}



//foot
.foot {
	height: 100%;
	line-height: 48px;
	p {
		margin: 0;
		color: blue;
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
}

.footer {
	height: 3rem;
	padding-top: 10px;
	background: #eee;
	line-height: 42px;
}

.weui-cell:before {
	border-top: 0px solid #e5e5e5;
}
.mint-cell-wrapper {
	font-size: 14px;
	background: none;
	background-image: none!important;
}

.mint-cell-title {
	font-size: 14px;
}

.mint-cell-value {
	font-size: 14px;
	color: #0c0c0c!important;
}

.mint-cell-allow-right::after {

	right: 13px !important;
}

.weui-cell__ft {
	color: #171616!important;
}

.mint-cell-value.is-link {
	margin-right: 14px !important;
}

</style>
<style>
/***/


</style>
<style>

</style>
