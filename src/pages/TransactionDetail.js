import Page from "./Page"
import $ from 'jquery'
import transactionDetailView from '../templates/transaction-detail.handlebars'
import transactionDetailItem from '../templates/transaction-detail-item.handlebars'
import TransactionApi from "../repositories/api/TransactionApi"
import BasketService from "../services/BasketService"
import BasketLocalStorage from '../repositories/localstorage/BasketLocalStorage'

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

  viewDetail(data) {
    data.items = data.items.map((item) => {
      item.price_after_disc = item.price - (item.price * (item.discount / 100))
      return item
    })

    data.discount = data.discount > 0 ? (data.discount_type == '%' ? `${data.discount}% (Rp${(data.total_sub * (data.discount / 100)).format()})` : `(Rp${data.discount})`) : '(Rp0)'
    $('#app').html(transactionDetailView({
      data: data,
    }))

    $('.items-list').html(transactionDetailItem({ items: data.items }))
  }

  async action() {

    let data = await this.getDetail()

    this.viewDetail(data)

    $('#btn-initiate').on('click', () => {

      let items = []
      for (const item of data.items) {
        items.push({
          id: item.id,
          category: item.category,
          name: item.name,
          price: item.price,
          qty: item.qty,
          totalSub: item.total_sub,
          discount: item.discount,
          total: item.total,
          type: item.type
        })
      }

      localStorage.setItem('basket', JSON.stringify({
        id: data.id,
        shift: data.shift,
        type: data.outlet,
        items: items,
        total: data.total,
        totalSub: data.total_sub,
        totalRound: data.round,
        discount: {
          discount: data.discount,
          discount_type: data.discount_type,
          discount_note: data.discount_note,
        },
        table: data.table,
        numberOfGuest: data.numberOfGuest
      }))

      let basketService = new BasketService()

      basketService.calculateTotal()
      basketService.calculateRound()

      BasketLocalStorage.save(basketService)
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