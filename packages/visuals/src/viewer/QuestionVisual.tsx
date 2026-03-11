import type { ComponentType } from 'react';
import type { QuestionVisualProps, VisualType } from '../types';
import type { RendererProps } from '../renderers/registry';
import { VISUAL_RENDERERS } from '../renderers/registry';

export function QuestionVisual<T extends VisualType>({
  visualType,
  visualConfig,
  width,
  className,
}: QuestionVisualProps<T>) {
  if (visualType === 'none') {
    return null;
  }

  const Renderer = VISUAL_RENDERERS[visualType] as ComponentType<RendererProps> | undefined;
  if (!Renderer) {
    return null;
  }

  const props: RendererProps = {
    config: visualConfig as unknown,
    width,
    className,
  };
  return <Renderer {...props} />;
}
