<template>
	<section :style="sectionPaddingTop">
        <div id="fixedHeight">
            <div class="mint-searchbar"><div class="mint-searchbar-inner"><i class="mintui mintui-search"></i> <input type="search" placeholder="搜索" @click="seeList" v-model="searchText" @keyup="searchAddress" class="mint-searchbar-core"></div> <a class="mint-searchbar-cancel" style="display: none;">取消</a></div>
            <ul class="tabImgInUl" v-if="arr.length!=0">
                <li v-for="(vt,index) in arr" :key="index" @click="deleteListArr(vt.id)" class="tabImgInLi" :data-id="vt.id">
                    <div class="tabImg">
                    <img :src="vt.picture!=null&&typeof(vt.picture)!='undefined'&&vt.picture!='' ? vt.picture : webUrl+'/images/icons/ceneo4LyDg8c.jpg'"  >
                    <br/>
                    <span>{{vt.userName==undefined? vt.label:vt.userName}}</span>
                    </div>                
                </li>
            </ul>
        
                <tab v-model="weatherIndex">
                    <tab-item selected>常联系人</tab-item>
                    <tab-item >联系人</tab-item>
                    <tab-item >组织机构</tab-item>
                </tab>
        </div>
        <swiper height="100%" width="100%" :threshold="100" :show-dots="false" v-model="weatherIndex" id="yuandibaozha">
            <swiper-item >
            <div id="peopleNear">
                <ul>
                    <li v-for="nearly in nearest" class="near-list" @click.stop.prevent='BeCheck(nearly)' :key="nearly.userName">
                    <div class="username-near">{{nearly.userName}}{{nearly.label}}</div>
                    <span class="mobile">{{nearly.mobileNo}}{{nearly.mobile}}</span>
                    <svg class="icon icon-add" v-if="!radioSelectFlag"  :style="nearly.checked == 0 ?unCheckedSty:checkedSty"  aria-hidden="true">
                        <use xlink:href="#icon-gouxuan"></use>
                    </svg>
                    <svg class="icon icon-tianjialianxiren" v-if="!radioSelectFlag" @click.stop.prevent="deleteUserLink(nearly)" aria-hidden="true">
                        <use xlink:href="#icon-lajixiang"></use>
                    </svg>
                    <img :src="nearly.picture!=null&&typeof(nearly.picture)!='undefined'&&nearly.picture!='' ? nearly.picture :webUrl+'/images/icons/ceneo4LyDg8c.jpg'" >
                    
                    </li>
                </ul>
            </div>
            </swiper-item>
            <swiper-item class="black">
                <div id="peopleList">
            <mt-index-list :show-indicator="false" v-show="searchFlag">
            <mt-index-section v-for="(addItem,val,index) in obj" :index="val" :key="index">
                
                <div v-for="value in obj[val]" class="value-list" v-show="searchFlag"   @click.stop.prevent='BeCheck(value)' :key="value.id">
                <div class="username-near">{{value.userName}}{{value.label}}</div>
                    <span class="mobile">{{value.mobileNo}}</span>
                    <svg class="icon icon-add" v-if="!radioSelectFlag" :style="value.checked == 0 ?unCheckedSty:checkedSty"  data-checked="" id="icon-value"  aria-hidden="true">
                        <use xlink:href="#icon-gouxuan"></use>
                    </svg>
                    <svg class="icon icon-lajixiang" v-if="!radioSelectFlag" @click.stop.prevent="createUserLink(value)"  data-checked=""   aria-hidden="true">
                        <use xlink:href="#icon-tianjialianxiren"></use>
                    </svg>
                    <img :src="value.picture!=null&&typeof(value.picture)!='undefined'&&value.picture!='' ? value.picture : webUrl+'/images/icons/ceneo4LyDg8c.jpg'"  >
                </div>
            </mt-index-section>
                 
            </mt-index-list>
            </div>
            </swiper-item>
            <swiper-item>
            <!--:VObject="VObject"-->
                <SelectUserItems @ee="creatNear" :radioSelectFlags="radioSelectFlag" v-bind:model='model' :orgUsersObj='orgUsersObj' @messageOut="messageIn" v-bind:level=1  v-for='model in list' :key="model.id"></selectUserItems>
            </swiper-item>
        </swiper>
        
       <div class="my-btn-btnpd">
            <input type="button" class="my-btn-back" @click="close()" value="取消">
            <input type="button" class="my-btn-submit" @click="mySelectUesrSubmint" value="确定">
       </div>

        
	</section>
</template>

<script>
import { IndexList, IndexSection,MessageBox } from "mint-ui";
import SelectUserItems from "./SelectUserItems.vue";
import { Swiper, SwiperItem, Divider, Tab, TabItem } from "vux";
export default {
  data: function() {
    return {
      radioSelectFlag: false,
      searchFlag: true,
      searchText: "",
      category: 0,
      webUrl: "",
      sectionPaddingTop: {
        fontSize: "16px",
        textAlign: "left",
        paddingTop: "153px",
        height: "100%"
      },
      checkedSty: {
        borderColor: "#ccc",
        backgroundColor: "skyblue"
      },
      unCheckedSty: {
        borderColor: "#ccc",
        backgroundColor: "#fff"
      },
      weatherIndex: 0,
      obj: {},  // 所有联系人列表
      orgUsersObj: {},
      active: "",
      // selected:'1',
      str: "",
      arr: [],
      arr1: [],
      searchAddressList: [],
      searchAddressarr: [],
      list: [], // 组织机构人员
      addressList: [],  // 所有联系人
      nearest: [],  // 常用联系人
      arrId: []
    };
  },
  components: {
    SelectUserItems,
    Swiper,
    SwiperItem,
    Tab,
    TabItem,
    MtIndexList: IndexList,
    MtIndexSection: IndexSection
  },
  props: ["userModel"],
  methods: {
    cle(asd) {
      this.selected = asd;
    },
    address(num) {
      if (num == 1) {
        this.searchAddressList = this.addressList;
      }
      this.obj = new Object();
      this.arr1 = [];
      for (var i = 0; i < this.searchAddressList.length; i++) {
        // 联系人数据中有姓名拼音缩写则取首字母，没有就取‘Z'
        var grapheme = this.util.isNotEmpty(this.searchAddressList[i].enCode)
          ? this.searchAddressList[i].enCode[0].toUpperCase()
          : "Z";
        // arr1 存入首字母 ['A','B','F',''','Z']
        // obj对应字母存入相应的联系人数据 obj --> {A:[{...},{....}],B:[{...}{...}]}
        if (!this.contains(this.arr1, grapheme)) {
          this.arr1.push(grapheme);
          this.obj[grapheme] = new Array();
          this.obj[grapheme][0] = this.searchAddressList[i];
        } else if (typeof this.obj[grapheme] == "object") {
          this.obj[grapheme].push(this.searchAddressList[i]);
        }
      }
    },
    contains(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return true;
        }
      }
      return false;
    },
    deleteListArr(vtId) {
      for (var i = 0; i < this.arr.length; i++) {
        if (this.arr[i].id == vtId) {
          this.synchronous(this.arr[i].id, 0);
          this.arr[i].checked = 0;
          this.arr.splice(i, 1);
        }
      }
      this.judgement();
    },
    judgement() {
      if (this.arr.length == 0) {
        this.sectionPaddingTop.paddingTop = "88px";
      } else {
        this.sectionPaddingTop.paddingTop = "161px";
      }
    },
    BeCheck(node) {
      if (node.checked == 0 || node.checked == undefined) {
        node.checked = 1;

        // this.checkedSty.backgroundColor='skyblue';
        this.arr.push(node);
        this.judgement();
        this.synchronous(node.id, node.checked);
        // this.synchronSelectUserItems(node.id,node.checked);
      } else {
        node.checked = 0;
        if (this.orgUsersObj[node.id]) {
          for (var i = 0; i < this.orgUsersObj[node.id].length; i++) {
            this.orgUsersObj[node.id][i].checked = 0;
          }
        }
        //this.checkedSty.backgroundColor='#fff';
        this.deleteListArr(node.id);
        this.synchronous(node.id, node.checked);
        // this.synchronSelectUserItems(node.id,node.checked);
      }
      // for(var i=0;i<this.addressList.length;i++){
      //     if(this.addressList[i].id==Allid){
      //         this.addressList[i].checked=1;
      //     }
      this.radioSelect();
      // }
    },
    synchronous(nodeCheckedId, num) {  // 三个列表同步人员的选中状态
      
      for (var i = 0; i < this.searchAddressList.length; i++) {
        if (this.searchAddressList[i].id == nodeCheckedId) {
          this.searchAddressList[i].checked = num;
        }
      }
      for (var i = 0; i < this.nearest.length; i++) {
        if (this.nearest[i].id == nodeCheckedId) {
          this.nearest[i].checked = num;
        }
      }     
      if (this.orgUsersObj[nodeCheckedId]) {
       // console.log(nodeCheckedId)
        for (var i = 0; i < this.orgUsersObj[nodeCheckedId].length; i++) {
          this.orgUsersObj[nodeCheckedId][i].checked = num;
          
        }
      }
      return num;
    },
    ergodicArr() {
      for (var i = 0; i < this.arr.length; i++) {
        this.synchronous(this.arr[i].id, 1);
      }
      this.judgement();
    },
    searchAddress() {
      this.searchAddressarr = [];
      for (var i = 0; i < this.addressList.length; i++) {
        if (
          (this.addressList[i].enCode &&
            this.addressList[i].enCode.indexOf(this.searchText) != -1) ||
          (this.addressList[i].userName &&
            this.addressList[i].userName.indexOf(this.searchText) != -1)
        ) {
          this.searchAddressarr.push(this.addressList[i]);
        }
        // if(this.addressList[i].enCode.indexOf(this.searchText)!=-1||this.addressList[i].userName.indexOf(this.searchText)!=-1){
        //     this.searchAddressarr.push(this.addressList[i]);
        // }
      }
      if (this.searchText == "" || this.searchText == " ") {
        this.searchAddressarr = this.addressList;
      }

      this.searchAddressList = this.searchAddressarr;
      // this.searchAddressList= this.addressList.filter( (item) => {
      //         return item.enCode.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1
      //     });
      this.address();
      // this.searchAddressarr=[];
    },
    seeList() {
      this.weatherIndex = 1;
    },
    close() {
      this.userModel.visible = false;     
      this.deleteRepeat();
    },
    mySelectUesrSubmint() {
      let vm = this;
      this.userModel.visible = false;
      var selectUsers = this.arr;
      var userUidArr = new Array();
      var userNameArr = new Array();
      for (var i = 0; i < selectUsers.length; i++) {
        if (selectUsers[i].userName == undefined) {
          selectUsers[i].userName = selectUsers[i].label;
        }
        if (selectUsers[i].picture == undefined) {
          selectUsers[i].picture =
            this.webUrl + "/images/icons/ceneo4LyDg8c.jpg";
        }
        selectUsers[i].id = vm.util.isNotEmpty(selectUsers[i].id)?selectUsers[i].id : selectUsers[i].Id
        selectUsers[i].mobileNo = vm.util.isNotEmpty(selectUsers[i].mobileNo)?selectUsers[i].mobileNo : selectUsers[i].MobileNo
        selectUsers[i].userId = vm.util.isNotEmpty(selectUsers[i].userId)?selectUsers[i].userId : selectUsers[i].UserId
        
        userUidArr.push(vm.util.isNotEmpty(selectUsers[i].id)?selectUsers[i].id : selectUsers[i].Id);
        userNameArr.push(selectUsers[i].userName);
      }
      this.userModel.userUid = userUidArr.join(",");
      this.userModel.userName = userNameArr.join(",");
      if (this.userModel.singer) {
        this.userModel.users = selectUsers[0];
      } else {
        this.userModel.users = selectUsers;
      }
     
      this.$emit("selectUsersCallBack", selectUsers);
    },
    radioSelect() {
      if (this.radioSelectFlag) {
        if (this.arr.length == 1) {
          this.mySelectUesrSubmint();
        }
      } else {
        return false;
      }
    },
    deepClone(source){
      var result = [];
		//var result = {}
		for (var key in source) {
			if (source[key] instanceof Array) {
				if (source[key].length > 0) {
					result[key] = typeof source[key] === "object"
						? this.deepCopy(source[key])
						: source[key];
				}
			} else {
				if (source[key]) {
					result[key] = typeof source[key] === "object"
						? this.deepCopy(source[key])
						: source[key];
				}
			}
		}
		return result;
    },
    messageIn(data) {
    
      for (var i = 0; i < this.$store.state.myUserList.length; i++) {
        if (
          this.$store.state.myUserList[i].checked == 1 &&
          this.arr.length <= 0
        ) {
          console.log("checked == 1 &&this.arr.length <= 0");
          console.log(this.$store.state.myUserList[i])
          this.arr.push(this.$store.state.myUserList[i]);
          this.judgement();
          this.synchronous(this.$store.state.myUserList[i].id, 1);
        } else if (this.$store.state.myUserList[i].checked == 0) {
          console.log("checked == 0")
          this.deleteListArr(this.$store.state.myUserList[i].id);
          this.judgement();
          this.synchronous(this.$store.state.myUserList[i].id, 0);
        } else if (this.arr.length > 0) {
          console.log("this.arr.length > 0")
          for (var j = 0; j < this.arr.length; j++) {
            if (this.$store.state.myUserList[i].id == this.arr[j].id) {
              break;
            } else {
              this.arr.push(this.$store.state.myUserList[i]);
              this.judgement();
              this.deleteRepeat(this.arr);
              this.synchronous(this.$store.state.myUserList[i].id, 1);
              break;
            }
          }
        }
      }
      this.deleteRepeat(this.arr);
      this.radioSelect();;
      console.log("after-------",this.list)
    },

    addNearestChecked() {
      // 获取常用联系人
      this.util.mask();
      var salf = this;
      //this.util.post('/org/getLinkedUser', { companyUid: this.$store.state.companyUid, userUid: this.$store.state.userUid}, function (res) {
      this.util.post(
        "/wx/weChatAction!getLinkedUser.action",
        {
          companyId: this.sessionUtil.getCompanyId(),
          userId: this.sessionUtil.getUserId()
        },
        function(res) {
          if (res.status == 200) {
            salf.nearest = res.data;
            for (var i = 0; i < salf.nearest.length; i++) {
              salf.nearest[i].checked = 0;
            }
          }
          salf.util.unmask();
        }
      );
    },
    addressListChecked() {
      // 获取所有联系人
      this.util.mask();
      var salf = this;
      this.util.post(
        "/wx/weChatAction!getAllUser.action",
        {
          companyId: this.sessionUtil.getCompanyId(),
          userId: this.sessionUtil.getUserId()
        },
        function(res) {
          if (res.status == 200) {
            salf.addressList = res.data;
            for (var i = 0; i < salf.addressList.length; i++) {
              salf.addressList[i].checked = 0;
            }
            salf.address(1);
          }
          salf.util.unmask();
        }
      );
    },
    addList() {
      this.util.mask();
      var salf = this;
      this.util.post(
        "/wx/weChatAction!getOrg.action",
        {
          companyId: this.sessionUtil.getCompanyId(),
          userId: this.sessionUtil.getUserId()
        },
        function(res) {
          if (res.status == 200) {
            res.data = salf.handleOrgData(res.data)
            salf.list.push(res.data);
          }
        }
      );
    },
    handleOrgData(data){
      //debugger;
      if(this.util.isNotEmpty(data.Id) && !this.util.isNotEmpty(data.id)){
          data.id = data.Id
      }
      
      if(this.util.isNotEmpty(data.children) &&data.children.length>0 ){
          data.children.forEach((v,i) => {
            
            data.children[i] = this.handleOrgData(v)
          });
      }
      return data 
    },
    deleteRepeat() {
      var s = [];
      //遍历数组
      for (var i = 0; i < this.arr.length; i++) {
        if (!this.deleteRepeat1(s, this.arr[i].id)) {
          //判断在s数组中是否存在，不存在则push到s数组中
          s.push(this.arr[i]);
        }
      }
      this.arr = s;
    },

    deleteRepeat1(arr, userId) {
      var i = arr.length;
      while (i--) {
        if (arr[i].id === userId) {
          return true;
        }
      }
      return false;
    },
    createUserLink(node) {
      var str = node.label ? node.label : node.userName;
      if (this.$store.state.userUid == node.id) {
        MessageBox.alert("不可以添加自己为常用联系人");
        return;
      }
      MessageBox.confirm("是否添加" + str + "为常联系人").then(active => {
        if (this.deleteRepeat1(this.nearest, node.id)) {
          MessageBox.alert("此人已添加");
        } else {
          var arr = [{ userUid: this.$store.state.userUid, linkUid: node.id }];
          this.nearest.push(node);
        }

        this.util.post("/org/userLink/create", {
          userLinks: JSON.stringify(arr)
        });
      });
    },

    deleteUserLink(node) {
      var str = node.label ? node.label : node.userName,
        nameId = "",
        i = 0;

      MessageBox.confirm("是否删除常联系人" + str).then(active => {
        nameId = node.id;
        for (; i < this.nearest.length; i++) {
          if (this.nearest[i].id == nameId) {
            this.nearest.splice(i, 1);
          }
        }
        this.util.post("/org/userLink/delete", {
          userUid: this.$store.state.userUid,
          linkUid: nameId
        });
      });
    },
    arrMatching() {
      for (var k = 0; k < this.arr.length; k++) {
        this.synchronous(this.arr[k].id, 0);
      }
      this.arr = [];
      this.judgement();
      for (var i = 0; i < this.addressList.length; i++) {
        for (var j = 0; j < this.arrId.length; j++) {
          if (this.arrId[j] == this.addressList[i].id) {
            this.arr.push(this.addressList[i]);
            this.judgement();
            this.deleteRepeat();
            this.synchronous(this.arrId[j], 1);
            if (this.orgUsersObj[this.arrId[j]]) {
              for (var k = 0; k < this.orgUsersObj[this.arrId[j]].length; k++) {
                this.orgUsersObj[this.arrId[j]][k].checked = 1;
              }
            }
          }
        }
      }
    },
    postMsg(data) {
      this.radioSelectFlag = data.singer;

      this.arrId = data.radioCheckedArr;
      this.arrMatching();
      // if(this.arrId.length>0){
      //     this.arrMatching()
      // }
    },
    creatNear(data) {
      this.createUserLink(data);
    }
  },
  computed: {
    // 计算属性的 getter
    checkedStyle: function() {
      // `this` 指向 vm 实例
      var o = {
        borderColor: "#ccc"

        //backgroundColor:(this.model.parent != undefined && this.model.parent.checked == 1)?'skyblue':(this.model.checked == 0?'#fff':'skyblue')};
        //backgroundColor:node.checked == 0?'#fff':'skyblue'
      };
      return o;
    }
  },
  beforeDestroy() {
    this.radioSelectFlag = false;
    this.arr = [];
    this.judgement();
  },

  created() {
    this.addressListChecked(); // 获取所有联系人
    this.addNearestChecked(); // 获取常用联系人
    this.addList(); // 获取组织机构人员

    this.judgement();
    this.cle("1");
    this.ergodicArr();
    this.webUrl = this.util.getBaseUrl();
  }
};
</script>

<style scoped>
section {
  font-family: "microsoft yahei";
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #fafafa;
}
.tabImgInUl {
  width: 100%;
  height: 73px;
  overflow: auto;
}
ul {
  padding-left: 0px;
  margin: 0;
  background-color: rgba(238, 238, 238, 0.2);
}

.mint-navbar .mint-tab-item.is -selected {
  border: 0 none;
}
form {
  padding: 5px;
}
.near-list,
.value-list {
  position: relative;
  height: 57px;
  background-color: rgba(238, 238, 238, 0.2);
  padding: 5px 0px 5px 52px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  border-bottom: 1px dashed rgba(200, 200, 200, 0.2);
}

.username-near {
  margin-bottom: 0px;
}
img {
  width: 42px;
  height: 42px;
  position: absolute;
  left: 5px;
  top: 8px;
  border-radius: 50% 50%;
  border: 1px solid transparent;
  overflow: hidden;
}
.icon-add {
  position: absolute;
  right: 10px;
  top: 35%;
  z-index: 2;
  font-size: 16px;
  border: 1px solid #ddd;
  width: 16px;
  height: 16px;
  color: #fff;
  fill: #fff;
  background-color: #eee;
}

.icon-tianjialianxiren:active,
.icon-lajixiang:active {
  background-color: rgba(0, 0, 0, 0.2);
}
.icon-tianjialianxiren,
.icon-lajixiang {
  position: absolute;
  right: 60px;
  top: 25%;
  z-index: 11;
  font-size: 27px;
  color: #fff;
  fill: LightSeaGreen;
  background-color: rgba(238, 238, 238, 0.2);
}
/* .icon-tianjialianxiren,.icon-lajixiang{
        position:absolute;
        right:50px;
        top:26%;
        z-index:2;
        font-size:25px;
        color:#fff;
        fill:;
        background-color:rgba(238, 238, 238,.2);
   } */
.icon-lajixiang {
  right: 80px;
}
#icon-value {
  right: 33px;
}
form {
  padding: 0;
}
.mobile {
  color: #ccc;
}
.tabImgInLi {
  display: inline-block;
}
.tabImg {
  display: inline-block;
  margin: 3px 5px;
}
.tabImg > img {
  position: static;
}
.tabImg > span {
  display: block;
  text-align: center;
}
#fixedHeight {
  width: 100%;
  position: absolute;
  top: 0;
}
.my-btn-btnpd {
  width: 100%;
  position: absolute;
  box-sizing: border-box;
  height: 45px;
  bottom: 0px;
  padding: 5px 30px 10px;
  background-color: #fafafa;
}
.my-btn-btnpd > input {
  width: 45%;
  float: left;
  height: 100%;
  border-radius: 10px;
  font-size: 14px;
  color: #fff;
}
.my-btn-btnpd .my-btn-submit {
  float: right;
  background-color: #ff0f45;
}
.my-btn-btnpd .my-btn-back {
  background-color: #9e5;
}
</style>
<style>
#peopleList .mint-indexlist-nav .mint-indexlist-navlist {
  overflow: auto;
}
.mint-navbar {
  background-color: rgba(238, 238, 238, 0.2);
  border-bottom: 1px dashed rgba(200, 200, 200, 0.2);
}
.mint-indexlist {
  overflow: auto;
}
.vux-swiper-item {
  overflow: auto !important;
}
#yuandibaozha .mint-indexlist-nav {
  background-color: transparent;
  border: 0 none;
}
.mint-indexlist-content {
  width: 100%;
}
.mint-indexsection-index {
  border-bottom: 1px dashed rgba(200, 200, 200, 0.2);
}
#yuandibaozha {
  padding-bottom: 45px;
  height: 100%;
}
.vux-tab {
  background-color: #fafafa;
}
</style>
