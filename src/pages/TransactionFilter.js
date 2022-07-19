import Page from "./Page";
import $ from "jquery";
import transactionFilterView from "../templates/transaction-filter.handlebars"
import TransactionFilterLocalStorage from "../repositories/localstorage/TransactionFilterLocalStorage";

class TransactionFilter extends Page {
  constructor(params) {
    super(params)

    let filtered = TransactionFilterLocalStorage.getAll();

    this.data = {
      status: typeof filtered.status != 'undefined' ? filtered.status : [],
      trxNumber: typeof filtered.trxNumber != 'undefined' ? filtered.trxNumber : '',
      trxDate: typeof filtered.trxDate != 'undefined' ? filtered.trxDate : '',
    }
  }

  action() {
    $('#kode_transaksi').val(this.data.trxNumber)
    $('#tanggal').val(this.data.trxDate)

    $('.status-transaksi').each((i, item) => {
      let _status = $(item).data('id')
      if (this.data.status.includes(_status)) {
        $(item).addClass('active')
      }
    })

    $('.status-transaksi').on('click', async (e) => {
      if ($(e.currentTarget).hasClass('active'))
        $(e.currentTarget).removeClass('active')
      else
        $(e.currentTarget).addClass('active')

      this.data.status = []

      $('.status-transaksi').each((i, el) => {
        if ($(el).hasClass('active')) {
          this.data.status.push($(el).data('id'))
        }
      })
    })

    $('#btn-filter').on('click', (e) => {
      if ($('#kode_transaksi').val().length > 0 || $('#tanggal').val().length > 0 || this.data.status.length > 0) {
        this.data.trxDate = $('#tanggal').val()
        this.data.trxNumber = $('#kode_transaksi').val()

        TransactionFilterLocalStorage.set(this.data)
        window.history.back();
      } else {
        TransactionFilterLocalStorage.removeAll();
        window.history.back();
      }
    })
  }

  render() {
    return transactionFilterView();
  }
}

export default TransactionFilter