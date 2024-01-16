import React from 'react';
import { Cell, PieChart, Pie, Tooltip } from 'recharts';
import styled from 'styled-components';
import { formatEther } from 'viem';
import { useTranslation } from 'react-i18next';
import { formatBytesWithLabel } from 'utilities/helpers';
import {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { Tooltip as ReactTooltip } from 'react-tooltip';

// import ProgressBar from './ProgressBar';

const ChartArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: row;
`;

const Label = styled.div`
  color: var(--font-color);
  font-weight: 600;
`;

const DataText = styled.div`
  color: var(--caption);
  font-weight: 600;
`;

const InfoText = styled.span`
  margin-top: 4px;
  color: var(--caption);
  font-weight: 600;
`;

const ProgressChart = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 8px;
`;

const MultiProgress = styled.span`
  background-color: #f5f5f5;
  height: 16px;
  display: flex;
  border-radius: 8px;
`;

const ProgressBar = styled.span<{
  progress: number;
  bgcolor: string;
  // mLeft: boolean;
  // borderStart: boolean;
  // borderEnd: boolean;
}>`
  background-color: #ff000;
  height: 16px;
  display: flex;
  border-radius: 8px;

  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.bgcolor};
`;

// border-top-left-radius: ${(props) => (props.borderStart ? '8px' : '0px')};
// border-bottom-left-radius: ${(props) => (props.borderStart ? '8px' : '0px')};
// border-top-right-radius: ${(props) => (props.borderEnd ? '8px' : '0px')};
// border-bottom-right-radius: ${(props) => (props.borderEnd ? '8px' : '0px')};
// margin-left: ${(props) => (props.mLeft ? '2px' : '0px')};

function formatValue(
  value: ValueType,
  props: Payload<ValueType, NameType>,
): string {
  switch (props.dataKey) {
    case 'RBP':
      return formatBytesWithLabel(Number(value));
    case 'Tokens':
      return `${formatEther(BigInt(value.toString())).slice(0, 8)} $FIL`;
    case 'Miner Tokens':
      return `${formatEther(BigInt(value.toString())).slice(0, 8)} $FIL`;
    default:
      return '';
  }
}

function MultipleChart({
  rbpData,
  totalRbp,
  tokenData,
  totalTokens,
  minerTokenData,
  totalMinerTokens,
}: {
  rbpData: { [key: string]: string | number }[];
  totalRbp: number;
  tokenData: { [key: string]: string | number }[];
  totalTokens: number;
  minerTokenData: { [key: string]: string | number }[];
  totalMinerTokens: number;
}) {
  const { t } = useTranslation();

  const bgColor = [
    '#3584c4',
    '#42a5f5',
    '#68b7f7',
    '#324191',
    '#3f51b5',
    '#6574c4',
    '#c3362b',
    '#f44336',
    '#f6695e',
    '#a79dba',
    '#d1c4e9',
    '#dad0ed',
  ];

  const calculateNumber = () => {
    let result = 0;
    if (totalRbp > 0) result += 1;
    if (totalTokens > 0) result += 1;
    if (totalMinerTokens > 0) result += 1;
    return result;
  };

  return (
    <ChartArea>
      <ProgressChart>
        {rbpData.map((item: any, index: number) => (
          <div style={{ marginTop: '8px' }}>
            <div>{item.name}</div>
            <MultiProgress>
              {totalRbp > 0 && (
                <ProgressBar
                  data-tooltip-id={`my-tooltip-${3 * index + 0}`}
                  progress={
                    Math.round(((item.RBP as number) / totalRbp) * 100) /
                    calculateNumber()
                  }
                  bgcolor={bgColor[3 * index + 0]}
                />
              )}
              <ProgressBar
                data-tooltip-id={`my-tooltip-${3 * index + 1}`}
                progress={
                  Math.round(
                    ((tokenData[index].Tokens as number) / totalTokens) * 100,
                  ) / calculateNumber()
                }
                bgcolor={bgColor[3 * index + 1]}
              />
              <ProgressBar
                data-tooltip-id={`my-tooltip-${3 * index + 2}`}
                progress={
                  Math.round(
                    ((minerTokenData[index]['Miner Tokens'] as number) /
                      totalMinerTokens) *
                      100,
                  ) / calculateNumber()
                }
                bgcolor={bgColor[3 * index + 2]}
              />
            </MultiProgress>
            <ReactTooltip
              id={`my-tooltip-${3 * index + 0}`}
              place='bottom'
              style={{ backgroundColor: bgColor[3 * index + 0] }}
              content={`RBP: ${formatBytesWithLabel(Number(item.RBP))}`}
            />
            <ReactTooltip
              id={`my-tooltip-${3 * index + 1}`}
              place='bottom'
              style={{ backgroundColor: bgColor[3 * index + 1] }}
              content={`Tokens: ${formatEther(
                BigInt(tokenData[index].Tokens.toString()),
              ).slice(0, 8)} $FIL`}
            />
            <ReactTooltip
              id={`my-tooltip-${3 * index + 2}`}
              place='bottom'
              style={{ backgroundColor: bgColor[3 * index + 2] }}
              content={`Miner Tokens: ${formatEther(
                BigInt(minerTokenData[index]['Miner Tokens'].toString()),
              ).slice(0, 8)} $FIL`}
            />
          </div>
        ))}
      </ProgressChart>
    </ChartArea>
  );
}

export default MultipleChart;
