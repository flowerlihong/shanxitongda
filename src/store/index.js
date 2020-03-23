import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import { FormatDate, baseUrl } from '@/utils/utils.js';

const state = {
    lists: [
    {
        introduction: '',
        price: 0.0,
        cbmc: '选择科目',
        sl: 0,
        je:0,
        see: true,
        popupVisible1: false,
        happenDate: new Date().format("yyyy-MM-dd"),
        
    }
    ],
    operate: null,
    temp: null,
    session: null,
    index: 1,
    webUrl: '',
    valueList1: '',
    userUid: '', //用户36位id
    userLogo: '', //用户头像
    movebxMainId: null, //业务id
    myUserList:[],
    projList: [], //项目列表
    projSelectedList: [], //已选项目列表
    projSearchList: [], //搜索出的项目列表
    selectProjModel: { selectProjVisible: false, projName: '选择项目', projUid: null },
    kmList: [],
    personList: [], //用户列表
    amountTotal: '', //金额大写
    classDatas: [], //班次数据集合
    classData: {}, //单个班次数据
    pointDatas: [], //考勤点数据集合
    pointData: {}, //单个考勤点数据
    deletePointBtnVisable: false, //是否显示删除考勤点按钮
    userNames: '',
    departNames: '',
    location: '', //考勤点位置
    classDepartShow: '',
    classUserShow: ''
};
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});