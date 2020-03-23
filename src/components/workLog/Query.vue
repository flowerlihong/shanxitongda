<template>
	<div class="movebx" v-loading="loading" element-loading-text="拼命加载中">
		<div class="price" style="text-align:center;    background-color: #eee;">
			<span>高级搜索</span>
			<i class="el-icon-close" @click="cancle()" style="float:right;    position: absolute;top: 18px;right: 12px;"></i>
	
		</div>
		<div class="price" style="text-align:left;">
			<span class="col-xs-3">开始日期</span>
			<datetime class="col-xs-9" v-model="startDate" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
	
		</div>
		<div class="price" style="text-align:left;">
			<span class="col-xs-3">结束日期</span>
			<datetime class="col-xs-9" v-model="endDate" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
	
		</div>
		<div id="msg" style="text-align:left;">
			<mt-cell @click.native="selectProj(selectProjModel)" style="width:100%;background-position: inherit;" title="所属项目" is-link>
				<span>{{(selectProjModel.projName!=undefined && selectProjModel.projName.length>18)?(selectProjModel.projName.substring(0,18)+'...'):selectProjModel.projName}}</span>
				<input v-model="selectProjModel.projUid" class="col-xs-9" type="text" style="display:none">
			</mt-cell>
	
		</div>
	
		<mt-popup v-model="selectProjModel.selectProjVisible" position="right" popup-transition="popup-fade" style="width:100%;height:100%">
			<SelectProj :mess="selectProjModel"></SelectProj>
		</mt-popup>
	
		<div class="footer">
			<p>
				
				<x-button @click.native="sumbit(0)" mini style="width:48%;height: 45px;" type="default">重置</x-button>
				<x-button @click.native="sumbit(1)" mini style="width:48%;height: 45px;" type="primary">查询</x-button>
			</p>
	
		</div>
	
	</div>
</template>

<script>
//var wx = require('weixin-js-sdk');
var managerConfigData;
var groupId;

import { mapState, mapGetters, mapActions } from 'vuex'
import SelectProj from '../common/SelectProj.vue'
import { XButton,Datetime } from 'vux'
export default {
	name: 'movebx',
	data() {
		return {
			loading: false,
			movebxVisible: false,
			movebxTextarea: '同意',
			movebxChecked: '',
			startDate: '',
			endDate: '',
			projName: '选择项目',
			selectProjVisible: false,
			selectProjModel:{
				selectProjVisible: false,
				projUid:null,
				projName:'请选择项目'
			},
		}
	},
	created() {
		//this.$store.state.selectProjModel.projName='aaa';
		this.selectProjModel.projUid = '';


	},
	activated() {

	},
	components: {
		// 名字
		XButton,Datetime, SelectProj
	},
	computed: {
		...mapState({
			//selectProjModel: state => state.selectProjModel
		})

	},
	methods: {
		...mapActions([

			'selectProj',
			//'selectProjCallback'

		]), cancle() {
			history.back();
		}, sumbit(flag) {
			if (flag == 0) {
				this.startDate = '';
				this.endDate = '';
				this.selectProjModel.projName = '请选择项目';
				this.selectProjModel.projUid = '';
				this.$store.state.preVue.advancedQuery.enable = false;
				return;
			}
			if (this.validUtil.isNotEmpty(this.startDate) && this.validUtil.isNotEmpty(this.endDate)) {
				if (this.endDate < this.startDate) {
					this.util.failueToast("结束日期不能比开始日期小！");
				}
			}

			//console.info(this.$store.state.preVue);
			if (this.validUtil.isNotEmpty(this.startDate) || this.validUtil.isNotEmpty(this.endDate) || this.validUtil.isNotEmpty(this.selectProjModel.projUid)) {
				//this.$store.state.preVue.data = [];
				this.$store.state.preVue.advancedQuery.enable = true;
				this.$store.state.preVue.advancedQuery.startDate = this.startDate;
				this.$store.state.preVue.advancedQuery.endDate = this.endDate;
				this.$store.state.preVue.advancedQuery.projUid = this.selectProjModel.projUid;
				//this.$store.state.preVue.search = this.projName;
				this.$store.state.preVue.loadData();
				history.back();
				return ;
			}
			this.$store.state.preVue.advancedQuery.enable = false;
			this.$store.state.preVue.data = this.$store.state.preVue.list;
			this.$store.state.preVue.loadTop();
			history.back();
			
		}
		//this.util.alert(JSON.stringify(this.attachmentModel.fileList));
	}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
</style>
