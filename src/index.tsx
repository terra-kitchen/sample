import { StrictMode } from "react"
import { render } from "react-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import "./index.scss"
import App from "./components/App"

const queryClient = new QueryClient()

render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById("root")
)
