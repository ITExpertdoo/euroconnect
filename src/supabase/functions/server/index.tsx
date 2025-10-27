import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Supabase client for server-side operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Storage bucket name
const CV_BUCKET = 'make-fe64975a-cvs';
const LOGO_BUCKET = 'make-fe64975a-logos';

// Initialize storage buckets
async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.some(b => b.name === CV_BUCKET)) {
      await supabase.storage.createBucket(CV_BUCKET, { public: false });
      console.log(`Created bucket: ${CV_BUCKET}`);
    }
    
    if (!buckets?.some(b => b.name === LOGO_BUCKET)) {
      await supabase.storage.createBucket(LOGO_BUCKET, { public: false });
      console.log(`Created bucket: ${LOGO_BUCKET}`);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize demo users
async function initializeDemoUsers() {
  try {
    console.log('Initializing demo users...');
    
    const demoUsers = [
      { email: 'admin@euroconnect.eu', password: 'admin123', name: 'Admin', role: 'candidate' },
      { email: 'office@euroconnectbg.com', password: 'office123', name: 'Office Admin', role: 'candidate' },
      { email: 'candidate@test.com', password: 'candidate123', name: 'Test Kandidat', role: 'candidate' },
      { email: 'employer@test.com', password: 'employer123', name: 'Test Poslodavac', role: 'employer' },
    ];
    
    for (const user of demoUsers) {
      try {
        // Try to create user
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: { name: user.name, role: user.role }
        });
        
        if (error) {
          // User might already exist, which is fine
          if (error.message.includes('already been registered')) {
            console.log(`Demo user already exists: ${user.email}`);
          } else {
            console.error(`Error creating demo user ${user.email}:`, error);
          }
        } else {
          // Store user profile in KV
          const isAdmin = user.email === 'admin@euroconnect.eu' || user.email === 'office@euroconnectbg.com';
          const isPremium = user.email === 'candidate@test.com' || isAdmin; // Test candidate ima premium!
          await kv.set(`user:${data.user.id}`, {
            id: data.user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isAdmin,
            isPremium,
            createdAt: new Date().toISOString(),
          });
          console.log(`Created demo user: ${user.email} ${isPremium ? '👑 PREMIUM' : ''}`);
        }
      } catch (err) {
        console.error(`Error with demo user ${user.email}:`, err);
      }
    }
    
    console.log('✅ Demo users initialized!');
    console.log('📧 Login credentials:');
    console.log('   Admin: admin@euroconnect.eu / admin123');
    console.log('   Office Admin: office@euroconnectbg.com / office123');
    console.log('   Candidate: candidate@test.com / candidate123');
    console.log('   Employer: employer@test.com / employer123');
  } catch (error) {
    console.error('Error initializing demo users:', error);
  }
}

// Auto-fix email domain on startup
async function fixEmailDomain() {
  try {
    const emailConfig = await kv.get('email_config');
    if (emailConfig && emailConfig.fromEmail && emailConfig.fromEmail.includes('@euroconnect.eu')) {
      console.log('⚠️ Detected old domain @euroconnect.eu in email config - auto-fixing to @euroconnectbg.com');
      emailConfig.fromEmail = emailConfig.fromEmail.replace('@euroconnect.eu', '@euroconnectbg.com');
      await kv.set('email_config', emailConfig);
      console.log('✅ Email domain auto-fixed to:', emailConfig.fromEmail);
    }
  } catch (error) {
    console.error('Error fixing email domain:', error);
  }
}

// Initialize on startup
initializeStorage();
initializeDemoUsers();
fixEmailDomain();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify user authentication
async function verifyAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user?.id) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }
  
  c.set('userId', user.id);
  c.set('userEmail', user.email);
  await next();
}

// Email notification helper function
async function sendEmailNotification(params: {
  to: string;
  subject: string;
  body: string;
}) {
  const emailId = crypto.randomUUID();
  
  // Log the email for debugging
  console.log('📧 Email Notification:');
  console.log('To:', params.to);
  console.log('Subject:', params.subject);
  console.log('Body:', params.body);
  console.log('---');
  
  try {
    // Check email config from KV store first
    const emailConfig = await kv.get('email_config');
    
    // Determine API key source: KV store or environment variable
    let resendApiKey = null;
    let fromEmail = 'EuroConnect <noreply@euroconnectbg.com>';  // Changed to match verified domain
    
    if (emailConfig?.enabled && emailConfig.provider === 'resend' && emailConfig.apiKey) {
      // Use config from Admin Panel (KV store)
      resendApiKey = emailConfig.apiKey;
      let configFromEmail = emailConfig.fromEmail;
      
      // Auto-fix: Ensure fromEmail uses verified domain (euroconnectbg.com)
      if (configFromEmail && configFromEmail.includes('@euroconnect.eu')) {
        console.warn('⚠️ Auto-correcting unverified domain @euroconnect.eu to @euroconnectbg.com');
        configFromEmail = configFromEmail.replace('@euroconnect.eu', '@euroconnectbg.com');
      }
      
      fromEmail = `${emailConfig.fromName} <${configFromEmail}>`;
      console.log('Using Resend API key from Admin Panel configuration');
    } else {
      // Fallback to environment variable
      resendApiKey = Deno.env.get('RESEND_API_KEY');
      if (resendApiKey) {
        console.log('Using Resend API key from environment variable');
      }
    }
    
    if (resendApiKey) {
      console.log('Sending email via Resend...');
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [params.to],
          subject: params.subject,
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #0E395C; padding: 20px; text-align: center;">
              <h1 style="color: #F2C230; margin: 0;">EuroConnect Europe</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              ${params.body.replace(/\n/g, '<br>')}
            </div>
            <div style="padding: 15px; background-color: #0E395C; text-align: center; color: white; font-size: 12px;">
              <p style="margin: 0;">© 2025 EuroConnect Europe. Sva prava zadržana.</p>
            </div>
          </div>`,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Resend API error:', result);
        throw new Error(`Resend API error: ${JSON.stringify(result)}`);
      }
      
      console.log('✅ Email sent successfully via Resend:', result.id);
      
      // Store email log in KV for tracking
      await kv.set(`email:${emailId}`, {
        id: emailId,
        to: params.to,
        subject: params.subject,
        body: params.body,
        sentAt: new Date().toISOString(),
        provider: 'resend',
        resendId: result.id,
        status: 'sent'
      });
      
      return { success: true, emailId, resendId: result.id };
    } else {
      console.warn('⚠️ Resend API key not configured - email will not be sent');
      console.warn('   Configure it in Admin Panel > Settings > Email Notifikacije or set RESEND_API_KEY env var');
      
      // Store email log in KV for tracking (but not sent)
      await kv.set(`email:${emailId}`, {
        id: emailId,
        to: params.to,
        subject: params.subject,
        body: params.body,
        sentAt: new Date().toISOString(),
        provider: 'none',
        status: 'not_sent_no_api_key'
      });
      
      return { success: false, emailId, error: 'Resend API key not configured' };
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // Store failed email log
    await kv.set(`email:${emailId}`, {
      id: emailId,
      to: params.to,
      subject: params.subject,
      body: params.body,
      sentAt: new Date().toISOString(),
      provider: 'resend',
      status: 'failed',
      error: String(error)
    });
    
    return { success: false, emailId, error: String(error) };
  }
}

// ==================== AUTH ROUTES ====================

// Sign up
app.post("/make-server-fe64975a/auth/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server isn't configured
      user_metadata: { name, role }
    });
    
    if (error) {
      console.error('Signup error:', error);
      
      // If user already exists, return a more friendly error
      if (error.message.includes('already been registered') || error.code === 'email_exists') {
        return c.json({ 
          error: 'Korisnik sa ovom email adresom već postoji',
          code: 'email_exists'
        }, 409);
      }
      
      return c.json({ error: error.message }, 400);
    }
    
    // Check if this is the admin email
    const isAdmin = email === 'admin@euroconnect.eu';
    
    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      isAdmin,
      isPremium: false,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ 
      success: true, 
      user: { id: data.user.id, email, name, role, isAdmin, isPremium: false }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Login
app.post("/make-server-fe64975a/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      
      // Provide helpful error message
      if (error.message.includes('Invalid login credentials') || error.code === 'invalid_credentials') {
        return c.json({ 
          error: 'Nevažeće kredencijale. Proverite email i lozinku ili se prvo registrujte.',
          hint: 'Demo korisnici: admin@euroconnect.eu (admin123), candidate@test.com (candidate123), employer@test.com (employer123)'
        }, 400);
      }
      
      return c.json({ error: error.message }, 400);
    }
    
    // Get user profile
    const profile = await kv.get(`user:${data.user.id}`);
    
    // Check if this is the admin email and update profile
    const isAdmin = email === 'admin@euroconnect.eu';
    
    let userProfile = profile || {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name,
      role: data.user.user_metadata?.role,
      isAdmin: false,
      isPremium: false,
    };
    
    // Update admin status if needed
    if (isAdmin && !userProfile.isAdmin) {
      userProfile.isAdmin = true;
      await kv.set(`user:${data.user.id}`, userProfile);
      console.log(`Updated admin status for user: ${email}`);
    }
    
    return c.json({
      access_token: data.session.access_token,
      user: userProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Forgot Password - Generate reset token
app.post("/make-server-fe64975a/auth/forgot-password", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email je obavezan' }, 400);
    }
    
    console.log(`🔑 Forgot password request for: ${email}`);
    
    // Find user by email
    console.log('🔍 Searching for user in KV...');
    const allUsers = await kv.getByPrefix('user:');
    console.log(`📊 Found ${allUsers.length} total users in system`);
    
    const user = allUsers.find((u: any) => u.email === email);
    console.log(`🔎 User search result:`, user ? `Found ${user.name}` : 'Not found');
    
    if (!user) {
      console.log(`⚠️ User not found for email: ${email}`);
      // For testing purposes, generate token anyway
      const resetToken = crypto.randomUUID();
      console.log(`🎫 Generated test token for non-existent user: ${resetToken}`);
      return c.json({ 
        message: 'Ako email postoji, reset link će biti poslat.',
        resetToken // Return token for testing even if user doesn't exist
      });
    }
    
    console.log(`✅ User found: ${user.name} (ID: ${user.id})`);
    
    // Generate reset token
    const resetToken = crypto.randomUUID();
    const resetExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    
    console.log(`🎫 Generated reset token: ${resetToken}`);
    console.log(`⏰ Token expires at: ${resetExpiry.toISOString()}`);
    
    // Store reset token
    await kv.set(`reset:${resetToken}`, {
      userId: user.id,
      email: user.email,
      expiresAt: resetExpiry.toISOString(),
      createdAt: new Date().toISOString(),
    });
    
    console.log(`💾 Reset token stored successfully in KV for ${email}`);
    
    // Try to send email if configured
    const emailConfig = await kv.get('email_config');
    
    if (emailConfig?.enabled) {
      // Use configured App URL if available, otherwise fall back to request origin
      const appUrl = emailConfig.appUrl || c.req.header('origin') || 'https://your-app.com';
      const resetUrl = `${appUrl}?reset-token=${resetToken}`;
      
      console.log(`📧 Generating reset URL with appUrl: ${appUrl}`);
      console.log(`🔗 Full reset URL: ${resetUrl}`);
      
      const emailResult = await sendEmailNotification({
        to: email,
        subject: '🔐 Reset Lozinke - EuroConnect Europe',
        body: `Poštovani ${user.name},\n\nPrimili smo zahtev za reset vaše lozinke.\n\nKliknite na link ispod da resetujete lozinku:\n${resetUrl}\n\nLink važi 1 sat.\n\nAko niste tražili reset lozinke, ignorišite ovaj email.\n\nSrdačan pozdrav,\nEuroConnect Europe Tim`
      });
      
      if (emailResult.success) {
        console.log('📧 Reset email sent successfully');
      } else {
        console.warn('⚠️ Failed to send reset email:', emailResult.error);
      }
    } else {
      console.warn('⚠️ Email not configured - reset link not sent');
    }
    
    // Return token for testing purposes (in production, don't return this!)
    console.log(`✅ Forgot password completed successfully for ${email}`);
    console.log(`🔗 Reset token: ${resetToken}`);
    
    return c.json({ 
      message: 'Reset link je poslat na vaš email',
      resetToken // Return token so frontend can test
    });
    
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return c.json({ error: `Greška pri kreiranju reset linka: ${String(error)}` }, 500);
  }
});

// Reset Password - Use token to reset password
app.post("/make-server-fe64975a/auth/reset-password", async (c) => {
  try {
    const body = await c.req.json();
    const resetToken = body.resetToken || body.token; // Support both field names
    const newPassword = body.newPassword;
    
    console.log('📦 Reset password request:', { hasResetToken: !!body.resetToken, hasToken: !!body.token, hasPassword: !!newPassword });
    
    if (!resetToken || !newPassword) {
      return c.json({ error: 'Token i nova lozinka su obavezni' }, 400);
    }
    
    if (newPassword.length < 6) {
      return c.json({ error: 'Lozinka mora imati najmanje 6 karaktera' }, 400);
    }
    
    console.log(`🔐 Reset password attempt with token: ${resetToken}`);
    
    // Get reset token data
    const resetData = await kv.get(`reset:${resetToken}`);
    
    if (!resetData) {
      console.error('❌ Invalid or expired reset token');
      return c.json({ error: 'Nevažeći ili istekao reset token' }, 400);
    }
    
    // Check if token expired
    if (new Date(resetData.expiresAt) < new Date()) {
      console.error('❌ Reset token expired');
      await kv.del(`reset:${resetToken}`); // Clean up expired token
      return c.json({ error: 'Reset token je istekao. Zatražite novi.' }, 400);
    }
    
    // Update password in Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(
      resetData.userId,
      { password: newPassword }
    );
    
    if (error) {
      console.error('❌ Failed to update password:', error);
      return c.json({ error: 'Greška pri promeni lozinke' }, 500);
    }
    
    // Delete used token
    await kv.del(`reset:${resetToken}`);
    
    console.log(`✅ Password reset successful for user: ${resetData.email}`);
    
    // Send confirmation email if configured
    const emailConfig = await kv.get('email_config');
    if (emailConfig?.enabled) {
      await sendEmailNotification({
        to: resetData.email,
        subject: '✅ Lozinka Uspešno Promenjena - EuroConnect Europe',
        body: `Poštovani,\n\nVaša lozinka je uspešno promenjena.\n\nAko niste izvršili ovu promenu, odmah nas kontaktirajte.\n\nSrdačan pozdrav,\nEuroConnect Europe Tim`
      });
    }
    
    return c.json({ 
      message: 'Lozinka je uspešno promenjena!',
      success: true 
    });
    
  } catch (error) {
    console.error('❌ Reset password error:', error);
    return c.json({ error: 'Greška pri reset-u lozinke' }, 500);
  }
});

// Get current user
app.get("/make-server-fe64975a/auth/me", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json(profile);
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

// ==================== JOBS ROUTES ====================

// Get all jobs (with filters)
app.get("/make-server-fe64975a/jobs", async (c) => {
  try {
    const category = c.req.query('category');
    const location = c.req.query('location');
    const search = c.req.query('search');
    
    // Check if user is authenticated and get their premium status
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    let userProfile: any = null;
    
    if (accessToken) {
      const { data: { user } } = await supabase.auth.getUser(accessToken);
      if (user?.id) {
        userProfile = await kv.get(`user:${user.id}`);
      }
    }
    
    const allJobs = await kv.getByPrefix('job:');
    let jobs = allJobs;
    
    // Filter premium jobs if user is not premium or admin
    if (!userProfile?.isPremium && !userProfile?.isAdmin) {
      jobs = jobs.filter((j: any) => !j.isPremium);
    }
    
    // Apply other filters
    if (category) {
      jobs = jobs.filter((j: any) => j.category === category);
    }
    if (location) {
      jobs = jobs.filter((j: any) => j.location?.includes(location) || j.country === location);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter((j: any) => 
        j.title?.toLowerCase().includes(searchLower) ||
        j.company?.toLowerCase().includes(searchLower) ||
        j.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date (newest first)
    jobs.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    return c.json({ error: 'Failed to get jobs' }, 500);
  }
});

// Get single job
app.get("/make-server-fe64975a/jobs/:id", async (c) => {
  try {
    const jobId = c.req.param('id');
    const job = await kv.get(`job:${jobId}`);
    
    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    // Increment view count
    job.views = (job.views || 0) + 1;
    await kv.set(`job:${jobId}`, job);
    
    return c.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    return c.json({ error: 'Failed to get job' }, 500);
  }
});

// Create job (employer only)
app.post("/make-server-fe64975a/jobs", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (user?.role !== 'employer') {
      return c.json({ error: 'Only employers can create jobs' }, 403);
    }
    
    const jobData = await c.req.json();
    const jobId = crypto.randomUUID();
    
    const job = {
      id: jobId,
      ...jobData,
      employerId: userId,
      createdAt: new Date().toISOString(),
      views: 0,
      applicants: 0,
      status: 'active',
    };
    
    await kv.set(`job:${jobId}`, job);
    
    return c.json(job);
  } catch (error) {
    console.error('Create job error:', error);
    return c.json({ error: 'Failed to create job' }, 500);
  }
});

// Update job
app.put("/make-server-fe64975a/jobs/:id", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const jobId = c.req.param('id');
    const job = await kv.get(`job:${jobId}`);
    
    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    if (job.employerId !== userId) {
      return c.json({ error: 'Not authorized to update this job' }, 403);
    }
    
    const updates = await c.req.json();
    const updatedJob = { ...job, ...updates, updatedAt: new Date().toISOString() };
    
    await kv.set(`job:${jobId}`, updatedJob);
    
    return c.json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    return c.json({ error: 'Failed to update job' }, 500);
  }
});

// Delete job
app.delete("/make-server-fe64975a/jobs/:id", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const jobId = c.req.param('id');
    const job = await kv.get(`job:${jobId}`);
    
    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    if (job.employerId !== userId) {
      return c.json({ error: 'Not authorized to delete this job' }, 403);
    }
    
    await kv.del(`job:${jobId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    return c.json({ error: 'Failed to delete job' }, 500);
  }
});

// Upgrade job to premium/featured (employer only)
app.post("/make-server-fe64975a/jobs/:id/upgrade", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const jobId = c.req.param('id');
    const { featureType } = await c.req.json();
    
    const job = await kv.get(`job:${jobId}`);
    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    if (job.employerId !== userId) {
      return c.json({ error: 'Not authorized to upgrade this job' }, 403);
    }
    
    // Pricing for job upgrades
    const pricing = {
      'featured': 49.99,  // Featured listing for 30 days
      'boost': 19.99,     // Boost to top for 7 days
      'highlight': 29.99  // Highlight with gold border for 30 days
    };
    
    const price = pricing[featureType as keyof typeof pricing];
    if (!price) {
      return c.json({ error: 'Invalid feature type' }, 400);
    }
    
    // Update job with premium feature
    const updatedJob = {
      ...job,
      premium: true,
      premiumFeature: featureType,
      premiumUntil: new Date(Date.now() + (featureType === 'boost' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`job:${jobId}`, updatedJob);
    
    // Create payment record
    const paymentId = crypto.randomUUID();
    const payment = {
      id: paymentId,
      userId,
      jobId,
      type: 'job_upgrade',
      featureType,
      amount: price,
      currency: 'EUR',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`payment:${paymentId}`, payment);
    
    return c.json({ 
      success: true,
      job: updatedJob,
      payment
    });
  } catch (error) {
    console.error('Upgrade job error:', error);
    return c.json({ error: 'Failed to upgrade job' }, 500);
  }
});

// ==================== APPLICATIONS ROUTES ====================

// Apply to job
app.post("/make-server-fe64975a/applications", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (user?.role !== 'candidate') {
      return c.json({ error: 'Only candidates can apply to jobs' }, 403);
    }
    
    // Check if candidate has all required documents approved
    const allDocuments = await kv.getByPrefix(`document:${userId}:`);
    const requiredDocTypes = [
      'cv',
      'diploma',
      'passport-photo',
      'passport-copy',
      'medical-certificate',
      'police-clearance'
    ];
    
    const approvedDocs = allDocuments.filter((doc: any) => doc.status === 'approved');
    const approvedDocTypes = approvedDocs.map((doc: any) => doc.documentType);
    const hasAllDocs = requiredDocTypes.every(type => approvedDocTypes.includes(type));
    
    if (!hasAllDocs) {
      return c.json({ 
        error: 'Morate imati sva odobrena dokumenta pre prijave na oglas',
        missingDocs: requiredDocTypes.filter(type => !approvedDocTypes.includes(type))
      }, 400);
    }
    
    const { jobId, coverLetter, cvUrl } = await c.req.json();
    
    if (!jobId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const job = await kv.get(`job:${jobId}`);
    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    // Check if job is premium and user has premium access
    if (job.isPremium && !user.isPremium && !user.isAdmin) {
      return c.json({ error: 'Premium pristup je potreban za ovaj oglas' }, 403);
    }
    
    // Check if already applied
    const existingApplications = await kv.getByPrefix('application:');
    const alreadyApplied = existingApplications.some((app: any) => 
      app.candidateId === userId && app.jobId === jobId
    );
    
    if (alreadyApplied) {
      return c.json({ error: 'Već ste aplicirali za ovaj oglas' }, 400);
    }
    
    const applicationId = crypto.randomUUID();
    const application = {
      id: applicationId,
      jobId,
      candidateId: userId,
      candidateName: user.name,
      candidateEmail: user.email,
      coverLetter: coverLetter || '',
      cvUrl: cvUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`application:${applicationId}`, application);
    
    // Update job applicant count
    job.applicants = (job.applicants || 0) + 1;
    await kv.set(`job:${jobId}`, job);
    
    return c.json(application);
  } catch (error) {
    console.error('Apply to job error:', error);
    return c.json({ error: 'Failed to apply to job' }, 500);
  }
});

// Get my applications (candidate)
app.get("/make-server-fe64975a/applications/my", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const allApplications = await kv.getByPrefix('application:');
    
    const myApplications = allApplications.filter((app: any) => app.candidateId === userId);
    
    // Enrich with job data
    const enriched = await Promise.all(
      myApplications.map(async (app: any) => {
        const job = await kv.get(`job:${app.jobId}`);
        return { ...app, job };
      })
    );
    
    return c.json(enriched);
  } catch (error) {
    console.error('Get applications error:', error);
    return c.json({ error: 'Failed to get applications' }, 500);
  }
});

// Get applications for a job (employer)
app.get("/make-server-fe64975a/applications/job/:jobId", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const jobId = c.req.param('jobId');
    
    const job = await kv.get(`job:${jobId}`);
    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    if (job.employerId !== userId) {
      return c.json({ error: 'Not authorized to view these applications' }, 403);
    }
    
    const allApplications = await kv.getByPrefix('application:');
    const jobApplications = allApplications.filter((app: any) => app.jobId === jobId);
    
    return c.json(jobApplications);
  } catch (error) {
    console.error('Get job applications error:', error);
    return c.json({ error: 'Failed to get applications' }, 500);
  }
});

// Update application status
app.put("/make-server-fe64975a/applications/:id/status", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const applicationId = c.req.param('id');
    const { status } = await c.req.json();
    
    const application = await kv.get(`application:${applicationId}`);
    if (!application) {
      return c.json({ error: 'Application not found' }, 404);
    }
    
    const job = await kv.get(`job:${application.jobId}`);
    if (job.employerId !== userId) {
      return c.json({ error: 'Not authorized to update this application' }, 403);
    }
    
    application.status = status;
    application.updatedAt = new Date().toISOString();
    
    await kv.set(`application:${applicationId}`, application);
    
    return c.json(application);
  } catch (error) {
    console.error('Update application status error:', error);
    return c.json({ error: 'Failed to update application status' }, 500);
  }
});

// ==================== PROFILE ROUTES ====================

// Get profile
app.get("/make-server-fe64975a/profile", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Update profile
app.put("/make-server-fe64975a/profile", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const updates = await c.req.json();
    
    const profile = await kv.get(`user:${userId}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    const updatedProfile = { 
      ...profile, 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    await kv.set(`user:${userId}`, updatedProfile);
    
    return c.json(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ==================== FILE UPLOAD ROUTES ====================

// Upload file (CV or Logo)
app.post("/make-server-fe64975a/upload", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    const bucket = type === 'cv' ? CV_BUCKET : LOGO_BUCKET;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: true,
      });
    
    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: error.message }, 500);
    }
    
    // Get signed URL (valid for 1 year)
    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, 31536000);
    
    if (signedError) {
      console.error('Signed URL error:', signedError);
      return c.json({ error: signedError.message }, 500);
    }
    
    return c.json({ url: signedData.signedUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Upload failed' }, 500);
  }
});

// ==================== PREMIUM ROUTES ====================

// Check premium status
app.get("/make-server-fe64975a/premium/status", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({
      isPremium: user.isPremium || false,
      isAdmin: user.isAdmin || false,
      premiumUntil: user.premiumUntil || null,
    });
  } catch (error) {
    console.error('Get premium status error:', error);
    return c.json({ error: 'Failed to get premium status' }, 500);
  }
});

// Purchase premium access
app.post("/make-server-fe64975a/premium/purchase", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { planType, paymentMethod } = await c.req.json();
    
    if (!planType) {
      return c.json({ error: 'Plan type required' }, 400);
    }
    
    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Calculate premium duration based on plan
    const durations: { [key: string]: number } = {
      'basic': 30, // 30 days
      'professional': 90, // 90 days
      'enterprise': 365, // 365 days
    };
    
    const durationDays = durations[planType] || 30;
    const premiumUntil = new Date();
    premiumUntil.setDate(premiumUntil.getDate() + durationDays);
    
    // Create payment record
    const paymentId = crypto.randomUUID();
    const payment = {
      id: paymentId,
      userId,
      planType,
      paymentMethod,
      amount: planType === 'basic' ? 9.99 : planType === 'professional' ? 29.99 : 99.99,
      currency: 'EUR',
      status: 'completed', // In real app, this would be 'pending' until payment is confirmed
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`payment:${paymentId}`, payment);
    
    // Update user premium status
    user.isPremium = true;
    user.premiumUntil = premiumUntil.toISOString();
    user.premiumPlan = planType;
    user.updatedAt = new Date().toISOString();
    
    await kv.set(`user:${userId}`, user);
    
    return c.json({
      success: true,
      payment,
      user: {
        isPremium: user.isPremium,
        premiumUntil: user.premiumUntil,
        premiumPlan: user.premiumPlan,
      }
    });
  } catch (error) {
    console.error('Purchase premium error:', error);
    return c.json({ error: 'Failed to purchase premium' }, 500);
  }
});

// Get user's payment history
app.get("/make-server-fe64975a/premium/payments", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const allPayments = await kv.getByPrefix('payment:');
    const userPayments = allPayments.filter((p: any) => p.userId === userId);
    
    // Sort by date (newest first)
    userPayments.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json(userPayments);
  } catch (error) {
    console.error('Get payments error:', error);
    return c.json({ error: 'Failed to get payments' }, 500);
  }
});

// ==================== ADMIN ROUTES ====================

// Get all users (admin only)
app.get("/make-server-fe64975a/admin/users", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const allUsers = await kv.getByPrefix('user:');
    
    // Sort by creation date
    allUsers.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json(allUsers);
  } catch (error) {
    console.error('Get all users error:', error);
    return c.json({ error: 'Failed to get users' }, 500);
  }
});

// Get all applications (admin only)
app.get("/make-server-fe64975a/admin/applications", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const allApplications = await kv.getByPrefix('application:');
    
    // Enrich with job and user data
    const enriched = await Promise.all(
      allApplications.map(async (app: any) => {
        const job = await kv.get(`job:${app.jobId}`);
        const candidate = await kv.get(`user:${app.candidateId}`);
        return { ...app, job, candidate };
      })
    );
    
    return c.json(enriched);
  } catch (error) {
    console.error('Get all applications error:', error);
    return c.json({ error: 'Failed to get applications' }, 500);
  }
});

// Get all payments (admin only)
app.get("/make-server-fe64975a/admin/payments", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const allPayments = await kv.getByPrefix('payment:');
    
    // Sort by date (newest first)
    allPayments.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json(allPayments);
  } catch (error) {
    console.error('Get all payments error:', error);
    return c.json({ error: 'Failed to get payments' }, 500);
  }
});

// Update user premium status (admin only)
app.put("/make-server-fe64975a/admin/users/:userId/premium", verifyAuth, async (c) => {
  try {
    const adminId = c.get('userId');
    const adminUser = await kv.get(`user:${adminId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const targetUserId = c.req.param('userId');
    const { isPremium, premiumDays } = await c.req.json();
    
    const user = await kv.get(`user:${targetUserId}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    user.isPremium = isPremium;
    
    if (isPremium && premiumDays) {
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + premiumDays);
      user.premiumUntil = premiumUntil.toISOString();
      user.premiumPlan = 'admin-granted';
    } else if (!isPremium) {
      user.premiumUntil = null;
      user.premiumPlan = null;
    }
    
    user.updatedAt = new Date().toISOString();
    await kv.set(`user:${targetUserId}`, user);
    
    console.log(`Admin ${adminUser.email} set premium=${isPremium} for user ${user.email}`);
    
    return c.json({ success: true, user });
  } catch (error) {
    console.error('Update premium status error:', error);
    return c.json({ error: 'Failed to update premium status' }, 500);
  }
});

// ==================== PAYMENT CONFIG ROUTES (ADMIN ONLY) ====================

// Get payment configuration (admin only)
app.get("/make-server-fe64975a/admin/payment-config", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const config = await kv.get('payment:config');
    
    if (!config) {
      return c.json({
        provider: null,
        publishableKey: null,
        hasSecretKey: false,
        enabled: false,
      });
    }
    
    // Don't return the secret key to frontend
    return c.json({
      provider: config.provider,
      publishableKey: config.publishableKey,
      hasSecretKey: !!config.secretKey,
      enabled: config.enabled,
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error('Get payment config error:', error);
    return c.json({ error: 'Failed to get payment configuration' }, 500);
  }
});

// Save payment configuration (admin only)
app.post("/make-server-fe64975a/admin/payment-config", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const { provider, publishableKey, secretKey, enabled } = await c.req.json();
    
    if (!provider || !publishableKey) {
      return c.json({ error: 'Provider and publishable key are required' }, 400);
    }
    
    // Get existing config to preserve secret key if not provided
    const existingConfig = await kv.get('payment:config');
    
    const config = {
      provider,
      publishableKey,
      secretKey: secretKey || existingConfig?.secretKey || null,
      enabled: enabled !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };
    
    await kv.set('payment:config', config);
    
    console.log(`✅ Payment configuration updated by ${adminUser.email}`);
    console.log(`   Provider: ${config.provider}`);
    console.log(`   Publishable Key: ${config.publishableKey.slice(0, 20)}...`);
    console.log(`   Has Secret Key: ${!!config.secretKey}`);
    console.log(`   Enabled: ${config.enabled}`);
    
    return c.json({
      success: true,
      config: {
        provider: config.provider,
        publishableKey: config.publishableKey,
        hasSecretKey: !!config.secretKey,
        enabled: config.enabled,
        updatedAt: config.updatedAt,
      }
    });
  } catch (error) {
    console.error('Save payment config error:', error);
    return c.json({ error: 'Failed to save payment configuration' }, 500);
  }
});

// Email configuration (admin only)
app.get("/make-server-fe64975a/admin/email-config", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const config = await kv.get('email_config');
    
    console.log('🔍 Raw email_config from DB:', JSON.stringify(config, null, 2));
    
    if (!config) {
      return c.json({ enabled: false });
    }
    
    // Don't send API key to frontend
    return c.json({
      provider: config.provider,
      fromEmail: config.fromEmail,
      fromName: config.fromName,
      enabled: config.enabled,
      hasApiKey: !!config.apiKey,
      // EmailJS specific (public key can be sent to frontend)
      serviceId: config.serviceId || '',
      templateId: config.templateId || '',
      publicKey: config.publicKey || '',
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error('Get email config error:', error);
    return c.json({ error: 'Failed to get email config' }, 500);
  }
});

app.post("/make-server-fe64975a/admin/email-config", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const { provider, apiKey, fromEmail, fromName, enabled, serviceId, templateId, publicKey } = await c.req.json();
    
    console.log(`📧 Saving email config: provider=${provider}, enabled=${enabled}, serviceId=${serviceId}, templateId=${templateId}, publicKey=${publicKey ? 'present' : 'missing'}`);
    
    // Get existing config to preserve API key if not provided
    let existingConfig = await kv.get('email_config');
    if (!existingConfig) {
      existingConfig = {};
    }
    
    const config = {
      provider,
      apiKey: apiKey || existingConfig.apiKey || '', // Keep existing if not provided
      fromEmail,
      fromName,
      enabled,
      // EmailJS specific
      serviceId: serviceId || existingConfig.serviceId || '',
      templateId: templateId || existingConfig.templateId || '',
      publicKey: publicKey || existingConfig.publicKey || '',
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set('email_config', config);
    
    console.log(`✅ Email config saved by admin ${adminUser.email}: provider=${config.provider}, enabled=${config.enabled}, serviceId=${config.serviceId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Save email config error:', error);
    return c.json({ error: 'Failed to save email config' }, 500);
  }
});

// Send test email (admin only)
app.post("/make-server-fe64975a/admin/test-email", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const { toEmail } = await c.req.json();
    const emailConfig = await kv.get('email_config');
    
    if (!emailConfig || !emailConfig.enabled) {
      return c.json({ error: 'Email nije konfigurisan ili nije aktiviran. Prvo sačuvaj email konfiguraciju.' }, 400);
    }
    
    console.log(`Attempting to send test email via ${emailConfig.provider} to ${toEmail}`);
    
    // Send test email using EmailJS
    if (emailConfig.provider === 'emailjs') {
      if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
        return c.json({ error: 'EmailJS kredencijali nisu potpuni (Service ID, Template ID, Public Key)' }, 400);
      }
      
      console.log('📧 Preparing EmailJS request...');
      console.log(`   Service ID: ${emailConfig.serviceId}`);
      console.log(`   Template ID: ${emailConfig.templateId}`);
      console.log(`   Public Key: ${emailConfig.publicKey?.substring(0, 10)}...`);
      console.log(`   To: ${toEmail}`);
      
      const emailData = {
        service_id: emailConfig.serviceId,
        template_id: emailConfig.templateId,
        user_id: emailConfig.publicKey,
        template_params: {
          to_email: toEmail,
          to_name: adminUser.name,
          from_name: emailConfig.fromName,
          subject: '🧪 Test Email - EuroConnect Europe',
          message: `Ovo je test email iz EuroConnect Europe platforme. Ako si primio ovaj email, znači da email konfiguracija radi ispravno! ✅`,
        },
      };
      
      console.log('📤 Sending to EmailJS API...');
      console.log('Request body:', JSON.stringify(emailData, null, 2));
      
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      console.log(`📨 EmailJS Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ EmailJS error response:', errorText);
        console.error('   Status:', response.status);
        console.error('   Status Text:', response.statusText);
        return c.json({ 
          error: `EmailJS greška (${response.status}): ${errorText || response.statusText}`,
          details: errorText
        }, 500);
      }
      
      const responseData = await response.text();
      console.log(`✅ Test email sent to ${toEmail} via EmailJS`);
      console.log('   Response:', responseData);
      return c.json({ success: true, message: 'Email uspešno poslat!' });
    }
    
    // Send test email using Resend
    if (emailConfig.provider === 'resend') {
      if (!emailConfig.apiKey) {
        return c.json({ error: 'Resend API key nije konfigurisan' }, 400);
      }
      
      // Auto-fix: Ensure fromEmail uses verified domain (euroconnectbg.com)
      let fromEmail = emailConfig.fromEmail;
      if (fromEmail && fromEmail.includes('@euroconnect.eu')) {
        console.warn('⚠️ Detected unverified domain @euroconnect.eu - auto-correcting to @euroconnectbg.com');
        fromEmail = fromEmail.replace('@euroconnect.eu', '@euroconnectbg.com');
      }
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${emailConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${emailConfig.fromName} <${fromEmail}>`,
          to: [toEmail],
          subject: '🧪 Test Email - EuroConnect Europe',
          html: `
            <h1>Test Email</h1>
            <p>Ovo je test email iz EuroConnect Europe platforme.</p>
            <p>Ako si primio ovaj email, znači da email konfiguracija radi ispravno! ✅</p>
            <p><strong>Provider:</strong> ${emailConfig.provider}</p>
            <p><strong>Od:</strong> ${fromEmail}</p>
            <hr />
            <p><small>Poslato: ${new Date().toLocaleString('sr-RS')}</small></p>
          `,
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error('Resend error:', error);
        return c.json({ error: 'Failed to send email: ' + error }, 500);
      }
      
      console.log(`Test email sent to ${toEmail}`);
      return c.json({ success: true });
    }
    
    return c.json({ error: `Unsupported email provider: ${emailConfig.provider}. Koristi 'emailjs' ili 'resend'` }, 400);
  } catch (error) {
    console.error('Send test email error:', error);
    return c.json({ error: 'Failed to send test email' }, 500);
  }
});

// ==================== PASSWORD RESET ROUTES ====================

// Request password reset (sends email with reset token)
app.post("/make-server-fe64975a/auth/forgot-password", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email je obavezan' }, 400);
    }
    
    // Find user by email
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.email === email);
    
    // Generate reset token (valid for 1 hour) - always generate for testing
    const resetToken = crypto.randomUUID();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    if (!user) {
      // Don't reveal if user exists or not for security reasons
      // But still save token for admin testing purposes
      console.log(`Reset requested for non-existent user ${email}, saving token anyway for testing: ${resetToken}`);
      
      // Save token even for non-existent users (admin testing)
      await kv.set(`reset-token:${resetToken}`, {
        userId: null,
        email: email,
        createdAt: new Date().toISOString(),
        expiresAt: resetExpires.toISOString(),
        isTestToken: true, // Mark as test token
      });
      
      return c.json({ 
        success: true, 
        message: 'Ako postoji nalog sa ovom email adresom, dobićete link za reset lozinke.',
        resetToken: resetToken // Include for admin testing even if user doesn't exist
      });
    }
    
    // Store reset token
    await kv.set(`reset-token:${resetToken}`, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: resetExpires.toISOString(),
    });
    
    // Send email with reset link
    const emailConfig = await kv.get('email_config');
    
    console.log('📧 Email Config Status:', {
      exists: !!emailConfig,
      enabled: emailConfig?.enabled,
      hasApiKey: !!emailConfig?.apiKey,
      provider: emailConfig?.provider,
      fromEmail: emailConfig?.fromEmail,
    });
    
    if (emailConfig && emailConfig.enabled && emailConfig.apiKey) {
      // Try to get the origin from multiple sources in order of priority
      let origin = c.req.header('origin') || 
                   c.req.header('referer')?.replace(/\?.*$/, '').replace(/\/$/, '');
      
      // If we still don't have origin, try to get it from saved config
      if (!origin) {
        const appConfig = await kv.get('app_config');
        origin = appConfig?.baseUrl || 'https://cf08c917-7c95-40f2-b849-d8ee5015aba0-figmaiframepreview.figma.site';
      }
      
      console.log('🌐 Origin Detection:', {
        fromHeader: c.req.header('origin'),
        fromReferer: c.req.header('referer'),
        fromConfig: (await kv.get('app_config'))?.baseUrl,
        finalOrigin: origin,
      });
      
      // Save the origin for future use if we got it from headers
      if (c.req.header('origin') || c.req.header('referer')) {
        await kv.set('app_config', { baseUrl: origin, updatedAt: new Date().toISOString() });
      }
      
      const resetLink = `${origin}?reset-token=${resetToken}`;
      
      console.log(`📧 Generating password reset link: ${resetLink}`);
      
      if (emailConfig.provider === 'resend') {
        console.log('📤 Attempting to send email via Resend...');
        console.log('📧 Email payload:', {
          from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
          to: email,
          subject: '🔑 Reset lozinke - EuroConnect Europe',
          resetLink: resetLink,
        });
        
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailConfig.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
            to: [email],
            subject: '🔑 Reset lozinke - EuroConnect Europe',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0E395C;">Reset lozinke</h2>
                <p>Pozdrav ${user.name},</p>
                <p>Primili smo zahtev za reset vaše lozinke na EuroConnect Europe platformi.</p>
                <p>Kliknite na dugme ispod da resetujete lozinku:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" 
                     style="background-color: #F2C230; color: #0E395C; padding: 12px 30px; 
                            text-decoration: none; border-radius: 5px; font-weight: bold; 
                            display: inline-block;">
                    Resetuj lozinku
                  </a>
                </div>
                <p><strong>Link je validan 1 sat.</strong></p>
                <p>Ako niste zatražili reset lozinke, možete ignorisati ovaj email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #666; font-size: 12px;">
                  EuroConnect Europe - Povezujemo Balkan sa EU<br/>
                  Poslato: ${new Date().toLocaleString('sr-RS')}
                </p>
              </div>
            `,
          }),
        });
        
        console.log('📨 Resend API Response Status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Resend API Error:', errorText);
          console.error('❌ Failed to send password reset email via Resend');
          // Still return success to not reveal user existence
        } else {
          const responseData = await response.json();
          console.log('✅ Resend API Success:', responseData);
          console.log(`✅ Password reset email sent to ${email} via Resend`);
        }
      } else if (emailConfig.provider === 'sendgrid') {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailConfig.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: email }],
              subject: '🔑 Reset lozinke - EuroConnect Europe',
            }],
            from: {
              email: emailConfig.fromEmail,
              name: emailConfig.fromName,
            },
            content: [{
              type: 'text/html',
              value: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #0E395C;">Reset lozinke</h2>
                  <p>Pozdrav ${user.name},</p>
                  <p>Primili smo zahtev za reset vaše lozinke na EuroConnect Europe platformi.</p>
                  <p>Kliknite na dugme ispod da resetujete lozinku:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="background-color: #F2C230; color: #0E395C; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; font-weight: bold; 
                              display: inline-block;">
                      Resetuj lozinku
                    </a>
                  </div>
                  <p><strong>Link je validan 1 sat.</strong></p>
                  <p>Ako niste zatražili reset lozinke, možete ignorisati ovaj email.</p>
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
                  <p style="color: #666; font-size: 12px;">
                    EuroConnect Europe - Povezujemo Balkan sa EU<br/>
                    Poslato: ${new Date().toLocaleString('sr-RS')}
                  </p>
                </div>
              `,
            }],
          }),
        });
        
        if (!response.ok) {
          const error = await response.text();
          console.error('❌ Failed to send password reset email via SendGrid:', error);
          // Still return success to not reveal user existence
        } else {
          console.log(`✅ Password reset email sent to ${email} via SendGrid`);
        }
      } else {
        console.log(`⚠️ Email provider '${emailConfig.provider}' not supported for server-side sending. Use Resend or SendGrid.`);
      }
    } else {
      console.log(`⚠️ Password reset requested for ${email} but email is not configured`);
      console.log(`Reset token: ${resetToken}`);
    }
    
    return c.json({ 
      success: true,
      message: 'Ako postoji nalog sa ovom email adresom, dobićete link za reset lozinke.',
      resetToken: resetToken // Include token for admin testing
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ error: 'Neuspešan zahtev za reset lozinke' }, 500);
  }
});

// Reset password with token
app.post("/make-server-fe64975a/auth/reset-password", async (c) => {
  try {
    const { token, newPassword } = await c.req.json();
    
    if (!token || !newPassword) {
      return c.json({ error: 'Token i nova lozinka su obavezni' }, 400);
    }
    
    if (newPassword.length < 6) {
      return c.json({ error: 'Lozinka mora imati najmanje 6 karaktera' }, 400);
    }
    
    // Get reset token data
    const resetData = await kv.get(`reset-token:${token}`);
    
    if (!resetData) {
      console.error(`❌ Token not found in KV store: reset-token:${token}`);
      return c.json({ error: 'Nevažeći ili istekao reset link' }, 400);
    }
    
    console.log(`✅ Token found in KV:`, { userId: resetData.userId, email: resetData.email, isTestToken: resetData.isTestToken });
    
    // Check if token is expired
    if (new Date() > new Date(resetData.expiresAt)) {
      await kv.del(`reset-token:${token}`);
      return c.json({ error: 'Reset link je istekao. Zatražite novi.' }, 400);
    }
    
    // If this is a test token (no real user), just return success
    if (resetData.isTestToken || !resetData.userId) {
      await kv.del(`reset-token:${token}`);
      console.log(`✅ Test token used successfully for ${resetData.email}`);
      return c.json({ 
        success: true,
        message: 'Password reset successful (test mode - no actual user)'
      });
    }
    
    // Update password in Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(
      resetData.userId,
      { password: newPassword }
    );
    
    if (error) {
      console.error('Password update error:', error);
      return c.json({ error: 'Neuspešna promena lozinke' }, 500);
    }
    
    // Delete used token
    await kv.del(`reset-token:${token}`);
    
    console.log(`Password reset successful for user ${resetData.email}`);
    
    // Send confirmation email
    const emailConfig = await kv.get('email_config');
    const user = await kv.get(`user:${resetData.userId}`);
    
    if (emailConfig && emailConfig.enabled && emailConfig.apiKey && user) {
      if (emailConfig.provider === 'resend') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailConfig.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
            to: [resetData.email],
            subject: '✅ Lozinka uspešno promenjena - EuroConnect Europe',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0E395C;">Lozinka promenjena</h2>
                <p>Pozdrav ${user.name},</p>
                <p>Vaša lozinka je uspešno promenjena.</p>
                <p>Sada se možete prijaviti sa novom lozinkom.</p>
                <p>Ako niste Vi promenili lozinku, odmah kontaktirajte našu podršku.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #666; font-size: 12px;">
                  EuroConnect Europe - Povezujemo Balkan sa EU<br/>
                  ${new Date().toLocaleString('sr-RS')}
                </p>
              </div>
            `,
          }),
        });
      }
    }
    
    return c.json({ 
      success: true,
      message: 'Lozinka uspešno promenjena. Sada se možete prijaviti.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ error: 'Neuspešan reset lozinke' }, 500);
  }
});

// Change password for authenticated user
app.post("/make-server-fe64975a/auth/change-password", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { currentPassword, newPassword } = await c.req.json();
    
    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Trenutna i nova lozinka su obavezne' }, 400);
    }
    
    if (newPassword.length < 6) {
      return c.json({ error: 'Nova lozinka mora imati najmanje 6 karaktera' }, 400);
    }
    
    // Get user data
    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ error: 'Korisnik nije pronađen' }, 404);
    }
    
    // Verify current password by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    
    if (signInError) {
      return c.json({ error: 'Trenutna lozinka nije tačna' }, 400);
    }
    
    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    
    if (updateError) {
      console.error('Password update error:', updateError);
      return c.json({ error: 'Neuspešna promena lozinke' }, 500);
    }
    
    console.log(`Password changed for user ${user.email}`);
    
    // Send confirmation email
    const emailConfig = await kv.get('email_config');
    
    if (emailConfig && emailConfig.enabled && emailConfig.apiKey) {
      if (emailConfig.provider === 'resend') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailConfig.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
            to: [user.email],
            subject: '🔐 Lozinka promenjena - EuroConnect Europe',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0E395C;">Lozinka uspešno promenjena</h2>
                <p>Pozdrav ${user.name},</p>
                <p>Vaša lozinka je upravo promenjena na EuroConnect Europe platformi.</p>
                <p><strong>Vreme promene:</strong> ${new Date().toLocaleString('sr-RS')}</p>
                <p>Ako niste Vi izvršili ovu promenu, odmah kontaktirajte našu podršku.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #666; font-size: 12px;">
                  EuroConnect Europe - Povezujemo Balkan sa EU
                </p>
              </div>
            `,
          }),
        });
      }
    }
    
    return c.json({ 
      success: true,
      message: 'Lozinka uspešno promenjena'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({ error: 'Neuspešna promena lozinke' }, 500);
  }
});

// ==================== DOCUMENT MANAGEMENT ROUTES ====================

// Upload document with validation and notifications
app.post("/make-server-fe64975a/documents/upload", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    
    if (!file || !documentType) {
      return c.json({ error: 'File and document type required' }, 400);
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Allowed: PDF, JPG, PNG' }, 400);
    }
    
    // Get user info
    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Store document metadata
    const documentId = crypto.randomUUID();
    const document = {
      id: documentId,
      userId,
      candidateId: user.id.substring(0, 8), // First 8 chars as candidate ID
      candidateName: user.name,
      documentType,
      fileName: file.name,
      fileType: file.type,
      status: 'pending', // pending, approved, rejected
      uploadedAt: new Date().toISOString(),
      rejectionReason: null
    };
    
    await kv.set(`document:${documentId}`, document);
    
    // Send email notification to admin
    const adminEmail = 'office@euroconnectbg.com';
    await sendEmailNotification({
      to: adminEmail,
      subject: `[EC] Novi dokument učitan – ID: ${document.candidateId} – ${user.name} (${documentType})`,
      body: `
        Kandidat: ${user.name}
        ID kandidata: ${document.candidateId}
        Dokument: ${documentType}
        Status: Učitano – čeka proveru
        Datum: ${new Date().toLocaleString('sr-RS')}
        
        [Link ka admin panelu za pregled]
      `
    });
    
    console.log(`Document uploaded: ${documentType} by ${user.name} (ID: ${document.candidateId})`);
    
    return c.json({ success: true, document });
  } catch (error) {
    console.error('Document upload error:', error);
    return c.json({ error: 'Document upload failed' }, 500);
  }
});

// Get candidate's documents
app.get("/make-server-fe64975a/documents/my", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const allDocuments = await kv.getByPrefix('document:');
    const myDocuments = allDocuments.filter((doc: any) => doc.userId === userId);
    
    // Sort by upload date (newest first)
    myDocuments.sort((a: any, b: any) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    
    return c.json(myDocuments);
  } catch (error) {
    console.error('Get documents error:', error);
    return c.json({ error: 'Failed to get documents' }, 500);
  }
});

// Admin: Get all documents
app.get("/make-server-fe64975a/admin/documents", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const allDocuments = await kv.getByPrefix('document:');
    
    // Sort by upload date (newest first)
    allDocuments.sort((a: any, b: any) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    
    return c.json(allDocuments);
  } catch (error) {
    console.error('Get all documents error:', error);
    return c.json({ error: 'Failed to get documents' }, 500);
  }
});

// Admin: Approve document
app.post("/make-server-fe64975a/admin/documents/:documentId/approve", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const documentId = c.req.param('documentId');
    const document = await kv.get(`document:${documentId}`);
    
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }
    
    // Update document status
    document.status = 'approved';
    document.approvedAt = new Date().toISOString();
    document.approvedBy = adminUser.name;
    await kv.set(`document:${documentId}`, document);
    
    // Get candidate info
    const candidate = await kv.get(`user:${document.userId}`);
    
    // Send email to candidate
    if (candidate) {
      await sendEmailNotification({
        to: candidate.email,
        subject: `[EC] Dokument odobren – ID: ${document.candidateId} – ${candidate.name} (${document.documentType})`,
        body: `
          Kandidat: ${candidate.name}
          ID kandidata: ${document.candidateId}
          Dokument: ${document.documentType}
          Status: ODOBREN
          
          Vaš dokument je uspešno odobren i možete nastaviti sa procesom prijave.
        `
      });
    }
    
    // Notify admin
    await sendEmailNotification({
      to: 'office@euroconnectbg.com',
      subject: `[EC] Dokument odobren – ID: ${document.candidateId} – ${candidate?.name} (${document.documentType})`,
      body: `
        Kandidat: ${candidate?.name}
        ID kandidata: ${document.candidateId}
        Dokument: ${document.documentType}
        Status: ODOBREN
        Odobrio: ${adminUser.name}
        Datum: ${new Date().toLocaleString('sr-RS')}
      `
    });
    
    // Check if profile is complete
    const candidateDocuments = (await kv.getByPrefix('document:')).filter(
      (doc: any) => doc.userId === document.userId
    );
    const approvedCount = candidateDocuments.filter((doc: any) => doc.status === 'approved').length;
    const requiredDocuments = 4; // Minimum required documents
    
    if (approvedCount >= requiredDocuments) {
      // Send profile complete notification
      if (candidate) {
        await sendEmailNotification({
          to: candidate.email,
          subject: `[EC] Profil kompletiran – ID: ${document.candidateId} – ${candidate.name}`,
          body: `
            Kandidat: ${candidate.name}
            ID kandidata: ${document.candidateId}
            Status: PROFIL KOMPLETIRAN
            
            Svi potrebni dokumenti su odobreni – vaš profil je spreman za dalje procese!
          `
        });
        
        await sendEmailNotification({
          to: 'office@euroconnectbg.com',
          subject: `[EC] Profil kompletiran – ID: ${document.candidateId} – ${candidate.name}`,
          body: `
            Kandidat: ${candidate.name}
            ID kandidata: ${document.candidateId}
            Status: PROFIL KOMPLETIRAN
            
            Svi dokumenti su odobreni – kandidat spreman za dalje procese.
          `
        });
      }
    }
    
    console.log(`Document approved: ${document.documentType} for ${candidate?.name} (ID: ${document.candidateId})`);
    
    return c.json({ success: true, document });
  } catch (error) {
    console.error('Approve document error:', error);
    return c.json({ error: 'Failed to approve document' }, 500);
  }
});

// Admin: Reject document
app.post("/make-server-fe64975a/admin/documents/:documentId/reject", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const adminUser = await kv.get(`user:${userId}`);
    
    if (!adminUser?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const documentId = c.req.param('documentId');
    const { reason } = await c.req.json();
    
    if (!reason) {
      return c.json({ error: 'Rejection reason required' }, 400);
    }
    
    const document = await kv.get(`document:${documentId}`);
    
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }
    
    // Update document status
    document.status = 'rejected';
    document.rejectionReason = reason;
    document.rejectedAt = new Date().toISOString();
    document.rejectedBy = adminUser.name;
    await kv.set(`document:${documentId}`, document);
    
    // Get candidate info
    const candidate = await kv.get(`user:${document.userId}`);
    
    // Send email to candidate
    if (candidate) {
      await sendEmailNotification({
        to: candidate.email,
        subject: `[EC] Dokument odbijen – ID: ${document.candidateId} – ${candidate.name} (${document.documentType})`,
        body: `
          Kandidat: ${candidate.name}
          ID kandidata: ${document.candidateId}
          Dokument: ${document.documentType}
          Status: ODBIJEN
          
          Razlog: ${reason}
          
          Molimo da ponovo učitate validan dokument. Proverite da:
          - Dokument je skeniran u boji (ne crno-belo)
          - Rezolucija je minimalno 200 DPI
          - Format je PDF, JPG ili PNG
          - Dokument nije fotografisan telefonom
          - Svi detalji su jasno vidljivi
        `
      });
    }
    
    // Notify admin
    await sendEmailNotification({
      to: 'office@euroconnectbg.com',
      subject: `[EC] Dokument odbijen – ID: ${document.candidateId} – ${candidate?.name} (${document.documentType})`,
      body: `
        Kandidat: ${candidate?.name}
        ID kandidata: ${document.candidateId}
        Dokument: ${document.documentType}
        Status: ODBIJEN
        Razlog: ${reason}
        Odbio: ${adminUser.name}
        Datum: ${new Date().toLocaleString('sr-RS')}
      `
    });
    
    console.log(`Document rejected: ${document.documentType} for ${candidate?.name} (ID: ${document.candidateId}) - Reason: ${reason}`);
    
    return c.json({ success: true, document });
  } catch (error) {
    console.error('Reject document error:', error);
    return c.json({ error: 'Failed to reject document' }, 500);
  }
});

// ==================== PRICING CONFIG ROUTES ====================

// Get pricing config
app.get("/make-server-fe64975a/pricing-config", async (c) => {
  try {
    let config = await kv.get('pricing:config');
    
    // If no config exists, create default
    if (!config) {
      config = {
        candidateBasic: 9.99,
        candidateProfessional: 29.99,
        candidateEnterprise: 99.99,
        employerBoost: 19.99,
        employerHighlight: 29.99,
        employerFeatured: 49.99,
      };
      await kv.set('pricing:config', config);
    }
    
    return c.json(config);
  } catch (error) {
    console.error('Get pricing config error:', error);
    return c.json({ error: 'Failed to get pricing config' }, 500);
  }
});

// Update pricing config (admin only)
app.put("/make-server-fe64975a/pricing-config", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const config = await c.req.json();
    await kv.set('pricing:config', config);
    
    return c.json({ success: true, config });
  } catch (error) {
    console.error('Update pricing config error:', error);
    return c.json({ error: 'Failed to update pricing config' }, 500);
  }
});

// ==================== PRICING CONFIG ROUTES (Admin only) ====================

// Get pricing configuration
app.get("/make-server-fe64975a/pricing-config", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    let config = await kv.get('pricing-config');
    
    // Return default config if none exists
    if (!config) {
      config = {
        candidateBasic: 9.99,
        candidateProfessional: 29.99,
        candidateEnterprise: 99.99,
        employerBoost: 19.99,
        employerHighlight: 29.99,
        employerFeatured: 49.99,
      };
    }
    
    return c.json(config);
  } catch (error) {
    console.error('Get pricing config error:', error);
    return c.json({ error: 'Failed to get pricing config' }, 500);
  }
});

// Update pricing configuration
app.post("/make-server-fe64975a/pricing-config", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const config = await c.req.json();
    
    // Validate that all prices are positive numbers
    const prices = [
      config.candidateBasic,
      config.candidateProfessional,
      config.candidateEnterprise,
      config.employerBoost,
      config.employerHighlight,
      config.employerFeatured,
    ];
    
    if (prices.some(p => typeof p !== 'number' || p <= 0)) {
      return c.json({ error: 'All prices must be positive numbers' }, 400);
    }
    
    await kv.set('pricing-config', config);
    
    return c.json({ success: true, config });
  } catch (error) {
    console.error('Update pricing config error:', error);
    return c.json({ error: 'Failed to update pricing config' }, 500);
  }
});

// Get user documents (for checking if candidate has all documents)
app.get("/make-server-fe64975a/my-documents", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const allDocuments = await kv.getByPrefix('document:');
    
    const userDocuments = allDocuments.filter((doc: any) => doc.userId === userId);
    
    return c.json(userDocuments);
  } catch (error) {
    console.error('Get my documents error:', error);
    return c.json({ error: 'Failed to get documents' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-fe64975a/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);