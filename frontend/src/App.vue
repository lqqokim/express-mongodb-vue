<template>
    <v-app :dark="siteDark">
        <!-- :mini-variant.sync="mini" -->
        <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
            <v-toolbar flat class="transparent">
                <v-list class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="https://randomuser.me/api/portraits/men/85.jpg">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>Tony Kim</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-toolbar>

            <v-list>
                <v-list-group
                    v-for="(item, index) in items"
                    :key="index"
                    v-model="item.active"
                    :prepend-icon="item.action"
                    no-action
                >
                    <template v-slot:activator>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon v-html="item.icon"></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>

                    <v-list-tile
                        v-for="(subItem, index) in item.items"
                        :key="index"
                        :to="subItem.to"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-icon>{{ subItem.action }}</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title v-text="siteTitle"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-menu bottom left>
                    <v-btn icon slot="activator" @click="click">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <template v-if="!$store.state.token">
                            <v-list-tile @click="$router.push('/sign')">
                                <v-list-tile-title>로그인</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="$router.push('/register')">
                                <v-list-tile-title>회원가입</v-list-tile-title>
                            </v-list-tile>
                        </template>
                        <v-list-tile v-else @click="signOut">
                            <v-list-tile-title>로그아웃</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <router-view/>
        </v-content>
        <v-footer fixed app>
            <span>{{siteCopyright}}</span>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            drawer: null,
            siteTitle: '',
            siteCopyright: '',
            siteDark: false,
            items: [
                {
                    icon: 'donut_large',
                    title: '현황',
                    act: true,
                    items: [
                        {
                            title: '오늘',
                            to: {
                                path: '/'
                            }
                        }
                    ]
                },
                {
                    icon: 'chat',
                    title: '끄적끄적',
                    active: true,
                    items: [
                        // {
                        //     icon: 'home',
                        //     title: '아무나',
                        //     to: {
                        //         path: '/board/아무나'
                        //     }
                        // },
                        // {
                        //     icon: 'home',
                        //     title: '지호',
                        //     to: {
                        //         path: '/board/지호'
                        //     }
                        // }
                    ]
                },
                {
                    icon: 'home',
                    title: '권한 테스트',
                    items: [
                        {
                            icon: 'home',
                            title: '[lv3] 손님 페이지',
                            // active: true,
                            action: 'people_outline',
                            to: {
                                path: '/test/level3'
                            }
                        },
                        {
                            icon: 'home',
                            title: '[lv2] 일반유저 페이지',
                            // active: true,
                            action: 'people_outline',
                            to: {
                                path: '/test/level2'
                            }
                        },
                        {
                            icon: 'home',
                            title: '[lv1] 슈퍼유저 페이지',
                            action: 'people_outline',
                            to: {
                                path: '/test/level1'
                            }
                        },
                        {
                            icon: 'home',
                            title: '[lv0] 관리자 페이지',
                            action: 'people_outline',
                            to: {
                                path: '/test/level0'
                            }
                        }
                    ]
                },
                {
                    icon: 'settings',
                    title: '관리 메뉴',
                    items: [
                        {
                            icon: 'face',
                            title: '사용자관리',
                            to: {
                                path: '/manage/users'
                            }
                        },
                        {
                            icon: 'face',
                            title: '페이지관리',
                            to: {
                                path: '/manage/page'
                            }
                        },
                        {
                            icon: 'settings',
                            title: '게시판관리',
                            to: {
                                path: '/manage/board'
                            }
                        },
                        {
                            icon: 'face',
                            title: '사이트관리',
                            to: {
                                path: '/manage/site'
                            }
                        }
                    ]
                }
            ],
            title: this.$apiRootPath
        };
    },
    mounted() {
        this.getSite();
        this.getBoards();
    },
    methods: {
        getSite() {
            this.$axios.get('site').then(result => {
                const data = result.data.d;
                this.siteTitle = data.title;
                this.siteCopyright = data.copyright;
                this.siteDark = data.dark;
            });
        },
        getBoards() {
            this.$axios
                .get('/board/list')
                .then(({ data }) => {
                    data.data.forEach(board => {
                        this.items[1].items.push({
                            title: board.name,
                            to: {
                                path: `/board/${board.name}`
                            }
                        });
                    });
                })
                .catch(e => console.error(e.message));
        },
        signOut() {
            this.$store.commit('deleteToken');
            // localStorage.removeItem("token"); // 로그아웃 하면 토큰 날린다.
            this.$router.push('/');
        },
        click() {
            console.log('click => ', this.$store.state.token);
            // if (!this.$store.state.token) {
            //     alert('로그인 시간이 만료되었습니다. 다시 로그인 해주세요.');
            //     this.$router.push('/sign');
            // }
        }
    }
};
</script>