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
    getSpending() {
      ipcRenderer.send('getSpending');
    },
    getIncome() {
      ipcRenderer.send('getIncome');
    },
    async createFamily({ dispatch }, { familyName, familyBirthday }) {
      const data = { name: familyName, birthday: familyBirthday };
      await ipcRenderer.invoke('createFamily', data);
      dispatch('getPage');
    },
    async createSpending({ dispatch }, { spendingName, spendingYear, spendingPrice }) {
      const data = { name: spendingName, year: spendingYear, price: spendingPrice };
      await ipcRenderer.invoke('createSpending', data);
      dispatch('getSpending');
    },
    editYear({ commit }, { year }) {
      commit('setYear', year);
    },
    async editFamily({ dispatch }, { id, name, birthday }) {
      const data = { id, name, birthday };
      await ipcRenderer.invoke('editFamily', data);
      dispatch('getPage');
    },
    async editSpending({ dispatch }, { id, name, year, price }) {
      const data = { id, name, year, price };
      await ipcRenderer.invoke('editSpending', data);
      dispatch('getSpending');
    },
    async editIncome({ dispatch }, { id, year, income, rate }) {
      const data = { id, year, income, rate };
      await ipcRenderer.invoke('editIncome', data);
      dispatch('getIncome', data);
    },
    async deleteFamily({ dispatch }, { id }) {
      await ipcRenderer.invoke('deleteFamily', id);
      dispatch('getPage');
    },
    async deleteSpending({ dispatch }, { id }) {
      await ipcRenderer.invoke('deleteSpending', id);
      dispatch('getSpending');
    },
  },
};
