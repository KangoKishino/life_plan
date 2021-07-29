<template>
  <div class="income-edit">
    <div class="container">
      <h5>収入</h5>
      <div v-for="(family, index) in this.family" :key="index">
        <div>{{ family.name }}</div>
        <button type="button" @click="openEditIncome(family._id)">編集</button>
      </div>
    </div>
    <ModalWindow @close="closeCreateSpending()" v-show="showEditIncome">
      <h6>{{ selectedPerson }}の収入を追加</h6>
      <table>
        <tr>
          <td>開始年</td>
          <td>
            <div><input type="number" v-model.number="startYear" /></div>
            <p class="error" v-show="error.year">{{ error.message }}</p>
          </td>
        </tr>
        <tr>
          <td>年収</td>
          <td>
            <div><input type="number" v-model.number="income" /></div>
            <p class="error" v-show="error.income">{{ error.message }}</p>
          </td>
        </tr>
        <tr>
          <td>上昇率</td>
          <td>
            <div><input type="number" v-model.number="rate" />%</div>
            <p class="error" v-show="error.rate">{{ error.message }}</p>
          </td>
        </tr>
      </table>

      <template slot="footer">
        <button @click="editIncome()">決定</button>
        <button @click="closeEditIncome()">閉じる</button>
      </template>
    </ModalWindow>
  </div>
</template>

<script>
// @ is an alias to /src
import ModalWindow from '@/components/ModalWindow';
import { ipcRenderer } from 'electron';

export default {
  components: {
    ModalWindow,
  },
  data() {
    return {
      showEditIncome: false,
      startYear: 0,
      income: 0,
      rate: 0,
      selectedPerson: '',
      id: '',
      family: [],
      incomeList: [],
      error: {
        year: false,
        income: false,
        rate: false,
        message: '',
      },
    };
  },
  created() {
    this.$store.dispatch('getPage');
    this.$store.dispatch('getIncome');
  },
  methods: {
    openEditIncome(id) {
      this.incomeList.forEach(income => {
        if (income.family_id === id) {
          this.id = income._id;
          this.income = income.income;
          this.rate = income.rate;
          this.startYear = income.year;
        }
      });
      this.showEditIncome = true;
    },
    closeEditIncome() {
      this.showEditIncome = false;
      this.error.year = false;
      this.error.income = false;
      this.error.rate = false;
    },
    editIncome() {
      if (!this.startYear) {
        this.error.year = true;
        this.error.message = '必須項目です';
        return;
      } else if (typeof this.startYear !== 'number') {
        this.error.year = true;
        this.error.message = '数値を入力してください';
        return;
      } else if (this.startYear < 0) {
        this.error.year = true;
        this.error.message = '正の数を入力してください';
        return;
      } else if (!this.income) {
        this.error.income = true;
        this.error.message = '必須項目です';
        return;
      } else if (typeof this.income !== 'number') {
        this.error.income = true;
        this.error.message = '数値を入力してください';
        return;
      } else if (this.income < 0) {
        this.error.income = true;
        this.error.message = '正の数を入力してください';
        return;
      } else if (typeof this.rate !== 'number') {
        this.error.rate = true;
        this.error.message = '数値を入力してください';
        return;
      }
      this.$store
        .dispatch('editIncome', {
          id: this.id,
          year: parseInt(this.startYear),
          income: parseInt(this.income),
          rate: parseInt(this.rate),
        })
        .then(() => {
          this.closeEditIncome();
        })
        .catch(() => {
          console.log('error');
        });
    },
  },
  mounted() {
    ipcRenderer.on('getPage', (event, docs) => {
      this.family = docs;
    });
    ipcRenderer.on('getIncome', (event, docs) => {
      this.incomeList = docs;
    });
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
