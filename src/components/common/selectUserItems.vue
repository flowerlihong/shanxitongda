<template>       

    <li>
        <div @click.stop.prevent='toggle'  :style="lsSty" :data-id="model.id" :data-avatar="model.avatar">
           <span>{{ model.label }}&nbsp;&nbsp;<s v-if="typeFlag">[{{ model.positionName }}]</s></span>
           <br/>
           <span class="mobile" >{{model.mobile}}</span>
            <svg :style="svgStyle" v-if="this.model.type!='user'"   class="icon icon-add" aria-hidden="true">
                <use xlink:href="#icon-ren"></use>
            </svg>  
            <svg @click.stop.prevent='checked(model)'  v-show="!radioSelectFlags" class="icon icon-add"  :style="checkedStyle" :data-msg="model.checked" aria-hidden="true">
                <use xlink:href="#icon-gouxuan"></use>
            </svg> 
            <!-- <x-icon type="ios-circle-outline" class="select-user"  @click.stop="checked(model)"  v-if="model.checked" size="30"></x-icon>
            <x-icon type="ios-checkmark-outline" class="select-user"  @click.stop="checked(model)"  v-if="!model.checked" size="30"></x-icon> -->
            <x-icon type="ios-plus-outline" class="recent" v-if="typeFlag" v-show="!radioSelectFlags" @click="createUserLink(model)" size="30"></x-icon>
             <!-- <svg class="icon icon-tianjialianxiren"  v-if="typeFlag" v-show="!radioSelectFlags" @click="createUserLink(model)" data-checked=""   aria-hidden="true">
                        <use xlink:href="#icon-tianjialianxiren"></use>
            </svg> -->
        </div>            
            <img :src="model.picture!=null&&typeof(model.picture)!='undefined'&&model.picture!='' ? model.picture : this.util.getBaseUrl()+'/images/icons/ceneo4LyDg8c.jpg'" v-if="typeFlag" >
            <i ></i>
        <ul v-show="open" v-if='isFolder'>
            <SelectUserItems   @ee="creatNear" :radioSelectFlags="radioSelectFlags" v-for='(cel,key,index) in model.children' :orgUsersObj="orgUsersObj"   @messageOut="messageIn" :level='level+1'  :parent='model' :key='cel.id' :model='cel'></SelectUserItems>
        </ul>
    </li>
</template>



<script type="text/javascript">
    export default {
        props: ['model','level','parent','orgUsersObj','radioSelectFlags'],
        components: {},
        name: 'SelectUserItems',
        data() {
            return {
                checkedSty:{
                    borderColor:'#ccc',
                    backgroundColor:'#fff',
                },
                svgStyle:{
                    position:'absolute',
                    left:this.level*8-7+'px',
                    top:'29%',
                    color:'#000',
                    fill:'#000',
                    border:'none',
                    backgroundColor: 'rgb(250, 250, 250)',
                },
                lsSty:{
                    position:'relative',
                    lineHeight:'36px',
                    height:'36px',
                    backgroundColor:'#fafafa',
                    padding:'0px',
                    paddingLeft:this.level*8+10+'px',
                },
                open: false,
                isFolder: true,
                ischecked:false,
                typeFlag:this.model.type=='user',
                imgUrl:this.model.picture,
                modelArr:[],
                modelArr1:[],
                myparent:this.parent 
            }
            },
        created(){
            
            if(this.orgUsersObj[this.model.id] == undefined){
                    this.orgUsersObj[this.model.id] = new Array();
            }
            this.orgUsersObj[this.model.id].push(this.model);
            this.model.parent = this.parent;
            if(this.model.parent != undefined){
                if(this.model.parent.childComponents == undefined){
                    this.model.parent.childComponents = new Array();
                }
                this.model.parent.childComponents.push(this.model);
            }            
            this.userSty();
            this.userImg();
            this.firstShow();
            
        },
        computed: {
            // 计算属性的 getter
            checkedStyle: function () {
            // `this` 指向 vm 实例
            return { borderColor:'#ccc',top:'26%',
                    //backgroundColor:(this.model.parent != undefined && this.model.parent.checked == 1)?'skyblue':(this.model.checked == 0?'#fff':'skyblue')};
                    backgroundColor:this.model.checked == 0?'#fff':'skyblue'};
            }
        },
        methods: {
           toggle: function() {
               
               if(this.radioSelectFlags&&this.model.type=='user'){
                   this.checked();
                   return false;
               }
                if(this.model.children && this.model.children.length) {
                    this.open = !this.open;
                    if(this.open){
                        this.svgStyle.color='skyblue';
                        this.svgStyle.fill='skyblue';
                    }else{
                        this.svgStyle.color='#000';
                        this.svgStyle.fill='#000';                        
                    }
                }               
            },
            firstShow(){
                if(this.level==1){
                    this.toggle();
                }
                if(this.model.type=='user'){
                    // this.checkedStyle.top='37%'
                }
            },
            checked:function(mt){
                this.model.checked = this.model.checked ==0?1:0;
                this.bacthUpdateChild(this.model);
                this.$store.state.myUserList=this.modelArr;
                this.$emit('messageOut',this.modelArr);
                this.modelArr=[];    
              //  console.log("checked------",this.model)
            },
            batchUpdateParent:function(model){
                if(model.checked == 1 && model.parent != undefined){
                    model.parent.checked = 1;
                    this.batchUpdateParent(model.parent);
                }else if(model.checked == 0 && model.parent != undefined){
                    if(model.parent.children != undefined){
                    for(var child in model.parent.children){
                        if(child.checked == 1){
                             model.parent.checked = 1;
                             this.batchUpdateParent(model.parent);
                             return;
                        }else{
                            break;
                        }
                    }
                    model.parent.checked=0;
                    this.batchUpdateParent(model.parent);                    
                }
                }
            },
            bacthUpdateChild:function(model){
               if(model.type=='user'){
                   this.modelArr.push(model);
               }
                if(model.childComponents != undefined){
                    for(var i = 0;i< model.childComponents.length;i++){
                        var child = model.childComponents[i];
                        child.checked = model.checked;
                        this.bacthUpdateChild(child);
                    }
                }
            },
            userSty(){
                
                if(this.typeFlag){
                    this.lsSty={
                        position:'relative',
                        height:'57px',
                        backgroundColor:'rgba(238, 238, 238,.2)',
                        padding:'5px 0px 5px 52px',
                        color:'rgba(0,0,0,.8)',
                        fontSize:'16px',                        
                    };
                }
            },
            userImg(){
                if(this.imgUrl==null||this.imgUrl==undefined){
                    this.imgUrl='../src/img/ceneo4LyDg8c.jpg'
                }
            },
            messageIn(){
                    this.$emit('messageOut',this.modelArr1)
            },
            bySelectUser(){
            },
            createUserLink(node){
                this.$emit('ee',node)
            },
            creatNear(data){
                this.$emit('ee',data)
            }
            
        }
    }
</script>

<style scoped>
li{
    list-style:none;
    padding-left:0px;
    position:relative;
    text-align: left;
}

ul{
    padding-left:0px;
    margin:0px;
}
i{  
    display:block;
    width:100%;
    height:1px;
    background-color:#fafafa;
    border-bottom:1px dashed rgba(200, 200, 200,.2);
}
.recent{
        width: 18px;
    height: 18px;
    position: absolute;
    top: 26%;
    right: 60px;
}
.select-user{
     width: 18px;
    height: 18px;
    position: absolute;
    top: 26%;
    right: 10px;
}
    .icon-tianjialianxiren:active{
        background-color: rgba(0, 0, 0,.2);
    }
    .icon-tianjialianxiren{
        position:absolute;
        right:60px;
        top:26%;
        z-index:2;
        font-size:28px;
        color:#fff;
        fill:#999;
        background-color:rgba(238, 238, 238,.2);
    }
.icon-add{
    position:absolute;
    right:10px;
    top:26%;
    z-index:2;
    font-size:16px;
    border:1px solid #ddd;
    width:16px; 
    height:16px; 
    color:#fff;
    fill:#fff;
    background-color:#eee;
}
img{
    width:36px;
    height:36px;
    position:absolute;
    left:7px;
    top:5px;
    border-radius:50% 50%;
    border:1px solid transparent;
    overflow:hidden;
}
span{
    margin-bottom:5px;
}
s{
    color:#ccc;
    font-size:16px;
	text-decoration: none;
}
.mobile{
    display:block;
    font-size:16px;
    color:#ccc;
    margin-top:0px;
}
</style>



