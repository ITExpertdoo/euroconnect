import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Poruka je uspešno poslata! Javićemo Vam se uskoro.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-primary mb-4">Kontaktirajte Nas</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Imate pitanja ili trebate pomoć? Tu smo da Vam pomognemo. 
            Kontaktirajte nas i odgovorićemo što prije.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Contact Info and Form */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-primary mb-6">Kontakt Informacije</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Adresa</p>
                    <p className="text-primary">
                      Jurija Gagarina 133<br />
                      11070 Novi Beograd, Srbija
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Telefon</p>
                    <p className="text-primary">+381 11 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-primary">info@euroconnect.eu</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Radno vreme</p>
                    <p className="text-primary">
                      Pon - Pet: 09:00 - 17:00<br />
                      Sub - Ned: Zatvoreno
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-primary mb-6">Pošaljite Nam Poruku</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Ime i prezime</Label>
                  <Input
                    id="contact-name"
                    placeholder="Vaše ime"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-email">Email adresa</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="vas.email@primer.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-subject">Predmet</Label>
                  <Input
                    id="contact-subject"
                    placeholder="O čemu se radi?"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-message">Poruka</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Vaša poruka..."
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-pulse" />
                      Šalje se...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Pošalji Poruku
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column - Map Only */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full min-h-[700px] lg:min-h-[800px]">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=20.403%2C44.815%2C20.413%2C44.821&layer=mapnik&marker=44.818%2C20.408"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Lokacija EuroConnect Europe"
            />
            <div className="p-4 bg-gray-50 border-t">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jurija+Gagarina+133+Novi+Beograd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Otvori u Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}