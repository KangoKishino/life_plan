<template>
  <div class="box-container">
    <table class="margin">
      <thead>
        <tr>
          <th>収入</th>
          <th v-for="index of 10" :key="index">{{ year + index - 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(family, index) in this.family" :key="index">
          <td>{{ family.name }}</td>
          <td v-for="n of 10" :key="n">
            {{ calculateIncome(family._id, year + n - 1) }}
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
</template>

<script>
export default {
  props: {
    year: {
      type: Number,
      required: true,
    },
    family: {
      type: Array,
      required: true,
    },
    incomeList: {
      type: Array,
      required: true,
    },
    totalIncome: {
      type: Number,
    },
  },
  methods: {
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

.box-container {
  display: flex;
}
.margin {
  margin-right: 5px;
}
</style>
