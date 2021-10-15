import { StrictMode } from "react"
import { render } from "react-dom"
import { getChainOptions, WalletProvider } from "@terra-money/wallet-provider"
import "./index.scss"
import App from "./components/App"

getChainOptions().then((chainOptions) => {
  render(
    <StrictMode>
      <WalletProvider {...chainOptions}>
        <App />
      </WalletProvider>
    </StrictMode>,
    document.getElementById("root")
  )
})
