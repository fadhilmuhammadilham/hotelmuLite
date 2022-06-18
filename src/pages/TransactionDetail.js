import Page from "./Page"
import $ from 'jquery'
import transactionDetailView from '../templates/transaction-detail.handlebars'
import transactionDetailItem from '../templates/transaction-detail-item.handlebars'
import TransactionService from "../services/TransactionService"
import TransactionApi from "../repositories/api/TransactionApi"

class TransactionDetail extends Page {
  constructor(params) {
    super(params)
  }

  async getDetail() {
    try {
      let trx = await TransactionApi.detail(this.params.id);
      return trx.data
    } catch (error) {
      console.log(error)
    }
  }

  async action() {
    const transactionService = new TransactionService();

    let data = await this.getDetail()

    data.items = data.items.map((item) => {
      item.price_after_disc = item.price - (item.price * (item.discount / 100))
      return item
    })

    data.discount = data.discount > 0 ? (data.discount_type == '%' ? `${data.discount}% (Rp${(data.total_sub * (data.discount / 100)).format()})` : `(Rp${data.discount})`) : '(Rp0)'
    $('#app').html(transactionDetailView({
      data: data,
    }))

    $('.items-list').html(transactionDetailItem({ items: data.items }))

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
      justify-content: center;">
      <span class="spinner-border" role="status" aria-hidden="true"></span>
    </div>`
  }
}

export default TransactionDetail