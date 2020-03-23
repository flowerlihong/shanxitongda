<template>
  <div class="headStyle">
	   <div class="approvalMiddle" style="text-align:left;">
		   <div class="price">
			    <span class="col-xs-3">项目</span>
				<span class="col-xs-9 spanStyle">{{checkBill.project!=undefined&&checkBill.project.length>23? checkBill.project.substring(0,23)+'...':checkBill.project}}</span>
			</div>
			<div class="price">
				<span class="col-xs-3">性质</span>
				<span class="col-xs-9 spanStyle">{{checkBill.checkNature!=undefined&&checkBill.checkNature.length>23? checkBill.checkNature.substring(0,23)+'...':checkBill.checkNature}}</span>
			</div>
			<div class="price">
				<span class="col-xs-3">日期</span>
				<span class="col-xs-9 spanStyle">{{checkBill.checkDate}}</span>
			</div>
			<div class="price">
				<span class="col-xs-3">检查人</span>
				<span class="col-xs-9 spanStyle">{{checkBill.checker}}</span>
			</div>

			<div class="approvalPop">
	  		  <span class="col-xs-4">检查项：</span>
	  	  </div>
			<div id="price" style="text-align:left;">
				<x-textarea :readonly="true" :max="100" style="width: 100%;" v-model="checkBill.checkItem" placeholder="请输入检查项" ref="content"></x-textarea>
			</div>
			
	   </div>
	    <template>

	  	<div class="middle" :style="left">
	  	  <div class="approvalPop">
	  		  <span class="col-xs-4">检查结果：</span>
	  	  </div>
		  <div v-for="item in checkBillDet">
			<div class="piaojv">
				<span>{{item.content}}</span>
			</div>
			<div v-if="item.imgs!='undefined'&&item.imgs.length>0" class="piaojv">
				<span>附件</span>
				<p>
					<img v-for="img in item.imgs" @click="previewImage(img.id,item.imgs)" style="width:50px;height:50px;margin:0 5px;" :src="webUrl+'/attachmentAction!look.action?id='+img.id+'&access_token='+access_token" alt="">
				</p>
			</div> 
			<div style="margin-top: 5px;padding: 13px 0 13px 10px;border-top:1px solid #eee">
				<checker v-model="item.checkStatus" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
					<checker-item disabled v-for="(item,i) in tabDatas" :key="i" :value="item.value">{{item.name}}</checker-item>
				</checker>
			</div>
		 </div>	
		 <div class="price">
			<span class="col-xs-3">通知人:</span>
			<span class="col-xs-9 spanStyle">{{checkBill.notifier}}</span>
		</div> 
		<div class="price">
			<span class="col-xs-3">记录人:</span>
			<span class="col-xs-9 spanStyle">{{checkBill.createUser}}</span>
		</div> 
		
	 </div>
  </template>
  	<div  class="footer">
		<p>
			<x-button v-if="checkBill.createUserId==userId" @click.native="editData()" mini style="width:48%;height: 40px;background: #3399cc;" type="primary">编辑</x-button>
			<x-button v-if="checkBill.checkStatus==3" @click.native="saveImprove()" mini style="width:48%;height: 40px;" type="primary">生成整改单</x-button>
		</p>
	</div>
  </div>
</template>

<script>
import {mapState,mapGetters, mapActions} from 'vuex'
import { Checker, CheckerItem,XButton,XTextarea} from 'vux'

export default {
  name: 'approval',
  components:{
      // 名字
      Checker, CheckerItem,XButton,XTextarea
  },
  data () {
    return {
		tabDatas:[{name:'通过',value:'0'},{name:'口头警告',value:'1'},{name:'书面整改',value:'2'}],
    	left: {textAlign:'left'},
		bootBtn: {padding:'5px 10px',marginTop:'10px',height:'1.5rem'},
		checkBillDet: [],   //检查结果明细
    	webUrl:'',
		access_token:'',
		checkBill:{}
    }
  },
   created(){
 	 	this.webUrl = this.util.getBaseUrl();
		this.access_token = this.util.getAccessToken();
   },
   activated(){
		this.id = this.util.getUrlParam("id");
		this.loadData();
		
  },
  computed: {
  	...mapState({
		   	userId: state => state.userId
			
  		})
  },
  methods: {
	    loadData(){
			if(this.util.isNotEmpty(this.id)){
				this.util.mask();
				var _this=this;
				var param = {
						operateType:'getSafetyBillDataByid',
						id:this.id
				};
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
					_this.util.unmask();
					if (res.status == 200) {
						_this.checkBill=res.data;
						_this.checkBillDet = res.data.subFormData;
					}
					
				});
			}  
			
		},
  		previewImage(curId,curData){
			var imgId = this.webUrl+'/attachmentAction!look.action?id='+curId+'&access_token='+this.access_token;
			var imgIds=[];
			for(var i=0;i<curData.length;i++){
				imgIds.push(this.webUrl+'/attachmentAction!look.action?id='+curData[i].id+'&access_token='+this.access_token);
			}
			this.wx.previewImage({
				current: imgId, // 当前显示图片的http链接
				urls: imgIds // 需要预览的图片http链接列表
			});
		},
		saveImprove(){
			// var improveItem = [];
			// for (let i=0,len=this.checkBillDet.length; i<len; i++) {
			// 	if(this.checkBillDet[i].checkStatus==2){
			// 		improveItem.push(this.checkBillDet[i]);
			// 	}
			// }
			//console.debug(improveItem);
			this.$router.push({name:'addSafetyImproveBill',query:{checkId:this.checkBill.id}});

		},
		editData(type){
			this.$router.push({name:'addSafetyCheck',query:{id:this.id}});
		}
		
		
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.demo5-item {
  width: 94px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
}
.demo5-item-selected {
  background: #ffffff url(../../assets/demo/checker/active.png) no-repeat right bottom;
  border-color: #ff4a00;
}
.price{
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
}
.price>span{
	padding: 0 10px;
}
.spanStyle{
	text-align:right;
}
.piaojv {
	border-top: 1px solid #eee;
	padding: 10px 0 0 0;
	height: 100%;
	span {
		padding: 5px 10px;
	}
	p {
		margin: 5px 10px;
		height: auto;
	}
}

.approvalPop {
	height: 49px;
	line-height: 48px;
	border-top: 1px solid #eee;
	background: #eee;
	span {
		padding: 0 10px;
	}
	div {
		text-align: right;
	}
}
.footer {
	height: 1.8rem;
	padding-top: 10px;
	background: #eee;
	line-height: 42px;
}
</style>
