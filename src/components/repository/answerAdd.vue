<template>
  <div class="cptWrap">
    <group>
      <cell-box>
        <div class="wrap-proNum">
          <div class="field">单号</div>
          <div class="val ">{{ mainFormData.sn }}</div>
        </div>
      </cell-box>
      <cell-box>
        <div class="wrap-czy">
          <div class="field">参考人员</div>
          <div class="val ">{{ mainFormData.czy }}</div>
        </div>
      </cell-box>
      <cell-box>
        <div class="wrap-create-time">
          <div class="field">操作日期</div>
          <div class="val ">{{ mainFormData.fsrq }}</div>
        </div>
      </cell-box>
      <cell-box :is-link="!isReadOnly">
        <div class="wrap-proName">
          <div class="field">考试类型<span class="fz-red">*</span></div>
          <div class="val pr20" @click="selectPro">
            {{ mainFormData.lx }}
          </div>
        </div>
      </cell-box>
      <cell-box>
        <div class="wrap-times s">
          <div class="field">题目数量</div>
          <input
            v-model="mainFormData.tmsl"
            style="text-align: right;margin-left: 100px;"
            type="number"
            onkeyup="value=value.replace(/(^\s*)|(\s*$)/g,'') "
            placeholder
          />
        </div>
      </cell-box>
      <cell-box> </cell-box>
      <!-- <cell-box>
      <x-textarea
        :max="200"
        style="width: 100%;font-size:14px;"
        :readonly="isReadOnly"
        placeholder="请输入备注..."
        v-model="mainFormData.Remark"
        ref="remark"
        :autosize="true"
      >
        <span slot="label" class="field">备注</span>
      </x-textarea>
      </cell-box> -->
      <!-- <Attachment
        :model="attachmentModel"
        style="border-top: 1px solid #eee; font-size:14px;"
      ></Attachment> -->
      <!-- <ProcessMonitor1 :model="monitorModel"></ProcessMonitor1> -->
      <mt-popup
        v-model="selectProjModel.selectProjVisible"
        position="right"
        popup-transition="popup-fade"
        style="width:100%;height:100%"
      >
        <SelectProj
          :mess="selectProjModel"
          v-on:selectProjCallback="acceptProj"
          ref="projfile"
        ></SelectProj>
      </mt-popup>
      <div class="btns">
        <p
          style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;"
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
    </group>
  </div>
</template>

<script>
import { Group, CellBox, XTextarea, Datetime } from 'vux'
import SelectProj from '@/components/common/SelectProj1.vue'
import Attachment from '../common/Attachment1.vue'
import ProcessMonitor1 from '@/components/common/ProcessMonitor1'
import { rejects } from 'assert'
import { setTimeout } from 'timers'
export default {
  created() {
  //   this.Id = this.$route.query.data.Id
  //   console.log(this.$route.query.data,'id');
  //   if (this.util.isNotEmpty(this.Id)) {
  //     this.query()
  //   } else {
  //     this.mainFormData.czy = this.sessionUtil.getUserName()
  //     this.mainFormData.fsrq = new Date().format('yyyy-MM-dd')
  //   }
  //   console.log('created已创建')
  },
  activated() {
    let vm = this
    // console.log('vm',vm.sessionUtil.getUserName());
    this.pType = this.util.getUrlParam('pType')
    this.mainFormData = {
      czy: vm.sessionUtil.getUserName(),
      fsrq: new Date().format('yyyy-MM-dd')
    }
    if (this.pType == 'detail') {
      vm.isReadOnly = true
      this.query()
      this.Id = this.$route.params.data.Id
      let data = this.$route.params.data
      this.mainFormData = data
      // console.log('获取参数', this.mainFormData)
    }
  },
  methods: {
    monthChange() {
      this.monthQuery()
    },
    selectPro() {
      // if (this.isReadOnly) {
      //   return
      // }
      this.selectProjModel.selectProjVisible = true
    },
    acceptProj(data) {
      // console.log(data,'弹框');
      this.mainFormData.lx = data.lx
      this.mainFormData.lxbh = data.lxbh
      this.mainFormData.lxszid = data.lxszid
      this.sysl = data.sysl
      this.monthQuery()
    },
    monthQuery() {
      if (this.util.isNotEmpty(this.Id)) {
        if (this.monthQueryFlag == 0) {
          this.monthQueryFlag = 1
          return
        }
      }
      if (
        this.util.isNotEmpty(this.mainFormData.xmid) &&
        this.util.isNotEmpty(this.mainFormData.reportMonth)
      ) {
        var url =
            '/admin/appAgentAction!runAgent.action?agentId=Agent_Sys_GetDataBySql&appId=Sys',
          sql =
            "select COUNT(*) count from U007_Project_Month_Report where lock = '-5' and xmid = '" +
            this.mainFormData.xmid +
            "' and reportMonth = '" +
            this.mainFormData.reportMonth +
            "'",
          params = {
            flag: 0,
            params: '',
            type: 1,
            sql: sql
          },
          _this = this
        this.util.post(url, params, function(res) {
          if (res) {
            _this.mainFormData.periodsNum =
              _this.mainFormData.reportMonth +
              '月第' +
              (res.count + 1) +
              '次进度上报表'
          }
        })
      }
    },
    query() {
      var url = '/admin/appAgentAction!runAgent.action',
        params = {
          agentId: 'Agent_Wechat_exercise',
          type: 'getpractice',
          id: this.Id
        },
        _this = this

      this.util.get(url, params, function(res) {
        if (res.data || res.data.length > 0) {
          _this.mainFormData = res.data[0]
          // _this.util.extendCover(_this.mainFormData,res.data[0])
          if (
            (!_this.mainFormData.lock || _this.mainFormData.lock == 0) &&
            _this.mainFormData.czy == _this.sessionUtil.getUserName()
          ) {
            _this.isReadOnly = false
          } else {
            _this.isReadOnly = true
          }
        }
      })
    },
    checkValid() {
      var formData = this.mainFormData
      var flag = false
      // if (!this.util.isNotEmpty(formData.xmid)) {
      //   this.util.alert('请先选择项目！')
      //   return false
      // }
      // if (!this.util.isNotEmpty(formData.reportMonth)) {
      //   this.util.alert('请先选择月份！')
      //   return false
      // }
      // var url =
      //     '/admin/appAgentAction!runAgent.action?agentId=Agent_Sys_GetDataBySql&appId=Sys',
      //   // paramStr = JSON.stringify({ xmid: this.mainFormData.xmid }),
      //   _this = this,
      //   sql =
      //     "select * from U007_Project_Month_Report t where isnull(lock,'') <> '-5' and xmid =:xmid" +
      //     (this.util.isNotEmpty(this.Id) ? ` and id <> '${this.Id}'` : ''),
      //   params = {
      //     flag: 1,
      //     params: paramStr,
      //     type: 1,
      //     sql: sql
      //   }
      // this.util.sycnPost(url, params, function(res) {
      //   console.log('3333333333333333333333', res)
      //   if (res && res.length > 0) {
      //     _this.util.alert(
      //       '本项目有上报数据正在审批中，请将流程完结后再上报进度！'
      //     )
      //   } else {
      //     flag = true
      //   }
      // })
      return flag
    },
    getData() {
      var _this = this
      var filesData = new Array()
      for (var i = 0; i < this.attachmentModel.fileList.length; i++) {
        var file = this.attachmentModel.fileList[i]
        if (file.isNewFlag) {
          filesData.push(file)
        }
      }
      this.mainFormData['subCompany'] = this.sessionUtil.getsubCompanyId()
      var params = {
        sqlTableName: _this.details.sqlTableName,
        mainFormData: JSON.stringify(_this.mainFormData),
        // filesData: JSON.stringify(filesData),
        deleteFilesData: _this.attachmentModel.deleteFilesList.join(',')
      }
      if (this.validUtil.isNotEmpty(this.Id)) {
        params['id'] = this.Id
        params['businessKey'] = this.Id
      }
      params['symbol'] = this.details.symbol
      params['formId'] = this.details.formId
      params['appId'] = this.details.appId
      return params
    },
    saveData() {
      var _this = this
      if (this.mainFormData.tmsl == undefined || this.mainFormData.lx == undefined) {
        _this.util.alert('请填写完整')
        return
      }
      // if (!this.checkValid()) {
      //   return
      // }
      
      if (this.mainFormData.tmsl-this.sysl>0) {
        _this.util.alert('剩余'+this.sysl+'题，不能超过')
        return
      }
      
      
      var param = this.getData()
      // console.log(param,'保存参数')

      var url = '/admin/appDefaultFormAction!saveData.action'
      this.util.post(url, param, function(res) {
        // alert(res.msg)
        if (res.success == true) {
          _this.util.alert('保存成功！')
          _this.cancelCallback()
        } else {
          _this.util.alert(res.msg)
        }

        //_this.$router.push({name:'DayOffQuery',query:{pType:'saveBack'}})
      })
    },
    cancelCallback() {
      if (this.validUtil.isNotEmpty(this.Id)) {
        this.$router.back(-1)
      } else {
        //WeixinJSBridge.call('closeWindow');
        history.back()
        //this.$router.back(-1)
      }
    }
  },
  watch: {
    isReadOnly(val, oldVal) {
      this.attachmentModel.isReadOnly = val
    }
  },
  deactivated() {
    this.$destroy(true)
  },
  data() {
    return {
      monthQueryFlag: 0,
      isReadOnly: false,
      Id: '',
      details: {
        formId: 'DForm_U020_KSLX',
        symbol: 'sn,KSLX',
        sqlTableName: 'U020_ZHGL_ZSK_ZXKS_KSLX',
        appId: 'U020',
        reportMonth: ''
      },
      mainFormData: {
        sn: '',
        lx: '',
        fsrq: '',
        sysl:'',
        czy: '',
        tmsl: '',
        lxbh: '',
        projectName: '',
        xmid: '',
        lxszid: '',
        projectTypeId: '',
        reportMonth: '',
        periodsNum: '',
        Remark: '',
        _form_category_: ''
      },
      selectProjModel: {
        selectProjVisible: false,
        projectName: '选择项目',
        projUid: '',
        moduleType: 'progressProj'
      },
      attachmentModel: {
        isReadOnly: false,
        xtype: 'fujian1',
        title: '上传附件',
        fileList: [],
        deleteFilesList: []
      },
      monitorModel: {
        Id: ''
      }
    }
  },
  components: {
    Group,
    CellBox,
    Datetime,
    XTextarea,
    SelectProj,
    Attachment,
    ProcessMonitor1
  }
}
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
div[class^='wrap'] {
  //   padding-left: 10px;
  font-size: 14px;
  display: flex;
  width: 100%;
  .weui-cell {
    padding: 0;
  }
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
