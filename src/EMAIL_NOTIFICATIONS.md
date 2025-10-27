# 📧 Email Notifikacije - Pregled Sistema

## ✅ Trenutno Aktivne Email Notifikacije

EuroConnect Europe platforma automatski šalje email notifikacije u sledećim situacijama:

### 1. **Novi Dokument Učitan** 📄
- **Šalje se**: Admin-u (`office@euroconnectbg.com`)
- **Kada**: Kada kandidat upload-uje novi dokument
- **Sadržaj**: 
  - Ime kandidata
  - ID kandidata
  - Tip dokumenta (CV, diploma, pasoš, itd.)
  - Status: "Učitano – čeka proveru"
  - Datum upload-a

### 2. **Dokument Odobren** ✅
- **Šalje se**: 
  - Kandidatu (na njegov email)
  - Admin-u (`office@euroconnectbg.com`)
- **Kada**: Kada admin odobri dokument
- **Sadržaj**:
  - Potvrda da je dokument odobren
  - Ime kandidata i ID
  - Tip dokumenta
  - Ime admina koji je odobrio
  - Datum odobrenja

### 3. **Dokument Odbijen** ❌
- **Šalje se**:
  - Kandidatu (na njegov email)
  - Admin-u (`office@euroconnectbg.com`)
- **Kada**: Kada admin odbije dokument
- **Sadržaj**:
  - Obaveštenje da je dokument odbijen
  - Razlog odbijanja
  - Ime kandidata i ID
  - Tip dokumenta
  - Ime admina koji je odbio
  - Datum odbijanja

### 4. **Profil Kompletiran** 🎉
- **Šalje se**:
  - Kandidatu (na njegov email)
  - Admin-u (`office@euroconnectbg.com`)
- **Kada**: Kada kandidat ima sve potrebne dokumente odobrene (minimum 4)
- **Sadržaj**:
  - Čestitka da je profil kompletiran
  - Obaveštenje da je kandidat spreman za dalje procese
  - ID kandidata
  - Datum kompletiranja

---

## 📬 Admin Email Adresa

Sve admin notifikacije se šalju na: **`office@euroconnectbg.com`**

Ova adresa mora biti verifikovana u Resend dashboard-u.

---

## 🧪 Test Email

Test email se takođe šalje na `office@euroconnectbg.com` da bi potvrdio da email konfiguracija radi ispravno.

Možeš poslati test email iz **Admin Panel > Podešavanja > Email Notifikacije > Test Email** dugmeta.

---

## ⚙️ Email Provider

Sistem koristi **Resend** kao email provider:
- ✅ Besplatno do 3,000 emailova mesečno
- ✅ Radi perfektno sa serverom (server-side sending)
- ✅ Jednostavna integracija
- ✅ Verifikovana domena: `@euroconnectbg.com`

---

## 🔐 Verifikovane Email Domene

**✅ Verifikovane domene (Rade):**
- `office@euroconnectbg.com`
- `noreply@euroconnectbg.com`
- `support@euroconnectbg.com`
- `admin@euroconnectbg.com`

**❌ Neverifikovane domene (NE Rade):**
- `*@euroconnect.eu` (stara domena, nije verifikovana u Resend-u)

Sistem automatski ispravlja sve stare email adrese sa `@euroconnect.eu` na `@euroconnectbg.com`.

---

## 📊 Email Logovi

Svi poslati emailovi se loguju u KV store sa sledećim informacijama:
- Email ID
- Primalac
- Subject
- Body (sadržaj)
- Datum slanja
- Provider (resend)
- Status (sent/failed)
- Resend ID (za tracking)

---

## 🚀 Kako Aktivirati Email Notifikacije

1. **Admin Panel** → Podešavanja → Email Notifikacije
2. Unesi **Resend API Key** (dobiti na [resend.com/api-keys](https://resend.com/api-keys))
3. Proveri da je **From Email** postavljen na verifikovanu domenu (npr. `noreply@euroconnectbg.com`)
4. Aktiviraj toggle "Aktiviraj Email Notifikacije"
5. Klikni **"Sačuvaj"**
6. Klikni **"Test Email"** da potvrdiš da sve radi

✅ Email će biti poslat na `office@euroconnectbg.com` za proveru!

---

_Poslednja izmena: 27. oktobar 2025_
