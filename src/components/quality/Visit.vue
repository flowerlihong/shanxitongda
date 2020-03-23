<template>
  <div class="visit">
  	<div class="visitTop">
  		<div class="col-xs-2">
  			<i @click="visitClose" class="glyphicon glyphicon-remove"></i>
  		</div>
  		<h3 class="col-xs-10">高级搜索</h3>
  	</div>
  	<div class="visitCenter">
  		<!--<mt-field label="开始时间1" v-model="proName"></mt-field>-->
		<mt-cell  title="开始时间">
			<datetime v-model="startDate" title=""></datetime>
		</mt-cell>
		<mt-cell  title="结束时间">
			<datetime v-model="endDate" title=""></datetime>
		</mt-cell>
		<mt-datetime-picker v-model="pickerValue" ref="picker" type="date" @confirm="selectDate">
  		</mt-datetime-picker>
		<div class="box">
			<div :style="checkStyle">已选性质</div>
			<checker id="inLine" v-model="selected" type="checkbox" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
				<checker-item v-for="(item,i) in selectedTabs" :key="i" :value="i" disabled >{{item}}</checker-item>
			</checker>
			<br>
		</div>

		<div class="box">
			<div :style="checkStyle">常用性质</div>
			<checker id="inLine" @on-change="onItemClick" v-model="demo6" type="checkbox" default-item-class="demo4-item" selected-item-class="demo4-item-selected">
				<checker-item  v-for="(item,i) in tabDatas" :key="i" :value="i">{{item.name}}</checker-item>
			</checker>
		</div>
		<div class="box" style="border-bottom: 1px solid #ccc;">
			<div :style="checkStyle">整改状态</div>
			<checker id="inLine" @on-change="onItemClick" v-model="improveType" default-item-class="demo4-item" selected-item-class="demo4-item-selected">
				<checker-item value="4">已发整改</checker-item>
				<checker-item value="3">未发整改</checker-item>
			</checker>
		</div>		
		
  	</div>
  	<div class="visitBottom">
  		<el-button @click="reset" style="width:40%">重置</el-button>
		<el-button @click="submit()" type="primary" style="width:40%">确定</el-button>
  	</div>
  </div>
</template>

<script>
import {mapState,mapGetters, mapActions} from 'vuex'
import { Checker, CheckerItem, Group, Datetime, Popup } from 'vux'
export default {
  name: 'visit',
  data () {
    return {
		checkStyle: {padding: '5px 0px 10px',textAlign:'left',alignItems: 'left'},
      	selectedTabs: [],
    	selected:[],
		tabDatas: [
			{name:'季度检查',value:'季度检查'},
			{name:'月度检查',value:'月度检查'},
			{name:'分公司检查',value:'分公司检查'},
			{name:'节后复工检查',value:'节后复工检查'},
			{name:'专项检查',value:'专项检查'}
		],
		demo6:[],
		improveType:'',
    	startDate: new Date().format("yyyy-MM-dd"),
		endDate:new Date().format("yyyy-MM-dd"),
    	pickerValue: new Date().format("yyyy-MM-dd"),
    }
  },
  components: {
    Checker,CheckerItem,Group,Datetime,Popup
  },
  computed: {
    ...mapState({
        username: state => state.username,
        userUid: state => state.userUid,
       }),
    
  },
  props: ['visitPop'],
  methods: {
  	visitClose() {
  		this.visitPop.visit = false;
  	},
	change(){

	},
	selectStartDate(){
		this.$refs.picker.open();
	},
	selectDate(value){
		this.startDate = new Date(value).format("yyyy-MM-dd");
		 
	},
	onItemClick(value){
		this.selectedTabs=[];
		this.selected = [];
		for(var i=0;i<this.demo6.length;i++){
			this.selected.push(i);
			this.selectedTabs.push(this.tabDatas[this.demo6[i]].name);
		}
	},
  	reset() {
  		this.uuser = '';
  		this.branch = '';
  	},
	submit(){
		var _this = this;
		this.util.mask();
		var selectedTabsStr = this.selectedTabs.join(",");
		if(this.visitPop.billType=="safety"){
			this.util.post('/mobile/wx/safety/searCheckBills',{selectedTabsStr:selectedTabsStr,
				improveType:this.improveType,userUid:this.userUid},function(result){
				_this.util.unmask();
				_this.visitPop.checkBillDatas = result;
			});
		}else{
			this.util.post('/mobile/wx/quality/searCheckBills',{selectedTabsStr:selectedTabsStr,
				improveType:this.improveType,userUid:this.userUid},function(result){
				_this.util.unmask();
				_this.visitPop.checkBillDatas = result;
			});
		}
		
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.box {
  padding: 0 15px;
  border-top: 1px solid #ccc;
}
.demo4-item {
	width: 92px;
  height: 26px;
	text-align: center;
	border-radius: 3px;
	border: 1px solid #ccc;
  background-color: #fff;
  color: #222;
  margin-right: 6px;
  line-height: 26px;
  margin-bottom: 6px;
}
.demo4-item-selected {
  background-color: #D2B48C;
  color: #fff;
}

.demo5-item {
  width: 92px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
  margin-bottom: 6px;
}
.demo5-item-selected {
  background: #ffffff url(../../assets/demo/checker/active.png) no-repeat right bottom;
  border-color: #ff4a00;
}
.visit {
	.visitTop {
		height: 1.3rem;
		line-height: 1.5rem;
		// text-align: center;
		// position: relative;
		display: flex;
		justify-content: center;
    	align-items: center;
		i {
			z-index: 50;
		}
		h2 {
			margin: 0;
			padding: 0;
			// position: absolute;
		 //    top: 50%;
		 //    left: 50%;
		 //    -webkit-transform: translate(-50%, -50%);
		    // justify-content: center;
    		// align-items: center;
    		z-index: 5;
		}
	}
	.visitCenter {
		text-align: left;
	}
	.visitBottom {
		padding:15px;
	}
}
#inLine{
	display: inline-block !important;
	width:296px !important;
}

</style>
