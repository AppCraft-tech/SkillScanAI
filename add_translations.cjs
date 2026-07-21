const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ur'];

const translations = {
  en: {
    blog: {
      title: "Interview & Career Insights",
      subtitle: "Expert advice, tips, and strategies to help you ace your interviews and advance your career.",
      readMore: "Read More",
      postNotFound: "Post not found",
      returnToBlog: "Return to Blog",
      share: "Share this Post:",
      relatedPosts: "Related Posts"
    },
    interview: {
      chooseRole: "Choose Your Target Role",
      enterNameDesc: "Enter your name and select your role to customize your AI interview.",
      yourName: "Your Name",
      enterFullName: "Enter your full name",
      targetRole: "Target Role",
      customRole: "Custom Role",
      selectRole: "Select a role...",
      customRolePlaceholder: "Or write another job role and hit Enter...",
      customRoleDesc: "Specify your own specialized job role",
      standardRoleDesc: "Standard technical and situational questions",
      startingAI: "Starting AI Engine...",
      enterRoom: "Enter AI Interview Room ➜",
      roomTitle: "AI Interview Room",
      practicingFor: "Practicing for:",
      questionNumber: "Question",
      aiQuestion: "AI Question",
      yourAnswer: "Your Answer",
      answerPlaceholderActive: "Click 'Start Recording' to speak or type your answer directly here...",
      answerPlaceholderInactive: "Please start the session to begin answering...",
      aiFeedback: "Question AI Feedback",
      feedbackPlaceholder: "Your AI evaluation will appear here after you submit your answer.",
      aiAnalysis: "AI Analysis (Latest)",
      stopSession: "⏸ Stop Session",
      startSession: "▶ Start Session",
      startRecording: "🎤 Start Recording",
      evaluating: "Evaluating Answer...",
      submitNext: "➜ Submit & Next Question",
      endInterview: "End Interview"
    },
    results: {
      noSessionTitle: "No Session Found",
      noSessionDesc: "It looks like you haven't completed an interview session yet. Start one now to receive AI-powered evaluations and analytics.",
      startNewBtn: "Start New Interview",
      backToHome: "Back to Home",
      interviewFeedback: "Interview Feedback",
      sFeedback: "'s Feedback",
      role: "Role:",
      retakeInterview: "Retake Interview",
      overallRating: "Overall Rating",
      evalCatScores: "Evaluation Category Scores",
      keyStrengths: "Key Strengths",
      focusAreas: "Focus Areas",
      aiRecommendations: "AI Recommendations",
      tipPrefix: "Tip #",
      noSuggestions: "No suggestions available.",
      transcriptTitle: "Question-by-Question Transcript",
      yourAnswer: "Your Answer",
      noAnswer: "No answer provided.",
      aiAssessment: "AI Assessment",
      historyTitle: "Interview History",
      historyDesc: "Review all your past AI interview sessions",
      clearAll: "Clear All",
      loadingHistory: "Loading history...",
      noOtherInterviews: "No Other Interviews Yet",
      pastSessions: "Your past sessions will appear here.",
      scoreTitle: "Score",
      statusTitle: "Status"
    },
    candidate: {
      resumeTitle: "Resume",
      resumeDesc: "Upload your CV to unlock the interview, or proceed without one.",
      uploadCV: "Upload your CV",
      uploadFormat: "PDF or TXT up to 10 MB",
      noResume: "Don't have a resume ready?",
      interviewWithout: "Interview without Resume",
      analyzing: "Analyzing Resume...",
      analyzingDesc: "Our AI is parsing your experience and skills.",
      congrats: "Congratulations!",
      notSelected: "Not Selected",
      atsScore: "Your ATS Score:",
      eligible: "You are eligible for Interview!",
      notEligible: "You are not eligible for Interview. Please practice more and improve your resume.",
      nextSelectRole: "Next: Select Role",
      uploadDifferent: "Upload a different CV"
    }
  },
  es: {
    blog: {
      title: "Perspectivas de entrevistas y carreras",
      subtitle: "Consejos de expertos y estrategias para ayudarte a superar tus entrevistas.",
      readMore: "Leer más",
      postNotFound: "Publicación no encontrada",
      returnToBlog: "Volver al blog",
      share: "Compartir:",
      relatedPosts: "Publicaciones relacionadas"
    },
    interview: {
      chooseRole: "Elige tu rol objetivo",
      enterNameDesc: "Ingresa tu nombre y selecciona tu rol para personalizar tu entrevista.",
      yourName: "Tu nombre",
      enterFullName: "Ingresa tu nombre completo",
      targetRole: "Rol objetivo",
      customRole: "Rol personalizado",
      selectRole: "Selecciona un rol...",
      customRolePlaceholder: "O escribe otro rol y presiona Enter...",
      customRoleDesc: "Especifica tu propio rol especializado",
      standardRoleDesc: "Preguntas técnicas y situacionales estándar",
      startingAI: "Iniciando motor IA...",
      enterRoom: "Entrar a la sala de entrevistas ➜",
      roomTitle: "Sala de entrevistas IA",
      practicingFor: "Practicando para:",
      questionNumber: "Pregunta",
      aiQuestion: "Pregunta de IA",
      yourAnswer: "Tu respuesta",
      answerPlaceholderActive: "Haz clic en 'Empezar a grabar' para hablar o escribir tu respuesta...",
      answerPlaceholderInactive: "Comienza la sesión para responder...",
      aiFeedback: "Comentarios de IA",
      feedbackPlaceholder: "Tu evaluación de IA aparecerá aquí después de enviar tu respuesta.",
      aiAnalysis: "Análisis de IA (Último)",
      stopSession: "⏸ Detener sesión",
      startSession: "▶ Iniciar sesión",
      startRecording: "🎤 Empezar a grabar",
      evaluating: "Evaluando respuesta...",
      submitNext: "➜ Enviar y siguiente",
      endInterview: "Terminar entrevista"
    },
    results: {
      noSessionTitle: "No se encontró sesión",
      noSessionDesc: "Aún no has completado una entrevista. Inicia una ahora.",
      startNewBtn: "Iniciar nueva entrevista",
      backToHome: "Volver al inicio",
      interviewFeedback: "Comentarios de la entrevista",
      sFeedback: " - Comentarios",
      role: "Rol:",
      retakeInterview: "Volver a hacer entrevista",
      overallRating: "Calificación general",
      evalCatScores: "Puntajes de evaluación",
      keyStrengths: "Puntos fuertes",
      focusAreas: "Áreas de enfoque",
      aiRecommendations: "Recomendaciones de IA",
      tipPrefix: "Consejo #",
      noSuggestions: "No hay sugerencias disponibles.",
      transcriptTitle: "Transcripción pregunta por pregunta",
      yourAnswer: "Tu respuesta",
      noAnswer: "Sin respuesta.",
      aiAssessment: "Evaluación de IA",
      historyTitle: "Historial de entrevistas",
      historyDesc: "Revisa todas tus sesiones pasadas",
      clearAll: "Borrar todo",
      loadingHistory: "Cargando historial...",
      noOtherInterviews: "No hay más entrevistas",
      pastSessions: "Tus sesiones pasadas aparecerán aquí.",
      scoreTitle: "Puntaje",
      statusTitle: "Estado"
    },
    candidate: {
      resumeTitle: "Currículum",
      resumeDesc: "Sube tu CV para desbloquear la entrevista.",
      uploadCV: "Sube tu CV",
      uploadFormat: "PDF o TXT hasta 10 MB",
      noResume: "¿No tienes un currículum?",
      interviewWithout: "Entrevista sin currículum",
      analyzing: "Analizando currículum...",
      analyzingDesc: "Nuestra IA está analizando tu experiencia.",
      congrats: "¡Felicidades!",
      notSelected: "No seleccionado",
      atsScore: "Tu puntaje ATS:",
      eligible: "¡Eres elegible para la entrevista!",
      notEligible: "No eres elegible. Mejora tu currículum.",
      nextSelectRole: "Siguiente: Seleccionar rol",
      uploadDifferent: "Subir un CV diferente"
    }
  }
};

const defaultTranslations = { ...translations.en };

for (const lang of languages) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Assign specific language translations or fallback to english default translations
    const langUpdates = translations[lang] || defaultTranslations;

    fileContent.blog = langUpdates.blog;
    fileContent.interview = langUpdates.interview;
    fileContent.results = langUpdates.results;
    fileContent.candidate = langUpdates.candidate;

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
  }
}
console.log("Translation keys added successfully.");
