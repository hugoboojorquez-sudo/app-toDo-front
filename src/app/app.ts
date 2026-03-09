import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TareaService } from './services/tareaService';
import { OnInit } from '@angular/core';
import { Tarea } from './modelos/tarea';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { EstadoTarea } from './modelos/tarea';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  
  listaTareas: Tarea[] = []; // Aquí guardaremos lo que venga de Java

  // agregamos una nueva variable para manejar el estadol del formulario

  mostrarFormulario: boolean = false; // Por defecto está oculto

  constructor(private tareaService: TareaService) {}

  ngOnInit(): void {
    // Aquí es donde pediremos las tareas nada más cargar la página
    this.obtenerTareas();
  }

// Función para cambiar el estado
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }


  obtenerTareas() {

    this.tareaService.getTareas().subscribe( {
      next: (datos) => {
        this.listaTareas = datos; // Guardamos lo que venga del backend en la variable listaTareas
        console.log("tareas cargadas: ", this.listaTareas);
        },
        error: (error) => {
          console.error("Error al cargar las tareas: ", error);
        }

    } );


  }

nuevaTarea: Tarea = {
  nombre: '',
  descripcion: '',
 estado: EstadoTarea.PENDIENTE,
 fechaInicio: new Date().toISOString().split('T')[0], 
  fechaFin: new Date().toISOString().split('T')[0]

};


agregarTarea() {

// 1. Validación básica: trim() quita los espacios en blanco
  if (!this.nuevaTarea.nombre || this.nuevaTarea.nombre.trim() === '') {
    alert('Por favor, escribe un nombre para la tarea.');
    return;
  }

  const hoy = new Date().toISOString().split('T')[0]; 

  // Forzamos que el objeto tenga TODO lo que Java pide
  const tareaFinal = {
    ...this.nuevaTarea,
    nombre: this.nuevaTarea.nombre || 'Tarea sin nombre', // Evita el nullable=false
    fechaInicio: hoy,
    fechaFin: hoy,
    estado: this.nuevaTarea.estado // Asegúrate que sea PENDIENTE (mayúsculas)
  };

  console.log("Lo que sale hacia Java:", JSON.stringify(tareaFinal));


  this.tareaService.agregarTarea(tareaFinal).subscribe({
    next: (res) => {
      console.log('¡LOGRADO!', res);
      this.listaTareas.push(res);
      this.nuevaTarea = { nombre: '', descripcion: '', estado: EstadoTarea.PENDIENTE };
      this.mostrarFormulario = false; // Opcional: cierra el formulario al guardar
    },
    error: (err) => {
      console.error('El servidor dice:', err.error?.message || 'Error 400');
      
    }
  });
}


 
eliminarTarea(id: number | undefined) {
  if (id === undefined) {
    console.error("No se puede eliminar una tarea sin ID");
    return;
  }

  // Opcional: Un mensaje de confirmación estilo Sinaloa para no borrar por error
  const confirmar = confirm('¿Seguro que quieres borrar esta tarea?');
  
  if (confirmar) {
    this.tareaService.eliminarTarea(id).subscribe({
      next: () => {
        console.log('Tarea eliminada de la base de datos');
        this.obtenerTareas(); //  Esto refresca tu lista @for automáticamente
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}



}