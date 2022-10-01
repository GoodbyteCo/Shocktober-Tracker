
<template>
  <form @submit.prevent>
		<fieldset>
			<legend>Graph settings</legend>

			<div class="username">
				<label for="username">Letterboxd username</label>
				<input type="text"
					id="username" 
					name="u"
					placeholder="ex: holopollock"
					:value="users"
					@change="users = ($event.target as HTMLInputElement).value"
					v-on:blur="users = ($event.target as HTMLInputElement).value" 
					v-on:keyup.enter="users = ($event.target as HTMLInputElement).value"
					required
				>
			</div>

      <div class="listName">
				<label for="listName">List</label>
				<input type="text"
					id="list" 
					name="ln"
					placeholder="holopollock/list/full-shocktober-2022"
					:value="listName"
					@change="listName = ($event.target as HTMLInputElement).value"
					v-on:blur="listName = ($event.target as HTMLInputElement).value" 
					v-on:keyup.enter="listName = ($event.target as HTMLInputElement).value"
					required
				>
			</div>

		</fieldset>
	</form>
  <calender :month="month" :year="year" :list-to-display="[]"/>
</template>


<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { ListFilm, UserFilmWatch } from '@/types'
  import Calender from './components/Calender.vue';
  const users = ref('')
  const listName = ref('')
  const userNames = ref<string[]>([])
  const year = ref(new Date().getFullYear())
  const month = ref(9)

  watch(users, (users, prevUsers) => {
    if (users != prevUsers) {
      userNames.value = users.split(',')
    }
  })

  watch(userNames, (userNames, prevUserNames) => {
    getUserWatchStatus(userNames).then(filmWatched => {
      console.log(filmWatched)
    })

  })

  watch(listName, (listName, prevListName) => {
    if (listName != prevListName) {
      getCalender(listName).then(calender => {
        console.log(calender)
      }) 
    }
  })

  const getCalender = async (listName: string) => {
    const filmList = await (
      await fetch(`/api?list=${listName}`)
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

  // const getList = 

</script>


<style scoped>

</style>
