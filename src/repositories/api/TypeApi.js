class TypeApi {
  static async getAll() {
    const types = [
      {id: 1, name: 'Dine In'},
      {id: 2, name: 'Room Service'},
      {id: 3, name: 'Bunquet'},
    ]

    let proccess = new Promise(resolve => setTimeout(() => resolve({
      status: true,
      data: types,
      message: "Data type berhasil diakses"
    }), 500))

    return await proccess
  }
}

export default TypeApi