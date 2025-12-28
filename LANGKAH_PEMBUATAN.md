# CARA MEMBUAT APLIKASI AL-QUR'AN DIGITAL

---

## 1. SETUP PROJECT

```bash
npm create vite@latest al-quran-digital -- --template react-ts
cd al-quran-digital
npm install react-router-dom @tanstack/react-query
npm install tailwindcss postcss autoprefixer
npm install lucide-react
```

**Hasil:** Project React + TypeScript dengan Vite

---

## 2. KONFIGURASI WARNA & TEMA

**File: `src/index.css`**
- Warna hijau untuk tema islami
- Support dark mode
- Font Amiri untuk teks Arab
- Font Poppins untuk teks biasa

```css
:root {
  --primary: 150 60% 45%;  /* Hijau */
  --accent: 45 90% 55%;    /* Kuning */
}

.dark {
  --background: 150 20% 8%;  /* Gelap */
}

.font-arabic {
  font-family: 'Amiri', serif;
  direction: rtl;
}
```

---

## 3. ROUTING APLIKASI

**File: `src/App.tsx`**
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/surah/:nomor" element={<Surah />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

**3 Halaman:**
- Home → Daftar surah
- Surah → Detail ayat
- NotFound → 404

---

## 4. NAVBAR

**File: `src/components/Navbar.tsx`**

**Fitur:**
- Logo Al-Qur'an Digital
- Tombol Dark Mode (simpan di localStorage)
- Tombol Modal Kelompok

```typescript
const toggleDarkMode = () => {
  if (isDark) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};
```

---

## 5. HALAMAN HOME - DAFTAR SURAH

**File: `src/pages/Home.tsx`**

**A. Fetch Data dari API**
```typescript
const fetchSurahList = async () => {
  const response = await fetch("https://equran.id/api/v2/surat");
  return response.json().data;
};

const { data: surahList, isLoading } = useQuery({
  queryKey: ["surahList"],
  queryFn: fetchSurahList,
});
```

**B. Fitur Pencarian**
```typescript
const [searchQuery, setSearchQuery] = useState("");

const filteredSurah = surahList?.filter((surah) =>
  surah.namaLatin.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**C. Tampilan Grid**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredSurah.map((surah) => (
    <SurahCard key={surah.nomor} surah={surah} />
  ))}
</div>
```

---

## 6. SURAH CARD

**File: `src/components/SurahCard.tsx`**

```jsx
<Link to={`/surah/${surah.nomor}`}>
  <div className="hover:shadow-lg hover:scale-105 transition-all">
    {/* Badge Nomor */}
    <div className="bg-primary/10">
      <span>{surah.nomor}</span>
    </div>

    {/* Info */}
    <h3>{surah.namaLatin}</h3>
    <p>{surah.arti}</p>
    <span className="font-arabic">{surah.nama}</span>

    {/* Meta */}
    <span>{surah.jumlahAyat} Ayat</span>
    <span>{surah.tempatTurun}</span>
  </div>
</Link>
```

---

## 7. SEARCH BAR

**File: `src/components/SearchBar.tsx`**

```jsx
<div className="relative">
  <Search className="absolute left-3 top-1/2" />
  <Input
    placeholder="Cari nama surah..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
</div>
```

---

## 8. HALAMAN DETAIL SURAH

**File: `src/pages/Surah.tsx`**

**A. Fetch Detail**
```typescript
const { nomor } = useParams();

const fetchSurahDetail = async (nomor) => {
  const response = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
  return response.json().data;
};

const { data: surah } = useQuery({
  queryKey: ["surah", nomor],
  queryFn: () => fetchSurahDetail(nomor),
});
```

**B. Sistem Audio (Auto-Pause)**
```typescript
const currentAudioRef = useRef(null);

const handleAudioPlay = (newAudio) => {
  // Pause audio lama
  if (currentAudioRef.current && currentAudioRef.current !== newAudio) {
    currentAudioRef.current.pause();
    currentAudioRef.current.currentTime = 0;
  }
  currentAudioRef.current = newAudio;
};
```

**C. Tampilan**
```jsx
{/* Header Surah */}
<div className="bg-gradient-to-br from-primary/10 to-accent/10">
  <span className="font-arabic text-4xl">{surah.nama}</span>
  <h1>{surah.namaLatin}</h1>
  <p>{surah.arti}</p>
  <span>{surah.jumlahAyat} Ayat • {surah.tempatTurun}</span>
</div>

{/* List Ayat */}
{surah.ayat.map((ayah) => (
  <AyahCard ayah={ayah} onAudioPlay={handleAudioPlay} />
))}
```

---

## 9. AYAH CARD

**File: `src/components/AyahCard.tsx`**

```jsx
<div className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
  {/* Nomor + Audio */}
  <div className="flex justify-between">
    <span className="bg-primary/10">{ayah.nomorAyat}</span>
    <AudioPlayer audioUrl={ayah.audio["05"]} onPlay={onAudioPlay} />
  </div>

  {/* Arab */}
  <p className="font-arabic text-3xl text-right">
    {ayah.teksArab}
  </p>

  {/* Latin */}
  <p className="text-sm italic">
    {ayah.teksLatin}
  </p>

  {/* Indonesia */}
  <p>{ayah.teksIndonesia}</p>
</div>
```

---

## 10. AUDIO PLAYER

**File: `src/components/AudioPlayer.tsx`**

```typescript
const [isPlaying, setIsPlaying] = useState(false);
const audioRef = useRef(null);

const togglePlay = () => {
  if (isPlaying) {
    audioRef.current.pause();
  } else {
    onPlay(audioRef.current);  // Pause yang lain
    audioRef.current.play();
  }
  setIsPlaying(!isPlaying);
};

return (
  <>
    <audio ref={audioRef} src={audioUrl} />
    <Button onClick={togglePlay}>
      {isPlaying ? <Pause /> : <Play />}
      {isPlaying ? "Pause" : "Dengar"}
    </Button>
    {isPlaying && <Volume2 className="animate-pulse" />}
  </>
);
```

---

## 11. MODAL KELOMPOK

**File: `src/components/ModalKelompok.tsx`**

**Fitur:**
- Auto-show pertama kali (simpan di localStorage)
- Daftar 10 anggota
- Quote Al-Qur'an

```typescript
useEffect(() => {
  const hasSeenModal = localStorage.getItem("hasSeenWelcomeModal");
  if (!hasSeenModal) {
    setIsOpen(true);
  }
}, []);

const handleClose = () => {
  localStorage.setItem("hasSeenWelcomeModal", "true");
  setIsOpen(false);
};
```

---

## 12. KOMPONEN TAMBAHAN

**A. Scroll to Top**
```typescript
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300);
  };
  window.addEventListener("scroll", toggleVisibility);
}, []);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
```

**B. Loading Spinner**
```jsx
<div className="flex items-center justify-center">
  <Loader2 className="animate-spin" />
  <p>Memuat data...</p>
</div>
```

---

## TEKNOLOGI

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router** - Routing
- **React Query** - Data Fetching + Caching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **eQuran API** - Data Al-Qur'an

---

## API

**Daftar Surah:**
```
GET https://equran.id/api/v2/surat
```

**Detail Surah:**
```
GET https://equran.id/api/v2/surat/{nomor}
```

---

## FITUR UTAMA

✅ 114 Surah lengkap
✅ Audio tilawah setiap ayat
✅ Terjemahan Indonesia + Latin
✅ Pencarian real-time
✅ Dark mode (tersimpan)
✅ Auto-pause audio (hanya 1 main)
✅ Responsive (mobile/tablet/desktop)
✅ Modal info kelompok
✅ Scroll to top button
✅ Animasi smooth

---

## ALUR PENGGUNA

1. Buka app → Modal kelompok muncul
2. Lihat daftar 114 surah
3. Cari surah dengan search bar
4. Klik surah → Masuk detail
5. Baca ayat + dengar audio
6. Toggle dark mode
7. Scroll to top

---

## BUILD & DEPLOY

```bash
npm run build
npm run preview
```

Deploy folder `dist` ke Vercel/Netlify

---

**Selesai! Semua kode sudah jalan di aplikasi.** 🎉
