<script>
import { Bar, mixins } from 'vue-chartjs';

export default {
  extends: Bar,
  mixins: [mixins.reactiveData],
  props: {
    year: Number,
    income: Array,
    homeSpending: Array,
    carSpending: Array,
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
    // this.renderChart(this.chartdata, this.options);
    this.render();
  },
  watch: {
    year() {
      this.render();
    },
    income() {
      this.render();
    },
    homeSpending() {
      this.render();
    },
    carSpending() {
      this.render();
    },
  },
  methods: {
    render() {
      this.chartData = {
        labels: this.createYearList(),
        datasets: [
          {
            label: '収支',
            data: [95, 70, 80, 65, 69, 80, 100, -100, 72, 81, 45, 70],
            backgroundColor: 'lightblue',
          },
        ],
      };
    },
    createYearList() {
      let list = [];
      for (let i = 0; i < 10; i++) {
        list.push(this.year + i);
      }
      return list;
    },
  },
};
</script>
