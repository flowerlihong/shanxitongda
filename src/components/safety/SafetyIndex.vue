<template>
  <div>
    <div @click="goto('safetyCheckBillList')" style="overflow: hidden;" class="ibox">
      <div class="ibox-title" style="border-color: #FC8675;border-bottom: 1px solid #F3CE85;">
        <span class="glyphicon glyphicon-leaf"></span>
        <p class="ibox-title-icon">安全检查({{checkCount==undefined? 0:checkCount}})</p>
      </div>
    </div>
	<div @click="goto('safetyImproveBillList')" style="overflow: hidden;" class="ibox">
      <div class="ibox-title" style="border-color: #666699;border-bottom: 1px solid #666699;">
        <span class="glyphicon glyphicon-list-alt"></span>
        <p class="ibox-title-icon">安全整改({{improveCount==undefined? 0:improveCount}})</p>
      </div>
    </div>
    
	<x-icon @click="addQualityInspect()" type="ios-plus-outline" size="60"></x-icon>
  </div>
</template>

<script>
import { Masker } from 'vux'
import { mapState } from 'vuex'
export default {
  components: {
    Masker
  },
  data () {
    return {
      checkCount:0,
      improveCount:0
    }
  },
  computed: {
    ...mapState({
      userLogo: state => state.userLogo,
      userUid: state => state.userUid
    })

  },
  created(){
       //js-sdk
      this.util.initWxJsSdk(this);

  },
  activated(){
    this.loadData();
		
  },
  methods: {
	  addQualityInspect(){
      this.$router.push({name:'addSafetyCheck'});
      
    },
    loadData(){
      this.util.mask();
        var _this=this;
        // console.debug("userUid==="+this.userUid);
				var param = {
						operateType:'getSafetyStatisticsCount',
						userUid:this.userUid
        };
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Inspect&appId=WeChat",param,function(res){
          
					_this.util.unmask();
					if (res.status == 200) {
						_this.checkCount = res.data['checkCount'];
              _this.improveCount = res.data['improveCount'];
					}
					
				});
    }
  }
}
</script>


<style scoped>
.ibox {
  position: relative;
}

.ibox {
  clear: both;
  margin: 10px;
  margin-bottom: 20px;
  
  padding: 0;
  // box-shadow: 0 10px 20px #d3d9e0;
  box-shadow: 0 8px 17px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
      border-radius: 9px;
}

.ibox-title {
  // -moz-border-bottom-colors: none;
  -moz-border-left-colors: none;
  -moz-border-right-colors: none;
  -moz-border-top-colors: none;
  background-color: #fff;
  border-color: #597d95;
  -webkit-border-image: none;
  -o-border-image: none;
  border-image: none;
  border-style: solid solid none;
  border-width: 6px 0 0;
  color: inherit;
  margin-bottom: 0;
  padding: 25px 15px 7px;
  min-height: 48px;
  height: 80px;
}


.ibox-content {
  background-color: #fff;
  color: inherit;
  padding-bottom: 2.5rem; //padding: 15px 20px 20px;
  border-color: #e7eaec;
  -webkit-border-image: none;
  -o-border-image: none;
  border-image: none;
  // border-style: solid solid none;
  border-width: 1px 0;
}

.ibox-content {
  clear: both;
}

.box-item-fl {
  float: left;
  margin-top: 12px;
}

.box-item-over {
  font-size: 13px
}

.box1-item {
      width: 50px;
    height: 50px;
    border-radius: 50px;
    display: block;
    text-align: center;
    line-height: 50px;
    color: white;
    margin: 0 auto;
}
.vux-x-icon {
  fill: #0078D7;
}

.ibox-title-icon{
  display: inline-block;
}
.vux-x-icon {
  fill: #fff;
  background: #4E9CDA;
  border-radius: 50%;
  box-shadow:0 2px 9px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
