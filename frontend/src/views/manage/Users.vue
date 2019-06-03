<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
            <v-flex sx12>
                <v-btn color="primary" @click="pop('click test')">sss</v-btn>
            </v-flex>
            <v-flex xs12 sm6 md4 v-for="user in users" :key="user._id">
                <user-card :user="user" @openUpdateModal="pop"/>
            </v-flex>
        </v-layout>
        <v-snackbar v-model="sb.act">{{ sb.msg }}</v-snackbar>
    </v-container>
</template>

<script>
import UserCard from '@/components/User'; //@는 src경로

export default {
    data() {
        return {
            users: [],
            sb: {
                act: false,
                msg: 'message'
            },
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
    components: {
        UserCard
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
        pop(msg) {
            this.sb.act = true;
            this.sb.msg = msg;
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
        // openModal() {
        //     this.userName = '';
        //     this.userAge = '';
        //     this.dialog = true;
        // },
        // openNotify(msg) {
        //     this.snackbar = true;
        //     this.notifyMsg = msg;
        // },
        // openUpdateModal(user) {
        //     this.updateId = user._id;
        //     this.userName = user.name;
        //     this.userAge = user.age;
        //     this.dialog = true;
        //     this.userLevel = user.level;
        // },
        // createUser() {
        //     const param = {
        //         name: this.userName,
        //         age: this.userAge
        //     };
        //     console.log('CREATE', this.userName, this.userAge);

        //     this.$axios
        //         .post(`${this.$apiRootPath}user/`, param)
        //         .then(res => {
        //             this.openNotify(`${this.userName} 등록이 완료 되었습니다.`);
        //             this.getUsers();
        //         })
        //         .catch(err => {
        //             this.openNotify(err.message);
        //         });
        // },
    }
};
</script>

<style scoped>
.userInfo {
    text-align: left;
}
</style>

