# 🔐 Reset Password - Debugging Guide

## Kako Reset Password Radi

### 1. **Korisnik zatraži reset lozinke**
- Klikne na "Zaboravili ste lozinku?" na stranici za prijavu
- Unese svoj email
- Frontend šalje request na `/auth/forgot-password` endpoint

### 2. **Server generiše token i šalje email**
- Server kreira jedinstveni reset token (UUID)
- Token se čuva u KV store sa `reset-token:{token}` ključem
- Token važi 1 sat
- Email se šalje sa linkom koji izgleda ovako:
  ```
  https://6f1f2009-607e-422a-9914-42a4e35d348f-figmaiframepreview.figma.site?reset-token=abc-123-xyz
  ```

### 3. **Korisnik klikne na link u email-u**
- Frontend detektuje `reset-token` parametar u URL-u
- Automatski otvara ResetPasswordModal
- URL se čisti da se ne vidi token u browser history

### 4. **Korisnik unosi novu lozinku**
- Unese novu lozinku (minimum 6 karaktera)
- Potvrdi lozinku
- Frontend šalje request na `/auth/reset-password` endpoint sa tokenom i novom lozinkom

### 5. **Server resetuje lozinku**
- Proverava da li je token validan i nije istekao
- Ažurira lozinku u Supabase Auth
- Briše upotrebljeni token
- Šalje potvrdu korisniku

---

## 🧪 Kako Testirati Reset Password

### Opcija 1: Admin Panel Test Dugme

1. Prijavi se kao admin (`office@euroconnectbg.com / office123`)
2. Idi na **Admin Panel > Podešavanja > Email Notifikacije**
3. Klikni na **"🔐 Test Reset Password Email"** dugme
4. Unesi email adresu (npr. `office@euroconnectbg.com`)
5. Proveri inbox - trebalo bi da dobiješ email sa linkom za reset
6. Klikni na link - trebalo bi da se otvori modal za reset lozinke

### Opcija 2: Normalan Flow

1. **Odjavi se** ako si prijavljen
2. Klikni na **"Prijava"** na landing page-u
3. Klikni na **"Zaboravili ste lozinku?"**
4. Unesi email (`office@euroconnectbg.com`)
5. Klikni **"Pošalji link"**
6. Proveri inbox na `office@euroconnectbg.com`
7. Klikni na **"Resetuj lozinku"** dugme u email-u
8. Trebalo bi da se otvori aplikacija sa modalnom za unos nove lozinke

---

## 🔍 Debugging - Kako Proveriti Šta Nije Radilo

### 1. Proveri Server Logs

Kada pošalješ zahtev za reset lozinke, server bi trebalo da loga:

```
📧 Generating password reset link: https://.../?reset-token=abc-123-xyz
Password reset email sent to office@euroconnectbg.com
```

### 2. Proveri Browser Console

Kada klikneš na link iz email-a, frontend bi trebalo da loga:

```
🔍 Checking for reset token in URL: https://.../?reset-token=abc-123-xyz
🔑 Reset token found: abc-123-xyz
✅ Reset modal opened with token
```

Kada klikneš "Resetuj lozinku", trebalo bi:

```
🔐 Attempting password reset with token: abc-123-xyz
🔐 Reset password response: { status: 200, data: { ... } }
```

### 3. Proveri Email

Email bi trebalo da stigne na `office@euroconnectbg.com` sa:
- Subject: "🔑 Reset lozinke - EuroConnect Europe"
- Dugme: "Resetuj lozinku"
- Link koji vodi na aplikaciju sa `?reset-token=...` parametrom

---

## ❌ Moguće Greške i Rešenja

### Greška 1: "Link ne radi / ne otvara modal"

**Problem:** URL link ne sadrži `reset-token` parametar ili frontend ne detektuje parametar.

**Rešenje:**
1. Proveri da li link u email-u ima `?reset-token=` parametar
2. Pogledaj browser console logove - da li se prikazuje "Reset token found"?
3. Proveri da li URL počinje sa tačnim Figma preview URL-om

**Backend Fix (Već Implementiran):**
```typescript
const origin = c.req.header('origin') || 
               c.req.header('referer')?.split('?')[0] || 
               'https://6f1f2009-607e-422a-9914-42a4e35d348f-figmaiframepreview.figma.site';
const resetLink = `${origin}?reset-token=${resetToken}`;
```

### Greška 2: "Nevažeći ili istekao reset link"

**Problem:** Token je već upotrebljen ili je prošlo više od 1 sata.

**Rešenje:**
1. Zatraži novi reset link
2. Proveri da li token postoji u KV store (admin panel > backend demo)

### Greška 3: "Email nije stigao"

**Problem:** Email konfiguracija nije ispravna ili Resend API key nije validan.

**Rešenje:**
1. Proveri da li je email enabled u admin panelu
2. Proveri da li je `fromEmail` postavljen na `@euroconnectbg.com` domenu
3. Proveri da li je Resend API key validan
4. Testuj sa "Test Email" dugmetom prvo

### Greška 4: "Link vodi na pogrešan URL"

**Problem:** Backend generiše link sa localhost ili pogrešnim domenom.

**Rešenje:**
- Backend sada automatski koristi Figma preview URL ako nije postavljen origin header
- Proveri server log da vidiš koji link je generisan:
  ```
  📧 Generating password reset link: https://...
  ```

---

## 📝 Backend Endpointi

### POST `/auth/forgot-password`

**Request:**
```json
{
  "email": "office@euroconnectbg.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Ako postoji nalog sa ovom email adresom, dobićete link za reset lozinke."
}
```

**Šta radi:**
1. Pronalazi korisnika po email-u
2. Generiše UUID token
3. Čuva token u KV: `reset-token:{token}` sa expiresAt (1h)
4. Šalje email sa linkom

---

### POST `/auth/reset-password`

**Request:**
```json
{
  "token": "abc-123-xyz",
  "newPassword": "novaLozinka123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Lozinka uspešno promenjena"
}
```

**Response (Error - Expired Token):**
```json
{
  "error": "Reset link je istekao. Zatražite novi."
}
```

**Šta radi:**
1. Proverava da li token postoji u KV
2. Proverava da li je token istekao (< 1h)
3. Ažurira lozinku u Supabase Auth
4. Briše token iz KV
5. Šalje potvrdu email (opciono)

---

## 🎯 Demo Kredencijali za Testiranje

Možeš testirati sa bilo kojim od ovih naloga:

| Email | Lozinka | Uloga |
|-------|---------|-------|
| `office@euroconnectbg.com` | `office123` | Admin |
| `admin@euroconnect.eu` | `admin123` | Admin |
| `candidate@test.com` | `candidate123` | Candidate |
| `employer@test.com` | `employer123` | Employer |

**Preporučujemo testiranje sa `office@euroconnectbg.com` jer je to verifikovana email domena!**

---

## ✅ Checklist Pre Testiranja

- [ ] Email notifikacije su **aktivirane** u Admin Panel
- [ ] Resend API key je **postavljen**
- [ ] From Email je `noreply@euroconnectbg.com` ili druga `@euroconnectbg.com` adresa
- [ ] Test Email dugme **radi** (proveri sa "Test Email" dugmetom prvo)
- [ ] Browser console je **otvoren** za debugging
- [ ] Server logs su **vidljivi** (ako imaš pristup)

---

_Poslednja izmena: 27. oktobar 2025_
