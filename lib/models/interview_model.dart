class InterviewModel {
  final String id;
  final String jobRole;
  final String difficulty;
  final int numQuestions;
  final String style;
  final String voice;
  final String date;
  final double score;
  final int confidence;
  final int communication;
  final int technical;
  final int grammar;
  final String responseTime;
  final List<String> strengths;
  final List<String> weaknesses;
  final List<String> suggestions;
  final List<String> questions;
  final List<String> answers;

  InterviewModel({
    required this.id,
    required this.jobRole,
    required this.difficulty,
    required this.numQuestions,
    required this.style,
    required this.voice,
    required this.date,
    required this.score,
    required this.confidence,
    required this.communication,
    required this.technical,
    required this.grammar,
    required this.responseTime,
    required this.strengths,
    required this.weaknesses,
    required this.suggestions,
    required this.questions,
    required this.answers,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'jobRole': jobRole,
      'difficulty': difficulty,
      'numQuestions': numQuestions,
      'style': style,
      'voice': voice,
      'date': date,
      'score': score,
      'confidence': confidence,
      'communication': communication,
      'technical': technical,
      'grammar': grammar,
      'responseTime': responseTime,
      'strengths': strengths,
      'weaknesses': weaknesses,
      'suggestions': suggestions,
      'questions': questions,
      'answers': answers,
    };
  }

  factory InterviewModel.fromJson(Map<String, dynamic> json) {
    return InterviewModel(
      id: json['id'] ?? '',
      jobRole: json['jobRole'] ?? '',
      difficulty: json['difficulty'] ?? 'Medium',
      numQuestions: json['numQuestions'] ?? 3,
      style: json['style'] ?? 'Technical',
      voice: json['voice'] ?? 'Female',
      date: json['date'] ?? '',
      score: (json['score'] as num?)?.toDouble() ?? 0.0,
      confidence: json['confidence'] ?? 0,
      communication: json['communication'] ?? 0,
      technical: json['technical'] ?? 0,
      grammar: json['grammar'] ?? 0,
      responseTime: json['responseTime'] ?? '0s',
      strengths: List<String>.from(json['strengths'] ?? []),
      weaknesses: List<String>.from(json['weaknesses'] ?? []),
      suggestions: List<String>.from(json['suggestions'] ?? []),
      questions: List<String>.from(json['questions'] ?? []),
      answers: List<String>.from(json['answers'] ?? []),
    );
  }
}
