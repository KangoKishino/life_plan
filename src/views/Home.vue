<template>
  <div class="home">
    <div class="container">
      <button type="button" @click="createPDF">PDF出力</button>
      <div>{{ this.startYear }}年から10年間のライフイベント</div>
      <button type="button" @click="openEditYear">変更</button>
      <ChartData :summarizeData="summarizeData" :key="changeTrigger" />
      <button type="button" @click="toFamilyEdit">作成</button>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th v-for="index of 10" :key="index">{{ parseInt(startYear) + index - 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(family, index) in this.family" :key="index">
            <td>{{ family.name }}</td>
            <td v-for="n of 10" :key="n">{{ calculateAge(family.birthday, n - 1) }}</td>
          </tr>
        </tbody>
      </table>
      <button type="button" @click="toSpendingEdit">支出の登録</button>
      <table>
        <thead>
          <tr>
            <th>支出</th>
            <th v-for="index of 10" :key="index">{{ parseInt(startYear) + index - 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>家</td>
            <td v-for="n of 10" :key="n">{{ spendingHome(parseInt(startYear) + n - 1) }}</td>
          </tr>
          <tr>
            <td>車</td>
            <td v-for="n of 10" :key="n">{{ spendingCar(parseInt(startYear) + n - 1) }}</td>
          </tr>
        </tbody>
      </table>
      <button type="button" @click="toIncomeEdit">収入の登録</button>
      <div class="box-container">
        <table class="margin">
          <thead>
            <tr>
              <th>収入</th>
              <th v-for="index of 10" :key="index">{{ parseInt(startYear) + index - 1 }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(family, index) in this.family" :key="index">
              <td>{{ family.name }}</td>
              <td v-for="n of 10" :key="n">
                {{ calculateIncome(family._id, parseInt(startYear) + n - 1) }}
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>収入合計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ totalIncome.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ModalWindow @close="closeEditYear()" v-show="showEditYear">
      <h6>年の変更</h6>
      <div><input type="number" v-model.number="startYear" />年</div>
      <template slot="footer">
        <button @click="closeEditYear()">閉じる</button>
      </template>
    </ModalWindow>
  </div>
</template>

<script>
// @ is an alias to /src
import moment from 'moment';
import ModalWindow from '@/components/ModalWindow';
import ChartData from '@/components/ChartData';
import { ipcRenderer } from 'electron';

export default {
  components: {
    ChartData,
    ModalWindow,
  },
  data() {
    return {
      showEditYear: false,
      family: [],
      homeSpendingList: [],
      carSpendingList: [],
      incomeList: [],
      startYear: this.$store.getters.startYear,
      totalIncome: 0,
      summarizeData: {
        year: [],
        income: [],
        carSpending: [],
        homeSpending: [],
      },
      changeTrigger: 0,
    };
  },
  watch: {
    startYear() {
      console.log('startyear changed');
      this.createYearList();
      this.$store.dispatch('getPage');
      this.$store.dispatch('getSpending');
      this.$store.dispatch('getIncome');
    },
  },
  created() {
    this.createYearList();
    this.$store.dispatch('getPage');
    this.$store.dispatch('getSpending');
    this.$store.dispatch('getIncome');
  },
  methods: {
    createYearList() {
      this.summarizeData.year = [];
      for (let i = 0; i < 10; i++) {
        this.summarizeData.year.push(this.startYear + i);
      }
    },
    openEditYear() {
      this.showEditYear = true;
    },
    closeEditYear() {
      this.showEditYear = false;
    },
    toFamilyEdit() {
      this.$router.push({ name: 'FamilyEdit' });
    },
    toSpendingEdit() {
      this.$router.push({ name: 'SpendingEdit' });
    },
    toIncomeEdit() {
      this.$router.push({ name: 'IncomeEdit' });
    },
    calculateAge(birthday, n) {
      return `${this.startYear - moment(birthday).year() + n}歳`;
    },
    spendingHome(year) {
      for (const home of this.homeSpendingList) {
        if (parseInt(home.year) === year) {
          return home.price;
        }
      }
      return;
    },
    spendingCar(year) {
      for (const car of this.carSpendingList) {
        if (parseInt(car.year) === year) {
          return car.price;
        }
      }
      return;
    },
    calculateIncome(id, year) {
      let list = {};
      // 収入のある人を見つけたら抜き出し
      for (const incomeList of this.incomeList) {
        if (incomeList.family_id === id) {
          list = incomeList;
          break;
        }
      }
      if (Object.keys(list).length === 0) return 0;
      const elapsedYear = year - list.year;
      if (elapsedYear < 0) return 0;
      const income = (list.income * (list.rate / 100 + 1) ** elapsedYear).toFixed(1);
      return income;
    },
    createPDF() {
      const pdfname = 'mypdf';
      ipcRenderer.send('print-to-pdf', pdfname);
    },
  },
  mounted() {
    // mountでメインプロセスからのIPC通信待機
    ipcRenderer.on('wrote-pdf', (event, path) => {
      const msg = `PDFを ${path} に作成しました。`;
      console.log(msg);
    });
    ipcRenderer.on('getPage', (event, docs) => {
      this.family = docs;
    });
    ipcRenderer.on('getSpending', (event, docs) => {
      this.homeSpendingList = [];
      this.carSpendingList = [];
      this.summarizeData.homeSpending = Array(10).fill(0);
      this.summarizeData.carSpending = Array(10).fill(0);
      docs.forEach(element => {
        if (element.name === '家') {
          this.homeSpendingList.push(element);
        } else {
          this.carSpendingList.push(element);
        }
      });
      for (let i = 0; i < 10; i++) {
        docs.forEach(element => {
          if (this.summarizeData.year[i] === element.year && element.name === '家') {
            this.summarizeData.homeSpending.splice(
              i,
              1,
              Number(element.price) + this.summarizeData.homeSpending[i]
            );
          } else if (this.summarizeData.year[i] === element.year && element.name === '車') {
            this.summarizeData.carSpending.splice(
              i,
              1,
              Number(element.price) + this.summarizeData.carSpending[i]
            );
          }
        });
      }
    });
    ipcRenderer.on('getIncome', (event, docs) => {
      this.incomeList = docs;
      let tentativeIncome = Array(10).fill(0);
      docs.forEach(element => {
        const list = this.summarizeData.year.concat();
        for (let i = 0; i < 10; i++) {
          list.splice(i, 1, list[i] - element.year);
        }
        for (let i = 0; i < 10; i++) {
          if (list[i] >= 0) {
            const income = (
              tentativeIncome[i] +
              element.income * (element.rate / 100 + 1) ** list[i]
            ).toFixed(2);
            tentativeIncome.splice(i, 1, Number(income));
          }
        }
      });
      this.summarizeData.income = tentativeIncome;
      this.totalIncome = tentativeIncome.reduce((sum, element) => {
        return sum + element;
      }, 0);
      this.changeTrigger++;
    });
  },
};
</script>

<style scoped>
table,
td,
th,
td {
  border: 1px solid #333;
  border-collapse: collapse;
}
th {
  width: 100px;
}

.box-container {
  display: flex;
}
.margin {
  margin-right: 5px;
}
</style>
