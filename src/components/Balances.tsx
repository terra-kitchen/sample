import { useQuery } from "react-query"
import { isNativeDenom, readAmount, readDenom } from "terra-utils"
import useConnectedAddress from "../hooks/useConnectedAddress"
import useLCDClient from "../hooks/useLCDClient"
import IBCUnit from "./IBCUnit"

const Balances = () => {
  const address = useConnectedAddress()
  const lcd = useLCDClient()

  const { data = [] } = useQuery("balances", async () => {
    const [balances] = await lcd.bank.balance(address)
    return balances
  })

  return (
    <ul>
      {data.map(({ amount, denom }) => (
        <li key={denom}>
          {readAmount(amount.toString())}{" "}
          {isNativeDenom(denom) ? readDenom(denom) : <IBCUnit>{denom}</IBCUnit>}
        </li>
      ))}
    </ul>
  )
}

export default Balances
