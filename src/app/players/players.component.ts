import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
// import { PLAYERS } from '../player-stock';
import { PlayerClass } from '../player';

import { PlayerService } from '../player.service';
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: [ './players.component.sass' ]
})
export class PlayersComponent implements OnInit {
  private players;
  private image;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  constructor(
    private storage: AngularFireStorage,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.playerService.getPlayers().subscribe(r => {
      this.players = r;
    });
  }

  updatePlayer(data) {
    this.playerService.updatePlayer(data);
  }

  deletePlayer(data) {
    this.playerService.deletePlayer(data);
  }

  /* Upload image preview */
  readURL(event): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[ 0 ];
      const reader = new FileReader();
      reader.onload = e => this.image = reader.result;
      // The storage path
      const path = `test/${Date.now()}_${file.name}`;

      // Reference to storage bucket
      const ref = this.storage.ref(path);

      // The main task
      this.task = this.storage.upload(path, file);

      // Progress monitoring
      this.percentage = this.task.percentageChanges();

      this.snapshot = this.task.snapshotChanges().pipe(
        tap(console.log),
        // The file's download URL
        finalize(async () => {
          this.downloadURL = await ref.getDownloadURL().toPromise();
          const data = { downloadURL: this.downloadURL, path }
          this.playerService.uploadFile(data);
        }),
      );
      // reader.readAsDataURL(file);
    }
  }

}
