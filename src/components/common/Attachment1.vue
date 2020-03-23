<template>
	<div class="bill" style="text-align:left;padding: 0px 0 0 0;">
		<span class="col-xs-12" style="padding-left: 10px;padding-bottom: 5px;">{{model.title}}</span>
		<div class="load">
			<ul id="imgsLoad" style="margin-bottom: 5px;">
				<li style="margin-top: 2px;">
					<ul>
						<li style="margin:0 5px;position:relative;text-align:left;" v-for="img in model.fileList" :key="img.fileId">
							<img @click="previewImage(img.src)" style="width:43px;height:43px;" :src="img.src" alt="">
							<i @click="removeImage(img,$event)" v-if="showDelete" class="changeDelete" style="position:absolute;top:-6px;left:-5px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
						</li>
						<li v-if="!model.isReadOnly" style="margin:0px 0px 0px 3px;position:relative;text-align:left;">
							<img style="width:45px;height:45px;" @click="addImg()" src="../../assets/add_image.png">
						</li>
						<li v-if="!model.isReadOnly" style="margin:0px 5px 0px 5px;position:relative;text-align:left;">
							<img style="width:45px;height:45px;" @click="delImg()" src="../../assets/remove_image.png">
						</li>
						
					</ul>
				</li>

			</ul>
			<ul>
				<li v-for="(item,index) in otherFileList" :key="index">
					<!-- {{item.fileName}}  {{item.src}} -->
					<a :href="item.src">{{item.fileName}}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
	name: 'selectProj',
	data() {
		return {
			value: '',
			showDelete: false,
			otherFileList:[]
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
			
			//console.log('new: %s, old: %s', val, oldVal);
			if(this.util.isNotEmpty(val.id)){
				this.loadData(val.id);
			}
		},
	},
	props: ['model'],
	activated() {		
		this.showDelete = false;
		if(this.util.isNotEmpty(this.model.id)){
		//	console.info("--11---"+this.model.id);
			//this.loadData(this.model.id);
		}else{
		var id = this.util.getUrlParam("Id");
			//console.log("eeeeeeeeeee",id)
			this.loadData(id);
		}
		
	},
	updated() {
		//console.info("attachment--------updated--------");
	},
	created() {
		//console.info("attachment--------created--------");
		this.showDelete = false;
		var _this = this;
		this.search = '';
		this.util.initWxJsSdk(this);

	},
	methods: {
		loadData(id) {
			var _this = this;
			_this.model.fileList = new Array();
			//console.info("--------333----------"+this.model.xtype);
			if (this.util.isNotEmpty(id)) {
				var params = { parentId: id };
				if (this.util.isNotEmpty(this.model.xtype)) {
					params = { parentId: id, xtype: this.model.xtype };
				}
				this.util.post("/wx/weChatAction!getFiles.action", params, function(res) {

					if (res.data != undefined && res.data.length > 0) {
						for (var i =0;i< res.data.length;i++) {
							var item = res.data[i];
							if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(item.type)){
								item.isNewFlag = false;
								item.src = _this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.fileId + '&type=' + item.type + '&access_token=' + _this.util.getAccessToken();
								_this.model.fileList.push(item);
							}else{
								_this.otherFileList.push(item);
								item.src = _this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.fileId + '&type=' + item.type + '&access_token=' + _this.util.getAccessToken();
							}
							
						}
					//	console.info("-----附件",_this.model.fileList);
					}
				});
			}
		},
		previewImage(curId) {
			//this.util.successToast(curId);
			//alert(curId);
			//alert(JSON.stringify(this.preViewImageList));
			//this.util.successToast(JSON.stringify(this.preViewImageList));
			this.wx.previewImage({
				current: curId, // 当前显示图片的http链接
				urls: this.preViewImageList, // 需要预览的图片http链接列表
				fail: function(res) {
						//alert(JSON.stringify(res))
				}
			});
		}, removeImage(img) {
			//this.util.successToast(JSON.stringify(img));
			this.model.deleteFilesList.push(img.id);
			this.model.fileList = this.model.fileList.filter((item) => {
				return item != img;
			});

		},
		uploadFile(localIds, index) {
			var _this = this;
			var xtype = "";
			if (this.util.isNotEmpty(this.model.xtype)) {
				xtype = this.model.xtype;
			}
			_this.util.mask("正在上传第" + index + "张图片");
			var localId = localIds.pop();
			
			this.wx.uploadImage({
				localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
				isShowProgressTips: 0,// 默认为1，显示进度提示
				success: function(res) {
					var serverId = res.serverId; // 返回图片的服务器端ID
					_this.util.post("/wx/weChatAction!downloadTempFromWeChat.action", { serverId: serverId, xtype: xtype, suite_id: window.suite_id, corp_id: window.corp_id }, function(res) {

						var item = res.data;
						item.isNewFlag = true;
						index++;
						_this.util.unmask();
						_this.model.fileList.push(item);
						//_this.util.successToast(JSON.stringify(item));
						if (localIds.length > 0) {
							_this.uploadFile(localIds, index);
						}
					});
				},
				fail: function(res) {
					_this.util.failueToast("上传第" + index + "张图片失败！");
				}
			});
		},
		addImg() {
			
			var _this = this;
			if (_this.util.isNotEmpty(_this.model.maxNum)) {
				if (_this.model.fileList >= _this.model.maxNum) {
					_this.util.failueToast("只能上传" + _this.model.maxNum + "个文件");
					return false;
				}
			}
			var sourceType = ['album', 'camera'];
			if (this.model.sourceType != null && this.model.sourceType != undefined) {
				sourceType = this.model.sourceType;
			}
			//var _this=this;
			
			//this.wx.ready(function () {
			
			_this.wx.chooseImage({
				count: 9, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					//_this.util.successToast("选择成功！");
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					if (_this.util.isNotEmpty(_this.model.maxNum)) {
						if (localIds.length > _this.model.maxNum) {
							_this.util.failueToast("只能上传" + _this.model.maxNum + "个文件");
							return false;
						}
					}
					_this.uploadFile(localIds, 1);

				},
				fail: function(res) {
					console.log(res)
					//console.log("shangchuanshibai---",+JSON.stringify(res))
					_this.util.failueToast("选择照片失败！" + JSON.stringify(res));
				}
			});
		//	})
			

		},
		delImg() {
			this.showDelete = !this.showDelete;
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
	border-top: 0px solid #eee;
	padding: 10px 0 0 0;
	height: auto;
	.load {
		height: auto; //border-bottom: 1px solid #ccc;
		margin-top: 10px;
		padding: 5px 5px;
		#imgsLoad {
			height: auto;
			overflow: hidden;
			width: 100%;
			li {
				float: left;
			}
		}
	}
}
</style>
