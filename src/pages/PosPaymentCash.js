import Page from "./Page"
import posPaymentCashView from "../templates/pos-payment-cash.handlebars"
import BasketService from "../services/BasketService"
import $ from 'jquery'
import Redirect from "../core/Redirect"

class PosPaymentCash extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()
  }

  async action() {
    var payment_value = 0
	  let refund = 0

    const checkValue = () => {
      if (payment_value >= this.basketService.totalPrice) {
        $('.form-button-group').removeClass('d-none')
  
        refund = payment_value - this.basketService.totalPrice
      }
      else $('.form-button-group').addClass('d-none')
  
      $('#cash-recive').text('Rp' + payment_value.format())
      $('#refund').text('Rp' + refund.format())
  
      $('.refund-container').addClass('d-none')
      $('.refund-container').removeClass('d-flex')
  
      if (refund > 0) {
        $('.refund-container').removeClass('d-none')
        $('.refund-container').addClass('d-flex')
      }
    }

    checkValue()

    const sugestionPay = () => {
      var total = Math.round(this.basketService.totalPrice / 10000.1) * 10000
      total = this.basketService.totalPrice > total ? total + 5000: total
  
      var sugs = [5000, 10000, 20000, 50000, 100000, 150000, 200000]
  
      sugs = sugs.filter((sug) => {
        return sug > total
      })
  
      sugs = sugs.slice(0)
  
      $('#payment-suggestion .row').prepend('<div class="col-6 mb-2">\
        <a href="javascript:;" class="btn btn-outline-secondary btn-block" data-action="pay-option" data-value="'+total+'">'+total.format()+'</a>\
      </div>\
      <div class="col-6 mb-2">\
        <a href="javascript:;" class="btn btn-outline-secondary btn-block" data-action="pay-option" data-value="'+sugs[0]+'">'+sugs[0].format()+'</a>\
      </div>')
  
      $('#uangpas').attr('data-value', this.basketService.totalPrice)
    }

    if ($('#payment-suggestion').length > 0) sugestionPay()

		$(document).on('click', 'a[data-action="other-nominal"]', () => {
			$('#payment-nominal').collapse('show')
			$('#payment-nominal input').val(0)

      var val = $('#payment_nominal').val()
			payment_value = parseFloat(val)
      
      checkValue()
		})

		$(document).on('click', '[data-action="pay-option"]', (e) => {
			$('#payment-nominal').collapse('hide')
			var val = $(e.currentTarget).data('value')

      val = parseFloat(val)
			payment_value = val

			$('#payment-nominal input').val(val)
			$('#cash-receive').text('Rp'+val.format())

			checkValue()
		})

		$(document).on('keyup', '#payment_nominal', (e) => {
			var val = $(e.currentTarget).val()
			payment_value = parseFloat(val)

			checkValue()
		})

    const paymentConfirmed = (status) => {
      this.basketService.setPayment({
        type: 'cash',
        payment_value: payment_value,
        refund: refund
      })
      Redirect('/pos/payment/finish')
    }
    
		$('#pay-confirm-btn').on('click', (e) => {
      $('#pay-modal').modal('hide')
			paymentConfirmed(1)
		})
  }

  render() {
    return posPaymentCashView({totalPrice: this.basketService.totalPrice})
  }
}

export default PosPaymentCash