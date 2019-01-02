<template>
    <div>
        <div class="right-ctn-title">
            <div class="all">
                <div class="leftChart">
                  <div  v-show="botBtn == 0" id="round" :style="{width: '100%', height: '100%'}">
                       图表显示 
                  </div>
                   <div  v-show="botBtn == 1">
                       数据显示 
                  </div>
                    
                </div>
                <div class="rightMath">

                      <span>地区：</span>        
                       <!-- 地区五级联动 -->
                    <el-input v-model="city"  style="width:160px;" @focus="provinceList"  placeholder="请输入内容"></el-input> 
                    <!-- @blur="proBlur" -->
                    <ul class="provinceList" v-show="proShow"  @mouseleave = "cityLeave">
                      <li v-for="(item,index) in cityList" :key="index" @click="cityChange">{{item.d20120}}</li>
                    </ul>
                    <ul class="cityList" v-show="cityShow" @mouseenter="roundenter" @mouseleave = "roundLeave">
                      <li v-for="(item,index) in roundList" :key="index" @click="roundChange">{{item.d20120}}</li>
                    </ul>
                     <ul class="roundList" v-show="roundShow" @mouseenter="townenter" @mouseleave = "townLeave">
                      <li v-for="(item,index) in townList" :key="index" @click="townChange">{{item.d20120}}</li>
                    </ul>
                    <ul class="townList" v-show="townShow" @mouseenter="villagenter" @mouseleave = "villageLeave">
                      <li v-for="(item,index) in villageList" :key="index" @click="villageChange">{{item.d20120}}</li>
                    </ul>
                    <ul class="smallList" v-show="smallShow" @mouseenter="smallenter" @mouseleave = "smallLeave">
                      <li v-for="(item,index) in smallList" :key="index" @click="smallChange">{{item.d20120}}</li>
                    </ul>
                  <!-- <el-cascader
                        :options="cityList"
                        @change="handleItem"
                        @active-item-change="handleItemChange"
                        :props="props"
                      ></el-cascader> -->

                        <br>
                         <span>医院名称：</span>
                          <el-autocomplete
                              v-model="hospitalText"
                              :fetch-suggestions="queryHosSearch"
                              placeholder="请输入内容"
                              @select="handleSelect"
                        ></el-autocomplete>
                        <br>
                        <!-- <span>结算日期：</span> -->
                        <el-select v-model="balDate" size="mini" placeholder="结算日期">
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
                        <br>
                        <span>报销机构:</span>
                        <el-select v-model="expense" size="mini" placeholder="请选择">
                            <el-option
                            v-for="item in expenseoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <br>
                        <!-- <span>报销类型：</span>
                        <el-select v-model="Inquiryend" size="mini" placeholder="请选择">
                            <el-option
                            v-for="item in endoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <br> -->
                        <span>类型:</span><br>
                        <el-radio v-model="warnType" label="type">警示类型</el-radio><br>
                        <el-radio v-model="warnType" label="hospitalName">医疗机构</el-radio><br>
                        <el-radio v-model="warnType" label="itemName">费用类型</el-radio>
                        <br>
                        <span>警示级别:</span><br>
                        <el-radio v-model="warning" label="">全部</el-radio><br>
                        <el-radio v-model="warning" label="3">3级</el-radio><br>
                        <el-radio v-model="warning" label="4">4级</el-radio><br>
                        <el-radio v-model="warning" label="5">5级</el-radio><br>
                        <el-button type="primary" size="mini" @click="circleSearch">查询</el-button>

                </div>
                <div class="line"></div>
                <div class="toggleBtn">
                  <!-- <el-button type="primary" size="mini" :class="{'active': botBtn == 0}" @click="botBtn = 0">图表</el-button> -->
                  <!-- <el-button type="primary" size="mini" :class="{'active': botBtn == 1}" @click="botBtn = 1">数据</el-button> -->
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
      //  地区五级联动
      cityList: [],
      props: {
        value: "d20102",
        label: "d20120",
        children: "cities"
      },
      roundList: [],
      townList: [],
      villageList: [],
      smallList: [],
      province: "陕西省",
      proShow: false,
      cityShow: false,
      roundShow: false,
      townShow: false,
      smallShow: false,
      city: "",
      round: "",
      town: "",
      village: "",

      hospitalText: "",
      closingDates: [
        {
          value: "1",
          label: "结算日期"
        },
        {
          value: "2",
          label: "处方日期"
        }/* ,
        {
          value: "3",
          label: "出院日期"
        } */
      ],
      balDate: "1",
      startTime: "",
      endTime: "",
      expense: "院端",
      expenseoptions: [
        {
          value: "中心",
          label: "中心"
        },
        {
          value: "院端",
          label: "院端"
        }
      ],
      warnType: "type",
      warning: "",
      botBtn: 0,
      hospitalId: ""
    };
  },
  mounted() {
    this.drawline();
  },
  methods: {
    //医院编码与医疗机构的选择
    queryHosSearch(queryString, callback) {
      var list = [{}];

      //从后台获取到对象数组
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/d101/list",
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
    drawline() {
      localStorage.setItem("hometext", "【门诊-综合分析】");
      let Chart = echarts.init(document.getElementById("round"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/analy/queryholallanaly",
        /* params: {
          types: "type"
        }*/
        data: {
          types: "type",
          regionId: localStorage.getItem("regionId")
        },

        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        var json = res.data.data;
        // console.log(json);
        var arr1 = [];
        var arr2 = [];
        var str = [];
        var str1 = [];

        //接受后台信息
        for (var i = 0; i < json.length; i++) {
          if (json[i].type != null) {
            str = json[i].type;
          } else if (json[i].hospitalName != null) {
            str = json[i].hospitalName;
          } else if (json[i].itemName != null) {
            str = json[i].itemName;
          }
          str1 = json[i].percent;
          arr1.push({
            name: str,
            value: str1
          });
          arr2.push({
            name: str
          });

          /*  arr1.push({
            name: json[i].type,
            value: json[i].percent
          });
          arr2.push({
            name: json[i].type
          }); */
        }
        var option = {
          title: {
            text: "住院综合分析",
            //					        subtext: '绝对位置',
            x: "center"
          },
          //气泡提示框，常用于展现更详细的数据
          tooltip: {
            //提示框内百分号数据
            //					    	触发类型，默认数据触发，见下图，可选为：'item' | 'axis'
            trigger: "item",
            //					        	内容格式器：{string}（Template） | {Function}，支持异步回调见表格下方
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          //					    图例，表述数据和图形的关联
          legend: {
            orient: "vertical",
            left: "left",
            data: arr2
          },
          //					    数据系列，一个图表可能包含多个系列，每一个系列可能包含多个数据
          series: [
            {
              name: "百分比",
              type: "pie",
              radius: "55%",
              center: ["50%", "50%"],
              data: arr1,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
          //					    color: ['rgb(0,191,255)','rgb(255,255,0)','rgb(119,136,153)','rgb(139,69,19)','rgb(128,128,128)']
        };
        Chart.hideLoading();
        Chart.setOption(option);
      });
    },
    // 查询扇形统计图
    circleSearch() {
      var data = {};
      if (this.balDate == 1) {
        data.startindate = "";
        data.endindate = "";
        data.startbaldate = this.startTime;
        data.endbaldate = this.endTime;
        data.reimbOrg = this.expense;
        data.severity = this.warning;
        data.types = this.warnType;
        data.regionName = this.city;
        data.hospitalId = this.hospitalId;
        data.regionId = localStorage.getItem("regionId");
      } else if (this.balDate == 2) {
        data.startindate = this.startTime;
        data.endindate = this.endTime;
        data.startbaldate = "";
        data.endbaldate = "";
        data.reimbOrg = this.expense;
        data.severity = this.warning;
        data.types = this.warnType;
        data.regionName = this.city;
        data.hospitalId = this.hospitalId;
         data.regionId = localStorage.getItem("regionId");
      }/*  else if (this.balDate == 3) {
        data.startindate = "";
        data.endindate = "";
        data.endoutdate = this.startTime;
        data.startoutdate = this.endTime;
        data.startbaldate = "";
        data.endbaldate = "";
        data.reimbOrg = this.expense;
        data.severity = this.warning;
        data.types = this.warnType;
        data.regionName = this.city;
        data.hospitalId = this.hospitalId;
        data.regionId = localStorage.getItem("regionId");
      } */
      let Chart = echarts.init(document.getElementById("round"));
      Chart.showLoading({
        text: "加载加载加载....."
      });
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/analy/queryholallanaly",
        /* params: {
          types: "type"
        }*/
        // data: { types: "type" },
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        var json = res.data.data;
        // console.log(json);
        var arr1 = [];
        var arr2 = [];
        var str = [];
        var str1 = [];

        //接受后台信息
        for (var i = 0; i < json.length; i++) {
          if (json[i].type != null) {
            str = json[i].type;
          } else if (json[i].hospitalName != null) {
            str = json[i].hospitalName;
          } else if (json[i].itemName != null) {
            str = json[i].itemName;
          }
          str1 = json[i].percent;
          arr1.push({
            name: str,
            value: str1
          });
          arr2.push({
            name: str
          });
        }
        var option = {
          title: {
            text: "住院综合分析",
            //					        subtext: '绝对位置',
            x: "center"
          },
          //气泡提示框，常用于展现更详细的数据
          tooltip: {
            //提示框内百分号数据
            //					    	触发类型，默认数据触发，见下图，可选为：'item' | 'axis'
            trigger: "item",
            //					        	内容格式器：{string}（Template） | {Function}，支持异步回调见表格下方
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          //					    图例，表述数据和图形的关联
          legend: {
            orient: "vertical",
            left: "left",
            data: arr2
          },
          //					    数据系列，一个图表可能包含多个系列，每一个系列可能包含多个数据
          series: [
            {
              name: "百分比",
              type: "pie",
              radius: "55%",
              center: ["50%", "50%"],
              data: arr1,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
          //					    color: ['rgb(0,191,255)','rgb(255,255,0)','rgb(119,136,153)','rgb(139,69,19)','rgb(128,128,128)']
        };
        Chart.hideLoading();
        Chart.setOption(option);
      });
    },
    // 地区五级联动
    provinceList() {
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/analy/queryregion",
        params: {
          admincode: 61,
          level: 0
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.proShow = true;
            console.log(res.data.data);
            this.cityList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    cityLeave() {
      this.proShow = false;
    },
    roundenter() {
      this.proShow = true;
      this.cityShow = true;
    },
    roundLeave() {
      this.cityShow = false;
      this.proShow = false;
    },
    townenter() {
      this.proShow = true;
      this.cityShow = true;
      this.roundShow = true;
    },
    townLeave() {
      this.cityShow = false;
      this.proShow = false;
      this.roundShow = false;
    },
    villagenter() {
      this.proShow = true;
      this.cityShow = true;
      this.roundShow = true;
      this.townShow = true;
    },
    villageLeave() {
      this.cityShow = false;
      this.proShow = false;
      this.roundShow = false;
      this.townShow = false;
    },
    smallenter() {
      this.proShow = true;
      this.cityShow = true;
      this.roundShow = true;
      this.townShow = true;
      this.smallShow = true;
    },
    smallLeave() {
      this.cityShow = false;
      this.proShow = false;
      this.roundShow = false;
      this.townShow = false;
      this.smallShow = false;
    },

    // 失去焦点
    /*   proBlur() {
     
    
    
    
    
    }, */
    cityChange(val) {
      console.log(val.path[0].innerHTML);
      sessionStorage.setItem("city", val.path[0].innerHTML);
      let i;
      this.cityList.find(item => {
        if (item.d20120 == val.path[0].innerHTML) {
          console.log(item.d20102);
          i = parseInt(item.d20102);
        }
      });
      console.log(i);
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/analy/queryregion",
        params: {
          admincode: i,
          level: 1
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res.data.data);
            this.cityShow = true;
            this.roundList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    roundChange(val) {
      // console.log(val.path[0].innerHTML);
      sessionStorage.setItem("round", val.path[0].innerHTML);
      let i;
      this.roundList.find(item => {
        if (item.d20120 == val.path[0].innerHTML) {
          console.log(item.d20102);
          i = parseInt(item.d20102);
        }
      });
      console.log(i);
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/analy/queryregion",
        params: {
          admincode: i,
          level: 2
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res.data.data);
            this.roundShow = true;
            this.townList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    townChange(val) {
      console.log(val.path[0].innerHTML);
      sessionStorage.setItem("town", val.path[0].innerHTML);
      let i;
      this.townList.find(item => {
        if (item.d20120 == val.path[0].innerHTML) {
          console.log(item.d20102);
          i = parseInt(item.d20102);
        }
      });
      console.log(i);
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/analy/queryregion",
        params: {
          admincode: i,
          level: 3
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res.data.data);
            if (res.data.data == "") {
              this.townShow = false;
              let chengshi =
                sessionStorage.getItem("round") +
                sessionStorage.getItem("town");
              this.city = chengshi;
              this.proShow = false;
              this.cityShow = false;
              this.roundShow = false;
            } else {
              this.townShow = true;
              this.villageList = res.data.data;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    villageChange(val) {
      console.log(val.path[0].innerHTML);
      sessionStorage.setItem("village", val.path[0].innerHTML);
      let i;
      this.villageList.find(item => {
        if (item.d20120 == val.path[0].innerHTML) {
          console.log(item.d20102);
          i = parseInt(item.d20102);
        }
      });
      console.log(i);
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/analy/queryregion",
        params: {
          admincode: i,
          level: 4
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res.data.data);
            if (res.data.data == "") {
              this.smallShow = false;
              let chengshi =
                sessionStorage.getItem("round") +
                sessionStorage.getItem("town") +
                sessionStorage.getItem("village");
              this.city = chengshi;
              this.proShow = false;
              this.townShow = false;
              this.cityShow = false;
              this.roundShow = false;
            } else {
              this.smallShow = true;
              this.smallList = res.data.data;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    smallChange(val) {
      console.log(val.path[0].innerHTML);
      sessionStorage.setItem("small", val.path[0].innerHTML);
      let chengshi =
        sessionStorage.getItem("round") +
        sessionStorage.getItem("town") +
        sessionStorage.getItem("village") +
        sessionStorage.getItem("small");
      console.log(chengshi);
      this.city = chengshi;
      this.proShow = false;
      this.smallShow = false;
      this.townShow = false;
      this.roundShow = false;
      this.cityShow = false;
    },
    handleItemChange(val) {
      console.log(val);
    },
    handleItem(val) {
      console.log(val);
    }
  },
  created() {
    // this.provinceList();
  }
};
</script>

<style scoped>
.right-ctn-title {
  width: 100%;
  /* height: 40px; */
  text-align: left;
  /* background: #e8f1ff; */
}
.right-ctn-title span {
  font-size: 14px;
}
.right-ctn-title .all {
  margin: 6px auto;
  width: 1300px;
  height: 580px;
  border: 1px solid #6f8bb7;
  position: relative;
  overflow-y: hidden;
}
.right-ctn-title .all .leftChart {
  width: 60%;
  height: 100%;
}
.right-ctn-title .all .rightMath {
  width: 40%;
  height: 100%;
  /* float: right; */
  position: absolute;
  top: 10px;
  right: 0;
}
.right-ctn-title .all .line {
  height: 100%;
  width: 6px;
  background: #e6eef8;
  position: absolute;
  top: 0;
  left: 58%;
}

.right-ctn-title .all .rightMath .el-radio {
  margin-bottom: 8px;
}
.right-ctn-title .all .toggleBtn {
  position: absolute;
  bottom: -30px;
  left: 0;
}
.provinceList,
.cityList,
.roundList,
.townList,
.smallList {
  /* display: inline-block; */
  vertical-align: top;
  text-align: center;
  font-size: 14px;
  height: 204px;
  overflow: auto;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0;
  padding: 6px 0;
  width: 100px;
  margin-left: 46px;
  position: absolute;
  z-index: 999;
}
.cityList {
  top: 14%;
  left: 19%;
}
.roundList {
  top: 14%;
  left: 36%;
}
.townList {
  top: 14%;
  left: 52%;
}
.smallList {
  top: 14%;
  left: 68%;
}
.provinceList li,
.cityList li,
.roundList li,
.townList li,
.smallList li {
  width: 100%;
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.provinceList li:hover,
.cityList li:hover,
.roundList li:hover,
.townList li:hover,
.smallList li:hover {
  background-color: #ebeef5;
}
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.active {
  background-color: #fff;
  color: #000;
}
.el-select {
  width: 100px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 124px;
}
</style>



