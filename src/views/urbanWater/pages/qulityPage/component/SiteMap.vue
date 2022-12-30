<template>
  <!-- 水质详情地图 -->
  <div class="map-view">
    <div class="view-item">
      <map-manage ref="maps">
        <template v-slot:tdt2>
          <div style="background-color: transparent"></div>
        </template>
        <template v-slot:hdmap>
          <ol-layer v-for="(layer, index) in olMap.hdmap" :options="layer" :key="'hdmapsx' + index" :layer-style="layer.name == 'hdmap' ? hdmapStyle : {}"></ol-layer>
          <ol-layer v-for="(layer, index) in olMap.hdmap" :options="layer" :key="'hdmap' + index"></ol-layer>
        </template>
        <template v-slot:markerlayer>
          <ol-overlay class="pop" v-if="markerInfo.show" :position="markerInfo.coords" category="clickLabel">
            <div class="map-modal">
              <div class="map-header">
                <span>站点信息</span>
                <img src="@/assets/gb.png" @click="popClick" />
              </div>
              <div class="map-body">
                <div>
                  <label>名称：</label>
                  <span>{{ markerInfo.name }}</span>
                </div>
                <template v-if="markerInfo.bjzt">
                  <div>
                    <label>泵机状态：</label>
                    <a v-for="i in markerInfo.bjzt" :key="i">
                      <template v-if="i == 1">
                        <img src="@/assets/monFlood/1.gif" />
                      </template>
                      <template v-if="i == 0">
                        <img src="@/assets/monFlood/2.gif" />
                      </template>
                      <template v-if="i == 9">
                        <img src="@/assets/monFlood/9.png" />
                      </template>
                    </a>
                  </div>
                </template>
                <template v-if="markerInfo.zmzt">
                  <div>
                    <label>闸门状态：</label>
                    <a v-for="zm in markerInfo.zmzt" :key="zm">
                      <template v-if="zm == 1">
                        <img src="@/assets/monFlood/3.gif" />
                      </template>
                      <template v-if="zm == 0">
                        <img src="@/assets/monFlood/4.gif" />
                      </template>
                    </a>
                  </div>
                </template>
                <template v-if="markerInfo.sw">
                  <div>
                    <label>当前水位：</label>
                    <span>{{ markerInfo.sw }}</span>
                  </div>
                </template>
              </div>
            </div>
          </ol-overlay>
        </template>
      </map-manage>
    </div>
    <div class="view-item">
      <panel-view :heading="waterQulity.qulity.mc || waterQulity.qulity.name || waterQulity.qulity.siteName || waterQulity.qulity.sectionName">
        <template v-slot:right>
          <suc-button type="primary" :debounce="800" @on-click="btnClick">
            水质分级
          </suc-button>
        </template>
        <div class="amount-item">
          <div class="amount-item-sub" v-for="(item, index) in amountList" :key="index">
            <div>
              <span>{{ item.label }}</span>
            </div>
            <div :class="item.class">
              <span class="big-font">{{ item.amount }}</span>
              <span class="big-font" v-if="item.amount == ''">{{ item.dw }}</span>
              <span v-if="item.type == 'zh'">mg/l</span>
              <!-- <span v-if="item.amount != '-'">类</span> -->
            </div>
            <!-- <div :class="item.class" v-else>
              <span class="big-font" v-if="!item.dw">{{ item.amount }}</span>
              <span class="big-font" v-if="item.dw">{{ item.dw }}</span>
              <span v-if="item.type == 'sz'">类</span>
              <span v-else-if="item.type == 'sl'">m³/d</span>
              <span v-else-if="item.type == 'yz'">mg/L</span>
            </div> -->
          </div>
        </div>
      </panel-view>
      <suc-modal :config="modalConfig" :value="showModal" @on-cancel="goBack(false)" @on-visible-change="goBack">
        <qulity-table />
      </suc-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { MapManage, PanelView, TabActive } from "@/components";
import { riverApi } from "@/api";
import { getLakeIcon } from "@/constants/mapIcon";
import { coordinateTransform, OlEchartsLayer, olData } from "@suc/monch";
import QulityTable from "@/views/urbanWater/pages/qulityPage/component/QulityTable.vue";
import { SucButton, SucModal } from "@suc/ui";
import { ModalConfig } from "@suc/ui/interfaces";
import getLines from "@/constants/lineOption";
const mapStore = namespace("mapStore");
@Component({
  components: {
    MapManage,
    PanelView,
    SucButton,
    SucModal,
    QulityTable,
    TabActive,
  },
})
export default class SiteMap extends Vue {
  @State waterQulity: any;
  markers: any = [];
  @mapStore.Mutation setMarkers: any;
  olMap: any = this.$getMapConfig();
  showModal: boolean = false;
  modalConfig: ModalConfig = {
    width: 890,
    transfer: false,
    title: "水质分级",
    "footer-hide": true,
  };
  amountList: any[] = [];
  created() {
    this.layerPromise = new Promise((resolve) => {
      this.layerResolve = resolve;
    });
    this.features = [];
    this.hdmapStyle = (f: any) => {
      this.features.push(f);
      this.layerResolve(this.features);
      return {
        fill: {
          color: "#3d78ef",
        },
        stroke: {
          width: 2,
          color: "#3d78ef",
        },
      };
    };
  }

  mounted() {
    this.init();
    this.getSite();
    // this.getPath();
    // this.getFactors();
  }
  init() {
    if (this.waterQulity.qulity) {
      let row = this.waterQulity.qulity;
      let gisInfo = [
        {
          id: row.siteId || "1",
          name: row.siteName,
          lon: row.lon,
          lat: row.lat,
          info: row,
          coords: [row.lon, row.lat],
          style: {
            image: {
              icon: {
                anchor: [0.5, 1],
                // src: getLakeIcon(row.sbzt, row.standard),
                src: getLakeIcon("正常", "正常"),
              },
            },
          },
        },
      ];
      this.markers = gisInfo;
      this.setMarkers(this.markers);

      if (row.lon && row.lat) {
        const maps: any = this.$refs.maps;
        const mapRoot: any = maps.$refs.mapObject;
        let coord = [row.lon, row.lat];
        const tranPosN = coordinateTransform(coord, "EPSG:4326", "EPSG:3857");
        mapRoot.mapObject.getView().animate({
          center: tranPosN,
        });
      }
    }
  }
  siteParams: any = {
    sectionId: "",
    tm: "",
  };
  async getSite() {
    this.amountList = [];
    let url = "wjServer/waterENVIR/section/detail";
    this.siteParams.sectionId = this.waterQulity.qulity.sectionId;
    this.siteParams.tm = this.waterQulity.qulity.tm;

    let { data } = await riverApi.getWaterQulity(this.siteParams, url);
    // if (Array.isArray(data.yzs)) {
    //   for (let e of data.yzs) {
    //     for (let key in e) {
    //       let item = {
    //         label: key,
    //         amount: e[key][0],
    //         dw: e[key][0] != "-" ? (key == "PH值" ? "" : "mg/L") : null,
    //         type: e[key][0] != "-" ? e[key][2] : null,
    //         class: "blue-label",
    //       };
    //       this.amountList.push(item);
    //     }
    //   }
    // }
    this.amountList.unshift(
      {
        label: "当前水质",
        amount: data.nowWq,
        dw: "无",
        class: this.calcColor(data.nowWq),
      },
      {
        label: "目标水质",
        amount: data.targetWq,
        dw: "无",
        class: this.calcColor(data.targetWq),
      },
      {
        label: "氨氮浓度",
        amount: data.nh3n,
        class: this.calcColor(data.nh3n),
        type: "zh",
        dw: "无",
      },
      {
        label: "总磷浓度",
        amount: data.tp,
        class: this.calcColor(data.tp),
        type: "zh",
        dw: "无",
      },
      {
        label: "高锰酸盐指数",
        amount: data.codmn,
        class: this.calcColor(data.codmn),
        type: "zh",
        dw: "无",
      }
    );
  }
  // 获取因子以及单位
  factorsParams = {
    sbid: "",
  };
  async getFactors() {
    this.factorsParams.sbid = this.waterQulity.qulity.sbid;
    let url = "hjzl/basedata/getJcyzBySbid";
    let data = await riverApi.getWaterQulity(this.factorsParams, url);
    this.amountList.map((e: any) => {
      for (let i = 0; i < data.length; i++) {
        if (e.label == data[i].name) {
          e.dw = data[i].unit;
        }
      }
      return e;
    });
  }
  calcColor(level: string) {
    switch (level) {
      case "Ⅰ类":
        return "green-label";
      case "Ⅱ类":
        return "green-label";
      case "Ⅲ类":
        return "green-label";
      case "Ⅳ类":
        return "orange-label";
      case "Ⅴ类":
        return "red-label";
      case "劣Ⅴ类":
        return "darkRed-label";
      default:
        return "blue-label";
    }
  }
  btnClick() {
    this.showModal = true;
  }
  goBack(val: boolean) {
    this.showModal = val;
  }
  // 调水模型
  layerPromise: any = null;
  layerResolve: any = null;
  hdmapStyle: any = {
    fill: {
      color: "#3d78ef",
    },
    stroke: {
      width: 2,
      color: "#3d78ef",
    },
  };
  features: any[] = [];
  async getMapInfo() {
    let map: any = await olData.getMap("baseMap");
    let river: any[] = [];
    let hd: any[] = this.dsmx.hd;
    this.layerPromise.then((f: any) => {
      //   console.log(f)
      for (let i = 0; i < hd.length; i++) {
        f.forEach((item: any) => {
          if (item.properties_.name == hd[i].MC) {
            river.push(Object.assign(item, hd[i]));
          }
        });
      }
      let options = getLines(map, river);
      let oe = new OlEchartsLayer(options, map);
      oe.render();
      setTimeout(() => {
        //更新线图
        options.series[1].lineStyle.normal.width = 2;
        oe.updateChart(options);
      }, 40000);

      this.$once("hook:beforeDestroy", () => {
        oe.clear();
      });
    });
  }
  dsmx: any = {
    bz: [
      {
        id: "35",
        mc: "胜利1#泵站",
        jd: 118.822082,
        wd: 31.9490856,
        bjzt: [0, 0, 0],
        sw: 5.1,
      },
    ],
    hz: [
      {
        id: "29",
        mc: "利源沟与小西圩沟闸",
        jd: 118.802157,
        wd: 31.954881,
        zmzt: [1, 1, 1],
        sw: 6.094,
      },
    ],
    hd: [
      {
        ID: "70114700",
        TYPE: "Y",
        MC: "秦淮河",
        MBSZLB: "劣Ⅴ",
      },
    ],
  };
  async getPath() {
    this.dsmx = {};
    let pathParams: any = {
      zdid: this.waterQulity.qulity.siteId,
    };
    let data = await riverApi.getPath(pathParams);
    let { bz, hz, hd } = data;
    this.dsmx.bz = bz.map((arr: any) => {
      return {
        id: arr[0],
        mc: arr[1],
        jd: arr[2],
        wd: arr[3],
        bjzt: arr[4],
        sw: arr[5],
      };
    });
    this.dsmx.hz = hz.map((arr: any) => {
      return {
        id: arr[0],
        mc: arr[1],
        jd: arr[2],
        wd: arr[3],
        zmzt: arr[4],
        sw: arr[5],
      };
    });
    this.getBzHz();
    this.getRiverQulity(hd);
  }
  async getRiverQulity(ids: any) {
    let data = await riverApi.getRiverQulity({ id: ids });
    this.dsmx.hd = data.map((item: any) => {
      return {
        ID: item.RIVER_ID,
        TYPE: item.TYPE,
        MC: item.RIVER_NAME,
        MBSZLB: item.XZSZ,
      };
    });
    this.getMapInfo();
  }
  getBzHz() {
    let markers: any = [];
    let bzmarkers = this.dsmx.bz.map((item: any) => {
      return {
        id: item.id,
        coords: [item.jd, item.wd],
        name: item.mc,
        info: item,
        style: {
          image: {
            icon: {
              anchor: [0.5, 1],
              src: require("@/assets/map/泵站-正常.png"),
            },
          },
        },
      };
    });
    let hzmarkers = this.dsmx.hz.map((item: any) => {
      return {
        id: item.id,
        coords: [item.jd, item.wd],
        name: item.mc,
        info: item,
        style: {
          image: {
            icon: {
              anchor: [0.5, 1],
              src: require("@/assets/map/闸站-正常.png"),
            },
          },
        },
      };
    });
    let row = this.waterQulity.qulity;
    let site = [
      {
        id: row.riverId,
        coords: [row.jd, row.wd],
        name: row.siteName,
        style: {
          image: {
            icon: {
              anchor: [0.5, 1],
              src: require("@/assets/map/河湖-正常.png"),
            },
          },
        },
      },
    ];
    markers = markers.concat(hzmarkers, site, bzmarkers);
    this.setMarkers(markers);
  }
  markerInfo: any = {
    show: false,
  };
  popClick() {
    this.markerInfo.show = false;
  }
  // onmarkerClick(marker: any) {
  //   let info = marker.info;
  //   this.markerInfo = {
  //     show: false,
  //     //   offset: [0, -40],
  //     coords: marker.coords,
  //     name: marker.name,
  //     bjzt: info.bjzt,
  //     sw: info.sw,
  //     zmzt: info.zmzt,
  //   };
  // }
}
</script>
<style lang="scss" scoped>
.map-view {
  width: 100%;
  height: 100%;
  position: relative;
  .view-item {
    z-index: 5;
    &:first-of-type {
      height: 100%;
    }
    &:last-of-type {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 90px;
      background-color: rgba(255, 255, 255, 0.9);
      box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.08);
    }

    .amount-item {
      display: flex;
      align-items: center;
      &-sub {
        padding: 0 10px;
        display: flex;
        align-items: center;
        > div {
          padding-right: 10px;
          font-size: 14px;
          color: #333;
        }
        .big-font {
          font-size: 22px;
        }
        .darkRed-label {
          color: #ce1717;
        }
        .red-label {
          color: #ff5a47;
        }
        .orange-label {
          color: #ffab3d;
        }
        .blue-label {
          color: #3a7bef;
        }
        .green-label {
          color: #32bb53;
        }
      }
    }
  }
}
.map-modal {
  width: auto;
  box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.08);
  .map-header {
    width: auto;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #3a7bef;
    color: #fff;
    padding: 0 15px;

    img {
      width: 10px;
      height: 10px;
      cursor: pointer;
    }
  }

  .map-body {
    padding: 0 15px;
    height: auto;

    div {
      height: 30px;
      display: flex;
      align-items: center;
      // &:last-child {
      //   justify-content: space-between;
      // }
    }
  }

  .map-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
  }
}
.jt-img {
  width: 100%;
  height: 100%;
  background: #030b23;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 739px;
    height: 100%;
    // position: absolute;
    // margin-bottom: 80px;
  }
}
.l-map-btn {
  position: absolute;
  right: 20px;
  width: auto;
  height: auto;
  bottom: 110px;
  z-index: 10;
  background-color: transparent;
}
</style>
