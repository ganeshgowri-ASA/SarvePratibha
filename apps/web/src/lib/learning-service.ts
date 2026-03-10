// ─── Learning Service ─────────────────────────────────────────────────────────
// Mock API service that simulates fetching courses from Coursera, LinkedIn
// Learning, Udemy, YouTube, Vimeo, Dailymotion, and internal platforms.

export type Platform =
  | 'Coursera'
  | 'LinkedIn Learning'
  | 'Udemy'
  | 'YouTube'
  | 'Vimeo'
  | 'Dailymotion'
  | 'Articulate 360'
  | 'Internal';

export type Category =
  | 'Technical'
  | 'Soft Skills'
  | 'Compliance'
  | 'Leadership'
  | 'Business'
  | 'Domain';

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type VideoProvider = 'youtube' | 'vimeo' | 'dailymotion';
export type CourseStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoProvider: VideoProvider;
  videoId: string;
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  category: Category;
  level: Level;
  duration: string;
  instructor: string;
  rating: number;
  enrollments: number;
  modules: CourseModule[];
  hasCertificate: boolean;
  mandatory?: boolean;
  dueDate?: string;
  tags: string[];
}

export interface CourseProgress {
  status: CourseStatus;
  completedModules: string[];
  lastModuleId: string | null;
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
}

// ─── Full Course Catalog ───────────────────────────────────────────────────────
export const ALL_COURSES: CourseData[] = [
  // ── Coursera ──────────────────────────────────────────────────────────────
  {
    id: 'c1',
    title: 'Machine Learning Specialization',
    description:
      'Master fundamental AI concepts and develop practical machine learning skills. Learn supervised learning, unsupervised learning, recommender systems, and reinforcement learning with best practices from Stanford University.',
    platform: 'Coursera',
    category: 'Technical',
    level: 'Intermediate',
    duration: '12h',
    instructor: 'Andrew Ng',
    rating: 4.9,
    enrollments: 320,
    hasCertificate: true,
    mandatory: false,
    dueDate: '2026-04-30',
    tags: ['ML', 'AI', 'Python', 'Neural Networks'],
    modules: [
      { id: 'c1-m1', title: 'Introduction to Machine Learning', duration: '30 min', description: 'Overview of ML types, real-world applications, and course roadmap.', videoProvider: 'youtube', videoId: 'jGwO_UgTS7I' },
      { id: 'c1-m2', title: 'Linear Regression', duration: '45 min', description: 'Univariate linear regression, cost functions, and model evaluation.', videoProvider: 'youtube', videoId: 'kHwlB_j7Hkc' },
      { id: 'c1-m3', title: 'Gradient Descent', duration: '40 min', description: 'Optimization algorithm for minimizing cost functions in ML models.', videoProvider: 'youtube', videoId: 'sDv4f4s2SB8' },
      { id: 'c1-m4', title: 'Logistic Regression', duration: '45 min', description: 'Binary classification, sigmoid function, and decision boundaries.', videoProvider: 'youtube', videoId: '-la3q9d7AKQ' },
      { id: 'c1-m5', title: 'Neural Networks Basics', duration: '55 min', description: 'Architecture of artificial neural networks, activations, and forward pass.', videoProvider: 'youtube', videoId: 'aircAruvnKk' },
      { id: 'c1-m6', title: 'Training Neural Networks', duration: '50 min', description: 'Backpropagation, chain rule, and optimization strategies.', videoProvider: 'youtube', videoId: 'tIeHLnjs5U8' },
      { id: 'c1-m7', title: 'Unsupervised Learning', duration: '45 min', description: 'Clustering (K-means), dimensionality reduction, and anomaly detection.', videoProvider: 'youtube', videoId: 'IUn8k5zSI6g' },
      { id: 'c1-m8', title: 'Final Assessment & Certificate', duration: '60 min', description: 'Complete the comprehensive exam to earn your ML Specialization certificate.', videoProvider: 'youtube', videoId: 'jGwO_UgTS7I' },
    ],
  },
  {
    id: 'c2',
    title: 'Google Project Management',
    description:
      'Learn project management skills from Google experts. Prepare for a career in project management with hands-on projects and real-world scenarios covering the full project lifecycle.',
    platform: 'Coursera',
    category: 'Business',
    level: 'Beginner',
    duration: '8h',
    instructor: 'Google',
    rating: 4.7,
    enrollments: 250,
    hasCertificate: true,
    mandatory: false,
    dueDate: '2026-04-15',
    tags: ['Project Management', 'Agile', 'PMP'],
    modules: [
      { id: 'c2-m1', title: 'Foundations of Project Management', duration: '40 min', description: 'Roles, responsibilities, and the project lifecycle overview.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
      { id: 'c2-m2', title: 'Project Initiation', duration: '45 min', description: 'Defining goals, scope, success criteria, and stakeholder mapping.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
      { id: 'c2-m3', title: 'Project Planning', duration: '50 min', description: 'Work breakdown structure, scheduling, budgeting, and risk planning.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
      { id: 'c2-m4', title: 'Agile Project Management', duration: '45 min', description: 'Scrum, Kanban, and Agile best practices for iterative delivery.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
      { id: 'c2-m5', title: 'Project Execution & Closure', duration: '40 min', description: 'Tracking progress, managing changes, and closing projects effectively.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
    ],
  },
  {
    id: 'c3',
    title: 'AWS Cloud Practitioner',
    description:
      'Prepare for the AWS Certified Cloud Practitioner exam with hands-on labs, real-world scenarios, and deep dives into core AWS services including EC2, S3, RDS, and VPC.',
    platform: 'Coursera',
    category: 'Technical',
    level: 'Beginner',
    duration: '10h',
    instructor: 'AWS Training',
    rating: 4.8,
    enrollments: 180,
    hasCertificate: true,
    mandatory: false,
    dueDate: '2026-05-31',
    tags: ['AWS', 'Cloud', 'DevOps', 'Certification'],
    modules: [
      { id: 'c3-m1', title: 'Cloud Computing Fundamentals', duration: '35 min', description: 'What is cloud? IaaS vs PaaS vs SaaS and the AWS global infrastructure.', videoProvider: 'youtube', videoId: '3hLmDS179YE' },
      { id: 'c3-m2', title: 'Core AWS Services', duration: '50 min', description: 'EC2, S3, RDS, Lambda — the essential building blocks.', videoProvider: 'youtube', videoId: '3hLmDS179YE' },
      { id: 'c3-m3', title: 'AWS Security & IAM', duration: '45 min', description: 'Identity and Access Management, policies, roles, and security best practices.', videoProvider: 'youtube', videoId: '3hLmDS179YE' },
      { id: 'c3-m4', title: 'Pricing & Billing', duration: '40 min', description: 'AWS pricing models, cost optimization, and the Trusted Advisor.', videoProvider: 'youtube', videoId: '3hLmDS179YE' },
      { id: 'c3-m5', title: 'Practice Exam & Certification', duration: '60 min', description: 'Full-length practice exam with explanations. Ready for the real thing!', videoProvider: 'youtube', videoId: '3hLmDS179YE' },
    ],
  },

  // ── LinkedIn Learning ──────────────────────────────────────────────────────
  {
    id: 'l1',
    title: 'Leadership Foundations',
    description:
      'Develop essential leadership skills. Learn to inspire teams, communicate vision, drive results, and build a culture of high performance and psychological safety.',
    platform: 'LinkedIn Learning',
    category: 'Leadership',
    level: 'Beginner',
    duration: '6h',
    instructor: 'Lisa Earle McLeod',
    rating: 4.6,
    enrollments: 410,
    hasCertificate: true,
    mandatory: true,
    dueDate: '2026-03-15',
    tags: ['Leadership', 'Management', 'Teams', 'Communication'],
    modules: [
      { id: 'l1-m1', title: 'What Makes a Great Leader?', duration: '35 min', description: 'Key traits, mindsets, and behaviours of effective leaders across industries.', videoProvider: 'youtube', videoId: 'qp0HIF3SfI4' },
      { id: 'l1-m2', title: 'Communicating Vision', duration: '40 min', description: 'How to articulate a compelling vision that aligns and motivates your team.', videoProvider: 'youtube', videoId: 'qp0HIF3SfI4' },
      { id: 'l1-m3', title: 'Building Psychological Safety', duration: '45 min', description: 'Creating an environment where team members feel safe to take risks and innovate.', videoProvider: 'youtube', videoId: 'LhoLuui9gX8' },
      { id: 'l1-m4', title: 'Giving Effective Feedback', duration: '35 min', description: 'Frameworks for delivering constructive, motivating feedback that drives growth.', videoProvider: 'youtube', videoId: 'LhoLuui9gX8' },
      { id: 'l1-m5', title: 'Leading Through Change', duration: '40 min', description: 'Managing organizational change, overcoming resistance, and driving adoption.', videoProvider: 'youtube', videoId: 'LhoLuui9gX8' },
    ],
  },
  {
    id: 'l2',
    title: 'Communication Skills for Professionals',
    description:
      'Master interpersonal communication, active listening, and persuasive speaking for the modern workplace. Includes email writing, presentations, and difficult conversations.',
    platform: 'LinkedIn Learning',
    category: 'Soft Skills',
    level: 'Beginner',
    duration: '4h',
    instructor: 'Brenda Bailey-Hughes',
    rating: 4.5,
    enrollments: 550,
    hasCertificate: true,
    mandatory: false,
    tags: ['Communication', 'Presentations', 'Writing', 'Listening'],
    modules: [
      { id: 'l2-m1', title: 'Foundations of Communication', duration: '30 min', description: 'Communication models, channels, and overcoming barriers in the workplace.', videoProvider: 'youtube', videoId: 'HAnw168huqA' },
      { id: 'l2-m2', title: 'Active Listening', duration: '35 min', description: 'Techniques for deep listening, paraphrasing, and clarifying understanding.', videoProvider: 'youtube', videoId: 'HAnw168huqA' },
      { id: 'l2-m3', title: 'Business Writing', duration: '30 min', description: 'Writing clear, concise emails, reports, and professional documents.', videoProvider: 'youtube', videoId: 'HAnw168huqA' },
      { id: 'l2-m4', title: 'Presentation Skills', duration: '40 min', description: 'Structuring and delivering impactful presentations with confidence.', videoProvider: 'youtube', videoId: 'iCvmsMzlF7o' },
    ],
  },
  {
    id: 'l3',
    title: 'Agile Project Management',
    description:
      'Learn Scrum, Kanban, and Agile frameworks to manage projects efficiently and deliver value faster. Covers sprint planning, retrospectives, and scaling Agile.',
    platform: 'LinkedIn Learning',
    category: 'Business',
    level: 'Intermediate',
    duration: '5h',
    instructor: 'Doug Rose',
    rating: 4.4,
    enrollments: 290,
    hasCertificate: true,
    mandatory: false,
    tags: ['Agile', 'Scrum', 'Kanban', 'Sprint'],
    modules: [
      { id: 'l3-m1', title: 'Agile Manifesto & Principles', duration: '30 min', description: 'The origin and values of Agile. Why Agile? When to use it.', videoProvider: 'youtube', videoId: 'Z9QbYZh1YXY' },
      { id: 'l3-m2', title: 'Scrum Framework', duration: '40 min', description: 'Roles (PO, SM, Dev Team), ceremonies, and artifacts in Scrum.', videoProvider: 'youtube', videoId: 'Z9QbYZh1YXY' },
      { id: 'l3-m3', title: 'Kanban & Flow', duration: '35 min', description: 'Visual workflow management, WIP limits, and continuous delivery.', videoProvider: 'youtube', videoId: 'Z9QbYZh1YXY' },
      { id: 'l3-m4', title: 'Sprint Planning & Retrospectives', duration: '35 min', description: 'Effective sprint ceremonies that drive improvement and velocity.', videoProvider: 'youtube', videoId: 'Z9QbYZh1YXY' },
    ],
  },

  // ── Udemy ─────────────────────────────────────────────────────────────────
  {
    id: 'u1',
    title: 'React Complete Guide',
    description:
      'Build React applications from scratch. Covers hooks, Redux Toolkit, Next.js, routing, authentication, testing, and deployment with real-world projects.',
    platform: 'Udemy',
    category: 'Technical',
    level: 'Intermediate',
    duration: '16h',
    instructor: 'Maximilian Schwarzmüller',
    rating: 4.7,
    enrollments: 180,
    hasCertificate: false,
    mandatory: false,
    dueDate: '2026-05-31',
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    modules: [
      { id: 'u1-m1', title: 'React Fundamentals', duration: '60 min', description: 'JSX, components, props, and the virtual DOM.', videoProvider: 'youtube', videoId: 'w7ejDZ8SWv8' },
      { id: 'u1-m2', title: 'State & Hooks', duration: '55 min', description: 'useState, useEffect, useContext, and custom hooks.', videoProvider: 'youtube', videoId: 'w7ejDZ8SWv8' },
      { id: 'u1-m3', title: 'Redux Toolkit', duration: '60 min', description: 'Centralized state management with Redux Toolkit and RTK Query.', videoProvider: 'youtube', videoId: 'w7ejDZ8SWv8' },
      { id: 'u1-m4', title: 'React Router', duration: '45 min', description: 'Client-side routing, nested routes, protected routes, and URL params.', videoProvider: 'youtube', videoId: 'w7ejDZ8SWv8' },
      { id: 'u1-m5', title: 'Forms & Validation', duration: '50 min', description: 'Controlled components, React Hook Form, and Zod validation.', videoProvider: 'youtube', videoId: 'w7ejDZ8SWv8' },
      { id: 'u1-m6', title: 'Performance Optimization', duration: '45 min', description: 'Memoization, code splitting, lazy loading, and profiling.', videoProvider: 'youtube', videoId: 'w7ejDZ8SWv8' },
    ],
  },
  {
    id: 'u2',
    title: 'Python for Data Science',
    description:
      'Learn Python, NumPy, Pandas, Matplotlib, and Scikit-learn for data analysis, visualization, and machine learning. Includes 10+ hands-on projects.',
    platform: 'Udemy',
    category: 'Technical',
    level: 'Beginner',
    duration: '10h',
    instructor: 'Jose Portilla',
    rating: 4.6,
    enrollments: 220,
    hasCertificate: false,
    mandatory: false,
    tags: ['Python', 'Data Science', 'Pandas', 'NumPy'],
    modules: [
      { id: 'u2-m1', title: 'Python Basics', duration: '45 min', description: 'Variables, data types, control flow, functions, and OOP in Python.', videoProvider: 'youtube', videoId: '_uQrJ0TkZlc' },
      { id: 'u2-m2', title: 'NumPy Arrays', duration: '40 min', description: 'Array operations, broadcasting, and scientific computing with NumPy.', videoProvider: 'youtube', videoId: '_uQrJ0TkZlc' },
      { id: 'u2-m3', title: 'Data Analysis with Pandas', duration: '50 min', description: 'DataFrames, data cleaning, merging, groupby, and pivot tables.', videoProvider: 'youtube', videoId: '_uQrJ0TkZlc' },
      { id: 'u2-m4', title: 'Data Visualization', duration: '45 min', description: 'Creating charts with Matplotlib and Seaborn for data storytelling.', videoProvider: 'youtube', videoId: '_uQrJ0TkZlc' },
      { id: 'u2-m5', title: 'Machine Learning with Scikit-learn', duration: '55 min', description: 'Classification, regression, clustering, and model evaluation.', videoProvider: 'youtube', videoId: '_uQrJ0TkZlc' },
    ],
  },
  {
    id: 'u3',
    title: 'DevOps Bootcamp',
    description:
      'Complete DevOps training covering Docker, Kubernetes, CI/CD pipelines, Terraform, and cloud deployments. Industry-level projects and real scenarios.',
    platform: 'Udemy',
    category: 'Technical',
    level: 'Advanced',
    duration: '20h',
    instructor: 'Mumshad Mannambeth',
    rating: 4.8,
    enrollments: 150,
    hasCertificate: false,
    mandatory: false,
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    modules: [
      { id: 'u3-m1', title: 'Linux & Shell Scripting', duration: '60 min', description: 'Linux fundamentals and bash scripting for DevOps engineers.', videoProvider: 'youtube', videoId: 'Jl4bNbHVmGY' },
      { id: 'u3-m2', title: 'Docker Fundamentals', duration: '65 min', description: 'Containers, images, Dockerfile, Docker Compose, and registries.', videoProvider: 'youtube', videoId: 'Jl4bNbHVmGY' },
      { id: 'u3-m3', title: 'Kubernetes Core Concepts', duration: '70 min', description: 'Pods, deployments, services, ConfigMaps, and namespaces.', videoProvider: 'youtube', videoId: 'Jl4bNbHVmGY' },
      { id: 'u3-m4', title: 'CI/CD with GitHub Actions', duration: '60 min', description: 'Automated testing, building, and deploying with GitHub Actions pipelines.', videoProvider: 'youtube', videoId: 'Jl4bNbHVmGY' },
      { id: 'u3-m5', title: 'Infrastructure as Code (Terraform)', duration: '65 min', description: 'Provisioning cloud infrastructure declaratively with Terraform.', videoProvider: 'youtube', videoId: 'Jl4bNbHVmGY' },
    ],
  },

  // ── YouTube (as a Platform) ───────────────────────────────────────────────
  {
    id: 'yt1',
    title: 'JavaScript Full Course',
    description:
      'Complete JavaScript course covering ES6+, DOM manipulation, async/await, Promises, Fetch API, and modern patterns. Ideal for developers transitioning to full-stack.',
    platform: 'YouTube',
    category: 'Technical',
    level: 'Beginner',
    duration: '8h',
    instructor: 'Traversy Media',
    rating: 4.7,
    enrollments: 600,
    hasCertificate: false,
    mandatory: false,
    tags: ['JavaScript', 'ES6', 'Frontend', 'DOM'],
    modules: [
      { id: 'yt1-m1', title: 'JavaScript Basics', duration: '50 min', description: 'Variables, data types, operators, and control structures.', videoProvider: 'youtube', videoId: 'hdI2bqOjy3c' },
      { id: 'yt1-m2', title: 'Functions & Scope', duration: '45 min', description: 'Functions, closures, scope chains, and the this keyword.', videoProvider: 'youtube', videoId: 'hdI2bqOjy3c' },
      { id: 'yt1-m3', title: 'DOM Manipulation', duration: '50 min', description: 'Selecting, modifying, and creating DOM elements dynamically.', videoProvider: 'youtube', videoId: 'hdI2bqOjy3c' },
      { id: 'yt1-m4', title: 'Async JavaScript', duration: '55 min', description: 'Callbacks, Promises, async/await, and the Fetch API.', videoProvider: 'youtube', videoId: 'hdI2bqOjy3c' },
      { id: 'yt1-m5', title: 'ES6+ Features', duration: '45 min', description: 'Arrow functions, destructuring, spread, modules, and more.', videoProvider: 'youtube', videoId: 'hdI2bqOjy3c' },
    ],
  },
  {
    id: 'yt2',
    title: 'Git & GitHub for Beginners',
    description:
      'Everything you need to know about version control with Git and GitHub. Covers branching strategies, pull requests, merge conflicts, and team workflows.',
    platform: 'YouTube',
    category: 'Technical',
    level: 'Beginner',
    duration: '3h',
    instructor: 'freeCodeCamp',
    rating: 4.8,
    enrollments: 800,
    hasCertificate: false,
    mandatory: false,
    tags: ['Git', 'GitHub', 'Version Control'],
    modules: [
      { id: 'yt2-m1', title: 'Git Basics', duration: '40 min', description: 'Initialize repos, stage, commit, and view history.', videoProvider: 'youtube', videoId: 'mJ3bGvy0WAY' },
      { id: 'yt2-m2', title: 'Branching & Merging', duration: '35 min', description: 'Create branches, merge, and resolve conflicts like a pro.', videoProvider: 'youtube', videoId: 'mJ3bGvy0WAY' },
      { id: 'yt2-m3', title: 'GitHub Collaboration', duration: '40 min', description: 'Forks, pull requests, code reviews, and team collaboration.', videoProvider: 'youtube', videoId: 'mJ3bGvy0WAY' },
    ],
  },
  {
    id: 'yt3',
    title: 'Emotional Intelligence at Work',
    description:
      'Develop self-awareness, empathy, and emotional regulation skills essential for workplace success. Based on Daniel Goleman\'s EI framework with practical exercises.',
    platform: 'YouTube',
    category: 'Soft Skills',
    level: 'Beginner',
    duration: '2.5h',
    instructor: 'TED-Ed',
    rating: 4.6,
    enrollments: 430,
    hasCertificate: false,
    mandatory: false,
    tags: ['EQ', 'Soft Skills', 'Self-awareness', 'Empathy'],
    modules: [
      { id: 'yt3-m1', title: 'Understanding Emotional Intelligence', duration: '30 min', description: 'The science behind EQ and why it matters more than IQ.', videoProvider: 'youtube', videoId: 'iCvmsMzlF7o' },
      { id: 'yt3-m2', title: 'Self-Awareness & Regulation', duration: '35 min', description: 'Identifying your emotions and managing responses under pressure.', videoProvider: 'youtube', videoId: 'iCvmsMzlF7o' },
      { id: 'yt3-m3', title: 'Empathy & Social Skills', duration: '30 min', description: 'Building deeper connections and reading the room in the workplace.', videoProvider: 'youtube', videoId: 'iCvmsMzlF7o' },
    ],
  },

  // ── Vimeo ─────────────────────────────────────────────────────────────────
  {
    id: 'vi1',
    title: 'Design Thinking for Innovation',
    description:
      'Apply Stanford d.school\'s Design Thinking methodology to solve complex business problems. Learn empathize, define, ideate, prototype, and test phases.',
    platform: 'Vimeo',
    category: 'Business',
    level: 'Intermediate',
    duration: '5h',
    instructor: 'IDEO U',
    rating: 4.7,
    enrollments: 280,
    hasCertificate: true,
    mandatory: false,
    tags: ['Design Thinking', 'Innovation', 'Problem Solving'],
    modules: [
      { id: 'vi1-m1', title: 'Empathy — Understanding Users', duration: '45 min', description: 'User research methods: interviews, observation, and empathy maps.', videoProvider: 'vimeo', videoId: '148751763' },
      { id: 'vi1-m2', title: 'Define the Problem', duration: '40 min', description: 'Synthesizing research into actionable problem statements (HMW questions).', videoProvider: 'vimeo', videoId: '148751763' },
      { id: 'vi1-m3', title: 'Ideation Techniques', duration: '45 min', description: 'Brainstorming, SCAMPER, mind maps, and idea selection methods.', videoProvider: 'vimeo', videoId: '148751763' },
      { id: 'vi1-m4', title: 'Prototyping & Testing', duration: '50 min', description: 'Rapid prototyping, user testing, and iterating based on feedback.', videoProvider: 'vimeo', videoId: '148751763' },
    ],
  },
  {
    id: 'vi2',
    title: 'Public Speaking Mastery',
    description:
      'Overcome stage fright and develop compelling presentation skills. From TED-style talks to boardroom pitches, master the art of public speaking with confidence.',
    platform: 'Vimeo',
    category: 'Soft Skills',
    level: 'Intermediate',
    duration: '4h',
    instructor: 'Chris Anderson (TED)',
    rating: 4.8,
    enrollments: 360,
    hasCertificate: true,
    mandatory: false,
    tags: ['Public Speaking', 'Presentations', 'Confidence'],
    modules: [
      { id: 'vi2-m1', title: 'Conquering Fear & Anxiety', duration: '35 min', description: 'Practical techniques to manage nerves before and during speeches.', videoProvider: 'vimeo', videoId: '22439234' },
      { id: 'vi2-m2', title: 'Structuring Your Talk', duration: '40 min', description: 'Opening hooks, narrative arcs, and memorable closings.', videoProvider: 'vimeo', videoId: '22439234' },
      { id: 'vi2-m3', title: 'Voice, Pace & Body Language', duration: '35 min', description: 'Using vocal variety, pauses, and confident body language effectively.', videoProvider: 'vimeo', videoId: '22439234' },
      { id: 'vi2-m4', title: 'Q&A and Handling Tough Questions', duration: '30 min', description: 'Gracefully managing challenging questions from your audience.', videoProvider: 'vimeo', videoId: '22439234' },
    ],
  },

  // ── Dailymotion ───────────────────────────────────────────────────────────
  {
    id: 'dm1',
    title: 'Time Management & Productivity',
    description:
      'Master time management techniques including GTD, time blocking, and Pomodoro. Eliminate procrastination and achieve peak productivity in the workplace.',
    platform: 'Dailymotion',
    category: 'Soft Skills',
    level: 'Beginner',
    duration: '3h',
    instructor: 'Brian Tracy',
    rating: 4.5,
    enrollments: 320,
    hasCertificate: false,
    mandatory: false,
    tags: ['Productivity', 'Time Management', 'GTD', 'Focus'],
    modules: [
      { id: 'dm1-m1', title: 'Principles of Time Management', duration: '35 min', description: 'The 80/20 rule, prioritization, and energy management fundamentals.', videoProvider: 'dailymotion', videoId: 'x7tgwm1' },
      { id: 'dm1-m2', title: 'GTD — Getting Things Done', duration: '40 min', description: 'David Allen\'s proven system for capturing, clarifying, and organizing tasks.', videoProvider: 'dailymotion', videoId: 'x7tgwm1' },
      { id: 'dm1-m3', title: 'Deep Work & Focus', duration: '35 min', description: 'Cal Newport\'s Deep Work principles for cognitive productivity.', videoProvider: 'dailymotion', videoId: 'x7tgwm1' },
    ],
  },
  {
    id: 'dm2',
    title: 'Microsoft Excel for Business',
    description:
      'From basics to advanced formulas, pivot tables, VLOOKUP, and Excel dashboards. Automate repetitive tasks with macros and VBA. Essential for business professionals.',
    platform: 'Dailymotion',
    category: 'Business',
    level: 'Beginner',
    duration: '6h',
    instructor: 'Kevin Stratvert',
    rating: 4.6,
    enrollments: 450,
    hasCertificate: false,
    mandatory: false,
    tags: ['Excel', 'Spreadsheets', 'Data Analysis', 'Macros'],
    modules: [
      { id: 'dm2-m1', title: 'Excel Basics & Navigation', duration: '40 min', description: 'Workbooks, worksheets, cells, formatting, and essential functions.', videoProvider: 'dailymotion', videoId: 'x6zj6ql' },
      { id: 'dm2-m2', title: 'Formulas & Functions', duration: '50 min', description: 'SUM, VLOOKUP, IF, INDEX-MATCH, and array formulas.', videoProvider: 'dailymotion', videoId: 'x6zj6ql' },
      { id: 'dm2-m3', title: 'Pivot Tables & Charts', duration: '45 min', description: 'Create interactive reports and charts from raw data.', videoProvider: 'dailymotion', videoId: 'x6zj6ql' },
      { id: 'dm2-m4', title: 'Excel Dashboards', duration: '50 min', description: 'Build professional, interactive dashboards for business reporting.', videoProvider: 'dailymotion', videoId: 'x6zj6ql' },
    ],
  },

  // ── Articulate 360 (Internal Compliance) ─────────────────────────────────
  {
    id: 'a1',
    title: 'Annual Compliance Training',
    description:
      'Mandatory annual compliance training covering company policies, regulatory requirements, data privacy (GDPR/DPDP), and ethical guidelines for all employees.',
    platform: 'Articulate 360',
    category: 'Compliance',
    level: 'Beginner',
    duration: '3h',
    instructor: 'Legal & Compliance Team',
    rating: 4.2,
    enrollments: 890,
    hasCertificate: true,
    mandatory: true,
    dueDate: '2026-01-31',
    tags: ['Compliance', 'GDPR', 'Policy', 'Ethics'],
    modules: [
      { id: 'a1-m1', title: 'Code of Conduct', duration: '35 min', description: 'Company values, ethical standards, and expected behaviours.', videoProvider: 'youtube', videoId: '5IcG7dVJHog' },
      { id: 'a1-m2', title: 'Data Privacy & GDPR', duration: '40 min', description: 'Personal data handling, consent, rights, and breach reporting.', videoProvider: 'youtube', videoId: '5IcG7dVJHog' },
      { id: 'a1-m3', title: 'Anti-Bribery & Corruption', duration: '35 min', description: 'Recognizing and avoiding corrupt practices, gifts policy, and reporting.', videoProvider: 'youtube', videoId: '5IcG7dVJHog' },
      { id: 'a1-m4', title: 'Cybersecurity Basics', duration: '30 min', description: 'Password hygiene, phishing, social engineering, and incident reporting.', videoProvider: 'youtube', videoId: '5IcG7dVJHog' },
    ],
  },
  {
    id: 'a2',
    title: 'Safety Induction',
    description:
      'Workplace safety procedures, emergency protocols, fire safety, first aid, and hazard identification. Required for all new employees within the first week.',
    platform: 'Articulate 360',
    category: 'Compliance',
    level: 'Beginner',
    duration: '1.5h',
    instructor: 'EHS Team',
    rating: 4.0,
    enrollments: 870,
    hasCertificate: true,
    mandatory: true,
    dueDate: '2026-02-15',
    tags: ['Safety', 'EHS', 'Emergency', 'Compliance'],
    modules: [
      { id: 'a2-m1', title: 'Workplace Hazards & Risk Assessment', duration: '30 min', description: 'Identifying hazards, risk assessment, and control measures.', videoProvider: 'youtube', videoId: 'MH7qG0EqW_k' },
      { id: 'a2-m2', title: 'Emergency Procedures', duration: '25 min', description: 'Fire evacuation, muster points, first aid, and emergency contacts.', videoProvider: 'youtube', videoId: 'MH7qG0EqW_k' },
      { id: 'a2-m3', title: 'Ergonomics & Wellbeing', duration: '25 min', description: 'Workstation setup, repetitive strain prevention, and mental health.', videoProvider: 'youtube', videoId: 'MH7qG0EqW_k' },
    ],
  },
  {
    id: 'a3',
    title: 'Prevention of Sexual Harassment (POSH)',
    description:
      'Understanding the POSH Act, recognizing workplace harassment, prevention measures, reporting procedures, and the Internal Complaints Committee (ICC) process.',
    platform: 'Articulate 360',
    category: 'Compliance',
    level: 'Beginner',
    duration: '1h',
    instructor: 'HR & Legal Team',
    rating: 4.1,
    enrollments: 860,
    hasCertificate: true,
    mandatory: true,
    dueDate: '2026-03-01',
    tags: ['POSH', 'Harassment', 'Compliance', 'Workplace'],
    modules: [
      { id: 'a3-m1', title: 'What is Sexual Harassment?', duration: '20 min', description: 'Defining sexual harassment, quid pro quo vs. hostile environment.', videoProvider: 'youtube', videoId: 'VGN55Hblxbg' },
      { id: 'a3-m2', title: 'Reporting & ICC Process', duration: '25 min', description: 'How to report incidents, ICC investigation, and support mechanisms.', videoProvider: 'youtube', videoId: 'VGN55Hblxbg' },
      { id: 'a3-m3', title: 'Building a Respectful Workplace', duration: '15 min', description: 'Bystander intervention, creating inclusive environments, and best practices.', videoProvider: 'youtube', videoId: 'VGN55Hblxbg' },
    ],
  },

  // ── Internal ──────────────────────────────────────────────────────────────
  {
    id: 'i1',
    title: 'Company Orientation',
    description:
      'Welcome to SarvePratibha! Learn about our mission, vision, values, organizational structure, benefits, key processes, and what makes our culture unique.',
    platform: 'Internal',
    category: 'Domain',
    level: 'Beginner',
    duration: '2h',
    instructor: 'HR Team',
    rating: 4.3,
    enrollments: 920,
    hasCertificate: true,
    mandatory: true,
    dueDate: '2026-01-15',
    tags: ['Onboarding', 'Culture', 'HR', 'Benefits'],
    modules: [
      { id: 'i1-m1', title: 'Our Mission & Vision', duration: '25 min', description: 'The story of SarvePratibha, our purpose, and long-term goals.', videoProvider: 'youtube', videoId: 'qp0HIF3SfI4' },
      { id: 'i1-m2', title: 'Organizational Structure', duration: '20 min', description: 'Departments, leadership team, reporting lines, and key contacts.', videoProvider: 'youtube', videoId: 'qp0HIF3SfI4' },
      { id: 'i1-m3', title: 'Benefits & Policies', duration: '30 min', description: 'Leave policies, insurance, payroll, and employee benefits overview.', videoProvider: 'youtube', videoId: 'qp0HIF3SfI4' },
      { id: 'i1-m4', title: 'Tools & Systems', duration: '25 min', description: 'HRMS walkthrough, IT setup, collaboration tools, and key systems.', videoProvider: 'youtube', videoId: 'qp0HIF3SfI4' },
    ],
  },
  {
    id: 'i2',
    title: 'Product Training',
    description:
      'Deep dive into our product suite, features, roadmap, and competitive landscape. Essential for all customer-facing roles and product teams.',
    platform: 'Internal',
    category: 'Domain',
    level: 'Intermediate',
    duration: '6h',
    instructor: 'Product Team',
    rating: 4.5,
    enrollments: 350,
    hasCertificate: false,
    mandatory: true,
    dueDate: '2026-03-31',
    tags: ['Product', 'Features', 'Roadmap', 'Domain'],
    modules: [
      { id: 'i2-m1', title: 'Product Overview & Vision', duration: '40 min', description: 'Product philosophy, target users, and the 2026 roadmap.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
      { id: 'i2-m2', title: 'Core Features Deep Dive', duration: '50 min', description: 'Walk through of primary features with demos and use cases.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
      { id: 'i2-m3', title: 'Competitive Landscape', duration: '40 min', description: 'How we differentiate from competitors and our unique value proposition.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
      { id: 'i2-m4', title: 'Customer Success Stories', duration: '35 min', description: 'Real case studies showing product impact and ROI for customers.', videoProvider: 'youtube', videoId: 'qmYpFoQ8wGc' },
    ],
  },
  {
    id: 'i3',
    title: 'Sales Methodology',
    description:
      'Master our consultative sales methodology, objection handling, pricing conversations, and deal-closing techniques for complex B2B enterprise sales.',
    platform: 'Internal',
    category: 'Domain',
    level: 'Intermediate',
    duration: '4h',
    instructor: 'Sales Enablement',
    rating: 4.4,
    enrollments: 180,
    hasCertificate: false,
    mandatory: false,
    tags: ['Sales', 'B2B', 'Negotiation', 'Closing'],
    modules: [
      { id: 'i3-m1', title: 'Consultative Selling', duration: '40 min', description: 'Moving from product-push to needs-based consultative selling.', videoProvider: 'youtube', videoId: 'Z9QbYZh1YXY' },
      { id: 'i3-m2', title: 'Discovery & Qualification', duration: '35 min', description: 'BANT/MEDDIC framework, asking great discovery questions.', videoProvider: 'youtube', videoId: 'Z9QbYZh1YXY' },
      { id: 'i3-m3', title: 'Objection Handling', duration: '35 min', description: 'Proven scripts and techniques to handle the most common objections.', videoProvider: 'youtube', videoId: 'Z9QbYZh1YXY' },
      { id: 'i3-m4', title: 'Closing & Negotiation', duration: '40 min', description: 'Closing strategies, pricing negotiation, and contract finalization.', videoProvider: 'youtube', videoId: 'Z9QbYZh1YXY' },
    ],
  },
];

// ─── Mock API Functions ────────────────────────────────────────────────────────
export async function fetchCourses(params?: {
  category?: string;
  platform?: string;
  search?: string;
  level?: string;
}): Promise<CourseData[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  let courses = [...ALL_COURSES];
  if (params?.category && params.category !== 'All') {
    courses = courses.filter((c) => c.category === params.category);
  }
  if (params?.platform && params.platform !== 'All') {
    courses = courses.filter((c) => c.platform === params.platform);
  }
  if (params?.level && params.level !== 'All') {
    courses = courses.filter((c) => c.level === params.level);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return courses;
}

export async function fetchCourseById(id: string): Promise<CourseData | null> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return ALL_COURSES.find((c) => c.id === id) || null;
}

export function getCourseById(id: string): CourseData | null {
  return ALL_COURSES.find((c) => c.id === id) || null;
}

// ─── localStorage Progress Helpers ────────────────────────────────────────────
const STORAGE_KEY = 'sarve_learning_progress';

function getStorageData(): Record<string, CourseProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStorageData(data: Record<string, CourseProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage might be unavailable
  }
}

export function getCourseProgress(courseId: string): CourseProgress | null {
  const data = getStorageData();
  return data[courseId] || null;
}

export function getCourseProgressWithDefault(
  courseId: string,
  defaultProgress: number,
  defaultStatus: CourseStatus,
  course: CourseData
): CourseProgress {
  const stored = getCourseProgress(courseId);
  if (stored) return stored;

  // Build default based on mock data
  const total = course.modules.length;
  const completed = Math.floor((defaultProgress / 100) * total);
  const completedModules = course.modules.slice(0, completed).map((m) => m.id);
  const lastModuleId = completedModules[completedModules.length - 1] || null;

  return {
    status: defaultStatus,
    completedModules,
    lastModuleId,
    progress: defaultProgress,
    startedAt: defaultProgress > 0 ? '2026-01-10' : null,
    completedAt: defaultProgress === 100 ? '2026-02-28' : null,
  };
}

export function saveModuleComplete(courseId: string, moduleId: string, course: CourseData): CourseProgress {
  const data = getStorageData();
  const existing = data[courseId] || {
    status: 'NOT_STARTED' as CourseStatus,
    completedModules: [],
    lastModuleId: null,
    progress: 0,
    startedAt: new Date().toISOString().split('T')[0],
    completedAt: null,
  };

  const completedModules = Array.from(new Set([...existing.completedModules, moduleId]));
  const progress = Math.round((completedModules.length / course.modules.length) * 100);
  const isComplete = completedModules.length >= course.modules.length;

  const updated: CourseProgress = {
    ...existing,
    status: isComplete ? 'COMPLETED' : 'IN_PROGRESS',
    completedModules,
    lastModuleId: moduleId,
    progress,
    startedAt: existing.startedAt || new Date().toISOString().split('T')[0],
    completedAt: isComplete ? new Date().toISOString().split('T')[0] : null,
  };

  data[courseId] = updated;
  saveStorageData(data);
  return updated;
}

export function initCourseProgress(courseId: string): CourseProgress {
  const data = getStorageData();
  if (!data[courseId]) {
    const newProgress: CourseProgress = {
      status: 'IN_PROGRESS',
      completedModules: [],
      lastModuleId: null,
      progress: 0,
      startedAt: new Date().toISOString().split('T')[0],
      completedAt: null,
    };
    data[courseId] = newProgress;
    saveStorageData(data);
    return newProgress;
  }
  return data[courseId];
}

export function getProgressPercent(courseId: string, fallback = 0): number {
  const p = getCourseProgress(courseId);
  return p?.progress ?? fallback;
}

// ─── Certificate Generator ────────────────────────────────────────────────────
export function generateCertificate(params: {
  employeeName: string;
  courseName: string;
  platform: string;
  instructor: string;
  completionDate: string;
  certId: string;
  duration: string;
}) {
  const { employeeName, courseName, platform, instructor, completionDate, certId, duration } = params;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate – ${courseName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 100vw; height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: #f0f9ff;
      font-family: 'Inter', sans-serif;
    }
    .wrap { position: relative; }
    .cert {
      width: 900px; min-height: 620px;
      background: white;
      border: 6px solid #0D9488;
      border-radius: 12px;
      padding: 50px 70px;
      text-align: center;
      position: relative;
      box-shadow: 0 8px 40px rgba(13,148,136,0.15);
    }
    .cert::before {
      content: ''; position: absolute; inset: 14px;
      border: 1.5px solid #0D9488; border-radius: 8px; opacity: 0.25; pointer-events: none;
    }
    .logo-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 6px; }
    .logo-icon {
      width: 44px; height: 44px; background: #0D9488; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; color: white; font-weight: 700;
    }
    .logo-text { font-size: 26px; font-weight: 700; color: #0D9488; letter-spacing: -0.5px; }
    .org-sub { font-size: 13px; color: #6B7280; margin-bottom: 28px; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, #0D9488, transparent); margin: 0 auto 24px; width: 60%; }
    .cert-title {
      font-family: 'Playfair Display', serif;
      font-size: 38px; font-style: italic; color: #134E4A; margin-bottom: 18px;
    }
    .subtitle { font-size: 14px; color: #9CA3AF; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
    .employee-name {
      font-family: 'Playfair Display', serif;
      font-size: 40px; color: #0D9488; font-weight: 700;
      border-bottom: 2px solid #0D9488; display: inline-block;
      padding-bottom: 6px; margin-bottom: 20px; min-width: 300px;
    }
    .course-label { font-size: 14px; color: #6B7280; margin-bottom: 8px; }
    .course-name { font-size: 24px; font-weight: 700; color: #1E3A5F; margin-bottom: 8px; line-height: 1.3; }
    .course-meta { font-size: 13px; color: #9CA3AF; margin-bottom: 32px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
    .sig-block { text-align: center; width: 180px; }
    .sig-line { height: 1px; background: #D1D5DB; margin-bottom: 8px; }
    .sig-name { font-size: 13px; font-weight: 600; color: #374151; }
    .sig-title { font-size: 11px; color: #9CA3AF; }
    .cert-seal {
      width: 80px; height: 80px; border: 3px solid #0D9488; border-radius: 50%;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #0D9488; font-size: 10px; font-weight: 700; text-align: center; line-height: 1.3;
    }
    .seal-check { font-size: 22px; margin-bottom: 2px; }
    .print-btn {
      position: fixed; top: 24px; right: 24px;
      padding: 12px 24px; background: #0D9488; color: white;
      border: none; border-radius: 8px; cursor: pointer;
      font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 12px rgba(13,148,136,0.3);
    }
    .print-btn:hover { background: #0f766e; }
    @media print {
      .print-btn { display: none; }
      body { background: white; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  <div class="wrap">
    <div class="cert">
      <div class="logo-row">
        <div class="logo-icon">SP</div>
        <div class="logo-text">SarvePratibha</div>
      </div>
      <div class="org-sub">Human Resource Management System — Enterprise Learning</div>
      <div class="divider"></div>
      <div class="cert-title">Certificate of Completion</div>
      <div class="subtitle">This is to certify that</div>
      <div class="employee-name">${employeeName}</div>
      <div class="course-label">has successfully completed the course</div>
      <div class="course-name">${courseName}</div>
      <div class="course-meta">
        Platform: <strong>${platform}</strong> &nbsp;·&nbsp; Instructor: <strong>${instructor}</strong> &nbsp;·&nbsp; Duration: <strong>${duration}</strong>
      </div>
      <div class="footer">
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">Priya Nair</div>
          <div class="sig-title">Head of Learning & Development</div>
        </div>
        <div class="cert-seal">
          <div class="seal-check">✓</div>
          <div>VERIFIED</div>
          <div>CERTIFICATE</div>
        </div>
        <div class="sig-block" style="text-align:right">
          <div class="sig-line"></div>
          <div class="sig-name">Completed: ${completionDate}</div>
          <div class="sig-title">Cert ID: ${certId}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1000,height=700');
  if (win) {
    win.document.write(html);
    win.document.close();
  } else {
    // Fallback: blob URL
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}

// ─── Video Embed URL Builders ──────────────────────────────────────────────────
export function getVideoEmbedUrl(provider: VideoProvider, videoId: string): string {
  switch (provider) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&color=0D9488&title=0&byline=0`;
    case 'dailymotion':
      return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;
    default:
      return '';
  }
}

// ─── Platform Styling ─────────────────────────────────────────────────────────
export const PLATFORM_STYLES: Record<Platform, { bg: string; text: string }> = {
  Coursera: { bg: 'bg-blue-100', text: 'text-blue-700' },
  'LinkedIn Learning': { bg: 'bg-sky-100', text: 'text-sky-700' },
  Udemy: { bg: 'bg-violet-100', text: 'text-violet-700' },
  YouTube: { bg: 'bg-red-100', text: 'text-red-700' },
  Vimeo: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  Dailymotion: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'Articulate 360': { bg: 'bg-orange-100', text: 'text-orange-700' },
  Internal: { bg: 'bg-teal-100', text: 'text-teal-700' },
};
