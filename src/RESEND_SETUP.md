# 📧 Resend Email Konfiguracija - EuroConnect Europe

## Tvoj Resend API Key
```
re_X228pq8J_HZ22TFAJv7Uk3khustDeCUSn
```

## ⚠️ VAŽNO: Email Domena

**Verifikovana domena u Resend-u**: `euroconnectbg.com`

Kada konfigurišeš email, **OBAVEZNO koristi email adrese sa @euroconnectbg.com domenom**:
- ✅ `noreply@euroconnectbg.com` 
- ✅ `office@euroconnectbg.com`
- ❌ `noreply@euroconnect.eu` (NIJE verifikovana - NE RADI!)

Sistem ima automatsku korekciju koja će zameniti `.eu` sa `.com`, ali najbolje je uneti tačnu adresu odmah.

## Kako Aktivirati Email Notifikacije

### Opcija 1: Preko Admin Panel-a (Preporučeno)

1. **Logiraj se kao Admin**
   - Email: `admin@euroconnect.eu`
   - Password: `admin123`

2. **Idi u Admin Panel**
   - Klikni na "Admin Panel" u navigaciji

3. **Otvori Settings Tab**
   - Klikni na "Settings" tab
   - Scroll do sekcije "Email Notifikacije"

4. **Konfiguriši Resend**
   - **Email Provider**: Izaberi "Resend (Preporučeno - Server Ready)"
   - **API Key**: Unesi: `re_X228pq8J_HZ22TFAJv7Uk3khustDeCUSn`
   - **From Email**: `noreply@euroconnectbg.com` ⚠️ **BITNO: Koristi @euroconnectbg.com!**
   - **From Name**: `EuroConnect Europe`
   - **Aktiviraj Email Notifikacije**: ✅ Uključi toggle

5. **Sačuvaj i Testiraj**
   - Klikni "Sačuvaj"
   - Klikni "Test Email" da proveriš da li radi

### Opcija 2: Automatski Upload (Brže)

Sistem je automatski kreirao RESEND_API_KEY environment variable u tvom Supabase projektu. Samo treba da uploduješ API key:

1. Otvori modal koji se pojavio
2. Unesi API key: `re_X228pq8J_HZ22TFAJv7Uk3khustDeCUSn`
3. Klikni "Save"

**Napomena**: Server će automatski koristiti ovaj API key čak i ako ne konfigurišeš Admin Panel, ali Admin Panel ti daje više kontrole (from email, from name, enable/disable).

## Kako Funkcionišu Email-ovi

Kada je Resend konfigurisan, sistem automatski šalje email-ove za:

### 📨 Kandidati Dobijaju:
- ✅ Potvrdu o uploudovanom dokumentu
- ✅ Notifikaciju kada je dokument odobren
- ❌ Notifikaciju kada je dokument odbijen (sa razlogom)
- 🎉 Čestitku kada su svi dokumenti odobreni (profil kompletan)

### 📨 Admin Dobija:
- 📄 Notifikaciju kada kandidat uploada novi dokument
- ✅ Potvrdu kada odobri dokument
- ❌ Potvrdu kada odbije dokument
- 🎉 Notifikaciju kada je kandidat kompletirao profil

### 📨 Poslodavci Dobijaju:
- 📥 Notifikaciju kada kandidat aplicira za njihov oglas

## Primer Email-a

Svi email-ovi imaju profesionalan dizajn sa:
- **Header**: Tamno plava (#0E395C) sa zlatnim logom (#F2C230)
- **Body**: Čitljiv tekst sa jasnim informacijama
- **Footer**: Copyright info

## Besplatan Tier

Resend nudi **3,000 emailova mesečno BESPLATNO**! To znači:
- ~100 emailova dnevno
- Idealno za development i prototipove
- Produžava se automatski svakog meseca

## Šta Ako Ne Radi?

1. **Proveri API Key**
   - Mora počinjati sa `re_`
   - Proveri da li si dobro kopirao (bez razmaka)

2. **Proveri Domain Setup**
   - Resend možda zahteva verifikovan domain za production
   - Za testiranje, koristi njihov sandbox domain

3. **Proveri Server Logs**
   - Otvori Developer Console (F12)
   - Idi na Network tab
   - Pogledaj response od `/admin/test-email` endpoint-a

4. **Kontaktiraj Resend Support**
   - Support: https://resend.com/support
   - Dokumentacija: https://resend.com/docs

## Alternativni Email Provideri

Ako Resend ne radi, možeš koristiti:

### SendGrid
- 100 emailova dnevno besplatno
- API key sa: https://app.sendgrid.com/settings/api_keys

### EmailJS
- ⚠️ **NE RADI SA SERVEROM** - samo browser
- Ne preporučuje se za ovu aplikaciju

## Dodatne Informacije

- Email sistem je integrisan sa document validation sistemom
- Svi email-ovi se loguju u KV store (`email:*` keys)
- Email status se čuva: `sent`, `failed`, `not_sent_no_api_key`
- Server automatski koristi Resend HTML template sa brand bojama

## Kontakt

Za pomoć ili pitanja:
- Email: office@euroconnectbg.com
- Platform: EuroConnect Europe

---

**Status**: ✅ Resend API Key dobijen i spreman za konfiguraciju!