class OutletApi {
  static async getAll(hotelId) {
    const outlets = [
      {id: 'ot01', name: 'Gym'},
      {id: 'ot02', name: 'Toko Oleh-oleh'},
      {id: 'ot03', name: 'Kolam Renang'},
    ]

    let proccess = new Promise(resolve => setTimeout(() => resolve({
      status: true,
      data: outlets,
      message: "Data outlet berhasil diakses"
    }), 1000))

    return await proccess
  }
}

export default OutletApi