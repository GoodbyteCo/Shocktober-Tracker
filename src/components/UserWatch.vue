<template></template>

<script setup lang="ts">
import type { WatchStatus } from '@/types'

type UserWatchProps = {
    name: string,
    watchStatus: WatchStatus
}

const props = defineProps<UserWatchProps>()

</script>