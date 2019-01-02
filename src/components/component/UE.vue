<template>
    <div>
        <script id="editor" type="text/plain"></script>
        <el-button @click="cancel" style="margin: 20px;" type="danger">取消</el-button>
        <el-button @click="getUEContent" style="margin: 20px;" type="success">确认</el-button>

    </div>
</template>

<script>
    export default {
        name: 'UE',
        data () {
            return {
                editor: null,
                contentTxt: ''
            }
        },
        props: {
            defaultMsg: {
                type: String
            },
            config: {
                type: Object
            }
        },
        mounted() {
            const _this = this;
            this.editor = UE.getEditor('editor', this.config); // 初始化UE
            this.editor.addListener("ready", function () {
                _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            });
        },
        methods: {

            // 获取内容纯文本
            getUEContent() { // 获取内容方法
                this.contentTxt = this.editor.getContentTxt()
                this.$emit("getUEContent",this.contentTxt);
                this.contentTxt = '';
            },
            cancel(){
                this.$emit("hiddenReply");
            }
        },
        destroyed() {
            this.editor.destroy();
        }
    }
</script>

<style scoped>

</style>