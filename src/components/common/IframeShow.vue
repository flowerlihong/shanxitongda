<<template>
  <iframe v-if="iframeUrl != ''"  frameborder="no"  :src="iframeUrl" style="width:100%;height:100%;" id="iframe"></iframe>
</template>
<script>
export default {
    data() {
        return {

            iframeUrl: ''
        }
    },
    props: ["model"],
    created() {
        //this.$store.state.selectProjModel.projName='aaa';
       // console.info("---form-----created------");
    },
    activated() {
        this.util.init(this);
      //  console.info("---form----activated-------");
    },
    methods: {
        hide() {
            this.iframeUrl = '';
        },
        _initData(url) {
            if(url.indexOf("?")>-1){
                url = url+"&access_token="+this.util.getAccessToken();
            }else{
                url = url+"?access_token="+this.util.getAccessToken();  
            }
            var _this = this;
            this.util.mask('正在打开表单...');
            this.iframeUrl = url;
            this.addListener();
            // this.getLoadReturnData();
        }, addListener() {

            if (document.getElementById('iframe') != undefined) {

                var _this = this;
                document.getElementById('iframe').onload = function() {
                    console.info('===========================iframe加载完成============================');
                    _this.util.unmask();
                }
                clearInterval(this.timer);
                this.timer = null;
            } else {
                console.info("============" + this.timer);
                if (this.timer == null) {
                    this.timer = setInterval(this.addListener, 100);
                }
            }
        }
    }
}
</script>
<<style scoped>

</style>


