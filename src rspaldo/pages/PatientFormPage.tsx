 import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/react';

import { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface Paciente {
  id: string;
  nombre: string;
  ocultarNombre: boolean;
  edad: string;
  sexo: string;
  telefono: string;
  historiaClinica: string;
  seguro: string;
  clinica: string;
  tac: string;
  rmn: string;
  diagnostico: string;
  fechaCirugia: string;
  tecnica: string;
  niveles: string;
}

const PatientFormPage: React.FC = () => {
  const history = useHistory();

  const [paciente, setPaciente] = useState<Paciente>({
    id: '',
    nombre: '',
    ocultarNombre: false,
    edad: '',
    sexo: '',
    telefono: '',
    historiaClinica: '',
    seguro: '',
    clinica: '',
    tac: '',
    rmn: '',
    diagnostico: '',
    fechaCirugia: '',
    tecnica: '',
    niveles: '',
  });

  const [mostrarAviso, setMostrarAviso] = useState(false);

  const actualizarCampo = (
    campo: keyof Paciente,
    valor: string | boolean
  ) => {
    setPaciente((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const guardarPaciente = () => {
    if (!paciente.nombre.trim()) {
      setMostrarAviso(true);
      return;
    }

    const pacientesGuardados = JSON.parse(
      localStorage.getItem('luqueSpinePacientes') ?? '[]'
    );

    const nuevoPaciente = {
      ...paciente,
      id: crypto.randomUUID(),
    };

    localStorage.setItem(
      'luqueSpinePacientes',
      JSON.stringify([...pacientesGuardados, nuevoPaciente])
    );

    history.push('/pacientes');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nuevo paciente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Datos personales</h2>

        <IonList>
          <IonItem>
            <IonInput
              label="Nombre completo"
              labelPlacement="stacked"
              placeholder="Escriba el nombre"
              value={paciente.nombre}
              onIonInput={(e) =>
                actualizarCampo('nombre', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonCheckbox
              slot="start"
              checked={paciente.ocultarNombre}
              onIonChange={(e) =>
                actualizarCampo('ocultarNombre', e.detail.checked)
              }
            />
            <IonLabel>Ocultar nombre en informes de investigación</IonLabel>
          </IonItem>

          <IonItem>
            <IonInput
              label="Edad"
              labelPlacement="stacked"
              type="number"
              placeholder="Ejemplo: 58"
              value={paciente.edad}
              onIonInput={(e) =>
                actualizarCampo('edad', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="Sexo"
              labelPlacement="stacked"
              placeholder="Seleccione"
              value={paciente.sexo}
              onIonChange={(e) =>
                actualizarCampo('sexo', e.detail.value)
              }
            >
              <IonSelectOption value="masculino">
                Masculino
              </IonSelectOption>
              <IonSelectOption value="femenino">
                Femenino
              </IonSelectOption>
              <IonSelectOption value="otro">
                Otro
              </IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              label="Teléfono"
              labelPlacement="stacked"
              type="tel"
              placeholder="Número de contacto"
              value={paciente.telefono}
              onIonInput={(e) =>
                actualizarCampo('telefono', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Historia clínica"
              labelPlacement="stacked"
              placeholder="Número de ficha"
              value={paciente.historiaClinica}
              onIonInput={(e) =>
                actualizarCampo('historiaClinica', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Seguro médico / OS"
              labelPlacement="stacked"
              placeholder="Nombre del seguro"
              value={paciente.seguro}
              onIonInput={(e) =>
                actualizarCampo('seguro', e.detail.value ?? '')
              }
            />
          </IonItem>
        </IonList>

        <h2>Clínica y diagnóstico</h2>

        <IonList>
          <IonItem>
            <IonTextarea
              label="Clínica"
              labelPlacement="stacked"
              placeholder="Síntomas y hallazgos clínicos"
              autoGrow
              value={paciente.clinica}
              onIonInput={(e) =>
                actualizarCampo('clinica', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Diagnóstico por TAC"
              labelPlacement="stacked"
              placeholder="Hallazgos tomográficos"
              autoGrow
              value={paciente.tac}
              onIonInput={(e) =>
                actualizarCampo('tac', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Diagnóstico por RMN"
              labelPlacement="stacked"
              placeholder="Hallazgos de resonancia"
              autoGrow
              value={paciente.rmn}
              onIonInput={(e) =>
                actualizarCampo('rmn', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Diagnóstico principal"
              labelPlacement="stacked"
              placeholder="Ejemplo: estenosis lumbar L4-L5"
              value={paciente.diagnostico}
              onIonInput={(e) =>
                actualizarCampo('diagnostico', e.detail.value ?? '')
              }
            />
          </IonItem>
        </IonList>

        <h2>Cirugía</h2>

        <IonList>
          <IonItem>
            <IonInput
              label="Fecha de cirugía"
              labelPlacement="stacked"
              type="date"
              value={paciente.fechaCirugia}
              onIonInput={(e) =>
                actualizarCampo('fechaCirugia', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Técnica quirúrgica"
              labelPlacement="stacked"
              placeholder="Ejemplo: TLIF MIS"
              value={paciente.tecnica}
              onIonInput={(e) =>
                actualizarCampo('tecnica', e.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Niveles"
              labelPlacement="stacked"
              placeholder="Ejemplo: L4-L5"
              value={paciente.niveles}
              onIonInput={(e) =>
                actualizarCampo('niveles', e.detail.value ?? '')
              }
            />
          </IonItem>
        </IonList>

        <IonButton
          expand="block"
          size="large"
          onClick={guardarPaciente}
        >
          Guardar paciente
        </IonButton>

        <IonToast
          isOpen={mostrarAviso}
          message="Debe escribir el nombre del paciente."
          duration={2500}
          onDidDismiss={() => setMostrarAviso(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default PatientFormPage;