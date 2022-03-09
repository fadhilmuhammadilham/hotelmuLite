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

    async updateItem(item_id, item) {
        try {
            let res = await TransactionApi.updateItem(item_id, item)

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
                  body += `[L]${item.name}[R]${item.total.format()}\n${item.price} x ${item.qty}\n\n`
                //   if(item.note.length > 0){
                //     body += `[L]*${item.note}\n\n`
                //   }
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

        $(document).on('click', '.btn-delete-product', (e) => {
            let id = $(e.currentTarget).closest('li').data('id')

            transactionService.removeItem(id)
            viewBasket(transactionService)
        })

        $(document).on('click', '.item-select', (e) => {
            let id = $(e.currentTarget).closest('li').data('id')
            let item = TransactionLocalStorage.get('items')
            $('#item_id').val(id)
            $('#molda-diskon').modal('show')

            item.forEach((menu, index) => {
                if(id == menu.id) {
                    $('#diskon-item').val(menu.discount)
                    $('#catatan_item').val(menu.note)
                }
            })
        })

        $('#btn-terapkan').on('click', (e) => {
            let item_id = $('#item_id').val()
            let discount = $('#diskon-item').val()
            let note = $('#catatan_item').val()
            
            $('#molda-diskon').modal('hide')

            $('#item_id').val('')
            $('#diskon-item').val('')
            $('#catatan_item').val('')
            window.location.reload();
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

        if(TransactionLocalStorage.get('numberOfGuest') > 0){
            $('#jumlah-tamu').val(TransactionLocalStorage.get('numberOfGuest'))
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

            $('#jumlah-diskon').val(disc_item.discount);

            $('.type-disc').each((index, item) => {
                if($(item).data('type_id') === disc_item.discount_type) {
                    $(iten).addClass('active')
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
    }

    render() {
        return basketView()
    }
}

export default PosBasketDraft