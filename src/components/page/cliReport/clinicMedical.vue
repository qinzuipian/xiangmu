<template>
    <div>
        <div class="right-ctn-title">
             <span>科室名称：</span>
                 <el-select v-model="medicalHome" @change="dataChange" size="mini" placeholder="">
                    <el-option
                    v-for="item in medicalHomes"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                    </el-option>
                </el-select>
              <el-select v-model="closingDate" size="mini" placeholder="结算日期">
               <el-option
               v-for="item in closingDates"
               :key="item.value"
               :label="item.label"
               :value="item.value">
               </el-option>
                </el-select>：
                <el-date-picker
                    v-model="startTime"
                    size="mini"
                    type="date"
                    class="hosptDataSel"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                </el-date-picker>-
                <el-date-picker
                    v-model="endTime"
                    size="mini"
                    type="date"
                    class="hosptDataSel"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                </el-date-picker>
               <el-button type="primary" @click="search" size="mini">查询</el-button>
               <el-button type="danger" @click="clear" size="mini">重置</el-button>
                <el-table
                    :data="medicalData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    border
                    height="500"
                    style="width: 100%">
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="80px">
                    </el-table-column>
                    <el-table-column
                    prop="age"
                    label="年龄"
                    width="50px">
                    </el-table-column>
                    <el-table-column
                    prop="gender"
                    label="性别"
                    width="50px">
                    </el-table-column>
                    <el-table-column
                    prop="idCard"
                    label="身份证"
                    width="180px">
                    </el-table-column>
                    <!-- <el-table-column
                    prop="insuType"
                    label="参保类型">
                    </el-table-column> -->
                    <el-table-column
                    prop="outDept"
                    label="科室"
                    width="80px">
                    </el-table-column>
                    <!--  <el-table-column
                    prop="effectFee"
                    label="统筹支付费"
                    width="100px">
                    </el-table-column> -->
                    <!--  <el-table-column
                    prop="effectFeeS"
                    label="统筹实支"> 
                    </el-table-column>-->
                    
                    <!--  <el-table-column
                    prop="inDept"
                    label="入院科室">
                    </el-table-column> -->
                    <!--  <el-table-column
                    prop="leaveType"
                    label="离院方式">
                    </el-table-column> -->
                    <el-table-column
                    prop="docName"
                    label="医生姓名"
                    width="80px">
                    </el-table-column>
                    <el-table-column
                    prop="totalFee"
                    label="总费用"
                    width="80px">
                    </el-table-column>
                    <el-table-column
                    prop="inDate"
                    label="入院日期"
                    width="100px"
                    :formatter="dateFormat">
                    </el-table-column>
                    <el-table-column
                    prop="outDate"
                    label="出院日期"
                    width="100px"
                    :formatter="dateFormat">
                    </el-table-column>
                    <el-table-column
                    prop="balDate"
                    label="结算日期"
                    width="100px"
                    :formatter="dateFormat">
                    </el-table-column>
                    <!--  <el-table-column
                    label="天数"
                    width="100px">
                     <template slot-scope="scope">
                    </template>
                    </el-table-column> -->

                    <!--  <el-table-column
                    prop="quota"
                    label="定额">
                    </el-table-column> -->
                    <!--  <el-table-column
                    prop="reimbOrg"
                    label="报销机构类型">
                    </el-table-column>
                    <el-table-column
                    prop="reimbThres"
                    label="起付标准">
                    </el-table-column>
                    <el-table-column
                    prop="reimbType"
                    label="报销类型">
                    </el-table-column> -->
                    <!--  <el-table-column
                    prop="selfAmountAcc"
                    label="个人自费">
                    </el-table-column> -->
                    <!-- <el-table-column
                    prop="selfPay"
                    label="个人自付">
                    </el-table-column> -->
                
                <!--  <el-table-column
                    prop="unreimbFee"
                    label="不予报销费用">
                    </el-table-column> -->
                    <el-table-column
                    prop="hospitalName"
                    label="医院名称">
                    </el-table-column>
                    <!-- <el-table-column
                    prop="hospitalGrade"
                    label="医院等级">
                    </el-table-column> -->
                
                    <el-table-column
                    prop="address"
                    label="地址">
                    </el-table-column>
                     <el-table-column
                      fixed="right"
                      label="操作"
                      width="100">
                      <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">详细信息</el-button>
                      </template>
                    </el-table-column>
                </el-table>
                <div class="block" id="fenye">
                    <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @size-change="medicalChange"
                    :total=total>
                    </el-pagination>
                </div>
                 <el-dialog title="" v-if='medicalVisible' :visible.sync="medicalVisible" width="80%"
                           top="20px">
                    <Medical :medicalText="otherData"></Medical>
                </el-dialog>
        </div>
    </div>
    
</template>


<script>
import axios from "axios";
import Medical from "../../component/Medical";
let moment = require("moment");
export default {
  data() {
    return {
      medicalHome: "",
      medicalHomes: [],
      closingDates: [
        {
          value: "1",
          label: "结算日期"
        },
        {
          value: "2",
          label: "处方日期"
        }/* ,
        {
          value: "3",
          label: "出院日期"
        } */
      ],
      closingDate: "1",
      startTime: "",
      endTime: "",
      medicalData: [],
      otherData: [],
      total: 0,
      currentPage: 1,
      pageSize: 12,
      medicalVisible: false,
      //计算天数
      day: "",
      days: []
    };
  },

  methods: {
    // 页码改变时去请求数据
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    medicalChange(val) {
      this.pageSize = val;
    },
    //页面初始化
    getMedical() {
      localStorage.setItem("hometext", "【门诊-病案科室】");
      axios({
        method: "post",
        url:
          axios.PARK_API + "/outpatient/biz/analy/querydepartmentpatient",
        data: {
          //  hospitalId:localStorage.getItem('mainUser')

          // hospitalId: "611021001415"
          hospitalId: localStorage.getItem("othercode")
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.medicalData = res.data.data;
            // console.log(this.medicalData[0].outDate)
            this.total = this.medicalData.length;
            this.medicalHomes = res.data.departlist;
            //计算天数
            for (let i = 0; i <= this.medicalData.length; i++) {
              var dateEnd = new Date(
                this.medicalData[i].outDate.replace(/-/g, "/")
              ); //将-转化为/，使用new Date
              var dateBegin = new Date(
                this.medicalData[i].inDate.replace(/-/g, "/")
              ); //获取当前时间
              var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
              var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
              this.day = dayDiff;
              this.days.push(this.day);
              console.log(this.days);
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    dataChange() {
      axios({
        method: "post",
        url:
          axios.PARK_API + "/outpatient/biz/analy/querydepartmentpatient",
        data: {
          // hospitalId: "611021001415",
          hospitalId: localStorage.getItem("othercode"),
          outDept: this.medicalHome
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.medicalData = res.data.data;
            this.total = this.medicalData.length;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    //查询列表
    search() {
      let data = {};
      if (this.closingDate == 1) {
        data.startbaldate = this.startTime;
        data.endbaldate = this.endTime;
        // data.hospitalId = "611021001415";
        data.hospitalId = localStorage.getItem("othercode");
        data.outDept = this.medicalHome;
      } else if (this.closingDate == 2) {
        data.startindate = this.startTime;
        data.endindate = this.endTime;
        // data.hospitalId = "611021001415";
        data.hospitalId = localStorage.getItem("othercode");
        data.outDept = this.medicalHome;
      } /* else if (this.closingDate == 3) {
        data.endoutdate = this.startTime;
        data.startoutdate = this.endTime;
        data.hospitalId = localStorage.getItem("othercode");
        data.outDept = this.medicalHome;
      } */
      axios({
        method: "post",
        url:
          axios.PARK_API + "/outpatient/biz/analy/querydepartmentpatient",
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.medicalData = res.data.data;
            this.total = this.medicalData.length;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    //清除按钮
    clear() {
      this.startTime = "";
      this.endTime = "";
      this.medicalHome = "";
      this.getMedical();
    },
    handleClick(scope) {
      console.log(scope);
      this.otherData = scope;

      this.medicalVisible = true;
    }
  },
  components: {
    Medical
  },
  created() {
    this.getMedical();
  }
};
</script>


<style scoped>
.right-ctn-title {
  width: calc(100%-20px);
  /* height: 40px; */
  text-align: left;
  padding-left: 20px;
}
.right-ctn-title span {
  font-size: 14px;
  line-height: 40px;
}
.el-select {
  width: 96px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 124px;
}
#fenye {
  background: #c1c1c1;
}
.el-pagination {
  padding: 10px 18px;
  text-align: left;
}
</style>
