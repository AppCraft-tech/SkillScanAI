import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/routes/app_routes.dart';
import '../../providers/interview_provider.dart';
import '../../widgets/buttons/primary_button.dart';
import '../../widgets/common/gradient_container.dart';

class InterviewSetupScreen extends StatefulWidget {
  const InterviewSetupScreen({Key? key}) : super(key: key);

  @override
  State<InterviewSetupScreen> createState() => _InterviewSetupScreenState();
}

class _InterviewSetupScreenState extends State<InterviewSetupScreen> {
  final TextEditingController _customRoleController = TextEditingController();
  bool _isCustomRole = false;

  final List<String> _difficulties = ['Easy', 'Medium', 'Hard'];
  final List<int> _questionCounts = [3, 5, 10];
  final List<String> _styles = ['Technical', 'Behavioral', 'Mixed'];
  final List<String> _voices = ['Female (Aria)', 'Male (James)', 'Robotic (Echo)'];

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<InterviewProvider>(context, listen: false);
    // Check if the current job role is custom or not in the defaults list
    if (!AppConstants.popularCategories.contains(provider.jobRole)) {
      _isCustomRole = true;
      _customRoleController.text = provider.jobRole;
    }
  }

  @override
  void dispose() {
    _customRoleController.dispose();
    super.dispose();
  }

  Future<void> _handleStartInterview() async {
    final provider = Provider.of<InterviewProvider>(context, listen: false);
    
    if (_isCustomRole) {
      if (_customRoleController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter a custom job role'),
            backgroundColor: AppConstants.errorColor,
          ),
        );
        return;
      }
      provider.setJobRole(_customRoleController.text.trim());
    }

    // Call API and start interview
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: Card(
          elevation: 8,
          child: Padding(
            padding: EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircularProgressIndicator(color: AppConstants.primaryColor),
                SizedBox(height: 16),
                Text('AI generating interview questions...', style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
      ),
    );

    await provider.startInterview();
    
    if (mounted) {
      Navigator.pop(context); // Close loading dialog
      Navigator.pushReplacementNamed(context, AppRoutes.interview);
    }
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10, top: 18),
      child: Text(
        title,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 15,
          color: AppConstants.textColor,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<InterviewProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Interview Setup'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: GradientContainer(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Customize Your Coach',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: AppConstants.textColor,
                      ),
                    ),
                    const Text(
                      'Choose your preferences and the AI will tailor the interview experience to match your expectations.',
                      style: TextStyle(color: AppConstants.lightTextColor, fontSize: 13),
                    ),
                    const SizedBox(height: 14),

                    // Job Role Selection
                    _buildSectionHeader('Job Role / Position'),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.grey.shade200, width: 1.5),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _isCustomRole ? 'Custom' : provider.jobRole,
                          isExpanded: true,
                          icon: const Icon(Icons.arrow_drop_down, color: AppConstants.primaryColor),
                          items: [
                            ...AppConstants.popularCategories.map((role) {
                              return DropdownMenuItem(value: role, child: Text(role));
                            }).toList(),
                            const DropdownMenuItem(value: 'Custom', child: Text('Custom Role...')),
                          ],
                          onChanged: (val) {
                            setState(() {
                              if (val == 'Custom') {
                                _isCustomRole = true;
                              } else {
                                _isCustomRole = false;
                                provider.setJobRole(val!);
                              }
                            });
                          },
                        ),
                      ),
                    ),

                    if (_isCustomRole) ...[
                      const SizedBox(height: 12),
                      TextField(
                        controller: _customRoleController,
                        decoration: const InputDecoration(
                          labelText: 'Specify Custom Role',
                          hintText: 'e.g. Senior iOS Developer',
                          prefixIcon: Icon(Icons.keyboard, color: AppConstants.primaryColor),
                        ),
                      ),
                    ],

                    // Difficulty Level (Custom cards)
                    _buildSectionHeader('Difficulty Level'),
                    Row(
                      children: _difficulties.map((diff) {
                        final isSel = provider.difficulty == diff;
                        return Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4.0),
                            child: InkWell(
                              onTap: () => provider.setDifficulty(diff),
                              borderRadius: BorderRadius.circular(16),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                decoration: BoxDecoration(
                                  color: isSel ? AppConstants.primaryColor : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isSel ? AppConstants.primaryColor : Colors.grey.shade200,
                                    width: 1.5,
                                  ),
                                ),
                                child: Text(
                                  diff,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    color: isSel ? Colors.white : AppConstants.textColor,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    // Number of Questions
                    _buildSectionHeader('Number of Questions'),
                    Row(
                      children: _questionCounts.map((count) {
                        final isSel = provider.numQuestions == count;
                        return Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4.0),
                            child: InkWell(
                              onTap: () => provider.setNumQuestions(count),
                              borderRadius: BorderRadius.circular(16),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                decoration: BoxDecoration(
                                  color: isSel ? AppConstants.primaryColor : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isSel ? AppConstants.primaryColor : Colors.grey.shade200,
                                    width: 1.5,
                                  ),
                                ),
                                child: Text(
                                  '$count Qs',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    color: isSel ? Colors.white : AppConstants.textColor,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    // Interview Style
                    _buildSectionHeader('Interview Style'),
                    Row(
                      children: _styles.map((styleOpt) {
                        final isSel = provider.style == styleOpt;
                        return Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4.0),
                            child: InkWell(
                              onTap: () => provider.setStyle(styleOpt),
                              borderRadius: BorderRadius.circular(16),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                decoration: BoxDecoration(
                                  color: isSel ? AppConstants.primaryColor : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isSel ? AppConstants.primaryColor : Colors.grey.shade200,
                                    width: 1.5,
                                  ),
                                ),
                                child: Text(
                                  styleOpt,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    color: isSel ? Colors.white : AppConstants.textColor,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    // AI Voice
                    _buildSectionHeader('AI Voice Synthesizer'),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.grey.shade200, width: 1.5),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: provider.voice,
                          isExpanded: true,
                          icon: const Icon(Icons.keyboard_voice, color: AppConstants.primaryColor),
                          items: _voices.map((voiceOpt) {
                            return DropdownMenuItem(value: voiceOpt, child: Text(voiceOpt));
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) {
                              provider.setVoice(val);
                            }
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            // Bottom Action Button
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 16,
                    offset: const Offset(0, -6),
                  ),
                ],
              ),
              child: PrimaryButton(
                text: 'Start Interview',
                icon: Icons.play_arrow_rounded,
                onPressed: _handleStartInterview,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
