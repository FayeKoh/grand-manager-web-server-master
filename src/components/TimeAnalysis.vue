<template>
  <div>
    <!-- <div class="info-title">停车场时段分析</div> -->
    <div>
      <el-form
          :label-position="labelPosition"
          label-width="120px"
          :model="selectBox"
          class="area-name-form"
          :inline="true"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="选择停车区域 :" prop="eachArea">
              <el-select
                  v-model="selectBox.eachArea"
                  filterable
                  placeholder="请选择停车区域"
                  @change="getPark()"
              >
                <el-option
                    v-for="(area, index) in parkAreaList"
                    :key="index"
                    :label="area"
                    :value="area"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选择停车场 :" prop="eachPark">
              <el-select
                  v-model="selectBox.eachPark"
                  filterable
                  placeholder="选择停车场"
                  @change="selectPark()"
              >
                <el-option
                    v-for="(area, index) in parkList"
                    :key="index"
                    :label="area"
                    :value="area"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 总览图 -->
    <div id="eachParkAllTime" class="eachParkAllTime"></div>
    <div>
      <el-form
          :label-position="labelPosition"
          label-width="120px"
          :model="selectBox"
          class="dateform"
          :inline="true"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="选择日期" prop="pickDate">
              <el-date-picker
                  v-model="selectBox.pickDate"
                  type="date"
                  placeholder="选择日期"
                  @change="pickDate()"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 时间图 -->
    <div id="eachTime" class="eachTime"></div>
  </div>
</template>

<script>
import { getYMD } from "@/utils/util";
export default {
  created() {
    this.getAreaList();
  },
  mounted() {
    this.loadAllData();
  },
  data() {
    return {
      labelPosition: "left",
      selectBox: {
        eachArea: "",
        eachPark: "",
        pickDate: "",
      },
      parkFreeChart: {},
      eachTime: {},
      parkAreaList: [],
      parkList: [],
      allEchartsOption: {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text: "停车位余量总览",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          // data: date,
          data: ["2020-01-13 17:13:19"],
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10,
          },
          {
            start: 0,
            end: 10,
          },
        ],
        series: {
          name: "车位余量",
          type: "line",
          symbol: "none",
          sampling: "lttb",
          itemStyle: {
            color: "rgb(255, 70, 131)",
          },
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)",
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)",
              },
            ]),
          },
          // data: data,
          data: [8],
        },
      },
      eachTimeOption: {
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: "continuous",
            seriesIndex: 0,
            min: 0,
            max: 400,
          },
        ],

        title: [
          {
            left: "center",
            text: "车位余量变化",
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        xAxis: [
          {
            data: ["2021-2-3", "2021-2-4"],
          },
        ],
        yAxis: [{}],
        grid: [{}],
        series: {
          type: "line",
          showSymbol: false,
          data: [4, 6],
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#ff4683", //改变折线颜色
              },
            },
          },
        },
      },
    };
  },
  methods: {
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
      if (this.selectBox.eachArea != "") {
        this.$axios
            .post("getParkByParkArea", { areaname: this.selectBox.eachArea })
            .then((res) => {
              // console.log(res);
              let tempPark = [];
              res.data.park.forEach((item) => {
                tempPark.push(item.parkname);
              });
              this.parkList = tempPark;
            });
      }
    },
    // 准备dom元素，初始化echarts实例
    loadAllData() {
      let that = this;
      that.parkFreeChart = that.$echarts.init(
          document.getElementById("eachParkAllTime")
      );
      that.eachTime = that.$echarts.init(document.getElementById("eachTime"));
      that.parkFreeChart.setOption(that.allEchartsOption);
      that.eachTime.setOption(that.eachTimeOption);
      setTimeout(() => {
        that.parkFreeChart.showLoading({
          text: "等待选取位置",
          color: "#c23531",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 0.2)",
          // zlevel: 0,
        });
        that.eachTime.showLoading({
          text: "等待选取时间",
          color: "#c23531",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 0.2)",
          // zlevel: 0,
        });
      }, 300);
      //根据分辨率调整大小
      window.addEventListener("resize", function () {
        that.parkFreeChart.resize();
        that.eachTime.resize();
      });
    },
    //选择停车场后获取数据
    async selectPark() {
      const { data: res } = await this.$axios.post("returnEchartData", {
        parkArea: this.selectBox.eachArea,
        parkName: this.selectBox.eachPark,
      });
      console.log("res", res);
      this.parkFreeChart.showLoading({
        text: "数据加载中，请稍后",
        color: "#c23531",
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 0.2)",
        zlevel: 0,
      });
      if (res) {
        setTimeout(() => {
          this.parkFreeChart.setOption({
            title: { text: this.selectBox.eachPark + " 停车场车位余量总览" },
            xAxis: { data: res.date },
            series: [{ data: res.value }],
          });
          this.parkFreeChart.hideLoading();
        }, 800);
      } else {
        this.parkFreeChart.setOption({
          xAxis: { data: ["2020-01-13 17:13:19"] },
          series: [{ data: [8] }],
        });
        this.$message.error("输出错误，请重新加载");
      }
    },
    async pickDate() {
      console.log(getYMD(this.selectBox.pickDate));
      if (
          this.selectBox.eachArea !== "" &&
          this.selectBox.eachPark !== "" &&
          this.selectBox.pickDate !== ""
      ) {
        const { data: res } = await this.$axios.post("returnByTimeChange", {
          parkArea: this.selectBox.eachArea,
          parkName: this.selectBox.eachPark,
          parkDate: getYMD(this.selectBox.pickDate),
        });
        console.log(res);
        if (res) {
          this.eachTime.showLoading({
            text: "数据加载中，请稍后",
            color: "#c23531",
            textColor: "#000",
            maskColor: "rgba(255, 255, 255, 0.2)",
            // zlevel: 0,
          });
          setTimeout(() => {
            this.eachTime.setOption({
              title: {
                text:
                    getYMD(this.selectBox.pickDate) +
                    " " +
                    this.selectBox.eachPark +
                    " 停车场车位余量变化",
              },
              xAxis: { data: res.time },
              series: [{ data: res.value }],
            });
            this.eachTime.hideLoading();
          }, 600);
        }
      }
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
.area-name-form {
  margin-left: 5px;
}
.eachParkAllTime {
  width: 95%;
  height: 300px;
  align-items: center;
}
.eachTime {
  width: 95%;
  height: 300px;
  align-items: center;
}
.dateform {
  margin-left: 5px;
  margin-top: 30px;
}
</style>
