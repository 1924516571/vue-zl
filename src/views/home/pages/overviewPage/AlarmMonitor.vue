<template>
  <div class="monitor-view">
    <panel-view heading="待办任务">
      <!-- <template v-slot:right>
        <div class="round_view">
          <round-flash></round-flash>
          <div class="round_right">
            {{ 5 }}
          </div>
        </div>
      </template> -->
      <alarm-flood></alarm-flood>
    </panel-view>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { AlarmFlood } from "../dispatchPage";
import { PanelView, RoundFlash } from "@/components";
import { infoApi, floodApi } from "@/api";
import bus from "@/eventBus";
@Component({
  components: {
    PanelView,
    AlarmFlood,
    RoundFlash, //圆形闪烁
  },
})
export default class ModuleView extends Vue {

  async mounted() {}

  jumpTo() {
    this.$router.push({ path: "/main/assessment/operateManage" });
  }
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
.monitor-view {
  width: 100%;
  height: 100%;
  .more {
    float: right;
    padding-right: 10px;
    i {
      font-size: 18px;
      cursor: pointer;
      color: #5397ff;
    }
  }
  .round_view {
    width: 75%;
    height: 100%;

    .round_right {
      font-size: 14px;
      color: red;
      font-weight: 800;
    }
  }
}
#{$deep}.headerTitle {
  position: relative;
}
</style>
