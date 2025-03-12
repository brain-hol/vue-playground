export function bigintToBase64Url(bigint: BigInt): string {
    // Convert BigInt to a byte array (Uint8Array)
    const bytes: number[] = []
    // @ts-expect-error This seems to work
    while (bigint > 0) {
        // @ts-expect-error This seems to work
        bytes.push(Number(bigint & BigInt(255)))
        // @ts-expect-error This seems to work
        bigint >>= BigInt(8)
    }

    // Reverse the byte array to get the correct order
    bytes.reverse()

    // Create a Uint8Array from the bytes array
    const uint8Array = new Uint8Array(bytes)

    // Convert Uint8Array to a base64url string (without padding)
    return arrayBufferToBase64Url(uint8Array.buffer)
}

export function base64UrlToBigint(base64Url: string): bigint {
    // Ensure the base64url string has correct padding
    const paddedBase64Url = addBase64UrlPadding(base64Url)

    // Decode the base64url string to an ArrayBuffer
    const buffer = base64UrlToArrayBuffer(paddedBase64Url)

    // Convert the ArrayBuffer to a BigInt
    const uint8Array = new Uint8Array(buffer)
    let bigint = BigInt(0)
    for (let i = 0; i < uint8Array.length; i++) {
        bigint = (bigint << BigInt(8)) | BigInt(uint8Array[i])
    }

    return bigint
}

// Helper function to add padding to a base64url string
function addBase64UrlPadding(base64Url: string): string {
    const paddingNeeded = 4 - (base64Url.length % 4)
    if (paddingNeeded !== 4) {
        return base64Url + '='.repeat(paddingNeeded)
    }
    return base64Url
}

// Helper function to convert ArrayBuffer to base64url (without padding)
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const length = bytes.length
    for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i])
    }

    // Convert the binary string to base64 and then replace characters for base64url
    const base64 = window.btoa(binary)
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Helper function to convert base64url to ArrayBuffer
function base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
    // Convert base64url to base64 by replacing characters
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    // Decode base64 string to binary
    const binaryString = window.atob(base64)
    const length = binaryString.length
    const bytes = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
}

export function stringToBigInt(str: string) {
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

export function bigIntToString(num: bigint) {
    const str = bigIntStringRep(num)
    const chars = str.match(/.{3}/g)
    return chars!.map((val) => String.fromCharCode(parseInt(val))).join('')
}

export function bigIntStringRep(num: bigint) {
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

export function modExp(base: bigint, exp: bigint, mod: bigint): bigint {
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
