import Page from "./Page"
import homeView from "../templates/home.handlebars"
import TransactionApi from "../repositories/api/TransactionApi"
import listTransaction from '../templates/transaction-list.handlebars'
import $ from 'jquery'

class Home extends Page {
  constructor(params) {
    super(params)
  }

  async getSummary(cb) {
    try {
      let res = await TransactionApi.summary()
      cb(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async getNewTransaction(cb) {
    try {
      let res = await TransactionApi.getAll({limit: 10, order: 'desc'})
      cb(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  action() {
    this.getSummary((summary) => {
      $('#totalSaleToday').html(`Rp${summary.sales_today}`)
      $('#totalTransactionToday').html(summary.transactions_today)
    })

    this.getNewTransaction((newTransactions) => {
      $('#new-transaction-list').html(listTransaction({transactions: newTransactions}))
    })
    
  }

  render() {
    return homeView({name: "fatah", isSessionOpened: false})
  }
}

export default Home