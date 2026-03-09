import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-controls',
  imports: [SidebarComponent, PageTitleComponent],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {}
