<template>
  <!--总览-->
  <div class="main">
    <div style="width:90% ;">
      <v-chart :options="option" :autoresize="true" style="width:100%;display:inline-block;"></v-chart>
    </div>
    <!-- <vue-seamless-scroll :data="listData" class="alarm scrollDp">
      <div class="alarm-item" v-for="(item, index) in listData" :key="item.id" @click="onRow(item)">
        <span class="text-over" v-text="`${index + 1}`"></span>
        <span class="text-over" v-text="`${item.id}`"></span>
        <span class="text-over" v-text="`${item.zdmc}`"></span>
        <span class="text-over" v-text="`${item.kssj}`"></span>
      </div>
    </vue-seamless-scroll> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import vueSeamlessScroll from "./myClass.vue";
import { homeApi } from "@/api";
@Component({
  components: {
    vueSeamlessScroll,
  },
})
export default class AlarmAbnormal extends Vue {
  @Mutation setFormParams: any;
  listData: any[] = [];
  val:any=5000;
  @Emit()
  onRow(item?: any) {
    this.setFormParams({
      jcdid: item.sbid,
      jcdmc: item.zdmc,
      jcdlx: item.sbtp,
      pqid: item.pqid,
      jd: item.jd,
      wd: item.wd,
      rwlx: item.rwlx,
      rwmc: item.rwlx,
      rwms: ` ${item.zdmc}${item.jcx}于${item.kssj}持续${item.cxsc}小时不更新，请及时处理`,
    });
  }
  get option() {
  return{
    tooltip: {
        show: false
    },
    
    color: ['#EF3F63', '#FADB10', '#28D2C6','#F19535','#30AEF3','#3461F7','#19C5B8'],
    legend: {
        left:0,
        orient: 'vertical',
        x: 20,
        y: 20,
        data: ['水环境', '交通运输', '城市管理','物业管理','工程建设','排水监管','燃气安全'],
        textStyle:{
          color:'#fff'
        }
    },
    series: [
        {
        name: '水环境',
        type: 'pie',
        //起始刻度的角度，默认为 90 度，即圆心的正上方。0 度为圆心的正右方。
        startAngle: 180,
        hoverAnimation: false,
        tooltip: {},
        radius: ["10%", "5%"],
        center: ['65%', '30%'],
        label: {
            normal: {
                show: false,
                position: 'center',
                color: '#fff',
                formatter: function (params:any) {
                    return params.value
                },
            },
        },
        labelLine: {
            show: true
            // normal: {
            //     show: true
            // }
        },
        data: [{
            value: 300,
            itemStyle: {
                normal: {
                    color: "rgba(80,150,224,0)"
                }
            }
        },
            {
                value: 100,
                itemStyle: {
                    normal: {
                        // color: "rgba(80,150,224,1)"
                        color: "#EF3F63"
                    }
                }
            },
            {
                value: 0,
                itemStyle: {
                    normal: {
                        color: "rgba(80,150,224,0.1)"
                    }
                }
            },
        ]
        },
        {
            name: '交通运输',
            type: 'pie',
            startAngle: 180,
            radius: ['20%', '15%'],
            center: ['65%', '30%'],
            legendHoverLink: false,
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 300,
                itemStyle: {
                    normal: {
                        color: "rgba(35,206,167,0)"
                    }
                }
            },
                {
                    value: 200,
                    itemStyle: {
                        normal: {
                            color: "#FADB10"
                           
                        }
                    }
                },
                {
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "rgba(35,206,167,0.1)"
                        }
                    }
                },
            ]
        },
        {
            name: '城市管理',
            type: 'pie',
            startAngle: 180,
            hoverAnimation: false,
            radius: ["30%", "25%"],
            center: ['65%', '30%'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '10',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 300,
                itemStyle: {
                    normal: {
                        color: "rgba(1,218,220,0)"
                    }
                }
            },
                {
                    value:220,
                    itemStyle: {
                        normal: {
                            color: "#28D2C6"
                        }
                    }
                },
                {
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "rgba(1,218,220,0.1)"
                        }
                    }
                },
            ]
        },
        {
            name: '物业管理',
            type: 'pie',
            startAngle: 180,
            hoverAnimation: false,
            radius: ["40%", "35%"],
            center: ['65%', '30%'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '10',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 300,
                itemStyle: {
                    normal: {
                        color: "rgba(1,218,220,0)"
                    }
                }
            },
                {
                    value: 250,
                    itemStyle: {
                        normal: {
                            color: "#F19535"
                        }
                    }
                },
                {
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "rgba(1,218,220,0.1)"
                        }
                    }
                },
            ]
        },
        {
            name: '工程建设',
            type: 'pie',
            startAngle: 180,
            hoverAnimation: false,
            radius: ["50%", "45%"],
            center: ['65%', '30%'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '10',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 300,
                itemStyle: {
                    normal: {
                        color: "rgba(1,218,220,0)"
                    }
                }
            },
                {
                    value: 240,
                    itemStyle: {
                        normal: {
                            color: "#30AEF3"
                        }
                    }
                },
                {
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "rgba(1,218,220,0.1)"
                        }
                    }
                },
            ]
        },
        {
            name: '排水监管',
            type: 'pie',
            startAngle: 180,
            hoverAnimation: false,
            radius: ["60%", "55%"],
            center: ['65%', '30%'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '10',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 300,
                itemStyle: {
                    normal: {
                        color: "rgba(1,218,220,0)"
                    }
                }
            },
                {
                    value: 280,
                    itemStyle: {
                        normal: {
                            color: "#3461F7"
                        }
                    }
                },
                {
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "rgba(1,218,220,0.1)"
                        }
                    }
                },
            ]
        },
        {
            name: '燃气安全',
            type: 'pie',
            startAngle: 180,
            hoverAnimation: false,
            radius: ["70%", "65%"],
            center: ['65%', '30%'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '10',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: this.val+1,
                itemStyle: {
                    normal: {
                        color: "rgba(1,218,220,0)"
                    }
                }
            },
                {
                    value: this.val,
                    itemStyle: {
                        normal: {
                            color: "#19C5B8"
                        }
                    }
                },
                {
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "rgba(1,218,220,0.1)"
                        }
                    }
                },
            ]
        }
    ]
    };
  }
 
  mounted() {
    // this.getList();
  }
}
</script>
<style lang="scss" scoped>
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
