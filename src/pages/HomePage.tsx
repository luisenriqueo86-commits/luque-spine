 import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

import {
  addCircleOutline,
  analyticsOutline,
  documentTextOutline,
  peopleOutline,
} from 'ionicons/icons';

import { useHistory } from 'react-router-dom';
import { useState } from 'react';

import { getPatients } from '../services/patientStorage';
import { getResearchProjects } from '../services/researchProjectStorage';

const HomePage: React.FC = () => {
  const history = useHistory();

  const [totalPacientes, setTotalPacientes] = useState(0);
  const [proyectosActivos, setProyectosActivos] = useState(0);
  const [seguimientosPendientes, setSeguimientosPendientes] =
    useState(0);

  useIonViewWillEnter(() => {
    const pacientes = getPatients();
    const proyectos = getResearchProjects();

    setTotalPacientes(pacientes.length);

    setProyectosActivos(
      proyectos.filter((proyecto) => proyecto.activo).length
    );

    const hoy = new Date();

    const pendientes = pacientes.reduce(
      (total, paciente) => {
        if (!paciente.fechaCirugia) {
          return total;
        }

        const fecha = new Date(
          `${paciente.fechaCirugia}T00:00:00`
        );

        if (Number.isNaN(fecha.getTime())) {
          return total;
        }

        const meses =
          (hoy.getFullYear() - fecha.getFullYear()) * 12 +
          (hoy.getMonth() - fecha.getMonth());

        const controles = [
          { key: '1_mes', meses: 1 },
          { key: '3_meses', meses: 3 },
          { key: '6_meses', meses: 6 },
          { key: '12_meses', meses: 12 },
        ] as const;

        const pendientesPaciente = controles.filter(
          (control) => {
            if (meses < control.meses) {
              return false;
            }

            const escala =
              paciente.escalas[control.key];

            const tieneVAS =
              typeof escala?.vas === 'number';

            const tieneODI =
              typeof escala?.odi === 'number';

            return !tieneVAS && !tieneODI;
          }
        ).length;

        return total + pendientesPaciente;
      },
      0
    );

    setSeguimientosPendientes(pendientes);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Luque Spine</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <section className="hero">
          <h1>Luque Spine</h1>
          <p>
            Registro clínico y seguimiento de cirugía de columna
          </p>
        </section>

        <IonButton
          expand="block"
          size="large"
          routerLink="/nuevo-paciente"
        >
          <IonIcon
            slot="start"
            icon={addCircleOutline}
          />
          Nuevo paciente
        </IonButton>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginTop: '16px',
            marginBottom: '16px',
          }}
        >

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Total de pacientes
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <h1>{totalPacientes}</h1>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Proyectos activos
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <h1>{proyectosActivos}</h1>
            </IonCardContent>
          </IonCard>

          <IonCard
  button
  onClick={() => history.push('/estadisticas')}
>
            <IonCardHeader>
              <IonCardTitle>
                Seguimientos pendientes
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <h1>{seguimientosPendientes}</h1>
            </IonCardContent>
          </IonCard>

        </div>

        <IonCard
          button
          onClick={() => history.push('/pacientes')}
        >
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={peopleOutline} /> Pacientes
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            Consultar y administrar pacientes registrados.
          </IonCardContent>
        </IonCard>

         <IonCard
  button
  onClick={() => history.push('/estadisticas')}
>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={documentTextOutline} /> Seguimientos
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            Registrar ODI y VAS durante el seguimiento.
          </IonCardContent>
        </IonCard>

        <IonCard
          button
          onClick={() => history.push('/investigacion')}
        >
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={analyticsOutline} /> Investigación
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            Organizar pacientes por proyectos y analizar resultados.
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default HomePage;