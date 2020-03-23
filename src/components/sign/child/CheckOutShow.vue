<template>
  <div class="CheckOutWork-box">
	<div class="choose" style="height:100%;overflow:hidden">		
		<div style="width: 100%;height: 50%;" id="container"></div>
		<div style="width: 100%;height:50%;overflow:auto;text-align: left;background: #339999;">
			<div class="media attitem day-late-all" style="margin-bottom:5px;margin-top:10px;" @click="locationAgain(item)" v-for="item in checkData">
				<p>签到时间：&nbsp;
					<span>{{item.signTime}}&nbsp;&nbsp;{{item.signAddress}}</span>
					<p v-if="item.imgLists!=undefined&&item.imgLists.length>0">
						<img v-for="(img,index) in item.imgLists" :key="index"  @click="previewImage(img,item.imgLists)" style="width:30px;height:30px;margin:0 5px;" :src="webUrl+'/attachmentAction!look.action?id='+img" alt="">
					</p>
				</p>
				<p>签到备注：&nbsp;
					<span>{{item.signRemark}}</span>
				</p>
				<p>签到客户：&nbsp;
					<span>{{item.signCompany}}</span>
				</p>
			</div>

			<!-- <div class="sign">
				<div class="sign-had">
					<div>签到时间: {{checkData.signTime}}</div>
					<div>签到地点: {{checkData.signAddress}}
						<p v-if="checkData.signImgs!=undefined&&checkData.signImgs.length>0">
							<img v-for="(img,key) in checkData.signImgs" :key="key" @click="previewImage(img.id,checkData.signImgs)" style="width:30px;height:30px;margin:0 5px;" :src="webUrl+'/attachment/look?id='+img.id+'&access_token='+access_token" alt="">
						</p>
					</div>
					<div>签到备注: {{checkData.signRemark}}</div>
					<div>签到客户: {{checkData.signCompany}}</div>
					<div>签退时间: {{checkData.signOutTime}}</div>
					<div>签退地点: {{checkData.signOutAddress}}
						<p v-if="checkData.outSignImgs!=undefined&&checkData.outSignImgs.length>0">
							<img v-for="img in checkData.outSignImgs" @click="previewImage(img.id,checkData.outSignImgs)" style="width:30px;height:30px;margin:0 5px;" :src="webUrl+'/attachment/look?id='+img.id+'&access_token='+access_token" alt="">
						</p>
					</div>
					<div>签退备注: {{checkData.signOutRemark}}</div>
					<div>签退客户: {{checkData.signOutCompany}}</div>
				</div>
		</div> -->
		</div>
	</div>
	
  </div>
</template>

<script>
// import AMap from 'AMap'
import Amap from '@/public/js/amap.js?v=1.3&key=fe204db692e01127e0a74bf92a4d4964';
import SelectUser from '../../common/SelectUser.vue'
import { mapState, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui';
import Attachment from '../../common/Attachment.vue'
var map;
var markers=[];
var geocoder;
export default {
  name: 'legwork',
  data () {
    return {
		hadSign:false,  //是否已签到
		signId:'',  //当天考勤数据Id
		signTime:'',   //签到时间
		hadSignOut:false,  //是否已签退
		signOutTime:'',  //签退时间
		curLat:'', //当前位置维度
		curLng:'',  //当前位置经度
		remark:'',  // 备注
		client:'',
		myRecord:[],
		checkData: {
			
		},
		notifierModel:{
			visible:false,
			userName:"",
			userUid:""
		},
		id:'',
		webUrl:'',
		access_token:''
		
    }
  },
  components:{
	Attachment,SelectUser
  },
  computed: {
  	...mapState({
  		userUid: state => state.userUid,
  		userLogo: state => state.userLogo

  	}),
  },
  created(){
		this.webUrl = this.util.getBaseUrl();
		this.access_token = this.util.getAccessToken();
		// this.util.initWxJsSdk(this);
  },
  activated(){
		var _this = this;
		var createUser =this.util.getUrlParam("createUser");
		var checkDate =this.util.getUrlParam("checkDate");
		//获取当天外勤信息
		this.util.mask();
		var param = {
				operateType:'getOutRecordDataByUser',
				createUser:createUser,
				checkDate:checkDate
		};
		this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",param,function(res){
			_this.util.unmask();
			console.debug(res);
			if (res.status == 200) {
				for(var i=0;i<res.data.length;i++){
					res.data[i].imgLists =res.data[i].signImgs.split(",");
				}
				_this.checkData=res.data;
				_this.locationAgain(res.data[0]);
			}else{
				_this.util.failueToast(res.errorMsg);
			}
		});

  },
  mounted() {
			this.init();
  },
  methods: {
	  previewImage(curId,curData){
			var imgId = this.webUrl+'/attachment/look?id='+curId+'&access_token='+this.access_token;
			var imgIds=[];
			for(var i=0;i<curData.length;i++){
				imgIds.push(this.webUrl+'/attachment/look?id='+curData[i].id+'&access_token='+this.access_token);
			}
			this.wx.previewImage({
				current: imgId, // 当前显示图片的http链接
				urls: imgIds // 需要预览的图片http链接列表
			});
		},
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
  	//重新定位
	locationAgain(itemData){
		var _this = this;
		//清空数组
		for(var i=0;i<markers.length;i++){
			markers[i].setMap(null);
		}
		var locations = itemData.signLocation.split(",");
		
		var lnglatXY=[locations[0],locations[1]];
		map.setCenter(lnglatXY);

		var marker = new AMap.Marker({
			map: map,
			position : [locations[0],locations[1]]
		});
		var markerPic = new AMap.Marker({
			map: map,
			offset: new AMap.Pixel(-40, -72),
			content: '<div style="background: #339999;height: 30px;width: 84px;line-height: 30px;color: #fff;border-radius: 5px;position:relative" class="marker-route" id="xingmingStyle10086">'+itemData.createUserName+'</div>' });
		
		//设置当前位置
		var size = new AMap.Size(40,45);
		var markerIcon = new AMap.Icon({
			size: size,
			image: itemData.createUserPic,
			imageSize: size
		});
		marker.setIcon(markerIcon);
		//添加数据
		markers.push(marker);
		markers.push(markerPic);
		

	}
	
	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only #C8E49D-->
<style lang="scss" scoped>
.marker-route{
	background: #339999;
	padding: 30px;
}

.day-late-all {
	background-color: #fff;
	margin: 18px 10px;
	min-height: 130px;
	padding: 10px;
	padding-top: 13px;
	position: relative;
}

.day-late-all>p {
	margin: 0;
	margin-bottom: 4px;
	// color: #9f9f9f;
	color: #fff;
}

.day-late-all>p>span {
	color: #101001
}

.iconStatus {
	position: absolute;
	margin: auto;
}

.noMore {
	background: #eee;
	padding: 10px;
}

.attitem {
	padding: 5px;
	border: 1px solid #cccccc;
	background: #339999;
	li {
		padding: 5px;
	}
}

	.CheckOutWork-box{
		height: 100%;
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

#xingmingStyle10086::after{
	content:'';
	position:absolute;
	right:50%;
	margin-right: -5px;
	bottom: -10px;
	width:10px;
	height:10px;
	box-sizing: border-box;
	border-top:5px solid #339999;  
	border-bottom:5px solid transparent;  
	border-left:5px solid transparent;  
	border-right:5px solid transparent;  
}
</style>
