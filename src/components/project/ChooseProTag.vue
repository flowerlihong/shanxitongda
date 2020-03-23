<template>
  <div style="padding: 5px 0;">

    <div class="box">
      <div :style="checkStyle">已选标签</div>
      <checker v-model="selected" type="checkbox" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
				<checker-item v-for="(item,i) in selectedTabs" :key="i" :value="i">{{item}}</checker-item>
			</checker>
      <br>
    </div>

    <div v-for="(item,i) in tabDatas">
        <divider>
         <checker @on-change="onItemClick" v-model="demo6" type="checkbox" default-item-class="demo4-item" selected-item-class="demo4-item-selected">
            <checker-item style="width:232px" :value="item.name">{{item.name}}</checker-item>
          </checker>
        </divider>
        <checker @on-change="onItemClick" v-model="demo6" type="checkbox" default-item-class="demo4-item" selected-item-class="demo4-item-selected">
          <checker-item v-for="(child,j) in item.children" :key="j" :value="child.name">{{child.name}}</checker-item>
        </checker>
    </div>
    

		<nav class="navbar foot navbar-default navbar-fixed-bottom" style="padding-bottom: 10px;">
        <x-button @click.native="close()" mini style="width:48%;height: 45px;border: 1px solid #ccc;" type="default">取消</x-button>
        <x-button @click.native="saveProTags()" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
      	
      </nav>
  </div>
</template>



<script>
import { Checker, CheckerItem, Divider, XButton } from 'vux'

export default {
  data() {
    return {
			checkStyle: {padding: '5px 10px 10px',textAlign:'left',display: 'flex',justifyContent: 'left',alignItems: 'left'},
      selectedTabs: [],
      tabDatas: [],
      demo6:[],
      selected:[]
      
    }
  },
  components: {
    Checker,CheckerItem,Divider,XButton
  },
  props: ['tags'],
  created(){
        var _this=this;
        this.util.loadDic({dicName:'工程标签',type:1},function(data){
          
          _this.tabDatas = data;
          // for(var i=0;i<data.length;i++){
          //   var item = {label: data[i].name,type: 'primary', value: data[i].value};
          //   _this.xmStatusMenus.push(item);
          // }
          
        });
  },
  methods: {
    onItemClick (value) {
      this.selectedTabs=[];
      this.selected = [];
      for(var i=0;i<this.demo6.length;i++){
          this.selected.push(i);
          this.selectedTabs.push(this.demo6[i]);
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
  
}
.demo4-item-selected {
  background-color: #13CE66;
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
  margin-bottom: 8px;
}
.demo5-item-selected {
  background: #ffffff url(../../assets/demo/checker/active.png) no-repeat right bottom;
  border-color: #ff4a00;
}
</style>
