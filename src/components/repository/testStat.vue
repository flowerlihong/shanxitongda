<template>
  <div>
    <!-- <search  v-model="search" placeholder="搜索" :autoFixed="false"  @on-submit="searchFunc()" ref="search">
    </search> -->
    <scroller
      height="-62"
      lock-x
      scrollbar-y
      use-pulldown
      :pulldown-config="pulldown"
      @on-pulldown-loading="refresh"
      v-model="status"
      ref="scroller"
    >
      <div>
        <div
          style="margin-bottom:10px;"
          v-for="(item, index) in arrOri"
          :key="index"
        >
          <div
            @click="particulars(item)"
            style="color:lightslategrey;font-size:20px"
          >
            {{ item.AddName_CN }}
          </div>
          <card v-for="(item1, index) in item.data" :key="index">
            <div slot="content" class="card-demo-flex card-demo-content01">
              <div class="vux-1px-r">
                类型
                <br />
                <span>{{ item1.lxmc }}</span>
              </div>
              <div class="vux-1px-r">
                总题数
                <br />
                <span>{{ item1.tmzs }}</span>
              </div>
              <div class="vux-1px-r">
                错题数
                <br />
                <span>{{ item1.cts }}</span>
              </div>
              <div class="vux-1px-r">
                错误率(%)
                <br />
                <span>{{ item1.ctl }}</span>
              </div>
              <div class="vux-1px-r">
                完成数
                <br />
                <span>{{ item1.wctm }}</span>
              </div>
              <div>
                完成率(%)
                <br />
                <span>{{ item1.wcl }}</span>
              </div>
            </div>
          </card>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { Card, Scroller } from 'vux'
import { mapState } from 'vuex'
import { cloneObj } from '@/utils/utils.js'
import { setTimeout } from 'timers'
export default {
  components: {
    Card,
    Scroller
  },
  activated() {
    this.query()
    this.util.unmask()
  },
  computed: {
    ...mapState({
      userUid: state => state.userUid,
      userName: state => state.userName
    })
  },
  created() {
    // this.query()
  },
  methods: {
    refresh() {
      this.query('refresh') 
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.scroller.donePulldown()
          this.pullupEnabled && this.$refs.scroller.enablePullup()
        }, 0)
      })
    },
    isObject(dest, arr) {
      var map = {}
      for (let i = 0; i < dest.length; i++) {
        var ai = dest[i]
        //  console.log(ai.AddName_CN,99);
        if (!map[ai.AddName_CN]) {
          arr.push({
            AddName_CN: ai.AddName_CN,
            data: [ai]
          })
          map[ai.AddName_CN] = ai
        } else {
          for (let k = 0; k < arr.length; k++) {
            const dj = arr[k]
            if (dj.AddName_CN == ai.AddName_CN) {
              dj.data.push(ai)
              break
            }
          }
        }
      }
    },
    query() {
      this.arrOri = []
      var _this = this,
        url =
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_exercise&appId=WeChat&Type=getschedule',
        params = {}
      this.util.post(url, params, function(res) {
        if (res.status) {
          _this.isObject(res.data.data, _this.arrOri)
        } else {
          return _this.util.alert(res.msg)
        }
      })
    },
    particulars(item) {
      // console.log(item);
      this.$router.push({
        name: 'details',
        query: {
          pType: 'detail',
          data: item
        },
        params: { data: item }
      })
    },
    changePullupStatus(enabled) {
      this.$refs.scroller.donePullup()
      if (enabled) {
        // this.$refs.scroller.enablePullup()
        this.pullupEnabled = true
      } else {
        this.$refs.scroller.disablePullup()
        this.pullupEnabled = false
      }
    }
  },
  data() {
    return {
      isEnd: false,
      arrOri: [],
      departId: '',
      status: {
        pulldownStatus: 'default'
      },
      pulldown: {
        content: '下拉刷新',
        height: 60,
        autoRefresh: false,
        downContent: '下拉刷新',
        upContent: '释放刷新',
        loadingContent: '刷新中...'
        // clsPrefix: 'xs-plugin-pulldown-'
      },
      page: 1,
      pageSize: 10
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
.weui-panel {
  margin: 0 auto;
  width: 98%;
  box-shadow: 0 10px 2px #4a9ab1;
}
.card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  padding: 10px 0;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 13px;
}
.card-demo-flex span {
  // color: #f74c31;
  color: #4a9ab1;
}
.vux-1px-r {
  border-right: 1px solid #eee;
}

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
