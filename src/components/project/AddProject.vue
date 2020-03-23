<template>
	<div class="page">
		<div style="text-align: left;margin-top: 0px;">
			<div class="weui-cell myCell">
				<div class="weui-cell__hd">
					<span>项目名称
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd">
					<input v-model="project.proName" style="text-align: right;" type="text" placeholder="请输入项目名称" />
				</div>
			</div>
			<div class="weui-cell myCell">
				<div class="weui-cell__hd">
					<span>项目编号</span>
				</div>
				<div class="weui-cell__bd">
					<input v-model="project.proNum" style="text-align: right;" type="text" placeholder="请输入项目名称" />
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd">
					<span>施工单位</span>
				</div>
				<div class="weui-cell__bd myCell-bd" @click="editBuilderUnit()">
					<span>{{project.constructUnit}}</span>
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd">
					<span>项目负责人
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd myCell-bd" @click="editPrincipal()">
					<span>{{project.principalName}}</span>
				</div>
			</div>
			<div class="weui-cell myCell">
				<div class="weui-cell__hd">
					<span>项目造价
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd">
					<input class="weui-input" v-model="project.htje" style="text-align: right;" type="number" pattern="[0-9]*" placeholder="请输入项目造价" />
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd">
					<span>项目状态
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd myCell-bd" @click="editProStatus()">
					<span>{{project.proStatus}}</span>
				</div>
			</div>
			<div class="weui-cell myCell" style="padding:0px 10px;">
				<div class="weui-cell__hd  col-xs-3" style="padding:0;text-align:left">
					<span>开工日期
						<span style="color:red">*</span>
					</span>
				</div>
				<datetime title="" class="col-xs-9 be-check no-line" v-model="project.startDate" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
				<!-- <div class="weui-cell__bd myCell-bd" @click="showDatePicker('startDate')">
											<span>{{project.startDate}}</span>
										</div> -->
			</div>
			<div class="weui-cell weui-cell_select myCell" style="padding:0px 10px;">
				<div class="weui-cell__hd col-xs-3" style="padding:0;text-align:left">
					<span>竣工日期
						<span class="span_required">*</span>
					</span>
				</div>
				<datetime title="" class="col-xs-9 be-check no-line" v-model="project.endDate" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
				<!-- <div class="weui-cell__bd myCell-bd" @click="showDatePicker('endDate')" >
											<span>{{project.endDate}}</span>
										</div> -->
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd">
					<span>工程标签</span>
				</div>
				<div class="weui-cell__bd myCell-bd" @click="chooseProTag()">
					<span>{{project.proTags!=undefined&&project.proTags.length>18? project.proTags.substring(0,18)+'...':project.proTags}}</span>
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd">
					<span>项目区域
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd myCell-bd" @click="editProAddress()" style="">
					<span>{{project.address.length
						<17? project.address:project.address.substring(0,17)+ '...'}}</span>
				</div>
			</div>
			<div class="weui-cell myCell">
				<div class="weui-cell__hd">
					<span>甲方</span>
				</div>
				<div class="weui-cell__bd">
					<input style="text-align: right;" v-model="project.proOwner" placeholder="请输入甲方" type="text">
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd">
					<span>项目成员
						<span style="color:red">*</span>
					</span>
				</div>
				<div class="weui-cell__bd myCell-bd" @click="editMember()" style="">
					<span>{{memberModel.userName}}</span>
				</div>
			</div>
			<div class="bill">
				<Attachment :model="attachmentModel"></Attachment>

			</div>
		</div>

		<!--选择项目状态-->
		<div>
			<div class="weui-mask" @click="hideActionSheet" id="iosMask" style="display: none"></div>
			<div class="weui-actionsheet" id="iosActionsheet">
				<div class="weui-actionsheet__title">
					<p class="weui-actionsheet__title-text">选择项目状态</p>
				</div>
				<div class="weui-actionsheet__menu">
					<div class="weui-actionsheet__cell" style="color:#00AE1C" @click="selectProjStatus(item)" v-for="(item,key) in xmStatusMenus" :key="key">{{item.value}}</div>
				</div>
				<div class="weui-actionsheet__action">
					<div class="weui-actionsheet__cell" @click="hideActionSheet">取消</div>
				</div>
			</div>
		</div>

		<mt-popup v-model="addressObj.addressVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<ChooseAddress :address="addressObj" ref="chooseAddress" @chooseAddress="chooseAddress($event)"></ChooseAddress>
		</mt-popup>
		<!--选择工程标签-->
		<mt-popup v-model="tagObj.tagsVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<ChooseProTag :tags="tagObj" @chooseTags="chooseTags($event)"></ChooseProTag>
		</mt-popup>
		<!--选择项目负责人-->
		<mt-popup v-model="userModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="userModel" ref="profile" @selectUsersCallBack="handelUsers($event)"></SelectUser>
		</mt-popup>
		<!--选择项目成员-->
		<mt-popup v-model="memberModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="memberModel" ref="memberfile"></SelectUser>
		</mt-popup>
		<!--选择施工单位-->
		<mt-popup v-model="builderModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<selectQuarters :orgModel="builderModel" ref="orgfile" @selectOrgCallBack="chooseBuilder($event)"></selectQuarters>
		</mt-popup>

		<ProcessForm :model="processModel" ref="process"></ProcessForm>
	</div>
</template>

<script>
import selectQuarters from '../common/selectQuarters.vue'
import ChooseProTag from '../project/ChooseProTag.vue'
import ChooseAddress from '../common/ChooseAddress.vue'
import SelectUser from '../common/SelectUser.vue'
import Attachment from '../common/Attachment.vue'
import ProcessForm from '../common/ProcessForm.vue'
import { Datetime } from 'vux'
import { mapState, mapActions } from 'vuex'

var picker;
export default {
	name: 'addProject',
	components: {
		SelectUser, Attachment, selectQuarters, ChooseAddress, ChooseProTag, Datetime, ProcessForm
	},
	data() {
		return {
			addressObj: {
				addressVisible: false
			},
			builderObj: {
				builderUnitVisible: false
			},
			tagObj: {
				tagsVisible: false
			},
			processModel: {
				isReadOnly: false,
				ifHashWorkflow: true,
				parent: null,
				id: '',
				sqlTableName: this.sqlTableName,
				formId: this.formId,
				procDefId: '',
				procInstId: ''
			},
			sqlTableName: 'xmb',
			formId: 'DForm_G002_xmlx',
			symbol: 'XM',
			userModel: { visible: false, singer: true },
			builderModel: { visible: false },
			editAddressVisible: false,
			userType: '',
			xmStatusMenus: [], //项目状态选项
			project: {             //单个项目数据
				proName: '',
				proNum: '',
				principalName: '',    //项目负责人姓名
				principalId: '',      //项目负责人Id
				member: [],      //项目成员
				memberStr: '',
				proCost: '', proOwner: '',
				proStatus: '',   //项目状态
				constructUnit: '',  //施工单位
				proTags: '',        //工程标签
				projPic: "",
				startDate: '', endDate: '',
				province: '', city: '', county: '',
				address: '',
				location: ''
			},
			memberModel: {
				visible: false,
				userName: '',
				userUid: '',
				users: []
			},
			attachmentModel: {
				isReadOnly: false,
				title: '项目头像',
				xtype: 'avatar',
				maxNum: 1,
				fileList: [],
				deleteFilesList: []
			},
			selectPicBtn: true,
			fileList: [],
			deleteFilesList: [],
			dialogTitle: '',
			placeholderStr: '',
			delprojectLogo: false,
			xmStatusVisible: false,
			id: '',
			isReadOnly: true,
			location: ''
		}
	},
	computed: {
		...mapState({
			userUid: state => state.userUid
		}),
	},
	created() {
		var _this = this;
		this.wx.ready(function() {
			_this.locationAgain();

		});
		this.util.loadDic({ dicId: 'Dic_G002_xmztnew' }, function(data) {

			for (var i = 0; i < data.length; i++) {
				var item = { label: data[i].name, type: 'primary', value: data[i].value };
				_this.xmStatusMenus.push(item);
			}

		});

	},
	activated() {
		this.project = {
			proName: '', proNum: '', principalName: '', principalId: '',
			member: [], memberStr: '', htje: '', proOwner: '', proStatus: '',   //项目状态
			constructUnit: '', proTags: '', projPic: "", startDate: '',
			endDate: '', province: '', city: '', county: '', address: '', location: ''
		};
		this.id = this.util.getUrlParam("id");
		this.loadData();
		if (this.validUtil.isNotEmpty(this.id)) {
			document.title = "编辑项目";
		}
		this.processModel.parent = this;
	},
	methods: {
		loadData() {
			var _this = this;
			_this.memberModel.users = [];
			if (this.validUtil.isNotEmpty(this.id)) {
				this.util.mask();
				// this.util.initData({id:this.id,sqlTableName:"xmb"},function(res){
				// 	_this.util.unmask();
				// 	//console.info(res);
				// });
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Proj&appId=WeChat", { id: this.id, operateType: 'get' }, function(res) {
					_this.util.unmask();
					//console.info(res);
					if (res.status == 200) {
						_this.project = res.data;
						var memberData = res.data.memberData;
						var userIdArr = new Array();
						var userNameArr = new Array();
						if (memberData != undefined && memberData != null) {

							for (var i = 0; i < memberData.length; i++) {
								userIdArr.push(memberData[i].id);
								userNameArr.push(memberData[i].userName);
								_this.memberModel.users.push(memberData[i]);
							}
							//_this.memberModel.users = memberData;
						}
						_this.memberModel.userName = userNameArr.join(",");
						_this.memberModel.userUid = userIdArr.join(",");
						_this.project.member = [];
					} else {
						_this.util.alert(res.msg);
					}
				});
			}

		},
		locationAgain() {
			var _this = this;
			this.wx.getLocation({
				type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function(res) {
					var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					var speed = res.speed; // 速度，以米/每秒计
					var accuracy = res.accuracy; // 位置精度
					var lnglat = new AMap.LngLat(longitude, latitude);
					AMap.convertFrom(lnglat, "gps", function(status, result) {

						var latlng = result.locations[0];
						//保存坐标
						var curLat = latlng.getLat();//当前高德维度
						var curLng = latlng.getLng();//当前高德经度

						_this.location = curLng + "," + curLat;
						_this.$refs.chooseAddress.locationAgain(_this.location)
					}
					);


				}

			});
		},
		hideActionSheet() {
			$("#iosActionsheet").removeClass('weui-actionsheet_toggle');
			$('#iosMask').fadeOut(200);
		},
		showDatePicker(type) {
			var _this = this;
			weui.datePicker({
				start: new Date().getFullYear() - 10,
				end: new Date().getFullYear() + 10,
				onConfirm: function(result) {
					var timeStr = result[0] + (result[1] > 9 ? '-' + result[1] : '-0' + result[1]) + (result[2] > 9 ? '-' + result[2] : '0' + result[2]);
					_this.project[type] = timeStr;
				}
			});
		},
		editPrincipal() {
			this.userType = 'principal';
			this.userModel.visible = true;
			this.$refs.profile.postMsg({ singer: true, radioCheckedArr: [] })
		},
		handelUsers(data) {
			this.project.principalName = this.util.isNotEmpty(data[0].userName) ? data[0].userName : data[0].label;
			this.project.principalId = data[0].id;

		},
		editMember() {

			var memberIds = [];
			//console.info(this.memberModel.userUid);
			if (this.validUtil.isNotEmpty(this.memberModel.userUid)) {
				memberIds = this.memberModel.userUid.split(",");
			}
			//console.info(memberIds);
			this.$refs.memberfile.postMsg({ singer: false, radioCheckedArr: memberIds })
			this.memberModel.visible = true;
		},
		editBuilderUnit() {
			this.builderModel.visible = true;
			this.$refs.orgfile.postMsg({ singer: true, radioCheckedArr: [] })
		},
		editProStatus() {
			$('#iosActionsheet').addClass('weui-actionsheet_toggle');
			$('#iosMask').fadeIn(200);
		},
		selectProjStatus(item) {
			this.project.proStatus = item.value;
			this.hideActionSheet();
		},
		chooseProTag() {
			this.tagObj.tagsVisible = true;
		},
		editProAddress() {
			if (this.util.isNotEmpty(this.project.address)) {
				this.$refs.chooseAddress.locationAgain(this.project.location);
			} else {
				this.$refs.chooseAddress.locationAgain(this.location);
			}
			this.addressObj.addressVisible = true;
		},
		chooseBuilder(data) {
			this.project.constructUnit = data[0].label;
		},
		chooseTags(data) {
			this.project.proTags = data.proTags;
		},
		chooseAddress(data) {
			var location = data.addressLocation;
			this.project.location = location;
			this.project.address = data.address;
			this.project.province = data.province;
			this.project.city = data.city;
			this.project.county = data.county;

		},

		close() {
			history.back();
		}, checkValid() {
			return true;
			if (this.project.proName == "" || this.project.proName == null) {
				this.util.alert('项目名称不能为空！', '提示');
				return false;
			}
			if (this.project.principalId == "" || this.project.principalId == undefined) {
				this.util.alert('请选择项目负责人！');
				return false;
			}
			if (this.project.proCost == "" || this.project.proCost == null) {
				this.util.alert('项目造价不能为空！', '提示');
				return false;
			}
			if (this.project.proStatus == "" || this.project.proStatus == null) {
				this.util.alert('请选择项目状态！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.project.location)) {
				this.util.alert('请选择项目区域！');
				return false;
			}
			if (this.project.startDate == "" || this.project.startDate == null) {
				this.util.alert('请选择开工日期！');
				return false;
			}
			if (this.project.endDate == "" || this.project.endDate == null) {
				this.util.alert('请选择竣工日期！');
				return false;
			}
			if (this.validUtil.compareDateTime(this.project.startDate, this.project.endDate)) {
				this.util.alert('竣工日期必须大于开工日期！');
				return false;
			}
			if (!this.validUtil.isNotEmpty(this.memberModel.userUid)) {
				this.util.alert('请选择项目成员！');
				return false;
			}
			if (isNaN(this.project.proCost)) {
				this.util.alert('项目造价请输入数字！');
				return false;
			}
			return true;
		}, getMainFormData() {
			var mainData = {
				Subject: this.project.proName, XMMC_: this.project.proName, XMBH_: this.project.proNum, htje: this.project.htje, STATUS_: this.project.proStatus,
				sgdw: this.project.constructUnit,
				START_DATE_: this.project.startDate, END_DATE_: this.project.endDate, payeename: this.project.proOwner, xmfzr: this.project.principalName,
				PRINCIPAL_ID_: this.project.principalId, province: this.project.province, xmlx: this.project.proTags,
				city: this.project.city, address: this.project.county, xmdd: this.project.address, ADDR_LOCATION_: this.project.location
			};
			return mainData;
		},getSubFormData(){
			var subForm = { subFormId: 'subForm1', subFormForeignKey: 'ResourceUid', subFormTable: 'ORG_User_Resources', primaryKeyType: 'auto' };
			
			var subFormArr = new Array();
			for (let i = 0, len = this.memberModel.users.length; i < len; i++) {
				var item = {
					userId: this.memberModel.users[i].userId,
					userName: this.memberModel.users[i].userName,
					userUid: this.memberModel.users[i].id,
					type: 'xmsq'
				}
				subFormArr.push(item);
			}
			//console.info("--------333------");
			//console.info(subFormArr);
			subForm['data'] = JSON.stringify(subFormArr);
			var subFormData = new Array();
			subFormData.push(subForm);
			return subFormData;
		},getFileData(){
			var filesData = new Array();
			for (var i in this.attachmentModel.fileList) {
				var file = this.attachmentModel.fileList[i];
				if (file.isNewFlag) {
					filesData.push(file);
				}
			}
			return filesData;
		}, getData() {

			var _this = this;
			var mainData = this.getMainFormData();
			var subFormData = this.getSubFormData();
			var filesData = this.getFileData();
			var params = { sqlTableName: this.sqlTableName, mainFormData: JSON.stringify(mainData), subFormData: JSON.stringify(subFormData), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
			if (!this.isNewFlag) {
				params['id'] = this.id;
				params['businessKey'] = this.id;
			}
			params['subject'] = this.project.proName;
			params['symbol'] = this.symbol;
			params['formId'] = this.formId;
			return params;
		}

	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.myCell {
	padding-left: 10px;
	height: 48px;
	text-align: right;
}

.myCell-bd {
	height: 100%;
	padding-right: 22px;
	padding-top: 12px;
}

.weui-cell_select .weui-cell__bd:after {

	right: 12px;
}

.bill {
	border-top: 1px solid #eee;
	padding: 10px 0 0 0;
	height: 100%;
	.load {
		height: 100%;
		border-bottom: 1px solid #ccc;
		margin-top: 30px;
		padding: 5px 15px;
		#imgsLoad {
			height: 2rem;
			li {
				float: left;
			}
		}
	}
}

.footer {
	height: 2.2rem;
	padding-top: 3px;
	background: #eee;
	line-height: 42px;
}
</style>

<style>
.no-line.weui-cell:before {
	border: 0 none;
}
</style>