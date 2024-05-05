import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Task } from '../model/Task';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import {Board} from "../model/Board";
import {Subtask} from "../model/Subtask";
import { saveAs } from 'file-saver';
import {User} from "../model/User";
import {StorageService} from "./storage.service";





@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = 'http://localhost:8080/api/v1/TaskManagement'; // URL de votre API
  private token =this.storage.getAccessToken();


  constructor(private http: HttpClient ,private storage : StorageService ) { }


  addTask(task: Task, firstName: string, lastName: string): Observable<Task> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json' // Make sure to set Content-Type header
      })
    };


    // Include firstName and lastName in the URL
    return this.http.post<Task>(`${this.apiUrl}/add/${firstName}/${lastName}`, task, httpOptions);
  }
// Méthode pour récupérer les données d'évaluation des tâches depuis le backend
  getTaskEvaluationData(): Observable<number[]> {
    // Ajoutez le token d'authentification si nécessaire
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    // Effectue une requête GET à l'API REST
    return this.http.get<number[]>(`${this.apiUrl}/statistiques/Rating`, httpOptions);
  }

  getDeadlineRespectData(): Observable<Map<string, number>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Map<string, number>>(`${this.apiUrl}/statistiques/deadlineRespectRatio`, httpOptions);
  }

  getEstimatedWorkDataByWeek(): Observable<Map<string, number>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Map<string, number>>(`${this.apiUrl}/statistiques/estimatedByWeek`, httpOptions);
  }

  getActualWorkDataByWeek(): Observable<Map<string, number>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Map<string, number>>(`${this.apiUrl}/statistiques/actualByWeek`, httpOptions);
  }
  getTasksStatusData(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<any>(`${this.apiUrl}/statistiques/status`, httpOptions);
  }




  downloadPDF(): void {
    const httpOptions = {
      responseType: 'blob' as 'json', // Indiquez que la réponse est de type blob (pour le téléchargement de fichier)
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.http.get(`${this.apiUrl}/generate-pdf`, httpOptions)
      .subscribe((response: Blob) => {
        saveAs(response, 'tasks.pdf');
      });
  }

  generatePDFObservable(): Observable<Blob> {
    const httpOptions = {
      responseType: 'blob' as 'json', // Indiquez que la réponse est de type blob (pour le téléchargement de fichier)
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Blob>(`${this.apiUrl}/generate-pdf`, httpOptions);
  }



  // updateTask(id: string,task: Task, firstName: string, lastName: string): Observable<Task> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.token}`,
  //       'Content-Type': 'application/json' // Make sure to set Content-Type header
  //     })
  //   };
  //
  //   // Include firstName and lastName in the URL
  //   return this.http.put<Task>(`${this.apiUrl}/updateTask/${id}/${firstName}/${lastName}`, task, httpOptions);
  // }

//   updateTask(taskId: string, taskDetails: Task, firstName?: string, lastName?: string): Observable<Task> {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Authorization': `Bearer ${this.token}`,
//         'Content-Type': 'application/json' // Assurez-vous de définir l'en-tête Content-Type
//       })
//     };
//
//     // Inclure firstName et lastName dans l'URL s'ils sont fournis
//     const url = firstName && lastName ?
//       `${this.apiUrl}/updateTask/${taskId}/${firstName}/${lastName}` :
//       `${this.apiUrl}/updateTask/${taskId}`;
//
//
// console.log('hhhh'+taskDetails.assignedUser.firstname);
//     return this.http.put<Task>(url, taskDetails, httpOptions);
//   }




  updateTask(id: string, firstName: string, lastName: string,title:string,description:string,status:string,priority:number,dueDate:string,tags:string[]): Observable<any> {
    const url = `${this.apiUrl}/${id}/updateTask/${firstName}/${lastName}/${title}/${description}/${status}/${priority}/${dueDate}/${tags}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.put(url, null, httpOptions); // Inclure la tâche dans la requête
  }

  updateSubTask(idSubTask: string, description: string, idTask: string): Observable<any> {
    const url = `${this.apiUrl}/updateSubTask/${idSubTask}/${description}/${idTask}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.put(url, null, httpOptions);
  }




  updateStatusSubTask(id:string , status: string): Observable<any> {

    const url = `${this.apiUrl}/${id}/updateStausOfSubTask/${status}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.patch(url, null, httpOptions);

  }

  // sendNotificationByEmail(email: string): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.token}`,
  //       'Content-Type': 'text/plain' // Utilisez text/plain pour le contenu
  //     })
  //   };
  //
  //   // Utilisez la même URL de base pour les deux méthodes, mais avec le chemin spécifique pour l'envoi de la notification
  //   return this.http.post(`${this.apiUrl}/send-notification`, email, httpOptions);
  // }

  sendNotification(email: string, task: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const body = {
      email: email,
      task: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        creationDate: task.creationDate,
        estimatedDuration: task.estimatedDuration,
        assignedUser: {
          firstName: task.assignedUser.firstName,
          lastName: task.assignedUser.lastName
        }
      }
    };


    return this.http.post<any>(`${this.apiUrl}/send2-notification`, body, httpOptions).pipe(
      catchError((error) => {
        console.error('Error sending notification email:', error);
        return throwError(error);
      })
    );
  }






  getTaskById(id: string): Observable<Task> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Task>(`${this.apiUrl}/GetTaskById/${id}`, httpOptions);
  }

  getSubTaskById(id: string): Observable<Subtask> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Subtask>(`${this.apiUrl}/retrieveByIdSubTask/${id}`, httpOptions);
  }

  retrieveAllSubTasksByBoard(idBoard: string): Observable<Subtask[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Subtask[]>(`${this.apiUrl}/retrieveAllSubTasksByBoard/${idBoard}`, httpOptions);
  }

  addSubTask(subtask: Subtask, idTask: string, idBoard: string): Observable<Subtask> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json' // Make sure to set Content-Type header
      })
    };


    // Include firstName and lastName in the URL
    return this.http.post<Subtask>(`${this.apiUrl}/addSubTask/${idTask}/${idBoard}`, subtask, httpOptions);

  }


  getAllTasks(): Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Task[]>(`${this.apiUrl}/GetAllTasks`, httpOptions);
  }


  getUniqueTags(): Observable<string[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<string[]>(`${this.apiUrl}/uniqueTags`, httpOptions);
  }

  deleteTask(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    // Utilisez uniquement l'ID dans l'URL
    return this.http.delete(`${this.apiUrl}/RemoveTask/${id}`, httpOptions)
      .pipe(
        catchError(error => {
          // Afficher un message d'erreur
          console.error('Error in deleting task:', error);
          return throwError('Erreur lors de la suppression de la tâche.');
        })
      );
  }

  deleteSubTask(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    // Utilisez uniquement l'ID dans l'URL
    return this.http.delete(`${this.apiUrl}/deleteSubTask/${id}`, httpOptions)
      .pipe(
        catchError(error => {
          // Afficher un message d'erreur
          console.error('Error in deleting task:', error);
          return throwError('Erreur lors de la suppression de la sous tache.');
        })
      );
  }



  // Dans TasksService
  getTasksByTags(tags: string[]): Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      }),
      params: {
        tags: tags // Assurez-vous que ceci correspond aux attentes de votre API
      }
    };

    return this.http.get<Task[]>(`${this.apiUrl}/filterByTags`, httpOptions);
  }

  getUsersWithFullName(): Observable<string[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<string[]>(`${this.apiUrl}/fullnames`, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error getting users with full names:', error);
          return throwError('Erreur lors de la récupération des noms complets des utilisateurs.');
        })
      );
  }

  getUserTasks(): Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Task[]>(`${this.apiUrl}/user-tasks`, httpOptions).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des tâches de l\'utilisateur :', error);
        return throwError('Erreur lors de la récupération des tâches de l\'utilisateur.');
      })
    );
  }

  markTaskAsDone(taskId: string): Observable<Task> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const url = `${this.apiUrl}/ChangeStatus/${taskId}`;

    return this.http.put<Task>(url, null, httpOptions).pipe(
      catchError(error => {
        console.error('Erreur lors du marquage de la tâche comme "Done" :', error);
        return throwError('Erreur lors du marquage de la tâche comme "Done".');
      })
    );
  }

  updateAllUserTasksAsDone(): Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.put<Task[]>(`${this.apiUrl}/updateTasksForLoggedInUser`, {}, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la mise à jour des tâches de l\'utilisateur :', error);
          return throwError('Erreur lors de la mise à jour des tâches de l\'utilisateur.');
        })
      );
  }



  getTasksByStatus(status: string): Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const url = `${this.apiUrl}/status/${status}`;

    return this.http.get<Task[]>(url, httpOptions).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des tâches par statut :', error);
        return throwError('Erreur lors de la récupération des tâches par statut.');
      })
    );
  }

  getAllTasksByStatus(status: string): Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const url = `${this.apiUrl}/filterByStatus/${status}`;

    return this.http.get<Task[]>(url, httpOptions).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des tâches par statut :', error);
        return throwError('Erreur lors de la récupération des tâches par statut.');
      })
    );
  }
  getCurrentUser(): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<User>(`${this.apiUrl}/current-user`, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération de l\'utilisateur actuel :', error);
          return throwError('Erreur lors de la récupération de l\'utilisateur actuel.');
        })
      );
  }







  // updateDueDate(taskId: string, newDueDate: string): Observable<Task> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.token}`,
  //       'Content-Type': 'application/json'
  //     })
  //   };
  //
  //   const url = `${this.apiUrl}/${taskId}/due-date/${newDueDate}`;
  //
  //   return this.http.patch<Task>(url, null, httpOptions).pipe(
  //     catchError(error => {
  //       console.error('Error updating due date:', error);
  //       return throwError('Error updating due date.');
  //     })
  //   );
  // }
  updateDueDate(taskId: string, newDueDate: Date): Observable<any> {
    const formattedDate = newDueDate.toISOString();
    const url = `${this.apiUrl}/${taskId}/due-date/${formattedDate}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.patch(url, null, httpOptions);

}
  Rating(taskId: string, rating: number): Observable<any> {
    const url = `${this.apiUrl}/Rating/${taskId}/${rating}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.patch(url, null, httpOptions);
  }





  sendAlertNotification(email: string, task: any,commentaire: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const body = {
      email: email,
      task: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        creationDate: task.creationDate,
        estimatedDuration: task.estimatedDuration,
        rating: task.rating,


        assignedUser: {
          firstName: task.assignedUser.firstName,
          lastName: task.assignedUser.lastName
        },

      },
      commentaire: commentaire
    };


    return this.http.post<any>(`${this.apiUrl}/AlertNotification`, body, httpOptions).pipe(
      catchError((error) => {
        console.error('Error sending notification email:', error);
        return throwError(error);
      })
    );
  }
  sendSuccessNotification(email: string, task: any,commentaire: string): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        })
      };

      const body = {
        email: email,
        task: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          creationDate: task.creationDate,
          estimatedDuration: task.estimatedDuration,
          rating: task.rating,


          assignedUser: {
            firstName: task.assignedUser.firstName,
            lastName: task.assignedUser.lastName
          },

        },
        commentaire: commentaire
      };


      return this.http.post<any>(`${this.apiUrl}/SuccessNotification`, body, httpOptions).pipe(
        catchError((error) => {
          console.error('Error sending notification email:', error);
          return throwError(error);
        })
      );


  }


  getBoardsByUserId(userId: string): Observable<Board[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Board[]>(`${this.apiUrl}/getAllBoardsByUser/${userId}`, httpOptions);
  }


  addBoard(board:Board, firstName: string, lastName: string): Observable<Board> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json' // Make sure to set Content-Type header
      })
    };

    // Include firstName and lastName in the URL
    return this.http.post<Board>(`${this.apiUrl}/addBoard/${firstName}/${lastName}`, board, httpOptions);
  }



}
