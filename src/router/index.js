import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index.js'
import { resolve } from 'path'

Vue.use(Router)

const router = new Router({
  // 去掉#/的方法
  //mode: 'history',
  //linkActiveClass: 'header-active',
  //hashbang: false,
  //base: '/jpro/',
  //history: true,
  routes: [
    {
      path: '/',
      name: 'index',
      // component: require('@/components/home/Index.vue'),
      component: resolve => require(['@/components/home/Index.vue'], resolve),
      meta: {
        title: ''
      },
      children: [
        {
          path: 'index/',
          redirect: '/'
        }
      ]
    },
    {
      path: '/app/index',
      name: 'app/index',
      meta: {
        title: '首页'
      },
      component: resolve => require(['@/components/home/indexNav.vue'], resolve)
    },
    // {
    //  path: '/',
    //   name: 'Hello',
    //  component: Hello
    // },
    //登录页面
    // {
    //     path: '/registerStep1',
    //     name: 'registerStep1',
    //     meta: {
    //         title: '欢迎登陆',
    //     },
    //     component: require('@/components/registerStep1.vue')
    // },
    // {
    //     path: '/registerStep2',
    //     name: 'registerStep2',
    //     meta: {
    //         title: '联系人',
    //     },
    //     component: require('@/components/registerStep2.vue')
    // }, {
    //     path: '/org/orgManager',
    //     name: 'orgManager',
    //     meta: {
    //         title: '组织管理',
    //     },
    //     component: require('@/components/org/orgManager.vue')
    // }, {
    //     path: '/org/addUser',
    //     name: 'org/addUser',
    //     meta: {
    //         title: '添加用户',
    //     },
    //     component: require('@/components/org/AddUser.vue')
    // }, {
    //     path: '/sys/manager',
    //     name: 'sys/manager',
    //     meta: {
    //         title: '系统配置',
    //     },
    //     component: require('@/components/sys/index.vue')
    // }, {
    //     path: '/sys/dicManager',
    //     name: 'dicManager',
    //     meta: {
    //         title: '数据字典配置',
    //     },
    //     component: require('@/components/sys/dicManager.vue')
    // }, {
    //     path: '/sys/analyze',
    //     name: 'sys/analyze',
    //     meta: {
    //         title: '报表中心',
    //     },
    //     component: require('@/components/sys/Analyze.vue')
    // }, {
    //     path: '/sys/analyze/checking',
    //     name: 'sys/analyze/checking',
    //     meta: {
    //         title: '考勤统计',
    //     },
    //     component: require('@/components/sys/Checking.vue')
    // }
    {
      path: '/projWorkLog',
      name: 'projWorkLog',
      meta: {
        title: '工作日志'
      },
      component: resolve => require(['@/components/workLog/Index.vue'], resolve)
    },
    {
      path: '/workLogInfo',
      name: 'workLogInfo',
      meta: {
        title: '工作日志详情'
      },
      component: resolve =>
        require(['@/components/workLog/WorkLog.vue'], resolve)
    },
    //  {
    //     path: '/proj/workLog/query',
    //     name: 'proj/workLog/query',
    //     meta: {
    //         title: '施工日志查询'
    //     },
    //     component: resolve => require(['@/components/workLog/Query.vue'], resolve)
    // }, {
    //     path: '/record/index',
    //     name: 'record/index',
    //     meta: {
    //         title: '随手拍'
    //     },
    //     component: resolve => require(['@/components/record/Index.vue'], resolve)
    // }, {
    //     path: '/record/info',
    //     name: 'record/info',
    //     meta: {
    //         title: '随手拍详情'
    //     },
    //     component: resolve => require(['@/components/record/Record.vue'], resolve)
    // },
    {
      path: '/record/show',
      name: 'record/show',
      meta: {
        title: '随手拍图片墙'
      },
      component: resolve => require(['@/components/record/Show.vue'], resolve)
    },
    {
      path: '/workflow/model/index',
      name: 'workflow/model/index',
      meta: {
        title: '流程配置'
      },
      // component: require('@/components/workflow/index.vue')
      component: resolve =>
        require(['@/components/workflow/index.vue'], resolve)
    },
    {
      path: '/workflow/model/design',
      name: 'workflow/model/design',
      meta: {
        title: '流程设计'
      },
      // component: require('@/components/workflow/Design.vue')
      component: resolve =>
        require(['@/components/workflow/Design.vue'], resolve)
    },
    {
      path: '/workflow/desktop',
      name: 'workflow/desktop',
      meta: {
        title: '流程审批'
      },
      // component: require('@/components/workflow/Desktop.vue')
      component: resolve =>
        require(['@/components/workflow/Desktop.vue'], resolve)
    },
    {
      path: '/workflow/applyIndex',
      name: 'workflow/applyIndex',
      meta: {
        title: '流程申请'
      },
      // component: require('@/components/workflow/ApplyIndex.vue')
      component: resolve =>
        require(['@/components/workflow/ApplyIndex.vue'], resolve)
    },
    {
      path: '/workflow/apply',
      name: 'workflow/apply',
      meta: {
        title: '我申请的'
      },
      // component: require('@/components/workflow/ApplyList.vue')
      component: resolve =>
        require(['@/components/workflow/ApplyList.vue'], resolve)
    },
    {
      path: '/workflow/approval',
      name: 'workflow/approval',
      meta: {
        title: '我的待办'
      },
      // component: require('@/components/workflow/ApprovalList.vue')
      component: resolve =>
        require(['@/components/workflow/ApprovalList.vue'], resolve)
    },
    {
      path: '/workflow/copy',
      name: 'workflow/copy',
      meta: {
        title: '抄送我的'
      },
      // component: require('@/components/workflow/CopyList.vue')
      component: resolve =>
        require(['@/components/workflow/CopyList.vue'], resolve)
    },
    {
      path: '/processForm',
      name: 'processForm',
      meta: {
        title: '流程处理'
      },
      component: resolve =>
        require(['@/components/common/ProcessForm.vue'], resolve)
    },
    {
      path: '/workflow/formDetailData',
      name: 'workflow/formDetailData',
      meta: {
        title: '表单详细信息'
      },
      // component: require('@/components/workflow/FormDetailData.vue')
      component: resolve =>
        require(['@/components/workflow/FormDetailData.vue'], resolve)
    },
    {
      path: '/workflow/processPng',
      name: 'workflow/processPng',
      meta: {
        title: '查看流程图'
      },
      // component: require('@/components/workflow/ProcessPng.vue')
      component: resolve =>
        require(['@/components/workflow/ProcessPng.vue'], resolve)
    },
    // {
    //     path: '/apply/applyGoods',
    //     name: 'apply/applyGoods',
    //     meta: {
    //         title: '领用申请'
    //     },
    //     component: require('@/components/apply/ApplyGoods.vue')
    // }, {
    //     path: '/apply/applyCommon',
    //     name: 'apply/applyCommon',
    //     meta: {
    //         title: '通用申请'
    //     },
    //     component: require('@/components/apply/applyCommon.vue')
    // }, {
    //     path: '/apply/applyPurchase',
    //     name: 'apply/applyPurchase',
    //     meta: {
    //         title: '采购申请'
    //     },
    //     component: require('@/components/apply/ApplyPurchase.vue')
    // }, {
    //     path: '/apply/applyBorrowing',
    //     name: 'apply/applyBorrowing',
    //     meta: {
    //         title: '借款申请'
    //     },
    //     component: require('@/components/apply/ApplyBorrowing.vue')
    // }, {
    //     path: '/apply/applyPayment',
    //     name: 'apply/applyPayment',
    //     meta: {
    //         title: '付款申请'
    //     },
    //     component: require('@/components/apply/ApplyPayment.vue')
    // }, {
    //     path: '/apply/applyWorkover',
    //     name: 'apply/applyWorkover',
    //     meta: {
    //         title: '加班申请'
    //     },
    //     component: require('@/components/apply/ApplyWorkover.vue')
    // }, {
    //     path: '/apply/applyRegularWork',
    //     name: 'apply/applyRegularWork',
    //     meta: {
    //         title: '转正申请'
    //     },
    //     component: require('@/components/apply/ApplyRegularWork.vue')
    // }//,

    {
      path: '/common/selectUser',
      name: '/common/selectUser',
      meta: {
        title: '选择用户'
      },
      // component: require('@/components/common/SelectUser.vue'),
      component: resolve =>
        require(['@/components/common/SelectUser.vue'], resolve)
    },
    // // {
    // //     path: '/',
    // //     name: 'index',
    // //     component: require('@/components/home/Index.vue'),
    // //     meta: {
    // //         title: '',
    // //     },
    // //     children: [{
    // //         path: 'index/',
    // //         redirect: '/'
    // //     }]
    // // },
    // {
    //     path: '/movebx',
    //     name: 'movebx',
    //     component: require('@/components/home/Movebx.vue'),
    //     meta: {
    //         title: '新建报销',
    //     }
    //     // children: [
    //     //       {
    //     //         path: 'index/',
    //     //         redirect:'/'
    //     //       }
    //     // ]
    // },
    // {
    //     //服务端一律跳转到这个URL上
    //     path: '/home/:id/:redirectUrl/',
    //     redirect: to => {
    //         /**
    //          * 通过dispatch触发保存openid的action
    //          * 将URL上的OPENID保存到store中
    //          */
    //         store.dispatch({
    //                 type: 'setOpenId',
    //                 amount: to.params.id,
    //             })
    //             //在回跳到需要来访的正确页面
    //         return `/${to.params.redirectUrl}/`
    //     }
    // },
    // {
    //     path: '/count',
    //     name: 'count',
    //     component: Count
    // },
    // {
    //     path: '/sumbitChoose',
    //     name: 'sumbitChoose',
    //     meta: {
    //         title: '已提交报销',
    //     },
    //     component: require('@/components/home/sumbitChoose.vue')
    // },
    // {
    //     path: '/completeChoose',
    //     name: 'completeChoose',
    //     meta: {
    //         title: '已完成报销',
    //     },

    //     component: require('@/components/home/CompleteChoose.vue')
    // },
    // {
    //     path: '/draft',
    //     name: 'draft',
    //     meta: {
    //         title: '报销草稿',
    //     },
    //     component: require('@/components/home/Draft.vue')
    // },
    // {
    //     path: '/approval',
    //     name: 'approval',
    //     meta: {
    //         title: '审批',
    //     },
    //     component: require('@/components/home/Approval.vue')
    // },
    // {
    //     path: '/pendingApproval',
    //     name: 'pendingApproval',
    //     meta: {
    //         title: '待审批',
    //     },
    //     component: require('@/components/home/PendingApproval.vue')
    // },
    // {
    //     path: '/doneApproval',
    //     name: 'doneApproval',
    //     meta: {
    //         title: '已审批',
    //     },
    //     component: require('@/components/home/DoneApproval.vue')
    // },
    /*         {
                    path: '/qualityIndex',
                    name: 'qualityIndex',
                    meta: {
                        title: '质量检查'
                    },
                    component: resolve => require(['@/components/quality/QualityIndex.vue'], resolve)
                },

                {
                    path: '/checkBillList',
                    name: 'checkBillList',
                    meta: {
                        title: '质量检查'
                    },
                    component: resolve => require(['@/components/quality/CheckBillList.vue'], resolve)
                },
                {
                    path: '/addQualityInspect',
                    name: 'addQualityInspect',
                    meta: {
                        title: '新增质量检查'
                    },
                    component: resolve => require(['@/components/quality/AddQualityInspect.vue'], resolve)
                },
                {
                    path: '/addImproveBill',
                    name: 'addImproveBill',
                    meta: {
                        title: '新增质量整改单'
                    },
                    component: resolve => require(['@/components/quality/AddImproveBill.vue'], resolve)
                }, {
                    path: '/improveBillList',
                    name: 'improveBillList',
                    meta: {
                        title: '质量整改'
                    },
                    component: resolve => require(['@/components/quality/ImproveBillList.vue'], resolve)
                },

                {
                    path: '/checkBillShow',
                    name: 'checkBillShow',
                    meta: {
                        title: '质量检查详情'
                    },
                    component: resolve => require(['@/components/quality/CheckBillShow.vue'], resolve)
                },
                {
                    path: '/improveBillShow',
                    name: 'improveBillShow',
                    meta: {
                        title: '质量整改单'
                    },
                    component: resolve => require(['@/components/quality/ImproveBillShow.vue'], resolve)
                }, */
    /* 	{
		path: "/addLeave",
		name: "addLeave",
		meta: {
			title: "新建请假",
		},
		component: resolve => require(["@/components/leave/AddLeave.vue"], resolve)
	},
	{
		path: "/LeaveQuery",
		name: "LeaveQuery",
		meta: {
			title: "我的请假",
		},
		component: resolve => require(["@/components/leave/LeaveQuery.vue"], resolve)
	},
	{
		path: "/DayOffQuery",
		name: "DayOffQuery",
		meta: {
			title: "我的调休",
		},
		component: resolve => require(["@/components/leave/DayOffQuery.vue"], resolve)
	},
	{
		path: "/AddOff",
		name: "AddOff",
		meta: {
			title: "新建调休",
		},
		component: resolve => require(["@/components/leave/AddOff.vue"], resolve)
	}, */
    // {
    // 	path: "/qualityQuery",
    // 	name: "qualityQuery",
    // 	meta: {
    // 		title: "质量检查",
    // 	},
    // 	component: resolve => require(["@/components/quality/qualityQuery.vue"], resolve)
    // },
    // {
    // 	path: "/addQuality",
    // 	name: "addQuality",
    // 	meta: {
    // 		title: "新建质量检查",
    // 	},
    // 	component: resolve => require(["@/components/quality/addQuality.vue"], resolve)
    // },
    //工程质量管理
    {
      path: '/qualityQuery',
      name: 'qualityQuery',
      meta: {
        title: '质量检查'
      },
      component: resolve =>
        require(['@/components/newpart/quality/qualityQuery.vue'], resolve)
    },
    {
      path: '/addQuality',
      name: 'addQuality',
      meta: {
        title: '质量检查'
      },
      component: resolve =>
        require(['@/components/newpart/quality/addQuality.vue'], resolve)
    },

    //工程安全管理
    //员工入职安全教育
    {
      path: '/entryEducation',
      name: 'entryEducation',
      meta: {
        title: '员工入职安全教育'
      },
      component: resolve =>
        require([
          '@/components/newpart/safety/entry_education/entryEducation.vue'
        ], resolve)
    },
    {
      path: '/entryEducationAdd',
      name: 'entryEducationAdd',
      meta: {
        title: '员工入职安全教育'
      },
      component: resolve =>
        require([
          '@/components/newpart/safety/entry_education/entryEducationAdd.vue'
        ], resolve)
    },
    //安全培训
    {
      path: '/safetyTraining',
      name: 'safetyTraining',
      meta: {
        title: '安全培训'
      },
      component: resolve =>
        require([
          '@/components/newpart/safety/safety_training/safetyTraining.vue'
        ], resolve)
    },
    {
      path: '/safetyTrainingAdd',
      name: 'safetyTrainingAdd',
      meta: {
        title: '安全培训'
      },
      component: resolve =>
        require([
          '@/components/newpart/safety/safety_training/safetyTrainingAdd.vue'
        ], resolve)
    },
    //安全检查
    {
      path: '/safetyCheck',
      name: 'safetyCheck',
      meta: {
        title: '安全检查'
      },
      component: resolve =>
        require([
          '@/components/newpart/safety/safety_check/safetyCheck.vue'
        ], resolve)
    },
    {
      path: '/safetyCheckAdd',
      name: 'safetyCheckAdd',
      meta: {
        title: '安全检查'
      },
      component: resolve =>
        require([
          '@/components/newpart/safety/safety_check/safetyCheckAdd.vue'
        ], resolve)
    },
    //安全整改
    {
      path: '/safetyRectification',
      name: 'safetyRectification',
      meta: {
        title: '安全整改'
      },
      component: resolve =>
        require([
          '@/components/newpart/safety/safety_rectification/safetyRectification.vue'
        ], resolve)
    },
    {
      path: '/safetyRectificationAdd',
      name: 'safetyRectificationAdd',
      meta: {
        title: '安全整改'
      },
      component: resolve =>
        require([
          '@/components/newpart/safety/safety_rectification/safetyRectificationAdd.vue'
        ], resolve)
    },
    // 文档学习
    {
      path: '/documents',
      name: 'documents',
      meta: {
        title: '文档学习'
      },
      component: resolve =>
        require(['@/components/repository/documents.vue'], resolve)
    },
    {
      path: '/documentsAdd',
      name: 'documentsAdd',
      meta: {
        title: '文档学习'
      },
      component: resolve =>
        require(['@/components/repository/documentsAdd.vue'], resolve)
    },
    // 考试答卷
    {
      path: '/examine',
      name: 'examine',
      meta: {
        title: '发布考试'
      },
      component: resolve =>
        require(['@/components/repository/examine.vue'], resolve)
    },
    {
      path: '/examineAdd',
      name: 'examineAdd',
      meta: {
        title: '添加试卷'
      },
      component: resolve =>
        require(['@/components/repository/examineAdd.vue'], resolve)
    },
    {
      path: '/examination',
      name: 'examination',
      meta: {
        title: '我的考试'
      },
      component: resolve =>
        require(['@/components/repository/examination.vue'], resolve)
    },{
      path: '/checkPaper',
      name: 'checkPaper',
      meta: {
        title: '查看试卷'
      },
      component: resolve =>
        require(['@/components/repository/checkPaper.vue'], resolve)
    },
    // 练习答卷
    {
      path: '/answer',
      name: 'answer',
      meta: {
        title: '练习答卷'
      },
      component: resolve =>
        require(['@/components/repository/answer.vue'], resolve)
    },
    {
      path: '/answerAdd',
      name: 'answerAdd',
      meta: {
        title: '设置练习'
      },
      component: resolve =>
        require(['@/components/repository/answerAdd.vue'], resolve)
    },
    {
      path: '/testStat',
      name: 'testStat',
      meta: {
        title: '练习统计'
      },
      component: resolve =>
        require(['@/components/repository/testStat.vue'], resolve)
    },
    {
      path: '/details',
      name: 'details',
      meta: {
        title: '练习明细'
      },
      component: resolve =>
        require(['@/components/repository/details.vue'], resolve)
    },
    {
      path: '/exercise',
      name: 'exercise',
      meta: {
        title: '练习试卷'
      },
      component: resolve =>
        require(['@/components/repository/exercise.vue'], resolve)
    },
    /* 	{
		path: "/safetyQuery",
		name: "safetyQuery",
		meta: {
			title: "安全检查",
		},
		component: resolve => require(["@/components/safety/safetyQuery.vue"], resolve)
	},
	{
		path: "/addSafety",
		name: "addSafety",
		meta: {
			title: "新建安全检查",
		},
		component: resolve => require(["@/components/safety/addSafety.vue"], resolve)
	}, */
    {
      path: '/projectFiles',
      name: 'projectFiles',
      meta: {
        title: '项目资料'
      },
      component: resolve =>
        require(['@/components/project/projectFiles.vue'], resolve)
    },
    // {
    // 	path: "/progressQuery",
    // 	name: "progressQuery",
    // 	meta: {
    // 		title: "进度上报",
    // 	},
    // 	component: resolve => require(["@/components/project/progressQuery.vue"], resolve)
    // },
    // {
    // 	path: "/addProgress",
    // 	name: "addProgress",
    // 	meta: {
    // 		title: "新建进度上报",
    // 	},
    // 	component: resolve => require(["@/components/project/addProgress.vue"], resolve)
    // },
    {
      path: '/prgReport',
      name: 'prgReport',
      meta: {
        title: 'prgReportDetail'
      },
      component: resolve =>
        require(['@/components/progress/prgReport.vue'], resolve)
    },
    {
      path: '/prgReportDetail',
      name: 'prgReportDetail',
      meta: {
        title: '项目上报编辑'
      },
      component: resolve =>
        require(['@/components/progress/prgReportDetail.vue'], resolve)
    },
    {
      path: '/progressExc',
      name: 'progressExc',
      meta: {
        title: '进度上报'
      },
      component: resolve =>
        require(['@/components/progress/progressExc.vue'], resolve)
    },
    {
      path: '/progressExcDetail',
      name: 'progressExcDetail',
      meta: {
        title: '新建进度上报'
      },
      component: resolve =>
        require(['@/components/progress/progressExcDetail.vue'], resolve)
    },
    {
      path: '/movebx',
      name: 'movebx',
      meta: {
        title: '新建报销'
      },
      component: resolve => require(['@/components/movebx/Movebx.vue'], resolve)
    },
    {
      path: '/movebx3',
      name: 'movebx3',
      meta: {
        title: '新建报销'
      },
      component: resolve =>
        require(['@/components/movebx/Movebx3.vue'], resolve)
    },
    {
      path: '/MovebxQuerry',
      name: 'MovebxQuerry',
      meta: {
        title: '报销查询'
      },
      component: resolve =>
        require(['@/components/movebx/MovebxQuerry.vue'], resolve)
    },

    {
      path: '/sign',
      name: 'sign',
      meta: {
        title: '考勤管理'
      },
      component: resolve => require(['@/components/sign/Sign.vue'], resolve)
    },
    {
      path: '/checkOutWork',
      name: 'checkOutWork',
      meta: {
        title: '外勤签到'
      },
      component: resolve =>
        require(['@/components/sign/child/CheckOutWork.vue'], resolve)
    },
    {
      path: '/checkOutShow',
      name: 'checkOutShow',
      meta: {
        title: '外勤详情'
      },
      component: resolve =>
        require(['@/components/sign/child/CheckOutShow.vue'], resolve)
    },
    {
      path: '/attRecord',
      name: 'attRecord',
      meta: {
        title: '考勤签到列表'
      },
      component: resolve =>
        require(['@/components/sign/child/AttRecord.vue'], resolve)
    },
    {
      path: '/checkWork',
      name: 'checkWork',
      meta: {
        title: '考勤签到'
      },
      // component: require('@/components/sign/child/CheckWork.vue')
      component: resolve =>
        require(['@/components/sign/child/CheckWork.vue'], resolve)
    },
    {
      path: '/checkSeting',
      name: 'checkSeting',
      meta: {
        title: '考勤设置'
      },
      component: resolve =>
        require(['@/components/sign/CheckSeting.vue'], resolve)
    },
    {
      path: '/setCheckPoint',
      name: 'setCheckPoint',
      meta: {
        title: '考勤点列表'
      },
      // component: require('@/components/home/SetCheckPoint.vue')
      component: resolve =>
        require(['@/components/sign/SetCheckPoint.vue'], resolve)
    },
    {
      path: '/setingPoint',
      name: 'setingPoint',
      meta: {
        title: '考勤点设置'
      },
      // component: require('@/components/sign/child/SetingPoint.vue')
      component: resolve =>
        require(['@/components/sign/SetingPoint.vue'], resolve)
    },
    {
      path: '/pointEdit',
      name: 'pointEdit',
      meta: {
        title: '新增考勤点'
      },
      component: resolve =>
        require(['@/components/sign/PointEdit.vue'], resolve)
    },
    {
      path: '/setClassList',
      name: 'setClassList',
      meta: {
        title: '考勤班次'
      },
      component: resolve =>
        require(['@/components/sign/SetClassList.vue'], resolve)
    },
    {
      path: '/classEdit',
      name: 'classEdit',
      meta: {
        title: '班次编辑'
      },
      component: resolve =>
        require(['@/components/sign/ClassEdit.vue'], resolve)
    },
    {
      path: '/news/show',
      name: 'news/show',
      meta: {
        title: '新闻详情'
      },
      component: resolve => require(['@/components/home/ShowNews.vue'], resolve)
    },
    /*, {
                    path: '/sys/manager',
                    name: 'sys/manager',
                    meta: {
                        title: '企业设置',
                    },
                    component: resolve => require(['@/components/sys/index.vue'], resolve)
                } , {
                    path: '/projectList',
                    name: 'projectList',
                    meta: {
                        title: '项目管理'
                    },
                    component: resolve => require(['@/components/project/ProjectList.vue'], resolve)
                }, {
                    path: '/addProject',
                    name: 'addProject',
                    meta: {
                        title: '添加项目'
                    },
                    component: resolve => require(['@/components/project/AddProject.vue'], resolve)
                }, {
                    path: '/applyBorrowing',
                    name: 'applyBorrowing',
                    meta: {
                        title: '借支申请'
                    },
                    component: resolve => require(['@/components/apply/ApplyBorrowing.vue'], resolve)
                }, {
                    path: '/business',
                    name: 'business',
                    meta: {
                        title: '出差申请'
                    },
                    component: resolve => require(['@/components/apply/ApplyBusiness.vue'], resolve)
                }, {
                    path: '/safetyIndex',
                    name: 'safetyIndex',
                    meta: {
                        title: '安全检查'
                    },
                    component: resolve => require(['@/components/safety/SafetyIndex.vue'], resolve)
                },
                {
                    path: '/addSafetyCheck',
                    name: 'addSafetyCheck',
                    meta: {
                        title: '新增安全检查'
                    },
                    component: resolve => require(['@/components/safety/AddSafetyCheck.vue'], resolve)
                },
                {
                    path: '/safetyCheckBillList',
                    name: 'safetyCheckBillList',
                    meta: {
                        title: '安全检查列表'
                    },
                    component: resolve => require(['@/components/safety/SafetyCheckBillList.vue'], resolve)
                },
                {
                    path: '/safetyCheckBillShow',
                    name: 'safetyCheckBillShow',
                    meta: {
                        title: '安全检查详情'
                    },
                    component: resolve => require(['@/components/safety/SafetyCheckBillShow.vue'], resolve)
                }, {
                    path: '/safetyImproveBillList',
                    name: 'safetyImproveBillList',
                    meta: {
                        title: '安全整改'
                    },
                    component: resolve => require(['@/components/safety/SafetyImproveBillList.vue'], resolve)
                },
                {
                    path: '/addSafetyImproveBill',
                    name: 'addSafetyImproveBill',
                    meta: {
                        title: '安全整改单'
                    },
                    component: resolve => require(['@/components/safety//AddSafetyImproveBill.vue'], resolve)
                },
                {
                    path: '/safetyImproveBillShow',
                    name: 'safetyImproveBillShow',
                    meta: {
                        title: '安全整改单'
                    },
                    component: resolve => require(['@/components/safety/SafetyImproveBillShow.vue'], resolve)
                }*/
    {
      path: '/newslist',
      name: 'newslist',
      meta: {
        title: '新闻列表'
      },
      component: resolve => require(['@/components/home/NewsList.vue'], resolve)
    },
    {
      path: '/newsDetails',
      name: 'newsDetails',
      meta: {
        title: '新闻详情'
      },
      component: resolve =>
        require(['@/components/home/NewsDetails.vue'], resolve)
    },
    {
      path: '/announcement',
      name: 'announcement',
      meta: {
        title: '通知公告'
      },
      component: resolve =>
        require(['@/components/home/announcement.vue'], resolve)
    },
    {
      path: '/annouDetails',
      name: 'annouDetails',
      meta: {
        title: '公告详情'
      },
      component: resolve =>
        require(['@/components/home/annouDetails.vue'], resolve)
    },
    {
      path: '/email',
      name: 'email',
      meta: {
        title: '邮件'
      },
      component: resolve => require(['@/components/home/email.vue'], resolve)
    },
    {
      path: '/emailDetails',
      name: 'emailDetails',
      meta: {
        title: '邮件详情'
      },
      component: resolve =>
        require(['@/components/home/emailDetails.vue'], resolve)
    },
    {
      path: '/note',
      name: 'note',
      meta: {
        title: '短信'
      },
      component: resolve => require(['@/components/home/note.vue'], resolve)
    },
    {
      path: '/noteDetails',
      name: 'noteDetails',
      meta: {
        title: '短信详情'
      },
      component: resolve =>
        require(['@/components/home/noteDetails.vue'], resolve)
    }

    //, {
    //     path: '/projectSeeing',
    //     name: 'projectSeeing',
    //     meta: {
    //         title: '项目看板'
    //     },
    //     component: require('@/components/project/ProjectSeeing.vue')
    // }
  ]
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
