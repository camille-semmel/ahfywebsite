import '/components/nav_bar_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'about_us_model.dart';
export 'about_us_model.dart';

class AboutUsWidget extends StatefulWidget {
  const AboutUsWidget({super.key});

  static String routeName = 'AboutUs';
  static String routePath = '/aboutUs';

  @override
  State<AboutUsWidget> createState() => _AboutUsWidgetState();
}

class _AboutUsWidgetState extends State<AboutUsWidget>
    with TickerProviderStateMixin {
  late AboutUsModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AboutUsModel());

    animationsMap.addAll({
      'imageOnPageLoadAnimation1': AnimationInfo(
        loop: true,
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          ScaleEffect(
            curve: Curves.linear,
            delay: 500.0.ms,
            duration: 2000.0.ms,
            begin: Offset(0.5, 0.5),
            end: Offset(1.5, 1.5),
          ),
          ScaleEffect(
            curve: Curves.linear,
            delay: 2500.0.ms,
            duration: 4000.0.ms,
            begin: Offset(1.5, 1.5),
            end: Offset(0.5, 0.5),
          ),
        ],
      ),
      'imageOnPageLoadAnimation2': AnimationInfo(
        loop: true,
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          ScaleEffect(
            curve: Curves.linear,
            delay: 500.0.ms,
            duration: 2000.0.ms,
            begin: Offset(0.5, 0.5),
            end: Offset(1.5, 1.5),
          ),
          ScaleEffect(
            curve: Curves.linear,
            delay: 2500.0.ms,
            duration: 4000.0.ms,
            begin: Offset(1.5, 1.5),
            end: Offset(0.5, 0.5),
          ),
        ],
      ),
      'imageOnPageLoadAnimation3': AnimationInfo(
        loop: true,
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          ScaleEffect(
            curve: Curves.linear,
            delay: 500.0.ms,
            duration: 2000.0.ms,
            begin: Offset(0.5, 0.5),
            end: Offset(1.5, 1.5),
          ),
          ScaleEffect(
            curve: Curves.linear,
            delay: 2500.0.ms,
            duration: 4000.0.ms,
            begin: Offset(1.5, 1.5),
            end: Offset(0.5, 0.5),
          ),
        ],
      ),
      'imageOnPageLoadAnimation4': AnimationInfo(
        loop: true,
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          ScaleEffect(
            curve: Curves.linear,
            delay: 500.0.ms,
            duration: 2000.0.ms,
            begin: Offset(0.5, 0.5),
            end: Offset(1.5, 1.5),
          ),
          ScaleEffect(
            curve: Curves.linear,
            delay: 2500.0.ms,
            duration: 4000.0.ms,
            begin: Offset(1.5, 1.5),
            end: Offset(0.5, 0.5),
          ),
        ],
      ),
    });

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
        FocusManager.instance.primaryFocus?.unfocus();
      },
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        floatingActionButton: Align(
          alignment: AlignmentDirectional(0.0, -1.0),
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(0.0, 50.0, 0.0, 0.0),
            child: FloatingActionButton.extended(
              onPressed: () {
                print('FloatingActionButton pressed ...');
              },
              backgroundColor: Color(0x00FF9052),
              elevation: 0.0,
              label: wrapWithModel(
                model: _model.navBarModel,
                updateCallback: () => safeSetState(() {}),
                child: NavBarWidget(),
              ),
            ),
          ),
        ),
        body: SafeArea(
          top: true,
          child: Stack(
            children: [
              Align(
                alignment: AlignmentDirectional(1.19, 0.23),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8.0),
                  child: Image.network(
                    'https://pftyuawncgpmjstfvnjx.supabase.co/storage/v1/object/public/main/background/DEGRADE%20ROSE.png',
                    width: 400.0,
                    height: 400.0,
                    fit: BoxFit.cover,
                  ),
                ).animateOnPageLoad(
                    animationsMap['imageOnPageLoadAnimation1']!),
              ),
              Align(
                alignment: AlignmentDirectional(-1.14, 0.28),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8.0),
                  child: Image.network(
                    'https://pftyuawncgpmjstfvnjx.supabase.co/storage/v1/object/public/main/background/DEGRADE%20ROSE.png',
                    width: 400.0,
                    height: 400.0,
                    fit: BoxFit.cover,
                  ),
                ).animateOnPageLoad(
                    animationsMap['imageOnPageLoadAnimation2']!),
              ),
              Align(
                alignment: AlignmentDirectional(0.76, -0.98),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8.0),
                  child: Image.network(
                    'https://pftyuawncgpmjstfvnjx.supabase.co/storage/v1/object/public/main/background/DEGRADE%20ROSE.png',
                    width: 168.0,
                    height: 162.13,
                    fit: BoxFit.cover,
                  ),
                ).animateOnPageLoad(
                    animationsMap['imageOnPageLoadAnimation3']!),
              ),
              Align(
                alignment: AlignmentDirectional(-0.58, 1.32),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8.0),
                  child: Image.network(
                    'https://pftyuawncgpmjstfvnjx.supabase.co/storage/v1/object/public/main/background/DEGRADE%20ROSE.png',
                    width: 301.1,
                    height: 292.1,
                    fit: BoxFit.cover,
                  ),
                ).animateOnPageLoad(
                    animationsMap['imageOnPageLoadAnimation4']!),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 110.0, 0.0, 0.0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Align(
                        alignment: AlignmentDirectional(0.0, 0.0),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 120.0, 0.0, 0.0),
                          child: Stack(
                            alignment: AlignmentDirectional(0.0, 0.0),
                            children: [
                              Align(
                                alignment: AlignmentDirectional(0.0, 0.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Flexible(
                                      flex: 2,
                                      child: Column(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          ClipRRect(
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                            child: Image.asset(
                                              'assets/images/ahfycloud_cleaned.png',
                                              width: 300.0,
                                              height: 300.0,
                                              fit: BoxFit.cover,
                                              cacheWidth: 300,
                                              cacheHeight: 300,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Flexible(
                                      flex: 2,
                                      child: Column(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'Dedicated to your mental health \nand fullfilment',
                                            style: FlutterFlowTheme.of(context)
                                                .displaySmall
                                                .override(
                                                  fontFamily:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .displaySmallFamily,
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .orange2,
                                                  letterSpacing: 0.0,
                                                  useGoogleFonts:
                                                      !FlutterFlowTheme.of(
                                                              context)
                                                          .displaySmallIsCustom,
                                                ),
                                          ),
                                          Text(
                                            'At Ahfy our efforts are dedicated to find currated resources so that you can become the best version of yourself while staying in your budget. ',
                                            style: FlutterFlowTheme.of(context)
                                                .bodyLarge
                                                .override(
                                                  fontFamily:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .bodyLargeFamily,
                                                  fontSize: 18.0,
                                                  letterSpacing: 0.0,
                                                  useGoogleFonts:
                                                      !FlutterFlowTheme.of(
                                                              context)
                                                          .bodyLargeIsCustom,
                                                ),
                                          ),
                                        ].divide(SizedBox(height: 15.0)),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Opacity(
                                opacity: 0.8,
                                child: Container(
                                  width:
                                      MediaQuery.sizeOf(context).width * 0.75,
                                  height: 515.31,
                                  decoration: BoxDecoration(
                                    color: Color(0x20D9D9D9),
                                    borderRadius: BorderRadius.circular(45.0),
                                    border: Border.all(
                                      color: FlutterFlowTheme.of(context).info,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      Container(
                        constraints: BoxConstraints(
                          minHeight: 900.0,
                        ),
                        decoration: BoxDecoration(),
                        alignment: AlignmentDirectional(0.0, 0.0),
                        child: Stack(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          children: [
                            Padding(
                              padding: EdgeInsets.all(20.0),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 0.0, 8.0),
                                    child: Text(
                                      'HOW DOES IT WORK ?',
                                      style: FlutterFlowTheme.of(context)
                                          .displaySmall
                                          .override(
                                            fontFamily:
                                                FlutterFlowTheme.of(context)
                                                    .displaySmallFamily,
                                            color: FlutterFlowTheme.of(context)
                                                .orange2,
                                            letterSpacing: 0.0,
                                            useGoogleFonts:
                                                !FlutterFlowTheme.of(context)
                                                    .displaySmallIsCustom,
                                          ),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 0.0, 24.0),
                                    child: Text(
                                      'The goal of Ahfy is that you finally get advice on how to deal with day to day emotions and get certified advice.',
                                      style: FlutterFlowTheme.of(context)
                                          .labelLarge
                                          .override(
                                            fontFamily:
                                                FlutterFlowTheme.of(context)
                                                    .labelLargeFamily,
                                            color: FlutterFlowTheme.of(context)
                                                .primaryText,
                                            fontSize: 18.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.normal,
                                            useGoogleFonts:
                                                !FlutterFlowTheme.of(context)
                                                    .labelLargeIsCustom,
                                          ),
                                    ),
                                  ),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8.0),
                                    child: Image.network(
                                      'https://pftyuawncgpmjstfvnjx.supabase.co/storage/v1/object/public/main/website_illustration/usage%202.png',
                                      width: 951.5,
                                      height: 591.6,
                                      fit: BoxFit.cover,
                                      alignment: Alignment(0.0, 0.0),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Opacity(
                              opacity: 0.8,
                              child: Container(
                                width: MediaQuery.sizeOf(context).width * 0.75,
                                height: 730.0,
                                decoration: BoxDecoration(
                                  color: Color(0x20D9D9D9),
                                  borderRadius: BorderRadius.circular(45.0),
                                  border: Border.all(
                                    color: FlutterFlowTheme.of(context).info,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        constraints: BoxConstraints(
                          minHeight: 900.0,
                        ),
                        decoration: BoxDecoration(),
                        alignment: AlignmentDirectional(0.0, 0.0),
                        child: Stack(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          children: [
                            Padding(
                              padding: EdgeInsets.all(20.0),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 0.0, 8.0),
                                    child: Text(
                                      'HOW DOES IT WORK ?',
                                      style: FlutterFlowTheme.of(context)
                                          .displaySmall
                                          .override(
                                            fontFamily:
                                                FlutterFlowTheme.of(context)
                                                    .displaySmallFamily,
                                            color: FlutterFlowTheme.of(context)
                                                .orange2,
                                            letterSpacing: 0.0,
                                            useGoogleFonts:
                                                !FlutterFlowTheme.of(context)
                                                    .displaySmallIsCustom,
                                          ),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 0.0, 24.0),
                                    child: Text(
                                      'The goal of Ahfy is that you finally get advice on how to deal with day to day emotions and get certified advice.',
                                      style: FlutterFlowTheme.of(context)
                                          .labelLarge
                                          .override(
                                            fontFamily:
                                                FlutterFlowTheme.of(context)
                                                    .labelLargeFamily,
                                            color: FlutterFlowTheme.of(context)
                                                .primaryText,
                                            fontSize: 18.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.normal,
                                            useGoogleFonts:
                                                !FlutterFlowTheme.of(context)
                                                    .labelLargeIsCustom,
                                          ),
                                    ),
                                  ),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8.0),
                                    child: Image.network(
                                      'https://pftyuawncgpmjstfvnjx.supabase.co/storage/v1/object/public/main/website_illustration/usage%202.png',
                                      width: 951.5,
                                      height: 591.6,
                                      fit: BoxFit.cover,
                                      alignment: Alignment(0.0, 0.0),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Opacity(
                              opacity: 0.8,
                              child: Container(
                                width: MediaQuery.sizeOf(context).width * 0.75,
                                height: 730.0,
                                decoration: BoxDecoration(
                                  color: Color(0x20D9D9D9),
                                  borderRadius: BorderRadius.circular(45.0),
                                  border: Border.all(
                                    color: FlutterFlowTheme.of(context).info,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ].divide(SizedBox(height: 70.0)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
