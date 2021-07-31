<template>
  <table>
    <thead>
      <tr>
        <th>支出</th>
        <th v-for="index of 10" :key="index">{{ year + index - 1 }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>家</td>
        <td v-for="n of 10" :key="n">{{ spendingHome(year + n - 1) }}</td>
      </tr>
      <tr>
        <td>車</td>
        <td v-for="n of 10" :key="n">{{ spendingCar(year + n - 1) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    year: {
      type: Number,
      required: true,
    },
    homeList: {
      type: Array,
      required: true,
    },
    carList: {
      type: Array,
      required: true,
    },
  },
  methods: {
    spendingHome(year) {
      for (const home of this.homeList) {
        if (home.year === year) {
          return home.price;
        }
      }
      return;
    },
    spendingCar(year) {
      for (const car of this.carList) {
        if (car.year === year) {
          return car.price;
        }
      }
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
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

.margin {
  margin-right: 5px;
}
</style>
