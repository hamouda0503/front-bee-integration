import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { Team } from '../../../../shared/model/team.model';
import { Observable } from 'rxjs';
import { TeamService } from '../../../../shared/services/team.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { UpdateTeamComponent } from "../../../../components/apps/team/update-team/update-team.component";
import { NgbModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { UserService } from '../../../../shared/services/user.service';
import { User } from '../../../../shared/model/user.model';
import {
  ButtonsConfig,
  ButtonsStrategy,
  Image,
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  KS_DEFAULT_BTN_FULL_SCREEN,
  ButtonEvent,
  ButtonType,
  PlainGalleryConfig,
  PlainGalleryStrategy,
  ModalGalleryService,
  PlainLibConfig,
  LineLayout,
  ModalGalleryRef,
} from '@ks89/angular-modal-gallery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild(UpdateTeamComponent) UpdateTeam: UpdateTeamComponent;

  public url: any;
  public team: Team;


  images: Image[] = [
    new Image(
      0,
      {
        img: 'assets/images/other-images/profile-style-img.png',
        extUrl: 'http://www.google.com'
      })
  ]
  images1: Image[] = [
    new Image(
      0,
      {
        img: 'assets/images/blog/img.png',
        extUrl: 'http://www.google.com'
      })
  ]

  constructor(private modalGalleryService: ModalGalleryService, private teamService: TeamService, private storageService: StorageService, private modalService: ModalService) {}

  libConfigPlainGalleryRow: PlainLibConfig = {
    plainGalleryConfig: {
      strategy: PlainGalleryStrategy.ROW,
      layout: new LineLayout({ width: '80px', height: '80px' }, { length: 2, wrap: true }, 'flex-start')
    }
  };

  onShow(id: number, index: number, images: Image[] = this.images): void {
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images,
      currentImage: images[index]
    }) as ModalGalleryRef;
  }

  buttonsConfigDefault: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  };
  buttonsConfigSimple: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  };
  buttonsConfigAdvanced: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.ADVANCED
  };
  buttonsConfigFull: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.FULL
  };
  buttonsConfigCustom: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      KS_DEFAULT_BTN_FULL_SCREEN,
      KS_DEFAULT_BTN_EXTURL,
      KS_DEFAULT_BTN_DOWNLOAD,
      KS_DEFAULT_BTN_CLOSE
    ]
  };

  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  };

  onButtonAfterHook(event: ButtonEvent) {
    if (!event || !event.button) {
      return;
    }
  }

  onCustomButtonBeforeHook(event: ButtonEvent, galleryId: number | undefined) {
    if (!event || !event.button) {
      return;
    }

    if (event.button.type === ButtonType.CUSTOM) {
      this.addRandomImage();

      setTimeout(() => {
        // this.galleryService.openGallery(galleryId, this.images.length - 1);
      }, 0);
    }
  }

  onCustomButtonAfterHook(event: ButtonEvent, galleryId: number | undefined) {
    if (!event || !event.button) {
      return;
    }
  }

  addRandomImage() {
    const imageToCopy: Image = this.images[Math.floor(Math.random() * this.images.length)];
    const newImage: Image = new Image(this.images.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
    this.images = [...this.images, newImage];
  }


  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }
  openUpdateTeamModal(updatedTeam: Team): void {
    this.modalService.triggerUpdateTeamModal(updatedTeam);
  }

  ngOnInit() {
    const currentUser = this.storageService.getUser();
    this.teamService.getTeamByUserEmail(currentUser.email).subscribe(updatedTeam => {
      this.modalService.showUpdateTeamModal$.subscribe((updatedTeam) => {
        this.UpdateTeam.openModal(updatedTeam); // Use teamId here
      });




      this.team = updatedTeam;
      console.log(this.team);
      console.log('Number of team members:', this.team?.members?.length);
      if (this.team && this.team.teamImage) {
        this.images = [
          new Image(
            0,
            {
              img: this.team.teamImage,
              extUrl: 'http://www.google.com'
            })
        ];
      }
      if (this.team && this.team.coverImage) {
        this.images.push(
          new Image(
            1,
            {
              img: this.team.coverImage,
              extUrl: 'http://www.google.com'
            })
        );
      }
    }, error => {
      console.error('Failed to fetch team:', error);
      this.images = [
        new Image(
          0,
          {
            img: 'assets/images/other-images/profile-style-img.png',
            extUrl: 'http://www.google.com'
          })
      ];
    });
  }
}
