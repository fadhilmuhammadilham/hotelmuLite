import Page from "./Page";
import $ from "jquery"
import BasketService from "../services/BasketService";
import GuestApi from "../repositories/api/GuestApi";
import guestView from "../templates/pos-guest.handlebars";
import guestItem from "../templates/pos-guest-item.handlebars"
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage";
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage";
import TransactionApi from "../repositories/api/TransactionApi";
import Redirect from "../core/Redirect";
import round from "../templates/helpers/round"
import TransactionService from "../services/TransactionService";
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage";

class PosGuest extends Page {
    constructor(params) {
        super(params)
        this.basketService = new BasketService()
        this.transactionService = new TransactionService()
    }

    async getGuest() {
        try {
            let res = await GuestApi.getRoomOccupied()

            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    async action() {
        const dataGuest = await this.getGuest()
        let d = new Date()
        let month = d.getMonth() + 1
        let date = [d.getFullYear(), month.toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-') + ' ' + [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(':')
        let room_id

        $('.items-guest').html(guestItem({guests: dataGuest}))

        $('.guest-id').on('click', (e) => {
            $('.guest-id').removeClass('bg-secondary')
            $(e.currentTarget).addClass('bg-secondary')
            $('#confirm-tamu').removeClass('d-none')

            room_id = $(e.currentTarget).data('room')

            if(BasketLocalStorage.get('type')){
                this.basketService.setGuest({
                    id: $(e.currentTarget).data('id'),
                    room_number: $(e.currentTarget).data('room'),
                    guest_name: $(e.currentTarget).data('name'),
                    folio_number: $(e.currentTarget).data('folio')
                })
            }else{
                this.transactionService.setGuest({
                    id: $(e.currentTarget).data('id'),
                    room_number: $(e.currentTarget).data('room'),
                    guest_name: $(e.currentTarget).data('name'),
                    folio_number: $(e.currentTarget).data('folio')
                })
            }
        })

        const paymentConfirmed = async (status) => {
            if(BasketLocalStorage.get('type')){
                if(BasketLocalStorage.get('discount').hasOwnProperty('discount_type')){
                    this.basketService.setPayment({
                        payment_method: 2,
                        shift_id: ShiftLocalStorage.get('id'),
                        payment_date: date,
                        round: round(this.basketService.totalAfterDiscount, 100),
                        payment_value: this.basketService.totalAfterDiscount,
                        refund: 0,
                        discount_type: parseInt(BasketLocalStorage.get('discount').discount_type),
                        discount: parseFloat(this.basketService.totalDiscount),
                        discount_note: 0,
                        room_id: parseInt(room_id),
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
                        payment_method: 2,
                        shift_id: ShiftLocalStorage.get('id'),
                        payment_date: date,
                        round: round(this.basketService.totalPrice, 100),
                        payment_value: this.basketService.totalPrice,
                        refund: 0,
                        room_id: parseInt(room_id),
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
                if(TransactionLocalStorage.get('discount').discount > 0){
                    this.transactionService.setPayment({
                        payment_method: 2,
                        shift_id: ShiftLocalStorage.get('id'),
                        payment_date: date,
                        round: round(this.transactionService.totalAfterDiscount, 100),
                        payment_value: this.transactionService.totalAfterDiscount,
                        refund: 0,
                        discount_type: parseInt(BasketLocalStorage.get('discount').discount_type),
                        discount: parseFloat(this.transactionService.discount.discount),
                        discount_note: 0,
                        room_id: parseInt(room_id),
                    })
    
                    let payment = await TransactionApi.payment(TransactionLocalStorage.get('id'))

                    if(payment.status) {
                        Redirect('/pos/payment/finish')
                    }

                }else{
                    this.transactionService.setPayment({
                        payment_method: 2,
                        shift_id: ShiftLocalStorage.get('id'),
                        payment_date: date,
                        round: round(this.transactionService.totalPrice, 100),
                        payment_value: this.transactionService.totalPrice,
                        refund: 0,
                        room_id: parseInt(room_id),
                    })
    
                    let payment = await TransactionApi.payment(TransactionLocalStorage.get('id'))

                    if(payment.status) {
                        Redirect('/pos/payment/finish')
                    }
                }
            }
        }

        $('#pay-confirm-btn').on('click', () => {
            $('#pay-modal').modal('hide')
            paymentConfirmed(1)
        })
    }

    render() {
        if(BasketLocalStorage.get('type')){
            return guestView({totalPrice: this.basketService.discount === 0 ? this.basketService.totalPrice : this.basketService.totalAfterDiscount})
        }else{
            return guestView({totalPrice: this.transactionService.discount === 0 ? this.transactionService.total_prices : this.transactionService.totalAfterDiscount})
        }
    }
}

export default PosGuest