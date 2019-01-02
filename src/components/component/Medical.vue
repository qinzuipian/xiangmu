<template>
    <div>
        <el-button type="primary" size="mini" @click="printBtn()">打印</el-button>
        <div id="print">
              <h3>个人异常信息表</h3>
                <div class="biaotou">
                    <p>医疗机构名称：<span>{{medicalText.hospitalName}}</span></p>
                    <p>医疗机构级别：<span>{{medicalText.hospitalGrade}}</span></p>
                    <p>结算日期：<span>{{medicalText.balDate}}</span></p>
                </div>
                <table class="ta" border="1" cellspacing="0" cellpadding="1" style="margin: auto">
                    <!--<tr>
                        <td>医疗机构名称（盖章）：</td>
                        <td colspan="2"></td>
                        <td>医疗机构级别：</td>
                        <td></td>
                        <td>结算日期：</td>
                        <td colspan="2"></td>
                    </tr>-->
                    <tr align='center'>
                        <td>姓名</td>
                        <td>{{medicalText.name}}</td>
                        <td>性别</td>
                        <td>{{medicalText.gender}}</td>
                        <td>年龄</td>
                        <td>{{medicalText.age}}</td>
                        <td>身份证号</td>
                        <td>{{medicalText.idCard}}</td>
                    </tr>
                    <tr align='center'>
                        <td>合疗证号</td>
                        <td colspan="2">{{medicalText.reimbNo}}</td>
                        <td>地址</td>
                        <td colspan="4">{{medicalText.address}}</td>
                    </tr>
                    <tr align='center'>
                        <td>诊断</td>
                        <td>{{medicalText.singleCodeName}}</td>
                        <td>医生姓名</td>
                        <td>{{medicalText.docName}}</td>
                        <td>住院总费用</td>
                        <td>{{medicalText.totalFee}}</td>
                        <td>住院天数</td>
                        <td>{{day}}</td>
                        <!-- <td>违规总费用</td>
                        <td></td> -->
                    </tr>
                    <tr>
                        <td colspan="8">&nbsp;&nbsp;&nbsp;&nbsp;经中心审核，此病人住院病例存在以下问题：</td>
                    </tr>
                    <tr align='center'>
                        <td>序号</td>
                        <td>项目名称</td>
                        <td colspan="2">违规问题</td>
                        <td colspan="2">审核规则</td>
                        <td>违规金额（元）</td>
                        <td>异常个数</td>
                    </tr>
                    <tr align='center' v-for="(item,index) in issueData" :key="index">
                        <td style="width:50px;">{{index+1}}</td>
                        <td>{{item.itemName}}</td>
                        <td colspan="2">{{item.message}}</td>
                        <td colspan="2">{{item.type}}</td>
                        <td>{{item.amount}}</td>
                        <td>{{item.sum}}</td>
                    </tr>
                </table>
                <br>
                <br>
        </div>
        <!-- <button  @click="printBtn()">打 印</button> -->
    </div>
    
</template>



<script>
import axios from "axios";
export default {
  name: "Medical",
  props: ["medicalText"],
  data() {
    return {
      issueData: [],
      day: ""
    };
  },
  methods: {
    //获取异常信息列表
    getMedical() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatordermsg/listMsg",
        params: {
          //   orderId: "74ddedfc-fcf0-40e8-bfc6-3653e0fd9d13"
          orderId: this.medicalText.orderId
        }
        /*  headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      })
        .then(res => {
          if (res.data.code == 0) {
            this.issueData = res.data.list;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    //打印表格数据
    printBtn() {
      let subOutputRankPrint = document.getElementById("print");
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
    //计算时间相差天数
    timeFn() {
      //di作为一个变量传进来
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      var dateEnd = new Date(this.medicalText.outDate.replace(/-/g, "/")); //将-转化为/，使用new Date
      var dateBegin = new Date(this.medicalText.inDate.replace(/-/g, "/")); //获取当前时间
      console.log(dateBegin);
      console.log(dateEnd);
      var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      this.day = dayDiff;
      var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
      //计算相差秒数
      var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);
      console.log(
        " 相差 " +
          dayDiff +
          "天 " +
          hours +
          "小时 " +
          minutes +
          " 分钟" +
          seconds +
          " 秒"
      );
      console.log(
        dateDiff + "时间差的毫秒数",
        dayDiff + "计算出相差天数",
        leave1 + "计算天数后剩余的毫秒数",
        hours + "计算出小时数",
        minutes + "计算相差分钟数",
        seconds + "计算相差秒数"
      );
    }
  },
  created() {
    this.getMedical();
    this.timeFn();
  }
};
</script>



<style scoped>
h3 {
  margin-left: 44%;
  margin-bottom: 0;
}
.ta td {
  width: 100px;
  height: 30px;
}
/*.ta tr:first-of-type td{
				border: 1px solid #fff;
			}*/
.biaotou p {
  margin-left: 8%;
  display: inline-block;
}
.biaotou p:first-of-type {
  margin-left: 16%;
}
</style>
