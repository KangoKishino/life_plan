<template>
  <div class="home">
    <div class="container">
      <Chart :chartData="chartItems" :options="chartOptions" />
      <button type="button" @click="toFamilyEdit">作成</button>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(family, index) in this.$store.getters.familyList" :key="index">
            <td>{{ family.name }}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Bar } from 'vue-chartjs';
import Chart from './ChartBox.js';

export default {
  extends: Bar,
  components: {
    Chart,
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
      showCreateFamily: false,
      family: [],
    };
  },
  methods: {
    openCreateFamily() {
      this.showCreateFamily = true;
    },
    closeCreateFamily() {
      this.showCreateFamily = false;
    },
    toFamilyEdit() {
      this.$router.push({ name: 'FamilyEdit' });
    },
  },
};
</script>
