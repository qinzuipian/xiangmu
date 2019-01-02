<template>
   <div>
      <div class="right-ctn-title">
          <span>地区：</span>
          <el-select v-model="area" size="mini"  placeholder="请选择地区">
                <el-option
                v-for="item in areaoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
          </el-select>
          <span>机构等级：</span>
          <el-select v-model="grade" size="mini" placeholder="请选择机构等级">
                  <el-option
                  v-for="item in gradeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
          </el-select>
          <span>医疗机构：</span>  
          <el-select v-model="hospitalCode" size="mini" placeholder="请选择医院">
              <el-option
              v-for="item in hospitalCodes"
              :key="item.value"
              :label="item.TEXT"
              :value="item.VALUE">
              </el-option>
          </el-select>  
          <span>报表类型：</span>
          <el-select v-model="illegal" size="mini" @change="Chartselect" placeholder="请选择图表项目">
              <el-option
              v-for="item in illegaloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>  
          <br>
          <span>时间类型：</span>
           <el-select v-model="yearType" size="mini" @change="yearselect" placeholder="请选择日期方式">
                <el-option
                v-for="item in yearTypeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <span v-show="yearShow">
                <el-date-picker
                    v-model="startTime"
                    size="mini"
                    type="year"
                    class="hosptDataSel"
                    value-format="yyyy"
                    placeholder="开始日期">
                </el-date-picker>-
                <el-date-picker
                        v-model="endTime"
                        size="mini"
                        type="year"
                        class="hosptDataSel"
                        value-format="yyyy"
                        placeholder="结束日期">
                </el-date-picker>
            </span>
            <span v-show="monthShow">
                <el-date-picker
                    v-model="MsTime"
                    size="mini"
                    type="month"
                    class="hosptDataSel"
                    value-format="yyyy-MM"
                    placeholder="开始日期">
                </el-date-picker>-
                <el-date-picker
                        v-model="MeTime"
                        size="mini"
                        type="month"
                        class="hosptDataSel"
                        value-format="yyyy-MM"
                        placeholder="结束日期">
                </el-date-picker>
            </span>
          <el-button size="mini" type="success" style="margin-left: 5px;" @click="getHospital">
                  查询
          </el-button>

         
      </div>
      <div class="chart">
        <div id="hosContainter" :style="{width: '100%', height: '470px'}"></div>
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
      yearType: "1",
      yearTypeoptions: [
        {
          value: "1",
          label: "按年度选择"
        },
        {
          value: "2",
          label: "按月度选择"
        }
      ],
      yearShow: false,
      monthShow: false,
      MsTime: "",
      MeTime: "",
      startTime: "",
      endTime: "",
      area: "",
      areaoptions: [],


      illegal: "",
      illegaloptions: [
        {
          value: "datazyzongtianshu",
          label: "住院总天数"
        },
        {
          value: "datarjzytianshu",
          label: "人均住院天数"
        },
        {
          value: "datashoushurenci",
          label: "手术人次"
        },
        {
          value: "datazyzrenshu",
          label: "住院总人数"
        },
        {
          value: "datazylfeiyong",
          label: "总医疗费用"
        },
        {
          value: "datarjfeiyong",
          label: "人均医疗费用"
        },
        {
          value: "dataypfeiyong",
          label: "药品费用"
        },
        {
          value: "datazffeiyong",
          label: "自费费用"
        },
        {
          value: "datakbjine",
          label: "可报金额"
        },
        {
          value: "databxjine",
          label: "报销金额"
        }
      ],
      grade: "",
      gradeoptions: [
        {
          value: "##",
          label: "全部"
        },
        {
          value: "5",
          label: "省级"
        },
        {
          value: "4",
          label: "市级"
        },
        {
          value: "3",
          label: "县级"
        },
        {
          value: "2",
          label: "乡级"
        },
        {
          value: "1",
          label: "村级"
        },
        {
          value: "9",
          label: "其它"
        }
      ],
      hospitalCode: "",
      hospitalCodes: [],
    
    };
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【指标分析】");
      if (localStorage.getItem("limited") == 1) {
        this.hospital = true;
      } else if (localStorage.getItem("limited") == 2) {
        this.hospital = false;
      }
    },
    yearselect() {
      if (this.yearType == "1") {
        this.yearShow = true;
        this.monthShow = false;
        this.MsTime = "";
        this.MeTime = "";
      } else if (this.yearType == "2") {
        this.yearShow = false;
        this.monthShow = true;
        this.startTime = "";
        this.endTime = "";
      }
    },
    getHospital() {
      this.flag = 1;
      var _this = this;
      var dom = document.getElementById("hosContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
  
      axios({
        method: "post",
        // url: axios.PARK_API + "/backstage/loadPicData_zhuyuan",
        url: axios.PARK_API + "/xnhidc/backstage/loadPicData_zhuyuan",
        data: qs.stringify({
          sdate: this.startTime,
          edate: this.endTime,
          yiyuandengji: this.grade,
          // yiyuanCode: this.hospitalCode
          yiyuanCode: this.yiyuancode
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        if (res.data.success) {
          Chart.hideLoading();
        
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    Chartselect(value) {
      console.log(value);
      let obj = {};
      obj = this.illegaloptions.find(item => {
        return item.value === value;
      });
      this.typeName = obj.label;
      console.log(obj.label);
      if ("undefined" != typeof this.alldataRemake) {
        //判断非空
        //获取 tu 选中的值时 触发操作
        //alert("xingzhengjibie="+ $("select[name='yiyuandengji']").val())//
        var dom = document.getElementById("hosContainter");
        var Chart = echarts.init(dom);
        Chart.showLoading({
          text: "加载加载加载....."
        });
        Chart.setOption({
          title: {
            text: this.typeName,
            x: "center"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },

          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              //data : ['1','2','3','4','5','6','7']
              data: this.alldataRemake["dataAxis"],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: this.typeName,
              type: "bar",
              stack: "住院天数",
              //data:[320, 332, 301, 334, 390, 330, 320]
              //data:[datas[0].住院总天数]
              //data: eval($("select[name='tu']").val())
              data: this.alldataRemake[value]
            }
          ]
        }); //end myChart.setOption
        Chart.hideLoading();
        //console.log(dataRemake[$("select[name='tu']").val()]);
      }
    },
    //to do
    gradeSelect() {
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/tiaojian/getYiYuanlist",
        data: qs.stringify({
          xingzhengjibie: this.grade
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        if (res.data.success) {
          this.hospitalCodes = res.data.data;
        } else {
          this.$message.error("请检查网络！");
        }
      });
    }
  },
  /*  mounted() {
    this.getHospital();
  }, */
  created() {
    this.getname();
    this.yearselect();
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
.el-select {
  /* width: 100px; */
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  /* width: 124px; */
}
</style>

