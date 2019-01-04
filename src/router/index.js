import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                //首页
                {
                    path: '/home',
                    component: resolve => require(['../components/page/home/home.vue'], resolve),
                    meta: { title: '首页' }
                },
                //住院系统
                {
                    path: '/HospitalizationExamine',
                    component: resolve => require(['../components/page/Hospitalization/examine.vue'], resolve),
                    meta: { title: '住院审核' }
                },
                {
                    path: '/HospitalizationInquiry',
                    component: resolve => require(['../components/page/Hospitalization/inquiry.vue'], resolve),
                    meta: { title: '住院质询' }
                },
                {
                    path: '/HospitalizationReexamine',
                    component: resolve => require(['../components/page/Hospitalization/reexamine.vue'], resolve),
                    meta: { title: '住院复审' }
                },
                {
                    path: '/hosRecord',
                    component: resolve => require(['../components/page/Hospitalization/hosRecord.vue'], resolve),
                    meta: { title: '历史记录' }
                },
                {
                    path: '/medicalBook',
                    component: resolve => require(['../components/page/Hospitalization/medicalBook.vue'], resolve),
                    meta: { title: '药品说明书' }
                },
                //住院报表
                {
                    path: '/inquiryEnd',
                    component: resolve => require(['../components/page/hosReport/inquiryEnd.vue'], resolve),
                    meta: { title: '住院结果分析' }
                },
                {
                    path: '/foultrend',
                    component: resolve => require(['../components/page/hosReport/foultrend.vue'], resolve),
                    meta: { title: '违规趋势分析' }
                },
                {
                    path: '/foul',
                    component: resolve => require(['../components/page/hosReport/foul.vue'], resolve),
                    meta: { title: '违规统计' }
                },
                {
                    path: '/Comprehen',
                    component: resolve => require(['../components/page/hosReport/Comprehen.vue'], resolve),
                    meta: { title: '综合分析' }
                },
                {
                    path: '/medical',
                    component: resolve => require(['../components/page/hosReport/medical.vue'], resolve),
                    meta: { title: '病案科室' }
                },
                {
                    path: '/payment',
                    component: resolve => require(['../components/page/hosReport/payment.vue'], resolve),
                    meta: { title: '扣款通知单' }
                },
                {
                    path: '/medicDos',
                    component: resolve => require(['../components/page/hosReport/medicDos.vue'], resolve),
                    meta: { title: '药品用量情况分析' }
                },
                //数据统计
                {
                    path: '/datacount',
                    component: resolve => require(['../components/page/count/datacount.vue'], resolve),
                    meta: { title: '诊断方案统计分析' }
                },
                //门诊系统
                {
                    path: '/clinicExamine',
                    component: resolve => require(['../components/page/clinic/examine.vue'], resolve),
                    meta: { title: '门诊审核' }
                },
                {
                    path: '/clinicInquiry',
                    component: resolve => require(['../components/page/clinic/inquiry.vue'], resolve),
                    meta: { title: '门诊质询' }
                },
                {
                    path: '/clinicReexamine',
                    component: resolve => require(['../components/page/clinic/reexamine.vue'], resolve),
                    meta: { title: '门诊复审' }
                },
                {
                    path: '/hisRecord',
                    component: resolve => require(['../components/page/clinic/hisRecord.vue'], resolve),
                    meta: { title: '历史记录' }
                },
                //门诊报表
                {
                    path: '/cliInquiryEnd',
                    component: resolve => require(['../components/page/cliReport/cliInquiryEnd.vue'], resolve),
                    meta: { title: '门诊结果分析' }
                },
                {
                    path: '/cliFoultrend',
                    component: resolve => require(['../components/page/cliReport/cliFoultrend.vue'], resolve),
                    meta: { title: '违规趋势分析' }
                },
                {
                    path: '/cliFoul',
                    component: resolve => require(['../components/page/cliReport/cliFoul.vue'], resolve),
                    meta: { title: '违规统计' }
                },
                {
                    path: '/cliComprehen',
                    component: resolve => require(['../components/page/cliReport/cliComprehen.vue'], resolve),
                    meta: { title: '综合分析' }
                } ,
                /*{
                    path: '/clinicMedical',
                    component: resolve => require(['../components/page/cliReport/clinicMedical.vue'], resolve),
                    meta: { title: '病案科室' }
                }, */
                //参合信息
                {
                    path: '/person',
                    component: resolve => require(['../components/page/dataAnaly/participate/person.vue'], resolve),
                    meta: { title: '参合人员基本信息' }
                },
                {
                    path: '/parSituation',
                    component: resolve => require(['../components/page/dataAnaly/participate/parSituation.vue'], resolve),
                    meta: { title: '参合情况分析' }
                },
                //基金筹资
                {
                    path: '/fundUse',
                    component: resolve => require(['../components/page/dataAnaly/fundCollection/fundUse.vue'], resolve),
                    meta: { title: '基金使用情况分析' }
                },
                //按地区补偿
                {
                    path: '/hosCompensation',
                    component: resolve => require(['../components/page/dataAnaly/compensation/hosCompensation.vue'], resolve),
                    meta: { title: '住院补偿情况分析' }
                },
                {
                    path: '/cliCompensation',
                    component: resolve => require(['../components/page/dataAnaly/compensation/cliCompensation.vue'], resolve),
                    meta: { title: '门诊补偿情况分析' }
                },
                {
                    path: '/slowCompensation',
                    component: resolve => require(['../components/page/dataAnaly/compensation/slowCompensation.vue'], resolve),
                    meta: { title: '慢病补偿情况分析' }
                },
                //病种统计
                {
                    path: '/diseaseStatic',
                    component: resolve => require(['../components/page/dataAnaly/Disease/diseaseStatic.vue'], resolve),
                    meta: { title: '病种统计分析' }
                },
                //按医院补偿
                {
                    path: '/hosStaitc',
                    component: resolve => require(['../components/page/dataAnaly/hospitalStatic/hosStaitc.vue'], resolve),
                    meta: { title: '住院补偿情况分析' }
                },
                {
                    path: '/cliStatic',
                    component: resolve => require(['../components/page/dataAnaly/hospitalStatic/cliStatic.vue'], resolve),
                    meta: { title: '门诊补偿情况分析' }
                },
                {
                    path: '/slowStatic',
                    component: resolve => require(['../components/page/dataAnaly/hospitalStatic/slowStatic.vue'], resolve),
                    meta: { title: '慢病补偿情况分析' }
                },
                //按年度补偿
                {
                    path: '/hospitalYear',
                    component: resolve => require(['../components/page/dataAnaly/yearCompensation/hospitalYear.vue'], resolve),
                    meta: { title: '住院补偿情况分析' }
                },
                {
                    path: '/clinicYear',
                    component: resolve => require(['../components/page/dataAnaly/yearCompensation/clinicYear.vue'], resolve),
                    meta: { title: '门诊补偿情况分析' }
                },
                {
                    path: '/slowYear',
                    component: resolve => require(['../components/page/dataAnaly/yearCompensation/slowYear.vue'], resolve),
                    meta: { title: '慢病补偿情况分析' }
                },
                //按项目补偿
                {
                    path: '/hospitalItem',
                    component: resolve => require(['../components/page/dataAnaly/itemCompensation/hospitalItem.vue'], resolve),
                    meta: { title: '住院补偿情况分析' }
                },
                {
                    path: '/clinicItem',
                    component: resolve => require(['../components/page/dataAnaly/itemCompensation/clinicItem.vue'], resolve),
                    meta: { title: '门诊补偿情况分析' }
                },
                {
                    path: '/slowItem',
                    component: resolve => require(['../components/page/dataAnaly/itemCompensation/slowItem.vue'], resolve),
                    meta: { title: '慢病补偿情况分析' }
                },
                {
                    path: '/password',
                    component: resolve => require(['../components/page/user/password.vue'], resolve),
                    meta: { title: '修改密码' }
                },

            ]
        },

        /*   {
              path: '/login',
              component: resolve => require(['../components/page/user/login.vue'], resolve)
          }, */
        {
            path: '/login',
            component: resolve => require(['../components/page/user/Login.vue'], resolve)
        },
        {
            path: '/hoslogin',
            component: resolve => require(['../components/page/user/hosLogin.vue'], resolve)
        }

    ]
})
