<template>
  <div class="maimForm">
	  <div class="wrap">
		  	<!-- <div class="weui-cell myCell" style="padding:10px 15px 10px 10px;height:auto;">
				<div class="weui-cell__hd">
					<span class="itemName">立项号<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd">
					<span style="padding-right:5px;">
						{{qualityDetails.lxh}}
					</span>					
				</div>		
			</div> --> 
			<div class="weui-cell weui-cell_select  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span class="itemName">立项号<span style="color:red">*</span></span></div>
				<div  class="weui-cell__bd myCell-bd"  @click="isReadOnly?'': selectPro('lxh')">
					<span style="padding-right:5px;">
						{{qualityDetails.lxh}}						
					</span>					
				</div>
			</div>
		  	<div class="weui-cell myCell" style="padding:10px 15px 10px 10px;height:auto;">
				<div class="weui-cell__hd">
					<span class="itemName">立项名称<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd">
					<span style="padding-right:5px;">
						{{qualityDetails.lxmc}}
					</span>					
				</div>		
			</div>		  
			<div class="weui-cell weui-cell_select  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span class="itemName">站点名称<span style="color:red">*</span></span></div>
				<div  class="weui-cell__bd myCell-bd"  @click="isReadOnly?'': selectPro('zdmc')">
					<span style="padding-right:5px;">
						{{qualityDetails.zdmc}}						
					</span>					
				</div>
			</div>
		  	<div class="weui-cell myCell" style="padding:10px 15px 10px 10px;height:auto;">
				<div class="weui-cell__hd">
					<span class="itemName">分公司<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd">
					<span style="padding-right:5px;">
						{{qualityDetails.fgs}}
					</span>					
				</div>		
			</div>
		  	<div class="weui-cell myCell" style="padding:10px 15px 10px 10px;height:auto;">
				<div class="weui-cell__hd">
					<span class="itemName">施工队<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd">
					<span style="padding-right:5px;">
						{{qualityDetails.sgd}}
					</span>					
				</div>		
			</div>
		  	<div class="weui-cell myCell" style="padding:10px 15px 10px 10px;height:auto;">
				<div class="weui-cell__hd">
					<span class="itemName">项目经理<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd">
					<span style="padding-right:5px;">
						{{qualityDetails.xmjl}}
					</span>					
				</div>		
			</div>			
			<div class="weui-cell  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span class="itemName">整改日期<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd " >	
					<datetime title=""  class="col-xs-12 be-check" :readonly="isReadOnly" 
						  v-model="qualityDetails.zgrq" style="padding:0px;padding-right:15px;" 
						  default-selected-value="date" format="YYYY-MM-DD" 
						  :placeholder="'请选择日期'"></datetime>							
				</div>
			</div>
			<div class="weui-cell  myCell" 
				 style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee">
				<div class="weui-cell__hd"><span class="itemName">是否需要再次整改<span style="color:red">*</span></span></div>
				<div class="weui-cell__bd " >		
					<popup-picker style="width:100%; color:red"  :data="resultsList" 
								  v-model="qualityDetails.sfxyzg"  @on-change="resultChange" 								  
								  :placeholder="('选择结果')">
					</popup-picker>			
				</div>
			</div>
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3 itemName">检查内容</span>				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="500" style="width: 100%;"  :readonly="isReadOnly"
					placeholder="请输入检查内容..."	v-model="qualityDetails.inspectionContent"
					ref="content">
				</x-textarea>
			</div>
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-3 itemName">检查结果</span>				
			</div>
			<div  style="text-align:left;">
				<x-textarea  :max="200" style="width: 100%;"  :readonly="isReadOnly"
					placeholder="请输入备注..."	v-model="qualityDetails.Remark"
					ref="content">
				</x-textarea>
			</div>
			<Attachment :model="attachmentModel" style="border-top: 1px solid #eee;"></Attachment>
			<ProcessMonitor1 :model="monitorModel"></ProcessMonitor1>
      <mt-popup v-if="selectProjModel.lxh" v-model="selectProjModel.lxh" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
				
				<SelectProj :openWord="selectProjModel.lxhOpenWord" :theUrl="selectProjModel.lxhUrl" :showWord="selectProjModel.lxhShowWord" :mess="selectProjModel" v-on:selectProjCallback="acceptProj" ref="projfile" ></SelectProj>
			</mt-popup>
			<mt-popup v-if="selectProjModel.zdmc" v-model="selectProjModel.zdmc" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
				
				<SelectProj :openWord="selectProjModel.zdmcOpenWord" :theUrl="selectProjModel.zdmcUrl" :showWord="selectProjModel.zdmcShowWord" :mess="selectProjModel" v-on:selectProjCallback="acceptProj" ref="projfile" ></SelectProj>
			</mt-popup>
			<!-- <mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
				<SelectProj :theUrl="theUrl" :showWord="showWord" :mess="selectProjModel" v-on:selectProjCallback="acceptProj" ref="projfile" ></SelectProj>
			</mt-popup> -->
	  </div>
	  <div class="btns">
		  <p style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;z-index:2;">
				<button  style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
						@click="cancelCallback()" class="weui-btn weui-btn_mini weui-btn_default">取消</button>
				<button  style="width:48%;height: 45px;line-height: 45px;" @click="saveData()" 
						class="weui-btn weui-btn_mini weui-btn_primary">保存</button>				
	 	  </p>
	  </div>
	  	
  </div>
</template>

<script>
import VoiceRecognition from "../../../common/VoiceRecognition.vue";
import Attachment from "../../../common/Attachment1.vue";
import ProcessMonitor1 from "../../../common/ProcessMonitor1";
import SelectProj from "../../../common/SelectProj3.vue";
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
    XButton,
    XTextarea,
    SelectProj
  },
  data() {
    return {
      pType:'',
      showWord: "zdmc",
      theUrl: "/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=WeChat&Type=siteSelection", //选项接口
     
      qualityDetails: {
      },
      isReadOnly: false,
      resultsList: [[""]],
      voiceRecognition: {
        title: "调休事由",
        isReadOnly: false,
        placeholder: "请输入调休原因...",
        content: ""
      },
      attachmentModel: {
        isReadOnly: false,
        xtype: "file",
        title: "上传附件",
        fileList: [],
        deleteFilesList: []
      },

      // selectProjModel: {
      //   selectProjVisible: false,
      //   projectName: "选择项目",
      //   projUid: "",
      //   moduleType: "gcPro"
      // },
      
      selectProjModel: {
        // lxh: "选择项目",
        // projUid: "",
        selectedLxh:'',
        moduleType: "gcPro",

        lxh: false,
        lxhOpenWord:'lxh',
        projUid:'',
        lxhUrl: '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=WeChat&Type=projectNo',
        lxhShowWord: 'xmmc',

        zdmc: false,
        zdmcOpenWord:'zdmc',
        projUid:'',
        zdmcUrl: '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=WeChat&Type=siteSelection',
        zdmcShowWord: 'zdmc',
      },
      monitorModel: {
        Id: ""
      },
      Id: "",
      sqlTableName: "U016_AQZG",
      symbol: "sn,AQZG",
      formId: "DForm_U016_AQZG_new",
      appId: "U016",
      subFormData: [],
      pushData: {},
      userId: ""
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
    this.userId = this.sessionUtil.getUserId();
    console.log(
      "%c",
      "padding:50px;line-height:120px;background:url('http://hiphotos.baidu.com/feed/pic/item/ca1349540923dd543dc9be7dda09b3de9c824868.jpg') no-repeat;background-size: 100px 100px; "
    );
    var _this = this;
    //  在数据字典中查询检查结果
    var sql =
      "select value,name,DocCreated from ST01_Data_Dictionary_det where " +
      "pid = (select top 1 ID from ST01_Data_Dictionary where DDID='inspectionResult')";
    var params = {
      operateType: "queryDataByEncSql",
      querySql: _this.util._encode(sql),
      totalRows: 25,
      firstRows: 0
    };

    // var url =
    //   "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat";
    // this.util.post(url, params, function(res) {
    //   console.log(res);

    //   _this.resultsList = [[]];
    //   var data = res.data;
    //   for (var i = 0; i < data.length; i++) {
    //     _this.resultsList[0].push(data[i].value);
    //   }
    // });
    _this.resultsList=[['','是','否']]
  },
  activated() {    
    let vm = this;
    this.Id = this.util.getUrlParam("Id");
    this.pType = this.util.getUrlParam("pType");
    // this.qualityDetails.jcr = this.userName;
    this.qualityDetails ={
      jcr: vm.userName,
      zgrq: new Date().format("yyyy-MM-dd")
    }
    if(this.pType == 'detail'){
      vm.isReadOnly = true
      let data = this.$route.params.data
      this.qualityDetails = data
      console.log(data)
			this.qualityDetails.sfxyzg = this.util.isNotEmpty(data.sfxyzg)?[data.sfxyzg]:['']; //是否通过
    }
      console.log('gfdgf',this.qualityDetails.sfxyzg)
  },
  methods: {
    queryDetals() {
      this.util.mask();
      //流程通过id加载
      this.monitorModel.Id = this.Id;
      var obj = new Object();
      obj["company"] = sessionUtil.getCompanyId();
      obj["Id"] = this.Id;
      var _this = this;

      var params = {
        operateType: "queryFormData",
        param: JSON.stringify(obj),
        sqlTableName: _this.sqlTableName,
        orderByName: "DocCreated DESC",
        totalRows: 10,
        firstRows: 0
      };
      console.log(params);
      this.util.post(
        "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat",
        params,
        function(res) {
          var data = res.data[0];
					console.log(data);
					_this.qualityDetails.siteName = data.siteName;
					_this.qualityDetails.projectNum = data.projectNum;
					_this.qualityDetails.projectName = data.projectName;
					_this.qualityDetails.orderEngineeringName = data.orderEngineeringName;
					_this.qualityDetails.subCompany = data.subCompany;
					_this.qualityDetails.constructionTeam = data.constructionTeam;
					_this.qualityDetails.administrativeDepartment = data.administrativeDepartment;
					_this.qualityDetails.projectJi = data.projectJi;
					_this.qualityDetails.inspectionDate = data.inspectionDate;
					_this.qualityDetails.isNeedRectification = data.isNeedRectification;
					_this.qualityDetails.checkContent = data.checkContent;
					_this.qualityDetails.checkContent = data.checkContent;
          // _this.qualityDetails.sn = data.sn;
          // _this.qualityDetails.xmid = data.xmid;
          // _this.qualityDetails.Subject = data.Subject;
          // _this.qualityDetails.fsrq = data.fsrq;
          // _this.qualityDetails.czy = data.czy;
          // _this.qualityDetails.projectName = data.projectName;
          // _this.selectProjModel.projectName = data.projectName;
          // _this.qualityDetails.projectNum = data.projectNum;
          // _this.qualityDetails.inspectionDate = data.inspectionDate;
          // _this.qualityDetails.inspectionContent = data.inspectionContent;
          // _this.qualityDetails.inspectionResult = [data.inspectionResult];
          // _this.qualityDetails.Remark = data.Remark;
          // _this.qualityDetails["_form_category_"] = data["_form_category_"];
          // _this.qualityDetails.lock = data.lock;
          //附件在附件组件中通过url 中的Id请求加载
          if (data.lock && _this.userId != data.czy) {
            _this.isReadOnly = true;
            _this.attachmentModel.isReadOnly = true;
          }

          _this.util.unmask();
        }
      );
    },
    selectPro(name) {
      if(name == "lxh"){        
        this.selectProjModel[name] = true;
      }else if(name == "zdmc" && this.util.isNotEmpty(this.qualityDetails.lxh)){
        this.selectProjModel[name] = true;
        this.selectProjModel.selectedLxh = this.qualityDetails.lxh        
      }else{
        this.util.alert("请先选择立项号！");
      }
    },

    acceptProj(data) {
			console.log(data);
			
      this.qualityDetails = data;
      this.qualityDetails.zgrq= new Date().format("yyyy-MM-dd")
      if((!this.util.isNotEmpty(data.lxmc)) && this.util.isNotEmpty(data.xmmc)){
        this.qualityDetails.lxmc = data.xmmc;
      }
    },
    resultChange() {},
    cancelSave() {},
    checkValid() {
      let vm = this;
      if (!this.validUtil.isNotEmpty(vm.pushData.zdmc)) {
        this.util.failueToast("请选择站点名称！");
        return false;
      }

      if (!this.validUtil.isNotEmpty(vm.pushData.zgrq)) {
        this.util.failueToast("请选择日期！");
        return false;
      }

      if (!this.validUtil.isNotEmpty(vm.pushData.sfxyzg)) {
        this.util.failueToast("请选择结果！");
        return false;
      }
      return true;
    },
    getData() {
      let vm = this;
      var _this = this;
      this.pushData ={
        "sn": "",
        "xmid": "",
        "pid": "",
        "Subject": "",
        "fgs": "",
        "sgd": "",
        "zgrq": "",
        "lxh": "",
        "lxmc": "",
        "ddgcmc": "",
        "zdmc": "",
        "zdId": "",
        "xmjl": "",
        "sfxyzg": "",
        "jcnr": "",
        "zgjg": "",
        "_form_category_": ""
      }   
      for(let name in _this.pushData){
        vm.pushData[name] = vm.util.isNotEmpty(vm.qualityDetails[name])?vm.qualityDetails[name]:'';
      }
      vm.pushData.sfxyzg = vm.pushData.sfxyzg[0]
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

      console.log(params);
      return params;
    },
    cancelCallback() {
      console.log(this.validUtil.isNotEmpty(this.Id));
      if (this.validUtil.isNotEmpty(this.Id)) {
        this.$router.back(-1);
      } else {
        history.back();
        //	WeixinJSBridge.call('closeWindow');
        //this.$router.back(-1)
      }
    },
    saveData() {
      var _this = this;
      var param = this.getData();
      if (!this.checkValid()) {
        return;
      }
      // if (this.qualityDetails.lock) {
      //   this.ancelCallback();
      //   return;
      // }
      if(this.pType == 'detail'){
        this.ancelCallback();
        return;
      }
      var url = "/admin/appDefaultFormAction!saveData.action";
      this.util.post(url, param, function(res) {
        //alert(res.msg)
        console.log(res);
        _this.util.alert("保存成功！");
        _this.cancelCallback();
        //_this.$router.push({name:'DayOffQuery',query:{pType:'saveBack'}})
      });
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
.star {
  position: relative;
}
.star::after {
  content: "*";
}
.itemName {
  color: #54aac4;
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


