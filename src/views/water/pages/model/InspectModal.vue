<template>
  <div class="inspect-modal">
    <div class="inspect-left">
      <div class="inspect-head">养护信息</div>
      <div class="map">
        <suc-map ref="maps" :options="olMap.map" v-bind.sync="olMap.map.view">
          <template>
            <ol-layer v-for="(layer, index) in olMap.baseLayer" :options="layer" :key="'layer' + index"> </ol-layer>
          </template>
          <ol-markers>
            <ol-marker v-for="(marker, index) in markers" :options="marker" :key="index"></ol-marker>
          </ol-markers>
          <!-- 轨迹路线 -->
          <ol-path :options="route"></ol-path>
          <!--<ol-path v-for="(item, index) in mapPaths" :key="index" :options="item"></ol-path>-->
        </suc-map>
      </div>

      <div class="inspect-item">
        <div>
          <span>养护时间：</span>
          <span>{{ info.yhTime }}</span>
        </div>
      </div>
      <div class="inspect-item">
        <div>
          <span>养护人:</span>
          <span>{{ info.yhUser }}</span>
        </div>
      </div>
      <div class="inspect-item">
        <div>
          <span>养护时长:</span>
          <span>{{ info.yhMin }}分钟</span>
        </div>
      </div>
      <div class="inspect-item">
        <div>
          <span>养护距离:</span>
          <span>{{ info.yhDistance }}米</span>
        </div>
      </div>
      <div class="inspect-item">
        <div>
          <span>问题数量:</span>
          <span>{{ info.problemList.length !== 0 ? info.problemList.length + "个" : 0 }}</span>
        </div>
      </div>

      <!-- <div class="inspect-xj" v-if="target=='养护'">
                <div>养护小结：</div>
                <div class="scroll">{{info.content}}</div>
            </div> -->
      <!-- <div class="inspect-picture" v-if="target=='养护'">
                <div>养护照片：</div>
                <div class="picture">
                    <viewer :images="imageList" style="display: flex; flex-wrap: wrap">
                        <div
                            class="company-item"
                            v-for="(item, index) in imageList"
                            :key="index"
                        >
                            <img :src="item.src" />
                        </div>
                    </viewer>
                </div>
            </div> -->
    </div>
    <!-- v-if="target == '养护'" -->
    <div class="inspect-right scroll">
      <div class="inspect-head">养护问题</div>
      <!-- <div class="log-item" v-for="(item, index) in info.log" :key="index">
       <div :class="[item.select == 0 ? 'zc-status' : 'yc-status']">{{ item.select == 0 ? "正常" : "异常" }}</div>
        <div :title="item.mc">{{ item.mc }}</div> 
      </div> -->
      <!-- <div v-if="info.problemList.length == 0" class="noData">暂无问题</div> -->
      <div class="log" v-for="(item, index) in info.problemList" :key="index">
        <div style="display:flex;justify-content: space-between">
          <span
            >问题名称:<span style="color:#333333">{{ item.problemName }}</span></span
          >
          <div :class="[item.status == '已完成' ? 'zc-status' : 'yc-status']">{{ item.status }}</div>
        </div>
        <div>
          <span>上报时间:</span>
          <span>{{ item.reportTime }}</span>
        </div>
        <div>
          <span>问题位置:</span>
          <span>{{ item.address }}</span>
        </div>
        <div>
          <span>问题描述:</span>
          <span>{{ item.content }}</span>
        </div>
        <!-- v-if="target == '养护'" -->
        <div class="inspect-picture">
          <div class="picture">
            <viewer :images="item.minIoFileList" style="display: flex; flex-wrap: wrap">
              <div class="company-item" v-for="(item1, index) in item.minIoFileList" :key="index">
                <img :src="item1.previewUrl" />
              </div>
            </viewer>
          </div>
        </div>
      </div>
    </div>
    <loading-com :loadingShow="loadingShow"></loading-com>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { maintenanceApi } from "@/api";
import { namespace } from "vuex-class";
import { LoadingCom } from "@/components";
const mapStore = namespace("mapStore");
import { coordinateTransform, OlEchartsLayer } from "@suc/monch";
import { onImageLoad } from "@/api/public";
import getXcLines from "@/constants/xcLineOption";

@Component({
  components: {
    LoadingCom,
  },
})
export default class InspectModal extends Vue {
  @Prop() target!: string;
  @Prop() loadingShow!: boolean;
  @mapStore.State olMap: any;
  @Prop() inspectId!: string;
  info: any = {};
  markers: any[] = [];
  mapPaths: any[] = [];
  imageList: any[] = [];
  route: any = {
    //路线
    id: "line",
    type: "LineString",
    coords: [],
    style: {
      stroke: {
        width: 2,
        color: "#00be2e",
        lineDash: [4, 4],
      },
    },
  };
  data1: any[] = [];
  coords: any[] = [];

  init() {
    // this.olMap.map.view.center.coord = [120.27869688218249, 31.685617674794585];
    this.getData();
    this.getMarkers();
    this.getMapInfo();
    // this.getInspectRecord()
  }

  // 获取巡查路线
  async getMapInfo() {
    let map: any = await (this.$refs.maps as any).getMap("baseMap");
    // let river: any[] = [];
    let options = getXcLines(this.data1, this.coords);
    let oe = new OlEchartsLayer(options, map);
    oe.render();
    setTimeout(() => {
      //更新线图
      options.series[1].lineStyle.width = 2;
      oe.updateChart(options);
    }, 8000);

    // this.$once("hook:beforeDestroy", () => {
    // 	oe.clear();
    // });
  }

  //点位赋值
  initPoints(data: any[]) {
    // this.trackParams.points = data;
    this.route.coords = data.map((p) => [p.lon, p.lat]);
  }
  getMarkers() {
    let that = this;
    let markerArr: any = [];
    let arr: any = [];
    let xcTravelParams = {
      recordCode: this.inspectId,
    };
    maintenanceApi.getXcTravel(xcTravelParams).then(async (data) => {
      let startPoint = [];
      let endPoint = [];
      this.data1 = [];

      console.log(data, "44");

      if (data.data.length) {
        arr = data.data
          ? data.data.map((item: any, index: any) => {
              let markericon = "";
              if (index === 0) {
                markericon = require("@/assets/map/起点.png");
              } else if (index === data.data.length - 1) {
                markericon = require("@/assets/map/终点.png");
              }
              return {
                id: "inspect" + index,
                name: item.createTime,
                lon: item.jd,
                lat: item.wd,
                coords: [item.jd, item.wd],
                style: {
                  image: {
                    icon: {
                      anchor: [0.5, 1],
                      src: markericon,
                    },
                  },
                },
              };
            })
          : [];
      }
      console.log(arr, "88");

      let map: any = await (this.$refs.maps as any).getMap("baseMap");
      let proj = map.getView().getProjection();
      let coord1 = [];
      let coord2 = [];
      let fromCoord = [];
      let toCoord = [];
      let length = 0;
      if (arr.length % 2 == 0) {
        length = arr.length;
      } else {
        length = arr.length - 1;
      }
      let coords: any[] = [];
      for (let k = 0; k < length; k++) {
        coord1 = arr[k].coords;
        fromCoord = coordinateTransform(coord1, "EPSG:4326", proj);
        if (fromCoord) {
          coords.push(fromCoord);
        }
      }
      this.coords.push({
        coords: coords,
      });
      this.data1.push({
        coords: [coordinateTransform(arr[0].coords, "EPSG:4326", proj), coordinateTransform(arr[arr.length - 1].coords, "EPSG:4326", proj)],
      });
      markerArr.push(arr[0]);
      markerArr.push(arr[arr.length - 1]);
      this.markers = markerArr;
      console.log(this.markers, "markers");
      console.log(arr, "arr");

      this.initPoints(arr);
      this.getLocation([arr[0].lon, arr[0].lat]);
      // this.getLocation([120.27869688218249, 31.685617674794585]);
    });

    //-------------------------------------------------------------

    // let startPoint = [];
    // let endPoint = [];
    // this.data1 = [];

    // arr = [
    //   {
    //     id: "inspect01",
    //     name: "233",
    //     lon: 118.774925,
    //     lat: 31.894308,
    //     coords: [118.774925, 31.894308],
    //     style: {
    //       image: {
    //         icon: {
    //           anchor: [0.5, 1],
    //           src: require("@/assets/map/起点.png"),
    //         },
    //       },
    //     },
    //   },
    //   {
    //     id: "inspect02",
    //     name: "273",
    //     lon: 118.77494,
    //     lat: 31.894335,
    //     coords: [118.77494, 31.894335],
    //     style: {
    //       image: {
    //         icon: {
    //           anchor: [0.5, 1],
    //         },
    //       },
    //     },
    //   },
    //   {
    //     id: "inspect03",
    //     name: "2738",
    //     lon: 118.77502,
    //     lat: 31.894442,
    //     coords: [118.77502, 31.894442],
    //     style: {
    //       image: {
    //         icon: {
    //           anchor: [0.5, 1],
    //         },
    //       },
    //     },
    //   },
    //   {
    //     id: "inspect04",
    //     name: "2739",
    //     lon: 118.77502,
    //     lat: 31.894455,
    //     coords: [118.77502, 31.894455],
    //     style: {
    //       image: {
    //         icon: {
    //           anchor: [0.5, 1],
    //           // src: require("@/assets/map/终点.png"),
    //         },
    //       },
    //     },
    //   },
    //   {
    //     id: "inspect05",
    //     name: "27423",
    //     lon: 118.77502,
    //     lat: 31.894464,
    //     coords: [118.77502, 31.894464],
    //     style: {
    //       image: {
    //         icon: {
    //           anchor: [0.5, 1],
    //           src: require("@/assets/map/终点.png"),
    //         },
    //       },
    //     },
    //   },
    // ];
    // let map: any = await(this.$refs.maps as any).getMap("baseMap");
    // console.log("00");

    // let proj = map.getView().getProjection();
    // let coord1 = [];
    // let coord2 = [];
    // let fromCoord = [];
    // let toCoord = [];
    // let length = 0;
    // if (arr.length % 2 == 0) {
    //   length = arr.length;
    // } else {
    //   length = arr.length - 1;
    // }
    // let coords: any[] = [];
    // for (let k = 0; k < length; k++) {
    //   coord1 = arr[k].coords;
    //   console.log(coord1, "coord1");

    //   fromCoord = coordinateTransform(coord1, "EPSG:4326", proj);
    //   if (fromCoord) {
    //     coords.push(fromCoord);
    //   }
    // }
    // this.coords.push({
    //   coords: coords,
    // });
    // this.data1.push({
    //   coords: [coordinateTransform(arr[0].coords, "EPSG:4326", proj), coordinateTransform(arr[arr.length - 1].coords, "EPSG:4326", proj)],
    // });
    // markerArr.push(arr[0]);
    // markerArr.push(arr[arr.length - 1]);
    // this.markers = markerArr;
    // console.log(arr,"--");

    // this.initPoints(arr);
    // this.getLocation([arr[0].lon, arr[0].lat]);
    // //   this.getLocation([120.27869688218249, 31.685617674794585]);
  }

  // 获取详情
  getData() {
    maintenanceApi
      .getMaintenanceDetail({
        recordCode: this.inspectId,
      })
      .then((data: any) => {
        this.info = data ? data.data : {};
      })
      .catch(() => {
        this.$Message.error("获取数据失败");
      });
  }
  // getImg(files: any) {
  //   let that = this;
  //   that.imageList = [];
  //   if (files) {
  //     for (let i = 0; i < files.length; i++) {
  //       let url = `jnsw/maintain/plan/downloadPhoto?id=${files[i].id}`;
  //       onImageLoad(url).then((res: any) => {
  //         that.imageList.push({ src: res });
  //       });
  //     }
  //   }
  // }
  // 获取巡查记录
  // getInspectRecord() {
  //     this.mapPaths = [];
  //     this.markers = [];
  //     maintenanceApi.getTrack(this.inspectId).then((data: any) => {
  //         if (data.result == "success") {
  //             let list: any[] = [];
  //             if (data && data.data && data.data.gpsData instanceof Array) {
  //                 data.data.gpsData.forEach((e: any) => {
  //                     let lon = e.longitude;
  //                     let lat = e.latitude;
  //                     if (lon && lat) {
  //                         list.push([lon, lat]);
  //                     }
  //                 });
  //             }
  //             if (list && list.length > 0) {
  //                 this.mapPaths.push({
  //                     //路线
  //                     id: "line",
  //                     type: "LineString",
  //                     coords: list,
  //                     style: {
  //                         stroke: {
  //                             width: 2,
  //                             color: "#ff6600",
  //                         },
  //                     },
  //                 })
  //                 //巡查返回后，再进，额外初始化起始点
  //                 let coords = list[0];
  //                 let lon = coords[0];
  //                 let lat = coords[1];
  //                 if (lon && lat) {
  //                     this.markers.push({
  //                         id: "startInspectPosition",
  //                         lon: lon,
  //                         lat: lat,
  //                         coords: [lon, lat],
  //                         notInit: true,
  //                         style: {
  //                             image: {
  //                                 icon: {
  //                                     anchor: [0.5, 1],
  //                                     src: require("@/assets/map/起点.png"),
  //                                 },
  //                             },
  //                         },
  //                     })
  //                     this.getLocation([lon, lat])
  //                     //当前位置
  //                     let coordse = list[list.length - 1];
  //                     let lone = coordse[0];
  //                     let late = coordse[1];
  //                     if (lone && late) {
  //                         this.markers.push({
  //                             id: "endInspectPosition",
  //                             lon: lone,
  //                             lat: late,
  //                             notInit: true,
  //                             coords: [lone, late],
  //                             style: {
  //                                 image: {
  //                                     icon: {
  //                                         anchor: [0.5, 1],
  //                                         src: require("@/assets/map/终点.png"),
  //                                     },
  //                                 },
  //                             },
  //                         })
  //                     }
  //                 }
  //             }
  //         } else {
  //             this.$SucMessage.error("获取养护轨迹失败")
  //         }
  //     }).catch(() => {
  //         this.$SucMessage.error("获取养护轨迹失败")
  //     })
  // }
  //地图定位
  getLocation(coords: any) {
    const maps: any = this.$refs.maps;
    const tranPosN = coordinateTransform(coords, "EPSG:4326", "EPSG:3857");
    maps.$view.animate({
      center: tranPosN,
      zoom: 18,
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/common.scss";
$deep: "::v-deep";
.inspect-modal {
  display: flex;

  .inspect-head {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
  }
  .inspect-left {
    width: 500px;
    padding-right: 20px;
    .map {
      height: 220px;
      border: 1px solid #efefef;
      border-radius: 4px;
      margin-top: 12px;
    }
    .inspect-item {
      display: flex;
      align-items: center;
      margin-top: 20px;
      > div {
        &:nth-child(1) {
          margin-right: 100px;
        }
        &:nth-child(2) {
          margin-right: 70px;
        }
        > span {
          font-size: 14px;
          &:nth-child(1) {
            color: #777777;
          }
          &:nth-child(2) {
            color: #333333;
          }
        }
      }
    }
    .inspect-xj {
      margin-top: 16px;
      > div {
        &:nth-child(1) {
          font-size: 14px;
          color: #777777;
        }
        &:nth-child(2) {
          height: 100px;
          background-color: #fbfbfb;
          border-radius: 4px;
          border: solid 1px #dde4eb;
          font-size: 12px;
          color: #333333;
          line-height: 22px;
          margin-top: 8px;
          padding: 10px;
          overflow: auto;
        }
      }
    }
    .inspect-picture {
      margin-top: 16px;
      > div {
        &:nth-child(1) {
          font-size: 14px;
          color: #777777;
        }
      }
      .picture {
        margin-top: 8px;
        .company-item {
          width: 86px;
          height: 86px;
          margin-right: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          > img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .inspect-right {
    width: 450px;
    height: 455px;
    padding-left: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    border-left: solid 1px #dde4eb;
    .noData {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .log {
      margin-top: 10px;
      // height: 30px;
      line-height: 30px;
      .zc-status {
        background-color: #dcedff;
        color: #3396fb;
        padding: 2px;
        margin-right: 2px;
      }
      .yc-status {
        background-color: #ffdcdc;
        color: #fb3333;
        padding: 2px;
        margin-right: 2px;
      }
      > div {
        > span {
          font-size: 14px;
          &:nth-child(1) {
            color: #777777;
          }
          &:nth-child(2) {
            color: #333333;
          }
        }
      }
      .picture {
        margin-top: 8px;
        .company-item {
          width: 86px;
          height: 86px;
          margin-right: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          > img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .log-item {
      margin-top: 14px;
      display: flex;
      align-items: center;
      .zc-status {
        background-color: #dcedff;
        color: #3396fb;
      }
      .yc-status {
        background-color: #ffdcdc;
        color: #fb3333;
      }
      > div {
        font-size: 12px;
        line-height: 20px;
        &:nth-child(1) {
          display: inline-block;
          width: 36px;
          height: 20px;
          border-radius: 2px;
          text-align: center;
          margin-right: 8px;
        }
        &:nth-child(2) {
          width: calc(100% - 42px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #5b5e61;
        }
      }
    }
  }
}

// .ivu-modal-wrap .suc-modal {
//   .ivu-modal {
//       #{$deep}.ivu-modal-content {
//          min-height:543px!important;
//     }
//   }
// }
#{$deep}.ivu-modal-content {
  min-height: 543px !important;
}
</style>
