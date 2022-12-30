<template  >
  <!-- 测评弹框-->
  <el-dialog :title="title" :visible.sync="model3" close-on-click-modal:false  v-if="model3" >
    <el-form :model="mzcptjParams" ref="mzcpForm" label-width="auto" size="small" >
      <el-row class="rows" >
        <div class="borders bgc">已测评人</div>
        <el-col class="borders" :span="4" v-for="item in mzcptjParams.cpUsers" :key="item">
          <div>
            {{item}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="borders  bgc">未测评人</div>
        <el-col class="borders" :span="4" v-for="item in mzcptjParams.willCpUsers" :key="item">
          <div>
            {{item}}
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { SucModal, SucForm, SucFormItem, SucInput, SucButton,SucSelect  } from "@suc/ui";
@Component({
  components: {
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    SucButton,
    SucSelect,
  },
})
export default class CreateYsdw extends Vue {
  @Prop() title!: string;
  @Prop() btnFlag!: string;
  @Prop() loading!: boolean; //控制加载
  @Prop() model3!: boolean; //控制弹框显隐
  @Prop({ type: Object, default: () => {} })
  @Prop() mzcptjParams!: any; 
  @Emit()
  async onSubmit() {}
 
}
</script>
<style lang="scss" scoped>
// $deep:"::v-deep";
.rows{
  margin-bottom: 20%;
}
.borders{
  border: 1px solid #e8eaec;
  text-align: center;
  padding: 10px 0;
}
.bgc{
  background-color: #e8eaec;
}

.evaluation{
  float:right;
  margin-top: 5%;
  margin-right: 8%;
}
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
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
  }
}

::v-deep.el-input--small .el-input__inner {
  margin: 3px 0;
}
::v-deep .upload-demo {
  .el-upload-list .el-upload-list--picture {
    .el-upload-list__item {
      width: 300px;
    }
  }
}
</style>
