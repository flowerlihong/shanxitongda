<template>
	<div class="movebx" >

		<div class="price" style="text-align:left;background-color: #eeefef;">
			<span  class="col-xs-4">{{model.title==undefined?'详情描述':model.title}}
				<span v-if="model.allowBlank!=undefined && model.allowBlank == false" class="span_required">*</span>
			</span>
			<span class="col-xs-8" style="text-align:right;">
				<x-button v-if="!model.isReadOnly" @click.native="record(0)" mini type="primary" style="background-color: #20a0ff;border-color: #20a0ff;padding-left: 5px;padding-right: 5px;" >语音录入</x-button>

			</span>

		</div>
		<div id="price" style="text-align:left;">
			<x-textarea :readonly="model.isReadOnly" :max="2000" style="width: 100%;" v-model="model.content" :placeholder="model.placeholder==undefined?'请输入详情':model.placeholder" ref="content"></x-textarea>
		</div>
		<mt-popup v-model="recordVisable" popup-transition="popup-fade" style="width:90%;padding-top:10px;height:6.3rem;text-align: center;">

			<div>
				<img width="100" :src="baseUrl+'/wechat/images/record.jpg'">
			</div>
			<div>
				<h3 style="     margin-top: 0px;margin-bottom: 0px; ">{{recordContent}}</h3>
			</div>
			<p style="margin: 0 0 0 10px;">
				<x-button  @click.native="record(2)" style="width:48%;margin:0;height:1.3rem;display: inline-block;" type="default">取消</x-button>
				<x-button  @click.native="record(1)" style="width:48%;margin:0;height:1.3rem;margin-top: 0px;display: inline-block;" type="primary">说完了</x-button>
				
			</p>
		</mt-popup>

		<mt-popup v-model="recordContentVisable" popup-transition="popup-fade" style="width:90%;padding-top:10px;height:5.2rem">

			<div style="border: 1px solid #d5d5d6;margin: 7px;margin-top: 0px;">
				<x-textarea :max="1000" v-model="recordConfirmContent"></x-textarea>
			</div>
			<div>
				<x-button @click.native="recordContentClick(0)" style="width:46%;margin:0;height:1.3rem;display: inline-block;" type="default">取消</x-button>
				<x-button @click.native="recordContentClick(1)" style="width:46%;margin:0;height:1.3rem;display: inline-block;margin-top: 0px;" type="primary">确定</x-button>
				<!--
					<el-button @click="recordContentClick(0)" style="width:48%;margin:0;height:1.3rem" type="default">取消</el-button>
					<el-button @click="recordContentClick(1)" style="width:48%;margin:0;height:1.3rem" type="success">确定</el-button>
					-->
			</div>
		</mt-popup>

	</div>
</template>

<script>
//var wx = require('weixin-js-sdk');
var managerConfigData;
var groupId;

import { XButton, XTextarea } from 'vux'
export default {
	props: ['model'],
	components: {
		XButton, XTextarea
	},
	data() {
		return {
			loading: false,
			movebxVisible: false,
			movebxTextarea: '同意',
			movebxChecked: '',
			currentActId: '',

			recordVisable: false,
			recordContentVisable: false,
			recordConfirmContent: '',
			//content:,

			attachmentModel: {
				title: '现场照片',
				fileList: [],
				deleteFilesList: []
			},
			timer: null,
			timeout: 60,
			recordContent: '00:59',
			isNewFlag: true,//是否是新增
			id: ''
		}
	},
	created() {
		//this.$store.state.selectProjModel.projName='aaa';
		var wxurl = window.location.href.split("#")[0];
		//this.util.wxConfig(this, wxurl, ['startRecord', 'stopRecord', 'uploadVoice']);
		//console.info("------recordVisable------");
		//console.info(this.baseUrl);


	},
	activated() {

	},
	computed: {


	},
	methods: {

		countDown() {
			//倒计时
			if (this.timeout > 0) {
				//console.info(this.timeout)
				this.timeout--;
				var recordContentStr = 100 + this.timeout;
				recordContentStr = recordContentStr + '';

				this.recordContent = '00:' + recordContentStr.substring(1, 3); + ')';
			} else {
				clearInterval(this.timer);
				this.recordContent = '00:00';
			}
		}, recordContentClick(flag) {
			if (flag == 1) {
				//this.content = this.recordConfirmContent;
				var contentDom = this.$refs.content.$el;
				//weui-textarea
				var contentDom = $(contentDom).find('textarea')[0];
				//console.info(contentDom);
				//console.info($(contentDom));
				$(contentDom).insertAtCaret(this.recordConfirmContent);
				this.model.content = $(contentDom).val();
				//console.info("VoiceRecognition.content----"+this.model.content);
			}
			this.recordContentVisable = false;
		}, record(flag) {
			var _this = this;
			if (flag == 0) {
				/*
								this.recordContentVisable = true;
								return;
				*/
				if (this.timer != null) {
					clearInterval(this.timer);
				}
				this.recordConfirmContent = '';
				this.recordVisable = true;
				this.timeout = 60;
				this.countDown();
				this.timer = setInterval(this.countDown, 1000);
				var contentDom = this.$refs.content.$el;
				var contentDom = $(contentDom).find('textarea')[0];
				$(contentDom).focus();
				_this.wx.startRecord();
			} else if (flag == 2) {
				this.recordVisable = false;
				_this.wx.stopRecord();
			} else if (flag == 1) {
				//说完了
				clearInterval(this.timer);
				_this.wx.stopRecord({
					success: function(res) {
						var localId = res.localId;
						//_this.util.alert(localId);
						_this.util.mask("正在识别中...");
						_this.wx.uploadVoice({
							localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
							isShowProgressTips: 0, // 默认为1，显示进度提示
							success: function(res) {
								var serverId = res.serverId; // 返回音频的服务器端ID
								_this.util.post("/wx/weChatAction!voiceRecognition.action", { serverId: serverId, suite_id: window.suite_id,agent_id:window.agent_id, corp_id: window.corp_id }, function(res) {
									if (_this.validUtil.isNotEmpty(res)) {
										if (res.status == 200) {
											//_this.util.successToast(res.data[0]);
											if (res.data[0].lastIndexOf('，') > -1) {
												_this.recordConfirmContent = res.data[0].substring(0, res.data[0].length - 1);
											} else {
												_this.recordConfirmContent = res.data[0];
											}

											_this.recordVisable = false;
											_this.recordContentVisable = true;

										} else {
											_this.util.failueToast("对不起，无法识别您的语音！");
										}
									} else {
										_this.util.failueToast("对不起，无法识别您的语音！");
									}
									_this.util.unmask();
								});
							},
							fail: function(res) {
								_this.util.failueToast("对不起，无法识别您的语音！");
								_this.util.unmask();
							}
						});
					}
				});
			}

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




</style>
<style>
/***/

.mint-cell-wrapper {
	font-size: 14px;
	background: none;
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
