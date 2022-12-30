window.mapConfig = {
  map: {
    id: "baseMap",
    view: {
      center: {
        // coord: [119.9395121120892, 31.703167754790485], //武进经纬度
        // coord: [120.75225, 31.65374],   //常熟
        coord:[120.440777,31.500958]
      },
      // zoom: 11,
      zoom:12.5,
      maxZoom: 18,
    },
    controls: [{
        name: 'zoom',
        zoomInTipLabel: '放大',
        zoomOutTipLabel: '缩小'
    }],
    events: ["singleclick", "pointermove"],
  },
  baseLayer: [
    {
      name: "tdt_sl_base",
      source: {
        type: "XYZ",
        url:
          "http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&" +
          "STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a",
        crossOrigin: "Anonymous",
      },
    },
    {
      name: "tdt_sl_txt",
      source: {
        type: "XYZ",
        url:
          "http://t{0-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&" +
          "STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a",
        crossOrigin: "Anonymous",
      },
    },
  ],
  dpLayer: [
    {
      name: "tdt_wy_base",
      source: {
        type: "XYZ",
        url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        crossOrigin: "Anonymous",
      },
    },
  ],
  dpWjLayer: [
    {
      name: "dpwjbj",
      source: {
        type: "GeoJSON",
        url: "武进边界图.json",
        local: true,
        style: (f) => {
          let arr = ["rgba(255, 54, 32, 0.8)", "rgba(58, 135, 251, 0.8)", "rgba(255, 136, 32, 0.8)", "rgba(57, 169, 255, 0.8)"];
          return {
            // fill: {
            //     color: 'red'
            // },
            stroke: {
              width: 2,
              color: "#00FFF4",
            },
          };
        },
      },
      onLayerCreated: function(layer) {
        //回调函数，返回图层对象
      },
      zIndex: 2,
      visible: true,
    },
  ],
  dpXwLayer: [
    {
      name: "dpXwLayer",
      source: {
        type: "GeoJSON",
        url: "新吴边界图.json",
        local: true,
        style: (f) => {
          let arr = ["rgba(255, 54, 32, 0.8)", "rgba(58, 135, 251, 0.8)", "rgba(255, 136, 32, 0.8)", "rgba(57, 169, 255, 0.8)"];
          return {
            fill: {
                color: 'rgba(58, 135, 251, 0.1)',
            },
            stroke: {
              width: 1,
              color: "#00FFF4",
            },
          };
        },
      },
      onLayerCreated: function(layer) {
        //回调函数，返回图层对象
      },
      zIndex: 2,
      visible: true,
    },
  ],
  // 影像图
  tdt2: [
    //影像图
    {
      name: "tdt_yx_base",
      source: {
        type: "XYZ",
        url:
          "http://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&" +
          "STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a",
      },
    },
    {
      name: "tdt_yx_txt",
      source: {
        type: "XYZ",
        url:
          "http://t{0-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&" +
          "STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a",
      },
    },
  ],
  // 区域矢量图
  // areaLayer: [{
  //     name: 'jn',
  //     source: {
  //         type: 'EsriJSON',
  //         url: '水环境新片区.json',
  //         local: true,
  //         style: (f) => {
  //             let arr = ['rgba(255, 54, 32, 0.8)', 'rgba(58, 135, 251, 0.8)', 'rgba(255, 136, 32, 0.8)', 'rgba(57, 169, 255, 0.8)'];
  //             return {
  //                 fill: {
  //                     color: arr[Math.round(Math.random() * 3)]
  //                 },

  //             }
  //         }
  //     },
  //     onLayerCreated: function (layer) {
  //         //回调函数，返回图层对象
  //         console.log("kanzheliu",layer);
  //     },
  //     zIndex: 2,
  //     visible: true
  // }],
  // 武进水系图
  wjLayer: [
    {
      name: "wjyq",
      source: {
        type: "GeoJSON",
        url: "武进圩区.json",
        local: true,
        style: (f) => {
          let arr = ["rgba(189,252,201, 0.8)", "rgba(252,205,182, 0.8)", "rgba(252,247,215, 0.8)", "rgba(184,227,252, 0.8)"];
          return {
            fill: {
              color: arr[Math.round(Math.random() * 3)],
            },
            text: {
              text: f.values_.Name,
              font: "14px Microsoft Yahei",
            },
          };
        },
      },
      onLayerCreated: function(layer) {
        //回调函数，返回图层对象
      },
      zIndex: 0,
      visible: false,
    },
    {
      name: "wjbj",
      source: {
        type: "GeoJSON",
        url: "武进边界图.json",
        local: true,
        style: (f) => {
          let arr = ["rgba(255, 54, 32, 0.8)", "rgba(58, 135, 251, 0.8)", "rgba(255, 136, 32, 0.8)", "rgba(57, 169, 255, 0.8)"];
          return {
            // fill: {
            //     color: 'red'
            // },
            stroke: {
              width: 4,
              color: "red",
            },
          };
        },
      },
      onLayerCreated: function(layer) {
        //回调函数，返回图层对象
      },
      zIndex: 2,
      visible: true,
    },
    {
      name: "wjsx",
      source: {
        type: "GeoJSON",
        url: "武进水系.json",
        local: true,
        // style: (f) => {
        //     let arr = ['rgba(255, 54, 32, 0.8)', 'rgba(58, 135, 251, 0.8)', 'rgba(255, 136, 32, 0.8)', 'rgba(57, 169, 255, 0.8)'];
        //     return {
        //         fill: {
        //             color: rgba(0,0,0,0)
        //         },

        //     }
        // }
      },
      onLayerCreated: function(layer) {
        //回调函数，返回图层对象
      },
      zIndex: 2,
      visible: false,
    },
    {
      name: "wjzgh",
      source: {
        type: "GeoJSON",
        url: "武进主干河道面.json",
        local: true,
        style: (f) => {
          let arr = ["rgba(255, 54, 32, 0.8)", "rgba(58, 135, 251, 0.8)", "rgba(255, 136, 32, 0.8)", "rgba(57, 169, 255, 0.8)"];
          return {
            // fill: {
            //     color: rgba(0,0,0,0)
            // },
            stroke: {
              width: 2,
              color: "#219B82",
            },
          };
        },
      },
      onLayerCreated: function(layer) {
        //回调函数，返回图层对象
      },
      zIndex: 2,
      visible: true,
    },
    {
      name: "wjysgw",
      source: {
        type: "GeoJSON",
        url: "武进雨水管网.json",
        local: true,
        style: (f) => {
          let arr = ["rgba(255, 54, 32, 0.8)", "rgba(58, 135, 251, 0.8)", "rgba(255, 136, 32, 0.8)", "rgba(57, 169, 255, 0.8)"];
          return {
            // fill: {
            //     color: rgba(0,0,0,0)
            // },
            stroke: {
              width: 2,
              color: "rgba(58, 135, 251, 0.8)",
            },
          };
        },
      },
      onLayerCreated: function(layer) {
        //回调函数，返回图层对象
      },
      zIndex: 2,
      visible: false,
    },
    {
      name: "wjwsgw",
      source: {
        type: "GeoJSON",
        url: "武进污水管网.json",
        local: true,
        style: (f) => {
          let arr = ["rgba(255, 54, 32, 0.8)", "rgba(58, 135, 251, 0.8)", "rgba(255, 136, 32, 0.8)", "rgba(57, 169, 255, 0.8)"];
          return {
            // fill: {
            //     color: rgba(0,0,0,0)
            // },
            stroke: {
              width: 2,
              color: "rgba(58, 135, 251, 0.8)",
            },
          };
        },
      },
      onLayerCreated: function(layer) {
        //回调函数，返回图层对象
      },
      zIndex: 2,
      visible: false,
    },
  ],

  //管网雨水矢量切片图
  mapbox: {
    name: "mapbox",
    source: {
      type: "TileVector",
      format: "MVT",
      url: "/gwc/service/tms/1.0.0/jnsw:ysgw@EPSG:900913@pbf/{z}/{x}/{-y}.pbf",
    },
    style: {},
    zIndex: 2,
    visible: true,
  },
  // 雨水箭头
  mapboxarrow: {
    name: "mapboxarrow",
    source: {
      type: "TileVector",
      format: "MVT",
      url: "/gwc/service/tms/1.0.0/jnsw:ysgw@EPSG:900913@pbf/{z}/{x}/{-y}.pbf",
    },
    zIndex: 2,
    visible: true,
  },
  maparrow: {
    name: "maparrow",
    source: {
      type: "XYZ",
      url: "/gwc/service/tms/1.0.0/jnsw:ysgw@EPSG:900913@png/{z}/{x}/{-y}.png",

      crossOrigin: "anonymous",
    },
    zIndex: 2,
    visible: true,
  },
  //管网污水矢量切片图
  wsmapbox: {
    name: "mapbox",
    source: {
      type: "TileVector",
      format: "MVT",
      url: "/gwc/service/tms/1.0.0/jnsw:wsgw@EPSG:900913@pbf/{z}/{x}/{-y}.pbf",
    },
    zIndex: 2,
    visible: true,
  },
  wsmaparrow: {
    name: "maparrow",
    source: {
      type: "XYZ",
      url: "/gwc/service/tms/1.0.0/jnsw:wsgw@EPSG:900913@png/{z}/{x}/{-y}.png",

      crossOrigin: "anonymous",
    },
    zIndex: 2,
    visible: true,
  },
  // 污水箭头
  wsmapboxarrow: {
    name: "mapboxarrow",
    source: {
      type: "TileVector",
      format: "MVT",
      url: "/gwc/service/tms/1.0.0/jnsw:wsgw@EPSG:900913@pbf/{z}/{x}/{-y}.pbf",
    },
    zIndex: 2,
    visible: true,
  },

  gwmap: [
    // {
    //     name: 'jnsw:xq_jz',
    //     style: {
    //         fill: {
    //             color: 'rgba(0,186,255,0.7)'
    //         },
    //         stroke: {
    //             width: 2,
    //             color: 'rgb(0,186,255)'
    //         }
    //     },
    //     source: {
    //         type: 'TileVector',
    //         format: 'MVT',
    //         url: '/gwc/service/tms/1.0.0/jnsw:xq_jz@EPSG:900913@pbf/{z}/{x}/{-y}.pbf'
    //     },
    //     zIndex: 2,
    //     visible: true
    // }, {
    //     name: 'xq_wsgw',
    //     style: {
    //         stroke: {
    //             width: 2,
    //             color: 'green'
    //         }
    //     },
    //     source: {
    //         type: 'TileVector',
    //         format: 'MVT',
    //         url:
    //
    //             "/gwc/service/tms/1.0.0/jnsw:xq_wsgw@EPSG:900913@pbf/{z}/{x}/{-y}.pbf"
    //     },
    // }, {
    //     name: 'xq_ysgw',
    //     style: {
    //         stroke: {
    //             width: 2,
    //             color: 'blue'
    //         }
    //     },
    //     source: {
    //         type: 'TileVector',
    //         format: 'MVT',
    //         url:
    //
    //             "/gwc/service/tms/1.0.0/jnsw:xq_ysgw@EPSG:900913@pbf/{z}/{x}/{-y}.pbf"
    //     },
    // },
    {
      name: "xq",
      source: {
        type: "XYZ",
        url: "/gwc/service/tms/1.0.0/jnsw:xq@EPSG:900913@png/{z}/{x}/{-y}.png",
      },
      zIndex: 2,
      visible: true,
    },
  ],
  gwmaparrow: [
    {
      name: "xq_wsgw",
      source: {
        type: "TileVector",
        format: "MVT",
        url: "/gwc/service/tms/1.0.0/jnsw:xq_wsgw@EPSG:900913@pbf/{z}/{x}/{-y}.pbf",
      },
      zIndex: 2,
      visible: true,
    },
    {
      name: "xq_ysgw",
      source: {
        type: "TileVector",
        format: "MVT",
        url: "/gwc/service/tms/1.0.0/jnsw:xq_ysgw@EPSG:900913@pbf/{z}/{x}/{-y}.pbf",
      },
      zIndex: 2,
      visible: true,
    },
  ],
  // 河道线
  hdmap: [
    {
      name: "hdmap",
      source: {
        type: "TileVector",
        format: "MVT",
        url: "/gwc/service/tms/1.0.0/jnsw:hd@EPSG:900913@pbf/{z}/{x}/{-y}.pbf",
      },
      zIndex: 2,
      visible: true,
    },
    {
      name: "sx",
      source: {
        type: "XYZ",
        // format: 'MVT',
        url: "/gwc/service/tms/1.0.0/jnsw:sx@EPSG:900913@pbf/{z}/{x}/{-y}.png",
      },
      zIndex: 2,
      visible: true,
      // name: 'sx',
      // source: {
      //     type: 'EsriJSON',
      //     url: '江宁河道水系面4326.json',
      //     local: true,
      //     style: (f) => {
      //         return {
      //             fill: {
      //                 color: '#3d78ef'
      //             },
      //             stroke: {
      //                 width: 1,
      //                 color: '#3d78ef'
      //             },
      //             text: {
      //                 font: "18px sans-serif",
      //                 text: f.get("河道名称"),
      //                 fill: {
      //                     color: "#ccc",
      //                 }
      //             }
      //         }
      //     }
      // },
      // onLayerCreated: function (layer) {
      // },
      // zIndex: 2,
      // visible: true
    },
  ],
};
