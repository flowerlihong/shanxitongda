<template>
  <div class="choose" style="height:100%;overflow:hidden;padding:28px 0 56px;box-sizing:border-box;">	
	<div style="width: 100%;height: 28px;line-height:28px;background:#336699;color: #F1F0F0;font-size: 13px;position:fixed;top:0;" >
		<span class="col-xs-6" style="text-align:left;padding-left: 5px;;padding-right: 0px;">考勤班次：{{checkInfo.className!=undefined&&checkInfo.className.length>9? checkInfo.className.substring(0,8)+'..':checkInfo.className}}</span>
		<span class="col-xs-6" style="text-align:left;padding-right: 0px;">考勤点：{{checkInfo.poinName!=undefined&&checkInfo.poinName.length>9? checkInfo.poinName.substring(0,8)+'..':checkInfo.poinName}}</span>
	</div>
	<div style="width: 100%;height: 62%;" id="container">
		
	</div>
	<div style="width: 100%;height:38%;overflow:hidden;min-height:53px;">
		<div class="sign">
			
			<div class="sign-had">
				<div v-if="hadSign" style="margin:0">签到时间: {{signTime+signStatus}}</div>
				<div v-if="hadSignOut" style="margin:0">签退时间: {{signOutTime+signOutStatus}}</div>
			</div>
	   </div>
	   <div style="height:auto;overflow:hidden">
	        <div class="price" style="text-align:left;">
				<span style="padding-left: 10px">备&nbsp;&nbsp;&nbsp;注：</span>
				<input v-model="remark"  style="padding-right: 20px;"  placeholder="请输入备注" type="text">
			</div>
	        <Attachment :model="attachmentModel"></Attachment>
	   </div>
 
	   <div class="footer">
			
			<x-button @click.native="locationAgain()" mini style="width:48%;height: 46px;background: #336699;margin:0" type="primary">重新定位</x-button>
			<x-button id="mybutton" @click.native="registerClick()" mini style="width:48%;height: 46px;margin:0" type="primary">签到</x-button>
		</div>
	</div>

  </div>
</template>

<script>
// import AMap from 'AMap'
import Amap from '@/public/js/amap.js?v=1.3&key=fe204db692e01127e0a74bf92a4d4964';
import { mapState, mapActions } from 'vuex'
import Attachment from '../../common/Attachment.vue'
import { XButton } from 'vux'
var map;
var markers=[];
var geocoder;
// const wx = require('weixin-js-sdk');
export default {
  name: 'legwork',
  data () {
    return {
		hadSign:false,  //是否已签到
		signTime:'',   //签到时间
		signStatus:'',
		hadSignOut:false,  //是否已签退
		signId:'',  //当天考勤数据Id
		signOutTime:'',  //签退时间
		signOutStatus:'',
		EARTH_RADIUS: 6378137.0, //单位m
		PI : Math.PI,
		checkInfo: {},  //考勤配置信息
		locationLat: '', //考勤点维度
		locationLng: '', //考勤点经度
		curLat:'', //当前位置维度
		curLng:'',  //当前位置经度
		remark:'',  //备注
		attachmentModel: {
			title: '现场照片',
			sourceType:['camera'],
			xtype:"sign",
			fileList: [],
			deleteFilesList: []
		},
		ifBeLate:0,//是否迟到
		leaveEarly:0
		
    }
  },
  components:{
	Attachment,XButton
  },
  computed: {
  	...mapState({
  		userUid: state => state.userUid,
  		userId: state => state.userId,
  		avatar: state => state.avatar

  	}),
  },
  created(){
	  	this.locationAgain(); //获取位置

  },
  activated(){
	  	var _this = this;
		var ifSetingCheck =this.init();
		if(ifSetingCheck){
			return;
		}
		var param = {
			operateType:'getCurrentUserRecord',
			userUid:this.userId
		};
		this.util.mask();
		//获取当天考勤信息
		this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",param,function(res){
			_this.util.unmask();
			if(res.status == 200){
				var data = res.data;
				//console.debug(data);
				if(data!=null&&data!=""){
					_this.signTime = data.signTime.substring(0,5);
					if(data.signStatus==1){
						_this.signStatus="迟到";
					}
					_this.hadSign = true;
					_this.signId = data.id;
					_this.attachmentModel.xtype = "outSign";
					$("#mybutton").html("签退");
				}
				if(_this.validUtil.isNotEmpty(data.signOutTime)){
					_this.hadSignOut = true;
					_this.signOutTime = data.signOutTime.substring(0,5);
					if(data.signOutStatus==1){
						_this.signOutStatus="早退";
					}
					$("#mybutton").html("签到");
				}
			}else{
				_this.util.failueToast(res.errorMsg);
			}
			
			
		});
  },
  mounted() {
			//this.init();
			map = new AMap.Map('container', {
				//center: [locations[0],locations[1]],
				resizeEnable: true,
				zoom: 16
			});
			AMap.plugin('AMap.Geocoder',function(){
				geocoder = new AMap.Geocoder({
					//city: "010"//城市，默认：“全国”
				});
			});
  },
  methods: {
	  init(){
		  	var _this = this;
			//获取考勤点位置
			var location="113.317237,23.154002";
			var param = {
					operateType:'getUserCheckInfo',
					userUid:this.userUid
			};
			this.util.sycnPost("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",param,function(res){
				if(res.status==200){
					_this.checkInfo = res.data;
					location =res.data.location;
				}
				
			});

		  	if(_this.checkInfo==null||JSON.stringify(_this.checkInfo)=="{}"){
				window.history.back();
				this.util.alert("没有关联考勤点，暂时不能打卡，请联系管理员!");
				
				return true;
			}
			var locations = location.split(",");
			this.locationLat =locations[1];
			this.locationLng =locations[0];
		  	// map = new AMap.Map('container', {
			// 	center: [locations[0],locations[1]],
			// 	resizeEnable: true,
			// 	zoom: 16
			// });

			var lnglat = new AMap.LngLat(locations[0],locations[1]);
			map.setCenter(lnglat);
			new AMap.Circle({
				center: [locations[0],locations[1]],
				radius: this.checkInfo.range,
				fillOpacity:0.2,
				map: map
			});
			var marker = new AMap.Marker({
				position: [locations[0],locations[1]],
				map: map
			});
			var size = new AMap.Size(31,34);
			var markerIcon = new AMap.Icon({
				// size:size,
				// image:'http://shp.qpic.cn/bizmp/gZKF72VpagbWu5N6ClzuRzuolG10t5tM9GJkz90ia6fuQhW1iaMqQT8A/',
				// imageSize:size
			});
			marker.setIcon(markerIcon);

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
		if(this.hadSignOut){
			this.util.alert("当天已考勤！");
			return;
		}
		var now = new Date();
		var nowTime = now.getHours()*60*60+now.getMinutes()*60;
		var signTimeStr = this.checkInfo.signTime.split(":");
		var signTime = parseInt(signTimeStr[0])*60*60+parseInt(signTimeStr[1])*60;

		var outTimeStr = this.checkInfo.signOutTime.split(":");
		var outTime = parseInt(outTimeStr[0])*60*60+parseInt(outTimeStr[1])*60;
		
		if(nowTime>signTime){
			this.ifBeLate=1;
		}
		var _this =this;
		if(this.hadSign&&outTime>nowTime){
			
			this.util.confirm('你现在签退属于早退，是否继续?',function(){
				_this.leaveEarly=1;
				_this.saveCheckData();
			})
		}else{
			this.saveCheckData();
		}
		
		
		
	},
	saveCheckData(){
		var _this=this;
		if(""==this.curLat||""==this.curLng){
			this.util.alert('正在获取当前位置，请稍后打卡');
			return;
		}
		var cpCircle = parseInt(this.checkInfo.range);
		var distance = this.getFlatternDistance(parseFloat(this.curLat),parseFloat(this.curLng));
		
		if(distance>=cpCircle){
			this.util.alert("尚未在打卡范围内，请靠近打卡范围后重新定位");
			return;
		}
		//遍历附件
		var filesData = new Array();
		for (var i in this.attachmentModel.fileList) {
			var file = this.attachmentModel.fileList[i];
			if (file.isNewFlag) {
				filesData.push(file);
			}
		}
		var fileDataJson = JSON.stringify(filesData);
		
		var params = {};
		var address="";
		var location=this.curLng+","+this.curLat;
		var lnglat = new AMap.LngLat(this.curLng,this.curLat);
		this.util.mask("正在保存..");
		geocoder.getAddress(lnglat,function(status,result){
			if(status=='complete'){
				address = result.regeocode.formattedAddress;
				if(!_this.hadSign){   //签到
					var mainData = {SIGN_LOCATION_:location,SIGN_ADDRESS_:address,DATA_TYPE_:0,SIGN_REMARK_:_this.remark,sign_status_:_this.ifBeLate};
					params = {userUid:_this.userUid,filesData: fileDataJson,deleteFilesData: _this.attachmentModel.deleteFilesList.join(","),
							mainFormData:JSON.stringify(mainData),sqlTableName:"T_CHECK_RECORD"
					};
				}else{   //签退
					if(_this.signId==''){
						_this.util.sycnPost("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",{userUid:_this.userUid,operateType:'getCurrentUserRecord'},function(res){
							if (res.status == 200) {
								_this.signId = res.data.id;
							}else{
								_this.util.failueToast(res.errorMsg);
								_this.util.unmask();
								return;
							}
						});
						
					}
					var mainData = {SIGN_OUT_LOCATION_:location,SIGN_OUT_ADDRESS_:address,SIGN_OUT_REMARK_:_this.remark,sign_out_status_:_this.leaveEarly,sign_out_time:new Date().format("yyyy-MM-dd hh:mm")};
					params = {userUid:_this.userUid,filesData:fileDataJson,deleteFilesData: _this.attachmentModel.deleteFilesList.join(","),
							mainFormData:JSON.stringify(mainData),sqlTableName:"T_CHECK_RECORD",
							businessKey:_this.signId,id:_this.signId
					};
				}
				//保存数据
				_this.util.post("/admin/appDefaultFormAction!saveData.action",params,function(response){
					_this.util.unmask();
					_this.attachmentModel.fileList=[];
					_this.attachmentModel.deleteFilesList=[];
					if(response.success&&_this.hadSign){
						_this.signOutTime=new Date().format("hh:mm");
						$("#mybutton").html("已签退");
						
						_this.hadSignOut = true;
					}else if(response.success&&!_this.hadSign){
						_this.signTime=new Date().format("hh:mm");;
						_this.attachmentModel.xtype = "outSign";
						_this.hadSign = true;
						$("#mybutton").html("已签到");
					}else{
						_this.util.alert(response.msg);
					}
				});
			}else{
				_this.util.unmask();
				_this.util.alert('获取当前地址失败,请稍后重试！');
				return;
			}
		});
	},
	getFlatternDistance(lat2,lng2){
		
		var lat1 = parseFloat(this.locationLat);
		var lng1 = parseFloat(this.locationLng);
		var f = this.getRad((lat1+lat2)/2);
		var g = this.getRad((lat1-lat2)/2);
		var l = this.getRad((lng1-lng2)/2);
		
		var sg = Math.sin(g);
		var sl = Math.sin(l);
		var sf = Math.sin(f);
		
		var s,c,w,r,d,h1,h2;
		var a = this.EARTH_RADIUS;
		var fl = 1/298.257;
		
		sg = sg*sg;
		sl = sl*sl;
		sf = sf*sf;
		
		s = sg*(1-sl)+(1-sf)*sl;
		c = (1-sg)*(1-sl) + sf*sl;
		w = Math.atan(Math.sqrt(s/c));
		r = Math.sqrt(s*c)/w;
		d = 2*w*a;
		h1 = (3*r-1)/2/c;
		h2 = (3*r+1)/2/s;
		return d*(1+fl*(h1*sf*(1-sg)-h2*(1-sf)*sg));
	},
	getRad(d){
		return d*this.PI/180.0;
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only #C8E49D-->
<style lang="scss" scoped>
.price{
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee;
	border-bottom: 1px solid #eee;
}
.price input{
    height: 40px;
    padding-top: 10px;
    text-align: left;
}
.price>span{
	padding: 0 10px;
}
	.sign {
		padding: 6px;
		// background: #42D885;
		background: #339999;
		font-size: 15px;
		line-height: 20px;
		height: 24%;
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
	.weui-cell label{
		margin-bottom: 0;
	}
	.footer{
		position: fixed;
		width: 100%;
		bottom: 0px;
		height:56px;
		line-height:56px;
		overflow:hidden;
	}
</style>
