 import {
  IonButton,
  IonCard,
  useIonViewWillEnter,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useState } from 'react';

import {
  ResearchProjectDraft,
  emptyResearchProjectDraft,
} from '../models/researchProject';

import {
  createResearchProject,
  getResearchProjects,
} from '../services/researchProjectStorage';

const ResearchPage: React.FC = () => {
  const [projects, setProjects] = useState(
    getResearchProjects()
  );

  const [draft, setDraft] =
    useState<ResearchProjectDraft>({
      ...emptyResearchProjectDraft,
    });

  const actualizarCampo = <
    K extends keyof ResearchProjectDraft
  >(
    campo: K,
    valor: ResearchProjectDraft[K]
  ) => {
    setDraft({
      ...draft,
      [campo]: valor,
    });
  };

  const crearProyecto = () => {
    if (!draft.nombre.trim()) {
      return;
    }

    createResearchProject(draft);

    setProjects(getResearchProjects());

    setDraft({
      ...emptyResearchProjectDraft,
    });
  };
  useIonViewWillEnter(() => {
  setProjects(getResearchProjects());
});

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Investigación</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Nuevo proyecto
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

            <IonItem>
              <IonLabel position="stacked">
                Nombre del proyecto
              </IonLabel>

              <IonInput
                value={draft.nombre}
                placeholder="Ej. TLIF 2026"
                onIonInput={(event) =>
                  actualizarCampo(
                    'nombre',
                    event.detail.value ?? ''
                  )
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                Descripción
              </IonLabel>

              <IonTextarea
                value={draft.descripcion}
                autoGrow
                placeholder="Objetivo o descripción del estudio"
                onIonInput={(event) =>
                  actualizarCampo(
                    'descripcion',
                    event.detail.value ?? ''
                  )
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                Fecha de inicio
              </IonLabel>

              <IonInput
                type="date"
                value={draft.fechaInicio}
                onIonInput={(event) =>
                  actualizarCampo(
                    'fechaInicio',
                    event.detail.value ?? ''
                  )
                }
              />
            </IonItem>

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={crearProyecto}
            >
              Crear proyecto
            </IonButton>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Proyectos registrados
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

            {projects.length === 0 ? (
              <p>
                Todavía no hay proyectos de investigación.
              </p>
            ) : (
              <IonList>
                {projects.map((project) => (
                    <IonItem
  key={project.id}
  button
  routerLink={`/investigacion/${project.id}`}
>
                    <IonLabel className="ion-text-wrap">
                      <h2>{project.nombre}</h2>

                      <p>
                        {project.descripcion ||
                          'Sin descripción'}
                      </p>

                      <p>
                        Inicio:{' '}
                        {project.fechaInicio ||
                          'No registrado'}
                      </p>

                      <p>
                        Pacientes incluidos:{' '}
                        {project.patientIds.length}
                      </p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}

          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default ResearchPage;