<template>
    <div>
        <div class="right-ctn-title">
            <!-- <span>医院编码:</span> -->
            <el-select v-model="queryend" size="mini" placeholder="请选择">
            <el-option
            v-for="item in endoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>：
            <!-- <el-input style="width: 100px; height: 30px;" size="mini"
                                        placeholder="请输入内容"></el-input> -->
             <el-autocomplete
                  v-model="hospitalText"
                  :fetch-suggestions="queryHosSearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
            ></el-autocomplete>
            <el-button size="mini" type="primary" style="margin-left: 20px;" @click="querySearch">查询</el-button>
            <el-button size="mini" style="margin-left: 5px;" @click="Download">导出</el-button>

            <el-table
                :data="queryData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :header-cell-style="rowClass"
                border
                height="580"
                style="width: 100%">
                <el-table-column
                prop="hospitalName"
                label="医疗机构"
                width="180">
                </el-table-column>
                  <el-table-column
                prop="totalnum"
                label="总人数">
                </el-table-column>
                  <el-table-column
                prop="doubnum"
                label="疑似问题人数">
                </el-table-column>
                <el-table-column
                prop="totalfee"
                label="总费用(元)"
                width="180">
                </el-table-column>
                <el-table-column
                prop="doubfee"
                label="疑似违规金额(元)"
                width="180">
                </el-table-column>
                <el-table-column
                prop="doubper"
                label="疑似问题人占比"
                width="180">
                </el-table-column>
                <el-table-column
                prop="avgfee"
                label="次均费用(元)"
                width="180">
                </el-table-column>
              
            </el-table>
            <div class="block" id="fenye">
                    <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @size-change="dragSizeChange"
                    :total=endtotal>
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
      endoptions: [
        {
          value: "1",
          label: "医院编码"
        },
        {
          value: "2",
          label: "医疗机构"
        }
      ],
      hospitalText: "",
      queryend: "2",
      queryData: [],
      // 一共多少页
      endtotal: 0,
      currentPage: 1,
      pageSize: 12,
      hospitalId: ""
    };
  },
  methods: {
    // 页码改变时去请求数据
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    dragSizeChange(val) {
      this.pageSize = val;
    },
    rowClass({ row, rowIndex }) {
      return "border-bottom:2px solid #ccc;border-top:2px solid #ccc";
    },
    //页面初始化请求数据
    getQuery() {
      localStorage.setItem("hometext", "【住院-审核结果分析】");
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryresultanaly",
        params: {
          regionId: localStorage.getItem("regionId")
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            // console.log(res.data.data);
            this.queryData = res.data.data;
            this.endtotal = this.queryData.length;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
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
    //根据条件查询table表格栏数据
    querySearch() {
      let data = {};
      if (this.queryend == "1") {
        data.hospitalId = this.hospitalText;
        data.regionId = localStorage.getItem("regionId");
      } else if (this.queryend == "2") {
        // data.hospitalId = "";
        // data.hospitalName = this.hospitalText;
        data.hospitalId = this.hospitalId;
        data.regionId = localStorage.getItem("regionId");
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/analy/queryresultanaly",
        params: data
      })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res.data.data);
            this.queryData = res.data.data;
            this.endtotal = this.queryData.length;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },

    //导出excel表格
    Download() {
      // let data = {};
      if (this.queryend == "1" && this.hospitalText != "") {
        location =
          axios.PARK_API +
          "/hospitalization/biz/analy/queryresultanalyExcel?" +
          "hospitalId=" +
          this.hospitalText;
      } else if (this.queryend == "2" && this.hospitalText != "") {
        location =
          axios.PARK_API +
          "/hospitalization/biz/analy/queryresultanalyExcel?" +
          "hospitalId=" +
          this.hospitalId;
      } else {
        location =
          axios.PARK_API +
          "/hospitalization/biz/analy/queryresultanalyExcel?" +
          "regionId=" +
          localStorage.getItem("regionId");
      }

      /*   axios({
        method: "get",
        url:
          axios.PARK_API + "/hospitalization/biz/analy/queryresultanalyExcel",
        // params: data
        // data: data,
        data:{
          hospitalName : this.hospitalText
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {})
        .catch(error => {
          this.$message.error('请检查网络');
        }); */

      /*  location =
        axios.PARK_API +
        "/hospitalization/biz/analy/queryresultanalyExcel?" +
        "regionId=" + localStorage.getItem("regionId");   */
    }
  },
  created() {
    this.getQuery();
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
  width: 100px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 120px;
}
</style>

