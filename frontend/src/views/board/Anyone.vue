<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-img
                        class="white--text"
                        height="70px"
                        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
                    >
                        <v-container fill-height fluid>
                            <v-layout fill-height>
                                <v-flex xs6 align-end flexbox>
                                    <span class="headline">{{board.name}}</span>
                                </v-flex>
                                <v-flex xs6 align-end flexbox>
                                    <span>{{board.rmk}}</span>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-img>
                </v-card>
            </v-flex>
            <!-- <v-flex xs12 sm6 md4 v-for="article in articles" :key="article._id">{{article}}</v-flex> -->
            <v-flex xs12>
                <v-data-table
                    :headers="headers"
                    :items="articles"
                    :total-items="totalDesserts"
                    :pagination.sync="pagination"
                    :loading="loading"
                    rows-per-page-text
                    disable-initial-sort
                    class="elevation-1"
                >
                    <template v-slot:items="props">
                        <!-- <td>{{ props.item.name }}</td> -->
                        <td :class="headers[0].class">{{ id2date(props.item._id) }}</td>
                        <td :class="headers[1].class">
                            <a @click="readArticle(props.item)">{{ props.item.title }}</a>
                        </td>
                        <td
                            :class="headers[2].class"
                        >{{ props.item._user ? props.item._user.id : '손님' }}</td>
                        <td :class="headers[3].class">{{ props.item.cnt.view }}</td>
                        <td :class="headers[4].class">{{ props.item.cnt.like }}</td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>

        <v-btn color="pink" dark small absolute bottom right fab @click="addDialog()">
            <v-icon>add</v-icon>
        </v-btn>

        <v-dialog v-model="isOpen" persistent max-width="500px">
            <v-card v-if="!dialogStatus">
                <v-card-title>
                    <span class="headline">{{selectedArticle.title}}</span>
                </v-card-title>
                <v-card-text>{{selectedArticle.content}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning darken-1" flat @click.native="modDialog()">수정</v-btn>
                    <v-btn color="error darken-1" flat @click.native="ca=true">삭제</v-btn>
                    <v-btn color="secondary darken-1" flat @click.native="isOpen = false">닫기</v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-card-text v-if="ca">
                        <v-alert v-model="ca" type="warning">
                            <h4>정말 진행 하시겠습니까?</h4>
                            <v-btn color="error" @click="deleteArticle()">확인</v-btn>
                            <v-btn color="secondary" @click="ca=false">취소</v-btn>
                        </v-alert>
                    </v-card-text>
                </v-card-text>
            </v-card>
            <v-card v-else>
                <v-card-title>
                    <span class="headline">글 {{(dialogStatus === 1) ? '작성' : '수정'}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field
                                    label="제목"
                                    persistent-hint
                                    required
                                    v-model="form.title"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea
                                    label="내용"
                                    persistent-hint
                                    required
                                    v-model="form.content"
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green darken-1"
                        flat
                        @click="(dialogStatus === 1) ? addArticle() : modifyArticle()"
                    >확인</v-btn>
                    <v-btn color="red darken-1" flat @click.native="isOpen = false">취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.act">
            {{ snackbar.msg }}
            <v-btn :color="snackbar.color" flat @click="snackbar.act = false">닫기</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script>
import BoardCard from '@/components/manage/BoardCard';

export default {
    components: { BoardCard },
    data() {
        return {
            board: {
                name: '로딩중...',
                rmk: '무엇?'
            },
            articles: [],
            isOpen: false,
            levels: [0, 1, 2, 3],
            form: {
                title: '',
                content: ''
            },
            snackbar: {
                act: false,
                msg: '',
                color: 'error'
            },
            dlRead: false,
            rd: {
                title: '',
                content: ''
            },
            // table관련
            totalDesserts: 0,
            desserts: [],
            loading: false,
            pagination: {},
            headers: [
                {
                    text: '날짜',
                    value: '_id',
                    // align: 'left',
                    sortable: true,
                    class: 'hidden-sm-and-down'
                },
                {
                    text: '제목',
                    value: 'title',
                    // align: 'left',
                    sortable: true
                },
                {
                    text: '글쓴이',
                    value: '_user',
                    // align: 'left',
                    sortable: false
                },
                {
                    text: '조회수',
                    value: 'cnt.view',
                    // align: 'left',
                    sortable: true
                },
                {
                    text: '추천',
                    value: 'cnt.like',
                    // align: 'left',
                    sortable: true
                }
            ],
            dialogStatus: 0, // 0: read, 1: write, 2: modify
            selectedArticle: {},
            ca: false
        };
    },
    mounted() {
        this.getBoard();
    },
    methods: {
        addDialog() {
            this.isOpen = true;
            this.dialogStatus = 1;
            this.form = {
                title: '',
                content: ''
            };
        },
        modDialog() {
            this.dialogStatus = 2;
            this.form = {
                title: this.selectedArticle.title,
                content: this.selectedArticle.content
            };
        },
        getBoard() {
            // 게시판을 가져온다
            this.$axios
                .get('board/아무나')
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg);
                    this.board = data.d;
                    this.getArticles();
                })
                .catch(e => {
                    this.pop(e.message, 'error');
                });
        },
        addArticle() {
            // 게시글을 추가한다
            if (!this.form.title)
                return this.pop('제목을 작성해주세요', 'warning');
            if (!this.form.content)
                return this.pop('내용을 작성해주세요', 'warning');
            this.$axios
                .post(`article/${this.board._id}`, this.form)
                .then(r => {
                    this.isOpen = false;
                    this.getArticles();
                })
                .catch(e => {
                    this.pop(e.message, 'error');
                });
        },
        getArticles() {
            // 게시글 목록을 가져온다
            if (this.loading) return;
            this.loading = true;
            this.$axios
                .get(`article/list/${this.board._id}`)
                .then(({ data }) => {
                    this.articles = data.d;
                    console.log('articles => ', this.articles);
                    this.loading = false;
                })
                .catch(e => {
                    this.pop(e.message, 'error');
                    this.loading = false;
                });
        },
        readArticle(article) {
            this.selectedArticle = article;
            this.loading = true;
            this.$axios
                .get(`article/read/${article._id}`)
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg);
                    console.log(data);
                    this.dialogStatus = 0;
                    this.isOpen = true;
                    this.selectedArticle.content = data.d.content;
                    this.selectedArticle.cnt.view = data.d.cnt.view;
                    this.loading = false;
                })
                .catch(e => {
                    this.pop(e.message, 'error');
                    this.loading = false;
                });
        },
        modifyArticle() {
            if (!this.form.title)
                return this.pop('제목을 작성해주세요', 'warning');
            if (!this.form.content)
                return this.pop('내용을 작성해주세요', 'warning');
            if (
                this.selectedArticle.title === this.form.title &&
                this.selectedArticle.content === this.form.content
            )
                return this.pop('변경된 내용이 없습니다', 'warning');
            this.$axios
                .put(`article/${this.selectedArticle._id}`, this.form)
                .then(({ data }) => {
                    this.isOpen = false;
                    if (!data.success) throw new Error(data.msg);
                    this.selectedArticle.title = data.d.title;
                    this.selectedArticle.content = data.d.content;
                    // this.list()
                })
                .catch(e => {
                    this.pop(e.message, 'error');
                });
        },
        deleteArticle() {
            this.$axios
                .delete(`article/${this.selectedArticle._id}`)
                .then(({ data }) => {
                    this.isOpen = false;
                    if (!data.success) throw new Error(data.msg);
                    this.getArticles();
                })
                .catch(e => {
                    this.pop(e.message, 'error');
                });
        },
        id2date(val) {
            // id값에서 날짜를 가져오기위함
            if (!val) return '잘못된 시간 정보';
            return new Date(
                parseInt(val.substring(0, 8), 16) * 1000
            ).toLocaleString();
        },
        pop(msg, color) {
            this.snackbar.act = true;
            this.snackbar.msg = msg;
            this.snackbar.color = color;
        }
    }
};
</script>