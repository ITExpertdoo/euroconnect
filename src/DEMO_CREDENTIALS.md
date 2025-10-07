# 🔑 Demo Kredencijali

## Automatski kreirani demo korisnici

Pri prvom pokretanju servera, sistem automatski kreira sledeće demo korisnike:

### 👑 Admin nalog
```
Email: admin@euroconnect.eu
Lozinka: admin123
Uloga: Admin (pun pristup svim funkcijama)
```

**Pristup:**
- Admin Panel
- Backend Demo
- Candidate Dashboard  
- Employer Dashboard
- Sve ostale stranice

---

### 👤 Kandidat nalog
```
Email: candidate@test.com
Lozinka: candidate123
Uloga: Candidate
```

**Pristup:**
- Candidate Dashboard
- Praćenje aplikacija
- Upload dokumenata
- Saved Jobs
- Messages
- Premium oglasi (ako kupi premium)

---

### 💼 Poslodavac nalog
```
Email: employer@test.com
Lozinka: employer123
Uloga: Employer
```

**Pristup:**
- Employer Dashboard
- Kreiranje oglasa za posao
- Upravljanje oglasima
- Pregled aplikacija kandidata
- Premium nadogradnje oglasa

---

## 🚀 Kako koristiti

### Prvi put pokretanje:
1. Server automatski kreira demo korisnike pri startup-u
2. U konzoli videćete poruku: `✅ Demo users initialized!`
3. Idite na landing page i kliknite "Prijava"
4. Unesite kredencijale za željeni tip naloga

### Ako dobijete "Invalid credentials" grešku:
1. Proverite da li ste uneli tačan email i lozinku
2. Restartujte server da bi se demo korisnici kreirali
3. Ili kreirajte novi nalog preko "Registracija" tab-a

---

## 💳 Premium sistem

### Za kandidate:
Premium paketi omogućavaju pristup premium oglasima:
- **Basic Premium**: €9.99/mesec
- **Professional Premium**: €29.99/3 meseca  
- **Enterprise Premium**: €99.99/godinu

### Za poslodavce:
Premium opcije za istaknute oglase:
- **Boost**: €19.99/7 dana - Povećana pozicija u rezultatima
- **Highlight**: €29.99/30 dana - Zlatni okvir koji privlači pažnju
- **Featured**: €49.99/30 dana - Top pozicija + zlatni okvir + badge

**Napomena:** Ovo je demo aplikacija - plaćanja su simulirana i neće se naplatiti pravi novac.

---

## 🔧 Backend Info

### Server endpointi:
- `/auth/signup` - Registracija novog korisnika
- `/auth/login` - Prijava postojećeg korisnika
- `/auth/me` - Preuzimanje trenutnog korisnika
- `/jobs` - CRUD operacije za oglase
- `/applications` - Aplikacije za poslove
- `/premium/purchase` - Kupovina premium pristupa

### Supabase Storage Buckets:
- `make-fe64975a-cvs` - Za CV dokumente kandidata
- `make-fe64975a-logos` - Za company logoe

### Key-Value Store:
Koristimo KV store za skladištenje:
- User profila (`user:{userId}`)
- Job oglasa (`job:{jobId}`)
- Aplikacija (`application:{applicationId}`)
- Premium statusa (`premium:{userId}`)

---

## 📝 Dodatne napomene

### Role-Based Access:
- **Admin**: Vidi sve i može pristupiti admin panelu
- **Candidate**: Može aplicirati za poslove i pristupiti candidate dashboard-u
- **Employer**: Može kreirati oglase i pristupiti employer dashboard-u
- **Neulogovani**: Mogu videti samo landing page, pricing i billboard

### Auto-login nakon registracije:
Kada se registrujete, automatski ćete biti ulogovani i preusmereni na odgovarajući dashboard.

### Email konfirmacija:
Email konfirmacija je automatski uključena (`email_confirm: true`) jer email server nije konfigurisan.
