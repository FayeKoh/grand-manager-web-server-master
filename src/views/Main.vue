<template>
  <el-container>
    <v-main>
      <v-app-bar app class="px-1 app-name" color="black" elevate-on-scroll>
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
          <!-- <v-btn
              bold
              dark
              style="margin-right: 20px"
              rounded
              color="#283443"
              @click=""
              >进入官网</v-btn
            > -->
          <el-dropdown placement="bottom-start">
            <span class="el-dropdown-link">
              <v-btn
                bold
                dark
                style="margin-right: 20px"
                rounded
                color="#283443"
                @click=""
                >{{ username }} <i class="el-icon-arrow-down el-icon--right"></i
              ></v-btn>
              <!-- <div class="main-welcome">
              {{ username }} <i class="el-icon-arrow-down el-icon--right"></i>
            </div> -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-link
                  icon="el-icon-info"
                  type="primary"
                  :underline="false"
                  @click="toUserInfo"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  >账户信息</el-link
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-link
                  icon="el-icon-warning"
                  type="primary"
                  :underline="false"
                  @click="logout"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  >退出登录</el-link
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </v-list>
      </v-app-bar>
    </v-main>
    <!-- <el-header class="main-header">
      <div class="main-title">
        <p>GRAND Manager</p>
      </div>
      <div class="main-logout">
        
      </div>
    </el-header> -->
    <el-container>
      <el-aside class="main-aside">
        <el-menu
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          :collapse="collapse"
          :unique-opened="true"
          router
        >
          <el-menu-item index="/Home" @click="jumpTo">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="1" v-if="token">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>账户管理</span>
            </template>
            <el-menu-item index="/UserList" @click="jumpTo"
              >账户列表</el-menu-item
            >
          </el-submenu>
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span>数据录入</span>
            </template>
            <el-menu-item index="/AddParkRecord" @click="jumpTo"
              >停车记录</el-menu-item
            >
            <el-menu-item index="/AddPark" @click="jumpTo"
              >停车场信息</el-menu-item
            >
          </el-submenu> -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>停车管理</span>
            </template>
            <el-menu-item index="/SearchPark" @click="jumpTo"
              >停车场管理</el-menu-item
            >
            <el-menu-item index="/SearchParkRecord" @click="jumpTo"
              >停车记录管理</el-menu-item
            >
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-marketing"></i>
              <span>停车数据分析</span>
            </template>
            <el-menu-item index="/AreaFlow" @click="jumpTo"
              >停车区域车流统计</el-menu-item
            >
            <el-menu-item index="/TimeAnalysis" @click="jumpTo"
              >停车场时段分析</el-menu-item
            >
            <el-menu-item index="/Forecast" @click="jumpTo"
              >时段车位预测</el-menu-item
            >
          </el-submenu>
          <!-- <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-promotion"></i>
              <span>车位预测</span>
            </template>
            <el-menu-item index="/Forecast" @click="jumpTo"
              >时段车位预测</el-menu-item
            >
          </el-submenu> -->
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-s-opportunity"></i>
              <span>操作手册</span>
            </template>
            <el-menu-item index="/operateManual" @click="jumpTo"
              >系统操作步骤</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main-main" :class="{ width: screenWidth > 1100 }">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created: function loadMessage() {
    this.username = window.localStorage.getItem("user");
    this.token = window.localStorage.getItem("token") === this.$md5("超级管理员");
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth;
    };
  },
  mounted() {
    if (this.screenWidth > 1100) {
      this.collapse = false;
    }
  },
  watch: {
    screenWidth() {
      this.screenWidth < 1100
        ? (this.collapse = true)
        : (this.collapse = false);
      this.screenWidth < 1100 ? (this.mainClass = "main-main") : "main-width";
    },
  },
  data() {
    return {
      username: "",
      token: false,
      fullscreenLoading: false,
      collapse: true,
      screenWidth: document.body.clientWidth,
      mainClass: "main-width",
    };
  },
  methods: {
    jumpTo(val) {
      this.$router.push(val.index);
    },
    logout() {
      window.localStorage.clear();
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$router.push("/login");
        this.$message.success("已登出，请重新登陆！");
      }, 800);
    },
    toUserInfo() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$router.push("/Info");
      }, 500);
    },
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // },
  },
};
</script>

<style lang="less" scoped>
.main-header {
  position: relative;
  height: 60px !important;
  display: flex;
  align-items: center;
  // background: #555555;
  background-image: linear-gradient(
    to bottom,
    #1c2937,
    #2e444c,
    #495f5f,
    #6c7b73,
    #91968b
  );
}
.main-aside {
  display: block;
  position: absolute;
  width: auto !important;
  left: 0;
  top: 60px;
  bottom: 0;
}
.main-main {
  position: absolute;
  transition: 0.5s;
  left: 60px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
  &.width {
    left: 200px;
  }
}
.main-title {
  font-size: 150%;
  font-weight: 800;
  color: white;
  text-decoration: none;
}
.main-welcome {
  font-size: 110%;
  color: white;
}
.main-logout {
  color: white;
  position: absolute;
  right: 1%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
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
