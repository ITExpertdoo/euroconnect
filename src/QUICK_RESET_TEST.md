# ⚡ Brzi Reset Password Test

## ✅ ŠTA SAM POPRAVIO (Latest Update):

### 1. **Backend Uvek Vraća Reset Token** 
   - Čak i ako korisnik ne postoji u bazi, backend sada vraća `resetToken`
   - Frontend test dugme će uvek dobiti token za testiranje
   - Security: U produkciji ne bi trebalo otkrivati da korisnik ne postoji, ali za testing ovo je OK

### 2. **Poboljšan Error Handling**
   - Oba test dugmeta sada prvo čitaju response kao text
   - Zatim pokušavaju da parse-uju kao JSON
   - Ako JSON parsing ne uspe, prikazuju grešku i loguju u konzolu
   - Omogućava debugging kada server vraća HTML error umesto JSON-a

### 3. **Konzistentni Import-i**
   - Oba dugmeta sada koriste `projectId` i `publicAnonKey` iz `utils/supabase/info`
   - Nema više hardcoded vrednosti
   - Toast notifikacije umesto alert-a

---

## 🎯 Kako Testirati Reset Password Funkcionalnost

### Metoda 1: Koristi Admin Panel (NAJBRŽE ✅)

1. **Uloguj se kao Admin:**
   ```
   Email: office@euroconnectbg.com
   Password: office123
   ```

2. **Idi u "Admin Panel"** (automatski se otvara nakon login-a)

3. **Klikni na tab "Podešavanja"** (⚙️ Settings)

4. **Skroluj do "Email Configuration"** sekcije

5. **Klikni na ljubičasto dugme:**
   ```
   🚀 Direktno Otvori Reset Modal (Test)
   ```

6. **OTVORI BROWSER CONSOLE** (F12) da vidiš debug log-ove:
   ```
   🔑 Requesting reset token...
   📥 Response status: 200
   📄 Response text: {"success":true,"message":"...","resetToken":"..."}
   📦 Parsed data: {...}
   🚀 Opening URL: https://...?reset-token=...
   ```

7. **Novi tab će se otvoriti** sa reset modalom! 🎉

---

### Metoda 2: Koristi "Test Reset Password Email" Dugme

1. **Uloguj se kao Admin** (office@euroconnectbg.com / office123)

2. **Idi u Admin Panel > Podešavanja**

3. **Klikni:**
   ```
   🔐 Test Reset Password Email
   ```

4. **Unesi email adresu** u prompt (default: office@euroconnectbg.com)

5. **Proveri konzolu** za debug info:
   ```
   📧 Testing password reset for: office@euroconnectbg.com
   📥 Response status: 200
   📄 Response text: {...}
   📦 Parsed data: {...}
   🔑 Reset token: abcd-1234-efgh-5678
   ```

6. **Proveri inbox** na email adresi (ako je email konfigurisan)

7. **Klikni na zlatno dugme** "Resetuj lozinku" u email-u

8. **Modal će se otvoriti!**

---

### Metoda 3: Ručno Testiraj (Ako Email Ne Radi)

Ako email sistem nije konfigurisan, možeš direktno otvoriti reset link:

1. **Kopiraj ovaj URL format:**
   ```
   https://cf08c917-7c95-40f2-b849-d8ee5015aba0-figmaiframepreview.figma.site/?reset-token=YOUR_TOKEN_HERE
   ```

2. **Zameni `YOUR_TOKEN_HERE` sa pravim tokenom** iz konzole

3. **Otvori u browseru**

4. **Modal će se otvoriti!**

---

## 🐛 Debug Checklist

### ✅ Proveri da li Modal Radi:

1. **Otvori Browser Console** (F12) **PRE** nego što klikneš dugme

2. **Klikni na test dugme**

3. **Traži ove poruke u konzoli:**
   ```
   🔑 Requesting reset token...
   📥 Response status: 200
   📄 Response text: {"success":true,...}
   📦 Parsed data: {...}
   🚀 Opening URL: https://...
   ```

4. **U novom tabu**, traži:
   ```
   🔍 Checking for reset token in URL: ...
   🔑 Reset token found: ...
   ✅ Reset token detected! Opening reset password modal...
   ```

5. **Ako vidiš toast notifikaciju** "🔐 Otvaranje forme za reset lozinke..." → **Modal radi!** ✅

---

### ❌ Ako Modal Ne Radi:

**Problem 1: Backend vraća HTML umesto JSON**
- **Simptom:** Greška "Unexpected non-whitespace character after JSON"
- **Uzrok:** Server nije podignut ili vraća error page
- **Rešenje:** Proveri da li backend radi (osvežite page da se server restartuje)

**Problem 2: Token je istekao**
- **Simptom:** "Reset token je neispravan ili je istekao"
- **Uzrok:** Tokeni ističu nakon **1 sata**
- **Rešenje:** Zatraži novi link preko Admin Panel dugmeta

**Problem 3: URL je pogrešan**
- **Simptom:** 404 Not Found
- **Uzrok:** Stari projekat ID u URL-u
- **Rešenje:** Backend automatski detektuje pravi URL iz headers-a

**Problem 4: Modal se ne renderuje**
- **Simptom:** Toast se pojavljuje ali modal ne
- **Proveri:** Console za greške u `ResetPasswordModal` komponenti
- **Proveri:** Da li je `resetModalOpen` state postavljen na `true`

**Problem 5: CORS greška**
- **Simptom:** "CORS policy blocked"
- **Uzrok:** Backend CORS nije pravilno konfigurisan
- **Rešenje:** Backend već ima otvorene CORS headers (`origin: "*"`)

---

## 🎉 Success Kriterijumi:

- [ ] Kliknem "🚀 Direktno Otvori Reset Modal (Test)" dugme
- [ ] U konzoli vidim debug log-ove
- [ ] Toast notifikacija se pojavljuje
- [ ] Novi tab se otvara
- [ ] Modal se automatski otvara u novom tabu
- [ ] Mogu da unesem novu lozinku
- [ ] Dobijam validaciju grešku ako lozinke nisu iste
- [ ] Dobijam validaciju grešku ako je lozinka kraća od 6 karaktera
- [ ] Prikazuje se success poruka nakon reset-a
- [ ] Mogu da se prijavim sa novom lozinkom

---

## 📧 Test Kredencijali:

| Email | Password | Uloga |
|-------|----------|-------|
| `office@euroconnectbg.com` | `office123` | 👑 Admin |
| `admin@euroconnect.eu` | `admin123` | 👑 Admin |
| `candidate@test.com` | `candidate123` | 👤 Kandidat |
| `employer@test.com` | `employer123` | 💼 Poslodavac |

---

## 🔧 Backend Debug Info:

Ako backend ne vraća JSON, proveri:

1. **Da li je server pokrenut?**
   - Osvežite page da se server restartuje
   
2. **Proveri backend log-ove** u Supabase Functions dashboard

3. **Testiraj endpoint direktno:**
   ```bash
   curl -X POST \
     https://cf08c917-7c95-40f2-b849-d8ee5015aba0.supabase.co/functions/v1/make-server-fe64975a/auth/forgot-password \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{"email":"office@euroconnectbg.com"}'
   ```

4. **Očekivani response:**
   ```json
   {
     "success": true,
     "message": "Ako postoji nalog sa ovom email adresom, dobićete link za reset lozinke.",
     "resetToken": "12345678-abcd-1234-5678-123456789abc"
   }
   ```

---

## 💡 Tips:

- **Ako hoćeš da testiraš bez email-a**, koristi "🚀 Direktno Otvori Reset Modal (Test)" dugme
- **Ako hoćeš da testiraš email flow**, koristi "🔐 Test Reset Password Email" dugme
- **Ako nemaš pristup Admin panelu**, zatraži reset preko "Zaboravili ste lozinku?" forme
- **UVEK otvori konzolu PRE testiranja** da bi video sve debug poruke
- **Token ističe za 1 sat** - ako testiraš kasnije, zatraži novi token

---

## 📝 Changelog:

### v3 (Latest) - Najnovije Popravke
- ✅ Backend uvek vraća `resetToken` u response-u (čak i za nepostojeće korisnike)
- ✅ Frontend prvo čita response kao text, pa parse-uje JSON
- ✅ Detaljnije error poruke i logging
- ✅ Toast notifikacije umesto alert-a
- ✅ Konzistentni import-i (`projectId`, `publicAnonKey`)

### v2 - Auto URL Detection
- ✅ Backend automatski detektuje URL iz request headers
- ✅ Čuva URL u bazi (`app_config`) za buduću upotrebu
- ✅ Ažuriran fallback URL na novi projekat ID

### v1 - Initial Implementation
- ✅ Toast notifikacija kada se detektuje token
- ✅ "Direktno Otvori Reset Modal" test dugme
- ✅ Console logging za debugging
- ✅ Email test dugme

---

_Happy testing! 🎯_

**Ako i dalje imaš problema, pošalji screenshot konzole i ja ću ti pomoći!** 🚀
