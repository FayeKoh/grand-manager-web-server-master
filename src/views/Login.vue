<template>
  <div>
    <div>
      <v-main>
        <v-app-bar app class="px-1 app-name" color="white" elevate-on-scroll>
          <slot class="logocontainer">
            <img
              src="favicon.jpg"
              style="width: 4%; margin-left: 183px"
              @click=""
            />
          </slot>
          <v-toolbar-title style="margin-left: 5%; font-weight: bolder">
            GRAND Manager · 城市智能停车管理系统
          </v-toolbar-title>
          <v-spacer />
          <v-list
            right
            style="padding-left: 5%; background-color: rgba(0, 0, 0, 0)"
          >
            <v-btn
              bold
              dark
              style="margin-right: 20px"
              rounded
              color="#283443"
              @click=""
              >进入官网</v-btn
            >
          </v-list>
        </v-app-bar>
        <v-form>
          <v-container id="container">
            <v-row
              style="margin-top: 100px; margin-left: 20%"
              align="center"
              justify="center"
            >
              <v-col cols="12" sm="10">
                <v-card
                  class="elevation-6 mt-10"
                  style="box-shadow: 0 0 10px #888888"
                >
                  <v-window v-model="step">
                    <v-window-item :value="1">
                      <v-row style="margin-left: 0; margin-right: 0">
                        <v-col cols="12" md="6">
                          <v-card-text class="mt-12" style="margin-left: 10%">
                            <h3
                              class="text-center bold"
                              style="margin-left: 25%"
                            >
                              登 录 您 的 帐 户
                            </h3>
                            <v-row align="center" justify="center">
                              <v-col
                                cols="12"
                                sm="8"
                                style="margin-top: 10%"
                                ref="LoginFormRef"
                              >
                                <v-text-field
                                  v-model="LoginForm.username"
                                  label="账户"
                                  :rules="usernameRules"
                                  outlined
                                  dense
                                  color="#FF4F5A"
                                  autocomplete="false"
                                  class="mt-10"
                                  style="width: 200%"
                                />
                                <v-text-field
                                  v-model="LoginForm.password"
                                  :rules="passwordRules"
                                  label="密码"
                                  outlined
                                  dense
                                  color="#FF4F5A"
                                  autocomplete="false"
                                  type="password"
                                />
                                <v-row style="margin-top: -10%">
                                  <v-col cols="12" sm="7">
                                    <!--                                <v-checkbox-->
                                    <!--                                  label="7天内保持登录"-->
                                    <!--                                  class="mt-n1"-->
                                    <!--                                  color="#FF4F5A"-->
                                    <!--                                >-->
                                    <!--                                </v-checkbox>-->
                                    <br />
                                    <el-checkbox
                                      v-model="checked"
                                      label="7天内保持登录"
                                    ></el-checkbox>
                                  </v-col>
                                </v-row>
                                <v-btn
                                  class="bold"
                                  color="#FF4F5A"
                                  dark
                                  block
                                  tile
                                  @click="login"
                                  style="
                                    background-color: #7b68ee;
                                    margin-top: 5%;
                                  "
                                  >登 录</v-btn
                                >

                                <h5
                                  class="text-center grey--text mt-4 mb-3"
                                  style="margin-top: 10%; text-align: center"
                                >
                                  其他方式登录
                                </h5>
                                <hr />
                                <div
                                  class="d-flex justify-space-between align-center mx-10 mb-16"
                                  style="margin-top: 5%"
                                >
                                  <v-btn depressed outlined color="blue">
                                    <v-icon color="blue">fab fa-qq</v-icon>
                                  </v-btn>
                                  <v-btn
                                    depressed
                                    outlined
                                    color="green"
                                    style="margin-left: 22%"
                                  >
                                    <v-icon color="green">fab fa-weixin</v-icon>
                                  </v-btn>
                                  <v-btn
                                    depressed
                                    outlined
                                    color="red"
                                    style="margin-left: 21%"
                                  >
                                    <v-icon color="red">fab fa-weibo</v-icon>
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          class="rounded-bl-xl"
                          style="background-color: #283443"
                        >
                          <div style="text-align: center; padding: 180px 0">
                            <v-card-text class="white--text">
                              <h3
                                class="text-center bold"
                                style="color: whitesmoke"
                              >
                                还没有创建自己的帐户？
                              </h3>
                              <h6 class="text-center" style="color: whitesmoke">
                                让我们为您完成所有设置，以便您可以开始创建您的帐户
                              </h6>
                            </v-card-text>
                            <div class="text-center">
                              <v-btn
                                class="bold"
                                tile
                                outlined
                                dark
                                @click="step++"
                                style="border-radius: 5px"
                              >
                                注 册
                              </v-btn>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-window-item>
                    <v-window-item :value="2">
                      <v-row style="margin-left: 0; margin-right: 0">
                        <v-col
                          cols="12"
                          md="6"
                          class="rounded-br-xl"
                          style="background-color: #283443"
                        >
                          <div style="text-align: center; padding: 160px 0">
                            <v-card-text class="white--text">
                              <h3
                                class="text-center bold"
                                style="color: whitesmoke"
                              >
                                已经注册自己的账户？
                              </h3>
                              <h6 class="text-center" style="color: whitesmoke">
                                登录到您的帐户
                              </h6>
                            </v-card-text>
                            <div class="text-center bold">
                              <v-btn
                                class="bold"
                                tile
                                outlined
                                dark
                                @click="step--"
                                style="border-radius: 5px"
                                >登 录</v-btn
                              >
                            </div>
                          </div>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-card-text class="mt-12" style="margin-left: 10%">
                            <h3
                              class="text-center bold"
                              style="margin-left: 25%"
                            >
                              注 册 新 账 号
                            </h3>
                            <v-row align="center" justify="center">
                              <v-col cols="12" sm="8" style="margin-top: 10%">
                                <v-text-field
                                  v-model="RegisterForm.username"
                                  label="账户名称"
                                  :rules="usernameRules"
                                  outlined
                                  dense
                                  color="#FF4F5A"
                                  autocomplete="false"
                                />
                                <v-text-field
                                  v-model="RegisterForm.nickname"
                                  label="账户昵称"
                                  :rules="usernameRules"
                                  outlined
                                  dense
                                  color="#FF4F5A"
                                  autocomplete="false"
                                />
                                <v-text-field
                                  v-model="RegisterForm.email"
                                  label="电子邮箱"
                                  :rules="usernameRules"
                                  outlined
                                  dense
                                  color="#FF4F5A"
                                  autocomplete="false"
                                />
                                <v-text-field
                                  v-model="RegisterForm.password"
                                  label="密码"
                                  :append-icon="
                                    show ? 'mdi-eye' : 'mdi-eye-off'
                                  "
                                  :rules="[
                                    passwordRules.required,
                                    passwordRules.min,
                                  ]"
                                  :type="show ? 'text' : 'password'"
                                  outlined
                                  dense
                                  color="#FF4F5A"
                                  autocomplete="false"
                                  hint="请输入至少6位字符"
                                  @click:append="show = !show"
                                />

                                <v-text-field
                                  v-model="RegisterForm.password1"
                                  label="确认密码"
                                  :append-icon="
                                    show2 ? 'mdi-eye' : 'mdi-eye-off'
                                  "
                                  :rules="[
                                    passwordRules.required,
                                    passwordConfirmationRule,
                                  ]"
                                  :type="show2 ? 'text' : 'password'"
                                  outlined
                                  dense
                                  color="#FF4F5A"
                                  autocomplete="false"
                                  hint="请输入至少6位字符"
                                  @click:append="show2 = !show2"
                                />
                                <el-select
                                  style="
                                    border-radius: 5px;
                                    width: 100%;
                                    border: 1px solid gray;
                                  "
                                  v-model="value"
                                  filterable
                                  placeholder="创建一个账户为"
                                >
                                  <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled"
                                  >
                                  </el-option>
                                </el-select>

                                <v-btn
                                  class="bold"
                                  color="#FF4F5A"
                                  dark
                                  block
                                  tile
                                  @click="register"
                                  style="
                                    background-color: #7b68ee;
                                    margin-top: 10%;
                                  "
                                  >注 册</v-btn
                                >
                                <h5
                                  class="text-center grey--text mt-4 mb-3"
                                  style="margin-top: 10%; text-align: center"
                                >
                                  其他方式注册
                                </h5>
                                <hr />
                                <div
                                  class="d-flex justify-space-between align-center mx-10 mb-16"
                                  style="margin-top: 5%"
                                >
                                  <v-btn depressed outlined color="blue">
                                    <v-icon color="blue">fab fa-qq</v-icon>
                                  </v-btn>
                                  <v-btn
                                    depressed
                                    outlined
                                    color="green"
                                    style="margin-left: 22%"
                                  >
                                    <v-icon color="green">fab fa-weixin</v-icon>
                                  </v-btn>
                                  <v-btn
                                    depressed
                                    outlined
                                    color="red"
                                    style="margin-left: 21%"
                                  >
                                    <v-icon color="red">fab fa-weibo</v-icon>
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-col>
                      </v-row>
                    </v-window-item>
                  </v-window>
                </v-card>
              </v-col>
            </v-row>

            <v-snackbar v-model="snackbar">
              {{ message }}
              <template v-slot:action="{ attrs }">
                <v-btn
                  color="blue"
                  text
                  v-bind="attrs"
                  @click="snackbar = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </v-container>
        </v-form>
      </v-main>
    </div>

    <!--     <div class="login_container">
      <div class="login_box">
        <div class="login_welcome">
          <div>
            <h1 class="welcome">GRAND Manager - 城市智能停车管理系统</h1>
          </div>
        </div>
        <div>
          <el-form
            ref="LoginFormRef"
            :model="LoginForm"
            class="login_form"
            label-width="0"
            :rules="LoginRules"
            v-show="title != '注册'"
          >
            <h2>登陆</h2>
            <el-form-item class="form-item" prop="username">
              <el-input
                v-model="LoginForm.username"
                prefix-icon="iconfont icondenglu"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-item" prop="password">
              <el-input
                type="password"
                prefix-icon="iconfont iconmima"
                v-model="LoginForm.password"
                placeholder="请输入密码"
                @keyup.native.enter="login"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-button">
              <el-row type="flex" justify="center">
                <el-col :span="6">
                  <el-button
                    type="primary"
                    @click="login"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    >登陆</el-button
                  >
                </el-col>
                <el-col :span="6" :offset="4">
                  <el-button @click="register">注册</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <el-form
            ref="RegisterFormRef"
            :model="RegisterForm"
            class="login_form"
            :class="{ register: title == '注册' }"
            label-width="0"
            :rules="RegisterRules"
            v-show="title == '注册'"
          >
            <h2>注册</h2>
            <el-form-item class="form-item" prop="username">
              <el-input
                v-model="RegisterForm.username"
                prefix-icon="iconfont icondenglu"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-item" prop="password">
              <el-input
                type="password"
                prefix-icon="iconfont iconmima"
                v-model="RegisterForm.password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-item" prop="password1">
              <el-input
                type="password"
                prefix-icon="iconfont iconmima"
                v-model="RegisterForm.password1"
                placeholder="再次输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-item" prop="nickname">
              <el-input
                v-model="RegisterForm.nickname"
                prefix-icon="iconfont iconguanliyuan"
                placeholder="起一个昵称"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-show="title == '注册'"
              class="form-item"
              prop="email"
            >
              <el-input
                v-model="RegisterForm.email"
                prefix-icon="iconfont iconshangpin"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-button">
              <el-row type="flex" justify="center">
                <el-col :span="6">
                  <el-button
                    type="primary"
                    @click="login"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    >登陆</el-button
                  >
                </el-col>
                <el-col :span="6" :offset="4">
                  <el-button @click="register">注册</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
export default {
  data() {
    var checkPass = (rule, value, callback) => {
      if (value !== this.RegisterForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      options: [
        {
          value: "普通管理员账户",
          label: "普通管理员账户",
        },
        {
          value: "超级管理员账户",
          label: "超级管理员账户",
          disabled: true,
        },
      ],
      checked: true,
      value: "普通管理员账户",
      step: 1,
      show: false,
      show2: false,
      snackbar: false,
      message: "",

      usernameRules: [(v) => !!v || "*必填选项"],
      passwordRules: {
        required: (value) => !!value || "*必填选项",
        min: (v) => v.length >= 6 || "最少 6 位",
      },
      title: "登陆",
      fullscreenLoading: false,
      LoginForm: {
        username: "",
        password: "",
      },
      RegisterForm: {
        username: "",
        password: "",
        password1: "",
        nickname: "",
        email: "",
      },
      LoginRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      RegisterRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
        ],
        password1: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
          { validator: checkPass, trigger: "blur" },
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    passwordConfirmationRule() {
      return () => this.password === this.rePassword || "两次密码输入不一致";
    },
  },
  mounted() {
    this.$nextTick(() => {
      anime({
        targets: ".login_box",
        translateX: 250,
      });
    });
  },
  methods: {
    openFullScreen1() {
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    login() {
      // if (this.title == "注册") {
      //   anime({
      //     targets: ".login_box",
      //     translateY: 0,
      //   });
      //   this.title = "登陆";
      //   return;
      // }
      if (this.LoginForm.username && this.LoginForm.password) {
        this.fullscreenLoading = true;
        this.LoginForm.password = this.$md5(this.LoginForm.password);
        setTimeout(() => {
          this.$axios
            .post("login", this.LoginForm)
            .then((res) => {
              if (res && res.data.flag == "ok") {
                //登陆成功，存储session对象
                window.localStorage.setItem("user", res.data.username);
                window.localStorage.setItem("token", res.data.token);
                // this.$message.success("登陆成功！");
                this.$router.push({ path: "/main" });
              } else {
                this.$message.error("账户名或密码错误！");
                this.LoginForm.password = "";
              }
              this.fullscreenLoading = false;
            })
            .catch((error) => {
              this.$message.error("服务器错误！请联系管理员");
              this.LoginForm.password = "";
              this.fullscreenLoading = false;
            });
        }, 600);
      } else {
        this.$message.error("请输入完整信息！");
      }
    },
    register() {
      // if (this.title == "登陆") {
      //   this.title = "注册";
      //   anime({
      //     targets: ".login_box",
      //     translateY: -100,
      //   });
      //   return;
      // }
      if (
        this.RegisterForm.username &&
        this.RegisterForm.password &&
        this.RegisterForm.password1 &&
        this.RegisterForm.email &&
        this.RegisterForm.nickname
      ) {
        this.fullscreenLoading = true;
        this.RegisterForm.password = this.$md5(this.RegisterForm.password);
        setTimeout(() => {
          this.$axios.post("register", this.RegisterForm).then((res) => {
            console.log(res);
            if (res.data.addFlag == true) {
              this.fullscreenLoading = false;
              this.$message.success("注册成功！");
              this.title = "登陆";
              this.RegisterForm.username = "";
              this.RegisterForm.nickname = "";
              this.RegisterForm.email = "";
              this.RegisterForm.password = "";
              this.RegisterForm.password1 = "";
              this.step = 1;
            } else {
              this.fullscreenLoading = false;
              this.RegisterForm.password = "";
              this.RegisterForm.password1 = "";
              this.$message.error("注册失败，请重试");
            }
          });
        }, 800);
      } else {
        this.$message.error("请输入完整信息！");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100%;
  transition: 0.5s;
  background: url("../assets/pic/bg.png");
  background-size: 100% 100%;
  // background-color: #448994;
}
.login_box {
  position: absolute;
  top: 15%;
  .login_welcome {
    color: rgb(0, 0, 0);
    margin-bottom: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.login_form {
  border: 1px solid #fdebd6;
  transform: 0.5s;
  background-color: #fff;
  border-radius: 10px;
  // box-shadow: 10px 10px rgb(144, 144, 144);
  width: 450px;
  height: 300px;
  display: table-cell;
  vertical-align: middle;
  &_register {
    height: 500px;
  }
  h2 {
    margin: 10% auto;
    display: flex;
    justify-content: center;
  }
  .form-item {
    width: 300px;
    margin: auto auto 30px;
  }
  .form-button {
    width: 300px;
    margin: 40px auto 50px;
  }
}
.register {
  background-color: #fff;
  transition: 0.5s;
  border-radius: 10px;
  width: 450px;
  height: 490px;
  display: table-cell;
  vertical-align: middle;
  h2 {
    margin: 10% auto;
    display: flex;
    justify-content: center;
  }
  .form-item {
    width: 300px;
    margin: auto auto 30px;
  }
  .form-button {
    width: 300px;
    margin: 40px auto 50px;
  }
}
.el-input__inner {
  height: 32px !important;
}
.bold {
  font-weight: bold;
}
.rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}
.rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}
.btn-dimensions {
  min-height: 25px;
  max-width: 200px;
}
.v-text-field--outlined.v-input--dense.v-text-field--outlined
  > .v-input__control
  > .v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--outlined.v-text-field--filled
  > .v-input__control
  > .v-input__slot {
  min-height: 20px;
  max-width: 500px !important;
}
</style>
