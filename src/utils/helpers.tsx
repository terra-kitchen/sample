/* helpers */
interface Asset {
  amount: string
  token: string
  symbol?: string
}

const getIsTokenNative = (token = "") => token.startsWith("u")

const toAssetInfo = (token: string) =>
  getIsTokenNative(token)
    ? { native_token: { denom: token } }
    : { token: { contract_addr: token } }

export const toToken = ({ amount, token }: Asset) => ({
  amount,
  info: toAssetInfo(token),
})
