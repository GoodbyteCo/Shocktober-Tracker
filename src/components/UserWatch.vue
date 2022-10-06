<template>
</template>

<script setup lang="ts">
	import type { WatchStatus } from '@/types'

	type UserWatchProps = {
		color: string
		name: string,
		watchStatus: WatchStatus
	}

	defineProps<UserWatchProps>()
</script>