 import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonToggle,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSelect,
  IonSelectOption,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

import {
  addCircleOutline,
  personCircleOutline,
} from 'ionicons/icons';

import { useMemo, useState } from 'react';

import EmptyState from '../components/EmptyState';

import {
  Patient,
  PatientSex,
} from '../models/patient';

import { ResearchProject } from '../models/researchProject';

 import {
  getPatients,
  obtenerSeguimientosPendientes,
} from '../services/patientStorage';
import { getResearchProjects } from '../services/researchProjectStorage';

type FiltroSexo =
  | 'todos'
  | PatientSex;

const PatientsPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
   const [orden, setOrden] =
  useState<'nombre' | 'fecha' | 'cirugia'>('nombre');
  const [soloPendientes, setSoloPendientes] =
  useState(false);

  const [filtroSexo, setFiltroSexo] =
    useState<FiltroSexo>('todos');

  const [filtroProyecto, setFiltroProyecto] =
    useState<string>('todos');

  const [pacientes, setPacientes] =
    useState<Patient[]>([]);

  const [proyectos, setProyectos] =
    useState<ResearchProject[]>([]);

  useIonViewWillEnter(() => {
    setPacientes(getPatients());
    setProyectos(getResearchProjects());
  });
   const pacientesFiltrados = useMemo(() => {
  const texto = busqueda
    .trim()
    .toLowerCase();

  const filtrados = pacientes.filter((paciente) => {
    const nombre =
      paciente.nombre?.toLowerCase() ?? '';

    const historiaClinica =
      paciente.historiaClinica?.toLowerCase() ?? '';

    const diagnostico =
      paciente.diagnostico?.toLowerCase() ?? '';

    const coincideBusqueda =
      !texto ||
      nombre.includes(texto) ||
      historiaClinica.includes(texto) ||
      diagnostico.includes(texto);

    const coincideSexo =
      filtroSexo === 'todos' ||
      paciente.sexo === filtroSexo;

    const coincideProyecto =
      filtroProyecto === 'todos' ||
      proyectos.some(
        (proyecto) =>
          proyecto.id === filtroProyecto &&
          proyecto.patientIds.includes(paciente.id)
      );

     const tienePendientes =
  obtenerSeguimientosPendientes([paciente]).length > 0;

    const coincidePendientes =
      !soloPendientes || tienePendientes;

    return (
      coincideBusqueda &&
      coincideSexo &&
      coincideProyecto &&
      coincidePendientes
    );
  });

  return [...filtrados].sort((a, b) => {
    if (orden === 'nombre') {
      return a.nombre.localeCompare(
        b.nombre,
        'es',
        { sensitivity: 'base' }
      );
    }

    if (orden === 'cirugia') {
      const fechaA = a.fechaCirugia
        ? new Date(a.fechaCirugia).getTime()
        : 0;

      const fechaB = b.fechaCirugia
        ? new Date(b.fechaCirugia).getTime()
        : 0;

      return fechaB - fechaA;
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });
}, [
  pacientes,
  proyectos,
  busqueda,
  filtroSexo,
  filtroProyecto,
  orden,
  soloPendientes,
]);

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
          <IonIcon
            slot="start"
            icon={addCircleOutline}
          />

          Nuevo paciente
        </IonButton>
        <IonButton
  expand="block"
  fill="outline"
  routerLink="/estadisticas"
>
  Estadísticas
</IonButton>

        <IonSearchbar
          value={busqueda}
          onIonInput={(event) =>
            setBusqueda(
              event.detail.value ?? ''
            )
          }
          placeholder="Buscar por nombre, HC o diagnóstico"
        />

        <IonSegment
          value={filtroSexo}
          scrollable
          onIonChange={(event) =>
            setFiltroSexo(
              event.detail.value as FiltroSexo
            )
          }
        >
          <IonSegmentButton value="todos">
            <IonLabel>Todos</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="masculino">
            <IonLabel>Masculino</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="femenino">
            <IonLabel>Femenino</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="otro">
            <IonLabel>Otro</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">
            Proyecto de investigación
          </IonLabel>

          <IonSelect
            value={filtroProyecto}
            interface="popover"
            onIonChange={(event) =>
              setFiltroProyecto(
                event.detail.value
              )
            }
          >
            <IonSelectOption value="todos">
              Todos los proyectos
            </IonSelectOption>

            {proyectos.map((proyecto) => (
              <IonSelectOption
                key={proyecto.id}
                value={proyecto.id}
              >
                {proyecto.nombre}
              </IonSelectOption>
            
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
  <IonLabel position="stacked">
    Ordenar pacientes
  </IonLabel>

  <IonSelect
    value={orden}
    interface="popover"
    onIonChange={(event) =>
      setOrden(event.detail.value)
    }
  >
    <IonSelectOption value="nombre">
      Nombre A–Z
    </IonSelectOption>

    <IonSelectOption value="fecha">
      Más recientes primero
    </IonSelectOption>
    <IonSelectOption value="cirugia">
  Fecha de cirugía
</IonSelectOption>
  </IonSelect>
</IonItem>
<IonItem>
  <IonLabel>
    Solo pacientes con seguimiento pendiente
  </IonLabel>

  <IonToggle
    slot="end"
    checked={soloPendientes}
    onIonChange={(event) =>
      setSoloPendientes(event.detail.checked)
    }
  />
</IonItem>
        <div className="ion-padding-top">
          <IonLabel>
            Pacientes encontrados:{' '}
            <strong>
              {pacientesFiltrados.length}
            </strong>
          </IonLabel>
        </div>

        {pacientesFiltrados.length === 0 ? (
          <EmptyState
            title="No se encontraron pacientes"
            message="Prueba cambiando la búsqueda o los filtros."
          />
        ) : (
          <IonList>

            {pacientesFiltrados.map(
              (paciente) => (
                <IonItem
                  key={paciente.id}
                  button
                  detail
                  routerLink={`/pacientes/${paciente.id}`}
                >
                  <IonIcon
                    slot="start"
                    icon={personCircleOutline}
                  />

                  <IonLabel className="ion-text-wrap">

                    <h2>
                      {paciente.nombre}
                    </h2>

                    <p>
                      {paciente.edad
                        ? `${paciente.edad} años`
                        : 'Edad no registrada'}

                      {' · '}

                      {paciente.diagnostico ||
                        'Sin diagnóstico'}
                    </p>

                    <p>
                      Sexo:{' '}
                      {paciente.sexo ||
                        'No registrado'}
                    </p>

                    {paciente.historiaClinica && (
                      <p>
                        HC:{' '}
                        {paciente.historiaClinica}
                      </p>
                    )}
                     <div
  style={{
    marginTop: '8px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  }}
>
  {[
    ['Preop', paciente.escalas.preoperatorio],
    ['Alta', paciente.escalas.alta],
    ['1 mes', paciente.escalas['1_mes']],
    ['3 meses', paciente.escalas['3_meses']],
    ['6 meses', paciente.escalas['6_meses']],
    ['12 meses', paciente.escalas['12_meses']],
  ].map(([label, resultado]) => {
    const completo =
      resultado.vas !== null ||
      resultado.odi !== null;

    return (
      <span
        key={label}
        style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
         border: completo
  ? '1px solid var(--ion-color-success)'
  : '1px solid var(--ion-color-medium)',

color: completo
  ? 'var(--ion-color-success)'
  : 'var(--ion-color-medium)',

background: completo
  ? 'rgba(var(--ion-color-success-rgb), 0.10)'
  : 'rgba(var(--ion-color-medium-rgb), 0.10)',
        }}
      >
        {label} {completo ? '✓' : 'Pendiente'}
      </span>
    );
  })}
</div>
{(() => {
  const controles = [
    ['Preoperatorio', paciente.escalas.preoperatorio],
    ['Alta', paciente.escalas.alta],
    ['1 mes', paciente.escalas['1_mes']],
    ['3 meses', paciente.escalas['3_meses']],
    ['6 meses', paciente.escalas['6_meses']],
    ['12 meses', paciente.escalas['12_meses']],
  ] as const;

  const proximoPendiente = controles.find(
    ([, resultado]) =>
      resultado.vas === null &&
      resultado.odi === null
  );

  return (
    <p style={{ marginTop: '8px' }}>
      <strong>Próximo control pendiente:</strong>{' '}
      {proximoPendiente
        ? proximoPendiente[0]
        : 'Seguimiento completo'}
    </p>
  );
})()}

                  </IonLabel>
                </IonItem>
              )
            )}

          </IonList>
        )}

      </IonContent>
    </IonPage>
  );
};

export default PatientsPage;