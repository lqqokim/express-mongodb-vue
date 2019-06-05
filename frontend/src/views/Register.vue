<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Register Form</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <!-- <v-tooltip bottom>
                <v-btn icon large :href="source" target="_blank" slot="activator">
                  <v-icon large>code</v-icon>
                </v-btn>
                <span>Source</span>
                        </v-tooltip>-->
                    </v-toolbar>
                    <v-card-text>
                        <form>
                            <v-text-field
                                v-model="form.id"
                                v-validate="'required|min:4|max:20'"
                                :counter="20"
                                :error-messages="errors.collect('id')"
                                label="아이디"
                                data-vv-name="id"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="form.pwd"
                                v-validate="'required|min:4|max:40'"
                                :counter="40"
                                :error-messages="errors.collect('pwd')"
                                label="비밀번호"
                                data-vv-name="pwd"
                                required
                                type="password"
                            ></v-text-field>
                            <v-text-field
                                v-model="form.name"
                                v-validate="'required|min:1|max:40'"
                                :counter="40"
                                :error-messages="errors.collect('name')"
                                label="이름"
                                data-vv-name="name"
                                required
                            ></v-text-field>
                            <v-checkbox
                                v-model="agree"
                                v-validate="'required'"
                                :error-messages="errors.collect('agree')"
                                value="1"
                                label="이용약관"
                                data-vv-name="agree"
                                type="checkbox"
                                required
                            ></v-checkbox>

                            <v-btn color="primary" @click="submit">가입</v-btn>
                            <v-btn color="secondary" @click="clear">초기화</v-btn>
                        </form>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>

        <v-snackbar v-model="sb.act">
            {{ sb.msg }}
            <v-btn :color="sb.color" flat @click="sb.act = false">닫기</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
import ko from 'vee-validate/dist/locale/ko';

export default {
    $_veeValidate: {
        validator: 'new'
    },

    data: () => ({
        form: {
            id: '',
            pwd: '',
            name: ''
        },
        sb: {
            act: false,
            color: 'warning',
            msg: ''
        },
        snackbar: true,
        agree: null,
        checkbox: null,
        dictionary: {
            messages: ko.messages,
            attributes: {
                // email: "E-mail Address",
                id: '아이디 ',
                pwd: '비밀번호 ',
                name: '이름 ',
                agree: '이용약관 '
                // custom attributes
            },
            custom: {
                // name: {
                //   required: () => "Name can not be empty",
                //   max: "The name field may not be greater than 10 characters"
                //   // custom messages
                // },
                // select: {
                //   required: "Select field is required"
                // }
            }
        }
    }),

    mounted() {
        this.$validator.localize('ko', this.dictionary);
        // this.$validator.localize("ko", ko);
    },

    methods: {
        submit() {
            this.$validator
                .validateAll()
                .then(result => {
                    if (!result) throw new Error('필수항목을 다 채워주세요');
                    return this.$axios.post('register', this.form);
                })
                .then(result => {
                    if (!result.data.success) throw new Error(r.data.msg);
                    this.$store.commit('pop', {
                        msg: '가입 완료 되었습니다',
                        color: 'success'
                    });
                    this.$router.push('/sign');
                })
                .catch(err => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                });
        },
        clear() {
            this.form.id = '';
            this.form.pwd = '';
            this.form.name = '';
            this.agree = null;
            this.$validator.reset();
        },
        pop(msg, cl) {
            this.sb.act = true;
            this.sb.msg = msg;
            this.sb.color = cl;
        }
    }
};
</script>