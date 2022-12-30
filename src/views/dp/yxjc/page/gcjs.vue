<template>
  <div class="gcjsContent">
    <div class="left">
      <div class="yjTitle">在建工地</div>
      <div class="threeDPie">
        <gcjs-pie :optionsData="pieData"></gcjs-pie>
        <div class="yp"></div>
      </div>
      <div class="jxsbTitle">机械设备</div>
      <div class="jxsb">
        <div>
          <p>403</p>
          <p>
            <img src="@/assets/dp/Gcjs/jxsb1.png" alt="" />
          </p>
          <p>
            塔吊
          </p>
        </div>
        <div>
          <p>241</p>
          <p>
            <img src="@/assets/dp/Gcjs/jxsb2.png" alt="" />
          </p>
          <p>
            施工升降机
          </p>
        </div>
        <div>
          <p>791</p>
          <p>
            <img src="@/assets/dp/Gcjs/jxsb3.png" alt="" />
          </p>
          <p>
            吊篮
          </p>
        </div>
        <div>
          <p>102</p>
          <p>
            <img src="@/assets/dp/Gcjs/jxsb4.png" alt="" />
          </p>
          <p>
            其他
          </p>
        </div>
      </div>
      <div class="zhxtTitle">指挥协同</div>
      <div class="zhxt">
        <div>
          <p class="fx"></p>
          <span class="num">1935</span>
          <span>发现问题</span>
        </div>
        <div>
          <p class="la"></p>
          <span class="num">1856</span>
          <span>立案</span>
        </div>
        <div>
          <p class="pd"></p>
          <span class="num">1803</span>
          <span>派单</span>
        </div>
        <div>
          <p class="cz"></p>
          <span class="num">1789</span>
          <span>处置</span>
        </div>
        <div>
          <p class="hc"></p>
          <span class="num">1767</span>
          <span>核查</span>
        </div>
        <div>
          <p class="ja"></p>
          <span class="num">1718</span>
          <span>结案</span>
        </div>
      </div>
      <div class="xtTable">
        <gcjs-table></gcjs-table>
      </div>
    </div>
    <div class="middle">
      <div class="totalList">
        <img src="@/assets/dp/OperateMonitoreRq/jt1.png" alt="" />
        <img src="@/assets/dp/OperateMonitoreRq/jt2.png" alt="" />
        <!-- <img src="../../../../assets/dp/OperateMonitoreRq/jzt.png" alt=""> -->
        <div class="des">
          <div v-for="(list, index) in totalList" :key="index">
            <div class="des_bottom">
              <p class="num">{{ list.value }}</p>
              <p class="numDes">{{ list.name }}</p>
            </div>
            <div :class="index == 7 ? 'aa' : 'sx'"></div>
          </div>
        </div>
      </div>
      <div class="jldw">
        <p>60</p>
        <p>监理单位</p>
      </div>
      <div class="kx"></div>
      <div class="jsdw">
        <p>124</p>
        <p>建设单位</p>
      </div>
      <div class="sgdw">
        <p>107</p>
        <p>施工单位</p>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom_left">
        <span>监控监测</span>
        <span>车辆监测</span>
        <div class="tb"></div>
        <div class="zx"><span class="zx_text">在线</span><span class="zx_num">85</span></div>
        <div class="wz"><span class="zx_text">未知</span><span class="zx_num">106</span></div>
        <div class="lx"><span class="zx_text">离线</span><span class="zx_num">145</span></div>
      </div>
      <div class="bottom_right">
        <span>设备报警</span>
        <span>环境监测</span>
        <div class="main">
          <div>
            <p>112</p>
            <p>
              <img src="@/assets/dp/Gcjs/bottom1.png" style="height:104px" alt="" />
            </p>
            <p>监测设备</p>
          </div>
          <div>
            <p>102</p>
            <p>
              <img src="@/assets/dp/Gcjs/bottom2.png" alt="" />
            </p>
            <p>在线设备</p>
          </div>
          <div>
            <p>2</p>
            <p>
              <img src="@/assets/dp/Gcjs/bottom3.png" alt="" />
            </p>
            <p>PM2.5超标(17ug/㎡)</p>
          </div>
          <div>
            <p>3</p>
            <p>
              <img src="@/assets/dp/Gcjs/bottom4.png" alt="" />
            </p>
            <p>PM10超标(17ug/㎡)</p>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="yjTitle">巡查概况</div>
      <div class="threeDPie">
        <div class="right_left">
          <span>监管巡查</span>
          <span>三方巡查</span>
        </div>
        <div class="tb_left">
          <left-pie></left-pie>
        </div>
        <div class="tb_right">
          <right-pie></right-pie>
        </div>
      </div>
      <div class="wgsj">违规事件</div>
      <div class="wgsj_tb">
        <div class="charts">
          <hbar :refresh_interVal="3000"></hbar>
        </div>
        <div class="charts1">
          <wgsj-pie :refresh_interVal="3000"></wgsj-pie>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import gcjsPie from "../components/gcjs3dPieEcharts.vue";
import GcjsTable from "../components/GcjsTable.vue";
import leftPie from "../components/leftPie.vue";
import rightPie from "../components/rightPie.vue";
import hbar from "../components/gcjshBarEcharts.vue";
import wgsjPie from "../components/wgsjPie.vue";
import { publicApi } from "@/api";
import { sum } from "lodash";
@Component({
  components: {
    gcjsPie,
    GcjsTable,
    leftPie,
    rightPie,
    hbar,
    wgsjPie,
  },
})
export default class Gcjs extends Vue {
  pieData: any = [];
  bjTotal: any = "";
  txIcon: any = require("@/assets/dp/OperateMonitoreRq/hBarBg.png");
  totalList = [
    { name: "木工", value: "4865" },
    { name: "瓦工", value: "4452" },
    { name: "钢筋工", value: "4125" },
    { name: "水电工", value: "3406" },
    { name: "架子工", value: "3056" },
    { name: "防水工", value: "1762" },
    { name: "机械工", value: "923" },
    { name: "其他", value: "736" },
  ];
  gcjsData: any = [
    {
      code: "workorder_handleReason_warn_011",
      name: "人员履职类",
      num: "2831",
      totalnum: "11156",
      percent: "27.03",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_009",
      name: "高处作业",
      num: "1999",
      totalnum: "11156",
      percent: "14.19",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_010",
      name: "安全管理类",
      num: "1304",
      totalnum: "11156",
      percent: "9.46",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_008",
      name: "其他类",
      num: "1161",
      totalnum: "11156",
      percent: "8.78",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_005",
      name: "文明施工",
      num: "1147",
      totalnum: "11156",
      percent: "8.11",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_006",
      name: "施工用电",
      num: "1004",
      totalnum: "11156",
      percent: "6.08",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_017",
      name: "行为类",
      num: "714",
      totalnum: "11156",
      percent: "5.98",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_004",
      name: "高处作业吊篮",
      num: "620",
      totalnum: "11156",
      percent: "5.24",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_016",
      name: "扣件式钢管脚手架",
      num: "119",
      totalnum: "11156",
      percent: "4.05",
      lb: "1",
    },
    {
      code: "workorder_handleReason_warn_002",
      name: "模板支架",
      num: "106",
      totalnum: "11156",
      percent: "3.38",
      lb: "1",
    },
  ];

  bjyyList: any = [];
  bjyyData: any = [];
  mounted() {
    this.getYjtj();
  }
  async getYjtj() {
    // let url = "wjServer/xwzl/yxjc/warnOverview";
    // const data = await publicApi.getNoParam(url);
    this.pieData = [
      {
        name: "水利工程",
        value: Number(80),
        itemStyle: {
          color: "RGBA(250, 207, 45, 1)",
        },
      },
      {
        name: "市政工程",
        value: Number(130),
        itemStyle: {
          color: "RGBA(247, 152, 28, 1)",
          // opacity: 1,
        },
      },
      {
        name: "房屋工程",
        value: Number(168),
        itemStyle: {
          color: "#42a5f5",
          // opacity: 1,
        },
      },
      {
        name: "其他工程",
        value: Number(102),
        itemStyle: {
          color: "#5FF5FE",
          // opacity: 1,
        },
      },
    ];
    this.bjTotal = sum(
      this.pieData.map((value: any) => {
        return value.value;
      })
    );
  }
  // 获取违规事件数据
  // async getWgsj() {
  // for (var i = 0; i < this.gcjsData.length; ++i) {
  //   this.gcjsData.push({
  //     name: Math.round(Math.random() * 20),
  //     percent: (Math.random() * 50).toFixed(2),
  //   });
  // }
  // console.log(this.gcjsData, "777");

  // this.gcjsData.forEach((item: any) => {
  //   this.bjyyList.push(item.name);
  // });
  // this.bjyyData = this.gcjsData.map((item: any) => {
  //   return {
  //     value: item.percent,
  //     symbol: "image://" + this.txIcon,
  //   };
  // });
  // }
}
</script>
<style lang="scss" scoped>
// @keyframes planet-rotate {
//   0% {
//     transform: rotate(0) scaleY(2) rotate(-45deg);
//   }
//   100% {
//     transform: rotate(-360deg) scaleY(2) rotate(-45deg);
//   }
// }
// @keyframes self-rotate {
//   0% {
//     transform: rotate(0) scaleY(2) rotate(-45deg);
//   }
//   100% {
//     transform: rotate(-360deg) scaleY(2) rotate(-45deg);
//   }
// }
@keyframes run {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(80deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.gcjsContent {
  width: 100%;
  height: 100%;
  background: url("../../../../assets/dp/Gcjs/gcjsBgimg.jpg") no-repeat;
  // background-size: 100% calc(100% - 84px);
  background-size: cover;
  margin-top: -3%;
  overflow: auto;
  z-index: -9999;
  // transform-style: preserve-3d;
  // transform: scaleY(0.5) rotateZ(45deg);
  // animation: planet-rotate 10s linear infinite;
  .left {
    .yjTitle {
      position: absolute;
      left: 31px;
      top: 104px;
      width: 430px;
      height: 40px;
      background: url("../../../../assets/dp/OperateMonitoreRq/1(3).png") no-repeat;
      background-size: 100% 100%;
      border: 1px solid #022e40;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      line-height: 38.13px;
      text-align: center;
    }
    .threeDPie {
      position: absolute;
      top: 150px;
      left: 31px;
      width: 430px;
      height: 264px;
      background: rgba(1, 38, 58, 0.4);
      .yp {
        position: absolute;
        width: 247px;
        height: 143px;
        background: url("../../../../assets/dp/OperateMonitoreRq/yp.png") no-repeat;
        background-size: 100% 100%;
        top: 135px;
        left: 84px;
        height: 0.744792rem;
      }
    }
    .jxsbTitle {
      position: absolute;
      left: 31px;
      top: 425px;
      width: 430px;
      height: 40px;
      background: url("../../../../assets/dp/OperateMonitoreRq/1(3).png") no-repeat;
      background-size: 100% 100%;
      border: 1px solid #022e40;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      line-height: 38.13px;
      text-align: center;
    }
    .jxsb {
      position: absolute;
      left: 31px;
      top: 475px;
      width: 430px;
      height: 190px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: rgba(1, 38, 58, 0.4);
      > div {
        text-align: center;
      }
    }
    .zhxtTitle {
      position: absolute;
      left: 31px;
      top: 674px;
      width: 430px;
      height: 40px;
      background: url("../../../../assets/dp/OperateMonitoreRq/1(3).png") no-repeat;
      background-size: 100% 100%;
      border: 1px solid #022e40;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      line-height: 38.13px;
      text-align: center;
    }
    .zhxt {
      position: absolute;
      left: 31px;
      top: 721px;
      width: 430px;
      height: 333px;
      background: rgba(1, 38, 58, 0.4);
      div {
        width: 100px;
        margin-right: 29px;
        height: 52px;
        display: inline-block;
        p {
          width: 52px;
          height: 52px;
          float: left;
        }
        span {
          width: 48px;
          display: inline-block;
          height: 12px;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          line-height: 10px;
          vertical-align: bottom;
        }
        .fx {
          background: url("../../../../assets/dp/OperateMonitoreRq/fx.png") no-repeat;
          background-size: 100% 100%;
        }
        .la {
          background: url("../../../../assets/dp/OperateMonitoreRq/la.png") no-repeat;
          background-size: 100% 100%;
        }
        .pd {
          background: url("../../../../assets/dp/OperateMonitoreRq/pd.png") no-repeat;
          background-size: 100% 100%;
        }
        .cz {
          background: url("../../../../assets/dp/OperateMonitoreRq/cz.png") no-repeat;
          background-size: 100% 100%;
        }
        .hc {
          background: url("../../../../assets/dp/OperateMonitoreRq/hc.png") no-repeat;
          background-size: 100% 100%;
        }
        .ja {
          background: url("../../../../assets/dp/OperateMonitoreRq/ja.png") no-repeat;
          background-size: 100% 100%;
        }
        .num {
          height: 17px;
          font-size: 18px;
          font-family: Bebas;
          margin-top: 10px;
          font-weight: 800;
          color: #40e6fe;
          line-height: 16px;
          background: linear-gradient(0deg, #1bc0fd 0%, #1eeaf1 100%);
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      // 盒子第一个 和 第四个左边25px
      div:nth-child(3n + 1) {
        margin-left: 25px;
      }
    }
    .xtTable {
      width: 420px;
      height: 200px;
      position: absolute;
      top: 840px;
      left: 31px;
      margin-left: 10px;
      // background: red;
    }
  }
  .middle {
    .totalList {
      position: absolute;
      left: 460px;
      top: 126px;
      width: 984px;
      height: 154px;
      background: url("../../../../assets/dp/OperateMonitoreRq/totalList.png") no-repeat;
      background-size: 100% 100%;
      img:nth-child(1) {
        position: absolute;
        top: 124px;
        left: 194px;
      }
      img:nth-child(2) {
        position: absolute;
        top: 124px;
        left: 680px;
      }
      .des {
        position: absolute;
        left: 64px;
        top: 35px;
        width: 874px;
        height: 73px;
        padding: 15px;
        white-space: nowrap;
        display: flex;
        justify-content: space-between;
        div {
          display: inline-block;
          text-align: center;
          width: 71px;
          height: 59px;
        }
        .num {
          height: 27px;
          font-size: 30px;
          font-family: Bebas;
          font-weight: 400;
          color: #00a8ff;
          line-height: 29px;
          margin-bottom: 9px;
          text-shadow: 0px 1px 2px #00a8ff;
        }
        .numDes {
          height: 13px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          line-height: 17px;
        }
        .sx {
          margin-left: 23px;
          margin-right: 23px;
          width: 1.2px;
          height: 52px;
          background: -webkit-linear-gradient(bottom, rgb(12, 25, 69) -4%, #62a2cd 50%, rgb(12, 25, 69) 100%);
        }
        .aa {
          display: none;
        }
      }
    }
    .jldw {
      width: 78px;
      height: 78px;
      position: absolute;
      left: 32.5%;
      top: 45%;
      background: url("../../../../assets/dp/Gcjs/round2.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      padding-top: 20px;
      // animation: self-rotate 20s linear infinite;
      // transform-origin: 300px 300px;
      // transform: rotate(360deg);
      // transition: 7s linear;
      // animation: run 6s infinite;
      p:first-child {
        font-size: 19px;
        font-family: "方正姚体";
        font-weight: 400;
        color: #ffffff;
        width: 18px;
        height: 18px;
        line-height: 16px;
        margin: 0 auto;
        text-shadow: 0px 1px 2px white;
      }
      p:nth-child(2) {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        width: 56px;
        height: 14px;
        line-height: 16px;
        margin: 0 auto;
      }
    }
    .kx {
      width: 44px;
      height: 44px;
      position: absolute;
      left: 39.5%;
      top: 50%;
      background: url("../../../../assets/dp/Gcjs/round1.png") no-repeat;
      background-size: 100% 100%;
    }
    .jsdw {
      width: 100px;
      height: 100px;
      position: absolute;
      left: 58%;
      top: 32%;
      background: url("../../../../assets/dp/Gcjs/round4.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      padding-top: 30px;
      p:first-child {
        width: 26px;
        height: 17px;
        font-size: 19px;
        font-family: Bebas;
        font-weight: 400;
        color: #ffffff;
        line-height: 16px;
        margin: 0 auto;
        font-family: "方正姚体";
        text-shadow: 0px 1px 2px white;
      }
      p:nth-child(2) {
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        line-height: 16px;
        margin: 0 auto;
      }
    }
    .sgdw {
      width: 89px;
      height: 89px;
      position: absolute;
      left: 64%;
      top: 34%;
      background: url("../../../../assets/dp/Gcjs/round3.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      padding-top: 30px;
      p:first-child {
        width: 24px;
        height: 18px;
        font-size: 19px;
        font-family: Bebas;
        font-weight: 400;
        color: #ffffff;
        line-height: 16px;
        margin: 0 auto;
        font-family: "方正姚体";
        text-shadow: 0px 1px 2px white;
      }
      p:nth-child(2) {
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        line-height: 16px;
        margin: 0 auto;
      }
    }
  }
  .bottom {
    .bottom_left {
      width: 435px;
      height: 264px;
      background: rgba($color: #01263a, $alpha: 0.4);
      position: absolute;
      left: 500px;
      top: 790px;
      // 注意点
      > span:first-child {
        width: 76px;
        height: 24px;
        background: url("../../../../assets/dp/Gcjs/greenbgc.png");
        background-size: 100% 100%;
        position: absolute;
        left: 22px;
        top: 16px;
        line-height: 24px;
        font-weight: 500;
        text-align: center;
      }
      > span:nth-child(2) {
        width: 76px;
        height: 24px;
        background: url("../../../../assets/dp/Gcjs/bluebgc.png");
        background-size: 100% 100%;
        position: absolute;
        left: 107px;
        top: 16px;
        font-weight: 500;
        line-height: 24px;
        text-align: center;
      }
      .tb {
        width: 255px;
        height: 169px;
        background: url("../../../../assets/dp/Gcjs/tree.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 42px;
        top: 69px;
      }
      .zx {
        position: absolute;
        left: 303px;
        top: 90px;
        .zx_text {
          width: 25px;
          height: 12px;
          line-height: 27px;
          font-family: Source Han Sans CN;
        }
        .zx_num {
          font-family: "方正姚体";
          font-size: 18px;
          margin-left: 15px;
          width: 18px;
          height: 16px;
          line-height: 27px;
          text-shadow: 0px 1px 2px white;
        }
      }
      .wz {
        position: absolute;
        left: 303px;
        top: 137px;
        .zx_text {
          width: 25px;
          height: 12px;
          line-height: 27px;
          font-family: Source Han Sans CN;
        }
        .zx_num {
          font-family: "方正姚体";
          font-size: 18px;
          margin-left: 15px;
          width: 18px;
          height: 16px;
          line-height: 27px;
          text-shadow: 0px 1px 2px white;
        }
      }
      .lx {
        position: absolute;
        left: 303px;
        top: 178px;
        .zx_text {
          width: 25px;
          height: 12px;
          line-height: 27px;
          font-family: Source Han Sans CN;
        }
        .zx_num {
          font-family: "方正姚体";
          font-size: 18px;
          margin-left: 15px;
          width: 18px;
          height: 16px;
          line-height: 27px;
          text-shadow: 0px 1px 2px white;
        }
      }
    }
    .bottom_right {
      width: 435px;
      height: 264px;
      // background: pink;
      background: rgba($color: #01263a, $alpha: 0.4);
      position: absolute;
      left: 994px;
      top: 790px;
      > span:first-child {
        width: 76px;
        height: 24px;
        background: url("../../../../assets/dp/Gcjs/greenbgc.png");
        background-size: 100% 100%;
        position: absolute;
        left: 22px;
        top: 16px;
        line-height: 24px;
        font-weight: 500;
        text-align: center;
      }
      > span:nth-child(2) {
        width: 76px;
        height: 24px;
        background: url("../../../../assets/dp/Gcjs/bluebgc.png");
        background-size: 100% 100%;
        position: absolute;
        left: 107px;
        top: 16px;
        font-weight: 500;
        line-height: 24px;
        text-align: center;
      }
      .main {
        width: 100%;
        height: 120px;
        position: absolute;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        text-align: center;
        p:first-of-type {
          font-size: 15px;
          font-family: "方正姚体";
          text-shadow: 0 0.005208rem 0.010417rem white;
        }
        p:nth-of-type(3) {
          font-size: 10px;
          font-family: Source Han Sans CN;
          font-weight: 400;
        }
      }
    }
  }
  .right {
    // width: 430px;
    // height: 673px;
    // position: absolute;
    // right: 29px;
    // top: 104px;
    .yjTitle {
      position: absolute;
      background: url("../../../../assets/dp/OperateMonitoreRq/1(3).png") no-repeat;
      background-size: 100% 100%;
      border: 1px solid #022e40;
      top: 104px;
      right: 29px;
      width: 430px;
      height: 40px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      text-align: center;
      line-height: 38.13px;
    }
    .threeDPie {
      position: absolute;
      width: 430px;
      height: 264px;
      background: rgba(1, 38, 58, 0.4);
      top: 150px;
      right: 29px;
      .right_left {
        > span:first-child {
          width: 76px;
          height: 24px;
          background: url("../../../../assets/dp/Gcjs/greenbgc.png");
          background-size: 100% 100%;
          position: absolute;
          left: 73px;
          top: 14px;
          line-height: 24px;
          font-weight: 500;
          text-align: center;
        }
        > span:nth-child(2) {
          width: 76px;
          height: 24px;
          background: url("../../../../assets/dp/Gcjs/bluebgc.png");
          background-size: 100% 100%;
          position: absolute;
          left: 288px;
          top: 14px;
          font-weight: 500;
          line-height: 24px;
          text-align: center;
        }
      }
      .tb_left {
        width: 133px;
        height: 133px;
        position: absolute;
        // background: red;
        left: 45px;
        top: 77px;
      }
      .tb_right {
        width: 133px;
        height: 133px;
        position: absolute;
        // background: red;
        top: 77px;
        left: 254px;
      }
    }
    .wgsj {
      position: absolute;
      background: url("../../../../assets/dp/OperateMonitoreRq/1(3).png") no-repeat;
      background-size: 100% 100%;
      border: 1px solid #022e40;
      top: 425px;
      right: 29px;
      width: 430px;
      height: 40px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      text-align: center;
      line-height: 38.13px;
    }
    .wgsj_tb {
      position: absolute;
      width: 430px;
      height: 264px;
      background: rgba(1, 38, 58, 0.4);
      top: 475px;
      right: 29px;
      height: 580px;
      .charts {
        width: 100%;
        height: 65%;
        // background: red;
      }
      .charts1 {
        width: 100%;
        height: 35%;
        // background:#020f18;
        position: relative;
      }
    }
  }
}
</style>
