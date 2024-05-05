import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute and Router
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';
import { PublicationService } from '../../../../shared/services/blog/publication.service';
import { Publication } from '../../../../shared/model/publication.model'; // Adjust this import as necessary

// ... (rest of your imports)
enum BlogSubject {
  DocumentsAdministratifs = "Paperwork",
  Innovation = "Innovation",
  Reglementations = "Legislation",
  Finance = "Finance",
  Autre = "Other"
}
@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.scss']
})
export class ModifyPostComponent implements OnInit {
  public subjects = Object.values(BlogSubject);
  public ClassicEditor = ClassicEditor;

  public postModel:Publication = {
    content: '',
    sujet: ''

  };

  constructor(
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router // Inject Router for redirection
  ) { }

  ngOnInit(): void {
    // Retrieve the publication ID from the route and fetch the publication
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.publicationService.getPublicationById(id).subscribe(
        (publication: Publication) => {
          this.postModel = publication; // Prepopulate the form with the publication data
        },
        (error) => {
          console.error('Error fetching publication:', error);
        }
      );
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.publicationService.updatePublication(this.postModel).subscribe({
        next: (response) => {
          console.log('Publication updated',this.postModel );
          this.router.navigate(['/blog/details']); // Navigate to the details page after update
        },
        error: (error) => {
          console.error('Error updating publication:', error);
        }
      });
    } else {
      console.error('Form is not valid', form);
    }
  }

  // Make sure to implement the updatePublication method in your service
}
