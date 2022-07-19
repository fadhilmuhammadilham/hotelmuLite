import Page from "./Page";
import $ from "jquery"
import edcView from "../templates/pos-payment-debit.handlebars"
import BasketService from "../services/BasketService";
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage";
import EDCLocalStorage from "../repositories/localstorage/EDCLocalStorage";
import Redirect from "../core/Redirect";
import TransactionApi from "../repositories/api/TransactionApi";
import DateCustom from "../utils/DateCustom";

class PosPaymentDebit extends Page {
  constructor(params) {
    super(params)

    this.basketService = new BasketService()

    this.cardType = 0
  }

  async paymentConfirmed() {
    this.basketService.setPayment({
      payment_method: 1,
      shift_id: ShiftLocalStorage.get('id'),
      payment_date: DateCustom.getNowFormated(),
      total_payment: this.basketService.total,
      refund: 0,
      card_type: this.cardType,
      card_number: $('#card_number').val(),
      trace_number: $('#trace_number').val(),
      edc_id: EDCLocalStorage.get('id')
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

      if (!payment.status) throw new Error("Simpan pembayaran gagal");

      $('#pay-modal').modal('hide')
      Redirect('/pos/payment/finish/' + this.basketService.id)

    } catch (error) {
      alert(error.message)
    }
  }

  async action() {
    const checkValue = () => {
      if ($('.type-deb').hasClass('active') && $('#card_number').val().length > 3 && $('#trace_number').val().length > 3) {
        $('.form-button-group').removeClass('d-none')
      } else {
        $('.form-button-group').addClass('d-none')
      }
    }

    checkValue()

    $('.type-deb').on('click', (e) => {
      $('.type-deb').removeClass('active')
      $(e.currentTarget).addClass('active')
      this.cardType = $(e.currentTarget).data('type_id')
      checkValue()
    })

    if (EDCLocalStorage.get('id')) {
      let edcName = EDCLocalStorage.get('name')

      $('#edc').text(edcName)

      $('#edc-info').removeClass('hide')
      $('#edc-info').removeClass('collapse')
    }

    $(document).on('keyup', '#card_number', () => {
      checkValue()
    })

    $(document).on('keyup', '#trace_number', () => {
      checkValue()
    })

    $('#pay-confirm-btn').on('click', (e) => {
      $('#pay-modal').modal('hide')
      this.paymentConfirmed()
    })
  }

  render() {
    return edcView({ totalPrice: this.basketService.total })
  }
}

export default PosPaymentDebit