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
        <el-button size="mini" type="warning" @click="backto" style="margin-left: 5px;">
            <i class="el-icon-back"></i>
        </el-button>
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
        },
        {
          value: "datafdrs",
          label: "住院到达封顶人数"
        }
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
      //三级联动
      city: "",
      cityoptions: [],
      area: "",
      areaoptions: [],
      town: "",
      townoptions: [],
      typeName: "",
      alldataRemake: "",
      flag: "",
      areaCodeId: "",
      areaName: "",
      hospital: false,
      yiyuancode: ""
    };
  },
  methods: {
    getname() {
      localStorage.setItem("hometext", "【住院补偿情况分析（医院）】");
      if (localStorage.getItem("limited") == 1) {
        this.hospital = true;
      } else if (localStorage.getItem("limited") == 2) {
        this.hospital = false;
      }
    },
    getHostatic() {
      this.flag = 1;
      var id = this.getAreaCode();
      var _this = this;
      var dom = document.getElementById("hosContainter");
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
        grade = "";
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadddyy_zhuyuan",
        data: qs.stringify({
          sdate: this.startTime,
          edate: this.endTime,
          yiyuandengji: grade,
          // yiyuandengji: this.grade,
          yiyuanCode: this.yiyuancode,
          // yiyuanCode: this.hospitalCode,
          areaCode: id
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
            dataAxis[i] = echarts_date[i].医院名称;
            areaCode[i] = echarts_date[i].YYBM;
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
              }
            ]
          };
          Chart.setOption(option);
          Chart.on("click", function(params) {
            _this.areaCodeId = areaCode[params.dataIndex];
            _this.areaName = params.name;
            // console.log(_this.areaCodeId, _this.areaName);
            _this.areaLoading();
            // _this.areaLoading(areaCode[params.dataIndex], params.name);
          });
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    areaLoading() {
      this.flag = 2;
      var optionType;
      if (this.typeName == "住院药品费用") {
        optionType = "yp";
      } else if (this.typeName == "住院诊疗费用") {
        optionType = "zl";
      } else {
        return;
      }
      var dom = document.getElementById("hosContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      var _this = this;
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadddyy_zhuyuan_yaoping",
        data: qs.stringify({
          sdate: this.startTime,
          edate: this.endTime,
          yiyuanCode: this.areaCodeId,
          option: optionType
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
          var ypmc = [];
          var zje = [];
          for (var i = 0; i < echarts_date.length; i++) {
            //西药 A 中成药 B 中草药 C  床位 M  护理F 检查 D 治疗E  手术 G
            switch (echarts_date[i].XMLB) {
              case "A":
                ypmc[i] = "西药";
                break;
              case "B":
                ypmc[i] = "中成药";
                break;
              case "C":
                ypmc[i] = "中草药";
                break;
              case "D":
                ypmc[i] = "检查";
                break;
              case "E":
                ypmc[i] = "治疗";
                break;
              case "F":
                ypmc[i] = "护理";
                break;
              case "G":
                ypmc[i] = "手术";
                break;
              case "M":
                ypmc[i] = "床位";
                break;
              case "其它":
                ypmc[i] = "其它";
                break;
            }
            zje[i] = echarts_date[i].ZJE;
          }
          var option = {
            title: {
              text: this.areaName,
              x: "center"
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
            xAxis: [
              {
                type: "category",
                //data : ['1','2','3','4','5','6','7']
                data: ypmc,
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
              feature: {
                mark: { show: true },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
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
                name: "药品大类",
                type: "bar",
                barMaxWidth: "60",
                //data:[320, 332, 301, 334, 390, 330, 320]
                //data:[datas[0].住院总天数]
                data: zje
                //data:dataRemake.eval($("select[name='tu']").val())
              }
            ]
          };
          Chart.setOption(option);
          Chart.on("click", function(params) {
            _this.townLoading(this.areaCodeId, params.name);
          });
        } else {
          this.$message.error("请检查网络");
        }
      });
    },
    townLoading(id, name) {
      this.flag = 3;
      var type = null;
      // var index = params.name;
      switch (name) {
        case "西药":
          type = "A";
          break;
        case "中成药":
          type = "B";
          break;
        case "中草药":
          type = "C";
          break;
        case "检查":
          type = "D";
          break;
        case "治疗":
          type = "E";
          break;
        case "护理":
          type = "F";
          break;
        case "手术":
          type = "G";
          break;
        case "床位":
          type = "M";
          break;
        case "其它":
          type = "其它";
          break;
      }
      var dom = document.getElementById("hosContainter");
      var Chart = echarts.init(dom);
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/loadddyy_zhuyuan_yaoping_mx",
        data: qs.stringify({
          sdate: this.startTime,
          edate: this.endTime,
          yiyuanCode: this.areaCodeId,
          type: type
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
          var ypmc = [];
          var zje = [];
          for (var i = 0; i < echarts_date.length; i++) {
            ypmc[i] = echarts_date[i].YPMC;
            zje[i] = echarts_date[i].ZJE;
          }
          var option = {
            title: {
              text: name,
              x: "center"
            },
            color: ["#83bff6"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow",
                label: {
                  show: true
                }
              }
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: ypmc
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
            yAxis: [
              {
                type: "value",
                name: "总金额",
                axisLabel: {
                  formatter: function(a) {
                    a = +a;
                    return isFinite(a) ? echarts.format.addCommas(+a) : "";
                  }
                }
              }
            ],
            //下边滚动条
            dataZoom: [
              {
                show: true,
                start: 1,
                end: 20,
                show: true,
                xAxisIndex: [0],
                handleSize: 20, //滑动条的 左右2个滑动条的大小
                height: 8, //组件高度
                left: 30, //左边的距离
                right: 40, //右边的距离
                bottom: 30, //右边的距离
                handleColor: "#ddd", //h滑动图标的颜色
                handleStyle: {
                  borderColor: "#cacaca",
                  borderWidth: "1",
                  shadowBlur: 2,
                  background: "#ddd",
                  shadowColor: "#ddd"
                },
                fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                    //给第一个设置0，第四个设置1，就是垂直渐变
                    offset: 0,
                    color: "#1eb5e5"
                  },
                  {
                    offset: 1,
                    color: "#5ccbb1"
                  }
                ]),
                backgroundColor: "#ddd", //两边未选中的滑动条区域的颜色
                showDataShadow: false, //是否显示数据阴影 默认auto
                showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
                handleIcon:
                  "M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z",
                filterMode: "filter"
              },
              {
                type: "inside",
                start: 1,
                end: 10
              }
            ],
            series: [
              {
                name: "总金额",
                type: "bar",
                barMaxWidth: "60",
                data: zje
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
        this.getHostatic();
        console.log(this.flag);
      } else if (this.flag == 3) {
        this.areaLoading();
      }
    },
    selectOnchang() {
      console.log(this.getAreaCode());
      var id = this.getAreaCode();
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

