# Resto POS - Hotel MU
**Resto POS - Hotel MU** adalah aplikasi mobile pos yang dibangun menjadi addons pada aplikasi PMS HotelMU. Aplikasi ini berbasis hybrid yang didevelop dengan menggunakan [Webpack](https://webpack.js.org/ "Webpack") sebagai modul builder-nya dan [Capacitor](https://capacitorjs.com/ "Capacitor") sebagai platform native runtime

## Instalasi
* Masuk ke root folder project ini memalui terminal lalu jalankan perintah ini:
    ```
    npm install
    ```
## Penggunaan
### Menjalankan aplikasi development pada browser
* Untuk menjalankan aplikasi pada saat development gunakan:
    ```
    npm run dev
    ```
* Secara default server dev menggunakan port `8000`. Akses melalui browser dengan URL `http://localhost:8000`
### Menjalankan aplikasi development pada android
Pada saat menjalankan aplikasi develompent pada android diperlukan engine dari capacitor. Berikut ini cara menjalankannya:
1. Salin berkas `capacitor.config.json.example` menjadi `capacitor.config.json` 
    * Ubah bagian ini
    ```
    "server": {
        "url": "http://0.0.0.0:8000",
        "cleartext": true
    }
    ```
    * Ubah `http://0.0.0.0:8000` menjadi `http://{ip address pc}:8000` contoh:
    ```
    "server": {
        "url": "http://192.168.0.14:8000",
        "cleartext": true
    }
    ```
2. Jalankan sinkronisasi konfigurasi capacitor dengan menjalankan perintah berikut:
    ```
    npx cap sync
    ```
3. Buka project dengan Android Studio dengan menjalankan perintah berikut:
    ```
    npx cap open android
    ```
4. Jalankan server development
    ```
    npm run dev
    ```
5. Jalankan debug dari Android Studio

Untuk lebih detail silahkan baca pada dokumentasi [Capacitor](https://capacitorjs.com/docs "Capacitor Docs")
### Melakukan build ke aplikasi android
- Apabila dalam mode development. Ubah terlebih dahulu konfigurasi capacitor dalam berkas `capacitor.config.json`. Yaitu dengan menghapus bagian atribut `server`.

    - Mode development
    ```json
    {
        "appId": "id.hotelmu.restopos",
        "appName": "Resto POS",
        "webDir": "www",
        "bundledWebRuntime": false,
        "server": {
            "url": "http://192.168.0.7:8000",
            "cleartext": true
        }
    }
    ```
    - Mode Build
    ```json
    {
        "appId": "id.hotelmu.restopos",
        "appName": "Resto POS",
        "webDir": "www",
        "bundledWebRuntime": false
    }
    ```
    kemudian lakukan sinkronisasi ulang engine capacitor-nya `npx cap sync`
- Build aplikasi menggunakan perintah terminal berikut:

    ```npm run build```

- Kemuadian buka projek menggunakan program Android Studio dengan menjalankan perintah 

    `npx cap open android`
- Build aplikasi menggunakan program Android Studio