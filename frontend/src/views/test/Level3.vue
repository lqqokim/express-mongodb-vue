<template>
    <v-container>
        <v-alert type="info" :value="true">레벨 3 손님(토큰없이 요청하는 사용자)</v-alert>
    </v-container>
</template>

<script>
import moment from 'moment';

export default {
	mounted() {
		// console.log(new Date());
		// console.log(moment().toDate());
		// console.log(moment().format('YYMMDD'));
		// console.log(moment().minutes())
		// console.log(moment().add(3, 'hours').toString())
		// moment.locale('ko')
		// console.log(moment().add(-4, 'hours').fromNow());

		// const currentTime = moment();
		// const bt = moment().add(-4, 'hours');

	}
};
</script>