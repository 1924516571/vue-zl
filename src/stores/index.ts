import Vue from 'vue'
import Vuex from 'vuex'
import mapStore from './mapStore'
import shareStore from './shareStore'
import user from './user'
import leftMenu from './leftMenu'
import dpStore from "./dpStore"
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    shareStore,
    mapStore,
    user,
    leftMenu,
    dpStore
  },
  ...shareStore,
//   state: {
//     userInfo: null
//   },
//   mutations: {
//     getUserInfo (state, userInfo) {
//       state.userInfo = userInfo
//     }
//   }
})
// export default new Vuex.Store({
//     state: {
//         userInfo: null
//     },
//     mutations: {
//         getUserInfo(state, userInfo) {
//             state.userInfo = userInfo;
//         }
//     },
//     actions: {

//     }
// })
