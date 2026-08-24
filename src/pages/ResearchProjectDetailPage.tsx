 import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Patient } from '../models/patient';
import { ResearchProject } from '../models/researchProject';

import { getPatients } from '../services/patientStorage';

import {
  getResearchProjects,
  updateResearchProject,
} from '../services/researchProjectStorage';

interface RouteParams {
  id: string;
}

const ResearchProjectDetailPage: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [project, setProject] =
    useState<ResearchProject | null>(null);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  useEffect(() => {
    const encontrado = getResearchProjects().find(
      (item) => item.id === id
    );

    setProject(encontrado ?? null);
    setPatients(getPatients());
  }, [id]);

  const cambiarPaciente = (
    patientId: string,
    checked: boolean
  ) => {
    if (!project) return;

    const nuevosPatientIds = checked
      ? Array.from(
          new Set([
            ...project.patientIds,
            patientId,
          ])
        )
      : project.patientIds.filter(
          (idActual) => idActual !== patientId
        );

    setProject({
      ...project,
      patientIds: nuevosPatientIds,
    });
  };

   const guardarPacientes = () => {
  if (!project) return;

  const proyectoLimpio = {
    ...project,
    patientIds: patientIdsValidos,
  };

  const actualizado =
    updateResearchProject(proyectoLimpio);

  setProject(actualizado);
};
  if (!project) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/investigacion"
              />
            </IonButtons>

            <IonTitle>Proyecto</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <h2>Proyecto no encontrado</h2>
        </IonContent>
      </IonPage>
    );
  }

  const pacientesIncluidos = patients.filter(
    (patient) =>
      project.patientIds.includes(patient.id)
  );
  const patientIdsValidos = project.patientIds.filter(
  (patientId) =>
    patients.some(
      (patient) => patient.id === patientId
    )
);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/investigacion"
            />
          </IonButtons>

          <IonTitle>{project.nombre}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Datos del proyecto
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>

              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <h3>Nombre</h3>
                  <p>{project.nombre}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <h3>Descripción</h3>
                  <p>
                    {project.descripcion ||
                      'Sin descripción'}
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h3>Fecha de inicio</h3>
                  <p>
                    {project.fechaInicio ||
                      'No registrada'}
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h3>Pacientes incluidos</h3>
                  <p>
                    {project.patientIds.length}
                  </p>
                </IonLabel>
              </IonItem>

            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Seleccionar pacientes
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

            {patients.length === 0 ? (
              <p>
                No hay pacientes registrados.
              </p>
            ) : (
              <IonList>
                {patients.map((patient) => (
                  <IonItem key={patient.id}>

                    <IonCheckbox
                      slot="start"
                      checked={project.patientIds.includes(
                        patient.id
                      )}
                      onIonChange={(event) =>
                        cambiarPaciente(
                          patient.id,
                          event.detail.checked
                        )
                      }
                    />

                    <IonLabel className="ion-text-wrap">
                      <h2>{patient.nombre}</h2>

                      <p>
                        {patient.edad
                          ? `${patient.edad} años`
                          : 'Edad no registrada'}
                      </p>

                      <p>
                        {patient.diagnostico ||
                          'Sin diagnóstico'}
                      </p>
                    </IonLabel>

                  </IonItem>
                ))}
              </IonList>
            )}

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={guardarPacientes}
            >
              Guardar pacientes del proyecto
            </IonButton>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Pacientes incluidos
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

            {pacientesIncluidos.length === 0 ? (
              <p>
                Todavía no hay pacientes incluidos.
              </p>
            ) : (
              <IonList>
                {pacientesIncluidos.map(
                  (patient, index) => (
                    <IonItem key={patient.id}>
                      <IonLabel className="ion-text-wrap">
                        <h2>
                          Paciente {index + 1}
                        </h2>

                        <p>
                          {patient.ocultarNombre
                            ? 'Paciente anonimizado'
                            : patient.nombre}
                        </p>

                        <p>
                          Diagnóstico:{' '}
                          {patient.diagnostico ||
                            'Sin registrar'}
                        </p>

                        <p>
                          Preoperatorio — VAS:{' '}
                          {patient.escalas.preoperatorio
                            .vas ?? 'Sin registrar'}
                          {' · '}
                          ODI:{' '}
                          {patient.escalas.preoperatorio
                            .odi !== null
                            ? `${patient.escalas.preoperatorio.odi}%`
                            : 'Sin registrar'}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )
                )}
              </IonList>
            )}

          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default ResearchProjectDetailPage;