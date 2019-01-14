<template>
    <div>
        <div class="right-ctn-title">
            <div class="top">
                <span class="foulfont">违规病例变化趋势</span>
                <div class="selectype">
                  
                    <span>警示类型：</span>
					          <el-input size="mini" style="width:140px;" v-model="warnType" placeholder="请输入内容" @focus="warnTypeFocus" @blur="warnTypeBlur"></el-input>
                    <!-- @blur="warnTypeBlur"   -->
                      <ul class="upText" v-show="upShow">
                          <li class="Liactive" v-for="(it, index) in warnTypes" :key="index" @click="Liactive">{{it}}</li>
                      </ul>
                  
                    <!-- <span>结算日期：</span> -->
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
                    <span>医院名称：</span>
                    <el-autocomplete
                        v-model="hospitalText"
                        :fetch-suggestions="queryHosSearch"
                        placeholder="请输入内容"
                        @select="handleSelect"
                  ></el-autocomplete>
                  <!--<el-select v-model="Inquiryend" size="mini" placeholder="请选择">
                            <el-option
                            v-for="item in endoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                    </el-select> -->
                    <el-button size="mini" type="primary" style="margin-left: 6px;" @click="PolygonSearch">查询</el-button>
                </div>
            </div>
            <div class="bottom">
              <div class="topChart" id="topChart" :style="{width: '100%', height: '360px'}">
              </div>
              <div class="botChart">
                <div class="top">
                  <span class="foulfont">违规病例医院/时间分布</span>
                   <div class="toggleBtn">
                      <el-button type="primary" size="mini" :class="{'active': botBtn == 0}" @click="botBtn = 0">按医院</el-button>
                      <el-button type="primary" size="mini" :class="{'active': botBtn == 1}" @click="botBtn = 1">按时间</el-button>
                    </div>          
                </div>
                <div class="togChart">
                      <div  v-show="botBtn == 0" id="topTog" :style="{width: '100%', height: '100%'}">
                              <!-- 医院显示  -->
                      </div>
                      <div  v-show="botBtn == 1" id="botTog" :style="{width: '1349px', height: '360px'}">
                              <!-- 时间显示  -->
                      </div>
                </div>
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
      warnTypes: [],
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
      hospitalText: "",
      upShow: false,
      warnType: "",
      closingDate: "1",
      startTime: "",
      endTime: "",
      botBtn: 0,
      hospitalId: ""
    };
  },
  mounted() {
    this.topChart();
    this.topTog();
    this.botTog();
  },
  methods: {
    Liactive(val) {
      // console.log(val.path[0].innerHTML);
      this.warnType = val.target.childNodes[0].data;
      this.upShow = false;
    },
    //查询警示类型列表
    warnTypeFocus() {
      //从后台获取到对象数组
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatordermsg/listMsgType",
        params: {
          type: ""
        }
        /*   headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      })
        .then(res => {
          if (res.data.code == 0 && res.data.data != "") {
            console.log(res.data.data);
            this.warnTypes = res.data.data;
            this.upShow = true;

            // this.hospitalText = res.data.list;
            // console.log(res.data.list);
          } else {
            // this.$message.error(res.data.msg);
            this.$message("无此项目");
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    warnTypeBlur() {
       let _this = this;
       setTimeout(function() {
          _this.upShow = false;
       },200);
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
    topChart() {
      localStorage.setItem("hometext", "【住院-违规趋势分析】");
      var Chart = echarts.init(document.getElementById("topChart"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url:
          axios.PARK_API + "/hospitalization/biz/analy/queryIrreCaseTimeanaly",
        /*  params: {
          regionName: "西安市鄠邑区"
        } */
        data: {
          regionId: localStorage.getItem("regionId")
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        // console.log(res);
        var json = res.data.data;
        // console.log(json);
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        //接受后台信息
        for (var i = 0; i < json.length; i++) {
          arr1.push({
            //name: json[i].hospitalName,
            value: json[i].seriousIrrenum
          });
          arr2.push({
            value: json[i].baldate
          });

          arr3.push({
            value: json[i].pronum
          });
        }
        // console.log(arr2);
        var option = {
          tooltip: {
            trigger: "axis",
            formatter:
              '{b}<br />\
	                	<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#7ace4c"></span>\
	                	{a0}：{c0}<br />\
	                	<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#ffbb44"></span>\
	                	{a1}：{c1}%<br />\
	                	'
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          legend: {
            data: ["", "违规病例数", "违规病历占比"]
          },
          dataZoom: [
            //坐标拉伸
            {
              type: "slider",
              show: true,
              start: 40,
              end: 60,
              handleSize: 30
            },
            {
              type: "inside",
              start: 40,
              end: 60
            },
            {
              type: "slider",
              show: true,
              yAxisIndex: 0,
              filterMode: "empty",
              width: 12,
              height: "70%",
              handleSize: 30,
              showDataShadow: false,
              left: "5%"
            }
          ],
          xAxis: [
            {
              type: "category",
              data: arr2
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "违规病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            },
            {
              type: "value",
              name: "违规病历占比",
              axisLabel: {
                formatter: "{value} %"
              }
            }
          ],
          series: [
            {
              //				            name:'医院名称',
              type: "bar"
              //                          barCategoryGap:2000
              //				            data:arr2
            },
            {
              name: "违规病例数",
              type: "bar",
              data: arr1,
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: "#4169E1" //颜色
                }
              }
            },
            {
              name: "违规病历占比",
              type: "line",
              yAxisIndex: 1,
              smooth: true, //true 为平滑曲线，false为直线
              data: arr3,
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2 //折线宽度
                    //					                		color:'#FF000'//折线颜色
                  }
                }
              }
            }
          ]
        };
        Chart.hideLoading();
        Chart.setOption(option);
      });
    },
    //按条件查询
    topChartSearch() {
      var data = {};
      if (this.closingDate == 1) {
        /*  data.startindate = "";
        data.endindate = "";
        data.endoutdate = "";
        data.startoutdate = ""; */
        data.startbaldate = this.startTime;
        data.endbaldate = this.endTime;
        data.type = this.warnType;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      } else if (this.closingDate == 2) {
        data.startindate = this.startTime;
        data.endindate = this.endTime;
        /*  data.endoutdate = "";
        data.startoutdate = "";
        data.startbaldate = "";
        data.endbaldate = ""; */
        data.type = this.warnType;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      } else if (this.closingDate == 3) {
        /*  data.startindate = "";
        data.endindate = ""; */
        data.endoutdate = this.startTime;
        data.startoutdate = this.endTime;
        /* data.startbaldate = "";
        data.endbaldate = ""; */
        data.type = this.warnType;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      }
      var Chart = echarts.init(document.getElementById("topChart"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url:
          axios.PARK_API + "/hospitalization/biz/analy/queryIrreCaseTimeanaly",

        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        var json = res.data.data;
        console.log(json);
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        //接受后台信息
        for (var i = 0; i < json.length; i++) {
          arr1.push({
            //name: json[i].hospitalName,
            value: json[i].seriousIrrenum
          });
          arr2.push({
            value: json[i].baldate
          });

          arr3.push({
            value: json[i].pronum
          });
        }
        console.log(arr2);
        var option = {
          tooltip: {
            trigger: "axis",
            formatter:
              '{b}<br />\
	                	<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#7ace4c"></span>\
	                	{a0}：{c0}<br />\
	                	<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#ffbb44"></span>\
	                	{a1}：{c1}%<br />\
	                	'
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          legend: {
            data: ["", "违规病例数", "违规病历占比"]
          },
          dataZoom: [
            //坐标拉伸
            {
              type: "slider",
              show: true,
              start: 40,
              end: 60,
              handleSize: 30
            },
            {
              type: "inside",
              start: 40,
              end: 60
            },
            {
              type: "slider",
              show: true,
              yAxisIndex: 0,
              filterMode: "empty",
              width: 12,
              height: "70%",
              handleSize: 30,
              showDataShadow: false,
              left: "5%"
            }
          ],
          xAxis: [
            {
              type: "category",
              data: arr2
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "违规病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            },
            {
              type: "value",
              name: "违规病历占比",
              axisLabel: {
                formatter: "{value} %"
              }
            }
          ],
          series: [
            {
              //				            name:'医院名称',
              type: "bar"
              //                          barCategoryGap:2000
              //				            data:arr2
            },
            {
              name: "违规病例数",
              type: "bar",
              data: arr1,
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: "#4169E1" //颜色
                }
              }
            },
            {
              name: "违规病历占比",
              type: "line",
              yAxisIndex: 1,
              smooth: true, //true 为平滑曲线，false为直线
              data: arr3,
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2 //折线宽度
                    //					                		color:'#FF000'//折线颜色
                  }
                }
              }
            }
          ]
        };
        Chart.hideLoading();
        Chart.setOption(option);
      });
    },
    //按医院查询
    topTog() {
      var Chart = echarts.init(document.getElementById("topTog"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryIrreTrendanaly",
        /*  params: {
          regionName: "西安市鄠邑区"
        } */
        data: {
          regionId: localStorage.getItem("regionId")
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        // console.log(res);
        var json = res.data.data;
        // console.log(json);
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        //接受后台信息
        for (var i = 0; i < json.length; i++) {
          arr1.push({
            //name: json[i].hospitalName,
            value: json[i].seriousIrrenum
          });
          arr2.push({
            value: json[i].hospitalName
          });

          arr3.push({
            value: json[i].allIrrenum
          });
        }
        // console.log(arr1, arr2, arr3);
        // console.log(arr2);
        var option = {
          tooltip: {
            trigger: "axis"
          },
          dataZoom: [
            //坐标拉伸
            {
              type: "slider", //图标下方的伸缩条
              show: true, //是否显示
              start: 40, //进度条开始位置
              end: 60, //进度条结束位置
              handleSize: 30
            },
            {
              type: "inside", //鼠标滚轮
              start: 40, //进度条开始位置
              end: 60 //进度条结束位置
            },
            {
              type: "slider",
              show: true,
              yAxisIndex: 0,
              filterMode: "empty",
              width: 12,
              height: "70%",
              handleSize: 30,
              showDataShadow: false,
              left: "5%"
            }
          ],
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          legend: {
            data: ["", "违规病例数", "总病例数"]
          },
          xAxis: [
            {
              type: "category",
              data: arr2
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "违规病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            },
            {
              type: "value",
              name: "总病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            }
          ],
          series: [
            {
              //				            name:'医院名称',
              type: "bar"
              //                          barCategoryGap:2000
              //				            data:arr2
            },
            {
              name: "违规病例数",
              type: "bar",
              data: arr1,
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: "#4169E1" //颜色
                }
              }
            },
            {
              name: "总病例数",
              type: "line",
              yAxisIndex: 1,
              data: arr3,
              smooth: true, //true 为平滑曲线，false为直线
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2 //折线宽度
                    //					                		color:'#FF000'//折线颜色
                  }
                }
              }
            }
          ]
        };
        Chart.hideLoading();
        Chart.setOption(option);
      });
    },
    //按医院条件查询
    topTopSearch() {
      var data = {};
      if (this.closingDate == 1) {
        /*   data.startindate = "";
        data.endindate = "";
        data.endoutdate = "";
        data.startoutdate = ""; */
        data.startbaldate = this.startTime;
        data.endbaldate = this.endTime;
        data.type = this.warnType;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      } else if (this.closingDate == 2) {
        data.startindate = this.startTime;
        data.endindate = this.endTime;
        /*  data.endoutdate = "";
        data.startoutdate = "";
        data.startbaldate = "";
        data.endbaldate = ""; */
        data.type = this.warnType;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      } else if (this.closingDate == 3) {
        /*    data.startindate = "";
        data.endindate = "";
        data.startbaldate = "";
        data.endbaldate = ""; */
        data.endoutdate = this.startTime;
        data.startoutdate = this.endTime;
        data.regionId = localStorage.getItem("regionId");
        data.type = this.warnType;
        data.hospitalId = this.hospitalId;
      }
      var Chart = echarts.init(document.getElementById("topTog"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryIrreTrendanaly",
        // params: data
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        var json = res.data.data;
        console.log(json);
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        //接受后台信息
        for (var i = 0; i < json.length; i++) {
          arr1.push({
            //name: json[i].hospitalName,
            value: json[i].seriousIrrenum
          });
          arr2.push({
            value: json[i].hospitalName
          });

          arr3.push({
            value: json[i].allIrrenum
          });
        }
        console.log(arr2);
        var option = {
          tooltip: {
            trigger: "axis"
          },
          dataZoom: [
            //坐标拉伸
            {
              type: "slider", //图标下方的伸缩条
              show: true, //是否显示
              start: 40, //进度条开始位置
              end: 60, //进度条结束位置
              handleSize: 30
            },
            {
              type: "inside", //鼠标滚轮
              start: 40, //进度条开始位置
              end: 60 //进度条结束位置
            },
            {
              type: "slider",
              show: true,
              yAxisIndex: 0,
              filterMode: "empty",
              width: 12,
              height: "70%",
              handleSize: 30,
              showDataShadow: false,
              left: "5%"
            }
          ],
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          legend: {
            data: ["", "违规病例数", "总病例数"]
          },
          xAxis: [
            {
              type: "category",
              data: arr2
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "违规病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            },
            {
              type: "value",
              name: "总病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            }
          ],
          series: [
            {
              //				            name:'医院名称',
              type: "bar"
              //                          barCategoryGap:2000
              //				            data:arr2
            },
            {
              name: "违规病例数",
              type: "bar",
              data: arr1,
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: "#4169E1" //颜色
                }
              }
            },
            {
              name: "总病例数",
              type: "line",
              yAxisIndex: 1,
              data: arr3,
              smooth: true, //true 为平滑曲线，false为直线
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2 //折线宽度
                    //					                		color:'#FF000'//折线颜色
                  }
                }
              }
            }
          ]
        };
        Chart.hideLoading();
        Chart.setOption(option);
      });
    },

    //按时间查询
    botTog() {
      var Chart = echarts.init(document.getElementById("botTog"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url:
          axios.PARK_API + "/hospitalization/biz/analy/queryIrreTrendTimeanaly",
        /*  params: {
          regionName: "西安市鄠邑区"
        } */
        data: {
          regionId: localStorage.getItem("regionId")
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        // console.log(res);
        var json = res.data.data;
        // console.log(json);
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        //接受后台信息
        for (var i = 0; i < json.length; i++) {
          arr1.push({
            //name: json[i].hospitalName,
            value: json[i].seriousIrrenum
          });
          arr2.push({
            value: json[i].baldate
          });

          arr3.push({
            value: json[i].allIrrenum
          });
        }
        // console.log(arr2);
        var option = {
          tooltip: {
            trigger: "axis"
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          dataZoom: [
            //坐标拉伸
            {
              type: "slider", //图标下方的伸缩条
              show: true, //是否显示
              start: 40, //进度条开始位置
              end: 60, //进度条结束位置
              handleSize: 30
            },
            {
              type: "inside", //鼠标滚轮
              start: 40, //进度条开始位置
              end: 60 //进度条结束位置
            },
            {
              type: "slider",
              show: true,
              yAxisIndex: 0,
              filterMode: "empty",
              width: 12,
              height: "70%",
              handleSize: 30,
              showDataShadow: false,
              left: "5%"
            }
          ],
          calculable: true,
          legend: {
            data: ["", "违规病例数", "总病例数"]
          },
          xAxis: [
            {
              type: "category",
              data: arr2
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "违规病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            },
            {
              type: "value",
              name: "总病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            }
          ],
          series: [
            {
              //				            name:'医院名称',
              type: "bar"
              //                          barCategoryGap:2000
              //				            data:arr2
            },
            {
              name: "违规病例数",
              type: "bar",
              data: arr1,
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: "#4169E1" //颜色
                }
              }
            },
            {
              name: "总病例数",
              type: "line",
              yAxisIndex: 1,
              data: arr3,
              smooth: true, //true 为平滑曲线，false为直线
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2 //折线宽度
                    //					                		color:'#FF000'//折线颜色
                  }
                }
              }
            }
          ]
        };
        Chart.hideLoading();
        Chart.setOption(option);
      });
    },
    //按时间条件查询
    botTogSearch() {
      var data = {};
      if (this.closingDate == 1) {
        /*    data.startindate = "";
        data.endindate = "";
        data.endoutdate = "";
        data.startoutdate = ""; */
        data.startbaldate = this.startTime;
        data.endbaldate = this.endTime;
        data.type = this.warnType;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      } else if (this.closingDate == 2) {
        data.startindate = this.startTime;
        data.endindate = this.endTime;
        /*   data.endoutdate = "";
        data.startoutdate = "";
        data.startbaldate = "";
        data.endbaldate = ""; */
        data.type = this.warnType;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      } else if (this.closingDate == 3) {
        /*   data.startindate = "";
        data.endindate = ""; */
        data.endoutdate = this.startTime;
        data.startoutdate = this.endTime;
        /*  data.startbaldate = "";
        data.endbaldate = ""; */
        data.type = this.warnType;
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalId;
      }
      var Chart = echarts.init(document.getElementById("botTog"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url:
          axios.PARK_API + "/hospitalization/biz/analy/queryIrreTrendTimeanaly",
        // params: data
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        var json = res.data.data;
        console.log(json);
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        //接受后台信息
        for (var i = 0; i < json.length; i++) {
          arr1.push({
            //name: json[i].hospitalName,
            value: json[i].seriousIrrenum
          });
          arr2.push({
            value: json[i].baldate
          });

          arr3.push({
            value: json[i].allIrrenum
          });
        }
        console.log(arr2);
        var option = {
          tooltip: {
            trigger: "axis"
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          dataZoom: [
            //坐标拉伸
            {
              type: "slider", //图标下方的伸缩条
              show: true, //是否显示
              start: 40, //进度条开始位置
              end: 60, //进度条结束位置
              handleSize: 30
            },
            {
              type: "inside", //鼠标滚轮
              start: 40, //进度条开始位置
              end: 60 //进度条结束位置
            },
            {
              type: "slider",
              show: true,
              yAxisIndex: 0,
              filterMode: "empty",
              width: 12,
              height: "70%",
              handleSize: 30,
              showDataShadow: false,
              left: "5%"
            }
          ],
          calculable: true,
          legend: {
            data: ["", "违规病例数", "总病例数"]
          },
          xAxis: [
            {
              type: "category",
              data: arr2
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "违规病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            },
            {
              type: "value",
              name: "总病例数",
              axisLabel: {
                formatter: "{value} 例"
              }
            }
          ],
          series: [
            {
              //				            name:'医院名称',
              type: "bar"
              //                          barCategoryGap:2000
              //				            data:arr2
            },
            {
              name: "违规病例数",
              type: "bar",
              data: arr1,
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: "#4169E1" //颜色
                }
              }
            },
            {
              name: "总病例数",
              type: "line",
              yAxisIndex: 1,
              data: arr3,
              smooth: true, //true 为平滑曲线，false为直线
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2 //折线宽度
                    //					                		color:'#FF000'//折线颜色
                  }
                }
              }
            }
          ]
        };
        Chart.hideLoading();
        Chart.setOption(option);
      });
    },
    PolygonSearch() {
      this.topChartSearch();
      this.topTopSearch();
      this.botTogSearch();
    }
  },
  created() {}
};
</script>


<style scoped>
.right-ctn-title {
  /* width: calc(100%-20px); */
  width: 100%;
  text-align: left;
  height:100%;
  overflow:scroll;
  -ms-overflow-style: none;
  /* padding-left: 20px; */
}
.right-ctn-title span {
  font-size: 14px;
  line-height: 40px;
}
.right-ctn-title .top {
  width: 100%;
  height: 80px;
  background-color: #fafafa;
  position: relative;
}
.toggleBtn {
  position: absolute;
  bottom: 0;
  left: 4px;
}
.top .foulfont {
  font-size: 20px;
  color: #7a8cc2;
  margin-left: 20px;
}
.top .selectype {
  float: right;
  position: relative;
}
.bottom {
  width: 100%;
  height: 600px;
}
.bottom .topChart {
  width: 100%;
  height: 40%;
  /* border: 1px solid #00f; */
}
.bottom .botChart {
  width: 100%;
  height: 60%;
  /* border: 1px solid #fafafa; */
}
.botChart .togChart {
  width: 100%;
  height: 100%;
  /* border: 1px solid #f00; */
}
.active {
  background-color: #fff;
  color: #000;
}
.upText {
  position: absolute;
  background: #fff;
  left: 7%;
  top: 68%;
  z-index: 999;
  width: 160px;
  height: 200px;
  overflow: auto;
  margin-top: 10px;
  padding: 0;
  text-align: left;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.upText li {
  font-size: 12px;
  margin-bottom: 2px;
  color: #606266;
  padding: 0 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 24px;
}
.Liactive:hover {
  cursor: pointer;
  background-color: #aaaaaa;
}

.el-select {
  width: 100px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 124px;
}
.el-autocomplete-suggestion li {
  padding: 0 10px;
}
</style>
