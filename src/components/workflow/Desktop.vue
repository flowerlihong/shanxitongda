<template>
  <div>
    <!-- <div @click="goto('workflow/apply',{})" style="overflow: hidden;" class="ibox">
  
      <div class="ibox-title" style="border-color: #FC8675;border-bottom: 1px solid #F3CE85;">
        <span class="glyphicon glyphicon-leaf"></span>
        <p class="ibox-title-icon">我的申请({{statisticsCountData.myApplyAllCount}})</p>
      </div>
      
    </div> -->
    <div @click="util.gotoByPath('/workflow/approval',{type:'unFinished'})" style="overflow: hidden;" class="ibox">
      
      <div class="ibox-title" style="border-color: #1AB394;border-bottom: 1px solid #1AB394;">
        <span class="glyphicon glyphicon-send"></span>
        <p class="ibox-title-icon">我的待办({{statisticsCountData.myApprovalUnFinishedCount}})</p>
      </div>
     
    </div>
    <div @click="util.gotoByPath('/workflow/copy',{type:'unFinished'})" style="overflow: hidden;" class="ibox">
  
      <div class="ibox-title" style="border-color: #A392E6;border-bottom: 1px solid #A392E6;">
        <span class="glyphicon glyphicon-list-alt"></span>
        <p class="ibox-title-icon">我的待阅({{statisticsCountData.myCopyUnFinishedCount}})</p>
      </div>
     
    </div>
    <div @click="util.gotoByPath('/workflow/approval',{type:'finished'})" style="overflow: hidden;" class="ibox">
  
      <div class="ibox-title" style="border-color:rgb(56, 167, 220);border-bottom: 1px solid rgb(56, 167, 220);">
        <span class="glyphicon glyphicon-list-alt"></span>
        <p class="ibox-title-icon">我的已办({{statisticsCountData.myApprovalFinishedCount}})</p>
      </div>
    
    </div>
    <div @click="util.gotoByPath('/workflow/copy',{type:'finished'})" style="overflow: hidden;" class="ibox">
  
      <div class="ibox-title" style="border-color: rgb(167, 88, 199);border-bottom: 1px solid rgb(167, 88, 199);">
        <span class="glyphicon glyphicon-list-alt"></span>
        <p class="ibox-title-icon">我的已阅({{statisticsCountData.myCopyFinishedCount}})</p>
      </div>
     
    </div>
    <div @click="util.gotoByPath('/workflow/apply',{})" style="overflow: hidden;" class="ibox">
  
      <div class="ibox-title" style="border-color: #FC8675;border-bottom: 1px solid #F3CE85;">
        <span class="glyphicon glyphicon-leaf"></span>
        <p class="ibox-title-icon">我的申请({{statisticsCountData.myApplyAllCount}})</p>
      </div>
      
    </div>
    <div style="position: fixed;margin: auto;bottom: 20px;text-align: center; width: 100%;">
    <!-- <x-icon @click="addApply()" type="ios-plus-outline" size="60"></x-icon> -->
    </div>

    <!-- <iframe id="iframe" src="" height="500px" width="100%"></iframe> -->

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
        myApprovalUnFinishedCount:0,
        myApprovalFinishedCount:0,
        myCopyAllCount:0,
        myCopyUnFinishedCount:0,
        myCopyFinishedCount:0
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
    this.util.init(this);
      //this.util.mask("正在加载...");
    this.loadData();
		
  },
  created() {
    //background-image:url()
    this.itemBackground = { backgroundImage: "url(" + this.userLogo + ")" };
    //js-sdk
 


    


  },
  methods: {
    addApply() {
      this.$router.push({ name: 'workflow/applyIndex' });
    },loadData(){
      var _this = this;
      _this.util.mask("正在加载...");
      //var url = _this.platform.getBaseUrl()+'/workflow/workflowAction!openWorkflow.action?procDefId=process_hysqgl:3:154939&procInsId=531649&taskId=574108&currentActId=sid-C098749E-C21E-47E0-B461-914817DAA58A&businessKey=2279061c-737c-4a40-9eb5-76e6e569c90d&status=toDo&taskType=0';
      //this.util.alert(url);
      //url = url+"&if_login=1&access_token="+this.platform.getAccessToken();
      //window.open(url);
      //this.util.post('/open/openWorkflowAction!getMyCount.action', { userId: this.sessionUtil.getUserId() }, function (res) {
			this.util.post('/wx/workflowAction!getMyCount.action', { userId: this.sessionUtil.getUserId(),company_id: this.sessionUtil.getCompanyId() }, function (res) {
      //this.util.post('/workflow/getMyCount', { userUid: this.sessionUtil.getUserUid(this) }, function (res) {
          if(res != undefined && res.status == 200){
            //$("#iframe").attr("src",url) 
          //$("#iframe").attr("src",url) 
              _this.statisticsCountData.myApplyAllCount = res.data['APPLY_'];
              _this.statisticsCountData.myApprovalUnFinishedCount = res.data['APPROVAL_UNFINISHED_'];
              _this.statisticsCountData.myApprovalFinishedCount = res.data['APPROVAL_FINISHED_'];
              _this.statisticsCountData.myCopyUnFinishedCount = res.data['COPY_UNFINISHED_'];
              _this.statisticsCountData.myCopyFinishedCount = res.data['COPY_FINISHED_'];
          }
          _this.util.unmask();
        });
    }
  }
}
</script>

<style lang="less" scoped>
.html .body {
  background-color: #f3f3f4;
}
html, body, #app {
    overflow: hidden;
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
  padding: 25px 15px 7px;
  min-height: 48px;
  height: 69px;
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
