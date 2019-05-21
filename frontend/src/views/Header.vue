<template>
  <v-container>
    <v-btn @click="apiWithToken">토큰과 함께 전송</v-btn>
    <v-btn @click="apiWithTrash">이상한 문자와 함께 전송</v-btn>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  methods: {
    // token과 함께 api 호출해서 인증이되면 data를 가져온다.
    apiWithToken() {
      const token = localStorage.getItem("token");
      axios
        .get(`${this.$apiRootPath}test`, { headers: { Authorization: token } })
        .then(r => console.log(r.data))
        .catch(e => console.log(e.message));
    },
    apiWithTrash() {
      axios
        .get(`${this.$apiRootPath}test`, {headers: { Authorization: "abcdefghijk" } })
        .then(r => console.log(r.data))
        .catch(e => console.log(e.message));
    }
  }
};
</script>