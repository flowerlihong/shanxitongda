<template>
  	<div class="choose choose1">
	  <!-- <div class="head">
		<el-input placeholder="搜索" icon="search" v-model="searchValue" ></el-input>
	  </div> -->
      <div class="middle-1">
          <radio :options="pointNameDatas" @on-change="change"></radio>
      </div>
      <nav class="navbar foot navbar-default navbar-fixed-bottom" style="bottom: 10px;">
      	<p>
            <x-button @click.native="goback()" mini style="width:48%;height: 45px;border:1px solid #ccc;" type="default">取消</x-button>
			<x-button @click.native="choosed(pointDatas,radio,$event)" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
		</p>
      </nav>
  </div>
    
</template>

<script>
import { XButton,Radio } from 'vux'
export default {
  name: 'setRemind',
  data () {
    return {
        searchValue:'',
        radio: '',
        pointDatas:[],
        pointNameDatas:[],
        allLoaded:false,  //是否已全部加载完毕
        noMore: false
        
    }
  },
  props: ['mess'],
  components:{
      XButton,Radio
  },
  created(){
        var param = {
            pageSize: 1000,
            operateType:'getPoints',
            pageIndex : 1
        };
        var _this=this;
        this.util.mask();
        this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",param,function(res){
            _this.util.unmask();
            if(res.status==200){
                for(var i in res.data){
                    var item={key:i,value:res.data[i].name};
                    _this.pointNameDatas.push(item);
                }
                _this.pointDatas = res.data;
            }
            
        });
  },
  methods: {
  	change(value, label) {
          this.radio=value;
    },
    goback() {
            this.mess.popupVisible = false;
    },
    choosed(pointDatas,radio,$event) {
          var chooseId = pointDatas[radio].id;
          var pointName = pointDatas[radio].name;
          this.mess.popupVisible = false;
		  this.$emit('choosePoint',{pointId:chooseId,pointName:pointName});
          
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .address{
        font-size: 8;
        color: #666666;
    }
</style>
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
