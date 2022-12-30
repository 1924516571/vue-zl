<template>
  <!--燃气-->
  <div class="main">
    <div class="biaostyle" @click="add">
      <span class="biao"></span>
      <span class="biao"></span>
      <span class="biao"></span>
    </div>
    <div class="river float">
      <div class="bg">
        <span class="gongyong">设备总数（个）
          <div class="tugongyong bg1">
            <span class="fontsize" >210</span>
          </div>
        </span>
        <span class="gongyong" >离线次数（次）
          <div class="tugongyong bg2">
            <span class="fontsize" >10</span>
          </div>
        </span>
        <span class="gongyong">安检比例
          <div class="tugongyong bg3">
            <span class="fontsize" >160</span>
          </div>
        </span>
        <span class="gongyong">预警次数（次）
          <div class="tugongyong bg4">
            <span class="fontsize" >21</span>
          </div>
        </span>
        <span class="gongyong">工单（件）
          <div class="tugongyong bg5">
            <span class="fontsize" >321</span>
          </div>
        </span>
        <span class="gongyong">锡气安码（户）
          <div class="tugongyong bg6">
            <span class="fontsize" >0</span>
          </div>
        </span>
      </div>
      
      <div style="width:50%">
        <v-chart :options="option" :autoresize="true" style="width:95%;"></v-chart>
      </div>
      </div>
      <rqaq-modal :title="modalTitle" :model="model" :loading="loading" :formParam="formParam" @on-submit="oncreate" @toggle="toggle" :chuan="chuan"></rqaq-modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import vueSeamlessScroll from "./myClass.vue";
import {rqaqModal} from "../modal";

@Component({
  components: {
    vueSeamlessScroll,
    rqaqModal,
  },
})
export default class AlarmAbnormal extends Vue {
  @Mutation setFormParams: any;
  model: boolean = false;
  loading: boolean = false;
  modalTitle: any = '';
  formParam: any = {
  };
  chuan: any = [];
  listData: any[] = [];

  @Emit()
  onRow(item?: any) {
    
  }
  async oncreate() {
      this.setCreate();
      this.model = false;
  }
  //  新增通讯录
  async setCreate() {
   
  }
  toggle(val: boolean) {
    this.model = val;
  }
    // 饼状图渲染
 get option() {
  return{
    tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    right: 'right',
    top: '30%',
    textStyle:{
      color:'#fff'
    }
  },
  series: [
    {
      type: 'pie',
      center: ['30%', '40%'],
      radius: ["0", "55%"],
      roseType: 'radius',
      color:['#356BFF',"#FFA335",'#E35071'],
      itemStyle: {
        borderRadius: 5
      },
      label: {
        show: false,
        position: 'center',
        // formatter:  "{b}"+"类 "+"{c}"+"个" 
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 40, name: '一级报警' },
        { value: 33, name: '二级报警' },
        { value: 28, name: '三级报警' },
      ]
    },
  ]
    };
  }
  
  mounted() {
    // this.getList();
  }
  add(){
    this.model = true;
    this.modalTitle = "燃 气 安 全";
    this.formParam = {
        
      };
  }
}
</script>
<style lang="scss" scoped>
.fontsize{
  margin-left:-10px;
  font-size: 18px;
  font-weight: bold;
}
.biaostyle{
  margin-top:-36px ;
  margin-right: 5px;
  float: right;
  cursor: pointer;
}
.biao{
  display: inline-block;
  margin-left: 4px;
  width: 3px;
  height: 3px;
  border-radius:100% ;
  background: linear-gradient(0deg, #1BC0FD, #FFFFFF);
}
.gongyong{
  text-align: center;
  padding-top: 10%;
}
.bg{
  width: 50%;
  height: 100%;
  display: flex;
  flex-wrap:wrap
}
.tugongyong{
  width: 140px;
  height: 60px;
  margin-top: 15px;
  background-size: 100% 100%;
}
.bg1{
  color:#87E6FD;
  background: url("../../../assets/dp/Yxpj/1(6).png") no-repeat;
}
.bg2{
  color: #FDBE76;
  background: url("../../../assets/dp/Yxpj/1(3).png") no-repeat;
}
.bg3{
  color: #93E836;
  background: url("../../../assets/dp/Yxpj/1(5).png") no-repeat;
}
.bg4{
  color: #F08C8C;
  background: url("../../../assets/dp/Yxpj/1(2).png") no-repeat;
}
.bg5{
  color: #DCA4FF;
  background: url("../../../assets/dp/Yxpj/1(1).png") no-repeat;
}
.bg6{
  color: #1E74F4;
  background: url("../../../assets/dp/Yxpj/1(4).png") no-repeat;
}
.float{
  display: flex;
}
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
    height: 95%;
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
