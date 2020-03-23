<template>
  <div id="mainForm" class="page headStyle" style="background:#eee;">
  	 
	
	<!-- <div class="weui-cell weui-cell_select myCell" style="padding:10px 15px;">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-leaf"></i></div>
		<div class="weui-cell__hd">
			<span>所属项目</span>
		</div>
		<div class="weui-cell__bd myCell-bd" @click="selectProj()">
			<span>{{selectProjModel.projName.length>18? (selectProjModel.projName.substring(0,18)+'...'):selectProjModel.projName}}</span>
		</div>
	</div> -->
	<div class="weui-cell myCell">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-calendar"></i></div>
		<div class="weui-cell__hd">
			<span>申报日期</span>
		</div>
		<div class="weui-cell__bd">
			<datetime title="" class="col-xs-12 be-check no-line" v-model="sqrq" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
		</div>
	</div>
	<div class="weui-cell myCell">
		<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-user"></i></div>
		<div class="weui-cell__hd"><span>操作员</span></div>
		<div class="weui-cell__bd" >
			<span>{{czy}}</span>
		</div>
	</div>
	
	<!-- 复制模块 -->
  	<template v-for="(list,key) in lists" >
	  	<div class="middle" style="margin: 5px 5px 5px 5px;border: 1px solid #ccc;background:#fff;" >
			<div class="price">
				<span class="col-xs-4">员工编号</span>
				<input v-model="list.payeeno" class="col-xs-8" :readonly="isReadOnly"  type="text" placeholder="请输入摘要" name="">
			</div>
			<div class="price">
				<span class="col-xs-4">员工姓名</span>
				<input v-model="list.payeename" class="col-xs-8" readonly="true"  type="text" placeholder="请输入摘要" name="">
			</div>
			<div class="price">
				<span class="col-xs-4">加班日期</span>
				<!-- <input v-model="list.jbrq" class="col-xs-8" :readonly="isReadOnly"  type="text" placeholder="请输入摘要" name=""> -->
				<datetime title="" class="col-xs-8" v-model="list.jbrq" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
			</div>
			<div class="price">
				<span class="col-xs-4">加班项目</span>
				<input v-model="list.xmmc" class="col-xs-8" :readonly="isReadOnly"  type="text" placeholder="请填写项目" name="">
			</div>
			<div class="price">
				<span class="col-xs-4">加班原因</span>
				<input v-model="list.jbyy" class="col-xs-8" :readonly="isReadOnly"  type="text" placeholder="请输入加班原因" name="">
			</div>
			<div class="price">
				<span class="col-xs-4">加班地点</span>
				<input v-model="list.jbdd" class="col-xs-8" :readonly="isReadOnly"  type="text" placeholder="请输入加班地点" name="">
			</div>
			<div class="price">
				<span class="col-xs-4">加班开始时间</span>
				<datetime v-model="list.jbksrq" class="col-xs-8" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="datetime" :readonly="isReadOnly" format="HH:mm"></datetime>
			</div>
			<div class="price">
				<span class="col-xs-4">加班结束时间</span>
				<datetime v-model="list.jbjsrq" class="col-xs-8" style="padding:0px;padding-right:0px;height:100%;line-height:44px;" default-selected-value="datetime" :readonly="isReadOnly" format="HH:mm"></datetime>
			</div>
			<div class="price">
				<span class="col-xs-4">加班时长</span>
				<input v-model="list.jbsc" class="col-xs-8" :readonly="isReadOnly"  type="number" placeholder="" name="">
			</div>
			
	  	</div>
		 
  	</template>
  	<!-- <div class="foot" style="padding-top:0;">
  		<p v-if="!isReadOnly" @click="add_a"> + 添加明细</p>
  	</div> -->
	
	<Attachment :model="attachmentModel" style="background:#fff;padding-top: 1px;"></Attachment>    
	<ProcessForm :model="processModel" ref="process" style="background:#fff;"></ProcessForm>

	<!--选择项目-->
	<!-- <mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
		<SelectProj :mess="selectProjModel" ref="projfile" ></SelectProj>
	</mt-popup>   -->
  </div>
</template>

<script>
import { Datetime } from 'vux'
import {mapState,mapGetters, mapActions} from 'vuex'
import ChooseCost from '../movebx/ChooseCost.vue'
import SelectProj from '../common/SelectProj.vue'
import ProcessForm from '../common/ProcessForm.vue'
import Attachment from '../common/Attachment.vue'
export default {
    name: 'overTime',
    data () {
	    return {
			agentId: 2,
			czy:'',
			currentActId:'',
			sqrq: new Date().format("yyyy-MM-dd"),
			formKey: 'expense',
			modelName: '加班申请',
			sqlTableName: 'G001_rsgl_yg_jbsq',
			symbol:'sn,YGJBSQ',
			formId:"DForm_XM001_rsgl_yg_jbsq",
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
			attachmentModel: {
				title: '附件',
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
      SelectProj,ChooseCost,ProcessForm,Datetime,Attachment
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
		
		
		// this.mainData.expense_title_=this.userName+"_"+new Date().format("yyyy年MM月")+"报销";
  },
  activated() {
	  	this.czy=this.userName;
	  	this.isNewData = this.util.getUrlParam("isNewData");
	  	this.id = this.util.getUrlParam("id");
		// this.util.initUrlParam(this.mainData);
		// this.id = this.mainData.id;
		this.isNewFlag = (this.validUtil.isNotEmpty(this.id)) ? false : true;
		this.loadData();
		this.processModel.parent = this;
		// this.isReadOnly = this.mainData.isReadOnly;
		
		this.$store.state.lists =[{
			payeeno: this.sessionUtil.getUserId(),//员工编号
			payeename: this.userName,//员工名称
	 		jbrq: new Date().format("yyyy-MM-dd"),
	 		xmmc: '',
			jbyy: '',
			jbdd: '',
			jbksrq: new Date().format("hh:mm:ss"),
			jbjsrq: new Date().format("hh:mm:ss"),
			jbsc:'',//加班小时数
	 		see: true
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
	 loadData() {

		var _this = this;
	
		if (!this.isNewFlag) {
			var param = {
					operateType:'getOverTimeInfoById',
					id: this.id
			};
			_this.util.mask("正在加载...");
			this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_MoveBx&appId=WeChat', param, function (res) {
				if (res != undefined && res.status == 200) {
					if (res != undefined && res.data != undefined) {
						
						// _this.selectProjModel.projName = res.data.xmmc;
						// _this.selectProjModel.projUid = res.data.xmid;
						_this.czy = res.data.czy;
						_this.sqrq = res.data.sqrq;
						// _this.total = res.data.totalamount;

						if (res.data['subFormData'] != undefined) {
							for (var i=0; i<res.data['subFormData'].length;i++) {
								
								res.data['subFormData'][i].see=true;
								// res.data['subFormData'][i].price=res.data['subFormData'][i].je;
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
		for (let i=0,len=this.lists.length; i<len; i++) {
			if (!this.validUtil.isNotEmpty(this.lists[i].jbyy)) {
				this.util.alert('第'+(i+1)+'条请填写加班原因');
				return false;
			}
		}
		return true;
	},
	getMainFormData() {
		var mainData = {
			czy: this.czy, sqrq: this.sqrq
		};
		return mainData;
	},
	getSubFormData(){
		var subForm = { subFormId: 'subForm1', subFormForeignKey: 'pid', subFormTable: 'G001_rsgl_yg_jbsqdet' };
		
		var subFormArr = new Array();
		for (let i=0,len=this.lists.length; i<len; i++) {
			var item = {
				 payeeno: this.lists[i].payeeno,
				 payeename: this.lists[i].payeename,
				 jbrq: this.lists[i].jbrq,
				 xmmc: this.lists[i].xmmc,
				 jbyy: this.lists[i].jbyy,
				 jbdd: this.lists[i].jbdd,
				 jbksrq : this.lists[i].jbksrq,
				 jbjsrq : this.lists[i].jbjsrq,
				 jbsc : this.lists[i].jbsc,
				 sortid: i
			 }
			 subFormArr.push(item);
		}
		
		subForm['data'] = JSON.stringify(subFormArr);
		var subFormData = new Array();
		subFormData.push(subForm);
		return subFormData;
	}, getFileData() {
			var filesData = new Array();
			for (var i= 0;i< this.attachmentModel.fileList.length;i++) {
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
		// params['subject'] = "[" + this.selectProjModel.projName+ "]项目费用申报";
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
		
	}
	
   }
}
</script>

<style lang="scss" scoped>
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
.top ,.middle{
	text-align: left;
}
//金额    生产日期
.unpop,.pop, .price ,.date{
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
	padding: 0 10px;
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
</style>
<style>
.no-line.weui-cell:before {
	border: 0 none;
}
</style>
