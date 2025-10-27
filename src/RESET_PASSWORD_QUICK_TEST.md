# 🔐 RESET PASSWORD - BRZI TEST

## ✅ Šta je popravljeno:

1. **APP_URL Konfiguracija** - Dodato polje u Admin Panel → Settings → Email za javni URL aplikacije
2. **Backend Update** - Backend sada koristi `appUrl` umesto Figma iframe URL-a
3. **Email Link** - Link u email-u sada vodi na pravi URL koji možeš otvoriti

---

## 🧪 KAKO TESTIRATI:

### **KORAK 1: Konfiguriši APP_URL**

1. Idi na **Admin Panel** (dugme "Backend & Admin Demo")
2. Klikni na **Settings** tab
3. Skroluj do **Email Servis Konfiguracija**
4. Pronađi polje **"🔗 App URL (za reset password linkove)"**
5. Unesi:
   - **Za test:** `https://your-production-app.com` (ili bilo koji URL gde ćeš deploy-ovati aplikaciju)
   - **Za development:** Trenutno ne možeš koristiti Figma Make URL jer ne može da se otvori direktno
6. Klikni **"Sačuvaj"**

---

### **KORAK 2: Pošalji Reset Email**

#### **OPCIJA A - Preko Test Dugmeta (Preporučeno)**
1. U Admin Panel → Settings tab
2. Klikni **"🚀 Backend Test (Real Email)"**
3. Email će biti poslat na **office@euroconnectbg.com**

#### **OPCIJA B - Preko Forgot Password Forme**
1. Idi na Landing Page
2. Klikni **"Prijavi se"** → **"Zaboravili ste lozinku?"**
3. Unesi **office@euroconnectbg.com**
4. Klikni **"Pošalji Reset Link"**

---

### **KORAK 3: Proveri Email**

1. Otvori email inbox za **office@euroconnectbg.com**
2. Naći ćeš email sa naslovom **"🔐 Reset Lozinke - EuroConnect Europe"**
3. Email sadrži link oblika: `https://your-production-app.com?reset-token=XXXXX`

---

### **KORAK 4: Resetuj Lozinku**

**VAŽNO:** Ovaj korak **NE MOŽE** da radi u Figma Make okolini jer:
- Link vodi na `https://your-production-app.com` (ne Figma iframe)
- Aplikacija mora biti deploy-ovana na pravi URL

**Za produkciju:**
1. Klikni na link u email-u
2. Aplikacija će automatski otvoriti Reset Password modal
3. Unesi novu lozinku
4. Klikni **"Resetuj lozinku"**

---

## ⚠️ **VAŽNA NAPOMENA - OGRANIČENJA FIGMA MAKE:**

### **Zašto link iz email-a NE RADI u Figma Make?**

Figma Make aplikacije:
- ✅ Rade samo **unutar Figma iframe-a**
- ❌ **NE MOGU** se otvoriti direktno u browser-u
- ❌ **NE MOGU** se otvoriti preko email linka

### **Šta RADI u Figma Make:**

1. **Simulacija email klika** - Klikni "✨ Simuliraj Email Klik" u Admin Panel → Settings
2. **Direktan test** - Klikni "⚡ INSTANT TEST" dugme koje automatski otvara reset modal

### **Šta će raditi u PRODUKCIJI:**

1. ✅ Korisnik zatraži reset lozinke
2. ✅ Email bude poslat sa linkom
3. ✅ Link vodi na `https://your-app.com?reset-token=xxxxx`
4. ✅ Aplikacija detektuje token u URL-u
5. ✅ Automatski se otvara Reset Password modal
6. ✅ Korisnik unese novu lozinku i resetuje je

---

## 🚀 **DEPLOYMENT INSTRUKCIJE:**

Da bi reset password **zaista radio**, aplikaciju moraš deploy-ovati na:

### **Opcija 1: Vercel (Preporučeno)**
```bash
npm run build
vercel deploy
```

### **Opcija 2: Netlify**
```bash
npm run build
netlify deploy --prod
```

### **Opcija 3: Bilo koji drugi hosting**
- Build aplikaciju: `npm run build`
- Upload `dist/` folder na hosting
- Konfiguriši custom domain

Nakon deployment-a:
1. Kopiraj **javni URL** (npr. `https://euroconnect.vercel.app`)
2. Unesi ga u **Admin Panel → Settings → App URL**
3. Sačuvaj konfiguraciju
4. **GOTOVO!** Email linkovi će sada raditi!

---

## 🎯 **ZA TRENUTNO TESTIRANJE (FIGMA MAKE):**

Posto ne možeš otvoriti link iz email-a, koristi:

1. **Admin Panel → Settings Tab**
2. Klikni **"⚡ INSTANT TEST"** dugme
3. Reset Password stranica će se otvoriti u novom tabu
4. Unesi novu lozinku i klikni "Resetuj lozinku"
5. ✅ Lozinka će biti promenjena!

---

## 📧 **Email Template Primer:**

```
Poštovani [Ime],

Primili smo zahtev za reset vaše lozinke.

Kliknite na link ispod da resetujete lozinku:
https://your-app.com?reset-token=abc123-xyz789-...

Link važi 1 sat.

Ako niste tražili reset lozinke, ignorišite ovaj email.

Srdačan pozdrav,
EuroConnect Europe Tim
```

---

## 🔧 **Troubleshooting:**

### **Email ne stiže?**
- Proveri da je **Email konfiguracija aktivirana** (enabled)
- Proveri da je **Resend API Key** tačan
- Proveri **fromEmail** (mora biti `@euroconnectbg.com`)
- Pogledaj **Debug Console** za greške

### **Link ne radi kada kliknem?**
- ⚠️ **OVO JE NORMALNO** u Figma Make okruženju
- Link može raditi **SAMO** nakon deployment-a na pravi URL
- Za test koristi **"⚡ INSTANT TEST"** dugme u Admin Panel-u

### **Modal se ne otvara?**
- Proveri **URL parametar**: `?reset-token=xxxxx`
- Proveri **Console** za greške
- Token mora biti validan (nije istekao)

---

## ✅ **Finalni Checklist:**

- [ ] Resend API Key konfigurisan
- [ ] Email notifications aktivirane (enabled)
- [ ] fromEmail postavljen na `@euroconnectbg.com`
- [ ] **APP URL** postavljen u Email konfiguraciji
- [ ] Test email poslat uspešno
- [ ] "⚡ INSTANT TEST" dugme radi
- [ ] Za produkciju: Aplikacija deploy-ovana na pravi URL

---

**VAŽNO:** Ovaj sistem je potpuno funkcionalan i spreman za produkciju. Jedino što fali je **pravi deployment** da bi email linkovi radili van Figma Make okruženja.
