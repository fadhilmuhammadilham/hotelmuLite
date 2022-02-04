import Page from "./Page"
import homeView from "../templates/home.handlebars"
import TransactionApi from "../repositories/api/TransactionApi"
import listTransaction from '../templates/transaction-list.handlebars'
import $ from 'jquery'
import currency from '../templates/helpers/currency'
import UserLocalStorage from "../repositories/localstorage/UserLocalStorage"

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
      let total_sales = currency(summary.sales_today)
      $('#totalSaleToday').html(`Rp${total_sales}`)
      $('#totalTransactionToday').html(summary.transactions_today)
    })

    this.getNewTransaction((newTransactions) => {
      $('#new-transaction-list').html(listTransaction({transactions: newTransactions}))
    })
    
  }

  render() {
    return homeView({name: UserLocalStorage.get('name'), isSessionOpened: false})
  }
}

export default Home