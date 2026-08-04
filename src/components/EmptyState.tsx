import { IonIcon } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => (
  <div className="empty-state">
    <IonIcon icon={personCircleOutline} className="empty-state__icon" />
    <h2>{title}</h2>
    <p>{message}</p>
  </div>
);

export default EmptyState;
