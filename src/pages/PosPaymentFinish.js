import $ from 'jquery'
import Page from "./Page"
import posPaymentFinishView from "../templates/pos-payment-finish.handlebars"
import BasketService from "../services/BasketService"
import { listPrinters, printFormattedTextAndCut } from 'thermal-printer-cordova-plugin/www/thermal-printer'
import BasketLocalStorage from '../repositories/localstorage/BasketLocalStorage'
import currency from '../templates/helpers/currency'
import TransactionService from '../services/TransactionService'

class PosPaymentFinish extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()
    this.transactionService = new TransactionService()
  }

  async action() {
    const basketService = this.basketService
    const transactionService = this.transactionService

    let pay_method = {0: "Tunai", 1: "Debit/Credit", 2: "Tagihan Kamar"}

    const print = () => {
      listPrinters({ type: 'bluetooth' }, res => {
        console.log(res)
        if (typeof res[0] != 'undefined') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
          let time = new Date()
          time = [(time.getDate() < 10 ? '0' + time.getDate() : time.getDate()), months[time.getMonth()], time.getFullYear()].join(' ') + ' ' + [time.getHours(), time.getMinutes(), time.getSeconds()].join(':')

          let body = `[C]<b>HOTELMU POS</b>\n[C]${time}\n\n`
          // body += `[C]#FN-0001\n`
          if(BasketLocalStorage.get('type')){

            body += `[C]${pay_method[basketService.payment.payment_method]}\n`
  
            // for (const item of basketService.items) body += `[L]${item.name}[R]${item.qty}[R]${item.total.format()}\n`
            for (const item of basketService.items) {
  
              if(item.discount > 0){
                body += `[L]${item.name}[R](${item.discount}%) ${item.priceAfterDiscount.format()}\n${item.price} x ${item.qty}\n\n`
              }else{
                body += `[L]${item.name}[R]${item.total.format()}\n${item.price} x ${item.qty}\n\n`
              }
  
            } 
  
            body += `\n`
            body += `[L][L]Jumlah item[R]${basketService.totalQty.format()}\n`
            body += `[L][L]Total[R]${basketService.totalPrice.format()}\n`
            body += `[L][L]Pembayaran[R]${basketService.payment.total_payment.format()}\n`
            body += `[L][L]Kembalian[R]${basketService.payment.refund.format()}\n`
          
          }else{
            body += `[C]${pay_method[transactionService.payment.payment_method]}\n`
  
            // for (const item of transactionService.items) body += `[L]${item.name}[R]${item.qty}[R]${item.total.format()}\n`
            for (const item of transactionService.items) {
  
              if(item.discount > 0){
                body += `[L]${item.name}[R](${item.disc}%) ${item.priceAfterDiscount.format()}\n${item.price} x ${item.qty}\n\n`
              }else{
                body += `[L]${item.name}[R]${item.total.format()}\n${item.price} x ${item.qty}\n\n`
              }
  
            } 
  
            body += `\n`
            body += `[L][L]Jumlah item[R]${transactionService.totalqty.format()}\n`
            body += `[L][L]Total[R]${transactionService.total_prices.format()}\n`
            body += `[L][L]Pembayaran[R]${transactionService.payment.total_payment.format()}\n`
            body += `[L][L]Kembalian[R]${transactionService.payment.refund.format()}\n`
          }

          printFormattedTextAndCut({
            type: 'bluetooth',
            id: res[0].address,
            mmFeedPaper: 50,
            text: body
          })
        }
        else {
          alert("Printer tidak terdeteksi")
        }
      }, err => {
        console.log(err)
        alert("Printer tidak terdeteksi")
      })
    }

    if(BasketLocalStorage.get('type')){
      if(basketService.totalDiscount === 0){
        $('#total-disc').text('Rp'+0)
        $('#total-after-disc').text('Rp'+0)
      }else{
        $('#total-disc').closest('li').removeClass('d-none')
        $('#total-after-disc').closest('li').removeClass('d-none')
  
        $('#total-disc').text('Rp'+currency(basketService.totalDiscount))
        $('#total-after-disc').text('Rp'+currency(basketService.totalAfterDiscount))
      }
    }else{
      if(transactionService.totalDiscount === 0){
        $('#total-disc').text('Rp'+0)
        $('#total-after-disc').text('Rp'+0)
      }else{
        $('#total-disc').closest('li').removeClass('d-none')
        $('#total-after-disc').closest('li').removeClass('d-none')
  
        $('#total-disc').text('Rp'+currency(transactionService.totalDiscount))
        $('#total-after-disc').text('Rp'+currency(transactionService.totalAfterDiscount))
      }
    }

    $('#print-receive-btn').on('click', () => print())

    // BasketLocalStorage.clear()
    print()
  }

  render() {
    let pay_method = {0: "Tunai", 1: "Debit/Credit", 2: "Tagihan Kamar"}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    let time = new Date()
    time = [(time.getDate() < 10 ? '0' + time.getDate() : time.getDate()), months[time.getMonth()], time.getFullYear()].join(' ') + ' ' + [time.getHours(), time.getMinutes(), time.getSeconds()].join(':')

    if(BasketLocalStorage.get('type')){
      return posPaymentFinishView({ basket:this.basketService, pay_method: pay_method[this.basketService.payment.payment_method], time: time, type: 'basket' })
    }else{
      return posPaymentFinishView({ basket:this.transactionService, pay_method: pay_method[this.transactionService.payment.payment_method], time: time, type: 'draft' })
    }
  }
}

export default PosPaymentFinish