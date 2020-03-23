<template>
  <div
    id="mainForm"
    style="padding-bottom: 0px;width: 100%;padding-bottom: 90px;"
    ref="mainForm"
  >
    <div style="height: 100%;overflow:auto;width: 100%;">
      <div v-if="pageType != ''" style="">
        <div class="price" style="text-align:left;">
          <span class="col-xs-3" style="padding-right: 0px;padding-left: 10px;"
            >流程名称:</span
          >
          <span>{{
            processModel.subject == undefined
              ? ''
              : processModel.subject.length > 18
              ? processModel.subject.substr(0, 18) + '...'
              : processModel.subject
          }}</span>
        </div>
        <div
          v-if="pageType != '' && pageType != 'apply'"
          class="price"
          style="text-align:left;"
        >
          <span class="col-xs-3" style="padding-right: 0px;padding-left: 10px;"
            >当前节点:</span
          >
          <span>{{ processModel.currentActName }}</span>
        </div>
        <div class="price" style="text-align:left;">
          <!-- <span class="col-xs-3" @click="showFormData();" style="width: 50%;">查看单据数据</span> -->
          <span class="col-xs-6">
            <!-- <el-button size="small" @click="showFormData();" type="primary">查看单据数据</el-button> -->
            <a
              href="javascript:void(0)"
              @click="redirect(1)"
              class="btn btn-info"
              >查看单据数据</a
            >
          </span>
          <span
            class="col-xs-6"
            style=" float: right; text-align: right;padding-right: 15px;"
          >
            <!-- <el-button size="small" @click="lookWorkflowPng();" type="primary">查看流程图</el-button> -->
            <a
              href="javascript:void(0)"
              @click="redirect(2)"
              class="btn btn-info"
              >查看流程图</a
            >
          </span>
          <!-- <span @click="lookWorkflowPng();">查看流程图</span> -->
        </div>
      </div>

      <div v-if="isWorkflow">
        <div v-for="(activity, index) in activities" :key="activity.id">
          <div v-if="!activity.show" class="middle" :key="index">
            <div
              class="pop"
              style="background-color: #eeefef;border-bottom: 1px #d5d5d8 solid;"
            >
              <span
                class="col-xs-3"
                style="width: 75%;text-align: left;padding-left: 10px;"
              >
                <input
                  v-if="activity.selectType == 'disabled'"
                  @click.stop="inputClick(activity, index)"
                  :name="activity.selectType"
                  :type="activity.selectType == 'radio' ? 'radio' : 'checkbox'"
                  disabled="disabled"
                  :checked="activity.checked"
                  :id="activity.id"
                />
                <input
                  v-if="activity.selectType != 'disabled'"
                  @click.stop="inputClick(activity, index)"
                  :name="activity.selectType"
                  :type="activity.selectType == 'radio' ? 'radio' : 'checkbox'"
                  :checked="activity.checked"
                  :id="activity.id"
                />
                &nbsp;{{ activity.name }}&nbsp;&nbsp;{{
                  activity.transition == activity.name
                    ? ''
                    : activity.transition
                }}
              </span>

              <div
                class="daright col-xs-9"
                style="float: right;width: 25%;text-align: right; "
                @click.stop="show(activity, index)"
              >
                <i class="glyphicon glyphicon-chevron-down"></i>
              </div>
            </div>
          </div>
          <div v-if="activity.show" :key="index" class="middle">
            <div class="pop" style="background-color: #eeefef;">
              <span
                class="col-xs-4"
                style="width: 85%;text-align: left;padding-left: 10px;"
              >
                <input
                  v-if="activity.selectType == 'disabled'"
                  @click.stop="inputClick(activity, index)"
                  :name="activity.selectType"
                  :type="activity.selectType == 'radio' ? 'radio' : 'checkbox'"
                  disabled="disabled"
                  :checked="activity.checked"
                  :id="activity.id"
                />
                <input
                  v-if="activity.selectType != 'disabled'"
                  @click.stop="inputClick(activity, index)"
                  :name="activity.selectType"
                  :type="activity.selectType == 'radio' ? 'radio' : 'checkbox'"
                  :checked="activity.checked"
                  :id="activity.id"
                />
                &nbsp;{{ activity.name }}&nbsp;&nbsp;{{
                  activity.transition == activity.name
                    ? ''
                    : activity.transition
                }}
              </span>
              <div
                class="daright col-xs-8"
                style="width: 15%; float: right;text-align: right; "
                @click.stop="hide(activity)"
              >
                <i class="glyphicon glyphicon-chevron-up"></i>
              </div>
            </div>
            <div
              class="load"
              style="text-align:left;border-top: 0px solid #eee;min-height:80px;width:100%;"
            >
              <div v-if="isWorkflow && !isEndEvent">
                <!-- bbbbb -->
                <div class="load">
                  <ul id="imgsLoad" style="margin-bottom:0px;margin-left: 5px;">
                    <li
                      style="margin-top: 2px;height:85px;overflow-y:auto;overflow-x:hidden;width:100%;"
                    >
                      <ul class="clearfix">
                        <li
                          style="margin:5px 5px 0px 5px;position:relative;text-align:left;float:left;width:43px;"
                          v-for="procUser in activity.newProcUsers"
                          :key="procUser.id"
                        >
                          <div>
                            <div>
                              <img
                                style="width:43px;height:43px;"
                                :src="procUser.picture"
                                alt=""
                              />
                            </div>

                            <div
                              style="text-align:center; font-size: 10px;line-height: 32px;height: 32px;"
                            >
                              <span>{{
                                procUser.procUserName.length > 3
                                  ? procUser.procUserName.substring(0, 3)
                                  : procUser.procUserName
                              }}</span>
                            </div>
                          </div>
                          <i
                            @click="removeProcUser(procUser, $event, activity)"
                            v-if="showProcUserDelete"
                            class="changeDelete"
                            style="position:absolute;top:-5px;left:-5px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff"
                            >&nbsp;X</i
                          >
                          <input
                            type="checkbox"
                            v-model="procUser.checked"
                            class="changeDelete"
                            style="font-style: oblique;position:absolute;top:-7px;right:-5px;background:#f00;width:14px;border-radius:50%;color:#fff"
                          />
                        </li>
                        <li
                          v-if="activity.ifSelUser"
                          style="margin:5px 0px 5px 3px;position:relative;text-align:left;float:left;"
                        >
                          <div>
                            <img
                              style="width:50px;height:50px;"
                              @click="addProcUser(activity)"
                              src="../../assets/add_image.png"
                            />
                          </div>
                        </li>
                        <li
                          v-if="activity.ifSelUser"
                          style="margin:5px 5px 5px 5px;position:relative;text-align:left;float:left;"
                        >
                          <div>
                            <img
                              style="width:50px;height:50px;"
                              @click="delProcUser()"
                              src="../../assets/remove_image.png"
                            />
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align:left;border-top: 0px solid #eee;width:100%;">
          <div v-if="isWorkflow && ifCopy">
            <div class="pop" style="background-color: #eeefef;">
              <span class="col-xs-4" style="width: 85%;padding-left: 10px;"
                >选择抄送人</span
              >
            </div>
            <div class="load">
              <ul id="imgsLoad" style="margin-bottom:0px;margin-left: 5px;">
                <li
                  style="margin-top: 2px;height:85px;overflow-y:auto;overflow-x:hidden;width:100%;"
                >
                  <ul class="clearfix">
                    <li
                      style="margin:5px 5px 0px 5px;position:relative;text-align:left;float:left;"
                      v-for="user in copyUserModel.users"
                      :key="user.id"
                    >
                      <div>
                        <div>
                          <img
                            style="width:43px;height:43px;"
                            :src="user.picture"
                            alt=""
                          />
                        </div>

                        <div
                          style="text-align:center; font-size: 10px;line-height: 32px;height: 32px;"
                        >
                          <span>{{
                            user.userName.length > 3
                              ? user.userName.substring(0, 3)
                              : user.userName
                          }}</span>
                        </div>
                      </div>
                      <i
                        @click="removeCopyUser(user, $event)"
                        v-if="showCopyUserDelete"
                        class="changeDelete"
                        style="position:absolute;top:-5px;left:-5px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff"
                        >&nbsp;X</i
                      >
                    </li>
                    <li
                      v-if="ifSelCopy"
                      style="margin:5px 0px 5px 3px;position:relative;text-align:left;float:left;"
                    >
                      <img
                        style="width:50px;height:50px;"
                        @click="addCopyUser()"
                        src="../../assets/add_image.png"
                      />
                    </li>
                    <li
                      v-if="ifSelCopy"
                      style="margin:5px 5px 5px 5px;position:relative;text-align:left;float:left"
                    >
                      <img
                        style="width:50px;height:50px;"
                        @click="delCopyUser()"
                        src="../../assets/remove_image.png"
                      />
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <mt-popup
          v-model="procUserModel.visible"
          position="right"
          popup-transition="popup-fade"
          style="width:100%;height:100%"
        >
          <!---->
          <SelectUser
            :userModel="procUserModel"
            ref="procUserSel"
            @selectUsersCallBack="handelUsers($event)"
          ></SelectUser>
        </mt-popup>

        <mt-popup
          v-model="copyUserModel.visible"
          position="right"
          popup-transition="popup-fade"
          style="width:100%;height:100%"
        >
          <!---->
          <SelectUser :userModel="copyUserModel" ref="copyUserSel"></SelectUser>
        </mt-popup>

        <!-- <ProcessForm :model="processModel" ref="process"></ProcessForm> -->
      </div>
      <VoiceRecognition
        v-if="isVoice"
        :model="voiceRecognition"
      ></VoiceRecognition>
      <ProcessMonitor
        v-if="ifShowProcessMonitor"
        :model="processMonitorModel"
        ref="processMonitor"
      ></ProcessMonitor>
      <actionsheet
        v-model="workflowSelShow"
        :menus="workflows"
        @on-click-menu="workflowSel"
      ></actionsheet>
      <p
        style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;    position: fixed;width: 100%;bottom: 0px;"
      >
        <button
          v-if="ifHashModel && !model.ifHashWorkflow && showBtn.cancle"
          style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
          @click="onClick(1)"
          class="weui-btn weui-btn_mini weui-btn_default"
        >
          取消
        </button>
        <button
          v-if="ifHashModel && !model.ifHashWorkflow && showBtn.cancle"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(2)"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          保存
        </button>
        <button
          v-if="
            ifHashModel &&
              model.ifHashWorkflow &&
              (showBtn.start || showBtn.submit)
          "
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(2)"
          class="weui-btn weui-btn_mini weui-btn_default"
        >
          保存草稿
        </button>
        <!-- 新增有 -->
        <button
          v-if="ifHashModel && model.ifHashWorkflow && showBtn.start"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(3)"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          审批人
        </button>
        <!-- 新增有 -->
        <button
          v-if="ifHashModel && model.ifHashWorkflow && showBtn.submit"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(4)"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          提交办理
        </button>
        <!-- 新增有 -->
        <button
          v-if="!ifHashModel && showBtn.cancle"
          style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
          @click="onClick(1)"
          class="weui-btn weui-btn_mini weui-btn_default"
        >
          取消
        </button>
        <button
          v-if="showBtn.reject"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(5)"
          class="weui-btn weui-btn_mini weui-btn_warn"
        >
          不同意
        </button>
        <button
          v-if="!ifHashModel && showBtn.submit"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(4)"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          提交
        </button>
        <button
          v-if="showBtn.read"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(6)"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          已阅
        </button>
        <button
          v-if="showBtn.revoke"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(7)"
          class="weui-btn weui-btn_mini weui-btn_default"
        >
          撤回
        </button>
        <button
          v-if="showBtn.reminder"
          style="width:48%;height: 45px;line-height: 45px;"
          @click="onClick(8)"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          催办
        </button>
      </p>
      <div v-transfer-dom>
        <popup
          v-model="processPopupShow"
          position="right"
          style="width: 100%;padding-bottom:0px;"
        >
          <div style="width:100%;    height: 100%;">
            <FormDetailData
              :model="formDetailData"
              ref="formDetailData"
              style="margin-bottom: 44px;"
            ></FormDetailData>
            <a
              href="javascript:;"
              @click="
                processPopupShow = false
                $refs.formDetailData.hide()
              "
              class="weui-btn weui-btn_warn"
              style="position: fixed;bottom: 0px;width: 100%;"
              >关闭</a
            >
          </div>
        </popup>
      </div>
    </div>
  </div>
</template>

<script>
import VoiceRecognition from '../common/VoiceRecognition.vue'
import SelectUser from '../common/SelectUser.vue'
import ProcessMonitor from '../common/ProcessMonitor.vue'
import FormDetailData from '../common/FormDetailData.vue'
import { XTextarea, Actionsheet, TransferDom, Popup, XButton } from 'vux'
export default {
  name: 'movebx',
  data() {
    return {
      loading: false,
      currentActName: '',
      ifShowCurrentActName: false,
      selectIndex: 0,
      assignee: '',
      taskType: '',
      showBtn: {
        cancle: false,
        start: false,
        submit: false,
        reject: false,
        revoke: false,
        read: false,
        reminder: false
      },
      formDetailData: { parent: this },
      date: new Date().format('yyyy-MM-dd'),
      processModel: {
        isReadOnly: false,
        procDefId: '',
        procInsId: '',
        taskId: '',
        currentActId: '',
        currentActName: '',
        procDefName: '',
        subject: ''
      },
      ifHashModel: false /* 是否有model */,
      workflows: [],
      voiceRecognition: {
        title: '意见说明',
        isReadOnly: false,
        placeholder: '请输入意见说明...',
        content: ''
      },
      processMonitorModel: {
        procInstId: '',
        procDefId: '',
        currentActName: '',
        currentActId: ''
      },
      //children: [{ show: true }],
      //selectProjModel:{projUid:this.projUid,selectProjVisible:this.selectProjVisible},
      isReadOnly: false, //是否只读
      isVoice: false,
      pageType: '',
      //id: '',

      processPopupShow: false,
      workflowSelShow: false,
      procUserModel: { visible: false, single: false, users: [] },
      copyUserModel: { visible: false, single: false, users: [] },
      activities: [],
      detailDataUrl: '',
      isWorkflow: false,
      isEndEvent: false,
      ifSelUser: false,
      isApply: false,
      ifShowCopy: true,
      ifSelCopy: true,
      ifBackPre: false,
      ifsubmit: false,
      ifShowProcessMonitor: false,
      showProcUserDelete: false,
      showCopyUserDelete: false,
      ifHasBtn: true,
      activitiesData: [],
      mainFormData: '',
      sqlTableName: '',
      startUserId: '',
      businessKey: '',
      timer: null,
      timerDetail: null,
      monitorTimer: null,
      ifChecked: false,
      ifComment: false,
      ifCopyNull: false,
      ifCopy: false,
      ifClose: false,
      ifApproval: false,
      ifUnread: false,
      detailDataUrl: '',
      finshed: false,
      pngUrl: ''
    }
  },
  props: ['model'],
  created() {
    //从消息进入需要单独请求权限
    if (!this.util.flag) {
      this.util.initWxJsSdk(this)
    }
  },
  activated() {
    this.util.init(this)
    var _this = this
    if (this.model == undefined || this.model == null) {
      //说明是待办、待阅、已办、已阅、申请的等进入的
      this.ifHashModel = false /* 从待办、待阅、已办、已阅、申请的等进入的没有model */
    } else {
      this.ifHashModel = true /* 其他情况进入有model */
    }

    //this.$store.state.selectProjModel.vue = this;
    //this.util.initUrlParam(this.mainData);
    //this.id = this.mainData.id;
    this.isNewFlag = this.validUtil.isNotEmpty(this.id)
      ? false
      : true /* 未使用到 */
    //this.attachmentModel.isReadOnly = this.mainData.isReadOnly;
    //this.voiceRecognition.isReadOnly = this.mainData.isReadOnly;
    //this.loadData();
    //this.processModel.parent = this;
    //this.$refs.process.initProcess();
    this.isWorkflow = false /* 初始化数据参数 */
    this.ifShowProcessMonitor = false
    this.ifCopy = false
    this.isVoice = false
    this.showBtn = {
      cancle: false,
      start: false,
      submit: false,
      reject: false,
      revoke: false,
      read: false,
      reminder: false
    }
    this.finshed = false
    this.comment = ''
    this.voiceRecognition.content = ''
    this.processModel.subject = ''
    this.processModel.procDefId = this.util.getUrlParam('_procDefId')
    this.processModel.taskId = this.util.getUrlParam('_taskId')
    this.processModel.taskType = this.util.getUrlParam('_taskType')
    this.processModel.currentActId = this.util.getUrlParam('_currentActId')
    this.processModel.businessKey = this.util.getUrlParam('id')
    this.processModel.procDefName = this.util.getUrlParam('_procDefName')
    this.processModel.id = this.util.getUrlParam('id')
    this.processModel.procInsId = this.util.getUrlParam('_procInstId')
    var isReadOnly = this.util.getUrlParam('isReadOnly')
    this.pageType = this.util.getUrlParam('_pageType')
    if (this.util.isNotEmpty(this.pageType)) {
      //--------------------------------url有pageType--------------------
      if (!this.util.flag && this.pageType == 'unRead') {
        /* 从消息进入且pageType 为未读 */
        var param = {
          procDefId: this.processModel.procDefId,
          taskType: this.taskType,
          taskId: this.processModel.taskId,
          businessKey: this.businessKey,
          currentActId: this.processModel.currentActId,
          procInsId: this.processModel.procInsId
        }
        _this.util.post(
          '/wx/workflowAction!getProcessFormData.action',
          param,
          function(res) {
            _this.processModel.subject = res.data.subject
            _this.processModel.currentActName = res.data.currentActName
            if (res.flag == false) {
              _this.finshed = true
              _this.showBtn.read = false
              _this.showBtn.cancle = false
            }
          }
        )
      } else {
        /* 有pageType 不从消息进入 */
        var subject = this.util.getUrlParam('_subject')
        var actName = this.util.getUrlParam('_actName')
        var procDefName = this.util.getUrlParam('_procDefName')
        //alert(decodeURIComponent(decodeURIComponent(procDefName)) + "---------" + decodeURIComponent(decodeURIComponent(subject)));
        this.processModel.subject = this.util.isNotEmpty(subject)
          ? decodeURIComponent(subject)
          : decodeURIComponent(this.processModel.procDefName)
        this.processModel.currentActName = this.util.isNotEmpty(actName)
          ? decodeURIComponent(actName)
          : ''
      }
    } //--------------------------------url有pageType的逻辑结束--------------------

    if (this.util.isNotEmpty(isReadOnly) && isReadOnly == 'true') {
      //--------------------------------url有isReadOnly--------------------
      this.processModel.isReadOnly = true
    } else {
      this.processModel.isReadOnly = false
    }

    this.startUserId = this.util.getUrlParam('_startUserId')
    this.businessKey = this.util.getUrlParam('id')
    this.assignee = this.util.getUrlParam('_assignee')
    this.taskType = this.util.getUrlParam('_taskType')

    //console.info(this.ifHashModel+"=========="+this.model.ifHashWorkflow);
    //console.info(this.model.ifHashWorkflow + "---------" + this.processModel.isReadOnly);
    if (!this.util.isNotEmpty(this.processModel.procInsId)) {
      //--------------------------------processModel.procInsId为空--------------------
      //console.info("-----2------");
      if (
        this.ifHashModel &&
        this.model.ifHashWorkflow &&
        !this.processModel.isReadOnly
      ) {
        //console.info("-----3------");				/* 从新增页面进入model的ifHashWorkflow为true */
        this.showBtn.start = true /* 有model，model的ifHashWorkflow为true,processModel不只读，显示提交办理、保存按钮 */
      } else if (
        this.ifHashModel &&
        !this.model.ifHashWorkflow &&
        !this.processModel.isReadOnly
      ) {
        this.showBtn.cancle = true /* 有model，model的ifHashWorkflow为flase,processModel不只读，显示取消按钮 */
      }
    } else {
      //--------------------------------processModel.procInsId不为空--------------------

      if (
        this.ifHashModel &&
        this.model.ifHashWorkflow &&
        !this.processModel.isReadOnly
      ) {
        //this.showBtn.start = true;
      }
      if (this.pageType == 'unApproval') {
        //待办
        this.initProcess()
      } else if (this.pageType == 'unRead') {
        //从消息进入需要单独请求权限
        if (!this.util.flag) {
          this.showBtn.read = false
          this.showBtn.cancle = false
          this.isVoice = false
        } else {
          this.showBtn.read = true
          this.showBtn.cancle = true
        }

        this.processModel.taskType = 1
      } else if (this.pageType == 'apply') {
        this.showBtn.reminder = true
        this.showBtn.revoke = true
      }
    }
    this.processMonitorModel.procDefId = this.processModel.procDefId
    this.processMonitorModel.procInsId = this.processModel.procInsId
    // console.info("processModel",this.processModel);

    if (this.util.isNotEmpty(this.processModel.procInsId)) {
      /* url有procInsId则显示并加载流程监控 */
      //  console.info(this.util.getUrlParam("_procInstId") + "======11=========");
      this.ifShowProcessMonitor = true
      this.loadMonitor()
    }
    //	console.info(this.pageType);
    //console.info(this.util.getUrlParam('id'));
    //console.info(this.processModel.businessKey);
    //	console.log(this.showBtn)
  },
  directives: {
    TransferDom
  },
  components: {
    // 名字
    XTextarea,
    Actionsheet,
    VoiceRecognition,
    FormDetailData,
    TransferDom,
    Popup,
    SelectUser,
    ProcessMonitor,
    XButton
  },

  methods: {
    loadMonitor() {
      if (this.$refs.processMonitor != undefined) {
        this.$refs.processMonitor.loadData()
        clearInterval(this.timer)
        this.timer = null
      } else {
        console.info('============' + this.timer)
        if (this.timer == null) {
          this.timer = setInterval(this.loadMonitor, 100)
        }
      }
      //this.$refs.processMonitor.loadData();
    },
    initProcess() {
      var _this = this
      //说明是请示审批进来

      if (this.util.isNotEmpty(this.processModel.procDefId)) {
        //在运行的流程

        if (this.ifHashModel) {
          _this.processModel.mainFormData = _this.getMainFormData() //获取主表数据
          //新增表单mainFormData为空对象
        } else {
          _this.processModel.mainFormData = null
        }

        var param = {
          procInsId: this.processModel.procInsId,
          procDefId: this.processModel.procDefId,
          taskId: this.processModel.taskId
        }
        //新增表单{procInsId: "", procDefId: "process_ygqj:1:764307", taskId: ""}
        //如果是待办办

        if (this.pageType == 'unApproval') {
          var status = ''
          if (this.assignee == null || this.assignee == '') {
            status = 'claim'
          } else {
            status = 'toDo'
          }
          param = {
            procDefId: this.processModel.procDefId,
            taskType: this.taskType,
            status: status,
            taskId: this.processModel.taskId,
            businessKey: this.businessKey,
            currentActId: this.processModel.currentActId,
            procInsId: this.processModel.procInsId,
            userId: this.sessionUtil.getUserId(),
            company_id: this.sessionUtil.getCompanyId(),
            userName: this.sessionUtil.getUserName()
          }
        }
        _this.util.mask('正在加载流程信息..')
        _this.util.post(
          '/wx/workflowAction!getProcessFormData.action',
          param,
          function(res) {
            if (res != undefined && res != null && res.status == 200) {
              var data = res.data
              /*新增表单{
									"status":200,
									"data":{
											"taskId":"","jsCode":"","currentActId":"sid-8585DCFA-0505-4BBF-840D-7EDCE5FCA8CC","currentActName":"申请人",
											"procInsId":"","procDefId":"process_ygqj:1:764307","procDefName":"请假申请","activities":[{
																"id":"sid-D4A09C3B-F06D-4BF4-9ADB-65B904999E59","name":"部门经理审批","transition":"部门经理审批","ifSelUser":true,
																"ifChoice":true,"ifTimeoutRemind":false,"ifArriveRemind":false,"ifCompleteRemind":false,"procUsers":[],
																"taskType":"Candidate","condition":"","selectType":"radio","ifDynamic":false,"ifCopy":false,"ifCopyNull":false,
																"ifSelCopy":false,"ifChoiceCopy":false,"copyUsers":[]}],
															"copyUsers":[],"jumpNodes":[],"flag":true,"ifToOther":false,
															"ifHelp":false,"ifCopy":true,"ifCopyNull":false,"ifSelCopy":true,"ifChoiceCopy":true,"ifBackPre":false,"ifBackFirest":false,
															"ifComment":true,"operateType":1,"currentUserId":"lq","currentUserName":"李全",
															"sessionData":{
																"Session_UserName":"李全",
																"Session_DepartName":"广州建软",
																"Session_UserId":"lq",
																"Session_DepartId":"0001"},
															"ifEleSignature":false,"ifFreeJump":false,"limit":0,"start":0,"page":0,"isAllow":0,"isManager":0}}					
						*/
              _this.processModel.currentActId = data.currentActId
              _this.processModel.currentActName = data.currentActName
              _this.processModel.activities = data.activities

              _this.isWorkflow = true
              _this.ifCopy = data.ifCopy
              _this.isVoice = true
              _this.ifComment = data.ifComment
              //新增表单data.mainFormDataMap为undefined;_this.processModel.mainFormData={}

              if (
                'undefined' != typeof data.mainFormDataMap &&
                data.mainFormDataMap != null &&
                _this.processModel.mainFormData == null
              ) {
                _this.processModel.mainFormData = data.mainFormDataMap
              }
              if (_this.util.isNotEmpty(data.mainFormData)) {
                _this.mainFormData = data.mainFormData
              }

              // 新增表单data.sessionData不为空
              if ('undefined' != typeof data.sessionData) {
                _this.util.extend(
                  _this.processModel.mainFormData,
                  data.sessionData
                )
              }
              //console.info(data.mainFormDataMap);
              //	console.info(_this.processModel.mainFormData);
              //_this.processModel.mainFormData['Subject']为空
              if (
                _this.processModel.mainFormData != null &&
                _this.util.isNotEmpty(
                  _this.processModel.mainFormData['Subject']
                )
              ) {
                _this.processModel.subject =
                  _this.processModel.mainFormData['Subject']
              } else {
                _this.processModel.subject = data.procDefName
              }
              //console.info(_this.processModel.mainFormData);
              //console.info(_this.processModel);
              if (data.copyUsers != undefined) {
                _this.copyUserModel.users = data.copyUsers
              }
              _this.initNode()
              if (_this.pageType == 'unApproval') {
                _this.showBtn.submit = true
                if (data.ifBackPre) {
                  _this.showBtn.reject = true
                } else {
                  _this.showBtn.cancle = true
                }
              }
            }
            _this.util.unmask()
          }
        )
      }
    },
    onClick(type) {
      var _this = this
      //	console.info("type---" + type);
      //console.info("=======---0000======"+this.model.parent);
      if (type == 1) {
        //history.go(-1);
        //window.event.chancelBUbble = true;
        history.back()
        return
      }
      var params = null
      //console.log( this.ifHashModel)
      //console.info("=======0000======"+this.model.parent);
      //console.log("this.model.parent",this.model.parent != undefined)
      if (
        (type == 2 || type == 3 || type == 4) &&
        this.ifHashModel &&
        this.model.parent != undefined
      ) {
        /* 从表单进入 */
        if (this.model.parent.checkValid != undefined) {
          console.info('=======00======' + this.model.parent.checkValid())
          if (!this.model.parent.checkValid()) {
            /* 表单输入不合法则不继续执行 */
            return
          }
        }
        //console.info("-------"+this.model.parent.getData);
        if (this.model.parent.getData != undefined) {
          //------------------------获取表单数据，赋值给params---------------------
          params = this.model.parent.getData()
        }
      }

      //console.log(params)

      if (params == null) {
        /* 不是从表单进入 */
        params = { mainFormData: this.mainFormData }
      }
      console.info('=======11======', this.model)
      if (type == 3) {
        console.log('type3')
        if (
          _this.util.isNotEmpty(this.model.sqlTableName) ||
          _this.util.isNotEmpty(this.model.formId)
        ) {
          _this.util.failueToast('该表单没有绑定流程！')
          return false
        }
        var param = {
          sqlTableName: this.model.parent.sqlTableName,
          formId: this.model.parent.formId,
          businessKey: this.processModel.businessKey
        }

        _this.util.mask('正在加载流程信息..')
        _this.util.post(
          '/workflow/workflowAction!isHasWorkflow.action',
          param,
          function(res) {
            _this.util.unmask()
            if (res != undefined && res != null) {
              if (res.success) {
                if (res.ifHasWorflow) {
                  if (_this.util.isNotEmpty(res.workflows)) {
                    //res有workflows
                    var workflows = JSON.parse(res.workflows)
                    if (workflows.length == 1) {
                      _this.processModel.procDefId = workflows[0].procDefId
                      _this.processModel.procDefName = workflows[0].procDefName
                      _this.initProcess()
                      //	return false;
                    } else {
                      var arr = new Array()
                      for (var i = 0; i < workflows.length; i++) {
                        arr.push({
                          key: workflows[i].procDefId,
                          label: workflows[i].procDefName,
                          value: workflows[i].procDefId
                        })
                      }
                      //console.info(_this.workflows);
                      _this.workflows = arr
                      _this.workflowSelShow = true
                    }
                    _this.showBtn.start = false
                    _this.showBtn.submit = true
                  }
                } else {
                  console.info('--------1213213-------')
                  _this.model.ifHashWorkflow = false
                  _this.onClick(2)
                  //_this.showBtn.start = false;
                }
              } else {
                _this.util.failueToast('获取流程信息失败：' + res.errorMsg)
              }
            }
          }
        )
        return
      }
      var maskStr = '正在保存...'
      if (type != 2) {
        params['id'] = this.businessKey
        params.assignee = this.sessionUtil.getUserId()
        params.assigneeCn = this.sessionUtil.getUserName()
        params.procInsId = this.processModel.procInsId
        params.procDefId = this.processModel.procDefId
        params.taskId = this.processModel.taskId
        params.currentActId = this.processModel.currentActId
        params.operateType = this.processModel.operateType
        params.taskType = this.processModel.taskType

        if (_this.ifComment) {
          if (!_this.util.isNotEmpty(_this.voiceRecognition.content)) {
            _this.util.failueToast('请填写审批意见！')
            return false
          }
        }
        params['comment'] = this.voiceRecognition.content
      }
      if (type == 5) {
        params.operateType = 6
        maskStr = '正在提交...'
      }
      if (type == 4 || type == 6) {
        maskStr = '正在提交...'
      }
      if (type == 7) {
        //撤回
        params.operateType = 12
        maskStr = '正在撤回...'
      }
      if (type == 8) {
        //催办
        params.operateType = 13
        maskStr = '正在催办...'
      }
      //console.info("=============");
      if (type == 4) {
        //params['submitId'] = this.businessKey;

        var copyUsersStr = new Array()
        if (this.copyUserModel.users && this.copyUserModel.users.length > 0) {
          for (var i = 0; i < this.copyUserModel.users.length; i++) {
            var obj = new Object()
            obj['id'] = this.copyUserModel.users[i]['id']
            obj['userId'] = this.copyUserModel.users[i]['userId']
            obj['userName'] = this.copyUserModel.users[i]['userName']
            copyUsersStr.push(obj)
          }
        }

        params['copyUsersStr'] = JSON.stringify(copyUsersStr)
        var newActivities = new Array()
        var conditionArr = new Array()
        for (var i = 0; i < this.activities.length; i++) {
          var activity = JSON.parse(JSON.stringify(this.activities[i]))
          // bbbbb
          if (activity.show && this.isWorkflow && !this.isEndEvent) {
            for (var j = activity.newProcUsers.length - 1; j >= 0; j--) {
              if (activity.newProcUsers[j].checked != true) {
                activity.newProcUsers.splice(j, 1)
              }
            }
          }
          if (activity.checked) {
            //console.info("88888888888888");
            //console.info(activity.newProcUsers);
            if (activity.taskType != 'endEvent') {
              if (
                activity.newProcUsers == undefined ||
                activity.newProcUsers.length == 0
              ) {
                _this.util.failueToast(
                  '环节' + activity.name + '未设置处理人！'
                )
                return false
              }
              activity.procUsersData = JSON.stringify(activity.newProcUsers)
            }

            //delete activity.newProcUsers;
            conditionArr.push(activity.condition)
            newActivities.push(activity)
          }
        }
        params.condition = conditionArr.join(',')
        if (newActivities.length == 0) {
          _this.util.failueToast('请选择要提交的环节！')
          return false
        }
        params.activityData = JSON.stringify(newActivities)
      }

      this.util.mask(maskStr)
      this.saveData(type, params)
    },
    saveData(type, params) {
      var _this = this
      var url =
        '/admin/appDefaultFormAction!saveData.action' /* 保存草稿的url */
      if (type != 2) {
        url = '/workflow/workflowAction!runWorkflow.action'
      }
      _this.util.post(url, params, function(res) {
        if (res != undefined && res != null) {
          if (res.success) {
            _this.util.successToast('成功')
            if (
              type == 2 ||
              type == 4 ||
              type == 5 ||
              type == 6 ||
              type == 7 ||
              type == 8
            ) {
              //_this.$store.state.operate == 'save';
              //window.operate == 'save';
              //window.event.chancelBUbble = true;
              _this.$store.state.operate = 'save'
              history.back()
            }
          } else {
            _this.util.failueToast('操作失败' + res.errorMsg)
          }
        }
        _this.util.unmask()
      })
    },
    checkValid() {
      for (var i = 0; i < this.activities.length; i++) {}
    },
    getMainFormData() {
      var params = {}
      if (this.model != undefined && this.model.parent != undefined) {
        if (this.model.parent.getMainFormData != undefined) {
          console.log('getMainFormData', true)
          params = this.model.parent.getMainFormData()
        }
      }
      return params
    },
    initNode() {
      var activitiesData = this.processModel.activities

      for (var i = 0; i < activitiesData.length; i++) {
        // 初始化流程处理人
        this.initActivity(activitiesData[i])
      }
      //console.info("--------------------");
      var activityArr = new Array()
      var mainFormData = this.processModel.mainFormData
      this.activities = new Array()
      //console.info(activitiesData);
      for (var i = 0; i < activitiesData.length; i++) {
        var avtivity = activitiesData[i]
        if (avtivity.selectType == 'disabled') {
          avtivity.checked = true
        }
        //console.info(avtivity);
        var condition = avtivity.condition
        if (condition != null && condition != undefined && condition != '') {
          var flag
          condition = condition.trim()
          condition = condition.substring(2, condition.length - 1)
          // alert(condition);
          // 多条件
          if (condition.indexOf('||') > -1 || condition.indexOf('&&') > -1) {
            var index = -1
            for (var key in mainFormData) {
              if (condition.indexOf(key) > -1) {
                index = -1
                if (condition.indexOf(key + '==') > -1) {
                  index = condition.indexOf(key) + key.length + 2
                } else if (condition.indexOf(key + '!=') > -1) {
                  index = condition.indexOf(key) + key.length + 2
                } else if (condition.indexOf(key + '>=') > -1) {
                  index = condition.indexOf(key) + key.length + 2
                } else if (condition.indexOf(key + '<=') > -1) {
                  index = condition.indexOf(key) + key.length + 2
                } else if (condition.indexOf(key + '>') > -1) {
                  index = condition.indexOf(key) + key.length + 2
                } else if (condition.indexOf(key + '<') > -1) {
                  index = condition.indexOf(key) + key.length + 2
                }
                if (condition.charAt(index) == '"') {
                  condition = condition.replaceAll(
                    key,
                    '"' + mainFormData[key] + '"'
                  )
                } else {
                  condition = condition.replaceAll(key, mainFormData[key])
                }
              }
            }
            condition = 'flag = (' + condition + ')'
          } else {
            var con
            if (condition.indexOf('==') > -1) {
              con = this.getConditionValue(condition, '==')
              con.operate = '=='
            } else if (condition.indexOf('>=') > -1) {
              con = this.getConditionValue(condition, '>=')
              con.operate = '>='
            } else if (condition.indexOf('<=') > -1) {
              con = this.getConditionValue(condition, '<=')
              con.operate = '<='
            } else if (condition.indexOf('>') > -1) {
              con = this.getConditionValue(condition, '>')
              con.operate = '>'
            } else if (condition.indexOf('<') > -1) {
              con = this.getConditionValue(condition, '<')
              con.operate = '<'
            } else if (condition.indexOf('!=') > -1) {
              con = this.getConditionValue(condition, '!=')
              con.operate = '!='
            }
            var value = ''
            //console.info(mainFormData+"------------1----------"+con.name);
            value = mainFormData[con.name]
            // alert(o.name+"=="+o.value);
            // alert(value);
            if (typeof value == 'undefined' || value == null || value == '') {
              avtivity.show = false

              activityArr.push(avtivity)
              continue
            }
            if (con.value.indexOf('"') > -1) {
              condition =
                'flag = ("' + value + '"' + con.operate + con.value + ')'
            } else {
              condition = 'flag = (' + value + con.operate + con.value + ')'
            }
          }
          //salert(condition);
          eval(condition)
          if (flag == false) {
            avtivity.show = false
          } else {
            avtivity.show = false
            //avtivity.show = true;
            activityArr.push(avtivity)
          }
        } else {
          avtivity.show = false
          activityArr.push(avtivity)
        }
      }

      //console.info("-----------" + activityArr.length);
      if (activityArr.length == 1) {
        var activity = activityArr[0]
        if (activity['selectType'] == 'radio') {
          //console.info($('#' + activity.id));
          activityArr[0].checked = true
          activityArr[0]['show'] = true
        }
        //console.info(activityArr[0]);
        //console.info(avtivity);

        //console.info("---------222-------------");
        var newProcUsers = activity.newProcUsers
        if (newProcUsers != undefined && newProcUsers != null) {
          var userArr = new Array()
          for (var j = 0; j < newProcUsers.length; j++) {
            var procUser = newProcUsers[j]
            var obj = new Object()
            obj['userName'] = procUser['procUserName']
            obj['userId'] = procUser['procUserId']
            obj['id'] = procUser['id']
            obj['mobileNo'] = procUser['mobileNo']
            obj['picture'] = procUser['picture']
            userArr.push(obj)
          }
          this.procUserModel['users'] = userArr
        }
      }
      this.activities = activityArr
      this.selectIndex = this.activities[0]
      //this.activities = activitiesData;
      console.info(this.activities[0])
    },
    initActivity(activity) {
      var procUsers = activity['procUsers']
      var newProcUsers = new Array()
      activity['newProcUsers'] = newProcUsers
      if (procUsers != undefined && procUsers != null) {
        var procUser = ''
        for (var i = 0; i < procUsers.length; i++) {
          procUser = procUsers[i]
          if (procUser['procUserId'].startsWith('${')) {
            this.getProcUserByFormField(newProcUsers, procUser['procUserId'])
          } else {
            newProcUsers.push(procUser)
          }
        }
      }
    },
    getProcUserByFormField(select, fieldId) {
      var mainFormData = this.processModel.mainFormData
      fieldId = fieldId.trim()
      fieldId = fieldId.substring(2, fieldId.length - 1)
      var field
      if (fieldId.startsWith('1_')) {
        type = 1
        field = fieldId.substring(2)
      } else if (fieldId.startsWith('2_')) {
        type = 2
        field = fieldId.substring(2)
      } else {
        type = 0
        field = fieldId
      }
      var userIds = mainFormData[field]
      if (userIds != undefined && userIds != '' && userIds != null) {
        _this.util.post(
          '/admin/orgUserAction!getUsersByUserId.action',
          { userId: userIds, type: type },
          function(res) {
            if (res.length > 0) {
              for (var i = 0; i < res.length; i++) {
                newProcUsers.push({
                  id: res[i]['id'],
                  procUserId: res[i]['userId'],
                  procUserName: res[i]['userName']
                })
              }
            }
          }
        )
      }
    },
    getConditionValue(condition, operate) {
      var name = condition.substring(0, condition.indexOf(operate)).trim()
      var value = condition
        .substring(condition.indexOf(operate) + operate.length)
        .trim()
      var obj = {
        name: name,
        value: value
      }
      return obj
    },
    inputClick(activity, index) {
      //console.info("------inputClick---------" + activity.checked);
      if (activity.selectType == 'checkbox') {
        activity.checked = !activity.checked
      } else if (activity.selectType == 'radio') {
        for (var i = 0; i < this.activities.length; i++) {
          if (
            this.activities[i].id != activity.id &&
            this.activities[i].selectType == 'radio'
          ) {
            this.activities[i].checked = false
          }
        }
        activity.checked = !activity.checked
      } else {
        activity.checked = true
      }
    },
    workflowSel(key, item) {
      this.processModel.procDefId = key
      this.workflowSelShow = false
      this.initProcess()
    },
    removeCopyUser(user) {
      this.copyUserModel.users = this.copyUserModel.users.filter(item => {
        return item != user
      })
      var userUidArr = new Array()
      for (var i = 0; i < this.copyUserModel.users.length; i++) {
        userUidArr.push(this.copyUserModel.users[i].id)
      }
      //console.info(userUidArr);
      this.copyUserModel.userUid = userUidArr.join(',')
    },
    addCopyUser() {
      var _this = this
      this.copyUserModel.visible = true
      var userUidArr = []

      if (this.util.isNotEmpty(this.copyUserModel.userUid)) {
        userUidArr = this.copyUserModel.userUid.split(',')
      } else {
        for (var i = 0; i < this.copyUserModel.users.length; i++) {
          userUidArr.push(this.copyUserModel.users[i].id)
        }
      }
      //console.info(userUidArr);
      var obj = { singer: false, radioCheckedArr: userUidArr }
      this.$refs.copyUserSel.postMsg(obj)
    },
    delCopyUser() {
      //console.info("----delCopyUser---");
      this.showCopyUserDelete = !this.showCopyUserDelete
    },
    hide(activity) {
      activity.show = false
      //console.info("---1----");
      //console.info(activity);
    },
    show(activity, index) {
      if (this.activities && this.activities.length > 0) {
        for (var i = 0; i < this.activities.length; i++) {
          var node = this.activities[i]
          var id = node.id
          if (node['id'] == activity.id) {
            node.show = true
            if (node['selectType'] == 'radio') {
              //$('#' + id).prop('checked', 'checked');
            }
            var newProcUsers = node.newProcUsers
            var userArr = new Array()
            for (var j = 0; j < newProcUsers.length; j++) {
              var procUser = newProcUsers[j]
              var obj = new Object()
              obj['userName'] = procUser['procUserName']
              obj['userId'] = procUser['procUserId']
              obj['id'] = procUser['id']
              obj['mobileNo'] = procUser['mobileNo']
              obj['picture'] = procUser['picture']
              userArr.push(obj)
            }
            this.procUserModel['users'] = userArr
          } else {
            node.show = false
            if (node['selectType'] == 'radio') {
              //$('#' + id).prop('checked', false);
            }
          }
        }
      }
    },
    handelUsers(data) {
      //console.info("--------------");
      //console.info(data);
      var activity = this.selectIndex
      var newProcUsers = new Array()
      var userArr = new Array()
      var userUidArr = []
      for (var j = 0; j < data.length; j++) {
        var procUser = data[j]
        var obj = new Object()
        obj['procUserName'] = procUser['userName']
        obj['procUserId'] = procUser['userId']
        obj['id'] = procUser['id']
        obj['mobileNo'] = procUser['mobileNo']
        obj['picture'] = procUser['picture']
        newProcUsers.push(obj)
        userUidArr.push(obj['id'])
      }
      activity.newProcUsers = newProcUsers
      this.procUserModel['users'] = userArr
      this.procUserModel.userUid = userUidArr.join(',')
    },
    addProcUser(activity) {
      var _this = this
      this.selectIndex = activity
      this.procUserModel.visible = true
      var userUidArr = []
      if (this.procUserModel.users && this.procUserModel.users.length > 0) {
        for (var i = 0; i < this.procUserModel.users.length; i++) {
          userUidArr.push(this.procUserModel.users[i]['id'])
        }
      }
      var obj = { singer: false, radioCheckedArr: userUidArr }
      this.$refs.procUserSel.postMsg(obj)
    },
    delProcUser() {
      //console.info("----delProcUser---");
      this.showProcUserDelete = !this.showProcUserDelete
    },
    removeProcUser(user, data, activity) {
      //var arr = this.procUserModel.users;
      var id = activity['id']

      this.procUserModel.users = this.procUserModel.users.filter(item => {
        return item != user
      })
      var userUidArr = new Array()
      for (var i = 0; i < this.procUserModel.users.length; i++) {
        userUidArr.push(this.procUserModel.users[i].id)
      }
      //console.info(this.procUserModel.users);

      this.procUserModel.userUid = userUidArr.join(',')
      if (this.activities && this.activities.length > 0) {
        for (var i = 0; i < this.activities.length; i++) {
          var node = this.activities[i]
          var id = node.id
          if (node['id'] == activity.id) {
            node.newProcUsers = node.newProcUsers.filter(item => {
              return item != user
            })
          }
        }
      }
    },
    redirect(type) {
      this.processModel.type = type
      this.processModel.pageType = this.pageType
      this.processPopupShow = true
      this.formDetailData.parent = this
      var detailDataUrl = ''
      this.formDetailData.type = type
      if (type == 1) {
        if (this.processModel.pageType == 'unApproval') {
          detailDataUrl =
            this.util.getBaseUrl() +
            '/workflow/workflowAction!openWorkflow.action?userId=' +
            this.sessionUtil.getUserId() +
            '&procDefId=' +
            this.processModel.procDefId +
            '&procInsId=' +
            this.processModel.procInsId +
            '&taskId=' +
            this.processModel.taskId +
            '&currentActId=' +
            this.processModel.currentActId +
            '&businessKey=' +
            this.processModel.businessKey +
            '&status=' +
            this.processModel.status +
            '&taskType=' +
            this.processModel.taskType +
            '&company_id=' +
            this.sessionUtil.getCompanyId() +
            '&access_token=' +
            this.util.getAccessToken()
        } else if (this.processModel.pageType == 'apply') {
          detailDataUrl =
            this.util.getBaseUrl() +
            '/workflow/workflowAction!showHistoryForm.action?userId=' +
            this.sessionUtil.getUserId() +
            '&procDefId=' +
            this.processModel.procDefId +
            '&procInsId=' +
            this.processModel.procInsId +
            '&businessKey=' +
            this.processModel.businessKey +
            '&company_id=' +
            this.sessionUtil.getCompanyId() +
            '&access_token=' +
            this.util.getAccessToken()
        } else {
          detailDataUrl =
            this.util.getBaseUrl() +
            '/workflow/workflowAction!showHistoryForm.action?userId=' +
            this.sessionUtil.getUserId() +
            '&procDefId=' +
            this.processModel.procDefId +
            '&procInsId=' +
            this.processModel.procInsId +
            '&taskId=' +
            this.processModel.taskId +
            '&currentActId=' +
            this.processModel.currentActId +
            '&businessKey=' +
            this.processModel.businessKey +
            '&company_id=' +
            this.sessionUtil.getCompanyId() +
            '&status=' +
            this.processModel.status +
            '&taskType=' +
            this.processModel.taskType +
            '&access_token=' +
            this.util.getAccessToken() +
            '&flag=true'
        }
      } else {
        detailDataUrl =
          this.util.getBaseUrl() +
          '/workflow/workflowAction!getProcessPng.action?userId=' +
          this.sessionUtil.getUserId() +
          '&procDefId=' +
          this.processModel.procDefId +
          '&procInsId=' +
          this.processModel.procInsId +
          '&access_token=' +
          this.util.getAccessToken() +
          '&flag=true'
      }
      //this.loadDetail(detailDataUrl);
      this.$refs.formDetailData._initData(detailDataUrl)
      //this.$router.push({ path: '/workflow/formDetailData', query: this.processModel });
    },
    loadDetail(detailDataUrl) {
      if (this.$refs.formDetailData != undefined) {
        this.$refs.formDetailData._initData(detailDataUrl)
        clearInterval(this.timerDetail)
        this.timerDetail = null
      } else {
        console.info('============' + this.timerDetail)
        if (this.timerDetail == null) {
          this.timerDetail = setInterval(this.loadDetail(detailDataUrl), 100)
        }
      }
      //this.$refs.processMonitor.loadData();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
//金额    生产日期
.unpop,
.pop,
.price,
.date {
  height: 48px;
  line-height: 48px;
  border-top: 1px solid #eee; // border-bottom: 1px solid #ccc;
}

.vux-slider {
  padding-left: 10px;
}

.price input,
.date input {
  height: 40px;
  padding-top: 10px;
  text-align: right;
}

//foot
.foot {
  height: 100%;
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
  height: 3rem;
  padding-top: 10px;
  background: #eee;
  line-height: 42px;
}

.weui-cell:before {
  border-top: 0px solid #e5e5e5;
}

.mint-cell-wrapper {
  font-size: 14px;
  background: none;
  background-image: none !important;
}

.mint-cell-title {
  font-size: 14px;
}

.mint-cell-value {
  font-size: 14px;
  color: #0c0c0c !important;
}

.mint-cell-allow-right::after {
  right: 13px !important;
}

.weui-cell__ft {
  color: #171616 !important;
}

.mint-cell-value.is-link {
  margin-right: 14px !important;
}

.clearfix:after {
  content: '';
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
</style>
