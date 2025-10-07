import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fe64975a`;

// Helper function to create jobs with specific employer token
async function createJobWithToken(jobData: any, accessToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(jobData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Create job error:', data);
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Create job request failed:', error);
    return { success: false, error: 'Request failed' };
  }
}

export async function seedDemoJobs() {
  // Get employer tokens - we'll use the ones we created during seed
  // For now, we'll return the jobs data to be created by the caller who has tokens
  const demoJobs = [
    {
      title: 'CNC Operater',
      company: 'Precision Manufacturing GmbH',
      location: 'Stuttgart, Nemačka',
      country: 'Nemačka',
      salary: '€2,800 - €3,500',
      employmentType: 'Puno radno vreme',
      category: 'Proizvodnja',
      verified: true,
      isPremium: true,
      description: 'Tražimo iskusnog CNC operatera za rad u našem proizvodnom pogonu u Stuttgartu. Pozicija pruža odlične uslove rada i mogućnost napredovanja.',
      requirements: [
        '2+ godine iskustva sa CNC mašinama',
        'Poznavanje Fanuc i Siemens kontrola',
        'Osnovi nemačkog jezika (A2 minimum)',
        'Spremnost za rad u smenama',
        'Tehnička diploma ili ekvivalentno iskustvo'
      ],
      benefits: [
        'Zdravstveno osiguranje',
        'Plaćen smeštaj prve 3 meseca',
        '30 dana godišnjeg odmora',
        'Obuka i trening',
        'Bonus za rad u smenama'
      ],
      employerIndex: 0, // First employer
    },
    {
      title: 'Varioc / Zavarivač',
      company: 'Steel Works Austria',
      location: 'Graz, Austrija',
      country: 'Austrija',
      salary: '€2,500 - €3,200',
      employmentType: 'Puno radno vreme',
      category: 'Proizvodnja',
      verified: true,
      isPremium: false,
      description: 'Potreban kvalifikovan varioc za rad sa čeličnim konstrukcijama. Rad u modernom okruženju sa najnovijom opremom.',
      requirements: [
        'Certifikat za zavarivanje MIG/MAG',
        'Minimum 1 godina iskustva',
        'Fizička kondicija',
        'Spremnost za rad u ekipi',
        'Osnovno znanje nemačkog jezika'
      ],
      benefits: [
        'Legalan rad i boravak',
        'Obuka i certifikacija',
        'Mogućnost napredovanja',
        'Plaćen prevoz',
        'Radna oprema'
      ],
      employerIndex: 1, // Second employer
    },
    {
      title: 'Kuvar',
      company: 'Grand Hotel München',
      location: 'München, Nemačka',
      country: 'Nemačka',
      salary: '€2,200 - €2,800',
      employmentType: 'Puno radno vreme',
      category: 'Ugostiteljstvo',
      verified: true,
      isPremium: true,
      description: 'Hotel 5 zvezdica traži iskusnog kuvara za svoj glavni restoran. Internacionalna kuhinja, moderno okruženje.',
      requirements: [
        'Kulinarska škola ili ekvivalentno',
        '3+ godine iskustva u ugostiteljstvu',
        'Poznavanje internacionalne kuhinje',
        'Rad pod pritiskom',
        'Kreativnost i timski rad'
      ],
      benefits: [
        'Smeštaj u hotelu',
        'Besplatni obroci',
        'Radno odelo',
        'Napojnice',
        'Vikendi slobodni'
      ],
      employerIndex: 0,
    },
    {
      title: 'IT Support Specialist',
      company: 'TechSolutions Vienna',
      location: 'Beč, Austrija',
      country: 'Austrija',
      salary: '€2,800 - €3,800',
      employmentType: 'Puno radno vreme',
      category: 'IT',
      verified: true,
      isPremium: true,
      description: 'Tražimo IT stručnjaka za tehničku podršku našim klijentima. Rad sa najnovijim tehnologijama i sistemima.',
      requirements: [
        'IT obrazovanje ili iskustvo',
        'Poznavanje Windows/Linux sistema',
        'Engleski jezik C1 nivo',
        'Osnovi nemačkog jezika',
        'Problem-solving veštine'
      ],
      benefits: [
        'Home office 2 dana nedeljno',
        'Kontinuirana edukacija i certifikacije',
        'Bonusi za performance',
        'Moderna oprema',
        'Fleksibilno radno vreme'
      ],
      employerIndex: 1,
    },
    {
      title: 'Magacioner',
      company: 'Logistics Pro Deutschland',
      location: 'Frankfurt, Nemačka',
      country: 'Nemačka',
      salary: '€2,000 - €2,500',
      employmentType: 'Puno radno vreme',
      category: 'Logistika',
      verified: false,
      isPremium: false,
      description: 'Potrebni magacioneri za rad u velikom distributivnom centru. Puna obuka na licu mesta.',
      requirements: [
        'Osnovna fizička sprema',
        'Spremnost za rad u smenama',
        'Vozačka dozvola B kategorije (poželjno)',
        'Rad sa ručnim palekarima',
        'Osnovi engleskog jezika'
      ],
      benefits: [
        'Obuka na licu mesta',
        'Pomoć sa smeštajem',
        'Prevoz do posla',
        'Dodatak za noćni rad',
        'Mogućnost permanentnog zaposlenja'
      ],
      employerIndex: 0,
    },
    {
      title: 'Medicinska sestra',
      company: 'Klinikum Stuttgart',
      location: 'Stuttgart, Nemačka',
      country: 'Nemačka',
      salary: '€3,200 - €4,000',
      employmentType: 'Puno radno vreme',
      category: 'Zdravstvo',
      verified: true,
      isPremium: true,
      description: 'Prestižna klinika traži medicinsku sestru/tehničara za rad u odelenjima. Odlični uslovi i beneficije.',
      requirements: [
        'Diploma medicinske sestre/tehničara',
        'Priznata diploma u Nemačkoj',
        'Nemački jezik B2 minimum',
        'Minimum 1 godina iskustva',
        'EU državljanstvo ili radna dozvola'
      ],
      benefits: [
        'Visoke plate i bonusi',
        'Plaćeno prekovremeno',
        'Penzijski fond',
        'Pomoć sa priznavanjem diplome',
        'Kursevi nemačkog jezika'
      ],
      employerIndex: 1,
    },
    {
      title: 'Građevinski radnik',
      company: 'BauMeister AG',
      location: 'Zürich, Švicarska',
      country: 'Švicarska',
      salary: '€4,500 - €5,500',
      employmentType: 'Puno radno vreme',
      category: 'Građevina',
      verified: true,
      isPremium: true,
      description: 'Švicarska građevinska kompanija traži radnike za projekte stambene i komercijalne gradnje.',
      requirements: [
        'Iskustvo u građevini 2+ godine',
        'Poznavanje alata i opreme',
        'Fizička kondicija',
        'Osnovi nemačkog jezika',
        'Spremnost za fizički rad'
      ],
      benefits: [
        'Švicarske plate (najviše u Evropi)',
        'Plaćen smeštaj',
        'Sve potrebne dozvole',
        'Zdravstveno osiguranje',
        'Prevoz na gradilište'
      ],
      employerIndex: 0,
    },
    {
      title: 'Vozač kamiona C+E',
      company: 'Trans Europa Logistics',
      location: 'Rotterdam, Holandija',
      country: 'Holandija',
      salary: '€2,800 - €3,500',
      employmentType: 'Puno radno vreme',
      category: 'Logistika',
      verified: true,
      isPremium: false,
      description: 'Međunarodna transportna kompanija traži vozače za regionalni i međunarodni transport.',
      requirements: [
        'C+E vozačka dozvola',
        'ADR sertifikat (poželjno)',
        'Digitalna tahograf kartica',
        'Minimum 2 godine iskustva',
        'Engleski jezik - komunikativni nivo'
      ],
      benefits: [
        'Novi kamioni (Volvo, Mercedes)',
        'Dnevnice za inostranstvo',
        'Plaćeni vikendi kod kuće',
        'Mobilni telefon',
        'Bonus sistemi'
      ],
      employerIndex: 1,
    },
  ];

  return demoJobs;
}

// Create jobs for employers - to be called with employer access tokens
export async function createJobsForEmployers(employerTokens: string[]) {
  const demoJobs = await seedDemoJobs();
  const results = [];

  for (const jobData of demoJobs) {
    const { employerIndex, ...jobDataWithoutIndex } = jobData;
    const employerToken = employerTokens[employerIndex];
    
    if (!employerToken) {
      results.push({
        job: jobData.title,
        success: false,
        error: 'No employer token available',
      });
      continue;
    }

    const response = await createJobWithToken(jobDataWithoutIndex, employerToken);
    results.push({
      job: jobData.title,
      success: response.success,
      error: response.error,
    });
  }

  return results;
}
