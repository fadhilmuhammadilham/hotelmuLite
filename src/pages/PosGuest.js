import Page from "./Page";
import $ from "jquery"
import BasketService from "../services/BasketService";
import GuestApi from "../repositories/api/GuestApi";
import guestView from "../templates/pos-guest.handlebars";
import guestItem from "../templates/pos-guest-item.handlebars"
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage";
import TransactionApi from "../repositories/api/TransactionApi";
import Redirect from "../core/Redirect";
import DateCustom from "../utils/DateCustom";

class PosGuest extends Page {
  constructor(params) {
    super(params)

    this.basketService = new BasketService()

    this.room_id
    this.folio_number
  }

  async getGuest() {
    try {
      let res = await GuestApi.getRoomOccupied()

      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  async paymentConfirmed() {
    this.basketService.setPayment({
      payment_method: 2,
      shift_id: ShiftLocalStorage.get('id'),
      payment_date: DateCustom.getNowFormated(),
      total_payment: this.basketService.total,
      refund: 0,
      room_id: parseInt(this.room_id),
      folio_number: this.folio_number,
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
    const dataGuest = await this.getGuest()

    $('.items-guest').html(guestItem({ guests: dataGuest }))

    $('.guest-id').on('click', (e) => {
      $('.guest-id').removeClass('bg-secondary')
      $(e.currentTarget).addClass('bg-secondary')
      $('#confirm-tamu').removeClass('d-none')

      this.room_id = $(e.currentTarget).data('room')
      this.folio_number = $(e.currentTarget).data('folio')

      this.basketService.setGuest({
        id: $(e.currentTarget).data('id'),
        room_number: $(e.currentTarget).data('room'),
        guest_name: $(e.currentTarget).data('name'),
        folio_number: $(e.currentTarget).data('folio')
      })
    })

    $('#pay-confirm-btn').on('click', () => {
      $('#pay-modal').modal('hide')

      this.paymentConfirmed()
    })
  }

  render() {
    return guestView({ total: this.basketService.total })
  }
}

export default PosGuest