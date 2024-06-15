import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { schedulerASP } from '../schedulerASP.service';
import { SpaceDialogComponent } from '../dialog/spaceDialog/spaceDialog/spaceDialog.component';

interface Space {
  name: string;
  spaceCapacity: number;
}
interface ApiSpaces {
  id: number;
  name: string;
  space_capacity: number;
  restrictionsSpace: number[];
  user_id: number;
}

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css'],
})
export class SpaceComponent {
  spaceCards: Space[] = [];
  spaces: Space[] = [];
  apiSpaces: ApiSpaces[] = [];

  userid = parseInt(localStorage.getItem('userId') ?? '', 0);

  ngOnInit() {
    this.getCommonSpacesbyID();
  }

  openSpaceDialog(space?: Space) {
    let dialogRef;

    if (space) {
      dialogRef = this.dialog.open(SpaceDialogComponent, {
        data: {
          spaceName: space.name,
          spaceCapacity: space.spaceCapacity,
          isCommon: true,
          eliminate: this.deleteSpace.bind(this),
        },
      });
    } else {
      dialogRef = this.dialog.open(SpaceDialogComponent, {
        data: {
          spaceName: null,
          spaceCapacity: null,
          isCommon: true,
          eliminate: this.deleteSpace.bind(this),
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newSpace: Space = {
          name: result.name,
          spaceCapacity: result.spaceCapacity,
        };
        const newSpaceApi: any = {
          name: result.name,
          space_capacity: result.spaceCapacity,
          user_id: this.userid,
        };

        if (space) {
          // If the worker was provided (modification case), find its index
          const existingSpaceIndex = this.spaces.findIndex(
            (s) => s.name === space.name
          );

          if (existingSpaceIndex !== -1) {
            // Update the existing worker
            this.spaces[existingSpaceIndex] = newSpace;
            this.updateCommonSpace(
              this.apiSpaces[existingSpaceIndex].id,
              newSpaceApi
            );
          }
        } else {
          // If no worker was provided (creation case), add the new worker
          this.spaces.push(newSpace);
          this.createCommonSpace(newSpaceApi);
        }

        this.loadSpaceCards();
      }
    });
  }

  deleteSpace(deleteSpace: String): void {
    // Find the index of the space to delete
    const index = this.spaces.findIndex((space) => space.name === deleteSpace);

    const apiIndex = this.apiSpaces.findIndex(
      (space) => space.name === deleteSpace
    );

    if (apiIndex !== -1) {
      // Delete the space from the spaces array
      this.spaces.splice(index, 1);

      this.schedulerASP
        .deleteCommonSpaceById(this.apiSpaces[apiIndex].id)
        .subscribe(
          (response) => {
            console.log('Response:', response);
            // Remove the space from the apiSpaces array after successful deletion
            this.apiSpaces.splice(apiIndex, 1);
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    } else {
      console.error('Error: Space not found');
    }

    // Reload the space cards
    this.loadSpaceCards();
  }

  // Function to load the space cards in card list form the spaces array
  loadSpaceCards(): void {
    // delete the existing space cards
    this.spaceCards = [];

    // iterate over the spaces array and create a card for each space
    this.spaces.forEach((space: Space) => {
      // Create a new card object with the space data
      const newCard = {
        name: space.name,
        spaceCapacity: space.spaceCapacity,
      };

      // Add the card to the spaceCards array
      this.spaceCards.push(newCard);
    });
  }

  createCommonSpace(data: any) {
    this.schedulerASP.createCommonSpace(data).subscribe(
      (response) => {
        console.log('Response:', response);
        this.apiSpaces.push(response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  updateCommonSpace(spaceID: number, data: any) {
    this.schedulerASP.updateCommonSpace(spaceID, data).subscribe(
      (response) => {
        console.log('Response:', response);
        const apiIndex = this.apiSpaces.findIndex(
          (space) => space.id === spaceID
        );
        this.apiSpaces[apiIndex] = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getCommonSpacesbyID() {
    this.schedulerASP.getCommonSpacesByUserId().subscribe(
      (response) => {
        console.log('Response all common workers:', response);
        this.apiSpaces = response;
        this.apiSpaces.forEach((apiSpace) => {
          const newSpace: Space = {
            name: apiSpace.name,
            spaceCapacity: apiSpace.space_capacity,
          };
          this.spaces.push(newSpace);
        });
        this.loadSpaceCards();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  constructor(public dialog: MatDialog, private schedulerASP: schedulerASP) {}
}
