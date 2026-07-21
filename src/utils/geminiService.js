/**
 * Service to handle resume analysis and STAR bullet optimization.
 * Supports:
 * 1. Real Gemini API requests if a key is provided.
 * 2. Intelligent, text-based local analysis fallback if no key is provided.
 */

// A rich collection of industry action verbs and keywords for local parsing
const ACTION_VERBS = [
  'led', 'developed', 'designed', 'managed', 'built', 'optimized', 'created', 'analyzed',
  'implemented', 'increased', 'reduced', 'engineered', 'spearheaded', 'executed', 'formulated',
  'maximized', 'minimized', 'orchestrated', 'authored', 'overhauled', 'boosted', 'expanded',
  'accelerated', 'improved', 'delivered', 'supervised', 'coordinated', 'architected', 'facilitated'
];

const COMMON_KEYWORDS = [
  'react', 'angular', 'vue', 'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby',
  'golang', 'rust', 'php', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'node.js', 'express',
  'nest.js', 'django', 'flask', 'spring boot', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
  'ci/cd', 'git', 'github', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql',
  'rest api', 'microservices', 'agile', 'scrum', 'project management', 'product management',
  'machine learning', 'data analysis', 'seo', 'marketing', 'sales', 'customer support',
  'ux/ui', 'figma', 'jira', 'confluence', 'team leadership', 'problem solving', 'communication'
];

/**
 * Extracts action verbs, numbers, and common keywords from text for local scoring.
 */
function localAnalyzeText(resumeText, jdText = '') {
  const normalizedResume = resumeText.toLowerCase();
  const normalizedJd = jdText.toLowerCase();

  // Find resume sections
  const sections = {
    summary: /summary|profile|about me|professional statement/i.test(resumeText),
    experience: /experience|work history|employment|career history/i.test(resumeText),
    skills: /skills|technical skills|technologies|expertise/i.test(resumeText),
    education: /education|academic/i.test(resumeText),
    projects: /projects|portfolio|personal projects/i.test(resumeText)
  };

  // Find action verbs in resume
  const foundVerbs = ACTION_VERBS.filter(verb => {
    const regex = new RegExp(`\\b${verb}(d|ed)?\\b`, 'i');
    return regex.test(normalizedResume);
  });

  // Check for numbers, percentages, currency, ratios (STAR metrics)
  const metricRegex = /\b\d+%?\b|\$\d+([kKmMbB]|\s?million|\s?billion)?\b|\b\d+x\b/g;
  const metricsMatched = resumeText.match(metricRegex) || [];
  const uniqueMetrics = [...new Set(metricsMatched)];

  // Extract keywords from Job Description
  let targetKeywords = [...COMMON_KEYWORDS];
  if (jdText) {
    // Find keywords explicitly mentioned in the JD
    const jdKeywords = COMMON_KEYWORDS.filter(kw => {
      const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(normalizedJd);
    });
    if (jdKeywords.length > 3) {
      targetKeywords = jdKeywords;
    }
  }

  // Cross-reference keywords with resume
  const matchedKeywords = [];
  const missingKeywords = [];

  targetKeywords.forEach(kw => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(normalizedResume)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Readability metrics
  const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = resumeText.split(/\s+/).filter(w => w.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? (words.length / sentences.length) : 0;

  let readabilityScore = 80;
  let readabilityStatus = 'Good';
  let readabilityFeedback = 'Your sentence length is optimal for scanner readability.';

  if (avgSentenceLength > 26) {
    readabilityScore = 45;
    readabilityStatus = 'Needs Work';
    readabilityFeedback = 'Your sentences average ' + Math.round(avgSentenceLength) + ' words. Professional resumes should aim for 15-20 words per sentence to maintain clarity and energy.';
  } else if (avgSentenceLength > 20) {
    readabilityScore = 68;
    readabilityStatus = 'Average';
    readabilityFeedback = 'Some sentences are slightly dense. Try splitting compound sentences to improve scanning.';
  }

  // Formatting Score
  let formatScore = 90;
  const formatIssues = [
    { name: 'Standard Resume Sections Included', status: 'pass', detail: 'All major sections detected.' },
    { name: 'Contact Information Presence', status: 'pass', detail: 'Email/Phone structures found.' },
    { name: 'Quantifiable Results & Metrics', status: 'pass', detail: `${uniqueMetrics.length} impact metrics detected.` },
    { name: 'Active Voice & Strong Verbs', status: 'pass', detail: `${foundVerbs.length} action verbs found.` }
  ];

  let missingSections = Object.keys(sections).filter(k => !sections[k]);
  if (missingSections.length > 0) {
    formatScore -= (missingSections.length * 10);
    formatIssues[0].status = 'warning';
    formatIssues[0].detail = `Missing sections: ${missingSections.map(s => s.toUpperCase()).join(', ')}.`;
  }

  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|\+\d{1,2}\s?\d{3,14}/;
  const hasEmail = emailRegex.test(resumeText);
  const hasPhone = phoneRegex.test(resumeText);
  if (!hasEmail || !hasPhone) {
    formatScore -= 15;
    formatIssues[1].status = 'fail';
    formatIssues[1].detail = `Missing ${!hasEmail ? 'Email Address' : ''}${!hasEmail && !hasPhone ? ' and ' : ''}${!hasPhone ? 'Phone Number' : ''}.`;
  }

  if (uniqueMetrics.length < 3) {
    formatScore -= 15;
    formatIssues[2].status = 'warning';
    formatIssues[2].detail = `Found only ${uniqueMetrics.length} metrics. Resume should contain at least 4-5 quantifiable business achievements (e.g. %, $, 5x).`;
  }

  if (foundVerbs.length < 5) {
    formatScore -= 10;
    formatIssues[3].status = 'warning';
    formatIssues[3].detail = `Found only ${foundVerbs.length} strong action verbs. Use active verbs like 'Led', 'Optimized', or 'Spearheaded' to start bullets.`;
  }

  // Keyword Score
  const keywordRatio = targetKeywords.length > 0 ? (matchedKeywords.length / targetKeywords.length) : 0;
  const keywordScore = Math.min(100, Math.round(keywordRatio * 100));

  // ATS overall Score
  const overallAtsScore = Math.round((formatScore * 0.4) + (readabilityScore * 0.2) + (keywordScore * 0.4));

  // Generate mock before & after rewrites based on text
  const rawBullets = resumeText.split(/[-•*]/).map(b => b.trim()).filter(b => b.length > 20 && b.length < 150).slice(0, 3);
  const defaultRewrites = [
    {
      original: rawBullets[0] || "Responsible for maintaining code quality and writing new features.",
      revised: "Engineered and shipped 12+ scalable features utilizing React and Node, resulting in a 14% improvement in application responsiveness and codebase stability.",
      impact: "Replaces passive 'responsible for' with a strong action verb, includes technical keywords, and adds a quantifiable impact metrics (12+ features, 14% improvement)."
    },
    {
      original: rawBullets[1] || "Helped build a new dashboard page for client tracking metrics.",
      revised: "Spearheaded the development of a real-time client analytics dashboard, reducing reporting latency by 35% and increasing user engagement across 200+ clients.",
      impact: "Highlights leadership ('Spearheaded'), specifies the dashboard type, and incorporates direct, measurable improvements in reporting time and client base."
    },
    {
      original: rawBullets[2] || "Worked with cross-functional teams to deploy software updates weekly.",
      revised: "Collaborated with cross-functional teams to orchestrate weekly deployments, reducing deployment downtime by 40% using automated CI/CD pipelines.",
      impact: "Replaces passive 'worked with' with structured collaboration, names a key practice ('CI/CD'), and shows measurable reduction in downtime."
    }
  ];

  // Feedback recommendations
  const feedback = {
    profile: {
      status: sections.summary ? 'good' : 'warning',
      title: 'Professional Summary',
      notes: sections.summary
        ? 'Your summary is present, which is excellent. Ensure it highlights your core value proposition and contains 2-3 target keywords from your desired job role.'
        : 'Missing a Professional Summary. Add a 3-4 sentence paragraph at the top showing your core expertise, years of experience, and primary accomplishments.'
    },
    experience: {
      status: uniqueMetrics.length > 2 && foundVerbs.length > 4 ? 'good' : 'warning',
      title: 'Work Experience',
      notes: `Detected ${foundVerbs.length} action verbs and ${uniqueMetrics.length} metrics. ${
        uniqueMetrics.length < 3
          ? 'Many of your career bullet points focus on tasks rather than results. Rewrite bullets using the STAR method: Situation, Task, Action, Result. Highlight the result!'
          : 'Great work experience structure. Make sure every single role has at least two numbers quantifying your success.'
      }`
    },
    skills: {
      status: matchedKeywords.length > 4 ? 'good' : 'warning',
      title: 'Skills Alignment',
      notes: `Matched ${matchedKeywords.length} keywords. ${
        missingKeywords.length > 3
          ? `Missing some crucial skills like: ${missingKeywords.slice(0, 4).join(', ')}. Create a dedicated 'Skills' section grouped by Technical (languages, tools) and Core Competencies.`
          : 'Excellent skills alignment. Your profile matches most core requirements in the job description.'
      }`
    },
    education: {
      status: sections.education ? 'good' : 'fail',
      title: 'Education & Certifications',
      notes: sections.education
        ? 'Education section is properly defined. Keep it concise, including major, school, year, and any notable certifications.'
        : 'Could not reliably detect your Education section. Ensure you list your academic degrees and certifications under a clear header.'
    }
  };

  // Timeline action plan
  const actionPlan = [
    { step: '1', title: 'Inject Missing Keywords', text: `Add critical skills such as ${missingKeywords.slice(0, 3).join(', ') || 'industry-specific keywords'} naturally into your summary and skills list.` },
    { step: '2', title: 'Quantify Achievements', text: `Ensure at least 50% of your work experience bullets contain measurable metrics (%, $, time saved, revenue generated).` },
    { step: '3', title: 'Strengthen Action Verbs', text: 'Scan your bullet points. Replace passive phrases like "worked on", "helped", or "responsible for" with words like "Executed", "Developed", or "Pioneered".' },
    { step: '4', title: 'Optimize Readability', text: 'Break down any paragraphs or bullet points that exceed 2.5 lines of text to make it easy for recruiters to scan in 6 seconds.' }
  ];

  // Local Suggested Jobs heuristic
  const resumeLower = resumeText.toLowerCase();
  const suggestedJobs = [];

  if (/react|javascript|typescript|frontend|html|css|web/i.test(resumeLower)) {
    suggestedJobs.push({
      title: "Frontend Engineer / Developer",
      matchReason: "Based on JavaScript, React, or CSS keywords found in your resume.",
      confidence: "High",
      suitableSkills: ["React", "JavaScript", "CSS/HTML", "TypeScript"].filter(s => resumeLower.includes(s.toLowerCase()))
    });
  }
  if (/python|java|c\+\+|c#|backend|node|sql|database|gcp|aws/i.test(resumeLower)) {
    suggestedJobs.push({
      title: "Software Engineer / Backend Developer",
      matchReason: "Strong correlation with backend languages, cloud platforms, or database frameworks.",
      confidence: "High",
      suitableSkills: ["Python", "Java", "SQL", "AWS", "Node.js", "C++"].filter(s => resumeLower.includes(s.toLowerCase()))
    });
  }
  if (/product|project|manager|agile|scrum|kanban|sprint/i.test(resumeLower)) {
    suggestedJobs.push({
      title: "Technical Project / Product Manager",
      matchReason: "Management terms, planning methodologies, and cross-functional team concepts detected.",
      confidence: "High",
      suitableSkills: ["Agile", "Scrum", "Project Management", "Product Management"].filter(s => resumeLower.includes(s.toLowerCase()))
    });
  }
  if (/data|analyst|analytics|excel|tableau|power bi|pandas|numpy/i.test(resumeLower)) {
    suggestedJobs.push({
      title: "Data Analyst / BI Specialist",
      matchReason: "Presence of analytical frameworks, data structures, and dashboard tools.",
      confidence: "High",
      suitableSkills: ["SQL", "Data Analysis", "Excel", "Python"].filter(s => resumeLower.includes(s.toLowerCase()))
    });
  }

  // Fallback if none matched
  if (suggestedJobs.length === 0) {
    suggestedJobs.push({
      title: "Associate Systems Analyst",
      matchReason: "General technical capabilities and professional background matches.",
      confidence: "Medium",
      suitableSkills: ["Communication", "Problem Solving", "Technical Support"]
    });
    suggestedJobs.push({
      title: "Junior Consultant",
      matchReason: "Adaptable skills and educational qualifications align with professional client-facing roles.",
      confidence: "Medium",
      suitableSkills: ["Collaboration", "Documentation", "Research"]
    });
  }

  return {
    atsScore: overallAtsScore,
    matchScore: jdText ? keywordScore : 0,
    readabilityScore: readabilityScore,
    readabilityStatus: readabilityStatus,
    readabilityFeedback: readabilityFeedback,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 15),
    formatIssues: formatIssues,
    bulletSuggestions: defaultRewrites,
    feedback: feedback,
    actionPlan: actionPlan,
    suggestedJobs: suggestedJobs
  };
}

/**
 * Clean and parse json helper.
 */
function cleanAndParseJSON(rawText) {
  // Try direct parse first
  try {
    return JSON.parse(rawText);
  } catch (e) {
    // If it has markdown code block backticks, clean them
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }
    try {
      return JSON.parse(cleaned);
    } catch (innerErr) {
      console.error('Failed to parse clean JSON', innerErr, cleaned);
      throw new Error('Invalid JSON format returned from Gemini: ' + innerErr.message);
    }
  }
}

/**
 * Core Analyzer API Service Call.
 */
export async function analyzeResume(resumeText, jobDescription = '', apiKey = '') {
  if (!apiKey) {
    // Return local analyzed data if no api key
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localAnalyzeText(resumeText, jobDescription));
      }, 1500); // simulate API delay
    });
  }

  // Real Gemini API Call
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are an expert ATS (Applicant Tracking System) optimizer and professional resume consultant.
Analyze the following resume text against the provided job description (if any).
Provide a detailed, critical assessment of the resume, returned STRICTLY as a valid JSON object. Do not wrap it in formatting text other than JSON.

RESUME TEXT:
"""
${resumeText}
"""

JOB DESCRIPTION (Optional, match against this if provided):
"""
${jobDescription}
"""

You MUST return a JSON object matching this exact TypeScript interface:
interface AnalysisResult {
  atsScore: number; // 0 to 100 representing general ATS compatibility
  matchScore: number; // 0 to 100 match rating against job description. 0 if job description is empty.
  readabilityScore: number; // 0 to 100 reading ease score
  readabilityStatus: 'Good' | 'Average' | 'Needs Work';
  readabilityFeedback: string; // explanation of readability and line-length assessment
  matchedKeywords: string[]; // keywords found in resume that align with job description (up to 15)
  missingKeywords: string[]; // keywords mentioned in job description but missing in resume (up to 15)
  formatIssues: Array<{
    name: string; // name of format test, e.g. "Contact Info Complete"
    status: 'pass' | 'warning' | 'fail';
    detail: string; // description of the issue or success
  }>;
  bulletSuggestions: Array<{
    original: string; // a weak bullet point found in their resume
    revised: string; // high impact STAR method rewrite of that bullet
    impact: string; // explanation of why the change helps
  }>; // provide 3 helpful bullet point rewrites
  feedback: {
    profile: { status: 'good' | 'warning' | 'fail'; title: string; notes: string };
    experience: { status: 'good' | 'warning' | 'fail'; title: string; notes: string };
    skills: { status: 'good' | 'warning' | 'fail'; title: string; notes: string };
    education: { status: 'good' | 'warning' | 'fail'; title: string; notes: string };
  };
  actionPlan: Array<{
    step: string; // e.g. "1"
    title: string;
    text: string;
  }>; // 3 to 5 clear action items in order of priority
  suggestedJobs: Array<{
    title: string; // suggested job title suitable for the candidate
    matchReason: string; // why this job is a good fit based on their resume
    confidence: 'High' | 'Medium' | 'Low'; // match confidence level
    suitableSkills: string[]; // key skills from the resume that make them a fit for this role
  }>; // provide 3 to 4 tailored job suggestions based on the candidate's skills and experience
}

Response rules:
1. Ensure the JSON is 100% valid and contains no syntax errors.
2. The feedback must be highly constructive and specific to the actual text of the resume.
3. In bulletSuggestions, extract actual weak bullets from the resume and write high-impact STAR rewrites.
`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error("No response content generated by Gemini.");
    }

    return cleanAndParseJSON(generatedText);
  } catch (err) {
    console.error('Gemini API Error:', err);
    throw err;
  }
}

/**
 * Optimizes a single bullet point using the STAR method.
 */
export async function optimizeBulletPoint(bulletText, targetSkills = '', jobTitle = '', apiKey = '') {
  if (!apiKey) {
    // Local mock bullet optimizer
    return new Promise((resolve) => {
      setTimeout(() => {
        const verbs = ['Spearheaded', 'Orchestrated', 'Engineered', 'Optimized', 'Delivered'];
        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        
        let targetDetail = targetSkills ? ` leveraging ${targetSkills}` : '';
        let titleDetail = jobTitle ? ` as a ${jobTitle}` : '';

        const mockResponse = {
          original: bulletText,
          revised: `${randomVerb} the delivery of high-impact technical initiatives${titleDetail}, integrating best-in-class methodologies${targetDetail} to enhance system efficiency by 28% and accelerate release cycles by 15 days.`,
          breakdown: {
            situation: "Operating in a fast-paced environment requiring streamlined product deployments.",
            task: "Charged with resolving application bottlenecks and delivering key features.",
            action: `Designed and implemented new processes${targetSkills ? ` focusing on ${targetSkills}` : ''}.`,
            result: "Successfully drove an efficiency gain of 28% and cut deployment cycles by 15 days."
          },
          tips: [
            "Replaced passive voice with the strong action verb '" + randomVerb + "'.",
            "Quantified business results (28% efficiency boost, 15 days saved) to showcase value.",
            "Incorporated target technical skills into the action component."
          ]
        };
        resolve(mockResponse);
      }, 1000);
    });
  }

  // Real Gemini API Call
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are a professional resume writer and career coach.
Your task is to take a weak resume bullet point and rewrite it into a powerful, high-impact statement using the STAR method (Situation, Task, Action, Result).
Also provide a breakdown of the STAR components in the rewrite, and 3 specific tips.

INPUT DETAILS:
- Bullet Point: "${bulletText}"
- Target Skills/Keywords to include (if any): "${targetSkills}"
- Target Job Title (if any): "${jobTitle}"

Return STRICTLY a valid JSON object. Do not include markdown code block notation other than JSON.
The JSON object must match this TypeScript interface:
interface BulletOptimizationResult {
  original: string;
  revised: string; // The high-impact STAR rewrite
  breakdown: {
    situation: string; // The situation context implied or structured
    task: string; // The challenge or task
    action: string; // What the candidate did, incorporating target skills
    result: string; // The quantifiable result or outcome
  };
  tips: string[]; // 3 points explaining why this rewrite is effective
}
`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error("No response content generated by Gemini.");
    }

    return cleanAndParseJSON(generatedText);
  } catch (err) {
    console.error('Gemini API Error:', err);
    throw err;
  }
}

/**
 * Career Pathfinder API Service Call.
 */
export async function suggestJobsForResume(resumeText, apiKey = '') {
  if (!apiKey) {
    // Return local analyzed data if no api key
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = localAnalyzeText(resumeText, '');
        // Enhance local suggestedJobs with skillsToAcquire for consistency
        const enhancedJobs = result.suggestedJobs.map(job => ({
          ...job,
          skillsToAcquire: job.title.includes("Frontend") 
            ? ["TypeScript", "Next.js", "Redux Toolkit", "Sass"]
            : job.title.includes("Backend") 
            ? ["Docker", "Kubernetes", "Redis", "System Design"]
            : job.title.includes("Project") 
            ? ["Product Strategy", "User Research", "SQL", "Mixpanel"]
            : ["Python", "Pandas", "Tableau", "SQL Window Functions"]
        }));
        resolve(enhancedJobs);
      }, 1500); // simulate API delay
    });
  }

  // Real Gemini API Call
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are an expert career advisor and technical recruiter.
Analyze the following resume text and suggest 3 to 5 matching job titles / career paths suitable for the candidate.

RESUME TEXT:
"""
${resumeText}
"""

You MUST return a JSON object matching this exact TypeScript interface:
interface JobSuggestions {
  suggestedJobs: Array<{
    title: string; // e.g. "Senior Frontend Developer"
    matchReason: string; // detailed explanation of why they fit based on their resume
    confidence: 'High' | 'Medium' | 'Low';
    suitableSkills: string[]; // key skills from their resume that support this suggestion
    skillsToAcquire: string[]; // recommended skills or tools they should learn to excel in this role
  }>;
}

Response rules:
1. Ensure the JSON is 100% valid and contains no syntax errors.
2. Provide specific, tailored feedback based on their actual background.
`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error("No response content generated by Gemini.");
    }

    const parsed = cleanAndParseJSON(generatedText);
    return parsed.suggestedJobs || [];
  } catch (err) {
    console.error('Gemini API Error:', err);
    throw err;
  }
}
