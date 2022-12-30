<template>
  <!-- 任务事件 -->
  <div class="task-view">
    <div>
      <div class="flex-class">
        <div>
          <template>
            <el-date-picker v-model="date" type="daterange" range-separator="-" style="width: 320px; margin-right: 10px" size="small" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </template>
        </div>
        <div>
          <search-component @input="getSearch"></search-component>
        </div>
        <div>
          <!-- <suc-button
            type="primary"
            :config="{
              ghost: true
            }"
            :debounce="800"
            style="margin-left:10px;"
            >重置
          </suc-button> -->
        </div>
      </div>
    </div>
    <div class="trend-item">
      <div>
        <table-page :columns="columns" :tableData="tableData" :pageParams="pageParams" @get-page="getPage" @get-size="getSize"></table-page>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { SucDatePicker, SucButton } from "@suc/ui";
import { DatePickerOptions } from "@suc/ui/interfaces";
import { DatePicker } from "element-ui";
// import SearchComponent  from './SearchComponent.vue'
import { TablePage, SearchComponent } from "@/components";
import { networkApi } from "@/api";
import { State } from "vuex-class";
@Component({
  components: {
    SucDatePicker,
    SucButton,
    SearchComponent,
    TablePage,
    ElDatePicker: DatePicker,
  },
})
export default class Task extends Vue {
  @State waterQulity: any;
  @Watch("waterQulity", { immediate: true, deep: true })
  riverChange(data: any) {
    if (data.qulity) {
      this.taskParams.id = data.qulity.sbid;
    }
  }
  columns: any[] = [
    {
      title: "序号",
      type: "index",
    },

    {
      title: "任务名称",
      key: "problemName",
    },
    {
      title: "任务类型",
      key: "problemType",
    },

    {
      title: "发布人",
      key: "reporter",
    },
    {
      title: "发布时间",
      key: "reportTime",
    },
    {
      title: "任务状态",
      key: "status",
    },
    // {
    //   title: "状态更新时间",
    //   key: "GMT_MODIFIED",
    // },
  ];
  tableData: any[] = [
  
  ];
  date: any = [];
  options: DatePickerOptions = {
    type: "datetimerange",
  };

  pageParams: any = {
    current: 1,
    total: 0,
    pageSize: 10,
  };

  taskParams: any = {
    beginDate: "",
    endDate: "",
    taskName: "",
    pageNumber: "",
    pageSize: "",
    moduletype: "4",
    handleStatus: "",
    taskType: "",
  };

  mounted() {
    // this.init();
    this.getTask();
  }
  init() {
    this.date = [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 59))];
  }
  async getTask() {
    let that = this;
    that.taskParams.pageNumber = that.pageParams.current;
    that.taskParams.pageSize = that.pageParams.pageSize;
    if (this.date.length > 0) {
      this.taskParams.beginDate = this.$utils.dateFormat(this.date[0], "yyyy-MM-dd HH:mm:ss");
      this.taskParams.endDate = this.$utils.dateFormat(this.date[1], "yyyy-MM-dd HH:mm:ss");
    } else {
      this.taskParams.beginDate = "";
      this.taskParams.endDate = "";
    }
    const taskList = await networkApi.getJcdTaskList(that.taskParams);
    let { data } = taskList;
    that.tableData = data.rows;
    that.pageParams.total = parseInt(data.total);
  }
  getPage(page: number) {
    this.pageParams.current = page;
    this.getTask();
  }
  getSize(size: number) {
    this.pageParams.current = 1;
    this.pageParams.pageSize = size;
    this.getTask();
  }
  getDate(date: any) {
    this.taskParams.beginDate = date[0];
    this.taskParams.endDate = date[1];
  }
  getSearch(val: string) {
    this.taskParams.taskName = val;
    this.getTask();
  }
}
</script>
<style lang="scss" scoped>
.task-view {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  font-size: 14px;
  .flex-class {
    display: flex;
    align-items: center;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .trend-item {
    height: calc(100% - 43px);
    padding: 10px 0 0;
    > div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
