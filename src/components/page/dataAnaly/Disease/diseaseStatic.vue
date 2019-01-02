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
             <el-input style="width: 240px; height: 30px;" v-model="startAge" size="mini"
                                      placeholder="开始年龄段"></el-input>
             <el-input style="width: 240px; height: 30px;" v-model="endAge" size="mini"
                                      placeholder="结束年龄段"></el-input>
            <!-- <span>违规等级：</span> -->
            <el-select v-model="illegal" size="mini" @change="Chartselect" placeholder="请选择图表项目">
                <el-option
                v-for="item in illegaloptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
          <!--   <el-input style="width: 240px; height: 30px;" v-model="disease" @focus="disFocus" size="mini"
                                      placeholder="请输入简码查询病种"></el-input> -->
             <el-autocomplete
                  v-model="disease"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入简码查询病种"
                  @select="handleSelect"
                ></el-autocomplete>
            <el-button size="mini" type="warning" @click="getDisease" style="margin-left: 5px;">
                <i class="el-icon-search"></i>
            </el-button>   
      </div>
      <div class="chart">
        <el-button size="mini" type="warning" @click="backto" style="margin-left: 5px;">
            <i class="el-icon-back"></i>
        </el-button>  
        <div id="disContainter" :style="{width: '100%', height: '470px'}"></div>
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
      startAge: "",
      endAge: "",
      startTime: "",
      endTime: "",
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
      disease: "",
      typeName: "",
      alldataRemake: "",
      flag: "",
      areaCodeId: "",
      yiyuancode: ""
    };
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【病种统计分析】");
    },
    getDisease() {
      this.flag = 1;
      var _this = this;
      var dom = document.getElementById("disContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      if (localStorage.getItem("limited") == 1) {
        this.yiyuancode = "";
      } else if (localStorage.getItem("limited") == 2) {
        // this.yiyuancode = "43740005861011111A1001";
        this.yiyuancode = localStorage.getItem("othercode");
      }
      axios({
        method: "post",
        // url: axios.PARK_API + "/backstage/loadPicData_bztj",
        url: axios.PARK_API + "/xnhidc/backstage/loadPicData_bztj",
        data: qs.stringify({
          st: this.startTime,
          end: this.endTime,
          bz: this.disease,
          sage: this.startAge,
          eage: this.endAge,
          yiyuanCode: this.yiyuancode
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        // console.log(res);
        if (res.data.success) {
          Chart.hideLoading();
          var echarts_date = res.data.data;
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var dataAxis = [];
          var datazyzongtianshu = [];
          var datarjzytianshu = [];
          var datashoushurenci = [];
          var datazyzrenshu = [];
          var datazylfeiyong = [];
          var datarjfeiyong = [];
          var dataypfeiyong = [];
          var datazffeiyong = [];
          var datakbjine = [];
          var databxjine = [];
          var areaCode = [];
          for (var i = 0; i < echarts_date.length; i++) {
            dataAxis[i] = echarts_date[i].dqmc;
            areaCode[i] = echarts_date[i].dqbm;
            datazyzongtianshu[i] = echarts_date[i].zyzts;
            datarjzytianshu[i] = echarts_date[i].rjzyts;
            datashoushurenci[i] = echarts_date[i].ssrc;
            datazyzrenshu[i] = echarts_date[i].zrs;
            datazylfeiyong[i] = echarts_date[i].zfy;
            datarjfeiyong[i] = echarts_date[i].rjypfy;
            dataypfeiyong[i] = echarts_date[i].ypfy;
            datazffeiyong[i] = echarts_date[i].zfyp;
            datakbjine[i] = echarts_date[i].kbxylfy;
            databxjine[i] = echarts_date[i].bxje;
          }

          var dataRemake = {};

          for (var name in echarts_date[0]) {
            //遍历对象属性名
            // console.log(name+":"+data[0]);
            //alert(name+":"+data[0].name);
            //debugger
            dataRemake.dataAxis = dataAxis;
            dataRemake.datazyzongtianshu = datazyzongtianshu;
            dataRemake.datarjzytianshu = datarjzytianshu;
            dataRemake.datashoushurenci = datashoushurenci;
            dataRemake.datazyzrenshu = datazyzrenshu;
            dataRemake.datazylfeiyong = datazylfeiyong;
            dataRemake.datarjfeiyong = datarjfeiyong;
            dataRemake.dataypfeiyong = dataypfeiyong;
            dataRemake.datazffeiyong = datazffeiyong;
            dataRemake.datakbjine = datakbjine;
            dataRemake.databxjine = databxjine;
            //alert(name)
          }
          this.alldataRemake = dataRemake;
          var option = {
            color: ["#2099aa"],
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

            dataZoom: [
              {
                show: true,
                xAxisIndex: 0,
                start: 0,
                end: 100,
                type: "slider",
                bottom: "1%"
              }
              /*{
				                   type: 'inside',
				                   start: 30,
				                   end: 90
				               }*/
              /*{
				                   show: true,
				                   yAxisIndex: 0,
				                   filterMode: 'empty',
				                   width: 30,
				                   height: '80%',
				                   showDataShadow: false,
				                   //left: '93%',
				                   left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'  
				                   top:"top",                                //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'  
				                   right:"auto",                             //组件离容器右侧的距离,'20%'  
				                   bottom:"auto", 
				               }*/
            ],
            series: [
              {
                name: this.typeName,
                type: "bar",
                barMaxWidth: 50,
                data: eval(this.illegal)
                //data:dataRemake.eval($("select[name='tu']").val())
              }
            ]
          };
          Chart.setOption(option);
          Chart.on("click", function(params) {
            console.log(params.name);
            _this.areaCodeId = areaCode[params.dataIndex];
            _this.areaLoading();
            // _this.areaLoading(areaCode[params.dataIndex]);
          });
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    areaLoading() {
      this.flag = 2;
      var dom = document.getElementById("disContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      var _this = this;
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadPicData_bztj",
        data: qs.stringify({
          st: this.startTime,
          end: this.endTime,
          bz: this.disease,
          sage: this.startAge,
          eage: this.endAge,
          areacode: this.areaCodeId,
          yiyuanCode: this.yiyuancode
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          Chart.hideLoading();
          var echarts_date = res.data.data;
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var dataAxis = [];
          var datazyzongtianshu = [];
          var datarjzytianshu = [];
          var datashoushurenci = [];
          var datazyzrenshu = [];
          var datazylfeiyong = [];
          var datarjfeiyong = [];
          var dataypfeiyong = [];
          var datazffeiyong = [];
          var datakbjine = [];
          var databxjine = [];
          var areaCode = [];
          for (var i = 0; i < echarts_date.length; i++) {
            //dataAxis.push(datas[i].医院名称)
            areaCode[i] = echarts_date[i].dqbm;
            dataAxis[i] = echarts_date[i].dqmc;
            datazyzongtianshu[i] = echarts_date[i].zyzts;
            datarjzytianshu[i] = echarts_date[i].rjzyts;
            datashoushurenci[i] = echarts_date[i].ssrc;
            datazyzrenshu[i] = echarts_date[i].zrs;
            datazylfeiyong[i] = echarts_date[i].zfy;
            datarjfeiyong[i] = echarts_date[i].rjypfy;
            dataypfeiyong[i] = echarts_date[i].ypfy;
            datazffeiyong[i] = echarts_date[i].zfyp;
            datakbjine[i] = echarts_date[i].kbxylfy;
            databxjine[i] = echarts_date[i].bxje;

            //data[i]=result[i].pvalue;
          }
          var dataRemake = {};
          for (var name in echarts_date[0]) {
            //遍历对象属性名
            // console.log(name+":"+data[0]);
            //alert(name+":"+data[0].name);
            //debugger
            dataRemake.dataAxis = dataAxis;
            dataRemake.datazyzongtianshu = datazyzongtianshu;
            dataRemake.datarjzytianshu = datarjzytianshu;
            dataRemake.datashoushurenci = datashoushurenci;
            dataRemake.datazyzrenshu = datazyzrenshu;
            dataRemake.datazylfeiyong = datazylfeiyong;
            dataRemake.datarjfeiyong = datarjfeiyong;
            dataRemake.dataypfeiyong = dataypfeiyong;
            dataRemake.datazffeiyong = datazffeiyong;
            dataRemake.datakbjine = datakbjine;
            dataRemake.databxjine = databxjine;
            //alert(name)
          }
          this.alldataRemake = dataRemake;
          var option = {
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

            dataZoom: [
              {
                show: true,
                xAxisIndex: 0,
                start: 0,
                end: 100,
                type: "slider",
                bottom: "1%"
              }
              /*{
								                   type: 'inside',
								                   start: 30,
								                   end: 90
								               }*/
              /*{
								                   show: true,
								                   yAxisIndex: 0,
								                   filterMode: 'empty',
								                   width: 30,
								                   height: '80%',
								                   showDataShadow: false,
								                   //left: '93%',
								                   left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'  
								                   top:"top",                                //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'  
								                   right:"auto",                             //组件离容器右侧的距离,'20%'  
								                   bottom:"auto", 
								               }*/
            ],
            series: [
              {
                name: this.typeName,
                type: "bar",
                barMaxWidth: 50,
                data: eval(this.illegal)
                //data:dataRemake.eval($("select[name='tu']").val())
              }
            ]
          };
          Chart.setOption(option);
          Chart.on("click", function(params) {
            _this.townLoading(areaCode[params.dataIndex]);
          });
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    townLoading(id) {
      this.flag = 3;
      console.log(id);
      var dom = document.getElementById("disContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      var _this = this;
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadPicData_bztj",
        data: qs.stringify({
          st: this.startTime,
          end: this.endTime,
          bz: this.disease,
          sage: this.startAge,
          eage: this.endAge,
          areacode: id,
          yiyuanCode: this.yiyuancode
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          Chart.hideLoading();
          var echarts_date = res.data.data;
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var dataAxis = [];
          var datazyzongtianshu = [];
          var datarjzytianshu = [];
          var datashoushurenci = [];
          var datazyzrenshu = [];
          var datazylfeiyong = [];
          var datarjfeiyong = [];
          var dataypfeiyong = [];
          var datazffeiyong = [];
          var datakbjine = [];
          var databxjine = [];
          for (var i = 0; i < echarts_date.length; i++) {
            //dataAxis.push(datas[i].医院名称)
            dataAxis[i] = echarts_date[i].dqmc;
            datazyzongtianshu[i] = echarts_date[i].zyzts;
            datarjzytianshu[i] = echarts_date[i].rjzyts;
            datashoushurenci[i] = echarts_date[i].ssrc;
            datazyzrenshu[i] = echarts_date[i].zrs;
            datazylfeiyong[i] = echarts_date[i].zfy;
            datarjfeiyong[i] = echarts_date[i].rjypfy;
            dataypfeiyong[i] = echarts_date[i].ypfy;
            datazffeiyong[i] = echarts_date[i].zfyp;
            datakbjine[i] = echarts_date[i].kbxylfy;
            databxjine[i] = echarts_date[i].bxje;

            //data[i]=result[i].pvalue;
          }
          var dataRemake = {};
          for (var name in echarts_date[0]) {
            //遍历对象属性名
            // console.log(name+":"+data[0]);
            //alert(name+":"+data[0].name);
            //debugger
            dataRemake.dataAxis = dataAxis;
            dataRemake.datazyzongtianshu = datazyzongtianshu;
            dataRemake.datarjzytianshu = datarjzytianshu;
            dataRemake.datashoushurenci = datashoushurenci;
            dataRemake.datazyzrenshu = datazyzrenshu;
            dataRemake.datazylfeiyong = datazylfeiyong;
            dataRemake.datarjfeiyong = datarjfeiyong;
            dataRemake.dataypfeiyong = dataypfeiyong;
            dataRemake.datazffeiyong = datazffeiyong;
            dataRemake.datakbjine = datakbjine;
            dataRemake.databxjine = databxjine;
            //alert(name)
          }
          this.alldataRemake = dataRemake;
          var option = {
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
            xAxis: [
              {
                type: "category",
                //data : ['1','2','3','4','5','6','7']
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

            dataZoom: [
              {
                show: true,
                xAxisIndex: 0,
                start: 0,
                end: 100,
                type: "slider",
                bottom: "1%"
              }
              /*{
													                   type: 'inside',
													                   start: 30,
													                   end: 90
													               }*/
              /*{
													                   show: true,
													                   yAxisIndex: 0,
													                   filterMode: 'empty',
													                   width: 30,
													                   height: '80%',
													                   showDataShadow: false,
													                   //left: '93%',
													                   left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'  
													                   top:"top",                                //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'  
													                   right:"auto",                             //组件离容器右侧的距离,'20%'  
													                   bottom:"auto", 
													               }*/
            ],
            series: [
              {
                name: this.typeName,
                type: "bar",
                barMaxWidth: 50,
                //data:[320, 332, 301, 334, 390, 330, 320]
                //data:[datas[0].住院总天数]
                data: eval(this.illegal)
                //data:dataRemake.eval($("select[name='tu']").val())
              }
            ]
          };

          Chart.setOption(option);
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
        this.getDisease();
        console.log(this.flag);
      } else if (this.flag == 3) {
        this.areaLoading();
      }
    },
    querySearchAsync(queryString, callback) {
      console.log(queryString);
      var list = [{}];
      axios({
        method: "post",
        // url: axios.PARK_API + "/tiaojian/getbz",
        url: axios.PARK_API + "/xnhidc/tiaojian/getbz",
        data: qs.stringify({
          pym: this.disease
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        if (res.data.success) {
          for (let i of res.data.data) {
            i.value = i.bzmc; //将想要展示的数据作为value
            // console.log(i.value)
          }
          list = res.data.data;
          callback(list);
        } else {
          this.$message("无此病种");
        }
      });
    },
    handleSelect(item) {
      console.log(item);
    },
    Chartselect(value) {
      console.log(value);
      let obj = {};
      obj = this.illegaloptions.find(item => {
        return item.value === value;
      });
      this.typeName = obj.label;
      if ("undefined" != typeof this.alldataRemake) {
        var dom = document.getElementById("disContainter");
        var Chart = echarts.init(dom);
        Chart.showLoading({
          text: "加载加载加载....."
        });
        Chart.setOption({
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
              data: this.alldataRemake[value]
            }
          ]
        }); //end myChart.setOption
        Chart.hideLoading();
      }
    }
  },
  created() {
    this.getname();
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
.el-button + .el-button {
  margin-left: 0;
}
.el-select {
  /* width: 100px; */
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 124px;
}
</style>

