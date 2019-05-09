<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <!-- <v-flex xs12 sm3 v-for="(user, index) in users" :key="index"> -->
      <!-- <v-img :src="user.img" aspect-ratio="2.75"></v-img> -->

      <!-- card 목록 -->
      <!-- <v-flex xs12 sm3>
        <v-card>
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
      </v-flex>

      <v-flex xs12 sm3>
        <v-card>
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
      </v-flex>

      <v-flex xs12 sm3>
        <v-card>
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
      </v-flex>

      <v-flex xs12 sm3>
        <v-card>
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
      </v-flex>-->

      <v-flex xs12 sm6 md4 v-for="user in users" :key="user._id">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ user.name }}</h3>
              <div>{{ user.age }}</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="orange" @click="openUpdateModal(user)">수정</v-btn>
            <v-btn flat color="error" @click="deleteUser(user._id)">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-btn fab dark bottom right absolute color="indigo" @click="openModal()">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-layout>

    <!-- Modal -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                  v-model="userName"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select :items="userAges" label="Age*" required v-model="userAge"></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="updateUser(); dialog = false">수정</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="createUser(); dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Modal end-->

    <v-snackbar v-model="snackbar">
      {{ notifyMsg }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
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
      deleteModel: "",
      dialog: false,
      userAges: [],
      userAge: 0,
      userName: "",
      notifyMsg: " ",
      snackbar: false,
      updateId: 0
    };
  },
  mounted() {
    const userAges = [];
    let i = 0;
    while (i < 40) {
      userAges.push(i);
      i++;
    }

    this.userAges = userAges;
    this.getUsers();
  },
  methods: {
    openModal() {
      this.userName = '';
      this.userAge = '';
      this.dialog = true;
    },
    openNotify(msg) {
      this.snackbar = true;
      this.notifyMsg = msg;
    },
    openUpdateModal(user) {
      this.updateId = user._id;
      this.userName = user.name;
      this.userAge = user.age;
      this.dialog = true;
    },
    createUser() {
      const param = {
        name: this.userName,
        age: this.userAge
      };
      console.log('CREATE', this.userName, this.userAge);

      axios
        .post("http://localhost:3000/api/user/", param)
        .then(res => {
          this.openNotify(`${this.userName} 등록이 완료 되었습니다.`);
          this.getUsers();
        })
        .catch(err => {
          this.openNotify(err.message);
        });
    },
    getUsers() {
      axios
        .get("http://localhost:3000/api/user/")
        .then(res => {
          console.log(res);
          this.users = res.data.users;
        })
        .catch(err => {
          this.openNotify(err.message);
        });
    },
    updateUser() {
      const param = {
        name: this.userName,
        age: this.userAge
      };

      axios
        .put(`http://localhost:3000/api/user/${this.updateId}`, param)
        .then(res => {
          this.openNotify(`${this.userName} 수정이 완료 되었습니다.`);
          this.getUsers();
        })
        .catch(err => {
          this.openNotify(err.message);
        });
    },
    deleteUser(userId) {
      axios
        .delete(`http://localhost:3000/api/user/${userId}`)
        .then(res => {
          this.openNotify(`${this.userName} 삭제가 완료 되었습니다.`);
          this.getUsers();
        })
        .catch(err => {
          this.openNotify(err.message);
        });
    }
    // getUser() {
    //   axios
    //     .get("http://localhost:3000/api/user/")
    //     .then(res => {
    //       this.getModel = JSON.stringify(res.data);
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.error(err.message);
    //     });
    // },
    // postUser() {
    //   axios
    //     .post("http://localhost:3000/api/user/", {
    //       name: "가정",
    //       age: 22
    //     })
    //     .then(res => {
    //       this.postModel = JSON.stringify(res.data);
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.error(err.message);
    //     });
    // },
    // putUser(userId) {
    //   axios
    //     .put("http://localhost:3000/api/user/", {
    //       user: "put_user"
    //     })
    //     .then(res => {
    //       this.putModel = JSON.stringify(res.data);
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.error(err.message);
    //     });
    // },
    // deleteUser(userId) {
    //   axios
    //     .delete("http://localhost:3000/api/user/", {
    //       user: "delet_user"
    //     })
    //     .then(res => {
    //       this.deleteModel = JSON.stringify(res.data);
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.error(err.message);
    //     });
    // },
  }
};
</script>
