import { useWallet } from "@terra-money/wallet-provider"
import { MsgSend, Tx } from "@terra-money/terra.js"
import useConnectedAddress from "../hooks/useConnectedAddress"
import useLCDClient from "../hooks/useLCDClient"
import { useGasPrice } from "../hooks/useGasPrices"

const SendButton = () => {
  const wallet = useWallet()
  const address = useConnectedAddress()
  const gasPrices = useGasPrice("uluna")
  const lcd = useLCDClient()

  if (!gasPrices) return null

  const msgs = [new MsgSend(address, address, `1uluna`)]
  const memo = "Test"
  const txOptions = { msgs, memo, gasPrices }

  const sign = async () => {
    const response = await wallet.sign(txOptions)
    console.log(response.result)
    const result = await lcd.tx.broadcast(response.result)
    console.log(result)
  }

  const post = async () => {
    const response = await wallet.post(txOptions)
    console.log(response)
  }

  return (
    <>
      <button onClick={sign}>Send (Sign)</button>
      <button onClick={post}>Send</button>
    </>
  )
}

export default SendButton
