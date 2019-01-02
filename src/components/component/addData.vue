<template>
    <div>
        <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
            <el-form-item label="项目名称" style="width:90%">
                <el-input v-model="sizeForm.itemName" :disabled="true"></el-input>
            </el-form-item>
             <el-form-item label="审核类型" style="width:90%">
                <el-input v-model="sizeForm.type" :disabled="true"></el-input>
            </el-form-item>
             <el-form-item label="异常信息" style="width:90%">
                <el-input v-model="sizeForm.message" :disabled="true"></el-input>
            </el-form-item>
           
              <el-form-item label="单价" style="width:90%">
                <el-input v-model="sizeForm.price" :disabled="true"></el-input>
            </el-form-item>
             <el-form-item label="异常等级" style="width:90%">
                <el-input v-model="sizeForm.severity" :disabled="true"></el-input>
            </el-form-item>
             <el-form-item label="异常个数" style="width:90%" v-show="tdShow">
                <el-input v-model="sizeForm.sum" @blur="sum"></el-input>
            </el-form-item>
            <el-form-item label="扣款费用" style="width:90%">
                <el-input v-model="sizeForm.amount"></el-input>
            </el-form-item>
            <el-form-item label="扣款原因" style="width:90%">
                <el-input type="textarea" autosize placeholder="请输入备注内容" v-model="sizeForm.description"></el-input>
            </el-form-item>
            
            <el-form-item size="large" style="width:90%">
                <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
                <el-button type="danger" @click="clear" size="mini">取消</el-button>
            </el-form-item>
            </el-form>
    </div>
</template>


<script>
import axios from "axios";
export default {
  name: "addData",
  props: ["addText", "tdId", "orderId", "deduction"],
  data() {
    return {
      sizeForm: {
        itemName: "",
        type: "",
        message: "",
        amount: "",
        sum: "",
        severity: "",
        price: "",
        description: ""
      },
      home: "",
      tdShow: true
    };
  },
  methods: {
    startdata() {
      // console.log(this.tdId);
      // console.log(this.orderId);
      if (this.addText.itemName) {
        this.tdShow = true;
      } else {
        this.tdShow = false;
      }
      this.sizeForm.itemName = this.addText.itemName;
      this.sizeForm.type = this.addText.type;
      this.sizeForm.message = this.addText.message;
      this.sizeForm.price = this.addText.price;
      this.sizeForm.severity = this.addText.severity;
      // this.sizeForm.sum = this.addText[0].sum;
      // this.sizeForm.amount = this.addText[0].amount;
    },
    sum() {
      this.sizeForm.amount = this.sizeForm.sum * this.sizeForm.price;
    },
    onSubmit() {
      let data = {};
      if (this.tdId == "数据已存在") {
        data.itemName = this.addText.itemName;
        data.type = this.addText.type;
        data.message = this.addText.message;
        data.itemCode = this.addText.itemCode;
        data.quantity = this.sizeForm.sum;
        data.amount = this.sizeForm.amount;
        data.orderId = this.orderId;
        data.description = this.sizeForm.description;
      } else {
        data.id = this.tdId;
        data.quantity = this.sizeForm.sum;
        data.amount = this.sizeForm.amount;
        data.orderId = this.orderId;
        data.description = this.sizeForm.description;
      }
      axios({
        method: "post",
        url:
          axios.PARK_API + "/hospitalization/biz/rstdatorderchargeback/update",
        /*  data: {
          id: this.tdId,
          sum: this.sizeForm.sum,
          amount: this.sizeForm.amount,
          createBy: localStorage.getItem("mainUser")
        }, */
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            // this.$message("提交成功");
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$emit("hiddenadd");
            this.$emit("getdeduction");
            this.$emit("getErrMsg");
          } else {
            this.$message.error("请检查网络");
          }
        })
        .catch(error => {
          this.$message.error("请检查网络");
        });
    },

    clear() {
      this.$emit("hiddenadd");
    }
  },
  created() {
    this.startdata();
  }
};
</script>



<style scoped>
.title {
  font-size: 18px;
  font-weight: 700;
}
</style>
