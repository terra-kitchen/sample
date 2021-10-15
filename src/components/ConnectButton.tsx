import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import { useAddress } from "../utils/hooks"

const ConnectButton = () => {
  const { connect } = useWallet()
  const address = useAddress()

  return address ? (
    <code>{address}</code>
  ) : (
    <button onClick={() => connect(ConnectType.CHROME_EXTENSION)}>
      Connect
    </button>
  )
}

export default ConnectButton
