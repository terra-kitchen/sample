import { useAddress } from "../hooks/useConnectedAddress"
import ConnectButton from "./ConnectButton"
import IBCTransferFromExternalChain from "./IBCTransferFromExternalChain"
import IBCTransfer from "./IBCTransfer"
import IBCSend from "./IBCSend"
import Balances from "./Balances"

const App = () => {
  const address = useAddress()

  return (
    <main>
      <ConnectButton />

      {address && (
        <section>
          <Balances />
          <IBCTransferFromExternalChain />
          <IBCTransfer />
          <IBCSend />
        </section>
      )}
    </main>
  )
}

export default App
