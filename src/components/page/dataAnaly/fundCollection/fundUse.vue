<template>
    <div>
        <div class="right-ctn-title">
            <span>参合年度:</span>
            <el-date-picker
            v-model="yearVal"
            type="year"
            value-format="yyyy"
            placeholder="选择年">
            </el-date-picker>
            <el-button size="mini" type="warning" style="margin-left: 20px;" @click="getUse">
                <i class="el-icon-search"></i>
            </el-button>
        </div>
        <div class="chart">
            <el-button size="mini" type="warning" @click="backto" style="margin-left: 5px;">
                <i class="el-icon-back"></i>
            </el-button>
            <div id="useContainter" :style="{width: '100%', height: '470px'}"></div>
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
      yearVal: "",
      dataShadow: [],
      yMax: 500,
      flag: "",
      areaCodeId:"",
      dataAxis:""
    };
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【基金使用情况分析】");
    },
    getUse() {
      if (this.yearVal != "") {
        var dom = document.getElementById("useContainter");
        var Chart = echarts.init(dom);
        Chart.showLoading({
          text: "加载加载加载....."
        });
        axios({
          method: "post",
          url: axios.PARK_API + "/xnhidc/backstage/loadPicData_jijinsy",
          data: qs.stringify({
            nd: this.yearVal
            // nd: 2018
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).then(res => {
          console.log(res);
          if (res.data.success) {
            this.useStatic(res.data.data);
          } else {
            this.$message.error(res.data.error);
          }
        });
      } else {
        this.$message.warning("参合年度不能为空！");
      }
    },
    useStatic(datas) {
      this.flag = 1;
      let _this = this;
      var dom = document.getElementById("useContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      echarts.dispose(Chart);
      Chart = echarts.init(dom);
      var dataAxis = [];
      var j = 0;
      var data = [];
      var datashang = [];
      var areaCode = [];
      for (var int = 0; int < datas.length; int++) {
        if (datas[int].nd == this.yearVal) {
          // if (datas[int].nd == 2018) {
          dataAxis[int] = datas[int].dq;
          data[int] = datas[int].jjsy;
          areaCode[int] = datas[int].dqbm;
          continue;
        } else {
          datashang[j] = datas[int].jjsy;
          j++;
        }
      }
      for (var i = 0; i < data.length; i++) {
        this.dataShadow.push(this.yMax);
      }
      var option = {
        //color: ['red'],
        title: {
          text: "各区县基金使用情况",
          //x:'center',
          // y:'top',
          textAlign: "left"
        },
        legend: {
          data: ["上年度", "本年度"]
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
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
        toolbox: {
          show: true,
          orient: "horizontal",
          left: "right",
          top: "top",
          feature: {
            mark: { show: true },
            saveAsImage: { show: true },
            //dataView: {show: true, readOnly: false},
            //magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true }
          }
        },

        xAxis: [
          {
            type: "category",
            data: dataAxis,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              margin: 5,
              rotate: 45,
              textStyle: {
                color: "#222"
              }
            }
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
            xAxisIndex: 0,
            start: 0,
            end: 100,
            type: "slider",
            bottom: "1%"
          }
        ],
        series: [
          {
            name: "上年度",
            type: "bar",
            data: datashang,
            barMaxWidth: "50"
          },
          {
            name: "本年度",
            type: "bar",
            data: data,
            barMaxWidth: "50"
          }
        ]
      };
      Chart.setOption(option);
      Chart.hideLoading();
      Chart.on("click", function(params) {
        _this.areaCodeId =  areaCode[params.dataIndex];
        _this.dataAxis =  dataAxis[params.dataIndex];
       /*  _this.useStaticPic(
          areaCode[params.dataIndex],
          dataAxis[params.dataIndex]
        ); */
        _this.useStaticPic();
      });
    },
    useStaticPic(id, area) {
      this.flag = 2;
      var dom = document.getElementById("useContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      var _this = this;

      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadPicData_jijinsy",
        data: qs.stringify({
          // nd: 2018,
          nd: this.yearVal,
          areacode: this.areaCodeId
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          var ss = res.data.data;
          Chart.hideLoading();
          var dataAxis1 = [];
          var j = 0;
          var data1 = [];
          var data2 = [];
          var areaCode = [];
          for (var int = 0; int < ss.length; int++) {
            if (ss[int].nd == this.yearVal) {
              // if (ss[int].nd == 2018) {
              dataAxis1[int] = ss[int].dq;
              data1[int] = ss[int].jjsy;
              areaCode[int] = ss[int].dqbm;
              continue;
            } else {
              data2[j] = ss[int].jjsy;
              j++;
            }
          }
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var option = {
            title: {
              text: this.dataAxis + "基金使用情况",
              /*x:'center',
				        y:'top',*/
              textAlign: "left"
            },
            legend: {
              data: ["上年度", "本年度"]
            },
            toolbox: {
              show: true,
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            calculable: true,
            //color: ['#83bff6'],
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
            toolbox: {
              show: true,
              orient: "horizontal",
              left: "right",
              top: "top",
              feature: {
                mark: { show: true },
                saveAsImage: { show: true },
                //dataView: {show: true, readOnly: false},
                //magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true }
              }
            },

            xAxis: [
              {
                type: "category",
                data: dataAxis1,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
                  margin: 5,
                  rotate: 45,
                  textStyle: {
                    color: "#222"
                  }
                }
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
                xAxisIndex: 0,
                start: 0,
                end: 100,
                type: "slider",
                bottom: "1%"
              }
            ],
            series: [
              {
                name: "上年度",
                type: "bar",
                data: data2,
                barMaxWidth: "50"
              },
              {
                name: "本年度",
                type: "bar",
                data: data1,
                barMaxWidth: "50"
              }
            ]
          };
          Chart.setOption(option, true);
          Chart.on("click", function(params) {
            _this.getbasedata(
              areaCode[params.dataIndex],
              dataAxis1[params.dataIndex]
            );
          });
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    getbasedata(id, area) {
      this.flag = 3;
      console.log(id);
      var _this = this;
      var dom = document.getElementById("useContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });

      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadPicData_jijinsy",
        data: qs.stringify({
          // nd: 2018,
          nd: this.yearVal,
          areacode: id
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          var dd = res.data.data;
          Chart.hideLoading();
          var dataAxis2 = [];
          var data2 = [];
          var data3 = [];
          var j = 0;
          for (var int = 0; int < dd.length; int++) {
            if (dd[int].nd == this.yearVal) {
              // if (dd[int].nd == 2018) {
              dataAxis2[int] = dd[int].dq;
              data2[int] = dd[int].jjsy;
              continue;
            } else {
              data3[j] = dd[int].jjsy;
              j++;
            }
          }
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var option = {
            title: {
              text: area + "基金使用情况",
              /*				        x:'center',
				        y:'top',*/
              textAlign: "left"
            },
            legend: {
              data: ["上年度", "本年度"]
            },
            toolbox: {
              show: true,
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            calculable: true,
            //color: ['#83bff6'],
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
                data: dataAxis2,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
                  margin: 5,
                  rotate: 45,
                  textStyle: {
                    color: "#222"
                  }
                }
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
                xAxisIndex: 0,
                start: 0,
                end: 100,
                type: "slider",
                bottom: "1%"
              }
            ],
            series: [
              {
                name: "上年度",
                type: "bar",
                barWidth: "20%",
                data: data3,
                //  barGap:'20%',
                barMaxWidth: "10"
              },
              {
                name: "本年度",
                type: "bar",
                barWidth: "20%",
                data: data2,
                //barGap:'20%',
                barMaxWidth: "10"
              }
            ]
          };
          Chart.setOption(option, true);
          Chart.on("click", function(params) {
            _this.getUse();
          });
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    backto() {
      if (this.flag == "") {
        this.$message.warning("亲！已经是首层了");
      } else if (this.flag == 1) {
        this.$message.warning("已经是第一级了");
      } else if (this.flag == 2) {
        this.getUse();
        console.log(this.flag);
      } else if (this.flag == 3) {
        this.useStaticPic();
      }
    }
    /*  searchUse() {
      var dom = document.getElementById("useContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/backstage/loadPicData_jijinsy",
        data: qs.stringify({
          nd: this.yearVal
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        if (res.data.success) {
          this.useStatic(res.data.data);
        } else {
          this.$message.error(res.data.error);
        }
      });
    } */
  },
  created() {
    this.getname();
    /*  this.$nextTick(function() {
      this.getUse();
    }); */
  }
};
</script>



<style scoped>
.right-ctn-title {
  width: calc(100%-20px);
  /* height: 40px; */
  text-align: left;
  padding-left: 20px;
  margin-top: 6px;
}
.right-ctn-title span {
  font-size: 14px;
}
.right-ctn-title .el-select {
  margin-bottom: 6px;
}
#fenye {
  background: #c1c1c1;
}

.el-pagination {
  padding: 10px 18px;
  text-align: left;
}
.el-select {
  width: 120px;
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
/* .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 120px;
} */
</style>

