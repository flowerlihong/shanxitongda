<template>
  <div class="maimForm">
    <div class="wrap">
      <div
        class="weui-cell weui-cell_select  myCell"
        style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">立项号<span style="color:red">*</span></span>
        </div>

        <div
          class="weui-cell__bd myCell-bd"
          @click="isReadOnly ? '' : selectPro('lxh')"
        >
          <span style="padding-right:5px;">
            {{ qualityDetails.lxh }}
          </span>
        </div>
      </div>

      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">立项名称<span style="color:red">*</span></span>
        </div>

        <div class="weui-cell__bd myCell-bd">
          <span style="padding-right:5px;">
            {{ qualityDetails.xmmc }}
          </span>
        </div>
      </div>

      <div
        class="weui-cell weui-cell_select  myCell"
        style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">站点名称<span style="color:red">*</span></span>
        </div>

        <div
          class="weui-cell__bd myCell-bd"
          @click="isReadOnly ? '' : selectPro('zdmc')"
        >
          <span style="padding-right:5px;">
            {{ qualityDetails.zdmc }}
          </span>
        </div>
      </div>
      <!-- 			
		  	<div class="weui-cell myCell" style="padding:10px 15px 10px 10px;height:auto;">
				<div class="weui-cell__hd">
					<span class="itemName">立项名称<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd">
					<span style="padding-right:5px;">
						{{qualityDetails.xmmc}}
					</span>
					
				</div>		
			</div>
		  	<div class="weui-cell myCell" style="padding:10px 15px 10px 10px;height:auto;">
				<div class="weui-cell__hd">
					<span class="itemName">立项号<span style="color:red">*</span></span>
				</div>
				<div  class="weui-cell__bd myCell-bd">
					<span style="padding-right:5px;">
						{{qualityDetails.lxh}}
					</span>
					
				</div>		
			</div> -->
      <div
        class="weui-cell myCell"
        style="padding:10px 15px 10px 10px;height:auto;"
      >
        <div class="weui-cell__hd">
          <span class="itemName"
            >订单（工程）名称<span style="color:red">*</span></span
          >
        </div>
        <div class="weui-cell__bd myCell-bd">
          <span style="padding-right:5px;">
            {{ qualityDetails.htmc }}
          </span>
        </div>
      </div>
      <div
        class="weui-cell myCell"
        style="padding:10px 15px 10px 10px;height:auto;"
      >
        <div class="weui-cell__hd">
          <span class="itemName">分公司<span style="color:red">*</span></span>
        </div>
        <div class="weui-cell__bd myCell-bd">
          <span style="padding-right:5px;">
            {{ qualityDetails.fgsmc }}
          </span>
        </div>
      </div>
      <div
        class="weui-cell myCell"
        style="padding:10px 15px 10px 10px;height:auto;"
      >
        <div class="weui-cell__hd">
          <span class="itemName">建设单位<span style="color:red">*</span></span>
        </div>
        <div class="weui-cell__bd myCell-bd">
          <span style="padding-right:5px;">
            {{ qualityDetails.jsdw }}
          </span>
        </div>
      </div>
      <div
        class="weui-cell myCell"
        style="padding:10px 15px 10px 10px;height:auto;"
      >
        <div class="weui-cell__hd">
          <span class="itemName">管理部门<span style="color:red">*</span></span>
        </div>
        <div class="weui-cell__bd myCell-bd">
          <span style="padding-right:5px;">
            {{ qualityDetails.gsglbm }}
          </span>
        </div>
      </div>
      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd "><span class="itemName">操作员</span></div>

        <div class="weui-cell__bd">
          <span>{{ qualityDetails.jcr }}</span>
        </div>
      </div>

      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">检查日期<span style="color:red">*</span></span>
        </div>
        <div class="weui-cell__bd ">
          <datetime
            title=""
            class="col-xs-12 be-check"
            :readonly="isReadOnly"
            v-model="qualityDetails.jcrq"
            style="padding:0px;padding-right:15px;"
            default-selected-value="date"
            format="YYYY-MM-DD"
            :placeholder="'请选择日期'"
          ></datetime>
        </div>
      </div>
      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">是否通过<span style="color:red">*</span></span>
        </div>
        <div class="weui-cell__bd ">
          <popup-picker
            style="width:100%; color:red"
            :data="resultsList"
            :disabled="isReadOnly"
            v-model="qualityDetails.sftg"
            @on-change="resultChange"
            :placeholder="'选择检查结果'"
          >
          </popup-picker>
        </div>
      </div>
      <!-- 上传附件，内部组件 -->
      <Attachment
        :fileUrl="fileUrl"
        :model="attachmentModel"
        style="border-top: 1px solid #eee;"
      ></Attachment>
      <!-- 点击查看流程流转明细，内部组件-->
      <ProcessMonitor1
        :processUrl="processUrl"
        :model="monitorModel"
      ></ProcessMonitor1>
      <!-- 底部弹出框，mint-ui组件-->
      <mt-popup
        v-if="selectProjModel.lxh"
        v-model="selectProjModel.lxh"
        position="right"
        popup-transition="popup-fade"
        style="width:100%;height:100%"
      >
        <SelectProj
          :openWord="selectProjModel.lxhOpenWord"
          :theUrl="selectProjModel.lxhUrl"
          :showWord="selectProjModel.lxhShowWord"
          :mess="selectProjModel"
          v-on:selectProjCallback="acceptProj"
          :showArr="showArr"
          ref="projfile"
        ></SelectProj>
      </mt-popup>
      <mt-popup
        v-if="selectProjModel.zdmc"
        v-model="selectProjModel.zdmc"
        position="right"
        popup-transition="popup-fade"
        style="width:100%;height:100%"
      >
        <SelectProj
          :openWord="selectProjModel.zdmcOpenWord"
          :theUrl="selectProjModel.zdmcUrl"
          :showWord="selectProjModel.zdmcShowWord"
          :mess="selectProjModel"
          v-on:selectProjCallback="acceptProj"
          :showArr="showArr"
          ref="projfile"
        ></SelectProj>
      </mt-popup>
    </div>
    <div class="btns">
      <p
        style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;z-index:2;"
      >
        <button
          style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
          @click="cancelCallback()"
          class="weui-btn weui-btn_mini weui-btn_default"
        >
          取消
        </button>
        <button
          style="width:48%;height: 45px;line-height: 45px;"
          @click="saveData()"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          保存
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import VoiceRecognition from '../../common/VoiceRecognition.vue'
import Attachment from '../../common/Attachment1.vue'
import ProcessMonitor1 from '../../common/ProcessMonitor2'
import SelectProj from '../../common/SelectProj3.vue'
import { Datetime, PopupPicker, XButton, XTextarea } from 'vux'
import { mapState } from 'vuex'
import { cloneObj, sessionUtil } from '@/utils/utils.js'
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
      pType: '',
      chooseType: '',
      showArr: ['data'],
      processUrl: '', //流程接口
      fileUrl: '', //文件接口
      showWord: 'zdmc',
      theUrl:
        '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=WeChat&Type=siteMessage', //站点接口
      lxhUrl:
        '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=WeChat&Type=projectNo', //立项号接口
      qualityDetails: {
        jcr: ''
      },
      isReadOnly: false,
      resultsList: [['']],
      voiceRecognition: {
        title: '调休事由',
        isReadOnly: false,
        placeholder: '请输入调休原因...',
        content: ''
      },
      attachmentModel: {
        isReadOnly: false,
        xtype: 'file',
        title: '上传附件',
        fileList: [],
        deleteFilesList: []
      },

      selectProjModel: {
        // lxh: "选择项目",
        // projUid: "",
        selectedLxh: '',
        moduleType: 'gcPro',

        lxh: false,
        lxhOpenWord: 'lxh',
        projUid: '',
        lxhUrl:
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=WeChat&Type=projectNo',
        lxhShowWord: 'xmmc',

        zdmc: false,
        zdmcOpenWord: 'zdmc',
        projUid: '',
        zdmcUrl:
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=WeChat&Type=siteMessage',
        zdmcShowWord: 'zdmc'
      },
      monitorModel: {
        zdId: ''
      },
      zdId: '',
      sqlTableName: 'U016_GCZLJC',
      symbol: 'sn,GCZLJC',
      formId: 'DForm_U016_GCZLJC',
      appId: 'U016',
      subFormData: [],
      pushData: {},
      userId: ''
    }
  },
  deactivated() {
    this.$destroy(true)
  },
  computed: {
    ...mapState({
      userUid: state => state.userUid,
      userName: state => state.userName
    })
  },
  created() {
    this.util.initWxJsSdk(this)
    this.userId = this.sessionUtil.getUserId()
    console.log(
      '%c',
      "padding:50px;line-height:120px;background:url('http://hiphotos.baidu.com/feed/pic/item/ca1349540923dd543dc9be7dda09b3de9c824868.jpg') no-repeat;background-size: 100px 100px; "
    )
    var _this = this
    //  在数据字典中查询检查结果
    var sql =
      'select value,name,DocCreated from ST01_Data_Dictionary_det where ' +
      "pid = (select top 1 ID from ST01_Data_Dictionary where DDID='inspectionResult')"
    var params = {
      operateType: 'queryDataByEncSql',
      querySql: _this.util._encode(sql),
      totalRows: 25,
      firstRows: 0
    }

    // var url =
    //   "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat";
    // this.util.post(url, params, function(res) {
    //   console.log(res);

    //   _this.resultsList = [[]];
    //   var data = res.data;
    //   for (var i = 0; i < data.length; i++) {
    //     _this.resultsList[0].push(data[i].value);
    //   }
    //   console.log('fds',_this.resultsList)
    // });
    _this.resultsList = [['', '是', '否']]
  },
  activated() {
    let vm = this

    this.zdId = this.util.getUrlParam('zdId')
    this.pType = this.util.getUrlParam('pType')
    // this.qualityDetails.jcr = this.userName;
    this.qualityDetails = {
      jcr: vm.userName,
      jcrq: new Date().format('yyyy-MM-dd')
    }
    if (this.pType == 'detail') {
      vm.isReadOnly = true
      console.log(this.$route.params.data, 'params')

      let data = this.$route.params.data
      // this.qualityDetails = this.$route.params.data
      this.qualityDetails.AddName = data.AddName
      this.qualityDetails.AddName_CN = data.AddName_CN
      this.qualityDetails.DepartName = data.DepartName
      this.qualityDetails.DocCreated = data.DocCreated //保存日期
      this.qualityDetails.Id = data.Id
      this.qualityDetails.Subject = data.Subject
      this.qualityDetails.Organization = data.Organization
      this.qualityDetails.ddId = data.ddId //订单id
      this.qualityDetails.fgsmc = data.fgsmc
      this.qualityDetails.gsglbm = data.gsglbm //管理部门
      this.qualityDetails.htmc = data.htmc
      this.qualityDetails.jcr = data.jcr
      this.qualityDetails.jcrq = data.jcrq
      this.qualityDetails.jsdw = data.jsdw //建设单位
      this.qualityDetails.lxh = data.lxh
      this.qualityDetails.sfjc = data.sfjc //是否检查
      this.qualityDetails.sftg = this.util.isNotEmpty(data.sftg)
        ? [data.sftg]
        : [''] //是否通过
      this.qualityDetails.sn = data.sn //单号
      this.qualityDetails.subCompany = data.subCompany //分公司编号
      this.qualityDetails.xmid = data.xmid
      this.qualityDetails.xmmc = data.xmmc
      this.qualityDetails.zdId = data.zdId
      this.qualityDetails.zdmc = data.zdmc
      this.qualityDetails.inspectionResult = this.util.isNotEmpty([
        data.inspectionResult
      ])
        ? [data.inspectionResult]
        : undefined
    } else {
      this.qualityDetails.Subject = '质量检查'
    }
  },
  methods: {
    queryDetals() {
      this.util.mask()
      //流程通过id加载
      this.monitorModel.zdId = this.zdId
      var obj = new Object()
      obj['company'] = sessionUtil.getCompanyId()
      obj['zdId'] = this.zdId
      var _this = this

      var params = {
        operateType: 'queryFormData',
        param: JSON.stringify(obj),
        sqlTableName: _this.sqlTableName,
        orderByName: 'DocCreated DESC',
        totalRows: 10,
        firstRows: 0
      }

      console.log(params)
      this.util.post(
        '/admin/appAgentAction!runAgent.action?agentId=Agent_SXWB_Wechat_xiaoxi&appId=WeChat&Type=qualityInform',
        params,
        function(res) {
          var data = res.data.data[0]
          console.log(data)

          // _this.qualityDetails = data;

          _this.qualityDetails.lxh = data.lxh
          _this.qualityDetails.jcr = data.jcr
          _this.qualityDetails.jcrq = data.jcrq
          _this.qualityDetails.zdmc = data.zdmc
          if (data.lock && _this.userId != data.jcr) {
            _this.isReadOnly = true
            _this.attachmentModel.isReadOnly = true
          }

          _this.util.unmask()
        }
      )
    },
    selectPro(name) {
      this.chooseType = name
      if (name == 'lxh') {
        this.selectProjModel[name] = true
      } else if (
        name == 'zdmc' &&
        this.util.isNotEmpty(this.qualityDetails.lxh)
      ) {
        this.selectProjModel[name] = true
        this.selectProjModel.selectedLxh = this.qualityDetails.lxh
      } else {
        this.util.alert('请先选择立项号！')
      }
    },

    acceptProj(data) {
      if (this.chooseType == 'zdmc') {
        // this.qualityDetails.zdId = data.zdId;
        this.qualityDetails.zdId = data.Id
        this.qualityDetails.zdmc = data.zdmc
        this.qualityDetails.htmc = data.htmc
      } else {
        this.qualityDetails.AddName = data.AddName
        this.qualityDetails.AddName_CN = data.AddName_CN
        this.qualityDetails.DepartName = data.DepartName
        this.qualityDetails.DocCreated = data.DocCreated //保存日期
        this.qualityDetails.Subject = data.Subject
        this.qualityDetails.Organization = data.Organization
        this.qualityDetails.ddId = data.ddId //订单id
        this.qualityDetails.fgsmc = data.fgsmc
        this.qualityDetails.gsglbm = data.gsglbm //管理部门
        this.qualityDetails.jcr = this.userName

        // this.qualityDetails.jcrq = data.jcrq;
        this.qualityDetails.jsdw = data.jsdw //建设单位
        this.qualityDetails.lxh = data.lxh
        this.qualityDetails.sfjc = data.sfjc //是否检查
        // this.qualityDetails.sftg = ['']; //是否通过
        this.qualityDetails.sn = data.sn //单号
        this.qualityDetails.subCompany = data.subCompany //分公司编号
        this.qualityDetails.xmid = data.Id
        this.qualityDetails.xmmc = data.xmmc
        this.qualityDetails.inspectionResult = this.util.isNotEmpty([
          data.inspectionResult
        ])
          ? [data.inspectionResult]
          : undefined
      }

      // this.selectProjModel.lxh = data.lxh;
      // this.qualityDetails.lxh = data.lxh;
      // this.qualityDetails.xmid = data.xmid;
      // this.qualityDetails.projectNum = data.projectNum;
      // this.selectedProjInfo = data;
    },
    resultChange(value) {
      console.log(value)
      console.log(this.qualityDetails.inspectionResult)
    },
    cancelSave() {},
    checkValid() {
      let vm = this
      if (!this.validUtil.isNotEmpty(vm.pushData.zdmc)) {
        this.util.failueToast('请选择站点名称！')
        return false
      }

      if (!this.validUtil.isNotEmpty(vm.pushData.jcrq)) {
        this.util.failueToast('请选择日期！')
        return false
      }

      if (!this.validUtil.isNotEmpty(vm.pushData.sftg)) {
        this.util.failueToast('请选择结果！')
        return false
      }
      return true
    },
    getData() {
      let vm = this
      // this.qualityDetails.sftg = this.qualityDetails.sftg[0]
      var _this = this
      // this.pushData.offReson = this.voiceRecognition.content;
      // this.pushData = this.qualityDetails
      this.pushData = {
        sn: '',
        jcr: '',
        jcrq: '',
        glbm: '',
        jsdw: '',
        zdId: '',
        fgs: '',
        lxh: '',
        xmmc: '',
        xmid: '',
        htmc: '',
        ddId: '',
        zdmc: '',
        sfjc: '',
        sftg: '',
        Subject: '',
        _form_category_: ''
      }

      for (let name in _this.pushData) {
        vm.pushData[name] = vm.util.isNotEmpty(vm.qualityDetails[name])
          ? vm.qualityDetails[name]
          : ''
      }
      vm.pushData.sftg = vm.pushData.sftg[0]
      this.pushData['subCompany'] = this.sessionUtil.getsubCompanyId()
      var filesData = new Array()
      for (var i = 0; i < this.attachmentModel.fileList.length; i++) {
        var file = this.attachmentModel.fileList[i]
        if (file.isNewFlag) {
          filesData.push(file)
        }
      }

      var params = {
        sqlTableName: _this.sqlTableName,
        mainFormData: JSON.stringify(_this.pushData),
        filesData: JSON.stringify(filesData),
        deleteFilesData: _this.attachmentModel.deleteFilesList.join(',')
      }
      if (this.validUtil.isNotEmpty(this.zdId)) {
        params['zdId'] = this.zdId
        params['businessKey'] = this.zdId
      }
      params['symbol'] = this.symbol
      params['formId'] = this.formId
      params['appId'] = this.appId

      console.log(params)
      return params
    },
    cancelCallback() {
      console.log(this.validUtil.isNotEmpty(this.zdId))
      if (this.validUtil.isNotEmpty(this.zdId)) {
        this.$router.back(-1)
      } else {
        history.back()
      }
    },
    saveData() {
      var _this = this
      var param = this.getData()
      if (this.pType == 'detail') {
        return
      }
      if (!this.checkValid()) {
        return
      }
      // if (this.qualityDetails.lock) {
      //   this.ancelCallback();
      //   return;
      // }
      var url = '/admin/appDefaultFormAction!saveData.action'
      this.util.post(url, param, function(res) {
        console.log(res)
        _this.util.alert('保存成功！')
        _this.cancelCallback()
      })
    }
  }
}
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
  content: '*';
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
