<template>
<div style="width:100%;height:100%;">
  <iframe v-if=" iframeUrl != ''"  frameborder="no"  :src="iframeUrl" style="width:100%;height:100%;" id="iframe"></iframe>
  <div v-if=" imageUrl != ''" style="overflow: auto;;">
        <img id="img_processPng" style="" :src="imageUrl"/>
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            procInsId: '',
            procDefId: '',
            taskId: '',
            taskType: '',
            currentActId: '',
            status: '',
            businessKey: '',
            timer: null,
            iframeUrl: '',
            imageUrl: '',
        }
    },
    props: ["model"],
    created() {
    },
    activated() {


        this.procInsId = this.util.getUrlParam('procInsId');
        this.procDefId = this.util.getUrlParam('procDefId');
        this.taskId = this.util.getUrlParam('taskId');
        this.taskType = this.util.getUrlParam('taskType');
        this.currentActId = this.util.getUrlParam('currentActId');
        this.status = this.util.getUrlParam('status');
        this.businessKey = this.util.getUrlParam('businessKey');
        var pageType = this.util.getUrlParam('pageType');
        var type = this.util.getUrlParam('type');

    },
    methods: {
        hide() {
            this.iframeUrl = '';
            this.imageUrl = '';
                clearInterval(this.timer);
        },
        _initData(url) {
            var _this = this;
            
      //  console.info("---form----_initData----"+this.model.type+"---"+url);
            if (this.model.type == 2) {
                this.imageUrl = url;
            } else {

                this.util.mask('正在打开...');
                this.iframeUrl = url;
                this.addListener();
            }

        }, addListener() {

            if (document.getElementById('iframe') != undefined) {

                var _this = this;
                document.getElementById('iframe').onload = function() {
                    //console.info('===========================iframe加载完成============================');
                    _this.hideMask();
                }
                clearInterval(this.timer);
                this.timer = null;
            } else {
           //     console.info("============" + this.timer);
                if (this.timer == null) {
                    this.timer = setInterval(this.addListener, 100);
                }

            }
            //this.$refs.processMonitor.loadData();
        },
        showMask() {
            this.util.mask('正在加载数据...');
        },
        hideMask() {
            this.util.unmask();
        }
    }
}
</script>
<<style scoped>

</style>


