<script setup lang="ts">
const model = defineModel()
defineProps<{
    id: string
    label: string
}>()
</script>

<template>
    <div class="flex flex-col gap-1">
        <label class="block font-serif font-medium" :for="id">{{ $props.label }}</label>
        <input
            class="block w-full border-1 border-zinc-600 bg-white px-3 py-1.5 font-mono focus:outline dark:bg-zinc-800"
            v-model="model"
            maxlength="24"
        />
    </div>
</template>
