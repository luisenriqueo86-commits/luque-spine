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
} from '@ionic/react';

import {
  addCircleOutline,
  peopleOutline,
  analyticsOutline,
  documentTextOutline,
} from 'ionicons/icons';

import { useHistory } from 'react-router-dom';

 const HomePage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Luque Spine</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontWeight: 700 }}>Luque Spine</h1>
          <p>Registro clínico y seguimiento de cirugía de columna</p>
        </div>

        <IonButton
          expand="block"
          size="large"
          onClick={() => history.push('/pacientes')}
        >
          <IonIcon slot="start" icon={addCircleOutline} />
          Nuevo paciente
        </IonButton>

        <IonCard button onClick={() => history.push('/pacientes')}>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={peopleOutline} /> Pacientes
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            Consultar y administrar pacientes registrados.
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={documentTextOutline} /> Seguimientos
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            Registrar ODI y VAS en los controles postoperatorios.
          </IonCardContent>
        </IonCard>

        <IonCard>
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