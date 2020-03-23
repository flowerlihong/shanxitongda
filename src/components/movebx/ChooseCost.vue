<template>
  <div class="choose choose1">
	  
		<search  v-model="valueList1" placeholder="搜索" :autoFixed="false"  @on-submit="handleIconClick" ref="search"></search>
			 <div :style="checkStyle1" v-if="checkSee1">已选择:&nbsp;&nbsp;&nbsp;{{msg1}}</div>
      <div class="middle-1">
				<radio :options="costDatas" @on-change="checkItem"></radio>	
			<transition-group name="staggered-fade" tag="ul" :css="false">
				<li style="padding:10px;border-bottom:1px solid #eee;" @click="checkItem1($event,index,item)" v-for="(item,index) in costDatas" :key="item.msgs" :data-index="index+1">
				<el-radio  v-model="radio" :label="index+1">{{item.msgs}}</el-radio>
				</li>
	  	</transition-group>
      </div>
      <nav class="navbar foot navbar-default navbar-fixed-bottom" style="padding-bottom: 10px;">
      	<p>
      	<!-- <el-button @click="goback2" style="width:49%;margin:0;" type="default">取消</el-button>
				<el-button @click="goback1(costDatas,radio,$event)" style="width:49%;margin:0;" type="success">确定</el-button> -->
				<x-button @click.native="goback2()" mini style="width:48%;height: 45px;background:#cccccc" type="default">取消</x-button>
		  		<x-button @click.native="goback1(costList,radio,$event)" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
		</p>
      </nav>
  </div>
</template>

<script>
import { Search,XButton,Radio } from 'vux'
import {mapState,mapGetters, mapActions} from 'vuex'
export default {
  name: 'choose',
  data () {
    return {
    	value: '',
    	radio: null,
    	allLoaded1: false,
			checkSee1: false,
      msg1: '',
			checkStyle1: {padding: '15px 10px',textAlign:'left',borderBottom:'1px solid #eee',display: 'flex',justifyContent: 'left',alignItems: 'left'},
			costDatas:[],
			costList:[]
    }
	},
	components:{
      Search,XButton,Radio
  },
   computed: {
		 ...mapState({
      kmList: state => state.kmList,
			valueList1: state => state.valueList1,
    }),
		...mapGetters([
			'computedkmList'
		]),
		valueList1: {
        get () {
          return this.$store.state.valueList1
        },
        set (value) {
          this.$store.commit('updateValueList1', value)
        }
    }
  },
	props: ['msg'],
	created(){
			var _this=this;
			var param = {
					operateType:'getCostList',
					userUid:this.userUid
			};
			this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_MoveBx&appId=WeChat",param,function(res){
				_this.util.unmask();
				if (res.status == 200) {
					_this.costList=res.data;
					for(var i=0;i<res.data.length;i++){
						var item = {key: i,value: res.data[i].cbmc};
						_this.costDatas.push(item);
					}
				}
				
			});
			
	},
  methods:{
  	checkItem(index,item){
				this.radio = index;
        this.checkSee1 = true;
        this.msg1 = item;
    },
  	goback1(costList,radio,$event) {
  		if (radio==null) {
  			this.util.failueToast('你没有选择科目');
	  		return;
  		}
  		this.msg.popupVisible1 = false;
  		this.$emit('chooseMsg',{cbmc:costList[radio].cbmc,cblx:costList[radio].cblx,code:costList[radio].code});
  	},
  	goback2 () {
  		this.msg.popupVisible1 = false;
  	},
  	handleIconClick(val) {

  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.choose.choose1 p{
	margin:0;
}
.choose.choose1 .middle-1 label{
	margin:0;
	border-bottom:1px solid #eee;
}
.choose.choose1 .middle-1 .weui-cell:before{
	border-top:0 none;
}
</style>