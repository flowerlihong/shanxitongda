<template>
  	<div class="page__hd">
          <swipeout>
            <div class="row" style="margin:0;overflow:auto;">
                <swipeout-item :threshold=".5" v-for="(item,key) in classDatas" underlay-color="#ccc" :key="key">
                    <div slot="right-menu">
                        <swipeout-button @click.native="deleteClass(item)" type="warn">删除</swipeout-button>
                    </div>
                    <div @click="gotoClassEdit(item)" slot="content" style="text-align: left;padding: 5px 10px 5px 5px" class="demo-content vux-1px-t" >
                        
                        <div >
                            <div class="">
                                <span class="anyidian">班次名称:</span>
                                <span style="font-size: 14px;color:#101001">{{item.name}}</span>
                            </div>
                            <div class="">
                                <span class="anyidian">考勤时段:</span>
                                <span style="font-size: 14px;color:#101001">{{item.signTime.substring(0,5)}}-{{item.signOutTime.substring(0,5)}}</span>
                            </div>
                            
                        </div>
                    </div>
                </swipeout-item>
               
            </div>
		</swipeout>

       
    <div class="navbar navbar-default navbar-fixed-bottom" style="background:#336699;">
        <p @click="addClass" style="margin-top: 15px;color:#fff"><i style="padding-right: 5px;font-size: 16px;" class="glyphicon glyphicon-edit"></i>添加班次</p>
    </div>
    </div>
    
</template>

<script>
import { mapState} from 'vuex'
import { SwipeoutButton,Swipeout, SwipeoutItem } from 'vux'
export default {
  name: 'legwork',
  data () {
    return {
        classDatas:[],
        items: {
            textAlign: 'left',
            padding: '10px 10px',
            alignItems: 'center'
        },
    }
  },
  watch:{
      temp:function(newVal){
          if(newVal.indexOf("loadClass")>=0){
              this.loadData();
          }
          
      }
  },
  components:{
    SwipeoutButton,Swipeout, SwipeoutItem
  },
  computed: {
		...mapState({
			temp: state => state.temp
			
		})
		

  },
  created(){
  	   this.loadData(); 
  },
  methods: {
    loadData(){
        var param = {
            operateType:'getClassLists'
        };
        this.util.mask();
        var _this=this;
        this.util.post('/admin/appAgentAction!runAgent.action?agentId=Agent_WeChat_CheckWork&appId=WeChat',param,function(res){
            _this.util.unmask();
            if(res.status==200){
                _this.classDatas=res.data;
            }
            
        });
    },
  	//添加班次
	addClass(){
        var classData = {
            name: '默认班次',
            timeFrameName: '默认时段',
            signTime: '08:00',
            signOutTime:'18:00',
            checkDayName:'工作日',
            memberStr:'',
            memberArr:[],
            pointName: '',
            pointId: '',
            monday :true,
            tuesday :true,
            wednesday :true,
            thursday: true,
            friday: true,
            Sat :false,
            weekday :false
        }
		this.$router.push({name:'classEdit',query:{classData:classData}});
	},
	gotoClassEdit(item){
        item.memberArr=item.member==undefined? []:item.member.split(",");
        item.memberStr =this.util.isNotEmpty(item.memberStr)? item.memberStr:"";
        item.monday = item.monday==1? true:false;
        item.tuesday =item.tuesday==1? true:false;
        item.wednesday =item.wednesday==1? true:false;
        item.thursday =item.thursday==1? true:false;
        item.friday =item.friday==1? true:false;
        item.sat =item.sat==1? true:false;
        item.weekday =item.weekday==1? true:false;
        this.$router.push({name:'classEdit',query:{classData:item}});
        
	},
    deleteClass(classItem){
        var _this=this;
        this.util.confirm('确定要删除此班次?',function(){
            _this.util.mask("正在删除...");
            _this.util.post('/wx/register/deleteClass',{classId:classItem.id},function(data){
                if(data.status){
                    _this.util.unmask();
                    _this.classDatas = _this.classDatas.filter((item) => {
                          return item!=classItem;
                    });
                }else{
                    _this.util.unmask();
                    _this.util.alert("删除失败！");
                }
            });
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .anyidian{
        color:#9f9f9f;
    }
    .demo-content{
        border-bottom: 1px solid #eee
    }
</style>
