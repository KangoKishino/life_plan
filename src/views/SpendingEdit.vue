<template>
  <div class="spending-edit">
    <div class="container">
      <h5>家の支出</h5>
      <div v-for="(home, index) in this.homeSpendingList" :key="`first-${index}`">
        <div>{{ home.year }}</div>
        <div>{{ home.price }}</div>
        <button type="button" @click="openEditSpending(home)">編集</button>
        <button type="button" @click="deleteSpending(home._id)">削除</button>
      </div>
      <hr />
      <h5>車の支出</h5>
      <div v-for="(car, index) in this.carSpendingList" :key="`second-${index}`">
        <div>{{ car.year }}</div>
        <div>{{ car.price }}</div>
        <button type="button" @click="openEditSpending(car)">編集</button>
        <button type="button" @click="deleteSpending(car._id)">削除</button>
      </div>
      <button type="button" @click="openCreateSpending">追加</button>
    </div>
    <ModalWindow @close="closeCreateSpending()" v-show="showCreateSpending">
      <h6>支出を追加</h6>
      <table>
        <tr>
          <td>種類</td>
          <td>
            <div>
              <select v-model="selectedSpending">
                <option v-for="(option, index) in options" :value="option" :key="`first-${index}`">
                  {{ option }}
                </option>
              </select>
            </div>
          </td>
        </tr>
        <tr>
          <td>指定年</td>
          <td>
            <div><input type="number" v-model="purchaseYear" /></div>
          </td>
        </tr>
        <tr>
          <td>金額</td>
          <td>
            <div><input type="number" v-model="purchasePrice" /></div>
          </td>
        </tr>
      </table>

      <template slot="footer">
        <button @click="createSpending()">決定</button>
        <button @click="closeCreateSpending()">閉じる</button>
      </template>
    </ModalWindow>
    <ModalWindow @close="closeEditSpending()" v-show="showEditSpending">
      <h6>支出を追加</h6>
      <table>
        <tr>
          <td>種類</td>
          <td>
            <div>
              <select v-model="selectedSpending">
                <option v-for="(option, index) in options" :value="option" :key="`second-${index}`">
                  {{ option }}
                </option>
              </select>
            </div>
          </td>
        </tr>
        <tr>
          <td>指定年</td>
          <td>
            <div><input type="number" v-model="purchaseYear" /></div>
          </td>
        </tr>
        <tr>
          <td>金額</td>
          <td>
            <div><input type="number" v-model="purchasePrice" /></div>
          </td>
        </tr>
      </table>

      <template slot="footer">
        <button @click="editSpending()">決定</button>
        <button @click="closeEditSpending()">閉じる</button>
      </template>
    </ModalWindow>
  </div>
</template>

<script>
// @ is an alias to /src
import ModalWindow from '@/components/ModalWindow';
import { ipcRenderer } from 'electron';

export default {
  components: {
    ModalWindow,
  },
  data() {
    return {
      showCreateSpending: false,
      showEditSpending: false,
      selectedSpending: '',
      options: ['家', '車'],
      purchasePrice: 0,
      purchaseYear: this.$store.getters.startYear,
      homeSpendingList: [],
      carSpendingList: [],
      id: [],
    };
  },
  created() {
    this.$store.dispatch('getSpending');
  },
  methods: {
    openCreateSpending() {
      this.showCreateSpending = true;
    },
    openEditSpending(obj) {
      this.id = obj._id;
      this.purchaseYear = obj.year;
      this.purchasePrice = obj.price;
      this.showEditSpending = true;
    },
    closeCreateSpending() {
      this.showCreateSpending = false;
    },
    closeEditSpending() {
      this.showEditSpending = false;
    },
    createSpending() {
      this.$store
        .dispatch('createSpending', {
          spendingName: this.selectedSpending,
          spendingYear: this.purchaseYear,
          spendingPrice: this.purchasePrice,
        })
        .then(() => {
          this.closeCreateSpending();
        })
        .catch(() => {
          console.log('error');
        });
    },
    editSpending() {
      this.$store
        .dispatch('editSpending', {
          id: this.id,
          name: this.selectedSpending,
          year: this.purchaseYear,
          price: this.purchasePrice,
        })
        .then(() => {
          this.closeEditSpending();
        })
        .catch(() => {
          console.log('error');
        });
    },
    deleteSpending(id) {
      this.$store.dispatch('deleteSpending', {
        id: id,
      });
    },
  },
  mounted() {
    ipcRenderer.on('getSpending', (event, docs) => {
      this.homeSpendingList = [];
      this.carSpendingList = [];
      docs.forEach(element => {
        if (element.name === '家') {
          this.homeSpendingList.push(element);
        } else {
          this.carSpendingList.push(element);
        }
      });
    });
  },
};
</script>
