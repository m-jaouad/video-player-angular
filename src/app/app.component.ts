import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';
  @ViewChild('videoPlayer', { static: false }) videoplayer!: ElementRef;
  isPlay: boolean = false;

  playPause() {
    let myVideo: HTMLVideoElement = this.videoplayer.nativeElement;
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }

  skip(value: number) {
    let myVideo: HTMLVideoElement = this.videoplayer.nativeElement;
    myVideo.currentTime += value;
  }

  restart() {
    let video: HTMLVideoElement = this.videoplayer.nativeElement;
    video.currentTime = 0;
  }
  fullScreen() {
    let video: HTMLVideoElement = this.videoplayer.nativeElement;
    video.requestFullscreen();
  }
}
