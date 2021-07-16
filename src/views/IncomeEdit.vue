<template>
  <div class="income-edit">
    <div class="container">
      <h5>収入</h5>
      <div v-for="(family, index) in this.$store.getters.familyList" :key="index">
        <div>{{ family.name }}</div>
        <button type="button" @click="openEditIncome(family.name, index)">編集</button>
      </div>
    </div>
    <ModalWindow @close="closeCreateSpending()" v-show="showEditIncome">
      <h6>{{ selectedPerson }}の収入を追加</h6>
      <table>
        <tr>
          <td>開始年</td>
          <td>
            <div><input type="number" v-model="startYear" /></div>
          </td>
        </tr>
        <tr>
          <td>年収</td>
          <td>
            <div><input type="number" v-model="income" /></div>
          </td>
        </tr>
        <tr>
          <td>上昇率</td>
          <td>
            <div><input type="number" v-model="rate" />%</div>
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

export default {
  components: {
    ModalWindow,
  },
  data() {
    return {
      showEditIncome: false,
      startYear: this.$store.getters.startYear,
      income: 0,
      rate: 0,
      selectedPerson: '',
      id: '',
    };
  },
  methods: {
    openEditIncome(name, index) {
      this.selectedPerson = name;
      this.id = index;
      this.showEditIncome = true;
    },
    closeEditIncome() {
      this.showEditIncome = false;
    },
    editIncome() {
      this.$store
        .dispatch('editIncome', {
          name: this.selectedPerson,
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
};
</script>
