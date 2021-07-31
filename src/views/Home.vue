<template>
  <div class="home">
    <div class="container">
      <Button @myClick="createPDF" class="btn-primary" label="PDF出力" />
      <div>{{ this.startYear }}年から10年間のライフイベント</div>
      <Button @myClick="openEditYear" class="btn-primary" label="変更" />
      <ChartData :summarizeData="summarizeData" :key="changeTrigger" />
      <Button @myClick="toFamilyEdit" class="btn-primary" label="作成" />
      <FamilyTable :year="startYear" :family="family" :incomeList="incomeList" />
      <Button @myClick="toSpendingEdit" class="btn-primary" label="支出の登録" />
      <SpendingTable :year="startYear" :homeList="homeSpendingList" :carList="carSpendingList" />
      <Button @myClick="toIncomeEdit" class="btn-primary" label="収入の登録" />
      <IncomeTable
        :year="startYear"
        :family="family"
        :incomeList="incomeList"
        :totalIncome="totalIncome"
      />
    </div>
    <ModalWindow @close="closeEditYear()" v-show="showEditYear">
      <h6>年の変更</h6>
      <div><input type="number" v-model.number="startYear" />年</div>
      <template slot="footer">
        <Button @myClick="closeEditYear()" class="btn-primary" label="閉じる" />
      </template>
    </ModalWindow>
  </div>
</template>

<script>
// @ is an alias to /src
import ModalWindow from '@/components/molecules/ModalWindow';
import ChartData from '@/components/molecules/ChartData';
import { ipcRenderer } from 'electron';
import Button from '@/components/atoms/Button';
import FamilyTable from '@/components/molecules/FamilyTable';
import SpendingTable from '@/components/molecules/SpendingTable';
import IncomeTable from '@/components/molecules/IncomeTable';

export default {
  components: {
    ChartData,
    ModalWindow,
    Button,
    FamilyTable,
    SpendingTable,
    IncomeTable,
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
