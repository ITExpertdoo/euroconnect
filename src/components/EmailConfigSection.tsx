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

interface EmailConfigSectionProps {
  emailConfig: any;
  emailForm: {
    provider: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
    enabled: boolean;
  };
  setEmailForm: (form: any) => void;
  showApiKey: boolean;
  setShowApiKey: (show: boolean) => void;
  savingEmail: boolean;
  handleSaveEmailConfig: () => void;
  handleTestEmail: () => void;
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
}: EmailConfigSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-secondary">
        <FileText className="w-5 h-5 text-secondary" />
        <h3 className="text-xl font-semibold text-secondary">Email Notifikacije</h3>
      </div>
      
      {/* Current Email Status Card */}
      <Card className={emailConfig?.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {emailConfig?.enabled ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Settings className="w-6 h-6 text-gray-600" />
              )}
              <div>
                <h3 className={`font-semibold ${emailConfig?.enabled ? 'text-green-900' : 'text-gray-900'}`}>
                  {emailConfig?.enabled ? 'Email Notifikacije Aktivne' : 'Email Nije Konfigurisan'}
                </h3>
                <p className={`text-sm ${emailConfig?.enabled ? 'text-green-700' : 'text-gray-700'}`}>
                  {emailConfig?.enabled 
                    ? `Provider: ${emailConfig.provider?.toUpperCase() || 'N/A'} | Od: ${emailConfig.fromEmail}` 
                    : 'Konfiguriši email servis za automatske notifikacije'
                  }
                </p>
              </div>
            </div>
            <Badge variant={emailConfig?.enabled ? 'default' : 'secondary'} className="text-sm">
              {emailConfig?.enabled ? 'Enabled' : 'Disabled'}
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
              <option value="resend">Resend (Preporučeno)</option>
              <option value="sendgrid">SendGrid</option>
              <option value="smtp">SMTP</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Resend je najlakši za setup i ima besplatan tier
            </p>
          </div>

          {/* API Key */}
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

          {/* From Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email
            </label>
            <Input
              type="email"
              value={emailForm.fromEmail}
              onChange={(e) => setEmailForm({ ...emailForm, fromEmail: e.target.value })}
              placeholder="noreply@euroconnect.eu"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email adresa sa koje će biti slati mejlovi
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
                  Sačuvaj Email Konfiguraciju
                </>
              )}
            </Button>
            
            {emailConfig?.enabled && (
              <Button
                onClick={handleTestEmail}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                Pošalji Test Email
              </Button>
            )}
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
            <h4 className="font-medium text-blue-900 mb-2">🔑 Kako dobiti API key?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Resend:</strong> Registruj se na <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a> i kreiraj API key</li>
              <li>• <strong>SendGrid:</strong> Poseti <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" className="underline">SendGrid Settings</a> za API key</li>
              <li>• Resend nudi 100 emailova mesečno besplatno</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
