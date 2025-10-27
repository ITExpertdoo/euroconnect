import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { Loader2, CheckCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Logo } from './Logo';

interface ResetPasswordPageProps {
  token: string;
  onSuccess?: () => void;
}

export function ResetPasswordPage({ token, onSuccess }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Validate token format
  useEffect(() => {
    if (!token || token.length < 10) {
      setTokenValid(false);
      toast.error('❌ Nevažeći reset token!');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Sva polja su obavezna');
      return;
    }

    if (password.length < 6) {
      toast.error('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Lozinke se ne podudaraju');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Resetting password with token:', token);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe64975a/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            resetToken: token,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();
      console.log('📦 Reset response:', data);

      if (response.ok) {
        setSuccess(true);
        toast.success('✅ Lozinka je uspešno promenjena!');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = '/';
          }
        }, 2000);
      } else {
        toast.error(data.error || 'Greška prilikom promene lozinke');
        
        if (data.error?.includes('expired') || data.error?.includes('invalid')) {
          setTokenValid(false);
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Greška prilikom promene lozinke');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-gold/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo className="h-12" />
            </div>
            <CardTitle className="text-2xl text-red-600">Nevažeći Token</CardTitle>
            <CardDescription>
              Reset token je nevažeći ili je istekao
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                ❌ Ovaj reset link je nevažeći ili je istekao (1 sat).
              </p>
              <p className="text-xs text-red-700 mt-2">
                Molimo vas da zatražite novi reset link.
              </p>
            </div>
            
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Nazad na početnu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-gold/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">Uspešno!</CardTitle>
            <CardDescription>
              Lozinka je uspešno promenjena
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                ✅ Vaša lozinka je uspešno promenjena.
              </p>
              <p className="text-xs text-green-700 mt-2">
                Sada se možete prijaviti sa novom lozinkom.
              </p>
            </div>
            
            <p className="text-center text-sm text-gray-600">
              Preusmeravanje na login stranicu...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-gold/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-12" />
          </div>
          <CardTitle className="text-2xl">Reset Lozinke</CardTitle>
          <CardDescription>
            Unesite novu lozinku za vaš nalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Token Display (read-only) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-blue-900 font-medium">
                  Reset Token Detected
                </p>
              </div>
              <p className="text-xs text-blue-700 mt-1 font-mono break-all">
                {token.substring(0, 20)}...
              </p>
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="new-password">Nova lozinka</Label>
              <div className="relative mt-2">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Unesite novu lozinku"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Najmanje 6 karaktera
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirm-password">Potvrdite lozinku</Label>
              <div className="relative mt-2">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Potvrdite novu lozinku"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            {password && confirmPassword && (
              <div className={`text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                {password === confirmPassword ? '✅ Lozinke se podudaraju' : '❌ Lozinke se ne podudaraju'}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetovanje...
                </>
              ) : (
                'Resetuj lozinku'
              )}
            </Button>

            {/* Back to login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="text-sm text-primary hover:underline"
              >
                Nazad na login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}