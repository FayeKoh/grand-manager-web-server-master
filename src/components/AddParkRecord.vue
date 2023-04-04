<template>
  <div>
    <!-- <div class="info-title">停车记录录入</div> -->
    <el-dialog
      title="新增停车记录"
      :visible.sync="dialogVisible"
      @close="close"
    >
      <el-tabs class="info-tabs" v-model="activeName">
        <el-tab-pane label="单条录入" name="single">
          <div>
            <el-row :gutter="20">
              <el-col :xs="14" :sm="14" :md="14" :lg="12" :xl="12">
                <div class="info-input">
                  <el-form
                    ref="parkInput"
                    :label-position="labelPosition"
                    label-width="120px"
                    :model="ParkInput"
                    class="info-form"
                    :rules="addRule"
                    v-loading.fullscreen.lock="fullscreenLoading"
                  >
                    <el-form-item label="地区名称" prop="parkArea">
                      <el-select
                        class="role-select"
                        v-model="ParkInput.parkArea"
                        placeholder="选择地区"
                        @change="getPark"
                        @clear="resetForm"
                        clearable
                      >
                        <el-option
                          v-for="(item, i) in parkAreaList"
                          :key="i"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="停车场名称" prop="park">
                      <el-select
                        class="role-select"
                        v-model="ParkInput.park"
                        placeholder="选择停车场"
                        @change="selectPark"
                        clearable
                      >
                        <el-option
                          v-for="(item, i) in parkNameList"
                          :key="i"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="车牌号" prop="plate">
                      <el-input
                        class="formInput"
                        v-model="ParkInput.plate"
                        placeholder="请填写车牌号"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="进出模式" prop="mode">
                      <el-select
                        class="role-select"
                        v-model="ParkInput.mode"
                        placeholder="选择进出模式"
                        clearable
                      >
                        <el-option label="进入" value="进入"></el-option>
                        <el-option label="离开" value="离开"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="停车时间" prop="parking_time">
                      <el-date-picker
                        class="role-select"
                        v-model="ParkInput.parking_time"
                        type="datetime"
                        placeholder="选择日期时间"
                        clearable
                        start-placeholder="right"
                      >
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="" prop="">
                      <el-button
                        class="role-button"
                        type="primary"
                        @click="addSubmit"
                        >提 交</el-button
                      >
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="上传数据" name="upload">
          <div>
            <el-row :gutter="20">
              <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="7">
                <el-upload
                  class="upload-demo"
                  drag
                  ref="upload"
                  :action="uploadAction"
                  :before-upload="beforeUpload"
                  :on-progress="progressCallback"
                  :on-success="successCallBack"
                  :on-error="errorCallBack"
                  accept=".xls,.xlsx,.txt"
                  :file-list="fileList"
                  :auto-upload="false"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                  </div>
                  <!-- <el-button slot="trigger" type="primary">选取文件</el-button> -->
                  <div slot="tip" class="el-upload__tip">
                    只能上传xls,xlsx,txt文件，且不超过2GB
                  </div>
                </el-upload>
                <el-button
                  style="width: 360px"
                  type="primary"
                  @click="submitUpload"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  >确认上传</el-button
                >
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created: function () {
    this.ParkInfo = [];
    this.loading = true;
    this.uploadAction = "http://localhost:9000/uploadFiles/upload";
    this.getParkInfo();
    this.getAreaList();
  },
  data() {
    return {
      dialogVisible: false,
      activeName: "single",
      loading: false,
      labelPosition: "right",
      fullscreenLoading: false,
      ParkInput: {
        parkArea: "",
        park: "",
        plate: "浙A",
        mode: "",
        parking_date: "",
        parking_time: "",
      },
      parkAreaList: [],
      parkNameList: [],
      park: "",
      parkcode: "",
      activeNames: [0, 1, 2, 3, 4, 5],
      ParkInfo: [],
      addRule: {
        parkArea: [{ required: true, message: "请选择地区" }],
        park: [{ required: true, message: "请选择停车场" }],
        plate: [
          { required: true, message: "请填写车牌号" },
          {
            pattern:
              /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/,
            message: "车牌号检测错误",
            trigger: "blur",
          },
        ],
        mode: [{ required: true, message: "请选择进出情况" }],
        parking_time: [{ required: true, message: "请选择时间" }],
      },
      uploadAction: "",
      fileList: [],
    };
  },
  methods: {
    close() {
      this.$refs.parkInput.resetFields()
      this.activeName = "single"
    },
    open() {
      this.dialogVisible = true;
    },
    resetForm() {
      console.log("clear");
      this.$refs.parkInput.resetFields();
      this.parkNameList = [];
    },
    getParkInfo() {
      setTimeout(() => {
        this.$axios.post("getParkInfo").then((res) => {
          // console.log(res.data);
          this.ParkInfo = res.data;
        });
        this.loading = false;
      }, 700);
    },
    //获取区域信息
    getAreaList() {
      var tempArr = [];
      this.$axios.post("getParkPositionList").then((res) => {
        // console.log(res.data.parkList);
        res.data.parkList.forEach((item) => {
          tempArr.push(item.areaname);
        });
        this.parkAreaList = this.unique(tempArr);
      });
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    // 拿到停车场数据
    getPark() {
      // console.log(this.ParkInput.parkArea);
      if (this.ParkInput.parkArea != "") {
        this.$axios
          .post("getParkByParkArea", { areaname: this.ParkInput.parkArea })
          .then((res) => {
            // console.log(res);
            let tempPark = [];
            res.data.park.forEach((item) => {
              tempPark.push(item.parkname);
            });
            this.parkNameList = tempPark;
          });
      }
    },
    // 选择停车场
    selectPark() {
      if (this.ParkInput.park != "") {
        this.$axios
          .post("getParkByParkName", {
            areaname: this.ParkInput.parkArea,
            parkname: this.ParkInput.park,
          })
          .then((res) => {
            // console.log(res);
            this.park = res.data.park;
            console.log(this.park);
          });
      }
    },
    addSubmit() {
      // this.fullscreenLoading = true;
      setTimeout(() => {
        this.$refs.parkInput.validate((valid) => {
          if (valid) {
            this.ParkInput.parking_date = this.$moment(
              this.ParkInput.parking_time
            ).format("YYYY-MM-DD");
            this.ParkInput.parking_time = this.$moment(
              this.ParkInput.parking_time
            ).format("HH:mm:ss");
            let xinghao = this.ParkInput.plate.length == 7 ? "****" : "*****";
            (this.ParkInfo.plate =
              this.ParkInput.plate.substr(0, 2) +
              xinghao +
              this.ParkInput.plate.substr(
                this.ParkInput.plate.length - 1,
                this.ParkInput.plate.length
              )),
              // console.log("plate:"+this.ParkInfo.plate);
              this.$axios
                .post("addParkingRecord", {
                  mode: this.ParkInput.mode,
                  parking_id: this.park.parkcode,
                  plate_no: this.ParkInfo.plate,
                  parking_date: this.ParkInput.parking_date,
                  parking_time: this.ParkInput.parking_time,
                  park_hour: parseInt(
                    this.ParkInput.parking_time.substring(0, 2)
                  ),
                  total_berth: this.park.total_berth,
                  park_area: this.ParkInput.parkArea,
                  park_name: this.ParkInput.park,
                })
                .then((res) => {
                  // console.log(this.ParkInput);
                  // console.log(res.data);
                  if (res.data.add) {
                    this.$message.success("添加记录成功！");
                    this.$refs.parkInput.resetFields();
                    this.$parent.loadParkRecord();
                  } else {
                    this.$message.error("添加记录失败");
                  }
                });
            // this.fullscreenLoading = false;
          } else {
            // this.fullscreenLoading = false;
            this.$message.error("填写信息错误");
          }
        });
      }, 500);
    },
    // 上传文件
    async submitUpload() {
      await this.$refs.upload.submit();
    },
    beforeUpload(file) {
      console.log(file);
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const extension3 = testmsg === "txt";
      const isLt2M = file.size / 1024 / 1024 / 1024 < 2;
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: "上传文件只能是 xls、xlsx、txt格式!",
          type: "warning",
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 2GB!",
          type: "warning",
        });
      }
      return (extension || extension2 || extension3) && isLt2M;
      // return extension || extension2;
    },
    errorCallBack(error, file, fileList) {
      this.fullscreenLoading = false;
      this.$message.error("文件上传错误");
      console.log(file, fileList);
    },
    progressCallback(upload, file, fileList) {
      this.fullscreenLoading = true;
      console.log(file);
    },
    successCallBack(response, file, fileList) {
      console.log(response);
      if (response.rtn == "success") {
        this.$message.success("文件上传成功！");
      } else {
        this.$message.error("文件上传失败");
      }
      this.fullscreenLoading = false;
      console.log(file);
      // console.log(fileList);
    },
    selectpark(val) {
      console.log(val);
    },
    handleChange(val) {
      // console.log(val);
    },
  },
};
</script>

<style lang="less" scoped>
.info-tabs {
  padding: 0px 0px 0px 5px;
}
.info-title {
  padding: 0px 0px 20px 5px;
  font-size: 150%;
  font-weight: 600;
}
.info-tip {
  font-size: 120%;
  font-weight: 400;
  padding: 10px 0px 30px 5px;
}
.upload-demo {
  width: auto !important;
  margin-top: 20px;
}
.el-upload__tip {
  margin: 20px 0px 20px 0px;
}
.parkinfo {
  margin-left: 1%;
}
.formInput {
  width: 80% !important;
  margin-left: 10%;
}
.role-select {
  width: 80% !important;
  margin-left: 10%;
}
.role-button {
  width: 80% !important;
  margin-left: 10%;
}
.park-commit {
  margin-top: 20px !important;
  margin-left: 7% !important;
}
/deep/.el-form-item__error {
  margin-left: 10%;
}
</style>
