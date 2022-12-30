<template>
  <div class="headView">
    <div class="headView-item">
      <suc-checkbox-group v-model="group" @on-change="changeCheck">
        <suc-checkbox label="燃气安全"></suc-checkbox>
        <suc-checkbox label="排水监管"></suc-checkbox>
        <suc-checkbox label="工程建设"></suc-checkbox>
        <suc-checkbox label="物业管理"></suc-checkbox>
        <suc-checkbox label="城市管理"></suc-checkbox>
        <suc-checkbox label="交通运输"></suc-checkbox>
        <suc-checkbox label="水环境"></suc-checkbox>

        <!-- <suc-checkbox label="1">燃气安全</suc-checkbox>
        <suc-checkbox label="2">排水监管</suc-checkbox>
        <suc-checkbox label="工程建设"></suc-checkbox>
        <suc-checkbox label="物业管理"></suc-checkbox>
        <suc-checkbox label="城市管理"></suc-checkbox>
        <suc-checkbox label="交通运输"></suc-checkbox>
        <suc-checkbox label="水环境"></suc-checkbox> -->
      </suc-checkbox-group>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucCheckboxGroup, SucCheckbox } from "@suc/ui";
@Component({
  components: {
    SucCheckboxGroup,
    SucCheckbox,
  },
})
export default class AsyncHead extends Vue {
  group: any[] = ["燃气安全"]; //默认展示的复选框

  changeCheck(arr:any){
     console.log(arr,">>>54654645");
     
  }
}
</script>

<style lang="scss" scoped>
$deep: "::v-deep";
.headView {
  width: 687px;
  height: 56px;
  // background: pink;
  top: 90px;
  left: 621px;
  position: absolute;
  background: url("../../../assets/dp/AsyncMonitore/top.png") 100% no-repeat;
  background-size: 100% 100%;
  line-height: 56px;
  &-item {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    #{$deep}.suc-checkbox .ivu-checkbox-wrapper {
      color: #fff;
    }
  }
}
</style>
