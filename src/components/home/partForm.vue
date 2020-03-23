
<template>
    <div class="partForm">
        <div v-for="(mainForm,index) in resultArr" :key="index">
            
            <div class="part-cell" v-for="(item,key) in mainForm" :key="key" style="display:block;overflow:hidden;height:40px;line-height:40px;" v-if="!(item.hidden)" :data-id="item.id">
                <span class="col-xs-4" style="text-align:left" >{{item.name}}<span style="color:red" v-if="!(item.allowBlank)">*</span></span>
                <input v-if="item.xtype=='TEXT'"  v-model="resultArr[index][key].initVal" @blur="outputVal(resultArr[index][key].initVal,item.id,item.name)" class="col-xs-8" :placeholder="item.emptyText" type="text" :disabled="item.readOnly">
                <popup-radio :readonly="item.readOnly==1"  v-if="item.xtype=='COMBOBOX_'"  :options="resultArr[index][key].conf.split(',')" v-model="resultArr[index][key].initVal" style="padding:0 15px;height:40px;line-height:40px;color:#c7c7c7;" class="most-block"></popup-radio>
                <datetime :readonly="item.readOnly==1"  v-if="item.xtype=='DATE'"  class="col-xs-8 be-check"  v-model="resultArr[index][key].initVal" style="padding:0px;padding-right:10px;" default-selected-value="date" format="YYYY-MM-DD" :placeholder="'请选择日期'"></datetime>
                <div class="col-xs-8 part-select" @click="partSelect(item.xtype,index,key)"   v-if="item.xtype=='SEL_USER_'" style="height:100%;">
                    {{resultArr[index][key].userName}}
                    <div v-transfer-dom>
                        <popup position="right" v-model="resultArr[index][key].visible" style="width:100%;height:100%" >
                            <SelectUser :userModel="resultArr[index][key]" ref="orgfile1" @selectUsersCallBack="selUser($event)" ></SelectUser>
                        </popup>
                    </div>  
                </div>
                <div class="col-xs-8 part-select" @click="partSelect(item.xtype,index,key)" v-if="item.xtype=='SEL_DEPART_'" style="height:100%;">
                    {{resultArr[index][key].departName}}
                    <div v-transfer-dom  >
                        <popup position="right" v-model="resultArr[index][key].visible" style="width:100%;height:100%" >
                            <selectQuarters :orgModel="resultArr[index][key]" ref="orgfile2" @selectOrgCallBack="selDepart($event)"></selectQuarters>
                        </popup>
                    </div>  
                </div>
                <div class="col-xs-8 part-select" @click="partSelect(item.xtype,index,key)" v-if="item.xtype=='SEL_PROJ_'" style="height:100%;">
                    {{resultArr[index][key].projName}}
                    <div v-transfer-dom  >
                        <popup position="right" v-model="resultArr[index][key].selectProjVisible" style="width:100%;height:100%" >
                            <!-- <selectQuarters :orgModel="popupShow[2]" ref="orgfile3" @selectOrgCallBack="selProj($event)" ></selectQuarters> -->
                            <SelectProj :mess="resultArr[index][key]" ref="projfile"  @selectProjCallback="selProj($event)"></SelectProj>
                        </popup>
                    </div>  
                </div>
                <input type="number" v-if="item.xtype=='number'" v-model="resultArr[index][key].initVal" v-on:input="multiply(index)" class="num col-xs-8" > 
                <input type="number" v-if="item.xtype=='numberAll'" v-model="resultArr[index][key].initVal" class="num col-xs-8"> 
           </div>
           <div class="add-part-form" >
                <p class="col-xs-6">添加明细表{{index+1}}</p>
                <button class="col-xs-2" @click="removeForm(index)">删除</button>
                <button class="col-xs-2" @click="addPartForm(index)">添加</button>
            </div> 
        </div>
       <div class="part-submit">
            <button class="col-xs-2" @click="submit()">提交</button>
       </div>
    </div>
</template>

<script>
import { Actionsheet, XSwitch, TransferDom, Popup, Alert, Radio, Group, XInput, PopupPicker, Cell,XButton } from 'vux'
import selectQuarters from '../common/selectQuarters.vue'
import SelectUser from '../common/SelectUser.vue'
import SelectProj from '../common/SelectProj.vue'
import {mapState,mapGetters, mapActions} from 'vuex'
import { Checker, CheckerItem,Datetime,PopupRadio } from 'vux'
export default {
    data(){
        return{
            popupShow:[{visible:false},{visible:false},{selectProjVisible:false},],
           mainForms :[ [
    {
        id : "univalence",
        name : "单价",
        hidden : 0,
        readOnly:0,
        allowBlank:1,
        xtype:'number',
        initVal:'23'
    },
    {
        id : "pcs",
        name : "个数",
        hidden : 0,
        allowBlank:1,
        readOnly:0,
        xtype:'number',
        initVal:'2'
    },
    {
        id : "total ",
        name : "总价",
        allowBlank:1,
        hidden : 0,
        readOnly:0,
        xtype:'numberAll',
        initVal:''
    },
    {
        id : "DATE_",
        name : "日期",
        hidden : 0,
        readOnly:0,
        xtype:'DATE',
        initVal:'2017-09-11'
    },
    {
        id : "CONTRACT_NAME_",
        name : "合同名称",
        hidden : 0,
        allowBlank:0,
        blankText:'请输入合同名称',
        emptyText:'请输入合同名称',
        // type:'email',//url,mobile,decimal,china
        // typeText:'请输入',
        xtype:'TEXT'
        
    },{
        id : "PROJ_NAME_",
        name : "项目名称",
        hidden : 0,
       	readOnly:1,
        selCallBack:'selectProj',
        xtype:'SEL_PROJ_',
        selectProjVisible:false
    },
    {
        id : "PROJ_UID_",
        name : "项目主键",
        hidden : 0,
        xtype:'TEXT'
    },{
        id : "MODE_",
        name : "订立方式",
        hidden : 0,
        readOnly:0,
        xtype:'COMBOBOX_',
        conf:"口头,书面",
        initVal:'书面'
    },
    
    {
        id : "DEPART_NAME_",
        name : "报销部门",
        hidden : 0,
        initVariable:'DEPART_NAME_',
        xtype:'SEL_DEPART_',
        visible:false,
        selCallBack:'selectDepart',
    },
    {
        id : "DEPART_UID_",
        name : "报销部门主键",
        hidden : 1,
        initVariable:'DEPART_UID_'
    },{
        id : "USER_NAME_",
        name : "报销人",
        hidden : 0,
        readOnly:1,
        xtype:'SEL_USER_',
        visible:false,
        initVal:'2017-09-11'
    }]],
    resultArr:[[]],
    userObj:{},
    departObj:{},
    ProjObj:{},
    inputValue:[[{}]],

        }
    },
    
    created(){
    },
    methods:{
        inputValCount(){
            // for(var i=0;i<this.inputVal.length;i++){
            //     this.inputVal[i].num1=
            //     this.inputVal[i].num2
            // }
            console.log(this.resultArr[0])
        },
        outputVal(str,id,name){
            var obj={model:str,id:id,name:name}
           
        },
        removeForm(i){
            if(this.resultArr.length<2){
                alert('NO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                return;
            }else{
                this.resultArr.splice(i,1)
            }
        },
        multiply(i){
            var arr=[]
            for(var j=0;j<this.resultArr[i].length;j++){
                if(this.resultArr[i][j].xtype=='number'){
                    arr.push(this.resultArr[i][j].initVal)
                }
            }
            for(var k=0;k<this.resultArr[i].length;k++){
                if(this.resultArr[i][k].xtype=='numberAll'){
                   for(var s =0;s<arr.length;s++){
                       if(arr[s]==0){
                           this.resultArr[i][k].initVal=''
                        }else if(s>0){
                            this.resultArr[i][k].initVal=parseInt(arr[s])*parseInt(arr[s-1])
                        }
                   }
                }
            }
        },
        submit(){
            console.log(this.resultArr.shift())
        },
        addPartForm(index){
            var result=$.extend( true, {},this.mainForms[0]);
            var arr=[],
                arr2=[{}];
            for(var i in result){
                arr.push(result[i])
            }
            this.resultArr.push(arr)
            this.multiply(index);
            
        },
   
        selUser(data){
             this.userObj=data[0]
        },
        selDepart(data){
            this.departObj=data[0]
        },
        selProj(data){
            this.ProjObj=data;
        },
         
        partSelect(typeStr,index,key){
            if(typeStr=='SEL_USER_'){
                this.resultArr[index][key].visible=true
                this.$refs.orgfile1[index-1].postMsg({singer:true,radioCheckedArr:[]});
            }else if(typeStr=='SEL_DEPART_'){
                this.resultArr[index][key].visible=true
                this.$refs.orgfile2[index-1].postMsg({singer:true,radioCheckedArr:[]});
            }else if(typeStr=='SEL_PROJ_'){
                this.resultArr[index][key].selectProjVisible=true;
                this.$refs.projfile[index-1].loadData();
            }
        }
    },
    components:{
    mapState,
    mapGetters,
    mapActions,
    Checker, 
    CheckerItem,
    Datetime,
    PopupRadio,
    PopupPicker,
    selectQuarters,
    SelectUser,
    SelectProj,
    XButton,
    Cell,
    // Addsection,
    Actionsheet,
    XSwitch,
    TransferDom,
    Popup,
    Alert,
    Radio,
    Group,
    XInput
  
    },
    directives: {
    TransferDom
  },
}
</script>

<style scoped>
.partForm{
    padding-bottom: 55px;
}
.part-submit{
    position: fixed;
    bottom:0px;
    width: 100%;
    height: 55px;
    padding:5px 0;
    text-align: center;
    background: #fff;
}
.part-submit button{
    width: 45%;;height: 45px;
    position: absolute;left:50%;
    transform: translateX(-50%)
}
.part-select:active{
   background:#ccc;
   color:#c7c7c7;
}
.partForm .weui-cell:before{
    border:0 none;
}
.part-cell:nth-child(1){
     border-bottom:1px solid #ccc;
}
.part-cell{
    border-bottom:1px solid #ccc;
}
.part-cell>div,.part-cell>input{
    text-align: right;
}
.add-part-form{
    background:#e5e5e5;
    display: block; overflow: hidden; height: 40px; line-height: 40px;
}

.add-part-form p{
    text-align: left;
}
.add-part-form button{
    /* width: 60px; */
    height: 30px;
    line-height: 30px;
    background: green;
    color:#fff;
    border-radius: 5px;
    outline: 0 none;
    margin: 5px 10px 5px 0;
    float: right;
}
.add-part-form button:nth-child(3){
    background:red;
    /* margin-left: 20px; */
}
.num{
    text-align: right;
    height: 100%;
}
</style>
<style>
.partForm label,.partForm p{
    margin: 0;
    font-weight:400;
}
</style>


