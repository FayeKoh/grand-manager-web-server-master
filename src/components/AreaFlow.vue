<template>
  <div>
    <!-- <div class="info-title">停车区域车流统计</div> -->
    <div style="display: flex">
      <div
        id="areaFlowPie"
        style="width: 800px; height: 500px; margin-top: 20px"
      ></div>
      <div style="width: 800px">
        <div style="margin-left: 100px">
          选择停车区域 :
          <el-select
            v-model="eachPart"
            filterable
            placeholder="请选择停车区域"
            @change="select()"
          >
            <el-option
              v-for="(area, index) in parkAreaList"
              :key="index"
              :label="area"
              :value="area"
            >
            </el-option>
          </el-select>
        </div>
        <div
          id="eachPartPie"
          style="
            width: 100%;
            height: 400px;
            align-items: center;
            margin-top: 25px;
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {},
  mounted() {
    this.areaFlowChart = this.$echarts.init(
      document.getElementById("areaFlowPie")
    );
    this.areaFlowChart.showLoading({
      text: "数据加载中",
      color: "#469cf3",
      textColor: "#000",
      maskColor: "rgba(255, 255, 255, 0.2)",
      zlevel: 0,
    });
    this.loadAreaFlowEcharts();
    this.getAreaList();
    setTimeout(() => {
      this.eachPartChart = this.$echarts.init(
        document.getElementById("eachPartPie")
      );
      this.eachPartChart.showLoading({
        text: "数据加载中",
        color: "#469cf3",
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 0.2)",
        zlevel: 0,
      });
      this.loadEachPart();
    }, 400);
  },
  data() {
    return {
      areaFlowChart: {},
      eachPart: "鄞州区",
      eachPartChart: {},
      weatherIcons: {},
      parkAreaList: [],
      charts: [],
      activeIndex: "鄞州区",
      AreaFlowOption: {
        title: {
          text: "区域停车场流量分布",
          subtext: "",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          //   data: ["鄞州区", "拱墅区"],
          data: ["鄞州区", "拱墅区"], //example
        },
        series: {
          name: "区域停车场车流量",
          type: "pie",
          radius: "65%",
          center: ["50%", "50%"],
          selectedMode: "single",
          data: [{ value: 1548, name: "鄞州区" }], //example
          // { value: 1548, name: "鄞州区" },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      },
      eachPartOption: {
        title: {
          text: "停车场流量分布",
          subtext: "",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: 10,
          left: "center",
        },
        series: {
          name: "停车场流量",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [{ value: 991, name: "凤凰城" }], //example
        },
      },
    };
  },
  methods: {
    //获取停车场信息
    async getAreaList() {
      let that = this;
      var areaArr = [];
      that.$axios.post("/getParkPositionList").then((res) => {
        // console.log(res.data.parkList);
        res.data.parkList.forEach((item) => {
          areaArr.push(item.areaname);
        });
        that.parkAreaList = that.unique(areaArr);
        that.getAreaFlow();
      });
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    async getAreaFlow() {
      let that = this;
      that.$axios.post("/getAreaFlow", that.parkAreaList).then((res) => {
        let temp = res.data.areaFlow;
        let tempArr = [];
        for (let i = 0; i < that.parkAreaList.length; i++) {
          tempArr.push({
            value: temp[i],
            name: that.parkAreaList[i],
          });
        }
        that.charts = that.parkAreaList;
        setTimeout(() => {
          that.areaFlowChart.setOption({
            legend: { data: that.parkAreaList },
            series: [{ data: tempArr }],
          });
          that.areaFlowChart.hideLoading();
        }, 600);
      });
    },
    loadAreaFlowEcharts() {
      // 基于准备好的dom，初始化echarts实例
      this.areaFlowChart.setOption(this.AreaFlowOption);
    },
    loadEachPart() {
      let that = this;
      that.eachPartChart.setOption(that.eachPartOption);
      that.$axios
        .post("getEachParkFlow", { parkName: that.eachPart })
        .then((res) => {
          let tempParkList = res.data.parkList;
          let tempvalueList = res.data.flowValue;
          var datalist = [];
          for (let i = 0; i < tempParkList.length; i++) {
            datalist.push({ value: tempvalueList[i], name: tempParkList[i] });
          }
          setTimeout(() => {
            that.eachPartChart.setOption({
              series: [{ data: datalist }],
            });
            that.eachPartChart.hideLoading();
          }, 600);
        });
    },
    select() {
      let that = this;

      that.eachPartChart.showLoading({
        text: "数据加载中",
        color: "#469cf3",
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 0.2)",
        zlevel: 0,
      });
      that.$axios
        .post("getEachParkFlow", { parkName: that.eachPart })
        .then((res) => {
          let tempParkList = res.data.parkList;
          let tempvalueList = res.data.flowValue;
          var datalist = [];
          for (let i = 0; i < tempParkList.length; i++) {
            datalist.push({ value: tempvalueList[i], name: tempParkList[i] });
          }
          setTimeout(() => {
            that.eachPartChart.setOption({
              series: [{ data: datalist }],
            });
            that.eachPartChart.hideLoading();
          }, 600);
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
</style>