<template>
    <v-container
        fluid
        :grid-list-md="!$vuetify.breakpoint.xs"
        :class="$vuetify.breakpoint.xs ? 'pa-0' : ''"
    >
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title class="headline">
                        <v-tooltip bottom>
                            <span slot="activator">{{board.name}}</span>
                            <span>{{board.rmk}}</span>
                        </v-tooltip>
                        <v-spacer></v-spacer>
                        <v-text-field
                            label="검색"
                            append-icon="search"
                            v-model="params.search"
                            clearable
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="articles"
                        :total-items="pagination.totalItems"
                        :pagination.sync="pagination"
                        rows-per-page-text
                        :loading="loading"
                        class="text-no-wrap"
                        disable-initial-sort
                    >
                        <template slot="items" slot-scope="props">
                            <td :class="headers[0].class">{{ id2date(props.item._id)}}</td>
                            <td :class="headers[1].class">
                                <a @click="getArticle(props.item)">{{ props.item.title }}</a>
                            </td>
                            <td
                                :class="headers[2].class"
                            >{{ props.item._user ? props.item._user.id : '손님' }}</td>
                            <td :class="headers[3].class">{{ props.item.cnt.view }}</td>
                            <td :class="headers[4].class">{{ props.item.cnt.like }}</td>
                        </template>

                        <template slot="actions-prepend"></template>
                        <template slot="actions-append"></template>
                    </v-data-table>
                    <!-- <div class="text-xs-center pt-2">
                    <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
                    </div>-->
                </v-card>
            </v-flex>
        </v-layout>

        <v-btn color="pink" dark small absolute bottom right fab @click="addDialog">
            <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" persistent max-width="500px" :fullscreen="$vuetify.breakpoint.xs">
            <v-card v-if="!dlMode">
                <v-card-title>
                    <span class="headline">{{selectedArticle.title}}</span>
                </v-card-title>
                <v-card-text>{{selectedArticle.content}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning darken-1" flat @click.native="modDialog()">수정</v-btn>
                    <v-btn color="error darken-1" flat @click.native="ca=true">삭제</v-btn>
                    <v-btn color="secondary darken-1" flat @click.native="dialog = false">닫기</v-btn>
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
                    <span class="headline">글 {{(dlMode === 1) ? '작성' : '수정'}}</span>
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
                        @click="(dlMode === 1) ? addArticle() : updateArticle()"
                    >확인</v-btn>
                    <v-btn color="red darken-1" flat @click.native="dialog = false">취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import boardCard from '@/components/manage/BoardCard';

export default {
    components: { boardCard },
    data() {
        return {
            board: {
                name: '로딩중...',
                rmk: '무엇?'
            },
            articles: [],
            dialog: false,
            lvs: [0, 1, 2, 3],
            form: {
                title: '',
                content: ''
            },
            headers: [
                {
                    text: '날짜',
                    value: '_id',
                    sortable: true,
                    class: 'hidden-sm-and-down'
                },
                { text: '제목', value: 'title', sortable: true, align: 'left' },
                { text: '글쓴이', value: '_user', sortable: false },
                { text: '조회수', value: 'cnt.view', sortable: true },
                { text: '추천', value: 'cnt.like', sortable: true }
            ],
            loading: false,
            itemTotal: 0,
            pagination: {},
            getTotalPage: 1,
            dlMode: 0, // 0: read, 1: write, 2: modify
            selectedArticle: {},
            ca: false,
            params: {
                draw: 0,
                search: '',
                skip: 0,
                sort: '_id',
                order: 0,
                limit: 1
            },
            timeout: null
        };
    },
    mounted() {
        this.getBoard();
    },
    watch: {
        pagination: {
            handler(a) {
                console.log('pagination', this.pagination);
                this.getArticles();
            },
            deep: true
        },
        'params.search': {
            handler() {
                console.log('params.search', this.pagination);
                this.delay();
            }
        },
        $route(to, from) {
            // 동일 컴포넌트 랜더링시에 $route 변경 감지
            // 경로 변경에 반응하여...
            this.getBoard();
        },
        beforeRouteUpdate(to, from, next) {
            // react to route changes...
            // don't forget to call next()
        }
    },
    computed: {
        setSkip() {
            if (this.pagination.page <= 0) return 0;
            return (this.pagination.page - 1) * this.pagination.rowsPerPage;
        },
        setSort() {
            let order = this.pagination.sortBy;
            if (!this.pagination.sortBy) order = '_id';
            return order;
        },
        setOrder() {
            return this.pagination.descending ? -1 : 1;
        },
        pages() {
            if (
                this.pagination.rowsPerPage == null ||
                this.pagination.totalItems == null
            )
                return 0;
            return Math.ceil(
                this.pagination.totalItems / this.pagination.rowsPerPage
            );
        }
    },
    methods: {
        addDialog() {
            this.dialog = true;
            this.dlMode = 1;
            this.form = {
                title: '',
                content: ''
            };
        },
        modDialog() {
            this.dlMode = 2;
            this.form = {
                title: this.selectedArticle.title,
                content: this.selectedArticle.content
            };
        },
        getBoard() {
            this.$axios
                .get(`board/read/${this.$route.params.name}`)
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg);
                    console.log('1. getBoard => ', data);
                    this.board = data.d;
                    this.getArticles();
                })
                .catch(e => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                });
        },
        addArticle() {
            if (!this.form.title)
                return this.$store.commit('pop', {
                    msg: '제목을 작성해주세요',
                    color: 'warning'
                });
            if (!this.form.content)
                return this.$store.commit('pop', {
                    msg: '내용을 작성해주세요',
                    color: 'warning'
                });
            this.$axios
                .post(`article/${this.board._id}`, this.form)
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg);
                    this.dialog = false;
                    this.getArticles();
                })
                .catch(e => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                });
        },
        getArticles() {
            if (this.loading) return;
            if (!this.board._id) return;
            this.loading = true;

            const params = {
                skip: this.setSkip,
                limit: this.pagination.rowsPerPage,
                sort: this.setSort,
                order: this.setOrder,
                search: this.params.search
                // draw: thia.params.draw++
            };

            console.log('2. getArticles => ', params);

            this.$axios
                .get(`article/list/${this.board._id}`, { params })
                .then(({ data }) => {
                    console.log('3. data => ', data);
                    if (!data.success) throw new Error(data.msg);
                    this.pagination.totalItems = data.t;
                    this.articles = data.ds;
                    this.loading = false;
                })
                .catch(e => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                    this.loading = false;
                });
        },
        getArticle(atc) {
            this.selectedArticle = atc;
            this.loading = true;
            this.$axios
                .get(`article/read/${atc._id}`)
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg);
                    this.dlMode = 0;
                    this.dialog = true;
                    this.selectedArticle.content = data.d.content;
                    this.selectedArticle.cnt.view = data.d.cnt.view;
                    this.loading = false;
                })
                .catch(e => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                    this.loading = false;
                });
        },
        updateArticle() {
            if (!this.form.title)
                return this.$store.commit('pop', {
                    msg: '제목을 작성해주세요',
                    color: 'warning'
                });
            if (!this.form.content)
                return this.$store.commit('pop', {
                    msg: '내용을 작성해주세요',
                    color: 'warning'
                });
            if (
                this.selectedArticle.title === this.form.title &&
                this.selectedArticle.content === this.form.content
            )
                return this.$store.commit('pop', {
                    msg: '변경된 내용이 없습니다',
                    color: 'warning'
                });
            this.$axios
                .put(`article/${this.selectedArticle._id}`, this.form)
                .then(({ data }) => {
                    this.dialog = false;
                    if (!data.success) throw new Error(data.msg);
                    this.selectedArticle.title = data.d.title;
                    this.selectedArticle.content = data.d.content;
                })
                .catch(e => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                });
        },
        deleteArticle() {
            this.$axios
                .delete(`article/${this.selectedArticle._id}`)
                .then(({ data }) => {
                    this.dialog = false;
                    if (!data.success) throw new Error(data.msg);
                    this.getArticles();
                })
                .catch(e => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                });
        },
        pop(m, c) {
            this.sb.act = true;
            this.sb.msg = m;
            this.sb.color = c;
        },
        id2date(val) {
            if (!val) return '잘못된 시간 정보';
            return new Date(
                parseInt(val.substring(0, 8), 16) * 1000
            ).toLocaleString();
        },
        delay() {
            this.timeout && clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getArticles();
            }, 1000);
        }
    }
};
</script>
