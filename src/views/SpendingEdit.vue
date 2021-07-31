<template>
  <div class="spending-edit">
    <div class="container">
      <h5>家の支出</h5>
      <div v-for="(home, index) in this.homeSpendingList" :key="`first-${index}`">
        <div>{{ home.year }}</div>
        <div>{{ home.price }}</div>
        <Button @myClick="openEditSpending(home)" class="btn-primary" label="編集" />
        <Button @myClick="deleteSpending(home._id)" class="btn-danger" label="削除" />
      </div>
      <hr />
      <h5>車の支出</h5>
      <div v-for="(car, index) in this.carSpendingList" :key="`second-${index}`">
        <div>{{ car.year }}</div>
        <div>{{ car.price }}</div>
        <Button @myClick="openEditSpending(car)" class="btn-primary" label="編集" />
        <Button @myClick="deleteSpending(car._id)" class="btn-danger" label="削除" />
      </div>
      <Button @myClick="openCreateSpending" class="btn-primary" label="追加" />
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
            <div>
              <input type="number" v-model.number="purchaseYear" />
            </div>
          </td>
        </tr>
        <tr>
          <td>金額</td>
          <td>
            <div>
              <input type="number" v-model.number="purchasePrice" />
            </div>
          </td>
        </tr>
      </table>

      <p class="error" v-show="error.isError">{{ error.message }}</p>

      <template slot="footer">
        <Button @myClick="createSpending()" class="btn-primary" label="決定" />
        <Button @myClick="editCreateSpending()" class="btn-outline-primary" label="閉じる" />
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
            <div>
              <input type="number" v-model.number="purchaseYear" />
            </div>
          </td>
        </tr>
        <tr>
          <td>金額</td>
          <td>
            <div>
              <input type="number" v-model.number="purchasePrice" />
            </div>
          </td>
        </tr>
      </table>

      <p class="error" v-show="error.isError">{{ error.message }}</p>

      <template slot="footer">
        <Button @myClick="editSpending()" class="btn-primary" label="決定" />
        <Button @myClick="editEditSpending()" class="btn-outline-primary" label="閉じる" />
      </template>
    </ModalWindow>
  </div>
</template>

<script>
// @ is an alias to /src
import ModalWindow from '@/components/molecules/ModalWindow';
import { ipcRenderer } from 'electron';
import Button from '@/components/atoms/Button';

export default {
  components: {
    ModalWindow,
    Button,
  },
  data() {
    return {
      showCreateSpending: false,
      showEditSpending: false,
      selectedSpending: '家',
      options: ['家', '車'],
      purchasePrice: 0,
      purchaseYear: this.$store.getters.startYear,
      homeSpendingList: [],
      carSpendingList: [],
      id: [],
      error: {
        isError: false,
        message: '',
      },
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
      this.error.isError = false;
      this.error.message = '';
    },
    closeEditSpending() {
      this.showEditSpending = false;
      this.error.isError = false;
      this.error.message = '';
    },
    createSpending() {
      if (!this.selectedSpending) {
        this.error.isError = true;
        this.error.message = '種類は必須項目です';
        return;
      } else if (!this.purchaseYear) {
        this.error.isError = true;
        this.error.message = '年は必須項目です';
        return;
      } else if (this.purchaseYear < 1900 || this.purchaseYear > 2100) {
        this.error.isError = true;
        this.error.message = '適切な年を入力してください';
        return;
      } else if (!this.purchasePrice) {
        this.error.isError = true;
        this.error.message = '金額は必須項目です';
        return;
      } else if (this.purchasePrice < 0) {
        this.error.isError = true;
        this.error.message = '正の数を入力してください';
        return;
      }
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

<style lang="scss" scoped>
.error {
  color: red;
}
</style>
