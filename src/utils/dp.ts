// export const changeBgcImg = function(params?:any){
//     var imgSrc = "";
//         switch (params) {
//             case 0:
//                  this.imgSrc:require()
//                 break;

//             default:
//                 break;
//         }
// }

const swzIcon: any = {
  0: require("@/assets/dp/OperateMonitoreRq/leftButtonActiveBgc.png"),
  1: require("@/assets/dp/OperateMonitoreRq/leftButtonActiveBgc.png"),
  2: require("@/assets/dp/OperateMonitoreRq/rightButtonActiveBgc.png"),
  3: require("@/assets/dp/OperateMonitoreRq/rightButtonActiveBgc.png"),
};
export const getSwzIcon = (sw: any) => {
  return swzIcon[sw];
};
