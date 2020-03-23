<template>
  <div style="padding: 5px 0;">

    <div class="box">
      <div :style="checkStyle">已选检查性质：</div>
      <checker v-model="selected" type="checkbox" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
				<checker-item v-for="(item,i) in selectedTabs" :key="i" :value="i" disabled >{{item}}</checker-item>
			</checker>
      <br>
    </div>

    <divider>
			<span >常用检查性质</span>
		</divider>
    <checker @on-change="onItemClick" v-model="demo6" type="checkbox" default-item-class="demo4-item" selected-item-class="demo4-item-selected">
      <checker-item v-for="(item,i) in tabDatas" :key="i" :value="i">{{item.name}}</checker-item>
    </checker>

		<nav class="navbar foot navbar-default navbar-fixed-bottom">
      	<p>
          <x-button @click.native="close()" mini style="width:48%;height: 45px;border: 1px solid #ccc;" type="default">取消</x-button>
			    <x-button @click.native="saveProTags()" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
			  </p>
      </nav>
  </div>
</template>



<script>
import { Checker, CheckerItem, Divider,XButton } from 'vux'

export default {
  data() {
    return {
			checkStyle: {padding: '5px 10px 10px',textAlign:'left',display: 'flex',justifyContent: 'left',alignItems: 'left'},
      selectedTabs: [],
      tabDatas: [
        {name:'季度检查',value:'季度检查'},
        {name:'月度检查',value:'月度检查'},
        {name:'分公司检查',value:'分公司检查'},
        {name:'节后复工检查',value:'节后复工检查'},
        {name:'专项检查',value:'专项检查'}
      ],
      demo6:[],
      selected:[]
      
    }
  },
  components: {
    Checker,
    CheckerItem,
    Divider,XButton
  },
  props: ['tags'],
  created(){
        // this.$http.get(this.url+"/wx/project/getDicItemByDicName?dicName=工程标签").then((res)=>{
        //   this.tabDatas = res.data;
        // },(onReject)=>{});
  },
  methods: {
    onItemClick (value) {
      this.selectedTabs=[];
      this.selected = [];
      for(var i=0;i<this.demo6.length;i++){
          this.selected.push(i);
          this.selectedTabs.push(this.tabDatas[this.demo6[i]].name);
      }
      
     
    },
    close(){
      this.tags.tagsVisible=false;
    },
    saveProTags(){
        var tags = this.selectedTabs.join(",");
        this.tags.tagsVisible=false;
		    this.$emit('chooseTags',{proTags: tags});
    }
  }
  
}
</script>

<style scoped>
.box {
  padding: 0 15px;
}

.demo4-item {
	width: 100px;
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
  width: 100px;
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
</style>
