<template>
	<h2>
		{{ `Shock${monthName.slice(2)}` }}
	</h2>
	<section id="calender">
		<div
			v-for="calVal in calender"
			:key="calVal.date"
			:class="calVal.isPadding ? 'isCalPadding date': 'date'"
		>
			<div v-if="!calVal.isPadding" class="single-date">
				<div class="dateNum">
					<span :class="{ 'today': isToday(calVal.date) }">
						{{ calVal.date + 1 }}
					</span>
				</div>
				<a
					v-if="filmExist(calVal.date)"
					:href="`https://letterboxd.com${listToDisplay.get(calVal.date)!.slug}`"
					target="_blank"
					class="date-info"
				>
					{{listToDisplay.get(calVal.date)!.name}}
				</a>
				<template v-for="[username, filmList] in userFilmList.entries()">
					<div class="userStatus">
						<div :class="filmList.get(listToDisplay.get(calVal.date)?.name ?? '')?.toLowerCase()">
							{{username}}
						</div>
					</div>
				</template>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	import {computed} from 'vue'
	import type { Film, WatchStatus } from '@/types';
	import { getDaysInMonth, firstDayInMonthIndex } from '@/utils'
	
	type CalenderItem = {
		isPadding: boolean
		date: number
	}

	type CalenderProps = {
		year: number,
		month: number
		listToDisplay: Map<number,Film>
		userFilmList: Map<string,Map<string,WatchStatus>>
	}

	const props = defineProps<CalenderProps>()

	const filmExist = (date: number)=> {
		return props.listToDisplay.has(date)
	}

	const isToday = (day: number) => {
		return new Date().getDate() == day + 1

	}

	const numberOfDays = getDaysInMonth(props.year, props.month)
	const firstDay = firstDayInMonthIndex(props.year, props.month)
	console.log(numberOfDays)
	console.log(firstDay)
	console.log(props.userFilmList)

	const monthName = new Date(props.year,props.month,0).toLocaleDateString('en-US',{month: 'long'})

	const paddingCalenderItems = Array(firstDay).fill("").map<CalenderItem>((_val, index) => {
		return {isPadding: true, date: index - firstDay}
	})
	
	const calenderDays = Array(numberOfDays).fill("").map<CalenderItem>((_val, index) => {
		return {isPadding: false, date: index}
	})
	
	const calender = [...paddingCalenderItems, ...calenderDays]
	console.log(calender)
</script>

<style scoped>
	h2 {
		color: var(--off-white);
		text-align: center
	}
	
	#calender {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		justify-content: stretch;
	}
	
	.single-date {
		margin: .3em;
	}
	
	.date-info {
		text-align: center;
		font-size: .8em;
		margin-top: 5px;
		color: var(--off-white);
		display: block;
		text-decoration: none;
	}

	.date-info:hover,.date-info:focus {
		text-decoration: underline;
		color:#40bcf4
	}

	.dateNum {
		text-align: center;
	}

	span {
		line-height: 24px;
		display: inline-block;
	}
	
	.today {
		height: 24px;
		color: #fff;
		background-color: #40bcf4;
		border-radius: 50%;
		min-width: 24px;
		font-weight: 500;
		text-align: center;
		white-space: nowrap;
		width: max-content;
	}

	.date {
		width: 100%;
		min-height: 8em;
		border: 2px solid white;
		color: white;
	}

	.isCalPadding {
		border: none;
	}

	.not {
		color: var(--off-white);
		background-color: #bb0200;
		padding: 5px 7px;
		border-radius: 5px;
	}
	.ontime {
		color: var(--off-white);
		background-color: #00af21;
		padding: 5px 7px;
		border-radius: 5px;
	}
	.late {
		color: var(--off-white);
		background-color: #ff8001;
		padding: 5px 7px;
		border-radius: 5px;
	}

	.userStatus {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 5px 0;
	} 
</style>
