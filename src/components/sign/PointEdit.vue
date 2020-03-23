<template>
  <div class="page__bd">
    <div  style="text-align: left;margin-top: 0px;">
        <div class="weui-cell weui-cell_select myCell">
            <div class="weui-cell__hd"><span>考勤点名称:</span></div>
            <div class="weui-cell__bd myCell-bd" @click="editPointName()">
                <span>{{pointData.name!=undefined&&pointData.name.length>17? pointData.name.substring(0,17)+'..':pointData.name}}</span>
            </div>
        </div>
        <div class="weui-cell weui-cell_select myCell">
            <div class="weui-cell__hd" style="float:left;margin-right: 10px;"><span>考勤地址:</span></div>
            <div class="weui-cell__bd myCell-bd longDivStyle" @click="editPointAddress()">
                <span class="longStrStyle">{{pointData.address}}</span>
            </div>
        </div>
        
        <div class="price valid" style="text-align:left;">
            <span class="col-xs-5">有效考勤范围:</span>
            <popup-picker title="" :data="rangeArray"  v-model="rangeValue" @on-change="onChange" style="height:48px;"></popup-picker>
        </div>
    </div>
       
    <div class="page__bd page__bd_spacing" style="margin-top:10px;">
        <p>
            <x-button @click.native="close()" mini style="width:48%;height: 45px;border: 1px solid #ccc;" type="default">取消</x-button>
			<x-button @click.native="savePoint()" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
        </p>
        
    </div>
    <!--编辑考勤点名称弹窗-->
    <div v-transfer-dom>
      <popup v-model="editPointNameVisible" position="bottom" max-height="50%">
        <div class="position-horizontal-demo">
          <div class="addsection">
            <p style="text-align: center;padding-top: 10px;">考勤点名称</p>
            <div style="text-align:left;background: #fff;height: 163px;">
                <x-textarea :max="500" style="width: 100%;" v-model="pointName" placeholder="请输入考勤点名称" ref="content"></x-textarea>
            </div>
            <!-- <mt-field label="" style="width:100%" placeholder="请输入考勤点名称" type="textarea" rows="6" v-model="pointName"></mt-field> -->
          </div>
          <nav class="navbar navbar-default navbar-fixed-bottom" style="padding-bottom: 10px;padding-left: 10px;">
            <x-button @click.native="closeDialog()" mini style="width:48%;height: 38px;border: 1px solid #ccc;" type="default">取消</x-button>
			<x-button @click.native="savePointName()" mini style="width:48%;height: 38px;" type="primary">确定</x-button>
          </nav>
        </div>
      </popup>
    </div>

    <!--编辑考勤点-->
    <mt-popup v-model="addressObj.addressVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
		<ChooseAddress :address="addressObj" ref="addressfile" @chooseAddress="chooseAddress($event)"></ChooseAddress>
	</mt-popup>
</div>
    
</template>

<script>
import ChooseAddress from '../common/ChooseAddress.vue'
import {mapState,mapGetters, mapActions} from 'vuex'
import { TransferDom, Popup,XButton,PopupPicker,XTextarea } from 'vux'
export default {
  name: 'classEdit',
  data () {
    return {
        editPointNameVisible:false, //编辑考勤点名称
        deletePointBtnVisable: false,
        pointData:{address:''},
        addressObj: {
            addressVisible:false,
            location:''
        },
        pointName:'',
        rangeValue:[],
        rangeArray:[[
                {name: '50米', value: 50}, 
                {name: '100米',value: 100}, 
                {name: '150米',value: 150},
                {name: '200米',value: 200},
                {name: '250米',value: 250},
                {name: '300米',value: 300},
                {name: '350米',value: 350},
                {name: '400米',value: 400},
                {name: '450米',value: 450},
                {name: '500米',value: 500},
                {name: '550米',value: 550},
                {name: '600米',value: 600},
                {name: '650米',value: 650},
                {name: '700米',value: 700},
                {name: '750米',value: 750},
                {name: '800米',value: 800},
                {name: '850米',value: 850},
                {name: '900米',value: 900},
                {name: '950米',value: 950},
                {name: '1000米',value: 1000},
            ]]

    }
  },
  directives: {
    TransferDom
  },
  components:{
      ChooseAddress,Popup,XButton,PopupPicker,XTextarea
  },
  activated(){

        this.pointData = this.$route.query.pointData;
        this.rangeValue = [this.pointData.range];
        this.addressObj.location=this.pointData.location;
		this.deletePointBtnVisable = this.$route.query.isEdit;
  },
  methods: {
  	//编辑考勤点名称
	editPointName(){
        this.editPointNameVisible=true;
        this.pointName=this.pointData.name;
	},
    editPointAddress(){
        this.addressObj.addressVisible=true;
        this.$refs.addressfile.locationAgain(this.addressObj.location,this.pointData.range)
    },
    chooseAddress(data){
        this.pointData.address=data.address;
        this.pointData.location=data.addressLocation;
    },
    close(){
        window.history.back();
    },
    onChange(){
        this.pointData.range=this.rangeValue[0];
    },
    closeDialog(){
        this.editPointNameVisible=false;
    },
    savePointName(){
        this.pointData.name=this.pointName;
        this.editPointNameVisible=false;
    },
    savePoint(){
        var _this=this;
        this.util.mask("正在保存..");
        var mainData = {name_:this.pointData.name,address_:this.pointData.address,range_:this.pointData.range,
			location_:this.pointData.location};
        
        var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"T_CHECK_POINT"};
        if (this.validUtil.isNotEmpty(this.pointData.id)) {
            params['id'] = this.pointData.id;
            params['businessKey'] = this.pointData.id;
        }
        
		this.util.post("/admin/appDefaultFormAction!saveData.action",params,function(data){
            if(data.success){
                _this.util.unmask();
                _this.$router.push({name:'setCheckPoint',query:{refresh:true}});
            }else{
                _this.util.unmask();
                _this.util.alert(data.msg);
            }
        });
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
.price input{
	height: 40px;
	padding-top: 10px;
	text-align: right;
}
.price>span{
	padding: 0 10px;
}
.page__bd{
    overflow: hidden;
}

</style>
<style>
.valid .weui-cell{height:100%}
</style>