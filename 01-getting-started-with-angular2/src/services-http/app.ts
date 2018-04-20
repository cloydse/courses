
import {Component, OnInit, AfterViewInit} from "@angular/core";
import {NgModule} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule} from "@angular/platform-browser";

import {LessonsList} from "./lessons-list.component";
import {HttpModule} from "@angular/http";
import "rxjs/Rx";
import {LessonsService} from "./lessons.service";
import {initObservable} from "./init-observable";
import {Observable} from "rxjs/Observable";
import {Lesson} from "./lesson";

@Component({
    selector:'app',
    template: `
        <div>

            <input class="add-lesson" id='search' placeholder="Add Lesson" 
                (keyup.enter)="createLesson(input.value)" #input>
                <span>
                <button (click)="chain()">Chain</button>
                <button (click)="parallelrequests()">Run In Parallel</button>
                <button (click)="reload()">reload</button>
                </span>
            <lessons-list [lessons]="lessons| async"></lessons-list>
            <div> Total Lessions: {{ (lessons | async)?.length }} </div>
        </div>
        `
})
export class App implements OnInit, AfterViewInit {

    //After init of view

    lessons: Lesson[];
    lessons$: Observable<Lesson[]>;
    both$: Observable<Lesson[]>;
    constructor(private lessonsService: LessonsService) {

      //  initObservable();

     //   this.lessons$ = lessonsService.loadLessons();
     this.reload3();
    }

    ngAfterViewInit(): void {

    const input:any = document.getElementById('search');
    console.log(input);

    const search$ = Observable.fromEvent(input, 'keyup')
    .do(() => console.log(input.value))
    .switchMap(() => this.lessonsService.loadLessons(input.value));


    search$.subscribe(
        lessons => this.lessons = lessons);
    }
    ngOnInit(): void {
       this.parallelrequests();



    }


    createLesson(description) {
        this.lessonsService.createLesson(description);
    }
    parallelrequests() {
        const lessons$ = this.lessonsService.loadLessons();
        const morelessons$ = this.lessonsService.loadLessons();

        const both$ = Observable.combineLatest(
            lessons$,
            morelessons$
        );

        both$.subscribe(
            r => { console.log (r)},
            () => { console.log('Error')},
            () => { console.log('complete')}
        )
    }
    chain() {

        const lesson = "Lesson 1";

        const lesson2 = "Lesson2";


        //switchMap takes result form firstcall and does a second call
        const chain$ = this.lessonsService.createLesson(lesson)
            .switchMap(results => {
                console.log('result', results);
                return this.lessonsService.createLesson(lesson2)
            })
            .switchMap((results2) => {
                console.log(results2);
                return this.lessonsService.loadLessons();
            })
            .cache();//insure one call only


        this.lessons$ = chain$;

        chain$.subscribe();


    }
    reload() {
        this.lessons$ = this.lessonsService.loadFlakyLessons().retryWhen(errors => errors.delay(5000)).cache();
    }

    reload3(){
        this.lessons$= this.lessonsService.loadLessons();
    this.lessons$.subscribe(
        lessons => this.lessons = lessons
    );
    }

}



@NgModule({
    declarations: [App, LessonsList],
    imports: [BrowserModule, HttpModule],
    bootstrap: [App],
    providers: [LessonsService]
})
export class AppModule {

}

platformBrowserDynamic().bootstrapModule(AppModule);

