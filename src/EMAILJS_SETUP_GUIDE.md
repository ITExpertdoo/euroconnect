# 📧 EmailJS Setup Vodič

## 🎯 Šta je EmailJS?

EmailJS je besplatna email servis koja omogućava slanje email-ova direktno iz JavaScript-a bez potrebe za sopstvenim serverom. Idealan je za prototyping i testiranje!

**Besplatan tier:** 200 emailova mesečno ✅

---

## 🚀 Korak po Korak Setup

### **Korak 1: Kreiraj EmailJS nalog**

1. **Poseti** [EmailJS.com](https://www.emailjs.com/)
2. **Klikni** na "Sign Up" (ili "Get Started")
3. **Registruj se** sa email adresom
4. **Potvrdi** email adresu kroz link koji dobiješ

---

### **Korak 2: Dodaj Email Service**

1. **U EmailJS Dashboard-u**, idi na **"Email Services"**
2. **Klikni** "Add New Service"
3. **Izaberi** provider:
   - **Gmail** (najlakše za testiranje)
   - Outlook
   - Yahoo
   - Ili custom SMTP server

4. **Za Gmail:**
   - Klikni na "Connect Account"
   - Prijavi se sa Gmail nalogom
   - Dozvoli pristup

5. **Kopiraj Service ID** (npr. `service_abc123`)
   - Biće ti potreban kasnije!

---

### **Korak 3: Kreiraj Email Template**

1. **Idi na** "Email Templates"
2. **Klikni** "Create New Template"
3. **Nazovi template** (npr. "EuroConnect Notifications")
4. **Konfiguriši template:**

```
To Email: {{to_email}}
Subject: {{subject}}
From Name: {{from_name}}
Reply To: noreply@euroconnect.eu
```

5. **Sadržaj email-a (Body):**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0E395C; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EuroConnect Europe</h1>
    </div>
    <div class="content">
      {{message}}
    </div>
    <div class="footer">
      <p>EuroConnect Europe - Povezujemo Balkan sa EU</p>
      <p>Ovo je automatska poruka. Nemoj odgovarati na ovaj email.</p>
    </div>
  </div>
</body>
</html>
```

6. **Test template** - klikni "Test it" da proveriš kako izgleda
7. **Sačuvaj template**
8. **Kopiraj Template ID** (npr. `template_xyz789`)

---

### **Korak 4: Pronađi Public Key**

1. **Idi na** "Account" (gore desno)
2. **U sekciji "API Keys"**, pronađi **"Public Key"**
3. **Kopiraj** Public Key (npr. `xxxxxxxxxxxx`)

---

### **Korak 5: Konfiguriši u EuroConnect Admin Panelu**

1. **Uloguj se** kao admin:
   ```
   Email: admin@euroconnect.eu
   Lozinka: admin123
   ```

2. **Idi u Admin Panel** → **Podešavanja** tab

3. **U "Email Servis Konfiguracija":**
   - **Email Provider:** Izaberi "EmailJS"
   - **Service ID:** Unesi svoj Service ID
   - **Template ID:** Unesi svoj Template ID
   - **Public Key:** Unesi svoj Public Key
   - **From Email:** `noreply@euroconnect.eu`
   - **From Name:** `EuroConnect Europe`
   - **Aktiviraj Email Notifikacije:** ✅ ON

4. **Klikni** "Sačuvaj Email Konfiguraciju"

5. **Testiraj!** Klikni "Pošalji Test Email"
   - Email će biti poslat na tvoju admin email adresu
   - Proveri inbox i spam folder

---

## ✅ Verifikacija

Ako sve radi, trebao bi dobiti test email koji izgleda ovako:

```
Subject: 🧪 Test Email - EuroConnect Europe
From: EuroConnect Europe <noreply@euroconnect.eu>

Test Email
Ovo je test email iz EuroConnect Europe platforme.
Ako si primio ovaj email, znači da email konfiguracija radi ispravno! ✅

Provider: emailjs
Od: noreply@euroconnect.eu
_______________________________________________
Poslato: [datum i vreme]
```

---

## 📨 Kada će sistem slati email-ove?

Kada je EmailJS konfigurisan i aktiviran, sistem automatski šalje email-ove za:

1. **Dobrodošlica** - Kada se novi korisnik registruje
2. **Zaboravljena šifra** - Reset token sa linkom za reset
3. **Promena šifre** - Potvrda da je šifra promenjena
4. **Aplikacija poslata** - Potvrda kandidatu da je aplikacija primljena
5. **Nova aplikacija** - Notifikacija poslodavcu o novoj aplikaciji
6. **Status promena** - Kada poslodavac promeni status aplikacije
7. **Premium kupovina** - Potvrda plaćanja premium plana

---

## 🔧 Troubleshooting

### Problem: "EmailJS kredencijali nisu potpuni"
**Rešenje:** Proveri da li si uneo sva tri polja:
- Service ID
- Template ID
- Public Key

### Problem: "Failed to send email via EmailJS"
**Rešenje:**
1. Proveri da li si connect-ovao Email Service u EmailJS
2. Proveri da li je Gmail nalog verifikovan
3. Proveri da li imaš 200+ emailova već poslato ovaj mesec (free limit)

### Problem: Email se ne prima
**Rešenje:**
1. Proveri **Spam folder**
2. Proveri da li je `to_email` varijabla ispravno definisana u template-u
3. Testiraj sa drugom email adresom

### Problem: Template ne izgleda kako treba
**Rešenje:**
1. Koristi "Test it" funkciju u EmailJS da vidiš preview
2. Proveri HTML sintaksu
3. Proveri da li imaš sve varijable: `{{to_email}}`, `{{subject}}`, `{{message}}`, `{{from_name}}`

---

## 💡 Saveti

1. **Koristi Gmail za testiranje** - najlakši setup
2. **Sačuvaj kredencijale** - čuvaj Service ID, Template ID i Public Key na sigurnom mestu
3. **Testiranje** - uvek prvo pošalji test email pre nego što aktiviraš sistem
4. **Monitoring** - Proveri EmailJS Dashboard da vidiš koliko emailova si poslao
5. **From Email** - Koristi `noreply@euroconnect.eu` ili svoju domen email adresu

---

## 📊 EmailJS Dashboard

Poseti [EmailJS Dashboard](https://dashboard.emailjs.com/) da vidiš:
- Broj poslatih emailova
- Uspešnost slanja
- Error log-ove
- Preostale email-ove za ovaj mesec

---

## 🎉 Gotovo!

Sada imaš potpuno funkcionalan email sistem! Korisnici će primati automatske notifikacije za sve važne događaje na platformi.

**💪 Bonus:** EmailJS je potpuno besplatno za 200 emailova mesečno, što je dovoljno za testiranje i manje produkcijske aplikacije!
