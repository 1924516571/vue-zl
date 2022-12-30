<template>
  <!-- 待办任务 -->
  <div class="alarm scroll" :data="listData">
    <!-- <vue-seamless-scroll :data="listData">
      <div class="alarm-item" v-for="(item, index) in listData" :key="index">
        <div class="alarm-title">
          <span class="text-over">任务名称:{{ item.name }}</span>
          <span>
            <el-tag size="mini" :type="item.status == '待审批' ? 'warning' : ' '">{{ item.status }}</el-tag>
          </span>
        </div>
        <div class="alarm-body">
          发布人:{{ item.reporter }} <span class="alarm-body-time">发布时间:{{ item.reportTime }}</span>
        </div>
      </div>
    </vue-seamless-scroll> -->
    <div class="alarm-item" v-for="(item, index) in listData" :key="index" ref="lis">
      <div class="alarm-title">
        <span class="text-over">任务名称:{{ item.name }}</span>
        <!-- <span>
          <el-tag size="mini" :type="getDifferColor(item.status)">{{ item.status }}</el-tag>
        </span> -->
        <!-- <span>
          <suc-button type="primary" :debounce="500" @click="doDetail()">处理</suc-button>
        </span> -->
      </div>
      <div class="alarm-body">
        发布人:{{ item.reporter }} <span class="alarm-body-time">发布时间:{{ item.reportTime }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import vueSeamlessScroll from "./myClass.vue";
import { SucButton } from "@suc/ui";
import bus from "@/eventBus";
import { infoApi, publicApi } from "@/api";
@Component({
  components: {
    vueSeamlessScroll,
    SucButton,
  },
})
export default class AlarmAbnormal extends Vue {
  listData: any[] = [];
  user: any = JSON.parse(localStorage.getItem("userInfo") || " ");
  async getList() {
    this.listData = [
      {
        id: "48ef90197e574f16a86fd2f55a8cee0d",
        name: "新吴区花花糕团坊",
        reporter: "系统",
        reportTime: "2022/11/13 10:01",
        status: "待处理",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "48ef90197e574f16a86fd2f55a8cee0d",
        name: "新吴区鸿山米家兰州拉面店",
        reporter: "系统",
        reportTime: "2022/11/12 22:51",
        status: "处理中",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新区鸿山陈付舟饼店",
        reporter: "系统",
        reportTime: "2022/11/12 15:41",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新吴区鸿山范珠儿面店",
        reporter: "系统",
        reportTime: "2022/11/12 14:53",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新吴区鸿山小郑小吃店",
        reporter: "系统",
        reportTime: "2022/11/14 2:11",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新吴区黄建平羊肉餐馆",
        reporter: "系统",
        reportTime: "2022/11/13 12:32",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新吴区鸿山冯可家常菜馆",
        reporter: "系统",
        reportTime: "2022/11/13 10:05",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新吴区硕放微友居小吃店 ",
        reporter: "系统",
        reportTime: "2022/11/12 22:51",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新吴区余胖小吃店",
        reporter: "系统",
        reportTime: "2022/11/12 14:53",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "无锡市新裕涂装有限公司",
        reporter: "系统",
        reportTime: "2022/11/12 11:31",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新吴区众立早点店",
        reporter: "系统",
        reportTime: "2022/11/12 9:01",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
      {
        id: "51a8ed3addea4b7cb7e418ac45f0ce20",
        name: "新区鸿山小面小吃店",
        reporter: "系统",
        reportTime: "2022/11/11 18:34",
        status: "已完成",
        previewUrl: "",
        problemType: "",
      },
    ];
  }

  // 获取不同的颜色
  getDifferColor(status: any) {
    if (status == "待处理") {
      return "danger";
    } else if (status == "处理中") {
      return "warning";
    } else if (status == "已完成") {
      return "success";
    }
  }
  doDetail() {
    console.log("我是处理事件");
    this.$router.push({ path: "/main/assessment/operateManage" });
  }
  mounted() {
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
.alarm {
  padding: 0px 30px 0px 10px;
  height: calc(100% - 52px);
  border-top: 1px solid #dde4eb;
  overflow: auto;
  font-size: 14px;
  .alarm-item {
    padding: 10px 4px;
    color: #515a6e;
    position: relative;
    cursor: pointer;
    &:nth-of-type(2n) {
      background-color: #f8f7f8;
    }
    .alarm-title {
      display: flex;
      justify-content: space-between;
    }
    .alarm-body {
      position: relative;
      .alarm-body-time {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .text-over {
    max-width: calc(100% - 90px);
    margin-right: 20px;
    font-weight: bold;
  }
}
</style>
