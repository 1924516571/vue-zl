<template>
  <div class="mainContain">
    <suc-modal :config="warnConfig" v-model="sonShowWarn">
      <div class="modalFlex">
        <div class="lineStyle">
          <el-timeline :reverse="reverse">
            <el-timeline-item v-for="(activity, index) in activities" color="rgb(164,214,167,1)" :key="index" :timestamp="activity.happenTime" placement="top">
              <p class="timeline-name">{{ activity.title }}</p>
              <p class="timeline-content">
                <span>处理人:</span><span class="timeline-content__idea ">{{ activity.who }}</span>
              </p>
              <p class="timeline-content">
                <span>处理时间:</span><span class="timeline-content__idea ">{{ activity.usingTime }}</span>
              </p>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="content">
          <suc-form :config="{ 'label-width': 80 }">
            <suc-form-item :config="{ label: itemObjData.modalTitle }">
              <suc-input v-model="itemObjData.name" readonly style="width: 98%"></suc-input>
            </suc-form-item>
            <suc-form-item :config="{ label: '预警内容' }">
              <suc-input v-model="itemObjData.content" readonly style="width: 98%"></suc-input>
            </suc-form-item>
            <suc-form-item :config="{ label: '报警时间' }">
              <suc-input v-model="itemObjData.createtime" readonly style="width: 98%"></suc-input>
            </suc-form-item>
          </suc-form>
        </div>
      </div>
    </suc-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { SucCheckboxGroup, SucCheckbox, SucButton, SucModal, SucForm, SucFormItem, SucInput } from "@suc/ui";
import { ModalConfig } from "@suc/ui/interfaces";

@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucButton,
  },
})
export default class A extends Vue {
  @Prop() showWarn!: boolean;
  @Prop() itemObjData!: object;
  @Prop() activities!: [];
  sonShowWarn: boolean = false;
  @Watch("showWarn", { immediate: true, deep: true })
  getSonWarnStatus() {
    this.sonShowWarn = this.showWarn;
  }

  reverse: boolean = false;
  warnConfig: ModalConfig = {
    transfer: true,
    title: "详情",
    width: 960,
    "footer-hide": true,
  };
  created() {
    // console.log(this.showWarn, "444");
    // this.sonShowWarn = this.showWarn;
  }
  mounted() {}
}
</script>
<style lang="scss" scoped>
$deep: "::v-deep";
#{$deep} .ivu-modal-header {
  background-color: #2b5f8fd9;
}
#{$deep} .suc-modal .ivu-modal-body .suc-modal-content {
  background-color: #e0f7fa40;
}
.suc-modal-content {
  .modalFlex {
    display: flex;
    padding: 0 40px;
    .lineStyle {
      width: 40%;
      .timeline-name {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.7);
      }
      .timeline-content {
        color: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        margin-top: 4px;
        .timeline-content__idea {
          color: rgba(0, 0, 0, 0.7);
        }
      }
    }
    .content {
      width: 60%;
    }
  }
}
</style>
