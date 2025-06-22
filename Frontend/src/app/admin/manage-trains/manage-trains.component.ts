import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Train {
  train: string;
  origin: string;
  destination: string;
  classes: { [key: string]: number };
}

@Component({
  selector: 'app-manage-trains',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-trains.component.html',
  styleUrl: './manage-trains.component.scss'
})
export class ManageTrainsComponent implements OnInit {
  trains: Train[] = [];
  trainForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.trainForm = this.fb.group({
      trainName: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTrains();
  }

  loadTrains(): void {
    const storedTrains = localStorage.getItem('trains');
    this.trains = storedTrains ? JSON.parse(storedTrains) : [];
  }

  addTrain(): void {
    if (this.trainForm.valid) {
      const newTrain: Train = {
        train: this.trainForm.value.trainName,
        origin: this.trainForm.value.origin,
        destination: this.trainForm.value.destination,
        classes: { Sleeper: 100, AC: 50, First: 20 } // Default classes
      };
      this.trains.push(newTrain);
      localStorage.setItem('trains', JSON.stringify(this.trains));
      this.trainForm.reset();
    }
  }

  deleteTrain(trainToDelete: Train): void {
    if (confirm(`Are you sure you want to delete the train "${trainToDelete.train}"?`)) {
      this.trains = this.trains.filter(train => 
        train.train !== trainToDelete.train || 
        train.origin !== trainToDelete.origin || 
        train.destination !== trainToDelete.destination
      );
      localStorage.setItem('trains', JSON.stringify(this.trains));
    }
  }
}
