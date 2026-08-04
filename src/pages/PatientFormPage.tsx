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
} from '@ionic/react';

const PatientFormPage: React.FC = () => {
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
            />
          </IonItem>

          <IonItem>
            <IonCheckbox slot="start" />
            <IonLabel>Ocultar nombre en informes de investigación</IonLabel>
          </IonItem>

          <IonItem>
            <IonInput
              label="Edad"
              labelPlacement="stacked"
              type="number"
              placeholder="Ejemplo: 58"
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="Sexo"
              labelPlacement="stacked"
              placeholder="Seleccione"
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
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Historia clínica"
              labelPlacement="stacked"
              placeholder="Número de ficha"
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Seguro médico / OS"
              labelPlacement="stacked"
              placeholder="Nombre del seguro"
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
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Diagnóstico por TAC"
              labelPlacement="stacked"
              placeholder="Hallazgos tomográficos"
              autoGrow
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Diagnóstico por RMN"
              labelPlacement="stacked"
              placeholder="Hallazgos de resonancia"
              autoGrow
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Diagnóstico principal"
              labelPlacement="stacked"
              placeholder="Ejemplo: estenosis lumbar L4-L5"
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
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Técnica quirúrgica"
              labelPlacement="stacked"
              placeholder="Ejemplo: TLIF MIS"
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Niveles"
              labelPlacement="stacked"
              placeholder="Ejemplo: L4-L5"
            />
          </IonItem>
        </IonList>

        <IonButton expand="block" size="large">
          Guardar paciente
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PatientFormPage;