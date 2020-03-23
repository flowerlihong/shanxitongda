<template>
    <section :style="sectionPaddingTop">
        <ul>
            <!-- -->
            <selectQuartersItems v-bind:model='model'  :radioSelectFlags="radioSelectFlag" :orgUsersObj='orgUsersObj' v-bind:level=1 @messageOut="messageIn" v-for='model in list' :key="model.id"></selectQuartersItems>
        </ul>
        <div class="my-btn-btnpd">
            <input type="button" class="my-btn-back" @click="close()" value="取消">
            <input type="button" class="my-btn-submit" @click="mySelectUesrSubmint" value="确定">
        </div>

    </section>
</template>

<script>

import selectQuartersItems from './selectQuartersItems.vue';
import { Swiper, SwiperItem, Divider, Tab, TabItem } from 'vux'


export default {
    data: function() {
        return {
            radioSelectFlag: false,
            sectionPaddingTop: {
                fontSize: '16px',
                textAlign: 'left',
                height: '100%',
            },
            obj: {},
            orgUsersObj: {},
            arr: [],
            arr1: [],
            list: [],


        };
    },
    components: {
        selectQuartersItems
    },
    props: ['orgModel'],
    methods: {

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
                    this.arr[i].checked = 0;
                    this.arr.splice(i, 1);
                }
            }
        },
        close() {
            this.orgModel.visible = false;
            this.arr = [];
            this.$store.state.myUserList = [];
        },
        mySelectUesrSubmint() {
            this.orgModel.visible = false;
            var selectUsers = new Array();
            for (var key in this.orgUsersObj) {
                for (var i = 0; i < this.orgUsersObj[key].length; i++) {
                   if( this.orgUsersObj[key][i].checked == 1){
                       selectUsers.push(this.orgUsersObj[key][i]);
                   }
                }
            }
            //var selectUsers = this.arr;
            var departUidArr = new Array();
            var departNameArr = new Array();
            //console.info(selectUsers);
            for (var i = 0; i < selectUsers.length; i++) {
                if (selectUsers[i].departName == undefined) {
                    selectUsers[i].departName = selectUsers[i].label;
                }
                departUidArr.push(selectUsers[i].id);
                departNameArr.push(selectUsers[i].departName);

            }
            this.orgModel.departUid = departUidArr.join(",");
            this.orgModel.departName = departNameArr.join(",");
            
            this.$emit('selectOrgCallBack', selectUsers);
           // this.$emit('emitdepart', this.orgModel);
        },
        radioSelect() {
            //console.log(this.arr)
            if (this.radioSelectFlag) {
                if (this.arr.length == 1) {
                    this.mySelectUesrSubmint()

                }
            } else {


                return false;
            }
        },

        messageIn(data) {
            this.arr = this.$store.state.myUserList;
            this.radioSelect()

            // console.log(data);
            //      for(var i =0;i<this.$store.state.myUserList.length;i++){
            //                 if(this.$store.state.myUserList[i].checked==1&&this.arr.length<=0){
            //                     this.arr.push(this.$store.state.myUserList[i]);
            //                 }else if(this.$store.state.myUserList[i].checked==0){
            //                     this.deleteListArr(this.$store.state.myUserList[i].id);
            //                 }else if(this.arr.length>0){
            //                     for(var j=0;j<this.arr.length;j++){
            //                         if(this.$store.state.myUserList[i].id==this.arr[j].id){
            //                             console.log(11111)
            //                             break;
            //                         }else {
            //                             this.arr.push(this.$store.state.myUserList[i]);
            //                             break;

            //                         }
            //                     }
            //                 }
            //             }
            //             this.deleteRepeat(this.arr)

        },
        addList() {
            this.util.mask();
            var salf = this;
            this.util.post('/wx/weChatAction!getOrg.action', { companyId: this.sessionUtil.getCompanyId(), type: 'depart' }, function(res) {
                console.info(res);
                if (res.status == 200) {
                    var data = res.data;
                    salf.addCheckInData(data);
                    salf.list.push(data);    
                    console.log(salf.list)                
                }
                salf.util.unmask();
            });
        },
        addCheckInData(data){
            data.checked=0;
            if(data.children && data.children.length>0){
                data.children.forEach(element => {
                    this.addCheckInData(element)
                });                
            }
        },
        // addList(){
        //     this.util.mask();
        //     var salf=this;
        //     this.util.post('/org/getOrg/', { companyUid: this.$store.state.companyUid, type: 'user' }, function (res) {
        //         // console.info(res);
        //         if(res.status==200){
        //             salf.list.push(res.data);
        //         }                        
        //     });
        //     salf.util.unmask();

        // },
        deleteRepeat() {
            var s = [];
            //遍历数组
            for (var i = 0; i < this.arr.length; i++) {
                if (s.indexOf(this.arr[i]) == -1) {  //判断在s数组中是否存在，不存在则push到s数组中
                    s.push(this.arr[i]);
                }
            }
            this.arr = s;
            // console.log(this.arr)
        },

        synchronous(nodeCheckedId, num) {
            console.log(nodeCheckedId)
            console.log(this.orgUsersObj)
            for (var i = 0; i < this.orgUsersObj[nodeCheckedId].length; i++) {
                this.orgUsersObj[nodeCheckedId][i].checked = num;
            }
        },
        arrMatching() {
            // console.log(this.arr)
            // for (var k = 0; k < this.arr.length; k++) {
            //     this.synchronous(this.arr[k].id, 0)
            // }
            for (var key in this.orgUsersObj) {
                for (var i = 0; i < this.orgUsersObj[key].length; i++) {
                    this.orgUsersObj[key][i].checked = 0;
                }
            }
            this.arr = [];
            this.$store.state.myUserList = [];
            // console.log(this.arr)
            //if(!this.radioSelectFlag){
            console.info(this.arrId);
            for (var j = 0; j < this.arrId.length; j++) {

                for (var i = 0; i < this.orgUsersObj[this.arrId[j]].length; i++) {
                    this.orgUsersObj[this.arrId[j]][i].checked = 1;
                }
            }
            //     for(var i=0;i<this.addressList.length;i++){
            //     for(var j=0;j<this.arrId.length;j++){
            //         if(this.arrId[j]==this.addressList[i].id){

            //             this.arr.push(this.addressList[i]);
            //             this.judgement();
            //             this.deleteRepeat();
            //             this.synchronous(this.arrId[j],1);
            //              for(var k = 0;k<this.orgUsersObj[this.arrId[j]].length;k++){
            //                     this.orgUsersObj[this.arrId[j]][k].checked = 1;
            //             }   
            //         }
            //     }   
            // }
            // }
        },
        beforeDestroy() {
            this.radioSelectFlag = false;
            this.arr = [];
            this.$store.state.myUserList = [];
            this.judgement();
        },
        postMsg(data) {
            this.radioSelectFlag = data.singer;

            this.arrId = data.radioCheckedArr;
            this.arrMatching()
        }


    },





    created() {
        this.addList();
        // this.cle('1');
        // this.ergodicArr();
    }

};
</script>

<style scoped>
section {
    font-family: 'microsoft yahei';
    height: 100%;
    overflow: hidden;
    position: relative;
    background-color: #fafafa;
}

.tabImgInUl {
    width: 100%;
    height: 65px;
    overflow: auto;
}

ul {
    padding-left: 0px;
    margin: 0;
    background-color: rgba(238, 238, 238, .2);
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
    height: 46px;
    background-color: rgba(238, 238, 238, .2);
    padding: 5px 0px 5px 52px;
    color: rgba(0, 0, 0, .8);
    font-size: 16px;
    border-bottom: 1px dashed rgba(200, 200, 200, .2);
}

.username-near {
    margin-bottom: 0px;
}

img {
    width: 36px;
    height: 36px;
    position: absolute;
    left: 7px;
    top: 5px;
    border-radius: 50% 50%;
    border: 1px solid transparent;
    overflow: hidden;
}

.icon-add {
    position: absolute;
    right: 10px;
    top: 25%;
    z-index: 2;
    font-size: 16px;
    border: 1px solid #ddd;
    width: 16px;
    height: 16px;
    color: #fff;
    fill: #fff;
    background-color: #eee;
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

.tabImg>img {
    position: static;
}

.tabImg>span {
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

.my-btn-btnpd>input {
    width: 45%;
    float: left;
    height: 100%;
    border-radius: 10px;
    font-size: 16px;
    color: #fff;
}

.my-btn-btnpd .my-btn-submit {
    float: right;
    background-color: #FF0f45;
}

.my-btn-btnpd .my-btn-back {
    background-color: #9E5;
}
</style>
<style>
#peopleList .mint-indexlist-nav .mint-indexlist-navlist {
    overflow: auto;
}

.mint-navbar {
    background-color: rgba(238, 238, 238, .2);
    border-bottom: 1px dashed rgba(200, 200, 200, .2);
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
    border-bottom: 1px dashed rgba(200, 200, 200, .2);
}

#yuandibaozha {
    padding-bottom: 45px;
    height: 100%;
}

.vux-tab {
    background-color: #fafafa;
}
</style>
