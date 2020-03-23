<template>
    <div style="overflow: atuo; width: 100%; height: 100%;">
        <img id="img_processPng" src=""/>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                procInsId: '',
                procDefId: ''
            }
        },
        created(){

        },
        activated(){
            this.procInsId = this.util.getUrlParam('procInsId');
            this.procDefId = this.util.getUrlParam('procDefId');
            var imgUrl = this.platform.getBaseUrl()
								+'/open/workflowAction!getProcessPng.action?userId='+this.sessionUtil.getUserId()+'&procDefId='
								+this.procDefId 
                                +'&procInsId='+this.procInsId
                                +'&company_id='+this.sessionUtil.getCompanyId()
                                +'&access_token='+this.platform.getAccessToken()+'&if_login=1&flag=true';
            console.info(imgUrl);
            console.log(this.platform)
            //document.getElementById('img_processPng').src = imgUrl;
            this._initData(imgUrl);
        },
        methods: {
            _initData(url){
                var _this = this;
                _this.showMask('正在加载数据...');
                document.getElementById('img_processPng').src = url;
                document.getElementById('img_processPng').onload = function(){
                    //console.info('===========================iframe加载完成============================');
                    _this.hideMask();
                }
            },
            showMask(){
                this.util.mask('正在加载数据...');
            },
            hideMask(){
                this.util.unmask();
            }
        }
    }
</script>
<style scoped>

</style>


