/**
 * React Reconciler setup
 * Uses host config from HostConfig.ts
 */

import Reconciler from 'react-reconciler';
import { createHostConfig } from './HostConfig';
import type { Node } from '../nodes/base/Node';

// Type assertion needed because HostConfig type signature varies by react-reconciler version
// react-reconciler's HostConfig generic parameters are complex and change between versions
export const reconciler = Reconciler(
  createHostConfig() as Reconciler.HostConfig<
    string, // Type
    Record<string, unknown>, // Props
    Node, // Container
    Node, // Instance
    Node, // TextInstance
    Node, // SuspenseInstance
    Node, // HydratableInstance
    Node, // PublicInstance
    object, // HostContext
    unknown[], // UpdatePayload
    unknown, // ChildSet
    number, // TimeoutHandle
    number // NoTimeout
  >
);
