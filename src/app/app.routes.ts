import { Routes } from "@angular/router";
import { WeatherComponent } from "./components/weather.component";

export const routes: Routes = [
  { path: "", component: WeatherComponent },
  { path: "**", redirectTo: "" },
];
