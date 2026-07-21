const fs = require('fs');
const path = require('path');
const enPath = path.join(__dirname, 'src', 'locales', 'en.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

en.ourUsers = {
  mainTitle: "Who can benefit from SkillScan AI?",
  subtitle: "Whether you're starting your career, seeking new opportunities, or looking to hire the best talent, we have the tools you need.",
  students: {
    title: "Students and recent graduates",
    desc: "Practice answering tailored interview questions and gain confidence for your job search."
  },
  jobSeekers: {
    title: "Job seekers and Candidates",
    desc: "Practice answering common interview questions and improve your performance."
  },
  remoteWorkers: {
    title: "Remote Workers and Freelancers",
    desc: "Ace virtual job interviews with AI-generated, tailored questions and personalized feedback."
  },
  companies: {
    title: "Companies and HR Teams",
    desc: "Streamline your hiring process with AI-driven interview assessments and objective candidate evaluations."
  }
};

en.rolesel = en.rolesel || {};
en.rolesel.roles = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  other: "Other Field"
};
en.rolesel.continue_btn = "Continue";

en.interview = en.interview || {};
en.interview.alerts = {
  enter_name: "Please enter your name before starting the interview.",
  error_init: "Error initializing interview question. Please try again.",
  answer_first: "Please answer the current question first.",
  ai_error: "AI Error during evaluation. Please try again.",
  complete_one: "Please complete and evaluate at least one question first.",
  failed_save: "Failed to save interview session to the database."
};
en.interview.presets = {
  frontend_developer: "Frontend Developer",
  backend_developer: "Backend Developer",
  full_stack_developer: "Full Stack Developer",
  ai_ml_engineer: "AI/ML Engineer",
  data_scientist: "Data Scientist",
  mobile_app_developer: "Mobile App Developer",
  devops_engineer: "DevOps Engineer",
  database_administrator: "Database Administrator",
  cybersecurity_analyst: "Cybersecurity Analyst",
  ui_ux_designer: "UI/UX Designer",
  qa_engineer: "QA Engineer",
  product_manager: "Product Manager",
  digital_marketing_specialist: "Digital Marketing Specialist",
  content_writer: "Content Writer",
  business_analyst: "Business Analyst",
  robotics_engineer: "Robotics Engineer",
  game_developer: "Game Developer",
  it_support_specialist: "IT Support Specialist",
  seo_specialist: "SEO Specialist",
  cloud_architect: "Cloud Architect",
  network_engineer: "Network Engineer",
  system_administrator: "System Administrator",
  sales_representative: "Sales Representative",
  financial_analyst: "Financial Analyst",
  registered_nurse: "Registered Nurse",
  human_resources_manager: "Human Resources Manager",
  teacher___educator: "Teacher / Educator",
  accountant: "Accountant",
  lawyer___legal_counsel: "Lawyer / Legal Counsel",
  civil_engineer: "Civil Engineer",
  chef___culinary_arts: "Chef / Culinary Arts",
  photographer: "Photographer",
  musician: "Musician",
  retail_manager: "Retail Manager",
  custom: "Custom"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log("Updated en.json with all missing keys!");
