// interface ModalData {
//   row: any;
// }
// const modalData: ModalData = {
//   row: {},
// };

// interface State {
//   modalData: ModalData;
// }
// const state: State = {
//   modalData,
// };

// const mutations: any = {
//   setModalData(state: State, row: any) {
//     console.log(row,"大小");
//     state.modalData.row = row;
//   },
// };
// const actions: any = {};
// const namespaced: boolean = true;
// export default {
//   namespaced,
//   state,
//   mutations,
//   actions,
// };

const state: any = {
  modalData: {},
  gasData:[],
  gcjsData:[]
};
const mutations: any = {
  setModalData(state: any, modalData: any) {
    state.modalData = modalData;
  },
  setGasData(state: any, gasData: any) {
    state.gasData = gasData;
  },
  setGcjsData(state: any, gcjsData: any) {
    state.gcjsData = gcjsData;
  },

  // 清空state
  clear(state: any, val: any) {
    state.gasData = [];
  },
};

const actions: any = {};
const namespaced: boolean = true;
export default {
  namespaced,
  state,
  mutations,
  actions,
};
