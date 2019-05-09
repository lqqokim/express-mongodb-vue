<template>
    <v-container>
        <v-alert type="warning" :value="true">
            {{$route.path}} 존재하지 않는 페이지 입니다.
        </v-alert>
    </v-container>
</template>
