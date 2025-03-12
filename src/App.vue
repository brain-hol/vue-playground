<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { base64UrlToBigint, bigIntToString, modExp, stringToBigInt } from './lib'
import BField from './BField.vue'
import BOutput from './BOutput.vue'
import BOutputBlock from './BOutputBlock.vue'
import BFieldBlock from './BFieldBlock.vue'

const eBase64 = ref('AQAB')
const e = computed(() => base64UrlToBigint(eBase64.value))

const nBase64 = ref('zG_vlvk10yZ-QKA2rgwN036s9nCh-ktoHAwpJlTXogi7zmqylBwf4NjnacuEDai3ZBL5RH3mzn0ivL8WUuu9MZBfstqr0mcSZqKgrKFYSNZ3nTGWZDNw9M6b0UArzr_yBeSB0m1wl16i3I1ZsZu7a-6eQRxIYWBE4VpbOMfw728r1PzMJuTMfvT4azYPyD_P_t9qAhOSqNOxTfcJY9vGgGiWrwgf47fe70sUAB8eScxaqBHySjh2m_UqhpZEpTtX6qyLKytctYDPQ4hHTzhlhhwHtPOKBXXrbM0Mts_7HejkKj8ECVu9kadhozQ5CX7l6Md3OJS69kSOj5nLfDId_vLCj1XnjgrkXwtmBDeVigkkdUaVG7OCob_6cEpPfffvRCy4O5_MoBf1EVHk-nJh2zGdThSwSM861o7GnG6Mr7n5yBtnJXSXYwTgwFKleaGzjnqxLy7kyWqTlzLT1lm6hnMjU3V7FDCD4ndHQRJek3M-mYwxz3JpGOOUrBiSMlh_WJSyTDgotINAIeKouEhLZg4YtB3DtC9PlAjSHgitDZacJizjLKrRYmPXWxIyqKmBCmmpbAglzElkepnFPqpzJV3fHRWWB_cCIVU7iD2jslvyYK17XKp0BvVF_YP_Qx6u_OnT48DhG08rHwM26kvuK9C_o7LdszyEUieN5BEbmBk')
const n = computed(() => nBase64.value ? base64UrlToBigint(nBase64.value) : 0n)

const dBase64 = ref('uuUoeQxR5k7PQt1IA2OsXJpMQv_RrKswUuWbwm82Gy4_n9RdIcew2EYK_WEaWEXvFnr_srDiM_bKIFs7ywSJPaCiv_K3bdH8OWZzfUtrrMw-jd7j4KPkJM1U-wpjhvTp5SPcEAiBrSLNwNOeUfl-4tfj1XyA-wlc0rsT2ZwfbsUNfKl5Ye9EuIAMPFX3NBqKrVENHYOE5ZB8aua4ruc8re7Jv9HdCZ1RV5gSlFW4k77y1i8NNVHkcmOTHjTZzxgcIbognO5TRMqZ4DYny32T_W7lBRaDpc-sfXWibE8MQ5eSoK24-X_lLRPO4yKFmflV6ho3Xy1W2yJDfiDZMhAHgGmI8ovWxLkBbIVQjzJbtDY0JydVobpDS4Br4aD0WaUk4yRCPB_WVtJQJJs93KjXrTg8U1_R5WcBpuAvBqajD0KiLmyvMt2VUFdjwPRh5RamY2sMvMbjwzlxT376lhHZ12Wyq7MRr0IZYwiEbLZfVpC-lH4b7I6ma2VZkZA2W7EnOmjJlTIOQcMwEvPtRoROIbQqBnpaIqPgEaQmKbMFrDfphKVN6lbEF4s4LjLZmJHXTVKOOjFO5sm3oL9_nK4ntTVuWXSfkdjuV0fyHfuFwv6MFljrJWRAqiRBd5PW86R-0TVm6WcSsU6H5Ari5bu4HPmT_DWFyfsR1EfIUZnA5Q')
const d = computed(() => base64UrlToBigint(dBase64.value))

function encrypt(msg: bigint) {
    return modExp(msg, e.value, n.value)
}

function decrypt(msg: bigint) {
    return modExp(msg, d.value, n.value)
}

const message = ref('')
const debounced = ref(message.value)

let timeout: number
watch(message, (newVal) => {
    clearTimeout(timeout)
    timeout = setInterval(() => {
        debounced.value = newVal
    }, 250)
})

const inNum = computed<bigint>(() => stringToBigInt(debounced.value))
const encrypted = computed(() => encrypt(inNum.value))
const decrypted = computed(() => decrypt(encrypted.value))
const outMsg = computed(() => bigIntToString(decrypted.value))
</script>

<template>
    <div
        class="container mx-auto my-24 grid border border-zinc-400 xl:grid-cols-2 dark:border-zinc-700"
    >
        <div class="grid gap-4 border-b border-zinc-200 p-12 xl:border-none dark:border-zinc-700">
            <h1 class="mb-3 font-serif text-5xl font-semibold">Client</h1>
            <BOutputBlock label="Mod Space (N)" :value="nBase64" />
            <BOutput label="Public Key (E)" :value="eBase64" />
            <BField id="message" label="Message" v-model="message" />
            <BOutput label="As a Number" :value="inNum" />
            <BOutputBlock label="Encrypted" :value="encrypted" />
        </div>
        <div class="grid gap-4 p-12 xl:border-l xl:border-zinc-400 dark:xl:border-zinc-700">
            <h1 class="mb-3 font-serif text-5xl font-semibold">Server</h1>
            <BOutput label="Mod Space (N)" :value="nBase64" />
            <BOutputBlock label="Private Key (D)" :value="dBase64" />
            <BOutputBlock label="Encrypted" :value="encrypted" />
            <BOutput label="Decrypted" :value="decrypted" />
            <BOutput label="As a String" :value="outMsg" />
        </div>
    </div>
</template>
