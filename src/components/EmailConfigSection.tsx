import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  CheckCircle,
  Settings,
  Eye,
  EyeOff,
  Save,
  Loader2,
  FileText,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { ResetLinkModal } from './ResetLinkModal';

interface EmailConfigSectionProps {
  emailConfig: any;
  emailForm: {
    provider: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
    enabled: boolean;
    // EmailJS specific fields
    serviceId?: string;
    templateId?: string;
    publicKey?: string;
    // App URL for reset links
    appUrl?: string;
  };
  setEmailForm: (form: any) => void;
  showApiKey: boolean;
  setShowApiKey: (show: boolean) => void;
  savingEmail: boolean;
  handleSaveEmailConfig: () => void;
  handleTestEmail: () => void;
  onOpenResetModal?: (token: string) => void; // New callback for opening reset modal
}

export function EmailConfigSection({
  emailConfig,
  emailForm,
  setEmailForm,
  showApiKey,
  setShowApiKey,
  savingEmail,
  handleSaveEmailConfig,
  handleTestEmail,
  onOpenResetModal,
}: EmailConfigSectionProps) {
  const [showResetLinkModal, setShowResetLinkModal] = React.useState(false);
  const [resetLink, setResetLink] = React.useState('');
  const [currentResetToken, setCurrentResetToken] = React.useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-secondary">
        <FileText className="w-5 h-5 text-secondary" />
        <h3 className="text-xl font-semibold text-secondary">Email Notifikacije</h3>
      </div>
      
      {/* Current Email Status Card */}
      <Card className={
        emailConfig?.enabled && emailConfig?.fromEmail?.includes('@euroconnect.eu')
          ? 'border-red-200 bg-red-50'
          : emailConfig?.enabled 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 bg-gray-50'
      }>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {emailConfig?.enabled && emailConfig?.fromEmail?.includes('@euroconnect.eu') ? (
                <Settings className="w-6 h-6 text-red-600" />
              ) : emailConfig?.enabled ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Settings className="w-6 h-6 text-gray-600" />
              )}
              <div>
                <h3 className={`font-semibold ${
                  emailConfig?.enabled && emailConfig?.fromEmail?.includes('@euroconnect.eu')
                    ? 'text-red-900'
                    : emailConfig?.enabled 
                    ? 'text-green-900' 
                    : 'text-gray-900'
                }`}>
                  {emailConfig?.enabled && emailConfig?.fromEmail?.includes('@euroconnect.eu')
                    ? '⚠️ Email Domena Nije Verifikovana'
                    : emailConfig?.enabled 
                    ? 'Email Notifikacije Aktivne' 
                    : 'Email Nije Konfigurisan'
                  }
                </h3>
                <p className={`text-sm ${
                  emailConfig?.enabled && emailConfig?.fromEmail?.includes('@euroconnect.eu')
                    ? 'text-red-700'
                    : emailConfig?.enabled 
                    ? 'text-green-700' 
                    : 'text-gray-700'
                }`}>
                  {emailConfig?.enabled && emailConfig?.fromEmail?.includes('@euroconnect.eu')
                    ? `⚠️ ${emailConfig.fromEmail} - Promeni na @euroconnectbg.com`
                    : emailConfig?.enabled 
                    ? `Provider: ${emailConfig.provider?.toUpperCase() || 'N/A'} | Od: ${emailConfig.fromEmail}` 
                    : 'Konfiguriši email servis za automatske notifikacije'
                  }
                </p>
              </div>
            </div>
            <Badge variant={
              emailConfig?.enabled && emailConfig?.fromEmail?.includes('@euroconnect.eu')
                ? 'destructive'
                : emailConfig?.enabled 
                ? 'default' 
                : 'secondary'
            } className="text-sm">
              {emailConfig?.enabled && emailConfig?.fromEmail?.includes('@euroconnect.eu')
                ? 'Invalid Domain'
                : emailConfig?.enabled 
                ? 'Enabled' 
                : 'Disabled'
              }
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Email Servis Konfiguracija</CardTitle>
          <p className="text-sm text-gray-600">
            Konfiguriši Resend ili SendGrid za slanje automatskih email notifikacija.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Provider
            </label>
            <select
              value={emailForm.provider}
              onChange={(e) => setEmailForm({ ...emailForm, provider: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="resend">Resend (Preporučeno - Server Ready)</option>
              <option value="emailjs">EmailJS (Samo Browser)</option>
              <option value="sendgrid">SendGrid</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {emailForm.provider === 'resend' 
                ? '✅ Resend je besplatan (3000 emailova/mesec) i radi sa serverom' 
                : emailForm.provider === 'emailjs'
                ? '⚠️ EmailJS ne radi sa serverom - samo browser. Koristi Resend umesto toga.'
                : 'SendGrid ima besplatan tier (100 emailova/dan)'
              }
            </p>
          </div>

          {/* EmailJS Specific Fields */}
          {emailForm.provider === 'emailjs' && (
            <>
              {/* EmailJS Not Supported Warning */}
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-red-600 text-3xl">⚠️</div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-red-900 text-lg">EmailJS ne radi sa serverom!</h4>
                    <p className="text-sm text-red-800">
                      <strong>Password reset emailovi NE MOGU biti poslati</strong> sa EmailJS provajderom jer:
                    </p>
                    <ul className="text-sm text-red-800 space-y-1 list-disc list-inside ml-2">
                      <li>EmailJS radi <strong>samo u browser-u</strong>, ne na serveru</li>
                      <li>Reset password pozivi se šalju sa <strong>backend servera</strong></li>
                      <li>Backend ne može pristupiti EmailJS API-ju</li>
                    </ul>
                    <p className="text-sm text-red-900 font-bold mt-3">
                      ✅ REŠENJE: Prebaci na <strong>Resend</strong> (3000 emailova besplatno) ili <strong>SendGrid</strong>
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service ID
                </label>
                <Input
                  type="text"
                  value={emailForm.serviceId || ''}
                  onChange={(e) => setEmailForm({ ...emailForm, serviceId: e.target.value })}
                  placeholder="service_xxxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tvoj EmailJS Service ID (npr. service_abc123)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template ID
                </label>
                <Input
                  type="text"
                  value={emailForm.templateId || ''}
                  onChange={(e) => setEmailForm({ ...emailForm, templateId: e.target.value })}
                  placeholder="template_xxxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tvoj EmailJS Template ID (npr. template_xyz789)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Public Key
                </label>
                <div className="relative">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={emailForm.publicKey || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, publicKey: e.target.value })}
                    placeholder="xxxxxxxxxxxx"
                    className="font-mono pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tvoj EmailJS Public Key (iz Account sekcije)
                </p>
              </div>
            </>
          )}

          {/* Resend/SendGrid API Key Field */}
          {(emailForm.provider === 'resend' || emailForm.provider === 'sendgrid') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={emailForm.apiKey}
                  onChange={(e) => setEmailForm({ ...emailForm, apiKey: e.target.value })}
                  placeholder={emailConfig?.hasApiKey ? '••••••••••••' : 're_...'}
                  className="font-mono pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {emailConfig?.hasApiKey 
                  ? 'API key je već sačuvan. Unesi novi samo ako želiš da ga promeniš.'
                  : 'API key će biti bezbedno sačuvan na serveru'
                }
              </p>
            </div>
          )}

          {/* App URL for reset links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔗 App URL (za reset password linkove)
            </label>
            <Input
              type="url"
              value={emailForm.appUrl || ''}
              onChange={(e) => setEmailForm({ ...emailForm, appUrl: e.target.value })}
              placeholder="https://your-app.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL aplikacije koji će biti korišten u email linkovima. <strong>VAŽNO:</strong> Mora biti javno dostupan URL (ne Figma iframe).
            </p>
            <p className="text-xs text-blue-600 mt-1 font-medium">
              ℹ️ Ako je prazno, koristiće se URL iz browser-a (neće raditi u produkciji)
            </p>
          </div>

          {/* From Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email
            </label>
            <Input
              type="email"
              value={emailForm.fromEmail}
              onChange={(e) => setEmailForm({ ...emailForm, fromEmail: e.target.value })}
              placeholder="noreply@euroconnectbg.com"
              className={emailForm.fromEmail.includes('@euroconnect.eu') ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {emailForm.fromEmail.includes('@euroconnect.eu') && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                ⚠️ Domena @euroconnect.eu nije verifikovana! Koristi @euroconnectbg.com umesto toga.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Email adresa sa koje će biti slati mejlovi (mora biti verifikovana u Resend-u)
            </p>
          </div>

          {/* From Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Name
            </label>
            <Input
              type="text"
              value={emailForm.fromName}
              onChange={(e) => setEmailForm({ ...emailForm, fromName: e.target.value })}
              placeholder="EuroConnect Europe"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ime pošiljaoca koji će se prikazati u email-u
            </p>
          </div>

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Aktiviraj Email Notifikacije</h4>
              <p className="text-sm text-gray-600">
                Automatski šalji mejlove za registraciju, aplikacije i status promene
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailForm.enabled}
                onChange={(e) => setEmailForm({ ...emailForm, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Save & Test Buttons */}
          <div className="pt-4 border-t space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleSaveEmailConfig}
                disabled={savingEmail || !emailForm.fromEmail}
                className="w-full"
                size="lg"
              >
                {savingEmail ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Čuvanje...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Sačuvaj
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleTestEmail}
                variant="outline"
                className="w-full"
                size="lg"
                disabled={!emailConfig?.enabled}
              >
                <FileText className="w-5 h-5 mr-2" />
                Test Email
              </Button>
            </div>
            
            {/* Quick Reset Test - Direct Modal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Show Reset Link - No Email */}
              <Button
                onClick={async () => {
                  try {
                    console.log('🔗 TEST: Getting reset link without sending email...');
                    toast.info('🔗 Generišem test reset link...');
                    
                    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fe64975a/auth/forgot-password`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`,
                      },
                      body: JSON.stringify({ email: 'office@euroconnectbg.com' }),
                    });

                    const data = await response.json();
                    console.log('📦 Backend response:', data);
                    
                    if (response.ok && data.resetToken) {
                      const currentOrigin = window.location.origin;
                      const generatedLink = `${currentOrigin}?reset-token=${data.resetToken}`;
                      
                      // Save token for simulation
                      setCurrentResetToken(data.resetToken);
                      
                      // Show in modal instead of alert
                      setResetLink(generatedLink);
                      setShowResetLinkModal(true);
                      
                      console.log('🔗 Reset link would be:', generatedLink);
                      toast.success('✅ Link je prikazan u modalu!');
                    } else {
                      toast.error('❌ Backend nije vratio token!');
                    }
                  } catch (error: any) {
                    console.error('❌ Test error:', error);
                    toast.error(`Greška: ${error.message}`);
                  }
                }}
                variant="outline"
                className="w-full border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                size="lg"
              >
                🔗 Show Reset Link
              </Button>
              
              {/* Auto Test - Calls Backend First */}
              <Button
                onClick={async () => {
                  try {
                    console.log('🧪 LOCAL AUTO TEST START');
                    toast.info('🧪 Pozivam backend za test token...');
                    
                    // Use office admin account for testing
                    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fe64975a/auth/forgot-password`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`,
                      },
                      body: JSON.stringify({ email: 'office@euroconnectbg.com' }),
                    });

                    const data = await response.json();
                    console.log('📦 Backend response:', data);
                    
                    if (response.ok && data.resetToken) {
                      console.log('🔑 Test token received:', data.resetToken);
                      
                      if (onOpenResetModal) {
                        console.log('✅ Callback exists, opening modal...');
                        toast.success('✅ Modal se otvara za office@euroconnectbg.com!');
                        onOpenResetModal(data.resetToken);
                      } else {
                        console.error('❌ onOpenResetModal callback missing!');
                        toast.error('❌ Callback nije definisan!');
                      }
                    } else {
                      toast.error('❌ Backend nije vratio token!');
                    }
                  } catch (error: any) {
                    console.error('❌ Test error:', error);
                    toast.error(`Greška: ${error.message}`);
                  }
                }}
                variant="outline"
                className="w-full border-2 border-green-500 text-green-700 hover:bg-green-50"
                size="lg"
              >
                🧪 Local Test (office@euroconnectbg.com)
              </Button>
              
              {/* Backend Test - Real Email */}
              <Button
                onClick={async () => {
                  try {
                    console.log('🔑 Requesting reset token...');
                    toast.info('🔑 Requesting reset token...');
                    
                    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fe64975a/auth/forgot-password`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`,
                      },
                      body: JSON.stringify({ email: 'office@euroconnectbg.com' }),
                    });

                    console.log('📥 Response status:', response.status);
                    
                    const responseText = await response.text();
                    console.log('📄 Response text:', responseText);
                    
                    let data;
                    try {
                      data = JSON.parse(responseText);
                    } catch (parseError) {
                      console.error('❌ JSON parse error:', parseError);
                      toast.error('Backend vratio neispravan format. Otvori Debug Console za detalje.');
                      return;
                    }
                    
                    console.log('📦 Parsed data:', data);
                    
                    if (response.ok && data.resetToken) {
                      console.log('✅ Reset token received:', data.resetToken);
                      
                      if (onOpenResetModal) {
                        console.log('🚀 Calling onOpenResetModal callback...');
                        toast.success('✅ Otvaram Reset Password modal...');
                        onOpenResetModal(data.resetToken);
                      } else {
                        console.error('❌ onOpenResetModal callback nije definisan!');
                        toast.error('Greška: Modal callback nije definisan');
                      }
                    } else {
                      console.error('❌ Error from server:', data);
                      toast.error(data.error || 'Greška pri kreiranju reset linka');
                    }
                  } catch (error: any) {
                    console.error('❌ Error testing reset:', error);
                    toast.error(`Greška: ${error.message}`);
                  }
                }}
                variant="outline"
                className="w-full border-2 border-purple-500 text-purple-700 hover:bg-purple-50"
                size="lg"
              >
                🚀 Backend Test (Real Email)
              </Button>
            </div>
            
            {/* INSTANT TEST BUTTON - Outside grid, full width */}
            <Button
              onClick={async () => {
                try {
                  toast.info('🔑 Generišem reset link...');
                  
                  const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fe64975a/auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${publicAnonKey}`,
                    },
                    body: JSON.stringify({ email: 'office@euroconnectbg.com' }),
                  });
                  
                  const data = await response.json();
                  
                  if (response.ok && data.resetToken) {
                    const resetUrl = `${window.location.origin}?reset-token=${data.resetToken}`;
                    console.log('🔗 Reset URL:', resetUrl);
                    
                    // Open in new tab
                    window.open(resetUrl, '_blank');
                    
                    toast.success('✅ Reset stranica otvorena u novom tabu!');
                  } else {
                    toast.error(data.error || 'Greška pri generisanju linka');
                  }
                } catch (error: any) {
                  console.error('❌ Error:', error);
                  toast.error(`Greška: ${error.message}`);
                }
              }}
              variant="default"
              className="w-full bg-gradient-to-r from-gold to-yellow-500 text-gold-foreground hover:from-gold/90 hover:to-yellow-500/90 border-2 border-yellow-600"
              size="lg"
            >
              ⚡ INSTANT TEST - Otvori Reset Stranicu (Novi Tab)
            </Button>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">📧 Email Notifikacije</h4>
            <p className="text-sm text-purple-800 mb-2">Kada se aktivira, sistem će automatski slati:</p>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Dobrodošlica email za nove korisnike</li>
              <li>• Potvrda aplikacije kandidatima</li>
              <li>• Notifikacija poslodavcima o novim aplikacijama</li>
              <li>• Status promene aplikacija</li>
              <li>• Potvrda plaćanja</li>
            </ul>
          </div>

          {/* API Key Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🔑 Kako dobiti kredencijale?</h4>
            
            {emailForm.provider === 'emailjs' && (
              <div className="space-y-2">
                <p className="text-sm text-blue-800 font-medium">EmailJS Setup:</p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Registruj se besplatno na <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">EmailJS.com</a></li>
                  <li>Kreiraj novi <strong>Email Service</strong> (npr. Gmail, Outlook)</li>
                  <li>Kreiraj <strong>Email Template</strong> sa varijablama: <code className="bg-blue-100 px-1 rounded">{"{{to_email}}"}</code>, <code className="bg-blue-100 px-1 rounded">{"{{subject}}"}</code>, <code className="bg-blue-100 px-1 rounded">{"{{message}}"}</code></li>
                  <li>Kopiraj <strong>Service ID</strong>, <strong>Template ID</strong> i <strong>Public Key</strong> iz Account sekcije</li>
                  <li>Unesi ih ovde i klikni "Sačuvaj"</li>
                </ol>
                <p className="text-xs text-blue-700 mt-2">💡 EmailJS je potpuno besplatan za do 200 emailova mesečno!</p>
              </div>
            )}
            
            {emailForm.provider === 'resend' && (
              <div className="space-y-2">
                <p className="text-sm text-blue-800 font-medium">Resend Setup:</p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Registruj se besplatno na <a href="https://resend.com/signup" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Resend.com</a></li>
                  <li>Idi na <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-semibold">API Keys</a> stranicu</li>
                  <li>Klikni <strong>"Create API Key"</strong></li>
                  <li>Kopiraj API key (počinje sa <code className="bg-blue-100 px-1 rounded">re_</code>)</li>
                  <li>Zalepi ga ovde u polje "API Key" i klikni "Sačuvaj"</li>
                </ol>
                <p className="text-xs text-blue-700 mt-2">💡 Resend nudi 3,000 emailova mesečno <strong>besplatno</strong>! (SendGrid samo 100/dan)</p>
                <p className="text-xs text-blue-700">⚡ Resend radi odlično sa serverom - idealan za production!</p>
              </div>
            )}
            
            {emailForm.provider === 'sendgrid' && (
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>SendGrid:</strong> Poseti <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" className="underline">SendGrid Settings</a> za API key</li>
                <li>• SendGrid nudi 100 emailova dnevno besplatno</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Reset Link Modal */}
      <ResetLinkModal
        isOpen={showResetLinkModal}
        onClose={() => {
          setShowResetLinkModal(false);
          setResetLink('');
          setCurrentResetToken('');
        }}
        resetLink={resetLink}
        onSimulateClick={() => {
          // Extract token from link and open reset modal
          if (currentResetToken && onOpenResetModal) {
            console.log('🎭 Simulating email click with token:', currentResetToken);
            onOpenResetModal(currentResetToken);
          }
        }}
      />
    </div>
  );
}