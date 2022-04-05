import Page from "./Page"
import $ from 'jquery'
import transactionDetailView from '../templates/transaction-detail.handlebars'
import transactionDetailItem from '../templates/transaction-detail-item.handlebars'
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage"
import TableApi from "../repositories/api/TableApi"
import TransactionService from "../services/TransactionService"

class TransactionDetail extends Page {
    constructor(params) {
        super(params)
    }

    async action() {
        const transactionService = new TransactionService();
        const detailData = TransactionLocalStorage.getAll()
        const tableData = await TableApi.getAll(detailData.outlet_id)
        let table = tableData.data.find(table => table.id == detailData.table_id)
        $('#nomor-meja').text(table.name)
        $('.items-list').html(transactionDetailItem({items: detailData.items}))

        $('#btn-initiate').on('click', (e) => {
            transactionService.initiateBasket()
        })
    }

    render() {
        let data = TransactionLocalStorage.getAll()
        let total_price = parseInt(data.total_prices)
        let total_payment = data.payment.total_payment != null ? parseInt(data.payment.total_payment): 0
        let total_before_discount = parseFloat(data.total_before_discount)
        let refund = data.payment.refund != null ? parseInt(data.payment.refund): 0

        console.log({
            data: data, 
            price: total_price, 
            pay: total_payment, 
            refund: refund, 
            payment_method: (data.payment.payment_method == 'Debit' ? data.payment.settlement: data.payment.payment_method),
            discount: data.discount > 0 ? (data.discounttype == '%' ? `${data.discount} (${(total_before_discount * (data.discount/100))})`: `(Rp${data.discount})`): ''
        })

        return transactionDetailView({
            data: data, 
            price: total_price, 
            pay: total_payment, 
            refund: refund, 
            payment_method: (data.payment.payment_method == 'Debit' ? data.payment.settlement: data.payment.payment_method),
            discount: data.discount > 0 ? (data.discounttype == '%' ? `${data.discount}% (Rp${(total_before_discount * (data.discount/100))})`: `(Rp${data.discount})`): ''
        })
    }
}

export default TransactionDetail