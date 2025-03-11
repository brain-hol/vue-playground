export function bigintToBase64Url(bigint: BigInt): string {
    // Convert BigInt to a byte array (Uint8Array)
    const bytes: number[] = []
    while (bigint > 0) {
        bytes.push(Number(bigint & BigInt(255)))
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
