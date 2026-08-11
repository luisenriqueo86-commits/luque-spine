 import {
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
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  FollowUpMoment,
  Patient,
  PatientScales,
} from '../models/patient';

import {
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
  const { id } = useParams<RouteParams>();

  const [paciente, setPaciente] =
    useState<Patient | null>(null);

  const [seccion, setSeccion] =
    useState<PatientSection>('datos');

  const [escalas, setEscalas] =
    useState<PatientScales | null>(null);

  const [mostrarToast, setMostrarToast] =
    useState(false);
  const [momentoODI, setMomentoODI] =
   useState<FollowUpMoment>('preoperatorio');

    useEffect(() => {
    const encontrado = getPatients().find(
      (item) => item.id === id
    );

    setPaciente(encontrado ?? null);

    if (encontrado) {
      setEscalas(encontrado.escalas);
    }
  }, [id]);

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

        <IonContent className="ion-padding">
          <h2>Paciente no encontrado</h2>
        </IonContent>
      </IonPage>
    );
  }

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
            <IonSelectOption value={0}>
              0
            </IonSelectOption>

            <IonSelectOption value={1}>
              1
            </IonSelectOption>

            <IonSelectOption value={2}>
              2
            </IonSelectOption>

            <IonSelectOption value={3}>
              3
            </IonSelectOption>

            <IonSelectOption value={4}>
              4
            </IonSelectOption>

            <IonSelectOption value={5}>
              5
            </IonSelectOption>
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
                Seguimiento
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              Aquí registraremos alta, 1, 3, 6 y
              12 meses.
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

      </IonContent>
    </IonPage>
  );
};

export default PatientDetailPage;