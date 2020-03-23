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

		<div class="weui-cell weui-cell_select myCell" style="padding-left: 10px;">
			<div class="weui-cell__hd">
				<span>项目
					<span style="color:red">*</span>
				</span>
			</div>
			<div v-if="!isReadOnly" class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectProj(selectProjModel)">
				<span style=" display: block;height: 100%;padding-right: 0px;line-height: 23px;">{{selectProjModel.projName}}</span>
				<input v-model="selectProjModel.projUid" class="col-xs-9" type="text" style="display:none">
			</div>
			<div v-if="isReadOnly" class="weui-cell__bd myCell-bd" style="padding-right: 10px;">
				<span style=" display: block;height: 100%;padding-right: 0px;line-height: 23px;">{{selectProjModel.projName}}</span>
				<input v-model="selectProjModel.projUid" class="col-xs-9" type="text" style="display:none">
			</div>
		</div>
		<div class="weui-cell weui-cell_select myCell" id="myCell" style="padding-left: 10px;">
			<div class="weui-cell__hd">
				<span>天气

				</span>
			</div>
			<div class="weui-cell__bd">
				<select v-if="!isReadOnly" :readonly="isReadOnly" class="weui-select" style="   padding-right: 10px;width: auto;" name="select2">
					
					<option v-for="(item,index) in optionData" :value="item.value" :key="index">{{item.name}}</option>
				</select>
				<span v-if="isReadOnly" style="padding-right: 10px;">{{mainData.tq}}</span>
			</div>
		</div>
		<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
			<div class="weui-cell__hd">
				<span>温度

				</span>
			</div>
			<div class="weui-cell__bd">
				<input :readonly="isReadOnly" v-model="mainData.wd" style="text-align: right;" type="number" placeholder="" />
				<span>℃</span>
			</div>
		</div>

		<div class="price" style="text-align:left;display:none;">
			<span class="col-xs-3">单号</span>
			<input v-model="sn" class="col-xs-9" type="text">
		</div>
		<VoiceRecognition :model="voiceRecognition"></VoiceRecognition>

		<template v-for="(child,index) in children">
			<div @click="show(child)" v-if="(child.show == undefined || !child.show)" :key="index" class="middle" style="border-bottom: 1px solid #ccc;">
				<div class="pop" style="background-color: #eeefef;">
					<span class="col-xs-4" style="text-align:left;padding-right: 0px;">施工内容{{index+1}}</span>
					<div class="daright col-xs-8">
						<span style="margin-right:10px;">{{(child.fxgc!=undefined && child.fxgc.length>12)?(child.fxgc.substring(0,12)+'...'):child.fxgc}}</span>

						<i class="glyphicon glyphicon-chevron-down"></i>
					</div>
				</div>
			</div>
			<div v-if="child.show" :key="index" class="middle">
				<div class="pop" style="background-color: #eeefef;">
					<span class="col-xs-4" style="text-align:left;padding-right: 0px;">施工内容{{index+1}}:</span>
					<div @click.stop="hide(child)" class="daright col-xs-8">
						<span v-if="!isReadOnly" style="color:#f00;" @click.stop="remove(child)">-删除</span>&nbsp;&nbsp;
						<span v-if="!isReadOnly" style="color:blue;margin:0 10px;" @click.stop="add(child)">+复制</span>
						<i class="glyphicon glyphicon-chevron-up"></i>
					</div>
				</div>
				<div class="price" style="text-align:left;">
					<span class="col-xs-3" style="padding-right:0px;">分项工程
						<span style="color:red">*</span>
					</span>
					<input :readonly="isReadOnly" v-model="child.fxgc" class="col-xs-9" type="text">
				</div>
				<div class="price" style="text-align:left;">
					<span class="col-xs-3" style="padding-right:0px;">施工部位</span>
					<input :readonly="isReadOnly" v-model="child.sgbw" class="col-xs-9" type="text">
				</div>
				<div class="price" style="text-align:left;">
					<span class="col-xs-3" style="padding-right:0px;">施工班组</span>
					<input :readonly="isReadOnly" v-model="child.sgbz" class="col-xs-9" type="text">
				</div>
				<div class="price" style="text-align:left;">
					<span class="col-xs-3" style="padding-right:0px;">施工人数
						<span style="color:red">*</span>
					</span>
					<input :readonly="isReadOnly" v-model="child.rs" class="col-xs-9" type="number">
				</div>

				<div class="price" style="text-align:left;">
					<span class="col-xs-3" style="padding-right:0px;">备注
						<span style="color:red">*</span>
					</span>
					<input :readonly="isReadOnly" v-model="child.bz" class="col-xs-9" type="text">
				</div>
			</div>
		</template>
		<div class="foot" style="padding-top:0;text-align:center;    ">
			<div v-if="!isReadOnly" style="position:relative;height:45px; border-bottom: 1px solid rgb(204, 204, 204);">
				<p @click="add" style="position: absolute;left: 50%;transform: translateX(-50%);width: 100%;"> + 添加一条施工内容明细</p>
			</div>

			<p class="footColor" style="height:42px;border-bottom: 0px solid #ccc;">共
				<span>{{children.length}}</span> 条明细</span>
			</p>
		</div>
		<Attachment :model="attachmentModel"></Attachment>
		<mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectProj :mess="selectProjModel" @selectProjCallback="selectProjCallback($event)"></SelectProj>
		</mt-popup>

		<ProcessForm :model="processModel" ref="process"></ProcessForm>

	</div>
</template>

<script>
//var wx = require('weixin-js-sdk');
import { cookieUtil } from '@/utils/utils.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import SelectProj from '../common/SelectProj.vue'
import VoiceRecognition from '../common/VoiceRecognition.vue'
import Attachment from '../common/Attachment.vue'
import ProcessForm from '../common/ProcessForm.vue'
import { XButton, Datetime } from 'vux'

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
			projName: '选择项目',
			selectProjVisible: false,
			projUid: '11',
			projInfo: {
				projName: '选择项目',
				projUid: ''
			},
			weatherIndex: 0,
			mainData: {
				fsrq: '',
				Subject: '',
				wd: '',
				tq: '',
				czy: '',
				xmid: '',
				xmmc: ''
			},
			attachmentModel: {
				isReadOnly: false,
				xtype: 'fujian1',
				title: '现场照片',
				fileList: [],
				deleteFilesList: []
			},
			voiceRecognition: {
				title: '详细描述',
				isReadOnly: false,
				placeholder: '请输入详情...',
				content: ''
			},
			formId: "DForm_G006_gcgl_sgrz",
			sqlTableName: 'G006_gcgl_sgrz',
			symbol: 'SGRZ',
			optionData:[],
			processModel: {
				ifHashWorkflow: false,
				isReadOnly: false,
				sqlTableName: this.sqlTableName,
				formId: this.formId,
				parent: null,
				id: '',
				procDefId: '',
				procInstId: ''
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
		var _this = this;
		this.util.loadDic({dicId:'Dic_G006_TQQK'},function(data){
			console.info(data);
			_this.optionData = data;
		})
	},
	activated() {
		this.$store.state.selectProjModel.vue = this;
		var id = this.util.getUrlParam("id");
		var projUid = this.util.getUrlParam("projUid");
		if (this.util.isNotEmpty(projUid)) {
			this.selectProjModel.projUid = cookieUtil.get("projUid");
			this.selectProjModel.projName = cookieUtil.get("projName");

		} else {
			this.selectProjModel.projUid = "";
			this.selectProjModel.projName = "";
		}
		var isReadOnlyParam = this.util.getUrlParam("isReadOnly");
		this.isReadOnly = (this.validUtil.isNotEmpty(isReadOnlyParam) && isReadOnlyParam == "true") ? true : false;
		this.isNewFlag = (this.validUtil.isNotEmpty(id)) ? false : true;
		this.attachmentModel.isReadOnly = this.isReadOnly;
		this.voiceRecognition.isReadOnly = this.isReadOnly;
		this.id = id;

		this.processModel.parent = this;
		this.loadData();
	},
	components: {
		// 名字
		XButton, Datetime, SelectProj, Attachment, VoiceRecognition, ProcessForm
	},
	computed: {
		...mapState({
			username: state => state.username,
			userId: state => state.userId,
			selectProjModel: state => state.selectProjModel
		}),
		subject: {
			get() {
				//console.info(this.selectProjModel);
				return this.date + ' ' + (this.util.isNotEmpty(this.selectProjModel.projUid) ? this.selectProjModel.projName : '');
			},
			set(value) {
				//this.$store.commit('updateBxTitle', value)
			}
		}

	},
	methods: {
		...mapActions([

			'selectProj',
			'selectProjCallback'

		]),
		loadData() {

			var _this = this;
			//console.info(this.isNewFlag);
			//_this.selectProjModel.projUid = null;
			_this.date = new Date().format("yyyy-MM-dd");
			_this.mainData = {
				fsrq: _this.date,
				Subject: '',
				wd: '',
				tq: '',
				czy: this.sessionUtil.getUserName(),
				xmid: '',
				xmmc: ''
			}
			_this.children = [];

			_this.attachmentModel.fileList = [];
			_this.attachmentModel.deleteFilesList = [];
			_this.voiceRecognition.content = '';
			//_this.attachmentModel.parentId = this.id;
			if (!this.isNewFlag) {
				_this.util.mask("正在加载...");
				this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WorkLog&appId=WeChat', { operateType: 'get', id: this.id }, function(res) {
					//console.info(res);
					if (res != undefined && res.data != undefined) {
						_this.mainData = {
							fsrq: res.data.fsrq,
							Subject: res.data.Subject,
							wd: res.data.wd,
							tq: res.data.tq,
							czy: res.data.czy,
							xmid: res.data.xmid,
							xmmc: res.data.xmmc
						}
						_this.voiceRecognition.content = res.data.bzs;
						_this.selectProjModel.projUid = res.data.xmid;
						_this.selectProjModel.projName = res.data.xmmc;

					}

					if (res.data['children'] != undefined) {
						/**/
						for (var i = 0; i < res.data['children'].length; i++) {
							var item = res.data['children'][i];
							item.show = false;

							if (item.rs == undefined) {
								item.rs = 0;
							}

							_this.children.push(item);
						}

						_this.children = res.data['children'];
					}
					_this.attachmentModel.deleteFilesList = [];

					_this.util.unmask();
				});
			} else {
				if (_this.util.isNotEmpty(_this.selectProjModel.projUid)) {
					//调用接口获取天气信息
					//_this.afterSelectProj({id:_this.selectProjModel.projUid});
				}
				//var location = "113.434993,23.163462";
				//this.getAdcode(location);
			}
		},
		getAdcode(location) {
			var _this = this;
			var url = "http://restapi.amap.com/v3/geocode/regeo?key=" + _this.util.amapKey + "&output=json&location=" + location + "&radius=1000&extensions=base";
			$.ajax({
				url: url,
				timeout: 60000,
				async: false,
				type: "GET",
				dataType: 'json',
				data: null,
				success: function(result) {
					//_this.util.successToast("1-"+result.info);
					if (_this.util.isNotEmpty(result)) {
						//console.info(result.info);
						if (result.info == "OK") {
							var adcode = result.regeocode.addressComponent.adcode;
							//console.info(adcode);
							_this.getWeather(adcode);
						}
					}

				}
			});
		},
		getWeather(adcode) {
			var _this = this;
			var url = "http://restapi.amap.com/v3/weather/weatherInfo?city=" + adcode + "&key=" + _this.util.amapKey;
			$.ajax({
				url: url,
				timeout: 60000,
				async: false,
				type: "GET",
				dataType: 'json',
				data: null,
				success: function(result) {
					//_this.util.successToast("2-"+result.info);
					if (_this.util.isNotEmpty(result)) {
						//console.info(result);
						if (result.info == "OK") {
							_this.weatherModel = {
								amWeather: result.lives[0].weather,
								pmWeather: result.lives[0].weather,
								amWdir: result.lives[0].winddirection,
								pmWdir: result.lives[0].winddirection,
								amMaxT: result.lives[0].temperature,
								pmMaxT: result.lives[0].temperature,
								amMinT: result.lives[0].temperature,
								pmMinT: result.lives[0].temperature,
								amWs: result.lives[0].windpower,
								pmWs: result.lives[0].windpower,
								editWeatherVisible: false
							};
							//console.info(adcode);
						}
					}

				}
			});
		},
		cancle() {

		},
		checkValid() {


			if (!this.validUtil.isNotEmpty(this.selectProjModel.projUid)) {
				this.util.failueToast('请选择项目！');
				return false;
			}
			if (this.children.length == 0) {
				this.util.failueToast("施工内容不能为空！");
				return;
			}
			for (var i = 0; i < this.children.length; i++) {
				var item = this.children[i];
				if (!this.validUtil.isNotEmpty(item.fxgc)) {
					this.util.failueToast("施工内容中的分项工程不能为空！");
					return;
				}
				if (!this.validUtil.isNotEmpty(item.rs) || Number(item.rs) <= 0) {
					this.util.failueToast("施工内容中的施工人数不合法！");
					return;
				}
				if (!this.validUtil.isNotEmpty(item.bz)) {
					this.util.failueToast("施工内容中的备注不能为空！");
					return;
				}
			}
			return true;
		}, getMainFormData() {

			this.mainData.xmmc = this.selectProjModel.projName;
			this.mainData.xmid = this.selectProjModel.projUid;
			this.mainData.Subject = this.mainData.fsrq + this.mainData.xmmc + "的施工日志";
			//this.mainData.subject= this.mainData.Subject;
			this.mainData.bz = this.voiceRecognition.content;

			return this.mainData;
		}, getSubFormData() {
			//设置字表数据
			var subForm = { subFormId: 'subForm1', subFormForeignKey: 'pid', subFormTable: 'G006_gcgl_sgrzdet' };
			var subFormArr = new Array();
			var index = 0;
			//console.info(this.children);
			for (var i = 0; i < this.children.length; i++) {
				var item = this.children[i];
				item.sort = ++index;
				subFormArr.push(item);
			}
			subForm['data'] = JSON.stringify(subFormArr);
			var subFormData = new Array();
			subFormData.push(subForm);
			return subFormData;
		}, getFileData() {
			var filesData = new Array();
			//alert(JSON.stringify(this.attachmentModel.fileList));
			for (var i= 0;i< this.attachmentModel.fileList.length;i++) {
				var file = this.attachmentModel.fileList[i];
				if (file.isNewFlag) {
					filesData.push(file);
				}
			}
			
			//alert("filesData---"+JSON.stringify(filesData));
			return filesData;
		},
		getData() {
			var _this = this;
			var mainData = this.getMainFormData();
			var subFormData = this.getSubFormData();
			var filesData = this.getFileData();
			//alert("filesData-2222--"+JSON.stringify(filesData));
			var params = { sqlTableName: this.sqlTableName, mainFormData: JSON.stringify(mainData), subFormData: JSON.stringify(subFormData), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
			if (this.validUtil.isNotEmpty(this.id)) {
				params['id'] = this.id;
				params['businessKey'] = this.id;
			}
			params['symbol'] = this.symbol;
			params['formId'] = this.formId;
			//params['subject'] = mainData.Subject;

			console.info(params);

			return params;

		}, afterSelectProj(data) {
			// console.info(data);
			var _this = this;
			if (this.util.isNotEmpty(data.id)) {
				this.util.post("/business/getProjLocation", { id: data.id }, function(result) {
					if (_this.util.isNotEmpty(result) && result.status == 200) {
						_this.getAdcode(result.data.ADDR_LOCATION_);
					}
				});
			}
			//this.subject = this.date+data.projName+'日志';
			//console.info("afterSelectProj")
			//console.info(data)
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
					subject: child.subject,
					stationInteval: child.stationInteval,
					team: child.team,
					nnt: child.nnt,
					scheduleDesc: child.scheduleDesc,
					schedule: child.schedule,
					show: true
				});
			} else {
				this.children.push({
					subject: '', stationInteval: '',
					team: '',
					nnt: 0,
					scheduleDesc: '',
					schedule: 0,
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
</style>

