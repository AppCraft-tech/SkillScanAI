import 'dart:async';
import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/interview_model.dart';
import '../services/api_service.dart';
import '../services/interview_service.dart';

class InterviewProvider with ChangeNotifier {
  // Setup States
  String _jobRole = 'Software Engineer';
  String _difficulty = 'Medium';
  int _numQuestions = 3;
  String _style = 'Technical';
  String _voice = 'Female (Aria)';

  // Getter/Setters for setup
  String get jobRole => _jobRole;
  String get difficulty => _difficulty;
  int get numQuestions => _numQuestions;
  String get style => _style;
  String get voice => _voice;

  void setJobRole(String val) { _jobRole = val; notifyListeners(); }
  void setDifficulty(String val) { _difficulty = val; notifyListeners(); }
  void setNumQuestions(int val) { _numQuestions = val; notifyListeners(); }
  void setStyle(String val) { _style = val; notifyListeners(); }
  void setVoice(String val) { _voice = val; notifyListeners(); }

  // Active Session States
  bool _isStarted = false;
  bool _isLoading = false;
  int _currentQuestionIndex = 0;
  String _currentQuestion = '';
  String _currentAnswerText = '';
  bool _isListening = false;
  int _timerSeconds = 0;
  Timer? _timer;

  // Lists for accumulating current session
  final List<String> _questions = [];
  final List<String> _answers = [];
  final List<Map<String, dynamic>> _evaluations = [];

  bool get isStarted => _isStarted;
  bool get isLoading => _isLoading;
  int get currentQuestionIndex => _currentQuestionIndex;
  String get currentQuestion => _currentQuestion;
  String get currentAnswerText => _currentAnswerText;
  bool get isListening => _isListening;
  int get timerSeconds => _timerSeconds;
  List<String> get questions => _questions;
  List<String> get answers => _answers;

  // Active Interview Results
  InterviewModel? _lastResult;
  InterviewModel? get lastResult => _lastResult;

  // Timer utilities
  void _startTimer() {
    _timer?.cancel();
    _timerSeconds = 0;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _timerSeconds++;
      notifyListeners();
    });
  }

  void _stopTimer() {
    _timer?.cancel();
  }

  String get formattedTimer {
    final minutes = _timerSeconds ~/ 60;
    final seconds = _timerSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  // Start Interview
  Future<void> startInterview() async {
    _isLoading = true;
    _isStarted = false;
    _currentQuestionIndex = 0;
    _questions.clear();
    _answers.clear();
    _evaluations.clear();
    _currentAnswerText = '';
    _lastResult = null;
    notifyListeners();

    try {
      final question = await ApiService.generateQuestion(
        role: _jobRole,
        difficulty: _difficulty,
        style: _style,
      );
      _questions.add(question);
      _currentQuestion = question;
      _currentQuestionIndex = 1;
      _isStarted = true;
      _startTimer();
    } catch (e) {
      _currentQuestion = 'Failed to load question. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Set/append the current answer
  void updateAnswerText(String text) {
    _currentAnswerText = text;
    notifyListeners();
  }

  // Simulate Listening
  void toggleListening() {
    if (_isListening) {
      _isListening = false;
      notifyListeners();
    } else {
      _isListening = true;
      notifyListeners();
      // Simulate speech detection filling after 2 seconds
      Timer(const Duration(seconds: 2), () {
        if (_isListening) {
          _isListening = false;
          if (_currentAnswerText.isEmpty) {
            _currentAnswerText = "In my experience, this issue can be solved by implementing robust architectural patterns, utilizing automated testing, and ensuring modular design configurations so the system scales efficiently.";
          } else {
            _currentAnswerText += " Additionally, this ensures our overall runtime complexity remains optimal.";
          }
          notifyListeners();
        }
      });
    }
  }

  // Next Question / Evaluate Answer
  Future<bool> submitAnswerAndNext() async {
    if (_currentAnswerText.trim().isEmpty) {
      return false;
    }

    _isLoading = true;
    notifyListeners();

    try {
      // Evaluate current answer
      final evaluation = await ApiService.evaluateAnswer(
        question: _currentQuestion,
        answer: _currentAnswerText,
        role: _jobRole,
      );
      
      _answers.add(_currentAnswerText);
      _evaluations.add(evaluation);
      _currentAnswerText = '';

      if (_currentQuestionIndex < _numQuestions) {
        // Fetch next question
        final nextQ = await ApiService.generateQuestion(
          role: _jobRole,
          difficulty: _difficulty,
          style: _style,
        );
        _questions.add(nextQ);
        _currentQuestion = nextQ;
        _currentQuestionIndex++;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        // Interview Completed!
        _stopTimer();
        await _compileAndSaveResults();
        _isLoading = false;
        _isStarted = false;
        notifyListeners();
        return false; // Tells the view the interview is over and results are compiled
      }
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // End Interview early
  Future<void> endInterviewEarly() async {
    _stopTimer();
    if (_answers.isEmpty && _currentAnswerText.trim().isNotEmpty) {
      _answers.add(_currentAnswerText);
      final evaluation = await ApiService.evaluateAnswer(
        question: _currentQuestion,
        answer: _currentAnswerText,
        role: _jobRole,
      );
      _evaluations.add(evaluation);
    }
    
    // Compile whatever we have
    if (_answers.isNotEmpty) {
      _isLoading = true;
      notifyListeners();
      await _compileAndSaveResults();
      _isLoading = false;
    }
    _isStarted = false;
    notifyListeners();
  }

  // Compile final metrics and save
  Future<void> _compileAndSaveResults() async {
    double totalScore = 0.0;
    int totalConf = 0;
    int totalComm = 0;
    int totalTech = 0;
    int totalGram = 0;

    final List<String> allStrengths = [];
    final List<String> allWeaknesses = [];
    final List<String> allSuggestions = [];

    for (var eval in _evaluations) {
      totalScore += (eval['score'] as num).toDouble();
      totalConf += (eval['confidence'] as num).toInt();
      totalComm += (eval['communication'] as num).toInt();
      totalTech += (eval['technical'] as num).toInt();
      totalGram += (eval['grammar'] as num).toInt();

      allStrengths.addAll(List<String>.from(eval['strengths']));
      allWeaknesses.addAll(List<String>.from(eval['weaknesses']));
      allSuggestions.addAll(List<String>.from(eval['suggestions']));
    }

    final count = _evaluations.isEmpty ? 1 : _evaluations.length;
    final avgScore = double.parse((totalScore / count).toStringAsFixed(1));
    final avgConf = totalConf ~/ count;
    final avgComm = totalComm ~/ count;
    final avgTech = totalTech ~/ count;
    final avgGram = totalGram ~/ count;

    // Deduplicate lists
    final strengths = allStrengths.toSet().toList();
    final weaknesses = allWeaknesses.toSet().toList();
    final suggestions = allSuggestions.toSet().toList();

    // Duration formatting
    final minutes = _timerSeconds ~/ 60;
    final seconds = _timerSeconds % 60;
    final timeStr = minutes > 0 ? '${minutes}m ${seconds}s' : '${seconds}s';

    final result = InterviewModel(
      id: const Uuid().v4(),
      jobRole: _jobRole,
      difficulty: _difficulty,
      numQuestions: _numQuestions,
      style: _style,
      voice: _voice,
      date: 'Today', // Will format nicely on profile history
      score: avgScore,
      confidence: avgConf,
      communication: avgComm,
      technical: avgTech,
      grammar: avgGram,
      responseTime: timeStr,
      strengths: strengths.take(3).toList(),
      weaknesses: weaknesses.take(3).toList(),
      suggestions: suggestions.take(3).toList(),
      questions: List<String>.from(_questions),
      answers: List<String>.from(_answers),
    );

    _lastResult = result;
    await InterviewService.saveInterview(result);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
