<template>
    <!-- 燃气安全弹框-->
    <el-dialog :title="title" :visible.sync="model" close-on-click-modal:false :before-close="onCancel" v-if="model">
      <div class="flex">
          <div class="border">
          <div class="fontcolor">预警概况分析</div>
          <span>
            2022年11月，新吴区燃气报警器共1000个，离线次数100次。本月共产生预警1000次，形成工单800件，人工创建工单0件，共处置750件，处理率达90%。同比上月，预警数降低10%。其中一级预警占比10%，二级预警占比10%，三级预警10%。
          </span>
          <div class="bg">
            <div class="tp"></div>
          </div>
        </div>
        <div class="border">
          <div class="fontcolor">锡气安码绑定</div>
          <span>
            2022年11月，燃气锡气安码共绑定10000户，比上个月增加了100户，同比上月增加增加10
          </span>
          <div style="width:100%;height: 80%; ">
          <v-chart  :options="options" :autoresize="true" style="width:90%; height:100%; display:inline-block;"></v-chart>
        </div>
        </div>
        
       
        <div class="border">
          <div class="fontcolor">协同安检分析</div>
          <span>
            2022年11月，企业安检共7026户，已安检5943户，未安检数1083户，安检比例54.59%。安检项共8905件，问题627个，无问题数8178个，比例92.88%，已整改总数625个，未整改2个，整改比例99.68%。
          </span>
          <div  class=" float">
            <div style="width:30%; height: 100%;">
              <v-chart :options="optiona" :autoresize="true" style="width:100%;height: 100%; display:inline-block;"></v-chart>
            </div>
            <div style="width:30%">
              <v-chart  :options="optionb" :autoresize="true" style="width:100%;height:100%; display:inline-block;"></v-chart>
            </div>
            <div style="width:30%">

              <v-chart  :options="optionc" :autoresize="true" style="width:100%;height: 100%;  display:inline-block;"></v-chart> 
            </div>
        </div>
        </div>
        <div class="border">
          <div class="fontcolor">任务考核</div>
          <span>
            2022年11月，在抽样考核中，共考核100个安检计划，达标率为90%。
          </span>
          <div style="width:100%;height:80%">
             <v-chart  :options="option" :autoresize="true" style="width:100%;height: 100%;  display:inline-block;"></v-chart> 
          </div>
        </div>
     </div>
    </el-dialog>
  </template>
  <script lang="ts">
  import { Vue, Component, Prop, Emit,} from "vue-property-decorator";
  import { namespace } from "vuex-class";
  import { SucModal, SucForm, SucFormItem, SucInput, SucSelect } from "@suc/ui";
  import { LoadingCom } from "@/components";
  import echarts from "echarts";
  import { publicApi } from "@/api";
  const mapStore = namespace("mapStore");
  @Component({
    components: {
      SucModal,
      SucForm,
      SucFormItem,
      SucInput,
      SucSelect,
      LoadingCom,
    },
  })
  export default class CreatePolluters1 extends Vue {
    // @mapStore.State olMap: any
    // 接收父组件传过来的值
    @Prop() chuan!: any;
    olMap = this.$getMapConfig();
  
    @Prop() title: string|undefined; //  父组件传子组件的值
    @Prop() loading!: boolean; //控制加载
    @Prop() model!: boolean; //控制弹框显隐
    @Prop({ type: Object, default: () => {} })
    // formParams!: any; //新增接口需要的参数
    @Prop()
    formParam!: any;
    data:any=[220, 182, 191, 234, 290, 330, 310]
    sideData:any= this.data;
    value:any=90;
    getvalue:any=this.value/100*270
    // sideData:any= []
    @Emit()
    async onSubmit() {}
    @Emit()
    toggle(val: boolean) {
      return val;
    }
    get options() {
    return {
    backgroundColor: "#041730",
    // tooltip: {
    // trigger: 'axis',
    // formatter: "{b} : {c}",
    // axisPointer: { // 坐标轴指示器，坐标轴触发有效
    // type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    // }
    // },
    xAxis: {
    data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    //坐标轴
    axisLine: {
    lineStyle: {
    color: '#3eb2e8'
    }
    },
    //坐标值标注
    axisLabel: {
    show: true,
    textStyle: {
    // color: 'red',
    }
    }
    },
    yAxis: {
    //坐标轴
    axisLine: {
    show: false
    },
    //坐标值标注
    axisLabel: {
    show: true,
    textStyle: {
      color: '#3eb2e8'
    }
    },
    //分格线
    splitLine: {
    lineStyle: {
    color: '#4784e8'
    }
    },
    },
    series: [
    {
    name: 'a',
    tooltip: {
    show: false
    },
    type: 'bar',
    barWidth: 16,
    itemStyle: {
    normal: {
    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
    offset: 0,
    color: "#0B4EC3" // 0% 处的颜色
    }, {
    offset: 0.6,
    color: "#138CEB" // 60% 处的颜色
    }, {
    offset: 1,
    color: "#17AAFE" // 100% 处的颜色
    }], false),
    opacity: .8
    }
    },
    data: this.data,
    barGap: 0
    }, {
    type: 'bar',
    barWidth: 16,
    itemStyle: {
    normal: {
    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
    offset: 0,
    color: "#0B4EC3" // 0% 处的颜色
    }, {
    offset: 0.6,
    color: "#138CEB" // 60% 处的颜色
    }, {
    offset: 1,
    color: "#17AAFE" // 100% 处的颜色
    }], false),
    opacity: .8
    }

    },
    barGap: 0,
    data: this.sideData
    }, {
    name: 'b',
    tooltip: {
    show: false
    },
    type: 'pictorialBar',
    itemStyle: {
    borderWidth: 1,
    borderColor: '#17AAFE',
    color: '#17AAFE',
    // opacity: .6
    },
    symbol: 'path://M 0,0 l 90,30 l -60,60 l -90,0 z',
    symbolSize: ['30', '10'],
    symbolOffset: ['0', '-8'],
    symbolRotate: -8,
    symbolPosition: 'end',
    data: this.data,
    z: 4 ,
    // label: {
    // show: true,
    // position: 'top',
    // fontFamily: 'Impact',
    // color: '#2df1ff',
    // opacity: .6
    // },

    }]
    }
}
get optiona() {
  return{
    title:[{
       text:'200',
    left:'center',
    top:'center',
    textStyle:{
      fontSize:24,
      color:'#fff',
      fontWeight:'600',
    },
    },{
      text:'',
      left:'center',
      bottom:'5%',
      textStyle:{color:'#fff'}
    }],
    polar:{
      radius:['60%','80%'],
      center:['50%','50%'],
    },
    angleAxis:{
      max:100,
    show:true,
    axisLabel:{
      show:false
    },
    axisTick:{
      show:false
    },
    splitLine:{
      show:false
    }
    },
    radiusAxis:{
      type:'category',
      show:true,
      axisLabel:{
        show:true,
      },
      axisLine:{
        show:true,
      },
      splitLine:{
        show:true,
    }
    },
    series:[{
      name:'',
      type:'bar',
      roundCap:true,
      barWidth:90,
      showBackground:true,
      backgroundStyle:{
        color:'rgba(66,66,66,.3)'
      },
      data:[60],
      coordinateSystem:'polar',
      itemStyle:{
        normal: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      offset: 0,
      color: "#79DF71" // 0% 处的颜色
      }, {
      offset: 0.6,
      color: "#4EBAA3" // 60% 处的颜色
      }, {
      offset: 1,
      color: "#2194D9" // 100% 处的颜色
      },
    ]),
      opacity: 1
      }
      }
    },
    {
      name:"",
      type:'pie',
      startAngle:90,
      radius:['85%'],
      hoverAnimation:false,
      animation:false,
      center:['50%','50%'],
      itemStyle:{
        color:'rgba(66,66,66,.1)',
        borderWidth:1,
        borderColor:'#5269ee',
      },
      data:[100]
    },
    {
      name:"",
      type:'pie',
      startAngle:80,
      radius:['55%'],
      hoverAnimation:false,
      animation:false,
      center:['50%','50%'],
      itemStyle:{
        color:'rgba(66,66,66,.1)',
        borderWidth:1,
        borderColor:'#5269ee',
      },
      data:[100]
    },
  ]
  }}
  get optionb() {
  return{
    title:[{
       text:'200',
    left:'center',
    top:'center',
    textStyle:{
      fontSize:24,
      color:'#fff',
      fontWeight:'600',
    },
    },{
      text:'',
      left:'center',
      bottom:'5%',
      textStyle:{color:'#fff'}
    }],
    polar:{
      radius:['60%','80%'],
      center:['50%','50%'],
    },
    angleAxis:{
      max:100,
    show:true,
    axisLabel:{
      show:false
    },
    axisTick:{
      show:false
    },
    splitLine:{
      show:false
    }
    },
    radiusAxis:{
      type:'category',
      show:true,
      axisLabel:{
        show:true,
      },
      axisLine:{
        show:true,
      },
      splitLine:{
        show:true,
    }
    },
    series:[{
      name:'',
      type:'bar',
      roundCap:true,
      barWidth:90,
      showBackground:true,
      backgroundStyle:{
        color:'rgba(66,66,66,.3)'
      },
      data:[60],
      coordinateSystem:'polar',
      itemStyle:{
        normal: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      offset: 0,
      color: "#F8D749" // 0% 处的颜色
      }, {
      offset: 0.6,
      color: "#E7A430" // 60% 处的颜色
      }, {
      offset: 1,
      color: "#E3982A" // 100% 处的颜色
      },
    ]),
      opacity: 1
      }
      }
    },
    {
      name:"",
      type:'pie',
      startAngle:90,
      radius:['85%'],
      hoverAnimation:false,
      animation:false,
      center:['50%','50%'],
      itemStyle:{
        color:'rgba(66,66,66,.1)',
        borderWidth:1,
        borderColor:'#5269ee',
      },
      data:[100]
    },
    {
      name:"",
      type:'pie',
      startAngle:80,
      radius:['55%'],
      hoverAnimation:false,
      animation:false,
      center:['50%','50%'],
      itemStyle:{
        color:'rgba(66,66,66,.1)',
        borderWidth:1,
        borderColor:'#5269ee',
      },
      data:[100]
    },
  ]
  }}
  get optionc() {
  return{
    title:[{
       text:'200',
    left:'center',
    top:'center',
    textStyle:{
      fontSize:24,
      color:'#fff',
      fontWeight:'600',
    },
    },{
      text:'',
      left:'center',
      bottom:'5%',
      textStyle:{color:'#fff'}
    }],
    polar:{
      radius:['60%','80%'],
      center:['50%','50%'],
    },
    angleAxis:{
      max:100,
    show:true,
    axisLabel:{
      show:false
    },
    axisTick:{
      show:false
    },
    splitLine:{
      show:false
    }
    },
    radiusAxis:{
      type:'category',
      show:true,
      axisLabel:{
        show:true,
      },
      axisLine:{
        show:true,
      },
      splitLine:{
        show:true,
    }
    },
    series:[{
      name:'',
      type:'bar',
      roundCap:true,
      barWidth:90,
      showBackground:true,
      backgroundStyle:{
        color:'rgba(66,66,66,.3)'
      },
      data:[60],
      coordinateSystem:'polar',
      itemStyle:{
        normal: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      offset: 0,
      color: "#00B6FF" // 0% 处的颜色
      }, {
      offset: 0.6,
      color: "#00A4FF" // 60% 处的颜色
      }, {
      offset: 1,
      color: "#00A0FF" // 100% 处的颜色
      },
    ]),
      opacity: 1
      }
      }
    },
    {
      name:"",
      type:'pie',
      startAngle:90,
      radius:['85%'],
      hoverAnimation:false,
      animation:false,
      center:['50%','50%'],
      itemStyle:{
        color:'rgba(66,66,66,.1)',
        borderWidth:1,
        borderColor:'#5269ee',
      },
      data:[100]
    },
    {
      name:"",
      type:'pie',
      startAngle:80,
      radius:['55%'],
      hoverAnimation:false,
      animation:false,
      center:['50%','50%'],
      itemStyle:{
        color:'rgba(66,66,66,.1)',
        borderWidth:1,
        borderColor:'#5269ee',
      },
      data:[100]
    },
  ]
  }}
  get option() {
  return{
    // backgroundColor:'#022142',
    title:{
      text:this.value+'%',
      left:'center',
      top:'40%',
      textStyle:{
        color:'#28bcfe',
        fontSize:40,
        fontWeight:'bold',
      }
    },
    angleAxis:{
      // 起始角度
      startAngle:225,
      max:360,
      clockwise:true,
      show:false,
    },
    radiusAxis:{
        type:'category',
        show:true,
        axisLabel: {
          show:false
        },
        axisLine: {
          show:false
        },
        axisTick: {
          show:false
        },
      },
      polar:{
        center:['50%','50%'],
        radius:'150%',
      },
      series:[
      {
      type:'bar',
      z:2,
      data:[this.getvalue],
      showBackground:true,
      backgroundStyle:{
        color:'transparent'
      },
      coordinateSystem:'polar',
      roundCap:true,
      barWidth:40,
      barGap:'-100%',
      itemStyle:{
        normal: { 
          opacity:1,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: "#042856" // 0% 处的颜色
          },  {
          offset: 1,
          color: "#00A8FF" // 100% 处的颜色
          },
        ]),
      ShadowBlur:5,
      shadowColor:'#2A95F9'
      }
      }
    },
    {
      type:'bar',
      z:1,
      // 环形跨度
      data:[270],
      coordinateSystem:'polar',
      roundCap:true,
      barWidth:40,
      barGap:'-100%',
      itemStyle:{
        normal: {
          opacity: 1,
          color:'#093368'
        }
      }
    }
  ]
//     series: [
//    {
//      type: 'gauge',
//      progress: {
//        show: true,
//        width: 60
//      },
    
//      pointer: {
//         show: false
//       },
//      axisLine: {
//        lineStyle: {
//          width: 18
//        }
//      },
//      axisTick: {
//        show:false
//      },
     
//      splitLine: {
//       show: false,
//       //  length: 15,
//       //  lineStyle: {
//       //    width: 2,
//       //    color: '#999'
//       //  }
//      },
     
//      axisLabel: {
//       show: false,
//        distance: 25,
//        color: '#999',
//        fontSize: 20
//      },
//      anchor: {
//       //  show: true,
//       //  showAbove: true,
//       //  size: 25,
//       //  itemStyle: {
//       //    borderWidth: 10
//       //  }
//      },
//      title: {
//        show: false
//      },
//      detail: {
//        valueAnimation: false,
//        fontSize: 50,
//        offsetCenter: [0, '10%']
//      },
//      data: [
//        {
//          value: 90
//        }
//      ]
//    }
//  ]
  }}
    onOk() {
      (this.$refs["yinjForm"] as any).validate((valid: any) => {
        if (valid) {
          this.onSubmit();
        } else {
          return false;
        }
      });
    }
    onCancel() {
      this.toggle(false);
      (this.$refs["yinjForm"] as any).resetFields();
    }
  
  }
  </script>
  <style lang="scss" scoped>
  $deep:"::v-deep";
  ::v-deep.el-dialog__wrapper {
    .float{
      // width: 100%;
      // height: 50%;
      display: flex;
    }
    .option{
      width: 33%;
      // height: 70%;
      display: flex;
    }
    .bg{
      width: 100%;
      height: 100%;
    }
    .tp{
      width: 50%;
      height: 60%;
      background: url("../../../assets/dp/Yxpj/hxt.png") no-repeat;
      background-size: 100% 100%;
      margin-left: 25%;
      margin-top: 10px;

    }
    .fontcolor{
      font-size: 18px;
      background-image: linear-gradient(#fff,#9FD4DD);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .border{
      width: 50%;
      height: 50%;
      color: #fff;
      padding: 20px 40px 0px 40px;
    }
    .flex{
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap:wrap
    }
    .el-dialog {
      width: 1140px;
      background: url("../../../assets/dp/Yxpj/bk.png") no-repeat;
      background-size: 100% 100%;
     

      .el-dialog__header {
        text-align: center;
        width: 100%;
        height: 100%;
        background: url("../../../assets/dp/Yxpj/tb.png") no-repeat;
        background-position: 52%;
      }
      .el-dialog__title {
        color: #fff;
      }
      .el-dialog__headerbtn .el-dialog__close {
        color: #fff;
      }
      .el-dialog__body {
        height: 700px;
        overflow-y: auto;
      }
      .el-dialog__footer {
        border-top: 1px solid #e8eaec;
      }
    }
  }
  
  ::v-deep.el-input--small .el-input__inner {
    margin: 3px 0;
  }
  ::v-deep .upload-demo {
    .el-upload-list .el-upload-list--picture {
      .el-upload-list__item {
        width: 300px;
      }
    }
  }
  </style>
  