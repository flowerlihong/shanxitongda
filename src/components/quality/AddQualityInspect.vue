<template>
  <div class="movebx" style="height:100%;overflow: auto;">
	  	<div class="middle">
			  <div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd"><span>所属项目</span></div>
				<div class="weui-cell__bd myCell-bd" @click="selectProj()">
					<span>{{quality.project.length<23? quality.project:quality.project.substring(0,23)+'...'}}</span>
				</div>
			</div>
	  		<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd"><span>性质</span></div>
				<div class="weui-cell__bd myCell-bd" @click="selectNature()">
					<span>{{quality.checkNature.length>21? quality.checkNature.substring(0,21)+'...':quality.checkNature}}</span>
				</div>
			</div>
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd"><span>检查人</span></div>
				<div class="weui-cell__bd myCell-bd" @click="selectChecker()">
					<span>{{checkerModel.userName}}</span>
				</div>
			</div>
			<div class="price" style="text-align:left;border-bottom: 1px solid #eee;">
				<span class="col-xs-3">日期</span>
				<datetime title="" class="col-xs-9 no-line"  v-model="quality.checkDate" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>
			
			<div style="height:48px;line-height:48px;padding-left:10px;border-bottom: 1px solid #eee;background:#eee">
				<span>检查项</span>
			</div>
			<div id="price" style="text-align:left;">
				<x-textarea :max="100" style="width: 100%;" v-model="quality.checkItem" placeholder="请输入检查项" ref="content"></x-textarea>
			</div>
			
			<!--复制模板-->
			 <template v-for="(resultItem,key)  in checkResults"> 
				 <div class="checkResult" style="padding-top:0;">
					<p>检查结果{{key+1}}</p>
					<span style="color:#f00;" class="checkResult-span" @click.stop="deleteResult(resultItem)">-删除</span>
				</div>
				<div style="text-align:left;">
					<x-textarea :max="500" style="width: 100%;" v-model="resultItem.content" :placeholder="(key+1)+'.请输入检查结果..'" ref="content"></x-textarea>
				</div>
				<Attachment :model="resultItem.attachmentModel" style="border-top: 1px solid #eee;"></Attachment>
				<div style="margin-top: 5px;padding: 6px 0 10px 10px;">
					<checker @on-change="onItemClick" v-model="resultItem.checkStatus" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
						<checker-item v-for="(item,i) in tabDatas" :key="i" :value="item.value">{{item.name}}</checker-item>
					</checker>
				</div>
				<!-- <div class="bill"> -->
				<!-- <span class="col-xs-4">上传附件</span>
				<div class="load">
						<ul id="imgsLoad">
							<li>
								<ul>
									<li style="margin:0 5px;position:relative;" v-for="img in resultItem.imgs"><img @click="previewImage(img.src,resultItem.imgs)" style="width:40px;height:40px;" :src="img.src" alt="">
									<i @click="remove(resultItem,img,$event)" v-if="resultItem.deleteImg" class="changeDelete" style="position:absolute;top:-10px;left:-10px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff">&nbsp;X</i></li>
								</ul>
							</li>
						<li><img @click="addImg(resultItem)" src="../../assets/add_image.png"></li>
						<li><img @click="delImg(resultItem)" src="../../assets/remove_image.png"></li>
						</ul>
				</div> -->
				
				
			<!-- </div> -->
			 </template> 
	  	</div>
		<!--选择检查人-->
		<mt-popup v-model="checkerModel.visible" position="right"
			popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="checkerModel" ref="profile" ></SelectUser>
		</mt-popup>
		<!--选择通知人-->
		<mt-popup v-model="notifierModel.visible" position="right"
			popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="notifierModel" ref="notifierfile" ></SelectUser>
		</mt-popup>
	  	<!--选择项目-->
		<mt-popup v-model="quality.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectProj :mess="quality" @selectProjCallback="selectProjCallback($event)"></SelectProj>
		</mt-popup> 
		
		<!--选择性质-->
		<mt-popup v-model="natureObj.tagsVisible" position="right"
			popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectNature :tags="natureObj" @chooseTags="showNature($event)"></SelectNature>
		</mt-popup>
  	
  	<div class="foot" style="padding-top:0;">
  		<p @click="addCheckResult"> + 添加检查结果</p>
  	</div>
		<div class="conductor">
			<div class="container">
				<div :style="left" class="row">
					<div :style="background" class="conductorPerson">
						<p class="lf">通知人</p>
					</div>
					<ul id="person">
						<li>
							<ul>
								<li style="margin:5px 5px;position:relative;" v-for="notifier in notifierModel.users"><img style="width:40px;height:40px;" :src="notifier.picture" alt=""><p style="margin:0;">{{notifier.userName.length>3? notifier.userName.substring(0,3)+'..':notifier.userName}}</p>
								<i @click="removeUser(notifier,$event)" v-if="delUserStyle" class="glyphicon glyphicon-remove changeDelete"  style="position:absolute;top:-2px;left:-3px;color:#fff;width:16px;height:16px;border-radius:50%;background:#f00;"></i>
								</li>
							</ul>
						</li>
						<li>
							<svg class="icon" style="font-size:46px;color:#1AFA29" @click="selectInformUser()" aria-hidden="true">
								<use xlink:href="#icon-tianjiarenyuan"></use>
							</svg>
						</li>
						<li>
							<svg class="icon" style="font-size:46px;color:#D81E06" @click="delPerson()" aria-hidden="true">
								<use xlink:href="#icon-shanchulianxiren"></use>
							</svg>
						</li>
					</ul>
				</div>
			</div>
	</div>

   	<div class="footer">
		   <x-button @click.native="saveData()" mini style="width:48%;height: 45px;" type="primary">保存</x-button>
			<x-button v-if="createImproveBtn" @click.native="saveData(1)" mini style="width:48%;height: 45px;background: #336699;" type="primary">生成整改单</x-button>
  		
  	</div>
	  
  </div>
</template>

<script>
import SelectNature from './SelectNature.vue'
import SelectUser from '../common/SelectUser.vue'
import SelectProj from '../common/SelectProj.vue'
import Attachment from '../common/Attachment.vue'
import {mapState,mapGetters, mapActions} from 'vuex'
import { Checker, CheckerItem,XButton,Datetime,XTextarea} from 'vux'
import {cookieUtil } from '@/utils/utils.js'
export default {
    name: 'movebx',
    data () {
	    return {
			tabDatas:[{name:'通过',value:'0'},{name:'口头警告',value:'1'},{name:'书面整改',value:'2'}],
			checkerModel:{
				visible:false,
				userName:"",
				userUid:"",
				users:[]
			},
			notifierModel:{
				visible:false,
				users:[]
			},
			beginDate:new Date(),
			left: {textAlign:'left'},
    		background: {background:'#eee'},
			createImproveBtn: false,   //是否生成整改单
			checkStatus:'',
			quality: {
				project:'',
				proUid:'',
				checkNature:'',
				checkDate:new Date().format("yyyy-MM-dd"),
				checker:'',
				checkItem:'',
				selectProjVisible:false
			},
			natureObj: {
				tagsVisible:false
			},
	    	checkResults: [
				{
					content:'',
					checkStatus:'',
					deleteImg:false,
					attachmentModel: {
						title: '上传附件',
						xtype:"fujian",
						fileList: [],
						deleteFilesList: []
					}
				}
			],
			handlerList:[],
			delUserStyle:false,   //删除用户
			id:'',
			isNewFlag:false
	    }
    },
	components:{
      Checker, CheckerItem,SelectProj,SelectNature,SelectUser,XButton,Datetime,XTextarea,Attachment
	},
    computed: {
		...mapState({
				selectProjModel: state => state.selectProjModel,
				userName: state => state.userName,
				userUid: state => state.userUid
		   })
			
    },
  created(){
		this.util.initWxJsSdk(this);
		this.checkerModel.userName = this.userName;
		this.checkerModel.userUid = this.userUid;
		this.checkerModel.users = [{userName:this.userName,id:this.userUid}];
  },
  activated() {
	  	this.quality={project:'',proUid:'',checkNature:'',
				checkDate:new Date().format("yyyy-MM-dd"),
				checker:'',checkItem:'',selectProjVisible:false};
		this.createImproveBtn=false;
		this.checkResults=[{content:'',checkStatus:'',attachmentModel: {
			title: '上传附件',xtype:'fujian',fileList: [],deleteFilesList: []
		}}];
		this.notifierModel={visible:false,users:[]};
	  	this.id = this.util.getUrlParam("id");
		this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;

		this.loadData();
		
	},
    methods: {
		loadData(){
			if(this.util.isNotEmpty(this.id)){
				this.util.mask();
				var _this=this;
				var param = {
						operateType:'getCheckBillDataByid',
						id:this.id
				};
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
					_this.util.unmask();
					if (res.status == 200) {
						_this.quality={
							project:res.data.project,
							proUid:res.data.projUid,
							checkNature:res.data.checkNature,
							checkDate:res.data.checkDate,
							checker:res.data.checker,
							checkItem:res.data.checkItem
						};
						_this.checkerModel.userName=res.data.checker;
						_this.checkerModel.userUid=res.data.checkerIds;
						if(res.data.subFormData!=undefined&&res.data.subFormData.length>0){
							for(var i=0;i<res.data.subFormData.length;i++){
								res.data.subFormData[i].attachmentModel={
									id : res.data.subFormData[i].id,
									xtype:"fujian",
									title: '上传附件',
									fileList: _this.loadImgs(res.data.subFormData[i].id),
									deleteFilesList: []
								};
							}
							_this.checkResults = res.data.subFormData;
						}
						
					}
					
					
				});
			}  
			
		},
	loadImgs(id) {
		var _this = this;
		var fileList = new Array();
		if (this.util.isNotEmpty(id)) {
			var params = { parentId: id, xtype: "fujian" };
			this.util.sycnPost("/wx/weChatAction!getFiles.action", params, function(res) {
				if (res.data != undefined && res.data.length > 0) {
					for (var i in res.data) {
						var item = res.data[i];
						item.isNewFlag = false;
						item.src = _this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.fileId + '&type=' + item.type + '&access_token=' + _this.util.getAccessToken();
						fileList.push(item);
					}
				}
			});
		}
		return fileList;
	},
	deleteResult(resultItem){
		var _this=this;
		if(this.checkResults.length==1){
			this.util.alert("检查结果不能为空！");
			return;
		}
		this.util.confirm("确定删除该检查结果？",function(){
			_this.checkResults=_this.checkResults.filter((item) => {
				return item!=resultItem;
			});
		});
		
	},
	delPerson() {
		this.delUserStyle = !this.delUserStyle;
	},
	removeUser(notifier,$event){
		this.notifierModel.users=this.notifierModel.users.filter((item) => {
	  		return item!=notifier;
	  	});
	},
	previewImage(curId,curData){
		var imgIds=[];
		for(var i=0;i<curData.length;i++){
			imgIds.push(curData[i].src);
		}
		this.wx.previewImage({
			current: curId, // 当前显示图片的http链接
			urls: imgIds // 需要预览的图片http链接列表
		});
	},
	selectDate(){
		this.$refs.picker.open();
	},
	handleConfirm(value){
		var time1 = new Date(value).format("yyyy-MM-dd");
		this.quality.checkDate = time1;
	},
	 onItemClick(){
		for (let i=0,len=this.checkResults.length; i<len; i++) {
			var status =this.checkResults[i].checkStatus;
			if(status=="2"){
				this.createImproveBtn = true;
				this.checkStatus=3;
				return;
			}else if(status==1){
				this.checkStatus=1;
				
			}
			
		}
		if(this.checkStatus!="1"){
			this.checkStatus=0;
		}
		this.createImproveBtn = false;

	 },
	 showNature(data){
		this.quality.checkNature = data.proTags;
	 },
	 addCheckResult(){
		var item = {
			content:'',
			checkStatus:'',
			attachmentModel: {
				title: '上传附件',
				xtype:"fujian",
				fileList: [],
				deleteFilesList: []
			}
		}
		this.checkResults.push(item);
	 },
	 selectProj(){
		 this.quality.selectProjVisible=true;
	 },
	 selectProjCallback(data){
		this.quality.project = data.projName;
		this.quality.proUid = data.id;
	 },
	 checkValid() {
		if(this.quality.proUid==null||this.quality.proUid==""){
			this.util.alert("请选择项目！");
			return false;
		}
		
		if(this.checkerModel.users.length==0){
			this.util.alert("请选择检查人！");
			return false;
		}
		if(this.quality.checkItem==null||this.quality.checkItem==""){
			this.util.alert("请输入检查项！");
			return false;
		}
		for (let i=0,len=this.checkResults.length; i<len; i++) {
			if(!this.util.isNotEmpty(this.checkResults[i].checkStatus)){
				this.util.alert("第"+(i+1)+"条检查请选择检查结果!");
				return false;
			}
			
		}
		return true;
	},
	 getMainFormData() {
		//主表
		var mainData = {project:this.quality.project,PROJ_UID_:this.quality.proUid,CHECK_DATE_:this.quality.checkDate,CHECK_ITEM_: this.quality.checkItem,
			CHECKER_UID_:this.checkerModel.users.id,CHECKER_NAME_:this.checkerModel.users.userName,
			CHECK_NATURE_:this.quality.checkNature,CHECK_STATUS_:this.checkStatus};
		return mainData;
	},
	getSubFormData(){
		var subForm = { subFormId: 'subForm1', subFormForeignKey: 'CHECK_UID_', subFormTable: 'T_QUALITY_CHECK_RESULT' };
		var userSubForm ={subFormId: 'subForm2',subFormForeignKey:"CHECK_UID_",subFormTable:"T_QUALITY_CHECK_USER"};
		var subFormArr = new Array();
		for (let i=0,len=this.checkResults.length; i<len; i++) {
			//遍历附件
			var filesData = new Array();
			for (var j in this.checkResults[i].attachmentModel.fileList) {
				var file = this.checkResults[i].attachmentModel.fileList[j];
				if (file.isNewFlag) {
					filesData.push(file);
				}
			}
			var item = {
				 id: this.validUtil.isNotEmpty(this.checkResults[i].id)? this.checkResults[i].id:null,
				 CONTENT_: this.checkResults[i].content,
				 CHECK_STATUS_: this.checkResults[i].checkStatus,
				 filesData : filesData,
				 deleteFilesData: _this.checkResults[i].attachmentModel.deleteFilesList.join(",")
			 }
			 subFormArr.push(item);
		}
		subForm['data'] = JSON.stringify(subFormArr);
		var sendMsgUsers=[]; //发送消息人集合
		//检查人
		var improverData =[];
		for (let i=0,len=this.checkerModel.users.length; i<len; i++) {
			var item = {
				USER_NAME_: this.checkerModel.users[i].userName,
				USER_UID_: this.checkerModel.users[i].id,
				TYPE_:0
			}
			sendMsgUsers.push(this.checkerModel.users[i].id);
			improverData.push(item);
		}
		//通知人
		for (let i=0,len=this.notifierModel.users.length; i<len; i++) {
			var item = {
				USER_NAME_: this.notifierModel.users[i].userName,
				USER_UID_: this.notifierModel.users[i].id,
				TYPE_:1
			}
			sendMsgUsers.push(this.notifierModel.users[i].id);
			improverData.push(item);
		}
		userSubForm['data'] = JSON.stringify(improverData);
		var subFormData = new Array();
		subFormData.push(subForm);
		subFormData.push(userSubForm);
		var result={subFormData:subFormData,sendMsgUsers:sendMsgUsers};
		return result;
	},
	 saveData(status){
		 if(!this.checkValid()){
			 return;
		 }
		 var _this=this;
		 var mainData = this.getMainFormData();
		 var subResult = this.getSubFormData();
		
		if(status==1){
			this.util.mask('正在生成整改单...');
		}else{
			this.util.mask('正在保存...');
		}
		
		var params = { sqlTableName: "T_QUALITY_CHECK", mainFormData: JSON.stringify(mainData), subFormData: JSON.stringify(subResult.subFormData) };
		if (!this.isNewFlag) {
			params['id'] = this.id;
			params['businessKey'] = this.id;
		}
		
		this.util.post("/admin/appDefaultFormAction!saveData.action",params,function(result){
			if(result.success){
				_this.sendMsg(subResult.sendMsgUsers.join(","),result.msg,"checkBillShow");
				_this.util.unmask();
				if(status==1){
					
					_this.$router.push({name:'addImproveBill',query:{checkId:result.msg}});
				}else{
					_this.util.setTemp(_this,"loadCheckBillList"+Math.random().toString(36).substr(2));
					history.back();
				}
				
			}else{
				if(status!=1){
					_this.util.unmask();
				}
				_this.util.alert(result.msg);
			}
		});

	},
	sendMsg(sendMsgUsersIds,businessId,state){
		var _this=this;
		var param = {
				operateType:'sendQualityMsg',
				title:"["+this.quality.project+"]质量检查通知",
				description:this.userName+"的质量检查已经通知给您，点击查看",
				sendMsgUsers:sendMsgUsersIds,
				businessId:businessId,
				state:state
		};
		this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
			if (res.status != 200) {
				_this.util.alert("发送消息失败");
			}
			
			
		});
	},
	 selectChecker(){
		this.checkerModel.visible=true;
	 },
	 selectInformUser(){
		this.notifierModel.visible=true;
	 },
	 uploadFile(resultItem,localIds,index){
		this.util.mask("正在上传第"+index+"张图片");
		var _this=this;
		var localId = localIds.pop();
		this.wx.uploadImage({
			localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
			isShowProgressTips: 0,// 默认为1，显示进度提示
			success: function (res) {
				var serverId = res.serverId; // 返回图片的服务器端ID
				_this.util.post("/attachment/downloadTempFromWeChat",{serverId:serverId,xtype:"qualityCheck"},function(res){
					var item = res.data;
					_this.util.unmask()
			 		resultItem.imgs.push(item);
					index++;
					if(localIds.length > 0){
						_this.uploadFile(resultItem,localIds,index);
					}
				});
					
			}
		});
	 },
	  remove(list,img,$event){
	  	list.imgs=list.imgs.filter((item) => {
	  		return item!=img;
	  	});
	  },
	 addImg(resultItem) {			 
		 var _this=this;
		  this.wx.chooseImage({
				count: 9, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function (res) {
					 var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					_this.uploadFile(resultItem,localIds,1);
					 
				}
			});	
	  		
	 },
	 delImg(result) {
		 result.deleteImg = !result.deleteImg;
	 },		   
   	 selectNature(){
		this.natureObj.tagsVisible = true;
	 }

   }
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
    padding-right: 24px;
    line-height: 48px;
}
.checkResult-span{
	position: absolute;
	right:14px;
	top:0;
}
.top ,.middle{
	text-align: left;
}
.demo5-item {
  width: 94px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
}
.demo5-item-selected {
  background: #ffffff url(../../assets/demo/checker/active.png) no-repeat right bottom;
  border-color: #ff4a00;
}
#conductor ,.conductorPerson{
	padding:5px 10px;
}
.conductorPerson {
	height: 1.5rem;
	line-height: 1.2rem;
	p {
		margin: 0;
	}
}
#person>li{
	float: left;
}
#person {
	height: 3rem;
	// padding: 5px;
	li {
		float:left;
		
	}
	
}
//金额    生产日期
.price{
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
	 // border-bottom: 1px solid #ccc;
}
.price input{
    height: 40px;
    padding-top: 10px;
    text-align: right;
}
.price>span {
	padding: 0 10px;
}
.block {
	text-align: right;
}
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
	border-top: 1px solid #eee;
	padding: 10px 0 0 0;
	height: 100%;
	.load {
		height: 100%;
		border-bottom: 1px solid #ccc;
		margin-top: 30px;
		padding:  5px 15px;
		#imgsLoad {
			height: 2rem;
			li {
				float:left;
				
			}
		}
	}
}
//foot
.foot {
	height:49px;
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
.checkResult {
	height:100%;
	line-height: 48px;
	position: relative;
	p {
		margin: 0;
		padding: 0 0 0 10px;
		background: #eee;
		border-bottom: 1px solid #ccc;
		
	}
	.footColor {
		color: #000;
		font-weight: bold;
	}
}
.footer {
	height: 2.2rem;
	// padding-top: 10px;
	background: #eee;
	line-height: 42px;
}
.movebx .mint-cell:nth-child(5) .mint-cell-title,.movebx .mint-cell:nth-child(1) .mint-cell-title{
	position: relative;
}
.movebx .mint-cell:nth-child(5) .mint-cell-title::after,.movebx .mint-cell:nth-child(1) .mint-cell-title::after{
	content: '*';
	position: absolute;
	left: 42px;
	bottom: 0;
	color: #f00;
}
.movebx .mint-cell:nth-child(1) .mint-cell-title::after{
	left: 28px;
}
</style>
<style>

</style>
