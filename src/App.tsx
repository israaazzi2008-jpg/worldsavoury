import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabaseClient';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Plus, 
  X, 
  Calendar, 
  Utensils, 
  ChefHat, 
  ArrowRight, 
  Search, 
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Info,
  Menu as MenuIcon,
  ChevronRight,
  Send,
  Settings,
  Trash2,
  Edit
} from 'lucide-react';

// French types for items
interface MenuItem {
  id: string;
  name: string;
  category: 'Cakes' | 'Gâteaux' | 'Cupcakes' | 'Chocolat personnalisé' | 'Fleur au chocolat';
  description: string;
  imagePlaceholder: string; // Describes the image theme
}

// =========================================================================
// 🌟 VOS INFORMATIONS DE CONFIGURATION DE VOTRE MAISON (MODIFIEZ CETTE ZONE !) 🌟
// Modifiez ces valeurs de texte directement ci-dessous pour que vos liens,
// votre logo, votre numéro whatsapp et vos réseaux apparaissent sur le site !
// =========================================================================
const MAISON_CONFIG = {
  brandName: "World's Savoury",                      // Le nom de votre maison d'art culinaire
  brandLogo: "/logo.jpg",                             // Lien d'image ou nom de fichier pour le logo (ex: "https://...jpg" ou "logo.jpg" dans public/)
  whatsappNumber: "+213657936584",                    // 📱 Saisissez votre numéro WhatsApp ici avec indicatif (ex: +33600000000)
  fbLink: "https://www.facebook.com/share/1AEWSZQUeR/?mibextid=wwXIfr", // Le lien web complet vers votre page Facebook
  fbHandle: "World's Savoury Beni Saf",                 // Le nom instagram/facebook affiché de votre entreprise
  instaLink: "https://www.instagram.com/worldssavory?igsh=NWNpNGVsamZxYjc4", // Le lien web complet vers votre compte Instagram
  instaHandle: "@worlds.savoury"                      // Le nom ou pseudonyme d'Instagram affiché
};

// Helper function to resolve static images correctly in Vite, handling absolute or relative paths
const resolveImgSrc = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Strip any leading ./ or /
  const file = path.replace(/^\.?\//, '');
  // Return resolved relative path so it loads correctly both in dev and under subfolders like GitHub Pages
  return './' + file;
};

// Detect if the user is visiting from the Facebook in-app browser (WebView), which blocks custom protocols like whatsapp://
const isFacebookBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
};

const MENU_ITEMS: MenuItem[] = [
  // --- CATEGORY : Cakes (Exactly 7 products) ---
  {
    id: 'cake1',
    name: "Gâteau Cake de Crêve ",
    category: "Cakes",
    description: "35cm sur 28cm pour 30 personnes",
    imagePlaceholder: "/tarte1.jpg"
  },
  {
    id: 'cake2',
    name: "Gâteau Cake de Rêve ",
    category: "Cakes",
    description: "24cm sur 24cm pour 12 personnes",
    imagePlaceholder: "/tarte2.jpg"
  },
  {
    id: 'cake3',
    name: "Gâteau Cake de Rêve ",
    category: "Cakes",
    description: "diamètre 12 pour 4 personnes",
    imagePlaceholder: "/tarte3.jpg"
  },
  {
    id: 'cake4',
    name: "Gâteau Cake de Rêve ",
    category: "Cakes",
    description: "diamètre 15cm pour 7 personnes",
    imagePlaceholder: "/tarte4.jpg"
  },
  {
    id: 'cake5',
    name: "Gâteau Cake de Rêve ",
    category: "Cakes",
    description: "diamètre 15cm pour 15 personnes",
    imagePlaceholder: "/tarte5.jpg"
  },
  {
    id: 'cake6',
    name: "Gâteau Cake de Rêve ",
    category: "Cakes",
    description: "diamètre 16cm pour 6 personnes",
    imagePlaceholder: "/tarte6.jpg"
  },
  {
    id: 'cake7',
    name: "Gâteau Cake de Rêve ",
    category: "Cakes",
    description: "diamètre 12cm pour 3 personnes",
    imagePlaceholder: "/tarte7.jpg"
  },

  // --- CATEGORY : Gâteaux (Exactly 25 products for you to customize) ---
  {
    id: 'gateau1',
    name: "k3ik3at",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix. Racontez l'histoire de ses saveurs fraîches ou crémeuses.",
    imagePlaceholder: "/1.jpg"
  },
  {
    id: 'gateau2',
    name: "baklava turkish",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/2.jpg"
  },
  {
    id: 'gateau3',
    name: "sabli caramel",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/3.jpg"
  },
  {
    id: 'gateau4',
    name: "amondino",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/4.jpg"
  },
  {
    id: 'gateau5',
    name: "hlilat farcè",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/5.jpg"
  },
  {
    id: 'gateau6',
    name: "bniwen au chocolat",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/6.jpg"
  },
  {
    id: 'gateau7',
    name: "Sigar",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/7.jpg"
  },
  {
    id: 'gateau8',
    name: "baklawa algèrienne",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/8.jpg"
  },
  {
    id: 'gateau9',
    name: "gateau sec",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/9.jpg"
  },
  {
    id: 'gateau10',
    name: "sabli au chocolat",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/10.jpg"
  },
  {
    id: 'gateau11',
    name: "thouma",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/11.jpg"
  },
  {
    id: 'gateau12',
    name: "amondino de soutnance",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/12.jpg"
  },
  {
    id: 'gateau13',
    name: "jenjlaniya",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/13.jpg"
  },
  {
    id: 'gateau14',
    name: "sabli mariage",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/14.jpg"
  },
  {
    id: 'gateau15',
    name: "les dattes fourès",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/15.jpg"
  },
  {
    id: 'gateau16',
    name: "amondino bèbè",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/16.jpg"
  },
  {
    id: 'gateau17',
    name: "sabli omra",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/17.jpg"
  },
  {
    id: 'gateau18',
    name: "gateau noix de coco",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/18.jpg"
  },
  {
    id: 'gateau19',
    name: " les tartelette au caramel ",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/19.jpg"
  },
  {
    id: 'gateau20',
    name: "sabli simple",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/20.jpg"
  },
  {
    id: 'gateau21',
    name: "mchewek",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/21.jpg"
  },
  {
    id: 'gateau22',
    name: "torno",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/22.jpg"
  },
  {
    id: 'gateau23',
    name: "tartelette au citron",
    category: "Gâteaux",
    description: "Décoration personnalisée de votre choix",
    imagePlaceholder: "/23.jpg"
  },

  // --- CATEGORY : Cupcakes (Exactly 1 product) ---
  {
    id: 'cupcake1',
    name: "Cupcake ",
    category: "Cupcakes",
    description: "Emplacement pour votre description personnalisée de cupcakes. Détaillez vos saveurs de génoise et de glaçage onctueux.",
    imagePlaceholder: "/cup.jpg"
  },

  // --- CATEGORY : Chocolat personnalisé (Exactly 1 product) ---
  {
    id: 'chocolat1',
    name: "Chocolat Fin Personnalisé",
    category: "Chocolat personnalisé",
    description: "Emplacement pour vos tablettes gravées, écritures dorées ou chocolats monogrammes fins à personnaliser selon vos goûts.",
    imagePlaceholder: "/prs.jpg"
  },

  // --- CATEGORY : Fleur au chocolat (Exactly 1 product) ---
  {
    id: 'fleur1',
    name: " Fleur en Chocolat",
    category: "Fleur au chocolat",
    description: "Emplacement pour vos roses ou bouquets sculptés entièrement à la main en chocolat fin. C'est le cadeau ou le centre de table idéal.",
    imagePlaceholder: "/flr.jpg"
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'menu' | 'about' | 'contact'>('landing');
  const [transitioning, setTransitioning] = useState(false);
  
  // Custom states for interactive cupcakes & sparkles in intro screen
  const [cupcakes, setCupcakes] = useState<{ id: number; left: number; speed: number; rot: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; left: number; size: number }[]>([]);

  // Menu, filters and search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom interactive order modal states
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [spongeChoice, setSpongeChoice] = useState<'vanille' | 'chocolat'>('vanille');
  const [fillings, setFillings] = useState<string[]>([]);
  const [cakeText, setCakeText] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'Livraison' | 'Retrait la maison'>('Retrait la maison');
  const [clientRemark, setClientRemark] = useState('');
  
  // States for thank you popup
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouClientName, setThankYouClientName] = useState('');
  const [thankYouProductName, setThankYouProductName] = useState('');
  
  // State for order submission error
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Configuration read statically from MAISON_CONFIG above (edit there directly to reflect your pages!)
  const {
    brandName,
    brandLogo,
    whatsappNumber,
    fbLink,
    fbHandle,
    instaLink,
    instaHandle
  } = MAISON_CONFIG;

  // List of available fillings
  const AVAILABLE_FILLINGS = [
    { id: 'ganache_cho', label: 'Ganache Chocolat' },
    { id: 'banane', label: 'Banane' },
    { id: 'caramel', label: 'Caramel' },
    { id: 'noix', label: 'Noix' },
    { id: 'fraise', label: 'Fraise' },
    { id: 'creme_vanille', label: 'Crème Vanille' },
    { id: 'pistache', label: 'Pistache' }
  ];

  // Continuous global falling animation background loops
  useEffect(() => {
    let cupcakeCounter = 0;
    let sparkleCounter = 0;

    const cInterval = setInterval(() => {
      const item = {
        id: cupcakeCounter++,
        left: Math.random() * 95,
        speed: 4 + Math.random() * 2,
        rot: Math.random() * 360
      };
      setCupcakes(prev => [...prev, item]);
      setTimeout(() => {
        setCupcakes(prev => prev.filter(c => c.id !== item.id));
      }, 6000);
    }, 450);

    const sInterval = setInterval(() => {
      const item = {
        id: sparkleCounter++,
        left: Math.random() * 95,
        size: 2 + Math.random() * 4
      };
      setSparkles(prev => [...prev, item]);
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== item.id));
      }, 3000);
    }, 300);

    return () => {
      clearInterval(cInterval);
      clearInterval(sInterval);
    };
  }, []);

  // Independent auto-redirect loop for landing page
  useEffect(() => {
    if (currentTab !== 'landing') return;

    const autoRedirect = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentTab('menu');
        setTransitioning(false);
      }, 800);
    }, 2200);

    return () => {
      clearTimeout(autoRedirect);
    };
  }, [currentTab]);

  const triggerSkip = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentTab('menu');
      setTransitioning(false);
    }, 600);
  };

  const isSupabasePlaceholder = () => {
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    return !url || !key || url.includes('placeholder-url') || key.includes('placeholder-anon-key') || url.includes('your-supabase-project');
  };

  const toggleFilling = (label: string) => {
    setFillings(prev => 
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
    );
  };





  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      return;
    }
    if (!clientName.trim()) {
      alert("S'il vous plaît, saisissez votre nom complet.");
      return;
    }
    if (!clientPhone.trim()) {
      alert("S'il vous plaît, saisissez votre numéro de téléphone.");
      return;
    }

    setIsSending(true);

    const isCake = selectedProduct.category === 'Cakes';

    try {
      // Primary payload using exactly "costumer_name" and "dimentions_per" as requested by the user
      const primaryPayload = {
        "costumer_name": clientName,
        selection: selectedProduct.name,
        categorie: selectedProduct.category,
        phone_number: clientPhone,
        delivery: deliveryMethod,
        dimentions_per: selectedProduct.description,
        genoise: isCake ? (spongeChoice === 'vanille' ? 'Vanille' : 'Chocolat') : null,
        garniture: isCake && fillings.length > 0 ? fillings.join(', ') : null
      };

      const result = await supabase.from('orders').insert([primaryPayload]);

      if (result.error) {
        throw result.error;
      }

      // Save info for Thank You popup
      setThankYouClientName(clientName);
      setThankYouProductName(selectedProduct.name);
      
      // Trigger Thank You modal
      setShowThankYou(true);
      setSelectedProduct(null);

      // Reset inputs
      setClientName('');
      setClientPhone('');
      setFillings([]);
      setCakeText('');
      setClientRemark('');
    } catch (error: any) {
      console.error("Supabase order submission error:", error);
      setSubmissionError(error?.message || "Une erreur est survenue lors de l'envoi de votre commande. Veuillez vérifier votre connexion ou réessayer.");
    } finally {
      setIsSending(false);
    }
  };

  // Filter products directly from static MENU_ITEMS
  const filteredProducts = MENU_ITEMS.filter(prod => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gradient-to-b from-[#fff5f6] via-[#fffbfb] to-[#fff0f3] text-[#4a3538] font-sans min-h-screen flex flex-col relative selection:bg-[#fff0f3] selection:text-[#7d3b45] overflow-x-hidden">
      
      {/* BACKGROUND HEARTS FLOATING SUBTLY IN BG FOR ROMANTIC BABY PINK EXPERIENCE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 z-0">
        <div className="absolute top-[10%] left-[5%] text-amber-400 text-3xl animate-pulse">✦</div>
        <div className="absolute top-[40%] right-[8%] text-[#cfa873] text-4xl animate-bounce duration-1000">✧</div>
        <div className="absolute bottom-[10%] left-[12%] text-amber-200 text-4xl animate-pulse">✦</div>
        <div className="absolute top-[75%] right-[15%] text-[#d4af37]/60 text-2xl">✧</div>
      </div>

      {/* CONTINUOUS FALLING ELEGANT SPARKLES IN BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {cupcakes.map(cup => (
          <div
            key={cup.id}
            className="absolute top-[-40px] text-xs sm:text-sm text-amber-400/80 pointer-events-none select-none animate-fall"
            style={{
              left: `${cup.left}%`,
              animationDuration: `${cup.speed + 1}s`,
              transform: `rotate(${cup.rot}deg)`
            }}
          >
            ✧
          </div>
        ))}

        {sparkles.map(sp => (
          <div
            key={sp.id}
            className="absolute bottom-[20px] bg-[#ffd1dc] rounded-full pointer-events-none select-none animate-floatSparkle"
            style={{
              left: `${sp.left}%`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* =============== 1. INTRO / LANDING VIEW =============== */}
        {currentTab === 'landing' && (
          <motion.div
            key="landing"
            className="fixed inset-0 bg-gradient-to-br from-[#ffffff] via-[#fffbfa] to-[#fff0f3] flex flex-col justify-center items-center text-center cursor-pointer overflow-hidden z-50 px-4"
            title="Cliquez n'importe où pour passer de suite au menu"
            onClick={triggerSkip}
            initial={{ opacity: 1 }}
            animate={{ opacity: transitioning ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md w-full flex flex-col items-center gap-6 select-none z-10">
              
              {/* Corrected Rounded Logo directly mirroring user preference */}
              <div className="relative w-44 h-44 sm:w-52 h-52 animate-logoIn">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-white relative">
                  <img
                    id="intro-brand-logo"
                    src={resolveImgSrc(brandLogo)}
                    alt={`Logo ${brandName}`}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                </div>
                {/* Visual sparkles around logo */}
                <div className="absolute -top-3 -right-3 text-2xl animate-spin text-amber-400">✨</div>
                <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse text-amber-500">✦</div>
              </div>

              {/* Title Calligraphy font matching "Great Vibes" perfectly */}
              <div>
                <h1 className="font-vibes text-5xl sm:text-7.5xl text-[#b76e79] drop-shadow-sm select-none leading-none pt-2">
                  {brandName}
                </h1>
                <p className="font-serif text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#a0747a] mt-2">
                  L'Art de la Haute Pâtisserie &amp; Chocolaterie
                </p>
              </div>

              {/* CUTE DRAWN VECTOR HEART WITH HEARTBEAT EFFECT */}
              <svg 
                className="w-24 h-24 sm:w-32 h-32 fill-none stroke-[#b76e79] stroke-[12] stroke-linecap-round stroke-linejoin-round animate-drawHeartAndPulse drop-shadow-md mt-2" 
                viewBox="0 0 512 512"
              >
                <path d="M256 460
                  C180 420, 90 340, 110 240
                  C125 170, 190 150, 230 180
                  C245 195, 250 210, 256 220
                  C262 210, 267 195, 282 180
                  C322 150, 387 170, 402 240
                  C422 340, 332 420, 256 460Z" 
                />
              </svg>

              <div className="text-[11px] font-mono tracking-widest text-[#b76e79]/80 uppercase mt-4 animate-pulse">
                Accès au Menu en cours • Cliquer pour passer
              </div>
            </div>
          </motion.div>
        )}

        {/* =============== 2. ACTIVE SITE INTERFACES =============== */}
        {currentTab !== 'landing' && (
          <div className="flex-1 flex flex-col z-10">
            
            {/* STICKY LUXURY NAVIGATION */}
            <header className="sticky top-0 bg-[#fff5f7]/95 backdrop-blur-md border-b border-[#ffd1dc] z-40 transition-all duration-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                
                {/* Logo & Calligraphy Signature */}
                <div 
                  className="flex items-center space-x-3 cursor-pointer group"
                  onClick={() => setCurrentTab('landing')}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#b76e79] shadow-sm transform group-hover:scale-105 transition-all duration-300">
                    <img 
                      src={resolveImgSrc(brandLogo)} 
                      alt="Mini Logo" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="font-vibes text-3xl sm:text-4xl text-[#b76e79] select-none leading-none pt-1">
                      {brandName}
                    </h2>
                    <p className="text-[9px] tracking-widest uppercase text-[#9e767c] font-mono">Pâtisserie</p>
                  </div>
                </div>

                {/* Main Nav Items */}
                <div className="hidden md:flex items-center space-x-8">
                  <nav className="flex space-x-8 text-sm font-medium">
                    {[
                      { id: 'menu', label: 'Notre Carte' },
                      { id: 'about', label: 'À Propos' },
                      { id: 'contact', label: 'Nous Contacter' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id as any)}
                        className={`relative py-2 tracking-wider transition-colors duration-200 ${
                          currentTab === tab.id 
                            ? 'text-[#b76e79] font-bold' 
                            : 'text-[#7a5c5f] hover:text-[#b76e79]'
                        }`}
                      >
                        {tab.label}
                        {currentTab === tab.id && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b76e79] rounded-full" />
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Mobile Floating Action Nav */}
                <div className="flex md:hidden space-x-2">
                  <button 
                    onClick={() => setCurrentTab('menu')}
                    className={`p-2 rounded-full ${currentTab === 'menu' ? 'bg-[#ffccd5] text-[#b76e79]' : 'text-[#7a5c5f]'}`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentTab('about')}
                    className={`p-2 rounded-full ${currentTab === 'about' ? 'bg-[#ffccd5] text-[#b76e79]' : 'text-[#7a5c5f]'}`}
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentTab('contact')}
                    className={`p-2 rounded-full ${currentTab === 'contact' ? 'bg-[#ffccd5] text-[#b76e79]' : 'text-[#7a5c5f]'}`}
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* MAIN ROUTER CONTAINER */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* ================= PAGE: OUR INTERACTIVE MENU ================= */}
              {currentTab === 'menu' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Luxury Welcome banner */}
                  <div className="bg-white/80 border border-[#e5c5ca] rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-sm backdrop-blur-md relative overflow-hidden ring-1 ring-amber-200/50">
                    {/* Golden luxury ambient background glows */}
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

                    {/* Elegant luxurious background flower vector */}
                    <div className="absolute right-[-35px] bottom-[-35px] opacity-[0.16] text-[#b76e79] pointer-events-none select-none z-0">
                      <svg className="w-48 h-48 sm:w-64 sm:h-64 fill-none stroke-current stroke-[1]" viewBox="0 0 100 100">
                        <g transform="translate(50, 50)">
                          {/* Inner details / Pistils */}
                          <circle cx="0" cy="0" r="6" className="stroke-current" strokeWidth="0.8" />
                          <circle cx="0" cy="0" r="2" className="fill-[#b76e79]" />
                          
                          {/* 5 beautifully shaped peony/rose petals with organic round curves */}
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(72)" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(144)" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(216)" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(288)" className="stroke-current" strokeWidth="0.8" />

                          {/* Accent round backing lines */}
                          <g transform="rotate(36) scale(0.8)" className="opacity-80">
                            <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" className="stroke-current" strokeWidth="0.6" />
                            <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(72)" className="stroke-current" strokeWidth="0.6" />
                            <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(144)" className="stroke-current" strokeWidth="0.6" />
                            <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(216)" className="stroke-current" strokeWidth="0.6" />
                            <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(288)" className="stroke-current" strokeWidth="0.6" />
                          </g>

                          {/* Radiative pollen lines */}
                          <line x1="0" y1="0" x2="0" y2="-15" className="stroke-current" strokeWidth="0.6" strokeDasharray="1 2" />
                          <line x1="0" y1="0" x2="14" y2="-5" className="stroke-current" strokeWidth="0.6" strokeDasharray="1 2" />
                          <line x1="0" y1="0" x2="9" y2="12" className="stroke-current" strokeWidth="0.6" strokeDasharray="1 2" />
                          <line x1="0" y1="0" x2="-9" y2="12" className="stroke-current" strokeWidth="0.6" strokeDasharray="1 2" />
                          <line x1="0" y1="0" x2="-14" y2="-5" className="stroke-current" strokeWidth="0.6" strokeDasharray="1 2" />
                        </g>
                      </svg>
                    </div>
                    <div className="absolute left-[-25px] top-[-25px] opacity-[0.10] text-[#b76e79] pointer-events-none select-none z-0">
                      <svg className="w-40 h-40 fill-none stroke-current stroke-[1]" viewBox="0 0 100 100">
                        <g transform="translate(50, 50) rotate(15) scale(0.9)">
                          <circle cx="0" cy="0" r="5" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(72)" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(144)" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(216)" className="stroke-current" strokeWidth="0.8" />
                          <path d="M0,0 C-15,-20 -25,-38 0,-45 C25,-38 15,-20 0,0" transform="rotate(288)" className="stroke-current" strokeWidth="0.8" />
                        </g>
                      </svg>
                    </div>

                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-[#fff0f3] border border-amber-300/60 px-4 py-1.5 rounded-full text-[10px] text-[#9c7743] font-serif uppercase tracking-[0.2em] font-semibold relative z-10">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>Haute Couture Pâtissière • Créatrice d'Émotions</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#4d3437] max-w-2xl mx-auto leading-tight relative z-10">
                      nos création de rêve
                    </h1>

                    {/* Sophisticated divider line with gold-toned stars */}
                    <div className="flex items-center justify-center space-x-3 max-w-xs mx-auto py-1 relative z-10">
                      <div className="h-[1px] bg-gradient-to-r from-transparent to-[#e8c3cb] flex-1" />
                      <span className="text-xs text-amber-500/80 tracking-widest leading-none">✦ ✦ ✦</span>
                      <div className="h-[1px] bg-gradient-to-l from-transparent to-[#e8c3cb] flex-1" />
                    </div>

                    <p className="text-xs sm:text-sm text-[#735155] max-w-xl mx-auto leading-relaxed font-light font-serif italic relative z-10">
                      "Chaque création de notre Maison est une pièce d'art éphémère ciselée sur-mesure. Sélectionnez un joyau pâtissier ci-dessous pour personnaliser vos génoises, garnitures et écritures uniques avant de transmettre votre récapitulatif directement à notre Maison."
                    </p>
 
                    {/* Search Field (Ajusté text-base pour empêcher le zoom mobile) */}
                    <div className="max-w-md mx-auto relative pt-4">
                      <Search className="w-4 h-4 text-[#bc9ea2] absolute left-4.5 top-7 font-semibold" />
                      <input 
                        type="text"
                        placeholder="Rechercher par saveur, ingrédient ou nom..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/95 border border-[#e8c3cb] text-base sm:text-sm py-3 pl-11 pr-11 rounded-full focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-serif tracking-wider transition-all placeholder:text-[#bcb2b4] shadow-sm"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3.5 top-4.5 p-1 text-[#ae8c91] hover:text-[#7d3b45]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* French Category Tabs */}
                  <div className="flex space-x-2 overflow-x-auto pb-3 border-b border-[#ffd1dc] scrollbar-thin">
                    {[
                      { id: 'all', label: 'Toutes les douceurs' },
                      { id: 'Cakes', label: 'Cakes' },
                      { id: 'Gâteaux', label: 'Gâteaux' },
                      { id: 'Cupcakes', label: 'Cupcakes' },
                      { id: 'Chocolat personnalisé', label: 'Chocolat personnalisé' },
                      { id: 'Fleur au chocolat', label: 'Fleurs au chocolat' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider whitespace-nowrap uppercase transition-all duration-300 ${
                          selectedCategory === cat.id
                            ? 'bg-[#b76e79] text-white shadow-md'
                            : 'bg-white/80 text-[#7a5c5f] border border-[#ffeed1] hover:bg-[#ffeef2]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setSelectedProduct(prod);
                          setFillings([]);
                        }}
                        className="bg-white/80 rounded-2xl border border-[#ffccd5] p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#b76e79] cursor-pointer group"
                      >
                        <div className="space-y-4">
                          
                          {/* Image Placeholder Frame mimicking high end bakery photo */}
                          <div className="w-full h-44 rounded-xl overflow-hidden bg-[#fffbfb] relative border border-[#ffccd5] flex flex-col items-center justify-center text-center p-4">
                            {/* Real Image loaded from your directory */}
                            <img
                              src={resolveImgSrc(prod.imagePlaceholder)}
                              alt={prod.name}
                              className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                // Gracefully hide the img container if the image doesn't exist yet
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                            {/* Fallback layout shown when image is missing or loading */}
                            <span className="text-4xl text-center group-hover:scale-110 transition-transform duration-300">
                              {prod.category === 'Cakes' || prod.category === 'Gâteaux' ? "\uD83C\uDF82" : 
                               prod.category === 'Cupcakes' ? "\uD83E\uDDC1" : 
                               prod.category === 'Chocolat personnalisé' ? "\uD83C\uDF6B" : "\uD83C\uDF39"}
                            </span>
                            <div className="mt-3 text-[10px] uppercase tracking-wide text-[#b76e79] font-medium">
                              Image: {prod.imagePlaceholder}
                            </div>
                            <div className="text-[9px] text-[#9b757a] italic mt-1 font-serif">
                              {prod.name}
                            </div>
                          </div>

                          {/* Product Meta */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-mono tracking-widest uppercase text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                                {prod.category}
                              </span>
                            </div>
                            <h3 className="text-base font-serif font-bold text-[#4d3437] group-hover:text-[#b76e79] transition-colors">
                              {prod.name}
                            </h3>
                            <p className="text-xs text-[#825c61] leading-relaxed">
                              {prod.description}
                            </p>
                          </div>
                        </div>

                        {/* Order Prompt */}
                        <div className="mt-4 pt-3 border-t border-[#ffeef2] flex items-center justify-between text-[#b76e79] font-medium text-xs group-hover:translate-x-1 transition-transform">
                          <span>Sagesse &amp; Personnaliser</span>
                          <ArrowRight className="w-4 h-4 text-[#b76e79]" />
                        </div>
                      </div>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="col-span-full py-12 text-center text-[#9b757a] font-serif">
                        <p className="text-base">Aucune délicatesse trouvée selon votre recherche.</p>
                        <button 
                          onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                          className="text-xs uppercase text-pink-600 underline mt-2"
                        >
                          Réinitialiser les filtres
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ================= PAGE: ABOUT US / "À PROPOS" ================= */}
              {currentTab === 'about' && (
                <div className="max-w-3xl mx-auto bg-white/80 border border-[#e5c5ca] rounded-3xl p-6 sm:p-10 space-y-6 shadow-md backdrop-blur-md animate-fadeIn ring-1 ring-amber-100/50">
                  <div className="text-center space-y-2">
                    <h1 className="font-vibes text-5xl text-[#b76e79] pt-2">L'Histoire de {brandName}</h1>
                    <p className="font-serif text-[10px] tracking-widest uppercase text-[#9e767c]">Artisanal, Naturel &amp; Raffiné</p>
                  </div>

                  <div className="w-full bg-[#fffcfd] border border-amber-200/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
                    {/* Ringed luxurious logo container */}
                    <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-300 to-amber-500 shadow-md">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img 
                          src={resolveImgSrc(brandLogo)} 
                          alt={`${brandName} Signature Logo`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400";
                          }}
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-amber-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border border-white">✦</div>
                    </div>
                    
                    <div className="mt-4 text-xs font-serif uppercase text-[#9c7743] tracking-[0.2em] font-bold">Notre Signature d'Artisans de Prestige</div>
                    <p className="text-[11px] text-[#825c61] max-w-sm mx-auto italic mt-1 font-serif">
                      "Chaque pièce est sculptée de nos mains d'artisans, alliant noblesse des matières et orfèvrerie créative pour suspendre le temps."
                    </p>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-[#664b4f] leading-relaxed font-light">
                    <p>
                      Bienvenue au cœur du raffinement de **{brandName}**. Notre entreprise est née d'une vision simple : transformer des produits nobles de notre terroir en chefs-d'œuvre de joaillerie pâtissière. Spécialisés dans les gâteaux d'exception, les chocolats monogrammes et les fleurs en chocolat sculptées à la main, nous faisons de chaque bouchée une expérience sensorielle inoubliable.
                    </p>
                    <p>
                      Nos desserts n'ont pas de prix pré-définis car nous croyons au sur-mesure absolu. Chaque commande est une pièce d'art unique, ciselée selon vos souhaits. De la douceur parfumée de nos cupcakes aux décors floraux sculptants de nos assortiments en cacao, nous allions les saveurs subtiles de la pistache, de la framboise fraîche, ou de la ganache fondante à une technique d'une précision chirurgicale.
                    </p>
                    <p>
                      Merci de nous accorder votre confiance pour embellir vos fêtes de famille, fiançailles, mariages ou de simples instantanés gourmands.
                    </p>
                  </div>

                  <div className="border-t border-[#ffd1dc] pt-6 flex justify-between items-center text-xs text-[#a0747a]">
                    <span>Ingrédients 100% Bio</span>
                    <span>•</span>
                    <span>Beurre d'Appellation</span>
                    <span>•</span>
                    <span>Fabrication Artisanale</span>
                  </div>
                </div>
              )}

              {/* ================= PAGE: CONTACT US ================= */}
              {currentTab === 'contact' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-center">
                  <div className="space-y-2">
                    <h1 className="font-vibes text-5xl text-[#b76e79] pt-2">Suivez-nous &amp; Retrouvez-nous</h1>
                    <p className="font-serif text-[10px] tracking-widest uppercase text-[#9e767c]">Suivez nos créations au quotidien</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    
                    {/* Left block: Social links (Facebook & Instagram only) */}
                    <div className="bg-white/75 border border-[#ffccd5] rounded-3xl p-8 shadow-sm backdrop-blur-xs flex flex-col justify-center space-y-8 min-h-[350px]">
                      <h2 className="font-serif text-2xl font-bold text-[#4d3437] mb-2 text-left">Nos Réseaux Sociaux</h2>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {/* Instagram Link Button */}
                        <a 
                          href={instaLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-5 bg-gradient-to-r from-[#ffeef2] to-[#fff5f7] hover:from-[#ffccd5] hover:to-[#ffd1dc] border border-[#ffccd5] rounded-2xl transition-all duration-300 group shadow-sm hover:shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-full text-pink-600 shadow-xs group-hover:scale-105 transition-transform">
                              <svg className="w-6 h-6 fill-current text-[#b76e79]" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-[#4d3437] text-sm">Instagram</p>
                              <p className="text-xs text-[#825c61] font-light">{instaHandle}</p>
                            </div>
                          </div>
                          <span className="text-[#b76e79] font-bold group-hover:translate-x-1 transition-transform">➔</span>
                        </a>

                        {/* Facebook Link Button */}
                        <a 
                          href={fbLink} 
                          target="_blank"  
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-5 bg-gradient-to-r from-[#ffeef2] to-[#fff5f7] hover:from-[#ffccd5] hover:to-[#ffd1dc] border border-[#ffccd5] rounded-2xl transition-all duration-300 group shadow-sm hover:shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-full text-pink-600 shadow-xs group-hover:scale-105 transition-transform">
                              <svg className="w-6 h-6 fill-current text-[#b76e79]" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-[#4d3437] text-sm">Facebook</p>
                              <p className="text-xs text-[#825c61] font-light">{fbHandle}</p>
                            </div>
                          </div>
                          <span className="text-[#b76e79] font-bold group-hover:translate-x-1 transition-transform">➔</span>
                        </a>
                      </div>

                      <div className="pt-2 text-xs text-[#825c61] text-left leading-relaxed">
                        Retrouvez nos plus prestigieuses confections de gâteaux, notre atelier et nos coulisses artistiques directement en ligne !
                      </div>
                    </div>

                    {/* Right block: Live Google Map Point */}
                    <div className="bg-white/75 border border-[#ffccd5] rounded-3xl p-5 shadow-sm backdrop-blur-xs flex flex-col justify-between min-h-[380px] space-y-4">
                      <div className="text-left">
                        <h2 className="font-serif text-2xl font-bold text-[#4d3437] mb-1">Notre Emplacement</h2>
                        <p className="text-xs text-[#825c61]">Retrouvez notre atelier d'art culinaire à Béni Saf</p>
                      </div>

                      <div className="flex-1 rounded-2xl overflow-hidden relative border border-[#ffccd5] min-h-[220px]">
                        <iframe 
                          src="https://maps.google.com/maps?q=Beni%20Saf%2C%20Algeria&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0, minHeight: "220px" }} 
                          allowFullScreen={false} 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          title="World's Savoury Beni Saf"
                        />
                      </div>

                      <a 
                        href="https://share.google/Db0AfpQq43n0VyLFz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#ffeef2] to-[#fff5f7] hover:from-[#ffccd5] hover:to-[#ffd1dc] border border-[#ffccd5] rounded-2xl transition-all duration-300 font-bold text-xs text-[#b76e79] shadow-sm hover:shadow"
                      >
                        <MapPin className="w-4 h-4 text-[#b76e79] animate-pulse" />
                        <span>Ouvrir dans Google Maps</span>
                      </a>
                    </div>

                  </div>
                </div>
              )}

            </main>

            {/* SEAMLESS DIALOG FOR CUSTOM ORDERING (SUPABASE INSERT MODAL POPUP) */}
            <AnimatePresence>
              {selectedProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                  <motion.div 
                    className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#ffccd5] shadow-2xl relative overflow-y-auto max-h-[90vh]"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                  >
                    {/* Close button */}
                    <button 
                      onClick={() => setSelectedProduct(null)}
                      className="absolute top-4 right-4 text-[#a38f8f] hover:text-[#5c4a4a] transition-colors p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center space-y-1.5 mb-5 select-none">
                      <span className="text-4xl">
                        {selectedProduct.category === 'Cakes' || selectedProduct.category === 'Gâteaux' ? "\uD83C\uDF82" : 
                         selectedProduct.category === 'Cupcakes' ? "\uD83E\uDDC1" : 
                         selectedProduct.category === 'Chocolat personnalisé' ? "\uD83C\uDF6B" : "\uD83C\uDF39"}
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#4d3437]">{selectedProduct.name}</h3>
                      <p className="text-[10px] font-mono tracking-widest uppercase text-[#b76e79]">{selectedProduct.category}</p>
                      <p className="text-[11px] text-[#825c61] max-w-sm mx-auto italic mt-1 leading-normal">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {/* Interactive Custom Order Form */}
                    {isSupabasePlaceholder() && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-xs space-y-1 mb-4">
                        <p className="font-bold flex items-center gap-1">⚠️ Paramétrage Supabase requis</p>
                        <p className="text-[11px] leading-relaxed opacity-90 font-sans">
                          Pour que vos commandes soient enregistrées dans votre base de données, n'oubliez pas d'ajouter les clés d'environnement réelles <strong>VITE_SUPABASE_URL</strong> et <strong>VITE_SUPABASE_ANON_KEY</strong> dans les variables d'environnement (Secrets) de votre hébergement ou de l'éditeur de code.
                        </p>
                      </div>
                    )}
                    <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs">
                      
                      {/* Name entry (Required) - text-base sur mobile pour empêcher le zoom */}
                      <div>
                        <label className="block font-medium text-[#7d5257] mb-1">Votre Nom &amp; Prénom *</label>
                        <input 
                          type="text" 
                          name="Nom Complet"
                          required 
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Marie Lambert" 
                          className="w-full bg-[#fffbfb] border border-[#ffccd5] rounded-xl p-3 text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-[#b76e79] focus:border-[#b76e79]"
                        />
                      </div>

                      {/* Phone Number entry (Required) - text-base sur mobile pour empêcher le zoom */}
                      <div>
                        <label className="block font-medium text-[#7d5257] mb-1">Votre Numéro de Téléphone *</label>
                        <input 
                          type="tel" 
                          name="Téléphone"
                          required 
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Ex: +213 6 57 93 65 84" 
                          className="w-full bg-[#fffbfb] border border-[#ffccd5] rounded-xl p-3 text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-[#b76e79] focus:border-[#b76e79]"
                        />
                      </div>

                      {/* Cake Specific Selection */}
                      {selectedProduct.category === 'Cakes' && (
                        <div className="space-y-3 bg-[#fff0f3] p-4 rounded-2xl border border-[#ffd1dc]">
                          <p className="font-bold text-[#7d3b45] font-serif uppercase tracking-wider text-[10px]">
                            Options de personnalisation du Gâteau
                          </p>

                          {/* Genoise selection (Radio buttons) */}
                          <div>
                            <label className="block text-[#704d51] mb-1.5 font-medium">1. Choisissez votre Génoise :</label>
                            <div className="flex space-x-4">
                              <label className="flex items-center space-x-2 cursor-pointer bg-white py-1.5 px-3 rounded-lg border border-[#ffccd5] text-[#4d3437]">
                                <input 
                                  type="radio" 
                                  name="Choix Génoise" 
                                  checked={spongeChoice === 'vanille'}
                                  onChange={() => setSpongeChoice('vanille')}
                                  value="Vanille"
                                  className="accent-pink-600" 
                                />
                                <span>G{"\u00E9"}noise Vanille {"\uD83C\uDF3C"}</span>
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer bg-white py-1.5 px-3 rounded-lg border border-[#ffccd5] text-[#4d3437]">
                                <input 
                                  type="radio" 
                                  name="Choix Génoise" 
                                  checked={spongeChoice === 'chocolat'}
                                  onChange={() => setSpongeChoice('chocolat')}
                                  value="Chocolat"
                                  className="accent-pink-600" 
                                />
                                <span>G{"\u00E9"}noise Chocolat {"\uD83C\uDF6B"}</span>
                              </label>
                            </div>
                          </div>

                          {/* Fillings Selection (Multiple choice Checkboxes as requested) */}
                          <div>
                            <label className="block text-[#704d51] mb-1.5 font-medium">
                              2. Choisissez votre garniture intérieure (plusieurs choix possibles) :
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {AVAILABLE_FILLINGS.map(fill => (
                                <label 
                                  key={fill.id} 
                                  className="flex items-center space-x-2 bg-white py-2 px-3 rounded-lg border border-[#ffccd5] cursor-pointer hover:bg-pink-50 transition-colors"
                                >
                                  <input 
                                    type="checkbox" 
                                    name="Garnitures"
                                    value={fill.label}
                                    checked={fillings.includes(fill.label)}
                                    onChange={() => toggleFilling(fill.label)}
                                    className="rounded border-[#ffccd5] text-pink-600 focus:ring-pink-500 accent-pink-600"
                                  />
                                  <span className="text-xs text-[#4d3437]">{fill.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Writing check/text over cake - text-base sur mobile pour empêcher le zoom */}
                          <div>
                            <label className="block text-[#704d51] mb-1 font-medium">
                              3. Inscription ou remarque à écrire sur le gâteau :
                            </label>
                            <input 
                              type="text" 
                              name="Texte sur le Gâteau"
                              value={cakeText}
                              onChange={(e) => setCakeText(e.target.value)}
                              placeholder="Ex: 'Joyeux Anniversaire Lucie'" 
                              className="w-full bg-white border border-[#ffccd5] rounded-lg p-2 text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-[#b76e79]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Delivery choice (Applies to all) */}
                      <div>
                        <label className="block font-medium text-[#7d5257] mb-1">Mode de Récupération *</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer bg-[#fffbfb] py-2 px-4 rounded-xl border border-[#ffccd5] text-[#4d3437] flex-1">
                            <input 
                              type="radio" 
                              name="Mode de Récupération" 
                              value="Livraison"
                              checked={deliveryMethod === 'Livraison'}
                              onChange={() => setDeliveryMethod('Livraison')}
                              className="accent-pink-600" 
                            />
                            <span>🚗 Livraison à domicile</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer bg-[#fffbfb] py-2 px-4 rounded-xl border border-[#ffccd5] text-[#4d3437] flex-1">
                            <input 
                              type="radio" 
                              name="Mode de Récupération" 
                              value="Retrait la maison"
                              checked={deliveryMethod === 'Retrait la maison'}
                              onChange={() => setDeliveryMethod('Retrait la maison')}
                              className="accent-pink-600" 
                            />
                            <span>🏡 Retrait à la maison</span>
                          </label>
                        </div>
                      </div>

                      {/* Remark / Message details - text-base sur mobile pour empêcher le zoom */}
                      <div>
                        <label className="block font-medium text-[#7d5257] mb-1">
                          Remarque spéciale, spécification ou texte de carte :
                        </label>
                        <textarea 
                          name="Note Spéciale"
                          value={clientRemark}
                          onChange={(e) => setClientRemark(e.target.value)}
                          placeholder="Spécifiez des allergies, vos préférences d'emballage cadeau, ou d'autres souhaits..." 
                          className="w-full bg-[#fffbfb] border border-[#ffccd5] rounded-xl p-3 h-16 text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-[#b76e79] resize-none"
                        />
                      </div>

                      {/* Submit */}
                      <button 
                        type="submit"
                        disabled={isSending}
                        className="w-full bg-[#b76e79] hover:bg-[#a05a65] disabled:bg-[#d8babc] text-white py-3.5 px-6 rounded-full font-serif uppercase tracking-widest text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer text-center pt-3 pb-3 mt-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSending ? "Envoi en cours..." : "Commander"}</span>
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* THANK YOU POPUP MODAL */}
            <AnimatePresence>
              {showThankYou && (
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[60] p-4 cursor-pointer"
                  onClick={() => setShowThankYou(false)}
                >
                  <motion.div 
                    className="bg-white rounded-3xl max-w-sm w-full p-8 border border-[#ffccd5] shadow-2xl relative overflow-hidden text-center cursor-default"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Small close action at corner */}
                    <button 
                      onClick={() => setShowThankYou(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                      id="close-thankyou-top-btn"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Decorative elegant background elements */}
                    <div className="absolute -right-10 -bottom-10 opacity-[0.05] text-[#b76e79] pointer-events-none select-none">
                      <Sparkles className="w-32 h-32" />
                    </div>

                    {/* Content */}
                    <div className="space-y-5 py-2">
                      {/* Animating sweet pink heart icon */}
                      <div className="mx-auto w-16 h-16 bg-[#fff0f3] rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-4xl">{"\uD83D\uDC96"}</span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#4d3437] leading-tight">Merci, {thankYouClientName}</h3>
                      
                      <div className="space-y-3">
                        <p className="text-sm text-[#825c61] leading-relaxed font-medium">
                          Nous avons bien reçu votre commande.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* SIMPLE AND CUTE PINK ERROR POPUP */}
            <AnimatePresence>
              {submissionError && (
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[60] p-4"
                  onClick={() => setSubmissionError(null)}
                >
                  <motion.div 
                    className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#ffd1dc] shadow-xl relative overflow-hidden text-center cursor-default"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => setSubmissionError(null)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b76e79]">
                      <Info className="w-6 h-6" />
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#4d3437] mb-2">
                      Oups ! Une erreur est survenue
                    </h3>
                    
                    <p className="text-xs text-[#825c61] leading-relaxed mb-6">
                      {submissionError}
                    </p>

                    <button
                      onClick={() => setSubmissionError(null)}
                      className="w-full bg-[#b76e79] hover:bg-[#80424b] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      Fermer
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* AESTHETIC REUSABLE ROSE BANNER FOOTER */}
            <footer className="mt-12 bg-[#fff5f7] border-t border-[#ffd1dc] py-8 text-center text-[#9b7379] text-xs font-serif tracking-widest">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col items-center sm:items-start space-y-2">
                  <p>© 2026 {brandName} • L'excellence et le plaisir sur-mesure</p>
                  <div className="flex items-center space-x-3 justify-center sm:justify-start">
                    <a href={fbLink} target="_blank" rel="noopener noreferrer" className="text-[#b76e79] hover:text-[#80424b] transition-all" title="Facebook">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    </a>
                    <a href={instaLink} target="_blank" rel="noopener noreferrer" className="text-[#b76e79] hover:text-[#80424b] transition-all" title="Instagram">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-end space-y-2">
                  <div className="flex space-x-4">
                    <a href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('landing'); }} className="hover:text-[#b76e79] transition-colors leading-none">Revoir l'introduction</a>
                    <span>•</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('contact'); }} className="hover:text-[#b76e79] transition-colors leading-none">Commander un événement</a>
                  </div>
                  <p className="text-[10px] text-[#b76e79]/80 font-sans tracking-normal pt-1">Designed by <span className="font-semibold text-[#80424b]">azzi israa</span></p>
                </div>
              </div>
            </footer>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

