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
      let res = await TransactionApi.summaryToday()
      cb(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async getNewTransaction(cb) {
    try {
      let res = await TransactionApi.getAll({ limit: 10, order: 'desc' })
      cb(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async getOpenedShift(cb) {
    try {
      let res = await ShiftApi.opened()
      cb(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  action() {
    TransactionLocalStorage.removeAll()
    BasketLocalStorage.clear()

    this.getSummary((summary) => {
      let total_sales = parseFloat(summary.total_sales)
      $('#totalSaleToday').html(`${total_sales.format(2)}`)
      $('#totalTransactionToday').html(parseInt(summary.total_transactions).format(0, false))
    })

    this.getNewTransaction((newTransactions) => {
      $('#new-transaction-list').html(listTransaction({ transactions: newTransactions }))
    })

    const actionShift = () => {
      $('#closeSessionButton').on('click', function () {
        $('#DialogBasic-close-shift').modal('show');
      })

      $('#confirm-close-shift').on('click', async function (e) {
        $('#closeSessionButton').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`)
        $('#closeSessionButton').attr('disabled', true);
        $('#DialogBasic-close-shift').modal('hide');

        e.preventDefault();

        let res = await ShiftApi.close(ShiftLocalStorage.get('id'))

        if (res.status) {
          ShiftLocalStorage.set(res.data);
          Redirect('/shift/close');
        } else {
          alert(res.message);
        }

        $('#closeSessionButton').html(`Tutup`)
        $('#closeSessionButton').removeAttr('disabled');
      })
    }

    const viewShiftOpened = (shift) => {
      $('#sessionCard').html(`<div class="card-header d-flex">
          <div class="flex-grow-1 d-flex align-self-center">
              Shift
          </div>
          <div>
              <button class="btn btn-sm btn-secondary rounded" id="closeSessionButton" data-toggle="modal"
                  data-target="#dialogConfirmCloseSession">Tutup</button>
          </div>
      </div>
      
      <div id="sessionCardBody" class="card-body">
          <div class="flex-grow-1 ">
              <div class="">Tanggal Buka: <span id="dateAtSpan" class="font-weight-bold">${shift.start}</span></div>
              <div class="">Jam Buka: <span id="timeAtSpan" class="font-weight-bold">${shift.start_time}</span></div>
              <div class="">Saldo Awal: <span id="beginingBalanceAtSpan" class="font-weight-bold">${shift.begining_balance.format(2)}</span></div>
          </div>
      </div>`)
    }

    this.getOpenedShift(shift => {
      if (typeof shift.user.id != "undefined") {
        ShiftLocalStorage.set(shift)
        viewShiftOpened(shift)
        actionShift()
      }
    })

    actionShift()
  }

  render() {
    let shiftId = ShiftLocalStorage.get('id');
    return homeView({ name: UserLocalStorage.get('name'), isSessionOpened: shiftId ? true : false, shift: ShiftLocalStorage.getAll() })
  }
}

export default Home