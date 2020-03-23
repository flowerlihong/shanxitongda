<template>
  <div>

    <!-- height="200px" -->
    <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" id="main">
      <!-- <ul id="main"> -->
      <li v-for="(item,index) in data" :key="index" class="box"  @click="show(item,data)">
        <!-- {{item}} -->
       <div class="pic" id="div">
          <span class="title">{{item.subject}}</span>
          <x-img :class="'previewer-demo-img'" :index="item.index" :src="item.src" @on-success="success" @on-error="error" class="ximg-demo" error-class="ximg-error" :offset="20000" container="#vux_view_box_body"></x-img>
          <img id="avatar" :src="item.avatar==undefined? webUrl+'/static/img/ceneo4LyDg8c.jpg':item.avatar" alt="">
          <i>{{item.createDate}}</i>
       </div>
      </li>
      
    </ul>
    
    
    <div v-if="overFlag" class="over-flag">已经到底了</div>
 
  </div>
</template>
<style scoped>
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
#main {
  padding: 7px 7px 0 7px;

  -moz-column-count: 2;
  /* Firefox */
  -webkit-column-count: 2;
  /* Safari and Chrome */
  column-count: 2;
  -moz-column-gap: 10px;
  /* Firefox */
  -webkit-column-gap: 10px;
  /* Safari and Chrome */
  column-gap: 10px;
}

.box {
  float: left;
  width: 100%;
}

.pic {
  width: 100%;
  position: relative;
  border-radius: 4px;
  
}

.pic img {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 4px;
}
button{
  position: fixed;
  left: 100px;
  top: 100px;
  display: none;
}
#avatar{
  width: 28px;
  height: 28px;
  margin-bottom: 0;
  position: absolute;
  border-radius: 50%;
  left:10px;
  bottom: 10px;
}
.pic i{
  text-align: right;
  font-size: 12px;
  position: absolute;
  bottom: 0px;
  width: 100%;
  right :0;
  color:#c0c0c0;
}
.over-flag{
  color:#c0c0c0;
}
.title{
  position: absolute;
  width: 100%;
  z-index: 2;
  top: 50%;
  height: 30px;
  line-height: 30px;
  margin-top:-15px;
  color: #fff;
  background: rgba(0,0,0,.2)
}
</style>
<script>
import { InfiniteScroll } from 'mint-ui';
import { XImg, LoadMore, Previewer, TransferDom } from 'vux'

export default {
  data() {
    return {
      overFlag:false,
      webUrl:'',
      loading: false,
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      pageSize: 10,
      onFetching:false,
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
				content: 's',
				pullUpHeight: 50,
				height: 40,
				autoRefresh: false,
				downContent: '释放加载更多',
				upContent: ' ',
				loadingContent: 'Loading...',
				clsPrefix: 'xs-plugin-pullup-'
			},
			previewList: [],
			scrollTop: 0,
			isEnd: false,
      pageIndex:1,
			count: 0,
	
			options: {
				getThumbBoundsFn(index) {
					// find thumbnail element
          //let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
					let thumbnail = document.querySelectorAll('.previewer-demo-img');
					for(var i= 0;i<thumbnail.length;i++){
						//console.info(thumbnail[i]);
						var indexAttr = thumbnail[i].getAttribute("index");
						if(index == indexAttr){
							thumbnail = thumbnail[i];
							break;
						}
					}
					// get window scroll Y
					let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
					// optionally get horizontal scroll
					// get position of element relative to viewport
					let rect = thumbnail.getBoundingClientRect()
					// w = width
					return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
					// Good guide on how to get element coordinates:
					// http://javascript.info/tutorial/coordinates
				}
			},
			noMore: false,
			data: [],
			projUid: '',
    }
  },
  	components: {
		// 名字
		XImg,  LoadMore, Previewer, TransferDom,MtInfiniteScroll:InfiniteScroll
  },
  	directives: {
		TransferDom,
    InfiniteScroll
	},
  created() {
    //this.use(InfiniteScroll);
    var projUid = this.util.getUrlParam("projUid");
    this.projUid = projUid;
    this.webUrl=this.util.getBaseUrl();
    this.util.initWxJsSdk(this);
  },
  activated() {
    var projUid = this.util.getUrlParam("projUid");
    this.data = [];
    this.previewList = [];
    // this.list1 = this.getData();
    // this.list2 = this.getData();
  
    this.projUid = projUid;
    this.overFlag=false
    this.isEnd=false;
    this.loadMore();
    // this.loadData();
  },
  methods: {
    add() {
          this.$router.push({ name: 'record/info', query: { isReadOnly: false } });
    },
     loadMore() {
        this.loading = true;
        this.loadMore1();
        this.loading=false;
        if(this.isEnd){
         this.overFlag=true;
        }
      },
    //  loadMore() {
    //       console.log('```loadMore``')
      
        
    //     setTimeout(() => {
    //       this.loading=true
    //       this.loadMore1();
    //       console.log('```loadMore1``')
    //     }, 2500);
    //   },
    // loadMore() {
    //   console.log("******loadMore*******");
      
    //   this.loading=true
    //   	console.info("******loadMore*******");
		// 	if (this.isEnd) {
		// 		return;
		// 	}
		// 	if (this.onFetching) {
		// 		// do nothing
		// 	} else {
		// 		this.onFetching = true;
		// 		this.noMore = false;
		// 		if (this.data.length == 0) {
		// 			this.loadData();
		// 		} else {
		// 			this.loadData("downLoad", this.data[this.data.length - 1].createTime);
		// 		}

		// 	}
    // },
    loadMore1() {
		
      
			if (this.isEnd) {
        this.loading=true;
        
				return;
			}
			if (this.onFetching) {
				// do nothing
			} else {
				this.onFetching = true;
				this.noMore = false;
				if (this.data.length == 0) {
					this.loadData();
				} else {
          
				    this.pageIndex = this.pageIndex + 1;
					this.loadData("downLoad", this.data[this.data.length - 1].createTime);
				}

			}
		},
    loadData(type, creatTime) {
      // this.loadMore();
      
      var _this = this;
      _this.util.mask();
      var param = {
        createTime: creatTime == undefined ? null : creatTime,
        type: type == undefined ? null : type,
        userUid: this.$store.state.userUid,
        operateType:'get',
        companyUid: this.$store.state.companyUid,
        projUid: this.projUid
      };
      param.pageIndex = this.pageIndex;
      this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_Record&appId=WeChat' + _this.pageSize, param, function(res) {
        
        _this.util.unmask();
        
        if (res.data == undefined || res.data.length == 0) {
          
          if (type == undefined) {
            _this.data = [];
          }
          if (type == 'downLoad') {
            //_this.util.successToast("----0-----")
            if (_this.data.length == 0) {
              //$('#div2').height(10);
              //$('#div1').height(10);
            }
            if (res.ifEnd) {
              _this.isEnd = true;
            }
          }

          _this.noMore = true;

          // _this.$nextTick(() => {
          //   _this.$refs.scrollerBottom.reset()
          // })
          _this.onFetching = false

          // _this.$refs.scrollerBottom.donePullup();
          // var dom = _this.$refs.scrollerBottom.$el;
          // dom = $(dom).find('.xs-container')[0];
          // $(dom).css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)');
          //_this.util.successToast("----3-----")
          return;
        } else {
          
          if (type == undefined) {


            _this.data = res.data;
            if(_this.data[0].index==undefined){
              var index = 0;
            }else{
              var index =_this.data.length;
            }
            
            
            //console.info("downLoad----2-----")
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].index = index + i;
              var item = res.data[i];
              res.data[i].src = _this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.id + '&access_token=' + _this.util.getAccessToken();

              _this.previewList.push(res.data[i]);
            }
            //console.info(_this.data);
            _this.onFetching = false;
            // _this.$nextTick(() => {
            //   _this.$refs.scrollerBottom.reset()
            // });
            if (res.ifEnd) {
              _this.isEnd = true;
            }
            // _this.$refs.scrollerBottom.donePullup();
            _this.noMore = true;
            _this.loading=false;
            
            return null;
            
          } else if (type == 'upLoad') {

          } else if (type == 'downLoad') {
            var index = _this.data.length;
            //console.info("downLoad----2-----")
            for (var i = 0; i < res.data.length; i++) {
              var item = res.data[i];
              res.data[i].src = _this.util.getBaseUrl() + '/attachmentAction!look.action?id=' + item.id + '&access_token=' + _this.util.getAccessToken();

              res.data[i].index = index + i;
           
              _this.previewList.push(res.data[i]);
            
              
            }
              
            _this.data = _this.data.concat(res.data);
            // _this.$nextTick(() => {
            //   _this.$refs.scrollerBottom.reset()
            // });
            //console.info("downLoad----4-----")
            _this.onFetching = false;
            // _this.$refs.scrollerBottom.donePullup();
            // console.info(res.ifEnd);
            if (res.ifEnd) {
              _this.isEnd = true;
            }
            _this.noMore = true;
            
          }
        }
          
      });

    },
    success(src, ele) {
			//console.log('success load', src);
			const i = ele.parentNode.querySelector('i');
			// ele.parentNode.removeChild(i);
			//console.info($('#div1'));
			//console.info($('#div1')[0].scrollHeight);

			//console.info($('#div2'));
			//console.info($('#div2')[0].scrollHeight);
			// var height1 = $('#div1')[0].scrollHeight;
			// var height2 = $('#div2')[0].scrollHeight;
		var height = $('#div')[0].scrollHeight;

			if (height != 0 ) {
					$('#div').height(height);
			}
			// this.$nextTick(() => {
			// 				this.$refs.scrollerBottom.reset()
			// 			});
		},
		error(src, ele, msg) {
			//console.log('error load', msg, src)
			const i = ele.parentNode.querySelector('i');
      i.innerText = '无法加载该图片';
      i.style.fontStyle='normal'
			var height = $('#div')[0].scrollHeight;
      
			if (height != 0 ) {
          $('#div').height(height);
			}
			// this.$nextTick(() => {
			// 				this.$refs.scrollerBottom.reset()
			// 			});
    },
    show(item,data) {
			var _this = this;
			// console.info(_this.previewList);
			
      // this.$refs.previewer.show(item.index)
     
      var arr = new Array();
			for (var i = 0; i < data.length; i++) {
				arr.push(data[i].src);
			}
      this.wx.previewImage({
				current: item.src, // 当前显示图片的http链接
				urls: arr // 需要预览的图片http链接列表
			});
		}
  }
}
</script>
