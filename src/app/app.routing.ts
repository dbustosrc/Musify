import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'artist/:page', component: ArtistListComponent},
    {path: 'profile', component: UserEditComponent},
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);