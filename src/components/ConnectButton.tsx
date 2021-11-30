import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import { useAddress } from "../hooks/useConnectedAddress"

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
      <button onClick={() => connect(ConnectType.EXTENSION)}>
        Connect extension
      </button>
      <button onClick={() => connect(ConnectType.WALLETCONNECT)}>
        Connect mobile
      </button>
    </>
  )
}

export default ConnectButton
