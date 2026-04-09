# 📱 Prim-Uslugi Android App

Play Market uchun tayyor Android ilovasi.

## Loyiha tarkibi

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── java/uz/primservice/app/
│   │   │   ├── MainActivity.java      ← WebView ilovasi
│   │   │   └── SplashActivity.java    ← Boshlang'ich ekran
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   ├── activity_main.xml   ← WebView + ProgressBar
│   │   │   │   └── activity_splash.xml ← Splash ekran dizayni
│   │   │   ├── values/
│   │   │   │   ├── strings.xml
│   │   │   │   ├── colors.xml
│   │   │   │   └── styles.xml
│   │   │   └── mipmap-*/             ← Ilova ikonkalari
│   │   ├── assets/
│   │   │   └── offline.html          ← Internet yo'q sahifasi
│   │   └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── settings.gradle
└── gradle/wrapper/
    └── gradle-wrapper.properties
```

---

## 🚀 Ilovani ochish va build qilish

### 1-qadam: Android Studio'ni o'rnatish
- [Android Studio](https://developer.android.com/studio) ni yuklab oling
- O'rnatib, ishga tushiring

### 2-qadam: Loyihani ochish
1. Android Studio'ni oching
2. **"Open"** → `android-app/` papkasini tanlang
3. Gradle sync tugashini kuting (~2 daqiqa)

### 3-qadam: App ikonkasini qo'yish
`res/mipmap-*` papkalariga rasmni qo'ying:
- `mipmap-mdpi/ic_launcher.png` → **48x48**
- `mipmap-hdpi/ic_launcher.png` → **72x72**
- `mipmap-xhdpi/ic_launcher.png` → **96x96**
- `mipmap-xxhdpi/ic_launcher.png` → **144x144**
- `mipmap-xxxhdpi/ic_launcher.png` → **192x192**

> Android Studio'da: Right-click on `res` → `New → Image Asset` → logo rasmini yuklang, avtomatik barcha o'lchamlar yaratiladi!

### 4-qadam: Release APK/AAB yaratish (Play Store uchun)

#### Keystore (imzolash sertifikati) yaratish:
```bash
keytool -genkey -v -keystore primuslugi-release.keystore \
  -alias primuslugi -keyalg RSA -keysize 2048 -validity 10000
```
Parolni yodda saqlang!

#### `app/build.gradle` ga signing ma'lumotlarini qo'shing:
```groovy
android {
    signingConfigs {
        release {
            storeFile file("primuslugi-release.keystore")
            storePassword "SIZNING_PAROLINGIZ"
            keyAlias "primuslugi"
            keyPassword "SIZNING_PAROLINGIZ"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

#### Build qilish:
- Android Studio: **Build → Generate Signed Bundle/APK**
- **Android App Bundle (.aab)** ni tanlang (Play Store uchun)

---

## 📤 Play Market'ga yuklash

1. [Google Play Console](https://play.google.com/console) ga kiring
2. **"Create app"** → Ilova nomini kiriting: `Prim-Uslugi`
3. Quyidagilarni tayyorlang:
   - ✅ `.aab` fayl (Build → Generate Signed Bundle)
   - ✅ App icon 512x512 PNG
   - ✅ Feature graphic 1024x500 PNG
   - ✅ Kamida 2 ta screenshot (mobil)
   - ✅ Qisqa tavsif (80 belgi)
   - ✅ To'liq tavsif (4000 belgi)
   - ✅ Privacy Policy URL: `https://rimuslugi.vercel.app/services/privacy`
4. **Testing → Internal testing** → AAB faylni yuklang
5. **Production** release qiling

---

## ⚙️ Texnik ma'lumotlar

| Parametr | Qiymat |
|---|---|
| App ID | `uz.primservice.app` |
| Min Android | 5.0 (API 21) |
| Target Android | 14 (API 34) |
| Versiya | 1.0.0 |
| URL | `https://rimuslugi.vercel.app` |

---

## 📞 Yordam

Muammo yuzaga kelsa, Telegram orqali murojaat qiling.
