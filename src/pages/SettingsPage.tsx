import {
  IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonPage, IonTitle, IonToolbar
} from '@ionic/react';

const SettingsPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar><IonTitle>Ajustes</IonTitle></IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <IonList inset>
        <IonItem>
          <IonLabel>
            <h2>Luque Spine</h2>
            <p>Versión local de desarrollo</p>
          </IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
);

export default SettingsPage;
