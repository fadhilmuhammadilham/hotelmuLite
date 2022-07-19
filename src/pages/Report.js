import Page from "./Page"
import $ from "jquery"
import reportView from "../templates/report.handlebars"
import reportItemView from "../templates/report-item.handlebars"
import ReportApi from "../repositories/api/ReportApi"
import TransactionApi from "../repositories/api/TransactionApi"

class PosPayment extends Page {
  constructor(params) {
    super(params)
  }

  async getRecent() {
    try {
      let res = await ReportApi.getRecent()

      return res.data
    } catch (error) {
      console.log(error);
    }
  }

  async getSummary(cb) {
    try {
      let res = await TransactionApi.summaryToday()
      cb(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async action() {
    this.getSummary((summary) => {
      let total_sales = parseFloat(summary.total_sales)
      $('#totalSaleToday').html(`${total_sales.format(2)}`)
      $('#totalTransactionToday').html(parseInt(summary.total_transactions).format(0, false))
    })

    const recentData = await this.getRecent()
    $('.item-transaski').html(reportItemView({ transaction_data: recentData, type: "month" }))
  }

  render() {
    return reportView()
  }
}

export default PosPayment