import {
  AccAddress,
  Coins,
  MsgExecuteContract,
  MsgSend,
} from "@terra-money/terra.js"
import { useWallet } from "@terra-money/use-wallet"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { isDenomTerraNative, readDenom } from "terra-utils"
import useConnectedAddress from "../hooks/useConnectedAddress"
import useLCDClient from "../hooks/useLCDClient"
import terra from "../wormhole/terra.json"
import binance from "../wormhole/binance.json"
import ethereum from "../wormhole/ethereum.json"
import solana from "../wormhole/solana.json"
import { useState } from "react"
import { ethers } from "ethers"

interface NativeTokenInfo {
  native_token: { denom: string }
}

interface TokenInfo {
  token: { contract_addr: string }
}

const parseTokenInfo = (info: NativeTokenInfo | TokenInfo) => {
  if ("native_token" in info) {
    const denom = info.native_token.denom
    return { token: denom }
  } else {
    const contract_addr = info.token.contract_addr
    return { token: contract_addr }
  }
}

interface WormholeItem {
  symbol: string
  info: NativeTokenInfo | TokenInfo
  contract?: string
}

type WormholeWhitelist = Record<string, WormholeItem>

// interface WormholeWhitelistResponse {
//   mainnet: WormholeWhitelist
// }

interface Values {
  source: string
  destination: "terra" | "binance" | "ethereum" | "solana"
  asset: string
  amount: string
  address: string
}

type Provider = ethers.providers.Web3Provider | ethers.providers.InfuraProvider

const App = () => {
  const [ethAccount, setEthAccount] = useState()
  const [ethProvider, setEthProvider] = useState<Provider>()

  const connectMetamask = async () => {
    const method = "eth_requestAccounts"
    const accounts = await ((window as any).ethereum as any)?.request({
      method,
    })
    accounts && setEthAccount(accounts[0])
    setEthProvider(new ethers.providers.Web3Provider(window.ethereum))
  }

  console.log(ethAccount, ethProvider)

  const form = useForm<Values>()
  const { register, setValue, watch, handleSubmit } = form
  const { asset, destination } = watch()

  const lcd = useLCDClient()
  const connectedAddress = useConnectedAddress()
  const { data: bankBalance } = useQuery(
    ["lcd.bank.balance", connectedAddress],
    async () => {
      const [coins] = await lcd.bank.balance(connectedAddress)
      return coins
    }
  )

  const { data: cw20balance } = useQuery(
    ["lcd.wasm.contractQuery", [asset, connectedAddress]],
    async () => {
      const { balance } = await lcd.wasm.contractQuery<{ balance: string }>(
        asset,
        { balance: { address: connectedAddress } }
      )

      return balance
    },
    { enabled: AccAddress.validate(asset) }
  )

  const balance = bankBalance?.get(asset)?.amount.toString() ?? cw20balance

  const { post } = useWallet()

  const submit = async (values: Values) => {
    const { asset, source, destination, amount, address } = values

    const msg =
      source === "terra" && destination === "terra"
        ? isDenomTerraNative(asset)
          ? new MsgSend(
              connectedAddress,
              address,
              new Coins({ [asset]: amount })
            )
          : AccAddress.validate(asset)
          ? new MsgExecuteContract(connectedAddress, asset, {
              transfer: { recipient: address, amount },
            })
          : undefined
        : undefined

    if (msg) {
      const tx = { msgs: [msg] }
      const { result } = await post(tx)
      console.log(result.txhash)
    }
  }

  const whitelist: WormholeWhitelist =
    destination === "terra"
      ? {
          ...(bankBalance?.toArray().reduce(
            (acc, { denom }) => ({
              ...acc,
              [denom]: {
                symbol: readDenom(denom),
                info: { native_token: { denom: denom } },
              },
            }),
            {}
          ) ?? []),
          ...terra.mainnet,
        }
      : ({ terra, binance, ethereum, solana }[destination] ?? { mainnet: {} })
          .mainnet

  return (
    <>
      <button onClick={connectMetamask}>Connect metamask</button>

      <form onSubmit={handleSubmit(submit)}>
        <div>
          <label htmlFor="source">From</label>
          <select {...register("source")}>
            {[
              { label: "Terra", value: "terra" },
              { label: "Ethereum", value: "ethereum" },
              { label: "Binance Smart Chain", value: "binance" },
              { label: "Solana", value: "solana" },
              { label: "Cosmos", value: "cosmos" },
              { label: "Osmosis", value: "osmosis" },
            ].map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="destination">To</label>
          <select {...register("destination")}>
            {[
              { label: "Terra", value: "terra" },
              { label: "Ethereum", value: "ethereum" },
              { label: "Binance Smart Chain", value: "binance" },
              { label: "Solana", value: "solana" },
              { label: "Cosmos", value: "cosmos" },
              { label: "Osmosis", value: "osmosis" },
            ].map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="asset">Asset</label>
          <select {...register("asset")}>
            {Object.values(whitelist).map(({ info, symbol }) => {
              const { token } = parseTokenInfo(info)
              return (
                <option value={token} key={token}>
                  {symbol}
                </option>
              )
            })}
          </select>
          {balance}
        </div>

        <div>
          <label htmlFor="amount">Amount</label>
          <input {...register("amount")} />
          <button onClick={() => setValue("amount", balance ?? "0")}>
            Max
          </button>
        </div>

        <div>
          <label htmlFor="address">Destination address</label>
          <input {...register("address")} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
