<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <!-- <v-flex xs12 sm3 v-for="(user, index) in users" :key="index"> -->
      <v-flex xs12 sm3>
        <v-card>
          <!-- <v-img :src="user.img" aspect-ratio="2.75"></v-img> -->

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">get</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-textarea v-model="getModel"></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-btn flat color="orange" @click="getUser()">submit</v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <!-- <v-img :src="user.img" aspect-ratio="2.75"></v-img> -->

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">post</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-textarea v-model="postModel"></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-btn flat color="orange" @click="postUser()">submit</v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <!-- <v-img :src="user.img" aspect-ratio="2.75"></v-img> -->

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">put</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-textarea v-model="putModel"></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-btn flat color="orange" @click="putUser()">submit</v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <!-- <v-img :src="user.img" aspect-ratio="2.75"></v-img> -->

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">delete</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-textarea v-model="deleteModel"></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-btn flat color="orange" @click="deleteUser()">submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      getModel: "",
      postModel: "",
      putModel: "",
      deleteModel: ""
    };
  },
  mounted() {},
  methods: {
    getUser() {
      axios
        .get("http://localhost:3000/api/user/")
        .then(res => {
          this.getModel = JSON.stringify(res.data);
          console.log(res);
        })
        .catch(err => {
          console.error(err.message);
        });
    },
    postUser() {
      axios
        .post("http://localhost:3000/api/user/", {
          name: '가정', age: 22
        })
        .then(res => {
          this.postModel = JSON.stringify(res.data);
          console.log(res);
        })
        .catch(err => {
          console.error(err.message);
        });
    },
    putUser() {
      axios
        .put("http://localhost:3000/api/user/", {
          user: 'put_user'
        })
        .then(res => {
          this.putModel = JSON.stringify(res.data);
          console.log(res);
        })
        .catch(err => {
          console.error(err.message);
        });
    },
    deleteUser() {
      axios
        .delete("http://localhost:3000/api/user/", {
          user: 'delet_user'
        })
        .then(res => {
          this.deleteModel = JSON.stringify(res.data);
          console.log(res);
        })
        .catch(err => {
          console.error(err.message);
        });
    }
  }
};
</script>
