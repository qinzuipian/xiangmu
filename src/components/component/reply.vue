<template>
    <div>
        <div class="top">
            <el-table
                    :data="copystatusmsg"
                    center
                    style="width: 100%">
                <el-table-column
                        type="index"
                        height="100"
                        show-overflow-tooltip
                        :index="indexMethod">
                </el-table-column>
                <el-table-column
                        prop="itemName"
                        height="100"
                        show-overflow-tooltip
                        label="项目名称">
                </el-table-column>
                <el-table-column
                        prop="source"
                        height="100"
                        show-overflow-tooltip
                        label="来源">
                </el-table-column>
                <el-table-column
                        prop="message"
                        show-overflow-tooltip
                        height="100"
                        label="异常信息">
                </el-table-column>
                <el-table-column
                        prop="severity"
                        show-overflow-tooltip
                        height="100"
                        label="异常等级">
                </el-table-column>
                <el-table-column
                        prop="type"
                        show-overflow-tooltip
                        height="100"
                        label="审核类型">
                </el-table-column>
            </el-table>
        </div>
        <div class="bottom">
            <p class="bom-title">质询回复</p>
            <p class="bom-text">审核结果: {{childMsgData.status}}</p>
            <p v-show="!hasBeizhu" class="bom-text">审核备注: 暂无备注</p>
            <p v-show="hasBeizhu" class="bom-text">审核备注: </p>

           <!--  <el-row>
                <el-col :span="20" :push="2" v-for="(it, index) in huifuliebiao" :key="index" style="margin-bottom: 5px">
                    <el-card shadow="always">
                        <p v-text="it.description"></p>
                        <div class="replyBottom">
                            <p class="replyerName" v-text="it.username"></p>
                            <p class="replyerName" v-text="it.usercode"></p>
                            <p class="replyTime"  v-text="it.createDate"></p>
                        </div>
                    </el-card>
                </el-col>
            </el-row> -->
          <!--   <ul class="ulList">
              <li  v-for="(it, index) in huifuliebiao" :key="index" >
                <p v-text="it.description"></p>
                <span v-text="it.username"></span>
                <span v-text="it.usercode"></span>
                <span v-text="it.createDate"></span>
              </li>
            </ul> -->
             <ul class="ulList">
              <li  v-for="(it, index) in huifuliebiao" :key="index" >
                <span v-text="it.description" class="left"></span>
                <span class="right">{{it.username}}&nbsp;&nbsp;&nbsp;&nbsp;{{it.usercode}}&nbsp;&nbsp;&nbsp;&nbsp;{{it.createDate}}</span>
              </li>
            </ul>

            <p class="bom-text">附件列表: </p>
            <p v-show="notHasFujian">暂无附件</p>

            <div v-show="!notHasFujian" class="fujianList">
                <div v-for="it in fujianList">
                    <p v-text="it.filename"></p>
                    <!--<p v-text="it.description"></p>-->
                    <a :href="it.downloadUrl" v-show="userType == 1">
                        <el-button type="primary" style="height: 40px;" size="mini">下载</el-button>
                    </a>
                </div>
            </div>


            <!--http://a71344be.ngrok.io-->
            <!--http://192.168.1.5:8080-->
             <!-- action="http://192.168.1.188:8080/zuul/hospitalization/biz/rstdatreply/batchupload" -->
            <div class="upload" v-show="userType == 2">
                <el-upload
                        class="upload-demo"
                        ref="upload"     
                        action="http://172.16.178.13:8089/zuul/hospitalization/biz/rstdatreply/batchupload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="successFunc"
                        :on-change="changeFunc"
                        :file-list="fileList"
                        :data="uploaddata"
                        name="file"
                        :auto-upload="true">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </div>


            <p class="bom-text" v-show="userType != 3">回复: </p>
            <UE v-show="userType != 3" style="width: 96%;margin-left: 2%;" :defaultMsg=defaultMsg :config=config ref="ue"
                v-on:getUEContent="getUEContent" v-on:hiddenReply="hiddenReply"></UE>


            <el-button v-show="userType == 3" @click="agree" style="margin: 20px;" type="danger">同意</el-button>
            <el-button v-show="userType == 3" @click="reject" style="margin: 20px;" type="success">驳回</el-button>
        </div>
    </div>
</template>

<script>
import UE from "./UE.vue";
import axios from "axios";

export default {
  name: "reply",
  props: ["copystatusmsg", "childMsgData", "orderId", "userType"],
  data() {
    return {
      defaultMsg: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },

      //下载附件
      fujianList: [],
      notHasFujian: false,

      // 上传附件
      fileList: [],
      uploaddata: {},
      file: {
        fileName: [],
        filePath: []
      },

      hasFujianShangchuan: false,

      //回复
      huifuxinxi: "",
      // 回复列表  BBS模式展示
      huifuliebiao: [],

      // 富文本编辑器的内容和placeholderTxt
      content: "",
      placeholderTxt: "请输入回复消息",
      downloadUrl: "",

      // 是否有备注信息
      hasBeizhu: false,
      rn:localStorage.getItem('rn')
    };
  },
  mounted() {
    this.getEnclosure();
  },
  methods: {
    // 表格自定义序列号
    indexMethod(index) {
      return index * 1;
    },

    // 关闭回复框
    hiddenReply() {
      this.$emit("hiddenReply");
    },

    // 获取富文本编辑器的文本内容
    getUEContent(content) {
      // 判断当前文本编辑器内容是否为空
      if (content == "" || content == null) {
        this.$message.error("请输入回复内容");
      } else {
        if (this.hasFujianShangchuan == true) {
          this.$emit("fileSubmit", this.file, content);
          // this.$emit("getUEContent", content);
        } else {
          this.$emit("getUEContent", content);
        }
      }
    },

    // 初始化页面
    getEnclosure() {
      //
      // if(this.userType == 1){
      //     console.log('审核模块调用')
      // }else if(this.userType == 2){
      //     console.log('质询模块调用')
      // }

      // 讲改项的orderId赋值给参数
      this.uploaddata.orderId = this.orderId;

      console.log(this.childMsgData);

      // 如果附件列表长度为0    显示暂无数据
      if (this.childMsgData.attlist.length == 0) {
        this.notHasFujian = true;
      } else {
        this.fujianList = this.childMsgData.attlist;
        this.notHasFujian = false;
      }
      // 如果回复列表为0   显示暂无回复
      if (this.childMsgData.rstDatReplyEntity.length == 0) {
        this.hasBeizhu = false;
      } else {
        this.hasBeizhu = true;
        this.huifuliebiao = this.childMsgData.rstDatReplyEntity;
      }
    },

    // 删除
    handleRemove(file, fileList) {
      axios({
        method: "post",
        url:
          axios.PARK_API + "/zuul/hospitalization/biz/rstdatreply/deletefile",
        params: {
          orderId: this.orderId,
          filepath: file.response.msg.listFilePath[0]
        }
      })
        .then(res => {})
        .catch(error => {
          // this.$message.error('请检查网络');
        });

      // 判断当前有没有附件列表
      if (fileList.length > 0) {
        this.hasFujianShangchuan = true;
      } else {
        this.hasFujianShangchuan = false;
      }
    },

    // 附件状态改变时候的函数
    changeFunc(file, fileList) {
      // 判断当前有没有附件列表
      if (fileList.length > 0) {
        this.hasFujianShangchuan = true;
      } else {
        this.hasFujianShangchuan = false;
      }
    },
    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      // console.log(file);
    },
    successFunc(res, file, fileList) {
      this.file.fileName.push(file.response.msg.listFileName[0]);
      this.file.filePath.push(file.response.msg.listFilePath[0]);
    },

    agree() {
      this.$emit("agree", 1);
    },
    reject() {
      this.$emit("reject", 2);
    }
  },
  created() {
    //  this.$emit("getInquiry", this.rn);
  },
  components: {
    UE
  }
};
</script>

<style scoped>
.top {
  width: 98%;
  border: 1px solid #c3d3ed;
  margin-left: 1%;
}

.bottom {
  width: 98%;
  border: 1px solid #c3d3ed;
  margin: 20px 1% 0 1%;
  position: relative;
  text-align: center;
}

.bom-title {
  margin-top: -10px;
  margin-left: 10px;
  line-height: 10px;
  background: white;
  width: 65px;
}

.bom-text {
  text-align: left;
  line-height: 16px;
  margin-left: 20px;
}

.fujianList {
  width: 100%;
}

.fujianList div {
  display: flex;
  justify-content: space-around;
  margin: 10px 10px;
  padding-bottom: 4px;
  border-bottom: 1px solid #c3d3ed;
}

.fujianList div p {
  width: 33%;
  text-align: left;
}

/*回复的BBS模式*/
.replyBottom {
  width: 100%;
  display: flex;
  /*justify-content: space-around;*/
  height: 20px;
}
.replyBottom p:nth-child(1) {
  width: 26%;
  text-align: right;
  line-height: 20px;
}

.replyBottom p:nth-child(2) {
  width: 40%;
  text-align: center;
  line-height: 20px;
}
.ulList {
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: left;
  /* position: absolute; */
}
.ulList li {
  border-bottom: 1px solid #409eff;
  padding: 5px 0;
}
.ulList li span {
  margin-left: 10px;
}
.ulList .right {
  position: absolute;
  right: 4%;
  /* font-size: 12px; */
}
/* .replyBottom p[data-v-5d7a5a0a]:nth-child(1) {
  width: 26%;
} */
</style>