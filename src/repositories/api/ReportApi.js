import API from "../../configs/ApiConfig";
import { getCookie } from "../../core/Cookies";

class ReportApi {
  static async getRecent() {
    let d = new Date()
    let m = d.getMonth() + 1
    let month = m.toString().padStart(2, '0')
    let year = d.getFullYear()
    let url = `${API.url}/resto/report/monthly/${year}-${month}`;
    let bearer = 'Bearer ' + getCookie('token')

    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': bearer,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })

    let json = await response.json();

    json.data = json.data.map((item) => {
      item.trx_total_prices = parseFloat(item.trx_total_prices)
      item.trx_count = parseInt(item.trx_count)

      return item
    })

    return json;
  }

  static async getMonthly(year, month) {
    let url = `${API.url}/resto/report/monthly/${year}-${month}`;
    let bearer = 'Bearer ' + getCookie('token')

    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': bearer,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })

    let json = await response.json();

    json.data = json.data.map((item) => {
      item.trx_total_prices = parseFloat(item.trx_total_prices)
      item.trx_count = parseInt(item.trx_count)

      return item
    })

    return json;
  }

  static async getRecentYear(year) {
    let url = `${API.url}/resto/report/yearly/${year}`;
    let bearer = 'Bearer ' + getCookie('token')

    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': bearer,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })

    let json = await response.json();

    json.data = json.data.map((item) => {
      item.trx_total_prices = parseFloat(item.trx_total_prices)
      item.trx_count = parseInt(item.trx_count)

      return item
    })

    return json;
  }
}

export default ReportApi