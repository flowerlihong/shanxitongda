<template>
  <div class="approval" id="div_show_news">
	   <div class="approvalMiddle" style="text-align:left;padding-left:13px">
	   		<h4>{{newsData.title}}</h4>
	   		<div>
			   <p><span>{{newsData.DocCreated}}</span>&nbsp;&nbsp; <span>{{newsData.AddName_CN}}</span>&nbsp;&nbsp; 
			   <a v-if="newsData.createUserUid==userUid" @click="goto('news/add',{query:{id:newsData.id}})">编辑</a>&nbsp;&nbsp;  
			   <!-- <a >关闭查阅</a>  -->
			   </p>
			</div>
			<div class="pageBody">
				<div class="img-box">
					<img :src="newsLogoUrl" alt="">
				</div>
				<div id="content" style="padding-top:13px;font-size:16px" >
				
				</div>
				<div class="img-box">
					<img v-for="(img,index) in fileList" :src="img.src" alt="" :key="index">
				</div>	
				<div style="font-size:12px;color:#7f7f7f;margin-top: 10px">
					<svg class="icon" aria-hidden="true" style="font-size:14px;">
						<use xlink:href="#icon-readmail"></use>
					</svg>
					<span>{{newsData.lb}}</span>
					<span  class="isread">已阅({{newsData.readNum}})</span>
					
				</div>
				<div class="dianzan">
					<div class="zan-click" @click="like">
						<svg class="icon " aria-hidden="true" style="font-size:25px;">
							<use xlink:href="#icon-zan"></use>
						</svg>
					</div>
					<div class="zan-num-box">
						<svg class="icon zan-num" aria-hidden="true">
							<use xlink:href="#icon-zan"></use>
						</svg>
						<span>{{likeNum}}赞</span>
						<p>{{likeUsers}}</p>

						
					</div>
				</div>
				<div class="next-or-pre">
					<!-- <span class="or-pre-fl">上一篇</span>
					<span class="or-next-fr">下一篇</span> -->
				</div>	
			</div>
			
		</div>
  	  	<div class="reply">
			<div class="reply-head">
				<span>回复({{replyDatas.length}})</span>
			</div>
			<div v-if="replyDatas.length==0" class="reply-none">暂无回复</div>
			<div v-if="replyDatas.length>0" class="reply-list">
				<ul>
					<li v-for="item in replyDatas" >
						<div class="reply-fl-img">
							<img class="reply-fl-img" :src="item.userPic" alt="">
						</div>
						<div class="reply-fr-box">
							<div class="reply-head-box">
								<span class="reply-name">{{item.userName}}</span>
								<span class="reply-time">{{item.createDate}}</span>
							</div>
							<div class="reply-content">{{item.content}}</div>
							<!-- <img :src="item.userPic" class="reply-content"> -->
						</div>
					</li>
				</ul>
			</div>
		</div>
	  <!--评论-->
	<div class="footer">
		<div>
			<div class="add-button">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#icon-add11"></use>
				</svg>
			</div>
			<input v-model="comment"  placeholder="说点什么吧" type="text">
			<button style="background: #99cccc;" @click="saveReply">发表</button>
		</div>
	</div>
  </div>
</template>

<script>
import '@/public/js/iconfont3.js';
import {mapState,mapGetters, mapActions} from 'vuex'
import {amountLtoU,getNextActInfo,getHistoricTask,getArgFromHref} from '@/utils/utils.js'
export default {
  name: 'approval',
  components:{
      // 名字
    //   Flow
  },
  data () {
    return {
    	left: {textAlign:'left'},
		bootBtn: {padding:'5px 10px',marginTop:'10px',height:'1.5rem'},
    	comment: '',     
		newsData:{},
		replyDatas:[],
		headFile:'',
		fileList:[],
		webUrl:'',
		access_token:'',
		id:'',
		likeUsers:'',
		likeNum:0,
		likeFlag:false,
		newsLogoUrl:''
	}
	
  },
  watch:{
      id:function(newVal){
			this.insertReader();
      }
  },
   created(){
 	 	this.webUrl = this.util.getBaseUrl();
		this.access_token = this.util.getAccessToken();
		
   },
   activated(){
		this.id = this.$route.query.id;
		var newsLogoId = this.util.getUrlParam("newsLogoId");
		this.newsLogoUrl = this.util.getBaseUrl()+"/attachmentAction!look.action?id="+newsLogoId;
		if(this.util.isNotEmpty(this.id)){
			this.loadData();
			this.getLikeReadData();
			this.getReplyData();
		}
		
		
   },
   computed: {
  	...mapState({
			userUid: state => state.userUid,
		   	userName: state => state.userName
			
  		})
  },
  methods: {
	  	showReadPeople(){
			  this.$router.push({name:'seeing/peopleList',query:{id:this.id}});
		},
	  	loadData(){
			var _this=this;
			this.fileList=[];
			_this.util.mask("正在加载...");
			this.util.initData({id:this.id ,sqlTableName:"G001_office_doc"},function(data){
				_this.newsData=data;
				//alert(data.nr);
				//console.info(data.nr);
				//console.info("===========================");
				if(_this.util.isNotEmpty(data.nr)){
					//data.nr = data.nr.replace(new RegExp("\n","g"),"<br/>");
					//data.nr = data.nr.replace(new RegExp(" ","g"),"&nbsp;");
					//console.info(data.nr);
					$('#content').html(data.nr);
					//console.info($('#content').html());
				}
				_this.util.unmask();
				
			});
		
		},
  		previewImage(curId,curData){
			var imgId = this.webUrl+curId;
			var imgIds=[];
			for(var i=0;i<curData.length;i++){
				imgIds.push(webUrl+curData[i].src);
			}
			this.wx.previewImage({
				current: imgId, // 当前显示图片的http链接
				urls: imgIds // 需要预览的图片http链接列表
			});
		},
		insertReader(){
			var _this=this;
			var param = {
					operateType:'insertNewsReader',
					userUid:this.userUid,
					userName:this.userName,
					newsUid:this.id
			};
			this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_News&appId=WeChat",param,function(res){
				_this.util.unmask();
				if (res.status == 200) {
					
				}
				
				
			});
			
		},
		getLikeReadData(){
			var _this=this;
			var param = {
					operateType:'getLikeReadData',
					newsUid:this.id,
					userUid:this.userUid
			};
			this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_News&appId=WeChat', param, function (res) {
				if (res.status == 200) {
					_this.newsData.readNum=res.data.readNum;
					_this.likeNum=res.data.likeNum;
					_this.likeUsers=res.data.likeUsers;
					if(res.data.iflike=="1"){
						_this.likeFlag= true;
						$('.zan-click').css({color:'#FF9600',backgroundColor:'#FFEACA',borderColor:'#FFEACA'})
					}else{
						$('.zan-click').css({color:'#aaa',backgroundColor:'#fff',borderColor:'#eee'})
						_this.likeFlag= false;
					}
				}
			});
		},
		getReplyData(){
			var _this=this;
			var param = {
					operateType:'getReplyData',
					newsUid:this.id
			};
			this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_News&appId=WeChat', param, function (res) {
				if (res.status == 200) {
					_this.replyDatas=res.data;
				}
			});
		},
		like(){
			var _this=this;
			this.likeFlag=!this.likeFlag
			var param = {
					operateType:'updateLikeStatus',
					userUid:this.userUid,
					newsUid:this.id
			};
			if(this.likeFlag){
				param['status']=1;
				
			}else{
				
				param['status']=0;
			}
			this.util.post("/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_News&appId=WeChat",param,function(res){
				_this.util.unmask();
				if (res.status == 200) {
					if(_this.likeFlag){
						$('.zan-click').css({color:'#FF9600',backgroundColor:'#FFEACA',borderColor:'#FFEACA'});
							// _this.likeNum+=1;
							// if(_this.likeUsers!=undefined&&_this.newsData.likeUsers!=""){
							// 	var likers =_this.likeUsers.split(",");
							// 	likers.push(_this.userName);
							// 	_this.likeUsers=likers.join(",");
							// }else{
							// 	_this.likeUsers=_this.userName;
							// }
							_this.getLikeReadData();
					}else{
						$('.zan-click').css({color:'#aaa',backgroundColor:'#fff',borderColor:'#eee'})
						// _this.likeNum--;
						// var likers =_this.likeUsers.split(_this.userName);
						
						// for(var i=0; i<likers.length; i++) {
						// 	if(likers[i] == _this.userName) {
						// 		likers.splice(i, 1);
						// 		break;
						// 	}
						// }
						// if(likers[0]==""){
						// 	_this.likeUsers="";
						// }else{
						// 	_this.likeUsers=likers.join(",");
						// }
						_this.getLikeReadData();
					}
				}
				
				
		});
		},
		saveReply(){
			if(!this.validUtil.isNotEmpty(this.comment)){
				this.util.failueToast("请输入评论内容");
				return;
			}
			var _this=this;
			var mainFormData = {
				CONTENT_: this.comment,
				USER_NAME_: this.userName,
				NEWS_UID_: this.id
			};
			var params = { sqlTableName: 'T_NEWS_COMMENT', mainFormData: JSON.stringify(mainFormData) };
			
			_this.util.mask("正在保存");
			_this.util.post('/admin/appDefaultFormAction!saveData.action', params, function (res) {
				if (res != undefined && res != null) {
					if (res.success) {
						_this.util.successToast("保存成功！");
						_this.comment="";
						_this.getReplyData();
					} else {
						_this.util.failueToast("保存失败" + res.errorMsg);
					}
				}

				_this.util.unmask();
			});
			

		}
		
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
ul{
	margin: 0;
}
 
.piaojv {
	border-top: 1px solid #eee;
	padding: 10px 0 0 0;
	height: 100%;
	span {
		padding: 5px 10px;
	}
	p {
		margin: 5px 10px;
		height: 3rem;
	}
}
.approval{
padding-bottom: 56px;

}
.approvalTop {
	// padding: 10px 10px 0 10px;
    height: 2rem;
    line-height: 1.4rem;

	.approvalTop_m {
		padding: 10px 10px 0 10px;
		border-bottom: 1px solid #ccc;
	}
}
.approvalPop {
	height: 49px;
	line-height: 48px;
	border-top: 1px solid #eee;
	background: #eee;
	span {
		padding: 0 10px;
	}
	div {
		text-align: right;
	}
}
.foot {
	height:100%;
	line-height: 48px;
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
	#approvalPerson>li{
		float: left;
	}
	#approvalPerson {
		height: 3rem;
		li {
			float:left;
		}
	}
}
.pageBody{
	padding-right:13px; 
}
.img-box{
	width: 100%;
	height: auto;
}
.img-box img{
	width: 100%;
}
.isread{
	color:#7787B8;
}
.zan-num-box{
	width: 100%;
	height: 50px;
    padding: 5px;
	background: #F6F6F6;
	color: #999;
}

.zan-num-box p{
	color: #B4B4B4;
}
.zan-click{
	text-align: center;
	width: 50px;	
	height: 50px;	
	margin:10px auto;
	border-radius: 50%;
	border: 1px solid #eee;
	background: #FFF;
	line-height: 50px;
	color:#aaa;
}
.zan-click:active{
	background: #FFEACA;
}
.next-or-pre{
	width: 100%;
	height: 60px;
	overflow: hidden;
	line-height: 90px;
}
.next-or-pre>span{
	margin:0 15px;
	position: relative;
	color:#8B8B8B;
}
.next-or-pre>span::after{
	content: '>';
	font-family: '宋体';
	position: absolute;
	right: -15px;
	font-size: 16px;
	font-weight: 700;
}
.or-pre-fl::after{
	content: '<'!important;
	right: auto;
	left: -15px;
}
.or-pre-fl{
	float: left;
}
.or-next-fr{
	float: right;
}
.reply-head{
	text-align: left;
	height: 50px;
	line-height: 60px;
	padding-left:15px; 
	background:#F5F5F5;
	border-top: 1px solid #E2E2E1;
	border-bottom: 1px solid #E2E2E1;
	color: #B4B4B4;
}
.reply-none{
	margin:10px;
	color:#E3E3E3;
}
.reply-list li{
	padding: 15px;
	border-bottom:1px solid #F2F2F2;
	overflow: hidden;
}
.reply-fl-img{
	width:40px;
	height: 40px;
	float: left;
	// background:red;
	border-radius: 5px;
	margin-right:8px;
}
.reply-fr-box{
	text-align: left;
}
.reply-head-box{
	overflow: hidden;
	margin-bottom: 0px;
	text-align: left;
	font-size: 14px;
	color:#909090;
}
.reply-time{
	float: right;
	color:#C7C7C7;
}
.reply-content{
	max-width: 100%;
}
.footer{
	position: fixed;
	bottom:0;
	width: 100%;
	height: 56px;
	padding: 10px 0;
	background:#F5F5F5;
}
.footer>div{
	box-sizing:content-box;
	padding-left: 46px;
	padding-right: 80px;
	overflow: hidden;

}
.footer input{
	height: 36px;
	width: 100%;
	overflow: hidden;
	padding-left:10px ;
	border-radius: 5px;
}
.add-button{
	width: 36px;
	height: 36px;
	display: inline-block;
	position: absolute;
	left:5px;
	top:10px;
	line-height: 34px;
	border-radius: 50%;
	border:1px solid #E8E8E8;
	box-sizing: border-box;
	font-size: 24px;
	color: #888;
	background: #FCFCFC;
}
.footer button{
	padding: 0;
	height: 36px;
	width: 60px;
	line-height: 34px;
	position: absolute;
	right:10px;
	top:10px;
	border-radius: 5px;
}
</style>
