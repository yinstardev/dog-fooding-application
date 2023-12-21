import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createComponent } from '@lit-labs/react';
import { hToMS, msToH } from '@app/utils/utils';
import * as S from './NightTimeSlider.styles';

interface NightTimeSliderProps {
  from: number;
  to: number;
  setNightTime: (nightTime: number[]) => void;
}

export const NightTimeSlider: React.FC<NightTimeSliderProps> = ({ from, to, setNightTime }) => {
  const [fromValue, setFromValue] = useState(msToH(from));
  const [toValue, setToValue] = useState(msToH(to));

  const { t } = useTranslation();

  return (
    <>
      <S.Wrapper></S.Wrapper>
    </>
  );
};
