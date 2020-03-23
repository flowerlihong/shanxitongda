<template>
  <div class="choose">
    <!-- <div class="head">
      <search
        v-model.trim="search"
        placeholder="搜索项目名称"
        :autoFixed="false"
        @on-submit="searchFunc()"
        ref="search"
      >
      </search>
    </div> -->
    <scroller
      height="-62"
      lock-x
      scrollbar-y
      use-pullup
      use-pulldown
      :pullup-config="pullup"
      :pulldown-config="pulldown"
      @on-pullup-loading="loadMore"
      @on-pulldown-loading="refresh"
      v-model="status"
      ref="scroller"
    >
      <div>
        <swipeout>
          <div v-for="(item, index) in qualityData" :key="item.Id">
            <swipeout-item
              @on-close="handleEvents('on-close')"
              @on-open="handleEvents('on-open')"
              transition-mode="follow"
            >
              <div
                slot="right-menu"
                v-if="item.lock == null && item.AddName == userId && !item.myid"
              >
                <swipeout-button
                  @click.native="onButtonClick('delete', item.Id, index)"
                  type="warn"
                  >{{ '删除' }}</swipeout-button
                >
                <!-- <swipeout-button
                  @click.native="showDetail(index, item)"
                  type="primary"
                  >{{ '编辑' }}</swipeout-button
                > -->
              </div>
              <div slot="content" class="demo-content noPadding">
                <div
                  class="card facebook-card animated fadeInUp"
                  @click="showExam(item)"
                >
                  <div v-if="item.myid" class="ribbon-wrapper-green">
                    <div
                      class="ribbon-green"
                      style="background-color:rgb(90, 214, 145);"
                    >
                      已答卷
                    </div>
                  </div>
                  <div class="card-header no-border">
                    <div class="facebook-date">
                      <span class=" c999 title-item ">
                        单号:
                        <span
                          class="color-content"
                          style="color:#8994d2;display:block;float:right"
                        >
                          {{ item.sn }}
                        </span>
                      </span>
                    </div>

                    <div class="facebook-date">
                      <span class=" c999 title-item ">
                        考试类型:
                        <span
                          class="color-content"
                          style="display:block;float:right"
                        >
                          {{
                            item.lx == undefined
                              ? ''
                              : item.lx.length > 14
                              ? item.lx.substr(0, 14) + '...'
                              : item.lx
                          }}
                        </span>
                      </span>
                    </div>
                    <div class="facebook-date">
                      <span class=" c999 title-item ">
                        参考人员:
                        <span
                          class="color-content"
                          style="display:block;float:right"
                        >
                          {{ item.czy }}
                        </span>
                      </span>
                    </div>
                    <div class="facebook-date">
                      <span class=" c999 title-item infoItems-left">
                        操作日期:
                        <span class="color-content">
                          {{ item.fsrq }}
                        </span>
                      </span>
                      <span class=" c999 title-item infoItems-right">
                        题目数量:
                        <span class="color-content">
                          {{ item.tmsl }}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </swipeout-item>
          </div>
        </swipeout>
        <div
          v-if="isEnd"
          class="noMore"
          style="padding:10px;text-align: center;"
        >
          已没有更多
        </div>
      </div>
      <!--pullup slot-->
      <div
        slot="pullup"
        class="xs-plugin-pullup-container xs-plugin-pullup-up"
        style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;"
      >
        <span v-show="status.pullupStatus === 'default'"></span>
        <span
          class="pullup-arrow"
          v-show="
            status.pullupStatus === 'down' || status.pullupStatus === 'up'
          "
          :class="{ rotate: status.pullupStatus === 'up' }"
          >↑</span
        >
        <span v-show="status.pullupStatus === 'loading'"
          ><spinner type="ios-small"></spinner
        ></span>
      </div>
    </scroller>

    <div
      style="position: fixed;margin: auto;bottom: 20px;text-align: right; width: 100%;"
    >
      <!-- <x-icon
        type="ios-plus-outline"
        @click="addBx()"
        style="margin-right:0.3rem"
        size="60"
      ></x-icon> -->
    </div>
    <div class="btns">
      <p
        style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;"
      >
        <button
          style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
          @click="addBx()"
          class="weui-btn weui-btn_mini weui-btn_default"
        >
          练习新增
        </button>
        <button
          style="width:48%;height: 45px;line-height: 45px;"
          @click="infoData()"
          class="weui-btn weui-btn_mini weui-btn_primary"
        >
          练习统计
        </button>
      </p>
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
} from 'vux'
import { mapState, mapGetters, mapActions } from 'vuex'
import { cloneObj, sessionUtil } from '@/utils/utils.js'
export default {
  data() {
    return {
      flag:true,
      search: '',
      userId: '',
      disabled: false,
      qualityData: [],
      pageNum: 1,
      pageSize: 10 - 1,
      isEnd: false,
      pullupEnabled: true,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      pulldown: {
        content: '下拉刷新',
        height: 60,
        autoRefresh: false,
        downContent: '下拉刷新',
        upContent: '释放刷新',
        loadingContent: '刷新中...',
        clsPrefix: 'xs-plugin-pulldown-'
      },
      pullup: {
        content: '上拉加载更多',
        pullUpHeight: 50,
        height: 40,
        autoRefresh: false,
        downContent: '释放加载更多',
        upContent: '上拉加载更多',
        loadingContent: '加载中...',
        clsPrefix: 'xs-plugin-pullup-'
      },
      sqlTableName: 'U020_ZHGL_ZSK_ZXKS_KSLX'
    }
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
  deactivated() {
    this.$destroy(true)
  },
  created() {
    this.userId = this.sessionUtil.getUserId()
  },
  mounted() {
    // this.loadPageList();
  },
  activated() {
    var type = this.util.getUrlParam('pType')
    this.refresh()
    // if(type&& type == "saveBack");
    this.$refs.scroller.reset()
  },
  methods: {
    getDate(time) {
      let vm = this
      if (vm.util.isNotEmpty(time)) {
        time = new Date(time)
        // console.log(time.getMonth())
        let theDate =
          time.getFullYear() +
          '-' +
          (time.getMonth() > 8
            ? time.getMonth() + 1
            : '0' + (time.getMonth() + 1)) +
          '-' +
          (time.getDate() > 8 ? time.getDate() + 1 : '0' + (time.getDate() + 1))
        return theDate
      } else {
        return ''
      }
    },
    searchFunc() {
      this.refresh()
    },
    infoData() {
      this.$router.push({
        name: 'testStat',
        query: {
          pType: 'detail'
        }
      })
    },
    showDetail(index, item) {
      var _this = this
      this.$router.push({
        name: 'answerAdd',
        query: {
          pType: 'detail',
          data: item
        },
        params: { data: item }
      })
    },
    showExam(item) {
      // console.log(item,'item');

      this.$router.push({
        name: 'exercise',
        query: {
          pType: 'detail',
          lx: item.lxbh,
          Id: item.Id,
          myid: item.myid,
          data: item.tmsl
        },
        params: { Id: item.Id, myid: item.myid, data: item.tmsl }
      })
    },
    onButtonClick(type, Id, index) {
      var _this = this
      this.util.confirm('是否删除？', function() {
        // this.util.mask()
        if (type == 'delete') {
          var url = '/admin/appDefaultFormAction!removeData.action'
          var params = {
            ids: Id,
            sqlTableName: _this.sqlTableName,
            flag: 2
          }
          _this.util.post(url, params, function(res) {
            // _this.util.unmask()
            // console.log(res, 3333)
            _this.util.alert('删除成功')
            _this.qualityData.splice(index, 1)
          })
        }
      })
    },
    handleEvents(type) {
      // console.log('event: ', type)
    },
    loadMore() {
      // console.log('More--pageNum', this.pageNum)
      if (this.flag) {
        this.flag = false
        this.querryData(1, this.pageNum)
      }
      setTimeout(() => {
        this.$refs.scroller.donePullup()
      }, 10)
    },
    refresh() {
      this.pageNum = 1
      this.querryData(0, this.pageNum)
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.scroller.donePulldown()
          this.pullupEnabled && this.$refs.scroller.enablePullup()
        }, 0)
      })
    },
    querryData(type, start) {
      this.util.mask()
      var obj = new Object()
      // console.log(sessionUtil.getCompanyId(),'this.sessionUtil');
      obj['company'] = sessionUtil.getCompanyId()
      var DepartId = this.sessionUtil.getDepartId()
      var _this = this
      var searchParams = {
        projectName: _this.search
      }
      var userId = _this.sessionUtil.getUserId()
      var sql =
        'select a.* from U009_Quality_Inspection  a left join U_Project b on a.xmid=b.Id ' +
        " where  (RIGHT('" +
        DepartId +
        "',6)  = RIGHT(a.subCompany,6) or '" +
        DepartId +
        "'  in(select DepartId from ORG_Depart where DepartType='dept')  or   CHARINDEX('" +
        DepartId +
        "',a.subCompany)>0) "
      var params = {
        operateType: 'queryDataByEncSql',
        param: JSON.stringify(obj),
        searchParams: JSON.stringify(searchParams),
        querySql: _this.util._encode(sql),
        orderByName: 'DocCreated DESC',
        end: start + _this.pageSize,
        start: start
      }
      this.util.post(
        '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_exercise&appId=Wechat&Type=getpractice',
        params,
        function(res) {
          // console.log('1', res)
          _this.qualityData =
            type == 1
              ? _this.qualityData.concat(res.data.data)
              : cloneObj(res.data.data)
          if (res.data.length < _this.pageSize) {
            _this.changePullupStatus(false)
            _this.isEnd = true
          } else {
            _this.changePullupStatus(true)
            _this.isEnd = false
          }
          // console.log(_this.qualityData)
           _this.flag = true
          _this.pageNum += res.data.data.length
          _this.util.unmask()
        }
      )
    },
    changePullupStatus(enabled) {
      if (enabled) {
        this.$refs.scroller.enablePullup()
        this.pullupEnabled = true
      } else {
        this.$refs.scroller.disablePullup()
        this.pullupEnabled = false
      }
    },
    addBx() {
      this.$router.push({
        name: 'answerAdd',
        query: { pType: 'addNew', Id: '' }
      })
    }
  }
}
</script>
<style>
.choose .weui-search-bar__box .weui-icon-clear {
  top: 50%;
}
</style>

<style lang="less" scoped>
.weui-search-bar__box .weui-icon-clear {
  top: 50%;
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
// .title-item {
//   // color:rgb(84, 170, 196)
// }
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
<style>
.weui-search-bar__box .weui-icon-clear {
  top: 50%;
}
</style>
