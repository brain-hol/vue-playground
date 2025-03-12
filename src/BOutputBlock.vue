<script setup lang="ts">
defineProps<{
    label: string
    value: unknown
}>()
</script>

<template>
    <div class="flex flex-col gap-1">
        <label class="block font-serif font-medium">{{ $props.label }}</label>
        <p
            class="block min-h-82 w-full border-1 border-gray-600 bg-gray-50 px-3 py-1.5 font-mono break-all whitespace-normal focus:outline dark:bg-gray-900"
        >
            {{ value }}
        </p>
    </div>
</template>
