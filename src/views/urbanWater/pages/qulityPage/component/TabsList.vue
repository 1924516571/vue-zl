<template>
  <div class="tabs-view">
    <suc-tabs>
      <suc-tab-pane label="监测因子" v-if="tabs.includes(1)">
        <factors-chart></factors-chart>
      </suc-tab-pane>
      <suc-tab-pane label="水质趋势" v-if="tabs.includes(2)">
        <trend></trend>
      </suc-tab-pane>
      <suc-tab-pane label="任务事件" v-if="tabs.includes(3)">
        <task></task>
      </suc-tab-pane>
      <suc-tab-pane label="调水方案" v-if="tabs.includes(4)">
        <transfer-plan></transfer-plan>
      </suc-tab-pane>
      <!-- <suc-tab-pane label="调水档案" v-if="tabs.includes(5)">
        <transfer-file></transfer-file>
      </suc-tab-pane>
      <suc-tab-pane label="水量情况" v-if="tabs.includes(6)">
        <water-trend></water-trend>
      </suc-tab-pane> -->
    </suc-tabs>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { SucTabs, SucTabPane } from "@suc/ui";
import { FactorsChart, Trend, TransferFile, Task, TransferPlan, WaterTrend } from "../tabComponent";
@Component({
  components: {
    SucTabs,
    SucTabPane,
    FactorsChart,
    Trend,
    TransferFile,
    Task,
    TransferPlan,
    WaterTrend,
  },
})
export default class ModuleView extends Vue {
  @Prop({
    type: Array,
    default: () => [1, 2, 3, 4, 5],
  })
  tabs: any;
}
</script>
<style  lang="scss">
.tabs-view {
  .suc-tabs .ivu-tabs-bar:after {
    height: 1px;
    background-color: #dde4eb;
  }
  // .suc-tabs .ivu-tabs{
  //   overflow-y: visible;
  // }
}
</style>
<style lang="scss" scoped>
.tabs-view {
  width: 100%;
  height: 100%;
}
</style>
