import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';

import { SidebarStudentComponent } from '../../shared/components/sidebar-student/sidebar-student.component';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { CompanySidebarComponent } from '../../shared/components/company-sidebar/company-sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { JobOffer } from '../../models/job-offer';
import { TagModule } from 'primeng/tag';

registerLocaleData(localeEsCO, 'es-CO');

@Component({
    selector: 'app-job-offer-details',
    standalone: true,
    templateUrl: 'job-offer-details.component.html',
    styleUrl: 'job-offer-details.component.css',
    imports: [
    CommonModule,
        CompanySidebarComponent,
    AvatarModule,
    MenubarModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    RippleModule,
    TagModule,
    ],
    providers: [DatePipe]
})

export class JobOfferDetailsComponent implements OnInit {

    constructor(private route: ActivatedRoute, private api: ApiService, private datePipe: DatePipe ) {}

    loading = false;
    searchTerm = '';
    offer: JobOffer | null = null;
    statusClass: string = '';
    students: any[] = [];

    ngOnInit(): void {
        const offerId = Number(this.route.snapshot.paramMap.get('id'));
        console.log('ID recibido desde la ruta:', offerId);
        
        if (isNaN(offerId)) {
            console.error('ID inválido en la URL');
            return;
        }

        this.loadOfferDetails(offerId);
        this.loadPostulations(offerId);
    }

    loadOfferDetails(offerId: number): void {
        this.api.getOfferById(offerId).subscribe({
            next: (data) => {
                data.fechaPublicacion = this.datePipe.transform(data.date, 'yyyy-MM-dd');
                this.offer = data;

                const status = this.offer?.status?.toLowerCase();
                if (status === 'cerrada') {
                this.statusClass = 'text-red-600';
                } else {
                this.statusClass = 'text-green-600';
                }
            },
            error: (err) => {
                console.error('Error al cargar la oferta:', err);
            }
        });
    }

    loadPostulations(offerId: number): void {
        this.loading = true;
        this.api.getPostulationsByOfferId(offerId).subscribe({
            next: (postulations) => {
                this.students = postulations.map((postulation: any) => ({
                    id: postulation.studentId,
                    fullName: postulation.name,
                    studentCode: postulation.studentCode,
                    date: new Date(postulation.postulationDate),
                    program: postulation.academicProgram, // Ensure this maps correctly
                    status: postulation.status // Default status for now
                }));
                this.loading = false;
            },
            error: (err) => {
                console.error('Error al cargar las postulaciones:', err);
                this.loading = false;
            }
        });
    }

    getStatusClass(status: string): string {
        const statusMap: any = {
        'ABIERT': 'approved',
        'EN ESPERA': 'pending',
        'DENEGADA': 'rejected'
        };
        return statusMap[status] || '';
    }

    verDetalles(student: any): void {
        console.log('Detalles del estudiante:', student);
    }

    clear(table: any) {
        table.clear();
    }

    editarTitulo() {
        console.log('Editar postulacion:');
    }
    
}