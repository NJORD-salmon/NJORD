
export const WS_SERVER = 'localhost'

export const SERVER_ADDRESS = process.env.NODE_ENV === 'production'
  ? 'https://njord-salmon.github.io/NJORD/'
  : `http://${WS_SERVER}:3000/NJORD`
export const QR_CODE_BASE_URL = 'https://njord-salmon.github.io/NJORD/'