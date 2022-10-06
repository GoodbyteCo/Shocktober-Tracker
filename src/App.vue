
<template>
	<h1>{{ 'Shock' + monthSuffix }}</h1>
	<controls/>
	<div
		v-if="loading"
		class="loading-indicator"
	>
		Loading...
	</div>
	<calender
		v-else
		:month="month"
		:year="year"
		:list-to-display="filmList"
		:user-film-list="usersFilmWatch"
	/>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import type { ListFilm, UserFilmWatch, WatchStatus, Film } from '@/types'
	import Calender from './components/Calender.vue'
	import Controls from './components/Controls.vue'
	import { useControlsStore } from './stores/controls'
	import { getDaysInMonth, getMonthSuffix } from '@/utils'

	const controls = useControlsStore()
	const usersFilmWatch = ref<Map<string, Map<string, WatchStatus>>>(new Map())
	const filmList = ref<Map<number, Film>>(new Map())
	const year = ref(new Date().getFullYear())
	const month = ref(10)
	const loading = ref<boolean | undefined>(undefined)
	const numberOfDays = getDaysInMonth(year.value, month.value)

	const monthSuffix = getMonthSuffix(month.value)


	controls.$subscribe((_mutation, state) => {
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
		
		const mapOfWhenShouldWatch = listOfShocktoberFilms.reduce<Map<number, Film>>((map, currentFilm, indexList) => {
			for (let index = 0; index < numberOfDayPerFilm; index++) {
				map.set(index+indexList*numberOfDayPerFilm, {name: currentFilm.film_name, slug: currentFilm.list_url})
			}

			return map
		}, new Map())
		filmList.value = mapOfWhenShouldWatch

		const userWatchStatus = userNames.reduce<Map<string, Map<string, WatchStatus>>>((userMap, userName) => {
			const watchMatch = listOfShocktoberFilms.reduce<Map<string, WatchStatus>>((filmMap, film) => {
				filmMap.set(film.film_name, 'Not')
				return filmMap
			}, new Map())
			userMap.set(userName, watchMatch)
			return userMap
		}, new Map())

		userNames.forEach(userName => {
			(userFilmsWatched[userName] ?? []).forEach((filmWatch) => {
				const filmShouldWatch = mapOfWhenShouldWatch.get(Number(filmWatch.day) - 1)?.name
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
</script>

<style>
	:root {
		--off-white: #ebebeb;
		--dark: #1b2127;
	}

	html {
		background-color: var(--dark);
		font-family: serif;
	}
</style>
