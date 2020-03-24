import eventHandler from '@/plugins/AniList/eventHandler';

export class RefreshTimer {
  private static instance: RefreshTimer;
  private _timer: number = -1;
  private _refreshRate: number = 15;
  private _timeUntilRefresh: number = 0;

  private constructor(refreshRate?: number) {
    this.setRefreshRate(refreshRate ?? 15);
  }

  public static getInstance(refreshRate?: number): RefreshTimer {
    if (!RefreshTimer.instance) {
      RefreshTimer.instance = new RefreshTimer(refreshRate);
    }

    return RefreshTimer.instance;
  }

  get timer(): number {
    return this._timer;
  }

  get timerActive(): boolean {
    return this._timer > -1;
  }

  get refreshRate(): number {
    return this._refreshRate;
  }

  get timeUntilRefresh(): number {
    return this._timeUntilRefresh;
  }

  setRefreshRate(value: number) {
    this._refreshRate = value;

    return this;
  }

  setTimeUntilRefresh(value: number) {
    this._timeUntilRefresh = value;

    return this;
  }

  startTimer() {
    this.setTimeUntilRefresh(this.refreshRate * 60);

    this._timer = setInterval(() => {
      this.setTimeUntilRefresh(this.timeUntilRefresh - 1);

      if (this.timeUntilRefresh <= 0) {
        this.resetTimer();

        eventHandler.refreshAniListData().then(() => {
          this.restartTimer();
        });
      }
    }, 1000) as any;

    return this;
  }

  restartTimer() {
    this.resetTimer();
    this.startTimer();

    return this;
  }

  resetTimer() {
    if (this.timer > -1) {
      clearInterval(this.timer);
      this._timer = -1;
      this.setTimeUntilRefresh(0);
    }

    return this;
  }
}

export const refreshTimer = RefreshTimer.getInstance();
