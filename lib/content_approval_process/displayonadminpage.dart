import 'package:ott_platform_app/content_approval_process/getcontent.dart';
import 'package:flutter/material.dart';

import 'package:ott_platform_app/content_approval_process/getcontent.dart';

class VideoListScreen extends StatelessWidget {
  const VideoListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Map<String, dynamic>>>(
      future: fetchVideos(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator(); // Show loading indicator
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else {
          List<Map<String, dynamic>> videos = snapshot.data!;
          return ListView.builder(
            itemCount: videos.length,
            itemBuilder: (context, index) {
              return ListTile(
                title: Text(videos[index]
                    ['title']), // Assuming 'title' is the video title column
                onTap: () {
                  // Implement logic to play video
                },
              );
            },
          );
        }
      },
    );
  }
}
