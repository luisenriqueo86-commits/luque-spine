import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
IonCardContent,
IonCardHeader,
IonCardTitle,
IonGrid,
IonRow,
IonCol,
IonSelect,
IonSelectOption,
IonItem,
IonLabel,
 

} from '@ionic/react';
 import { useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

import { Patient } from '../models/patient';
import { getPatients } from '../services/patientStorage';
import { getResearchProjects } from '../services/researchProjectStorage';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const PatientStatisticsPage: React.FC = () => {
 const [pacientes, setPacientes] = useState<Patient[]>(
  () => getPatients()
);
useIonViewWillEnter(() => {
  setPacientes(getPatients());
});
const [proyectos] = useState(
  () => getResearchProjects()
);
const [proyectoSeleccionado, setProyectoSeleccionado] =
  useState<string>('todos');
  const pacientesFiltrados =
  proyectoSeleccionado === 'todos'
    ? pacientes
    : pacientes.filter((paciente) => {
        const proyecto = proyectos.find(
          (proyecto) =>
            proyecto.id === proyectoSeleccionado
        );

        return proyecto?.patientIds.includes(
          paciente.id
        );
      });
 const totalPacientes = pacientesFiltrados.length;

 const masculinos = pacientesFiltrados.filter(
  (paciente) => paciente.sexo === 'masculino'
).length;

 const femeninos = pacientesFiltrados.filter(
  (paciente) => paciente.sexo === 'femenino'
).length;

 const edadesValidas = pacientesFiltrados
  .map((paciente) => Number(paciente.edad))
  .filter((edad) => !Number.isNaN(edad) && edad > 0);

const edadPromedio =
  edadesValidas.length > 0
    ? (
        edadesValidas.reduce(
          (suma, edad) => suma + edad,
          0
        ) / edadesValidas.length
      ).toFixed(1)
    : '—';
    const pacientesPorProyecto = proyectos.map((proyecto) => ({
  id: proyecto.id,
  nombre: proyecto.nombre,
  cantidad: proyecto.patientIds.length,
}));
 const pacientesPorDiagnostico = pacientesFiltrados.reduce<
  Record<string, number>
>((acumulador, paciente) => {
  const diagnostico =
    paciente.diagnostico?.trim() || 'Sin diagnóstico';

  acumulador[diagnostico] =
    (acumulador[diagnostico] || 0) + 1;

  return acumulador;
}, {});
 const cirugiasPorMes = pacientesFiltrados.reduce<
  Record<string, number>
>((acumulador, paciente) => {

  if (!paciente.fechaCirugia) {
    return acumulador;
  }

  const fecha = new Date(
    `${paciente.fechaCirugia}T00:00:00`
  );

  if (Number.isNaN(fecha.getTime())) {
    return acumulador;
  }

  const mes = fecha.toLocaleDateString(
    'es-PY',
    {
      month: 'long',
      year: 'numeric',
    }
  );

  acumulador[mes] =
    (acumulador[mes] || 0) + 1;

  return acumulador;

}, {});
const momentosSeguimiento = [
  { key: 'preoperatorio', nombre: 'Preoperatorio' },
  { key: 'alta', nombre: 'Alta' },
  { key: '1_mes', nombre: '1 mes' },
  { key: '3_meses', nombre: '3 meses' },
  { key: '6_meses', nombre: '6 meses' },
  { key: '12_meses', nombre: '12 meses' },
] as const;
 const promediosSeguimiento = momentosSeguimiento.map(
  (momento) => {
    const valoresVAS = pacientesFiltrados
      .map(
        (paciente) =>
          paciente.escalas[momento.key]?.vas
      )
      .filter(
        (valor): valor is number =>
          typeof valor === 'number'
      );

    const valoresODI = pacientesFiltrados
      .map(
        (paciente) =>
          paciente.escalas[momento.key]?.odi
      )
      .filter(
        (valor): valor is number =>
          typeof valor === 'number'
      );

    const promedioVAS =
      valoresVAS.length > 0
        ? (
            valoresVAS.reduce(
              (suma, valor) => suma + valor,
              0
            ) / valoresVAS.length
          ).toFixed(1)
        : '—';

    const promedioODI =
      valoresODI.length > 0
        ? (
            valoresODI.reduce(
              (suma, valor) => suma + valor,
              0
            ) / valoresODI.length
          ).toFixed(1)
        : '—';

    return {
      momento: momento.nombre,
      vas: promedioVAS,
      odi: promedioODI,
      nVAS: valoresVAS.length,
      nODI: valoresODI.length,
    };
  }
);
const porcentajeSeguimiento = promediosSeguimiento.map(
  (resultado) => {
    const totalConDato = Math.max(
      resultado.nVAS,
      resultado.nODI
    );

    const porcentaje =
      totalPacientes > 0
        ? (totalConDato / totalPacientes) * 100
        : 0;

    return {
      momento: resultado.momento,
      porcentaje: porcentaje.toFixed(1),
      n: totalConDato,
    };
  }
);
 const vasPreoperatorio = promediosSeguimiento[0]?.vas;

const mejoriaVAS = promediosSeguimiento.map((resultado) => {
  if (
    vasPreoperatorio === '—' ||
    resultado.vas === '—' ||
    Number(vasPreoperatorio) === 0
  ) {
    return '—';
  }

  const porcentaje =
    ((Number(vasPreoperatorio) - Number(resultado.vas)) /
      Number(vasPreoperatorio)) *
    100;

  return porcentaje.toFixed(1);
});

const odiPreoperatorio = promediosSeguimiento[0]?.odi;

const mejoriaODI = promediosSeguimiento.map((resultado) => {
  if (
    odiPreoperatorio === '—' ||
    resultado.odi === '—' ||
    Number(odiPreoperatorio) === 0
  ) {
    return '—';
  }

  const porcentaje =
    ((Number(odiPreoperatorio) - Number(resultado.odi)) /
      Number(odiPreoperatorio)) *
    100;

  return porcentaje.toFixed(1);
});
const datosVAS = {
 labels: promediosSeguimiento.map(
  (resultado) =>
    `${resultado.momento} (n=${resultado.nVAS})`
),
  datasets: [
    {
      label: 'VAS promedio',
      data: promediosSeguimiento.map(
        (resultado) =>
          resultado.vas === '—'
            ? null
            : Number(resultado.vas)
      ),
      tension: 0.3,
    },
  ],
};
const datosCirugiasPorMes = {
  labels: Object.keys(cirugiasPorMes),
  datasets: [
    {
      label: 'Cirugías',
      data: Object.values(cirugiasPorMes),
    },
  ],
};
const datosODI = {
   labels: promediosSeguimiento.map(
  (resultado) =>
    `${resultado.momento} (n=${resultado.nODI})`
),
  datasets: [
    {
      label: 'ODI promedio',
      data: promediosSeguimiento.map(
        (resultado) =>
          resultado.odi === '—'
            ? null
            : Number(resultado.odi)
      ),
      tension: 0.3,
    },
  ],
};
const opcionesCirugias = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      title: {
        display: true,
        text: 'Número de cirugías',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Mes',
      },
    },
  },
};
const opcionesVAS = {
  responsive: true,
  maintainAspectRatio: true,
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
};
const opcionesODI = {
  responsive: true,
  maintainAspectRatio: true,
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
};
  return (
   <IonPage>
  <IonHeader>
    <IonToolbar>
      <IonTitle>Estadísticas</IonTitle>
    </IonToolbar>
  </IonHeader>

  <IonContent className="ion-padding">
    <h2>Estadísticas de pacientes</h2>
    <IonCard>
  <IonCardContent>

    <IonItem>
      <IonLabel position="stacked">
        Proyecto de investigación
      </IonLabel>

      <IonSelect
        value={proyectoSeleccionado}
        onIonChange={(e) =>
          setProyectoSeleccionado(e.detail.value)
        }
      >

        <IonSelectOption value="todos">
          Todos los pacientes
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

  </IonCardContent>
</IonCard>

    <IonGrid>

      {/* ESTADÍSTICAS GENERALES */}

      <IonRow>

        <IonCol size="12" sizeMd="6">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Total de pacientes
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <h1>{totalPacientes}</h1>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol size="12" sizeMd="6">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Edad promedio
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <h1>
                {edadPromedio !== '—'
                  ? `${edadPromedio} años`
                  : '—'}
              </h1>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol size="12" sizeMd="6">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Masculinos
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <h1>{masculinos}</h1>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol size="12" sizeMd="6">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Femeninos
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <h1>{femeninos}</h1>
            </IonCardContent>
          </IonCard>
        </IonCol>

      </IonRow>


      {/* PACIENTES POR PROYECTO */}

      <IonRow>
        <IonCol size="12">

          <IonCard>

            <IonCardHeader>
              <IonCardTitle>
                Pacientes por proyecto
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>

              {pacientesPorProyecto.length === 0 ? (
                <p>No hay proyectos registrados.</p>
              ) : (
                pacientesPorProyecto.map((proyecto) => (

                  <div
                    key={proyecto.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      borderBottom: '1px solid #ddd',
                      paddingBottom: '8px',
                    }}
                  >

                    <strong>
                      {proyecto.nombre}
                    </strong>

                    <span>
                      {proyecto.cantidad}{' '}
                      {proyecto.cantidad === 1
                        ? 'paciente'
                        : 'pacientes'}
                    </span>

                  </div>

                ))
              )}

            </IonCardContent>

          </IonCard>

        </IonCol>
      </IonRow>


     {/* PACIENTES POR DIAGNÓSTICO */}

<IonRow>
  <IonCol size="12">

    <IonCard>

      <IonCardHeader>
        <IonCardTitle>
          Pacientes por diagnóstico
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>

        {Object.entries(
          pacientesPorDiagnostico
        ).length === 0 ? (

          <p>
            No hay pacientes registrados.
          </p>

        ) : (

          Object.entries(
            pacientesPorDiagnostico
          ).map(([diagnostico, cantidad]) => (

            <div
              key={diagnostico}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                borderBottom: '1px solid #ddd',
                paddingBottom: '8px',
              }}
            >

              <strong>
                {diagnostico}
              </strong>

              <span>
                {cantidad}{' '}
                {cantidad === 1
                  ? 'paciente'
                  : 'pacientes'}
              </span>

            </div>

          ))

        )}

      </IonCardContent>

    </IonCard>

  </IonCol>
</IonRow>


{/* CIRUGÍAS POR MES */}

<IonRow>
  <IonCol size="12">

    <IonCard>

      <IonCardHeader>
        <IonCardTitle>
          Cirugías por mes
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>

        {Object.entries(cirugiasPorMes).length === 0 ? (

          <p>
            No hay cirugías registradas.
          </p>

        ) : (

          Object.entries(cirugiasPorMes).map(
            ([mes, cantidad]) => (

              <div
                key={mes}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '8px',
                }}
              >

                <strong>
                  {mes}
                </strong>

                <span>
                  {cantidad}{' '}
                  {cantidad === 1
                    ? 'cirugía'
                    : 'cirugías'}
                </span>

              </div>

            )
          )

        )}
 <div style={{ height: '320px' }}>
  <Bar
    data={datosCirugiasPorMes}
    options={opcionesCirugias}
  />
</div>

      </IonCardContent>

    </IonCard>

  </IonCol>
</IonRow>
{/* VAS Y ODI PROMEDIO */}

<IonRow>
  <IonCol size="12">

    <IonCard>

      <IonCardHeader>
        <IonCardTitle>
          Evolución promedio VAS / ODI

        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>

         {promediosSeguimiento.map((resultado, index) => (

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

    <strong>
      {resultado.momento}
    </strong>

    <span>
      VAS: {resultado.vas}
      {resultado.nVAS > 0
        ? ` (n=${resultado.nVAS})`
        : ''}
      {mejoriaVAS[index] !== '—'
        ? ` | Mejoría: ${mejoriaVAS[index]}%`
        : ''}
    </span>

     <span>
  ODI: {resultado.odi}
  {resultado.nODI > 0
    ? ` (n=${resultado.nODI})`
    : ''}
  {mejoriaODI[index] !== '—'
    ? ` | Mejoría: ${mejoriaODI[index]}%`
    : ''}
</span>

  </div>

))}
 

      </IonCardContent>

    </IonCard>

  </IonCol>
</IonRow>
{/* GRÁFICOS VAS Y ODI */}

<IonRow>

  <IonCol size="12" sizeMd="6">

    <IonCard>

      <IonCardHeader>
        <IonCardTitle>
          Evolución VAS
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>

         <Line
  data={datosVAS}
  options={opcionesVAS}
/>

      </IonCardContent>

    </IonCard>

  </IonCol>


  <IonCol size="12" sizeMd="6">

    <IonCard>

      <IonCardHeader>
        <IonCardTitle>
          Evolución ODI
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>

         <Line
  data={datosODI}
  options={opcionesODI}
/>

      </IonCardContent>

    </IonCard>

  </IonCol>

</IonRow>

    </IonGrid>

  </IonContent>

</IonPage>
);
};

export default PatientStatisticsPage;