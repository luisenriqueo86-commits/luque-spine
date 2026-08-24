import {
  IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar,
  IonTabButton, IonTabs, setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { homeOutline, peopleOutline, settingsOutline } from 'ionicons/icons';

import ResearchProjectDetailPage from './pages/ResearchProjectDetailPage';
import HomePage from './pages/HomePage';
import PatientsPage from './pages/PatientsPage';
import PatientFormPage from './pages/PatientFormPage';
import SettingsPage from './pages/SettingsPage';
import PatientDetailPage from './pages/PatientDetailPage';
import ResearchPage from './pages/ResearchPage';
import PatientStatisticsPage from './pages/PatientStatisticsPage';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import './theme/app.css';

setupIonicReact();

 const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>

          <Route exact path="/inicio">
            <HomePage />
          </Route>

          <Route exact path="/pacientes">
            <PatientsPage />
          </Route>

          <Route exact path="/nuevo-paciente">
            <PatientFormPage />
          </Route>

          <Route exact path="/estadisticas">
            <PatientStatisticsPage />
          </Route>

          <Route exact path="/pacientes/:id/editar">
            <PatientFormPage />
          </Route>

          <Route exact path="/pacientes/:id">
            <PatientDetailPage />
          </Route>

          <Route exact path="/investigacion">
            <ResearchPage />
          </Route>

          <Route exact path="/investigacion/:id">
            <ResearchProjectDetailPage />
          </Route>

          <Route exact path="/ajustes">
            <SettingsPage />
          </Route>

          <Route exact path="/">
            <Redirect to="/inicio" />
          </Route>

        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="inicio" href="/inicio">
            <IonIcon icon={homeOutline} />
            <IonLabel>Inicio</IonLabel>
          </IonTabButton>
          <IonTabButton tab="pacientes" href="/pacientes">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Pacientes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="ajustes" href="/ajustes">
            <IonIcon icon={settingsOutline} />
            <IonLabel>Ajustes</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
