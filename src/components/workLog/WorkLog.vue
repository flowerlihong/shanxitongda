<template>
  <div class="maimForm">
    <div class="wrap">
      <div
        class="weui-cell weui-cell_select  myCell"
        style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">项目经理</span>
        </div>

        <div
          class="weui-cell__bd myCell-bd"
          @click="isReadOnly ? '' : selectPro('xmjl')"
        >
          <span style="padding-right:10px;">
            {{ qualityDetails.xmjl }}
          </span>
        </div>
      </div>

      <div
        class="weui-cell myCell"
        style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <!-- <span class="itemName">立项号</span> -->
          <button
            class="weui-btn_mini"
            @click="isReadOnly ? '' : selectPro('lxh')"
          >
            立项号
          </button>
        </div>
        <div class="weui-cell__bd myCell-bd">
          <input
            v-model="qualityDetails.lxh"
            style="text-align: right;padding-right:10px;"
            type="string"
            onkeyup="value=value.replace(/(^\s*)|(\s*$)/g,'') "
            placeholder
          />
        </div>
      </div>

      <div
        class="weui-cell myCell"
        style="padding-left: 10px;padding-right:0px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">工程名称</span>
        </div>

        <div class="weui-cell__bd myCell-bd">
          <input
            v-model="qualityDetails.xmmc"
            style="text-align: right;padding-right:10px;"
            type="string"
            onkeyup="value=value.replace(/(^\s*)|(\s*$)/g,'') "
            placeholder
          />
        </div>
      </div>

      <div
        class="weui-cell myCell"
        style="padding:10px 15px 10px 10px;height:auto;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <!-- <span class="itemName">站点段落</span> -->
          <button
            class="weui-btn_mini"
            @click="isReadOnly ? '' : selectPro('zdmc')"
          >
            站点段落
          </button>
        </div>
        <div class="weui-cell__bd myCell-bd">
          <input
            v-model="qualityDetails.zddl"
            style="text-align: right;"
            type="string"
            onkeyup="value=value.replace(/(^\s*)|(\s*$)/g,'') "
            placeholder
          />
        </div>
      </div>

      <div
        class="weui-cell myCell weui-cell_select"
        style="padding:10px 15px 10px 10px;height:auto;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">项目部人员</span>
        </div>
        <div
          class="weui-cell__bd myCell-bd"
          @click="isReadOnly ? '' : selectPro('xmbry')"
        >
          <span style="padding-right:5px;">
            {{ qualityDetails.xmbry }}
          </span>
        </div>
      </div>
      <div
        class="weui-cell myCell weui-cell_select"
        style="padding:10px 15px 10px 10px;height:auto;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">施工人员</span>
        </div>
        <div
          class="weui-cell__bd myCell-bd"
          @click="isReadOnly ? '' : selectPro('sgry')"
        >
          <span style="padding-right:5px;">
            {{ qualityDetails.sgry }}
          </span>
        </div>
      </div>
      <div
        class="weui-cell myCell weui-cell_select"
        style="padding:10px 15px 10px 10px;height:auto;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">项目部车辆</span>
        </div>
        <div
          class="weui-cell__bd myCell-bd"
          @click="isReadOnly ? '' : selectPro('xmbcl')"
        >
          <span style="padding-right:5px;">
            {{ qualityDetails.xmbcl }}
          </span>
        </div>
      </div>
      <div
        class="weui-cell myCell"
        style="padding:10px 15px 10px 10px;height:auto;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">施工车辆</span>
        </div>
        <div class="weui-cell__bd myCell-bd">
          <input
            v-model="qualityDetails.sgcl"
            style="text-align: right;"
            type="string"
            onkeyup="value=value.replace(/(^\s*)|(\s*$)/g,'') "
            placeholder
          />
        </div>
      </div>
      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd "><span class="itemName">填表人</span></div>

        <div class="weui-cell__bd myCell-bd">
          <span>{{ qualityDetails.czy }}</span>
        </div>
      </div>

      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd">
          <span class="itemName">日期</span>
        </div>
        <div class="weui-cell__bd myCell-bd">
          <span>{{ qualityDetails.fsrq }}</span>
        </div>
      </div>
      <div class="price" style="text-align:left;background-color: #eeefef;">
        <span class="itemName">前一日完成情况</span>
      </div>
      <div style="text-align:left;">
        <div
          class="weui-cell  myCell"
          style="padding-left: 10px;border-top:1px solid #eee"
        >
          <div class="weui-cell__hd">
            <span class="itemName">计划工作内容</span>
          </div>
          <div class="weui-cell__bd myCell-bd">
            <span>{{ qualityDetails.gzjh }}</span>
          </div>
        </div>
        <x-textarea
          :max="200"
          style="width: 100%;font-size:14px;padding:10px 15px 10px 10px;height:auto;"
          :readonly="isReadOnly"
          placeholder="请输入..."
          v-model="qualityDetails.sjwcqk"
          ref="remark"
          :autosize="true"
        >
          <span
            slot="label"
            class="itemName"
            style="padding:0 10px 0 0;height:auto;"
            >实际完成情况</span
          >
        </x-textarea>

        <div
          class="weui-cell  myCell"
          style="padding-left: 10px;border-top:1px solid #eee"
        >
          <div class="weui-cell__hd">
            <span class="itemName">计划使用材料</span>
          </div>
          <div class="weui-cell__bd myCell-bd">
            <span>{{ qualityDetails.jhsycl1 }}</span>
          </div>
        </div>

        <x-textarea
          :max="200"
          style="width: 100%;font-size:14px;padding:10px 15px 10px 10px;height:auto;"
          :readonly="isReadOnly"
          placeholder="请输入..."
          v-model="qualityDetails.sjsycl"
          ref="remark"
          :autosize="true"
        >
          <span
            slot="label"
            class="itemName"
            style="padding:0 10px 0 0;height:auto;"
            >实际使用材料</span
          >
        </x-textarea>

        <!-- 上传附件，内部组件 -->
        <Attachment
          :fileUrl="fileUrl"
          :model="attachmentModel"
          style="border-top: 1px solid #eee;"
        ></Attachment>
      </div>

      <div class="price" style="text-align:left;background-color: #eeefef;">
        <span class="itemName">当日工作计划</span>
      </div>
      <div style="text-align:left;">
        <x-textarea
          :max="200"
          style="width: 100%;font-size:14px;height:auto;"
          :readonly="isReadOnly"
          placeholder="请输入..."
          v-model="qualityDetails.jhsycl2"
          ref="remark"
          :autosize="true"
        >
          <span
            slot="label"
            class="itemName"
            style="padding:0 10px 0 0;height:auto;"
            >计划工作内容</span
          >
        </x-textarea>
        <x-textarea
          :max="200"
          style="width: 100%;font-size:14px;height:auto;border-top:1px solid #eee"
          :readonly="isReadOnly"
          placeholder="请输入..."
          v-model="qualityDetails.gznr"
          ref="remark"
          :autosize="true"
        >
          <span
            slot="label"
            class="itemName"
            style="padding:0 10px 0 0;height:auto;"
            >计划使用材料</span
          >
        </x-textarea>

        <!-- 上传附件，内部组件 -->
        <Attachment
          :fileUrl="fileUrl"
          :model="attachmentModel1"
          style="border-top: 1px solid #eee;"
        ></Attachment>
      </div>

      <x-textarea
        :max="200"
        style="width: 100%;font-size:14px;padding:10px 15px 10px 10px;height:auto;border-top:1px solid #eee"
        :readonly="isReadOnly"
        placeholder="请输入备注..."
        v-model="qualityDetails.Remark"
        ref="remark"
        :autosize="true"
      >
        <span
          slot="label"
          class="itemName"
          style="padding:0 10px 0 0;height:auto;"
          >备注</span
        >
      </x-textarea>

      <!-- 点击查看流程流转明细，内部组件-->
      <ProcessMonitor1
        :processUrl="processUrl"
        :model="monitorModel"
      ></ProcessMonitor1>
      <!-- 底部弹出框，mint-ui组件-->
      <!-- 立项号 -->
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
      <!-- 站点 -->
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
      <!-- 项目经理 -->
      <mt-popup
        v-if="selectProjModel.xmjl"
        v-model="selectProjModel.xmjl"
        position="right"
        popup-transition="popup-fade"
        style="width:100%;height:100%"
      >
        <SelectProj
          :openWord="selectProjModel.xmjlOpenWord"
          :theUrl="selectProjModel.xmjlUrl"
          :showWord="selectProjModel.xmjlShowWord"
          :mess="selectProjModel"
          v-on:selectProjCallback="acceptProj"
          :showArr="showArr"
          ref="projfile"
        ></SelectProj>
      </mt-popup>

      <!-- 项目部人员 -->
      <mt-popup
        v-if="selectProjModel.xmbry"
        v-model="selectProjModel.xmbry"
        position="right"
        popup-transition="popup-fade"
        style="width:100%;height:100%"
      >
        <SelectProj
          :openWord="selectProjModel.xmbryOpenWord"
          :theUrl="selectProjModel.xmbryUrl"
          :showWord="selectProjModel.xmbryShowWord"
          :mess="selectProjModel"
          v-on:selectProjCallback="acceptProj"
          :showArr="showArr"
          ref="projfile"
        ></SelectProj>
      </mt-popup>

      <!-- 施工人员 -->
      <mt-popup
        v-if="selectProjModel.sgry"
        v-model="selectProjModel.sgry"
        position="right"
        popup-transition="popup-fade"
        style="width:100%;height:100%"
      >
        <SelectProj
          :openWord="selectProjModel.sgryOpenWord"
          :theUrl="selectProjModel.sgryUrl"
          :showWord="selectProjModel.sgryShowWord"
          :mess="selectProjModel"
          v-on:selectProjCallback="acceptProj"
          :showArr="showArr"
          ref="projfile"
        ></SelectProj>
      </mt-popup>

      <!-- 项目部车辆 -->
      <mt-popup
        v-if="selectProjModel.xmbcl"
        v-model="selectProjModel.xmbcl"
        position="right"
        popup-transition="popup-fade"
        style="width:100%;height:100%"
      >
        <SelectProj
          :openWord="selectProjModel.xmbclOpenWord"
          :theUrl="selectProjModel.xmbclUrl"
          :showWord="selectProjModel.xmbclShowWord"
          :mess="selectProjModel"
          v-on:selectProjCallback="acceptProj"
          :showArr="showArr"
          ref="projfile"
        ></SelectProj>
      </mt-popup>
    </div>
    <div class="btns">
      <p
        style="background-color:rgb(239, 239, 239);margin: 0px;padding-bottom: 15px;position: fixed;width: 100%;bottom: 0px;z-index:2;"
      >
        <button
          style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
          @click="cancelCallback()"
          class="weui-btn weui-btn_mini weui-btn_default"
        >
          取消
        </button>
        <button
          v-if="!disabled"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="saveData()"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          保存
        </button>
        <button
          style="width:48%;height: 45px;line-height: 45px;"
          v-if="disabled"
          disabled="disabled"
          class="weui-btn weui-btn_mini"
        >
          保存
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import VoiceRecognition from '../common/VoiceRecognition.vue'
import Attachment from '../common/Attachment1.vue'
import ProcessMonitor1 from '../common/ProcessMonitor2'
import SelectProj from '../common/SelectProj3.vue'
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
      disabled: false,
      chooseType: '',
      showArr: ['data'],
      processUrl: '', //流程接口
      fileUrl: '', //文件接口
      showWord: 'zdmc',
      jlUrl:
        '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getlogbookPM', //项目经理接口
      theUrl:
        '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=WeChat&Type=getlogProjectSite', //站点接口
      lxhUrl:
        '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getlogProject',
      //立项号接口
      qualityDetails: {},
      isReadOnly: false,
      voiceRecognition: {
        title: '调休事由',
        isReadOnly: false,
        placeholder: '请输入调休原因...',
        content: ''
      },
      attachmentModel: {
        isReadOnly: false,
        xtype: 'file1',
        title: '现场情况（影像资料上传）',
        fileList: [],
        deleteFilesList: []
      },
      attachmentModel1: {
        isReadOnly: false,
        xtype: 'file2',
        title: '工作地点（地图标注）',
        fileList: [],
        deleteFilesList: []
      },

      selectProjModel: {
        selectedLxh: '',
        moduleType: 'gcPro',
        projUid: '',

        lxh: false,
        lxhOpenWord: 'lxh',

        lxhUrl:
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getlogProject',
        lxhShowWord: 'xmmc',

        zdmc: false,
        zdmcOpenWord: 'zdmc',
        zdmcUrl:
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getpracticeType',
        zdmcShowWord: 'zdmc',

        xmjl: false,
        xmjlOpenWord: 'xmjl',
        xmjlUrl:
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getlogbookPM',
        xmjlShowWord: 'yzxmjl',

        xmbry: false,
        xmbryOpenWord: 'xmbry',
        xmbryUrl:
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getlogProjectStaff',
        xmbryShowWord: 'xmbry',

        sgry: false,
        sgryOpenWord: 'sgry',
        sgryUrl:
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getlogBuilders',
        sgryShowWord: 'sgry',

        xmbcl: false,
        xmbclOpenWord: 'xmbcl',
        xmbclUrl:
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getlogProjectVehicle',
        xmbclShowWord: 'xmbcl'
      },
      monitorModel: {
        zdId: ''
      },
      zdId: '',
      sqlTableName: 'U016_GZRZ',
      symbol: 'sn,GZRZ',
      formId: 'DForm_U016_GZRZ',
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
    // console.log(
    //   '%c',
    //   "padding:50px;line-height:120px;background:url('http://hiphotos.baidu.com/feed/pic/item/ca1349540923dd543dc9be7dda09b3de9c824868.jpg') no-repeat;background-size: 100px 100px; "
    // )
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
  },
  activated() {
    let vm = this
    this.zdId = this.util.getUrlParam('zdId')
    this.pType = this.util.getUrlParam('pType')
    // this.qualityDetails.jcr = this.userName;
    this.qualityDetails = {
      czy: vm.userName,
      fsrq: new Date().format('yyyy-MM-dd')
    }
    if (this.pType == 'detail') {
      vm.isReadOnly = true
      let data = this.$route.params.data
      this.qualityDetails = data
      // console.log('获取参数', this.qualityDetails)
      this.disabled = true
      // this.qualityDetails.sfxyzg = this.util.isNotEmpty(data.sfxyzg)
      //   ? [data.sfxyzg]
      //   : [''] //是否通过
    } else {
      this.qualityDetails.Subject = ''
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
      // console.log(params)
      this.util.post(
        '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_xaxi&appId=Wechat&Type=getlogbook',
        params,
        function(res) {
          var data = res.data.data[0]
          // console.log(data,333)
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
      } else if (name == 'xmjl') {
        this.selectProjModel[name] = true
      } else if (
        (name == 'xmbry' || name == 'sgry' || name == 'xmbcl') &&
        this.util.isNotEmpty(this.qualityDetails.xmjl)
      ) {
        // console.log(
        //   'this.selectProjModel.selectedLxh',
        //   this.selectProjModel.selectedLxh
        // )

        this.selectProjModel[name] = true
        this.selectProjModel.selectedLxh = this.qualityDetails.xmjl
      } else if (
        (name == 'xmbry' || name == 'sgry' || name == 'xmbcl') &&
        !this.util.isNotEmpty(this.qualityDetails.xmjl)
      ) {
        this.util.alert('请先选择项目经理！')
      } else {
        this.util.alert('请先选择立项号！')
      }
    },

    acceptProj(data) {
      // console.log(this.chooseType, 'this.chooseType')

      if (this.chooseType == 'zdmc') {
        // this.qualityDetails.zdId = data.zdId;
        this.qualityDetails.zdId = data.Id
        this.qualityDetails.zddl = data.zdmc
        this.qualityDetails.htmc = data.htmc
      } else if (this.chooseType == 'xmjl') {
        // console.log(data, 456)
        this.qualityDetails.xmjl = data.yzxmjl
        this.qualityDetails.gzjh = data.gznr
        this.qualityDetails.jhsycl1 = data.jhsycl2
      } else if (this.chooseType == 'xmbry') {
        this.qualityDetails.xmbry = data.xm
      } else if (this.chooseType == 'xmbcl') {
        this.qualityDetails.xmbcl = data.cph
      } else if (this.chooseType == 'sgry') {
        this.qualityDetails.sgry = data.sgry
      } else {
        this.qualityDetails.AddName = data.AddName
        this.qualityDetails.AddName_CN = data.AddName_CN
        this.qualityDetails.ddId = data.ddId //订单id

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
        // this.qualityDetails.inspectionResult = this.util.isNotEmpty([
        //   data.inspectionResult
        // ])
        //   ? [data.inspectionResult]
        //   : undefined
      }

      // this.selectProjModel.lxh = data.lxh;
      // this.qualityDetails.lxh = data.lxh;
      // this.qualityDetails.xmid = data.xmid;
      // this.qualityDetails.projectNum = data.projectNum;
      // this.selectedProjInfo = data;
    },
    resultChange(value) {
      // console.log(value)
      // console.log(this.qualityDetails.inspectionResult)
    },
    cancelSave() {},
    // checkValid() {
    //   let vm = this
    //   if (!this.validUtil.isNotEmpty(vm.pushData.zdmc)) {
    //     this.util.failueToast('请选择站点名称！')
    //     return false
    //   }
    //   return true
    // },
    getData() {
      let vm = this
      // this.qualityDetails.sftg = this.qualityDetails.sftg[0]
      var _this = this
      // this.pushData.offReson = this.voiceRecognition.content;
      // this.pushData = this.qualityDetails
      this.pushData = {
        sn: '',
        xmjl: '',
        lxh: '',
        xmmc: '',
        zddl: '',
        xmbry: '',
        sgry: '',
        xmbcl: '',
        sgcl: '',
        czy: '',
        fsrq: '',
        gzjh: '',
        ddId: '',
        xmid: '',
        sjwcqk: '',
        sjsycl: '',
        jhsycl1: '',
        jhsycl2: '',
        gznr: '',
        Remark: '',
        _form_category_: ''
      }

      for (let name in _this.pushData) {
        vm.pushData[name] = vm.util.isNotEmpty(vm.qualityDetails[name])
          ? vm.qualityDetails[name]
          : ''
      }
      // vm.pushData.sftg = vm.pushData.sftg[0]
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

      // console.log(params, '保存参数')
      return params
    },
    cancelCallback() {
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
      // if (!this.checkValid()) {
      //   return
      // }
      // if (this.qualityDetails.lock) {
      //   this.ancelCallback();
      //   return;
      // }
      var url = '/admin/appDefaultFormAction!saveData.action'
      this.util.post(url, param, function(res) {
        // console.log(res)
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
