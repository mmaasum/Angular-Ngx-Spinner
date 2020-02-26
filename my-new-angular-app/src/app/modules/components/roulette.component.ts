import { Component,Renderer2, ViewChild, OnInit, ElementRef } from '@angular/core';
import { SpinnService } from '../../core/services/spin.service';
import { Configurations } from '../../shared/models/configurations.model';
import { Spin } from '../../shared/models/spin.module';
import { ResultStatList } from '../../shared/models/resultstatList.model';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.css']
})
export class RouletteComponent implements OnInit {
  configurations = new Configurations();
  colors: Array<any>;
  blinkButtonId: string;
  spin = new Spin();
  timeLeft: number;
  interval;
  limitNumber:number;
  activities=[];
  element: HTMLElement;
  baseURL:string;
  uuid: string;
  startTime:number=1;
  initialFlagId: number;
  idToBlink: number;
  positionToId: Array<any>;
  resultStatList:Array<ResultStatList>
  totalLimit=0;
  @ViewChild("divMessages", {read: ElementRef}) private divMessages: ElementRef;

  constructor(public spinnService: SpinnService,
    private renderer: Renderer2,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
  this.limitNumber = 200,
    this.baseURL = spinnService.baseURL
  }

  /**
   * Applications Initial load.
   */
  ngOnInit() {
    this.getNextSpin();
    this.getConfiguration();
    this.getLastNfinishedSpins(1);
  }

  errorMessage: string;
  /**
   * Searching the next spin to display to the user.
   */
  getNextSpin() {
    this.initialFlagId = 1;
    this.spinnService.getNextSpin()
      .subscribe(
        response => {
          this.spin = response;

          this.idToBlink = this.spin.id;
          this.uuid = this.spin.uuid;
          this.getSpinbyUUID(this.uuid);
          this.timeLeft = this.spin.startDelta;

          this.interval = setInterval(() => {
            if (this.initialFlagId == 1) {
              this.activities.push(
                { date: new Date(this.spin.startTime).toISOString(), title: 'sleeping for fakeStartDelta ' + this.timeLeft + ' sec' }
              );
              this.getLoadingHistory();
              this.initialFlagId = 2;
            }

            if (this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              this.spinner.show();
              setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
              }, 5000);
              this.spinnService.getListofUpcomingSpins()
                .subscribe(
                  response => {
                    this.spin = response[0];
                    this.getSpinById(this.idToBlink);
                    this.idToBlink = this.spin.id;
                    this.timeLeft = this.spin.startDelta;
                    this.activities.push(
                      { date: new Date(this.spin.startTime).toISOString(), title: 'Spinning the wheel' },
                      { date: new Date(this.spin.startTime).toISOString(), title: 'GET .../game/' + this.spin.id },
                      { date: new Date(this.spin.startTime).toISOString(), title: 'Still no result continue spinning' },
                      { date: new Date(this.spin.startTime).toISOString(), title: 'Spinning the wheel' },
                      { date: new Date(this.spin.startTime).toISOString(), title: 'Wheel is already spinning ;\\' },
                      { date: new Date(this.spin.startTime).toISOString(), title: 'GET .../game/' + this.spin.id }
                    );
                    this.getLoadingHistory();
                  }
                )
            }
          }, 1000)
        },error => {this.errorMessage = error}
      )
  }

  /**
   * After completing the game result will disclosed 
   * using blinking button. 
   * Used this function to blink the button.
   * @param id 
   */
  getSpinById(id: number) {
    this.spinnService.getSpinbyId(id)
      .subscribe(
        response => {
          this.spin = response;
          this.activities.push(
            { date: new Date(this.spin.startTime).toISOString(), title: 'Result is ' + this.spin.result },
            { date: new Date(this.spin.startTime).toISOString(), title: 'Stopping the wheel' },
            { date: new Date(this.spin.startTime).toISOString(), title: 'Checking for new game' },
            { date: new Date(this.spin.startTime).toISOString(), title: 'GET .../stats?limit=' + this.limitNumber },
            { date: new Date(this.spin.startTime).toISOString(), title: 'GET .../nextGame' }
          );
          this.getLoadingHistory();

          this.activities.push(
            { date: new Date(this.spin.startTime).toISOString(), title: 'sleeping for fakeStartDelta ' + this.timeLeft + ' sec' }
          );
          this.getLoadingHistory();

          this.blinkButtonId = 'slot-' + this.spin.result;
          let myDiv = document.getElementById(this.blinkButtonId);
          myDiv.classList.add('blink-btn');
          setTimeout(() => {
            myDiv.classList.remove('blink-btn');
          }, 5000);
          //create the DOM element 
          let li = this.renderer.createElement('li');
          var dataText = 'Game ' + id + ' ended, ' + 'result is ' + this.spin.result;
          const text = this.renderer.createText(dataText);
          this.renderer.appendChild(li, text);
          this.renderer.addClass(li, 'list-group-item');
          this.renderer.insertBefore(this.divMessages.nativeElement, li, this.divMessages.nativeElement.lastChild);
        },error => {this.errorMessage = error}
      )
  }

  /**
   * Initial log history data will added from here.
   * @param uuid 
   */
  getSpinbyUUID(uuid: string) {
    this.spinnService.getSpinbyUUID(uuid)
      .subscribe(
        response => {
          this.spin = response;
          this.activities.push(
            { date: new Date(this.spin.startTime).toISOString(), title: 'Loading game board' },
            { date: new Date(this.spin.startTime).toISOString(), title: 'GET .../configuration' },
            { date: new Date(this.spin.startTime).toISOString(), title: 'Checking for new game' },
            { date: new Date(this.spin.startTime).toISOString(), title: 'GET .../nextGame' }
          );
          this.getLoadingHistory();
          this.getLastNspinstatistics(this.limitNumber);
        },error => {this.errorMessage = error}
      )
  }

  /**
   * Game board display using the configuration.
   */
  getConfiguration() {
    this.spinnService.getWheelConfiguration()
      .subscribe(
        response => {
          this.configurations = response;
        },error => {this.errorMessage = error}
      )
  }

  /**
   * To display the statistics of the spin used this function. 
   * It is appeared top of the UI. 
   * User can put more or less the number of previous spins.
   * @param limitNumber 
   */
  getLastNspinstatistics(limitNumber) {
    this.spinnService.getLastNspinstatistics(limitNumber)
      .subscribe(
        response => {
          this.resultStatList = response;
          this.activities.push(
            { date: new Date(this.spin.startTime).toISOString(), title: 'GET .../stats?limit=200' }
          );
          this.getLoadingHistory();
          this.resultStatList.forEach(obj => {
            this.totalLimit += obj.count
          });
        },error => {this.errorMessage = error}
      )
  }

  /**
   * Previous spine histories will appear. 
   * User can provide desire limits number.
   * @param limit 
   */
  getLastNfinishedSpins(limit: number) {
    this.spinnService.getLastNfinishedSpins(limit)
      .subscribe(
        response => {
          this.spin = response;
        },error => {this.errorMessage = error}
      )
  }

  /**
   * Picked Log history from variable and resizing it. 
   * Resized data putting to the heml paragraph.
   */
  getLoadingHistory() {
    this.activities.sort((a, b) => { return <any>new Date(a.date) - <any>new Date(b.date); });
    let dataText = '';
    this.activities.forEach(function (value) {
      dataText = dataText + value.date + ' ' + value.title + '\n';
    });

    this.element = document.getElementById('historyId') as HTMLElement;
    this.element.innerText = dataText;
  }

}