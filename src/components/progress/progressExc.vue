<template>
  <div>
    <search
      v-model="search"
      placeholder="搜索"
      :autoFixed="false"
      @on-submit="searchFunc()"
      ref="search"
    >
    </search>
    <!-- <divider>下拉刷新和上拉加载更多组合</divider> -->
    <scroller
      lock-x
      scrollbar-y
      use-pullup
      use-pulldown
      height="-62"
      @on-pullup-loading="loadMore"
      @on-pulldown-loading="refresh"
      v-model="status"
      ref="scroller"
      :pullup-config="pullup"
      :pulldown-config="pulldown"
    >
      <div class="box2">
        <swipeout>
          <group>
            <cell-box v-for="(val, index) in arr" :key="index">
              <div class="list-item">
                <swipeout-item
                  @on-close="handleEvents('on-close')"
                  @on-open="handleEvents('on-open')"
                  transition-mode="follow"
                >
                  <div
                    slot="right-menu"
                    v-if="val.lock == null && val.AddName == userId"
                  >
                    <!-- <swipeout-button  @click.native="onButtonClick('fav')" type="primary">编辑</swipeout-button> -->
                    <swipeout-button
                      @click.native="onButtonClick('delete', val.Id)"
                      type="warn"
                      >删除</swipeout-button
                    >
                  </div>
                  <div
                    slot="content"
                    class="demo-content vux-1px-t"
                    @click="edit(val.Id)"
                  >
                    <div
                      class="report"
                      @click.stop="report(val.Id, val.xmid, val.AddName)"
                    >
                      上报
                    </div>
                    <div class="infos">
                      <div class="proName">
                        {{ val.projectName }}
                      </div>
                      <div class="others">
                        <div class="type">{{ val.projectTypeName }}</div>
                        <div class="date">{{ val.reportMonth }}</div>
                      </div>
                    </div>
                    <div class="status">
                      <div
                        v-if="val.lock == null || val.lock == 0"
                        class="status-line bg-red"
                      >
                        未审
                      </div>
                      <div v-if="val.lock == -1" class="status-line bg-blue">
                        送审
                      </div>
                      <div v-if="val.lock == -5" class="status-line bg-green">
                        已审
                      </div>
                    </div>
                  </div>
                </swipeout-item>
              </div>
            </cell-box>
          </group>
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
    <!--     <group>
      <x-switch :title="pullupEnabled ? '禁用Pullup' : '启用Pullup'" :value="true" @on-change="changePullupStatus"></x-switch>
    </group> -->

    <div
      style="position: fixed;margin: auto;bottom: 20px;text-align: right; width: 100%;"
    >
      <x-icon
        type="ios-plus-outline"
        @click="addData()"
        style="margin-right:0.3rem"
        size="60"
      ></x-icon>
    </div>
  </div>
</template>

<script>
import {
  Scroller,
  Divider,
  Search,
  Group,
  Spinner,
  CellBox,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton
} from 'vux'
import { cloneObj } from '@/utils/utils.js'
import { setTimeout } from 'timers'
export default {
  components: {
    Scroller,
    // Divider,
    // XSwitch,
    Search,
    Group,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Spinner,
    CellBox
  },
  activated() {
    this.util.unmask()
  },
  created() {
    this.util.init(this)
    this.departId = this.sessionUtil.getDepartId()
    this.userId = this.sessionUtil.getUserId()
    this.refresh()
  },
  methods: {
    searchFunc() {
      this.refresh()
    },
    edit(Id) {
      this.util.gotoByName('progressExcDetail', { Id: Id })
    },
    report(Id, xmid, AddName) {
      this.util.gotoByName('prgReport', { Id, xmid, AddName })
    },
    loadMore() {
      if (!this.fetching) {
        this.page++
        this.query('loadMore')
      }
    },
    refresh() {
      this.page = 1
      this.query('refresh')
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.scroller.donePulldown()
          this.pullupEnabled && this.$refs.scroller.enablePullup()
        }, 10)
      })
    },
    query(type) {
      var _this = this,
        url = '/admin/appAgentAction!runAgent.action',
        params = {
          agentId: 'Agent_WeChat_Project_Plan_Init',
          type: 'projectPlanInit',
          departId: this.departId,
          start: (this.page - 1) * this.pageSize + 1,
          end: (this.end = this.page * this.pageSize),
          query: this.search
        }
      this.util.post(url, params, function(res) {
        if (type === 'loadMore') {
          if (res.data.length === _this.pageSize) {
            _this.arr = _this.arr.concat(res.data)
            _this.$nextTick(() => {
              _this.$refs.scroller.reset()
            })
            _this.$refs.scroller.donePullup()
          } else if (res.data.length < _this.pageSize) {
            _this.arr = _this.arr.concat(res.data)
            _this.$nextTick(() => {
              _this.$refs.scroller.reset()
            })
            _this.isEnd = true
            setTimeout(() => {
              _this.changePullupStatus(false)
            }, 10)
          } else if (res.data.length === 0) {
            _this.page--
            _this.isEnd = true
            setTimeout(() => {
              _this.changePullupStatus(false)
            }, 10)
          }

          // _this.$refs.scroller.donePulldown();
        } else if (type === 'refresh') {
          if (res.data.length < _this.pageSize) {
            _this.isEnd = true
            _this.changePullupStatus(false)
          } else {
            _this.isEnd = false
            _this.changePullupStatus(true)
          }

          _this.arr = res.data
          _this.$refs.scroller.donePulldown()
        }
      })
    },
    changePullupStatus(enabled) {
      this.$refs.scroller.donePullup()
      if (enabled) {
        this.$refs.scroller.enablePullup()
        this.pullupEnabled = true
      } else {
        this.$refs.scroller.disablePullup()
        this.pullupEnabled = false
      }
    },
    handleEvents(type) {},
    onButtonClick(type, Id) {
      if (type === 'delete') {
        this.util.deleteData(Id, 'U007_Project_Month_Report')
        this.refresh()
      }
    },
    addData(Id) {
      this.util.gotoByName('progressExcDetail', { Id: Id })
    }
  },
  data() {
    return {
      n: 10,
      n1: 10,
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
      isEnd: false,
      search: '',
      arr: [],
      arrOri: [],
      departId: '',
      userId: '',
      page: 1,
      pageSize: 10,
      fetching: false
    }
  }
}
</script>
<style>
.weui-cells.vux-no-group-title {
  margin-top: 0;
}
</style>
<style lang="less" scoped>
@paddingL: 0px;
.box2-wrap {
  height: 300px;
  overflow: hidden;
}

.rotate {
  display: inline-block;
  transform: rotate(-180deg);
}
.pullup-arrow {
  transition: all linear 0.2s;
  color: #666;
  font-size: 25px;
}

.weui-cell {
  padding: 0;
}
.list-item {
  position: relative;
  // padding-left: 5px;
  width: 100%;
  text-align: left;
  // display: flex;
}
.report {
  position: absolute;
  // left: @paddingL;
  top: 50%;
  transform: translateY(-50%);
  height: 1.2rem;
  width: 1.2rem;
  background-color: #5caaef;
  color: #fff;
  line-height: 1.2rem;
  text-align: center;
  font-size: 0.5rem;
  border-radius: 50%;
}
.infos {
  margin-left: 1.5rem;
  .proName {
    color: #8994d2;
  }
  .others {
    display: flex;
    font-size: 12px;
    color: #4a9ab1;
    .type {
      flex: 1;
    }
    .date {
      float: right;
      flex: 1;
    }
  }
}

.status {
  position: absolute;
  right: 0rem;
  top: 0px;
  width: 1.8rem;
  height: 1.8rem;
  overflow: hidden;
  .status-line {
    width: 3rem;
    height: 0.5rem;
    text-align: center;
    color: #fff;
    font-size: 12px;
    position: absolute;
    top: 0.4rem;
    right: -1rem;
    transform: rotate(45deg);
  }
}
.demo-content {
  padding: 10px 5px;
  overflow: hidden;
}
.bg-red {
  background: red;
}
.bg-green {
  background: rgb(90, 214, 145);
}
.bg-blue {
  background: rgb(73, 202, 241);
}
</style>
