<template>
  <div>
    <div v-show="showDescription">
      <div>
        <!-- <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>系统简介</span>
            <el-button
              style="
                float: right;
                padding: 3px 0;
                opacity: 0.4;
                font-style: italic;
              "
              type="text"
              >基于大数据的智慧泊车管理系统</el-button
            >
          </div>
          <div class="text item" style="text-indent: 25px; margin-bottom: 30px">
            随着城市化进程的推进，城市内交通拥堵情况严重影响了人民生活，其中停车难问题造成了严重的车辆滞留在车流中，愈发加重了交通拥堵现象。因此城市智慧泊车系统的信息化数据化方案更被人们重视。
          </div>
          <div class="text item" style="text-indent: 25px; margin-bottom: 30px">
            基于大数据的智慧泊车管理系统通过对大量停车数据的采集分析，整理成可视化界面进行归纳分析，提供用户多样的停车解决方案，为缓解城市拥堵现象提供重要的数据基础和信息化选择，建立和优化用户停车信息数据库，智能地预测各地区各时间段车位情况。系统的主要功能模块包括用户信息管理，停车场和停车记录数据管理，各时间段、各地点车位情况，地图及图表的实时展示，统计分析以及数据预测等。
          </div>
        </el-card> -->
      </div>
      <div style="margin-top: 40px">
        <!-- <div>
          <span class="step">操作步骤</span>
        </div> -->
        <div>
          <el-steps :active="active" align-center direction="vertical" style="height: 500px;">
            <el-step
              @click.native="goActive1()"
              icon="el-icon-s-data"
              title="步骤1"
              description="首先进入停车管理-停车场管理，点击新增按钮，在弹出的对话框中，直接点击地图取得停车场地理位置或手动输入停车场地理位置，再完善其他相关必要的信息，确认后提交，即完成对停车场信息的录入。"
            ></el-step>
            <el-step
              @click.native="goActive2()"
              icon="el-icon-upload"
              title="步骤2"
              description="在完成对停车场信息的录入后，进入停车管理-停车记录管理，默认选择单挑录入，填写完必要的信息后提交，也可选择批量上传支持文本和Excel文件。"
            ></el-step>
            <el-step
              @click.native="goActive3()"
              icon="el-icon-s-order"
              title="步骤3"
              description="进入停车数据分析，可分别在停车区域车流统计、停车场时段分析、时段车位预测子页面中处理相关操作。"
            ></el-step>
            <el-step
              @click.native="goActive4()"
              icon="el-icon-s-promotion"
              title="步骤4"
              description="取得超级管理员权限后，可对系统所有的账户进行增删改查的管理。"
            ></el-step>
          </el-steps>
        </div>
        <div style="margin-top: 40px">
          <div class="block" style="display: flex">
            <!-- <span class="demonstration">步骤条</span> -->
            <el-slider
              style="width: 100%; margin-left: 0%"
              v-model="step"
              :step="25"
              show-stops
            >
            </el-slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    step() {
      console.log(this.step);
      this.active = this.step / 25;
    },
    active() {
      this.step = this.active * 25;
    },
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
      showDescription: true,
      areaParkCount: [],
      step: 0,
      active: 1,
    };
  },
  methods: {
    description() {
      this.showDescription = true;
    },
    glance() {
      this.showDescription = false;
    },
    goActive1() {
      this.active = 1;
    },
    goActive2() {
      this.active = 2;
    },
    goActive3() {
      this.active = 3;
    },
    goActive4() {
      this.active = 4;
    },
    next() {
      if (this.active++ > 3) this.active = 0;
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
.description {
  padding: 0px 0px 20px 5px;
  font-size: 120%;
  font-weight: 400;
  transition: 0.5s;
  color: black;
  & .show {
    opacity: 1;
  }
  & .opacity {
    opacity: 0.2;
  }
  &:hover {
    font-size: 200%;
    font-weight: 500;
    color: #409eff;
  }
}
.step {
  padding: 0px 0px 20px 5px;
  font-size: 120%;
  font-weight: 400;
  transition: 0.5s;
  color: black;
}
.line {
  padding: 0px 0px 0px 15px;
  font-size: 240%;
  font-weight: 400;
}
.glance {
  padding: 15px 0px 0px 15px;
  font-size: 120%;
  font-weight: 400;
  transition: 0.5s;
  color: black;
  &:hover {
    padding: 5px 0px 0px 15px;
    font-size: 200%;
    font-weight: 500;
    color: #409eff;
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
