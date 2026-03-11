import type { VisualType } from '../types';
import type { ComponentType } from 'react';
import {
  NumberLine,
  Dice,
  CoinDisplay,
  MatchingPairs,
  BarChart,
  BlockChart,
  TallyChart,
  OptionFill,
  MissingDigits,
  CalculationChoices,
  ItemList,
  NumberPattern,
  ObjectArray,
  FractionOfSet,
  Spinner,
  ShapeGrid,
  ShapeClassify,
  CountObjects,
  WeightScale,
  ClockFace,
} from './index';

export interface RendererProps {
  config: unknown;
  width?: number;
  className?: string;
}

/** Registry: visual_type → component. Add new types here. */
export const VISUAL_RENDERERS: Partial<Record<VisualType, ComponentType<RendererProps>>> = {
  number_line: NumberLine as ComponentType<RendererProps>,
  dice: Dice as ComponentType<RendererProps>,
  coin_display: CoinDisplay as ComponentType<RendererProps>,
  matching_pairs: MatchingPairs as ComponentType<RendererProps>,
  bar_chart: BarChart as ComponentType<RendererProps>,
  block_chart: BlockChart as ComponentType<RendererProps>,
  tally_chart: TallyChart as ComponentType<RendererProps>,
  option_fill: OptionFill as ComponentType<RendererProps>,
  missing_digits: MissingDigits as ComponentType<RendererProps>,
  calculation_choices: CalculationChoices as ComponentType<RendererProps>,
  item_list: ItemList as ComponentType<RendererProps>,
  number_pattern: NumberPattern as ComponentType<RendererProps>,
  object_array: ObjectArray as ComponentType<RendererProps>,
  fraction_of_set: FractionOfSet as ComponentType<RendererProps>,
  spinner: Spinner as ComponentType<RendererProps>,
  shape_grid: ShapeGrid as ComponentType<RendererProps>,
  shape_classify: ShapeClassify as ComponentType<RendererProps>,
  count_objects: CountObjects as ComponentType<RendererProps>,
  weight_scale: WeightScale as ComponentType<RendererProps>,
  clock_face: ClockFace as ComponentType<RendererProps>,
};
