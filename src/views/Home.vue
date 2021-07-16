<template>
  <div class="home">
    <div class="container">
      <div>{{ this.startYear }}年から10年間のライフイベント</div>
      <button type="button" @click="openEditYear">変更</button>
      <Chart :chartData="chartItems" :options="chartOptions" />
      <button type="button" @click="toFamilyEdit">作成</button>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th v-for="index of 10" :key="index">{{ parseInt(startYear) + index - 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(family, index) in this.$store.getters.familyList" :key="index">
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
        </tbody>
      </table>
      <button type="button" @click="toIncomeEdit">収入の登録</button>
      <table>
        <thead>
          <tr>
            <th>収入</th>
            <th v-for="index of 10" :key="index">{{ parseInt(startYear) + index - 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(family, index) in this.$store.getters.familyList" :key="index">
            <td>{{ family.name }}</td>
            <td v-for="n of 10" :key="n">
              {{ calculateIncome(family.name, parseInt(startYear) + n - 1) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalWindow @close="closeEditYear()" v-show="showEditYear">
      <h6>年の変更</h6>
      <div><input type="number" v-model="startYear" />年</div>
      <template slot="footer">
        <button @click="closeEditYear()">閉じる</button>
      </template>
    </ModalWindow>
  </div>
</template>

<script>
// @ is an alias to /src
import { Bar } from 'vue-chartjs';
import Chart from './ChartBox.js';
import moment from 'moment';
import ModalWindow from '@/components/ModalWindow';

export default {
  extends: Bar,
  components: {
    Chart,
    ModalWindow,
  },
  data() {
    return {
      chartItems: {
        labels: [
          '12月',
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
        ],
        datasets: [
          {
            label: '月ごとの点数',
            data: [95, 70, 80, 65, 69, 80, 100, 100, 72, 81, 45, 70],
            backgroundColor: 'lightblue',
          },
        ],
      },
      chartOptions: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              display: true,
              // X軸グリッド非表示
              gridLines: {
                display: false,
              },
            },
          ],
          // Y軸
          yAxes: [
            {
              display: true,
              position: 'right',
              ticks: {
                // 0から始まる
                beginAtZero: true,
                // 最大5目盛
                maxTicksLimit: 5,
              },
            },
          ],
        },
      },
      showEditYear: false,
      family: [],
      startYear: this.$store.getters.startYear,
    };
  },
  methods: {
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
      for (const home of this.$store.getters.homeSpendingList) {
        if (parseInt(home.year) === year) {
          return home.price;
        }
      }
      return;
    },
    calculateIncome(name, year) {
      let list = {};
      for (const incomeList of this.$store.getters.incomeList) {
        if (incomeList.name === name) {
          list = incomeList;
          break;
        }
      }
      const elapsedYear = year - list.year;
      if (elapsedYear < 0) return 0;
      return (list.income * (list.rate / 100 + 1) ** elapsedYear).toFixed(1);
    },
  },
};
</script>

<style scoped>
table,
td,
th {
  border: 1px solid #333;
  border-collapse: collapse;
}
th {
  width: 100px;
}
</style>
