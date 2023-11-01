import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:dio/dio.dart';
import 'package:ott_platform_app/global.dart';
import 'package:ott_platform_app/main.dart';
import 'package:ott_platform_app/signin_backend/snackbar.dart';
import 'package:ott_platform_app/upload_videos/error_handlingcontent.dart';
import 'package:ott_platform_app/upload_videos/sending_video.dart';
import 'package:path/path.dart' as path;

class videoUpload {
  sendingVideo sendvideo = sendingVideo();
  var videoPath;

  selectVideo(context) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      PlatformFile file = result.files.first;
      videoPath = file.path;
      var filename = file.name;
      var request =
          http.MultipartRequest('POST', Uri.parse('$uri/creator/content'));

      request.fields['videoPath'] = videoPath;
      request.fields['filename'] = filename;

      // Add the file
      request.files.add(file as http.MultipartFile);

      var response = await request.send();

      if (response.statusCode == 200) {
        print('Uploaded!');
      } else {
        print('Upload failed');
      }
    } else {
      // User canceled the picker
    }
  }
}
