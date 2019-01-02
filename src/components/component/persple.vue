<template>
   <div>
     <div class="top">
        <el-table
            :data="tableData"
            center
            style="width: 100%">
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
            <el-pagination background layout="total,prev, pager, next" @current-change="handlePage" :current-page="currentPage" :total=total>
            </el-pagination>
        </div>
     </div>
   </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
  props: ["tableData", "total", "code"],
  data() {
    return {
      currentPage: 1
    };
  },
  methods: {
    // 表格自定义序列号
    indexMethod(index) {
      return index * 1 + 1;
    },
    handlePage(val) {
      this.$emit("handleCurrentChange",val);
    },
 /*    handleCurrentChange(val) {
      console.log(val);
      axios({
        method: "post",
        url: axios.PARK_API + "/backstage/presonDataList",
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
    }, */
    formatRole: function(row, column) {
      return row.sex == "1" ? "男" : row.sex == "2" ? "女" : "其他";
    }
  }
};
</script>


<style scoped>
#fenye {
  background: #c1c1c1;
}
.el-pagination {
  padding: 10px 18px;
  text-align: left;
}
</style>
