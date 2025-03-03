import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/components/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideAnimations()]
}).catch(err => console.error(err));
