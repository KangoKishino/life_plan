import { ipcRenderer } from 'electron';
const date = new Date();

export default {
  state() {
    return {
      startYear: date.getFullYear(),
    };
  },
  mutations: {
    setYear(state, year) {
      state.startYear = year;
    },
  },
  getters: {
    startYear(state) {
      return state.startYear;
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
