import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = 'InterviewAce';
  static const String appTagline = 'Ace Every Interview with AI';

  // API Key from .env
  static const String geminiApiKey = '';
  static const String geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  // Colors (Theme: Green & White)
  static const Color primaryColor = Color(0xFF0F8A5F);     // Emerald green
  static const Color secondaryColor = Color(0xFF166534);   // Forest green
  static const Color accentColor = Color(0xFFA3E635);      // Lime green
  static const Color backgroundColor = Color(0xFFF8FAF8);  // Clean soft gray-white
  static const Color cardColor = Color(0xFFFFFFFF);        // White cards
  static const Color textColor = Color(0xFF1F2937);        // Charcoal text
  static const Color lightTextColor = Color(0xFF6B7280);   // Gray text
  static const Color errorColor = Color(0xFFEF4444);       // Red text/error

  // Shared Preferences Keys
  static const String keyIsLoggedIn = 'is_logged_in';
  static const String keyUserEmail = 'user_email';
  static const String keyUserName = 'user_name';
  static const String keyUserHistory = 'interview_history';
  static const String keyLatestInterview = 'latest_interview';
  static const String keyRegisteredUsers = 'registered_users';

  // Presets / Categories
  static const List<String> popularCategories = [
    'Software Engineer',
    'Flutter Developer',
    'Web Developer',
    'Data Analyst',
    'UI/UX Designer',
    'HR Interview',
  ];

  // Daily AI Tips
  static const List<String> dailyTips = [
    'Use the STAR method (Situation, Task, Action, Result) to structure your behavioral answers.',
    'Always research the company values before the interview and reference them in your answers.',
    'Maintain high energy and speak clearly. AI models evaluate your articulation and structure.',
    'When asked about weaknesses, mention a real weakness and explain how you are working to overcome it.',
    'Make sure to mention specific technologies and frameworks you used in your past projects.',
    'Ask questions at the end of the interview. It shows enthusiasm, curiosity, and interest.',
    'Keep your technical answers structured. Summarize first, then explain, then conclude.',
  ];
}
