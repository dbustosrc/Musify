import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { HomeComponent } from './components/home.component';
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist.add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist.detail.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'artists/:page', component: ArtistListComponent},
    {path: 'profile', component: UserEditComponent},
    {path: 'new-artist', component: ArtistAddComponent},
    {path: 'edit-artist/:id', component: ArtistEditComponent},
    {path: 'artist/:id', component: ArtistDetailComponent},
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
