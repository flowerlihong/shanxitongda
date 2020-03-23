<template>
  <div>
    <div @click="goto('workflow/apply',{})" style="overflow: hidden;" class="ibox">
  
      <div class="ibox-title" style="border-color: #FC8675;border-bottom: 1px solid #F3CE85;">
        <span class="glyphicon glyphicon-leaf"></span>
        <p class="ibox-title-icon">我的申请</p>
      </div>
      <div class="ibox-content " style="width:100%;">
        <div class="col-md-4 box-item-fl" style="width:33.33333%;">
          <div class="box1-item" style="background-color: #F3CE85; ">
            <span>{{statisticsCountData.myApplyAllCount}}</span>
          </div>
          <div>
          <span class="box-item-over">全部</span>
          </div>
        </div>
        <div class="col-md-4 box-item-fl" style="width:33.33333%;">
          <div class="box1-item" style="background-color: #1AB394;">
            <span>{{statisticsCountData.myApplyUnFinshedCount}}</span>
          </div>
          <span class="box-item-over">进行中</span>
        </div>
        <div class="col-md-4 box-item-fl" style="width:32.33333%;">
          <div class="box1-item" style="background-color: #FC8675;">
            <span>{{statisticsCountData.myApplyFinshedCount}}</span>
          </div>
          <span class="box-item-over">已完成</span>
        </div>
      </div>
    </div>
    <div @click="goto('workflow/approval',{})" style="overflow: hidden;" class="ibox">
      
      <div class="ibox-title" style="border-color: #1AB394;border-bottom: 1px solid #1AB394;">
        <span class="glyphicon glyphicon-send"></span>
        <p class="ibox-title-icon">我的待办</p>
      </div>
      <div class="ibox-content " style="width:100%;">
        <div class="col-md-4 box-item-fl" style="width:33.33333%;">
          <div class="box1-item" style="background-color: #F3CE85;">
            <span>{{statisticsCountData.myApprovalAllCount}}</span>
          </div>
          <div>
          <span class="box-item-over">全部</span>
          </div>
        </div>
        <div class="col-md-4 box-item-fl" style="width:33.33333%;">
          <div class="box1-item" style="background-color: #1AB394;">
            <span>{{statisticsCountData.myApprovalUnFinshedCount}}</span>
          </div>
          <span class="box-item-over">进行中</span>
        </div>
        <div class="col-md-4 box-item-fl" style="width:32.33333%;">
          <div class="box1-item" style="background-color: #FC8675;">
            <span>{{statisticsCountData.myApprovalFinshedCount}}</span>
          </div>
          <span class="box-item-over">已完成</span>
        </div>
      </div>
    </div>
    <div @click="goto('workflow/copy',{})" style="overflow: hidden;" class="ibox">
  
      <div class="ibox-title" style="border-color: #A392E6;border-bottom: 1px solid #A392E6;">
        <span class="glyphicon glyphicon-list-alt"></span>
        <p class="ibox-title-icon">抄送给我</p>
      </div>
      <div class="ibox-content " style="width:100%;">
        <div class="col-md-4 box-item-fl" style="width:33.33333%;">
          <div class="box1-item" style="background-color: #F3CE85;">
            <span>{{statisticsCountData.myCopyAllCount}}</span>
          </div>
          <div>
          <span class="box-item-over">全部</span>
          </div>
        </div>
        <div class="col-md-4 box-item-fl" style="width:33.33333%;">
          <div class="box1-item" style="background-color: #1AB394;">
            <span>{{statisticsCountData.myCopyUnFinshedCount}}</span>
          </div>
          <span class="box-item-over">已完成</span>
        </div>
        <div class="col-md-4 box-item-fl" style="width:32.33333%;">
          <div class="box1-item" style="background-color: #FC8675;">
            <span>{{statisticsCountData.myCopyFinshedCount}}</span>
          </div>
          <span class="box-item-over">已完成</span>
        </div>
      </div>
    </div>
  
    <x-icon @click="addApply()" type="ios-plus-outline" size="60"></x-icon>
  </div>
</template>

<script>
import { Masker } from 'vux'
import { mapState } from 'vuex'
export default {
  components: {
    Masker
  },
  data() {
    return {
      itemBackground: {},
      statisticsCountData:{
        myApplyAllCount:0,
        myApplyUnFinshedCount:0,
        myApplyFinshedCount:0,
        myApprovalAllCount:0,
        myApprovalUnFinshedCount:0,
        myApprovalFinshedCount:0,
        myCopyAllCount:0,
        myCopyUnFinshedCount:0,
        myCopyFinshedCount:0
      }

    }
  },
  computed: {
    ...mapState({
      userLogo: state => state.userLogo,
      userUid: state => state.userUid
    })

  },
  activated(){
	  var _this = this;
      //this.util.mask("正在加载...");
      
      this.util.post('/mobile/wx/workOrder/getStatisticsCount',{userUid:this.userUid},function(result){
         // _this.statisticsCountData = result;
         // _this.util.unmask();
      });
		
  },
  created() {
    //background-image:url()
    this.itemBackground = { backgroundImage: "url(" + this.userLogo + ")" };
    //js-sdk
    var wxurl = window.location.href.split("#")[0];
    var _this = this;
 


    


  },
  methods: {
    addApply() {
      this.$router.push({ name: 'workflow/applyIndex' });
    }
  }
}
</script>

<style lang="less">
.html .body {
  background-color: #f3f3f4;
}

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
  padding: 10px 15px 7px;
  min-height: 48px;
  height:50px;
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

.m-img {
  padding-bottom: 33%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}

.m-title {
  color: #fff;
  text-align: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, .5);
  font-weight: 500;
  font-size: 16px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}

.m-title>.glyphicon-zoom-in {
  left: 0px;
  top: 0px;
}

.m-time {
  font-size: 12px;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
  display: inline-block;
  margin-top: 5px;
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
