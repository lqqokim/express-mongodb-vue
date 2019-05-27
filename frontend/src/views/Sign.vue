<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login form</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <!-- <v-tooltip bottom>
                    <v-btn icon large :href="source" target="_blank" slot="activator">
                      <v-icon large>code</v-icon>
                    </v-btn>
                    <span>Source</span>
                        </v-tooltip>-->
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                prepend-icon="person"
                                v-model="form.id"
                                label="아이디"
                                type="text"
                            ></v-text-field>
                            <v-text-field
                                prepend-icon="lock"
                                v-model="form.pwd"
                                label="비밀번호"
                                type="password"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="signIn">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                id: '',
                pwd: ''
            }
        };
    },
    methods: {
        signIn() {
            axios
                .post(`${this.$apiRootPath}sign/in`, this.form)
                .then(result => {
                    if (!result.data.success)
                        return console.error(result.data.msg);
                    localStorage.setItem('token', result.data.token);
                    this.$store.commit('getToken');
                    this.$router.push('/');
                    // location.href = '/'
                })
                .catch(e => console.error(e.message));
        }
    }
};
</script>