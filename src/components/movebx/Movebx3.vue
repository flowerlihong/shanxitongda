
<template>
   <div id="mainForm" class="page headStyle">
	   <div class="weui-cell weui-cell_select myCell" style="padding:10px 15px;">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-th-list"></i></div>
			<div class="weui-cell__hd">
				<span>项目名称</span>
			</div>
			<div  class="weui-cell__bd myCell-bd" @click="isReadOnly?'': selectPro()">
				<!-- <span >{{selectProjModel.projectName.length>18? (selectProjModel.projectName.substring(0,18)+'...'):selectProjModel.projectName}}</span> -->
					<span>{{selectProjModel.projectName}}</span>
			</div>		
		</div>
		<div class="weui-cell myCell weui-cell_select">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-user"></i></div>
			<div class="weui-cell__hd"><span>报销人</span></div>
			<div class="weui-cell__bd myCell-bd" @click="apllyUserselect()">
        <span>{{applyUserModel.userName?applyUserModel.userName:""}}</span>
			</div>
		</div>
		<div class="weui-cell myCell weui-cell_select">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-home"></i></div>
			<div class="weui-cell__hd"><span>部门</span></div>
			<div class="weui-cell__bd myCell-bd" @click="departSelect()">
        <span>{{departModel.departName}}</span>
			</div>
		</div>
		<div class="weui-cell myCell">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-calendar"></i></div>
			<div class="weui-cell__hd">
				<span>报销日期</span>
			</div>
			<div class="weui-cell__bd">
				<datetime title="" :readonly="isReadOnly" class="col-xs-12 be-check no-line" 
						v-model="userBxData.applyDate" style="padding:0px;padding-right:0px;height:100%;" 
						default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
			</div>
		</div>
		<div class="weui-cell myCell">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-pushpin"></i></div>
			<div class="weui-cell__hd"><span>报销事由</span></div>
			<div class="weui-cell__bd" >
				<input type="text" :readonly="isReadOnly" v-model="userBxData.Remark" class="inputStyle" placeholder="请输入事由">
			</div>		
		</div>
		<div class="weui-cell myCell">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-yen"></i></div>
			<div class="weui-cell__hd">
				<span>报销总金额￥</span>
			</div>
			<div class="weui-cell__bd">{{total}}<span style="color:#663333">({{index}}条明细)</span></div>
		</div>
		<div class="weui-cell myCell">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-xbt"></i></div>
			<div class="weui-cell__hd">
				<span>核销借款金额￥</span>
			</div>
			<div class="weui-cell__bd" >
				<input class="weui-input"  v-model="userBxData.checkApplyMoney" :readonly="isReadOnly" 
				 style="text-align: right;" type="number" 
				placeholder="0.0"/> <!-- onkeyup="if(isNaN(value))value=value.substr(0,value.length-1)"-->
			</div>
		</div>
		<div class="weui-cell weui-cell_select myCell" style="padding:10px 15px;">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-th-list"></i></div>
			<div class="weui-cell__hd">
				<span>账户名称</span>
			</div>
			<div class="weui-cell__bd myCell-bd" @click="isReadOnly?'': selectAccount()">
				<span>{{accountModel.accountName.length>0?accountModel.accountName:"选择账户"}}</span>
			</div>
		</div>
		<div class="weui-cell myCell">
			<div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-credit-card"></i></div>
			<div class="weui-cell__hd">
				<span>账户</span>
			</div>
			<div class="weui-cell__bd">{{accountModel.account.length>0?accountModel.account:"账户号"}}</div>
		</div>
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
					<span class="col-xs-4" style="color:#54aac4">摘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;要</span>
					<input v-model="list.abstract" class="col-xs-8" :readonly="isReadOnly"  type="text" placeholder="请输入摘要" name="">
				</div>
				
				<div class="weui-cell myCell " style="width:100%; padding:0 0 0 15px;">
					<div class="weui-cell__hd"><span >费用名称</span></div>
					<div class="weui-cell__bd" >
						<popup-picker style="width:100%; color:red"  title="" :data="kmList" v-model="list.kmValue"  @on-change="kmonChange" :placeholder="('选择科目')"></popup-picker>
					</div>
				</div>
				<div class="weui-cell detailsIn">
					
					<div class="weui-cell__hd">
						<span>开始时间</span>
					</div>
					<div class="weui-cell__bd">
						<datetime title="" :readonly="isReadOnly" class="col-xs-12 be-check no-line" v-model="list.startDate" 
								style="padding:0px;padding-right:0px;height:100%;line-height:44px;" 
								default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
					</div>
				</div>
				<div class="weui-cell detailsIn">
					
					<div class="weui-cell__hd">
						<span>结束时间</span>
					</div>
					<div class="weui-cell__bd">
						<datetime title="" :readonly="isReadOnly" class="col-xs-12 be-check no-line" v-model="list.endDate" 
								style="padding:0px;padding-right:0px;height:100%;line-height:44px;" 
								default-selected-value="date" format="YYYY-MM-DD" placeholder="请选择日期"></datetime>
					</div>
				</div>
				<div class="weui-cell myCell " style="padding-left:15px;">
					<div class="weui-cell__hd"><span>报销金额<span style="color:red">*</span></span></div>
					<div class="weui-cell__bd" >
						<input class="weui-input" v-model="list.price" :readonly="isReadOnly"  style="text-align: right;" type="number" placeholder="0.0"/> <!--onkeyup="value=value.replace(/[^\d]/g,'') " -->
					</div>
				</div>
				<div style="height:48px;line-height:48px;padding-left:15px;border-bottom: 1px solid #eee;background-color:#eee;">
					<span style="color:#54aac4">明细备注</span>
				</div>
				<div id="price" style="text-align:left;">
					<x-textarea :readonly="isReadOnly" :max="100" style="width: 100%;" v-model="list.introduction" placeholder="请输入备注(限100字)" ref="content"></x-textarea>
				</div>			
			</div>
  	</template>
	 <div class="foot" style="padding-top:0;">
  		<p v-if="!isReadOnly" @click="add_a"> + 添加明细</p>
  	</div>
	  

	 <Attachment :model="attachmentModel" style="border-top: 1px solid #eee;"></Attachment> 
	 <!-- <ProcessForm :model="processModel" ref="process" style="background:#fff;"></ProcessForm> -->
	  <!-- <ProcessMonitor1  :model="processMonitorModel" ref="processMonitor"></ProcessMonitor1> -->
	<ProcessForm :model="processModel"	></ProcessForm>
	<mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
		<SelectProj :mess="selectProjModel" v-on:selectProjCallback="acceptProj" ref="projfile" ></SelectProj>
	</mt-popup>
	<mt-popup v-model="accountModel.popVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
		<ChooseAccount :accountMess='accountModel' v-on:selectAccountCallback="acceptAccount"></ChooseAccount>
	</mt-popup>
  <mt-popup v-model="applyUserModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
    <SelectUser :userModel="applyUserModel" ref="procUserSel" @selectUsersCallBack="handelUsers($event)"></SelectUser>
  </mt-popup>
  <mt-popup v-model="departModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
    <selectQuarters :orgModel="departModel" ref="procUserSel" @selectOrgCallBack="departHandel($event)"></selectQuarters>
  </mt-popup>
   </div>
</template>
<script>
import { Datetime, XTextarea, PopupPicker, Group } from "vux";
//import { MessageBox } from 'mint-ui';
//import { Alert } from 'vux'
import ChooseAccount from "./ChooseAccount.vue";
import SelectUser from "../common/SelectUser.vue";
import Attachment from "../common/Attachment1.vue";
import ProcessMonitor1 from "../common/ProcessMonitor1.vue";
import ProcessForm from "../common/ProcessForm.vue";
import SelectProj from "../common/SelectProj1.vue";
import selectQuarters from '../common/selectQuarters'
import { mapState, mapGetters, mapActions } from "vuex";
import { cloneObj, util, sessionUtil, amountLtoU } from "@/utils/utils.js";

export default {
  components: {
   //  MessageBox,
   // Alert,
    Datetime,
    XTextarea,
    ProcessMonitor1,
    SelectProj,
    ChooseAccount,
    PopupPicker,
    Group,
    Attachment,
    ProcessForm,
    SelectUser,
    selectQuarters
   
  },
  data() {
    return {
      /*  total:0,
		  index:0, */
      kmList: [[""]],
      kmValue: [""],
      costIdArray: [],
      isReadOnly: false,
      Id: null,
      userId: "",
      startDate: new Date().format("yyyy-MM-dd"),
      endDate: new Date().format("yyyy-MM-dd"),
      processMonitorModel: {
        procInstId: "",
        procDefId: "",
        currentActName: "",
        currentActId: "",
        Id: ""
      },
      applyUserModel: { visible: false, singer: true, users: [] },
      processModel: {
        isReadOnly: false,
        ifHashWorkflow: true,
        parent: this,
        id: "",
        sqlTableName: this.sqlTableName,
        formId: this.formId,
        procDefId: "",
        procInstId: ""
      },
      selectProjModel: {
        selectProjVisible: false,
        projectName: "选择项目",
        projUid: ""
      },
      departModel:{
        visible:false,
        departUid:'',
        departName:''
      },
      accountModel: {
        popVisible: false,
        accountName: "选择账户",
        accountId: "",
        account: "",
        accountType: ""
      },
      attachmentModel: {
        isReadOnly: false,
        xtype: "fujian1",
        title: "上传附件",
        fileList: [],
        deleteFilesList: [],
        id: ""
      },
      userBxData: {
        sn: "",
        Subject: "",
        fsrq: "",
        czy: "",
        projectName: "",
        xmid: "",
        projectNumber: "",
        applyUserName: "",
        applyUserId: "",
        applyDepartName: "",
        applyDepartUid: "",
        applyDate: new Date().format("yyyy-MM-dd"),
        applyTotalMoney: "0",
        upCaseTotalMoney: "0",
        checkApplyMoney: "0",
        checkTotalApplyMoney: "0",
        realGiveMoney: "0",
        accountName: "",
        accountId: "",
        account: "",
        loanDepartUid: "",
        accountType: "",
        Remark: ""
      },
      sqlTableName: "U012_Expense_Account",
      symbol: "sn,EABX",
      formId: "DForm_U012_Expense_Account",
      appId: "U012",
      subFormData: [],
      //	userName:'',
      userBxData2: [],
      // jbr:'',
      // id:'',
      isNewFlag: false,
      //isNewData:'',
      selectedProjInfo: {}
    };
  },
  computed: {
    ...mapState({
      lists: state => state.lists,
      userUid: state => state.userUid,
      userName: state => state.userName,
      webUrl: state => state.webUrl,
      index: state => state.index
    }),
    ...mapGetters(["total"])
  },
  created() {
    // this.util.initWxJsSdk(this);
    this.userId = this.sessionUtil.getUserId();
    this.userBxData.applyUserId = this.userId;
    this.userBxData.applyUserName = this.userName;
    this.userBxData.czy = this.userName;
    this.applyUserModel.userName=this.userName;
   // this.userBxData.applyDepartName = this.sessionUtil.getDepartName();
   // this.userBxData.applyDepartUid = this.sessionUtil.getDepartUid();

    this.userBxData2 = cloneObj(this.userBxData);
   // this.queryCheckMoney();
    this.querykmList();
  },

  deactivated() {
    this.$destroy(true);
  },
  activated() {
    this.Id = this.$route.query.Id;
    if (this.Id) {
      this.queryData();
    } else {
      this.userBxData = cloneObj(this.userBxData2);
      this.$store.state.index = 1;
    }
    this.attachmentModel.id = this.Id;

    this.$store.state.lists = [
      {
        introduction: "",
        price: 0.0,
        cbmc: "选择科目",
        see: true,
        kmValue: [],
        popupVisible1: false,
        startDate: "",
        endDate: "",
        abstract: ""
        //happenDate: new Date().format("yyyy-MM-dd"),
      }
    ];
    this.queryCheckMoney()
    this.isNewFlag = this.validUtil.isNotEmpty(this.Id) ? false : true;
    this.processModel.parent = this;
  },
  methods: {
    ...mapActions(["add", "delet", "show", "add_a", "xzkm"]),
    selectPro() {
      this.selectProjModel.selectProjVisible = true;
    },
    departSelect(){
      console.log('111221')
      this.departModel.visible=true
    },
    departHandel(data){
     // this.departModel=data;
     if(data.length>1){
       this.util.alert("报销人只能选择一人!请重新选择!")
     }
     this.userBxData.applyDepartName=data.departName; 
     this.userBxData.applyDepartUid=data.departUid; 
      console.log(data)
    },   
    kmonChange(v) {},
    apllyUserselect(){
      this.applyUserModel.visible=true
    },
    handelUsers(data){
      if(this.applyUserModel.userName.split(",").length>1){
        this.util.alert("报销人只能选择一人!请重新选择!")
      };
      console.log(this.applyUserModel)
     // this.userBxData
      this.userBxData.applyUserId=this.applyUserModel.users.UserId
      this.userBxData.applyUserName=this.applyUserModel.userName

      this.queryCheckMoney();
    },
    acceptProj(data) {
      this.selectProjModel.projectName = data.projectName;

      this.userBxData.projectName = data.projectName;
      this.userBxData.xmid = data.xmid;
      this.userBxData.projectNum = data.projectNum;
    },
    acceptAccount(data) {
      this.userBxData.accountName = data.accountName;
      this.userBxData.accountId = data.accountId;
      this.userBxData.accountType = data.accountType;
      this.userBxData.account = data.account;
    },
    selectAccount() {
      this.accountModel.popVisible = true;
    },
    querykmList(){
      var _this = this;
      var obj = {
        lock: "-5"
      };

      var params = {
        operateType: "queryFormData",
        sqlTableName: "U005_Indirect_Fee_Subject",
        orderByName: "subjectNum asc",
        param: JSON.stringify(obj), //where key = value
        fieldList: "subjectName,subjectNum", // 'id,projectName' select name projectName from
        totalRows: 100,
        firstRows: 0
        //	searchParams:JSON.stringify(searchParams),  // where key like value
      };

      var url =
        "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat";
      this.util.post(url, params, function(res) {
        _this.kmList = [[]];
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          //	var item = {name: data[i].name, value: data[i].value}
          _this.kmList[0].push(data[i].subjectName);
          _this.costIdArray.push(data[i].subjectNum);
        }
      });
    },
    queryCheckMoney(){
      var _this=this;
      var url ="/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat";
        var sql2 =
          "select a.userId userId,((case when jie is null then 0 else jie end)-(case when huan1 is null then 0 else " +
          "huan1 end)-(case when huan2 is null then 0 else huan2 end)) checkTotalApplyMoney from (select loanUserId " +
          "userId,sum(cast(loanTotalMoney as float)) jie from U012_Loan_Bill where lock = '-5' group by  loanUserId) " +
          "a left join (select repayUserId userId,sum(cast(repayMoney as float)) huan1 from U012_Repayment_Registration " +
          "where lock = '-5' group by  repayUserId) b on a.userId = b.userId left join (select " +
          "applyUserId userId,sum(cast(checkApplyMoney as float)) huan2 from U012_Expense_Account where lock = '-5' " +
          "group by applyUserId) c on a.userId = c.userId where a.userId='" +
          this.userBxData.applyUserId +
          "'";
        var params2 = {
          operateType: "queryDataByEncSql", //数据库连接
          // param:JSON.stringify(obj),		//指定where
          // searchParams:JSON.stringify(searchParams),
          querySql: _this.util._encode(sql2),
          //sqlTableName:'U012_Expense_Account',
          orderByName: "userId DESC",
          fieldList: "",
          totalRows: 100,
          firstRows: 0
        };
        this.util.post(url, params2, function(res) {
          if (res.data.length > 0) {
            _this.userBxData.checkTotalApplyMoney =
              res.data[0].checkTotalApplyMoney;
          } else {
            _this.userBxData.checkTotalApplyMoney = "0";

          }
        });
    },

    queryData() {
      this.util.mask();
      var obj = new Object();
      obj["Id"] = this.$route.query.Id;
      this.processMonitorModel.Id = this.$route.query.Id;
      //	obj['projectNumber'] =
      var _this = this;
      /* var searchParams = {
          projectName:_this.search
      } */
      var sql =
        "select b.*,a.Remark as subRemark,isnull(a.applyMoney,'') applyMoney,isnull(a.costName,'') " +
        "costName,isnull(a.startDate,'') startDate,isnull(a.endDate,'') " +
        "endDate,isnull(a.abstract,'') abstract, isnull(u.projectName,'') projectName,isnull(u.projectNum,'') projectNumber, " +
        "o.UserName applyUserName,d.DepartName applyDepartName," +
        "isnull(c.accountName,'') accountName,c.account,c.accountType from U012_Expense_Account b " +
        "left join U012_Expense_Accountdet a on a.pid=b.Id " +
        "left join U_Project u on b.xmid = u.Id " +
        "left join ORG_User o on b.applyUserId = o.UserId " +
        "left join ORG_Depart d on b.applyDepartUid = d.Id " +
        "left join U012_Account_Manager c on b.accountId = c.Id " +
        "where " +
        "b.Id=" +
        "'" +
        this.Id +
        "'";

      var params = {
        operateType: "queryDataByEncSql", //数据库连接
        // param:JSON.stringify(obj),		//指定where
        // searchParams:JSON.stringify(searchParams),
        querySql: _this.util._encode(sql),
        sqlTableName: "U012_Expense_Account",
        orderByName: "DocCreated DESC",
        fieldList: "",
        totalRows: 100,
        firstRows: 0
      };

      this.util.post(
        "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat",
        params,
        function(res) {
          if (res.data && res.data.length > 0) {
            var data = res.data[0];
            //_this.userBxData= cloneObj(res.data[0]);
            _this.userBxData.sn = data.sn;
            _this.userBxData.Subject = data.Subject;
            _this.userBxData.fsrq = data.fsrq;
            _this.userBxData.czy = data.czy;
            _this.userBxData.projectName = data.projectName;
            _this.userBxData.xmid = data.xmid;
            _this.userBxData.projectNumber = data.projectNumber;
            _this.userBxData.applyUserName = data.applyUserName;
            _this.userBxData.applyUserId = data.applyUserId;
            _this.userBxData.applyDepartName = data.applyDepartName;
            _this.userBxData.applyDepartUid = data.applyDepartUid;
            _this.userBxData.applyDate = data.applyDate;
            _this.userBxData.applyTotalMoney = data.applyTotalMoney;
            _this.userBxData.upCaseTotalMoney = data.upCaseTotalMoney;
            _this.userBxData.checkApplyMoney = data.checkApplyMoney;
            _this.userBxData.checkTotalApplyMoney = data.checkTotalApplyMoney;
            _this.userBxData.realGiveMoney =
              data.realGiveMoney == null ? 0 : data.realGiveMoney;
            _this.userBxData.accountName = data.accountName;
            _this.userBxData.accountId = data.accountId;
            _this.userBxData.account = data.account;
            //_this.userBxData.loanDepartUid=data.loanDepartUid;
            _this.userBxData.accountType = data.accountType;
            _this.userBxData.Remark = data.Remark;
            _this.userBxData.lock = data.lock;

            if (data.lock) {
              _this.isReadOnly = true;
              //_this.voiceRecognition.isReadOnly =true;
              _this.attachmentModel.isReadOnly = true;
            }
            _this.selectProjModel.projectName = data.projectName;
            _this.accountModel.accountName = data.accountName;
            _this.accountModel.account = data.account;
            _this.$store.state.lists = [];
            for (let i = 0; i < res.data.length; i++) {
              var obj = {};
              obj.price = res.data[i].applyMoney;
              obj.see = true;
              //debugger
              obj.kmValue = [res.data[i].costName];
              obj.introduction = res.data[i].subRemark;
              obj.abstract = res.data[i].abstract;
              obj.startDate = res.data[i].startDate;
              obj.endDate = res.data[i].endDate;

              _this.$store.state.lists.push(obj);
              //
            }
            _this.$store.state.index = res.data.length;
          }

          _this.util.unmask();
        }
      );
    },
    checkValid() {
      if (
        !this.validUtil.isNotEmpty(this.userBxData.projectName) ||
        this.userBxData.projectName == "选择项目"
      ) {
        this.util.alert("请选择项目");
        return false;
      }

      if (
        !this.validUtil.isNotEmpty(this.userBxData.Remark) ||
        this.userBxData.Remark.replace(" ", "").length == 0
      ) {
        this.util.alert("报销事由不能为空");
        return false;
      }
      /* if(this.userBxData.checkApplyMoney/1==0){
			this.util.alert('核销金额不能为空');
		} */
      if (
        !this.validUtil.isNotEmpty(this.userBxData.accountName) ||
        this.userBxData.accountName == "选择账户"
      ) {
        this.util.alert("账户名称不能为空");
        return false;
      }

      for (let i = 0; i < this.lists.length; i++) {
        if (!this.lists[i].abstract.trim()) {
          this.util.alert("第" + (i + 1) + "条明细请输入摘要");
          return false;
        } else if (
          this.lists[i].kmValue[0] == "选择科目" ||
          !this.validUtil.isNotEmpty(this.lists[i].kmValue[0])
        ) {
          this.util.alert("第" + (i + 1) + "条明细请选择科目");
          return false;
        } else if (this.lists[i].price == 0 || this.lists[i].price == null) {
          this.util.alert("第" + (i + 1) + "条明细请输入申报金额");
          return false;
        } else if (isNaN(this.lists[i].price)) {
          this.util.alert("第" + (i + 1) + "条明细申报金额请输入数字");
          return false;
        } else if (!this.validUtil.isNotEmpty(this.lists[i].startDate)) {
          this.util.alert("第" + (i + 1) + "条明细请输入开始日期");
          return false;
        } else if (!this.validUtil.isNotEmpty(this.lists[i].endDate)) {
          this.util.alert("第" + (i + 1) + "条明细请输入结束日期");
          return false;
        } else if (
          this.validUtil.compareDateTime(
            this.lists[i].startDate,
            this.lists[i].endDate
          )
        ) {
          this.util.alert("第" + (i + 1) + "条明细结束时间必须大于开始时间");
          return false;
        }
      }

      if (isNaN(this.userBxData.checkApplyMoney)) {
        this.util.alert("核销借款金额请输入数字");
        return false;
      }
      
      if (this.total / 1 < this.userBxData.checkApplyMoney) {
        this.util.alert("核销借款金额不能大于报销总额");
       // MessageBox('提示', '核销借款金额不能大于报销总额');
        
        return false;
      }
      console.log(this.userBxData.checkApplyMoney,this.userBxData.checkTotalApplyMoney)
      if(this.userBxData.checkApplyMoney>this.userBxData.checkTotalApplyMoney){
      	this.util.alert('核销借款金额不能大于余核销借款金额'+this.userBxData.checkTotalApplyMoney);
      	return false;
      }
      return true;
    },
    getData() {
      //var mainFormData=this.userBxData;
      this.userBxData.applyTotalMoney = this.total;
      this.userBxData.upCaseTotalMoney = amountLtoU(
        this.userBxData.applyTotalMoney
      );
      this.userBxData.realGiveMoney =
        this.total / 1 - this.userBxData.checkApplyMoney / 1;

      var _this = this;
      var filesData = new Array();
      for (var i = 0; i < this.attachmentModel.fileList.length; i++) {
        var file = this.attachmentModel.fileList[i];
        if (file.isNewFlag) {
          filesData.push(file);
        }
      }
      //子表数据
      var bxdetailsData = [];
      for (let i = 0; i < this.lists.length; i++) {
        let obj = {
          costName: _this.lists[i].kmValue[0],
          costSubjectId:
            _this.costIdArray[
              _this.kmList[0].indexOf(_this.lists[i].kmValue[0])
            ],
          startDate: _this.lists[i].startDate,
          endDate: _this.lists[i].endDate,
          abstract: _this.lists[i].abstract,
          applyMoney: _this.lists[i].price,
          Remark: _this.lists[i].introduction,
          sort: i + 1,
          sortid: i + 1
        };
        bxdetailsData.push(obj);
      }

      var subFormData = [
        {
          subFormId: "subForm1",
          subFormTable: "U012_Expense_Accountdet",
          subFormForeignKey: "pid",
          sort: 0,
          pageSize: 0,
          data: JSON.stringify(bxdetailsData)
        }
      ];

      var params = {
        sqlTableName: _this.sqlTableName,
        mainFormData: JSON.stringify(_this.userBxData),
        filesData: JSON.stringify(filesData),
        deleteFilesData: _this.attachmentModel.deleteFilesList.join(",")
      };
      if (this.validUtil.isNotEmpty(this.Id)) {
        params["id"] = this.Id;
        params["businessKey"] = this.Id;
      }
      params["symbol"] = this.symbol;
      params["formId"] = this.formId;
      params["appId"] = this.appId;

      params.subFormData = JSON.stringify(subFormData);
      return params;
    },

    cancelCallback() {
      if (this.validUtil.isNotEmpty(this.Id)) {
        this.$router.back(-1);
      } else {
        //WeixinJSBridge.call('closeWindow');
        history.back();
        //this.$router.back(-1)
      }
    },
    getMainFormData() {
      return this.userBxData;
    },
    saveData() {
      if (this.userBxData.lock) {
        this.cancelCallback();
        return;
      }
      if (this.checkValid()) {
        var _this = this;
        var param = this.getData();
        console.log(param)
        return
        var url = "/admin/appDefaultFormAction!saveData.action";
        this.util.post(url, param, function(res) {
          //alert(res.msg)

          if (res.success) {
            _this.util.alert("保存成功！");
          }

          _this.cancelCallback();
          //_this.$router.push({name:'DayOffQuery',query:{pType:'saveBack'}})
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.weui-cell__hd {
  color: rgb(84, 170, 196);
}
.cell_bottom::after {
  content: " ";
  position: absolute;

  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #d9d9d9;
  color: #d9d9d9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
  left: 15px;
}
.myCell {
  height: auto;
}
.inputStyle {
  width: 100%;
  text-align: right;
}
.glyphicon {
  line-height: 26px;
}
.detailsIn {
  padding: 0 15px;
}
.conductorPerson {
  height: 1.5rem;
  padding: 5px 10px;
  line-height: 1.2rem;
  p {
    margin: 0;
  }
}
#person {
  height: 3rem;
  li {
    float: left;
  }
}
.middle {
  text-align: left;
}
.pop {
  height: 48px;
  line-height: 48px;
}
//金额    生产日期
.unpop,
.price,
.date {
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
.price input {
  height: 40px;
  padding-top: 10px;
  text-align: right;
}
.price > span {
  padding: 0 15px;
}
.block {
  text-align: right;
}

//foot
.foot {
  height: 50px;
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



