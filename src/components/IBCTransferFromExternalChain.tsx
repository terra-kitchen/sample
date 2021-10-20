import {
  Coin,
  LCDClient,
  MnemonicKey,
  MsgTransfer,
} from "@terra-money/terra.js"

const channel = "channel-2"

const mk = new MnemonicKey({
  mnemonic:
    "notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius",
}) // terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v

const lcd = new LCDClient({
  chainID: "localterra",
  URL: "http://15.165.39.239:1317",
  gasPrices: { uusd: 0.38 },
})

const wallet = lcd.wallet(mk)

const msg = new MsgTransfer(
  "transfer",
  channel,
  new Coin("uluna", 1000),
  mk.accAddress,
  mk.accAddress,
  undefined,
  (Date.now() + 60 * 1000) * 1e6
)

const IBCTransferFromExternalChain = () => {
  const post = async () => {
    const tx = await wallet.createAndSignTx({ msgs: [msg] })
    const result = await lcd.tx.broadcast(tx)
    console.log(result)
  }

  return (
    <section>
      <h1>{channel}</h1>
      <button onClick={post}>IBC Transfer from external chain (http)</button>
    </section>
  )
}

export default IBCTransferFromExternalChain
