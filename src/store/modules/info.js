const date = new Date();

export default {
  state() {
    return {
      familyList: [],
      startYear: date.getFullYear(),
    };
  },
  mutations: {
    setFamily(state, family) {
      state.familyList.push(family);
    },
    deleteFamily(state, index) {
      state.familyList.splice(index, 1);
    },
    setYear(state, year) {
      state.startYear = year;
    },
  },
  getters: {
    familyList(state) {
      return state.familyList;
    },
    startYear(state) {
      return state.startYear;
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
    editYear({ commit }, { year }) {
      commit('setYear', year);
    },
  },
};
