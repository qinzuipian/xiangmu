webpackJsonp([22],{"+KQe":function(t,e){},WId7:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=a("6sKG"),n=a.n(o),i=a("P8yQ"),r={data:function(){return{}},methods:{getname:function(){localStorage.setItem("hometext","【重点药品用量总体情况分析】")},topLeft:function(){var t=this,e=i.init(document.getElementById("topLeft"));e.showLoading({text:"加载加载加载....."}),n()({method:"post",url:n.a.PARK_API+"/outpatient/biz/drug/queryDrugYearAnaly",data:{},headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(function(a){if(0==a.data.code){e.hideLoading();for(var o=a.data.data,n=[],i=[],r=0;r<o.length;r++)n.push({value:o[r].feeDate}),i.push({value:o[r].ndzFee});console.log(o);var s={title:{text:"年度药品总费量趋势",left:"center",top:"top"},tooltip:{confine:!0,enterable:!0},xAxis:{type:"category",boundaryGap:!1,data:n},yAxis:{type:"value"},series:[{data:i,type:"line",areaStyle:{}}]};e.setOption(s,!0)}else t.$message.error("请检查网络！")})},topRight:function(){var t=this,e=i.init(document.getElementById("topRight"));e.showLoading({text:"加载加载加载....."}),n()({method:"post",url:n.a.PARK_API+"/outpatient/biz/drug/queryDrugMonthAnaly",params:{year:(new Date).getFullYear()}}).then(function(a){if(0==a.data.code){e.hideLoading();for(var o=a.data.data,n=[],i=[],r=0;r<o.length;r++)n.push({value:o[r].feeDate}),i.push({value:o[r].ydzFee});var s={title:{text:(new Date).getFullYear()+"年月度药品总用量趋势",left:"center",top:"top"},tooltip:{confine:!0,enterable:!0},xAxis:{type:"category",boundaryGap:!1,data:n},yAxis:{type:"value"},series:[{data:i,type:"line",areaStyle:{}}]};e.setOption(s,!0)}else t.$message.error("请检查网络！")})},bottomLeft:function(){var t=this,e=i.init(document.getElementById("bottomLeft"));e.showLoading({text:"加载加载加载....."}),n()({method:"post",url:n.a.PARK_API+"/outpatient/biz/drug/queryDrugTypeAnaly",params:{}}).then(function(a){if(0==a.data.code){e.hideLoading();for(var o=a.data.data,n=[],i=0;i<o.length;i++)n.push(o[i].fzFee),n.push(o[i].zyFee),n.push(o[i].zzFee);console.log(n);var r={title:{text:"药品类别分类",left:"center",top:"top"},tooltip:{confine:!0,enterable:!0},legend:{x:"left",y:"8%"},radar:{name:{textStyle:{color:"#fff",backgroundColor:"#999",borderRadius:3,padding:[3,5]}},indicator:[{name:"辅助用药费用",max:6500},{name:"中药费用",max:16e3},{name:"质子泵抑制药费用",max:3e4}],center:["40%","66%"]},series:[{name:"药品类别分类",type:"radar",areaStyle:{normal:{areaStyle:{type:"default"}}},data:[{value:n}]}]};e.setOption(r,!0)}else t.$message.error("请检查网络！")})},bottomRight:function(){var t=this,e=i.init(document.getElementById("bottomRight"));e.showLoading({text:"加载加载加载....."}),n()({method:"post",url:n.a.PARK_API+"/outpatient/biz/drug/queryDrugBigTypeAnaly",params:{}}).then(function(a){if(0==a.data.code){e.hideLoading();for(var o=a.data.data,n=[],i=0;i<o.length;i++)n.push(o[i].xyjFee),n.push(o[i].xyyFee),n.push(o[i].xyzfFee),n.push(o[i].zcyjFee),n.push(o[i].zcyyFee),n.push(o[i].zcyzfFee);var r={title:{text:"药品大类分布",left:"center",top:"top"},tooltip:{},grid:{x:40,x2:100,y2:150},legend:{x:"10%",y:"8%"},radar:{name:{textStyle:{color:"#fff",backgroundColor:"#999",borderRadius:3,padding:[3,5]}},indicator:[{name:"西药甲类",max:6500},{name:"西药乙类",max:16e3},{name:"西药自费",max:3e4},{name:"中成药甲类",max:38e3},{name:"中成药乙类",max:52e3},{name:"中成药自费",max:25e3}],center:["60%","55%"],radius:110},series:[{name:"药品大类分布",type:"radar",areaStyle:{normal:{type:"default"}},data:[{value:n}]}]};e.setOption(r,!0)}else t.$message.error("请检查网络！")})}},mounted:function(){this.topLeft(),this.topRight(),this.bottomLeft(),this.bottomRight()},created:function(){this.getname()}},s={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("div",{staticClass:"main"},[e("div",{staticClass:"top"},[e("div",{staticClass:"topLeft",attrs:{id:"topLeft"}}),this._v(" "),e("div",{staticClass:"topRight",attrs:{id:"topRight"}})]),this._v(" "),e("div",{staticClass:"bottom"},[e("div",{staticClass:"bottomLeft",attrs:{id:"bottomLeft"}}),this._v(" "),e("div",{staticClass:"bottomRight",attrs:{id:"bottomRight"}})])])])}]};var d=a("C7Lr")(r,s,!1,function(t){a("+KQe")},"data-v-81b2184e",null);e.default=d.exports}});