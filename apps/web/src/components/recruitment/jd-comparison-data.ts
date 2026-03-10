import type {
  JDRequirements,
  JDCandidateComparison,
  ResumeHighlights,
  InterviewVsJDComparison,
  JDFitRecommendation,
} from '@sarve-pratibha/shared';

// ─── Senior Software Engineer JD ──────────────────────────────────

export const SENIOR_SWE_JD: JDRequirements = {
  id: 'jd-sse-001',
  title: 'Senior Software Engineer',
  department: 'Engineering',
  description:
    'We are looking for a Senior Software Engineer with strong experience in full-stack development using modern web technologies. The ideal candidate should have expertise in React, Node.js, TypeScript, and cloud services.',
  requiredSkills: [
    'React',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'REST APIs',
    'Git',
  ],
  preferredSkills: [
    'AWS',
    'Docker',
    'Kubernetes',
    'GraphQL',
    'Redis',
    'CI/CD',
  ],
  minExperience: 5,
  maxExperience: 10,
  requiredEducation: 'B.Tech/B.E. in Computer Science or related field',
  preferredEducation: 'M.Tech/M.S. in Computer Science',
  requiredCertifications: [],
  preferredCertifications: [
    'AWS Solutions Architect',
    'Kubernetes Administrator (CKA)',
  ],
  domainKnowledge: [
    'Microservices Architecture',
    'Distributed Systems',
    'Agile/Scrum',
    'System Design',
  ],
  responsibilities: [
    'Design and develop scalable web applications',
    'Lead code reviews and mentor junior developers',
    'Collaborate with product and design teams',
    'Optimize application performance',
    'Write comprehensive unit and integration tests',
  ],
};

// ─── Candidate 1: Arjun Mehta (Strong Match - 85%) ─────────────────

export const CANDIDATE_1_COMPARISON: JDCandidateComparison = {
  overallMatchScore: 85,
  skillsMatch: [
    { skill: 'React', status: 'matched', isRequired: true },
    { skill: 'Node.js', status: 'matched', isRequired: true },
    { skill: 'TypeScript', status: 'matched', isRequired: true },
    { skill: 'PostgreSQL', status: 'matched', isRequired: true },
    { skill: 'REST APIs', status: 'matched', isRequired: true },
    { skill: 'Git', status: 'matched', isRequired: true },
    { skill: 'AWS', status: 'matched', isRequired: false },
    { skill: 'Docker', status: 'matched', isRequired: false },
    { skill: 'Kubernetes', status: 'missing', isRequired: false },
    { skill: 'GraphQL', status: 'missing', isRequired: false },
    { skill: 'Redis', status: 'missing', isRequired: false },
    { skill: 'CI/CD', status: 'missing', isRequired: false },
    { skill: 'MongoDB', status: 'additional', isRequired: false },
    { skill: 'Python', status: 'additional', isRequired: false },
  ],
  experienceMatch: {
    requiredMin: 5,
    requiredMax: 10,
    candidateYears: 5,
    matchPercentage: 80,
  },
  educationMatch: {
    required: 'B.Tech/B.E. in Computer Science or related field',
    candidate: 'B.Tech in Computer Science, IIT Bombay (2021)',
    isMatch: true,
  },
  certificationMatch: [
    { certification: 'AWS Solutions Architect', status: 'matched', isRequired: false },
    { certification: 'Kubernetes Administrator (CKA)', status: 'missing', isRequired: false },
    { certification: 'MongoDB Certified Developer', status: 'additional', isRequired: false },
  ],
  radarData: [
    { category: 'Technical Skills', jdScore: 100, candidateScore: 88 },
    { category: 'Experience', jdScore: 100, candidateScore: 80 },
    { category: 'Education', jdScore: 100, candidateScore: 95 },
    { category: 'Certifications', jdScore: 100, candidateScore: 50 },
    { category: 'Domain Knowledge', jdScore: 100, candidateScore: 85 },
    { category: 'Communication', jdScore: 100, candidateScore: 90 },
  ],
  skillsScore: 88,
  experienceScore: 80,
  educationScore: 95,
  certificationScore: 50,
  domainScore: 85,
  communicationScore: 90,
};

export const CANDIDATE_1_RESUME: ResumeHighlights = {
  summary:
    'Experienced full-stack developer with 5+ years building scalable web applications. Expertise in React, Node.js, and cloud-native architectures. Strong problem solver with excellent communication skills.',
  workExperience: [
    {
      company: 'TCS',
      role: 'Senior Software Engineer',
      duration: '2.5 years',
      startDate: '2023-06',
      highlights: [
        'Led development of microservices-based e-commerce platform serving 2M+ users',
        'Reduced API response time by 40% through query optimization and caching',
        'Mentored team of 4 junior developers',
      ],
    },
    {
      company: 'Infosys',
      role: 'Software Engineer',
      duration: '2.5 years',
      startDate: '2021-01',
      endDate: '2023-05',
      highlights: [
        'Built React-based dashboard for real-time data visualization',
        'Implemented CI/CD pipelines using Jenkins and Docker',
        'Contributed to open-source internal tools library',
      ],
    },
  ],
  education: [
    { degree: 'B.Tech in Computer Science', institution: 'IIT Bombay', year: 2021, grade: '8.5 CGPA' },
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'MongoDB', 'Python', 'REST APIs', 'Git'],
  certifications: [
    { name: 'AWS Solutions Architect - Associate', issuer: 'Amazon Web Services', year: 2024 },
    { name: 'MongoDB Certified Developer', issuer: 'MongoDB Inc.', year: 2023 },
  ],
  projects: [
    {
      name: 'E-Commerce Microservices Platform',
      description: 'Scalable e-commerce platform handling 10K+ concurrent users with event-driven architecture',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    },
    {
      name: 'Real-time Analytics Dashboard',
      description: 'Interactive dashboard for monitoring business KPIs with live data streaming',
      technologies: ['React', 'D3.js', 'WebSocket', 'TypeScript'],
    },
  ],
  jdMatchedKeywords: [
    'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker',
    'microservices', 'scalable', 'full-stack', 'REST APIs', 'CI/CD',
    'mentored', 'code reviews', 'performance', 'Git',
  ],
};

export const CANDIDATE_1_INTERVIEW_VS_JD: InterviewVsJDComparison[] = [
  { jdSkill: 'React / Frontend', interviewScore: 4.5, maxScore: 5, gap: 0, status: 'exceeds' },
  { jdSkill: 'Node.js / Backend', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
  { jdSkill: 'System Design', interviewScore: 3.5, maxScore: 5, gap: 1.5, status: 'below' },
  { jdSkill: 'TypeScript', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
  { jdSkill: 'Database / SQL', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
  { jdSkill: 'Cloud / DevOps', interviewScore: 3.5, maxScore: 5, gap: 0.5, status: 'below' },
  { jdSkill: 'Communication', interviewScore: 5.0, maxScore: 5, gap: 0, status: 'exceeds' },
  { jdSkill: 'Problem Solving', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
];

export const CANDIDATE_1_RECOMMENDATION: JDFitRecommendation = {
  overallFit: 'strong_fit',
  jdMatchScore: 85,
  interviewScore: 82,
  combinedScore: 84,
  strengths: [
    'All required technical skills are present with strong proficiency',
    'Excellent communication and team collaboration skills',
    'Relevant experience in building scalable applications',
    'Strong educational background from top-tier institution',
  ],
  gaps: [
    'System design skills need improvement for senior-level expectations',
    'Limited exposure to Kubernetes and container orchestration',
    'No experience with GraphQL (preferred skill)',
  ],
  recommendation:
    'Strongly recommend for hire. Candidate has solid technical foundation with all required skills. Minor gaps in system design and Kubernetes can be addressed through on-the-job learning. Excellent culture fit and communication make this candidate a valuable team addition.',
};

// ─── Candidate 2: Priya Sharma (Good Match - 72%) ──────────────────

export const CANDIDATE_2_COMPARISON: JDCandidateComparison = {
  overallMatchScore: 72,
  skillsMatch: [
    { skill: 'React', status: 'matched', isRequired: true },
    { skill: 'Node.js', status: 'matched', isRequired: true },
    { skill: 'TypeScript', status: 'matched', isRequired: true },
    { skill: 'PostgreSQL', status: 'missing', isRequired: true },
    { skill: 'REST APIs', status: 'matched', isRequired: true },
    { skill: 'Git', status: 'matched', isRequired: true },
    { skill: 'AWS', status: 'missing', isRequired: false },
    { skill: 'Docker', status: 'matched', isRequired: false },
    { skill: 'Kubernetes', status: 'missing', isRequired: false },
    { skill: 'GraphQL', status: 'matched', isRequired: false },
    { skill: 'Redis', status: 'matched', isRequired: false },
    { skill: 'CI/CD', status: 'matched', isRequired: false },
    { skill: 'Angular', status: 'additional', isRequired: false },
    { skill: 'MySQL', status: 'additional', isRequired: false },
  ],
  experienceMatch: {
    requiredMin: 5,
    requiredMax: 10,
    candidateYears: 6,
    matchPercentage: 90,
  },
  educationMatch: {
    required: 'B.Tech/B.E. in Computer Science or related field',
    candidate: 'B.E. in Information Technology, BITS Pilani (2020)',
    isMatch: true,
  },
  certificationMatch: [
    { certification: 'AWS Solutions Architect', status: 'missing', isRequired: false },
    { certification: 'Kubernetes Administrator (CKA)', status: 'missing', isRequired: false },
    { certification: 'Google Cloud Professional', status: 'additional', isRequired: false },
  ],
  radarData: [
    { category: 'Technical Skills', jdScore: 100, candidateScore: 75 },
    { category: 'Experience', jdScore: 100, candidateScore: 90 },
    { category: 'Education', jdScore: 100, candidateScore: 85 },
    { category: 'Certifications', jdScore: 100, candidateScore: 30 },
    { category: 'Domain Knowledge', jdScore: 100, candidateScore: 70 },
    { category: 'Communication', jdScore: 100, candidateScore: 80 },
  ],
  skillsScore: 75,
  experienceScore: 90,
  educationScore: 85,
  certificationScore: 30,
  domainScore: 70,
  communicationScore: 80,
};

export const CANDIDATE_2_RESUME: ResumeHighlights = {
  summary:
    'Full-stack developer with 6 years of experience in web development. Proficient in React, Node.js, and modern JavaScript ecosystem. Passionate about building user-friendly applications.',
  workExperience: [
    {
      company: 'Flipkart',
      role: 'Software Engineer II',
      duration: '3 years',
      startDate: '2023-01',
      highlights: [
        'Developed React-based seller dashboard used by 500K+ sellers',
        'Built GraphQL API layer reducing data over-fetching by 60%',
        'Set up CI/CD pipelines with Jenkins and Docker',
      ],
    },
    {
      company: 'Mindtree',
      role: 'Software Engineer',
      duration: '3 years',
      startDate: '2020-01',
      endDate: '2022-12',
      highlights: [
        'Built REST APIs for banking application serving 1M+ users',
        'Migrated legacy Angular app to React with TypeScript',
        'Implemented Redis caching layer improving response time by 50%',
      ],
    },
  ],
  education: [
    { degree: 'B.E. in Information Technology', institution: 'BITS Pilani', year: 2020, grade: '8.2 CGPA' },
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'MySQL', 'GraphQL', 'Redis', 'Docker', 'Angular', 'REST APIs', 'Git', 'CI/CD'],
  certifications: [
    { name: 'Google Cloud Professional Cloud Developer', issuer: 'Google', year: 2024 },
  ],
  projects: [
    {
      name: 'Seller Analytics Platform',
      description: 'Real-time analytics for e-commerce sellers with dashboard and reporting',
      technologies: ['React', 'Node.js', 'GraphQL', 'Redis', 'Docker'],
    },
  ],
  jdMatchedKeywords: [
    'React', 'Node.js', 'TypeScript', 'Docker', 'REST APIs',
    'full-stack', 'CI/CD', 'Redis', 'GraphQL', 'Git',
  ],
};

export const CANDIDATE_2_INTERVIEW_VS_JD: InterviewVsJDComparison[] = [
  { jdSkill: 'React / Frontend', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
  { jdSkill: 'Node.js / Backend', interviewScore: 3.5, maxScore: 5, gap: 0.5, status: 'below' },
  { jdSkill: 'System Design', interviewScore: 3.0, maxScore: 5, gap: 2.0, status: 'below' },
  { jdSkill: 'TypeScript', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
  { jdSkill: 'Database / SQL', interviewScore: 3.0, maxScore: 5, gap: 1.0, status: 'below' },
  { jdSkill: 'Cloud / DevOps', interviewScore: 2.5, maxScore: 5, gap: 1.5, status: 'below' },
  { jdSkill: 'Communication', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
  { jdSkill: 'Problem Solving', interviewScore: 3.5, maxScore: 5, gap: 0.5, status: 'below' },
];

export const CANDIDATE_2_RECOMMENDATION: JDFitRecommendation = {
  overallFit: 'good_fit',
  jdMatchScore: 72,
  interviewScore: 68,
  combinedScore: 70,
  strengths: [
    'Good experience with React and frontend technologies',
    'Strong GraphQL and caching experience (Redis)',
    'Decent experience duration (6 years)',
    'Good communication skills',
  ],
  gaps: [
    'Missing PostgreSQL experience (required skill)',
    'No AWS experience - only Google Cloud',
    'System design and database skills need improvement',
    'Limited cloud/DevOps exposure',
  ],
  recommendation:
    'Good candidate with solid frontend skills. PostgreSQL gap is addressable given MySQL experience. Recommend for hire with expectation of ramp-up on cloud infrastructure and system design.',
};

// ─── Candidate 3: Vikram Desai (Partial Match - 55%) ───────────────

export const CANDIDATE_3_COMPARISON: JDCandidateComparison = {
  overallMatchScore: 55,
  skillsMatch: [
    { skill: 'React', status: 'missing', isRequired: true },
    { skill: 'Node.js', status: 'matched', isRequired: true },
    { skill: 'TypeScript', status: 'missing', isRequired: true },
    { skill: 'PostgreSQL', status: 'matched', isRequired: true },
    { skill: 'REST APIs', status: 'matched', isRequired: true },
    { skill: 'Git', status: 'matched', isRequired: true },
    { skill: 'AWS', status: 'matched', isRequired: false },
    { skill: 'Docker', status: 'matched', isRequired: false },
    { skill: 'Kubernetes', status: 'matched', isRequired: false },
    { skill: 'GraphQL', status: 'missing', isRequired: false },
    { skill: 'Redis', status: 'matched', isRequired: false },
    { skill: 'CI/CD', status: 'matched', isRequired: false },
    { skill: 'Java', status: 'additional', isRequired: false },
    { skill: 'Spring Boot', status: 'additional', isRequired: false },
    { skill: 'Kafka', status: 'additional', isRequired: false },
  ],
  experienceMatch: {
    requiredMin: 5,
    requiredMax: 10,
    candidateYears: 8,
    matchPercentage: 100,
  },
  educationMatch: {
    required: 'B.Tech/B.E. in Computer Science or related field',
    candidate: 'B.Tech in Electronics, NIT Trichy (2018)',
    isMatch: false,
  },
  certificationMatch: [
    { certification: 'AWS Solutions Architect', status: 'matched', isRequired: false },
    { certification: 'Kubernetes Administrator (CKA)', status: 'matched', isRequired: false },
    { certification: 'Java Certified Professional', status: 'additional', isRequired: false },
  ],
  radarData: [
    { category: 'Technical Skills', jdScore: 100, candidateScore: 58 },
    { category: 'Experience', jdScore: 100, candidateScore: 100 },
    { category: 'Education', jdScore: 100, candidateScore: 50 },
    { category: 'Certifications', jdScore: 100, candidateScore: 100 },
    { category: 'Domain Knowledge', jdScore: 100, candidateScore: 65 },
    { category: 'Communication', jdScore: 100, candidateScore: 60 },
  ],
  skillsScore: 58,
  experienceScore: 100,
  educationScore: 50,
  certificationScore: 100,
  domainScore: 65,
  communicationScore: 60,
};

export const CANDIDATE_3_RESUME: ResumeHighlights = {
  summary:
    'Backend-focused engineer with 8 years of experience in Java and Node.js. Strong expertise in distributed systems, cloud infrastructure, and DevOps. Seeking to transition into full-stack roles.',
  workExperience: [
    {
      company: 'Amazon',
      role: 'SDE-2',
      duration: '4 years',
      startDate: '2022-01',
      highlights: [
        'Designed and built microservices handling 100K+ TPS using Java and Spring Boot',
        'Managed Kubernetes clusters on AWS EKS for 50+ services',
        'Led migration from monolith to microservices architecture',
      ],
    },
    {
      company: 'HCL Technologies',
      role: 'Software Engineer',
      duration: '4 years',
      startDate: '2018-01',
      endDate: '2021-12',
      highlights: [
        'Built Node.js APIs for healthcare data processing platform',
        'Implemented Kafka-based event streaming pipeline',
        'Set up CI/CD pipelines with Jenkins and Docker',
      ],
    },
  ],
  education: [
    { degree: 'B.Tech in Electronics', institution: 'NIT Trichy', year: 2018, grade: '7.8 CGPA' },
  ],
  skills: ['Java', 'Spring Boot', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Kafka', 'Redis', 'REST APIs', 'Git', 'CI/CD'],
  certifications: [
    { name: 'AWS Solutions Architect - Professional', issuer: 'Amazon Web Services', year: 2023 },
    { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', year: 2024 },
    { name: 'Oracle Certified Java Professional', issuer: 'Oracle', year: 2022 },
  ],
  projects: [
    {
      name: 'High-Throughput Order Processing System',
      description: 'Event-driven order processing system handling 100K+ orders/sec',
      technologies: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'AWS', 'Kubernetes'],
    },
  ],
  jdMatchedKeywords: [
    'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'REST APIs',
    'microservices', 'distributed systems', 'scalable', 'Git', 'CI/CD', 'Redis',
  ],
};

export const CANDIDATE_3_INTERVIEW_VS_JD: InterviewVsJDComparison[] = [
  { jdSkill: 'React / Frontend', interviewScore: 2.0, maxScore: 5, gap: 3.0, status: 'below' },
  { jdSkill: 'Node.js / Backend', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
  { jdSkill: 'System Design', interviewScore: 4.5, maxScore: 5, gap: 0, status: 'exceeds' },
  { jdSkill: 'TypeScript', interviewScore: 2.0, maxScore: 5, gap: 2.0, status: 'below' },
  { jdSkill: 'Database / SQL', interviewScore: 4.5, maxScore: 5, gap: 0, status: 'exceeds' },
  { jdSkill: 'Cloud / DevOps', interviewScore: 5.0, maxScore: 5, gap: 0, status: 'exceeds' },
  { jdSkill: 'Communication', interviewScore: 3.0, maxScore: 5, gap: 1.0, status: 'below' },
  { jdSkill: 'Problem Solving', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
];

export const CANDIDATE_3_RECOMMENDATION: JDFitRecommendation = {
  overallFit: 'partial_fit',
  jdMatchScore: 55,
  interviewScore: 72,
  combinedScore: 63,
  strengths: [
    'Exceptional cloud/DevOps and system design skills',
    'Strong experience in distributed systems and microservices',
    'All preferred certifications present',
    'Extensive experience (8 years)',
  ],
  gaps: [
    'Missing React and TypeScript (required skills for this role)',
    'Education is in Electronics, not Computer Science',
    'Communication skills need improvement',
    'Backend-heavy profile for a full-stack role',
  ],
  recommendation:
    'Strong backend engineer with excellent infrastructure skills but significant gaps in frontend technologies (React, TypeScript). Consider for a backend-focused role or if willing to invest in frontend training.',
};

// ─── Candidate 4: Sneha Patel (Low Match - 42%) ────────────────────

export const CANDIDATE_4_COMPARISON: JDCandidateComparison = {
  overallMatchScore: 42,
  skillsMatch: [
    { skill: 'React', status: 'missing', isRequired: true },
    { skill: 'Node.js', status: 'missing', isRequired: true },
    { skill: 'TypeScript', status: 'missing', isRequired: true },
    { skill: 'PostgreSQL', status: 'missing', isRequired: true },
    { skill: 'REST APIs', status: 'matched', isRequired: true },
    { skill: 'Git', status: 'matched', isRequired: true },
    { skill: 'AWS', status: 'missing', isRequired: false },
    { skill: 'Docker', status: 'missing', isRequired: false },
    { skill: 'Kubernetes', status: 'missing', isRequired: false },
    { skill: 'GraphQL', status: 'missing', isRequired: false },
    { skill: 'Redis', status: 'missing', isRequired: false },
    { skill: 'CI/CD', status: 'missing', isRequired: false },
    { skill: 'Python', status: 'additional', isRequired: false },
    { skill: 'Django', status: 'additional', isRequired: false },
    { skill: 'Machine Learning', status: 'additional', isRequired: false },
    { skill: 'TensorFlow', status: 'additional', isRequired: false },
  ],
  experienceMatch: {
    requiredMin: 5,
    requiredMax: 10,
    candidateYears: 3,
    matchPercentage: 40,
  },
  educationMatch: {
    required: 'B.Tech/B.E. in Computer Science or related field',
    candidate: 'M.Tech in Computer Science, IISc Bangalore (2023)',
    isMatch: true,
  },
  certificationMatch: [
    { certification: 'AWS Solutions Architect', status: 'missing', isRequired: false },
    { certification: 'Kubernetes Administrator (CKA)', status: 'missing', isRequired: false },
    { certification: 'TensorFlow Developer Certificate', status: 'additional', isRequired: false },
  ],
  radarData: [
    { category: 'Technical Skills', jdScore: 100, candidateScore: 25 },
    { category: 'Experience', jdScore: 100, candidateScore: 40 },
    { category: 'Education', jdScore: 100, candidateScore: 100 },
    { category: 'Certifications', jdScore: 100, candidateScore: 0 },
    { category: 'Domain Knowledge', jdScore: 100, candidateScore: 30 },
    { category: 'Communication', jdScore: 100, candidateScore: 75 },
  ],
  skillsScore: 25,
  experienceScore: 40,
  educationScore: 100,
  certificationScore: 0,
  domainScore: 30,
  communicationScore: 75,
};

export const CANDIDATE_4_RESUME: ResumeHighlights = {
  summary:
    'Machine learning engineer with 3 years of experience in Python and data science. M.Tech from IISc Bangalore with focus on NLP and deep learning. Looking to transition into software engineering roles.',
  workExperience: [
    {
      company: 'Razorpay',
      role: 'ML Engineer',
      duration: '2 years',
      startDate: '2024-01',
      highlights: [
        'Built fraud detection ML models reducing false positives by 35%',
        'Developed Python-based REST APIs for model serving',
        'Created data pipelines processing 10M+ transactions daily',
      ],
    },
    {
      company: 'Samsung R&D',
      role: 'Research Intern',
      duration: '1 year',
      startDate: '2022-06',
      endDate: '2023-06',
      highlights: [
        'Published paper on NLP-based intent classification',
        'Built Django-based annotation tool for training data',
      ],
    },
  ],
  education: [
    { degree: 'M.Tech in Computer Science', institution: 'IISc Bangalore', year: 2023, grade: '9.1 CGPA' },
    { degree: 'B.Tech in Computer Science', institution: 'VIT Vellore', year: 2021, grade: '8.7 CGPA' },
  ],
  skills: ['Python', 'Django', 'TensorFlow', 'PyTorch', 'Machine Learning', 'REST APIs', 'SQL', 'Git', 'Pandas', 'NumPy'],
  certifications: [
    { name: 'TensorFlow Developer Certificate', issuer: 'Google', year: 2024 },
  ],
  projects: [
    {
      name: 'Fraud Detection System',
      description: 'ML-based real-time fraud detection with 99.2% accuracy',
      technologies: ['Python', 'TensorFlow', 'Flask', 'PostgreSQL'],
    },
  ],
  jdMatchedKeywords: ['REST APIs', 'Git', 'scalable'],
};

export const CANDIDATE_4_INTERVIEW_VS_JD: InterviewVsJDComparison[] = [
  { jdSkill: 'React / Frontend', interviewScore: 1.0, maxScore: 5, gap: 4.0, status: 'below' },
  { jdSkill: 'Node.js / Backend', interviewScore: 1.5, maxScore: 5, gap: 3.5, status: 'below' },
  { jdSkill: 'System Design', interviewScore: 2.5, maxScore: 5, gap: 2.5, status: 'below' },
  { jdSkill: 'TypeScript', interviewScore: 1.0, maxScore: 5, gap: 4.0, status: 'below' },
  { jdSkill: 'Database / SQL', interviewScore: 3.0, maxScore: 5, gap: 1.0, status: 'below' },
  { jdSkill: 'Cloud / DevOps', interviewScore: 1.5, maxScore: 5, gap: 2.5, status: 'below' },
  { jdSkill: 'Communication', interviewScore: 4.0, maxScore: 5, gap: 0, status: 'meets' },
  { jdSkill: 'Problem Solving', interviewScore: 4.5, maxScore: 5, gap: 0, status: 'exceeds' },
];

export const CANDIDATE_4_RECOMMENDATION: JDFitRecommendation = {
  overallFit: 'poor_fit',
  jdMatchScore: 42,
  interviewScore: 48,
  combinedScore: 45,
  strengths: [
    'Excellent educational qualifications (M.Tech from IISc)',
    'Strong analytical and problem-solving skills',
    'Good communication skills',
    'Python/ML expertise could be useful for AI features',
  ],
  gaps: [
    'Missing all core required skills (React, Node.js, TypeScript, PostgreSQL)',
    'Only 3 years experience vs 5 years required',
    'No web development or cloud infrastructure experience',
    'Profile is ML-focused, not aligned with full-stack SWE role',
  ],
  recommendation:
    'Not recommended for this Senior SWE role. While the candidate has strong academic credentials and ML skills, they lack the core web development skills required. Consider for ML Engineer or Data Science roles instead.',
};

// ─── Helper to get data by candidate ID ───────────────────────────

export function getCandidateComparisonData(candidateId: string) {
  const dataMap: Record<string, {
    comparison: JDCandidateComparison;
    resume: ResumeHighlights;
    interviewVsJD: InterviewVsJDComparison[];
    recommendation: JDFitRecommendation;
  }> = {
    '1': {
      comparison: CANDIDATE_1_COMPARISON,
      resume: CANDIDATE_1_RESUME,
      interviewVsJD: CANDIDATE_1_INTERVIEW_VS_JD,
      recommendation: CANDIDATE_1_RECOMMENDATION,
    },
    '2': {
      comparison: CANDIDATE_2_COMPARISON,
      resume: CANDIDATE_2_RESUME,
      interviewVsJD: CANDIDATE_2_INTERVIEW_VS_JD,
      recommendation: CANDIDATE_2_RECOMMENDATION,
    },
    '3': {
      comparison: CANDIDATE_3_COMPARISON,
      resume: CANDIDATE_3_RESUME,
      interviewVsJD: CANDIDATE_3_INTERVIEW_VS_JD,
      recommendation: CANDIDATE_3_RECOMMENDATION,
    },
    '4': {
      comparison: CANDIDATE_4_COMPARISON,
      resume: CANDIDATE_4_RESUME,
      interviewVsJD: CANDIDATE_4_INTERVIEW_VS_JD,
      recommendation: CANDIDATE_4_RECOMMENDATION,
    },
  };
  return dataMap[candidateId] || dataMap['1'];
}
