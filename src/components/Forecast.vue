<template>
  <div>
    <!-- <div class="info-title">时段车位预测</div> -->
    <!-- 表单数据 -->
    <div>
      <el-form
        ref="selectBox"
        :label-position="labelPosition"
        label-width="120px"
        :model="selectBox"
        :rules="selectBoxRules"
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
          <el-col :span="8">
            <el-form-item label="选择日期 :" prop="pickDate">
              <el-date-picker
                v-model="selectBox.pickDate"
                type="date"
                placeholder="选择日期"
                @change="pickDate()"
                :picker-options="startDate"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 时段预测图 -->
    <div id="timeForecast" class="timeForecast"></div>
    <!-- 推荐卡片 -->
    <el-row v-if="recommendList.length > 0" :gutter="30" style="margin-top:20px;width:100%;left:10%;">
      <transition-group tag="div" name="card">
        <el-col :span="12" v-for="(item,index) in recommendList" :key="index" style="margin-bottom:20px">
          <div>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ item.title }}</span>
              </div>
              <div v-for="(text,i) in item.content" :key="i" class="text item">
                <span class="dot"></span>
                <span class="text">{{ text }}</span>
              </div>
            </el-card>
          </div>
        </el-col>
      </transition-group>
    </el-row>
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
  watch:{
    timeForecastOption:{
      handler(val,oldVal){
        if (val.series[1].data != null){
          this.doRecommend()
        }
      },
      deep: true
    }
  },
  data() {
    return {
      labelPosition: "left",
      selectBox: {
        eachArea: "",
        eachPark: "",
        pickDate: "",
      },
      startDate: {
        disabledDate(time) {
          return time.getTime() < 1619798400000;
        }
      },
      recommendList: [],
      selectBoxRules: {
        eachArea: [{ required: true, message: "请选择地区", trigger: "blur" }],
        eachPark: [
          { required: true, message: "请选择停车场", trigger: "blur" },
        ],
        pickDate: [{ required: true, message: "请选择日期", trigger: "blur" }],
      },
      parkAreaList: [],
      parkList: [],
      timeForecastOption: {
        color: ["#5470C6", "#EE6666"],

        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["车位余量", "预计明日车位余量"],
        },
        grid: {
          top: 70,
          bottom: 50,
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: "#EE6666",
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (
                    "预计  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                },
              },
            },
            data: [],
          },
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: "#5470C6",
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (
                    "余量  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                },
              },
            },
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "车位余量",
            type: "line",
            xAxisIndex: 1,
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "预计明日车位余量",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    doRecommend(){
      let tempData = this.timeForecastOption.series[1].data
      let tempTimeTick = this.timeForecastOption.xAxis[1].data
      console.log('tempData',tempData);
      if(tempData != null && tempData != undefined && tempData.length > 0){
        let max = []
        let min = []
        let maxIndex = []
        let minIndex = []
        var maxInNumbers = Math.max.apply(Math, tempData);
        var minInNumbers = Math.min.apply(Math, tempData);
        max.push(maxInNumbers)
        min.push(minInNumbers)
        for(let i = 0;i<tempData.length;i++){
          if(tempData[i]>=maxInNumbers){
            max.push(tempData[i])
            maxIndex.push(i)
          }
          if(tempData[i]<=minInNumbers){
            min.push(tempData[i])
            minIndex.push(i)
          }
        }
        setTimeout(() => {
          var tipTitle = this.selectBox.eachPark + '停车提示'
          var tip1 = getYMD(this.selectBox.pickDate) + " " + this.selectBox.eachPark + ' 空余车位情况如上图'
          var tip2 = '预测停车高峰时段可能在'
          if(minIndex.length<=2){
            for(let i = 0;i<minIndex.length;i++){
              console.log(tempTimeTick[minIndex[i]]);
              tip2 = tip2 + tempTimeTick[minIndex[i]] +' '
            }
          }
          var tip3 = '在'
          if(maxIndex.length<=2){
            for(let i = 0;i<maxIndex.length;i++){
              tip3 = tip3 + tempTimeTick[maxIndex[i]] +' '
            }
          }
          console.log('minIndex.length',minIndex.length)
          console.log('maxIndex.length',maxIndex.length)
          tip3 += '较为空闲，您可以选择在此时出入'
          var tip4 = '您可以选择错峰进出，或者查看' +
            this.selectBox.eachArea +
            this.selectBox.eachPark +
            '附近其他的停车场情况'
          var tempRec = {}
          tempRec.title = tipTitle
          tempRec.content = []
          tempRec.content.push(tip1)
          if(minIndex.length<=2){
            tempRec.content.push(tip2)
          }
          if(maxIndex.length<=2){
            tempRec.content.push(tip3)
          }
          tempRec.content.push(tip4)
          this.recommendList.unshift(tempRec)
        }, 500);
      }
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
      that.timeForecast = that.$echarts.init(
        document.getElementById("timeForecast")
      );
      that.timeForecast.setOption(that.timeForecastOption);
      setTimeout(() => {
        that.timeForecast.showLoading({
          text: "等待选取位置",
          color: "#c23531",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 0.2)",
          zlevel: 0,
        });
      }, 300);
      //根据分辨率调整大小
      window.addEventListener("resize", function () {
        that.timeForecast.resize();
      });
    },
    async pickDate() {
      let that = this;
      that.timeForecast.showLoading({
        text: "计算中",
        color: "#c23531",
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 0.2)",
        zlevel: 0,
      });
      that.$refs.selectBox.validate((valid) => {
        if (valid) {
          that.$axios
            .post("returnByTimeChange", {
              parkArea: that.selectBox.eachArea,
              parkName: that.selectBox.eachPark,
              parkDate: getYMD(that.selectBox.pickDate),
            })
            .then((res) => {
              if (res != null) {
                let option = {};
                Object.assign(option, that.timeForecastOption);
                option.xAxis[0].data = res.data.time;
                option.xAxis[1].data = res.data.time;
                option.series[0].data = res.data.value;
                option.series[1].data = [];
                that.timeForecast.setOption(option);
              }
            });
          that.$axios
            .post("returnBaseDate", {
              eachArea: that.selectBox.eachArea,
              eachPark: that.selectBox.eachPark,
              pickDate: getYMD(that.selectBox.pickDate),
            })
            .then((res) => {
              setTimeout(() => {
                console.log(res)
                console.log(res.data)
                if (res.data.flag) {
                  let option = {};
                  Object.assign(option, that.timeForecastOption);
                  option.xAxis[0].data = res.data.forcastTime;
                  option.xAxis[1].data = res.data.forcastTime;
                  option.series[1].data = res.data.forcastValue;
                  that.timeForecast.setOption(option);
                  that.timeForecast.hideLoading();
                } else {
                  that.$message.error("数据错误，请重选日期");
                }
              }, 1000);
            });
        } else {
          that.$message.error("请正确选择");
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
.area-name-form {
  margin-left: 5px;
}
.timeForecast {
  width: 100%;
  height: 400px;
  align-items: center;
  margin-top: 20px;
}
.dot{
  width: 6px;
  height: 6px;
  background-color: #409EFF;
  display: inline-block;
  border-radius: 50%;
  line-height: 20px;
  margin:0px 10px 2px 0px;
}
.text{
  line-height: 28px;
}
.card-enter-active{
  animation: bounce-in .5s;
}
.card-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
