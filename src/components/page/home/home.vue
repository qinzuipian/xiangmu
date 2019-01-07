<template>
    <div>
        <div class="main">
            <span>欢迎！系统管理员</span>
            <el-select v-model="fangshi" @change="fangshiChange" size="mini" placeholder="请选择" style="float:right;margin-right:1%;">
                <el-option v-for="item in fangshiOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <div class="top">
              <div class="topTop">
                <div v-for="(item,index) in firstData" :key="index">
                  <span>{{item}}</span>
                  <p>{{index}}</p>
                </div>
              </div>
              <div class="topCen" id="topCen">

              </div>
              <div class="topBom" id="topBom"></div>

            </div>
            <div class="middle">
                <div class="middleTop" id="middleTop"></div>         
                <div class="middleCen" id="middleCen"></div>         
                <div class="middleBom" id="middleBom"></div>         
            </div>
            <div class="justmiddle">
                <div class="justTop">
                    <div v-for="(item,index) in thirdData" :key="index">
                        <span>{{item}}</span>
                        <p>{{index}}</p>
                    </div>
                </div>
                <div class="justCen">
                    <div id="justone"></div>
                    <div id="justtwo"></div>
                    <div id="justthree"></div>
                    <div id="justfour"></div>
                </div>
                <div class="justBom" id="justBom"></div>
            </div>
            <div class="bottom">
                <div class="botTop" id="botTop">

                </div>
                <div class="botCen" id="botCen">

                </div>
                <div class="botBom" id="botBom">

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
    return {
      fangshi: "1",
      fangshiOption: [
        {
          value: "1",
          label: "住院"
        },
        {
          value: "2",
          label: "门诊"
        }
      ],
      thirdData: [],
      firstData: [],
      doubtNum: [],
      exAmount: [],
      dateTime: [],
      hospitalName: [],
      hospitalValue: [],
      effectfee: [],
      doubtDrug: "",
      flagno: "",
      flagpass: "",
      flageffect: ""
    };
  },
  methods: {
    getBotTop() {
      localStorage.setItem("hometext", "【首页】");
      //四行一图
      var dom = document.getElementById("botTop");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/homepage/queryDoubtCaseTop10",
        params: {
          dateType: 1,
          type: this.fangshi
        }
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          console.log(datas);
          // var dataAxis = {};
          var data = [];
          for (var int = 0; int < datas.length; int++) {
            // console.log(datas[int])
            /*   dataAxis.name = datas[int].HOSPITALNAME;
            dataAxis.value = datas[int].NUM; */
            data.push({ name: datas[int].HOSPITALNAME, value: datas[int].NUM });
          }
          for (var i = 0; i < 5; i++) {
            this.hospitalName[i] = datas[i].HOSPITALNAME;
            this.hospitalValue[i] = datas[i].NUM;
          }
          console.log(this.hospitalName[i]);
          console.log(this.hospitalValue[i]);
          var option = {
            title: {
              text: "医院存疑病例TOP10",
              left: "center"
            },
            tooltip: {},
            series: [
              {
                visibleMin: 480,
                type: "treemap",
                data: data
              }
            ]
          };
          Chart.setOption(option);

          //一行三图
          var dom = document.getElementById("topBom");
          var Chart1 = echarts.init(dom);
          Chart1.showLoading({
            text: "加载加载加载....."
          });
          var option1 = {
            title: {
              text: "医院存疑病例TOP5",
              left: "center"
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
                type: "value"
              }
            ],
            yAxis: [
              {
                type: "category",
                axisTick: { show: false },
                data: this.hospitalName
              }
            ],
            series: [
              {
                type: "bar",
                /*    label: {
              normal: {
                show: true,
                position: "inside"
              }
            }, */
                data: this.hospitalValue
              }
            ]
          };
          Chart1.setOption(option1);
          Chart1.hideLoading();
        } else {
        }
      });
    },
    getBotCen() {
      //四行二图
      var dom = document.getElementById("botCen");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/homepage/queryMachineAudit",
        params: {
          dateType: 1,
          type: this.fangshi
        }
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          this.doubtDrug = datas[0].存疑病例数;
          this.flagno = datas[0].机审不通过;
          this.flagpass = datas[0].机审待确定;
          this.flageffect = datas[0].总病例数;
          var itempass = [];
          /*   var itemyes = [];
          var itemno = []; */
          for (var i = 0; i < datas.length; i++) {
            /*  itemno[i] = datas[i].机审待确认;
            itemno[i] = datas[i].机审通过;
            itemno[i] = datas[i].机审不通过; */
            itempass.push(
              datas[i].机审不通过,
              datas[i].机审待确定,
              datas[i].机审通过
            );
            this.firstData = res.data.data[0];
            //删除json键值与键值对
            var nJson = delete eval(res.data.data[0]).总病例数;
            var nJson = delete eval(res.data.data[0]).机审不通过;
            var nJson = delete eval(res.data.data[0]).机审待确定;
            var nJson = delete eval(res.data.data[0]).机审通过;
          }
          console.log(itempass);
          /*  var dataRemake = {};
          for (var name in datas[0]) {
            dataRemake.itempass = itempass;
          } */
          var option = {
            color: ["#3398DB"],
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
                data: ["机审不通过", "机审待确认", "机审通过"],
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
                type: "bar",
                barWidth: "60%",
                data: itempass
              }
            ]
          };
          Chart.setOption(option);

          //三行二图
          var myChart1 = echarts.init(document.getElementById("justone"));
          var myChart2 = echarts.init(document.getElementById("justtwo"));
          var myChart3 = echarts.init(document.getElementById("justthree"));
          var myChart4 = echarts.init(document.getElementById("justfour"));
          //存疑病例数
          var option1 = {
            tooltip: {
              show: false,
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ["#00c0ef"],
            series: [
              {
                name: "访问来源",
                type: "pie",
                radius: ["70%", "85%"],
                avoidLabelOverlap: false,
                hoveranination: false,
                silent: true,
                label: {
                  normal: {
                    show: true,
                    position: "center",
                    formatter: function(argument) {
                      var html;
                      html = "存疑病例数\r\n\r\n" + argument.data.value;
                      return html;
                    },
                    textStyle: {
                      fontSize: 15,
                      color: "#00c0ef"
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{ value: this.doubtDrug, name: "存疑病例数" }]
              }
            ]
          };
          myChart1.setOption(option1);
          //机审不通过
          var option2 = {
            tooltip: {
              show: false,
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ["#f00"],
            series: [
              {
                name: "访问来源",
                type: "pie",
                radius: ["70%", "85%"],
                avoidLabelOverlap: false,
                hoveranination: false,
                silent: true,
                label: {
                  normal: {
                    show: true,
                    position: "center",
                    formatter: function(argument) {
                      var html;
                      html = "机审不通过\r\n\r\n" + argument.data.value;
                      return html;
                    },
                    textStyle: {
                      fontSize: 15,
                      color: "#f00"
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{ value: this.flagno, name: "机审不通过" }]
              }
            ]
          };
          myChart2.setOption(option2);
          //总病例数
          var option3 = {
            tooltip: {
              show: false,
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ["#0f0"],
            series: [
              {
                name: "访问来源",
                type: "pie",
                radius: ["70%", "85%"],
                avoidLabelOverlap: false,
                hoveranination: false,
                silent: true,
                label: {
                  normal: {
                    show: true,
                    position: "center",
                    formatter: function(argument) {
                      var html;
                      html = "总病例数\r\n\r\n" + argument.data.value;
                      return html;
                    },
                    textStyle: {
                      fontSize: 15,
                      color: "#0f0"
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{ value: this.flageffect, name: "总病例数" }]
              }
            ]
          };
          myChart3.setOption(option3);
          //机审待确认
          var option4 = {
            tooltip: {
              show: false,
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ["#00f"],
            series: [
              {
                name: "访问来源",
                type: "pie",
                radius: ["70%", "85%"],
                avoidLabelOverlap: false,
                hoveranination: false,
                silent: true,
                label: {
                  normal: {
                    show: true,
                    position: "center",
                    formatter: function(argument) {
                      var html;
                      html = "机审待确认\r\n\r\n" + argument.data.value;
                      return html;
                    },
                    textStyle: {
                      fontSize: 15,
                      color: "#00f"
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{ value: this.flagpass, name: "机审待确认" }]
              }
            ]
          };
          myChart4.setOption(option4);
        } else {
        }
      });
    },
    getBotBom() {
      //四行三图
      var dom = document.getElementById("botBom");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/homepage/queryDoubtCaseByTime",
        params: {
          dateType: 2,
          type: this.fangshi
        }
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          var dataTime = [];
          var effectValue = [];
          var exAmount = [];
          var effectfee = [];
          for (var i = 0; i < datas.length; i++) {
            dataTime[i] = datas[i].TIME;
            effectValue[i] = datas[i].NUM;
            exAmount[i] = datas[i].EXAMOUNT;
            effectfee[i] = datas[i].EFFECTFEE;
          }
          this.doubtNum = effectValue;
          this.exAmount = exAmount;
          this.dateTime = dataTime;
          this.effectfee = effectfee;
          console.log(this.doubtNum, this.exAmount, this.dateTime);
          var option = {
            xAxis: {
              type: "category",
              data: dataTime
            },
            yAxis: {
              name: "存疑病例数",
              type: "value"
            },
            tooltip: {},
            series: [
              {
                data: effectValue,
                type: "line"
              }
            ]
          };
          Chart.setOption(option);

          //一行二图
          var dom = document.getElementById("topCen");
          var Chart1 = echarts.init(dom);
          Chart1.showLoading({
            text: "加载加载加载....."
          });
          Chart1.setOption({
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["存疑病例数", "存疑金额"]
            },
             grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            /*  toolbox: {
          feature: {
            saveAsImage: {}
          }
        }, */
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: this.dateTime
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                name: "存疑病例数",
                type: "line",
                stack: "总量",
                data: this.doubtNum
              },
              {
                name: "存疑金额",
                type: "line",
                stack: "总量",
                data: this.exAmount
              }
            ]
          });
          Chart1.hideLoading();

          //二行二图
          var dom = document.getElementById("middleCen");
          var Chart2 = echarts.init(dom);
          Chart2.showLoading({
            text: "加载加载加载....."
          });
          var option = {
            xAxis: {
              type: "category",
              data: this.dateTime
            },
            yAxis: {
              name: "统筹支付金额",
              type: "value"
            },
            tooltip: {},
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            series: [
              {
                data: this.effectfee,
                type: "line"
              }
            ]
          };
          Chart2.setOption(option);
          Chart2.hideLoading();
        } else {
        }
      });
    },
    getmiddleTop() {
      //二行一图
      var dom = document.getElementById("middleTop");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/homepage/queryDoubtCaseTop10",
        params: {
          nowDate:
            new Date().getFullYear() + "-" + eval(new Date().getMonth() + 1),
          type: this.fangshi,
          sc: 2
        }
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          var hospitalName = [];
          var hospitalPercent = [];
          for (var i = 0; i < datas.length; i++) {
            hospitalName[i] = datas[i].HOSPITALNAME;
            hospitalPercent[i] = parseFloat(datas[i].RATIO) / 100;
          }
          console.log(hospitalPercent);
          var option = {
            title: {
              text: "医院存疑病例环比TOP5"
            },
            color: ["#3398DB"],
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
                data: hospitalName,
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
                type: "bar",
                barWidth: "60%",
                data: hospitalPercent
              }
            ]
          };
          Chart.setOption(option);
        } else {
        }
      });
    },
    getmiddleBom() {
      //二行三图
      var dom = document.getElementById("middleBom");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/homepage/queryPoorPeople",
        params: {
          areaCode: "",
          dateType: 2,
          type: this.fangshi
        }
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;

          var option = {
            tooltip: {
              trigger: "item",
              formatter: "{b} : {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              left: "left",
              data: ["人员", "贫困人员"]
            },
            series: [
              {
                type: "pie",
                radius: "55%",
                center: ["50%", "60%"],
                data: [
                  { value: datas[0].NUM, name: "人员" },
                  { value: datas[0].PKNUM, name: "贫困人员" }
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };
          Chart.setOption(option);
        } else {
        }
      });
    },
    getjustBom() {
      //三行三图
      var dom = document.getElementById("justBom");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/homepage/queryDoubtCaseTop10",
        params: {
          groupType: 2,
          type: this.fangshi
        }
      }).then(res => {
        if (res.data.code == 0) {
          Chart.hideLoading();
          var datas = res.data.data;
          var type = [];
          var num = [];
          for (var i = 0; i < datas.length; i++) {
            type[i] = datas[i].TYPE;
            num[i] = datas[i].NUM;
          }
          var option = {
            title: {
              text: "规则统计存疑病例数TOP10"
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            /*  legend: {
              data: ["2011年", "2012年"]
            }, */
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: {
              type: "value",
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: "category",
              data: type
            },
            series: [
              {
                type: "bar",
                data: num
              }
            ]
          };
          Chart.setOption(option);
        } else {
        }
      });
    },
    getjustTop() {
      //三行一图
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/homepage/querySysJob",
        params: {
          // nowDate: "2018-10-18",
          type: this.fangshi
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.thirdData = res.data.data[0];
        } else {
        }
      });
    },
    //选择值变化时调用
    fangshiChange() {
      this.getBotTop();
      this.getBotCen();
      this.getBotBom();
      this.getmiddleTop();
      this.getmiddleBom();
      this.getjustBom();
      this.getjustTop();
    }
  },
  mounted() {
    this.getBotTop();
    this.getBotCen();
    this.getBotBom();
    this.getmiddleTop();
    this.getmiddleBom();
    this.getjustBom();
  },
  created() {
    this.getjustTop();
  }
};
</script>


<style scoped>
.main {
  width: 100%;
  height: 116%;
  overflow-y:scroll;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #edf4f5;
  text-align: left;
  margin-top:30px;
}
::-webkit-scrollbar {
  display: none;
}
.main span {
  margin-left: 10px;
}

.main .top,
.main .justmiddle,
.main .middle,
.main .bottom {
  width: 100%;
  height: 330px;
  margin-top: 10px;
  /* background-color: #f00; */
}
.bottom .botTop,
.bottom .botCen,
.bottom .botBom,
.top .topTop,
.top .topCen,
.top .topBom,
.middle .middleTop,
.middle .middleCen,
.middle .middleBom,
.justmiddle .justTop,
.justmiddle .justCen,
.justmiddle .justBom {
  width: 33%;
  height: 100%;
  float: left;
}
.top .topTop,
.justmiddle .justCen,
.justmiddle .justTop {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: #fff;
}
.top .topCen,
.top .topBom,
.middle .middleTop,
.middle .middleCen,
.middle .middleBom,
.justmiddle .justBom,
.bottom .botTop,
.bottom .botCen,
.bottom .botBom {
  background-color: #fff;
}
.top .topTop div,
.justmiddle .justCen div {
  width: 46%;
  height: 46%;
  margin-right: 10px;
  margin-top: 20px;
  /*margin-bottom: 10px; */
  text-align: center;
}
.justmiddle .justTop div {
  width: 30%;
  height: 100%;
  /* margin-right: 10px; */
  margin-left: 10px;
  margin-top: 100px;
}
.top .topTop div span,
.justmiddle .justTop div span {
  font-size: 40px;
  font-weight: 700;
  color: orangered;
}
.justmiddle .justTop div span {
  font-size: 28px;
}
.top .topTop div p,
.justmiddle .justTop div p {
  border-top: 1px solid #000;
  font-size: 14px;
  font-weight: 700;
  color: #aaa;
}
</style>
