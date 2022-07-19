import Page from "./Page"
import $ from "jquery"
import basketView from "../templates/basket.handlebars"
import basketItemView from "../templates/basket-item.handlebars"
import TransactionApi from "../repositories/api/TransactionApi"
import Redirect from "../core/Redirect"
import { listPrinters, printFormattedTextAndCut } from 'thermal-printer-cordova-plugin/www/thermal-printer'
import TableApi from "../repositories/api/TableApi"
import BasketService from "../services/BasketService"
import AutoNumeric from 'autonumeric'
import MyToast from '../utils/MyToast';

class PosBasketDraft extends Page {
  constructor(params) {
    super(params)
  }

  async getTable(outletId) {
    try {
      let res = await TableApi.getAll(outletId)

      return res.data
    } catch (error) {
      console.log(error);
    }
  }

  async updateItem(transactionId, itemId, qty, disc, note) {
    try {
      let res = await TransactionApi.updateItem(transactionId, itemId, qty, disc, note)

      return res.status
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItem(transactionId, itemId) {
    try {
      let res = await TransactionApi.deleteItem(transactionId, itemId)

      return res.status
    } catch (error) {
      console.log(error);
    }
  }

  async updateTransaction(basketService) {
    try {
      let res = await TransactionApi.update(basketService)

      return res.status
    } catch (error) {
      console.log(error);
    }
  }

  async print(basketService, type = 0) {
    const types = { 1: 'Dapur', 2: 'Pantry' }
    let items = basketService.items
    let _type = ''

    if (type != 0) {
      _type = types[type]
      items = basketService.items.filter(item => parseInt(item.category.type) == type)
    }

    if (items.length < 1) {
      await MyToast.show(`Tidak ada menu untuk ${_type}`);
      return
    }

    listPrinters({ type: 'bluetooth' }, res => {

      if (typeof res[0] != 'undefined') {
        let time = DateCustom.getNowFormated()

        let body = `[C]<b>HOTELMU POS</b>\n[C]${time}\n\n`

        if (type != 0) body += `[C]${_type}\n\n`

        for (const item of items) {
          body += `[L]${item.name}[R]${item.qty}[R]${item.total.format()}\n`
          if (item.note.length > 0) {
            body += `[L]*${item.note}\n\n`
          }
        }

        body += `\n`

        if (type == 0) {
          body += `[L][L]Jumlah item[R]${basketService.totalQty.format()}\n`
          body += `[L][L]Total[R]${basketService.total.format()}\n`
        }

        printFormattedTextAndCut({
          type: 'bluetooth',
          id: res[0].address,
          mmFeedPaper: 50,
          text: body
        })
      }
      else {
        MyToast.show("Printer tidak terdeteksi")
      }
    }, err => {
      console.log(err)
      MyToast.show("Printer tidak terdeteksi")
    })
  }

  async action() {
    const basketService = new BasketService()

    const viewBasket = (basketService) => {
      $('.basket-items').html(basketItemView({ items: basketService.items }))
      $('#total-sub').text('Rp' + basketService.totalSub.format(2))
      $('#total-discount').text('(Rp' + basketService.totalDiscount.format(2) + ')')
      $('#total').text('Rp' + basketService.total.format(2))
      $('#total-qty').text(basketService.totalQty.format())
      $('#total-round').text('Rp' + basketService.totalRound.format(2))
    }

    if (basketService.type.isroom == '1') {
      $('#order-info').addClass('d-none');
    }

    let type_id = typeof basketService.discount.discount_type != "undefined" ? basketService.discount.discount_type : null
    let discount_note = typeof basketService.discount.discount_note != "undefined" ? basketService.discount.discount_note : null

    viewBasket(basketService)

    $('#print').on('click', () => {
      this.print(basketService)
    })

    $('#printKitchen').on('click', () => {
      this.print(basketService, 1)
    })

    $('#printBeverage').on('click', () => {
      this.print(basketService, 2)
    })

    $(document).on('click', '.form-qty .btn-min', async (e) => {
      let id = $(e.currentTarget).closest('li').data('id')

      basketService.qtyHandler(id, '-')
      let item = basketService.items.find((item) => item.id == parseInt(id))

      if (typeof item != 'undefined') {
        let result = await this.updateItem(basketService.id, id, item.qty, item.disc, item.note)

        if (result) {
          viewBasket(basketService);
        }
      } else {
        let result = await this.deleteItem(basketService.id, id);

        if (result) {
          viewBasket(basketService);
        }
      }
    })

    $(document).on('click', '.form-qty .btn-plus', async (e) => {
      let id = $(e.currentTarget).closest('li').data('id')

      basketService.qtyHandler(id, '+')

      let item = basketService.items.find((item) => item.id == parseInt(id))
      let result = await this.updateItem(basketService.id, id, item.qty, item.disc, item.note)

      if (result) {
        viewBasket(basketService);
      }
    })

    $(document).on('click', '.btn-delete-product', async (e) => {
      let id = $(e.currentTarget).closest('li').data('id')

      basketService.removeItem(id)
      let res = await this.deleteItem(basketService.id, id)
      if (res) {
        viewBasket(basketService)
      }
    })

    $(document).on('click', '.item-select', (e) => {
      let id = $(e.currentTarget).closest('li').data('id')
      let item = basketService.items.find(_item => _item.id == id)

      $('#item_id').val(id)
      $('#modal-diskon').modal('show')
      $('#diskon-item').val(item.discount || '')
      $('#catatan_item').val(item.note)
    })

    $('#discount-form').on('submit', async (e) => {
      e.preventDefault()

      let itemId = $('#item_id').val()
      let discount = $('#diskon-item').val()
      let note = $('#catatan_item').val()

      basketService.discAndNoteHandler(itemId, parseFloat(discount || 0), note)
      $('.basket-items').html(basketItemView({ items: basketService.items }))

      let item = basketService.items.find(_item => _item.id == parseInt(itemId))

      await this.updateItem(basketService.id, itemId, item.qty, item.discount, item.note)

      $('#modal-diskon').modal('hide')

      $('#item_id').val('')
      $('#diskon-item').val('')
      $('#catatan_item').val('')

      viewBasket(basketService)
    })

    $(document).on('keyup change', '#jumlah-tamu', () => {
      basketService.setNumberOfGuest(parseInt($('#jumlah-tamu').val()))

      this.updateTransaction(basketService)
    })

    $('.form-guest-total .btn-min').on('click', (event) => {
      let guestTotal = $('#jumlah-tamu').val()
      guestTotal = guestTotal - 1

      $('#jumlah-tamu').val(guestTotal < 0 ? 0 : guestTotal)
      $('#jumlah-tamu').trigger('change')
    })

    $('.form-guest-total .btn-plus').on('click', (event) => {
      let guestTotal = $('#jumlah-tamu').val()
      guestTotal = parseInt(guestTotal) + 1

      $('#jumlah-tamu').val(guestTotal < 0 ? 0 : guestTotal)
      $('#jumlah-tamu').trigger('change')
    })

    if (basketService.table) {
      $('#nomor-meja').text(basketService.table.name)
    }

    if (basketService.numberOfGuest !== 0) {
      $('#jumlah-tamu').val(basketService.numberOfGuest || 0)
    }

    const discountInput = new AutoNumeric('#jumlah-diskon', {
      digitGroupSeparator: '.',
      decimalCharacter: ',',
      decimalCharacterAlternative: '.',
      minimumValue: 0
    });

    if (typeof basketService.discount != 'undefined') {
      discountInput.set(basketService.discount.discount)

      if (typeof basketService.discount.discount_type != 'undefined') $('.type-disc').each((index, item) => {
        if ($(item).data('type_id') == basketService.discount.discount_type && basketService.discount.discount != 0) {
          $(item).addClass('active')
        }
      })

      if (typeof basketService.discount.discount_note != 'undefined') $('.note-disc').each((index, item) => {
        if ($(item).data('note_type') == basketService.discount.discount_note) {
          $(item).addClass('active')
        }
      })
    }

    const checkDiscount = () => {


      if ($('.type-disc').hasClass('active')) {
        let isFree = false
        let jml_disc = discountInput.get()
        if (type_id === 0) {
          if (parseFloat(jml_disc) > 99) {
            isFree = true
            discountInput.set(100)
            $('#cat_diskon').removeClass('d-none')
          } else {
            $('#cat_diskon').addClass('d-none')
            discount_note = null
            $('.note-disc').each((index, item) => {
              $(item).removeClass('active')
            })
          }
        } else {
          if (parseFloat(jml_disc) > basketService.totalSub) {
            isFree = true
            $('#jumlah-diskon').val(basketService.totalSub)
            $('#cat_diskon').removeClass('d-none')
          } else {
            $('#cat_diskon').addClass('d-none')
            discount_note = null
            $('.note-disc').each((index, item) => {
              $(item).removeClass('active')
            })
          }
        }

        basketService.setDiscount({
          discount_type: type_id,
          discount: parseFloat(discountInput.get() || 0),
          discount_note: discount_note
        })

        this.updateTransaction(basketService)

        viewBasket(basketService)

        $('#choose-payment-btn').attr('data-link', 1)
        $('#choose-payment-btn').text('Pilih pembayaran')

        if (isFree) {
          $('#choose-payment-btn').removeAttr('data-link')
          $('#choose-payment-btn').text('Simpan Transaksi')
        }
      }
    }

    checkDiscount()

    $('.type-disc').on('click', (e) => {

      $('.type-disc').removeClass('active')
      $(e.currentTarget).addClass('active')
      type_id = $(e.currentTarget).data('type_id')
      checkDiscount();

      $('#jumlah-diskon').trigger('focus')
    })

    $('.note-disc').on('click', (e) => {
      $('.note-disc').removeClass('active')
      $(e.currentTarget).addClass('active')
      discount_note = $(e.currentTarget).data('note_type')
      checkDiscount();
    })

    $('#jumlah-diskon').on('keyup change', () => {
      let jml_disc = discountInput.get()
      if (type_id === 0) {
        $('#jumlah-diskon').attr('max', 100)
        if (parseInt(jml_disc) > 99) {
          discountInput.set(100)
          $('#cat_diskon').removeClass('d-none')
        } else {
          $('#cat_diskon').addClass('d-none')
        }
      } else {
        $('#jumlah-diskon').attr('max', basketService.totalSub)
        if (parseInt(jml_disc) > basketService.totalSub) {
          discountInput.set(basketService.totalSub)
          $('#cat_diskon').removeClass('d-none')
        } else {
          $('#cat_diskon').addClass('d-none')
        }
      }

      checkDiscount()
    })

    $('#save-transaction').on('click', async (e) => {
      e.preventDefault()

      let isRoom = basketService.type.isroom
      let table = basketService.table
      let numberOfGuest = basketService.numberOfGuest

      if (typeof table.id == "undefined" && isRoom !== "1") {
        await MyToast.show('Silahkan Pilih Meja terlebih dahulu!')

        return
      }

      if (numberOfGuest === "0" && isRoom != "1") {
        await MyToast.show('Silahkan isi Jumlah Tamu terlebih dahulu!')

        return
      }

      let res = await this.updateTransaction(basketService)

      if (!res) {
        await MyToast.show('Transaksi Gagal Disimpan');

        return
      }

      await MyToast.show('Transaksi Berhasil Disimpan');

      basketService.clear()
      Redirect('/', true)
    })

    $('#choose-payment-btn').on('click', async (e) => {
      e.preventDefault()

      if ((basketService.discount.discount_type.toString() == '0' && basketService.discount.discount.toString() != '100') ||
        (basketService.discount.discount_type.toString() == '1' && basketService.discount.discount != basketService.totalSub)) {
        return
      }

      if (typeof basketService.table.id == "undefined" && basketService.type.isroom !== "1") {
        await MyToast.show('Silahkan Pilih Meja terlebih dahulu!')

        return
      }

      if (basketService.numberOfGuest === "0" && basketService.type.isroom != "1") {
        await MyToast.show('Silahkan isi Jumlah Tamu terlebih dahulu!')

        return
      }

      if (basketService.discount.discount_note == null) {
        await MyToast.show('Pilih catatan diskon!')

        return
      }

      basketService.setStatus(1);

      let res = await this.updateTransaction(basketService)

      if (!res.status) {
        await MyToast.show('Transaksi Gagal Disimpan');

        return
      }

      basketService.clear()
      Redirect('/pos/payment/finish/' + res.data.id, true)
    })
  }

  render() {
    return basketView()
  }
}

export default PosBasketDraft