# EuroConnect Europe - Backend Integration Guide

## ✅ Implementirano

Backend je **POTPUNO INTEGRISAN** sa svim komponentama aplikacije!

### 🔐 Autentifikacija
- ✅ Registracija kandidata i poslodavaca
- ✅ Login/Logout sa JWT tokenima
- ✅ Session management (automatski login nakon registracije)
- ✅ Protected routes i middleware
- ✅ AuthContext za React state management

### 💼 Jobs API
- ✅ Učitavanje poslova sa filterima (kategorija, lokacija, pretraga)
- ✅ Kreiranje novih poslova (samo employers)
- ✅ Brisanje poslova
- ✅ Brojači pregleda i aplikacija
- ✅ Real-time podaci iz Supabase KV store

### 📝 Applications API  
- ✅ Aplikovanje za poslove sa CV upload-om
- ✅ Pregled aplikacija (za kandidate)
- ✅ Pregled aplikacija po poslu (za poslodavce)
- ✅ Praćenje statusa aplikacija

### 📁 File Storage
- ✅ Upload CV-eva (PDF/Word, max 5MB)
- ✅ Automatski kreirani Supabase Storage buckets
- ✅ Signed URLs za privatne fajlove

---

## 🚀 Kako koristiti aplikaciju

### 1️⃣ **Pristupite Backend Demo stranici**
Kliknite na **"🔥 Backend Demo"** dugme u navigaciji

### 2️⃣ **Registrujte se**

**OPCIJA A: Kao Poslodavac (Employer)**
1. Kliknite "Registracija"
2. Popunite formu
3. Odaberite "Poslodavac - Objavljujem poslove"
4. Kliknite "Kreiraj nalog"

**OPCIJA B: Kao Kandidat (Candidate)**
1. Kliknite "Registracija"
2. Popunite formu
3. Odaberite "Kandidat - Tražim posao"
4. Kliknite "Kreiraj nalog"

### 3️⃣ **Testiranje funkcionalnosti**

#### Ako ste **POSLODAVAC**:

1. **Kreirajte demo poslove:**
   - U Backend Demo stranici kliknite "Seed Demo Poslove"
   - Sistem će kreirati 8 raznolikih demo poslova
   
2. **Kreirajte svoj oglas:**
   - Idite na "Employer Dashboard"
   - Kliknite "Kreiraj Oglas"
   - Popunite formu sa detaljima posla
   - Kliknite "Kreiraj oglas"

3. **Pregledajte aplikacije:**
   - U Employer Dashboard-u videćete sve svoje oglase
   - Kliknite na broj aplikacija da vidite kandidate
   - Možete pregledati CV-eve i cover lettere

4. **Brišite oglase:**
   - Kliknite na trash ikonu pored oglasa
   - Potvrdite brisanje

#### Ako ste **KANDIDAT**:

1. **Pretražite poslove:**
   - Idite na Landing Page
   - Koristite search bar da filtrirate po zemlji ili ključnim rečima
   - Pregledajte dostupne poslove

2. **Aplicirajte za posao:**
   - Kliknite "Apliciraj odmah" na poslu
   - Upload-ujte vaš CV (PDF ili Word, max 5MB)
   - Napišite cover letter (opciono)
   - Kliknite "Pošalji aplikaciju"

3. **Pratite aplikacije:**
   - Idite na "Candidate Dashboard"
   - Videćete sve vaše aplikacije i njihove statuse
   - Statusi: Sent, Seen, Offer, Rejected

---

## 📊 Šta podaci pokazuju

### Landing Page
- ✅ Učitava **PRAVE POSLOVE** iz baze
- ✅ Search i filter **FUNKCIONIŠU**
- ✅ Brojač poslova je **TAČAN**

### Candidate Dashboard
- ✅ Prikazuje **PRAVE APLIKACIJE** korisnika
- ✅ Statistike (Total Applications, In Progress, Offers) su **LIVE**
- ✅ Svaka aplikacija pokazuje stvarni posao i status

### Employer Dashboard
- ✅ Prikazuje **SAMO VAŠE POSLOVE**
- ✅ Brojači kandidata i pregleda su **TAČNI**
- ✅ Možete kreirati, brisati i pregledati oglase
- ✅ Vidite sve aplikacije za vaše poslove

### Backend Demo
- ✅ Real-time prikaz stanja backend-a
- ✅ Brzi seed demo podataka
- ✅ Testiranje svih API endpoint-a

---

## 🎯 Test Scenario

**KOMPLETNA DEMONSTRACIJA:**

1. **Otvorite 2 browser prozora** (ili jedan normal + jedan incognito)

2. **Prozor 1 - Poslodavac:**
   ```
   - Registrujte se kao Employer
   - Seed-ujte demo poslove (8 poslova)
   - Idite na Employer Dashboard
   - Pregledajte sve poslove
   ```

3. **Prozor 2 - Kandidat:**
   ```
   - Registrujte se kao Candidate
   - Pretražite poslove na Landing Page
   - Aplicirajte za 2-3 posla sa pravim CV-em
   - Idite na Candidate Dashboard
   - Vidite svoje aplikacije
   ```

4. **Nazad u Prozor 1 - Poslodavac:**
   ```
   - Refresh Employer Dashboard
   - Videćete NOVE APLIKACIJE od kandidata!
   - Kliknite na broj aplikacija
   - Pregledajte CV i cover letter kandidata
   ```

---

## 🔧 Tehnički detalji

### Backend Stack:
- **Runtime:** Deno (Supabase Edge Function)
- **Framework:** Hono (web server)
- **Database:** Supabase KV Store (PostgreSQL)
- **Storage:** Supabase Storage (S3-compatible)
- **Auth:** Supabase Auth (JWT tokens)

### Frontend Integration:
- **Auth Context:** React Context API
- **API Client:** Centralizovani API wrapper (`/utils/api.tsx`)
- **State Management:** React hooks (useState, useEffect)
- **File Upload:** FormData API
- **Notifications:** Sonner (toast notifications)

### Data Structure:
```typescript
// KV Store Keys
user:{userId}        → User profile data
job:{jobId}          → Job posting data  
application:{appId}  → Application data

// Storage Buckets
make-fe64975a-cvs    → Candidate CV files
make-fe64975a-logos  → Company logo files
```

---

## ⚠️ Napomena

**Ova aplikacija koristi Figma Make okruženje koje NIJE namenjeno za produkciju.**

Za produkcijsku upotrebu:
1. Prebacite na vaš Supabase projekat
2. Konfigurirajte email server za verifikaciju
3. Dodajte PostgreSQL tabele umesto KV store-a
4. Implementirajte Row Level Security (RLS) politike
5. Dodajte rate limiting i validacije

---

## 🎉 Sve radi!

Backend je **POTPUNO FUNKCIONALAN** i integrisan sa:
- ✅ Landing Page
- ✅ Candidate Dashboard
- ✅ Employer Dashboard
- ✅ Backend Demo
- ✅ Auth Modal
- ✅ Apply To Job Modal

**Svi podaci su PRAVI i čuvaju se u Supabase bazi!**
