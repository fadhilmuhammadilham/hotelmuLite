class TransactionApi {
  static async getAll({limit, order}) {
    let transactions = [
      { id: 1, trx_number: 'FN-0001', trx_date: '2022-01-16 10:35:00', total_price: 100000, status: 1},
      { id: 2, trx_number: 'FN-0002', trx_date: '2022-01-16 10:36:00', total_price: 50000, status: 0},
      { id: 3, trx_number: 'FN-0003', trx_date: '2022-01-16 10:37:00', total_price: 100000, status: 1},
      { id: 4, trx_number: 'FN-0004', trx_date: '2022-01-16 10:38:00', total_price: 100000, status: 1},
      { id: 5, trx_number: 'FN-0005', trx_date: '2022-01-16 10:39:00', total_price: 100000, status: 1},
      { id: 6, trx_number: 'FN-0006', trx_date: '2022-01-16 10:40:00', total_price: 100000, status: 1},
      { id: 7, trx_number: 'FN-0007', trx_date: '2022-01-16 10:41:00', total_price: 25000, status: 1},
      { id: 8, trx_number: 'FN-0008', trx_date: '2022-01-16 10:42:00', total_price: 50500, status: 1},
      { id: 9, trx_number: 'FN-0009', trx_date: '2022-01-16 10:43:00', total_price: 100000, status: 1},
      { id:10, trx_number: 'FN-0010', trx_date: '2022-01-16 10:44:00', total_price: 32000, status: 1},
      { id:11, trx_number: 'FN-0011', trx_date: '2022-01-16 10:45:00', total_price: 5000, status: 1},
      { id:12, trx_number: 'FN-0012', trx_date: '2022-01-16 10:46:00', total_price: 35000, status: 0},
      { id:13, trx_number: 'FN-0013', trx_date: '2022-01-16 10:47:00', total_price: 100000, status: 1},
    ]

    if (typeof order != 'undefined') {
      switch (order) {
        case 'desc':
          transactions = transactions.sort((a, b) => b.id - a.id)
          break
        case 'asc':
          transactions = transactions.sort((a, b) => a.id - b.id)
          break
      }
    }

    if (typeof limit != 'undefined') {
      transactions = transactions.slice(0, limit)
    }

    let proccess = new Promise(resolve => setTimeout(() => resolve({
      status: true,
      data: transactions,
      message: "Data transaction berhasil diakses"
    }), 600))

    return await proccess
  }

  static async summary() {
    let summaries = {
      sales_today: 1500000,
      transactions_today: 50
    }
    
    let proccess = new Promise(resolve => setTimeout(() => resolve({
      status: true,
      data: summaries,
      message: "Data summary transaction berhasil diakses"
    }), 600))

    return await proccess
  }
}

export default TransactionApi