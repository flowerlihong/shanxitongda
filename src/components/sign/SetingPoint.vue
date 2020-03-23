<template>
	<div class="choose">
	<div class="head">
		<!-- <el-input placeholder="搜索" type='search' icon="search" v-model="searchValue" v-on:keyup.enter.native="handleClick" :on-icon-click="handleClick"></el-input> -->
		<search  v-model="searchValue" placeholder="搜索" :autoFixed="false" @on-submit="handleClick" ref="search"></search>
	</div>
	<div class="mymap" id="container"></div>
	<div class="row" style="margin:0;height:7rem;overflow:auto;">
      <!-- 此处循环, 后端返回的 数组 -->
	  <!-- <checklist title="" :max="1" :min="1" type="radio" :options="pointLists" v-model="inlineDescListValue"></checklist> -->
	  <div id="check-my-map" @click="checkItem($event,index,item)" v-for="(item,index) in pointLists" :style="items">
				
			<div>
				<icon type="success" :class="'icon-success icon-success'+index" v-if="item.check" style="font-size:16px;"></icon>
				<icon type="circle" class="icon-success" style="font-size:16px;" v-if="!item.check"></icon>
				<h4 style="margin:4px 0;font-family:'microsoft yahei';font-size:16px;">{{item.name}}</h4>
				<span style="color:#B1A6A6;font-weight:400;margin-bottom:3px;font-size:14px;display:inline-block;">{{item.address}}</span>
			</div>
		</div>
      
      </div>
		<div class="footer">
			
			<p style="margin-top:-10px;">
				<x-button @click.native="locationAgain()" mini style="width:48%;height: 38px;background: #336699;" type="primary">重新定位</x-button>
				<x-button id="mybutton" @click.native="addPoint(pointLists,radio,$event)" mini style="width:48%;height: 38px;" type="primary">添加</x-button>
			</p>
			
		</div>
	</div>
</template>

<script>

// import gouicon from '@public/js/gouicon.js'
import { mapState, mapActions } from 'vuex'
import {Search,XButton,Checklist,Icon } from 'vux'
// import AMap from 'AMap'
import Amap from '@/public/js/amap.js?v=1.3&key=fe204db692e01127e0a74bf92a4d4964';
var map;
var geocoder;
var markers=[];
export default {
  name: 'setingPoint',
  data () {
    return {
			searchValue:'',
			inlineDescListValue:[0],
			allLoaded: false,
			radio:0,
			pointLists:[],
			inlineDescList: [
				{key: '1', value: 'Tiger is good', inlineDesc: 'Tiger is the king of mountain'},
				{key: '2', value: 'Lion is better', inlineDesc: 'Lion is the king of woods'},
				{key: '3', value: 'Camel is best, no inline-desc'}
			],
			items: {
				textAlign: 'left',
				padding: '0 10px',
				minHeight:'1.6rem',
				height:'auto',
				borderBottom: '1px solid #ccc',
				paddingLeft: '28px',
				position: 'relative',
				
			}
    }
  },
  components:{
    Search,XButton,Checklist,Icon
  },
	computed: {
  	...mapState({
  			username: state => state.username,
			userUid: state => state.userUid,
  			userLogo: state => state.userLogo
  	}),
  },
	created(){
		var _this = this;
		this.locationAgain(); //获取位置
	    
	},
	mounted() {
			this.init();
  },
  methods: {
		init() {
			var _this = this;
			var location="113.317237,23.154002";
		  	
			var locations = location.split(",");
			this.locationLat =locations[1];
			this.locationLng =locations[0];
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

			 //为地图注册click事件获取鼠标点击出的经纬度坐标
			var clickEventListener = map.on('click', function(e) {
				var curLng = e.lnglat.getLng();
				var curLat = e.lnglat.getLat();
				//设置当前位置
				var marker = new AMap.Marker({
					position: [curLng,curLat],
					map: map
				});
				//清空数组
				for(var i=0;i<markers.length;i++){
					markers[i].setMap(null);
				}
				//添加数据
				markers.push(marker);
				var lnglatXY=[curLng,curLat];//地图上所标点的坐标
				_this.pointLists=[];
				geocoder.getAddress(lnglatXY, function(status, result) {
					
					if (status === 'complete' && result.info === 'OK') {
						//获得了有效的地址信息:即，result.regeocode.formattedAddress
						var item ={
							check:true,
							name:result.regeocode.addressComponent.street,
							address:result.regeocode.formattedAddress,
							location:lnglatXY.join(",")
						};
						_this.pointLists.push(item);
						_this.$http.get("http://restapi.amap.com/v3/place/around?key=82c91102377a644ef3af68a674c6e8bb&location="+curLng+","+curLat+"&types=070000|080000|090000|100000|110000|120000|130000|140000|150000|160000|170000|180000|190000|200000|220000|990000").then((res)=>{
								
								for(var i=0;i<res.data.pois.length;i++){
									var item ={
										check:false,
										name:res.data.pois[i].name,
										address:res.data.pois[i].pname+res.data.pois[i].cityname+res.data.pois[i].adname+res.data.pois[i].address,
										location:res.data.pois[i].location
									};
									_this.pointLists.push(item);
								}
								_this.radio=0;
								
						},(onRejected)=>{});
					}else{
						//获取地址失败
						console.debug("获取地址失败");
					}
				}); 
				
				
				
			});
			
			
    },
	handleClick() {
		var _this=this;
		if (this.validUtil.isNotEmpty(this.searchValue)) {
			this.$http.get("http://restapi.amap.com/v3/place/text?key=82c91102377a644ef3af68a674c6e8bb&keywords="+this.searchValue+"&types=070000|080000|090000|100000|110000|120000|130000|140000|150000|160000|170000|180000|190000|200000|220000|990000&page=1&extensions=all").then((res)=>{
						_this.pointLists=[];
						for(var i=0;i<res.data.pois.length;i++){
							var item ={
								check:false,
								name:res.data.pois[i].name,
								address:res.data.pois[i].pname+res.data.pois[i].cityname+res.data.pois[i].adname+res.data.pois[i].address,
								location:res.data.pois[i].location
							};
							if(i==0){
								item.check=true;
							}
							_this.pointLists.push(item);
						}
						_this.radio=0;
						var location = _this.pointLists[0].location;
						var locations = location.split(",");
						var newLnglat = new AMap.LngLat(locations[0],locations[1]);
						map.setCenter(newLnglat);
						var marker = new AMap.Marker({
							map: map,
							position : [locations[0],locations[1]]
						});
						//设置当前位置
						var size = new AMap.Size(40,45);
						var markerIcon = new AMap.Icon({
							
						});
						marker.setIcon(markerIcon);
						//清空数组
						for(var i=0;i<markers.length;i++){
							markers[i].setMap(null);
						}
				},(onRejected)=>{});

		}
		


	},
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
						var lngLat = result.locations[0];
						var curLat = lngLat.getLat();//当前高德维度
						var curLng = lngLat.getLng();//当前高德经度
						map.setCenter(lngLat);
						
						var marker = new AMap.Marker({
							map: map,
							position : [curLng,curLat]
						});
						//设置当前位置
						var size = new AMap.Size(40,45);
						var markerIcon = new AMap.Icon({
							
						});
						marker.setIcon(markerIcon);
						//清空数组
						for(var i=0;i<markers.length;i++){
							markers[i].setMap(null);
						}
						//添加数据
						markers.push(marker);
						var lnglatXY=[curLng,curLat];//地图上所标点的坐标
						_this.pointLists=[];
						geocoder.getAddress(lnglatXY, function(status, result) {
							
							if (status === 'complete' && result.info === 'OK') {
								//获得了有效的地址信息:即，result.regeocode.formattedAddress
								var item ={
									check:true,
									name:result.regeocode.addressComponent.street,
									address:result.regeocode.formattedAddress,
									location:lnglatXY.join(",")
								};
								_this.pointLists.push(item);
								_this.$http.get("http://restapi.amap.com/v3/place/around?key=82c91102377a644ef3af68a674c6e8bb&location="+curLng+","+curLat+"&types=070000|080000|090000|100000|110000|120000|130000|140000|150000|160000|170000|180000|190000|200000|220000|990000").then((res)=>{
										
										for(var i=0;i<res.data.pois.length;i++){
											var item ={
												check:false,
												name:res.data.pois[i].name,
												address:res.data.pois[i].pname+res.data.pois[i].cityname+res.data.pois[i].adname+res.data.pois[i].address,
												location:res.data.pois[i].location
											};
											_this.pointLists.push(item);
										}
										_this.radio=0;
										
								},(onRejected)=>{});
							}else{
								//获取地址失败
								_this.util.alert("获取地址失败");
							}
						}); 

						
					}
				);
				
				
			}

		});
	},
	checkItem($event,index,item){
			for(var i in this.pointLists){
				this.pointLists[i].check=false;
			}
			item.check =true;
			this.radio = index;
			var location = item.location.split(",");
			//设置当前位置
			var marker = new AMap.Marker({
				position: [location[0],location[1]],
				map: map
			});
			
			//清空数组
			for(var i=0;i<markers.length;i++){
				markers[i].setMap(null);
			}
			//添加数据
			markers.push(marker);
	},
	addPoint(pointLists,radio,$event){
			var point = {
				name: pointLists[radio].name,
				address: pointLists[radio].address,
				location:pointLists[radio].location,
				range: 50
			}
			this.$router.push({name:'pointEdit',query:{pointData:point,
				isEdit: false}});
	}
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
.mymap{
	width: 100%;
	height: 280px;
}
.footer{
	position: fixed;
	bottom:0;
	width: 100%;
	height: 45px;
	background:#cccccc;
}
</style>
<style>
#check-my-map .el-radio{
	position: relative
}
#check-my-map .el-radio__input{
	position: absolute;
    left: -23px;
    top: 21px;
}
#check-my-map .el-radio__label{
	display: block;
	padding-top:10px;
}	    
.icon-success{
	position: absolute;   
	left: 3px;
    top: 14px;
}
.icon-success::before{
	margin:0!important;
}
</style>
