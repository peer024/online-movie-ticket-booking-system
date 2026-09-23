import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUNDLED_DB = path.join(__dirname, '..', 'data', 'db.json');
let DB_FILE = BUNDLED_DB;

// If running in Netlify Functions, Vercel, or AWS Lambda, use writable /tmp
if (process.env.NETLIFY || process.env.VERCEL || process.env.LAMBDA_TASK_ROOT) {
  DB_FILE = path.join('/tmp', 'cineverse_db.json');
}

let inMemoryCache = null;

const INITIAL_DATA = {
  movies: [
    {
      id: "mov-goat",
      title: "The Greatest of All Time (GOAT)",
      tamilTitle: "தி கிரேட்டஸ்ட் ஆஃப் ஆல் டைம்",
      tagline: "A leader. A warrior. A legacy. Thalapathy Vijay in Venkat Prabhu's espionage storm.",
      genre: ["Action", "Sci-Fi", "Crime"],
      duration: "3h 03m",
      rating: 9.4,
      votes: "720K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu / Hindi",
      isTamil: true,
      has3D: true,
      has2D: true,
      formats: ["IMAX 3D Laser", "4DX 3D", "Dolby Atmos 2D", "EPIQ 2D"],
      releaseDate: "2024-09-05",
      director: "Venkat Prabhu",
      cast: ["Thalapathy Vijay", "Prashanth", "Prabhu Deva", "Sneha", "Mohan", "Meenakshi Chaudhary"],
      synopsis: "Gandhi, an elite operative of the Special Anti-Terrorist Squad (SATS), is summoned back from retirement when a sinister ghost from his past reappears. A high-octane confrontation spanning across Moscow, Bangkok, and Chennai with double-agent intrigue and de-aging tech.",
      posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/B5GAjuSnNuQ",
      featured: true,
      accentColor: "#00f5ff"
    },
    {
      id: "mov-coolie",
      title: "Coolie: The Blood Gold Dynasty",
      tamilTitle: "கூலி",
      tagline: "Superstar Rajinikanth in Lokesh Kanagaraj's fiery gold underworld.",
      genre: ["Action", "Crime", "Thriller"],
      duration: "2h 50m",
      rating: 9.6,
      votes: "950K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu / Hindi",
      isTamil: true,
      has3D: true,
      has2D: true,
      formats: ["IMAX 3D Laser", "Dolby Cinema 2D", "Barco 3D"],
      releaseDate: "2025-05-01",
      director: "Lokesh Kanagaraj",
      cast: ["Superstar Rajinikanth", "Nagarjuna", "Soubin Shahir", "Shruti Haasan", "Upendra", "Sathyaraj"],
      synopsis: "Deva, a seasoned port union worker with an untold past, stands between an international gold smuggling cartel and the lives of thousands of workers at the Chennai harbor. Armed with sheer grit and legendary swagger, he reclaims the docks.",
      posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/qeVfT2iLiu0",
      featured: true,
      accentColor: "#f59e0b"
    },
    {
      id: "mov-leo",
      title: "Leo: Bloody Sweet",
      tamilTitle: "லியோ",
      tagline: "Keep your friends close, but your enemies closer. The LCU legend.",
      genre: ["Action", "Crime", "Drama"],
      duration: "2h 44m",
      rating: 9.2,
      votes: "880K",
      certificate: "A",
      language: "Tamil (தமிழ்) / Telugu / Hindi",
      isTamil: true,
      has3D: true,
      has2D: true,
      formats: ["4DX 3D Dynamic", "IMAX 2D", "Dolby Atmos 64-Ch"],
      releaseDate: "2023-10-19",
      director: "Lokesh Kanagaraj",
      cast: ["Thalapathy Vijay", "Trisha Krishnan", "Sanjay Dutt", "Arjun Sarja", "Gautham Vasudev Menon"],
      synopsis: "Parthiban is a mild-mannered cafe owner and animal rescuer in Theog, Himachal Pradesh. When he foils a violent robbery, dangerous drug lords Anthony and Harold Das suspect he is actually Leo Das, their long-lost brother and lethal enforcer.",
      posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/Po3jStA673E",
      featured: true,
      accentColor: "#ef4444"
    },
    {
      id: "mov-amaran",
      title: "Amaran: Major Mukund Varadarajan",
      tamilTitle: "அமரன்",
      tagline: "Achamillai, Achamillai, Achamenbathu Illaiye. The true story of bravery.",
      genre: ["Drama", "Action", "Biography"],
      duration: "2h 47m",
      rating: 9.5,
      votes: "610K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu",
      isTamil: true,
      has3D: false,
      has2D: true,
      formats: ["Dolby Atmos 2D", "4K RGB Laser 2D", "EPIQ 2D"],
      releaseDate: "2024-10-31",
      director: "Rajkumar Periasamy",
      cast: ["Sivakarthikeyan", "Sai Pallavi", "Bhuvan Arora", "Rahul Bose"],
      synopsis: "Based on the real-life heroic story of Major Mukund Varadarajan, an Indian Army officer awarded the Ashoka Chakra for valor during counter-terrorism operations in Shopian, Kashmir, and his poignant bond with wife Indhu Rebecca Varghese.",
      posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/hylIXfZeB4c",
      featured: true,
      accentColor: "#10b981"
    },
    {
      id: "mov-jailer",
      title: "Jailer: Tiger Muthuvel Pandian",
      tamilTitle: "ஜெயிலர்",
      tagline: "His silence is dangerous. His wrath is legendary.",
      genre: ["Action", "Crime", "Drama"],
      duration: "2h 48m",
      rating: 9.3,
      votes: "820K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu / Hindi",
      isTamil: true,
      has3D: true,
      has2D: true,
      formats: ["IMAX 3D Laser", "Dolby Atmos 2D"],
      releaseDate: "2023-08-10",
      director: "Nelson Dilipkumar",
      cast: ["Superstar Rajinikanth", "Mohanlal", "Shiva Rajkumar", "Jackie Shroff", "Ramya Krishnan", "Vinayakan"],
      synopsis: "Muthuvel Pandian, a retired prison jailer living a peaceful domestic life, embarks on a relentless warpath against an eccentric antique smuggler when his ACP son goes missing while investigating the gang.",
      posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/Y5BeWdODPqo",
      featured: true,
      accentColor: "#f59e0b"
    },
    {
      id: "mov-vettaiyan",
      title: "Vettaiyan: The Hunter",
      tamilTitle: "வேட்டையன்",
      tagline: "When justice fails, the hunter arrives. Encounter specialist SP Athiyan.",
      genre: ["Action", "Crime", "Drama"],
      duration: "2h 43m",
      rating: 9.1,
      votes: "540K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu",
      isTamil: true,
      has3D: false,
      has2D: true,
      formats: ["IMAX 2D Laser", "Dolby Atmos 2D", "EPIQ 2D"],
      releaseDate: "2024-10-10",
      director: "T. J. Gnanavel",
      cast: ["Superstar Rajinikanth", "Amitabh Bachchan", "Fahadh Faasil", "Rana Daggubati", "Manju Warrier"],
      synopsis: "An encounter specialist cop renowned for swift justice faces moral and legal questions when a controversial encounter in Kanyakumari sparks public debate and an inquiry headed by a human rights judge.",
      posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/zPqMbwmGC1U",
      featured: false,
      accentColor: "#8b5cf6"
    },
    {
      id: "mov-vikram",
      title: "Vikram: Hitlist",
      tamilTitle: "விக்ரம்",
      tagline: "Once upon a time there lived a ghost. Welcome to the LCU.",
      genre: ["Action", "Crime", "Thriller"],
      duration: "2h 54m",
      rating: 9.3,
      votes: "890K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu / Hindi",
      isTamil: true,
      has3D: true,
      has2D: true,
      formats: ["IMAX 3D Laser", "Dolby Atmos 2D", "ScreenX 2D"],
      releaseDate: "2022-06-03",
      director: "Lokesh Kanagaraj",
      cast: ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Suriya (Rolex)", "Narain"],
      synopsis: "Amar, the chief of a black-ops squad, is summoned to investigate a series of vigilante killings committed by masked men targeting high-ranking narcotics officers. The investigation leads directly to Commander Arun Kumar Vikram.",
      posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/OKBMCL-frPU",
      featured: false,
      accentColor: "#ec4899"
    },
    {
      id: "mov-kanguva",
      title: "Kanguva: The Fire Song",
      tamilTitle: "கங்குவா",
      tagline: "A warrior of the primitive wild. A hunter of the futuristic city.",
      genre: ["Sci-Fi", "Action", "Adventure"],
      duration: "2h 34m",
      rating: 8.9,
      votes: "430K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu / Hindi",
      isTamil: true,
      has3D: true,
      has2D: true,
      formats: ["IMAX 3D Laser", "RealD 3D", "Dolby Atmos 2D"],
      releaseDate: "2024-11-14",
      director: "Siva",
      cast: ["Suriya", "Bobby Deol", "Disha Patani", "Jagapathi Babu", "Yogi Babu"],
      synopsis: "A dual-timeline spectacle linking an untamed, fiery island chieftain from 1070 AD fighting brutal clan invasions to a modern shadow bounty hunter in 2024 unravelling ancestral biological memories.",
      posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/ajnCMSC4VPo",
      featured: false,
      accentColor: "#f97316"
    },
    {
      id: "mov-maanaadu",
      title: "Maanaadu: The Time Loop",
      tamilTitle: "மாநாடு",
      tagline: "Rewind, Respawn, Re-kill. The brain-bending political time loop thriller.",
      genre: ["Sci-Fi", "Thriller", "Action"],
      duration: "2h 27m",
      rating: 9.2,
      votes: "480K",
      certificate: "U",
      language: "Tamil (தமிழ்) / Telugu",
      isTamil: true,
      has3D: false,
      has2D: true,
      formats: ["Dolby Atmos 2D", "4K RGB Laser"],
      releaseDate: "2021-11-25",
      director: "Venkat Prabhu",
      cast: ["Silambarasan TR", "SJ Suryah", "Kalyani Priyadarshan", "SA Chandrasekhar", "Premgi Amaren"],
      synopsis: "Abdul Khaaliq is caught in an endless time loop on the day of a massive public conference. To save the Chief Minister from assassination and prevent a communal riot, he must repeatedly outsmart rogue DCP Dhanushkodi.",
      posterUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/3FuuZU21S80",
      featured: false,
      accentColor: "#00f5ff"
    },
    {
      id: "mov-lovetoday",
      title: "Love Today",
      tamilTitle: "லவ் டுடே",
      tagline: "Swap phones for 24 hours. Chaos, laughter, and hard truths unleash.",
      genre: ["Comedy", "Romance", "Drama"],
      duration: "2h 34m",
      rating: 9.1,
      votes: "560K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu",
      isTamil: true,
      has3D: false,
      has2D: true,
      formats: ["Dolby Atmos 2D", "Laser 2D"],
      releaseDate: "2022-11-04",
      director: "Pradeep Ranganathan",
      cast: ["Pradeep Ranganathan", "Ivana", "Yogi Babu", "Sathyaraj", "Radhika Sarathkumar"],
      synopsis: "Before giving his blessing for marriage, a strict father challenges a young couple to exchange their unlocked smartphones for one full day. Secrets, hilarious misunderstandings, and WhatsApp chaos erupt.",
      posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/Xjw4ZbCIYS0",
      featured: false,
      accentColor: "#ec4899"
    },
    {
      id: "mov-doctor",
      title: "Doctor",
      tamilTitle: "டாக்டர்",
      tagline: "A military doctor with zero expression, razor sharp brain, and dark comedy.",
      genre: ["Comedy", "Action", "Crime"],
      duration: "2h 28m",
      rating: 9.0,
      votes: "610K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu",
      isTamil: true,
      has3D: false,
      has2D: true,
      formats: ["Dolby Atmos 2D", "Laser 2D"],
      releaseDate: "2021-10-09",
      director: "Nelson Dilipkumar",
      cast: ["Sivakarthikeyan", "Vinay Rai", "Priyanka Arul Mohan", "Yogi Babu", "Redin Kingsley"],
      synopsis: "When his ex-fiancée's young niece is kidnapped by an international human trafficking syndicate in Goa, an unemotional military doctor devises a bizarre, deadpan scheme to infiltrate the cartel.",
      posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/oQiH_Iw0kDs",
      featured: false,
      accentColor: "#10b981"
    },
    {
      id: "mov-demonte",
      title: "Demonte Colony 2",
      tamilTitle: "டிமான்ட்டி காலனி 2",
      tagline: "Darkness will return. The curse of Lord Demonte reawakens.",
      genre: ["Horror", "Mystery", "Thriller"],
      duration: "2h 25m",
      rating: 8.8,
      votes: "320K",
      certificate: "UA",
      language: "Tamil (தமிழ்) / Telugu",
      isTamil: true,
      has3D: true,
      has2D: true,
      formats: ["IMAX 3D Laser", "Dolby Atmos 2D"],
      releaseDate: "2024-08-15",
      director: "R. Ajay Gnanamuthu",
      cast: ["Arulnithi", "Priya Bhavani Shankar", "Arun Pandian", "Muthukumar", "Meenakshi Govindarajan"],
      synopsis: "Six years after the terrifying events at the Portuguese mansion in Alwarpet, a paranormal researcher discovers an ancient Tibetan ritual capable of opening a metaphysical portal into the demonic realm of Lord Demonte.",
      posterUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/NlWgTUFwpIk",
      featured: false,
      accentColor: "#8b5cf6"
    },
    {
      id: "mov-sitaramam",
      title: "Sita Ramam",
      tamilTitle: "சீதா ராமம்",
      tagline: "Letters written in blood, sealed with eternal love.",
      genre: ["Romance", "Drama", "Period"],
      duration: "2h 43m",
      rating: 9.4,
      votes: "690K",
      certificate: "U",
      language: "Tamil (தமிழ்) / Telugu / Malayalam",
      isTamil: true,
      has3D: false,
      has2D: true,
      formats: ["Dolby Atmos 2D", "4K RGB Laser"],
      releaseDate: "2022-08-05",
      director: "Hanu Raghavapudi",
      cast: ["Dulquer Salmaan", "Mrunal Thakur", "Rashmika Mandanna", "Sumanth", "Gautham Vasudev Menon"],
      synopsis: "In 1965, Lieutenant Ram, an orphaned Indian soldier serving in Kashmir, receives anonymous romantic letters from a woman named Sita Mahalakshmi. Twenty years later, a rebellious student is tasked with delivering Ram's final undelivered letter.",
      posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/QS2UPxj_Y9w",
      featured: false,
      accentColor: "#ec4899"
    },
    {
      id: "mov-dune",
      title: "Dune: Part Two",
      tamilTitle: "டூன்: பார்ட் 2 (தமிழ் டப்பிங்)",
      tagline: "Long live the fighters. An interstellar visual triumph.",
      genre: ["Sci-Fi", "Adventure", "Action"],
      duration: "2h 46m",
      rating: 9.3,
      votes: "980K",
      certificate: "UA",
      language: "English / Tamil (தமிழ்)",
      isTamil: false,
      has3D: true,
      has2D: true,
      formats: ["IMAX 3D Laser", "Dolby Cinema 2D", "4DX 3D"],
      releaseDate: "2024-03-01",
      director: "Denis Villeneuve",
      cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"],
      synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.",
      posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
      featured: true,
      accentColor: "#06b6d4"
    },
    {
      id: "mov-avatar",
      title: "Avatar: The Way of Water",
      tamilTitle: "அவதார்: தி வே ஆஃப் வாட்டர்",
      tagline: "The water connects all things. The pinnacle of 3D filmmaking.",
      genre: ["Sci-Fi", "Adventure", "Fantasy"],
      duration: "3h 12m",
      rating: 9.0,
      votes: "910K",
      certificate: "UA",
      language: "English / Tamil (தமிழ்) / Telugu",
      isTamil: false,
      has3D: true,
      has2D: false,
      formats: ["IMAX 3D Laser HFR", "RealD 3D 48fps", "4DX 3D"],
      releaseDate: "2022-12-16",
      director: "James Cameron",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang", "Kate Winslet"],
      synopsis: "Set more than a decade after the events of the first film, Jake Sully and Neytiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the oceanic regions of Pandora.",
      posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/d9MyW72ELq0",
      featured: false,
      accentColor: "#00f5ff"
    }
  ],
  showtimes: [
    // GOAT
    {
      id: "st-goat-3d-1",
      movieId: "mov-goat",
      showType: "3D",
      format: "IMAX 3D Laser",
      date: "Today",
      time: "10:15 AM",
      hall: "Grand IMAX Audi 1 (3D)",
      experience: "IMAX 3D Laser HFR",
      sound: "12-Channel Dolby Atmos",
      glassesFee: 30,
      priceTiers: { vip: 480, executive: 340, classic: 220 },
      bookedSeats: ["A3", "A4", "C5", "C6", "C7", "D8"]
    },
    {
      id: "st-goat-2d-1",
      movieId: "mov-goat",
      showType: "2D",
      format: "Dolby Atmos 2D",
      date: "Today",
      time: "02:45 PM",
      hall: "Screen 3 - Dolby Vision 2D",
      experience: "4K Laser Dolby Atmos (2D)",
      sound: "Dolby Atmos 64-Channel",
      glassesFee: 0,
      priceTiers: { vip: 400, executive: 280, classic: 170 },
      bookedSeats: ["A1", "A2", "D1", "D2"]
    },
    // COOLIE
    {
      id: "st-coolie-3d-1",
      movieId: "mov-coolie",
      showType: "3D",
      format: "IMAX 3D Laser",
      date: "Today",
      time: "07:00 PM",
      hall: "Grand IMAX Audi 1 (3D)",
      experience: "IMAX 3D Laser",
      sound: "12-Channel Dolby Atmos",
      glassesFee: 30,
      priceTiers: { vip: 550, executive: 390, classic: 240 },
      bookedSeats: ["A2", "A3", "B3", "B4", "C4", "C5"]
    },
    {
      id: "st-coolie-2d-1",
      movieId: "mov-coolie",
      showType: "2D",
      format: "Dolby Cinema 2D",
      date: "Today",
      time: "11:30 AM",
      hall: "Screen 4 - Cyber Lounge 2D",
      experience: "4K Dual Laser 2D",
      sound: "Dolby Atmos Spatial",
      glassesFee: 0,
      priceTiers: { vip: 450, executive: 300, classic: 180 },
      bookedSeats: ["B4", "B5"]
    },
    // LEO
    {
      id: "st-leo-3d-1",
      movieId: "mov-leo",
      showType: "3D",
      format: "4DX 3D Dynamic",
      date: "Today",
      time: "09:45 PM",
      hall: "Screen 2 - Luxe 4DX (3D)",
      experience: "4DX 3D Motion & Snow",
      sound: "Dolby Atmos 64-Channel",
      glassesFee: 30,
      priceTiers: { vip: 500, executive: 360, classic: 230 },
      bookedSeats: ["A1", "A2", "C5", "C6"]
    },
    {
      id: "st-leo-2d-1",
      movieId: "mov-leo",
      showType: "2D",
      format: "IMAX 2D Laser",
      date: "Today",
      time: "03:15 PM",
      hall: "Grand IMAX Audi 1 (2D Mode)",
      experience: "IMAX 70mm Aspect (2D)",
      sound: "12-Channel Atmos",
      glassesFee: 0,
      priceTiers: { vip: 420, executive: 290, classic: 180 },
      bookedSeats: ["D3", "D4"]
    },
    // AMARAN
    {
      id: "st-amaran-2d-1",
      movieId: "mov-amaran",
      showType: "2D",
      format: "Dolby Atmos 2D",
      date: "Today",
      time: "01:30 PM",
      hall: "Screen 3 - Dolby Vision 2D",
      experience: "4K Laser Dolby Atmos (2D)",
      sound: "Dolby Atmos Spatial Audio",
      glassesFee: 0,
      priceTiers: { vip: 420, executive: 280, classic: 170 },
      bookedSeats: ["A3", "A4", "B3", "B4"]
    },
    // JAILER
    {
      id: "st-jailer-3d-1",
      movieId: "mov-jailer",
      showType: "3D",
      format: "IMAX 3D Laser",
      date: "Today",
      time: "06:15 PM",
      hall: "Grand IMAX Audi 1 (3D)",
      experience: "IMAX 3D Laser",
      sound: "12-Channel Atmos",
      glassesFee: 30,
      priceTiers: { vip: 490, executive: 350, classic: 210 },
      bookedSeats: ["C3", "C4", "D5"]
    },
    // VETTAIYAN
    {
      id: "st-vettaiyan-2d-1",
      movieId: "mov-vettaiyan",
      showType: "2D",
      format: "IMAX 2D Laser",
      date: "Today",
      time: "05:00 PM",
      hall: "Grand IMAX Audi 1 (2D Mode)",
      experience: "IMAX 2D Laser",
      sound: "12-Channel Dolby Atmos",
      glassesFee: 0,
      priceTiers: { vip: 440, executive: 310, classic: 190 },
      bookedSeats: ["A4", "A5"]
    },
    // VIKRAM
    {
      id: "st-vikram-3d-1",
      movieId: "mov-vikram",
      showType: "3D",
      format: "IMAX 3D Laser",
      date: "Today",
      time: "10:45 PM",
      hall: "Grand IMAX Audi 1 (3D)",
      experience: "IMAX 3D Laser",
      sound: "12-Channel Dolby Atmos",
      glassesFee: 30,
      priceTiers: { vip: 460, executive: 320, classic: 200 },
      bookedSeats: ["C4", "C5"]
    },
    // KANGUVA
    {
      id: "st-kanguva-3d-1",
      movieId: "mov-kanguva",
      showType: "3D",
      format: "RealD 3D Laser",
      date: "Today",
      time: "04:15 PM",
      hall: "Screen 2 - Luxe 4DX (3D)",
      experience: "RealD 3D Atmos",
      sound: "Dolby Atmos 64-Channel",
      glassesFee: 30,
      priceTiers: { vip: 450, executive: 310, classic: 190 },
      bookedSeats: ["B5", "B6"]
    },
    // MAANAADU
    {
      id: "st-maanaadu-2d-1",
      movieId: "mov-maanaadu",
      showType: "2D",
      format: "Dolby Atmos 2D",
      date: "Today",
      time: "08:15 PM",
      hall: "Screen 3 - Dolby Vision 2D",
      experience: "Dolby Atmos Spatial 2D",
      sound: "Dolby Atmos 64-Ch",
      glassesFee: 0,
      priceTiers: { vip: 390, executive: 260, classic: 160 },
      bookedSeats: ["B2", "B3"]
    },
    // LOVE TODAY
    {
      id: "st-lovetoday-2d-1",
      movieId: "mov-lovetoday",
      showType: "2D",
      format: "Dolby Atmos 2D",
      date: "Today",
      time: "12:15 PM",
      hall: "Screen 4 - Cyber Lounge 2D",
      experience: "4K Laser Dolby Atmos",
      sound: "Dolby 7.1 Surround",
      glassesFee: 0,
      priceTiers: { vip: 380, executive: 250, classic: 150 },
      bookedSeats: ["C2", "C3"]
    },
    // DOCTOR
    {
      id: "st-doctor-2d-1",
      movieId: "mov-doctor",
      showType: "2D",
      format: "Dolby Atmos 2D",
      date: "Today",
      time: "03:45 PM",
      hall: "Screen 4 - Cyber Lounge 2D",
      experience: "Dolby Atmos 2D",
      sound: "Dolby Atmos 64-Ch",
      glassesFee: 0,
      priceTiers: { vip: 380, executive: 250, classic: 150 },
      bookedSeats: ["A1", "A2"]
    },
    // DEMONTE COLONY 2
    {
      id: "st-demonte-3d-1",
      movieId: "mov-demonte",
      showType: "3D",
      format: "IMAX 3D Laser",
      date: "Today",
      time: "11:15 PM",
      hall: "Grand IMAX Audi 1 (3D)",
      experience: "Nightmare 3D Sound Immersion",
      sound: "Dolby Atmos 12-Channel",
      glassesFee: 30,
      priceTiers: { vip: 450, executive: 320, classic: 200 },
      bookedSeats: ["D4", "D5"]
    },
    // SITA RAMAM
    {
      id: "st-sitaramam-2d-1",
      movieId: "mov-sitaramam",
      showType: "2D",
      format: "Dolby Atmos 2D",
      date: "Today",
      time: "04:30 PM",
      hall: "Screen 3 - Dolby Vision 2D",
      experience: "Cinematic Acoustic 2D",
      sound: "Dolby Atmos Spatial",
      glassesFee: 0,
      priceTiers: { vip: 390, executive: 260, classic: 160 },
      bookedSeats: ["A5", "A6"]
    },
    // DUNE PART 2
    {
      id: "st-dune-3d-1",
      movieId: "mov-dune",
      showType: "3D",
      format: "IMAX 3D Laser",
      date: "Today",
      time: "08:45 PM",
      hall: "Grand IMAX Audi 1 (3D)",
      experience: "IMAX 3D Laser HFR",
      sound: "12-Channel Dolby Atmos",
      glassesFee: 30,
      priceTiers: { vip: 550, executive: 390, classic: 240 },
      bookedSeats: ["A3", "A4", "B4", "B5"]
    },
    // AVATAR 2
    {
      id: "st-avatar-3d-1",
      movieId: "mov-avatar",
      showType: "3D",
      format: "IMAX 3D Laser HFR",
      date: "Today",
      time: "01:00 PM",
      hall: "Grand IMAX Audi 1 (3D)",
      experience: "IMAX 3D Laser 48fps HFR",
      sound: "12-Channel Dolby Atmos",
      glassesFee: 30,
      priceTiers: { vip: 580, executive: 420, classic: 260 },
      bookedSeats: ["A1", "A2", "B3", "B4"]
    }
  ],
  snacks: [
    {
      id: "snk-1",
      name: "Gourmet Truffle Butter Popcorn",
      category: "Popcorn",
      size: "Large Tub (180g)",
      price: 240,
      image: "🍿",
      calories: "450 kcal",
      isBestSeller: true
    },
    {
      id: "snk-2",
      name: "Artisan Smoked Caramel Crunch",
      category: "Popcorn",
      size: "Jumbo Bucket (220g)",
      price: 260,
      image: "🍿",
      calories: "520 kcal",
      isBestSeller: true
    },
    {
      id: "snk-3",
      name: "Chennai Spicy Masala Popcorn",
      category: "Popcorn",
      size: "Jumbo Bucket (200g)",
      price: 230,
      image: "🍿",
      calories: "440 kcal",
      isBestSeller: true
    },
    {
      id: "snk-4",
      name: "Loaded Queso & Jalapeño Nachos",
      category: "Hot Snacks",
      size: "Double Cheese Platter",
      price: 280,
      image: "🧀",
      calories: "580 kcal",
      isBestSeller: false
    },
    {
      id: "snk-5",
      name: "Crispy Peri Peri Crinkle Fries",
      category: "Hot Snacks",
      size: "Family Pack",
      price: 210,
      image: "🍟",
      calories: "420 kcal",
      isBestSeller: false
    },
    {
      id: "snk-6",
      name: "Electric Blue Curacao Mocktail",
      category: "Beverages",
      size: "500ml Chilled",
      price: 190,
      image: "🍹",
      calories: "160 kcal",
      isBestSeller: true
    },
    {
      id: "snk-7",
      name: "Zero Sugar Nitro Chilled Cola",
      category: "Beverages",
      size: "650ml Fountain",
      price: 160,
      image: "🥤",
      calories: "0 kcal",
      isBestSeller: false
    },
    {
      id: "snk-8",
      name: "Cyber Combo: Jumbo Popcorn + 2 Drinks",
      category: "Combos",
      size: "Popcorn Tub + 2x 500ml Drinks",
      price: 490,
      image: "✨",
      calories: "780 kcal",
      isBestSeller: true
    }
  ],
  bookings: [
    {
      id: "CV-98214",
      movieId: "mov-goat",
      movieTitle: "The Greatest of All Time (GOAT)",
      showType: "3D",
      format: "IMAX 3D Laser",
      showtimeId: "st-goat-3d-1",
      date: "Today",
      time: "10:15 AM",
      hall: "Grand IMAX Audi 1 (3D)",
      seats: ["A3", "A4"],
      seatTiers: ["VIP", "VIP"],
      ticketAmount: 960,
      glassesCount: 2,
      glassesAmount: 60,
      snacks: [
        { name: "Gourmet Truffle Butter Popcorn", qty: 1, price: 240 },
        { name: "Zero Sugar Nitro Chilled Cola", qty: 2, price: 320 }
      ],
      snacksAmount: 560,
      discount: 100,
      promoCode: "CINE50",
      totalAmount: 1480,
      paymentMethod: "UPI / Holographic QR",
      customerName: "Alex Mercer",
      customerEmail: "alex.mercer@cineverse.io",
      customerPhone: "+91 98765 43210",
      createdAt: "2026-09-23T20:15:00.000Z",
      status: "Confirmed"
    }
  ],
  theaters: [
    {
      id: "th-1",
      name: "CineVerse CyberPlex Grand",
      location: "Phoenix Marketcity, Velachery, Chennai",
      screens: 6,
      halls: ["Grand IMAX Audi 1 (3D)", "Screen 2 - Luxe 4DX (3D)", "Screen 3 - Dolby Vision 2D", "Screen 4 - Cyber Lounge 2D"]
    }
  ]
};

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

export function readDb() {
  if (inMemoryCache) {
    return inMemoryCache;
  }
  ensureDir(DB_FILE);
  if (!fs.existsSync(DB_FILE)) {
    // If bundled db.json exists, copy from it; otherwise use INITIAL_DATA
    if (fs.existsSync(BUNDLED_DB)) {
      try {
        const bundledContent = fs.readFileSync(BUNDLED_DB, 'utf-8');
        fs.writeFileSync(DB_FILE, bundledContent, 'utf-8');
        inMemoryCache = JSON.parse(bundledContent);
        return inMemoryCache;
      } catch (e) {}
    }
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    } catch (e) {}
    inMemoryCache = INITIAL_DATA;
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    inMemoryCache = JSON.parse(raw);
    return inMemoryCache;
  } catch (err) {
    console.error('Error reading DB, using initial data:', err);
    inMemoryCache = INITIAL_DATA;
    return INITIAL_DATA;
  }
}

export function writeDb(data) {
  inMemoryCache = data;
  try {
    ensureDir(DB_FILE);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice: Could not write DB to filesystem in serverless mode, preserved in memory:', err.message);
  }
}
