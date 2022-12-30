<template>
  <div class="alarm-view">
    <div class="alarm-item">
      <div class="alarm-item-title">
        <p>泄漏报警类别统计</p>
        <p>
          <el-date-picker
            v-model="xlbjDaterangeData"
            size="mini"
            style="width: 90%;"
            type="datetimerange"
            range-separator="—"
            @change="xlbjDateChange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </p>
      </div>
      <div class="alarm-item-content">
        <v-chart :options="xlbjOptions" style="width:100%;height:100%"></v-chart>
      </div>
    </div>
    <div class="alarm-item">
      <div class="alarm-item-title">
        <p>报警处理方式统计</p>
        <p>
          <el-date-picker
            v-model="bjclDaterangeData"
            style="width:90%;"
            size="mini"
            type="datetimerange"
            @change="bjclDateChange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </p>
      </div>
      <div class="alarm-item-content">
        <v-chart :options="bjclOptions" style="width:100%;height:100%"></v-chart>
      </div>
    </div>
    <div class="alarm-item">
      <div class="alarm-item-title">
        <p>离线原因统计</p>
        <p>
          <el-date-picker
            v-model="lxDaterangeData"
            style="width: 90%;"
            size="mini"
            type="datetimerange"
            @change="lxDateChange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </p>
      </div>
      <div class="alarm-item-content">
        <v-chart :options="lxoptions" style="width:100%;height:100%"></v-chart>
      </div>
    </div>
    <div class="alarm-item">
      <div class="alarm-item-title">
        <p>离线处理方式统计</p>
        <p>
          <el-date-picker
            v-model="lxclDaterangeData"
            style="width: 90%;"
            size="mini"
            type="datetimerange"
            @change="lxclDateChange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </p>
      </div>
      <div class="alarm-item-content">
        <v-chart :options="lxcloptions" style="width:100%;height:100%"></v-chart>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { AlarmFlood, AlarmChart } from "../dispatchPage";
import { PanelView, TableComponent } from "@/components";
import { SucTabs, SucTabPane } from "@suc/ui";
import { homeApi, publicApi } from "@/api";
import bus from "@/eventBus";
import style from "../../../../styles/my.scss";
@Component({
  components: {
    PanelView,
    AlarmFlood,
    SucTabs,
    SucTabPane,
    TableComponent,
    AlarmChart,
  },
})
export default class ModuleView extends Vue {
  xlbjDaterangeData: any = [new Date(new Date().getTime() - 31 * 1000 * 3600 * 24), new Date()]; //泄漏报警类别统计
  bjclDaterangeData: any = [new Date(new Date().getTime() - 31 * 1000 * 3600 * 24), new Date()]; //报警处理方式统计
  lxDaterangeData: any = [new Date(new Date().getTime() - 31 * 1000 * 3600 * 24), new Date()]; //离线原因统计
  lxclDaterangeData: any = [new Date(new Date().getTime() - 31 * 1000 * 3600 * 24), new Date()]; //离线处理方式统计

  color: any = ["#5397ff", "#feb543", "#36b56e", "#c088ff", "#339966", "#6633FF", "#00CCCC"];
  // 泄漏报警参数
  onPageParams: any = {
    flag: "a",
    workordertype: "warn",
    startTime: "",
    endTime: "",
  };
  // 泄露报警数据
  xlbjDataObject: any = {
    total: 0,
    data: [],
  };

  //报警处理参数
  bjclonPageParams: any = {
    flag: "b",
    workordertype: "warn",
    startTime: "",
    endTime: "",
  };
  // 报警处理数据
  bjclDataObject: any = {
    total: 0,
    data: [],
  };
  //  离线原因参数
  lxonPageParams: any = {
    flag: "a",
    workordertype: "dropped",
    startTime: "",
    endTime: "",
  };
  // 离线原因数据
  lxDataObject: any = {
    total: 0,
    data: [],
  };

  // 离线处理方式统计
  lxclonPageParams: any = {
    flag: "b",
    workordertype: "dropped",
    startTime: "",
    endTime: "",
  };
  // 离线处理方式统计数据
  lxclDataObject: any = {
    total: 0,
    data: [],
  };

  //泄漏报警
  get xlbjOptions() {
    return {
      tooltip: {
        trigger: "item",
        // formatter: "{b}:{c}条",
        // formatter: "{b}:{c}",
      },
      color: this.color,
      title: {
        text: "总数",
        subtext: this.xlbjDataObject.total,
        textStyle: {
          color: style.headingColor,
          fontSize: 24,
        },
        subtextStyle: {
          fontSize: 16,
          // color: "#fff",
        },
        x: "center",
        y: "30%",
      },
      grid: {
        bottom: 200,
        left: 100,
        right: 300,
      },
      legend: {
        type: "scroll",
        orient: "horizontal",
        right: 10,
        // top: 20,
        bottom: 0,
        // itemGap: 10,
        // itemHeight: 10,
        // width: 100,
        // height: 10,
        // left: "center",
        textStyle: {
          fontSize: 12,
          // color: "#fff",
        },
        pageIconColor: "#6495ed",
        pageIconInactiveColor: "#aaa",
        // pageTextStyle: {
        //   color: "#fff",
        // },
        // formatter: (value: string) => {
        //   // console.log(value, "pppp");   拿到数据中名称
        //   var name = value;
        //   data.map((item: any) => {
        //     if (item.name == value) {
        //       name = value + " " + item.value + "条";
        //     }
        //   });
        //   return name; //返回拼接后的数据
        // },
        // icon: "roundRect",
        data: this.xlbjDataObject.data,
      },
      series: [
        {
          radius: ["55%", "70%"],
          center: ["50%", "40%"],
          type: "pie",
          label: {
            normal: {
              show: false,
              formatter: (param: { data: any }) => {
                return ((Number(param.data.value) / this.xlbjDataObject.total) * 100).toFixed(2) + "%";
              },
              textStyle: {
                fontSize: 16,
              },
              position: "outside",
            },
            emphasis: {
              show: false,
            },
          },
          // // 区块间缝隙
          // itemStyle: {
          //   normal: {
          //     borderWidth: 3, // 间距的宽度
          //     // borderColor: "#fff", //背景色
          //   },
          // },
          // labelLine: {
          //   normal: {
          //     show: false,
          //     length: 25,
          //     length2: 25,
          //   },
          //   emphasis: {
          //     show: false,
          //   },
          // },
          // name: "类型占比",
          data: this.xlbjDataObject.data,
        },
      ],
    };
  }
  // 报警处理方式统计
  get bjclOptions() {
    return {
      tooltip: {
        trigger: "item",
      },
      color: this.color,
      title: {
        text: "总数",
        subtext: this.bjclDataObject.total,
        textStyle: {
          color: style.headingColor,
          fontSize: 24,
        },
        subtextStyle: {
          fontSize: 16,
          // color: "#fff",
        },
        x: "center",
        y: "30%",
      },
      grid: {
        bottom: 200,
        left: 100,
        right: 300,
      },
      legend: {
        type: "scroll",
        orient: "horizontal",
        right: 10,
        // top: 20,
        bottom: 0,
        // itemGap: 10,
        // itemHeight: 10,
        // width: 100,
        // height: 10,
        // left: "center",
        textStyle: {
          fontSize: 12,
          // color: "#fff",
        },
        pageIconColor: "#6495ed",
        pageIconInactiveColor: "#aaa",
        data: this.bjclDataObject.data,
      },
      series: [
        {
          radius: ["55%", "70%"],
          center: ["50%", "40%"],
          type: "pie",
          label: {
            normal: {
              show: false,
              formatter: (param: { data: any }) => {
                return ((Number(param.data.value) / this.bjclDataObject.total) * 100).toFixed(2) + "%";
              },
              textStyle: {
                fontSize: 16,
              },
              position: "outside",
            },
            emphasis: {
              show: false,
            },
          },
          // // 区块间缝隙
          // itemStyle: {
          //   normal: {
          //     borderWidth: 3, // 间距的宽度
          //     // borderColor: "#fff", //背景色
          //   },
          // },
          // labelLine: {
          //   normal: {
          //     show: false,
          //     length: 25,
          //     length2: 25,
          //   },
          //   emphasis: {
          //     show: false,
          //   },
          // },
          // name: "类型占比",
          data: this.bjclDataObject.data,
        },
      ],
    };
  }

  //离线原因统计
  get lxoptions() {
    return {
      tooltip: {
        trigger: "item",
      },
      color: this.color,
      title: {
        text: "总数",
        subtext: this.lxDataObject.total,
        textStyle: {
          color: style.headingColor,
          fontSize: 24,
        },
        subtextStyle: {
          fontSize: 16,
          // color: "#fff",
        },
        x: "center",
        y: "30%",
      },
      grid: {
        bottom: 200,
        left: 100,
        right: 300,
      },
      legend: {
        type: "scroll",
        orient: "horizontal",
        right: 10,
        bottom: 0,
        textStyle: {
          fontSize: 12,
          // color: "#fff",
        },
        pageIconColor: "#6495ed",
        pageIconInactiveColor: "#aaa",
        data: this.lxDataObject.data,
      },
      series: [
        {
          radius: ["55%", "70%"],
          center: ["50%", "40%"],
          type: "pie",
          label: {
            normal: {
              show: false,
              formatter: (param: { data: any }) => {
                return ((Number(param.data.value) / this.lxDataObject.total) * 100).toFixed(2) + "%";
              },
              textStyle: {
                fontSize: 16,
              },
              position: "outside",
            },
            emphasis: {
              show: false,
            },
          },
          data: this.lxDataObject.data,
        },
      ],
    };
  }
  // 离线处理方式统计
  get lxcloptions() {
    return {
      tooltip: {
        trigger: "item",
      },
      color: this.color,
      title: {
        text: "总数",
        subtext: this.lxclDataObject.total,
        textStyle: {
          color: style.headingColor,
          fontSize: 24,
        },
        subtextStyle: {
          fontSize: 16,
          // color: "#fff",
        },
        x: "center",
        y: "30%",
      },
      grid: {
        bottom: 200,
        left: 100,
        right: 300,
      },
      legend: {
        type: "scroll",
        orient: "horizontal",
        right: 10,
        bottom: 0,
        textStyle: {
          fontSize: 12,
          // color: "#fff",
        },
        pageIconColor: "#6495ed",
        pageIconInactiveColor: "#aaa",
        data: this.lxclDataObject.data,
      },
      series: [
        {
          radius: ["55%", "70%"],
          center: ["50%", "40%"],
          type: "pie",
          label: {
            normal: {
              show: false,
              formatter: (param: { data: any }) => {
                return ((Number(param.data.value) / this.lxclDataObject.total) * 100).toFixed(2) + "%";
              },
              textStyle: {
                fontSize: 16,
              },
              position: "outside",
            },
            emphasis: {
              show: false,
            },
          },
          data: this.lxclDataObject.data,
        },
      ],
    };
  }

  mounted() {
    this.getXlbjInfo(); //泄漏报警
    this.getBjclInfo(); //报警处理
    this.getLxInfo(); //离线原因
    this.getLxclInfo(); //离线处理方式统计
  }
  async getXlbjInfo() {
    this.xlbjDataObject.total = 0;
    this.xlbjDataObject.data = [];
    let url = "wjServer/xwzl/index/statistics";
    this.onPageParams.startTime = this.$utils.dateFormat(this.xlbjDaterangeData[0], "yyyy-MM-dd HH:mm:ss");
    this.onPageParams.endTime = this.$utils.dateFormat(this.xlbjDaterangeData[1], "yyyy-MM-dd HH:mm:ss");
    let data = await publicApi.getWithParam(url, this.onPageParams);
    if (data.result) {
      this.xlbjDataObject.data = data.data.map((e: any) => {
        return {
          name: e.desc,
          value: e.value,
        };
      });
      const initialValue = 0;
      this.xlbjDataObject.total = this.xlbjDataObject.data.reduce(function(previousValue: any, currentValue: any) {
        return Number(previousValue) + Number(currentValue.value); // 对象.x 拿到里面的每一个 x 属性
      }, initialValue);
    } else {
      this.xlbjDataObject = {
        data: [],
        total: "",
      };
    }
  }
  async getBjclInfo() {
    this.bjclDataObject.total = 0;
    this.bjclDataObject.data = [];
    let url = "wjServer/xwzl/index/statistics";
    this.bjclonPageParams.startTime = this.$utils.dateFormat(this.bjclDaterangeData[0], "yyyy-MM-dd HH:mm:ss");
    this.bjclonPageParams.endTime = this.$utils.dateFormat(this.bjclDaterangeData[1], "yyyy-MM-dd HH:mm:ss");
    let data = await publicApi.getWithParam(url, this.bjclonPageParams);
    if (data.result) {
      this.bjclDataObject.data = data.data.map((e: any) => {
        return {
          name: e.desc,
          value: e.value,
        };
      });
      console.log(this.bjclDataObject, "5555");

      const initialValue = 0;
      this.bjclDataObject.total = this.bjclDataObject.data.reduce(function(previousValue: any, currentValue: any) {
        return Number(previousValue) + Number(currentValue.value); // 对象.x 拿到里面的每一个 x 属性
      }, initialValue);
    } else {
      this.bjclDataObject = {
        data: [],
        total: "",
      };
    }
  }
  async getLxInfo() {
    this.lxDataObject.total = 0;
    this.lxDataObject.data = [];
    let url = "wjServer/xwzl/index/statistics";
    this.lxonPageParams.startTime = this.$utils.dateFormat(this.lxDaterangeData[0], "yyyy-MM-dd HH:mm:ss");
    this.lxonPageParams.endTime = this.$utils.dateFormat(this.lxDaterangeData[1], "yyyy-MM-dd HH:mm:ss");
    let data = await publicApi.getWithParam(url, this.lxonPageParams);
    if (data.result) {
      this.lxDataObject.data = data.data.map((e: any) => {
        return {
          name: e.desc,
          value: e.value,
        };
      });
      const initialValue = 0;
      this.lxDataObject.total = this.lxDataObject.data.reduce(function(previousValue: any, currentValue: any) {
        return Number(previousValue) + Number(currentValue.value); // 对象.x 拿到里面的每一个 x 属性
      }, initialValue);
    } else {
      this.lxDataObject = {
        data: [],
        total: "",
      };
    }
  }
  async getLxclInfo() {
    this.lxclDataObject.total = 0;
    this.lxclDataObject.data = [];
    let url = "wjServer/xwzl/index/statistics";
    this.lxclonPageParams.startTime = this.$utils.dateFormat(this.lxclDaterangeData[0], "yyyy-MM-dd HH:mm:ss");
    this.lxclonPageParams.endTime = this.$utils.dateFormat(this.lxclDaterangeData[1], "yyyy-MM-dd HH:mm:ss");
    let data = await publicApi.getWithParam(url, this.lxclonPageParams);
    if (data.result) {
      this.lxclDataObject.data = data.data.map((e: any) => {
        return {
          name: e.desc,
          value: e.value,
        };
      });
      const initialValue = 0;
      this.lxclDataObject.total = this.lxclDataObject.data.reduce(function(previousValue: any, currentValue: any) {
        return Number(previousValue) + Number(currentValue.value); // 对象.x 拿到里面的每一个 x 属性
      }, initialValue);
    } else {
      this.lxclDataObject = {
        data: [],
        total: "",
      };
    }
  }

  xlbjDateChange(val: any) {
    if (val != false) {
      this.onPageParams.startTime = val[0];
      this.onPageParams.endTime = val[1];
      this.getXlbjInfo();
    } else {
      this.onPageParams.startTime = "";
      this.onPageParams.endTime = "";
    }
  }
  bjclDateChange(val: any) {
    if (val != false) {
      this.bjclonPageParams.startTime = val[0];
      this.bjclonPageParams.endTime = val[1];
      this.getBjclInfo();
    } else {
      this.bjclonPageParams.startTime = "";
      this.bjclonPageParams.endTime = "";
    }
  }
  lxDateChange(val: any) {
    if (val != false) {
      this.lxonPageParams.startTime = val[0];
      this.lxonPageParams.endTime = val[1];
      this.getLxInfo();
    } else {
      this.lxonPageParams.startTime = "";
      this.lxonPageParams.endTime = "";
    }
  }
  lxclDateChange(val: any) {
    if (val != false) {
      this.lxclonPageParams.startTime = val[0];
      this.lxclonPageParams.endTime = val[1];
      this.getLxclInfo();
    } else {
      this.lxclonPageParams.startTime = "";
      this.lxclonPageParams.endTime = "";
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
$deep: "::v-deep";
.alarm-view {
  width: 100%;
  height: 100%;
  // background: red;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  // z-index: 10000;
  .alarm-item {
    width: 49%;
    height: 49%;
    position: relative;
    border-radius: 4px;
    color: #fff;
    border: 1px solid $border-color;
    &-title {
      background: #797b90;
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      p:first-of-type {
        width: 70%;
        font-size: 15px;
        padding-left: 3px;
      }
    }
    &-content {
      width: 100%;
      height: calc(100% - 40px);
      padding-top: -10px;
    }
  }
  .tabs {
    height: 100%;
    // .jiance {
    //   height: 50%;
    //   .table {
    //     height: 300px;
    //     overflow: hidden;
    //     margin-top: 20px; //防止遮盖更多
    //   }
    // }
    .table {
      height: 290px;
      margin-top: 20px; //防止遮盖更多
    }

    .more {
      float: right;
      padding-right: 10px;
      i {
        font-size: 18px;
        cursor: pointer;
        color: #5397ff;
      }
    }
  }
  #{$deep}.ivu-tabs-ink-bar {
    height: 2px !important;
  }

  #{$deep}.ivu-tabs-nav {
    width: 70%;
    margin-left: 15%;
    margin-right: 15%;
  }
  #{$deep}.ivu-tabs-tab {
    width: 50% !important;
    text-align: center;
  }
  #{$deep}.ivu-tabs-bar {
    margin-bottom: 0px;
  }

  .more {
    float: right;
    padding-right: 10px;
    i {
      font-size: 18px;
      cursor: pointer;
      color: #5397ff;
    }
  }
}
</style>
