import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';
import '../models/interview_model.dart';

class InterviewService {
  // Save an completed interview
  static Future<void> saveInterview(InterviewModel interview) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Save to historical list
    final historyJson = prefs.getString(AppConstants.keyUserHistory) ?? '[]';
    final List<dynamic> historyList = jsonDecode(historyJson);
    historyList.insert(0, interview.toJson()); // Add at the start (latest first)
    
    await prefs.setString(AppConstants.keyUserHistory, jsonEncode(historyList));
    
    // Save as latest interview
    await prefs.setString(AppConstants.keyLatestInterview, jsonEncode(interview.toJson()));
  }

  // Fetch all interviews in history
  static Future<List<InterviewModel>> getHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final historyJson = prefs.getString(AppConstants.keyUserHistory);
    if (historyJson == null || historyJson.isEmpty) {
      return _getSeedData();
    }
    
    try {
      final List<dynamic> parsed = jsonDecode(historyJson);
      return parsed.map((item) => InterviewModel.fromJson(item)).toList();
    } catch (e) {
      return _getSeedData();
    }
  }

  // Fetch the latest interview
  static Future<InterviewModel?> getLatestInterview() async {
    final prefs = await SharedPreferences.getInstance();
    final latestJson = prefs.getString(AppConstants.keyLatestInterview);
    if (latestJson == null || latestJson.isEmpty) {
      final history = await getHistory();
      if (history.isNotEmpty) {
        return history.first;
      }
      return null;
    }
    
    try {
      return InterviewModel.fromJson(jsonDecode(latestJson));
    } catch (e) {
      return null;
    }
  }

  // Clear history
  static Future<void> clearHistory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.keyUserHistory);
    await prefs.remove(AppConstants.keyLatestInterview);
  }

  // Initial Seed Data to display if history is empty
  static List<InterviewModel> _getSeedData() {
    return [
      InterviewModel(
        id: 'seed-1',
        jobRole: 'Frontend Developer',
        difficulty: 'Medium',
        numQuestions: 3,
        style: 'Technical',
        voice: 'Female',
        date: 'Today',
        score: 9.2,
        confidence: 94,
        communication: 90,
        technical: 92,
        grammar: 88,
        responseTime: '1m 15s',
        strengths: [
          'Maintain eye contact while answering interview questions.',
          'Give more practical examples during technical discussions.',
          'Improve response structure using the STAR interview method.'
        ],
        weaknesses: [
          'Answer structure is slightly disjointed under pressure.',
          'Could elaborate more on CSS performance improvements.'
        ],
        suggestions: [
          'Slow down your pace when describing complex React lifecycle methods.',
          'Adopt structured enumeration (e.g. "Firstly, Secondly...") in your responses.'
        ],
        questions: [
          'What is React state batching and how does it optimize performance?',
          'Explain the difference between useEffect layout effects and standard effects.',
        ],
        answers: [
          'React batches state updates together to avoid multiple unnecessary re-renders of components, which improves application speed.',
          'Layout effects fire synchronously before paint while normal effects run asynchronously after the browser paints.',
        ],
      ),
      InterviewModel(
        id: 'seed-2',
        jobRole: 'React Developer',
        difficulty: 'Medium',
        numQuestions: 3,
        style: 'Technical',
        voice: 'Female',
        date: 'Yesterday',
        score: 8.8,
        confidence: 88,
        communication: 86,
        technical: 90,
        grammar: 84,
        responseTime: '2m 5s',
        strengths: [
          'Practice explaining React state batching concepts in detail.',
          'Slow down your speaking rate to improve voice clarity.'
        ],
        weaknesses: [
          'Tone was a bit monotonic at parts.',
          'Spelling or terminology errors in deep JavaScript engine explanations.'
        ],
        suggestions: [
          'Vary vocal inflection to show enthusiasm.',
          'Use clear architectural terms when talking about V8 and compiler pipelines.'
        ],
        questions: [
          'How does virtual DOM diffing work?',
        ],
        answers: [
          'React creates a virtual tree. When state changes, it compares the old virtual tree with the new virtual tree using a reconciliation algorithm, then updates only the modified nodes.',
        ],
      )
    ];
  }
}
