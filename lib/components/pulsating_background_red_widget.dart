import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'pulsating_background_red_model.dart';
export 'pulsating_background_red_model.dart';

class PulsatingBackgroundRedWidget extends StatefulWidget {
  const PulsatingBackgroundRedWidget({super.key});

  @override
  State<PulsatingBackgroundRedWidget> createState() =>
      _PulsatingBackgroundRedWidgetState();
}

class _PulsatingBackgroundRedWidgetState
    extends State<PulsatingBackgroundRedWidget> with TickerProviderStateMixin {
  late PulsatingBackgroundRedModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PulsatingBackgroundRedModel());

    animationsMap.addAll({
      'imageOnPageLoadAnimation': AnimationInfo(
        loop: true,
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          ScaleEffect(
            curve: Curves.linear,
            delay: 0.0.ms,
            duration: 1000.0.ms,
            begin: Offset(1.0, 1.0),
            end: Offset(1.5, 1.5),
          ),
          ScaleEffect(
            curve: Curves.linear,
            delay: 1000.0.ms,
            duration: 2000.0.ms,
            begin: Offset(1.5, 1.5),
            end: Offset(1.0, 1.0),
          ),
        ],
      ),
    });

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional(0.0, 0.0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8.0),
        child: Image.network(
          'https://pftyuawncgpmjstfvnjx.supabase.co/storage/v1/object/public/main/background/DEGRADE%20ROSE.png',
          width: 200.0,
          height: 200.0,
          fit: BoxFit.cover,
        ),
      ).animateOnPageLoad(animationsMap['imageOnPageLoadAnimation']!),
    );
  }
}
