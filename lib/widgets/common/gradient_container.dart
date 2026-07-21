import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';

class GradientContainer extends StatelessWidget {
  final Widget child;
  final List<Color>? colors;

  const GradientContainer({
    Key? key,
    required this.child,
    this.colors,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: colors ?? [
            AppConstants.primaryColor.withOpacity(0.04),
            AppConstants.backgroundColor,
          ],
        ),
      ),
      child: child,
    );
  }
}
