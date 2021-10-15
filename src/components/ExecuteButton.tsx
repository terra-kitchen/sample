import { useWallet } from "@terra-money/wallet-provider"
import { Coin, Coins, MsgExecuteContract } from "@terra-money/terra.js"
import { useConnectedAddress } from "../utils/hooks"
import { toToken } from "../utils/helpers"

const PAIR = "terra1cz6qp8lfwht83fh9xm9n94kj04qc35ulga5dl0" // MIR-UST for tequila

const ExecuteButton = () => {
  const { post } = useWallet()
  const address = useConnectedAddress()

  const execute = async () => {
    try {
      const amount1 = "100000"
      const token1 = "uusd"
      const asset1 = toToken({ amount: amount1, token: token1 })

      const msgs = [
        new MsgExecuteContract(
          address,
          PAIR,
          { swap: { offer_asset: asset1 } },
          new Coins([Coin.fromData({ amount: amount1, denom: "uusd" })])
        ),
      ]

      const txOptions = { msgs, gasPrices: `0.15uusd` }

      const response = await post(txOptions)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  return <button onClick={execute}>Execute</button>
}

export default ExecuteButton
