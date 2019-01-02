<template>
   <div>
      <div class="right-ctn-title">
            <el-date-picker
                    v-model="startTime"
                    size="mini"
                    type="date"
                    class="hosptDataSel"
                    value-format="yyyy-MM-dd"
                    placeholder="开始日期">
            </el-date-picker>-
            <el-date-picker
                    v-model="endTime"
                    size="mini"
                    type="date"
                    class="hosptDataSel"
                    value-format="yyyy-MM-dd"
                    placeholder="结束日期">
            </el-date-picker>
            <span v-show="slow">
                 <el-select v-model="city" @change="cityChange" size="mini" placeholder="--选择市--">
                    <el-option
                    v-for="item in cityoptions"
                    :key="item.value"
                    :label="item.d20120"
                    :value="item.d20102">
                    </el-option>
                </el-select>
                  <el-select v-model="area" @change="areaChange" size="mini" placeholder="--选择区县--">
                    <el-option
                    v-for="item in areaoptions"
                    :key="item.value"
                    :label="item.d20120"
                    :value="item.d20102">
                    </el-option>
                </el-select>
                  <el-select v-model="town" size="mini" placeholder="--选择乡镇--">
                    <el-option
                    v-for="item in townoptions"
                    :key="item.value"
                    :label="item.d20120"
                    :value="item.d20102">
                    </el-option>
                </el-select> 
                <span>医院等级：</span>      
                <el-select v-model="grade" @change="selectOnchang" size="mini" placeholder="请选择医院等级">
                    <el-option
                    v-for="item in gradeoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>  
                <el-select v-model="hospitalCode" size="mini" placeholder="请选择医院">
                    <el-option
                    v-for="item in hospitalCodes"
                    :key="item.value"
                    :label="item.TEXT"
                    :value="item.VALUE">
                    </el-option>
                </el-select>  
            </span>
              
            <el-button size="mini" @click="getSlow" type="warning" style="margin-left: 5px;">
                <i class="el-icon-search"></i>
                查询
            </el-button>

         
      </div>
      <div class="chart">
        <el-button size="mini" type="warning" @click="backto" style="margin-left: 5px;">
            <i class="el-icon-back"></i>
        </el-button>
        <div id="slowContainter" :style="{width: '100%', height: '470px'}"></div>
      </div>
   </div>

</template>



<script>
import axios from "axios";
import qs from "qs";
let echarts = require("echarts");
export default {
  data() {
    return {
      foulData: [],
      ruleList: [],
      startTime: "",
      endTime: "",
      grade: " ",
      gradeoptions: [
        {
          value: "##",
          label: "全部"
        },
        {
          value: "11",
          label: "一级"
        },
        {
          value: "21",
          label: "二级"
        },
        {
          value: "31",
          label: "三级"
        }
      ],
      hospitalCode: "",
      hospitalCodes: [],
      city: "",
      cityoptions: [],
      area: "",
      areaoptions: [],
      town: "",
      townoptions: [],
      hospitalId: "",
      seriesName: "",
      slowflag: "",
      slow:false,
      yiyuancode:""
    };
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【慢病补偿情况分析（医院）】");
      if (localStorage.getItem("limited") == 1) {
        this.slow = true;
      } else if (localStorage.getItem("limited") == 2) {
        this.slow = false;
      }
    },
    getSlow() {
      this.slowflag = 1;
      var id = this.getAreaCode();
      var _this = this;
      var dom = document.getElementById("slowContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
       var grade;
      if (localStorage.getItem("limited") == 1) {
        this.yiyuancode = this.hospitalCode;
        grade = this.grade;
      } else if (localStorage.getItem("limited") == 2) {
        // this.yiyuancode = "43740005861011111A1001";
        this.yiyuancode = localStorage.getItem("othercode");
        grade = "##";
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/getHospitalData_chronic",
        data: qs.stringify({
          sdate: this.startTime,
          edate: this.endTime,
          /* hospitalGrade: this.grade,
          hospitalCode: this.hospitalCode, */
          hospitalGrade: grade,
          hospitalCode: this.yiyuancode,
          areaCode: id
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          Chart.hideLoading();
          var echarts_data = res.data.data;
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var dataAxis = [];
          var totalCount = [];
          var totalFee = [];
          var personFee = [];
          var drgFee = [];
          var selfFee = [];
          var payableFee = [];
          var payFee = [];
          var hospitalList = [];
          for (var i = 0; i < echarts_data.length; i++) {
            hospitalList[i] = echarts_data[i].医院编码;
            dataAxis[i] = echarts_data[i].医院名称;
            totalCount[i] = echarts_data[i].慢病总人数;
            totalFee[i] = echarts_data[i].总医疗费用;
            personFee[i] = echarts_data[i].人均医疗费用;
            drgFee[i] = echarts_data[i].药品费用;
            selfFee[i] = echarts_data[i].自费费用;
            payableFee[i] = echarts_data[i].可报金额;
            payFee[i] = echarts_data[i].报销金额;

            //data[i]=result[i].pvalue;
          }

          var dataRemake = {};

          dataRemake.dataAxis = dataAxis;
          dataRemake.totalCount = totalCount;
          dataRemake.totalFee = totalFee;
          dataRemake.personFee = personFee;
          dataRemake.drgFee = drgFee;
          dataRemake.selfFee = selfFee;
          dataRemake.payableFee = payableFee;
          dataRemake.payFee = payFee;
          var option = {
            legend: {
              data: [
                "总医疗费用",
                "药品费用",
                "自费费用",
                "可报金额",
                "报销金额",
                "人均医疗费用",
                "慢病总人数"
              ],
              align: "left",
              left: 10
            },
            tooltip: {},
            dataZoom: [
              {
                id: "dataZoomX",
                type: "slider",
                xAxisIndex: [0],
                filterMode: "filter"
              },
              {
                id: "dataZoomY",
                type: "slider",
                yAxisIndex: [0],
                filterMode: "empty"
              }
            ],
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            xAxis: {
              type: "category",
              data: dataRemake.dataAxis
            },
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
              {
                name: "总医疗费用",
                type: "bar",
                stack: "one",
                barMaxWidth: "60",
                data: dataRemake.totalFee
              },
              {
                name: "药品费用",
                type: "bar",
                stack: "one",
                barMaxWidth: "60",
                data: dataRemake.drgFee
              },
              {
                name: "自费费用",
                type: "bar",
                stack: "one",
                barMaxWidth: "60",
                data: dataRemake.selfFee
              },
              {
                name: "可报金额",
                type: "bar",
                stack: "one",
                barMaxWidth: "60",
                data: dataRemake.payableFee
              },
              {
                name: "报销金额",
                type: "bar",
                stack: "one",
                barMaxWidth: "60",
                data: dataRemake.payFee
              },
              {
                name: "慢病总人数",
                type: "bar",
                stack: "two",
                barMaxWidth: "60",
                data: dataRemake.totalCount
              },
              {
                name: "人均医疗费用",
                type: "bar",
                stack: "two",
                barMaxWidth: "60",
                data: dataRemake.personFee
              }
            ]
          };
          Chart.setOption(option);
          Chart.on("click", function(params) {
            _this.hospitalId = hospitalList[params.dataIndex];
            _this.seriesName = params.seriesName;
            _this.areaLoading();
            /*   _this.areaLoading(
              hospitalList[params.dataIndex],
              params.seriesName
            ); */
          });
        } else {
          this.$message.error("请检查网络！");
        }
      });
    },
    areaLoading() {
      this.slowflag = 2;
      var flag;
      if (this.seriesName === "药品费用") {
        flag = "1";
      } else if (this.seriesName === "总医疗费用") {
        flag = "2";
      } else {
        return;
      }
      var _this = this;
      var dom = document.getElementById("slowContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/getHospitalData_cateogry",
        data: qs.stringify({
          sdate: this.startTime,
          edate: this.endTime,
          hospitalCode: this.hospitalId,
          flag: flag
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          console.log(res);
          Chart.hideLoading();
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var cresult = res.data.data;
          var categoryCodeList = [];
          var categoryValue = [];
          var categoryFee = [];
          for (var i = 0; i < cresult.length; i++) {
            categoryCodeList[i] = cresult[i].类别编码;
            categoryValue[i] = cresult[i].类别名称;
            categoryFee[i] = cresult[i].类别费用;
          }
          var option = {
            legend: {
              data: ["类别费用"],
              align: "left",
              left: 10
            },
            tooltip: {},
            dataZoom: [
              {
                id: "dataZoomX",
                type: "slider",
                xAxisIndex: [0],
                filterMode: "filter"
              },
              {
                id: "dataZoomY",
                type: "slider",
                yAxisIndex: [0],
                filterMode: "empty"
              }
            ],
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            xAxis: {
              type: "category",
              data: categoryValue
            },
            yAxis: { type: "value" },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
              {
                name: "类别费用",
                type: "bar",
                barMaxWidth: "60",
                data: categoryFee
              }
            ]
          };
          Chart.setOption(option);
          Chart.on("click", function(params) {
            _this.townLoading(categoryCodeList[params.dataIndex]);
          });
        } else {
          this.$message.error("请检查网络！");
        }
      });
    },
    townLoading(id) {
      this.slowflag = 3;
      var dom = document.getElementById("slowContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/getHospitalData_detail",
        data: qs.stringify({
          sdate: this.startTime,
          edate: this.endTime,
          categoryCode: id,
          hospitalCode: this.hospitalId
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          Chart.hideLoading();
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var iresult = res.data.data;
          var itemCode = [];
          var itemValue = [];
          var itemFee = [];
          for (var i = 0; i < iresult.length; i++) {
            itemCode[i] = iresult[i].项目编码;
            itemValue[i] = iresult[i].项目名称;
            itemFee[i] = iresult[i].项目费用;
          }
          var option = {
            legend: {
              data: ["项目费用"],
              align: "left",
              left: 10
            },
            tooltip: {},
            dataZoom: [
              {
                id: "dataZoomX",
                type: "slider",
                xAxisIndex: [0],
                filterMode: "filter"
              },
              {
                id: "dataZoomY",
                type: "slider",
                yAxisIndex: [0],
                filterMode: "empty"
              }
            ],
            xAxis: {
              type: "category",
              data: itemValue
            },
            yAxis: { type: "value" },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
              {
                name: "项目费用",
                type: "bar",
                barMaxWidth: "60",
                data: itemFee
              }
            ]
          };
          Chart.setOption(option);
        } else {
          this.$message.error("请检查网络！");
        }
      });
    },
    backto() {
      if (this.slowflag == "") {
        this.$message.warning("亲！已经是首层了");
      } else if (this.slowflag == 1) {
        this.$message.warning("已经是第一级了");
      } else if (this.slowflag == 2) {
        this.getSlow();
        console.log(this.slowflag);
      } else if (this.slowflag == 3) {
        this.areaLoading();
      }
    },
    //三级联动
    getCityChange() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryregion",
        // url: axios.CASE_API + "/hospitalization/biz/analy/queryregion",
        params: {
          admincode: 61,
          level: 1
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.cityoptions = res.data.data;
            this.getAreaCode();
          } else {
            this.$message.error("请检查网络");
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    cityChange(value) {
      console.log(value);
      this.area = "";
      this.town = "";
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryregion",
        // url: axios.CASE_API + "/hospitalization/biz/analy/queryregion",
        params: {
          admincode: value,
          level: 2
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.areaoptions = res.data.data;
          this.getAreaCode();
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    areaChange(value) {
      this.town = "";
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryregion",
        // url: axios.CASE_API + "/hospitalization/biz/analy/queryregion",
        params: {
          admincode: value,
          level: 3
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.townoptions = res.data.data;
          this.getAreaCode();
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    getAreaCode() {
      var areaCode;
      if (this.town != null && this.town != "") {
        areaCode = this.town;
      } else if (this.area != null && this.area != "") {
        areaCode = this.area;
      } else if (this.city != null && this.city != "") {
        areaCode = this.city;
      } else {
        areaCode = "";
      }
      return areaCode;
    },
    selectOnchang() {
      var id = this.getAreaCode();
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/tiaojian/getHospitals",
        data: qs.stringify({
          hospitalGrade: this.grade,
          areaCode: id
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          var data = res.data.data;
          this.hospitalCodes = data;
        } else {
          this.$message.error("请检查网络");
        }
      });
    }
  },
  created() {
    this.getname();
    this.getCityChange();
  }
};
</script>



<style scoped>
.right-ctn-title {
  width: calc(100%-20px);
  /* height: 40px; */
  text-align: left;
  padding-left: 20px;
  position: relative;
}

.right-ctn-title span {
  font-size: 14px;
  line-height: 40px;
}

.el-button + .el-button {
  margin-left: 0;
}
.el-select {
  width: 130px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 124px;
}
.chart {
  width: 90%;
  height: 500px;
  /* background-color: #f00; */
  text-align: left;
  margin-top: 20px;
  margin-left: 20px;
  border-left: 1px solid #000;
  border-bottom: 1px solid #000;
}
</style>

