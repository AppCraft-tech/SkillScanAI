import 'package:flutter/material.dart';
import '../models/interview_model.dart';
import '../services/interview_service.dart';

class ProfileProvider with ChangeNotifier {
  List<InterviewModel> _history = [];
  bool _isLoading = false;
  String? _error;

  List<InterviewModel> get history => _history;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Analytics getters
  int get totalInterviews => _history.length;
  
  double get averageScore {
    if (_history.isEmpty) return 0.0;
    double sum = 0.0;
    for (var item in _history) {
      sum += item.score;
    }
    return double.parse((sum / _history.length).toStringAsFixed(1));
  }

  double get bestScore {
    if (_history.isEmpty) return 0.0;
    double maxScore = 0.0;
    for (var item in _history) {
      if (item.score > maxScore) {
        maxScore = item.score;
      }
    }
    return maxScore;
  }

  // Load history data
  Future<void> loadHistory() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _history = await InterviewService.getHistory();
    } catch (e) {
      _error = 'Failed to load history: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Clear history data
  Future<void> clearAllHistory() async {
    _isLoading = true;
    notifyListeners();

    try {
      await InterviewService.clearHistory();
      _history.clear();
    } catch (e) {
      _error = 'Failed to clear history: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
