<template>
	<div id="mainForm" class="movebx" v-loading="loading" element-loading-text="拼命加载中" style="height: 100%;padding-bottom: 67px;width: 100%;" ref="mainForm">
		<div style="height: 100%;overflow:auto;width: 100%;">
			<div style="">
				<div class="price" style="text-align:left;border:0px;">
					<span class="col-xs-3">日期</span>
					<datetime class="col-xs-9" :readonly="1==1" v-model="date" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>

				</div>

				<div id="xm" class="price" :style="isReadOnly?'text-align:left;height:49px;border-top: 0px;':'text-align:left;border-top: 0px;'">
					<mt-cell v-if="!isReadOnly" @click.native="selectProj(selectProjModel)" style="width:100%;background-position: inherit;background-image: none;border:0px" title="项目" is-link>
						<span>{{(selectProjModel.projName!=undefined && selectProjModel.projName.length>18)?(selectProjModel.projName.substring(0,18)+'...'):selectProjModel.projName}}</span>
						<input v-model="selectProjModel.projUid" class="col-xs-9" type="text" style="display:none">
					</mt-cell>
					<mt-cell v-if="isReadOnly" style="width:100%;background-position: inherit;background-image: none;" title="项目" is-link>
						<span>{{(selectProjModel.projName!=undefined && selectProjModel.projName.length>18)?(selectProjModel.projName.substring(0,18)+'...'):selectProjModel.projName}}</span>
						<input v-model="selectProjModel.projUid" class="col-xs-9" type="text" style="display:none">
					</mt-cell>
				</div>

				<div id="msg" class="price" style="text-align:left;border-top: 0px;">
					<mt-cell v-if="!isReadOnly" @click.native="selectDepart(departModel)" style="width:100%;background-position: inherit;background-image: none;" title="部门" is-link>
						<span>{{(departModel.departName!=undefined && departModel.departName.length>18)?(departModel.departName.substring(0,18)+'...'):departModel.departName}}</span>
						<input v-model="departModel.departUid" class="col-xs-9" type="text" style="display:none">
					</mt-cell>
					<mt-cell v-if="isReadOnly" style="width:100%;background-position: inherit;background-image: none;" title="部门" is-link>
						<span>{{(departModel.departName!=undefined && departModel.departName.length>18)?(departModel.departName.substring(0,18)+'...'):departModel.departName}}</span>
						<input v-model="departModel.departUid" class="col-xs-9" type="text" style="display:none">
					</mt-cell>
				</div>
				<div class="price" style="text-align:left;border-top: 1px solid #dcdcdc;">
					<span class="col-xs-3">交付日期</span>
					<datetime class="col-xs-9" :readonly="isReadOnly" v-model="mainData.DELIVER_DATE_" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>

				</div>
				<div class="price" style="text-align:left;display:none;">
					<span class="col-xs-3">主题</span>
					<input v-model="mainData.SUBJECT_" class="col-xs-9" type="text">
				</div>

				<VoiceRecognition :model="voiceRecognition"></VoiceRecognition>

				<template v-for="(child,index) in children">
					<div @click="show(child)" v-if="(child.show == undefined || !child.show)" :key="index" class="middle" style="border-bottom: 1px solid #ccc;">
						<div class="pop" style="background-color: #eeefef;">
							<span class="col-xs-3" style="text-align:left;">采购明细{{index+1}}</span>
							<div class="daright col-xs-9">
								<span>{{(child.SUBJECT_!=undefined && child.SUBJECT_.length>12)?(child.SUBJECT_.substring(0,12)+'...'):child.SUBJECT_}}</span>
								<span style="margin-right:20px;"> {{child.AMOUNT_?('*'+child.AMOUNT_):''}}</span>
								<i class="glyphicon glyphicon-chevron-down"></i>
							</div>
						</div>
					</div>
					<div v-if="child.show" :key="index" class="middle">
						<div class="pop" style="background-color: #eeefef;">
							<span class="col-xs-4">采购明细{{index+1}}:</span>
							<div @click.stop="hide(child)" class="daright col-xs-8">
								<span v-if="!isReadOnly" style="color:#f00;" @click.stop="remove(child)">-删除</span>&nbsp;&nbsp;
								<span v-if="!isReadOnly" style="color:blue;margin:0 10px;" @click.stop="add(child)">+复制</span>
								<i class="glyphicon glyphicon-chevron-up"></i>
							</div>
						</div>
						<div class="price" style="text-align:left;">
							<span class="col-xs-3">名称<span class="span_required">*</span></span>
							<input :readonly="isReadOnly" v-model="child.SUBJECT_" class="col-xs-9" type="text">
						</div>
						<div class="price" style="text-align:left;">
							<span class="col-xs-3">规格</span>
							<input :readonly="isReadOnly" v-model="child.SPECS_" class="col-xs-9" type="text">
						</div>
						<div class="price" style="text-align:left;">
							<span class="col-xs-3">单位</span>
							<input :readonly="isReadOnly" v-model="child.UNIT_" class="col-xs-9" type="text">
						</div>
						<div class="price" style="text-align:left;">
							<span class="col-xs-3">数量<span class="span_required">*</span></span>
							<input :readonly="isReadOnly" @keyup="change(child)" v-model="child.AMOUNT_" class="col-xs-9" type="number">
						</div>
						<div class="price" style="text-align:left;">
							<span class="col-xs-3">预算单价</span>
							<input :readonly="isReadOnly" @keyup="change(child)" v-model="child.PRICE_" class="col-xs-9" type="number">
						</div>
						<div class="price" style="text-align:left;">
							<span class="col-xs-3">预算总价</span>
							<input :readonly="true" v-model="child.TOTAL_" class="col-xs-9" type="number">
						</div>
					</div>
				</template>
				<div class="foot" style="padding-top:0;text-align:center;">
					<div>
						<p v-if="!isReadOnly" @click="add" style="text-align:center;"> + 添加明细</p>
					</div>
					<div>
						<p class="footColor">共
							<span>{{children.length}}</span> 条明细</span>
						</p>
					</div>
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
import { XTextarea, Divider } from 'vux'
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
				DELIVER_DATE_: new Date().format("yyyy-MM-dd"),
				DEPART_UID_: this.sessionUtil.getDepartUid(this),
				formKey: 'apply_purchase',
			},
			formKey: 'apply_purchase',
			sqlTableName: 'T_PURCHASE',
			modelName: '采购申请',
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
				title: '采购事由',
				isReadOnly: false,
				placeholder: '请输入详情...',
				content: ''
			},
			children: [{ show: true }],
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
		this.util.initWxJsSdk(this);




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
		isReadOnly: function(newVal) {
			console.info("--" + isReadOnly);

		}
	},
	methods: {
		...mapActions([

			'selectProj',
			'selectProjCallback',
			'updateMainFormHeight'

		]),
		
		change(child) {
			var amount = 0;
			var price = 0;
			if( this.util.isNotEmpty(child.AMOUNT_)){
				amount =  Number(child.AMOUNT_);
			}
			if( this.util.isNotEmpty(child.PRICE_)){
				price =  Number(child.PRICE_);
			}
			var total = amount* price;
			child.TOTAL_ = total;
			//console.info(typeof child.nnt+"--nnt---"+child.nnt);
			//child.schedule = Number(child.nnt);
			//console.info("schedule---"+child.schedule);
		},
		loadData() {

			var _this = this;
			//console.info(this.isNewFlag);

			_this.date = new Date().format("yyyy-MM-dd");


			_this.children = [];

			_this.attachmentModel.fileList = [];
			_this.attachmentModel.deleteFilesList = [];
			_this.voiceRecognition.content = '';
			//_this.attachmentModel.parentId = this.id;
			if (!this.isNewFlag) {
				_this.util.mask("正在加载...");
				this.util.post('/business/get', { id: this.id, formKey: _this.formKey }, function(res) {
					//console.info(res);
					if (res != undefined && res.status == 200) {
						if (res != undefined && res.data != undefined) {
							
							_this.util.clone(res.data,_this.mainData);


							_this.departModel.departUid = res.data.PROC_UID_;
							_this.departModel.departName = res.data.DEPART_NAME_;


							_this.voiceRecognition.content = res.data.CONTENT_;
							_this.date = res.data.DATE_;
							_this.selectProjModel.projUid = res.data.PROJ_UID_;
							_this.selectProjModel.projName = res.data.PROJ_NAME_;

							if (res.data['children'] != undefined) {
								if (_this.util.isNotEmpty(res.data['children'][0]['ID_'])) {
									_this.children = res.data['children'];
								}

							} else {
								_this.children = [];
							}
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
			for (var i = 0; i < this.children.length; i++) {
				var item = this.children[i];
				if (!this.validUtil.isNotEmpty(item.SUBJECT_)) {
					this.util.failueToast("明细" + (i + 1) + "的名称不能为空！");
					return false;
				}
				if (!this.validUtil.isNotEmpty(item.AMOUNT_)) {
					this.util.failueToast("明细" + (i + 1) + "的数量不能为空！");
					return false;
				}
			}
			return true;
		}, getData() {
			var _this = this;
			this.mainData.PROJ_UID_ = this.selectProjModel.projUid;
			this.mainData.DEPART_UID_ = this.departModel.departUid;
			this.mainData.SUBJECT_ = this.date + " " + this.sessionUtil.getUserName(this) + "的采购申请";
			this.mainData.CONTENT_ = this.voiceRecognition.content;
			var subForm = { subFormId: 'subForm1', subFormForeignKey: 'PARENT_UID_', subFormTable: 'T_PURCHASE_DET' };
			//console.info("--------222------");
			var subFormArr = this.children;
			//console.info("--------333------");
			subForm['data'] = JSON.stringify(subFormArr);
			var subFormData = new Array();
			subFormData.push(subForm);
			var filesData = new Array();
			for (var i in this.attachmentModel.fileList) {
				var file = this.attachmentModel.fileList[i];
				if (file.isNewFlag) {
					filesData.push(file);
				}
			}
			//console.info(_this.attachmentModel.deleteFilesList);
			var params = { sqlTableName: this.sqlTableName, mainFormData: JSON.stringify(this.mainData), subFormData: JSON.stringify(subFormData), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
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
			
			this.$refs.departSel.postMsg({ singer: true, radioCheckedArr: departUidArr });
		}, handler(index) {

		}, remove(child) {
			//if(this.children.length == 1)
			this.children = this.children.filter((item) => {
				return item != child;
			});
		}, add(child) {
			//console.info(child);
			for (var i in this.children) {
				this.children[i].show = false;
			}
			if (child != undefined) {
				child.show = false;
				this.children.push({
					SUBJECT_: child.SUBJECT_,
					SPECS_: child.SPECS_,
					AMOUNT_: child.AMOUNT_,
					UNIT_: child.UNIT_,
					PRICE_:child.PRICE_,
					TOTAL_:child.TOTAL_,
					SORT_: this.children.length + 1,
					show: true
				});
			} else {
				this.children.push({
					SUBJECT_: '',
					SPECS_: '',
					AMOUNT_: 0,
					UNIT_: '',
					PRICE_: 0,
					TOTAL_: 0,
					SORT_: this.children.length + 1,
					show: true
				});
			}
			//console.info(this.children.length);
		}, hide(child) {
			child.show = false;
			//console.info(child.show);
		}, show(child) {
			for (var i in this.children) {
				this.children[i].show = false;
			}
			child.show = true;

			//console.info(child.show);
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
