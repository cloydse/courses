
import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {LessonsService} from "./lessons.service";


@Component({
    selector:'lessons-list',
    template: `
            <table class="lessons-list card card-strong">
                <tr *ngFor="let lesson of lessons">
                    <td>
                        <img class="lesson-logo" 
                        src="https://material.angularjs.org/latest/img/icons/angular-logo.svg">  
                    </td>
                    <td>
                        {{lesson.description}}    
                    </td>
                    <td>
                        <button (click)="lessonsService.delete(lesson.id)">Delete</button>
                    </td>
                    <td>
                        <button> fake</button>
                    </td>
                </tr>
           </table>

        `//,
    //    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonsList {


    @Input()
    lessons = [];
    
    
    constructor(private lessonsService: LessonsService) {
        
    }
    
    
    

}