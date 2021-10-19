import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import { useAddress } from "../utils/hooks"

const ConnectButton = () => {
  const { connect, disconnect } = useWallet()
  const address = useAddress()

  return address ? (
    <>
      <code>{address}</code>
      <button onClick={() => disconnect()}>Disconnect</button>
    </>
  ) : (
    <>
      <button onClick={() => connect(ConnectType.CHROME_EXTENSION)}>
        Connect extension
      </button>
      <button onClick={() => connect(ConnectType.WALLETCONNECT)}>
        Connect mobile
      </button>
    </>
  )
}

export default ConnectButton
