const removeLines = (str: string) => {
  return str.replace('\n', '')
}

const base64ToArrayBuffer = (b64: string) => {
  const byteString = window.atob(b64)
  const byteArray = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i)
  }

  return byteArray
}

export const pemToArrayBuffer = (pem: string, keyType: 'public' | 'private') => {
  const b64Lines = removeLines(pem)
  const b64Prefix = b64Lines.replace(`-----BEGIN ${keyType === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----`, '')
  const b64Final = b64Prefix.replace(`-----END ${keyType === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----`, '')

  return base64ToArrayBuffer(b64Final)
}
