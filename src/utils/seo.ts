// SEO utility functions for generating meta tags

interface SEOMetaTags {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
}

interface DiseaseSEOData {
  name: string;
  description: string;
  symptoms: string[];
  treatments: string[];
}

interface DoctorSEOData {
  name: string;
  specialty: string;
  experience: string;
  location: string;
}

export const generateDiseaseSEOTags = (disease: DiseaseSEOData): SEOMetaTags => {
  const keywords = [
    disease.name,
    ...disease.symptoms.slice(0, 5),
    ...disease.treatments.slice(0, 3),
    "medical information",
    "health",
    "treatment"
  ];

  return {
    title: `${disease.name} - Symptoms, Treatment & Information | Mr.Doc`,
    description: `Learn about ${disease.name}, including symptoms, treatments, and medical information. Get expert advice from Mr.Doc healthcare professionals.`,
    keywords: keywords,
    author: "Mr.Doc Healthcare",
    image: "https://lovable.dev/opengraph-image-p98pqg.png"
  };
};

export const generateDoctorSEOTags = (doctor: DoctorSEOData): SEOMetaTags => {
  const keywords = [
    doctor.name,
    doctor.specialty,
    doctor.location,
    "doctor",
    "medical professional",
    "healthcare"
  ];

  return {
    title: `Dr. ${doctor.name} - ${doctor.specialty} | Mr.Doc`,
    description: `Meet Dr. ${doctor.name}, a ${doctor.specialty} with ${doctor.experience} years of experience in ${doctor.location}. Book an appointment with Mr.Doc today.`,
    keywords: keywords,
    author: "Mr.Doc Healthcare",
    image: "https://lovable.dev/opengraph-image-p98pqg.png"
  };
};

export const updateMetaTags = (seoData: SEOMetaTags) => {
  // Update title
  document.title = seoData.title;

  // Update meta tags
  updateMetaTag('description', seoData.description);
  updateMetaTag('author', seoData.author || 'Mr.Doc');
  
  if (seoData.keywords) {
    updateMetaTag('keywords', seoData.keywords.join(', '));
  }

  // Update Open Graph tags
  updateMetaTag('og:title', seoData.title);
  updateMetaTag('og:description', seoData.description);
  updateMetaTag('og:type', 'website');
  
  if (seoData.image) {
    updateMetaTag('og:image', seoData.image);
  }
  
  if (seoData.url) {
    updateMetaTag('og:url', seoData.url);
  }

  // Update Twitter tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', seoData.title);
  updateMetaTag('twitter:description', seoData.description);
  
  if (seoData.image) {
    updateMetaTag('twitter:image', seoData.image);
  }
};

const updateMetaTag = (name: string, content: string) => {
  let metaTag = document.querySelector(`meta[name="${name}"]`) || 
                document.querySelector(`meta[property="${name}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    if (name.startsWith('og:')) {
      metaTag.setAttribute('property', name);
    } else {
      metaTag.setAttribute('name', name);
    }
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
};

// Default SEO tags for the site
export const defaultSEOTags: SEOMetaTags = {
  title: "Mr.Doc - Your Personal Health Assistant",
  description: "Check your symptoms, find potential conditions, and get medication recommendations all in one place.",
  author: "Mr.Doc",
  image: "https://lovable.dev/opengraph-image-p98pqg.png",
  keywords: [
    "healthcare",
    "symptom checker",
    "medical advice",
    "doctor appointments",
    "medicine information",
    "diet recommendations",
    "health tracking"
  ]
};

// Example disease SEO data
export const exampleDiseaseSEO: DiseaseSEOData = {
  name: "Common Cold",
  description: "The common cold is a viral infection of your nose and throat (upper respiratory tract).",
  symptoms: ["runny nose", "sore throat", "cough", "congestion", "mild fever"],
  treatments: ["rest", "fluids", "over-the-counter medications"]
};

// Example doctor SEO data
export const exampleDoctorSEO: DoctorSEOData = {
  name: "Sarah Johnson",
  specialty: "General Practitioner",
  experience: "10",
  location: "New York"
};