import Page from "./Page";
import $ from "jquery"
import edcView from "../templates/pos-payment-debit.handlebars"
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage";
import BasketService from "../services/BasketService";
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage";
import EDCLocalStorage from "../repositories/localstorage/EDCLocalStorage";
import Redirect from "../core/Redirect";
import TransactionApi from "../repositories/api/TransactionApi";
import round from "../templates/helpers/round"

class PosPaymentEDC extends Page {
    constructor(params) {
        super(params)
        this.basketService = new BasketService()
    }

    async action() {
        var payment_value = BasketLocalStorage.get('totalPrice')
        let d = new Date()
        let month = d.getMonth() + 1
        let date = [d.getFullYear(), month.toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-') + ' ' + [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(':')
        let card_type;
        const basketService = new BasketService();

        const checkValue = () => {
            if($('.type-deb').hasClass('active') && $('#card_number').val().length > 3 && $('#trace_number').val().length > 3){
                $('.form-button-group').removeClass('d-none')
            }else{
                $('.form-button-group').addClass('d-none')
            }
        }

        checkValue()

        $('.type-deb').on('click', (e) => {
            $('.type-deb').removeClass('active')
            $(e.currentTarget).addClass('active')
            card_type = $(e.currentTarget).data('type_id')
            checkValue()
        })
        
        if(EDCLocalStorage.get('id')){
            let edcName = EDCLocalStorage.get('name')

            $('#edc').text(edcName)

            $('#edc-info').removeClass('hide')
            $('#edc-info').removeClass('collapse')
        }

        $(document).on('keyup', '#card_number', () => {
            console.log($('#card_number').val().length)
            checkValue()
        })

        $(document).on('keyup', '#trace_number', () => {
            console.log($('#trace_number').val().length)
            checkValue()
        })

        const paymentConfirmed = async (status) => {
            if(BasketLocalStorage.get('discount').hasOwnProperty('discount_type')){
                this.basketService.setPayment({
                    payment_method: 1,
                    shift_id: ShiftLocalStorage.get('id'),
                    payment_date: date,
                    round: round(this.basketService.totalAfterDiscount, 100),
                    total_payment: this.basketService.totalAfterDiscount,
                    refund: 0,
                    discount_type: parseInt(BasketLocalStorage.get('discount').discount_type),
                    discount: parseFloat(this.basketService.discount.discount),
                    discount_note: parseInt(BasketLocalStorage.get('discount').discount_note),
                    card_type: card_type,
                    card_number: $('#card_number').val(),
                    trace_number: $('#trace_number').val(),
                    edc_id: EDCLocalStorage.get('id')
                })

                console.log(BasketLocalStorage.get('payment'));
                let res = await TransactionApi.save();

                if(res.status) {
                    let payment = await TransactionApi.payment(res.data)

                    if(payment.status){
                        Redirect('/pos/payment/finish')
                    }
                }    
            }else{
                this.basketService.setPayment({
                    payment_method: 1,
                    shift_id: ShiftLocalStorage.get('id'),
                    payment_date: date,
                    round: round(this.basketService.totalPrice, 100),
                    total_payment: this.basketService.totalPrice,
                    refund: 0,
                    card_type: card_type,
                    card_number: $('#card_number').val(),
                    trace_number: $('#trace_number').val(),
                    edc_id: EDCLocalStorage.get('id')
                })
                let res = await TransactionApi.save();

                if(res.status) {
                    let payment = await TransactionApi.payment(res.data)

                    if(payment.status){
                        Redirect('/pos/payment/finish')
                    }
                }
            }
        }

        $('#pay-confirm-btn').on('click', (e) => {
            $('#pay-modal').modal('hide')
            paymentConfirmed(1)
        })
    }

    render() {
        return edcView({totalPrice: this.basketService.totalAfterDiscount === 0 ? this.basketService.totalPrice : this.basketService.totalAfterDiscount})
    }
}

export default PosPaymentEDC