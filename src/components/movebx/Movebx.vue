<template>
  <div id="mainForm" class="page headStyle">	
	<div class="weui-cell weui-cell_select myCell" style="padding:10px 15px;">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-th-list"></i></div>
		<div class="weui-cell__hd">
			<span>项目名称</span>
		</div>
		<div class="weui-cell__bd myCell-bd" @click="selectProj()">
			<span>{{selectProjModel.projName.length>18? (selectProjModel.projName.substring(0,18)+'...'):selectProjModel.projName}}</span>
		</div>
	</div>
	<div class="weui-cell myCell">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-user"></i></div>
		<div class="weui-cell__hd"><span>报销人</span></div>
		<div class="weui-cell__bd" >
			<span>{{jbr}}</span>
		</div>
	</div>
	<div class="weui-cell myCell">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-calendar"></i></div>
		<div class="weui-cell__hd">
			<span>报销日期</span>
		</div>
		<div class="weui-cell__bd">
			<datetime title="" class="col-xs-12 be-check no-line" v-model="fsrq" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
		</div>
	</div>
	<div class="weui-cell myCell">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-pushpin"></i></div>
		<div class="weui-cell__hd"><span>报销事由</span></div>
		<div class="weui-cell__bd" >
			<input type="text" v-model="bxReason" class="inputStyle" placeholder="请输入事由">
		</div>
	</div>
	<div class="weui-cell myCell">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-yen"></i></div>
		<div class="weui-cell__hd">
			<span>申报总金额￥</span>
		</div>
		<div class="weui-cell__bd">{{total}}<span style="color:#663333">({{index}}条明细)</span></div>
	</div>
	<div class="weui-cell myCell">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-xbt"></i></div>
		<div class="weui-cell__hd">
			<span>核销金额￥</span>
		</div>
		<div class="weui-cell__bd" >
					<input class="weui-input" v-model="chargeOff" :readonly="isReadOnly" onkeyup="value=value.replace(/[^\d]/g,'') " style="text-align: right;" type="number" placeholder="0.0"/>
		</div>
	</div>
	<div class="weui-cell weui-cell_select myCell" style="padding:10px 15px;">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-th-list"></i></div>
		<div class="weui-cell__hd">
			<span>账户名称</span>
		</div>
		<div class="weui-cell__bd myCell-bd" @click="selectProj()">
			<span>{{selectProjModel.projName.length>18? (selectProjModel.projName.substring(0,18)+'...'):selectProjModel.projName}}</span>
		</div>
	</div>
	
	<div class="weui-cell myCell">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-credit-card"></i></div>
		<div class="weui-cell__hd">
			<span>账户</span>
		</div>
		<div class="weui-cell__bd">{{account}}</div>
	</div>
	<!-- 复制模块 -->
  	<template v-for="(list,key) in lists" >

  		<div @click="show(list)" v-if="!list.see" class="unpop" style="margin: 5px 5px 5px 5px;background:#eee;">
	  			<span class="col-xs-4" style="padding-left: 0px;padding-right: 0px;">报销明细{{key+1}}</span>
	  			<div class="daright col-xs-8" style="padding-left: 0px;">
	  				<span style="color:blue">{{list.abstract!=undefined&&list.abstract.length>10? list.abstract.substring(0,10)+'..':list.abstract}}</span>
	  				<span style="margin-right:20px;color:#f00;">￥ {{list.price<1000000? list.price:(list.price/100000).toFixed(2)+'万'}}</span>
	  				<i class="glyphicon glyphicon-chevron-down"></i>
	  			</div>
		</div>
	  	<div v-if="list.see" class="middle" style="margin: 5px 5px 5px 5px;border: 1px solid #ccc;background:#fff;" >
	  		<div class="pop" >
	  			<span class="col-xs-4" style="padding-right: 0px;">报销明细{{key+1}}:</span>
	  			<div @click.stop="show(list)" class="daright col-xs-8">
	  			<span v-if="!isReadOnly" style="color:#f00;" @click.stop="delet(list)">-删除</span>&nbsp;&nbsp;<span v-if="!isReadOnly" style="color:blue;margin:0 10px;" @click.stop="add(list)">+复制</span>
	  			<i class="glyphicon glyphicon-chevron-up"></i>
	  			</div>
	  		</div>
			<div class="price">
				<span class="col-xs-4">摘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;要</span>
				<input v-model="list.abstract" class="col-xs-8" :readonly="isReadOnly"  type="text" placeholder="请输入摘要" name="">
			</div>
			<div class="weui-cell weui-cell_select myCell" style="width: 100%;">
				<div class="weui-cell__hd">
					<span>费用名称</span>
				</div>
				<div class="weui-cell__bd myCell-bd" @click="isReadOnly? '':selectCost(list)">
					<span>{{list.cbmc}}</span>
				</div>
			</div>
			<!-- <div class="price no-bg" style="text-align:left;">
				<mt-cell @click.native="isReadOnly? '':selectCost(list)" title="费用名称" is-link>
					<span>{{list.cbmc}}</span>
				</mt-cell>
			</div> -->
			<!-- <div class="weui-cell myCell" style="padding-left:10px;">
				<div class="weui-cell__hd"><span>数量</span></div>
				<div class="weui-cell__bd" >
					<input class="weui-input" v-model="list.sl" @change="calculateTotal(list)"  :readonly="isReadOnly" onkeyup="value=value.replace(/[^\d]/g,'') " style="text-align: right;" type="number" placeholder="0.0"/>
				</div>
			</div> -->
			<div class="weui-cell detailsIn">
				
				<div class="weui-cell__hd">
					<span>开始时间</span>
				</div>
				<div class="weui-cell__bd">
					<datetime title="" class="col-xs-12 be-check no-line" v-model="startDate" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
				</div>
			</div>
			<div class="weui-cell detailsIn">
				
				<div class="weui-cell__hd">
					<span>结束时间</span>
				</div>
				<div class="weui-cell__bd">
					<datetime title="" class="col-xs-12 be-check no-line" v-model="endDate" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
				</div>
			</div>
			<div class="weui-cell cell_bottom myCell" style="padding-left:15px;">
				<div class="weui-cell__hd"><span>申报金额<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd" >
					<input class="weui-input" v-model="list.price" :readonly="isReadOnly" onkeyup="value=value.replace(/[^\d]/g,'') " style="text-align: right;" type="number" placeholder="0.0"/>
				</div>
			</div>
	        <!-- <div class="date" style="border-bottom: 1px solid #eee;">
				<span class="col-xs-4">发生日期</span>
				<datetime title="" class="col-xs-8 be-check" :readonly="isReadOnly" v-model="list.happenDate" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
				
			</div> -->
			<div style="height:48px;line-height:48px;padding-left:15px;border-bottom: 1px solid #eee;">
				<span>明细备注</span>
			</div>
			<div id="price" style="text-align:left;">
				<x-textarea :readonly="isReadOnly" :max="100" style="width: 100%;" v-model="list.introduction" placeholder="请输入备注(限100字)" ref="content"></x-textarea>
			</div>
			<!-- <mt-field label="" :readonly="isReadOnly"  style="width:100%" placeholder="请输入备注(限100字)" type="textarea" rows="4" v-model="list.introduction"></mt-field> -->
			<div class="button-sp-area">
				<a href="javascript:;" @click="submitExpenseCost()" class="weui-btn weui-btn_mini weui-btn_warn">按钮</a>
			</div>
	  	</div>
		
		<mt-popup v-model="list.popupVisible1" position="right"	popup-transition="popup-fade" style="width:100%;height:100%">
			<ChooseCost :msg="list" @chooseMsg="chooseChild1(list,$event)"></ChooseCost>
		</mt-popup>
		 
  	</template>
  	<div class="foot" style="padding-top:0;">
  		<p v-if="!isReadOnly" @click="add_a"> + 添加明细</p>
  	</div>
	
	<Attachment :model="attachmentModel" style="background:#fff;padding-top: 1px;"></Attachment>    
	<ProcessForm :model="processModel" ref="process" style="background:#fff;"></ProcessForm>

	<!--选择项目-->
	<mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
		<SelectProj :mess="selectProjModel" ref="projfile" ></SelectProj>
	</mt-popup>  
  </div>
</template>

<script>
import { Datetime,XTextarea } from 'vux'
import {mapState,mapGetters, mapActions} from 'vuex'
import ChooseCost from './ChooseCost.vue'
import SelectProj from '../common/SelectProj.vue'
import ProcessForm from '../common/ProcessForm.vue'
import Attachment from '../common/Attachment.vue'
export default {
    name: 'movebx',
    data () {
	    return {
			Id:null,
			agentId: 2,
			jbr:'',
			startDate:new Date().format("yyyy-MM-dd"),
			endDate:new Date().format("yyyy-MM-dd"),
			chargeOff:0,
			accountName:'',
			account:'',
			bxReason:'',
			currentActId:'',
			fsrq: new Date().format("yyyy-MM-dd"),
			formKey: 'expense',
			modelName: '移动报销',
			sqlTableName: 'G005_ys_bsd_sb',
			symbol:'sn,XMSB',
			formId:"DForm_XM001_ys_bsd_sb",
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
			selectProjModel:{
				selectProjVisible:false,
				projName:'选择项目',
				projUid:''
			},
			selectAccount:{
				selectProjVisible:false,
				projName:'选择账户',
				projUid:''
			},
			attachmentModel: {
				title: '附件',
				xtype:'fujian1',
				fileList: [],
				deleteFilesList: []
			},
			isReadOnly: false,//是否只读
			id:'',
			isNewFlag:false,
			isNewData:''
	    }
	},
	components:{
      // 名字
      SelectProj,ChooseCost,ProcessForm,Datetime,Attachment,XTextarea
    },
    computed: {
		...mapState({
		   	lists: state => state.lists,
			userUid: state => state.userUid,
			userName: state => state.userName,
			webUrl: state => state.webUrl,
		   	index: state => state.index
		   }),
		...mapGetters([
		   	'total'
		   ]) 
			
    },
  created(){
		  //this.Id=this.$router.params.Id;
		//console.log(""this.$router)
		this.util.initWxJsSdk(this);
		// this.mainData.expense_title_=this.userName+"_"+new Date().format("yyyy年MM月")+"报销";
  },
  activated() {
	  	this.jbr=this.userName;
	  	this.isNewData = this.util.getUrlParam("isNewData");
	  	this.id = this.util.getUrlParam("id");
		// this.util.initUrlParam(this.mainData);
		// this.id = this.mainData.id;
		this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;
		this.loadData();
		this.processModel.parent = this;
		// this.isReadOnly = this.mainData.isReadOnly;
		
		this.$store.state.lists =[{
			introduction: '',
	 		price: 0.0,
	 		cbmc: '选择科目',
			sl: 0,
			dj: 0,
	 		see: true,
	    	popupVisible1: false,
	    	happenDate: new Date().format("yyyy-MM-dd")	    	
		}];
	},
    methods: {
	   	...mapActions([
	     	'add',
	     	'delet',
	     	'show',
			'add_a',
	     	'xzkm'
	   	    ]),
	 selectProj(){
		 this.selectProjModel.selectProjVisible = true;
		
	 },
	 selectCost(list){
		 list.popupVisible1=true;
	 },
	 chooseChild1(list,data,$event) {
			list.cbmc = data.cbmc;
			list.cblx = data.cblx;
			list.code = data.code;
	 },
	 calculateTotal(list){
		 list.price = list.sl*list.dj;
	 },
	 loadData() {

		var _this = this;
	
		if (!this.isNewFlag) {
			var param = {
					operateType:'getExpenseInfoById',
					id: this.id
			};
			_this.util.mask("正在加载...");
			this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_MoveBx&appId=WeChat', param, function (res) {
				if (res != undefined && res.status == 200) {
					if (res != undefined && res.data != undefined) {
						
						_this.selectProjModel.projName = res.data.xmmc;
						_this.selectProjModel.projUid = res.data.xmid;
						_this.jbr = res.data.jbr;
						_this.fsrq = res.data.fsrq;
						// _this.total = res.data.totalamount;

						if (res.data['subFormData'] != undefined) {
							for (var i=0; i<res.data['subFormData'].length;i++) {
								
								res.data['subFormData'][i].see=true;
								res.data['subFormData'][i].price=res.data['subFormData'][i].je;
							}
							_this.$store.state.lists = res.data['subFormData'];
							
						}
						
					}
				}
				_this.util.unmask();
			});
		}
	},
	 checkValid() {
		 if (!this.validUtil.isNotEmpty(this.selectProjModel.projUid)) {
			this.util.alert('请选择项目！');
			return false;
		}
		for (let i=0,len=this.lists.length; i<len; i++) {
			if (this.lists[i].cbmc=="选择科目"||!this.validUtil.isNotEmpty(this.lists[i].cbmc)) {
				this.util.alert('第'+(i+1)+'条明细请选择科目');
				return false;
			
			}else if (this.lists[i].price==0||this.lists[i].price==null) {
				this.util.failueToast('第'+(i+1)+'条明细请输入申报金额');
				return false;
				
			}else if (this.lists[i].introduction==""||this.lists[i].introduction==null) {
				this.util.failueToast('第'+(i+1)+'条明细请填写备注');
				return false;
				
			}
			
		}
		return true;
	},
	getMainFormData() {
		var mainData = {
			Subject: this.selectProjModel.projName+"项目费用申报", XMMC: this.selectProjModel.projName, xmid: this.selectProjModel.projUid, fsrq: this.fsrq, jbr: this.jbr,
			totalamount: this.total,bz: ""
		};
		return mainData;
	},
	getSubFormData(){
		var subForm = { subFormId: 'subForm1', subFormForeignKey: 'pid', subFormTable: 'G005_ys_bsd_sbdet' };
		
		var subFormArr = new Array();
		for (let i=0,len=this.lists.length; i<len; i++) {
			var item = {
				 cbmc: this.lists[i].cbmc,
				 abstract: this.lists[i].abstract,
				 cblx: this.lists[i].cblx,
				 sl: this.lists[i].sl,
				 dj: this.lists[i].dj,
				 je: this.lists[i].price,
				 bz : this.lists[i].introduction,
				 code : this.lists[i].code,
				 sortid: i
			 }
			 subFormArr.push(item);
		}
		
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
	},	   
   	getData(){
		var _this = this;
		var mainData = this.getMainFormData();
		var subFormData = this.getSubFormData();
		var filesData = this.getFileData();
		var params = { sqlTableName: this.sqlTableName, mainFormData: JSON.stringify(mainData), subFormData: JSON.stringify(subFormData), filesData: JSON.stringify(filesData), deleteFilesData: _this.attachmentModel.deleteFilesList.join(",") };
		if (!this.isNewFlag) {
			params['id'] = this.id;
			params['businessKey'] = this.id;
		}
		params['subject'] = "[" + this.selectProjModel.projName+ "]项目费用申报";
		params['symbol'] = this.symbol;
		params['formId'] = this.formId;
		return params;
	},
	cancelCallback(){
		if(this.validUtil.isNotEmpty(this.id)||this.isNewData){
			history.back();
		}else{
			WeixinJSBridge.call('closeWindow');
		}
		
	},
	submitExpenseCost(){
	/*	var newParam={
			appId:"U012",
			deleteFilesData:"",
			filesData:"[]",
			formId:"DForm_U012_Expense_Account",
			id:"",
			mainFormData:'{"sn":"","Subject":"","fsrq":"2018-02-27","czy":"李全","projectName":"邀请招标0226","xmid":"6a8f3dbd-3825-48ca-bc01-a5e6fa6e835c","projectNumber":"HNZT/XM-2018-010","applyUserName":"李全","applyUserId":"lq","applyDepartName":"广州建软","applyDepartUid":"05c027bf-5944-4ef7-ac28-8f6654d5845e","applyDate":"2018-02-27","applyTotalMoney":"500.00","upCaseTotalMoney":"伍佰元整","checkApplyMoney":"500","checkTotalApplyMoney":"0","realGiveMoney":"0.00","accountName":"广州建软收款账户","accountId":"cc10b1cf-9a30-4cf7-97b4-136444db0c58","account":"6220 2517 3418 5569","loanDepartUid":"","accountType":"现金","Remark":"出差住宿","_form_category_":""}',
			sqlTableName:"U012_Expense_Account",
			subFormData:'[{"subFormId":"subForm1","subFormTable":"U012_Expense_Accountdet","subFormForeignKey":"pid","sort":0,"isRead":false,"isHidden":false,"buttons":[],"pageSize":0,"data":"[{\"costName\":\"住宿费\",\"costSubjectId\":\"002\",\"startDate\":\"2018-02-25\",\"endDate\":\"2018-02-26\",\"abstract\":\"住宿\",\"applyMoney\":500,\"Remark\":\"\",\"sort\":1,\"sortid\":1}]"}]',
			symbol:"sn,EABX"
		} ;
		var params2={

				mainFormData:
					{
						"sn":"",
						"Subject":"",
						"fsrq":"2018-02-27",
						"czy":"李全",
						"projectName":"邀请招标0226",
						"xmid":"6a8f3dbd-3825-48ca-bc01-a5e6fa6e835c",
						"projectNumber":"HNZT/XM-2018-010",
						"applyUserName":"李全",
						"applyUserId":"lq",
						"applyDepartName":"广州建软",
						"applyDepartUid":"05c027bf-5944-4ef7-ac28-8f6654d5845e",
						"applyDate":"2018-02-27",
						"applyTotalMoney":"300.00",
						"upCaseTotalMoney":"叁佰元整",
						"checkApplyMoney":"300",
						"checkTotalApplyMoney":"0",
						"realGiveMoney":"0.00",
						"accountName":"广州建软收款账户",
						"accountId":"cc10b1cf-9a30-4cf7-97b4-136444db0c58",
						"account":"6220 2517 3418 5569",
						"loanDepartUid":"",
						"accountType":"现金",
						"Remark":"出差费用。更改",
						"_form_category_":""},
				filesData:[],
				formId:"DForm_U012_Expense_Account",
				symbol:"sn,EABX",
				deleteFilesData:"",
				id:"",
				appId:"U012",
				subFormData:[{
								"subFormId":"subForm1",
								"subFormTable":"U012_Expense_Accountdet",
								"subFormForeignKey":"pid",
								"sort":0,
								"isRead":false,
								"isHidden":false,
								"buttons":[],
								"pageSize":0,
								"data":"[{\"costName\":\"交通费\",\"costSubjectId\":\"001\",\"startDate\":\"2018-02-25\",\"endDate\":\"2018-02-25\",\"abstract\":\"高铁\",\"applyMoney\":300,\"Remark\":\"\",\"sort\":1,\"sortid\":1}]"
							}],
				sqlTableName:"U012_Expense_Account"
			}

		this.util.post("/admin/appDefaultFormAction!saveData.action",params2,function(res){
			console.log(res)
		});
		*/
		
		this.$router.push('/MovebxQuerry')
	}
	
   }
}
</script>

<style lang="scss" scoped>

.inputStyle{
	width: 100%;
	text-align: right;
}
.glyphicon{
	line-height: 26px;
}
.detailsIn{
	padding: 0 15px;
}
.conductorPerson {
	height: 1.5rem;
	padding:5px 10px;
	line-height: 1.2rem;
	p {
		margin: 0;
	}
}
#person {
	height: 3rem;
	li {
		float:left;
	}
	
}
.middle{
	text-align: left;
}
.pop,{
	height: 48px;
	line-height: 48px;
}
//金额    生产日期
.unpop,.price ,.date{
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
	 // border-bottom: 1px solid #ccc;
}
.unpop .daright {
	text-align: right;
}
.pop {
	.daright {
		text-align: right;
	}
}
.price input{
    height: 40px;
    padding-top: 10px;
    text-align: right;
}
.price>span{
	padding: 0 15px;
}
.block {
	text-align: right;
}


//foot
.foot {
	height:50px;
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
	height: 2.2rem;
	padding-top: 10px;
	background: #eee;
	line-height: 42px;
}
.no-line.weui-cell:before {
	border: 0 none;
}
</style>

