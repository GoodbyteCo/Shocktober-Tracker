<template>
    <h2>{{`Shock${monthName.slice(2)}`}}</h2>
    <section id="calender">
        <div v-for="calVal in calender"
            :key="calVal.date"
            class="date"
        >
        <div class="single-date" v-if="!calVal.isPadding">
            <div class="date-info"  >
                <div class="dateNum">{{calVal.date + 1}}</div>
                <div v-if="filmExist(calVal.date)">{{listToDisplay.get(calVal.date)}}</div>
            </div>
            <div v-for="[username, filmList] in userFilmList.entries()">
                <div :class="filmList.get(listToDisplay.get(calVal.date) ?? '')?.toLowerCase()">{{username}}</div>
            </div>
        </div>

        </div>

    </section>

</template>

<script setup lang="ts">
    import {computed} from 'vue'
    import type { ListFilm, WatchStatus } from '@/types';
    import { getDaysInMonth, firstDayInMonthIndex } from '@/utils'

    type CalenderItem = {
        isPadding: boolean
        date: number
    }

    type CalenderProps = {
        year: number,
        month: number
        listToDisplay: Map<number,string>
        userFilmList: Map<string,Map<string,WatchStatus>>
    }
    
    const props = defineProps<CalenderProps>()

    const filmExist = (date: number)=> {
        return props.listToDisplay.has(date)
    }

    const statusClass = (status: WatchStatus) => {
        
    }

    const numberOfDays = getDaysInMonth(props.year, props.month)
    const firstDay = firstDayInMonthIndex(props.year, props.month)
    console.log(numberOfDays)
    console.log(firstDay)

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
        color: white 
    }
    #calender {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        justify-content: stretch;
        gap: .3em;
    }
    .single-date {
        margin: .3em;
    }
    .date-info {
        display: flex;
        gap: .4em;
    }

    .date {
        width: 100%;
        height: 8em;
        border: 2px solid white;
        color: white;
        /* padding: .3em; */
    }

    .not {
        color: red
    }
    .ontime {
        color: green
    }
    .late {
        color: yellow
    }
</style>