import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Patient } from '../models/patient';
import { getPatients } from '../services/patientStorage';

type PatientSection =
  | 'datos'
  | 'diagnostico'
  | 'cirugia'
  | 'escalas'
  | 'seguimiento';

interface RouteParams {
  id: string;
}

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [seccion, setSeccion] =
    useState<PatientSection>('datos');

  useEffect(() => {
    const encontrado = getPatients().find(
      (item) => item.id === id
    );

    setPaciente(encontrado ?? null);
  }, [id]);

  if (!paciente) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/pacientes" />
            </IonButtons>

            <IonTitle>Paciente</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <h2>Paciente no encontrado</h2>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/pacientes" />
          </IonButtons>

          <IonTitle>{paciente.nombre}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSegment
          scrollable
          value={seccion}
          onIonChange={(event) =>
            setSeccion(
              event.detail.value as PatientSection
            )
          }
        >
          <IonSegmentButton value="datos">
            <IonLabel>Datos</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="diagnostico">
            <IonLabel>Diagnóstico</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="cirugia">
            <IonLabel>Cirugía</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="escalas">
            <IonLabel>ODI/VAS</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="seguimiento">
            <IonLabel>Seguimiento</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {seccion === 'datos' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Datos personales</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>Nombre</h3>
                    <p>{paciente.nombre}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Edad</h3>
                    <p>
                      {paciente.edad
                        ? `${paciente.edad} años`
                        : 'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Sexo</h3>
                    <p>{paciente.sexo || 'No registrado'}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Teléfono</h3>
                    <p>
                      {paciente.telefono || 'No registrado'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Historia clínica</h3>
                    <p>
                      {paciente.historiaClinica ||
                        'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Seguro médico / OS</h3>
                    <p>{paciente.seguro || 'No registrado'}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {seccion === 'diagnostico' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Clínica y diagnóstico
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <h3>Clínica</h3>
                    <p>{paciente.clinica || 'No registrada'}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <h3>TAC</h3>
                    <p>{paciente.tac || 'No registrada'}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <h3>RMN</h3>
                    <p>{paciente.rmn || 'No registrada'}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <h3>Diagnóstico principal</h3>
                    <p>
                      {paciente.diagnostico ||
                        'No registrado'}
                    </p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {seccion === 'cirugia' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Cirugía</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>Fecha</h3>
                    <p>
                      {paciente.fechaCirugia ||
                        'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Técnica</h3>
                    <p>{paciente.tecnica || 'No registrada'}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Niveles</h3>
                    <p>{paciente.niveles || 'No registrados'}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {seccion === 'escalas' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>ODI y VAS</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              Las escalas se agregarán en el próximo módulo.
            </IonCardContent>
          </IonCard>
        )}

        {seccion === 'seguimiento' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Seguimiento</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              Aquí registraremos alta, 1, 3, 6 y 12 meses.
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PatientDetailPage;