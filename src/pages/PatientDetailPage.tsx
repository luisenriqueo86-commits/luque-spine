 import {
  IonAlert,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

  import { useEffect, useState } from 'react';
 import {
  useParams,
  useLocation,
} from 'react-router-dom';
import { jsPDF } from 'jspdf';
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

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import {
  FollowUpMoment,
  Patient,
  PatientScales,
} from '../models/patient';

 import {
  deletePatient,
  getPatients,
  updatePatientScales,
} from '../services/patientStorage';

type PatientSection =
  | 'datos'
  | 'diagnostico'
  | 'cirugia'
  | 'escalas'
  | 'seguimiento';

interface RouteParams {
  id: string;
}

const momentos: {
  key: FollowUpMoment;
  label: string;
}[] = [
  { key: 'preoperatorio', label: 'Preoperatorio' },
  { key: 'alta', label: 'Alta' },
  { key: '1_mes', label: '1 mes' },
  { key: '3_meses', label: '3 meses' },
  { key: '6_meses', label: '6 meses' },
  { key: '12_meses', label: '12 meses' },
];

const PatientDetailPage: React.FC = () => {
  const seccionesODI = [
  'Intensidad del dolor',
  'Cuidados personales',
  'Levantar peso',
  'Caminar',
  'Sentarse',
  'Estar de pie',
  'Dormir',
  'Vida sexual',
  'Vida social',
  'Viajar',];
  const opcionesODI = [
  [
    'Puedo tolerar el dolor sin necesidad de tomar analgésicos.',
    'El dolor es fuerte, pero aún así me arreglo sin tomar analgésico.',
    'Los analgésicos me alivian completamente el dolor.',
    'Los analgésicos me alivian un poco el dolor.',
    'Los analgésicos apenas me alivian el dolor.',
    'Los analgésicos no me quitan el dolor y no los tomo.',
  ],

  [
    'Me puedo ocupar de mí mismo normalmente, sin causar aumento del dolor.',
    'Me puedo ocupar de mí mismo normalmente, pero esto me aumenta el dolor.',
    'Lavarme, vestirme, etc. me produce dolor y tengo que hacerlo despacio y con cuidado.',
    'Necesito alguna ayuda, pero en general me valgo por mí mismo.',
    'Necesito ayuda para hacer la mayoría de las cosas.',
    'No me puedo vestir solo, me lavo con dificultad y suelo quedarme en la cama.',
  ],

  [
    'Puedo levantar objetos pesados sin aumento del dolor.',
    'Puedo levantar objetos pesados, pero aumenta el dolor.',
    'El dolor me impide levantar objetos pesados desde el suelo, pero puedo hacerlo si están en un sitio cómodo.',
    'El dolor me impide levantar objetos pesados, pero sí puedo levantar objetos ligeros o medianos si están en un sitio cómodo.',
    'Sólo puedo levantar pesos muy livianos.',
    'No puedo levantar ni llevar ningún objeto.',
  ],

  [
    'El dolor no me impide caminar.',
    'El dolor me impide caminar más de un kilómetro.',
    'El dolor me impide caminar más de 500 metros.',
    'El dolor me impide caminar más de 250 metros.',
    'Sólo puedo caminar con bastón o muletas.',
    'Estoy en cama casi todo el tiempo y debo arrastrarme para ir al baño.',
  ],

  [
    'Puedo sentarme el tiempo que quiera en cualquier tipo de asiento.',
    'Puedo sentarme el tiempo que quiera, solo en mi silla favorita.',
    'El dolor me impide estar sentado por más de una hora.',
    'El dolor me impide estar sentado por más de media hora.',
    'El dolor me impide estar sentado por más de diez minutos.',
    'El dolor me impide estar sentado.',
  ],

  [
    'Puedo permanecer parado tanto tiempo como quiera sin aumento del dolor.',
    'Puedo permanecer parado tanto tiempo como quiera pero aumenta el dolor.',
    'El dolor me impide estar de pie por más de una hora.',
    'El dolor me impide estar de pie por más de media hora.',
    'El dolor me impide estar de pie por más de diez minutos.',
    'El dolor me impide en absoluto estar de pie.',
  ],

  [
    'El dolor no me impide dormir bien.',
    'Sólo puedo dormir bien tomando pastillas.',
    'Incluso tomando pastillas duermo menos de seis horas.',
    'Incluso tomando pastillas duermo menos de cuatro horas.',
    'Incluso tomando pastillas duermo menos de dos horas.',
    'El dolor me impide totalmente dormir.',
  ],

  [
    'Mi actividad sexual es normal y no me causa dolor.',
    'Mi actividad sexual es normal pero me aumenta el dolor.',
    'Mi actividad sexual es casi normal pero muy dolorosa.',
    'Mi actividad sexual se ha visto muy limitada a causa del dolor.',
    'Mi actividad sexual es prácticamente nula por dolor.',
    'El dolor me impide todo tipo de actividad sexual.',
  ],

  [
    'Mi vida social es normal y no me causa dolor.',
    'Mi vida social es normal pero aumenta la intensidad del dolor.',
    'El dolor no tiene ninguna consecuencia en mi vida social, aparte de limitar mis inclinaciones por las actividades físicas más activas.',
    'El dolor ha restringido mi vida social, y no salgo tan a menudo.',
    'El dolor ha restringido mi vida social a mi casa.',
    'No tengo vida social a causa del dolor.',
  ],

  [
    'Puedo viajar a cualquier sitio sin aumento del dolor.',
    'Puedo viajar a cualquier sitio pero aumenta el dolor.',
    'El dolor es intenso pero realizo viajes de más de dos horas.',
    'El dolor me limita a viajes de menos de una hora.',
    'El dolor me limita a viajes cortos y necesarios de menos de media hora.',
    'El dolor me impide todo viaje excepto ir al médico o al hospital.',
  ],
];
  const { id } = useParams<RouteParams>();
  const location = useLocation();

  const [paciente, setPaciente] =
    useState<Patient | null>(null);

  const [seccion, setSeccion] =
    useState<PatientSection>('datos');
    

  const [escalas, setEscalas] =
    useState<PatientScales | null>(null);

  const [mostrarToast, setMostrarToast] =
  useState(false);

const [mostrarEliminar, setMostrarEliminar] =
  useState(false);

const [momentoODI, setMomentoODI] =
  useState<FollowUpMoment>('preoperatorio');
  useEffect(() => {
  const params = new URLSearchParams(
    location.search
  );

  const seccionURL = params.get('seccion');
  const momentoURL = params.get('momento');

  if (
    seccionURL === 'datos' ||
    seccionURL === 'diagnostico' ||
    seccionURL === 'cirugia' ||
    seccionURL === 'escalas' ||
    seccionURL === 'seguimiento'
  ) {
    setSeccion(seccionURL);
  }

  if (
    momentoURL === 'preoperatorio' ||
    momentoURL === 'alta' ||
    momentoURL === '1_mes' ||
    momentoURL === '3_meses' ||
    momentoURL === '6_meses' ||
    momentoURL === '12_meses'
  ) {
    setMomentoODI(momentoURL);
  }
}, [location.search]);
   

     useIonViewWillEnter(() => {
  const encontrado = getPatients().find(
    (item) => item.id === id
  );

  setPaciente(encontrado ?? null);

  if (encontrado) {
    setEscalas(encontrado.escalas);
  }
});
  const cambiarVAS = (
    momento: FollowUpMoment,
    valor: number
  ) => {
    if (!escalas) return;

    setEscalas({
      ...escalas,
      [momento]: {
        ...escalas[momento],
        vas: valor,
      },
    });
  };
const cambiarODI = (
  momento: FollowUpMoment,
  indice: number,
  valor: number
) => {
  if (!escalas) return;

  const nuevasRespuestas = [
    ...escalas[momento].odiRespuestas,
  ];

  nuevasRespuestas[indice] = valor;

  const respondidas = nuevasRespuestas.filter(
    (respuesta) => respuesta !== null
  );

  const suma = respondidas.reduce(
    (total, respuesta) =>
      total + (respuesta ?? 0),
    0
  );

  const porcentaje =
    respondidas.length > 0
      ? Math.round(
          (suma / (respondidas.length * 5)) * 100
        )
      : null;

  setEscalas({
    ...escalas,
    [momento]: {
      ...escalas[momento],
      odiRespuestas: nuevasRespuestas,
      odi: porcentaje,
    },
    });
    };
   const exportarPDF = (anonimizado = false) => {
  if (!paciente || !escalas) return;

  const pdf = new jsPDF();

  const anchoPagina = pdf.internal.pageSize.getWidth();
  const margen = 18;
  const anchoContenido = anchoPagina - margen * 2;

  let y = 18;

  const ocultarIdentidad =
  anonimizado || paciente.ocultarNombre;

const nombrePaciente = ocultarIdentidad
  ? `Paciente ${paciente.id.slice(0, 8)}`
  : paciente.nombre || 'Sin nombre';

  const comprobarPagina = (alturaNecesaria = 10) => {
    if (y + alturaNecesaria > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  const tituloSeccion = (titulo: string) => {
    comprobarPagina(18);

    y += 5;

    pdf.setFillColor(235, 240, 245);
    pdf.roundedRect(
      margen,
      y,
      anchoContenido,
      10,
      2,
      2,
      'F'
    );

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(titulo, margen + 4, y + 7);

    pdf.setFont('helvetica', 'normal');

    y += 16;
  };

  const campo = (
    etiqueta: string,
    valor: string
  ) => {
    comprobarPagina(12);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');

    pdf.text(`${etiqueta}:`, margen, y);

    pdf.setFont('helvetica', 'normal');

    const texto = pdf.splitTextToSize(
      valor || 'No registrado',
      anchoContenido - 40
    );

    pdf.text(texto, margen + 40, y);

    y += Math.max(7, texto.length * 5);
  };

  // CABECERA
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);

  pdf.text(
    'LUQUE SPINE',
    anchoPagina / 2,
    y,
    { align: 'center' }
  );

  y += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  pdf.text(
    'Ficha clínica y seguimiento de columna',
    anchoPagina / 2,
    y,
    { align: 'center' }
  );

  y += 6;

  pdf.setDrawColor(120);
  pdf.line(
    margen,
    y,
    anchoPagina - margen,
    y
  );

  y += 10;

  // DATOS PERSONALES
  tituloSeccion('DATOS DEL PACIENTE');

  campo('Paciente', nombrePaciente);
  campo(
    'Edad',
    paciente.edad
      ? `${paciente.edad} años`
      : 'No registrada'
  );

  campo(
    'Sexo',
    paciente.sexo || 'No registrado'
  );

  if (!ocultarIdentidad) {
    campo(
      'Teléfono',
      paciente.telefono || 'No registrado'
    );
  }

   if (!ocultarIdentidad) {
  campo(
    'Historia clínica',
    paciente.historiaClinica ||
      'No registrada'
  );

  campo(
    'Seguro / OS',
    paciente.seguro || 'No registrado'
  );
}

  // DIAGNÓSTICO
  tituloSeccion('CLÍNICA Y DIAGNÓSTICO');

  campo(
    'Clínica',
    paciente.clinica || 'No registrada'
  );

  campo(
    'TAC',
    paciente.tac || 'No registrada'
  );

  campo(
    'RMN',
    paciente.rmn || 'No registrada'
  );

  campo(
    'Diagnóstico',
    paciente.diagnostico ||
      'No registrado'
  );

  // CIRUGÍA
  tituloSeccion('CIRUGÍA');

  campo(
    'Fecha',
    paciente.fechaCirugia ||
      'No registrada'
  );

  campo(
    'Técnica',
    paciente.tecnica ||
      'No registrada'
  );

  campo(
    'Niveles',
    paciente.niveles ||
      'No registrados'
  );

  // EVOLUCIÓN
  tituloSeccion('EVOLUCIÓN VAS / ODI');

  comprobarPagina(15);

  const xMomento = margen;
  const xVAS = 105;
  const xODI = 145;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);

  pdf.text('Control', xMomento, y);
  pdf.text('VAS', xVAS, y);
  pdf.text('ODI', xODI, y);

  y += 3;

  pdf.line(
    margen,
    y,
    anchoPagina - margen,
    y
  );

  y += 7;

  pdf.setFont('helvetica', 'normal');

  momentos.forEach((momento) => {
    comprobarPagina(10);

    const resultado =
      escalas[momento.key];

    const vas =
      resultado.vas !== null
        ? `${resultado.vas}/10`
        : '-';

    const odi =
      resultado.odi !== null
        ? `${resultado.odi}%`
        : '-';

    pdf.text(
      momento.label,
      xMomento,
      y
    );

    pdf.text(
      vas,
      xVAS,
      y
    );

    pdf.text(
      odi,
      xODI,
      y
    );

    y += 8;
  });

  // PIE
  y += 8;

  comprobarPagina(20);

  pdf.setDrawColor(180);

  pdf.line(
    margen,
    y,
    anchoPagina - margen,
    y
  );

  y += 7;

  pdf.setFontSize(8);

  pdf.text(
    `Generado por Luque Spine · ${new Date().toLocaleDateString()}`,
    margen,
    y
  );

  pdf.text(
    `HC: ${paciente.historiaClinica || '-'}`,
    anchoPagina - margen,
    y,
    { align: 'right' }
  );

  const nombreArchivo =
    paciente.ocultarNombre
      ? `luque-spine-paciente-${paciente.id}.pdf`
      : `luque-spine-${paciente.nombre
          .replace(/\s+/g, '-')
          .toLowerCase()}.pdf`;

  pdf.save(nombreArchivo);
};
  const guardarEscalas = () => {
    if (!paciente || !escalas) return;

    const actualizado = updatePatientScales(
      paciente.id,
      escalas
    );

    if (actualizado) {
      setPaciente(actualizado);
      setEscalas(actualizado.escalas);
      setMostrarToast(true);
    }
  };

  if (!paciente || !escalas) {
    
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/pacientes" />
            </IonButtons>

            <IonTitle>Paciente</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonPage>
    );
  }
const etiquetasSeguimiento = momentos.map(
  (momento) => momento.label
);

const datosVAS = {
  labels: etiquetasSeguimiento,
  datasets: [
    {
      label: 'VAS',
      data: momentos.map(
         (momento) => escalas?.[momento.key].vas ?? null
      ),
      tension: 0.3,
      spanGaps: false,
    },
  ],
};

const datosODI = {
  labels: etiquetasSeguimiento,
  datasets: [
    {
      label: 'ODI (%)',
      data: momentos.map(
         (momento) => escalas?.[momento.key].odi ?? null
      ),
      tension: 0.3,
      spanGaps: false,
    },
  ],
};

const opcionesVAS = {
  responsive: true,
  scales: {
    y: {
      min: 0,
      max: 10,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

   const opcionesGraficoODI = {
  responsive: true,
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
      },
    },
  },
};
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/pacientes" />
          </IonButtons>

          <IonTitle>{paciente.nombre}</IonTitle>
        </IonToolbar>
      </IonHeader>

 <IonContent className="ion-padding">

  <IonButton
    expand="block"
    className="ion-margin-bottom"
    onClick={() => exportarPDF(false)}
  >
    PDF clínico
  </IonButton>

  <IonButton
    expand="block"
    fill="outline"
    className="ion-margin-bottom"
    onClick={() => exportarPDF(true)}
  >
    PDF anonimizado para investigación
  </IonButton>

  <IonButton
    expand="block"
    fill="outline"
    className="ion-margin-bottom"
    routerLink={`/pacientes/${paciente.id}/editar`}
  >
    Editar paciente
  </IonButton>
  <IonButton
  expand="block"
  color="danger"
  fill="outline"
  className="ion-margin-bottom"
  onClick={() => setMostrarEliminar(true)}
>
  Eliminar paciente
</IonButton>
        <IonSegment
          scrollable
          value={seccion}
          onIonChange={(event) =>
            setSeccion(
              event.detail.value as PatientSection
            )
          }
        >
          <IonSegmentButton value="datos">
            <IonLabel>Datos</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="diagnostico">
            <IonLabel>Diagnóstico</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="cirugia">
            <IonLabel>Cirugía</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="escalas">
            <IonLabel>ODI/VAS</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="seguimiento">
            <IonLabel>Seguimiento</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {seccion === 'datos' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Datos personales
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList>

                <IonItem>
                  <IonLabel>
                    <h3>Nombre</h3>
                    <p>{paciente.nombre}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Edad</h3>
                    <p>
                      {paciente.edad
                        ? `${paciente.edad} años`
                        : 'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Sexo</h3>
                    <p>
                      {paciente.sexo ||
                        'No registrado'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Teléfono</h3>
                    <p>
                      {paciente.telefono ||
                        'No registrado'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Historia clínica</h3>
                    <p>
                      {paciente.historiaClinica ||
                        'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Seguro médico / OS</h3>
                    <p>
                      {paciente.seguro ||
                        'No registrado'}
                    </p>
                  </IonLabel>
                </IonItem>

              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {seccion === 'diagnostico' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Clínica y diagnóstico
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <h3>Clínica</h3>
                    <p>
                      {paciente.clinica ||
                        'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <h3>TAC</h3>
                    <p>
                      {paciente.tac ||
                        'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <h3>RMN</h3>
                    <p>
                      {paciente.rmn ||
                        'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <h3>
                      Diagnóstico principal
                    </h3>

                    <p>
                      {paciente.diagnostico ||
                        'No registrado'}
                    </p>
                  </IonLabel>
                </IonItem>

              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {seccion === 'cirugia' && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                Cirugía
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList>

                <IonItem>
                  <IonLabel>
                    <h3>Fecha</h3>
                    <p>
                      {paciente.fechaCirugia ||
                        'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Técnica</h3>
                    <p>
                      {paciente.tecnica ||
                        'No registrada'}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Niveles</h3>
                    <p>
                      {paciente.niveles ||
                        'No registrados'}
                    </p>
                  </IonLabel>
                </IonItem>

              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {seccion === 'escalas' && (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  Escala Visual Analógica (VAS)
                </IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <p>
                  Seleccione la intensidad del dolor
                  entre 0 y 10.
                </p>

                {momentos.map((momento) => {
                  const valor =
                    escalas[momento.key].vas ?? 0;

                  return (
                    <IonItem key={momento.key}>
                      <IonLabel className="ion-text-wrap">
                        <h2>{momento.label}</h2>

                        <p>
                          VAS:{' '}
                          <strong>
                            {escalas[momento.key].vas ??
                              'Sin registrar'}
                          </strong>
                        </p>

                        <IonRange
                          min={0}
                          max={10}
                          step={1}
                          snaps
                          ticks
                          pin
                          value={valor}
                          onIonChange={(event) => {
                            const nuevoValor =
                              Number(
                                event.detail.value
                              );

                            cambiarVAS(
                              momento.key,
                              nuevoValor
                            );
                          }}
                        >
                          <IonLabel slot="start">
                            0
                          </IonLabel>

                          <IonLabel slot="end">
                            10
                          </IonLabel>
                        </IonRange>

                      </IonLabel>
                    </IonItem>
                  );
                })}

                <IonButton
                  expand="block"
                  onClick={guardarEscalas}
                  className="ion-margin-top"
                >
                  Guardar VAS
                </IonButton>

              </IonCardContent>
            </IonCard>

            <IonCard>
  <IonCardHeader>
    <IonCardTitle>
      Oswestry Disability Index (ODI)
    </IonCardTitle>
  </IonCardHeader>

  <IonCardContent>

    <IonItem>
      <IonLabel>Momento del control</IonLabel>

      <IonSelect
        value={momentoODI}
        onIonChange={(event) =>
          setMomentoODI(
            event.detail.value as FollowUpMoment
          )
        }
      >
        {momentos.map((momento) => (
          <IonSelectOption
            key={momento.key}
            value={momento.key}
          >
            {momento.label}
          </IonSelectOption>
        ))}
      </IonSelect>
    </IonItem>

     <div className="ion-padding-top">
  <h2>
    ODI:{' '}
    {escalas[momentoODI].odi !== null
      ? `${escalas[momentoODI].odi}%`
      : 'Sin completar'}
  </h2>

  {escalas[momentoODI].odi !== null && (
    <h3>
      {escalas[momentoODI].odi <= 20
        ? 'Discapacidad mínima'
        : escalas[momentoODI].odi <= 40
        ? 'Discapacidad moderada'
        : escalas[momentoODI].odi <= 60
        ? 'Discapacidad severa'
        : escalas[momentoODI].odi <= 80
        ? 'Discapacidad muy severa'
        : 'Limitación funcional extrema'}
    </h3>
  )}

  <p>
    Secciones respondidas:{' '}
    <strong>
      {
        escalas[momentoODI].odiRespuestas.filter(
          (respuesta) => respuesta !== null
        ).length
      }
      /10
    </strong>
  </p>

  <p>
    Seleccione una puntuación de 0 a 5
    para cada sección.
  </p>
</div>

    <IonList>
      {seccionesODI.map((titulo, indice) => (
        <IonItem key={titulo}>
          <IonLabel className="ion-text-wrap">
            <h3>
              {indice + 1}. {titulo}
            </h3>
          </IonLabel>

          <IonSelect
            aria-label={titulo}
            placeholder="Elegir"
            value={
              escalas[momentoODI]
                .odiRespuestas[indice] ?? undefined
            }
            onIonChange={(event) =>
              cambiarODI(
                momentoODI,
                indice,
                Number(event.detail.value)
              )
            }
          >
            {opcionesODI[indice].map(
  (texto, puntuacion) => (
    <IonSelectOption
      key={puntuacion}
      value={puntuacion}
    >
      {puntuacion} — {texto}
    </IonSelectOption>
  )
)}
          </IonSelect>
        </IonItem>
      ))}
    </IonList>

    <IonButton
      expand="block"
      onClick={guardarEscalas}
      className="ion-margin-top"
    >
      Guardar ODI
    </IonButton>

  </IonCardContent>
</IonCard>
          </>
        )}

         {seccion === 'seguimiento' && (
  <IonCard>
    <IonCardHeader>
      <IonCardTitle>
        Evolución clínica
      </IonCardTitle>
    </IonCardHeader>

    <IonCardContent>
      <p>
        Resumen longitudinal de VAS y ODI.
      </p>

      <IonList>
        {momentos.map((momento) => {
          const resultado = escalas[momento.key];

          return (
            <IonItem key={momento.key}>
              <IonLabel className="ion-text-wrap">
                <h2>{momento.label}</h2>

                <p>
                  VAS:{' '}
                  <strong>
                    {resultado.vas !== null
                      ? `${resultado.vas}/10`
                      : 'Sin registrar'}
                  </strong>
                </p>

                <p>
                  ODI:{' '}
                  <strong>
                    {resultado.odi !== null
                      ? `${resultado.odi}%`
                      : 'Sin registrar'}
                  </strong>
                </p>
              </IonLabel>
            </IonItem>
          );
        })}
      </IonList>
      <h2 className="ion-margin-top">
  Evolución VAS
</h2>

  <div
  style={{
    width: '100%',
     maxWidth: '1200px',
     height: '380px',
    margin: '0 auto 32px auto',
  }}
>
  <Line
    data={datosVAS}
    options={opcionesVAS}
  />
</div>
<h2 className="ion-margin-top">
  Evolución ODI
</h2>

  <div
  style={{
    width: '100%',
    maxWidth: '1200px',
    height: '380px',
    margin: '0 auto 32px auto',
  }}
>
   <Line
  data={datosODI}
  options={opcionesGraficoODI}
/>
</div>
    </IonCardContent>
  </IonCard>
)}

        <IonToast
          isOpen={mostrarToast}
          message="VAS guardado correctamente"
          duration={1800}
          onDidDismiss={() =>
            setMostrarToast(false)
          }
        />
<IonAlert
  isOpen={mostrarEliminar}
  header="Eliminar paciente"
  message="¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer."
  buttons={[
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        setMostrarEliminar(false);
      },
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => {
        deletePatient(paciente.id);
        setMostrarEliminar(false);
        window.location.href = '/pacientes';
      },
    },
  ]}
  onDidDismiss={() => setMostrarEliminar(false)}
/>
     </IonContent>
    </IonPage>
  );
};

export default PatientDetailPage;