 import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Patient } from '../models/patient';
import { ResearchProject } from '../models/researchProject';

import { getPatients } from '../services/patientStorage';

import {
  getResearchProjects,
  updateResearchProject,
} from '../services/researchProjectStorage';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RouteParams {
  id: string;
}

const ResearchProjectDetailPage: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [project, setProject] =
    useState<ResearchProject | null>(null);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  useEffect(() => {
    const encontrado = getResearchProjects().find(
      (item) => item.id === id
    );

    setProject(encontrado ?? null);
    setPatients(getPatients());
  }, [id]);

  const cambiarPaciente = (
    patientId: string,
    checked: boolean
  ) => {
    if (!project) return;

    const nuevosPatientIds = checked
      ? Array.from(
          new Set([
            ...project.patientIds,
            patientId,
          ])
        )
      : project.patientIds.filter(
          (idActual) => idActual !== patientId
        );

    setProject({
      ...project,
      patientIds: nuevosPatientIds,
    });
  };

   const guardarPacientes = () => {
  if (!project) return;

  const proyectoLimpio = {
    ...project,
    patientIds: patientIdsValidos,
  };

  const actualizado =
    updateResearchProject(proyectoLimpio);

  setProject(actualizado);
};
  if (!project) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/investigacion"
              />
            </IonButtons>

            <IonTitle>Proyecto</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <h2>Proyecto no encontrado</h2>
        </IonContent>
      </IonPage>
    );
  }

  const pacientesIncluidos = patients.filter(
    (patient) =>
      project.patientIds.includes(patient.id)
  );
  const edadesValidasProyecto = pacientesIncluidos
  .map((patient) => Number(patient.edad))
  .filter(
    (edad) =>
      !Number.isNaN(edad) &&
      edad > 0
  );

const edadPromedioProyecto =
  edadesValidasProyecto.length > 0
    ? (
        edadesValidasProyecto.reduce(
          (suma, edad) => suma + edad,
          0
        ) / edadesValidasProyecto.length
      ).toFixed(1)
    : '—';

const vasPreoperatorios = pacientesIncluidos
  .map(
    (patient) =>
      patient.escalas.preoperatorio.vas
  )
  .filter(
    (valor): valor is number =>
      typeof valor === 'number'
  );

const vasPreoperatorioPromedio =
  vasPreoperatorios.length > 0
    ? (
        vasPreoperatorios.reduce(
          (suma, valor) => suma + valor,
          0
        ) / vasPreoperatorios.length
      ).toFixed(1)
    : '—';

const odiPreoperatorios = pacientesIncluidos
  .map(
    (patient) =>
      patient.escalas.preoperatorio.odi
  )
  .filter(
    (valor): valor is number =>
      typeof valor === 'number'
  );

const odiPreoperatorioPromedio =
  odiPreoperatorios.length > 0
    ? (
        odiPreoperatorios.reduce(
          (suma, valor) => suma + valor,
          0
        ) / odiPreoperatorios.length
      ).toFixed(1)
    : '—';
    const momentosProyecto = [
  { key: 'preoperatorio', label: 'Preoperatorio' },
  { key: 'alta', label: 'Alta' },
  { key: '1_mes', label: '1 mes' },
  { key: '3_meses', label: '3 meses' },
  { key: '6_meses', label: '6 meses' },
  { key: '12_meses', label: '12 meses' },
] as const;

const evolucionProyecto = momentosProyecto.map(
  (momento) => {
    const valoresVAS = pacientesIncluidos
      .map(
        (patient) =>
          patient.escalas[momento.key].vas
      )
      .filter(
        (valor): valor is number =>
          typeof valor === 'number'
      );

    const valoresODI = pacientesIncluidos
      .map(
        (patient) =>
          patient.escalas[momento.key].odi
      )
      .filter(
        (valor): valor is number =>
          typeof valor === 'number'
      );

    const promedioVAS =
      valoresVAS.length > 0
        ? valoresVAS.reduce(
            (suma, valor) => suma + valor,
            0
          ) / valoresVAS.length
        : null;

    const promedioODI =
      valoresODI.length > 0
        ? valoresODI.reduce(
            (suma, valor) => suma + valor,
            0
          ) / valoresODI.length
        : null;

    return {
      momento: momento.label,
      vas: promedioVAS,
      odi: promedioODI,
      nVAS: valoresVAS.length,
      nODI: valoresODI.length,
    };
  }
);
const datosVASProyecto = {
  labels: evolucionProyecto.map(
    (resultado) =>
      `${resultado.momento} (n=${resultado.nVAS})`
  ),
  datasets: [
    {
      label: 'VAS promedio',
      data: evolucionProyecto.map(
        (resultado) => resultado.vas
      ),
      tension: 0.3,
    },
  ],
};

const datosODIProyecto = {
  labels: evolucionProyecto.map(
    (resultado) =>
      `${resultado.momento} (n=${resultado.nODI})`
  ),
  datasets: [
    {
      label: 'ODI promedio',
      data: evolucionProyecto.map(
        (resultado) => resultado.odi
      ),
      tension: 0.3,
    },
  ],
};
  const patientIdsValidos = project.patientIds.filter(
  (patientId) =>
    patients.some(
      (patient) => patient.id === patientId
    )
);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/investigacion"
            />
          </IonButtons>

          <IonTitle>{project.nombre}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Datos del proyecto
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>

              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <h3>Nombre</h3>
                  <p>{project.nombre}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <h3>Descripción</h3>
                  <p>
                    {project.descripcion ||
                      'Sin descripción'}
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h3>Fecha de inicio</h3>
                  <p>
                    {project.fechaInicio ||
                      'No registrada'}
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h3>Pacientes incluidos</h3>
                  <p>
                    {project.patientIds.length}
                  </p>
                </IonLabel>
              </IonItem>

            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonCard>
  <IonCardHeader>
    <IonCardTitle>
      Resumen del proyecto
    </IonCardTitle>
  </IonCardHeader>

  <IonCardContent>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
      }}
    >
      <div>
        <strong>Pacientes incluidos</strong>
        <h2>{pacientesIncluidos.length}</h2>
      </div>

      <div>
        <strong>Edad promedio</strong>
        <h2>
          {edadPromedioProyecto !== '—'
            ? `${edadPromedioProyecto} años`
            : '—'}
        </h2>
      </div>

      <div>
        <strong>VAS preoperatorio promedio</strong>
        <h2>{vasPreoperatorioPromedio}</h2>
      </div>

      <div>
        <strong>ODI preoperatorio promedio</strong>
        <h2>
          {odiPreoperatorioPromedio !== '—'
            ? `${odiPreoperatorioPromedio}%`
            : '—'}
        </h2>
      </div>
    </div>
  </IonCardContent>
</IonCard>
<IonCard>
  <IonCardHeader>
    <IonCardTitle>
      Evolución promedio del proyecto
    </IonCardTitle>
  </IonCardHeader>

  <IonCardContent>
    {evolucionProyecto.map((resultado) => (
      <div
        key={resultado.momento}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px',
          padding: '10px 0',
          borderBottom: '1px solid #ddd',
        }}
      >
        <strong>{resultado.momento}</strong>

        <span>
          VAS:{' '}
          {resultado.vas !== null
            ? resultado.vas.toFixed(1)
            : '—'}
          {resultado.nVAS > 0
            ? ` (n=${resultado.nVAS})`
            : ''}
        </span>

        <span>
          ODI:{' '}
          {resultado.odi !== null
            ? `${resultado.odi.toFixed(1)}%`
            : '—'}
          {resultado.nODI > 0
            ? ` (n=${resultado.nODI})`
            : ''}
        </span>
      </div>
    ))}
  </IonCardContent>
</IonCard>
<IonCard>
  <IonCardHeader>
    <IonCardTitle>
      Evolución VAS del proyecto
    </IonCardTitle>
  </IonCardHeader>

  <IonCardContent>
    <div
      style={{
        width: '100%',
        height: '360px',
      }}
    >
      <Line
        data={datosVASProyecto}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 1,
              },
              title: {
                display: true,
                text: 'VAS',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Seguimiento',
              },
            },
          },
        }}
      />
    </div>
  </IonCardContent>
</IonCard>
<IonCard>
  <IonCardHeader>
    <IonCardTitle>
      Evolución ODI del proyecto
    </IonCardTitle>
  </IonCardHeader>

  <IonCardContent>
    <div
      style={{
        width: '100%',
        height: '360px',
      }}
    >
      <Line
        data={datosODIProyecto}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                stepSize: 10,
              },
              title: {
                display: true,
                text: 'ODI (%)',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Seguimiento',
              },
            },
          },
        }}
      />
    </div>
  </IonCardContent>
</IonCard>
              Seleccionar pacientes
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

            {patients.length === 0 ? (
              <p>
                No hay pacientes registrados.
              </p>
            ) : (
              <IonList>
                {patients.map((patient) => (
                  <IonItem key={patient.id}>

                    <IonCheckbox
                      slot="start"
                      checked={project.patientIds.includes(
                        patient.id
                      )}
                      onIonChange={(event) =>
                        cambiarPaciente(
                          patient.id,
                          event.detail.checked
                        )
                      }
                    />

                    <IonLabel className="ion-text-wrap">
                      <h2>{patient.nombre}</h2>

                      <p>
                        {patient.edad
                          ? `${patient.edad} años`
                          : 'Edad no registrada'}
                      </p>

                      <p>
                        {patient.diagnostico ||
                          'Sin diagnóstico'}
                      </p>
                    </IonLabel>

                  </IonItem>
                ))}
              </IonList>
            )}

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={guardarPacientes}
            >
              Guardar pacientes del proyecto
            </IonButton>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Pacientes incluidos
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

            {pacientesIncluidos.length === 0 ? (
              <p>
                Todavía no hay pacientes incluidos.
              </p>
            ) : (
              <IonList>
                {pacientesIncluidos.map(
                  (patient, index) => (
                    <IonItem key={patient.id}>
                      <IonLabel className="ion-text-wrap">
                        <h2>
                          Paciente {index + 1}
                        </h2>

                        <p>
                          {patient.ocultarNombre
                            ? 'Paciente anonimizado'
                            : patient.nombre}
                        </p>

                        <p>
                          Diagnóstico:{' '}
                          {patient.diagnostico ||
                            'Sin registrar'}
                        </p>

                        <p>
                          Preoperatorio — VAS:{' '}
                          {patient.escalas.preoperatorio
                            .vas ?? 'Sin registrar'}
                          {' · '}
                          ODI:{' '}
                          {patient.escalas.preoperatorio
                            .odi !== null
                            ? `${patient.escalas.preoperatorio.odi}%`
                            : 'Sin registrar'}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )
                )}
              </IonList>
            )}

          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default ResearchProjectDetailPage;