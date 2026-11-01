# Test Quiz — Android APK

Oddiy test quiz ilovasi. HTML/CSS/JavaScript bilan yozilgan, Capacitor orqali Android APK ga aylantiriladi.

## Loyiha tuzilishi

```
test-quiz/
├── package.json          # Kutubxonalar va buyruqlar
├── capacitor.config.json # Ilova nomi va ID si
├── README.md
└── www/                  # Ilova kodi (veb-sahifa)
    ├── index.html        # Ekranlar (boshlash, savollar, natija)
    ├── style.css         # Dizayn
    ├── app.js            # Quiz mantig'i
    └── questions.js      # SAVOLLAR SHU YERDA
```

## 1. Kerakli dasturlar

- **Node.js** (18 yoki undan yangi): https://nodejs.org
- **Android Studio**: https://developer.android.com/studio (ichida Android SDK bo'ladi)

## 2. Loyihani tayyorlash

Loyiha papkasida terminalni oching va quyidagilarni bajaring:

```bash
npm install
npx cap add android
npx cap sync android
```

`npx cap add android` buyrug'i faqat bir marta ishlatiladi. U `android/` papkasini yaratadi.

## 3. APK yig'ish

1. Android Studio'ni oching:
   ```bash
   npx cap open android
   ```
2. Gradle sinxronlanishini kuting.
3. Menyudan **Build → Build Bundle(s) / APK(s) → Build APK(s)** ni tanlang.
4. Tayyor APK fayl shu yerda bo'ladi:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## 4. Telefonga o'rnatish

1. `app-debug.apk` faylini telefonga o'tkazing (USB, Telegram yoki Google Drive orqali).
2. Telefonda faylni oching.
3. "Noma'lum manbalardan o'rnatish" so'ralsa, ruxsat bering.
4. O'rnatishni tugatib, ilovani oching.

## 5. Savollarni o'zgartirish

`www/questions.js` faylini oching. Har bir savol quyidagi ko'rinishda:

```js
{
  question: "Savol matni?",
  options: ["Variant 1", "Variant 2", "Variant 3", "Variant 4"],
  answer: 1   // to'g'ri javob indeksi: 0, 1, 2 yoki 3
}
```

O'zgartirgandan keyin `npx cap sync android` ni qayta bajarib, APK ni qayta yig'ing.

## Muhim eslatmalar

- `app-debug.apk` sinov uchun. Do'konga (Google Play) chiqarish uchun **release** APK va raqamli imzo kerak bo'ladi.
- `capacitor.config.json` dagi `appId` (`uz.testquiz.app`) ni o'zingizning noyob ID ingiz bilan almashtiring, masalan `uz.ismingiz.testquiz`. ID o'zgartirilgandan keyin `npx cap sync android` qiling.
