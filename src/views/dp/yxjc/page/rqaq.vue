<template>
  <div class="rqaqContain">
    <div class="left">
      <div class="yjTitle">预警统计 (用户全时段统计)</div>
      <div class="threeDPie">
        <pie :optionsData='pieData'></pie>
        <div class="yp"></div>
        <div class="zs">报警总数：<span>{{bjTotal}}</span></div>
      </div>
      <div class="zhTitle">指挥协同</div>
      <div class="zhxt">
        <div>
          <p class="fx"></p>
          <span class="num">{{xtzhList.fxwt}}</span>
          <span>发现问题</span>
        </div>
        <div>
          <p class="la"></p>
          <span class="num">{{xtzhList.la}}</span>
          <span>立案</span>
        </div>
        <div>
          <p class="pd"></p>
          <span class="num">{{xtzhList.pd}}</span>
          <span>派单</span>
        </div>
        <div>
          <p class="cz"></p>
          <span class="num">{{xtzhList.cz}}</span>
          <span>处置</span>
        </div>
        <div>
          <p class="hc"></p>
          <span class="num">{{xtzhList.hc}}</span>
          <span>核查</span>
        </div>
        <div>
          <p class="ja"></p>
          <span class="num">{{xtzhList.ja}}</span>
          <span>结案</span>
        </div>
      </div>
      <div class="xtTable">
        <lb-table></lb-table>
      </div>
    </div>
    <div class="middle">
      <div class="totalList">
        <img src="../../../../assets/dp/OperateMonitoreRq/jt1.png" alt="" />
        <img src="../../../../assets/dp/OperateMonitoreRq/jt2.png" alt="" />
        <!-- <img src="../../../../assets/dp/OperateMonitoreRq/jzt.png" alt=""> -->
        <div class="des">
          <template v-for="list in totalList">
            <div :key="list">
              <p class="num">{{ list.value }}</p>
              <p class="numDes">{{ list.name }}</p>
            </div>
            <div :key="list" class="sx"></div>
          </template>
        </div>
      </div>
      <div class="yh">
        <p>{{yhList.total}}</p>
        <p>当前总用户</p>
      </div>
      <div class="lb sy">
        <p>{{yhList.yhq}}</p>
        <p>液化石油气<br />用户总数</p>
      </div>
      <div class="lb jmyh">
        <p>{{yhList.resident}}</p>
        <p>居民用户<br />总数</p>
      </div>
      <div class="lb trq">
        <p>{{yhList.yhtrq}}</p>
        <p>液化天然气<br />用户总数</p>
      </div>
      <div class="lb cy">
        <p>{{yhList.restaurant}}</p>
        <p>餐饮用户<br />总数</p>
      </div>
      <div class="lb qt">
        <p>{{yhList.qita}}</p>
        <p>其他</p>
      </div>
    </div>
    <div class="right">
      <div class="jcTitle">监管巡查</div>
      <div>
        <img src="../../../../assets/dp/OperateMonitoreRq/jzt.png" alt="" />
        <span class="gsTitle">工商安检</span>
        <div class="gsaj">
          <p>
            <span>{{gsajList.planNum}}</span>
            <span>处理率</span>
          </p>
          <p>
            <span>{{gsajList.ajNum}}</span>
            <span>安检率</span>
          </p>
          <p>
            <span>{{gsajList.problemNum}}</span>
            <span>问题率</span>
          </p>
        </div>
        <span class="wgTitle">网格安检</span>
        <div class="gsaj" style="margin-top: -10px">
          <p>
            <span>--</span>
            <span>处理率</span>
          </p>
          <p>
            <span>--</span>
            <span>安检率</span>
          </p>
          <p>
            <span>--</span>
            <span>问题率</span>
          </p>
        </div>
        <img
          style="margin-top: -80px"
          src="../../../../assets/dp/OperateMonitoreRq/jzt.png"
          alt=""
        />
      </div>
      <div class="czTitle">实时监测（场站）</div>
      <div class="jcType">
        <p
          v-for="(item, index) in jcList"
          :key="index"
          :class="typeFlag == index ? 'active' : ''"
          @click="typeClick(index)"
        >
          {{ item.name }}
        </p>
      </div>
      <div class="time">
        时间：
        <el-date-picker
          class="startTime"
          v-model="time.startTime"
          placeholder=""
          prefix-icon="none"
          size="mini"
          type="date"
          format="yyyy-MM-dd"
          value-format="timestamp"
        >
        </el-date-picker>
        <span style="padding: 0 5px; font-size: 12px">至</span>
        <el-date-picker
          class="startTime"
          v-model="time.endTime"
          placeholder=""
          prefix-icon="none"
          size="mini"
          type="date"
          format="yyyy-MM-dd"
          value-format="timestamp"
        >
        </el-date-picker>
      </div>
      <div class="barThreeD">
        <bar :xData="ssjcTitle" :yData="ssjcValue" :max="ssjcMax"></bar>
        <img src="../../../../assets/dp/OperateMonitoreRq/dz.png" alt="" />
        <div class="dsc" v-if="typeFlag != 0">
          <div></div>
          <span>报警数</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>
        <div class="title">报警原因Top</div>
        <div class="charts">
          <hbar :yLabel="bjyyList" :yData="bjyyData" cId="1"></hbar>
        </div>
      </div>
      <div>
        <div class="title">离线原因Top</div>
        <div class="charts">
          <hbar :yLabel="lxyyList" :yData="lxyyData" cId="2"></hbar>
        </div>
      </div>
      <div class="bj">
        <div class="title">报警情况Top</div>
        <div class="ybp">
          <ybp :percent="percent" outBg="rgba(32, 46, 92,1)" :jbBg='jbBg1' cId="ybp1"></ybp>
          <div class="des">
            <p><span>{{bjqk.warnnum}}</span> <br> <span>全时段报警总次数</span> </p>
            <div class="sx"></div>
            <p><span>{{bjqk.finishnum}}</span> <br> <span>已处理总次数</span> </p>
          </div>
        </div>
         <div class="ybp">
          <ybp :percent="percent1" outBg="rgba(112, 104, 40, 0.5)" :jbBg='jbBg2' cId="ybp2"></ybp>
          <div class="des" style="margin-left:10px">
            <p><span>{{bjqk1.warnnum}}</span> <br> <span>今日报警总次数</span> </p>
            <div class="sx"></div>
            <p><span>{{bjqk1.finishnum}}</span> <br> <span>已处理总次数</span> </p>
          </div>
        </div>
      </div>
      <div>
        <div class="title">报警消除处理Top</div>
        <div class="charts">
          <hbar :yLabel="bjxcList" :yData="bjxcData" cId="3"></hbar>
        </div>
      </div>
      <div>
        <div class="title">离线消除原因Top</div>
        <div class="charts">
          <hbar :yLabel="lxxcList" :yData="lxxcData" cId="4"></hbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import pie from "../components/3dPieEcharts.vue";
import bar from "../components/3dBarEcharts.vue";
import lbTable from "../components/lbTable.vue";
import hbar from "../components/hBarEcharts.vue";
import ybp from "../components/ybpEcharts.vue";
import { publicApi } from "@/api";
import { max, sum } from "lodash";
const txIcon = require("@/assets/dp/OperateMonitoreRq/hBarBg.png");

@Component({
  components: {
    pie,
    bar,
    lbTable,
    hbar,
    ybp
  },
})
export default class OperateMonitore extends Vue {
  flag: any = 0;
  typeFlag: any = 0; //监测类型标识
  time: any = {
    startTime: new Date(new Date(new Date().getTime() - 6 * 1000 * 3600 * 24)),
    endTime: new Date(),
  };
  percent:any = 93;
  percent1:any = 93;
  bjqk:any = {};
  bjqk1:any = {};
  jbBg1: any =['rgba(71, 123, 242,0)','rgba(71, 123, 242,1)'];
  jbBg2: any =['rgba(250, 207, 44, 0)','rgba(250, 207, 44, 1)'];
  pieData:any = []
  bjTotal:any = ''
  xtzhList:any = {}
  gsajList:any = {}
  ssjcTitle:any = []
  ssjcValue:any = []
  ssjcMax:any = []
  jcList: any = [
    { name: "报警器监测" },
    // { name: "人脸监测" },
    { name: "车辆监测" },
    // { name: "气瓶监测" },
  ];
  yhList:any = {};
  totalList: any = [];
  bjyyList: any = [
  ];
  bjxcList: any = [
  ];
  lxyyList: any = [
  ];
  lxxcList: any = [
  ];
  bjyyData: any = [
  ];
  lxyyData: any = [
  ];
  bjxcData: any = [
  ];
  lxxcData: any = [
  ];

  typeClick(flag: any) {
    this.typeFlag = flag;
    if (flag == 0) {
      this.getBjqData()
    }
    else{

    }
  }

  mounted(){
    this.getYjtj()
    this.getXtzh()
    this.getQyData()
    this.getYhData()
    this.getGsajData()
    this.getTopData(1)
    this.getTopData(2)
    this.getTopData(3)
    this.getTopData(4)
    this.getBjTopData(1)
    this.getBjTopData(2)
    this.getBjqData()
  }

  //获取预计统计数据
  async getYjtj(){
    let url = 'wjServer/xwzl/yxjc/warnOverview'
    const data = await publicApi.getNoParam(url);
    this.pieData = [{
            name: '一级',
            value: parseInt(data.data.warn1),
             itemStyle: {
                color: 'RGBA(250, 207, 45, 1)',
            },
        },
        {
            name: '二级',
            value:  parseInt(data.data.warn2),
            itemStyle: {
                color: 'RGBA(247, 152, 28, 1)',
                // opacity: 1,
            },
        },
        {
            name: '三级',
            value: parseInt(data.data.warn3),
            itemStyle: {
                color: 'RGBA(202, 33, 53, 1)',
                // opacity: 1,
            },
    },] 
    this.bjTotal = sum(this.pieData.map((value:any)=>{
      return value.value
    }))
  }

  //获取指挥协同数据
  async getXtzh(){
    let url = 'wjServer/xwzl/yxjc/xtzhXw'
    const data = await publicApi.getNoParam(url);
    this.xtzhList= data.data
  }


   //获取顶部栏数据
   async getQyData(){
    let url = 'wjServer/xwzl/yxjc/companyOverview'
    const data = await publicApi.getNoParam(url);
    this.totalList = [
    { name: "企业", value: data.data.qyNum },
    { name: "配送车辆", value: data.data.carNum },
    // { name: "配站数 LPG / LNG", value: "0/0" },
    { name: "送气工人数 / 持证人数", value: data.data.sqgTotal+'/'+data.data.sqgCz },
    { name: "供应站数 LPG / LNG", value: data.data.gyzLpg+'/'+data.data.gyzLng },
    { name: "绑定锡气安数", value: data.data.xqamNum },
    { name: "今日配送数", value: data.data.todayPs },
  ];
  }

  //获取用户数量
   async getYhData(){
    let url = 'wjServer/xwzl/yxjc/userOverview'
    const data = await publicApi.getNoParam(url);
    this.yhList = data.data
  }

  //获取工商安检
   async getGsajData(){
    let url = 'wjServer/xwzl/yxjc/gsaj'
    const data = await publicApi.getNoParam(url);
    this.gsajList = data.data
  }

  //获取top数据
  async getTopData(type:any){
    let url = "wjServer/xwzl/yxjc/topTen"
    let data = await publicApi.getWithParam(url, {type:type})
    for (let i = 0; i < data.data.length; i++) {
      switch (type) {
      case 1:
      this.bjyyList.push(data.data[i].name)
      this.bjyyData.push({value: data.data[i].percent,symbol: "image://" + txIcon})
      break;
      case 2:
      this.lxyyList.push(data.data[i].name)
      this.lxyyData.push({value: data.data[i].percent,symbol: "image://" + txIcon})
      break;
      case 3:
      this.bjxcList.push(data.data[i].name)
      this.bjxcData.push({value: data.data[i].percent,symbol: "image://" + txIcon})
      break;
      case 4:
      this.lxxcList.push(data.data[i].name)
      this.lxxcData.push({value: data.data[i].percent,symbol: "image://" + txIcon})
      break;
    }
    }
    
  }

  //获取报警情况top数据
  async getBjTopData(type:any){
    let url = "wjServer/xwzl/yxjc/warnAndHandle"
    let data = await publicApi.getWithParam(url, {type:type})
      switch (type) {
      case 1:
      this.bjqk = data.data
      this.percent = (parseInt(data.data.finishnum) / parseInt(data.data.warnnum)*100).toFixed(0)
      break;
      case 2:
      this.bjqk1 = data.data
      this.percent1 = (parseInt(data.data.finishnum) / parseInt(data.data.warnnum)*100).toFixed(0)
      break;
    }
  }

  //获取报警器数据
  async getBjqData(){
    let url = "wjServer/xwzl/yxjc/bjqStatus"
    let data = await publicApi.getNoParam(url)
    this.ssjcTitle = data.data.warnType
    this.ssjcValue = data.data.warnNum
    var m:any = max(data.data.warnNum)
    for (let i = 0; i < data.data.warnNum.length; i++) {
      this.ssjcMax.push(parseInt(m)+5)   
    }
  }

}
</script>
<style>
.el-picker-panel {
  background: rgba(0, 0, 0, 0.7) !important;
  color: aliceblue;
}
.el-date-picker__header-label {
  color: aliceblue;
}
</style>
<style lang="scss" scoped>
$deep: "::v-deep";
::v-deep.el-input--mini .el-input__inner {
  background: rgba(0, 0, 0, 0) !important;
  border: 1px solid rgba(52, 106, 232, 0.5);
  border-radius: 2px;
  color: #ffffff;
  padding-left: 15px;
  padding-right: 0px;
}

.rqaqContain {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: #fff;
  background: url("../../../../assets/dp/OperateMonitoreRq/bg.jpg") no-repeat;
  background-size: 100%  calc(100% - 84px);
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
    .zhTitle {
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
    .threeDPie {
      position: absolute;
      top: 125px;
      left: 31px;
      width: 430px;
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
      .zs {
        top: 375px;
        text-align: center;
        width: 100%;
        height: 23px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        line-height: 23px;
        span {
          font-size: 24px;
        }
      }
    }
    .zhxt {
      position: absolute;
      left: 31px;
      top: 472px;
      width: 430px;
      height: 307px;
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
      div:nth-child(3n + 1) {
        margin-left: 25px;
      }
    }
    .xtTable {
      width: 420px;
      height: 150px;
      position: absolute;
      top: 604px;
      left: 31px;
      margin-left: 10px;
    }
  }
  .bottom {
    position: absolute;
    top: 783px;
    left: 31px;
    right: 29px;
    width: 100%;
    height: 264px;
    display: flex;
    div{
      width: 320px;
      margin-right: 40px;
    }
    .bj {
      width: 450px;
      .ybp{
        margin-right: 10px;
        display: inline-block;
        width: 200px!important;
        height: 160px;
        //重写div防止与上面div影响
        div{
          width: 100%;
        }
        .des{
          margin-top: -20px;
          .sx {
            display: inline-block;
            margin-left: 5px;
            margin-right: 10px;
            width: 1.2px;
            height: 32px;
            background: -webkit-linear-gradient(
              bottom,
              rgb(12, 25, 69) -4%,
              #62849b 50%,
              rgb(12, 25, 69) 100%
            );
          }
          p{
            text-align: center;
            display: inline-block;
            margin-right: 5px;
            span:first-child{
              height: 17px;
              font-size: 18px;
              font-family: Bebas;
              font-weight: 400;
              color: #FFFFFF;
            }
            span:last-child{
              height: 12px;
              font-size: 12px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #00A8FF;
            }
          }
          
        }
      }
    }
    
    .title {
      width: 100%;
      height: 58px;
      line-height: 60px;
      background: url("../../../../assets/dp/OperateMonitoreRq/bTitle.png") no-repeat;
      background-size: 110% 100%;
      // padding-left: 30%;
      text-align: center;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
    }
    .charts {
      width: 100%;
      height: 220px;
    }
  }
  .top {
    position: absolute;
    top: 89px;
    left: 490px;
    // width: 690px;
    height: 39px;
    div:first-child {
      margin-left: 0px;
    }
    .menu {
      width: 125px;
      height: 39px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      margin-left: -29px;
      background: url("../../../../assets/dp/OperateMonitoreRq/zmenu1.png") no-repeat;
      background-size: 100% 100%;
      line-height: 39px;
    }
    .active {
      background: url("../../../../assets/dp/OperateMonitoreRq/zmenu2.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .middle {
    .totalList {
      position: absolute;
      left: 460px;
      top: 126px;
      width: 984px;
      height: 154px;
      background: url("../../../../assets/dp/OperateMonitoreRq/totalList.png")
        no-repeat;
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
        div {
          display: inline-block;
          text-align: center;
        }
        div:last-child {
          display: none;
        }
        .num {
          height: 27px;
          font-size: 30px;
          font-family: Bebas;
          font-weight: 400;
          color: #00a8ff;
          line-height: 29px;
          margin-bottom: 9px;
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
          margin-right: 28px;
          width: 1.2px;
          height: 52px;
          background: -webkit-linear-gradient(
            bottom,
            rgb(12, 25, 69) -4%,
            #62a2cd 50%,
            rgb(12, 25, 69) 100%
          );
        }
      }
    }
    .yh {
      width: 182px;
      height: 190px;
      position: absolute;
      left: 1020px;
      top: 260px;
      background: url("../../../../assets/dp/OperateMonitoreRq/yh.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      vertical-align: middle;
      p:nth-child(1) {
        position: absolute;
        top: 67px;
        left: 47px;
        // width: 69px;
        height: 22px;
        font-size: 24px;
        font-family: Bebas;
        font-weight: 400;
        color: #00f6ff;
        line-height: 29px;
      }
      p:nth-child(2) {
        // width: 66px;
        position: absolute;
        top: 95px;
        left: 55px;
        height: 14px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        line-height: 17px;
      }
    }
    .lb {
      background: url("../../../../assets/dp/OperateMonitoreRq/1(1).png") no-repeat;
      background-size: 100% 100%;
      width: 149px;
      height: 137px;
      text-align: center;
      position: absolute;
      padding-top: 10px;
      p:nth-child(1) {
        // width: 92px;
        height: 28px;
        font-size: 29px;
        font-family: Bebas;
        font-weight: 400;
        color: #00f6ff;
        line-height: 36px;
      }
      p:nth-child(2) {
        // width: 85px;
        margin-top: 10px;
        height: 38px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        line-height: 21px;
      }
    }
    .sy {
      width: 180px;
      height: 166px;
      left: 870px;
      bottom: 31.57%;
    }
    .jmyh {
      left: 559px;
      bottom: 38.51%;
    }
    .trq {
      left: 1151px;
      bottom: 38.51%;
    }
    .cy {
      width: 121px;
      height: 110px;
      left: 527px;
      bottom: 53.7%;
      font-size: 11px;
      p:nth-child(1) {
        // width: 6px;
        height: 17px;
        font-size: 19px;
        font-family: Bebas;
        font-weight: 400;
        color: #00f6ff;
        line-height: 23px;
      }
      p:nth-child(2) {
        height: 24px;
        font-size: 11px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
      }
    }
    .qt {
      width: 121px;
      height: 110px;
      left: 1200px;
      bottom: 53.7%;
      p:nth-child(1) {
        // width: 6px;
        height: 17px;
        font-size: 19px;
        font-family: Bebas;
        font-weight: 400;
        color: #00f6ff;
        line-height: 23px;
      }
      p:nth-child(2) {
        height: 24px;
        font-size: 11px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
      }
    }
  }
  .right {
    width: 430px;
    height: 673px;
    position: absolute;
    right: 29px;
    top: 104px;
    .jcTitle {
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
    .czTitle {
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
    .jcType {
      width: 100%;
      height: 30px;
      padding: 18px 40px 0px 50px;
      margin-bottom: 26px;
      text-align: center;
      p {
        width: 76px;
        height: 24px;
        background: url("../../../../assets/dp/OperateMonitoreRq/jcType1.png")
          no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        margin-right: 9px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 400;
      }
      .active {
        background: url("../../../../assets/dp/OperateMonitoreRq/jcType2.png")
          no-repeat;
        background-size: 100% 100%;
      }
    }
    .time {
      z-index: 9;
      width: 100%;
      margin: 20px 50px 0px 50px;
      .startTime {
        width: 24%;
      }
    }
    .barThreeD {
      width: 100%;
      height: 200px;
      .dsc {
        position: absolute;
        right: 33px;
        top: 428px;
        div {
          width: 9px;
          height: 9px;
          background: #80e6ff;
          border-radius: 1px;
          display: inline-block;
          margin-right: 5px;
        }
        span {
          width: 36px;
          height: 12px;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          line-height: 23px;
        }
      }
    }

    .gsaj {
      width: 267px;
      height: 84px;
      display: inline-block;
      vertical-align: top;
      margin-top: 20px;
      background: url("../../../../assets/dp/OperateMonitoreRq/gsaj.png") no-repeat;
      background-size: 100% 100%;
      p {
        text-align: center;
        padding: 22px 16px 16px 20px;
        display: inline-block;
        span:nth-child(1) {
          display: block;
          height: 20px;
          font-size: 16px;
          font-family: Bebas;
          font-weight: 400;
          color: #ffffff;
        }
        span:nth-child(2) {
          width: 36px;
          height: 12px;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #6dd1ff;
        }
      }
    }
    .gsTitle {
      height: 16px;
      font-size: 17px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
      position: absolute;
      right: 80px;
      top: 47px;
    }
    .wgTitle {
      height: 16px;
      font-size: 17px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
      position: absolute;
      right: 221px;
      top: 200px;
    }
  }
}
</style>
