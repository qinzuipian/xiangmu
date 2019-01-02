<template>
    <div>
        <div class="right-ctn-title">
             <span>参合年度:</span>
            <el-date-picker
            v-model="yearVal"
            type="year"
            value-format="yyyy"
            placeholder="选择年">
            </el-date-picker>
            <el-button size="mini" type="success" style="margin-left: 20px;" @click="searchData">
                <i class="el-icon-search"></i>
                查询
            </el-button>
          
        </div>
          <el-table
                :data="queryData"
                v-loading="loading"
                element-loading-text="拼命加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :header-cell-style="rowClass"
                border
                height="480"
                style="width: 100%">
                <el-table-column ref="quanxuan" type="selection"  width="55">
                </el-table-column>
                <el-table-column
                prop="name"
                label="区县"
                width="180">
                </el-table-column>
                  <el-table-column
                prop="pvalue"
                label="参合人数（人）">
                </el-table-column>
                  <el-table-column
                prop="chl"
                label="参合率">
                </el-table-column>
                <el-table-column
                prop="chb"
                label="与上一年度参合比"
                width="180">
                </el-table-column>
               <el-table-column
                 fixed="right"
                 label="操作"
                 width="120">
                 <template slot-scope="scope">
                   <el-button @click="lookDetail(scope.row)" type="text" size="small">查看下级统计</el-button>
                 </template>
               </el-table-column>                      
            </el-table>
    </div>

</template>



<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      yearVal: "",
      queryData: [],
      // 一共多少页
      endtotal: 0,
      currentPage: 1,
      pageSize: 12,
      hospitalId: "",
      level: 6,
      loading: true
    };
  },
  methods: {
    rowClass({ row, rowIndex }) {
      return "border-bottom:2px solid #ccc;border-top:2px solid #ccc";
    },
    getYearlist() {
      this.yearVal = new Date();
    },
    //页面初始化请求数据
    getQuery() {
      localStorage.setItem("hometext", "【参合情况分析】");
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/chqkfxDataList",
        data: qs.stringify({
          level: this.level,
          // year: this.yearVal
          year: this.yearVal
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      })
        .then(res => {
          // console.log(res.data.data);
          this.loading = false;
          this.queryData = res.data.rows;
          // this.endtotal = res.data.total;
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    //操作查看下一级
    lookDetail(row, parameter) {
      console.log(row, parameter);
      this.loading = true;
      if (this.level == 6) {
        this.level = 9;
      } else if (this.level == 9) {
        this.level = 12;
      } else if (this.level == 12) {
        this.$message.warning("已经是最后一级了");
        this.loading = false;
        return;
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/xnhidc/backstage/chqkfxDataList",
        data: qs.stringify({
          level: this.level,
          aeracode: row.areaCode,
          // year: this.yearVal
          year: 2018,
          rows: 20,
          page: 1
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(res => {
        this.loading = false;
        this.queryData = res.data.rows;
      });
    },
    searchData() {
      if (this.yearVal != "") {
        this.loading = true;
        axios({
          method: "post",
          url: axios.PARK_API + "/xnhidc/backstage/chqkfxDataList",
          data: qs.stringify({
            level: this.level,
            year: this.yearVal
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).then(res => {
          this.loading = false;
          this.queryData = res.data.rows;
        });
      } else {
        this.$message.warning('参合年度不能为空！')
      }
    }
  },
  created() {
    this.getQuery();
    // this.getYearlist();
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
</style>

