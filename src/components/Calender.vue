<template>
    <section id="calender">
        <div v-for="calVal in calender"
            :key="calVal.date"
        >
        <span v-if="!calVal.isPadding">{{calVal.date + 1}}</span>

        </div>

    </section>

</template>

<script setup lang="ts">
    import type { ListFilm } from '@/types';
    import { getDaysInMonth, firstDayInMonthIndex } from '@/utils'

    type CalenderItem = {
        isPadding: boolean
        date: number
    }

    type CalenderProps = {
        year: number,
        month: number
        listToDisplay: ListFilm[]
    }

    const props = defineProps<CalenderProps>()

    const numberOfDays = getDaysInMonth(props.year, props.month)
    const firstDay = firstDayInMonthIndex(props.year, props.month)
    console.log(numberOfDays)
    console.log(firstDay)

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
    #calender {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px
    }
</style>