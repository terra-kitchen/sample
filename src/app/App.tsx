import { useRoutes } from "react-router-dom"
import { useAddress } from "data/wallet"
import { routes } from "./sections/Nav"
import NetworkName from "./sections/NetworkName"
import Connect from "./sections/Connect"

const App = () => {
  const address = useAddress()
  const element = useRoutes(routes)

  return (
    <article>
      <h1>Terra sample web app</h1>
      <NetworkName />
      <Connect />
      {address && <main>{element}</main>}
    </article>
  )
}

export default App
