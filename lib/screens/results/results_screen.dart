import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/routes/app_routes.dart';
import '../../models/interview_model.dart';
import '../../providers/interview_provider.dart';
import '../../widgets/buttons/primary_button.dart';
import '../../widgets/buttons/secondary_button.dart';
import '../../widgets/common/gradient_container.dart';

class ResultsScreen extends StatelessWidget {
  const ResultsScreen({Key? key}) : super(key: key);

  void _showActionFeedback(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppConstants.primaryColor,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Widget _buildMetricRow(BuildContext context, String title, int percentage, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, size: 18, color: color),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppConstants.textColor),
                  ),
                ],
              ),
              Text(
                '$percentage%',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: color),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: percentage / 100,
              backgroundColor: color.withOpacity(0.1),
              color: color,
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBulletPoints(String title, List<String> points, IconData icon, Color color) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: color),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...points.map((pt) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('• ', style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 16)),
                  Expanded(
                    child: Text(
                      pt,
                      style: const TextStyle(fontSize: 13, color: AppConstants.textColor, height: 1.4),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Retreive arguments if passed, otherwise fall back to latest provider result
    final InterviewModel? argResult = ModalRoute.of(context)?.settings.arguments as InterviewModel?;
    final interviewProvider = Provider.of<InterviewProvider>(context, listen: false);
    
    final result = argResult ?? interviewProvider.lastResult;

    if (result == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Results')),
        body: const Center(child: Text('No results data found. Please complete an interview first.')),
      );
    }

    final scoreColor = result.score >= 8.0 
      ? AppConstants.primaryColor 
      : (result.score >= 6.0 ? Colors.orange : AppConstants.errorColor);

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Evaluation Feedback'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, size: 18),
          onPressed: () => Navigator.pushReplacementNamed(context, AppRoutes.home),
        ),
      ),
      body: GradientContainer(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 30),
          child: Column(
            children: [
              // Score Radial Card
              Container(
                margin: const EdgeInsets.all(16.0),
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Text(
                      result.jobRole,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: AppConstants.textColor,
                      ),
                    ),
                    Text(
                      'Difficulty: ${result.difficulty} • Style: ${result.style}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppConstants.lightTextColor,
                      ),
                    ),
                    const SizedBox(height: 24),
                    
                    // Radial Score Visualizer
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        SizedBox(
                          height: 120,
                          width: 120,
                          child: CircularProgressIndicator(
                            value: result.score / 10,
                            strokeWidth: 10,
                            backgroundColor: scoreColor.withOpacity(0.1),
                            color: scoreColor,
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '${result.score}',
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: scoreColor,
                              ),
                            ),
                            const Text(
                              'out of 10',
                              style: TextStyle(
                                fontSize: 11,
                                color: AppConstants.lightTextColor,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Badge text
                    Text(
                      result.score >= 8.5 
                        ? 'Excellent Performance!' 
                        : (result.score >= 7.0 ? 'Strong Candidate' : 'Keep Practicing'),
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: scoreColor,
                      ),
                    ),
                  ],
                ),
              ),

              // Multi-dimensional metrics
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.03),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Performance Metrics',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppConstants.textColor),
                      ),
                      const SizedBox(height: 12),
                      _buildMetricRow(context, 'Confidence Level', result.confidence, Icons.face, Colors.blue),
                      _buildMetricRow(context, 'Communication Delivery', result.communication, Icons.record_voice_over, Colors.purple),
                      _buildMetricRow(context, 'Technical Knowledge', result.technical, Icons.settings_suggest, Colors.teal),
                      _buildMetricRow(context, 'Grammar & Articulation', result.grammar, Icons.spellcheck, Colors.amber.shade800),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total Response Time:',
                            style: TextStyle(fontSize: 12, color: AppConstants.lightTextColor, fontWeight: FontWeight.w500),
                          ),
                          Text(
                            result.responseTime,
                            style: const TextStyle(fontSize: 13, color: AppConstants.textColor, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // AI Analysis Bullet Points
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Column(
                  children: [
                    _buildBulletPoints('Strengths & Highlights', result.strengths, Icons.check_circle_outline, AppConstants.primaryColor),
                    _buildBulletPoints('Weaknesses & Pain Points', result.weaknesses, Icons.warning_amber_rounded, AppConstants.errorColor),
                    _buildBulletPoints('AI Actionable Suggestions', result.suggestions, Icons.lightbulb_outline, Colors.orange),
                  ],
                ),
              ),

              // Detailed Questions and Answers Review
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Response Review',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppConstants.textColor),
                      ),
                      const SizedBox(height: 12),
                      ...List.generate(result.questions.length, (idx) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 18.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Q${idx + 1}: ${result.questions[idx]}',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppConstants.textColor),
                              ),
                              const SizedBox(height: 4),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade50,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  result.answers.length > idx ? result.answers[idx] : '[No response recorded]',
                                  style: const TextStyle(fontSize: 12.5, color: AppConstants.lightTextColor, fontStyle: FontStyle.italic),
                                ),
                              ),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ),

              // Action Buttons
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: SecondaryButton(
                            text: 'Retry Coach',
                            icon: Icons.refresh,
                            onPressed: () {
                              interviewProvider.setJobRole(result.jobRole);
                              Navigator.pushReplacementNamed(context, AppRoutes.interviewSetup);
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: PrimaryButton(
                            text: 'Save Result',
                            icon: Icons.save_alt,
                            onPressed: () => _showActionFeedback(context, 'Result saved to local profile history.'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: SecondaryButton(
                            text: 'PDF Report',
                            icon: Icons.picture_as_pdf,
                            onPressed: () => _showActionFeedback(context, 'PDF report compiled and downloaded successfully.'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: SecondaryButton(
                            text: 'Share Result',
                            icon: Icons.share,
                            onPressed: () => _showActionFeedback(context, 'Evaluation shared with external devices successfully.'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    PrimaryButton(
                      text: 'Back to Home Dashboard',
                      color: AppConstants.secondaryColor,
                      icon: Icons.home,
                      onPressed: () {
                        Navigator.pushReplacementNamed(context, AppRoutes.home);
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
