import { useQuery } from "react-query"
import { readDenom, truncate } from "terra-utils"
import useLCDClient from "../hooks/useLCDClient"

export const useDenomTrace = (denom = "") => {
  const lcd = useLCDClient()
  const hash = denom.replace("ibc/", "")

  return useQuery(["denomTrace", hash], async () => {
    const { denom_trace } = (await lcd.ibcTransfer.denomTrace(hash)) as any
    return denom_trace
  })
}

const IBCUnit = ({ children: unit }: { children: string }) => {
  const hash = unit.replace("ibc/", "")
  const { data } = useDenomTrace(unit)

  if (!data) return <>{truncate(hash)}</>

  const { base_denom, path } = data

  return (
    <article>
      {readDenom(base_denom) || base_denom}
      <code>{hash}</code> ({path.replace("transfer/", "")})
    </article>
  )
}

export default IBCUnit
