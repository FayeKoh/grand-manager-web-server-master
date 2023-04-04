<template>
  <div>
    <!-- <div class="info-title">停车场查询</div> -->
    <!-- <el-row type="flex" justify="left" class="searchRow"> -->
    <!-- <el-col :span="20">
        <el-button type="primary" @click="openAddPark" icon="el-icon-plus"
          >新增</el-button
        >
        <el-button type="primary" @click="dialogTableVisible = true"
          >查看详情</el-button
        >
      </el-col> -->
    <!-- <el-col :span="4">
        <el-input
          v-model="searchPark"
          placeholder="搜索地区"
          @keyup.enter.native="search"
          @change="ifclear"
          clearable
        ></el-input>
      </el-col> -->
    <!-- <el-col :span="4">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-col> -->
    <!-- </el-row> -->
    <!-- <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="park-map">
          <div v-if="show" id="container" class="allmap"></div>
          <div v-else>地图获取失败！</div>
        </div>
      </el-col>
    </el-row> -->
    <el-row class="function-area" :gutter="0">
      <el-col>
        <el-button type="primary" @click="openAddPark" icon="el-icon-plus"
          >新增</el-button
        >
        <el-button type="primary" @click="exportExcel" icon="el-icon-download"
          >导出全部数据</el-button
        >
      </el-col>
      <el-col style="margin-left: 50%">
        <el-input
          style="width: 200px"
          v-model="searchForParkName"
          placeholder="请输入停车场名称"
          @input="searchParkName"
        >
        </el-input>
        <el-input
          style="width: 200px"
          v-model="searchForParkCode"
          placeholder="请输入停车场编码"
          @input="searchParkCode"
        ></el-input>
      </el-col>
    </el-row>
    <el-table
      border
      style="margin-top: 20px"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      :data="parkList"
    >
      <el-table-column type="index" label="序号" width="100"> </el-table-column>
      <el-table-column property="parkname" label="停车场名称"></el-table-column>
      <el-table-column property="parkcode" label="停车场编码"></el-table-column>
      <el-table-column
        property="total_berth"
        label="总停车位数量"
        width="150"
      ></el-table-column>
      <el-table-column
        property="areaname"
        label="地区名称"
        width="150"
      ></el-table-column>
      <el-table-column
        property="areacode"
        label="地区编码"
        width="200"
      ></el-table-column>
      <el-table-column property="address" label="详细地址"></el-table-column>
    </el-table>
    <el-dialog
      title="停车场详情"
      :visible.sync="dialogTableVisible"
      width="70%"
    >
      <el-row type="flex" justify="center">
        <el-col :span="4"
          ><el-input
            style="width: 200px"
            v-model="searchForParkName"
            placeholder="请输入停车场名称"
            @input="searchParkName"
          ></el-input
        ></el-col>
        <el-col :span="24"
          ><el-input
            style="width: 200px"
            v-model="searchForParkCode"
            placeholder="请输入停车场编码"
            @input="searchParkCode"
          ></el-input
        ></el-col>
        <el-col :span="3"
          ><el-button type="primary" @click="exportExcel"
            >导出全部数据</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="parkList" border style="margin-top: 20px">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column
          property="parkname"
          label="停车场名称"
        ></el-table-column>
        <el-table-column
          property="parkcode"
          label="停车场编号"
        ></el-table-column>
        <el-table-column
          property="total_berth"
          label="停车位数量"
          width="100"
        ></el-table-column>
        <el-table-column
          property="areaname"
          label="地区"
          width="100"
        ></el-table-column>
        <el-table-column
          property="areacode"
          label="地区编码"
          width="200"
        ></el-table-column>
        <el-table-column property="address" label="详细地址"></el-table-column>
      </el-table>
    </el-dialog>
    <div>
      <add-park ref="add"></add-park>
    </div>
  </div>
</template>

<script>
import { BMPGL } from "../utils/bmpgl";
import table1Excel from "../data/table1Excel";
import AddPark from "./AddPark.vue";
export default {
  components: {
    AddPark,
  },
  created() {
    this.getAreaList();
  },
  // mounted() {
  //   this.initMap();
  // },
  data() {
    return {
      isShowMain: true,
      isShowAdd: false,
      searchForParkName: "",
      searchForParkCode: "",
      searchForParkNameData: [],
      searchForParkCodeData: [],
      dialogTableVisible: false,
      ak: "sWpI7CCvY8K5lbjwmMLG2ANjUOBZq1Kg", // 百度的地图密钥
      myMap: null,
      geoc: null,
      show: true,
      location: {
        lng: 121.636385,
        lat: 29.833886,
      },
      // 信息窗口
      opts: {
        width: 200,
        height: 100,
        title: "",
      },
      //停车场列表
      parkList: [],
      parkListForSearch: [],
      searchPark: "",
    };
  },
  methods: {
    openAddPark() {
      // this.isShowMain = false
      // this.isShowAdd = true
      this.$refs.add.open();
    },
    searchParkName() {
      let search = this.searchForParkName;
      let oldParkList = this.parkListForSearch; //statisticsDataForSearch为后台返回数据的拷贝，在进行筛选操作时对原本的statisticsData备份。
      //当公司搜索input框为空时，根据岗位搜索框的状态处理筛选。
      if (search == "") {
        //若岗位搜索框为空时
        if (this.searchForParkCode == "") {
          this.parkList = oldParkList; //statisticsData为后台返回并渲染至Table组件的数据，此时赋值为原数据的拷贝数据，即原数据。
        } else {
          //若岗位搜索框存在数据时，先将Table数据赋值原数据的拷贝数据，即重置Table，再调用岗位搜索searchPost()方法。
          this.parkList = oldParkList;
          this.searchParkCode();
        }
      } else {
        //当公司搜索input框存在数据时，根据岗位搜索框的状态处理筛选。
        //若岗位搜索框为空时
        if (this.searchForParkCode == "") {
          //重置Table
          this.parkList = oldParkList;
          //filter()，过滤
          this.parkList = this.parkList.filter(function (item) {
            //eval()，转换为json对象
            item = eval("item");
            //写入与搜索关键字在item中对应的字段
            let searchField = {
              parkname: item["parkname"],
            };
            //Object.keys()，遍历对象，返回对象中每一项key的数组；some()，判断数组中是否有满足条件的元素
            return Object.keys(searchField).some(function (key) {
              // console.log("key值为 " + key)；
              //String()，转换成字符类型，让字符具有Array的特性；indexOf()，返回特定子字符串第一次在源字符串中的位置。如果源字符中不存在目标字符，则返回-1。
              return String(item[key]).indexOf(search) > -1;
            });
          });
          //将过滤后的Table数据赋值statisticsDataForSearchCompany，留作岗位搜索操作时Table数据的备份。
          this.searchForParkNameData = this.parkList;
        } else {
          //若岗位搜索框存在数据时
          //将岗位操作备份的Table数据statisticsDataForSearchPost赋值至statisticsData。
          this.parkList = this.searchForParkCodeData;
          this.parkList = this.parkList.filter(function (item) {
            item = eval("item");
            let searchField = {
              parkname: item["parkname"],
            };
            return Object.keys(searchField).some(function (key) {
              return String(item[key]).indexOf(search) > -1;
            });
          });
          this.searchForParkNameData = this.parkList;
        }
      }
    },
    searchParkCode() {
      let search = this.searchForParkCode;
      let oldParkList = this.parkListForSearch;
      if (search == "") {
        if (this.searchForParkName == "") {
          this.parkList = oldParkList;
        } else {
          this.parkList = oldParkList;
          this.searchParkName();
        }
      } else {
        if (this.searchForParkName == "") {
          this.parkList = oldParkList;
          this.parkList = this.parkList.filter(function (item) {
            item = eval("item");
            let searchField = {
              parkcode: item["parkcode"],
            };
            return Object.keys(searchField).some(function (key) {
              return String(item[key]).indexOf(search) > -1;
            });
          });
          this.searchForParkCodeData = this.parkList;
        } else {
          this.parkList = this.searchForParkNameData;
          this.parkList = this.parkList.filter(function (item) {
            item = eval("item");
            let searchField = {
              parkcode: item["parkcode"],
            };
            return Object.keys(searchField).some(function (key) {
              return String(item[key]).indexOf(search) > -1;
            });
          });
          this.searchForParkCodeData = this.parkList;
        }
      }
    },
    exportExcel() {
      const branch_name = null;
      table1Excel(
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
      for (let i = 0; i < this.parkList.length; i++) {
        data.push({});
      }
      this.parkList.forEach((item, index) => {
        data[index] = {
          index: index + 1,
          parkname: item["parkname"] ? item["parkname"] : "/",
          parkcode: item["parkcode"] ? item["parkcode"] : "/",
          total_berth: item["total_berth"] ? item["total_berth"] : "/",
          areaname: item["areaname"] ? item["areaname"] : "/",
          areacode: item["areacode"] ? item["areacode"] : "/",
          address: item["address"] ? item["address"] : "/",
        };
      });
      return data;
    },
    search() {
      let that = this;
      that.myMap.setZoom(12);
      that.myMap.setHeading(64.5);
      that.myMap.setTilt(45);
      if (that.searchPark !== "") {
        setTimeout(() => {
          that.geoc.getPoint(
            that.searchPark,
            function (point) {
              if (point) {
                that.myMap.centerAndZoom(point, 15);
              }
            },
            "浙江万里学院"
          );
        }, 600);
      }
    },
    ifclear() {
      if (this.searchPark == null || this.searchPark == "") {
        this.reset();
      }
    },
    reset() {
      let that = this;
      that.searchPark = "";
      that.myMap.setZoom(12);
      that.myMap.setHeading(64.5);
      that.myMap.setTilt(45);
    },
    getAreaList() {
      this.$axios.get("getParkPositionList").then((res) => {
        this.parkList = res.data.parkList;
        this.parkListForSearch = this.parkList;
      });
    },
    // initMap() {
    //   let that = this;
    //   // 传入密钥获取地图回调。
    //   BMPGL(this.ak)
    //     .then((BMapGL) => {
    //       // 创建地图实例
    //       let map = new BMapGL.Map("container");
    //       that.myMap = map;
    //       //获取定位，设定地图初始化地点
    //       let originPoint = new BMapGL.Point(
    //         that.location.lng,
    //         that.location.lat
    //       );
    //       // 初始化地图，设置中心点坐标和地图级别
    //       map.centerAndZoom(originPoint, 12);
    //       // map.enableInertialDragging()
    //       //开启鼠标滚轮缩放
    //       map.enableScrollWheelZoom(true);
    //       map.setHeading(64.5);
    //       map.setTilt(45);

    //       that.parkList.forEach((SinglePark) => {
    //         // console.log(SinglePark);
    //         var point = new BMapGL.Point(
    //           SinglePark.longitude,
    //           SinglePark.latitude
    //         );
    //         var marker = new BMapGL.Marker(point);
    //         map.addOverlay(marker);
    //         that.opts.title = SinglePark.parkname;
    //         var infoWindow = new BMapGL.InfoWindow(
    //           "总停车位：" +
    //             SinglePark.total_berth +
    //             "<br>" +
    //             "具体地址：" +
    //             SinglePark.address,
    //           that.opts
    //         );
    //         marker.addEventListener("click", function () {
    //           map.openInfoWindow(infoWindow, point);
    //           map.centerAndZoom(point, 15);
    //         });
    //       });

    //       // // 点标记添加点击事件

    //       // 保存数据
    //       // this.myMap = map
    //       var geoc = new BMapGL.Geocoder();
    //       that.geoc = geoc;

    //       // 点击事件
    //       map.addEventListener("click", function () {
    //         // map.setCenter(originPoint);
    //         map.setZoom(12);
    //         map.setHeading(64.5);
    //         map.setTilt(45);
    //       });
    //     })
    //     .catch((err) => {
    //       if (err) {
    //         this.show = false;
    //         console.log(err);
    //       }
    //     });
    // },
  },
};
</script>

<style lang="less" scoped>
.info-title {
  padding: 0px 0px 20px 5px;
  font-size: 150%;
  font-weight: 600;
}
.allmap {
  width: 100%;
  height: 500px;
  position: relative;
  z-index: 1;
}
.searchRow {
  margin-bottom: 20px;
}
/deep/.BMap_cpyCtrl {
  display: none;
}
/deep/.anchorBL {
  display: none;
}
.function-area {
  display: flex;
  margin-bottom: 20px;
  el-input {
    width: auto;
  }
}
</style>
