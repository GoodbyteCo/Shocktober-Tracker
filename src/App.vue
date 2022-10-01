
<template>
    <controls/>
    <calender :month="month" :year="year" :list-to-display="filmList" :user-film-list="usersFilmWatch"/>
</template>


<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { ListFilm, UserFilmWatch, WatchStatus } from '@/types'
  import Calender from './components/Calender.vue';
  import Controls from './components/Controls.vue';
  import { useControlsStore } from './stores/controls';
import { getDaysInMonth } from '@/utils';
  const controls = useControlsStore()
  const usersFilmWatch = ref<Map<string,Map<string,WatchStatus>>>(new Map())
  const filmList = ref<Map<number,string>>(new Map())
  const year = ref(new Date().getFullYear())
  const month = ref(10)
  const numberOfDays = getDaysInMonth(year.value, month.value)


  controls.$subscribe((mutation, state) => {
    console.log(controls.userNameList)
    getFilmListAndWatchStatus(controls.userNameList, state.listName)
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
      for (let index = 0; index < numberOfDayPerFilm; index++) {
        map.set(index+indexList*numberOfDayPerFilm, currentFilm.film_name)
      }
      return map
    }, new Map())
    filmList.value = mapOfWhenShouldWatch

    const userWatchStatus = userNames.reduce<Map<string,Map<string,WatchStatus>>>((userMap, userName) => {
      const watchMatch = listOfShocktoberFilms.reduce<Map<string,WatchStatus>>((filmMap, film) => {
        filmMap.set(film.film_name, 'Not')
        return filmMap
      }, new Map())
      userMap.set(userName, watchMatch)
      return userMap
    }, new Map())

    console.log(userFilmsWatched)
    userNames.forEach(userName => {
      (userFilmsWatched[userName] ?? []).forEach((filmWatch) => {
        const filmShouldWatch = mapOfWhenShouldWatch.get(Number(filmWatch.day)-1)
        if(filmShouldWatch === filmWatch.filmName) {
          userWatchStatus.get(userName)!.set(filmWatch.filmName, "OnTime")
        } else if (filmsToWatch.has(filmWatch.filmName)) {
          userWatchStatus.get(userName)!.set(filmWatch.filmName, "Late") 
        }
      })
    })

    usersFilmWatch.value = userWatchStatus


  }

  // const getList = 

</script>


<style>
  html {
    background-color: #1b2127;
  }

</style>
