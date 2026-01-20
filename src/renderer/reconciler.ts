/**
 * React Reconciler setup
 */

import Reconciler from 'react-reconciler';
import { hostConfig } from './hostConfig';

// Type assertion needed because HostConfig type signature varies by react-reconciler version
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reconciler = Reconciler(hostConfig as any);
