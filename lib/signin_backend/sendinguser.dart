import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ott_platform_app/global.dart';
import 'package:ott_platform_app/signin_backend/error_handling.dart';
import 'package:ott_platform_app/signin_backend/snackbar.dart';
import 'package:ott_platform_app/signin_backend/userstruct.dart';

class AuthService1 {
  void signInUser({
    required BuildContext context,
    required String email,
    required String password,
  }) async {
    try {
      print(Uri.parse('$uri/user/signin'));
      http.Response res = await http.post(Uri.parse('$uri/user/signin'),
          body: jsonEncode({
            'email': email,
            'password': password,
          }),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8'
          });

      // ignore: use_build_context_synchronously
      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () {
          print("Yay! Logged IN");
        },
      );
    } catch (e) {
      // ignore: use_build_context_synchronously
      showSnackBar(context, e.toString());
    }
  }

  void signUpUser(
      {required BuildContext context,
      required String email,
      required String name,
      required String password,
      required String confirmpassword}) async {
    try {
      UserStruct user = UserStruct(
          id: '',
          name: name,
          email: email,
          password: password,
          confirmpassword: confirmpassword);
      print(Uri.parse('$uri/user/signup'));
      http.Response res = await http.post(Uri.parse('$uri/user/signup'),
          body: user.toJson(),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8'
          });

      // ignore: use_build_context_synchronously
      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () {
          showSnackBar(
            context,
            'Account created! Login with same credentials',
          );
        },
      );
    } catch (e) {
      // ignore: use_build_context_synchronously
      showSnackBar(context, e.toString());
    }
  }
}
