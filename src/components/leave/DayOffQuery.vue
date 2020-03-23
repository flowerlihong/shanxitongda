<template>
    <div class="choose">
        <div class="head">
            <search  v-model.trim="search" placeholder="搜索调休事由" :autoFixed="false"  @on-submit="searchFunc()" ref="search">
                </search>
        </div>
        <scroller height="-62" lock-x scrollbar-y use-pullup use-pulldown :pullup-config="pullup" :pulldown-config="pulldown"  @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
    
        <div >            <!-- class="vux-1px-t" -->
            <swipeout>
                <div v-for="(item,index) in offData" :key="item.Id">
                    <swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
                        <div slot="right-menu" v-if="item.lock==null">
                            <swipeout-button @click.native="onButtonClick('delete',item.Id,index)" type="warn">{{('删除')}}</swipeout-button>
                        </div>
                        <div slot="content" class="demo-content noPadding">
                            <div class="card facebook-card animated fadeInUp" @click="showDetail(index)">
                                <div v-if="item.lock ==null" class="ribbon-wrapper-green">
                                    <div class="ribbon-green" style="background-color:red;">
                                        未审
                                    </div>
                                </div>

                                <div v-if="item.lock ==-1" class="ribbon-wrapper-green">
                                    <div class="ribbon-green" style="background-color:#c1c16b;">
                                        送审
                                    </div>
                                </div>
                                <div v-if="item.lock ==-5" class="ribbon-wrapper-green">
                                    <div class="ribbon-green" style="background-color:rgb(90, 214, 145);">
                                        已审
                                    </div>
                                </div>

                                <div class="card-header no-border">
                                    
                                   <!--  <div class="facebook-date head-ft16">
                                        <span class=" ft14" style="color:#8994d2">调休类型{{item.offType}}</span>
                                    </div> -->
                                    
                                    <div class="facebook-date">
                                        <span class=" c999 title-item "> 
                                            调休日期: 
                                            <span class="color-content" style="display:block;float:right">
                                                {{item.offStartTime}} 至 <br>
                                                {{item.offEndTime}}
                                            </span>
                                          
                                        </span>
                                       
                                    </div>
                                    <!-- <div class="facebook-date">
                                        <span class=" c999 title-item " > 
                                            <span> 调休原因:</span> 
                                            <span class="color-content " >
                                                {{item.offReson==undefined?'':item.offReson.length>14?(item.offReson.substr(0,14)+'...'):item.offReson}}
                                                </span> 
                                            
                                        </span>
                                        
                                    </div> -->
                                <div class="facebook-date">

                                        <span class=" c999 title-item infoItems-left" >调休天数:<span class="color-content">{{item.offDays}}</span></span>
                                        <span class=" c999 title-item infoItems-right" >调休类型:<span class="color-content">{{item.offType}}</span></span>

                                    </div>
                                    
                                    <!-- <div class="facebook-date">
                                        <span class=" c999 title-item infoItems-left" style="width:60%;" >部门:
                                            <span class="color-content">
                                                {{item.depart == undefined?'':item.depart.length>9?(item.depart.substr(0,9)+'...'):item.depart}}
                                            </span>
                                        </span>
                                        <span class=" c999 title-item infoItems-right" style="width:37%;">申请人:<span class="color-content">{{item.applicant}}</span></span>

                                    </div> -->
                                </div>

                            </div>
                        </div>
                    </swipeout-item>
                </div> 
            </swipeout>    
                
            
        <div v-if="isEnd " class="noMore" style="padding:10px;text-align: center;">已没有更多</div>  
        </div>
      
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
        
       <div style="position: fixed;margin: auto;bottom: 20px;text-align: right; width: 100%;">
        <x-icon type="ios-plus-outline" @click="addBx()" style="margin-right:0.3rem" size="60"></x-icon>
    </div>
    </div>
</template>
<script>
import {
  Search,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  Scroller,
  Spinner
} from "vux";
import { mapState, mapGetters, mapActions } from "vuex";
import { cloneObj, util, sessionUtil } from "@/utils/utils.js";
export default {
  data() {
    return {
      search: "",
      disabled: false,
      offData: [],
      pageNum: 1,
      pageSize: 10 - 1,
      isEnd: false,
      pullupEnabled: true,
      status: {
        pullupStatus: "default",
        pulldownStatus: "default"
      },
      pulldown: {
        content: "下拉刷新",
        height: 60,
        autoRefresh: false,
        downContent: "下拉刷新",
        upContent: "释放刷新",
        loadingContent: "刷新中...",
        clsPrefix: "xs-plugin-pulldown-"
      },
      pullup: {
        content: "上拉加载更多",
        pullUpHeight: 50,
        height: 40,
        autoRefresh: false,
        downContent: "释放加载更多",
        upContent: "上拉加载更多",
        loadingContent: "加载中...",
        clsPrefix: "xs-plugin-pullup-"
      }
    };
  },
  components: {
    Search,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Scroller,
    Spinner
  },
  computed: {
    ...mapState({
      userUid: state => state.userUid
    })
  },
  created() {
      this.util.init(this)
  },
  mounted() {
    // this.loadPageList();
  },
  activated() {
    var type = this.util.getUrlParam("pType");
    // if(type&& type == "saveBack");
    this.refresh();
    this.$refs.scroller.reset();
  },
  methods: {
    searchFunc() {
      this.refresh();
    },
    showDetail(index) {
      var _this = this;
      var isReadOnly = _this.offData[index].lock == null ? "false" : "true";
      util.gotoByName("AddOff", {
        pType: "detail",
        Id: _this.offData[index].Id,
        id: _this.offData[index].Id,
        _procInstId: _this.offData[index].ProcInsId,
        isReadOnly: isReadOnly
      });
    },
    onButtonClick(type, Id, index) {
      //alert('on button click ' + type)
      this.util.mask();
      var _this = this;
      if (type == "delete") {
        var url = "/admin/appDefaultFormAction!removeData.action";
        var params = {
          ids: Id,
          sqlTableName: "U013_Take_The_Application",
          flag: 2
        };
        this.util.post(url, params, function(res) {
          _this.util.unmask();
          _this.util.alert("删除成功");
          _this.offData.splice(index, 1);
        });
      }
    },
    handleEvents(type) {
      console.log("event: ", type);
    },
    loadMore() {
      console.log("More--pageNum", this.pageNum);
      this.querryData(1, this.pageNum);

      setTimeout(() => {
        this.$refs.scroller.donePullup();
      }, 10);
    },
    refresh() {
      this.pageNum = 1;

      this.querryData(0, this.pageNum);
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.scroller.donePulldown();
          this.pullupEnabled && this.$refs.scroller.enablePullup();
        }, 0);
      });
    },
    querryData(type, start) {
      this.util.mask();
      var obj = new Object();
      obj["company"] = sessionUtil.getCompanyId();
      //   obj['applicant'] = sessionUtil.getUserName();
      //  var userName = sessionUtil.getUserName()

      // obj['projectNumber'] =

      var _this = this;

      var searchParams = {
        offReson: _this.search
      };

      var params = {
        operateType: "queryFormData",
        param: JSON.stringify(obj),
        searchParams: JSON.stringify(searchParams),
        // querySql : _this.util._encode(sql),
        sqlTableName: "U013_Take_The_Application",
        orderByName: "DocCreated DESC",
        fieldList:
          "AddName,Id,lock,sn,fsrq,czy,offType,applicant" +
          ",depart,surplusDays,offStartTime,offEndTime,offDays,offReson,ProcInsId",
        totalRows: start + _this.pageSize,
        firstRows: start
      };

      this.util.post(
        "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat",
        params,
        function(res) {
          console.log(res);

          _this.util.unmask();
          _this.offData =
            type == 1 ? _this.offData.concat(res.data) : cloneObj(res.data);

          if (res.data.length < _this.pageSize) {
            _this.changePullupStatus(false);
            _this.isEnd = true;
          }
          _this.pageNum += res.data.length;
        }
      );
    },
    changePullupStatus(enabled) {
      if (enabled) {
        this.$refs.scroller.enablePullup();
        this.pullupEnabled = true;
      } else {
        this.$refs.scroller.disablePullup();
        this.pullupEnabled = false;
      }
    },
    addBx() {
      this.$router.push({ name: "AddOff", query: { pType: "addNew", Id: "" } });
      util.gotoByName('AddOff',{pType:'addNew',Id:'',})
    }
  }
};
</script>
<style lang="less" scoped>
.choose {
  // padding-top: 1.6rem;
}
.row123 {
  width: 100%;
  position: absolute;
  top: 0;
}
.demo-content {
  padding: 10px 10px;
}
.infoItems-left {
  font-size: 9pt;
  width: 50%;
  float: left;
}
.infoItems-right {
  font-size: 9pt;
  width: 47%;
  text-align: right;
}
.color-content {
  color: rgb(74, 154, 177);
  padding-left: 10px;
}
.noPadding {
  padding: 0;
}
.title-item {
  // color:rgb(84, 170, 196)
}
.card {
  background: #fff;
  box-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
  margin: 0.5rem;
  position: relative;
  border-radius: 0.1rem;
  font-size: 0.7rem;
}

.card {
  box-shadow: /*0 .05rem 0.05rem rgba(0,0,0,.1)*/ none !important;
  margin: 0rem 0.2rem;
}

.card {
  font-size: 0.5rem;
}

.ribbon-wrapper-green {
  overflow: hidden;
  position: absolute;
  width: 2.7rem;
  height: 2.8rem;
  top: 0px;
  right: -0.2rem;
}
.ribbon-wrapper-green {
  overflow: hidden;
  position: absolute;
  width: 2.7rem;
  height: 2.8rem;
  top: 0px;
  right: -0.2rem;

}

.ribbon-green {
  top: 0.25rem;
  width: 5rem;
  font-size: 0.7em;
  text-align: center;
  transform: rotate(45deg);
  position: relative;
  left: -0.3rem;
  background-color: rgb(90, 214, 145);
  color: rgb(251, 251, 251);
}

.card-footer,
.card-header {
  min-height: 2.2rem;
  position: relative;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.card-header {
  border-radius: 0.1rem 0.1rem 0 0;
  font-size: 0.85rem;
}

.card-header,
.card-footer {
  margin: 0;
  font-size: 0.65rem;
  border-bottom: 1px solid #f7f7f7;
  min-height: 0;
  padding: 0.5rem 0rem;
  margin: 0 0.5rem;
}

.facebook-card .card-header {
  display: block;
  padding: 0.4rem 0.2rem;
  margin: 0 0.2rem;
  padding-top: 0px;
  padding-bottom: 0.2rem;
  padding-left: 0px;
  margin-left: 5px;
}

.facebook-card .facebook-avatar {
  float: left;
  margin-top: 0.12rem;
  margin-left: 0rem;
}

img {
  border: 0;
}

img {
  max-width: 100%;
}

.border-r {
  border-radius: 50%;
}

.facebook-date {
  position: relative;
}

.facebook-card .facebook-date {
  font-size: 0.35rem;
  color: #5f646e;
}

.facebook-card .facebook-date {
  // margin-left: 1.6rem;
  text-align: left;
  word-break: break-all;
}

/* .box2-wrap {
  height: 300px;
  overflow: hidden;
} */
.rotate {
  display: inline-block;
  transform: rotate(-180deg);
}
.pullup-arrow {
  transition: all linear 0.2s;
  color: #666;
  font-size: 25px;
}
</style>


