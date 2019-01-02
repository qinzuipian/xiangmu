<template>
   <div>
       <div class="right-ctn-title">
            <span>规则名：</span>
            <el-input style="width: 240px; height: 30px;" v-model="rule" @focus="ruleFocus" @blur="ruleBlur" size="mini"
                                      placeholder="请输入内容"></el-input>
            <ul class="upText" v-show="upShow">
              <li class="Liactive" v-for="(it, index) in ruleList" :key="index" @mousedown="Liactive">{{it}}</li>
            </ul>
            <span>违规等级：</span>
            <el-select v-model="illegal" size="mini" placeholder="请选择">
                <el-option
                v-for="item in illegaloptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="hospitalCode" size="mini" placeholder="">
                <el-option
                v-for="item in hospitalCodes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>：
              <el-autocomplete
                  v-model="code"
                  :fetch-suggestions="queryHosSearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
            ></el-autocomplete>
            <!-- <el-input style="width: 100px; height: 30px;" size="mini" v-model="code"
                                      placeholder="请输入内容"></el-input> -->
      
            <span>医院等级：</span>
            <el-select v-model="grade" size="mini" placeholder="请选择">
                <el-option
                v-for="item in gradeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
               <br>
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
          
            <el-button size="mini" type="primary" style="margin-left: 5px;" @click="foulSearch">查询</el-button>
            <el-button size="mini" type="primary" @click="foulClear">重置</el-button>
            <el-button size="mini" @click="foulDownload">导出</el-button>

            <el-table
            :data="foulData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            :header-cell-style="rowClass"
            height="464"
            border
            style="width: 100%">
              <el-table-column
              prop="hospitalGrade"
              label="医院等级"
              width="180">
              </el-table-column>
              <el-table-column
              prop="hospitalName"
              label="医院名称"
              width="180">
              </el-table-column>
              <el-table-column
              prop="message"
              label="规则">
              </el-table-column>
              <el-table-column
              prop="severity"
              label="违规等级">
              </el-table-column>
              <el-table-column
              prop="casenum"
              label="病例数">
              </el-table-column>
              <el-table-column
              prop="examount"
              label="违规金额(元)">
              </el-table-column>
              <el-table-column
              prop="realamount"
              label="实际违规金额">
              </el-table-column>
          </el-table>
          <div class="block" id="fenye">
              <el-pagination
              background
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30]"
              :page-size="pageSize"
              @size-change="foulSizeChange"
              :total=foultotal>
              </el-pagination>
          </div>
      </div>
   </div>

</template>



<script>
import axios from "axios";
export default {
  data() {
    return {
      foulData: [],
      upShow: false,
      ruleList: [],
      hospitalCode: "2",
      hospitalCodes: [
        {
          value: "1",
          label: "医院编码"
        },
        {
          value: "2",
          label: "医疗机构"
        }
      ],
      closingDate: "1",
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
      illegal: "",
      illegaloptions: [
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        },
        {
          value: "5",
          label: "5"
        }
      ],
      grade: "",
      gradeoptions: [
        {
          value: "一级",
          label: "一级医院"
        },
        {
          value: "二级",
          label: "二级医院"
        },
        {
          value: "三级",
          label: "三级医院"
        }
      ],
      rule: "",
      code: "",
      // 一共多少页
      foultotal: 0,
      currentPage: 1,
      pageSize: 12,
      startTime: "",
      endTime: "",
      hospitalId: ""
    };
  },
  methods: {
    // 页码改变时去请求数据
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    foulSizeChange(val) {
      this.pageSize = val;
    },
    rowClass({ row, rowIndex }) {
      return "border-bottom:2px solid #ccc;border-top:2px solid #ccc";
    },
    //页面初始化时请求页面数据
    getFoul() {
      localStorage.setItem("hometext", "【门诊-违规统计】");
      axios({
        method: "post",
        url:
          axios.PARK_API + "/outpatient/biz/analy/queryruleviolationanaly",
        /*  params: {
          message: "疑似重复收取诊察费"
        } */
        data: {
          regionId: localStorage.getItem("regionId")
          // message: "疑似重复收取诊察费"
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            // console.log(res.data.data);
            this.foulData = res.data.data;
            this.foultotal = this.foulData.length;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },

    ruleFocus() {
      //从后台获取到对象数组
      axios({
        method: "post",
        url:
          axios.PARK_API + "/outpatient/biz/rstdatpresmsg/listMsgmessage",
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
            this.ruleList = res.data.data;
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
    ruleBlur() {
      this.upShow = false;
    },
    Liactive(val) {
      // console.log(val.path[0].innerHTML);
      this.rule = val.path[0].innerHTML;
      // this.upShow = false;
    },
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
              if (this.hospitalCode == "1") {
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
    //根据条件查询数据
    foulSearch() {
      let data = {};
      if (this.closingDate == 1 && this.hospitalCode == 1) {
        data.startindate = "";
        data.endindate = "";
        data.startbaldate = this.startTime;
        data.endbaldate = this.endTime;
        // data.hospitalName = "";
        data.hospitalId = this.code;
        data.message = this.rule;
        data.severity = this.illegal;
        data.hospitalGrade = this.grade;
        data.regionId = localStorage.getItem("regionId");
      } else if (this.closingDate == 1 && this.hospitalCode == 2) {
        data.startindate = "";
        data.endindate = "";
        data.startbaldate = this.startTime;
        data.endbaldate = this.endTime;
        // data.hospitalName = this.code;
        data.hospitalId = this.hospitalId;
        data.message = this.rule;
        data.severity = this.illegal;
        data.hospitalGrade = this.grade;
      } else if (this.closingDate == 2 && this.hospitalCode == 1) {
        data.startindate = this.startTime;
        data.endindate = this.endTime;
        data.startbaldate = "";
        data.endbaldate = "";
        // data.hospitalName = "";
        data.hospitalId = this.code;
        data.message = this.rule;
        data.severity = this.illegal;
        data.hospitalGrade = this.grade;
      } else if (this.closingDate == 2 && this.hospitalCode == 2) {
        data.startindate = this.startTime;
        data.endindate = this.endTime;
        data.startbaldate = "";
        data.endbaldate = "";
        data.hospitalId = this.hospitalId;
        // data.hospitalId = "";
        data.message = this.rule;
        data.severity = this.illegal;
        data.hospitalGrade = this.grade;
      } /* else if (this.closingDate == 3 && this.hospitalCode == 1) {
        data.startindate = "";
        data.endindate = "";
        data.endoutdate = this.startTime;
        data.startoutdate = this.endTime;
        data.startbaldate = "";
        data.endbaldate = "";
        data.hospitalId = this.code;
        data.message = this.rule;
        data.severity = this.illegal;
        data.hospitalGrade = this.grade;
      } else if (this.closingDate == 3 && this.hospitalCode == 2) {
        data.startindate = "";
        data.endindate = "";
        data.endoutdate = this.startTime;
        data.startoutdate = this.endTime;
        data.startbaldate = "";
        data.endbaldate = "";
        data.hospitalId = this.hospitalId;
        data.message = this.rule;
        data.severity = this.illegal;
        data.hospitalGrade = this.grade;
      } */
      axios({
        method: "post",
        url:
          axios.PARK_API + "/outpatient/biz/analy/queryruleviolationanaly",
        /*  params: {
          message: "疑似重复收取诊察费"
        } */
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res.data.data);
            this.foulData = res.data.data;
            this.foultotal = this.foulData.length;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    //重置头部输入的数据
    foulClear() {
      this.rule = "";
      this.grade = "";
      this.code = "";
      this.illegal = "";
      this.startTime = "";
      this.endTime = "";
      this.getFoul();
    },
    //导出excel文件
    foulDownload() {
     /*  location =
        axios.PARK_API +
        "/hospitalization/biz/analy/queryruleviolationanalyExcel?" +
        "regionId=" +
        localStorage.getItem("regionId"); */
      if (this.closingDate == 1 && this.hospitalCode == 1) {
        location =
          axios.PARK_API +
          "/outpatient/biz/analy/queryruleviolationanalyExcel?" +
          "startbaldate=" +
          this.startTime +
          "&" +
          "endbaldate=" +
          this.endTime +
        "&" + "hospitalId=" + this.code +
        "&" + "message=" + this.rule+
        "&" + "severity=" + this.illegal+
        "&" + "hospitalGrade=" + this.grade;
      } else if (this.closingDate == 1 && this.hospitalCode == 2) {
        location =
          axios.PARK_API +
          "/outpatient/biz/analy/queryruleviolationanalyExcel?" +
          "startbaldate=" +
          this.startTime +
          "&" +
          "endbaldate=" +
          this.endTime+
        "&" + "hospitalId=" + this.hospitalId+
        "&" + "message=" + this.rule+
        "&" + "severity=" + this.illegal+
        "&" + "hospitalGrade=" + this.grade;
      } else if (this.closingDate == 2 && this.hospitalCode == 1) {
        location =
          axios.PARK_API +
          "/outpatient/biz/analy/queryruleviolationanalyExcel?" +
          "startindate=" +
          this.startTime +
          "&" +
          "endindate=" +
          this.endTime+
        "&" + "hospitalId=" + this.code+
        "&" + "message=" + this.rule+
        "&" + "severity=" + this.illegal+
        "&" + "hospitalGrade==" + this.grade;
      } else if (this.closingDate == 2 && this.hospitalCode == 2) {
        location =
          axios.PARK_API +
          "/outpatient/biz/analy/queryruleviolationanalyExcel?" +
          "startindate=" +
          this.startTime +
          "&" +
          "endindate=" +
          this.endTime+
        "&" + "hospitalId=" + this.hospitalId+
        "&" + "message=" + this.rule+
        "&" + "severity=" + this.illegal+
        "&" + "hospitalGrade=" + this.grade;
      } 
 
    
    }
  },
  created() {
    this.getFoul();
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
#fenye {
  background: #c1c1c1;
}

.el-pagination {
  padding: 10px 18px;
  text-align: left;
}

.el-button + .el-button {
  margin-left: 0;
}
.el-select {
  width: 100px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 124px;
}
.el-autocomplete {
  width: 202px;
}
.upText {
  position: absolute;
  background: #fff;
  left: 6%;
  top: 5%;
  z-index: 999;
  width: 240px;
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

