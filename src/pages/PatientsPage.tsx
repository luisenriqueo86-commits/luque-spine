import {
  IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel,
  IonList, IonPage, IonSearchbar, IonTitle, IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import { addCircleOutline, personCircleOutline } from 'ionicons/icons';
import { useMemo, useState } from 'react';

import EmptyState from '../components/EmptyState';
import { Patient } from '../models/patient';
import { getPatients } from '../services/patientStorage';

const PatientsPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [pacientes, setPacientes] = useState<Patient[]>([]);

  useIonViewWillEnter(() => setPacientes(getPatients()));

  const pacientesFiltrados = useMemo(
    () => pacientes.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    ),
    [pacientes, busqueda]
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonTitle>Pacientes</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" size="large" routerLink="/nuevo-paciente">
          <IonIcon slot="start" icon={addCircleOutline} />
          Nuevo paciente
        </IonButton>

        <IonSearchbar
          value={busqueda}
          onIonInput={(e) => setBusqueda(e.detail.value ?? '')}
          placeholder="Buscar paciente"
        />

        {pacientesFiltrados.length === 0 ? (
          <EmptyState
            title="No hay pacientes"
            message="Pulsa “Nuevo paciente” para registrar el primero."
          />
        ) : (
          <IonList>
            {pacientesFiltrados.map((paciente) => (
              <IonItem key={paciente.id} button detail>
                <IonIcon slot="start" icon={personCircleOutline} />
                <IonLabel>
                  <h2>{paciente.nombre}</h2>
                  <p>
                    {paciente.edad ? `${paciente.edad} años` : 'Edad no registrada'}
                    {' · '}
                    {paciente.diagnostico || 'Sin diagnóstico'}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PatientsPage;
