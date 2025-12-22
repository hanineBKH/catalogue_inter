import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Formation } from '../model/formation.model';
import { FormationService } from '../service/formation-service';
import { HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
declare var $: any;
declare var google: any;
interface GroupedFormations {
  axe: string;
  types: {
    type: string;
    interneExterne: {
      status: 'interne' | 'externe';
      formations: Formation[];
    }[];
  }[];
}
interface GroupedParcours {
  name: string;
  count: number;
  axes: {
    axe: string;
    types: {
      type: string;
      interneExterne: {
        status: 'interne' | 'externe';
        formations: Formation[];
      }[];
    }[];
  }[];
}

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, HttpClientModule,RouterModule],
  templateUrl: './catalogue.html',
  styleUrls: ['./catalogue.css']
})
export class Catalogue implements OnInit {
  formations: Formation[] = [];
  collapsedAxes: boolean[] = [];
  categories: string[] = [];
  groupedFormations: GroupedFormations[] = [];
  currentPage: number = 0;
  currentFormation: Formation | null = null;
    translationReady = false;
  // Page flip animation properties
  isAnimating = false;
  pageFlipDirection: 'forward' | 'backward' | null = null;
  groupedAxes: any[] = [];
groupedParcours: GroupedParcours[] = [];

  // View toggle properties
  currentView: 'axe' | 'parcours' = 'axe';
  visibleFormations: Formation[] = [];

  collapsedParcoursAxes: { [key: string]: boolean[] } = {};

  constructor(private formationService: FormationService,@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.loadFormations();
    //  this. addGoogleTranslateScript();
  
  }

  ngAfterViewInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   this.addGoogleTranslateScript();
    // }
  }

  switchView(view: 'axe' | 'parcours') {
    this.currentView = view;
  }

  toggleAxe(index: number) {
    this.collapsedAxes[index] = !this.collapsedAxes[index];
  }
  
  toggleParcoursAxe(parcoursName: string, axeIndex: number) {
    if (!this.collapsedParcoursAxes[parcoursName]) {
      this.collapsedParcoursAxes[parcoursName] = [];
    }
    this.collapsedParcoursAxes[parcoursName][axeIndex] = !this.collapsedParcoursAxes[parcoursName][axeIndex];
  }

  loadFormations(): void {
  this.formationService.getFormations().subscribe({
    next: (data) => {
      this.formations = data;

      if (this.formations.length > 0) {
        this.currentFormation = this.formations[0];
      }

      // ✅ compute ONCE
      this.groupedFormations = this.computeGroupedFormations();
      this.groupedParcours = this.computeParcoursFormations();

      // ✅ init collapse state
      this.collapsedAxes = this.groupedFormations.map(() => false);

      this.collapsedParcoursAxes = {};
      this.groupedParcours.forEach(p => {
        this.collapsedParcoursAxes[p.name] = p.axes.map(() => false);
      });
    },
    error: err => console.error(err)
  });
}
  // addGoogleTranslateScript() {
  //   const win = window as any;
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   // Expose init globally
  //   win.googleTranslateElementInit = () => {
  //     new win.google.translate.TranslateElement(
  //       {
  //         pageLanguage: 'fr',
  //         layout: win.google.translate.TranslateElement.InlineLayout.SIMPLE,
  //         autoDisplay: false
  //       },
  //       'google_translate_element'
  //     );

  //     // Run inside Angular zone to update template safely
  //     this.ngZone.run(() => {
  //       this.translationReady = true;
  //     });
  //   };

  //   const script = document.createElement('script');
  //   script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  //   script.async = true;
  //   script.defer = true;
  //   document.body.appendChild(script);
  // }

  // translateTo(lang: 'en' | 'fr') {
  //   if (!isPlatformBrowser(this.platformId) || !this.translationReady) return;

  //   let retries = 0;
  //   const maxRetries = 50;

  //   const tryTranslate = () => {
  //     const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  //     if (select) {
  //       select.value = lang;
  //       select.dispatchEvent(new Event('change'));
  //     } else if (retries < maxRetries) {
  //       retries++;
  //       setTimeout(tryTranslate, 100);
  //     } else {
  //       console.warn('Google Translate select not found. Giving up.');
  //     }
  //   };

  //   tryTranslate();
  // }
   showCover = true;
     showPopup: boolean = false;
      showCatalogue: boolean = false; 
 startCatalogue() {
 
      this.showCover = false;

    // Show catalogue AND popup
    this.showCatalogue = true;
    this.showPopup = true;
  }
closePopup() {
  console.log('CLOSE POPUP CLICKED');
  this.showPopup = false;
}

  launchCatalogue() {
    console.log("Catalogue started!"); 
    // Your actual catalogue start logic here
  }
  computeGroupedFormations(): GroupedFormations[] {
    const grouped: GroupedFormations[] = [];
    const axes = [...new Set(this.formations.map(f => f.axe))];

    for (const axe of axes) {
      const axeFormations = this.formations.filter(f => f.axe === axe);
      const types = [...new Set(axeFormations.map(f => f.type))];

      const typeGroups = types.map(type => {
        const typeFormations = axeFormations.filter(f => f.type === type);
        return {
          type,
          interneExterne: ['externe', 'interne'].map(status => ({
            status: status as 'externe' | 'interne',
            formations: typeFormations.filter(f => f.interne_externe === status)
          })).filter(group => group.formations.length > 0)
        };
      });

      grouped.push({ axe, types: typeGroups });
    }

    return grouped;
  }

  computeParcoursFormations(): any[] {
    const parcours = [...new Set(this.formations.map(f => f.parcours).filter(p => p))];
    
    return parcours.map(parcoursName => {
      const parcoursFormations = this.formations.filter(f => f.parcours === parcoursName);
      const axes = [...new Set(parcoursFormations.map(f => f.axe))];
      
      const axeGroups = axes.map(axe => {
        const axeFormations = parcoursFormations.filter(f => f.axe === axe);
        const types = [...new Set(axeFormations.map(f => f.type))];
        
        const typeGroups = types.map(type => {
          const typeFormations = axeFormations.filter(f => f.type === type);
          return {
            type,
            interneExterne: ['externe', 'interne'].map(status => ({
              status: status as 'externe' | 'interne',
              formations: typeFormations.filter(f => f.interne_externe === status)
            })).filter(group => group.formations.length > 0)
          };
        });
        
        return { axe, types: typeGroups };
      });
      
      return {
        name: parcoursName,
        count: parcoursFormations.length,
        axes: axeGroups
      };
    });
  }
// Returns all formations in the order they appear in the current sidebar
getVisibleFormations(): Formation[] {
  if (this.currentView === 'axe') {
    return this.groupedFormations.flatMap(g =>
      g.types.flatMap(t =>
        t.interneExterne.flatMap(s => s.formations)
      )
    );
  } else if (this.currentView === 'parcours') {
    const formations: Formation[] = [];
    for (const parcours of this.groupedParcours) {
      for (const axe of parcours.axes) {
        for (const type of axe.types) {
          for (const statusGroup of type.interneExterne) {
            formations.push(...statusGroup.formations);
          }
        }
      }
    }
    return formations;
  }
  return [];
}

// Check if a formation is the current page
isCurrentPageFormation(formation: Formation): boolean {
  const visible = this.getVisibleFormations();
  return visible[this.currentPage] === formation;
}

// Update goToPage to use visible formations
goToPage(index: number): void {
  const visible = this.getVisibleFormations();
  if (!visible[index]) return;
  this.currentPage = index;
  this.currentFormation = visible[index];
}





//  goToPage(index: number): void {
//   console.log('INDEX:', index);
//   console.log('FORMATION AT INDEX:', this.formations[index]);

//   if (!this.formations[index]) {
//     console.error('❌ Formation is undefined');
//     return;
//   }

//   this.currentPage = index;
//   this.currentFormation = this.formations[index];
// }


nextPage(): void {
  if (this.canGoNext()) this.goToPage(this.currentPage + 1);
}

prevPage(): void {
  if (this.canGoPrevious()) this.goToPage(this.currentPage - 1);
}
  getFormationsByCategory(category: string): Formation[] {
    let filtered = this.formations.filter(f => f.type === category);

    filtered.sort((a, b) => {
      if (a.interne_externe === b.interne_externe) {
        return a.axe.localeCompare(b.axe);
      }
      return a.interne_externe.localeCompare(b.interne_externe);
    });

    return filtered;
  }

  getFormationIndex(formation: Formation): number {
    return this.formations.indexOf(formation);
  }

  isCurrentPage(index: number): boolean {
    return this.currentPage === index;
  }

canGoPrevious(): boolean {
  return this.currentPage > 0;
}

canGoNext(): boolean {
  return this.currentPage < this.getVisibleFormations().length - 1;
}

  getNiveauColor(niveau: string): string {
    switch(niveau?.toLowerCase()) {
      case 'débutant':
        return 'niveau-debutant';
      case 'intermédiaire':
        return 'niveau-intermediaire';
      case 'avancé':
        return 'niveau-avance';
      default:
        return 'niveau-default';
    }
  }
  
}