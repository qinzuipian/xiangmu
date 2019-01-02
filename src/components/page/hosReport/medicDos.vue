<template>
    <div>
        <div class="main">
            <div class="top">
                <div class="topLeft" id="topLeft">

                </div>
                <div class="topRight" id="topRight">

                </div>

            </div>
            <div class="bottom">
                <div class="bottomLeft" id="bottomLeft">

                </div>
                <div class="bottomRight" id="bottomRight">

                </div>

            </div>
        </div>
    </div>
    
</template>



<script>
import axios from "axios";
let echarts = require("echarts");
export default {
  data() {
    return {};
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【重点药品用量总体情况分析】");
    },
    topLeft() {
      var Chart = echarts.init(document.getElementById("topLeft"));
      Chart.showLoading({
        text: "加载加载加载....."
      });

      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryDrugYearAnaly",
        data: {},
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          var arr1 = [];
          var arr2 = [];
          for (var i = 0; i < datas.length; i++) {
            arr1.push({
              //name: json[i].hospitalName,
              value: datas[i].feeDate
            });
            arr2.push({
              value: datas[i].ndzFee
            });
          }
          console.log(datas);
          var option = {
            title: {
              text: "年度药品总费量趋势",
              left: "center",
              top: "top"
            },
            tooltip: {
              confine: true,
              enterable: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              data: arr1
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                // data: [820, 932, 901, 934, 1290, 1330, 1320],
                data: arr2,
                type: "line",
                areaStyle: {}
              }
            ]
          };
          Chart.setOption(option, true);
        } else {
          this.$message.error("请检查网络！");
        }
      });
    },
    topRight() {
      var Chart = echarts.init(document.getElementById("topRight"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryDrugMonthAnaly",
        params: {
          year: new Date().getFullYear()
        }
        /*  headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          var arr1 = [];
          var arr2 = [];
          for (var i = 0; i < datas.length; i++) {
            arr1.push({
              //name: json[i].hospitalName,
              value: datas[i].feeDate
            });
            arr2.push({
              value: datas[i].ydzFee
            });
          }
          var option = {
            title: {
              text: new Date().getFullYear() + "年月度药品总用量趋势",
              left: "center",
              top: "top"
            },
            tooltip: {
              confine: true,
              enterable: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              data: arr1
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                // data: [820, 932, 901, 934, 1290, 1330, 1320],
                data: arr2,
                type: "line",
                areaStyle: {}
              }
            ]
          };
          Chart.setOption(option, true);
        } else {
          this.$message.error("请检查网络！");
        }
      });
    },
    bottomLeft() {
      var Chart = echarts.init(document.getElementById("bottomLeft"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryDrugTypeAnaly",
        params: {}
        /*  headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          var arr1 = [];
          var arr2 = [];
          var arr3 = [];
          for (var i = 0; i < datas.length; i++) {
            arr1.push(datas[i].fzFee);
            arr1.push(datas[i].zyFee);
            arr1.push(datas[i].zzFee);
          }
          console.log(arr1);
          var option = {
            title: {
              text: "药品类别分类",
              left: "center",
              top: "top"
            },
            //图表的位置
            /* grid: {
        position: 'top',
     },*/
            tooltip: {
              confine: true,
              enterable: true
            },
            legend: {
              x: "left",
              y: "8%"
              /*   data: [
                "预算分配（Allocated Budget）",
                "实际开销（Actual Spending）"
              ] */
            },
            radar: {
              // shape: 'circle',
              name: {
                textStyle: {
                  color: "#fff",
                  backgroundColor: "#999",
                  borderRadius: 3,
                  padding: [3, 5]
                }
              },
              indicator: [
                { name: "辅助用药费用", max: 6500 },
                { name: "中药费用", max: 16000 },
                { name: "质子泵抑制药费用", max: 30000 }
              ],
              center: ["40%", "66%"]
            },
            series: [
              {
                name: "药品类别分类",
                type: "radar",
                areaStyle: { normal: { areaStyle: { type: "default" } } },
                data: [
                  {
                    value: arr1
                  }
                ]
              }
            ]
          };
          Chart.setOption(option, true);
        } else {
          this.$message.error("请检查网络！");
        }
      });
    },
    bottomRight() {
      //   var _this = this;
      var Chart = echarts.init(document.getElementById("bottomRight"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryDrugBigTypeAnaly",
        params: {}
        /*  headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          var arr1 = [];
          for (var i = 0; i < datas.length; i++) {
            arr1.push(datas[i].xyjFee);
            arr1.push(datas[i].xyyFee);
            arr1.push(datas[i].xyzfFee);
            arr1.push(datas[i].zcyjFee);
            arr1.push(datas[i].zcyyFee);
            arr1.push(datas[i].zcyzfFee);
          }
          var option = {
            title: {
              text: "药品大类分布",
              left: "center",
              top: "top"
            },
            tooltip: {},
            grid: {
              // 控制图的大小，调整下面这些值就可以，
              x: 40,
              x2: 100,
              y2: 150 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
            },
            legend: {
              x: "10%",
              y: "8%"
              /* data: [
                "预算分配（Allocated Budget）",
                "实际开销（Actual Spending）"
              ] */
            },
            radar: {
              // shape: 'circle',
              name: {
                textStyle: {
                  color: "#fff",
                  backgroundColor: "#999",
                  borderRadius: 3,
                  padding: [3, 5]
                }
              },
              indicator: [
                { name: "西药甲类", max: 6500 },
                { name: "西药乙类", max: 16000 },
                { name: "西药自费", max: 30000 },
                { name: "中成药甲类", max: 38000 },
                { name: "中成药乙类", max: 52000 },
                { name: "中成药自费", max: 25000 }
              ],
              center: ["60%", "55%"],
              radius: 110
            },
            series: [
              {
                name: "药品大类分布",
                type: "radar",
                areaStyle: { normal: { type: "default" } },
                data: [
                  {
                    value: arr1
                    // name: "预算分配（Allocated Budget）",
                    //改变图表颜色
                    /*  itemStyle: {
                      normal: {
                        color: "rgba(0,225,255,1)",
                        lineStyle: {
                          color: "rgba(0,225,255,.3)"
                        }
                      }
                    } */
                  }
                  /*  {
                    value: [5000, 14000, 28000, 31000, 42000, 21000],
                    name: "实际开销（Actual Spending）"
                  } */
                ]
              }
            ]
          };
          //   Chart.resize();
          Chart.setOption(option, true);
        } else {
          this.$message.error("请检查网络！");
        }
      });

      /*  _this.window.resize(function() {
        //这是能够让图表自适应的代码
        Chart.resize();
      }); */
    }
  },
  mounted() {
    this.topLeft();
    this.topRight();
    this.bottomLeft();
    this.bottomRight();
  },
  created() {
    this.getname();
  }
};
</script>



<style scoped>
.main {
  width: 1340px;
  height: 660px;
  padding: 0;
  margin: 0;
}
.top {
  width: 100%;
  height: 45%;
  /* background-color: #f00; */
  position: relative;
}
.top .topLeft {
  width: 50%;
  height: 100%;
  /* background-color: #ff0; */
}
.top .topRight {
  width: 50%;
  height: 100%;
  /* background-color: #0ff; */
  position: absolute;
  top: 0;
  right: 0;
}
.bottom {
  width: 100%;
  height: 55%;
  /* background-color: #00f; */
  position: relative;
}
.bottom .bottomLeft {
  width: 50%;
  height: 100%;
  /* background-color: #0f0; */
}
.bottom .bottomRight {
  width: 50%;
  height: 100%;
  /* background-color: #ff0; */
  position: absolute;
  top: 0;
  right: 0;
}
</style>
