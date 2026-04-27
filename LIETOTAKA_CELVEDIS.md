# 6. LIETOTĀJA CEĻVEDIS

## 6.1. Sistēmas prasības aparatūrai un programmatūrai

### 6.1.1. Aparatūras prasības

Lai lietotu FitLibrary lietotni, ir nepieciešams dators ar sekojošām minimālajām prasībām:

| Komponente | Minimālās prasības | Ieteicamās prasības |
|------------|-------------------|---------------------|
| Procesors (CPU) | Intel Core i3 vai ekvivalents | Intel Core i5 vai ekvivalents |
| Operatīvā atmiņa (RAM) | 4 GB | 8 GB vai vairāk |
| Cietā diska vieta | 500 MB brīvas vietas | 1 GB brīvas vietas |
| Grafiskā karte | Integrēta | Integrēta vai atsevišķa |
| Interneta pieslēgums | Jā, stabils | Jā, stabils (5+ Mbps) |

**Papildaprīkojums:**
- Tastatūra un pele
- Interneta pārlūkprogramma

### 6.1.2. Programmatūras prasības

**Operētājsistēmas:**
- Windows 10 vai jaunāka versija
- macOS 10.15 (Catalina) vai jaunāka versija
- Linux (Ubuntu 20.04 vai jaunāka versija)

**Nepieciešamā programmatūra:**

1. **Node.js** (versija 18 vai jaunāka)
   - Lejupielāde: https://nodejs.org/
   - Nepieciešams priekš backend palaišanas

2. **MySQL** (versija 8.0 vai jaunāka)
   - Lejupielāde: https://www.mysql.com/
   - Var izmantot XAMPP vai WAMP komplektu priekš Windows
   - Nepieciešams datu bāzes darbībai

3. **Pārlūkprogramma** (viena no sekojošām):
   - Google Chrome (versija 90 vai jaunāka)
   - Mozilla Firefox (versija 88 vai jaunāka)
   - Microsoft Edge (versija 90 vai jaunāka)
   - Safari (versija 14 vai jaunāka)

### 6.1.3. Tīkla prasības

- Lokālais tīkls vai interneta pieslēgums
- Piekļuve portam 5000 (backend serverim)
- Piekļuve portam 5173 (frontend attīstības serverim)

---

## 6.2. Sistēmas instalācija un palaišana

### 6.2.1. Datubāzes instalācija un konfigurācija

**Soļi:**

1. **Lejupielādēt un instalēt MySQL**
   - Windows lietotājiem: Lejupielādēt XAMPP no https://www.apachefriends.org/
   - Mac lietotājiem: Izmantot Homebrew vai DMG installer
   - Linux lietotājiem: `sudo apt install mysql-server`

2. **Izveidot datubāzi**
   - Atvērt MySQL Workbench vai phpMyAdmin
   - Izveidot jaunu datubāzi ar nosaukumu `fitlib`

3. **Izveidot tabulas**
   - Izpildīt sekojošus SQL vaicājumus:

```sql
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE pullups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  date DATE,
  reps INT,
  comment TEXT,
  FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE dips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  date DATE,
  reps INT,
  comment TEXT,
  FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE squats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  date DATE,
  reps INT,
  comment TEXT,
  FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100),
  review TEXT,
  date DATE
);
```

### 6.2.2. Backend instalācija

**Soļi:**

1. **Atvērt projektu mapē**
   ```
   cd fitlibrary/Backend
   ```

2. **Instalēt atkarības**
   ```
   npm install
   ```

3. **Konfigurēt datubāzes savienojumu**
   - Atvērt `Backend/index.js`
   - Pārbaudīt sekojošus iestatījumus:
   ```javascript
   const db = mysql.createConnection({
     host: '127.0.0.1',
     user: 'root',       // Jūsu MySQL lietotājvārds
     password: '@Adams#17',   // Jūsu parole
     database: 'fitlib'
   });
   ```

4. **Palaišana**
   ```
   npm start
   ```
   - Serveris startēs uz http://localhost:5000
   - Terminālī jāparādās: "Server is starting..." un "Connected to MySQL database"

### 6.2.3. Frontend instalācija

**Soļi:**

1. **Atvērt projektu mapē (jauna termināļa logs)**
   ```
   cd fitlibrary
   ```

2. **Instalēt atkarības**
   ```
   npm install
   ```

3. **Palaišana**
   ```
   npm run dev
   ```
   - Frontend būs pieejams uz http://localhost:5173
   - Pārlūkprogrammā automātiski atvērsies jauna cilne

---

## 6.3. Programmas apraksts

### 6.3.1. Sākumlapa (Home)

Pēc lietotnes palaišanas lietotājs redz sākumlapu ar sekojošu saturu:

- **Galvenais virsraksts** - "FitLibrary" nosaukums
- **Apraksts** - īss teksts par lietotnes mērķi
- **Navigācijas pogas:**
  - "Sākt" - pāriet uz pieteikšanās formu
  - "Par mums" - informācija par projektu
- **Atsauksmju sadaļa** - citu lietotāju atsauksmes
- **Kājenes links** - autortiesību informācija

### 6.3.2. Pieteikšanās (Login)

**Lietotāja darbības:**
1. Ievadīt lietotājvārdu
2. Ievadīt paroli
3. Nospiest pogu "Pierakstīties"

**Sagaidāmais rezultāts:**
- Veiksmīgas pieteikšanās gadījumā - pāreja uz galveno lietotnes lapu
- Kļūmes gadījumā - kļūdas ziņa "Nepareizs lietotājvārds vai parole"

### 6.3.3. Reģistrācija (Signup)

**Lietotāja darbības:**
1. Ievadīt vēlamo lietotājvārdu
2. Ievadīt paroli
3. Ievadīt e-pasta adresi
4. Nospiest pogu "Reģistrēties"

**Sagaidāmais rezultāts:**
- Veiksmīgas reģistrācijas gadījumā - pāreja uz pieteikšanās lapu
- Kļūmes gadījumā - kļūdas ziņa (piemēram, "Lietotājvārds jau ir aizņemts")

### 6.3.4. Galvenā lietotnes saskarne

Pēc veiksmīgas pieteikšanās lietotājs redz galveno lapu ar sekojošām iespējām:

**Augšējā navigācija:**
- FitLibrary logo (kreisajā pusē)
- Lietotājvārds un lomas indikators (labajā pusē)
- Izrakstīšanās poga

**Sānu izvēlne (kreisajā pusē):**
- Sākumlapa
- Treniņu veidi:
  - 💪 Bodyweight (ķermeņa svars)
  - 🏋️ Gym (spēka trenažieri)
  - 🏃 Running (skriešana)
- Pro plāni:
  - Pro Plan
  - Pro+ Plan
- Tabulas
- Plāni
- Programmas
- Admin panelis (tikai administratoriem)

### 6.3.5. Treniņu pievienošana

**Bodyweight sadaļa:**
- Pieejami sekojoši vingrinājumi:
  - Pullups (stieņa vilkšana)
  - Dips (dipsi)
  - Squats (pietupieni)

**Lietotāja darbības:**
1. Izvēlēties vingrinājuma veidu
2. Ievadīt datumu
3. Ievadīt atkārtojumu skaitu (reps)
4. Pievienot komentāru (neobligāti)
5. Nospiest "Pievienot"

**Sagaidāmais rezultāts:**
- Ziņa "Treniņš pievienots"
- Ieraksts parādās tabulā zem formas

### 6.3.6. Treniņu tabulu skatīšana

**Funkcionalitāte:**
- Tabula ar visiem ierakstiem
- Iespēja kārtot pēc datuma
- Iespēja filtrēt pēc teksta
- Iespja rediģēt ierakstus (dubultklikšķis uz šūnas)
- Iespēja dzēst ierakstus

### 6.3.7. Diagrammas un statistika

**Pieejamās diagrammas:**
- Progresa diagramma - attēlo treniņu progresu laika gaitā
- Mēneša statistika - cik treniņu veikti katru mēnesi

**Lietotāja darbības:**
- Izvēlēties laika periodu
- Aplūkot tendences
- Salīdzināt rezultātus

### 6.3.8. AI padomi

**Lietotāja darbības:**
1. Nospiest pogu "Saņemt padomus"
2. Gaida atbildi no AI

**Sagaidāmais rezultāts:**
- AI sniedz personalizētus padomus balstītus uz lietotāja treniņu vēsturi
- Padomi ietver:
  - Tendences analīzi
  - Drošas uzlabošanās ieteikumus
  - Ieteikumus par atkopšanos

### 6.3.9. Atsauksmju pievienošana

**Lietotāja darbības:**
1. Ritināt līdz sadaļai "Tavs viedoklis"
2. Ievadīt atsauksmes tekstu
3. Nospiest pogu "Pievienot atsauksmi"

**Sagaidāmais rezultāts:**
- Ziņa "Atsauksme veiksmīgi pievienota"
- Atsauksme tiks parādīta sākumlapā

### 6.3.10. Administratora panelis

**Pieeja:**
- Tikai lietotājiem ar role = "admin"

**Funkcionalitāte:**
- Skatīt visus reģistrētos lietotājus
- Rediģēt lietotājvārdus
- Dzēst lietotāju kontus
- Sūtīt e-pasta atgādinājumus
- Skatīt treniņu statistiku
- Skatīt un dzēst atsauksmes

**Lietotāja darbības:**
1. Meklēt lietotāju (meklēšanas laukā)
2. Nospiest zīmuļa ikonu → rediģēt vārdu
3. Nospest atkritumu ikonu → dzēst kontu
4. Nospest "Skatīt atsauksmes" → redzēt visas atsauksmes

---

## 6.4. Biežāk sastopamas problēmas un risinājumi

| Problēma | Iespējamais cēlonis | Risinājums |
|----------|---------------------|------------|
| "Cannot connect to database" | MySQL nav palaists | Palaist MySQL servisu |
| "CORS error" | Frontend un backend dažādi porti | Pārbaudīt CORS iestatījumus |
| "User not found" | Nepareizs lietotājvārds | Pārbaudīt reģistrāciju |
| "Missing required fields" | Tukši lauki | Aizpildīt visus obligātos laukus |
| "Review not added" | Lietotājs nav atrasts | Pārliecināties, ka lietotājs eksistē |

---

## 6.5. drošības ieteikumi

1. **Neizpaust savus pieteikšanās datus citiem**
2. **Izmantot drošas paroles** (vismaz 8 rakstzīmes)
3. **Neatstāt administratora tiesības parastiem lietotājiem**
4. **Regulāri mainīt paroli**
5. **Aizvērt pārlūkprogrammu pēc lietošanas**