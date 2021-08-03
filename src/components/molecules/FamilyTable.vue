<template>
  <table>
    <thead>
      <tr>
        <th>名前</th>
        <th v-for="index of 10" :key="index">{{ year + index - 1 }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(family, index) in this.family" :key="index">
        <td>{{ family.name }}</td>
        <td v-for="n of 10" :key="n">{{ calculateAge(family.birthday, n - 1) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import moment from 'moment';

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
  },
  methods: {
    calculateAge(birthday, n) {
      return `${this.year - moment(birthday).year() + n}歳`;
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
