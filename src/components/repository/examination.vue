<template>
  <div class="cptWrap">
    <clocker
      v-if="!disabled"
      :time="time1"
      format="%H 小时 %M 分 %S 秒"
      @on-finish="saveData()"
    ></clocker>
    <div id="paperTaxt"></div>
    <group>
      <cell-box v-if="singleData.length > 0">
        <div class="field">单选题 --- 共{{ singleData.length }}题</div>
      </cell-box>
      <cell-box v-for="(item, index) in singleData" :key="item.zid">
        <div class="wrap-proNum">
          <div>{{ index + 1 }}.（{{ singleData.danxfs }}分）{{ item.bt }}</div>
          <div v-if="disabled" style="color:red">答案：{{ item.da }}</div>
          <div class="field">
            <label
              ><input type="radio" :name="item.zid" value="A" />A.
              {{ item.anr }}</label
            >
            <label
              ><input type="radio" :name="item.zid" value="B" />B.
              {{ item.bnr }}</label
            >
            <label
              ><input type="radio" :name="item.zid" value="C" />C.
              {{ item.cnr }}</label
            >
            <label
              ><input type="radio" :name="item.zid" value="D" />D.
              {{ item.dnr }}</label
            >
          </div>
        </div>
      </cell-box>
      <cell-box v-if="doubleData.length > 0">
        <div>
          <div class="field">多选题 --- 共{{ doubleData.length }}题</div>
        </div>
      </cell-box>
      <cell-box v-for="(item, index) in doubleData" :key="item.zid">
        <div class="wrap-proNum">
          <div class="wrap-proNum">
            <div>
              {{ index + 1 }}.（{{ doubleData.duoxfs }}分）{{ item.bt }}
            </div>
            <div v-if="disabled" style="color:red">答案：{{ item.da }}</div>
            <div class="field">
              <label
                ><input type="checkbox" :name="item.zid" value="A" />A.
                {{ item.anr }}</label
              >
              <label
                ><input type="checkbox" :name="item.zid" value="B" />B.
                {{ item.bnr }}</label
              >
              <label
                ><input type="checkbox" :name="item.zid" value="C" />C.
                {{ item.cnr }}</label
              >
              <label
                ><input type="checkbox" :name="item.zid" value="D" />D.
                {{ item.dnr }}</label
              >
              <label v-if="item.enr !== ''"
                ><input type="checkbox" :name="item.zid" value="E" />E.
                {{ item.enr }}</label
              >
            </div>
          </div>
        </div>
      </cell-box>
      <cell-box v-if="opinionData.length > 0">
        <div class="field">判断题 --- 共{{ opinionData.length }}题</div>
      </cell-box>
      <cell-box v-for="(item, index) in opinionData" :key="item.zid">
        <div class="wrap-proNum">
          <div>{{ index + 1 }}.（{{ opinionData.pandfs }}分）{{ item.bt }}</div>
          <div v-if="disabled" style="color:red">答案：{{ item.da }}</div>
          <div class="field">
            <label
              ><input type="radio" :name="item.zid" value="A" />A.
              {{ item.anr }}</label
            >
            <label
              ><input type="radio" :name="item.zid" value="B" />B.
              {{ item.bnr }}</label
            >
          </div>
        </div>
      </cell-box>

      <mt-popup
        v-model="selectProjModel.selectProjVisible"
        position="right"
        popup-transition="popup-fade"
        style="width:100%;height:100%"
      >
      </mt-popup>
      <div class="btns">
        <p
          style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;"
        >
          <button
            style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
            @click="cancelCallback()"
            class="weui-btn weui-btn_mini weui-btn_default"
          >
            取消
          </button>
          <button
            v-if="!isReadOnly"
            style="width:48%;height: 45px;line-height: 45px;"
            @click="saveData()"
            class="weui-btn weui-btn_mini weui-btn_primary"
          >
            提交
          </button>
          <button
            v-if="isReadOnly"
            style="width:48%;height: 45px;line-height: 45px;"
            class="weui-btn weui-btn_mini"
          >
            提交
          </button>
        </p>
      </div>
    </group>
  </div>
</template>

<script>
import { Group, CellBox, XTextarea, Datetime, Clocker } from 'vux'
import { mapState, mapGetters, mapActions } from 'vuex'
import { rejects } from 'assert'
import { setTimeout } from 'timers'
export default {
  created() {
    this.mainFormData.kssj = this.dateFormat(Date.parse(new Date()))
    this.query()
    console.log('created已创建')
  },
  activated() {},
  methods: {
    dateFormat(time) {
      // console.log(time)
      const date = new Date(time)
      const y = date.getFullYear()
      const m = (date.getMonth() + 1 + '').padStart(2, '0')
      const d = (date.getDate() + '').padStart(2, '0')
      const hh = (date.getHours() + '').padStart(2, '0')
      const mm = (date.getMinutes() + '').padStart(2, '0')
      const ss = (date.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },
    getTopic(data, type) {
      var _this = this
      _this.anyData = data
      if (type == 1) {
        _this.singleData.danxfs = _this.$route.query.data.danxfs
        _this.doubleData.duoxfs = _this.$route.query.data.duoxfs
        _this.opinionData.pandfs = _this.$route.query.data.pandfs
      } else {
        _this.singleData.danxfs = _this.anyData[0].danxfs
        _this.doubleData.duoxfs = _this.anyData[0].duoxfs
        _this.opinionData.pandfs = _this.anyData[0].pandfs
      }
      for (let i = 0; i < _this.anyData.length; i++) {
        if (type == 1) {
          _this.anyData[i].zid = _this.anyData[i].Id
          delete _this.anyData[i].Id
        }
        if (_this.anyData[i].dalx == '单选') {
          _this.singleData.push(_this.anyData[i])
        } else if (_this.anyData[i].dalx == '多选') {
          _this.doubleData.push(_this.anyData[i])
        } else {
          _this.opinionData.push(_this.anyData[i])
        }
      }
    },
    isChecked(name, da) {
      var temp = document.getElementsByName(name.zid)
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].value == da) {
          temp[i].checked = true
        }
      }
    },
    isCheckedes(name, da) {
      var temp = document.getElementsByName(name.zid)
      // console.log(temp, da, '被选中选项')
      for (let i = 0; i < temp.length; i++) {
        // da.split('')
        var daList = da.split('')
        for (let k = 0; k < daList.length; k++) {
          if (temp[i].value == daList[k]) {
            temp[i].checked = true
          }
        }
        // console.log(temp[i].value, daList)
      }
    },
    query() {
      // console.log(this.$route.query.data, 33)
      var _this = this,
        lxbh = this.$route.query.data.lxbh,
        danxt = this.$route.query.data.danxt,
        duoxt = this.$route.query.data.duoxt,
        pandt = this.$route.query.data.pandt,
        idd = '',
        params = {},
        url = ''

      if (this.$route.query.pType == 'paper') {
         this.isReadOnly = true
        if (this.$route.query.data.mysjid == 1) {
          this.disabled = true
          idd = this.$route.query.data.Id
          url =
            '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_Examination&appId=WeChat&Type=getMyPaper'
          params = {
            id: idd
          }
          this.util.post(url, params, function(res) {
            if (res.status) {
              _this.getTopic(res.data.data, 0)
              _this.daData = JSON.parse(res.data.data[0].anData)
              for (let i = 0; i < _this.anyData.length; i++) {
                for (let k = 0; k < _this.daData.length; k++) {
                  if (_this.anyData[i].zid == _this.daData[k].zid) {
                    setTimeout(function() {
                      _this.daData[k].type == 1
                        ? _this.isChecked(_this.anyData[i], _this.daData[k].da)
                        : _this.isCheckedes(
                            _this.anyData[i],
                            _this.daData[k].da
                          )
                    }, 300)
                  }
                }
              }
            }
          })
        } else {
          url =
            '/admin/appAgentAction!runAgent.action?agentId=Agent_U020_Index_Data_Leader'
          params = {
            operateType: 'getCode', //这个固定死的
            sjid: this.$route.query.data.sjid, // 就是查出来的试卷ID
            czyid: this.$route.query.data.AddName, //这个传的值 是 AddName
            star: '1', //固定的
            end: '1' //固定的
          }
          this.util.post(url, params, function(res) {
            if (res.status == true) {
              //  console.log(res.data[0].code)
              //  console.log(res)
              $('#paperTaxt').html(res.data[0].code)
              $('.test_content_nr_tt i').append('<span>.</span>')
              $('.cptWrap').css({
                'padding': '0 10px 10px',
                'text-align': 'left'
              })
              $('.test_content_nr_main').css({
                'font-weight':'600',
                'display': 'inline-block',
                'margin-right': '10px'
              })
               $('.test_content').css({
                'margin-bottom': '10px',
                'border-bottom': '1px solid #f2f2f2',
                'font-size': '16px'
              })
              var span=document.getElementsByTagName("span");
              // console.log(span)
               var spanLength=span.length;
               var oSpan;
              //  var oReg=new RegExp("^spanid.*?$");
              for(var i=0;i<spanLength;i++){
                 oSpan=span[i]; 
                if(oSpan.id.indexOf('spanid')!==-1) {
                   oSpan.style.display='block';
                   oSpan.style.color='#ff0000';
                }
              }
            }
          })
        }
      } else {
        var time =
          Date.parse(new Date()) + this.$route.query.data.dtsc * 60 * 1000
        this.time1 = this.dateFormat(time)
        // if (this.$route.query.data.lx2) {
        //   url =
        //     '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_Examination&appId=WeChat&Type=getmistakes'
        // }
        url =
          '/admin/appAgentAction!runAgent.action?agentId=Agent_Wechat_Examination&appId=WeChat&Type=gettestQuestionA'
        params = {
          danxt: danxt,
          duoxt: duoxt,
          pandt: pandt,
          lxbh: lxbh,
          start: 1
        }
        this.util.get(url, params, function(res) {
          // console.log(res, 22)
          _this.getTopic(res.data.data, 1)
        })
      }
    },
    getData() {
      var _this = this,
        subForm = {
          subFormId: 'subForm1',
          subFormForeignKey: 'pid',
          subFormTable: 'U020_WX_KS_det'
        },
        subFormData = []

      _this.mainFormData.mysjid = this.$route.query.data.Id
      _this.mainFormData.danxfs = _this.singleData.danxfs
      _this.mainFormData.duoxfs = _this.doubleData.duoxfs
      _this.mainFormData.pandfs = _this.opinionData.pandfs
      _this.mainFormData.dtfs = this.normal
      for (let i = 0; i < this.anyData.length; i++) {
        delete _this.anyData[i].AddName_CN
        delete _this.anyData[i].AddName
        delete _this.anyData[i].Company
        delete _this.anyData[i].DepartName
        delete _this.anyData[i].subCompany
        delete _this.anyData[i].Organization
        delete _this.anyData[i].DocCreated
        delete _this.anyData[i].sortid
        for (let k = 0; k < _this.ansData.length; k++) {
          if (_this.anyData[i].zid == _this.ansData[k].zid) {
            _this.anyData[i].xz = _this.ansData[k].da
          }
        }
      }
      // console.log(_this.anyData,99)
      // console.log(_this.anyData)

      _this.mainFormData.ansData = _this.ansData
      subForm.data = JSON.stringify(_this.anyData)
      subFormData.push(subForm)
      var params = {
        sqlTableName: _this.details.sqlTableName,
        mainFormData: JSON.stringify(_this.mainFormData),
        // filesData: JSON.stringify(filesData),
        subFormData: JSON.stringify(subFormData)
      }
      if (this.validUtil.isNotEmpty(this.Id)) {
        params['id'] = this.Id
        params['businessKey'] = this.Id
      }
      params['symbol'] = this.details.symbol
      params['formId'] = this.details.formId
      params['appId'] = this.details.appId
      return params
    },
    checklis(name, fs) {
      var temp = document.getElementsByName(name.zid),
        da = ''
      for (let i = 0; i < temp.length; i++) {
        // name.isno = name.lxbh
        if (!temp[i].checked) {
        } else {
          da += temp[i].value
          if (name.da !== temp[i].value) {
            name.wrong = 1
            // if (this.$route.query.lx == 'ct') {
            //   name.isno = 'ct'
            // }
            // this.wrongData.push(name)
            // this.wrongNum += 1
          } else {
            delete name.wrong
            this.normal += Number(fs)
            // if (this.$route.query.lx == 'ct') {
            //   name.isno = name.lxbh
            // }
            // this.wrongNum = this.wrongNum
          }
        }
        // console.log(name.da, temp[i].value)
      }
      this.ansData.push({ zid: name.zid, da: da, type: 1 })
    },
    checklises(name, fs) {
      var temp = document.getElementsByName(name.zid),
        da = ''
      for (let i = 0; i < temp.length; i++) {
        // name.isno = name.lxbh
        if (!temp[i].checked) {
          name.wrong = 1
        } else {
          da += temp[i].value
          if (name.da !== da) {
            name.wrong = 1
            // if (this.$route.query.lx == 'ct') {
            //   name.isno = 'ct'
            // }
          } else {
            delete name.wrong
            this.normal += Number(fs)
            // if (this.$route.query.lx == 'ct') {
            //   name.isno = name.lxbh
            // }
          }
          // { zid: name.zid, da: da, type: 0 }
        }
      }
      this.ansData.push({ zid: name.zid, da: da, type: 0 })
    },
    saveData() {
      for (let i = 0; i < this.singleData.length; i++) {
        this.checklis(this.singleData[i], this.singleData.danxfs)
      }
      for (let i = 0; i < this.doubleData.length; i++) {
        // console.log(this.doubleData)
        this.checklises(this.doubleData[i], this.doubleData.duoxfs)
      }
      for (let i = 0; i < this.opinionData.length; i++) {
        this.checklis(this.opinionData[i], this.opinionData.pandfs)
      }
      // console.log(this.normal)
      // console.log(this.anyData, this.ansData)
      var _this = this,
        param = this.getData(),
        url = '/admin/appDefaultFormAction!saveData.action'
      // console.log(param, 123)
      this.util.post(url, param, function(res) {
        // alert(res.msg)
        if (res.success == true) {
          _this.util.alert('考试分数' + _this.mainFormData.dtfs + '分')
          _this.cancelCallback()
        } else {
          _this.util.alert(res.msg)
        }
      })
    },
    cancelCallback() {
      if (this.validUtil.isNotEmpty(this.Id)) {
        this.$router.back(-1)
      } else {
        //WeixinJSBridge.call('closeWindow');
        history.back()
        //this.$router.back(-1)
      }
    }
  },
  watch: {},
  deactivated() {
    this.$destroy(true)
  },
  data() {
    return {
      time1: '',
      disabled: false,
      monthQueryFlag: 0,
      normal: 0,
      isReadOnly: false,
      pageSize: 10 - 1,
      details: {
        formId: 'DForm_U020_WX_KS',
        symbol: 'sn,KSFB',
        sqlTableName: 'U020_WX_KS',
        appId: 'U020'
        // reportMonth: ''
      },
      singleData: [],
      doubleData: [],
      doubleDa: '',
      opinionData: [],
      // wrongNum: 0,
      // wrongData: [],
      anyData: [],
      ansData: [],
      daData: [],
      mainFormData: {
        sn: '',
        mysjid: '',
        ansData: [],
        dtfs: 0,
        kssj: ''
      },
      selectProjModel: {
        selectProjVisible: false,
        projectName: '选择项目',
        projUid: '',
        moduleType: 'progressProj'
      },
      monitorModel: {
        Id: ''
      }
    }
  },
  components: {
    Group,
    CellBox,
    Datetime,
    XTextarea,
    Clocker
  }
}
</script>
<style>
.cptWrap .weui-cells.vux-no-group-title {
  margin-top: 0;
  margin-bottom: 75px;
}
.wrap-type .weui-cell.vux-tap-active.weui-cell_access {
  padding: 0;
}
.cptWrap a.weui-cell {
  width: 100%;
  padding: 0;
  color: #54aac4;
}
.cptWrap a.weui-cell p {
  margin: 0;
}
</style>

<style lang="less" scoped>
.btns p {
  z-index: 5;
}
.choose {
  font-size: 14px;
}
.weui-cells {
  font-size: 14px;
}
.fz-red {
  color: red;
}
.pr20 {
  padding-right: 20px;
}
.weui-cell {
  padding: 10px;
}
.cptWrap {
  font-size: 14px;
}
div[class^='wrap'] {
  //   padding-left: 10px;
  font-size: 14px;
  // display: flex;
  width: 100%;
  text-align: left;
  .weui-cell {
    padding: 0;
  }
}
.field {
  // color: #54aac4;
  padding-right: 15px;
  label input {
    margin: 4px 5px 0;
  }
}
.val {
  flex: 1;
  text-align: right;
}
.wrap-type {
  .vux-cell-box {
    width: 100%;
  }
  .weui-cell.vux-tap-active {
    padding: 0;
  }
}
</style>
