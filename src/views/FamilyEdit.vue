<template>
  <div class="family-edit">
    <div class="container">
      <div v-for="(family, index) in this.$store.getters.familyList" :key="index">
        <div>{{ family.name }}</div>
        <div>{{ family.birthday }}</div>
        <button type="button" @click="openEditFamily()">編集</button>
        <button type="button" @click="deleteFamily(index)">削除</button>
      </div>
      <button type="button" @click="openCreateFamily">追加</button>
    </div>
    <ModalWindow @close="closeCreateFamily()" v-show="showCreateFamily">
      <h6>家族を追加</h6>
      <table>
        <tr>
          <td>名前</td>
          <td>
            <div><input type="text" v-model="family.name" /></div>
          </td>
        </tr>
        <tr>
          <td>生年月日</td>
          <td>
            <div><input type="date" v-model="family.birthday" value="1980-04-01" /></div>
          </td>
        </tr>
      </table>

      <template slot="footer">
        <button @click="createFamily()">決定</button>
        <button @click="closeCreateFamily()">閉じる</button>
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
      showCreateFamily: false,
      showEditFamily: false,
      family: [],
    };
  },
  methods: {
    openCreateFamily() {
      this.showCreateFamily = true;
    },
    openEditFamily() {
      this.showEditFamily = true;
    },
    closeCreateFamily() {
      this.showCreateFamily = false;
    },
    closeEditFamily() {
      this.showEditFamily = false;
    },
    createFamily() {
      this.$store
        .dispatch('createFamily', {
          familyName: this.family.name,
          familyBirthday: this.family.birthday,
        })
        .then(() => {
          this.closeCreateFamily();
        })
        .catch(() => {
          console.log('error');
        });
    },
    deleteFamily(index) {
      this.$store.dispatch('deleteFamily', {
        deleteIndex: index,
      });
    },
  },
};
</script>
