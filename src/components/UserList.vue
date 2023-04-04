<template>
  <div>
    <!-- <div class="component-title">用户列表</div> -->
    <el-row class="function-area" :gutter="20">
      <el-col :span="16" :offset="0">
        <el-button type="primary" icon="el-icon-plus" @click="handleAddUser"
          >新增</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-delete"
          @click="handleDeleteUser"
          >批量删除</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="exportExcel"
          style="margin-left: 10px"
          >导出表格数据</el-button
        >
      </el-col>
      <el-col :span="6" :offset="2">
        <el-input
          v-model="search_text"
          placeholder="请输入关键字"
          clearable
          @clear="loadUserList"
          @keyup.enter.native="handleSearch"
          @input="handleSearch"
        ></el-input>
      </el-col>

      <!-- <el-col :span="2" :offset="0">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </el-col> -->
    </el-row>
    <div>
      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        @selection-change="handleSelectionChange"
        @cell-click="cellclick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- <el-table-column
          fixed
          prop="id"
          label="编号"
          width="150"
        ></el-table-column> -->
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="nickname" label="账户名称"> </el-table-column>
        <el-table-column prop="username" label="账户昵称"> </el-table-column>
        <el-table-column prop="email" label="电子邮箱"> </el-table-column>
        <el-table-column prop="role" label="用户权限"> </el-table-column>
        <el-table-column prop="create_time" label="创建日期"> </el-table-column>
        <!-- <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleShow(scope.$index, scope.row)"
              >查看</el-button
            >
            <el-button
              :disabled="disabledDelete"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <div class="user-page">
      <el-pagination
        @size-change="SizeChange"
        @current-change="CurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="userListLength"
      >
      </el-pagination>
    </div>

    <el-dialog title="用户信息" :visible.sync="showInfo" width="30%" center>
      <span>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :model="rowInfo"
            >
              <el-form-item label="登录账户">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.username
                }}</span>
              </el-form-item>
              <el-form-item label="账户昵称">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.nickname
                }}</span>
              </el-form-item>
              <el-form-item label="用户邮箱">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.email
                }}</span>
              </el-form-item>
              <el-form-item label="用户权限">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.role
                }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.create_time
                }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showInfo = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增账户"
      :visible.sync="addUserVisible"
      width="30%"
      center
    >
      <el-row>
        <el-col :span="20" :offset="2">
          <div>
            <el-form
              ref="addUser"
              :label-position="labelPosition"
              label-width="80px"
              :model="addUser"
              :rules="addRule"
            >
              <el-form-item label="账户名称" prop="username">
                <el-input
                  class="formInput"
                  v-model="addUser.username"
                ></el-input>
              </el-form-item>
              <el-form-item label="登录密码" prop="password">
                <el-input
                  class="formInput"
                  v-model="addUser.password"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="password1">
                <el-input
                  class="formInput"
                  v-model="addUser.password1"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item label="账户昵称" prop="nickname">
                <el-input
                  class="formInput"
                  v-model="addUser.nickname"
                ></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input class="formInput" v-model="addUser.email"></el-input>
              </el-form-item>
              <el-form-item label="用户权限" prop="role">
                <el-select
                  class="formInput"
                  v-model="addUser.role"
                  placeholder="请选择用户权限"
                >
                  <el-option
                    v-for="item in role"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableExcel from "../data/tableExcel";
import { getYMDHMS } from "@/utils/util";
import qs from "Qs";
export default {
  created: function loadData() {
    this.loadUserList();
    this.loadUserListForExport();
    this.UserInfo.username = window.localStorage.getItem("user");
    this.$axios.post("getUserInfo", this.UserInfo).then((res) => {
      if (res.data.UserInfo.role == "超级管理员") {
        this.disabledDelete = false;
        this.addUserPermission = true;
      }
    });
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      idList: [],
      //显示对话框信息
      showInfo: false,
      //添加用户对话框
      addUserVisible: false,
      addUserPermission: false,
      disabledDelete: true,
      //表单的对齐方式
      labelPosition: "right",
      loading: true,
      search_text: "",
      PagedQuery: { currentPage: 0, pageSize: 0, searchKey: "" },
      userList: [],
      userListForExport: [],
      userListLength: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50],
      // 获取当前用户信息
      UserInfo: {
        username: "",
        nickname: "",
        email: "",
        role: "",
        create_time: "",
      },
      rowInfo: {
        username: "",
        nickname: "",
        email: "",
        role: "",
        create_time: "",
      },
      addUser: {
        username: "",
        password: "",
        password1: "",
        nickname: "",
        email: "",
        role: "",
      },
      role: [
        {
          value: "超级管理员",
          label: "超级管理员",
        },
        {
          value: "普通管理员",
          label: "普通管理员",
        },
      ],
      addRule: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
        ],
        password1: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
          { validator: validatePass2, trigger: "blur", required: true },
        ],
        nickname: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择用户权限", trigger: "blur" }],
      },
    };
  },
  methods: {
    cellclick(row, column, cell, event) {
      this.handleShow(row);
    },
    exportExcel() {
      const branch_name = null;
      tableExcel(
        this.dealDownloadFileData(),
        branch_name,
        this.currentDate,
        (res) => {
          if (res == "success") {
            this.$Message.success("数据导出成功");
          }
        }
      );
    },
    dealDownloadFileData() {
      let data = [];
      for (let i = 0; i < this.userListForExport.length; i++) {
        data.push({});
      }
      this.userListForExport.forEach((item, index) => {
        data[index] = {
          index: index + 1,
          nickname: item["nickname"] ? item["nickname"] : "/",
          username: item["username"] ? item["username"] : "/",
          email: item["email"] ? item["email"] : "/",
          role: item["role"] ? item["role"] : "/",
          create_time: item["create_time"] ? item["create_time"] : "/",
        };
      });
      return data;
    },
    handleSelectionChange(selection) {
      let ids = [];
      selection.forEach((item) => {
        if (item.id) {
          ids = ids.concat(item.id);
        }
      });
      this.idList = ids;
    },
    // 获取用户数量
    getListLength() {
      this.$axios.get("getUserListLength").then((res) => {
        this.userListLength = res.data;
      });
    },
    //初始页面加载和清空输入框时调用
    loadUserList() {
      this.loading = true;
      setTimeout(() => {
        this.getListLength();
        this.PagedQuery = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        };
        this.$axios
          .post("loadUserList", this.PagedQuery)
          .then((res) => {
            let temp = res.data.userList;
            temp.forEach((item) => {
              item.create_time = getYMDHMS(item.create_time);
              // console.log(item);
            });
            this.userList = temp;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }, 1000);
    },
    loadUserListForExport() {
      setTimeout(() => {
        this.getListLength();
        this.PagedQuery = {
          currentPage: 1,
          pageSize: 99999,
        };
        this.$axios
          .post("loadUserList", this.PagedQuery)
          .then((res) => {
            let temp = res.data.userList;
            temp.forEach((item) => {
              item.create_time = getYMDHMS(item.create_time);
              // console.log(item);
            });
            this.userListForExport = temp;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {});
      }, 1000);
    },
    //搜索关键字
    handleSearch() {
      this.loading = true;
      this.PagedQuery = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        searchKey: this.search_text,
      };
      setTimeout(() => {
        this.$axios.post("searchUserLength", this.PagedQuery).then((res) => {
          this.userListLength = res.data;
          if (this.userListLength < (this.currentPage - 1) * this.pageSize) {
            this.currentPage =
              parseInt(this.userListLength / this.pageSize) + 1;
            this.PagedQuery.currentPage = this.currentPage;
          }
          this.$axios.post("searchUser", this.PagedQuery).then((res) => {
            res.data.userList.forEach((item) => {
              item.create_time = getYMDHMS(item.create_time);
            });
            this.userList = res.data.userList;
          });
        });
        this.loading = false;
      }, 500);
    },
    //改变每页显示数目
    SizeChange(val) {
      this.loading = true;
      this.pageSize = val;
      this.PagedQuery = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        searchKey: this.search_text,
      };
      setTimeout(() => {
        this.$axios.post("loadUserList", this.PagedQuery).then((res) => {
          res.data.userList.forEach((item) => {
            item.create_time = getYMDHMS(item.create_time);
          });
          this.userList = res.data.userList;
          this.getListLength();
        });
        this.loading = false;
      }, 500);
    },
    //切换页面
    CurrentChange(val) {
      this.loading = true;
      this.currentPage = val;
      this.PagedQuery = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      setTimeout(() => {
        this.$axios.post("loadUserList", this.PagedQuery).then((res) => {
          res.data.userList.forEach((item) => {
            item.create_time = getYMDHMS(item.create_time);
          });
          this.userList = res.data.userList;
          this.getListLength();
        });
        this.loading = false;
      }, 500);
    },
    handleShow(row) {
      this.rowInfo = row;
      this.showInfo = true;
    },
    handleDelete(index, row) {
      this.rowInfo = row;
      let meg =
        "您将删除用户名为 " +
        row.username +
        " 的用户，删除后该用户将无法登录！";
      this.$confirm(meg, "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$axios
          .post("deleteUser", { username: row.username })
          .then((res) => {
            // console.log(res);
            if (res.data.doDelete == 1) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getListLength();
              this.loadUserList();
            } else {
              this.$message({
                type: "error",
                message: "操作失败！",
              });
              this.loadUserList();
            }
          });
      });
    },
    handleDeleteUser() {
      if (this.idList) {
        let meg = "您将删除选中的用户，删除后该用户将无法登录！";
        this.$confirm(meg, "删除用户", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }).then(() => {
          this.$axios.post("deleteIDs", { ids: this.idList }).then((res) => {
            // console.log(res);
            if (res.data.doDelete == 1) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getListLength();
              this.loadUserList();
            } else {
              this.$message({
                type: "error",
                message: "操作失败！",
              });
              this.loadUserList();
            }
          });
        });
      } else {
        this.$message({
          showClose: true,
          message: "请选择删除项",
          type: "warning",
        });
      }
    },

    handleAddUser() {
      if (this.addUserPermission) {
        this.addUserVisible = true;
      } else {
        this.$message.error("您没有添加用户的权限！");
      }
    },
    //添加用户点击确定
    addSubmit() {
      // console.log(this.addUser);
      this.$refs.addUser.validate((valid) => {
        if (valid) {
          this.$axios
            .post("addUser", {
              username: this.addUser.username,
              password: this.$md5(this.addUser.password),
              nickname: this.addUser.nickname,
              email: this.addUser.email,
              role: this.addUser.role,
            })
            .then((res) => {
              if (res.data.insert) {
                this.$message.success("添加用户成功!");
                this.addUserVisible = false;
                this.getListLength();
                //刷新列表并清空数据
                this.loadUserList();
                this.addUser = {};
              } else {
                this.$message.error("添加用户出错！");
              }
            });
        } else {
          this.$message.error("信息填写错误！");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-table .cell:hover {
  background-color: red;
}
.function-area {
  display: flex;
  margin-bottom: 20px;
  el-input {
    width: auto;
  }
}
.component-title {
  padding: 0px 0px 20px 5px;
  font-size: 150%;
  font-weight: 600;
}
.user-page {
  text-align: center;
  margin: 30px 20px 20px 0px;
}
.formSpan {
  margin-left: 10%;
  font-weight: 600;
}
.formInput {
  width: 90% !important;
  margin-left: 10%;
}
.el-dialog--center .el-dialog__body {
  padding: 25px 25px 0px 25px;
}
.role-select {
  margin-left: 10%;
}
/deep/.el-form-item__error {
  margin-left: 10%;
}
</style>
