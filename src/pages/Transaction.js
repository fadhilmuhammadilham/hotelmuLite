import Page from "./Page";
import transactionView from '../templates/transaction.handlebars'
import transactionListView from '../templates/transaction-list.handlebars'
import TransactionApi from "../repositories/api/TransactionApi";
import $ from 'jquery'
import InfiniteScroll from 'infinite-scroll'
import TransactionFilterLocalStorage from "../repositories/localstorage/TransactionFilterLocalStorage";

class Transaction extends Page {
  constructor(params) {
    super(params)
  }

  async getTransaction() {
    try {
      let res = await TransactionApi.getAll({limit: 20, order:'desc'})
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  async getFilteredTransaction() {
    try {
      let res = await TransactionApi.getByFilter();
      return res.data
    } catch (error) {
      console.log(error)      
    }
  }

  async action() {
    // let infScroll = new InfiniteScroll('.trx',{
    //   path: () => {
    //     let offset = (this.pageIndex + 1) * 20
    //     return `${API.url}/resto/transaction?limit=${20}&offset=${offset}`
    //   },
    //   append: '.trx-item',
    //   history: false
    // })

    // infScroll.on('load.infiniteScroll', (event, body) => {
    //   console.log(event);
    //   console.log(body);
    // })
    $('#eraser-btn').on('click', () => {
      TransactionFilterLocalStorage.removeAll()
      window.location.reload()
    })

    let is_filtered = TransactionFilterLocalStorage.getAll();
    let transactions

    if(Object.keys(is_filtered).length === 0){
      transactions = await this.getTransaction()
    }else{
      transactions = await this.getFilteredTransaction()
    }

    $('#transaction-list').html(transactionListView({transactions}))
  }

  render() {
    let is_filtered = TransactionFilterLocalStorage.getAll();
    return transactionView({is_filtered: Object.keys(is_filtered).length === 0 ? false : true})
  }
}

export default Transaction