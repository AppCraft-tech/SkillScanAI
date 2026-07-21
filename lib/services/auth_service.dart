import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';
import '../models/user_model.dart';

class AuthService {
  // Register a new user
  static Future<bool> register(UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    final usersJson = prefs.getString(AppConstants.keyRegisteredUsers) ?? '[]';
    final List<dynamic> usersList = jsonDecode(usersJson);
    
    // Check if user already exists
    final exists = usersList.any((u) => u['email'] == user.email);
    if (exists) {
      return false;
    }

    usersList.add(user.toJson());
    await prefs.setString(AppConstants.keyRegisteredUsers, jsonEncode(usersList));
    return true;
  }

  // Login checking
  static Future<UserModel?> login(String email, String password, bool rememberMe) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Support guest login or default demo account if no accounts exist
    if (email == 'demo@interviewace.com' && password == 'password123') {
      final user = UserModel(name: 'Demo User', email: email, password: password);
      if (rememberMe) {
        await _saveLoginSession(user);
      }
      return user;
    }

    final usersJson = prefs.getString(AppConstants.keyRegisteredUsers) ?? '[]';
    final List<dynamic> usersList = jsonDecode(usersJson);

    for (var u in usersList) {
      if (u['email'] == email && u['password'] == password) {
        final user = UserModel.fromJson(u);
        if (rememberMe) {
          await _saveLoginSession(user);
        }
        return user;
      }
    }
    return null;
  }

  // Save current active login session
  static Future<void> _saveLoginSession(UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(AppConstants.keyIsLoggedIn, true);
    await prefs.setString(AppConstants.keyUserEmail, user.email);
    await prefs.setString(AppConstants.keyUserName, user.name);
  }

  // Check if session exists
  static Future<UserModel?> checkLoginSession() async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool(AppConstants.keyIsLoggedIn) ?? false;
    if (!isLoggedIn) return null;

    final email = prefs.getString(AppConstants.keyUserEmail) ?? '';
    final name = prefs.getString(AppConstants.keyUserName) ?? '';
    if (email.isEmpty) return null;

    return UserModel(name: name, email: email, password: '');
  }

  // Logout
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(AppConstants.keyIsLoggedIn, false);
    await prefs.remove(AppConstants.keyUserEmail);
    await prefs.remove(AppConstants.keyUserName);
  }
}
