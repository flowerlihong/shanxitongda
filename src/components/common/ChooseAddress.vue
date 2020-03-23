<template>
	<div class="choose">
	<div class="head">
		<search  v-model="searchValue" placeholder="搜索" :autoFixed="false" @on-submit="handleClick" v-on:keyup.enter.native="handleClick" ref="search"></search>
	</div>
	<div class="mymap" id="container"></div>
	<div class="row" style="margin:0;height:7rem;overflow:auto;">
      <!-- 此处循环, 后端返回的 数组 -->
      <div id="check-my-map" @click="checkItem($event,index,item)" v-for="(item,index) in pointLists" :style="items">
				<div>
					<icon type="success" :class="'icon-success icon-success'+index" v-if="item.check" style="font-size:16px;"></icon>
					<icon type="circle" class="icon-success" style="font-size:16px;" v-if="!item.check"></icon>
					<h4 style="margin:4px 0;font-family:'microsoft yahei';font-size:16px;margin-bottom:4px">{{item.name}}</h4>
					<span style="color:#B1A6A6;font-weight:400;">{{item.address}}</span>
				</div>
		</div>
      </div>
	  
		<nav class="navbar navbar-default navbar-fixed-bottom">
			<p style="margin-top:-10px;">
				<x-button @click.native="close()" mini style="width:48%;height: 38px;background:#cccccc" type="default">取消</x-button>
				<x-button id="mybutton" @click.native="addAddress(pointLists,radio,$event)" mini style="width:48%;height: 38px;" type="primary">确定</x-button>
			</p>
			<!-- <p>
      			<el-button @click="close()" style="width:49%;margin:0;" type="default">取消</el-button>
				<el-button @click="addAddress(pointLists,radio,$event)" style="width:49%;margin:0;" type="success">确定</el-button>
			</p> -->
		</nav>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {Search,XButton,Checklist,Icon } from 'vux'
import Amap from '@/public/js/amap.js?v=1.3&key=fe204db692e01127e0a74bf92a4d4964';
// import AMap from 'AMap'
var map;
var circle;
var geolocation;
var geocoder;
var markers=[];
export default {
  name: 'chooseAddress',
  data () {
    return {
		  searchValue:'',
		  allLoaded: false,
		  radio:0,
		  pointLists:[],
		  items: {
			textAlign: 'left',
			padding: '0 10px',
			height:'2rem',
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
  			curLng: state => state.curLng,
			curLat: state => state.curLat
			
  	}),
  },
  watch:{
		
  },
  props: ['address'],
	mounted() {
			this.init();
  },
  created(){
	  circle = new AMap.Circle({
			// center: [locations[0],locations[1]],
			radius: 100,
			fillOpacity:0.2,
			map: map
		});
  },
  methods: {
	init() {
			var _this = this;
			var location="116.397428,39.90923";
		  	
			var locations = location.split(",");
			this.locationLat =locations[1];
			this.locationLng =locations[0];
		  	map = new AMap.Map('container', {
				// center: [locations[0],locations[1]],
				resizeEnable: true,
				zoom: 16
			});
			// map.setCenter(_this.lngLat);
			// var marker = new AMap.Marker({
			// 	map: map,
			// 	position : [locations[0],locations[1]]
			// });
			//设置当前位置
			var size = new AMap.Size(40,45);
			var markerIcon = new AMap.Icon({
				
			});
			// marker.setIcon(markerIcon);
			AMap.plugin('AMap.Geocoder',function(){
				geocoder = new AMap.Geocoder({
					//city: "010"//城市，默认：“全国”
				});
			});
			
			 //为地图注册click事件获取鼠标点击出的经纬度坐标
			var clickEventListener = map.on('click', function(e) {
				var curLng = e.lnglat.getLng();
				var curLat = e.lnglat.getLat();
				// _this.curLng = curLng;
				// _this.curLat = curLat;
				//设置当前位置
				var marker = new AMap.Marker({
					position: [curLng,curLat],
					map: map
				});
				
				//清空数组
				for(var i=0;i<markers.length;i++){
					markers[i].setMap(null);
				}
				markers.push(marker);

				//添加数据
				var lnglatXY=[curLng,curLat];//地图上所标点的坐标
				_this.pointLists=[];
				geocoder.getAddress(lnglatXY, function(status, result) {
					
					if (status === 'complete' && result.info === 'OK') {
						//获得了有效的地址信息:即，result.regeocode.formattedAddress
						var item ={
							check:false,
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
	locationAgain(location,range){
		var _this = this;
		if(!this.util.isNotEmpty(location)){
			return;
		}
		
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
		markers.push(marker);
		//添加数据
		var lnglatXY=[locations[0],locations[1]];//地图上所标点的坐标
		_this.pointLists=[];
		geocoder.getAddress(lnglatXY, function(status, result) {
			
			if (status === 'complete' && result.info === 'OK') {
				//获得了有效的地址信息:即，result.regeocode.formattedAddress
				var item ={
					check:false,
					name:result.regeocode.addressComponent.street,
					address:result.regeocode.formattedAddress,
					location:lnglatXY.join(",")
				};
				_this.pointLists.push(item);
				_this.$http.get("http://restapi.amap.com/v3/place/around?key=82c91102377a644ef3af68a674c6e8bb&location="+locations[0]+","+locations[1]+"&types=070000|080000|090000|100000|110000|120000|130000|140000|150000|160000|170000|180000|190000|200000|220000|990000").then((res)=>{
						
						for(var i=0;i<res.data.pois.length;i++){
							var item ={
								check:false,
								name:res.data.pois[i].name,
								address:res.data.pois[i].pname+res.data.pois[i].cityname+res.data.pois[i].adname+res.data.pois[i].address,
								location:res.data.pois[i].location
							};
							_this.pointLists.push(item);
						}
						
				},(onRejected)=>{});
			}else{
				//获取地址失败
				console.debug("获取地址失败");
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
	loadTop(){

	},
	loadBottom(){

	},
	close(){
		
		this.address.addressVisible = false;
	},
	addAddress(pointLists,radio,$event){
		
		var location =  pointLists[radio].location;
		var locationArr = location.split(",");
		var lnglat = new AMap.LngLat(locationArr[0],locationArr[1]);
		// geocoder.getAddress(lnglat,function(status,result){
		// 	if(status=='complete'){
		// 		var address = result.regeocode.formattedAddress
				
		// 	}else{
		// 		console.debug('无法获取地址');
		// 	}
		// });
		this.address.addressVisible = false;
		this.$emit('chooseAddress',{address: pointLists[radio].address,addressLocation: location});
		 
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
.icon-success{
	position: absolute;   
	left: 3px;
    top: 14px;
}
.icon-success::before{
	margin:0!important;
}
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
	padding-top:15px;
}
</style>
