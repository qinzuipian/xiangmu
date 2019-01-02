<template>
    <div>
        <el-button type="primary" size="mini" @click="printBtn()">打印</el-button>
        <div id="print">
			<span>结算月份：{{dayTime}}</span>
			<table class='ta'  border="1" cellspacing="0" cellpadding="1" style="margin: auto">
				<tr style="text-align: center;">
					<td colspan="8">住院病历审核违规费用扣减通知单</td>
				</tr>
				<tr>
					<td  align='center'>住院名称</td>
					<td  align='center'>{{medicalText.hospitalName}}</td>
					<td align='center'>住院人次</td>
					<td  align='center'>{{medicalText.num}}</td>
					<td align='center'>总费用(元)</td>
					<td  align='center'>{{medicalText.totalFee}}</td>
					<td align='center'>补偿金额</td>
					<td  align='center'>{{medicalText.effectFee}}</td>
				</tr>
				<tr>
					<td colspan="8">&nbsp;&nbsp;&nbsp;&nbsp;经中心审核，本月住院病历存在以下违规问题：</td>
				</tr>
				<tr>
					<td align='center'>序号</td>
					<td colspan="3" align='center'>违规问题</td>
					<td colspan="2" align='center'>审核规则</td>
					<td align='center'>病例数</td>
					<td align='center'>违规金额（元）</td>
				</tr>
                <tr v-show="tdshow">
					<td colspan="8" align='center'>暂无数据</td>
				</tr>
                 <tr align='center' v-for="(item,index) in issueData" :key="index">
                        <td style="width:50px;">{{index+1}}</td>
                        <td colspan="3" align='center'>{{item.message}}</td>
                        <td  colspan="2" align='center'>{{item.type}}</td>
                        <td align='center'>{{item.num}}</td>
                        <td align='center'>{{item.amount}}</td>
                </tr>
			</table>
			<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据《县新型农村合作医疗实施办法》、《县新型农村合作医疗定点医疗机构管理暂行办法》的有关规定以及双方签</p>
			<p>订的年度定点医院服务协议有关条款，决定对以上违规金额进行扣减。</p>
			<div class="write">
				<p>县新型农村合作医疗经办中心</p>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</p>
			</div>			
        </div>
    </div>
    
</template>



<script>
import axios from "axios";
export default {
  name: "Medical",
  props: ["medicalText","dayTime"],
  data() {
    return {
      issueData: [],
      tdshow: false,
    };
  },
  methods: {
    //获取异常信息列表
    getMedical() {
      axios({
        method: "post",
        url: axios.PARK_API + "/hospitalization/biz/rstdatorderchargeback/queryChargeback",
        data: {
          //   orderId: "74ddedfc-fcf0-40e8-bfc6-3653e0fd9d13"
          hospitalId: this.medicalText.hospitalId
        },
         headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.issueData = res.data.data.RstDatOrderChargebackEntity;
            if(this.issueData.length==0) {
                this.tdshow = true;
            } else {
                this.tdshow = false;
            }
            console.log(this.issueData)
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          //this.$message.error('请检查网络');
        });
    },
    //打印表格数据
    printBtn() {
      let subOutputRankPrint = document.getElementById("print");
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
    
  },
  created() {
    this.getMedical();
  }
};
</script>



<style scoped>

.ta td {
  width: 100px;
  height: 30px;
}
#print span {
				margin-left: 70%;
}
#print p {
	margin-left: 14%;
}
/* #print table td {
    border:2px solid #000;
} */
.write {
	margin-left: 58%;
}
</style>
