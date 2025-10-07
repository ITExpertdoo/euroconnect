import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { seedDemoJobs } from '../utils/seedDemoData';
import { toast } from 'sonner@2.0.3';
import { Zap, Database, LogIn, UserPlus } from 'lucide-react';

interface QuickActionsProps {
  onOpenAuth?: (tab?: 'login' | 'signup') => void;
}

export function QuickActions({ onOpenAuth }: QuickActionsProps) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleSeedJobs = async () => {
    if (!isAuthenticated || user?.role !== 'employer') {
      toast.error('Morate biti prijavljeni kao poslodavac');
      return;
    }

    setLoading(true);
    const results = await seedDemoJobs();
    const successCount = results.filter(r => r.success).length;
    
    if (successCount > 0) {
      toast.success(`Kreirano ${successCount} demo poslova!`);
    }
    
    setLoading(false);
  };

  return (
    <Card className="border-2 border-gold">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-gold" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
        <CardDescription>
          Brzi linkovi za testiranje aplikacije
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isAuthenticated ? (
          <>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => onOpenAuth?.('signup')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Registruj se
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => onOpenAuth?.('login')}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Prijavi se
            </Button>
          </>
        ) : (
          <>
            <div className="text-sm space-y-1 mb-3 p-3 bg-gray-50 rounded">
              <p className="font-medium">Prijavljen kao:</p>
              <p className="text-gray-600">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'candidate' ? 'Kandidat' : 'Poslodavac'}
              </p>
            </div>
            
            {user?.role === 'employer' && (
              <Button 
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90" 
                onClick={handleSeedJobs}
                disabled={loading}
              >
                <Database className="w-4 h-4 mr-2" />
                {loading ? 'Kreiranje...' : 'Seed 8 Demo Poslova'}
              </Button>
            )}
            
            {user?.role === 'candidate' && (
              <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded">
                <p className="font-medium mb-1">💡 Tip:</p>
                <p>Pretražite poslove i aplicirajte sa pravim CV-em!</p>
              </div>
            )}
          </>
        )}
        
        <div className="pt-3 border-t text-xs text-gray-500">
          <p className="mb-1">🔥 Backend je LIVE!</p>
          <p>Svi podaci se čuvaju u Supabase</p>
        </div>
      </CardContent>
    </Card>
  );
}
