import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent {
  @Input() totalEpisodes = 0;

  @Input() totalArtists = 0;

  @Input() totalHours = 0;
}
