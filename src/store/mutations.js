import {
    INCREMENT,
    DECREMENT,
    ADD,
    DELET,
    HIDE,
    SHOW,
    ADD_A,
    SUMBIT,
    XZXM,
    XZKM,
    selectProj,
    updateMainFormHeight,
    GOTOAPPROVAL,
    GOTOMOVEBX,
    GOTOPOINTEDIT
} from './types'
// import getters from './getters'
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$http = axios;
import { MessageBox } from 'mint-ui';
import { FormatDate, baseUrl, cloneObj, amountLtoU, getNextActInfo } from '@/utils/utils.js';
export default {
    [INCREMENT](state) {
        state.count++;
    },
    [DECREMENT](state) {
        state.count--;
    },
    [ADD](state, list) {
        var newObj = cloneObj(list);
        state.lists.push(newObj);
        state.index++;
    },
    [DELET](state, list) {
        MessageBox.confirm('确定执行此操作?', '提示');
        MessageBox.confirm('确定执行此操作?').then(action => {
            state.lists = state.lists.filter((item) => {
                return item != list;
            });
            state.index--;
        }, (onRejected) => {});
    },
    [SHOW](state, list) {
        list.see = !list.see;
    },
    [ADD_A](state) {
        let item = {
            introduction: '',
            price: 0.0,
            style1: "",
            cbmc: '选择科目',
            sl: 0,
            dj: 0,
            see: true,
            unsee: false,
            popupVisible1: false
        };
        state.lists.push(item);
        state.index++;
    },
    [XZXM](state, { data, list }) {
        list.popupVisible = true
        if (data.datas.length > 0) {
            state.xmList = data.datas;
        }

    },
    [selectProj](state, { selectProjModel }) {
        selectProjModel.selectProjVisible = true;
    },
    [updateMainFormHeight](state, { flag }){

    },
    [XZKM](state, { list, data }) {
        list.popupVisible1 = true;
        if (data.length > 0) {
            state.kmList = data;
        }
    },
    updateBxTitle(state, bxTitle) {
        state.bxTitle = bxTitle
    },
    updateValueList(state, valueList) {
        state.valueList = valueList
    },
    updateValueList1(state, valueList) {
        state.valueList = valueList
    },
    updateValuePerson(state, valueList) {
        state.valuePerson = valueList
    },
    [GOTOAPPROVAL](state, item) {
        axios.get(baseUrl() + '/expenseApply/getExpenseDetById?expenseUid=' + item.id).then((res) => {
            state.detList = res.data;
        }, (onRejected) => {});
        state.approData = item;
        if (item.dataType == "submit") {
            state.isShowApprovalBtn = false;
        }
        state.amountTotal = amountLtoU(item.totalCount);
        state.ifGetHistoricTask = true;
        //state.stepItems = [];
        //state.commentItems = [];
        state.procInstId = item.procInstId;
        state.procDefId = item.procDefId;
        if (item.hadApproval == 'true') {
            state.approvalStatus = "已审批"
            state.isShowApprovalBtn = false;
            state.isShowApprovedBtn = true;
        }
        if (item.taskId != null) {
            getNextActInfo("taskId=" + item.taskId + "&procInstId=" + item.procInstId, function(result) {
                //console.debug(result);
                state.dialogTitle = "下一环节[" + result.activities[0].name + "]";
                state.currentActName = result.currentActName;
                state.currentActId = result.currentActId;
                state.taskType = result.activities[0].taskType;

            });
        } else {
            state.ifshowCurrentActName = false;
        }


    },
    [GOTOMOVEBX](state, item) {
        state.ifDraft = true;
        axios.get(baseUrl() + '/expenseApply/getExpenseDataById?expenseUid=' + item.id + '&type=draft').then((res) => {
            state.lists = res.data.detData;
            state.bxTitle = res.data.mainData.expense_title_;
            state.bxSn = res.data.mainData.bxSn;
            state.index = res.data.mainData.totalDet;
            state.movebxMainId = res.data.mainData.id;
        }, (onRejected) => {});


    },
    [GOTOPOINTEDIT](state, item) { //跳转到考勤点编辑页面
        state.pointData = item;
        state.deletePointBtnVisable = true;
    },

};
// export default {
// 	mutations,
// 	getters
// }