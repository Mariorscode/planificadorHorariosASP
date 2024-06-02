import { Component, OnInit } from '@angular/core';
import { WorkerDialogComponent } from '../dialog/workerDialog/workerDialog/workerDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { schedulerASP } from '../schedulerASP.service';

interface Worker {
  name: string;
}

interface ApiWorkers {
  id: number;
  name: string;
  restrictionsWorker: number[];
}
@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css'],
})
export class WorkerComponent {
  workerCards: Worker[] = [];
  workers: Worker[] = [];
  apiWorkers: ApiWorkers[] = [];
  hasChanges = false;

  userid = 1;

  ngOnInit() {
    // this.loadWorkerCards();
    this.getCommonWorkersbyID(this.userid);
  }

  openWorkerDialog(worker?: Worker) {
    let dialogRef;

    if (worker) {
      dialogRef = this.dialog.open(WorkerDialogComponent, {
        data: {
          workerName: worker.name,
          eliminate: this.deleteWorker.bind(this),
        },
      });
    } else {
      dialogRef = this.dialog.open(WorkerDialogComponent, {
        data: {
          workerName: null,
          eliminate: this.deleteWorker.bind(this),
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newWorker: Worker = { name: result.name };
        const newWorkerApi: any = {
          name: result.name,
          user_id: this.userid,
        };

        if (worker) {
          // If the worker was provided (modification case), find its index
          const existingWorkerIndex = this.workers.findIndex(
            (w) => w.name === worker.name
          );

          if (existingWorkerIndex !== -1) {
            // Update the existing worker
            this.workers[existingWorkerIndex] = newWorker;
            this.updateCommonWorker(
              this.apiWorkers[existingWorkerIndex].id,
              newWorkerApi
            );
          }
        } else {
          // If no worker was provided (creation case), add the new worker
          this.workers.push(newWorker);
          this.createCommonWorker(newWorkerApi);
        }

        this.loadWorkerCards();
        this.hasChanges = true;
      }
    });
  }

  deleteWorker(deleteWorker: String): void {
    // Find the index of the worker to delete
    const index = this.workers.findIndex(
      (worker) => worker.name === deleteWorker
    );

    const apiIndex = this.apiWorkers.findIndex(
      (worker) => worker.name === deleteWorker
    );

    // Delete the worker from the workers array
    this.workers.splice(index, 1);

    this.hasChanges = true;

    this.schedulerASP
      .deleteCommonWorkerById(this.apiWorkers[apiIndex].id)
      .subscribe((response) => {
        console.log('Response:', response);
      });

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

  createCommonWorker(data: any) {
    this.schedulerASP.createCommonWorker(data).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  updateCommonWorker(workerId: number, data: any) {
    this.schedulerASP.updateCommonWorker(workerId, data).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getCommonWorkersbyID(user_id: number) {
    this.schedulerASP.getCommonWorkersByUserId(user_id).subscribe(
      (response) => {
        console.log('Response all common workers:', response);
        this.apiWorkers = response;
        this.apiWorkers.forEach((apiWorker) => {
          // let auxIds: number[] = [];

          // auxIds = apiWorker.restrictionsWorker;

          const newWorker: Worker = {
            name: apiWorker.name,
          };
          this.workers.push(newWorker);
        });
        this.loadWorkerCards();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  constructor(public dialog: MatDialog, private schedulerASP: schedulerASP) {}
}
