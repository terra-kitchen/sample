import { NavLink } from "react-router-dom"
import ExecuteContractTx from "txs/ExecuteContractTx"

export const routes = [
  { title: "Execute contract", path: "/", element: <ExecuteContractTx /> },
]

const Nav = () => {
  return (
    <nav>
      {routes.map(({ path, title }) => (
        <li key={path}>
          <NavLink to={path}>{title}</NavLink>
        </li>
      ))}
    </nav>
  )
}

export default Nav
