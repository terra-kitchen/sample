import { isTxError, Tx } from "@terra-money/terra.js"
import { getTxCanonicalMsgs } from "@terra-money/log-finder-ruleset"
import { createActionRuleSet } from "@terra-money/log-finder-ruleset"
import { createLogMatcherForActions } from "@terra-money/log-finder-ruleset"

interface Received {
  limit: number
  next: number
  txs: Item[]
}

type Item = any

const LIMIT = 3

const parse = (item: Item) => {
  const { txhash, timestamp, tx, raw_log } = item
  const { fee, memo } = tx.value
  const success = !isTxError(item)

  /* log-finder-ruleset */
  const ruleset = createActionRuleSet("mainnet")
  const logMatcher = createLogMatcherForActions(ruleset)
  const getCanonicalMsgs = (tx: Tx) => {
    const matchedMsg = getTxCanonicalMsgs(JSON.stringify(tx), logMatcher)
    return matchedMsg
      ? matchedMsg
          .map((matchedLog) => matchedLog.map(({ transformed }) => transformed))
          .flat(2)
      : []
  }

  const msgs = getCanonicalMsgs(item)
    .filter((item) => item)
    .map((item) => {
      if (!item) throw new Error()
      const { payload, ...rest } = item
      return rest
    })

  const collapsed = Math.max(msgs.length - LIMIT, 0)

  return Object.assign(
    {
      txhash,
      timestamp: new Date(timestamp).getTime(),
      success,
      msgs: msgs.slice(0, LIMIT),
      fee: fee.amount,
    },
    collapsed && { collapsed },
    memo && { memo },
    !success && { raw_log }
  )
}

const parser = ({ txs, ...response }: Received) => {
  return { ...response, list: txs.map(parse) }
}

export default parser
