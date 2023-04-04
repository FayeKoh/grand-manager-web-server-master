<template>
  <div>
    <!-- <div class="info-title">停车数据查询</div> -->
    <el-form ref="RecordQuery" :model="RecordQuery" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="进出模式" prop="mode">
            <el-select
              v-model="RecordQuery.mode"
              placeholder="请选择"
              clearable
            >
              <el-option label="离开" value="离开"></el-option>
              <el-option label="进入" value="进入"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车场编码" prop="parking_id">
            <el-input v-model="RecordQuery.parking_id" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="日期范围" prop="dateRange">
            <el-date-picker
              v-model="RecordQuery.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-button type="primary" @click="searchRecord">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button
            type="primary"
            @click="openAddParkRecord"
            icon="el-icon-plus"
            >新增</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="exportExcel"
            style="margin-left: 10px"
            >导出表格数据</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
    <div>
      <el-table
        v-loading="loading"
        :data="parkRecord"
        border
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <!-- <el-table-column
          fixed
          prop="id"
          label="编号"
          width="150"
        ></el-table-column> -->
        <el-table-column fixed type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="plate_no" label="车牌号" width="150">
        </el-table-column>
        <el-table-column prop="mode" label="进出模式"> </el-table-column>
        <el-table-column prop="parking_date" label="停车日期">
        </el-table-column>
        <el-table-column prop="parking_time" label="停车时间">
        </el-table-column>
        <el-table-column prop="park_name" label="停车场名称"> </el-table-column>
        <el-table-column prop="parking_id" label="停车场编码">
        </el-table-column>
        <el-table-column prop="park_area" label="地区名称"> </el-table-column>
        <el-table-column prop="total_berth" label="总停车位数量"> </el-table-column>
        <el-table-column prop="free_berth" label="空余车位数量"> </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleShow(scope.$index, scope.row)"
              >查看</el-button
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
        :total="ParkRecordLength"
      >
      </el-pagination>
    </div>
    <el-dialog title="停车记录" :visible.sync="showInfo" width="30%" center>
      <span>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form
              :label-position="labelPosition"
              label-width="110px"
              :model="rowInfo"
              class="info-form"
            >
              <el-form-item label="编号">
                <span :disabled="true" class="formSpan">{{ rowInfo.id }}</span>
              </el-form-item>
              <el-form-item label="车牌号">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.plate_no
                }}</span>
              </el-form-item>
              <el-form-item label="进出情况">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.mode
                }}</span>
              </el-form-item>
              <el-form-item label="停车场编号">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.parking_id
                }}</span>
              </el-form-item>
              <el-form-item label="停车时间">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.parking_date + " " + rowInfo.parking_time
                }}</span>
              </el-form-item>
              <el-form-item label="总停车位">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.total_berth
                }}</span>
              </el-form-item>
              <el-form-item label="空余车位">
                <span :disabled="true" class="formSpan">{{
                  rowInfo.free_berth
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
    <add-park-record ref="add"></add-park-record>
  </div>
</template>

<script>
import table2Excel from "../data/table2Excel";
import AddParkRecord from "./AddParkRecord.vue";
import { getYMD, getYMDplus } from "@/utils/util";
export default {
  components: {
    AddParkRecord,
  },
  created() {
    this.loadParkRecord();
  },
  watch: {
    "RecordQuery.mode": {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.RecordQuery.currentPage = 1;
          this.currentPage = 1;
        }
      },
    },
    "RecordQuery.parking_id": {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.RecordQuery.currentPage = 1;
          this.currentPage = 1;
        }
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: true,
      screenWidth: 1080,
      parkRecord: [],
      search_text: "",
      ParkRecordLength: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50],
      //表单的对齐方式
      labelPosition: "right",
      //显示对话框信息
      showInfo: false,
      rowInfo: {},
      oldStartDate: "",
      oldEndDate: "",
      RecordQuery: {
        mode: "",
        parking_id: "",
        startDate: "",
        endDate: "",
        currentPage: 1,
        pageSize: 10,
        dateRange: [],
      },
    };
  },
  methods: {
    openAddParkRecord() {
      this.$refs.add.open();
    },
    exportExcel() {
      const branch_name = null;
      table2Excel(
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
      for (let i = 0; i < this.parkRecord.length; i++) {
        data.push({});
      }
      this.parkRecord.forEach((item, index) => {
        data[index] = {
          index: index + 1,
          plate_no: item["plate_no"] ? item["plate_no"] : "/",
          mode: item["mode"] ? item["mode"] : "/",
          parking_date: item["parking_date"] ? item["parking_date"] : "/",
          parking_time: item["parking_time"] ? item["parking_time"] : "/",
          park_name: item["park_name"] ? item["park_name"] : "/",
          parking_id: item["parking_id"] ? item["parking_id"] : "/",
          park_area: item["park_area"] ? item["park_area"] : "/",
          total_berth: item["total_berth"] ? item["total_berth"] : "/",
          free_berth: item["free_berth"] ? item["free_berth"] : "/",
        };
      });
      return data;
    },
    loadParkRecord() {
      this.loading = true;
      setTimeout(() => {
        this.getParkRecordLength();
        this.PagedQuery = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        };
        this.$axios
          .post("loadParkRecordList", this.PagedQuery)
          .then((res) => {
            this.parkRecord = res.data.parkrecordlist;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }, 800);
    },
    getParkRecordLength() {
      this.$axios
        .get("getParkRecordLength")
        .then((res) => {
          this.ParkRecordLength = res.data.length;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    searchRecord() {
      this.loading = true;
      if (this.RecordQuery.dateRange && this.RecordQuery.dateRange.length) {
        this.RecordQuery.startDate = getYMD(this.RecordQuery.dateRange[0]);
        this.RecordQuery.endDate = getYMDplus(this.RecordQuery.dateRange[1]);
        if (
          !this.RecordQuery.startDate == this.oldStartDate ||
          !this.RecordQuery.endDate == this.oldEndDate
        ) {
          this.RecordQuery.currentPage = 1;
          this.currentPage = 1;
        }
        this.oldStartDate = this.RecordQuery.startDate;
        console.log("oldStartDate", this.oldStartDate);
        this.oldEndDate = this.RecordQuery.endDate;
      } else {
        this.RecordQuery.startDate = "";
        this.RecordQuery.endDate = "";
      }
      // console.log(this.RecordQuery);
      let temp = {};
      Object.assign(temp, this.RecordQuery);
      console.log(temp);
      temp.currentPage =
        (this.RecordQuery.currentPage - 1) * this.RecordQuery.pageSize;
      setTimeout(() => {
        this.$axios
          .post("getParkRecordByQuery", temp)
          .then((res) => {
            this.parkRecord = res.data.parkRecordList;
            this.ParkRecordLength = res.data.parkRecordListLength;
            // console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }, 600);
    },
    reset() {
      this.$refs["RecordQuery"].resetFields();
      this.currentPage = 1;
      // console.log(this.RecordQuery);
      this.loadParkRecord();
    },
    handleShow(index, row) {
      this.rowInfo = row;
      this.showInfo = true;
    },
    //切换页面
    CurrentChange(val) {
      this.loading = true;
      this.currentPage = val;
      this.RecordQuery.currentPage = this.currentPage;
      this.searchRecord();
    },
    //改变每页显示数目
    SizeChange(val) {
      this.loading = true;
      this.pageSize = val;
      this.RecordQuery.pageSize = this.pageSize;
      this.searchRecord();
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
.user-page {
  text-align: center;
  margin: 30px 20px 20px 0px;
}
.el-dialog--center .el-dialog__body {
  padding: 25px 25px 0px 25px;
}
/deep/.el-form-item__error {
  margin-left: 10%;
}
.formSpan {
  margin-left: 10%;
  font-weight: 600;
}
</style>
