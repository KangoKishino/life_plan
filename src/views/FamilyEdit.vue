<template>
  <div class="family-edit">
    <div class="container">
      <div v-for="(family, index) in this.familyList" :key="index">
        <div>{{ family.name }}</div>
        <div>{{ family.birthday }}</div>
        <Button @myClick="openEditFamily(family)" class="btn-primary" label="編集" />
        <Button @myClick="deleteFamily(family._id)" class="btn-danger" label="削除" />
      </div>
      <Button @myClick="openCreateFamily" class="btn-primary" label="追加" />
    </div>
    <ModalWindow @close="closeCreateFamily()" v-show="showCreateFamily">
      <h6>家族を追加</h6>
      <table>
        <tr>
          <td>名前</td>
          <td>
            <div>
              <input type="text" v-model="inputFamily.name" />
            </div>
          </td>
        </tr>
        <tr>
          <td>生年月日</td>
          <td>
            <div>
              <input type="date" v-model="inputFamily.birthday" />
            </div>
          </td>
        </tr>
      </table>

      <p class="error" v-show="error.isError">{{ error.message }}</p>

      <template slot="footer">
        <Button @myClick="createFamily" class="btn-primary" label="決定" />
        <Button @myClick="closeCreateFamily" class="btn-outline-primary" label="閉じる" />
      </template>
    </ModalWindow>
    <ModalWindow @close="closeEditFamily()" v-show="showEditFamily">
      <h6>家族を追加</h6>
      <p class="error" v-show="error.isError">{{ error.message }}</p>

      <table>
        <tr>
          <td>名前</td>
          <td>
            <div>
              <input type="text" v-model="inputFamily.name" />
              <p class="error" v-show="error.name">{{ error.message }}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td>生年月日</td>
          <td>
            <div>
              <input type="date" v-model="inputFamily.birthday" />
            </div>
          </td>
        </tr>
      </table>

      <p class="error" v-show="error.isError">{{ error.message }}</p>

      <template slot="footer">
        <Button @myClick="editFamily" class="btn-primary" label="決定" />
        <Button @myClick="closeEditFamily" class="btn-outline-primary" label="閉じる" />
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
      showCreateFamily: false,
      showEditFamily: false,
      familyList: [],
      inputFamily: {
        name: '',
        birthday: '',
      },
      family: [],
      id: '',
      error: {
        isError: false,
        message: '',
      },
    };
  },
  created() {
    this.$store.dispatch('getPage');
  },
  methods: {
    openCreateFamily() {
      this.inputFamily = [];
      this.showCreateFamily = true;
    },
    openEditFamily(family) {
      this.id = family._id;
      this.inputFamily.name = family.name;
      this.inputFamily.birthday = family.birthday;
      this.showEditFamily = true;
    },
    closeCreateFamily() {
      this.family = [];
      this.showCreateFamily = false;
      this.error.isError = false;
    },
    closeEditFamily() {
      this.error.isError = false;
      this.showEditFamily = false;
    },
    createFamily() {
      const minDate = new Date('1990-01-01');
      const maxDate = new Date('2100-01-01');
      const birthday = new Date(this.inputFamily.birthday);
      if (!this.inputFamily.name) {
        this.error.isError = true;
        this.error.message = '名前は必須項目です';
        return;
      } else if (this.inputFamily.name.length > 20) {
        this.error.isError = true;
        this.error.message = '名前の最大文字数は20文字です';
        return;
      } else if (!this.inputFamily.birthday) {
        this.error.isError = true;
        this.error.message = '生年月日は必須項目です';
        return;
      } else if (minDate.valueOf() > birthday.valueOf() || maxDate.valueOf() < birthday.valueOf) {
        this.error.isError = true;
        this.error.message = '正しい生年月日を入力してください';
        return;
      }
      this.$store
        .dispatch('createFamily', {
          familyName: this.inputFamily.name,
          familyBirthday: this.inputFamily.birthday,
        })
        .then(() => {
          this.closeCreateFamily();
        })
        .catch(() => {
          console.log('error');
        });
    },
    editFamily() {
      this.$store.dispatch('editFamily', {
        id: this.id,
        name: this.inputFamily.name,
        birthday: this.inputFamily.birthday,
      });
    },
    deleteFamily(id) {
      this.$store.dispatch('deleteFamily', { id: id });
    },
  },
  mounted() {
    ipcRenderer.on('getPage', (event, docs) => {
      this.familyList = docs;
    });
  },
};
</script>

<style lang="scss" scoped>
.error {
  color: red;
}
</style>
