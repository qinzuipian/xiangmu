<template>
    <div>
             <div class="pass">
                 <span>————修改密码————</span>
                <div class="passForm">
                   <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原密码" prop="pass">
                        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="age">
                        <el-input type="password" v-model="ruleForm2.age"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                        <el-button @click="resetForm('ruleForm2')">重置</el-button>
                    </el-form-item>
                    </el-form>
                </div>
            </div>
       
    </div>
    
</template>


<script>
import axios from "axios";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value == this.ruleForm2.pass) {
        callback(new Error("两次输入密码一致!"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.age) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: "",
        checkPass: "",
        age: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios({
            method: "post",
            url: axios.PARK_API + "/sys-mgr/sys/user/password",
            data: {
              password: this.ruleForm2.pass,
              newPassword: this.ruleForm2.age
            },
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              token: localStorage.getItem("token")
            }
          })
            .then(res => {
              if (res.data.code == 0) {
                   this.$message('密码修改成功');
                this.$router.push({ path: "/app" });
               
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>


<style scoped>
.pass {
  /* width: 500px; */
  /* height: 500px; */
  /* border: 1px solid #409EFF; */
  /* border-radius: 4px; */
  padding: 10px;
  margin: 80px auto;
  text-align: center;
}
.pass span {
  font-size: 26px;
  color: #409eff;
  margin-left: 100px;
}
.pass .passForm {
  width: 40%;
  margin: 50px auto 0 auto;
}
</style>

