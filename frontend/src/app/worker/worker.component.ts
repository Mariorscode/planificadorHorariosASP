import { Component, OnInit } from '@angular/core';
import { StteperFormService } from '../schedulerASP.service';
import { WorkerDialogComponent } from '../dialog/workerDialog/workerDialog/workerDialog.component';
import { MatDialog } from '@angular/material/dialog';

interface Worker {
  name: string;
}
@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css'],
})
export class WorkerComponent {
  workerCards: Worker[] = [];
  //--
  workers: Worker[] = [];

  ngOnInit() {}

  openWorkerDialog(worker?: Worker) {
    let workerName: string;

    let dialogRef;
    if (worker) {
      workerName = worker.name;
      dialogRef = this.dialog.open(WorkerDialogComponent, {
        data: {
          workerName: worker.name,
          // turns: this.turns,
          eliminate: this.deleteWorker.bind(this),
        },
      });
    } else {
      dialogRef = this.dialog.open(WorkerDialogComponent, {
        data: {
          workerName: null,
          // turns: this.turns,
          eliminate: this.deleteWorker.bind(this),
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Create a new worker object with the dialog result
        const newWorker: Worker = {
          name: result.name,
          // restrictionsWorker: result.restrictionsWorker,
        };

        // check if the worker already exists
        const existingWorkerIndex = this.workerCards.findIndex(
          (workerCards) => workerCards.name === newWorker.name
        );

        if (existingWorkerIndex !== -1) {
          //in case the worker already exists, update the worker
          this.workers[existingWorkerIndex] = newWorker;
        } else {
          // if the worker does not exist, add it to the workers array
          this.workers.push(newWorker);
        }
        this.loadWorkerCards();
      }
    });
  }

  deleteWorker(deleteWorker: String): void {
    // Find the index of the worker to delete
    const index = this.workers.findIndex(
      (worker) => worker.name === deleteWorker
    );

    // Delete the worker from the workers array
    this.workers.splice(index, 1);

    // Reload the worker cards
    this.loadWorkerCards();
  }

  loadWorkerCards(): void {
    // delete the existing worker cards
    this.workerCards = [];

    // iterate over the workers array and create a card for each worker
    this.workers.forEach((worker: Worker) => {
      // Create a new card object with the worker data
      const newCard = {
        name: worker.name,
        // restrictionsWorker: worker.restrictionsWorker,
      };

      // Add the card to the workerCards array
      this.workerCards.push(newCard);
    });
  }
  createAllWorkersAndCommonWorkers() {
    // // const auxWorker = this.fourthFormGroup.get('workers')?.value ?? [];
    // const differentWorkers = auxWorker.filter((worker: Worker) => {
    //   return !this.apiWorkers.some(
    //     (apiWorker) => apiWorker.name === worker.name
    //   );
    // });
    // const data = auxWorker.map((worker: Worker) => {
    //   return {
    //     name: worker.name,
    //     restrictionsWorker: worker.restrictionsWorker.map((turn) => {
    //       return this.apiTurns.find(
    //         (apiTurn) =>
    //           apiTurn.day === turn.day && apiTurn.startTime === turn.startTime
    //       )?.id;
    //     }),
    //     timeTable_id: this.apiTimeTable.id,
    //   };
    // });
    // const data2 = differentWorkers.map((worker: Worker) => {
    //   return {
    //     name: worker.name,
    //     user_id: this.userid,
    //   };
    // });
    // this.stteperFormService.createAllCommonWorkers(data2).subscribe(
    //   (response) => {
    //     console.log('Response:', response);
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );
    // this.stteperFormService.createAllWorker(data).subscribe(
    //   (response) => {
    //     console.log('Response:', response);
    //     this.apiWorkers = response;
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );
  }

  constructor(public dialog: MatDialog) {}
}
