<template>
  	<div class="page__bd">
        <div  style="text-align: left;margin-top: 0px;">
            <a class="weui-cell weui-cell_access price" @click="editclassName()" href="javascript:;">
                <div class="weui-cell__bd"><p>班次名称</p></div>
                <div class="weui-cell__ft">{{classData.name}}</div>
            </a>

        </div>
        <!-- <div class="weui-cells__title" style="text-align: left;">考勤时段</div> -->
        <div style="text-align: left;border-bottom: 1px solid #eee; " >
            <a class="weui-cell weui-cell_access" @click="editTimeFrame" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>考勤时段</p>
                </div>
                <div class="weui-cell__ft">{{classData.signTime}}~{{classData.signOutTime}}</div>
            </a>

        </div>
        <div style="text-align: left;margin-top: 0px;border-bottom: 1px solid #eee;" >
            <div class="weui-cell weui-cell_access" @click="selectCheckDate()" >
                <div class="weui-cell__bd"><p>考勤日期</p></div>
                <div class="weui-cell__ft">{{classData.checkDayName}}</div>
            </div>
            <div class="weui-cell weui-cell_access" @click="openOrgPopup()">
                <div class="weui-cell__bd">
                    <p>人员</p>
                </div>
                <div class="weui-cell__ft">{{classData.memberStr!=undefined&&classData.memberStr.length>15? classData.memberStr.substring(0,15)+'...':classData.memberStr}}</div>
            </div>
            <div class="weui-cell weui-cell_access" @click="choosePoint()" >
                <div class="weui-cell__bd"><p>关联考勤点</p></div>
                <div class="weui-cell__ft">{{classData.pointName}}</div>
            </div>
 
        </div>
       
    <div class="page__bd page__bd_spacing" style="margin-top:15px">
        <p>
            <x-button @click.native="close()" mini style="width:48%;height: 45px;border: 1px solid #ccc;" type="default">取消</x-button>
			<x-button @click.native="saveClass()" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
        </p>

    </div>
    <!--编辑班次名称弹窗-->
    <div v-transfer-dom>
      <popup v-model="editClassNameVisible" position="bottom" max-height="50%">
        <div>
          <div>
            <p style="text-align: center;padding-top: 10px;">编辑班次名称</p>
            <div style="text-align:left;background: #fff;height: 163px;">
                <x-textarea :max="500" style="width: 100%;" v-model="className" placeholder="请输入班次名称" ref="content"></x-textarea>
            </div>
          </div>
          <nav class="navbar navbar-default navbar-fixed-bottom" style="padding-bottom: 6px;padding-left: 8px;">
            <x-button @click.native="closeDialog()" mini style="width:48%;height: 38px;background:#ccc" type="default">取消</x-button>
			<x-button @click.native="saveClassName()" mini style="width:48%;height: 38px;" type="primary">确定</x-button>
          </nav>
        </div>
      </popup>
    </div>
    
    <!-- 添加时段 popup -->
     <div v-transfer-dom>
      <popup v-model="editTimeFramePopup" position="left" width="100%">
          <div class="addUser">
           <div class="weui-cells" style="text-align: left;">
                <a class="weui-cell weui-cell_access" href="javascript:;">
                    <div class="weui-cell__bd">
                        <p>上班</p>
                    </div>
                    <div class="weui-cell__ft"><input class="weui-input" type="time" id="onDutyTime" :value="classData.signTime" /></div>
                    
                </a>
            </div>
            <div class="weui-cells" style="text-align: left;">
                <a class="weui-cell weui-cell_access" href="javascript:;">
                    <div class="weui-cell__bd">
                        <p>下班</p>
                    </div>
                    <div class="weui-cell__ft"><input class="weui-input" type="time" id="offDutyTime" :value="classData.signOutTime" /></div>
                </a>
            </div>
          </div>
          <nav class="navbar navbar-default navbar-fixed-bottom" style="padding-bottom: 17px;padding-left: 10px;">
            <x-button @click.native="closeTimeFramePopup()" mini style="width:48%;height: 45px;background:#ccc" type="default">取消</x-button>
			<x-button @click.native="saveTimeFrame()" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
          </nav>
      </popup>
    </div>
    <!--选择考勤点-->
    <mt-popup v-model="pointObj.popupVisible" position="right"
        popup-transition="popup-fade" style="width:100%;height:100%">
        <ChoosePoint :mess="pointObj" @choosePoint="handelPoint($event)"></ChoosePoint>
    </mt-popup>
    <!--选择考勤人员-->
	<mt-popup v-model="userModel.visible" position="right"
        popup-transition="popup-fade" style="width:100%;height:100%">
        <SelectUser :userModel="userModel" ref="profile" @selectUsersCallBack="selectUsers($event)"></SelectUser>
	</mt-popup>
     <!-- 考勤日期 popup -->
     <div v-transfer-dom style="background:#fff">
      <popup v-model="checkDateVisible" position="left" width="100%">
          <div style="background:#fff">
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">每周一</div>
                <mt-switch class="rt" v-model="classData.monday"></mt-switch>
            </div>
           <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">每周二</div>
                <mt-switch class="rt" v-model="classData.tuesday"></mt-switch>
            </div>
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">每周三</div>
                <mt-switch class="rt" v-model="classData.wednesday"></mt-switch>
            </div>
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">每周四</div>
                <mt-switch class="rt" v-model="classData.thursday"></mt-switch>
            </div>
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">每周五</div>
                <mt-switch class="rt" v-model="classData.friday"></mt-switch>
            </div>
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">每周六</div>
                <mt-switch class="rt" v-model="classData.sat"></mt-switch>
            </div>
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">每周日</div>
                <mt-switch class="rt" v-model="classData.weekday"></mt-switch>
            </div>
          </div>
          <nav class="navbar navbar-default navbar-fixed-bottom" style="padding-bottom: 17px;padding-left: 10px;">
            <x-button @click.native="closeCheckDayPopup()" mini style="width:48%;height: 45px;border: 1px solid #ccc;" type="default">取消</x-button>
			<x-button @click.native="saveDay()" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
          </nav>
      </popup>
    </div>
</div>
    
</template>

<script>
import { XSwitch,TransferDom, Popup, Group,XButton,XTextarea} from 'vux'
import {mapGetters, mapActions} from 'vuex'
import SelectUser from '../common/SelectUser.vue'
import ChoosePoint from './ChoosePoint.vue';
import { Switch } from 'mint-ui';
export default {
  name: 'classEdit',
  components: {
    ChoosePoint,SelectUser,XButton,
    XSwitch,TransferDom,Popup,MtSwitch:Switch,
    Group,XTextarea
  },
  directives: {
     TransferDom
  },
  data () {
    return {
        editTimeFramePopup:false,
        editClassNameVisible:false, //编辑班次名称
        className:'',
        pointObj:{
            popupVisible:false
        },
        timeFrameNameVisible:false, //编辑时段名称
        userModel:{
            visible:false,
            userName:'',
            userUid:'',
            users:[]
        },
        ifChooseMember:false,
        checkDateVisible:false,
        onDuty:true,  //上班打卡
        offDuty:true,  //下班打卡
        onDutyTime:'08:30',
        offDutyTime:'18:00',
        classData:{memberStr:'',member:[]}
    }
  },
  created(){
        
		
  },
  activated(){
        this.classData = this.$route.query.classData;
        
  },
  methods: {
    selectCheckDate(){
        this.checkDateVisible = true;
    },
    closeCheckDayPopup(){
        this.checkDateVisible = false;
    },
    close(){
        window.history.back();
    },
    saveDay(){
        
        if(this.classData.monday&&this.classData.tuesday&&this.classData.wednesday&&this.classData.thursday&&this.classData.friday&&this.classData.sat&&this.classData.weekday){
            this.classData.checkDayName="每天";
        }else if(this.classData.monday&&this.classData.tuesday&&this.classData.wednesday&&this.classData.thursday&&this.classData.friday&&!this.classData.sat&&!this.classData.weekday){
            this.classData.checkDayName="工作日";
        }else{
            var monday = this.classData.monday? '周一,':'';
            var tuesday = this.classData.tuesday? '周二,':'';
            var wednesday = this.classData.wednesday? '周三,':'';
            var thursday = this.classData.thursday? '周四,':'';
            var friday = this.classData.friday? '周五,':'';
            var Sat = this.classData.sat? '周六,':'';
            var weekday = this.classData.weekday? '周日,':'';
            var checkDayName = monday+tuesday+wednesday+thursday+friday+Sat+weekday;
            this.classData.checkDayName = checkDayName.substring(0,checkDayName.length-1);
        }
        this.checkDateVisible=false;
    },
  	//编辑时段
	editTimeFrame(){
		this.editTimeFramePopup=true;
	},//编辑班次名称
    editclassName(){
        this.className = this.classData.name;
        this.editClassNameVisible=true;
    },
    closeDialog(){
        this.editClassNameVisible=false;
    },
    saveClassName(){
        this.classData.name = this.className;
        this.editClassNameVisible=false;
    },
    openTimeFrameDia(){
        this.timeFrameNameVisible=true;
    },
    closeTimeFrameDialog(){
        this.timeFrameNameVisible = false;
    },
    choosePoint(){
        this.pointObj.popupVisible=true;
           
    },
    handelPoint(data){
        this.classData.pointId = data.pointId;
        this.classData.pointName=data.pointName;
    },
	//关闭编辑时段框
	closeTimeFramePopup(){
		this.editTimeFramePopup=false;
	},
    chooseClassDate(){

    },
    saveClass(){
        this.util.mask("正在保存..");
        var _this = this;
        
        //考勤成员
        var subFormList =[];
        var memberData =[];
        var memberUidArr= new Array();
        if(this.validUtil.isNotEmpty(this.classData.memberList)){
            for (let i=0,len=this.classData.memberList.length; i<len; i++) {
                var item = {
                    USER_NAME_: this.classData.memberList[i].userName,
                    USER_UID_: this.classData.memberList[i].id,
                }
                memberUidArr.push(this.classData.memberList[i].id);
                memberData.push(item);
            }
        }
        
        var memberDataStr = JSON.stringify(memberData);
        
        var memberSubForm ={subFormForeignKey:"CLASS_UID_",subFormTable:"T_CHECK_CLASSES_USER",data:memberDataStr};
        subFormList.push(memberSubForm);

        var mainData = {name_:this.classData.name,TIME_FRAME_NAME_: this.classData.timeFrameName,sign_time_:this.classData.signTime,sign_out_time_:this.classData.signOutTime,
			point_id_:this.classData.pointId,POINT_NAME_: this.classData.pointName,MONDAY_:this.classData.monday? 1:0,
            TUESDAY_: this.classData.tuesday? 1:0, WEDNESDAY_:this.classData.wednesday? 1:0,THURSDAY_:this.classData.thursday? 1:0,
            FRIDAY_: this.classData.friday? 1:0,SAT_:this.classData.sat? 1:0,WEEKDAY_: this.classData.weekday? 1:0,CHECK_DAYNAME_: this.classData.checkDayName
        };
        var param={mainFormData:JSON.stringify(mainData), sqlTableName:"T_CHECK_CLASSES",subFormData:JSON.stringify(subFormList),memberUidStr:memberUidArr.join(",")};
        
        if(this.classData.id!=null){
            if(this.ifChooseMember){
                param={mainFormData:JSON.stringify(mainData), sqlTableName:"T_CHECK_CLASSES",subFormData:JSON.stringify(subFormList),memberUidStr:memberUidArr.join(","),
                id:this.classData.id,businessKey:this.classData.id};
            }else{
                param={mainFormData:JSON.stringify(mainData), sqlTableName:"T_CHECK_CLASSES",memberUidStr:memberUidArr.join(","),
                id:this.classData.id,businessKey:this.classData.id};
            }
           
        }
        this.util.post("/admin/appDefaultFormAction!saveData.action",param,function(res){
                if(res.success){
                    _this.util.unmask();
                    window.history.back();
					_this.$store.state.temp = "loadClass"+_this.classData.name;

                }else{
                    _this.util.unmask();
                    _this.util.alert(data.msg);
                }
        });
			
     
    },
    saveTimeFrame(){
        this.classData.signTime = $("#onDutyTime").val();
        this.classData.signOutTime = $("#offDutyTime").val();
        this.editTimeFramePopup=false;
    },
    openOrgPopup(){
        var _this = this;
        this.userModel.visible = true;	
        var member = this.classData.memberArr;
        this.$refs.profile.postMsg({singer:false,radioCheckedArr:member})
    },
    selectUsers(data){
        
        this.classData.memberStr=this.userModel.userName;
        this.classData.memberList=this.userModel.users;
        
        this.ifChooseMember=true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.price{
	height: 48px;
	line-height: 48px;
	// border-top: 1px solid #eee; 
    border-bottom: 1px solid #eee;
}
</style>
