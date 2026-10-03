import { RoleGate } from '@/src/app/navigation/RoleGate';
import { AssignedWorkScreen } from '@/src/features/assignments/screens/AssignedWorkScreen';
export default function AssignmentsRoute() { return <RoleGate roles={['USER']}><AssignedWorkScreen /></RoleGate>; }
