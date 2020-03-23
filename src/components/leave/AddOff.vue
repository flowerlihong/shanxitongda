<template>
  <div class="maimForm">
	  <div class="wrap">
		  	<div class="weui-cell  myCell" style="padding-left: 10px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span>员工姓名<span style="color:red">*</span></span></div>
				<!-- <div class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectUser()">
					<span style=" display: block;height: 100%;padding-right: 0px;line-height: 23px;">{{userModel.userName}}</span>
				</div> -->
				<div class="weui-cell__bd" >
					
					<span>{{offDetails.applicant}}</span>
				</div>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">开始时间</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" 
						  v-model="offDetails.offStartTime" style="padding:0px;padding-right:10px;" 
						  default-selected-value="date" format="YYYY-MM-DD HH:mm" 
						  
						  :placeholder="'请选择日期'"></datetime>
			</div>
			<div class="price" style="text-align:left;">
				<span class="col-xs-3">结束时间</span>
				<datetime title=""  class="col-xs-9 be-check" :readonly="isReadOnly" 
									v-model="offDetails.offEndTime" style="padding:0px;padding-right:10px;" 
									default-selected-value="date" format="YYYY-MM-DD HH:mm" 
									
									:placeholder="'请选择日期'"></datetime>
			</div>
			<div class="weui-cell myCell" id="myCell" style="padding-left: 10px;">
				<div class="weui-cell__hd"><span>调休天数<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd" >
					<input  v-model="offDetails.offDays" :readonly="isReadOnly" style="text-align: right;" 
							type="text" @blur="daysValid()" placeholder=""/>
					<span>天</span>
				</div>
			</div>
			<div class="weui-cell  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span>调休性质<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd " >		
					<popup-picker style="width:100%; color:red"  :data="offTypeList" 
								  v-model="offDetails.offType"  @on-confirm="TypeonChange" 								  
								  :placeholder="('选择性质')">
					</popup-picker>			
				</div>
			</div>
			<VoiceRecognition :model="voiceRecognition"></VoiceRecognition>
			<!-- <ProcessMonitor1 :model="monitorModel"></ProcessMonitor1> -->
			
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3">备注</span>
				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="2000" style="width: 100%;"  :readonly="isReadOnly"
							 placeholder="请输入备注..."	v-model="offDetails.Remark"
							 ref="content"></x-textarea>
			</div>
			<Attachment :model="attachmentModel" style="border-top: 1px solid #eee;"></Attachment>
			<!-- <ProcessMonitor1 :model="monitorModel"></ProcessMonitor1> -->
			<ProcessForm :model="processModel"	></ProcessForm>
	  </div>
	  <!-- <div class="btns">
		  <p style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;z-index:2;">
				<button  style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
						@click="cancelCallback()" class="weui-btn weui-btn_mini weui-btn_default">取消</button>
				<button  style="width:48%;height: 45px;line-height: 45px;" @click="saveData()" 
						class="weui-btn weui-btn_mini weui-btn_primary">保存</button>
				
	 	  </p>
	  </div> -->
	  	
  </div>
</template>

<script>
import VoiceRecognition from "../common/VoiceRecognition.vue";
import Attachment from "../common/Attachment1.vue";
 import ProcessMonitor1 from "../common/ProcessMonitor1";
import ProcessForm from "../common/ProcessForm";
import { Datetime, PopupPicker, XButton, XTextarea } from "vux";
import { mapState } from "vuex";
import { cloneObj, sessionUtil } from "@/utils/utils.js";
export default {
  components: {
    Datetime,
    PopupPicker,
    VoiceRecognition,
    Attachment,
    ProcessMonitor1,
    ProcessForm,
    XButton,
    XTextarea
  },
  data() {
    return {
      offDetails: {
        sn: "",
        xmid: "",
        Subject: "",
        fsrq: new Date().format("yyyy-MM-dd"),
        czy: "",
        applicant: "",
        userUid: "",
        depart: "",
        offType: [],
        offStartTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
        offEndTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
        offDays: "",
        //  offReson:'',
        Remark: ""
      },
      isReadOnly: false,
      offTypeList: [[""]],
      voiceRecognition: {
        title: "调休事由",
        isReadOnly: false,
        placeholder: "请输入调休原因...",
        content: ""
      },
      attachmentModel: {
        isReadOnly: false,
        xtype: "fujian1",
        title: "上传附件",
        fileList: [],
        deleteFilesList: []
      },
      monitorModel: {
        Id: ""
      },
      Id: "",
      sqlTableName: "U013_Take_The_Application",
      symbol: "sn,TATHAP",
      formId: "DForm_U013_Take_The_Application",
      appId: "U013",
      subFormData: [],
      pushData: {},
      processModel: {
        ifHashWorkflow: true,
        isReadOnly: false,
        sqlTableName: this.sqlTableName,
        formId: this.formId,
        parent: null,
        id: "",
        procDefId: "",
        procInstId: ""
      }
    };
  },
  deactivated() {
    this.$destroy(true);
  },
  computed: {
    ...mapState({
      userUid: state => state.userUid,
      userName: state => state.userName
    })
  },

  created() {
    this.util.initWxJsSdk(this);
    this.offDetails.applicant = this.userName;

    var _this = this;

    var sql =
      "select value,name,DocCreated from ST01_Data_Dictionary_det where " +
      "pid = (select top 1 ID from ST01_Data_Dictionary where DDID='offType')";
    var params = {
      operateType: "queryDataByEncSql",
      querySql: _this.util._encode(sql),
      //param:JSON.stringify(obj),
      totalRows: 25,
      firstRows: 0
      //searchParams:JSON.stringify(searchParams),
    };

    var url =
      "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat";
    this.util.post(url, params, function(res) {
      console.log(res);

      _this.offTypeList = [[]];
      var data = res.data;
      for (var i = 0; i < data.length; i++) {
        //	var item = {name: data[i].name, value: data[i].value}
        _this.offTypeList[0].push(data[i].value);
      }
    });
  },
  activated() { 
    this.Id = this.util.getUrlParam("Id");

    if (this.Id) {
      this.queryDetals();
    } else {
      this.offDetails.Subject = "调休申请";
      this.offDetails.czy = this.userName;
      this.offDetails.applicant = this.userName;
      this.offDetails.userUid = this.userUid;
      this.offDetails.depart = this.sessionUtil.getDepartName();
    }
    this.processModel.parent = this;
  },
  methods: {
    queryDetals() {
      this.util.mask();
      //流程通过id加载
      this.monitorModel.Id = this.Id;
      var obj = new Object();
      obj["company"] = sessionUtil.getCompanyId();
      obj["Id"] = this.Id;
      //  var userName = sessionUtil.getUserName()

      // obj['projectNumber'] =
      var _this = this;

      var params = {
        operateType: "queryFormData",
        param: JSON.stringify(obj),
        //searchParams:JSON.stringify(searchParams),
        // querySql : _this.util._encode(sql),
        sqlTableName: _this.sqlTableName,
        orderByName: "DocCreated DESC",
        //fieldList:"",
        totalRows: 10,
        firstRows: 0
      };
      
      this.util.post(
        "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat",
        params,
        function(res) {
          var data = res.data[0];
          console.log(data);

          _this.offDetails.sn = data.sn;
          _this.offDetails.xmid = data.xmid;
          _this.offDetails.Subject = data.Subject;
          _this.offDetails.fsrq = data.fsrq;
          _this.offDetails.czy = data.czy;
          _this.offDetails.applicant = data.applicant;
          _this.offDetails.userUid = data.userUid;
          _this.offDetails.depart = data.depart;
          _this.offDetails.offStartTime = data.offStartTime;
          _this.offDetails.offEndTime = data.offEndTime;
          _this.offDetails.offDays = data.offDays;
          _this.offDetails.offType = [data.offType];
          _this.voiceRecognition.content = data.offReson;
          _this.offDetails.Remark = data.Remark;
          _this.offDetails["_form_category_"] = data["_form_category_"];
		  _this.offDetails.lock = data.lock;
		  _this.offDetails.lock = data.ProcInstId;
          //附件在附件组件中通过url 中的Id请求加载
          if (data.lock) {
            _this.isReadOnly = true;
            _this.voiceRecognition.isReadOnly = true;
            _this.attachmentModel.isReadOnly = true;
          }

          _this.util.unmask();
        }
      );
    },
    TypeonChange() {
      //  console.log(this.offDetails.offEndTime.length)
      /* var a = this.offDetails.offEndTime;
		this.offDetails.offStartTime */
    },
    checkValid() {
      /* if(!this.valisdUtil.isNotEmpty(this.userModel.userUid)){
			this.util.failueToast('请选择员工');
			return false;
		} */
      var _this = this;
      this.pushData = cloneObj(_this.offDetails);
      if (this.pushData.offStartTime.length <= 16) {
        this.pushData.offStartTime += ":00";
      }
      if (this.pushData.offEndTime.length <= 16) {
        this.pushData.offEndTime += ":00";
      }

      console.log(this.pushData.offStartTime);
      //return false;
      this.pushData.offType = this.offDetails.offType[0];
      if (
        this.validUtil.compareDateTime(
          this.pushData.offStartTime,
          this.pushData.offEndTime
        )
      ) {
        this.util.failueToast("结束时间必须大于开始时间");
        return false;
      }
      if (!this.validUtil.isNotEmpty(this.pushData.offDays)) {
        this.util.failueToast("请输入调休天数！");
        return false;
      }
      if (!this.validUtil.isNotEmpty(this.pushData.offType)) {
        this.util.failueToast("请选择调休性质！");
        return false;
      }
      if (!this.validUtil.isNotEmpty(this.voiceRecognition.content)) {
        this.util.failueToast("请输入调休原因！");
        return false;
      }
      return true;
    },
    getData() {
      var _this = this;
      this.pushData.offReson = this.voiceRecognition.content;

      var filesData = new Array();
      for (var i = 0; i < this.attachmentModel.fileList.length; i++) {
        var file = this.attachmentModel.fileList[i];
        if (file.isNewFlag) {
          filesData.push(file);
        }
      }
      var params = {
        sqlTableName: _this.sqlTableName,
        mainFormData: JSON.stringify(_this.pushData),
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
      return this.pushData;
    },
    saveData() {
      if (!this.checkValid()) {
        return;
      }
      if (this.offDetails.lock) {
        this.cancelCallback();
        return;
      }
      var _this = this;
      var param = this.getData();
      console.log(param);
      console.log(param.mainFormData);
      var url = "/admin/appDefaultFormAction!saveData.action";
      this.util.post(url, param, function(res) {
        //alert(res.msg)
        console.log(res);
        _this.util.alert("保存成功！");
        _this.cancelCallback();
        //_this.$router.push({name:'DayOffQuery',query:{pType:'saveBack'}})
      });
    },
    daysValid() {
      //if(typeof this.offDetails )
      var value = this.offDetails.offDays;
      console.log(typeof this.offDetails.offDays);
      var patrn = /^(-)?\d+(\.\d+)?$/;
      if (patrn.exec(value) == null || value == "") {
        this.util.alert("请输入数字！");
        return false;
      }
      if ((value / 1 * 2) % 1 != 0) {
        this.util.alert("请输入0.5的倍数！");
      }
    }
  }
};
</script>

<style lang="less" scoped>
#myCell {
  border-top: 1px solid #eee;
}
.weui-select {
  height: 100%;
  line-height: 28px;
  direction: rtl;
  padding-right: 30px;
}
#selectNum {
  padding: 0;
}
.weui-cell:before {
  border-top: 0px solid #e5e5e5 !important;
}
.top,
.middle {
  text-align: left;
  margin-bottom: 75px;
}
//金额    生产日期
.price {
  height: 48px;
  line-height: 48px;
  border-top: 1px solid #eee;
}

.price > span,
.bill > span {
  padding: 0 10px;
}
//发票
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
    margin-top: 30px;
    padding: 5px 15px;
  }
}
.rt > input {
  width: 40px;
  text-align: center;
}
</style>


