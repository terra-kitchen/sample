import { StrictMode } from "react"
import { render } from "react-dom"
import { getChainOptions, WalletProvider } from "@terra-money/wallet-provider"
import { BRIDGE } from "./contants"
import "./index.scss"
import App from "./components/App"

getChainOptions().then((chainOptions) => {
  render(
    <StrictMode>
      <WalletProvider {...chainOptions} connectorOpts={{ bridge: BRIDGE }}>
        <App />
      </WalletProvider>
    </StrictMode>,
    document.getElementById("root")
  )
})
