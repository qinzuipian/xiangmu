<template>
    <div>
        <div class="right-ctn-title">
             <span>医院名称：</span>
                <el-autocomplete
                  v-model="hospitalText"
                  :fetch-suggestions="queryHosSearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
                  v-show="heliaoName"
            ></el-autocomplete>
            <el-input style="width: 160px; height: 30px;" v-model="hospitalName" v-show="yiyuanName" size="mini" placeholder="请输入内容"></el-input>
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
                    height="550"
                    style="width: 100%">
                    <el-table-column
                    prop="itemName"
                    label="合疗办项目">
                    </el-table-column>
                    <el-table-column
                    prop="thirdName"
                    label="医院项目">
                    </el-table-column>    
                     <el-table-column
                    prop="itemClass"
                    label="种类">
                    </el-table-column>
                    <el-table-column
                    prop="quantity"
                    label="数量">
                    </el-table-column>
                    <el-table-column
                    prop="amount"
                    sortable
                    label="金额">
                    </el-table-column>              
                    <el-table-column
                    prop="hospitalName"
                    label="医院名称"
                    width="160px">
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
                 
        </div>
    </div>
    
</template>


<script>
import axios from "axios";
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
          label: "入院日期"
        },
        {
          value: "3",
          label: "出院日期"
        }
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
      hospitalText: "",
      hospitalId: "",
      hospitalName:"",
      heliaoName:false,
      yiyuanName:false
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
      localStorage.setItem("hometext", "【诊疗项目对码分析】");
      let data = {};
      if (localStorage.getItem("limited") == 1) {
        data.regionId = localStorage.getItem("regionId");
        this.heliaoName = true;
      } else if (localStorage.getItem("limited") == 2) {
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = localStorage.getItem("othercode");
        this.yiyuanName = true;
        this.hospitalName = localStorage.getItem('hosName');
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryDrugAnaly",
        /* data: {
          regionId: localStorage.getItem("regionId")
        }, */
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.medicalData = res.data.data;
            console.log(this.medicalData);
            this.total = this.medicalData.length;
            console.log(this.total);
            // this.medicalHomes = res.data.departlist;
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
              i.value = i.d10102; //将想要展示的数据作为value
              // this.hospitalId = i.d10101;
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
      // console.log(item);
      this.hospitalId = item.d10101;
      console.log(this.hospitalId);
    },
    //查询列表
    search() {
      var data = {};
      if (this.closingDate == 1) {
        data.startbaldate = this.startTime;
        data.endbaldate = this.endTime;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
        // data.hospitalId = 'PDY00009561073011C2101';
      } else if (this.closingDate == 2) {
        data.startindate = this.startTime;
        data.endindate = this.endTime;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      } else if (this.closingDate == 3) {
        data.endoutdate = this.startTime;
        data.startoutdate = this.endTime;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryDrugAnaly",
        /* data: {
          regionId: localStorage.getItem("regionId"),
          startbaldate: this.startTime,
          endbaldate: this.endTime,
          hospitalId: this.hospitalText
        }, */
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
      this.hospitalText = "";
      this.getMedical();
    }
  },
  filters: {
    rounding(value) {
      if (!isNaN(value)) {
        return value.toFixed(2);
      } else {
        return 0;
      }
    }
  },
  components: {},
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
