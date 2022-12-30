<template>
  <div>
    <el-dialog :append-to-body="true" :title="title" :visible.sync="model" :close-on-click-modal="true" :before-close="onCancel">
      <div class="timeStyle">
        <el-date-picker
          v-model="daterangeData"
          type="datetimerange"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          end-placeholder="结束日期"
          size="small"
          :default-time="['00:00:00', '00:00:00']"
          @change="dateChange"
        ></el-date-picker>
        <suc-button type="primary" class="ssStyle" @click="searchTableData">搜索</suc-button>
        <!-- <transition name="slideFade">
          <div style="height:600px;width:1000px" v-show="showFlag" transiton="slideFade">
            <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize"></table-page>
          </div>
        </transition> -->
      </div>
      <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" v-loading="loading" @get-page="getPage" @get-size="getSize"></table-page>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { SucButton } from "@suc/ui";
import { TablePage } from "@/components";
import { publicApi } from "@/api";

@Component({
  components: {
    TablePage,
    SucButton,
  },
})
export default class qsjcModal extends Vue {
  daterangeData: any = [new Date(new Date().getTime() - 1 * 1000 * 3600 * 24), new Date()];
  loading: boolean = true;
  tableData: any = [];
  showFlag: boolean = false;
  @Prop() title!: string;
  @Prop() model!: boolean;
  @Prop() stationId!: boolean;
  @Emit()
  toggle() {
    return false;
  }
  @Watch("stationId")
  restart() {
    // this.showFlag = true;
    // this.daterangeData = [];
    this.getJcHistoryData();
  }
  onCancel() {
    this.$emit("toggle", false);
  }
  columns: any[] = [
    {
      type: "index",
      title: "序号",
      width: 150,
    },
    {
      title: "测站名称",
      key: "stationname",
    },
    {
      title: "站点编号",
      key: "stationno",
    },
    {
      title: "瞬时流量",
      key: "qins",
    },
    {
      title: "累计流量",
      key: "qtotal",
    },
    {
      title: "更新时间",
      key: "tm",
    },
  ];
  pageParams: any = {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  tableParam: any = {
    stationId: "",
    startDate: this.daterangeData[0],
    endDate: this.daterangeData[1],
    pageNumber: "",
    pageSize: "",
  };
  dateChange(val: any) {
    if (val) {
      this.tableParam.startDate = val[0];
      this.tableParam.endDate = val[1];
    } else {
      this.tableParam = {
        startDate: "",
        endDate: "",
      };
    }
  }

  //   获取监测历史数据
  async getJcHistoryData() {
    let url = "wjServer/qushui/history";
    this.tableParam.stationId = this.stationId;
    this.tableParam.pageNumber = this.pageParams.current;
    this.tableParam.pageSize = this.pageParams.pageSize;
    let data = await publicApi.getWithParam(url, this.tableParam);
    if (data.result) {
      //   this.tableData = data.data.rows;
      data.data.rows.forEach((item: any) => {
        item.tm = this.$utils.dateFormat(new Date(Number(item.tm)), "yyyy-MM-dd HH:mm:ss");
        return data.data.rows;
      });
      this.tableData = data.data.rows;
      this.pageParams.total = Number(data.data.total);
    } else {
      this.tableData = [];
      this.$SucMessage.error("获取失败");
    }
    this.loading = false;
  }

  getPage(page: any) {
    this.loading = true;
    this.pageParams.current = page;
    this.getJcHistoryData();
  }
  getSize(size: any) {
    this.loading = true;
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.getJcHistoryData();
  }

  searchTableData() {
    // this.showFlag = !this.showFlag;
    this.loading = true;
    this.getJcHistoryData();
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
::v-deep.el-dialog__wrapper {
  .el-dialog {
    .el-dialog__header {
      background-color: #5993fa;
    }
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
    .el-dialog__body {
      height: 600px;
      overflow-y: auto;
      position: relative;
      padding: 50px 20px 10px 20px;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
  }
}
.timeStyle {
  position: absolute;
  top: 10px;
  z-index: 1000;
}
.ssStyle {
  margin-left: 10px;
}

// .slideFade-enter {
//   animation: slideFade-dialog-fade-in 5s ease;
// }
// .slideFade-leave {
//   animation: slideFade-dialog-fade-out 0.5s ease forwards;
// }
// .slideFade-enter-active {
//   animation: slideFade-dialog-fade-in 5s ease;
// }
// .slideFade-leave-active {
//   animation: slideFade-dialog-fade-out 0.5s ease forwards;
// }

// @keyframes slideFade-dialog-fade-in {
//   0% {
//     transform: translate3d(-100%, 0, 0); //修改这个可以控制，上下左右动画，例如：100%为从右到左
//     opacity: 1;
//   }
//   100% {
//     transform: translate3d(0, 0, 0);
//     opacity: 1;
//   }
// }
// @keyframes slideFade-dialog-fade-out {
//   0% {
//     transform: translate3d(0, 0, 0);
//     opacity: 1;
//   }
//   100% {
//     transform: translate3d(-100%, 0, 0);
//     opacity: 1;
//   }
// }
</style>
