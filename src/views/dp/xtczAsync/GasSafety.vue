<template>
  <!--燃气-->
  <div class="main">
    <div class="river float">
       <div style="width:100%">
          <v-chart  :options="options" :autoresize="true" style="width:95%; height: 60%; display:inline-block;"></v-chart>
        </div>
      <div style="width:50%">
          <v-chart :options="option" :autoresize="true" style="width:100%;display:inline-block;"></v-chart>
        </div>
      </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import vueSeamlessScroll from "./myClass.vue";
import echarts from "echarts";

@Component({
  components: {
    vueSeamlessScroll,
  },
})
export default class AlarmAbnormal extends Vue {
  @Mutation setFormParams: any;
  listData: any[] = [];

  // @Emit()
  // onRow(item?: any) {
  //   this.setFormParams({
  //     jcdid: item.sbid,
  //     jcdmc: item.zdmc,
  //     jcdlx: item.sbtp,
  //     pqid: item.pqid,
  //     jd: item.jd,
  //     wd: item.wd,
  //     rwlx: item.rwlx,
  //     rwmc: item.rwlx,
  //     rwms: ` ${item.zdmc}${item.jcx}于${item.kssj}持续${item.cxsc}小时不更新，请及时处理`,
  //   });
  // }
    // 饼状图渲染
 get option() {
  return{
    tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    left: 'center',
    top: '40%',
    textStyle:{
      color:'#fff'
    }
  },
  series: [
    {
      type: 'pie',
      center: ['55%', '20%'],
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
        { value: 45, name: '一级报警 45%' },
        { value: 30, name: '二级报警 30%' },
        { value: 25, name: '三级报警 25%' },
      ]
    },
  ]
 
    };
  }
  
  // 柱状图渲染 
  get options() {
    return {
      // color: ["#5397ff", "#36b56e", "#ffab3d", "#c088ff"],
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "5%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      legend: {
        textStyle:{
          color:'#fff'
        }
      },
      xAxis: {
        type: "category",
        data:['立案','派单','处置','核查','结案'],
        axisTick: {
          lineStyle: {
            color: "#acb1b7",
          },
        },
        axisLabel: {
          color: "#fff",
          interval:0,
          // rotate:45
        },
      },
      yAxis: {
        type: "value",
        nameTextStyle: {
          color: "#333",
        },  
        splitLine: {
          color: "#999",
        },
        axisLabel: {
          color: "#999",
        },
      },
      
      series:[
        {
          name:'工单数',
          barWidth: '30%',
          type:'bar',
          data: [
          // this.slData.reached,
          10,21,33,14,25
         ],
         color:new echarts.graphic.LinearGradient(0,1,0,0,[
          {
            offset:0,
            color:'#F0E203'
          },
          {
            offset:1,
            color:'#FF9600'
          }
         ])
        
        },

      ],
    };
  }
  
  mounted() {
    // this.getList();
  }
}
</script>
<style lang="scss" scoped>
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
