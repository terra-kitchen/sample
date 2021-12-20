import { useQuery } from "react-query"
import axios from "axios"

const fcd = "https://fcd.terra.dev"
const account = "terra1ac2u4fekndumvj0ycutlahcf32se88prljf0m3"

export const useHistory = () => {
  return useQuery(
    "history",
    async () => {
      const { data } = await axios.get("/v1/txs", {
        baseURL: fcd,
        params: { account, offset: 196155438 },
      })

      return data
    },
    {}
  )
}
