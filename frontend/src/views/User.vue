<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 v-for="user in users" :key="user._id">
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">{{ user.id }}</h3>
                        </div>
                    </v-card-title>

                    <v-divider light></v-divider>

                    <v-card-title>
                        <div class="userInfo">
                            <div>이름: {{user.name}}</div>
                            <div>권한: {{user.level}}</div>
                            <div>나이: {{user.age}}</div>
                            <div>로그인 횟수: {{user.loginCnt}}</div>
                            <div>소금(_id): {{user._id}}</div>
                            <div>비밀번호: {{user.pwd}}</div>
                        </div>
                    </v-card-title>

                    <v-divider light></v-divider>

                    <v-card-actions>
                        <v-btn flat color="orange" @click="openUpdateModal(user)">수정</v-btn>
                        <v-btn flat color="error" @click="deleteUser(user._id)">삭제</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>

            <!-- <v-btn fab dark bottom right absolute color="indigo" @click="openModal()">
        <v-icon dark>add</v-icon>
            </v-btn>-->
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
                                    label="이름"
                                    hint="홍길동"
                                    persistent-hint
                                    required
                                    v-model="userName"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                    :items="userLevels"
                                    label="권한"
                                    required
                                    v-model="userLevel"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select :items="userAges" label="나이" required v-model="userAge"></v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <!-- <small>*indicates required field</small> -->
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="updateUser(); dialog = false">수정</v-btn>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                    <!-- <v-btn color="blue darken-1" flat @click="createUser(); dialog = false">Save</v-btn> -->
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
export default {
    data() {
        return {
            users: [],
            dialog: false,
            userAges: [],
            userAge: 0,
            userName: '',
            notifyMsg: ' ',
            snackbar: false,
            updateId: 0,

            userLevel: 0,
            userLevels: [0, 1, 2, 3]
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
            this.userLevel = user.level;
        },
        createUser() {
            const param = {
                name: this.userName,
                age: this.userAge
            };
            console.log('CREATE', this.userName, this.userAge);

            this.$axios
                .post(`${this.$apiRootPath}user/`, param)
                .then(res => {
                    this.openNotify(`${this.userName} 등록이 완료 되었습니다.`);
                    this.getUsers();
                })
                .catch(err => {
                    this.openNotify(err.message);
                });
        },
        getUsers() {
            this.$axios
                .get(`${this.$apiRootPath}manage/user/`)
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
                age: this.userAge,
                level: this.userLevel
            };

            this.$axios
                .put(`${this.$apiRootPath}manage/user/${this.updateId}`, param)
                .then(res => {
                    this.openNotify(`${this.userName} 수정이 완료 되었습니다.`);
                    this.getUsers();
                })
                .catch(err => {
                    this.openNotify(err.message);
                });
        },
        deleteUser(userId) {
            this.$axios
                .delete(`${this.$apiRootPath}manage/user/${userId}`)
                .then(res => {
                    this.openNotify(`${this.userName} 삭제가 완료 되었습니다.`);
                    this.getUsers();
                })
                .catch(err => {
                    this.openNotify(err.message);
                });
        }
    }
};
</script>

<style scoped>
.userInfo {
    text-align: left;
}
</style>

