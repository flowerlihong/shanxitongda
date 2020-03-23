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
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Blur } from 'vux'
import axios from 'axios'
export default {
	name: 'sign',
	components: {
		Blur
	},
	data() {
		return {
			signStyle: { width: '80px', height: '80px', borderRadius: '50%' },
			
			emptyList: [],
			webUrl: ''
		}
	},
	computed: {
		...mapState({
			username: state => state.userName,
			userUid: state => state.userUid,
			userLogo: state => state.avatar
		}),
		signList: function() {
			var data = new Array();
			if (this.sessionUtil.isCompanyAdmin() || this.sessionUtil.isHr()) {
				data.push({ text: '考勤设置', icon: 'glyphicon-edit', style: 'color:#663333', path: 'checkSeting' });
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
		gotoRegister() {
			window.location.href = this.webUrl + "/wx/register/initPage?userUid=" + this.userUid;
		},
		onClick(m) {
			if (this.util.isNotEmpty(m.path)) {
				this.$router.push('/' + m.path);
			} else if (m.fun != undefined) {
				m.fun();
			}
		}, refresh() {
			this.util.mask("正在刷新...");
			//$('.vux-loading').show();
			//alert("okkkk");
			//this.util.alert("ok");
			setTimeout(this.refreshFun,100);

			
		}, refreshFun() {
			//alert("okkkk");
			var session = this.util.refreshSession();
			//$('.vux-loading').hide();
			if (session != null) {
				this.$store.state.session = session;
			}
			this.util.unmask();
		}, clear() {
			//alert("okkkk");
			this.util.clearCookie();
			this.util.successToast("清除成功!");
		}

	},
	created() {
		

	}, activated() {
        this.util.init(this);
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
.user-logo{
	height: 168px !important;
}
.head-kh {
	background: url(../../public/image/bg-account.jpg);
	background-size: 100% 100%;
}

.signTop {
	//height: 7rem;
	padding: 20px 0 5px 0; //background: #3BA9ED;
	color: #fff;
}

#signCenter {

	.signCenter {
		li {
			border-left: 0.1px solid #eee;
			border-bottom: 1px solid #eee;
			padding: 25px 0;
			span {
				font-size: 25px;
			}
		}
	}
}
.container .row{
	text-align: center;
}
.container .row h4{
	font-size: 14px;
	
}
.signTopList {
	padding: 56px 0; //font-family: "微软雅黑";
	font-size: 2pt;
	li {
		padding: 10px 0;
		background: #1AC4FC;
	}
}

.icon-21 {
	font-size: 2.1em!important;
}

.icon-25 {
	font-size: 2.5em!important;
}
</style>


