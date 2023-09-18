import axios from 'axios';
import MarkdownIt from 'markdown-it';

import type { FipData } from 'components/FIPInfo';

export async function getFip(num: number) {
  const md = new MarkdownIt();

  const formatNum = num.toLocaleString(undefined, {
    minimumIntegerDigits: 4,
    useGrouping: false,
  });

  const res = await axios.get(
    `https://raw.githubusercontent.com/filecoin-project/FIPs/master/FIPS/fip-${formatNum}.md`,
  );

  const parsedResponse = md.parse(res.data, {})[2].children;

  const fipData: FipData = {} as FipData;

  parsedResponse?.map((child: any) => {
    const splitContent = child.content.split(': ');
    if (splitContent[0])
      fipData[splitContent[0] as keyof FipData] = splitContent[1];
  });

  return fipData;
}
