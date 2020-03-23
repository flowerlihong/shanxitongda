<template>
  <div class="CheckOutWork-box">
	  <div class="choose" style="height:100%;overflow:hidden">		
	<div style="width: 100%;height: 55%;" id="container">
	</div>
	<div style="width: 100%;height:45%;">
		
	   <div style="height:100%;overflow:auto">
	        
			<div class="price" style="text-align:left;">
				<span  style="padding-left: 10px">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
				<input v-model="remark"  style="padding-right: 20px;width: 76%;"  placeholder="请输入备注" type="text">
			</div>
			<div class="price" style="text-align:left;">
				<span style="padding-left: 10px">客户名称：</span>
				<input v-model="client"  style="padding-right: 20px;width: 76%;"  placeholder="请输入客户名称" type="text">
			</div>
			<div class="weui-cell weui-cell_select myCell no-line" style="border-top: 1px solid #eee;padding-left: 10px"> 
				<div class="weui-cell__hd"><span>通知人</span></div>
				<div class="weui-cell__bd myCell-bd" @click="selectNotifier()">
					<span style="line-height: 28px;padding-right: 0px;">{{notifierModel.userName}}</span>
				</div>
			</div>
			<div class="CheckOutWork-box1" style="border-top: 1px solid #eee;">
			<Attachment :model="attachmentModel"></Attachment>
			</div>
	   </div>
 
	   <div class="footer">
			<p>
			<x-button @click.native="locationAgain()" mini style="width:48%;height: 46px;background: #336699;" type="primary">重新定位</x-button>
			<x-button id="mybutton" @click.native="registerClick()" mini style="width:48%;height: 46px;" type="primary">打卡</x-button>
			</p>
		</div>
	</div>

  </div>

  		<!--选择通知人-->
		<mt-popup v-model="notifierModel.visible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectUser :userModel="notifierModel" ref="profile" ></SelectUser>
		</mt-popup>
  </div>
</template>


<script>
//import AMap from "http://webapi.amap.com/maps?v=1.3&key=fe204db692e01127e0a74bf92a4d4964"
import Amap from '@/public/js/amap.js?v=1.3&key=fe204db692e01127e0a74bf92a4d4964';
// import AMap from 'vue-amap';
import { XButton } from 'vux'
	
import SelectUser from '../../common/SelectUser.vue'
import { mapState, mapActions } from 'vuex'
import Attachment from '../../common/Attachment.vue'
var map;
var markers=[];
var geocoder;
export default {
  name: 'legwork',
  data () {
    return {
		zoom: 15,
      	center: [116.397428,39.90923],
		curLat:'', //当前位置维度
		curLng:'',  //当前位置经度
		remark:'',  // 备注
		client:'',
		attachmentModel: {
			title: '现场照片',
			sourceType:['camera'],
			xtype:"sign",
			fileList: [],
			deleteFilesList: []
		},
		notifierModel:{
			visible:false,
			userName:"",
			userUid:""
		},
		id:''
		
    }
  },
  components:{
	Attachment,SelectUser,XButton
  },
  computed: {
  	...mapState({
  		userId: state => state.userId,
  		userName: state => state.userName,
  		avatar: state => state.avatar

  	}),
  },
  created(){
		this.locationAgain(); //获取位置
  },
  activated(){
	  	this.util.init(this);
		
  },
  mounted() {
			this.init();
  },
  methods: {
	  init(){
		  	var _this = this;
			var location="116.397428,39.90923";
			var locations = location.split(",");
			map = new AMap.Map('container', {
				center: [locations[0],locations[1]],
				resizeEnable: true,
				zoom: 16
			});
			AMap.plugin('AMap.Geocoder',function(){
				geocoder = new AMap.Geocoder({
					//city: "010"//城市，默认：“全国”
				});
			});

	  },
	  selectNotifier(){
		  this.notifierModel.visible = true;
		//   this.$refs.profile.postMsg({singer:true,radioCheckedArr:[]})
	  },
  	//重新定位
	locationAgain(){
		var _this = this;
		this.wx.getLocation({
		    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
		    success: function (res) {
		        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
		        var longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
		        var speed = res.speed; // 速度，以米/每秒计
		        var accuracy = res.accuracy; // 位置精度
				var lnglat = new AMap.LngLat(longitude,latitude);
				AMap.convertFrom(lnglat,"gps",function(status,result){
						
						var latlng = result.locations[0];
						map.setCenter(latlng);
						//保存坐标
						_this.curLat = latlng.getLat();//当前高德维度
						_this.curLng = latlng.getLng();//当前高德经度

						var marker = new AMap.Marker({
							map: map,
							position : [_this.curLng,_this.curLat]
						});
						//设置当前位置
						var size = new AMap.Size(40,45);
						var markerIcon = new AMap.Icon({
							size: size,
							image: _this.avatar,
							imageSize: size
						});
						marker.setIcon(markerIcon);
						//清空数组
						for(var i=0;i<markers.length;i++){
							markers[i].setMap(null);
						}
						//添加数据
						markers.push(marker);
					}
				);
				
				
		    }

		});
	},
	//打卡
	registerClick(){
		var _this = this;
		if(this.remark==""&&this.client==""){
			this.util.alert('备注和客户名称不能同时为空！');
			return;
		}
		if(!this.validUtil.isNotEmpty(this.notifierModel.userUid)){
			this.util.alert('请选择通知人！');
			return;
		}
		if(this.attachmentModel.fileList.length==0){
			this.util.alert('请上传现场图片！');
			return;
		}
		if(""==this.curLat||""==this.curLng){
			this.util.alert('正在获取当前位置，请稍后打卡');
			return;
		}
		
		//遍历附件
		var filesData = new Array();
		for (var i=0; i<this.attachmentModel.fileList.length;i++) {
			var file = this.attachmentModel.fileList[i];
			if (file.isNewFlag) {
				filesData.push(file);
			}
		}
		var fileDataJson = JSON.stringify(filesData);
		var location=this.curLng+","+this.curLat;
		var lnglat = new AMap.LngLat(this.curLng,this.curLat);
		this.util.mask("正在保存..");
		geocoder.getAddress(lnglat,function(status,result){
			if(status=='complete'){
				var address = result.regeocode.formattedAddress;
				var mainData = {CHECK_LOCATION_:location,CHECK_ADDRESS_:address,CHECK_REMARK_:_this.remark,
					CHECK_COMPANY_:_this.client,CHECK_NOTIFIER_:_this.notifierModel.userUid};
				var	params = {filesData: fileDataJson,deleteFilesData: _this.attachmentModel.deleteFilesList.join(","),remark:_this.remark,client:_this.client,
							mainFormData:JSON.stringify(mainData),sqlTableName:"T_CHECK_OUT_RECORD",notifierUid:_this.notifierModel.userUid
					};
				//保存数据
				_this.util.post("/admin/appDefaultFormAction!saveData.action",params,function(res){
					_this.util.unmask();
					if(res.success){
						_this.sendMsg(_this.notifierModel.userUid,result.msg);
						_this.util.successToast("保存成功！");
						_this.attachmentModel.fileList=[];
						_this.attachmentModel.deleteFilesList=[];
						_this.notifierModel.userUid="";
						_this.notifierModel.userName="";
						_this.remark='';
						_this.client='';
						history.back();
					}else{
						_this.util.alert(res.msg);
					}
					
				});
			}else{
				_this.util.unmask();
				_this.util.alert('获取当前地址失败,请稍后重试！');
				
			}
		});
		
		
		
	},
	sendMsg(sendMsgUsersIds,businessId){
		var _this=this;
		var param = {
				operateType:'sendMsg',
				title:"["+new Date().format("yyyy年MM月dd日hh:mm")+"]外勤通知",
				description:this.userName+"的外勤已经通知给您，点击查看",
				sendMsgUsers:sendMsgUsersIds,
				businessId:businessId,
				state:"checkOutShow",
				createUser:this.userId,
				checkDate:new Date().format("yyyy-MM-dd")
		};
		this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",param,function(res){
			if (res.status != 200) {
				_this.util.failueToast("发送消息失败");
			}
		});
	}
	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only #C8E49D-->
<style lang="scss" scoped>
.jr-wx-Button{
	    content: " ";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid rgba(0,0,0,.2);
    transform: scale(.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
}
.price{
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
	// border-bottom: 1px solid #eee;
}
.price input {
	height: 40px;
	padding-top: 10px;
	text-align: left;
}
	.sign {
		padding: 6px;
		// background: #42D885;
		background: #339999;
		font-size: 15px;
		line-height: 20px;
		height: 21%;
		color:#fff;
		margin: 0 auto;	
	}
	.sign-had{
		display: inline-block;
		text-align: left;
	}
	.sign-had>div{
		margin: 0.1rem 0;
	}
	.CheckOutWork-box{
		height: 100%;
		padding-bottom:56px;
	}
	.footer{
	position: fixed;
    width: 100%;
    bottom: 0;
	}
	.weui_label{
		margin-bottom:0;
	}
	.imgsLoad{
		
	}
</style>

<style>
.CheckOutWork-box1 .imgsLoad{
	height: 57px;
	overflow: auto;
}
</style>
