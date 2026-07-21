const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

const languages = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh', 'ur'];

const translations = {
  en: {
    navbar: { home: "Home", about: "About", dashboard: "Dashboard", interview: "Interview", results: "Results" },
    hero: { badge: "AI Powered Mock Interviews", title_part1: "Practice", title_highlight: "Smarter", title_part2: "Interview Better.", description: "Improve your communication skills, technical depth, and overall delivery with real-time feedback driven by advanced AI evaluation.", start_btn: "Start Interview Free", learn_more_btn: "Learn More", feature_speech: "Browser Speech Recognition", feature_nocredit: "No Credit Card Needed", score_label: "AI SCORE", analyzing: "Analyzing facial expressions..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  de: {
    navbar: { home: "Startseite", about: "Über uns", dashboard: "Dashboard", interview: "Interview", results: "Ergebnisse" },
    hero: { badge: "KI-gesteuerte Testinterviews", title_part1: "Übe", title_highlight: "Smarter", title_part2: "Besser Interviewen.", description: "Verbessern Sie Ihre Kommunikationsfähigkeiten, technische Tiefe und allgemeine Präsentation mit Echtzeit-Feedback, das durch fortschrittliche KI-Bewertung gesteuert wird.", start_btn: "Kostenloses Interview starten", learn_more_btn: "Mehr erfahren", feature_speech: "Browser-Spracherkennung", feature_nocredit: "Keine Kreditkarte erforderlich", score_label: "KI-ERGEBNIS", analyzing: "Gesichtsausdrücke werden analysiert..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  es: {
    navbar: { home: "Inicio", about: "Acerca de", dashboard: "Panel", interview: "Entrevista", results: "Resultados" },
    hero: { badge: "Entrevistas Simuladas con IA", title_part1: "Practica", title_highlight: "Más Inteligente", title_part2: "Mejores Entrevistas.", description: "Mejora tus habilidades de comunicación, profundidad técnica y entrega general con retroalimentación en tiempo real impulsada por evaluación avanzada de IA.", start_btn: "Comenzar Entrevista Gratis", learn_more_btn: "Aprender Más", feature_speech: "Reconocimiento de Voz", feature_nocredit: "No se Requiere Tarjeta de Crédito", score_label: "PUNTUACIÓN DE IA", analyzing: "Analizando expresiones faciales..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  fr: {
    navbar: { home: "Accueil", about: "À propos", dashboard: "Tableau de bord", interview: "Entretien", results: "Résultats" },
    hero: { badge: "Entretiens Blancs par IA", title_part1: "Pratiquez", title_highlight: "Plus Intelligemment", title_part2: "Meilleurs Entretiens.", description: "Améliorez vos compétences en communication, votre profondeur technique et votre prestation globale avec des commentaires en temps réel basés sur une évaluation IA avancée.", start_btn: "Démarrer l'Entretien Gratuitement", learn_more_btn: "En Savoir Plus", feature_speech: "Reconnaissance Vocale", feature_nocredit: "Aucune Carte de Crédit Requise", score_label: "SCORE IA", analyzing: "Analyse des expressions faciales..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  it: {
    navbar: { home: "Home", about: "Chi siamo", dashboard: "Dashboard", interview: "Intervista", results: "Risultati" },
    hero: { badge: "Simulazioni di Intervista con IA", title_part1: "Esercitati", title_highlight: "Più Intelligentemente", title_part2: "Interviste Migliori.", description: "Migliora le tue capacità comunicative, la profondità tecnica e l'esposizione generale con feedback in tempo reale guidati da un'avanzata valutazione basata sull'intelligenza artificiale.", start_btn: "Inizia Intervista Gratis", learn_more_btn: "Scopri di più", feature_speech: "Riconoscimento Vocale", feature_nocredit: "Nessuna Carta di Credito Richiesta", score_label: "PUNTEGGIO IA", analyzing: "Analisi delle espressioni facciali..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  ja: {
    navbar: { home: "ホーム", about: "概要", dashboard: "ダッシュボード", interview: "面接", results: "結果" },
    hero: { badge: "AI搭載の模擬面接", title_part1: "より", title_highlight: "スマート", title_part2: "に練習して、より良い面接を。", description: "高度なAI評価に基づくリアルタイムのフィードバックで、コミュニケーションスキル、技術的な深さ、および全体的な表現力を向上させます。", start_btn: "無料で面接を始める", learn_more_btn: "詳細を見る", feature_speech: "ブラウザの音声認識", feature_nocredit: "クレジットカード不要", score_label: "AIスコア", analyzing: "表情を分析しています..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  ko: {
    navbar: { home: "홈", about: "소개", dashboard: "대시보드", interview: "면접", results: "결과" },
    hero: { badge: "AI 기반 모의 면접", title_part1: "더", title_highlight: "스마트", title_part2: "하게 연습하고, 더 나은 면접을 보세요.", description: "고급 AI 평가를 기반으로 한 실시간 피드백으로 커뮤니케이션 기술, 기술적 깊이 및 전반적인 전달력을 향상시킵니다.", start_btn: "무료 면접 시작하기", learn_more_btn: "자세히 알아보기", feature_speech: "브라우저 음성 인식", feature_nocredit: "신용카드 필요 없음", score_label: "AI 점수", analyzing: "표정을 분석하는 중..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  pt: {
    navbar: { home: "Início", about: "Sobre", dashboard: "Painel", interview: "Entrevista", results: "Resultados" },
    hero: { badge: "Entrevistas Simuladas com IA", title_part1: "Pratique", title_highlight: "Mais Inteligente", title_part2: "Entreviste Melhor.", description: "Melhore suas habilidades de comunicação, profundidade técnica e entrega geral com feedback em tempo real impulsionado por avaliação avançada de IA.", start_btn: "Começar Entrevista Grátis", learn_more_btn: "Saiba Mais", feature_speech: "Reconhecimento de Voz no Navegador", feature_nocredit: "Sem Necessidade de Cartão", score_label: "PONTUAÇÃO IA", analyzing: "Analisando expressões faciais..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  zh: {
    navbar: { home: "首页", about: "关于", dashboard: "仪表板", interview: "面试", results: "结果" },
    hero: { badge: "AI 驱动的模拟面试", title_part1: "更", title_highlight: "聪明", title_part2: "地练习，更好地面试。", description: "通过高级AI评估提供的实时反馈，改善您的沟通技巧、技术深度和整体表现。", start_btn: "免费开始面试", learn_more_btn: "了解更多", feature_speech: "浏览器语音识别", feature_nocredit: "无需信用卡", score_label: "AI 评分", analyzing: "正在分析面部表情..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  },
  ur: {
    navbar: { home: "مرکزی صفحہ", about: "ہمارے بارے میں", dashboard: "ڈیش بورڈ", interview: "انٹرویو", results: "نتائج" },
    hero: { badge: "اے آئی سے چلنے والے فرضی انٹرویوز", title_part1: "زیادہ", title_highlight: "سمارٹ", title_part2: "مشق کریں، بہتر انٹرویو دیں۔", description: "جدید ترین اے آئی کی تشخیص سے چلنے والے ریئل ٹائم فیڈ بیک کے ساتھ اپنی مواصلاتی مہارت، تکنیکی گہرائی اور مجموعی کارکردگی کو بہتر بنائیں۔", start_btn: "مفت انٹرویو شروع کریں", learn_more_btn: "مزید جانیں", feature_speech: "براؤزر میں آواز کی شناخت", feature_nocredit: "کسی کریڈٹ کارڈ کی ضرورت نہیں", score_label: "اے آئی کا سکور", analyzing: "چہرے کے تاثرات کا تجزیہ کیا جا رہا ہے..." },
    languages: { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", ja: "日本語", ko: "한국어", pt: "Português", zh: "中文", ur: "اردو" }
  }
};

languages.forEach(lang => {
  fs.writeFileSync(
    path.join(localesDir, `${lang}.json`),
    JSON.stringify(translations[lang], null, 2)
  );
});

console.log("Locales created!");
