<template>
  <div class="family-edit">
    <div class="container">
      <div v-for="(family, index) in this.familyList" :key="index">
        <div>{{ family.name }}</div>
        <div>{{ family.birthday }}</div>
        <button type="button" @click="openEditFamily(family)">編集</button>
        <button type="button" @click="deleteFamily(family._id)">削除</button>
      </div>
      <button type="button" @click="openCreateFamily">追加</button>
    </div>
    <ModalWindow @close="closeCreateFamily()" v-show="showCreateFamily">
      <h6>家族を追加</h6>
      <table>
        <tr>
          <td>名前</td>
          <td>
            <div><input type="text" v-model="inputFamily.name" requir /></div>
          </td>
        </tr>
        <tr>
          <td>生年月日</td>
          <td>
            <div><input type="date" v-model="inputFamily.birthday" required /></div>
          </td>
        </tr>
      </table>

      <template slot="footer">
        <button @click="createFamily()">決定</button>
        <button @click="closeCreateFamily()">閉じる</button>
      </template>
    </ModalWindow>
    <ModalWindow @close="closeEditFamily()" v-show="showEditFamily">
      <h6>家族を追加</h6>
      <table>
        <tr>
          <td>名前</td>
          <td>
            <div><input type="text" v-model="inputFamily.name" required /></div>
          </td>
        </tr>
        <tr>
          <td>生年月日</td>
          <td>
            <div><input type="date" v-model="inputFamily.birthday" required /></div>
          </td>
        </tr>
      </table>

      <template slot="footer">
        <button @click="editFamily()">決定</button>
        <button @click="closeEditFamily()">閉じる</button>
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
      showCreateFamily: false,
      showEditFamily: false,
      familyList: [],
      inputFamily: [],
      family: [],
      id: '',
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
      console.log(family.name);
      this.id = family._id;
      this.inputFamily.name = family.name;
      this.inputFamily.birthday = family.birthday;
      this.showEditFamily = true;
    },
    closeCreateFamily() {
      this.family = [];
      this.showCreateFamily = false;
    },
    closeEditFamily() {
      this.showEditFamily = false;
    },
    createFamily() {
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
