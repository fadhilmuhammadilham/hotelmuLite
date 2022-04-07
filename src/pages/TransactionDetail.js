import Page from "./Page"
import $ from 'jquery'
import transactionDetailView from '../templates/transaction-detail.handlebars'
import transactionDetailItem from '../templates/transaction-detail-item.handlebars'
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage"
import TableApi from "../repositories/api/TableApi"
import TransactionService from "../services/TransactionService"
import TransactionApi from "../repositories/api/TransactionApi"

class TransactionDetail extends Page {
  constructor(params) {
    super(params)
  }

  async getDetail() {
    try {
      let trx = await TransactionApi.detail(this.params.id);

      TransactionLocalStorage.set(trx.data)
    } catch (error) {
      console.log(error)
    }
  }

  setupDetail() {
    let data = TransactionLocalStorage.getAll()
    let total_price = parseFloat(data.total_prices)
    let total_payment = data.payment.total_payment != null ? parseFloat(data.payment.total_payment) : 0
    let total_before_discount = parseFloat(data.total_before_discount)
    let refund = data.payment.refund != null ? parseFloat(data.payment.refund) : 0

    $('#app').html(transactionDetailView({
      data: data,
      subtotal: total_before_discount,
      price: total_price,
      pay: total_payment,
      refund: refund,
      payment_method: (data.payment.payment_method == 'Debit' ? data.payment.settlement : data.payment.payment_method),
      discount: data.discount > 0 ? (data.discounttype == '%' ? `${data.discount}% (Rp${(total_before_discount * (data.discount / 100))})` : `(Rp${data.discount})`) : '(Rp0)'
    }))
  }

  async action() {
    await this.getDetail()

    this.setupDetail()

    const transactionService = new TransactionService();
    const detailData = TransactionLocalStorage.getAll()
    // const tableData = await TableApi.getAll(detailData.outlet_id)
    // let table = tableData.data.find(table => table.id == detailData.table_id)
    // $('#nomor-meja').text(table.name)
    $('.items-list').html(transactionDetailItem({ items: detailData.items }))

    $('#btn-initiate').on('click', (e) => {
      transactionService.initiateBasket()
    })
  }

  render() {
    return `<div class="text-center py-3" style="
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 99999;
      background: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;"><span class="spinner-border" role="status" aria-hidden="true"></span></div>`
  }
}

export default TransactionDetail