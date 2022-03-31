import Page from "./Page"
import $ from "jquery"
import basketView from "../templates/basket.handlebars"
import basketItemView from "../templates/basket-item.handlebars"
import TransactionApi from "../repositories/api/TransactionApi"
import TransactionService from "../services/TransactionService"
import Redirect from "../core/Redirect"
import { listPrinters, printFormattedTextAndCut } from 'thermal-printer-cordova-plugin/www/thermal-printer'
import TableApi from "../repositories/api/TableApi"
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage"

class PosBasketDraft extends Page {
    constructor(params) {
        super(params)
    }

    async getTable() {
        try {
            let res = await TableApi.getAll()

            return res.data
        } catch (error) {
            console.log(error);            
        }
    }

    async addItems(item) {
        try {
            let res = await TransactionApi.addItem(item)

            return res.status
        } catch (error) {
            console.log(error);
        }
    }

    async updateItem(item_id, item, disc, note) {
        try {
            let res = await TransactionApi.updateItem(item_id, item, disc, note)

            return res.status
        } catch (error) {
            console.log(error);            
        }
    }

    async deleteItem(item_id) {
        try {
            let res = await TransactionApi.deleteItem(item_id)

            return res.status
        } catch (error) {
            console.log(error);            
        }
    }

    async action() {
        const transactionService = new TransactionService()
        const viewBasket = (transactionService) => {
            console.log(transactionService);
            $('.basket-items').html(basketItemView({items: transactionService.items}))
            $('#total-payment').text('Rp'+transactionService.total_prices.format())
            $('#total-diskon').text('(Rp'+transactionService.totalDiscount.format()+')')
            $('#total-after-diskon').text('Rp'+transactionService.totalAfterDiscount.format())
            $('#total-qty').text(transactionService.totalqty.format())
        }

        let type_id
        let discount_note

        viewBasket(transactionService)

        $('#print').on('click', () => {
            listPrinters({type: 'bluetooth'}, res => {
              console.log(res)
              if (typeof res[0] != 'undefined') {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
                let time = new Date()
                time = [(time.getDate() < 10 ? '0' + time.getDate() : time.getDate()), months[time.getMonth()], time.getFullYear()].join(' ') + ' ' + [time.getHours(), time.getMinutes(), time.getSeconds()].join(':')
      
                let body = `[C]<b>HOTELMU POS</b>\n[C]${time}\n\n`
      
                for(const item of transactionService.items) {
                //   body += `[L]${item.name}[R]${item.qty}[R]${item.total.format()}\n`
                  body += `[L]${item.name}[R]${item.total.format()}\n${item.price} x ${item.qty}\n`
                  if(item.note.length > 0){
                    body += `[L]*${item.note}\n`
                  }
                  body += `\n`

                }
                body += `\n`
                body += `[L][L]Jumlah item[R]${transactionService.totalqty.format()}\n`
                body += `[L][L]Total[R]${transactionService.total_prices.format()}\n`
                  
                
                
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

        $(document).on('click', '.btn-min', async (e) => {
            let id = $(e.currentTarget).closest('li').data('id')

            transactionService.qtyHandler(id, '-')
            let item = transactionService.items.find((item) => item.id == parseInt(id))
            if(typeof item != 'undefined'){
                let result = await this.updateItem(id, item.qty, item.disc)
                if(result){
                    viewBasket(transactionService);
                }
            }else{
                let result = await this.deleteItem(id);
                if(result){
                    viewBasket(transactionService);
                }
            }
        })

        $(document).on('click', '.btn-plus', async (e) => {
            let id = $(e.currentTarget).closest('li').data('id')

            transactionService.qtyHandler(id, '+')
            let item = transactionService.items.find((item) => item.id == parseInt(id))
            let result = await this.updateItem(id, item.qty, item.disc)
            if(result){
                viewBasket(transactionService);
            }
        })

        $(document).on('click', '.btn-delete-product', async (e) => {
            let id = $(e.currentTarget).closest('li').data('id')

            transactionService.removeItem(id)
            let res = await this.deleteItem(id)
            if(res){
                viewBasket(transactionService)
            }
        })

        $(document).on('click', '.item-select', (e) => {
            let id = $(e.currentTarget).closest('li').data('id')
            let item = TransactionLocalStorage.get('items')
            $('#item_id').val(id)
            $('#modal-diskon').modal('show')

            item.forEach((menu, index) => {
                if(id == menu.id) {
                    $('#diskon-item').val(menu.disc)
                    $('#catatan_item').val(menu.note)
                }
            })
        })

        $('#btn-terapkan').on('click', async (e) => {
            let item_id = $('#item_id').val()
            let discount = $('#diskon-item').val()
            let note = $('#catatan_item').val()
            let item = TransactionLocalStorage.get('items')
            let item_filter = item.find(item => item.id === parseInt(item_id))
            let qty = item_filter.qty

            transactionService.discAndNoteHandler(item_id, parseFloat(discount), note)
            
            let res = await this.updateItem(item_id, qty, parseFloat(discount), note)

            if(res){
                $('#modal-diskon').modal('hide')
    
                $('#item_id').val('')
                $('#diskon-item').val('')
                $('#catatan_item').val('')
                window.location.reload();
            }

        })

        $(document).on('keyup', '#jumlah-tamu', () => {
            transactionService.setGuest(parseInt($('#jumlah-tamu').val()));
        })

        if(TransactionLocalStorage.get('table_id')){
            let table_exist = TransactionLocalStorage.get('table_id')
            let table = await this.getTable()
            let meja = table.find(table => table.id === table_exist)
            $('#nomor-meja').text(meja.name)
        }

        if(TransactionLocalStorage.get('number_of_guest') > 0){
            $('#jumlah-tamu').val(TransactionLocalStorage.get('number_of_guest'))
        }

        const checkDiscount = () => {
            if($('.type-disc').hasClass('active') && $('#jumlah-diskon').val().length > 0) {
                transactionService.setDiscount({
                    discount_type: type_id,
                    discount: parseFloat($('#jumlah-diskon').val()),
                    discount_note: discount_note
                })
                viewBasket(transactionService)
            }
        }

        checkDiscount()

        $('.type-disc').on('click', (e) => {
            $('.type-disc').removeClass('active')
            $(e.currentTarget).addClass('active')
            type_id = $(e.currentTarget).data('type_id')
            checkDiscount()    
        })

        $('.note-disc').on('click', (e) => {
            $('.note-disc').removeClass('active')
            $(e.currentTarget).addClass('active')
            discount_note = $(e.currentTarget).data('note_type')
            checkDiscount()
        })

        $(document).on('keyup', '#jumlah-diskon', () => {
            checkDiscount()

            let jml_disc = $('#jumlah-diskon').val()
            if(type_id === 0){
                $('#jumlah-diskon').attr('maxlength', 3)
                if(parseInt(jml_disc) > 99) {
                    $('#jumlah-diskon').val(100)
                    $('#cat_diskon').removeClass('d-none')
                }else{
                    $('#cat_diskon').addClass('d-none')
                }
            }else{
                $('#jumlah-diskon').attr('maxlength', transactionService.total_prices.toString().length)
                if(parseInt(jml_disc) > transactionService.total_prices){
                    $('#jumlah-diskon').val(transactionService.total_prices)
                    $('#cat_diskon').removeClass('d-none')
                }else{
                    $('#cat_diskon').addClass('d-none')
                }
            }
        })

        if(TransactionLocalStorage.get('discount').hasOwnProperty('discount')) {
            let disc_item = TransactionLocalStorage.get('discount');
            console.log(disc_item.discount);
            $('#jumlah-diskon').val(disc_item.discount);

            $('.type-disc').each((index, item) => {
                if($(item).data('type_id') === disc_item.discount_type) {
                    $(item).addClass('active')
                }
            })

            $('.note-disc').each((index, item) => {
                if($(item).data('note_type') === disc_item.discount_note) {
                    $(item).addClass('active')
                }
            })

            transactionService.setDiscount({
                discount_type: disc_item.discount_type,
                discount: disc_item.discount,
                discount_note: disc_item.discount_note
            })
        }

        $('#save-transaction').on('click', async (e) => {
            let jumlah_tamu = TransactionLocalStorage.get('number_of_guest')
            let trx_id = TransactionLocalStorage.get('id')
            e.preventDefault()

            if(jumlah_tamu == 0) {
                alert('Silahkan isi Jumlah Tamu terlebih dahulu!')
            }

            if(jumlah_tamu !== 0){
                let res = await TransactionApi.update(trx_id, 0)

                if(res.status){
                    alert("Transaksi Berhasil Disimpan")
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

export default PosBasketDraft