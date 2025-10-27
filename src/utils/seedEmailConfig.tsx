import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fe64975a`;

/**
 * Automatski postavlja EmailJS konfiguraciju za EuroConnect Europe
 * Koristi production EmailJS credentials
 */
export async function setupEmailJSConfig(adminAccessToken: string) {
  try {
    console.log('🔧 Postavljam EmailJS konfiguraciju...');
    
    const emailConfig = {
      provider: 'emailjs',
      serviceId: 'service_mcp9w9l',
      templateId: 'template_g8th2tk',
      publicKey: 'TD-N75TsDiZH6gEOo',
      fromEmail: 'office@euroconnectbg.com',
      fromName: 'EuroConnect Europe',
      enabled: true,
    };

    const response = await fetch(`${API_BASE_URL}/admin/email-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminAccessToken}`,
      },
      body: JSON.stringify(emailConfig),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Greška pri konfiguraciji:', data);
      return { success: false, error: data.error };
    }

    console.log('✅ EmailJS konfiguracija uspešno postavljena!');
    console.log('📧 Provider: EmailJS');
    console.log('📨 From: office@euroconnectbg.com');
    console.log('🔑 Service ID: service_mcp9w9l');
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Setup failed:', error);
    return { success: false, error: 'Request failed' };
  }
}

/**
 * Pošalji test email da proveriš konfiguraciju
 */
export async function sendTestEmail(adminAccessToken: string, toEmail: string) {
  try {
    console.log(`📧 Šaljem test email na ${toEmail}...`);
    
    const response = await fetch(`${API_BASE_URL}/admin/send-test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminAccessToken}`,
      },
      body: JSON.stringify({ toEmail }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Test email failed:', data);
      return { success: false, error: data.error };
    }

    console.log('✅ Test email uspešno poslat!');
    console.log(`📬 Proveri inbox: ${toEmail}`);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Test email failed:', error);
    return { success: false, error: 'Request failed' };
  }
}
