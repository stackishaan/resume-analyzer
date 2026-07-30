// ─── Company + Role Keyword Dictionaries ─────────────────────────────────────
// Each company entry has tiers with different weights.
// Higher weight = keyword counts more in the ATS score.

export type Company = 'TCS' | 'Infosys' | 'Google' | 'Amazon' | 'Microsoft' | 'Accenture';

export type Role =
  | 'Software Engineer'
  | 'Data Scientist'
  | 'Product Manager'
  | 'DevOps Engineer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'ML Engineer';

export const COMPANIES: Company[] = ['TCS', 'Infosys', 'Google', 'Amazon', 'Microsoft', 'Accenture'];
export const ROLES: Role[] = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'ML Engineer',
];

export interface KeywordTier {
  weight: number;
  terms: string[];
}

export const COMPANY_KEYWORDS: Record<Company, KeywordTier[]> = {
  TCS: [
    {
      weight: 2.0,
      terms: ['agile', 'scrum', 'itil', 'cmm', 'tcs', 'tata consultancy', 'delivery', 'sla', 'client management', 'onshore', 'offshore', 'stakeholder'],
    },
    {
      weight: 1.5,
      terms: ['java', 'spring boot', 'oracle', 'sap', 'mainframe', 'cobol', 'sql', 'pl/sql', 'testing', 'qa', 'automation', 'selenium', 'jira', 'confluence'],
    },
    {
      weight: 1.0,
      terms: ['communication', 'teamwork', 'documentation', 'requirement gathering', 'brd', 'frd', 'uml', 'erp', 'crm'],
    },
  ],
  Infosys: [
    {
      weight: 2.0,
      terms: ['digital transformation', 'consulting', 'nia', 'infosys', 'cobalt', 'enterprise', 'cloud migration', 'process improvement', 'lean', 'six sigma'],
    },
    {
      weight: 1.5,
      terms: ['java', '.net', 'angular', 'react', 'microservices', 'api', 'azure', 'aws', 'devops', 'ci/cd', 'jenkins', 'automation'],
    },
    {
      weight: 1.0,
      terms: ['project management', 'pmp', 'agile', 'scrum', 'client', 'presentation', 'analysis', 'sql', 'oracle'],
    },
  ],
  Google: [
    {
      weight: 2.0,
      terms: ['algorithms', 'data structures', 'system design', 'distributed systems', 'scalability', 'performance', 'google', 'open source', 'competitive programming', 'leetcode'],
    },
    {
      weight: 1.5,
      terms: ['python', 'golang', 'c++', 'java', 'kubernetes', 'gcp', 'bigquery', 'tensorflow', 'machine learning', 'mapreduce', 'grpc', 'protobuf'],
    },
    {
      weight: 1.0,
      terms: ['code review', 'testing', 'unit tests', 'debugging', 'version control', 'git', 'linux', 'bash', 'rest api', 'docker'],
    },
  ],
  Amazon: [
    {
      weight: 2.0,
      terms: ['aws', 'leadership principles', 'customer obsession', 'ownership', 'bias for action', 'deliver results', 'amazon', 'e-commerce', 'microservices', 'cloud'],
    },
    {
      weight: 1.5,
      terms: ['java', 'python', 'dynamodb', 'lambda', 's3', 'ec2', 'sqs', 'sns', 'kinesis', 'api gateway', 'devops', 'ci/cd', 'terraform', 'cloudformation'],
    },
    {
      weight: 1.0,
      terms: ['agile', 'scrum', 'metrics', 'kpi', 'a/b testing', 'monitoring', 'logging', 'docker', 'kubernetes', 'cost optimization'],
    },
  ],
  Microsoft: [
    {
      weight: 2.0,
      terms: ['azure', 'microsoft', '.net', 'c#', 'typescript', 'power platform', 'microsoft 365', 'teams', 'sharepoint', 'windows', 'active directory'],
    },
    {
      weight: 1.5,
      terms: ['sql server', 'cosmos db', 'react', 'angular', 'node.js', 'rest api', 'graphql', 'devops', 'ci/cd', 'github actions', 'powershell', 'azure devops'],
    },
    {
      weight: 1.0,
      terms: ['agile', 'scrum', 'cloud', 'kubernetes', 'docker', 'security', 'compliance', 'identity', 'saas', 'enterprise'],
    },
  ],
  Accenture: [
    {
      weight: 2.0,
      terms: ['consulting', 'strategy', 'transformation', 'accenture', 'change management', 'stakeholder management', 'business analysis', 'process redesign', 'innovation'],
    },
    {
      weight: 1.5,
      terms: ['cloud', 'aws', 'azure', 'gcp', 'salesforce', 'sap', 'oracle', 'workday', 'servicenow', 'data analytics', 'ai', 'automation', 'rpa'],
    },
    {
      weight: 1.0,
      terms: ['project management', 'pmo', 'agile', 'waterfall', 'presentation', 'excel', 'powerpoint', 'client-facing', 'global delivery', 'outsourcing'],
    },
  ],
};

export const ROLE_KEYWORDS: Record<Role, string[]> = {
  'Software Engineer': [
    'software development', 'programming', 'coding', 'debugging', 'algorithms', 'data structures',
    'object oriented', 'rest api', 'microservices', 'git', 'agile', 'unit testing', 'code review',
    'java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'sql', 'linux', 'docker',
  ],
  'Data Scientist': [
    'machine learning', 'deep learning', 'statistics', 'data analysis', 'python', 'r',
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'sql', 'tableau', 'power bi',
    'jupyter', 'feature engineering', 'model training', 'hypothesis testing', 'a/b testing',
    'regression', 'classification', 'clustering', 'nlp', 'computer vision',
  ],
  'Product Manager': [
    'product roadmap', 'user stories', 'product strategy', 'go-to-market', 'market research',
    'stakeholder', 'prioritization', 'kpi', 'metrics', 'a/b testing', 'user research',
    'wireframe', 'figma', 'jira', 'confluence', 'agile', 'scrum', 'mvp', 'backlog', 'sprint',
  ],
  'DevOps Engineer': [
    'devops', 'ci/cd', 'jenkins', 'github actions', 'docker', 'kubernetes', 'terraform',
    'ansible', 'linux', 'bash', 'scripting', 'monitoring', 'prometheus', 'grafana',
    'aws', 'azure', 'gcp', 'infrastructure as code', 'helm', 'argo cd', 'reliability', 'sre',
  ],
  'Frontend Developer': [
    'html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular', 'next.js',
    'responsive design', 'accessibility', 'webpack', 'vite', 'figma', 'ui/ux', 'scss',
    'tailwind', 'graphql', 'rest api', 'performance', 'seo', 'jest', 'testing library',
  ],
  'Backend Developer': [
    'node.js', 'express', 'django', 'flask', 'spring boot', 'fastapi', 'rest api', 'graphql',
    'sql', 'nosql', 'postgresql', 'mongodb', 'redis', 'kafka', 'rabbitmq', 'microservices',
    'authentication', 'jwt', 'oauth', 'docker', 'kubernetes', 'performance', 'scalability',
  ],
  'ML Engineer': [
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'mlops', 'model deployment',
    'feature engineering', 'model training', 'hyperparameter tuning', 'python', 'cuda',
    'docker', 'kubernetes', 'airflow', 'mlflow', 'data pipelines', 'etl', 'spark',
    'transformers', 'llm', 'rag', 'fine-tuning', 'inference', 'model serving',
  ],
};

// Sections we look for in the resume text
export const REQUIRED_SECTIONS = [
  'experience',
  'education',
  'skills',
  'projects',
  'summary',
  'objective',
  'certifications',
  'achievements',
  'awards',
  'contact',
  'work experience',
  'professional experience',
  'technical skills',
];
