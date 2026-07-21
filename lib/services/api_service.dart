import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';

class ApiService {
  static Future<String> generateQuestion({
    required String role,
    required String difficulty,
    required String style,
  }) async {
    final prompt = '''
You are an expert HR and technical interviewer.
Generate ONE professional interview question for a $role candidate.

Details:
- Difficulty level: $difficulty
- Interview style focus: $style

Rules:
- Return ONLY the question.
- No numbering or prefixes.
- No explanation.
- Maximum 30 words.
''';

    try {
      final url = Uri.parse('${AppConstants.geminiEndpoint}?key=${AppConstants.geminiApiKey}');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [
            {
              'parts': [
                {'text': prompt}
              ]
            }
          ]
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final text = data['candidates'][0]['content']['parts'][0]['text'] as String;
        return text.trim();
      } else {
        throw Exception('Failed to generate question: ${response.statusCode} ${response.body}');
      }
    } catch (e) {
      // Fallback fallback questions if the API fails or is offline
      return _getFallbackQuestion(role, difficulty, style);
    }
  }

  static Future<Map<String, dynamic>> evaluateAnswer({
    required String question,
    required String answer,
    required String role,
  }) async {
    final prompt = '''
You are an expert HR Interviewer.
Evaluate this candidate's answer for a $role position.

Interview Question:
$question

Candidate Answer:
$answer

Evaluate the answer professionally.
Return ONLY in this exact template format:

Overall Score: X/10

Confidence: X%

Communication: X%

Technical Knowledge: X%

Grammar: X%

Strengths:
• [Strength 1]
• [Strength 2]

Weaknesses:
• [Weakness 1]
• [Weakness 2]

Suggestions:
• [Suggestion 1]
• [Suggestion 2]
''';

    try {
      final url = Uri.parse('${AppConstants.geminiEndpoint}?key=${AppConstants.geminiApiKey}');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [
            {
              'parts': [
                {'text': prompt}
              ]
            }
          ]
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final text = data['candidates'][0]['content']['parts'][0]['text'] as String;
        return _parseEvaluationText(text);
      } else {
        throw Exception('Failed to evaluate answer: ${response.statusCode} ${response.body}');
      }
    } catch (e) {
      return _getFallbackEvaluation(question, answer, role);
    }
  }

  static Map<String, dynamic> _parseEvaluationText(String text) {
    // Default values
    double score = 7.5;
    int confidence = 75;
    int communication = 70;
    int technical = 75;
    int grammar = 80;
    List<String> strengths = [];
    List<String> weaknesses = [];
    List<String> suggestions = [];

    try {
      final scoreMatch = RegExp(r'Overall Score:\s*(\d+(\.\d+)?)\s*\/10', caseSensitive: false).firstMatch(text);
      if (scoreMatch != null) {
        score = double.parse(scoreMatch.group(1)!);
      }

      final confMatch = RegExp(r'Confidence:\s*(\d+)\s*%', caseSensitive: false).firstMatch(text);
      if (confMatch != null) {
        confidence = int.parse(confMatch.group(1)!);
      }

      final commMatch = RegExp(r'Communication:\s*(\d+)\s*%', caseSensitive: false).firstMatch(text);
      if (commMatch != null) {
        communication = int.parse(commMatch.group(1)!);
      }

      final techMatch = RegExp(r'Technical\s+(?:Knowledge|Skills):\s*(\d+)\s*%', caseSensitive: false).firstMatch(text);
      if (techMatch != null) {
        technical = int.parse(techMatch.group(1)!);
      }

      final gramMatch = RegExp(r'Grammar:\s*(\d+)\s*%', caseSensitive: false).firstMatch(text);
      if (gramMatch != null) {
        grammar = int.parse(gramMatch.group(1)!);
      }

      // Extraction of bullet points
      strengths = _extractBullets(text, 'Strengths');
      weaknesses = _extractBullets(text, 'Weaknesses');
      suggestions = _extractBullets(text, 'Suggestions');
    } catch (e) {
      // Ignore parsing errors and keep defaults
    }

    if (strengths.isEmpty) strengths = ['Demonstrated basic knowledge of the topic.', 'Communicated key details.'];
    if (weaknesses.isEmpty) weaknesses = ['Could elaborate more on personal experiences.', 'Slight structural inconsistencies.'];
    if (suggestions.isEmpty) suggestions = ['Try to explain your answer using the STAR structure.', 'Practice slow and clear speech.'];

    return {
      'score': score,
      'confidence': confidence,
      'communication': communication,
      'technical': technical,
      'grammar': grammar,
      'strengths': strengths,
      'weaknesses': weaknesses,
      'suggestions': suggestions,
      'raw': text,
    };
  }

  static List<String> _extractBullets(String text, String section) {
    final List<String> list = [];
    final lines = text.split('\n');
    bool inSection = false;

    for (var line in lines) {
      line = line.trim();
      if (line.toLowerCase().startsWith('${section.toLowerCase()}:')) {
        inSection = true;
        continue;
      }
      
      // Stop condition for the section
      if (inSection && line.isNotEmpty && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*') && line.contains(':')) {
        break;
      }

      if (inSection && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
        final cleaned = line.replaceFirst(RegExp(r'^[•\-*]\s*'), '').trim();
        if (cleaned.isNotEmpty) {
          list.add(cleaned);
        }
      }
    }
    return list;
  }

  static String _getFallbackQuestion(String role, String difficulty, String style) {
    final Map<String, List<String>> questions = {
      'software engineer': [
        'Can you explain the difference between a process and a thread?',
        'How do you design a system for high availability and low latency?',
        'Describe a complex technical challenge you faced and how you solved it.',
      ],
      'flutter developer': [
        'Explain the Flutter widget lifecycle in detail.',
        'How does state management work in Flutter, and which approach do you prefer?',
        'What is the difference between hot reload and hot restart?',
      ],
      'web developer': [
        'What is the event loop in JavaScript and how does it work?',
        'Explain the difference between client-side rendering and server-side rendering.',
        'How do you optimize a web application for speed and core web vitals?',
      ],
      'data analyst': [
        'What is the difference between supervised and unsupervised learning?',
        'How do you handle missing or noisy data in a dataset?',
        'Explain what a p-value is in statistical testing.',
      ],
      'ui/ux designer': [
        'What is your user research process before you begin designing?',
        'How do you handle negative feedback from stakeholders on your designs?',
        'Describe the difference between UI and UX with an example.',
      ],
    };

    final normalizedRole = role.toLowerCase();
    for (final key in questions.keys) {
      if (normalizedRole.contains(key)) {
        final list = questions[key]!;
        return list[DateTime.now().millisecond % list.length];
      }
    }

    return 'Tell me about a time you had to learn a new technology quickly and how you applied it.';
  }

  static Map<String, dynamic> _getFallbackEvaluation(String question, String answer, String role) {
    // Generate simple numerical scores based on answer length to make it dynamic
    final int wordCount = answer.split(RegExp(r'\s+')).length;
    double score = 5.0;
    if (wordCount > 40) {
      score = 9.0;
    } else if (wordCount > 20) {
      score = 7.5;
    } else if (wordCount > 5) {
      score = 6.0;
    }

    int confidence = (score * 10).toInt();
    int communication = (score * 10 - 5).toInt();
    int technical = (score * 10 + 2).toInt();
    if (technical > 100) technical = 100;
    int grammar = 85;

    return {
      'score': score,
      'confidence': confidence,
      'communication': communication,
      'technical': technical,
      'grammar': grammar,
      'strengths': [
        'Gave a concise response addressing the topic.',
        'Communicated clear terminology relevant to $role.'
      ],
      'weaknesses': [
        'Could offer more details or code examples to demonstrate expertise.',
        'Structure could be enhanced with an introductory thesis.'
      ],
      'suggestions': [
        'Adopt the STAR format: specify Situation, Task, Action, and the final Result.',
        'Try speaking for at least 45 seconds to thoroughly unpack the technical aspects.'
      ],
      'raw': 'Fallback evaluation due to offline mode or API issue.'
    };
  }
}
