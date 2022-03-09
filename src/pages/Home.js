import Page from "./Page"
import homeView from "../templates/home.handlebars"
import TransactionApi from "../repositories/api/TransactionApi"
import listTransaction from '../templates/transaction-list.handlebars'
import $ from 'jquery'
import currency from '../templates/helpers/currency'
import UserLocalStorage from "../repositories/localstorage/UserLocalStorage"
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage"
import ShiftApi from "../repositories/api/ShiftApi"
import Redirect from "../core/Redirect"
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage"
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"

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
    TransactionLocalStorage.removeAll()
    BasketLocalStorage.clear()
    
    this.getSummary((summary) => {
      let total_sales = currency(summary.sales_today)
      $('#totalSaleToday').html(`Rp${total_sales}`)
      $('#totalTransactionToday').html(summary.transactions_today)
    })

    this.getNewTransaction((newTransactions) => {
      $('#new-transaction-list').html(listTransaction({transactions: newTransactions}))
    })

    $('#closeSessionButton').on('click', function(){
      $('#DialogBasic-close-shift').modal('show');
    })
    
    $('#confirm-close-shift').on('click', async function(e) {
      $('#closeSessionButton').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`)
      $('#closeSessionButton').attr('disabled', true);
      $('#DialogBasic-close-shift').modal('hide');

      e.preventDefault();

      let res = await ShiftApi.close(ShiftLocalStorage.get('id'))

      if(res.status){
        ShiftLocalStorage.set(res.data);
        Redirect('/shift/close');
      }else{
        alert(res.message);
      }

      $('#closeSessionButton').html(`Tutup`)
      $('#closeSessionButton').removeAttr('disabled');
    })

    $('#new-transaction-list').off('click').on('click', '.item-transaction', async (even) => {
      let trx_id = $(even.currentTarget).data('trx_id')

      let trx = await TransactionApi.detail(trx_id);
      TransactionLocalStorage.set(trx.data)
      Redirect(`/transaction/detail`, false)
    })
  }

  render() {
    let shiftId = ShiftLocalStorage.get('id');
    return homeView({name: UserLocalStorage.get('name'), isSessionOpened: shiftId ? true : false, shift: ShiftLocalStorage.getAll()})
  }
}

export default Home