<template>
    <v-card>
        <v-card-title primary-title>
            <h3 class="headline mb-0">{{user.id}}</h3>
        </v-card-title>

        <v-divider light></v-divider>

        <v-card-text>
            <div class="userInfo">
                <div>이름: {{user.name}}</div>
                <div>권한: {{user.level}}</div>
                <div>나이: {{user.age}}</div>
                <div>로그인 횟수: {{user.loginCnt}}</div>
                <div>소금(_id): {{user._id}}</div>
                <div>비밀번호: {{user.pwd}}</div>
            </div>
        </v-card-text>

        <v-divider light></v-divider>

        <v-card-actions>
            <v-btn flat color="orange" @click="openUpdateModal(user)">수정</v-btn>
            <v-btn flat color="error" @click="deleteUser(user._id)">삭제</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: ['user'],
    methods: {
        openUpdateModal(user) {
            this.$emit('openUpdateModal', 'to mother')
        },
        
    }
};
</script>

<style scoped>
.userInfo {
    text-align: left;
}
</style>
