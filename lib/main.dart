import 'package:flutter/material.dart';
import 'package:ott_platform_app/admin/admin_login_view.dart';
import 'package:ott_platform_app/admin/admin_screen.dart';
import 'package:ott_platform_app/admin/main_tab/admin_main_tab_view.dart';
import 'package:ott_platform_app/common_widget/checkout1.dart';
import 'package:ott_platform_app/creator_view/login/creator_login_view.dart';
import 'package:ott_platform_app/creator_view/login/creator_register_view.dart';
import 'package:ott_platform_app/creator_view/main_tab/creator_main_tab_view.dart';
import 'package:ott_platform_app/splash_screen.dart';
import 'package:ott_platform_app/user_creator_card_screen.dart';
import 'package:ott_platform_app/user_view/login/login_view.dart';
import 'package:ott_platform_app/user_view/login/register_view.dart';
import 'package:ott_platform_app/user_view/main_tab/main_tab_view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Play',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: "Gotham",
        useMaterial3: true,
      ),
      home: const SplashScreen(),


      routes: {
        '/registerview': (context) => RegisterView(),
        '/creatorregisterview': (context) => CreatorRegisterView(),
        '/maintabview': (context) => MainTabView(),
        '/loginview': (context) => LoginView(),
        '/usercreatorcardscreen': (context) => UserCreatorCardScreen(),
        '/creatormaintabview': (context) => CreatorMainTabView(),
        '/adminscreen': (context) => AdminScreen(),
        '/creatorloginview': (context) => CreatorLoginView(),
        '/adminloginview': (context) => AdminLoginView(),
        '/adminmaintabview': (context) => AdminMainTabView(),
        '/checkout': (context) => CheckoutOnePage(),
      },
    );
  }
}


