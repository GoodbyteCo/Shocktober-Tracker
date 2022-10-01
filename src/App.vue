
<template>
  <controls/>
  <calender :month="month" :year="year" :list-to-display="[]"/>
</template>


<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { ListFilm, UserFilmWatch } from '@/types'
  import Calender from './components/Calender.vue';
  import Controls from './components/Controls.vue';
  import { useControlsStore } from './stores/controls';
import { getDaysInMonth } from '@/utils';
  const controls = useControlsStore()
  const usersFilmWatch = ref<UserFilmWatch>({})
  const filmList = ref<ListFilm[]>([])
  const year = ref(new Date().getFullYear())
  const month = ref(9)
  const numberOfDays = getDaysInMonth(year.value, month.value)


  watch(controls, (controls) => {
    if(controls.listName.length !== 0 && controls.userNames != undefined){
      getFilmListAndWatchStatus(controls.userNameList, controls.listName)
    }
  })

  const getList = async (listName: string) => {
    const filmList = await (
      await fetch(`/api/list?list=${listName}`)
    ).json()

    return filmList as ListFilm[]
  }

  const getUserWatchStatus = async (userNames: string[]) => {
    const userNameUrl = `user=${userNames.join("&user=")}`
    const filmsWatchedForUsers = await (
        await fetch(`/api?${userNameUrl}&year=${year.value}&month=${month.value}`)
      ).json()
    return filmsWatchedForUsers as UserFilmWatch
  }

  const getFilmListAndWatchStatus = async (userNames: string[], listName: string) => {
    const listOfShocktoberFilms = await getList(listName)
    const userFilmsWatched = await getUserWatchStatus(userNames)
    const numberOfDayPerFilm = Math.floor(numberOfDays / listOfShocktoberFilms.length)
    const filmsToWatch = listOfShocktoberFilms.reduce<Set<string>>((set, currentFilm) => {
      set.add(currentFilm.film_name)
      return set
    }, new Set())
    const mapOfWhenShouldWatch = listOfShocktoberFilms.reduce<Map<number,string>>((map, currentFilm, indexList) => {
      Array(numberOfDayPerFilm).forEach((_val, index) => {
          map.set(index+1*indexList, currentFilm.film_name)
      })
      return map
    }, new Map())
    console.log(mapOfWhenShouldWatch)



  }

  // const getList = 

</script>


<style scoped>

</style>
