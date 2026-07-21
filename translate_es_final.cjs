const fs = require('fs');
const path = require('path');
const esPath = path.join(__dirname, 'src', 'locales', 'es.json');

const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

es.ourUsers = {
  mainTitle: "¿Quién puede beneficiarse de SkillScan AI?",
  subtitle: "Ya sea que estés comenzando tu carrera, buscando nuevas oportunidades o contratando el mejor talento, tenemos las herramientas que necesitas.",
  students: {
    title: "Estudiantes y recién graduados",
    desc: "Practica respondiendo preguntas de entrevista personalizadas y gana confianza para tu búsqueda de empleo."
  },
  jobSeekers: {
    title: "Buscadores de empleo y Candidatos",
    desc: "Practica respondiendo preguntas comunes de entrevistas y mejora tu rendimiento."
  },
  remoteWorkers: {
    title: "Trabajadores Remotos y Freelancers",
    desc: "Domina las entrevistas de trabajo virtuales con preguntas generadas por IA y retroalimentación personalizada."
  },
  companies: {
    title: "Empresas y Equipos de RRHH",
    desc: "Agiliza tu proceso de contratación con evaluaciones de entrevistas impulsadas por IA y evaluaciones objetivas de candidatos."
  }
};

es.rolesel = es.rolesel || {};
es.rolesel.roles = {
  frontend: "Desarrollador Frontend",
  backend: "Desarrollador Backend",
  other: "Otro Campo"
};
es.rolesel.continue_btn = "Continuar";

es.interview = es.interview || {};
es.interview.alerts = {
  enter_name: "Por favor ingresa tu nombre antes de comenzar la entrevista.",
  error_init: "Error al inicializar la pregunta de la entrevista. Por favor inténtalo de nuevo.",
  answer_first: "Por favor responde la pregunta actual primero.",
  ai_error: "Error de IA durante la evaluación. Por favor inténtalo de nuevo.",
  complete_one: "Por favor completa y evalúa al menos una pregunta primero.",
  failed_save: "Error al guardar la sesión de la entrevista en la base de datos."
};
es.interview.presets = {
  frontend_developer: "Desarrollador Frontend",
  backend_developer: "Desarrollador Backend",
  full_stack_developer: "Desarrollador Full Stack",
  ai_ml_engineer: "Ingeniero de IA/ML",
  data_scientist: "Científico de Datos",
  mobile_app_developer: "Desarrollador de Apps Móviles",
  devops_engineer: "Ingeniero DevOps",
  database_administrator: "Administrador de Bases de Datos",
  cybersecurity_analyst: "Analista de Ciberseguridad",
  ui_ux_designer: "Diseñador UI/UX",
  qa_engineer: "Ingeniero QA",
  product_manager: "Gerente de Producto",
  digital_marketing_specialist: "Especialista en Marketing Digital",
  content_writer: "Redactor de Contenido",
  business_analyst: "Analista de Negocios",
  robotics_engineer: "Ingeniero en Robótica",
  game_developer: "Desarrollador de Videojuegos",
  it_support_specialist: "Especialista en Soporte TI",
  seo_specialist: "Especialista SEO",
  cloud_architect: "Arquitecto de la Nube",
  network_engineer: "Ingeniero de Redes",
  system_administrator: "Administrador de Sistemas",
  sales_representative: "Representante de Ventas",
  financial_analyst: "Analista Financiero",
  registered_nurse: "Enfermero/a Registrado/a",
  human_resources_manager: "Gerente de Recursos Humanos",
  teacher___educator: "Profesor / Educador",
  accountant: "Contador",
  lawyer___legal_counsel: "Abogado / Asesor Legal",
  civil_engineer: "Ingeniero Civil",
  chef___culinary_arts: "Chef / Artes Culinarias",
  photographer: "Fotógrafo",
  musician: "Músico",
  retail_manager: "Gerente de Tienda",
  custom: "Personalizado"
};

fs.writeFileSync(esPath, JSON.stringify(es, null, 2), 'utf8');
console.log("Updated es.json with all missing keys!");
