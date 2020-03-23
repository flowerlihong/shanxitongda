<template>
	<div class="attRecord" style="text-align:left;">
		<tab v-model="listIndex">
			<tab-item selected>我的签到</tab-item>
			<tab-item>下属签到</tab-item>
		</tab>
		<swiper height="16rem" :threshold="200" :show-dots="false" v-model="listIndex">
			<swiper-item class="black" style="margin-top:5px;height:100%;">
				<div id="scroller" >
				<scroller height="-20" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
					<div class="box2">
					<div class="media attitem day-late-all" style="margin-bottom:5px;margin-top:0;" v-for="item in myRecord">
						<p>考勤日期：
							<span>{{item.attendanceDate}}</span>
						</p>
						<p>签到时间：
							<span>{{item.signTime.substring(0,5)}} {{item.signAddress}}</span>
							<!-- <p v-if="item.signImgs.length>0">
								<img v-for="img in item.signImgs" @click="previewImage(img.id,item.signImgs)" style="width:30px;height:30px;margin:0 5px;" :src="webUrl+'/attachment/look?id='+img.id+'&access_token='+access_token" alt="">
							</p> -->
						</p>
						
						<p v-if="item.outSign!=undefined">签退时间：
							<span :style="item.signOutTime==undefined? style1:''">{{item.signOutTime==undefined? '未签退':item.signOutTime+' '+item.signOutAddress}}</span>
							<!-- <p v-if="item.outSign!=undefined&&item.outSignImgs.length>0">
								<img v-for="img in item.outSignImgs" @click="previewImage(img.id,item.outSignImgs)" style="width:30px;height:30px;margin:0 5px;" :src="webUrl+'/attachment/look?id='+img.id+'&access_token='+access_token" alt="">
							</p> -->
						</p>
						<p v-if="item.outSign==undefined">签到备注：
							<span>{{item.signRemark}}</span>
						</p>
						<p v-if="item.outSign==undefined">签到公司：
							<span>{{item.signCompany}}</span>
						</p>
						<div class="box3">
							<span v-if="item.signStatus==1" class="red">迟到</span>
							<span v-if="item.signOutStatus==1" style="background: #95cac6">早退</span>
							<span v-if="item.outSign==undefined" style="background: #336666">外勤</span>
						</div>
					</div>
					<load-more v-if="!noMore" tip="loading" style="margin-top:0px;"></load-more>
          			<div v-if="isEnd || myRecord.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
					</div>
				</scroller>
				</div>
				<!--</mt-loadmore>-->
			</swiper-item>
			<swiper-item class="black" style="margin-top:5px;">
				<div id="scroller" >
				<scroller height="-60" :use-pulldown="true" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop1" @on-pullup-loading="onScrollBottom1" ref="scrollerBottom1">
					<div class="box2">
						<div class="media attitem day-late-all" style="margin-bottom:5px;margin-top:0;" v-for="item in lowerRecord">
							<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：
								<span>{{item.createUser}}</span>
							</p>
							<p>考勤日期：
								<span>{{item.attendanceDate}}</span>
							</p>
							<p>签到时间：
								<span>{{item.signData}}</span>
								<p v-if="item.signImgs.length>0">
									<img v-for="img in item.signImgs" @click="previewImage(img.id,item.signImgs)" style="width:30px;height:30px;margin:0 5px;" :src="webUrl+'/attachment/look?id='+img.id+'&access_token='+access_token" alt="">
								</p>
							</p>
							<p v-if="item.outSign!=undefined">签退时间：
								<span :style="item.signOutData=='未签退'? style1:''">{{item.signOutData}}</span>
								<p v-if="item.outSign!=undefined&&item.outSignImgs.length>0">
									<img v-for="img in item.outSignImgs" @click="previewImage(img.id,item.outSignImgs)" style="width:30px;height:30px;margin:0 5px;" :src="webUrl+'/attachment/look?id='+img.id+'&access_token='+access_token" alt="">
								</p>
							</p>
							<p v-if="item.outSign==undefined">签到备注：
								<span>{{item.signRemark}}</span>
							</p>
							<p v-if="item.outSign==undefined">签到公司：
								<span>{{item.signCompany}}</span>
							</p>
							<div class="box3">
								<span v-if="item.signStatus==1" class="red">迟到</span>
								<span v-if="item.signOutStatus==1" style="background: #95cac6">早退</span>
								<span v-if="item.outSign==undefined" style="background: #336666">外勤</span>
							</div>
						</div>
						<load-more v-if="!noMore1" tip="loading" style="margin-top:0px;"></load-more>
          				<div v-if="isEnd1 || lowerRecord.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
						</div>
				</scroller>
				</div>
			</swiper-item>
		</swiper>
	
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Swiper, SwiperItem, Divider, Tab, TabItem, Scroller,LoadMore } from 'vux'
export default {
	name: 'attRecord',
	data() {
		return {
			style1:{
				color:'red'
			},
			pulldown: {
				content: '下拉刷新',
				height: 60,
				autoRefresh: false,
				downContent: '下拉刷新',
				upContent: '释放刷新',
				loadingContent: 'Load...',
				clsPrefix: 'xs-plugin-pulldown-'
			},
			pullup: {
				content: '上拉加载更多',
				pullUpHeight: 50,
				height: 40,
				autoRefresh: false,
				downContent: '释放加载更多',
				upContent: '上拉加载更多',
				loadingContent: 'Loading...',
				clsPrefix: 'xs-plugin-pullup-'
			},
			scrollTop: 0,
			isEnd: false,
			isEnd1: false,
			onFetching: false,
			onFetching1: false,
			h4: { margin: 0 },
			myRecord: [],
			lowerRecord: [],
			listIndex: 0,
			noMore: false,
			noMore1: false,
			pageIndex: 1,
			webUrl:'',
			access_token:'',
		}
	},
	computed: {
		...mapState({
			userUid: state => state.userUid,
			userLogo: state => state.userLogo

		}),
	},
	components: {
		Swiper, SwiperItem, Divider, Tab, TabItem, Scroller,LoadMore
	},
	created() {
		this.webUrl = this.util.getBaseUrl();
		this.access_token = this.util.getAccessToken();

	},
	watch:{
			listIndex:function(newval){
				if(newval==1&&this.lowerRecord.length==0){
						this.loadLowerRecord();
				}
				
			}
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({ top: 0 })
		})
	},
	activated() {
		var _this = this;
		
		this.loadData();
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
		loadTop() {
			this.onFetching = true;
			//下拉
			var xmArr = this.myRecord;
			if (xmArr.length == 0) {
				return;
			}
			var startDate = xmArr[xmArr.length - 1].createTime;
			this.loadData('upLoad', startDate);

		},
		onScrollBottom() {
			if (this.isEnd) {
				return;
			}
			if (this.onFetching) {
				// do nothing
			} else {
				this.onFetching = true;
				this.noMore = false;
				if (this.myRecord.length == 0) {
					this.loadData();
				} else {
					this.loadData("downLoad", this.myRecord[this.myRecord.length - 1].createTime);
				}

			}
		},
		loadTop1() {
			this.onFetching1 = true;
			//下拉
			var xmArr = this.lowerRecord;
			if (xmArr.length == 0) {
				return;
			}
			var startDate = xmArr[xmArr.length - 1].createTime;
			this.loadLowerRecord('upLoad', startDate);

		},
		onScrollBottom1() {
			if (this.isEnd1) {
				return;
			}
			if (this.onFetching1) {
				// do nothing
			} else {
				this.onFetching1 = true;
				this.noMore1 = false;
				if (this.lowerRecord.length == 0) {
					this.loadLowerRecord();
				} else {
					this.loadLowerRecord("downLoad", this.lowerRecord[this.lowerRecord.length - 1].createTime);
				}

			}
		},
		loadLowerRecord(type, creatTime){
				var _this=this;
				var param = {
						operateType:'getLowerAttendanceRecord',
						pageIndex : (type == 'upLoad'?this.pageIndex:1)
				};
				if(type == undefined ){
						this.util.mask();
				}
				
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",param, function(res){
						if(type == undefined ){
								_this.util.unmask();
						}
						
						if (res.data == undefined || res.data.length == 0) {
								if (type == undefined) {
										_this.lowerRecord = [];
								}
								if (type == 'downLoad') {
										_this.allLoaded1 = true;// 若数据已全部获取完毕
										if (res.ifEnd1) {
												_this.isEnd1 = true;
										}
								}
								_this.noMore1 = true;

								_this.$nextTick(() => {
										_this.$refs.scrollerBottom1.reset()
								})
								_this.onFetching1 = false

								_this.$refs.scrollerBottom1.donePullup();
								_this.$refs.scrollerBottom1.donePulldown();
								var dom = _this.$refs.scrollerBottom1.$el;
								dom = $(dom).find('.xs-container')[0];
								$(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
								return;
						}
						if (type == undefined) {
								_this.lowerRecord = res.data;

								_this.onFetching1 = false;
								_this.$nextTick(() => {
										_this.$refs.scrollerBottom1.reset()
								});
								_this.$refs.scrollerBottom1.donePullup();
								_this.$refs.scrollerBottom1.donePulldown();
								_this.noMore1 = true;
								return null;

						}else if (type == 'upLoad') {
								_this.lowerRecord = res.data;
								_this.$nextTick(() => {
										_this.$refs.scrollerBottom1.reset()
								});
								// 加载更多数据
								_this.$refs.scrollerBottom1.donePulldown();
								_this.onFetching1 = false
						} else if (type == 'downLoad') {
								_this.lowerRecord = _this.lowerRecord.concat(res.data);
								
								_this.$nextTick(() => {
										_this.$refs.scrollerBottom1.reset()
								});
								_this.onFetching1 = false;
								_this.$refs.scrollerBottom1.donePullup();
								if (res.ifEnd) {
										_this.isEnd1 = true;
								}
								_this.noMore1 = true;
								
						}
						
				});
		},
		loadData(type, creatTime){
				var _this=this;
				// var param = {
				// 		createTime: creatTime == undefined ? null : creatTime,
				// 		type: type == undefined ? null : type,
				// 		pageSize:this.pageSize,
				// 		userUid: this.$store.state.userUid,
				// 		companyUid: this.$store.state.companyUid
				// };
				var param = {
						operateType:'getAttendanceRecord',
						pageIndex : (type == 'upLoad'?this.pageIndex:1)
				};
				this.onFetching = true;
				this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat",param, function(res) {
					console.debug(res);
						if (res.data == undefined || res.data.length == 0) {
								if (type == undefined) {
										_this.myRecord = [];
								}
								if (type == 'downLoad') {
										_this.allLoaded = true;// 若数据已全部获取完毕
										if (res.ifEnd) {
												_this.isEnd = true;
										}
								}
								_this.noMore = true;

								_this.$nextTick(() => {
										_this.$refs.scrollerBottom.reset()
								})
								_this.onFetching = false

								_this.$refs.scrollerBottom.donePullup();
								_this.$refs.scrollerBottom.donePulldown();
								var dom = _this.$refs.scrollerBottom.$el;
								dom = $(dom).find('.xs-container')[0];
								$(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
								return;
						}
						
						if (type == undefined) {
							_this.myRecord = res.data;
							_this.onFetching = false;
							_this.$nextTick(() => {
								_this.$refs.scrollerBottom.reset()
							});
							_this.$refs.scrollerBottom.donePullup();
							_this.noMore = true;
							return null;

						}else if (type == 'upLoad') {
							_this.myRecord = res.data;
							_this.$nextTick(() => {
								_this.$refs.scrollerBottom.reset()
							});
							// 加载更多数据
							// _this.$refs.loadmore.onTopLoaded();
							_this.$refs.scrollerBottom.donePulldown();
							_this.onFetching = false
						} else if (type == 'downLoad') {
							_this.myRecord = _this.myRecord.concat(res.data);
							
												_this.$nextTick(() => {
								_this.$refs.scrollerBottom.reset()
							});
							_this.onFetching = false;
							_this.$refs.scrollerBottom.donePullup();
							if (res.ifEnd) {
								_this.isEnd = true;
							}
							_this.noMore = true;
							
						}

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

.red {
	background: #e49091;
}

.yg-round-lime-sea {
	background: PaleTurquoise;
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
	color: #9f9f9f;
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
	border: 1px solid #eee;
	background: #fff;
	li {
		padding: 5px;
	}
}
</style>
