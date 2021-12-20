import { useHistory } from "./query"
import parser from "./parser"

const App = () => {
  const { data } = useHistory()
  if (!data) return null
  return <pre>{JSON.stringify(parser(data), null, 2)}</pre>
}

export default App
