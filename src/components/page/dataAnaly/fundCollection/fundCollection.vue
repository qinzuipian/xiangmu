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
            <el-button size="mini" type="warning" style="margin-left: 20px;" @click="getFund">
                <i class="el-icon-search"></i>
            </el-button>
        </div>
        <div class="chart">
            <div id="fundcontainter" :style="{width: '100%', height: '470px'}"></div>
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
      firstChart: "",
      myChart: ""
    };
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【基金筹资情况分析】");
    },
    getFund() {
      if (this.yearVal != "") {
        var dom = document.getElementById("fundcontainter");
        var Chart = echarts.init(dom);
        Chart.showLoading({
          text: "加载加载加载....."
        });
        axios({
          method: "post",
          url: axios.PARK_API + "/backstage/loadPicData_jijincz",
          data: qs.stringify({
            nd: this.yearVal
            // nd: 2014
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).then(res => {
          if (res.data.success) {
            console.log(res.data.data);
            this.loadStaticPic(res.data.data);
          } else {
            this.$message.error(res.data.error);
          }
        });
      } else {
        this.$message.warning("参合年度不能为空！");
      }
    },

    loadStaticPic(datas) {
      let _this = this;
      console.log(datas);
      var dom = document.getElementById("fundcontainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      var dataAxis = [];
      var data = [];
      var areaCode = [];

      for (var int = 0; int < datas.length; int++) {
        dataAxis[int] = datas[int].dq;
        data[int] = datas[int].jjcz;
        areaCode[int] = datas[int].dqbm;
      }

      //加载图片
      /*  if (!Chart) {
        var dom = document.getElementById("container");
        Chart = echarts.init(dom);
      } else {
        echarts.dispose(Chart);
        Chart = echarts.init(dom);
      } */

      for (var i = 0; i < datas.length; i++) {
        this.dataShadow.push(this.yMax);
      }

      var option = {
        //color: ['red'],
        title: {
          text: "各区县基金筹资情况",
          x: "center",
          y: "top",
          textAlign: "center"
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
            name: "基金筹资金额",
            type: "bar",
            barWidth: "60%",
            data: data
          }
        ]
      };

      // Enable data zoom when user click bar.
      // var zoomSize = 6;
      Chart.on("click", function(params) {
        // console.log(this)
        _this.areaCodeLoad(
          areaCode[params.dataIndex],
          dataAxis[params.dataIndex]
        );
        // this.loadStaticPic2();
      });
      Chart.setOption(option);
      this.firstChart = Chart.getOption(option);
      console.log(this.firstChart);
      Chart.hideLoading();

      //加载完成-end
    },
    areaCodeLoad(id, area) {
      console.log(id, area);
      var dom = document.getElementById("fundcontainter");
      // var Chart = echarts.init(dom);
      this.myChart = echarts.init(dom);
      this.myChart.showLoading({
        text: "加载加载加载....."
      });
      var _this = this;
      var dataAxis1 = [];
      var data1 = [];
      axios({
        method: "post",
        url: axios.PARK_API + "/backstage/loadPicData_jijincz",
        data: qs.stringify({
          nd: this.yearVal,
          // nd: 2014,
          areacode: id
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        if (res.data.success) {
          var datas = res.data.data;
          for (var int = 0; int < datas.length; int++) {
            dataAxis1[int] = datas[int].dq;
            data1[int] = datas[int].jjcz;
            echarts.dispose(this.myChart);
            this.myChart = echarts.init(dom);

            var option = {
              title: {
                text: area + "基金筹资情况",
                x: "center",
                y: "top",
                textAlign: "center"
              },
              color: ["#83bff6"],
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
              series: [
                {
                  name: "基金筹资金额",
                  type: "bar",
                  barWidth: "70%",
                  data: data1,
                  barGap: "40%"
                }
              ]
            };
            this.myChart.hideLoading();
            this.myChart.setOption(option, true);
            this.myChart.on("click", function() {
              //三级加载
              // _this.loadend();
              _this.$message.warning("已经是最后一级了！");
            });
          }
        } else {
        }
      });
    }

    /*    loadend() {
      echarts.dispose(this.myChart);
      var _this = this;
      var dom = document.getElementById("fundcontainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      console.log("ooo");
      // Chart = echarts.init(dom);
      var option = this.firstChart;
      console.log(option);
      console.log("ooo");
      Chart.setOption(option);
      Chart.hideLoading();
      Chart.on("click", function(params) {
        console.log(params)
        _this.areaCodeLoad(params);
        echarts.dispose(Chart);
      });
    }, */
    /*   searchFund() {
      var dom = document.getElementById("fundcontainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/backstage/loadPicData_jijincz",
        data: qs.stringify({
          nd: this.yearVal
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          console.log(res.data.data);
          this.loadStaticPic(res.data.data);
        } else {
          this.$message.error(res.data.error);
        }
      });
    } */
  },
  created() {
    this.getname();
    /*  this.$nextTick(function() {
      this.getFund();
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

