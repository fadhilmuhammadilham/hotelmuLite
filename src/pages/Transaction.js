import Page from "./Page";
import transactionView from '../templates/transaction.handlebars'
import transactionListView from '../templates/transaction-list.handlebars'
import TransactionApi from "../repositories/api/TransactionApi";
import $ from 'jquery'

class Transaction extends Page {
  constructor(params) {
    super(params)
  }

  async getTransaction() {
    try {
      let res = await TransactionApi.getAll({order:'desc'})
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  async action() {
    let transactions = await this.getTransaction()
    $('#transaction-list').html(transactionListView({transactions}))
  }

  render() {
    return transactionView()
  }
}

export default Transaction