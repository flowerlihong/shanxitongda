<template>
  <div class="flow" style="width: 95%;margin: auto;margin-top: 5px;margin-bottom: 5px;    padding-bottom: 80px;">
    <div v-show="flowSee" class="flowShow" style="height: 100%;">
      <h5 @click="flowShow">点击查看流程流转明细&nbsp;&nbsp;
        <i class="glyphicon glyphicon-chevron-down"></i>
      </h5>
      <h5 v-if="ifshowCurrentActName"> {{currentActName}}</h5>
    </div>
    <div v-show="flowUnsee" class="flowUnsee">
      <div @click="flowHide" style="text-align:center;padding:5px 0 10px 0;font-size:14px;font-weight:bold;">流程流转明细&nbsp;&nbsp;
        <i class="glyphicon glyphicon-chevron-up"></i>
      </div>
      <div>

        <ul data-role="listview" id="ul_comments" class="ui-listview">

          <li v-for="(item,index) in data" :key="index"  style="border-bottom: 1px #cac2c2 solid;padding-bottom:8px;">
            <!--:style=" item.endTime!=''?'color: #09BB07;':'color: #10AEFF;'"-->
            <a href="javascript:void(0);" class="ui-btn" style="color:#5f5b5b;">
              <div style="width:100%">
                <div class="col-xs-4" style="padding: 0px;padding-left:10px;">{{item.name}}</div>
                <div class="col-xs-6" style="text-align:left;padding: 0px;font-size: 10pt;">{{item.startTime.substring(0,11)+'~'+item.endTime.substring(0,11)}}
                 
                </div>
                <div  class="col-xs-2" style="text-align:right;padding: 0px;">
                  <span  v-if="item.category == '1'"  class="weui-badge" style="background-color: #10AEFF;">抄送</span>
                   <span  v-if="item.category != '1'"  >&nbsp;</span>
                </div>
              </div>
              <div style="padding-left:10px;width:100%;  font-size: 10pt;">
                <strong>{{getContent(item.assignee)+'/'+getContent(item.departName)+'/'+getContent(item.subCompany)}}</strong>
              </div>
              <div style="padding-left:10px;width:100%;">
                <span>{{getComment(item.comment)}}</span>
              </div>

            </a>
          </li>

        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "processMonitor",
  data() {
    return {
      flowSee: true,
      flowUnsee: false,
      stepItems: [],
      commentItems: [],
      data: [],
      active: 0,
      timer: null,
      currentActName: "",
      ifshowCurrentActName: false
    };
  },
  props: ["model"],
  created() {
    console.info("processMonitor--------created---------");
    //console.info(this.model);
    //this.loadData();
    //this.loadData();
  },
  activated() {
    console.info("processMonitor--------activated---------");

    //$("#steps").html("");
    //console.info("----"+$('#steps').html());
    
    
  },

  methods: {
     
    loadData() {
      var _this = this;
      
      _this.data = [];
      if (!this.util.isNotEmpty(this.model.procInstId)) {
        this.model.procInstId = this.util.getUrlParam("procInstId");
      }

            _this.util.unmask();
      //this.util.post('/workflow/getHistoricTask', { procDefId: this.model.procDefId, procInstId: this.model.procInstId }, function (res) {
      this.util.post("/workflow/workflowAction!getHistoricTask.action", { procDefId: this.model.procDefId, procInsId: this.model.procInsId },function(res) {
          if (res != undefined) {
            _this.data = res;
            console.log(_this.data);
            console.info("------------------------");
          }
        }
      );

    },
    updateSteps() {
      var _this = this;
      var children = $("#steps").children();

      //console.info("------updateSteps-------"+children.length);
      if (children.length > 0) {
        //console.info("------可以了-------");
        var divs = $("#steps .el-step__icon");
        for (var i = 0; i < divs.length; i++) {
          var divlist = $(divs[i]).children();
          //console.info(divlist);
          if (divlist[0].tagName == "DIV") {
            $(divlist[0]).html(i + 1);
          }
        }
        //console.info(divs);
        clearInterval(_this.timer);
        _this.timer = null;
      } else {
        //console.info("_this.timer-----"+_this.timer);
        if (_this.timer == null) {
          _this.timer = setInterval(this.updateSteps, 100);
        } else {
          //this.updateSteps();
        }
      }
      //console.info($('#steps'));
    },
    flowShow() {
      this.flowSee = false;
      this.flowUnsee = true;
    },
    flowHide() {
      this.flowSee = true;
      this.flowUnsee = false;
    }, getComment(comment) {
      if (comment) {
        //if(comment.indexof('span')>-1){
        return comment.replace(/<.*?>/ig, "");
        //}
      }
      return comment;
    }, getContent(content) {
      if (content) {
        return content;
      }
      return '';
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.flow {
  .flowShow {
    background: #eee;
    line-height: 2rem;
    padding: 5px 0;
    h4 {
      margin: 5px 0;
    }
    border: 1px solid #d6cece;
  }
  .flowUnsee {
    overflow: hidden;
    background: #eee;
    text-align: left;
    padding: 5px 10px;
    .flowUnseeRt {
      p {
        margin: 0;
        padding: 5px 0 45px 0;
      }
    }
    border: 1px solid #d6cece;
  }
}
</style>
