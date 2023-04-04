<template>
  <div>
    <!-- <div class="info-title">账户信息</div> -->
    <div>
      <el-tabs class="info-tabs" v-model="activeName">
        <el-tab-pane label="账户信息" name="first">
          <el-form
            :label-position="labelPosition"
            label-width="80px"
            :model="userInfo"
            class="info-form"
          >
            <el-form-item label="账户名称">
              <el-input
                :disabled="true"
                class="formInput"
                v-model="userInfo.username"
              ></el-input>
            </el-form-item>
            <el-form-item label="账户昵称">
              <el-input
                :disabled="true"
                class="formInput"
                v-model="userInfo.nickname"
              ></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱">
              <el-input
                :disabled="true"
                class="formInput"
                v-model="userInfo.email"
              ></el-input>
            </el-form-item>
            <el-form-item label="账户权限">
              <el-input
                :disabled="true"
                class="formInput"
                v-model="userInfo.role"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-input
                :disabled="true"
                class="formInput"
                v-model="userInfo.create_time"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="second">
          <el-form
            ref="pwdRef"
            :model="pwd"
            :label-position="labelPosition"
            label-width="80px"
            class="info-form"
            :rules="rules"
          >
            <el-form-item label="原密码" prop="origin">
              <el-input
                class="formInput"
                v-model="pwd.origin"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpwd">
              <el-input
                class="formInput"
                v-model="pwd.newpwd"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="再次输入" prop="newpwd1">
              <el-input
                class="formInput"
                v-model="pwd.newpwd1"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
              style="width: 202px;"
                type="primary"
                @click="submitForm"
                v-loading.fullscreen.lock="fullscreenLoading"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getYMDHMS } from "@/utils/util";
export default {
  created: function loadUserInfo() {
    this.userInfo.username = window.localStorage.getItem("user");
    this.$axios.post("getUserInfo", this.userInfo).then((res) => {
      res.data.UserInfo.create_time = getYMDHMS(res.data.UserInfo.create_time);
      this.userInfo = res.data.UserInfo;
    });
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwd.newpwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      activeName: "first",
      //表单的对齐方式
      labelPosition: "right",
      //表单数据
      fullscreenLoading: false,
      userInfo: {
        username: "",
        nickname: "",
        email: "",
        role: "",
        create_time: "",
      },
      pwd: {
        origin: "",
        newpwd: "",
        newpwd1: "",
      },
      rules: {
        origin: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        newpwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
          { validator: validatePass, trigger: "blur" },
        ],
        newpwd1: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
          { validator: validatePass2, trigger: "blur", required: true },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.$refs.pwdRef.validate((valid) => {
          if (valid) {
            let md5pwd = {
              username: window.localStorage.getItem("user"),
              originPwd: this.$md5(this.pwd.origin),
              newPwd: this.$md5(this.pwd.newpwd),
            };
            this.$axios.post("changePwd", md5pwd).then((res) => {
              if (res.data.flag == 0) {
                this.$message.error("原密码错误！");
                this.fullscreenLoading = false;
              } else {
                this.$message.success("修改密码成功！");
                setTimeout(() => {
                  this.fullscreenLoading = false;
                  window.localStorage.clear();
                  this.$router.push({ path: "/login" });
                }, 400);
              }
            });
          } else {
            this.$message.error("填写错误！");
            this.fullscreenLoading = false;
          }
        });
      }, 800);
    },
  },
};
</script>

<style lang="less" scoped>
.info-title {
  padding: 0px 0px 20px 5px;
  font-size: 150%;
  font-weight: 600;
}
.info-account {
  padding: 0px 0px 20px 5px;
  font-size: 120%;
  font-weight: 400;
}
.info-tabs {
  padding: 0px 0px 0px 5px;
}
.info-form {
  margin-top: 15px;
}
.formInput {
  width: auto !important;
}
</style>