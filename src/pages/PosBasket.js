import Page from "./Page"
import basketView from "../templates/basket.handlebars"
import basketItemView from '../templates/basket-item.handlebars'
import BasketService from "../services/BasketService"
import $ from "jquery"
import { listPrinters, printFormattedTextAndCut } from 'thermal-printer-cordova-plugin/www/thermal-printer'
import TableLocalStorage from "../repositories/localstorage/TableLocalStorage"
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"
import TransactionApi from "../repositories/api/TransactionApi"
import Redirect from "../core/Redirect"

class PosBasket extends Page {
  constructor(params) {
    super(params)
  }

  async action() {
    const basketService = new BasketService()
    const viewBasket = (basketService) => {
      $('.basket-items').html(basketItemView({items: basketService.items}))
      $('#total-payment').text(basketService.totalPrice.format())
			$('#total-qty').text(basketService.totalQty.format())
    }

    viewBasket(basketService)

    if(!BasketLocalStorage.get('table')){
      console.log('waww')
    }else{
      console.log(BasketLocalStorage.get('table'))
    }
    
    $('#print').on('click', () => {
      listPrinters({type: 'bluetooth'}, res => {
        console.log(res)
        if (typeof res[0] != 'undefined') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
          let time = new Date()
          time = [(time.getDate() < 10 ? '0' + time.getDate() : time.getDate()), months[time.getMonth()], time.getFullYear()].join(' ') + ' ' + [time.getHours(), time.getMinutes(), time.getSeconds()].join(':')

          let body = `[C]<b>HOTELMU POS</b>\n[C]${time}\n\n`

          for(const item of basketService.items) body += `[L]${item.name}[R]${item.qty}[R]${item.total.format()}\n`
          
          body += `\n`
          body += `[L][L]Jumlah item[R]${basketService.totalQty.format()}\n`
          body += `[L][L]Total[R]${basketService.totalPrice.format()}\n`
          
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
    })

    $(document).on('click', '.btn-min', (event) => {
			let id = $(event.currentTarget).closest('li').data('id')
			
			basketService.qtyHandler(id, '-');
			viewBasket(basketService)
		})

		$(document).on('click', '.btn-plus', (event) => {
			let id = $(event.currentTarget).closest('li').data('id')
			
			basketService.qtyHandler(id, '+');
			viewBasket(basketService)
		})
		
		$(document).on('click', '.btn-delete-product', (event) => {
			let id = $(event.currentTarget).closest('li').data('id')
			
			basketService.removeItem(id)
			viewBasket(basketService)
		})

    if(BasketLocalStorage.get('table')){
      let table = BasketLocalStorage.get('table');
      let nama_meja = table.table_name;
      $('#nomor-meja').text(nama_meja)
    }

    if(BasketLocalStorage.get('guest')) {
      let guest = BasketLocalStorage.get('guest');
      let nama_tamu = guest.guest_name
      $('#nama-tamu').text(nama_tamu)
    }

    $('#save-transaction').on('click', async (e) => {
      const jumlah_tamu = $('#jumlah-tamu').val()
      let is_room = BasketLocalStorage.get('type').isroom
      let table = BasketLocalStorage.get('table')
      e.preventDefault()
      console.log(table.hasOwnProperty('id'))

      if(!table.hasOwnProperty('id') && is_room !== "1"){
        alert('Silahkan Pilih Meja terlebih dahulu!')
      }

      if(jumlah_tamu === "0"){
        alert('Silahkan isi Jumlah Tamu terlebih dahulu!')
      }

      if(table.hasOwnProperty('id') && jumlah_tamu !== "0"){
          let res = await TransactionApi.save(jumlah_tamu)

          if(res.status){
            alert("Transaksi Berhasil Disimpan")
            basketService.clear()
            Redirect('/', true)
          }else{
            alert("Transaksi Gagal Disimpan")
            console.log(res);
          }
      }
    })
  }

  render() {
    return basketView()
  }
}

export default PosBasket