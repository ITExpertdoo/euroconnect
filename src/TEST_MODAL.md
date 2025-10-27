# 🧪 Test Reset Password Modal

## 🔗 Test Link

Kada klikneš na ovaj link, trebalo bi da se automatski otvori modal za reset lozinke:

```
https://9475eb8a-a2bd-4d10-9bf8-967bc90ce253-figmaiframepreview.figma.site/?reset-token=f2bfaea1-dfd3-4773-a395-410b0a631e52
```

---

## ✅ Šta Bi Trebalo Da Se Desi:

1. **Aplikacija se učitava** (landing page)
2. **Toast notifikacija se pojavljuje** → "🔐 Otvaranje forme za reset lozinke..."
3. **Modal se automatski otvara** preko landing page-a
4. **Modal prikazuje:**
   - Naslov: "Resetuj lozinku"
   - Dva input polja za novu lozinku
   - Dugmad "Otkaži" i "Resetuj lozinku"

---

## 🔍 Debugging Koraci:

### 1. Otvori Browser Console (F12)

Trebalo bi da vidiš sledeće logove:

```
🔍 Checking for reset token in URL: https://.../?reset-token=f2bfaea1-dfd3-4773-a395-410b0a631e52
🔑 Reset token found: f2bfaea1-dfd3-4773-a395-410b0a631e52
✅ Reset token detected! Opening reset password modal...
✅ Reset modal opened with token: f2bfaea1-dfd3-4773-a395-410b0a631e52
```

### 2. Proveri State u React DevTools

Ako imaš React DevTools:
- `resetToken` → `"f2bfaea1-dfd3-4773-a395-410b0a631e52"`
- `showResetModal` → `true`

### 3. Proveri DOM

Otvori Elements tab i traži:
- Dialog element sa `role="dialog"`
- DialogContent sa tekstom "Resetuj lozinku"

---

## ❌ Moguće Greške:

### Greška 1: Toast se ne pojavljuje

**Problem:** `toast` funkcija ne radi ili nije importovana.

**Proveri console za greške:**
```
Uncaught ReferenceError: toast is not defined
```

**Rešenje:** Import je sada `import { toast } from 'sonner@2.0.3'`

---

### Greška 2: Modal se ne otvara

**Problem 1:** `showResetModal` je `false`

**Proveri:** Da li se log `✅ Reset token detected!` prikazuje?
- **DA** → Problem je sa ResetPasswordModal komponentom
- **NE** → Token nije detektovan u URL-u

**Problem 2:** Modal komponenta se ne renderuje

**Proveri kod:**
```tsx
{resetToken && (
  <ResetPasswordModal
    open={showResetModal}
    onClose={...}
    resetToken={resetToken}
  />
)}
```

---

### Greška 3: "Nevažeći ili istekao reset link"

**Problem:** Token je istekao (više od 1 sata) ili je već upotrebljen.

**Rešenje:** 
1. Zatraži novi reset link preko "Zaboravili ste lozinku?"
2. Ili koristi Admin Panel > "🔐 Test Reset Password Email" dugme

---

## 🎯 Kako Testirati Ceo Flow:

### Korak 1: Odjavi se
```
(Klikni na "Odjavi se" ako si ulogovan)
```

### Korak 2: Zatraži Reset Link
```
Landing Page > Prijava > Zaboravili ste lozinku? > office@euroconnectbg.com > Pošalji link
```

### Korak 3: Proveri Email
```
Inbox na office@euroconnectbg.com
Subject: "🔑 Reset lozinke - EuroConnect Europe"
```

### Korak 4: Klikni na Dugme
```
Email > [Resetuj lozinku] (zlatno dugme)
```

### Korak 5: Unesi Novu Lozinku
```
Modal > Nova lozinka: office1234
Modal > Potvrdi lozinku: office1234
Modal > [Resetuj lozinku]
```

### Korak 6: Prijavi se
```
Landing Page > Prijava > office@euroconnectbg.com / office1234
```

---

## 🎉 Success Kriterijumi:

- [ ] Toast notifikacija se pojavljuje
- [ ] Modal se automatski otvara
- [ ] Mogu da unesem novu lozinku
- [ ] Lozinke moraju biti identične
- [ ] Minimum 6 karaktera
- [ ] Prikazuje se success poruka
- [ ] Mogu da se prijavim sa novom lozinkom

---

## 📞 Ako I Dalje Ne Radi:

Pošalji mi sledeće informacije:

1. **Browser Console Output** (copy/paste sve logove)
2. **Screenshot** (šta vidiš na ekranu)
3. **Network Tab** (da li ima failed requests)
4. **React DevTools State** (resetToken i showResetModal vrednosti)

---

_Happy testing! 🚀_
