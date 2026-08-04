 import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

import {
  addCircleOutline,
  personCircleOutline,
} from 'ionicons/icons';

import { useState } from 'react';

interface Paciente {
  id: string;
  nombre: string;
  edad: string;
  diagnostico: string;
}

const PatientsPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const cargarPacientes = () => {
    const guardados = JSON.parse(
      localStorage.getItem('luqueSpinePacientes') ?? '[]'
    );

    setPacientes(guardados);
  };

  useIonViewWillEnter(() => {
    cargarPacientes();
  });

  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          size="large"
          routerLink="/nuevo-paciente"
        >
          <IonIcon slot="start" icon={addCircleOutline} />
          Nuevo paciente
        </IonButton>

        <IonSearchbar
          value={busqueda}
          onIonInput={(evento) =>
            setBusqueda(evento.detail.value ?? '')
          }
          placeholder="Buscar paciente"
        />

        {pacientesFiltrados.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: '48px',
              opacity: 0.7,
            }}
          >
            <IonIcon
              icon={personCircleOutline}
              style={{ fontSize: '72px' }}
            />

            <h2>No hay pacientes</h2>

            <p>
              Pulsa “Nuevo paciente” para registrar el primero.
            </p>
          </div>
        ) : (
          <IonList>
            {pacientesFiltrados.map((paciente) => (
              <IonItem key={paciente.id} button>
                <IonIcon
                  slot="start"
                  icon={personCircleOutline}
                />

                <IonLabel>
                  <h2>{paciente.nombre}</h2>
                  <p>
                    {paciente.edad
                      ? `${paciente.edad} años`
                      : 'Edad no registrada'}
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