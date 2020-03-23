<template>
  <div class="headStyle">
	  	<div class="middle">
			<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd"><span>所属项目</span></div>
				<div class="weui-cell__bd myCell-bd" @click="selectProj()">
					<span>{{safety.project.length<23? safety.project:safety.project.substring(0,23)+'...'}}</span>
				</div>
			</div>
	  		<div class="weui-cell weui-cell_select myCell">
				<div class="weui-cell__hd"><span>性质</span></div>
				<div class="weui-cell__bd myCell-bd" @click="selectNature()">
					<span>{{safety.checkNature.length>21? safety.checkNature.substring(0,21)+'...':safety.checkNature}}</span>
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
				<datetime title="" class="col-xs-9 no-line"  v-model="safety.checkDate" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
			</div>
			
			<div style="height:48px;line-height:48px;padding-left:10px;border-bottom: 1px solid #eee;background:#eee">
				<span>检查项</span>
			</div>
			<div id="price" style="text-align:left;">
				<x-textarea :max="100" style="width: 100%;" v-model="safety.checkItem" placeholder="请输入检查项" ref="content"></x-textarea>
			</div>
			
			<!--复制模板-->
			 <div v-for="(resultItem,key) in checkResults"> 
				 <div class="checkResult" style="padding-top:0;">
					<p>检查结果{{key+1}}</p>
					<span style="color:#f00;" class="checkResult-span" @click.stop="deleteResult(resultItem)">-删除</span>
				</div>
				<div style="text-align:left;">
					<x-textarea :max="500" style="width: 100%;" v-model="resultItem.content" :placeholder="(key+1)+'.请输入检查结果..'" ref="content"></x-textarea>
				</div>
				<Attachment :model="resultItem.attachmentModel" ref="imgsFile" style="border-top: 1px solid #eee;"></Attachment>
				<div style="margin-top: 5px;padding: 6px 0 10px 10px;">
					<checker @on-change="onItemClick" v-model="resultItem.checkStatus" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
						<checker-item v-for="(item,i) in tabDatas" :key="i" :value="item.value">{{item.name}}</checker-item>
					</checker>
				</div>
					 
			</div>
			 
		
	  	</div>
		<!--选择检查人-->
		<mt-popup v-model="checkerModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="checkerModel" ref="profile" ></SelectUser>
		</mt-popup>
		<!--选择通知人-->
		<mt-popup v-model="notifierModel.visible" position="right"	popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="notifierModel" ref="notifierfile" ></SelectUser>
		</mt-popup>
	  	<!--选择项目-->
		<mt-popup v-model="safety.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectProj :mess="safety" @selectProjCallback="selectProjCallback($event)"></SelectProj>
		</mt-popup> 
		
		<!--选择性质-->
		<mt-popup v-model="natureObj.tagsVisible" position="right"	popup-transition="popup-fade" style="width:100%;height:100%">
		<SelectNature :tags="natureObj" @chooseTags="showNature($event)"></SelectNature>
	</mt-popup>
  	<div class="foot" style="padding-top:0;">
  		<p @click="addCheckResult"> + 添加检查结果</p>
  	</div>
	<template>
		<div class="conductor">
			<div class="container">
				<div :style="left" class="row">
					<div :style="background" class="conductorPerson">
						<p class="lf">通知人</p>
					</div>
					<ul id="person">
						<li>
							<ul>
								<li style="margin:5px 5px;position:relative;" v-for="notifier in notifierModel.users"><img style="width:40px;height:40px;" :src="notifier.picture" alt=""><p style="margin:0;">{{notifier.userName.substring(0,3)}}</p>
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
  </template>

   	<div class="footer">
  		<p>
			<x-button @click.native="saveData()" mini style="width:48%;height: 45px;" type="primary">保存</x-button>
			<x-button v-if="createImproveBtn" @click.native="saveImprove()" mini style="width:48%;height: 45px;background: #336699;" type="primary">生成整改单</x-button>
  		
		</p>
  	</div>
	  
  </div>
</template>

<script>
import SelectProj from '../common/SelectProj.vue'
import SelectNature from '../quality/SelectNature.vue'
import SelectUser from '../common/SelectUser.vue'
import Attachment from '../common/Attachment.vue'
import { cookieUtil } from '@/utils/utils.js';
import {mapState,mapGetters, mapActions} from 'vuex'
import { Checker, CheckerItem,Datetime,XButton,XTextarea} from 'vux'
export default {
    name: 'movebx',
    data () {
	    return {
			tabDatas:[{name:'通过',value:'0'},{name:'口头警告',value:'1'},{name:'书面整改',value:'2'}],
			conductorLoad:'',  //是否加载上次
			left: {textAlign:'left'},
    		background: {background:'#eee'},
			createImproveBtn: false,   //是否生成整改单
			checkers:[],
			safety: {
				project:'',
				proUid:'',
				checkNature:'',
				checkDate:new Date().format("yyyy-MM-dd"),
				checker:'',
				checkItem:'',
				selectProjVisible:false
			},
			checkStatus:'',
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
			natureObj: {
				tagsVisible:false
			},
	    	checkResults: [
				{
					content:'',
					imgs:[],
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
			delUserStyle:false   //删除用户
			
	    }
    },
	components:{
      Checker, CheckerItem,SelectNature,SelectUser,Attachment,Datetime,SelectProj,XButton,XTextarea
	},
    computed: {
		...mapState({
			   userName: state => state.userName,
			   userUid: state => state.userUid
		   })
			
    },
  created(){
		this.util.initWxJsSdk(this);
		this.checkerModel.userName=this.userName;
		this.checkerModel.userUid=this.userUid;
		this.checkerModel.users = [{userName:this.userName,id:this.userUid}];
  },
  activated() {
		this.safety={project:'',proUid:'',checkNature:'',
				checkDate:new Date().format("yyyy-MM-dd"),
				checker:'',checkItem:'',selectProjVisible:false};
		this.createImproveBtn=false;
		this.checkResults=[{content:'',imgs:[],checkStatus:'',attachmentModel: {
						title: '上传附件',
						xtype:'fujian',
						fileList: [],
						deleteFilesList: []
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
					operateType:'getSafetyBillDataByid',
					id:this.id
				};
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
					_this.util.unmask();
					if (res.status == 200) {
						_this.safety={
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
								// console.debug("res.data.subFormData[i].id==="+res.data.subFormData[i].id);
								res.data.subFormData[i].attachmentModel={
									id : res.data.subFormData[i].id,
									xtype:"fujian",
									title: '上传附件',
									fileList: _this.loadImgs(res.data.subFormData[i].id),
									deleteFilesList: []
								};
							}
							_this.checkResults = res.data.subFormData;
							// console.debug(_this.$refs.imgsFile);
							// for(var i=0;i<_this.checkResults.length;i++){
							// 	_this.checkResults[i].attachmentModel.id= res.data.subFormData[i].id;
							// 	_this.$refs.imgsFile[i].loadData(_this.checkResults[i].attachmentModel.id)
							// }
							
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
		this.util.confirm("确定删除该检查结果？",function(){
			_this.checkResults=_this.checkResults.filter((item) => {
				return item!=resultItem;
			});
			_this.onItemClick();
		});
		
	},	
	onItemClick(){
		for (let i=0,len=this.checkResults.length; i<len; i++) {
			var status =this.checkResults[i].checkStatus;
			if(status=="2"){
				this.createImproveBtn = true;
				this.checkStatus=3;
				return;
			}else if(status=="1"){
				this.checkStatus=1;
				
			}
		}
		if(this.checkStatus!=1){
			this.checkStatus=0;
		}
		this.createImproveBtn = false;
	 },
	 showNature(data){
		this.safety.checkNature = data.proTags;
	 },
	 addCheckResult(){
		var item = {
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
		this.checkResults.push(item);
	 },
	 selectProj(){
		 this.safety.selectProjVisible=true;
	 },
	 selectProjCallback(data){
		this.safety.project = data.projName;
		this.safety.proUid = data.id;

	 },
	 checkValid() {
		if(this.safety.proUid==null||this.safety.proUid==""){
			this.util.alert("请选择项目！");
			return;
		}
		if(this.checkerModel.users.length==0){
			this.util.alert("请选择检查人！");
			return;
		}
		if(this.safety.checkItem==""){
			this.util.alert("请输入检查项！");
			return;
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
		var mainData = {project:this.safety.project,PROJ_UID_:this.safety.proUid,CHECK_DATE_:this.safety.checkDate,CHECK_ITEM_: this.safety.checkItem,
		CHECK_NATURE_:this.safety.checkNature,CHECK_STATUS_:this.checkStatus};
		return mainData;
	},
	getSubFormData(){
		var subForm = { subFormId: 'subForm1', subFormForeignKey: 'CHECK_UID_', subFormTable: 'T_SAFETY_CHECK_RESULT' };
		var userSubForm ={subFormId: 'subForm2',subFormForeignKey:"CHECK_UID_",subFormTable:"T_SAFETY_CHECK_USER"};
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
		//return subFormData;
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
		var params = { sqlTableName: "T_SAFETY_CHECK", mainFormData: JSON.stringify(mainData), subFormData: JSON.stringify(subResult.subFormData) };
		if (!this.isNewFlag) {
			params['id'] = this.id;
			params['businessKey'] = this.id;
		}
		this.util.post("/admin/appDefaultFormAction!saveData.action",params,function(result){
				if(result.success){
					_this.sendMsg(subResult.sendMsgUsers.join(","),result.msg,"safetyCheckBillShow");
					if(status==1){
						_this.util.unmask();
						_this.$router.push({name:'addSafetyImproveBill',query:{checkId:result.msg}});
					}else{
						_this.util.unmask();
						_this.util.setTemp(_this,"loadSafetyBillList"+Math.random().toString(36).substr(2));
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
				title:"["+this.safety.project+"]安全检查通知",
				description:this.userName+"的安全检查已经通知给您，点击查看",
				sendMsgUsers:sendMsgUsersIds,
				businessId:businessId,
				state:state
		};
		this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
			if (res.status != 200) {
				_this.util.failueToast("发送消息失败");
			}
			
			
		});
	},
	saveImprove(){   //生成整改单
		
		this.saveData(1);
		
	},
	 selectChecker(){
		this.checkerModel.visible=true
		// this.$refs.profile.postMsg({singer:true,radioCheckedArr:[]})
	 },
	 selectInformUser(){
		this.notifierModel.visible=true;
	 },
	 delPerson() {
		this.delUserStyle = !this.delUserStyle;
	},
	removeUser(notifier,$event){
		this.notifierModel.users=this.notifierModel.users.filter((item) => {
	  		return item!=notifier;
	  	});
	},
	 selectNature(){
		this.natureObj.tagsVisible = true;
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
    padding-right: 23px;
    line-height: 48px;
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
.price{
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
}
.price input{
    height: 40px;
    padding-top: 10px;
    text-align: right;
}
.price>span{
	padding: 0 10px;
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
	padding-top: 10px;
	background: #eee;
	line-height: 42px;
}
.checkResult-span{
	position: absolute;
	right:14px;
	top:0;
}

</style>
