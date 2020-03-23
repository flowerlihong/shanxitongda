<template>
  <div class="projectIndex">
	  <div class="signTop">
			<div class="row">
					<img class="iStyle" :src="getProjIcon(project)" alt="">
					<span class="col-xs-7">{{project.proName}}</span>
					<div v-if="project.createUser==userUid" @click="editProject()" class="col-xs-1" style="text-align: center;">
						<span style="font-size:26px" class="glyphicon glyphicon-edit"></span>
					</div>
			</div>
			
			<div style="text-align: center;">
				<ul class="signTopList">
					<li class="col-xs-4">
						<h4>项目负责人</h4>
						<div style="height: 20px;">
								<span>{{project.principalName}}</span>
						</div>
					</li>
					<li class="col-xs-4"><h4>开工日期</h4>
						<div style="height: 20px;">
								<span>{{project.startDate}}</span>
						</div>
					</li>
					<li class="col-xs-4"><h4>竣工日期</h4>
						<div style="height: 20px;">
								<span>{{project.endDate}}</span>
						</div>
					</li>
				</ul>
		</div>
	</div>
  	
	<div class="vux-circle-demo">
		<div style="float:left;padding:0px 8px;">
			<span>项目进度</span>
			<p >{{project.percent_}}%</p>
		</div>
		<div class="weui-slider" style="overflow:hidden;margin-top:5px;">
            <div class="weui-slider__inner">
                <div :style="{width: project.percent_+'%'}" class="weui-slider__track"></div>
                <div :style="{left: project.percent_+'%'}" class="weui-slider__handler"></div>
            </div>
        </div>

	</div>
	<!-- <em style="height: 0.2rem;width: 100%;display: block;background: #ccc;"></em> -->
	<div style="background-color: white;">
		<div class="middle" style="border-bottom: 1px solid #ccc;">
				<div class="pop" style="">
					<div class="col-xs-5">
						<div style="float: left;">
							<i class="iconfont icon-qingjiajiaban icon-25 color2" style="font-size: 30px;color: rgb(15, 128, 228);"></i>
						</div>
						<div style="margin-left: 10px;">项目概况</div>
					</div>
				</div>
		</div>
		<div class="oh" style="height:247px">
				<div class="col-xs-3" @click="goto('sumbitChoose',{query:{projUid:project.id,refresh:true}})">
					<svg class="icon item-icon" aria-hidden="true">
						<use xlink:href="#icon-baoxiao"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.bxCount==undefined? 0:generalCountObj.bxCount}})</p>
					<p class="textStyle">报销</p>
				</div>
				<div class="col-xs-3 tc" @click="goto('workOrderlList',{query:{projUid:project.id,refresh:true}})">
					<svg class="icon item-icon" aria-hidden="true">
						<use xlink:href="#icon-gongdan"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.workOrderCount==undefined? 0:generalCountObj.workOrderCount}})</p>
					<p class="textStyle">工单</p>
				</div>
				<div class="col-xs-3" @click="goto('workVisa/list',{query:{projUid:project.id,refresh:true}})">
					<svg class="icon item-icon" style="color: #006633;" aria-hidden="true">
						<use xlink:href="#icon-qianzheng"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.visaCount==undefined? 0:generalCountObj.visaCount}})</p>
					<p class="textStyle">签证</p>
				</div>
				<div class="col-xs-3" @click="goto('record/show',{query:{projUid:project.id,isReadOnly:true}})">
					<svg class="icon item-icon" style="color: #006633;" aria-hidden="true">
						<use xlink:href="#icon-unie62e"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.pictureCount==undefined? 0:generalCountObj.pictureCount}})</p>
					<p class="textStyle">图片</p>
				</div>
				
				<div class="col-xs-3" @click="goto('workReport/myReport',{query:{projUid:project.id,refresh:true,dataType:'myCreate'}})">
					<svg class="icon item-icon" style="color: #663300" aria-hidden="true">
						<use xlink:href="#icon-huibaojilu"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.workReportCount==undefined? 0:generalCountObj.workReportCount}})</p>
					<p class="textStyle">汇报</p>
				</div>
				<div class="col-xs-3 tc" @click="goto('proj/workLog/index',{query:{projUid:project.id,isStatistics:true,refresh:true}})">
					<svg class="icon item-icon" style="color: #003366" aria-hidden="true">
						<use xlink:href="#icon-portal-icon-rizhi"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.workLogCount==undefined? 0:generalCountObj.workLogCount}})</p>
					<p class="textStyle">日志</p>
				</div>
				<div class="col-xs-3" @click="goto('contract/list',{query:{projUid:project.id,refresh:true,type:'收入'}})">
					<svg class="icon item-icon" style="color: #663333" aria-hidden="true">
						<use xlink:href="#icon-hetong"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.inContractCount==undefined? 0:generalCountObj.inContractCount}})</p>
					<p class="textStyle">收入合同</p>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/list',{query:{projUid:project.id,refresh:true,type:'支出'}})">
					<svg class="icon item-icon" style="color: #666699" aria-hidden="true">
						<use xlink:href="#icon-zhichuhetong"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.outContractCount==undefined? 0:generalCountObj.outContractCount}})</p>
					<p class="textStyle">支出合同</p>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/money',{query:{projUid:projUid,dataType:'income'}})">
					<svg class="icon item-icon" style="color: #cc99cc" aria-hidden="true">
						<use xlink:href="#icon-shoukuan"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.gatherMoneyCount==undefined? 0:generalCountObj.gatherMoneyCount}})</p>
					<p class="textStyle">收款</p>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/money',{query:{projUid:projUid,dataType:'outcome'}})">
					<svg class="icon item-icon" style="color: #006699" aria-hidden="true">
						<use xlink:href="#icon-fukuan"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.payMoneyCount==undefined? 0:generalCountObj.payMoneyCount}})</p>
					<p class="textStyle">付款</p>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/invoiceProjList',{query:{projUid:projUid,dataType:'income',totalAmount:generalCountObj.incomeInvCount==undefined? 0:generalCountObj.incomeInvCount}})">
					<svg class="icon item-icon" style="color: #cc99cc" aria-hidden="true">
						<use xlink:href="#icon-jinxiangfapiaoliebiao"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.incomeInvCount==undefined? 0:generalCountObj.incomeInvCount}})</p>
					<p class="textStyle">进项发票</p>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/invoiceProjList',{query:{projUid:projUid,dataType:'outcome',totalAmount:generalCountObj.outInvCount==undefined? 0:generalCountObj.outInvCount}})">
					<svg class="icon item-icon" style="color: #99cc33" aria-hidden="true">
						<use xlink:href="#icon-c-invoice"></use>
					</svg>
					<p class="countStyle">({{generalCountObj.outInvCount==undefined? 0:generalCountObj.outInvCount}})</p>
					<p class="textStyle">销项发票</p>
				</div>
				
			</div>
		<!-- <div class="oh" style="height:247px">
				<div class="col-xs-3 tc" @click="goto('sumbitChoose',{query:{projUid:project.id,refresh:true}})">
					<div class="yg-round yg-round-lime-green" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">报销</p>
							<p class="sl">{{generalCountObj.bxCount==undefined? 0:generalCountObj.bxCount}}</p>
						</div>
					</div>
				</div>

				<div class="col-xs-3 tc" @click="goto('workOrderlList',{query:{projUid:project.id,refresh:true}})">
					<div class="yg-round yg-round-lime-sss" title="请假天数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">工单</p>
							<p class="sl">{{generalCountObj.workOrderCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('workVisa/list',{query:{projUid:project.id,refresh:true}})">
					<div class="yg-round yg-round-lime-sea" title="外勤天数，点击查看详情" style="cursor:pointer;background: #cccc99;">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">签证</p>
							<p class="sl">{{generalCountObj.visaCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('record/show',{query:{projUid:project.id,isReadOnly:true}})">
					<div class="yg-round yg-round-lime-sea" title="外勤天数，点击查看详情" style="cursor:pointer;background: #cccccc;">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">图片</p>
							<p class="sl">{{generalCountObj.pictureCount}}</p>
						</div>
					</div>
				</div>
				
				<div class="col-xs-3 tc" @click="goto('workReport/myReport',{query:{projUid:project.id,refresh:true,dataType:'myCreate'}})">
					<div class="yg-round yellow" title="未打卡天数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">汇报</p>
							<p class="sl">{{generalCountObj.workReportCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('proj/workLog/index',{query:{projUid:project.id,isStatistics:true,refresh:true}})">
					<div class="yg-round yg-round-lime-sea" title="外勤天数，点击查看详情" style="cursor:pointer">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">日志</p>
							<p class="sl">{{generalCountObj.workLogCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/list',{query:{projUid:project.id,refresh:true,type:'收入'}})">
					<div class="yg-round" title="早退天数，点击查看详情" style="cursor:pointer;background: #669999;">
						<div class="yg-round yg-round-white" >
							<p class="ft14 mt20 c999">收入合同</p>
							<p class="sl">{{generalCountObj.inContractCount==undefined? 0:generalCountObj.inContractCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/list',{query:{projUid:project.id,refresh:true,type:'支出'}})">
					<div class="yg-round" title="早退天数，点击查看详情" style="cursor:pointer;background: #ccffcc;">
						<div class="yg-round yg-round-white" >
							<p class="ft14 mt20 c999">支出合同</p>
							<p class="sl">{{generalCountObj.outContractCount==undefined? 0:generalCountObj.outContractCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/money',{query:{projUid:projUid,dataType:'income'}})">
					<div class="yg-round yg-round-lime-sea" style="cursor:pointer;background: #cc99cc;">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">收款</p>
							<p class="sl">{{generalCountObj.gatherMoneyCount==undefined? 0:generalCountObj.gatherMoneyCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/money',{query:{projUid:projUid,dataType:'outcome'}})">
					<div class="yg-round yg-round-lime-sea"  style="cursor:pointer;background: #99ccff;">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">付款</p>
							<p class="sl">{{generalCountObj.payMoneyCount==undefined? 0:generalCountObj.payMoneyCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/invoiceProjList',{query:{projUid:projUid,dataType:'income',totalAmount:generalCountObj.incomeInvCount==undefined? 0:generalCountObj.incomeInvCount}})">
					<div class="yg-round yg-round-lime-sea" style="cursor:pointer;background: #cc99cc;">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">进项发票</p>
							<p class="sl">{{generalCountObj.incomeInvCount==undefined? 0:generalCountObj.incomeInvCount}}</p>
						</div>
					</div>
				</div>
				<div class="col-xs-3 tc" @click="goto('contract/invoiceProjList',{query:{projUid:projUid,dataType:'outcome',totalAmount:generalCountObj.outInvCount==undefined? 0:generalCountObj.outInvCount}})">
					<div class="yg-round yg-round-lime-sea"  style="cursor:pointer;background: #99ccff;">
						<div class="yg-round yg-round-white">
							<p class="ft14 mt20 c999">销项发票</p>
							<p class="sl">{{generalCountObj.outInvCount==undefined? 0:generalCountObj.outInvCount}}</p>
						</div>
					</div>
				</div>
				
			</div> -->
				
			<div class="middle" style="overflow:hidden;border-top:1px solid #eee;width: 100%;">
				<div class="col-xs-3 tc " @click="goto('checkBillList',{query:{projUid:projUid,refresh:true}})" >
					<div class="yg-round yg-round-lime-sea"  style="cursor:pointer;background: #336699;width:60px;height:60px;">
						<div class="yg-round yg-round-white"style="left:5px;top:1px;width:50px;height:50px;">
							<p class="ft14 mt20 c999" style="padding-top: 7px;">{{generalCountObj.qualityCount}}</p>
						</div>
					</div>
					<p>质量检查</p>
				</div>
				<div class="middle-line col-xs-9">
					<p>待整改：{{generalCountObj.qualityNotRefCount}}</p>
					<p>已整改：{{generalCountObj.qualityRefCount}}</p>
					<p>警告：</p>
				</div>
			</div>
			<div class="middle" style="overflow:hidden;border-top:1px solid #eee;">
				<div class="col-xs-3 tc " @click="goto('safetyCheckBillList',{query:{projUid:project.id,refresh:true}})" >
					<div class="yg-round yg-round-lime-sea"  style="cursor:pointer;background: #336666;width:60px;height:60px;">
						<div class="yg-round yg-round-white"style="left:5px;top:1px;width:50px;height:50px;">
							<p class="ft14 mt20 c999" style="padding-top: 7px;">{{generalCountObj.safetyCount}}</p>
						</div>
					</div>
					<p>安全检查</p>
				</div>
				<div class="middle-line col-xs-9">
					<p>待整改：{{generalCountObj.safeNotRefCount}}</p>
					<p>已整改：{{generalCountObj.safeRefCount}}</p>
					<p>警告：</p>
				</div>
			</div>
			<div class="middle" style="overflow:hidden;border-top:1px solid #eee;">
				<div class="col-xs-3 tc " @click="goto('polling/list',{query:{projUid:projUid,refresh:true}})" >
					<div class="yg-round yg-round-lime-sea"  style="cursor:pointer;background: #663333;width:60px;height:60px;">
						<div class="yg-round yg-round-white"style="left:5px;top:1px;width:50px;height:50px;">
							<p class="ft14 mt20 c999" style="padding-top: 7px;">{{generalCountObj.pollingCount}}</p>
						</div>
					</div>
					<p>巡检</p>
				</div>
				<div class="middle-line col-xs-9">
					<p>已通知：{{generalCountObj.pollingNotiCount}}</p>
					<p>已整改：{{generalCountObj.pollingRefCount}}</p>
				</div>
			</div>
		</div>
		
	<div >
		<div class="middle" style="border-bottom: 1px solid #eee;">
			<div class="pop" style="">
				<div class="col-xs-5">
					<div style="float: left;">
						<i class="glyphicon glyphicon-equalizer" style="font-size: 30px;color:#996699;"></i>
					</div>
					<div style="margin-left: 10px;">劳动力分析</div>
				</div>
			</div>
		</div>
		<div style="width: 100%;height: 300px;margin-top: -16px;" id="myChart"></div>
			
	</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {cookieUtil } from '@/utils/utils.js'
import '@/public/js/iconfont5.js';
import echarts from 'echarts'
export default {
  name: 'projectIndex',
  data () {
    return {
		checkStyle: {padding: '5px 10px 10px',textAlign:'left',display: 'flex'},
        workLogRang: 20,
    	h4: {margin:0},
		project:{},
		generalCountObj:{},
		myChart:{},
		xAxisData:[],
		yearResult:[],
		projUid:''
    }
  },
	components: {
    
  },
	mounted () {
		this.myChart = echarts.init(document.getElementById('myChart'));
		

  },
	computed: {
  	...mapState({
			userUid: state => state.userUid,
  	}),
  },
	created(){
	  	var d = new Date();  
		var result = [];  
		for(var i = 0; i < 12; i++) {  
			d.setMonth(d.getMonth() - 1); 
			var m = d.getMonth() + 1;  
			m = m < 10 ? "0" + m : m;   
			
			result.push(d.getFullYear()+""+ m);  
		}  
		this.xAxisData = result.reverse();
  },
	activated(){
		var projectObj = this.$route.query.project;
		this.projUid = this.util.getUrlParam("id");
		cookieUtil.set("projUid", this.projUid);
		this.initChart();
		var _this=this;
		this.util.mask();
		this.util.post("/wx/project/getGeneralCount",{projUid:this.projUid},function(data){
				_this.util.unmask();
				_this.generalCountObj=data;
				
		});
		if(typeof(projectObj)!="string"){
			this.project=projectObj;
			cookieUtil.set("projName", this.project.proName);
		}
	},
  methods:{
  	 editProject(){
			
      	 this.$router.push({name:'test/addProj',query:{id:this.projUid}});
	},
	getProjIcon(item){
		if(this.util.isNotEmpty(item.projectLogo)){
			return this.util.getBaseUrl() + '/attachment/look?id=' + item.projectLogo + '&access_token=' + this.util.getAccessToken();
		}else{
			return this.util.getBaseUrl()+'/static/img/project.png';
		}
		
	},
	initChart(){
		var _this = this;
		var param = {
			projUid:this.projUid,
			companyUid: this.$store.state.companyUid,
			xAxisData:this.xAxisData.join(",")
		};
		
		this.util.mask();
		this.util.sycnPost("/wx/project/getChartData",param,function(res){
			if(res.status==200){
				_this.yearResult=res.data;
			}
			_this.util.unmask();
		});
		var option = {
			// title : {
			// 	text: '劳动力分析',
			// 	x:'center'
			// },
			tooltip : {
				trigger: 'axis'
			},
			calculable : true,
			xAxis : [
				{
					type : 'category',
					boundaryGap : false,
					data : this.xAxisData
				}
			],
			yAxis : [
				{
					name : '单位(人)',
					type : 'value'
				}
			],
			series : [
				{
					name:'施工人数',
					type:'line',
					smooth:true,
					itemStyle: {normal: {areaStyle: {type: 'default'}}},
					data:this.yearResult
				}
			]
		};
		this.myChart.setOption(option);
	},
  }
}
</script>

<style lang="scss" scoped>
.item-icon{
	font-size: 38px;
	margin-top: 8px;
	
}
.countStyle{
	margin: 2px;
    line-height: 12px;
	font-size: 11px;
}
.textStyle{
	font-size: 13px;
	color: #999;
}
.projectIndex{
	overflow: hidden;
}
.user-logo{
	height: 116px !important;
}
.count-items{
	height: 63px;
	overflow: hidden;
	background-image:linear-gradient(to bottom,#d2dbd8, #b2cdd8,#cae1e8);
}
.countItem{
	border-right: 1px solid #ccc;
	padding: 10px 0;
	text-align: center;
	color: rgb(67,102,119);
	// background-image:url(http://p.qlogo.cn/bizmail/W3RpRGtwT3na3XnfzzBZZDmTqzITmxOo3PwtISLAyVeqy3uRV0ibN8A/);
}
.countItem:nth-child(3){
	border-right:0 none;
}
.countItem>h4{
	font-size: 18px;
	margin: 0;
}
.iStyle{
	display: inline-block;
    width: 70px;
    height: 70px;
    float: left;
	border-radius:8px;
    margin-left: 20px;
    background-repeat: no-repeat;
    background-size: cover;
}
.box1 {
  height: 100px;
  position: relative;
  // width: 530px;
}
.box1-item {
  width: 80px;
  height: 80px;
	border-radius: 40px;
	border:solid rgb(80,80,80) 1px;
  background-color: #ccc;
  display:inline-block;
  margin-left: 15px;
  float: left;
  text-align: center;
  line-height: 100px;
}
.box1-item:first-child {
  margin-left: 0;
}
.vux-circle-demo {
  text-align: left;
  height:55px;
  margin-top:21px;
  overflow:hidden;
  width:100%;

}
.vux-circle-demo > div {
  margin: 0 auto;
}
.vux-circle-demo p{
	text-align: center;
}
.signTop {
	height: 4rem;
	padding: 20px 0 158px 0;
	background: #336666;
	color: #fff;
	text-align: left;
}

.signTopList {	
	padding: 20px 0;
	li {
		padding: 10px 0;
		// background: rgb(67,102,119);
		color: rgb(67,102,119);
		background-image:linear-gradient(to bottom,#d2dbd8, #b2cdd8,#cae1e8);
	}
}
.box2{
	text-align:left;
	font-family:'microsoft yahei'
	
}
.day-late-all{
	background-color:#fff;
	margin:18px 10px;
	min-height: 130px;
    padding: 10px;
	padding-top:13px;
	position:relative;
}
.day-late-all>p{
	margin:0;
	margin-bottom:4px;
	color:#9f9f9f;
}
.day-late-all>p>span{
	color:#101001
}
.box3{
	color:#fff;
	text-align:right;
	position:absolute;
	width:148px;
	font-size:12px;
	height:20px;	
	top:10px;right:10px;
}
.box3>span{
	padding:0px 2px;
}

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
	width: 78px;
	height: 78px;
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

.yg-round-lime-green{
	background:LightGreen;
}
.yg-round-lime-sea{
	background:PaleTurquoise;
}
.yg-round-lime-sss{
	background:LightPink;
}
.yg-round .yg-round-white {
	background: #fff;
	width: 54px;
	height: 54px;
	position: absolute;
	left: 12px;
	top: 9px;
	font-size: 20px;
}

.yg-round .sl {
	margin-top: -12px !important;
    font-size: 11px;
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
	font-size: 13px;
}

.c999 {
	color: #999;
}

.mt20 {
	margin-top: 10px !important;
}
.jilu{
	padding-top:9px;
	font-size:16px;
}
body {
	background-color: #efeff4!important;
}
.attitem {
	padding: 5px;
	border: 1px solid #eee;
	background: #fff;
}
.middle p{font-size:12px;}
.middle-line{
	margin-top:10px;
	position:relative;
}
.middle-line:before{
	content:'';
	position:absolute;
	width:1px;
	height:60px;
	background:#eee;
	left:0;
	top:7.5px;
}
</style>
