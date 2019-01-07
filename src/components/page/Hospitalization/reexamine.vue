<template>
    <div class="content">

        <div class="leftContent" :class="{'content-left-fold': !screenOpen}">
            <screen v-on:hiddenScreen="hiddenScreen" v-on:serchList="serchList" v-on:clear="clear"></screen>
        </div>
        <div class="rightContent" :class="{'content-right-fold': !screenOpen}">
            <div class="top">
                <div class="left-bck">
                    <ul>
                        <li :class="{'active': leftBck == 0}" @click="leftBck = 0">住院信息</li>
                        <li :class="{'active': leftBck == 1}" @click="leftBck = 1">明细视图</li>
                        <li :class="{'active': leftBck == 2}" @click="leftBck = 2">收费明细</li>
                    </ul>
                </div>
                <div class="right-ctn">
                    <div v-show="leftBck == 0">
                        <div class="right-ctn-title">
                            <span>批量处理:</span>
                            <el-radio v-model="diagRadio" label="1">同意</el-radio>
                            <el-radio v-model="diagRadio" label="0">驳回</el-radio>
                            <!--  <span style="margin-left: 40px;">备注:</span>
                             <el-input style="width: 100px; height: 30px;" v-model="diagremark" size="mini"
                                       placeholder="请输入内容"></el-input> -->
                            <span>方式:</span>
                            <el-select v-model="fangshi" size="mini" @change="methodSelect" placeholder="请选择">
                                <el-option
                                        v-for="item in fangshiOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button size="mini" style="margin-left: 40px;" @click="diagSubmit" v-show="handShow">保存</el-button>
                            <el-button type="primary" size="mini" style="margin-left: 40px;" @click="factorSubmit" v-show="factorShow">保存</el-button>
                        </div>
                        <el-table
                                ref="multipleTable"
                                highlight-current-row
                                :data="inquirylist"
                                height="460"
                                border
                                tooltip-effect="dark"
                                style="width: 100%"
                                @row-click="rowClick"
                                @select-all="isPiliang"
                                @cell-click="chakanhuifu"
                                :cell-style="cellStyle"
                                :header-cell-style="rowClass"
                                @select="isPiliang"
                                @selection-change="selectThisItem">
                            <el-table-column
                              type="index"
                              width="50">
                              <template slot-scope="scope"><span>{{scope.$index+(rern - 1) * 10 + 1}} </span></template>
                            </el-table-column>
                            <el-table-column
                                    ref="quanxuan"
                                    type="selection"
                                    :selectable='checkboxInit'
                                    width="55">
                            </el-table-column>
                             <el-table-column
                                    prop="reply"
                                    label="查看回复"
                                    style="color: blue;"
                                    show-overflow-tooltip>
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
                                    prop="gender"
                                    label="性别"
                                     width="50px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="sysFlag"
                                    label="机审结果"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="auditFlag"
                                    label="审核结果"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    label="当前状态"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="dianame" label="诊断" width="160px" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="daynum" label="天数" width="50" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="inDate"
                                    label="入院日期"
                                     width="100px"
                                     :formatter="dateFormat"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="outDate"
                                    label="出院日期"
                                    :formatter="dateFormat"
                                     width="100px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="balDate"
                                    label="结算日期"
                                    :formatter="dateFormat"
                                     width="100px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="insuNo"
                                    label="医保号"
                                    width="140px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="orderIdHis"
                                    label="住院号"
                                    width="100px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <!-- <el-table-column
                                    prop="orderId"
                                    label="就诊号"
                                    show-overflow-tooltip>
                            </el-table-column> -->
                            <el-table-column
                                    prop="reimbNo"
                                    label="合疗登记号"
                                    width="110px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="hospitalName"
                                    label="医院名字"
                                    width="160px"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="hospitalId"
                                    label="医院编码"
                                     width="200px"
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
                                  <span>入院时间：{{viewTopList.inDate | formatDate}}</span>
                                  <span>出院时间：{{viewTopList.outDate | formatDate}}</span>
                              </div>
                               <span class="special">异常信息：<i>■</i></span>
                        </div>

                         <div class="database">
                          
                           <!--  <el-table ref="multipleTable" :data="viewbotList"  border tooltip-effect="dark">
                                <el-table-column prop="itemname" label="项目名称"></el-table-column>

                                <el-table-column prop="amount" label="小计(元)" show-overflow-tooltip></el-table-column>

                                <el-table-column v-for="(item,index) in dateList" :key="index"  :label="item">
                                </el-table-column>
                                
                            </el-table> -->
                   
                         
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
                            <el-input style="width: 196px; height: 30px;" v-model="itemSearch" @focus="itemFocus" @blur="itemBlur" size="mini" placeholder="请输入内容"></el-input>
                              <ul class="upText" v-show="upShow">
                                  <li class="Liactive" v-for="(it, index) in itemListAll" :key="index" @mousedown="Liactive">{{it}}</li>
                              </ul>
                            <el-button size="mini"  style="margin-left: 40px;" @click="searchTable">查询</el-button>
                            <el-button size="mini"  type="primary"  v-show="btnshow" @click="plusTable">合并列表</el-button>
                            <el-button size="mini"  type="primary" v-show="cancel" @click="cancelTable">取消合并</el-button>

                        </div>
                         <div v-show="tableShow">
                          <!-- <i class="el-icon-circle-plus plus"  @click="plusTable"></i> -->
                          <el-table ref="multipleTable" :header-cell-style="rowClass" :data="moneyDataList.slice((dragPage-1)*pageSize,dragPage*pageSize)" height="460"  border tooltip-effect="dark" style="width: 100%">
                            <el-table-column prop="thirdName" label="项目名称" width="140px" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="thirdForm" label="项目剂型" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="itemType" label="项目类型" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="type" label="医嘱类型" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="docName" label="医生姓名">
                            </el-table-column>

                            <el-table-column prop="price" label="单价" width="50px" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="quantity" label="数量" width="50px" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="amount" label="金额"  show-overflow-tooltip>
                               <template slot-scope="scope">
                                  <span>{{scope.row.amount-0 | rounding}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="spec" label="规格" show-overflow-tooltip>
                            </el-table-column>

                            <el-table-column prop="selfProportion" label="自费比例"  show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="pack" label="包装含量值" width="100px;" show-overflow-tooltip>
                               <template slot-scope="scope">
                                  <span>{{scope.row.pack-0 | rounding}}</span>
                                </template>
                            </el-table-column>

                           <!--  <el-table-column prop="groupNo" label="组号" show-overflow-tooltip>
                            </el-table-column> -->
                            <el-table-column prop="firstExecuteTime" label="首次执行日期" :formatter="dateFormat"  width="120px;" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="startTime" label="开始日期" :formatter="dateFormat" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="endTime" label="结束日期" :formatter="dateFormat" show-overflow-tooltip>
                            </el-table-column>

                          </el-table>
                          <div class="block" id="fenye">
                              <el-pagination
                                      background
                                      layout="prev, pager, next"
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
                                              layout="prev, pager, next"
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
                        <div>审核</div>
                        <div>质询</div>
                        <div>复审</div>
                        <img src="/static/img/next.png" style="right: 122px;" alt="">
                        <img src="/static/img/next.png" style="right: 51px;" alt="">
                    </div>
                    <div class="bom-content" v-show="hasMsg">
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
                              <span>扣款总金额: {{deduction}}</span>                 
                               
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
                        <p>审核结果:</p>
                        <el-radio v-show="!isClinic" v-model="reradio" label="1">同意</el-radio>
                        <el-radio v-show="!isClinic" v-model="reradio" label="0">驳回</el-radio>
                        <el-radio v-show="isClinic" disabled>同意</el-radio>
                        <el-radio v-show="isClinic" disabled>驳回</el-radio>
                        <!-- <el-radio v-model="statusMsg.sysFlag" label="3">质询</el-radio> -->
                       <!--  <p>
                            <el-button size="mini" @click="dialogFormVisible = true">查看回复</el-button>
                        </p> -->
                        <!-- <div class="beizhu">
                            <p style="">备注:</p>
                            <el-input
                                    style="width: 80%;margin-right: 5%;"
                                    type="textarea"
                                    autosize
                                    placeholder="请输入备注内容"
                                    v-model="remark">
                            </el-input>
                        </div> -->
                        <br>
                        <el-button @click="submit(1)" style="margin-top: 20px;" type="success" size="mini">确认
                        </el-button>
                        <!--<el-button @click="reset" style="margin-top: 20px;margin-left: 80px;" type="danger" size="mini">重置</el-button>-->
                    </div>
                    <span class="noMsg" v-show="inquirydata.length == 0">暂无数据</span>

                </div>
                <div class="bottom-right" v-show="tashow">
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
                          <el-table-column prop="itemName" height="100" show-overflow-tooltip label="项目名称">
                        </el-table-column>
                         <el-table-column prop="type" show-overflow-tooltip height="100" label="审核类型">
                        </el-table-column>
                        <el-table-column prop="message" show-overflow-tooltip height="100" label="异常信息">
                        </el-table-column>
                          <el-table-column prop="amount" show-overflow-tooltip height="100" label="总费用">
                        </el-table-column>
                        <el-table-column prop="sum" show-overflow-tooltip height="100" label="异常个数">
                        </el-table-column>
                        <el-table-column prop="severity" show-overflow-tooltip height="100" label="异常等级">
                        </el-table-column> 
                         <el-table-column prop="exam" :formatter="formatexam" show-overflow-tooltip height="100" width="76" label="扣款金额">
                        </el-table-column>     
                         <el-table-column
                          fixed="right"
                          label="审核扣款"
                          width="120">
                          <template slot-scope="scope">
                            <el-button @click="showDetail(scope.row)" type="text" size="small" class="cutmoney">扣款</el-button>
                            <el-button @click="deleteDetail(scope.row)" type="text" size="small">取消扣款</el-button>
                          </template>
                        </el-table-column>                   
                    </el-table>
                </div>
                <el-dialog title="疑问回复" :visible.sync="dialogFormVisible" width="80%" top="10px">
                    <reply :copystatusmsg="inquirydata" :childMsgData="childMsgData" :orderId="orderId" :userType="3"
                           v-on:hiddenReply="hiddenReply" v-on:agree="agree" v-on:reject="reject"></reply>
                </el-dialog>

                 <el-dialog title="" v-if='drugVisible' :visible.sync="drugVisible" width="80%"
                           top="10px">
                    <drugshow :dragText="dragMsg"></drugshow>
                </el-dialog>
                  <el-dialog title="审核扣款" v-if='addVisible' :visible.sync="addVisible" width="36%" top="60px">
                    <addData :addText="otherMsg" :orderId="orderId" :tdId ="tdId" :deduction ="deduction" v-on:hiddenadd="hiddenadd" v-on:getdeduction="getdeduction" v-on:getErrMsg = "getTable"></addData>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import screen from "../../component/screen";
import reply from "../../component/reply";
import drugshow from "../../component/drugshow";
import addData from "../../component/addData";
import axios from "axios";
let moment = require("moment");
export default {
  name: "reexamine",
  data() {
    return {
      screenOpen: true,
      leftBck: 0,
      // 一共多少页
      total: 0,
      rern: 1,
      //收费明细列表页数
      dragtotal: 0,
      dragPage: 1,
      pageSize: 10,
      btnshow: true,
      cancel: false,
      inquirylist: [],
      inquirydata: [],
      diagRadio: "1",
      remark: "",
      diagremark: "",
      fangshi: 2,
      currentstatus: 0,
      reradio: "1",
      // 是否点击列表
      hasMsg: false,
      tashow: false,
      fangshiOption: [
        {
          value: 1,
          label: "按条件选"
        },
        {
          value: 2,
          label: "按手选"
        }
      ],
      piliangIdList: [],
      orderId: "",
      isClinic: false,
      current: 0,
      nocurrent: "",
      restatus: "",
      statusMsg: {},
      copyStatusMsg: "",
      dialogFormVisible: false,
      childMsgData: {},

      piliangAuditFlag: 0,
      piliangStatus: 0,
      // 是否为搜索状态
      isSearch: false,
      //是否为清除状态
      isClear: false,
      //收费明细传递的数据
      upShow: false,
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
      //合并费用明细表格
      tableShow: true,
      hebingShow: false,
      code: "",
      //明细视图top个人住院信息
      viewTopList: [],
      //审核情况费用明细
      viewLeftList: [],
      //明细视图bottom明细视图部分
      viewbotList: [],
      dateList: [],
      isdateList: [],
      isData: [],
      //药品说明书
      drugVisible: false,
      //扣款金额
      deduction: "",
      otherMsg: [],
      addVisible: false,
      tdId: "",
      factorShow: false,
      handShow: true
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
      var value = new Date(val);
      var year = value.getFullYear();
      var month = value.getMonth() + 1;
      var day = value.getDate();
      return year + "-" + month + "-" + day;
    }
  },
  methods: {
    hiddenScreen() {
      this.screenOpen = !this.screenOpen;
    },

    // 头部保存提交查询
    diagSubmit() {
      if (this.piliangIdList == "") {
        this.$message.error("提交数据不能为空！");
      } else {
        if (this.diagRadio == 1) {
          this.current = "5";
          this.piliangAuditFlag = 4;
          this.piliangStatus = 5;
        } else if (this.diagRadio == 0) {
          this.current = "2";
          this.nocurrent = "驳回";
          this.piliangAuditFlag = 0;
          this.piliangStatus = 0;
        }
        axios({
          method: "post",
          url: axios.PARK_API + "/hospitalization/biz/rstdatorder/batchUpdate",
          data: {
            list: this.piliangIdList,
            auditFlag: parseInt(this.piliangAuditFlag),
            auditUser: 123,
            status: parseInt(this.piliangStatus),
            reviewStatus: this.nocurrent
          },
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({ message: "提交成功", type: "success" });
              // this.getInquiry(1);
            } else {
              this.$message.error("提交数据失败！");
            }
          })
          .catch(error => {
            // this.$message.error('请检查网络');
          });
      }
    },

    //按条件保存提交
    factorSubmit() {
      if (this.isSearch == true) {
        this.$confirm("此操作将提交所有符合条件的数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.serchList(this.serchData);
            if (this.diagRadio == 1) {
              this.current = "5";
              /*this.piliangAuditFlag = 4;
                this.piliangStatus = 5; */
              this.serchData.auditFlag = 4;
              this.serchData.status = 5;
              this.serchData.auditUser = 123;
            } else if (this.diagRadio == 0) {
              this.current = "2";
              /* this.nocurrent = "驳回";
                this.piliangAuditFlag = 0;
                this.piliangStatus = 0; */
              this.serchData.auditFlag = 0;
              this.serchData.status = 0;
              this.serchData.auditUser = 123;
              this.serchData.reviewStatus = "驳回";
            }
            axios({
              method: "post",
              url:
                axios.PARK_API + "/hospitalization/biz/rstdatorder/allUpdate",
              /*   data: {
          list: this.piliangIdList,
          auditFlag: parseInt(this.piliangAuditFlag),
          auditUser: 123,
          status: parseInt(this.piliangStatus),
          reviewStatus: this.nocurrent
        }, */
              data: this.serchData,
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({ message: "提交成功", type: "success" });
                  // this.getInquiry(1);
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(error => {
                // this.$message.error('请检查网络');
              });
          })
          .catch(() => {
            /*  this.$message({
              type: "info",
              message: "已取消提交"
            }); */
          });
      }
    },

    //判断当前方式的选择
    methodSelect(val) {
      if (val == 1) {
        this.factorShow = true;
        this.handShow = false;
        /*  this.hostpitalList.forEach(item => {
          console.log(item);
          this.$refs.multipleTable.toggleRowSelection(item, true);
            console.log(this.$refs.multipleTable.toggleRowSelection(item, true));
        }); */
      } else {
        this.factorShow = false;
        this.handShow = true;
      }
    },
    //表格前的禁选
    checkboxInit() {
      if (this.fangshi == 1) {
        //你需要判断的条件
        return 0; //不可勾选
      } else {
        return 1; //可勾选
      }
    },
    // 批量选择
    isPiliang(selection, row) {
      if (this.fangshi == 1) {
        /* this.$message.error("请先选择批量修改模式");
        this.$refs.multipleTable.clearSelection(); */
      }
    },
    // 批量选择
    selectThisItem(val) {
      this.piliangIdList = [];
      for (let i = 0; i < val.length; i++) {
        let obj = {};
        obj.orderId = val[i].orderId;
        this.piliangIdList.push(obj);
      }
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
      return index * 1 + 1;
    },

    // 页面初始化请求数据
    getInquiry(rn) {
      localStorage.setItem("hometext", "【住院-复审】");
      var rnx;
      if (!rn) {
        if (window.localStorage.getItem("rn")) {
          rnx = window.localStorage.getItem("rn");
          this.currentPage = parseInt(rnx);
        } else {
          rnx = 1;
        }
      } else {
        rnx = rn;
      }

      let data = {};
      if (this.isClear == true) {
        data.rn = rnx;
        data.rowNum = 10;
        data.auditFlagArray = [1, 2];
        data.regionId = localStorage.getItem("regionId");
        /*  data.startbaldate= localStorage.getItem("inDateTime");
        data.endbaldate= localStorage.getItem("inDateEnd"); */
      } else {
        data.rn = rnx;
        data.rowNum = 10;
        data.auditFlagArray = [1, 2];
        data.regionId = localStorage.getItem("regionId");
        data.startbaldate = localStorage.getItem("inDateTime");
        data.endbaldate = localStorage.getItem("inDateEnd");
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/bizdatorder/list",
        /* data: {
          rn: rnx,
          rowNum: 10,
          auditFlagArray: [1, 2],
          regionId: localStorage.getItem("regionId"),
          startbaldate : localStorage.getItem("inDateTime"),
          endbaldate :localStorage.getItem("inDateEnd")
        }, */
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.inquirylist = res.data.page.list;
            this.total = res.data.page.totalPage * 10;
            // console.log(res.data.page.totalPage)
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
                case 1:
                  this.inquirylist[i].auditFlag = "通过";
                  break;
                case 2:
                  this.inquirylist[i].auditFlag = "不通过";
                  break;
                default:
                  this.inquirylist[i].auditFlag = "数据错误";
                  break;
              }

              // 审核状态的判断
              switch (this.inquirylist[i].status) {
                case 0:
                  this.isClinic = false;
                  this.leftStatus = 0;
                  this.inquirylist[i].status = "待审核";
                  break;
                case 1:
                  this.isClinic = true;
                  this.leftStatus = 1;
                  this.inquirylist[i].status = "质询中";
                  break;
                case 2:
                  this.isClinic = false;
                  this.leftStatus = 0;
                  this.inquirylist[i].status = "审核中";
                  break;
                case 3:
                  this.isClinic = false;
                  this.leftStatus = 2;
                  this.inquirylist[i].status = "复审中";
                  break;
                default:
                  this.isClinic = false;
                  this.leftStatus = 3;
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

    //搜索结果
    serchList(serchData, val) {
      this.isSearch = true;
      this.serchData = serchData;
      serchData.auditFlagArray = [1, 2];
      serchData.regionId = localStorage.getItem("regionId");
      if (val) {
        this.serchData.rn = val;
      } else {
        this.serchData.rn = 1;
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/bizdatorder/list",
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
                case 1:
                  this.inquirylist[i].auditFlag = "通过";
                  break;
                case 2:
                  this.inquirylist[i].auditFlag = "不通过";
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
                  this.inquirylist[i].status = "审核中";
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
    //清除搜索结果
    clear() {
      this.isClear = true;
      this.getInquiry(1);
    },
    chakanhuifu(row, column) {
      if (column.property == "reply") {
        this.showReply(row);
      }
    },
    // 查询回复弹出框
    showReply(row) {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatreply/selectmessage",
        params: {
          orderId: row.orderId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res);

            //给子组件的数据 初始化
            this.childMsg = this.inquirydata;
            this.childMsgData.status = row.status;

            // 附件列表
            this.childMsgData.attlist = res.data.map.attlist;
            // 给每一项附件新增一个downloadUrl属性
            for (let i = 0; i < res.data.map.attlist.length; i++) {
              this.childMsgData.attlist[i].downloadUrl =
                axios.PARK_API +
                "/hospitalization/biz/rstdatreply/download?" +
                "orderId=" +
                row.orderId +
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
    },

    // 富文本编辑器点击确认  默认为质询状态   只修改备注信息  content为富文本编辑器中的纯文本内容
    // getUEContent(content) {
    //     this.submit(2, content);
    //     this.hiddenReply();
    // },

    hiddenReply() {
      this.dialogFormVisible = false;
    },
    hiddenadd() {
      this.addVisible = false;
    },
    // 页面质询表格查询
    getData() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatordermsg/listMsg",
        params: {
          orderId: this.orderId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.inquirydata = res.data.list;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    // 点击表格行触发
    rowClick(row) {
      //   alert("ok");

      this.orderId = row.orderId;
      this.getIndex = row.index;
      this.hasMsg = true;
      this.tashow = true;
      this.getStatus();
      this.getTable();
      this.name = row.name;
      //收费列表查询
      this.moneyList();
      //   明细视图查询
      this.viewList();
      // 明细视图顶部个人信息查询
      this.viewTop();
      //左下角扣款金额的显示
      this.getdeduction();
      //审核情况费用明细
      this.viewLeft();
    },
    //左下角扣款金额的显示
    getdeduction() {
      axios({
        method: "post",
        url:
          axios.PARK_API +
          "/hospitalization/biz/rstdatorderchargeback/queryrealamount",
        params: {
          orderId: this.orderId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.deduction = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    getStatus() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatorder/info",
        params: {
          orderId: this.orderId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.hasMsg = true;
            this.statusMsg = res.data.rstDatOrder;
            this.copyStatusMsg = res.data.rstDatOrder.sysFlag + "";
            this.statusMsg.sysFlag = this.statusMsg.sysFlag + "";
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },

    // 明细视图列表查询
    viewList() {
      this.isData = [];
      axios({
        method: "post",
        url:
          axios.PARK_API +
          "/hospitalization/biz/rstdatordermsg/listMsgTimeView",
        params: {
          orderId: this.orderId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            // this.viewbotList = res.data.data.rstMsgFeeList;
            this.dateList = res.data.data.datelist;
            this.viewbotList = res.data.data.listvo;
            // this.isdateList = res.data.data.listvo.list;
            // this.isdateList = this.dateList;
            console.log(this.viewbotList);
            for (let i = 0; i < this.viewbotList.length; i++) {
              this.isData = this.viewbotList[i].list;
              console.log(this.isData);
            }
            /*   for (let y = 0; y < this.dateList.length; y++) {
              // console.log(this.dateList[y]);
              let obj = {};
              obj.biaoti = this.dateList[y];
              // console.log(obj.biaoti)
              for (let i = 0; i < this.viewbotList.length; i++) {
                this.isdateList = this.viewbotList[i].list;
                // console.log(this.isdateList);
                for (let j = 0; j < this.isdateList.length; j++) {
                  //  console.log(this.isdateList[j])
                  if (this.dateList[y] == this.isdateList[j]) {
                    // console.log(this.dateList[y])
                    // obj.shuzi = this.dateList[y];
                    obj.shuzi = "■";
                    console.log(obj.shuzi);
                    break;
                  } else {
                    obj.shuzi = "";
                  }
                }
                //  this.isData.push(obj);
                break;
              }
              this.isData.push(obj);
            }

            console.log(this.isData); */

            /*   for (let i = 0; i < this.viewbotList.length; i++) {
              this.isdateList = this.viewbotList[i].list;
              console.log(this.isdateList);

              for (let j = 0; j < this.isdateList.length; j++) {
                let obj = {};
                obj.biaoti = this.isdateList[j];
                // console.log(this.isdateList[j]);
                for (let y = 0; y < this.dateList.length; y++) {
                  // console.log( this.dateList[y])
                  if (this.dateList[y] == this.isdateList[j]) {
                    obj.shuzi = this.isdateList[j];
                    // console.log(this.dateList[y]);
                    this.isdateList[j] = "■";
                    // break;
                  } else {
                    // console.log('ok');
                    // this.isdateList[j] = "";
                    obj.shuzi = "";
                  }
                }
              }
              this.isData.push(obj);
            }
            console.log(this.isData); */
            /* for (let j = 0; j < this.dateList.length; j++) {
              let obj = {};
              obj.biaoti = this.dateList[j];
              for (let i = 0; i < this.viewbotList.length; i++) {
                this.isdateList = this.viewbotList[i].list;
                for (let y = 0; y < this.isdateList.length; y++) {
                  if (this.dateList[j] == this.isdateList[y]) {
                    obj.shuzhi = this.dateList[j];
                    break;
                  } else {
                    obj.shuzhi = "";
                  }
                }
                this.dateList.push(obj);
              }
            }
              console.log( this.dateList); */
            /*      for (let i = 0; i < res.data.data.datelist.length; i++) {
              let obj = {};
              obj.biaoti = res.data.data.datelist[i];

              for (let y = 0; y < res.data.data.listvo.list.length; y++) {
                if (
                  res.data.data.datelist[i] ==
                  res.data.data.rstMsgList[y].firstexecutetime
                ) {
                  // console.log( res.data.data.rstMsgList[y].firstexecutetime)
                  obj.shuzhi = res.data.data.datelist[i];
                  break;
                } else {
                  obj.shuzhi = "";
                }
                //console.log(obj.shuzhi);
              }
              this.dateList.push(obj);
            }

            console.log(this.dateList); */
            // console.log(this.dateList[0].shuzhi);
            /* for (let i = 0; i < this.dateList.length; i++) {
              if (this.dateList[i].biaoti == this.dateList[i].shuzhi) {
                this.dateList[i].shuzhi = "■";
              }
            } */
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },

    //明细视图top个人住院信息
    viewTop() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/bizdatorder/diagonseinfo",
        /* params: {
          orderId: this.orderId
        } */
        data: {
          orderId: this.orderId,
          ordernolist: [1]
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.viewTopList = res.data.bizDatOrder[0];

            // console.log(this.viewTopList);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },

    //审核情况费用明细
    viewLeft() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/bizdatorder/info",
        params: {
          orderId: this.orderId
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
            this.viewLeftList = res.data.bizDatOrder;
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

    // 收费明细列表查询
    moneyList() {
      axios({
        method: "post",
        url:
          axios.PARK_API + "/hospitalization/biz/bizdatorderitem/queryInfoById",
        data: {
          orderId: this.orderId,
          code: 1
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
        /* data: {
          orderId: this.orderId
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        } */
      })
        .then(res => {
          if (res.data.code == 0) {
            this.moneyDataList = res.data.data;
            this.dragtotal = this.moneyDataList.length;
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
        url:
          axios.PARK_API + "/hospitalization/biz/bizdatorderitem/queryItemName",
        params: {
          orderId: this.orderId
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
        url:
          axios.PARK_API + "/hospitalization/biz/bizdatorderitem/queryInfoById",
        /* params: {
          orderId: this.orderId,
          code: 1
        }, */
        data: {
          orderId: this.orderId,
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
        url:
          axios.PARK_API + "/hospitalization/biz/bizdatorderitem/queryInfoById",
        data: {
          orderId: this.orderId,
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
    },
    // 获取下部table表格框内容
    getTable() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatordermsg/listMsg",
        params: {
          orderId: this.orderId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.inquirydata = res.data.list;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    //药品说明书表格样式修改
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
      if (row.drugId == undefined || row.drugId == 0) {
        this.drugVisible = false;
        // this.$message("此项不属于药品");
      } else {
        if (column.property == "itemName" && row.itemName != undefined) {
          axios({
            method: "post",
            url: axios.PARK_API + "/hospitalization/biz/drug/querydrug",
            params: {
              // itemCode: row.itemCode
              durgId: row.drugId
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
    },
    // 右下角table栏点击行事件
    showDetail(row, parameter) {
      // parameter.preventDefault();
      this.otherMsg = row;
      console.log(row);
      let dataBy = "";
      if (localStorage.getItem("limited") == 1) {
        dataBy = localStorage.getItem("mainUser");
      } else if (localStorage.getItem("limited") == 2) {
        dataBy = localStorage.getItem("hosName");
      }
      axios({
        method: "post",
        url:
          axios.PARK_API +
          "/hospitalization/biz/rstdatorderchargeback/saveInfo",
        data: {
          // amount: row.amount,
          amount: 0,
          itemName: row.itemName,
          message: row.message,
          itemCode: row.itemCode,
          price: row.price,
          type: row.type,
          quantity: 0,
          // quantity: row.sum,
          orderId: this.orderId,
          createBy: dataBy
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.tdId = res.data.id;
            this.addVisible = true;
          } else {
          }
        })
        .catch(error => {
          this.$message.error("请检查网络");
        });
    },
    // 删除扣款金额数据
    deleteDetail(row, parameter) {
      console.log(row, parameter);
      this.$confirm("此操作将取消扣款, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "post",
            url:
              axios.PARK_API +
              "/hospitalization/biz/rstdatorderchargeback/update",
            data: {
              itemName: row.itemName,
              type: row.type,
              message: row.message,
              itemCode: row.itemCode,
              quantity: row.quantity,
              amount: 0,
              orderId: this.orderId
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
                this.getTable();
                this.getdeduction();
              } else {
                this.$message.error("请检查网络");
              }
            })
            .catch(error => {
              this.$message.error("请检查网络");
            });
        })
        .catch(() => {});
    },
    // 将扣款金额为0的直接置为空
    formatexam: function(row, column, cellValue) {
      console.log(row, column, cellValue);
      if (cellValue === 0) {
        return "";
      } else {
        return cellValue;
      }
    },
    // 页码改变时去请求数据
    handleCurrentChange(val) {
      this.rern = val;
      console.log(val);
      if (this.isSearch == true) {
        this.serchList(this.serchData, val);
      } else {
        this.getInquiry(val);
      }
    },

    // 指定查看回复这一列的样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        //指定坐标
        return "color:blue; font-size: 12px; cursor:pointer;";
      } /* else {
        return "";
      } */
      if (row.sysFlag == "通过" && columnIndex === 6) {
        return "background:rgba(0,255,0,0.3);";
        //  return "color:rgba(0,255,0);";
      } else if (row.sysFlag == "不通过" && columnIndex === 6) {
        return "background:rgba(255,0,0,0.3);";
        //  return "color:rgba(255,0,0,0.8);";
      } else if (row.sysFlag == "待确定" && columnIndex === 6) {
        return "background:rgba(255,165,0,0.3)";
        //  return "color:rgba(255,165,0)";
      }
    },
    /*  selectedHighlight({ row, rowIndex }) {
      if (this.getIndex === rowIndex) {
        return {
          "background-color": "rgba(60, 195, 100,1)"
        };
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    }, */
    rowClass({ row, rowIndex }) {
      return "border-bottom:2px solid #ccc;border-top:2px solid #ccc";
    },
    // 回复框内的同意和驳回
    agree(Furesult) {
      this.submit(2, Furesult);
    },
    reject(Furesult) {
      this.submit(2, Furesult);
    },
    // 提交回复
    submit(type, Furesult) {
      var data = {};

      // 判断当前是点击row时候的 结果操作  还是在回复框内的 结果操作
      if (type == 2) {
        if (Furesult == 1) {
          data.orderId = this.orderId;
          data.auditFlag = 4;
          data.status = 5;
          data.auditUser = 123;
        } else if (Furesult == 2) {
          data.orderId = this.orderId;
          data.auditFlag = 0;
          data.status = 0;
          data.auditUser = 123;
          data.reviewStatus = "驳回";
        }
      } else if (type == 1) {
        if (this.reradio == "1") {
          //同意
          data.orderId = this.orderId;
          data.status = 5;
          data.auditFlag = 4;
          data.auditUser = 123;
          data.reviewStatus = this.restatus;
        } else if (this.reradio == "0") {
          //驳回
          data.orderId = this.orderId;
          data.status = 0;
          data.auditFlag = 0;
          data.auditUser = 123;
          data.reviewStatus = "驳回";
        }
      }

      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatorder/update",
        data: data,
        /* data: {
                      orderId: this.orderId,
                      auditFlag: parseInt(this.statusMsg.sysFlag),
                      auditUser: 123,
                      remark: this.remark
                    }, */
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({ message: "提交成功", type: "success" });
            this.hiddenReply();
            this.hasMsg = false;
            this.tashow = false;
            // this.getInquiry(1);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
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
    // 重置按钮
    reset() {
      this.statusMsg.sysFlag = this.copyStatusMsg;
      this.remark = "";
    }
  },
  created() {
    this.getInquiry(1);
  },
  components: {
    screen,
    reply,
    drugshow,
    addData
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  display: flex;
  justify-content: space-around;
  /* overflow: hidden; */
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
  border-radius: 6px;
  margin-bottom: 15px;
  box-shadow: 0px 4px 0px rgba(228, 239, 255, 0.5),
    0px 2px 4px rgba(0, 0, 0, 0.5);
  /* border-top-left-radius: 4px; */
  /* border-bottom-left-radius: 4px; */
  line-height: 18px;
  padding: 2px 1px;
  cursor: pointer;
  margin-left: -4px;
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

.right-ctn .topView {
  widows: 100%;
  height: 100px;
  background-color: #eee;
  position: relative;
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
.right-ctn .database {
  width: 1000px;
  white-space: nowrap;
  /* position: relative; */
  overflow: auto;
}
.right-ctn .database table {
  border-collapse: collapse;
  border: 1px solid #aaa;
}
.right-ctn .database table .tdclass {
  color: #f00;
  font-size: 22px;
}
.plus,
.remove {
  font-size: 20px;
  color: #409eff;
  cursor: pointer;
  position: absolute;
  z-index: 999;
}
.plus {
  top: 4px;
  left: 6px;
}
.remove {
  top: 4px;
  left: 16%;
}
.upText {
  position: absolute;
  background: #fff;
  left: 48%;
  top: 10%;
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
/*隐藏滚轮*/
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

.right-ctn-title {
  width: 100%;
  height: 40px;
  text-align: left;
  padding-left: 20px;
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

.noMsg {
  color: rgb(144, 147, 153);
  font-size: 14px;
  line-height: 250px;
}

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
  /* background: #f47b1d; */
  border-radius: 4px;
  color: white;
}

.bom-left-title div:nth-child(4) {
  right: 10px;
  background: #f47b1d;
  border-radius: 4px;
  color: white;
}

.bom-left-title img {
  position: absolute;
  width: 20px;
  top: 5px;
}

/* .bom-left-title img:nth-child(1) {
      top: 5px;
      right: 122px;
    }
    .bom-left-title img:nth-child(2) {
      top: 5px;
      right: 51px;
    } */

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
.bottom-right .cutmoney {
  color: #f00;
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
</style>
