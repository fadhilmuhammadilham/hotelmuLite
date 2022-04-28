import Page from "./Page"
import posPaymentCashView from "../templates/pos-payment-cash.handlebars"
import BasketService from "../services/BasketService"
import $ from 'jquery'
import Redirect from "../core/Redirect"
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage"
import TransactionApi from "../repositories/api/TransactionApi"
import round from "../templates/helpers/round"
import TransactionService from "../services/TransactionService"
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage"
import AutoNumeric from 'autonumeric'
import DateCustom from "../utils/DateCustom"

class PosPaymentCash extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()
    this.transactionService = new TransactionService()

    this.paymentValue = 0
    this.refund = 0
  }

  checkValue() {
    let totalPrices
    if (this.basketService.items.length > 0) {
      totalPrices = this.basketService.total
    } else {
      totalPrices = this.transactionService.totalDiscount > 0 ? this.transactionService.totalAfterDiscount : this.transactionService.total_prices
    }

    if (this.paymentValue >= totalPrices) {
      $('.form-button-group').removeClass('d-none')

      this.refund = this.paymentValue - totalPrices
    }
    else $('.form-button-group').addClass('d-none')

    $('#cash-recive').text('Rp' + this.paymentValue.format(2))
    $('#refund').text('Rp' + this.refund.format(2))

    $('.refund-container').addClass('d-none')
    $('.refund-container').removeClass('d-flex')

    if (this.refund > 0) {
      $('.refund-container').removeClass('d-none')
      $('.refund-container').addClass('d-flex')
    }
  }

  async paymentConfirmed() {
    let date = DateCustom.getNowFormated()

    this.basketService.setPayment({
      payment_method: 0,
      shift_id: ShiftLocalStorage.get('id'),
      payment_date: date,
      total_payment: this.paymentValue,
      refund: this.refund
    })

    try {
      let res = await TransactionApi.save(this.basketService)

      if (res.status) {
        let payment = await TransactionApi.payment(res.data.id)

        if (payment.status) {
          $('#pay-modal').modal('hide')
          Redirect('/pos/payment/finish')
        }
      }
      else throw new Error("Simpan transaksi gagal")
    } catch (error) {
      alert(error.message)
    }

    // if (BasketLocalStorage.get('type')) {
    //   if (BasketLocalStorage.get('discount').hasOwnProperty('discount_type')) {
    //     this.basketService.setPayment({
    //       payment_method: 0,
    //       shift_id: ShiftLocalStorage.get('id'),
    //       payment_date: date,
    //       round: round(this.basketService.totalAfterDiscount, 100),
    //       total_payment: this.paymentValue,
    //       refund: this.refund,
    //       discount_type: parseInt(BasketLocalStorage.get('discount').discount_type),
    //       discount: parseFloat(this.basketService.discount.discount),
    //       discount_note: parseInt(BasketLocalStorage.get('discount').discount_note)
    //     })
    //   }
    //   else {
    //     this.basketService.setPayment({
    //       payment_method: 0,
    //       shift_id: ShiftLocalStorage.get('id'),
    //       payment_date: date,
    //       round: round(this.basketService.totalPrice, 100),
    //       total_payment: this.paymentValue,
    //       refund: this.refund,
    //     })
    //   }

    //   let res = await TransactionApi.save()

    //   if (res.status) {
    //     let payment = await TransactionApi.payment(res.data)

    //     if (payment.status) {
    //       $('#pay-modal').modal('hide')
    //       Redirect('/pos/payment/finish')
    //     }
    //   }
    // } else {
    //   if (TransactionLocalStorage.get('discount').discount > 0) {
    //     this.transactionService.setPayment({
    //       payment_method: 0,
    //       shift_id: ShiftLocalStorage.get('id'),
    //       payment_date: date,
    //       round: round(this.transactionService.total_prices, 100),
    //       total_payment: this.paymentValue,
    //       refund: this.refund,
    //       discount_type: parseInt(TransactionLocalStorage.get('discount').discount_type),
    //       discount: parseFloat(this.transactionService.discount.discount),
    //       discount_note: parseInt(TransactionLocalStorage.get('discount').discount_note)
    //     })
    //   } else {
    //     this.transactionService.setPayment({
    //       payment_method: 0,
    //       shift_id: ShiftLocalStorage.get('id'),
    //       payment_date: date,
    //       round: round(this.transactionService.total_prices, 100),
    //       total_payment: this.paymentValue,
    //       refund: this.refund,
    //     })
    //   }

    //   let res = await TransactionApi.payment(TransactionLocalStorage.get('id'))

    //   if (res.status) {
    //     $('#pay-modal').modal('hide')
    //     Redirect('/pos/payment/finish')
    //   }
    // }
  }

  sugestionPay() {
    let totalPrices = this.basketService.total

    if (this.basketService.items.length > 0) {
      totalPrices = this.basketService.total
    }
    else {
      totalPrices = this.transactionService.totalDiscount > 0 ? this.transactionService.totalAfterDiscount : this.transactionService.total_prices
    }

    let total = Math.round(totalPrices / 10000.1) * 10000
    total = totalPrices > total ? total + 5000 : total

    var sugs = [5000, 10000, 20000, 50000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000]

    sugs = sugs.filter((sug) => {
      return sug > total
    })

    sugs = sugs.slice(0)

    $('#payment-suggestion .row').prepend('<div class="col-6 mb-2">\
        <a href="javascript:;" class="btn btn-outline-secondary btn-block" data-action="pay-option" data-value="'+ total + '">' + total.format() + '</a>\
      </div>\
      <div class="col-6 mb-2">\
        <a href="javascript:;" class="btn btn-outline-secondary btn-block" data-action="pay-option" data-value="'+ sugs[0] + '">' + sugs[0].format() + '</a>\
      </div>')

    $('#uangpas').attr('data-value', totalPrices)
  }

  async action() {
    this.checkValue()

    if ($('#payment-suggestion').length > 0) this.sugestionPay()

    const paymentNominal = new AutoNumeric('#payment_nominal', {
      digitGroupSeparator: '.',
      decimalCharacter: ',',
      decimalPlaces: 0,
      minimumValue: 0
    });

    $('a[data-action="other-nominal"]').on('click', (e) => {
      $('#payment-nominal').collapse('show')
      $('#payment-nominal input').val('')
      $('#payment-nominal input').trigger('focus')

      let val = paymentNominal.get()
      this.paymentValue = parseFloat(val)

      this.checkValue()
      $('#payment-suggestion a').removeClass('active')
      $(e.target).addClass('active')
    })

    $('[data-action="pay-option"]').on('click', (e) => {
      $('#payment-nominal').collapse('hide')
      let val = $(e.currentTarget).data('value')

      val = parseFloat(val)
      this.paymentValue = val

      $('#payment-nominal input').val(val)
      $('#cash-receive').text('Rp' + val.format())

      this.checkValue()

      $('#payment-suggestion a').removeClass('active')
      $(e.target).addClass('active')
    })

    $('#payment_nominal').on('keyup', (e) => {
      let val = paymentNominal.get()
      this.paymentValue = parseFloat(val)

      this.checkValue()
    })

    $('#pay-confirm-btn').on('click', (e) => {
      this.paymentConfirmed()
    })
  }

  render() {
    if (this.basketService.items.length > 0) {
      return posPaymentCashView({ total: this.basketService.total })
    } else {
      return posPaymentCashView({ total: this.transactionService.totalDiscount === 0 ? this.transactionService.total_prices : this.transactionService.totalAfterDiscount })
    }
  }
}

export default PosPaymentCash