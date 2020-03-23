<template>
	<div class="movebx" v-loading="loading" element-loading-text="拼命加载中">
	
		<div class="price" style="text-align:left;">
			<span class="col-xs-3">标题</span>
			<input :readonly="category == '1'" v-model="name" class="col-xs-9" type="text">
		</div>
	
		<div class="price" style="text-align:left;background-color: #eeefef;">
			<span class="col-xs-3">详情描述</span>
			<span class="col-xs-9" style="text-align:right;">
			</span>
	
		</div>
		<div id="price" style="text-align:left;">
			<x-textarea :readonly="isReadOnly" :max="500" v-model="description" placeholder="请输入详情描述" ref="description" style="    width: 100%;"></x-textarea>
		</div>
	
		<template v-for="(child,index) in children">
			<div @click="show(child)" v-if="(child.show == undefined || !child.show) && index != 0" :key="index" class="middle" style="border-bottom: 1px solid #ccc;">
				<div class="pop" style="background-color: #eeefef;">
					<span class="col-xs-3" style="text-align:left;">{{index==0?'填单':(util.isNotEmpty(child.nodeName)?child.nodeName:'审批节点'+index)}}</span>
					<div class="daright col-xs-9">
						<span>{{(child.procUser.name!=undefined && child.procUser.name.length>18)?(child.procUser.name.substring(0,18)+'...'):child.procUser.name}}</span>
	
						<i v-if="index !=0" class="glyphicon glyphicon-chevron-down"></i>
					</div>
				</div>
			</div>
			<div v-if="child.show || index == 0" :key="index" class="middle" :style="index == 0?'border-bottom: 1px solid #ccc;':''">
				<div class="pop" style="background-color: #eeefef;">
					<span class="col-xs-4">{{index==0?'填单':(util.isNotEmpty(child.nodeName)?child.nodeName:'审批节点'+index)}}:</span>
					<div @click.stop="hide(child)" class="daright col-xs-8">
						<span v-if="index !=0 && !isReadOnly" style="color:#f00;" @click.stop="remove(child)">-删除</span>&nbsp;
						<span v-if="!isReadOnly" style="color:blue;margin:0 10px;" @click.stop="add(child)">+{{index ==0?'新增':'复制'}}</span>
						<i v-if="index !=0" class="glyphicon glyphicon-chevron-up"></i>
					</div>
				</div>
				<div v-if="index !=0" class="price" style="text-align:left;">
					<span class="col-xs-3">环节名称</span>
					<input :readonly="isReadOnly" v-model="child.nodeName" class="col-xs-9" type="text">
				</div>
				<div v-if="index !=0" class="price" style="text-align:left;">
					<span class="col-xs-3">节点处理人</span>
	
					<span class="col-xs-9">
						<!--<selector :options="options" v-model="value"></selector>-->
						<popup-radio style="margin-top: -10px;margin-right: -14px;" @on-change="changeProcType" :options="options" v-model="child.procUser.procUserType"></popup-radio>
						<!--<el-button   v-if="!isReadOnly" size="small"  @click="selecAssgine()" type="primary">选择</el-button>-->
					</span>
				</div>
				<div v-if="index !=0" class="price" style="text-align:left;">
					<span class="col-xs-3"></span>
					<input class="col-xs-9" readonly="true" v-model="child.procUser.name" type="text" style="margin-top: -8px;">
				</div>
				<div v-if="index !=0" class="price" style="text-align:left;">
					<span class="col-xs-5">是否可选择</span>
					<div class="col-xs-7" style="    padding-right: 0px;">
	
						<div style="width:60px;float:right;margin-left:0px;">
							<el-radio class="radio" v-model="child.ifSelUser" label='1' style="margin: 0px;">是</el-radio>
						</div>
						<div style="width:60px;float:right;">
							<el-radio class="radio" v-model="child.ifSelUser" label='0' style="margin: 0px;">否</el-radio>
						</div>
	
						</table>
					</div>
				</div>
	
			</div>
		</template>
		<div class="foot" style="padding-top:0;text-align:center;">
	
			<p v-if="!isReadOnly" @click="add" style="text-align:center;"> + 添加一条审批环节</p>
			<p class="footColor">共
				<span>{{children.length-1}}</span> 级审批</span>
			</p>
		</div>
	
		<mt-popup v-model="userModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<!---->
			<SelectUser :userModel="userModel" ref="profile" @selectUsersCallBack="handelUsers($event)"></SelectUser>
		</mt-popup>
	
		<popup-picker :show="showPositionPicker" @on-change="changePosition" :show-cell="false" :data="positionList" @on-hide="showPositionPicker=false" ref="positionPicker"></popup-picker>
	
		<popup-picker :show="showRelationPicker" @on-change="changeRelation" :show-cell="false" :data="relationList" @on-hide="showRelationPicker=false"></popup-picker>
		<div class="footer">
			<p>
				<el-button @click="sumbit(0)" style="width:48%;margin:0;height:1.3rem" type="default">取消</el-button>
				<el-button v-if="!isReadOnly" @click="sumbit(1)" style="width:48%;margin:0;height:1.3rem" type="success">保存</el-button>
				<el-button v-if="isReadOnly" @click="sumbit(0)" style="width:48%;margin:0;height:1.3rem" type="success">关闭</el-button>
			</p>
	
		</div>
	
	</div>
</template>

<script>
//var wx = require('weixin-js-sdk');
var managerConfigData;
var groupId;

import { mapState, mapGetters, mapActions } from 'vuex'
import { PopupPicker, XTextarea, PopupRadio } from 'vux'
import { Range } from 'vux'
import { Datetime } from 'vux'
import SelectUser from '../common/SelectUser.vue'
export default {
	name: 'movebx',
	data() {
		return {
			loading: false,
			movebxVisible: false,
			movebxTextarea: '同意',
			movebxChecked: '',
			currentActId: '',
			sn: '',
			date: new Date().format("yyyy-MM-dd"),
			name: '',
			description: '',
			value: '请设置',
			children: [{ show: true }],
			//relationList:[{ key: 0, value: '本身' }, { key: 1, value: '直接上级' }, { key: 1, value: '直接下级' }],
			/*
			relationList: [[{
				name: '中国',
				value: 'china'
			}, {
				name: '美国',
				value: 'USA'
			}]],*/
			relationList: [[{
				name: '直接上级',
				value: '1'
			}, {
				name: '直接下级',
				value: '1'
			}]],
			options: [{ key: -1, value: '请设置' }, { key: 0, value: '直接选人' }, { key: 1, value: '直接上级' }, { key: 4, value: '岗位' }],
			//selectProjModel:{projUid:this.projUid,selectProjVisible:this.selectProjVisible},
			//options: [{key: 'gd', value: '广东'}, {key: 'gx', value: '广西'}],
			showRelationPicker: false,
			showPositionPicker: false,
			selectNode: null,
			assignee: '',
			departList: null,
			positionList: [],
			userModel: { visible: false, single: true },
			isReadOnly: false,//是否只读
			isNewFlag: true,//是否是新增
			modelId: '',
			key: '',
			procDefId: '',
			formKey:null,
			category: '',
			initNodeMap: {},
			initLength: 0
		}
	},
	created() {
		var _this = this;
		this.util.post('/org/getPositionTreeData', { companyUid: this.$store.state.companyUid }, function (res) {
			//console.info(res);
			if (res.status == 200) {
				//console.info(res.data);
				_this.positionList = new Array();
				for (var i = 0; i < res.data.length; i++) {
					var children = res.data[i]['children'];
					if (children != undefined && children != null && children.length > 0) {
						for (var index in children) {
							var child = children[index];
							_this.positionList.push({
								name: child['label'],
								value: child['value']
							});
						}
					}
					//_this.positionList = _this.positionList.concat(res.data[i]['children']);;
				}
				_this.positionList = [_this.positionList];
				//console.info(_this.positionList);
				// _this.departUid = _this.departList[0].value;
				//console.info(_this.departMap);
			} else {
				_this.util.failueToast(res.errorMsg);
			}
			_this.util.unmask();
		});




	},
	activated() {

		var id = this.util.getUrlParam("id");

		var modelId = this.util.getUrlParam("modelId");
		var category = this.util.getUrlParam("category");
		var procDefId = this.util.getUrlParam("procDefId");
		var formKey = this.util.getUrlParam("formKey");
		var key = this.util.getUrlParam("key");
		this.modelId = modelId;
		this.category = category;
		this.procDefId = procDefId;
		this.formKey = formKey;
		this.key = key;
		//console.info(this.category)
		//console.info(this.category == '1')
		this.name = decodeURI(this.util.getUrlParam("name"));
		this.loadData();
	},
	components: {
		// 名字
		PopupPicker, XTextarea, Range, SelectUser, PopupRadio
	},
	computed: {
		...mapState({
			username: state => state.username,
			userId: state => state.userId
		})

	},
	methods: {
		...mapActions([


		]),
		changePosition(value) {
			//console.info(value);
			//console.info(this.$refs.positionPicker.getNameValues(value));
			if (this.selectNode != undefined && this.selectNode != null) {
				this.selectNode.procUser.procUserType = 4
				this.selectNode.procUser.name = this.$refs.positionPicker.getNameValues(value);
				this.selectNode.procUser.value = value[0];
			}
		}, handelUsers(data) {
			console.info(data);
			if (data != null) {
				var valueArr = new Array();
				var nameArr = new Array();

				for (var i = 0; i < data.length; i++) {
					valueArr.push(data[i].id);
					nameArr.push(data[i].userName);
				}
				if (this.selectNode != undefined && this.selectNode != null) {
					this.selectNode.procUser.procUserType = 0
					this.selectNode.procUser.name = nameArr.join(",");
					this.selectNode.procUser.relationType = null;
					this.selectNode.procUser.value = valueArr.join(",");
				}
			}
		},
		changeProcType(value) {
			//console.info(value);
			if (value == -1) {
				this.selectNode.procUser.value = '';
				this.selectNode.procUser.name = '';
			}
			if (value == 0) {

				this.userModel.visible = true;
				var userUidArr = [];
				if (this.selectNode != undefined && this.selectNode != null) {
					if (this.util.isNotEmpty(this.selectNode.procUser.value)) {
						userUidArr = this.selectNode.procUser.value.split(",");
					}
				}
				var obj = { singer: false, radioCheckedArr: userUidArr }
				this.$refs.profile.postMsg(obj)
			}
			if (value == 1) {
				if (this.selectNode != undefined && this.selectNode != null) {
					this.selectNode.procUser.procUserType = 1
					this.selectNode.procUser.name = '直接上级';
					this.selectNode.procUser.relationType = 1;
					this.selectNode.procUser.value = 'currentUser';
				}
				//this.showRelationPicker = true;
			}

			if (value == 4) {

				this.showPositionPicker = true;
			}
			//this.selectNode = child;

		},
		changeRelation(value) {
			//console.info(value);
			//console.info(this.selectNode);
			if (this.selectNode != undefined && this.selectNode != null) {
				this.selectNode.procUser.procUserType = 1
				this.selectNode.procUser.name = value[0];
				this.selectNode.procUser.relationType = 1;
				this.selectNode.procUser.value = 'currentUser';
			}

			//console.info(this.selectNode);
			//console.info(typeof child.nnt+"--nnt---"+child.nnt);
			//child.schedule = Number(child.nnt);
			//console.info("schedule---"+child.schedule);
		},
		loadData() {
			//
			var _this = this;
			if (this.util.isNotEmpty(this.modelId)) {
				_this.util.mask("正在加载...");
				this.util.post('/workflow/process/getProcess', { modelId: this.modelId, procDefId: this.procDefId }, function (res) {
					//console.info(res);
					if (res != undefined && res.data != undefined) {
						_this.description = res.data.description;
						_this.children = res.data['json_xml'];
						for (var i = 0; i < _this.children.length; i++) {
							var child = _this.children[i];
							_this.initNodeMap[child['nodeId']] = child['nodeName'] + "";
						}
						_this.initLength = _this.children.length;
					}
					_this.util.unmask();
				});
			}
		}, selecAssgine() {


		},
		cancle() {

		}, sumbit(flag) {
			if (flag == 0) {

				history.back();
				return;
			}
			if (!this.validUtil.isNotEmpty(this.name)) {
				this.util.failueToast("请填写流程名称！");
				return;
			}
			var isNewFlag = false;
			var nodeList = new Array();
			nodeList.push({ nodeId: 'node1', nodeName: '填单' });
			for (var index = 1; index < this.children.length; index++) {
				var child = this.children[index];
				if (!this.validUtil.isNotEmpty(child.nodeName)) {
					this.util.failueToast("请填写审批" + (index) + "的环节名称！");
					return;
				}
				if (!this.validUtil.isNotEmpty(child.procUser.value) && child.ifSelUser == '0') {
					this.util.failueToast("请设置审批" + (index) + "的审批人！");
					return;
				}

				var node = { nodeId: 'node' + (index + 1), nodeName: child.nodeName, procUser: child.procUser, ifSelUser: child.ifSelUser };
				if (child.nodeName != this.initNodeMap[node.nodeId]) {
					isNewFlag = true;
				}
				nodeList.push(node);
			}
			if (this.children.length != this.initLength) {
				isNewFlag = true;
			}
			//console.info(nodeList);
			var params = {
				companyUid: this.$store.state.companyUid,
				name: this.name,
				newFlag: isNewFlag,
				description: this.description,
				json_xml: JSON.stringify(nodeList)
			};
			if (this.util.isNotEmpty(this.modelId)) {
				params.modelId = this.modelId;
			}
			if (this.util.isNotEmpty(this.key)) {
				params.key = this.key;
			}
			if (this.util.isNotEmpty(this.category)) {
				params.category = this.category;
			}
			if (this.util.isNotEmpty(this.procDefId)) {
				params.procDefId = this.procDefId;
			}
			if (this.util.isNotEmpty(this.formKey)) {
				params.formKey = this.formKey;
			}
			console.info(params);
			//console.info(this.VoiceRecognition.content);
			var _this = this;
			//return;
			_this.util.mask("正在保存...");
			_this.util.post('/workflow/process/save', params, function (res) {
				if (res != undefined && res != null) {

					if (res.status == 200) {
						_this.util.successToast("保存成功！");
						_this.$store.state.operate = 'save'
						if (!_this.util.isNotEmpty(_this.modelId)) {
							history.back();
						}
					} else {
						_this.util.failueToast("保存失败" + res.errorMsg);
					}
				}

				//history.back();
				_this.util.unmask();
			});
			//this.util.alert(JSON.stringify(this.attachmentModel.fileList));
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
					//nodeName: '审批'+this.children.length,
					nodeName: '',
					ifSelUser: '0',
					procUser: {
						procUserType: -1,
						name: '',
						value: null,
						relationType: null
					},
					show: true
				});
			} else {
				this.children.push({
					nodeName: '',
					ifSelUser: '0',
					procUser: {
						name: '',
						value: null,
						procUserType: -1,
						relationType: null
					},
					show: true
				});
			}
			this.selectNode = this.children[this.children.length - 1];
			//console.info(this.children.length);
		}, hide(child) {
			child.show = false;
			//console.info(child.show);
		}, show(child) {
			for (var i in this.children) {
				this.children[i].show = false;
			}
			child.show = true;
			this.selectNode = child;
			//console.info(this.selectNode);
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
</style>

