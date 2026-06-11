import { Card, CardBody, CardHeader, Badge, Heading, Text } from '@/shared';

interface HealthStatusCardProps {
  status: 'ok' | 'degraded';
  database: 'connected' | 'disconnected';
  timestamp: string;
}

export function HealthStatusCard({ status, database, timestamp }: HealthStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Heading size="lg" as="h2">Estado del sistema</Heading>
          <Badge variant={status === 'ok' ? 'success' : 'warning'}>
            {status === 'ok' ? 'Operativo' : 'Degradado'}
          </Badge>
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        <div className="flex items-center justify-between">
          <Text as="span" variant="secondary">Base de datos</Text>
          <Badge variant={database === 'connected' ? 'success' : 'error'}>
            {database === 'connected' ? 'Conectada' : 'Desconectada'}
          </Badge>
        </div>
        <Text variant="muted">
          Última verificación: {new Date(timestamp).toLocaleString('es-ES')}
        </Text>
      </CardBody>
    </Card>
  );
}
