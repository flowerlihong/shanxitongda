<template>
	<div style="   margin-bottom: 10px;">
		<div class="bill" style="text-align:left;border-top: 0px solid #ccc;">
			<div v-if="isWorkflow && !isEndEvent">
				<div class="middle" style="    background-color: rgb(238, 238, 238);line-height: 48px;">
					<div class="pop" style="background-color: #eeefef;margin-left:10px;">
						<span style="text-align:left;">处理人</span>

					</div>
				</div>
				<div class="load">
					<ul id="imgsLoad" style="margin-bottom:0px;">
						<li style="margin-top: 2px;">
							<ul>
								<li style="margin:5px 5px 5px 5px;position:relative;text-align:left;" v-for="procUser in procUserModel.users" :key="procUser.id">
									<div>
										<div>
											<img style="width:43px;height:43px;" :src="procUser.picture" alt=""></div>
										<div style="text-align:center; font-size: 10px;">
											<span>{{procUser.userName.length>3?procUser.userName.substring(0,3):procUser.userName}}</span>
										</div>
									</div>
									<i @click="removeProcUser(procUser,$event)" v-if="showProcUserDelete" class="changeDelete" style="position:absolute;top:-6px;left:-5px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
								</li>
								<li v-if="ifSelUser" style="margin:5px 0px 5px 3px;position:relative;text-align:left;">
									<div><img style="width:50px;height:50px;" @click="addProcUser()" src="../../assets/add_image.png"></div>
								</li>
								<li v-if="ifSelUser" style="margin:5px 5px 5px 5px;position:relative;text-align:left;">
									<div><img style="width:50px;height:50px;" @click="delProcUser()" src="../../assets/remove_image.png"></div>
								</li>
							</ul>
						</li>

					</ul>
				</div>
			</div>
			<div v-if="isWorkflow && ifShowCopy">
				<div class="middle" style="background-color: rgb(238, 238, 238);line-height: 48px;">
					<div class="pop" style="background-color: #eeefef;margin-left:10px;">
						<span style="text-align:left;">抄送人</span>

					</div>
				</div>
				<div class="load">
					<ul id="imgsLoad" style="margin-bottom:0px;">
						<li style="margin-top: 2px;">
							<ul>
								<li style="margin:5px 5px 5px 5px;position:relative;text-align:left;" v-for="user in copyUserModel.users" :key="user.id">
									<div>
										<div>
											<img style="width:43px;height:43px;" :src="user.picture" alt=""></div>
										<div style="text-align:center; font-size: 10px;">
											<span>{{user.userName.length>3?user.userName.substring(0,3):user.userName}}</span>
										</div>
									</div>
									<i @click="removeCopyUser(user,$event)" v-if="showCopyUserDelete" class="changeDelete" style="position:absolute;top:-6px;left:-5px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
								</li>
								<li v-if="ifSelCopy" style="margin:5px 0px 5px 3px;position:relative;text-align:left;">
									<img style="width:50px;height:50px;" @click="addCopyUser()" src="../../assets/add_image.png">
								</li>
								<li v-if="ifSelCopy" style="margin:5px 5px 5px 5px;position:relative;text-align:left;">
									<img style="width:50px;height:50px;" @click="delCopyUser()" src="../../assets/remove_image.png">
								</li>
							</ul>
						</li>

					</ul>
				</div>
			</div>
			<VoiceRecognition v-if="isWorkflow && !isReadOnly" :model="voiceRecognition"></VoiceRecognition>

			<mt-popup v-model="procUserModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
				<!---->
				<SelectUser :userModel="procUserModel" ref="procUserSel"></SelectUser>
			</mt-popup>
			<mt-popup v-model="copyUserModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
				<!---->
				<SelectUser :userModel="copyUserModel" ref="copyUserSel"></SelectUser>
			</mt-popup>

		</div>

		<ProcessMonitor v-if="isWorkflow" :model="processMonitorModel" ref="processMonitor"></ProcessMonitor>

		<div :style="ifHasBtn?'margin-top: 0px;padding-top: 10px;border: 1px solid #d6cece;border-left:0px;border-right:0px;position:fixed;bottom:0;width:100%;background-color: white;':'background-color: white;'">
			<p>
				<el-button v-if="(!isWorkflow && !isReadOnly) || (isWorkflow && !isApply && !isApproval && !ifBackFirst && !isReadOnly)" @click="sumbit(0)" style="width:48%;margin:0;height:1.3rem" type="default">取消</el-button>
				<el-button v-if="!isWorkflow && !isReadOnly" @click="sumbit(1)" style="width:48%;margin:0;height:1.3rem" type="success">保存</el-button>
				<el-button v-if="isApply || ifBackFirst" @click="sumbit(3)" style="width:48%;margin:0;height:1.3rem" type="primary">撤销</el-button>
				<el-button v-if="isWorkflow && !isApply && !isApproval  && !isReadOnly && !ifCopy" @click="sumbit(2)" style="width:48%;margin:0;height:1.3rem" type="success">{{isEndEvent?"办理完成":"提交"}}</el-button>
				<el-button v-if="isApply" @click="sumbit(4)" style="width:48%;margin:0;height:1.3rem" type="success">催办</el-button>
				<el-button v-if="isApproval" @click="sumbit(5)" style="width:48%;margin:0;height:1.3rem" type="danger">不同意</el-button>
				<el-button v-if="isApproval" @click="sumbit(6)" style="width:48%;margin:0;height:1.3rem" type="success">同意</el-button>
			</p>
		</div>

	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import SelectUser from '../common/SelectUser.vue'
import VoiceRecognition from './VoiceRecognition.vue'
import ProcessMonitor from './ProcessMonitor.vue'
export default {
	name: 'processForm',

	data() {
		return {
			voiceRecognition: {
				title: '意见说明',
				isReadOnly: false,
				placeholder: '请输入意见说明...',
				content: ''
			}, isEndEvent: false,
			value: '',
			ifShowCopy: false,
			ifSelUser: false,
			isNewFlag: true,
			isReadOnly: true,
			ifSelCopy: false,
			ifHasBtn: false,
			procDefId: '',
			procDefName: '',
			procInstId: '',
			taskId: '',
			isWorkflow: false,
			isApply: false,
			isCopy: false,
			ifBackFirst: false,
			isApproval: false,
			activitiData: [],
			taskType: null,
			showProcUserDelete: false,
			showCopyUserDelete: false,
			processMonitorModel: {
				procInstId: '',
				procDefId: '',
				currentActName: '',
				currentActId: '',

			},
			timer: null,
			operateType: null,
			procUserModel: { visible: false, single: false, users: [] },
			copyUserModel: { visible: false, single: false, users: [] },
			showDelete: false
		}
	},
	computed: {
		preViewImageList: function() {
			var arr = new Array();
			for (var i = 0; i < this.model.fileList.length; i++) {
				arr.push(this.model.fileList[i].src);
			}
			return arr;
		}
	},
	watch: {
		model: function(val, oldVal) {
			//console.info("attachment--------watch--------");
			console.log('new: %s, old: %s', val, oldVal)
		},
	}, components: {
		// 名字
		SelectUser, VoiceRecognition, ProcessMonitor
	},
	props: ['model'],
	activated() {
		this.processMonitorModel.procInstId = '';
		this.processMonitorModel.procDefId = '';
		console.info("processForm--------activated--------");
		//console.info(this.model);
		this.showDelete = false;

	},

	updated() {
		//console.info("attachment--------updated--------");
	},
	created() {
		
		
		console.info("processForm--------created--------");
		this.processMonitorModel.procInstId = '';
		this.processMonitorModel.procDefId = '';
		if (this.util.isNotEmpty(this.util.getUrlParam('procInstId'))) {
			this.procInstId = this.util.getUrlParam('procInstId');
		}
		if (this.util.isNotEmpty(this.util.getUrlParam('procDefId'))) {
			this.procDefId = this.util.getUrlParam('procDefId');
		}
		if (this.util.isNotEmpty(this.util.getUrlParam('taskId'))) {
			this.procDefId = this.util.getUrlParam('taskId');
		}
		//console.info("attachment--------created--------");
		this.showDelete = false;
		var _this = this;
		this.search = '';



	},
	methods: {
		...mapActions([
			'updateMainFormHeight'

		]),
		initProcess() {
			var _this = this;
			this.ifHasBtn = false;
			this.updateHeight();
			//console.info("------------");
			this.ifBackFirst = false;
			_this.isWorkflow = false;
			_this.isApply = false;
			_this.isApproval = false;
			_this.isEndEvent = true;
			_this.procDefId = null;
			_this.procInstId = null;
			_this.taskId = null;
			this.ifCopy = false;
			var mainData = this.model.parent.mainData;
			_this.model.parent.isReadOnly = false;
			if (mainData != null) {
				//console.info(mainData);
				mainData['company'] = this.sessionUtil.getCompanyUid(this);
				if (this.util.isNotEmpty(mainData['id'])) {
					//console.info(mainData);
					//console.info(mainData['status'] + "-----" + mainData['taskType']);
					this.util.post("/workflow/openWorkflow", mainData, function(res) {
						if (res != undefined && res.status == 200) {
							console.info(res.data);
							_this.procDefName = _this.model.parent.modelName;
							_this.procInstId = res.data['procInstId'];
							_this.procDefId = res.data['procDefId'];
							_this.taskId = res.data['taskId'];
							if (res.data.enable == 1) {
								_this.procDefId = res.data['procDefId'];
								//待办
								if (_this.util.isNotEmpty(mainData['status']) && _this.util.isNotEmpty(mainData['taskType']) && mainData['taskType'] != '1') {

									_this.model.parent.isReadOnly = !res.data['ifStartUser'];
									if (_this.model.parent.updateStatus != undefined) {
										_this.model.parent.updateStatus();
									}
									_this.isApproval = true;

									_this.findNext(mainData);
								} else if (_this.util.isNotEmpty(mainData['taskType']) && mainData['taskType'] == '1') {
									//抄送
									_this.ifShowCopy = false;
									_this.isWorkflow = true;

									_this.isEndEvent = true;
									_this.isApply = false;
									_this.isApproval = false;
									_this.isReadOnly = false;
									_this.taskType = mainData['taskType'];
									_this.isReadOnly = false;
								} else if (res.data['ifStartUser']) {
									//console.info("----------");

									_this.model.parent.isReadOnly = true;
									_this.isWorkflow = true;
									_this.procInstId = res.data['procInstId'];
									if (_this.util.isNotEmpty(res.data['taskId']) && _this.util.isNotEmpty(res.data['taskType'])) {
										_this.taskId = res.data['taskId'];
										_this.ifShowCopy = true;
										_this.isEndEvent = false;
										_this.isApply = false;
										_this.isApproval = false;
										_this.isReadOnly = false;
										_this.ifBackFirst = res.data['ifBackFirst'];
										if (_this.ifBackFirst == true || (res.data.ifFirstNode != undefined && res.data.ifFirstNode == true)) {
											_this.model.parent.isReadOnly = false;
										}
										//console.info(_this.ifBackFirst);
										mainData['taskId'] = _this.taskId;
										_this.findNext(mainData);
									} else {

										_this.isWorkflow = true;
										_this.procInstId = res.data['procInstId'];
										_this.isReadOnly = true;
										_this.isEndEvent = true;
										_this.ifShowCopy = false;
										_this.isApply = true;
										_this.isApproval = false;
									}

								}
								_this.ifHasBtn = true;
							} else {
								_this.isWorkflow = true;
								_this.isEndEvent = true;
								_this.ifBackFirst = false;
								_this.isApply = false;
								_this.isReadOnly = true;
								_this.ifShowCopy = false;
								_this.model.parent.isReadOnly = true;
								_this.ifHasBtn = false;
							}

							_this.loadMonitor();

							_this.updateHeight();
						}
					});


				} else {

					this.util.post("/workflow/findWorkflow", mainData, function(res) {
						if (res.data != undefined && res.data.length > 0) {
							_this.ifHasBtn = true;
							_this.updateHeight();
							var process = res.data[0];
							if (_this.util.isNotEmpty(process.procDefId)) {
								mainData.procDefId = process.procDefId;
								_this.procDefId = process.procDefId;
								_this.procDefName = process.procDefName;
								_this.findNext(mainDData);

								_this.loadMonitor();
							}


						} else {
							_this.isReadOnly = false;
						}
					});
				}

			}
		}, findNext(mainData) {
			var _this = this;
			this.util.post("/workflow/getNextActInfo", mainData, function(res) {
				//console.info(res);
				_this.procUserModel.users = [];
				_this.copyUserModel.users = [];
				if (res != undefined && res['status'] == 200 && res.data['activities'] != undefined) {
					//console.info( res.data);
					_this.activitiData = res.data['activities'];
					//console.info(_this.activitiData);
					var nextAct = _this.activitiData[0];
					_this.ifSelUser = nextAct.ifSelUser;
					_this.ifSelCopy = res.data['ifSelCopy'];
					_this.isWorkflow = true;
					_this.ifShowCopy = true;
					_this.isReadOnly = false;
					_this.isApply = false;
					_this.isEndEvent = false;

					if (nextAct.taskType == 'endEvent') {
						_this.isEndEvent = true;
					}
					//console.info("----------");
					var procUsers = nextAct['procUsers'];
					if (procUsers != undefined) {
						var userUidArr = new Array();
						for (var i = 0; i < procUsers.length; i++) {
							var procUser = procUsers[i];
							userUidArr.push(procUser.procUserUid);
							_this.procUserModel.users.push({ id: procUser.procUserUid, userName: procUser.procUserName, picture: procUser.picture });
						}
						_this.procUserModel.userUid = userUidArr.join(",");

					}

				}
			});
		}, loadMonitor() {
			this.processMonitorModel.procDefId = this.procDefId;
			this.processMonitorModel.procInstId = this.procInstId;
			//console.info("this.$refs.processMonitor-----------" + this.processMonitorModel);
			//console.info(this.processMonitorModel);
			if (this.$refs.processMonitor != undefined) {
				this.$refs.processMonitor.loadData();
				clearInterval(this.timer);
				this.timer = null;
			} else {
				//console.info("============"+this.timer);
				if (this.timer == null) {
					this.timer = setInterval(this.loadMonitor, 100);
				}

			}
			//this.$refs.processMonitor.loadData();
		}, updateHeight() {
			this.updateMainFormHeight(this.ifHasBtn);
			if (this.model.parent.updateHeight != undefined) {
				this.model.parent.updateHeight(this.ifHasBtn);

			}
		}, removeProcUser(user) {
			this.procUserModel.users = this.procUserModel.users.filter((item) => {
				return item != user;
			});
			var userUidArr = new Array();
			for (var i = 0; i < this.procUserModel.users.length; i++) {
				userUidArr.push(this.procUserModel.users[i].id);
			}
			//console.info(userUidArr);
			this.procUserModel.userUid = userUidArr.join(",");

		},
		uploadFile(localIds, index) {

		},
		addProcUser() {
			var _this = this;
			this.procUserModel.visible = true;
			var userUidArr = [];

			if (this.util.isNotEmpty(this.procUserModel.userUid)) {
				userUidArr = this.procUserModel.userUid.split(",");
			}
			//console.info(userUidArr);
			var obj = { singer: false, radioCheckedArr: userUidArr }
			this.$refs.procUserSel.postMsg(obj)

		},
		delProcUser() {
			//console.info("----delProcUser---");
			this.showProcUserDelete = !this.showProcUserDelete;
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


		},
		addCopyUser() {
			var _this = this;
			this.copyUserModel.visible = true;
			var userUidArr = [];

			if (this.util.isNotEmpty(this.copyUserModel.userUid)) {
				userUidArr = this.copyUserModel.userUid.split(",");
			}

			var obj = { singer: false, radioCheckedArr: userUidArr }
			this.$refs.copyUserSel.postMsg(obj)

		},
		delCopyUser() {
			//console.info("----delCopyUser---");
			this.showCopyUserDelete = !this.showCopyUserDelete;
		},
		sumbit(type) {
			if (type == 0) {
				if (this.model.parent.cancelCallback != undefined) {
					this.model.parent.cancelCallback();
				} else {
					history.back();
				}
				return;
			}
			var _this = this;
			var params = {};

			var maskStr = "正在保存...";

			params['agentId'] = this.model.parent.agentId;
			if (type == 1 || type == 2 || type == 5 || type == 6) {
				//console.info("---1----"+this.model.parent);
				if (this.model.parent != undefined) {
					if (this.model.parent.checkValid != undefined) {
						if (!this.model.parent.checkValid()) {
							return;
						}
					}
					//console.info("-------"+this.model.parent.getData);
					if (this.model.parent.getData != undefined) {
						params = this.model.parent.getData();
					}

				}
				//_this.util.successToast("----数据获取完毕-----");
				params['agentId'] = this.model.parent.agentId;
				params['procDefName'] = _this.util.isNotEmpty(this.procDefName) ? this.procDefName : this.model.parent.modelName;
				params['formKey'] = this.model.parent.formKey;
				if (this.isWorkflow) {
					params['procDefId'] = _this.procDefId;
					params['taskId'] = _this.taskId;
					params['taskType'] = _this.taskType;
					params['procInstId'] = _this.procInstId;
					params['comment'] = this.voiceRecognition.content;
					params['id'] = this.model.parent.id == undefined ? "" : this.model.parent.id;
					params['businessKey'] = params['id'];
					params['currentUserUid'] = this.sessionUtil.getUserUid(this);
					params['currentUserName'] = this.sessionUtil.getUserName(this);
					params['currentUserId'] = this.sessionUtil.getUserId(this);
					params['ifSaveWorkflow'] = true;
					if (type != 5 && !_this.isEndEvent) {
						for (var i = 0; i < _this.activitiData.length; i++) {
							var act = _this.activitiData[i];
							if (act.type != "endType") {
								if (this.procUserModel.users.length == 0) {
									this.util.failueToast("请选择处理人！");
									return false;
								}
							}
							var procUsers = new Array();
							for (var i = 0; i < this.procUserModel.users.length; i++) {
								var procUser = this.procUserModel.users[i];
								var user = new Object();
								user.procUserUid = procUser['id'];
								user.procUserName = procUser['userName'];
								user.userName = procUser['userName'];
								user.mobile = procUser['mobile'];
								user.wxId = procUser['wxId'];
								user.positionUid = procUser['positionUid'];
								//delete procUser.children;
								procUsers.push(user);
							}
							//console.info(this.procUserModel.users);
							//console.info(procUsers);
							act['procUsersData'] = JSON.stringify(procUsers);
						}
					}
					//console.info(this.activitiData);
					//console.info(this.copyUserModel.users);
					params['activityData'] = JSON.stringify(this.activitiData);
					//console.info(this.copyUserModel.users);
					var copyUsersArr = new Array();
					for (var i = 0; i < this.copyUserModel.users.length; i++) {
						var user = new Object();
						var procUser = this.copyUserModel.users[i];
						user.id = procUser['id'];
						user.userName = procUser['userName'];
						user.mobile = procUser['mobile'];
						user.wxId = procUser['wxId'];
						copyUsersArr.push(user);
					}
					//console.info(this.copyUserModel.users);
					params['copyUsersStr'] = JSON.stringify(copyUsersArr);
					//console.info("--------------");
					if (type == 5) {
						//不同意，回退
						params['mainFormData'] = null;
						params['subFormData'] = null;

						params['operateType'] = 6;

					}


				}
			} else if (type == 3) {
				//撤销
				if (this.isWorkflow) {
					if (this.model.parent.getData != undefined) {
						var data = this.model.parent.getData();
						//console.info(data);
						params['subject'] = data['subject'];
					}
					params['procDefName'] = _this.procDefName;
					params['formKey'] = this.model.parent.formKey;
					params['sqlTableName'] = this.model.parent.sqlTableName;
					params['procDefId'] = _this.procDefId;
					params['id'] = this.model.parent.id == undefined ? "" : this.model.parent.id;
					params['businessKey'] = params['id'];
					params['currentUserUid'] = this.sessionUtil.getUserUid(this);
					params['currentUserName'] = this.sessionUtil.getUserName(this);
					params['currentUserId'] = this.sessionUtil.getUserId(this);
					params['ifSaveWorkflow'] = true;
					params['operateType'] = 14;
					params['procInstId'] = _this.procInstId;
					maskStr = "正在撤销...";
				}
			} else if (type == 4) {
				//催办
				if (this.isWorkflow) {
					params['sqlTableName'] = this.model.parent.sqlTableName;
					params['procDefId'] = _this.procDefId;
					params['formKey'] = this.model.parent.formKey;
					params['id'] = this.model.parent.id == undefined ? "" : this.model.parent.id;
					params['businessKey'] = params['id'];
					params['currentUserUid'] = this.sessionUtil.getUserUid(this);
					params['currentUserName'] = this.sessionUtil.getUserName(this);
					params['currentUserId'] = this.sessionUtil.getUserId(this);
					params['ifSaveWorkflow'] = true;
					params['operateType'] = 13;
					params['procInstId'] = _this.procInstId;

					maskStr = "正在催办...";
				}
			}

			//_this.util.successToast("----所有完毕-----");
			//console.info(params);
			//return;
			if (type == 3) {
				_this.util.confirm("你确定要撤销？", function() {
					_this.util.mask(maskStr);
					_this.saveData(type, params);
				});
			} else {
				_this.util.mask(maskStr);
				_this.saveData(type, params);
			}




		}, saveData(type, params) {
			
			var _this = this;
			_this.util.post('/form/saveData', params, function(res) {
				if (res != undefined && res != null) {

					if (res.status == 200) {
						_this.util.successToast("成功");
						if (type == 4) {

						} else if (type == 3) {
							_this.procInstId = res.data['procInstId'];
							_this.taskId = res.data['taskId'];
							_this.model.parent.isReadOnly = false;
							if (_this.model.parent.updateStatus != undefined) {
								_this.model.parent.updateStatus();
							}
							_this.ifBackFirst = false;
							_this.findNext({ formKey: _this.model.parent.formKey, procDefId: _this.procDefId, taskId: _this.taskId, procInstId: _this.procInstId });

							_this.loadMonitor();
						} else {
							_this.isReadOnly = true;
							_this.ifBackFirst = false;
							_this.isWorkflow = false;
							_this.isApply = false;
							_this.isApproval = false;
							_this.isEndEvent = true;
							_this.$store.state.operate = 'save';
							if (_this.model.parent.saveDataCallback != undefined) {
								_this.model.parent.saveDataCallback();
							} else {
								history.back();
							}


						}

					} else {
						_this.util.failueToast("保存失败" + res.errorMsg);
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
//发票
.bill p span:first-child {
	color: #f00;
}

.bill p span:last-child {
	color: blue;
}

.bill p {
	padding: 0 10px;
	margin: 0;
}

.bill {
	border-top: 0px solid #eee; //padding: 10px 0 0 0;
	height: auto;
	.load {
		height: auto; //border-bottom: 1px solid #ccc;
		margin-top: 00px;
		padding: 5px 5px;
		#imgsLoad {
			height: auto;
			overflow: hidden;
			li {
				float: left;
			}
		}
	}
}
</style>
