import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="min-h-screen bg-base-200 flex items-center justify-center">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Chronicle</h2>
          <p>Campaign and world management tool for tabletop RPGs</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
