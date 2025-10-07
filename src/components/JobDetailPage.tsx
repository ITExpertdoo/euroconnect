import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Euro, 
  Calendar, 
  Users, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Mail, 
  Phone, 
  Upload,
  Globe,
  Shield,
  Star,
  Heart,
  Share2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock job data
const mockJob = {
  id: 1,
  title: 'CNC Operater',
  company: 'Precision Manufacturing GmbH',
  companyLogo: '🏭',
  location: 'Stuttgart, Nemačka',
  country: 'Nemačka',
  salary: '€2,800 - €3,500',
  employmentType: 'Puno radno vreme',
  category: 'Proizvodnja',
  postedDate: '5. oktobar 2025',
  expiryDate: '5. novembar 2025',
  verified: true,
  premium: true,
  applicants: 23,
  views: 156,
  description: `Precision Manufacturing GmbH, vodeći proizvođač preciznih delova za automobilsku industriju, traži iskusnog CNC operatera za naš proizvodni pogon u Stuttgartu.

Ovo je odlična prilika za radnike sa Balkana da steknu iskustvo u nemačkoj industriji sa stabilnim ugovorom i odličnim beneficijama.`,
  responsibilities: [
    'Rukovanje CNC mašinama za proizvodnju preciznih metalnih delova',
    'Programiranje i podešavanje CNC mašina prema tehničkim crtežima',
    'Kontrola kvaliteta proizvedenih delova',
    'Održavanje mašina i radnog prostora',
    'Saradnja sa timom i izveštavanje supervizoru',
    'Poštovanje sigurnosnih standarda i procedura'
  ],
  requirements: [
    'Minimum 2 godine iskustva kao CNC operater',
    'Poznavanje rada sa CNC glodalicama i stругovima',
    'Sposobnost čitanja tehničkih crteža',
    'Osnovni nivo nemačkog jezika (A2) ili spremnost za učenje',
    'Tehnička diploma ili završena strukovna škola',
    'Preciznost i pažnja na detalje'
  ],
  benefits: [
    'Neto plata od €2,800 do €3,500 mesečno',
    'Potpuno legalan rad sa EU radnom dozvolom',
    'Besplatno smeštaj prvih 3 meseca',
    'Zdravstveno osiguranje i penziono',
    'Plaćeni odmor (30 dana godišnje)',
    'Obuka na radnom mestu',
    'Mogućnost napredovanja i povećanja plate',
    'Pomoć sa dokumentacijom i relokacijom'
  ],
  companyInfo: {
    name: 'Precision Manufacturing GmbH',
    industry: 'Proizvodnja preciznih delova',
    employees: '200-500',
    founded: '1987',
    website: 'www.precision-mfg.de',
    description: 'Precision Manufacturing GmbH je porodična kompanija sa dugom tradicijom u proizvodnji preciznih metalnih delova za vodeće automobilske brendove. Poznat smo po našoj predanosti kvalitetu, inovacijama i brizi o zaposlenima.'
  }
};

export function JobDetailPage() {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    cvFile: null as File | null
  });

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Posao uklonjen iz sačuvanih' : 'Posao sačuvan');
  };

  const handleShareJob = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link kopiran u clipboard');
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationData.cvFile) {
      toast.error('Molimo priložite CV');
      return;
    }
    toast.success('Vaša aplikacija je uspešno poslata!');
    setIsApplyDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => window.history.back()}
            >
              ← Nazad na rezultate
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-3xl">{mockJob.companyLogo}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-2xl">{mockJob.title}</CardTitle>
                        {mockJob.verified && (
                          <Badge variant="default" className="bg-secondary gap-1">
                            <Shield className="w-3 h-3" />
                            Verifikovan
                          </Badge>
                        )}
                        {mockJob.premium && (
                          <Badge className="bg-gold text-gold-foreground gap-1">
                            <Star className="w-3 h-3" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2 mb-3">
                        <Building2 className="w-4 h-4" />
                        {mockJob.company}
                      </CardDescription>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{mockJob.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="w-4 h-4" />
                          <span>{mockJob.employmentType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Euro className="w-4 h-4" />
                          <span>{mockJob.salary}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                        Aplicirana za ovu poziciju
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Aplicirana za: {mockJob.title}</DialogTitle>
                        <DialogDescription>
                          Popunite formu ispod da pošaljete vašu aplikaciju
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitApplication} className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Puno ime *</Label>
                          <Input
                            id="fullName"
                            required
                            value={applicationData.fullName}
                            onChange={(e) => setApplicationData({...applicationData, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={applicationData.email}
                            onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefon *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={applicationData.phone}
                            onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cv">CV / Biografija *</Label>
                          <Input
                            id="cv"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            required
                            onChange={(e) => setApplicationData({...applicationData, cvFile: e.target.files?.[0] || null})}
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            PDF, DOC ili DOCX (max 5MB)
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="coverLetter">Kratka poruka (opcionalno)</Label>
                          <Textarea
                            id="coverLetter"
                            rows={5}
                            placeholder="Napišite kratku poruku poslodavcu..."
                            value={applicationData.coverLetter}
                            onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button type="submit" className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90">
                            <Mail className="w-4 h-4 mr-2" />
                            Pošalji aplikaciju
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsApplyDialogOpen(false)}
                          >
                            Otkaži
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleSaveJob}
                    className={isSaved ? 'border-gold text-gold' : ''}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Sačuvano' : 'Sačuvaj'}
                  </Button>
                  
                  <Button variant="outline" size="lg" onClick={handleShareJob}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Podeli
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Objavljeno: {mockJob.postedDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Ističe: {mockJob.expiryDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {mockJob.applicants} aplikacija
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Opis posla
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-line">{mockJob.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Odgovornosti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockJob.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Zahtevi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockJob.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-gold/20 bg-gold/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold-foreground">
                  <Star className="w-5 h-5 text-gold" />
                  Beneficije
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockJob.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>O kompaniji</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2">{mockJob.companyInfo.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {mockJob.companyInfo.description}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Industrija:</span>
                    <span>{mockJob.companyInfo.industry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Zaposleni:</span>
                    <span>{mockJob.companyInfo.employees}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Osnovan:</span>
                    <span>{mockJob.companyInfo.founded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href="#" className="text-secondary hover:underline">
                      {mockJob.companyInfo.website}
                    </a>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Building2 className="w-4 h-4 mr-2" />
                  Vidi sve poslove
                </Button>
              </CardContent>
            </Card>

            {/* Quick Apply Card */}
            <Card className="bg-primary text-white">
              <CardHeader>
                <CardTitle className="text-white">Brza aplikacija</CardTitle>
                <CardDescription className="text-white/80">
                  Apliciranje traje manje od 2 minuta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                  onClick={() => setIsApplyDialogOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Aplicirana sada
                </Button>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-secondary">Saveti za aplikaciju</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <p>Proverite da li vaš CV sadrži sve relevantne informacije</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <p>Napišite personalizovanu poruku poslodavcu</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <p>Istaknite kako vaše iskustvo odgovara zahtevima</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <p>Budite jasni i profesionalni u komunikaciji</p>
                </div>
              </CardContent>
            </Card>

            {/* Report Card */}
            <Card>
              <CardContent className="pt-6">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Prijavi ovaj oglas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
