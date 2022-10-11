
<template>
	<h1>{{ 'Shock' + monthSuffix }}</h1>
	<controls/>
	<suspense>
		<calender
			:month="month"
			:year="year"
			:listName="controls.listName"
			:user-names="controls.userNameList"
		/>
		<template #fallback>
		<div class="loading-indicator" v-if="controls.listName && controls.userNames">
			Loading...
		</div>
		</template>
	</suspense>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import Calender from './components/Calender.vue'
	import Controls from './components/Controls.vue'
	import { useControlsStore } from './stores/controls'
	import { getMonthSuffix } from '@/utils'
  	import { useShocktoberUrlParams } from './utils/useShocktoberUrlParam'

	const controls = useControlsStore()
	const year = ref(new Date().getFullYear())
  	const { month: monthFromUrl } = useShocktoberUrlParams()
	const month = ref(monthFromUrl)

	const monthSuffix = getMonthSuffix(month.value)

	controls.$subscribe((_mutation, state) => {
		window.history.replaceState(null, "", `?u=${controls.userNameList.join("&u=")}&list=${state.listName}`);
	})

</script>

<style>
	:root
	{
		--white: #feeedf;
		--black: #000000;
		--red: #c30000;

		--title-font: 'Roslindale Condensed', serif;
		--body-font: 'Roslindale Text', serif;
		--numbers-font: 'Zangezi', serif;
	}

	::selection
	{
		background: var(--red);
	}

	html
	{
		background-color: var(--red);
	}

	body
	{
		color: var(--white);
		font-family: var(--body-font);
		margin: 0;

		min-height: 100vh;
		box-sizing: border-box;

		background-image:
			url('/grain.jpg'),
			linear-gradient(to bottom, var(--black), #661D1F);

		background-size: contain;
		background-repeat: repeat;
		background-blend-mode: luminosity;
	}

	h1
	{
		font-family: var(--title-font);
		text-transform: uppercase;
		font-weight: normal;
		font-size: 5.25rem;
		line-height: 2;

		text-align: center;
		margin: 0;
	}

	.loading-indicator
	{
		text-align: center;
		padding: 40px;
	}

	@media (max-width: 830px)
	{
		h1
		{
			font-size: 3rem;
		}
	}

	@font-face
	{
		src: url('https://fonts.goodbyte.ca/roslindale-condensed-subset-uppercase.woff2') format("woff2"),
			url('https://fonts.goodbyte.ca/roslindale-condensed-subset-uppercase.woff') format("woff");
		font-family: 'Roslindale Condensed';
	}

	@font-face
	{
		src: url('https://fonts.goodbyte.ca/roslindale-text-subset.woff2') format("woff2"),
			url('https://fonts.goodbyte.ca/roslindale-text-subset.woff') format("woff");
		font-family: 'Roslindale Text';
		unicode-range: U+0020-007F, U+00A9;
	}

	@font-face
	{
		src: url('https://fonts.goodbyte.ca/zangezi-subset-digits.woff2') format("woff2"),
			url('https://fonts.goodbyte.ca/zangezi-subset-digits.woff') format("woff");
		font-family: 'Zangezi';
	}
</style>
