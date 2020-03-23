<template>
  <div class="index-nav" style="padding-bottom: 50px!important;">
    <div class="page-index">
      <swiper
        loop
        auto
        height="180px"
        :list="demo07_list"
        :index="demo07_index"
        @on-index-change="demo07_onIndexChange"
      ></swiper>
      <nav>
        <div class="if-backlog">
          <ul>
            <li>
              <a @click="util.gotoByPath('/workflow/desktop')">请示审批测试</a>
            </li>
            <li>
              <a
                @click="
                  util.gotoByPath('/workflow/approval', { type: 'unFinished' })
                "
                >待办({{ myApprovalUnFinishedCount }})</a
              >
            </li>
            <li>
              <a
                @click="
                  util.gotoByPath('/workflow/copy', { type: 'unFinished' })
                "
                >待阅({{ myCopyUnFinishedCount }})</a
              >
            </li>
            <li>
              <a @click="util.gotoByPath('/workflow/apply')"
                >我申请的({{ myApplyAllCount }})</a
              >
            </li>
            <li>
              <a
                @click="
                  util.gotoByPath('/workflow/approval', { type: 'finished' })
                "
                >我的已办({{ myApprovalFinishedCount }})</a
              >
            </li>
          </ul>
        </div>
        <!-- <div class="mobile-office">
                    <ul>
                        <li>
                            <a @click="util.gotoByPath('/checkWork')">考勤签到</a>
                        </li>
                        <li>
                            <a @click="util.gotoByPath('/checkOutWork')">外勤签到</a>
                        </li>
                        <li>
                            <a @click="util.gotoByPath('/newslist')">新闻公告</a>
                        </li>
                    </ul>
                </div> -->
        <div class="mobile-office">
          <ul>
            <li>
              <a @click="util.gotoByPath('/announcement')">通知公告</a>
            </li>
            <li>
              <a @click="util.gotoByPath('/email')">邮件</a>
            </li>
            <li>
              <a @click="util.gotoByPath('/note')">短信</a>
            </li>
          </ul>
        </div>
        <div class="use-list">
          <ul>
            <li
              v-for="(item, index) in shortCutList"
              :value="item.value"
              :key="index"
            >
              <p @click="openShortCut(item)">
                <img :src="util.getBaseUrl() + item.iconCls" alt="" />
                <span>{{ item.appName }}</span>
              </p>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="page-project">
      <ProjectList></ProjectList>
    </div>
    <div class="page-app">
      <div
        v-for="(items, index) in appList"
        :key="index"
        style="margin-bottom: 10px;"
      >
        <div class="caption">
          <span>{{ items.modelName }}</span>
        </div>
        <!-- <ul v-if="!(items.modelName=='工程质量管理')">
                    <li v-for="(item,key) in items.children" @click="openApp(item)" :key="key">
                        <img :src="util.getBaseUrl()+item.iconCls" alt="">
                        <p>{{item.appName}}</p>
                    </li>
                </ul> -->
        <ul>
          <li v-for="(item, key) in items.children" :key="key">
            <p @click="util.gotoByName(item.paramter)">
              <img :src="item.iconCls" alt="" />
              <span style="display:block">{{ item.appName }}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="page-user">
      <div class="user-header">
        <img :src="avatar" alt="" />
        <p>{{ userName }}</p>
      </div>
      <div class="message1 message" style="margin-top:0px">
        <div style="position:relative" @click="goto('attRecord')">
          <i
            class="glyphicon glyphicon-map-marker iconStyle"
            style="color:#3774d2"
          ></i>
          <p class="user-button">
            <span class="fl" style="padding-left: 8px;">考勤记录</span>
          </p>
        </div>
        <div style="position:relative;display:none;">
          <i
            class="glyphicon glyphicon-cd fl iconStyle"
            style="color:#336666"
          ></i>
          <p class="user-button">
            <span class="fl" style="padding-left: 8px;">在线帮助</span>
          </p>
        </div>
        <div style="position:relative" @click="clear()">
          <i
            class="glyphicon glyphicon-refresh iconStyle"
            style="color:#663333"
          ></i>
          <p class="user-button">
            <span class="fl" style="padding-left: 8px;">清除缓存</span>
          </p>
        </div>
      </div>
      <div class="message2 message">
        <div style="position:relative">
          <i
            class="glyphicon glyphicon-qrcode iconStyle"
            style="color:#666699"
          ></i>
          <p>
            <span class="fl" style="padding-left: 8px;">当前版本号</span>
            <span class="user-versions fr" style="font-family:'microsoft'"
              >V{{ versions }}</span
            >
          </p>
        </div>
      </div>
    </div>
    <footer>
      <div class="page">
        <div class="page__bd" style="height: 100%;">
          <div class="weui-tab">
            <div class="weui-tab__panel"></div>
            <div class="weui-tabbar">
              <a
                href="javascript:;"
                @click="tabPage('首页')"
                class="weui-tabbar__item weui-tabbar__item1 weui-bar__item_on"
              >
                <span style="display: inline-block;position: relative;">
                  <svg class="icon weui-tabbar__icon" aria-hidden="true">
                    <use xlink:href="#icon-shouye"></use>
                  </svg>
                  <span
                    class="weui-badge"
                    style="position: absolute;top: -2px;right: -13px;display:none;"
                    >8</span
                  >
                </span>
                <p class="weui-tabbar__label">首页</p>
              </a>
              <a
                href="javascript:;"
                @click="tabPage('应用')"
                class="weui-tabbar__item weui-tabbar__item3"
              >
                <span style="display: inline-block;position: relative;">
                  <svg class="icon weui-tabbar__icon" aria-hidden="true">
                    <use xlink:href="#icon-shuju-"></use>
                  </svg>
                  <span
                    class="weui-badge weui-badge_dot"
                    style="position: absolute;top: 0;right: -6px;display:none;"
                  ></span>
                </span>
                <p class="weui-tabbar__label">应用</p>
              </a>
              <a
                href="javascript:;"
                @click="tabPage('个人')"
                class="weui-tabbar__item weui-tabbar__item4"
              >
                <svg class="icon weui-tabbar__icon" aria-hidden="true">
                  <use xlink:href="#icon-jiaose"></use>
                </svg>
                <p class="weui-tabbar__label">个人</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div v-transfer-dom>
      <popup
        v-model="iframePopupShow"
        position="right"
        style="width: 100%;padding-bottom:0px;"
      >
        <div style="width:100%; height: 100%;">
          <IframeShow
            :model="iframeData"
            ref="iframeShow"
            style="margin-bottom: 44px;"
          ></IframeShow>
          <a
            href="javascript:;"
            @click="
              iframePopupShow = false
              $refs.iframeShow.hide()
            "
            class="weui-btn weui-btn_warn"
            style="position: fixed;bottom: 0px;width: 100%;"
            >关闭</a
          >
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProjectList from '../project/ProjectList.vue'
import IframeShow from '../common/IframeShow.vue'
import '@/public/js/iconfontIndexNav.js'
import { Swiper, SwiperItem, Popup, TransferDom, Blur } from 'vux'
import QualityAssurance from '../../assets/navImg/QualityAssurance.png'
import projectReport from '../../assets/navImg/projectReport.png'
import progress from '../../assets/navImg/progress.jpg'
import securityManagement from '../../assets/navImg/securityManagement.png'
import overtime from '../../assets/navImg/overtime.png'
import genre from '../../assets/navImg/genre.png'
import examine from '../../assets/navImg/examine.png'
import answer from '../../assets/navImg/answer.png'

const AllappList = [
  {
    modelId: '02',
    modelName: '工程质量管理',
    children: [
      {
        appId: '01',
        appName: '工程质量检查',
        name: 'safetyIndex',
        iconCls: QualityAssurance,
        paramter: 'qualityQuery'
      },
      // {
      //   appId: '02',
      //   appName: '项目资料',
      //   name: '',
      //   iconCls: projectReport,
      //   paramter: 'projectFiles'
      // },
      // {
      //   appId: '03',
      //   appName: '进度上报',
      //   name: '',
      //   iconCls: progress,
      //   paramter: 'progressExc'
      // },
      {
        appId: '04',
        appName: '工作日志',
        name: '',
        iconCls: projectReport,
        paramter: 'projWorkLog'
      }
    ]
  },
  {
    modelId: '03',
    modelName: '工程安全管理',
    children: [
      {
        appId: '01',
        // appName: '员工入职安全教育',
        appName: '安全教育',
        name: '',
        iconCls: projectReport,
        paramter: 'entryEducation'
      },
      {
        appId: '02',
        appName: '安全培训',
        name: '',
        iconCls: progress,
        paramter: 'safetyTraining'
      },
      {
        appId: '03',
        appName: '安全检查',
        name: '',
        iconCls: securityManagement,
        paramter: 'safetyCheck'
      },
      {
        appId: '04',
        appName: '安全整改',
        name: '',
        iconCls: overtime,
        paramter: 'safetyRectification'
      }
    ]
  }
  ,
  {
    modelId: '04',
    modelName: '知识库',
    children: [
      // {
      //   appId: '01',
      //   appName: '文档学习',
      //   name: '',
      //   iconCls: genre,
      //   paramter: 'documents'
      // },
      {
        appId: '02',
        appName: '考试答卷',
        name: '',
        iconCls: examine,
        paramter: 'examine'
      },
      {
        appId: '03',
        appName: '练习答卷',
        name: '',
        iconCls: answer,
        paramter: 'answer'
      }
    ]
  }
]

//     listName:'企业管理',
//     applist:[{appName:'资产管理',url:this.util.getBaseUrl()+'/static/icon/property.png'},{}]
// },{},{}]
export default {
  components: {
    Swiper,
    SwiperItem,
    Blur,
    ProjectList,
    Popup,
    TransferDom,
    IframeShow
  },
  directives: {
    TransferDom
  },
  computed: {
    ...mapState({
      avatar: state => state.avatar,
      userName: state => state.userName
    })
  },
  ready() {},
  methods: {
    demo07_onIndexChange(index) {
      this.demo07_index = index
    },
    tabPage(str) {
      $('.weui-bar__item_on').removeClass('weui-bar__item_on')
      $('.index-nav').css({ 'padding-bottom': '50px' })

      if (str == '项目') {
        $('.page-project').show()
        $('.page-project')
          .siblings('div')
          .hide()
        $('.weui-tabbar__item2').addClass('weui-bar__item_on')
        $('.index-nav').css({ padding: '0' })
      } else if (str == '应用') {
        $('.page-app').show()
        $('.page-app')
          .siblings('div')
          .hide()
        $('.weui-tabbar__item3').addClass('weui-bar__item_on')
      } else if (str == '个人') {
        $('.page-user').show()
        $('.page-user')
          .siblings('div')
          .hide()
        $('.weui-tabbar__item4').addClass('weui-bar__item_on')
      } else {
        $('.page-index').show()
        $('.page-index')
          .siblings('div')
          .hide()
        $('.weui-tabbar__item1').addClass('weui-bar__item_on')
      }
    },
    openApp(item, param) {
      if (item.type == 1) {
        this.util.gotoByName(item.path, param)
      } else if (item.type == 2) {
        this.iframePopupShow = true
        this.$refs.iframeShow._initData(this.util.getBaseUrl() + item.path)
      }

      //this.$router.push({ name: name });
    },
    openShortCut(item, param) {
      if (item.type == 1) {
        this.util.gotoByPath('/' + item.path, param)
      } else if (item.type == 2) {
        this.iframePopupShow = true
        this.$refs.iframeShow._initData(this.util.getBaseUrl() + item.path)
      }

      //this.$router.push({ name: name });
    },
    aboutZhuzhu() {
      //window.open("http://www.jrsoft.cc/");
      window.open('http://www.zhuzhu.biz/')
    },
    clear() {
      this.util.mask('正在清除...')
      setTimeout(this.refreshFun, 100)
    },
    refreshFun() {
      //alert("okkkk");
      var session = this.util.refreshSession()
      //$('.vux-loading').hide();
      if (session != null) {
        this.$store.state.session = session
      }
      this.util.unmask()
    }
  },

  created() {
    this.util.initWxJsSdk(this)
    this.util.flag = true
    var _this = this
    var param = {
      operateType: 'getNewsPicture',
      userUid: this.userUid
    }
    /* this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_News&appId=WeChat", param, function(res) {
            _this.util.unmask();
            if (res.status == 200 && res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                    // res.data[i].url=_this.util.getBaseUrl()+"/admin/appDefaultFormAction!showForm.action?formId=DForm_I002_office_doc&id="+res.data[i].id;
                    res.data[i].url = "/news/show?id=" + res.data[i].id + "&newsLogoId=" + res.data[i].img;
                    res.data[i].img = _this.util.getBaseUrl() + "/attachmentAction!look.action?id=" + res.data[i].img;
                }
                _this.demo07_list = res.data;
                console.log("_this.demo07_list",_this.demo07_list)
            }


        }); */
    //加载自定义配置
    this.util.post(
      '/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Sys&appId=WeChat&operateType=getApp',
      null,
      function(res) {
        console.log(res)
        if (res != undefined && res.status == 200) {
          if (res['oa'] != undefined && res['oa'].length > 0) {
            //    AllappList[0].children = AllappList[0].children.concat(res['oa']);
          }
          if (res['proj'] != undefined && res['proj'].length > 0) {
            AllappList[1].children = AllappList[1].children.concat(res['proj'])
          }
          if (res['sys'] != undefined && res['sys'].length > 0) {
            AllappList[2].children = AllappList[2].children.concat(res['sys'])
          }
          if (res['shortcut'] != undefined && res['shortcut'].length > 0) {
            _this.shortCutList = res['shortcut']
          }
        }
        console.log(AllappList)
      }
    )
  },
  activated() {
    //   console.info("-------------");
    this.util.init(this)
    var _this = this
    this.util.post(
      '/wx/workflowAction!getMyCount.action',
      {
        userId: this.sessionUtil.getUserId(),
        company_id: this.sessionUtil.getCompanyId()
      },
      function(res) {
        //this.util.post('/workflow/getMyCount', { userUid: this.sessionUtil.getUserUid(this) }, function (res) {
        if (res != undefined && res.status == 200) {
          _this.myApplyAllCount = res.data['APPLY_']
          _this.myApprovalUnFinishedCount = res.data['APPROVAL_UNFINISHED_']
          _this.myApprovalFinishedCount = res.data['APPROVAL_FINISHED_']
          _this.myCopyUnFinishedCount = res.data['COPY_UNFINISHED_']
          _this.myCopyFinishedCount = res.data['COPY_FINISHED_']
        }
        _this.util.unmask()
      }
    )
  },
  data() {
    return {
      demo07_list: [
        //     {
        //     // url: 'http://wx.zhuzhu.biz/',
        //     img: './static/scroller/gallery1.png',
        //     title: '人人都是项目管理专家'
        // },{
        //     // url: 'http://wx.zhuzhu.biz/',
        //     img: './static/scroller/gallery2.png',
        //     title: '人人都是项目管理专家'
        // },
        {
          // url: 'http://wx.zhuzhu.biz/',
          img: './static/scroller/gallery3.png',
          title: '人人都是项目管理专家'
        }
      ],
      iframeData: { parent: this },
      iframePopupShow: false,
      myApplyAllCount: 0,
      myApprovalUnFinishedCount: 0,
      myApprovalFinishedCount: 0,
      myCopyUnFinishedCount: 0,
      myCopyFinishedCount: 0,
      demo07_index: 0,
      appList: AllappList,
      shortCutList: [],
      visible: false,
      versions: '1.0.0'
    }
  }
}
</script>

<style scoped>
.center {
  text-align: center;
  padding-top: 20px;
  color: #fff;
  font-size: 18px;
}

.center img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ececec;
}

.user-logo {
  height: 155px !important;
}

.iconStyle {
  position: absolute;
  left: 7px;
  top: 50%;
  margin-top: -7px;
}

a {
  color: #000;
  text-decoration: none;
}

ul,
li,
p {
  margin: 0;
}

.index-nav {
  width: 100%;
  height: 100%;
  padding-bottom: 50px;
  overflow-y: auto;
}

.page-project,
.page-app,
.page-user {
  display: none;
}

.page-user {
  height: 100%;
  width: 100%;
  background: #eee;
}

.if-backlog {
  margin: 10px 0 0 0;
}

.if-backlog ul,
.mobile-office ul {
  overflow: hidden;
  margin: 0;
}

.if-backlog ul li,
.mobile-office ul li {
  float: left;
  width: 33.3%;
  height: 60px;
  line-height: 55px;
  box-sizing: border-box;
  padding: 0 5px 5px 0;
}

.if-backlog ul li a,
.mobile-office ul li a {
  display: inline-block;
  background: #e76281;
  width: 100%;
  height: 100%;
  color: #fff;
}

.if-backlog ul li:nth-child(1) {
  height: 120px;
  line-height: 115px;
  padding-left: 5px;
}

.mobile-office {
  margin: 5px 0 5px;
}

.mobile-office ul li a {
  background: #3299cd;
}

.mobile-office ul li:nth-child(1) {
  padding-left: 5px;
}

.use-list {
  border-top: 1px solid rgb(222, 221, 227);
}

.use-list ul {
  overflow: hidden;
}

.use-list li {
  float: left;
  width: 25%;
  padding: 0 10px;
}

.use-list li p {
  padding: 10px 0;
}

.use-list li p:active {
  background: #90c0d8;
}

.use-list img {
  width: 40px;
  padding-bottom: 5px;
}

.use-list span {
  display: block;
}

footer {
  position: fixed;
  bottom: 0px;
  width: 100%;
}

.weui-tabbar {
  height: 100%;
}

.page-app ul {
  overflow: hidden;
}

.page-app li {
  float: left;
  width: 25%;
}

.page-app li:active {
  background: #90c0d8;
}

.page-app img {
  width: 45px;
  margin: 10px 0;
}

.page-app .caption {
  text-align: left;
  border-bottom: 1px dashed rgb(222, 221, 227);
  padding: 10px 15px;
  margin-bottom: 3px;
  background: #eee;
}

.user-header {
  background-image: -webkit-linear-gradient(top, #d1e8f0, #9daeb1);
  padding: 15px;
}

.user-header img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 10px;
}

.message {
  background: #fff;
  margin: 10px 0;
  /* border-top:1px solid #989898; */
  /* border-bottom:1px solid #eee; */
  /* padding: 0 20px; */
}

.message > div {
  padding: 10px 20px;
}

.message p {
  overflow: hidden;
}

.message > div {
  border-bottom: 1px solid #eee;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.user-button {
  position: relative;
}

.user-button::after {
  content: '';
  width: 10px;
  height: 10px;
  /* background: #C9CAC9; */
  position: absolute;
  right: -4px;
  top: 50%;
  margin-top: -5px;
  box-sizing: border-box;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #c9cac9;
  border-right: 5px solid transparent;
}
/* 
.user-button:active {
} */
</style>
<style>
.page-index
  .vux-slider
  > .vux-swiper
  > .vux-swiper-item
  > a
  > .vux-swiper-desc {
  padding: 10px 0;
  bottom: auto;
  top: 0;
  height: auto;
  font-family: 'microsoft yahei';
}
</style>
