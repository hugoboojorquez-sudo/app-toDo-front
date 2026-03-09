import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../modelos/tarea';  
@Injectable({
  providedIn: 'root',
})
export class TareaService {


  // direccion del backend, en este caso es localhost con el puerto 8080 y la ruta /api/tareas
private apiUrl = 'http://localhost:8080/api/tareas';

constructor(private http: HttpClient) {}



  // 1. Obtener todas las tareas
  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }
  
  // 2. crear una nueva tarea 
  agregarTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  // 3. Actualizar una tarea existente (PUT)
  actualizarTarea(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  // 4. Eliminar una tarea (DELETE)
  eliminarTarea(id: number): Observable<Tarea> {
    return this.http.delete<Tarea>(`${this.apiUrl}/${id}`);
  }
  


}
