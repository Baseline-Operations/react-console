/**
 * React Reconciler setup
 * Gets host config from Node class (integrated into node structure)
 */

import Reconciler from 'react-reconciler';
import { Node } from '../nodes/base/Node';

// Type assertion needed because HostConfig type signature varies by react-reconciler version
// react-reconciler's HostConfig generic parameters are complex and change between versions
export const reconciler = Reconciler(
  Node.createHostConfig() as Reconciler.HostConfig<
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
