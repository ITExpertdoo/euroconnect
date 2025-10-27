# 🔐 Premium Oglasi - Vodič za Testiranje

## 🎯 Šta je implementirano

Premium oglasi su poslovi koje mogu videti **SAMO kandidati koji imaju premium nalog**. Kandidati bez premium statusa ne vide premium oglase uopšte.

---

## 🧪 Kako testirati Premium sistem

### ✅ **Test 1: Premium korisnik vidi sve oglase**

1. **Uloguj se kao testni kandidat (koji ima premium):**
   ```
   Email: candidate@test.com
   Lozinka: candidate123
   ```

2. **Idi na "Pretraži poslove"** u Candidate Dashboard

3. **Pogledaj Debug Info kutiju** (plava kutija na vrhu):
   - Trebao bi videti: `Premium Status: ✅ PREMIUM`
   - `Admin Status: Regular User`
   - `Total Jobs: X | Premium Jobs: Y | Visible Jobs: X` (vidi SVE oglase)

4. **Rezultat:** Vidiš SVE poslove, uključujući i premium oglase (sa zlatnim okvirom i Crown ikonom)

---

### ❌ **Test 2: Obični korisnik NE vidi premium oglase**

1. **Registruj se kao NOVI kandidat:**
   - Klikni "Registracija" na landing page
   - Napravi novi nalog (npr. `test@test.com`)
   - Uloga: Kandidat

2. **Idi na "Pretraži poslove"**

3. **Pogledaj Debug Info kutiju:**
   - Trebao bi videti: `Premium Status: ❌ NOT PREMIUM`
   - `Total Jobs: X | Premium Jobs: Y | Visible Jobs: Z` (Z je manje od X!)

4. **Rezultat:** 
   - NE vidiš premium oglase
   - Vidiš UPOZORENJE sa pozivom da upgradeuješ na Premium

---

### 👑 **Test 3: Admin može dodati/ukloniti Premium**

1. **Uloguj se kao admin:**
   ```
   Email: admin@euroconnect.eu
   Lozinka: admin123
   ```

2. **Idi na Admin Panel** (automatski se otvara za admin)

3. **Klikni na "Korisnici" tab**

4. **Pronađi bilo kog korisnika** i klikni:
   - **"Dodaj Premium"** dugme (zlatno) - Daje premium status na 365 dana
   - **"Ukloni Premium"** dugme (crveno) - Uklanja premium status

5. **Odjavi se i uloguj kao taj korisnik** - status će biti ažuriran!

---

## 🔧 Backend Logika

### Kako funkcioniše filtriranje:

```javascript
// U serveru (index.tsx)
if (!userProfile?.isPremium && !userProfile?.isAdmin) {
  jobs = jobs.filter((j: any) => !j.isPremium);
}
```

### Kako funkcioniše u frontendu:

```javascript
// U CandidateDashboard.tsx
const filteredJobs = jobs.filter(job => {
  // Premium filter
  if (job.isPremium && !isPremium && !isAdmin) {
    return false; // Sakrij premium oglase
  }
  // ... ostali filteri
});
```

---

## 📋 Checklist za testiranje

- [ ] Testni kandidat (`candidate@test.com`) VIDI premium oglase
- [ ] Novi kandidat NE vidi premium oglase
- [ ] Upozorenje se prikazuje kada postoje premium oglasi koji su sakriveni
- [ ] Admin može dodati premium status bilo kom korisniku
- [ ] Admin može ukloniti premium status
- [ ] Debug Info kutija pokazuje tačan status
- [ ] Premium oglasi imaju zlatni okvir i Crown badge
- [ ] Obični oglasi nemaju specijalno markiranje

---

## 💡 Saveti za testiranje

1. **Koristite Debug Info kutiju** - ona pokazuje sve potrebne informacije
2. **Pravite nove naloge** - da testirate kako izgleda bez premium-a
3. **Koristite Admin Panel** - da brzo menjate premium status
4. **Odjavite se i prijavite ponovo** - da se primene promene
5. **Proverite konzolu** - za backend log poruke

---

## 🐛 Ako nešto ne radi

### Problem: Testni kandidat nema premium
**Rešenje:** 
1. Odjavite se
2. Restartujte server (da se ponovo kreira sa premium statusom)
3. Prijavite se ponovo

### Problem: Admin ne može promeniti premium status
**Rešenje:**
1. Proverite da li ste ulogovani kao admin
2. Proverite konzolu browsera za greške
3. Proverite server console za greške

### Problem: Debug Info ne pokazuje premium status
**Rešenje:**
1. Refresh stranice (F5)
2. Odjavite se i prijavite ponovo
3. Proverite da li je backend pokrenut

---

## 🎉 Zaključak

Premium sistem u potpunosti funkcioniše! Kandidati bez premium statusa **ne mogu videti premium oglase**, dok kandidati sa premium statusom **imaju pun pristup svim poslovima**.

Admin može lako upravljati premium statusom preko Admin Panel-a! 👑
