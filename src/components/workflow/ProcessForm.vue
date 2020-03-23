<template>
	<!-- <div id="mainForm" class="movebx" v-loading="loading" element-loading-text="拼命加载中" style="height: 100%;padding-bottom: 67px;width: 100%;" ref="mainForm"> -->
	<div id="mainForm" class="movebx" style="height: 100%;padding-bottom: 67px;width: 100%;" ref="mainForm">
		<div style="height: 100%;overflow:auto;width: 100%;">
			<div style="">
				<div class="price" style="text-align:left;">
					<span class="col-xs-3">流程名称</span>
                    <span>{{processModel.procDefName}}</span>
				</div>
				<div v-if="ifShowCurrentActName" class="price" style="text-align:left;">
					<span class="col-xs-3">当前节点</span>
                    <span>{{currentActName}}</span>
				</div>
				<div class="price" style="text-align:left;">
					<!-- <span class="col-xs-3" @click="showFormData();" style="width: 50%;">查看单据数据</span> -->
					<span class="col-xs-3" style="width: 50%;">
						<!-- <el-button size="small" @click="showFormData();" type="primary">查看单据数据</el-button> -->
						<a :href="detailDataUrl" class="btn btn-info" target="_self">查看单据数据</a>
					</span>
					<span style="width: 50%; float: right; text-align: right;">
						<!-- <el-button size="small" @click="lookWorkflowPng();" type="primary">查看流程图</el-button> -->
						<a :href="pngUrl" class="btn btn-info" target="_self">查看流程图</a>
					</span>
                    <!-- <span @click="lookWorkflowPng();">查看流程图</span> -->
				</div>

				<!-- <div style="text-align: left; width: 100%;min-height: 35px;font-size: 18px;" @click="showFormData();">查看单据数据</div> -->
				<!-- <div class="price" style="text-align:left;">
					<span class="col-xs-3">主题</span>
					<input class="col-xs-9" type="text">
				</div> -->

				<!-- <VoiceRecognition :model="voiceRecognition"></VoiceRecognition> -->

				<!-- <template v-for="(ativity,index) in activities"> -->
				<template>
					<!-- <div @click="show(child)" v-if="(child.show == undefined || !child.show)" :key="index" class="middle" style="border-bottom: 1px solid #ccc;">
						<div class="pop" style="background-color: #eeefef;">
							<span class="col-xs-3" style="text-align:left;">领用明细{{index+1}}</span>
							<div class="daright col-xs-9">
								<span>2222</span>
								<span style="margin-right:20px;">776767676</span>
								<i class="glyphicon glyphicon-chevron-down"></i>
							</div>
						</div>
					</div> -->
					<div v-if="isWorkflow">
						<div v-for="(activity,index) in activities" :key="activity.id">					
						<!-- <div v-if="activity.show" :key="index" class="middle"> -->
							<div @click="show(activity,index)" v-if="!activity.show" class="middle" :key="index">
								<!-- <div  @click="show(child)" v-if="(child.show == undefined || !child.show)" :key="index" class="middle" style="border-bottom: 1px solid #ccc;"> -->
									<div class="pop" style="background-color: #eeefef;">
										<span class="col-xs-3" style="width: 75%;"><input :name="activity.selectType" :type="activity.selectType=='radio'?'radio':'checkbox'" :id="activity.id">&nbsp;{{activity.transition}}</span>
										<div class="daright col-xs-9" style="float: right;width: 25%;">
											<!-- <span>{{(child.SUBJECT_!=undefined && child.SUBJECT_.length>12)?(child.SUBJECT_.substring(0,12)+'...'):child.SUBJECT_}}</span>
											<span style="margin-right:20px;"> {{child.AMOUNT_?('*'+child.AMOUNT_):''}}</span> -->
											<i class="glyphicon glyphicon-chevron-down"></i>
										</div>
									</div>
							</div>
							<div v-if="activity.show" :key="index" class="middle">
								<div class="pop" style="background-color: #eeefef;">
									<span class="col-xs-4" style="width: 75%;"><input :name="activity.selectType" :type="activity.selectType=='radio'?'radio':'checkbox'" :id="activity.id">&nbsp;{{activity.transition}}</span>
									<div class="daright col-xs-8" style="width: 25%; float: right;" @click.stop="hide(activity)">
										<i class="glyphicon glyphicon-chevron-up"></i>
									</div>
								</div>
								<div class="price" style="text-align:left;border-top: 0px solid #eee;min-height:135px;width:100%;">
										<div v-if="isWorkflow && !isEndEvent">
											<span class="col-xs-12" style="padding-left: 10px;">选择处理人</span>
											<div class="load">
												<ul id="imgsLoad" style="margin-bottom:0px;">
													<li style="margin-top: 2px;height:85px;overflow-y:auto;overflow-x:hidden;width:100%;">
														<ul class="clearfix">
															<li style="margin:5px 5px 0px 5px;position:relative;text-align:left;float:left;" v-for="procUser in activity.procUserModel.users" :key="procUser.id">
																<div>
																	<div>
																		<img style="width:43px;height:43px;" :src="procUser.picture" alt=""></div>
																	<div style="text-align:center; font-size: 10px;line-height: 32px;height: 32px;">
																		<span>{{procUser.userName}}</span>
																	</div>
																</div>
																<i @click="removeProcUser(procUser,$event,index)" v-if="showProcUserDelete" class="changeDelete" style="position:absolute;top:-6px;left:-5px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
															</li>
															<li v-if="ifSelUser" style="margin:5px 0px 5px 3px;position:relative;text-align:left;float:left;">
																<div><img style="width:50px;height:50px;" @click="addProcUser(index)" src="../../assets/add_image.png"></div>
															</li>
															<li v-if="ifSelUser" style="margin:5px 5px 5px 5px;position:relative;text-align:left;float:left;">
																<div><img style="width:50px;height:50px;" @click="delProcUser()" src="../../assets/remove_image.png"></div>
															</li>
														</ul>
													</li>

												</ul>
											</div>
										</div>
									</div>
							</div>
						</div>
					</div>
				</template>

				<div class="price" style="text-align:left;border-top: 0px solid #eee;min-height:147px;width:100%;">
					<div v-if="(isWorkflow && ifShowCopy) || ifCopy">
						<!-- <span class="col-xs-12" style="padding-left: 10px;">选择抄送人</span> -->
						<div class="pop" style="background-color: #eeefef;">
							<span class="col-xs-4" style="width: 75%;">选择抄送人</span>
						</div>
						<div class="load">
							<ul id="imgsLoad" style="margin-bottom:0px;">
								<li style="margin-top: 2px;height:85px;overflow-y:auto;overflow-x:hidden;width:100%;">
									<ul class="clearfix">
										<li style="margin:5px 5px 0px 5px;position:relative;text-align:left;float:left;" v-for="user in copyUserModel.users" :key="user.id">
											<div>
												<div>
													<img style="width:43px;height:43px;" :src="user.picture" alt=""></div>
												<div style="text-align:center; font-size: 10px;line-height: 32px;height: 32px;">
													<span>{{user.userName.length>3?user.userName.substring(0,3):user.userName}}</span>
												</div>
											</div>
											<i @click="removeCopyUser(user,$event,index)" v-if="showCopyUserDelete" class="changeDelete" style="position:absolute;top:-6px;left:-5px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
										</li>
										<li v-if="ifSelCopy" style="margin:5px 0px 5px 3px;position:relative;text-align:left;float:left;">
											<img style="width:50px;height:50px;" @click="addCopyUser()" src="../../assets/add_image.png">
										</li>
										<li v-if="ifSelCopy" style="margin:5px 5px 5px 5px;position:relative;text-align:left;float:left">
											<img style="width:50px;height:50px;" @click="delCopyUser()" src="../../assets/remove_image.png">
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!-- <VoiceRecognition v-if="isWorkflow && !isReadOnly" :model="voiceRecognition"></VoiceRecognition> -->

				
				<!-- <Attachment :model="attachmentModel"></Attachment> -->
				<!-- <mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
					<SelectProj :mess="selectProjModel" @selectProjCallback="selectProjCallback($event)"></SelectProj>
				</mt-popup> -->

				<mt-popup v-model="procUserModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
				<!---->
					<SelectUser :userModel="procUserModel" ref="procUserSel" @selectUsersCallBack="handelUsers($event)"></SelectUser>
				</mt-popup>

				<mt-popup v-model="copyUserModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
					<!---->
					<SelectUser :userModel="copyUserModel" ref="copyUserSel"></SelectUser>
				</mt-popup>

				<!-- <ProcessForm :model="processModel" ref="process"></ProcessForm> -->
				<VoiceRecognition v-if="isVoice" :model="voiceRecognition"></VoiceRecognition>
				<ProcessMonitor v-if="ifShowProcessMonitor" :model="processMonitorModel" ref="processMonitor"></ProcessMonitor>
				<div :style="ifHasBtn?'margin-top: 0px;padding-top: 10px;border: 1px solid #d6cece;border-left:0px;border-right:0px;position:fixed;bottom:0;width:100%;background-color: white;':'background-color: white;'">
					<p>
						<!-- <el-button style="width:48%;margin:0;height:1.3rem" type="default">取消</el-button> -->
						<!-- <el-button style="width:48%;margin:0;height:1.3rem" type="success">保存</el-button> -->
						<!-- <el-button @click="submit(14)" v-if="isApply" style="width:48%;margin:0;height:1.3rem" type="primary">撤销</el-button> -->
						<x-button @click.native="submit(14)" v-if="isApply" min style="width:48%;height:45px;display: inline-block;background-color: #0069d9;" type="warn">撤销</x-button>
						<!-- <el-button @click="submit(13)" v-if="isApply" style="width:48%;margin:0;height:1.3rem" type="success">催办</el-button> -->
						<x-button @click.native="submit(13)" v-if="isApply" min style="width:48%;height:45px;display: inline-block;" type="primary">催办</x-button>
						<!-- <el-button @click="submit(6)" v-if="ifApproval && ifBackPre" style="width:48%;margin:0;height:1.3rem" type="danger">不同意</el-button> -->
						<x-button @click.native="submit(6)" v-if="ifApproval && ifBackPre" min style="width:48%;height:45px;display: inline-block;" type="warn">不同意</x-button>
						<!-- <el-button @click="submit(10)" v-if="ifClose" style="width:48%;margin:0;height:1.3rem" type="primary">取消</el-button> -->
						<x-button @click.native="submit(10)" v-if="ifClose" min style="width:48%;height:45px;display: inline-block;" type="default">取消</x-button>
						<!-- <el-button @click="submit(0)" v-if="ifsubmit" style="width:48%;margin:0;height:1.3rem" type="success">{{isEndEvent?"办理完成":(ifUnread?"已阅":"提交")}}</el-button> -->
						<x-button @click.native="submit(0)" v-if="ifsubmit" min style="width:48%;height:45px;display: inline-block;" type="primary">{{isEndEvent?"办理完成":(ifUnread?"已阅":"提交")}}</x-button>
						<!-- <el-button style="width:48%;margin:0;height:1.3rem" type="success">同意</el-button> -->
					</p>
				</div>
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
import SelectUser from '../common/SelectUser.vue'
import Attachment from '../common/Attachment.vue'
import ProcessForm from '../common/ProcessForm.vue'
import ProcessMonitor from '../common/ProcessMonitor.vue'
import { XTextarea,  Divider, XButton } from 'vux'
import { Range } from 'vux'
import { Datetime } from 'vux'
export default {
	name: 'movebx',
	data() {
		return {
			loading: false,
			currentActName: '',
			ifShowCurrentActName: false,
			selectIndex: 0,
			assignee: '',
			taskType: '',
			date: new Date().format("yyyy-MM-dd"),
			processModel: {
				isReadOnly: false,
				procDefId: '',
				procInsId: '',
				taskId: '',
				currentActId: '',
				procDefName: ''
			},
			voiceRecognition: {
				title: '意见说明',
				isReadOnly: false,
				placeholder: '请输入意见说明...',
				content: ''
			},
			processMonitorModel: {
				procInstId: '',
				procDefId: '',
				currentActName: '',
				currentActId: '',
			},
			//children: [{ show: true }],
			//selectProjModel:{projUid:this.projUid,selectProjVisible:this.selectProjVisible},
			isReadOnly: false,//是否只读
			isVoice: false,
			pageType: '',
            //id: '',
            procUserModel: { visible: false, single: false, users: [] },
            copyUserModel: { visible: false, single: false, users: [] },
			activities:[],
			detailDataUrl: '',
			isWorkflow: false,
			isEndEvent: false,
			ifSelUser: false,
			isApply: false,
			ifShowCopy: true,
			ifSelCopy: true,
			ifBackPre: false,
			ifsubmit: false,
			ifShowProcessMonitor: false,
			showProcUserDelete: false,
			showCopyUserDelete: false,
			ifHasBtn: true,
			activitiesData:[],
			mainFormData: {},
			sqlTableName: '',
			startUserId: '',
			businessKey: '',
			timer:null,
			monitorTimer:null,
			ifChecked: false,
			ifComment: false,
			ifCopyNull: false,
			ifCopy:false,
			ifClose: false,
			ifApproval: false,
			ifUnread: false,
			detailDataUrl: '',
			pngUrl: ''
		}
	},
	created() {
		//this.$store.state.selectProjModel.projName='aaa';

		var _this = this;
		this.util.initWxJsSdk(this);
	},
	activated() {
		//this.$store.state.selectProjModel.vue = this;
		//this.util.initUrlParam(this.mainData);
		//this.id = this.mainData.id;
		this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;
		//this.attachmentModel.isReadOnly = this.mainData.isReadOnly;
		//this.voiceRecognition.isReadOnly = this.mainData.isReadOnly;
		//this.loadData();
		//this.processModel.parent = this;
		//this.$refs.process.initProcess();
		this.processModel.procDefId = this.util.getUrlParam('_procDefId');
		this.processModel.taskId = this.util.getUrlParam('_taskId');
		this.processModel.currentActId = this.util.getUrlParam('_currentActId');
		this.processModel.procInsId = this.util.getUrlParam('_procInstId');
		this.startUserId = this.util.getUrlParam('_startUserId');
		this.businessKey = this.util.getUrlParam('id');
		this.assignee = this.util.getUrlParam("_assignee");
		this.taskType = this.util.getUrlParam("_taskType");
		this.processMonitorModel.procDefId = this.util.getUrlParam('_procDefId');
		this.processMonitorModel.procInsId = this.util.getUrlParam('_procInstId');
		//var _procDefName = this.util.getUrlParam('_procDefName');
		var _procDefName = this.getQueryString('_procDefName')
		//console.info('=============================_procDefName======================');
		//console.info(_procDefName);
		if(_procDefName){
			_procDefName = decodeURIComponent(decodeURIComponent (_procDefName));
		}else{
			_procDefName = '';
		}
		//console.info(_procDefName);
		//console.info(decodeURI(_procDefName));
		this.processModel.procDefName = _procDefName;
		
		this.pageType = this.util.getUrlParam("_pageType");
		if(this.pageType == 'unApproval'){
			this.isWorkflow = true;
			this.isVoice = true;
			this.ifsubmit = true;
			this.isApply = false;
			this.ifShowProcessMonitor = true;
			//是否是待办页面
			this.ifApproval = true;
			//是否显示当前流程节点
			this.ifShowCurrentActName = true;
			//显示取消按钮
			this.ifClose = false;
			//是待阅页面
			this.ifUnread = false;
			this.loadData();
		}else if(this.pageType == 'approval'){
			this.isWorkflow = false;
			this.isVoice = false;
			this.ifsubmit = false;
			this.isApply = false;
			this.ifShowProcessMonitor = true;
			//是否是待办页面
			this.ifApproval = false;
			//是否显示当前流程节点
			this.ifShowCurrentActName = false;
			//显示取消按钮
			this.ifClose = true;
			//是待阅页面
			this.ifUnread = false;
			this.ifCopy = false;
			this.loadMonitor();
		}else if(this.pageType == 'unRead'){
			this.isWorkflow = false;
			this.isVoice = true;
			this.ifsubmit = true;
			this.isApply = false;
			//显示取消按钮
			this.ifClose = true;
			this.ifShowProcessMonitor = true;
			//是否是待办页面
			this.ifApproval = false;
			//是否显示当前流程节点
			this.ifShowCurrentActName = false;
			//是待阅页面
			this.ifUnread = true;
			this.ifCopy = false;
			//this.loadData();
			this.getWorkflowData();
			this.loadMonitor();
		}else if(this.pageType == 'read'){
			this.isWorkflow = false;
			this.isVoice = false;
			this.ifsubmit = false;
			this.isApply = false;
			this.ifShowProcessMonitor = true;
			//是否是待办页面
			this.ifApproval = false;
			//是否显示当前流程节点
			this.ifShowCurrentActName = false;
			//显示取消按钮
			this.ifClose = true;
			//是待阅页面
			this.ifUnread = false;
			this.ifCopy = false;
			this.loadMonitor();
		}else if(this.pageType == 'apply'){
			this.isWorkflow = false;
			this.isVoice = false;
			this.ifsubmit = false;
			this.isApply = true;
			this.ifShowProcessMonitor = true;
			//是否是待办页面
			this.ifApproval = false;
			//是否显示当前流程节点
			this.ifShowCurrentActName = false;
			//显示取消按钮
			this.ifClose = false;
			//是待阅页面
			this.ifUnread = false;
			this.ifCopy = false;
			this.getInitData();
			this.loadMonitor();
		}
		//this.isReadOnly = this.mainData.isReadOnly;
		//设置表单的链接和流程图的链接
		this.detailDataUrl = this.setFormDetailUrl(this.pageType);
		this.pngUrl = this.setBPMPngUrl();
	},
	components: {
		// 名字
		XTextarea, Datetime, SelectProj, ProcessForm, selectQuarters, Range, Attachment, VoiceRecognition, SelectUser, ProcessMonitor, XButton
	},
	computed: {
		...mapState({
			username: state => state.username,
			userId: state => state.userId
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
		},loadMonitor() {
			this.processMonitorModel.procDefId = this.processModel.procDefId;
			this.processMonitorModel.procInsId = this.processModel.procInsId;
			// console.info("this.$refs.processMonitor-----------" + this.processMonitorModel);
			// console.info(this.processMonitorModel);
			if (this.$refs.processMonitor != undefined) {
				this.$refs.processMonitor.loadData();
				clearInterval(this.monitorTimer);
				this.monitorTimer = null;
			} else {
				// console.info('==================================undefined====================================');
				// console.info("============"+this.timer);
				if (this.monitorTimer == null) {
					this.monitorTimer = setInterval(this.loadMonitor, 200);
				}
				return;
			}
			//this.$refs.processMonitor.loadData();
		},loadData() {

			var _this = this;
			//console.info(this.isNewFlag);
			//刚进入页面时清空选择的处理人和抄送人
			_this.activitiesData.splice(0, _this.activitiesData.length);
			// console.info('=======================选择抄送人11111=======================');
			// console.info(this.copyUserModel.userUid);
			if(this.copyUserModel.userUid){
				this.copyUserModel.userUid = '';
			}

			_this.date = new Date().format("yyyy-MM-dd");
			var status = '';
			if(this.assignee == null || this.assignee == ''){
				status = 'claim';
			}else{
				status = 'toDo';
			}
			var param = {
				procDefId: this.processModel.procDefId,
				taskType: this.taskType,
				status: status,
				taskId: this.processModel.taskId,
				businessKey: this.businessKey,
                currentActId: this.processModel.currentActId,
				procInsId: this.processModel.procInsId,
				userId: this.sessionUtil.getUserId(),
				company_id: this.sessionUtil.getCompanyId(),
				userName: this.sessionUtil.getUserName()
			};
			
			//if (!this.isNewFlag) {
			//console.info("================dddddd=================");
			//console.info(param);
			//console.log(param);
			_this.util.mask("正在加载...");
			//this.util.post('/business/get', param, function (res) {
			
			//this.util.post('/open/openWorkflowAction!getProcessFormData.action', param, function (res) {
				console.log("Process-param",param)
			this.util.post('/wx/workflowAction!getProcessFormData.action', param, function (res) {
				console.info(res);
				if(res != undefined && res.status == 200){
					var activitesArr = new Array();
					//判断流程是否关闭
					var flag = res.data.flag;
					if(flag){
						var objs = res.data.activities;
						if(objs && objs.length>0){
							if(objs[0]['taskType']=='endEvent'){
								_this.isWorkflow = false;
								_this.isEndEvent = true;
							}else{
								//不是最后的结束节点
								_this.isEndEvent = false;
								for(var i=0;i<objs.length;i++){
									if(i==0){
										_this.procUserModel['visible'] = false;
										_this.procUserModel['single'] = false;
										var users = new Array();
										if(objs[i].procUsers && objs[i].procUsers.length>0){
											//如果存在默认选择人则放入activitesData中
											var datasObj = new Object();
											datasObj['id'] = objs[i]['id'];
											datasObj['ifDynamic'] = objs[i]['ifDynamic'];
											datasObj['taskType'] = objs[i]['taskType'];
											datasObj['procUsersData'] = JSON.stringify(objs[i].procUsers);
											_this.activitiesData.push(datasObj);
											//将procUserId转换为userId,procUserName转换为userName
											for(var j=0;j<objs[i].procUsers.length;j++){
												var userObj = new Object();
												//console.info('==============procUsers===================');
												//console.info(objs[i].procUsers);
												if(objs[i].procUsers[j]['procUserId']){
													userObj['userId'] = objs[i].procUsers[j]['procUserId']
												}
												if(objs[i].procUsers[j]['procUserName']){
													userObj['userName'] = objs[i].procUsers[j]['procUserName']
												}
												if(objs[i].procUsers[j]['id']){
													userObj['id'] = objs[i].procUsers[j]['id'];
												}
												if(objs[i].procUsers[j]['picture']){
													userObj['picture'] = objs[i].procUsers[j]['picture'];
												}
												/*for(var k in objs[i].procUsers){
													if(k == 'procUserId'){
														//objs[i].procUsers['userId'] = objs[i].procUsers[k];
														userObj['userId'] = objs[i].procUsers[k];
													}else if(k == 'procUserName'){
														//objs[i].procUsers['userName'] = objs[i].procUsers[k];
														userObj['userName'] = objs[i].procUsers[k];
													}else if(k == 'id'){
														userObj['id'] = objs[i].procUsers[k];
													}else if(k == 'picture'){
														userObj['picture'] = objs[i].procUsers[k];
													}
												}*/
												//console.info('------------userObj-----------------');
												//console.info(userObj);
												users.push(userObj);
												//console.info(users);
											}
										}
										_this.procUserModel['users'] = users;
										objs[i]['procUserModel'] = _this.procUserModel;
										objs[i]['show'] = true;
									}else{
										//var procUserModel = new Object();
										// _this.procUserModel['visible'] = false;
										// _this.procUserModel['single'] = false;
										objs[i]['show'] = false;
									}
									activitesArr.push(objs[i]);
									//console.info(objs[i]);
									_this.ifSelUser = objs[0].ifSelUser;
								}
							}
						}
						_this.activities = activitesArr;
						_this.currentActName = res.data.currentActName;
						_this.copyUserModel.users = res.data.copyUsers;
						_this.processModel.procDefName = res.data.procDefName;
						_this.sqlTableName = res.data.sqlTableName;
						_this.mainFormData = res.data.mainFormDataMap;
						//_this.ifSelCopy = res.data.ifSelCopy;
						_this.ifBackPre = res.data.ifBackPre;
						_this.currentActId = res.data.currentActId;
						//意见是否必填
						_this.ifComment = res.data.ifComment;
						//_this.loadMonitor();
						_this.setCheckedVal();
						//情况意见输入框
						_this.voiceRecognition.content = '';
						//是否必须选择抄送人
						_this.ifCopyNull = res.data.ifCopyNull;
						//是否显示当前流程节点
						_this.ifShowCurrentActName = true;
						//是否可以抄送
						_this.ifCopy = res.data.ifCopy;
						console.info('==================procUserModel================');
						console.info(_this.procUserModel)
					}else{
						_this.ifBackPre = false;
						_this.ifsubmit = false;
						_this.isWorkflow = false;
						_this.ifSelUser = false;
						_this.ifShowCopy = false;
						_this.ifSelCopy = false;
						_this.ifCopy = false;
					}
					_this.loadMonitor();
				}else{
					_this.ifBackPre = false;
					_this.ifsubmit = false;
					_this.isWorkflow = false;
					_this.ifSelUser = false;
					_this.ifShowCopy = false;
					_this.ifSelCopy = false;
					_this.ifCopy = false;
				}
				_this.util.unmask();
			});
			//}
		},setCheckedVal(){

			var _this = this;
			if(this.activities != null && this.activities.length>0){
				var item = this.activities[0];
				var node = document.getElementById(item.id);
				//console.info("=============="+node);
				if(node == undefined || node == null){
					if (_this.timer == null) {
						  _this.timer = setInterval(this.setCheckedVal, 200);
					}
					return;
				}else{
					clearInterval(_this.timer);
        			_this.timer = null;
				}
			}else{
				return;
			}
			

			//console.info('===========================setCheckedVal=============================');
			
			if(_this.activities && _this.activities.length>0){
				
				var selectType = _this.activities[0]['selectType'];
				if(_this.activities.length == 1){
					for(var i=0;i<_this.activities.length;i++){
						var id = _this.activities[i]['id'];
						$('#'+id).prop('disabled','disabled');
						$('#'+id).prop('checked','checked');
					}
				}else{
					if(selectType == 'disabled'){
						for(var i=0;i<_this.activities.length;i++){
							var id = _this.activities[i]['id'];
							$('#'+id).prop('disabled','disabled');
							$('#'+id).prop('checked','checked');
						}
					}else if(selectType == 'checkbox'){
						for(var i=0;i<_this.activities.length;i++){
							var id = _this.activities[i]['id'];
							$('#'+id).prop('checked','checked');
						}
					}
				}
			}
		},
		cancle() {

		}, checkValid() {
			//if (!this.util.isNotEmpty(this.departModel.departName)) {
				//this.util.failueToast("请选择部门！");
				//return false;
			//}
			// for (var i = 0; i < this.children.length; i++) {
			// 	var item = this.children[i];
			// 	if (!this.validUtil.isNotEmpty(item.SUBJECT_)) {
			// 		this.util.failueToast("明细" + (i + 1) + "的名称不能为空！");
			// 		return false;
			// 	}
			// 	if (!this.validUtil.isNotEmpty(item.AMOUNT_)) {
			// 		this.util.failueToast("明细" + (i + 1) + "的数量不能为空！");
			// 		return false;
			// 	}
			// }
			return true;
		}, getData(type) {
			var params = {
				businessKey: this.businessKey,
				//copyUsersStr: JSON.stringify(copyUsersStr),
				activityData: JSON.stringify(this.activitiesData),
				//condition: condition,
				procDefId: this.processModel.procDefId,
                taskId: this.processModel.taskId,
                currentActId: this.processModel.currentActId,
				procInsId: this.processModel.procInsId,
				procDefName: this.processModel.procDefName,
				//sqlTableName: this.sqlTableName,
				mainFormData: JSON.stringify(this.mainFormData),
				currentUserId: this.sessionUtil.getUserId(),
				company_id: this.sessionUtil.getCompanyId()
			};
			var condition = '';
			if(type==0){
				if(this.pageType == 'unApproval' || this.pageType == 'apply'){
					if(this.activities && this.activities.length>0){
						for(var i=0;i<this.activities.length;i++){
							// var selectType = this.activities.length[i]['selectType'];
							var id = this.activities[i]['id'];
							// console.info($('#'+id)[0]['checked']);
							// console.info('=======================condition=========================');
							// console.info($('#'+id).prop('checked'));
							if($('#'+id).prop('checked')){
								condition += ',' + this.activities[i]['condition'];
							}
						}
						if(condition){
							condition = condition.substring(1);
						}
					}
					params['condition'] = condition;
					var copyUsersStr = new Array();
					if(this.copyUserModel.users && this.copyUserModel.users.length>0){
						for(var i=0;i<this.copyUserModel.users.length;i++){
							//console.info('=======================copyUserModel=======================')
							//console.info(this.copyUserModel.users[i]);
							var obj = new Object();
							obj['userId'] = this.copyUserModel.users[i]['userId'];
							obj['userName'] = this.copyUserModel.users[i]['userName'];
							copyUsersStr.push(obj);
						}
					}
					params['copyUsersStr'] = JSON.stringify(copyUsersStr);
					if(this.pageType == 'apply'){
						params['procInsId'] = '';
					}
					//console.info(this.activities);
					if(this.activities && this.activities.length > 0 && this.activities[0]['selectType'] && this.activities[0]['selectType']=='radio'){
						var dataObj = new Object();
						for(var j=0;j<this.activities.length;j++){
							var id = this.activities[j]['id'];
							// var taskType = this.activities[j].taskType;
							// var ifDynamic = this.activities[j].ifDynamic;
							//console.info($('#'+id)[0]['checked']);
							//console.info($('#'+id).prop('checked'));
							if($('#'+id).prop('checked')){
								//console.info('============checked================');
								if(this.activitiesData && this.activitiesData.length>0){
									for(var i=0;i<this.activitiesData.length;i++){
										//console.info(this.activitiesData[i]['id'] == id);
										if(this.activitiesData[i]['id'] == id){
											var obj = this.activitiesData[i]
											//console.info(this.activitiesData[i]);
											this.activitiesData = new Array();
											this.activitiesData.push(obj);
											//return false;
										}
									}
								}
							}
						}
						params['activityData'] = JSON.stringify(this.activitiesData);
					}else{
						params['activityData'] = JSON.stringify(this.activitiesData);
					}
				}else if(this.pageType == 'unRead'){
					params['id'] = this.businessKey;
					params['subId_'] = this.businessKey;
					params['taskType'] = 1;
				}
				// else if(this.pageType == 'apply'){
				// 	params['procInsId'] = '';
				// }
			}
			return params;
		}, updateStatus() {
			// this.attachmentModel.isReadOnly = this.isReadOnly;
			// this.voiceRecognition.isReadOnly = this.isReadOnly;

		}, handler(index) {

		}, hide(activity) {
			activity.show = false;
			//console.info(activity.show);
		}, show(activity,index) {
			// for (var i in this.activities) {
			// 	this.activities[i].show = false;
			// }

			activity.show = true;
			//console.info(index);
			this.selectIndex = index;
			//展开的节点中放入 procModelUser对象
			// this.procUserModel['visible'] = false;
			// this.procUserModel['single'] = false;
			//procUserModel['users'] = [];
			//var users = new Array();
			this.addProcModelUsers(index);
			//隐藏其他的节点
			if(this.activities && this.activities.length>0){
				for(var i=0;i<this.activities.length;i++){
					var id = this.activities[i]['id'];
					if(i == index){
						this.activities[i].show = true;
						//console.info($('#'+id));
						//console.info(this.activities[i]['selectType']=='radio');
						if(this.activities[i]['selectType']=='radio'){
							$('#'+id).prop('checked', 'checked');
						}
					}else{
						this.activities[i].show = false;
						if(this.activities[i]['selectType']=='radio'){
							$('#'+id).prop('checked', false);
						}
					}
				}
			}
			//console.info('================activity==================');
			//console.info(activity);
		},addProcModelUsers(index){
			this.procUserModel['visible'] = false;
			this.procUserModel['single'] = false;
			//procUserModel['users'] = [];
			//console.info('================procUserModel.users==================');
			// console.info(typeof this.activities[index].procUserModel == undefined);
			//console.info(this.activitiesData);
			var id = this.activities[index]['id'];
			if(this.activities[index].procUserModel){
				if(this.activitiesData && this.activitiesData.length>0){
					for(var i=0;i<this.activitiesData.length;i++){
						if(this.activitiesData[i]['id'] == id){
							//console.info(this.activitiesData[i]['procUsersData']);
							var procUsersData = JSON.parse(this.activitiesData[i]['procUsersData']);
							//var procUsersData = this.activitiesData[i]['procUsersData'];
							var userArr = new Array();
							for(var j=0;j<procUsersData.length;j++){
								var obj = new Object();
								obj['userName'] = procUsersData[j]['procUserName'];
								obj['userId'] = procUsersData[j]['procUserId'];
								obj['id'] = procUsersData[j]['id'];
								obj['mobileNo'] = procUsersData[j]['mobileNo'];
								obj['picture'] = procUsersData[j]['picture'];
								userArr.push(obj);
							}
							this.procUserModel['users'] = userArr;
							return false;
						}
					}
				}
				this.procUserModel['users'] = [];
			}else{
				var users = new Array();
				//console.info('==================user2222==================');
				if(this.activities[index].procUsers && this.activities[index].procUsers.length>0){
					//console.info('==================user333==================');
					//如果存在默认选择人则放入activitesData中
					var datasObj = new Object();
					datasObj['id'] = this.activities[index]['id'];
					datasObj['ifDynamic'] = this.activities[index]['ifDynamic'];
					datasObj['taskType'] = this.activities[index]['taskType'];
					datasObj['procUsersData'] = JSON.stringify(this.activities[index].procUsers);
					this.activitiesData.push(datasObj);
					
					//将procUserId转换为userId,procUserName转换为userName
					for(var j=0;j<this.activities[index].procUsers.length;j++){
						var userObj = new Object();
						console.info(this.activities[index].procUsers);
						//for(var k in this.activities[index].procUsers){
							userObj['userId'] = this.activities[index].procUsers[j]['procUserId'];
							userObj['id'] = this.activities[index].procUsers[j]['id'];
							userObj['mobileNo'] = this.activities[index].procUsers[j]['mobileNo'];
							userObj['picture'] = this.activities[index].procUsers[j]['picture'];
							userObj['userName'] = this.activities[index].procUsers[j]['procUserName'];
							// if(k == 'procUserId'){
							// 	//objs[i].procUsers['userId'] = objs[i].procUsers[k];
							// 	userObj['userId'] = this.activities[index].procUsers[k];
							// }else if(k == 'procUserName'){
							// 	//objs[i].procUsers['userName'] = objs[i].procUsers[k];
							// 	userObj['userName'] = this.activities[index].procUsers[k];
							// }else if(k == 'id'){
							// 	userObj['id'] = this.activities[index].procUsers[k];
							// }else if(k == 'picture'){
							// 	userObj['picture'] = this.activities[index].procUsers[k];
							// }
						//}
						users.push(userObj);
					}
				}
				this.procUserModel['users'] = users;
				console.info(this.procUserModel['users']);
			}
			this.activities[index]['procUserModel'] = this.procUserModel;
			this.activities[index]['show'] = true;
		},addProcUser(index) {
			var _this = this;
			_this.addProcModelUsers(index);
			this.procUserModel.visible = true;
			var userUidArr = [];

			// console.log('====================procUserModel======================');
			// console.log(this.procUserModel.users);
			if(this.procUserModel.users && this.procUserModel.users.length>0){
				for(var i=0;i<this.procUserModel.users.length;i++){
					userUidArr.push(this.procUserModel.users[i]['id']);
				}
			}
			// if (this.util.isNotEmpty(this.procUserModel.userUid)) {
			// 	userUidArr = this.procUserModel.userUid.split(",");
			// }
			//console.log(this);
			//console.info(userUidArr);
			var obj = { singer: false, radioCheckedArr: userUidArr }
			this.$refs.procUserSel.postMsg(obj)

		},
		delProcUser() {
			//console.info("----delProcUser---");
			this.showProcUserDelete = !this.showProcUserDelete;
		},removeProcUser(user,data,index){
			//var arr = this.procUserModel.users;
			var id = this.activities[index]['id'];
			//console.log(arr);
			//console.log(this.activities[0].activity.procUsers);
			this.procUserModel.users = this.procUserModel.users.filter((item) => {
				return item != user;
			});
			var userUidArr = new Array();
			for (var i = 0; i < this.procUserModel.users.length; i++) {
				userUidArr.push(this.procUserModel.users[i].id);
			}
			//console.info(this.procUserModel.users);
			
			this.procUserModel.userUid = userUidArr.join(",");
			//更新activitiesData中的处理人
			if(this.activitiesData && this.activitiesData.length>0){
				//console.info('================dddddd=================');
				for(var i=0;i<this.activitiesData.length;i++){
					if(this.activitiesData[i].id == id){
						//console.info('========================removeProcUser=========================');
						var id = this.activitiesData[i]['id'];
						var taskType = this.activitiesData[i]['taskType'];
						var ifDynamic = this.activitiesData[i]['ifDynamic'];
						//delete this.activitiesData[i];
						if(this.procUserModel.users && this.procUserModel.users.length>0){
							var activitiesObj = new Object();
							var procUsersData = new Array();
							for(var j=0;j<this.procUserModel.users.length;j++){
								var userObj = new Object();
								userObj['procUserId'] = this.procUserModel.users[j]['userId'];
								userObj['procUserName'] = this.procUserModel.users[j]['userName'];
								userObj['id'] = this.procUserModel.users[j]['id'];
								userObj['mobileNo'] = this.procUserModel.users[j]['mobileNo'];
								userObj['picture'] = this.procUserModel.users[j]['picture'];
								procUsersData.push(userObj);
							}
							activitiesObj['id'] = id;
							activitiesObj['taskType'] = taskType;
							activitiesObj['ifDynamic'] = ifDynamic;
							activitiesObj['procUsersData'] = JSON.stringify(procUsersData);
							this.activitiesData.splice(i,1,activitiesObj);
							//this.activitiesData.push(activitiesObj);
						}
						return false;
					}
				}
			}
		}, removeCopyUser(user) {
			this.copyUserModel.users = this.copyUserModel.users.filter((item) => {
				return item != user;
			});
			var userUidArr = new Array();
			for (var i = 0; i < this.copyUserModel.users.length; i++) {
				userUidArr.push(this.copyUserModel.users[i].id);
			}
			//console.info(userUidArr);
			this.copyUserModel.userUid = userUidArr.join(",");


		}, addCopyUser() {
			var _this = this;
			this.copyUserModel.visible = true;
			var userUidArr = [];
			console.info('=======================选择抄送人=======================');
			console.info(this.copyUserModel.userUid);

			if (this.util.isNotEmpty(this.copyUserModel.userUid)) {
				userUidArr = this.copyUserModel.userUid.split(",");
			}

			var obj = { singer: false, radioCheckedArr: userUidArr }
			this.$refs.copyUserSel.postMsg(obj)

		},
		delCopyUser() {
			//console.info("----delCopyUser---");
			this.showCopyUserDelete = !this.showCopyUserDelete;
		},handelUsers(data){
			console.info('====================handelUsers====================');
			console.log(data);
			this.activities[this.selectIndex].procUserModel.users = data;
			//获取当前选择的节点的id
			//var selectedId = this.activities[this.selectIndex].id;
			var dataObj = new Object();
			var userArrs = new Array();
			if(data && data.length>0){
				for(var i=0;i<data.length;i++){
					var obj = new Object();
					obj['procUserId'] = data[i]['userId'];
					obj['procUserName'] = data[i]['userName'];
					obj['id'] = data[i]['id'];
					obj['mobileNo'] = data[i]['mobileNo'];
					obj['picture'] = data[i]['picture'];
					// for(var key in data[i]){
					// 	if(key == 'userId'){
					// 		//console.info('================userId================');
					// 		//console.info(data[i][key]);
					// 		obj['procUserId'] = data[i][key];
					// 	}else if(key == 'userName'){
					// 		//console.info('================userName================');
					// 		//console.info(data[i][key]);
					// 		obj['procUserName'] = data[i][key];
					// 	}else if(key == 'id'){
					// 		obj['id'] = data[i][key];
					// 	}
					// }
					userArrs.push(obj);
				}
			}
			//console.info(userArrs);
			dataObj['id'] = this.activities[this.selectIndex].id;
			dataObj['procUsersData'] = JSON.stringify(userArrs);
			dataObj['taskType'] = this.activities[this.selectIndex].taskType;
			dataObj['ifDynamic'] = this.activities[this.selectIndex].ifDynamic;
			//删除数组activitiesData中当前节点的数据后重新赋值
			var indexArr = null;
			if(this.activitiesData && this.activitiesData.length>0){
				//console.info('====再次增加人====');
				for(var j=0;j<this.activitiesData.length;j++){
					if(this.activitiesData[j]['id']==this.activities[this.selectIndex].id){
						//console.info('===============找到相同的id================');
						indexArr = j;
						//return false;
					}
				}
				//console.info(indexArr);
				if(indexArr == null){
					this.activitiesData.push(dataObj);
				}else{
					//console.info('删除替换数组中元素');
					//delete this.activitiesData[index];
					this.activitiesData.splice(indexArr, 1, dataObj);
					//console.info(this.activitiesData);
				}
				//this.activitiesData.push(dataObj);
			}else{
				this.activitiesData.push(dataObj);
			}
			console.info(this.activitiesData);
		},checkNodeName(id){
			if(this.activitiesData && this.activitiesData.length>0){
				for(var i=0;i<this.activitiesData.length;i++){
					if(this.activitiesData[i]['id']==id){
						return true;
					}
				}
				return false;
			}
		},submit(type){
			var _this = this;
			var params = this.getData(type);
			//this.util.alert(type);
			//console.log(this.activitiesData);
			//params['operateType'] = type;
			params['comment'] = this.voiceRecognition.content;
			params['submitId'] = this.businessKey;
			params['currentUserName'] = this.sessionUtil.getUserName();
			if(type==6){
				if(_this.ifComment){
					if (!this.util.isNotEmpty(this.voiceRecognition.content)) {
						this.util.failueToast("请填写审批意见！");
						return false;
					}
				}
				//不同意，即回退上一环节
				params['operateType'] = 6;
			}else if(type==0){
				if(_this.ifComment){
					if (!this.util.isNotEmpty(this.voiceRecognition.content)) {
						this.util.failueToast("请填写审批意见！");
						return false;
					}
				}
				if(_this.pageType=='unApproval' || _this.pageType == 'apply'){
					if(this.activities && this.activities.length>0 && this.activities[0]['taskType'] != 'endEvent'){
						if(this.activitiesData == null || this.activitiesData.length == 0){
							this.util.failueToast("请选择处理人！");
							return false;
						}else{
							if(this.activities != null && this.activities.length>0){
								var selectType = this.activities[0]['selectType'];
								if(selectType == 'radio'){
									
								}else{
									for(var j=0;j<this.activities.length;j++){
										//if(this.activities[j]['taskType'] != 'endEvent'){
										var flag = this.checkNodeName(this.activities[j]['id']);
										if(!flag){
											this.util.failueToast(this.activities[j]['transition']+"节点请选择处理人！");
											return false;
										}
										//}
									}
								}
							}
						}
						if(this.ifCopyNull){
							//判断是否必须选择抄送人
							if(this.copyUserModel.users == null || this.copyUserModel.users.length==0){
								this.util.failueToast("请选择抄送人！");
								return false;
							}
						}
					}
					//提交下一步
					params['operateType'] = 0;
					params['sqlTableName']= _this.sqlTableName;
				}
			}else if(type==14){
				//撤销
				params['operateType'] = 14;
				params['id'] = _this.businessKey;
				params['sqlTableName']= _this.sqlTableName;
			}else if(type==13){
				//催办
				params['operateType'] = 13;
			}else if(type==10){
				//如果是取消则返回上一个页面
				history.back();
			}
			console.info('============================submit============================');
			console.info(params);
			_this.util.mask("正在加载...");
			this.platform.post('/open/workflowAction!runWorkflow.action', params, function (res) {
				console.info(res);
				if(res != undefined && res.status == 200){
					if(type == 0 || type == 6){
						//if(type == 0){
							_this.ifsubmit = false;
							_this.ifBackPre = false;
							_this.isApply = false;
						//}
						history.back();
					}else if(type == 14){
						var param = {
							procDefId: _this.processModel.procDefId,
							businessKey: _this.businessKey,
							userId: _this.sessionUtil.getUserId(),
							company_id: _this.sessionUtil.getCompanyId(),
							userName: _this.sessionUtil.getUserName(),
							sqlTableName : _this.sqlTableName
						};
						_this._findNextStep(param);
					}else if(type == 13){

					}
				}
				_this.util.unmask();
			});
		},_findNextStep(param){
			var _this = this;
			console.info('=========================_findNextStep===========================');
			console.info(param);
			this.platform.post('/open/workflowAction!getProcessFormData.action', param, function (res) {
				console.info(res);
				if(res != undefined && res.status == 200){
					var activitesArr = new Array();
					var objs = res.data.activities;
					if(objs && objs.length>0){
						for(var i=0;i<objs.length;i++){
							if(i==0){
								_this.procUserModel['visible'] = false;
								_this.procUserModel['single'] = false;
								var users = new Array();
								if(objs[i].procUsers && objs[i].procUsers.length>0){
									//如果存在默认选择人则放入activitesData中
									var datasObj = new Object();
									datasObj['id'] = objs[i]['id'];
									datasObj['ifDynamic'] = objs[i]['ifDynamic'];
									datasObj['taskType'] = objs[i]['taskType'];
									datasObj['procUsersData'] = objs[i].procUsers;
									_this.activitiesData.push(datasObj);
									//将procUserId转换为userId,procUserName转换为userName
									for(var j=0;j<objs[i].procUsers.length;j++){
										for(var k in objs[i].procUsers){
											var userObj = new Object();
											if(k == 'procUserId'){
												//objs[i].procUsers['userId'] = objs[i].procUsers[k];
												userObj['userId'] = objs[i].procUsers[k];
											}else if(k == 'procUserName'){
												//objs[i].procUsers['userName'] = objs[i].procUsers[k];
												userObj['userName'] = objs[i].procUsers[k];
											}else if(k == 'id'){
												userObj['id'] = objs[i].procUsers[k];
											}else if(k == 'picture'){
												userObj['picture'] = objs[i].procUsers[k];
											}
										}
									}
								}
								_this.procUserModel['users'] = users;
								objs[i]['procUserModel'] = _this.procUserModel;
								objs[i]['show'] = true;
							}else{
								//var procUserModel = new Object();
								// _this.procUserModel['visible'] = false;
								// _this.procUserModel['single'] = false;
								objs[i]['show'] = false;
							}
							activitesArr.push(objs[i]);
							//console.info(objs[i]);
							_this.ifSelUser = objs[i].ifSelUser;
						}
					}
					_this.activities = activitesArr;
					//console.log(_this.activities);
					//_this.activities = res.data.activities;
					_this.currentActName = res.data.currentActName;
					_this.copyUserModel.users = res.data.copyUsers;
					_this.processModel.procDefName = res.data.procDefName;
					_this.sqlTableName = res.data.sqlTableName;
					_this.mainFormData = res.data.mainFormDataMap;
					//_this.ifSelCopy = res.data.ifSelCopy;
					_this.ifBackPre = res.data.ifBackPre;
					_this.currentActId = res.data.currentActId;
					_this.isWorkflow = true;
					_this.isVoice = true;
					_this.ifsubmit = true;
					_this.isApply = false;
					_this.loadMonitor();
					_this.setCheckedVal();
					//情况意见输入框
					_this.voiceRecognition.content = '';
					//是否必须选择抄送人
					_this.ifCopyNull = res.data.ifCopyNull;
					//是否显示当前流程节点
					_this.ifShowCurrentActName = true;
				}
				_this.util.unmask();
			});
		},showFormData(){
			//var _this = this;
			var status = '';
			if(this.assignee == null || this.assignee == ''){
				status = 'claim';
			}else{
				status = 'toDo';
			}
			this.$router.push({ path: '/workflow/formDetailData', 
				query: { 
					procInsId: this.processModel.procInsId, 
					procDefId: this.processModel.procDefId, 
					taskId: this.processModel.taskId, 
					taskType: this.taskType, 
					currentActId: this.currentActId, 
					status: status,
					businessKey: this.businessKey,
					pageType: this.pageType
				} 
			});
		},lookWorkflowPng(){
			this.$router.push({
				path: '/workflow/processPng',
				query: {
					procInsId: this.processModel.procInsId, 
					procDefId: this.processModel.procDefId
				}
			});
		},getInitData(){
			var _this = this;
			_this.util.mask('正在加载...');
			this.platform.post('/open/workflowAction!getInitData.action', {procDefId: this.processModel.procDefId,procInsId: this.processModel.procInsId}, function (res) {
				console.info(res);
				if(res != undefined && res.status == 200){
					_this.sqlTableName = res.data['sqlTableName'];
					_this.businessKey = res.data['businessKey'];
					//_this.processModel.procInsId = '';
				}
				_this.util.unmask();
			});
		},getQueryString(name){
			var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
			if (reg.test(location.href))
				return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
			return "";
		},setFormDetailUrl(pageType){
			var status = '';
			if(this.assignee == null || this.assignee == ''){
				status = 'claim';
			}else{
				status = 'toDo';
			}
			var detailDataUrl = '';
			if(pageType == 'unApproval'){
				detailDataUrl = this.platform.getBaseUrl()
									+'/open/workflowAction!openWorkflow.action?userId='+this.sessionUtil.getUserId()
									+'&procDefId='+this.processModel.procDefId 
									+'&procInsId='+this.processModel.procInsId
									+'&taskId='+this.processModel.taskId
									+'&currentActId='+this.processModel.currentActId
									+'&businessKey='+this.businessKey
					+'&status='+status+'&taskType='+this.taskType
					+'&company_id='+this.sessionUtil.getCompanyId()
					+'&access_token='+this.platform.getAccessToken()+'&if_login=1';
			}else if(pageType == 'apply'){
				detailDataUrl = this.platform.getBaseUrl()
										+'/open/workflowAction!showHistoryForm.action?userId='+this.sessionUtil.getUserId()
										+'&procDefId='+this.processModel.procDefId 
										+'&procInsId='+this.processModel.procInsId
										+'&businessKey='+this.businessKey
										+'&company_id='+this.sessionUtil.getCompanyId()
										+'&access_token='+this.platform.getAccessToken()+'&if_login=1';
			}else{
				detailDataUrl = this.platform.getBaseUrl()
									+'/open/workflowAction!showHistoryForm.action?userId='+this.sessionUtil.getUserId()
									+'&procDefId='+this.processModel.procDefId 
									+'&procInsId='+this.processModel.procInsId
									+'&taskId='+this.processModel.taskId
									+'&currentActId='+this.processModel.currentActId
									+'&businessKey='+this.businessKey
									+'&company_id='+this.sessionUtil.getCompanyId()
					+'&status='+status+'&taskType='+this.taskType
					+'&access_token='+this.platform.getAccessToken()+'&if_login=1&flag=true';
			}
			console.info(detailDataUrl);
			return detailDataUrl;
		},setBPMPngUrl(){
			this.procInsId = this.util.getUrlParam('procInsId');
            this.procDefId = this.util.getUrlParam('procDefId');
            var imgUrl = this.platform.getBaseUrl()
								+'/open/workflowAction!getProcessPng.action?userId='+this.sessionUtil.getUserId()+'&procDefId='
								+this.processModel.procDefId 
                                +'&procInsId='+this.processModel.procInsId
                                +'&company_id='+this.sessionUtil.getCompanyId()
                                +'&access_token='+this.platform.getAccessToken()+'&if_login=1&flag=true';
			console.info(imgUrl);
			return imgUrl;
		},getWorkflowData(){
			var _this = this;
			_this.util.mask('正在加载...');
			this.platform.post('/open/workflowAction!getProcessData.action', {procDefId: this.processModel.procDefId,procInsId: this.processModel.procInsId,taskId: this.processModel.taskId}, function (res) {
				console.info(res);
				if(res != undefined && res.status == 200){
					var flag = res.data.flag;
					if(!flag){
						_this.ifsubmit = false;
						_this.ifClose = false;
						_this.ifCopy = false;
					}
				}
				_this.util.unmask();
			});
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

.clearfix:after{
	content:"";
	height:0;
	line-height:0;
	display:block;
	visibility:hidden;
	clear:both
　　}
</style>
<style>
/***/


</style>
<style>

</style>
