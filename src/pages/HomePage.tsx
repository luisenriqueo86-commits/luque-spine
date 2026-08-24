import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import {
  addCircleOutline, analyticsOutline, documentTextOutline, peopleOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const HomePage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonTitle>Luque Spine</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <section className="hero">
          <h1>Luque Spine</h1>
          <p>Registro clínico y seguimiento de cirugía de columna</p>
        </section>

        <IonButton expand="block" size="large" routerLink="/nuevo-paciente">
          <IonIcon slot="start" icon={addCircleOutline} />
          Nuevo paciente
        </IonButton>

        <IonCard button onClick={() => history.push('/pacientes')}>
          <IonCardHeader>
            <IonCardTitle><IonIcon icon={peopleOutline} /> Pacientes</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>Consultar y administrar pacientes registrados.</IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle><IonIcon icon={documentTextOutline} /> Seguimientos</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>Registrar ODI y VAS durante el seguimiento.</IonCardContent>
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
