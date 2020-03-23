<template>
  <div class="filePage" ref="filepage">
    <group v-for="(item,index) in fileDatas" :key="index">
         <cell
          :title="item.name"
          :value="(item.counts)"
          is-link
          :border-intent="false"
          :arrow-direction="showDatas(index) ? 'up' : 'down'"
          @click.native="changeShow(index)">
        </cell>

        <div class="slide" :class="showDatas(index)?'animate':''" :ref="'aniSlide'+index" :slideIndex="'aniSlide'+index">
            <div v-for="fileItem in item.data" :key="fileItem.Id">
              <div class="fileCat">
                {{fileItem.FileName}}
                <span class="download-btn" @click="download(fileItem.Id)"><icon type="download"></icon>下载<a style="display:none;" :ref="'downloadLink'+fileItem.Id"></a></span>  
              </div>
              <div class="hadles">

              </div>
            </div>
        </div>
       
    </group>    
  </div>
</template>
  
<script>
import { Group,Cell,Icon } from "vux";

export default {
  data(){
    return{     
      Id:"",
      fileDatas:[],
      showData:[],
      catShow1:false,
      catShow2:false,
      catShow3:false,
      catShow4:false,
      catShow5:false,
      catShow6:false,
      catShow7:false,
      catShow8:false,
      catShow9:false,
      catShow10:false,
      catShow11:false,
      catShow12:false,
      catShow13:false,
      catShow14:false,
      catShow15:false,
      catShow16:false,
      catShow17:false,
      catShow18:false,
      catShow19:false,
      catShow20:false
     // catShow:false,

    }
  },
  components:{
     Group,Cell,Icon
  },
  props:["model"],
  created(){
    
  },
  activated(){
   // this.queryData()
  },
  methods:{
    queryData(Id){
      console.log("id",Id)
    var _this=this;
    var url='/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_WeChar_Data_Query&appId=WeChat';
    var _this=this;
    this.util.post(url,{operateType:'getProjTypeInfo',projUid:Id},function(res){
       // console.log( res)
        if(res.status ==true){
             _this.fileDatas=res.data;
             for(let i=0;i<_this.fileDatas.length;i++){
               _this.showData[i]=false;
               
             }
        }else{
          this.util.alert(res.msg)
        }
       

    })
  },
  changeShow(index){

    // console.log(this.$refs['aniSlide'+index])
    if(index/1+1<=20){
      this["catShow"+(index/1+1)]=!this["catShow"+(index/1+1)]
      
    }
/*     switch (index/1+1) {
        case 1:
           this.catShow1=! this.catShow1
          break;
       case 2:
            this.catShow2=! this.catShow2
          break;
       case 3:
            this.catShow3=! this.catShow3
          break;
       case 4:
            this.catShow4=! this.catShow4
          break;
       case 5:
           this.catShow5=! this.catShow5
          break;
       case 6:
           this.catShow6=! this.catShow6
          break;
       case 7:
           this.catShow7=! this.catShow7
          break;
       case 8:
           this.catShow8=! this.catShow8
          break;
       case 9:
            this.catShow9=! this.catShow9
          break;
       case 10:
            this.catShow10=! this.catShow10
          break;
       case 11:
            this.catShow11=! this.catShow11
          break;
       case 12:
       
            this.catShow12=! this.catShow12
          break;
       case 13:
       
            this.catShow13=! this.catShow13
          break;
       case 14:
       
            this.catShow14=! this.catShow14
          break;
       case 15:
       
            this.catShow15=! this.catShow15
          break;
       case 16:
       
            this.catShow16=! this.catShow16
          break;
       case 17:
       
            this.catShow17=! this.catShow17
          break;
       case 18:
       
            this.catShow18=! this.catShow18
          break;
       case 19:
       
            this.catShow19=! this.catShow19
          break;
       case 20:
       
            this.catShow20=! this.catShow20
          break;
                  
        default:
          break;
      } */

   // console.log(index)

  },
  download(Id){
			var url = this.util.getBaseUrl() + '/attachmentAction!download.action?id=' + Id + '&access_token=' + this.util.getAccessToken();
			// console.debug(url);
		//	window.open(url);
           //var url2="https://www.baidu.com/";
           this.$refs['downloadLink'+Id][0].href = url;
           this.$refs['downloadLink'+Id][0].click()
           //console.log(this.$refs['downloadLink'+Id][0])
            
        },
    showDatas(index){
      var res = 1;
     // return true
        //  console.log(123)
        //  return this.showData[index]
        if(index/1+1<=20){
          
          return this["catShow"+(index/1+1)]
          
        }
/*       switch (index/1+1) {
        case 1:
            return this.catShow1 
          break;
       case 2:
            return this.catShow2 
          break;
       case 3:
            return this.catShow3 
          break;
       case 4:
            return this.catShow4 
          break;
       case 5:
            return this.catShow5 
          break;
       case 6:
            return this.catShow6 
          break;
       case 7:
            return this.catShow7 
          break;
       case 8:
            return this.catShow8 
          break;
       case 9:
            return this.catShow9 
          break;
       case 10:
           return this.catShow10 
          break;
       case 11:
         return this.catShow11 
          break;
       case 12:
         return this.catShow12 
          break;
       case 13:
         return this.catShow13 
          break;
       case 14:
         return this.catShow14 
          break;
       case 15:
         return this.catShow15 
          break;
       case 16:
         return this.catShow16 
          break;
       case 17:
         return this.catShow17 
          break;
       case 18:
         return this.catShow18 
          break;
       case 19:
         return this.catShow19 
          break;
       case 20:
         return this.catShow20 
          break;

 
      
        default:
          break;
      } */


    }
  }
  
}
</script>

<style lang="less" scoped>
  .slide{
    // padding: 0 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    margin-bottom: 0px;
    text-align: left;
    border-top: 1px solid #eee;
    .fileCat{
      border-bottom: 1px solid #aaa;
      padding: 5px 0;
      color:#9e9e9e;
      position: relative;
      .fileName{
        display: inline-block
      }
      span.download-btn{
        display: inline-block;
        //float: right;
        //height: 100%;
       /*  position: absolute;
        right:0;
        text-align: right; */
        padding: 0 10px;
        color: #868686;
        background-color: #eee;
        float:right;
        border-radius: 4px;
      }
    }
  }
  .animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}

</style>



