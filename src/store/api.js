import axios from 'axios'
import {baseUrl} from '@/utils/utils.js'

const defaults = {
  baseURL: baseUrl(),
  transformResponse: [(data) => {
    return JSON.parse(replaceImageUrl(data))
  }]
}

Object.assign(axios.defaults, defaults)
export const xzxm = () => {
  return axios.get("/expenseApply/selectProject?pageSize=10")
}
export const xzkm = () => {
  return axios.get("/expenseApply/selectCost?pageSize=10")
}
function replaceImageUrl (str) {
  let reg = /https?:(\\?\/){2}(pic\d*\.zhimg\.com\\?\/)/g
  return str.replace(reg, 'https://images.weserv.nl/?url=$2')
}