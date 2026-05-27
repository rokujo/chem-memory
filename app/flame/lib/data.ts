import type { Flame } from '../types';

export const FLAMES: Flame[] = [
  {
    id: 'li',
    symbol: 'Li',
    name: 'リチウム',
    color: '赤色',
    display_color: '赤色',
    note: '深赤の炎。Srの紅色との区別がやや難しい',
    level: 1,
  },
  {
    id: 'na',
    symbol: 'Na',
    name: 'ナトリウム',
    color: '黄色',
    display_color: '黄色',
    note: 'ナトリウムランプの黄色。最も特徴的・微量でも強く発光',
    level: 1,
  },
  {
    id: 'k',
    symbol: 'K',
    name: 'カリウム',
    color: '赤紫色',
    display_color: '赤紫色',
    note: 'コバルトガラス越しに見ると赤紫が確認しやすい(Naの黄を遮断)',
    level: 1,
  },
  {
    id: 'ca',
    symbol: 'Ca',
    name: 'カルシウム',
    color: '橙色',
    display_color: '橙赤色',
    note: '橙赤の炎。花火の橙色',
    level: 1,
  },
  {
    id: 'sr',
    symbol: 'Sr',
    name: 'ストロンチウム',
    color: '紅色',
    display_color: '紅色',
    note: '紅色(深赤)。Liの赤との区別がポイント。花火の赤',
    level: 1,
  },
  {
    id: 'ba',
    symbol: 'Ba',
    name: 'バリウム',
    color: '黄緑色',
    display_color: '黄緑色',
    note: '黄緑色。花火の緑',
    level: 1,
  },
  {
    id: 'cu',
    symbol: 'Cu',
    name: '銅',
    color: '青緑色',
    display_color: '青緑色',
    note: '青緑色。花火の青〜緑',
    level: 1,
  },
];

export function findById(id: string): Flame | undefined {
  return FLAMES.find(f => f.id === id);
}
