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

<style scoped>


    fieldset {
        color: #ebebeb
    }
    input {
        font-size: 1.1rem;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 2.8rem;
        background: #ebebeb;
        padding: 0 1rem;
        min-width: 200px;
        border: 0;
        border-radius: 4px;
        outline: none;
    }
    label {
        color: #ebebeb
    }

    fieldset div{
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .3em
    }

    button {
        color: #fff;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: .8rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .04em;
        line-height: 2.8rem;
        display: inline-block;
        cursor: pointer;
        padding: 0 1rem;
        border: 0;
        border-radius: 4px;
        outline: none;
        color: #1b2127;
        text-align: center;
        margin: auto;
    }
</style>