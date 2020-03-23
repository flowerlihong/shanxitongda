<template>
    <div class="cptWrap">       
        <group>
            <cell-box >
                <div class="wrap-proName" >
                    <x-input title="title" placeholder="暂无进度数据" readonly v-model="mainFormData.upProgress">
                      <span slot="label" class="field">进度</span>
                    </x-input>
                </div>
            </cell-box>
            <cell-box >
                <div class="wrap-realStart" >
                    <div class="field">实际开始时间<span class="fz-red">*</span></div>
                    <div class="val "><datetime style="font-size:14px;" v-model="mainFormData.realStartDate" :readonly="isReadOnly || startDateFlag" 
                          ></datetime></div>
                </div>
            </cell-box>
            <cell-box >
                <div class="wrap-realEnd" >
                    <div class="field">实际结束时间</div>
                    <div class="val "><datetime style="font-size:14px;"  ref="endDate" v-model="mainFormData.realEndDate" :readonly="endDateFlag" 
                          ></datetime></div>
                </div>
            </cell-box>
            <x-textarea :max="200" style="width: 100%;font-size:14px;"  :readonly="isReadOnly" 
							 placeholder="请输入概述..."	v-model="mainFormData.cuWorkContent"
							 ref="remark" :autosize="true">
                    <span slot="label" class="field">工作内容概述</span>
                </x-textarea>
            <cell-box >
                <div class="wrap-thisRadio">                    
                    <x-input title="title" v-model="mainFormData.realCompletePrecent" type="number">
                      <div slot="label" class="field">本月完成占比<span class="fz-red">*</span></div>
                    </x-input>
                </div>
            </cell-box>
            <cell-box >
                <div class="wrap-thisManday">                    
                    <x-input title="title" v-model="mainFormData.nodeDays">
                      <div slot="label" class="field">本月投入人天<span class="fz-red">*</span></div>
                    </x-input>
                </div>
            </cell-box>

            <!-- </cell-box> -->
            <Attachment :model="attachmentModel" style="border-top: 1px solid #eee; font-size:14px;"></Attachment>
            <ProcessMonitor1 :model="monitorModel"></ProcessMonitor1>
            <mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
				
			</mt-popup>
            <div class="btns">
		  <p style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;">
				<button  style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
						@click="cancelCallback()" class="weui-btn weui-btn_mini weui-btn_default">取消</button>
				<button  style="width:48%;height: 45px;line-height: 45px;" @click="saveData()" 
						class="weui-btn weui-btn_mini weui-btn_primary">保存</button>
				
	 	  </p>
	  </div>
        </group>
        
    </div>
</template>

<script>
import { Group, CellBox, XTextarea, Datetime,XInput } from "vux";

import Attachment from "../common/Attachment1.vue";
import ProcessMonitor1 from "@/components/common/ProcessMonitor1";

export default {
  created() {
    this.Id = this.$route.query.Id;
    if (this.util.isNotEmpty(this.Id)) {
      this.query();
    }
  },
  activated() {
    this.util.unmask();
  },
  methods: {
    dataClone(source,dest) {
     if(typeof source == "object" &&typeof dest == "object"){
       for(var k in source){
         if(dest.hasOwnProperty(k)){
           dest[k] = source[k];
         }
       }
       console.log(dest)
       return dest
     }

    },
    query() {
      var url = "/admin/appAgentAction!runAgent.action",
        params = {
          agentId: "Agent_WeChat_Project_Init_Report",
          type: "editInfoWin",
          id: this.Id
        },
        _this = this;

      this.util.get(url, params, function(res) {
        if (res.data || res.data.length > 0) {
          _this.mainFormData=_this.dataClone(res.data[0],_this.mainFormData);
          if (
            (!_this.mainFormData.lock || _this.mainFormData.lock == 0) &&
            _this.mainFormData.czy == _this.sessionUtil.getUserName()
          ) {
            _this.isReadOnly = false;
          } else {
            _this.isReadOnly = true;
          }
        }
      });
    },
    checkValid() {
      var formData = this.mainFormData;
      var flag = false;
      if (!this.util.isNotEmpty(formData.realCompletePrecent)) {
        this.util.alert("本月完成占比不能为空！");
        return false;
      }
      if(isNaN(formData.realCompletePrecent)){
        this.util.alert("本月完成占比请输入数字！");
        return false;
      }
      if(parseFloat(formData.realCompletePrecent)>parseFloat(100) || parseFloat(formData.realCompletePrecent)<parseFloat(0)){
        this.util.alert('本月完成占比请填写0到100直接的数字！');
        return false;
      }
      if(parseFloat(formData.realCompletePrecent)<parseFloat(formData.upProgress)){
        this.util.alert('本月完成占比不能小于已经完成占比！');
        return false;
      }
      if (!this.util.isNotEmpty(formData.nodeDays)) {
        this.util.alert("本月投入人天不能为空！");
        return false;
      }
      if (formData.nodeDays == 0) {
        this.util.alert("本月投入人天不能为零！");
        return false;
      }
      if (!this.util.isNotEmpty(formData.realStartDate)) {
        this.util.alert("实际开始时间不能为空！");
        return false;
      }

      return true;
    },
    getData() {
      var _this = this;
      var filesData = new Array();
      for (var i = 0; i < this.attachmentModel.fileList.length; i++) {
        var file = this.attachmentModel.fileList[i];
        if (file.isNewFlag) {
          filesData.push(file);
        }
      }
      this.mainFormData["subCompany"] =this.sessionUtil.getsubCompanyId();
      var params = {
        sqlTableName: _this.details.sqlTableName,
        mainFormData: JSON.stringify(_this.mainFormData),
        filesData: JSON.stringify(filesData),
        deleteFilesData: _this.attachmentModel.deleteFilesList.join(",")
      };
      if (this.validUtil.isNotEmpty(this.Id)) {
        params["id"] = this.Id;
        params["businessKey"] = this.Id;
      }
      params["symbol"] = this.details.symbol;
      params["formId"] = this.details.formId;
      params["appId"] = this.details.appId;
      return params;
    },
    saveData() {
     
      if (this.mainFormData.lock) {
        this.cancelCallback();
        return;
      }
      if (!this.checkValid()) {
        return;
      }
      console.log("here")
      var _this = this;
      var param = this.getData();
      console.log(param);

      var url = "/admin/appDefaultFormAction!saveData.action";
      this.util.post(url, param, function(res) {
        if (res.success == true) {
          _this.util.alert("保存成功！");
          _this.cancelCallback();
        } else {
          _this.util.alert(res.msg);
        }
      });
    },
    cancelCallback() {
      if (this.validUtil.isNotEmpty(this.Id)) {
        this.$router.back(-1);
      } else {
        //WeixinJSBridge.call('closeWindow');
        history.back();
        //this.$router.back(-1)
      }
    }
  },
  watch: {
    isReadOnly(val, oldVal) {
      this.attachmentModel.isReadOnly = val;
    },
    'mainFormData.upProgress':{
      handler(newVal,oldVal){
        console.log("upProgress")
        if(newVal/1>0){
        this.startDateFlag  = true
      }else{
        this.startDateFlag  = false
      }
      },
      deep: true,
      immediate: true
    },
    'mainFormData.realCompletePrecent':{
      handler(newVal,oldVal){
        console.log("realCompletePrecent")
         if(newVal/1 == 100){
          this.endDateFlag = false;
        }else{
          this.endDateFlag = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  deactivated() {
    this.$destroy(true);
  },
  data() {
    return {        
      startDateFlag: true,
      endDateFlag: false,
      isReadOnly: false,
      Id: "",
      details: {
        formId: "DForm_U007_Project_Month_Report_Data",
        symbol: "sn,PMRD",
        sqlTableName: "U007_Project_Month_Report_Data",
        appId: "U007"
      },
      mainFormData: {
        stageCode: "",
        xmid: "",
        Subject: "",
        fsrq: "",
        parentId: "",
        czy: "",
        stageName: "",
        nodeWeight: "",
        version: "",
        dutyUserName: "",
        dutyUserId: "",
        planStartDate: "",
        planEndDate: "",
        ifCheck: "",
        upProgress: "",
        realStartDate: "",
        realEndDate: "",
        realCompletePrecent: "",
        nodeDays: "",
        nextCompletePretent: "",
        ifUpload: "",
        workContent: "",
        cuWorkContent: "",
        nextWorkContent: "",
        _form_category_: ""
      },
      selectProjModel: {
        selectProjVisible: false,
        projectName: "选择项目",
        projUid: "",
        moduleType: "progressProj"
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
      }
    };
  },
  components: {
    Group,
    CellBox,
    Datetime,
    XTextarea,
    XInput,
    Attachment,
    ProcessMonitor1
  }
};
</script>
<style>
.cptWrap .weui-cells.vux-no-group-title {
  margin-top: 0;
}
.wrap-type .weui-cell.vux-tap-active.weui-cell_access {
  padding: 0;
}
.cptWrap a.weui-cell {
  width: 100%;
  padding: 0;
  color: #54aac4;
}
.cptWrap a.weui-cell p {
  margin: 0;
}
div.wrap-realEnd .weui-cell__ft.vux-cell-primary.vux-datetime-value,div.wrap-realStart .weui-cell__ft.vux-cell-primary.vux-datetime-value{
  min-height: 19px;
}
</style>

<style lang="less" scoped>
.btns p {
  z-index: 5;
}
.choose {
  font-size: 14px;
}
.weui-cells {
  font-size: 14px;
}
.fz-red {
  color: red;
}
.pr20 {
  padding-right: 20px;
}
.weui-cell {
  padding: 10px;
}
.cptWrap {
  font-size: 14px;
}
div[class^="wrap"] {
  //   padding-left: 10px;
  font-size: 14px;
  display: flex;
  width: 100%;
  .weui-cell {
    padding: 0;
  }
}
div.wrap-proName{
  display: block;
}
div[class^="wrap-this"]{
  display: block;
}
.field {
  color: #54aac4;
  padding-right: 15px;
}
.val {
  flex: 1;
  text-align: right;
}
.wrap-type {
  .vux-cell-box {
    width: 100%;
  }
  .weui-cell.vux-tap-active {
    padding: 0;
  }
}
</style>



