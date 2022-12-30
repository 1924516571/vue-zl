<template>
  <!-- 资料库 -->
  <div class="module-view">
    <div class="plan">
      <div class="bg-shadow left scroll">
        <div class="tree">
          <el-tree
            ref="checkTree"
            :data="treeData"
            default-expand-all
            @node-click="getNode"
            :expand-on-click-node="false"
            :props="defaultProps"
            highlight-current
            node-key="id"
            :current-node-key="currentNodekey"
          ></el-tree>
        </div>
      </div>
      <div class="bg-shadow right">
        <div class="right-title">
          <span v-text="rightTitle">B1片区</span>
        </div>
        <div v-loading="loading" id="fDiv" class="rightUni" v-if="rightTitle">
          <video
            id='videoDiv'
            class="video-js"
            controls
            ref="video1"
            preload="auto"
            style="width: 100%; height: 100%"
            data-setup="{}"
          >
            <source :src="videoUrl" type="video/x-flv" />
          </video>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import {
  SucButton,
  SucTree,
  SucModal,
  SucForm,
  SucFormItem,
  SucSelect,
  SucInput,
} from "@suc/ui";
import { SelectOptions } from "@suc/ui/interfaces";
import { SearchComponent } from "@/components";
import "@/components/watermark";
import { dataBaseApi, infoApi } from "@/api";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// import flvjs from 'flv.js'
import "zkzy-videojs-dynamic-watermark";
import "videojs-flvjs-es6";
// import { videoPlayer } from 'vue-video-player'

@Component({
  components: {
    SucButton,
    SucTree,
    SucModal,
    SucForm,
    SucFormItem,
    SucSelect,
    SucInput,
    SearchComponent,
  },
})
export default class TransferPlan extends Vue {
  videoUrl: any = "";
  options: any = {};
  videoPlayer: any = null;
  treeData: any = [];
  delLoading: boolean = false;
  currentNodekey: any = "";
  dirId: string = "";
  addName: string = "";
  editName: string = "";
  rightTitle: string = "";
  loading: boolean = false;
  fileList: any = [];
  fzdwOptions: any = [];
  qymcOptions: any = [];
  userOptions: any = [];
  formParams: any = {};
  areaOptions: any = [];
  isFirstFlag: boolean = false; //判断选中是否为第一节点
  selectNodeId: string = ""; //选中节点id
  ids: any = []; //删除树节点id
  searchParams: string = "";
  defaultProps: any = {
    label: "name",
    chilren: "children",
  };
  nodeData: any = {
    label: "",
    id: "",
  };
  accessToken = "";
  mounted() {
    this.getTree();
    // this.getData("223")
    // this.watermark();
  }
  getTreeData(data: any) {
    // 循环遍历json数据
    for (var i = 0; i < data.length; i++) {
      if (data[i].children.length < 1) {
        // children若为空数组，则将children设为undefined
        data[i].children = undefined;
      } else {
        // children若不为空数组，则继续 递归调用 本方法
        this.getTreeData(data[i].children);
      }
    }
    return data;
  }

  // 获取树
  async getTree() {
    let url = "wjServer/dataCenter/device/image/videos";
    let data = await infoApi.getSelect(url);
    this.treeData = [data.data];
  }

  beforeUnmount() {
    if (this.videoPlayer) {
      this.videoPlayer.dispose();
    }
  }


  // 获取父组件的数据
  //   getData (text: any) {
  //     if (text == 'close') {
  //       // 关闭播放器
  //       this.$refs.videoPlayer.player.pause()
  //     } else {
  //       // 获取视频路径
  //       // this.options.sources[0].src = text
  //       // 添加水印
  //       setTimeout(() => {
  //         var div = document.getElementById('videoDiv')
  //         var div1 = div.firstChild
  //         var div3 = document.createElement("div");
  //         div3.id = 'userName';
  //         div3.setAttribute("class", "resize-drag");
  //         // 从父组件传过来的水印内容
  //         div3.innerText = "1213231313"
  //         div3.style.cssText = "position:absolute;top:100px;left:150px; color:#e6984d;font-size:40px;opacity:0.5;padding-top:10px";
  //         div1.appendChild(div3)
  //       }, 1000);
  //     }
  //   }

  //点击树节点
  async getNode(data: any) {
    this.rightTitle = data.name;
    this.selectNodeId = data.id;
    let url = "wjServer/dataCenter/device/image/getInfoByCd";
    let a = await infoApi.getWithParam(url, { zdbh: data.id });
    if (a.result) {
      if (a.data.sply) {
        this.loading = true;
        setTimeout(() => {
            if (this.videoPlayer) {
              this.videoPlayer.dispose();
              this.videoPlayer = null;
              var video = document.createElement('video');
              video.id = 'videoDiv';
              video.className = 'video-js';
              video.style.width = '100%';
              video.style.height = '100%';
              video.controls = true;
              video.preload = 'auto';
              (document.getElementById('fDiv')as any).appendChild(video)
            }
            let options = {
            muted: true,
            controls: true, //进度条
            autoplay: true, //自动播放
            loop: false, //是否循环
            languages: {
              "zh-CN": require("video.js/dist/lang/zh-CN.json"),
            },
            language: "zh-CN",
            preload: "auto",
            techOrder: ["flvjs", "html5"], // 兼容顺序
            flvjs: {
              mediaDataSource: {
                isLive: true,
                cors: true,
                withCredentials: false,
              },
            },
            // sources: [{ src: this.videoUrl, type: "video/x-flv" }]
          };
          this.videoPlayer = videojs('videoDiv', options);
          this.videoUrl = a.data.sply;
          this.videoPlayer.dynamicWatermark({
            // elementId: "videoDiv",
            elementId: "unio_id",
            watermarkText: JSON.parse(localStorage.getItem("userInfo") || "")
              .realname,
            changeDuration: 100000000,
            cssText:
              // "color: grey; background-color: transparent; font-size: 1rem; z-index: 999; position: absolute;left: 500px; @media only screen and (max-width: 400px){font-size: 0.8rem;}",
              "width: 120px; height: 50px; font-size: 20px; color: rgba(0,0,255,1.00);user-select: none; z-index: 9999; font-family: 方正黑体; -o-transform: translate(-50%, -50%) rotate(-35deg);-webkit-transform: translate(-50%, -50%) rotate(-35deg); -moz-transform: translate(-50%, -50%) rotate(-35deg); -ms-transform: translate(-50%, -50%) rotate(-35deg);transform: translate(-50%, -50%) rotate(-35deg);position: absolute;top:50%;left:60%;",
            left: "350px",
            top: "300px",
          });
          this.videoPlayer.src({ src: a.data.sply, type: "video/x-flv" });
          this.loading = false;
        }, 500);
      
      } else {
        this.$Message.info("暂无视频");
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
$deep: "::v-deep";
.module-view {
  #{$deep}.vjs-big-play-button {
    left: 50% !important;
    top: 50% !important;
  }
  position: relative;
  padding: 10px;
  background-color: $pages-bg;
  .bg-shadow {
    background-color: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  }
  .top {
    padding: 14px 15px;
    display: flex;
    justify-content: space-between;
    .button-pannel {
      display: inline-block;
      margin-right: 16px;
    }
  }
  .plan {
    display: flex;
    margin-top: 10px;
    height: calc(100% - 70px);
    .left {
      padding-top: 10px;
      padding: 10px;
      width: 400px;
      height: 100%;
      overflow: auto;
      .tree {
        margin-top: 20px;
      }
    }
    .right {
      margin-left: 10px;
      width: calc(100% - 210px);
      height: 100%;
      &-title {
        padding: 15px;
        border-bottom: 1px solid $border-color;
      }
      &-content {
        padding: 5%;
      }
      .rightUni {
        width: 100%;
        height: calc(100% - 50px);
      }
      .video-watermark-item {
        width: 120px;
        height: 50px;
        left: 16.7%;
        font-size: 20px;
        color: rgba(0, 0, 255, 1);
        user-select: none;
        z-index: 9999;
        font-family: 方正黑体;
        -o-transform: translate(-50%, -50%) rotate(-35deg);
        -webkit-transform: translate(-50%, -50%) rotate(-35deg);
        -moz-transform: translate(-50%, -50%) rotate(-35deg);
        -ms-transform: translate(-50%, -50%) rotate(-35deg);
        transform: translate(-50%, -50%) rotate(-35deg);
        position: absolute;
      }
    }
  }
  .delete-view {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>
