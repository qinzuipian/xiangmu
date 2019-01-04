<template>
    <div>
        <div class="main">         
            <div class="tableData" :class="{'content-right-fold': !detailShow}">
                  <div class="right-ctn-title">
                    <el-select style="width: 180px;" v-model="drugname" placeholder="请选择" @change = "getMedicalbook">
                      <el-option
                        v-for="item in drugoptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <span>关键字：</span>
                    <el-input style="width: 180px; height: 30px;" v-model="drug" size="mini"
                                        placeholder="请输入药品名"></el-input>
                    <el-button size="mini" type="primary" @click="getDisease" style="margin-left: 5px;">
                        <!-- <i class="el-icon-search"></i> -->
                        搜索
                    </el-button>  
                </div>
                 <el-table ref="multipleTable" :data="tableData"  @row-click="rowClick" highlight-current-row height="490" border tooltip-effect="dark">
                     <el-table-column prop="name" label="药品名" show-overflow-tooltip>
                     </el-table-column>
                     <el-table-column prop="tradeName" label="商品名" show-overflow-tooltip>
                     </el-table-column>
                     <el-table-column prop="form"  label="剂型" show-overflow-tooltip>
                     </el-table-column>
                     <el-table-column prop="spec"  label="规格" show-overflow-tooltip>
                     </el-table-column>
                     <el-table-column prop="mfr" label="厂商" show-overflow-tooltip>
                     </el-table-column>                
                 </el-table>
                 <div class="block" id="fenye">
                     <el-pagination background layout="total,prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
                     </el-pagination>
                 </div>
            </div>
            <div class="detail" :class="{'content-left-fold': !detailShow}">
                <!-- <i class="el-icon-back btn"></i> -->
                <div v-show="otherShow == 0">
                   <p class="screenButton el-icon-menu" v-show="detailShow" @click="hiddenScreen(1)"></p>
                   <p class="screenButton el-icon-menu" v-show="!detailShow" @click="hiddenScreen(2)"></p>
                   <p class="title">{{drugData.标题}}</p>
                   <ul style="text-align:left;">
                       <li v-for="(item,index) in drugData" :key="index">{{index}}：{{item}}</li>
                   </ul>
                </div>
               <div v-show="otherShow == 1">
                  <p class="screenButton el-icon-menu" v-show="detailShow" @click="hiddenScreen(1)"></p>
                  <p class="screenButton el-icon-menu" v-show="!detailShow" @click="hiddenScreen(2)"></p>
                  <p>抱歉！没有搜索到关于此药品的信息，请输入药品名查询</p>
                  <span>关键字：</span>
                  <el-input style="width: 180px; height: 30px;" v-model="nodrug" size="mini"
                                      placeholder="请输入药品名"></el-input>
                  <el-button size="mini" type="primary" @click="getnodrug" style="margin-left: 5px;">
                      <!-- <i class="el-icon-search"></i> -->
                      搜索
                  </el-button>  
                  <el-table
                    :data="otherData"
                    v-loading="loading"
                    :cell-style="cellStyle"
                    @row-click="NodrugClick"
                    height="200"
                    style="width: 100%">
                    <el-table-column
                      prop="标题"
                      label="">
                    </el-table-column>
                  </el-table>
                  <div v-show = "tinyShow" v-loading = "tinyLoading">
                      <el-button size="mini" type="success" @click="matchDrug" style="margin-top: 5px;">
                          匹配药品信息
                      </el-button>  
                      <p class="title tinyTitle">{{drugData.标题}}</p>
                      <ul style="text-align:left;">
                          <li v-for="(item,index) in drugData" :key="index">{{index}}：{{item}}</li>
                      </ul>
                  </div>
               </div>

            </div>
        </div>
    </div>  
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      drugoptions: [{
          value: 0,
          label: '未匹配药品信息'
        }, {
          value: 1,
          label: '已匹配药品信息'
        }],
      drugname: 1,
      detailShow: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      drug: "",
      flag: false,
      drugData: [],
      otherShow : 0,
      nodrug:"",
      otherData:[],
      tinyShow:false,
      descId:"",
      loading:false,
      tinyLoading:false
    };
  },
  methods: {
    hiddenScreen(j) {
      if (j == 1) {
        let _this = this;
        setTimeout(() => {
          _this.detailShow = !this.detailShow;
        }, 100);
      } else {
        let _this = this;
        setTimeout(() => {
          _this.detailShow = !this.detailShow;
        }, 100);
      }
    },
    //页面初始化
    getMedicalbook(val) {
      console.log(val)
      var val;
      if(val == 0) {
        val = 1;
      } else {
        val = val;
      }
       localStorage.setItem("hometext", "【药品说明书】");
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryMedDrugListInfo",
        params: {
          isExist: this.drugname,
          page: val,
          row: 10
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data;
          this.total = res.data.rowNum;
        } else {
          this.$message.error("请检查网络！");
        }
      });
    },
    //页码发生改变时触发
    handleCurrentChange(val) {
      if (this.flag == true) {
        this.getDisease(val);
      } else {
        this.getMedicalbook(val);
      }
    },
    //搜索
    getDisease(val) {
      this.flag = true;
      console.log(val);
      var rn;
      if (isNaN(val)) {
        rn = 1;
      } else {
        rn = val;
      }
      console.log(rn);
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryMedDrugListInfo",
        params: {
          isExist: this.drugname,
          // isExist: 1,
          page: rn,
          row: 10,
          name: this.drug
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data;
          this.total = res.data.rowNum;
        } else {
          this.$message.error("请检查网络！");
        }
      });
    },
    //点击行事件
    rowClick(row) {
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryMongoDrugInfo",
        params: {
          descId: row.descId
        }
      }).then(res => {
        if (res.data.code == 0) {
          if(res.data.data!="") {
            this.drugData = res.data.data[0];
            //删除json键值与键值对
            var nJson = delete eval(res.data.data[0])._id;
            var nJson = delete eval(res.data.data[0])._class;
            console.log(nJson);
            this.detailShow = true;
            this.otherShow = 0;
          } else {
            this.detailShow = true;
              this.otherShow = 1;
          }
          
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //根据药品名模糊查询为匹配的药品信息
    getnodrug() {
      this.loading = true;
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryMongoDrugInfoByName",
        params: {
          name: this.nodrug
        }
      }).then(res => {
        if (res.data.code == 0) {
           this.loading = false;
          this.otherData = res.data.data;
        } else {
          this.$message.error("请检查网络！");
        }
      }); 
    },
    //样式修改
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if(columnIndex === 0) {
          return "color:blue; font-size: 12px; text-align:center; cursor:pointer;";
      }
    },
    //点击行事件
    NodrugClick(row) {
      this.tinyLoading = true;
      this.descId = row._id;
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/drug/queryMongoDrugInfo",
        params: {
           descId: row._id
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.tinyShow = true;
          this.tinyLoading = false;
          this.drugData = res.data.data[0];
          //删除json键值与键值对
          var nJson = delete eval(res.data.data[0])._id;
          var nJson = delete eval(res.data.data[0])._class;
        } else {
          this.$message.error("请检查网络！");
        }
      }); 
    },
    matchDrug() {
        this.$confirm('确认该药品说明书与所查的药品匹配', '提示', {
          confirmButtonText: '确定匹配',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            method: "post",
            url: axios.PARK_API + "/outpatient/biz/drug/matchMongoDrugInfo",
            params: {
              descId: this.descId,
              name : this.nodrug
            }
          }).then(res => {
            if (res.data.code == 0) {
              this.$message.success('匹配成功！')
            } else {
              this.$message.error("请检查网络！");
            }
        }); 
        }).catch(() => {    
        });
    }
  },
  created() {
    this.getMedicalbook(1);
  }
};
</script>



<style scoped>
.main {
  /* width: 1300px; */
  /* height: 500px; */
  position: relative;
}
.right-ctn-title {
  width: calc(100%-20px);
  text-align: left;
  font-size: 14px;
  padding-left: 20px;
  position: relative;
}

.tableData {
  width: 40%;
  height: 100%;
  /* background-color: #f00; */
}
.detail {
  width: 60%;
  height: 580px;
  overflow-y: scroll;
  /* background-color: #0ff; */
  /* border-left: 1px solid #f00; */
  position: absolute;
  right: 0;
  top: 0;
}
.detail ul {
  font-size: 14px;
}
.content-left-fold {
  width: 3%;
}

.content-right-fold {
  width: 97%;
}
.screenButton {
  padding: 0;
  margin: 0;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 0px;
  left: 0px;
  color: #66b1ff;
}
#fenye {
  background: #c1c1c1;
}

.el-pagination {
  padding: 10px 18px;
  text-align: left;
}
.title {
  font-size: 18px;
  font-weight: 700;
  margin-top: 26px;
}
.tinyTitle  {
margin:0;
}

</style>
