import API from "../../configs/ApiConfig"
import { getCookie } from "../../core/Cookies"
import DateCustom from "../../utils/DateCustom"

class TransactionApi {
  static async getAll({ limit, order, offset }, filters = {}) {
    let url = `${API.url}/resto/transaction`
    let bearer = 'Bearer ' + getCookie('token')

    let params = []

    if (typeof limit != 'undefined') params.push(`limit=${limit}`)
    if (typeof offset != 'undefined') params.push(`offset=${offset}`)

    if (typeof filters.trxNumber != 'undefined') if (filters.trxNumber != '') params.push(`&search[trx_number]=${filters.trxNumber}`)
    if (typeof filters.trxDate != 'undefined') if (filters.trxDate != '') params.push(`&filter[trx_date]=${filters.trxDate}`)
    if (typeof filters.status != 'undefined') if (filters.status != '') params.push(`&filter[status]=${filters.status}`)

    try {
      let response = await fetch(url + '?' + params.join('&'), {
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
        item.status.badge = status[item.status.name]
        item.total = parseFloat(item.total)
        item.total_sub = parseFloat(item.total_sub)

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

  // static async getByFilter(filters) {
  //   let url = `${API.url}/resto/transaction?limit=25`
  //   let bearer = 'Bearer ' + getCookie('token')

  //   if (filters.trxNumber) url += `&search[trx_number]=${trxNumber}`
  //   if (filters.trxDate) url += `&filter[trx_date]=${filters.trxDate}`
  //   if (filters.status) url += `&filter[status]=${filters.status}`

  //   try {
  //     let response = await fetch(url, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': bearer,
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //     })

  //     let json = await response.json()
  //     let status = { "Paid": "badge-success", "Draft": "badge-secondary", "Billed": "badge-info" }

  //     json.data = json.data.map(item => {
  //       item.status.badge = status[item.status.name]
  //       item.total = parseFloat(item.total)
  //       item.total_sub = parseFloat(item.total_sub)
  //       return item
  //     })

  //     return json
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  static async save(basketService) {
    let url = `${API.url}/resto/transaction`
    let bearer = 'Bearer ' + getCookie('token')

    let items = basketService.items.map(item => {
      return { item_id: item.id, name: item.name, qty: item.qty, price: item.price, discount: item.discount, note: item.note, total_sub: item.totalSub, total: item.total }
    })

    const transactionData = {
      trx_date: DateCustom.getNowFormated(),
      shift_id: basketService.shift.id,
      guest_id: typeof basketService.guest.id != 'undefined' ? basketService.guest.id : 0,
      waiter_id: basketService.shift.user.id,
      table_id: basketService.table.id,
      outlet_id: basketService.type.id,
      number_of_guest: basketService.numberOfGuest,
      status: basketService.status,
      items: items,
      total_sub: basketService.totalSub,
      discount: basketService.discount.discount,
      discount_type: typeof basketService.discount.discount_type != 'undefined' ? basketService.discount.discount_type : null,
      discount_note: typeof basketService.discount.discount_note != 'undefined' ? basketService.discount.discount_note : null,
      round: basketService.totalRound,
      total: basketService.total
    }

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      })

      let json = await response.json();

      return json;
    } catch (error) {
      console.log(error)
      throw new Error("Gagal menyimpan transaksi")
    }
  }

  static async update(basketService) {
    let url = `${API.url}/resto/transaction/${basketService.id}`
    let bearer = 'Bearer ' + getCookie('token')

    let items = basketService.items.map(item => {
      return { item_id: item.id, name: item.name, qty: item.qty, price: item.price, discount: item.discount, note: item.note, total_sub: item.totalSub, total: item.total }
    })

    const transactionData = {
      trx_date: basketService.trxDate,
      shift_id: basketService.shift.id,
      guest_id: typeof basketService.guest.id != 'undefined' ? basketService.guest.id : 0,
      waiter_id: basketService.shift.user.id,
      table_id: basketService.table.id,
      outlet_id: basketService.type.id,
      number_of_guest: basketService.numberOfGuest,
      status: basketService.status,
      items: items,
      total_sub: basketService.totalSub,
      discount: basketService.discount.discount,
      discount_type: typeof basketService.discount.discount_type != 'undefined' ? basketService.discount.discount_type : null,
      discount_note: typeof basketService.discount.discount_note != 'undefined' ? basketService.discount.discount_note : null,
      round: basketService.totalRound,
      total: basketService.total
    }

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
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

  static async payment(basketService) {
    let url = `${API.url}/resto/transaction/${basketService.id}/payment`
    let bearer = 'Bearer ' + getCookie('token')

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(basketService.payment)
      })

      let json = await response.json()

      return json
    } catch (error) {
      console.log(error);
    }
  }

  static async addItem(trxId, item) {
    let url = `${API.url}/resto/transaction/${trxId}/item`
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

  static async updateItem(trxId, itemId, qty, disc, note) {
    let url = `${API.url}/resto/transaction/${trxId}/item/${itemId}`

    let bearer = 'Bearer ' + getCookie('token')
    let items = { item_id: itemId, qty: qty, discount: disc, note: note }

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

  static async deleteItem(trxId, itemId) {
    let url = `${API.url}/resto/transaction/${trxId}/item/${itemId}`
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