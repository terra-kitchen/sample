import { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { AccAddress, MsgExecuteContract } from "@terra-money/terra.js"
import { useWallet } from "@terra-money/wallet-provider"
import { useConnectedAddress } from "data/wallet"
import TxResult from "./TxResult"

interface Values {
  contract: AccAddress
  msg: string
}

const ExecuteContract = () => {
  const address = useConnectedAddress()
  const { post } = useWallet()

  const SAMPLE = {
    contract: "terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl", // aUST for testnet
    msg: JSON.stringify({ transfer: { recipient: address, amount: "1" } }),
  }

  const { register, handleSubmit } = useForm<Values>({ defaultValues: SAMPLE })
  const [txhash, setTxHash] = useState("")

  const submit = async ({ contract, msg }: Values) => {
    try {
      const msgs = [new MsgExecuteContract(address, contract, JSON.parse(msg))]
      const txOptions = { msgs }
      const { result, success } = await post(txOptions)
      if (!success) throw new Error(result.raw_log)
      setTxHash(result.txhash)
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : (error as Error).message

      alert(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <label>Contract</label>
      <input {...register("contract", { validate: AccAddress.validate })} />
      <label>Execute msg</label>
      <input {...register("msg", { validate: isJSON })} />
      <button type="submit">Submit</button>
      {txhash && <TxResult txhash={txhash} />}
    </form>
  )
}

export default ExecuteContract

/* utils */
const isJSON = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}
