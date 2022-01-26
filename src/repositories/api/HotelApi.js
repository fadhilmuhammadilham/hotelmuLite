class HotelApi {
  static async signin(hotelId, securityCode) {
    const hotels = [
      {hotelId: 'HT-001', securityCode: '123456'},
      {hotelId: 'HT-002', securityCode: '234567'},
      {hotelId: 'HT-003', securityCode: '345678'},
    ]
    
    let postCheckHotel = new Promise(resolve => setTimeout(() => {
      let hotel = hotels.find(hotel => hotelId==hotel.hotelId && securityCode == hotel.securityCode)

      resolve(hotel ? { status: true, message: "Hotel terdaftar" }: { status: false, message: "Hotel tidak ditemukan" })
    }, 1000))

    let response = await postCheckHotel;

    return response
  }
}

export default HotelApi