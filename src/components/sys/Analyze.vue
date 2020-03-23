<template>
	<div class="sign">

		<blur :blur-amount=40 class="user-logo" :url="userLogo">
			<p class="center"><img :src="userLogo"></p>
			<h4>{{username}}</h4>
		</blur>
		<div id="signCenter" class="container">
			<ul class="row signCenter">
				<li v-for="m in signList" @click="onClick(m)" :key="m.text" class="col-xs-4">
					<span :class="m.icon" :style="m.style" class="glyphicon"></span>
					<h4>{{m.text}}</h4>
				</li>
				<li v-for="m in emptyList" :key="m.id" class="col-xs-4" style="height:116px;box-sizing:border-box">
	
				</li>
			</ul>
		</div>
		
		<div v-transfer-dom>
		<popup v-model="exportVisible" position="bottom" height="30%">
			<div class="position-horizontal-demo">
			<div>
				<p style="text-align: center;padding-top: 10px;">选择考勤月份</p>
				<datetime v-model="exportDate" placeholder="选择考勤月份" format="YYYY-MM" title="考勤月份" year-row="{value}年" month-row="{value}月" confirm-text="完成" cancel-text="取消"></datetime>
			</div>
			<nav class="navbar navbar-default navbar-fixed-bottom" style="padding-bottom: 6px;">
				<x-button @click.native="closeDialog()" mini style="width:48%;height: 38px;background: #ccc;left: 5px;" type="default">取消</x-button>
				<x-button @click.native="exportData()" mini style="width:48%;height: 38px;left: 5px;" type="primary">确定</x-button>
			</nav>
			</div>
		</popup>
		</div>
		<!-- <el-dialog style="text-align:center;" title="选择考勤月份" :visible.sync="exportVisible" size="large">			
			
			<div class="approvalFoot">
					<datetime v-model="exportDate" placeholder="选择考勤月份" format="YYYY-MM" title="考勤月份" year-row="{value}年" month-row="{value}月" confirm-text="完成" cancel-text="取消"></datetime>
			</div>
			<div class="movebxFooter">
				<el-button style="width:49%;margin:0;height:1rem;" @click="closeDialog" type="default">取消</el-button>
				<el-button @click="exportData()" style="width:49%;margin:0;height:1rem;" type="success">确定</el-button>
			</div>
		</el-dialog> -->
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Datetime,Blur,TransferDom, Popup,XButton } from 'vux'
import axios from 'axios'
export default {
	name: 'sign',
	components: {
		Datetime,Blur,Popup,XButton
	},
	data() {
		return {
			signStyle: { width: '80px', height: '80px', borderRadius: '50%' },
			emptyList: [],
			exportDate:new Date().format("yyyy-MM"),
			exportVisible:false,
			dowloadUrl:''
		}
	},
	directives: {
		TransferDom
	},
	computed: {
		...mapState({
			username: state => state.userName,
			userUid: state => state.userUid,
			companyUid: state => state.companyUid,
			userLogo: state => state.avatar
		}),
		signList: function() {
			var data = new Array();
			if (this.sessionUtil.isCompanyAdmin() || this.sessionUtil.isHr()) {
				data.push({ text: '考勤统计', icon: 'glyphicon-map-marker', style: 'color: #3774d2', path: 'sys/analyze/recordStatistics' });
				data.push({ text: '外勤看板', icon: 'glyphicon-leaf', style: 'color: #003333;', path: 'seeing/outWorkLok' });
				data.push({ text: '导出考勤', icon: 'glyphicon-save-file', style: 'color: #81da40;', fun: this.export });
				
			}
			if (this.sessionUtil.isCompanyAdmin()) {
				data.push({ text: '收入合同统计', icon: 'glyphicon-signal', style: 'color: #ad196a;', path: 'contract/statistics', query: {type:'收入'} });
				data.push({ text: '支出合同统计', icon: 'glyphicon-equalizer', style: 'color: #336666;', path: 'contract/statistics', query: {type:'支出'} });
				data.push({ text: '项目看板', icon: 'glyphicon-th', style: 'color: #666699;', path: 'projectIndex' });
				data.push({ text: '项目地图', icon: 'glyphicon-globe', style: 'color: #339999;', path: 'seeing/project' });
				data.push({ text: '报销统计', icon: 'glyphicon-book', style: 'color: #666666;', path: 'sys/analyze/moveBxStatistics' });
				data.push({ text: '报销图表分析', icon: 'glyphicon-tree-conifer', style: 'color: #663333;', path: 'seeing/moveBxChart' });
				
				
			}
			
			for (var i = data.length; i < 9; i++) {
				this.emptyList.push({id:i});
			}
			
			/*var list = [
				{ text: '组织管理', icon: 'glyphicon-th-list', style: 'color: #3774d2', path: 'org/orgManager',show:this.sessionUtil.isCompanyAdmin() || this.sessionUtil.isHr() },
				{ text: '添加用户', icon: 'glyphicon-user', style: 'color: #81da40;', path: 'org/addUser' },
				{ text: '数据字典', icon: 'glyphicon-list-alt', style: 'color: #ad196a;', path: 'sys/dicManager' },
				{ text: '流程配置', icon: 'glyphicon-certificate', style: 'color: #336666;', path: 'workflow/model/index' },
				{text: '考勤设置',icon:'glyphicon-edit',style:'color:#663333',path:'checkSeting'},
				{ text: '刷新用户信息', icon: 'glyphicon-refresh ', style: 'color: #336699;', fun: this.refresh },
				{ text: '清除缓存', icon: 'glyphicon-refresh ', style: 'color: #43DCBB;', fun: this.clear }
			];*/
			//console.info(data);
			return data;
		}
	},
	methods: {
		onClick(m) {
			if (this.util.isNotEmpty(m.path)) {
				this.$router.push({path:'/' + m.path,query:m.query});
			} else if (m.fun != undefined) {
				m.fun();
			}
		},export(){
			this.exportVisible=true;			
		},
		closeDialog(){
			this.exportVisible=false;
		},
		changeDownUrl(){
			//this.dowloadUrl=this.util.getBaseUrl()+"/wx/register/exportCheckRecord?exportDate="+this.exportDate+"&access_token="+this.util.getAccessToken();
			
		},
		exportData(){
			this.exportVisible=false;
			console.debug(this.util.getBaseUrl()+"/wx/register/exportCheckRecord?exportDate="+this.exportDate+"&access_token="+this.util.getAccessToken());
			window.open(this.util.getBaseUrl()+"/wx/register/exportCheckRecord?exportDate="+this.exportDate+"&access_token="+this.util.getAccessToken());
			
		}

	},
	created() {
		/*
		 this.util.post('/org/getOrg/', { companyUid: this.$store.state.companyUid, type: 'user' }, function (res) {
			console.info(res);
		});
		*/

	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.center {
  text-align: center;
  padding-top: 20px;
  color: #fff;
  font-size: 18px;
}
.center img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ececec;
}
.signTop {
	height: 7rem;
	padding: 20px 0 5px 0;
	background: #3BA9ED;
	color: #fff;
}
#signCenter {

	.signCenter {
		li {
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		padding: 25px 0;
		 	span {
		 		font-size: 25px;
		 	}
		}
	}
}
.count-items{
	height: 81px;
	overflow: hidden;
	background-image:linear-gradient(to bottom,#d2dbd8, #b2cdd8,#cae1e8);
}
.container .row{
	text-align: center;
}
.container .row h4{
	font-size: 14px;
	
}
.countItem{
	border-right: 1px solid #ccc;
	padding: 10px 0;
	text-align: center;
	// background: #1AC4FC;
	color: rgb(67,102,119);
	// background-image:url(http://p.qlogo.cn/bizmail/W3RpRGtwT3na3XnfzzBZZDmTqzITmxOo3PwtISLAyVeqy3uRV0ibN8A/);
}
.countItem:nth-child(3){
	border-right:0 none;
}
.countItem>h4{
	font-size: 22px;
	margin: 0;
}
.signTopList {
	padding: 56px 0;
	li {
		padding: 10px 0;
		background: #1AC4FC;
	}
}
.user-logo{
	height: 168px !important;
}
</style>

<style>


.iconfont {
	font-family: "iconfont" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
}

.icon-jinzhi:before {
	content: "\e605";
}

.icon-weizhi:before {
	content: "\e618";
}

.icon-shanchu:before {
	content: "\e606";
}

.icon-group:before {
	content: "\e60f";
}

.icon-zhiwei:before {
	content: "\e613";
}

.icon-zhuanfa:before {
	content: "\e603";
}

.icon-weixin:before {
	content: "\e610";
}

.icon-dianhua:before {
	content: "\e611";
}

.icon-iphone:before {
	content: "\e60b";
}

.icon-cuo:before {
	content: "\e600";
}

.icon-home:before {
	content: "\e614";
}

.icon-zuoji:before {
	content: "\e615";
}

.icon-kqgl:before {
	content: "\e61b";
}

.icon-remove:before {
	content: "\e607";
}

.icon-bianji:before {
	content: "\e608";
}

.icon-wqqd:before {
	content: "\e619";
}

.icon-chexiao:before {
	content: "\e601";
}

.icon-zan:before {
	content: "\e604";
}

.icon-ccxj:before {
	content: "\e61c";
}

.icon-tianjiajishi:before {
	content: "\e61d";
}

.icon-messag:before {
	content: "\e60c";
}

.icon-duanxin:before {
	content: "\e612";
}

.icon-gavin-copy:before {
	content: "\e60d";
}

.icon-bianji1:before {
	content: "\e609";
}

.icon-duihao:before {
	content: "\e602";
}

.icon-xin:before {
	content: "\e60e";
}

.icon-qingjiajiaban:before {
	content: "\e61e";
}

.icon-xiaoxi:before {
	content: "\e60a";
}

.icon-gangweizhize:before {
	content: "\e616";
}

.icon-youxiangdizhi:before {
	content: "\e617";
}

.icon-kaoqin:before {
	content: "\e61a";
}

.icon-gzt:before {
	content: "\e620";
}

.icon-bianji2:before {
	content: "\e61f";
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
}
</style>
