<template>
  <div>
    <!-- <div class="info-title">停车场录入</div> -->
    <el-dialog
      title="新增停车场信息"
      :visible.sync="dialogVisible"
      @close="close"
      width="70%"
    >
    <div>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :md="12" :lg="10" :xl="10">
          <div class="info-input">
            <el-form
              ref="park"
              :label-position="labelPosition"
              label-width="120px"
              :model="addPark"
              class="park-form"
              :rules="addParkRule"
            >
              <el-form-item label="地区名称" prop="areaname">
                <el-input
                  id="areainput"
                  v-model="addPark.areaname"
                  placeholder="填写地区名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="停车场名称" prop="parkname">
                <el-input
                  id="parkinput"
                  v-model="addPark.parkname"
                  placeholder="填写停车场名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="地区编码" prop="areacode">
                <el-input
                  v-model="addPark.areacode"
                  placeholder="填写地区编码"
                ></el-input>
              </el-form-item>
              <el-form-item label="停车场编码" prop="parkcode">
                <el-input
                  v-model="addPark.parkcode"
                  placeholder="填写停车场编码"
                ></el-input>
              </el-form-item>
              <el-form-item label="总停车位数量" prop="total_berth">
                <el-input
                  v-model.number="addPark.total_berth"
                  placeholder="填写总停车位数量"
                ></el-input>
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
        <el-col :xs="12" :sm="12" :md="12" :lg="14" :xl="14">
          <div class="park-map">
            <div v-if="show" id="container" class="allmap"></div>
            <div v-else>地图获取失败！</div>
          </div>
        </el-col>
      </el-row>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { BMPGL } from "../utils/bmpgl";
export default {
  mounted() {
    
  },
  watch: {
    district: function () {
      this.addPark.areaName = this.district;
    },
  },
  data() {
    return {
      dialogVisible: false,
      location: {
        lng: 121.56432,
        lat: 29.81726,
      },
      ak: "sWpI7CCvY8K5lbjwmMLG2ANjUOBZq1Kg", // 百度的地图密钥
      // ak: "DD279b2a90afdf0ae7a3796787a0742e", // 百度的地图密钥
      myMap: null,
      show: true,
      labelPosition: "right",
      addPark: {
        areaname: "",
        parkname: "",
        areacode: "",
        parkcode: "",
        longitude: 0,
        latitude: 0,
        total_berth: "",
        address: "",
      },
      addParkRule: {
        areaname: [
          { required: true, message: "请在地图上选择地点", trigger: "change" },
        ],
        parkname: [
          { required: true, message: "请在地图上选择地点", trigger: "change" },
        ],
        areacode: [
          { required: true, message: "请填写区域号", trigger: "blur" },
        ],
        parkcode: [
          { required: true, message: "请填写停车场编号", trigger: "blur" },
        ],
        total_berth: [
          { required: true, message: "请填写总停车位", trigger: "blur" },
          { type: "number", message: "总停车位必须为数字" },
        ],
      },
    };
  },
  methods: {
    close() {
      this.$refs.park.resetFields()
    },
    open() {
      this.initMap();
      this.dialogVisible = true;
    },
    addSubmit() {
      this.$refs.park.validate((validate) => {
        if (validate) {
          console.log(this.addPark);
          this.$axios
            .post("addParkPositionRecord", this.addPark)
            .then((res) => {
              this.$message.success("提交成功！");
              this.$refs["park"].resetFields();
              this.$parent.getAreaList();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("提交失败");
            })
            .finally(() => {
              console.log("final");
            });
        } else {
          this.$message.error("请正确填写信息！");
        }
      });
    },
    initMap() {
      let that = this;
      that.addPark.longitude = that.location.lng;
      that.addPark.latitude = that.location.lat;
      // 传入密钥获取地图回调。
      BMPGL(this.ak)
        .then((BMapGL) => {
          // 创建地图实例
          let map = new BMapGL.Map("container");
          //获取定位，设定地图初始化地点
          let point = new BMapGL.Point(that.location.lng, that.location.lat);
          // 初始化地图，设置中心点坐标和地图级别
          map.centerAndZoom(point, 18);
          //开启鼠标滚轮缩放
          map.enableScrollWheelZoom(true);
          map.setHeading(64.5);
          map.setTilt(45);
          // 创建交通流量图层实例
          // var traffic = new BMap.TrafficLayer();
          // map.addTileLayer(traffic);
          // 保存数据
          // this.myMap = map
          var geoc = new BMapGL.Geocoder();

          // 拖拽事件
          // map.addEventListener("dragend", function () {
          // });
          function getFirstLoadCenterLocation() {
            var center = map.getCenter();
            console.log(center);
            map.clearOverlays();
            var marker = new BMapGL.Marker(
              new BMapGL.Point(center.lng, center.lat)
            );
            map.addOverlay(marker);

            geoc.getLocation(
              new BMapGL.Point(center.lng, center.lat),
              function (result) {
                var addComp = result.addressComponents;
                that.addPark.areaname = addComp.district;
                that.addPark.parkname = addComp.street + addComp.streetNumber;
              }
            );
            //执行后注销事件，保证只执行一次
            map.removeEventListener("tilesloaded", getFirstLoadCenterLocation);
          }
          // 加载完成事件
          map.addEventListener("tilesloaded", getFirstLoadCenterLocation);
          //点击事件
          map.addEventListener("click", function (e) {
            //清除地图上所有的覆盖物
            map.clearOverlays();
            var pt = e.latlng;
            console.log(pt);
            that.addPark.longitude = pt.lng;
            that.addPark.latitude = pt.lat;
            var marker = new BMapGL.Marker(new BMapGL.Point(pt.lng, pt.lat));
            map.addOverlay(marker);

            geoc.getLocation(pt, function (rs) {
              var addComp = rs.addressComponents;
              console.log(addComp);
              that.addPark.areaname = addComp.district;
              that.addPark.parkname = addComp.street + addComp.streetNumber;
              that.addPark.address =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
            });
          });
        })
        .catch((err) => {
          if (err) {
            this.show = false;
            console.log(err);
          }
        });
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
.park-commit {
  margin-top: 20px !important;
  margin-left: 10% !important;
}
.allmap {
  width: 100%;
  height: 600px;
  position: relative;
  z-index: 1;
}
/deep/.BMap_cpyCtrl {
  display: none;
}
/deep/.anchorBL {
  display: none;
}
.role-button {
  width: 100% !important;
  // margin-left: 10%;
}
</style>
