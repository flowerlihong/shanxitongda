<template>
	<div style="height:auto;background-color: #efeff4!important;margin-top: -6px;">

		<div style="margin-top: 0.2rem;background-color: white;">
			<div @click="ifShowCalendar = !ifShowCalendar" v-if="!ifShowCalendar" class="middle" style="">
				<div class="pop" style="">
					<div class="col-xs-5">
						<div style="float: left;">
							<i class="iconfont icon-kaoqin icon-25 color2" style="font-size: 30px;color: rgb(153, 168, 181);height:15px"></i>
						</div>
						<div style="margin-left: 10px;">考勤日期</div>
					</div>
					<div class="daright col-xs-7">
						<span style="margin-right:20px;color: #c0c0c0;">选择</span>
						<i class="glyphicon glyphicon-chevron-down"></i>
					</div>
				</div>
			</div>
			<div @click="ifShowCalendar = !ifShowCalendar" v-if="ifShowCalendar" class="middle" style="border-bottom: 1px solid #ccc;">
				<div class="pop" style="">
					<div class="col-xs-5">
						<div style="float: left;">
							<i class="iconfont icon-kaoqin icon-25 color2" style="font-size: 30px;color: rgb(15, 128, 228);"></i>
						</div>
						<div style="margin-left: 10px;">考勤日期</div>
					</div>
					<div class="daright col-xs-7">
						<span style="margin-right:20px;color: #c0c0c0;">收起</span>
						<i class="glyphicon glyphicon-chevron-up"></i>
					</div>
				</div>

			</div>

		</div>
		<div :style="calendarStyle" id="inCalendar">
			<inline-calendar v-if="ifShowCalendar" class="inline-calendar-demo" style="" :show.sync="show" v-model="dayAllAttendance" start-date="2016-04-01" :range="range" :show-last-month="showLastMonth" :show-next-month="showNextMonth" :highlight-weekend="highlightWeekend" :return-six-rows="return6Rows" :hide-header="hideHeader" :hide-week-list="hideWeekList" :replace-text-list="replaceTextList" :weeks-list="weeksList" :render-function="buildSlotFn" :disable-past="disablePast" :disable-future="disableFuture">
			</inline-calendar>
		</div>
		<!--{{current value}}-->

		<div style="margin-top: 0.2rem;background-color: white;">
			<div @click="ifShowStatistics = !ifShowStatistics" v-if="ifShowStatistics" class="middle">
				<div class="pop" style="">
					<div class="col-xs-5">
						<div style="float: left;">
							<i class="iconfont icon-qingjiajiaban icon-25 color2" style="font-size: 30px;color: rgb(153, 168, 181);"></i>
						</div>
						<div style="margin-left: 10px;">考勤统计</div>
					</div>
					<div class="daright col-xs-7">
						<span style="margin-right:20px;color: #c0c0c0;">展开</span>
						<i class="glyphicon glyphicon-chevron-down"></i>
					</div>
				</div>
			</div>
			<div @click="ifShowStatistics = !ifShowStatistics" v-if="!ifShowStatistics" class="middle" style="border-bottom: 1px solid #ccc;">
				<div class="pop" style="">
					<div class="col-xs-5">
						<div style="float: left;">
							<i class="iconfont icon-qingjiajiaban icon-25 color2" style="font-size: 30px;color: rgb(15, 128, 228);"></i>
						</div>
						<div style="margin-left: 10px;">考勤统计</div>
					</div>
					<div class="daright col-xs-7">
						<span style="margin-right:20px;color: #c0c0c0;">收起</span>
						<i class="glyphicon glyphicon-chevron-up"></i>
					</div>
				</div>

			</div>
			<div class="oh" v-if="!ifShowStatistics">
				<div class="col-xs-4 tc" @click="allDayAll">
					<div class="yg-round yg-round-lime-green" title="今天考勤数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999 jilu">全 &nbsp;部</p>
						</div>
					</div>
				</div>

				<div class="col-xs-4 tc" @click="lataAll">
					<div class="yg-round red" title="迟到天数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">迟到</p>
							<p class="sl">{{sinCounts}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-4 tc" @click="dayLeaveAll">
					<div class="yg-round" title="早退天数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">早退</p>
							<p class="sl">{{signOutCounts}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-4 tc" @click="dayAskForAll">
					<div class="yg-round yg-round-lime-sss" title="请假天数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">请假</p>
							<p class="sl">{{qingjia}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-4 tc" @click="dayNotAll">
					<div class="yg-round yellow" title="未打卡天数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">未打卡</p>
							<p class="sl">{{weidaka}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-4 tc" @click="dayOutAll">
					<div class="yg-round yg-round-lime-sea" title="外勤天数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">外勤</p>
							<p class="sl">{{waiqing}}</p>
						</div>
					</div>
				</div>

			</div>
		</div>

		<div class="box">

			<scroller v-if="dayAllAttend" lock-x height="-120" :style="kuangdu" @on-pullup-loading="onPullupLoading" ref="onPullupLoadings" :use-pullup="true" :pullup-config="pullup" :scroll-bottom-offst="200">
				<div class="box2" style="height:auto;">
					<div v-for="dayAllItem in dayAllAttendList" class="day-late-all">
						<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名： &nbsp;
							<span>{{dayAllItem.createUser}}</span>
						</p>
						<p>签到时间：&nbsp;
							<span v-if="dayAllItem.signTime!=null">{{dayAllItem.signTime}}</span>
							<span v-if="dayAllItem.signTime!=null">【{{dayAllItem.signAddress}}】</span>
							<span v-if="!(dayAllItem.signTime!=null)">未签到</span>
						</p>
						<p v-if="dayAllItem.outSign!=undefined">签退时间：&nbsp;
							<span v-if="dayAllItem.outSign!=undefined&&dayAllItem.signOutTime!=null">{{dayAllItem.signOutTime}}</span>
							<span v-if="dayAllItem.signOutAddress!=undefined">【{{dayAllItem.signOutAddress}}】</span>
							<span v-if="dayAllItem.outSign!=undefined&&dayAllItem.signOutTime==null">未签退</span>
						</p>
						<p v-if="dayAllItem.outSign==undefined">签到备注：&nbsp;
							<span v-if="dayAllItem.signRemark!=null">{{dayAllItem.signRemark}}</span>
						</p>
						<p v-if="dayAllItem.outSign==undefined">签到公司：&nbsp;
							<span v-if="dayAllItem.signCompany!=null">{{dayAllItem.signCompany}}</span>
						</p>
						<div class="box3">
							<span v-if="dayAllItem.signStatus==1" class="red">迟到</span>
							<span v-if="dayAllItem.signOutStatus==1" style="background: #95cac6">早退</span>
							<span v-if="dayAllItem.outSign==undefined" style="background: #336666">外勤</span>
						</div>
						<p v-if="AttendFlag">还 没 考 勤 哦</p>
					</div>
					<div v-if="noMore " class="noMore" style="padding:0px;padding-top:0px;text-align: center;">已没有更多</div>
				</div>

			</scroller>
			<scroller v-if="dayAskForLeave" lock-x height="-100" :style="kuangdu" @on-pullup-loading="onPullupLoading7" ref="onPullupLoadings7" :use-pullup="true" :pullup-config="pullup" :scroll-bottom-offst="200">
				<div class="box2">
					<div class="day-late-all day-ask-for-leave" v-for="dayAskForItem in dayAskForList">
						<p>请假人： &nbsp;
							<span>{{dayAskForItem.leaverName}}</span>
						</p>
						<p>请假类型：&nbsp;
							<span>{{dayAskForItem.type}}</span>
						</p>
						<p>请假内容：&nbsp;
							<span>{{dayAskForItem.content}}</span>
						</p>
						<p v-if="AttendFlag">这一天没有请假记录呢</p>
					</div>
					<div v-if="noMore " class="noMore" style="padding:0px;padding-top:0px;text-align: center;">已没有更多</div>
				</div>
			</scroller>
			<scroller v-if="dayOutAttend" lock-x height="-100" :style="kuangdu" @on-pullup-loading="onPullupLoading8" ref="onPullupLoadings8" :use-pullup="true" :pullup-config="pullup" :scroll-bottom-offst="200">
				<div class="box2">
					<div class="day-late-all" v-for="dayOutItem in dayOutList">
						<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名： &nbsp;
							<span>{{dayOutItem.createUser}}</span>
						</p>
						<p>签到时间：&nbsp;
							<span v-if="dayOutItem.signTime!=null">{{dayOutItem.signTime}}</span>
							<span v-if="dayOutItem.signTime!=null">【{{dayOutItem.signAddress}}】</span>
							<span v-if="!(dayOutItem.signTime!=null)">未签到</span>
						</p>
						<p>签到备注：&nbsp;
							<span v-if="dayOutItem.signRemark!=null">{{dayOutItem.signRemark}}</span>
						</p>
						<p>签到公司：&nbsp;
							<span v-if="dayOutItem.signCompany!=null">{{dayOutItem.signCompany}}</span>
						</p>
						<p v-if="AttendFlag">这一天没有外勤记录呢</p>
					</div>
					<div v-if="noMore " class="noMore" style="padding:0px;padding-top:0px;text-align: center;">已没有更多</div>
				</div>
			</scroller>
			<!--<scroller lock-x height="100" @on-pullup-loading="onPullupLoading2" ref="onPullupLoadings2" :use-pullup="true" :pullup-config="pullup" :scroll-bottom-offst="200">
											<div class="box2">
											<div  v-if="dayLeaveEarly" class="day-late-all" v-for="dayLeaveItem in dayLeaveList">
												<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：	&nbsp;<span>{{dayLeaveItem.createUser}}</span></p>
												<p v-if="dayLeaveItem.signTime!=null">签到日期：&nbsp;<span>{{dayLeaveItem.attendanceDate}}</span></p>
												<p>签到时间：&nbsp;<span v-if="dayLeaveItem.signTime!=null">{{dayLeaveItem.signTime}}</span> <span v-if="dayLeaveItem.signTime!=null">【{{dayLeaveItem.signAddress}}】</span><span v-if="!(dayLeaveItem.signTime!=null)">未签到</span></p>
												<p>签退时间：&nbsp;<span v-if="dayLeaveItem.signOutTime!=null">{{dayLeaveItem.signOutTime}}</span> <span v-if="dayLeaveItem.signOutTime!=null">【{{dayLeaveItem.signOutAddress}}】</span><span v-if="!(dayLeaveItem.signOutTime!=null)">未签退</span></p>
											</div>
											</div>
										</scroller>-->
			<scroller v-if="dayLeaveEarly" lock-x height="-100" :style="kuangdu" @on-pullup-loading="onPullupLoading2" ref="onPullupLoadings2" :use-pullup="true" :pullup-config="pullup" :scroll-bottom-offst="200">
				<div class="box2">
					<div class="day-late-all" v-for="dayLeaveItem in dayLeaveList">
						<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名： &nbsp;
							<span>{{dayLeaveItem.createUser}}</span>
						</p>
						<p>签到时间：&nbsp;
							<span v-if="dayLeaveItem.signTime!=null">{{dayLeaveItem.signTime}}</span>
							<span v-if="dayLeaveItem.signTime!=null">【{{dayLeaveItem.signAddress}}】</span>
							<span v-if="!(dayLeaveItem.signTime!=null)">未签到</span>
						</p>
						<p >签退时间：&nbsp;
							<span v-if="dayLeaveItem.signOutTime!=null">{{dayLeaveItem.signOutTime}}</span>
							<span v-if="dayLeaveItem.signOutTime!=null">【{{dayLeaveItem.signOutAddress}}】</span>
							<span v-if="!(dayLeaveItem.signOutTime!=null)">未签退</span>
						</p>
						<p v-if="AttendFlag">这一天没有早退记录呢</p>
					</div>
					<div v-if="noMore " class="noMore" style="padding:0px;padding-top:0px;text-align: center;">已没有更多</div>
				</div>
			</scroller>
			<scroller v-if="dayNotAttend" lock-x height="-100" :style="kuangdu" @on-pullup-loading="onPullupLoading6" ref="onPullupLoadings6" :use-pullup="true" :pullup-config="pullup" :scroll-bottom-offst="200">
				<div class="box2">
					<div class="day-late-noCheck" v-for="dayNotItem in dayNotList">
						<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：&nbsp;
							<span>{{dayNotItem.userName}}</span>
						</p>
						<p v-if="AttendFlag">这一天没有未打卡记录呢</p>
					</div>
					<div v-if="noMore " class="noMore" style="padding:0px;padding-top:0px;text-align: center;">已没有更多</div>
				</div>
			</scroller>

			<scroller v-if="dayLate" lock-x height="-100" :style="kuangdu" @on-pullup-loading="onPullupLoading1" ref="onPullupLoadings1" :use-pullup="true" :pullup-config="pullup" :scroll-bottom-offst="200">
				<div class="box2">
					<div class="day-late-all" v-for="dayLateItem in dayLateList">
						<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名： &nbsp;
							<span>{{dayLateItem.createUser}}</span>
						</p>
						<p>签到时间：&nbsp;
							<span v-if="dayLateItem.signTime!=null">{{dayLateItem.signTime}}</span>
							<span v-if="dayLateItem.signTime!=null">【{{dayLateItem.signAddress}}】</span>
							<span v-if="!(dayLateItem.signTime!=null)">未签到</span>
						</p>
						<p>签退时间：&nbsp;
							<span v-if="dayLateItem.signOutTime!=null">{{dayLateItem.signOutTime}}</span>
							<span v-if="dayLateItem.signOutTime!=null">【{{dayLateItem.signOutAddress}}】</span>
							<span v-if="!(dayLateItem.signOutTime!=null)">未签退</span>
						</p>
						<p v-if="AttendFlag">这一天没有迟到记录呢</p>
					</div>
					<div v-if="noMore " class="noMore" style="padding:0px;padding-top:0px;text-align: center;">已没有更多</div>
				</div>
			</scroller>

		</div>

	</div>
</template>

<script>
//var wx = require('weixin-js-sdk');
var managerConfigData;
var groupId;

import { mapState, mapGetters, mapActions, } from 'vuex'
import { InlineCalendar, Scroller, LoadMore, Divider, Spinner, XButton, Group, Cell } from 'vux'
export default {
	name: 'movebx',
	data() {
		return {
			kuangdu: {
				width: '100%'
			},
			AttendFlag: false,
			dayOutAttend: false,
			dayNotAttend: false,
			dayAskForLeave: false,
			dayLeaveEarly: false,
			dayLate: false,
			dayAllAttend: false,
			dayAllAttendList: [],
			dayLateList: [],
			dayLeaveList: [],
			dayAskForList: [],
			dayNotList: [],
			dayOutList: [],
			sinCounts: 0,
			signOutCounts: 0,
			qingjia: 0,
			weidaka: 0,
			waiqing: 0,
			quanbu: 0,
			pullup: {
				content: '',
				pullUpHeight: 50,
				height: 40,
				autoRefresh: false,
				downContent: '',
				upContent: '',
				loadingContent: 'Loading...',
				clsPrefix: 'xs-plugin-pullup-'
			},
			noMore: false,
			isEnd: false,
			onFetching: false,
			loading: false,
			ifShowCalendar: true,
			show: true,
			value: '',
			listValue: '',
			ifShowStatistics: false,//是否显示统计
			range: false,
			showLastMonth: true,
			showNextMonth: true,
			highlightWeekend: true,
			return6Rows: false,
			hideHeader: false,
			hideWeekList: false,
			replaceTextList: {},
			replace: false,
			changeWeeksList: true,
			weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
			useCustomFn: false,
			buildSlotFn: () => '',
			disablePast: false,
			disableFuture: true,
			dayAllAttendance: '',
			lateTime: 0,
			leaveTime: 0,
			notTime: 0,
			outTime: 0,
			allTime: 0,
			askForTime: 0,
			lateListLength: 0,
			leaveListLength: 0,
			notListLength: 0,
			outListLength: 0,
			allListLength: 0,
			askForListLength: 0,
			clickDay: '',
			timer: null,
			pageSize: 10
		}
	},
	watch: {
		dayAllAttendance: function(newval) {

			this.noMore = false;
			this.dayAllAttend = true;
			this.clickDay = newval;
			this.dayLate = false;
			this.dayLeaveEarly = false;
			this.dayOutAttend = false;
			this.dayNotAttend = false;
			this.dayAskForLeave = false;
			this.dayAllAttendList = new Array();
			this.dayLateList = new Array();
			this.dayLeaveList = new Array();
			this.dayNotList = new Array();
			this.dayOutList = new Array();
			this.dayAskForList = new Array();
			this.loadData();
		},
		replace(val) {
			this.replaceTextList = val ? {
				'TODAY': '今'
			} : {}
		},
		useCustomFn(val) {
			this.buildSlotFn = val ? (line, index, data) => {
				return /8/.test(data.date) ? '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>' : '<div style="height:19px;"></div>'
			} : () => ''
		},
		changeWeeksList(val) {
			this.weeksList = ['日', '一', '二', '三', '四', '五', '六 ']
		}
	},
	created() {
		this.clickDay = new Date().format("yyyy-MM-dd");
		this.NumberOfPeople();
		this.getNowFormatDate();

	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.onPullupLoadings.reset({ top: 0 });
		})
		/*
		 this.$nextTick(() => {
		 	this.$refs.onPullupLoadings.reset({top: 0});
		 	this.$refs.onPullupLoadings1.reset({top: 0});
		 })
		 
		 this.$nextTick(() => {
		 	this.$refs.onPullupLoadings2.reset({top: 0})
		 })
		 this.$nextTick(() => {
		 	this.$refs.onPullupLoadings7.reset({top: 0})
		 })
		 */

	},
	activated() {

	},
	components: {
		// 名字
		InlineCalendar, Scroller, LoadMore
	},
	computed: {
		...mapState({
			//selectProjModel: state => state.selectProjModel
		}),
		calendarStyle() {
			return this.ifShowCalendar ? { 'padding-top': '8px', 'background-color': 'white' } : { 'padding-top': '0px', 'background-color': 'white;' };
		}

	},
	methods: {
		...mapActions([


			//'selectProjCallback'

		]), cancle() {
			history.back();
		}, sumbit(flag) {

		}, loadData() {
			//console.info(this.$refs.onPullupLoadings);
			if (this.$refs.onPullupLoadings != undefined) {

				clearInterval(this.timer);
				this.timer = null;

				$('.box').height(0);
				this.onPullupLoading("upLoad");
				this.NumberOfPeople();
			} else {
				if (this.timer == null) {
					this.timer = setInterval(this.loadData, 100);
				}

			}
		},
		resetTransform(ref) {
			var dom = ref.$el;
			dom = $(dom).find('.xs-container')[0];
			//console.info(dom);
			$(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
		},
		onPullupLoading(type) {
			//console.info("------onPullupLoading--------");
			if (this.ifShowCalendar) {
				this.ifShowCalendar = false;
			}
			if (!this.ifShowStatistics) {
				this.ifShowStatistics = true;
			}
			var salf = this;
			if (salf.noMore) {
				salf.$refs.onPullupLoadings.donePullup();
				return;
			}
			var startTime = salf.dayAllAttendList.length == 0 ? null : salf.dayAllAttendList[salf.dayAllAttendList.length - 1].createTime;
			var params = { pageSize: this.pageSize, createTime: this.clickDay, type: type == undefined ? null : "downLoad", startTime: startTime };
			this.util.post("/wx/register/getRecordByType", params, function(rsp) {

				if (rsp.data.length < salf.pageSize) {
					salf.noMore = true;
				}
				salf.dayAllAttendList = salf.dayAllAttendList.concat(rsp.data);
				salf.$refs.onPullupLoadings.donePullup();
				//salf.allListLength = rsp.data.length;
				salf.$nextTick(() => {
					salf.$refs.onPullupLoadings.reset();
				});
				//console.info(type);
				if ( type == "upLoad") {

					salf.resetTransform(salf.$refs.onPullupLoadings);
				}
			});


		},
		onPullupLoading1(type) {
			var salf = this;
			if (this.ifShowCalendar) {
				this.ifShowCalendar = false;
			}
			if (!this.ifShowStatistics) {
				this.ifShowStatistics = true;
			}
			var salf = this;
			if (salf.noMore) {
				salf.$refs.onPullupLoadings1.donePullup();
				return;
			}
			var startTime = salf.dayLateList.length == 0 ? null : salf.dayLateList[salf.dayLateList.length - 1].createTime;
			var params = { pageSize: this.pageSize, status: 1, type: "downLoad", startTime: startTime, createTime: this.clickDay };
			this.util.post("/wx/register/getRecordByType", params, function(rsp) {

				if (rsp.data.length < salf.pageSize) {
					salf.noMore = true;
				}
				salf.dayLateList = salf.dayLateList.concat(rsp.data);

				salf.$refs.onPullupLoadings1.donePullup();
				salf.$nextTick(() => {
					salf.$refs.onPullupLoadings1.reset();
				})
				if (type == "upLoad") {
					salf.resetTransform(salf.$refs.onPullupLoadings1);
				}
			});

		},
		onPullupLoading2(type) {
			var salf = this;
			if (this.ifShowCalendar) {
				this.ifShowCalendar = false;
			}
			if (!this.ifShowStatistics) {
				this.ifShowStatistics = true;
			}
			if (salf.noMore) {
				salf.$refs.onPullupLoadings2.donePullup();
				return;
			}
			var startTime = salf.dayLeaveList.length == 0 ? null : salf.dayLeaveList[salf.dayLeaveList.length - 1].createTime;
			var params = { pageSize: this.pageSize, status: 2, type: "downLoad", startTime: startTime, createTime: this.clickDay };
			this.util.post("/wx/register/getRecordByType", params, function(rsp) {
				if (rsp.data.length < salf.pageSize) {
					salf.noMore = true;
				}
				salf.dayLeaveList = salf.dayLeaveList.concat(rsp.data);

				salf.$refs.onPullupLoadings2.donePullup();
				salf.$nextTick(() => {
					salf.$refs.onPullupLoadings2.reset();
				})
				if (type == "upLoad") {
					salf.resetTransform(salf.$refs.onPullupLoadings2);
				}
			});

		},
		onPullupLoading6(type) {
			var salf = this;
			if (this.ifShowCalendar) {
				this.ifShowCalendar = false;
			}
			if (!this.ifShowStatistics) {
				this.ifShowStatistics = true;
			}
			if (salf.noMore) {
				salf.$refs.onPullupLoadings6.donePullup();
				return;
			}
			var startTime = salf.dayNotList.length == 0 ? null : salf.dayNotList[salf.dayNotList.length - 1].createTime;
			var params = { pageSize: this.pageSize, status: 6, type: "downLoad", startTime: startTime, createTime: this.clickDay };
			this.util.post("/wx/register/getRecordByType", params, function(rsp) {
				if (rsp.data.length < salf.pageSize) {
					salf.noMore = true;
				}
				salf.dayNotList = salf.dayNotList.concat(rsp.data);

				salf.$refs.onPullupLoadings6.donePullup();
				salf.$nextTick(() => {
					salf.$refs.onPullupLoadings6.reset();
				})
				if (type == "upLoad") {
					salf.resetTransform(salf.$refs.onPullupLoadings6);
				}
			});

		},
		onPullupLoading7(type) {
			var salf = this;
			if (this.ifShowCalendar) {
				this.ifShowCalendar = false;
			}
			if (!this.ifShowStatistics) {
				this.ifShowStatistics = true;
			}
			if (salf.noMore) {
				salf.$refs.onPullupLoadings7.donePullup();
				return;
			}
			var startTime = salf.dayAskForList.length == 0 ? null : salf.dayAskForList[salf.dayLeaveList.length - 1].createTime;
			var params = { pageSize: this.pageSize, status: 7, type: "downLoad", startTime: startTime, createTime: this.clickDay };
			this.util.post("/wx/register/getRecordByType", params, function(rsp) {
				if (rsp.data.length < salf.pageSize) {
					salf.noMore = true;
				}
				salf.dayAskForList = salf.dayAskForList.concat(rsp.data);

				salf.$refs.onPullupLoadings7.donePullup();
				salf.$nextTick(() => {
					salf.$refs.onPullupLoadings7.reset();
				})
				if (type == "upLoad") {
					salf.resetTransform(salf.$refs.onPullupLoadings7);
				}
			});

		},
		onPullupLoading8(type) {
			var salf = this;
			if (this.ifShowCalendar) {
				this.ifShowCalendar = false;
			}
			if (!this.ifShowStatistics) {
				this.ifShowStatistics = true;
			}
			if (salf.noMore) {
				salf.$refs.onPullupLoadings8.donePullup();
				return;
			}
			var startTime = salf.dayOutList.length == 0 ? null : salf.dayOutList[salf.dayOutList.length - 1].createTime;
			var params = { pageSize: this.pageSize, status: 8, type: "downLoad", startTime: startTime, createTime: this.clickDay };
			this.util.post("/wx/register/getRecordByType", params, function(rsp) {
				if (rsp.data.length < salf.pageSize) {
					salf.noMore = true;
				}
				salf.dayOutList = salf.dayOutList.concat(rsp.data);

				salf.$refs.onPullupLoadings8.donePullup();
				salf.$nextTick(() => {
					salf.$refs.onPullupLoadings8.reset();
				})
				if (type == "upLoad") {
					salf.resetTransform(salf.$refs.onPullupLoadings8);
				}
			});

		},
		loadTop() {
			this.onFetching = true;
			//下拉
			//console.info("******loadTop*****");
			var xmArr = this.data;

			if (xmArr.length == 0) {
				return;
			}

			var startDate = xmArr[xmArr.length - 1].createTime;
			this.loadData('upLoad', startDate);

		},
		lataAll() {
			this.noMore = false;
			this.dayLate = true;
			this.dayAllAttend = false;
			this.dayLeaveEarly = false;
			this.dayOutAttend = false;
			this.dayNotAttend = false;
			this.dayAskForLeave = false;
			this.onPullupLoading1("upLoad");

		},
		dayAskForAll() {
			this.noMore = false;
			this.dayLate = false;
			this.dayAllAttend = false;
			this.dayLeaveEarly = false;
			this.dayOutAttend = false;
			this.dayNotAttend = false;
			this.dayAskForLeave = true;
			this.onPullupLoading7("upLoad");
		},
		dayLeaveAll() {
			this.noMore = false;
			this.dayLate = false;
			this.dayAllAttend = false;
			this.dayLeaveEarly = true;
			this.dayNotAttend = false;
			this.dayOutAttend = false;
			this.dayAskForLeave = false;

			this.onPullupLoading2("upLoad");
		},
		dayNotAll() {
			this.noMore = false;
			this.dayLate = false;
			this.dayAllAttend = false;
			this.dayLeaveEarly = false;
			this.dayNotAttend = true;
			this.dayOutAttend = false;
			this.dayAskForLeave = false;
			this.onPullupLoading6("upLoad");
		},
		dayOutAll() {
			this.noMore = false;
			this.dayLate = false;
			this.dayAllAttend = false;
			this.dayLeaveEarly = false;
			this.dayNotAttend = false;
			this.dayOutAttend = true;
			this.dayAskForLeave = false;
			this.onPullupLoading8("upLoad");

		},
		allDayAll() {
			this.dayLate = false;
			this.dayLeaveEarly = false;
			this.dayOutAttend = false;
			this.dayNotAttend = false;
			this.dayAskForLeave = false;
			this.dayAllAttend = true;
		},
		NumberOfPeople() {
			var salf = this;
			this.util.mask();
			this.util.post("/wx/register/getCountRecord", { createTime: this.clickDay }, function(rsp) {
				salf.sinCounts = rsp.signCount;
				salf.signOutCounts = rsp.signOutCount;
				salf.weidaka = rsp.notClockCount;
				salf.qingjia = rsp.leaveCount;
				salf.waiqing = rsp.outCheckCount;
				salf.util.unmask();
			});
		},
		getNowFormatDate() {


			this.dayLate = false;
			this.dayLeaveEarly = false;
			this.dayNotAttend = false;
			this.dayAskForLeave = false;
			this.dayAllAttend = true;
			var salf = this
			var params = { pageSize: this.pageSize, createTime: this.clickDay };

			this.util.mask();
			this.util.post("/wx/register/getRecordByType", params, function(rsp) {
				// console.debug(rsp.data);
				salf.dayAllAttendList = rsp.data;

				salf.util.unmask();

			});
		}

	}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.box2 {
	text-align: left;
	font-family: 'microsoft yahei'
}

.day-late-noCheck {
	background-color: #fff;
	margin: 18px 10px;
	min-height: 50px;
	padding: 10px;
	padding-top: 13px;
	position: relative;
}

.day-late-all {
	background-color: #fff;
	border: 1px solid #eee;
	margin: 5px 10px;
	min-height: 105px;
	padding: 10px;
	padding-top: 5px;
	position: relative;
}

.day-late-all>p {
	margin: 0;
	margin-bottom: 4px;
	color: #9f9f9f;
}

.day-late-all>p>span {
	color: #101001
}

.box3 {
	color: #fff;
	text-align: right;
	position: absolute;
	width: 148px;
	font-size: 12px;
	height: 20px;
	top: 10px;
	right: 10px;
}

.box3>span {
	padding: 0px 2px;
}

day-ask-for-leave {}

.top,
.middle {
	text-align: left;
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
	overflow: hidden;
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

.oh {
	margin-top: 0.2rem;
	margin-bottom: 0.2rem;
	background-color: white;
	height: 190px;
	padding-bottom: 10px;
	box-sizing: content-box;
}

.tc {
	padding: 0px;
	text-align: center;
}


.yg-round {
	width: 88px;
	height: 88px;
	background: #95cac6;
	text-align: center;
	margin: 4px auto;
	border-radius: 50%;
	position: relative;
	color: #95cac6;
}

.blue {
	background: #89bde0;
}

.red {
	background: #e49091;
}

.yellow {
	background: rgba(234, 187, 101, 0.97);
}

.yg-round-lime-green {
	background: LightGreen;
}

.yg-round-lime-sea {
	background: PaleTurquoise;
}

.yg-round-lime-sss {
	background: LightPink;
}

.yg-round .yg-round-white {
	background: #fff;
	width: 64px;
	height: 64px;
	position: absolute;
	left: 12px;
	top: 9px;
	font-size: 20px;
}

.yg-round .sl {
	margin-top: -15px!important;
}

.yg-round.red .sl {
	color: #e49091;
}

.yg-round.blue .sl {
	color: #89bde0;
}

.yg-round.yellow .sl {
	color: rgba(234, 187, 101, 0.97);
}

.ft14 {
	font-size: 14px;
}

.c999 {
	color: #999;
}

.mt20 {
	margin-top: 10px !important;
}

.jilu {
	padding-top: 9px;
	font-size: 16px;
}

th {
	text-align: center!important;
}

body {
	background-color: #efeff4!important;
}
</style>

<style>
#inCalendar th {
	text-align: center;
}
</style>