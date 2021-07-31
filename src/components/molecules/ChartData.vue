<script>
import { Bar, mixins } from 'vue-chartjs';

export default {
  // extends: Bar,
  mixins: [Bar, mixins.reactiveData],
  props: {
    summarizeData: {
      type: Object,
    },
  },
  data() {
    return {
      options: {
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
    };
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      let newList = this.createSavings();
      this.chartData = {
        labels: this.summarizeData.year,
        datasets: [
          {
            label: '収支',
            data: newList,
            backgroundColor: 'lightblue',
          },
        ],
      };
      let chartData = JSON.parse(JSON.stringify(this.chartData));
      this.chartData = chartData;
    },
    createSavings() {
      let list = [];
      for (let i = 0; i < 10; i++) {
        const saving =
          this.summarizeData.income[i] -
          this.summarizeData.carSpending[i] -
          this.summarizeData.homeSpending[i];
        list.push(saving);
      }
      return list;
    },
  },
};
</script>
