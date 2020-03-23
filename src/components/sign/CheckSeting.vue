<template>
  	<div style="margin-top: 0px;">
        <div class="weui-cell weui-cell_select myCell" style="padding:10px 15px;">
            <div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-globe"></i></div>
            <div class="weui-cell__hd">
                <span>考勤点</span>
            </div>
            <div class="weui-cell__bd myCell-bd" @click="gotoPointSet()"></div>
        </div>  
        <div class="weui-cell weui-cell_select myCell" style="padding:10px 15px;border-bottom: 1px solid #eee;">
            <div class="weui-cell__hd"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-list-alt"></i></div>
            <div class="weui-cell__hd">
                <span>考勤班次</span>
            </div>
            <div class="weui-cell__bd myCell-bd" @click="gotoClassSet()"></div>
        </div>
        
            
			<a v-if="ifTixing" class="weui-cell weui-cell_access" @click="gotoRemindSet()" href="javascript:;">
				<div class="weui-cell__hd"><span class="glyphicon glyphicon-bell"></span></div>
                <div class="weui-cell__bd">
                    <p>考勤提醒</p>
                </div>
                <div class="weui-cell__ft">
                </div>
            </a>
        </div>
</template>

<script>
 //const wx = require('weixin-js-sdk');
export default {
  name: 'legwork',
  data () {
    return {
        ifTixing:false   //暂不用考勤提醒
    }
  },
  created(){
  	
  },
  methods: {
  	//考勤点设置
	gotoPointSet(){
		this.$router.push({name:'setCheckPoint'});
	},
	//考勤班次设置
	gotoClassSet(){
        this.$router.push({name:'setClassList'});
		
	},
	gotoRemindSet(){
		this.$router.push({name:'setRemind'});
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.price{
	height: 48px;
	line-height: 48px;
	border-bottom: 1px solid #eee;
}
.price input{
    height: 40px;
    padding-top: 10px;
    text-align: left;
}
.price>span{
	padding: 0 10px;
}

.point-style{
    position:absolute;
    left:3px;
    top:16px;
}
</style>
