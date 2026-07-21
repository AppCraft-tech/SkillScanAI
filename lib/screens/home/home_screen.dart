import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/routes/app_routes.dart';
import '../../providers/auth_provider.dart';
import '../../providers/interview_provider.dart';
import '../../providers/profile_provider.dart';
import '../../widgets/cards/stat_card.dart';
import '../../widgets/cards/history_card.dart';
import '../../widgets/cards/category_card.dart';
import '../../widgets/common/gradient_container.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late String _dailyTip;

  @override
  void initState() {
    super.initState();
    // Choose a random daily tip
    final random = Random();
    _dailyTip = AppConstants.dailyTips[random.nextInt(AppConstants.dailyTips.length)];
    
    // Load history
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ProfileProvider>(context, listen: false).loadHistory();
    });
  }

  IconData _getCategoryIcon(String name) {
    switch (name.toLowerCase()) {
      case 'software engineer':
        return Icons.code;
      case 'flutter developer':
        return Icons.phone_android;
      case 'web developer':
        return Icons.web;
      case 'data analyst':
        return Icons.analytics;
      case 'ui/ux designer':
        return Icons.palette;
      case 'hr interview':
        return Icons.people;
      default:
        return Icons.star;
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final profileProvider = Provider.of<ProfileProvider>(context);
    final interviewProvider = Provider.of<InterviewProvider>(context);
    final userName = authProvider.currentUser?.name ?? 'User';

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            GestureDetector(
              onTap: () => Navigator.pushNamed(context, AppRoutes.profile),
              child: CircleAvatar(
                backgroundColor: AppConstants.primaryColor.withOpacity(0.1),
                radius: 20,
                child: Text(
                  userName.isNotEmpty ? userName[0].toUpperCase() : 'U',
                  style: const TextStyle(
                    color: AppConstants.primaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Hello, $userName!',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppConstants.lightTextColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const Text(
                  'Ready to practice?',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppConstants.textColor,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle_outlined, size: 26),
            onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
          ),
          IconButton(
            icon: const Icon(Icons.logout_outlined, color: AppConstants.errorColor),
            onPressed: () async {
              await authProvider.logout();
              if (context.mounted) {
                Navigator.pushReplacementNamed(context, AppRoutes.login);
              }
            },
          ),
        ],
      ),
      body: GradientContainer(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Section - Professional AI Interview Coach banner
              Container(
                margin: const EdgeInsets.all(16.0),
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppConstants.primaryColor, AppConstants.secondaryColor],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: AppConstants.primaryColor.withOpacity(0.2),
                      blurRadius: 18,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Text(
                                  'AI Coach Live',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 14),
                              const Text(
                                'Practice Smarter.\nGet Hired Faster.',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  height: 1.3,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Get instant AI performance reviews, mock questions, voice analytics, and detailed suggestions.',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.85),
                                  fontSize: 12.5,
                                  height: 1.4,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        // Programmatic AI Coach Illustration
                        Container(
                          height: 110,
                          width: 100,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: const Stack(
                            alignment: Alignment.center,
                            children: [
                              Icon(Icons.psychology, size: 54, color: Colors.white),
                              Positioned(
                                bottom: 12,
                                right: 12,
                                child: Icon(Icons.check_circle, size: 20, color: AppConstants.accentColor),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: AppConstants.primaryColor,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: () {
                          Navigator.pushNamed(context, AppRoutes.interviewSetup);
                        },
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Start Mock Interview',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_outlined, size: 18),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Daily AI Tip
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppConstants.primaryColor.withOpacity(0.15), width: 1.5),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppConstants.primaryColor.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.lightbulb, color: AppConstants.primaryColor, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Daily AI Tip',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppConstants.primaryColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _dailyTip,
                            style: const TextStyle(
                              fontSize: 12.5,
                              color: AppConstants.textColor,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Continue Last Interview (Conditional display)
              if (profileProvider.history.isNotEmpty) ...[
                const Padding(
                  padding: EdgeInsets.only(left: 18.0, top: 16.0, bottom: 8.0),
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppConstants.textColor),
                  child: Text('Continue Last Interview'),
                ),
                GestureDetector(
                  onTap: () {
                    final last = profileProvider.history.first;
                    interviewProvider.setJobRole(last.jobRole);
                    interviewProvider.setDifficulty(last.difficulty);
                    interviewProvider.setStyle(last.style);
                    interviewProvider.setVoice(last.voice);
                    Navigator.pushNamed(context, AppRoutes.interviewSetup);
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppConstants.primaryColor.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.play_circle_fill, color: AppConstants.primaryColor, size: 36),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Retry ${profileProvider.history.first.jobRole}',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppConstants.textColor),
                              ),
                              Text(
                                'Style: ${profileProvider.history.first.style} • Score: ${profileProvider.history.first.score}/10',
                                style: const TextStyle(fontSize: 12, color: AppConstants.lightTextColor),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios, size: 14, color: AppConstants.primaryColor),
                      ],
                    ),
                  ),
                ),
              ],

              // Quick Statistics
              const Padding(
                padding: EdgeInsets.only(left: 18.0, top: 20.0, bottom: 10.0),
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppConstants.textColor),
                child: Text('Quick Statistics'),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 2.2,
                  children: [
                    StatCard(
                      title: 'Completed',
                      value: '${profileProvider.totalInterviews}',
                      icon: Icons.assignment_turned_in,
                    ),
                    StatCard(
                      title: 'Avg Score',
                      value: '${profileProvider.averageScore}/10',
                      icon: Icons.star_half,
                      iconColor: Colors.orange,
                    ),
                    StatCard(
                      title: 'Best Score',
                      value: '${profileProvider.bestScore}/10',
                      icon: Icons.emoji_events,
                      iconColor: Colors.amber,
                    ),
                    StatCard(
                      title: 'Success Rate',
                      value: profileProvider.totalInterviews > 0 ? '94%' : '0%',
                      icon: Icons.trending_up,
                      iconColor: Colors.blue,
                    ),
                  ],
                ),
              ),

              // Popular Categories
              const Padding(
                padding: EdgeInsets.only(left: 18.0, top: 24.0, bottom: 12.0),
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppConstants.textColor),
                child: Text('Popular Categories'),
              ),
              SizedBox(
                height: 120,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: AppConstants.popularCategories.length,
                  itemBuilder: (context, index) {
                    final cat = AppConstants.popularCategories[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: CategoryCard(
                        title: cat,
                        icon: _getCategoryIcon(cat),
                        onTap: () {
                          interviewProvider.setJobRole(cat);
                          Navigator.pushNamed(context, AppRoutes.interviewSetup);
                        },
                      ),
                    );
                  },
                ),
              ),

              // Recent Interview Results
              if (profileProvider.history.isNotEmpty) ...[
                Padding(
                  padding: const EdgeInsets.only(left: 18.0, top: 24.0, bottom: 8.0, right: 18.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Recent Interview Results',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppConstants.textColor),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
                        child: const Text('View All', style: TextStyle(color: AppConstants.primaryColor, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: min(3, profileProvider.history.length),
                  itemBuilder: (context, index) {
                    final item = profileProvider.history[index];
                    return HistoryCard(
                      interview: item,
                      onTap: () {
                        // Store chosen result as current selection and display Results screen
                        // We can set it in provider
                        Navigator.pushNamed(context, AppRoutes.results, arguments: item);
                      },
                    );
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
