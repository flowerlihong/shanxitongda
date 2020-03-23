<template>
    <div class="choose fielProList">
        <div class="head">
            <search  v-model.trim="search" placeholder="搜索项目名称" :autoFixed="false"  @on-submit="searchFunc()" ref="search">
                </search>
        </div>
        <scroller height="-62" lock-x scrollbar-y use-pullup use-pulldown :pullup-config="pullup" :pulldown-config="pulldown"  @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
           
        <div >            <!-- class="vux-1px-t" -->
            
            <div v-for="(item,index) in projectFileData" :key="item.Id" class="proItem" @click="redirect(item.Id)">
                {{item.projectName.length>19?item.projectName.substr(0,19)+"...": item.projectName}}
            </div>  
        
                
            
        <div v-if="isEnd " class="noMore" style="padding:10px;text-align: center;">已没有更多</div>  
        </div>
      
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
        
      
        <!-- <div v-transfer-dom> -->
				<popup v-model="filePageShow" position="right" style="width: 100%;padding-bottom:0px;">
					<div style="width:100%;    height: 100%;">
						<FileDetails :model="filePageData" ref="FileDetails" style="margin-bottom: 44px;"></FileDetails>
						<a href="javascript:;" 
                            @click="filePageShow = false;" 
                            class="weui-btn weui-btn_warn" 
                            style="position: fixed;bottom: 0px;width: 100%;z-index:2;color:#fff;text-decoration:none;">关闭</a>
					</div>
				</popup>
		<!-- </div> -->
    </div>
</template>
<script>
import {
  Search,
  TransferDom,
  Cell,
  CellBox,
  Group,
  Scroller,
  Spinner,
  Popup
} from "vux";
import FileDetails from "./proFilePage.vue";
import { mapState, mapGetters, mapActions } from "vuex";
import { cloneObj, sessionUtil } from "@/utils/utils.js";
export default {
  data() {
    return {
      search: "",
      disabled: false,
      projectFileData: [],
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
      },
      sqlTableName: "U010_Security_Inspection",
      userId: "",
      showContent: false,
      show8: false,
      filePageData: {
        parent: this,
        Id: ""
      },
      filePageShow: false,
      departId: ""
    };
  },
  components: {
    Search,
    TransferDom,
    Scroller,
    Spinner,
    Group,
    Cell,
    CellBox,
    Popup,
    FileDetails
  },
  computed: {
    ...mapState({
      userUid: state => state.userUid
    })
  },
  created() {
    this.userId = this.sessionUtil.getUserId();
    this.departId = this.sessionUtil.getDepartId();
    //  console.log(this.userId)
  },
  mounted() {
    // this.loadPageList();
  },
  activated() {
    //var type = this.util.getUrlParam("pType")
    // if(type&& type == "saveBack");
    this.refresh();
    this.$refs.scroller.reset();
  },
  methods: {
    searchFunc() {
      this.refresh();
    },

    loadMore() {
      // console.log('More--pageNum',this.pageNum)
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

          this.$refs.scroller.reset({
            top: 0
          });
        }, 0);
      });
    },
    querryData(type, start) {
      this.util.mask("文件查询过程可能较慢，请稍后...");
      var obj = new Object();
      obj["company"] = sessionUtil.getCompanyId();
      //   obj['applicant'] = sessionUtil.getUserName();
      //  var userName = sessionUtil.getUserName()

      // obj['projectNumber'] =

      var _this = this;
      var searchParams = {
        projectName: _this.search
      };
      var userId = _this.sessionUtil.getUserId();
      //   var sql ="select a.projectName,a.Id,a.Company,a.DocCreated,b.UserName from U_Project a	left join ORG_User b on "+
      // 					"a.ProManagerId=b.Id where a.states='1' and a.lock='-5' and "+
      // 					"('"+_this.userId+"' in (select UserId from ORG_User_Role where RoleId in "+
      // 					" ('Role_0001_002')) or '"+_this.userId+"' in (select d.userIdListId from "+
      // 					" U002_Project_Department c left join U002_Project_Department_listdet d on "+
      // 					"c.Id=d.pid )1) ";
      var sql =
        "select a.*,b.projectCost," +
        "c.unitName from U_Project a " +
        " left join U001_New_Project_List b on a.bidAdNoteId=b.Id " +
        "left join U003_Construction_Unit c on a.unitId=c.Id " +
        "where a.Company='"+this.departId+"'   and  a.states='1' and isnull(a.projectName,'') " +
        "like '%%' and " +
        "isnull(a.ProManager,'') like '%%' and isnull(a.projectType,'') like '%%'" +
        " and  (RIGHT('"+this.departId+"',6)  = RIGHT(a.subCompany,6) or '"+this.departId+"'  in(select DepartId from ORG_Depart where DepartType='dept') " +
        " or   CHARINDEX('"+this.departId+"',a.subCompany)>0) ";

      var params = {
        operateType: "queryDataByEncSql",
        // param:JSON.stringify(obj),
        searchParams: JSON.stringify(searchParams),
        querySql: _this.util._encode(sql),
        // sqlTableName:'U012_Expense_Account',
        orderByName: "DocCreated DESC",
        // fieldList:'',
        totalRows: start + _this.pageSize,
        firstRows: start
      };

      this.util.post(
        "/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat",
        params,
        function(res) {
          type == 1
            ? (_this.projectFileData = _this.projectFileData.concat(res.data))
            : (_this.projectFileData = res.data);
          if (res.data.length < _this.pageSize) {
            _this.changePullupStatus(false);
            _this.isEnd = true;
          } else {
            _this.changePullupStatus(true);
            _this.isEnd = false;
          }
          _this.pageNum += res.data.length;
          _this.util.unmask();
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

    redirect(Id) {
      this.filePageShow = true;
      this.filePageData.Id = this.Id;
      //console.log(this.$refs.FileDetails)
      this.$refs.FileDetails.queryData(Id);
    }
  }
};
</script>
<style>
.fielProList.choose .weui-search-bar__box .weui-icon-clear {
  /* top: 0; */
  /* margin-top: -14px; */
}
</style>


<style lang="less" >
.proItem {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  text-align: left;
  position: relative;
}
.proItem::after {
  content: " ";
  display: inline-block;
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  position: relative;
  top: -2px;
  position: absolute;
  top: 50%;
  margin-top: -4px;
  right: 15px;
}

.weui-cells.vux-no-group-title {
  margin-top: 0;
}
.sub-item {
  color: #888;
  margin: 0;
  overflow: hidden;
  //position: relative;
  // border-top:1px solid #eee;
  span {
    padding: 0;
    display: block;
    text-align: left;
  }
}
.sub-item::before {
  content: " ";
  display: block;
  width: calc(100% + 50px);
  height: 1px;
  background: #eee;
}
/* .weui-cell.vux-tap-active.weui-cell_access.vux-cell-no-border-intent{
    padding: 0;
} */
.vux-cell-bd {
  p {
    margin: 0;
    label {
      margin: 0;
    }
  }
}

.slide {
  padding: 0px 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
}
.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}
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
.color-red {
  color: rgb(253, 91, 91);
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


