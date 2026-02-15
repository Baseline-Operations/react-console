/**
 * Link node - interactive text that opens URL in default browser on activate.
 * Extends Interactive(TextNode) for focus/click; wraps output in OSC 8 when href set.
 * Cross-compatible: Tab to focus, Enter or click to open URL (no terminal OSC 8 required).
 */

import type { OutputBuffer } from '../base/mixins';
import type { KeyboardEvent, MouseEvent } from '../base/mixins/Interactive';
import type { Constructor } from '../base/types';
import type { Node } from '../base/Node';
import { Interactive } from '../base/mixins/Interactive';
import { TextNode } from './TextNode';
import { wrapHyperlink } from '../../renderer/ansi';
import { openUrl } from '../../utils/openUrl';

const InteractiveTextNodeBase = Interactive(TextNode as unknown as Constructor<Node>);

export class LinkNode extends InteractiveTextNodeBase {
  private href: string = '';

  getNodeType(): string {
    return 'link';
  }

  setHref(url: string): void {
    this.href = url ?? '';
    this.onClick = () => {
      if (!this.disabled && this.href) openUrl(this.href);
    };
    this.onPress = undefined;
  }

  override handleClick(_event: MouseEvent): void {
    if (this.disabled || !this.href) return;
    openUrl(this.href);
  }

  override handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key.return && this.href) {
      openUrl(this.href);
      return;
    }
    super.handleKeyboardEvent(event);
  }

  protected override setBufferLine(buffer: OutputBuffer, y: number, content: string): void {
    if (this.href) {
      buffer.lines[y] = wrapHyperlink(this.href, content);
    } else {
      super.setBufferLine(buffer, y, content);
    }
  }
}
