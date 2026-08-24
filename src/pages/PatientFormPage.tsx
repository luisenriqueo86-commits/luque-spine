import {
  IonButton, IonCheckbox, IonContent, IonHeader, IonInput, IonItem,
  IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTextarea,
  IonTitle, IonToast, IonToolbar
} from '@ionic/react';
 import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import SectionTitle from '../components/SectionTitle';
import { emptyPatientDraft, PatientDraft } from '../models/patient';
 import {
  createPatient,
  getPatients,
  updatePatient,
} from '../services/patientStorage';

const PatientFormPage: React.FC = () => {
  const history = useHistory();
    const { id } = useParams<{ id?: string }>();
  const modoEdicion = Boolean(id);
  const [paciente, setPaciente] = useState<PatientDraft>(emptyPatientDraft);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  useEffect(() => {
  if (!id) return;

  const pacienteExistente = getPatients().find(
    (item) => item.id === id
  );

  if (!pacienteExistente) return;

  const {
    id: _id,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...datosPaciente
  } = pacienteExistente;

  setPaciente(datosPaciente);
}, [id]);

  const actualizarCampo = <K extends keyof PatientDraft>(
    campo: K,
    valor: PatientDraft[K]
  ) => setPaciente((anterior) => ({ ...anterior, [campo]: valor }));

 const guardarPaciente = () => {
  if (!paciente.nombre.trim()) {
    setMostrarAviso(true);
    return;
  }

  if (modoEdicion && id) {
    const pacienteExistente = getPatients().find(
      (item) => item.id === id
    );

    if (!pacienteExistente) {
      return;
    }

    updatePatient({
      ...pacienteExistente,
      ...paciente,
      id: pacienteExistente.id,
      createdAt: pacienteExistente.createdAt,
      updatedAt: pacienteExistente.updatedAt,
    });

    history.replace(`/pacientes/${id}`);
    return;
  }

  createPatient(paciente);
  history.replace('/pacientes');
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
  <IonTitle>
    {modoEdicion ? 'Editar paciente' : 'Nuevo paciente'}
  </IonTitle>
</IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <SectionTitle>Datos personales</SectionTitle>
        <IonList>
          <IonItem>
            <IonInput
              label="Nombre completo"
              labelPlacement="stacked"
              placeholder="Escriba el nombre"
              value={paciente.nombre}
              onIonInput={(e) => actualizarCampo('nombre', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonCheckbox
              slot="start"
              checked={paciente.ocultarNombre}
              onIonChange={(e) => actualizarCampo('ocultarNombre', e.detail.checked)}
            />
            <IonLabel>Ocultar nombre en informes de investigación</IonLabel>
          </IonItem>

          <IonItem>
            <IonInput
              label="Edad"
              labelPlacement="stacked"
              type="number"
              value={paciente.edad}
              onIonInput={(e) => actualizarCampo('edad', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="Sexo"
              labelPlacement="stacked"
              placeholder="Seleccione"
              value={paciente.sexo}
              onIonChange={(e) => actualizarCampo('sexo', e.detail.value)}
            >
              <IonSelectOption value="masculino">Masculino</IonSelectOption>
              <IonSelectOption value="femenino">Femenino</IonSelectOption>
              <IonSelectOption value="otro">Otro</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              label="Teléfono"
              labelPlacement="stacked"
              type="tel"
              value={paciente.telefono}
              onIonInput={(e) => actualizarCampo('telefono', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Historia clínica"
              labelPlacement="stacked"
              value={paciente.historiaClinica}
              onIonInput={(e) => actualizarCampo('historiaClinica', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Seguro médico / OS"
              labelPlacement="stacked"
              value={paciente.seguro}
              onIonInput={(e) => actualizarCampo('seguro', e.detail.value ?? '')}
            />
          </IonItem>
        </IonList>

        <SectionTitle>Clínica y diagnóstico</SectionTitle>
        <IonList>
          <IonItem>
            <IonTextarea
              label="Clínica"
              labelPlacement="stacked"
              autoGrow
              value={paciente.clinica}
              onIonInput={(e) => actualizarCampo('clinica', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Diagnóstico por TAC"
              labelPlacement="stacked"
              autoGrow
              value={paciente.tac}
              onIonInput={(e) => actualizarCampo('tac', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Diagnóstico por RMN"
              labelPlacement="stacked"
              autoGrow
              value={paciente.rmn}
              onIonInput={(e) => actualizarCampo('rmn', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Diagnóstico principal"
              labelPlacement="stacked"
              value={paciente.diagnostico}
              onIonInput={(e) => actualizarCampo('diagnostico', e.detail.value ?? '')}
            />
          </IonItem>
        </IonList>

        <SectionTitle>Cirugía</SectionTitle>
        <IonList>
          <IonItem>
            <IonInput
              label="Fecha de cirugía"
              labelPlacement="stacked"
              type="date"
              value={paciente.fechaCirugia}
              onIonInput={(e) => actualizarCampo('fechaCirugia', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Técnica quirúrgica"
              labelPlacement="stacked"
              value={paciente.tecnica}
              onIonInput={(e) => actualizarCampo('tecnica', e.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Niveles"
              labelPlacement="stacked"
              value={paciente.niveles}
              onIonInput={(e) => actualizarCampo('niveles', e.detail.value ?? '')}
            />
          </IonItem>
        </IonList>

        <IonButton
  expand="block"
  size="large"
  onClick={guardarPaciente}
>
  {modoEdicion
    ? 'Guardar cambios'
    : 'Guardar paciente'}
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
