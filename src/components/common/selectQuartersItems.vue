<template>
    <li>
        <div @click.stop.prevent='toggle' :style="lsSty" :data-id="model.id" :data-avatar="model.avatar">
            <span>{{ model.label }}&nbsp;&nbsp;
                <s v-if="typeFlag">[{{ model.positionName }}]</s>
            </span>
            <br/>
            <span class="mobile">{{model.mobile}}</span>
            <svg :style="svgStyle" v-if="this.model.type!='user'" class="icon icon-add" aria-hidden="true">
                <use xlink:href="#icon-ren"></use>
            </svg>
            <svg @click.stop.prevent='checked(model)' v-show="!radioSelectFlags" class="icon icon-add" :style="checkedStyle" :data-msg="model.checked" aria-hidden="true">
                <use xlink:href="#icon-gouxuan"></use>
            </svg>
            <svg @click.stop.prevent='checked(model)' v-show="radioSelectFlags" class="icon icon-add1" :style="checkedStyle" :data-msg="model.checked" aria-hidden="true">
                <use xlink:href="#icon-gouxuan"></use>
            </svg>

        </div>
        <!--<img :src="imgUrl!=''&&imgUrl!=null&&imgUrl!=undefined? this.util.getBaseUrl()+'/static/img/ceneo4LyDg8c.jpg':imgUrl" v-if="typeFlag" >-->
        <img :src="model.picture!=null&&typeof(model.picture)!='undefined'&&model.picture!='' ? model.picture : this.util.getBaseUrl()+'/static/img/ceneo4LyDg8c.jpg'" v-if="typeFlag">
        <i></i>
        <ul v-show="open" >
            <selectQuartersItems v-for='(cel) in model.children'  :radioSelectFlags="radioSelectFlags" :orgUsersObj="orgUsersObj" @messageOut="messageIn" :level='level+1' :parent='model' :key='cel.id' :model='cel'></selectQuartersItems>
        </ul>
    </li>
</template>



<script type="text/javascript">
export default {
    props: ['model', 'level', 'parent', 'orgUsersObj', 'radioSelectFlags'],
    components: {},
    name: 'selectQuartersItems',
    data() {
        return {
            checkedSty: {
                borderColor: '#ccc',
                backgroundColor: '#fff',
            },
            svgStyle: {
                position: 'absolute',
                left: this.level * 8 - 7 + 'px',
                top: '32%',
                color: '#000',
                fill: '#000',
                border: 'none',
                backgroundColor: 'rgb(250, 250, 250)',
            },
            lsSty: {
                position: 'relative',
                lineHeight: '36px',
                height: '36px',
                backgroundColor: '#fafafa',
                padding: '0px',
                paddingLeft: this.level * 8 + 10 + 'px',
            },
            open: false,
            isFolder: true,
            ischecked: false,
            typeFlag: this.model.type == 'user',
            imgUrl: this.model.picture,
            modelArr: [],
            modelArr1: [],

        }
    },
    created() {
        if (this.orgUsersObj[this.model.id] == undefined) {
            this.orgUsersObj[this.model.id] = new Array();
        }
        this.orgUsersObj[this.model.id].push(this.model);
        this.model.parent = this.parent;
        if (this.model.parent != undefined) {
            if (this.model.parent.childComponents == undefined) {
                this.model.parent.childComponents = new Array();
            }
            this.model.parent.childComponents.push(this.model);
        }
        this.userSty();
        this.userImg();
        this.firstShow();
        console.log(",model",this.model)
    },
    computed: {
        // 计算属性的 getter
        
        checkedStyle: function() {
            // `this` 指向 vm 实例  
            return {
                borderColor: '#ccc',

                //backgroundColor:(this.model.parent != undefined && this.model.parent.checked == 1)?'skyblue':(this.model.checked == 0?'#fff':'skyblue')};
                backgroundColor: this.model.checked == 0 ? '#fff' : 'skyblue'
            };
        }
    },
    methods: {
        toggle: function() {
            //    if(this.radioSelectFlags){
            //        this.checked();
            //        return false;
            //    }
            if (this.model.children && this.model.children.length) {
                this.open = !this.open;
                if (this.open) {
                    this.svgStyle.color = 'skyblue';
                    this.svgStyle.fill = 'skyblue';
                } else {
                    this.svgStyle.color = '#000';
                    this.svgStyle.fill = '#000';

                }
            }

        },
        checked: function(mt) {
            // if(typeof mt== 'object'){
            //     // this.changeBgc()
            //      return this.checked(mt.children.length);
            // }
            if (this.radioSelectFlags ) {
                for (var key in this.orgUsersObj) {
                    for (var i = 0; i < this.orgUsersObj[key].length; i++) {
                        this.orgUsersObj[key][i].checked = 0;
                    }
                }
            }
            //return;
            /*
            if(a=="checked"&&mt[a]==0)  {
                        this.model.checked = 1;
                        //mt[a]=1;
                        //this.checkedSty.backgroundColor='skyblue';
                        
                    }else if(a=="checked"&&mt[a]==1)  {
                        mt[a]=0;
                        this.model.checked = 0;
                        //this.checkedSty.backgroundColor='#fff';
                        
                    }
                    */
            this.model.checked = this.model.checked == 0 ? 1 : 0;

            //this.batchUpdateParent(this.model);
            // this.bacthUpdateChild(this.model);
            // else if(typeof mt== 'Array'){
            //     for(var i =0 ;i<mt.children.length;i++){
            //      return this.checked(mt.children[i]);
            //     }
            // }

            // this.$store.state.myUserList=this.modelArr;
            // this.$emit('messageOut',this.modelArr);

            if (this.model.checked == 1) {
                this.$store.state.myUserList.push(this.model)

            } else if (this.model.checked == 0) {
                this.deleteRepeat(this.$store.state.myUserList, this.model)
            }
            // =this.modelArr;
            this.messageIn()
        },
        batchUpdateParent: function(model) {
            if (model.checked == 1 && model.parent != undefined) {
                model.parent.checked = 1;
                this.batchUpdateParent(model.parent);
            } else if (model.checked == 0 && model.parent != undefined) {
                if (model.parent.children != undefined) {
                    for (var child in model.parent.children) {
                        if (child.checked == 1) {
                            model.parent.checked = 1;
                            this.batchUpdateParent(model.parent);
                            return;
                        } else {
                            break;
                        }
                    }
                    model.parent.checked = 0;
                    this.batchUpdateParent(model.parent);

                }
            }
        },
        bacthUpdateChild: function(model) {
            //    if(this.model.children.length!=undefined&&this.children.length<1){
            // {
            //     this.modelArr.push(model);
            // }
            // if(this.model.children.length!=undefined&&this.children.length<1){
            //     this.modelArr.push(model);
            // }
            //    for(var i=0;i<this.modelArr.length;i++){
            //         if(this.modelArr[i].id==vtId){
            //             this.synchronous(this.modelArr[i].id,0)
            //             this.modelArr.splice(i,1);
            //         }
            // }
            //    this.messageIn();
            //    }
            if (model.childComponents != undefined) {
                for (var i = 0; i < model.childComponents.length; i++) {
                    var child = model.childComponents[i];
                    child.checked = model.checked;
                    this.bacthUpdateChild(child);
                }

            }
        },

        // changeBgc:function(mc){
        //     if(mc==1){
        //         this.checkedSty.backgroundColor='skyblue';
        //     }else if(mc==0){
        //         this.checkedSty.backgroundColor='#fff';
        //     }
        // },
        userSty() {
            if (this.typeFlag) {
                this.lsSty = {
                    position: 'relative',
                    height: '46px',
                    backgroundColor: 'rgba(238, 238, 238,.2)',
                    padding: '5px 0px 5px 52px',
                    color: 'rgba(0,0,0,.8)',
                    fontSize: '12px',

                };
            }
        },
        userImg() {
            if (this.imgUrl == null || this.imgUrl == undefined) {
                this.imgUrl = '../src/img/ceneo4LyDg8c.jpg'
            }
        },
        messageIn() {
            // if(this.model.children=='undefined'){
            //     this.modelArr=this.modelArr1;
            //     this.$emit('messageOut',this.modelArr)
            // }else{
            this.$emit('messageOut', this.modelArr1)
            // }
        },
        //  deleteRepeat(){
        //         var s = [];
        //         //遍历数组
        //         for(var i = 0;i<this.arr.length;i++){
        //             if(!this.deleteRepeat1(s,this.arr[i].id)){  //判断在s数组中是否存在，不存在则push到s数组中
        //                 s.push(this.arr[i]);
        //             }
        //         }
        //         this.arr=s;
        //     },
        firstShow() {
            if (this.level == 1) {
                this.toggle();
            }
            if (this.model.type == 'user') {
                this.checkedStyle.top = '37%'
            }
        },
        deleteRepeat(arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }

    }
}
</script>

<style scoped>
li {
    list-style: none;
    padding-left: 0px;
    position: relative;
    text-align: left;
}

ul {
    padding-left: 0px;
    margin: 0px;
}

i {
    display: block;
    width: 100%;
    height: 1px;
    background-color: #fafafa;
    border-bottom: 1px dashed rgba(200, 200, 200, .2);
}

svg {}

.icon-add,
.icon-add1 {
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

.icon-add1 {
    border-radius: 50%;
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

span {
    margin-bottom: 5px;
}

s {
    color: #ccc;
    font-size: 12px;
    text-decoration: none;
}

.mobile {
    display: block;
    font-size: 16px;
    color: #ccc;
    margin-top: 0px;
}
</style>



