import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';
import '../../models/interview_model.dart';

class HistoryCard extends StatelessWidget {
  final InterviewModel interview;
  final VoidCallback onTap;

  const HistoryCard({
    Key? key,
    required this.interview,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Generate color scheme based on score
    final score = interview.score;
    Color badgeColor = AppConstants.primaryColor;
    if (score < 5) {
      badgeColor = AppConstants.errorColor;
    } else if (score < 8) {
      badgeColor = Colors.orange;
    }

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        padding: const EdgeInsets.all(18),
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
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    interview.jobRole,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: AppConstants.textColor,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(Icons.calendar_today, size: 14, color: AppConstants.lightTextColor.withOpacity(0.8)),
                      const SizedBox(width: 6),
                      Text(
                        interview.date,
                        style: TextStyle(
                          fontSize: 12,
                          color: AppConstants.lightTextColor.withOpacity(0.8),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Icon(Icons.psychology, size: 14, color: AppConstants.lightTextColor.withOpacity(0.8)),
                      const SizedBox(width: 6),
                      Text(
                        '${interview.numQuestions} Qs • ${interview.difficulty}',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppConstants.lightTextColor.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 14),
              decoration: BoxDecoration(
                color: badgeColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                '${interview.score}/10',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: badgeColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
