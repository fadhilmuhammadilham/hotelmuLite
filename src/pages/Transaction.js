import Page from "./Page";
import transactionView from '../templates/transaction.handlebars'
import transactionListView from '../templates/transaction-list.handlebars'
import TransactionApi from "../repositories/api/TransactionApi";
import $ from 'jquery'
import TransactionFilterLocalStorage from "../repositories/localstorage/TransactionFilterLocalStorage";

class Transaction extends Page {
  constructor(params) {
    super(params)

    this.data = {
      total: 0,
      limit: 20,
      offset: 0,
      page: 1
    }
  }

  async getTransaction() {
    try {
      let filters = TransactionFilterLocalStorage.getAll()
      this.data.offset = (this.data.page - 1) * this.data.limit

      let res = await TransactionApi.getAll({ limit: this.data.limit, order: 'desc', offset: this.data.offset }, filters)

      const transactions = res.data
      this.data.total = res.total
      $('#transaction-list').append(transactionListView({ transactions }))
    } catch (error) {
      console.log(error)
    }
  }

  hasMore() {
    const startIndex = this.data.page * this.data.limit;

    return this.data.total === 0 || startIndex < this.data.total;
  }

  async action() {
    const showLoading = (is = true) => {
      if (!is) {
        $('#loading').addClass('d-none')
        return
      }

      $('#loading').removeClass('d-none')
    }

    $('#eraser-btn').on('click', async () => {
      TransactionFilterLocalStorage.removeAll()
      $('#transaction-list').html('')
      showLoading()

      await this.getTransaction()
      $('#eraser-btn').remove()
      showLoading(false)
    })

    const self = this
    $('#appCapsule').on('scroll', async function () {
      if ($('#appCapsule').scrollTop() >= $('#transaction-list').height() - $('#appCapsule').height() && self.hasMore()) {
        self.data.page++;
        showLoading()
        await self.getTransaction()
        showLoading(false)
      }
    });

    await this.getTransaction()

    showLoading(false)
  }

  render() {
    let filtered = TransactionFilterLocalStorage.getAll();
    return transactionView({ is_filtered: Object.keys(filtered).length === 0 ? false : true })
  }
}

export default Transaction