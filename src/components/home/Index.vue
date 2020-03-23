<template>
  
</template>

<script>
//var wx = require('weixin-js-sdk');
var managerConfigData;
var groupId;
import {mapState,mapGetters, mapActions} from 'vuex'

import { getArgFromHref } from '@/utils/utils.js';
export default {
    name: 'index',
    data () {
	    return {
			
	    }
    },
	computed: {
		...mapState({
		   	
		   	session: state => state.session
		   }) 
		   
    },
    created(){
		this.util.init(this);
		var state =getArgFromHref("state");
		var code =getArgFromHref("code");
		
		if(state=="workflowDesktop"){
			this.$router.push({name:'workflow/desktop'});
			return;
		}else if(state=="processForm"){
			this.$router.push({name:'processForm'});
			return;
		}if(state=="movebx"){
			this.$router.push({name:'movebx'});
			return;
		}else if(state=="index"){
			this.$router.push({name:'app/index'});
			return;
		}else if(state=="checkBillShow"){
			var billId = this.util.getUrlParam("id");
			this.$router.push({name:'checkBillShow',query:{id:billId}});
			return;
		}else if(state=="safetyCheckBillShow"){
			var billId =getArgFromHref("id");
			this.$router.push({name:'safetyCheckBillShow',query:{id:billId}});
			return;
		}else if(state=="safetyImproveBillShow"){   //安全整改消息通知
			var billId =this.util.getUrlParam("id");
			this.$router.push({name:'safetyImproveBillShow',query:{id:billId}});
			return;
		}else if(state=="checkOutShow"){
			var createUser = this.util.getUrlParam("createUser");
			var checkDate = this.util.getUrlParam("checkDate");
			this.$router.push({name:'checkOutShow',query:{createUser:createUser,checkDate:checkDate}});
			return;
		}else if(state=="approving"){
			this.$router.push({name:'workflow/approval',query:{type:'unFinished',formKey:'expense'}});
			return;
		}else if(state=="approved"){
			this.$router.push({name:'workflow/approval',query:{type:'finished',formKey:'expense'}});
			return;
		}else if(state=="sign"){
			this.$router.push({name:'sign'});
			return;
		}else if(state=="addProject"){
			this.$router.push({name:'addProject'});
			return;
		}else if(state=="projectList"){
			this.$router.push({name:'projectList'});
			return;
		}else if(state=="projectIndex"){
			this.$router.push({name:'project/list'});
			return;
		}else if(state=="improveBillList"){  //质量管理
			this.$router.push({name:'improveBillList'});
			return;
		}else if(state=="addQAuality"){  //质量管理
			this.$router.push({name:'addQualityInspect'});
			return;
		}else if(state=="checkBillList"){  //质量管理
			this.$router.push({name:'checkBillList'});
			return;
		}else if(state=="registerStep1"){
			this.$router.push({name:'registerStep1'});
			return;
		}else if(state=="safetyIndex"){  //安全检查
			this.$router.push({name:'safetyIndex'});
			return;
		}else if(state=="qualityIndex"){  //质量检查
			this.$router.push({name:'qualityIndex'});
			return;
		}else if(state=="addSafetyCheck"){  //添加安全检查
			this.$router.push({name:'addSafetyCheck'});
			return;
		}else if(state=="safetyCheckBillList"){  //
			this.$router.push({name:'safetyCheckBillList'});
			return;
		}else if(state=="safetyImproveBillList"){  
			this.$router.push({name:'safetyImproveBillList'});
			return;
		}else if(state=="sysSeting"){
			this.$router.push({name:'sys/manager'});
			return;
		}else if(state=="addLeave"){
			this.$router.push({name:'addLeave'});
			return;
		}else if(state=="leaveIndex"){
			this.$router.push({name:'workflow/apply',query:{formKey:'leave'}});
			return;
		}else if(state=="workIndex"){
			this.$router.push({name:'workIndex'});
			return;
		}else if(state=="inStorageBill"){
			this.$router.push({name:'inStorageBill'});
			return;
		}else if(state=="scheduleEdit"){
			this.$router.push({name:'scheduleEdit'});
			return;
		}else if(state=="projWorkLog"){
			this.$router.push({name:'proj/workLog/index'});
			return;
		}else if(state=="addWorkLog"){
			this.$router.push({name:'proj/workLog/info'});
			return;
		}else if(state=="contacts"){
			this.$router.push({name:'sys/contacts'});
			return;
		}else if(state=="addWorkReport"){   //添加工作汇报
			this.$router.push({name:'workReport/add'});
			return;
		}else if(state=="myWorkReport"){
			this.$router.push({name:'workReport/myReport',query:{dataType:'myCreate'}});
			return;
		}else if(state=="myAttentionWorkReport"){
			this.$router.push({name:'workReport/myReport',query:{dataType:'myAttention'}});
			return;
		}else if(state=="record"){
			this.$router.push({name:'record/index'});
			return;
		}else if(state=="analyze"){
			this.$router.push({name:'sys/analyze'});
			return;
		}else if(state=="contractIndex"){
			this.$router.push({name:'contract/index'});
			return;
		}else if(state=="applyIndex"){
			this.$router.push({name:'workflow/applyIndex'});
			return;
		}else if(state=="addNews"){
			this.$router.push({name:'news/add'});
			return;
		}else if(state=="newsList"){
			this.$router.push({name:'news/list'});
			return;
		}else if(state=="addVisa"){
			this.$router.push({name:'workVisa/add'});
			return;
		}else if(state=="workVisaList"){
			this.$router.push({name:'workVisa/list'});
			return;
		}else if(state=="workflowDesktop"){
			this.$router.push({name:'workflow/desktop'});
			return;
		}else if(state=="improveBillShow"){    //质量整改消息通知
			var billId = this.util.getUrlParam("id");
			this.$router.push({name:'improveBillShow',query:{id:billId}});
			return;
		}else if(state=="workOrderShow"){
			var orderId = this.util.getUrlParam("orderId");
			this.$router.push({name:'workOrderShow',query:{orderId:orderId}});
			return;
		}else if(state=="carApplyShow"){    //车辆申请消息通知
			var carApplyId = this.util.getUrlParam("id");
			var dataType = this.util.getUrlParam("dataType");
			this.$router.push({name:'car/show',query:{id:carApplyId,dataType:dataType}});
			return;
		}else if(state=="workReportShow"){    //工作汇报消息通知
			var reportId = this.util.getUrlParam("id");
			this.$router.push({name:'workReport/show',query:{id:reportId}});
			return;
		}else if(state=="carList"){
			this.$router.push({name:'car/list'});
			return;
		}else if(state=="carApply"){
			this.$router.push({name:'car/apply'});
			return;
		}else if(state=="applyList"){
			this.$router.push({name:'car/applyList'});
			return;
		}else if(state=="newsShow"){
			var newsId = this.util.getUrlParam("id");
			this.$router.push({name:'news/show',query:{id:newsId}});
			return;
		}else if(state=="applyGoods"){
			this.$router.push({name:'apply/applyGoods'});
			return;
		}else if(state=="applyPurchase"){
			this.$router.push({name:'apply/applyPurchase'});
			return;
		}else if(state=="applyBorrowing"){
			this.$router.push({name:'apply/applyBorrowing'});
			return;
		}else if(state=="applyPayment"){
			this.$router.push({name:'apply/applyPayment'});
			return;
		}else if(state=="applyWorkover"){
			this.$router.push({name:'apply/applyWorkover'});
			return;
		}else if(state=="applyRegularWork"){
			this.$router.push({name:'apply/applyRegularWork'});
			return;
		}else if(state=="applyCommon"){
			this.$router.push({name:'apply/applyCommon'});
			return;
		}else if(state=="invoiceList"){
			this.$router.push({name:'contract/invoiceList'});
			return;
		}else if(state=="certificateIndex"){
			this.$router.push({name:'certificate/index'});
			return;
		}else if(state=="test"){
			this.$router.push({name:'property/test'});
			return;
		}else if(state=="propertyIndex"){
			this.$router.push({name:'property/index'});
			return;
		}else if(state=="pollingShow"){
			var pollingId = this.util.getUrlParam("id");
			this.$router.push({name:'polling/show',query:{id:pollingId}});
			return;
		}else if(state=="pollingIndex"){
			this.$router.push({name:'polling/list'});
			return;
		}else if(state=="firmSeting"){
			this.$router.push({name:'sys/seting'});
			return;
		}

		
		
	
		
  },
    methods: {
	   	
	 
   }
}
</script>


