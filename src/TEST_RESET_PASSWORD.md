# 🧪 Brzi Test - Reset Password

## 🎯 Šta je Popravljeno?

1. ✅ **Backend sada generiše ispravan link** - Koristi Figma preview URL umesto localhost
2. ✅ **Dodato detaljno logovanje** - Možeš pratiti šta se dešava u konzoli
3. ✅ **Test dugme u Admin Panelu** - Možeš testirati direktno iz admin interfejsa
4. ✅ **Novi admin nalog** - `office@euroconnectbg.com` (isti kao email adresa)

---

## 🚀 Kako Testirati (BRZO)

### Metoda 1: Koristi Test Dugme (NAJBRŽE)

1. **Prijavi se kao admin:**
   ```
   Email: office@euroconnectbg.com
   Lozinka: office123
   ```

2. **Idi u Admin Panel > Podešavanja > Email Notifikacije**

3. **Klikni na "🔐 Test Reset Password Email" dugme**

4. **Kada te pita za email, unesi:**
   ```
   office@euroconnectbg.com
   ```

5. **Proveri inbox** - Trebalo bi da dobiješ email sa dugmetom "Resetuj lozinku"

6. **Klikni na dugme** - Trebalo bi da se otvori modal za reset lozinke

7. **Unesi novu lozinku** (npr. `office1234`)

8. **Testiranje uspešno!** 🎉

---

### Metoda 2: Normalan Flow (Kao Pravi Korisnik)

1. **Odjavi se** (ako si prijavljen)

2. **Klikni "Prijava"**

3. **Klikni "Zaboravili ste lozinku?"**

4. **Unesi email:**
   ```
   office@euroconnectbg.com
   ```

5. **Klikni "Pošalji link"**

6. **Proveri inbox na `office@euroconnectbg.com`**

7. **Klikni na dugme "Resetuj lozinku" u email-u**

8. **Trebalo bi da se otvori aplikacija sa modalnom**

9. **Unesi novu lozinku i klikni "Resetuj lozinku"**

---

## 🔍 Šta Gledati u Browser Console-i

Trebalo bi da vidiš ovakve poruke:

### Kada klikneš na link:
```
🔍 Checking for reset token in URL: https://...?reset-token=abc-xyz-123
🔑 Reset token found: abc-xyz-123
✅ Reset modal opened with token
```

### Kada submittuješ novu lozinku:
```
🔐 Attempting password reset with token: abc-xyz-123
🔐 Reset password response: { status: 200, data: { success: true } }
```

---

## 📧 Email Provera

Email bi trebalo da izgleda ovako:

**Subject:** 🔑 Reset lozinke - EuroConnect Europe

**Sadržaj:**
- Pozdrav {Ime},
- Primili smo zahtev za reset vaše lozinke...
- **[Resetuj lozinku]** ← Zlatno dugme
- Link je validan 1 sat
- Ako niste zatražili reset lozinke, ignorišite ovaj email

---

## ❌ Ako Ne Radi

### Problem: Email nije stigao

**Proveri:**
1. Da li je email konfigurisan u Admin Panel?
2. Da li je Resend API key validan?
3. Da li je "From Email" postavljen na `@euroconnectbg.com` domenu?
4. Testuj sa "Test Email" dugmetom prvo

### Problem: Link ne otvara modal

**Proveri browser console:**
- Da li se prikazuje "Reset token found"?
- Ako ne, link možda ne sadrži `?reset-token=` parametar

**Proveri server log:**
```
📧 Generating password reset link: https://...
```

### Problem: "Nevažeći ili istekao reset link"

**Razlozi:**
- Token je stariji od 1 sata
- Token je već upotrebljen
- Token nije pronađen u bazi

**Rešenje:**
- Zatraži novi reset link

---

## 📊 Test Checklist

Ispuni ovaj checklist dok testiraš:

- [ ] Email je stigao na inbox
- [ ] Email ima zlatno dugme "Resetuj lozinku"
- [ ] Link u email-u ima `?reset-token=` parametar
- [ ] Kada kliknem na link, aplikacija se otvara
- [ ] Modal za reset lozinke se automatski otvara
- [ ] Mogu da unesem novu lozinku (minimum 6 karaktera)
- [ ] Mora da potvrdi lozinku (obe moraju biti iste)
- [ ] Kada kliknem "Resetuj lozinku", dobijam success poruku
- [ ] Mogu da se prijavim sa novom lozinkom

---

## 🎉 Ako Sve Radi

Čestitam! Reset password funkcionalnost radi ispravno. Sada možeš:

1. **Testirati sa drugim nalozima:**
   - `candidate@test.com`
   - `employer@test.com`
   - `admin@euroconnect.eu`

2. **Testirati edge cases:**
   - Šta se dešava ako kliknem na link 2 puta?
   - Šta se dešava posle 1 sata?
   - Šta se dešava sa pogrešnim email-om?

---

## 📝 Dodatna Dokumentacija

- **Detaljniji debugging:** Pogledaj `/RESET_PASSWORD_DEBUG.md`
- **Email setup:** Pogledaj `/EMAIL_NOTIFICATIONS.md`
- **Demo kredencijali:** Pogledaj `/DEMO_CREDENTIALS.md`

---

_Happy testing! 🚀_
