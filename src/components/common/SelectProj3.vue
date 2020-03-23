<template>
  <div class="choose">
    <div>
      <search
        v-model="search"
        placeholder="搜索"
        :autoFixed="false"
        @on-submit="handleClick"
        ref="search"
      ></search>
    </div>
    <div :style="checkStyle">
      已选择:&nbsp;&nbsp;&nbsp;{{
        msg.length > 20 ? msg.substr(0, 20) + '...' : msg
      }}
    </div>
    <!-- v-if="checkSee"-->
    <div id="scroller">
      <scroller
        height="-100"
        :use-pulldown="true"
        style="padding-top: 5px;"
        :pulldown-config="pulldown"
        :use-pullup="true"
        :pullup-config="pullup"
        lock-x
        @on-pulldown-loading="loadTop"
        @on-pullup-loading="onScrollBottom"
        ref="scrollerBottom"
      >
        <div class="box2" style="margin-top:5px;text-align: left;">
          <li
            class="itemLi"
            @click="checkItem($event, index, item)"
            v-for="(item, index) in projectList"
            :key="index"
          >
            <icon
              type="circle"
              class="icon-success"
              v-if="!item.checked"
              style="font-size:16px;"
            ></icon>
            <icon
              type="success"
              class="icon-success"
              v-if="item.checked"
              style="font-size:16px;"
            ></icon>
            <span class="proTxt">{{ item[showWord]}}</span>
          </li>
          <div
            v-if="isEnd || projectList.length == 0"
            class="noMore"
            style="padding:10px;text-align: center;"
          >
            已没有更多
          </div>
        </div>
      </scroller>
    </div>
    <nav class="navbar foot navbar-default navbar-fixed-bottom">
      <p>
        <x-button
          @click.native="goback3()"
          mini
          style="width:48%;height: 45px;background:#cccccc"
          type="default"
          >取消</x-button
        >
        <x-button
          @click.native="goback(radio, $event)"
          mini
          style="width:48%;height: 45px;"
          type="primary"
          >确定</x-button
        >
      </p>
    </nav>
  </div>
</template>

<script>
import { XButton, Search, Icon, Scroller } from 'vux'
import sessionUtil from '@/utils/utils.js'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'selectProj',
  data() {
    return {
      value: '',
      radio: 0,
      checkSee: false,
      checkStyle: {
        padding: '15px 10px',
        textAlign: 'left',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'left'
      },
      allLoaded: false,
      noMore: false,
      search: '',
      data: null,
      pulldown: {
        content: '下拉刷新',
        height: 60,
        autoRefresh: false,
        downContent: '下拉刷新',
        upContent: '释放刷新',
        loadingContent: 'Load...',
        clsPrefix: 'xs-plugin-pulldown-'
      },
      pullup: {
        content: '',
        pullUpHeight: 50,
        height: 40,
        autoRefresh: false,
        downContent: '',
        upContent: '',
        loadingContent: 'Loading...',
        clsPrefix: 'xs-plugin-pullup-'
      },
      projectList: [],
      list: [],
      isEnd: false,
      pageSize: 50,
      pageIndex: 1,
      totalIndex: 0,
      userId: '',
      companyId: '',
      departId: ''
    }
  },
  components: {
    XButton,
    Search,
    Icon,
    Scroller
  },
  computed: {
    msg: {
      get() {
        // console.log(this.projectList,123)
        return this.projectList.length == 0 || this.radio == 0
          ? ''
          : this.projectList[this.radio - 1][this.showWord]
      }
    }
  },
  props: ['mess', 'showWord', 'theUrl', 'openWord'],
  created() {
    var _this = this
    this.search = ''
    this.userId = this.sessionUtil.getUserId()
    this.companyId = this.sessionUtil.getCompanyId()
    this.departId = this.sessionUtil.getDepartId()
    if (this.projectList.length == 0) {
      this.loadData('upLoad')
    }
  },
  activated() {
    // 	console.log('dslkjf')
    //     this.userId=	this.sessionUtil.getUserId();
    // 	this.companyId = this.sessionUtil.getCompanyId();
    // 	this.departId = this.sessionUtil.getDepartId();
    // 	if (this.projectList.length == 0) {
    // 		this.loadData('upLoad');
    // 	}
  },
  methods: {
    onScrollBottom() {
      // console.log("bottom")
      if (this.isEnd) {
        this.$refs.scrollerBottom.donePullup()
        return
      }
      if (this.onFetching) {
        // do nothing
      } else {
        this.onFetching = true
        this.noMore = false
        this.pageIndex = this.pageIndex + 1
        this.loadData('upLoad')
      }
    },
    loadTop() {
      this.onFetching = true
      this.isEnd = false
      var xmArr = this.projectList
      this.pageIndex = 1
      this.totalIndex = 0
      this.loadData('downLoad')
    },
    loadData(type, creatTime) {
      let vm = this
      // console.log('fdksj')
      var param = {
        search: this.util.isNotEmpty(this.search) ? this.search : null,
        operateType: 'getProjList',
        pageIndex: type == 'upLoad' ? this.pageIndex : 1
      }
      var state = this.$store.state
      var _this = this
      if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
        _this.util.mask('正在搜索...')
      }
      

      _this.onFetching = true
      var sql = ''
      if (this.mess.moduleType && this.mess.moduleType == 'gcPro') {
        sql =
          'select a.*,b.UserName from U_Project a left join ORG_User b ' +
          "on a.ProManagerId=b.Id where a.states='1' and a.lock='-5' and " +
          " (RIGHT('" +
          this.departId +
          "',6)  = RIGHT(a.subCompany,6) or '" +
          this.departId +
          "' " +
          " in(select DepartId from ORG_Depart where DepartType='dept')  or   CHARINDEX('" +
          this.departId +
          "',a.subCompany)>0)  and " +
          " ISNULL(a.showWord,'') like '%" +
          this.search +
          "%' and isnull(b.UserName,'') like '%%'  "
      } else if (
        this.mess.moduleType &&
        this.mess.moduleType == 'progressProj'
      ) {
        sql =
          'select a.*, b.UserName, p.projectTypeId, p.projectTypeName ' +
          'from U_Project a ' +
          'left join ORG_User b ' +
          'on a.ProManagerId = b.Id  left join U008_Project_Commencement_Report x on x.xmid=a.Id ' +
          'join (select t1.*, t2.projectType projectTypeName ' +
          'from U007_Project_Plan_Init t1 ' +
          'left join U007_Project_Type t2 ' +
          'on t1.projectTypeId = t2.Id) p ' +
          'on a.Id = p.xmid ' +
          "where a.states = '1' " +
          "and a.lock = '-5'   and x.lock='-5'  " +
          "and  (RIGHT('" +
          this.departId +
          "',6)  = RIGHT(a.subCompany,6) or '" +
          this.departId +
          "'  " +
          "in(select DepartId from ORG_Depart where DepartType='dept')  or   CHARINDEX('" +
          this.departId +
          "',a.subCompany)>0) "
      } else {
        sql =
          'select a.*,b.UserName from U_Project a	left join ORG_User b on ' +
          "a.ProManagerId=b.Id where a.states='1' and a.lock='-5' and " +
          "('" +
          _this.userId +
          "' in (select UserId from ORG_User_Role where RoleId in " +
          " ('Role_0001_002','admin,''Role_Sys_Company_Admin')) or '" +
          _this.userId +
          "' in (select d.userIdListId from " +
          ' U002_Project_Department c left join U002_Project_Department_listdet d on ' +
          'c.Id=d.pid ))  '
      }

      var obj = {
        Company: _this.companyId
      }
      // var searchParams={
      // 	showWord:this.search
      // }

      var params = {
        operateType: 'queryDataByEncSql',
        param: JSON.stringify(obj),
        //searchParams:JSON.stringify(searchParams),
        querySql: _this.util._encode(sql),
        orderByName: 'DocCreated DESC',
        fieldList: '',
        end: _this.totalIndex + _this.pageSize,
        start: _this.totalIndex + 1
      }

      if (this.showWord == 'xmmc') {
        var lxh = this.search
        params.lxh = lxh
      } else if (this.showWord == 'zdmc') {
        var lxh =vm.mess.selectedLxh,zdmc = this.search
        params.lxh = lxh 
        params.zdmc = zdmc
      } else if (this.showWord == 'xmbry') {
        var xmjl =vm.mess.selectedLxh
        params.xmjl = xmjl
        this.showWord = 'xm'
      } else if (this.showWord == 'xmbcl') {
        var xmjl =vm.mess.selectedLxh
        params.xmjl = xmjl
        this.showWord = 'cph'
      } else if (this.showWord == 'sgry') {
        var xmjl =vm.mess.selectedLxh
        params.xmjl = xmjl
      } else if (this.showWord == 'xgwzw') {
        params.gw = this.search
      }else if (this.showWord == 'lxmc') {
        params.lx = this.search
      }
      // var url = '/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat';
      // console.log(this.showWord,'this.showWord');
      let url = this.theUrl
      this.util.post(url, params, function(res) {
        // console.log(res,'我收');
        
        if (res.data.data.length > 0) {
          res.data.data.forEach(element => {
            element.checked = false
          })
        }
        _this.noMore = true
        if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
          _this.util.unmask()
        }
        if (res.data.data == undefined || res.data.data.length == 0) {
          if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
            _this.searchList = []
            _this.projectList = []
          }
          if (type == 'upLoad') {
            _this.allLoaded = true // 若数据已全部获取完毕

            _this.isEnd = true
          }

          _this.$nextTick(() => {
            _this.$refs.scrollerBottom.reset()
          })
          _this.onFetching = false

          _this.$refs.scrollerBottom.donePullup()
          _this.$refs.scrollerBottom.donePulldown()
          //var dom = _this.$refs.scrollerBottom.$el;
          //dom = $(dom).find('.xs-container')[0];
          //$(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
          return
        }
        if (type == 'downLoad') {
          //下拉
          _this.projectList = res.data.data
          if (_this.validUtil.isNotEmpty(_this.search)) {
            _this.searchList = _this.data.data
          } else {
            _this.list = _this.projectList
          }
          // _this.projectList = res.data;
          //console.info(_this.projectList);
          _this.$nextTick(() => {
            _this.$refs.scrollerBottom.reset()
          })
          // 加载更多数据
          // _this.$refs.loadmore.onTopLoaded();
          _this.$refs.scrollerBottom.donePulldown()
          _this.onFetching = false
          if (res.data.data.length < _this.pageSize) {
            _this.isEnd = true
            _this.totalIndex += res.data.data.length
            _this.$refs.scrollerBottom.disablePullup()
          } else {
            _this.isEnd = false
            _this.totalIndex += res.data.data.length
            _this.$refs.scrollerBottom.enablePullup()
          }
        } else if (type == 'upLoad') {
          _this.projectList = _this.projectList.concat(res.data.data)
          if (_this.validUtil.isNotEmpty(_this.search)) {
            _this.searchList = _this.projectList
          } else {
            _this.list = _this.projectList
          }
          _this.$nextTick(() => {
            _this.$refs.scrollerBottom.reset()
          })
          _this.onFetching = false
          _this.$refs.scrollerBottom.donePullup()

          if (res.data.data.length < _this.pageSize) {
            _this.isEnd = true
            _this.totalIndex += res.data.data.length
            _this.$refs.scrollerBottom.disablePullup()
          } else {
            _this.isEnd = false
            _this.totalIndex += res.data.data.length
            _this.$refs.scrollerBottom.enablePullup()
          }
        }
        if (_this.pageIndex == 1) {
          // _this.$nextTick(() => {
          // 	_this.$refs.scrollerBottom.reset({
          // 		top: 0
          // 	})
          // })
        }
        _this.util.unmask()
      })
      // console.log('kjhk',_this.projectList)
    },
    handleClick() {
      this.radio = 0
      this.checkSee = false
      // console.log( this.search,'this.search');
      
      if (!this.validUtil.isNotEmpty(this.search)) {
        if (this.list.length > 0) {
          this.projectList = this.list
          this.allLoaded = false
          this.noMore = true
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset()
          })
          return
        }
      }
      this.projectList = []
      this.pageIndex = 1
      this.totalIndex = 0
      this.loadData('downLoad')
    },
    checkItem($event, index, item) {
      let vm = this
      let temp = 0
      for (var i = 0; i < this.projectList.length; i++) {
        this.projectList[i].checked = false
        if (this.projectList[i] == item) {
          temp = parseInt(i + 1)
        }
      }
      item.checked = true
      this.checkSee = true
      // console.log(temp)
      this.radio = temp
      // console.log(this.radio)
    },
    goback(radio, $event) {
      // console.log('radio',radio)
      // console.log('$event',$event)
      if (radio == null || radio == 0) {
        this.util.alert('你没有选择项目')
        return
      } else {
        this.mess[this.openWord] = false
        this.mess.projName = this.projectList[radio - 1].showWord
        this.mess.projUid = this.projectList[radio - 1].xmid
        this.$emit('selectProjCallback', this.projectList[radio - 1])
      }
    },
    goback3() {
      this.mess[this.openWord] = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.navbar-fixed-bottom,
.navbar-fixed-top {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 45px;
  z-index: 1030;
}
.navbar-fixed-bottom {
  bottom: 0px;
}
.itemLi {
  padding: 10px;
  border-bottom: 1px solid #eee;
  position: relative;
  text-indent: 15px;
}
.icon-success {
  position: absolute;
  left: -24px;
  top: 12px;
}
.icon-success::before {
  margin: 0 !important;
}
.proTxt {
  display: inline-block;
  text-indent: 0;
  padding: 0 15px;
}
</style>
