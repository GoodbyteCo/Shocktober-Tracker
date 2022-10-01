<template>
     <form @submit.prevent>
		<fieldset>
			<legend>Shocktober</legend>

			<div class="username">
				<label for="username">Letterboxd username</label>
				<input type="text"
					id="username" 
					name="u"
					placeholder="ex: holopollock"
					:value="controls.userNames"
					@change="controls.userNames = ($event.target as HTMLInputElement).value"
					v-on:blur="controls.userNames = ($event.target as HTMLInputElement).value" 
					v-on:keyup.enter="controls.userNames = ($event.target as HTMLInputElement).value"
					required
				>
			</div>

      <div class="listName">
				<label for="listName">List</label>
				<input type="text"
					id="list" 
					name="ln"
					placeholder="holopollock/list/full-shocktober-2022"
					:value="controls.listName"
					@change="controls.listName = ($event.target as HTMLInputElement).value"
					v-on:blur="controls.listName = ($event.target as HTMLInputElement).value" 
					v-on:keyup.enter="controls.listName = ($event.target as HTMLInputElement).value"
					required
				>
			</div>

		</fieldset>
	</form>
</template>

<script setup lang="ts">
import { useControlsStore } from '@/stores/controls';
    const controls = useControlsStore()
</script>