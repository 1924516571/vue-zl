<template>
  <div class="mainContain">
    <div class="mainContain_map">
      <!-- @mapZoom="mapZoom" -->
      <DpMap @onmarkerClick="onmarkerClick" @mapSingClick="mapSingClick" ref="maps" @testClick="testClick">
        <template v-slot:markerlayer>
          <ol-overlay v-if="MapInfo.show" :position="MapInfo.coords" :offset="MapInfo.offset" category="clickLabel">
            <div class="tkOut">
              <div class="tkTitle">
                预警详情
              </div>
              <div class="tkContent">
                <div class="tkContent_hidden">
                  <span class="tkContent_item" v-text="`${MapInfo.data.modalTitle}` + ':'"></span><span>{{ MapInfo.data.name }}</span>
                </div>
                <div class="tkContent_hidden">
                  <span class="tkContent_item" v-text="'报警等级:'"></span><span>{{ MapInfo.data.warn == "warn1" ? "一级" : MapInfo.data.warn == "warn2" ? "二级" : "三级" }}</span>
                </div>
                <div class="tkContent_hidden">
                  <span class="tkContent_item" v-text="'报警时间:'"></span><span>{{ MapInfo.data.createtime }}</span>
                </div>
              </div>
            </div>
          </ol-overlay>
          <!-- 闪烁光圈  circleStyle:修改光圈的颜色 :circleStyle="MapInfo.style"-->
          <ol-flash v-if="MapInfo.show" :coords="MapInfo.coords" :loops="1" :duration="2000" :radius-range="[0, 25]"></ol-flash>
        </template>
      </DpMap>
    </div>
    <!-- 头部 -->
    <div class="headView">
      <div class="headView-item">
        <suc-checkbox-group v-model="group" @on-change="changeCheck">
          <suc-checkbox label="燃气安全"></suc-checkbox>
          <suc-checkbox label="工程建设"></suc-checkbox>
          <suc-checkbox label="排水监管"></suc-checkbox>
          <suc-checkbox label="物业管理"></suc-checkbox>
          <suc-checkbox label="城市管理"></suc-checkbox>
          <suc-checkbox label="交通运输"></suc-checkbox>
          <suc-checkbox label="水环境"></suc-checkbox>
        </suc-checkbox-group>
      </div>
    </div>
    <!-- 左页面 -->
    <async-left @on-row="getRow"></async-left>
    <!--下页面 -->
    <async-bottom @on-row="getRow"></async-bottom>
    <!-- 右面 -->
    <async-right @on-row="getRow"></async-right>
    <!-- 弹框 -->
    <jcfx-modal :showWarn="showWarn" :itemObjData="itemObjData" :activities="activities"></jcfx-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Provide, Inject } from "vue-property-decorator";
import { DpMap, TableNo } from "@/components";
import { State, Mutation, Action, namespace } from "vuex-class";
import { getSwzIcon } from "@/constants/mapIcon";
import { AsyncLeft, AsyncBottom, AsyncRight, AsyncHead } from "./async";
import { jcfxModal } from "./modal";
import { SucCheckboxGroup, SucCheckbox, SucButton, SucModal, SucForm, SucFormItem, SucInput } from "@suc/ui";
import { ModalConfig } from "@suc/ui/interfaces";
import { coordinateTransform } from "@suc/monch";
import { Stroke } from "ol/style";
import { publicApi } from "@/api";
import dayjs from "dayjs";
const mapStore = namespace("mapStore");
const dpStore = namespace("dpStore");
interface Gcjs {
  type?: any;
  workorderid?: any;
}

@Component({
  components: {
    DpMap,
    AsyncLeft,
    AsyncBottom,
    AsyncRight,
    AsyncHead,
    SucCheckboxGroup,
    SucCheckbox,
    SucButton,
    SucModal,
    SucForm,
    SucFormItem,
    SucInput,
    jcfxModal,
  },
})
export default class OperateMonitore extends Vue {
  // @Provide("provideObject")
  // provideObject: any = "";
  @mapStore.Mutation setMarkers: any;
  @dpStore.State modalData: any;
  @dpStore.Mutation setGasData: any;
  @dpStore.Mutation setGcjsData: any;
  olMap = this.$getMapConfig();
  showWarn: boolean = false;
  activities: any = [];
  itemObjData: any = {};
  MapInfo: any = {
    info: {},
    coords: [],
    // offset: [65, -55],
    offset: [0, -50],
    show: false,
    data: {},
    // style: {
    //   image: {
    //     circle: {
    //       radius: 0,
    //       fill: {
    //         color: [240, 183, 60, 0.2],
    //       },
    //       stroke: { width: 1, color: [240, 183, 60] },
    //     },
    //   },
    // },
  };
  markers: any = [];
  gasPoint: any = [];
  group: any[] = ["燃气安全"];
  gisObj: any = {};
  mapSingClick(e: any) {}
  onmarkerClick(info: any) {
    // 弹框报警等级转换
    this.MapInfo.show = false;
    this.MapInfo.data = info ? info : null;
    this.MapInfo.coords = [];
    this.$nextTick(() => {
      this.MapInfo.show = true;
      console.log(this.MapInfo.show, "5555");

      this.MapInfo.coords = info.coords || [];
      // if (info.coords && info.coords.length > 0) {
      //   this.getLocation(this.MapInfo.coords);
      // }
    });
  }

  // @Watch("markers",{ immediate: true, deep: true })
  // getpoint(){
  //   console.log("5555");
  //    this.MapInfo.show = true;
  // }
  // 鼠标移动
  testClick(info: any) {
    // this.MapInfo.show = true;
    // this.MapInfo.data = info ? info : null;
    // this.MapInfo.coords = [];
    // this.$nextTick(() => {
    //   this.MapInfo.show = true;
    //   this.MapInfo.coords = info.coords || [];
    //   // if (info.coords && info.coords.length > 0) {
    //   //   this.getLocation(this.MapInfo.coords);
    //   // }
    // });
  }

  //点击地图定位回到中心点
  // getLocation(coords: any) {
  //   const maps: any = this.$refs.maps;
  //   const mapRoot: any = maps.$refs.mapObject;
  //   const tranPosN = coordinateTransform(coords, "EPSG:4326", "EPSG:3857");
  //   mapRoot.$view.animate({
  //     center: tranPosN,
  //     zoom: 18,
  //   });
  // }
  //监听地图变化
  // mapZoom(nva: number, ona: number) {
  //   let scale = 0.5;
  //   if (nva == 13) {
  //     scale = 0.6;
  //   } else if (nva == 14) {
  //     scale = 0.7;
  //   } else if (nva >= 15) {
  //     scale = 1;
  //   }
  //   this.markers.forEach((it: any) => {
  //     it.style.image.icon.scale = scale;
  //   });
  //   this.setMarkers(this.markers);
  // }

  mounted() {
    // this.getGasGis();
    Promise.all([this.getGasGis(), this.getPsGis(), this.getGcGis()]).then((res: any) => {
      this.changeCheck(this.group);
    });
  }

  GasDetailParams: Gcjs = {
    type: "",
    workorderid: "",
  };

  getRow(item: any) {
    this.itemObjData = "";
    this.GasDetailParams.type = "";
    this.GasDetailParams.workorderid = "";
    this.showWarn = false;
    this.$nextTick(() => {
      this.showWarn = true; //关键地方因为子组件要监听父组件传布尔值
    });
    this.itemObjData = item;
    this.GasDetailParams = {
      workorderid: item.workorderid,
      type: item.type,
    };
    this.getGcjsDetail();
  }

  async getGcjsDetail() {
    this.activities = [];
    let url = "wjServer/xwzl/jcfx/warnDetail";
    const data = await publicApi.getWithParam(url, this.GasDetailParams);
    console.log(data, "????");
    if (data.result) {
      this.activities = data.data;
    } else {
         this.$SucMessage.error("详情失败");
    }

    // this.activities = [
    //   {
    //     content: "发现问题",
    //     timestamp: "2022-11-12 06:38:49",
    //     // color: "#0bbd87",
    //   },
    //   {
    //     content: "立案",
    //     timestamp: "2022-11-12 06:45:49",
    //     // color: "#0bbd87",
    //   },
    //   {
    //     content: "派单",
    //     timestamp: "2022-11-12 06:47:49",
    //     // color: "#0bbd87",
    //   },
    //   {
    //     content: "处理",
    //     timestamp: "2022-11-12 06:50:49",
    //     // color: "#0bbd87",
    //   },
    //   {
    //     content: "核查",
    //     timestamp: "2022-11-12 06:52:49",
    //     // color: "#0bbd87",
    //   },
    //   {
    //     content: "结案",
    //     timestamp: "2022-11-12 07:00:49",
    //     // color: "#0bbd87",
    //   },
    // ];
  }

  // 燃气参数
  gasParam: any = {
    nowDay: dayjs(new Date()).format("YYYY-MM-DD"),
    type: 1,
  };
  gasData: any = [];
  // 燃气
  async getGasGis() {
    let url = "wjServer/xwzl/jcfx/warnList";
    let data = await publicApi.getWithParam(url, this.gasParam);
    data.result ? (this.gasData = data.data) : (this.gasData = [] && this.$SucMessage.error("请稍后重试..."));
    // 燃气数据
    // var gasData = [
    //   {
    //     stcd: "1",
    //     stnm: "新吴区永墭源面馆",
    //     rangeKey: "sw1",
    //     lgtd: "120.429010",
    //     lttd: "31.538987",
    //     createtime: "2022-11-18 14:10",
    //     warn: "一级报警",
    //     content: "设备编号：359369084870365,异常状态：一级预警",
    //   },
    //   {
    //     stcd: "2",
    //     stnm: "新吴区福强饭馆（牛霸王饭馆）",
    //     rangeKey: "sw2",
    //     lgtd: "120.439010",
    //     lttd: "31.456987",
    //     createtime: "2022-11-17 12:25",
    //     warn: "二级报警",
    //     content: "设备编号：359369082150687,异常状态：二级预警",
    //   },
    //   {
    //     stcd: "3",
    //     stnm: "新吴区八大怪小吃店",
    //     rangeKey: "sw3",
    //     lgtd: "120.405020",
    //     lttd: "31.498037",
    //     createtime: "2022-11-16 18:23",
    //     warn: "三级报警",
    //     content: "设备编号：359369082150689,异常状态：三级预警",
    //   },
    //   {
    //     stcd: "4",
    //     stnm: "新吴区肖丽小吃店",
    //     rangeKey: "sw3",
    //     lgtd: "120.438709",
    //     lttd: "31.491268",
    //     createtime: "2022-11-16 11:00",
    //     warn: "三级报警",
    //     content: "设备编号：35936908215063243,异常状态：三级预警",
    //   },
    //   {
    //     stcd: "5",
    //     stnm: "新吴区期饭餐饮店",
    //     rangeKey: "sw3",
    //     lgtd: "120.410428",
    //     lttd: "31.509161",
    //     createtime: "2022-11-15 17:34",
    //     warn: "三级报警",
    //     content: "设备编号：35936908215063243,异常状态：三级预警",
    //   },
    // ];
    let gasgis = this.gasData
      ? this.gasData.map((e: any) => {
          if (this.$utils.validCoords(e.lng, e.lat)) {
            return {
              id: e.id,
              workorderid: e.workorderid,
              type: "1",
              name: e.unitname,
              createtime: e.createtime,
              // sttp: e.workordertype,
              content: e.content,
              lon: Number(e.lng) + 0.00001,
              lat: Number(e.lat) + 0.00001,
              coords: [Number(e.lng) + 0.00001, Number(e.lat) + 0.00001],
              key: "swz",
              warn: e.workordertype,
              style: {
                image: {
                  icon: {
                    scale: 0.7,
                    // scale: 0.5,
                    anchor: [0.5, 1],
                    src: getSwzIcon(e.workordertype),
                    // opacity:0.2
                  },
                },
              },
              modalTitle: "用户名称",
            };
          }
        })
      : [];
    this.setGasData(gasgis);
    this.gisObj = Object.assign(this.gisObj, { 燃气安全: gasgis });
  }
  // 工程建设
  async getGcGis() {
    var gcjsData: any = [
      {
        stcd: "432432432",
        stnm: "中试基地项目施工总承包",
        rangeKey: "sw1",
        lgtd: "120.445539",
        lttd: "31.490577",
        createtime: "2022-11-18 14:10",
        warn: "一级报警",
        content: "PM10浓度值169，中度污染",
      },
      {
        stcd: "874545",
        stnm: "海力士医院项目",
        rangeKey: "sw2",
        lgtd: "120.364764",
        lttd: "31.51022",
        createtime: "2022-11-17 12:25",
        warn: "二级报警",
        content: "PM10浓度值169，中度污染",
      },
      {
        stcd: "474112",
        stnm: "新光嘉园安居房扩建工程二期",
        rangeKey: "sw3",
        lgtd: "120.454738",
        lttd: "31.463907",
        createtime: "2022-11-16 18:23",
        warn: "三级报警",
        content: "PM10浓度值169，中度污染",
      },
      {
        stcd: "98451216",
        stnm: "旺庄街道红蕾佳苑二期工程项目",
        rangeKey: "sw3",
        lgtd: "120.389485",
        lttd: "31.530001",
        createtime: "2022-11-16 11:00",
        warn: "三级报警",
        content: "PM10浓度值169，中度污染",
      },
      {
        stcd: "87410120",
        stnm: "无锡市粮食和物资应急保障服务中心",
        rangeKey: "sw3",
        lgtd: "120.375975",
        lttd: "31.535091",
        createtime: "2022-11-15 17:34",
        warn: "三级报警",
        content: "PM10浓度值169，中度污染",
      },
      {
        stcd: "87410123432",
        stnm: "无锡市粮食和物资应急保障服务中心",
        rangeKey: "sw3",
        lgtd: "120.375975",
        lttd: "31.535091",
        createtime: "2022-11-15 17:34",
        warn: "三级报警",
        content: "PM10浓度值169，中度污染",
      },
      {
        stcd: "874101423432432",
        stnm: "无锡市粮食和物资应急保障服务中心",
        rangeKey: "sw3",
        lgtd: "120.375975",
        lttd: "31.535091",
        createtime: "2022-11-15 17:34",
        warn: "三级报警",
        content: "PM10浓度值169，中度污染",
      },
      {
        stcd: "324234",
        stnm: "无锡市粮食和物资应急保障服务中心",
        rangeKey: "sw3",
        lgtd: "120.375975",
        lttd: "31.535091",
        createtime: "2022-11-15 17:34",
        warn: "三级报警",
        content: "PM10浓度值169，中度污染",
      },
      {
        stcd: "54645645",
        stnm: "无锡市粮食和物资应急保障服务中心8888",
        rangeKey: "sw3",
        lgtd: "120.375975",
        lttd: "31.535091",
        createtime: "2022-11-15 17:34",
        warn: "三级报警",
        content: "PM10浓度值169，中度污染",
      },
    ];

    let gcjsgis = gcjsData
      ? gcjsData.map((e: any) => {
          if (this.$utils.validCoords(e.lgtd, e.lttd)) {
            return {
              id: e.stcd,
              type: "工程建设",
              name: e.stnm,
              content: e.content,
              lon: Number(e.lgtd) + 0.00001,
              lat: Number(e.lttd) + 0.00001,
              sttp: e.rangeKey,
              createtime: e.createtime,
              coords: [Number(e.lgtd) + 0.00001, Number(e.lttd) + 0.00001],
              key: "swz",
              warn: e.warn,
              style: {
                image: {
                  icon: {
                    scale: 0.7,
                    anchor: [0.5, 1],
                    src: require("@/assets/dp/AsyncMonitore/gcjs.png"),
                  },
                },
              },
              modalTitle: "工程名称",
            };
          }
        })
      : [];
    this.setGcjsData(gcjsgis);
    this.gisObj = Object.assign(this.gisObj, { 工程建设: gcjsgis });
  }
  // 排水监管
  async getPsGis() {
    var testData: any = [];
    let gis = testData
      ? testData.map((e: any) => {
          if (this.$utils.validCoords(e.lgtd, e.lttd)) {
            return {
              id: e.stcd,
              name: e.stnm,
              lon: Number(e.lgtd) + 0.00001,
              lat: Number(e.lttd) + 0.00001,
              sttp: e.key,
              coords: [Number(e.lgtd) + 0.00001, Number(e.lttd) + 0.00001],
              key: "swz",
              ssData: e.ssData,
              style: {
                image: {
                  icon: {
                    scale: 0.7,
                    anchor: [0.5, 1],
                    src: getSwzIcon(e.rangeKey),
                  },
                },
              },
              title: "站点名称",
            };
          }
        })
      : [];
    this.gisObj = Object.assign(this.gisObj, { 排水监管: gis });
  }

  // 选择复选框点击事件
  changeCheck(arr: any) {
    this.markers = [];
    this.MapInfo.show = false;
    for (let i = 0; i < arr.length; i++) {
      this.markers.push(this.gisObj[arr[i]]);
    }
    this.markers = this.markers.flat().filter((item: any) => item);
    this.setMarkers(this.markers);
  }
}
</script>

<style lang="scss" scoped>
$deep: "::v-deep";
.mainContain {
  width: 100%;
  height: calc(100% - 84px);
  color: #fff;
  .mainContain_map {
    width: 100%;
    height: 100%;
    .tkOut {
      animation: shaking 3s infinite;
      width: 206px;
      height: 149px;
      // height: 200px;
      background: url("../../assets/dp/AsyncMonitore/tk.png") no-repeat;
      background-size: 100% 100%;
      position: relative;
      .tkTitle {
        position: absolute;
        // width: 48px;
        // height: 13px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #0f2142;
        line-height: 40px;
        left: 80px;
        top: -8px;
        // background: red;
      }
      .tkContent {
        width: calc(100% - 21px);
        height: 70px;
        position: absolute;
        top: 39px;
        left: 21px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 1px;
        .tkContent_hidden {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .tkContent_item {
            color: #00a8a4;
          }
        }
        .tkContent_hidden:hover {
          overflow: visible;
          cursor: pointer;
        }
      }
    }
  }
  .headView {
    width: 687px;
    height: 56px;
    // background: pink;
    top: 90px;
    left: 621px;
    position: absolute;
    background: url("~@/assets/dp/AsyncMonitore/top.png") 100% no-repeat;
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
}

#{$deep}.vueol-overlay {
  background-color: transparent;
  width: 206px;
  height: 149px;
}

// .fade-enter-from {
//   opacity: 0;
// }
// .fade-enter-active {
//   transition: all 5s;
// }
// .fade-enter-to {
//   opacity: 1;
// }
// .fade-leave-from {
//   opacity: 1;
// }
// .fade-leave-active {
//   transition: all 5s;
// }
// .fade-leave-to {
//   opacity: 0;
// }

@keyframes shaking {
  0% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(-10px);
  }
}
</style>
