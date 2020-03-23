<template>
	<div class="sign">
		<!-- <div class="signTop head-kh">
			<img :style="signStyle" :src="userLogo" alt="">
			<h4>{{username}}</h4>
	
		</div>
		<div id="signCenter" class="container">
			<ul class="row signCenter">
				<li v-for="m in signList" @click="onClick(m)" :key="m.text" class="col-xs-4">
					<span :class="m.icon" :style="m.style" class="glyphicon"></span>
					<h4>{{m.text}}</h4>
				</li>
				<li v-for="m in emptyList" :key="m.id" class="col-xs-4">
	
				</li>
			</ul>
		</div> -->
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
export default {
	name: 'sign',
	components: {
		Blur
	},
	data() {
		return {
			signStyle: { width: '80px', height: '80px', borderRadius: '50%' },
			signList: [
				{ text: '物品领用', icon: 'glyphicon-book', style: 'color: #3774d2', path: 'apply/applyGoods' },
				{ text: '采购申请', icon: 'glyphicon-shopping-cart', style: 'color: #81da40', path: 'apply/applyPurchase' },
				{ text: '借款申请', icon: 'glyphicon-yen', style: 'color: #ad196a', path: 'apply/applyBorrowing' },
				{ text: '付款申请', icon: 'glyphicon-ruble', style: 'color: #336699', path: 'apply/applyPayment' },
				{ text: '费用报销', icon: 'glyphicon-bitcoin', style: 'color: #663333', path: 'movebx' },
				{ text: '加班申请', icon: 'glyphicon-lamp', style: 'color: #669999', path: 'apply/applyWorkover' },
				{ text: '请假申请', icon: 'glyphicon-plane', style: 'color: #3399cc', path: 'addLeave' },
				{ text: '转正申请', icon: 'glyphicon-leaf', style: 'color: #666666', path: 'apply/applyRegularWork' },
				{ text: '通用申请', icon: 'glyphicon-send', style: 'color: #3774d2', path: 'apply/applyCommon' }
			],
			emptyList: [{ id: 1 }],
			webUrl: ''
		}
	},
	computed: {
		...mapState({
			username: state => state.userName,
			userUid: state => state.userUid,
			userLogo: state => state.avatar
		}),
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
		}

	},
	created() {


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
			//border: 1px solid #eee;
			padding: 30px 0;
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


