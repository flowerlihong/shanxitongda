<template>
  <div class="choose">
    <!-- <search  v-model="search" placeholder="搜索" :autoFixed="false"  @on-submit="searchFunc()" ref="search">
    </search> -->
    <!-- <divider>下拉刷新和上拉加载更多组合</divider> -->

    <div>
      <swipeout>
        <div v-for="(item, index) in arrDel" :key="index">
          <swipeout-item
            @on-close="handleEvents('on-close')"
            @on-open="handleEvents('on-open')"
            transition-mode="follow"
          >
            <div slot="content" class="demo-content noPadding">
              <div class="card facebook-card animated fadeInUp">
                <div class="card-header no-border">
                  <!-- 立项名称 -->
                  <!-- <div class="facebook-date head-ft16">
                      <span class=" ft14" style="color:#8994d2">{{item.lxh == undefined?'':(item.lxh.length>19?item.lxh.substr(0,19)+'...':item.lxh)}}</span>
                    </div> -->
                  <div class="facebook-date">
                    <span class=" c999 title-item ">
                      姓名：
                      <span
                        class="color-content"
                        style="color:#8994d2;display:block;float:right"
                      >
                        {{ item.AddName_CN }}
                      </span>
                    </span>
                  </div>

                  <div class="facebook-date">
                    <span class=" c999 title-item infoItems-left">
                      考试类型:
                      <span class="color-content">
                        {{ item.lx }}
                      </span>
                    </span>
                    <span class=" c999 title-item infoItems-right">
                      题目数量:
                      <span class="color-content">
                        {{ item.tmsl }}
                      </span>
                    </span>
                  </div>

                  <div class="facebook-date">
                    <span class=" c999 title-item infoItems-left">
                      正确题数:
                      <span class="color-content">
                        {{ item.zqsl }}
                      </span>
                    </span>
                    <span class=" c999 title-item infoItems-right">
                      错误题数:
                      <span class="color-content">
                        {{ item.ctsl }}
                      </span>
                    </span>
                  </div>

                  <div class="facebook-date">
                    <span class=" c999 title-item infoItems-left">
                      错误率:
                      <span class="color-content" style="color:#8994d2;"> {{ item.cwl }}% </span>
                    </span>
                    <span class=" c999 title-item infoItems-right">
                      提交时间:
                      <span class="color-content">
                        {{ item.rq }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </swipeout-item>
        </div>
      </swipeout>
      <div v-if="isEnd" class="noMore" style="padding:10px;text-align: center;">
        已没有更多
      </div>
    </div>
    <!-- pullup slot-->
    <!-- <div
      slot="pullup"
      class="xs-plugin-pullup-container xs-plugin-pullup-up"
      style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;"
    ></div> -->
  </div>
</template>

<script>
import { Card, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { mapState } from 'vuex'
import { cloneObj } from '@/utils/utils.js'
import { setTimeout } from 'timers'
export default {
  components: {
    Card,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  activated() {
    this.util.unmask()
    this.query()
  },
  computed: {
    ...mapState({
      userUid: state => state.userUid,
      userName: state => state.userName
    })
  },
  created() {},
  methods: {
    refresh() {
      this.page = 1
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
      var _this = this,
        url =
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_exercise&appId=WeChat&Type=getStatisticalDetail',
        params = {}

      this.util.post(url, params, function(res) {
        if (res.status) {
          var data = []
          _this.isObject(res.data.data, data)
          for (let i = 0; i < data.length; i++) {
            if (data[i].AddName_CN == _this.$route.params.data.AddName_CN) {
              // console.log(data[i], 123)
              _this.arrDel = data[i].data
            }
          }
          // console.log(_this.arrDel, '数据')
        } else {
          return _this.util.alert(res.msg)
        }
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
      arrDel: [],
      departId: '',
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
.infoItems-left {
  width: 50%;
}
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
  // padding: 10px 5px;
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
