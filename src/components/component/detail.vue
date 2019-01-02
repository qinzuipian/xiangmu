<template>
    <div>
        <el-button type="primary" class="btn" size="mini" @click="printBtn()">打印</el-button>
        <div id="print">
            <div class="top" style="border: 1px solid #c3d3ed;">
                <el-table :data="issueData" center style="width: 100%"> <!-- @row-contextmenu="showDetail"-->
                    <el-table-column type="index" height="100" show-overflow-tooltip :index="indexMethod">
                    </el-table-column>
                    <el-table-column prop="name" height="100" show-overflow-tooltip  width="80" label="姓名">
                    </el-table-column>
                    <el-table-column prop="itemName" show-overflow-tooltip height="100" width="120" label="项目名称">
                    </el-table-column>
                    <el-table-column prop="type" show-overflow-tooltip height="100" width="180" label="审核类型">
                    </el-table-column>
                    <el-table-column prop="message" show-overflow-tooltip height="100" width="240" label="异常信息">
                    </el-table-column>
                    <el-table-column prop="price" show-overflow-tooltip height="100" width="60" label="单价">
                    </el-table-column>
                    <el-table-column prop="quantity" show-overflow-tooltip height="100" width="50" label="数量">
                    </el-table-column>
                    <el-table-column prop="amount" show-overflow-tooltip height="100" width="80" label="扣款金额">
                    </el-table-column>             
                    <el-table-column prop="description" show-overflow-tooltip height="100" width="176" label="扣费原因">
                    </el-table-column>
                            
                </el-table>
            </div>
        </div>
    </div>
    
</template>



<script>
import axios from "axios";
export default {
  name: "Medical",
  props: ["medicalText"],
  data() {
    return {
      issueData: []
    };
  },
  methods: {
    //获取异常信息列表
    getMedical() {
      axios({
        method: "post",
        url:
          axios.PARK_API +
          "/hospitalization/biz/rstdatorderchargeback/queryChargebackByHospitalName",
        params: {
          //   orderId: "74ddedfc-fcf0-40e8-bfc6-3653e0fd9d13"
          hospitalName: this.medicalText.hospitalName
        } /* ,
         headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      })
        .then(res => {
          if (res.data.code == 0) {
            this.issueData = res.data.data;
            console.log(this.issueData);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    // 表格前面的序号
    indexMethod(index) {
      return index * 1 + 1;
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
    }
  },
  created() {
    this.getMedical();
  }
};
</script>



<style scoped>
#print span {
  margin-left: 70%;
}
.btn {
  margin-bottom: 6px;
}
#print p {
  margin-left: 14%;
}
/* #print table td {
    border:2px solid #000;
} */

.write {
  margin-left: 58%;
}
</style>
