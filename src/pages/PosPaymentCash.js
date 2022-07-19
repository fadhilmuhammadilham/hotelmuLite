import Page from "./Page"
import posPaymentCashView from "../templates/pos-payment-cash.handlebars"
import BasketService from "../services/BasketService"
import $ from 'jquery'
import Redirect from "../core/Redirect"
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage"
import TransactionApi from "../repositories/api/TransactionApi"
import AutoNumeric from 'autonumeric'
import DateCustom from "../utils/DateCustom"

class PosPaymentCash extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()

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

    $('#cash-recive').text(this.paymentValue.format(2))
    $('#refund').text(this.refund.format(2))

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
      let res

      if (this.basketService.id == 0) {
        res = await TransactionApi.save(this.basketService)

        if (!res.status) throw new Error("Simpan transaksi gagal")

        this.basketService.setId(res.data.id)
        this.basketService.setTrxNumber(res.data.trx_number)
      }
      else {
        this.basketService.setStatus(2)
        res = await TransactionApi.update(this.basketService)

        if (!res.status) throw new Error("Simpan transaksi gagal")
      }

      let payment = await TransactionApi.payment(this.basketService)

      if (payment.status) {
        $('#pay-modal').modal('hide')
        Redirect('/pos/payment/finish/' + this.basketService.id)
      }

    } catch (error) {
      alert(error.message)
    }
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
        <a href="javascript:;" class="btn btn-outline-secondary btn-block" data-action="pay-option" data-value="'+ total + '">' + total.format(0, false) + '</a>\
      </div>\
      <div class="col-6 mb-2">\
        <a href="javascript:;" class="btn btn-outline-secondary btn-block" data-action="pay-option" data-value="'+ sugs[0] + '">' + sugs[0].format(0, false) + '</a>\
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
      $('#cash-receive').text(val.format())

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