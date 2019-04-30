import { ModuleWithProviders, Component } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { HomeComponent } from './components/home.component';
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist.add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist.detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'artists/:page', component: ArtistListComponent},
    {path: 'new-artist', component: ArtistAddComponent},
    {path: 'edit-artist/:id', component: ArtistEditComponent},
    {path: 'artist/:id', component: ArtistDetailComponent},
    {path: 'new-album/:artist', component: AlbumAddComponent},
    {path: 'edit-album/:id', component: AlbumEditComponent},
    {path: 'album/:id', component: AlbumDetailComponent},
    {path: 'new-song/:album', component: SongAddComponent},
    {path: 'edit-song/:id', component: SongEditComponent },
    {path: 'profile', component: UserEditComponent},
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
