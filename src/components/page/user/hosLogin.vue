<template>
    <div class="login-wrap">
        <div class="ms-login">
            <!-- <div class="ms-title">后台管理系统</div> -->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.userName" placeholder="请输入用户名" @focus="loginBlur">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')" @focus="loginBlur">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
        <div class="loginfont">
          西安卫康数据系统有限公司 
          <!-- <br> -->
          &nbsp;&nbsp;
          技术支持电话：18192163896
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data: function() {
    return {
      ruleForm: {
        userName: localStorage.getItem('hosuser'),
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
           localStorage.setItem('hosuser',this.ruleForm.userName);
          axios({
            method: "post",
            url: axios.PARK_API + "/sys-mgr/sys/login",
            data: {
              userName: this.ruleForm.userName,
              password: this.ruleForm.password
            },
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          })
            .then(res => {
              if (res.data.code == 0) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("navList", res.data.roleList);
                localStorage.setItem("limited", "2");
                // localStorage.setItem("mainUser", this.userName);

                // todo  路由有一个问题，这里跳转到app    app默认路由是住院审核   如果用户没有住院审核的页面权限   那么会产生冲突  会404页面
                this.$router.push("/HospitalizationInquiry");
                // this.$router.push({ path: "/app" });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              // this.$message.error('请检查网络');
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    loginBlur() {
      axios({
        method: "post",
        url: axios.PARK_API + "/sys-mgr/info",
        data: {
          userName: this.ruleForm.userName
        }
      })
        .then(res => {
          if (res.data.code == 0 && res.data.data) {
            localStorage.setItem("userName", res.data.data.d10111);
            localStorage.setItem("hosName", res.data.data.d10102);
            localStorage.setItem("userTime", res.data.data.parmCode);
            localStorage.setItem("othercode", res.data.data.d10101);
          } else if (res.data.code == 0 && !res.data.data) {
            this.$message("没有此用户");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(../../assets/login-bg.jpg); */
  background-image: url(../../../../static/img/hoslogin.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 73%;
  top: 74%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
  background-color: #0150B5;
  border: 0;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.loginfont {
  /* width: 18%; */
  /* height: 60px; */
  line-height: 30px;
  border-radius: 4px;
  /* line-height: 60px; */
  text-align: left;
  /* background:rgba(0,0,0, .5); */
  position:absolute;
  bottom: 2px;
  left: 36%;
  color:#000;
  font-size: 14px;
}
</style>