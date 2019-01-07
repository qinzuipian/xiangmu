<template>
    <div class="screen">
        <div class="screenHeader">
            <p class="screenHeaderTitle" v-show="screenOpen">查询</p>
            <p class="screenButton" v-show="screenOpen" @click="hiddenScreen(1)"><<</p>
            <p class="screenButton" v-show="!screenOpen" @click="hiddenScreen(2)">>></p>
        </div>
        <transition name="el-zoom-in-center" class="transitionScreen">
            <div v-show="screenOpen" class="transition-box">
                <p>医院名字</p>
                <!-- <el-input size="mini" v-model="leixingText" placeholder="请输入内容" @focus="cityFocus"></el-input>   -->
                <!--  <ul class="upText" v-show="upShow">
                    <li class="Liactive" v-for="(it, index) in cityDataList" :key="index" @click="Liactive">{{it.d10102}}</li>
                </ul> -->
                <el-input v-model="hosName" :disabled="true" placeholder="请输入内容" v-show="showhos"></el-input>
                <el-autocomplete
                  v-model="leixingText"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入内容"
                  @select="handleSelect"
                  v-show="allName"
                ></el-autocomplete>
               
               
                <div class="border"></div>
                <p>请选择日期方式</p>
                <el-select size="mini" v-model="dataWay" placeholder="请选择" class="leixingSelect">
                    <el-option
                            v-for="item in selectdate"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <div class="block">
                    <el-date-picker
                            v-model="inDateTime"
                            size="mini"
                            type="date"
                            class="hosptDataSel"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
                <p class="shijianlianjie">至</p>
                <div class="block">
                    <el-date-picker
                            v-model="inDateEnd"
                            size="mini"
                            type="date"
                            class="hosptDataSel"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>

                <div class="border"></div>
               
                <p>机审结果</p>
                <el-select size="mini" v-model="jishen" placeholder="请选择" class="leixingSelect">
                    <el-option
                            v-for="item in jishenOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <div class="border"></div>
                 <p>个人信息</p>
                <el-select size="mini" v-model="person" placeholder="请选择" class="leixingSelect">
                    <el-option
                            v-for="item in personOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                 <el-input size="mini" v-model="personText" placeholder="请输入内容"></el-input>
                <div class="border"></div>
                   <p>审核类型</p>
                 <!--    <el-autocomplete
                  v-model="examineText"
                  :fetch-suggestions="examinequery"
                  placeholder="请输入内容"
                ></el-autocomplete> -->
                     <el-input size="mini" v-model="examineText" placeholder="请输入内容" @focus="examineFocus" @blur="examineBlur"></el-input>  
                      <ul class="upText" v-show="upShow">
                          <li class="Liactive" v-for="(it, index) in examineList" :key="index" @mousedown="Liactive">{{it}}</li>
                      </ul>

                <div class="border"></div>
                <el-button plain style="width: 40%; background: #e8f1ff;margin-top: 20px;" @click="search" v-show="all">搜索</el-button>
                <el-button plain style="width: 40%; background: #e8f1ff;margin-top: 20px;" @click="jqsearch" v-show="jqall">搜索</el-button>
                <el-button plain style="width: 40%; background: #e8f1ff;margin-top: 20px;" @click="clear()">清除</el-button>
            </div>
        </transition>
    </div>
</template>

<script>
// import area from "@/static/area.js";
import axios from "axios";

export default {
  name: "screen",
  data() {
    return {
      screenOpen: true,
      showhos: false,
      hosName: "",
      allName: true,
      leixing: 1,
      leixingText: "",
      inDateTime: "",
      inDateEnd: "",
      /*outDateTime: "",
      outDateEnd: "",
      balDateEnd: "",
      balDateTime: "", */
      jishen: "",
      jishenOptions: [
        {
          value: 1,
          label: "通过"
        },
        {
          value: 2,
          label: "不通过"
        },
        {
          value: 3,
          label: "待确认"
        }
      ],
      person: 1,
      personOptions: [
        {
          value: 1,
          label: "姓名"
        },
        {
          value: 2,
          label: "医保号"
        }
      ],
      personText: "",
      selectdate: [
        {
          value: 1,
          label: "入院日期"
        },
        {
          value: 2,
          label: "出院日期"
        },
        {
          value: 3,
          label: "结算日期"
        }
      ],
      dataWay: 3,
      // diquliandong: areajson,
      examineText: "",
      //   三级联动
      props: {
        label: "label",
        value: "value",
        children: "children"
      },

      // 搜索的数据
      serchData: {},
      //首字母查询

      hospitalText: [],
      examineList: [],
      upShow: false,
      hospitalId: "",
      all: true,
      jqall: true

      // timeout: null
      /*  hospitalText: [],
      upShow: false,
      cityDataList: [], */
    };
  },

  /* mounted() {
    this.hospitalText = this.loadAll();
  }, */
  /* watch: {
    examineText() {
      let arr = [];
      for (let i = 0; i < this.examineList.length; i++) {
        if (this.examineList[i].indexOf(this.examineText) > -1) {
          // console.log(this.examineList[i])
          arr.push(this.examineList[i]);
          console.log(arr);
          this.examineList = arr;
        }
      }
    } 
  },*/
  methods: {
    hiddenScreen(j) {
      if (j == 1) {
        let _this = this;
        _this.screenOpen = !this.screenOpen;
        setTimeout(() => {
          this.$emit("hiddenScreen");
        }, 100);
      } else {
        let _this = this;
        this.$emit("hiddenScreen");
        setTimeout(() => {
          _this.screenOpen = !this.screenOpen;
        }, 100);
      }
    },
    handleItemChange(val) {
      console.log(val);
      //localStorage.setItem('city',val);
    },
    // 设置开始日期的默认时间
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let x = date.getMonth() + 1;

      // let d = localStorage.getItem("userTime");
      let d = localStorage.getItem("userTime")
        ? localStorage.getItem("userTime")
        : 21;
      let b = date.getDate();
      let e = date.getHours();
      let f = date.getMinutes();
      let g = date.getSeconds();
      console.log(d);
      if (x == 1) {
        let time = y-1 + "-" + 12 + "-" + d + " " + e + ":" + f + ":" + g;
        let endtime = y + "-" + x + "-" + b + " " + e + ":" + f + ":" + g;
        this.inDateTime = time;
        this.inDateEnd = endtime;
        localStorage.setItem("inDateTime", this.inDateTime);
        localStorage.setItem("inDateEnd", this.inDateEnd);
      } else {
        let time = y + "-" + m + "-" + d + " " + e + ":" + f + ":" + g;
        let endtime = y + "-" + x + "-" + b + " " + e + ":" + f + ":" + g;
        this.inDateTime = time;
        this.inDateEnd = endtime;
        localStorage.setItem("inDateTime", this.inDateTime);
        localStorage.setItem("inDateEnd", this.inDateEnd);
      }
      /*   let time = y + "-" + m + "-" + d + " " + e + ":" + f + ":" + g;
      let endtime = y + "-" + x + "-" + b + " " + e + ":" + f + ":" + g; 
      this.inDateTime = time;
      this.inDateEnd = endtime;
      localStorage.setItem("inDateTime", this.inDateTime);
      localStorage.setItem("inDateEnd", this.inDateEnd);*/
    },
    search() {
      if (this.dataWay == 1 && this.person == 1) {
        this.serchData.startindate = this.inDateTime;
        this.serchData.endindate = this.inDateEnd;
        this.serchData.endoutdate = "";
        this.serchData.startoutdate = "";
        this.serchData.startbaldate = "";
        this.serchData.endbaldate = "";
        this.serchData.name = this.personText;
        this.serchData.insuNo = "";
        // this.serchData.hospitalName = this.leixingText;
        this.serchData.hospitalId = this.hospitalId;
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 1 && this.person == 2) {
        this.serchData.startindate = this.inDateTime;
        this.serchData.endindate = this.inDateEnd;
        this.serchData.endoutdate = "";
        this.serchData.startoutdate = "";
        this.serchData.startbaldate = "";
        this.serchData.endbaldate = "";
        this.serchData.insuNo = this.personText;
        this.serchData.name = "";
        this.serchData.hospitalId = this.hospitalId;
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 2 && this.person == 1) {
        this.serchData.startoutdate = this.inDateTime;
        this.serchData.endoutdate = this.inDateEnd;
        this.serchData.startbaldate = "";
        this.serchData.endbaldate = "";
        this.serchData.startindate = "";
        this.serchData.endindate = "";
        this.serchData.name = this.personText;
        this.serchData.insuNo = "";
        this.serchData.hospitalId = this.hospitalId;
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 2 && this.person == 2) {
        this.serchData.startoutdate = this.inDateTime;
        this.serchData.endoutdate = this.inDateEnd;
        this.serchData.startbaldate = "";
        this.serchData.endbaldate = "";
        this.serchData.startindate = "";
        this.serchData.endindate = "";
        this.serchData.insuNo = this.personText;
        this.serchData.name = "";
        this.serchData.hospitalId = this.hospitalId;
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 3 && this.person == 1) {
        this.serchData.startbaldate = this.inDateTime;
        this.serchData.endbaldate = this.inDateEnd;
        this.serchData.startindate = "";
        this.serchData.endindate = "";
        this.serchData.endoutdate = "";
        this.serchData.startoutdate = "";
        this.serchData.name = this.personText;
        this.serchData.insuNo = "";
        this.serchData.hospitalId = this.hospitalId;
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 3 && this.person == 2) {
        this.serchData.startbaldate = this.inDateTime;
        this.serchData.endbaldate = this.inDateEnd;
        this.serchData.startindate = "";
        this.serchData.endindate = "";
        this.serchData.endoutdate = "";
        this.serchData.startoutdate = "";
        this.serchData.insuNo = this.personText;
        this.serchData.name = "";
        this.serchData.hospitalId = this.hospitalId;
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      }
      /*this.serchData.hospitalName = this.leixingText;
      this.serchData.sysFlag = this.jishen;
      this.serchData.startindate = this.inDateTime;
      this.serchData.endindate = this.inDateEnd;
      this.serchData.startoutdate = this.inDateTime;
      this.serchData.endoutdate = this.inDateEnd;
      this.serchData.startbaldate = this.inDateTime;
      this.serchData.endbaldate = this.inDateEnd;
      this.serchData.rowNum = 10; */
      this.$emit("serchList", this.serchData);
    },
    jqsearch() {
      if (this.dataWay == 1 && this.person == 1) {
        this.serchData.startindate = this.inDateTime;
        this.serchData.endindate = this.inDateEnd;
        this.serchData.endoutdate = "";
        this.serchData.startoutdate = "";
        this.serchData.startbaldate = "";
        this.serchData.endbaldate = "";
        this.serchData.name = this.personText;
        this.serchData.insuNo = "";
        // this.serchData.hospitalName = this.leixingText;
        this.serchData.hospitalId = localStorage.getItem("othercode");
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 1 && this.person == 2) {
        this.serchData.startindate = this.inDateTime;
        this.serchData.endindate = this.inDateEnd;
        this.serchData.endoutdate = "";
        this.serchData.startoutdate = "";
        this.serchData.startbaldate = "";
        this.serchData.endbaldate = "";
        this.serchData.insuNo = this.personText;
        this.serchData.name = "";
        this.serchData.hospitalId = localStorage.getItem("othercode");
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 2 && this.person == 1) {
        this.serchData.startoutdate = this.inDateTime;
        this.serchData.endoutdate = this.inDateEnd;
        this.serchData.startbaldate = "";
        this.serchData.endbaldate = "";
        this.serchData.startindate = "";
        this.serchData.endindate = "";
        this.serchData.name = this.personText;
        this.serchData.insuNo = "";
        this.serchData.hospitalId = localStorage.getItem("othercode");
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 2 && this.person == 2) {
        this.serchData.startoutdate = this.inDateTime;
        this.serchData.endoutdate = this.inDateEnd;
        this.serchData.startbaldate = "";
        this.serchData.endbaldate = "";
        this.serchData.startindate = "";
        this.serchData.endindate = "";
        this.serchData.insuNo = this.personText;
        this.serchData.name = "";
        this.serchData.hospitalId = localStorage.getItem("othercode");
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 3 && this.person == 1) {
        this.serchData.startbaldate = this.inDateTime;
        this.serchData.endbaldate = this.inDateEnd;
        this.serchData.startindate = "";
        this.serchData.endindate = "";
        this.serchData.endoutdate = "";
        this.serchData.startoutdate = "";
        this.serchData.name = this.personText;
        this.serchData.insuNo = "";
        this.serchData.hospitalId = localStorage.getItem("othercode");
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      } else if (this.dataWay == 3 && this.person == 2) {
        this.serchData.startbaldate = this.inDateTime;
        this.serchData.endbaldate = this.inDateEnd;
        this.serchData.startindate = "";
        this.serchData.endindate = "";
        this.serchData.endoutdate = "";
        this.serchData.startoutdate = "";
        this.serchData.insuNo = this.personText;
        this.serchData.name = "";
        this.serchData.hospitalId = localStorage.getItem("othercode");
        this.serchData.sysFlag = this.jishen;
        this.serchData.rowNum = 10;
        this.serchData.type = this.examineText;
      }
      this.$emit("serchList", this.serchData);
    },
    clear() {
      this.$emit("clear");
      this.leixingText = "";
      this.hospitalId = "";
      this.jishen = "";
      this.personText = "";
      this.examineText = "";
      this.inDateTime = "";
      this.inDateEnd = "";
    },
    /*  clearAll() {
      this.leixingText = null;
      this.dataWay = null;
      this.inDateTime = null;
      this.inDateEnd = null;
      this.jishen = null;
      this.person = null;
      this.personText = null;
      this.examineText = null;
    }, */
    // 展示医院列表信息
    querySearchAsync(queryString, callback) {
      console.log(queryString);
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
              i.value = i.d10102; //将想要展示的数据作为value
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
    /*     createStateFilter(queryString) {
      return state => {
        // console.log(state);
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    }, */
    //展示审核列表
    /*   examinequery(queryString, callback) {
      console.log(queryString)
      var list = [{}];
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatordermsg/listMsgType",
        params: {
          type: this.examineText
        }
       
      })
        .then(res => {
          if (res.data.code == 0 && res.data.data != "") {
            for (let i of res.data.data) {
              value = i; //将想要展示的数据作为value
          
            }
            list = res.data.data;
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
    }, */
    examineFocus() {
      //从后台获取到对象数组
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatordermsg/listMsgType",
        params: {
          // type: this.examineText
          type: ""
        }
        /*   headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      })
        .then(res => {
          if (res.data.code == 0 && res.data.data != "") {
            console.log(res.data.data);
            this.examineList = res.data.data;
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
    examineBlur() {
      this.upShow = false;
    },
    Liactive(val) {
      // console.log(val.path[0].innerHTML);
      this.examineText = val.path[0].innerHTML;
      // this.upShow = false;
    },
    handleSelect(item) {
      console.log(item);
      this.hospitalId = item.d10101;
      // console.log(this.hospitalId)
    },
    hosFocus() {
      if (localStorage.getItem("limited") == 2) {
        this.showhos = true;
        this.allName = false;
        this.hosName = localStorage.getItem("hosName");
        this.all = false;
        this.jqall = true;
      } else {
        this.showhos = false;
        this.allName = true;
        this.all = true;
        this.jqall = false;
      }
    }
  },
  created() {
    // this.showList();
    // this.Pyscode();
    this.getTime();
    this.hosFocus();
  }
};
</script>

<style scoped>
/*通用*/
p {
  font-size: 12px;
  margin: 0;
  padding: 0;
}

.border {
  width: 125%;
  margin-left: -20px;
  height: 1px;
  margin-top: 10px;
  background: #c3d3ed;
}

/*展开*/
.screenHeader {
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: #e8f1ff;
}

.screenHeader p:nth-child(1) {
  width: 50%;
  padding-left: 10px;
  text-align: left;
}

.screenHeader p:nth-child(2) {
  width: 50%;
  text-align: right;
  padding-right: 10px;
}

.screenHeader p:nth-child(3) {
  width: 50%;
  text-align: right;
}

.screenHeader p {
  font-size: 12px;
  line-height: 30px;
  margin: 0;
}

.screenButton {
  width: 15%;
  border: 0;
}

.transition-box {
  width: 80%;
  text-align: center;
  box-sizing: border-box;
  margin-left: 10%;
}

.transition-box p {
  text-align: left;
  padding: 10px 0;
}

.leixingSelect {
  margin-bottom: 10px;
}

.hosptDataSel {
  width: 100%;
}

.shijianlianjie {
  text-align: center !important;
}

.upText {
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
  padding: 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 24px;
}
.Liactive:hover {
  cursor: pointer;
  background-color: #aaaaaa;
}
</style>