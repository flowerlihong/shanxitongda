<template>
  <div class="maimForm">
    <div class="wrap">
      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd"><span>发件编号</span></div>
        <!-- <div class="weui-cell__bd myCell-bd" style="padding-right: 10px;" @click="selectUser()">
					<span style=" display: block;height: 100%;padding-right: 0px;line-height: 23px;">{{userModel.userName}}</span>
				</div> -->
        <div class="weui-cell__bd">
          <span>{{ newsDetails.title }}</span>
        </div>
      </div>
      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd"><span>发件人</span></div>
        <div class="weui-cell__bd">
          <span>{{ newsDetails.czy }}</span>
        </div>
      </div>
      <div
        class="weui-cell  myCell"
        style="padding-left: 10px;border-top:1px solid #eee"
      >
        <div class="weui-cell__hd"><span>发件时间</span></div>
        <div class="weui-cell__bd">
          <span>{{ newsDetails.fwDate }}</span>
        </div>
      </div>

      <div class="price" style="text-align:left;background-color: #eeefef;">
        <span class="col-xs-3">发文内容</span>
      </div>
      <div style="text-align:left;">
        <x-textarea
          :max="2000"
          style="width: 100%;"
          :readonly="true"
          placeholder="请输入备注..."
          v-model="newsDetails.content"
          ref="content"
        ></x-textarea>
      </div>
      <Attachment
        :model="attachmentModel"
        style="border-top: 1px solid #eee;"
      ></Attachment>
      <!-- <ProcessMonitor1 :model="monitorModel"></ProcessMonitor1> -->
    </div>
    <div class="btns">
      <p
        style="  margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;"
      >
        <button
          style="width:98%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
          @click="cancelCallback()"
          class="weui-btn weui-btn_mini weui-btn_default"
        >
          返回
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import VoiceRecognition from '../common/VoiceRecognition.vue'
import Attachment from '../common/Attachment1.vue'
import ProcessMonitor1 from '../common/ProcessMonitor1'
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
    XTextarea
  },
  data() {
    return {
      newsDetails: {
        title: '',
        czy: '',
        fwDate: '',
        content: ''
      },
      userId: '',
      companyId: '',
      departId: '',
      leaveDetails: {
        sn: '',
        xmid: '',
        Subject: '',
        fsrq: new Date().format('yyyy-MM-dd'),
        czy: '',
        leavePerson: '',
        userUid: '',
        depart: '',
        leaveType: [],
        leaveStartTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        leaveEndTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        leaveDays: '',
        //  offReson:'',
        Remark: ''
      },
      isReadOnly: false,
      leaveTypeList: [['']],
      voiceRecognition: {
        title: '请假事由',
        isReadOnly: false,
        placeholder: '请输入请假原因...',
        content: ''
      },
      attachmentModel: {
        isReadOnly: true,
        xtype: 'fujian1',
        title: '上传附件',
        fileList: [],
        deleteFilesList: []
      },
      monitorModel: {
        Id: ''
      },
      Id: '',
      sqlTableName: 'U013_Application_For_Leave',
      symbol: 'sn,APFOLE',
      formId: 'DForm_U013_Application_For_Leave',
      appId: 'U013',
      subFormData: [],
      pushData: {}
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
    // this.util.initWxJsSdk(this);
    this.userId = this.sessionUtil.getUserId()
    this.companyId = this.sessionUtil.getCompanyId()
    this.departId = this.sessionUtil.getDepartId()
  },
  activated() {
    this.Id = this.util.getUrlParam('Id')

    if (this.Id) {
      this.queryDetals()
    }
  },
  methods: {
    queryDetals() {
      var type = decodeURI(this.util.getUrlParam('type'))
      var _this = this
        /* var sql = "select issueDate as fwDate,title,hostUnit as depart,textContent as content,"+
                "DocCreated from U014_Document_Management  "+
                "where Company='"+this.companyId+"' and Id = '"+this.Id+"' and (AddName = '"+this.userId+"'  or  '"+this.userId+"' in ("+
                "select UserId from ORG_User_Role where RoleId in  ('admin','Role_Sys_Company_Admin','Role_0001_002')) )" */

        /*  var params ={
                operateType:'queryDataByEncSql',
                querySql : _this.util._encode(sql),
                orderByName:'DocCreated DESC',
                totalRows:1,
                firstRows:1 
            }
            
            this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat',params,function(res){
                //console.log(res.data)
                console.log("_this.newsDetails",_this.newsDetails);
                _this.newsDetails = res.data[0];
                _this.newsDetails.type="发文管理"
			}) */
      //   this.util.post(
      //     '/admin/appAgentAction!runAgent.action?agentId=Agent_GCKG_Wechat_xiaoxi&appId=WeChat',
      //     {
      //       Type: 'management',
      //       Id: _this.Id,
      //       userId: _this.userId,
      //       departId: _this.departId,
      //       companyId: _this.companyId
      //     },
      //     function(res) {
      //       if (res && res.status == true) {
      //         _this.newsDetails.title = res.data.title
      //         _this.newsDetails.type = res.name
      //         _this.newsDetails.fwDate = res.data.issueDate
      //         _this.newsDetails.content = res.data.textContent
      //         _this.newsDetails.depart = res.data.hostUnit
      //       }
      //     }
      //   )
      //   var sql = "select dispatchDate as fwDate,title,dispatchDepart as depart,dispatchcontent as content,"+
      //           "DocCreated from U014_Notice_Bulletin  "+
      //           "where Company='"+this.companyId+"' and Id = '"+this.Id+"' and (AddName = '"+this.userId+"'  or  '"+this.userId+"' in ("+
      //           "select UserId from ORG_User_Role where RoleId in  ('admin','Role_Sys_Company_Admin','Role_0001_002')) )"
                
               
      //       var params ={
      //           operateType:'queryDataByEncSql',
      //           //  param:JSON.stringify(obj),
      //       //   searchParams:JSON.stringify(searchParams),
      //           querySql : _this.util._encode(sql),
      //           // sqlTableName:'U012_Expense_Account',
      //           orderByName:'DocCreated DESC',
      //           // fieldList:'',
      //           totalRows:1,
      //           firstRows:1 
      //       }
            
      //       this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat',params,function(res){
      //           //console.log(res.data)
      //           console.log(res);
      //           _this.newsDetails = res.data[0];
      //           _this.newsDetails.type="通知公告"
      // })
        this.util.post(
          '/admin/appAgentAction!runAgent.action?agentId=Agent_SCHD_Index_Data_Leader&appId=SCHD&operateType=getMailbox2',
          {
            Type: 'file',
            Id: _this.Id,
            userId: _this.userId,
            departId: _this.departId,
            companyId: _this.companyId
          },
          function(res) {
            for(var i = 0; i < res.data.length; i++) {
              if (_this.Id == res.data[i].Id) {
              _this.newsDetails.title = res.data[i].sn
              _this.newsDetails.czy = res.data[i].czy
              _this.newsDetails.fwDate = res.data[i].fsrq
              _this.newsDetails.content = res.data[i].zw
            }

            }
          }
        )
      
    },

    cancelCallback() {
      if (this.validUtil.isNotEmpty(this.Id)) {
        history.back()
      } else {
        //WeixinJSBridge.call('closeWindow');
        history.back()
        //this.$router.back(-1)
      }
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
