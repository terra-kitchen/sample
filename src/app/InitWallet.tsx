import { PropsWithChildren } from "react"
import { useWallet, WalletStatus } from "@terra-money/wallet-provider"

const InitWallet = ({ children }: PropsWithChildren<{}>) => {
  const { status } = useWallet()
  return status === WalletStatus.INITIALIZING ? null : <>{children}</>
}

export default InitWallet
