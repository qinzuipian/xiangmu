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
                            <span>批量处理:</span>
                            <el-radio v-model="piliangRadio" @change="checkSelect" label="1">通过</el-radio>
                            <el-radio v-model="piliangRadio" @change="checkSelect" label="2">不通过</el-radio>
                            <el-radio v-model="piliangRadio" @change="checkSelect" label="3">质询</el-radio>
                            <span v-show="remarkShow">
                              <span style="margin-left: 40px;">备注:</span>
                            <el-input style="width: 100px; height: 30px;" v-model="piliangbeizhu" size="mini"
                                      placeholder="请输入内容"></el-input>
                            </span>
                            <span>方式:</span>
                            <el-select v-model="fangshi" @change="methodSelect" size="mini" placeholder="请选择">
                                <el-option
                                        v-for="item in fangshiOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button size="mini" style="margin-left: 40px;" @click="piliangSubmit" v-show="handShow">保存</el-button>
                            <el-button type="primary" size="mini" style="margin-left: 40px;" @click="factorSubmit" v-show="factorShow">保存</el-button>
                        </div>

                        <!--row-click为点击某一行-->
                        <!--select-all   勾选全选 Checkbox 时触发的事件-->
                        <!--select  手动勾选数据行的 Checkbox 时触发的事件-->
                        <!--cell-click  当某个单元格被点击时会触发该事件-->
                        <!--selection-change 当选择项发生变化时会触发该事件-->

                        <!--todo 表格点击后变色   不是移入变色-->
                        <el-table
                                ref="multipleTable"
                                :data="hostpitalList"
                                height="460"
                                border
                                tooltip-effect="dark"
                                style="width: 100%"
                                @row-click="thisItMsg"
                                @select-all="allPiliang"
                                :cell-style="cellStyle"
                                @select="isPiliang"
                                @cell-click="showReply"
                                @selection-change="selectThisItem"
                                :header-cell-style="rowClass"
                                 highlight-current-row>
                            <el-table-column
                              type="index"
                              width="50">
                              <template slot-scope="scope"><span>{{scope.$index+(exrn - 1) * 10 + 1}} </span></template>
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
                                    width="50px">
                            </el-table-column>
                            <el-table-column
                                    prop="idCard"
                                    label="身份证号"
                                    width="160px"
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
                                    prop="reviewStatus"
                                    label="复审结果"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    label="当前状态"
                                    show-overflow-tooltip>
                            </el-table-column>
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
                           <!--  <el-table-column
                                    prop="hospitalGrade"
                                    label="医院等级"
                                    show-overflow-tooltip>
                            </el-table-column> -->
                            <el-table-column
                                    prop="deptName"
                                    label="门诊科室"
                                     width="160px"
                                    show-overflow-tooltip>
                            </el-table-column>
                           <!--  <el-table-column
                                    prop="icd10"
                                    label="诊断编码"
                                    show-overflow-tooltip>
                            </el-table-column> -->
                                                                          
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
                            <el-table-column
                                    prop="regionId"
                                    label="地区编码"
                                    show-overflow-tooltip>
                            </el-table-column>                        
                        </el-table>
                        <div class="block" id="fenye">
                            <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
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
                            <!-- <el-table-column prop="docName" label="医生姓名">
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

                          
                           <!--  <el-table-column prop="firstExecuteTime" label="首次执行日期" :formatter="dateFormat"  width="120px;" show-overflow-tooltip>
                            </el-table-column> -->
                            <el-table-column prop="startDate" label="开始日期" :formatter="dateFormat" show-overflow-tooltip>
                            </el-table-column>
                            <!-- <el-table-column prop="endTime" label="结束日期" :formatter="dateFormat" show-overflow-tooltip>
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
                        <p>审核结果:</p>
                        <el-radio v-show="!isClinic" v-model="shenheRadioStatus" label="1">通过</el-radio>
                        <el-radio v-show="!isClinic" v-model="shenheRadioStatus" label="2">不通过</el-radio>
                        <el-radio v-show="isClinic" disabled>通过</el-radio>
                        <el-radio v-show="isClinic" disabled>不通过</el-radio>
                        <el-radio v-model="shenheRadioStatus" label="3">质询</el-radio>
                        <!-- <p>
                            <el-button size="mini" @click="dialogFormVisible = true">查看回复</el-button>
                        </p> -->
                        <br>
                        <div class="beizhu" v-show="isBeizhu">
                            <p style="">备注:</p>
                            <el-input
                                    style="width: 80%;margin-right: 5%;"
                                    type="textarea"
                                    autosize
                                    placeholder="请输入备注内容"
                                    v-model="beizhu">
                            </el-input>
                        </div>
                        <el-button @click="submit(1)" style="margin-top: 20px;" type="success" size="mini">确认
                        </el-button>
                        <el-button @click="reset" style="margin-top: 20px;margin-left: 80px;" type="danger" size="mini">
                            重置
                        </el-button>
                    </div>
                    <span class="noMsg" v-show="itemMsg.length == 0">暂无数据</span>
                </div>
                <div class="bottom-right" v-show="tashow">
                    <el-table
                            :data="itemMsg"
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

                <!--@click="dialogFormVisible = true"-->
                <el-dialog title="疑问回复" v-if='dialogFormVisible' :visible.sync="dialogFormVisible" width="80%"
                           top="10px">
                    <clinicReply :copystatusmsg="itemMsg" :childMsgData="childMsgData" :userType="1" :presId="presId"
                           v-on:hiddenReply="hiddenReply" v-on:getUEContent="getUEContent"></clinicReply>
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
  name: "examine",
  data() {
    return {
      screenOpen: true,
      leftBck: 0,
      // 一共多少页
      total: 0,
      currentPage: 1,
      exrn: 1,
      hostpitalList: [],
      piliangRadio: "1",
      piliangbeizhu: "",
      piliangIdList: [],
      fangshi: 2,
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

      // 点击当前数据时候的 当前用户名
      name: "",

      // 备注
      // 是否显示备注
      isBeizhu: true,
      beizhu: "",
      // 用户号
      presId: "",

      // 当前状态
      dangqianzhuangtai: 0,

      itemMsg: [],
      copyStatusMsg: "",
      //   statusMsg: {},
      shenheRadioStatus: "1",
      // 左下角审核的状态进程显示
      leftStatus: 0,

      // 是否点击列表
      hasMsg: false,
      tashow: false,
      //左下角按钮的开关  是否为质询状态
      isClinic: false,

      // 给子组件传递的数据
      childMsg: [],
      childMsgData: {},
      dialogFormVisible: false,

      // 是否为搜索状态
      isSearch: false,
      //是否为清除状态
      isClear: false,
      serchData: [],
      //审核情况费用明细
      viewLeftList: [],
      drugVisible: false,
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
      factorShow: false,
      handShow: true,
      remarkShow: true
      // 审核调用回复框
      // userType: 1
    };
  },
  created() {
    this.gitHospitlaMsg(1);
    this.checkSelect();
    // this.isHasMsg();
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
    // 隐藏搜索栏
    hiddenScreen() {
      this.screenOpen = !this.screenOpen;
    },

    // 页码改变时去请求数据
    handleCurrentChange(val) {
      window.localStorage.setItem("rn", val);
      this.exrn = val;
      if (this.isSearch == true) {
        this.serchList(this.serchData, val);
      } else {
        this.gitHospitlaMsg(val);
      }
    },

    // 门诊页面初始化请求参数
    gitHospitlaMsg(rn) {
      localStorage.setItem("hometext", "【门诊-审核】");
      // 判断是否为首次进入页面  或者刷新   因为要展示刷新之前的数据
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
        data.auditFlagArray = [0, 3];
        data.regionId = localStorage.getItem("regionId");
        data.statusArray = [0, 3];
        /*  data.startbaldate= localStorage.getItem("inDateTime");
        data.endbaldate= localStorage.getItem("inDateEnd"); */
      } else {
        data.rn = rnx;
        data.rowNum = 10;
        data.auditFlagArray = [0, 3];
        data.regionId = localStorage.getItem("regionId");
        data.startbaldate = localStorage.getItem("inDateTime");
        data.endbaldate = localStorage.getItem("inDateEnd");
        data.statusArray = [0, 3];
      }

      // 请求list
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/bizdatpres/list",
        /*    data: {
          rn: rnx,
          rowNum: 10,
          auditFlagArray: [0, 3],
          regionId: localStorage.getItem("regionId"),
          startbaldate: localStorage.getItem("inDateTime"),
          endbaldate: localStorage.getItem("inDateEnd")
        }, */
        data: data,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            // 一共多少页
            this.total = res.data.page.totalPage * 10;
            this.hostpitalList = res.data.page.list;
            for (let i = 0; i < this.hostpitalList.length; i++) {
              this.hostpitalList[i].reply = "查看回复";
              this.hostpitalList[i].paixuId = i;
              // 机审结果的判断
              switch (this.hostpitalList[i].sysFlag) {
                case 1:
                  this.hostpitalList[i].sysFlag = "通过";
                  break;
                case 2:
                  this.hostpitalList[i].sysFlag = "不通过";
                  break;
                case 3:
                  this.hostpitalList[i].sysFlag = "待确定";
                  break;
                default:
                  this.hostpitalList[i].sysFlag = "数据错误";
                  break;
              }

              // 审核结果的判断
              //auditFlag:审核结果，0：空（默认），1：通过，2：不通过，3：挂起，4：调查
              switch (this.hostpitalList[i].auditFlag) {
                case 0:
                  this.hostpitalList[i].auditFlag = "待审核";
                  break;
                case 3:
                  this.hostpitalList[i].auditFlag = "质询";
                  break;
                default:
                  // 当通过或者不通过时候  不应该在这个列表中  所以为数据错误
                  this.hostpitalList[i].auditFlag = "数据错误";
                  break;
              }

              // 审核状态的判断
              // status:  0：待审核，1：质询中，2：审核中，3：复审中，4：待锁定，5：锁定
              switch (this.hostpitalList[i].status) {
                case 0:
                  this.hostpitalList[i].status = "待审核";
                  break;
                case 1:
                  this.hostpitalList[i].status = "质询中";
                  break;
                case 2:
                  this.hostpitalList[i].status = "审核中";
                  break;
                case 3:
                  this.hostpitalList[i].status = "复审中";
                  break;
                default:
                  this.hostpitalList[i].status = "锁定";
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

    // 点击某一行 请求该行的疑问信息和状态
    thisItMsg(row) {
      // console.log(row)
      this.presId = row.presId;

      // 如果为质询中，则屏蔽备注框
      if (row.status == "质询中") {
        this.isBeizhu = false;
      } else {
        this.isBeizhu = true;
      }
      this.getErrMsg();
      this.viewLeft();
      this.clinicViewtop();
      this.clinicViewlist();
      this.clinicMoneylist();
      this.hasMsg = true;
      this.tashow = true;
      //   this.getStatusMsg();
      this.name = row.name;
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
    getErrMsg() {
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/rstdatpresmsg/listMsg",
        params: {
          presId: this.presId
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.itemMsg = res.data.list;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    /*  getStatusMsg() {
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
            this.hasMsg = true;
            this.copyStatusMsg = res.data.rstDatOrder.sysFlag + "";

            // 判断左下角 当前这条数据的进程 以及如果是质询状态则关闭 通过和不通过的按钮
            switch (this.statusMsg.status) {
              case 0:
                this.isClinic = false;
                this.leftStatus = 0;
                break;
              case 1:
                this.isClinic = true;
                this.leftStatus = 1;
                break;
              case 2:
                this.isClinic = false;
                this.leftStatus = 0;
                break;
              case 3:
                this.isClinic = false;
                this.leftStatus = 2;
                break;
              default:
                this.isClinic = false;
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

    // 表格前面的序号
    indexMethod(index) {
      return index * 1;
    },

    // 审核通过或者不通过
    /*  submit(type, content) {
      var data = {};

      // 如果为通过或者不通过 当前状态为复审   如果是质询  当前状态为质询
      if (this.shenheRadioStatus == "1" || this.shenheRadioStatus == 2) {
        this.dangqianzhuangtai = "3";
      } else if (this.shenheRadioStatus == 3) {
        this.dangqianzhuangtai = "1";
      }

      // 判断当前是点击row时候的 结果操作  还是在回复框内的 结果操作

      // 1为页面内   2为富文本编辑器
      if (type == 2) {
        data.presId = this.presId;
        data.auditFlag = 3;
        data.status = 1;
        data.auditUser = 123;
        data.remark = content;
      } else if (type == 1) {
        data.presId = this.presId;
        data.auditFlag = parseInt(this.shenheRadioStatus);
        data.status = parseInt(this.dangqianzhuangtai);
        data.auditUser = 123;
        data.remark = this.beizhu;
      }

      // todo 审核调用的接口和质询调用的接口有所不同   remark和descripition理论上要合并在一块
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/rstdatpres/update",
        data: data,
        // data: {
        //     orderId: this.orderId,
        //     auditFlag: parseInt(this.shenheRadioStatus),
        //     status: parseInt(this.dangqianzhuangtai),
        //     auditUser: 123,
        //     remark: this.beizhu
        // },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({ message: "提交成功", type: "success" });
            this.hasMsg = false;
            this.gitHospitlaMsg();
            // 初始化数据
            this.beizhu = "";
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
      var data = {};

      // 1为页面内   2为富文本编辑器
      if (type == 2) {
        data.presId = this.presId;
        data.auditFlag = 3;
        data.status = 1;
        /* data.auditUser = 123; */
        // data.remark = content;
        data.description = content;
        data.usercode = localStorage.getItem("mainUser");
        // data.username = localStorage.getItem("mainUser");
        data.username = "经办单位";
        data.userType = "2";

        if (content != "") {
          axios({
            method: "post",
            url: axios.PARK_API + "/outpatient/biz/rstdatreply/save",
            data: data,
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
                this.hasMsg = false;
                this.tashow = false;
                // this.gitHospitlaMsg();
                // 初始化数据
                this.beizhu = "";
                // 关闭回复框
                this.dialogFormVisible = false;
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              // this.$message.error('请检查网络');
            });
        } else {
          console.log("no4");
        }

        // todo 审核调用的接口和质询调用的接口有所不同   remark和descripition理论上要合并在一块
        axios({
          method: "post",
          url: axios.PARK_API + "/outpatient/biz/rstdatpres/update",
          data: data,

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
              this.hasMsg = false;
              this.tashow = false;
              // this.gitHospitlaMsg();
              // 初始化数据
              this.beizhu = "";
              // 关闭回复框
              this.dialogFormVisible = false;
            } else {
              // this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            // this.$message.error('请检查网络');
          });
      } else if (type == 1) {
        /*  data.presId = this.presId;
        data.auditFlag = parseInt(this.shenheRadioStatus);
        data.status = parseInt(this.dangqianzhuangtai);
        //  data.auditUser = 123;
        // data.remark = this.beizhu;
        data.description = this.beizhu;
        data.usercode = localStorage.getItem("mainUser");
        // data.username = localStorage.getItem("mainUser");
        data.username = "经办单位";
        data.userType = "2"; */
        // 如果为通过或者不通过 当前状态为复审   如果是质询  当前状态为质询
        if (this.shenheRadioStatus == "1" || this.shenheRadioStatus == 2) {
          this.dangqianzhuangtai = "3";
          axios({
            method: "post",
            url: axios.PARK_API + "/outpatient/biz/rstdatpres/update",
            // data: data,
            data: {
              presId: this.presId,
              auditFlag: parseInt(this.shenheRadioStatus),
              status: parseInt(this.dangqianzhuangtai),
              auditUser: 123,
              remark: this.beizhu
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
                this.hasMsg = false;
                this.tashow = false;
                // this.gitHospitlaMsg();
                // 初始化数据
                this.beizhu = "";
                // 关闭回复框
                this.dialogFormVisible = false;
              } else {
                // this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              // this.$message.error('请检查网络');
            });
        } else if (this.shenheRadioStatus == 3) {
          this.dangqianzhuangtai = "1";

          if (this.beizhu != "") {
            axios({
              method: "post",
              url: axios.PARK_API + "/outpatient/biz/rstdatreply/save",
              // data: data,
              data: {
                presId: this.presId,
                auditFlag: parseInt(this.shenheRadioStatus),
                status: parseInt(this.dangqianzhuangtai),
                auditUser: 123,
                description: this.beizhu,
                usercode: localStorage.getItem("mainUser"),
                username: "经办单位",
                userType: "2"
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
                  this.hasMsg = false;
                  this.tashow = false;
                  // this.gitHospitlaMsg();
                  // 初始化数据
                  this.beizhu = "";
                  // 关闭回复框
                  this.dialogFormVisible = false;
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(error => {
                // this.$message.error('请检查网络');
              });
          } else {
            console.log("no5");
          }

          // todo 审核调用的接口和质询调用的接口有所不同   remark和descripition理论上要合并在一块
          axios({
            method: "post",
            url: axios.PARK_API + "/outpatient/biz/rstdatpres/update",
            // data: data,
            data: {
              presId: this.presId,
              auditFlag: parseInt(this.shenheRadioStatus),
              status: parseInt(this.dangqianzhuangtai),
              auditUser: 123,
              description: this.beizhu
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
                this.hasMsg = false;
                this.tashow = false;
                // this.gitHospitlaMsg();
                // 初始化数据
                this.beizhu = "";
                // 关闭回复框
                this.dialogFormVisible = false;
              } else {
                // this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              // this.$message.error('请检查网络');
            });
        }
      }

      // 判断当前是点击row时候的 结果操作  还是在回复框内的 结果操作
    },
    reset() {
      this.shenheRadioStatus = "1";
      this.beizhu = "";
    },

    // 富文本编辑器点击确认  默认为质询状态   只修改备注信息  content为富文本编辑器中的纯文本内容
    getUEContent(content) {
      this.submit(2, content);
      this.hiddenReply();
    },

    // 批量选择
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
    /*  piliangSubmit() {
      if (this.piliangRadio == 0) {
        this.dangqianzhuangtai = "0";
      } else if (this.piliangRadio == 1 || this.piliangRadio == 2) {
        this.dangqianzhuangtai = "3";
      } else if (this.piliangRadio == 3) {
        this.dangqianzhuangtai = "1";
      }
      axios({
        method: "post",
        url: axios.PARK_API + "/outpatient/biz/rstdatpres/batchUpdate",
        data: {
          list: this.piliangIdList,
          auditFlag: parseInt(this.piliangRadio),
          auditUser: 123,
          remark: this.piliangbeizhu,
          status: parseInt(this.dangqianzhuangtai)
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({ message: "提交成功", type: "success" });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
}, */

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
                // this.gitHospitlaMsg(1);
              } else {
                this.$message.error("提交数据失败！");
              }
            })
            .catch(error => {
              this.$message.error("请检查网络");
            });
        } else if (this.piliangRadio == 3) {
          this.dangqianzhuangtai = "1";
          if (this.piliangbeizhu != "") {
            axios({
              method: "post",
              url: axios.PARK_API + "/outpatient/biz/rstdatreply/batchsave",
              data: {
                presIdArray: this.piliangIdList,
                usercode: localStorage.getItem("mainUser"),
                // username: localStorage.getItem("mainUser"),
                username: "经办单位",
                userType: "2",
                description: this.piliangbeizhu
                // auditFlag: parseInt(this.piliangRadio),
                // auditUser: 123,
                // remark: this.piliangbeizhu,

                // status: parseInt(this.dangqianzhuangtai)
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
                  // this.gitHospitlaMsg(1);
                } else {
                  this.$message.error("提交数据失败！");
                }
              })
              .catch(error => {
                // this.$message.error('请检查网络');
              });
          } else {
            console.log("no3");
          }

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
                // this.gitHospitlaMsg(1);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              this.$message.error("请检查网络");
            });
        }
      }
    },

    //按条件提交
    factorSubmit() {
      if (this.isSearch == true) {
        this.$confirm("此操作将提交所有符合条件的数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.serchList(this.serchData);
            if (this.piliangRadio == 0) {
              // this.dangqianzhuangtai = "0";
              this.serchData.status = "0";
              this.serchData.auditFlag = this.piliangRadio;
            } else if (this.piliangRadio == 1 || this.piliangRadio == 2) {
              // this.dangqianzhuangtai = "3";
              this.serchData.status = "3";
              this.serchData.auditFlag = this.piliangRadio;
              // this.serchData.auditFlagArray = [0,3];

              axios({
                method: "post",
                url: axios.PARK_API + "/outpatient/biz/rstdatpres/allUpdate",
                /*  data: {
            list: this.piliangIdList,
            auditFlag: parseInt(this.piliangRadio),
            auditUser: 123,
            status: parseInt(this.dangqianzhuangtai)
          }, */
                data: this.serchData,
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
                    this.$message.error(res.data.msg);
                  }
                })
                .catch(error => {
                  this.$message.error("请检查网络");
                });
            } else if (this.piliangRadio == 3) {
              // this.dangqianzhuangtai = "1";
              // this.serchData.dangqianzhuangtai = "1";
              this.serchData.auditFlag = this.piliangRadio;
              this.serchData.status = "1";
              // this.serchData.auditFlagArray = [0,3];
              axios({
                method: "post",
                url: axios.PARK_API + "/outpatient/biz/rstdatpres/allUpdate",
                /*  data: {
            presIdArray: this.piliangIdList,
            usercode: localStorage.getItem("mainUser"),
            // username: localStorage.getItem("mainUser"),
            username: "经办单位",
            userType: "2",
            description: this.piliangbeizhu
            // auditFlag: parseInt(this.piliangRadio),
            // auditUser: 123,
            // remark: this.piliangbeizhu,

            // status: parseInt(this.dangqianzhuangtai)
          }, */
                data: this.serchData,
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
                    // this.$message.error(res.data.msg);
                  }
                })
                .catch(error => {
                  // this.$message.error('请检查网络');
                });
              /*   axios({
          method: "post",
          url: axios.PARK_API + "/outpatient/biz/rstdatpres/allUpdate",
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
              this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            this.$message.error("请检查网络");
          }); */
            }
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
        this.remarkShow = false;
        /*  this.hostpitalList.forEach(item => {
          console.log(item);
          this.$refs.multipleTable.toggleRowSelection(item, true);
            console.log(this.$refs.multipleTable.toggleRowSelection(item, true));
        }); */
      } else if (val == 2 && this.piliangRadio == 3) {
        this.factorShow = false;
        this.handShow = true;
        this.remarkShow = true;
      }
    },

    //判断选择的通过，不通过，质询方式
    checkSelect() {
      if (this.piliangRadio == 1 || this.piliangRadio == 2) {
        this.remarkShow = false;
      } else if (this.piliangRadio == 3 && this.fangshi == 2) {
        this.remarkShow = true;
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
    // 当前状态是否为批量修改状态
    isPiliang(selection, row) {
      if (this.fangshi == 1) {
        /*  this.$message.error("请先选择批量修改模式");
        this.$refs.multipleTable.clearSelection(); */
      } else {
        // 判断当前选择的改项数据是否为质询中的数据
        if (row.status == "质询中") {
          this.$message.error("该项正在质询");
          this.$refs.multipleTable.toggleRowSelection(row);
        }
      }
    },
    allPiliang(selection, row) {
      console.log(selection);
      console.log(row);
      if (this.fangshi == 1) {
        // this.$message.error("请先选择批量修改模式");
        this.$refs.multipleTable.clearSelection();
      } else {
        // 判断当前选择的改项数据是否为质询中的数据
        for (let i = 0; i <= selection.length; i++) {
          if (selection[i].status == "质询中") {
            console.log(selection.status);
            this.$message.error("有项目正在质询");
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        }
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

      if (row.sysFlag == "通过" && columnIndex === 7) {
        return "background:rgba(0,255,0,0.3);";
        //  return "color:rgba(0,255,0);";
      } else if (row.sysFlag == "不通过" && columnIndex === 7) {
        return "background:rgba(255,0,0,0.3);";
        //  return "color:rgba(255,0,0,0.8);";
      } else if (row.sysFlag == "待确定" && columnIndex === 7) {
        return "background:rgba(255,165,0,0.3)";
        //  return "color:rgba(255,165,0)";
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
    //table栏标题框的样式
    rowClass({ row, rowIndex }) {
      return "border-bottom:2px solid #ccc;border-top:2px solid #ccc";
    },

    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    // 门诊table栏回复框的显示和隐藏
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
              //给子组件的数据 初始化
              // 异常信息列表
              this.childMsg = this.itemMsg;
              // 当前状态
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
    hiddenReply() {
      this.dialogFormVisible = false;
    },

    //搜索结果
    serchList(serchData, val) {
      this.isSearch = true;
      this.serchData = serchData;
      serchData.auditFlagArray = [0, 3];
      serchData.regionId = localStorage.getItem("regionId");
      serchData.statusArray = [0, 3];
      if (val) {
        this.serchData.rn = val;
      } else {
        this.serchData.rn = 1;
      }
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
            this.hostpitalList = res.data.page.list;
            for (let i = 0; i < this.hostpitalList.length; i++) {
              this.hostpitalList[i].reply = "查看回复";
              this.hostpitalList[i].paixuId = i;
              // 机审结果的判断
              switch (this.hostpitalList[i].sysFlag) {
                case 1:
                  this.hostpitalList[i].sysFlag = "通过";
                  break;
                case 2:
                  this.hostpitalList[i].sysFlag = "不通过";
                  break;
                case 3:
                  this.hostpitalList[i].sysFlag = "待确定";
                  break;
                default:
                  this.hostpitalList[i].sysFlag = "数据错误";
                  break;
              }

              // 审核结果的判断
              //auditFlag:审核结果，0：空（默认），1：通过，2：不通过，3：挂起，4：调查
              switch (this.hostpitalList[i].auditFlag) {
                case 0:
                  this.hostpitalList[i].auditFlag = "待审核";
                  break;
                case 3:
                  this.hostpitalList[i].auditFlag = "质询";
                  break;
                default:
                  // 当通过或者不通过时候  不应该在这个列表中  所以为数据错误
                  this.hostpitalList[i].auditFlag = "数据错误";
                  break;
              }

              // 审核状态的判断
              // status:  0：待审核，1：质询中，2：审核中，3：复审中，4：待锁定，5：锁定
              switch (this.hostpitalList[i].status) {
                case 0:
                  this.hostpitalList[i].status = "待审核";
                  break;
                case 1:
                  this.hostpitalList[i].status = "质询中";
                  break;
                case 2:
                  this.hostpitalList[i].status = "审核中";
                  break;
                case 3:
                  this.hostpitalList[i].status = "复审中";
                  break;
                default:
                  this.hostpitalList[i].status = "锁定";
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
      this.gitHospitlaMsg(1);
    }
  },
  components: {
    clinicScreen,
    clinicReply,
    drugshow
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

.right-ctn-title {
  width: 100%;
  height: 40px;
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
</style>
