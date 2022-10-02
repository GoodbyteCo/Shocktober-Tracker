<template>
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288.98 288.98">
        <defs></defs>
        <g id="Layer_1-2">
            <line class="cls-1" x1="6.99" y1="281.99" x2="6.99" y2="6.99"/>
            <line class="cls-1" x1="281.99" y1="6.99" x2="281.99" y2="281.99"/>
            <rect class="cls-2" x="76.91" y="13.98" width="135.17" height="109.53" rx="4.27" ry="4.27"/>
            <rect class="cls-2" x="76.91" y="167.8" width="135.17" height="109.53" rx="4.27" ry="4.27"/>
            <circle cx="41.95" cy="37.29" r="11.65"/>
            <circle cx="41.95" cy="102.54" r="11.65"/>
            <circle cx="41.95" cy="191.1" r="11.65"/>
            <circle cx="41.95" cy="256.36" r="11.65"/>
            <circle cx="247.03" cy="37.29" r="11.65"/>
            <circle cx="247.03" cy="102.54" r="11.65"/>
            <circle cx="247.03" cy="191.1" r="11.65"/>
            <circle cx="247.03" cy="256.36" r="11.65"/>
        </g>
    </svg>
</template>

<script setup lang="ts">
    type FilmProps = {
        color: string
    }

    const props = defineProps<FilmProps>()
</script>

<style scoped>
.cls-1{
    stroke-linecap:round;
}
.cls-1,.cls-2{
    fill:none;
    stroke: v-bind('props.color');
    stroke-miterlimit:10;
    stroke-width:13.98px;
}
circle {
    fill: v-bind('props.color')
}
</style>