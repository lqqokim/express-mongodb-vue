<template>
  <v-app :dark="siteDark">
    <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
      <v-list>
        <v-list-tile value="true" v-for="(item, i) in items" :key="i" :to="item.to">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="siteTitle"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu bottom left>
          <v-btn icon slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-if="!$store.state.token" @click="$router.push('/sign')">
              <v-list-tile-title>로그인</v-list-tile-title>
            </v-list-tile>
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
  name: "App",
  data() {
    return {
      drawer: null,
      siteTitle: '',
      siteCopyright: '',
      siteDark: false,
      items: [
        {
          icon: "home",
          title: "level0",
          to: {
            path: "/"
          }
        },
        {
          icon: "home",
          title: "level1",
          to: {
            path: "/level1"
          }
        },
        {
          icon: "home",
          title: "level2",
          to: {
            path: "/level2"
          }
        },
        {
          icon: "home",
          title: "level3",
          to: {
            path: "/level3"
          }
        },
        {
          icon: "face",
          title: "사용자관리",
          to: {
            path: "/user"
          }
        },
        {
          icon: "face",
          title: "페이지관리",
          to: {
            path: "/page"
          }
        },
        {
          icon: "face",
          title: "사이트관리",
          to: {
            path: "/site"
          }
        }
      ],
      title: this.$apiRootPath
    };
  },
  mounted() {
    this.getSite();
  },
  methods: {
    getSite() {
      this.$axios.get("site").then(result => {
        const data = result.data.d;
        this.siteTitle = data.title;
        this.siteCopyright = data.copyright;
        this.siteDark = data.dark;
      });
    },
    signOut() {
      this.$store.commit("deleteToken");
      // localStorage.removeItem("token"); // 로그아웃 하면 토큰 날린다.
      this.$router.push("/");
    }
  }
};
</script>