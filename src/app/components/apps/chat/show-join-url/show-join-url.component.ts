import { Component,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA  } from '@angular/material/dialog';

@Component({
  selector: 'app-show-join-url',
  templateUrl: './show-join-url.component.html',
  styleUrls: ['./show-join-url.component.css']
})
export class ShowJoinURLComponent {
  url:string = '';
  constructor(
    private dialogRef: MatDialogRef<ShowJoinURLComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.url = 'http://localhost:4200/chat/join/'+data.id;
  }

  cancel() {
    this.dialogRef.close();
  }

}
