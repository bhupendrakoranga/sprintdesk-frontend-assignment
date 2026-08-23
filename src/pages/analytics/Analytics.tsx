import { Suspense } from 'react';
import AnalyticsPage from '../../features/analytics/AnalyticsPage'

const Analytics = () => {
  return (
    <Suspense>
      <AnalyticsPage />
    </Suspense>
  );
}

export default Analytics
