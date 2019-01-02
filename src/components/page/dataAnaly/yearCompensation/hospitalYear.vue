<template>
   <div>
      <div class="right-ctn-title">
          <span>日期方式选择：</span>
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
            <!-- <span>违规等级：</span> -->
               <el-select v-model="illegal" size="mini" @change="Chartselect" placeholder="请选择图表项目">
                <el-option
                v-for="item in illegaloptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
           <span v-show="hospital">
                <span>医院等级：</span>
                <el-select v-model="grade" size="mini" @change="selectOnchang" placeholder="请选择医院等级">
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
                    :label="item.YYMC"
                    :value="item.YYBM">
                    </el-option>
                </el-select>  
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
           </span>
            <el-button size="mini" type="warning" @click="getHostatic" style="margin-left: 5px;">
                <i class="el-icon-search"></i>
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
      foulData: [],
      ruleList: [],
      startTime: "",
      endTime: "",
      MsTime: "",
      MeTime: "",
      illegal: "",
      illegaloptions: [
        {
          value: "datazyzongtianshu",
          label: "住院总天数"
        },

        {
          value: "datashoushurenci",
          label: "手术人次"
        },
        {
          value: "datazyzrenci",
          label: "住院总人次"
        },
        {
          value: "datazyzrenshu",
          label: "住院总人数"
        },
        {
          value: "datazyrjtianshu",
          label: "住院人均天数"
        },
        {
          value: "datazylfeiyong",
          label: "住院总医疗费用"
        },
        {
          value: "datazrjfeiyong",
          label: "住院总人均费用"
        },
        {
          value: "dataypfeiyong",
          label: "住院药品费用"
        },
        {
          value: "datazlfeiyong",
          label: "住院诊疗费用"
        },
        {
          value: "datazffeiyong",
          label: "住院自费费用"
        },
        {
          value: "datakbjine",
          label: "住院可报金额"
        },
        {
          value: "databxjine",
          label: "住院报销金额"
        },
        {
          value: "dataqfx",
          label: "住院起付线"
        } /* ,
        {
          value: "datafdrs",
          label: "住院到达封顶人数"
        } */
      ],
      grade: " ",
      gradeoptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "11",
          label: "一级医院"
        },
        {
          value: "21",
          label: "二级医院"
        },
        {
          value: "31",
          label: "三级医院"
        }
      ],
      hospitalCode: "",
      hospitalCodes: [],
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
      //三级联动
      city: "",
      cityoptions: [],
      area: "",
      areaoptions: [],
      town: "",
      townoptions: [],
      typeName: "",
      alldataRemake: "",
      hospitalId: "",
      hospital: false,
      yiyuancode:""
    };
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【住院补偿情况分析（年度）】");
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
    getHostatic() {
      var id = this.getAreaCode();
      // console.log(id)
      var _this = this;
      var dom = document.getElementById("hosContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      var type;
      var startTime;
      var endTime;
      if (this.yearType == "1") {
        type = "yyyy";
        startTime = this.startTime;
        endTime = this.endTime;
      } else {
        type = "yyyy-MM";
        startTime = this.MsTime;
        endTime = this.MeTime;
      }
      var grade;
      if (localStorage.getItem("limited") == 1) {
        this.yiyuancode = this.hospitalCode;
        grade = this.grade;
      } else if (localStorage.getItem("limited") == 2) {
        // this.yiyuancode = "43740005861011111A1001";
        this.yiyuancode = localStorage.getItem("othercode");
        grade = "";
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/compensate/hospitalization/queryTime",
        params: {
          startDate: startTime,
          endDate: endTime,
          type: type,
         /*  hospitalGrade: this.grade,
          yiyuanCode: this.hospitalCode, */
          hospitalGrade: grade,
          yiyuanCode: this.yiyuancode,
          areaCode: id
        }
        /*  data: qs.stringify({
          startDate: this.startTime,
          endDate: this.endTime,
          type: 'yyyy'
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        } */
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var echarts_date = res.data.data;
          var dataAxis = [];
          var datazyzongtianshu = [];
          var datashoushurenci = [];
          var datazyzrenci = [];
          var datazyzrenshu = [];
          var datazyrjtianshu = [];
          var datazylfeiyong = [];
          var datazrjfeiyong = [];
          var dataypfeiyong = [];
          var datazlfeiyong = [];
          var datazffeiyong = [];
          var datakbjine = [];
          var databxjine = [];
          var dataqfx = [];
          var datafdrs = [];
          var areaCode = [];
          for (var i = 0; i < echarts_date.length; i++) {
            dataAxis[i] = echarts_date[i].结算时间;
            // areaCode[i] = echarts_date[i].YYBM;
            datazyzongtianshu[i] = echarts_date[i].住院总天数;
            datashoushurenci[i] = echarts_date[i].手术人次;
            datazyzrenci[i] = echarts_date[i].住院总人次;
            datazyzrenshu[i] = echarts_date[i].住院总人数;
            datazyrjtianshu[i] = echarts_date[i].人均住院天数;
            datazylfeiyong[i] = echarts_date[i].住院总医疗费用;
            datazrjfeiyong[i] = echarts_date[i].住院总人均费用;
            dataypfeiyong[i] = echarts_date[i].住院药品费用;
            datazlfeiyong[i] = echarts_date[i].住院诊疗费用;
            datazffeiyong[i] = echarts_date[i].住院自费费用;
            datakbjine[i] = echarts_date[i].住院可报金额;
            databxjine[i] = echarts_date[i].住院报销金额;
            dataqfx[i] = echarts_date[i].住院起付线;
            datafdrs[i] = echarts_date[i].住院到达封顶人数;
          }

          var dataRemake = {};

          for (var name in echarts_date[0]) {
            //遍历对象属性名
            //遍历对象属性名
            dataRemake.dataAxis = dataAxis;
            dataRemake.datazyzongtianshu = datazyzongtianshu;
            dataRemake.datashoushurenci = datashoushurenci;
            dataRemake.datazyzrenci = datazyzrenci;
            dataRemake.datazyzrenshu = datazyzrenshu;
            dataRemake.datazyrjtianshu = datazyrjtianshu;
            dataRemake.datazylfeiyong = datazylfeiyong;
            dataRemake.datazrjfeiyong = datazrjfeiyong;
            dataRemake.dataypfeiyong = dataypfeiyong;
            dataRemake.datazlfeiyong = datazlfeiyong;
            dataRemake.datazffeiyong = datazffeiyong;
            dataRemake.datakbjine = datakbjine;
            dataRemake.databxjine = databxjine;
            dataRemake.dataqfx = dataqfx;
            dataRemake.datafdrs = datafdrs;
          }
          this.alldataRemake = dataRemake;
          console.log(this.alldataRemake);

          var option = {
            title: {
              text: this.typeName,
              x: "center"
            },
            color: ["#2099aa"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
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
                data: dataAxis,
                axisTick: {
                  alignWithLabel: true
                } /* ,
				           axisLabel:{
				        	    interval:0,
				        	    margin:10,
				        	    rotate:45
				           } */
              }
            ],
            yAxis: [
              {
                type: "value"
              }
            ],
            dataZoom: [
              {
                show: true,
                yAxisIndex: 0,
                filterMode: "empty",
                width: 30,
                height: "80%",
                showDataShadow: false,
                left: "97%"
              }
            ],
            series: [
              {
                name: this.typeName,
                type: "bar",
                stack: "住院天数",
                barMaxWidth: "60",
                data: eval(this.illegal)
                // data: data
              }
            ]
          };
          Chart.setOption(option);
          /*   Chart.on("click", function(params) {
            console.log(111);
            _this.areaLoading(areaCode[params.dataIndex], params.name);
          }); */
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    selectOnchang() {
      console.log(this.getAreaCode());
      var id = this.getAreaCode();
      console.log(id);
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadddyy_zhuyuan_yiyuan",
        data: qs.stringify({
          yiyuandengji: this.grade,
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
    },
    //三级联动
    getCityChange() {
      axios({
        method: "post",
        // url: axios.CASE_API + "/hospitalization/biz/analy/queryregion",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryregion",
        params: {
          admincode: 61,
          level: 1
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.cityoptions = res.data.data;
            // this.selectOnchang();
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
      // console.log(value);
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
          // this.selectOnchang();
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
          // this.selectOnchang();
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
      console.log(areaCode);
      return areaCode;
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
              barMaxWidth: "60",
              //data:[320, 332, 301, 334, 390, 330, 320]
              //data:[datas[0].住院总天数]
              //data: eval($("select[name='tu']").val())
              data: this.alldataRemake[this.illegal]
            }
          ]
        });
        Chart.hideLoading();
      }
    }
  },
  created() {
    this.getname();
    this.yearselect();
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

