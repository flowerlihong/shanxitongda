<template>
  <div class="choose">
      <group>
        <cell-box v-for="val in planList" :key="val.Id" @click.native="edit(val.Id)">          
          <flexbox>
            <!-- <flexbox-item :span="1" >
              <icon type="success" v-if="val.ifUpload=='是'"></icon>
              <icon type="circle" v-if="val.ifUpload=='否'"></icon>
              </flexbox-item> -->
            <flexbox-item>
              <div class="info-proName">
                  {{val.stageName}}
              </div>
              <flexbox>
                <flexbox-item>
                  <span class="info-field">责任人:</span>
                  <span class="info-val">{{val.dutyUserName}}</span>
                </flexbox-item>
                <flexbox-item>
                  <span class="info-field">权重:</span>
                  <span class="info-val">{{val.nodeWeight}}</span>
                </flexbox-item>         
              </flexbox>
              <flexbox>
                <flexbox-item>
                  <span class="info-field">投入天数:</span>
                  <span class="info-val">{{val.nodeDays}}</span>
                </flexbox-item>
                <flexbox-item>
                  <span class="info-field">完成占比:</span>
                  <span class="info-val">{{val.realCompletePrecent}}</span>
                </flexbox-item>         
              </flexbox>
             
            </flexbox-item>
            <!-- <flexbox-item :span="2"><span :class="val.ifUpload =='是'?'editBtn':'editBtn btn-forbid'"  @click.stop="val.ifUpload =='是'?edit(val.Id):''">编辑</span></flexbox-item> -->
          </flexbox>
        </cell-box>
      </group>
      <div class="btns">
		  <p style="background-color:rgb(239, 239, 239);   margin: 0px;padding-bottom: 15px;   
		  			 position: fixed;width: 100%;bottom: 0px;">
				<button  style="width:48%;height: 45px;line-height: 45px;border: 1px solid #ccc;"
						@click="cancelCallback()" class="weui-btn weui-btn_mini weui-btn_default">取消</button>
				<button  style="width:48%;height: 45px;line-height: 45px;" @click="query('init')" 
						class="weui-btn weui-btn_mini weui-btn_primary">初始化</button>
				
	 	  </p>
	  </div> 
  </div>
</template>

<script>
import {  
  Group,
  CellBox,
  Icon,
  XButton,
  Flexbox,
  FlexboxItem
} from "vux";
export default {
  created(){
    this.util.init(this);
    this.query("query") 
  },
  activated(){
    this.util.unmask();
  },
  deactivated(){
      this.$destroy(true)
  },
  methods:{
    query(state){
      let Id = this.$route.query.Id;
      let xmid = this.$route.query.xmid;
      var _this = this;
      if(state ==="init"){        
        if(this.$route.query.AddName !=this.sessionUtil.getUserId()){          
          this.util.alert("您没有操作权限！");
          return;
        }
      }
      this.util.post("/admin/appAgentAction!runAgent.action",{
        agentId:"Agent_WeChat_Project_Init_Report",
        type:"projectReport",
        projectReportId:Id,
        xmid,
        state
      },function(res){
        _this.planList = res.data;
        if(res.status == true){
          _this.planList = res.data;
         // console.log(res)
        }
      })
    },
    edit(Id){
      this.util.gotoByName("prgReportDetail",{Id:Id})
    },
    cancelCallback() {
      if (this.validUtil.isNotEmpty(this.Id)) {
        this.$router.back(-1);
      } else {
        //WeixinJSBridge.call('closeWindow');
        history.back();
        //this.$router.back(-1)
      }
    }
  },
  data(){
    return{
      planList:[
      ]
    }
  },
  components:{
    Group,CellBox,Icon,XButton,
      Flexbox,
      FlexboxItem
  }
}
</script>
<style>
.choose .weui-cells.vux-no-group-title {
  margin-top: 0;
}
</style>
<style lang="less" scoped>
.choose{
  font-size: 14px;
  
}
.flex-demo {
  text-align: center;
  color: #fff;
  background-color: #20b907;
  border-radius: 4px;
  background-clip: padding-box;
}
.weui-cell{
  padding: 10px 15px;
  font-size: 14px;
}
.weui-cells{
  font-size: 14px;
}
.editBtn{
  width: 100%;
  height:1rem;
  line-height:1rem;
  background-color: rgb(73, 202, 241);
  color:#fff;
  border-radius: 5px;
  font-size: 12px;
  display: inline-block;
  text-align: center;
}
.info-proName{
  color: #8994d2;
  font-size: 16px;
}
.info-field{
  color: #999;
  width: 5em;
  display: inline-block;
   text-align: justify;   
}
// .info-field::after{
//      content: '';
//   display: inline-block; 
//   padding-left: 100%;
//    }
.info-val{
  color: #4a9ab1;
}
.cell-wrap{
  width: 100%;
}
.btn-forbid{
  background-color: #bbb;
}
</style>


