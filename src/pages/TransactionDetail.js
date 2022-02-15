import Page from "./Page"
import $ from 'jquery'
import transactionDetailView from '../templates/transaction-detail.handlebars'
import transactionDetailItem from '../templates/transaction-detail-item.handlebars'
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage"
import TransactionApi from "../repositories/api/TransactionApi"
import TableApi from "../repositories/api/TableApi"

class TransactionDetail extends Page {
    constructor(params) {
        super(params)
    }

    async getDetail() {
        try {
            let res = await TransactionApi.detail()

            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    async action() {
        const detailData = await this.getDetail()
        const tableData = await TableApi.getAll(detailData.outlet_id)
        let table = tableData.data.find(table => table.id == detailData.table_id)
        $('#no-trx').text(detailData.trx_number)
        $('#trx-date').text(detailData.trx_date)
        $('#nomor-meja').text(table.name)
        if(detailData.guest_name == null){
            $('#nama-tamu').addClass('text-muted')
            $('#nama-tamu').text('(Tidak Ada Nama Tamu)')
        }else{
            $('#nama-tamu').text(detailData.guest_name)
        }
        $('#total-harga').text('Rp'+detailData.total_prices)
        $('.items-list').html(transactionDetailItem({items: detailData.items}))
    }

    render() {
        let is_draft = TransactionLocalStorage.get('status')
        return transactionDetailView({is_draft: is_draft})
    }
}

export default TransactionDetail