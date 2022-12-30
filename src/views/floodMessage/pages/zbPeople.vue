<template>
  <!-- 值班  -->
  <div class="module-view">
    <div class="bg-shadow">
      <div class="top-nav">
        
        <div class="top-nav-item">
          <tab-active
            :btns="btns"
            @get-btn="getBtn"
            :activeIndex="activeIndex"
          ></tab-active>
        </div>
      </div>
      <div class="content" v-if="activeIndex === 0">
        <duty-table :date="curDate" :name="name"></duty-table>
      </div>
      <div class="content" v-if="activeIndex === 1">
        <calendar></calendar>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Vue,
  Component,
} from "vue-property-decorator";
import {
  SucDatePicker,
  SucButton,
} from "@suc/ui";
import { DatePickerOptions } from "@suc/ui/interfaces";
import { SearchComponent, TabActive } from "@/components";
import {DutyTable,Calendar} from "./dutyPage"
@Component({
  components: {
    SucDatePicker,
    SucButton,
    SearchComponent,
    TabActive,
    DutyTable,
    Calendar
  },
})
export default class Duty extends Vue {
  date: string = "";
  curDate: string = "2022-04-21";
  options: DatePickerOptions = {
    type: "date",
  };
  name: string = "";
  btns: any[] = ["列表", "日历"];
  activeIndex: number = 1;
  getBtn(val: number) {
    this.activeIndex = val;
  }

  mounted() {
    this.getDate();
  }

  getDate() {
    let date = new Date();
    // let year = date.getFullYear();
    // let month = date.getMonth();
    // let cur = new Date(year, month, 1);
    this.curDate = this.$utils.dateFormat(date, "yyyy-MM-dd");
    this.date = this.curDate;
  }

 
  onSearch(val: any) {
    this.name = val;
    this.curDate = this.$utils.dateFormat(this.date, "yyyy-MM-dd");
  }

 
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
.module-view {
  padding: 10px;
  background-color: $pages-bg;
  .bg-shadow {
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  }
  .top-nav {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    &-item {
      display: flex;
      .btn {
        margin-right: 10px;
      }
    }
  }
  .content{
    height: calc(100% - 70px);
  }
  
}
</style>
