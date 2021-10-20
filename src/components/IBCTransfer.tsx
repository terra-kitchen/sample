import { useWallet } from "@terra-money/wallet-provider"
import { Coin, MnemonicKey, MsgTransfer } from "@terra-money/terra.js"
import useConnectedAddress from "../hooks/useConnectedAddress"
import useLCDClient from "../hooks/useLCDClient"
import { useGasPrice } from "../hooks/useGasPrices"

const channel = "channel-19"

const denom =
  "ibc/28DECFA7FB7E3AB58DC3B3AEA9B11C6C6B6E46356DCC26505205DAD3379984F5"

const mk = new MnemonicKey({
  mnemonic:
    "notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius",
}) // terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v

const IBCTransfer = () => {
  const { post } = useWallet()
  const address = useConnectedAddress()
  const lcd = useLCDClient()
  const gasPrices = useGasPrice("uluna")

  if (!gasPrices) return null

  const msg = new MsgTransfer(
    "transfer",
    channel,
    new Coin(denom, 100),
    address,
    address,
    undefined,
    (Date.now() + 60 * 1000) * 1e6
  )

  const transfer0 = async () => {
    // self
    try {
      const wallet = lcd.wallet(mk)
      const tx = await wallet.createAndSignTx({ msgs: [msg] })
      const result = await lcd.tx.broadcast(tx)
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const transfer1 = async () => {
    // extension
    try {
      const response = await post({ msgs: [msg], gasPrices })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section>
      <h1>{channel}</h1>
      <button onClick={transfer0}>IBC Transfer</button>
      <button onClick={transfer1}>IBC Transfer (extension)</button>
    </section>
  )
}

export default IBCTransfer
