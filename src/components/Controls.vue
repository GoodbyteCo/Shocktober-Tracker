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
                    @change="userName = ($event.target as HTMLInputElement).value"
					:value="userName"
					required
				>
			</div>

            <div class="listName">
				<label for="listName">List</label>
				<input type="text"
					id="list" 
					name="ln"
					placeholder="holopollock/list/full-shocktober-2022"
                    @change="listName = ($event.target as HTMLInputElement).value"
					:value="listName"
					required
				>
			</div>

		</fieldset>
        <button v-on:click="update()">Submit</button>
	</form>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useControlsStore } from '@/stores/controls';
    
    const userName = ref("")
    const listName = ref("")
    
    const controls = useControlsStore()

    const update = () => {
        console.log("hello")
        console.log(listName.value)
        console.log(userName.value)
        controls.$patch({
            userNames: userName.value,
            listName: listName.value
        })
    }
</script>