import type { OrderStatus } from '../../types';
import { orderStatusMeta } from '../../types';
import { Badge } from '../ui/Badge';

type Props = {
  status: OrderStatus;
};

export function StatusBadge({ status }: Props) {
  const meta = orderStatusMeta[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
