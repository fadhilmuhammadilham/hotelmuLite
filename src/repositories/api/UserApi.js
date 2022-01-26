class UserApi {
  static async login(username, password) {
    const users = [
      {username: 'fatah', password: '123456'},
      {username: 'anang', password: '123456'},
    ]
    
    let loginProccess = new Promise(resolve => setTimeout(() => {
      let user = users.find(user => username==user.username && password == user.password)
      let d = new Date()
      resolve(user ? { status: true, data: { token: '1234567890', expire: (d.getTime() + (0.5 * 24 * 60 * 60 * 1000)) }, message: "Login berhasil" }: { status: false, message: "Login gagal" })
    }, 1000))

    let response = await loginProccess;

    return response
  }
}

export default UserApi