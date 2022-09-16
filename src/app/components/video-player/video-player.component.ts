import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('video') elementRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('seek') seek!: ElementRef<HTMLInputElement>;
  video!: HTMLVideoElement;
  isPlaying: boolean = false;
  videoDuration: string = '00:00';
  currentTime: string = '00:00';

  duration: number = 0;
  timeElapsed: number = 0;

  skipToTime: string = '00:00';
  volume: number = 1;
  isMuted: boolean = false;
  isFullScreen: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}
  ngAfterViewInit(): void {
    this.video = this.elementRef.nativeElement;
  }

  ngOnInit(): void {}

  togglePlay() {
    if (this.video.paused || this.video.ended) {
      this.video.play();
      this.isPlaying = true;
    } else {
      this.video.pause();
      this.isPlaying = false;
    }
  }

  /**
   * format the date to hours , minutes , seconds
   * the timeInseconds should be  < 24H
   * @param timeInSeconds
   * @returns
   */
  formatTime(timeInSeconds: number) {
    const result = new Date(timeInSeconds * 1000)
      .toISOString()
      .substring(11, 19);

    return {
      minutes: Number(result.substring(3, 5)),
      seconds: Number(result.substring(6, 8)),
      hours: Number(result.substring(0, 2)),
    };
  }

  setDurationOfVedio() {
    const videoDuration = Math.round(this.video.duration);
    this.duration = videoDuration;
    const time = this.formatTime(videoDuration);

    let seconds: string;
    let minutes: string;
    let hours: string;

    if (time.seconds > 9) {
      seconds = time.seconds + '';
    } else {
      seconds = '0' + time.seconds;
    }
    if (time.minutes > 9) {
      minutes = time.minutes + '';
    } else {
      minutes = '0' + time.minutes;
    }

    this.videoDuration = `${minutes}:${seconds}`;
    // duration.setAttribute('datetime', `${minutes}m ${seconds}s`);
  }

  updateTime() {
    const currentTime = Math.round(this.video.currentTime);
    this.timeElapsed = this.video.currentTime;

    const time = this.formatTime(currentTime);

    let seconds: string;
    let minutes: string;
    let hours: string;

    if (time.seconds > 9) {
      seconds = time.seconds + '';
    } else {
      seconds = '0' + time.seconds;
    }
    if (time.minutes > 9) {
      minutes = time.minutes + '';
    } else {
      minutes = '0' + time.minutes;
    }

    this.currentTime = `${minutes}:${seconds}`;
  }

  updateProgress() {}

  onchange() {
    const val = this.seek.nativeElement.value;
    this.timeElapsed = Number(val);
    this.video.currentTime = Number(val);
  }

  updateSeekTooltip(event: any, seekTooltip: HTMLDivElement) {
    const skipTo = Math.round(
      (event.offsetX / event.target.clientWidth) *
        parseInt(event.target.getAttribute('max'), 10)
    );

    const time = this.formatTime(skipTo);

    let seconds: string;
    let minutes: string;
    let hours: string;

    if (time.seconds > 9) {
      seconds = time.seconds + '';
    } else {
      seconds = '0' + time.seconds;
    }
    if (time.minutes > 9) {
      minutes = time.minutes + '';
    } else {
      minutes = '0' + time.minutes;
    }

    this.skipToTime = `${minutes}:${seconds}`;
    const rect = this.video.getBoundingClientRect();
    // to change later because it's not very good to change style like that way
    // but instead using style and ngClass is the best way
    seekTooltip.style.left = `${event.pageX - rect.left}px`;
  }

  formatTimeUtil(time: any): string {
    let seconds: string;
    let minutes: string;
    let hours: string;

    if (time.seconds > 9) {
      seconds = time.seconds + '';
    } else {
      seconds = '0' + time.seconds;
    }
    if (time.minutes > 9) {
      minutes = time.minutes + '';
    } else {
      minutes = '0' + time.minutes;
    }

    return `${minutes}:${seconds}`;
  }

  updateVolume(event: any) {
    if (this.video.muted) this.video.muted = false;
    this.video.volume = Number(event.target.value);
    this.volume = Number(event.target.value);
  }

  toggleMute() {
    if (!this.video.muted) {
      this.video.muted = true;
      this.volume = 0;
    } else {
      this.video.muted = false;
      this.volume = this.video.volume;
    }
  }

  animatePlayback(playbackAnimation: any) {
    this.togglePlay();
    playbackAnimation.animate(
      [
        {
          opacity: 1,
          transform: 'scale(1)',
        },
        {
          opacity: this.isPlaying ? 1 : 0,
          transform: 'scale(1.3)',
        },
      ],
      {
        duration: 500,
      }
    );
    console.log(this.isPlaying);
  }

  toggleFullScreen(videoContainer: any) {
    if (this.document.fullscreenElement) {
      document.exitFullscreen();
      this.isFullScreen = false;
    } else if (videoContainer.webkitRequestFullscreen) {
      // Need this to support Safari
      videoContainer.webkitRequestFullscreen();
      this.isFullScreen = true;
    } else {
      videoContainer.requestFullscreen();
      this.isFullScreen = true;
    }
  }
}
