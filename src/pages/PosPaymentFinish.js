import $ from 'jquery'
import Page from "./Page"
import posPaymentFinishView from "../templates/pos-payment-finish.handlebars"
import { listPrinters, printFormattedTextAndCut } from 'thermal-printer-cordova-plugin/www/thermal-printer'
import TransactionApi from '../repositories/api/TransactionApi'
import ConfigLocalStorage from '../repositories/localstorage/ConfigLocalStorage'
import BasketLocalStorage from '../repositories/localstorage/BasketLocalStorage'
import MyToast from '../utils/MyToast'

class PosPaymentFinish extends Page {
  constructor(params) {
    super(params)
  }

  async getDetail(cb) {
    try {
      let trx = await TransactionApi.detail(this.params.transaction_id);

      trx.data.discount_text = trx.data.discount > 0 ? (trx.data.discount_type == '%' ? `${trx.data.discount}% (${(trx.data.total_sub * (trx.data.discount / 100)).format(2)})` : `(${trx.data.discount.format(2)})`) : '(' + (0).format(2) + ')'

      cb(trx.data)
    } catch (error) {
      console.log(error)
    }
  }

  print(transactionDetail) {
    let hotelName = ConfigLocalStorage.get('hotelName')

    let res = new Promise(resolve => {
      listPrinters({ type: 'bluetooth' }, res => {
        if (typeof res[0] == 'undefined') {
          MyToast.show("Printer tidak terdeteksi")

          resolve(false)
          return
        }

        let body = `[C]<b>${hotelName}</b>\n[C]${transactionDetail.trx_date}\n\n`
        body += `[C]#${transactionDetail.trx_number}\n`

        body += `[C]${transactionDetail.payment.payment_method}\n\n`

        for (const item of transactionDetail.items) {
          if (item.discount > 0) {
            body += `[L]${item.name}[R](${item.discount}%) ${item.total.format(2)}\n<s>${item.price}</s> ${item.price_after_discount} x ${item.qty}\n\n`
          } else {
            body += `[L]${item.name}[R]${item.total.format(2)}\n${item.price} x ${item.qty}\n\n`
          }
        }

        body += `[L]Sub Total[R]${transactionDetail.total_sub.format(2)}\n`
        body += `[L]Diskon[R]${transactionDetail.discount_text}\n`
        body += `[L]Round[R]${transactionDetail.round.format(2)}\n`
        body += `[L]Total[R]${transactionDetail.total.format(2)}\n`
        body += `[L]Pembayaran[R]${transactionDetail.payment.total_payment.format(2)}\n`
        body += `[L]Kembalian[R]${transactionDetail.payment.refund.format(2)}\n`

        printFormattedTextAndCut({
          type: 'bluetooth',
          id: res[0].address,
          mmFeedPaper: 50,
          text: body
        }, res => resolve(true), err => resolve(false))

      }, async err => {
        resolve(false)
        await MyToast.show("Printer tidak terdeteksi")
      })
    })

    return res
  }

  async action() {
    BasketLocalStorage.clear()

    this.getDetail((transactionDetail) => {
      if (transactionDetail.payment.payment_method == 'Credit') {
        transactionDetail.payment.payment_method = transactionDetail.payment.payment_method_settlement + ' (' + transactionDetail.payment.edc.name + ')'
      }

      $('#app').html(posPaymentFinishView(transactionDetail))

      const printHanlder = async () => {
        $('#print-receive-btn').attr('disabled', true)
        $('#print-receive-btn').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`)

        await this.print(transactionDetail)
        $('#print-receive-btn').attr('disabled', false)
        $('#print-receive-btn').html(`Cetak ulang struk`)
      }

      $('#print-receive-btn').on('click', printHanlder)

      if (ConfigLocalStorage.get('automaticPrint')) printHanlder()
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