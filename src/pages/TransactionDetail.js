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
        let total_payment = parseInt(data.payment.total_payment)
        let refund = parseInt(data.payment.refund)

        return transactionDetailView({data: data, price: total_price, pay: total_payment, refund: refund})
    }
}

export default TransactionDetail