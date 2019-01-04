<template>
    <div>
        <div class="right-ctn-title">
             <span>医院名称：</span>
                <el-autocomplete
                  v-model="hospitalText"
                  :fetch-suggestions="queryHosSearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
            ></el-autocomplete>
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
                    prop="hospitalName"
                    label="医院名称">
                    </el-table-column>
             
                    <el-table-column
                    prop="num"
                    label="住院人次">
                    </el-table-column>
                  
                    <el-table-column
                    prop="totalFee"
                    label="总费用">
                    </el-table-column>
                    <el-table-column
                    prop="effectFee"
                    label="补偿金额">
                    </el-table-column>
                     <el-table-column
                      fixed="right"
                      label="操作">
                      <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small" class="cutmoney">扣款通知单</el-button>
                        <el-button @click="detailClick(scope.row)" type="text" size="small">详细信息</el-button>
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
                    <Payment :medicalText="otherData" :dayTime="dayTime"></Payment>
                </el-dialog>

                 <el-dialog title="" v-if='detailVisible' :visible.sync="detailVisible" width="80%"
                           top="20px">
                    <detail :medicalText="detailData"></detail>
                </el-dialog>
        </div>
    </div>
    
</template>


<script>
import axios from "axios";
import Payment from "../../component/Payment";
import detail from "../../component/detail";
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
        }
      ],
      closingDate: "1",
      startTime: "",
      endTime: "",
      medicalData: [],
      otherData: [],
      //详细信息
      detailData:[],
      total: 0,
      currentPage: 1,
      pageSize: 12,
      medicalVisible: false,
      detailVisible:false,
      hospitalText: "",
      dayTime: "",
      hospitalId: ""
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
      localStorage.setItem("hometext", "【住院-扣款通知单】");
      axios({
        method: "post",
        url:
          axios.PARK_API +
          "/hospitalization/biz/rstdatorderchargeback/queryChargeback",
        data: {
          // hospitalName: null,
          regionId: localStorage.getItem("regionId"),
          hospitalId: null,
          startbaldate: this.startTime,
          endbaldate: this.endTime
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.medicalData = res.data.data.BizDatOrderEntity;
            console.log(this.medicalData);
            this.total = this.medicalData.length;
            console.log(this.total);
            this.medicalHomes = res.data.departlist;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },

    //医院编码与医疗机构的选择
    queryHosSearch(queryString, callback) {
      var list = [{}];

      //从后台获取到对象数组
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/d101/list",
        params: {
          // code : this.leixingText,
          param: queryString.toUpperCase()
        }
        /*   headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      })
        .then(res => {
          if (res.data.code == 0 && res.data.list != "") {
            for (let i of res.data.list) {
              if (this.queryend == "1") {
                i.value = i.d10101;
              } else {
                i.value = i.d10102; //将想要展示的数据作为value
              }

              // console.log(i.value)
            }
            list = res.data.list;
            callback(list);
            // this.hospitalText = res.data.list;
            // console.log(res.data.list);
          } else {
            // this.$message.error(res.data.msg);
            this.$message("无此医院");
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    handleSelect(item) {
      console.log(item);
      this.hospitalId = item.d10101;
    },
    //查询列表
    search() {
      let date = new Date(this.startTime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let stime = y + "-" + m;
      this.dayTime = stime;
      console.log(this.dayTime);
      axios({
        method: "post",
        url:
          axios.PARK_API +
          "/hospitalization/biz/rstdatorderchargeback/queryChargeback",
        data: {
          startbaldate: this.startTime,
          endbaldate: this.endTime,
          // hospitalName:this.hospitalText
          regionId: localStorage.getItem("regionId"),
          hospitalId: this.hospitalId
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.medicalData = res.data.data.BizDatOrderEntity;
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
      this.hospitalText = "";
      this.getMedical();
    },
    //扣款通知单弹出框
    handleClick(scope) {
      console.log(scope);
      this.otherData = scope;
      this.medicalVisible = true;
    },
    //详细信息弹出框
    detailClick(scope) {
      console.log(scope);
      this.detailData = scope;
      this.detailVisible = true;
   
    },
    // 设置开始日期的默认时间
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let x = date.getMonth() + 1;

      // let d = localStorage.getItem("userTime");
      let d = localStorage.getItem("userTime")
        ? localStorage.getItem("userTime")
        : 21;
      let b = date.getDate();
      let e = date.getHours();
      let f = date.getMinutes();
      let g = date.getSeconds();
      console.log(d);
        if (x == 1) {
            let time = y + "-" + 12 + "-" + d + " " + e + ":" + f + ":" + g;
            let stime = y + "-" + 12;
            let endtime = y + "-" + x + "-" + b + " " + e + ":" + f + ":" + g;
            this.startTime = time;
            this.dayTime = stime;
            this.endTime = endtime;
        }
        else {
            let time = y + "-" + m + "-" + d + " " + e + ":" + f + ":" + g;
            let stime = y + "-" + m;
            let endtime = y + "-" + x + "-" + b + " " + e + ":" + f + ":" + g;
            this.startTime = time;
            this.dayTime = stime;
            this.endTime = endtime;
        }
    
    }
  },
  components: {
    Payment,
    detail
  },
  created() {
    this.getTime();
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
.cutmoney {
  color: #f00;
}
</style>
