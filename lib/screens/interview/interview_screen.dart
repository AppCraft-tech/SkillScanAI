import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/routes/app_routes.dart';
import '../../providers/interview_provider.dart';
import '../../widgets/buttons/primary_button.dart';
import '../../widgets/common/gradient_container.dart';

class InterviewScreen extends StatefulWidget {
  const InterviewScreen({Key? key}) : super(key: key);

  @override
  State<InterviewScreen> createState() => _InterviewScreenState();
}

class _InterviewScreenState extends State<InterviewScreen> with TickerProviderStateMixin {
  final TextEditingController _answerController = TextEditingController();
  late AnimationController _pulseController;
  late AnimationController _waveController;
  bool _cameraOn = true;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat(reverse: true);

    _waveController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _answerController.dispose();
    _pulseController.dispose();
    _waveController.dispose();
    super.dispose();
  }

  Future<void> _handleNext(InterviewProvider provider) async {
    provider.updateAnswerText(_answerController.text);
    
    if (_answerController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please speak or type an answer first.'),
          backgroundColor: AppConstants.errorColor,
        ),
      );
      return;
    }

    final hasNext = await provider.submitAnswerAndNext();
    
    if (mounted) {
      if (hasNext) {
        _answerController.clear();
      } else {
        // No next question (interview completed), navigate to results
        Navigator.pushReplacementNamed(
          context, 
          AppRoutes.results,
          arguments: provider.lastResult,
        );
      }
    }
  }

  void _handleEndEarly(InterviewProvider provider) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('End Interview?', style: TextStyle(fontWeight: FontWeight.bold)),
        content: const Text('Are you sure you want to end the interview early? We will evaluate the questions you have answered so far.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel', style: TextStyle(color: AppConstants.lightTextColor)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppConstants.errorColor),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('End & Score'),
          ),
        ],
      ),
    );

    if (confirm == true && mounted) {
      provider.updateAnswerText(_answerController.text);
      
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
                  Text('Compiling final metrics & AI feedback...', style: TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
        ),
      );

      await provider.endInterviewEarly();
      
      if (mounted) {
        Navigator.pop(context); // Close loading
        Navigator.pushReplacementNamed(
          context, 
          AppRoutes.results,
          arguments: provider.lastResult,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<InterviewProvider>(context);

    // Keep answer field synced with provider speech simulated updates
    if (provider.currentAnswerText != _answerController.text && !provider.isListening) {
      _answerController.text = provider.currentAnswerText;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(provider.jobRole),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => _handleEndEarly(provider),
        ),
        actions: [
          // Timer
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppConstants.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.timer_outlined, size: 16, color: AppConstants.primaryColor),
                const SizedBox(width: 6),
                Text(
                  provider.formattedTimer,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppConstants.primaryColor,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: GradientContainer(
        child: Column(
          children: [
            // Progress Indicator
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Question ${provider.currentQuestionIndex} of ${provider.numQuestions}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppConstants.textColor,
                          fontSize: 13,
                        ),
                      ),
                      Text(
                        '${((provider.currentQuestionIndex / provider.numQuestions) * 100).toInt()}% Completed',
                        style: const TextStyle(
                          fontWeight: FontWeight.w500,
                          color: AppConstants.lightTextColor,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: LinearProgressIndicator(
                      value: provider.currentQuestionIndex / provider.numQuestions,
                      backgroundColor: Colors.grey.shade200,
                      color: AppConstants.primaryColor,
                      minHeight: 6,
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
                child: Column(
                  children: [
                    // Top: Camera Preview (High Fidelity Mockup with controls)
                    Stack(
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          height: 180,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: _cameraOn ? Colors.black.withOpacity(0.85) : Colors.grey.shade900,
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 16,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: _cameraOn
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(24),
                                  child: Stack(
                                    fit: StackFit.expand,
                                    children: [
                                      // Simulated Video Feed Grid Background
                                      Opacity(
                                        opacity: 0.15,
                                        child: GridView.builder(
                                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 6),
                                          itemCount: 24,
                                          physics: const NeverScrollableScrollPhysics(),
                                          itemBuilder: (c, i) => Container(border: Border.all(color: Colors.white, width: 0.5)),
                                        ),
                                      ),
                                      // Pulsing active dot
                                      Positioned(
                                        top: 16,
                                        left: 16,
                                        child: Row(
                                          children: [
                                            AnimatedBuilder(
                                              animation: _pulseController,
                                              builder: (context, child) {
                                                return Opacity(
                                                  opacity: _pulseController.value,
                                                  child: Container(
                                                    height: 10,
                                                    width: 10,
                                                    decoration: const BoxDecoration(
                                                      color: Colors.red,
                                                      shape: BoxShape.circle,
                                                    ),
                                                  ),
                                                );
                                              },
                                            ),
                                            const SizedBox(width: 6),
                                            const Text(
                                              'REC',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      // Camera Overlay label
                                      const Center(
                                        child: Column(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Icon(Icons.videocam, color: Colors.white, size: 40),
                                            SizedBox(height: 8),
                                            Text(
                                              'Front Camera Feed Active',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.w500,
                                                fontSize: 13,
                                              ),
                                            ),
                                            Text(
                                              'AI is monitoring confidence & gestures',
                                              style: TextStyle(
                                                color: Colors.white70,
                                                fontSize: 10,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                )
                              : const Center(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(Icons.videocam_off, color: Colors.grey, size: 40),
                                      SizedBox(height: 8),
                                      Text(
                                        'Camera Stream Paused',
                                        style: TextStyle(
                                          color: Colors.grey,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                        ),
                        // Camera On/Off Toggle Button
                        Positioned(
                          bottom: 12,
                          right: 12,
                          child: InkWell(
                            onTap: () {
                              setState(() {
                                _cameraOn = !_cameraOn;
                              });
                            },
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                _cameraOn ? Icons.videocam : Icons.videocam_off,
                                color: Colors.white,
                                size: 18,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // AI Interviewer Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppConstants.primaryColor.withOpacity(0.06),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        children: [
                          Container(
                            height: 48,
                            width: 48,
                            decoration: const BoxDecoration(
                              color: AppConstants.primaryColor,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.support_agent, color: Colors.white, size: 28),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'AI Coach',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    color: AppConstants.primaryColor,
                                  ),
                                ),
                                Text(
                                  'Speaking via ${provider.voice}...',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppConstants.lightTextColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Simulated Speaking Soundwave Bars
                          Row(
                            children: List.generate(4, (index) {
                              return AnimatedBuilder(
                                animation: _waveController,
                                builder: (context, child) {
                                  final height = (index + 1) * 3 + (_waveController.value * 14);
                                  return Container(
                                    margin: const EdgeInsets.symmetric(horizontal: 2.0),
                                    height: height > 24 ? 24 : height,
                                    width: 3.5,
                                    decoration: BoxDecoration(
                                      color: AppConstants.primaryColor,
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                  );
                                },
                              );
                            }),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Question Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.03),
                            blurRadius: 16,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.question_answer, color: AppConstants.primaryColor, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                'Question ${provider.currentQuestionIndex}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: AppConstants.textColor,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          provider.isLoading && provider.questions.length < provider.currentQuestionIndex
                              ? const Center(
                                  child: Padding(
                                    padding: EdgeInsets.all(16.0),
                                    child: CircularProgressIndicator(color: AppConstants.primaryColor),
                                  ),
                                )
                              : Text(
                                  provider.currentQuestion,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: AppConstants.textColor,
                                    height: 1.4,
                                  ),
                                ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Answer Input Text Field
                    TextField(
                      controller: _answerController,
                      maxLines: 4,
                      onChanged: (text) => provider.updateAnswerText(text),
                      decoration: InputDecoration(
                        labelText: 'Your Answer',
                        hintText: 'Type your answer here or tap the microphone to speak...',
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        alignLabelWithHint: true,
                        fillColor: Colors.white,
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: const BorderSide(color: AppConstants.primaryColor, width: 2.0),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Actions (Microphone & Buttons)
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
              child: Column(
                children: [
                  // Microphone/Speech Recording Section
                  GestureDetector(
                    onTap: provider.toggleListening,
                    child: Column(
                      children: [
                        AnimatedBuilder(
                          animation: _pulseController,
                          builder: (context, child) {
                            final scale = provider.isListening ? 1.0 + (_pulseController.value * 0.15) : 1.0;
                            return Transform.scale(
                              scale: scale,
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: provider.isListening 
                                    ? AppConstants.errorColor 
                                    : AppConstants.primaryColor,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: (provider.isListening 
                                        ? AppConstants.errorColor 
                                        : AppConstants.primaryColor).withOpacity(0.3),
                                      blurRadius: 16,
                                      spreadRadius: 2,
                                    ),
                                  ],
                                ),
                                child: Icon(
                                  provider.isListening ? Icons.mic : Icons.mic_none,
                                  color: Colors.white,
                                  size: 32,
                                ),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 8),
                        Text(
                          provider.isListening 
                            ? 'Listening... Speak now' 
                            : 'Tap to Speak Answer',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: provider.isListening 
                              ? AppConstants.errorColor 
                              : AppConstants.primaryColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Next Question / End Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppConstants.errorColor, width: 1.5),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          ),
                          onPressed: () => _handleEndEarly(provider),
                          child: const Text(
                            'End Interview',
                            style: TextStyle(color: AppConstants.errorColor, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: PrimaryButton(
                          text: provider.currentQuestionIndex == provider.numQuestions
                              ? 'Submit & Finish'
                              : 'Next Question',
                          isLoading: provider.isLoading,
                          onPressed: () => _handleNext(provider),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
