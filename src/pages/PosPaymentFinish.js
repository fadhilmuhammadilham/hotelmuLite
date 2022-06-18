import $ from 'jquery'
import Page from "./Page"
import posPaymentFinishView from "../templates/pos-payment-finish.handlebars"
import { listPrinters, printFormattedTextAndCut } from 'thermal-printer-cordova-plugin/www/thermal-printer'
import TransactionApi from '../repositories/api/TransactionApi'

class PosPaymentFinish extends Page {
  constructor(params) {
    super(params)
  }

  async getDetail(cb) {
    try {
      let trx = await TransactionApi.detail(this.params.transaction_id);

      trx.data.discount_text = trx.data.discount > 0 ? (trx.data.discount_type == '%' ? `${trx.data.discount}% (Rp${(trx.data.total_sub * (trx.data.discount / 100)).format()})` : `(Rp${trx.data.discount})`) : '(Rp0)'

      cb(trx.data)
    } catch (error) {
      console.log(error)
    }
  }

  print(transactionDetail) {

    listPrinters({ type: 'bluetooth' }, res => {
      if (typeof res[0] == 'undefined') {
        alert("Printer tidak terdeteksi")
        return
      }

      let body = `[C]<b>HOTELMU POS</b>\n[C]${transactionDetail.trx_date}\n\n`
      body += `[C]#${transactionDetail.trx_number}\n`

      body += `[C]${pay_method[transactionDetail.payment.payment_method]}\n`

      for (const item of transactionDetail.items) {
        if (item.discount > 0) {
          body += `[L]${item.name}[R](${item.discount}%) ${item.total.format()}\n<s>${item.price}</s> ${item.price_after_discount} x ${item.qty}\n\n`
        } else {
          body += `[L]${item.name}[R]${item.total.format()}\n${item.price} x ${item.qty}\n\n`
        }
      }

      body += `\n`
      body += `[L]Sub Total[R]${transactionDetail.total_sub.format()}\n`
      body += `[L]Diskon[R]${transactionDetail.discount_text}\n`
      body += `[L]Round[R]${transactionDetail.round.format()}\n`
      body += `[L]Total[R]${transactionDetail.total.format()}\n`
      body += `[L]Pembayaran[R]${transactionDetail.payment.total_payment.format()}\n`
      body += `[L]Kembalian[R]${transactionDetail.payment.refund.format()}\n`

      printFormattedTextAndCut({
        type: 'bluetooth',
        id: res[0].address,
        mmFeedPaper: 50,
        text: body
      })

    }, err => {
      console.log(err)
      alert("Printer tidak terdeteksi")
    })
  }

  async action() {

    this.getDetail((transactionDetail) => {
      if (transactionDetail.payment.payment_method == 'Credit') {
        transactionDetail.payment.payment_method = transactionDetail.payment.payment_method_settlement + ' (' + transactionDetail.payment.edc.name + ')'
      }

      $('#app').html(posPaymentFinishView(transactionDetail))
      $('#print-receive-btn').on('click', () => this.print(transactionDetail))

      this.print(transactionDetail)
    })

  }

  render() {

    return `<div class="text-center py-3" style="
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 99999;
      background: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;">
      <span class="spinner-border" role="status" aria-hidden="true"></span>
    </div>`
  }
}

export default PosPaymentFinish