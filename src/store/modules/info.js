const date = new Date();

export default {
  state() {
    return {
      familyList: [],
      startYear: date.getFullYear(),
      homeSpendingList: [],
      carSpendingList: [],
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
    setHomeSpendingList(state, data) {
      state.homeSpendingList.push(data);
    },
    setCarSpendingList(state, data) {
      state.carSpendingList.push(data);
    },
    deleteHomeSpendingList(state, index) {
      state.homeSpendingList.splice(index, 1);
    },
    deleteCarSpendingList(state, index) {
      state.carSpendingList.splice(index, 1);
    },
  },
  getters: {
    familyList(state) {
      return state.familyList;
    },
    startYear(state) {
      return state.startYear;
    },
    homeSpendingList(state) {
      return state.homeSpendingList;
    },
    carSpendingList(state) {
      return state.carSpendingList;
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
    createSpending({ commit }, { spendingName, spendingYear, spendingPrice }) {
      const data = { year: spendingYear, price: spendingPrice };
      if (spendingName === '家') {
        commit('setHomeSpendingList', data);
      } else {
        commit('setCarSpendingList', data);
      }
    },
    deleteSpending({ commit }, { deleteName, deleteIndex }) {
      if (deleteName === 'home') {
        commit('deleteHomeSpendingList', deleteIndex);
      } else {
        commit('deleteCarSpendingList', deleteIndex);
      }
    },
  },
};
