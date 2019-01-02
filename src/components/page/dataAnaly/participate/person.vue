<template>
    <div>
        <div class="right-ctn-title" v-show="chartShow">
            <span>参合年度:</span>
            <el-date-picker
            v-model="yearVal"
            type="year"
            value-format="yyyy"
            placeholder="选择年">
            </el-date-picker>
            <el-button size="mini" type="success" style="margin-left: 20px;" @click="getPerson">
                <i class="el-icon-search"></i>
                查询统计
            </el-button>  
             <el-button size="mini" type="success" style="margin-left: 20px;" @click="getDataList">
                    查看数据列表
            </el-button>       
        </div>

        <div v-show="listShow">
           <div class="right-ctn-title">
              <el-input style="width: 200px;" size="mini"
                                      placeholder="请输入姓名" v-model="name"></el-input>
              <el-input style="width: 200px;"  size="mini" v-model="hlzh"
                                      placeholder="请输入合疗证号"></el-input>
              <el-button size="mini" type="success" style="margin-left: 20px;" @click="tableSearch">
                  搜索
              </el-button>
               <el-button size="mini" type="warning" style="margin-left: 20px;" @click="clearSearch">
                  重置
              </el-button>
              <el-button size="mini" type="success" style="margin-left: 20px;" @click="getChartshow">
                  退出
              </el-button>
           </div>

            <el-table
                  :data="tableData"
                  center
                  border
                  height="490"
                  style="width: 100%;margin-top:10px;">
                <!--  <el-table-column
                          type="index"
                          height="100"
                          show-overflow-tooltip
                          :index="indexMethod">
                  </el-table-column> -->
                  <el-table-column
                          prop="name"
                          width="100"
                          show-overflow-tooltip
                          label="姓名">
                  </el-table-column>
                  <el-table-column
                          prop="sex"
                          width="50"
                          show-overflow-tooltip
                          label="性别"
                          :formatter="formatRole">
                  </el-table-column>
                  <el-table-column
                          prop="idCard"
                          show-overflow-tooltip
                          label="身份证号">
                  </el-table-column>
                  <el-table-column
                          prop="hlzh"
                          show-overflow-tooltip
                          label="合疗证号">
                  </el-table-column>
                  <el-table-column
                          prop="personType"
                          show-overflow-tooltip
                          width="100"
                          label="人员类型">
                  </el-table-column>
                  <el-table-column
                          prop="tel"
                          show-overflow-tooltip
                          width="120"
                          label="电话">
                  </el-table-column>
                  
                  <el-table-column
                          prop="address"
                          show-overflow-tooltip
                          label="地址">
                  </el-table-column>
            </el-table>
            <div class="block" id="fenye">
                <el-pagination background layout="total,prev, pager, next" @current-change="handledataPage" :total=total>
                </el-pagination>
            </div>
        </div>
        <div class="chart" v-show="chartShow">
            <el-button size="mini" type="success" @click="backto" style="margin-left: 5px;">
                <i class="el-icon-back"></i>
            </el-button>
            <div id="container" :style="{width: '100%', height: '470px'}"></div>
        </div>
        <el-dialog :title="'('+this.code+')'+'参合人员详细信息'" v-if='addVisible' :visible.sync="addVisible" width="76%" top="60px">
          <persple :tableData="tableData" :total="total" :code="code" v-on:handleCurrentChange = "handleCurrentChange"></persple>
        </el-dialog>
    </div>

</template>



<script>
import axios from "axios";
import qs from "qs";
import persple from "../../../component/persple";
let echarts = require("echarts");
export default {
  data() {
    return {
      yearVal: "",
      dataShadow: [],
      yMax: 500,
      addVisible: false,
      tableData: [],
      total: 0,
      code: "",
      flag: "",
      areaCodeId: "",
      listShow: false,
      chartShow: true,
      currentPage: 1,
      name: "",
      hlzh: "",
      isSearch: false,
      isPage: false
    };
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【参合人员基本信息】");
    },
    getPerson() {
      this.flag = 1;
      let _this = this;
      if (this.yearVal != "") {
        var dom = document.getElementById("container");
        var Chart = echarts.init(dom);
        Chart.showLoading({
          text: "加载加载加载....."
        });
        axios({
          method: "post",
          url: axios.PARK_API + "/xnhidc/backstage/loadPicData",
          // url: axios.PARK_API + "/backstage/loadPicData",
          data: qs.stringify({
            year: this.yearVal,
            level: "6"
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        })
          .then(res => {
            console.log(res.data.success);
            if (res.data.success) {
              Chart.hideLoading();
              var datas = res.data.data;
              echarts.dispose(Chart);
              Chart = echarts.init(dom);
              var dataAxis = [];
              var data = [];
              var areaCode = [];
              for (var int = 0; int < datas.length; int++) {
                dataAxis[int] = datas[int].name;
                data[int] = datas[int].pvalue;
                areaCode[int] = datas[int].areaCode;
                console.log(dataAxis[int]);
              }
              for (var i = 0; i < data.length; i++) {
                this.dataShadow.push(this.yMax);
              }

              var option = {
                //color: ['red'],
                title: {
                  text: "参合人员情况分析",
                  subtext: "              (县级)"
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
                    name: "参合人数",
                    type: "bar",
                    barWidth: "10%",
                    label: {
                      normal: {
                        show: true,
                        position: "inside"
                      }
                    },
                    data: data
                  }
                ]
              };

              // Enable data zoom when user click bar.
              var zoomSize = 6;
              Chart.on("click", function(params) {
                _this.areaCodeId = areaCode[params.dataIndex];
                _this.areaCodeLoad();
              });
              Chart.setOption(option);
              // this.loadStaticPic(res.data.data);
            } else {
              this.$message.error(res.data.error);
            }
          })
          .catch(error => {
            //this.$message.error('请检查网络');
          });
      } else {
        this.$message.warning("参合年度不能为空！");
      }
    },
    areaCodeLoad() {
      this.flag = 2;
      var dom = document.getElementById("container");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      var _this = this;

      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadPicData",
        // url: axios.PARK_API + "/backstage/loadPicData",
        data: qs.stringify({
          sdate: this.yearVal + "-" + "01" + "-" + "01",
          edate: this.yearVal + "-" + "01" + "-" + "01",
          /*  sdate: "2018-01-01",
          edate: "2018-01-01", */
          aeracode: this.areaCodeId,
          level: "9"
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          Chart.hideLoading();
          var datas = res.data.data;
          var dataAxis1 = [];
          var data1 = [];
          var areaCode1 = [];
          for (var int = 0; int < datas.length; int++) {
            dataAxis1[int] = datas[int].name;
            data1[int] = datas[int].pvalue;
            areaCode1[int] = datas[int].areaCode;
            echarts.dispose(Chart);
            Chart = echarts.init(dom);
            var option = {
              title: {
                text: "参合人员情况分析",
                subtext: "(乡镇)"
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
                  name: "参合人数",
                  type: "bar",
                  //barWidth: '60%',
                  label: {
                    normal: {
                      show: true,
                      position: "inside"
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#83bff6" },
                        { offset: 0.5, color: "#188df0" },
                        { offset: 1, color: "#188df0" }
                      ])
                    },
                    emphasis: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#2378f7" },
                        { offset: 0.7, color: "#2378f7" },
                        { offset: 1, color: "#83bff6" }
                      ])
                    }
                  },
                  data: data1
                }
              ]
            };
            Chart.setOption(option, true);
            Chart.on("click", function(params) {
              //三级加载
              _this.loadStaticPic3(areaCode1[params.dataIndex]);
            });
          }
        } else {
        }
      });
    },
    loadStaticPic3(id) {
      this.flag = 3;
      console.log(id);
      var _this = this;
      var dom = document.getElementById("container");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadPicData",
        data: qs.stringify({
          sdate: this.yearVal + "-" + "01" + "-" + "01",
          edate: this.yearVal + "-" + "01" + "-" + "01",
          aeracode: id,
          level: "12"
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        if (res.data.success) {
          Chart.hideLoading();
          var datas = res.data.data;
          var dataAxis2 = [];
          var data2 = [];
          var areaCode2 = [];
          for (var int = 0; int < datas.length; int++) {
            dataAxis2[int] = datas[int].name;
            data2[int] = datas[int].pvalue;
            areaCode2[int] = datas[int].areaCode;
          }
          echarts.dispose(Chart);
          Chart = echarts.init(dom);
          var option = {
            title: {
              text: "参合人员情况分析",
              subtext: "(乡村)"
            },
            color: ["#83bff6"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
              }
              //    ,
              // formatter: function (params) {
              //     var tar = params[1];
              //    return tar.name + '<br/>' + ' 参合人员: ' + tar.value+ '(人)';
              // }
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
                name: "参合人数",
                type: "bar",
                //barWidth: '60%',
                label: {
                  normal: {
                    show: true,
                    position: "inside"
                  }
                },
                itemStyle: {
                  emphasis: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#2378f7" },
                      { offset: 0.7, color: "#2378f7" },
                      { offset: 1, color: "#83bff6" }
                    ])
                  }
                },
                data: data2
              }
            ]
          };
          Chart.on("click", function(params) {
            //三级加载
            _this.presonList(areaCode2[params.dataIndex]);
          });
          Chart.setOption(option, true);
        } else {
        }
      });
    },
    presonList(code) {
      console.log(code);
      this.code = code;
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/presonDataList",
        data: qs.stringify({
          aeracode: this.code
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.rows;
        this.total = res.data.total;
        this.addVisible = true;
      });
    },
    backto() {
      if (this.flag == "") {
        this.$message.warning("亲！已经是首层了");
      } else if (this.flag == 1) {
        this.$message.warning("已经是第一级了");
      } else if (this.flag == 2) {
        this.getPerson();
        console.log(this.flag);
      } else if (this.flag == 3) {
        this.areaCodeLoad();
      }
    },
    handleCurrentChange(val) {
      console.log(val);
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/presonDataList",
        data: qs.stringify({
          aeracode: this.code,
          page: val,
          rows: 10
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.rows;
      });
    },

    formatRole: function(row, column) {
      return row.sex == "1" ? "男" : row.sex == "2" ? "女" : "其他";
    },
    getDataList(val) {
      this.listShow = true;
      this.chartShow = false;
      var page;
      if (this.isPage == true) {
        page = val;
      } else {
        page = 1;
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/presonDataList",
        data: qs.stringify({
          // aeracode: ""
          page: page,
          rows: 10
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.rows;
        this.total = res.data.total;
      });
    },
    handledataPage(val) {
      this.isPage = true;
      // localStorage.setItem("rn", val);
      if (this.isSearch == true) {
        this.tableSearch(val);
      } else {
        this.getDataList(val);
      }
    },
    getChartshow() {
      this.listShow = false;
      this.chartShow = true;
    },
    tableSearch(val) {
      this.isSearch = true;
      var rn;
      if (isNaN(val)) {
        rn = 1;
      } else {
        rn = val;
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/presonDataList",
        data: qs.stringify({
          // aeracode: ""
          page: rn,
          rows: 10,
          name: this.name,
          hlzh: this.hlzh
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.rows;
        this.total = res.data.total;
      });
    },
    clearSearch() {
      this.getDataList(1);
      this.name = "";
      this.hlzh = "";
    }
    /*  searchBtn() {
      this.getPerson();
    } */
  },
  components: {
    persple
  },
  created() {
    this.getname();
    /* this.$nextTick(function() {
      this.getPerson();
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
/* .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 120px;
} */
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
/* .chart span {
  font-size: 16px;
  font-weight: 700;
  margin-left: 20px;
} */
</style>

