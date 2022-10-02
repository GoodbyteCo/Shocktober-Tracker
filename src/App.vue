
<template>
    <controls/>
    <div class="loading" v-if="loading">Loading...</div>
    <calender :month="month" :year="year" :list-to-display="filmList" :user-film-list="usersFilmWatch"/>
</template>


<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { ListFilm, UserFilmWatch, WatchStatus, Film } from '@/types'
  import Calender from './components/Calender.vue';
  import Controls from './components/Controls.vue';
  import { useControlsStore } from './stores/controls';
  import { getDaysInMonth } from '@/utils';
  const controls = useControlsStore()
  const usersFilmWatch = ref<Map<string,Map<string,WatchStatus>>>(new Map())
  const filmList = ref<Map<number,Film>>(new Map())
  const year = ref(new Date().getFullYear())
  const month = ref(10)
  const loading = ref<boolean | undefined>(undefined)
  const numberOfDays = getDaysInMonth(year.value, month.value)


  controls.$subscribe((mutation, state) => {
    window.history.replaceState(null, "", `?u=${controls.userNameList.join("&u=")}&list=${state.listName}`);
    loading.value = true
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
    
    const mapOfWhenShouldWatch = listOfShocktoberFilms.reduce<Map<number,Film>>((map, currentFilm, indexList) => {
      for (let index = 0; index < numberOfDayPerFilm; index++) {
        map.set(index+indexList*numberOfDayPerFilm, {name: currentFilm.film_name, slug: currentFilm.list_url})
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

    userNames.forEach(userName => {
      (userFilmsWatched[userName] ?? []).forEach((filmWatch) => {
        const filmShouldWatch = mapOfWhenShouldWatch.get(Number(filmWatch.day)-1)?.name
        if(filmShouldWatch === filmWatch.filmName) {
          userWatchStatus.get(userName)!.set(filmWatch.filmName, "OnTime")
        } else if (filmsToWatch.has(filmWatch.filmName)) {
          userWatchStatus.get(userName)!.set(filmWatch.filmName, "Late") 
        }
      })
    })

    usersFilmWatch.value = userWatchStatus
    loading.value = false


  }

  // const getList = 

</script>


<style>
  :root {
    --off-white: #ebebeb;
    --dark: #1b2127;
  }
  html {
    background-color: var(--dark);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
  }

</style>

<style scoped>
  .loading {
    color: var(--off-white);
    margin: 10px 0;
    text-align: center;
    font-size: 1.2rem;
  }
</style>
