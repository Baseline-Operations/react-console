/**
 * Modal component - layered rendering (React Native compatible)
 * Like modals, popups, dialogs, etc.
 */

import type { ReactNode } from 'react';
import type { LayoutProps, StyleProps, ViewStyle } from '../../types';
import { createConsoleNode, mergeClassNameAndStyle } from '../utils';

/**
 * Props for the Modal component (React Native compatible)
 *
 * Provides modal/popup functionality with layering and backdrop support.
 * Modals render on top of other content with configurable z-index.
 *
 * @example
 * ```tsx
 * <Modal visible={isVisible} onRequestClose={() => setIsVisible(false)}>
 *   <View style={styles.modalContent}>
 *     <Text>Modal Content</Text>
 *     <Button onPress={() => setIsVisible(false)}>Close</Button>
 *   </View>
 * </Modal>
 * ```
 */
export interface ModalProps extends LayoutProps, StyleProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[]; // CSS-like style (similar to React Native)

  // React Native compatible props
  /** Whether the modal is visible (React Native compatible) */
  visible?: boolean;
  /** Animation type - 'none' | 'slide' | 'fade' (React Native compatible, animations may be limited in terminal) */
  animationType?: 'none' | 'slide' | 'fade';
  /** Whether the modal is transparent (React Native compatible) */
  transparent?: boolean;
  /** Callback when the user requests to close the modal (back button, escape key) */
  onRequestClose?: () => void;
  /** Callback when modal is shown (React Native compatible) */
  onShow?: () => void;
  /** Callback when modal is dismissed (React Native compatible) */
  onDismiss?: () => void;
  /** Presentation style (React Native compatible) */
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  /** Whether hardware accelerated (ignored in terminal) */
  hardwareAccelerated?: boolean;
  /** Status bar translucent (ignored in terminal) */
  statusBarTranslucent?: boolean;

  // Terminal-specific props
  /** Z-index for layering (higher = on top, default: 1000) */
  zIndex?: number;
  /** Show backdrop behind modal (default: true when visible) */
  backdrop?: boolean;
  /** Backdrop color (default: semi-transparent or terminal default) */
  backdropColor?: string;
  /** Close modal when backdrop is pressed/clicked */
  closeOnBackdropPress?: boolean;
}

/**
 * Modal component - Layered rendering for modals and dialogs
 *
 * React Native compatible modal component. Provides modal/popup functionality
 * with layering support. Modals render on top of other content with configurable
 * z-index and optional backdrop. Supports Escape key to close (triggers onRequestClose).
 *
 * @param props - Modal component props
 * @returns React element representing a modal container
 *
 * @example
 * ```tsx
 * const [visible, setVisible] = useState(false);
 *
 * <Modal
 *   visible={visible}
 *   onRequestClose={() => setVisible(false)}
 *   transparent
 * >
 *   <View style={styles.centeredView}>
 *     <View style={styles.modalView}>
 *       <Text>Hello World!</Text>
 *       <Pressable onPress={() => setVisible(false)}>
 *         <Text>Hide Modal</Text>
 *       </Pressable>
 *     </View>
 *   </View>
 * </Modal>
 * ```
 */
export function Modal({
  children,
  visible = true,
  animationType = 'none',
  transparent = false,
  onRequestClose,
  onShow,
  onDismiss,
  presentationStyle,
  hardwareAccelerated: _hardwareAccelerated,
  statusBarTranslucent: _statusBarTranslucent,
  zIndex = 1000,
  backdrop,
  backdropColor,
  closeOnBackdropPress = true,
  className,
  style,
  ...props
}: ModalProps) {
  // Don't render if not visible
  if (!visible) {
    return null;
  }

  // Merge className with style prop and legacy props
  const mergedStyle = mergeClassNameAndStyle(className, style, props);

  // Default backdrop to true for modals (unlike raw overlay)
  const showBackdrop = backdrop ?? true;

  return createConsoleNode('modal', {
    zIndex,
    backdrop: showBackdrop,
    backdropColor: transparent ? undefined : backdropColor,
    transparent,
    animationType,
    presentationStyle,
    onRequestClose,
    onShow,
    onDismiss,
    closeOnBackdropPress,
    style: mergedStyle as ViewStyle,
    layout: mergedStyle as LayoutProps,
    styles: mergedStyle,
    children,
  });
}

// Backwards compatibility alias
/** @deprecated Use Modal instead */
export const Overlay = Modal;
/** @deprecated Use ModalProps instead */
export type OverlayProps = ModalProps;
