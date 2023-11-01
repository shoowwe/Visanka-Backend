import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:ott_platform_app/global.dart';

Future<List<Map<String, dynamic>>> fetchVideos() async {
  List<dynamic> data = [];
  final response = await http.get(Uri.parse('$uri/getcontent'));
  try {
    if (response.statusCode == 200) {
      data = json.decode(response.body);
    }
  } catch (e) {
    throw Exception('failed to fetch videos');
  }
  return data.cast<Map<String, dynamic>>();
}
