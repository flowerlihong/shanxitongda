<template>
	<div class="choose">
	
		<div class="movebx">
	
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-12">上午</span>
	
			</div>
			<div class="price" style="text-align:left;padding-left:10px;">
				<div style="height: 35px;padding-right:10px;">
					<span class="col-xs-2" style="text-align:left;    padding-right: 5px;padding-left: 15px;">
						<x-button mini type="primary" style="padding: 0px 5px 0px 5px;height: 24px;line-height: 1;">天气</x-button>

					</span>
					<span class="col-xs-10" style="padding-right: 0px;">
					<popup-radio :options="options" v-model="mess.amWeather"></popup-radio>
					</span>
				</div>
			</div>
			<div class="price" style="text-align:left;padding-left:10px;padding-top:0px;">
				<div style="height: 35px;;padding-right:10px;">
	
					<span class="col-xs-2" style="text-align:left;margin-top:0px;padding-right: 5px;padding-left: 15px;">
						<x-button mini type="primary" style="background-color: #f7ba2a;border-color: #f7ba2a;padding: 0px 5px 0px 5px;height: 24px;line-height: 1;">温度</x-button>
					</span>
	
					<x-input v-model="mess.amMinT" type="number" :max="10" class="col-xs-3" placeholder="最低气温"></x-input>
					<span class="col-xs-1">℃</span>
					<span class="col-xs-1">~</span>
					<x-input v-model="mess.amMaxT" type="number" :max="10" class="col-xs-3" placeholder="最高气温"></x-input>
					<span class="col-xs-1">℃</span>
				</div>
			</div>
			<div class="price" style="text-align:left;padding-left:10px;">
				<div style="height: 35px;padding-right:10px;">
					<span class="col-xs-2" style="text-align:left;padding-right: 5px;padding-left: 15px;">
						<x-button mini type="primary" style="background-color: #50bfff;border-color: #50bfff;padding: 0px 5px 0px 5px;height: 24px;line-height: 1;">风力</x-button>	
					</span>
					<x-input v-model="mess.amWdir" :max="50" class="col-xs-10" placeholder="请输入风向"></x-input>
	
				</div>
			</div>
			<div class="price" style="text-align:left;padding-left:10px;">
				<div style="height: 35px;padding-right:10px;">
					<span class="col-xs-2" style="text-align:left;padding-right: 5px;padding-left: 15px;">
						<x-button mini type="primary" style="background-color: #20a0ff;border-color: #20a0ff;padding: 0px 5px 0px 5px;height: 24px;line-height: 1;">风力</x-button>
					</span>
					<x-input v-model="mess.amWs" :max="50" class="col-xs-10" placeholder="请输入风力"></x-input>
	
				</div>
			</div>
			<div class="price" style="text-align:left;background-color: #eeefef;">
				<span class="col-xs-12">下午</span>
	
			</div>
			<div class="price" style="text-align:left;padding-left:10px;">
				<div style="height: 35px;padding-right:10px;">
					<span class="col-xs-2" style="text-align:left;    padding-right: 5px;padding-left: 15px;">
						<x-button mini type="primary" style="padding: 0px 5px 0px 5px;height: 24px;line-height: 1;">天气</x-button>
					</span>
					<!--
						<x-input v-model="mess.pmWeather" :max="50" class="col-xs-10" placeholder="输入天气情况"></x-input>
						-->
					<span class="col-xs-10" style="padding-right: 0px;">
					<popup-radio :options="options" v-model="mess.pmWeather"></popup-radio>
					</span>
				</div>
			</div>
			<div class="price" style="text-align:left;padding-left:10px;padding-top:0px;">
				<div style="height: 35px;;padding-right:10px;">
	
					
					<span class="col-xs-2" style="text-align:left;margin-top:0px;padding-right: 5px;padding-left: 15px;">
						<x-button mini type="primary" style="background-color: #f7ba2a;border-color: #f7ba2a;padding: 0px 5px 0px 5px;height: 24px;line-height: 1;">温度</x-button>
					</span>
					<x-input v-model="mess.pmMinT" type="number" :max="10" class="col-xs-3" placeholder="最低气温"></x-input>
					<span class="col-xs-1">℃</span>
					<span class="col-xs-1">~</span>
					<x-input v-model="mess.pmMaxT" type="number" :max="10" class="col-xs-3" placeholder="最高气温"></x-input>
					<span class="col-xs-1">℃</span>
				</div>
			</div>
			<div class="price" style="text-align:left;padding-left:10px;">
				<div style="height: 35px;padding-right:10px;">
					<span class="col-xs-2" style="text-align:left;padding-right: 5px;padding-left: 15px;">
						<x-button mini type="primary" style="background-color: #50bfff;border-color: #50bfff;padding: 0px 5px 0px 5px;height: 24px;line-height: 1;">风力</x-button>	
					</span>
					<x-input v-model="mess.pmWdir" :max="50" class="col-xs-10" placeholder="请输入风向"></x-input>
	
				</div>
			</div>
			<div class="price" style="text-align:left;padding-left:10px;">
				<div style="height: 35px;padding-right:10px;">
					<span class="col-xs-2" style="text-align:left;padding-right: 5px;padding-left: 15px;">
						<x-button mini type="primary" style="background-color: #20a0ff;border-color: #20a0ff;padding: 0px 5px 0px 5px;height: 24px;line-height: 1;">风力</x-button>
					</span>
					<x-input v-model="mess.pmWs" :max="50" class="col-xs-10" placeholder="请输入风力"></x-input>
	
				</div>
			</div>
		</div>
		<nav class="navbar navbar-default navbar-fixed-bottom">
			<p>
				<x-button @click.native="cancle()" mini style="width:48%;height: 45px;" type="default">取消</x-button>
				<x-button @click.native="goback($event)" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
			</p>
		</nav>
	</div>
</template>

<script>
import { XButton,XInput } from 'vux'
import { PopupRadio } from 'vux'
export default {
	name: 'selectProj',
	data() {
		return {
			value: '',
			options: ['晴', '阴', '多云', '少云', '小雨', '中雨', '大雨', '阵雨', '雷阵雨', '暴雨', '雾', '霾', '霜冻', '暴风', '台风', '暴风雪', '大雪', '中雪', '小雪', '雨夹雪', '冰雹'],
		}
	},
	components: {
		// 名字
		XButton,XInput, PopupRadio
	},
	computed: {

	},
	props: ['mess'],
	created() {
		var _this = this;
		this.search = '';

	},
	activated() {
		this.loadData();
	},
	methods: {
		loadData(type, creatTime) {


		},
		goback($event) {
			this.mess.editWeatherVisible = false;
		},
		cancle() {
			this.mess.editWeatherVisible = false;
			console.info("cancle" + this.mess.editWeatherVisible);
		},
		handleClick() {



		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.top,
.middle {
	text-align: left;
}

.weui-cell {
	padding-top: 0px!important;
	padding-bottom: 0px!important;
}

//金额    生产日期
.unpop,
.pop,
.price,
.date {
	height: 48px;
	line-height: 48px;
	border-top: 1px solid #eee; // border-bottom: 1px solid #ccc;
}

.unpop .daright {
	text-align: right;
}

.pop {
	.daright {
		text-align: right;
	}
}

.price input,
.date input {
	height: 40px;
	padding-top: 10px;
	text-align: right;
}

.unpop>span,
.pop>span,
.price>span,
.date>span,
.bill>span {
	padding: 0 10px;
}

.block {
	text-align: right;
}

//发票
.bill p span:first-child {
	color: #f00;
}

.bill p span:last-child {
	color: blue;
}

.bill p {
	padding: 0 10px;
	margin: 0;
}

.bill {
	border-top: 1px solid #eee;
	padding: 10px 0 0 0;
	height: 100%;
	.load {
		height: 100%;
		border-bottom: 1px solid #ccc;
		margin-top: 30px;
		padding: 5px 15px;
		#imgsLoad {
			height: 4rem;
			li {
				float: left;
			}
		}
	}
}

//foot
.foot {
	height: 4.1rem; //height: 100%;
	line-height: 48px; //height: 2.2rem;
	p {
		margin: 0;
		color: blue;
		background: #eee;
		border-bottom: 1px solid #ccc;
		span {
			color: #f00;
		}
	}
	.footColor {
		color: #000;
		font-weight: bold;
	}
}

.footer {
	height: 2.2rem;
	padding-top: 10px;
	background: #eee;
	line-height: 42px;
}
</style>
<style>
/***/

.mint-cell-wrapper {
	font-size: 14px;
	background: none;
}

.mint-cell-title {
	font-size: 14px;
}

.mint-cell-value {
	font-size: 14px;
	color: #0c0c0c!important;
}

.mint-cell-allow-right::after {

	right: 13px !important;
}

.weui-cell__ft {
	color: #171616!important;
}

.mint-cell-value.is-link {
	margin-right: 14px !important;
}

.v-transfer-dom {
	z-index: 9999;
	position: absolute;
}
</style>

