<template>
  <div>
    <!-- <div class="info-title">首页及概览</div> -->
    <!-- <div style="display:flex;height:60px">
      <el-button type="text" class="description" @click="description()">简介</el-button>
      <span class="line">/</span>
      <el-button type="text" class="glance" @click="glance()">概览</el-button>
    </div> -->
    <!-- <div v-show="showDescription">
      <div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>系统简介</span>
            <el-button style="float: right; padding: 3px 0;opacity: 0.4;font-style: italic" type="text">基于大数据的智慧泊车管理系统</el-button>
          </div>
          <div class="text item" style="text-indent:25px;margin-bottom:30px">
            随着城市化进程的推进，城市内交通拥堵情况严重影响了人民生活，其中停车难问题造成了严重的车辆滞留在车流中，愈发加重了交通拥堵现象。因此城市智慧泊车系统的信息化数据化方案更被人们重视。
          </div>
          <div class="text item" style="text-indent:25px;margin-bottom:30px">
            基于大数据的智慧泊车管理系统通过对大量停车数据的采集分析，整理成可视化界面进行归纳分析，提供用户多样的停车解决方案，为缓解城市拥堵现象提供重要的数据基础和信息化选择，建立和优化用户停车信息数据库，智能地预测各地区各时间段车位情况。系统的主要功能模块包括用户信息管理，停车场和停车记录数据管理，各时间段、各地点车位情况，地图及图表的实时展示，统计分析以及数据预测等。
          </div>
        </el-card>
      </div>
      <div style="margin-top:40px">
        <div>
          <span class="step">操作步骤</span>
        </div>
        <div>
          <el-steps :active="active" align-center>
            <el-step @click.native="goActive1()" icon="el-icon-s-data" title="步骤1" description="首先需要在地图中添加相应的停车场信息，对应左侧导航栏的停车场录入功能"></el-step>
            <el-step @click.native="goActive2()" icon="el-icon-upload" title="步骤2" description="添加完成停车场后选择录入停车记录，可以选择单条录入或批量上传支持文本和Excel文件"></el-step>
            <el-step @click.native="goActive3()" icon="el-icon-s-order" title="步骤3" description="可以在数据查询找找到已经添加和录入的停车场或停车记录进行管理"></el-step>
            <el-step @click.native="goActive4()" icon="el-icon-s-promotion" title="步骤4" description="在数据预测中查看未来数据变化"></el-step>
          </el-steps>
        </div>
        <div style="margin-top:40px">
          <div class="block" style="display:flex">
            <span class="demonstration">步骤条</span>
            <el-slider
              style="width:50%;margin-left:20%"
              v-model="step"
              :step="25"
              show-stops>
            </el-slider>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div v-show="!showDescription" style="display: flex"> -->
      <div style="display: flex">
      <div style="width: 70%">
        <div class="parkGlance">停车场概览</div>
        <div>
          <div class="park-map">
            <div v-if="show" id="container" class="allmap"></div>
            <div v-else>地图获取失败！</div>
          </div>
        </div>
      </div>
      <div style="width: 2%"></div>
      <div style="width: 30%">
        <div class="parkGlance">区域车位统计</div>
        <div>
          <el-table
            v-loading="loadingAreaCount"
            :data="areaParkCount"
            style="width: 100%"
            stripe
            :default-sort="{ prop: 'count', order: 'descending' }"
          >
            <el-table-column prop="id" label="编号" sortable width="width">
            </el-table-column>
            <el-table-column
              prop="areaname"
              label="区域名"
              sortable
              width="150"
            >
            </el-table-column>
            <el-table-column prop="count" label="车位总数" sortable width="width">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BMPGL } from "../utils/bmpgl";
export default {
  created() {
    this.getAreaList();
  },
  mounted() {
    this.initMap();
    this.initAreaParkCountList();
  },
  watch: {
    'step'(){
      console.log(this.step);
      this.active = this.step / 25
    },
    'active'(){
      this.step = this.active * 25
    }
  },
  data() {
    return {
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
      // 区域车位排行
      loadingAreaCount: true,
      showDescription:true,
      areaParkCount: [],
      step:0,
      active:1
    };
  },
  methods: {
    description(){
      this.showDescription = true
    },
    glance(){
      this.showDescription = false
    },
    goActive1(){
      this.active = 1
    },
    goActive2(){
      this.active = 2
    },
    goActive3(){
      this.active = 3
    },
    goActive4(){
      this.active = 4
    },
    next() {
      if (this.active++ > 3) this.active = 0;
    },
    getAreaList() {
      this.$axios.get("getParkPositionList").then((res) => {
        this.parkList = res.data.parkList;
      });
    },
    initAreaParkCountList() {
      let temp = [];
      setTimeout(() => {
        this.$axios.get("areaParkCountList").then((res) => {
          if (res && res.data.flag == true) {
            Object.assign(temp, res.data.areaList);
            for (let i = 0; i < temp.length; i++) {
              temp[i].id = i + 1;
            }
            console.log(temp);
            this.areaParkCount = temp;
          } else {
            this.areaParkCount = [];
            this.loadingAreaCount = false;
          }
        });
        this.loadingAreaCount = false;
      }, 500);
    },
    initMap() {
      let that = this;
      // 传入密钥获取地图回调。
      BMPGL(this.ak)
        .then((BMapGL) => {
          // 创建地图实例
          let map = new BMapGL.Map("container");
          that.myMap = map;
          //获取定位，设定地图初始化地点
          let originPoint = new BMapGL.Point(
            that.location.lng,
            that.location.lat
          );
          // 初始化地图，设置中心点坐标和地图级别
          map.centerAndZoom(originPoint, 12);
          // map.enableInertialDragging()
          //开启鼠标滚轮缩放
          map.enableScrollWheelZoom(true);
          map.setHeading(64.5);
          map.setTilt(45);

          that.parkList.forEach((SinglePark) => {
            // console.log(SinglePark);
            var point = new BMapGL.Point(
              SinglePark.longitude,
              SinglePark.latitude
            );
            var marker = new BMapGL.Marker(point);
            map.addOverlay(marker);
            that.opts.title = SinglePark.parkname;
            var infoWindow = new BMapGL.InfoWindow(
              "总停车位：" +
                SinglePark.total_berth +
                "<br>" +
                "具体地址：" +
                SinglePark.address,
              that.opts
            );
            marker.addEventListener("click", function () {
              map.openInfoWindow(infoWindow, point);
              // map.centerAndZoom(point, 15);
            });
          });

          // // 点标记添加点击事件

          // 保存数据
          // this.myMap = map
          var geoc = new BMapGL.Geocoder();
          that.geoc = geoc;

          // 点击事件
          map.addEventListener("click", function () {
            // map.setCenter(originPoint);
            map.setZoom(12);
            map.setHeading(64.5);
            map.setTilt(45);
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
.description{
  padding: 0px 0px 20px 5px;
  font-size: 120%;
  font-weight: 400;
  transition: .5s;
  color: black;
  & .show{
    opacity: 1;
  }
  & .opacity{
    opacity: 0.2;
  }
  &:hover{
    font-size: 200%;
    font-weight: 500;
    color: #409EFF;
  }
}
.step{
  padding: 0px 0px 20px 5px;
  font-size: 120%;
  font-weight: 400;
  transition: .5s;
  color: black;
}
.line{
  padding: 0px 0px 0px 15px;
  font-size: 240%;
  font-weight: 400;
}
.glance{
  padding: 15px 0px 0px 15px;
  font-size: 120%;
  font-weight: 400;
  transition: .5s;
  color: black;
  &:hover{
    padding: 5px 0px 0px 15px;
    font-size: 200%;
    font-weight: 500;
    color: #409EFF;
  }
}
.allmap {
  width: 100%;
  height: 700px;
  position: relative;
  z-index: 1;
}
.parkGlance {
  margin: 0 auto;
  padding: 0px 0px 20px 5px;
  font-size: 120%;
  font-weight: 400;
}
/deep/.BMap_cpyCtrl {
  display: none;
}
/deep/.anchorBL {
  display: none;
}
</style>
