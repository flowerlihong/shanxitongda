<template>
	<div class="movebx" style="overflow: auto;height: 100%;">
		<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
			<div class="weui-cell__hd">
				<span>日期</span>
			</div>
			<div class="weui-cell__bd">
				<span>{{mainData.fsrq}}</span>
			</div>
		</div>
		<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
			<div class="weui-cell__hd">
				<span>描述
					<span style="color:red">*</span>

				</span>
			</div>
			<div class="weui-cell__bd">
				<input :readonly="isReadOnly" v-model="mainData.tpms" style="text-align: right;" type="text" placeholder="" />

			</div>
		</div>
		<div class="weui-cell weui-cell_select myCell" style="padding-left: 10px;border-bottom: 1px solid #D9D9D9;">
			<div class="weui-cell__hd">
				<span>项目
					<span style="color:red">*</span>
				</span>
			</div>
			<div v-if="!isReadOnly" class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectProj(selectProjModel)">
				<span style=" display: block;height: 100%;padding-right: 0px;line-height: 24px;">{{selectProjModel.projName}}</span>
				<input v-model="selectProjModel.projUid"  type="text" style="display:none">
			</div>
		</div>

		<Attachment :model="attachmentModel"></Attachment>
		<mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectProj :mess="selectProjModel" @selectProjCallback="selectProjCallback($event)"></SelectProj>
		</mt-popup>

		<ProcessForm :model="processModel" ref="process"></ProcessForm>
	</div>
</template>

<script>
import { cookieUtil } from '@/utils/utils.js'

import { mapState, mapGetters, mapActions } from 'vuex'
import SelectProj from '../common/SelectProj.vue'
import Attachment from '../common/Attachment.vue'
import ProcessForm from '../common/ProcessForm.vue'

export default {
	name: 'movebx',
	data() {
		return {
			loading: false,
			sn: '',
			date: new Date().format("yyyy-MM-dd"),
			projName: '选择项目',
			selectProjVisible: false,
			projUid: '11',
			projInfo: {
				projName: '选择项目',
				projUid: ''
			},
			mainData: {
				fsrq: '',
				tpms: ''
			},
			attachmentModel: {
				isReadOnly: false,
				xtype:'fujian',
				title: '现场照片',
				fileList: [],
				deleteFilesList: []
			},
			formId: "DForm_G006_yxxc_tpgl",
			sqlTableName: 'G006_yxxc_xmtp',
			processModel: {
				ifHashWorkflow: false,
				isReadOnly: false,
				sqlTableName: this.sqlTableName,
				formId: this.formId,
				parent: this,
				id: '',
				procDefId: '',
				procInstId: ''
			},
			isReadOnly: true,//是否只读
			isNewFlag: true,//是否是新增
			id: ''
		}
	},
	created() {

	},
	activated() {
		this.$store.state.selectProjModel.vue = this;
		this.mainData = {
			fsrq: new Date().format("yyyy-MM-dd"),
			tpms: '',
			xmid: '',
			Subject: ''
		};
		var id = this.util.getUrlParam("id");
		var isReadOnlyParam = this.util.getUrlParam("isReadOnly");
		this.isReadOnly = (this.validUtil.isNotEmpty(isReadOnlyParam) && isReadOnlyParam == "true") ? true : false;
		this.isNewFlag = (this.validUtil.isNotEmpty(id)) ? false : true;
		this.attachmentModel.isReadOnly = this.isReadOnly;
		this.id = id;
		//this.loadData();
	},
	components: {
		// 名字
		SelectProj, Attachment,ProcessForm
	},
	computed: {
		...mapState({
			username: state => state.username,
			userId: state => state.userId,
			selectProjModel: state => state.selectProjModel
		})

	},
	methods: {
		...mapActions([

			'selectProj',
			'selectProjCallback'

		]), afterSelectProj(data) {
			//console.info(data);

			//this.subject = this.date+data.projName+'日志';
			//console.info("afterSelectProj")
			//console.info(data)
		},
		checkValid() {


			if (!this.validUtil.isNotEmpty(this.selectProjModel.projUid)) {
				this.util.failueToast('请选择项目！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.mainData.tpms)) {
				this.util.failueToast('图片描述不能为空！');
				return false;
			}
			
			return true;
		}, getMainFormData() {

			this.mainData.xmmc = this.selectProjModel.projName;
			this.mainData.xmid = this.selectProjModel.projUid;
			this.mainData.Subject = this.mainData.fsrq + this.mainData.xmmc + "的现场图片";
			

			return this.mainData;
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
			var params = { sqlTableName: this.sqlTableName, mainFormData: JSON.stringify(mainData),  filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
			if (this.validUtil.isNotEmpty(this.id)) {
				params['id'] = this.id;
				params['businessKey'] = this.id;
			}
			params['formId'] = this.formId;
			//params['subject'] = mainData.Subject;

			console.info(params);

			return params;

		}, handler(index) {

		}	//console.info(child.show);

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
</style>
