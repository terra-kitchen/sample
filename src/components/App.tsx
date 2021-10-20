import { useAddress } from "../hooks/useConnectedAddress"
import SendButton from "./SendButton"
import ConnectButton from "./ConnectButton"
import ExecuteButton from "./ExecuteButton"

const App = () => {
  const address = useAddress()

  return (
    <main>
      <ConnectButton />

      {address && (
        <section>
          <SendButton />
          <ExecuteButton />
        </section>
      )}
    </main>
  )
}

export default App
