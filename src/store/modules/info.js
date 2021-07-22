import { ipcRenderer } from 'electron';
const date = new Date();

export default {
  state() {
    return {
      familyList: [],
      startYear: date.getFullYear(),
      homeSpendingList: [],
      carSpendingList: [],
      incomeList: [],
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
    setIncome(state, data) {
      state.incomeList.forEach((element, index) => {
        if (element.name === data.name) {
          state.incomeList.splice(index, 1);
        }
      });
      state.incomeList.push(data);
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
    incomeList(state) {
      return state.incomeList;
    },
  },
  actions: {
    getPage() {
      ipcRenderer.send('getPage');
    },
    async createFamily({ dispatch }, { familyName, familyBirthday }) {
      const data = { name: familyName, birthday: familyBirthday };
      await ipcRenderer.invoke('createFamily', data);
      dispatch('getPage');
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
    editIncome({ commit }, { name, year, income, rate }) {
      const data = { name, year, income, rate };
      commit('setIncome', data);
    },
  },
};
