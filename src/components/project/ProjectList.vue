<template>
	<div class="choose">

		<div class="row" style="margin:0;">
			<search v-model="search" placeholder="搜索" :autoFixed="false" @on-submit="serachData" ref="search"></search>

		</div>

		<div id="scroller">
			<scroller height="-45" :use-pulldown="true" style="padding-top: 5px;" :pulldown-config="pulldown" :use-pullup="true" :pullup-config="pullup" lock-x @on-pulldown-loading="loadTop" @on-pullup-loading="onScrollBottom" ref="scrollerBottom">
				<div class="box2" style="margin-top:5px;">
					<div @click="seeProject(item)" v-for="(item,key) in projectList" class="user-caption-load" :key="key" :style="items">
						<div class="user-caption" style="border-bottom: 1px solid #eee;">
							<div class="user-fl-name" style="color: #9f9f9f">
								<img :src="getProjIcon(item)" alt="">&nbsp;&nbsp;项目负责人:{{item.principalName}}
							</div>
							<div class="user-fr-name">
								<span class="icon-user-fr" :style="status(item)">{{item.proStatus}}</span>
							</div>
						</div>
						<div class="col-xs-12" style="padding:5px 0px 0px;color:#bbb;margin-bottom:0px;">
							<div>
								<span style="margin:0;font-family: 'microsoft yahei';font-weight: 400;color: #101001;font-size: 13pt;">{{item.proName}}</span>
								<p style="margin: 0 0 0px;    font-size: 11pt;">
									<span style="color: #101001;">开工日期:{{item.startDate}}</span>
									<span style="float: right;color: #101001;">竣工日期:{{item.endDate}}</span>
								</p>
								<p v-if="item.province!=undefined&&item.province!=''" style="color: #101001;margin: 0 0 0px;">项目区域:{{item.province}}{{item.city}}{{item.county}}</p>
							</div>
						</div>
						<div class="user-caption user-caption-other">
							<span style="color: #9f9f9f">创建人:{{item.createUserName}}</span>
							<div class="user-fr-name">
								<span>{{item.createDate}}</span>

							</div>
						</div>
					</div>
					<div v-if="isEnd || projectList.length == 0" class="noMore" style="padding:10px;text-align: center;">已没有更多</div>
				</div>
			</scroller>
		</div>

	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Scroller, Search } from 'vux'
export default {
	name: 'projectIndex',
	data() {
		return {
			search: '',
			visit: false,
			h4: { margin: 0, fontSize: '14px' },
			proLogoStyle: { width: '52px', height: '52px', borderRadius: '50%', position: "absolute", left: '-12px', top: '15px' },
			items: {
				textAlign: 'left',
				padding: '5px 10px',
				marginBottom: '10px',
				background: '#fff',
				borderBottom: '0px solid #ccc',
				justifyContent: 'center',
				alignItems: 'center',
				borderTop: '0px solid rgb(204,204,204)',
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
				content: '',
				pullUpHeight: 50,
				height: 40,
				autoRefresh: false,
				downContent: '',
				upContent: '',
				loadingContent: 'Loading...',
				clsPrefix: 'xs-plugin-pullup-'
			},
			scrollTop: 0,
			onFetching: false,
			projectList: [],
			pageIndex: 1,
			list: [],
			searchList: [],
			allLoaded: false,
			dataType: '',
			noMore: false,
			listIndex: 0,
			isEnd: false,
			pageSize: 10
		}
	},
	components: {
		Scroller, Search
	},
	computed: {
		...mapState({
			userName: state => state.userName,
			userUid: state => state.userUid,
			companyUid: state => state.companyUid

		}),
	},
	created() {



	},
	watch: {
		dataType: function(newVal) {
			this.contractDatas = [];
			this.loadData();
		}
	},
	activated() {
		this.pageIndex = 1;
		this.$refs.scrollerBottom.reset();
		this.dataType = this.$route.query.dataType;
		var refresh = this.util.getUrlParam("refresh");
		var _this = this;
		if (this.projectList.length == 0 || refresh) {

			this.loadData('upLoad');
		}

	},
	methods: {
		addProject() {
			this.$router.push({ name: 'test/addProj' });
		},
		searchText() {
			$('#searchBar').addClass('weui-search-bar_focusing');
			$('#searchInput').focus();
		},
		serachHaldel() {
			if (!this.search.length) this.cancelSearch();
		},
		cancelSearch() {
			this.hideSearchResult();
			$('#searchBar').removeClass('weui-search-bar_focusing');
			$('#searchText').show();
		},
		searchCancel() {
			cancelSearch();
			$('#searchInput').blur();
		},
		hideSearchResult() {
			$('#searchResult').hide();
			$('#searchInput').val('');
		},
		onScrollBottom() {
			console.info(this.onFetching + "---" + this.noMore + "------" + this.isEnd);
			if (this.isEnd) {
				this.$refs.scrollerBottom.donePullup();
				return;
			}
			//console.info("----------");
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
			//console.info(type);
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
				//console.info(res);
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
		serachData() {
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
		getProjIcon(item) {
			if (this.util.isNotEmpty(item.projectLogo)) {
				return this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.projectLogo + '&access_token=' + this.util.getAccessToken();
			} else {
				return this.util.getBaseUrl() + '/images/icons/project.png';
			}

		},
		status(item) {
			//return item.percent == 100 ? "background-color:rgb(90, 214, 145)" : (item.percent > 50 ? "background-color:#c1c16b;" : "background-color:red");
			if (item.proStatus == '在建') {
				return "background-color:#c1c16b;";
			} else if (item.proStatus == '待勘察') {
				return "background-color:#009966;";
			} else if (item.proStatus == '未开工') {
				return "background-color:#993333;";
			} else if (item.proStatus == '竣工') {
				return "background-color:DodgerBlue;";
			} else if (item.proStatus == '验收') {
				return "background-color:green;";
			} else if (item.proStatus == '终止') {
				return "background-color:Gray;";
			} else {
				return "background-color:#c1c16b;";
			}

		},
		seeProject(item) {
			return ;
			item.builderUnitVisible = false;
			item.member = item.member == undefined ? [] : item.member;
			// this.$router.push({name:'projectSeeing',query:{project:item}});
			//this.$router.push({name:'test/projSeeing',query:{project:item,id:item.id}});
			var addName = item.addName;
			var procInsId = item.procInsId;
			if (this.util.isNotEmpty(addName)) {
				if (addName == this.sessionUtil.getUserId()) {
					this.$router.push({ name: 'addProject', query: { id: item.Id, isReadOnly: false,_procInstId:procInsId } });
					return;
				}
			}
			this.$router.push({ name: 'addProject', query: { id: item.Id, isReadOnly: true,_procInstId:procInsId } });

		}

	}
}

	//
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.ribbon-wrapper-green {
	overflow: hidden;
	position: absolute;
	width: 2.7rem;
	height: 2.8rem;
	top: -5px;
	right: -17px;
}

.ribbon-green {
	top: 0.25rem;
	width: 5rem;
	font-size: 0.7em;
	text-align: center;
	-webkit-transform: rotate(45deg);
	transform: rotate(45deg);
	position: relative;
	left: -0.3rem;
	background-color: rgb(90, 214, 145);
	color: rgb(251, 251, 251);
}

.Icon-style {
	border: 1px solid #eee;
	padding: 5px 5px 5px 5px;
	color: #fff;
	border-radius: 5px;
}

.right-panel {
	position: fixed;
	bottom: 1.3rem;
	right: .5rem;
}

.right-panel ul {
	margin: 0;
	padding: 0;
}

div .right-panel li {
	background-color: transparent;
}

.right-panel img {
	width: 85%;
	height: 85%;
}

.right-panel li {
	width: 1.5rem;
	height: 1.5rem;
	list-style: none;
	margin-top: .2rem;
	opacity: .9;
}

.choose {
	background: #eee;
}

h4 {
	color: #000;
}

span {
	color: #bbb;
}

footer {
	padding: 10px;
}

.user-caption {
	height: 32px;
	width: 100%;
	overflow: hidden;
}

.user-caption .user-fl-name {
	float: left;
}

.user-caption .user-fr-name {
	float: right;
}

.user-caption .user-fr-name .icon-user-fr {
	font-size: 13px;
	padding: 3px 3px 3px 5px;
	border-radius: 12px;
	color: #fff;
}

.user-caption .user-fl-name img {
	width: 28px;
	height: 28px;
	border-radius: 50%;
}

.user-caption-other {
	//   border-top:1px solid rgb(204, 204, 204);
	line-height: 32px;
}
</style>
