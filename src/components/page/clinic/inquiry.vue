<template>
    <div class="content">

        <div class="leftContent" :class="{'content-left-fold': !screenOpen}">
            <clinicScreen v-on:hiddenScreen="hiddenScreen" v-on:serchList="serchList" v-on:clear="clear"></clinicScreen>
        </div>
        <div class="rightContent" :class="{'content-right-fold': !screenOpen}">
            <div class="top">
                <div class="left-bck">
                    <ul>
                        <li :class="{'active': leftBck == 0}" @click="leftBck = 0">住院信息</li>
                        <li :class="{'active': leftBck == 1}" @click="leftBck = 1">明细视图</li>
                        <li :class="{'active': leftBck == 2}" @click="leftBck = 2">费用明细</li>
                    </ul>
                </div>
                <div class="right-ctn">
                    <div v-show="leftBck == 0">
                            <div class="right-ctn-title">
                            <!-- <span>批量处理:</span> -->
                            <el-radio v-model="piliangRadio" label="1">通过</el-radio>
                            <el-radio v-model="piliangRadio" label="2">不通过</el-radio>
                            <!-- <el-radio v-model="piliangRadio" @change="checkSelect" label="3">质询</el-radio> -->
                          <!--  <span v-show="remarkShow">
                               <span style="margin-left: 40px;">备注:</span>
                               <el-input style="width: 100px; height: 30px;" v-model="piliangbeizhu" size="mini" placeholder="请输入内容"></el-input>
                           </span> -->
                            <!-- <span>方式:</span>
                            <el-select v-model="fangshi"   size="mini" placeholder="请选择">
                                <el-option v-for="item in fangshiOption" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                            <el-button size="mini" type="primary" style="margin-left: 10px;" @click="piliangSubmit">保存</el-button>
                        </div>
                        <el-table
                                ref="multipleTable"
                                :data="inquirylist"
                                highlight-current-row
                                height="460"
                                border
                                tooltip-effect="dark"
                                style="width: 100%"
                                @row-click="rowClick"
                                @cell-click="showReply"
                                 @selection-change="selectThisItem"
                                :cell-style="cellStyle">
                               <el-table-column
                              type="index"
                              width="50">
                               <template slot-scope="scope"><span>{{scope.$index+(iqrn - 1) * 10 + 1}} </span></template>
                            </el-table-column>
                            <el-table-column ref="quanxuan" type="selection" width="55">
                            </el-table-column>
                             <el-table-column
                                    prop="reply"
                                    label="查看回复"
                                    width="90"
                                    show-overflow-tooltip>
                            <template slot-scope="scope">
                                 <i class="el-icon-bell red" v-if="mes"></i>
                                <span>查看回复</span>
                            </template>
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="姓名">
                            </el-table-column>
                            <el-table-column
                                    prop="age"
                                    label="年龄"
                                    width="50px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="sysFlag"
                                    label="机审结果"
                                    show-overflow-tooltip>
                            </el-table-column>
                             <el-table-column
                                    prop="status"
                                    label="当前状态"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <!-- <el-table-column
                                    prop="auditFlag"
                                    label="审核结果"
                                    show-overflow-tooltip>
                            </el-table-column> -->
                             <el-table-column
                                    prop="diagnose"
                                    label="诊断"
                                    width="160px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            
                            <el-table-column
                                    prop="patientNo"
                                    label="患者号"
                                     width="160px"
                                    show-overflow-tooltip>
                            </el-table-column>
                              <el-table-column
                                    prop="presId"
                                    label="就诊号"
                                     width="160px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="insuNo"
                                    label="医保号"
                                     width="160px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="hospitalName"
                                    label="医院名称"
                                     width="160px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="hospitalGrade"
                                    label="医院等级"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="deptName"
                                    label="门诊科室"
                                    width="120px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="icd10"
                                    label="诊断编码"
                                    show-overflow-tooltip>
                            </el-table-column>
                           
                            <el-table-column
                                    prop="presDateTime"
                                    label="处方日期"
                                     width="100px"
                                      :formatter="dateFormat"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="balDate"
                                    label="结算日期"
                                      width="100px"
                                       :formatter="dateFormat"
                                    show-overflow-tooltip>
                            </el-table-column>

                          
                        </el-table>


                        <div class="block" id="fenye">
                            <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    @current-change="handleCurrentChange"
                                    :total=total>
                            </el-pagination>
                        </div>
                    </div>
                    <div v-show="leftBck == 1">
                      <div class="topView">
                            <div class="dataView">
                                <span>患者：{{viewTopList.name}}</span>
                                <span>性别：{{viewTopList.gender}}</span>
                                <span>年龄：{{viewTopList.age}}</span>
                                <span> 诊断：{{viewTopList.diagonseName}}</span>
                                <span>总费用：{{viewTopList.totalFee}}</span>
                                <span>处方日期：{{viewTopList.presDateTime | formatDate}}</span>
                                <span>结算日期：{{viewTopList.balDate | formatDate}}</span>
                            </div>
                            <span class="special">异常信息：<i>■</i></span>
                        </div>
                      <div class="database">
                            <table border="1">
                              <tr>
                                <th>项目名称</th>
                                <th>小计(元)</th>
                                <th v-for="(item,index) in dateList" :key="index">{{item}}</th>
                              </tr>
                              <tr v-for="(item,index) in viewbotList" :key="index">
                                <td>{{item.itemname}}</td>
                                <td>{{item.amount}}</td>
                                <!-- <td v-for="(item,index) in isData" :key="index">{{item.shuzi}}</td> -->
                                <td class="tdclass" v-for="(item,index) in item.map" :key="index">{{item}}</td>
                              </tr>
                            </table>
                             <span class="noMsg" v-show="viewbotList.length == 0">暂无数据</span>
                      </div>
                    </div>
                    <div v-show="leftBck == 2">
                         <div class="right-ctn-title">
                            
                            <span>项目类型:</span>
                            <el-select v-model="itemtype" size="mini" placeholder="请选择">
                                <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <span style="margin-left: 40px;">项目名称:</span>
                            <el-input style="width: 190px; height: 30px;" v-model="itemSearch" @focus="itemFocus" @blur="itemBlur" size="mini" placeholder="请输入内容"></el-input>
                              <ul class="upText" v-show="upShow">
                                  <li class="Liactive" v-for="(it, index) in itemListAll" :key="index" @mousedown="Liactive">{{it}}</li>
                              </ul>
                            <el-button size="mini"  style="margin-left: 40px;" @click="searchTable">查询</el-button>
                            <el-button size="mini"  type="primary"  v-show="btnshow" @click="plusTable">合并列表</el-button>
                            <el-button size="mini"  type="primary" v-show="cancel" @click="cancelTable">取消合并</el-button>

                        </div>

                       <div v-show="tableShow">
                          <!-- <i class="el-icon-circle-plus plus"  @click="plusTable"></i> -->
                          <el-table ref="multipleTable" :data="moneyDataList.slice((dragPage-1)*pageSize,dragPage*pageSize)" height="460" :header-cell-style="rowClass"  border tooltip-effect="dark" style="width: 100%">
                            <el-table-column prop="thirdName" label="项目名称" width="140px" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="thirdForm" label="项目剂型" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="itemType" label="项目类型" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="type" label="医嘱类型" show-overflow-tooltip>
                            </el-table-column>
                          <!--   <el-table-column prop="docName" label="医生姓名">
                            </el-table-column> -->
                            <el-table-column prop="price" label="单价" width="50px" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="quantity" label="数量" width="50px" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="amount" label="金额" width="60px;" show-overflow-tooltip>
                                <template slot-scope="scope">
                                  <span>{{scope.row.amount-0 | rounding}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="spec" label="规格" width="80px;" show-overflow-tooltip>
                            </el-table-column>

                            <el-table-column prop="selfProportion" label="自费比例"  show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="pack" label="包装含量值" width="100px" show-overflow-tooltip>
                              <template slot-scope="scope">
                                  <span>{{scope.row.pack-0 | rounding}}</span>
                                </template>
                            </el-table-column>

                          
                            <!-- <el-table-column prop="firstExecuteTime" label="首次执行日期" :formatter="dateFormat"  width="120px;" show-overflow-tooltip>
                            </el-table-column> -->
                            <el-table-column prop="startDate" label="开始日期" :formatter="dateFormat" show-overflow-tooltip>
                            </el-table-column>
                           <!--  <el-table-column prop="endTime" label="结束日期" :formatter="dateFormat" show-overflow-tooltip>
                            </el-table-column> -->
                          </el-table>
                          <div class="block" id="fenye">
                              <el-pagination
                                      background
                                      layout="total,prev, pager, next"
                                      @size-change="dragSizeChange"
                                      @current-change="dragCurrentChange"
                                      :current-page="dragPage"
                                      :page-sizes="[10, 20, 30]"
                                      :page-size="pageSize"
                                      :total=dragtotal>
                              </el-pagination>
                          </div>
                       </div>
                       <div v-show="hebingShow">
                          <!-- <i class="el-icon-remove remove"  @click="removeTable"></i> -->
                                <el-table ref="multipleTable" :header-cell-style="rowClass" :data="plusDataList.slice((dragPage-1)*pageSize,dragPage*pageSize)" height="460" border tooltip-effect="dark" style="width: 100%">
                                    <el-table-column prop="itemName"  label="项目名称" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column prop="itemType" label="项目类型" show-overflow-tooltip>
                                    </el-table-column>
                                   
                                    <!-- <el-table-column prop="itemCode" label="医嘱类型" show-overflow-tooltip>
                                    </el-table-column> -->
                    
                                    <el-table-column prop="price" label="单价" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column prop="quantity" label="数量" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column prop="amount" label="金额" show-overflow-tooltip>
                                    </el-table-column>
    
                                </el-table>
                                  <div class="block" id="fenye">
                                      <el-pagination
                                              background
                                              layout="total,prev, pager, next"
                                              @size-change="dragSizeChange"
                                              @current-change="dragCurrentChange"
                                              :current-page="dragPage"
                                              :page-sizes="[10, 20, 30]"
                                              :page-size="pageSize"
                                              :total=plustotal>
                                      </el-pagination>
                                  </div>
                       </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="bottom-left">
                    <div class="bom-left-title">
                        <div>审核情况</div>
                        <div :class="{'bom-left-title-div-active': leftStatus == 0}">审核</div>
                        <div :class="{'bom-left-title-div-active': leftStatus == 1}">质询</div>
                        <div :class="{'bom-left-title-div-active': leftStatus == 2}">复审</div>
                        <img src="/static/img/next.png" style="right: 122px;" alt="">
                        <img src="/static/img/next.png" style="right: 51px;" alt="">
                    </div>
                    <span class="noMsg" v-show="inquirydata.length == 0">暂无数据</span>
                    <div class="bom-content" v-show="hasMsg">
                       <!--  <p>
                            <el-button size="mini" @click="dialogFormVisible = true">查看回复</el-button>
                        </p> -->
                        <div class="exAmount">
                            <div class="exOther">
                                <span>姓名: {{viewLeftList.name}}</span><br>
                                <span>西药费: {{viewLeftList.medicineFee-0 |rounding}}</span><br>
                                <span>中成药: {{viewLeftList.tcmFee -0 |rounding}}</span><br>
                                <span>中草药: {{viewLeftList.herbFee -0 |rounding}}</span><br>
                                <span>病例总金额: {{viewLeftList.totalFee-0 |rounding}}</span><br>
                                <span>统筹支付费: {{viewLeftList.effectFee -0 |rounding}}</span><br>
                            </div>
                            <div class="exOther">
                              <span>检查费: {{viewLeftList.inspectionFee -0 |rounding}}</span><br>
                              <span>治疗费: {{viewLeftList.treatmentFee -0 |rounding}}</span><br>
                              <span>护理费: {{viewLeftList.nursingFee -0 |rounding}}</span><br>
                              <span>医疗服务: {{viewLeftList.servicefee -0 |rounding}}</span><br>
                              <span>存疑金额: {{viewLeftList.exAmount -0 |rounding}}</span><br>
                              <!-- <span>扣款总金额: {{deduction}}</span>                  -->
                               
                            </div>
                            <div class="exOther">
                              <span>化验费: {{viewLeftList.laboratoryFee -0 |rounding}}</span><br>
                              <span>床位费: {{viewLeftList.bedFee -0 |rounding}}</span><br>
                              <span>材料费: {{viewLeftList.materialFee -0 |rounding}}</span><br>
                              <span>手术费: {{viewLeftList.operatefee -0 |rounding}}</span><br>               
                              <span>大额费用: {{viewLeftList.largeFee -0 |rounding}}</span> 
                            </div>
                          
                        </div>
                        <br>
                        <br>
                        <br>
                        <br>
                        <div class="beizhu">
                            <p style="">备注:</p>
                            <el-input
                                    style="width: 80%;margin-right: 5%;"
                                    type="textarea"
                                    autosize
                                    placeholder="请输入备注内容"
                                    v-model="remark">
                            </el-input>
                        </div>
                        <el-button @click="submit(1)" style="margin-top: 20px;" type="success" size="mini">确认</el-button>
                        <el-button @click="reset" style="margin-top: 20px;margin-left: 80px;" type="danger" size="mini">
                            重置
                        </el-button>
                    </div>
                </div>

                <div class="bottom-right"  v-show="tdshow">
                    <el-table
                            :data="inquirydata"
                            :cell-style="showStyle"
                             @cell-click="showDrug"
                            height="250"
                            border
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                height="100"
                                show-overflow-tooltip
                                :index="indexMethod">
                        </el-table-column>
                        <el-table-column
                                prop="itemName"
                                height="100"
                                show-overflow-tooltip
                                label="项目名称">
                        </el-table-column>
                        <el-table-column
                                prop="source"
                                height="100"
                                show-overflow-tooltip
                                label="来源">
                        </el-table-column>
                        <el-table-column
                                prop="message"
                                show-overflow-tooltip
                                height="100"
                                label="异常信息">
                        </el-table-column>
                        <el-table-column
                                prop="severity"
                                show-overflow-tooltip
                                height="100"
                                label="异常等级">
                        </el-table-column>
                        <el-table-column
                                prop="type"
                                show-overflow-tooltip
                                height="100"
                                label="审核类型">
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog v-if="dialogFormVisible" title="疑问回复" :visible.sync="dialogFormVisible" width="80%" top="10px">
                    <clinicReply :copystatusmsg="inquirydata" :childMsgData="childMsgData" :presId="presId" :userType="user"
                           v-on:hiddenReply="hiddenReply" v-on:getUEContent="getUEContent" v-on:getInquiry="getInquiry" v-on:fileSubmit="fileSubmit"></clinicReply>
                </el-dialog>
                 <el-dialog title="" v-if='drugVisible' :visible.sync="drugVisible" width="80%" top="10px">
                    <drugshow :dragText="dragMsg"></drugshow>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
import clinicScreen from "../../component/clinicScreen";
import clinicReply from "../../component/clinicReply";
import drugshow from "../../component/drugshow";
import axios from "axios";

let moment = require("moment");
export default {
  name: "inquiry",
  data() {
    return {
      mes: false,
      screenOpen: true,
      leftBck: 0,
      // 一共多少页
      total: null,
      inquirylist: [],
      inquirydata: [],
      iqrn: 1,
      remark: "",
      piliangRadio: "1",
      name: "",
      presId: "",
      statusMsg: {},
      copyStatusMsg: "",
      dialogFormVisible: false,
      childMsg: [],
      childMsgData: {},
      //左下角显示审核的进展状态
      leftStatus: 1,
      //审核情况费用明细
      viewLeftList: [],
      drugVisible: false,
      // 上传文件
      fileName: [],
      filePath: [],
      //明细视图top个人住院信息
      viewTopList: [],
      //明细视图bottom明细视图部分
      viewbotList: [],
      dateList: [],
      isdateList: [],
      isData: [],
      //收费明细传递的数据
      moneyDataList: [],
      itemtype: "",
      typeOption: [
        {
          value: 1,
          label: "药品"
        },
        {
          value: 2,
          label: "服务"
        },
        {
          value: 3,
          label: "材料"
        }
      ],
      itemList: [],
      itemListAll: [],
      //合并收费明细
      plusDataList: [],
      itemSearch: "",
      plustotal: 0,
      upShow: false,
      btnshow: true,
      cancel: false,
      //合并费用明细表格
      tableShow: true,
      hebingShow: false,
      code: "",
      //收费明细列表页数
      dragtotal: 0,
      dragPage: 1,
      pageSize: 10,
      user: 1,
      hospitalName: "",
      hasMsg: false,
      tdshow: false,
      //是否为清除状态
      isClear: false,
      // 是否为搜索状态
      isSearch: false,
      piliangIdList: [],
      usercode: "",
      username: ""
    };
  },
  watch: {
    itemSearch() {
      if (this.itemSearch != "") {
        let arr = [];
        var reg = new RegExp(this.itemSearch, "g");
        for (let i = 0; i <= this.itemList.length; i++) {
          if (this.itemList[i].match(reg) != null) {
            arr.push(this.itemList[i]);
            this.itemListAll = arr;
          }
        }
      } else {
      }
    }
  },
  filters: {
    rounding(value) {
      if (!isNaN(value)) {
        return value.toFixed(2);
      } else {
        return 0;
      }
    },
    formatDate: function(val) {
      if (val != undefined) {
        var value = new Date(val);
        var year = value.getFullYear();
        var month = value.getMonth() + 1;
        var day = value.getDate();
        return year + "-" + month + "-" + day;
      } else {
        return "";
      }
    }
  },
  methods: {
    hiddenScreen() {
      this.screenOpen = !this.screenOpen;
    },

    getUEContent(content) {
      this.submit(2, content);
      this.hiddenReply();
    },

    hiddenReply() {
      this.dialogFormVisible = false;
    },

    // 复选框的操作示例
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    indexMethod(index) {
      return index * 1;
    },

    // 页面初始化请求数据
    getInquiry(rn) {
      localStorage.setItem("hometext", "【门诊-质询】");
      if (localStorage.getItem("limited") == 1) {
        this.user = 1;
        // this.operShow = true;
      } else if (localStorage.getItem("limited") == 2) {
        this.user = 2;
        this.hospitalName = localStorage.getItem("othercode");
        // this.operShow = false;
      }

      let data = {};
      if (this.isClear == true) {
        data.rn = rn;
        data.rowNum = 10;
        data.auditFlagArray = [0, 3];
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalName;
        data.statusArray = [1, 2];
        /*  data.startbaldate= localStorage.getItem("inDateTime");
        data.endbaldate= localStorage.getItem("inDateEnd"); */
      } else {
        data.rn = rn;
        data.rowNum = 10;
        data.auditFlagArray = [0, 3];
        data.regionId = localStorage.getItem("regionId");
        data.hospitalId = this.hospitalName;
        data.startbaldate = localStorage.getItem("inDateTime");
        data.endbaldate = localStorage.getItem("inDateEnd");
        data.statusArray = [1, 2];
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpres/list",
        /*  data: {
          rn: rn,
          rowNum: 10,
          auditFlagArray: [3],
          hospitalId: this.hospitalName,
          regionId: localStorage.getItem("regionId"),
          startbaldate: localStorage.getItem("inDateTime"),
          endbaldate: localStorage.getItem("inDateEnd")
        } */
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.inquirylist = res.data.page.list;
            this.total = res.data.page.totalPage * 10;
            // console.log(res.data.page.list)
            for (var i = 0; i < this.inquirylist.length; i++) {
              this.inquirylist[i].reply = "查看回复";
              // 机审结果的判断
              switch (this.inquirylist[i].sysFlag) {
                case 1:
                  this.inquirylist[i].sysFlag = "通过";
                  break;
                case 2:
                  this.inquirylist[i].sysFlag = "不通过";
                  break;
                case 3:
                  this.inquirylist[i].sysFlag = "待确定";
                  break;
                default:
                  this.inquirylist[i].sysFlag = "数据错误";
                  break;
              }

              // 审核结果的判断
              switch (this.inquirylist[i].auditFlag) {
                case 0:
                  this.inquirylist[i].auditFlag = "待审核";
                  break;
                case 3:
                  this.inquirylist[i].auditFlag = "质询";
                  break;
                default:
                  this.inquirylist[i].auditFlag = "数据错误";
                  break;
              }

              // 审核状态的判断
              switch (this.inquirylist[i].status) {
                case 0:
                  this.inquirylist[i].status = "待审核";
                  break;
                case 1:
                  this.inquirylist[i].status = "质询中";
                  break;
                case 2:
                  // this.inquirylist[i].status = "审核中";
                  this.inquirylist[i].status = "质询中";
                  break;
                case 3:
                  this.inquirylist[i].status = "复审中";
                  break;
                default:
                  this.inquirylist[i].status = "锁定";
              }
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.$message.error("请检查网络");
        });
    },

    selectThisItem(val) {
      console.log(val);
      this.piliangIdList = [];
      for (let i = 0; i < val.length; i++) {
        let obj = {};
        obj.presId = val[i].presId;
        this.piliangIdList.push(obj);
      }
    },
    // 批量修改提交
    piliangSubmit() {
      if (this.piliangIdList == "") {
        this.$message.warning("提交数据不能为空！");
      } else {
        if (this.piliangRadio == 0) {
          this.dangqianzhuangtai = "0";
        } else if (this.piliangRadio == 1 || this.piliangRadio == 2) {
          this.dangqianzhuangtai = "3";
          axios({
            method: "post",
            url: axios.PARK_API + "/outpatient/biz/rstdatpres/batchUpdate",
            data: {
              list: this.piliangIdList,
              auditFlag: parseInt(this.piliangRadio),
              auditUser: 123,
              // remark: this.piliangbeizhu,
              // description: this.piliangbeizhu,
              status: parseInt(this.dangqianzhuangtai)
            },
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                // this.gitHospitlaMsg();
              } else {
                this.$message.error("提交数据失败！");
              }
            })
            .catch(error => {
              this.$message.error("请检查网络");
            });
        }
      }
    },

    // 点击表格行触发
    rowClick(row) {
      this.presId = row.presId;
      // this.getStatus();
      this.getTable();
      this.viewLeft();
      this.clinicViewtop();
      this.clinicViewlist();
      this.clinicMoneylist();
      this.name = row.name;
      this.hasMsg = true;
      this.tdshow = true;
    },
    //门诊审核明细视图top个人信息展示
    clinicViewtop() {
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpres/diagonseinfo",
        /* params: {
          orderId: this.orderId
        } */
        data: {
          presId: this.presId,
          presnolist: [1]
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.viewTopList = res.data.bizDatOrder[0];
            // this.viewTopList.totalFee.toFixed(2)

            // console.log(this.viewTopList);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    //门诊审核明细视图列表视图列表
    clinicViewlist() {
      this.isData = [];
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/rstdatpresmsg/listMsgTimeView",
        params: {
          presId: this.presId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            // this.viewbotList = res.data.data.rstMsgFeeList;
            this.dateList = res.data.data.datelist;
            this.viewbotList = res.data.data.listvo;
            // this.isdateList = res.data.data.listvo.list;
            // this.isdateList = this.dateList;
            // console.log(this.viewbotList);
            for (let i = 0; i < this.viewbotList.length; i++) {
              this.isData = this.viewbotList[i].list;
              console.log(this.isData);
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    //门诊收费明细列表查询
    clinicMoneylist() {
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpresitem/queryInfoById",
        /* params: {
          orderId: this.orderId,
          code: 1
        }, */
        data: {
          presId: this.presId,
          code: 1
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.moneyDataList = res.data.data;
            this.dragtotal = this.moneyDataList.length;
            // console.log(this.dragtotal)
            for (var i = 0; i < this.moneyDataList.length; i++) {
              switch (this.moneyDataList[i].itemType) {
                case 1:
                  this.moneyDataList[i].itemType = "药品";
                  break;
                case 2:
                  this.moneyDataList[i].itemType = "服务";
                  break;
                case 3:
                  this.moneyDataList[i].itemType = "材料";
                  break;
                default:
                  this.hostpitalList[i].sysFlag = "数据错误";
                  break;
              }
            }
            // console.log(res);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    itemFocus() {
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpresitem/queryItemName",
        params: {
          presId: this.presId
        }
        /*  data: {
          orderId: this.orderId,
          code: 1
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      })
        .then(res => {
          if (res.data.code == 0) {
            this.itemListAll = res.data.data;
            this.itemList = this.itemListAll;
            this.upShow = true;
            console.log(this.itemList);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    itemBlur() {
      this.upShow = false;
    },
    Liactive(val) {
      console.log(val.path[0].innerHTML);
      this.itemSearch = val.path[0].innerHTML;
      this.upShow = false;
    },
    searchTable() {
      if (this.hebingShow == true) {
        this.code = 2;
      } else {
        this.code = 1;
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpresitem/queryInfoById",
        data: {
          presId: this.presId,
          code: this.code,
          // code: 1,
          itemtype: this.itemtype,
          itemname: this.itemSearch
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.moneyDataList = res.data.data;
            this.dragtotal = this.moneyDataList.length;
            //合并表格之后的数据
            this.plusDataList = res.data.data;
            this.plustotal = this.plusDataList.length;
            // console.log(this.dragtotal)
            for (var i = 0; i < this.moneyDataList.length; i++) {
              switch (this.moneyDataList[i].itemType) {
                case 1:
                  this.moneyDataList[i].itemType = "药品";
                  break;
                case 2:
                  this.moneyDataList[i].itemType = "服务";
                  break;
                case 3:
                  this.moneyDataList[i].itemType = "材料";
                  break;
                default:
                  this.hostpitalList[i].sysFlag = "数据错误";
                  break;
              }
            }
            // console.log(res);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    //合并收费明细列表表格
    plusTable() {
      this.cancel = true;
      this.btnshow = false;
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpresitem/queryInfoById",
        data: {
          presId: this.presId,
          code: 2,
          itemtype: this.itemtype,
          itemname: this.itemSearch
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.tableShow = false;
            this.hebingShow = true;
            this.plusDataList = res.data.data;
            this.plustotal = this.plusDataList.length;
            // console.log(this.dragtotal)
            for (var i = 0; i < this.plusDataList.length; i++) {
              switch (this.plusDataList[i].itemType) {
                case 1:
                  this.plusDataList[i].itemType = "药品";
                  break;
                case 2:
                  this.plusDataList[i].itemType = "服务";
                  break;
                case 3:
                  this.plusDataList[i].itemType = "材料";
                  break;
                default:
                  this.plusDataList[i].sysFlag = "数据错误";
                  break;
              }
            }
            // console.log(res);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    cancelTable() {
      this.cancel = false;
      this.btnshow = true;
      this.tableShow = true;
      this.hebingShow = false;
      this.searchTable();
    },
    //页面请求
    dragCurrentChange(val) {
      this.dragPage = val;
      /* console.log(val)
        this.moneyList(val) */
    },
    dragSizeChange(val) {
      this.pageSize = val;
    },
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    /*  getStatus() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatorder/info",
        params: {
          presId: this.presId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.statusMsg = res.data.rstDatOrder;
            this.copyStatusMsg = res.data.rstDatOrder.sysFlag + "";
            this.statusMsg.sysFlag = this.statusMsg.sysFlag + "";

            // 判断左下角 当前这条数据的进程 以及如果是质询状态则关闭 通过和不通过的按钮
            switch (this.statusMsg.status) {
              case 0:
                this.leftStatus = 0;
                break;
              case 1:
                this.leftStatus = 1;
                break;
              case 2:
                this.leftStatus = 0;
                break;
              case 3:
                this.leftStatus = 2;
                break;
              default:
                this.leftStatus = 3;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    }, */
    //审核情况费用明细
    viewLeft() {
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpres/info",
        params: {
          presId: this.presId
        }
        /*   data: {
          orderId: this.orderId,
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      })
        .then(res => {
          if (res.data.code == 0) {
            this.viewLeftList = res.data.bizDatPres;
            // this.viewTopList.totalFee.toFixed(2)

            console.log(this.viewLeftList);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    // 获取下部table表格框内容
    getTable() {
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/rstdatpresmsg/list",
        params: {
          presId: this.presId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.inquirydata = res.data.page.list;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    // 查询回复弹出框
    showReply(row, column) {
      if (column.property == "reply") {
        axios({
          method: "post",
          url: axios.PARK_API + "/outpatient/biz/rstdatreply/selectmessage",
          params: {
            presId: row.presId
          }
        })
          .then(res => {
            if (res.data.code == 0) {
              // console.log(res);
              //给子组件的数据 初始化
              this.childMsg = this.inquirydata;
              this.childMsgData.status = row.status;

              // 附件列表
              this.childMsgData.attlist = res.data.map.attlist;
              // 给每一项附件新增一个downloadUrl属性
              for (let i = 0; i < res.data.map.attlist.length; i++) {
                this.childMsgData.attlist[i].downloadUrl =
                  axios.PARK_API +
                  "/outpatient/biz/rstdatreply/download?" +
                  "presId=" +
                  row.presId +
                  "&" +
                  "fileName=" +
                  this.childMsgData.attlist[i].filename;
              }

              //回复消息
              this.childMsgData.rstDatReplyEntity =
                res.data.map.rstDatReplyEntityList;

              // 子组件的开关
              this.dialogFormVisible = true;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            // this.$message.error('请检查网络');
          });

        // console.log(this.childMsg);
        // console.log(this.childMsgData);
      }
    },

    // 页码改变时去请求数据
    handleCurrentChange(val) {
      this.iqrn = val;
      console.log(val);
      localStorage.setItem("rn", val);
      if (this.isSearch == true) {
        this.serchList(this.serchData, val);
      } else {
        this.getInquiry(val);
      }
    },
    //table栏标题框的样式
    rowClass({ row, rowIndex }) {
      return "border-bottom:2px solid #ccc;border-top:2px solid #ccc";
    },
    // 指定查看回复这一列的样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      /*  if (columnIndex === 2) {
        //指定坐标
        return "color:blue; font-size: 12px; cursor:pointer;";
      }  */ /*  else {
        return "";
      } */
      if (row.sysFlag == "通过" && columnIndex === 5) {
        return "background:rgba(0,255,0,0.3);";
        //  return "color:rgba(0,255,0);";
      } else if (row.sysFlag == "不通过" && columnIndex === 5) {
        return "background:rgba(255,0,0,0.3);";
        //  return "color:rgba(255,0,0,0.8);";
      } else if (row.sysFlag == "待确定" && columnIndex === 5) {
        return "background:rgba(255,165,0,0.3)";
        //  return "color:rgba(255,165,0)";
      }

      if (row.replyStatus == 0 && columnIndex === 2) {
        return "color:blue; font-size: 12px; cursor:pointer;";
      } else if (row.replyStatus == 1 && columnIndex === 2) {
        return "color:red; font-size: 12px; cursor:pointer; background-image:url(./static/img/score.jpg); background-repeat:no-repeat;background-size:12%; background-position:70% 29%;";
      }
    },
    // 药品说明书样式修改
    showStyle({ row, column, rowIndex, columnIndex }) {
      /*  console.log(row);
                console.log(rowIndex);
                console.log(column)
                console.log(columnIndex) */

      if (row.drugId != undefined && row.drugId != 0 && columnIndex === 1) {
        //指定坐标
        return "color:blue; font-size: 12px; cursor:pointer;";
      } else {
        return "";
      }
    },
    // 右下角table栏的弹出框药品说明书的显示与隐藏
    showDrug(row, column) {
      // console.log(row, column);
      if (row.drugId == undefined || row.drugId == 0) {
        this.drugVisible = false;

        // this.$message("此项不属于药品");
      } else {
        if (column.property == "itemName" && row.itemName != undefined) {
          axios({
            method: "post",
            url: axios.PARK_API + "/outpatient/biz/drug/querydrug",
            params: {
              // itemCode: row.itemCode
              drugId: row.drugId
            }
          })
            .then(res => {
              if (res.data.code == 0) {
                console.log(res.data.data);
                this.dragMsg = res.data.data;
                //console.log(res.data.data.slice(3));
                this.drugVisible = true;
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              //this.$message.error('请检查网络');
            });
        }
      }
      /* if (column.property == "amount") {
        console.log("ok");
      } */
    },

    // 附件提交
    fileSubmit(file, content) {
      this.fileName = file.fileName;
      this.filePath = file.filePath;
      this.submit(2, content);
    },
    // 提交回复
    /* submit(content) {
      var data;
      if (this.fileName.length > 0 && this.filePath.length > 0) {
        data = JSON.stringify({
          presId: this.presId,
          description: content,
          usercode: localStorage.getItem("othercode"),
          username: localStorage.getItem("hosName"),
          userType: "1",
          fileName: this.fileName,
          filePath: this.filePath,
          auditFlag: 0,
          status: 2
        });
      } else {
        data = JSON.stringify({
          presId: this.presId,
          description: content,
          usercode: "1",
          username: "1",
          userType: "1",
          fileName: [],
          filePath: [],
          auditFlag: 0,
          status: 2
        });
      }

      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/rstdatreply/savemessage",
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({ message: "提交成功", type: "success" });
            this.getInquiry(1);
            // 关闭回复框
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    }, */

    submit(type, content) {
      console.log(content);
      var data;
      if (localStorage.getItem("limited") == 1) {
        this.usercode = localStorage.getItem("mainUser");
        this.username = "经办单位";
      } else if (localStorage.getItem("limited") == 2) {
        this.usercode = localStorage.getItem("hosuser");
        this.username = localStorage.getItem("hosName");
      }
      if (this.fileName.length > 0 && this.filePath.length > 0) {
        data = JSON.stringify({
          presId: this.presId,
          description: content,
          /*  usercode: localStorage.getItem("hosuser"),
          username: localStorage.getItem("hosName"), */
          usercode: this.usercode,
          username: this.username,
          userType: "1",
          fileName: this.fileName,
          filePath: this.filePath,
          auditFlag: 0,
          status: 2
        });
      } else {
        /*  data = JSON.stringify({
          orderId: this.orderId,
          description: this.remark,
          usercode: localStorage.getItem("othercode"),
          username: localStorage.getItem("hosName"),
          userType: "1",
          fileName: [],
          filePath: [],
          auditFlag: 0,
          status: 2
        }); */

        if (type == 2 && this.content != "") {
          data = JSON.stringify({
            presId: this.presId,
            description: content,
            /* usercode: localStorage.getItem("hosuser"),
            username: localStorage.getItem("hosName"), */
            usercode: this.usercode,
            username: this.username,
            userType: "1",
            fileName: this.fileName,
            filePath: this.filePath,
            auditFlag: 0,
            status: 2
          });
        } else if (type == 2 && this.content == "") {
          data = JSON.stringify({
            presId: this.presId,
            // description: content,
            /*  usercode: localStorage.getItem("hosuser"),
            username: localStorage.getItem("hosName"), */
            usercode: this.usercode,
            username: this.username,
            userType: "1",
            fileName: this.fileName,
            filePath: this.filePath,
            auditFlag: 0,
            status: 2
          });
        } else if (type == 1 && this.remark != "") {
          data = JSON.stringify({
            presId: this.presId,
            description: this.remark,
            /* usercode: localStorage.getItem("hosuser"),
            username: localStorage.getItem("hosName"), */
            usercode: this.usercode,
            username: this.username,
            userType: "1",
            fileName: [],
            filePath: [],
            auditFlag: 0,
            status: 2
          });
        } else if (type == 1 && this.remark == "") {
          data = JSON.stringify({
            presId: this.presId,
            // description: this.remark,
            /*  usercode: localStorage.getItem("hosuser"),
            username: localStorage.getItem("hosName"), */
            usercode: this.usercode,
            username: this.username,
            userType: "1",
            fileName: [],
            filePath: [],
            auditFlag: 0,
            status: 2
          });
        }
      }

      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/rstdatreply/savemessage",
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({ message: "提交成功", type: "success" });
            // this.getInquiry(rn);
            // 关闭回复框
            this.dialogFormVisible = false;
            this.remark = "";
            this.hasMsg = false;
            this.tdshow = false;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    // 重置按钮
    reset() {
      this.statusMsg.sysFlag = this.copyStatusMsg;
      this.remark = "";
    },
    //搜索结果
    serchList(serchData, val) {
      this.isSearch = true;
      this.serchData = serchData;
      serchData.auditFlagArray = [0, 3];
      serchData.regionId = localStorage.getItem("regionId");
      serchData.statusArray = [1, 2];
      if (val) {
        this.serchData.rn = val;
      } else {
        this.serchData.rn = 1;
      }

      /*   if (localStorage.getItem("limited") == 1) {
        console.log("clinic");
      } else if (localStorage.getItem("limited") == 2) {
        this.serchData.hospitalName = localStorage.getItem("othercode");
        console.log("hospital");
      } */
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpres/list",
        data: this.serchData,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.total = res.data.page.totalPage * 10;
            this.inquirylist = res.data.page.list;
            for (let i = 0; i < this.inquirylist.length; i++) {
              this.inquirylist[i].reply = "查看回复";
              this.inquirylist[i].paixuId = i;
              // 机审结果的判断
              switch (this.inquirylist[i].sysFlag) {
                case 1:
                  this.inquirylist[i].sysFlag = "通过";
                  break;
                case 2:
                  this.inquirylist[i].sysFlag = "不通过";
                  break;
                case 3:
                  this.inquirylist[i].sysFlag = "待确定";
                  break;
                default:
                  this.inquirylist[i].sysFlag = "数据错误";
                  break;
              }

              // 审核结果的判断
              //auditFlag:审核结果，0：空（默认），1：通过，2：不通过，3：挂起，4：调查
              switch (this.inquirylist[i].auditFlag) {
                case 0:
                  this.inquirylist[i].auditFlag = "待审核";
                  break;
                case 3:
                  this.inquirylist[i].auditFlag = "质询";
                  break;
                default:
                  // 当通过或者不通过时候  不应该在这个列表中  所以为数据错误
                  this.inquirylist[i].auditFlag = "数据错误";
                  break;
              }

              // 审核状态的判断
              // status:  0：待审核，1：质询中，2：审核中，3：复审中，4：待锁定，5：锁定
              switch (this.inquirylist[i].status) {
                case 0:
                  this.inquirylist[i].status = "待审核";
                  break;
                case 1:
                  this.inquirylist[i].status = "质询中";
                  break;
                case 2:
                  this.inquirylist[i].status = "质询中";
                  // this.inquirylist[i].status = "审核中";
                  break;
                case 3:
                  this.inquirylist[i].status = "复审中";
                  break;
                default:
                  this.inquirylist[i].status = "锁定";
              }
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.$message.error("请检查网络");
        });
    },
    clear() {
      this.isClear = true;
      this.getInquiry(1);
    }
  },
  created() {
    this.getInquiry(1);
  },
  components: {
    clinicScreen,
    drugshow,
    clinicReply
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  display: flex;
  justify-content: space-around;
  overflow: hidden;
}

.leftContent {
  width: 15%;
}

.rightContent {
  width: 85%;
}

.content-left-fold {
  width: 2%;
}

.content-right-fold {
  width: 98%;
}

.top {
  display: flex;
  width: 100%;
}

.left-bck {
  width: 40px;
  height: 548px;
  background: #e8f1ff;
}

.left-bck ul {
  padding-left: 18px;
}

.left-bck ul li {
  list-style: none;
  font-size: 12px;
  text-align: center;
  width: 20px;
  border: 1px solid #c3d3ed;
  margin-bottom: 15px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  line-height: 17px;
  padding: 2px 0;
  cursor: pointer;
}

.active {
  background: white;
}

#fenye {
  background: #c1c1c1;
}

.el-pagination {
  padding: 10px 18px;
  text-align: left;
}

.right-ctn {
  width: calc(100% - 40px);
}

.right-ctn-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: left;
  padding-left: 20px;
  position: relative;
}

.right-ctn-title span {
  font-size: 14px;
  line-height: 40px;
}

.el-radio {
  font-weight: normal;
  margin-left: 5px;
}

/*bottom视图*/

.bottom {
  border-top: 10px solid #e8f1ff;
  display: flex;
  text-align: center;
}

.bottom-left {
  width: 40%;
  height: 300px;
  border-left: 5px solid #e8f1ff;
  border-right: 2px solid #e8f1ff;
}

.noMsg {
  color: rgb(144, 147, 153);
  font-size: 14px;
  line-height: 250px;
}

.bom-left-title {
  width: 100%;
  background: #e8f1ff;
  height: 30px;
  position: relative;
  border-bottom: 1px solid #c3d3ed;
}

.bom-left-title div {
  font-size: 12px;
  position: absolute;
  line-height: 29px;
  padding: 0 5px;
}

.bom-left-title div:nth-child(1) {
  left: 10px;
  background: white;
  border: 1px solid #c3d3ed;
  border-bottom-color: white;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.bom-left-title div:nth-child(2) {
  right: 150px;
  background: #b5b5b5;
  border-radius: 4px;
  color: white;
}

.bom-left-title div:nth-child(3) {
  right: 80px;
  background: #b5b5b5;
  border-radius: 4px;
  color: white;
}

.bom-left-title div:nth-child(4) {
  right: 10px;
  background: #b5b5b5;
  border-radius: 4px;
  color: white;
}

.bom-left-title-div-active {
  background: #f47b1d !important;
}

.bom-left-title img {
  position: absolute;
  width: 20px;
  top: 5px;
}

.beizhu {
  display: flex;
  justify-content: space-around;
}

.beizhu p {
  margin: 6px 0 0 10px;
  width: 10%;
}

.bottom-right {
  width: 60%;
}

.exAmount {
  height: 50px;
  /*  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  text-align: left; */
}
.exAmount .exOther {
  /* width: 150px; */
  text-align: left;
  float: left;
}

.exAmount span {
  font-size: 13px;
  text-align: left;
  margin-left: 20px;
  color: #606266;
}

.right-ctn .topView {
  width: 100%;
  height: 100px;
  background-color: #eee;
  position: relative;
}
.topView .special {
  position: absolute;
  bottom: 0;
  right: 30px;
  font-size: 14px;
}
.topView .special i {
  font-size: 26px;
  color: #f00;
}

.right-ctn .topView .dataView {
  position: absolute;
  bottom: 0;
  left: 10px;
  font-size: 14px;
}

.right-ctn .topView .dataView span {
  margin-left: 10px;
}
.right-ctn .database {
  width: 1000px;
  white-space: nowrap;
  /* position: relative; */
  overflow: auto;
}
.right-ctn .database table {
  border-collapse: collapse;
  border: 1px solid #aaa;
  color: #606266;
}
.right-ctn .database table .tdclass {
  color: #f00;
  font-size: 22px;
}
.upText {
  position: absolute;
  background: #fff;
  left: 36%;
  top: 72%;
  z-index: 999;
  width: 196px;
  height: 200px;
  overflow: auto;
  margin-top: 10px;
  padding: 0;
  text-align: left;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
/* ::-webkit-scrollbar {
  display: none;
} */
.upText li {
  font-size: 12px;
  margin-bottom: 2px;
  color: #606266;
  padding: 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 26px;
}
.Liactive:hover {
  cursor: pointer;
  background-color: #aaaaaa;
}
.red {
  color: #f00;
}
</style>

