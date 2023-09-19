import axios from 'axios';
import MarkdownIt from 'markdown-it';
export interface FipData {
  author?: string;
  category?: string;
  created?: string;
  'discussions-to'?: string;
  fip?: string;
  status?: string;
  title?: string;
  type?: string;
}

async function getFipList() {
  const res = await axios.get(
    `https://raw.githubusercontent.com/filecoin-project/FIPs/master/FIPS`,
  );

  console.log(res.data);
}

async function getFip(num: number) {
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

const fipService = { getFipList, getFip };

export default fipService;
