/**
 * React Reconciler setup
 * Gets host config from Node class (integrated into node structure)
 */

import Reconciler from 'react-reconciler';
import { Node } from '../nodes/base/Node';

// Type assertion needed because HostConfig type signature varies by react-reconciler version
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reconciler = Reconciler(Node.createHostConfig() as any);
