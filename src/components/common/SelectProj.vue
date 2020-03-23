<template>
	<div class="choose">
		<div >
			<search  v-model="search" placeholder="搜索" :autoFixed="false" @on-submit="handleClick" ref="search"></search>
		</div>
		<div :style="checkStyle" v-if="checkSee">已选择:&nbsp;&nbsp;&nbsp;{{msg}}</div>
		<div id="scroller">
			<scroller height="-100" :use-pulldown="true" style="padding-top: 5px;" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
				<div class="box2" style="margin-top:5px;text-align: left;">	
					<li style="padding:10px;border-bottom:1px solid #eee;position:relative;text-indent:15px;" @click="checkItem($event,index,item)" v-for="(item,index) in projectList" :key="index" >
						<icon type="circle" class="icon-success" v-if="!item.checked" style="font-size:16px;"></icon>
						<icon type="success" class="icon-success" v-if="item.checked" style="font-size:16px;"></icon>
					{{item.xmmc}}
					</li>
					<div v-if="isEnd || projectList.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
				</div>
			</scroller>
		</div>
		<nav class="navbar foot navbar-default navbar-fixed-bottom" >
			
			<p>
				<x-button @click.native="goback3()" mini style="width:48%;height: 45px;background:#cccccc" type="default">取消</x-button>
				<x-button @click.native="goback(radio,$event)" mini style="width:48%;height: 45px;" type="primary">确定</x-button>
			</p>
		</nav>
	</div>
</template>

<script>
import { XButton,Search,Icon,Scroller } from 'vux'

import { mapState, mapGetters, mapActions } from 'vuex'
export default {
	name: 'selectProj',
	data() {
		return {
			value: '',
			radio: 0,
			checkSee: false,
			checkStyle: { padding: '15px 10px', textAlign: 'left', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'left', alignItems: 'left' },
			allLoaded: false,
			noMore: false,
			search: '',
			data: null,
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
				content: '',
				pullUpHeight: 50,
				height: 40,
				autoRefresh: false,
				downContent: '',
				upContent: '',
				loadingContent: 'Loading...',
				clsPrefix: 'xs-plugin-pullup-'
			},
			projectList: [],
			list: [],
			isEnd: false,
			pageSize: 10,
			pageIndex:1
		}
	},
	components: {
    	XButton,Search,Icon,Scroller
  	},
	computed: {
		msg:{
			get(){
				return (this.projectList.length == 0||this.radio == 0)?'':this.projectList[this.radio - 1].xmmc;
			}
		}
	},
	props: ['mess'],
	created() {
		var _this = this;
		this.search = '';

	},
	activated() {
		
		if (this.projectList.length == 0) {

			this.loadData('upLoad');
		}
	},
	methods: {
		onScrollBottom() {
			if (this.isEnd) {
				this.$refs.scrollerBottom.donePullup();
				return;
			}
			if (this.onFetching) {
				// do nothing
			} else {
				this.onFetching = true;
				this.noMore = false;
				this.pageIndex = this.pageIndex + 1;
				this.loadData("upLoad");

			}
		},
		loadTop() {
			this.onFetching = true;
			this.isEnd = false;
			var xmArr = this.projectList;
			this.pageIndex = 1;

			this.loadData('downLoad');

		},
		loadData(type, creatTime) {
			var param = {
				search: this.util.isNotEmpty(this.search) ? this.search : null,
				operateType: 'getProjList',
				pageIndex: (type == 'upLoad' ? this.pageIndex : 1)
			};
			var state = this.$store.state;
			var _this = this;
			if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
				_this.util.mask("正在搜索...");
			}

			_this.onFetching = true;
			this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Proj&appId=WeChat', param, function(res) {
				_this.noMore = true;
				if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
					_this.util.unmask();
				}
				// console.info(res);
				if (res.data == undefined || res.data.length == 0) {
					if (_this.util.isNotEmpty(_this.search) && type == 'downLoad') {
						_this.searchList = [];
						_this.projectList = [];
					}

					if (type == 'upLoad') {
						_this.allLoaded = true;// 若数据已全部获取完毕
						if (res.ifEnd) {
							_this.isEnd = true;
						}
					}

					_this.$nextTick(() => {
						_this.$refs.scrollerBottom.reset()
					})
					_this.onFetching = false

					_this.$refs.scrollerBottom.donePullup();
					_this.$refs.scrollerBottom.donePulldown();
					//var dom = _this.$refs.scrollerBottom.$el;
					//dom = $(dom).find('.xs-container')[0];
					//$(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
					return;
				}
				if (type == 'downLoad') {
					//下拉
					_this.projectList = res.data;
					if (_this.validUtil.isNotEmpty(_this.search)) {
						_this.searchList = _this.data;

					} else {
						_this.list = _this.projectList;
					}
					// _this.projectList = res.data;
					//console.info(_this.projectList);
					_this.$nextTick(() => {
						_this.$refs.scrollerBottom.reset()
					});
					// 加载更多数据
					// _this.$refs.loadmore.onTopLoaded();
					_this.$refs.scrollerBottom.donePulldown();
					_this.onFetching = false;
					if (res.ifEnd) {
						_this.isEnd = true;
					} else {
						_this.isEnd = false;
					}
				} else if (type == 'upLoad') {
					_this.projectList = _this.projectList.concat(res.data);
					if (_this.validUtil.isNotEmpty(_this.search)) {
						_this.searchList = _this.projectList;

					} else {
						_this.list = _this.projectList;
					}
					_this.$nextTick(() => {
						_this.$refs.scrollerBottom.reset()
					});
					_this.onFetching = false;
					_this.$refs.scrollerBottom.donePullup();
					if (res.ifEnd) {
						_this.isEnd = true;
					} else {
						_this.isEnd = false;
					}
				}
				if (_this.pageIndex == 1) {
					// _this.$nextTick(() => {
					// 	_this.$refs.scrollerBottom.reset({
					// 		top: 0
					// 	})
					// })
				}
			});
		},
		handleClick() {
			this.radio=0;
			this.checkSee=false;
			if (!this.validUtil.isNotEmpty(this.search)) {
				if (this.list.length > 0) {
					this.projectList = this.list;
					this.allLoaded = false;
					this.noMore = true;
					this.$nextTick(() => {
						this.$refs.scrollerBottom.reset()
					});
					return;
				}

			}
			this.projectList = [];
			this.pageIndex = 1;
			this.loadData("downLoad");
		},
		checkItem($event, index, item) {
			for(var i in this.projectList){
				this.projectList[i].checked=false;
			}
			item.checked=true;
			this.radio = index + 1;
			this.checkSee = true;
		},
		goback( radio, $event) {
			if (radio == null || radio ==0) {
				this.util.alert('你没有选择项目');
				return;
			}
			else {
				this.mess.selectProjVisible = false;
				this.mess.projName = this.projectList[radio - 1].proName;
				
				this.mess.projUid = this.projectList[radio - 1].xmid;
				this.$emit('selectProjCallback', { projName: this.projectList[radio - 1].proName, id: this.projectList[radio - 1].xmid });
			}
		},
		goback3() {
			this.mess.selectProjVisible = false;
		}
		
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.navbar-fixed-bottom, .navbar-fixed-top {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 45px;
    z-index: 1030;
}
.navbar-fixed-bottom{
	bottom:0px;
}
.icon-success{
	position: absolute;   
	left: -24px;
    top: 12px;
}
.icon-success::before{
	margin:0!important;
}
</style>
