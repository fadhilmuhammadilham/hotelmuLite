import API from "../../configs/ApiConfig"
import { getCookie } from "../../core/Cookies"
import DateCustom from "../../utils/DateCustom"
import BasketLocalStorage from "../localstorage/BasketLocalStorage"
import ShiftLocalStorage from "../localstorage/ShiftLocalStorage"
import TransactionFilterLocalStorage from "../localstorage/TransactionFilterLocalStorage"
import TransactionLocalStorage from "../localstorage/TransactionLocalStorage"

class TransactionApi {
  static async getAll({ limit, order }) {
    let url = `${API.url}/resto/transaction`
    let bearer = 'Bearer ' + getCookie('token')

    if (typeof limit != 'undefined') {
      url = `${API.url}/resto/transaction?limit=${limit}`
    }

    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      let json = await response.json();
      let status = { "Paid": "badge-success", "Draft": "badge-secondary", "Billed": "badge-info" }

      json.data = json.data.map(item => {
        item.total_prices = parseFloat(item.total_prices)
        item.status.badge = status[item.status.name]
        return item
      })

      return json

    } catch (err) {
      console.log(err)
    }
  }

  static async summaryToday() {
    let url = `${API.url}/resto/report/summary/today`;
    let bearer = "Bearer " + getCookie('token')

    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  static async getByFilter() {
    let bearer = 'Bearer ' + getCookie('token')
    let trx_number = TransactionFilterLocalStorage.get('code')
    let trx_date = TransactionFilterLocalStorage.get('date')
    let status = TransactionFilterLocalStorage.get('status')
    let url = `${API.url}/resto/transaction?limit=25`

    if (trx_number.length === 0 && trx_date.length > 0 && status.length > 0) {
      url = url + `&filter[trx_date]=${trx_date}&filter[status]=${status}`
    } else if (trx_number.length > 0 && trx_date.length === 0 && status.length > 0) {
      url = url + `&search[trx_number]=${trx_number}&filter[status]=${status}`
    } else if (trx_number.length > 0 && trx_date.length > 0 && status.length === 0) {
      url = url + `&search[trx_number]=${trx_number}&filter[trx_date]=${trx_date}`
    } else if (trx_number.length > 0 && trx_date.length === 0 && status.length === 0) {
      url = url + `&search[trx_number]=${trx_number}`
    } else if (trx_number.length === 0 && trx_date.length > 0 && status.length === 0) {
      url = url + `&filter[trx_date]=${trx_date}`
    } else if (trx_number.length === 0 && trx_date.length === 0 && status.length > 0) {
      url = url + `&filter[status]=${status}`
    } else {
      url = url + `&search[trx_number]=${trx_number}&filter[trx_date]=${trx_date}&filter[status]=${status}`
    }

    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      let json = await response.json()
      let status = { "Paid": "badge-success", "Draft": "badge-secondary", "Billed": "badge-info" }

      json.data = json.data.map(item => {
        item.total_prices = parseFloat(item.total_prices)
        item.status.badge = status[item.status.name]
        return item
      })

      return json

    } catch (error) {
      console.log(error)
    }
  }

  static async save(basketService) {
    let url = `${API.url}/resto/transaction`
    let bearer = 'Bearer ' + getCookie('token')

    let items = basketService.items.map(item => {
      return { item_id: item.id, qty: item.qty, price: item.price, discount: item.discount, note: item.note, total_sub: item.totalSub, total: item.total }
    })

    console.log({
      trx_date: DateCustom.getNowFormated(),
      shift_id: basketService.shift.id,
      guest_id: typeof basketService.guest.id != 'undefined' ? basketService.guest.id : 0,
      waiter_id: basketService.shift.user.id,
      table_id: basketService.table.id,
      outlet_id: basketService.type.id,
      number_of_guest: basketService.numberOfGuest,
      status: 0,
      items: items,
      total_sub: basketService.totalSub,
      discount: basketService.discount.discount,
      discount_type: typeof basketService.discount.discount_type != 'undefined' ? basketService.discount.discount_type : null,
      discount_note: typeof basketService.discount.discount_note != 'undefined' ? basketService.discount.discount_note : null,
      round: basketService.totalRound,
      total: basketService.total
    })

    return { status: false }

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trx_date: DateCustom.getNowFormated(),
          shift_id: basketService.shift.id,
          guest_id: typeof basketService.guest.id != 'undefined' ? basketService.guest.id : 0,
          waiter_id: basketService.shift.user.id,
          table_id: basketService.table.id,
          outlet_id: basketService.type.id,
          number_of_guest: basketService.numberOfGuest,
          status: 0,
          discount: basketService.discount.discount,
          discount_type: typeof basketService.discount.discount_type != 'undefined' ? basketService.discount.discount_type : null,
          discount_note: typeof basketService.discount.discount_note != 'undefined' ? basketService.discount.discount_note : null,
          items: items
        })
      })

      let json = await response.json();

      return json;

    } catch (error) {
      console.log(error)
      throw new Error("Gagal menyimpan transaksi")
    }
  }

  static async update(trx_id, status) {
    let url = `${API.url}/resto/transaction/${trx_id}`
    let bearer = 'Bearer ' + getCookie('token')
    let d = new Date()
    let month = d.getMonth() + 1
    let date = [d.getFullYear(), month.toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join('-') + ' ' + [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(':')
    let guest_id = TransactionLocalStorage.get('guest_id') !== null ? TransactionLocalStorage.get('guest_id') : null
    let table_id = TransactionLocalStorage.get('table_id')
    let outlet_id = TransactionLocalStorage.get('outlet_id')
    let number_of_guest = TransactionLocalStorage.get('number_of_guest')
    let discount = TransactionLocalStorage.get('discount').discount > 0 ? TransactionLocalStorage.get('discount').discount : 0
    let discount_type = TransactionLocalStorage.get('discount').discount_type !== "" ? TransactionLocalStorage.get('discount').discount_type : null
    let discount_note = TransactionLocalStorage.get('discount').discount_note !== "" ? TransactionLocalStorage.get('discount').discount_note : null

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trx_date: date,
          guest_id: guest_id,
          waiter_id: 2,
          table_id: table_id,
          outlet_id: outlet_id,
          number_of_guest: number_of_guest,
          status: status,
          discount: discount,
          discount_type: discount_type,
          discount_note: discount_note
        })
      })

      let json = await response.json()

      return json
    } catch (error) {
      console.log(error);
    }
  }

  static async detail(trx_id) {
    let url = `${API.url}/resto/transaction/${trx_id}`
    let bearer = 'Bearer ' + getCookie('token')

    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      let status = { "Paid": "badge-success", "Draft": "badge-secondary", "Billed": "badge-info" }
      let json = await response.json()

      if (typeof json.data != 'undefined') {
        json.data.status.badge = status[json.data.status.name]
      }

      return json

    } catch (error) {
      console.log(error);
    }
  }

  static async payment(trx_id) {
    let url = `${API.url}/resto/transaction/${trx_id}/payment`
    let bearer = 'Bearer ' + getCookie('token')
    let payment_data = BasketLocalStorage.get('payment') != false ? BasketLocalStorage.get('payment') : TransactionLocalStorage.get('payment')

    console.log(payment_data);

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment_data)
      })

      let json = await response.json()

      return json
    } catch (error) {
      console.log(error);
    }
  }

  static async addItem(item) {
    let trx_id = TransactionLocalStorage.get('id')
    let url = `${API.url}/resto/transaction/${trx_id}/item`
    let bearer = 'Bearer ' + getCookie('token')
    let items = { item_id: item.id, qty: 1, discount: 0, note: "" }

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(items)
      })

      let json = await response.json()

      return json
    } catch (error) {
      console.log(error);
    }
  }

  static async updateItem(item_id, qty, disc, note) {
    let trx_id = TransactionLocalStorage.get('id')
    let url = `${API.url}/resto/transaction/${trx_id}/item/${item_id}`
    let bearer = 'Bearer ' + getCookie('token')
    let items = { item_id: item_id, qty: qty, discount: disc, note: note }

    try {
      let response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(items)
      })

      let json = await response.json()

      return json
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteItem(item_id) {
    let trx_id = TransactionLocalStorage.get('id')
    let url = `${API.url}/resto/transaction/${trx_id}/item/${item_id}`
    let bearer = 'Bearer ' + getCookie('token')

    try {
      let response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      let json = await response.json()

      return json
    } catch (error) {
      console.log(error);
    }
  }
}

export default TransactionApi