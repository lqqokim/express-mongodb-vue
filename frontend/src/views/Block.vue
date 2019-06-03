<template>
    <v-container>
        <v-alert type="error" :value="true">{{$route.params.msg}}</v-alert>
    </v-container>
</template>
<script>
export default {
    mounted() {
        // console.log(this.$route.params.msg)
        // if (this.$route.params.msg === 'jwt expired') this.$store.commit('deleteToken')
        if (this.$route.params.msg === 'jwt expired')
            this.$store.commit('deleteToken');
    }
};
</script>