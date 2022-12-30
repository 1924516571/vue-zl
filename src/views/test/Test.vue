<template>
  <div class="BarCharts">
    <!-- 内容 -->
    <div id="bar"></div>
    <div class="chart" ref="chart"></div>
    <!-- 底座背景 -->
    <div class="bg"></div>
    <!-- 3D地图容器 -->
    <div id="main" style="width:100%;height:800px;" ref="mapChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts5";
import "echarts-gl";
import { getPie3D, getParametricEquation } from "./chart"; //工具类js，页面路径自己修改
import Vue from "vue";
import chinaJson from "./china.json";
Vue.prototype.$echarts = echarts;
const color = ["#005aff", "#f8b551"];

// 绘制左侧面
const CubeLeft = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function(ctx, shape) {
    // 会canvas的应该都能看得懂，shape是从custom传入的
    const xAxisPoint = shape.xAxisPoint;
    const c0 = [shape.x, shape.y];
    const c1 = [shape.x - 13, shape.y - 13];
    const c2 = [xAxisPoint[0] - 13, xAxisPoint[1] - 13];
    const c3 = [xAxisPoint[0], xAxisPoint[1]];
    ctx
      .moveTo(c0[0], c0[1])
      .lineTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .closePath();
  },
});
// 绘制右侧面
const CubeRight = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function(ctx, shape) {
    const xAxisPoint = shape.xAxisPoint;
    const c1 = [shape.x, shape.y];
    const c2 = [xAxisPoint[0], xAxisPoint[1]];
    const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9];
    const c4 = [shape.x + 18, shape.y - 9];
    ctx
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});
// 绘制顶面
const CubeTop = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function(ctx, shape) {
    const c1 = [shape.x, shape.y];
    const c2 = [shape.x + 18, shape.y - 9];
    const c3 = [shape.x + 5, shape.y - 22];
    const c4 = [shape.x - 13, shape.y - 13];
    ctx
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});
// 注册三个面图形
echarts.graphic.registerShape("CubeLeft", CubeLeft);
echarts.graphic.registerShape("CubeRight", CubeRight);
echarts.graphic.registerShape("CubeTop", CubeTop);
const max = [1000, 1000, 1000, 1000, 1000];
const value = [210.9, 260.8, 204.2, 504.9, 840.5];
export default {
  name: "Bar",
  props: {
    xData: ["储备站1", "储备站2", "储备站3", "储备站4", "储备站5"],
  },
  data() {
    return {
      optionData: [
        {
          name: "启用电梯",
          value: 176,
        },
        {
          name: "停用电梯",
          value: 288,
        },
      ],
      statusChart: null,
      option: {},
    };
  },
  created() {
    this.setLabel();
  },
  mounted() {
    this.chartthreenD();
    this.initChart();
    // 初始化地图
    this.MapinitChart();
    //根据窗口变化自动调节图表大小
    const that = this;
    window.onresize = function() {
      that.changeSize();
    };
  },

  methods: {
    //初始化地图
    MapinitChart() {
      // 初始化地图
      var myChart = echarts.init(this.$refs.mapChart);
      // var uploadedDataURL = "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json";
      echarts.registerMap("tongren", chinaJson);
      var option = {
        title: {
          // 标题
          top: "5%",
          text: "中国3D地图",
          subtext: "",
          x: "center",
          textStyle: {
            color: "#ccc",
          },
        },

        tooltip: {
          // 提示框
          trigger: "item",
          formatter: function(params) {
            console.log(params,"移上去的对象");
            return params.name;
          },
        },

        series: [
          {
            type: "map3D", // 系列类型
            name: "map3D", // 系列名称
            map: "tongren", // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同(ECharts 中提供了两种格式的地图数据，一种是可以直接 script 标签引入的 js 文件，引入后会自动注册地图名字和数据。还有一种是 JSON 文件，需要通过 AJAX 异步加载后手动注册。)

            // 环境贴图，支持純颜色值，渐变色，全景贴图的 url。默认为 'auto'，在配置有 light.ambientCubemap.texture 的时候会使用该纹理作为环境贴图。否则则不显示环境贴图。
            environment: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  // 配置为垂直渐变的背景
                  offset: 0,
                  color: "#00aaff", // 天空颜色
                },
                {
                  offset: 0.7,
                  color: "#998866", // 地面颜色
                },
                {
                  offset: 1,
                  color: "#998866", // 地面颜色
                },
              ],
              false
            ),

            label: {
              // 标签的相关设置
              show: true, // (地图上的城市名称)是否显示标签 [ default: false ]
              //distance: 50,               // 标签距离图形的距离，在三维的散点图中这个距离是屏幕空间的像素值，其它图中这个距离是相对的三维距离
              //formatter:,               // 标签内容格式器
              textStyle: {
                // 标签的字体样式
                color: "#000", // 地图初始化区域字体颜色
                fontSize: 8, // 字体大小
                opacity: 1, // 字体透明度
                backgroundColor: "rgba(0,23,11,0)", // 字体背景色
              },
            },

            itemStyle: {
              // 三维地理坐标系组件 中三维图形的视觉属性，包括颜色，透明度，描边等。
              color: "rgba(95,158,160,0.5)", // 地图板块的颜色
              opacity: 1, // 图形的不透明度 [ default: 1 ]
              borderWidth: 0.5, // (地图板块间的分隔线)图形描边的宽度。加上描边后可以更清晰的区分每个区域   [ default: 0 ]
              borderColor: "#000", // 图形描边的颜色。[ default: #333 ]
            },

            emphasis: {
              // 鼠标 hover 高亮时图形和标签的样式 (当鼠标放上去时  label和itemStyle 的样式)
              label: {
                // label高亮时的配置
                show: true,
                textStyle: {
                  color: "#fff", // 高亮时标签颜色变为 白色
                  fontSize: 15, // 高亮时标签字体 变大
                },
              },
              itemStyle: {
                // itemStyle高亮时的配置
                areaColor: "#66ffff", // 高亮时地图板块颜色改变
              },
            },

            groundPlane: {
              // 地面可以让整个组件有个“摆放”的地方，从而使整个场景看起来更真实，更有模型感。
              show: false, // 是否显示地面。[ default: false ]
              color: "#aaa", // 地面颜色。[ default: '#aaa' ]
            },

            regions: [
              {
                // 可对单个地图区域进行设置
                name: "玉屏侗族自治县", // 所对应的地图区域的名称
                //regionHeight: '',			// 区域的高度，可以设置不同的高度用来表达数据的大小。当 GeoJSON 为建筑的数据时，也可以通过这个值表示简直的高度。
                itemStyle: {
                  // 单个区域的样式设置
                  color: "#00FF00",
                  opacity: 1,
                  borderWidth: 0.4,
                  borderColor: "#5F9EA0",
                },
              },
              {
                name: "碧江区",
                itemStyle: {
                  color: "#EEEE00",
                  opacity: 1,
                  borderWidth: 0.4,
                  borderColor: "#5F9EA0",
                },
              },
            ],

            //shading: 'lambert',       // 三维地理坐标系组件中三维图形的着色效果，echarts-gl 中支持下面三种着色方式:
            // 'color' 只显示颜色，不受光照等其它因素的影响。
            // 'lambert' 通过经典的 lambert 着色表现光照带来的明暗。
            // 'realistic' 真实感渲染，配合 light.ambientCubemap 和 postEffect 使用可以让展示的画面效果和质感有质的提升。ECharts GL 中使用了基于物理的渲染（PBR） 来表现真实感材质。
            // realisticMaterial: {}    // 真实感材质相关的配置项，在 shading 为'realistic'时有效。
            // lambertMaterial: {}      // lambert 材质相关的配置项，在 shading 为'lambert'时有效。
            // colorMaterial: {}        // color 材质相关的配置项，在 shading 为'color'时有效。

            light: {
              // 光照相关的设置。在 shading 为 'color' 的时候无效。  光照的设置会影响到组件以及组件所在坐标系上的所有图表。合理的光照设置能够让整个场景的明暗变得更丰富，更有层次。
              main: {
                // 场景主光源的设置，在 globe 组件中就是太阳光。
                color: "#fff", //主光源的颜色。[ default: #fff ]
                intensity: 1.2, //主光源的强度。[ default: 1 ]
                shadow: false, //主光源是否投射阴影。默认关闭。    开启阴影可以给场景带来更真实和有层次的光照效果。但是同时也会增加程序的运行开销。
                //shadowQuality: 'high',      // 阴影的质量。可选'low', 'medium', 'high', 'ultra' [ default: 'medium' ]
                alpha: 55, // 主光源绕 x 轴，即上下旋转的角度。配合 beta 控制光源的方向。[ default: 40 ]
                beta: 10, // 主光源绕 y 轴，即左右旋转的角度。[ default: 40 ]
              },
              ambient: {
                // 全局的环境光设置。
                color: "#fff", // 环境光的颜色。[ default: #fff ]
                intensity: 0.5, // 环境光的强度。[ default: 0.2 ]
              },
            },

            viewControl: {
              // 用于鼠标的旋转，缩放等视角控制。
              projection: "perspective", // 投影方式，默认为透视投影'perspective'，也支持设置为正交投影'orthographic'。
              autoRotate: false, // 是否开启视角绕物体的自动旋转查看。[ default: false ]
              autoRotateDirection: "cw", // 物体自传的方向。默认是 'cw' 也就是从上往下看是顺时针方向，也可以取 'ccw'，既从上往下看为逆时针方向。
              autoRotateSpeed: 10, // 物体自传的速度。单位为角度 / 秒，默认为10 ，也就是36秒转一圈。
              autoRotateAfterStill: 3, // 在鼠标静止操作后恢复自动旋转的时间间隔。在开启 autoRotate 后有效。[ default: 3 ]
              damping: 0, // 鼠标进行旋转，缩放等操作时的迟滞因子，在大于等于 1 的时候鼠标在停止操作后，视角仍会因为一定的惯性继续运动（旋转和缩放）。[ default: 0.8 ]
              rotateSensitivity: 1, // 旋转操作的灵敏度，值越大越灵敏。支持使用数组分别设置横向和纵向的旋转灵敏度。默认为1, 设置为0后无法旋转。	rotateSensitivity: [1, 0]——只能横向旋转； rotateSensitivity: [0, 1]——只能纵向旋转。
              zoomSensitivity: 1, // 缩放操作的灵敏度，值越大越灵敏。默认为1,设置为0后无法缩放。
              panSensitivity: 1, // 平移操作的灵敏度，值越大越灵敏。默认为1,设置为0后无法平移。支持使用数组分别设置横向和纵向的平移灵敏度
              panMouseButton: "left", // 平移操作使用的鼠标按键，支持：'left' 鼠标左键（默认）;'middle' 鼠标中键 ;'right' 鼠标右键(注意：如果设置为鼠标右键则会阻止默认的右键菜单。)
              rotateMouseButton: "left", // 旋转操作使用的鼠标按键，支持：'left' 鼠标左键;'middle' 鼠标中键（默认）;'right' 鼠标右键(注意：如果设置为鼠标右键则会阻止默认的右键菜单。)

              distance: 200, // [ default: 100 ] 默认视角距离主体的距离，对于 grid3D 和 geo3D 等其它组件来说是距离中心原点的距离,对于 globe 来说是距离地球表面的距离。在 projection 为'perspective'的时候有效。
              minDistance: 40, // [ default: 40 ] 视角通过鼠标控制能拉近到主体的最小距离。在 projection 为'perspective'的时候有效。
              maxDistance: 400, // [ default: 400 ] 视角通过鼠标控制能拉远到主体的最大距离。在 projection 为'perspective'的时候有效。

              alpha: 40, // 视角绕 x 轴，即上下旋转的角度。配合 beta 可以控制视角的方向。[ default: 40 ]
              beta: 15, // 视角绕 y 轴，即左右旋转的角度。[ default: 0 ]
              minAlpha: -360, // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
              maxAlpha: 360, // 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
              minBeta: -360, // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
              maxBeta: 360, // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]

              center: [0, 0, 0], // 视角中心点，旋转也会围绕这个中心点旋转，默认为[0,0,0]。

              animation: true, // 是否开启动画。[ default: true ]
              animationDurationUpdate: 1000, // 过渡动画的时长。[ default: 1000 ]
              animationEasingUpdate: "cubicInOut", // 过渡动画的缓动效果。[ default: cubicInOut ]
            },

            data: [
              {
                // 可对单个地图区域进行设置
                name: "玉屏侗族自治县", // 所对应的地图区域的名称
                //regionHeight: '',			// 区域的高度，可以设置不同的高度用来表达数据的大小。当 GeoJSON 为建筑的数据时，也可以通过这个值表示简直的高度。
                itemStyle: {
                  // 单个区域的样式设置
                  color: "#00FF00",
                  opacity: 1,
                  borderWidth: 0.4,
                  borderColor: "#5F9EA0",
                },
              },
              {
                name: "碧江区",
                itemStyle: {
                  color: "#EEEE00",
                  opacity: 1,
                  borderWidth: 0.4,
                  borderColor: "#5F9EA0",
                },
              },
            ],
          },
        ],
      };
      // 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，ECharts 会合并新的参数和数据，然后刷新图表。
      myChart.setOption(option);
    },
    chartthreenD() {
      var myChart = echarts.init(document.getElementById("bar"));
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function(params, ticket, callback) {
            const item = params[1];
            return item.name + " : " + item.value;
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 10,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: this.xData,
          axisLine: {
            show: false,
            lineStyle: {
              color: "white",
            },
          },
          //   offset: 15,
          //x轴刻度线
          axisTick: {
            show: false,
            length: 9,
            alignWithLabel: true,
            lineStyle: {
              color: "#7DFFFD",
            },
          },
          axisLabel: {
            show: true,
            fontSize: 12,
          },
        },
        yAxis: {
          min: 0,
          interval: 200, //y轴值间隔数
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(127, 214, 255, 0.4)",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(255,255,255,0.2)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            fontSize: 12,
            color: "#fff",
          },
          boundaryGap: ["10%", "20%"],
        },
        series: [
          {
            type: "custom",
            renderItem: function(params, api) {
              const location = api.coord([api.value(0), api.value(1)]);
              return {
                type: "group",
                children: [
                  {
                    type: "CubeLeft",
                    shape: {
                      api,
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: "rgba(47,102,192,.57)",
                    },
                  },
                  {
                    type: "CubeRight",
                    shape: {
                      api,
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: "rgba(59,128,226,.57)",
                    },
                  },
                  {
                    type: "CubeTop",
                    shape: {
                      api,
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: "rgba(72,156,221,.57)",
                    },
                  },
                ],
              };
            },
            data: max,
          },
          {
            type: "custom",
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)]);
              var color =
                api.value(1) > 800
                  ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(37,170,254,1)",
                      },
                      {
                        offset: 0.8,
                        color: "rgba(37,170,254,0.1)",
                      },
                    ])
                  : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(37,170,254,1)",
                      },
                      {
                        offset: 0.8,
                        color: "rgba(37,170,254,0.1)",
                      },
                    ]);
              return {
                type: "group",
                children: [
                  {
                    type: "CubeLeft",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: color,
                    },
                  },
                  {
                    type: "CubeRight",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: color,
                    },
                  },
                  {
                    type: "CubeTop",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: color,
                    },
                  },
                ],
              };
            },

            data: value,
          },
          {
            type: "bar",
            label: {
              normal: {
                show: false,
                position: "top",

                fontSize: 16,
                color: "#fff",
                offset: [2, -25],
              },
            },
            itemStyle: {
              color: "transparent",
            },
            tooltip: {},
            data: max,
          },
        ],
      };
      myChart.setOption(option);
    },
    // 初始化label样式
    setLabel() {
      this.optionData.forEach((item, index) => {
        item.itemStyle = {
          color: color[index],
        };
        item.label = {
          normal: {
            show: true,
            color: color[index],
            formatter: ["{b|{b}}", "{c|{c}}{b|台}", "{d|{d}%}"].join(""),
            rich: {
              b: {
                color: "#fff",
                lineHeight: 25,
                align: "left",
              },
              c: {
                fontSize: 22,
                color: "#fff",
                textShadowColor: "#1c90a6",
                textShadowOffsetX: 0,
                textShadowOffsetY: 2,
                textShadowBlur: 5,
              },
              d: {
                color: color[index],
                align: "left",
              },
            },
          },
        };
        item.labelLine = {
          normal: {
            lineStyle: {
              width: 1,
              color: "rgba(255,255,255,0.7)",
            },
          },
        };
      });
    },
    // 图表初始化
    initChart() {
      this.statusChart = echarts.init(this.$refs.chart);
      // 传入数据生成 option, 构建3d饼状图, 参数工具文件已经备注的很详细
      this.option = getPie3D(this.optionData, 0.8, 240, 28, 26, 0.5);
      this.statusChart.setOption(this.option);
      // 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
      this.option.series.push({
        name: "电梯状态", //自己根据场景修改
        backgroundColor: "transparent",
        type: "pie",
        label: {
          opacity: 1,
          fontSize: 13,
          lineHeight: 20,
        },
        startAngle: -40, // 起始角度，支持范围[0, 360]。
        clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ["20%", "50%"],
        center: ["50%", "50%"],
        data: this.optionData,
        itemStyle: {
          opacity: 0, //这里必须是0，不然2d的图会覆盖在表面
        },
      });
      this.statusChart.setOption(this.option);
      this.bindListen(this.statusChart);
    },
    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    // optionName是防止有多个图表进行定向option传递，单个图表可以不传，默认是opiton
    bindListen(myChart, optionName = "option") {
      let selectedIndex = "";
      let hoveredIndex = "";
      // 监听点击事件，实现选中效果（单选）
      myChart.on("click", (params) => {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
        const isSelected = !this[optionName].series[params.seriesIndex].pieStatus.selected;
        const isHovered = this[optionName].series[params.seriesIndex].pieStatus.hovered;
        const k = this[optionName].series[params.seriesIndex].pieStatus.k;
        const startRatio = this[optionName].series[params.seriesIndex].pieData.startRatio;
        const endRatio = this[optionName].series[params.seriesIndex].pieData.endRatio;
        // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
        if (selectedIndex !== "" && selectedIndex !== params.seriesIndex) {
          this[optionName].series[selectedIndex].parametricEquation = getParametricEquation(
            this[optionName].series[selectedIndex].pieData.startRatio,
            this[optionName].series[selectedIndex].pieData.endRatio,
            false,
            false,
            k,
            this[optionName].series[selectedIndex].pieData.value
          );
          this[optionName].series[selectedIndex].pieStatus.selected = false;
        }
        // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
        this[optionName].series[params.seriesIndex].parametricEquation = getParametricEquation(
          startRatio,
          endRatio,
          isSelected,
          isHovered,
          k,
          this[optionName].series[params.seriesIndex].pieData.value
        );
        this[optionName].series[params.seriesIndex].pieStatus.selected = isSelected;
        // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
        selectedIndex = isSelected ? params.seriesIndex : null;
        // 使用更新后的 option，渲染图表
        myChart.setOption(this[optionName]);
      });
      // 监听 mouseover，近似实现高亮（放大）效果
      myChart.on("mouseover", (params) => {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
          // 否则进行高亮及必要的取消高亮操作
        } else {
          // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
          if (hoveredIndex !== "") {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected = this[optionName].series[hoveredIndex].pieStatus.selected;
            isHovered = false;
            startRatio = this[optionName].series[hoveredIndex].pieData.startRatio;
            endRatio = this[optionName].series[hoveredIndex].pieData.endRatio;
            k = this[optionName].series[hoveredIndex].pieStatus.k;
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            this[optionName].series[hoveredIndex].parametricEquation = getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, this[optionName].series[hoveredIndex].pieData.value);
            this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered;
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = "";
          }
          // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
          if (params.seriesName !== "mouseoutSeries" && params.seriesName !== "pie2d") {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected = this[optionName].series[params.seriesIndex].pieStatus.selected;
            isHovered = true;
            startRatio = this[optionName].series[params.seriesIndex].pieData.startRatio;
            endRatio = this[optionName].series[params.seriesIndex].pieData.endRatio;
            k = this[optionName].series[params.seriesIndex].pieStatus.k;
            // 对当前点击的扇形，执行高亮操作（对 option 更新）
            this[optionName].series[params.seriesIndex].parametricEquation = getParametricEquation(
              startRatio,
              endRatio,
              isSelected,
              isHovered,
              k,
              this[optionName].series[params.seriesIndex].pieData.value + 60
            );
            this[optionName].series[params.seriesIndex].pieStatus.hovered = isHovered;
            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex;
          }
          // 使用更新后的 option，渲染图表
          myChart.setOption(this[optionName]);
        }
      });
      // 修正取消高亮失败的 bug
      myChart.on("globalout", () => {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        if (hoveredIndex !== "") {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = this[optionName].series[hoveredIndex].pieStatus.selected;
          isHovered = false;
          k = this[optionName].series[hoveredIndex].pieStatus.k;
          startRatio = this[optionName].series[hoveredIndex].pieData.startRatio;
          endRatio = this[optionName].series[hoveredIndex].pieData.endRatio;
          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          this[optionName].series[hoveredIndex].parametricEquation = getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, this[optionName].series[hoveredIndex].pieData.value);
          this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered;
          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = "";
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(this[optionName]);
      });
    },
    // 自适应宽高
    changeSize() {
      this.statusChart.resize();
    },
  },
};
</script>

<style scoped>
.BarCharts {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}
#bar {
  width: 100%;
  height: 400px;
}
.chart,
.bg {
  width: 100%;
  height: 100%;
}

.bg {
  position: absolute;
  bottom: 50px;
  left: 50%;
  z-index: -1;
  width: 180px;
  height: 73px;
  background: no-repeat center;
  background-image: url("https://ks3-cn-beijing.ksyun.com/sxjg-elevator/datav-platform-2.0/images/chart_opacity_bg.png");
  background-size: 100% 100%;
  transform: translateX(-50%);
}
</style>
