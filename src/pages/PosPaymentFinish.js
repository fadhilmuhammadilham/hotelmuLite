import $ from 'jquery'
import Page from "./Page"
import posPaymentFinishView from "../templates/pos-payment-finish.handlebars"
import BasketService from "../services/BasketService"
import { listPrinters, printFormattedTextAndCut } from 'thermal-printer-cordova-plugin/www/thermal-printer'
import BasketLocalStorage from '../repositories/localstorage/BasketLocalStorage'

class PosPaymentFinish extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()
  }

  async action() {
    const basketService = this.basketService;

    const print = () => {
      listPrinters({ type: 'bluetooth' }, res => {
        console.log(res)
        if (typeof res[0] != 'undefined') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
          let time = new Date()
          time = [(time.getDate() < 10 ? '0' + time.getDate() : time.getDate()), months[time.getMonth()], time.getFullYear()].join(' ') + ' ' + [time.getHours(), time.getMinutes(), time.getSeconds()].join(':')

          let body = `[C]<b>HOTELMU POS</b>\n[C]${time}\n\n`
          body += `[C]#FN-0001\n`
          body += `[C]TUNAI\n`

          for (const item of basketService.items) body += `[L]${item.name}[R]${item.qty}[R]${item.total.format()}\n`

          body += `\n`
          body += `[L][L]Jumlah item[R]${basketService.totalQty.format()}\n`
          body += `[L][L]Total[R]${basketService.totalPrice.format()}\n`
          body += `[L][L]Pembayaran[R]${(35000).format()}\n`
          body += `[L][L]Kembalian[R]${(35000).format()}\n`

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

    $('#print-receive-btn').on('click', () => print())

    BasketLocalStorage.clear()
    print()
  }

  render() {
    return posPaymentFinishView({ basket:this.basketService })
  }
}

export default PosPaymentFinish