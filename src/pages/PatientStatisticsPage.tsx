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
IonProgressBar,
 

} from '@ionic/react';
 import { useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

import { Patient } from '../models/patient';
import { getPatients } from '../services/patientStorage';
import { getResearchProjects } from '../services/researchProjectStorage';
import { Line, Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
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
 const fechaActual = new Date();

 

const mesesDesdeCirugia = (fechaCirugia?: string) => {
  if (!fechaCirugia) {
    return null;
  }

  const fecha = new Date(`${fechaCirugia}T00:00:00`);

  if (Number.isNaN(fecha.getTime())) {
    return null;
  }

  const meses =
  (fechaActual.getFullYear() - fecha.getFullYear()) * 12 +
  (fechaActual.getMonth() - fecha.getMonth());

  return meses;
};
const seguimientoEsperado = [
  { nombre: '1 mes', meses: 1 },
  { nombre: '3 meses', meses: 3 },
  { nombre: '6 meses', meses: 6 },
  { nombre: '12 meses', meses: 12 },
].map((seguimiento) => {
  const pacientesEsperados = pacientesFiltrados.filter(
    (paciente) => {
      const meses = mesesDesdeCirugia(
        paciente.fechaCirugia
      );

      return (
        meses !== null &&
        meses >= seguimiento.meses
      );
    }
  ).length;

  return {
    momento: seguimiento.nombre,
    esperados: pacientesEsperados,
  };
});
const cumplimientoSeguimiento = seguimientoEsperado.map(
  (seguimiento) => {
    const resultado = promediosSeguimiento.find(
      (item) => item.momento === seguimiento.momento
    );

    const realizados = resultado
      ? Math.max(resultado.nVAS, resultado.nODI)
      : 0;

    const porcentaje =
      seguimiento.esperados > 0
        ? (realizados / seguimiento.esperados) * 100
        : null;

    return {
      momento: seguimiento.momento,
      esperados: seguimiento.esperados,
      realizados,
      porcentaje:
        porcentaje !== null
          ? porcentaje.toFixed(1)
          : '—',
    };
  }
);
const seguimientosPendientes = cumplimientoSeguimiento.map(
  (seguimiento) => ({
    momento: seguimiento.momento,
    pendientes: Math.max(
      seguimiento.esperados - seguimiento.realizados,
      0
    ),
  })
);
const totalSeguimientosPendientes =
  seguimientosPendientes.reduce(
    (suma, seguimiento) =>
      suma + seguimiento.pendientes,
    0
  );
 const pacientesConSeguimientosPendientes =
  pacientesFiltrados.flatMap((paciente) => {
    const meses = mesesDesdeCirugia(
      paciente.fechaCirugia
    );

    if (meses === null) {
      return [];
    }

    const controles = [
      { key: '1_mes', nombre: '1 mes', meses: 1 },
      { key: '3_meses', nombre: '3 meses', meses: 3 },
      { key: '6_meses', nombre: '6 meses', meses: 6 },
      { key: '12_meses', nombre: '12 meses', meses: 12 },
    ] as const;

    return controles
      .filter((control) => {
        if (meses < control.meses) {
          return false;
        }

        const escala =
          paciente.escalas[control.key];

        const tieneVAS =
          typeof escala?.vas === 'number';

        const tieneODI =
          typeof escala?.odi === 'number';

        return !tieneVAS && !tieneODI;
      })
      .map((control) => ({
        pacienteId: paciente.id,
        pacienteNombre:
          paciente.nombre || 'Sin nombre',
        momento: control.nombre,
      }));
  });
  const pacientesPendientesOrdenados = [
  ...pacientesConSeguimientosPendientes,
].sort((a, b) => {
  const orden: Record<string, number> = {
    '12 meses': 4,
    '6 meses': 3,
    '3 meses': 2,
    '1 mes': 1,
  };

  return (
    (orden[b.momento] || 0) -
    (orden[a.momento] || 0)
  );
});
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
 <hr style={{ margin: '20px 0' }} />

<h3>Cumplimiento del seguimiento</h3>

{cumplimientoSeguimiento.map((resultado) => (
  <div
    key={resultado.momento}
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: '10px',
      padding: '8px 0',
      borderBottom: '1px solid #ddd',
    }}
  >
    <strong>{resultado.momento}</strong>

    <span>
      Esperados: {resultado.esperados}
    </span>

    <span>
      Realizados: {resultado.realizados}
    </span>

     <div>
  <span>
    Cumplimiento: {resultado.porcentaje}
    {resultado.porcentaje !== '—' ? '%' : ''}
  </span>

  {resultado.porcentaje !== '—' && (
    <IonProgressBar
      value={Number(resultado.porcentaje) / 100}
      style={{ marginTop: '6px' }}
    />
  )}
 </div>

</div>

))}

      </IonCardContent>

    </IonCard>

  </IonCol>
</IonRow>
{/* SEGUIMIENTOS PENDIENTES */}

<IonRow>
  <IonCol size="12">
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          Seguimientos pendientes
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <h2 style={{ marginTop: 0 }}>
  Total pendientes: {totalSeguimientosPendientes}
</h2>
 {totalSeguimientosPendientes > 0 && (
  <div
     style={{
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '12px',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #ddd',
}}
  >
    <strong>
      ⚠ Hay seguimientos pendientes
    </strong>
  </div>
)}
{totalSeguimientosPendientes > 0 && (
  <p>
    ⚠ Hay seguimientos pendientes
  </p>
)}
        {seguimientosPendientes.map((resultado) => (
          <div
            key={resultado.momento}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #ddd',
            }}
          >
            <strong>{resultado.momento}</strong>

            <span>
              {resultado.pendientes}{' '}
              {resultado.pendientes === 1
                ? 'paciente pendiente'
                : 'pacientes pendientes'}
            </span>
          </div>
        ))}
        <hr style={{ margin: '20px 0' }} />

<h3>Pacientes con controles pendientes</h3>

{pacientesConSeguimientosPendientes.length === 0 ? (
  <p>No hay pacientes con seguimientos pendientes.</p>
) : (
  pacientesPendientesOrdenados.map((item) => (
    <div
      key={`${item.pacienteId}-${item.momento}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #ddd',
      }}
    >
        <div>
  <strong
    style={{
      cursor: 'pointer',
      textDecoration: 'underline',
    }}
    onClick={() =>
      history.push(`/pacientes/${item.pacienteId}`)
    }
  >
    {item.pacienteNombre}
  </strong>

  <div
    style={{
      fontSize: '13px',
      marginTop: '4px',
      opacity: 0.7,
    }}
  >
    Abrir ficha del paciente
  </div>
</div>

      <span
  style={{
    fontWeight: 600,
    padding: '6px 10px',
    border: '1px solid #d97706',
    borderRadius: '8px',
    background: '#fff7ed',
    textAlign: 'center',
  }}
>
  Control: {item.momento}
</span>
    </div>
  ))
)}
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