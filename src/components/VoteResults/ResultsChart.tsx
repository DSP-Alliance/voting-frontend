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

const ChartArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

function ResultsChart({
  data,
  totalCount,
  type,
  winning,
}: {
  data: { [key: string]: string | number }[];
  totalCount: number;
  type: string;
  winning: string;
}) {
  const { t } = useTranslation();
  return (
    <ChartArea>
      <PieChart width={280} height={280}>
        <Tooltip
          separator=': '
          formatter={(value, name, props) => [formatValue(value, props), name]}
        />
        <Pie
          data={data}
          dataKey={type}
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={0}
          outerRadius={100}
        >
          {data.map((entry: any, index: number) => (
            <Cell key={index} fill={`var(--votecount${index}`} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <Legend>
        <div>
          <span>
            <Label>{type}</Label>
            <InfoText>
              {t('winning_upper')}: {winning || '-'}
            </InfoText>
            <br />
            <DataText>
              {t('total_upper')}:{' '}
              <InfoText>
                {formatValue(totalCount, { dataKey: type }) || '-'}
              </InfoText>
            </DataText>
          </span>
        </div>
      </Legend>
    </ChartArea>
  );
}

export default ResultsChart;
