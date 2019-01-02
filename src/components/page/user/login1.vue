<template>
    <div class="content">
		<img src="../../../../static/img/login.jpg"/>
    <!-- <h1>智能审核 -- 经办单位</h1> -->
		<div class="login">
  
			<!--<h1>登  录</h1>-->
			<div class="account">
				账  号：<input type="text" v-model="userName" @blur="loginBlur"/>
			</div>
			<div class="psd">
				密  码：<input type="password" v-model="password" />
			</div>
			<div>
                <!--<router-link class="loginBtn" :to="{ path: '/welcome'}">登  录</router-link>-->
        <input type="button" value="登  录" @click="login"/>
			</div>
			
		</div>
    </div>    
</template>

<script>
import axios from "axios";

export default {
  name: "login",
  data() {
    return {
      userName: "admin",
      password: "admin"
    };
  },
  created() {},
  methods: {
    login() {
      axios({
        method: "post",
        url: axios.PARK_API + "/sys-mgr/sys/login",
        data: {
          userName: this.userName,
          password: this.password
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("navList", res.data.roleList);
            localStorage.setItem("limited", "1");
            localStorage.setItem("mainUser", this.userName);

            // todo  路由有一个问题，这里跳转到app    app默认路由是住院审核   如果用户没有住院审核的页面权限   那么会产生冲突  会404页面
            this.$router.push("/");
            // this.$router.push({ path: "/app" });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          // this.$message.error('请检查网络');
        });
    },
    loginBlur() {
      axios({
        method: "post",
        url: axios.PARK_API + "/sys-mgr/info",
        data: {
          userName: this.userName
        }
      })
        .then(res => {
          if (res.data.code == 0 && res.data.data) {
            //   console.log(res.data)
            //    this.$message("用户名：" + res.data.data.d10111);
            // localStorage.setItem("userName", res.data.data.d10111);
            localStorage.setItem("userTime", res.data.data.parmCode);
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
.content {
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  z-index: -1;
  position: absolute;
}
.content img {
  display: block;
  outline: none;
  border: 0;
  height: 100%;
  width: 100%;
}
.content h1 {
  position: absolute;
  top: 90px;
  right: 280px;
  color: #fff;
  font-size: 36px;
  font-family: "微软雅黑";
}
.login {
  width: 306px;
  /* height: 300px; */
  background-color: transparent;
  position: absolute;
  right: 54%;
  top: 36%;
  border-radius: 5px;
  padding-left: 15px;
  /* box-shadow: #b7c8d6 0px 0px 30px 5px; */
}
.login .account {
  margin-top: 50px;
}
.login .account input,
.login .psd input {
  width: 230px;
  height: 40px;
  color: #666;
  border-radius: 5px;
  margin-bottom: 25px;
  padding-left: 5px;
  outline: none;
  border: 1px solid #e3e3e3;
}
.login input[type="button"] {
  width: 290px;
  height: 45px;
  border: none;
  color: #fff;
  font-size: 16px;
  background-color: #5ab33d;
  border: 0;
  margin-top: 15px;
  border-radius: 5px;
  cursor: pointer;
}
.loginBtn {
  width: 200px;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
</style>

