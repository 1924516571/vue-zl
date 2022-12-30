<template>
  <div class="main-map">
    <suc-map ref="mapObject" :options="olMap.map" v-bind.sync="olMap.map.view" @singleclick="mapSingClick" @singleclick-blank="mapSingClick">
      <template>
        <ol-layer v-for="(layer, index) in olMap.dpLayer" :options="layer" :key="'layer' + index"></ol-layer>
      </template>
      <slot name="dpXwLayer">
        <ol-layer v-for="(layer, index) in olMap.dpXwLayer" :options="layer" :key="'layer' + index"></ol-layer>
      </slot>
      <slot name="mapbox" :zoom="zoom"></slot>
      <!-- 海量点位 -->
      <ol-point-collection :points="markers" :z-index="5" name-over-label @singleclick="onmarkerClick" @pointermove="aa">
        <slot name="markerlayer"></slot>
      </ol-point-collection>
    </suc-map>
    <!-- 点击地图经纬度显示 -->
    <!-- <slot name="coordinate">
      <div class="point-info bg-shadow">
        <div>
          <span>坐标信息：</span>
        </div>
        <div>
          <span>{{ pointerInfos.coords }}</span>
        </div>
      </div>
    </slot> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
const mapStore = namespace("mapStore");
@Component({
  components: {},
})
export default class MapManage extends Vue {
  @mapStore.State markers: any;
  @mapStore.State markerFlag: any;
  @mapStore.Mutation setMarkers: any;
  // 地图鼠标移动点击信息

  olMap = this.$getMapConfig();
  zoom: number = 13;
  @Watch("olMap.map.view.zoom", { immediate: true, deep: true })
  mapZoom(nva: number, ona: number) {
    console.log(nva, ">>>>", ona);
    this.zoom = nva;
    this.$emit("mapZoom", nva, ona);
    // let data:any = this.$refs.mapObject
    // let map = data.mapObject
    // let view = map.getView();
    // let extent = view.calculateExtent(map.getSize());
    // this.calcRadius(view.getProjection(),500);
  }

  onmarkerClick(info: any) {
    this.$emit("onmarkerClick", info.collectionInfo);
  }
  // 地图鼠标移动点击信息 这边显示位置信息
  pointerInfos: any = {};
  mapSingClick(e: any) {
    this.pointerInfos = e;
    this.$emit("mapSingClick", e);
  }
  aa(info: any) {
    // console.log(info, "hahahah");
    this.$emit("testClick", info.collectionInfo);
  }
}
</script>
<style lang="scss" scoped>
.main-map {
  width: 100%;
  height: 100%;
}
// .point-info {
//   position: absolute;
//   right: 15px;
//   top: 14px;
//   padding: 14px;
//   display: flex;
//   font-size: 14px;
//   color: #333;
// }
</style>
