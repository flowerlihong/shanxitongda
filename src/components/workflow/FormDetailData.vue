<<template>
  <iframe src="" style="width:100%;height:100%;" id="iframe"></iframe>
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
            timer: null
        }
    },
    props: ["model"],
    created() {
        //this.$store.state.selectProjModel.projName='aaa';

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
        var detailDataUrl = '';
        if (type == 1) {
            if (pageType == 'unApproval') {
                detailDataUrl = this.util.getBaseUrl()
                    + '/workflow/workflowAction!openWorkflow.action?userId=' + this.sessionUtil.getUserId()
                    + '&procDefId=' + this.procDefId
                    + '&procInsId=' + this.procInsId
                    + '&taskId=' + this.taskId
                    + '&currentActId=' + this.currentActId
                    + '&businessKey=' + this.businessKey
                    + '&status=' + this.status + '&taskType=' + this.taskType
                    + '&company_id=' + this.sessionUtil.getCompanyId()
                    + '&access_token=' + this.util.getAccessToken();
            } else if (pageType == 'apply') {
                detailDataUrl = this.util.getBaseUrl()
                    + '/workflow/workflowAction!showHistoryForm.action?userId=' + this.sessionUtil.getUserId()
                    + '&procDefId=' + this.procDefId
                    + '&procInsId=' + this.procInsId
                    + '&businessKey=' + this.businessKey
                    + '&company_id=' + this.sessionUtil.getCompanyId()
                    + '&access_token=' + this.util.getAccessToken();
            } else {
                detailDataUrl = this.util.getBaseUrl()
                    + '/workflow/workflowAction!showHistoryForm.action?userId=' + this.sessionUtil.getUserId()
                    + '&procDefId=' + this.procDefId
                    + '&procInsId=' + this.procInsId
                    + '&taskId=' + this.taskId
                    + '&currentActId=' + this.currentActId
                    + '&businessKey=' + this.businessKey
                    + '&company_id=' + this.sessionUtil.getCompanyId()
                    + '&status=' + this.status + '&taskType=' + this.taskType
                    + '&access_token=' + this.util.getAccessToken() + '&flag=true';
            }
        }else{
            detailDataUrl = this.util.getBaseUrl()
                    + '/workflow/workflowAction!getProcessPng.action?userId=' + this.sessionUtil.getUserId()
                    + '&procDefId=' + this.procDefId
                    + '&procInsId=' + this.procInsId
                    + '&access_token=' + this.util.getAccessToken() + '&flag=true';
        }

        console.info(detailDataUrl);
        //$('iframe').src = detailDataUrl;
        //document.getElementById('iframe').src = detailDataUrl;
        //this.util.mask('正在加载数据...');
        this._initData(detailDataUrl);
    },
    methods: {
        _initData(url) {
            var _this = this;
            this.showMask('正在加载数据...');
            document.getElementById('iframe').src = url;
            document.getElementById('iframe').onload = function() {
                //console.info('===========================iframe加载完成============================');
                _this.hideMask();
            }
            // this.getLoadReturnData();
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


