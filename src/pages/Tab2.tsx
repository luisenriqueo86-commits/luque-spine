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
} from '@ionic/react';

import {
  addCircleOutline,
  personCircleOutline,
} from 'ionicons/icons';

import { useState } from 'react';

interface Paciente {
  id: number;
  nombre: string;
  edad: number;
  diagnostico: string;
}

const Tab2: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');

  const pacientes: Paciente[] = [];

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
        <IonButton expand="block" size="large">
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
                    {paciente.edad} años · {paciente.diagnostico}
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

export default Tab2;