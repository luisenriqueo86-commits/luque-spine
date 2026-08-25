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
 import {
  getPatients,
  contarSeguimientosPendientes,
} from '../services/patientStorage';
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

     const pendientes =
  contarSeguimientosPendientes(pacientes);

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

  <strong>
    {seguimientosPendientes === 0
      ? '✓ Seguimiento al día'
      : `⚠ ${seguimientosPendientes} ${
          seguimientosPendientes === 1
            ? 'control pendiente'
            : 'controles pendientes'
        }`}
  </strong>
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