class ItemApi {
  static async getAll() {
    const items = [
      { id: 1, name: 'Jus Kucubung', price: 100000, category: { id: 1, name: "Jus" } },
      { id: 2, name: 'Jus Sirsak', price: 8000, category: { id: 1, name: "Jus" } },
      { id: 5, name: 'Jus Mangga', price: 9000, category: { id: 1, name: "Jus" } },
      { id: 3, name: 'Nasi Goreng', price: 20000, category: { id: 2, name: "Nasi" } },
      { id: 4, name: 'Ayam Bakar', price: 25000, category: { id: 2, name: "Nasi" } }
    ]

    let proccess = new Promise(resolve => setTimeout(() => resolve({
      status: true,
      data: items,
      message: "Data item berhasil diakses"
    }), 600))

    return await proccess
  }
}

export default ItemApi