<template>
  <div class="qulity-view">
    <div class="qulity-item">
      <div>
        <h2>设备总数</h2>
        <p>{{equipmentNumber.machineSize}}</p>
      </div>
    </div>
    <div class="qulity-item">
      <div>
        <h2>使用中总数</h2>
        <p>{{equipmentNumber.usedSize}}</p>
      </div>
    </div>
    <div class="qulity-item">
      <div>
        <h2>未使用总数</h2>
        <p>{{equipmentNumber.noUsedSize}}</p>
      </div>
    </div>
    <div class="qulity-item">
      <div>
        <h2>正常状态</h2>
        <p>{{equipmentNumber.noWarnSize}}</p>
      </div>
    </div>
    <div class="qulity-item">
      <div>
        <h2>离线状态</h2>
        <p>{{equipmentNumber.machineOffLineSize}}</p>
      </div>
    </div>
    <div class="qulity-item">
      <div>
        <h2>报警状态</h2>
        <p>{{equipmentNumber.machineWarnSize}}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { PanelView, TableComponent } from "@/components";
import { Tooltip } from "iview";
import { SucTabs, SucTabPane } from "@suc/ui";
import bus from "@/eventBus";
import { infoApi, publicApi } from "@/api";

@Component({
  components: {
    PanelView,
    Tooltip,
    SucTabs,
    SucTabPane,
    TableComponent,
  },
})
export default class QulityPie extends Vue {
  user: any = JSON.parse(localStorage.getItem("userInfo") || "");
  equipmentNumber: any = {};
  mounted() {
    this.getEquipmentNumber();
  }
  async getEquipmentNumber() {
    let url = "wjServer/xwzl/index/deviceNum";
    let data = await publicApi.getNoParam(url);
    console.log(data, ">>>>>>");
    if (data.result) {
      this.equipmentNumber = data.data.data;
    } else {
      this.equipmentNumber = {};
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
$deep: "::v-deep";
.qulity-view {
  width: 100%;
  height: 100%;
  // background: greenyellow;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  .qulity-item {
    width: 32%;
    height: 120px;
    position: relative;
    border-radius: 4px;
    color: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
      // font-size: 18px;
    p{
      font-size: 18px;
      font-weight: 600;
    }
    &:first-of-type {
      background: linear-gradient(to right, #009eff, #006cff);
    }
    &:nth-of-type(2) {
      background: linear-gradient(to right, #7d7aec, #5d5abc);
    }
    &:nth-of-type(3) {
      background: linear-gradient(to right, #bdc3c7, #9ea6ae);
    }
    &:nth-of-type(4) {
      background: linear-gradient(to right, #009eff, #006cff);
    }
    &:nth-of-type(5) {
      background: linear-gradient(to right, #d4d452, #ffd842);
    }
    &:nth-of-type(6) {
      background: linear-gradient(to right, #bdc3c7, #9ea6ae);
    }
  }
  .tabs {
    height: 100%;
    // .jiance {
    //   height: 50%;
    //   .table {
    //     height: 380px;
    //     overflow: hidden;
    //     margin-top: 20px; //防止遮盖更多
    //   }
    // }
    .table {
      height: 380px;
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
}
</style>
