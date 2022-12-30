<template>
  <!--交通运输-->
  <div class="main">
    <div class="table_title">
      <span>序号</span>
      <span>车辆名称</span>
      <span>预警内容</span>
      <span>报警时间</span>
    </div>

    <vue-seamless-scroll :data="listData" class="alarm scrollDp">
      <div class="alarm-item" v-for="(item, index) in listData" :key="item.id" @click="onRow(item)">
        <span class="text-over" v-text="`${index + 1}`"></span>
        <span class="text-over" v-text="`${item.sbtp}`"></span>
        <span class="text-over" v-text="`${item.zdmc}`"></span>
        <span class="text-over" v-text="`${item.kssj}`"></span>
      </div>
    </vue-seamless-scroll>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import vueSeamlessScroll from "./myClass.vue";
import { homeApi } from "@/api";
const dpStore = namespace("dpStore");
@Component({
  components: {
    vueSeamlessScroll,
  },
})
export default class AlarmAbnormal extends Vue {
  @Mutation setFormParams: any;
  @dpStore.State modalData: any;
  @dpStore.Mutation clear: any;
  @dpStore.Mutation setModalData: any;
  listData: any[] = [];

  @Emit()
  onRow(item?: any) {
    this.clear();
    this.setModalData({
      id: item.id,
      sbtp: item.sbtp,
      zdmc: item.zdmc,
      kssj: item.kssj,
      modalTitle: item.modalTitle,
    });
  }

  async getList() {
  let data1 = [
      {
        id: "001f1a684195445c9915b3d1157d9ff3",
        sbid: "sb15",
        sbtp: "苏B2W721",
        zdmc: "主驾驶位未系安全带",
        kssj: "2022.11.16 13:44",
        zdid: "yj15",
        pqid: "04",
        jd: 118.8220739,
        wd: 31.9387839,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 4009.9100730555556,
      },
      {
        sbtp: "苏B5R737",
        zdmc: "右后轮胎压过低",
        kssj: "2022.11.16 13:43",
        id: "0078367d1bef44d2936dfbd54a4d8736",
        sbid: "d0f60fe9-958f-11ea-9c6f-35919ff6845d",
        zdid: "8698e390-958f-11ea-9c6f-35919ff6845d",
        pqid: "09",
        jd: 118.786009,
        wd: 31.9194664,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 629.9100730555556,
      },
      {
        sbtp: "苏BW5481",
        zdmc: "车速设定值120，当前时速123km/h",
        kssj: "2022.11.16 13:43",
        id: "00f262ab619d4d3c8bbb44fddf4d927d",
        sbid: "297e1e8e76dc7b9f0176df9c6bd5000e",
        zdid: "297e1e8e76dc7b9f0176df9c6bd5000d",
        pqid: "13",
        jd: 118.785347,
        wd: 31.8989467,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 1667.9100730555556,
      },
      {
        sbtp: "苏B5T438",
        zdmc: "载重设定10吨，当前载重12吨，超重2吨",
        kssj: "2022.11.16 13:40",
        id: "00f6c5c13b64437286cbe2605969ec93",
        sbid: "sb264",
        zdid: "yj264",
        pqid: "03",
        jd: 118.7800223,
        wd: 31.9565863,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 605.9100730555556,
      },
      {
        sbtp: "苏B3D784",
        zdmc: "副驾驶位未系安全带",
        kssj: "2022.11.16 13:37",
        id: "018ea1affa3949de8f1d0d3d2f92c4d6",
        sbid: "297e1e8e76b84b7d0176cb2e1afd0003",
        zdid: "297e1e8e76b84b7d0176cb2e1af70002",
        pqid: "08",
        jd: 118.7967088,
        wd: 31.9299042,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 10235.910073055555,
      },
      {
        sbtp: "苏B6H598",
        zdmc: "左后轮胎压过低",
        kssj: "2022.11.16 13:36",
        id: "0248ce7468ac45b48e00aa04e91d105a",
        sbid: "d0f60f91-958f-11ea-9c6f-35919ff6845d",
        zdid: "8696245a-958f-11ea-9c6f-35919ff6845d",
        pqid: "04",
        jd: 118.82577,
        wd: 31.9310674,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 1421.9100730555556,
      },
      {
        sbtp: "苏B85439",
        zdmc: "车速设定值120，当前时速128km/h",
        kssj: "2022.11.16 13:36",
        id: "025298880eed4a259a742cd50b9339ca",
        sbid: "d0f60ff3-958f-11ea-9c6f-35919ff6845d",
        zdid: "8698e39a-958f-11ea-9c6f-35919ff6845d",
        pqid: "09",
        jd: 118.7859982,
        wd: 31.9151862,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 2411.9100730555556,
      },
      {
        sbtp: "苏B4G998",
        zdmc: "载重设定10吨，当前载重11吨，超重1吨",
        kssj: "2022.11.16 12:43",
        id: "0514e05441a64773b36ce0c376b0f595",
        sbid: "297e1e8e76cced4f0176d00cd8ec0005",
        zdid: "297e1e8e76cced4f0176d00cd8dd0004",
        pqid: "10",
        jd: 118.8266146,
        wd: 31.9128831,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 2735.9100730555556,
      },
      {
        sbtp: "苏B9W888",
        zdmc: "车辆轨迹异常",
        kssj: "2022.11.16 11:40",
        id: "0546b5fb9eb843109328f28ac6bb46a0",
        sbid: "2c90808e727578fc017278d875270107",
        zdid: "2c90808e727578fc017278d875270106",
        pqid: "12",
        jd: 118.828125,
        wd: 31.9069441,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 10025.910073055555,
      },
      {
        sbtp: "苏BWX039",
        zdmc: "车速设定值120，当前时速125km/h",
        kssj: "2022.11.16 10:36",
        id: "0604e29f7ba046c7b263bc54da83989c",
        sbid: "d0f63673-958f-11ea-9c6f-35919ff6845d",
        zdid: "869a1c8a-958f-11ea-9c6f-35919ff6845d",
        pqid: "13",
        jd: 118.7852633,
        wd: 31.9008234,
        jcx: "水位",
        rwlx: "管网",
        cxsc: 10235.910073055555,
      },
    ];
    Promise.all(data1).then((values: any) => {
      this.listData = values.map((item: any) => {
        let newItem = {
          ...item,
          modalTitle: "车辆名称",
        };
        return newItem;
      });
    });
  }
  mounted() {
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  .table_title {
    span {
      width: 28.3%;
      color: #00a8ff;
      display: inline-block;
      text-align: center;
    }
    span:first-of-type {
      width: 15%;
    }
  }
  .alarm {
    width: 100%;
    height: 93%;
    // border-top: 1px solid #268000;
    // overflow: hidden;
    overflow: auto;
    .alarm-item {
      width: 100%;
      height: 100%;
      height: 24px;
      line-height: 24px;
      margin-top: 7px;
      color: #515a6e;
      background: url("~@/assets/dp/AsyncMonitore/tableBgc.png") no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
      cursor: pointer;
      .text-over {
        display: inline-block;
        width: 28.3%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
      .text-over:first-of-type {
        width: 15%;
      }
    }
  }
}
</style>
