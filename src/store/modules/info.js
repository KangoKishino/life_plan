export default {
  state() {
    return {
      familyList: [],
    };
  },
  mutations: {
    setFamily(state, family) {
      state.familyList.push(family);
    },
    deleteFamily(state, index) {
      state.familyList.splice(index, 1);
    },
  },
  getters: {
    familyList(state) {
      return state.familyList;
    },
  },
  actions: {
    createFamily({ commit }, { familyName, familyBirthday }) {
      const data = { name: familyName, birthday: familyBirthday };
      commit('setFamily', data);
    },
    deleteFamily({ commit }, { deleteIndex }) {
      commit('deleteFamily', deleteIndex);
    },
  },
};
