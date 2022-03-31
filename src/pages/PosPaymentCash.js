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

class PosPaymentCash extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()
    this.transactionService = new TransactionService()
  }

  async action() {
    var payment_value = 0
	  let refund = 0
    let d = new Date()
    let month = d.getMonth() + 1
    let date = [d.getFullYear(), month.toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-') + ' ' + [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(':')

    const checkValue = () => {
      let discount
      if(this.basketService.items.length > 0){
        discount = this.basketService.totalDiscount > 0 ? this.basketService.totalAfterDiscount : this.basketService.totalPrice
      }else{
        discount = this.transactionService.totalDiscount > 0 ? this.transactionService.totalAfterDiscount : this.transactionService.total_prices
      }

      if (payment_value >= discount) {
        $('.form-button-group').removeClass('d-none')
  
        refund = payment_value - discount
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
      if(this.basketService.items.length > 0){
        var total = this.basketService.totalDiscount > 0 ? Math.round(this.basketService.totalAfterDiscount / 10000.1) * 10000 : Math.round(this.basketService.totalPrice / 10000.1) * 10000
        total = this.basketService.totalPrice > total ? total + 5000 : total

        var sugs = [5000, 10000, 20000, 50000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000]
  
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
      }else{
        var total = this.transactionService.totalDiscount > 0 ? Math.round(this.transactionService.totalAfterDiscount / 10000.1) * 10000 : Math.round(this.transactionService.total_prices / 10000) * 10000
        total = this.transactionService.total_prices > total ? total + 5000 : total

        var sugs = [5000, 10000, 20000, 50000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000]
  
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
    
        $('#uangpas').attr('data-value', this.transactionService.total_prices)
      }
  
      
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

    const paymentConfirmed = async (status) => {
      if(BasketLocalStorage.get('type')){
        if(BasketLocalStorage.get('discount').hasOwnProperty('discount_type')){
          this.basketService.setPayment({
            payment_method: 0,
            shift_id: ShiftLocalStorage.get('id'),
            payment_date: date,
            round: round(this.basketService.totalAfterDiscount, 100),
            total_payment: payment_value,
            refund: refund,
            discount_type: parseInt(BasketLocalStorage.get('discount').discount_type),
            discount: parseFloat(this.basketService.discount.discount),
            discount_note: parseInt(BasketLocalStorage.get('discount').discount_note)
          })
          let res = await TransactionApi.save()
  
          if(res.status) {
            let payment = await TransactionApi.payment(res.data)
  
            if(payment.status) {
              Redirect('/pos/payment/finish')
            }
          }
        }else{
          this.basketService.setPayment({
            payment_method: 0,
            shift_id: ShiftLocalStorage.get('id'),
            payment_date: date,
            round: round(this.basketService.totalPrice, 100),
            total_payment: payment_value,
            refund: refund,
          })
          let res = await TransactionApi.save()
  
          if(res.status) {
            let payment = await TransactionApi.payment(res.data)
  
            if(payment.status) {
              Redirect('/pos/payment/finish')
            }
          }
        }
      }else{
        if(TransactionLocalStorage.get('discount').discount > 0) {
          this.transactionService.setPayment({
            payment_method: 0,
            shift_id: ShiftLocalStorage.get('id'),
            payment_date: date,
            round: round(this.transactionService.total_prices, 100),
            total_payment: payment_value,
            refund: refund,
            discount_type: parseInt(TransactionLocalStorage.get('discount').discount_type),
            discount: parseFloat(this.transactionService.discount.discount),
            discount_note: parseInt(TransactionLocalStorage.get('discount').discount_note)
          })

          // console.log(this.transactionService.payment);

          let res = await TransactionApi.payment(TransactionLocalStorage.get('id'))

          if(res.status) {
            Redirect('/pos/payment/finish')
          }

        }else{
          this.transactionService.setPayment({
            payment_method: 0,
            shift_id: ShiftLocalStorage.get('id'),
            payment_date: date,
            round: round(this.transactionService.total_prices, 100),
            total_payment: payment_value,
            refund: refund,
          })

          // console.log(this.transactionService.payment);

          let res = await TransactionApi.payment(TransactionLocalStorage.get('id'))

          if(res.status) {
            Redirect('/pos/payment/finish')
          }
        }
      }
    }
    
		$('#pay-confirm-btn').on('click', (e) => {
      // $('#pay-modal').modal('hide')
			paymentConfirmed(1)
		})
  }

  render() {
    if(this.basketService.items.length > 0){
      return posPaymentCashView({totalPrice: this.basketService.totalDiscount === 0 ? this.basketService.totalPrice : this.basketService.totalAfterDiscount})
    }else{
      return posPaymentCashView({totalPrice: this.transactionService.totalDiscount === 0 ? this.transactionService.total_prices : this.transactionService.totalAfterDiscount})
    }
  }
}

export default PosPaymentCash