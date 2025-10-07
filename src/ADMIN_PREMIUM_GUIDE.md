# EuroConnect Admin & Premium Sistem - Uputstvo

## 🎯 Pregled

Platforma EuroConnect sada ima kompletnu **role-based access control** (kontrolu pristupa) i **premium sistem** sa mogućnošću plaćanja za pristup premium oglasima.

---

## 👥 Role Sistema

### 1. **Admin Role** 👑
- **Email za registraciju**: `admin@euroconnect.eu`
- **Privilegije**:
  - Pristup svim stranicama platforme
  - Vidi sve korisnike, aplikacije i plaćanja
  - Automatski pristup svim premium oglasima
  - Admin Panel sa detaljnim statistikama

### 2. **Candidate Role** (Kandidat)
- Pristup:
  - Landing page
  - Candidate Dashboard
  - Premium Features (za kupovinu pristupa)
  - Billboard/Ads
- Može aplikovati na poslove
- Vidi samo svoje aplikacije

### 3. **Employer Role** (Poslodavac)
- Pristup:
  - Landing page
  - Employer Dashboard
  - Premium Features
  - Billboard/Ads
- Može kreirati i upravljati oglasima
- Vidi aplikacije samo za svoje oglase

### 4. **Neulogovani korisnici**
- Pristup samo Landing Page
- Moraju se prijaviti za pristup ostalim funkcijama

---

## 💎 Premium Sistem

### Premium Planovi

#### **Basic Premium** - €9.99/mesec
- Pristup svim premium poslovima
- Email notifikacije
- Prioritetna podrška
- Mesečni newsletteri

#### **Professional Premium** - €29.99/3 meseca (NAJPOPULARNIJI)
- Sve iz Basic paketa
- Premium badge na profilu
- Direktan kontakt sa poslodavcima
- CV pregled od stručnjaka
- Personalizovane preporuke

#### **Enterprise Premium** - €99.99/godina
- Sve iz Professional paketa
- Lični karierni savetnik
- Prioritetne aplikacije
- Ekskluzivni oglasi
- Coaching sesije

### Kupovina Premium Pristupa

1. **Uloguj se** kao kandidat
2. Idi na **Premium Features** stranicu
3. **Izaberi plan** koji odgovara tvojim potrebama
4. Klikni na **"Izaberi plan"** dugme
5. **Popuni podatke kartice**:
   - Broj kartice
   - Rok važenja (MM/GG)
   - CVC kod
6. Potvrdi plaćanje

**Napomena**: Ovo je demo aplikacija - neće se naplatiti pravi novac. Možete koristiti bilo kakve podatke za testiranje.

---

## 🔒 Premium Oglasi

### Kreiranje Premium Oglasa (Poslodavac)

Kada poslodavac kreira oglas, može da označi da je **isPremium: true**. Ovi oglasi:
- Prikazuju se sa **zlatnim badge-om** (👑 Premium)
- Imaju **zlatni border** za izdvajanje
- **Vidljivi su samo**:
  - Admin korisnicima
  - Premium pretplatnicima
  - Kreatorima tih oglasa

### Filtriranje Oglasa

Backend automatski filtrira oglase:
```javascript
// Ako korisnik nije premium ili admin
if (!userProfile?.isPremium && !userProfile?.isAdmin) {
  jobs = jobs.filter((j: any) => !j.isPremium);
}
```

---

## 🛠 Backend API Endpointi

### Premium Endpoints

#### **GET** `/premium/status`
Proverava premium status korisnika
```json
{
  "isPremium": true,
  "isAdmin": false,
  "premiumUntil": "2026-01-06T12:00:00.000Z"
}
```

#### **POST** `/premium/purchase`
Kupovina premium pristupa
```json
{
  "planType": "professional",
  "paymentMethod": "card"
}
```

#### **GET** `/premium/payments`
Lista plaćanja korisnika

### Admin Endpoints

#### **GET** `/admin/users`
Lista svih korisnika (samo admin)

#### **GET** `/admin/applications`
Lista svih aplikacija (samo admin)

#### **GET** `/admin/payments`
Lista svih plaćanja (samo admin)

---

## 📊 Admin Panel

Pristup: Samo za **admin@euroconnect.eu**

### Statistike Dashboard
- **Ukupno Korisnika** - Broj svih registrovanih korisnika
- **Premium Korisnici** - Broj aktivnih premium pretplatnika
- **Ukupne Aplikacije** - Broj svih aplikacija za posao
- **Ukupna Zarada** - Suma svih plaćanja

### Tabovi

1. **Korisnici** - Pregled svih korisnika sa:
   - Ime, email, uloga
   - Admin/Premium badge-ovi
   - Datum registracije

2. **Aplikacije** - Pregled svih aplikacija sa:
   - Ime kandidata
   - Naziv posla i kompanije
   - Status aplikacije
   - Datum aplikacije

3. **Plaćanja** - Pregled svih transakcija sa:
   - ID korisnika
   - Tip plana
   - Način plaćanja
   - Iznos i status

---

## 🚀 Kako Testirati Sistem

### Test Scenario 1: Admin Pristup
1. Registruj se sa emailom **admin@euroconnect.eu**
2. Šifra: bilo šta (npr. `admin123`)
3. Proveri da imaš pristup svim stranicama
4. Proveri Admin Panel (👑 ikona u navigaciji)
5. Proveri da vidiš SVE premium oglase

### Test Scenario 2: Običan Kandidat
1. Registruj se kao kandidat (bilo koji email osim admin@euroconnect.eu)
2. Proveri da NE vidiš premium oglase na landing page-u
3. Idi na Premium Features
4. Kupi bilo koji plan
5. Proveri da sada vidiš premium oglase

### Test Scenario 3: Poslodavac
1. Registruj se kao poslodavac
2. Idi na Employer Dashboard
3. Kreiraj novi oglas i označi `isPremium: true`
4. Proveri da obični korisnici NE VIDE taj oglas
5. Proveri da admin VIDI taj oglas

---

## 🔐 Sigurnost

- **SUPABASE_SERVICE_ROLE_KEY** je zaštićen i nikada se ne šalje frontend-u
- Svi zaštićeni endpointi koriste **JWT token** autentifikaciju
- Premium status se proverava na backend-u, ne frontend-u
- Admin privilegije se proveravaju na svakom zahtevu

---

## 💡 Napomene za Razvoj

### Dodavanje Novog Premium Oglasa (Seed Data)

Uredi `/utils/seedDemoData.tsx`:
```javascript
{
  title: 'Naziv posla',
  company: 'Kompanija',
  // ... ostali podaci
  isPremium: true,  // ← Označi kao premium
}
```

### Promena Admin Email-a

Uredi `/supabase/functions/server/index.tsx`:
```javascript
const isAdmin = email === 'admin@euroconnect.eu'; // ← Promeni ovde
```

### Dodavanje Novih Planova

Uredi `/components/PremiumPaymentModal.tsx`:
```javascript
const planDetails = {
  // Dodaj novi plan ovde
  premium_plus: {
    name: 'Premium Plus',
    price: '49.99',
    duration: '6 meseci',
    features: [...]
  }
}
```

---

## 📝 Preporučeni Workflow

1. **Kreiraj Admin nalog** (`admin@euroconnect.eu`)
2. **Kreiraj test poslodavce** i dodaj neke premium oglase
3. **Kreiraj test kandidate** i testiraj premium sistem
4. **Proveri Admin Panel** za statistike
5. **Testiraj payment flow** sa različitim planovima

---

## 🎉 Zakljuäak

Sistem je potpuno funkcionalan sa:
✅ Role-based access control
✅ Premium oglasi sa plaćanjem
✅ Admin panel sa statistikama
✅ Automatsko filtriranje oglasa po premium statusu
✅ Kompletan payment tracking

**Za bilo kakva pitanja ili probleme, kontaktiraj developera!**
