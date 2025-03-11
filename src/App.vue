<script setup lang="ts">
import { computed, ref } from 'vue'
import { base64UrlToBigint } from './math'

function stringToBigInt(str: string) {
    if (!str) {
        return 0n
    }
    return BigInt(
        str
            .split('')
            .map((char) => char.charCodeAt(0))
            .map((num) => String(num).padStart(3, '0'))
            .join(''),
    )
}

function bigIntToString(num: bigint) {
    const str = stringRep(num)
    const chars = str.match(/.{3}/g)
    return chars!.map((val) => String.fromCharCode(parseInt(val))).join('')
}

function stringRep(num: bigint) {
    let str = String(num)
    const needed = 3 - (str.length % 3)
    if (needed === 2) {
        str = '00' + str
    }
    if (needed === 1) {
        str = '0' + str
    }
    return str
}

const e = base64UrlToBigint(`AQAB`)
const n = base64UrlToBigint(
    `zG_vlvk10yZ-QKA2rgwN036s9nCh-ktoHAwpJlTXogi7zmqylBwf4NjnacuEDai3ZBL5RH3mzn0ivL8WUuu9MZBfstqr0mcSZqKgrKFYSNZ3nTGWZDNw9M6b0UArzr_yBeSB0m1wl16i3I1ZsZu7a-6eQRxIYWBE4VpbOMfw728r1PzMJuTMfvT4azYPyD_P_t9qAhOSqNOxTfcJY9vGgGiWrwgf47fe70sUAB8eScxaqBHySjh2m_UqhpZEpTtX6qyLKytctYDPQ4hHTzhlhhwHtPOKBXXrbM0Mts_7HejkKj8ECVu9kadhozQ5CX7l6Md3OJS69kSOj5nLfDId_vLCj1XnjgrkXwtmBDeVigkkdUaVG7OCob_6cEpPfffvRCy4O5_MoBf1EVHk-nJh2zGdThSwSM861o7GnG6Mr7n5yBtnJXSXYwTgwFKleaGzjnqxLy7kyWqTlzLT1lm6hnMjU3V7FDCD4ndHQRJek3M-mYwxz3JpGOOUrBiSMlh_WJSyTDgotINAIeKouEhLZg4YtB3DtC9PlAjSHgitDZacJizjLKrRYmPXWxIyqKmBCmmpbAglzElkepnFPqpzJV3fHRWWB_cCIVU7iD2jslvyYK17XKp0BvVF_YP_Qx6u_OnT48DhG08rHwM26kvuK9C_o7LdszyEUieN5BEbmBk`,
)
const d = base64UrlToBigint(
    `uuUoeQxR5k7PQt1IA2OsXJpMQv_RrKswUuWbwm82Gy4_n9RdIcew2EYK_WEaWEXvFnr_srDiM_bKIFs7ywSJPaCiv_K3bdH8OWZzfUtrrMw-jd7j4KPkJM1U-wpjhvTp5SPcEAiBrSLNwNOeUfl-4tfj1XyA-wlc0rsT2ZwfbsUNfKl5Ye9EuIAMPFX3NBqKrVENHYOE5ZB8aua4ruc8re7Jv9HdCZ1RV5gSlFW4k77y1i8NNVHkcmOTHjTZzxgcIbognO5TRMqZ4DYny32T_W7lBRaDpc-sfXWibE8MQ5eSoK24-X_lLRPO4yKFmflV6ho3Xy1W2yJDfiDZMhAHgGmI8ovWxLkBbIVQjzJbtDY0JydVobpDS4Br4aD0WaUk4yRCPB_WVtJQJJs93KjXrTg8U1_R5WcBpuAvBqajD0KiLmyvMt2VUFdjwPRh5RamY2sMvMbjwzlxT376lhHZ12Wyq7MRr0IZYwiEbLZfVpC-lH4b7I6ma2VZkZA2W7EnOmjJlTIOQcMwEvPtRoROIbQqBnpaIqPgEaQmKbMFrDfphKVN6lbEF4s4LjLZmJHXTVKOOjFO5sm3oL9_nK4ntTVuWXSfkdjuV0fyHfuFwv6MFljrJWRAqiRBd5PW86R-0TVm6WcSsU6H5Ari5bu4HPmT_DWFyfsR1EfIUZnA5Q`,
)

function encrypt(msg: bigint) {
    return modExp(msg, e, n)
}

function decrypt(msg: bigint) {
    return modExp(msg, d, n)
}

function modExp(base: bigint, exp: bigint, mod: bigint): bigint {
    let result: bigint = 1n // Initialize result
    base = base % mod // Handle base case where base is greater than mod

    while (exp > 0n) {
        // If exp is odd, multiply the current base to result
        if (exp % 2n === 1n) {
            result = (result * base) % mod
        }

        // Now exp must be even
        base = (base * base) % mod // Square the base
        exp = exp / 2n // Divide the exponent by 2
    }

    return result
}

const message = ref('')
const inNum = computed<bigint>(() => stringToBigInt(message.value))
const encrypted = computed(() => encrypt(inNum.value))
const decrypted = computed(() => decrypt(encrypted.value))
const outMsg = computed(() => bigIntToString(decrypted.value))
</script>

<template>
    <h1>Hello World</h1>
    <input v-model="message" />
    <p>{{ stringRep(inNum) }}</p>
    <p>{{ encrypted }}</p>
    <p>{{ decrypted }}</p>
    <p>{{ outMsg }}</p>
</template>

<style>
p {
    word-break: break-all;
    white-space: normal;
}
</style>
