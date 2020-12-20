import { useAddress } from "../hooks/useConnectedAddress"
import ConnectButton from "./ConnectButton"
import Form from "./Form"

const App = () => {
  const address = useAddress()

  return (
    <main>
      <ConnectButton />
      {address && <Form />}
    </main>
  )
}

export default App
