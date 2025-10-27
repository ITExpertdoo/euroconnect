import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Crown, Star, TrendingUp, MapPin, Euro, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BillboardAdsProps {
  onNavigate?: (page: string) => void;
}

export function BillboardAds({ onNavigate }: BillboardAdsProps) {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Horizontal ticker data
  const messages = [
    "🔥 NOVO: 150+ novih poslova u Nemačkoj",
    "⭐ Premium korisnici dobijaju 3x više odgovora",
    "🇩🇪 Nemačka traži 500+ građevinskih radnika",
    "💰 Prosječna plata u EU: €3,200/mjesec",
    "🎯 95% naših kandidata dobije ponudu u 30 dana",
    "🏆 #1 platforma za posao u EU za Balkan",
    "📱 Nova mobilna aplikacija dostupna",
    "🔐 Premium plan: Prva 2 sedmice BESPLATNO"
  ];

  // Carousel banners
  const banners = [
    {
      id: 1,
      title: "Nemačka traži IT stručnjake",
      subtitle: "Do €6,500 mjesečno + relokacija paket",
      description: "Preko 200 IT pozicija dostupno. Visa podrška uključena.",
      image: "https://images.unsplash.com/photo-1673977597037-f0373625156e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMGV1cm9wZXxlbnwxfHx8fDE3NTgwMjk5NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      cta: "Pregledaj IT poslove",
      type: "premium",
      color: "from-blue-600 to-blue-800"
    },
    {
      id: 2,
      title: "Austrija - Sezonski poslovi",
      subtitle: "Turizam i hotelijerstvo",
      description: "Zimska sezona 2024. Smještaj + hrana osigurani.",
      image: "https://images.unsplash.com/photo-1757347809299-dd7970c99d8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjB3b3JrcGxhY2UlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzU4MTAxMjA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      cta: "Prijavi se odmah",
      type: "urgent",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 3,
      title: "Holandija - Zdravstvo",
      subtitle: "Medicinske sestre i tehničari",
      description: "Hitno potrebno. Holandski jezik nije obavezan.",
      image: "https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3JrZXJzJTIwdGVhbSUyMG9mZmljZXxlbnwxfHx8fDE3NTgxMDEyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      cta: "Saznaj više",
      type: "featured",
      color: "from-green-600 to-emerald-700"
    },
    {
      id: 4,
      title: "PREMIUM PLAN - 50% popust",
      subtitle: "Ograničena ponuda do kraja mjeseca",
      description: "Pristup ekskluzivnim poslovima. Garantovana podrška.",
      image: null,
      cta: "Aktiviraj Premium",
      type: "promotion",
      color: "from-purple-600 to-pink-600"
    },
    {
      id: 5,
      title: "Švicarska - Visoke plate",
      subtitle: "€4,000-€7,000 mjesečno",
      description: "Ugostiteljstvo, čišćenje, transport. Njemački nije obavezan.",
      image: "https://images.unsplash.com/photo-1599513354687-47bb8aa17ff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW55JTIwZmxhZyUyMGF1c3RyaWElMjBuZXRoZXJsYW5kc3xlbnwxfHx8fDE3NTgxMDEyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      cta: "Vidi pozicije",
      type: "hot",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const getBadgeForType = (type: string) => {
    switch (type) {
      case 'premium':
        return <Badge className="bg-[#F2C230] text-primary"><Crown className="w-3 h-3 mr-1" />Premium</Badge>;
      case 'urgent':
        return <Badge className="bg-red-500 text-white"><Clock className="w-3 h-3 mr-1" />Hitno</Badge>;
      case 'featured':
        return <Badge className="bg-green-500 text-white"><Star className="w-3 h-3 mr-1" />Izdvojeno</Badge>;
      case 'promotion':
        return <Badge className="bg-purple-500 text-white"><TrendingUp className="w-3 h-3 mr-1" />Promocija</Badge>;
      case 'hot':
        return <Badge className="bg-orange-500 text-white">🔥 Popularno</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (user?.role === 'candidate') {
                onNavigate?.('candidate-dashboard');
              } else if (user?.role === 'employer') {
                onNavigate?.('employer-dashboard');
              } else {
                onNavigate?.('landing');
              }
            }}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazad
          </Button>
          
          <h1 className="text-3xl font-bold text-primary">Billboard & Promocije</h1>
          <p className="text-gray-600 mt-2">Najnovije promocije i istaknuti oglasi za posao</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Option 1: Horizontal Ticker */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-secondary text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="py-3 px-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#F2C230]" />
                <span className="font-semibold">Najnovije vijesti</span>
              </div>
              <div className="overflow-hidden">
                <div className="animate-scroll whitespace-nowrap">
                  {messages.concat(messages).map((item, index) => (
                    <span key={index} className="inline-block mr-12 text-sm opacity-90">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 2: Central Carousel/Slider */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-96">
              {/* Carousel Content */}
              <div className="relative h-full">
                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                      index === currentSlide ? 'translate-x-0' : 
                      index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                    }`}
                  >
                    <div className={`h-full bg-gradient-to-r ${banner.color} relative overflow-hidden`}>
                      {/* Background Image */}
                      {banner.image && (
                        <div className="absolute inset-0">
                          <img 
                            src={banner.image} 
                            alt={banner.title}
                            className="w-full h-full object-cover opacity-30"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex items-center">
                        <div className="container mx-auto px-6 text-white">
                          <div className="max-w-2xl">
                            <div className="mb-4">
                              {getBadgeForType(banner.type)}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h2>
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 opacity-90">{banner.subtitle}</h3>
                            <p className="text-lg mb-6 opacity-80">{banner.description}</p>
                            <Button 
                              size="lg" 
                              className="text-lg px-8 py-4"
                              style={{ 
                                backgroundColor: banner.type === 'promotion' ? '#F2C230' : '#ffffff', 
                                color: banner.type === 'promotion' ? '#0E395C' : '#0E395C'
                              }}
                            >
                              {banner.cta}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Timer Bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-[#F2C230] transition-all duration-5000 ease-linear"
                   style={{ width: `${((currentSlide + 1) / banners.length) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Featured Job Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Vozač kamiona - C kategorija",
              company: "TransEuro Logistics",
              location: "Beč, Austrija",
              salary: "€3,200-3,800",
              highlight: "Smještaj uključen",
              urgent: true
            },
            {
              title: "Kuhar u restoranu",
              company: "Restaurant Group Berlin",
              location: "Berlin, Nemačka",
              salary: "€2,800-3,200",
              highlight: "Bez iskustva",
              premium: true
            },
            {
              title: "Čistačica u bolnici",
              company: "Medical Center Amsterdam",
              location: "Amsterdam, Holandija",
              salary: "€2,500-2,900",
              highlight: "Noćne smjene",
              featured: true
            }
          ].map((job, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${
              job.urgent ? 'border-red-200 bg-red-50' :
              job.premium ? 'border-yellow-200 bg-yellow-50' :
              job.featured ? 'border-green-200 bg-green-50' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  {job.urgent && <Badge className="bg-red-500 text-white">Hitno</Badge>}
                  {job.premium && <Badge className="bg-[#F2C230] text-primary"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
                  {job.featured && <Badge className="bg-green-500 text-white"><Star className="w-3 h-3 mr-1" />Top</Badge>}
                </div>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Euro className="w-3 h-3" />
                    {job.salary}
                  </span>
                </div>
                <div className="mb-4">
                  <Badge variant="secondary">{job.highlight}</Badge>
                </div>
                <Button className="w-full" style={{ backgroundColor: '#F2C230', color: '#0E395C' }}>
                  Prijavi se odmah
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Promotional Banners */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Besplatan CV pregled</h3>
              <p className="mb-4 opacity-90">Naši HR eksperti će pregledati vaš CV i dati savjete za poboljšanje.</p>
              <Button variant="secondary">Pošaljite CV</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Webinar: Kako dobiti posao u EU</h3>
              <p className="mb-4 opacity-90">Pridružite se našem besplatnom webinaru 25. januar u 19:00.</p>
              <Button variant="secondary">Rezervišite mjesto</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}